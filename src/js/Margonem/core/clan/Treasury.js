//var wnd = require('@core/Window');
var tpl = require('@core/Templates');
const InputMaskData = require('@core/InputMaskData');
module.exports = function(Par) {
    var content;
    var goldLabel;
    var slLabel;

    this.update = function() {
        this.updateHistoryTable();
        this.updateLabelAmount(goldLabel, Par.getProp('gold'));
        this.updateLabelAmount(slLabel, Par.getProp('credits'));
        this.allowSendSl();
        this.allowGetMoney();
        this.allowSendSlBut();
        this.availableOutfit();
        this.createMenu();
        $('.scroll-wrapper', content).trigger('update');
    };

    this.init = function() {
        this.createLabels();
        this.createButs();
        this.createOutfitHeader();
    };

    this.allowGetMoney = function() {
        var tab = [
            'hidden',
            'initial'
        ];
        var myRank = Par.getProp('myrank');
        var $e = content.find('.send-to-player');
        var bool = myRank & 4 ? 1 : 0;
        $e.css('visibility', tab[bool]);
    };

    this.allowSendSlBut = function() {
        var tab = [
            'hidden',
            'initial'
        ];
        var myRank = Par.getProp('myrank');
        var $e = content.find('.on-off-send-sl');
        var $sendSl = content.find('.send-sl');
        var bool = myRank & 1 ? 1 : 0;
        $e.css('visibility', tab[bool]);
        !bool ? $sendSl.addClass('mtop') : $sendSl.removeClass('mtop');
    };

    this.updateHistoryTable = function() {
        var header = this.createHistoryHeader();
        var $table = content.find('.history-table');
        $table.html('');
        $table.append(this.createHistory());
        $table.prepend(header);
    };

    this.createHistoryHeader = function() {
        var str = Par.tLang('treasury-history');
        var strDate = Par.tLang('date_time');
        return Par.createRecords([str, strDate], 'table-header interface-element-table-header-1-background');
    };

    this.createHistory = function() {
        var goldLog = Par.getProp('goldlog');
        var k = 0;
        var hist = [];
        var trs = [];
        for (var i in goldLog) {
            var kind = goldLog[i].kind;
            if ((k < 6) && (kind == 'gold' || kind == 'credit')) {
                var h = goldLog[i].txt.split(']');
                var datetime = h[0].substring(1);
                var datetimeFormatted = convertDateTime(datetime);
                hist[k] = h.slice(1).join(']');
                trs.push(Par.createRecords([hist[k], datetimeFormatted], ['left-td normal-td', 'normal-td']));
                k++;
            }
        }
        return trs;
    };

    this.addAmountLabel = function(label, amount) {
        var amountLabel = tpl.get('amount-label');
        amountLabel.find('.label').html(label);
        amountLabel.find('.amount').html(amount);
        return amountLabel;
    };

    this.updateLabelAmount = function(label, amount) {
        label.find('.amount').html(formNumberToNumbersGroup(amount));
    };

    this.createLabels = function() {
        var t = [
            Par.tLang('gold_cl'),
            Par.tLang('sl_cl'),
            Par.tLang('to_dress'),
            _t('put_sl_turnedoff')
        ];
        var $par = Par.wnd.$.find('.card-content');
        content = tpl.get('clan-treasury-content');
        goldLabel = this.addAmountLabel(t[0], 0);
        slLabel = this.addAmountLabel(t[1], 0);
        $par.append(content);
        content.find('.gold-info').html(goldLabel);
        content.find('.sl-info').html(slLabel);
        content.find('.no-send-sl>.label-info').html(t[3]);
        setOnlyPositiveNumberInInput(content.find('.amount-send-sl'));
        $('.scroll-wrapper', content).addScrollBar({
            track: true
        });
    };

    this.createButs = function() {
        var t = [
            Par.tLang('send_gold'),
            Par.tLang('accept-send'),
            Par.tLang('put_sl_on'),
            Par.tLang('to_dress'),
            Par.tLang('give_gold %amount%'),
            Par.tLang('how_to_get')
        ];
        var b1 = Par.addControll(t[0], 'send-gold-but', this.sendMoneyToTreasure);
        var b2 = Par.addControll(t[4], 'send-gold-player-but', this.sendMoneyToPlayer);
        var b3 = Par.addControll(t[1], 'send-sl-but', this.sendSLToTreasure);
        var b4 = Par.addControll(t[2], 'on-off-send-sl', this.onOffSendSl);
        var b5 = Par.addControll(t[3], 'to-dress-but', this.toDressOutfit);
        var b6 = Par.addControll(t[5], 'not-dress-but', this.openDoc);

        b1.add(b2).add(b3).add(b5).add(b6).addClass('small green');
        b4.addClass('small green');

        setInputMask(content.find('.amount-send-gold'), InputMaskData.TYPE.NUMBER_WITH_KMG)
    };

    this.openDoc = function() {
        var url = isPl() ? "https://pomoc.margonem.pl/index/view,322" : 'https://forum.margonem.com/topic/view,3116,1';
        var win = window.open(url, '_blank');
        win.focus();
    };

    this.createMenu = function() {
        var mem = [];
        var mlist = Par.getProp('mlist');
        var t = [
            Par.tLang('send_gold_to_treasury'),
            Par.tLang('send_gold_to_player'),
            Par.tLang('send_sl_to_treasury')
        ];
        for (var i = 0; i < mlist.length; i += 2) {
            var memId = mlist[i];
            var memName = mlist[i + 1];
            mem.push({
                'text': memName,
                'val': memId
            });
        }
        mem.sort((a, b) => a.text.localeCompare(b.text)); // sort by name

        content.find('.send-gold>.label-info').html(t[0]);
        content.find('.send-to-player>.label-info').html(t[1]);
        content.find('.send-sl>.label-info').html(t[2]);
        content.find('.choose-player').empty().createMenu(mem, true, null, {
            capitalize: false
        });
    };

    this.createOutfitHeader = function() {
        var str = Par.tLang('clan_outfits');
        var header = content.find('.outfit-header').find('.header-text');
        header.html(str);
    };

    this.sendMoneyToTreasure = function() {
        var i = content.find('.amount-send-gold');
        var v = removeSpaces(i.val());
        var money = parsePrice(v);
        if (checkInputValIsEmptyProcedure(money)) return;
        if (!checkParsePriceValueIsCorrect(money)) return;
        var str = _t('gold_deposit_confirm %amount%', {
            '%amount%': round(money, 10)
        }, 'clan');
        Par.alert(str, function() {
            _g('clan&a=save&f=gold&v=' + money, function() {
                i.val('');
            });
        });
    };

    this.sendMoneyToPlayer = function() {
        var i = content.find('.amount-send-gold');
        var e = Par.wnd.$.find('.choose-player .menu-option');
        var id = e.attr('value');
        var v = removeSpaces(i.val());
        var name = e.html();
        var money = parsePrice(v);
        //if (!money) {
        //	mAlert(_t('bad_value'));
        //	return;
        //}

        if (checkInputValIsEmptyProcedure(money)) return;
        if (!checkParsePriceValueIsCorrect(money)) return;

        var str = _t('gold_widthdraw %amount% %player%', {
            '%amount%': round(money, 10),
            '%player%': name
        }, 'clan');
        Par.alert(str, function() {
            _g('clan&a=save&f=gold&v=-' + money + '&pid=' + id, function() {
                i.val('');
            });
        });
    };

    this.sendSLToTreasure = function() {
        const $input = content.find('.amount-send-sl');
        const str = _t('credits_in %amount%', {
            '%amount%': $input.val()
        }, 'clan');
        const v = removeSpaces($input.val());
        Par.alert(str, function() {
            _g('clan&a=save&f=credits&v=' + v, function() {
                $input.val('');
            });
        });
    };

    this.toDressOutfit = function() {
        _g("clan&a=wear");
    };

    this.allowSendSl = function() {
        var t = [
            '.send-sl',
            '.no-send-sl'
        ];
        var txt = [
            Par.tLang('put_sl_off'),
            Par.tLang('put_sl_on')
        ];
        var bits = Par.getProp('bits');
        var visible = bits & 1 ? 1 : 0;
        var $slForm = content.find(".send-sl");
        //content.find(t[0] + ',' + t[1]).css('display', 'none');
        if (!visible) {
            $slForm.find(".label-info").addClass("disabled");
            $slForm.find(".send-sl-but .button").addClass("disable");
            $slForm.find(".amount-send-sl").attr('disabled', true);
        } else {
            $slForm.find(".label-info").removeClass("disabled");
            $slForm.find(".send-sl-but .button").removeClass("disable");
            $slForm.find(".amount-send-sl").attr('disabled', false);
        }
        content.find('.on-off-send-sl').find('.label').html(txt[+!visible]);
    };

    this.availableOutfit = function() {
        var t = [
            Par.tLang('outfit_disable'),
            Par.tLang('outfit_enable'),
            Par.tLang('how-get')
        ];
        var v = [
            'none',
            'block'
        ];
        var bits = Par.getProp('bits');
        var bool = bits & 2 ? 1 : 0;
        content.find('.to-dress-but').css('display', v[bool]);
        content.find('.to-dress-available').html(t[bool]);

        content.find('.not-dress-but').css('display', v[+!bool]);

        this.createOutfit(bool);
    };

    this.createOutfit = function(state) {
        var id = Par.getProp('id');
        var additionalPath = isPl() ? '' : 'com/';
        var v = [
            'clan/' + additionalPath + Engine.worldConfig.getWorldName() + '_' + id + 'm.gif', 0,
            'clan/' + additionalPath + Engine.worldConfig.getWorldName() + '_' + id + 'f.gif', 73
        ];
        var d = state ? v : false;
        Par.updateClanOutfit(d);
    };

    this.onOffSendSl = function() {
        var bits = Par.getProp('bits');
        var v = bits & 1 ? 0 : 1;
        _g("clan&a=credits&allow=" + v);
    };

    //this.init();

};