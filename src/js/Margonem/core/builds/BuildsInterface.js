module.exports = function() {

    const moduleData = {
        fileName: "BuildsInterface.js"
    };

    //let buildsData      = null;
    let buildsActive = false;

    const init = () => {
        //initBuildsData();
        initClick();
        initContextMenu();
    };

    const setBuildsActive = (state) => {
        buildsActive = state;
    };

    //const initBuildsData = () => {
    //    buildsData = {};
    //};

    const initClick = () => {
        let $buildsInterface = getEngine().interface.get$buildsInterface();

        $buildsInterface.on(getClickEventName(), function() {
            Engine.buildsManager.getBuildsWindow().managePanelVisible();
        })
    };

    const initContextMenu = () => {
        let $buildsInterface = getEngine().interface.get$buildsInterface();

        $buildsInterface.on('contextmenu', function(e, mE) {
            //let buildsWindow    = Engine.buildsManager.getBuildsWindow();
            //let currentId       = buildsWindow.getCurrentId();
            let buildsCommons = getEngine().buildsManager.getBuildsCommons();
            let currentId = buildsCommons.getCurrentId();
            let buildsName = buildsCommons.getBuildsName();
            let menu = [];

            if (!lengthObject(buildsName)) {
                console.log('object empty!');
                return
            }


            for (let id in buildsName) {
                if (id == currentId) {
                    continue;
                }

                let menuElement = createMenuElement(buildsName[id], id);
                menu.push(menuElement);
            }

            Engine.interface.showPopupMenu(menu, getE(e, mE), {
                onMap: true
            });
        })
    };

    const createMenuElement = (oneBuildData, id) => {
        let name = getEngine().buildsManager.changeDefaultNameIfExist(oneBuildData.name);

        return [(parseInt(id)) + ". " + name, function() {
            getEngine().buildsManager.getBuildsRequests().setCurrentBuildId(id);
        }];
    };

    /*
    const updateList = (list) => {
        for (let k in list) {

            let e               = list[k];
            let id              = e.id;
            let oneBuildData    = getBuilById(id);

            if (!oneBuildData) {
                oneBuildData = {
                    name: null,
                    icon: null
                };
                //buildsData[id] = oneBuildData
                addBuildData(id, oneBuildData)
            }

            if (e.name) oneBuildData.name = e.name;
            if (e.icon) oneBuildData.icon = e.icon;
        }
    };
        */

    const updateCurrentId = () => {

        if (!buildsActive) {
            setBuildsActive(true);
            //showBuildsInterface();
        }

        setCurrentIdInHtmlElement();
    };

    const setCurrentIdInHtmlElement = () => {
        let buildsCommons = getEngine().buildsManager.getBuildsCommons();
        let currentId = buildsCommons.getCurrentId();

        let oneBuildData = getBuildById(currentId);
        let $buildsInterface = getEngine().interface.get$buildsInterface();
        let chooseBuild = parseInt(currentId);
        let currentName = buildsCommons.getCurrentName();
        let name = getEngine().buildsManager.changeDefaultNameIfExist(currentName);

        if (!oneBuildData) {
            errorReport(moduleData.fileName, "updateCurrentId", "buildData not exist", currentId);
            return;
        }

        $buildsInterface.find('.choose-build').html(chooseBuild);
        $buildsInterface.tip(_t("choose_build", {
            '%id%': name
        }, "builds"));
    };

    //const showBuildsInterface = () => {
    //    let $buildsInterface = getEngine().interface.get$buildsInterface();
    //
    //    $buildsInterface.css('display', "block");
    //};

    const getBuildById = (id) => {
        return getEngine().buildsManager.getBuildsCommons().getBuildById(id);
        //return buildsData[id];
    };

    //const addBuildData = (id, oneBuildData) => {
    //    return buildsData[id] = oneBuildData ;
    //};



    this.init = init;
    //this.updateList         = updateList;
    this.updateCurrentId = updateCurrentId;
};