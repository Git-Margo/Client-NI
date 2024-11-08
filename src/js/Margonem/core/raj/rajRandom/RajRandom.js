const RajRandomData = require('core/raj/rajRandom/RajRandomData.js');

module.exports = function() {

    const moduleData = {
        fileName: "RajRandom.js"
    };

    const init = () => {

    };

    const getRandomFullReplaceJson = (data) => {
        getRandomParseJson(data)
    };

    const getRandomParseJson = (data) => {
        for (let k in data) {

            let oneData = data[k];

            if (elementIsObject(oneData)) {

                if (oneData.getRandom) data[k] = getRandom(oneData.getRandom);
                else getRandomParseJson(data[k]);

                continue;
            }

            if (elementIsArray(data[k])) {
                let a = data[k];

                for (let k in a) {
                    getRandomParseJson(a[k]);
                }

                continue;
            }

        }

        if (!isset(data.getRandom)) return;

    };

    const getRandom = (data) => {
        if (!checkCorrectDataGetRandom(data)) return 0;

        const RESULT_TYPE = RajRandomData.resultType;

        switch (data.resultType) {
            case RESULT_TYPE.INT:
                return getRandomNumberGetValue(data);
            case RESULT_TYPE.FLOAT:
                return getRandomNumberGetValue(data);
            case RESULT_TYPE.OPTION:
                return getRandomOption(data);

        }

        return null;
    };

    const getRandomOption = (data) => {
        let options = data.options;
        let maxIndex = options.length - 1;
        let index = Math.round(Math.random() * maxIndex);

        return options[index];
    };

    const checkCorrectDataGetRandom = (data) => {
        const FUNC = 'checkCorrectDataGetRandomNumber';
        const RESULT_TYPE = RajRandomData.resultType;

        const INT = RESULT_TYPE.INT;
        const FLOAT = RESULT_TYPE.FLOAT;
        const OPTION = RESULT_TYPE.OPTION;

        if (!isset(data.resultType)) {
            errorReport(moduleData.fileName, FUNC, 'Attr resultType is obligatory!', data);
            return false;
        }

        if (![INT, FLOAT, OPTION].includes(data.resultType)) {
            errorReport(moduleData.fileName, FUNC, 'Available val of resultType attr : int, float or option!', data);
            return false;
        }

        if (data.resultType == INT || data.resultType == FLOAT) {
            if (!isset(data.start)) {
                errorReport(moduleData.fileName, FUNC, 'Attr start is obligatory!', data);
                return false;
            }

            if (!isNumberFunc(data.start)) {
                errorReport(moduleData.fileName, FUNC, 'Attr start have to number val!', data);
                return false;
            }
            if (!(isset(data.end) || isset(data.variation))) {
                errorReport(moduleData.fileName, FUNC, 'Attr end or variation is obligatory!', data);
                return false;
            }
            if (isset(data.end) && !isNumberFunc(data.end)) {
                errorReport(moduleData.fileName, FUNC, 'Attr end have to number val!', data);
                return false;
            }
            if (isset(data.variation) && !isNumberFunc(data.variation)) {
                errorReport(moduleData.fileName, FUNC, 'Attr variation have to number val!', data);
                return false;
            }

            return true
        }

        if (data.resultType == OPTION) {

            if (!isset(data.options)) {
                errorReport(moduleData.fileName, FUNC, 'Attr options is obligatory!', data);
                return false;
            }

            if (!elementIsArray(data.options)) {
                errorReport(moduleData.fileName, FUNC, 'Attr options have to be array!', data);
                return false;
            }

        }

        return true;
    };

    const getRandomNumberGetValue = (data) => {
        let start = data.start;
        let v = null;

        if (isset(data.end)) {
            let diff = Math.abs(start - data.end);
            v = start + Math.random() * diff;
        }

        if (isset(data.variation)) {
            let variation = (Math.round(Math.random()) ? 1 : -1) * Math.random() * data.variation;
            v = start + variation;
        }


        const RESULT_TYPE = RajRandomData.resultType;

        switch (data.resultType) {
            case RESULT_TYPE.INT:
                return Math.round(v);
            case RESULT_TYPE.FLOAT:
                return v;
        }

    };

    this.init = init;
    this.getRandomFullReplaceJson = getRandomFullReplaceJson;
};