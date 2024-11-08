module.exports = function() {
    let dynamicLightsId = null;


    const init = () => {
        dynamicLightsId = {};
    };

    //const updateData = () => {
    //
    //};

    const addDynamicLightId = (id) => {
        dynamicLightsId[id] = true;
    };

    const checkDynamicLightId = (id) => {
        return dynamicLightsId[id] ? true : false;
    };

    const removeDynamicLightId = (id) => {
        delete dynamicLightsId[id];
    };

    //const removeAllDynamicLights = () => {
    //    //let framesOfNight = Engine.nightController.getFramesOfNight();
    //
    //    for (let id in dynamicLightsId) {
    //        Engine.dynamicLightsManager.rajRemoveAction(id);
    //        removeDynamicLightId(id);
    //    }
    //}

    const getArrayOfDynamicLightIds = () => {
        let a = [];

        for (let id in dynamicLightsId) {
            a.push(id);
        }

        return a;
    };

    this.init = init;
    this.addDynamicLightId = addDynamicLightId;
    this.checkDynamicLightId = checkDynamicLightId;
    //this.removeAllDynamicLights     = removeAllDynamicLights;
    this.removeDynamicLightId = removeDynamicLightId;
    this.getArrayOfDynamicLightIds = getArrayOfDynamicLightIds;
};