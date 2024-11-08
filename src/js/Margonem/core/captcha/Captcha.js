// const wnd = require('core/Window');
const tpl = require('core/Templates');
const PreCaptcha = require('core/captcha/PreCaptcha.js');

module.exports = function() {
    let content;
    let selectedAnswers = [];
    let preCaptcha

    this.actions = {
        openCaptcha: 'openCaptcha',
        showPreCaptcha: 'showPreCaptcha',
        captchaDone: 'captchaDone',
        blockWithCounter: 'blockWithCounter',
        openCaptchaAndBlockInit: 'openCaptchaAndBlockInit'
    };

    this.init = function() {

    };

    this.blockMove = () => {
        Engine.lock.add('captcha');
    };

    this.unblockMove = () => {
        Engine.lock.remove('captcha');
    };

    this.getAction = (data) => {
        let actionName = null;
        if (isset(data.content)) {
            actionName = this.getEngine().allInit ? this.actions.openCaptcha : this.actions.openCaptchaAndBlockInit;
        } else if (isset(data.autostart_time_left)) {
            actionName = this.actions.showPreCaptcha;
        } else if (isset(data.done) && data.done) {
            actionName = this.actions.captchaDone;
        } else if (isset(data.blockade_time_left)) {
            actionName = this.actions.blockWithCounter;
        } else if (isset(data.blocked)) {
            actionName = false;
        } else {
            throw new Error('[Captcha.js, getAction] No action for this engine answer');
        }

        return actionName;
    };

    this.updateData = (data) => {
        const action = this.getAction(data);
        if (action) {
            this[action](data);
        }
    };

    this.openCaptcha = (data) => {
        if (isset(this.wnd)) {
            this.close();
        }

        if (preCaptcha) {
            preCaptcha.close();
        }

        this.initWindow();
        this.create(data);

        this.wnd.center();
    };

    this.openCaptchaAndBlockInit = (data) => {
        this.openCaptcha(data);
        this.engineStopAndBlockNextInit();
    };

    this.showPreCaptcha = (data) => {
        preCaptcha = new PreCaptcha();
        preCaptcha.init(data.autostart_time_left, removePreCaptcha);
    };

    const removePreCaptcha = () => {
        preCaptcha = null;
    }

    this.captchaDone = (data) => {
        this.close();
        //mAlert('Correct answer');
    };

    this.blockWithCounter = (data) => { // this appear in normal game or when start interface
        this.close();
        this.countTimeToNextCaptcha(data.blockade_time_left);
        this.engineStopAndBlockNextInit();
        error('Engine stop');
    };

    this.engineStopAndBlockNextInit = (data = null) => {
        this.getEngine().stop();
        this.getEngine().setBlockSendNextInit(true);
    };

    this.countTimeToNextCaptcha = (blockade_time_left) => {
        let time = blockade_time_left;
        //mAlert(_t('captcha_wrong_answer'));

        mAlert(_t('captcha_wrong_answer'), [{
            txt: _t('main_page'),
            hotkeyClass: 'alert-accept-hotkey',
            callback: function() {
                window.location.href = (isPl()) ? "https://www.margonem.pl/" : "https://margonem.com/";
                return true;
            }
        }]);

        setInterval(() => {
            time--;
            if (time < 0) time = 0;
            if (time < 1) location.reload();
            this.updateCaptchaBlockadeTimer(time);
        }, 1000);
        this.updateCaptchaBlockadeTimer(time);
    };

    this.updateCaptchaBlockadeTimer = (time) => {
        $('#captcha-timer').html(getSecondLeft(time));
    };

    this.create = (data) => {
        this.clear();
        this.createImg({
            image: data.content.image
        });
        this.createQuestion({
            text: data.content.question.text
        });
        this.createButtons({
            answers: data.content.question.options
        });
        this.createConfirmButton();
        this.createTriesLeft(data.triesLeft);
        this.blockMove();
    };

    this.createImg = ({
        image
    }) => {
        var img = document.createElement("IMG");
        img.setAttribute("src", image.data);
        img.setAttribute("width", image.resolution.x);
        img.setAttribute("height", image.resolution.y);
        content.querySelector('.captcha__image').append(img);
    };

    this.createQuestion = ({
        text
    }) => {
        content.querySelector('.captcha__question').textContent = text;
    };

    this.createButtons = ({
        answers
    }) => {
        for (const answer in answers) {
            const value = answers[answer];
            const button = createButton(value, ['small', 'green'], this.buttonOnClick);
            content.querySelector('.captcha__buttons').append(button);
        }
    };

    this.createConfirmButton = () => {
        const confirmButton = createButton(_t('captcha_confirm'), ['small', 'green'], this.confirmOnClick);
        content.querySelector('.captcha__confirm').append(confirmButton);
    };

    this.createTriesLeft = (triesLeft) => {
        content.querySelector('.captcha__triesleft').innerHTML = (_t('captcha_triesleft')) + triesLeft;
    };

    this.buttonOnClick = (e) => {

        if (!e.isTrusted) return;

        var targetElement = e.target;
        const index = this.getNodeIndex(targetElement);
        targetElement.classList.toggle('pressed');
        this.updateSelectedAnswers(index);
        //this.setConfirmButton();
    };

    this.updateSelectedAnswers = (item) => {
        if (!this.getSelectedAnswer().includes(item)) {
            this.addSelectedAnswer(item);
        } else {
            this.removeSelectedAnswer(item);
        }
    };

    this.getSelectedAnswer = () => {
        return selectedAnswers;
    };

    this.addSelectedAnswer = (item) => {
        this.getSelectedAnswer().push(item);
    };

    this.removeSelectedAnswer = (item) => {
        this.getSelectedAnswer().splice(this.getSelectedAnswer().indexOf(item), 1);
    };

    this.getFinishRequest = () => {
        const answers = this.getSelectedAnswer().sort().join(',');
        return `captcha&answerId=${answers}`;
    };

    //this.setConfirmButton = () => {
    //	const confirmBtnEl = content.querySelector('.captcha__confirm .button');
    //	if (selectedAnswers.length > 0) {
    //		confirmBtnEl.classList.remove('disable');
    //	} else {
    //		confirmBtnEl.classList.add('disable');
    //	}
    //};

    this.confirmOnClick = (e) => {

        if (!e.isTrusted) return;

        const request = this.getFinishRequest();
        const Engine = this.getEngine();

        if (!Engine.allInit) {
            Engine.start();
            Engine.setFirstLoadInit1(true);
            Engine.setFirstLoadInit2(true);
            Engine.reCallInitQueue(`&${request}`);
        } else {
            _g(request);
        }
    };

    this.initWindow = function() {

        Engine.windowManager.add({
            content: this.getCaptchaTpl(),
            nameWindow: Engine.windowsData.name.CAPTCHA,
            type: Engine.windowsData.type.TRANSPARENT,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('captcha'),
            addClass: 'captcha-window',
            closeable: false,
            onclose: () => {
                this.close();
            }
        });
        this.setDefaultContent();
        this.wnd.addToCaptchaLayer();
    };

    this.clear = () => {
        this.setDefaultContent();
        selectedAnswers = [];
    };

    this.setDefaultContent = () => {
        content = this.getCaptchaTpl();
        this.wnd.content(content);
    };

    this.getCaptchaTpl = () => {
        return tpl.get('captcha')[0];
    };

    this.getNodeIndex = elm => [...elm.parentNode.children].indexOf(elm);

    this.close = function() {
        this.unblockMove();
        if (!isset(this.wnd)) return;
        // this.wnd.$.remove();
        this.wnd.remove();
        //delete (this.wnd);
        //Engine.captcha = false;
    };

    this.getEngine = function() {
        return Engine;
    };
};