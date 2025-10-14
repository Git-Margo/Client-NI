module.exports = function() {

    let buildList = null;
    let itemsFetchData = null;
    let currentId = null;


    const init = (_itemsFetchData) => {
        clearBuilds();

        itemsFetchData = _itemsFetchData
    }

    const setCurrentId = (_currentID) => {
        currentId = _currentID;
    };

    const clearBuilds = () => {
        buildList = {};
    }

    const initItemsFetch = () => {
        Engine.items.fetch(itemsFetchData, newBuildItem);
    }

    const clearItemsFetch = () => {
        Engine.items.removeCallback(itemsFetchData)
    }

    const newBuildItem = (i, finish) => {
        let itemId = i.id;
        let buildsWithItems = getItemByIdInBuilds(itemId);

        if (!buildsWithItems) {
            return
        }

        for (let buildId in buildsWithItems) {

            let st = buildsWithItems[buildId];
            let buildData = getBuildById(buildId);
            let $oneBuild = buildData.get$build();
            let $itemsWrapper = $oneBuild.find(".build-items-wrapper");

            createItem(itemId, st, $itemsWrapper)
        }

    };

    const createItem = (id, st, $itemsWrapper) => {
        let item = getEngine().items.getItemById(id);
        let iconData = Engine.items.createViewIcon(id, Engine.itemsViewData.BUILDS_VIEW);

        if (!iconData || !item) {
            console.log('none');
            return
        }

        let $icon = iconData[0];
        //$icon.attr("data-st", parseInt(st) + 1);

        $icon.contextmenu(function(e, mE) {
            item.createOptionMenu(getE(e, mE), false, {
                canPreview: true,
                use: true,
                move: true,
                destroy: true,
                drop: true,
                moveToEnhancement: true,
                bonus_not_selected: true
            });
        });

        //$itemsWrapper.append($icon);
        let selector = '[data-st="' + (parseInt(st) + 1) + '"]';

        $itemsWrapper.find(selector).append($icon);
    };

    const getItemByIdInBuilds = (idItem) => {
        let obj = {};

        for (let idBuild in buildList) {

            let st = buildList[idBuild].getItemsIds()[idItem];

            if (isset(st)) {
                obj[idBuild] = st;
            }
        }

        return lengthObject(obj) ? obj : null;
    };

    const getBuildById = (id) => {
        return buildList[id];
    };

    const checkBuildExist = (id) => {
        return buildList[id] ? true : false;
    };

    const addOneBuildToBuildList = (id, oneBuild) => {
        buildList[id] = oneBuild;
    };

    const getCrazyDataToMatchmaking = () => {
        let data = {}
        for (let id in buildList) {
            data[id] = buildList[id].getData();
        }

        return data
    }

    const getAll$builds = () => {
        let a = [];
        for (let id in buildList) {
            let build = getBuildById(id);
            a.push(build.get$build());
            //$build.removeClass("active")
        }

        return a;
    }

    const getCurrentId = () => {
        return currentId;
    };

    const getCurrentName = () => {
        let oneBuild = getBuildById(currentId);

        if (!oneBuild) {
            return null
        }

        return oneBuild.getName();
    };

    const getBuildsName = () => {
        let o = {};

        for (let id in buildList) {
            o[id] = {
                name: buildList[id].getName()
            }
        }

        return o;
    };


    this.init = init;
    this.initItemsFetch = initItemsFetch;
    this.clearItemsFetch = clearItemsFetch;
    this.clearBuilds = clearBuilds;
    this.getCurrentId = getCurrentId;
    this.setCurrentId = setCurrentId;
    this.getCurrentName = getCurrentName;

    this.getItemByIdInBuilds = getItemByIdInBuilds;
    this.getBuildById = getBuildById;
    this.getBuildsName = getBuildsName;
    this.checkBuildExist = checkBuildExist;
    this.getAll$builds = getAll$builds;
    this.addOneBuildToBuildList = addOneBuildToBuildList;
    this.getCrazyDataToMatchmaking = getCrazyDataToMatchmaking;

}