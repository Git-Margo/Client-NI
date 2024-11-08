//let wnd = require('core/Window');
let Templates = require('core/Templates');

module.exports = function() {

    let showCard = 0;
    let chooseOutfit = null;

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
        let relativeUrl = i._cachedStats.outfit.split(',')[1];
        let data = {
            requirements: {},
            relativeUrl: relativeUrl
        };

        if (i._cachedStats.lvl) data.requirements.level = i._cachedStats.lvl;

        if (i._cachedStats.timelimit) {
            let d = i._cachedStats.timelimit.split(',');
            if (d[1]) {
                let timelimit = d[1];

                let min = this.getMinutes(timelimit);
                if (min > -1) {

                    data.requirements.timelimit = {
                        id: i.id,
                        timelimit: timelimit
                    };

                    this.addInterval(i, timelimit);
                }
            }
        }

        return data;
    };

    this.newOutfitItem = (i, finish) => {
        if (!i._cachedStats.outfit) return;

        let data = this.prepareData(i);

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

    this.addInterval = (i, timelimit) => {
        allIntervals[i.id] = setInterval(() => {

            let min = this.getMinutes(timelimit);
            if (min < 0) {
                clearInterval(allIntervals[i.id]);
                delete allIntervals[i.id];
                this.wnd.$.find('.outfit-item-id-' + i.id).removeClass('it-is-not-time');
                return;
            }

            let str = (min < 1 ? '<1' : min) + 'min';

            this.wnd.$.find('.outfit-item-id-' + i.id).find('.outfit-timelimit').html(str);
        }, 1000)
    };

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
        let con = this.wnd.$.find('.cards-header');
        let str1 = _t('default');
        let str2 = _t('equip');
        this.newCard(con, str1, () => {
            //chooseOutfit = null;
        });
        this.newCard(con, str2, () => {
            //chooseOutfit = null;
        });
        this.setFirstCard();
    };

    this.setFirstCard = () => {
        this.wnd.$.find('.section').eq(0).addClass('visible');
        this.wnd.$.find('.card').eq(0).addClass('active');
    };

    this.updateScroll = () => {
        this.wnd.$.find('.default-section').trigger('update');
        this.wnd.$.find('.equip-section').trigger('update');
    };

    this.newCard = ($par, label, clb) => {
        let $card = Templates.get('card');
        $card.find('.label').html(label);
        $par.append($card);
        let self = this;
        $card.click(function() {
            let index = $(this).index();
            self.setVisible(index);
            self.updateScroll();
            if (clb) clb();
        });
    };

    this.setVisible = (index) => {
        let $allC = this.wnd.$.find('.card').removeClass('active');
        let $bottomBar = this.wnd.$.find('.bottom-bar');
        let $allS = this.wnd.$.find('.section').removeClass('visible');
        $allC.eq(index).addClass('active');
        $allS.eq(index).addClass('visible');
        $bottomBar.children().css('display', 'none');
        $bottomBar.children().eq(index).css('display', 'block');
        showCard = index;
    };

    this.update = (data) => {
        for (let i = 0; i < data.length; i++) {
            let $one = this.createOneOutfit(data[i]);
            this.wnd.$.find('.default-section').find('.scroll-pane').append($one);
        }

        this.updateScroll();
        this.wnd.center();
    };

    this.createOneOutfit = (data, item) => {
        let $outfit = Templates.get('one-outfit');
        let $span = $outfit.find('.text');

        let lvl = data.requirements.level;
        let kb = data.requirements.kb;
        let timelimit = data.requirements.timelimit;
        let rUrl = data.relativeUrl;

        let patch = CFG.a_opath + '/' + rUrl;

        if (item) {
            $outfit.addClass('outfit-item outfit-item-id-' + item.id);
            $outfit.data('item', item);
            this.setAmount(item, $outfit);
        }

        if (timelimit) {
            let tm = timelimit.timelimit;
            let min = this.getMinutes(tm);
            $outfit.find('.outfit-timelimit').html(min);
            $outfit.addClass('it-is-not-time');
        }

        if (lvl) {
            if (Engine.hero.d.lvl >= lvl) $span.addClass('green');
            else $outfit.addClass('disable');

            $span.html(lvl + 'lvl');
        }

        if (kb) {
            $span.addClass('green');
            $span.html("KB");
        }

        this.checkOutfitIsYourOutfit($outfit.find('.outfit-border'), rUrl);

        createImgStyle($outfit.find('.outfit-wrapper'), patch);

        $outfit.find('.requirements').html($span);

        $outfit.on('click', function() {
            Engine.changeOutfit.wnd.$.find('.save-button').find('.button').removeClass('disable');
            Engine.changeOutfit.wnd.$.find('.outfit-border').removeClass('preview');
            chooseOutfit = rUrl;
            $(this).find('.outfit-border').addClass('preview');
            let $e = Engine.changeOutfit.wnd.$.find('.preview-outfit').find('.outfit-graphic');
            Engine.changeOutfit.setOutfitInPreview($e, patch, 'preview');
        });

        return $outfit;
    };

    this.setAmount = (item, $outfit) => {
        let amount = isset(item.parseStats().amount) ? item.parseStats().amount : '';
        $outfit.find('.amount').text(amount);
    };

    this.checkOutfitIsYourOutfit = ($outfit, rUrl) => {
        if (Engine.hero.d.img == '/' + rUrl) $outfit.find('.outfit-border').addClass('active');
    };

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

            let $outfitRecord = this.wnd.$.find('.outfit-border.preview').parent();
            let isOutfitItem = $outfitRecord.hasClass('outfit-item');

            if (isOutfitItem) {
                let item = $outfitRecord.data('item');
                console.log(item);
                Engine.heroEquipment.sendUseRequest(item);
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