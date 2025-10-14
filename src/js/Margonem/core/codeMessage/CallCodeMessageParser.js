var CodeMessageData = require('@core/codeMessage/CodeMessageData');

module.exports = function() {

    let codeCallList = {};
    let moduleData = {
        fileName: "CallCodeMessageParser.js"
    };

    function init() {

    }

    function addRecord(id, option = {}) {
        const CODE_MESSAGE_ATTR = CodeMessageData.CODE_MESSAGE_ATTR;
        const CALL_PARAMS = CODE_MESSAGE_ATTR.CALL_PARAMS;
        //const AFTER_CLIENT_READY_CALL   = CODE_MESSAGE_ATTR.CALL_KIND.AFTER_CLIENT_READY_CALL;

        let callKind = option[CALL_PARAMS];

        if (!callKind) {
            setDefaultCallData(id);
            return
        }

        if (!checkCallKindExist(callKind)) {
            setDefaultCallData(id);
            return;
        }

        setCallData(id, callKind);
    }

    const setDefaultCallData = (id) => {
        const AFTER_CLIENT_READY_CALL = CodeMessageData.CALL_KIND.AFTER_CLIENT_READY_CALL;

        setCallData(id, AFTER_CLIENT_READY_CALL)
    }

    const setCallData = (id, data) => {
        codeCallList[id] = {
            callParams: data
        }
    }

    const checkCallKindExist = (callKind) => {

        if (!CodeMessageData.CALL_KIND[callKind]) {
            errorReport(moduleData.fileName, "checkCallKindExist", "CALL_KIND not exist", callKind)
            return false;
        }


        return true;
    };

    const getCodeMessageData = (id) => {
        return codeCallList[id] ? codeCallList[id] : null;
    };


    this.init = init;
    this.addRecord = addRecord;
    this.getCodeMessageData = getCodeMessageData;

}