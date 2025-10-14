//let wnd = require('@core/Window');
let Templates = require('@core/Templates');
let Tabs = require('@core//components/Tabs');
let OutfitCard = require('@core//components/OutfitCard');

module.exports = function() {

    const moduleData = {
        fileName: "ChangeOutfit"
    };

    //let showCard = 0;
    let chooseOutfit = null;

    let outfitCards = [];

    let animX = {
        your: null,
        preview: null
    };

    let animY = {
        your: null,
        preview: null
    };

    let maxFrame = 4;

    // let animX = [0, -32, -64, -96];
    // let animY = [0, -48, -96, -144];

    let repeat = false;
    let animInterval = null;

    let animPos = {
        x: 0,
        y: 0
    };

    const SETTINGS_DATA = {
        DEFAULT: "DEFAULT",
        EQ: "EQ"
    }

    let yourLoaded = false;
    let previewLoaded = false;

    let allIntervals = {};

    this.init = () => {
        this.initWindow();
        this.initCards();
        this.initSaveButton();
        this.initScrollBar();
        this.initYourOutfit();
        this.initAnimUpdate();
        this.initFetch();
        this.initLabels();
    };

    this.initLabels = () => {
        this.wnd.$.find('.your-outfit').find('.outfit-header').html(_t('your_outfit'));
        this.wnd.$.find('.preview-outfit').find('.outfit-header').html(_t('preview_outfit'));
    };

    this.initYourOutfit = () => {
        let patch = CFG.a_opath + '/' + Engine.hero.d.img;
        let $el = this.wnd.$.find('.your-outfit').find('.outfit-graphic');
        this.setOutfitInPreview($el, patch, 'your');
    };

    this.initFetch = () => {
        //Engine.items.fetch('g', this.newOutfitItem);
        Engine.items.fetch(Engine.itemsFetchData.NEW_OUTFIT_ITEM, this.newOutfitItem);
    };

    this.prepareData = (i) => {
        //let relativeUrl = i._cachedStats.outfit.split(',')[1];
        let outfitStat = i.getOutfitStat();
        let relativeUrl = outfitStat.split(',')[1];

        let data = {
            requirements: {},
            relativeUrl: relativeUrl
        };

        //if (i._cachedStats.lvl) data.requirements.level = i._cachedStats.lvl;
        if (i.getLvlStat()) {
            data.requirements.level = i.getLvlStat();
        }

        //if (i._cachedStats.timelimit) {
        if (i.issetTimelimitStat()) {
            //let d = i._cachedStats.timelimit.split(',');
            let timelimitStat = i.getTimelimitStat();
            let d = timelimitStat.split(',');
            if (d[1]) {
                let timelimit = d[1];

                let min = this.getMinutes(timelimit);
                if (min > -1) {

                    data.requirements.timelimit = {
                        id: i.id,
                        timelimit: timelimit
                    };

                    this.addInterval(i, timelimit, data.requirements.level);
                }
            }
        }

        return data;
    };

    this.newOutfitItem = (i, finish) => {
        //if (!i._cachedStats.outfit) return;
        if (!i.issetOutfitStat()) {
            return;
        }

        let data = this.prepareData(i);

        //let $one = this.createOneOutfit(data, i);
        let $one = this.createOneOutfit(data, i);
        this.wnd.$.find('.equip-section').find('.scroll-pane').append($one);

        this.checkOutfitIsYourOutfit($one.find('.outfit-border'), data.relativeUrl);

        i.on('delete', function() {
            $one.remove();
            clearInterval(allIntervals[i.id]);
            delete allIntervals[i.id];
        });
        i.on('afterUpdate', function() {
            this.setAmount(i, $one);
        }.bind(this));
        this.wnd.$.find('.empty-info').css('display', 'none')
    };

    this.getMinutes = (timelimit) => {
        return Math.floor((parseInt(timelimit) - unix_time()) / 60);
    };

    this.addInterval = (i, timelimit, level) => {

        let id = i.id;

        allIntervals[id] = setInterval(() => {

            let outfitCard = getOutfitCardById(id);

            if (!outfitCard) {
                errorReport(moduleData.fileName, "addInterval", "outfitCard not exist", id);
                return
            }

            let min = this.getMinutes(timelimit);
            if (min < 0) {
                clearInterval(allIntervals[id]);
                delete allIntervals[id];
                //this.wnd.$.find('.outfit-item-id-' + id).removeClass('it-is-not-time');
                //outfitCard.getOutfit().removeClass('it-is-not-time')

                if (!level || level && getHeroLevel() >= level) {
                    outfitCard.setDisable(false);
                }

                outfitCard.setDisableText(null);
                return;
            }

            let str = (min < 1 ? '<1' : min) + 'min';

            //this.wnd.$.find('.outfit-item-id-' + id).find('.disable-text').html(str);
            outfitCard.setDisableText(str)
        }, 1000)
    };

    const getOutfitCardById = (id) => {
        for (let k in outfitCards) {
            if (outfitCards[k].getId() == id) {
                return outfitCards[k]
            }
        }

        return null
    }

    const getActiveOutfitCard = () => {
        for (let k in outfitCards) {
            if (outfitCards[k].getState()) {
                return outfitCards[k];
            }
        }

        return null;
    }

    this.initAnimUpdate = () => {
        this.updateFrames();
        this.draw();
        animInterval = setInterval(() => {
            this.updateFrames();
            this.draw();
        }, 200)
    };

    this.updateFrames = () => {
        animPos.x++;

        if (animPos.x == maxFrame) {
            animPos.x = 0;

            if (repeat) {
                repeat = false;
                animPos.y++;
            } else repeat = true;

            if (animPos.y == maxFrame) animPos.y = 0;
        }
    };

    this.draw = () => {
        if (yourLoaded) {
            let $el1 = this.wnd.$.find('.your-outfit').find('.outfit-graphic');
            this.setOutfitPosition($el1, 'your');
        }
        if (!chooseOutfit) return;

        if (previewLoaded) {
            let $el2 = this.wnd.$.find('.preview-outfit').find('.outfit-graphic');
            this.setOutfitPosition($el2, 'preview');
        }
    };

    this.initWindow = () => {
        // this.wnd = new wnd({
        //     onclose: () => {
        //         this.close()
        //     },
        //     name: 'changeOutfit'
        // });
        // let title = _t('outfits');
        // this.wnd.title(title);
        // this.wnd.content(Templates.get('change-outfit'));
        // $('.alerts-layer').append(this.wnd.$);

        Engine.windowManager.add({
            content: Templates.get('change-outfit'),
            title: _t('outfits'),
            //nameWindow        : 'changeOutfit',
            nameWindow: Engine.windowsData.name.CHANGE_OUTFIT,
            objParent: this,
            nameRefInParent: 'wnd',
            onclose: () => {
                this.close();
            }
        });
        this.wnd.addToAlertLayer();
    };

    this.initScrollBar = () => {
        this.wnd.$.find('.default-section').addScrollBar({
            track: true
        });
        this.wnd.$.find('.equip-section').addScrollBar({
            track: true
        });
    };



    this.initCards = () => {
        //let con = this.wnd.$.find('.cards-header');
        //let str1 = _t('default');
        //let str2 = _t('equip');
        //this.newCard(con, str1, () => {
        //    //chooseOutfit = null;
        //});
        //this.newCard(con, str2, () => {
        //    //chooseOutfit = null;
        //});
        //this.setFirstCard();


        let cards = {
            [SETTINGS_DATA.DEFAULT]: {
                name: _t('default'),
                afterShowFn: () => afterShowFunction(0),
                contentTargetEl: this.wnd.$[0].querySelector(".default-section")
            },
            [SETTINGS_DATA.CONTROLS]: {
                name: _t('equip'),
                afterShowFn: () => afterShowFunction(1),
                contentTargetEl: this.wnd.$[0].querySelector(".equip-section")
            }
        };


        const tabsOptions = {
            tabsEl: {
                navEl: this.wnd.$[0].querySelector('.cards-header-wrapper'),
                //contentsEl: this.wndEl.querySelector('.mails-window__contents'),
            }
        };

        this.tabsInstance = new Tabs.default(cards, tabsOptions);

        this.tabsInstance.activateCard(SETTINGS_DATA.DEFAULT);
        this.tabsInstance.callAfterShowFn(SETTINGS_DATA.DEFAULT);

    };

    const afterShowFunction = (index) => {
        this.updateScroll();

        let $bottomBar = this.wnd.$.find('.bottom-bar');
        $bottomBar.children().css('display', 'none');
        $bottomBar.children().eq(index).css('display', 'block');
    };

    //this.setFirstCard = () => {
    //    this.wnd.$.find('.section').eq(0).addClass('visible');
    //    this.wnd.$.find('.card').eq(0).addClass('active');
    //};

    this.updateScroll = () => {
        this.wnd.$.find('.default-section').trigger('update');
        this.wnd.$.find('.equip-section').trigger('update');
    };

    //this.newCard = ($par, label, clb) => {
    //    let $card = Templates.get('card');
    //    $card.find('.label').html(label);
    //    $par.append($card);
    //    let self = this;
    //    $card.click(function () {
    //        let index = $(this).index();
    //        self.setVisible(index);
    //        self.updateScroll();
    //        if (clb) clb();
    //    });
    //};

    //this.setVisible = (index) => {
    //    let $allC = this.wnd.$.find('.card').removeClass('active');
    //    let $bottomBar = this.wnd.$.find('.bottom-bar');
    //    let $allS = this.wnd.$.find('.section').removeClass('visible');
    //    $allC.eq(index).addClass('active');
    //    $allS.eq(index).addClass('visible');
    //    $bottomBar.children().css('display', 'none');
    //    $bottomBar.children().eq(index).css('display', 'block');
    //    showCard = index;
    //};

    this.update = (data) => {
        for (let i = 0; i < data.length; i++) {
            //let $one = this.createOneOutfit(data[i]);
            let $one = this.createOneOutfit(data[i]);
            this.wnd.$.find('.default-section').find('.scroll-pane').append($one);
        }

        this.updateScroll();
        this.wnd.center();
    };

    //this.createOneOutfit = (data, item) => {
    //    let $outfit = Templates.get('one-outfit');
    //    let $span   = $outfit.find('.text');
    //
    //    let lvl         = data.requirements.level;
    //    let kb          = data.requirements.kb;
    //    let timelimit   = data.requirements.timelimit;
    //    let rUrl        = data.relativeUrl;
    //
    //    let patch   = CFG.a_opath + '/' + rUrl;
    //
    //    if (item) {
    //        $outfit.addClass('outfit-item outfit-item-id-' + item.id);
    //        $outfit.data('item', item);
    //        this.setAmount(item, $outfit);
    //    }
    //
    //    if (timelimit) {
    //        let tm = timelimit.timelimit;
    //        let min = this.getMinutes(tm);
    //        $outfit.find('.outfit-timelimit').html(min);
    //        //$outfit.addClass('it-is-not-time');
    //    }
    //
    //    if (lvl) {
    //        if (getHeroLevel() >= lvl) $span.addClass('green');
    //        else $outfit.addClass('disable');
    //
    //        $span.html(lvl + 'lvl');
    //    }
    //
    //    if (kb) {
    //        $span.addClass('green');
    //        $span.html("KB");
    //    }
    //
    //    this.checkOutfitIsYourOutfit($outfit.find('.outfit-border'), rUrl);
    //
    //    createImgStyle($outfit.find('.outfit-wrapper'), patch);
    //
    //    $outfit.find('.requirements').html($span);
    //
    //    $outfit.on('click', function () {
    //        Engine.changeOutfit.wnd.$.find('.save-button').find('.button').removeClass('disable');
    //        Engine.changeOutfit.wnd.$.find('.outfit-border').removeClass('preview');
    //        chooseOutfit = rUrl;
    //        $(this).find('.outfit-border').addClass('preview');
    //        let $e = Engine.changeOutfit.wnd.$.find('.preview-outfit').find('.outfit-graphic');
    //        Engine.changeOutfit.setOutfitInPreview($e, patch, 'preview');
    //    });
    //
    //    return $outfit;
    //};

    this.createOneOutfit = (data1, item) => {
        let lvl = data1.requirements.level;
        let kb = data1.requirements.kb;
        let timelimit = data1.requirements.timelimit;
        let rUrl = data1.relativeUrl;
        let outfitCard = new OutfitCard();
        let patch = CFG.a_opath + '/' + rUrl;
        let data = {
            url: rUrl,
            cl: []
        };

        outfitCard.init();

        let $outfit = outfitCard.getOutfit();

        if (item) {
            let amount = getAmount(item);

            if (amount) {
                data.amount = amount;
            }

            $outfit.attr('item-id', item.id);

            data.cl.push('outfit-item');
            data.id = item.id;
        }

        if (timelimit) {
            data.disableText = this.getMinutes(timelimit.timelimit);

            data.disable = true;
        }

        if (lvl) {
            if (getHeroLevel() >= lvl) data.textColor = 'green';
            else data.disabled = true;

            data.text = lvl + 'lvl'
        }

        if (kb) {
            data.textColor = 'green';
            data.text = "KB";
        }

        if (checkActiveOutfic(rUrl)) {
            data.state = true
        }

        data.beforeClb = () => {
            Engine.changeOutfit.wnd.$.find('.save-button').find('.button').removeClass('disable');

            for (let k in outfitCards) {
                outfitCards[k].setStateAndUpdate(false);
            }
        };

        data.clb = () => {
            chooseOutfit = rUrl;

            let $e = Engine.changeOutfit.wnd.$.find('.preview-outfit').find('.outfit-graphic');
            Engine.changeOutfit.setOutfitInPreview($e, patch, 'preview');
        };

        outfitCard.updateData(data);

        outfitCards.push(outfitCard);

        return $outfit;
    };

    this.setAmount = (item, $outfit) => {
        let amount = isset(item.parseStats().amount) ? item.parseStats().amount : '';
        $outfit.find('.amount').text(amount);
    };

    const getAmount = (item) => {
        return isset(item.parseStats().amount) ? item.parseStats().amount : 0;

    }

    this.checkOutfitIsYourOutfit = ($outfit, rUrl) => {
        if (Engine.hero.d.img == '/' + rUrl) $outfit.find('.outfit-border').addClass('active');
    };

    const checkActiveOutfic = (url) => {
        return Engine.hero.d.img == '/' + url;
    }

    this.setOutfitInPreview = ($el, url, kind) => {

        Engine.imgLoader.onload(url, false, false, (i) => {
            this.afterOnloadOutfitInPreview(i, kind, $el, url);
        });

    };

    this.afterOnloadOutfitInPreview = (i, kind, $el, url) => {
        let fW = i.width / 4;
        let fH = i.height / 4;

        $el.css({
            backgroundImage: 'url(' + url + ')',
            width: fW,
            height: fH
        });

        this.setAnimFrames(fW, fH, kind);

        switch (kind) {
            case 'your':
                yourLoaded = true;
                break;
            case 'preview':
                previewLoaded = true;
                break;
            default:
                console.error('[ChangeOutfit.js, afterOnloadOutfitInPreview] Bad kind:', kind);
                break;
        }
    };

    this.setAnimFrames = (oneFrameWidth, oneFrameHeight, kind) => {
        animX[kind] = [0, -oneFrameWidth, -oneFrameWidth * 2, -oneFrameWidth * 3];
        animY[kind] = [0, -oneFrameHeight, -oneFrameHeight * 3, -oneFrameHeight * 2]; // down - left - top - right
    };

    this.setOutfitPosition = ($el, kind) => {
        $el.css('background-position', animX[kind][animPos.x] + 'px ' + animY[kind][animPos.y] + 'px');
    };

    this.initSaveButton = () => {
        let $but = Templates.get('button').addClass('green disable small');
        this.wnd.$.find('.save-button').append($but);
        $but.find('.label').html(_t('privPage_save'));

        $but.on('click', () => {
            if (chooseOutfit === null) return;


            let outfitCard = getActiveOutfitCard();
            let $outfit = outfitCard.getOutfit();
            let isOutfitItem = $outfit.hasClass('outfit-item');

            if (isOutfitItem) {
                let id = $outfit.attr('item-id');
                let item = getEngine().items.getItemById(id);

                if (!item) {
                    errorReport(moduleData.fileName, "initSaveButton", "item not exist!", id);
                    return
                }

                getEngine().heroEquipment.sendUseRequest(item);

                this.close();
            } else {
                this.sendSaveRequest()
            }
        });
    };

    this.sendSaveRequest = () => {
        const domain = getMainDomain()
        const isWWW = isPl() ? 'www.' : '';

        $.ajax({
            type: 'post',
            url: `https://${isWWW}margonem.${domain}/ajax/saveoutfit`,
            xhrFields: {
                withCredentials: true
            },
            data: {
                world: Engine.worldConfig.getWorldName(),
                id: Engine.hero.d.id,
                h2: getCookie('hs3'),
                outfit: chooseOutfit
            },
            success: () => {
                this.close();
            }
        });
    };

    this.clearAllInterval = () => {
        for (let k in allIntervals) {
            clearInterval(allIntervals[k]);
            delete allIntervals[k];
        }
    };

    this.close = () => {
        this.clearAllInterval();
        //this.wnd.$.remove();
        this.wnd.remove();
        // delete (this.wnd);
        clearInterval(animInterval);
        Engine.changeOutfit = null;
        //Engine.tpls.removeCallback('g', self.newOutfitItem);
        Engine.items.removeCallback(Engine.itemsFetchData.NEW_OUTFIT_ITEM);
    };

};