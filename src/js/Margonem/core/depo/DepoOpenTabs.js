const DepoData = require('@core/depo/DepoData');

module.exports = function() {


    const moduleData = {
        fileName: "DepoOpenTabs.js"
    };

    //const MAX_OPEN_TAB_ID 		= 2;
    //const OPEN_TAB_AMOUNT 		= 8;


    //let openTabId 				= null;
    let loadedItemsTab = null;
    let beforeFirstUpdate = true;
    let currentTabRange = null;

    const init = () => {
        initLoadedItemsTab();
    };

    const setBeforeFirstUpdate = (v) => {
        beforeFirstUpdate = v;
    };

    const getBeforeFirstUpdate = () => {
        return beforeFirstUpdate;
    };

    const getTabToShow = (v) => {
        let openTabId = v.id;

        return openTabId * DepoData.OPEN_TAB_AMOUNT - DepoData.OPEN_TAB_AMOUNT;
    };

    const initLoadedItemsTab = () => {

        let depoLastAvailableCardIndex = DepoData.MAX_OPEN_TAB_ID * DepoData.OPEN_TAB_AMOUNT;

        loadedItemsTab = [];

        for (let i = 0; i < depoLastAvailableCardIndex; i++) {
            loadedItemsTab[i] = false;
        }
    };



    //const correctPosMoveFromEqToDepo = (x, y) => {
    //
    //    console.log('BUG?')
    //
    //    let v   = Math.floor(x / DepoData.ITEM_IN_GRID);
    //
    //    x       = x - (DepoData.ITEM_IN_GRID * v);
    //    y       = y + DepoData.ITEM_IN_COLUMN * v;
    //
    //    return {
    //        x,
    //        y
    //    }
    //};

    const correctPosToSetItemInDepo = (x, y) => {

        let v = Math.floor(y / DepoData.ITEM_IN_COLUMN);

        x = x + v * DepoData.MAX_X_IN_OPEN_TAB;
        y = y - v * DepoData.OPEN_TAB_AMOUNT;

        return {
            x,
            y
        }
    };

    const correctPosMoveItemsInDepo = (x, y) => {

        let v = Math.floor(x / DepoData.MAX_X_IN_OPEN_TAB);
        x = x - v * DepoData.MAX_X_IN_OPEN_TAB;
        y = y + v * DepoData.OPEN_TAB_AMOUNT;

        return {
            x,
            y
        }
    };


    //const setOpenTabId = (_openTabId) => {
    //    openTabId = _openTabId;
    //};

    const updateData = (v) => {

        let openTabId = v.id;
        let startIndex = (openTabId - 1) * DepoData.OPEN_TAB_AMOUNT;
        let endIndex = startIndex + DepoData.OPEN_TAB_AMOUNT;
        currentTabRange = [startIndex, endIndex];

        for (let loadedItemsTabIndex = startIndex; loadedItemsTabIndex < endIndex; loadedItemsTabIndex++) {
            setLoadedItemsTab(loadedItemsTabIndex);
        }

        setBeforeFirstUpdate(false);
    };

    const setLoadedItemsTab = (loadedItemsTabIndex) => {

        if (!isset(loadedItemsTab[loadedItemsTabIndex])) {
            errorReport(moduleData.fileName, "setLoadedItemsTab", "loadedItemsIndex not exist", loadedItemsTabIndex)
            return
        }

        loadedItemsTab[loadedItemsTabIndex] = true;
    };

    const getLoadedItemsTab = (itemsTabIndex) => {
        if (!isset(loadedItemsTab[itemsTabIndex])) {
            errorReport(moduleData.fileName, "setLoadedItemsTab", "itemsTabIndex not exist", loadedItemsTab, itemsTabIndex)
            return null;
        }

        return loadedItemsTab[itemsTabIndex];
    }

    const sendRequestToLoadItem = (tabIndex) => {
        if (!isInt(tabIndex)) {
            errorReport(moduleData.fileName, "sendRequestToLoadItem", "incorrect tabIndex", tabIndex);
            return
        }

        if (tabIndex < 0 || tabIndex > DepoData.MAX_OPEN_TAB_ID * DepoData.OPEN_TAB_AMOUNT - 1) {
            errorReport(moduleData.fileName, "sendRequestToLoadItem", "incorrect tabIndex", tabIndex);
            return
        }

        let id = Math.floor(tabIndex / DepoData.OPEN_TAB_AMOUNT) + 1;

        _g('depo&opentab=' + id);
    }


    const getSlotsDataToFindFirstFreeSlot = (place) => {

        const ITEM_IN_ROW = DepoData.ITEM_IN_ROW;
        const ITEM_IN_COLUMN = DepoData.ITEM_IN_COLUMN;
        const MAX_X_IN_OPEN_TAB = DepoData.MAX_X_IN_OPEN_TAB;

        let xEnd = (place + 1) * ITEM_IN_ROW;
        let xStart = xEnd - ITEM_IN_ROW;

        let v = Math.floor(xStart / MAX_X_IN_OPEN_TAB);
        let yStart = v * ITEM_IN_COLUMN;
        let yEnd = yStart + ITEM_IN_COLUMN;

        xStart -= v * MAX_X_IN_OPEN_TAB;
        xEnd -= v * MAX_X_IN_OPEN_TAB;

        return {
            xStart: xStart,
            xEnd: xEnd,
            yStart: yStart,
            yEnd: yEnd
        }
    };

    const getCurrentTabRange = () => currentTabRange;

    this.init = init;
    this.updateData = updateData;
    this.getTabToShow = getTabToShow;
    this.getBeforeFirstUpdate = getBeforeFirstUpdate;
    this.getLoadedItemsTab = getLoadedItemsTab;
    this.sendRequestToLoadItem = sendRequestToLoadItem;
    this.sendRequestToLoadItem = sendRequestToLoadItem;
    this.correctPosToSetItemInDepo = correctPosToSetItemInDepo;
    this.correctPosMoveItemsInDepo = correctPosMoveItemsInDepo;
    this.getSlotsDataToFindFirstFreeSlot = getSlotsDataToFindFirstFreeSlot;
    this.getCurrentTabRange = getCurrentTabRange;
}