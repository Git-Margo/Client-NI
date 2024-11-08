var tpl = require('core/Templates');
// var Storage = require('core/Storage');
var ServerStorageData = require('core/storage/ServerStorageData.js');
module.exports = function() {
    var self = this;
    var content;
    var goods = {};

    this.init = function() {
        this.initGoods();
        this.initWindow();
        this.initButtonPanel();
        this.initAllCheckbox();
        this.initHeader();
        this.wnd.center();
    };

    this.initHeader = function() {
        content.find('.header').html(_t('no_sell', null, 'shop'));
    };

    this.initGoods = function() {
        let store = Engine.serverStorage.get(ServerStorageData.GREAT_MERCHAMP);

        for (var k in Engine.shop.goods) {

            let state = store != null && isset(store[k]) ? store[k] : Engine.shop.goods[k].state;

            goods[k] = {
                state: state,
                gr: Engine.shop.goods[k].gr
            };
        }
    };

    this.initWindow = function() {

        content = tpl.get('great-merchamp-menu');

        Engine.windowManager.add({
            content: content,
            title: _t('great_merchamp', null, 'shop'),
            nameWindow: Engine.windowsData.name.GREAT_MERCHAMP,
            objParent: this,
            type: Engine.windowsData.type.TRANSPARENT,
            nameRefInParent: 'wnd',
            managePosition: {
                x: '251',
                y: '65'
            },
            addClass: 'greatmerchamp-window',
            onclose: () => {
                this.close();
            }
        });
        this.wnd.addToAlertLayer();

        Engine.greatMerchamp = this;
    };

    this.initButtonPanel = function() {
        var $b1 = tpl.get('button');
        var $b2 = tpl.get('button');
        $b1.add($b2).addClass('small green');
        $b1.find('.label').html(_t('save', null, 'shop'));
        $b2.find('.label').html(_t('cancel', null, 'shop'));
        content.find('.button-pannel').append($b1, $b2);
        $b1.click(function() {
            let objToSendToServerStorage = {};
            self.saveGoodsToStorage(objToSendToServerStorage);

            // Engine.serverStorage.sendData({greatMerchamp:objToSendToServerStorage}, function () {
            Engine.serverStorage.sendData({
                [ServerStorageData.GREAT_MERCHAMP]: objToSendToServerStorage
            }, function() {
                self.close();
            });
        });
        $b2.click(function() {
            self.close();
        });
    };

    this.initAllCheckbox = function() {
        var $wrapper = content.find('.checkbox-list');
        for (var k in goods) {
            this.createCheckbox(k, goods[k].state, goods[k].gr, $wrapper);
        }
    };

    this.saveGoodsToStorage = function(objToSendToServerStorage) {
        var allCheckbox = content.find('.one-checkbox');
        var size = allCheckbox.length;
        for (var i = 0; i < size; i++) {
            var $e = allCheckbox.eq(i);
            var kind = $e.data('kind');
            if (!isset(goods[kind])) continue;
            var state = $e.find('.checkbox').hasClass('active');
            goods[kind].state = state;
            //Storage.set('greatMerchamp/' + kind, state);
            objToSendToServerStorage[kind] = state;
        }
        //allCheckbox.eq(0).data('kind')
    };

    this.createCheckbox = function(name, state, gr, $wrapper) {
        var $oneCheck = tpl.get('one-checkbox');
        var str = _t(name, null, 'greatMerchamp');
        $wrapper.find('.gr-' + gr).append($oneCheck);
        $oneCheck.data('kind', name);
        $oneCheck.find('.checkbox').addClass(state ? 'active' : '');
        $oneCheck.find('.label').html(str);
        $oneCheck.click(function() {
            var $check = $(this).find('.checkbox');
            $check.toggleClass('active');
        });
    };

    this.close = function() {
        //self.wnd.$.remove();
        self.wnd.remove();
        Engine.greatMerchamp = false;
        // delete (self.wnd);
        //delete(self);
    };

    //this.init();
};