/**
 * Created by Michnik on 2015-11-13.
 */
var Tpl = require('@core/Templates');
var DraconiteShop = require('@core/shop/DraconiteShop');
var EmotionsData = require('@core/emotions/EmotionsData');
var DialogueData = require('@core/dialogue/DialogueData');
var TextModifyByTag = require('@core/TextModifyByTag');
let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');
let WindowManageOpacity = require('@core/window/WindowManageOpacity');
let WindowManageSize = require('@core/window/WindowManageSize');
const {
    nickUppercase
} = require('../TextModifyByTag');

module.exports = function() {
    var self = this;
    var bubble = false;
    var animationDone = false;
    var normalDialog;
    var $dlgMsg = '';
    var $dlgAnsw = [];
    var shopID = null;
    var dialogCreated = false;

    let dialogName = null;

    var lines = 0;
    let bubbleUpdate = false;
    let bubbleLastPos = 0;
    let items = {};

    let windowManageOpacity;
    let windowManageSize;

    let resizeNormalDialog = false;

    var talk = {
        id: 0,
        soundId: 0,
        rewardsExist: false
    };

    let centerOnData = null;

    const setCenterOnData = (kind, x, y) => {

        if (kind == CanvasObjectTypeData.HERO) {
            centerOnData = {
                kind: kind,
                x: null,
                y: null
            };
            return
        }

        centerOnData = {
            kind: kind,
            x: x,
            y: y,
        };
    }

    const getDialogueCenterPos = () => {

        //if (!centerOnData) return {x: Engine.hero.d.x, y: Engine.hero.d.y};

        if (centerOnData.kind == CanvasObjectTypeData.HERO) return {
            x: Engine.hero.d.x,
            y: Engine.hero.d.y
        };

        return {
            x: centerOnData.x,
            y: centerOnData.y
        };
    };

    this.init = function() {
        self.$ = Tpl.get('dialogue-window'); // default window
        var transitionEvent = whichTransitionEvent();
        transitionEvent && self.$[0].addEventListener(transitionEvent, function() {
            $('.scroll-wrapper', self.$).trigger('update').trigger('scrollTop');
            animationDone = true;
        }, false);
        Engine.interfaceItems.setDisableSlots('dialogue');
        Engine.items.fetch(Engine.itemsFetchData.NEW_QUEST_REWARD_ITEM, self.newQuestRewardItem);
        setCenterOnData(CanvasObjectTypeData.HERO);

        initWindowManageOpacity();
        initWindowManageSize();

        initHamburger();

        // if (Engine.loots) Engine.loots.acceptLoot();
    };

    const initWindowManageOpacity = () => {
        windowManageOpacity = new WindowManageOpacity();

        windowManageOpacity.init(this, DialogueData.DIALOGUE_WINDOW, self.$, self.$);
        windowManageOpacity.setManageOpacity(4);
    };

    const initHamburger = () => {

        if (!mobileCheck()) {
            return;
        }

        let $manageHamburgerButton = createHamburgerMenuButton('dialogue-hamburger-button', function(e, menu) {
            menu.push([_t('WINDOW_OPACITY_UP'), function() {
                windowManageOpacity.increaseOpacity()
            }, {
                button: {
                    cls: 'not-close'
                }
            }])
            menu.push([_t('SIZE_UP'), function() {
                windowManageSize.callNextSizeOpt()
            }, {
                button: {
                    cls: 'not-close'
                }
            }]);
        });


        self.$.append($manageHamburgerButton)

    }

    const initWindowManageSize = () => {
        let sizeArray = [{
                h: 55
            },
            {
                h: 125
            },
            {
                h: 225
            },
            {
                h: 300
            }
        ];

        windowManageSize = new WindowManageSize();

        windowManageSize.init(null, DialogueData.DIALOGUE_WINDOW, self.$, self.$.find('.scroll-wrapper'), sizeArray, scrollUpdate, {
            setSizeOnContent: true
        });
        windowManageSize.updateSizeWindow();
    };

    this.checkIfBubbleExist = () => {
        return isset(Engine.dialogue) && self.$.length > 0 && self.$.hasClass('bubbledialog');
    };

    this.talk = function(data, allData) {
        if (self.checkIfBubbleExist()) {
            self.finish();
            return;
        }
        //Engine.zoomManager.setZoom(2)
        Engine.lock.add('npcdialog');
        self.clearTalkEmo();
        bubble = !talk.id;
        var tmp = null;
        $dlgMsg = '';
        $dlgAnsw = [];
        var counter = 0;

        if (parseInt(data[0]) === 4) {
            if (!talk.id) {
                self.endTalk();
                return;
            }
        } else {
            this.closeOtherWindows();
        }

        for (var i = 0; i < data.length; i += 3) {
            data[i] = parseInt(data[i]);
            shopID = null;

            tmp = self.updateTalkProperties(data[i], data[i + 1], data[i + 2]);
            if (tmp == 'break') {
                return;
            }
            if (tmp == 'continue') continue;

            data[i + 1] = self.fillNick(data[i + 1]);
            data[i + 1] = self.fillNickUppercase(data[i + 1]);
            data[i + 1] = self.fillSex(data[i + 1]);
            data[i + 1] = self.centerOnInterlocutor(data[i + 1], allData);
            data[i + 1] = self.testBoxoff(data[i + 1]);
            data[i + 1] = self.testTown(data[i + 1]);
            data[i + 1] = self.testReward(data[i + 1]);
            data[i + 1] = self.testPlay(data[i + 1]);
            data[i + 1] = self.testShop(data[i + 1]);
            data[i + 1] = self.testSubStr(data[i + 1]);
            data[i + 1] = self.testSakwa(data[i + 1]);
            data[i + 1] = self.testImg(data[i + 1]);

            self.checkNpcTalk(data[i], data[i + 1], data[i + 2]);
            self.checkPlayerOptions(data[i], data[i + 1], data[i + 2], shopID, counter);
            counter++;
        }
        dialogCreated = false;
        if (bubble) {
            self.useBubbleDialog();
        } else {
            self.useNormalDialog();
        }

    };

    this.useBubbleDialog = function() {

        switch (talk.id) {
            case DialogueData.PLAYER:
                talk.npc = Engine.npcs.getById(talk.id);
                break;
            case DialogueData.PET:
                if (Engine.hero.havePet()) talk.npc = Engine.hero.getPet();
                break;
            default:
                if (Engine.npcs.checkNpc(talk.id)) talk.npc = Engine.npcs.getById(talk.id);
        }

        //self.setEmo(talk.id);

        if (talk.npc && talk.npc.d.y >= 5) {
            self.createBubbleDialog();
        } else {
            bubble = false;
            self.useNormalDialog();
        }
    };

    this.setEmo = (kind) => {
        switch (kind) {
            case DialogueData.ANY:
                break;
            case DialogueData.PLAYER:
                Engine.emotions.updateData([{
                    name: EmotionsData.NAME.NPC_TALK,
                    source_id: Engine.hero.d.id,
                    source_type: EmotionsData.OBJECT_TYPE.HERO
                }]);
                break;
            case DialogueData.PET:
                return;
                if (Engine.hero.havePet()) {
                    Engine.emotions.updateData([{
                        name: EmotionsData.NAME.NPC_TALK,
                        source_id: Engine.hero.pet.d.id,
                        source_type: EmotionsData.OBJECT_TYPE.PET
                    }]);
                }
                break;
            default:
                if (Engine.npcs.checkNpc(talk.id)) {
                    Engine.emotions.updateData([{
                        name: EmotionsData.NAME.NPC_TALK,
                        source_id: talk.id,
                        source_type: EmotionsData.OBJECT_TYPE.NPC
                    }]);
                }
        }
    };

    this.clearTalkEmo = () => {
        Engine.emotions.deleteEmoByType(EmotionsData.NAME.NPC_TALK)
    };

    this.useNormalDialog = function() {
        Engine.interface.getBottomPositioner().append(self.$);

        self.createNormalDialog();
        self.setEmo(talk.id);
        let scrollbarExist = $('.scroll-wrapper .scrollbar-wrapper', self.$).length;
        if (!scrollbarExist) {
            $('.scroll-wrapper', self.$).addScrollBar({
                track: true
            });
        }

    };

    this.getBubble = function() {
        return bubble;
    };

    this.checkNpcTalk = function(data, text, c) {
        if (data & 1) { // npc talk

            var endTalkText = _t('end_talk1', null, 'talk'); //'ZakoÅcz rozmowÄ'
            var $li = Tpl.get('dialogue-window-answer');
            var $icon = $li.find('.icon');
            var $answerText = $li.find('.answer-text');

            if (talk.type == 4 || talk.type == 5) endTalkText = _t('end_talk2', null, 'talk'); //'Koniec'

            talk.bubbleEndLineCommand = 'talk&id=' + talk.id + '&c=' + c;
            talk.bubbleEndLineTxt = endTalkText;
            talk.bubbleTxt = text;

            $dlgMsg = text;
            if (data & 4) {
                $li.addClass('line_exit');
                $icon.addClass('line_exit');
                $answerText.text(endTalkText);
                $dlgAnsw.push($li);
            } else if (c) {
                $icon.addClass('line_option');
                $answerText.text(_t('dialog_next', null, 'talk'));
                bubble = false;
                $dlgAnsw.push($li);
            }
            $li.on('click', function() {
                return new(function() {
                    _g('talk&id=' + talk.id + '&c=' + c, function(v) {});

                })();
            });

            if (text.length > 180) bubble = false;
        }
    };

    this.checkPlayerOptions = function(data, text, c, id, counter) {
        if (data & 2) {
            var liClass = self.getLineClass(data);
            var $li = Tpl.get('dialogue-window-answer');
            $li.addClass(liClass);

            var $icon = $li.find('.icon');
            var $answerText = $li.find('.answer-text');

            var i = counter < 10 ? counter + '. ' : '';
            lines++;
            if (lines > 1 || !(data & 4)) bubble = false;
            talk.bubbleEndLineCommand = 'talk&id=' + talk.id + '&c=' + c;
            talk.bubbleEndLineTxt = text;

            $icon.addClass(liClass);
            $answerText.html(i + parseContentBB(text));
            $li.click(function() {
                self.clickLineDialog(talk, c, id);
            });
            $dlgAnsw.push($li);
        }
    };

    this.clickLineDialog = function(talk, c, id) {
        _g('talk&id=' + talk.id + '&c=' + c, function(v) {
            Engine.interface.checkTeleport(v);
            //if (v.t == 'reload') Engine.reloadStats = false;
        });
        if (id == 'gold') {
            if (!Engine.goldShop) _g('creditshop&credits_gold=-1');
        } else if (id == 'sl') {
            if (!Engine.draconiteShop) {
                Engine.draconiteShop = new DraconiteShop();
                Engine.draconiteShop.open();
            }
        }
    };

    this.hotKeyLine = function(key) {
        var $answer = self.$.find('.answers').children().eq(parseInt(key) - 1);
        if ($answer.length == 0) return;
        $answer.click();
    };

    this.getLineClass = function(val) {
        var opts = {
            2: 'line_option',
            4: 'line_exit',
            8: 'line_new_quest',
            16: 'line_cont_quest',
            32: 'line_shop',
            64: 'line_attack',
            128: 'line_game',
            256: 'line_heal',
            512: 'line_option',
            1024: 'line_option',
            2048: 'line_motel',
            4096: 'line_auction',
            8192: 'line_mail',
            16384: 'line_depo',
            32768: 'line_option',
            65536: 'line_barter',
            131072: 'line_bonus_reselect'
        };
        var i = 131072;
        while (i > 1) {
            if (val & i) return opts[i];
            i >>= 1;
        }
        return null;
    };

    this.updateTalkProperties = function(data, name, id) {
        if (!data) {
            talk.name = name;
            talk.id = id;
            self.setTutorial(talk.id, 1);
            talk.type = 1;
            talk.dialogCloud = id;
            talk.rewardsExist = false;

            return 'continue';
        }
        if (data == 4) { // end dialog
            self.endTalk();
            return 'break';
        }
    };

    this.fillNick = function(data) {
        return data
            .split('~')
            .join(',')
            .split('[NICK]')
            .join(Engine.hero.d.nick);
    };

    this.fillNickUppercase = function(data) {
        return nickUppercase(data);
    };

    this.fillSex = function(data) {
        return TextModifyByTag.sexModify(data);
    };

    this.centerOnPlayer = function(allData) {
        let x = Engine.hero.d.x,
            y = Engine.hero.d.y;

        if (isset(allData.h) && isset(allData.h.x) && isset(allData.h.y)) {
            x = allData.h.x;
            y = allData.h.y;
        }

        Engine.map.centerOn(x, y);
        setCenterOnData(CanvasObjectTypeData.HERO);

        talk.npc = Engine.hero;
        talk.name = Engine.hero.nick;
        talk.dialogCloud = Engine.hero.d.id;
        talk.id = DialogueData.PLAYER;
    };

    this.centerOnPet = function(allData) {
        let x = Engine.hero.pet.d.x,
            y = Engine.hero.pet.d.y;

        if (isset(allData.h) && isset(allData.h.x) && isset(allData.h.y)) {
            x = allData.h.x;
            y = allData.h.y;
        }

        Engine.map.centerOn(x, y);
        setCenterOnData(CanvasObjectTypeData.PET, x, y);

        talk.npc = Engine.hero.pet;
        talk.name = Engine.hero.pet.d.name;
        talk.dialogCloud = Engine.hero.pet.d.id;
        talk.id = DialogueData.PET;
    };

    this.centerOnNpc = function(npcId) {
        npcId = npcId == DialogueData.THIS ? talk.id : npcId;
        var npc = Engine.npcs.getById(npcId);

        if (npc) {
            Engine.map.centerOn(npc.d.x, npc.d.y);
            setCenterOnData(CanvasObjectTypeData.NPC, npc.d.x, npc.d.y);

            talk.npc = npc;
            talk.name = npc.d.nick;
            talk.id = npcId;
        }
        talk.dialogCloud = npcId;
    };

    this.centerOnInterlocutor = function(data, allData) {

        let req = new RegExp('#([0-9]+|' + DialogueData.THIS + '|' + DialogueData.PLAYER + '|' + DialogueData.PET + ')#');

        //setCenterOnData(CanvasObjectTypeData.HERO)

        if (req.test(data)) {

            let npcId = req.exec(data)[1];

            switch (npcId) {
                case DialogueData.PLAYER:
                    self.centerOnPlayer(allData);
                    break;
                case DialogueData.PET:
                    if (!Engine.hero.havePet()) return data.replace(req, '');
                    self.centerOnPet(allData);
                    break;
                default:
                    self.centerOnNpc(npcId);
            }

            bubbleUpdate = true;

            return data.replace(req, '');
        }
        return data;
    };

    this.updateBubblePos = function() {
        if (!bubble || !talk.npc) return;

        const $canvas = Engine.interface.get$GAME_CANVAS();
        const iOffset = Engine.interface.get$interfaceLayer().offset();

        let npos = {
            left: (talk.npc.d.x - (Math.round(Engine.map.offset[0]) / 32)) * 32 - iOffset.left + ($canvas.offset().left / Engine.zoomFactor),
            top: (talk.npc.d.y - Math.floor(Engine.map.offset[1] / 32)) * 32 - iOffset.top + ($canvas.offset().top / Engine.zoomFactor),

            'margin-left': -(self.$.width()) + 16,
            'margin-top': -(self.$.height() + talk.npc.fh - 16)
        };
        if (npos.left < self.$.width() + $canvas.offset().left) {
            self.$.find('.bg-layer').addClass('left');
            // npos.left = npos.left + self.$.width() + talk.npc.fw;
            npos['margin-left'] = 16;
        } else {
            self.$.find('.bg-layer').removeClass('left');
        }

        npos.left += 'px';
        npos.top += 'px';
        npos['margin-left'] += 'px';
        npos['margin-top'] += 'px';

        if (bubbleLastPos.left !== npos.left || bubbleLastPos.top !== npos.top) {
            bubbleLastPos = npos;
            self.$.css(npos);
        }
    };

    this.updateDialogAfterChangeNpc = function(npc) {
        if (talk.id === npc.d.id && bubble) {
            if (dialogCreated) {
                self.updateBubblePos();
            } else {
                self.useBubbleDialog();
            }
        }
    };

    this.createNormalDialog = function() {
        let name = talk.name.split('[br]')[0];
        const npcMessage = talk.rewardsExist ? $dlgMsg : parseContentBB($dlgMsg);

        normalDialog = true;
        dialogCreated = true;

        setDialogName(name);

        this.$.find('.content .npc-message').html(npcMessage);
        this.$.find('.content .answers').html($dlgAnsw);
        //this.$.find('header .h_content').html(parseBasicBB(name, false)); // second argument for not escapeHTML
        this.manageDialogHeaderText();
        //this.$.css('transform');
        this.$.addClass('is-open');

        this.setSizeAndPosOfNormalDialog();

        $('.scroll-wrapper', this.$).trigger('update').trigger('scrollTop');
    };

    const scrollUpdate = () => {
        $('.scroll-wrapper', this.$).trigger('update');
    }

    const setDialogName = (_dialogName) => {
        dialogName = _dialogName;
    };

    const fillDialogHeaderText = (text) => {
        this.$.find('.h_content').html(parseBasicBB(text));
    };

    this.manageDialogHeaderText = () => {
        let rajDialogName = Engine.rajDialogue.getDialogName();

        if (rajDialogName) {
            fillDialogHeaderText(rajDialogName);
            return
        }

        fillDialogHeaderText(dialogName);
    };

    this.newQuestRewardItem = function(item) {
        items[item.id] = item;
        self.createAndAppendQuestRewardItem(item);
        item.on('afterUpdate', function() {
            self.createAndAppendQuestRewardItem(item, true);
        });
    };

    this.createAndAppendQuestRewardItem = function(item, checkExist) {
        var $itemSlot = self.$.find('#rew-item' + item.id);
        if (checkExist && !$itemSlot.length) return;

        var $clone = Engine.items.createViewIcon(item.id, Engine.itemsViewData.DIALOGUE_ITEM_VIEW)[0];
        $itemSlot.append($clone);
    };

    this.createBubbleDialog = function() {
        self.$ = Tpl.get('bubbledialog');
        dialogCreated = true;
        Engine.interface.get$interfaceLayer().append(self.$);

        var $bubbleDialogAnswer = Tpl.get('bubbledialog-answer');
        $bubbleDialogAnswer.addClass('endtalk2').html('1. ' + parseContentBB(talk.bubbleEndLineTxt));

        $bubbleDialogAnswer.on('click', function() {
            return new(function() {
                _g(talk.bubbleEndLineCommand, function(v) {});

            })();
        });

        self.$.find('.message').html(parseContentBB(talk.bubbleTxt));
        self.$.find('.answers').html($bubbleDialogAnswer);
        this.updateBubblePos();
    };

    this.checkIsBubbleCloud = function() {
        if (bubble) {
            _g(talk.bubbleEndLineCommand, function(v) {});
            return true;
        }
        return false;
    };

    this.testSakwa = function(data) {
        if (/<sakwa>/.test(data)) {
            return data.replace(/<sakwa>/, '');
        }
        return data;
    };

    this.testBoxoff = function(data) {
        if (/#BOXOFF#/.test(data)) {
            bubble = false;
            return data.replace(/#BOXOFF#/, '');
        }
        return data;
    };

    this.testTown = function(data) {
        if (/#TOWN#/i.test(data)) {
            talk.name = Engine.map.d.name;
            return data.replace(/#TOWN#/i, '');
        }
        return data;
    };

    this.testImg = function(data) {
        if (/<img src=/.test(data)) {
            return data.replace(/<img src=/, '<img onload=setTimeoutScroll() src=');
        }
        return data;
    };

    this.testReward = function(data) {
        if (/#REWARD/.test(data)) {
            talk.rewardsExist = true;
            var $rewards = Tpl.get('dialogue-window-rewards');
            var rew = data.split('#REWARD').splice(1);
            var list = {};
            var tmp = null;
            var profs = null;
            for (var i = 0; i < rew.length; i++) {
                var parts = rew[i].split(',');
                for (var j = 0; j < parts.length; j++) {
                    var pair = parts[j].split(':');
                    if (pair[0] == 'prof') {
                        var pList = pair[1].split(' ');
                        profs = {};
                        for (var p = 0; p < pList.length; p++) {
                            tmp = pList[p].replace(' ', '').split('->');
                            profs[tmp[1]] = tmp[0];
                        }
                    } else {
                        tmp = pair[0].split('.');
                        if (!isset(list[tmp[1]])) list[tmp[1]] = [];
                        if (tmp[0] == 'item') {
                            if (typeof(list[tmp[1]][tmp[0]]) != 'object') list[tmp[1]][tmp[0]] = [];
                            list[tmp[1]][tmp[0]].push(pair[1].replace(' ', ''));
                        } else {
                            list[tmp[1]][tmp[0]] = pair[1].replace(' ', '');
                        }
                    }
                }
            }
            var rewards = this.drawRewards(profs, list);
            $rewards.find('.rewards-header').html(_t('reward_header', null, 'talk'));
            $rewards.find('.rewards-items').html(rewards);
            return data.replace(/#REWARD.*/, $rewards.prop('outerHTML')); // convert jQuery object "$rewards" to string for replace
        }
        return data;
    };

    this.drawRewards = function(profs, list) {
        var ret = [];
        for (var i in list) {
            var p = list[i];
            var $rewardLine = Tpl.get('dialogue-window-reward-line');
            $rewardLine.addClass((profs !== null && profs[i].search(Engine.hero.d.prof) >= 0) || profs === null ? ' mine' : '');

            if (isset(p.item)) {
                var itemsElement = [];
                for (var j = 0; j < p.item.length; j++) {
                    var $rewardItem = Tpl.get('dialogue-window-reward-item');
                    $rewardItem.addClass('rew_item_' + p.item[j]);
                    $rewardItem.find('.rew-item-slot').attr('id', 'rew-item' + p.item[j]);
                    itemsElement.push($rewardItem);
                }
                $rewardLine.append(this.addRewardElement('rew_item', itemsElement));
            }
            if (isset(p.gold)) $rewardLine.append(this.addRewardElement('rew_gold', p.gold));
            if (isset(p.exp)) $rewardLine.append(this.addRewardElement('rew_exp', p.exp));
            if (isset(p.ph)) $rewardLine.append(this.addRewardElement('rew_ph', p.ph));

            ret.push($rewardLine);
        }
        return ret;
    };

    this.addRewardElement = function(name, content) {
        var $rewardEl = Tpl.get('dialogue-window-reward-el');

        $rewardEl.addClass(name);
        $rewardEl.find('.label').html(_t(name, null, 'talk'));
        $rewardEl.append(content);

        return $rewardEl;
    };

    this.testPlay = function(data) {
        if (/#PLAY\(.*?\)/.test(data)) {
            var path = /#PLAY\((.*?)\)/.exec(data)[1];
            var tmpSound = soundManager.createSound({
                id: 'dialogSound' + talk.soundId++,
                url: path,
                autoPlay: true,
                onfinish: function() {
                    tmpSound.destruct();
                }
            });
            return data.replace(/#PLAY\((.*?)\)/, '');
        }
        return data;
    };

    this.testShop = function(data) {
        if (/#SHOP\(.*?\)#/.test(data)) {
            shopID = /#SHOP\((.*?)\)#/.exec(data)[1];
            return data.replace(/#SHOP\(.*?\)#/, '');
        }
        return data;
    };

    this.testSubStr = function(data) {
        if (data.substr(0, 1) == '_') {
            return data.substr(1);
        }
        return data;
    };

    this.setTutorial = function(id, nrTutorial) {
        var t = [23085, 21933, 22310, 21952, 22172, 17176];

        for (var i = 0; i < t.length; i++) {
            if (t[i] == id) {
                return;
            }
        }
    };

    this.setSizeAndPosOfNormalDialog = () => {
        let cssSize = this.getCssSize();
        //let cssPosition = this.getCssPosition(cssSize.width);

        //this.$.css({
        //	'font-size' : cssSize.fontSize,
        //	width		    : cssSize.width,
        //	height		  : cssSize.height,
        //	left		    : cssPosition.left,
        //	transform	  : cssPosition.transform
        //})
    };

    this.onResize = () => {
        bubbleUpdate = true;
        if (normalDialog) {
            this.setSizeAndPosOfNormalDialog();
        }
    };

    this.getCssSize = () => {
        let interfaceLayerWidth = Engine.interface.get$interfaceLayer().width();
        let width = null;
        let height = null;
        let fontSize = null;

        if (interfaceLayerWidth > 1600) {
            width = 850;
            height = 400;
            fontSize = "1.5em";
        } else if (interfaceLayerWidth > 1400) {
            width = 850;
            height = 350;
            fontSize = "1.5em;";
        } else if (interfaceLayerWidth > 1200) {
            width = 700;
            height = 350;
            fontSize = "1.2em";
        } else {
            width = 600;
            height = 300;
            fontSize = "1.0em";
        }

        return {
            width,
            height,
            fontSize
        }

    };

    this.getCssPosition = (outerWidth) => {
        let eqColumnIsShow = Engine.interface.checkEqColumnIsShow();
        let objectCoverEqColumn = Engine.interface.centerObjectCoverEqColumn(outerWidth);
        let isOpen = this.$.hasClass('is-open') ? 0 : 100;

        let _DEFAULT = getEngine().ResolutionData.KEY._DEFAULT
        let resolutionKey = getEngine().resolution.getResolutionKey();

        if (eqColumnIsShow && resolutionKey == _DEFAULT) {

            if (objectCoverEqColumn) {
                return {
                    transform: "translate(0%, " + isOpen + "%)",
                    left: Engine.interface.getXPosOfObjectStickToEqColumn(outerWidth)
                }
            } else {
                return {
                    transform: "translate(-50%, " + isOpen + "%)",
                    left: "50%"
                }
            }
        } else {
            return {
                transform: "translate(-50%, " + isOpen + "%)",
                left: "50%"
            }
        }
    }

    this.endTalk = function() {
        //Engine.zoomManager.setZoom(1)
        this.finish();
        talk.id = 0;
        talk.soundId = 0;
        Engine.lock.remove('npcdialog');
        delete talk.block;
    };

    this.finish = function() {
        this.setTutorial(talk.id, 2);
        if (normalDialog) {
            this.$.removeClass('is-open');
            this.setSizeAndPosOfNormalDialog();
        }
        bubble = false;
        Engine.items.removeCallback(Engine.itemsFetchData.NEW_QUEST_REWARD_ITEM);
        self.itemsClear();
        talk.npc = {};
        //self.removeClouds();
        Engine.lock.remove('npcdialog');
        self.clearTalkEmo();

        self.dialogRemove()
    };

    this.update = () => {
        if (bubble) {
            this.updateBubblePos();
            bubbleUpdate = false;
        }
    };

    this.dialogRemove = () => {
        self.$.remove();
        Engine.interfaceItems.setEnableSlots('dialogue');
        Engine.dialogue = false;
    };

    this.itemsClear = () => {
        for (let k in items) {
            Engine.items.deleteItem(k);
            delete items[k];
        }
        items = {};
    }

    this.closeOtherWindows = () => {
        const v = Engine.windowsData.windowCloseConfig.DIALOGUE;
        Engine.windowCloseManager.callWindowCloseConfig(v);
    }

    this.getDialogueCenterPos = getDialogueCenterPos;
};