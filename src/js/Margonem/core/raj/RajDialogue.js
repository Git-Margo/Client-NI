const RajGetSpecificData = require('@core/raj/RajGetSpecificData');
const RajActionManager = require('@core/raj/rajAction/RajActionManager');
const RajActionData = require('@core/raj/rajAction/RajActionData');

module.exports = function() {

    const moduleData = {
        fileName: "RajDialogue.js"
    };
    let dialogName = null;
    let rajActionManager = null;

    const init = () => {
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        const TYPE = RajActionData.TYPE;

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                clearFunc: clearAction,
                createRequire: {
                    header: {
                        type: TYPE.OBJECT,
                        elementInObject: {
                            text: {}
                        }
                    }
                }
            },
            RajActionData.GROUP_NAME.OVERRIDE_OBJECT
        );
    };

    const updateData = (data, additionalData) => {
        //if (!checkCorrectData(data)) return;

        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;

        //for (let k in data.list) {
        //    let oneData     = data.list[k];
        //    let action      = oneData.action;
        //
        //    if (action == "UPDATE") updateOneData(data.list[k]);
        //}
        //if (!Engine.rajCase.checkFullFillCase(data.case)) return;

        rajActionManager.updateData(data);
    };

    const createAction = (oneData) => {

        //if (!Engine.rajCase.checkFullFillCase(oneData.case)) return;

        onClear();
        updateHeader(oneData.header);
    };

    const clearAction = () => {
        onClear();
        manageDialogHeaderText();
    }

    const updateHeader = (header) => {
        let name;
        if (header.text) name = RajGetSpecificData.getCharacterData(header.text);
        else name = null;


        //if (header.clear)   name = null;
        //else                name = RajGetSpecificData.getCharacterData(header.text);

        setDialogName(name);
        manageDialogHeaderText();
    };

    const manageDialogHeaderText = () => {
        if (!Engine) return;
        if (!Engine.dialogue) return;

        Engine.dialogue.manageDialogHeaderText();
    };

    const getDialogName = () => {
        return dialogName;
    };

    const setDialogName = (_dialogName) => {
        dialogName = _dialogName;
    };

    //const checkCorrectData = (data) => {
    //    const FUNC = "checkCorrectData";
    //
    //    if (!elementIsObject(data)) {
    //        errorReport(moduleData.fileName, FUNC, "object camera have to object!", data);
    //        return false;
    //    }
    //
    //    //if (!isset(data.list)) {
    //    //    errorReport(moduleData.fileName, "checkCorrectData", "object dialogue have to list attr!", data);
    //    //    return false;
    //    //}
    //
    //    //let list = data.list;
    //
    //    //if (!elementIsArray(list)) {
    //    //    errorReport(moduleData.fileName, FUNC, "attr list have to array!", data);
    //    //    return false;
    //    //}
    //
    //
    //    if (data.clear) return true;
    //
    //    if (!data.header) {
    //        errorReport(moduleData.fileName, FUNC, "nothing section update in RajDialogue!", oneData);
    //        return false
    //    }
    //
    //    let header = data.header;
    //
    //    if (header) if (!checkHeader(header)) return false;
    //
    //    //for (let k in list) {
    //    //    let oneData = list[k];
    //    //    if (!checkOneData(oneData)) return false
    //    //}
    //
    //    return true;
    //};

    //const checkOneData = (oneData) => {
    //
    //    if (!isset(oneData.action)) {
    //        errorReport(moduleData.fileName, "checkOneData", "oneData on list of RajDialogue have to action attr!", oneData);
    //        return false;
    //    }
    //
    //    if (oneData.action != "UPDATE") {
    //        errorReport(moduleData.fileName, "checkOneData", "on this moment action on list of RajDialogue, can be only UPDATE val!", oneData);
    //        return false;
    //    }
    //
    //    if (!oneData.header) {
    //        errorReport(moduleData.fileName, "checkOneData", "nothing section update in RajDialogue!", oneData);
    //        return false
    //    }
    //
    //    let header = oneData.header;
    //
    //    if (header) if (!checkHeader(header)) return false;
    //
    //
    //    return true;
    //};

    //const checkHeader = (header, oneData) => {
    //    const FUNC = "checkHeader";
    //
    //    if (!elementIsObject(header)) {
    //        errorReport(moduleData.fileName, FUNC, "attr header on list of RajDialogue have to object!", oneData);
    //        return false
    //    }
    //
    //    //if (isset(header.clear)) return true;
    //
    //    if (!header.text) {
    //        errorReport(moduleData.fileName, FUNC, "attr text on list of RajDialogue not exist!", oneData);
    //        return false
    //    }
    //
    //    return true;
    //};

    const onClear = () => {
        setDialogName(null);
    };

    this.init = init;
    this.getDialogName = getDialogName;
    this.onClear = onClear;
    this.updateData = updateData;
}