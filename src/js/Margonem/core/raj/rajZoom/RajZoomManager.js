var RajZoomData = require('core/raj/rajZoom/RajZoomData');
let RajActionManager = require('core/raj/rajAction/RajActionManager');
let RajActionData = require('core/raj/rajAction/RajActionData');

module.exports = function() {

    let moduleData = {
        fileName: "RajZoomManager.js"
    };
    let zoomTimeout = null;
    let zoomObject = null;
    let rajActionManager = null;

    const init = () => {
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        const TYPE = RajActionData.TYPE;

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createZoomAction,
                clearFunc: removeZoomAction,
                createRequire: {
                    zoom: {
                        type: TYPE.NUMBER,
                        optional: true
                    },
                    speed: {
                        type: TYPE.NUMBER,
                        optional: true
                    },
                    duration: {
                        type: TYPE.NUMBER,
                        optional: true
                    }
                }
            },
            RajActionData.GROUP_NAME.OVERRIDE_OBJECT
        );
    };

    const updateData = (v, additionalData) => {
        if (!rajActionManager.checkCorrectMainData(v, additionalData)) return;
        //switch (v.action) {
        //    case "CREATE": createZoomAction(v);break;
        //    case "REMOVE": removeZoomAction(v);
        //        break;
        //    default :
        //        errorReport();
        //
        //}
        rajActionManager.updateData(v);
    };

    const createZoomTimeout = (duration) => {
        zoomTimeout = setTimeout(function() {
            clearZoomObject();
            clearZoomTimeout();
        }, duration)
    };

    const clearZoomTimeout = () => {
        clearTimeout(zoomTimeout)
        zoomTimeout = null;
    }

    const checkTimeout = () => {
        return zoomTimeout ? true : false;
    }

    const createZoomAction = (v) => {
        //if (checkZoomObject()) {
        //    return
        //}

        //if (!Engine.rajCase.checkFullFillCase(v.case)) return;

        setZoomObject(createZoomObject(v));
        manageZoomTimeout();

        callZoom();
    };

    const callZoom = () => {
        Engine.zoomManager.setZoom(zoomObject.zoom);
        Engine.zoomManager.setSpeed(zoomObject.speed);
    }

    const manageZoomTimeout = () => {
        if (zoomObject.duration == true) return

        createZoomTimeout(zoomObject.duration * 1000);
    }

    const checkZoomObject = () => {
        return zoomObject ? true : false;
    }

    const createZoomObject = (v) => {
        let defaultData = RajZoomData.defaultData;

        let _zoomObject = {
            zoom: defaultData.ZOOM,
            speed: defaultData.SPEED,
            duration: defaultData.DURATION
        };

        if (isset(v.zoom)) _zoomObject.zoom = v.zoom;
        if (isset(v.speed)) _zoomObject.speed = v.speed;
        if (isset(v.duration)) _zoomObject.duration = v.duration;

        return _zoomObject;
    }

    const removeZoomAction = (v) => {
        if (!checkZoomObject()) return;

        //if (!Engine.rajCase.checkFullFillCase(v.case)) return;

        clearZoomObject();
        if (!checkTimeout()) return

        clearZoomTimeout();
    };

    const setZoomObject = (_zoomObject) => {
        zoomObject = _zoomObject
    };

    const clearZoomObject = () => {
        setZoomObject(null);

        Engine.zoomManager.clearZoom();
    };

    const onClear = () => {
        clearZoomObject();

        if (!checkTimeout()) return

        clearZoomTimeout();
    }


    this.init = init;
    this.updateData = updateData;
    this.onClear = onClear;
}