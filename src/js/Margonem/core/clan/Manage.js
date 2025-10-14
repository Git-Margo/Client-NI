// var wnd = require('@core/Window');
var tpl = require('@core/Templates');
module.exports = function(Par) {
    var self = this;
    var content;

    this.update = function() {
        this.createRankEditTable();
        this.updateSocGroup();
        this.updateSocPass();
        this.showOrHideRight();
        $('.scroll-wrapper', content).trigger('update');
    };

    this.initInputMask = () => {
        // content.find('.add-id').mask('0#');
        setOnlyPositiveNumberInInput(content.find('.add-id'))
    }

    this.init = function() {
        content = tpl.get('clan-manage-content');
        Par.wnd.$.find('.card-content').append(content);
        $('.scroll-wrapper', content).addScrollBar({
            track: true,
            addScrollableClassToAnotherEl: $('.table-header-wrapper', content)
        });
        self.initLabels();
        self.initPlaceHolders();
        self.rankEditHeader();
        self.createButs();
        self.createMenu();
        self.initInputMask();
    };

    this.updateSocPass = function() {
        var socPass = Par.getProp('socplay_pass');
        var fillPass = content.find('.soc-fill-pass').parent();
        var setPass = content.find('.soc-pass-name').parent();
        var delBut = content.find('.remove-soc-pass-but');
        var saveBut = content.find('.save-soc-pass-but');
        this.showOrHide(socPass, fillPass, setPass, delBut, saveBut);
        setPass.find('.soc-pass-name').html('********');
    };

    this.updateSocGroup = function() {
        var socGr = Par.getProp('socplay_group');
        var fillName = content.find('.soc-fill-gr').parent();
        var setName = content.find('.soc-group-name').parent();
        var delBut = content.find('.remove-soc-gr-but');
        var saveBut = content.find('.save-soc-gr-but');
        this.showOrHide(socGr, fillName, setName, delBut, saveBut);
        setName.find('.soc-group-name').html(socGr);
    };

    this.showOrHide = function(data, fill, setN, saveB, delB) {
        var t = [
            ['none', 'table-cell'],
            ['table-cell', 'none']
        ];
        var bool = data ? t[1] : t[0];
        fill.css('display', bool[1]);
        setN.css('display', bool[0]);
        saveB.css('display', bool[0]);
        delB.css('display', bool[1]);
    };

    this.showOrHideRight = function() {
        var t = [
            'none',
            'block'
        ];
        var myRank = Par.getProp('myrank');
        var bool = myRank & 1 ? 1 : 0;
        content.find('.change-clan-name').css('display', t[bool]);
        content.find('.dissolve-clan').css('display', t[bool]);
        content.find('.add-rank').css('display', t[bool]);
        //content.find('.scroll-wrapper').css('height', bool ? '137px' :  '235px');
        content.find('.right-content').css('top', bool ? '209px' : '156px');
        bool = myRank & 1 ? 0 : 1;
        content.find('.leave-clan').css('display', t[bool]);
        bool = myRank & 8 ? 1 : 0;
        content.find('.invite-to-clan').css('display', t[bool]);
    };

    this.createRightRecords = function() {
        var $table = content.find('.rank-edit-table');
        var ranks = Par.getProp('ranks');
        for (var k in ranks) {
            var tr = this.createRightsTr(k, ranks[k]);
            $table.prepend(tr);
        }
    };

    this.createRightsTr = function(k, r) {
        var tab = [k, r.name];
        var rec;
        var mR = Par.getProp('myrank');
        for (var i = 0; i < 12; i++) {
            if (i < 9) {
                var bool = r.r & Math.pow(2, i);
                rec = $('<div>').addClass(bool ? 'enable' : 'disable');
            } else {
                var num = Par.amountNumericalRights(i, r.r);
                rec = num ? num : $('<div>').addClass('disabled');
            }
            tab.push(rec);
        }
        if (mR & 1) tab.push(this.createEditRankBut(k, r.name));
        return Par.createRecords(tab, 'normal-td');
    };

    this.createButs = function() {
        var t = [
            Par.tLang('cl_name_save'),
            Par.tLang('dissolve'),
            Par.tLang('inviteClan'),
            Par.tLang('set_soclpay_group_url'),
            Par.tLang('set_soclpay_group_pwd'),
            Par.tLang('addClan'),
            Par.tLang('unset_soclpay_group_pwd'),
            Par.tLang('leave')
        ];
        var b1 = Par.addControll(t[0], 'change-clan-name-but', this.changeClanName);
        var b2 = Par.addControll(t[1], 'dissolve-but', this.dissolveClan);
        var b5 = Par.addControll(t[4], 'save-soc-pass-but', this.saveSocPass);
        var b6 = Par.addControll(t[5], 'add-id-but', this.addNewRank);
        var b7 = Par.addControll(t[6], 'remove-soc-gr-but', this.deleteSocGroup);
        var b8 = Par.addControll(t[6], 'remove-soc-pass-but', this.deletePassGroup);
        var b9 = Par.addControll(t[7], 'leave-but', this.leaveClan);

        b1.add(b5).add(b6).addClass('small green');
        b2.add(b7).add(b8).add(b9).addClass('small');
    };

    this.changeClanName = function() {
        var i = content.find('.new-clan-name');
        var v = content.find('.paid-kind>.bck span').attr('value');
        var str = parseInt(v) ? '&pay=self' : '';
        _g('clan&a=save&f=name&v=' + esc(i.val()) + str, function() {
            i.val('');
        });
    };

    this.dissolveClan = function() {
        var gold = Par.getProp('gold');
        if (gold > 0) {
            var msg = Par.tLang('disband_gold_info');
            Par.alert(msg, self.dissolveClanReq);
        } else {
            self.dissolveClanReq();
        }
    };

    this.dissolveClanReq = function() {
        var v = content.find('.confirm-dissolve').val();
        _g('clan&a=disband&agree=' + v, function() {
            if (v == 'OK') {
                Par.close();
                delete Engine.hero.d.clan;
            }
        });
    };

    this.leaveClan = function() {
        var v = content.find('.confirm-leave').val();
        _g('clan&a=leave&agree=' + v, function() {
            if (v == 'OK') Par.close();
            delete Engine.hero.d.clan;
        });
    };

    //this.inviteToClan = function () {
    //	var i = content.find('.player-nick');
    //	_g('clan&a=invite&n=' + i.val(), function () {
    //		i.val('');
    //	});
    //};

    this.deleteSocGroup = function() {
        _g('clan&a=save&f=socplay_group&v=');
    };

    this.saveSocPass = function() {
        var i = content.find('.soc-fill-pass');
        if (i.val()) {
            _g('clan&a=save&f=socplay_pass&v=' + i.val(), function() {
                i.val('');
            });
        } else {
            _g('clan&a=save&f=socplay_pass&v=');
        }
    };

    this.deletePassGroup = function() {
        _g('clan&a=save&f=socplay_pass&v=');
    };

    this.addNewRank = function() {
        var iId = content.find('.add-id');
        var iName = content.find('.add-name-rank');
        _g('clan&a=rank&a2=add&rid=' + iId.val() + '&name=' + esc(iName.val()) + '&r=0', function() {
            iId.val('');
            iName.val('');
        })
    };

    this.createMenu = function() {
        var t = [{
                'text': Par.tLang('clan_sl'),
                'val': 0
            },
            {
                'text': Par.tLang('private_sl'),
                'val': 1
            }
        ];
        content.find('.paid-kind').createMenu(t, true);
    };

    this.initPlaceHolders = function() {
        var t = [
            '.new-clan-name', Par.tLang('new_clan_name'),
            '.confirm-dissolve', Par.tLang('ok_to_confirm'),
            '.player-nick', Par.tLang('player_nick'),
            '.add-id', Par.tLang('rank_id'),
            '.add-name-rank', Par.tLang('rank_n'),
            '.soc-fill-pass', Par.tLang('soclpay_group_pwd'),
            '.soc-fill-gr', Par.tLang('soclpay_group_url'),
            '.confirm-leave', Par.tLang('ok_to_confirm')
        ];

        for (var i = 0; i < t.length; i += 2) {
            Par.createPlaceHolder(t[i], t[i + 1], content);
        }
    };

    this.initLabels = function() {
        var t = [
            Par.tLang('clan_name_change'),
            Par.tLang('clan_resolve'),
            Par.tLang('clan_invite_new'),
            Par.tLang('socplay_opts'),
            Par.tLang('clan_leave'),
            Par.tLang('add_new_clan_rank')
        ];

        content.find('.change-clan-name>.label-info').html(t[0]);
        content.find('.dissolve-clan>.label-info').html(t[1]);
        content.find('.leave-clan>.label-info').html(t[4]);
        content.find('.invite-to-clan>.label-info').html(t[2]);
        content.find('.add-rank>.label-info').html(t[5]);
    };

    this.rankEditHeader = function() {
        var str = Par.tLang('clan_rangs');
        content.find('.rank-edit-header').html(str);
    };

    this.createRankEditTable = function() {
        var $tableHeader = content.find('.rank-edit-table-header');
        var $table = content.find('.rank-edit-table');
        var header = this.createRankTabHeader();
        $table.html('');
        this.createRightRecords();
        $tableHeader.html(header);
    };

    this.createRankTabHeader = function() {
        var mR = Par.getProp('myrank');
        var t = [
            Par.tLang('rank_id_upper'),
            Par.tLang('rank_n')
        ];
        var clanRankInf = Par.getClanRankInf();
        for (var i = 0; i < 12; i++) {
            var $e = tpl.get('clan-icon');
            t.push($e);
            $e.css('background', `url("../img/gui/clan_icons.png?v=${__build.version}") no-repeat ` + (i * -24) + 'px 0');
            $e.tip(clanRankInf[i]);
        }

        if (mR & 1) t.push('');
        return Par.createRecords(t, 'table-header-icon');
    };

    this.createEditRankBut = function(id, name) {
        var $but = tpl.get('button').addClass('small green');
        var bck = tpl.get('add-bck');
        $but.append(bck);
        $but.tip(Par.tLang('redit_td'));
        $but.click(function() {
            Par.updateHeader(_t('edit_rank %name%', {
                '%name%': name
            }, 'clan'));
            Par.showChooseCard('clan', 'clan-rank-edit');
            Par.updateRankEdit([id, name]);
        });
        return $but;
    };

    // this.init();
    // this.initLabels();
    // this.initPlaceHolders();
    // this.rankEditHeader();
    // this.createButs();
    // this.createMenu();

};