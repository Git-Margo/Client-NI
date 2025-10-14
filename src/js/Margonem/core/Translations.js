/**
 * Created by lukasz on 2014-09-30.
 */
import {
    decodeHtmlEntities,
    getAllProfName
} from './HelpersTS';

var _tMessagesQueue = [];
var _tQueueTimeout = null;
var _tDefaultCategory = 'default';
const _dict = __translations;

function _tSend() {
    //$.ajax({
    //	url:'https://work.garmory.pl/messages/add',
    //	type:'post',
    //	data:{messages:_tMessagesQueue}
    //});
    _tMessagesQueue = [];
}

// window.checkTranslateExist = function(name, parameters, category) {
// 	var Dictionary = _l() == 'pl' ? Dictionary_pl : Dictionary_en;
// 	var cat = isset(category) ? category : _tDefaultCategory;
// 	if (isset(Dictionary[cat]) && isset(Dictionary[cat][name])) {
// 		var ret = Dictionary[cat][name];
// 		if (isset(parameters)) {
// 			for (var i in parameters) {
// 				ret = ret.replace(new RegExp(i, 'g'), parameters[i]);
// 			}
// 		}
// 		return ret;
// 	}
// 	return false
// };
/*
function createTranslationsAttrData (ret) {
	let data  = {};
	let vars  = ret.match(/\%(.*?)\%/g);

	for (let k in vars) {
		let split = vars[k].split(':');

		let fullStr  = vars[k];
		let attrName = split[0];

		if (split.length == 1) {

			data[attrName] = {
				fullStr   : fullStr,
				strAttr   : attrName,
				modify    : null
			}

		} else {
			if (split.length > 2) {
				errorReport('Translations','createTranslationsAttrData', 'Only one modify require!', split);
				return
			}

			attrName        = split[0] + '%';
			let modifyName  = split[1].slice(0, -1);

			data[attrName] = {
				fullStr   : fullStr,
				strAttr   : attrName,
				modify    : modifyName
			};

		}

	}

	return data
}
*/


function createTranslationsAttrData(ret, parameters) {
    let data = {};
    //let vars  = ret.match(/\%(.*?)\%/g);

    for (let k in parameters) {
        let isCorrect = checkCorrectParameter(k);
        if (!isCorrect) {
            errorReport('Translations.js', 'createTranslationsAttrData', 'Translations parameter name is incorrect!', k);
            return data
        }
        let parameter = getParams(k);
        let r = new RegExp('\%' + parameter + '(.*?)\%', "g");
        let vars = ret.match(r);

        manageOneAttrData(ret, data, vars);

    }

    return data
}

function checkCorrectParameter(parameter) {
    return parameter[0] == '%' && parameter[parameter.length - 1] == '%'
}

function getParams(parameter) {
    let _str = parameter.substring(0, parameter.length - 1);
    _str = _str.substring(1);

    return _str;
}

function manageOneAttrData(ret, data, vars) {
    for (let k in vars) {
        let split = vars[k].split(':');

        let fullStr = vars[k];
        let attrName = split[0];
        let jsonFromFunc = null;
        let modifyName = null;

        if (split.length == 0) {
            errorReport('Translations', 'manageOneAttrData', 'split error', ret);
            continue;
        }

        if (split.length == 1) {
            addDataAttrName(data, fullStr, attrName, modifyName, jsonFromFunc);
            continue;
        }

        if (split.length > 2) {
            let a = [];
            attrName = split[0] + '%';

            for (let i = 1; i < split.length; i++) {
                a.push(split[i]);
            }

            let aJoin = a.join(':');
            let r = new RegExp('\\(\\{(.*?)\\}\\)%', "g");
            let vars2 = aJoin.match(r);

            if (vars2) {
                let d = vars2[0];
                modifyName = aJoin.replace(d, '');
                d = d.slice(1);
                d = d.replace(')%', '');
                jsonFromFunc = d;
            }
        }

        if (split.length == 2) {
            attrName = split[0] + '%';
            modifyName = split[1].slice(0, -1);
        }

        addDataAttrName(data, fullStr, attrName, modifyName, jsonFromFunc);



    }
}

function addDataAttrName(data, fullStr, strAttr, modify, jsonFromFunc) {
    if (!data[strAttr]) data[strAttr] = [];

    data[strAttr].push({
        fullStr: fullStr,
        strAttr: strAttr,
        modify: modify,
        jsonFromFunc: jsonFromFunc
    });
}

function getNewValAfterModify(val, modify, jsonFromFunc) {
    switch (modify) {
        case 'GET_LEFT':
            return getSecondLeft(val, {
                short: true
            });
        case 'GET_CURRENCY':
            return getCurrency(val);
        case 'GET_SEX':
            return getSex(val);
        case 'GET_PROF':
            return getProfession(val);
        case 'GET_JSON_SWITCH':
            return getJsonSwitch(val, jsonFromFunc);
        case 'ARRAY_PARAM':
            return arrayParams(val);
            // default
    }

    errorReport('Translations', 'getNewValAfterModify', 'Unregistered translations modify:', modify);

    return val;
}

function getJsonSwitch(val, jsonFromFunc) {
    let data;
    try {
        data = JSON.parse(jsonFromFunc);
    } catch (e) {
        errorReport('Translations.js', 'getJsonSwitch', 'Incorrect JSON format!', jsonFromFunc);
        return 'ERROR'
    }

    if (!isset(data[val])) {
        errorReport('Translations.js', 'getJsonSwitch', 'switch option ' + val + ' not exist', data);
        return 'ERROR';
    }

    return data[val];
}

function getCurrency(arrayVal) {
    return arrayParams(arrayVal, (val) => {
        let data = val.split('=');

        if (data.length != 2) {
            errorReport('Translations.js', 'getCurrency', 'Incorrect currency data', val);
            return '';
        }

        let currency = data[0];
        let amount = data[1];

        return amount + ' ' + getCurrencyTextByChar(currency);
    });
}

function getProfession(arrayVal) {
    return arrayParams(arrayVal, (val) => {
        let data = val.split('=');

        if (data.length !== 2) {
            errorReport('Translations.js', 'getProfession', 'Incorrect profession data', val);
            return '';
        }
        let profChar = data[1];

        return getAllProfName(profChar);
    });
}

function getSex(arrayVal) {
    return arrayParams(arrayVal, (val) => {
        let data = val.split('=');

        if (data.length !== 2) {
            errorReport('Translations.js', 'getSex', 'Incorrect sex data', val);
            return '';
        }
        let sexChar = data[1];

        switch (sexChar) {
            case 'm':
                return _t('male');
            case 'f':
                return _t('female');
            default:
                errorReport('Translations.js', 'getSex', 'Incorrect sex data', val);
                return '';
        }
    });
}

function getCurrencyTextByChar(char) {
    switch (char) {
        case 'gold':
        case 'z':
            return _t('cost_gold');
        case 'credits':
        case 's':
            return _t('sl');

        default:
            errorReport('Translations.js', 'getCurrencyTextByChar', 'Currency not exist', char);
            return '';
    }
}

function arrayParams(arrayVal, modifyFunc) {
    let a = arrayVal.split(';');

    if (a.length == 1) return modifyFunc ? modifyFunc(arrayVal) : arrayVal;

    let val = '';

    for (let k in a) {
        let v = a[k];

        val += modifyFunc ? modifyFunc(v) : v;

        let oneBeforeLast = parseInt(k) + 1 == a.length - 1;

        if (oneBeforeLast) val += ' i ';
        else val += ', ';
    }

    val.substring(0, val.length - 2);

    return val.substring(0, val.length - 2);
}

window.getTranslationsWithParameters = function(ret, parameters, damageWrapper) {

    let data = createTranslationsAttrData(ret, parameters);

    for (let attrName in parameters) {
        let newVal;
        let stringToReplace;
        let oneAttrArray = data[attrName];


        if (!oneAttrArray) continue;

        for (let i = 0; i < oneAttrArray.length; i++) {

            let oneAttr = oneAttrArray[i];

            if (oneAttr && oneAttr.modify) {

                let fullStr = oneAttr.fullStr;
                let modify = oneAttr.modify;
                let jsonFromFunc = oneAttr.jsonFromFunc;

                newVal = getNewValAfterModify(parameters[attrName], modify, jsonFromFunc);
                stringToReplace = fullStr;

            } else {
                newVal = parameters[attrName];
                stringToReplace = attrName;
            }

            if (damageWrapper) ret = ret.replace(new RegExp(stringToReplace, 'g'), '<span class="damage">' + newVal + '</span>');
            //else                ret = ret.replace(new RegExp(stringToReplace, 'g'), newVal);
            else ret = ret.replaceAll(stringToReplace, newVal);

        }
    }

    return ret;
};

window._t = function(name, parameters, category) {
    var Dictionary = _dict;
    var cat = isset(category) ? category : _tDefaultCategory;

    if (isset(Dictionary[cat]) && isset(Dictionary[cat][name])) {
        var ret = Dictionary[cat][name];
        if (isset(parameters)) {

            ret = getTranslationsWithParameters(ret, parameters);
            //for (var i in parameters) {
            //	ret = ret.replace(new RegExp(i, 'g'), parameters[i]);
            //}
        }
        return decodeHtmlEntities(ret);
    }
    var alreadySend = false;
    for (var i = 0; i < _tMessagesQueue.length; i++) {
        if (_tMessagesQueue[i].m == name && cat == _tMessagesQueue[i].c) {
            alreadySend = true;
            break;
        }
    }
    if (!alreadySend) {
        _tMessagesQueue.push({
            m: name,
            c: cat
        });
        clearTimeout(_tQueueTimeout);
        _tQueueTimeout = setTimeout(function() {
            _tSend()
        }, 500);
    }
};

window._t2 = function(name, parameters, category) {
    var Dictionary = _dict;
    var cat = isset(category) ? category : _tDefaultCategory;
    if (isset(Dictionary[cat]) && isset(Dictionary[cat][name])) {
        var ret = Dictionary[cat][name];
        if (isset(parameters)) {

            ret = getTranslationsWithParameters(ret, parameters, true);
            //for (var i in parameters) {
            //	ret = ret.replace(new RegExp(i, 'g'), '<span class="damage">' + parameters[i] + '</span>');
            //}
        }
        return decodeHtmlEntities(ret);
    }
    var alreadySend = false;
    for (var i = 0; i < _tMessagesQueue.length; i++) {
        if (_tMessagesQueue[i].m == name && cat == _tMessagesQueue[i].c) {
            alreadySend = true;
            break;
        }
    }
    if (!alreadySend) {
        _tMessagesQueue.push({
            m: name,
            c: cat
        });
        clearTimeout(_tQueueTimeout);
        _tQueueTimeout = setTimeout(function() {
            _tSend()
        }, 500);
    }
};