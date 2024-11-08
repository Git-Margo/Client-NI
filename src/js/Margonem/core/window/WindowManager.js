var Window = require('core/window/Window.js');
let LayersData = require('core/interface/LayersData');

module.exports = function() {

    let moduleData = {
        fileName: "WindowManager.js"
    };

    let list = {};
    let layersAttachList = {};
    let widgetLinkedWithWindow = {};

    this.init = () => {
        this.initLayersAttachList();
    };

    this.initLayersAttachList = () => {
        layersAttachList[LayersData.$_ALERTS_LAYER] = {};
        layersAttachList[LayersData.$_M_ALERT_LAYER] = {};
        layersAttachList[LayersData.$_M_ALERT_MOBILE_LAYER] = {};
        layersAttachList[LayersData.$_TUTORIAL_LAYER] = {};
        layersAttachList[LayersData.$_CONSOLE_LAYER] = {};
        layersAttachList[LayersData.$_CAPTCHA_LAYER] = {};
    };

    this.addToAttachLayer = (wnd) => {
        let attachLayerName = wnd.getAttachLayerName();
        let wndId = wnd._idWindow;
        let wndName = wnd._nameWindow;

        if (!layersAttachList[attachLayerName].hasOwnProperty(wndName)) layersAttachList[attachLayerName][wndName] = {};
        layersAttachList[attachLayerName][wndName][wndId] = wnd;
    };

    this.removeElementFromWidgetLinked = (wnd) => {
        let widgetName = wnd.getAttachWidgetName();
        if (!widgetName) return;

        if (!this.checkWidgetIsLinkedToWindow(widgetName)) return

        delete widgetLinkedWithWindow[widgetName];
    };

    this.removeFromAttachLayer = (wnd) => {
        let attachLayerName = wnd.getAttachLayerName();
        let wndId = wnd._idWindow;
        let wndName = wnd._nameWindow;

        delete layersAttachList[attachLayerName][wndName][wndId];

        if (!Object.keys(layersAttachList[attachLayerName][wndName]).length) delete layersAttachList[attachLayerName][wndName];
    };

    this.checkOptIsCorrect = (opt) => {
        if (!opt) {
            console.error('[WindowManager.js, checkOptIsCorrect] ', 'opt object not exist!!');
            return false;
        }

        if (!opt.nameWindow) {
            console.error('[WindowManager.js, checkOptIsCorrect] ', 'par opt.name not exist!!');
            return false;
        }

        if (!opt.content) {
            console.error('[WindowManager.js, checkOptIsCorrect] ', 'par opt.content not exist!!');
            return false;
        }

        return true
    };

    this.manageRegisteredWindow = (name) => {
        if (!Engine.windowsData.name[name]) {
            errorReport(moduleData.fileName, "manageRegisteredWindow", "Window unregistered!", name);
            //console.error('[WindowManager, manageRegisteredWindow] Window unregistered!', name)
        }
    };

    this.checkWindowIsShowByLinkedWidget = (widgetName) => {
        let wnd = this.getWndByLinkedWidgetName(widgetName);

        return wnd.isShow();
    };

    this.checkWindowIsShow = (name) => {
        if (!list[name]) return false;

        return list[name].isShow();
    };

    this.checkWidgetIsLinkedToWindow = (widgetName) => {
        return widgetLinkedWithWindow[widgetName] ? true : false;
    };

    this.getWndByLinkedWidgetName = (widgetName) => {
        let data = widgetLinkedWithWindow[widgetName];
        let wndId = data[0];
        let wndName = data[1];

        return this.getWndByNameAndId(wndName, wndId);
    };

    //this.setWidgetLinkedToWindowClassWindowIsOpen = (widgetName) => {
    //	let wnd = this.getWndByLinkedWidgetName(widgetName);
    //
    //	wnd.manageClassOfWidget(true);
    //};

    this.addElementToWidgetLinkedWithWindow = (nameWindow, idWindow, widgetName) => {
        widgetLinkedWithWindow[widgetName] = [idWindow, nameWindow];
    };

    this.add = (opt) => {

        if (!this.checkOptIsCorrect(opt)) return;

        let name = opt.nameWindow;

        this.manageRegisteredWindow(name);

        let wnd = new Window(opt);
        let exist = this.checkNameWindowExistInList(name);

        if (!exist) this.createNameObjectInList(name);
        let newId = this.getNewIdToWindow(name);

        wnd.init();

        this.addToList(name, newId, wnd);
        this.addIdToWindow(wnd, newId);

        if (opt.widget) {
            this.addElementToWidgetLinkedWithWindow(name, newId, opt.widget)
        }

        if (opt.objParent) {
            this.addNameRefInParentWindow(wnd, opt.nameRefInParent);
            this.addParentToWindow(wnd, opt.objParent);

            opt.objParent[wnd._nameRefInParentWindow] = wnd;
        }
        return wnd;
    };

    this.remove = (name, id) => {
        let wnd = this.getWndByNameAndId(name, id);

        this.removeElementFromWidgetLinked(wnd);
        this.removeFromAttachLayer(wnd);
        this.removeFromList(wnd);
        wnd.$.remove();

        if (wnd.parentWindow) delete(wnd.parentWindow[wnd._nameRefInParentWindow]);
    };

    this.addIdToWindow = (wnd, id) => {
        wnd._idWindow = id;
    };

    //this.addNameToWindow = (wnd, name) => {
    //	wnd._nameWindow = name;
    //};

    this.addParentToWindow = (wnd, parentOfWindow) => {
        wnd.parentWindow = parentOfWindow;
    };

    this.addNameRefInParentWindow = (wnd, nameRefInParent) => {
        wnd._nameRefInParentWindow = nameRefInParent;
    };

    this.checkNameWindowExistInList = (name) => {
        return list.hasOwnProperty(name)
    };

    this.createNameObjectInList = (name) => {
        list[name] = {};
    };

    this.addToList = (name, id, wnd) => {
        list[name][id] = wnd;
    };

    this.getNewIdToWindow = (name) => {
        let id = 0;
        while (list[name].hasOwnProperty(id)) {
            id++;
        }

        return id;
    };

    this.removeFromList = (wnd) => {

        let name = wnd._nameWindow;
        let id = wnd._idWindow;

        delete list[name][id];
        if (!Object.keys(list[name]).length) delete list[name];
    };

    this.getWndByNameAndId = (name, id) => {
        return list[name][id];
    };

    this.getList = () => {
        return list;
    };

    this.updatePosOfWindowsInSpecificLayer = (layerName) => {
        // let layerToUpdate = null;

        if (!LayersData[layerName]) {
            console.error("[WindowManager.js, updatePosOfWindowsInSpecificLayer] Layer name not exist:", layerName);
        }

        let layerToUpdate = layersAttachList[layerName];

        for (let nameWnd in layerToUpdate) {
            let oneNameWndGroup = layerToUpdate[nameWnd];

            for (let idWnd in oneNameWndGroup) {
                oneNameWndGroup[idWnd].updatePos();
            }
        }
    };

    this.getLayersAttachList = () => {
        return layersAttachList;
    };

};