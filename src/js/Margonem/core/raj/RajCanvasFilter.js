let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');
let RajActionManager = require('@core/raj/rajAction/RajActionManager');
let RajActionData = require('@core/raj/rajAction/RajActionData');

module.exports = function() {

    const moduleData = {
        fileName: "RajCameraTarget.js"
    };

    let filter = 'none';

    let rajActionManager = null;

    const init = () => {
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                clearFunc: clearAction,
                createRequire: {
                    filter: {}
                }
            },
            RajActionData.GROUP_NAME.OVERRIDE_OBJECT
        );
    };

    const updateData = (data, additionalData) => {
        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;

        rajActionManager.updateData(data, additionalData)
    }

    const createAction = (data) => {
        clear();


        setFilter(data.filter);

        Engine.canvasFilter.setFilter(filter);
        Engine.canvasFilter.refreshObjects()
    };

    const setFilter = (_filter) => {
        filter = _filter
    }

    const clear = () => {
        Engine.imgLoader.clearFilters();
        Engine.canvasFilter.setFilter('none');
    }

    const clearAction = () => {
        clear();
        Engine.canvasFilter.refreshObjects()
    };

    const onClear = () => {
        clear();
    };

    this.init = init;
    this.onClear = onClear;
    this.updateData = updateData;

}