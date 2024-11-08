const MapAreaCordTriggerData = require('core/map/mapAreaCordTrigger/MapAreaCordTriggerData.js');

module.exports = function() {

    let actualMapTriggerList;
    let oldMapTriggerList;

    const init = () => {
        actualMapTriggerList = {};
    };

    const manageTileReach = (x, y, mapAreaCordTriggerManager) => {
        let mapAreaTriggerExist = mapAreaCordTriggerManager.checkMapAreaCordTrigger(x, y);

        if (!mapAreaTriggerExist) {
            setOldMapTriggerListFromActualMapTriggerList();
            clearActualMapTriggerList();
            manageTileOut(mapAreaCordTriggerManager);
            return
        }

        let mapAreaCordTriggerArrayFromPos = mapAreaCordTriggerManager.getMapAreaCordTriggerArrayByPos(x, y);
        let actualMapTriggerToCall = [];

        for (let i = 0; i < mapAreaCordTriggerArrayFromPos.length; i++) {

            let mapAreaCordTrigger = mapAreaCordTriggerArrayFromPos[i];
            let mapAreaTriggerId = mapAreaCordTrigger.getMapAreaTriggerId();

            if (checkAtualMapTrigger(mapAreaTriggerId) && !mapAreaCordTrigger.getActionOnEachCord()) continue;

            if (mapAreaCordTrigger.getKind() != MapAreaCordTriggerData.kind.ON_IN) continue;

            actualMapTriggerToCall.push(mapAreaCordTrigger);
        }


        setOldMapTriggerListFromActualMapTriggerList();
        clearActualMapTriggerList();


        for (let i = 0; i < mapAreaCordTriggerArrayFromPos.length; i++) {
            let mapAreaCordTrigger = mapAreaCordTriggerArrayFromPos[i];
            let mapAreaTriggerId = mapAreaCordTrigger.getMapAreaTriggerId();

            addActualMapTrigger(mapAreaTriggerId, mapAreaCordTrigger);
        }

        manageTileOut(mapAreaCordTriggerManager);

        //for (let i = 0; i < actualMapTriggerToCall.length; i++) {
        //    let mapAreaCordTrigger = actualMapTriggerToCall[i];
        //
        //    mapAreaCordTrigger.callMapAreaTriggerCallback();
        //
        //    if (mapAreaCordTrigger.checkIsInfiniteRepeat()) continue;
        //
        //    mapAreaCordTriggerManager.afterCall(mapAreaCordTrigger);
        //}

        callMapTriggersProcedureFromArray(actualMapTriggerToCall, mapAreaCordTriggerManager);

    };

    const callMapTriggersProcedureFromArray = (actualMapTriggerToCall, mapAreaCordTriggerManager) => {
        for (let i = 0; i < actualMapTriggerToCall.length; i++) {
            let mapAreaCordTrigger = actualMapTriggerToCall[i];

            mapAreaCordTrigger.callMapAreaTriggerCallback();

            if (mapAreaCordTrigger.checkIsInfiniteRepeat()) continue;

            mapAreaCordTriggerManager.afterCall(mapAreaCordTrigger);
        }
    }

    const manageTileOut = (mapAreaCordTriggerManager) => {
        let outOufTileArray = getOutOfTile();

        if (!outOufTileArray.length) return;

        callMapTriggersProcedureFromArray(outOufTileArray, mapAreaCordTriggerManager);
    }

    const getOutOfTile = () => {
        let outArray = [];

        for (let mapAreaTriggerId in oldMapTriggerList) {

            let mapAreaCordTrigger = oldMapTriggerList[mapAreaTriggerId];

            if (mapAreaCordTrigger.getKind() != MapAreaCordTriggerData.kind.ON_OUT) continue;

            if (!actualMapTriggerList[mapAreaTriggerId]) outArray.push(mapAreaCordTrigger);
            else {

                if (mapAreaCordTrigger.getActionOnEachCord()) outArray.push(mapAreaCordTrigger);

            }
        }


        return outArray;
    };

    let checkAtualMapTrigger = (mapTriggerId) => {
        return actualMapTriggerList[mapTriggerId] ? true : false;
    };

    const addActualMapTrigger = (id, mapAreaCordTrigger) => {
        actualMapTriggerList[id] = mapAreaCordTrigger;
    };

    const getActualMapTrigger = () => {
        return actualMapTriggerList
    };

    const getOldMapTriggerList = () => {
        return oldMapTriggerList;
    };

    const removeActualMapTrigger = (id) => {
        delete actualMapTriggerList[id];
    };

    const setOldMapTriggerListFromActualMapTriggerList = () => {
        oldMapTriggerList = {};
        for (let k in actualMapTriggerList) {
            oldMapTriggerList[k] = actualMapTriggerList[k]
        }
    }

    const clearActualMapTriggerList = () => {
        for (let id in actualMapTriggerList) {
            removeActualMapTrigger(id);
        }
    };

    const clearOldMapTriggerList = () => {
        oldMapTriggerList = {};
    };

    const onClear = () => {
        clearActualMapTriggerList();
        clearOldMapTriggerList();
    };

    this.init = init;
    this.manageTileReach = manageTileReach;
    this.getActualMapTrigger = getActualMapTrigger;
    this.onClear = onClear;
};