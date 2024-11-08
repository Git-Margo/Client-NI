module.exports = function() {
    this.counter = 0;
    this.mailsRefresh = function(val) {
        if (val != 0)
            this.counter = val;
    };

    this.newMail = function(val) {
        if (val == 0) return;
        var name = 'mailnotifier';
        var $notif = $('#' + name);
        if (!$notif.length) $notif = Engine.interface.createNotif(name);
        $notif.find('.notif-value').text(val);
    };

    this.setRecipient = function(v) {
        var $notif = $('#mailnotifier');
        var str = _t('last_mail_msg %from%', {
            '%from%': v
        }, 'default');
        $notif.tip(str, 't_notif');
    };
};