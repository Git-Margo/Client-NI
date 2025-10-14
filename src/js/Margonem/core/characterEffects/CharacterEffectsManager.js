let CharacterEffectsData = require('@core/characterEffects/CharacterEffectsData');
let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');
//var RajData = require('@core/raj/RajData');

module.exports = function() {


    const init = () => {

    };

    //const getCreateBattleData = () => {
    //	let data = [
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.BATTLE,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.ANIMATION,
    //			target: {
    //				kind: CharacterEffectsData.characterTarget.NPC,
    //				id: 1463
    //			},
    //			params: {
    //				gifUrl      : '22_ogluszajacy-cios.gif',
    //				position    : CharacterEffectsData.position.CENTER,
    //				repeat      : 10
    //			}
    //		},
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.BATTLE,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.ANIMATION,
    //			target: {
    //				kind: CharacterEffectsData.characterTarget.NPC,
    //				id: 1463
    //			},
    //			params: {
    //				gifUrl      : '22_ogluszajacy-cios.gif',
    //				position    : CharacterEffectsData.position.LEFT,
    //				repeat      : 10
    //			}
    //		},
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.BATTLE,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.ANIMATION,
    //			target: {
    //				kind: CharacterEffectsData.characterTarget.NPC,
    //				id: 1463
    //			},
    //			params: {
    //				gifUrl      : '22_ogluszajacy-cios.gif',
    //				position    : CharacterEffectsData.position.RIGHT,
    //				repeat      : 10
    //			}
    //		},
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.BATTLE,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.ANIMATION,
    //			target: {
    //				kind: CharacterEffectsData.characterTarget.NPC,
    //				id: 1463
    //			},
    //			params: {
    //				gifUrl      : '22_ogluszajacy-cios.gif',
    //				position    : CharacterEffectsData.position.TOP,
    //				repeat      : 10
    //			}
    //		},
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.BATTLE,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.ANIMATION,
    //			target: {
    //				kind: CharacterEffectsData.characterTarget.NPC,
    //				id: 1463
    //			},
    //			params: {
    //				gifUrl      : '22_ogluszajacy-cios.gif',
    //				position    : CharacterEffectsData.position.BOTTOM,
    //				repeat      : 10
    //			}
    //		}
    //	];
    //	return data;
    //};

    //const getCreateAnimationAllNpc = () => {
    //
    //	let npcs = Engine.npcs.check();
    //	let d = [];
    //	for (let k in npcs) {
    //
    //		let o = {
    //			action: CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name: 'FIGHT-MAP',
    //			effect: CharacterEffectsData.effect.ANIMATION,
    //			target: {
    //				kind: CharacterEffectsData.characterTarget.NPC,
    //				id: k,
    //			},
    //			params: {
    //				gifUrl      : '22_ogluszajacy-cios.gif',
    //				position: CharacterEffectsData.position.CENTER,
    //				repeat: true,
    //			},
    //		};
    //
    //		d.push(o);
    //	}
    //
    //	return d
    //}

    //const getCreateTintAllNpc = () => {
    //
    //	let npcs = Engine.npcs.check();
    //	let d = [];
    //	for (let k in npcs) {
    //
    //		let o = {
    //			action: CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name: 'FIGHT-MAP',
    //			effect: CharacterEffectsData.effect.TINT,
    //			target: {
    //				kind: CharacterEffectsData.characterTarget.NPC,
    //				id: k,
    //			},
    //			params: {
    //				position: CharacterEffectsData.position.CENTER,
    //				repeat: true,
    //				color: '0,255,0',
    //				duration: 2,
    //			},
    //		};
    //
    //		d.push(o);
    //	}
    //
    //	return d
    //}

    //const getRemoveTintAllNpc = () => {
    //
    //	let npcs = Engine.npcs.check();
    //	let d = [];
    //	for (let k in npcs) {
    //
    //		let o = {
    //			action      : CharacterEffectsData.action.REMOVE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.NPC,
    //				id: k
    //			}
    //		}
    //		d.push(o);
    //	}
    //	return d;
    //}

    //const getRemoveAnimationAllNpc = () => {
    //
    //	let npcs = Engine.npcs.check();
    //	let d = [];
    //	for (let k in npcs) {
    //
    //		let o = {
    //			action      : CharacterEffectsData.action.REMOVE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.NPC,
    //				id: k
    //			}
    //		}
    //		d.push(o);
    //	}
    //
    //	return d;
    //}

    //const getCreateTintData = () => {
    //	let data = [
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.TINT,
    //			target: {
    //				kind: CharacterEffectsData.characterTarget.NPC,
    //				id: 77037
    //			},
    //			params: {
    //				position    : CharacterEffectsData.position.BOTTOM,
    //				repeat      : 10,
    //				color       : "0,255,0",
    //				duration    : 2,
    //			}
    //		},
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.TINT,
    //			target: {
    //				kind: CharacterEffectsData.characterTarget.NPC,
    //				id: 77037
    //			},
    //			params: {
    //				position    : CharacterEffectsData.position.CENTER,
    //				repeat      : 10,
    //				color       : "0,255,0",
    //				duration    : 2,
    //			}
    //		},
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.TINT,
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.NPC,
    //				id: 77037
    //			},
    //			params: {
    //				position    : CharacterEffectsData.position.LEFT,
    //				repeat      : 5,
    //				color       : "255,0,0",
    //				duration    : 2,
    //			}
    //		},
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.TINT,
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.NPC,
    //				id: 77037
    //			},
    //			params: {
    //				position    : CharacterEffectsData.position.RIGHT,
    //				repeat      : 5,
    //				color       : "255,0,0",
    //				duration    : 2,
    //			}
    //		},
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.TINT,
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.HERO
    //			},
    //			params: {
    //				position    : CharacterEffectsData.position.LEFT,
    //				color       : "0,0,255",
    //				duration    : 2,
    //				//repeat      : true
    //			}
    //		},
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.TINT,
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.HERO
    //			},
    //			params: {
    //				position    : CharacterEffectsData.position.TOP,
    //				color       : "0,0,255",
    //				duration    : 2,
    //				//repeat      : true
    //			}
    //		},
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.TINT,
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.HERO
    //			},
    //			params: {
    //				position    : CharacterEffectsData.position.BOTTOM,
    //				color       : "0,0,255",
    //				duration    : 2,
    //				//repeat      : true
    //			}
    //		},
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.TINT,
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.HERO
    //			},
    //			params: {
    //				position    : CharacterEffectsData.position.RIGHT,
    //				color       : "0,0,255",
    //				duration    : 2,
    //				//repeat      : true
    //			}
    //		},
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.TINT,
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.HERO
    //			},
    //			params: {
    //				position    : CharacterEffectsData.position.CENTER,
    //				color       : "0,0,255",
    //				duration    : 2,
    //				//repeat      : true
    //			}
    //		}
    //	];
    //	return data
    //};

    //const getCreateData = () => {
    //	let data = [
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.TINT,
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.HERO
    //			},
    //			params: {
    //				duration		: 2,
    //				color				: '255,255,0',
    //				position    : CharacterEffectsData.position.CENTER,
    //				repeat      : 5
    //			}
    //		},
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.ANIMATION,
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.HERO
    //			},
    //			params: {
    //				gifUrl      : '22_ogluszajacy-cios.gif',
    //				position    : CharacterEffectsData.position.LEFT,
    //				repeat      : true
    //			}
    //		}
    //	];
    //	return data
    //};

    //const getRemoveDataTint = () => {
    //	let data = [
    //		{
    //			action      : CharacterEffectsData.action.REMOVE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.NPC,
    //				id: 56085
    //			}
    //		}
    //	];
    //
    //	return data;
    //};

    //const getRemoveDataAnimation = () => {
    //	let data = [
    //		{
    //			action      : CharacterEffectsData.action.REMOVE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			effect      : CharacterEffectsData.effect.ANIMATION,
    //			name        : 'FIGHT-MAP',
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.NPC,
    //				id: 56085
    //			}
    //		}
    //	];
    //
    //	return data;
    //};

    const updateData = (_data, additionalData) => {



        let rajActionManager = Engine.characterEffectsMapManager.getRajActionManager(); // TODO: remove characterBattleEffects

        if (rajActionManager.checkClearForObjectWithListActionId(_data, additionalData)) {
            rajActionManager.clearDataForObjectWithListActionId(_data, additionalData, Engine.characterEffectsMapManager);
            return;
        }


        if (!Engine.characterEffectsMapManager.getRajActionManager().checkCorrectMainData(_data, additionalData)) {
            return;
        }

        //if (!isset(_data.list)) {
        //	errorReport('CharacterEffectsManager.js', 'updateData', 'Attr list not exist!', _data);
        //	return
        //}

        let data = prepareData(_data.list);

        for (let k in data) {
            let oneData = data[k];

            if (!oneData.windowTarget) {
                errorReport('CharacterEffectsManager.js', 'updateData', 'Attr windowTarget not exist!', oneData);
                continue;
            }

            //if (oneData.chainEffects) {
            //	updateOneChainEffectsData(oneData)
            //	continue
            //}

            updateOneData(oneData, additionalData)

        }

        // console.log(Engine.characterEffectsChainManager.getChain());

    };

    //const updateOneChainEffectsData = (oneData) => {
    //	let name = oneData.name;
    //	Engine.characterEffectsChainManager.addChainData(oneData);
    //
    //	if (!Engine.characterEffectsChainManager.checkChainDataIsComplete(name)) return;
    //
    //	let ondeData = Engine.characterEffectsChainManager.getCurrentEffectFromChain(name);
    //	updateOneData(ondeData);
    //}


    const updateOneData = (oneData, additionalData) => {
        switch (oneData.windowTarget) {
            case CharacterEffectsData.windowTarget.MAP:
                Engine.characterEffectsMapManager.updateData(oneData, additionalData);
                break;
            case CharacterEffectsData.windowTarget.BATTLE:
                Engine.characterEffectsBattleManager.updateData(oneData, additionalData);
                break;
            default:
                errorReport('CharacterEffectsManager.js', 'updateData', 'incorrect attr windowTarget!', oneData)
                break
        }
    }

    //const fillDataFromTemplate = (data) => {
    //	for (let k in data) {
    //		if (!isset(data[k].tplId)) continue;
    //
    //		let tplId = data[k].tplId;
    //
    //		if (!Engine.rajController.checkTemplateExist(RajData.keys.CHARACTER_EFFECT, tplId)) {
    //			errorReport('CharacterEffectsManager.js', 'fillDataFromTemplate', 'tplId not exist in Engine.rajController.characterEffectTemplate', data)
    //			continue;
    //		}
    //
    //		data[k] = Engine.rajController.getMergeTemplateWithData(RajData.keys.CHARACTER_EFFECT, tplId, data[k])
    //
    //		delete data[k].tplId;
    //	}
    //}

    const prepareData = (data) => {
        let newData = [];

        //fillDataFromTemplate(data);

        for (let k in data) {
            let oneData = data[k];
            //if (checkMultiTarget(oneData)) {
            //
            //	addRecordsFromMultiTargetDoNewData(oneData, newData);
            //
            //} else {
            newData.push(oneData);
            //}
        }

        return newData
    };

    //const checkMultiTarget = (oneData) => {
    //	if (!oneData.target || !oneData.target.kind) return false;
    //
    //	switch (oneData.target.kind) {
    //		case CharacterEffectsData.characterTarget.ALL_TALK_NPC: return true;
    //		case CharacterEffectsData.characterTarget.ALL_MONSTER : return true;
    //	}
    //
    //	return false
    //};

    //const addRecordsFromMultiTargetDoNewData = (oneData, newData) => {
    //	let obj = null;
    //	let talkNpcAndMonsteObject = Engine.npcs.getAllTalkNpcAndMonsterObject();
    //
    //	switch (oneData.target.kind) {
    //		case CharacterEffectsData.characterTarget.ALL_TALK_NPC: obj = talkNpcAndMonsteObject.talkNpc; break;
    //		case CharacterEffectsData.characterTarget.ALL_MONSTER:  obj = talkNpcAndMonsteObject.monster;  break;
    //		default : errorReport('CharacterEffectsManager.js', '', 'kind no exist!', oneData);
    //	}
    //
    //	for (let k in obj) {
    //		let cloneObject = copyStructure(oneData);
    //		cloneObject.target.kind  = CanvasObjectTypeData.NPC;
    //		cloneObject.target.id    = obj[k].d.id;
    //
    //		newData.push(cloneObject);
    //	}
    //
    //}

    //const getMultiTargetALL_MONSTERData = () => {
    //	let data = [
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.TINT,
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.ALL_MONSTER
    //			},
    //			params: {
    //				duration		: 2,
    //				color				: '255,255,0',
    //				position    : CharacterEffectsData.position.CENTER,
    //				repeat      : 5
    //			}
    //		}
    //	]
    //	return data
    //}

    //const getMultiTargetALL_TALK_NPCData = () => {
    //	let data = [
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.TINT,
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.ALL_TALK_NPC
    //			},
    //			params: {
    //				duration		: 2,
    //				color				: '255,255,0',
    //				position    : CharacterEffectsData.position.CENTER,
    //				repeat      : 5
    //			}
    //		}
    //	]
    //	return data
    //}

    //const getPetData = () => {
    //	let data = [
    //		{
    //			action      : CharacterEffectsData.action.CREATE,
    //			windowTarget: CharacterEffectsData.windowTarget.MAP,
    //			name        : 'FIGHT-MAP',
    //			effect      : CharacterEffectsData.effect.TINT,
    //			target: {
    //				kind:CharacterEffectsData.characterTarget.PET
    //			},
    //			params: {
    //				duration		: 2,
    //				color				: '255,255,0',
    //				position    : CharacterEffectsData.position.CENTER,
    //				repeat      : 5
    //			}
    //		}
    //	]
    //	return data
    //}

    //const getRemoveChainData = () => {
    //
    //	return {
    //		"list": [
    //			{
    //				"action"      : "REMOVE",
    //				"windowTarget": "MAP",
    //				"effect"      : "ANIMATION",
    //				"name"        : "Sralala",
    //				"target": {
    //					"kind":"Hero"
    //				}
    //			}
    //		]
    //	}
    //}

    //const getChainData = () => {
    //
    //	return {
    //		"list": [
    //			{
    //				"action": "CREATE",
    //				"name": "Sralala",
    //				"windowTarget": "MAP",
    //				"effect": "TINT",
    //				"target": {
    //					"kind": "Hero"
    //				},
    //				"chainEffects": {
    //					"chainTab": [0, 1, 2, 3],
    //					"timeBetween": 0,
    //					"chainRepeat": true,
    //					"chainIndex": 0,
    //				},
    //				"params": {
    //					"duration": 1,
    //					"color": "255,0,0",
    //					"repeat": 2,
    //					"position": "CENTER",
    //				},
    //			},
    //			{
    //				"action"      : "CREATE",
    //				"windowTarget": "MAP",
    //				"name"        : "Sralala",
    //				"effect"      : "ANIMATION",
    //				"target": {
    //					"kind":"Hero"
    //				},
    //				"chainEffects": {
    //					"chainIndex": 1,
    //				},
    //				"params": {
    //					"gifUrl"      : "22_ogluszajacy-cios.gif",
    //					"position"    : "CENTER",
    //					"repeat"      : 3
    //				}
    //			},
    //			{
    //				"action": "CREATE",
    //				"name": "Sralala",
    //				"windowTarget": "MAP",
    //				"effect": "TINT",
    //				"target": {
    //					"kind": "Hero"
    //				},
    //				"chainEffects": {
    //					"chainIndex": 2,
    //				},
    //				"params": {
    //					"duration": 2,
    //					"color": "0,255,0",
    //					"repeat": 2,
    //					"position": "CENTER",
    //				},
    //			},
    //			{
    //				"action": "CREATE",
    //				"name": "Sralala",
    //				"windowTarget": "MAP",
    //				"effect": "TINT",
    //				"target": {
    //					"kind": "Hero"
    //				},
    //				"chainEffects": {
    //					"chainIndex": 3,
    //				},
    //				"params": {
    //					"duration": 3,
    //					"color": "0,0,255",
    //					"repeat": 2,
    //					"position": "CENTER",
    //				},
    //			},
    //		],
    //	};
    //
    //}


    this.init = init;
    this.updateData = updateData;
    //this.updateOneChainEffectsData = updateOneChainEffectsData;
    //this.getCreateData = getCreateData;
    //this.getCreateBattleData = getCreateBattleData;
    //this.getCreateTintData = getCreateTintData;

    //this.getCreateTintAllNpc = getCreateTintAllNpc;
    //this.getCreateAnimationAllNpc = getCreateAnimationAllNpc;

    //this.getRemoveTintAllNpc = getRemoveTintAllNpc;
    //this.getRemoveAnimationAllNpc = getRemoveAnimationAllNpc;


    //this.getRemoveDataTint = getRemoveDataTint;
    //this.getRemoveDataAnimation = getRemoveDataAnimation;
    //this.getMultiTargetALL_MONSTERData = getMultiTargetALL_MONSTERData;
    //this.getMultiTargetALL_TALK_NPCData = getMultiTargetALL_TALK_NPCData;
    //this.getChainData = getChainData;
    //this.getRemoveChainData = getRemoveChainData;
    //this.getPetData = getPetData;

};