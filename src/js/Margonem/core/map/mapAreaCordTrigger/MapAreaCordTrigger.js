const MapAreaCordTriggerData = require('core/map/mapAreaCordTrigger/MapAreaCordTriggerData.js');

module.exports = function() {

    let sourceXPos;
    let sourceYPos;
    let sourceCols;
    let sourceRows;
    let xPos;
    let yPos;
    let mapAreaTriggerId;
    let mapAreaTriggerCallback;
    let actionOnEachCord;
    let repeat;
    let actualRepeat;
    let kind;


    const init = () => {
        setRepeat(MapAreaCordTriggerData.defaultData.REPEAT);
        setActualRepeat(MapAreaCordTriggerData.defaultData.REPEAT);
        setSourceCols(MapAreaCordTriggerData.defaultData.COLS);
        setSourceRows(MapAreaCordTriggerData.defaultData.ROWS);
        setActionOnEachCord(MapAreaCordTriggerData.defaultData.ACTION_ON_EACH_CORD);
        setKind(MapAreaCordTriggerData.defaultData.kind);
    };

    const callMapAreaTriggerCallback = () => {
        mapAreaTriggerCallback();
    };

    const increaseActualRepeat = () => {
        setActualRepeat(actualRepeat + 1);
    };

    const checkRepeatIsOver = () => {
        if (repeat === true) return false;

        return actualRepeat > repeat;
    }

    const updateData = (x, y, mapAreaTriggerData) => {
        setXPos(x);
        setYPos(y);
        setSourceXPos(mapAreaTriggerData.x);
        setSourceYPos(mapAreaTriggerData.y);
        setMapAreaTriggerId(mapAreaTriggerData.id);
        setMapAreaTriggerCallback(mapAreaTriggerData.mapAreaTriggerCallback);

        if (isset(mapAreaTriggerData.cols)) setSourceCols(mapAreaTriggerData.cols);
        if (isset(mapAreaTriggerData.rows)) setSourceRows(mapAreaTriggerData.rows);
        if (isset(mapAreaTriggerData.repeat)) setRepeat(mapAreaTriggerData.repeat);
        if (isset(mapAreaTriggerData.actionOnEachCord)) setActionOnEachCord(mapAreaTriggerData.actionOnEachCord);
        if (isset(mapAreaTriggerData.kind)) setKind(mapAreaTriggerData.kind);
    };

    const setSourceCols = (_sourceCols) => {
        sourceCols = _sourceCols;
    };

    const setSourceRows = (_sourceRows) => {
        sourceRows = _sourceRows;
    };

    const setSourceXPos = (_sourceXPos) => {
        sourceXPos = _sourceXPos;
    };

    const setSourceYPos = (_sourceYPos) => {
        sourceYPos = _sourceYPos;
    };

    const setXPos = (_xPos) => {
        xPos = _xPos;
    };

    const setYPos = (_yPos) => {
        yPos = _yPos;
    };

    const setMapAreaTriggerId = (_mapAreaTriggerId) => {
        mapAreaTriggerId = _mapAreaTriggerId
    };

    const setMapAreaTriggerCallback = (_mapAreaTriggerCallback) => {
        mapAreaTriggerCallback = _mapAreaTriggerCallback
    };

    const setActionOnEachCord = (_actionOnEachCord) => {
        actionOnEachCord = _actionOnEachCord;
    };

    const setActualRepeat = (_actualRepeat) => {
        actualRepeat = _actualRepeat;
    };

    const setRepeat = (_repeat) => {
        repeat = _repeat;
    };

    const setKind = (_kind) => {
        kind = _kind;
    };

    const checkIsInfiniteRepeat = () => {
        return repeat === true;
    }


    const getMapAreaTriggerId = () => mapAreaTriggerId;
    const getActionOnEachCord = () => actionOnEachCord;
    const getXPos = () => xPos;
    const getYPos = () => yPos;
    const getSourceXPos = () => sourceXPos;
    const getSourceYPos = () => sourceYPos;
    const getSourceCols = () => sourceCols;
    const getSourceRows = () => sourceRows;
    const getKind = () => kind;

    this.init = init;
    this.updateData = updateData;
    this.callMapAreaTriggerCallback = callMapAreaTriggerCallback;
    this.increaseActualRepeat = increaseActualRepeat;
    this.checkIsInfiniteRepeat = checkIsInfiniteRepeat;
    this.checkRepeatIsOver = checkRepeatIsOver;

    this.getMapAreaTriggerId = getMapAreaTriggerId;
    this.getActionOnEachCord = getActionOnEachCord;
    this.getXPos = getXPos;
    this.getYPos = getYPos;
    this.getSourceXPos = getSourceXPos;
    this.getSourceYPos = getSourceYPos;
    this.getSourceCols = getSourceCols;
    this.getSourceRows = getSourceRows;
    this.getKind = getKind;
}