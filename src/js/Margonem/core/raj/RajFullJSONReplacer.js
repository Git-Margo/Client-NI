const RajRandom = require('@core/raj/rajRandom/RajRandom');
const RajFunc = require('@core/raj/rajFunc/RajFunc.js');
const RajFor = require('@core/raj/RajFor');
const RajTemplate = require('@core/raj/RajTemplate');
const RajData = require('@core/raj/RajData');
const RajRandomData = require('@core/raj/rajRandom/RajRandomData.js');
const RajFuncData = require('@core/raj/rajFunc/RajFuncData.js');

module.exports = function() {

    const moduleData = {
        fileName: "RajFullJSONReplacer.js"
    };

    let rajTemplate = null;
    let rajRandom = null;
    let rajFunc = null;
    let rajFor = null;

    const init = () => {
        rajTemplate = new RajTemplate();
        rajTemplate.init();

        rajRandom = new RajRandom();
        rajRandom.init();

        rajFunc = new RajFunc();
        rajFunc.init();

        rajFor = new RajFor();
        rajFor.init();
    };

    const parseRajJSON = (type, data) => {

        switch (type) {
            case 'getTpl':
                return rajTemplate.getReplaceDataGetTplFullReplaceJson(data); // Exception... return data...
            case RajRandomData.GET_RANDOM_KEY:
                rajRandom.getRandomFullReplaceJson(data);
                break;
            case RajFuncData.GET_FUNC_KEY:
                rajFunc.getFuncFullReplaceJson(data);
                break;
            case 'getFor':
                rajFor.getForFullReplaceJson(data);
                break;
            default:
                errorReport(moduleData.fileName, "parseRajJSON", "undefined type", type);
        }

    };

    const getRajDataAfterAllReplace = (data) => {
        if (data[RajData.TEMPLATE]) data = parseRajJSON('getTpl', data);

        parseRajJSON('getFor', data); // getForVar HERE

        parseRajJSON(RajRandomData.GET_RANDOM_KEY, data);
        parseRajJSON(RajFuncData.GET_FUNC_KEY, data);

        //parseRajJSON('getConnectString', data);
        //parseRajJSON('getAddNumber', data);

        return data;
    };

    const getRajRandom = () => rajRandom;

    this.init = init;
    this.getRajDataAfterAllReplace = getRajDataAfterAllReplace
};