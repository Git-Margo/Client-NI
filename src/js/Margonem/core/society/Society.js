var tpl = require('core/Templates');
var SocietyItem = require('core/society/SocietyItem');
var WantedController = require('core/wanted/WantedController');
let SocietyData = require('core/society/SocietyData');

module.exports = function() {
    var self = this;
    var sortVisible = false;
    var columnShowed = SocietyData.KIND.FRIEND;
    var content;
    var list = [];
    var column;

    this.init = function() {
        this.initWindow();
        this.newCard(SocietyData.KIND.WANTED);
        this.newCard(SocietyData.KIND.ENEMY);
        this.newCard(SocietyData.KIND.FRIEND);
        this.createColumn();
        this.createSortButton();
        this.createsWantedButton();
        //this.setVisible(SocietyData.KIND.FRIEND, true);
    };

    this.initWindow = function() {
        content = tpl.get('friend-enemy-list');

        Engine.windowManager.add({
            content: content,
            title: _t('society'),
            nameWindow: Engine.windowsData.name.SOCIETY_LIST,
            widget: Engine.widgetsData.name.COMMUNITY,
            objParent: this,
            nameRefInParent: 'wnd',
            managePosition: {
                'x': 245,
                'y': 62
            },
            startVH: 60,
            cssVH: 60,
            onclose: () => {
                self.close();
            }
        });

        this.wnd.show();
        this.wnd.addToAlertLayer();
        this.wnd.updatePos();
    };

    this.createColumn = function() {
        column = tpl.get('column');
        content.append(column);
        $('.scroll-wrapper', column).addScrollBar({
            track: true
        });
    };

    this.updateData = function(data, kind) {
        if (kind != columnShowed) return;

        this.onClear();
        this.bottomPanelVisible(kind);

        var $c = column;
        var how = this.setHowRecordsOnPerson(kind);
        var l = data.length;
        var counter = 0;
        var person = null;

        for (var i = 0; i < l; i += how) {
            var d = data.slice(i, i + how);
            var sortB = this.howSortButton(i, l, kind, how);
            person = new SocietyItem();

            person.init(d, kind, sortB);

            var onlineFriend = (isset(d[8]) && d[8].indexOf(SocietyData.STATE.ONLINE) > -1);

            if (!sortVisible && onlineFriend) list.unshift(person);
            else list.push(person);

            counter++;
        }

        this.initPersons($c);
        this.setTitle(kind);
        this.setAmount(kind, counter);
        this.setSortVisible();
        this.scrollUpdate();
    };

    this.setHowRecordsOnPerson = function(kind) {
        switch (kind) {
            case SocietyData.KIND.FRIEND:
                return 10;
            case SocietyData.KIND.ENEMY:
                return 6;
            case SocietyData.KIND.WANTED:
                return 9;
        }
    };

    this.initPersons = function($c) {
        for (var i in list) {
            list[i].newElement($c);
        }
    };

    this.setAmount = function(kind, counter) {
        var str = _t(kind + 'amount %amount%', {
            '%amount%': counter
        });
        this.wnd.$.find('.amound-value').html(str);
    };

    this.setTitle = function(kind) {
        var str;
        switch (kind) {
            case SocietyData.KIND.FRIEND:
                str = _t('friend');
                break;
            case SocietyData.KIND.ENEMY:
                str = _t('enemy');
                break;
            case SocietyData.KIND.WANTED:
                str = _t('wanted');
                break;
        }
        this.wnd.$.find('.header-title').html(str);
    };

    this.scrollUpdate = function() {
        $('.scroll-wrapper', column).trigger('update');
    };

    this.bottomPanelVisible = function(name) {
        var $input = content.find('.add-person');
        var $sort = content.find('.sort-wrapper');
        var $wanted = content.find('.wanted-wrapper');

        this.wnd.$.find('.wanted-wrapper');
        $input.css('visibility', name == 'w' ? 'hidden' : 'initial');
        $sort.css('display', name == 'w' ? 'none' : 'table-cell');
        $sort.css('display', name == 'w' ? 'none' : 'table-cell');
        $wanted.css('display', name == 'w' ? 'table-cell' : 'none');

        if (name == SocietyData.KIND.WANTED) return;

        var t = [
            _t('enemyNick'),
            _t('friendNick')
        ];
        var $send = tpl.get('button').addClass('add-btn small green');
        var action = name == SocietyData.KIND.FRIEND ? 'finvite' : 'eadd';
        var bool = name == SocietyData.KIND.FRIEND ? 1 : 0;

        $input.attr('placeholder', t[bool]);
        content.find('.add-wrapper').append($send);
        $send.find('.label').text(_t('addPerson', false, 'buttons'));
        $send.click(function() {
            _g('friends&a=' + action + '&nick=' + $input.val().trim().split(' ').join('_'), function(e) {
                $input.val('');
            });
        });
    };

    this.removeAddPerson = function() {
        if (lengthObject(column) == 0) return;

        content.find('.add-btn').remove();
        content.find('.add-person').val('');
    };

    this.setSortVisible = function() {
        var $aB = content.find('.action-buttons');
        var $sb = content.find('.sort-buttons');
        var t = [
            ['table-cell', 'none'],
            ['none', 'table-cell']
        ];
        var bool = sortVisible ? 1 : 0;
        $aB.css('display', t[bool][0]);
        $sb.css('display', t[bool][1]);
    };

    this.createSortButton = function() {
        var $sB = tpl.get('button').addClass('sort-btn small green');
        var $e = this.wnd.$.find('.sort-wrapper');

        $e.append($sB);
        $sB.find('.label').text(_t('sort', false, 'buttons'));
        $sB.click(function() {
            sortVisible = !sortVisible;
            _g('friends&a=show');
            self.setSortVisible();
        });
    };

    this.createsWantedButton = function() {
        var $sB = tpl.get('button').addClass('show-wanted small green');
        var $e = this.wnd.$.find('.wanted-wrapper');

        $e.append($sB);
        $sB.find('.label').text(_t('wantedList'));
        $sB.click(function(e) {
            Engine.wantedController.getWantedList().toggleVisible();
            e.stopPropagation();
        });
    };

    this.onClear = function() {
        for (var i in list) {
            list[i].$.remove();
            delete list[i];
        }
        this.removeAddPerson();
        list = [];
    };

    this.howSortButton = function(i, l, kind, how) {
        if (kind == SocietyData.KIND.WANTED) return null;
        if (l == 10 && kind == SocietyData.KIND.FRIEND) return null;
        if (l == 6 && kind == SocietyData.KIND.ENEMY) return null;

        if (i == 0) return ['down'];
        if (i + how == l) return ['up'];

        if (i != 0 && i != l) return ['down', 'up'];
    };

    this.close = function() {
        this.onClear();
        this.wnd.remove();
        Engine.society = false;
    };

    this.newCard = function(name) {
        var $card = tpl.get('card').addClass(name);
        var $header = this.wnd.$.find('.friend-enemy-cards');

        if (!Engine.worldConfig.getWantedShow()) {
            $header.addClass('wanted-hide');
        }
        var $label = $card.find('.label').html(_t(self.getAllName(name)));

        $header.prepend($card);
        $card.append($label);
        $card.click(function() {
            self.setVisible(name);
        });
    };

    this.getAllName = function(name) {
        switch (name) {
            case SocietyData.KIND.FRIEND:
                return 'friend';
            case SocietyData.KIND.ENEMY:
                return 'enemy';
            case SocietyData.KIND.WANTED:
                return 'wanted';
        }
    };

    this.setVisible = function(which, init) {
        var $cards = self.wnd.$.find('.card');
        var $card = self.wnd.$.find('.' + which);

        $cards.removeClass('active');
        $card.addClass('active');
        sortVisible = false;
        columnShowed = which;

        if (init) return;
        if (columnShowed == SocietyData.KIND.WANTED) return self.getWantedPersons();

        $('.scroll-wrapper', column).trigger('scrollTop');
        _g("friends&a=show");
    };

    this.getWantedPersons = function() {
        _g('wanted&show=1', function(v) {
            if (!Engine.wantedController) {
                Engine.wantedController = new WantedController.WantedController();
                Engine.wantedController.updateList(v);
            }
            var wantedList = Engine.wantedController.getList();
            var array = [];
            for (var k in wantedList) {
                var obj = wantedList[k];
                array.push(obj.id, obj.nick, obj.town, '3', obj.x, obj.y, obj.lvl, obj.prof, obj.icon);
            }
            self.updateData(array, SocietyData.KIND.WANTED);
        });
    };

    this.onResize = function() {
        self.wnd.updatePos();
    };

    this.getPersonById = function(id) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) return list[i];
        }
        return null;
    };

};