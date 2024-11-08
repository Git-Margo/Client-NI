module.exports = function() {

    let moduleData = {
        fileName: "NpcTplManager.js"
    };
    let npcTplList = null;

    const init = () => {
        npcTplList = {};
    };

    const updateData = (data) => {
        //console.log(data, moduleData.fileName)

        for (let i = 0; i < data.length; i++) {

            let oneTplData = data[i];
            let tplId = oneTplData.id;

            if (checkNpcTpl(tplId)) {
                //errorReport(moduleData.fileName, "updateData", `npc tpl ${tplId} already exist!`, npcTplList);
                //continue
                removeNpcTpl(tplId);
            }

            parseData(oneTplData)

            addNpcTpl(tplId, oneTplData);
        }
    };

    const checkNpcTpl = (tplId) => {
        return npcTplList[tplId] ? true : false;
    };

    const addNpcTpl = (id, data) => {
        npcTplList[id] = data;

        //if (!isset(data.nick)) data.nick = "";
        //if (!isset(data.type)) data.type = 0;
        //
        //if (!isset(data.warrior_type)) data.wt = 0;
        //else {
        //    data.wt = data.warrior_type;
        //    delete data.warrior_type;
        //}
        //
        //if (isset(data.externalProperties )) {
        //    data.external_properties = data.externalProperties;
        //    delete data.externalProperties;
        //}
        //
        //if (!isset(data.actions)) data.actions = 0;
        ////if (!isset(data.prof)) data.prof = 0;
        //if (!isset(data.grp)) data.grp = 0;
        //
        //if (!isset(data.level)) data.lvl = 0;
        //else {
        //    data.lvl = data.level;
        //    delete data.level;
        //}
        //if (!isset(data.elasticLevelFactor)) data.elasticLevelFactor = 0;
        //if (!isset(data.dialog_radius)) data.dialog_radius = 0;

    };

    const parseData = (data) => {
        if (!isset(data.nick)) data.nick = "";
        if (!isset(data.type)) data.type = 0;

        if (!isset(data.warrior_type)) data.wt = 0;
        else {
            data.wt = data.warrior_type;
            delete data.warrior_type;
        }

        //if (isset(data.externalProperties )) {
        //    data.external_properties = data.externalProperties;
        //    delete data.externalProperties;
        //}

        if (!isset(data.actions)) data.actions = 0;
        //if (!isset(data.prof)) data.prof = 0;
        if (!isset(data.group)) {
            data.grp = 0;
        } else {
            data.grp = data.group;
            delete data.group;
        }

        if (!isset(data.level)) data.lvl = 0;
        else {
            data.lvl = data.level;
            delete data.level;
        }
    }

    const removeNpcTpl = (id) => {
        delete npcTplList[id]
    };

    const onClear = () => {
        npcTplList = {};
    };

    const getNpcTpl = (id) => {
        return npcTplList[id];
    };

    const getCloneNpcTpl = (id) => {
        return copyStructure(npcTplList[id]);
    };

    this.init = init;
    this.updateData = updateData;
    this.checkNpcTpl = checkNpcTpl;
    this.getNpcTpl = getNpcTpl;
    this.getCloneNpcTpl = getCloneNpcTpl;
    this.onClear = onClear;

};