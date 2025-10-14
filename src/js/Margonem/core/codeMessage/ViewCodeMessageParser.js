var CodeMessageData = require('@core/codeMessage/CodeMessageData');

module.exports = function() {

    let codeViewList = {};

    function init() {

    }

    function addRecord(id, option = {}) {

        let VIEW_PARAMS = CodeMessageData.CODE_MESSAGE_ATTR.VIEW_PARAMS

        if (!option[VIEW_PARAMS]) return;
        if (!checkSourceExist(option[VIEW_PARAMS])) return;
        if (!checkVisibleKindExist(option[VIEW_PARAMS])) return;

        codeViewList[id] = {
            viewParams: option[VIEW_PARAMS]
        }
    }

    const checkVisibleKindExist = (objectWithAllSources) => {
        for (let oneSourceName in objectWithAllSources) {
            let visibleKind = objectWithAllSources[oneSourceName];

            if (!CodeMessageData.VISIBLE_KIND[visibleKind]) {
                errorReport("ViewCodeMessageParser.js", "checkVisibleKindExist", "VISIBLE_KIND not exist", visibleKind)
                return false;
            }

        }

        return true;
    };

    const getCodeMessageData = (id) => {
        return codeViewList[id] ? codeViewList[id] : null;
    };

    const checkSourceExist = (objectWithAllSources) => {

        if (!lengthObject(objectWithAllSources)) {
            errorReport("ViewCodeMessageParser.js", "checkSourceExist", "Object is empty!");
            return false
        }

        for (let oneSourceName in objectWithAllSources) {

            if (!CodeMessageData.SOURCE[oneSourceName]) {
                errorReport("ViewCodeMessageParser.js", "checkSourceExist", "SOURCE not exist", oneSourceName)
                return false
            }

        }

        return true
    };


    this.init = init;
    this.addRecord = addRecord;
    this.getCodeMessageData = getCodeMessageData;

}