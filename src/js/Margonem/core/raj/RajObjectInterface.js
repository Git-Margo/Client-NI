let RajData = require('@core/raj/RajData');
let RajActionData = require('@core/raj/rajAction/RajActionData');

module.exports = function() {

    const moduleData = {
        fileName: "RajObjectInterface"
    };

    const implementRajObject = (prentObject, kindParentObject) => {


        implementInterfaceEachRajObject(prentObject);


        switch (kindParentObject) {
            case RajData.FLOAT_OBJECT:
            case RajData.FAKE_NPC:
            case RajData.FLOAT_FOREGROUND:
            case RajData.CHARACTER_EFFECT:
            case RajData.BEHAVIOR_DYNAMIC_LIGHT:

                implementInterfaceDrawRajObject(prentObject);

                break;
        }

    };

    const implementInterfaceEachRajObject = (prentObject) => {
        let configurationType = null;

        prentObject.getConfigurationType = () => {
            return configurationType;
        };

        prentObject.setConfigurationType = (_configurationType) => {
            configurationType = _configurationType
        };

        prentObject.checkCorrectRajConfigurationType = (_configurationType) => {
            const CONFIGURATION_TYPE = RajActionData.CONFIGURATION_TYPE;
            switch (_configurationType) {
                case CONFIGURATION_TYPE.SOUND:
                case CONFIGURATION_TYPE.NIGHT:
                case CONFIGURATION_TYPE.WEATHER:
                case CONFIGURATION_TYPE.ANIMATION:
                case CONFIGURATION_TYPE.NORMAL_SRAJ:
                    return true;
                default:
                    errorReport(moduleData.fileName, "checkCorrectRajConfigurationType", "configurationType not exist", configurationType);
                    return false
            }

        };

        prentObject.updateDataRajObject = (data) => {
            if (data.configurationType && prentObject.checkCorrectRajConfigurationType(data.configurationType)) {
                prentObject.setConfigurationType(data.configurationType);
            }

            if (prentObject.setAlwaysDraw && isset(data.alwaysDraw)) {
                prentObject.setAlwaysDraw(data.alwaysDraw);
            }

        };


        prentObject.setConfigurationType(RajActionData.CONFIGURATION_TYPE.NORMAL_SRAJ);

    };

    const implementInterfaceDrawRajObject = (prentObject) => {
        let alwaysDraw = false;

        prentObject.setAlwaysDraw = (_alwaysDraw) => {
            alwaysDraw = _alwaysDraw;
        };


        prentObject.getAlwaysDraw = () => {
            return alwaysDraw
        };


        prentObject.checkDrawRajObject = () => {
            const CONFIGURATION_TYPE = RajActionData.CONFIGURATION_TYPE;

            switch (prentObject.getConfigurationType()) {
                case CONFIGURATION_TYPE.NORMAL_SRAJ:
                    return true;
                case CONFIGURATION_TYPE.NIGHT:
                    return isSettingsOptionsCycleDayAndNightOn();
                case CONFIGURATION_TYPE.ANIMATION:
                    return isSettingsOptionsInterfaceAnimationOn();
                case CONFIGURATION_TYPE.WEATHER:
                    return isSettingsOptionsWeatherAndEventEffectsOn();
                default:
                    errorReport(moduleData.fileName, "checkDrawRajObject", "configurationType not rxist", configurationType);
                    return false
            }
        };
    }


    this.implementRajObject = implementRajObject

};