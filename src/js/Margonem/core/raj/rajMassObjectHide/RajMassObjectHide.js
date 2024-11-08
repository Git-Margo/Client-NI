let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let RajActionManager = require('core/raj/rajAction/RajActionManager');
let RajActionData = require('core/raj/rajAction/RajActionData');

module.exports = function() {

    const moduleData = {
        fileName: 'RajObjectHide.js'
    }

    let massObjectsHide = null;

    let rajActionManager = null;

    const init = () => {
        initRajActionManager();
        clearMassObjectsHide();
    }

    const clearMassObjectsHide = () => {
        massObjectsHide = {};

        clearOther();
        clearNpc();
    }

    const clearOther = () => {
        massObjectsHide[CanvasObjectTypeData.OTHER] = null;
    }

    const clearNpc = () => {
        massObjectsHide[CanvasObjectTypeData.NPC] = null;
    }

    const onClear = () => {
        clearMassObjectsHide();
    }

    const initRajActionManager = () => {
        rajActionManager = new RajActionManager();

        const TYPE = RajActionData.TYPE;
        const NPC = CanvasObjectTypeData.NPC
        const OTHER = CanvasObjectTypeData.OTHER

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                removeFunc: removeAction,
                createRequire: {
                    name: {
                        specificVal: [OTHER, NPC]
                    }
                },
                removeRequire: {
                    name: {
                        specificVal: [OTHER, NPC]
                    }
                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_NAME
        );
    }

    const updateData = (data, additionalData) => {

        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;

        let list = data.list;

        for (let k in list) {
            rajActionManager.updateData(list[k]);
        }
    }

    const createAction = (data, additionalData) => {
        let name = data.name;
        addMassObjectHide(name);
    }

    const removeAction = (data, additionalData) => {
        let name = data.name;
        removeMassObjectHide(name);
    }

    const checkCorrectName = (name) => {
        return isset(massObjectsHide[name]);
    }

    const addMassObjectHide = (name) => {
        if (!checkCorrectName(name)) {
            errorReport(moduleData.fileName, "addObjectHide", "Undefined name", name);
            return;
        }

        massObjectsHide[name] = {};
    }

    const removeMassObjectHide = (name) => {
        if (!checkCorrectName(name)) {
            errorReport(moduleData.fileName, "removeObjectHide", "Undefined name", name);
            return;
        }

        massObjectsHide[name] = null;
    }

    const checkMassObjectsHide = (canvasObject) => {
        let name = canvasObject.canvasObjectType;

        if (!name) {
            errorReport(moduleData.fileName, "checkMassObjectsHide", "name not exist", name);
            return;
        }

        if (!checkCorrectName(name)) {
            // errorReport(moduleData.fileName, "checkMassObjectsHide", "Undefined name", name);
            return;
        }

        return massObjectsHide[name] ? true : false;
    }

    const checkShowTip = (character) => {
        let kind = character.canvasObjectType;

        if (!kind) return true;

        switch (kind) {
            case CanvasObjectTypeData.NPC:
                return !checkMassObjectsHide(character);
            case CanvasObjectTypeData.OTHER:
                return !checkMassObjectsHide(character);
        }

        return true;
    }

    this.init = init;
    this.updateData = updateData;
    this.onClear = onClear;
    this.checkMassObjectsHide = checkMassObjectsHide;
    this.checkShowTip = checkShowTip;
}