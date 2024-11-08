var tpl = require('core/Templates');
var Templates = require('core/Templates');

module.exports = function(nick) {

    var self = this;
    this.wnd = null;
    this.nick = nick;

    this.init = function() {
        self.initWindow();
        self.createAllButtons();
        self.initCos();
        self.initCheckboxes();
        self.acceptBut();
    };

    this.initWindow = function() {

        Engine.windowManager.add({
            content: tpl.get('chat-ban'),
            //nameWindow        : 'SMCAddon',
            nameWindow: Engine.windowsData.name.SMC_ADDON,
            nameRefInParent: 'wnd',
            objParent: this,
            managePosition: {
                x: '696',
                y: '61'
            },
            title: 'SMC Addon',
            onclose: () => {
                self.close();
            }
        });

        this.wnd.addToAlertLayer();
        this.wnd.updatePos();
    };

    this.close = function() {
        //self.wnd.$.remove();
        self.wnd.remove();
        // delete (self.wnd);
        Engine.smcAddon = false;
    };

    this.createAllButtons = function() {
        var days = [1, 3, 7, 14, 30];
        for (var i in days)
            self.createButton(days[i]);
        self.createButton();
    };

    this.createButton = function(day) {
        var id = 'banday_' + (day ? day : 'custom');
        var $banDay = Templates.get('banday-row'); //.attr('id', id);
        var $nr = $banDay.find('.nr');
        $banDay.find('.checkbox').attr('id', id);
        if (day) $nr.attr('for', 'banday_' + day).html(day);
        else {
            $nr.remove();
            var $input = $('<input>').attr({
                'id': 'custom_banday_value',
                'for': 'banday_custom'
            }).addClass('default');
            $banDay.find('.table-wrapper').append($input);
        }
        self.wnd.$.find('.days').append($banDay);
    };

    this.acceptBut = function() {
        var $btn = Templates.get('button');
        self.wnd.$.find('.ban-btn').append($btn);
        $btn.find('.label').html('OK');
        $btn.click(function() {
            var $active = self.wnd.$.find('.active');

            var type = $active.length ? $active.attr('id').substr(7) : null;
            var amount = type == 'custom' ? $('#custom_banday_value').val() : type;
            var bool = !isNaN(parseInt(amount)) && $('.ban-reason').val().length >= 10;
            if (bool) {
                _g('gm&a=ban&nick=' + esc(nick) + '&days=' + amount + '&reason=' + esc($('#banday_reason').val()), function() {
                    self.close();
                });
            } else mAlert(_t('banday_wrong_values_error'));

        });
    };

    this.initCos = function() {
        self.wnd.$.find('.question').html(_t('bandays_amount for %name%', {
            '%name%': self.nick
        }));
        self.wnd.$.find('.ban-reason').attr('id', 'banday_reason')
    };

    this.initCheckboxes = function() {
        self.wnd.$.find('.banday-row').on('click', function() {
            $('.banday-row').find('.checkbox').removeClass('active');
            $(this).find('.checkbox').addClass('active');
            $(this).find('input').focus();
        });
    };

    //this.init();

};