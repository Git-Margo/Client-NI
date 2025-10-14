const Store = require('./Storage');
const tpl = require('./Templates');
module.exports = function() {

    const CSS_THEME_SCRIPT = "CSS_THEME_SCRIPT";
    const CSS_THEME_DATA = "CSS_THEME_DATA";
    const THEME_DATA = "THEME_DATA";
    let cssData = null;
    let wnd = null;

    const init = () => {
        let data = getDataInLocalStorage();

        if (data) {
            setCssData(data);
        }

    };


    const setCssData = (data) => {
        cssData = data;
    };

    const getDataInLocalStorage = () => {
        return Store.easyGet(THEME_DATA, CSS_THEME_DATA)
    }

    const setDataInLocalStorage = (data) => {
        Store.easySet(data, THEME_DATA, CSS_THEME_DATA);
    }

    const updateData = () => {
        if (!cssData) {
            return;
        }

        if (getEngine().hero.d.uprawnienia == 0) {
            return;
        }

        removeStyleScript();
        addStyleScript();
    };

    const removeStyleScript = () => {
        $('.' + CSS_THEME_SCRIPT).remove();
    };

    const addStyleScript = () => {
        let $script = `<style class="${CSS_THEME_SCRIPT}" type="text/css">${cssData}</style>`

        $('head').append($script);
    };

    const setCssDataProcedure = (data) => {
        setDataInLocalStorage(data);
        setCssData(data);
    }

    const createWindow = () => {

        if (wnd) {
            wnd.show();
            return;
        }

        wnd = Engine.windowManager.add({
            content: createContent(),
            nameWindow: "CSS_THEME_LOADER",
            managePosition: {
                x: '251',
                y: '60',
                position: Engine.windowsData.position.RIGHT_POSITIONING
            },
            title: "CSS_THEME_LOADER",
            onclose: () => {
                wnd.hide();
            }
        });

        wnd.addToAlertLayer();

        wnd.center();
        wnd.show();
    }

    const createContent = () => {
        let $content = $(`<div class="CSS_THEME_LOADER"></div>`);

        let $textarea = $('<textarea>').addClass("css-data");

        $textarea.css({
            marginTop: "10px",
            width: "500px",
            height: "500px",
            display: "block"
        });

        if (cssData) {
            $textarea.val(cssData);
        }

        let $button = createButton("SAVE_CSS", ["small"], function() {
            let v = $textarea.val();
            saveNewCssData(v);
        });

        $content.append($button)
        $content.append($textarea)

        return $content
    }

    const saveNewCssData = (v) => {
        setCssDataProcedure(v);
        updateData();
    }

    const clear = () => {
        saveNewCssData(null)
    }

    this.createWindow = createWindow;
    this.setCssDataProcedure = setCssDataProcedure;
    this.updateData = updateData;
    this.clear = clear;
    this.init = init;
}