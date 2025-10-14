var tpl = require('@core/Templates');
let ServerStorageData = require('@core/storage/ServerStorageData');
let WhoIsHereData = require('@core/whoIsHere/WhoIsHereData');
const ColorPicker = require('@core/components/ColorPicker');
const Checkbox = require('@core/components/Checkbox');
module.exports = function() {
    let moduleData = {
        fileName: "EditColorPanel.js"
    };
    var content;
    var self = this;
    var open = false;
    var standardColors;

    let glowCheckboxList = {};
    let showCheckboxList = {};

    var namesTab;

    let allColorPickers = {};

    this.init = function() {
        this.initWindow();
        //this.initColorsTab();
        this.initNamesTab();
        this.initAllOptions();
        this.initLabels();
        this.centreWnd();
        this.initSaveButton();
        this.initSetDefaultSettingsBtn();
        //this.initClickPalette();
    };

    const getColorFromAllColorPickers = (name) => {
        if (!allColorPickers[name]) {
            errorReport(moduleData.fileName, "getColorFromAllColorPickers", "allColorPickers name not exist!", name);
            return '#fc3e40';
        }

        return allColorPickers[name].getChooseColor();
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
        debugger;
        this.setDefaultColor();
        this.setDefaultCheckboxAndMenu();
        this.saveColorsToStore(false);
    };

    this.setDefaultCheckboxAndMenu = () => {
        let allWhoIsHereColor = this.wnd.$.find('.who-is-here-color');

        allWhoIsHereColor.each(function() {
            let $oneWhoIsHereColor = $(this);
            //let $menu               = $oneWhoIsHereColor.find('.menu');
            //let $ch                 = $oneWhoIsHereColor.find('.checkbox');
            let state = 1;

            self.showPaleteAndCheckbox($oneWhoIsHereColor, state);
            //$ch.addClass('active');
            //$menu.find('.option').removeClass('active');
            //$menu.find('.option[value=' + state + ']').addClass('active');
        })


        for (let k in glowCheckboxList) {
            glowCheckboxList[k].setChecked(true)
        }

        for (let k in showCheckboxList) {
            showCheckboxList[k].setChecked(true)
        }

    };

    this.setDefaultColor = () => {
        for (let name in allColorPickers) {
            let color = self.getColorFromDefault(name);
            allColorPickers[name].setColorAndUpdate(color)
        }
    };

    //this.initClickPalette = function () {
    //	$(document).on('click', self.hidePalette);
    //};

    //this.destroyClickPalette = function () {
    //	$(document).off('click', self.hidePalette);
    //};

    this.initSaveButton = function() {
        var $btn = tpl.get('button').addClass('green small');
        $btn.find('.label').html(_t('save'));
        this.wnd.$.find('.save-colors').append($btn);
        $btn.click(function() {
            self.saveColorsToStore(true)
        });
    };

    this.centreWnd = function() {
        this.wnd.center();
    };

    this.initLabels = function() {
        var $w = this.wnd.$;
        $w.find('.header').html(_t('players_on_map'));
        $w.find('.show-label').html(_t('show', null, 'whoIsHere'));
        $w.find('.color-label').html(_t('color', null, 'whoIsHere'));
        $w.find('.show-map-label').html(_t('lighting', null, 'whoIsHere'));
    };

    this.initWindow = function() {
        content = tpl.get('who-is-here-edit');


        Engine.windowManager.add({
            content: content,
            title: _t('option'),
            //nameWindow        : 'editColorPanelWhoIsHere',
            nameWindow: Engine.windowsData.name.EDIT_COLOR_PANEL_WHO_IS_HERE,
            objParent: this,
            nameRefInParent: 'wnd',
            onclose: () => {
                this.close();
            }
        });
        this.wnd.addToAlertLayer();


    };

    this.initNamesTab = function() {
        // namesTab = [
        // 	'hero',
        // 	'normal_players',
        // 	'friends',
        // 	'enemies',
        // 	'clan-members',
        // 	'clan-friends',
        // 	'clan-enemies',
        // 	'groups'
        // ];
        namesTab = [
            WhoIsHereData.NAME.HERO,
            WhoIsHereData.NAME.NORMAL_PLAYERS,
            WhoIsHereData.NAME.FRIENDS,
            WhoIsHereData.NAME.ENEMIES,
            WhoIsHereData.NAME.CLAN_MEMBERS,
            WhoIsHereData.NAME.CLAN_FRIENDS,
            WhoIsHereData.NAME.CLAN_ENEMIES,
            WhoIsHereData.NAME.GROUPS
        ]
    };

    //this.initColorsTab = function () {
    //	standardColors = [
    //		'#fc3e40',
    //		'#767676',
    //		'#87fdff',
    //		'#93441c',
    //		'#4cfa4f',
    //		'#fe5afb',
    //		'#40bfff',
    //		'#f37125',
    //		'#a500fc',
    //		'#ffba37',
    //		'#eaeaea',
    //		'#93b900',
    //		'#fef348',
    //		'#3559ff',
    //		'#c71618',
    //		'#ffa9fe',
    //		'#46a31d',
    //		'#292929'
    //	];
    //};

    this.initAllOptions = function() {
        var $wrapper = this.wnd.$.find('.all-colors');
        for (var i = 0; i < namesTab.length; i++) {
            this.createOneColor(namesTab[i], $wrapper);
        }
    };

    this.createOneColor = function(name, $wrapper) {
        let $oneC = tpl.get('who-is-here-color');

        $oneC.attr('id', name);
        $wrapper.append($oneC);
        $oneC.find('.text').html(_t(name, null, 'whoIsHere'));

        createColorPicker($oneC, name);

        if (name != WhoIsHereData.NAME.HERO) {
            let $showCheckboxWrapper = $oneC.find('.show-checkbox-wrapper');
            let state = this.getStateFromStorage(name);
            let idShowCheckBox = getShowCheckBoxId(name);

            createWhoisHereCheckBox(state, idShowCheckBox, $showCheckboxWrapper, "SHOW", function(checkBoxState) {
                self.showPaleteAndCheckbox($oneC, checkBoxState);
            });

            this.showPaleteAndCheckbox($oneC, state);
        }

        let $glowCheckboxWrapper = $oneC.find('.glow-checkbox-wrapper');
        let mapState = this.getMapStateFromStorage(name);
        let idGlowCheckBox = getGlowCheckBoxId(name);

        createWhoisHereCheckBox(mapState, idGlowCheckBox, $glowCheckboxWrapper, "GLOW");
    };

    const getGlowCheckBoxId = (name) => {
        return name + "-glow-checbox-who-is-here";
    };

    const getShowCheckBoxId = (name) => {
        return name + "-show-checbox-who-is-here";
    };

    const addToGlowCheckBoxList = (id, checkBox) => {
        glowCheckboxList[id] = checkBox;
    };

    const getGlowCheckBoxFromList = (id) => {
        return glowCheckboxList[id];
    };

    const addToShowCheckBoxList = (id, checkBox) => {
        showCheckboxList[id] = checkBox;
    };

    const getShowCheckBoxFromList = (id) => {
        return showCheckboxList[id];
    };

    const createWhoisHereCheckBox = (state, id, $content, kind, clb) => {
        const checkbox = new Checkbox.default({
                name: ``,
                label: ` `,
                value: ``,
                i: id,
                checked: state,
                //highlight             : false
            },
            (state) => {
                if (!clb) return;
                clb(state);
                //outsideChatCheckBox.setChecked(e.target.checked ? false : true)
            }
        );

        $content.append($(checkbox.getCheckbox()));

        if (kind == "GLOW") addToGlowCheckBoxList(id, checkbox);
        if (kind == "SHOW") addToShowCheckBoxList(id, checkbox);
    }

    const createColorPicker = ($oneC, name) => {
        let colorPicker = new ColorPicker();
        let $wrapper = $oneC.find('.choose-color-wrapper');

        var color = this.getColorFromStore(name);

        colorPicker.init();
        colorPicker.updateData($wrapper, color, null);

        allColorPickers[name] = colorPicker;
    }

    this.showPaleteAndCheckbox = function($oneC, state) {
        var $showOrHideElements = $oneC.find('.choose-color-wrapper,.glow-checkbox-wrapper');
        if (state) $showOrHideElements.removeClass('hide');
        else $showOrHideElements.addClass('hide');
    };

    //this.createPalete = function ($oneC) {
    //	var $palete = $oneC.find('.pick-color');
    //	//var $f = $('<div>').addClass('first-column');
    //	//var $s = $('<div>').addClass('second-column');
    //	var $f = tpl.get('first-column-who-is-here');
    //	var $s = tpl.get('second-column-who-is-here');
    //	$palete.append($f, $s);
    //	for (var i = 0; i < standardColors.length; i++ ) {
    //		this.createOneColorOnPalete($f, $s, i);
    //	}
    //};

    //this.createOneColorOnPalete = function ($f, $s, i) {
    //	//var $color = $('<div>').addClass('color-to-choose');
    //	var $color = tpl.get('color-to-choose-who-is-here');
    //	var color = standardColors[i];
    //	$color.css('background', color);
    //	$color.data('color', color);
    //	i < 9 ? $f.append($color) : $s.append($color);
    //	$color.click(function () {
    //		var name = $(this).parent().parent().parent().attr('id');
    //		var color = $(this).data('color');
    //		self.wnd.$.find('.pick-color').css('display', 'none');
    //		self.setColorOfBck(name, color);
    //	});
    //};

    //this.createButtons = function ($oneC, name) {
    //	var btn1 = tpl.get('button').addClass('small green').click(function (e) {
    //		e.stopPropagation();
    //		self.hidePalette();
    //		$oneC.find('.pick-color').css('display', 'block');
    //	});
    //
    //	btn1.find('.label').html('1');
    //	btn1.append(tpl.get('dynamic-bck'));
    //	$oneC.find('.open-palette').append(btn1);
    //
    //};

    //this.hidePalette = function () {
    //	self.wnd.$.find('.pick-color').css('display', 'none');
    //};

    this.getColorFromDefault = function(name) {
        return "#" + Engine.whoIsHere.getDefaultColor(name);
    };

    this.getColorFromStore = function(name) {
        //var store = Store.get('whoIsHere/' + name + '/color');
        // let store = Engine.serverStorage.get('whoIsHere', name, 'color');
        // let store = Engine.serverStorage.get(ServerStorageData.WHO_IS_HERE, name, 'color');
        let store = Engine.serverStorage.get(ServerStorageData.WHO_IS_HERE, name, WhoIsHereData.ATTR.COLOR);
        if (store) return store;
        else {
            var w = self.getColorFromDefault(name);
            //Store.set('whoIsHere/' + name + '/color', w);
            return w;
        }
    };

    this.getStateFromStorage = function(name) {
        //var store = Store.get('whoIsHere/' + name + '/state');
        // let store = Engine.serverStorage.get('whoIsHere', name, 'state');
        // let store = Engine.serverStorage.get(ServerStorageData.WHO_IS_HERE, name, 'state');
        let store = Engine.serverStorage.get(ServerStorageData.WHO_IS_HERE, name, WhoIsHereData.ATTR.STATE);
        if (store !== null) return store;
        else {
            var state = true;
            //Store.set('whoIsHere/' + name + '/state', state);
            return state;
        }
    };

    this.getMapStateFromStorage = function(name) {
        //var store = Store.get('whoIsHere/' + name + '/mapState');
        // let store = Engine.serverStorage.get('whoIsHere', name, 'mapState');
        // let store = Engine.serverStorage.get(ServerStorageData.WHO_IS_HERE, name, 'mapState');
        let store = Engine.serverStorage.get(ServerStorageData.WHO_IS_HERE, name, WhoIsHereData.ATTR.MAP_STATE);
        if (store !== null) return store;
        else {
            // var mapState = name == 'normal_players' ? false : true;
            var mapState = name == WhoIsHereData.NAME.NORMAL_PLAYERS ? false : true;
            //Store.set('whoIsHere/' + name + '/mapState', mapState);
            return mapState;
        }
    };

    //this.setColorOfBck = function (name, color) {
    //	var $e = this.wnd.$.find('#' + name).find('.open-palette').find('.bck');
    //	$e.css('background-color', color);
    //	$e.data('color', color);
    //};

    this.close = function() {
        //self.destroyClickPalette();

        self.wnd.remove();
        Engine.whoIsHere.editColorPanel = null;

    };

    this.saveColorsToStore = function(close) {
        let objToSendToServerStorage = {};

        for (var i = 0; i < namesTab.length; i++) {

            let name = namesTab[i];
            let color = getColorFromAllColorPickers(name);
            let glowCheckBox = getGlowCheckBoxFromList(getGlowCheckBoxId(name));
            let showCheckBox = getShowCheckBoxFromList(getShowCheckBoxId(name));
            let mapState = glowCheckBox.getChecked();
            let showState = name == WhoIsHereData.NAME.HERO ? true : showCheckBox.getChecked();

            objToSendToServerStorage[name] = {
                [WhoIsHereData.ATTR.STATE]: showState,
                [WhoIsHereData.ATTR.COLOR]: color,
                [WhoIsHereData.ATTR.MAP_STATE]: mapState
            };
        }

        Engine.serverStorage.sendData({
            [ServerStorageData.WHO_IS_HERE]: objToSendToServerStorage
        }, function() {

            Engine.whoIsHere.updateWhoIsHereAfterSaveInServerStorage();
            if (close) self.close();
        });

    };

};