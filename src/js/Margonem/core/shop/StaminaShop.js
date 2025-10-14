/**
 * Created by Michnik on 2015-08-11.
 */
var Tpl = require('@core/Templates');
// var Wnd = require('@core/Window');
var DraconiteShop = require('@core/shop/DraconiteShop');
module.exports = function() {
    var self = this;
    var tStamina = [
        _t('for_today', null, 'staminaShop'),
        _t('for_week', null, 'staminaShop'),
        _t('for_30days', null, 'staminaShop')
    ];

    this.init = function() {
        this.initWindow();
        //this.initHeader();
        this.initButs();
        this.initLabels();
        this.initBottomPanel();
    };

    this.initBottomPanel = function() {
        var $btn1 = Tpl.get('button').addClass('purple small');
        var $btn2 = Tpl.get('button').addClass('green small');
        $btn1.find('.label').html(_t('buy_sl', null, 'shop'));
        $btn2.find('.label').html(_t('close', null, 'shop'));
        self.wnd.$.find('.buy-sl-btn').append($btn1);
        self.wnd.$.find('.close-btn').append($btn2);
        $btn1.click(function() {
            if (!Engine.draconiteShop) {
                Engine.draconiteShop = new DraconiteShop();
                Engine.draconiteShop.open();
            } else Engine.draconiteShop.close();
        });
        $btn2.click(self.close);
        self.wnd.$.find('.sl-label').html(_t('low_sl', null, 'shop'));
    };

    this.initWindow = function() {
        // var title = _t('premium_item_2', null, 'premium_panel');
        // this.wnd = new Wnd({
        // 	content: Tpl.get('stamina-shop'),
        // 	title: title,
        // 	onclose: function () {
        // 		self.close();
        // 	}
        // });

        Engine.windowManager.add({
            content: Tpl.get('stamina-shop'),
            //nameWindow        : 'stamina-shop',
            nameWindow: Engine.windowsData.name.STAMINA_SHOP,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('new_premium_item_2', null, 'premium_panel'),
            onclose: () => {
                self.close();
            }
        });

        Engine.lock.add('staminaShop');
        // $('.alerts-layer').append(this.wnd.$);
        this.wnd.addToAlertLayer();
        this.wnd.center();
    };

    this.initHeader = function() {
        var header = _t('stamina_renew_4h', null, 'static');
        this.wnd.$.find('.header').html(header);
    };

    this.initButs = function() {
        //var str = '<span class="paid">' + _t('paid', null, 'staminaShop') +  '</span></span><div class="small-draconite"></div><span class="price">';
        var inc = _t('increase');
        var dec = _t('decrease');
        this.addControll(inc, '.one-day>.but', function() {
            self.howStamina(1, true)
        }).addClass('small purple');
        this.addControll(inc, '.one-week>.but', function() {
            self.howStamina(7, true)
        }).addClass('small purple');

        this.addControll(inc, '.one-month>.but', function() {
            self.howStamina(30, true)
        }).addClass('small purple');

        this.addControll(dec, '.one-day>.but', function() {
            self.howStamina(1)
        }).addClass('small purple');
        this.addControll(dec, '.one-week>.but', function() {
            self.howStamina(7)
        }).addClass('small purple');

        this.addControll(dec, '.one-month>.but', function() {
            self.howStamina(30)
        }).addClass('small purple');
    };

    this.initLabels = function() {
        var $w = this.wnd.$;

        self.updateDescription();

        $w.find('.one-day>.info-label').html(tStamina[0]);
        $w.find('.one-week>.info-label').html(tStamina[1]);
        $w.find('.one-month>.info-label').html(tStamina[2]);
    };

    this.updateDescription = function(newEnd, newDel) {
        var end = newEnd ? newEnd : Engine.hero.d.ttl_end;
        var del = isset(newDel) ? newDel : Engine.hero.d.ttl_del;
        var $desc = this.wnd.$.find('.description1');

        if (!end || end && end < ts() / 1000) $desc.css('display', 'none');
        else {
            $desc.css('display', 'block');
            var state = del == 0 ? _t('stamina_increase') : _t('stamina_decrease');
            $desc.html(state + ' ' + ut_fulltime(end));
        }

    };

    this.howStamina = function(i, increase) {
        var t = [
            _t('stamina_shop choosen_option', null, 'default'),
            _t('stamina_shop_sure', null, 'default'),
            _t('stamina_buy_info_increase', null, 'default'),
            _t('stamina_buy_info-decrease', null, 'default')
        ];
        var obj = {
            '%state%': increase ? _t('add') : _t('sub')
        };
        var newT = {
            1: _t('for_today_desc', obj, 'static'),
            7: _t('for_week_desc', obj, 'static'),
            30: _t('for_30days_desc', obj, 'static')
        };
        var data = {
            re: 'creditshop&ttl_days=' + i + '&ttl_del=' + (increase ? '0' : '1'),
            m: "yesno2",
            q: t[0] + '<br/><br/>' + newT[i] + '<br/><br/>' + (increase ? t[2] : t[3]) + '<br/><br/>' + t[1]
        };
        askAlert(data);
    };

    this.addControll = function(label, where, callback) {
        var $btn = Tpl.get('button');
        if (callback) $btn.click(callback.bind(self));
        $btn.find('.label').html(label);
        this.wnd.$.find(where).append($btn);
        return $btn;
    };

    this.hide = function() {
        self.close();
    };

    this.close = function() {
        //self.wnd.$.remove();
        self.wnd.remove();
        Engine.lock.remove('staminaShop');
        Engine.staminaShop = false;
        // delete (self.wnd);
        //delete (self);
    };

    //this.init();
};