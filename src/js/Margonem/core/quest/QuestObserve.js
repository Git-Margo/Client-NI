var Tpl = require('@core/Templates');
//var wnd = require('@core/Window');

module.exports = function() {


    this.list = null;
    this.observeMax = null;

    this.init = () => {
        this.list = {};
        this.initWindow();
        this.initMargin();
        this.initScrollbar();
    };

    this.initWindow = function() {
        //this.wnd = new wnd({
        //    onclose: function () {
        //        self.managePanelVisible()
        //    },
        //    name: 'questObserve',
        //    type: 'transparent',
        //    manageOpacity: 3,
        //    managePosition: {x: '251', y: '60'}
        //});

        Engine.windowManager.add({
            content: Tpl.get('quest-observe-window'),
            title: _t('quests-h', null, 'help'),
            //nameWindow        : 'questObserve',
            nameWindow: Engine.windowsData.name.QUEST_OBSERVE,
            objParent: this,
            nameRefInParent: 'wnd',
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            managePosition: {
                x: '251',
                y: '60'
            },
            closeable: false,
            onclose: () => {
                this.managePanelVisible();
            }
        });


        //var title = _t('quests-h', null, 'help')
        //this.wnd.title(title);
        //this.wnd.content(Tpl.get('quest-observe-window'));
        //$('.alerts-layer').append(this.wnd.$);
        this.wnd.addToAlertLayer();
        //this.wnd.$.addClass('no-exit-button');
        this.wnd.updatePos();
    };

    this.initMargin = function() {
        this.wnd.$.find('.content').css({
            'margin-top': '-12px',
            'margin-left': '-23px',
            'margin-right': '-23px',
            'margin-bottom': '-20px'
        });
    };

    this.openPanel = () => {
        this.wnd.$.css('display', 'block');
        this.wnd.show();
        this.wnd.setWndOnPeak();
        this.updateScroll();
    };

    this.closePanel = () => {
        //this.wnd.$.css('display', 'none');
        this.wnd.hide();
    };

    this.initScrollbar = () => {
        this.wnd.$.find('.scroll-wrapper').addScrollBar({
            track: true
        });
    }

    this.updateScroll = () => {
        this.wnd.$.find('.scroll-wrapper').trigger('update');
    };

    this.checkCanObserve = () => {
        if (Object.keys(this.list).length >= this.observeMax) {
            mAlert(_t('can_not_observe_more'));
            return false
        }
        return true;
    };

    this.getSortData = (data) => {
        let a = [];
        let prepareObj = {};
        for (let k in data) {
            let key = data[k];
            prepareObj[key] = k
        }

        for (let j in prepareObj) {
            a.push(parseInt(j));
        }

        a.sort(function(a, b) {
            return a - b
        });

        for (let i = 0; i < a.length; i++) {
            let key = a[i];
            a[i] = prepareObj[key];
        }

        return a;
    };

    this.update = (data) => {
        this.observeMax = data.max;

        let sortData = this.getSortData(data.ids_numbers);

        let oldList = JSON.parse(JSON.stringify(this.list));
        this.list = {};

        let idToChangeQuestOnObserve = [];
        let idToChangeQuestOnNotObserve = [];

        for (let i = 0; i < sortData.length; i++) {
            let val = sortData[i];

            this.list[val] = true;

            if (oldList[val]) delete oldList[val];
            else {
                idToChangeQuestOnObserve.push(val);
            }
        }

        for (let k in oldList) {
            idToChangeQuestOnNotObserve.push(k);
        }

        this.setStatesOfObserveInQuestLog(idToChangeQuestOnObserve, true);
        this.setStatesOfObserveInQuestLog(idToChangeQuestOnNotObserve, false);

        if (idToChangeQuestOnObserve.length < 1) {
            this.setStatesOfObserveInQuestLog(Object.keys(this.list), true); // for update by reload (gateways)
        }

        for (let id of idToChangeQuestOnObserve) {
            this.createOneQuestObserve(id);
        }

        for (let id of idToChangeQuestOnNotObserve) {
            this.deleteOneObserveQuest(id);
        }

        //console.log('idToChangeQuestOnObserve', idToChangeQuestOnObserve);
        //console.log('idToChangeQuestOnNotObserve', idToChangeQuestOnNotObserve);

        this.manageEmpty();
        this.updateScroll();
    };

    this.setStatesOfObserveInQuestLog = (arrayIdToChange, state) => {
        for (let id of arrayIdToChange) {
            Engine.quests.setStateOfObserveOnButton(id, state);
        }
    };

    this.createOneQuestObserve = (id, replaceWithExist) => {
        let data = Engine.quests.getQuestData(id);
        let $oneObserve = Tpl.get('one-observe').addClass('quest-observe-' + id);
        $oneObserve.find('.one-observe__debug').html(id);
        $oneObserve.find('.one-observe__title').html(data.title);
        $oneObserve.find('.one-observe__content').html(data.content.clone());


        $oneObserve.find('.one-observe__remove-btn').click(function() {
            Engine.quests.removeObserve(id);
        }).tip(_t('detach_from_observe'));

        if (replaceWithExist) {
            let $replaceWith = this.wnd.$.find('.quest-observe-list').find('.quest-observe-' + id);
            if (!$replaceWith.length) {
                console.warn('[QuestObserve.js, createOneQuestObserve] $replaceWith not exist! Id: ', id);
                return
            }
            $replaceWith.replaceWith($oneObserve);
        } else this.wnd.$.find('.quest-observe-list').append($oneObserve);
    };

    this.updateOneQuestObserve = (id) => {
        if (!this.list[id]) return;
        this.setStatesOfObserveInQuestLog([id], true);
        this.createOneQuestObserve(id, true);
    };

    this.deleteOneObserveQuest = (id) => {
        this.wnd.$.find('.quest-observe-list').find('.quest-observe-' + id).remove();
    };

    this.manageEmpty = () => {
        let $empty = this.wnd.$.find('.empty');
        let display = this.wnd.$.find('.quest-observe-list').children().length ? 'none' : 'block';
        $empty.css('display', display);

        if (this.wnd.$.find('.quest-observe-list').children().length) {
            this.openPanel();
        } else {
            this.closePanel();
        }

    }

};