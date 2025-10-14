let BattleBackgroundTintAction = require('@core/battle/battleEffects/screen/BattleBackgroundTintAction');
let BattleEarthQuakeAction = require('@core/battle/battleEffects/screen/BattleEarthQuakeAction');
let BattleWarriorsActionController = require('@core/battle/battleEffects/BattleWarriorsActionController');
let BFD = require('@core/battle/battleEffects/BattleEffectsData');
var SoundData = require('@core/sound/SoundData');

module.exports = function() {

    let battleBackgroundTintAction;
    let battleEarthQuakeAction;
    let battleWarriorsActionController;

    let skillsDefinitions = {};
    let block = {};
    let overrideSkillsDefinitions = {};

    this.clearAllEffects = () => {
        battleWarriorsActionController.clearWarriorsActionController();
    };

    this.getBlock = () => {
        return block;
    };

    this.getOverrideSkillsDefinitions = () => {
        return overrideSkillsDefinitions;
    };

    this.getSkillsDefinitions = () => {
        return skillsDefinitions;
    };

    this.getBattleEarthQuakeAction = () => {
        return battleEarthQuakeAction;
    };

    this.getBattleBackgroundTintAction = () => {
        return battleBackgroundTintAction;
    };

    this.getBattleWarriorsActionController = () => {
        return battleWarriorsActionController;
    };

    this.init = () => {
        battleBackgroundTintAction = new BattleBackgroundTintAction();
        battleEarthQuakeAction = new BattleEarthQuakeAction();
        battleWarriorsActionController = new BattleWarriorsActionController();

        battleBackgroundTintAction.init();
        battleEarthQuakeAction.init();
        battleWarriorsActionController.init();

        this.initDataFromJSON()
    };

    this.updateData = (data) => {

        //if (Engine.opt(26)) return
        if (!Engine.settingsOptions.isBattleEffectsOn()) {
            return;
        }

        for (let i = 0; i < data.length; i++) {

            let oneSetOfEffects = data[i];

            for (let j = 0; j < oneSetOfEffects.length; j++) {

                let oneEffectData = oneSetOfEffects[j];

                if (oneEffectData.target == BFD.target.CHARACTER && getEngine().battle.warriorsList[oneEffectData.id].getNotDrawSkillsAnimation()) {
                    continue;
                }

                let oneEffect = this.createOneEffectData(oneEffectData);

                this.startEffect(oneEffect)
            }

        }


    };

    this.getEmptyId = (objectToCheckFreeId) => {
        let index = 0;

        while (objectToCheckFreeId[index]) {
            index++
        }

        return index;
    };

    this.createOneEffectData = (_effectData) => {
        return {
            finish: false,
            data: JSON.parse(JSON.stringify(_effectData)),
            effectId: null
            //actualEffectIndex : index
        };
    };

    this.startEffect = (oneEffect) => {
        if (oneEffect.data.target == BFD.target.SCREEN) {

            if (oneEffect.data.effect == BFD.effect.SHAKE) {
                battleEarthQuakeAction.updateData(oneEffect);
                battleEarthQuakeAction.start();
            }

            if (oneEffect.data.effect == BFD.effect.TINT) {
                battleBackgroundTintAction.updateData(oneEffect);
                battleBackgroundTintAction.start();
            }

        }

        if (oneEffect.data.target == BFD.target.CHARACTER) {
            battleWarriorsActionController.updateData(oneEffect);
        }

    };

    this.checkRepeat = (actualRepeat, data) => {
        let repeat = data.data.params.repeat;

        if (!repeat) return false;

        return actualRepeat < repeat + 1;
    };

    this.afterStopAction = (actionObject, actualRepeat, oneData) => {
        let repeat = this.checkRepeat(actualRepeat, oneData);

        if (repeat) {
            actionObject.start();
            return
        }

        if (oneData.data.target == BFD.target.CHARACTER) {
            battleWarriorsActionController.removeAction(oneData);
        }
    };


    this.updateFromBattleMessage = (m) => {

        console.log("START");
        console.log(m.join(';'))
        for (var i in m) {
            let a = this.getF1F2(m[i]);
            console.log(a.f1, a.f2);
        }
        console.log("END");
        console.log('');

    };

    this.getF1F2 = (_msg) => {
        let msg = _msg.split(';');
        let id1 = 0;
        let id2 = 0;
        let f1;
        let f2;

        if (msg[0].indexOf('=') > 0) {
            let tmp = msg[0].split('=');
            id1 = parseInt(tmp[0]);

        } else id1 = parseInt(msg[0]);

        if (msg[1].indexOf('=') > 0) {
            let tmp = msg[1].split('=');
            id2 = parseInt(tmp[0]);

        } else id2 = parseInt(msg[1]);

        if (isset(Engine.battle.show)) {
            if (id1) f1 = Engine.battle.warriorsList[id1];
            else f1 = {
                name: 'Bï¿½?ÄD#1!'
            };

            if (id2) f2 = Engine.battle.warriorsList[id2];
            else f2 = {
                name: 'Bï¿½?ÄD#1!'
            };
        }

        return {
            f1,
            f2
        };
    };

    this.checkIsBlock = (skillName, oneMsg, allM, indexM) => {
        if (!oneMsg) return false;
        if (!allM) return false;

        //let msg = allM.join(',').split(';');
        let actionDamagePairArray = this.getArrayToCheckBlock(allM, indexM);

        // console.log(actionDamagePairArray);

        for (let k in actionDamagePairArray) {

            if (!block[actionDamagePairArray[k]]) continue
            let skill = block[actionDamagePairArray[k]];

            if (skillName == actionDamagePairArray[k]) continue;


            // if (skill.all) {
            //     if (skill.exception) {
            //         for (let kk in skill.exception) {
            //             if (skill.exception[kk] == skillName) return false
            //         }
            //         return true
            //     }
            // }

            if (skill.all && skill.exception) return this.checkExceptionBlockList(skill, skillName)

            if (skill.list) {
                for (let kk in skill.list) {
                    if (skill.list[kk] == skillName) return true
                }
            }

        }

        return false;
    };

    this.checkExceptionBlockList = (skill, skillName) => {
        for (let k in skill.exception) {
            if (skill.exception[k] == skillName) return false
        }
        return true
    }

    this.getArrayToCheckBlock = (allM, indexM) => {
        let str = allM[indexM];
        let result = str.match(/skillId=([0-9]*)/g);

        if (result) {
            let parseIndexM = parseInt(indexM);
            let correctInteger = Number.isInteger(parseInt(parseIndexM));

            if (correctInteger) {
                let nextIndex = parseIndexM + 1;

                if (allM[nextIndex]) str = allM[indexM] + ',' + allM[nextIndex];
                else {
                    //warningReport("BattleEffectsController", 'getArrayToCheckBlock', "Battle log have not next line!", allM);
                }
            }
        }

        return str.split(';');
    };

    this.checkNormalSkillIsOverrideBySpecificSkillEffect = (skillName, oneMsg, allM, effect) => {
        if (!oneMsg) return false;
        if (!allM) return false;

        let msg = allM.join(',').split(';');

        for (let k in msg) {

            let skillKey = this.getSkillIdFromOneMessage(msg[k]);

            if (skillKey == null) continue;

            let inSkillDefinitionTintExist = this.checkInOverrideSkillDefinitionEffectExist(skillKey, effect);

            if (inSkillDefinitionTintExist) return skillKey
        }

        return false
    };

    this.checkInOverrideSkillDefinitionEffectExist = (skillKey, effect) => {
        let oneSkillData = overrideSkillsDefinitions[skillKey];

        if (!oneSkillData) return false;

        for (let battleEffect in oneSkillData) {
            if (oneSkillData[battleEffect].effect == effect) return true
        }

        return false;
    };

    this.getSkillIdFromOneMessage = (oneMessage) => {
        //let a = oneMessage.match(/skillId\=([0-9]*)\,/g);
        let a = oneMessage.match(/skillId=([0-9]*)/g);
        if (!a) return null;
        if (a.length != 1) {
            errorReport('BattleEffectsController.js', 'checkNormalAttackIsOverride', 'skillId Attr should have only one i one msg! one msg:' + oneMessage, a);
            return null;
        }

        return oneMessage.split(',')[0].replace('=', '-')
    };

    this.manageBattleEffects = (skillName, skillVal, f1, f2, msg, allM, indexM) => {

        if (Engine.battle.getAutoFightWasCallInBattle() || !getAlreadyInitialised() || !Engine.allInit) return;
        if (this.checkIsBlock(skillName, msg, allM, indexM)) return;


        let cloneSkillsDefinitions = this.getCloneSkillDefinition(skillName, skillVal, msg, allM);

        if (cloneSkillsDefinitions == null) return;

        this.manageTargetOfCloneSkillsDefinitions(cloneSkillsDefinitions, f1, f2);
        this.manageImageUrlOfCloneSkillsDefinitions(cloneSkillsDefinitions);
        this.updateData([cloneSkillsDefinitions])
    };

    this.getCloneSkillDefinition = (skillName, skillVal, msg, allM) => {

        if (skillName == 'skillId') {
            let key = 'skillId-' + skillVal;
            if (!skillsDefinitions[key]) return null;

            return copyStructure(skillsDefinitions[key]);
        }

        if (!skillsDefinitions[skillName]) return null;

        let effect = null;
        switch (skillName) {
            case 'normalAttack':
                effect = BFD.effect.TINT;
                break; // TODO: effect should get from skillsDefinitions['normalAttack'] and effect should be array because sometimes effect = [BFD.effect.TINT, BFD.effect.SHAKE]
            case '+crit':
                effect = BFD.effect.SHAKE;
                break; // TODO: effect should get from skillsDefinitions['+crit']        and effect should be array because sometimes effect = [BFD.effect.TINT, BFD.effect.SHAKE]
        }

        let result = this.checkNormalSkillIsOverrideBySpecificSkillEffect(skillName, msg, allM, effect);
        if (result) return copyStructure(this.getOverrideSkillDefinitionByEffect(result, effect));

        return copyStructure(skillsDefinitions[skillName]);
    };

    this.getOverrideSkillDefinitionByEffect = (skillName, effect) => {
        let oneOverrideSkillsDefinitions = overrideSkillsDefinitions[skillName]

        for (let k in oneOverrideSkillsDefinitions) {
            if (oneOverrideSkillsDefinitions[k].effect == effect) return [oneOverrideSkillsDefinitions[k]]
        }

        return null
    };

    this.manageTargetOfCloneSkillsDefinitions = (cloneSkillsDefinitions, f1, f2) => {

        let a = [];

        for (let k in cloneSkillsDefinitions) {

            let oneCloneSkill = cloneSkillsDefinitions[k];

            if (oneCloneSkill.target != BFD.target.CHARACTER) continue;

            let specificTarget = oneCloneSkill.specificTarget;

            if (!specificTarget) {
                console.error('[BattleEffectsController.js, manageTargetOfCloneSkillsDefinitions] ATTR specificTarget not exist!', cloneSkillsDefinitions[k]);
                return
            }

            switch (specificTarget) {
                //case BFD.specificTarget.SKILL_CASTER        : oneCloneSkill.id = f1.id;
                case BFD.specificTarget.SKILL_CASTER:
                    oneCloneSkill.id = f2.id;
                    break;
                case BFD.specificTarget.SKILL_TARGET:
                    oneCloneSkill.id = f2.id;
                    break;
                    //case BFD.specificTarget.SKILL_CASTER_GROUP  : this.changeGroupTargetToSingleTargetArray(oneCloneSkill, a, Engine.battle.getFlist1(), BFD.specificTarget.SKILL_CASTER);
                case BFD.specificTarget.SKILL_CASTER_GROUP:
                    this.changeGroupTargetToSingleTargetArray(oneCloneSkill, a, Engine.battle.getGroupById(f2.id), BFD.specificTarget.SKILL_CASTER);
                    break;
                    //case BFD.specificTarget.SKILL_TARGET_GROUP  : this.changeGroupTargetToSingleTargetArray(oneCloneSkill, a, Engine.battle.getFlist2(), BFD.specificTarget.SKILL_TARGET);
                case BFD.specificTarget.SKILL_TARGET_GROUP:
                    this.changeGroupTargetToSingleTargetArray(oneCloneSkill, a, Engine.battle.getGroupById(f2.id), BFD.specificTarget.SKILL_TARGET);
                    break;
                default:
                    console.error('[BattleEffectsController.js, manageTargetOfCloneSkillsDefinitions] Bad val of specificTarget', oneCloneSkill, specificTarget);
                    return;
            }

        }

        if (!a.length) return;

        for (let i = 0; i < cloneSkillsDefinitions.length; i++) {

            let effect = cloneSkillsDefinitions[i];

            if (effect.target != BFD.target.CHARACTER) continue;

            if (effect.specificTarget == BFD.specificTarget.SKILL_CASTER_GROUP || effect.specificTarget == BFD.specificTarget.SKILL_TARGET_GROUP) {
                cloneSkillsDefinitions.splice(i, 1);
                i--
            }
        }

        for (let i = 0; i < a.length; i++) {
            cloneSkillsDefinitions.push(a[i])
        }
    };

    this.changeGroupTargetToSingleTargetArray = (effectToClone, a, targetArray, specificTarget) => {
        for (let index in targetArray) {

            let cloneEffect = JSON.parse(JSON.stringify(effectToClone));
            cloneEffect.id = targetArray[index].id;
            cloneEffect.specificTarget = specificTarget;

            a.push(cloneEffect);
        }
    };

    this.manageImageUrlOfCloneSkillsDefinitions = (cloneSkillsDefinitions) => {
        for (let k in cloneSkillsDefinitions) {
            if (cloneSkillsDefinitions[k].effect != BFD.effect.ANIMATION) continue;

            if (!cloneSkillsDefinitions[k].params.gifUrl) {
                console.error('[BattleEffectsController.js, manageImageUrlOfCloneSkillsDefinitions] ATTR gifUrl not exist!', cloneSkillsDefinitions[k]);
                return
            }
        }
    };

    this.checkData = (data, name) => {

        let isCorrect = true;

        for (let k in data) {
            let oneEffect = data[k];

            for (let kk in oneEffect) {
                if (kk == 'params') {

                    let result = this.checkParams(oneEffect.params, name);
                    if (!result) isCorrect = false

                } else {

                    let result = this.checkDataParam(oneEffect, kk, name);
                    if (!result) isCorrect = false

                }
            }

        }

        return isCorrect;
    };

    this.checkData2 = (data, name) => {

        if (!data.skillConfig) {
            errorReport('BattleEffectsController.js', 'checkData2', 'skillConfig not exist: SKILL_NAME:' + name);
            return false
        }

        if (!data.block) {
            errorReport('BattleEffectsController.js', 'checkData2', 'block not exist: SKILL_NAME:' + name);
            return false
        }

        let correctSkillConfig = this.checkSkillConfig(data.skillConfig, 'skillConfig');

        if (!data.overrideSkillConfig) {
            let correctOverrideSkillConfig = this.checkSkillConfig(data.overrideSkillConfig, 'overrideSkillConfig');
            return correctSkillConfig && correctOverrideSkillConfig
        } else {
            return correctSkillConfig;
        }
    };

    this.checkSkillConfig = (skillConfig, name, listName) => {
        let isCorrect = true;

        for (let k in skillConfig) {
            let oneEffect = skillConfig[k];

            for (let kk in oneEffect) {
                if (kk == 'params') {

                    let result = this.checkParams(oneEffect.params, name, listName);
                    if (!result) isCorrect = false

                } else {

                    let result = this.checkDataParam(oneEffect, kk, name, listName);
                    if (!result) isCorrect = false

                }
            }

        }

        return isCorrect;
    };

    this.checkParams = (params, name, listName) => {

        let dataEffectsIsNotCorrect = false

        for (let kkk in params) {

            if (!BFD.params[kkk]) {
                errorReport('BattleEffectsController.js', 'checkData', "ListName:" + listName + ". Key in params not exist: " + kkk + ', SKILL_NAME:' + name);
                continue;
            }

            let val = params[kkk];
            let notCorrectVal = false

            switch (kkk) {
                case 'position':
                    if (!BFD.params[kkk][val]) notCorrectVal = true;
                    break;
                case 'duration':
                case 'delay':
                case 'repeat':
                case 'opacity':
                    if (!this.isNumber(val)) notCorrectVal = true;
                    break;
                case 'color':
                    if (!this.isColor(val)) notCorrectVal = true;
                    break;
                case 'url':
                    if (!this.isString(val)) notCorrectVal = true;
                    params['gifUrl'] = val;
                    break;
                case 'gifUrl':
                    if (!this.isString(val)) notCorrectVal = true;
                    break;
                default:
                    errorReport('BattleEffectsController.js', 'checkData', "ListName:" + listName + ". Undefined key in params:" + kkk + ', SKILL_NAME:' + name);
                    break;
            }

            if (notCorrectVal) {
                dataEffectsIsNotCorrect = true;
                errorReport('BattleEffectsController.js', 'checkData', "ListName:" + listName + ". Key in params:" + kkk + " has not correct:" + val + ', SKILL_NAME:' + name);
            }

        }

        if (dataEffectsIsNotCorrect) return false

        return true
    };

    this.checkDataParam = (oneEffect, key, name, listName) => {
        if (!BFD[key]) {
            errorReport('BattleEffectsController.js', 'checkDataParam', "ListName:" + listName + ". Undefined battle data effect key: " + key + ', SKILL_NAME:' + name);
            return false;
        }
        let val = oneEffect[key];


        let stringData = ['soundUrl'];
        if (stringData.includes(key)) {

            if (!this.isString(val)) {
                errorReport('BattleEffectsController.js', 'checkDataParam', "ListName:" + listName + ". Key in params:" + key + " has not correct:" + val + ', SKILL_NAME:' + name);
                return false;
            }

        } else {

            if (!BFD[key][val]) {
                errorReport('BattleEffectsController.js', 'checkDataParam', "ListName:" + listName + ". Val in battle data effect key:" + key + " has not correct:" + val + ', SKILL_NAME:' + name);
                return false;
            }

        }


        return true
    };

    this.isNumber = (val) => {
        return typeof val === "number";
    };

    this.isString = (val) => {
        return typeof val === "string";
    };

    this.isColor = (val) => {
        if (!this.isString(val)) return false;
        if (!val.length) return false;

        let rgb = val.split(',');
        if (rgb.length != 3) return false

        for (let k in rgb) {
            let chanel = parseInt(rgb[k]);
            if (chanel == NaN) return false;
        }

        return true;

    };

    this.parseJSON = (result) => {
        let sd = result.skillDefinitions;
        for (let k in sd) {
            let data;
            try {
                data = JSON.parse(sd[k].data);
            } catch (e) {
                errorReport('BattleEffectsController.js', 'parseJSON', 'incorrect JSON format in BattleEffects!, SKILL_NAME: ' + sd[k].name + ', line: ' + sd[k].data);
            }

            sd[k].data = data;
            let correct = this.checkData2(sd[k].data, sd[k].name);
            if (!correct) delete sd[k];
        }

        for (let k in sd) {
            let rec = sd[k];

            skillsDefinitions[rec.name] = rec.data.skillConfig;

            if (rec.data.overrideSkillConfig) {
                overrideSkillsDefinitions[rec.name] = rec.data.overrideSkillConfig;
            }

            if (Object.keys(rec.data.block).length) {
                block[rec.name] = rec.data.block
            }

        }


        this.onLoadGifs();
        this.prepareBATTLE_EFFECT_DATA();
    };

    this.prepareBATTLE_EFFECT_DATA = () => {
        for (let skillName in skillsDefinitions) {
            let rec = skillsDefinitions[skillName];
            for (let oneEffectIndex in rec) {
                let oneEffect = rec[oneEffectIndex];
                if (oneEffect.soundUrl) {
                    Engine.soundManager.addToBATTLE_EFFECT_DATA(oneEffect.soundUrl, oneEffect.soundUrl);
                    Engine.soundManager.loadToCache(oneEffect.soundUrl, SoundData.TYPE.BATTLE_EFFECT)
                }
            }

        }

    };

    this.onLoadGifs = () => {
        for (let skillName in skillsDefinitions) {
            let rec = skillsDefinitions[skillName];

            for (let k in rec) {
                if (rec[k].effect != BFD.effect.ANIMATION) continue;

                let gifUrl = CFG.r_battleEffectsGif + rec[k].params.gifUrl;
                let gifReaderData = {
                    speed: false,
                    externalSource: cdncrUrl
                };

                Engine.imgLoader.onload(gifUrl, gifReaderData);

            }
        }

    };

    this.initDataFromJSON = () => {

        // if (isEn()) return;

        let sub = location.hostname.split('.')[0];
        if (sub == 'local') sub = 'dev';

        let url = cdnUrl + `/obrazki/skillEffects/${_l()}/${sub}.json`
        $.getJSON(url, (result) => {
            this.parseJSON(result);
        });
    }

};