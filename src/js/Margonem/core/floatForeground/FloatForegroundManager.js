let FloatForeground = require('core/floatForeground/FloatForeground.js');
let RajData = require('core/raj/RajData');
let RajRandomElements = require('core/raj/RajRandomElements');
let RajActionManager = require('core/raj/rajAction/RajActionManager');
let RajActionData = require('core/raj/rajAction/RajActionData');

module.exports = function() {

    let moduleData = {
        fileName: "FloatForegroundManager.js"
    };

    let list = null;
    let rajActionManager = null;

    const init = () => {
        clearList();
        initRajActionsManager();
    };

    const update = (dt) => {
        for (let k in list) {
            list[k].update(dt);
        }
    };

    const initRajActionsManager = () => {
        const TYPE = RajActionData.TYPE;

        rajActionManager = new RajActionManager();
        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                removeFunc: removeAction,
                checkExistFunc: checkObjectExist,
                createRequire: {
                    xVector: {
                        type: TYPE.NUMBER,
                        optional: true
                    },
                    yVector: {
                        type: TYPE.NUMBER,
                        optional: true
                    },
                    color: {
                        type: TYPE.RGB_OR_RGBA_COLOR,
                        optional: true
                    },
                    url: {
                        optional: true
                    }
                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID
        );

    };

    const updateData = (data) => {
        if (data.color) RajRandomElements.manageRandomElementInObjectIfExist(data.color);

        rajActionManager.updateData(data);
    };

    const createAction = (data) => {
        let id = data.id;

        let floatForeground = new FloatForeground();
        floatForeground.init(data);

        addFloatForeground(id, floatForeground);

        //return floatForeground;
    };


    const removeAction = (data) => {
        let id = data.id;

        let floatForeground = getFloatForeground(id);
        let actualAlpha = floatForeground.getActualAlpha();

        floatForeground.clearCanvasFadeIfExist();

        let wraithData = {
            originalObject: floatForeground,
            id: RajData.FLOAT_FOREGROUND + id,
            updateOriginalObject: true,
            startAlpha: actualAlpha
        };
        Engine.wraithObjectManager.createWraithObject(wraithData);

        removeFloatForeground(id)
    }

    const updateDataFloatForegroundFromRayController = (v, additionalData) => {

        if (!rajActionManager.checkCorrectMainData(v, additionalData)) return;

        for (let k in v.list) {

            let data = v.list[k];

            updateData(data);
        }

    };

    const addFloatForeground = (id, floatForeground) => {
        list[id] = floatForeground;
    };

    const removeFloatForeground = (id) => {
        delete list[id];
    };

    const checkObjectExist = (id) => {
        return list[id] ? true : false;
    };

    const onClear = () => {
        clearList();
    };

    const clearList = () => {
        list = {};
    };

    const getDrawableList = () => {
        let a = [];

        for (let k in list) {
            let floatForeground = list[k];
            let f = floatForeground.checkDrawRajObject;

            if (!f || f && f()) {
                a.push(floatForeground);
            }
        }

        return a;
    };

    const getFloatForeground = (id) => {
        return list[id];
    };

    this.init = init;
    this.update = update;
    this.onClear = onClear;
    this.updateData = updateData;
    this.updateDataFloatForegroundFromRayController = updateDataFloatForegroundFromRayController;
    this.getDrawableList = getDrawableList;
};