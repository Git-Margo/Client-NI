const Templates = require('../Templates');
const BuildsData = require('core/builds/BuildsData.js');
const OneBuild = require('core/builds/OneBuild.js');


module.exports = function() {

    const moduleData = {
        fileName: "BuildsWindow.js"
    };

    let wnd = null;
    let content = null;
    let buyBuildList = null;
    //let currentId       = null;

    const init = () => {
        initWindow();
        initAttachHandheldWindow();
        initScrollBar();
        initBuyBuildList();
    };

    const initBuyBuildList = () => {
        buyBuildList = {};
    };

    const initWindow = () => {
        content = Templates.get('builds-window');

        wnd = Engine.windowManager.add({
            content: content,
            nameWindow: Engine.windowsData.name.BUILDS_WINDOW,
            title: _t("builds", null, "builds"),
            managePosition: {
                position: Engine.windowsData.position.CENTER_OR_SAVE_IN_STORAGE
            },

            onclose: () => {
                closePanel();
            }
        });

        content.find('.info-icon').tip(_t('builds_info', null, "builds"));

        closePanel();

        wnd.addToAlertLayer();
        wnd.center();
    };

    const initAttachHandheldWindow = () => {
        content.find('.attach-icon-show-handheld').on('click', function() {
            getEngine().buildsManager.getBuildsHandheldWindow().managePanelVisible();
        })
    }

    const initScrollBar = () => {
        content.find('.scroll-wrapper').addScrollBar({
            track: true
        });
    };

    const createOneBuildToBuy = (data, active) => {
        let $oneBuildToBuy = Templates.get("one-build-to-buy");
        let id = data.id;
        let $buildWrapper = $oneBuildToBuy.find(".build-buttons-wrapper");
        let goldData = roundParser(data.cost.z);
        let goldText = goldData.val + goldData.postfix;
        let slVal = data.cost.s;

        const SL = BuildsData.REQUEST.CURRENCY_S;
        const GOLD = BuildsData.REQUEST.CURRENCY_Z;

        let $buttonGold = createButton(goldText, ['small', 'green', "background-gold"], () => {

            let msg = _t("buy_new_build", {
                "%id%": id,
                "%cost%": goldText
            }, "builds");
            let req = getEngine().buildsManager.getBuildsRequests().buyBuildStr(id, GOLD);

            confirmWithCallbackAcceptCost(msg, req, GOLD, goldText);
        });

        let $buttonSl = createButton(slVal, ['small', 'purple', 'green', "background-draconite"], () => {

            let msg = _t("buy_new_build", {
                "%id%": id,
                "%cost%": slVal
            }, "builds");
            let req = getEngine().buildsManager.getBuildsRequests().buyBuildStr(id, SL);

            confirmWithCallbackAcceptCost(msg, req, SL, slVal);
        });

        if (active) {
            addActiveToOneBuildToBuy($oneBuildToBuy)
        }

        $buildWrapper.append($buttonGold);
        $buildWrapper.append($buttonSl);

        //updateNameBuild($oneBuildToBuy, {name: "Zestaw " + (id)});
        updateNameBuild($oneBuildToBuy, {
            name: _t("one_battle_set", null, "builds") + " " + (id)
        });


        return $oneBuildToBuy;
    };

    const addActiveToOneBuildToBuy = ($oneBuildToBuy) => {
        $oneBuildToBuy.addClass('active');
    };

    const updateCurrentId = () => {

        let currentId = getEngine().buildsManager.getBuildsCommons().getCurrentId();

        if (!getBuildById(currentId)) {
            return
        }

        //if (currentId == _currentID) {
        //    return;
        //}

        //setCurrentId(_currentID);

        clearCurrentIdInBuilds();

        let currentBuildData = getBuildById(currentId);
        let $currentBuild = currentBuildData.get$build();

        $currentBuild.addClass("active")
    };

    //const setCurrentId = (_currentID) => {
    //    currentId = _currentID;
    //};

    const clearCurrentIdInBuilds = () => {
        let all$builds = getEngine().buildsManager.getBuildsCommons().getAll$builds();

        for (let index in all$builds) {
            all$builds[index].removeClass("active")
        }
    };

    const updateBuyNewBuild = (data) => {
        let id = data.id;
        let $buyBuild = getBuyBuilById(id);
        let $nextBuyBuild = getBuyBuilById(id + 1);

        if ($nextBuyBuild) {
            addActiveToOneBuildToBuy($nextBuyBuild);
        }

        removeOneBuildToBuyFromBuyBuildList(id);
        $buyBuild.remove();


        updateOneBuild(data);
    };

    const updateOneBuild = (data) => {

        let oneBuild = null;
        let $oneBuild = null;
        let id = data.id;
        let buildsCommons = getEngine().buildsManager.getBuildsCommons();
        let exist = buildsCommons.checkBuildExist(id);

        if (exist) {
            oneBuild = getBuildById(id);
            $oneBuild = oneBuild.get$build();
        } else {
            oneBuild = new OneBuild();
            oneBuild.init(data, true);
            $oneBuild = oneBuild.get$build();

            buildsCommons.addOneBuildToBuildList(id, oneBuild);
        }

        oneBuild.update(data);

        if (exist) {
            return;
        }

        if (isWrapperEmpty()) addOneBuildToWrapper($oneBuild);
        else addOneBuildAfterLastBoughtBuild($oneBuild);
    };

    const updateOneBuildToBuy = (data, active) => {
        let id = data.id;

        if (getBuyBuilById(id)) {
            return
        }

        let $oneBuildToBuy = createOneBuildToBuy(data, active);

        addOneBuildToBuyToBuyBuildList(id, $oneBuildToBuy);
        addOneBuildToBuyToWrapper($oneBuildToBuy);
    };

    const isWrapperEmpty = () => {
        return content.find('.scroll-pane').children().length == 0;
    };

    const updateNameBuild = ($oneBuild, data) => {
        $oneBuild.find(".build-name").html(data.name);
    };

    const removeItem = (id, $itemsWrapper) => {
        $itemsWrapper.find(`.item-id-${id}`).remove();
        Engine.items.deleteViewIconIfExist(id, Engine.itemsViewData.BUILDS_VIEW);
    };

    const updateSkillsLeftBuild = ($oneBuild, data) => {
        $oneBuild.find(".build-skills-left").html(data.skillsLearnt + "/" + data.skillsTotal).tip(_t("skills_status", null, "builds"));
    };

    const updateIconBuild = ($oneBuild, data) => {
        $oneBuild.find(".build-icon").attr("icon-id", data.iconId);
    };

    const managePanelVisible = function() {
        getWindowShow() ? closePanel() : openPanel();
    };

    const getWindowShow = () => {
        return wnd.isShow();
    };

    const openPanel = () => {
        if (getEngine().hero.getLvl() < 25) {
            message(_t('too_low_lvl'));
            return
        }

        if (getEngine().matchmaking.getEqChooseOpen()) {
            message(_t('window_not_available_now'));
            return
        }

        wnd.show();
        wnd.setWndOnPeak();
        getEngine().interfaceItems.setDisableSlots('builds');
        updateScroll();
    };

    const closePanel = () => {
        getEngine().interfaceItems.setEnableSlots('builds');
        wnd.hide();
    };

    const updateScroll = () => {
        $('.scroll-wrapper', wnd.$).trigger('update');
    };

    const addOneBuildToBuyToBuyBuildList = (id, $oneBuildToBuy) => {
        buyBuildList[id] = $oneBuildToBuy;
    };

    const removeOneBuildToBuyFromBuyBuildList = (id) => {
        delete buyBuildList[id];
    };

    const addOneBuildToWrapper = ($oneBuild) => {
        content.find('.scroll-pane').append($oneBuild)
    };

    const addOneBuildAfterLastBoughtBuild = ($oneBuild) => {
        $oneBuild.insertAfter(content.find('.scroll-pane').find(".one-build").last())
    };

    const addOneBuildToBuyToWrapper = ($oneBuildToBuy) => {
        content.find('.scroll-pane').append($oneBuildToBuy)
    };

    const getBuildById = (id) => {
        //return buildList[id];
        return getEngine().buildsManager.getBuildsCommons().getBuildById(id);
    };

    const getBuyBuilById = (id) => {
        return buyBuildList[id];
    };

    //const getCurrentId = () => {
    //    return currentId;
    //};

    //const getCurrentName = () => {
    //    let currentId = getEngine().buildsManager.getBuildsCommons().getCurrentId();
    //
    //    let oneBuild = getBuilById(currentId);
    //
    //    if (!oneBuild) {
    //        return null
    //    }
    //
    //    return oneBuild.getName();
    //};

    this.init = init;
    this.updateOneBuild = updateOneBuild;
    this.updateOneBuildToBuy = updateOneBuildToBuy;
    this.updateBuyNewBuild = updateBuyNewBuild;
    this.updateCurrentId = updateCurrentId;
    this.updateScroll = updateScroll;
    this.managePanelVisible = managePanelVisible;
    this.closePanel = closePanel;
    this.getWindowShow = getWindowShow;
    //this.getCurrentId                   = getCurrentId;
    //this.getCurrentName                 = getCurrentName;

};