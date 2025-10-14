var DynamicLightIdManager = require('@core/night/DynamicLightIdManager');

module.exports = function() {

    const moduleData = {
        fileName: ""
    }

    let dynamicLightIdManager;
    let dynamicBehaviorLightManager;
    let dynamicDirCharacterLightIdManager;

    const init = () => {
        dynamicLightIdManager = new DynamicLightIdManager();
        dynamicLightIdManager.init();

        dynamicDirCharacterLightIdManager = new DynamicLightIdManager();
        dynamicDirCharacterLightIdManager.init();

        dynamicBehaviorLightManager = new DynamicLightIdManager();
        dynamicBehaviorLightManager.init();
    };

    const removeAllDynamicLights = () => {

        let a = dynamicLightIdManager.getArrayOfDynamicLightIds();

        for (let id of a) {
            Engine.dynamicLightsManager.rajRemoveActionBeyondManager(id);
        }

    };

    const removeAllDynamicDirCharacterLights = () => {

        let a = dynamicDirCharacterLightIdManager.getArrayOfDynamicLightIds();

        for (let id of a) {
            Engine.dynamicDirCharacterLightsManager.rajRemoveActionBeyondManager(id);
        }

    };

    const removeAllDynamicBehaviorLights = () => {

        let a = dynamicBehaviorLightManager.getArrayOfDynamicLightIds();

        for (let id of a) {
            Engine.behaviorDynamicLightsManager.rajRemoveActionBeyondManager(id);
        }

    };

    const removeDynamicLightId = (id) => {
        dynamicLightIdManager.removeDynamicLightId(id);
    }

    const addDynamicLightId = (id) => {
        if (dynamicLightIdManager.checkDynamicLightId(id)) {
            errorReport(moduleData.fileName, "addDynamicLightId", `Id ${id} already exist!`);
            return;
        }
        dynamicLightIdManager.addDynamicLightId(id);
    };

    const removeDynamicDirCharacterLightId = (id) => {
        dynamicDirCharacterLightIdManager.removeDynamicLightId(id);
    };

    const addDynamicDirCharacterLightId = (id) => {
        if (dynamicDirCharacterLightIdManager.checkDynamicLightId(id)) {
            errorReport(moduleData, "addDynamicDirCharacterLightId", `Id ${id} already exist!`);
            return;
        }
        dynamicDirCharacterLightIdManager.addDynamicLightId(id);
    };

    const removeDynamicBehaviorLightId = (id) => {
        dynamicBehaviorLightManager.removeDynamicLightId(id);
    };

    const addDynamicBehaviorLightId = (id) => {
        if (dynamicBehaviorLightManager.checkDynamicLightId(id)) {
            errorReport(moduleData, "addDynamicBehaviorLightId", `Id ${id} already exist!`);
            return;
        }
        dynamicBehaviorLightManager.addDynamicLightId(id);
    };

    this.init = init;
    this.removeAllDynamicLights = removeAllDynamicLights;
    this.removeAllDynamicDirCharacterLights = removeAllDynamicDirCharacterLights;
    this.removeAllDynamicBehaviorLights = removeAllDynamicBehaviorLights;

    this.removeDynamicLightId = removeDynamicLightId;
    this.addDynamicLightId = addDynamicLightId;

    this.removeDynamicDirCharacterLightId = removeDynamicDirCharacterLightId;
    this.addDynamicDirCharacterLightId = addDynamicDirCharacterLightId;

    this.removeDynamicBehaviorLightId = removeDynamicBehaviorLightId;
    this.addDynamicBehaviorLightId = addDynamicBehaviorLightId;
}