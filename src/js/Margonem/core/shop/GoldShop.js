/**
 * Created by Michnik on 2015-08-11.
 */
var Tpl = require('@core/Templates');
// var Wnd = require('@core/Window');
var DraconiteShop = require('@core/shop/DraconiteShop');
module.exports = function() {
    var self = this;

    this.initWindow = function() {
        // this.wnd = new Wnd({
        // 	content: Tpl.get('gold-shop'),
        // 	title: _t('gold_shop_head_info'),
        // 	onclose: function () {
        // 		self.close();
        // 	}
        // });
        Engine.lock.add('goldShop');
        //$('.alerts-layer').append(this.wnd.$);


        Engine.windowManager.add({
            content: Tpl.get('gold-shop'),
            //nameWindow        : 'gold-shop',
            nameWindow: Engine.windowsData.name.GOLD_SHOP,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('gold_shop_head_info'),
            onclose: () => {
                self.close();
            }
        });
        this.wnd.addToAlertLayer();

        this.wnd.center();
        //this.wnd.$.show();
        this.wnd.show();
        this.wnd.$.find('.header').html(_t('gold_shop_head_info'));
        this.wnd.$.find('.header-big-label').html(_t('exchangeOffice'));
        //this.languageDifference();
        this.createBtnCallback();
        this.createAllOffer();
        this.updateScroll();
    };

    this.createAllOffer = function() {
        //var t = [
        //	['75', 		'250,000'],
        //	['450', 	'1,500,000'],
        //	['1500',	'5,000,000'],
        //	['3750',	'15,000,000', '750'],
        //	['7500', 	'21,000,000', '2100'],
        //	['15000', '75,000,000', '7500']
        //];
        var t = [
            ['75', '250,000'],
            ['450', '1,500,000'],
            ['1500', '5,000,000'],
            ['3750', '15,000,000'],
            ['7500', '32,000,000'],
            ['15000', '75,000,000']
        ];
        for (var i = 0; i < 6; i++) {
            var d = t[i];
            var $oneOffer = Tpl.get('one-offer').addClass('of-' + i);
            self.wnd.$.find('.scroll-pane').append($oneOffer);
            $oneOffer.find('.sl-header').html(d[0] + ' ' + _t('sl', null, 'clan'));
            $oneOffer.find('.gold-header').html(d[1]);
            self.createButton(d, $oneOffer);
            if (!isset(d[2])) continue;
            var str = _t('save_money %sl%', {
                '%sl%': d[2]
            }, 'shop');
            $oneOffer.find('.save-money').html(str);
        }
    };

    this.createButton = function(d, $oneOffer) {
        var $btn = Tpl.get('button').addClass('green small');
        $btn.find('.label').html(_t('change', null, 'shop'));
        $oneOffer.find('.change-btn').append($btn);
        $btn.click(function() {
            var str1 = _t('gold_buy_confirm %gold%', {
                '%gold%': d[1]
            }, 'default');
            //var str2 = _t('stamina_shop_cost',null, 'default') + '<span class="red">' + d[0] + '</span>';
            var data = {
                ik: "oimg",
                ip: "/draconite_small.gif",
                q: str1,
                //it: str2,
                it: d[0],
                m: "yesno2",
                re: 'creditshop&credits_gold=' + d[0]
            };
            askAlert(data);
        });
        return $btn;
    };

    this.updateScroll = function() {
        var $w = self.wnd.$;
        var $sw = $w.find('.scroll-wrapper');
        $sw.trigger('update');
        var b1 = $sw.find('.middle-graphics').length > 0;
        if (!b1) return;

        //var add = $sw.hasClass('scrollable') ? 23 : 20;
        //var w = $w.find('.scroll-pane').width();
        //$w.find('.middle-graphics').width(w + add);
    };

    this.createBtnCallback = function() {
        this.wnd.$.find('.close-btn').click(self.close);
        this.wnd.$.find('.sl-link').click(function() {
            if (!Engine.draconiteShop) {
                Engine.draconiteShop = new DraconiteShop();
                Engine.draconiteShop.open();
            } else Engine.draconiteShop.close();
        })
    };

    this.update = function(data) {
        data = data.split(';');
        var tmp = null;
        var $goldBox = null;
        var $goldBoxesTable = [];

        for (var i = 0; i < data.length; i++) {
            tmp = data[i].split('=');

            $goldBox = Tpl.get('gold-box');
            $goldBox.addClass('box-' + i);

            $goldBox.find('.sl').html(tmp[0] + _t('sl', null, 'clan'));
            $goldBox.find('.gold-span').html(round(tmp[1], 3));

            $goldBox.click((function(sl, gold) {
                return function() {
                    self.buyGold(sl, gold);
                };
            })(tmp[0], tmp[1]));

            $goldBoxesTable.push($goldBox);
        }
        this.wnd.$.find('.options').append($goldBoxesTable);
    };

    this.buyGold = function(sl, gold) {
        mAlert(_t('gold_buy_confirm %sl% %gold%', {
            '%sl%': sl,
            '%gold%': gold
        }), [{
            txt: _t('yes'),
            callback: function() {
                _g('creditshop&credits_gold=' + sl);
                return true;
            }
        }, {
            txt: _t('no'),
            callback: function() {
                return true;
            }
        }]);
    };

    this.hide = function() {
        self.close();
    };

    this.close = function() {
        //self.wnd.$.remove();
        self.wnd.remove();
        Engine.lock.remove('goldShop');
        Engine.goldShop = false;
        // delete (self.wnd);
        //delete (self);
    };

    this.hideStats = function() {
        $('.extended-stats').removeClass('active');
    };

    this.initButtons = function() {
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
    };

    this.initLabel = function() {
        self.wnd.$.find('.sl-label').html(_t('low_sl', null, 'shop'));
    };

    this.init = function() {
        self.initWindow();
        self.initLabel();
        self.initButtons();
        self.hideStats();
    }
};