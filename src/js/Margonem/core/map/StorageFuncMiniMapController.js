var Store = require('core/Storage');
var StorageData = require('core/StorageData');

module.exports = new(function() {

    this.getStateByKind = (kind) => {
        return Store.easyGet(StorageData.MINI_MAP_CONTROLLER.mainKey, kind, StorageData.MINI_MAP_CONTROLLER.STATE)
    };

    this.setStateByKind = (kind, value) => {
        Store.easySet(value, StorageData.MINI_MAP_CONTROLLER.mainKey, kind, StorageData.MINI_MAP_CONTROLLER.STATE);
    }

})