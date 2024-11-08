module.exports = function() {

    let moduleData = {
        fileName: "NpcGroupsManager.js"
    };
    let freeIdColor = null;
    let groups = null;

    const GROUP_COLORS_ID = [
        '#BA64BF',
        '#0070FF',
        '#FF0000',
        '#FFF900',
        '#AEFA00',
        '#F6F6F3',
        '#48A8FF',
        '#FF80ED',
        '#FF7200',
        '#00EBE1',
        '#000984',
        '#E69138',
        '#CC5B00',
        '#B6D7A8',
        '#FF00E0',
        '#C90076',
        '#D5A6BD',
        '#15C413'
    ];

    const init = () => {
        onClear();
    };

    const resetGroups = () => {
        groups = {};
    };

    const checkNpcHasGroup = (npcData) => {
        return npcData.grp ? true : false;
    };

    const updateData = (action, oneNpc) => {

        if (!checkNpcHasGroup(oneNpc)) {
            return
        }

        switch (action) {
            case "CREATE":
                manageAddToGroup(oneNpc);
                break;
            case "REMOVE":
                manageRemoveFromGroup(oneNpc);
                break;
            default:
                errorReport(moduleData.fileName, "updateData", "action not exist", action);
                return;
        }
    };

    const manageAddToGroup = function(npcData) {
        let grpId = npcData.grp;
        let npcId = npcData.id;

        if (!checkGroupExist(grpId)) {
            createGroup(grpId, freeIdColor);
            increaseFreeIdColor();
        }

        addNpcToGroups(grpId, npcId)
    };

    const checkGroupExist = (grpId) => {
        return groups[grpId] ? true : false
    };

    const createGroup = (grpId, idColor) => {

        groups[grpId] = {
            list: [],
            idColor: idColor
        }
    };

    const removeGroup = (grId) => {
        delete groups[grId];
    };

    const addNpcToGroups = (grId, npcId) => {
        groups[grId].list.push(npcId);
    };

    const manageRemoveFromGroup = function(npcData) {

        let npcId = npcData.id;
        let grpId = npcData.grp;
        let list = groups[grpId].list;

        for (var i = 0; i < list.length; i++) {
            let id = list[i];

            if (id == npcId) {
                list.splice(i, 1);
                break;
            }
        }

        if (list.length == 0) {
            removeGroup(grpId)
        }
    };

    const getColorFromGroup = (grpId) => {
        if (!checkGroupExist(grpId)) {
            return null
        }

        let idColor = groups[grpId].idColor;

        return GROUP_COLORS_ID[idColor];
    };

    const increaseFreeIdColor = () => {
        setFreeIdColor(freeIdColor + 1);
        if (!GROUP_COLORS_ID[freeIdColor]) {
            setFreeIdColor(0);
        }
    };

    const setFreeIdColor = (_freeIdColor) => {
        freeIdColor = _freeIdColor;
    };

    const getGroups = function() {
        return groups;
    };

    const getIdNpcsFromGroup = (idGroup) => {
        let a = [];

        if (!checkGroupExist(idGroup)) {
            return a;
        }

        let list = groups[idGroup].list;

        for (let k in list) {
            a.push(list[k]);
        }

        return a;
    };

    const onClear = () => {
        resetGroups();
        setFreeIdColor(0);
    };

    this.init = init;
    this.getGroups = getGroups;
    this.getIdNpcsFromGroup = getIdNpcsFromGroup;
    this.getColorFromGroup = getColorFromGroup;
    this.updateData = updateData;
    this.onClear = onClear;
};