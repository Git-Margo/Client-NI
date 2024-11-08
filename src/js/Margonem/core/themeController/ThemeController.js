let ThemeData = require('core/themeController/ThemeData');
let RajActionManager = require('core/raj/rajAction/RajActionManager');
let RajActionData = require('core/raj/rajAction/RajActionData');

module.exports = function() {

    let moduleData = {
        fileName: "ThemeController.js"
    }

    let eventThemeName = null;
    let cityThemeName = null;

    let eventThemeStyle = null;
    let cityThemeStyle = null;

    let rajActionManager;


    // const THEME_KIND = {
    // 	EVENT : 1,
    // 	CITY  : 2
    // };

    function init() {
        initRajActionsManager();
    }

    const initRajActionsManager = () => {
        rajActionManager = new RajActionManager();

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                clearFunc: clearAction,
                createRequire: {
                    name: {
                        specificVal: ['redscale', 'grayscale', 'bluescale', "neuro"]
                    }
                }
            },
            RajActionData.GROUP_NAME.OVERRIDE_OBJECT
        );
    };


    function addTheme(name, kind) {
        let v = new Date().getTime();
        let href = `https://mwcr.garmory-cdn.cloud/skins/${name}/style.css?v=${v}`;
        let $style = $(`<link rel="stylesheet" type="text/css" href="${href}"></link>`);

        switch (kind) {
            case ThemeData.THEME_KIND.EVENT:
                eventThemeName = name;
                eventThemeStyle = $style;
                break;
            case ThemeData.THEME_KIND.CITY:
                cityThemeName = name;
                cityThemeStyle = $style;
                break;
            default:
                console.error("addTheme: BAD KIND OF THEME", kind)
        }

        $style.appendTo("head");
    }

    function checkThemeExist(kind) {
        switch (kind) {
            case ThemeData.THEME_KIND.EVENT:
                return eventThemeName ? true : false;
            case ThemeData.THEME_KIND.CITY:
                return cityThemeName ? true : false;
            default:
                console.error("checkThemeExist: BAD KIND OF THEME", kind)
        }
    }

    function checkSameTheme(name, kind) {
        switch (kind) {
            case ThemeData.THEME_KIND.EVENT:
                return eventThemeName == name;
            case ThemeData.THEME_KIND.CITY:
                return cityThemeName == name;
            default:
                console.error("checkSameTheme: BAD KIND OF THEME", kind)
        }
    }

    function removeTheme(kind) {
        switch (kind) {
            case ThemeData.THEME_KIND.EVENT:
                eventThemeStyle.remove();
                eventThemeStyle = null;
                eventThemeName = null;
                break;
            case ThemeData.THEME_KIND.CITY:
                cityThemeStyle.remove();
                cityThemeStyle = null;
                cityThemeName = null;
                break;
            default:
                console.error("removeTheme: BAD KIND OF THEME", kind)
        }
    }

    function setDisabledInStyleSheet(name) {

        let styles = document.styleSheets;

        for (let i = 0; i < document.styleSheets.length; i++) {
            if (styles[i].href == `https://mwcr.garmory-cdn.cloud/skins/${name}/style.css`) {
                styles[i].disabled = true;
            }
        }

    }

    function updateData(data, kind) {
        if (!checkCorrectKind(kind)) return;
        if (!checkCorrectData(data)) return;

        //clearTheme(kind);
        //addTheme(data.name, kind)

        rajActionManager.updateData(data, kind);
    }

    const createAction = (data, kind) => {
        clearTheme(kind);
        addTheme(data.name, kind)
    };

    const clearAction = (data, kind) => {
        clearTheme(kind);
    };

    const checkCorrectData = (data) => {
        const FUNC = "checkCorrectData";
        if (!elementIsObject(data)) {
            errorReport(moduleData.fileName, FUNC, "data is not object!", data);
            return false;
        }

        if (data.clear) return true;

        if (!data.name) return false

        return true;
    }

    function checkCorrectKind(kind) {
        for (let k in ThemeData.THEME_KIND) {
            if (ThemeData.THEME_KIND[k] == kind) return true
        }

        errorReport(moduleData.fillName, 'checkCorrectKind', "BAD KIND OF THEME", kind);

        return false
    }

    function clearTheme(kind) {
        if (checkThemeExist(kind)) removeTheme(kind);
    }

    function removeCityThemeIfExist() {
        if (!checkThemeExist(ThemeData.THEME_KIND.CITY)) return;

        removeTheme(ThemeData.THEME_KIND.CITY)
    }

    //function removeEventThemeIfExist () {
    //	if (!checkThemeExist(ThemeData.THEME_KIND.EVENT)) return;
    //
    //	removeTheme(ThemeData.THEME_KIND.EVENT)
    //}


    const onClear = () => {
        clearTheme(ThemeData.THEME_KIND.EVENT);
        clearTheme(ThemeData.THEME_KIND.CITY);
    }

    this.init = init;
    this.updateData = updateData;
    this.onClear = onClear;
    //this.removeCityThemeIfExist 	= removeCityThemeIfExist;
    //this.removeEventThemeIfExist 	= removeEventThemeIfExist;

}