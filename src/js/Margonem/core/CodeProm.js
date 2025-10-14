const tpl = require('@core/Templates');
const Button = require('./components/Button');
module.exports = function() {
    var self = this;
    var content;
    var use = false;
    var list = {};
    var code = null;

    this.initPrize = function(v) {
        this.initWindow();
        this.initHeader(v);
        this.checkExpire(v);
        this.checkUse(v);
        this.checkUnique(v);
        this.createList();
        self.wnd.center();
        Engine.lock.add('PromoItems');
    };

    this.initWindow = function() {
        content = tpl.get('code-manager');

        Engine.windowManager.add({
            content: content,
            title: _t('promo_codes', null, 'promocodes'),
            nameWindow: Engine.windowsData.name.CODE_MANAGER,
            objParent: this,
            nameRefInParent: 'wnd',
            onclose: () => {
                self.close();
            }
        });
        this.wnd.addToAlertLayer();
    };

    this.initAskAlert = function() {
        var str = _t('give_promo_code', null, 'codeManager');
        let re = 'codeprom&code=';

        askAlert({
            q: str,
            re: re,
            m: 'inputDataCodeProm'
        });
        if (!mobileCheck()) $('#promo-code-input').focus();
    };

    this.checkUnique = function(v) {
        var str = v.usage_limit != 0 ? _t('promo_use_count %use% %max%', {
            '%use%': v.usage_limit - v.usage_count
        }, 'promocodes') : _t('promo_unlimited %use% %max%', null, 'promocodes');
        this.wnd.$.find('.info-label').html(str);
    };

    this.checkUse = function(v) {
        if (!v.used) return;
        var $div = this.wnd.$.find('.promo-alert-use').css('display', 'block');
        $div.html(v.used);
        use = true;
    };

    this.checkExpire = function(v) {
        if (v.expire > 0 && v.expire < unix_time()) {
            var str = _t('promo_expired', null, 'promocodes');
            var $div = self.wnd.$.find('.promo-alert-expire').css('display', 'block');
            $div.html(str);
        }
    };

    this.initHeader = function(v) {
        var w = this.wnd.$;
        w.find('.info-box').html(v.name);
        w.find('.info-desc').html(v.desc).css('display', 'block');
    };

    this.createList = function() {
        Engine.items.fetch(Engine.itemsFetchData.NEW_PROMO_ITEM, self.newPromoItem);
    };

    this.newPromoItem = function(data) {
        var $div = $('<div>');
        list[data.id] = data;
        self.createCloneItem($div, data);
    };

    this.createCloneItem = function($li, data) {
        if (data.y < 3)
            this.addToGroup(data, '1', 0);
        if (data.y > 2 && data.y < 6)
            this.addToGroup(data, '2', 3);
        if (data.y > 5)
            this.addToGroup(data, '3', 6);
    };

    this.addToGroup = function(data, which, yMove) {
        var $clone = Engine.items.createViewIcon(data.id, Engine.itemsViewData.CODE_PROMO_ITEM_VIEW)[0]
        var $grid = self.wnd.$.find('.grid');
        var $con = $('<div>').addClass('item-slot').css('position', 'absolute');
        if ($grid.find('.group-' + which).length == 0) {
            var $div = $('<div>').addClass('group-' + which + ' group');
            $grid.append($div);
            this.chooseButton(which);
        }
        this.setPos($con, data, yMove);
        $grid.find('.group-' + which).append($con);
        $con.append($clone);

        $clone.contextmenu(function(e, mE) {
            data.createOptionMenu(getE(e, mE));
            //e.preventDefault();
        });
    };

    this.setPos = function($clone, data, yMove) {
        const offsetX = 10;
        $clone.css({
            'left': data.x * 35 + offsetX,
            'top': (data.y - yMove) * 35
        });
    };

    this.chooseButton = function(which) {
        const $group = self.wnd.$.find('.group-' + which);

        const opts = {
            text: _t('promo_choose', null, 'promocodes'),
            classes: ['small', 'green'],
            action: () => {
                const task = 'codeprom&code=' + code + '&opt=' + which;
                _g(task, self.close);
            },
            disabled: use,
        };
        const submitBtn = new Button.default(opts);

        $group.append(submitBtn.getButton());
    };

    this.deletePromoItems = function() {
        for (var k in list) {
            Engine.items.deleteItem(k);
            list[k] = null;
        }
    };

    this.setCode = function(c) {
        code = escape(c.trim());
    };

    this.getCode = function() {
        return code;
    };

    this.close = function() {
        Engine.items.removeCallback(Engine.itemsFetchData.NEW_PROMO_ITEM);
        self.wnd.remove();
        self.deletePromoItems();
        Engine.lock.remove('PromoItems');
        Engine.codeProm = false;
    };
};