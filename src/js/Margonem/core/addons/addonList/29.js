const Checkbox = require('../../components/Checkbox');
const InputMaskData = require('@core/InputMaskData');

module.exports = function() {

    const
        addonKey = 'addon_29',
        addonName = _t('window_mode'),
        moduleData = {
            fileName: "29.js"
        },
        OUTSIDE_CHAT_MODE_CL = 'outside-chat-mode',
        STORAGE_BACKGROUND_OPT = "backgroundOpt",
        STORAGE_BACKGROUND_OPACITY_OPT = "backgroundOpacityOpt",
        STORAGE_BACKGROUND_SCALE_VAL = "backgroundScaleVal",
        STORAGE_RESOLUTION_OPT = "resolutionOpt",
        STORAGE_OUTSIDE_CHAT_MODE = "outsideChatMode",
        STORAGE_WORKS = "works",
        STORAGE_PLAYER_BACKGROUND_OBJECT = "playerBackgroundObject",
        FIRST_POSSIBLE_ID_OF_PLAYER_BACKGROUND = 100;


    let running = false,
        hwnd = null,
        resolutionKeyArray = null,
        defaultBackgroundObject = null,
        playerBackgroundObject = null,
        //mixBackgroundArray          = null,
        works = null,
        outsideChatMode = null,
        defaultOutsideChatMode = false,
        resolutionOpt = null,
        backgroundOpt = null,
        backgroundScaleVal = null,
        backgroundOpacityOpt = null,
        defaultResolutionOpt = 0,
        defaultBackgroundOpt = 0,
        defaultBackgroundOpacityOpt = 10,
        defaultBackgroundScaleVal = 1,
        defaultPlayerBackgroundObject = {},
        $content = null,
        $windowModeBackgroundLayer = null,
        $resolutionMenu = null,
        $backgroundMenu = null,
        $visibleMenu = null,
        $configPanel = null,
        $scaleInputWrapper = null,
        outsideChatCheckBox = null;

    const initConfigPanel = () => {
        $configPanel = $content.find('.config-panel');
    };

    const initResolutionMenu = () => {
        const engine = getEngine();
        const DATA = engine.ResolutionData.DATA;
        const RES = engine.ResolutionData.RES;
        const DEFAULT = engine.ResolutionData.KEY._DEFAULT;
        const menu = [];

        $resolutionMenu = $content.find('.resolution-menu-wrapper');

        for (let i = 0; i < resolutionKeyArray.length; i++) {
            let keyOpt = resolutionKeyArray[i];
            let resText = RES[keyOpt];
            let data = DATA[keyOpt];
            let e = {
                text: resText,
                val: i
            };

            if (keyOpt == DEFAULT || window.innerWidth > data.w && window.innerHeight > data.h) {} else {
                e.blockClick = true;
                e.tip = _t('disbled', null, 'clan');
            }

            if (i == 0) e.text = _t("default", null, "default");

            menu.push(e);
        }

        $resolutionMenu.createMenu(menu, false, function(e) {
            setResolutionOpt(e);
            setResolutionOptData(e);
            updateWindowMode();
            //updateOutsideChatMode();
        });

        $resolutionMenu.setOptionWithoutCallbackByValue(resolutionOpt)
    };

    const initBackgroundMenu = () => {
        let engine = getEngine();
        let menu = [];

        let menuToAddAndRemove = [];

        $backgroundMenu = $content.find('.background-menu-wrapper').empty();


        for (let i in defaultBackgroundObject) {
            let e = defaultBackgroundObject[i];

            let o = {
                text: e.text,
                val: e.id,
                tip: e.link,
                id: e.id
            };

            menu.push(o);
        }

        for (let i in playerBackgroundObject) {
            let e = playerBackgroundObject[i];

            let o = {
                val: e.id,
                tip: e.link,
                id: e.id
            };

            menuToAddAndRemove.push(o);
        }

        let createMenuAddNewOption = {
            addItemConfirmText: _t("give_link", null, addonKey),
            removeItemConfirmText: (val) => _t("sure_remove", null, addonKey),
            addTipText: _t("new_background", null, addonKey),
            menuToAddAndRemove: menuToAddAndRemove,
            configAddItemIdAndName: {
                nameFromInputVal: false,
                namePrefix: _t("own", null, addonKey) + " ",
                firstPossibleId: FIRST_POSSIBLE_ID_OF_PLAYER_BACKGROUND,
                showFirstPossibleIdUserFriendly: true
            },
            autoSelect: true,
            addItemConfirmValidate: function(val) {
                return true
            },
            addItemConfirmClb: (data) => {
                addBackground(data.val, data.id);
            },
            removeItemConfirmClb: (data) => {
                removeBackground(data.id);
            }
        };

        let options = {
            addNewOption: createMenuAddNewOption
        }


        $backgroundMenu.createMenu(menu, false, function(e) {
            //if (e == "NEW_BACKGROUND") {
            //    //console.log('CLICK +');
            //    confirmWitchTextInput(_t("give_link", null, addonKey), (val) => {
            //        addBackground(val);
            //
            //    }, 100);
            //    return;
            //}

            setBackgroundOpt(e);
            setBackgroundOptData(e);
            updateBackgroundUrl();

        }, options);

        //$backgroundMenu.setOptionWithoutCallbackByValue(resolutionOpt)
        $backgroundMenu.setOptionWithoutCallbackByValue(backgroundOpt)
    };

    const initVisibleMenu = () => {
        let engine = getEngine();
        let menu = [];


        $visibleMenu = $content.find('.visible-menu-wrapper').empty();


        for (let i = 0; i < 11; i++) {

            let v = i / 10;

            let o = {
                text: v,
                val: i
            };

            menu.push(o);
        }


        $visibleMenu.createMenu(menu, false, function(e) {

            setBackgroundOpacityOpt(e);
            setBackgroundOpacityOptData(e);

            updateBackgroundOpacity();
        });

        $visibleMenu.setOptionWithoutCallbackByValue(backgroundOpacityOpt)
    };

    const getRemoveCallbackToNewBackground = (e) => {
        confirmWithCallback({
            msg: _t("sure_remove", null, addonKey) + " " + e.text,
            clb: () => {
                delete playerBackgroundObject[e.id];
                updatePlayerBackgroundObject(copyStructure(playerBackgroundObject));
            }
        });
    };

    const addBackground = (link, newId) => {
        //let o = {};
        //for (let k in playerBackgroundObject) {
        //    let id = playerBackgroundObject[k].id;
        //    o[id] = true;
        //}

        //let newId = getFreeIdOfObject(o, FIRST_POSSIBLE_ID_OF_PLAYER_BACKGROUND);

        //let link = "https://micc.garmory-cdn.cloud/obrazki/battle/m11.jpg";
        //let link = "https://micc.garmory-cdn.cloud/obrazki/battle/m15.jpg";

        playerBackgroundObject[newId] = {
            id: newId,
            link: link
        };


        //setPlayerBackgroundObjectData(copyStructure(playerBackgroundObject));
        //
        //let playerBackgroundObjectData  = getPlayerBackgroundObjectData();
        //
        //if (!checkPlayerBackgroundObjectData(playerBackgroundObjectData)) {
        //    playerBackgroundObjectData = defaultPlayerBackgroundObject;
        //    errorReport(moduleData.fileName, "initData", "playerBackgroundArrayData data is not correct!", playerBackgroundObjectData);
        //}
        //
        //setPlayerBackgroundObject(playerBackgroundObjectData);
        //
        //
        //updateMixBackgroundArray();
        //initBackgroundMenu();

        updatePlayerBackgroundObject(copyStructure(playerBackgroundObject));
    }

    const removeBackground = (id) => {
        if (!playerBackgroundObject[id]) {
            errorReport(moduleData.fileName, "removeBackground", `element ${id} not exist!`, playerBackgroundObject);
            return
        }

        delete playerBackgroundObject[id];

        updatePlayerBackgroundObject(copyStructure(playerBackgroundObject));
    }

    const updatePlayerBackgroundObject = (newPlayerBackgroundObject) => {
        setPlayerBackgroundObjectData(newPlayerBackgroundObject);

        let playerBackgroundObjectData = getPlayerBackgroundObjectData();

        if (!checkPlayerBackgroundObjectData(playerBackgroundObjectData)) {
            playerBackgroundObjectData = defaultPlayerBackgroundObject;
            errorReport(moduleData.fileName, "updatePlayerBackgroundObject", "playerBackgroundArrayData data is not correct!", playerBackgroundObjectData);
        }

        setPlayerBackgroundObject(playerBackgroundObjectData);

        //updateMixBackgroundArray();
        //initBackgroundMenu();
    }

    const updateDisplayConfigPanel = () => {
        //let display = works ? "block": "none";

        if (works) $configPanel.addClass("window-mode-active")
        else $configPanel.removeClass("window-mode-active")

        //$configPanel.css('display', display);
    };

    const initTurnOnWindowModeCheckBox = () => {
        const checkbox = new Checkbox.default({
                name: `asd`,
                label: _t("turn_on_window_mode"),
                value: `asd`,
                i: 0,
                checked: works ? true : false,
                highlight: false
            },
            (state) => {
                clickWindowModeCheckbox(state);
            }
        ).getCheckbox();

        $content.find('.main-checkBox-wrapper').append($(checkbox));
    };

    const initTurnOnOutsideChatCheckBox = () => {
        outsideChatCheckBox = new Checkbox.default({
                name: `asd2`,
                //label: "TURN ON",
                label: "OUTSIDE_CHAT_MODE",
                value: `asd2`,
                i: 0,
                checked: outsideChatMode ? true : false
            },
            (state) => {
                clickOutsideChatModeCheckbox(state);
            }
        );

        $content.find('.outside-chat-mode-checkBox-wrapper').append($(outsideChatCheckBox.getCheckbox()));
    };

    const clickWindowModeCheckbox = (state) => {
        setWorks(state);
        setWorksData(state);
        updateDisplayConfigPanel();

        if (state) return;

        setResolutionOpt(defaultResolutionOpt);
        setResolutionOptData(defaultResolutionOpt);

        setOutsideChatMode(defaultOutsideChatMode);
        setOutsideChatModeData(defaultOutsideChatMode);

        setBackgroundOpt(defaultBackgroundOpt);
        setBackgroundOptData(defaultBackgroundOpt);

        updateWindowMode();
        //updateOutsideChatMode();
        $resolutionMenu.setFirst();
        $backgroundMenu.setFirst();
        //outsideChatCheckBox.setChecked(false);
    };

    const clickOutsideChatModeCheckbox = (state) => {
        setOutsideChatMode(state);
        setOutsideChatModeData(state);

        updateWindowMode();
        //updateOutsideChatMode();
    };

    const updateOutsideChatMode = () => {
        let $body = $('body');

        if (outsideChatMode) $body.addClass(OUTSIDE_CHAT_MODE_CL);
        else $body.removeClass(OUTSIDE_CHAT_MODE_CL);
    };

    function initWindow() {

        hwnd = Engine.windowManager.add({
            content: $content,
            title: addonName,
            nameWindow: addonKey,
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            managePosition: {
                'x': 251,
                'y': 60
            },
            onclose: () => {
                close();
            }
        });

        close();
        hwnd.updatePos();
        hwnd.addToAlertLayer();
        hwnd.addClass(addonKey + "-wnd");
    }

    this.start = function() {
        if (running) return;

        running = true;
        initResolutionOptArray();
        initDefaultBackgroundOptObject();
        initData();
        initContent();
        addStyles();
        initWindow();

        updateDisplayConfigPanel();

        if (works && resolutionOpt != defaultResolutionOpt) {
            updateWindowMode();
            //updateOutsideChatMode();
        }
    };

    const getMixBackgroundArray = () => {
        let mixBackgroundArray = [];

        for (let i in defaultBackgroundObject) {
            let e = defaultBackgroundObject[i];
            mixBackgroundArray.push({
                text: e.text,
                val: e.id,
                tip: e.link,
                id: e.id,
                link: e.link
            });
        }

        for (let i in playerBackgroundObject) {
            let e = playerBackgroundObject[i];
            mixBackgroundArray.push({
                text: e.text,
                val: e.id,
                tip: e.link,
                id: e.id,
                link: e.link
            });
        }

        return mixBackgroundArray;
    }

    const updateBackgroundUrl = () => {

        let mixBackgroundArray = getMixBackgroundArray();

        for (let k in mixBackgroundArray) {
            let e = mixBackgroundArray[k];
            let id = e.id;
            let link = e.link;

            if (id != backgroundOpt) continue;

            let v = null;
            if (link == "") v = "none";
            else v = `url("${e.link}") no-repeat center center`;

            $windowModeBackgroundLayer.css('background', v);
            return;
        }

        errorReport(moduleData.fileName, "updateBackgroundUrl", "id not find!", backgroundOpt);

        $windowModeBackgroundLayer.css('background', "none");
    };

    const updateBackgroundScale = () => {
        $windowModeBackgroundLayer.css('transform', `scale(${backgroundScaleVal})`);
    };

    const updateBackgroundOpacity = () => {
        $windowModeBackgroundLayer.css('opacity', getOpacityFromBackgroundOpacityOpt(backgroundOpacityOpt));
    };

    const getOpacityFromBackgroundOpacityOpt = (_backgroundOpacityOpt) => {
        return _backgroundOpacityOpt / 10;
    };

    const initContent = () => {
        $content = getContent();

        initWindowModeBackgroundLayer();
        initTurnOnWindowModeCheckBox();
        initConfigPanel();
        initResolutionMenu();
        initBackgroundMenu();
        initVisibleMenu();
        initScaleInput();
        //initTurnOnOutsideChatCheckBox();
    };

    const initScaleInput = () => {

        $scaleInputWrapper = $content.find('.scale-input-wrapper').empty();

        let $input = createNiInput({
            cl: 'asdasd',
            type: InputMaskData.TYPE.NUMBER_FLOAT,
            tipClearClb: _t("reset", null, "ah_filter_history"),
            keyUpClb: (val, e) => {
                updateInput(val, e)
            },
            focusoutClb: () => {
                saveScaleFromInput($scaleInputWrapper.find('input').val())
            },
            clearClb: () => {
                setDefaultBackgroundScale()
            }
        });

        setBackgroundScaleVal(backgroundScaleVal);

        $input.find('input').val(backgroundScaleVal);

        $scaleInputWrapper.append($input);
    };

    const setDefaultBackgroundScale = () => {
        $scaleInputWrapper.find('input').val(defaultBackgroundScaleVal);
        saveScaleFromInput(defaultBackgroundScaleVal);
    };

    const updateInput = (val, e) => {
        if (e.originalEvent.key == "Enter") saveScaleFromInput(val);
    };

    const saveScaleFromInput = (val) => {
        setBackgroundScaleVal(val);
        setBackgroundScaleValData(val);

        updateBackgroundScale(val)
    };

    const initWindowModeBackgroundLayer = () => {
        $windowModeBackgroundLayer = $('<div>').addClass('window-mode-background-layer layer');

        getEngine().interface.get$gameWindowPositioner().prepend($windowModeBackgroundLayer);
    };

    const initData = () => {
        const FUNC = "initData"
        let worksData = getWorksData();
        let resolutionData = getResolutionOptData();
        let backgroundOpacityData = getBackgroundOpacityOptData();
        let backgroundScaleData = getBackgroundScaleValData();
        let backgroundData = getBackgroundOptData();
        let playerBackgroundObjectData = getPlayerBackgroundObjectData();
        let outsideChatModeData = getOutsideChatModeData();

        if (!checkWorksData(worksData)) {
            worksData = false;
            errorReport(moduleData.fileName, FUNC, "init worksData is not correct!");
        }

        setWorks(worksData);

        if (!checkPlayerBackgroundObjectData(playerBackgroundObjectData)) {
            playerBackgroundObjectData = defaultPlayerBackgroundObject;
            errorReport(moduleData.fileName, FUNC, "playerBackgroundArrayData data is not correct!", playerBackgroundObjectData);
        }

        setPlayerBackgroundObject(playerBackgroundObjectData);

        //updateMixBackgroundArray();

        if (!checkResolutionData(resolutionData)) {
            resolutionData = defaultResolutionOpt;
            errorReport(moduleData.fileName, FUNC, "resolutionData data is not correct!", resolutionData);
        }

        setResolutionOpt(resolutionData);

        if (!checkBackgroundOpacityData(backgroundOpacityData)) {
            backgroundOpacityData = defaultBackgroundOpacityOpt;
            errorReport(moduleData.fileName, FUNC, "backgroundOpacityData data is not correct!", backgroundOpacityData);
        }

        setBackgroundOpacityOpt(backgroundOpacityData);

        if (!checkBackgroundData(backgroundData)) {
            backgroundData = defaultBackgroundOpt;
            errorReport(moduleData.fileName, FUNC, "backgroundData data is not correct!", backgroundData);
        }

        setBackgroundOpt(backgroundData);

        if (!checkBackgroundScaleData(backgroundScaleData)) {
            errorReport(moduleData.fileName, FUNC, "backgroundData data is not correct!", backgroundScaleData);
            backgroundScaleData = defaultBackgroundScaleVal;
        }

        setBackgroundScaleVal(backgroundScaleData);

        if (!checkOutsideChatModeData(outsideChatModeData)) {
            outsideChatModeData = defaultOutsideChatMode;
            errorReport(moduleData.fileName, FUNC, "init outsideChatModeData is not correct!", outsideChatModeData);
        }

        setOutsideChatMode(outsideChatModeData);
    };

    const checkPlayerBackgroundObjectData = (playerBackgroundObjectData) => {
        if (!elementIsObject(playerBackgroundObjectData)) return false;

        for (let k in playerBackgroundObjectData) {
            let e = playerBackgroundObjectData[k];

            if (!isset(e.id)) return false;
            if (!isset(e.link)) return false;

            if (!isInt(e.id)) return false;

            if (e.id < FIRST_POSSIBLE_ID_OF_PLAYER_BACKGROUND) return false;
        }

        return true;
    }

    const checkWorksData = (_worksData) => {
        if (_worksData === true) return true;
        if (_worksData === false) return true;
        if (_worksData == undefined) return true;

        return false;
    }

    const checkOutsideChatModeData = (_outsideChatModeData) => {
        if (_outsideChatModeData === true) return true;
        if (_outsideChatModeData === false) return true;
        if (_outsideChatModeData == undefined) return true;

        return false;
    }

    const checkResolutionData = (_resolutionData) => {
        if (!isInt(_resolutionData)) return false;

        if (_resolutionData > resolutionKeyArray.length - 1) return false;

        return true;
    }

    const checkBackgroundOpacityData = (_backgroundOpacityData) => {
        if (!isNumberFunc(_backgroundOpacityData)) return false;

        if (_backgroundOpacityData < 0 || _backgroundOpacityData > 10) return false;

        return true;
    }

    const checkBackgroundData = (_backgroundOptData) => {
        let mixBackgroundArray = getMixBackgroundArray();

        for (let k in mixBackgroundArray) {
            let id = mixBackgroundArray[k].id;

            if (id == _backgroundOptData) return true;
        }

        return false;
    }

    const checkBackgroundScaleData = (_backgroundScaleData) => {
        if (!isNumberFunc(_backgroundScaleData)) return false;

        if (_backgroundScaleData < 0 || _backgroundScaleData > 100) return false;

        return true;
    }

    const setWorks = (_works) => {
        works = _works;
    };

    const setOutsideChatMode = (_outsideChatMode) => {
        outsideChatMode = _outsideChatMode;
    };

    const setResolutionOpt = (_resolutionOpt) => {
        resolutionOpt = _resolutionOpt;
    };

    const setBackgroundOpacityOpt = (_backgroundOpacityOpt) => {
        backgroundOpacityOpt = _backgroundOpacityOpt;
    };

    const setBackgroundOpt = (_backgroundOpt) => {
        backgroundOpt = _backgroundOpt;
    }

    const setBackgroundScaleVal = (_backgroundScaleVal) => {
        backgroundScaleVal = _backgroundScaleVal;
    }

    const setPlayerBackgroundObject = (_playerBackgroundObject) => {
        playerBackgroundObject = {};

        for (let k in _playerBackgroundObject) {
            playerBackgroundObject[k] = _playerBackgroundObject[k];
        }
    };

    const initResolutionOptArray = () => {
        const KEY = Engine.ResolutionData.KEY;
        resolutionKeyArray = [
            KEY._DEFAULT,
            KEY._920_X_555,
            KEY._1173_X_555,
            KEY._1200_X_675,
            KEY._1253_X_675,
            KEY._1024_X_768,
            KEY._1277_X_768,
            KEY._1366_X_768,
            KEY._1619_X_768,
            KEY._1600_X_900,
            KEY._1853_X_900,
            KEY._1920_X_1080
        ]
    };

    const initDefaultBackgroundOptObject = () => {
        let a_vpath = CFG.a_vpath;

        defaultBackgroundObject = {
            0: {
                id: 0,
                text: _t("empty", null, addonKey),
                link: ""
            },
            1: {
                id: 1,
                text: isPl() ? "Smocza Twierdza" : "Dragon Fortress",
                link: a_vpath + "/windowModeBackground/smoczatwierdza.png"
            },
            2: {
                id: 2,
                text: isPl() ? "Wioska Rybacka" : "Fishing Village",
                link: a_vpath + "/windowModeBackground/wioskarybacka.png"
            },
            3: {
                id: 3,
                text: isPl() ? "Skalne KrÃ³lestwo" : "Rocky Kingdom",
                link: a_vpath + "/windowModeBackground/skalnekrolewstwo.png"
            },
            4: {
                id: 4,
                text: isPl() ? "Å»niwa" : "Harvest",
                link: a_vpath + "/windowModeBackground/zniwa.png"
            },
            5: {
                id: 5,
                text: isPl() ? "Retrospekcja" : "Retrospection",
                link: a_vpath + "/windowModeBackground/retrospekcja.png"
            },
            6: {
                id: 6,
                text: isPl() ? "GorÄce Piaski" : "Hot Sands",
                link: a_vpath + "/windowModeBackground/goracepiaski.png"
            },
            7: {
                id: 7,
                text: isPl() ? "Miasto" : "City",
                link: a_vpath + "/windowModeBackground/miasto.png"
            },
            8: {
                id: 8,
                text: isPl() ? "Stara Mapa" : "Old Map",
                link: a_vpath + "/windowModeBackground/staramapa.png"
            },
            9: {
                id: 9,
                text: isPl() ? "PodnÃ³Å¼e GÃ³ry" : "Mountain Base",
                link: a_vpath + "/windowModeBackground/podnozegory.png"
            },
            10: {
                id: 10,
                text: isPl() ? "Fatamorgana" : "Mirage",
                link: a_vpath + "/windowModeBackground/fatamorgana.png"
            }
        };

    };

    this.stop = function() {
        if (!running) return;
        running = false;

        setResolutionInClientComponentsByOpt(getEngine().ResolutionData.KEY._DEFAULT);
        setResolution();

        removeWindow();
        removeStyles();
        //API.Storage.remove(addonKey);
    };

    function setResolution() {
        let engine = getEngine();
        let resolutionKey = engine.resolution.getResolutionKey();
        let resolutionData = engine.resolution.getResolutionData();
        let css = null;

        if (resolutionKey == Engine.ResolutionData.KEY._DEFAULT) {
            css = {
                position: "absolute",
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                "margin-left": '0px',
                "margin-top": '0px'
            }
        } else {
            let w = resolutionData.w;
            let h = resolutionData.h;
            css = {
                position: "absolute",
                width: w + 'px',
                height: h + 'px',
                left: "50%",
                top: "50%",
                "margin-left": (-w / 2) + 'px',
                "margin-top": (-h / 2) + 'px'
            }
        }

        engine.interface.get$interfaceLayer().css(copyStructure(css));
        engine.interface.get$dropToDeleteWidgetLayer().css(copyStructure(css));
        //engine.widgetManager.resizeAllEmptySlotWidget();
        engine.widgetManager.resizeAllWidgetInAddons();
        engine.widgetManager.resizeAllWidgetInSettings();
        engine.widgetManager.rebuildWidgetButtons();
        engine.onResize();
    }

    function removeWindow() {
        hwnd.remove();
        hwnd = null;
    }

    function addStyles() {
        const styleEl = stringToHtml(style());
        document.head.appendChild(styleEl);
    }

    function removeStyles() {
        const styleEl = document.getElementById(`${addonKey}-style`);
        if (styleEl) {
            styleEl.parentNode.removeChild(styleEl);
        }
    }

    function updateWindowMode() {
        let opt = resolutionKeyArray[resolutionOpt];

        updateOutsideChatMode();
        updateBackgroundUrl();
        updateBackgroundOpacity();
        updateBackgroundScale();

        setResolutionInClientComponentsByOpt(opt);
        setResolution();
    }

    function setResolutionInClientComponentsByOpt(opt) {
        const RESOLUTION_DATA = Engine.ResolutionData;
        const engine = getEngine();

        //engine.widgetManager.setWidgetSize(RESOLUTION_DATA.WIDGET_SIZE_BY_RES[opt]);
        engine.widgetManager.updateWidgetSizeByResolution(opt);
        engine.resolution.setResolution(opt);
    }

    //function updateMixBackgroundArray () {
    //    mixBackgroundArray = [];
    //
    //    for (let k in defaultBackgroundObject) {
    //        let e = defaultBackgroundObject[k];
    //
    //        addRecordToMixBackgroundArray(e.id, e.text, true, e.link);
    //    }
    //
    //    for (let k in playerBackgroundObject) {
    //        let e       = playerBackgroundObject[k];
    //        let id      = e.id;
    //        //let text    = _t("own", null, addonKey) + " " + (id - 99);
    //        let text    = _t("own", null, addonKey) + " " + id;
    //
    //        addRecordToMixBackgroundArray(id, text, false, e.link);
    //    }
    //}

    //function addRecordToMixBackgroundArray (id, text, defaultBck, link) {
    //    mixBackgroundArray.push({
    //        id      : id,
    //        text    : text,
    //        default : defaultBck,
    //        link    : link
    //    });
    //}

    function open() {
        hwnd.show();
        hwnd.setWndOnPeak();
    }

    function close() {
        hwnd.hide();
    }

    this.manageVisible = function() {
        if (!hwnd.isShow()) open();
        else close();
    };

    const getWorksData = () => {
        return API.Storage.get(addonKey + "/" + STORAGE_WORKS, false);
    };

    const getResolutionOptData = () => {
        return API.Storage.get(addonKey + "/" + STORAGE_RESOLUTION_OPT, defaultResolutionOpt);
    };

    const getBackgroundOptData = () => {
        return API.Storage.get(addonKey + "/" + STORAGE_BACKGROUND_OPT, defaultBackgroundOpt);
    };

    const getBackgroundOpacityOptData = () => {
        return API.Storage.get(addonKey + "/" + STORAGE_BACKGROUND_OPACITY_OPT, defaultBackgroundOpacityOpt);
    };

    const getBackgroundScaleValData = () => {
        return API.Storage.get(addonKey + "/" + STORAGE_BACKGROUND_SCALE_VAL, defaultBackgroundScaleVal);
    };

    const setBackgroundOpacityOptData = (_backgroundOpacityOpt) => {
        API.Storage.set(addonKey + "/" + STORAGE_BACKGROUND_OPACITY_OPT, _backgroundOpacityOpt);
    };

    const setBackgroundScaleValData = (_backgroundScaleVal) => {
        API.Storage.set(addonKey + "/" + STORAGE_BACKGROUND_SCALE_VAL, _backgroundScaleVal);
    };

    const getPlayerBackgroundObjectData = () => {
        return API.Storage.get(addonKey + "/" + STORAGE_PLAYER_BACKGROUND_OBJECT, defaultPlayerBackgroundObject);
    };

    const setPlayerBackgroundObjectData = (_playerBackgroundObject) => {
        API.Storage.set(addonKey + "/" + STORAGE_PLAYER_BACKGROUND_OBJECT, _playerBackgroundObject);
    };

    const setWorksData = (_works) => {
        API.Storage.set(addonKey + "/" + STORAGE_WORKS, _works);
    };

    const setOutsideChatModeData = (_outsideChatModeData) => {
        API.Storage.set(addonKey + "/" + STORAGE_OUTSIDE_CHAT_MODE, _outsideChatModeData);
    };

    const getOutsideChatModeData = () => {
        return API.Storage.get(addonKey + "/" + STORAGE_OUTSIDE_CHAT_MODE, defaultOutsideChatMode);
    };

    const setResolutionOptData = (_resolutionOpt) => {
        API.Storage.set(addonKey + "/" + STORAGE_RESOLUTION_OPT, _resolutionOpt);
    };

    const setBackgroundOptData = (_backgroundOpt) => {
        API.Storage.set(addonKey + "/" + STORAGE_BACKGROUND_OPT, _backgroundOpt);
    };

    const getContent = () => {
        return $(`
            <div id="${addonKey}">
                <div class="main-checkBox-wrapper"></div>
                <div class="config-panel">
                    <div class="one-opt-record">
                        <div class="description-opt">${_t("size", null, addonKey)}</div>
                        <div class="input-opt resolution-menu-wrapper menu"></div>
                    </div>
                    <div class="one-opt-record">
                        <div class="description-opt">${_t("bck", null, addonKey)}</div>
                        <div class="input-opt background-menu-wrapper menu"></div>
                    </div>
                    <div class="one-opt-record">
                        <div class="description-opt">${_t("visible", null, addonKey)}</div>
                        <div class="input-opt visible-menu-wrapper menu"></div>
                    </div>
                    <div class="one-opt-record">
                        <div class="description-opt">${_t("scale", null, addonKey)}</div>
                        <div class="input-opt scale-input-wrapper"></div>
                    </div>
                    <div class="outside-chat-mode-checkBox-wrapper"></div>
                <div/>
            </div>

        `);
    };

    const style = () => {
        let RES = getEngine().ResolutionData.RES;

        return `
		<style id="${addonKey}-style">

			.${addonKey}-wnd .content {
			    margin-left: -15px;
                margin-right: -15px;

                .config-panel {
                    pointer-events: none;
                    opacity: 0.5;
                }

                .config-panel.window-mode-active {
                    pointer-events: auto;
                    opacity: 1;
                }

			}

			#${addonKey} {
                height: 150px;
                margin-top: 6px;
                font-size:12px;
			}

            #${addonKey} input {
                border: 1px solid grey;
            }

            #${addonKey} .one-opt-record {
                display: table;
                width: 100%;
                height: 30px;
            }

            #${addonKey} .one-opt-record .description-opt {
                color: white;
                display: table-cell;
                vertical-align: middle;
            }

            #${addonKey} .one-opt-record .input-opt  {
                display: table-cell;
                vertical-align: middle;
                width: 60%;
            }


			.main-checkBox-wrapper {
			    margin-bottom: 10px;
			}

			.outside-chat-mode-checkBox-wrapper {
			    margin-top: 10px;
			}

			.window-mode-background-layer {
			    pointer-events:none;
			        //transform: scale(1.5);
			}

            body[data-res="${RES._920_X_555}"],
            body[data-res="${RES._1173_X_555}"],
			body[data-res="${RES._1024_X_768}"],
			body[data-res="${RES._1277_X_768}"],
			body[data-res="${RES._1366_X_768}"],
			body[data-res="${RES._1619_X_768}"],
			body[data-res="${RES._1200_X_675}"],
			body[data-res="${RES._1253_X_675}"],
			body[data-res="${RES._1600_X_900}"],
			body[data-res="${RES._1853_X_900}"],
			body[data-res="${RES._1920_X_1080}"] {
                .interface-layer {
			        border: 7px solid transparent;
			        border-image: url('../img/gui/windowModeBorder.png') 7 repeat;
			        box-sizing: border-box;

	            }

                //.layer.interface-layer {
                //    overflow: visible;
                //}

                &.${OUTSIDE_CHAT_MODE_CL} {
                    .new-chat-window {
                        bottom:0px!important;
                    }
                    .chat-size-1 {
	                    .left-column.main-column {
                            left: -261px;
                        }

	                    .echh-layer,
	                    .game-layer,
	                    .layer.interface-layer .mini-map,
	                    .mAlert-layer .big-messages {
	                    	left: 0;
	                    }
	                    .layer.interface-layer .main-column.left-column {
	                    	/*display: none;*/
	                    	width: 0;
	                    	.border {
	                    	    display: none;
	                    	}
	                    }
	                    .left-column .inner-wrapper .chat-tpl .input-wrapper input {
	                    	width: 0;
	                    }
                    }
                }

	        }

            body[data-res="${RES._920_X_555}"] {
			    .pre-captcha {
			        top:-22px;
			    }
			    .pre-captcha.show {
			        top:52px;
			    }
			    .interface-layer .battle-controller {
			        transform: scale(0.75);
                    -webkit-transform-origin-y: 100%;
			    }
            }

            body[data-res="${RES._920_X_555}"] {
                /*
                .bottom-left.main-buttons-container {
                    bottom: -11px;
                }
                .bottom-right.main-buttons-container {
                    bottom: -11px;
                }
                */
                .main-buttons-container {
                    width: 226px
                }
                .trade-window {
                    transform: scale(0.72);
                    bottom: 16px;
                }
            }

            body[data-res="${RES._1024_X_768}"] {
                 .pre-captcha {
			        top:-18px;
			    }
			    .pre-captcha.show {
			        top:52px;
			    }
                .trade-window {
                    transform: scale(0.9);
                    bottom: 42px;
                }
            }

            body[data-res="${RES._1173_X_555}"] {
                .pre-captcha {
			        top:-20px;
			    }
			    .pre-captcha.show {
			        top:55px;
			    }
                .trade-window {
                    bottom: 42px;
                }
            }

            body[data-res="${RES._1024_X_768}"],
			body[data-res="${RES._1173_X_555}"] {
                /*
                .bottom-left.main-buttons-container {
                    bottom: -8px;
                }
                .bottom-right.main-buttons-container {
                    bottom: -8px;
                }
                */
                .main-buttons-container {
                    width: 266px
                }
            }

			body[data-res="${RES._920_X_555}"],
			body[data-res="${RES._1024_X_768}"],
			body[data-res="${RES._1173_X_555}"] {
			    .dialogue-window {
			        bottom: 81px;
			    }
			    .interface-layer .battle-controller.with-skills {
			        bottom: 50px;
			    }
			    .interface-layer .mini-map-controller {
			        top:50px;
			        bottom: 50px;
			    }

			    .hud-container,
			    .bottom-panel-of-bottom-positioner.bottom-panel {
			        transform: scale(0.82);
			    }
			    .hud-container {
	                -webkit-transform-origin-y: 10%;
                }
                .bottom-panel-of-bottom-positioner.bottom-panel {
	                transform-origin: 50% 100%;
                }
                .interface-layer .top.positioner .bg {
                    background-position-y: -71px!important;
                }
                .bottom-left.main-buttons-container {
                    left: 2px;
                }
                .bottom-right.main-buttons-container {
                    right: 2px;
                }
                .interface-layer .top.positioner .bg,
                .interface-layer .bottom.positioner .bg {
                    height: 50px;
                }
                .interface-layer {
                    .right-column.main-column,
                    .left-column.main-column,
                    .game-layer {
                        top: 50px;
                        bottom : 50px;
                    }
                }
                .b_wrapper {
                    display: none;
                }
                .bottom.positioner .content .bottom-left-additional,
                .bottom.positioner .content .bottom-right-additional {
                    bottom: 30px;
                }
                .layer.interface-layer .positioner.bottom .bg-additional-widget-left,
                .layer.interface-layer .positioner.bottom .bg-additional-widget-right {
                    bottom: -20px;
                }

                .layer.interface-layer .positioner.bottom .bg-additional-widget-left {
                    transform: scale(-1, 0.82);
                    transform-origin: 50% -5%;
                }
                .layer.interface-layer .positioner.bottom .bg-additional-widget-right {
                    transform: scale(1, 0.82);
                    transform-origin: 0% -5%;
                }

            }

            body[data-res="${RES._1024_X_768}"],
            body[data-res="${RES._1173_X_555}"] {
			    .hud-container,
			    .bottom-panel-of-bottom-positioner.bottom-panel {
			        transform: scale(0.9);
			    }
			}

		</style>
	`;
    }

};