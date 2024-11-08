const Templates = require('../Templates');

module.exports = function() {

    let id;
    let name;
    let icon;
    let items;
    let itemsIds;
    let skillsLearnt;
    let skillsTotal;
    let $build;

    let fullOptions = null;

    const init = (data, fullOptions) => {
        createBuild(data, fullOptions);
        setItemsByBuildId([0, 0, 0, 0, 0, 0, 0, 0]);
    };

    const setFullOptions = (state) => {
        fullOptions = state;
    };

    const createBuild = (data, _fullOptions) => {
        $build = Templates.get("one-build");
        id = data.id;

        setFullOptions(_fullOptions);

        $build.find(".build-index").html(parseInt(id));

        if (fullOptions) {
            let $buildName = $build.find(".build-name");

            $buildName.on('contextmenu', function(e, mE) {
                //clickEditName(e)
                clickEditName(getE(e, mE))
            });

            //$buildName.tip(_t("change_build_name_tip", null, "builds"));
        }

        $build.on('click', function() {
            clickBuild();
        });
    };

    const update = (data) => {
        if (isset(data.name)) updateNameBuild(data);
        if (isset(data.iconId)) updateIconBuild(data);
        if (isset(data.items)) updateItemsBuild(data);
        if (isset(data.skillsLearnt) && isset(data.skillsTotal)) updateSkillsLeftBuild(data);
    };

    const updateNameBuild = (data) => {
        name = data.name;

        let $buildName = $build.find(".build-name");

        let fullName = getEngine().buildsManager.changeDefaultNameIfExist(name);

        $buildName.html(fullName + " [" + id + "]");

        if (fullOptions) {
            $buildName.tip(_t("info_and_change_build_name_tip", {
                "%name%": fullName,
                "%id%": id
            }, "builds"));
        }
    };

    const updateIconBuild = (data) => {
        icon = data.iconId;
        $build.find(".build-icon").attr("icon-id", icon);
    };

    const updateItemsBuild = (data) => {
        let newItems = data.items;

        setItemsByBuildId(newItems);
    };

    const setItemsByBuildId = (newItemsArray) => {
        items = newItemsArray;
        itemsIds = {};

        for (let st in newItemsArray) {

            let newItemId = newItemsArray[st];

            if (newItemId != 0) {
                itemsIds[newItemId] = st;
            }
        }
    };

    const updateSkillsLeftBuild = (data) => {
        skillsLearnt = data.skillsLearnt;
        skillsTotal = data.skillsTotal;

        $build.find(".build-skills-left").html(skillsLearnt + "/" + skillsTotal).tip(_t("skills_status", null, "builds"));
    };

    const get$build = () => {
        return $build;
    };

    const getItemsIds = () => {
        return itemsIds;
    };

    const clickBuild = () => {
        getEngine().buildsManager.getBuildsRequests().setCurrentBuildId(id);
    };

    const clickEditName = (e) => {

        let menu = [];

        menu.push([_t('change_build_name', null, "builds"), function() {
            confirmWitchTextInput(_t('give_new_build_name', null, "builds"), (val) => {
                getEngine().buildsManager.getBuildsRequests().setNameInBuild(esc(val), id)
            }, 15);
        }]);

        Engine.interface.showPopupMenu(menu, e, true)
    };

    const getName = () => {
        return name;
    }

    const getData = () => {
        return {
            id: id,
            name: name,
            iconId: icon,
            items: items,
            skillsLearnt: skillsLearnt,
            skillsTotal: skillsTotal
        }
    };


    this.init = init;
    this.update = update;
    this.get$build = get$build;
    this.getItemsIds = getItemsIds;
    this.getData = getData;
    this.getName = getName;
};