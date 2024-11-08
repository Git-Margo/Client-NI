const MapAreaCordTrigger = require('core/map/mapAreaCordTrigger/MapAreaCordTrigger.js');
const MapAreaCordTriggerData = require('core/map/mapAreaCordTrigger/MapAreaCordTriggerData.js');

module.exports = function() {

    let moduleData = {
        fileName: "MapAreaCordTriggerManager.js"
    }
    let mapAreaCordTriggerList = null;
    let mapAreaColor = {}


    const init = () => {
        clearMapAreaCordTriggerList();
    };

    const clearMapAreaCordTriggerList = () => {
        mapAreaCordTriggerList = {};
    };

    const updateData = (mapAreaTriggerData) => {

        //console.log(mapAreaTriggerData)
        //devConsoleLog(['mapAreaTriggerData', mapAreaTriggerData]);

        let xPos = mapAreaTriggerData.x;
        let yPos = mapAreaTriggerData.y;
        let cols = isset(mapAreaTriggerData.cols) ? mapAreaTriggerData.cols : MapAreaCordTriggerData.defaultData.COLS;
        let rows = isset(mapAreaTriggerData.rows) ? mapAreaTriggerData.rows : MapAreaCordTriggerData.defaultData.ROWS;
        let exceptionCords = isset(mapAreaTriggerData.exceptionCords) ? mapAreaTriggerData.exceptionCords : [];
        let additionalCords = isset(mapAreaTriggerData.additionalCords) ? mapAreaTriggerData.additionalCords : [];

        let exceptionObject = getObjectOfExceptionCords(exceptionCords);

        let maxY = yPos + rows;
        let maxX = xPos + cols;

        for (let y = yPos; y < maxY; y++) {
            for (let x = xPos; x < maxX; x++) {

                if (checkExceptionExist(exceptionObject, x, y)) continue;

                createMapAreaCordTrigger(x, y, mapAreaTriggerData);
            }
        }

        for (let i = 0; i < additionalCords.length; i++) {
            let oneAdditionalCord = additionalCords[i];

            let x = oneAdditionalCord[0];
            let y = oneAdditionalCord[1];


            if (checkExceptionExist(exceptionObject, x, y)) continue;

            createMapAreaCordTrigger(x, y, mapAreaTriggerData);
        }
    };

    const checkExceptionExist = (exceptionObject, x, y) => {
        if (!exceptionObject[y]) return false;

        return exceptionObject[y][x] ? true : false;
    };

    const getObjectOfExceptionCords = (exceptionCordsArray) => {
        let exceptionObject = {};
        for (let i = 0; i < exceptionCordsArray.length; i++) {
            let x = exceptionCordsArray[i][0];
            let y = exceptionCordsArray[i][1];

            if (!exceptionObject[y]) exceptionObject[y] = {};

            exceptionObject[y][x] = true;
        }

        return exceptionObject;
    }

    const checkMapAreaCordTrigger = (x, y) => {
        if (!mapAreaCordTriggerList[y]) return null;
        if (!mapAreaCordTriggerList[y][x]) return null;

        return mapAreaCordTriggerList[y][x].length ? true : false;
    };

    const addMapAreaCordTrigger = (x, y, mapAreaCord) => {
        if (!mapAreaCordTriggerList[y]) mapAreaCordTriggerList[y] = {};
        if (!mapAreaCordTriggerList[y][x]) mapAreaCordTriggerList[y][x] = [];

        mapAreaCordTriggerList[y][x].push(mapAreaCord);
    };

    const removeMapAreaCordTrigger = (mapAreaCordTrigger) => {

        let x = mapAreaCordTrigger.getXPos();
        let y = mapAreaCordTrigger.getYPos();

        if (!checkMapAreaCordTrigger(x, y)) {
            errorReport(moduleData.fileName, "removeMapAreaCordTrigger", `cord ${x},${y} not exist not erxist`, mapAreaCordTriggerList);
            return
        }

        let findMapAreaTriggerId = mapAreaCordTrigger.getMapAreaTriggerId();
        let mapAreaCordTriggerArray = getMapAreaCordTriggerArrayByPos(x, y);

        if (!mapAreaCordTriggerArray.length) {
            errorReport(moduleData.fileName, "removeMapAreaCordTrigger", `mapAreaCordTriggerArray from cord ${x},${y} is empty!`);
            return
        }

        for (let i = 0; i < mapAreaCordTriggerArray.length; i++) {
            if (mapAreaCordTriggerArray[i].getMapAreaTriggerId() == findMapAreaTriggerId) {
                deleteElementFromArray(i, mapAreaCordTriggerArray);
                i--;
            }
        }
    };

    const removeMapAreaTriggerById = (findMapAreaTriggerId) => {
        for (let y in mapAreaCordTriggerList) {

            let oneRow = mapAreaCordTriggerList[y];
            for (let x in oneRow) {

                let mapAreaCordTriggerArray = oneRow[x];

                for (let i = 0; i < mapAreaCordTriggerArray.length; i++) {

                    if (mapAreaCordTriggerArray[i].getMapAreaTriggerId() == findMapAreaTriggerId) {
                        deleteElementFromArray(i, mapAreaCordTriggerArray);
                        i--;
                    }

                }
            }
        }
    };

    const checkMapAreaTriggerById = (findMapAreaTriggerId) => {
        for (let y in mapAreaCordTriggerList) {

            let oneRow = mapAreaCordTriggerList[y];
            for (let x in oneRow) {

                let mapAreaCordTriggerArray = oneRow[x];

                for (let i = 0; i < mapAreaCordTriggerArray.length; i++) {

                    if (mapAreaCordTriggerArray[i].getMapAreaTriggerId() == findMapAreaTriggerId) return true;

                }
            }
        }

        return false;
    };

    const getMapAreaCordTriggerArrayByPos = (x, y) => {
        return mapAreaCordTriggerList[y][x]
    };

    const getMapAreaCordTriggerArray = () => {
        return mapAreaCordTriggerList
    };

    const createMapAreaCordTrigger = (x, y, mapAreaTriggerData) => {

        let mapAreaCordTrigger = new MapAreaCordTrigger();

        addMapAreaCordTrigger(x, y, mapAreaCordTrigger);

        mapAreaCordTrigger.init();
        mapAreaCordTrigger.updateData(x, y, mapAreaTriggerData);

    };

    const afterCall = (mapAreaCordTrigger) => {

        let allMapAreaCordTriggerArray;
        let actionOnEachCord = mapAreaCordTrigger.getActionOnEachCord();

        if (actionOnEachCord) allMapAreaCordTriggerArray = [mapAreaCordTrigger];
        else allMapAreaCordTriggerArray = getAllMapAreaCordTriggerByMapAreaTrigger(mapAreaCordTrigger);

        for (let i = 0; i < allMapAreaCordTriggerArray.length; i++) {
            let _mapAreaCordTrigger = allMapAreaCordTriggerArray[i];

            _mapAreaCordTrigger.increaseActualRepeat();

            if (_mapAreaCordTrigger.checkRepeatIsOver()) {
                removeMapAreaCordTrigger(_mapAreaCordTrigger);
            }
        }
    };

    const getAllMapAreaCordTriggerByMapAreaTrigger = (mapAreaCordTrigger) => {
        let sourceXPos = mapAreaCordTrigger.getSourceXPos();
        let sourceYPos = mapAreaCordTrigger.getSourceYPos();
        let sourceCols = mapAreaCordTrigger.getSourceCols();
        let sourceRows = mapAreaCordTrigger.getSourceRows();

        let findMapAreaTriggerId = mapAreaCordTrigger.getMapAreaTriggerId();

        let a = [];

        for (let cols = 0; cols < sourceCols; cols++) {
            for (let rows = 0; rows < sourceRows; rows++) {

                let x = sourceXPos + cols;
                let y = sourceYPos + rows;

                if (!checkMapAreaCordTrigger(x, y)) continue;
                let mapAreaCordTriggerArrayFromPos = getMapAreaCordTriggerArrayByPos(x, y);

                for (let i = 0; i < mapAreaCordTriggerArrayFromPos.length; i++) {

                    let _mapAreaCordTrigger = mapAreaCordTriggerArrayFromPos[i];
                    if (_mapAreaCordTrigger.getMapAreaTriggerId() != findMapAreaTriggerId) continue;

                    a.push(_mapAreaCordTrigger);
                }

            }
        }

        return a;
    };

    const getAllMapAreaCordTriggerbyMapAreaTriggerId = (findMapAreaTriggerId) => {
        //mapAreaCordTriggerList[y][x]
        let a = [];

        for (let y in mapAreaCordTriggerList) {
            let oneRow = mapAreaCordTriggerList[y];
            for (let x in oneRow) {
                let mapAreaCordTrigger = oneRow[x];

                if (mapAreaCordTrigger.getMapAreaTriggerId() == findMapAreaTriggerId) {
                    a.push(mapAreaCordTrigger);
                }
            }
        }
    }

    const onClear = () => {
        clearMapAreaCordTriggerList();
    };

    this.checkMapAreaColor = (id) => {
        return mapAreaColor[id] ? true : false
    };

    this.getMapAreaColor = (id) => {
        return mapAreaColor[id];
    };

    this.addMapAreaColor = (id, oneTrigger) => {
        let c = `rgba(${this.round(255)}, ${this.round(255)}, ${this.round(255)}, 40%)`;
        mapAreaColor[id] = c;
        //devConsoleLog(['MapAreaCordTriggerManager.js',{
        //        id      : id,
        //        c       : c,
        //        x       : oneTrigger.getXPos(),
        //        y       : oneTrigger.getYPos(),
        //        cols    : oneTrigger.getSourceCols(),
        //        rows    : oneTrigger.getSourceRows(),
        //        n       : 'mapAreaCordTrigger',
        //    }]
        //);
    };

    this.round = (max) => {
        return Math.round(Math.random() * max);
    }

    const draw = (ctx) => {
        if (!CFG.debug) return

        let mapAreaCord = Engine.mapAreaCordTriggerManager.getMapAreaCordTriggerArray();
        let map = Engine.map;

        for (let y in mapAreaCord) {
            let oneRow = mapAreaCord[y];
            for (let x in oneRow) {
                let oneCord = oneRow[x];
                if (!oneCord.length) continue
                for (let i = 0; i < oneCord.length; i++) {
                    let oneTrigger = oneCord[i];
                    let triggerId = oneTrigger.getMapAreaTriggerId();
                    if (!this.checkMapAreaColor(triggerId)) {
                        this.addMapAreaColor(triggerId, oneTrigger);
                    }
                    ctx.fillStyle = this.getMapAreaColor(triggerId);
                    ctx.fillRect(32 * x - map.offset[0], 32 * y - map.offset[1], 32, 32);
                }
            }
        }

    }

    this.init = init;
    this.updateData = updateData;
    this.checkMapAreaCordTrigger = checkMapAreaCordTrigger;
    this.getMapAreaCordTriggerArrayByPos = getMapAreaCordTriggerArrayByPos;
    this.getMapAreaCordTriggerArray = getMapAreaCordTriggerArray;
    this.afterCall = afterCall;
    this.removeMapAreaTriggerById = removeMapAreaTriggerById;
    this.draw = draw;
    this.onClear = onClear;
    this.checkMapAreaTriggerById = checkMapAreaTriggerById;
};