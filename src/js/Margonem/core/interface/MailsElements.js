module.exports = function() {
    this.counter = 0;
    this.mailsRefresh = function(val) {
        if (val != 0)
            this.counter = val;
    };

    this.newMail = function(val) {
        if (val == 0) {
            return;
        }

        let name = 'mailnotifier';
        let nameLightMode = 'mail-notifier-light-mode';
        let $notif = $('#' + name);
        let $mailLightMode = $('.' + nameLightMode);

        if (!$notif.length) {
            $notif = Engine.interface.createNotif(name);
            $mailLightMode = $('<div>').addClass(nameLightMode);

            $mailLightMode.append($('<div>').addClass('notif-value interface-element-amount'));
            getEngine().interface.get$interfaceLayer().find('.character_wrapper').append($mailLightMode);
        }

        $notif.find('.notif-value').text(val);
        $mailLightMode.find('.notif-value').html(val);
    };

    this.setRecipient = function(v) {
        let $notif0 = $('#mailnotifier');
        let $notif1 = getEngine().interface.get$interfaceLayer().find('.character_wrapper').find('.mail-notifier-light-mode');

        let str = _t('last_mail_msg %from%', {
            '%from%': v
        }, 'default');

        $notif0.tip(str, 't_notif');
        $notif1.tip(str, 't_notif');
    };
};