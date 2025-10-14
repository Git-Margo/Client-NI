let KindOrderData = require('@core/raj/kindOrderObject/KindOrderData');

module.exports = function() {

    const moduleData = {
        fileName: "KindOrder.js"
    };

    let kind;
    let v;
    let minimumOder;

    const init = (_defaultKind, _defaultV, _defaultMinimumOrder) => {
        let _kind = isset(_defaultKind) ? _defaultKind : KindOrderData.KIND.FLOAT_OBJECT;
        //let _kind               = isset(_defaultKind)           ? _defaultKind              : KindOrderData.KIND.MAP_OBJECT;
        let _v = isset(_defaultV) ? _defaultV : KindOrderData.V;
        let _minimumOrder = isset(_defaultMinimumOrder) ? _defaultMinimumOrder : KindOrderData.MINIMUM_ORDER;

        setKind(_kind);
        setV(_v);
        setMinimumOrder(_minimumOrder);
    };

    const setKind = (_kind) => {
        kind = _kind;
    };

    const setV = (_v) => {
        v = _v;
    };

    const setMinimumOrder = (_minimumV) => {
        minimumOder = _minimumV;
    };

    const getOrder = (y) => {
        const KIND = KindOrderData.KIND;
        const _y = !isNumberFunc(y) ? 0 : y;

        switch (kind) {
            case KIND.FLOAT_OBJECT:
                return minimumOder + v;
            case KIND.MAP_OBJECT:
                return _y + v;
            case KIND.GROUND_OBJECT:
                return 0 + v;
        }
    };

    const checkCorrectData = (data) => {
        const FUNC = "checkCorrectData";
        if (!elementIsObject(data)) {
            errorReport(moduleData.fileName, FUNC, "data have to be object", data);
            return false
        }

        if (isset(data.kind)) {
            const KIND = KindOrderData.KIND;
            switch (kind) {
                case KIND.FLOAT_OBJECT:
                case KIND.MAP_OBJECT:
                    break;
                default:
                    errorReport(moduleData.fileName, FUNC, "incorrect kind!", data);
                    return false
            }
        }

        if (isset(data.v)) {
            if (!isNumberFunc(data.v)) {
                errorReport(moduleData.fileName, FUNC, "incorrect kind!", data);
                return false
            }
        }

        return true;

    };

    const setOrderData = (data) => {
        if (isset(data.kind)) {
            setKind(data.kind);
        }

        if (isset(data.v)) {
            setV(data.v);
        }
    };


    this.init = init;
    this.getOrder = getOrder;
    this.setOrderData = setOrderData;
    this.checkCorrectData = checkCorrectData;
};