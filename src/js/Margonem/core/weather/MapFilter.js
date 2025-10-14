//let RajRandomElements       = require('@core/raj/RajRandomElements');
let RajActionData = require('@core/raj/rajAction/RajActionData');
let RajActionManager = require('@core/raj/rajAction/RajActionManager');

module.exports = function() {

    let moduleData = {
        fileName: "MapFilter.js"
    };
    let rajActionManager;

    const init = () => {
        initRajActionsManager();
    };

    const initRajActionsManager = () => {

        const TYPE = RajActionData.TYPE;

        rajActionManager = new RajActionManager();

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                clearFunc: clearAction,
                createRequire: {
                    color: {
                        type: TYPE.RGBA_COLOR
                    }
                }
            },
            RajActionData.GROUP_NAME.OVERRIDE_OBJECT
        );
    };

    const updateData = (data, additionalData) => {
        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;

        //RajRandomElements.manageRandomElementInObjectIfExist(data);

        rajActionManager.updateData(data);
    };

    const clearAction = () => {
        let $bck = $('.filter-map-weather');
        $bck.css('display', 'none');
    };

    const createAction = (data) => {
        let $bck = $('.filter-map-weather');
        $bck.css('display', 'block');
        $bck.css('background', `rgba(${data.color.r},${data.color.g},${data.color.b},${data.color.a})`);
    };

    const onClear = () => {
        clearAction();
    };

    this.init = init;
    this.updateData = updateData;
    this.onClear = onClear;

}