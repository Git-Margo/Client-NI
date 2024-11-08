/**
 * Created by lukasz on 2015-01-07.
 */
var Tpl = require('core/Templates');
var Storage = require('core/Storage');
var TextModifyByTag = require('core/TextModifyByTag');
let QuestData = require('core/quest/QuestData');
const {
    isMan
} = require('../HelpersTS');

module.exports = function() {
    var self = this;
    let questsData = {};
    let oldServerData;
    let finishQuest = {};

    this.createWindow = function() {
        Engine.windowManager.add({
            content: Tpl.get('quest-log'),
            title: _t('quest_journal', null, 'quest'),
            nameWindow: Engine.windowsData.name.QUESTS_PANEL,
            widget: Engine.widgetsData.name.QUEST_LOG,
            objParent: this,
            nameRefInParent: 'wnd',
            managePosition: {
                x: '251',
                y: '60'
            },
            startVH: 60,
            cssVH: 60,
            manageShow: false,
            onclose: () => {
                self.closePanel();
            }
        });

        this.wnd.addToAlertLayer();

        this.wnd.$.find('.scroll-wrapper').addScrollBar({
            track: true
        });
        this.initSearch();
        this.initLabel();

        this.wnd.updatePos();
    };

    this.managePanelVisible = function() {
        let visible = self.wnd.isShow();
        visible ? self.closePanel() : self.openPanel();
    };

    this.openPanel = function() {
        self.wnd.show();
        self.wnd.setWndOnPeak();
        self.updateScroll();
    };

    this.closePanel = function() {
        self.wnd.hide();
    };

    this.initLabel = function() {
        this.wnd.$.find('.header-big-label').html(_t('quest_journal', null, 'quest'));
    };

    this.initSearch = function() {
        var $searchInput = this.wnd.$.find('.search'),
            $searchX = this.wnd.$.find('.search-x');
        $searchInput.keyup(function() {
            var v = $(this).val();
            var $allQuests = self.wnd.$.find('.quest-box');
            if (v == '') $allQuests.css('display', 'block');
            else {
                $allQuests.each(function() {
                    var txt = ($(this).find('.quest-title').html()).toLowerCase();
                    var disp = txt.search(v.toLowerCase()) > -1 ? 'block' : 'none';
                    $(this).css('display', disp);
                    self.updateScroll();
                });
            }
        });
        $searchInput.attr('placeholder', _t('search'));

        $searchX.on('click', function() {
            $searchInput.val('')
                .blur()
                .trigger('keyup');
        });
    };

    this.onResize = function() {
        this.updateScroll();
    };

    this.updateScroll = function() {
        var $w = self.wnd.$;
        var $sw = $w.find('.scroll-wrapper');
        $sw.trigger('update');
        var b1 = $sw.find('.middle-graphics').length > 0;
        if (!b1) return;

        var add = $sw.hasClass('scrollable') ? 23 : 20;
        var w = $w.find('.scroll-pane').width();
        $w.find('.middle-graphics').width(w + add);
    };

    this.getQuestData = (id) => {
        return questsData[id];
    };

    const refreshTrackQuestButtons = () => {
        refreshClassInAllButtons("track");
    }

    const setTrackItemsAfterInterfaceStart = () => {
        addHighlightsInQuestItems();
    };

    const refreshClassInAllButtons = (classToRefresh) => {

        let activeQuestTrackingQuest = getEngine().questTracking.getActiveQuestTrackingInStorage();

        for (let questId in questsData) {
            let buttons = getQuestButtonsArray(questId);

            for (let $oneButton of buttons) {
                if (!$oneButton.hasClass(classToRefresh)) continue;

                refreshOneButtonActive($oneButton, activeQuestTrackingQuest, activeQuestTrackingQuest == questId)
            }
        }
    };

    const refreshOneButtonActive = ($button, activeQuestTrackingQuest, activeQuest) => {

        let greenButton = $button.hasClass("green");

        if (activeQuest) {
            if (!greenButton) $button.addClass("green");
            return
        }

        if (!greenButton) {
            return
        }

        $button.removeClass("green");
    };

    const getQuestButtonsArray = (id) => {
        if (!questsData[id]) return null;

        return questsData[id].buttonsArray;
    };

    this.addOneQuestData = (id, title, content, buttonsArray, itemsArray) => {
        questsData[id] = {
            title: title,
            content: content,
            buttonsArray: buttonsArray,
            itemsArray: itemsArray
        }
    };

    this.setFinishQuest = (finishQuestArray) => {
        finishQuest = {};
        for (let k in finishQuestArray) {
            let finishQuestId = finishQuestArray[k];
            this.addFinishQuest(finishQuestId);
        }
    };

    this.addFinishQuest = (id) => {
        finishQuest[id] = true;
    };

    this.addFinishQuestArray = (questIdArray) => {
        for (let k in questIdArray) {
            let questId = questIdArray[k];
            this.addFinishQuest(questId);
        }
    };

    this.getFinishQuest = () => {
        return finishQuest;
    };

    this.checkFinishQuest = (id) => {
        return finishQuest[id] ? true : false;
    }

    this.deleteQuest = (v) => {
        v.map(questId => {
            this.wnd.$.find('.quest-' + questId).remove();
            delete questsData[v];
            self.updateScroll();
            //Engine.questTrack.deleteQuest(v);
        });

        this.addFinishQuestArray(v);
    };

    this.prepareTypMonsterData = (_data) => {
        let data;
        data = _data.replace(' Common (', ' ' + _t('normal-monster', null, 'npcs_kind') + ' (');
        data = data.replace(' Elite (', ' ' + _t('elita1', null, 'npcs_kind') + ' (');
        data = data.replace(' Elite2 (', ' ' + _t('elita2', null, 'npcs_kind') + ' (');
        data = data.replace(' Hero (', ' ' + _t('heros', null, 'npcs_kind') + ' (');
        data = data.replace(' Titan (', ' ' + _t('tytan', null, 'npcs_kind') + '/' + _t('colossus', null, 'npcs_kind') + ' (');
        return data
    };

    this.refresh = function(_data, allData) { // for PL
        if (!getEngine().isInitLoadTime()) clearHighlightQuestInItems();

        if (!this.wnd) this.createWindow();

        if (oldServerData == _data) return;
        oldServerData = _data;

        let data = this.prepareTypMonsterData(_data);

        const gender = isset(Engine.hero.d.gender) ? Engine.hero.isMan() : isMan(allData.h.gender);
        data = TextModifyByTag.sexModify(data, gender);

        var quests = $(data);
        for (var i = 0; i < quests.length; i++) {
            const
                $box = Tpl.get('quest-box'),
                $temp = $(quests[i]),
                qId = parseInt($temp.data('quest-id')),
                $buttons = [],
                $title = $temp.find('.q_title'),
                title = escapeHTML($title.html()),
                $doIt = $temp.find('.q_doit');

            $title.remove();
            if ($doIt.length > 0) {
                $doIt.html(parseContentBB($doIt.html(), false))
            }

            let itemsToBring = $temp.find('.q_bring');
            let length = itemsToBring.length;
            let itemsArray = [];
            for (let j = 0; j < length; j++) {
                let text = itemsToBring.eq(j).text();
                text = text.replace("ZdobÄdÅº: ", "");
                text = text.replace(/\s\([0-9]+\/[0-9]+\)/, "");
                itemsArray.push(text);
            }

            $box.find('.d-table').remove();

            $box.addClass('quest-' + qId);
            $box.find('.quest-title').html(title);

            if ($temp.find('[data-cancellable]').length > 0) {
                this.leaveQuest($temp, $buttons, qId);
            }
            this.trackingQuest($buttons, qId);
            this.questsObserve($buttons, qId);
            this.showDetails($buttons, $box, qId);

            this.addOneQuestData(qId, title, $temp, $buttons, itemsArray);

            $box.find('.quest-content').html($temp);
            $box.find('.quest-buttons-wrapper').html($buttons);
            this.appendToQuestToList(qId, $box);
        }
        self.updateScroll();
        addHighlightsInQuestItems();
    };

    const checkItemsExistAddAddQuestHihglight = (itemName) => {
        getEngine().heroEquipment.setClassInItemsHighlightIfExist(itemName, QuestData.HIGHLIGHT_CLASS.QUEST)
    };

    const checkItemRemoveFromQuestAndRemoveFromQuest = (itemName) => {
        getEngine().heroEquipment.unsetClassInItemsHighlightIfExist(itemName, QuestData.HIGHLIGHT_CLASS.QUEST)
    };

    const addHighlightsInQuestItems = () => {
        if (!getEngine().interface.getInterfaceStart()) {
            return
        }

        if (!questsData) return;

        let activeQuestTrackingId = getEngine().questTracking.getActiveQuestTrackingInStorage();
        if (activeQuestTrackingId == null) return;

        let oneQuestData = questsData[activeQuestTrackingId];
        if (!oneQuestData) return;

        let itemsArray = oneQuestData.itemsArray;
        if (!itemsArray.length) return;

        for (let i = 0; i < itemsArray.length; i++) {

            let name = itemsArray[i];
            checkItemsExistAddAddQuestHihglight(name)
        }
    }

    const clearHighlightQuestInItems = () => {
        if (!getEngine().interface.getInterfaceStart()) {
            return
        }

        getEngine().heroEquipment.clearHighlightInItems(QuestData.HIGHLIGHT_CLASS.QUEST);
    };

    const checkItemIsQuestItemAndAddHigllight = (name, id) => {
        if (!questsData) return;

        let activeQuestTrackingId = getEngine().questTracking.getActiveQuestTrackingInStorage();
        if (activeQuestTrackingId == null) return;

        let oneQuestData = questsData[activeQuestTrackingId];
        if (!oneQuestData) return;

        let itemsArray = oneQuestData.itemsArray;
        if (!itemsArray.length) return;

        for (let i = 0; i < itemsArray.length; i++) {
            if (itemsArray[i] == name) {

                let $highlight = getEngine().heroEquipment.getAmountItem$highlightById(name, id);

                if (!$highlight) continue;

                if (!$highlight.hasClass(QuestData.HIGHLIGHT_CLASS.QUEST)) $highlight.addClass(QuestData.HIGHLIGHT_CLASS.QUEST);
            }
        }

    };

    this.appendToQuestToList = (questId, $questBox) => {
        if (this.wnd.$.find('.quest-' + questId).length) {
            this.wnd.$.find('.quest-' + questId).replaceWith($questBox);
            Engine.questsObserve.updateOneQuestObserve(questId);
        } else this.wnd.$.find('.quest-log .scroll-pane').append($questBox);
    };

    this.showDetails = function($buttons, $box, id) {
        var bool = Storage.get('hideQuest/' + id);
        var clBtn = bool ? 'show' : 'hide';
        var vBox = bool ? 'none' : 'block';
        var $btn = Tpl.get('button').addClass('small green');
        var bck = Tpl.get('add-bck').addClass(clBtn);

        $box.find('.quest-content').css('display', vBox);
        $btn.find('.label').html('0').css('visibility', 'hidden');
        $btn.append(bck);
        $btn.tip(_t('hideOrShowquest'));
        $btn.on('click', function() {

            var $details = $box.find('.quest-content');
            var bool = $details.css('display') == 'block';
            var $bck = $(this).find('.add-bck');
            $bck.removeClass('show hide');
            if (bool) {
                $details.css('display', 'none');
                $bck.addClass('show');
                Storage.set('hideQuest/' + id, true);
            } else {
                $details.css('display', 'block');
                $bck.addClass('hide');
                Storage.set('hideQuest/' + id, false);
            }
            self.updateScroll();
        });
        $buttons.push($btn);
    };

    this.leaveQuest = function($temp, $buttons, id) {
        var $abandonBtn = Tpl.get('button').addClass('small green remove');
        $abandonBtn.find('.label').html('0').css('visibility', 'hidden');
        $abandonBtn.tip(_t('removequest'));
        $abandonBtn.on('click', function(e) {
            e.stopPropagation();
            self.cancelQuest(id);
        });
        var bck = Tpl.get('add-bck').addClass('delete');
        $abandonBtn.append(bck);
        $buttons.push($abandonBtn);
    };

    this.questsObserve = (buttons, qId) => {
        let $observeButton = Tpl.get('button').addClass('small observe button-observe-id-' + qId);
        let bck = Tpl.get('add-bck').addClass('observed');

        $observeButton.find('.label').html('0').css('visibility', 'hidden');
        $observeButton.tip(_t('add_to_observe'));
        $observeButton.append(bck);
        $observeButton.click(function() {
            let isActive = $(this).hasClass('green');

            if (isActive) self.removeObserve(qId);
            else {
                let canObserve = Engine.questsObserve.checkCanObserve();
                if (!canObserve) return;
                _g('quests&a=observe_add&quest_id=' + qId);
            }
        });

        buttons.push($observeButton);
    };

    this.removeObserve = (id) => {
        _g('quests&a=observe_remove&quest_id=' + id);
    };

    this.setStateOfObserveOnButton = (qId, state) => {
        let $b = this.wnd.$.find('.button-observe-id-' + qId);

        state ? $b.addClass('green') : $b.removeClass('green')
    };

    this.trackingQuest = function($buttons, id) {
        var $trackBtn = Tpl.get('button');

        $trackBtn.addClass('small track button-tracking-id-' + id);
        $trackBtn.find('.label').html('0').css('visibility', 'hidden');
        $trackBtn.tip(_t('turnonOfftracking'));

        $trackBtn.on('click', function(e) {
            e.stopPropagation();

            let activeQuestTrackingInStorage = getEngine().questTracking.getActiveQuestTrackingInStorage();
            let questId = activeQuestTrackingInStorage == id ? 0 : id;
            _g('quests&a=track_set&quest_id=' + questId);
        });

        $trackBtn.append(Tpl.get('add-bck').addClass('tracking'));
        $buttons.push($trackBtn);
    };

    this.cancelQuest = function(id) {
        mAlert(_t('quest_cancel_confirm', null, 'quest'), [{
            txt: _t('yes', null, 'buttons'),
            callback: function() {
                _g('quests&a=cancel&quest_id=' + id);
                return true;
            }
        }, {
            txt: _t('no', null, 'buttons'),
            callback: function() {
                return true;
            }
        }]);
    };


    this.refreshTrackQuestButtons = refreshTrackQuestButtons;
    this.setTrackItemsAfterInterfaceStart = setTrackItemsAfterInterfaceStart;
    //this.checkItemsExistAddAddQuestHihglight = checkItemsExistAddAddQuestHihglight;
    this.checkItemIsQuestItemAndAddHigllight = checkItemIsQuestItemAndAddHigllight;
    this.addHighlightsInQuestItems = addHighlightsInQuestItems;
    this.clearHighlightQuestInItems = clearHighlightQuestInItems;
};