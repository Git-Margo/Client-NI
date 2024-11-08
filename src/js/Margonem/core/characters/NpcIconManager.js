module.exports = function() {

    let moduleData = {
        fileName: "NpcIconManager.js"
    };
    let npcIconList = null;

    const init = () => {
        npcIconList = {};
    };

    const updateData = (data) => {
        //console.log(data, moduleData.fileName)

        for (let i = 0; i < data.length; i++) {

            let oneIconData = data[i];
            let iconId = oneIconData.id;

            if (checkNpcIcon(iconId)) {
                //errorReport(moduleData.fileName, "updateData", `icon id ${iconId} already exist!`, npcIconList);
                //continue
                removeNpcIcon(iconId);
            }

            addNpcIcon(iconId, oneIconData);
        }
    };

    const checkNpcIcon = (tplId) => {
        return npcIconList[tplId] ? true : false;
    };

    const addNpcIcon = (id, data) => {
        npcIconList[id] = data;
    };

    const removeNpcIcon = (id) => {
        delete npcIconList[id]
    };

    const getNpcIcon = (id) => {
        if (!npcIconList[id]) return null;

        return npcIconList[id].icon;
    };

    const onClear = () => {
        npcIconList = {};
    };

    this.init = init;
    this.updateData = updateData;
    this.checkNpcIcon = checkNpcIcon;
    this.getNpcIcon = getNpcIcon;
    this.onClear = onClear;

};