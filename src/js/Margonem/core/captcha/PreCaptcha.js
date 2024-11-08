var tpl = require('core/Templates');
module.exports = function() {
    var si = null;
    var hidden = false;
    this.wndEl = Engine.interface.get$interfaceLayer().find('.pre-captcha')[0];
    this.toggleBtnEl = null;

    let removePreCaptcha

    this.init = function(autostart_time_left, _removePreCaptcha) {
        this.clear();
        this.addPreCaptchaInfo(autostart_time_left);
        this.createToggleButton();

        setRemovePreCaptcha(_removePreCaptcha);
    };

    const setRemovePreCaptcha = (_removePreCaptcha) => {
        removePreCaptcha = _removePreCaptcha;
    };

    this.createToggleButton = () => {
        this.toggleBtnEl = this.wndEl.querySelector('.captcha-pre-info__toggler');
        this.toggleBtnEl.addEventListener("click", this.toggleWindow);

        this.show();
    };

    this.toggleWindow = () => {
        if (hidden) {
            this.show();
        } else {
            this.hide();
        }
    };

    this.show = () => {
        this.wndEl.classList.add('show');
        this.toggleBtnEl.classList.add('is-open');
        hidden = false;
    };

    this.hide = () => {
        this.wndEl.classList.remove('show');
        this.toggleBtnEl.classList.remove('is-open');
        hidden = true;
    };

    this.getDefaultYWindowPos = () => {
        return hudEl.offsetHeight;
    };

    this.addPreCaptchaInfo = (autostart_time_left) => {
        const time = autostart_time_left - 1;
        const endDate = new Date();

        endDate.setSeconds(endDate.getSeconds() + time);

        const elInfo = tpl.get('captcha-pre-info')[0];
        const elTime = elInfo.querySelector('.captcha-pre-info__time');
        const elButtonWrapper = elInfo.querySelector('.captcha-pre-info__button');
        const elButton = createButton(_t('captcha_resolve_now'), ['small', 'green'], () => {
            this.removePreCaptchaInfo();
            _g('captcha&start=1');
        });

        elTime.textContent = time;
        elButtonWrapper.append(elButton);

        this.preCaptchaInfoTimeTick(elTime, endDate);

        this.wndEl.appendChild(elInfo);
    };

    this.preCaptchaInfoTimeTick = (elTime, endDate) => {
        si = setInterval(() => {
            let currentDate = new Date();
            let time = Math.ceil((endDate.getTime() - currentDate.getTime()) / 1000);

            if (time <= 0) {
                this.removePreCaptchaInfo();
            }

            elTime.innerHTML = time;
        }, 500);
    };

    this.removePreCaptchaInfo = () => {
        clearInterval(si);
        this.close();
        //bottomWrapper.querySelector('.captcha-pre-info').remove();
    };

    this.close = function() {
        this.hide();
        this.clear();

        removePreCaptcha();
    };

    this.clear = () => {
        this.wndEl.innerHTML = '';
    };
};