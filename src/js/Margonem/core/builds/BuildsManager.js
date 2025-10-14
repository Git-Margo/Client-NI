const BuildsData = require('@core/builds/BuildsData.js');
const BuildsWindow = require('@core/builds/BuildsWindow.js');
const BuildsHandheldWindow = require('@core/builds/BuildsHandheldWindow.js');
const BuildsCommons = require('@core/builds/BuildsCommons.js');
const BuildsInterface = require('@core/builds/BuildsInterface.js');
const BuildsRequests = require('@core/builds/BuildsRequests.js');

module.exports = function() {

    const moduleData = {
        fileName: "BuildsManager.js"
    };

    let buildsList = null;
    let toBuyList = null;

    let buildsWindow = null;
    let buildsHandheldWindow = null;
    let buildsInterface = null;
    let buildsRequests = null;
    let buildsCommons = null;


    const init = () => {
        initObjects();
    };

    const initBuildsWindow = () => {
        buildsWindow = new BuildsWindow();
        buildsWindow.init();
    };

    const initBuildsHandheldWindow = () => {
        buildsHandheldWindow = new BuildsHandheldWindow();
        buildsHandheldWindow.init();
    };

    const initBuildsCommons = () => {
        buildsCommons = new BuildsCommons();
        buildsCommons.init(Engine.itemsFetchData.NEW_BUILD_ITEM);
        buildsCommons.initItemsFetch();
    };

    const initBuildsInterface = () => {
        buildsInterface = new BuildsInterface();
        buildsInterface.init();
    };

    const initBuildsRequests = () => {
        buildsRequests = new BuildsRequests();
        buildsRequests.init();
    };

    const initObjects = () => {
        buildsList = {};
        toBuyList = {};

        initBuildsRequests();
        initBuildsCommons();
        initBuildsWindow();
        initBuildsHandheldWindow();
        initBuildsInterface();
    };

    const updateData = (data) => {

        if (!checkDataCorrect(data)) {
            return
        }

        const action = data.action;
        const ACTION = BuildsData.ACTION;

        switch (action) {
            case ACTION.INIT:
                initAction(data);
                break;
            case ACTION.UPDATE_DATA:
                updateDataAction(data);
                break;
            case ACTION.BUY_BUILD:
                buyBuildAction(data);
                break;
            case ACTION.UPDATE_CURRENT_ID:
                updateCurrentId(data);
                break;
        }


    };

    const checkDataCorrect = (data) => {
        const FUNC = "checkDataCorrect"

        if (!elementIsObject(data)) {
            errorReport(moduleData.fileName, FUNC, "data have to be object!", data);
            return false;
        }

        if (!data.action) {
            errorReport(moduleData.fileName, FUNC, "action attr not exist!!", data);
            return false
        }


        return true
    };

    const initAction = (data) => {
        let list = data.list
        let listToBuy = data.listToBuy;

        if (list) {
            for (let k in list) {
                buildsWindow.updateOneBuild(list[k]);
                buildsHandheldWindow.updateOneBuild(list[k]);
            }

            //buildsInterface.updateList(list);
        }

        if (listToBuy) {
            for (let i = 0; i < listToBuy.length; i++) {
                let active = i == 0;
                buildsWindow.updateOneBuildToBuy(listToBuy[i], active);
            }
        }

        updateCurrentId(data);

        buildsWindow.updateScroll();
    };

    const updateDataAction = (data) => {
        let list = data.list;

        if (list) {
            for (let k in list) {
                buildsWindow.updateOneBuild(list[k]);
                buildsHandheldWindow.updateOneBuild(list[k]);
            }

            //buildsInterface.updateList(list);
        }

        updateCurrentId(data);

        buildsWindow.updateScroll();
        //buildsHandheldWindow.updateScroll();
    };

    const updateCurrentId = (data) => {
        let currentId = data.currentId;

        if (isset(currentId)) {

            if (currentId == buildsCommons.getCurrentId()) {
                return
            }

            buildsCommons.setCurrentId(currentId)

            buildsWindow.updateCurrentId()
            buildsHandheldWindow.updateCurrentId()
            buildsInterface.updateCurrentId();


            if (getEngine().matchmaking.getEqChooseOpen()) {
                getEngine().matchmaking.setActiveBuild(currentId);
            }

            getEngine().hotKeys.replaceshowBuildWindowTipNames();

        }
    }

    const buyBuildAction = (data) => {
        let list = data.list;

        if (list) {
            for (let k in list) {
                buildsWindow.updateBuyNewBuild(list[k]);
                buildsHandheldWindow.updateOneBuild(list[k]);
            }

            //buildsInterface.updateList(list);
        }

        updateCurrentId(data);

        buildsWindow.updateScroll();
    };

    const getBuildsWindow = () => {
        return buildsWindow;
    }

    const getBuildsHandheldWindow = () => {
        return buildsHandheldWindow;
    }

    const getBuildsRequests = () => {
        return buildsRequests;
    }

    const getBuildsCommons = () => {
        return buildsCommons;
    }

    const manageBuildsHotkeys = (key) => {
        //if (!buildsWindow.checkBuildExist(key)) {
        if (!buildsCommons.checkBuildExist(key)) {
            message(_t('build_not_exist', null, "builds"));
            return;
        }

        buildsRequests.setCurrentBuildId(parseInt(key));
        buildsWindow.closePanel();
    };

    const changeDefaultNameIfExist = (name) => {
        let result = name.match(new RegExp('\\[SET.([0-9])\\]'));
        let val;

        if (result) val = _t("one_battle_set", null, "builds") + " " + result[1];
        else val = name;

        return val;
    }

    this.init = init;
    this.updateData = updateData;
    this.getBuildsWindow = getBuildsWindow;
    this.getBuildsHandheldWindow = getBuildsHandheldWindow;
    this.getBuildsRequests = getBuildsRequests;
    this.getBuildsCommons = getBuildsCommons;
    this.manageBuildsHotkeys = manageBuildsHotkeys;
    this.changeDefaultNameIfExist = changeDefaultNameIfExist;

};