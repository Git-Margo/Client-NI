//var wnd = require('@core/Window');
var tpl = require('@core/Templates');
module.exports = function(Par) {
    var self = this;
    var content;
    var id;
    var name;

    this.update = function(m) {
        id = m[0];
        name = m[1];
        this.createHeaderAndTable(m);
        this.hideOrShow();
        this.createMenu();
    };

    this.createHeaderAndTable = function(m) {
        var str = 'player-edit-table';
        var header = this.createHeaderMemberList();
        var $tableHeader = content.find('.js-table-header');
        var $table = content.find('.' + str);
        var $tr = Par.createOneMember(m, false, false);
        $tableHeader.html('');
        $table.html('');
        $tableHeader.append(header);
        $table.append($tr);
    };

    this.init = function() {
        var $par = Par.wnd.$.find('.card-content');
        content = tpl.get('clan-edit-content');
        $par.append(content);
        this.createBut();
    };

    this.createHeaderMemberList = function() {
        var charInf = Par.getCharInf();
        return Par.createRecords([charInf[0] + '/' + charInf[1], charInf[4], charInf[2], charInf[3]], '');
    };

    this.createBut = function() {
        var t = [
            Par.tLang('cl_name_save'),
            Par.tLang('cl_send'),
            Par.tLang('del_member'),
            Par.tLang('back')
        ];
        Par.addControll(t[0], 'change-rank-but', this.changeRank).addClass('small green');
        Par.addControll(t[1], 'send-but', this.changeBoss).addClass('small');
        Par.addControll(t[2], 'remove-from-clan', this.removeFromClan).addClass('small');
        Par.addControll(t[3], 'back-to-members', this.backToMemberList).addClass('small green');
    };

    this.changeRank = function() {
        var v = Par.wnd.$.find('.rank-menu .menu-option').attr('value');
        _g('clan&a=member&id=' + id + '&rank=' + v, function() {
            self.backToMemberList();
        })
    };

    this.hideOrShow = function() {
        var mr = Par.getProp('myrank');
        var t = [
            'block',
            'none'
        ];
        content.find('.send-tears').css('display', mr & 1 ? t[0] : t[1]);
        content.find('.edit-rank').css('display', mr & 2 ? t[0] : t[1]);
        content.find('.remove-from-clan').css('display', mr & 16 ? t[0] : t[1]);
    };

    this.changeBoss = function() {
        var msg = _t('give_clan_leadership_confirm %name%', {
            '%name%': name
        }, 'clan');
        Par.alert(msg, self.changeBossReq);
    };

    this.changeBossReq = function() {
        var v = Par.wnd.$.find('.send-menu>.bck span').attr('value');
        _g('clan&a=member&id=' + id + '&leader=1' + (parseInt(v) ? '' : '&pay=self'), function() {
            self.backToMemberList();
        });
    };

    this.removeFromClan = function() {
        var msg = _t('player_dismiss_confirm', {
            '%name%': name
        }, 'clan');
        Par.alert(msg, function() {
            _g('clan&a=member&dismiss=1&id=' + id, function() {
                self.backToMemberList();
            });
        });
    };

    this.backToMemberList = function() {
        var str = Par.tLang('clan_members');
        Par.updateHeader(str);
        Par.showChooseCard('clan', 'clan-members');
        $('.scroll-wrapper', '.clan-members-content').trigger('update');
    };

    this.createMenu = function() {
        var t = [
            Par.tLang('change_rank'),
            Par.tLang('give_clan_leadership')
        ];
        var ranks = Par.getProp('ranks');
        var cR = Engine.hero.d.clan.rank;
        var rank = Par.getMemberList()[id][8];
        var r1 = [];
        var r2 = [{
                'text': Par.tLang('clan_sl'),
                'val': 1
            },
            {
                'text': Par.tLang('private_sl'),
                'val': 0
            }
        ];
        for (var k in ranks) {
            if (k >= cR) continue;
            r1.push({
                'text': ranks[k].name,
                'val': k
            });
        }
        const $rankMenu = content.find('.rank-menu');
        content.find('.edit-rank>.label').html(t[0]);
        content.find('.send-tears>.label').html(t[1]);
        $rankMenu.empty().createMenu(r1.reverse());
        $rankMenu.setOptionWithoutCallbackByValue(rank);
        // content.find('.rank-menu .menu-option').html(ranks[rank].name).attr('value', rank);
        content.find('.send-menu').empty().createMenu(r2, true);
    };

    //this.init();

};