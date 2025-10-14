// var wnd = require('@core/Window');
var tpl = require('@core/Templates');
const {
    getIconClose
} = require('@core/HelpersTS');
module.exports = function(Par) {
    var self = this;
    var content;
    var edit;

    this.updateFriend = function(v) {
        this.updateEdit();
        var $tableHeader = content.find('.friend-table-header');
        var table = content.find('.friend-table');
        var header = this.friendHeader();
        table.html('');
        for (var i = 0; i < v.length; i += 4) {
            var f = v.slice(i, i + 4);
            var tr = this.createFriendTr(f);
            table.append(tr);
        }
        $tableHeader.html(header);
        $('.scroll-wrapper', content).trigger('update');
        this.showOrHide();
    };

    this.updateEnemy = function(v) {
        this.updateEdit();
        var $tableHeader = content.find('.enemy-table-header');
        var table = content.find('.enemy-table');
        var header = this.enemyHeader();
        table.html('');
        for (var i = 0; i < v.length; i += 6) {
            var f = v.slice(i, i + 6);
            var tr = this.createEnemyTr(f);
            table.append(tr);
        }
        $tableHeader.html(header);
        $('.scroll-wrapper', content).trigger('update');
        this.showOrHide();
    };

    this.updateEdit = function() {
        var myRank = Par.getProp('myrank');
        edit = myRank & 128;
    };

    this.showOrHide = function() {
        var t = [
            'block',
            'none'
        ];
        //content.find('.friend, .enemy').css('display', edit ? t[0] : t[1]);
        content.find('.js-rank-hide').css('display', edit ? t[0] : t[1]);
    };

    this.createEnemyTr = function(f) {
        var b = this.createDeletekBut(f[0], 'e');
        var cl = [
            'normal-td',
            'right-td',
            'right-td',
            'right-td',
            'right-td',
            '',
            ''
        ];

        if (edit)
            return Par.createRecords([escapeHTML(f[3]), f[1], f[2], formNumberToNumbersGroup(f[4]), f[5], b], cl);
        else
            return Par.createRecords([escapeHTML(f[3]), f[1], f[2], formNumberToNumbersGroup(f[4]), f[5]], cl.slice(0, 6));
    };

    this.createFriendTr = function(f) {
        var b = this.createDeletekBut(f[0], 'f');
        var cl = [
            'normal-td',
            'right-td',
            'right-td',
            ''
        ];

        if (edit)
            return Par.createRecords([escapeHTML(f[1]), formNumberToNumbersGroup(f[2]), f[3], b], cl);
        else
            return Par.createRecords([escapeHTML(f[1]), formNumberToNumbersGroup(f[2]), f[3]], cl.slice(0, 3));
    };

    this.friendHeader = function() {
        var t = [
            Par.tLang('friend_clans'),
            Par.tLang('clan_power'),
            Par.tLang('plrs_amount'),
            Par.tLang('del_friend_enemy_clan')
        ];
        var cl = [
            'medium-height-td table-header interface-element-table-header-1-background',
            'table-header interface-element-table-header-1-background',
            'table-header interface-element-table-header-1-background',
            'table-header interface-element-table-header-1-background'
        ];
        if (edit)
            return Par.createRecords(t, cl);
        else
            return Par.createRecords(t.slice(0, 3), cl.slice(0, 3));
    };

    this.enemyHeader = function() {
        var t = [
            Par.tLang('enemy_clans'),
            Par.tLang('battle_wins'),
            Par.tLang('battle_loses'),
            Par.tLang('clan_power'),
            Par.tLang('plrs_amount'),
            Par.tLang('del_friend_enemy_clan')
        ];
        var cl = [
            'table-header interface-element-table-header-1-background',
            'table-header interface-element-table-header-1-background',
            'table-header interface-element-table-header-1-background',
            'table-header interface-element-table-header-1-background',
            'table-header interface-element-table-header-1-background',
            'table-header interface-element-table-header-1-background '
        ];
        if (edit)
            return Par.createRecords(t, cl);
        else
            return Par.createRecords(t.slice(0, 5), cl.slice(0, 5));
    };

    this.initLabels = function() {
        var t = [
            Par.tLang('invite_to_clan_alliance'),
            Par.tLang('add_new_enemy')
        ];
        content.find('.friend .label-info').html(t[0] + ':');
        content.find('.enemy .label-info').html(t[1] + ':');
    };

    this.initPlaceHolders = function() {
        var str = Par.tLang('clan_name');
        Par.createPlaceHolder('.invite-friend', str, content);
        Par.createPlaceHolder('.add-enemy', str, content);
    };

    this.initButs = function() {
        var t = [
            Par.tLang('invite_to_alliance'),
            Par.tLang('add_to_enemy_')
        ];
        Par.addControll(t[0], 'invite-friend-but', this.inviteToAlliance).addClass('small green');
        Par.addControll(t[1], 'add-enemy-but', this.addToEnemy).addClass('small green');
    };

    this.inviteToAlliance = function() {
        var i = content.find('.invite-friend');
        _g('clan&a=dipl&name=' + esc(i.val().trim()) + '&op=ally', function() {
            i.val('');
        })
    };

    this.addToEnemy = function() {
        var i = content.find('.add-enemy');
        _g('clan&a=dipl&name=' + esc(i.val().trim()) + '&op=enemy', function() {
            i.val('');
        });
    };

    this.createDeletekBut = function(id, who) {
        var $but = tpl.get('button').addClass('small');
        const $closeIcon = getIconClose(false);
        $but.append($closeIcon);
        $but.click(function() {
            var msg = 'cancel_' + (who == 'e' ? 'war' : 'alignment');
            Par.alert(Par.tLang(msg), function() {
                if (who == 'f') who = 'a';
                _g('clan&a=dipl&id=' + id + '&op=cancel_' + who);
            });
        });
        return $but;
    };

    this.initContent = function() {
        content = tpl.get('clan-diplomacy-content');
        Par.wnd.$.find('.card-content').append(content);
        $('.scroll-wrapper', content).addScrollBar({
            track: true
        });
    };

    this.init = function() {
        this.initContent();
        this.initLabels();
        this.initPlaceHolders();
        this.initButs();
    };

    //this.init();

};