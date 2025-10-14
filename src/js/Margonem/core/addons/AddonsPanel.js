var tpl = require('@core/Templates');
var ServerStorageData = require('@core/storage/ServerStorageData');
var AddonsData = require('@core/addons/AddonsData');

let addonsScripts = {
    addon_1: require('@core/addons/addonList/1.js'),
    addon_2: require('@core/addons/addonList/2.js'),
    addon_3: require('@core/addons/addonList/3.js'),
    addon_5: require('@core/addons/addonList/5.js'),
    addon_7: require('@core/addons/addonList/7.js'),
    addon_8: require('@core/addons/addonList/8.js'),
    addon_11: require('@core/addons/addonList/11.js'),
    addon_12: require('@core/addons/addonList/12.js'),
    addon_17: require('@core/addons/addonList/17.js'),
    addon_19: require('@core/addons/addonList/19.js'),
    addon_21: require('@core/addons/addonList/21.js'),
    addon_24: require('@core/addons/addonList/24.js'),
    addon_25: require('@core/addons/addonList/25.js'),
    addon_27: require('@core/addons/addonList/27.js'),
    addon_28: require('@core/addons/addonList/28.js')
};

if (!getMobile() && !isIframe()) {
    addonsScripts.addon_29 = require('@core/addons/addonList/29.js')
}

module.exports = function() {
    var content;
    var self = this;
    var list = {};
    // this.showAddon = null;

    this.exceptionClearDataAddons = [27];

    this.init = function() {
        self.initWindow();
        self.centerWindow();
        self.initLabels();
        self.initSearch();
        self.initScrollsBar();
        self.createAddonList();
        //Engine.widgetManager.addWidgetButtonsWithInitZoom();
    };

    this.initWindow = function() {
        content = tpl.get('addons-panel');

        Engine.windowManager.add({
            content: content,
            title: self.tLang('extend'),
            nameWindow: Engine.windowsData.name.ADDONS,
            widget: Engine.widgetsData.name.ADDONS,
            objParent: this,
            nameRefInParent: 'wnd',
            startVH: 60,
            cssVH: 60,
            onclose: () => {
                this.manageVisible();
            }
        });

        this.wnd.addToAlertLayer();
        this.wnd.hide();
    };

    this.getList = function() {
        return list;
    };

    this.onResize = () => {
        const addons = Engine.addonsPanel.getList();
        Object.keys(addons).map(key => {
            const onResizeFn = addons[key].onResize
            if (isset(onResizeFn)) onResizeFn();
        })
    }

    this.initLabels = function() {
        var $w = this.wnd.$;
        $w.find('.addon-header-label').html(_t('iconpuzzle'));
        $w.find('.addon-list-label').html(_t('addon_list_h2', null, 'static'));
    };

    this.manageVisible = function() {
        let isShow = self.wnd.isShow();
        if (!isShow) {
            self.wnd.show();
            self.updateScroll();
            self.wnd.setWndOnPeak();
            Engine.widgetManager.setEditableWidget(true);
        } else {
            self.wnd.hide();
            Engine.widgetManager.setEditableWidget(false);
        }
    };

    this.getAddonIdKey = (id) => {
        return 'addon_' + id
    };

    this.oneAddonManageVisible = (id) => {
        let addonKey = self.getAddonIdKey(id);
        this.addonManageVisible(addonKey);
    };

    this.initScrollsBar = function() {
        $('.left-scroll', content).addScrollBar({
            track: true
        });
        $('.right-scroll', content).addScrollBar({
            track: true
        });
    };

    this.updateScroll = function() {
        $('.left-scroll', content).trigger('update');
        $('.right-scroll', content).trigger('update');
    };

    this.centerWindow = function() {
        this.wnd.center();
    };

    this.createAddonList = function() {
        let data = AddonsData;
        let newData = self.sortData(data);

        for (var i = 0; i < newData.length; i++) {
            var oneData = newData[i];
            var id = oneData.id;
            this.createOneAddonOnList(oneData, id);
            this.createOneAddonDescription(oneData, id);
        }
    };

    this.sortData = function(data) {
        var arr = [];
        for (var k in data) {
            arr.push($.extend(data[k], {
                'id': k
            }));
        }
        arr.sort(function(a, b) {
            var nA = a[_l()].name;
            var nB = b[_l()].name;
            return (nA < nB) ? -1 : (nA > nB) ? 1 : 0;
        });
        return arr;
    };

    this.createOneAddonOnList = function(oneData, id) {
        var $oneAddon = tpl.get('one-addon-on-list').addClass('addon-on-list-' + id);
        var $w = self.wnd.$;
        var name = oneData[_l()]['name'];
        var opt = oneData.options;
        var bckStr = self.createBackgroundString(oneData.image);
        let $widgetButton = $oneAddon.find('.widget-button');
        let widgetManager = getEngine().widgetManager;
        let widgetSize = widgetManager.getWidgetSize(Engine.widgetsData.IN_WINDOW);

        widgetManager.set$BtnWidgetSize($widgetButton, widgetSize);

        $w.find('.addon-list').append($oneAddon);
        self.setWindgetColor(id, self.getStorageStateOfAddon(id));
        $oneAddon.find('.addon-img').css('background', bckStr);
        $oneAddon.find('.addon-title').html(name);

        $oneAddon.click(function() {
            let $icon = $w.find('.addon-header-img');
            let $parent = $icon.parent();
            let widgetSize = widgetManager.getWidgetSize(Engine.widgetsData.IN_WINDOW);

            widgetManager.set$BtnWidgetSize($parent, widgetSize);

            $parent.unbind('click');
            if ($parent.hasClass('ui-draggable')) {
                $parent.draggable("destroy");
                $parent.parent().find('.border-blink').remove();
                $parent.tip('');
            }

            if (opt) {
                $parent.addClass('from-addon-panel');
                //$parent.data(Engine.widgetsData.data.WIDGET_KEY, self.getAddonIdKey(id));
                var $borderBlink = tpl.get('border-blink');

                $parent.parent().prepend($borderBlink);

                getEngine().widgetManager.addDraggableAndDataAndTip($parent, _t('drag_and_drop_widget'), Engine.widgetsData.data.WIDGET_KEY, self.getAddonIdKey(id))

                //$parent.tip(_t('drag_and_drop_widget'));
                //$parent.draggable({
                //	helper: 'clone',
                //	cursorAt: {
                //		top: 16,
                //		left: 16
                //	},
                //	scroll: false,
                //	zIndex: 20
                //});
                $parent.bind('click', function() {
                    let newState = !self.getStorageStateOfAddon(id);
                    if (newState) self.setStateAddon(oneData, true, id, true, true);
                    else self.oneAddonManageVisible(id);
                });
            }
            $w.find('.addon-header').css('display', 'table');
            $w.find('.addon-header-title').html(name);
            $w.find('.addon-header-img').css('background', bckStr);
            $w.find('.one-addon-description').css('display', 'none');
            $w.find('.desc-' + id).css('display', 'block');
            self.setWindgetColor(id, self.getStorageStateOfAddon(id));
            self.updateScroll();
        });
    };

    this.createBackgroundString = function(data) {
        var splitData = data.split('|');
        var str = `url(${splitData[0]}?v=${__build.version})`;

        if (splitData.length == 1) return str;

        var pos = (splitData[1]).split(' ');
        str += ' ' + pos[0] + 'px ' + pos[1] + 'px';

        return str;
    };

    this.setButtonState = function(id, state) {
        var str = self.tLang(state ? 'turn_off' : 'turn_on');
        self.wnd.$.find('.desc-' + id).find('.label').html(str);
    };

    this.setWindgetColor = function(id, state) {
        var widget1 = self.wnd.$.find('.addon-header').find('.widget-button');
        var widget2 = self.wnd.$.find('.addon-on-list-' + id).find('.widget-button');

        let t = Engine.widgetsData.type;
        let typesToRemove = Engine.widgetManager.addSeveralTypesToWidget(t.RED, t.GREEN);

        widget1.add(widget2).removeClass(typesToRemove).addClass(state ? t.GREEN : t.RED);
    };

    this.getStorageStateOfAddon = function(id) {
        return Engine.serverStorage.get(ServerStorageData.ADDONS, id, 'state');
    };

    this.createOneAddonDescription = function(oneData, id) {
        var $oneADesc = tpl.get('one-addon-description').addClass('desc-' + id);
        var state = this.getStorageStateOfAddon(id);
        var description = oneData[_l()]['description'];

        self.wnd.$.find('.right-scroll>.scroll-pane').append($oneADesc);
        self.createOnOffButton($oneADesc, oneData, state);
        $oneADesc.find('.description-text').html(description);

        if (oneData.options == 0) return;
        $oneADesc.find('.drag-info').css('display', 'block');

        if (state) {
            var store = Engine.serverStorage.get(Engine.widgetManager.getPathToHotWidgetVersion(), self.getAddonIdKey(id));

            if (store) self.addKeyToWidgets(id, store, oneData[_l()]['name']);
        }
    };

    this.createOnOffButton = function($oneADesc, data, state) {
        let id = data.id;
        let $b = tpl.get('button').addClass('green small');

        $b.click(function() {
            self.toggleStateAddon(data);
        });

        $oneADesc.find('.on-off-button').append($b);
        self.setButtonState(id, state);

        if (state) self.startAddonScript(data, id);
    };

    this.toggleStateAddon = function(data) {
        let id = data.id;
        let newState = !self.getStorageStateOfAddon(id);

        if (!data.options) {
            self.setStateAddon(data, newState, id, true);
            return;
        }

        self.setStateAddon(data, newState, id, true);
    };

    this.setStateAddon = function(data, state, id, save, manageWnd) {
        if (state) self.startAddonScript(data, id, save, manageWnd);
        else self.turnOffAddon(id);
    };

    this.startAddonScript = (data, id, save, manageWnd) => {

        let addonKey = self.getAddonIdKey(id);
        let newAddon = new addonsScripts[addonKey]

        if (!this.checkAddonOnList(addonKey)) self.addToList(addonKey, newAddon);

        if (save) self.saveAddonAndWidgetInServerStorageAndRunAddon(data, id, manageWnd);
        else self.dontSaveAddonAndRunAddon(data, id, manageWnd);
    }

    this.dontSaveAddonAndRunAddon = (data, id, manageWnd) => {
        let addonKey = self.getAddonIdKey(id);

        this.addonStart(addonKey)
        this.setButtonState(id, true);
        this.setWindgetColor(id, true);
        if (manageWnd) this.oneAddonManageVisible(id);
    };

    this.saveAddonAndWidgetInServerStorageAndRunAddon = (data, id, manageWnd) => {
        let objToSend = {
            [ServerStorageData.ADDONS]: {}
        };

        objToSend[ServerStorageData.ADDONS][id] = {
            state: true
        };

        let firstEmptyWidgetSlot = null;

        if (data.options) {
            firstEmptyWidgetSlot = Engine.widgetManager.getFirstEmptyWidgetSlot();
            self.prepareDataToSendToServerStorage(id, objToSend, firstEmptyWidgetSlot)
        }

        Engine.serverStorage.sendData(objToSend, function() {
            let addonKey = self.getAddonIdKey(id);

            self.addonStart(addonKey)

            if (firstEmptyWidgetSlot) self.addWidgetAfterSaveInServerStorage(id, firstEmptyWidgetSlot);

            self.setButtonState(id, true);
            self.setWindgetColor(id, true);

            if (manageWnd) self.oneAddonManageVisible(id);
        });
    };

    this.getAddonTitle = (id) => {
        return self.wnd.$.find('.addon-on-list-' + id).find('.addon-title').html();
    };

    this.prepareDataToSendToServerStorage = (id, objToSend, firstEmptyWidgetSlot) => {
        let firstKey = Engine.widgetManager.getPathToHotWidgetVersion();
        let secondKey = self.getAddonIdKey(id);

        let objToSendToServerStorage = {};
        objToSendToServerStorage[firstKey] = {};
        objToSendToServerStorage[firstKey][secondKey] = [firstEmptyWidgetSlot.slot, firstEmptyWidgetSlot.container];

        objToSend[firstKey] = {};
        objToSend[firstKey][secondKey] = [firstEmptyWidgetSlot.slot, firstEmptyWidgetSlot.container];
    };

    this.addWidgetAfterSaveInServerStorage = (id, obj) => {
        let title = Engine.addonsPanel.getAddonTitle(id);
        let addonKey = self.getAddonIdKey(id);
        let GREEN = Engine.widgetsData.type.GREEN;
        let widgets = Engine.widgetManager.getDefaultWidgetSet();

        Engine.widgetManager.addKeyToDefaultWidgetSet(addonKey, obj.slot, obj.container, title, GREEN, function() {
            self.oneAddonManageVisible(id);
        });
        Engine.widgetManager.addWidgetButtons();
        Engine.widgetManager.widgetDrop(widgets[addonKey].txt, obj.container + ' ' + obj.slot);
    };

    this.turnOffAddon = function(id) {
        self.removeWidgetButton(id);

        var str = self.tLang('empty');
        let objToSendToServerStorage = {};
        let firstKey = Engine.widgetManager.getPathToHotWidgetVersion();
        let deepKey = self.getAddonIdKey(id);

        objToSendToServerStorage[ServerStorageData.ADDONS] = {};
        objToSendToServerStorage[ServerStorageData.ADDONS][id] = {
            'state': false
        };

        objToSendToServerStorage[firstKey] = {};
        objToSendToServerStorage[firstKey][deepKey] = false;

        Engine.serverStorage.sendData(objToSendToServerStorage, function() {
            self.setButtonState(id, false);
            self.setWindgetColor(id, false);
            self.stopAddonProcedure(id, str);
            if (!self.exceptionClearDataAddons.includes(parseInt(id))) Engine.serverStorage.clearDataBySpecificKey(deepKey);
        });

    };

    this.stopAddonProcedure = (id, str) => {
        let addonKey = self.getAddonIdKey(id);

        this.addonStop(addonKey);
        this.removeFromList(addonKey);

        self.wnd.$.find('.desc-' + id).find('.location-menu>.menu-option').attr('value', 0).html(str);
    };

    this.addonStart = (addonKey) => {
        list[addonKey].start();
    }

    this.addonStop = (addonKey) => {
        list[addonKey].stop();
    }

    this.addonManageVisible = (addonKey) => {
        list[addonKey].manageVisible()
    }

    this.addToList = (addonKey, addon) => {
        list[addonKey] = addon;
    }

    this.checkAddonOnList = (addonKey, addon) => {
        return list[addonKey] ? true : false;
    }

    this.removeFromList = (addonKey) => {
        delete list[addonKey];
    }

    this.addKeyToWidgets = function(id, store, text) {
        let addonKey = self.getAddonIdKey(id);
        let GREEN = Engine.widgetsData.type.GREEN;

        Engine.widgetManager.addKeyToDefaultWidgetSet(addonKey, store[0], store[1], text, GREEN, function() {
            self.oneAddonManageVisible(id);
        });
    };

    this.removeWidgetButton = function(id) {
        let addonKey = self.getAddonIdKey(id);
        Engine.interface.get$interfaceLayer().find('.' + addonKey).parent().remove();
    };

    this.initSearch = function() {
        var $search = this.wnd.$.find('.search'),
            $searchX = this.wnd.$.find('.search-x');
        $search.keyup(function() {
            var v = $(this).val();
            var $allAddons = self.wnd.$.find('.one-addon-on-list');
            if (v == '') $allAddons.css('display', 'block');
            else {
                $allAddons.each(function() {
                    var txt = ($(this).find('.addon-title').html()).toLowerCase();
                    var disp = txt.search(v.toLowerCase()) > -1 ? 'block' : 'none';
                    $(this).css('display', disp);
                    self.updateScroll();
                });
            }
        });
        $search.attr('placeholder', _t('search'));
        $searchX.on('click', function() {
            $search.val('')
                .blur()
                .trigger('keyup');
        });
    };

    this.close = function() {

    };

    this.getContent = () => {
        return content;
    }

    this.tLang = function(name) {
        return _t(name, null, 'extManager');
    };

    this.checkRainbowGroups = () => {
        return Engine.addonsPanel.checkAddonOnList("addon_21");
    }

    this.getRainbowGroups = () => {
        return list["addon_21"];
    }

};