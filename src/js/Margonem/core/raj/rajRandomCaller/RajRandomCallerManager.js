//var RajRandomCaller = require('core/raj/rajRandomCaller/RajRandomCaller.js');

module.exports = function() {

    let randomCallerList;
    let moduleData = {
        fileName: "RajRandomCaller.js"
    };

    const init = () => {
        randomCallerList = {};
    };

    const updateData = (data, additionalData) => {

        const FUNC = "updateData";
        let options = data.options;

        if (!isset(options)) {
            errorReport(moduleData.fileName, FUNC, "Attr options is obligatory!", data);
            return;
        }

        if (!elementIsArray(options)) {
            errorReport(moduleData.fileName, FUNC, "Attr options have to be array!", data);
            return;
        }

        let srajToCall = getRandomElementFromArray(options);

        if (!lengthObject(srajToCall)) {
            return
        }

        Engine.rajController.parseObject(srajToCall, [], additionalData);
    };

    const onClear = () => {

    };

    this.init = init;
    this.updateData = updateData;
    this.onClear = onClear;

}