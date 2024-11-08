const RajData = require('core/raj/RajData');
const RajRandomData = require('core/raj/rajRandom/RajRandomData.js');
const RajActionManager = require('core/raj/rajAction/RajActionManager');
const RajActionData = require('core/raj/rajAction/RajActionData');


module.exports = function() {

    const moduleData = {
        fileName: "RajTemplate.js"
    };
    let template = null;
    let rajActionManager = null;

    const init = () => {
        //resetTemplate();
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        rajActionManager.init(
            moduleData.fileName,
            null,
            RajActionData.GROUP_NAME.DEFINITIONS_OBJECT
        );
    };

    const resetTemplate = () => {
        template = {};
    };

    const addTemplate = (id, data) => {
        template[id] = data;
    };

    const checkTemplateExist = (id) => {
        return template[id] ? true : false;
    }

    const createTemplates = (allTemplatesData) => {
        for (let id in allTemplatesData) {
            addTemplate(id, allTemplatesData[id]);
        }
    };

    const fillDataFromTemplate = (data) => {
        for (let k in data) {

            if (elementIsObject(data[k])) {
                fillDataFromTemplate(data[k]);
                continue;
            }

            if (elementIsArray(data[k])) {
                let a = data[k];
                for (let kk in a) {
                    fillDataFromTemplate(a[kk]);
                }
                continue;
            }

        }

        if (!isset(data.getTpl)) return;

        parseGetTpl(data);
    };

    const parseGetTpl = (data) => {

        let tplAndTplVarsData = getTplAndTplVarsData(data.getTpl, data.tplVars);

        delete data.getTpl;
        if (data.tplVars) delete data.tplVars;

        let tplIdArray = tplAndTplVarsData.tplIdArray;
        let tplVarsArray = tplAndTplVarsData.tplVarsArray;

        for (let i = 0; i < tplIdArray.length; i++) {


            let tplId = tplIdArray[i];
            let tplVars = tplVarsArray[i];

            if (elementIsObject(tplId)) { // todo getTplName by getTplVar
                debugger;
                continue;
            }

            if (!checkTemplateExist(tplId)) {
                errorReport('CharacterEffectsManager.js', 'fillDataFromTemplate', `tplId ${tplId} not exist!`, data)
                return;
            }

            let newData = getMergeTemplateWithData(tplId, data, tplVars);

            for (let k in newData) {
                data[k] = newData[k];
            }

            replaceDataFromGetTpl(tplId, data, tplVars);
        }

    };

    const getTplAndTplVarsData = (tplIdData, tplVarsData) => {
        let tplIdArray = null;
        let tplVarsArray = [];

        if (elementIsArray(tplIdData)) {

            tplIdArray = tplIdData;

            for (let i = 0; i < tplIdArray.length; i++) {
                let element = null;
                if (tplVarsData && isset(tplVarsData[i])) element = tplVarsData[i];
                else element = {};
                tplVarsArray.push(element);
            }

            return {
                tplIdArray,
                tplVarsArray
            }
        }

        tplIdArray = [tplIdData];

        let element = tplVarsData ? tplVarsData : {};
        tplVarsArray.push(element);

        return {
            tplIdArray,
            tplVarsArray
        }
    };

    const replaceDataFromGetTpl = (tplId, data, tplVars) => {
        let newData = getMergeTemplateWithData(tplId, data, tplVars);

        for (let k in newData) {
            data[k] = newData[k];
        }
    }

    const getCloneCharacterEffectTemplate = (id) => {
        return copyStructure(template[id]);
    }

    const getMergeTemplateWithData = (id, data, tplVars) => {
        let tpl = getCloneCharacterEffectTemplate(id);

        if (!tpl) {
            errorReport('RajController', 'getMergeTemplateWithData', "tpl not exist", id)
            return
        }

        fillDataFromTemplate(tpl);

        if (tplVars) {
            getTplVarParseJson(tpl, tplVars)
        }

        return deepMergeData(tpl, data)
    };

    const getTplVarParseJson = (data, tplVars) => {
        for (let k in data) {

            let oneData = data[k];

            if (elementIsObject(oneData)) {

                if (oneData.getTplVar) data[k] = getTplVar(oneData.getTplVar, tplVars, oneData.modify);
                else getTplVarParseJson(data[k], tplVars);

                continue;
            }

            if (elementIsArray(data[k])) {
                let a = data[k];

                for (let k in a) {
                    getTplVarParseJson(a[k], tplVars);
                }

                continue;
            }

        }

        if (!isset(data.getTplVar)) return;

        // #39750  test task START

        let newData = getTplVar(data.getTplVar, tplVars, data.modify);

        if (!lengthObject(newData)) return;

        delete data.getTplVar
        if (data.modify) delete data.modify

        for (let kk in newData) {
            data[kk] = newData[kk];
        }

        // #39750  test task END

    };

    const checkCorrectModify = (modify) => {
        const FUNC = "checkCorrectModify";

        if (!isset(modify.kind)) {
            errorReport(moduleData.fileName, FUNC, "modify have to kind attr! possible val of kind is MATH_ADD or STR_ADD", modify);
            return false
        }

        if (!isset(modify.v)) {
            errorReport(moduleData.fileName, FUNC, "modify have to v attr!", modify);
            return false
        }

        if (!['STR_ADD', 'MATH_ADD'].includes(modify.kind)) {
            errorReport(moduleData.fileName, FUNC, "possible val of kind is MATH_ADD or STR_ADD!", modify);
            return false
        }

        return true;
    }

    const getTplVar = (keyName, tplVars, modify) => {
        if (!isset(tplVars[keyName])) {
            errorReport(moduleData.fileName, "getTplVar", `getTplVar ${keyName} not exist!`, [keyName, tplVars, modify]);
            return null;
        }

        if (tplVars[keyName] == null) {
            debugger;
            return {};
        }

        let vVar = tplVars[keyName];

        if (modify) {

            if (!checkCorrectModify(modify)) return vVar;

            let vModify = modify.v;

            if (elementIsObject(vVar)) {

                //console.log('crazy modify', keyName, tplVars, modify)

                vVar = copyStructure(vVar);
                let copyModify = copyStructure(modify);

                vVar.modify = {};

                for (let k in copyModify) {
                    vVar.modify[k] = copyModify[k];
                }

            } else {
                switch (modify.kind) {
                    case "STR_ADD":
                        vVar = vVar + vModify;
                        break;
                    case "MATH_ADD":
                        vVar = vVar + vModify;
                        break
                }
            }



        }

        return vVar;
    }

    const getReplaceDataGetTplFullReplaceJson = (allData) => {
        resetTemplate();

        let allTemplates = allData[RajData.TEMPLATE];

        if (!rajActionManager.checkCorrectMainData(allTemplates)) {
            return allData;
        }

        createTemplates(allData[RajData.TEMPLATE]);

        for (let k in template) {
            fillDataFromTemplate(template[k]);
        }

        let newAllData = copyStructure(allData);

        delete newAllData[RajData.TEMPLATE];

        fillDataFromTemplate(newAllData);


        return newAllData;
    }

    this.getReplaceDataGetTplFullReplaceJson = getReplaceDataGetTplFullReplaceJson;
    //this.resetTemplate = resetTemplate;
    this.init = init;

};