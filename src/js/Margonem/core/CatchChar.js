//var Window = require('core/Window');
var Tpl = require('core/Templates');
//var Items = require('core/items/ItemsManager');
// var Store = require('core/Storage');
//var wnd = require('core/Window');
module.exports = function(clbName, char) {
    var self = this;

    this.init = function() {
        self.initWindow();
        self.initHeader();
        self.initKeyDown();
        self.createCancelButton();
        self.createEmptyButton();
        self.wnd.center();
    };

    this.initWindow = function() {

        Engine.windowManager.add({
            content: Tpl.get('catch-char'),
            title: _t('catch-char'),
            nameWindow: Engine.windowsData.name.CATCH_CHAR,
            objParent: self,
            nameRefInParent: 'wnd',
            onclose: () => {
                $(document).off('keydown', self.keyDown);
                self.close();
            }
        });
        self.wnd.addToAlertLayer();
    };

    this.initHeader = function() {
        this.wnd.$.find('.give-char').html(_t('new-char'));
    };

    this.initKeyDown = function() {
        $(document).on('keydown', self.keyDown);
    };

    this.createCancelButton = function() {
        var $btn = Tpl.get('button').addClass('green small');
        $btn.find('.label').html(_t('cancel'));
        $btn.click(function() {
            $(document).off('keydown', self.keyDown);
            self.close();
        });
        this.wnd.$.find('.cancel-char').append($btn)
    };

    this.createEmptyButton = function() {
        var $btn = Tpl.get('button').addClass('green small');
        $btn.find('.label').html(_t('none'));
        $btn.click(function() {
            $(document).off('keydown', self.keyDown);
            if (!Engine.settings.canSendNewValue('', char, clbName)) {
                self.close();
                return;
            }

            Engine.settings.sendNewValue(false, clbName, function() {
                Engine.settings.updateHotKeys();
                self.close();
            });

        });
        this.wnd.$.find('.cancel-char').append($btn)
    };

    this.overrideAlert = (key) => {
        let overrideHotKeyName = _t(Engine.hotKeys.hotKeys[key]);
        let txt = _t("overrideHotKey", {
            '%key%': key,
            '%old%': overrideHotKeyName
        });

        confirmWithTwoCallback({
            msg: txt,
            clb1: () => {
                self.saveKeyToServerStorage(key, clbName);
            },
            clb2: () => {
                self.close();
            }
        })
    };

    this.keyDown = function(e1) {
        const key = correctKey(e1.key);
        e1.preventDefault();
        $(document).off('keydown', self.keyDown);

        if (!Engine.settings.canSendNewValue(key, char, clbName)) {
            self.close();
            return;
        }

        if (self.checkKeyIsAlreadyUse(key)) {
            Engine.catchChar = false;
            self.overrideAlert(key)
            return;
        }

        self.saveKeyToServerStorage(key, clbName);
    };

    this.saveKeyToServerStorage = (key, clbName) => {
        Engine.settings.sendNewValue(key, clbName, function() {
            Engine.settings.updateHotKeys();
            self.close();
        });
    };

    this.checkKeyIsAlreadyUse = (key) => {
        return Engine.hotKeys.hotKeys[key] ? true : false;
    };

    this.close = function() {
        Engine.catchChar = false;
        self.wnd.remove();
    };

};