/**
 * Created by lukasz on 2015-04-23.
 */
var Tpl = require('@core/Templates');
var ChatData = require('@core/chat/ChatData');
const OthersContextMenuData = require('@core/characters/OthersContextMenuData');


let StorageFuncWindow = require('@core/window/StorageFuncWindow');
//var Chat = require('@core/Chat');
module.exports = function(data) {
    var leader = null;
    var self = this;
    var wnd = null;
    var hId;

    var members = {};

    function partyMember(nick) {
        var self = this;
        this.$ = Tpl.get('party-member');
        this.isNew = true;
        this.toRemove = false;
        this.id = null;
        this.accountId = null;
        this.nick = null;
        this.icon = null;
        this.hp = [null, null];
        this.l = 0;
        this.stasis = false;
        this.stasisIncoming = false;

        this.updateData = function(id, nick, icon, hp, maxhp, leader, stasis, stasisIncoming, account) {
            self.toRemove = false;
            self.id = id;
            self.nick = nick;
            self.icon = icon;
            self.stasis = stasis;
            self.stasisIncoming = stasisIncoming;
            self.accountId = account;
            self.l = parseInt(leader);
            self.hp = [hp, maxhp];
            self.$.addClass('other-party-id-' + id);
        };
    };

    this.getMemberFromHeroMapWithTheBigestLevel = () => {
        let temp = null;
        let others = Engine.others.check();
        for (let k in members) {
            if (!others[k]) continue;

            if (!temp) {
                if (others[k].getLevel() > getHeroLevel()) temp = others[k];
            } else {
                if (temp.getLevel() < others[k].getLevel()) temp = others[k];
            }
        }

        return temp
    };

    this.getLeaderId = function() {
        return leader;
    };

    this.setHId = function(data) {
        hId = isset(Engine.hero.d.id) ? Engine.hero.d.id : data.h.id;
    };

    this.getMembers = function() {
        return members;
    };

    this.createActionsButtons = function(m) {

        self.createKickOut(m);
        self.createDestroyGroup(m);
        self.createGiveLead(m);
    };

    this.createKickOut = function(m) {
        var str = this.getLeaderId() == Engine.hero.d.id ? _t('kick_out_from_party') : _t('leave_group');

        var $kickOut = Tpl.get('kick-out-party').tip(str);
        $('.party-options', m.$).append($kickOut);
        $kickOut.click(function(e) {
            e.stopPropagation();
            var alertStr = self.getLeaderId() == Engine.hero.d.id ? _t('kick_out_accept %name%', {
                '%name%': m.nick
            }, 'group') : _t('sure_leave_party');

            _g('party&a=rm&id=' + m.id);

        });
    };

    this.createGiveLead = function(m) {

        var $giveLead = Tpl.get('give-lead-party').tip(_t('give_leadership'));
        $('.party-options', m.$).append($giveLead);
        $giveLead.click(function(e) {
            e.stopPropagation();
            var str = _t('give_lead_accept %name%', {
                '%name%': m.nick
            }, 'group');
            mAlert(str, [{
                txt: _t('yes'),
                callback: function() {
                    _g('party&a=give&id=' + m.id);
                    return true;
                }
            }, {
                txt: _t('no'),
                callback: function() {
                    return true;
                }
            }]);
        });
    };

    this.createDestroyGroup = function(m) {

        var $destroyGroup = Tpl.get('destroy-group-party').tip(_t('solve_group'));
        $('.party-options', m.$).append($destroyGroup);
        $destroyGroup.click(function(e) {
            e.stopPropagation();
            var str = _t('destroy_group_accept', null, 'group');
            mAlert(str, [{
                txt: _t('yes'),
                callback: function() {
                    _g('party&a=disband');
                    return true;
                }
            }, {
                txt: _t('no'),
                callback: function() {
                    return true;
                }
            }]);
        });
    };

    this.createCrown = function(m) {
        if (m.l) {
            if (!$('.crown', m.$).length) {

                var $crown = Tpl.get('crown-party');
                $crown.tip(_t('lider_group'));
                $('.crown-wrapper', m.$).append($crown);
            }
            $('.crown-wrapper', m.$).css('display', 'block');
            m.$.removeClass('enabled');
        } else {
            $('.crown', m.$).remove();
            $('.crown-wrapper', m.$).css('display', 'none');
            m.$.addClass('enabled');
        }
    };

    this.updateDisplay = function(m, pos, $list) {
        if (m.isNew) {
            m.isNew = false;
            self.createActionsButtons(m);
        } else {
            m.$.detach();
        }
        $list.append(m.$);

        self.updateInfo(m, pos);
        self.createCrown(m);
        self.updateHpBar(m);
    };

    this.setVisibleActionButton = function(m) {
        var youAreLeader = leader == hId,
            kickOutDisplay = hId == m.id && !youAreLeader || youAreLeader && m.id != hId ? 'block' : 'none',
            str = youAreLeader ? _t('kick_out_from_party') : _t('leave_group');

        m.$.find('.kick-out').css('display', kickOutDisplay).tip(str);

        if (hId == leader) {

            m.$.find('.destroy-group').css('display', 'block');

            if (hId == m.id) m.$.find('.give-lead').css('display', 'none');
            else {
                m.$.find('.destroy-group').css('display', 'none');
                m.$.find('.give-lead').css('display', 'block');
            }

        } else {
            m.$.find('.destroy-group').css('display', 'none');
            m.$.find('.give-lead').css('display', 'none');
        }
    };

    this.updateInfo = function(m, index) {
        //$('.index', m.$).html((index + 1) + '.');
        $('.nickname .nickname-text', m.$).html(m.nick);
        $('.nickname .nickname-text', m.$).tip(m.nick);
        $('.lvl', m.$).html('(255)');
        if (m.stasis) {
            m.$.addClass('stasis');
        } else {
            m.$.removeClass('stasis');
        }
        if (m.stasisIncoming) {
            m.$.addClass('stasis-incoming');
        } else {
            m.$.removeClass('stasis-incoming');
        }
        if (m.id == Engine.hero.d.id) {
            m.$.addClass('yellow');
        }
    };

    this.updateHpBar = function(m) {
        if (m.hp) {
            var val = (m.hp[0] / m.hp[1]) * 100;
            val = (val > 0 && val < 1 ? 1 : Math.ceil(val));
            $('.hp-label.hp-label-percent', m.$).text(val + '%');

            var realHp = round(m.hp[0], 10) + ' / ' + round(m.hp[1], 10);
            $('.hp-label.hp-label-real', m.$).text(realHp);

            $('.hp-bar', m.$).css({
                width: (val / 100) * 77
            });
        }
    };

    this.getIds = function(data) {
        var array = [];
        for (var k in data) {
            array.push(k);
        }
        return array;
    };

    this.updateData = function(data) {
        var miniMapRemoveOFromGroup = {};
        var miniMapAddOToGroup = {};
        var others = Engine.others.check();
        var sortIds = [];
        var $list = wnd.$.find('.list');

        for (var m in members) {
            members[m].toRemove = true;
        }

        for (var i in data) {
            var rec = data[i];
            var id = parseInt(i);
            var inSortTab = sortIds.indexOf(id) !== -1;
            if (!isset(members[id])) {
                members[id] = new partyMember(rec.nick);
                if (others[id]) miniMapAddOToGroup[id] = others[id].d;
            }
            var o = members[id];
            o.updateData(id, rec.nick, rec.icon, rec.hp_cur, rec.hp_max, rec.commander ? 1 : 0, rec.stasis ? 1 : 0, rec.stasis_incoming_seconds ? 1 : 0, rec.account);
            if (o.l) {
                leader = parseInt(id);
                if (!inSortTab) sortIds.unshift(id);
            } else {
                if (!inSortTab) sortIds.push(id);
            }
        }

        for (var m2 in members) {
            if (members[m2].toRemove) {
                members[m2].$.remove();
                if (others[m2]) miniMapRemoveOFromGroup[m2] = others[m2].d;
                delete members[m2];
            }
        }

        for (var orderId = 0; orderId < sortIds.length; orderId++) {
            var member = members[sortIds[orderId]];
            self.actionOneOther(member);
            self.updateDisplay(member, orderId, $list);
            self.setVisibleActionButton(member);
        }

        if (lengthObject(miniMapRemoveOFromGroup) > 0) {
            refreshMiniMapAndOthersKind(miniMapRemoveOFromGroup)
        }

        if (lengthObject(miniMapAddOToGroup) > 0) {
            refreshMiniMapAndOthersKind(miniMapAddOToGroup)
        }
    };

    const refreshMiniMapAndOthersKind = (objOfOtherToRefresh) => {
        refreshOthersKindFromParty(objOfOtherToRefresh);
        Engine.miniMapController.updateWindowMiniMapOthersPos(objOfOtherToRefresh);
    };

    const refreshOthersKindFromParty = (objOfOtherToRefresh) => {
        let others = getEngine().others;
        for (let otherId in objOfOtherToRefresh) {

            let other = others.getById(otherId);
            if (!other) {
                errorReport("Party.js", "refreshOthersKindFromParty", "Other not exist", otherId);
                continue
            }
            //let tempKind = other.getKind();

            //other.refreshKind();
            //other.clearDataToDrawIfKindChange(tempKind);
            other.manageRefreshKind();
        }
    };

    this.update = function(json) {
        var oldMembers = self.getIds(members);
        if (lengthObject(members) === 0) this.open();
        var data = json.party.members;
        var newMembers = [];


        if (!Object.keys(json.party).length) {
            this.destroyParty();
            newMembers = self.getIds(members);
            Engine.whoIsHere.comparePartyMembers(oldMembers, newMembers);
            return;
        }

        Engine.chatController.getChatChannelsAvailable().setAvailable(ChatData.CHANNEL.GROUP, true);

        self.updateData(data);
        if (json.party.partyexp) self.setPercentAmount(json.party.partyexp);
        if (isset(json.party.partygrpkill)) self.setPartyGrpKill(json.party.partygrpkill);

        newMembers = self.getIds(members);
        Engine.whoIsHere.comparePartyMembers(oldMembers, newMembers);
        this.updateAmountOnWidget();
    };

    this.actionOneOther = function(m) {
        m.$.off('click');
        m.$.off('contextmenu');
        m.$.off('hover');

        m.$.click(function(e) {
            e.stopPropagation();
            if (!Engine.battle.getShow()) {
                if (!Engine.hero.checkPlayerIdIsHeroId(m.id)) Engine.chatController.getChatInputWrapper().setPrivateMessageProcedure(m.nick);
                return;
            }

            Engine.battle.clickCharacter(m.id, {
                type: 'focus',
                preventDefault: function() {}
            });
        });
        m.$.hover(() => {
            this.setHoverSelector(m.id, true);
        }, () => {
            this.setHoverSelector(m.id, false);
        });
        m.$.on('contextmenu', function(e) {
            e.preventDefault();

            if (getEngine().battle.getShow()) {
                //transformEPointerEventIfMobile(e);
                e.clientX -= 100;
                getEngine().battle.clickCharacter(m.id, e);
                wnd.correctPositionMenuToRightEdgeOfWnd();
            } else {
                //transformEPointerEventIfMobile(e);
                getEngine().others.createOtherContextMenu(e, {
                    nick: m.nick,
                    charId: m.id,
                    accountId: m.accountId
                }, [
                    OthersContextMenuData.SHOW_EQ,
                    OthersContextMenuData.INVITE_TO_ENEMIES,
                    OthersContextMenuData.INVITE_TO_PARTY
                ])
                wnd.correctPositionMenuToRightEdgeOfWnd(e);
            }
        });
    };

    this.setHoverSelector = function(id, show) {

        if (!Engine.battle.getShow()) return;
        var hoverSelector = Engine.battle.$.find('.other-id-battle-' + id).find('.hover-selector');
        hoverSelector.css('display', show ? 'block' : 'none');
    };

    this.toggle = function() {

        if (wnd.isShow()) {
            wnd.hide();
            // Storage.set('party/state', 0);
            StorageFuncWindow.setShowWindow(false, Engine.windowsData.name.PARTY);

            Engine.widgetManager.widgets.isActive(Engine.widgetsData.name.PARTY, false);
        } else {
            this.open();
        }
    };

    this.setPercentAmount = function(v) {
        wnd.$.find('.exp-percent').html(v + '%');
    };

    this.setPartyGrpKill = function(v) {
        var tip = v ? _t('group_kill_exp_count') : _t('group_kill_exp_nocount');
        var cl = v ? 'count' : 'no-count';
        var $e = wnd.$.find('.exp-q');
        $e.removeClass('count no-count');
        wnd.$.find('.exp-q').addClass(cl).tip(tip);
    };

    this.open = function() {

        wnd.show();
        // Storage.set('party/state', 1);
        StorageFuncWindow.setShowWindow(true, Engine.windowsData.name.PARTY);

        Engine.widgetManager.widgets.isActive(Engine.widgetsData.name.PARTY, true);
    };

    this.init = function(data) {
        //Engine.chat.setVisibleCard(2, 1);

        Engine.npcs.refreshAggressiveEmo();
        Engine.widgetManager.widgets.toggleWidgetDisplay(Engine.widgetsData.name.PARTY, true);
        this.updateAmountOnWidget();
        self.setHId(data);
        self.initWnd();
        // if (Storage.get('party/state') === null) Storage.set('party/state', 1);
        if (StorageFuncWindow.getShowWindow(Engine.windowsData.name.PARTY)) StorageFuncWindow.setShowWindow(true, Engine.windowsData.name.PARTY);
    };

    this.initWnd = function() {

        wnd = Engine.windowManager.add({
            content: Tpl.get('party'),
            title: _t('group-title', null, 'group'),
            //nameWindow        : 'party',
            nameWindow: Engine.windowsData.name.PARTY,
            widget: Engine.widgetsData.name.PARTY,
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            managePosition: {
                x: '200',
                y: '200'
            },
            onclose: () => {
                self.toggle();
            }
        });

        wnd.hide();
        wnd.addToAlertLayer();
        wnd.updatePos();

        wnd.$.find('.players-number').tip(_t('amount', null, 'party'));
        // if (Storage.get('party/state')) wnd.show();
        if (StorageFuncWindow.getShowWindow(Engine.windowsData.name.PARTY)) wnd.show();
    };

    this.onResize = function() {
        wnd.updatePos();
    };

    this.destroyParty = function() {
        // Storage.remove('party/state', 0);
        StorageFuncWindow.removeShowWindow(Engine.windowsData.name.PARTY);
        var obj = {};
        var others = Engine.others.check();
        for (var i in members) {
            members[i].$.remove();
            if (others[i]) obj[i] = others[i].d;
            delete(members[i]);
        }

        //refreshOthersKindFromParty(obj);
        //
        //Engine.miniMapController.updateWindowMiniMapOthersPos(obj);

        refreshMiniMapAndOthersKind(obj);

        //Engine.chat.setVisibleCard(2, 0);

        Engine.widgetManager.widgets.toggleWidgetDisplay(Engine.widgetsData.name.PARTY, false);

        Engine.chatController.getChatChannelsAvailable().setAvailable(ChatData.CHANNEL.GROUP, false);
        Engine.chatController.getChatChannelCardWrapper().showNotReadElement(ChatData.CHANNEL.GROUP, false);
        //Engine.chatController.getChatWindow().setChannel(ChatData.CHANNEL.GLOBAL);

        Engine.party = false;
        Engine.npcs.refreshAggressiveEmo();

        wnd.remove();
    };

    this.countPartyPlayers = () => {
        let amount = Object.keys(this.getMembers()).length;
        return amount;
    };

    this.updateAmountOnWidget = () => {
        let amount = this.countPartyPlayers();

        Engine.widgetManager.widgets.updateAmount(Engine.widgetsData.name.PARTY, amount);
        if (wnd) {
            wnd.$.find('.players-number .num').text(amount);
        }
    };

    this.onInterfaceReady = function() {
        this.updateAmountOnWidget();

        Engine.widgetManager.widgets.toggleWidgetDisplay(Engine.widgetsData.name.PARTY, true);
        Engine.widgetManager.widgets.isActive(Engine.widgetsData.name.PARTY, this.isActive());
    };

    this.get$Wnd = function() {
        return wnd.$;
    };

    this.isActive = () => {
        return wnd.$.css('display') == 'block' ? true : false;
    };


};