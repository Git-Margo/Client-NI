//var wnd = require('core/Window');
var tpl = require('core/Templates');
module.exports = function(Par) {
    var self = this;
    var content;
    var idRank;
    var name;

    this.update = function(v) {
        this.clearValIntputs();
        this.updateIdRank(v[0]);
        this.updateName(v[1]);
        this.updateCheckBox();
        this.updatePlaceHolders();
        this.updateAllMenu(v[2]);
        this.updateLabels();
        this.showHideRemoveRankBut();

        $('.scroll-wrapper', content).trigger('update');
    };

    this.initInputMask = () => {
        content.find('.edit-id').mask('00');
    }

    this.showHideRemoveRankBut = function() {
        var $remove = content.find('.remove-rank');
        $remove.css('display', idRank == 100 ? 'none' : 'table-cell');
    };

    this.init = function() {
        this.initWindow();
        this.initLabels();
        this.createButs();
        this.initInputMask();
    };

    this.initWindow = function() {
        var $par = Par.wnd.$.find('.card-content');
        content = tpl.get('clan-rank-edit-content');
        $par.append(content);

        $('.scroll-wrapper', content).addScrollBar({
            track: true
        });
    };

    this.updateIdRank = function(id) {
        if (!id) return;
        idRank = id;
    };
    this.updateName = function(n) {
        if (!n) return;
        name = n;
    };

    this.updateCheckBox = function() {
        var $checkRank = content.find('.check-rank');
        var $leftRightRanks = content.find('.left-ranks, .right-ranks');
        $leftRightRanks.html('');
        $checkRank.hide();
        if (idRank == 100) return;

        $checkRank.show();
        var clanRankInf = Par.getClanRankInf();
        var sliceRank = clanRankInf.slice(1, 9);
        for (var i = 0; i < sliceRank.length; i++) {
            this.createOneRank(sliceRank[i], i);
        }
    };

    this.updateLabels = function() {
        var t = [
            'block',
            'none'
        ];
        var p = [
            'left',
            'center'
        ];
        var bool = (idRank != 100 && idRank != 0) ? 0 : 1;
        content.find('.id-wrapper').css('display', t[bool]);
    };

    this.createOneRank = function(lab, i) {
        var $oR = tpl.get('one-rank');
        var cl = i % 2 ? 'right' : 'left';
        this.setOneRank($oR, i, lab);
        this.setActiveCheckBox($oR, i);
        content.find('.' + cl + '-ranks').append($oR);
    };

    this.setOneRank = function($oR, i, lab) {
        var bck = $oR.find('.bck');
        var $checkbox = $oR.find('.checkbox');
        var pow = Math.pow(2, i + 1);
        bck.addClass('r' + pow);
        $oR.find('.clan-icon').css('background', `url("../img/gui/clan_icons.png?v=${__build.version}") no-repeat ` + ((i + 1) * -24) + 'px 0');
        $oR.find('.label').html(lab);
        $oR.click(function() {
            bck.toggleClass('active');
            $checkbox.toggleClass('active');
        });
    };

    this.setActiveCheckBox = function($oR, i) {
        var $bck = $oR.find('.bck');
        var $checkbox = $oR.find('.checkbox');
        var ranks = Par.getProp('ranks');
        var r = ranks[idRank].r;
        var bool = r & Math.pow(2, (i + 1));
        var cl = bool ? 'active' : '';
        $bck.addClass(cl);
        $checkbox.addClass(cl);
    };

    this.initLabels = function() {
        var t = [
            Par.tLang('rank_name'),
            Par.tLang('rank_id_upper')
        ];
        content.find('.label-name').html(t[0]);
        content.find('.label-id').html(t[1]);
    };

    this.updatePlaceHolders = function() {
        Par.createPlaceHolder('.edit-name', name, content);
        Par.createPlaceHolder('.edit-id', idRank, content);
    };

    this.updateAllMenu = function(bits) {
        content.find('.numerable-ranks').html('');
        if (idRank == 100) return;
        var r = Par.getProp('ranks')[idRank].r;
        var t = [
            'rank_tabs_view',
            'rank_tabs_usage',
            'rank_tabs_itemlimit'
        ];
        var v = ((bits >> 2) & 5);
        var newV = [
            [5, 0, Par.tLang('tabs_view no_access')],
            [5, 0, Par.tLang('tabs_view no_usage')],
            [3, v, Par.tLang('tabs_view no_limit')]
        ];
        for (var i = 0; i < 3; i++) {
            var ar = Par.amountNumericalRights(i + 9, r);
            var dataTab = this.createDataTabToMenu(newV[i][0], newV[i][1], newV[i][2]);
            this.createOneNumerableRank(t[i], i, ar, dataTab);
        }
    };

    this.createDataTabToMenu = function(max, val, firstStr) {
        var t = [];
        for (var i = 0; i <= max; i++) {
            var str = i == 0 ? i + ' ' + firstStr : i;
            t.push({
                'text': str,
                'val': i
            });
        }
        return t;
    };

    this.createButs = function() {
        var t = [
            Par.tLang('remove_rank'),
            Par.tLang('cancel'),
            Par.tLang('save')
        ];
        var b1 = Par.addControll(t[0], 'remove-rank', this.removeRank);
        var b2 = Par.addControll(t[1], 'cancel-edit', this.backToManage);
        var b3 = Par.addControll(t[2], 'save-change', this.saveChange);

        b2.add(b3).addClass('green small');
        b1.addClass('small')
    };

    this.removeRank = function() {
        var str = Par.tLang('confirm_rank_delete');
        Par.alert(str, function() {
            _g('clan&a=rank&a2=del&rid=' + idRank, self.backToManage);
        });
    };

    this.backToManage = function() {
        var str = 'clan_manage';
        Par.updateHeader(Par.tLang(str));
        Par.showChooseCard('clan', str);
        $('.scroll-wrapper', '.clan-manage-content').trigger('update');
    };

    this.saveChange = function() {
        var nId = content.find('.edit-id').val();
        var nName = content.find('.edit-name').val();
        var r = 0;
        let str1 = '';
        let str2;

        if (nId != '' && nId != idRank) str1 = '&nrid=' + nId;

        str2 = '&name=' + esc(nName == '' ? name : nName);

        for (var i = 1; i < 12; i++) {
            if (i < 9) {

                var s = '.r' + Math.pow(2, i);
                var bool = content.find(s).hasClass('active');
                if (bool) r += Math.pow(2, i);

            } else {
                switch (i) {
                    case 9:
                        r += $('.rank_tabs_view>.bck span').attr('value') << 9;
                        break;
                    case 10:
                        r += $('.rank_tabs_usage>.bck span').attr('value') << 12;
                        break;
                    case 11:
                        r += $('.rank_tabs_itemlimit>.bck span').attr('value') << 15;
                        break;
                }
            }
        }
        _g('clan&a=rank&a2=edit&rid=' + idRank + str2 + '&r=' + r + str1, self.backToManage);
    };

    this.clearValIntputs = function() {
        content.find('.edit-id').val('');
        content.find('.edit-name').val('');
    };

    this.createOneNumerableRank = function(lab, i, ar, v) {
        var $oNR = tpl.get('one-numerable-rank');
        content.find('.numerable-ranks').append($oNR);

        const $menu = $oNR.find('.menu');
        var $span = $('<span>').addClass('small-header-info info-icon');
        $span.tip(_t(lab + '_tip', null, 'clan'));

        $oNR.find('.clan-icon').css('background', `url("../img/gui/clan_icons.png?v=${__build.version}") no-repeat ` + ((i + 9) * -24) + 'px 0');
        $oNR.find('.label').html(Par.tLang(lab) + ' ' + $span.prop('outerHTML'));
        $menu.addClass(lab).createMenu(v);
        $menu.setOptionWithoutCallbackByValue(ar);
        // $oNR.find('.menu>.bck span').html(ar).attr('value', ar);
    };

    //this.init();

};