/**
 * Created by lukasz on 2014-10-16.
 */
var Templates = require('core/Templates');
var Storage = require('core/Storage');
var MCAddon = require('core/MCAddon');
var SMCAddon = require('core/SMCAddon');

module.exports = function() {
    this.$ = null;
    var $messages,
        $quickMessages,
        inputAllMessage = '',
        mobileInputAllMessage = '',
        $input,
        $mInput,
        $tabs,
        ctrl = false;

    var alldistanceCard = 0;
    var oldX = 0;
    var oldY = 0;

    var self = this;
    var activeTab = 0;
    var messages = null;
    var maxTs = null;
    var clearMessages = true;
    var timeTable = {}; // key: ts, val: wasShow
    var edit = false;
    var firstUpdate = true;
    var newMsg = false;
    var lastPrivMsgAutor = '';

    const lastMessages = [];
    let lastMessageId = null;
    let activeMessage = null;


    this.setChatOverAdditionaBarPanel = function(state) {
        var bottom = state ? 48 : 0;
        self.$.css('bottom', bottom + 'px');
    };

    this.newMessages = function(d) {
        newMsg = true;
        if (firstUpdate) {
            firstUpdate = false;
            self.initPrivCards();
        }
        var lastMessagesFromMap = [];
        if (clearMessages) $messages.html('');
        var holdMessages = messages == null;
        if (messages == null) messages = [];
        for (var i in d) {
            var ts = d[i].ts;
            var tsExist = self.isTsExistInTimeTable(ts);

            var isSystem = d[i].n == 'System';
            var isSysRed = d[i].s == 'sys_red';
            var isSysRedSystem = isSystem && isSysRed;

            //if (timeTable.indexOf(d[i].ts) > -1) {
            if (tsExist) {
                if (!isSysRedSystem) continue;
            }

            this.setCategory(d[i]);
            messages.push(d[i]);
            if (!holdMessages) {
                //if (timeTable.indexOf(d[i].ts) > -1 && isSystem) continue;
                if (tsExist && isSystem) continue;
                lastMessagesFromMap.push(d[i]);

            }
            if (ts != 0) {
                //timeTable.push(d[i].ts);
                self.addTsToTimeTable(ts);
            }
        }

        //console.log(lastMessagesFromMap);

        lastMessagesFromMap.reverse();
        if (lastMessagesFromMap.length > 0) {
            for (var j = 0; j < lastMessagesFromMap.length; j++) {
                if (j == 0 && lastMessagesFromMap[j].ts == 0) continue;
                this.appendMessage(lastMessagesFromMap[j]);
            };
        }

        //first fill messages after map change and on refresh
        if (holdMessages) {
            this.changeTab(Storage.get('chat/tab', 0));
        }
        clearMessages = false;
        newMsg = false;
    };

    this.isTsExistInTimeTable = function(ts) {
        return isset(timeTable[ts]);
    };

    this.addTsToTimeTable = function(ts) {
        timeTable[ts] = self.isTsExistInTimeTable(ts);
    };

    this.getAmountCards = function() {
        var cards = this.$.find('.tabs-wrapper').children();
        var count = 0
        cards.each(function() {
            if ($(this).css('display') != 'none') count++;
        });
        return count;
    };

    this.setCategory = function(d) {
        if (d.k != 3) return;
        var $cards = this.$.find('.tab');
        var cardExist = false;
        $cards.each(function() {
            var nick = Engine.hero.d.nick;
            var searchCl = d.n == nick ? d.nd : d.n;
            if ($(this).hasClass(self.changeNickToIdString(searchCl))) cardExist = true;
        });
        d.where = cardExist ? 'onlyPriv' : 'general';
    };

    this.setVisibleCard = function(which, bool) {
        var t = ['none', 'inline-block'];
        //$("div[data-tab=" + which + "]").css('display', t[bool]);
        //$('.game-window-positioner').find("div[data-tab=" + which + "]").css('display', t[bool]);
        Engine.interface.get$gameWindowPositioner().find("div[data-tab=" + which + "]").css('display', t[bool]);
        if (activeTab == which && t[bool] == 'none') self.changeTab(0);
    };

    this.createCard = function(nr, tip, text, priv, avatar) { // tip true = tip  ; tip false = attr('data-trans')
        var $div = Templates.get('chat-tab').attr('data-tab', nr);
        if (tip) $div.tip(text); //for private tab
        else $div.tip(_t(text)); //for default tabs

        if (text == 'chat_global_tab' || priv) {
            var globalTabInfo;
            if (priv) {
                globalTabInfo = _t('close_priv_card', null, 'chat');
            } else {
                globalTabInfo = !mobileCheck() ? _t('global_tab_info', null, 'chat') : _t('global_tab_info_mobile', null, 'chat');
            }
            //$div.find('.close').css('display', 'block').attr('data-tip', globalTabInfo);
            $div.find('.close').css('display', 'block').tip(globalTabInfo);
        }
        self.initClickCard($div);
        if (!priv) return $div;
        if (avatar != '' && avatar != null) this.createAvatar($div, avatar);
        var idString = self.changeNickToIdString(text);
        $div.addClass('priv ' + idString);
        self.initDblClickCard($div);
        return $div;
    };

    this.createAvatar = function($div, avatar) {
        var $icon = $div.find('.icon');
        $icon.css('display', 'block').addClass('av');
        var url = CFG.a_opath + avatar;
        createImgStyle($icon, url, {
            'height': '28px',
            'width': '32px'
        }, {
            'background-size': '400% 400%'
        }, 32);
        $div.attr('data-avatar', avatar);
        $div.addClass('delete-hover');
    };

    this.initClickCard = function($card) {
        $card.on('click', function() {
            $('.linked-chat-item');
            self.changeTab($(this).attr('data-tab'));
            self.setScrollOnBottom();
        });

        $card.on('contextmenu', function(e, mE) {
            var $tab = $(this);
            var menu = [
                [_t('change_state'), function() {
                    self.changeTab($tab.attr('data-tab'));
                    self.setScrollOnBottom();
                }]
            ];
            var idCard = $(this).attr('data-tab');
            if (self.checkPrivateCard(idCard)) {
                menu.push([_t('delete'), function() {
                    self.clickDelete($tab);
                }])
            }
            //e.preventDefault();
            var newE = getE(e, mE);
            newE.clientX += 30;
            Engine.interface.showPopupMenu(menu, newE);
        });
    };

    this.initDblClickCard = function($card) {
        $card.dblclick(function() {
            self.clickDelete($(this));
        });
    };

    this.clickDelete = function($tab) {
        var msg = _t('deleteCard', null, 'chat') + $tab.attr('data-tab') + '?';
        self.alert(msg, function() {
            self.deleteCard($tab);
        });
    };

    this.deleteCard = function($card) {
        var nick = $card.attr('data-tab');
        self.deletePrivCard(nick);
        $card.remove();
        var h = self.changeNickToIdString(Engine.hero.d.nick);
        var path = 'chat/avatar/' + h + '/' + self.changeNickToIdString(nick);
        var record = Storage.get(path);
        if (record) Storage.remove(path);
        self.rebuildCards();
        self.rebuildStorage();
        self.changeTab(0);
    };

    this.initSortable = function() {
        var $sort = self.$.find(".tabs-wrapper");
        $(function() {
            $sort.sortable({
                //connectWith: ".connectedSortable",
                dropOnEmpty: true,
                revert: true,
                items: '> :not(.static-card)',
                receive: self.rebuildCards,
                start: self.startDrag,
                stop: self.stopDrag,
                sort: self.sort
            }).disableSelection();
        });
    };

    this.sort = function(e) {

    };

    this.startDrag = function(e) {
        edit = true;
        $(this).sortable("refresh");
    };

    this.stopDrag = function(e, ui) {
        ui.item.click();
        edit = false;
        self.rebuildStorage();
    };

    this.rebuildStorage = function() {
        var children = self.$.find('.tabs-wrapper').children();

        children.each(function() {
            if ($(this).hasClass('static-card')) return;
            var index = $(this).index();
            var name = $(this).attr('data-tab');
            var patch = $(this).attr('data-avatar');
            self.saveToStorage(name, patch, index);
        });
    };

    this.saveOldXAndY = function(x, y) {
        oldX = x;
        oldY = y;
    };

    this.initCards = function() {
        var $wrapper = this.$.find('.tabs-wrapper');
        var t = [
            'chat_global_tab',
            'chat_clan_tab',
            'chat_group_tab'
        ];
        for (var i = 0; i < t.length; i++) {
            var $card = this.createCard(i, false, t[i], false);
            $wrapper.append($card);
            $card.addClass('static-card');
        }
    };

    this.initPrivCards = function() {
        var h = self.changeNickToIdString(Engine.hero.d.nick);
        var persons = Storage.get('chat/avatar/' + h);
        if (!persons) return;

        var sortPersons = this.sortPersons(persons);

        for (var i = 0; i < sortPersons.length; i++) {
            var name = sortPersons[i][0];
            var avatar = sortPersons[i][1];
            var nick = self.changeIdStringToNick(name);
            self.createPrivCard(nick, avatar);
        }
    };

    this.sortPersons = function(persons) {
        var sortable = [];
        for (var id in persons) {
            if (!Array.isArray(persons[id])) {
                localStorage.clear();
                location.reload();
                return;
            }
            var name = persons[id][0];
            var index = persons[id][1];
            sortable.push([id, name, index]);
        }
        sortable.sort(function(a, b) {
            return a[2] - b[2];
        });
        return sortable;
    };


    this.deletePrivCard = function(nick) {
        for (var i = 0; i < messages.length; i++) {
            var bool1 = messages[i].n == nick;
            var bool2 = messages[i].nd == nick;
            var bool3 = messages[i].where == 'onlyPriv';
            if ((bool1 || bool2) && bool3) messages[i].where = 'out';
        }
    };

    this.appendMessage = function(d, prepend) {
        var classes = (d.n == '' && d.s == 'sys_red') ? d.s + ' sys_important_info' : d.s;
        var tpl = Templates.get('chat-message').addClass(classes);
        var s = self.getChatSizeFromStorage();
        if (s === null) {
            Storage.set('chatSize', 1);
            s = 1
        }
        var leftColumnStatus = s > 0;
        tpl.data('data', d);
        this.setAvatarData(tpl, d);
        this.setTimeMessage(tpl, d);
        //tpl.append(self.parseChatText(tpl, d));
        this.parseChatText(tpl, d);
        this.setAutorsMessage(tpl, d);
        this.setGeneralMessage(tpl, d);
        this.setGroupMessage(tpl, d);
        this.setClanMessage(tpl, d);
        this.setPrivInGeneral(tpl, d);
        this.createQuickMessage(tpl, d, leftColumnStatus, prepend);
        this.appendToProperCard(tpl, d, leftColumnStatus, prepend);
        //if (newMsg) API.callEvent('newMsg', [tpl, d]);
        //else API.callEvent('updateMsg', [tpl, d]);

        if (newMsg) API.callEvent(Engine.apiData.NEW_MSG, [tpl, d]);
        else API.callEvent(Engine.apiData.UPDATE_MSG, [tpl, d]);
    };

    this.setGeneralMessage = function(tpl, d) {
        if (d.n == 'System') return;
        if (d.k != 0) return;
        if (d.s != "") {
            if (d.s == 'abs') {

            } else return;
        }
        var $txt = tpl.find('.color-chat-msg');
        $txt.addClass('general-message');
    };

    this.setGroupMessage = function(tpl, d) {
        if (d.n == 'System') return;
        if (d.k != 2) return;
        var $txt = tpl.find('.color-chat-msg');
        var $nick = tpl.find('.nick');
        $txt.addClass('group-message');
        $nick.addClass('group-nick');
    };

    this.setClanMessage = function(tpl, d) {
        if (d.n == 'System') return;
        if (d.k != 1) return;
        var $txt = tpl.find('.color-chat-msg');
        var $nick = tpl.find('.nick');
        $txt.addClass('clan-message');
        $nick.addClass('clan-nick');
    };

    this.setPrivInGeneral = function(tpl, d) {
        if (!d.where) return;
        if (d.where != 'general') return;
        var $nick = tpl.find('.nick');
        var $txt = tpl.find('.color-chat-msg');
        $nick.addClass(d.n == 'System' ? 'system-in-general' : 'priv-in-general');
        if (d.s != "sys_info") $txt.addClass(d.n == 'System' ? 'system-in-general-span' : 'priv-in-general-span');
    };

    this.setAvatarData = function(tpl, d, pos) {
        if (!d.i) return;
        var $nick = tpl.find('.nick');
        $nick.attr('data-avatar', d.i);
        if (d.n == Engine.hero.d.nick) return;
        var idString = self.changeNickToIdString(d.n);
        //var $card = $('.tab.' + idString);
        var $card = Engine.interface.get$gameWindowPositioner().find('.tab.' + idString);
        var $icon = $card.find('.icon');
        if ($card.length == 0) return;
        if ($icon.hasClass('av') && $card.attr('data-avatar') == d.i) return;
        var name = self.changeNickToIdString(d.n);
        self.createAvatar($card, d.i);
        var $newIcon = $card.find('.icon');
        if ($card.hasClass('active')) $newIcon.addClass('active');
        var h = self.changeNickToIdString(Engine.hero.d.nick);
        Storage.set('chat/avatar/' + h + '/' + name, [d.i, pos]);
    };

    this.changeNickToIdString = function(nick) {
        return (((nick.replace(/ /gi, '1')).replace(/'/gi, '2')).replace(/-/gi, '3')).replace(/`/gi, '4');
    };

    this.changeIdStringToNick = function(idString) {
        return (((idString.replace(/1/gi, ' ')).replace(/2/gi, "'")).replace(/3/gi, '-')).replace(/4/gi, '`');
    };

    this.setTimeMessage = function(tpl, d) {
        //tpl.find('.info').tip('#tdiff:' + Math.floor(d.ts) + '#', 'tipupdate');
        tpl.find('.info').tip(ut_time(Math.floor(d.ts), true));
    };

    this.setAutorsMessage = function(tpl, d) {
        if (!d.n) return;
        var nick = Engine.hero.d.nick;
        var $nick = tpl.find('.nick');
        var $txt = tpl.find('.color-chat-msg');
        $nick.addClass('bold');

        if (d.n == nick) tpl.addClass('hero-msg'); //here
        if (!d.where || d.where && d.where == 'general') {
            $nick.html('&lt;' + d.n + (isset(d.nd) ? ' -&gt; ' + d.nd + '&gt;' : '&gt;'));
        }
        if (d.where && d.where == 'onlyPriv') {
            $nick.html('&lt;' + d.n + '&gt;');
            $nick.addClass(nick == d.n ? 'yellow' : 'green');
            $txt.addClass(nick == d.n ? 'yellow' : 'green');
        }
        if (d.k < 3 || d.k == 3 && d.where == 'general') {
            var n = d.nd == nick ? d.n : d.nd;
            if (isset(d.nd)) {
                if (n != "System") $nick.addClass('pointer').tip(_t('private_msg_to %nick%', {
                    '%nick%': n
                }, 'chat'));
            } else if (d.n != nick) {
                if (n != "System") $nick.addClass('pointer').tip(_t('private_msg_to %nick%', {
                    '%nick%': d.n
                }, 'chat'));
            }
        }
        $nick.attr('data-nick', (d.n == nick ? (d.nd ? d.nd : d.n) : d.n));
    };

    this.createQuickMessage = function(tpl, d, leftColumnStatus, prepend) {
        if (!leftColumnStatus && self.canShowQuickMsg(d.ts)) {
            var tpl2 = tpl.clone(true);
            if (prepend) $quickMessages.prepend(tpl2);
            else $quickMessages.append(tpl2);
            tpl2.animate({
                    right: 0
                }, 100)
                .delay(3000)
                .fadeOut(function() {
                    $(this).remove();
                });
        }
    };

    this.isAllInGeneralChannel = function() {
        //if (Engine.settings) return !Engine.settings.getLocOptById(20);
        //else return !Storage.get('localoption/20');
        return !Engine.opt(20);
    };

    this.appendToProperCard = function(tpl, d, leftColumnStatus, prepend) {
        var h = Engine.hero.d.nick;
        var id = d.k > 2 ? d.n == h ? d.nd : d.n : d.k;
        var bool0, bool1, bool2;
        var $e = this.getCardById(id);
        var nick = Engine.hero.d.nick;
        var searchCl = d.n == nick ? d.nd : d.n;
        if (this.isAllInGeneralChannel()) {
            var bool4 = d.k != 0 && d.where != 'general' && activeTab == 0;
            if (bool4) {
                var $clone = tpl.clone(true, true);
                var $nick = $clone.find('.nick');
                var $txt = $clone.find('.color-chat-msg');
                $clone.addClass('clone');
                $nick.addClass('pointer');
                if (prepend) $messages.prepend($clone).trigger('update');
                else $messages.append($clone).trigger('update');

                if (d.k == 1) {
                    $nick.addClass('clan-in-general').tip(_t('clan_chanel'));
                    $txt.addClass('clan-in-general-span');
                }
                if (d.k == 2) {
                    $nick.addClass('group-in-general').tip(_t('group_chanel'));
                    $txt.addClass('group-in-general-span');
                }

                if (d.k == 3 && d.n != "System") {
                    var n = d.n == Engine.hero.d.nick ? d.nd : d.n;
                    $nick.html('&lt;' + d.n + (isset(d.nd) ? ' -&gt; ' + d.nd + '&gt;' : '&gt;')).addClass('priv-in-general').removeClass('green');
                    $txt.addClass('priv-in-general-span');
                    if (n != "System") $nick.tip(_t('private_msg_to %nick%', {
                        '%nick%': n
                    }, 'chat'));
                }
                //API.callEvent('updateMsg', [$clone, d]);
                API.callEvent(Engine.apiData.UPDATE_MSG, [$clone, d]);
            }
        }

        if (d.k == 3) {
            self.setLastAutor(d.n);
            bool0 = searchCl == activeTab && d.where == 'onlyPriv';
            bool2 = activeTab == 0 && d.where == 'general';

        } else bool1 = activeTab == id;

        if (bool0 || bool1 || bool2) {
            var alreadyShow1 = self.scrolbarIsVisible();
            if (prepend) $messages.prepend(tpl).trigger('update');
            else $messages.append(tpl).trigger('update');
            if (!alreadyShow1) {
                var alreadyShow2 = self.scrolbarIsVisible();
                if (alreadyShow2) self.setScrollOnBottom();
            }
            if (!leftColumnStatus) this.redNotif($e, d);
        } else this.redNotif($e, d)
    };

    this.setLastAutor = function(n) {
        if (n == "System" || n == Engine.hero.d.nick) return;
        lastPrivMsgAutor = '@' + n.split(' ').join('_') + ' ';
    };

    this.scrolbarIsVisible = function() {
        return $messages.parent().find('.scrollbar-wrapper').css('display') == 'block';
    };

    this.redNotif = function($e, d) {
        if (d.n == Engine.hero.d.nick || d.n == "System" || d.s == 'me' || d.s == 'nar' || d.s == 'me' || d.s == 'emo' || d.s == 'sys_info' || d.s == 'sys_red') return;
        var lastTs = this.getMaxTimeShowedMsg();
        if (clearMessages || lastTs >= d.ts) return;
        if (d.s == "entertown" || d.s == "sys_red") return;
        var $card = $e ? $e : this.getCardById(0);
        var counter = $card.find('.counter');
        var val = parseInt(counter.html());
        $card.find('.notif').addClass('visible');
        counter.html(val + 1);
        self.newMsgSound();
    };

    this.newMsgSound = function() {
        var sm = Engine.soundManager;
        if (!sm.getStateSoundNotifById(0)) sm.createNotifSound(0);
    };

    this.getMaxTimeShowedMsg = function() {
        var max = 0;
        //for ( var i = 0; i < timeTable.length; i++) {
        for (let ts in timeTable) {
            if (!timeTable[ts]) {
                this.addTsToTimeTable(ts);
                continue;
            }
            max = Math.max(max, ts);
        }
        return max;
    };

    this.canShowQuickMsg = function(ts) {
        if (!maxTs || maxTs < ts) {
            maxTs = ts;
            return true;
        }
        return false;
    };

    this.changeTab = function(idx) {
        this.updateTab();
        activeTab = idx;
        $messages.html('').trigger('update');
        Storage.set('chat/tab', idx);
        this.$.find('.tab').removeClass('active');
        this.$.find('.icon').removeClass('active');
        var $e = this.getCardById(idx);
        //var exist = $e.size() > 0;
        if (!$e || ($e && $e.css('display') == 'none')) {
            this.changeTab(0);
            return;
        }
        $e.find('.counter').html(0);
        $e.find('.notif').removeClass('visible');
        $e.find('.icon').addClass('active');
        $e.addClass('active');
        $e.find('span').removeClass('newMsg');
        var msgs = this.getSortedMessages();
        for (var i = 0; i < msgs.length; i++) {
            this.appendMessage(msgs[i]);
        }
        self.rebuildCards();
    };

    this.getCardById = function(id) {
        var $tabs = this.$.find('.tab');
        for (var i = 0; i < $tabs.length; i++) {
            if (id == $tabs.eq(i).attr('data-tab')) return $tabs.eq(i);
        }
    };

    this.getSortedMessages = function() {
        var ret = [];
        for (var i in messages) {
            ret.push(messages[i]);
        }
        ret.sort(function(a, b) {
            if (a.ts < b.ts) return -1;
            else if (a.ts > b.ts) return 1;
            else return 0;
        });
        return ret;
    };

    this.focus = function() {
        if (!mobileCheck()) $input.focus();
        else self.turnOnMobileView();
    };

    this.replyTo = function(name) {
        var val = '@' + name.split(' ').join('_') + ' ';

        //if (mobileCheck())  $mInput.val(val);
        //else 								$input.val(val);

        if (mobileCheck()) this.setMobileInputVal(val);
        else this.setInputVal(val);

        //this.changeTab(3);
        this.focus();
    };

    this.getInputVal = () => {
        return $input.val();
    };

    this.getMobileInputVal = () => {
        return $mInput.val();
    };

    this.setInputVal = (val) => {

        inputAllMessage = val;

        $input.val(val);
    };

    this.setMobileInputVal = (val) => {

        mobileInputAllMessage = val;

        $mInput.val(val);
    };

    this.setLinkedItem = function(hid) {
        let linkedItem = `ITEM#${hid}`;
        //let linkedText = `ITEM#${hid}`;
        //
        //
        //let items = Engine.items.testMyItems();
        //let item = null;
        //
        //
        //for (let k in items) {
        //	if (items[k].hid == hid) {
        //		item = items[k];
        //		break;
        //	}
        //}
        //
        //if (item) linkedText = `ITEM#[${item.name}]`;


        //if (mobileCheck())  $mInput.val($mInput.val() + linkedItem);
        //else 				$input.val($input.val() + linkedItem);

        if (mobileCheck()) {
            let v = this.prepareMsgWithLinkedItem(this.getMobileInputVal(), linkedItem);
            this.setMobileInputVal(v);
        } else {
            // debugger;
            // Engine.magicInput.addToInput(linkedItem);
            let v = this.prepareMsgWithLinkedItem(this.getInputVal(), linkedItem);
            this.setInputVal(v);
        }

        this.focus();
    };

    this.prepareMsgWithLinkedItem = (v, linkedItem) => {
        linkedItem += ' ';
        if (v === '') return linkedItem;

        const space = v.slice(-1) === ' ' ? '' : ' '; // space or no space
        return v + space + linkedItem;
    };

    this.sendMessage = function(val) {

        if (!this.parseChatCommand(val)) {
            val = $.trim(val);
            if (val == '/cls') {
                _g('chat&tab=' + ($.isNumeric(activeTab) ? activeTab : 3), false, {
                    c: '/cls'
                });
            } else if (val != '') {
                var newVal = this.createNewVal(val);

                let chatLinkedItemsManager = Engine.chatLinkedItemsManager

                if (chatLinkedItemsManager.checkSendMessageIsItemLinked(newVal)) chatLinkedItemsManager.manageItemLinked(newVal);
                else self.sendRequest(newVal);

            }
        }
    };

    this.sendRequest = function(newVal) {
        _g('chat', false, {
            c: newVal
        });
    };

    //this.changeGropuAndClanMessage = function (val, plChange, comChange) {
    //	if (_l() == 'pl') {
    //		if (val.substr(0, 3) != plChange) return plChange + val;
    //	} else {
    //		if (val.substr(0, 3) != comChange) return comChange + val;
    //	}
    //	return val;
    //};

    this.createNewVal = function(val) {

        if (activeTab == 1)
            val = (isPl() ? '/k ' : '/g ') + val;
        else if (activeTab == 2)
            val = (isPl() ? '/g ' : '/p ') + val;

        if ($.isNumeric(activeTab)) return val;
        else return '@' + activeTab.replace(/ /gi, '_') + ' ' + val;
    };

    this.parseChatCommand = function(cmd) {
        var tmp = cmd.split(' ');
        if (cmd.substr(0, 1) != '/') {
            var privTag = tmp[0].substr(0, 1) == '@';
            if (tmp.length > 1 && privTag) {
                var val = $.trim(cmd);
                self.sendRequest(val);
                return true;
            }
            return false;
        }

        if (tmp.length > 1) {

            switch (tmp[0]) {
                case '/ban':
                    //if (!(Engine.hero.d.uprawnienia & 4)) return true;
                    var rights = Engine.hero.d.uprawnienia;
                    if (rights == 4 || rights == 16) {
                        var nick = cmd.substr(5);
                        if (Engine.smcAddon) Engine.smcAddon.close();
                        Engine.smcAddon = new SMCAddon(nick);
                        Engine.smcAddon.init();
                        return true;
                    }
                    break;
                case '/k':
                case '/g':
                case '/p':
                    var val = $.trim(cmd);
                    self.sendRequest(val);
                    return true;
            }
        }
        return false;
    };

    this.initVariables = function() {
        let $gWP = Engine.interface.get$gameWindowPositioner()
        $input = this.$.find('input');
        //$mInput = $('.chat-layer').find('.mobile-input');
        $mInput = $gWP.find('.chat-layer').find('.mobile-input');
        $messages = this.$.find('.messages-wrapper .scroll-pane');
        $quickMessages = $gWP.find('.quick_messages');
        $tabs = this.$.find('.tabs-wrapper .tab');
    };

    this.initCloseMobileOverlay = function() {
        //$('.chat-layer').find('.chat-overlay').click(self.closeChatMobileOverlay);
        Engine.interface.get$gameWindowPositioner().find('.chat-layer').find('.chat-overlay').click(self.closeChatMobileOverlay);
    };

    this.closeChatMobileOverlay = function() {
        //$mInput.val('');
        self.setMobileInputVal('');
        $('.chat-layer').css('display', 'none');
    };

    this.next = function(e) {
        e.preventDefault();
        if (lastMessageId == null) return;
        lastMessageId++;
        if (lastMessageId >= lastMessages.length) {
            lastMessageId = null;
            //$input.val(activeMessage);
            self.setInputVal(activeMessage)
            activeMessage = null;
        } else {
            this.setCustom();
            //$input.val(lastMessages[lastMessageId]);
            self.setInputVal(lastMessages[lastMessageId])
        }
    };

    this.previous = function(e) {
        e.preventDefault();
        if (lastMessageId == null) lastMessageId = lastMessages.length - 1;
        else if (lastMessageId > 0) {
            lastMessageId--;
        }

        this.setCustom();
        //$input.val(lastMessages[lastMessageId]);
        self.setInputVal(lastMessages[lastMessageId])
    };

    this.setCustom = function() {
        //if (activeMessage == null) activeMessage = $input.val();
        if (activeMessage == null) activeMessage = self.getInputVal();
    };

    this.initKeypress = function() {
        $input.on('keydown', function(e) {
            if (e.keyCode == 38) self.previous(e);
            if (e.keyCode == 40) self.next(e);
        });
        $input.on('keypress', function(e) {
            if (e.keyCode == 13) {
                //const value = $input.val();
                const value = self.getInputVal();
                e.stopPropagation();
                //e.stopPropagation();
                self.sendMessage(value);
                if (lastMessageId == null || lastMessages[lastMessageId] != value) lastMessages.push(value);
                //$input.val('');
                self.setInputVal('');
                $input.blur();
                lastMessageId = null;
            }
        }).on('keyup', function(e) {
            // if (e.which == 27) $input.blur();
            //if (e.keyCode == 8) console.log('CHECK IS LINKED ITEM');

            //if ($input.val() == '/r' && lastPrivMsgAutor != '') $input.val(lastPrivMsgAutor);

            let v = self.getInputVal();
            if (v == '/r' && lastPrivMsgAutor != '') self.setInputVal(lastPrivMsgAutor);

        }).focusin(function() {

            if (mobileCheck()) self.turnOnMobileView();
        });
        if (!mobileCheck()) return;
        $mInput.on('keypress', function(e) {
            if (e.keyCode == 13) {
                e.stopPropagation();
                //e.stopPropagation();
                let v = self.getMobileInputVal();
                self.sendMessage(v);
                self.setMobileInputVal('');
                //$mInput.val('');
                $mInput.blur();
                self.closeChatMobileOverlay();
            }
        }).focusout(function() {

        });
    };

    this.turnOnMobileView = function() {
        //$('.chat-layer').css('display', 'block');
        Engine.interface.get$gameWindowPositioner().find('.chat-layer').css('display', 'block');
        self.showRemainingChars(0);
        $input.blur();
        $mInput.focus();
    };

    this.initRemaingChars = function() {
        $mInput.bind('input propertychange', function() {
            let v = self.getMobileInputVal();
            self.showRemainingChars((v).length);
        });
    };

    this.initSendMessage = function() {
        var $btn = Templates.get('button').addClass('send-message green small');
        $btn.find('.label').html(_t('send', null, 'mails'));
        //$('.chat-layer').find('.chat-mobile-input-wrapper').append($btn);
        Engine.interface.get$gameWindowPositioner().find('.chat-layer').find('.chat-mobile-input-wrapper').append($btn);
        $btn.click(function() {
            //self.sendMessage($mInput.val());

            let v = self.getMobileInputVal();
            self.sendMessage(v);
            self.closeChatMobileOverlay();
        });
    };

    this.showRemainingChars = function(val) {
        //$('.chat-layer').find('.remaining-chars').html(_t('chats_left', null, 'mails') + (250 - val));
        Engine.interface.get$gameWindowPositioner().find('.remaining-chars').html(_t('chats_left', null, 'mails') + (200 - val));
    };

    this.init = function() {
        $(document).on('keydown', (e) => {
            ctrl = e.ctrlKey;
        }).on('keyup', () => {
            ctrl = false;
        });
        $(window).on('blur', () => {
            ctrl = false;
        });
        self.$ = Templates.get('chat-tpl');
        //$('.game-window-positioner').find('.interface-layer').find('.left-column').find('.inner-wrapper').append(this.$);
        Engine.interface.get$interfaceLayer().find('.left-column').find('.inner-wrapper').append(this.$);
        self.initCards();
        self.initSortable();
        self.initVariables();
        $($tabs[0]).addClass('active');
        self.setVisibleCard(2, 0);
        self.initKeypress();
        self.initRemaingChars();
        self.initSendMessage();
        self.initCloseMobileOverlay();
        self.initClickMessage();
        self.initSendButton();
        self.initScroll();
    };

    this.initSendButton = function() {
        this.$.parent().find('.send-btn').click(function() {
            let v = self.getInputVal();
            self.sendMessage(v);
            //$input.val('');
            self.setInputVal('');
            $input.blur();
        });
    };

    this.checkItsMe = function(nick) {
        return nick == Engine.hero.d.nick;
    };

    this.checkPrivateCard = function(idCard) {
        var idToCheck;
        idToCheck = isset(idCard) ? idCard : activeTab;
        return isNaN(parseInt(idToCheck));
    };

    this.initClickMessage = function() {
        $(document).on('click', '.chat-message .nick, .chat-message .priv-message', function(e) {
            //var selector = '.game-window-positioner .interface-layer .left-column .inner-wrapper .chat-tpl .messages-wrapper .scroll-pane .chat-message .nick';
            //$(document).on('click', selector, function (e) {
            var nick = $(this).attr('data-nick');
            if (nick == "System" || nick == Engine.hero.nick) return;
            if (ctrl) {
                //$input.val(nick + ' ');
                self.setInputVal(nick + ' ');
                self.focus();
                return;
            }

            if (self.checkPrivateCard()) self.focus();
            else {
                if (self.checkItsMe(nick)) self.putNickInInput();
                else self.replyTo(nick);
            }
        });
        $(document).on('contextmenu', '.chat-message .nick', function(e, mE) {
            //$(document).on('contextmenu', $('.game-window-positioner').find('.chat-message .nick'), function (e, mE) {
            var nick = $(this).attr('data-nick');
            if (nick == "System") return;
            var menu = [];
            if (self.checkPrivateCard()) self.putNickInInput(nick, menu);
            else { //general clan group
                if (self.checkItsMe(nick)) {
                    self.goToGroupOrClan(nick, $(this), menu);
                } else {
                    self.replyItem(nick, menu);
                    self.goToGroupOrClan(nick, $(this), menu);
                    self.addCardToMenu(nick, $(this), menu);
                    self.putNickInInput(nick, menu);
                    self.checkSmc(nick, menu);
                }
            }
            if (menu.length > 0) {
                var newE = getE(e, mE);
                newE.clientX += 30;
                Engine.interface.showPopupMenu(menu, newE);
            }
        });
    };

    this.putNickInInput = function(nick, menu) {
        menu.push([_t('player_nick', null, 'clan'), function() {
            self.setInputVal(nick + ' ');
            //$input.val(nick + ' ');
            self.focus();
        }]);
    };

    this.replyItem = function(nick, menu) {
        menu.push([_t('send_message', null, 'chat'), function() {
            self.replyTo(nick);
        }]);
    };

    this.addCardToMenu = function(nick, $msg, menu) {

        if (nick == Engine.hero.d.nick || nick == 'System') return;

        menu.push([_t('create_chat_card'), function() {
            var avatar = $msg.attr('data-avatar');
            var bool = $msg.parent().hasClass('hero-msg');
            self.createPrivCard(nick, !bool ? avatar : '', true);
            self.rebuildStorage();
            self.rebuildCards();
            self.changeTab(nick);
        }]);
    };

    this.goToGroupOrClan = function(nick, $msg, menu) {
        if ($msg.hasClass('clan-in-general')) {
            menu.push([_t('to-clan'), function() {
                self.changeTab(1);
            }]);
        }

        if ($msg.hasClass('group-in-general')) {
            menu.push([_t('to-group'), function() {
                self.changeTab(2);
            }]);
        }
    };

    this.checkSmc = function(nick, menu) {
        var rights = Engine.hero.d.uprawnienia;
        if (rights == 0) return;
        if (nick == Engine.hero.d.nick || nick == 'System') return;

        menu.push(['MC Panel', function() {
            if (!Engine.mcAddon) {
                Engine.mcAddon = new MCAddon(self);
                Engine.mcAddon.init();
            }
            Engine.mcAddon.update(nick);
        }]);

        if (rights == 4 || rights == 16) {
            menu.push(['SMC Panel', function() {
                if (Engine.smcAddon) Engine.smcAddon.close();
                Engine.smcAddon = new SMCAddon(nick);
                Engine.smcAddon.init();
            }]);
        }
    };

    this.initScroll = function() {
        self.$.find('.messages-wrapper').addScrollBar({
            track: true,
            wheelSpeed: 40
        });
        self.setScrollOnBottom();
    };

    this.setScrollOnBottom = function() {
        $('.scroll-wrapper', self.$).trigger('scrollBottom');
    };

    this.updateTab = function() {
        $tabs = this.$.find('.tabs-wrapper .tab');
    };

    this.createPrivCard = function(nick, avatar, newCard) {
        //var $e = $('[data-tab="' + nick + '"]');
        var $e = Engine.interface.get$gameWindowPositioner().find('[data-tab="' + nick + '"]');
        if ($e.length == 0) {
            var $card = this.createCard(nick, true, nick, true, avatar);
            var selector = '.tabs-wrapper';
            if (newCard) $(self.$.find('[data-tab=2]')[0]).after($card);
            else this.$.find(selector).append($card);
        }
    };

    this.saveToStorage = function(nick, avatar, position) {
        if (avatar == '') return;
        var name = self.changeNickToIdString(nick);
        var h = self.changeNickToIdString(Engine.hero.d.nick);
        Storage.set('chat/avatar/' + h + '/' + name, [avatar, position]);
    };

    this.rebuildCards = function() {
        var amount = self.getAmountCards();
        var s = self.getChatSizeFromStorage();
        var div = s > 1 ? 14 : 7;
        var size = Math.ceil(amount / div);
        self.$.find('.tabs-pannel').css('height', 5 + 35 * size);
        self.$.find('.messages-wrapper').css('top', 4 + 35 * size);
        $messages.trigger('update');
    };

    this.getChatSizeFromStorage = () => {
        return Storage.get('chatSize');
    };

    this.onClear = function() {
        self.deleteSysRed();
    };

    this.deleteSysRed = function() {
        if (!messages) return;
        self.$.find('.chat-message.sys_important_info').remove();
        for (var i = 0; i < messages.length; i++) {
            if (messages[i].s == 'sys_red') messages.splice(i, 1);
        }
    };

    this.alert = function(msg, f) {
        mAlert(msg, [{
            txt: _t('yes'),
            callback: function() {
                f();
                return true;
            }
        }, {
            txt: _t('no'),
            callback: function() {
                return true;
            }
        }]);
    };

    this.createTextNodeOrSpanLinkedItem = (text, escStringMode, unsecure) => {
        let receiveMessageHaveLinkedItem = Engine.chatLinkedItemsManager.checkReceiveMessageHaveLinkedItem(text, escStringMode);

        if (receiveMessageHaveLinkedItem) {
            return Engine.chatLinkedItemsManager.parseReceiveMessageWithLinkedItem(text, escStringMode, unsecure);
        } else {
            return document.createTextNode(text);
        }
    };

    this.chatTextWithHeroNick = function(ret, text) {
        var nick = Engine.hero.d.nick;
        var re = new RegExp('^' + nick + ' | ' + nick + ' | ' + nick + '$|^' + nick + '$', 'ig');
        var tab = text.split(re);


        let newTab = [];

        for (let k in tab) {

            let text = tab[k];

            newTab.push(self.createTextNodeOrSpanLinkedItem(text));

        }

        var $hero = $('<b>').addClass('yourname').text(nick);
        for (var t = 0; t < newTab.length; t++) {

            self.appendTextToColorChatMsg(ret, newTab[t]);

            ret.append(newTab[t]);
            let isLast = t == newTab.length - 1;
            if (isLast) ret.append(newTab[newTab.length - 1]);
            else {
                ret.append(document.createTextNode(' '));
                ret.append($hero.clone());
                ret.append(document.createTextNode(' '));
            }

        }
        //ret.append(newTab[newTab.length - 1]);
    };

    this.appendTextToColorChatMsg = (ret, obj) => {
        let isArray = Array.isArray(obj);

        if (isArray) {

            for (let k in obj) {
                ret.append(obj[k]);
            }

        } else ret.append(obj);

    };

    this.createChatURL = function(o) {
        //TODO change text for links to forum/youtube np. 'forum, temat=XXX'
        var url = o.toObject('https');
        var $u = $("<u>");
        $u.addClass('link');

        $u.click(function() {
            if (isPl()) {
                const isProfile = url.href.indexOf("https://www.margonem.pl/profile/view,") > -1;
                const isClanPage = url.href.indexOf("https://www.margonem.pl/guilds/view,") > -1;

                if (isProfile) {
                    Engine.iframeWindowManager.newPlayerProfile({
                        staticUrl: url.href
                    })
                    return;
                }

                if (isClanPage) {
                    Engine.iframeWindowManager.newClanPage({
                        staticUrl: url.href
                    })
                    return;
                }
            }

            window.goToUrl(url.href);
        });

        $u.text(url.href);
        return $u;
    };

    this.checkCorrectlyURL = function(url) {
        var rx = /^(?:(https?:\/\/)|(www\.))/i;
        return rx.test(url);
    };

    this.parseJoinToGame = function(msg, el) {
        if (msg.indexOf(" doÅÄczyÅ") >= 0) {
            const nick = msg.substring(0, msg.indexOf(" doÅÄczyÅ"));
            el.addClass('pointer priv-message').tip(_t('private_msg_to %nick%', {
                '%nick%': nick
            }, 'chat'));
            el.attr('data-nick', nick);
        }
        return el;
    };

    this.parseChatText = function(tpl, obj) {
        var ret = tpl.find('.color-chat-msg');
        var entertown = obj.s == 'entertown';
        if (obj.s == 'sys_info' || obj.s == 'sys_red') {
            var html = parseChatBB(obj.t);
            if (!entertown && obj.t.indexOf('url') == -1) {
                var nick = Engine.hero.d.nick;
                var re = new RegExp('^' + nick + ' | ' + nick + ' | ' + nick + '$|^' + nick + '$', 'ig');
                html = html.replace(re, ' <b class="yourname">' + nick + '</b> ');
            }
            if (obj.s == 'sys_info') {
                this.parseJoinToGame(obj.t, ret);
            }

            let messageHaveLinkedItem = Engine.chatLinkedItemsManager.checkReceiveMessageHaveLinkedItem(html, true);

            if (messageHaveLinkedItem) ret.append(self.createTextNodeOrSpanLinkedItem(html, true, true));
            else ret.append(html);

        } else {
            if (!isset(window.linkify)) {
                var text = obj.t;
                if (!entertown) {
                    self.chatTextWithHeroNick(ret, text);
                } else {
                    //ret.append(document.createTextNode(text));
                    ret.append(self.createTextNodeOrSpanLinkedItem(text));
                }
            } else {
                var tokens = linkify.tokenize(obj.t);
                for (var t in tokens) {
                    var o = tokens[t];
                    var text = o.toString();
                    if (o.type == 'url' && self.checkCorrectlyURL(text)) {
                        ret.append(self.createChatURL(o));
                    } else {
                        if (!entertown) {
                            self.chatTextWithHeroNick(ret, text);
                        } else {
                            //ret.append(document.createTextNode(text));
                            ret.append(self.createTextNodeOrSpanLinkedItem(text));
                        }
                    }
                }
            }
        }
        return ret;
    };

    this.clear = function(tabNumber) {
        $messages.html('');
    };

    // $(document).on('keydown', function (e) {
    // 	ctrl = e.ctrlKey;
    // }).on('keyup', function () {
    // 	ctrl = false;
    // });

    this.onResize = function() {
        $messages.trigger('update');
    };

    //this.init();

};