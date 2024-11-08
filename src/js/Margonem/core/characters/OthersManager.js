/**
 * Created by lukasz on 12.09.14.
 */
var Other = require('core/characters/Other');
var Emotions = require('core/emotions/EmotionsManager');
const OthersContextMenuData = require('core/characters/OthersContextMenuData');
const SocietyData = require('core/society/SocietyData');
const HandHeldMiniMapData = require('core/map/handheldMiniMap/HandHeldMiniMapData');
module.exports = function() {
    var list = {};

    const moduleData = {
        fileName: "OthersManager.js"
    };

    this.updateData = function(data) {

        let delOrNew = false;

        for (var i in data) {
            var exist = isset(list[i]);
            var del = isset(data[i].del);

            if (!exist || del) delOrNew = true;

            if (!exist) {
                list[i] = new Other();
                list[i].init();
            }
            list[i].updateDATA($.extend(data[i], {
                id: i
            }));
            if (!exist) {
                //API.callEvent('newOther', list[i]);
                list[i].firstAfterUpdate();
                API.callEvent(Engine.apiData.NEW_OTHER, list[i]);
                Engine.soundManager.manageOtherNotifications(data[i]);
            }
            //if (exist && !del) API.callEvent('updateOther', list[i]);
            if (exist && !del) API.callEvent(Engine.apiData.UPDATE_OTHER, list[i]);
            Engine.whoIsHere.addToList(i, data[i], list[i]);
        }
        if (delOrNew) {
            Engine.whoIsHere.updatePlayersNumber();
            Engine.whoIsHere.updateScroll();
        }
        Engine.miniMapController.updateWindowMiniMapOthersPos(data);
    };

    //runs 60x per s.
    this.update = function(dt) {
        for (var i in list) {
            list[i].update(dt);
        }
    };

    this.setOthersAnimationState = function(state) {
        for (var i in list) {
            list[i].setStaticAnimation(state);
            if (isset(list[i].pet)) {
                list[i].pet.setStaticAnimation(state);
            }
        }
    };

    this.draw = function(ctx) {
        for (var i in npc) {
            list[i].draw(ctx)
        }
    };

    this.check = function() {
        return list;
    };

    this.removeOne = function(id, animation = true) {
        Engine.whoIsHere.removeFromList(id);
        Engine.emotions.removeAllFromSourceId(id);
        if (animation) Engine.wraithCharacterManager.addPetWraith(list[id], 'o' + id);
        if (list[id].pet && animation) Engine.wraithCharacterManager.addPetWraith(list[id].pet, 'p' + id);
        delete list[id];
    };

    //called before new map loads
    this.onClear = function(animation = true) {
        for (var i in list) {
            list[i].delete(animation);
        }
        list = {};
    };

    this.getDrawableList = function() {
        var arr = [];
        for (var i in list) {
            arr.push(list[i]);
            if (isset(list[i].pet)) arr.push(list[i].pet);
            if (list[i].wanted) arr.push(list[i].wanted);
            if (isset(list[i].colorMark)) arr.push(list[i].colorMark);
            if (isset(list[i].whoIsHereGlow)) arr.push(list[i].whoIsHereGlow);

            if (list[i].matchmakingChampionAura) arr.push(list[i].matchmakingChampionAura);
            //if (isset(list[i].followGlow))arr.push(list[i].followGlow);

            let followController = list[i].getFollowController();
            if (followController.checkFollowGlow()) arr.push(followController.getFollowGlow());

            if (checkDrawDataDrawer(list[i])) arr.push(list[i].getDataDrawer());


            //if (isset(list[i].playerCatcher))arr.push(list[i].playerCatcher);
        }
        return arr;
    };

    const checkDrawDataDrawer = (oneOther) => {
        const OTHER = HandHeldMiniMapData.TYPE.OTHER;
        const kind = oneOther.getKind();
        const canUpdate = getEngine().miniMapController.handHeldMiniMapController.canUpdateDataDrawer(OTHER, kind);
        const massHide = Engine.rajMassObjectHide.checkMassObjectsHide(oneOther);

        return canUpdate && !massHide;
    };

    this.getRoleplayRank = function(lvl) {
        var lvlnames = ['CiuÅacz', 'Åowca WilkÃ³w', 'Tropiciel ZulusÃ³w', 'Poganiacz GoblinÃ³w', 'PiÄtno OrkÃ³w',
            'MiÅoÅnik Harpii', 'Rezun OlbrzymÃ³w', 'Hycel Gnolli', 'Koszmar TollokÃ³w', 'Magazynier PeÅnÄ GÄbÄ',
            'Zguba MinotaurÃ³w', 'Niszczyciel SzkieletÃ³w', 'Treser CentaurÃ³w', 'Nieustraszony Pogromca Korsarzy',
            'TaÅczÄcy z Mumiami', 'Szabrownik WrakÃ³w', 'GobliÅski Kat', 'Postrach BerserkerÃ³w', 'WÅadca KazamatÃ³w',
            'MÅot na Czarownice', 'DrÄczyciel PraorkÃ³w', 'Zguba Czarnej Gwardii', 'Poskramiacz Furboli',
            'Egzekutor MyÅwiÃ³rÃ³w', 'Wielki Inkwizytor', 'Zaklinacz ArachnidÃ³w', 'Kat Demonisa', 'Oprawca MaddokÃ³w',
            'Potomek NajwyÅ¼szych', 'Piekielny JeÅºdÅºca'
        ];
        return lvl ? '<center>' + lvlnames[Math.min(lvlnames.length - 1, (lvl - 1) >> 3)] + '</center>' : '';
    };

    this.getById = function(id) {
        return list[id];
    }

    this.crushTestStart = function(max) {
        var startTs = ts();
        console.log('crushTestStart');
        var x = Engine.map.size.x;
        var y = Engine.map.size.y;
        var data = {};
        for (var i = 0; i < max; i++) {
            var newX = Math.floor(x * Math.random());
            var newY = Math.floor(y * Math.random());
            var d = this.oneObjTest(newX, newY, i);
            data[i] = d;
        }
        this.updateData(data)
        console.log('crushTestStop Update time is : ' + ((ts() - startTs) / 1000));
    };

    this.oneObjTest = function(x, y) {
        return {
            "nick": "Yakuz" + x + y,
            "icon": "/noob/pm.gif",
            "clan": {
                "id": 123,
                "name": "No tak byÅo nie zmyÅlam"
            },
            "x": x,
            "y": y,
            "dir": 3,
            "rights": 2,
            "lvl": 0,
            "prof": "p",
            "attr": 0,
            "relation": ""
        }
    };

    this.createOtherContextMenu = (e, player, exceptionsArray) => {
        const contextMenu = [];

        let issetCharId = isset(player.charId);
        let issetAccountId = isset(player.accountId);
        let issetLvl = isset(player.lvl);
        let issetNick = isset(player.nick);
        let issetProf = isset(player.prof);

        if (!exceptionsArray) exceptionsArray = [];

        const SEND_CHAT_MESSAGE = OthersContextMenuData.SEND_CHAT_MESSAGE;
        const SHOW_EQ = OthersContextMenuData.SHOW_EQ;
        const INVITE_TO_FRIEND = OthersContextMenuData.INVITE_TO_FRIEND;
        const INVITE_TO_ENEMIES = OthersContextMenuData.INVITE_TO_ENEMIES;
        const INVITE_TO_PARTY = OthersContextMenuData.INVITE_TO_PARTY;
        const SHOW_PROFILE = OthersContextMenuData.SHOW_PROFILE;

        let allOptions = {
            [SEND_CHAT_MESSAGE]: true,
            [SHOW_EQ]: true,
            [INVITE_TO_FRIEND]: true,
            [INVITE_TO_ENEMIES]: true,
            [INVITE_TO_PARTY]: true,
            [SHOW_PROFILE]: true
        };

        for (let i = 0; i < exceptionsArray.length; i++) {
            let keyToRemove = exceptionsArray[i];

            if (allOptions[keyToRemove]) delete allOptions[keyToRemove];
            else errorReport(moduleData.fileName, "createOtherContextMenu", "key not exist", keyToRemove)

        }

        const canAddSendChatMessage = allOptions[SEND_CHAT_MESSAGE] && issetNick && player.relation != SocietyData.RELATION.ENEMY;
        const canAddShowEq = allOptions[SHOW_EQ] && issetCharId && issetAccountId && issetLvl && issetNick && issetProf;
        const canAddInviteToFriend = allOptions[INVITE_TO_FRIEND] && issetNick;
        const canAddInviteToEnemies = allOptions[INVITE_TO_ENEMIES] && issetNick;
        const canAddInviteToParty = allOptions[INVITE_TO_PARTY] && issetNick;
        const canAddShowProfile = allOptions[SHOW_PROFILE] && issetCharId && issetAccountId;

        if (canAddSendChatMessage) {
            contextMenu.push([
                _t('send_message', null, 'chat'),
                function() {
                    Engine.chatController.getChatInputWrapper().setPrivateMessageProcedure(player.nick);
                }
            ]);
        }

        if (canAddShowEq) {
            contextMenu.push([
                _t('show_eq'),
                () => {
                    Engine.showEqManager.update({
                        id: player.charId,
                        account: player.accountId,
                        lvl: player.lvl,
                        nick: player.nick,
                        prof: player.prof,
                        icon: '',
                        world: Engine.worldConfig.getWorldName()
                    });
                }
            ]);
        }

        if (canAddInviteToFriend) {
            contextMenu.push([
                _t('invite_to_friend'),
                () => _g('friends&a=finvite&nick=' + player.nick.trim().split(' ').join('_'))
            ]);
        }

        if (canAddInviteToEnemies) {
            contextMenu.push([
                _t('add_to_enemies'),
                () => _g('friends&a=eadd&nick=' + player.nick.trim().split(' ').join('_'))
            ]);
        }

        if (canAddInviteToParty) {
            contextMenu.push([
                _t('team_invite', null, 'menu'),
                () => _g(`party&a=inv&id=${player.charId}`)
            ]);
        }

        if (canAddShowProfile) {
            const {
                showProfile
            } = require('core/HelpersTS.ts');
            contextMenu.push([
                _t('show_profile', null, 'menu'),
                () => showProfile(player.accountId, player.charId)
            ]);
        }

        if (contextMenu.length) {
            Engine.interface.showPopupMenu(contextMenu, e);
            //return true;
        }
        //return false;
    }

    const findKindOther = (oneOther) => {

        const handHeldMiniMapController = getEngine().miniMapController.handHeldMiniMapController;
        const OTHER = HandHeldMiniMapData.TYPE.OTHER;
        const KIND = HandHeldMiniMapData.KIND;

        if (handHeldMiniMapController.canUpdate(OTHER, KIND.GROUP) && isGroup(oneOther)) return KIND.GROUP;
        if (handHeldMiniMapController.canUpdate(OTHER, KIND.WANTED) && isWanted(oneOther)) return KIND.WANTED;
        if (handHeldMiniMapController.canUpdate(OTHER, KIND.CLAN) && isClanMember(oneOther)) return KIND.CLAN;
        if (handHeldMiniMapController.canUpdate(OTHER, KIND.ENEMY) && isEnemy(oneOther)) return KIND.ENEMY;
        if (handHeldMiniMapController.canUpdate(OTHER, KIND.FRIEND) && isFriend(oneOther)) return KIND.FRIEND;
        if (handHeldMiniMapController.canUpdate(OTHER, KIND.CLAN_ENEMY) && isClanEnemy(oneOther)) return KIND.CLAN_ENEMY;
        if (handHeldMiniMapController.canUpdate(OTHER, KIND.CLAN_FRIEND) && isClanFriend(oneOther)) return KIND.CLAN_FRIEND;

        return HandHeldMiniMapData.KIND.NORMAL_OTHER;
    }

    function isGroup(oneOther) {
        let p = Engine.party;
        if (!p) return false;

        let id = oneOther.d.id;
        return p.getMembers()[id];
    }

    function isWanted(oneOther) {
        return oneOther.wanted;
    }

    function isClanMember(oneOther) {
        return oneOther.d.relation == SocietyData.RELATION.CLAN
    }

    function isFriend(oneOther) {
        return oneOther.d.relation == SocietyData.RELATION.FRIEND
    }

    function isEnemy(oneOther) {
        return oneOther.d.relation == SocietyData.RELATION.ENEMY
    }

    function isClanFriend(oneOther) {
        return oneOther.d.relation == SocietyData.RELATION.CLAN_ALLY
    }

    function isClanEnemy(oneOther) {
        return oneOther.d.relation == SocietyData.RELATION.CLAN_ENEMY
    }

    const clearDataToDraw = () => {
        for (let k in list) {
            list[k].clearDataToDraw();
        }
    };

    //const refreshOtherKind = (id) => {
    //	let other = this.getById(id);
    //
    //	if (!other) {
    //		errorReport("OthersManager.js", "refreshOtherKind", "other no exist", id);
    //		return
    //	}
    //
    //	other.refreshKind();
    //}

    this.clearDataToDraw = clearDataToDraw;
    //this.refreshOtherKind = refreshOtherKind;
    this.findKindOther = findKindOther;

};