module.exports = function() {

    let moduleData = {
        fileName: "RajEmoDefinitions.js"
    }
    let definitionList = {};

    const init = () => {

    };

    const updateData = (definitionsData) => {
        let list = definitionsData.list;
        for (let k in list) {
            let oneData = list[k];

            if (!isEmoDefinitionCorrect(oneData)) continue;

            let name = oneData.name;
            let params = oneData.params;
            let priority = oneData.priority;

            addDefinition(name, params, priority);
        }
    };

    const addDefinition = (name, params, priority) => {
        if (checkDefinition(name)) {
            //warningReport(moduleData.fileName, "addDefinition", "name allready exist!", name);
            return
        }
        definitionList[name] = {
            action: params.action,
            filename: params.filename,
            priority: priority
        };

        //if (params.offset) definitionList[name].offset = params.offset

        if (params.offsetX || params.offsetY) {
            definitionList[name].offset = [
                params.offsetX ? params.offsetX : 0,
                params.offsetY ? params.offsetY : 0,
            ]
        }

    };

    const isEmoDefinitionCorrect = (oneData) => {

        if (!elementIsObject(oneData)) {
            errorReport(moduleData.fileName, "isDataCorrect", `emoDefinitions have to object!  e.g. {"name":"NPC_SL_SHOP","priority":65,"params":{"action":"OnSelf","filename":"battle.gif"}}`, oneData);
            return false;
        }

        if (!isset(oneData.name)) {
            errorReport(moduleData.fileName, "isDataCorrect", `emoDefinitions have to have name attr!`, oneData);
            return false;
        }

        if (!isset(oneData.priority)) {
            errorReport(moduleData.fileName, "isDataCorrect", `emoDefinitions have to have priority attr!`, oneData);
            return false;
        }

        if (!isset(oneData.params)) {
            errorReport(moduleData.fileName, "isDataCorrect", `emoDefinitions have to have params attr!`, oneData);
            return false;
        }

        if (!elementIsObject(oneData.params)) {
            errorReport(moduleData.fileName, "isDataCorrect", "params attr have to be object!", oneData);
            return false;
        }

        if (!isset(oneData.params.action)) {
            errorReport(moduleData.fileName, "isDefinitionCorrect", "data.params.action not exist in emoDefinition!", oneData);
            return false;
        } else {
            let action = ['OnSelf', "StickToMap"];
            if (!action.includes(oneData.params.action)) {
                errorReport(moduleData.fileName, "isDefinitionCorrect", "data.params.action can be CREATE or REMOVE value only!", oneData);
                return false;
            }
        }

        if (!isset(oneData.params.filename)) {
            errorReport(moduleData.fileName, "isDefinitionCorrect", "data.params.filename not exist in emoDefinition!", oneData);
            return false;
        }

        if (!isInt(oneData.priority)) {
            errorReport(moduleData.fileName, "isDataCorrect", `priority attr have to integet!`, oneData);
            return false;
        }

        return true;
    };

    const checkDefinition = (name) => {
        return definitionList[name] ? true : false;
    };

    const onClear = () => {
        definitionList = {};
    };

    const getDefinition = (name) => {
        if (!checkDefinition(name)) return null;

        return definitionList[name];
    };

    const getPriority = (name) => {
        if (!checkDefinition(name)) return null;

        return definitionList[name].priority;
    }

    const getFilename = (name) => {
        if (!checkDefinition(name)) return null;

        return definitionList[name].filename;
    }

    const getArrayOfDefinitionsName = () => {
        let a = [];

        for (let name in definitionList) {
            a.push(name);
        }

        return a;
    }

    this.init = init;
    this.updateData = updateData;
    this.getDefinition = getDefinition;
    this.getPriority = getPriority;
    this.getFilename = getFilename;
    this.getArrayOfDefinitionsName = getArrayOfDefinitionsName;
    this.onClear = onClear;


};