var Store = require('@core/Storage');
var StorageData = require('@core/StorageData');

module.exports = new(function() {

    let HAND_HELD_DATA = StorageData.HAND_HELD_DATA;
    const mainKey = !mobileCheck() ? HAND_HELD_DATA.mainKey : HAND_HELD_DATA.mainKeyMobile;

    this.getSizeWindow = () => {
        return Store.easyGet(mainKey, HAND_HELD_DATA.BIG);
    };

    //this.getShowWindow = () => {
    //  return Store.easyGet(mainKey, HAND_HELD_DATA.SHOW);
    //};

    this.getStateOfKindByName = (name) => {
        return Store.easyGet(mainKey, name, HAND_HELD_DATA.STATE)
    };

    //this.getDataDrawerOfKindByName = (name) => {
    //  return Store.easyGet(mainKey, name, HAND_HELD_DATA.DATA_DRAWER_STATE)
    //};

    this.getDataDrawerNickOfKindByName = (name) => {
        return Store.easyGet(mainKey, name, HAND_HELD_DATA.DATA_DRAWER_NICK_STATE)
    };

    this.getDataDrawerProfAndLevelOfKindByName = (name) => {
        return Store.easyGet(mainKey, name, HAND_HELD_DATA.DATA_DRAWER_LVL_AND_PROF_STATE)
    };

    this.getDataDrawerFontSizeOfKindByName = (name) => {
        return Store.easyGet(mainKey, name, HAND_HELD_DATA.DATA_DRAWER_FONT_SIZE)
    };

    this.getColorOfKindByName = (name) => {
        return Store.easyGet(mainKey, name, HAND_HELD_DATA.COLOR);
    };

    this.getWhoIsHereOfKindByName = (name) => {
        return Store.easyGet(mainKey, name, HAND_HELD_DATA.WHO_IS_HERE);
    };

    this.getMapBlurOfKindByName = (name) => {
        return Store.easyGet(mainKey, name, HAND_HELD_DATA.MAP_BLUR);
    };

    this.getIconOfKindByName = (name) => {
        return Store.easyGet(mainKey, name, HAND_HELD_DATA.ICON)
    };

    this.getMinLevelOfKindByName = () => {
        return Store.easyGet(mainKey, HAND_HELD_DATA.MIN_LEVEL, HAND_HELD_DATA.AMOUNT)
    };

    this.getWidthDataDrawerOfKindByName = () => {
        return Store.easyGet(mainKey, HAND_HELD_DATA.DATA_DRAWER_WIDTH, HAND_HELD_DATA.AMOUNT)
    };

    this.getFontSizeDataDrawerOfKindByName = () => {
        return Store.easyGet(mainKey, HAND_HELD_DATA.DATA_DRAWER_FONT_SIZE, HAND_HELD_DATA.AMOUNT)
    };

    this.setStateOfKindByName = (name, state) => {
        Store.easySet(state, mainKey, name, HAND_HELD_DATA.STATE);
    };

    //this.setDataDrawerOfKindByName = (name, state) => {
    //  Store.easySet(state, mainKey, name , HAND_HELD_DATA.DATA_DRAWER_STATE);
    //};

    this.setDataDrawerNickOfKindByName = (name, state) => {
        Store.easySet(state, mainKey, name, HAND_HELD_DATA.DATA_DRAWER_NICK_STATE);
    };

    this.setDataDrawerProfAndLevelOfKindByName = (name, state) => {
        Store.easySet(state, mainKey, name, HAND_HELD_DATA.DATA_DRAWER_LVL_AND_PROF_STATE);
    };

    this.setColorOfKindByName = (name, color) => {
        Store.easySet(color, mainKey, name, HAND_HELD_DATA.COLOR);
    };

    this.setWhoIsHereOfKindByName = (name, state) => {
        return Store.easySet(state, mainKey, name, HAND_HELD_DATA.WHO_IS_HERE);
    };

    this.setMapBlurOfKindByName = (name, state) => {
        return Store.easySet(state, mainKey, name, HAND_HELD_DATA.MAP_BLUR);
    };

    this.setIconOfKindByName = (name, icon) => {
        Store.easySet(icon, mainKey, name, HAND_HELD_DATA.ICON);
    };

    this.setWidthDataDrawerOfKindByName = (width) => {
        Store.easySet(width, mainKey, HAND_HELD_DATA.DATA_DRAWER_WIDTH, HAND_HELD_DATA.AMOUNT);
    };

    this.setFontSizeDataDrawerOfKindByName = (width) => {
        Store.easySet(width, mainKey, HAND_HELD_DATA.DATA_DRAWER_FONT_SIZE, HAND_HELD_DATA.AMOUNT);
    };

    this.setMinLevelOfKindByName = (minLevel) => {
        Store.easySet(minLevel, mainKey, HAND_HELD_DATA.MIN_LEVEL, HAND_HELD_DATA.AMOUNT);
    };

    //this.setShowWindow = (_show) => {
    //  Store.easySet(_show, mainKey, HAND_HELD_DATA.SHOW);
    //};

    this.setSizeWindow = (_big) => {
        Store.easySet(_big, mainKey, HAND_HELD_DATA.BIG);
    }



});