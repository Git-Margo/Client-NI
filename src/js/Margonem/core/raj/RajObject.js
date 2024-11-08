let RajActionData = require('core/raj/rajAction/RajActionData');

module.exports = function() {

    const moduleData = {
        fileName: "RajObject.js"
    }

    let parent = null;
    let configurationType = null;
    //let alwaysDraw          = null;

    const init = (_parrent) => {
        setConfigurationType(RajActionData.CONFIGURATION_TYPE.NORMAL_SRAJ);
        setParent(_parrent);
    };

    const setParent = (_parent) => {
        parent = _parent;
    };

    const setConfigurationType = (_configurationType) => {
        configurationType = _configurationType
    };

    const checkDrawRajObject = () => {
        const CONFIGURATION_TYPE = RajActionData.CONFIGURATION_TYPE;

        switch (configurationType) {
            case CONFIGURATION_TYPE.NORMAL_SRAJ:
                return true;
            case CONFIGURATION_TYPE.NIGHT:
                return isSettingsOptionsCycleDayAndNightOn();
            case CONFIGURATION_TYPE.WEATHER:
                return isSettingsOptionsWeatherAndEventEffectsOn();
            default:
                errorReport(moduleData.fileName, "checkDrawRajObject", "configurationType not rxist", configurationType);
                return false
        }
    };

    //const setAlwaysDraw = (_alwaysDraw) => {
    //    alwaysDraw = _alwaysDraw
    //};
    //
    //const getAlwaysDraw = () => {
    //    return alwaysDraw;
    //};

    const checkCorrectRajConfigurationType = (configurationType) => {
        const CONFIGURATION_TYPE = RajActionData.CONFIGURATION_TYPE;
        switch (configurationType) {
            case CONFIGURATION_TYPE.SOUND:
            case CONFIGURATION_TYPE.NIGHT:
            case CONFIGURATION_TYPE.WEATHER:
            case CONFIGURATION_TYPE.NORMAL_SRAJ:
                return true;
            default:
                errorReport(moduleData.fileName, "checkCorrectRajConfigurationType", "configurationType not exist", configurationType);
                return false
        }

    }

    const updateData = (data) => {
        if (data.configurationType && checkCorrectRajConfigurationType(data.configurationType)) {
            setConfigurationType(data.configurationType);
        }
    }

    this.init = init;
    this.setConfigurationType = setConfigurationType;
    this.checkDrawRajObject = checkDrawRajObject;
    //this.setAlwaysDraw          = setAlwaysDraw;
    //this.getAlwaysDraw          = getAlwaysDraw;
    this.updateData = updateData;


};