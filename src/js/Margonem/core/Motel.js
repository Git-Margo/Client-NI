/**
 * Created by Michnik on 2015-07-07.
 */
var Tpl = require('@core/Templates');
module.exports = function() {
    var self = this;

    this.tLang = function(name, param) {
        param = param || null;
        return _t(name, param, 'motel');
    };

    this.init = function() {
        Engine.lock.add('motel');
        // this.wnd = new Window({
        // 	content: Tpl.get('motel-window'),
        // 	//title: 'Motel',
        // 	onclose: function () {
        // 		self.close();
        // 	}
        // });

        // $('.alerts-layer').append(this.wnd.$);
        // this.wnd.$.show();
        // this.wnd.center();

        Engine.windowManager.add({
            content: Tpl.get('motel-window'),
            title: 'Motel',
            //nameWindow        : 'Motel',
            nameWindow: Engine.windowsData.name.MOTEL,
            objParent: this,
            nameRefInParent: 'wnd',
            onclose: () => {
                this.close();
            }
        });

        this.wnd.addToAlertLayer();
        this.wnd.show();
        this.wnd.center();
    };

    this.updateData = function(v) {
        this.wnd.title(v.name);
        //this.wnd.$.find('.motel-label').html(v.name);
        this.wnd.$.find('.rooms-description').html(v.desc);
        this.fillTranslate();
        this.fillTable(v.rooms);
    };

    this.fillTranslate = function() {
        this.wnd.$.find('.room-th').html(self.tLang('room_th'));
        this.wnd.$.find('.state-th').html(self.tLang('state_th'));
        this.wnd.$.find('.price-th').html(_t('price_th', null, 'auction'));
        this.wnd.$.find('.amount-th').html(self.tLang('amount_th'));
        this.wnd.$.find('.time-th').html('Czas');
        this.wnd.$.find('.action-th').html('Akcja');
    };

    this.getButton = function(id, text, callback) {
        var $btn = Tpl.get('button').addClass('green small');
        $btn.find('.label').html(self.tLang(text)).on('click', (function(id) {
            return function() {
                callback(id);
            }
        })(id));

        return $btn;
    };

    this.fillTable = function(v) {
        var $row = null;
        var $containerYours = [];
        var $containerToRent = [];

        for (var i = 0; i < v.length; i += 5) {
            $row = $('<tr/>');
            var $nameTd = $('<td/>').html(v[i + 1]);
            $row.append($nameTd);
            if (v[i + 3] == 2) { // my room
                var strRent = _t('rent-to') + '<br>' + ut_fulltime(v[i + 4]);
                $nameTd.attr('rowspan', 3);

                var $row2 = $('<tr/>');
                var $row3 = $('<tr/>');

                $containerYours.push($row);
                $containerYours.push($row2);
                $containerYours.push($row3);

                $row.append($('<td>').html(strRent).attr('rowspan', 3));

                $row.append($('<td>').append($('<div/>', {
                    class: 'default rent menu',
                    id: 'motel' + v[i]
                })));
                $row.append($('<td>').html(round(v[i + 2], 5)).attr({
                    id: 'price-motel' + v[i],
                    value: v[i + 2]
                }));

                var keyPrice = v[i + 2] * 0.1;
                var $input = $('<input/>').val(1).attr({
                    'id': 'rokey' + v[i],
                    min: 1,
                    max: 10,
                    maxLength: 2
                }).addClass('default');
                setOnlyPositiveNumberInInput($input);
                self.inputFocusOut($input, keyPrice, $row2);

                $row.append($('<td>').append($('<div/>', {
                    html: self.getButton(v[i], 'long_opt', self.rentRoom)
                })));

                $row2.append($('<td>').append($input));
                $row2.append($('<td>').html(round(keyPrice, 5)).attr('value', keyPrice).addClass('new-key-cost'));
                $row2.append($('<td>').append($('<div/>', {
                    html: self.getButton(v[i], 'keysadd_opt', self.dupKeys)
                })));

                $row3.append($('<td>').html('-'));
                $row3.append($('<td>').html(round(v[i + 2] * 0.3, 5)));
                $row3.append($('<td>').append($('<div/>', {
                    html: self.getButton(v[i], 'keysrm_opt', self.deleteKeys)
                })));
            } else if (v[i + 3] == 0) { // free room
                $containerToRent.push($row);
                $row
                    .append($('<td/>', {
                        html: _t('room_free_new')
                    }).css('color', 'green'))
                    .append($('<td/>', {
                        html: $('<div/>', {
                            class: 'default rent menu',
                            id: 'motel' + v[i]
                        })
                    }))
                    .append($('<td/>', {
                        html: round(v[i + 2], 5),
                        value: v[i + 2],
                        id: 'price-motel' + v[i]
                    }))
                    .append($('<td/>', {
                        html: self.getButton(v[i], 'rent_this', self.rentRoom)
                    }));

            } else {
                $containerToRent.push($row);
                $row
                    .append($('<td/>', {
                        html: _t('room_taken') + '<br>' + ut_fulltime(v[i + 4])
                    }).css('color', 'red'))
                    .append($('<td/>', {
                        html: '-'
                    }))
                    .append($('<td/>', {
                        html: round(v[i + 2], 5),
                        value: v[i + 2],
                        id: 'price-motel' + v[i]
                    }))
                    .append($('<td/>', {
                        html: '-'
                    }));
            }
        }
        this.wnd.$.find('.yours-room>tbody').empty().html($containerYours);
        this.wnd.$.find('.to-rent-room>tbody').empty().html($containerToRent);
        //this.wnd.$.find('.info-wrapper').html(self.tLang('room_info_txt2'));
        this.wnd.$.find('.table-wrapper').addScrollBar({
            track: true
        });
        $('.menu', this.wnd.$).each(function() {
            self.createMenu($(this));
        });
        $('.scroll-wrapper').trigger('scrollTop').trigger('update');
    };

    this.createMenu = function(menu) {
        var options = [{
                text: self.tLang('time_1m'),
                val: 1
            },
            {
                text: self.tLang('time_2m'),
                val: 2
            },
            {
                text: self.tLang('time_3m'),
                val: 3
            },
            {
                text: self.tLang('time_6m'),
                val: 6
            },
            {
                text: self.tLang('time_12m'),
                val: 12
            }
        ];
        menu.createMenu(options, true, function(v) {
            var v = menu.find('.menu-option').attr('value');
            var id = 'price-' + menu.attr('id');
            var $prize = $('#' + id);
            var parseP = parsePrice($prize.attr('value'));
            $prize.html(round(parseP * v, 5));
        });
    };

    this.inputFocusOut = function($input, price, $wrapper) {
        $input.focusout(function() {
            var v = $input.val();
            $wrapper.find('.new-key-cost').html(round(v * price, 5)).attr(v * price)
        });
    };

    this.dupKeys = function(id) {
        var amount = $('#rokey' + id).val();
        var oneM = $('#price-motel' + id).attr('value');
        var gold = round(parsePrice(oneM) * amount * 0.1, 5);
        var pl = amount > 4 ? 3 : amount > 1 ? 2 : 1;

        if (checkInputValIsEmptyProcedure(amount)) return;
        if (Number(amount) < 1 || Number(amount) > 10) {
            mAlert(self.tLang('duplicate_key_bad_value'));
            return;
        }

        mAlert(self.tLang('duplicate_key_confirm' + pl + ' %amount% %gold%', {
                '%amount%': amount,
                '%gold%': gold
            }),
            [{
                txt: _t('yes'),
                callback: function() {
                    _g("rooms&room=" + id + "&keydup=" + amount);
                    return true;
                }
            }, {
                txt: _t('no'),
                callback: function() {
                    return true;
                }
            }]);
    };

    this.deleteKeys = function(id) {
        var oneM = $('#price-motel' + id).attr('value');
        var gold = round(parsePrice(oneM) * 0.3, 5);
        mAlert(self.tLang('room_key_remove_confirm_new %gold%', {
                '%gold%': gold
            }),
            [{
                txt: _t('yes'),
                callback: function() {
                    _g("rooms&delkeys=" + id);
                    return true;
                }
            }, {
                txt: _t('no'),
                callback: function() {
                    return true;
                }
            }]);
    };

    this.rentRoom = function(id) {
        var oneM = $('#price-motel' + id).attr('value'),
            rtime = $('#motel' + id + ' span').attr('value'),
            rtime2 = self.tLang('rm_1month'), //'miesiï¿½c'
            price = round(oneM * rtime, 5);
        if (rtime > 4)
            rtime2 = rtime + self.tLang('rm_2months'); //' miesiï¿½cy'
        else if (rtime > 1)
            rtime2 = rtime + self.tLang('rm_2months*'); //' miesiï¿½ce';

        mAlert(self.tLang('room_confirm_question2 %time% %gold%', {
                '%time%': rtime2,
                '%gold%': price
            }),
            [{
                txt: _t('yes'),
                callback: function() {
                    _g("rooms&rent=" + id + "&m=" + rtime);
                    return true;
                }
            }, {
                txt: _t('no'),
                callback: function() {
                    return true;
                }
            }]);
    };

    this.close = function() {
        //self.wnd.$.remove();
        self.wnd.remove();
        Engine.lock.remove('motel');
        Engine.motel = false;
        // delete (self.wnd);
        //delete (self);
    };

    //this.init();
};