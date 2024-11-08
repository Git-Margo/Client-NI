var Storage = require('core/Storage');
var StorageData = require('core/StorageData');

module.exports = new(function() {

    const moduleData = {
        fileName: "BattleLogHelpWindow.js"
    };

    const BATTLE_PANEL = StorageData.BATTLE_PANEL;
    const MAIN_KEY = BATTLE_PANEL.mainKey;
    const BATTLE_PANEL_SIZE = BATTLE_PANEL.BATTLE_PANEL_SIZE;
    const ATTACH_BATTLE_LOG_HELP_WINDOW = BATTLE_PANEL.ATTACH_BATTLE_LOG_HELP_WINDOW;
    const ATTACH_BATTLE_PREDICTION_HELP_WINDOW = BATTLE_PANEL.ATTACH_BATTLE_PREDICTION_HELP_WINDOW;
    const BATTLE_LOG_HELP_WINDOW_SIZE_OPT = BATTLE_PANEL.BATTLE_LOG_HELP_WINDOW_SIZE_OPT;
    const BATTLE_PREDICTION_HELP_WINDOW_SIZE_OPT = BATTLE_PANEL.BATTLE_PREDICTION_HELP_WINDOW_SIZE_OPT;

    this.getBattlePanelState = () => {
        return Storage.easyGet(MAIN_KEY, BATTLE_PANEL_SIZE);
    };

    this.setBattlePanelState = (newState) => {
        Storage.easySet(newState, MAIN_KEY, BATTLE_PANEL_SIZE);
    };

    this.getAttachBattleLogHelpWindow = () => {
        let attachData = Storage.easyGet(MAIN_KEY, ATTACH_BATTLE_LOG_HELP_WINDOW);

        if (attachData === null) return false;

        if (isBoolean(attachData)) return attachData;

        errorReport(moduleData.fileName, "getAttachBattleLogHelpWindow", "incorrect attachData", attachData);

        return false;
    };

    this.setAttachBattleLogHelpWindow = (newState) => {
        Storage.easySet(newState, MAIN_KEY, ATTACH_BATTLE_LOG_HELP_WINDOW);
    };

    this.getBattleLogHelpWindowSizeOpt = (sizeArray) => {
        let sizeOptData = Storage.easyGet(MAIN_KEY, BATTLE_LOG_HELP_WINDOW_SIZE_OPT);

        if (isInt(sizeOptData) && -1 < sizeOptData && sizeOptData < sizeArray.length) return sizeOptData;

        errorReport(moduleData.fileName, "getBattleLogHelpWindowSizeOpt", "incorrect sizeOptData", sizeOptData);

        return 0;
    };

    this.setBattleLogHelpWindowSizeOpt = (newState) => {
        Storage.easySet(newState, MAIN_KEY, BATTLE_LOG_HELP_WINDOW_SIZE_OPT);
    }

    this.getAttachBattlePredictionHelpWindow = () => {
        let attachData = Storage.easyGet(MAIN_KEY, ATTACH_BATTLE_PREDICTION_HELP_WINDOW);

        if (attachData === null) return false;

        if (isBoolean(attachData)) return attachData;

        errorReport(moduleData.fileName, "getAttachBattlePredictionHelpWindow", "incorrect attachData", attachData);

        return false;
    };

    this.setAttachBattlePredictionHelpWindow = (newState) => {
        Storage.easySet(newState, MAIN_KEY, ATTACH_BATTLE_PREDICTION_HELP_WINDOW);
    };

    this.getBattlePredictionHelpWindowSizeOpt = (sizeArray) => {
        let sizeOptData = Storage.easyGet(MAIN_KEY, BATTLE_PREDICTION_HELP_WINDOW_SIZE_OPT);

        if (isInt(sizeOptData) && -1 < sizeOptData && sizeOptData < sizeArray.length) return sizeOptData;

        errorReport(moduleData.fileName, "getBattlePredictionHelpWindowSizeOpt", "incorrect sizeOptData", sizeOptData);

        return 0;
    };

    this.setBattlePredictionHelpWindowSizeOpt = (newState) => {
        Storage.easySet(newState, MAIN_KEY, BATTLE_PREDICTION_HELP_WINDOW_SIZE_OPT);
    }

});