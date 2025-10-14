module.exports = function() {

    const moduleData = {
        fileName: "RajFullJSONReplacer.js"
    };

    const init = () => {

    };

    const getForFullReplaceJson = (data) => {
        getForParseJson(data)
    };

    const getForParseJson = (data, dataFromParentFor) => {


        for (let k in data) {

            let oneData = data[k];

            if (elementIsObject(oneData)) {

                if (oneData.getFor) {
                    errorReport(moduleData.fileName, "getForParseJson", "BUUUUUUUUUUUG!");
                } else {
                    getForParseJson(data[k], dataFromParentFor);
                }

                continue;
            }

            if (elementIsArray(data[k])) {
                let a = data[k];

                for (let i = 0; i < a.length; i++) {
                    let r = a[i];

                    if (r.getFor) {
                        let arrayFromFor = getFor(r.getFor, dataFromParentFor);

                        a.splice(i, 1);

                        connectArray(a, arrayFromFor, i);

                        i--;
                        i += arrayFromFor.length;

                    } else {
                        getForParseJson(r, dataFromParentFor);
                    }
                }

                continue;
            }

        }

        if (!isset(data.getFor)) return;

    };

    const connectArray = (a, arrayFromFor, index) => {
        for (let i = 0; i < arrayFromFor.length; i++) {
            //a.unshift(arrayFromFor[i]);
            a.splice(index + i, 0, arrayFromFor[i]);
        }
    };

    const breakDeepArray = (arrayWithDeepArrays) => {
        let a = [];

        for (let i = 0; i < arrayWithDeepArrays.length; i++) {
            let oneDeepArray = arrayWithDeepArrays[i];
            for (let j = 0; j < oneDeepArray.length; j++) {
                let oneArray = oneDeepArray[j];
                a.push(oneArray);
            }
        }

        return a;
    }

    const preParseForVars = (data, forVars, index, actualIndexOfForVars, dataFromParentFor) => {
        getForVarParseJson(data, forVars, index, actualIndexOfForVars, dataFromParentFor);
        parseGetMath(data)
    }

    const parseGetMath = (data) => {
        if (!data) return null;

        for (let k in data) {

            let oneData = data[k];

            if (elementIsObject(oneData)) {

                if (oneData.getMath) data[k] = getMath(oneData.getMath);
                else parseGetMath(data);

                continue;
            }


            if (elementIsArray(data[k])) {
                let a = data[k];
                for (let k in a) {
                    parseGetMath(a[k]);
                }

            }
        }

    };

    const getMath = (data) => {
        let mathEval = '';

        let list = data.list;
        let resultType = data.resultType;

        for (let i = 0; i < list.length; i++) {
            let par = list[i];

            let vExist = isset(par.v);
            let aExist = isset(par.a);

            if (vExist && aExist) {
                errorReport(moduleData.fileName, "getMath", "getMath can use v or a!", data);
                return null;
            }

            let p;

            if (isset(par.v)) p = parseNumber(par.v);
            if (isset(par.a)) p = parseAction(par.a);


            //if (isset(par.a)) {
            //    let a = par.a;
            //    p = parseAction(a);
            //
            //    if (takeNextValAction(a)) {
            //        let nextPar = list[i + 1];
            //        let correctData = isset(nextPar) && isset(nextPar.v);
            //        if (!correctData) {
            //            errorReport(moduleData.fileName, "getMath", "next par not exist!")
            //            return 0;
            //        }
            //        p += nextPar.v;
            //
            //        i++;
            //    }
            //
            //    let actionSufix = getActionSufix(par.a);
            //
            //    if (actionSufix) {
            //        p += actionSufix;
            //    }

            if (p == null) return data;

            mathEval += p;

        }

        let value = eval(mathEval);

        switch (resultType) {
            case 'int':
                return Math.round(value);
            case 'float':
                return value;
            default:
                errorReport(moduleData.fileName, "getMath", "icorrect resultType", data);
                return data;
        }
    };

    const parseNumber = (v) => {
        let result = isNumberFunc(v);

        if (!result) {
            errorReport(moduleData.fileName, "parseNumber", "It is not number!", v)
            return null;
        }
        return v;
    };

    const takeNextValAction = (action) => {
        switch (action) {
            case "SIN":
            case "COS":
                return true;
        }
        return false
    }

    const getActionSufix = (action) => {
        switch (action) {
            case "SIN":
            case "COS":
                return ')';
        }
        return null;
    }

    const parseAction = (action) => {
        switch (action) {
            case "*":
                return "*";
            case "+":
                return "+";
            case "-":
                return "-";
            case "/":
                return "/";
            case "(":
                return "(";
            case ")":
                return ")";
                //case "SIN": return "Math.sin(";
                //case "COS": return "Math.cos(";
            case "SIN":
                return "Math.sin";
            case "COS":
                return "Math.cos";

            default: {
                errorReport(moduleData.fileName, "parseAction", "unresigned action", action)
                return null;
            }
        }
    }

    const getFor = (data, dataFromParentFor) => {
        if (!checkCorrectDataGetRandom(data)) return null;

        let a = [];
        let forVars = data.forVars;
        let idPrefix = data.idPrefix;
        let iteration = null;

        if (forVars) iteration = forVars.length;
        else iteration = data.iterations;

        if (!forVars) forVars = [];

        if (!dataFromParentFor) dataFromParentFor = {
            list: []
        };

        for (let i = 0; i < iteration; i++) {
            let dataClone = copyStructure(data.data);

            if (!forVars[i]) {
                forVars[i] = {};
            }

            dataClone.id = idPrefix + i;
            forVars[i].index = i;

            if (data.forVarsEachIteration) {
                let forVarsEachIteration = data.forVarsEachIteration;

                for (let forVarsEachIterationName in forVarsEachIteration) {
                    forVars[i][forVarsEachIterationName] = copyStructure(forVarsEachIteration[forVarsEachIterationName]);
                }
            }


            a.push(dataClone);
        }

        let actualIndexOfForVars = dataFromParentFor.list.length;

        dataFromParentFor.list.push({
            forVars: forVars,
            actualForIndex: 0
        });

        let counter = 0;
        let varsForVars = [];

        for (let k in forVars) {
            varsForVars.push({
                index: counter
            });
            preParseForVars(forVars[k], varsForVars, counter, actualIndexOfForVars, dataFromParentFor);
            counter++;
        }


        let getForInside = data.data.getFor;

        for (let i = 0; i < a.length; i++) {
            let dataClone = a[i];
            let index = forVars[i].index;

            dataFromParentFor.list[actualIndexOfForVars].actualForIndex = index;

            if (getForInside) {
                let asd = getFor(dataClone.getFor, dataFromParentFor);

                for (let j = 0; j < asd.length; j++) {
                    asd[j].id = a[i].id + asd[j].id;
                }

                a[i] = asd;
            } else {
                getForVarParseJson(dataClone, forVars, index, actualIndexOfForVars, dataFromParentFor);
            }


        }

        if (getForInside) a = breakDeepArray(a);


        dataFromParentFor.list.pop();

        return a;
    };

    const getForVarParseJson = (data, forVars, index, actualIndexOfForVars, dataFromParentFor) => {
        for (let k in data) {

            let oneData = data[k];

            if (elementIsObject(oneData)) {

                if (oneData.getForVar) {
                    data[k] = getForVar(oneData, forVars, index, actualIndexOfForVars, dataFromParentFor);
                } else {
                    getForParseJson(data[k], dataFromParentFor);
                    getForVarParseJson(data[k], forVars, index, actualIndexOfForVars, dataFromParentFor);
                }

                continue;
            }

            if (elementIsArray(data[k])) {
                let a = data[k];

                for (let k in a) {
                    if (a[k].getFor) a[k] = getFor(a[k].getFor, dataFromParentFor);
                    getForVarParseJson(a[k], forVars, index, actualIndexOfForVars, dataFromParentFor);
                }

                continue;
            }

        }

        if (!isset(data.getForVar)) return;
    };

    const getForVar = (oneGetForVarData, forVars, index, actualIndexOfForVars, dataFromParentFor) => {
        let key = oneGetForVarData.getForVar;

        if (isset(oneGetForVarData.parent)) {
            let parentKey = oneGetForVarData.parent;
            let parent = dataFromParentFor.list[parentKey];
            let specificIndex = isset(oneGetForVarData.specificIndex) ? oneGetForVarData.specificIndex : parent.actualForIndex;

            return parent.forVars[specificIndex][key];
        }

        return forVars[index][key];
    };

    const checkCorrectDataGetRandom = (data) => {
        return true;
    };

    this.init = init;
    this.getForFullReplaceJson = getForFullReplaceJson;

}