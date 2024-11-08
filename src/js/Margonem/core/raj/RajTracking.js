let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let RajActionManager = require('core/raj/rajAction/RajActionManager');
let RajActionData = require('core/raj/rajAction/RajActionData');


module.exports = function() {

    const moduleData = {
        fileName: "RajTracking.js"
    };
    const SRAJ_TRACKING_ARROW = "SRAJ_TRACKING_ARROW";
    let rajActionManager = null;

    let trackingData = {
        data: null,
        parentObject: null,
        targets: {}
    };

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
                    parent: {
                        optional: true,
                        type: {
                            name: TYPE.TARGET,
                            option: [CanvasObjectTypeData.FLOAT_OBJECT, CanvasObjectTypeData.FAKE_NPC, CanvasObjectTypeData.PET]
                        }
                    },
                    target: {
                        optional: true,
                        elementInObject: {
                            list: {
                                type: TYPE.ARRAY,
                                elementInArray: {
                                    id: {},
                                    name: {},
                                    x: {
                                        type: TYPE.INT
                                    },
                                    y: {
                                        type: TYPE.INT
                                    }
                                }
                            }
                        }
                    }
                }
            },
            RajActionData.GROUP_NAME.OVERRIDE_OBJECT
        );
    };

    const checkUpdate = () => {
        return trackingData.data != null;
    };

    const createTarget = (data, id) => {
        return {
            name: data.name,
            id: id,
            x: data.x,
            y: data.y
        }
    };

    const getParent = () => {
        if (trackingData.parentObject == null) return null;

        return trackingData.parentObject;

    };

    const checkParent = () => {
        return trackingData.parentObject == null ? false : true;
    };

    const resetTrackingData = () => {
        setTrackingData(null, null);

        for (let k in trackingData.targets) {
            let id = trackingData.targets[k].id;

            Engine.targets.deleteArrow(SRAJ_TRACKING_ARROW + id);
            delete trackingData[id];
        }
    };

    const updateData = (data, additionalData) => {

        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;
        //if (!checkCorrectData(data)) return;

        //if (!Engine.rajCase.checkFullFillCase(data.case)) return;

        //clear();

        //if (isset(data.clear)) return;

        //prepareData(data);

        rajActionManager.updateData(data, additionalData);
    };

    const createAction = (data, additionalData) => {
        if (!checkParentCorrect(data)) {
            return;
        }

        clear();

        prepareData(data, additionalData);
    };

    const clearAction = () => {
        clear();
    };

    const clear = () => {
        resetTrackingData();
    };

    const prepareData = (data) => {
        manageDataParent(data);
        manageDataTarget(data)
    };

    const manageDataParent = (data) => {
        if (!data.parent) return;

        switch (data.parent.kind) {
            case CanvasObjectTypeData.FAKE_NPC:
                setTrackingData(data, Engine.fakeNpcs.getById(data.parent.id));
                break;
            case CanvasObjectTypeData.PET:
                setTrackingData(data, Engine.hero.getPet());
                break;
            case CanvasObjectTypeData.FLOAT_OBJECT:
                setTrackingData(data, Engine.floatObjectManager.getById(data.parent.id));
                break;
        }
    };

    const manageDataTarget = (data) => {
        if (!data.target) return;

        let dataTargetList = data.target.list;

        for (let k in dataTargetList) {

            let oneTargetListData = dataTargetList[k];

            if (!Engine.rajCase.checkFullFillCase(oneTargetListData.case)) continue;

            let freeId = getFreeIdOfObject(trackingData.targets);
            let oneTarget = createTarget(oneTargetListData, freeId);

            createArrow(oneTarget);
            addToTargets(oneTarget);
        }
    };

    const addToTargets = (oneTarget) => {
        trackingData.targets[oneTarget.id] = oneTarget;
    };

    const createArrow = (oneTarget) => {

        const id = SRAJ_TRACKING_ARROW + oneTarget.id;

        getEngine().targets.addArrow(id, oneTarget.name, oneTarget, SRAJ_TRACKING_ARROW);

    };

    const setTrackingData = (data, parentObject) => {
        trackingData.data = data;
        trackingData.parentObject = parentObject;
    };

    //const checkCorrectData = (data) => {
    //    if (!elementIsObject(data)) {
    //        errorReport(moduleData.fileName, "checkCorrectData", "object tracking have to object!", data);
    //        return false;
    //    }
    //
    //    if (isset(data.clear)) return true;
    //
    //    if (isset(data.parent)) {
    //        if (!elementIsObject(data.parent)) {
    //            errorReport(moduleData.fileName, "checkCorrectData", "attr tracking.parent have to object!", data);
    //            return false;
    //        }
    //
    //        if (!checkParentCorrect(data)) return false;
    //
    //    }
    //
    //    return true;
    //};

    const checkParentCorrect = (data) => {
        let parent = data.parent;
        let kind = parent.kind;
        const FUNC = "checkParent";

        switch (kind) {
            case CanvasObjectTypeData.FAKE_NPC:
                if (!isset(parent.id)) {
                    errorReport(moduleData.fileName, FUNC, "parent.kind:FAKE_NPC have to parent.id attr!", data);
                    return false;
                }
                if (!Engine.fakeNpcs.getById(parent.id)) {
                    errorReport(moduleData.fileName, FUNC, "parent.kind:FAKE_NPC fakeNpc not exist!", data);
                    return false;
                }
                break;
            case CanvasObjectTypeData.PET:
                if (!Engine.hero.getPet()) {
                    errorReport(moduleData.fileName, FUNC, "parent.kind:PET Hero not use pet now!", data);
                    return false;
                }
                break;
            case CanvasObjectTypeData.FLOAT_OBJECT:
                if (!Engine.floatObjectManager.getById(data.parent.id)) {
                    errorReport(moduleData.fileName, FUNC, "parent.kind:FLOAT_OBJECT floatObject not exist!", data);
                    return false;
                }
                break;

            default:
                errorReport(moduleData.fileName, FUNC, "undefined parent.kind!", data);
                return false;
        }


        return true;
    };

    const onClear = () => {
        clear();
    };

    this.init = init;
    //this.update         = update;
    //this.updateData     = updateData;
    this.updateData = updateData;
    this.getParent = getParent;
    this.checkParent = checkParent;
    this.onClear = onClear;

}