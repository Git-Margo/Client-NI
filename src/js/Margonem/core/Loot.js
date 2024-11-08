/**
 * Created by lukasz on 2015-01-13.
 */

var Tpl = require('core/Templates');
var TutorialData = require('core/tutorial/TutorialData');
//var Items = require('core/items/ItemsManager');
module.exports = new(function() {
    var self = this;
    var alertBagShow = false;
    var amountItems = 0;
    var sendLoots = true;
    var groupped = false;
    var finalized = false;
    var itemsLoaded = false;
    this.source;
    this.owners = null;
    this.states = null;
    this.itemsDecision = {};
    this.wnd = null;
    this.closeInterval = null;
    this.statesOfLoot = null;
    this.colorized = false;


    this.init = function() {
        this.initWnd();
        this.initStates();
        this.initAcceptButton();
        this.initFetch();
    };

    this.initAcceptButton = function() {
        var btn = Tpl.get('button').addClass('green small');
        btn.find('.label').text(_t('loot_now', null, 'loot'));
        btn.click(function() {
            self.acceptLoot();
        });
        this.wnd.$.find('.accept-button').append(btn);
    };

    this.initWnd = function() {

        Engine.windowManager.add({
            content: Tpl.get('loot-window'),
            title: _t('loots_header'),
            nameWindow: Engine.windowsData.name.LOOT,
            objParent: this,
            nameRefInParent: 'wnd',
            // managePosition    : {x: '251', y: '60'},
            managePosition: {
                position: Engine.windowsData.position.CENTER_OR_SAVE_IN_STORAGE
            },
            addClass: 'loot-wnd',
            closeable: false,
            onclose: () => {

            }
        });
    };

    this.acceptLoot = function() {
        self.finalize();
    };

    this.initStates = function() {
        this.states = [{
                key: "not",
                text: _t('dont_want2', null, 'loot'),
                button: 'red'
            },
            {
                key: "want",
                text: _t('want', null, 'loot'),
                button: 'green'
            },
            {
                key: "must",
                text: _t('really_want2', null, 'loot'),
                button: 'orange'
            }
        ];
    };

    this.getKeyFromState = function(state) {
        return this.states[state].key;
    };

    this.initFetch = function() {
        // Engine.items.fetch('l', self.newLootItem);
        // Engine.items.fetch('k', self.newLootItem);	//personalLoot

        Engine.items.fetch(Engine.itemsFetchData.NEW_NORMAL_LOOT_ITEM, self.newLootItem);
        Engine.items.fetch(Engine.itemsFetchData.NEW_PERSONAL_LOOT_ITEM, self.newLootItem);
    };

    this.newLootItem = function(i, finish) {
        var avatarLoot = i.loc == 'k';
        //avatarLoot = true;
        var yours = avatarLoot && i.own == Engine.hero.id ? "class='yours' " : "";
        var wrap = Tpl.get('loot-item-wrapper');
        var $textInfo = wrap.find('.text-info');
        var it = i;
        wrap.addClass('loot-item-wrapper-' + i.id);
        if (self.colorized) {
            self.wnd.$.find('.loot-window').addClass('colorized ' + i.itemType);
        }
        //var $clone = Engine.items.createViewIcon(i.id, 'loot-item')[0];
        var $clone = Engine.items.createViewIcon(i.id, Engine.itemsViewData.LOOT_ITEM_VIEW)[0];

        wrap.find('.slot').append($clone);
        self.bagAlert();

        if (avatarLoot) {
            var char = self.getNameAndAvatar(it.own);
            var $icon = Tpl.get('loot-icon').addClass('id-personal-avatar-' + it.own);
            createImgStyle($icon, char.imgUrl);
            amountItems = 1;
            $textInfo.addClass('id-personal-nick-' + it.own);
            $textInfo.html(char.name);
            $textInfo.tipOverflow();
            if (it.own == Engine.hero.d.id) wrap.addClass('yours');
            wrap.find('.button-holder').html($icon);
            wrap.addClass('avatar-loot')
        } else {
            amountItems++;
            self.choiceButton(it, wrap);
            var state = self.statesOfLoot[i.id];
            self.itemsDecision[i.id] = self.getKeyFromState(state);
            $textInfo.html(self.states[0].text);

            self.setViewBySorce(wrap);

            if (isset(i._cachedStats["reqp"]) && i._cachedStats["reqp"].indexOf(Engine.hero.d.prof) == -1) {
                wrap.addClass('cant-must');
            }
        }
        self.bagAlert();

        wrap.attr('loot-id', i.id);
        self.appendToItemsWrapper(wrap);

        $clone.contextmenu(function(e, mE) {
            i.createOptionMenu(getE(e, mE), false, {
                canPreview: true
            });
        });

        if ($textInfo[0].scrollWidth > $textInfo.innerWidth()) $textInfo.tip(char.name);
        if (!avatarLoot) self.setStateOnOneItemWrapper(i.id);
        if (finish) {
            itemsLoaded = true;
            var anim = Engine.chestAnimation && Engine.chestAnimation.animation;
            //if (!anim) self.wnd.$.css('display', 'block');
            if (!anim) self.wnd.show();
            //self.wnd.setSavePosWnd('Loot', self.wnd.getCenterPos('loot'));
            //debugger;
            if (self.itemsIsMoreThanOne()) self.lootCenter();
            else self.wnd.updatePos();

            self.wnd.updatePos();

            self.wnd.setWndOnPeak();
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 12);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 12);
        }
    };

    this.lootCenter = () => {
        let newX = this.wnd.$.width() / 2;
        let newY = this.wnd.$.height() / 2;

        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;

        this.wnd.setContentPos(newX + 'px', newY + 'px');
    }

    this.itemsIsMoreThanOne = () => {
        return Object.keys(this.itemsDecision).length > 1;
    }

    this.appendToItemsWrapper = ($element) => {
        let $allElements = self.wnd.$.find('.loot-item-wrapper');

        if (!$allElements.length) self.wnd.$.find('.items-wrapper').append($element);
        else {
            let add = false;
            let findId = parseInt($element.attr('loot-id'));
            let length = self.wnd.$.find('.loot-item-wrapper').length;
            $allElements.each(function(index) {
                let id = parseInt($(this).attr('loot-id'));
                let lastIndex = index + 1 == length;
                if (findId > id) {
                    if (lastIndex) {
                        $(this).after($element);
                        add = true;
                        return false;
                    }
                } else {
                    $(this).before($element);
                    add = true;
                    return false;
                }
            });
            if (!add) console.warn(self.wnd.$.find('.loot-item-wrapper'));
        }
    };

    this.newMsgSound = function() {
        var sm = Engine.soundManager;
        if (!sm.getStateSoundNotifById(0)) sm.createNotifSound(0);
    };

    this.getNameAndAvatar = function(id) {
        if (Engine.hero.d.id == id) {
            return {
                name: Engine.hero.d.nick,
                imgUrl: CFG.a_opath + Engine.hero.d.img
            };
        } else {
            var o = Engine.others.getById(id);
            if (o) {
                return {
                    name: o.d.nick,
                    imgUrl: CFG.a_opath + o.d.icon
                };
            }
            if (Engine.loots.owners[id]) {
                return {
                    name: Engine.loots.owners[id].nick,
                    imgUrl: CFG.a_opath + Engine.loots.owners[id].icon
                }
            }
            return {
                name: '',
                imgUrl: '/img/def-npc.gif'
            }
        }
    };

    this.choiceButton = function(it, $wrap) {
        self.createOneChoiceButton($wrap, 1);
        self.createOneChoiceButton($wrap, 0);

        if (groupped) {
            $wrap.find('.button-holder').addClass('is-party');
            self.createOneChoiceButton($wrap, 2);
        }

        $wrap.find('.button').on('click', function() {
            self.onChooseButtonClick($(this), it.id);
        });
    };

    this.createOneChoiceButton = function($wrap, state) {
        let $btn = Tpl.get('button');
        let classes = state == 0 ? 'green' : 'red';
        let tipSuffix = state === 0 ? ' [Esc]' : '';
        classes += ' ' + self.states[state].key;
        $btn.addClass(classes + ' no-hover');
        $btn.data('state', state);
        $btn.find('.label').addClass(self.states[state].key);
        $btn.tip(self.states[state].text + tipSuffix);
        $wrap.find('.button-holder').append($btn);
    };

    this.onChooseButtonClick = function($btn, id) {
        //var $wrap = $btn.closest('.loot-item-wrapper');
        var stateId = $btn.data('state');
        var opt = self.states[stateId];

        if (!self.checkCanSendLootRequest()) return;

        var newItemsDecision = this.getChangeDecisionObj([
            [id, opt.key]
        ]);
        var url = "loot" + self.lootUrl(newItemsDecision) + "&final=0";

        _g(url);
    };

    this.setViewBySorce = ($itemWrapper) => {
        switch (this.source) {
            case 'lootbox':
                $itemWrapper.addClass('lootbox-source');
                break;
            default:
                $itemWrapper.removeClass('lootbox-source');
                break;
        }
    };

    this.setSource = (source) => {
        this.source = source;
    };

    this.initUpdate = function(dataInit, v) {
        sendLoots = true;
        finalized = false;
        self.setGroupped(dataInit);

        if (v.source) this.setSource(v.source);

        this.colorized = Engine.chestAnimation && !Engine.chestAnimation.animation;
        self.wnd.$.css('display', !itemsLoaded ? 'none' : 'block');
        self.wnd.addToAlertLayer();
        Engine.hotKeys.replacehotAcceptLootBtnsNames();
        self.wnd.updatePos();
        self.wnd.setWndOnPeak(true);
        self.owners = v.owners ? v.owners : null;
        self.updateFreeBagSlots();
        setTimeout(function() {
            self.groupLootSound();
        }, 5000)
    };

    this.updateFreeBagSlots = function() {
        const freeSlots = Engine.heroEquipment.getFreeSlots();
        self.wnd.$.find('.bag-left').html('<span>' + freeSlots + ' m</span>').data('free', freeSlots);
    };

    this.groupLootSound = function() {
        var sm = Engine.soundManager;
        if (Engine.party && !sm.getStateSoundNotifById(5) && self.wnd.$.is(':visible')) {
            sm.createNotifSound(7);
        }
    };

    this.setGroupped = function(dataInit) {
        groupped = dataInit > 1;
    };

    this.getGroupped = function() {
        return groupped;
    };

    this.getChangeDecisionObj = function(itemsToChange) {
        var newItemsDecision = {};

        for (var id in self.itemsDecision) {
            var exist = false;
            for (var i = 0; i < itemsToChange.length; i++) {
                var idItemToChange = itemsToChange[i][0];
                var decisionItemToChange = itemsToChange[i][1];

                if (id == idItemToChange) {
                    newItemsDecision[id] = decisionItemToChange;
                    exist = true;
                    break;
                }
            }
            if (!exist) newItemsDecision[id] = self.itemsDecision[id];
        }
        return newItemsDecision;
    };

    this.lootUrl = function(newItemsDecision) {
        var arr = {
            want: [],
            not: [],
            must: []
        };

        let items = newItemsDecision ? newItemsDecision : self.itemsDecision;

        for (var id in items) {
            arr[items[id]].push(id);
        }

        return "&want=" + arr.want.join(',') + "&not=" + arr.not.join(',') + "&must=" + arr.must.join(',');
    };

    this.refuseAllLoot = function() {
        let newItemsDecision = {};
        for (var id in self.itemsDecision) {
            newItemsDecision[id] = 'not';
        }
        this.setLootItems(newItemsDecision);
    };

    this.setLootItems = function(newItemsDecision) {
        if (!self.checkCanSendLootRequest()) return;
        _g("loot" + self.lootUrl(newItemsDecision) + "&final=0");
    };

    this.finalize = function(newItemsDecision) {
        if (finalized) return;

        finalized = true;
        sendLoots = false;

        var items = newItemsDecision ? newItemsDecision : self.itemsDecision;
        var lootUrl = self.lootUrl(items);

        _g('loot' + lootUrl + '&final=1', function(data) {
            var searchParams = new URLSearchParams(lootUrl);
            if (searchParams.get('want') === '' && searchParams.get('not') === '' && searchParams.get('must') === '') {
                console.log(data);
                debugger;
            }
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 12);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 12);
            if (!data.w) self.deleteItemsAndCloseLootWindow();
            else {
                finalized = false;
                sendLoots = true;
            }
        });
    };

    this.bagAlert = function() {
        const free = self.wnd.$.find('.bag-left').data('free');
        //if (free < amountItems && !alertBagShow && Engine.settings && !Engine.opt(21)) {
        if (free < amountItems && !alertBagShow && Engine.settings && Engine.settingsOptions.isInformAboutFreePlaceInBagOn()) {
            alertBagShow = true;
            message(_t('bag_alert'));
        }
    };

    this.itemsDecisionExist = function() {
        return lengthObject(self.itemsDecision) != 0;
    };

    this.checkCanSendLootRequest = function() {
        return sendLoots && self.itemsDecisionExist();
    };

    this.update = function(v, allData) {
        this.setStatesOfLoot(v.states);
        if (isset(v.init) && v.init) self.initUpdate(v.init, v);
        this.manageCloseInterval(v.endTs, allData); //allData for get ev on init4 for loot counter
    };

    this.resetWindowClasses = function() {
        self.wnd.$.find('.loot-window').attr('class', 'loot-window'); // remove others class for colorized
    };

    this.setStatesOfLoot = function(v) {
        self.statesOfLoot = {};
        for (var id in v) {
            self.statesOfLoot[id] = v[id];
            const $lootEL = self.wnd.$.find('.loot-item-wrapper-' + id);
            if ($lootEL.length && !$lootEL.hasClass('avatar-loot')) {
                self.setStateOnOneItemWrapper(id);
            }
        }
    };

    this.setStateOnOneItemWrapper = function(id) {
        var $wrap = self.wnd.$.find('.loot-item-wrapper-' + id);
        var $btn = $wrap.find('.button');

        var stateId = self.statesOfLoot[id];
        var opt = self.states[stateId];
        var key = opt.key;
        var text = opt.text;

        self.itemsDecision[id] = key;
        $wrap.attr('data-state', key);
        $wrap.find('.text-info').html(text);

        $btn.removeClass('red green');
        $btn.each(function() {
            var clButton = $(this).hasClass(key) ? 'green' : 'red';
            $(this).addClass(clButton);
        });
    };

    this.manageCloseInterval = function(endTs, allData) {
        if (self.closeInterval) return;

        const ev = isset(allData.ev) ? allData.ev : Engine.getEv();
        const timeToEnd = endTs - ev;
        self.setTime(Math.floor(timeToEnd));

        let time = timeToEnd;
        self.closeInterval = setInterval(function() {
            time--;
            self.setTime(Math.floor(time));
            if (time < 1) self.deleteItemsAndCloseLootWindow();
        }, 1000);
    };

    this.setTime = function(time) {
        self.wnd.$.find('.time-left').html('<span>' + time + ' s</span>');
    };

    this.clearIntervalIfExist = function() {
        if (self.closeInterval) {
            clearInterval(self.closeInterval);
            self.closeInterval = null;
        }
    };

    this.deleteItemsAndCloseLootWindow = function() {
        finalized = true; // force finalized (auto accept when begin to fight with active previous loot window)
        Engine.items.deleteUnnecessaryItems();
        self.close();
    };

    this.close = function() {
        //return;
        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 12);
        //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 12);
        self.clearIntervalIfExist();
        self.resetWindowClasses();
        if (Engine.chestAnimation) {
            Engine.chestAnimation = null;
        }
        self.wnd.$.find('.items-wrapper').html('');
        self.itemsDecision = {};
        //self.wnd.$.css('display', 'none');
        self.wnd.hide();
        //self.wnd.$.detach();
        self.wnd.detachFromLayer();
        alertBagShow = false;
        amountItems = 0;
        itemsLoaded = false;
    };

    //this.init();

})();