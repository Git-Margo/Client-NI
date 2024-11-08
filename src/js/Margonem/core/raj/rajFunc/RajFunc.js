const RajFuncData = require('core/raj/rajFunc/RajFuncData.js');

module.exports = function() {

    const moduleData = {
        fileName: "RajFunc.js"
    };

    const init = () => {

    };


    const getFuncFullReplaceJson = (data) => {
        getFuncParseJson(data)
    };

    const getFuncParseJson = (data) => {
        for (let k in data) {

            let oneData = data[k];

            //if (k == "getFunc") {
            if (k == RajFuncData.GET_FUNC_KEY) {
                getFunc(data, oneData);
                continue
            }

            if (elementIsObject(oneData)) {

                if (oneData.getFunc) getFunc(oneData, oneData.getFunc);
                else getFuncParseJson(data[k]);

                continue;
            }

            if (elementIsArray(data[k])) {
                let a = data[k];

                for (let k in a) {
                    getFuncParseJson(a[k]);
                }

                continue;
            }

        }

        if (!isset(data.getFunc)) return;

    };

    const getFunc = (fullRecordData, data) => {
        if (isset(data.x)) debugger;
        if (!checkCorrectDataGetFunc(data)) return null;

        let result = getFuncResult(data);

        delete fullRecordData.getFunc;

        for (let k in result) {
            fullRecordData[k] = result[k];
        }
    };

    const checkCorrectDataGetFunc = (data) => {
        let FUNC = 'checkCorrectDataGetRandomNumber';

        if (!isset(data.resultType)) {
            errorReport(moduleData.fileName, FUNC, 'Attr resultType is obligatory!', data);
            return false;
        }

        const RESULT_TYPE = RajFuncData.resultType;
        const LINEAR = RajFuncData.kind.LINEAR;

        if (![RESULT_TYPE.INT, RESULT_TYPE.FLOAT].includes(data.resultType)) {
            errorReport(moduleData.fileName, FUNC, ' Available val of resultType attr : int or float!', data);
            return false;
        }

        if (!isset(data.inputX)) {
            errorReport(moduleData.fileName, FUNC, 'Attr inputX is obligatory!', data);
            return false;
        }

        if (!isNumberFunc(data.inputX)) {
            errorReport(moduleData.fileName, FUNC, 'Attr inputX have to number!', data);
            return false;
        }

        if (!isset(data.kind)) {
            errorReport(moduleData.fileName, FUNC, 'Attr kind is obligatory!', data);
            return false;
        }

        if (data.kind != LINEAR) {
            errorReport(moduleData.fileName, FUNC, 'Only kind linear is supported!', data);
            return false;
        }

        if (!isset(data.pattern)) {
            errorReport(moduleData.fileName, FUNC, 'Attr pattern is obligatory!', data);
            return false;
        }

        if (isset(data.vector)) {
            if (!elementIsArray(data.vector)) {
                errorReport(moduleData.fileName, FUNC, 'Attr vector have to be array e.g [0,0]!', data);
                return false;
            }

            if (!isNumberFunc(data.vector[0]) || !isNumberFunc(data.vector[1])) {
                errorReport(moduleData.fileName, FUNC, 'Attr vector[0] and vector[0] have to be array number!', data);
                return false;
            }

        }

        if (data.kind == LINEAR) {
            if (!isset(data.pattern.a)) {
                errorReport(moduleData.fileName, FUNC, 'Attr pattern.a is obligatory!', data);
                return false;
            }

            if (isset(data.pattern.b)) {

                if (!isNumberFunc(data.pattern.b)) {
                    errorReport(moduleData.fileName, FUNC, 'Attr pattern.b have to number!', data);
                    return false;
                }
            }

            if (!isNumberFunc(data.pattern.a)) {
                errorReport(moduleData.fileName, FUNC, 'Attr pattern.a have to number!', data);
                return false;
            }


        }

        return true;
    };

    const getFuncResult = (data) => {
        let result = {};

        let outputXVarName = RajFuncData.defaultData.outputXVarName;
        let outputYVarName = RajFuncData.defaultData.outputYVarName;
        let vector = [0, 0];
        let patternB = 0;

        let pattern = data.pattern;
        let inputX = data.inputX;


        if (isset(data.outputXVarName)) outputXVarName = data.outputXVarName;
        if (isset(data.outputYVarName)) outputYVarName = data.outputYVarName;
        if (isset(data.pattern.b)) patternB = data.pattern.b;
        if (isset(data.vector)) {
            vector[0] = data.vector[0];
            vector[1] = data.vector[1];
        }


        result[outputXVarName] = data.inputX + vector[0];
        result[outputYVarName] = getYFromLinearFunc(inputX, pattern.a, patternB, vector, data.resultType);

        return result;
    };

    const getYFromLinearFunc = (x, a, b, vector, resultType) => {
        let y = a * x + b;

        y += vector[1];

        const RESULT_TYPE = RajFuncData.resultType;

        switch (resultType) {
            case RESULT_TYPE.INT:
                return Math.round(y);
            case RESULT_TYPE.FLOAT:
                return y;
        }
    };


    this.init = init;
    this.getFuncFullReplaceJson = getFuncFullReplaceJson;
};