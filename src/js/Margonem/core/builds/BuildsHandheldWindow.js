const Templates = require('../Templates');
const OneBuildHandheld = require('@core/builds/OneBuildHandheld.js');

module.exports = function() {

    let content;
    let wnd;
    let buildsList = {};

    const init = () => {
        initWindow();
    }

    const initWindow = () => {
        content = Templates.get('builds-handheld-window');

        wnd = Engine.windowManager.add({
            content: content,
            title: _t("builds", null, "builds"),
            nameWindow: Engine.windowsData.name.BUILDS_HANDHELD_WINDOW,
            type: Engine.windowsData.type.TRANSPARENT,
            manageShow: false,
            manageOpacity: 3,
            managePosition: {
                x: '0',
                y: '58'
            },
            addClass: 'transparent-builds-handheld-window',
            onclose: () => {
                managePanelVisible();
            }
        });
        wnd.addToAlertLayer();
    };

    const updateOneBuild = (data) => {
        let oneBuild = null;
        let $oneBuild = null;
        let id = data.id;
        let buildsCommons = getEngine().buildsManager.getBuildsCommons();
        //let exist           = buildsCommons.checkBuildExist(id);
        let exist = buildsList[id];

        if (exist) {
            oneBuild = buildsList[id];
            $oneBuild = buildsList[id].get$build();
        } else {
            oneBuild = new OneBuildHandheld();
            oneBuild.init(data);
            $oneBuild = oneBuild.get$build();

            buildsList[id] = oneBuild
        }

        oneBuild.update(data);

        if (exist) {
            return;
        }

        addOneBuildToWrapper($oneBuild);
    }

    const addOneBuildToWrapper = ($oneBuild) => {
        content.find('.builds-list').append($oneBuild)
    };

    const managePanelVisible = function() {
        getWindowShow() ? closePanel() : openPanel();
    };

    const getWindowShow = () => {
        return wnd.isShow();
    };

    const openPanel = () => {
        if (getHeroLevel() < 25) {
            message(_t('too_low_lvl'));
            return
        }

        wnd.show();
        wnd.setWndOnPeak();
    };

    const closePanel = () => {
        wnd.hide();
    };

    const updateCurrentId = () => {

        let currentId = getEngine().buildsManager.getBuildsCommons().getCurrentId();

        if (!getEngine().buildsManager.getBuildsCommons().getBuildById(currentId)) {
            return
        }

        clearCurrentIdInBuilds();

        let currentBuildData = buildsList[currentId];
        let $currentBuild = currentBuildData.get$build();

        $currentBuild.addClass("active")
    };

    const clearCurrentIdInBuilds = () => {

        for (let index in buildsList) {
            buildsList[index].get$build().removeClass("active")
        }
    };

    this.updateCurrentId = updateCurrentId;
    this.updateOneBuild = updateOneBuild;
    this.managePanelVisible = managePanelVisible;
    this.openPanel = openPanel;
    this.init = init;


}