var ServerStorageData = require('@core/storage/ServerStorageData');
module.exports = function() {


    let serverStorageData;
    //let self = this;
    let dataLoaded = false;

    let dataToSend = {};
    let allCallback = [];

    let dataToSendOld;
    let allCallbackOld;

    //let blockSendRequest = false;
    let reloadServerStorageAfterAnswerInInit1 = false;

    const createOldDataAndResetNewData = () => {
        dataToSendOld = dataToSend;
        allCallbackOld = allCallback;

        dataToSend = {};
        allCallback = [];
    };

    const getServerStorageData = () => {
        return ServerStorageData;
    }

    const init = (data) => {
        initServerStorageData(data);

        let sS = CFG.serverStorage;
        let version = sS.version;

        // if (!data || !data.hasOwnProperty('storageConfig') || data.storageConfig.version != version) {
        let key = ServerStorageData.STORAGE_CONFIG;
        if (!data || !data.hasOwnProperty(key) || data[key].version != version) {
            //Engine.activeMustHaveRestart();
            activeReloadServerStorageAfterAnswerInInit1();

            let objToSend = {};

            if (!data) data = {};

            for (let i = 0; i < sS.keysToRemove.length; i++) {
                let name = sS.keysToRemove[i];
                objToSend[name] = false

                if (data.hasOwnProperty(name)) data[name] = false

            }

            objToSend[key] = {
                version: version
            };

            activeReloadServerStorageAfterAnswerInInit1();
            sendData(objToSend, function() {
                getEngine().afterServerStorageReloaded(sS.keysToRemove);
            });
        }
    };

    const activeReloadServerStorageAfterAnswerInInit1 = () => {
        reloadServerStorageAfterAnswerInInit1 = true;
    };

    const getReloadServerStorageAfterAnswerInInit1 = () => {
        return reloadServerStorageAfterAnswerInInit1;
    };

    //this.setBlockSendRequest = (state) => {
    //	blockSendRequest = state;
    //};

    const getData = function() {
        let objOrVal = serverStorageData;
        if (!objOrVal) return null;

        for (let i = 0; i < arguments.length; i++) {
            objOrVal = getObject(objOrVal, arguments[i]);
            if (objOrVal == null) return null
        }

        return objOrVal;
    };

    const getObject = (obj, key) => {
        return obj.hasOwnProperty(key) ? obj[key] : null;
    };

    const sendData = (data, callback) => {

        checkKeysIsCorrect(data);

        if (!getAlreadyInitialised() && data[ServerStorageData.M_CLIENT_DATA]) {
            activeReloadServerStorageAfterAnswerInInit1();
        }

        dataToSend = mergeData(dataToSend, data);

        if (callback) allCallback.push(callback);
    };

    const checkKeysIsCorrect = (data) => {
        for (let checkKey in data) {
            let exist = false
            for (let kk in ServerStorageData) {
                let serverStorageDataKey = ServerStorageData[kk];
                if (serverStorageDataKey == checkKey) {
                    exist = true
                    break;
                }
            }
            if (!exist) {
                warningReport("ServerStorage.js", "checkKeysIsCorrect", "Key not exist in ServerStorageData:", checkKey);
                //return false
            }
        }
        //return true
    }

    const getPackageToSendToServerStorage = () => {
        if (!Engine.interfaceStart) return null;

        let isSomething = isSomethingToSend();

        if (isSomething) {
            let mergeObjToSend = prepareMergeObjToSend();

            //createOldDataAndResetNewData();

            return mergeObjToSend
        } else return null;
    };

    const notSaveInServerStorageManage = (d) => {
        if (d.w) {
            resetVars();
            console.warn('[ServerStorage.js, notSaveInServerStorageManage] Error request ignored');
        }
    };

    const prepareMergeObjToSend = () => {
        let _prepareMergeObjToSend = {};

        for (let k in dataToSend) {
            if (serverStorageData[k]) _prepareMergeObjToSend[k] = dataToSend[k] ? mergeData(serverStorageData[k], dataToSend[k]) : false;
            else _prepareMergeObjToSend[k] = dataToSend[k] ? mergeData({}, dataToSend[k]) : false;
            /*
            else {

            	prepareMergeObjToSend[k] = dataToSend[k] ? this.mergeData({}, dataToSend[k]) : false;

            	// if (dataToSend[k] == false) prepareMergeObjToSend[k] = false;
            	// else 						prepareMergeObjToSend[k] = this.mergeData({}, dataToSend[k]);

            }
            */
        }

        return _prepareMergeObjToSend;
    };

    const isSomethingToSend = () => {
        if (!Object.keys(dataToSend).length) return false;

        let allEmpty = true;

        for (let k in dataToSend) {
            if (Object.keys(dataToSend[k]).length || dataToSend[k] === false) {
                allEmpty = false;
                break;
            }
        }

        if (allEmpty) return false;

        return true;
    };

    // this.sendDataWhenInterfaceStart = () => {
    // 	if (!Object.keys(dataToSend).length) {
    // 		//console.log('nothing send to server storage');
    // 		return;
    // 	}
    //
    // 	let allEmpty = true;
    //
    // 	for (let k in dataToSend) {
    // 		if (Object.keys(dataToSend[k]).length) {
    // 			allEmpty = false;
    // 			break;
    // 		}
    // 	}
    //
    // 	if (allEmpty) {
    // 		//console.log('nothing send to server storage');
    // 		return;
    // 	}
    //
    // 	this.setBlockSendRequest(true);
    // 	this.sendRequest();
    // };

    const initServerStorageData = (data) => {
        if (data != null) serverStorageData = data;
        else serverStorageData = {};
    };

    const mergeData = function() {

        let target = {};

        let merger = (obj) => {
            for (let prop in obj) {

                if (!obj.hasOwnProperty(prop)) continue;

                let isObject = Object.prototype.toString.call(obj[prop]) === '[object Object]';

                if (isObject) target[prop] = mergeData(target[prop], obj[prop]);
                else target[prop] = obj[prop];

            }
        };

        for (let i = 0; i < arguments.length; i++) {
            merger(arguments[i]);
        }

        return target;
    };

    const sendDataToServerStorage = (data) => {
        _g('config&set=1', notSaveInServerStorageManage, data)
    };

    const clearAllData = () => {
        _g('config&clear=1', function() {
            //location.reload();
            pageReload();
        });
    };

    const clearDataBySpecificKey = (key) => {
        if (!isset(serverStorageData[key])) return;
        _g('config&remove=' + key, function() {
            //location.reload();
        });
    };

    const mergeServerStorageDataWithDataToSend = (keysToUpdate) => {
        serverStorageData = mergeData(serverStorageData, dataToSendOld);
    };

    const callAllOldCallback = (keysToUpdate) => {
        if (!allCallbackOld) return;
        for (let i = 0; i < allCallbackOld.length; i++) {
            allCallbackOld[i]();
        }
    };

    const resetDataToSendOld = () => {
        dataToSendOld = {};
    };

    const resetAllOldCallback = () => {
        allCallbackOld = [];
    };

    const getDataLoaded = () => {
        return dataLoaded;
    }

    const updateData = (data) => {
        dataLoaded = true
        if (isset(data.data)) {
            init(data.data);
            // console.log(data.data)
            checkKeysIsCorrect((data.data));

            getEngine().initAfterServerStorageLoaded();
        }

        if (isset(data.set)) {
            mergeServerStorageDataWithDataToSend(data.set);
            callAllOldCallback(data.set);
            resetVars();
        }

        if (isset(data.removed)) {
            delete serverStorageData[data.removed];
            console.log('removed')
        }
    };

    const resetVars = () => {
        resetAllOldCallback();
        resetDataToSendOld();
    }


    this.prepareMergeObjToSend = prepareMergeObjToSend;
    this.createOldDataAndResetNewData = createOldDataAndResetNewData;
    this.sendDataToServerStorage = sendDataToServerStorage;
    this.sendData = sendData;
    this.updateData = updateData;
    this.clearDataBySpecificKey = clearDataBySpecificKey;
    this.clearAllData = clearAllData;

    this.get = getData;
    //this.getServerStorageData 						= getServerStorageData;
    this.getDataLoaded = getDataLoaded;
    this.getReloadServerStorageAfterAnswerInInit1 = getReloadServerStorageAfterAnswerInInit1;
    this.getPackageToSendToServerStorage = getPackageToSendToServerStorage;
};