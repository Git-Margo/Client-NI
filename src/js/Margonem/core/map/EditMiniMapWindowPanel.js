const tpl = require('@core/Templates');
const StorageFuncHandHeldMiniMap = require('@core/map/StorageFuncHandHeldMiniMap');
const HandHeldMiniMapData = require('@core/map/handheldMiniMap/HandHeldMiniMapData');
const ColorPicker = require('@core/components/ColorPicker');
const Checkbox = require('@core/components/Checkbox');
const StorageData = require('@core/StorageData');
const InputMaskData = require('@core/InputMaskData');
const Table = require('@core/components/Table');

module.exports = function() {
    let moduleData = {
        fileName: "EditMiniMapWindowPanel.js"
    };
    var content;
    var self = this;
    var open = false;
    var standardColors;

    this.standardIcons;

    let allColorPickers = {};

    let showHandHeldMiniMapCheckboxList = {};
    let showDataDrawerNickCheckboxList = {};
    let showDataDrawerProfAndLevelCheckboxList = {};
    let showWhoIsHereCheckboxList = {};
    let showMapBlurCheckboxList = {};


    const CATEGORY = "catergory";
    const SHOW_PORTABLE_MAP = "show-portable-map";
    const SHOW_DATA_DRAWER_NICK = "show-data-drawer-nick";
    const SHOW_DATA_DRAWER_PROF_AND_LEVEL = "show-data-drawer-prof";
    const SHOW_WHO_IS_HERE = "show-who-is-here";
    const SHOW_MAP_BLUR = "show-map-blur";
    const COLOR = "color-wrapper";

    // const handheldStoreKey = 'handheld-window'

    this.init = function() {

        // Store.easySet('jakas val', 'a', 'ab', 'abc', 'abcd')
        //console.log(Store.easyGet('a', 'ab', 'abc', 'abcd'));

        this.initWindow();
        //this.initColorsTab();
        //this.initIconsTab();
        this.initAllOptions();
        this.centreWnd();
        this.initSaveButton();
        this.initSetDefaultSettingsBtn();
        //this.initLabels();
        //this.initScroll();
        //this.initClickPalette();
    };

    const getColorFromAllColorPickers = (name) => {
        if (!allColorPickers[name]) {
            errorReport(moduleData.fileName, "getColorFromAllColorPickers", "allColorPickers name not exist!", name);
            return '#fc3e40';
        }

        return allColorPickers[name].getChooseColor();
    }

    const getIconIdFromAllColorPickers = (name) => {
        if (!allColorPickers[name]) {
            errorReport(moduleData.fileName, "getIconIdFromAllColorPickers", "allColorPickers name not exist!", name);
            return 0;
        }

        return allColorPickers[name].getChooseIconId();
    }

    this.initSetDefaultSettingsBtn = () => {
        let $btn = tpl.get('button').addClass('green small');
        $btn.find('.label').html(_t('default_settings'));
        this.wnd.$.find('.save-colors').append($btn);

        $btn.click(() => {
            let txt = _t('set_Default_settings_alert');
            confirmWithCallback({
                msg: txt,
                clb: () => {
                    this.setDefaultSettings();
                }
            })
        });
    };

    this.setDefaultSettings = () => {
        this.setDefaultInHtmlElements();
        this.setDefaultMinLvl()
        this.saveDataToStore();
    };

    this.setDefaultMinLvl = () => {
        setInputByDataVal(HandHeldMiniMapData.MIN_LEVEL_DATA);
        setInputByDataVal(HandHeldMiniMapData.DATA_DRAWER_WIDTH_DATA);
        setInputByDataVal(HandHeldMiniMapData.DATA_DRAWER_FONT_SIZE_DATA);
    };

    const setInputByDataVal = (data) => {
        let name = data.KEY;
        let defaultVal = data.DEFAULT;

        self.wnd.$.find('#' + name).find('input').val(defaultVal)
    };

    const getInputByVal = (name) => {
        return self.wnd.$.find('#' + name).find('input').val()
    };

    this.setDefaultInHtmlElements = () => {
        //var namesTab        = Engine.miniMapController.handHeldMiniMapController.getNamesTab();

        for (let name in allColorPickers) {

            let icon = self.getIconFromDefault(name);
            let color = self.getColorFromDefault(name);

            allColorPickers[name].setColorAndUpdate(color);
            allColorPickers[name].setIconIdAndUpdate(icon);
            //
            //self.setColorOfBck(name, color);
            //self.setIconOfBck(name, color, icon);
        }


        for (let k in showHandHeldMiniMapCheckboxList) {
            showHandHeldMiniMapCheckboxList[k].setChecked(true)
        }

        const handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;

        //for (let k in showDataDrawerCheckboxList) {
        //	showDataDrawerCheckboxList[k].setChecked(handHeldMiniMapController.getDefaultDataDrawer(k))
        //}

        for (let k in showDataDrawerNickCheckboxList) {
            showDataDrawerNickCheckboxList[k].setChecked(handHeldMiniMapController.getDefaultDataDrawerNick(k))
        }

        for (let k in showDataDrawerProfAndLevelCheckboxList) {
            showDataDrawerProfAndLevelCheckboxList[k].setChecked(handHeldMiniMapController.getDefaultDataDrawerProfAndLevel(k))
        }

        for (let k in showWhoIsHereCheckboxList) {
            showWhoIsHereCheckboxList[k].setChecked(handHeldMiniMapController.getDefaultWhoIsHere(k))
        }

        for (let k in showMapBlurCheckboxList) {
            showMapBlurCheckboxList[k].setChecked(handHeldMiniMapController.getDefaultMapBlur(k))
        }

    };


    //this.initScroll = function () {
    //	self.wnd.$.find('.scroll-wrapper').addScrollBar({track: true});
    //};

    //this.updateScroll = function () {
    //	self.wnd.$.find('.scroll-wrapper').trigger('update');
    //};

    this.initSaveButton = function() {
        var $btn = tpl.get('button').addClass('green small');
        $btn.find('.label').html(_t('save'));
        this.wnd.$.find('.save-colors').append($btn);
        $btn.click(function() {
            self.saveDataToStore();
            self.close();
        });
    };

    this.centreWnd = function() {
        this.wnd.center();
    };

    this.initLabels = function() {
        var $w = this.wnd.$;
        $w.find('.edit-header-label').html(_t('portable_map'));
        $w.find('.show-monsters-header').html(_t('show_monsters'));
        $w.find('.show-label-window-map').html("PORTABLE_MAP");
        $w.find('.show-label-data-drawer-nick').html("D_NICK");
        $w.find('.show-label-data-drawer-prof-and-level').html("D_PPROF_&_LVL");
        $w.find('.show-label-who-is-here').html("WHO_IS_HERE");
        $w.find('.show-label-map-blur').html("MAP_BLUR");
        $w.find('.color-label').html(_t('color', null, 'whoIsHere'));
    };

    this.initWindow = function() {
        content = tpl.get('divide-and-color-edit');

        Engine.windowManager.add({
            content: content,
            title: _t('option'),
            //nameWindow        : 'editMiniMapWindow',
            nameWindow: Engine.windowsData.name.EDIT_MINI_MAP_WINDOW,
            objParent: this,
            nameRefInParent: 'wnd',
            onclose: () => {
                self.close();
            }
        });
        self.wnd.addToAlertLayer();
    };

    this.saveDataToStore = function() {
        var namesTab = Engine.miniMapController.handHeldMiniMapController.getNamesTab();

        for (var name in namesTab) {

            let color = getColorFromAllColorPickers(name);
            let iconIndex = getIconIdFromAllColorPickers(name);
            let showHandHeldMiniMapCheckBox = getShowHandHeldMiniMapCheckBoxFromList(name);

            let showDataDrawerNickCheckBox = getShowDataDrawerNickCheckboxFromList(name);
            let showDataDrawerProfAndLevelCheckBox = getShowDataDrawerProfAndLevelCheckboxFromList(name);
            let showWhoIsHereCheckBox = getShowWhoIsHereFromList(name);
            let showMapBlurCheckBox = getShowMapBlurFromList(name);

            let showHandHeldMiniMapState = showHandHeldMiniMapCheckBox.getChecked();

            StorageFuncHandHeldMiniMap.setColorOfKindByName(name, color);
            StorageFuncHandHeldMiniMap.setIconOfKindByName(name, iconIndex);
            StorageFuncHandHeldMiniMap.setStateOfKindByName(name, showHandHeldMiniMapState);

            if (showDataDrawerNickCheckBox) {
                let showDataDrawerNickState = showDataDrawerNickCheckBox.getChecked();
                StorageFuncHandHeldMiniMap.setDataDrawerNickOfKindByName(name, showDataDrawerNickState);
            }

            if (showDataDrawerProfAndLevelCheckBox) {
                let showDataDrawerProfAndLevelState = showDataDrawerProfAndLevelCheckBox.getChecked();
                StorageFuncHandHeldMiniMap.setDataDrawerProfAndLevelOfKindByName(name, showDataDrawerProfAndLevelState);
            }

            if (showWhoIsHereCheckBox) {
                let showWhoIsHereState = showWhoIsHereCheckBox.getChecked();
                StorageFuncHandHeldMiniMap.setWhoIsHereOfKindByName(name, showWhoIsHereState);
            }

            if (showMapBlurCheckBox) {
                let showMapBlurState = showMapBlurCheckBox.getChecked();
                StorageFuncHandHeldMiniMap.setMapBlurOfKindByName(name, showMapBlurState);
            }

        }

        let minLevelAmount = getInputByVal(HandHeldMiniMapData.MIN_LEVEL_DATA.KEY);
        let widthDataDrawer = getInputByVal(HandHeldMiniMapData.DATA_DRAWER_WIDTH_DATA.KEY);
        let fontSizeDataDrawer = getInputByVal(HandHeldMiniMapData.DATA_DRAWER_FONT_SIZE_DATA.KEY);

        StorageFuncHandHeldMiniMap.setMinLevelOfKindByName(minLevelAmount);
        StorageFuncHandHeldMiniMap.setWidthDataDrawerOfKindByName(widthDataDrawer);
        StorageFuncHandHeldMiniMap.setFontSizeDataDrawerOfKindByName(fontSizeDataDrawer);

        Engine.miniMapController.handHeldMiniMapController.refreshMiniMapController();
        Engine.whoIsHere.updateWhoIsHereAfterSaveInServerStorage();
    };

    this.initAllOptions = function() {
        var $wrapper1 = this.wnd.$.find('.global-option');
        var $wrapper2 = this.wnd.$.find('.by-name-option');
        var namesTab = Engine.miniMapController.handHeldMiniMapController.getNamesTab();

        this.createOneAmountOption(HandHeldMiniMapData.MIN_LEVEL_DATA, $wrapper1);
        this.createOneAmountOption(HandHeldMiniMapData.DATA_DRAWER_WIDTH_DATA, $wrapper1);
        this.createOneAmountOption(HandHeldMiniMapData.DATA_DRAWER_FONT_SIZE_DATA, $wrapper1);

        let _showHandHeldMiniMapCheckboxList = {};
        let _showDataDrawerNickCheckboxList = {};
        let _showDataDrawerProfAndLevelCheckboxList = {};
        let _showWhoIsHereCheckboxList = {};
        let _showMapBlurCheckboxList = {};
        let _allColorPickers = {};

        let optionsArray = [];

        for (var k in namesTab) {
            let option = this.createOneOption(k, namesTab[k], _showHandHeldMiniMapCheckboxList, _showDataDrawerNickCheckboxList, _showDataDrawerProfAndLevelCheckboxList, _showWhoIsHereCheckboxList, _showMapBlurCheckboxList, _allColorPickers);
            optionsArray.push({
                rowData: option
            });
        }

        showHandHeldMiniMapCheckboxList = _showHandHeldMiniMapCheckboxList;
        showDataDrawerNickCheckboxList = _showDataDrawerNickCheckboxList;
        showDataDrawerProfAndLevelCheckboxList = _showDataDrawerProfAndLevelCheckboxList;
        showWhoIsHereCheckboxList = _showWhoIsHereCheckboxList;
        showMapBlurCheckboxList = _showMapBlurCheckboxList;
        allColorPickers = _allColorPickers;


        const headers = createHeader();
        new Table.default({
            wrapper: $wrapper2[0],
            headerRecord: headers,
            bodyRecordsArray: optionsArray,
            options: {
                cssClass: "config-characters-table",
                useScrollbar: true,
                useStickyHeader: true,
            }
        });
    };

    this.createOneAmountOption = function(data, $wrapper) {
        let $one = tpl.get('text-and-input');
        let name = data.KEY;
        let defaultVal = data.DEFAULT;
        let amount = Engine.miniMapController.handHeldMiniMapController.getAmountElementFromStorage(data);
        let $input;

        const MIN = data.MIN;
        const MAX = data.MAX;

        $input = createNiInput({
            cl: 'input-wrapper',
            type: InputMaskData.TYPE.NUMBER,
            keyUpClb: (val, e) => {
                e.stopPropagation();
                if (e.originalEvent.code == "Enter" || e.originalEvent.code == "Esc") {
                    $input.find('input').blur();
                }
            },
            focusoutClb: (val, e) => {
                manageCorrectValue($input.find('input'), defaultVal, val, MIN, MAX);
            },
            tip: `${MIN} - ${MAX}`,
            clear: false,
            val: amount
        });

        $one.append($input);

        $one.attr('id', name);
        $input.find('input').val(amount);
        $one.find('.text').html(_t(name, null, "edit-panel-option"));

        $wrapper.append($one);
    };

    const manageCorrectValue = ($input, defaultVal, val, min, max) => {
        if (val == null || val == '') {
            $input.val(defaultVal);
            return
        }

        if (val > max) {
            $input.val(max);
        }
        if (val < min) {
            $input.val(min);
        }
    };

    this.createOneOptionOld = function(name, data, $wrapper, _showHandHeldMiniMapCheckboxList, _showDataDrawerNickCheckboxList, _showDataDrawerProfAndLevelCheckboxList, _showWhoIsHereCheckboxList, _showMapBlurCheckboxList, _allColorPickers) {
        let $oneC = tpl.get('divide-and-color-record');

        $oneC.attr('id', name);
        $wrapper.append($oneC);
        //$oneC.find('.icon-mark').addClass(name);
        $oneC.find('.text').html(_t(name, null, 'edit-panel-option'));

        //let color     			= self.getColorFromStore(name);
        //let state     			= self.getStateElementFromStorage(name);


        createColorPicker($oneC, name, _allColorPickers);

        addToArray(name, data, $oneC, _showHandHeldMiniMapCheckboxList, _showDataDrawerNickCheckboxList, _showDataDrawerProfAndLevelCheckboxList, _showWhoIsHereCheckboxList, _showMapBlurCheckboxList);
        return $oneC;
    };

    this.createOneOption = function(name, data, _showHandHeldMiniMapCheckboxList, _showDataDrawerNickCheckboxList, _showDataDrawerProfAndLevelCheckboxList, _showWhoIsHereCheckboxList, _showMapBlurCheckboxList, _allColorPickers) {
        //$oneC.attr('id', name);

        let state = self.getStateElementFromStorage(name);
        let $name = $('<div>').html(_t(name, null, 'edit-panel-option'));


        let $showCheckboxWrapper = $('<div>');
        let $showDataDrawerNickCheckboxWrapper = $('<div>');
        let $showDataDrawerProfAndLevelCheckboxWrapper = $('<div>');
        let $showWhoIsHereCheckboxWrapper = $('<div>');
        let $showMapBlurCheckboxWrapper = $('<div>');

        let idShowCheckBox = getShowCheckBoxId(name);
        let idShowDataDrawerNickCheckBox = getShowDataDrawerNickCheckboxId(name);
        let idShowDataDrawerProfAndLevelCheckBox = getShowDataDrawerProfAndLevelCheckboxId(name);
        let idShowWhoIsHereCheckBox = getShowWhoIsHereCheckboxId(name);
        let idShowMapBlurCheckBox = getShowMapBlurCheckboxId(name);

        const handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;

        createPortableMiniMapCheckBox(state, idShowCheckBox, $showCheckboxWrapper, _showHandHeldMiniMapCheckboxList, name);

        if (isset(data.dataDrawerNick)) {
            let stateDataDrawerNick = handHeldMiniMapController.getDataDrawerNickOfKindByName(name);
            createPortableMiniMapCheckBox(stateDataDrawerNick, idShowDataDrawerNickCheckBox, $showDataDrawerNickCheckboxWrapper, _showDataDrawerNickCheckboxList, name);
        } else {
            $showDataDrawerNickCheckboxWrapper.html('-')
        }

        if (isset(data.dataDrawerProfAndLevel)) {
            let stateDataDrawerProfAndLevel = handHeldMiniMapController.getDataDrawerProfAndLevelOfKindByName(name);
            createPortableMiniMapCheckBox(stateDataDrawerProfAndLevel, idShowDataDrawerProfAndLevelCheckBox, $showDataDrawerProfAndLevelCheckboxWrapper, _showDataDrawerProfAndLevelCheckboxList, name);
        } else {
            $showDataDrawerProfAndLevelCheckboxWrapper.html('-')
        }

        if (isset(data.whoIsHere)) {
            let stateWhoIsHere = handHeldMiniMapController.getWhoIsHereOfKindByName(name);
            createPortableMiniMapCheckBox(stateWhoIsHere, idShowWhoIsHereCheckBox, $showWhoIsHereCheckboxWrapper, _showWhoIsHereCheckboxList, name);
        } else {
            $showWhoIsHereCheckboxWrapper.html('-')
        }

        if (isset(data.mapBlur)) {
            let stateMapBlur = handHeldMiniMapController.getMapBlurOfKindByName(name);
            createPortableMiniMapCheckBox(stateMapBlur, idShowMapBlurCheckBox, $showMapBlurCheckboxWrapper, _showMapBlurCheckboxList, name);
        } else {
            $showMapBlurCheckboxWrapper.html('-')
        }


        let cl = " text-center";

        return [{
                content: $name[0],
                cssClass: CATEGORY + cl,
            },
            {
                content: $showWhoIsHereCheckboxWrapper[0],
                cssClass: SHOW_PORTABLE_MAP + cl
            },
            {
                content: $showMapBlurCheckboxWrapper[0],
                cssClass: SHOW_DATA_DRAWER_NICK + cl
            },
            {
                content: $showCheckboxWrapper[0],
                cssClass: SHOW_DATA_DRAWER_PROF_AND_LEVEL + cl
            },
            {
                content: $showDataDrawerNickCheckboxWrapper[0],
                cssClass: SHOW_WHO_IS_HERE + cl
            },
            {
                content: $showDataDrawerProfAndLevelCheckboxWrapper[0],
                cssClass: SHOW_MAP_BLUR + cl
            },
            {
                content: createColorPicker(name, _allColorPickers)[0],
                cssClass: COLOR + cl
            },
        ];

        // return table.createRecords([
        // 	$name[0],
        // 	$showWhoIsHereCheckboxWrapper[0],
        // 	$showMapBlurCheckboxWrapper[0],
        // 	$showCheckboxWrapper[0],
        // 	$showDataDrawerNickCheckboxWrapper[0],
        // 	$showDataDrawerProfAndLevelCheckboxWrapper[0],
        // 	createColorPicker(name, _allColorPickers)[0]
        // ], [
        // 	CATEGORY + cl,
        // 	SHOW_PORTABLE_MAP + cl,
        // 	SHOW_DATA_DRAWER_NICK + cl,
        // 	SHOW_DATA_DRAWER_PROF_AND_LEVEL + cl,
        // 	SHOW_WHO_IS_HERE + cl,
        // 	SHOW_MAP_BLUR + cl,
        // 	COLOR + cl,
        // ]);


    }

    const addToArray = (name, data, $oneC, _showHandHeldMiniMapCheckboxList, _showDataDrawerNickCheckboxList, _showDataDrawerProfAndLevelCheckboxList, _showWhoIsHereCheckboxList, _showMapBlurCheckboxList) => {
        let state = self.getStateElementFromStorage(name);

        let $showCheckboxWrapper = $oneC.find('.show-hand-held-mini-map-checkbox-wrapper');
        let $showDataDrawerNickCheckboxWrapper = $oneC.find('.show-data-drawer-nick-checkbox-wrapper');
        let $showDataDrawerProfAndLevelCheckboxWrapper = $oneC.find('.show-data-drawer-prof-and-level-checkbox-wrapper');
        let $showWhoIsHereCheckboxWrapper = $oneC.find('.show-who-is-here-checkbox-wrapper');
        let $showMapBlurCheckboxWrapper = $oneC.find('.show-map-blur-checkbox-wrapper');

        let idShowCheckBox = getShowCheckBoxId(name);
        let idShowDataDrawerNickCheckBox = getShowDataDrawerNickCheckboxId(name);
        let idShowDataDrawerProfAndLevelCheckBox = getShowDataDrawerProfAndLevelCheckboxId(name);
        let idShowWhoIsHereCheckBox = getShowWhoIsHereCheckboxId(name);
        let idShowMapBlurCheckBox = getShowMapBlurCheckboxId(name);

        const handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;

        createPortableMiniMapCheckBox(state, idShowCheckBox, $showCheckboxWrapper, _showHandHeldMiniMapCheckboxList, name);

        if (isset(data.dataDrawerNick)) {
            let stateDataDrawerNick = handHeldMiniMapController.getDataDrawerNickOfKindByName(name);
            createPortableMiniMapCheckBox(stateDataDrawerNick, idShowDataDrawerNickCheckBox, $showDataDrawerNickCheckboxWrapper, _showDataDrawerNickCheckboxList, name);
        }

        if (isset(data.dataDrawerProfAndLevel)) {
            let stateDataDrawerProfAndLevel = handHeldMiniMapController.getDataDrawerProfAndLevelOfKindByName(name);
            createPortableMiniMapCheckBox(stateDataDrawerProfAndLevel, idShowDataDrawerProfAndLevelCheckBox, $showDataDrawerProfAndLevelCheckboxWrapper, _showDataDrawerProfAndLevelCheckboxList, name);
        }

        if (isset(data.whoIsHere)) {
            let stateWhoIsHere = handHeldMiniMapController.getWhoIsHereOfKindByName(name);
            createPortableMiniMapCheckBox(stateWhoIsHere, idShowWhoIsHereCheckBox, $showWhoIsHereCheckboxWrapper, _showWhoIsHereCheckboxList, name);
        }

        if (isset(data.mapBlur)) {
            let stateMapBlur = handHeldMiniMapController.getMapBlurOfKindByName(name);
            createPortableMiniMapCheckBox(stateMapBlur, idShowMapBlurCheckBox, $showMapBlurCheckboxWrapper, _showMapBlurCheckboxList, name);
        }
    }

    const getShowCheckBoxId = (name) => {
        return name + "-show-checbox-portable-map";
    };

    const addToShowDataDrawerNickCheckboxList = (id, checkBox) => {
        showDataDrawerNickCheckboxList[id] = checkBox;
    };

    const addToShowDataDrawerProfAndLevelCheckboxList = (id, checkBox) => {
        showDataDrawerProfAndLevelCheckboxList[id] = checkBox;
    };

    const getShowDataDrawerNickCheckboxId = (name) => {
        return name + "-show-checkbox-data-drawer-nick";
    };

    const getShowDataDrawerProfAndLevelCheckboxId = (name) => {
        return name + "-show-checkbox-data-drawer-prof-and-level";
    };

    const getShowWhoIsHereCheckboxId = (name) => {
        return name + "-show-checkbox-who-is-here";
    };

    const getShowMapBlurCheckboxId = (name) => {
        return name + "-show-checkbox-map-blur";
    };

    const getShowDataDrawerNickCheckboxFromList = (id) => {
        return showDataDrawerNickCheckboxList[id];
    };

    const getShowDataDrawerProfAndLevelCheckboxFromList = (id) => {
        return showDataDrawerProfAndLevelCheckboxList[id];
    };

    const getShowWhoIsHereFromList = (id) => {
        return showWhoIsHereCheckboxList[id];
    };

    const getShowMapBlurFromList = (id) => {
        return showMapBlurCheckboxList[id];
    };

    const addToShowHandHeldMiniMapCheckBoxList = (id, checkBox) => {
        showHandHeldMiniMapCheckboxList[id] = checkBox;
    };

    const getShowHandHeldMiniMapCheckBoxFromList = (id) => {
        return showHandHeldMiniMapCheckboxList[id];
    };

    const addToShowWhoIsHereCheckBoxList = (id, checkBox) => {
        showWhoIsHereCheckboxList[id] = checkBox;
    };

    const getShowWhoIsHereCheckBoxFromList = (id) => {
        return showWhoIsHereCheckboxList[id];
    };

    const addToShowMapBlurCheckBoxList = (id, checkBox) => {
        showMapBlurCheckboxList[id] = checkBox;
    };

    const getShowMapBlurCheckBoxFromList = (id) => {
        return showMapBlurCheckboxList[id];
    };

    const createPortableMiniMapCheckBox = (state, id, $content, objToAttach, name) => {
        const checkbox = new Checkbox.default({
                name: ``,
                value: ``,
                i: id,
                checked: state,
                //highlight  						: false
            },
            (e) => {
                //if (!clb) return;
                //clb(e.target.checked);
                //outsideChatCheckBox.setChecked(e.target.checked ? false : true)
            }
        );

        $content.append($(checkbox.getCheckbox()));

        //if (kind == "SHOW_DATA_DRAWER") addToShowDataDrawerCheckboxList(name, checkbox);
        //if (kind == "SHOW_HANDHELD_MINI_MAP") addToShowHandHeldMiniMapCheckBoxList(name, checkbox);
        //if (kind == "SHOW_DATA_DRAWER_NICK") addToShowDataDrawerNickCheckboxList(name, checkbox);
        //if (kind == "SHOW_DATA_DRAWER_PROF_AND_LEVEL") addToShowDataDrawerProfAndLevelCheckboxList(name, checkbox);
        //if (kind == "SHOW_WHO_IS_HERE") addToShowWhoIsHereCheckBoxList(name, checkbox);
        //if (kind == "SHOW_MAP_BLUR") addToShowMapBlurCheckBoxList(name, checkbox);
        objToAttach[name] = checkbox;
    }

    const createColorPicker = (name, _allColorPickers) => {
        let colorPicker = new ColorPicker();
        //let $wrapper 		= $oneC.find('.choose-color-wrapper');
        let $colorPicker = $('<div>').addClass('color-picker-wrapper');

        let color = this.getColorFromStore(name);
        let iconId = this.getIconFromStore(name);

        //console.log(name, color, iconId);

        colorPicker.init();
        colorPicker.updateData($colorPicker, color, parseInt(iconId));

        _allColorPickers[name] = colorPicker;

        return $colorPicker;
    }

    this.getStateElementFromStorage = function(name) {
        // var store = Store.get(handheldStoreKey + '/' + name + '/state');
        let store = StorageFuncHandHeldMiniMap.getStateOfKindByName(name);
        if (store !== null) return store;
        else {
            var state = true;
            // Store.set(handheldStoreKey + '/' + name + '/state', state);
            StorageFuncHandHeldMiniMap.setStateOfKindByName(name, state);
            return state;
        }
    };

    this.getColorFromStore = function(name) {
        // var store = Store.get(handheldStoreKey + '/' + name + '/color');
        let store = StorageFuncHandHeldMiniMap.getColorOfKindByName(name);
        if (store) return store;
        else {
            return self.getColorFromDefault(name);
        }
    };

    this.getIconFromStore = function(name) {
        // var store = Store.get(handheldStoreKey + '/' + name + '/icon');
        let store = StorageFuncHandHeldMiniMap.getIconOfKindByName(name);

        if (store == null) return Engine.miniMapController.handHeldMiniMapController.getDefaultIcon(name);
        else return store;
    };

    this.getColorFromDefault = function(name) {
        return Engine.miniMapController.handHeldMiniMapController.getDefaultColor(name);
    };

    this.getIconFromDefault = function(name) {
        let hHMMC = Engine.miniMapController.handHeldMiniMapController;
        //return hHMMC.iconIndexToName(hHMMC.getDefaultIcon(name));
        return hHMMC.getDefaultIcon(name);
    };

    this.getStateFromStorage = function(name) {
        // var store = Store.get(handheldStoreKey + '/' + name + '/state');
        let store = StorageFuncHandHeldMiniMap.getStateOfKindByName(name);
        if (store !== null) return store;
        else {
            var state = true;
            StorageFuncHandHeldMiniMap.setStateOfKindByName(name)
            return state;
        }
    };

    this.close = function() {
        self.wnd.remove();
        Engine.miniMapController.handHeldMiniMapController.getHandHeldMiniMapWindow().removeControlPanel();
    };

    this.initColorsTab = function() {
        standardColors = [
            '#fc3e40',
            '#767676',
            '#87fdff',
            '#93441c',
            '#4cfa4f',
            '#fe5afb',
            '#40bfff',
            '#f37125',
            '#a500fc',
            '#ffba37',
            '#eaeaea',
            '#93b900',
            '#fef348',
            '#3559ff',
            '#c71618',
            '#ffa9fe',
            '#46a31d',
            '#292929'
        ];
    };

    this.initIconsTab = function() {
        this.standardIcons = Engine.miniMapController.handHeldMiniMapController.getIcons();
    };

    //const initTable = () => {
    //	//let table = tpl.get('table-with-static-header');
    //
    //	let $header = createHeader();
    //
    //
    //	let table = new Table();
    //
    //	table.init($header);
    //	table.updateScroll();
    //
    //};

    const createHeader = () => {

        let cl = " table-with-static-header-header-td text-center";

        let name = _t("hero_name").replace(" ", "<br>")

        return {
            rowData: [{
                    content: _t('option', null, "edit-panel-option"),
                    cssClass: CATEGORY + cl,
                },
                {
                    content: _t('players_on_map'),
                    cssClass: SHOW_PORTABLE_MAP + cl
                },
                {
                    content: _t('lighting', null, 'whoIsHere'),
                    cssClass: SHOW_DATA_DRAWER_NICK + cl
                },
                {
                    content: _t('portable_map'),
                    cssClass: SHOW_DATA_DRAWER_PROF_AND_LEVEL + cl,
                },
                {
                    content: name,
                    cssClass: SHOW_WHO_IS_HERE + cl,
                },
                {
                    content: _t("levelAndProf", null, "edit-panel-option"),
                    cssClass: SHOW_MAP_BLUR + cl
                },
                {
                    content: _t("color", null, "whoIsHere"),
                    cssClass: COLOR + cl,
                },
            ]
        };
        // return table.createRecords(
        // 	[
        // 		_t('option', null, "edit-panel-option"),
        // 		_t('players_on_map'),
        // 		_t('lighting', null, 'whoIsHere'),
        // 		_t('portable_map'),
        // 		name,
        // 		_t("levelAndProf", null, "edit-panel-option"),
        // 		_t("color", null, "whoIsHere")
        // 	], [
        // 		CATEGORY + cl,
        // 		SHOW_PORTABLE_MAP + cl,
        // 		SHOW_DATA_DRAWER_NICK + cl,
        // 		SHOW_DATA_DRAWER_PROF_AND_LEVEL + cl,
        // 		SHOW_WHO_IS_HERE + cl,
        // 		SHOW_MAP_BLUR + cl,
        // 		COLOR + cl,
        // 	]
        // );
    };

};