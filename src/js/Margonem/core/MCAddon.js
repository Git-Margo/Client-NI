var tpl = require('@core/Templates');

module.exports = function() {

    var self = this;
    this.wnd = null;
    this.nick = null;
    var amountOfWarningText = 14;

    this.init = function() {
        self.initWindow();
        self.initAllText();
        self.initAllMuteBtns();
        self.initUnmuteBtn();
        self.initScroll();
    };

    this.initWindow = function() {

        Engine.windowManager.add({
            content: tpl.get('mc-addon'),
            title: 'MC Addon',
            //nameWindow        : 'MCAddon',
            nameWindow: Engine.windowsData.name.MC_ADDON,
            objParent: this,
            nameRefInParent: 'wnd',
            managePosition: {
                x: '251',
                y: '65'
            },
            addClass: 'mc-addon-window',
            onclose: () => {
                this.close();
            }
        });
        this.wnd.addToAlertLayer();
        this.wnd.updatePos();
    };

    this.initAllText = function() {
        var $wrapper = self.wnd.$.find('.all-texts');
        for (var i = 0; i < amountOfWarningText; i++) {
            var one_text = tpl.get('mc-text');
            var txt = _t(i, null, 'mc-addon');
            $wrapper.append(one_text);
            one_text.find('.label-text').html(txt).tip(txt);
            self.createButton('send', 'green small', one_text.find('.send'), function() {
                var text = $(this).find('.label').parent().parent().parent().find('.label-text').html();
                _g('console&custom=.reminder' + esc(` "` + self.nick.replace(" ", "_") + `" "` + text + `"`));
            });
        }
        this.createCustomWarning($wrapper);
    };

    this.createCustomWarning = ($wrapper) => {
        var one_text = tpl.get('mc-text');
        $wrapper.append(one_text);
        const $input = createNiInput({
            cl: 'custom-warning-input'
        });
        one_text.find('.label-text').html($input);
        self.createButton('send', 'green small', one_text.find('.send'), function() {
            const text = $(this).find('.label').parent().parent().parent().find('.label-text input').val();
            if (text !== '') _g('console&custom=.reminder' + esc(` "` + self.nick.replace(" ", "_") + `" "` + text + `"`));
        });
    }

    this.initAllMuteBtns = function() {
        var t = [1, 6, 12, 18, 24, 36, 48, 60, 72];
        var $wrapper = self.wnd.$.find('.times-of-mute');
        for (var i = 0; i < t.length; i++) {
            var time = t[i];
            self.createButton(time, 'green small', $wrapper, function() {
                let t = $(this).find('.label').html();
                _g('console&custom=.mute' + esc(" " + self.nick.replace(" ", "_") + " " + t));
            });
        }
    };

    this.initUnmuteBtn = function() {
        self.createButton('Unmute', 'green small', self.wnd.$.find('.unmute'), function() {
            _g('console&custom=.unmute' + esc(" " + self.nick.replace(" ", "_")));
        });
    };

    this.createButton = function(text, cl, $parent, clb) {
        var $btn = tpl.get('button').addClass(cl);
        $btn.find('.label').html(text);
        $parent.append($btn);
        $btn.click(clb);
    };

    this.update = function({
        playerId,
        nick,
        attr
    }) {
        self.wnd.$.find('.nick-header').html(nick);
        self.nick = nick.replace(/ /gi, '_');

        const hadWarn = attr & 2;
        self.wnd.$.find('.had-warn').css('display', hadWarn ? 'block' : 'none');
    };

    this.initScroll = function() {
        self.wnd.$.find('.scroll-wrapper').addScrollBar({
            track: true
        });
        $('.scroll-wrapper', self.wnd.$).trigger('update');
    };

    this.close = function() {
        self.wnd.remove();
        Engine.mcAddon = false;
    };
};