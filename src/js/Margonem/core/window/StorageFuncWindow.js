var StorageData = require('@core/StorageData');
var Store = require('@core/Storage');

module.exports = new(function() {

    let WINDOW_DATA = StorageData.WINDOW_DATA;

    this.setShowWindow = (show, nameWindow) => {
        Store.easySet(show, WINDOW_DATA.mainKey, nameWindow, WINDOW_DATA.SHOW)
    };

    this.removeShowWindow = (nameWindow) => {
        Store.remove(WINDOW_DATA.mainKey + '/' + nameWindow + '/' + WINDOW_DATA.SHOW)
    };

    this.setPositionWindow = (position, nameWindow) => {
        Store.easySet(position, WINDOW_DATA.mainKey, nameWindow, WINDOW_DATA.POSITION)
    };

    this.setOpacityWindow = (opacity, nameWindow) => {
        Store.easySet(opacity, WINDOW_DATA.mainKey, nameWindow, WINDOW_DATA.OPACITY)
    };

    this.setCollapseWindow = (collapse, nameWindow) => {
        // const data = {
        // 	[WINDOW_DATA.mainKey]: {
        // 		[nameWindow]: {
        // 			[WINDOW_DATA.COLLAPSE]: collapse
        // 		}
        // 	}
        // }
        // Engine.serverStorage.sendData(data);
        Store.easySet(collapse, WINDOW_DATA.mainKey, nameWindow, WINDOW_DATA.COLLAPSE)
    };

    this.getShowWindow = (nameWindow) => {
        return Store.easyGet(WINDOW_DATA.mainKey, nameWindow, WINDOW_DATA.SHOW);
    };

    this.getPositionWindow = (nameWindow) => {
        return Store.easyGet(WINDOW_DATA.mainKey, nameWindow, WINDOW_DATA.POSITION);
    };

    this.getOpacityWindow = (nameWindow) => {
        return Store.easyGet(WINDOW_DATA.mainKey, nameWindow, WINDOW_DATA.OPACITY)
    };

    this.getCollapseWindow = (nameWindow) => {
        // return Engine.serverStorage.get(WINDOW_DATA.mainKey, nameWindow, WINDOW_DATA.COLLAPSE);
        return Store.easyGet(WINDOW_DATA.mainKey, nameWindow, WINDOW_DATA.COLLAPSE)
    };

});