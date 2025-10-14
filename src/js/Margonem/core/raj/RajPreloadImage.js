let RajActionManager = require('@core/raj/rajAction/RajActionManager');
let RajActionData = require('@core/raj/rajAction/RajActionData');

module.exports = function() {

    let moduleData = {
        fileName: "RajPreloadImage.js"
    };

    let OTHERS_PATH = "OTHERS_PATH";
    let NPC_PATH = "NPC_PATH";
    let RAJ_PATH = "RAJ_PATH";

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
                    url: true,
                    kind: {
                        specificVal: [OTHERS_PATH, NPC_PATH, RAJ_PATH],
                        optional: true
                    },
                    fast: {
                        type: TYPE.BOOL,
                        optional: true
                    }
                }
            },
            RajActionData.GROUP_NAME.OVERRIDE_OBJECT_WITH_LIST
        );
    };

    const updateData = (v) => {
        if (!rajActionManager.checkCorrectMainData(v)) {
            return;
        }

        for (let k in v.list) {
            let data = v.list[k];
            rajActionManager.updateData(data);
        }

    };

    const createAction = (data) => {
        let path = getPath(data);
        let fullUrl = getUrl(data, path);
        let gif = false;
        let fast = isset(data.fast) ? data.fast : false;

        if (data.gif) {
            gif = {
                fast: fast,
                externalSource: cdnUrl
            }
        }

        Engine.imgLoader.onload(fullUrl, gif, false, false, false);
    };

    const clearAction = () => {

    };

    const getUrl = (data, path) => {

        let type = data.type;
        let url = data.url;

        if (!isset(data.type)) {
            return path + url;
        }

        switch (type) {
            case OTHERS_PATH:
                return path + fixSrc(url);
            case NPC_PATH:
                return path + fixSrc(url);
            case RAJ_PATH:
                return path + url;
            default:
                errorReport(moduleData.fillName);
                return path + url;
        }

    };

    const getPath = (data) => {

        if (!isset(data.type)) {
            return getRajAbloluteOrShortPath(data);
        }

        let path;

        switch (data.type) {
            case OTHERS_PATH:
                path = CFG.r_opath;
                break;
            case NPC_PATH:
                path = CFG.r_npath;
                break;
            case RAJ_PATH:
                path = getRajAbloluteOrShortPath(data)
                break;
            default:
                errorReport(moduleData.fillName);
                path = getRajAbloluteOrShortPath(data)
        }


        return path;
    };

    const getRajAbloluteOrShortPath = (data) => {
        return data.gif ? CFG.r_rajGraphics : CFG.a_rajGraphics;
    }

    this.init = init;
    this.updateData = updateData;

};