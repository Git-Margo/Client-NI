module.exports = function() {

    const moduleData = {
        fileName: "SrajStore.js"
    };

    let srajTemplates;


    const init = () => {
        clearSrajTemplates();
    };

    const clearSrajTemplates = () => {
        srajTemplates = {};
    };

    const updateData = (data) => {
        for (let i = 0; i < data.length; i++) {
            let oneData = data[i];

            if (!checkCorrectOneSrajTemplateData(oneData)) {
                continue
            }

            let id = oneData.id;
            let oneSrajTemplate = createOneSrajTemplate(oneData);

            addToSrajTemplates(oneSrajTemplate, id);
        }
    };

    const checkCorrectOneSrajTemplateData = (data) => {

        const FUNC = "checkCorrectSrajTemplateData";

        if (!isset(data.id)) {
            errorReport(moduleData.fileName, FUNC, "Attr id not exist in data", data);
            return false
        }

        if (!isset(data.appear)) {
            errorReport(moduleData.fileName, FUNC, "Attr appear not exist in data", data);
            return false
        }

        if (!isset(data.cancel)) {
            errorReport(moduleData.fileName, FUNC, "Attr cancel not exist in data", data);
            return false
        }

        return true;
    };

    const createOneSrajTemplate = (data) => {
        return {
            id: data.id,
            appear: data.appear,
            cancel: data.cancel
        }
    };

    const addToSrajTemplates = (oneSrajTemplate, id) => {
        srajTemplates[id] = oneSrajTemplate;
    };

    const onClear = () => {
        clearSrajTemplates();
    };

    const checkSrajTemplate = (id) => {
        return srajTemplates[id] ? true : false;
    };

    const getSrajTemplate = (id, kind) => {

        switch (kind) {
            case "APPEAR":
                return srajTemplates[id].appear;
            case "CANCEL":
                return srajTemplates[id].cancel;
            default: {
                errorReport(moduleData.fileName, "getSrajTemplate", "incorrect kind", kind);
                return null;
            }
        }

    };

    this.init = init;
    this.updateData = updateData;
    this.onClear = onClear;
    this.checkSrajTemplate = checkSrajTemplate;
    this.getSrajTemplate = getSrajTemplate



}