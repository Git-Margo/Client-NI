var CodeMessageData = require('core/codeMessage/CodeMessageData');

module.exports = function() {

    let translateList = {};
    let wrapperMessage = {};
    const messageControllerCategory = 'MessageController';

    function init() {

    }

    function createAllInWorkLog() {

        for (let id in translateList) {

            let keyName = getKeyNameTranslateList(id);
            let fullKey = getFullKey(id, keyName);

            _t(fullKey, null, messageControllerCategory);
        }

        for (let id2 in wrapperMessage) {

            let keyName = getKeyNameWrapperMessage(id2);

            _t(keyName, null, messageControllerCategory);
        }
    }

    function getFullKey(id, key) {
        return id + '_' + key;
    }

    function addRecordWrapperMessage(id, keyName) {

        if (wrapperMessage[id]) throw `WRAPPER MESSAGE ID: ${id} ALREADY EXIST! YOU NEED USE ANOTHER!`;

        wrapperMessage[id] = {
            keyName: keyName
        };
    }

    function addRecord(id, keyCodeClientData) {

        if (translateList[id]) throw `MESSAGE ID: ${id} ALREADY EXIST! YOU NEED USE ANOTHER!`;

        let TEXT_PARAMS = CodeMessageData.CODE_MESSAGE_ATTR.TEXT_PARAMS;
        let GROUP_PARAMS_AMOUNT = CodeMessageData.TEXT_MODIFY.GROUP_PARAMS_AMOUNT;
        let NAME = CodeMessageData.CODE_MESSAGE_ATTR.NAME;

        translateList[id] = {
            keyName: keyCodeClientData[NAME],
            groupParamsAmount: keyCodeClientData[TEXT_PARAMS] && isset(keyCodeClientData[TEXT_PARAMS][GROUP_PARAMS_AMOUNT]) ? keyCodeClientData[TEXT_PARAMS][GROUP_PARAMS_AMOUNT] : false
        };
    }

    function getTxt(id, key, params) {

        let str = '';
        let groupParamsAmount = getGroupParamsAmount(id);

        if (params) str = getStrWithParams(id, key, params, groupParamsAmount);
        else str = getStrWithoutParams(id, key);

        return str
    }

    function getFullText(id, params) {
        if (!checkIdOfMessageExist(id)) return null;

        let txt = getTxt(id, getKeyNameTranslateList(id), params);

        return manageMsgWrapper(id, txt);
    }

    function checkStringHasTranslated(id, str) {
        if (!str) {
            let errorStr = `MESSAGE ID: ${id}, not created in workLog OR created and empty OR not updated dictionaries`;

            warningReport("CodeMessageParser.js", "checkStringHasTranslated", errorStr);
            message(errorStr);
        }
    }

    function getGroupParamsAmount(id) {
        return translateList[id].groupParamsAmount;
    }

    function getKeyNameTranslateList(id) {
        return translateList[id].keyName;
    }

    function getKeyNameWrapperMessage(id) {
        return wrapperMessage[id].keyName;
    }

    function getStrWithParams(id, key, params, groupParamsAmount) {

        let str;
        let fullKey = getFullKey(id, key);

        if (groupParamsAmount) {

            str = '';
            for (let i = 0; i < params.length; i += groupParamsAmount) {

                let start = i;
                let end = i + groupParamsAmount;

                let a = params.slice(start, end);
                let obj = createObjectParamsToTLang(a);
                str += tLang(id, fullKey, obj) + '[br]'

            }
        } else {

            let obj = createObjectParamsToTLang(params);
            str = tLang(id, fullKey, obj);

        }

        return str;
    }

    function getStrWithoutParams(id, key) {
        let fullKey = getFullKey(id, key);

        return tLang(id, fullKey);
    }

    function createObjectParamsToTLang(params) {
        let obj = {};

        for (let i = 0; i < params.length; i++) {
            obj[`%params${i}%`] = params[i];
        }

        return obj;
    }

    function tLang(id, key, _params) {

        let params = _params ? _params : null;
        let txt = _t(key, params, messageControllerCategory);

        checkStringHasTranslated(id, txt);

        return txt;
    }

    function getCodeMessageData(idMessage, oneMessageData) {
        const params = oneMessageData['params'];
        const confirm = oneMessageData['confirm'];
        const config = oneMessageData['config'];
        const fullText = getFullText(idMessage, params);

        let o = {
            fullText
        };

        if (config) o.config = config;

        if (!manageMessageExistIsCorrect(idMessage)) return o;
        if (o.fullText == null) return o;

        if (confirm) o.confirm = confirm;

        return o;
    }

    function manageMsgWrapper(id, txt) {

        let msgWrapper = checkIdOfMessageWrapperExist(id);

        if (!msgWrapper) return txt;

        let keyName = getKeyNameWrapperMessage(id);

        return _t(keyName, {
            '%params0%': txt
        }, messageControllerCategory);
    }

    function manageMessageExistIsCorrect(id) {
        if (checkIdOfMessageExist(id)) return true;

        let warningText = `ID: ${id} NOT DECLARED IN CLIENT!`;

        warningReport("CodeMessageWrapper", "manageMessageExistIsCorrect", warningText);
        message(warningText);

        return false;
    }

    function checkIdOfMessageExist(id) {
        return translateList[id]
    }

    function checkIdOfMessageWrapperExist(id) {
        return wrapperMessage[id]
    }

    this.init = init;
    this.addRecord = addRecord;
    this.addRecordWrapperMessage = addRecordWrapperMessage;
    this.getCodeMessageData = getCodeMessageData;
    this.createAllInWorkLog = createAllInWorkLog;

};