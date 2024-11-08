module.exports = function() {

    let moduleData = {
        fileName: "RajYellowMessage.js"
    };

    const init = () => {

    };

    const updateData = (data) => {
        if (!checkCorrectData(data)) return;

        let list = data.list;

        for (let k in list) {
            let oneData = list[k];

            if (!checkOneCorrectData(oneData)) continue;

            if (!Engine.rajCase.checkFullFillCase(oneData.case)) continue;

            switch (oneData.action) {
                case "CREATE":
                    createRajYellowMessage(oneData);
                    break;

            }
        }
    };

    const checkCorrectData = (data) => {
        if (!data.list) {
            errorReport(moduleData.fileName, "checkCorrectData", "attr list not exist!", data);
            return false;
        }

        if (!elementIsArray(data.list)) {
            errorReport(moduleData.fileName, "checkCorrectData", "attr list have to be array!", data);
            return false;
        }

        return true;
    }

    const checkOneCorrectData = (data) => {
        if (!data.action) {
            errorReport(moduleData.fileName, "checkOneCorrectData", "attr action not exist!", data);
            return false;
        }

        if (data.action != "CREATE") {
            errorReport(moduleData.fileName, "checkOneCorrectData", "undefined action name", data);
            return false;
        }

        if (!data.text) {
            errorReport(moduleData.text, "checkOneCorrectData", "attr text not exist!", data);
            return false;
        }

        return true;
    };

    const createRajYellowMessage = (data) => {
        let text = data.text;
        message(text);
    };

    this.init = init;
    this.updateData = updateData;

}