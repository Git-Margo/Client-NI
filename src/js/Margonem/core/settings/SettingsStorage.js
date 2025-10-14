module.exports = function() {

    const moduleData = {
        fileName: "SettingsStorage.js"
    };
    let settingsData = null;

    let dataToSend = null;

    const init = () => {
        initSettingsData();
        // resetDataToSend();
        initDataToSend();
    };

    const initSettingsData = () => {
        settingsData = {};
    };

    const updateData = (data) => {
        let action = data.action;
        let list = data.list;

        switch (action) {
            case "INIT":
                manageInitAction(list);
                break;
            case "UPDATE_DATA":
                manageUpdateDataAction(list);
                break;
        }
    };

    const manageInitAction = (data) => {
        for (let k in data) {
            let oneData = data[k];
            for (let id in oneData) {

                initOption(id, oneData[id])
            }
        }
    };

    const manageUpdateDataAction = (data) => {
        for (let k in data) {
            let oneData = data[k];
            for (let id in oneData) {
                updateOption(id, oneData[id]);
            }
        }
    };

    const initOption = (id, data) => {
        let isOptionObject = lengthObject(data) > 1;
        let d = data;

        if (!checkOption(id)) {
            createOption(id, isOptionObject);
        }

        if (isOptionObject) {
            for (let key in d) {
                //if (key == "v") {
                //
                //}
                initOptionObjectValue(id, key, d[key]);
            }
        } else {
            initOptionValue(id, d);
        }
    };

    const updateOption = (id, data) => {
        let isOptionObject = lengthObject(data) > 1;
        let v = data.v;
        let d = data;

        if (isOptionObject) {
            for (let key in d) {
                const value = key === "v" ? d[key] : d[key].v;
                updateOptionObjectsValue(id, key, value);
            }
        } else {
            updateOptionValue(id, v);
        }
    };

    const updateOptionObjectsValue = (id, key, v) => {
        let oneOption = getOption(id);

        if (key == 'v') {
            oneOption.d[key] = v;
        } else {
            oneOption.d[key].v = v;
        }
    };

    const updateOptionValue = (id, v) => {
        let oneOption = getOption(id);

        oneOption.d.v = v;
    };

    const initOptionValue = (id, d) => {
        let oneOption = getOption(id);

        oneOption.d = prepareValue(d);
    };

    const prepareValue = (d) => {
        let data = {
            v: d.v
        };

        //if (isset(d.min)) {
        //    data.min = d.min;
        //}
        //
        //if (isset(d.max)) {
        //    data.max = d.max;
        //}

        return data;
    };

    const initOptionObjectValue = (id, key, d) => {
        let oneOption = getOption(id);

        //if (oneOption.d[key]) {
        // errorReport(moduleData.fileName, "initOptionObjectValue", `value id ${id} key ${key} already exist`, d);
        // return
        //
        //}

        if (key == "v") {
            oneOption.d[key] = d;
            return
        }

        oneOption.d[key] = prepareValue(d);
    };

    const createOption = (id, objectOption) => {
        settingsData[id] = {
            id: id,
            d: objectOption ? {} : null,
            //dataType    : null
        };
    };

    const getOption = (id) => {
        return settingsData[id];
    };

    const checkOption = (id) => {
        return settingsData[id] ? true : false;
    };

    //const isObjectValues = (id) => {
    //    return elementIsObject(settingsData[id].d.v);
    //};

    const getValue = (id, key) => {
        const FUNC = "getValue";

        if (!checkOption(id)) {
            errorReport(moduleData.fileName, FUNC, `option ${id} not exist`);
            return null;
        }

        let option = getOption(id);
        let val = null;

        if (key) {

            if (!isset(option.d[key])) {
                errorReport(moduleData.fileName, FUNC, `key ${key} not exist`);
                return null;
            }

            if (key == 'v') {
                val = option.d[key]
            } else {
                val = option.d[key].v
            }

        } else {
            val = option.d.v;
        }

        return val;
    };

    //const getObjectValue = (id, key) => {
    //    const FUNC = "getObjectValue";
    //
    //    if (!checkOption(id)) {
    //        errorReport(moduleData.fileName, FUNC, `option ${id} not exist`);
    //        return null;
    //    }
    //
    //    if (!isObjectValues(id)) {
    //        errorReport(moduleData.fileName, FUNC, `option ${id} is not object value`);
    //        return null;
    //    }
    //
    //    let option = getOption(id);
    //
    //    if (!key) {
    //        errorReport(moduleData.fileName, FUNC, `key is undefined`);
    //        return null;
    //    }
    //
    //    if (!isset(option.d[key])) {
    //        errorReport(moduleData.fileName, FUNC, `key ${key} not exist`);
    //        return null;
    //    }
    //
    //    return option.d[key].v
    //};

    const setDataToSend = (id, key) => {
        // dataToSend = {id : id, key : key }
        dataToSend.push({
            id: id,
            key: key
        });
    }

    const initDataToSend = () => {
        dataToSend = [];
    }

    // const resetDataToSend = () => {
    //   dataToSend = null;
    // }

    const removeFirstElementFromDataToSend = () => {
        if (!dataToSend.length) {
            return;
        }
        deleteElementFromArray(0, dataToSend)
    }

    const getDataToSend = () => {
        if (dataToSend.length) {
            return dataToSend[0]
        } else {
            return null;
        }

    }

    const sendRequest = (id, key, val) => {
        let req;

        val = prepareVal(val)

        if (!key) {
            req = `settings&action=update&id=${id}&v=${val}`;

            setDataToSend(id, null);

        } else {

            setDataToSend(id, key);

            if (key == "v") { // EXCEPTION!!!!!!!!!!!!!!!!!!!!!!!!!!!
                req = `settings&action=update&id=${id}&v=${val}`;
            } else {
                req = `settings&action=update&id=${id}&key=${key}&v=${val}`;
            }

        }

        _g(req);
    };

    const prepareVal = (val) => {
        if (val == true) return 1;
        if (val == false) return 0;

        return val
    }

    this.init = init;
    this.updateData = updateData;
    this.getValue = getValue;
    //this.getObjectValue = getObjectValue;
    this.sendRequest = sendRequest;
    this.getDataToSend = getDataToSend;
    // this.resetDataToSend    = resetDataToSend;
    this.removeFirstElementFromDataToSend = removeFirstElementFromDataToSend;

};