var RajData = require('@core/raj/RajData');
let RajRandomElements = require('@core/raj/RajRandomElements');
let RajActionData = require('@core/raj/rajAction/RajActionData');
let RajActionManager = require('@core/raj/rajAction/RajActionManager');
let RajGetSpecificData = require('@core/raj/RajGetSpecificData');
let RajWindow = require('@core/raj/rajWindow/RajWindow');

module.exports = function() {

    let moduleData = {
        fileName: "RajWindowManager.js"
    };
    let windowList = {};
    let rajActionManager = null;

    const init = () => {
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        const TYPE = RajActionData.TYPE;
        const BUTTON_CONTAINER = "BUTTON_CONTAINER";
        const BUTTON = "BUTTON";
        const TEXT = "TEXT";
        const IMAGE = "IMAGE";

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createWindowAction,
                removeFunc: removeWindowAction,
                checkExistFunc: checkWindowListExist,
                createRequire: {
                    header: true,
                    overlay: {
                        optional: true
                    },
                    list: {
                        type: TYPE.ARRAY,
                        elementInArray: {
                            position: {
                                optional: true,
                                type: TYPE.OBJECT,
                                elementInObject: {
                                    htmlTarget: {
                                        optional: true
                                    },
                                    target: {
                                        optional: true
                                    }
                                }
                            },

                            name: {
                                conditionVal: {
                                    [BUTTON_CONTAINER]: {},
                                    [BUTTON]: {},
                                    [TEXT]: {},
                                    [IMAGE]: {}
                                }
                            }
                        }
                    }
                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID
        );
    };

    const updateData = (data, additionalData) => {
        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;

        for (let i in data.list) {
            let oneData = data.list[i];

            updateOneDataByAction(oneData, additionalData);
        }
    };

    const updateOneDataByAction = (oneData, additionalData) => {
        rajActionManager.updateData(oneData, additionalData);
    }

    const checkWindowListExist = (id) => {
        return windowList[id] ? true : false
    };

    const createWindowAction = (data, additionalData) => {
        createWindow(data, additionalData)
    };

    const removeWindowAction = (data, additionalData) => {
        removeWindow(data.id);
    };

    const createWindow = (data, additionalData) => {
        let rajWindow = new RajWindow();
        let id = data.id;

        addToWindowList(id, rajWindow);
        rajWindow.init();
        rajWindow.updateData(data, additionalData);
    };

    const removeWindow = (id) => {
        if (!checkWindowListExist(id)) {
            return;
        }

        let rajWindow = getWindow(id);

        rajWindow.remove();

        removeFromWindowList(id);
    };

    const addToWindowList = (id, rajWindow) => {
        windowList[id] = rajWindow;
    };

    const removeFromWindowList = (id) => {
        if (!checkWindowListExist(id)) {
            return;
        }

        delete windowList[id];
    };

    const getWindow = (id) => {
        if (!checkWindowListExist(id)) {
            return null;
        }

        return windowList[id];
    }

    const onClear = () => {
        for (let id in windowList) {
            removeWindow(id)
        }
    }

    this.init = init;
    this.updateData = updateData;
    this.removeWindow = removeWindow;
    this.onClear = onClear;
    this.checkWindowListExist = checkWindowListExist;

}