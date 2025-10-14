// var wnd = require('@core/Window');
var tpl = require('@core/Templates');
module.exports = function(Par) {
    var self = this;

    /*
    when id > 99 val take from another json than attr

    input: m-menu, i-input
    range: [start, stop, leap, invert*] *optional
    find : 'BiggerOrEqual', 'LesserOrEqual' find is optional
    part: where append
    */
    var attrDataTab = { // id > 99 val take from another json than attr
        '0': {
            //name: Par.tLang('recruit_state'),
            name: 'empty',
            input: 'c',
            part: 0
        },
        '1': {
            //name: Par.tLang('membership_fees'),
            name: 'empty',
            //input: 'm',
            input: 'c',
            part: 0
        },
        '2': {
            name: Par.tLang('min_level'),
            input: 'i',
            range: [0, 300, 10],
            find: 'BiggerOrEqual',
            part: 0,
            clanListFilter: 1

        },
        '7': {
            name: Par.tLang('max_level'),
            input: 'i',
            range: [10, 300, 10, true],
            //find : 'LesserOrEqual',
            find: 'BiggerOrEqual',
            part: 0,
            clanListFilter: 2
        },
        '12': {
            //name: Par.tLang('age'),
            name: 'empty',
            input: 'i',
            range: [13, 30, 1],
            find: 'BiggerOrEqual',
            part: 0
        },
        '17': {
            //name: Par.tLang('aliance'),
            name: 'empty',
            input: 'c',
            part: 1
        },
        '18': {
            //name: Par.tLang('wars'),
            name: 'empty',
            input: 'c',
            part: 1
        },
        '19': {
            name: Par.tLang('clan type'),
            input: 'm',
            strValues: [
                Par.tLang('neutral'),
                Par.tLang('feature'),
                Par.tLang('war')
            ],
            part: 1,
            clanListFilter: 4
        },
        '21': {
            name: Par.tLang('recruit_state_new'), //'Stan rekrutacji',
            input: 'm',
            strValues: [
                _t('close_recruit'), //
                _t('open_recruit'), //Aplikacja
                _t('free recruitment') //Otwarta
            ],
            part: 1,
            clanListFilter: 0
        },
        '100': {
            name: Par.tLang('clan_level'),
            input: 'i',
            range: [0, 30, 1],
            find: 'BiggerOrEqual',
            part: 0,
            clanListFilter: 3
        },
        '101': {
            name: Par.tLang('rank_outfit'),
            //input: 'm',
            input: 'c',
            part: 1,
            clanListFilter: 5
        },
        '102': {
            name: Par.tLang('depocards'),
            input: 'i',
            range: [0, 5, 1],
            part: 1,
            clanListFilter: 6
        },
        '103': {
            name: Par.tLang('maxParticipants'),
            input: 'i',
            range: [0, 8, 1],
            find: 'BiggerOrEqual',
            part: 2,
            clanListFilter: 7
        },
        '104': {
            name: Par.tLang('expBonus'),
            input: 'i',
            range: [0, 10, 1],
            find: 'BiggerOrEqual',
            part: 2,
            clanListFilter: 8
        },
        '105': {
            name: Par.tLang('questExpBonus'),
            input: 'i',
            range: [0, 10, 1],
            find: 'BiggerOrEqual',
            part: 2,
            clanListFilter: 9
        },
        '106': {
            name: Par.tLang('allyEnemyCount'),
            input: 'i',
            range: [0, 10, 1],
            find: 'BiggerOrEqual',
            part: 2,
            clanListFilter: 10
        },
        '107': {
            name: Par.tLang('blessing'),
            input: 'i',
            range: [0, 7, 1],
            find: 'BiggerOrEqual',
            part: 2,
            clanListFilter: 11
        },
        // '108': {
        // 	name: Par.tLang('cursedItem'),
        // 	input: 'i',
        // 	range: [0, 5, 1],
        // 	find : 'BiggerOrEqual',
        // 	part: 2,
        // 	clanListFilter: 12
        // },
        '109': {
            name: Par.tLang('healPower'),
            input: 'i',
            range: [0, 10, 1],
            find: 'BiggerOrEqual',
            part: 2,
            clanListFilter: 13
        },
        '110': {
            name: Par.tLang('timeTickets'),
            input: 'i',
            range: [0, 10, 1],
            find: 'BiggerOrEqual',
            part: 2,
            clanListFilter: 14
        }
    };

    this.createAtribute = function($wrapper, id, content, attrInBits, canEdit, noNone) {
        var $oneA = tpl.get('one-clan-atribute');
        var kind = attrDataTab[id].input;
        var name = attrDataTab[id].name;
        var part = attrDataTab[id].part;

        if (attrDataTab[id].name == 'empty') $oneA.addClass('empty');

        $oneA.addClass('recruit-attr-id-' + id);
        $wrapper.find('.clan-part-' + part).append($oneA);
        $oneA.find('.atribute-name').html(name);

        if (canEdit) {
            var $input = kind == 'i' ? $('<input>') : $('<div>');
            $oneA.find('.input-wrapper').append($input);

            switch (kind) {
                case 'i':
                    this.createTextInput($input, id, content, noNone);
                    this.createTipToInput($input, id);
                    break;
                case 'm':
                    this.createMenuInput($input, id, noNone);
                    break;
                case 'c':
                    this.createDivideButton($input, id, noNone);
                    break;
            }
        }
        if (attrInBits) this.setMenuOptionOrTextInputOrDivideOptionOrNormalText(id, $oneA, kind, attrInBits);
    };

    this.setMenuOptionOrTextInputOrDivideOptionOrNormalText = function(id, $oneA, kind, attrInBits) { // hehehe
        var v = this.parseValFromBits(id, attrInBits[0]);
        if (attrInBits[1] == 'inInput') {
            switch (kind) {
                case 'm':
                    var $option = $oneA.find('.bck-wrapper>div:contains(' + v + ')');
                    var title = $option.html();
                    var value = $option.attr('value');
                    $oneA.find('.menu-option').attr('value', value).html(title);
                    break;
                case 'i':
                    $oneA.find('input').val(v);
                    break;
                case 'c':
                    var $option = $oneA.find('.option:has(.label:contains(' + v + '))');
                    $oneA.find('.bck').removeClass('active');
                    $option.find('.bck').addClass('active');
                    break;
            }
        } else $oneA.find(attrInBits[1]).html(v);
    };

    this.getMapOfBits = function(attributes, level, depoTabs, skils, outfit) {
        var attrData = {
            0: self.toBinary(attributes & 1),
            1: self.toBinary((attributes >> 1) & 1),
            2: self.toBinary((attributes >> 2) & 31),
            7: self.toBinary((attributes >> 7) & 31),
            12: self.toBinary((attributes >> 12) & 31),
            17: self.toBinary((attributes >> 17) & 1),
            18: self.toBinary((attributes >> 18) & 1),
            19: self.toBinary((attributes >> 19) & 3),
            21: self.toBinary((attributes >> 21) & 3)
            //22: self.toBinary((attributes >> 22) & 1),
            //23: self.toBinary((attributes >> 23) & 3)
        };
        if (!skils) return attrData;
        attrData[100] = self.toBinary(level);
        attrData[101] = outfit == '' ? 0 : 1;
        attrData[102] = self.toBinary(depoTabs);
        attrData[103] = self.toBinary(skils.maxParticipants.lvl);
        attrData[104] = self.toBinary(skils.expBonus.lvl);
        attrData[105] = self.toBinary(skils.questExpBonus.lvl);
        attrData[106] = self.toBinary(skils.allyEnemyCount.lvl);
        attrData[107] = self.toBinary(skils.blessing.lvl);
        attrData[108] = self.toBinary(skils.cursedItem.lvl);
        attrData[109] = self.toBinary(skils.healPower.lvl);
        attrData[110] = self.toBinary(skils.timeTickets.lvl);
        return attrData;
    };

    this.parseValFromBits = function(id, bits) {
        var attr = attrDataTab[id];
        var range = attr.range;
        var strValues = attr.strValues;
        var parseId = parseInt(id);

        if (isset(strValues)) return this.getStrValFromBits(bits, parseId);
        if (!isset(range)) return bits[id] == 1 ? _t('yes') : _t('no');
        return this.rangeOfBits(bits, parseId);
    };

    this.getStrValFromBits = function(bits, id) {
        var bitsStr = '';
        var attr = attrDataTab[id];
        var strValues = attr.strValues;
        var l = strValues.length;
        var amountBits = this.amountBits(l);
        var end = amountBits + id;

        //for (var i = id; i < end; i++) {
        //	bitsStr += bits[i];
        //}
        //var dec = parseInt(bitsStr, 2);
        var dec = parseInt(bits[id], 2);
        return strValues[dec];
    };

    this.rangeOfBits = function(bits, id) {
        var start = attrDataTab[id].range[0];
        var stop = attrDataTab[id].range[1];
        var leap = attrDataTab[id].range[2];
        var inverse = attrDataTab[id].range[3];
        var decimal = parseInt(bits[id], 2);
        if (inverse) return Math.abs((start + decimal * leap) - (start + stop));
        else return start + decimal * leap;
    };

    this.createMenuInput = function($e, id, noNone) {
        var data = this.getAttrDataMenu(id, noNone);
        $e.addClass('menu default');
        $e.createMenu(data, true);
        $e.find('span').addClass('input-val-' + id);
    };

    this.createDivideButton = function($e, id, noNone) {
        var data = this.getAttrDataMenu(id, noNone);
        //this.divideButton($e, data, id)
        $e.createDivideButton(data, id, true);
    };

    this.saveAtributes = function() {
        var t = [0, 1, 2, 7, 12, 17, 18, 19, 21];
        var $recruitContent = Par.getRecruit().getContent();
        var atributes = Par.getProp('attributes');
        var bits = self.getMapOfBits(atributes);

        for (var i = 0; i < t.length; i++) {
            var id = t[i];
            var v = self.prepareValueFromInput($recruitContent, id);
            if (v < 0) return;
            bits[id] = self.toBinary(v);
        }
        self.sendData(bits);
    };

    this.prepareValueFromInput = function($btn, id) {
        var $o = $btn.find('.input-val-' + id);
        var kind = attrDataTab[id].input;
        var v;
        if (attrDataTab[id].name == 'empty') return 0;
        else {
            switch (kind) {
                case 'i':
                    v = $o.val();
                    break;
                case 'm':
                    v = $o.attr('value');
                    break;
                case 'c':
                    v = $o.find('.active').attr('value');
                    break;
            }

        }

        v = this.checkRangeExist(id, v);
        return v === "" ? -1 : parseInt(v);
    };

    this.checkRangeExist = function(id, v) {
        var range = attrDataTab[id].range;
        if (!isset(range)) return v;
        if (range[3]) v = Math.abs(v - range[1]) / range[2];
        else v = (v - range[0]) / range[2];
        return v;
    };

    this.sendData = function(bits) {
        var str = '';
        for (var id in bits) {
            var oneA = bits[id];

            if (attrDataTab[id].range) {
                var start = attrDataTab[id].range[0];
                var stop = attrDataTab[id].range[1];
                var leap = attrDataTab[id].range[2];

                var range = (stop - start) / leap + 1;
                var amountBits = this.amountBits(range);
            } else {

                if (attrDataTab[id].strValues) {
                    var l = attrDataTab[id].strValues.length;
                    amountBits = this.amountBits(l);
                } else amountBits = 1;

            }

            var str2 = '';
            while (str2.length < amountBits - oneA.length) {
                str2 += 0;
            }
            str2 += oneA;
            str = str2 + str;
        }
        _g('clan&a=set_attrs&v=' + self.toDecimal(str));
    };

    this.amountBits = function(v) {
        var val = 2;
        for (var i = 1; i < 10; i++) {
            if (v + 1 <= val) return i;
            val *= 2;
        }
    };

    this.createTextInput = function($e, id, content) {
        var name = 'input-val-' + id;
        $e.addClass('default ' + name);
        setOnlyPositiveNumberInInput($e);
        $e.focusout(function() {
            var val = $(this).val();
            var cl = $(this).attr('class');
            var id = cl.replace('default input-val-', '');
            var newVal = self.correctVal(id, val);
            $(this).val(newVal);
        });
        Par.createPlaceHolder('.' + name, '----', content);
    };

    this.createTipToInput = function($input, id) {
        var r = attrDataTab[id].range;
        var leap = r[2];
        var str0 = _t('leap');
        var str1 = leap > 1 ? (' ' + str0 + ' ' + leap) : '';
        var str2 = 'Min: ' + r[0] + ' Max: ' + r[1] + str1;
        $input.tip(str2);
    };

    this.getAttrDataMenu = function(id, noNone) {
        var t;
        if (noNone) t = [];
        else {
            t = [{
                'text': '<div class="icon"><div class="zero"></div></div>',
                'val': ''
            }];
        }
        var d = attrDataTab[id];

        if (isset(d.range)) return this.createRangeValues(d, t);
        if (isset(d.strValues)) return this.createStrValues(d, t);

        t.push({
            'text': _t('yes'),
            'val': 1
        });
        t.push({
            'text': _t('no'),
            'val': 0
        });
        return t;
    };

    this.createRangeValues = function(d, t) {
        var start = d.range[0];
        var stop = d.range[1];
        var leap = d.range[2];
        for (var i = start; i < stop; i = i + leap) {
            var o = {
                'text': i,
                'val': i
            };
            t.push(o);
        }
        return t;
    };

    this.createStrValues = function(d, t) {
        var arrayOfStr = d.strValues;
        for (var i = 0; i < arrayOfStr.length; i++) {
            var o = {
                'text': arrayOfStr[i],
                'val': i
            };
            t.push(o);
        }
        return t;
    };

    this.correctVal = function(id, v) {
        var d = attrDataTab[id].range;
        var min = d[0];
        if (v <= min) return min;
        var max = d[1];
        if (v >= max) return max;
        var leap = d[2];
        for (var i = min; min < max; i = i + leap) {
            if (i == v) return v;
            var next = i + leap;
            if (next > v) return i;
        }
    };

    this.toBinary = function(val) {
        return (val >>> 0).toString(2)
    };

    this.toDecimal = function(val) {
        return parseInt(val, 2);
    };

    this.getAttrDataTab = function() {
        return attrDataTab;
    };

};