var tpl = require('core/Templates');
var DraconiteShop = require('core/shop/DraconiteShop');
module.exports = function() {
    var self = this;
    var content;
    var objectList = {};
    var sortTable = [];

    this.init = function() {
        this.initWindow();
        this.initHeader();
        this.initBottomPanel();
        this.wnd.center();
        Engine.lock.add('RecoveryItems');
    };

    this.initBottomPanel = function() {
        self.wnd.$.find('.info-label').html(_t('low_sl', null, 'shop'));
        var $btn = tpl.get('button').addClass('small purple');
        $btn.find('.label').html(_t('buy_sl', null, 'shop'));
        self.wnd.$.find('.buy-sl').append($btn);
        $btn.click(function(e) {
            e.stopPropagation();
            if (Engine.draconiteShop) return;
            Engine.draconiteShop = new DraconiteShop();
            Engine.draconiteShop.open();
        });
    };

    this.update = function(v) {
        if (!v.length) {
            this.emptyList();
            return;
        }
        this.createList(v);
    };

    this.emptyList = function() {
        mAlert(_t('no_items_to_recover', null, 'recover'));
        Engine.recoveryItems = false;
        //delete(self);
    };

    this.initWindow = function() {

        content = tpl.get('recovery-item');
        $('.scroll-wrapper', content).addScrollBar({
            track: true
        });

        Engine.windowManager.add({
            content: content,
            nameWindow: Engine.windowsData.name.RECOVERY_ITEMS,
            nameRefInParent: 'wnd',
            objParent: this,
            title: 'Premium',
            startVH: 60,
            cssVH: 60,
            onclose: () => {
                self.close();
            }
        });

        this.wnd.center();
        this.wnd.addToAlertLayer();
    };

    this.initHeader = function() {
        var w = this.wnd.$;
        w.find('.info-1').html(_t('item_recover_header'));
        w.find('.info-2').html(_t('item_recover_info2', null, 'recover'));
        w.find('.text-1').html(_t('item_recover_info1', null, 'recover'));
    };

    this.createList = function(data) {
        for (var i = 0; i < data.length; i += 2) {
            var id = data[i];
            var ts = data[i + 1];
            objectList[id] = {
                ts: ts,
                '$': null
            };
        }
        // Engine.items.fetch('r', self.newRecItem);
        Engine.items.fetch(Engine.itemsFetchData.NEW_RECOVERY_ITEM, self.newRecItem);
    };

    this.newRecItem = function(data) {
        var $li = $('<tr>');
        var id = data.id;
        var ts = objectList[id]['ts'];
        self.createClonItem($li, data);
        self.createNameTd($li, data.name);
        self.createInfoText($li, ts);
        self.createConfirmButton($li, id, data.name);
        self.deleteCallback(data);
        objectList[id]['$'] = $li;
        sortTable.push($li);
        if (sortTable.length == lengthObject(objectList)) {
            self.appendToWindow();
            $('.scroll-wrapper', content).trigger('scrollTop');
            self.addHeaderToTable();
            self.scrollUpdate();
            //self.wnd.center();
        }
    };

    this.deleteCallback = function(d) {
        d.on('delete', function() {
            self.deleteRecItem(d.id);
        });
    };

    this.addHeaderToTable = function() {
        var t = [
            'item',
            'name',
            'destroy',
            'action'
        ];
        var $tr = $('<tr>').addClass('table-header');
        for (var i = 0; i < t.length; i++) {
            var $td = $('<td>').html(_t(t[i], null, 'recover'));
            $tr.append($td);
        }
        //self.wnd.$.find('.recovery-items-table').prepend($tr);
        self.wnd.$.find('.static-bar-table').prepend($tr);
    };

    this.createNameTd = function($li, name) {
        var $td = $('<td>').addClass('centerText');
        var $e = $('<span>').html(parseItemBB(name));
        $td.append($e);
        $li.append($td);
    };

    this.createInfoText = function($li, ts) {
        var $td = $('<td>').addClass('centerText');
        var $e = $('<span>');
        var daysAgo = calculateDiff(unix_time(), ts);

        var str = _t('item_destroyed_new %timeago%', {
            '%timeago%': daysAgo
        }, 'recover');

        $e.addClass('when');
        $e.html(str);
        $td.append($e);
        $td.addClass('recoverInfo');
        $li.append($td);
    };

    this.createConfirmButton = function($li, id, name) {
        var $confirm = tpl.get('button').addClass('small');
        var $td = $('<td>').addClass('recover-btn').append($confirm);
        $li.append($td);
        $confirm.addClass('green');
        $confirm.find('.label').text(_t('recover_label', null, 'recover'));
        $confirm.click(function() {
            var data = {
                ik: "oimg",
                ip: "/draconite_small.gif",
                //it: _t('cost', null, 'recover') + '<span class="red">' + 75 + '</span>',
                it: 75,
                m: "yesno2",
                q: _t('alert_confirm', null, 'recover') + '<br>' + parseItemBB(name),
                re: 'recovery&item=' + id
            };
            askAlert(data);
        });
    };

    this.createClonItem = function($li, data) {
        var $item = Engine.items.createViewIcon(data.id, Engine.itemsViewData.RECOVER_VIEW)[0];
        var ts = objectList[data.id]['ts'];
        var $td = $('<td>').addClass('wrapper-to-slot');
        //var $slot = $('<div>').addClass('item-slot');
        var $slot = tpl.get('item-slot');
        $item.addClass('recoveryItem');
        $item.data('time', ts);
        $slot.append($item);
        $td.append($slot);
        $li.append($td);
        $item.contextmenu(function(e, mE) {
            data.createOptionMenu(getE(e, mE), false, {
                canPreview: true
            });
            //e.preventDefault();
        });
    };

    this.appendToWindow = function() {
        sortTable.sort(function(e1, e2) {
            let nE1 = e1.find('.item').data('time');
            let nE2 = e2.find('.item').data('time');
            return nE2 - nE1;
        });
        let $table = $('<table>').addClass('recovery-items-table');

        for (let i = 0; i < sortTable.length; i++) {
            $table.append(sortTable[i]);
        }
        self.wnd.$.find('.scroll-pane').append($table)
    };

    this.scrollUpdate = function() {
        $('.scroll-wrapper', content).trigger('update');
    };

    this.deleteRecItem = function(id) {
        objectList[id].$.remove();
        delete objectList[id];
        // this.scrollUpdate();
        //this.wnd.center();
    };

    this.close = function() {

        self.wnd.remove();

        Engine.items.removeCallback(Engine.itemsFetchData.NEW_RECOVERY_ITEM);
        Engine.items.deleteMessItemsByLoc('r');

        for (let k in objectList) {
            delete objectList[k];
        }

        objectList = null;
        sortTable = null;


        Engine.lock.remove('RecoveryItems');
        Engine.recoveryItems = false;
    };
};