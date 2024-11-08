/**
 * Created by lukasz on 12.09.14.
 */
const RajCharacterImageChangerData = require('core/raj/rajCharacterImageChanger/RajCharacterImageChangerData');
let Npc = require('core/characters/Npc');
let NpcData = require('core/characters/NpcData');
let NpcGroupsManager = require('core/characters/NpcGroupsManager');
let SearchPath = require('core/searchPath/SearchPath');
let EmotionsData = require('core/emotions/EmotionsData');
var RajMapEventsData = require('core/raj/rajMapEvents/RajMapEventsData');
let HandHeldMiniMapData = require('core/map/handheldMiniMap/HandHeldMiniMapData');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');

module.exports = function() {

    let moduleData = {
        fileName: "NpcManager.js"
    };
    let npc = {};
    let deleteNpc = {};
    //let allGroups 				= {};
    let externalPropertiesCache = {};
    let npcPos = {};
    let NPC_LANG = 'npc';
    let t = [
        _t('wt_titan', null, NPC_LANG),
        _t('wt_hero', null, NPC_LANG),
        _t('wt_elite3', null, NPC_LANG),
        _t('eliteI', null, NPC_LANG),
        _t('easy_enemy', null, NPC_LANG),
        _t('great_enemy', null, NPC_LANG),
        _t('big_enemy', null, NPC_LANG),
        _t('normal_enemy', null, NPC_LANG),
        _t('in_group', null, NPC_LANG),
        _t('eliteII', null, NPC_LANG),
        _t('wt_colossus', null, NPC_LANG)
    ];

    let npcGroupsManager = null;

    const init = () => {
        npcGroupsManager = new NpcGroupsManager();
        npcGroupsManager.init();
    };

    const addNpcToNpcPos = (_npc, x, y) => {
        if (!isset(npcPos[y])) npcPos[y] = {};

        npcPos[y][x] = _npc;
    }

    const removeNpcFromNpcPos = (_npc, x, y) => {
        if (!isset(npcPos[y])) {
            errorReport(moduleData.fileName, "", `npcPos[${y}}] not exist!`, npcPos);
            return
        }

        if (!isset(npcPos[y][x])) {
            errorReport(moduleData.fileName, "", `npcPos[${y}][${x}}] not exist!`, npcPos);
            return
        }

        delete npcPos[y][x];

        if (!lengthObject(npcPos[y])) delete npcPos[y];
    };

    const checkNpcPos = (x, y) => {
        if (!isset(npcPos[y])) return false;

        return npcPos[y][x] ? true : false;
    };

    const clearNpcPos = () => {
        npcPos = {};
    };

    const setInExternalPropertiesCache = (id, data) => {
        externalPropertiesCache[id] = data;
    };

    const checkDataHasExternalProperties = (data) => {
        if (!data || !elementIsObject(data) || !data.external_properties) return false;

        return true;
    };

    const getExternalProperties = (id) => {
        return externalPropertiesCache[id] ? externalPropertiesCache[id] : null;
    }

    const updateData_npcs_del = (data) => {
        for (let npcData of data) {
            let npcId = npcData.id;

            if (!checkNpc(npcId)) {
                //errorReport(moduleData.fileName, "updateData_npcs_del", `Npc id: ${npcId} not exist!`);
                continue
            }
            let oneNpc = getById(npcId);

            if (isset(npcData.respBaseSeconds)) setRespBaseSecondsInNpcData(oneNpc, npcData.respBaseSeconds)

            oneNpc.delete();

        }

        SearchPath.reload();
    }

    const setRespBaseSecondsInNpcData = (oneNpc, respBaseSeconds) => {
        if (!isset(oneNpc.d)) {
            errorReport(moduleData.fileName, "setRespBaseSecondsInNpcData", `attr d not exist in npc ${oneNpc}`);
            return
        }
        oneNpc.d.respBaseSeconds = respBaseSeconds;
    }

    const findKindNpc = (obj) => {
        let kind = null;
        let type = obj.d.type;
        let wt = obj.d.wt;

        if (type == 2 || type == 3) {
            kind = HandHeldMiniMapData.KIND.NORMAL_MONSTER;
            let _kind = getDescriptionOfKindMonster(wt);
            if (_kind) kind = _kind;
        }

        if (type == 0 || type == 6) {
            kind = HandHeldMiniMapData.KIND.NPCS;
            let _kind = getDescriptionOfKindMonster(wt);
            if (_kind) kind = _kind;
        }

        if (type == 5) {
            kind = HandHeldMiniMapData.KIND.NPCS;
            let _kind = getDescriptionOfKindMonster(wt);
            if (_kind) kind = _kind;
        }

        if (type == 7) kind = HandHeldMiniMapData.KIND.RECOVERY;

        return kind;
    }

    const updateData = function(data) {

        for (var index in data) {
            updateOneNpc(data[index]);
        }

        Engine.miniMapController.updateWindowMiniMapMonsterPos(data);
        SearchPath.reload();
    };

    const updateOneNpc = (npcData) => {
        let id = npcData.id;
        let oneNpc = npc[id];
        let exist = isset(npc[id]);

        mergeNpcDataWithNpcTplData(npcData);
        mergeNpcDataWithNpcIconData(npcData);
        parseData(npcData);

        if (checkDeleteNpc(id)) {
            removeFromDeleteNpc(id);
        }

        if (!exist) {
            oneNpc = new Npc();
            npc[id] = oneNpc;

            oneNpc.init();

            //checkGroup(npcData, oneNpc);
            npcGroupsManager.updateData("CREATE", npcData);
            Engine.soundManager.manageNpcNotifications(npcData);

            addNpcToNpcPos(npcData, npcData.x, npcData.y)
        }

        oneNpc.updateDATA.call(oneNpc, $.extend(npcData, {
            id: id
        }));

        if (!exist) {

            let initLoadTime = getEngine().isInitLoadTime();

            oneNpc.firstAfterUpdate();

            if (!initLoadTime) {
                Engine.rajMapEvents.callAllActionsBySpecificEventAndNpc(RajMapEventsData.ON_RESPAWN_NPC, {
                    npcId: id
                });
                Engine.rajCharacterImageChangerManager.callAllActionsBySpecificEventAndNpc(RajCharacterImageChangerData.KIND.ON_RESPAWN, {
                    npcId: id
                });
            }

            API.callEvent(Engine.apiData.NEW_NPC, oneNpc);
            getEngine().questTracking.checkAddNpcAndAdd(oneNpc);
        }

        if (checkDataHasExternalProperties(npcData)) {
            setInExternalPropertiesCache(id, npcData.external_properties);
        }
    };

    const parseData = (data) => {
        if (data.canWalkOver) {
            data.walkover = data.canWalkOver;
            delete data.canWalkOver;
        }

        if (isset(data.group)) {
            data.grp = data.group;
            delete data.group;
        }
    }

    const mergeNpcDataWithNpcTplData = (data) => {
        let tplId = data.tpl;
        let tplData = Engine.npcTplManager.getCloneNpcTpl(tplId);

        if (tplData != null) {

            for (let oneAttr in tplData) {
                if (oneAttr == "id") {
                    continue;
                }

                if (oneAttr == "nick" && data.nick) {
                    continue;
                }

                data[oneAttr] = tplData[oneAttr];
            }

        }
    };

    const mergeNpcDataWithNpcIconData = (data) => {
        let iconId = data.icon.id;
        let icon = Engine.npcIconManager.getNpcIcon(iconId);

        if (icon != null) data.icon = icon;
        else {

            if (data.icon.special) data.icon = data.icon.special;
            else errorReport(moduleData.fileName, "mergeNpcDataWithNpcIconData", "nima", data)
        }
    };

    const draw = function(ctx) {
        for (var i in npc) {
            npc[i].draw(ctx)
        }
    };

    const update = function(dt) {
        for (var i in npc) {
            npc[i].update(dt);
        }
    };

    const getGroupColor = (id) => {
        return npcGroupsManager.getColorFromGroup(id)
    }

    const getAllGroup = function() {
        //return allGroups;
        return npcGroupsManager.getGroups();
    };

    //const checkGroup = function (data, npc) {
    //	if (!data.grp) return;
    //	if (!isset(allGroups[data.grp])) allGroups[data.grp] = [];
    //	allGroups[data.grp].push(npc);
    //};

    const check = () => {
        return npc;
    };

    const checkNpc = function(id) {
        return npc[id] ? true : false;
    };

    const removeOne = function(id) {
        //deleteFromGroup(id);

        npcGroupsManager.updateData("REMOVE", npc[id].d);

        removeNpcFromNpcPos(npc[id], npc[id].getX(), npc[id].getY());
        Engine.wraithCharacterManager.addWraith(npc[id], 'n' + id);
        getEngine().questTracking.checkRemoveNpcAndRemove(npc[id]);
        addToDeleteNpc(id, npc[id]);
        delete npc[id];
        Engine.canvasMultiGlow.removeMultiGlowTargetById(id);
        //if (Engine.questTrack)
        //	Engine.questTrack.checkTaskNpcOrItem(id, 'npc');
    };

    const addToDeleteNpc = (id, npc) => {
        deleteNpc[id] = npc;
    };

    const checkDeleteNpc = (id) => {
        return deleteNpc[id] ? true : false;
    };

    const getDeleteNpc = (id) => {
        return deleteNpc[id];
    };

    const removeFromDeleteNpc = (id) => {
        delete deleteNpc[id];
    };

    const clearDeleteNpc = () => {
        deleteNpc = {};
    };

    //const deleteFromGroup = function (id) {
    //	if (!isset(npc[id].grp)) return;
    //	var grId = npc[id].grp;
    //	var gr = allGroups[grId];
    //	for (var i = 0; i < gr.length; i++) {
    //		if (gr[i].d.id == id) {
    //			gr.splice(i, 1);
    //			break;
    //		}
    //	}
    //	if (gr.length == 0) delete allGroups[grId];
    //};

    const groupShining = function(idGroup, show) {

        let npcFromGroup = npcGroupsManager.getIdNpcsFromGroup(idGroup);

        //for (var k in allGroups[idGroup]) {
        //	var npc = allGroups[idGroup][k];
        //	npc.overMouse = show;
        //}

        for (let index in npcFromGroup) {
            let idNpc = npcFromGroup[index];
            npc[idNpc].overMouse = show;
        }

    };

    const getTip = function(obj) {
        //var t = [
        //	_t('wt_titan', null, 'npc'), _t('wt_hero', null, 'npc'), _t('wt_elite3', null, 'npc'),
        //	_t('eliteI', null, 'npc'), _t('easy_enemy', null, 'npc'), _t('great_enemy', null, 'npc'),
        //	_t('big_enemy', null, 'npc'), _t('normal_enemy', null, 'npc'), _t('in_group', null, 'npc'),
        //	_t('eliteII', null, 'npc'), _t('wt_colossus', null, 'npc')
        //];
        var hero = Engine.hero;
        var rpg = Engine.worldConfig.getRpg();
        var n = obj.d;
        //var notip = false;
        var tip = "<div><strong>" + parseBasicBB(n.nick, false) + "</strong></div>"; // second argument for not escapeHTML
        if (CFG.debug || n.type != 4) {
            if (n.wt > 99) tip += '<i>' + t[0] + '</i>'; //tytan
            else if (n.wt > 89) tip += '<i>' + t[10] + '</i>'; //kolos
            else if (n.wt > 79) tip += '<i>' + t[1] + '</i>'; //heros
            else if (n.wt > 29) tip += '<i>' + t[2] + '</i>'; //elita III
            else if (n.wt > 19) {
                tip += '<i>' + t[9] + '</i>';
                //notip = !rpg;
            } else if (n.wt > 9) tip += '<i>' + t[3] + '</i>'; //elita
            var label = '';
            var lvlcol = '';
            var grp = '';
            var lvlinfo = null;

            let level;

            if (obj.hasOwnProperty('elasticLevel')) {
                let _npc = npc[n.id];

                if (_npc) level = obj.elasticLevel;
                else {
                    warningReport(moduleData.fileName, 'getTip', `Npc ${n.id} not exist in npc list`, npc);
                    level = n.lvl;
                }

            } else level = n.lvl;

            if (n.type == 2 || n.type == 3) {
                var dl = level - hero.d.lvl;
                if (dl < -(Engine.worldConfig.getDropDestroyLvl())) {
                    lvlcol = 'style="color:#888"';
                    lvlinfo = t[4];
                } else if (dl > 10) {
                    lvlcol = 'style="color:#f50"';
                    lvlinfo = t[5];
                } else if (dl > 5) {
                    lvlcol = 'style="color:#ff0"';
                    lvlinfo = t[6];
                } else {
                    lvlinfo = t[7];
                }
            }
            //if (n.grp) console.log(n.grp, n.nick, n.id);
            if (rpg) {
                label = lvlinfo ? lvlinfo : '';
                grp = n.grp ? t[8] : '';
            } else {
                let coma = level == 0 ? '' : ', ';
                label = level ? (level) + " lvl" : '';
                grp = n.grp ? `${coma}grp` : '';
            }

            tip += '<span ' + lvlcol + '>' + label + grp + '</span>';
        }

        if (!obj.getId) return tip; /// EXCEPTION HERO_RESP can not id!!!!!!!!!!

        tip += setEmoSections(obj);

        const debug = getTipDebugContent(n);
        tip += debug;

        return tip;
    };

    const getTipDebugContent = (npc) => CFG.debug ? `<br><span class="debug-content">
			id: ${npc.id},
			tpl: ${npc.tpl}
		</span>` : '';

    const setEmoSections = (npc) => {
        let npcId = npc.getId();
        let rajEmoActions = getEngine().rajEmoActions;
        let srajData = rajEmoActions.checkOneNpcActionsList(npcId);
        let cl = getAllEmoNameOfNpc(npc);

        if (npc.getHasOnetimeQuest()) {}
        if (npc.getHasDailyQuest()) {}


        let imgTip = prepareSrajImgTip(npcId, srajData);
        let clTip = prepareClTip(npcId, srajData, cl);

        if (imgTip == '' && clTip == '') return '';

        let line = '<div class="line"></div>';

        return '<div class="emo-wrapper">' + line + imgTip + clTip + '</div>';
    };

    const prepareSrajImgTip = (npcId, srajData) => {
        if (!srajData) return '';

        let rajEmoActions = getEngine().rajEmoActions;

        let arrayOfRajEmoDefinitionsActionsFileName = rajEmoActions.getRajEmoDefinitionsActionsFileNamesArrayToAddToTip(npcId);
        let arrayOfCl = rajEmoActions.getClToAddToTip(npcId);

        if (!arrayOfRajEmoDefinitionsActionsFileName.length && !arrayOfCl.length) return '';

        let srajDataImg = '';

        for (let k in arrayOfRajEmoDefinitionsActionsFileName) {
            let url = cdnUrl + CFG.r_epath + arrayOfRajEmoDefinitionsActionsFileName[k];
            srajDataImg += '<img src="' + url + '">';
        }

        for (let k in arrayOfCl) {
            let divCl = `emo-npc-icon i-${arrayOfCl[k]}`;
            srajDataImg += '<div class="' + divCl + '"></div>';
        }

        return srajDataImg;
    };

    const prepareClTip = (npcId, srajData, cl) => {
        if (!cl.length) return '';

        let clJoin = '';
        let rajEmoActions = getEngine().rajEmoActions;

        for (let k in cl) {
            let divCl = `emo-npc-icon i-${cl[k]}`;

            let add = false;

            if (srajData) add = rajEmoActions.getShowNotify(npcId, cl[k]);
            else add = true;

            if (add) clJoin += '<div class="' + divCl + '"></div>';
        }

        return clJoin;
    };

    const getAllEmoNameOfNpc = (npc, actions) => {
        if (!isset(npc.checkActionsBitByName)) return [];

        let cl = [];

        for (let name in NpcData.BITS) {
            let exist = npc.checkActionsBitByName(name, actions);
            if (exist) cl.push(name);
        }

        if (npc.getHasOnetimeQuest()) cl.push(EmotionsData.NAME.NORMAL_QUEST);
        if (npc.getHasDailyQuest()) cl.push(EmotionsData.NAME.DAILY_QUEST);

        return cl;
    };

    //called before new map loads
    const onClear = function() {
        //allGroups = {};
        npc = {};
        npcGroupsManager.onClear();
        //setFreeIdColor(0);
        clearDeleteNpc();
        clearNpcPos();
        //Engine.agressiveNpc = [];
        //API.callEvent("clear_map_npcs");
        API.callEvent(Engine.apiData.CLEAR_MAP_NPCS);
    };

    const getDrawableList = function() {
        var arr = [];

        let interfaceTimerManager = getEngine().interfaceTimerManager;
        let addonsPanel = getEngine().addonsPanel;
        let rainbowGroups = addonsPanel && addonsPanel.checkRainbowGroups();

        const NPC = CanvasObjectTypeData.NPC

        for (var i in npc) {

            let oneNpc = npc[i];

            if (oneNpc.isIconInvisible() && !CFG.debug) {
                continue;
            }

            arr.push(oneNpc);

            let followController = oneNpc.getFollowController();
            //let drawDataDrawer 		= oneNpc.drawNickOrTip() && !oneNpc.isGateNpc() && !oneNpc.isMachine()
            let drawDataDrawer = checkDrawDataDrawer(oneNpc);

            if (followController.checkFollowGlow()) arr.push(followController.getFollowGlow());
            if (isset(oneNpc.npcGlow) && oneNpc.overMouse) arr.push(oneNpc.npcGlow);
            if (rainbowGroups && isset(oneNpc.characterBlur)) arr.push(oneNpc.characterBlur);
            if (oneNpc.killTimer) arr.push(oneNpc.killTimer);
            if (drawDataDrawer) arr.push(oneNpc.getDataDrawer());
            if (interfaceTimerManager.check(NPC, i)) arr.push(interfaceTimerManager.getCharacterTimer(NPC, i));
        }
        return arr;
    };

    const checkDrawDataDrawer = (oneNpc) => {
        const NPC = HandHeldMiniMapData.TYPE.NPC;
        const kind = oneNpc.getKind();
        const canUpdate = getEngine().miniMapController.handHeldMiniMapController.canUpdateDataDrawer(NPC, kind);
        const hideObject = Engine.rajCharacterHide.checkHideObject(oneNpc);
        const massHide = Engine.rajMassObjectHide.checkMassObjectsHide(oneNpc);

        return canUpdate && oneNpc.drawNickOrTip() && !oneNpc.isGateNpc() && !oneNpc.isMachine() && !hideObject && !massHide
    };

    const setNpcsAnimationState = function(state) {
        for (var i in npc) {
            npc[i].setStaticAnimation(state);
        }
    };

    const getById = function(id) {
        return npc[id];
    }

    //const getByNick = (nick) => {
    //	let o = {};
    //	for (let k in npc) {
    //		if (npc[k].d.nick == nick) o[k] = npc[k];
    //	}
    //	return o;
    //
    //};

    const getRenewableNpcByPosition = (x, y) => {
        for (let k in npc) {
            if (npc[k].d.type === 7 && npc[k].d.x === x && npc[k].d.y === y) return npc[k]
        }
        return false
    };

    //const getNpcWithWalkOverByCord = (x, y) => {
    //	for (let k in npc) {
    //		if (npc[k].d.walkover && npc[k].d.x == x && npc[k].d.y == y) return npc[k]
    //	}
    //	return false
    //};

    const getByArrayId = (arrayId) => {
        let a = [];
        for (let i = 0; i < arrayId.length; i++) {
            if (npc[arrayId[i]]) a.push(npc[arrayId[i]]);
        }
        return a;
    };

    const getAllEmoOfOneNpc = (sourceId) => {
        let allEmoOfOneNpc = [];

        let list = Engine.emotions.getList();

        for (let k in list) {
            let oneEmo = list[k];

            if (oneEmo.sourceId == sourceId && oneEmo.sourceType == EmotionsData.OBJECT_TYPE.NPC) allEmoOfOneNpc.push(oneEmo)

        }

        return allEmoOfOneNpc
    };

    const isTalkNpc = (npcId) => {
        let npc = getById(npcId);

        if (!npc) return false;

        return npc.d.type == 0 || npc.d.type == 5 || npc.d.type == 6;
    };

    const manageDisplayOfNpcEmo = (sourceId) => {

        if (!isTalkNpc(sourceId)) return;

        let allEmoOfOneNpc = getAllEmoOfOneNpc(sourceId);


        if (!allEmoOfOneNpc.length) return;

        Engine.emotions.setDisplayOfEmoFromArray(allEmoOfOneNpc, false);

        if (allEmoOfOneNpc.length > 1) {
            //Engine.emotions.setDisplayOfEmoFromArray(allEmoOfOneNpc, false);
            let priorityEmo = getMostPriorityNpcEmoFromEmoArray(allEmoOfOneNpc);
            Engine.emotions.setDisplayOfEmoFromArray([priorityEmo], true);
        } else Engine.emotions.setDisplayOfEmoFromArray(allEmoOfOneNpc, true);

    };

    //this.getAllTalkNpcAndMonsterObject = () => {
    //	let obj = {
    //		talkNpc :[],
    //		monster: []
    //	};
    //
    //	for (let k in npc) {
    //
    //		if (npc[k].d.type == 4) continue;
    //
    //		if (isTalkNpc(k))  obj.talkNpc.push(npc[k])
    //		else                    obj.monster.push(npc[k])
    //	}
    //
    //	return obj;
    //}

    //this.getAllTalkNpc = () => {
    //	let talkNpc = [];
    //
    //	for (let k in npc) {
    //		if (isTalkNpc(k)) talkNpc.push(npc[k])
    //	}
    //
    //	return talkNpc;
    //}

    const getMostPriorityNpcEmoFromEmoArray = (allEmoOfOneNpc) => {
        let priority = 0;
        let priorityIndex = null;

        for (let k in allEmoOfOneNpc) {

            let emo = allEmoOfOneNpc[k];
            let emoPriority = getPriorityFromEmoMap(emo.type);
            let rajEmoPriority = Engine.rajEmoDefinitions.getPriority(emo.type);

            if (!emoPriority == null && rajEmoPriority == null) continue;

            emoPriority = emoPriority != null ? emoPriority : 0;
            rajEmoPriority = rajEmoPriority != null ? rajEmoPriority : 0;

            emoPriority = Math.max(emoPriority, rajEmoPriority);

            if (emoPriority > priority) {
                priority = emoPriority;
                priorityIndex = k;
            }
        }

        if (priorityIndex == null) return allEmoOfOneNpc[0];
        else return allEmoOfOneNpc[priorityIndex];
    };

    const getPriorityFromEmoMap = (name) => {
        return NpcData.PRIORITY_EMO_MAP[name] ? NpcData.PRIORITY_EMO_MAP[name] : null;
    }

    // this.serveRayControllerData = () => {
    // 	for (let k in npc) {
    // 		if (!npc[k].d.external_properties) continue;
    // 		Engine.rajController.parseObject(npc[k].d.external_properties);
    // 	}
    // }

    const clearDataToDraw = () => {
        for (let k in npc) {
            npc[k].clearDataToDraw();
        }
    };

    const isGateUrl = (url) => {
        return NpcData.GATE_URL[url] ? true : false
    }

    const clearAllCharacterBlur = () => {
        for (let k in npc) {
            let oneNpc = npc[k];
            if (oneNpc.characterBlur) {
                oneNpc.characterBlur.resetDirCanvas();
            }
        }
    }

    this.init = init;
    this.clearDataToDraw = clearDataToDraw;
    this.findKindNpc = findKindNpc;
    this.checkNpcPos = checkNpcPos;
    this.checkDeleteNpc = checkDeleteNpc;
    this.getDeleteNpc = getDeleteNpc;
    this.check = check;
    this.isGateUrl = isGateUrl;
    this.getExternalProperties = getExternalProperties;
    this.updateData_npcs_del = updateData_npcs_del;
    this.updateData = updateData;
    this.draw = draw;
    this.update = update;
    this.getAllGroup = getAllGroup;
    this.getGroupColor = getGroupColor;
    this.checkNpc = checkNpc;
    this.removeOne = removeOne;
    this.groupShining = groupShining;
    this.getTip = getTip;
    this.getTipDebugContent = getTipDebugContent;
    this.getAllEmoNameOfNpc = getAllEmoNameOfNpc;
    this.onClear = onClear;
    this.getDrawableList = getDrawableList;
    this.setNpcsAnimationState = setNpcsAnimationState;
    this.getById = getById;
    this.getRenewableNpcByPosition = getRenewableNpcByPosition;
    this.getByArrayId = getByArrayId;
    this.isTalkNpc = isTalkNpc;
    this.manageDisplayOfNpcEmo = manageDisplayOfNpcEmo;
    this.clearAllCharacterBlur = clearAllCharacterBlur;
};