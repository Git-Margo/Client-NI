var tpl = require('@core/Templates');
var CodeProm = require('@core/CodeProm');
var DraconiteShop = require('@core/shop/DraconiteShop');
var StaminaShop = require('@core/shop/StaminaShop');
module.exports = function() {
    var self = this;
    var content;

    this.init = function() {
        this.initWindow();
        this.initGrid();
        this.updateSl();
        this.createBottomPanel();
        this.center();
    };

    this.updateSl = function() {
        var sl = Engine.hero.d.credits;
        content.find('.sl-amount').html(sl);
    };

    this.center = function() {
        this.wnd.center();
    };

    this.showCodeProm = function() {
        if (!Engine.codeProm) Engine.codeProm = new CodeProm();
        Engine.codeProm.initAskAlert();
    };

    this.showStaminaShop = function() {
        Engine.staminaShop = new StaminaShop();
        Engine.staminaShop.init();
    };

    this.addControll = function(label, where, callback) {
        var $btn = tpl.get('button');
        if (callback) $btn.click(callback.bind(self));
        $btn.find('.label').html(label);
        this.wnd.find(where).append($btn);
        return $btn;
    };

    this.initGrid = function() {
        var tab = {
            [CFG.LANG.PL]: [
                [{
                        name: 'chest',
                        txt: 0,
                        npcPhone: 'chests'
                    },
                    {
                        name: 'consumtable',
                        txt: 12,
                        npcPhone: 304
                    },
                    {
                        name: 'helmets',
                        txt: 5,
                        npcPhone: 301
                    },
                    {
                        name: 'gold-shop',
                        txt: 3,
                        npcPhone: 'gold'
                    }
                ],
                [{
                        name: 'for-you',
                        txt: 21,
                        npcPhone: 'for-you'
                    },
                    {
                        name: 'rings',
                        txt: 9,
                        npcPhone: 299
                    },
                    {
                        name: 'necklaces',
                        txt: 8,
                        npcPhone: 302
                    },
                    {
                        name: 'gloves',
                        txt: 6,
                        npcPhone: 296
                    },

                ],
                [{
                        name: 'outfits',
                        txt: 14,
                        npcPhone: 293
                    },
                    {
                        name: 'pets',
                        txt: 13,
                        npcPhone: 295
                    },
                    {
                        name: 'armor',
                        txt: 7,
                        npcPhone: 298
                    },
                    {
                        name: 'upgrades',
                        txt: 1,
                        npcPhone: 306
                    },
                    // {name:'arrows', txt:10, npcPhone: 303},
                ],
                [{
                        name: 'teleports',
                        txt: 11,
                        npcPhone: 294
                    },
                    {
                        name: 'stamina',
                        txt: 2,
                        npcPhone: 'stamina'
                    },
                    {
                        name: 'boots',
                        txt: 4,
                        npcPhone: 297
                    },
                    {
                        name: 'bags',
                        txt: 15,
                        npcPhone: 300
                    }
                ]
            ],
            [CFG.LANG.EN]: [
                [{
                        name: 'chest',
                        txt: 0,
                        npcPhone: 191
                    },
                    {
                        name: 'sales',
                        txt: 20,
                        npcPhone: 190
                    },
                    {
                        name: 'stamina',
                        txt: 2,
                        npcPhone: 'stamina'
                    },
                ],
                [{
                        name: 'potions',
                        txt: 16,
                        npcPhone: 154
                    },
                    {
                        name: 'upgrades',
                        txt: 1,
                        npcPhone: 155
                    },
                    {
                        name: 'gold-shop',
                        txt: 3,
                        npcPhone: 'gold'
                    }
                ],
                [{
                        name: 'blessing',
                        txt: 18,
                        npcPhone: 164
                    },
                    {
                        name: 'teleports',
                        txt: 11,
                        npcPhone: 163
                    },
                    {
                        name: 'pets',
                        txt: 13,
                        npcPhone: 165
                    }
                ],
                [{
                        name: 'outfits',
                        txt: 14,
                        npcPhone: 166
                    },
                    {
                        name: 'bags',
                        txt: 15,
                        npcPhone: 167
                    },
                    {
                        name: 'boots',
                        txt: 22,
                        npcPhone: 400
                    },
                ]
            ]
        };
        var lang = _l();
        var newTab = tab[lang];
        var amountColumn = newTab.length;
        for (var i = 0; i < amountColumn; i++) {
            var $wrapper = tpl.get('premium-item-wrapper');
            self.wnd.$.find('.product-kind').append($wrapper);
            for (var k in newTab[i]) {
                var obj = newTab[i][k];
                var $o = tpl.get('premium-item').addClass(obj.name);
                var str = _t('new_premium_item_' + obj.txt, null, 'premium_panel');
                $o.find('.premium-text').html(str);
                self.clickShop($o, obj.npcPhone);
                $wrapper.append($o);
            }
        }
    };

    this.clickShop = function($o, which) {
        $o.click(function(e) {
            e.stopPropagation();
            self.allShopsClosed();
            self.showShop(which);
        });
    };

    this.allShopsClosed = function() {
        var t = [
            Engine.shop,
            Engine.staminaShop,
            Engine.goldShop,
            Engine.chests,
            Engine.promo
        ];
        for (var i = 0; i < t.length; i++) {
            if (t[i]) t[i].hide();
        }
    };

    this.showShop = function(choice) {
        if (choice == 'gold') _g('creditshop&credits_gold=-1');
        if (choice == 'stamina') self.showStaminaShop();
        if (choice == 'chests') _g('creditshop&npc=436');
        if (choice == 'for-you') _g('creditshop&filters=1&npc=479&filterlvlunder=10&filterlvlabove=5');
        if (typeof(choice) == 'number') _g('creditshop&npc=' + choice);
    };

    this.initWindow = function() {
        content = tpl.get('premium-panel');
        content.find('.background').addClass('bck-' + _l());

        Engine.windowManager.add({
            content: content,
            title: this.tLang('premium_shop'),
            //nameWindow        : 'premiumWnd',
            nameWindow: Engine.windowsData.name.PREMIUM_WND,
            widget: Engine.widgetsData.name.PREMIUM,
            objParent: this,
            nameRefInParent: 'wnd',
            onclose: () => {
                self.close();
            }
        });

        this.wnd.addToAlertLayer();
        this.wnd.show();
    };

    this.createBottomPanel = function() {
        var $buyBut = tpl.get('button').addClass('small purple');
        $buyBut.find('.label').text(_t('buy_sl', null, 'shop'));
        $buyBut.click(function(e) {
            e.stopPropagation();
            if (Engine.draconiteShop) return;
            Engine.draconiteShop = new DraconiteShop();
            Engine.draconiteShop.open();
        });

        self.wnd.$.find('.premium-bottom-panel').addClass(_l());

        var $codeBut = tpl.get('button').addClass('small purple');
        $codeBut.find('.label').text(_t('have_code', null, 'premium_panel'));
        $codeBut.click(self.showCodeProm);

        self.wnd.$.find('.buy-currency').append($buyBut);
        self.wnd.$.find('.recover-items').append($codeBut);

        var str = _t('buy_sl_label', null, 'shop');
        self.wnd.$.find('.currency-label').html(str);
        //self.wnd.$.find('.chest').addClass('sl');
        self.wnd.$.find('.chest').addClass('interface-element-chest-sl');
    };

    this.close = function() {
        //self.wnd.$.remove();
        self.wnd.remove();
        Engine.premium = false;
        //delete (self.wnd);
        //delete(self);
    };

    this.tLang = function(name, other) {
        return _t(name, null, other ? other : 'premium_panel');
    };

    //this.init();

};