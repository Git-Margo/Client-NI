/**
 * Created by Michnik on 2015-05-27.
 */
var Tpl = require('core/Templates');
//var Storage = require('core/Storage');
//var Items = require('core/items/ItemsManager');
module.exports = function() {
    var self = this;
    var sections = null;

    this.tLang = function(name) {
        return _t(name, null, 'ingame_register');
    };

    this.createButtons = function() {
        let $but1 = Tpl.get('button').addClass('green');
        let $but2 = Tpl.get('button').addClass('green');
        let $w = this.wnd.$;
        let checkbox = $w.find('.one-checkbox').find('.checkbox');

        $w.find('.save-button').append($but1);
        $w.find('.collect-button').append($but2);

        $but1.find('.label').html(self.tLang('save_form'));
        $but2.find('.label').html(self.tLang('collect_form'));

        $but1.click(this.save);
        $but2.click(this.collect);

        checkbox.click(function() {
            $(this).toggleClass('active');
        })
    };

    this.createSection = function(i, name) {
        let $section = Tpl.get('registration-section-wrapper').addClass('registration-background ' + name);
        let $rewardBox = Tpl.get('reward-box').attr('id', 'reward' + (i - 1));
        let $inputsPart = this.createInputSections(i);

        $section.find('.inputs-column').append($inputsPart);
        $section.find('.reward-column').append($rewardBox);

        this.wnd.$.find('.main-content').append($section)
    };

    this.createInputSections = function(sectionNr) {
        let $wrapper = Tpl.get('registration-inputs-wrapper');
        switch (sectionNr) {
            case 1:
                $wrapper.append(this.createInputRow('r_login', 'Login:'));
                $wrapper.append(this.createInputRow('r_pass', 'Password:', 'password'));
                $wrapper.append(this.createInputRow('r_repeat_pass', 'Repeat Password:', 'password'));
                break;
            case 2:
                $wrapper.append(this.createInputRow('r_email', "Email:"));
                $wrapper.append(this.createInputRow('r_repeat_email', "Repeat Email:"));
                break;
            case 3:
                $wrapper.append(this.createCheckboxRow());
                break;
        }
        return $wrapper;
    };

    this.createCheckboxRow = function() {
        let $row = Tpl.get('register-row-checkbox').addClass('row');
        $row.find('.text').html('I consent to receiving commercial information via electronic communication services. <a target="_blank" rel="noopener noreferrer" href="https://margonem.com/art/view,2">Read more</a>');
        var $checkbox = Tpl.get('one-checkbox');
        $row.append($checkbox);
        return $row;
    };

    this.createInputRow = function(name, text, type) {
        var $registerRow = Tpl.get('register-row').removeClass('register-row').addClass('row ' + name);

        $registerRow.find('label').attr('for', name).html(text);
        $registerRow.find('input').attr('id', name);

        if (type) $registerRow.find('input').attr('type', type);
        return $registerRow;
    };

    this.collect = function() {
        _g('registernoob&collect=1', (v) => {
            if (!isset(v.msg)) {
                message('Fill the fields and save changes before claiming your reward.');
            }
        });
    };

    this.save = function() {
        var data = {
            //chash: getCookie('chash'),
            h2: getCookie('hs3'),
            user_id: getCookie('user_id')
        };

        if (!sections.login) {
            let pass1 = $('#r_pass').val();
            let pass2 = $('#r_repeat_pass').val();
            if (pass1 != pass2) {
                message('Your password and repeat password do not match');
                return;
            }
            data.login = $('#r_login').val();
            data.pass = pass1;
            data.pass2 = pass1;
            self.sendAjax('regcomp', data);
        }

        if (sections.login && !sections.email) {
            let mail1 = $('#r_email').val();
            let mail2 = $('#r_repeat_email').val();
            if (mail1 != mail2) {
                message('Your email and repeat email do not match');
                return;
            }
            data.newmail = mail1;
            data.newmail2 = mail2;
            self.sendAjax('chmail', data);
        }

        if (sections.login && sections.email) {
            let active = self.wnd.$.find('.one-checkbox').find('.active').length;
            if (!active) {
                message("You don't agree to receiving commercial information");
                return
            }
            data.commercialInformationAgreement = 1;
            self.sendAjax('comagr', data);
        }
    };

    this.sendAjax = function(script, data) {
        //$.ajax({
        //	url: 'https://margonem.com/ajax/' + script,
        //	type: 'post',
        //	dataType: 'json',
        //	data: data,
        //	success: function (m) {
        //		message(m.msg);
        //		_g('registernoob');
        //	}
        //});
        //console.log(data);
        var url = Engine.worldConfig.getWorldName() === 'dev' ? 'https://vvv.margonem.com/ajax/' : 'https://margonem.com/ajax/';
        $.ajax({
            //url: 'https://margonem.com/ajax/' + script,
            url: url + script,
            type: 'post',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: data,
            success: function(m) {
                message(m.msg);
                _g('registernoob');
            }
        });
    };

    this.addItem = function(item) {
        //var $clone = $(item.$[0]).clone(false);
        // var $clone = Engine.items.createViewIcon(item.id, 'registration-item')[0];
        var $clone = Engine.items.createViewIcon(item.id, Engine.itemsViewData.REGISTRATION_ITEM_VIEW)[0];
        Engine.interface.get$alertsLayer().find('#reward' + item.y + ' .item' + item.x).html($clone);
    };

    this.update = function(msg) {
        if (msg.login > 1 && msg.email > 1 && msg.marketing_consent > 1) {
            self.close();
            Engine.interface.get$interfaceLayer().find('.bm-register').css('display', 'none');
            message('COMPLETED REGISTRATION!');
            return
        }
        sections = msg;
        self.updateSections(msg);
        self.updateAvailableItems('#reward0', msg.login);
        self.updateAvailableItems('#reward1', msg.email);
        self.updateAvailableItems('#reward2', msg.marketing_consent);
    };

    this.updateSections = function(msg) {
        let $w = self.wnd.$;
        $w.find('.registration-section-wrapper').removeClass('finish');
        $w.find('.registration-section-wrapper').find('.disabled').removeClass('disabled');
        $w.find('.registration-section-wrapper').find('.disabled-lock').remove();

        if (!msg.login && !msg.email) {
            self.addDisabledToSection('.registration-section-wrapper.email');
            self.addDisabledToSection('.registration-section-wrapper.consent');
            return;
        }
        if (msg.login && !msg.email) {
            $w.find('.registration-section-wrapper.login').addClass('finish');
            self.addDisabledToSection('.registration-section-wrapper.consent');
            this.updateLoginSection(msg.accLogin);
            return
        }
        if (msg.login && msg.email && !msg.marketing_consent) {
            $w.find('.registration-section-wrapper.login').addClass('finish');
            $w.find('.registration-section-wrapper.email').addClass('finish');
            this.updateLoginSection(msg.accLogin);
            this.updateMailSection(msg.accEmail);
            return
        }
        if (msg.marketing_consent) {
            this.updateLoginSection(msg.accLogin);
            this.updateMailSection(msg.accEmail);
            $w.find('.registration-section-wrapper.login').addClass('finish');
            $w.find('.registration-section-wrapper.email').addClass('finish');
            $w.find('.registration-section-wrapper.consent').addClass('finish');
        }
    };

    this.addDisabledToSection = function(selector) {
        let $section = self.wnd.$.find(selector);
        //$section.addClass('disabled');
        $section.children().addClass('disabled');
        $section.append($('<div>').addClass('disabled-lock'));
    };

    this.updateAvailableItems = function(selector, state) {
        let $r = $(selector).removeClass('unavailable');
        switch (state) {
            case 0:
                $r.addClass('unavailable');
                break;
            case 1:
                break;
            case 2:
                $r.addClass('collected');
                break;
            default:
                console.error('[Registration.js, updateAvailableItems] BUUUUG! BAD ITEMS STATE');
                break;
        }
    };

    this.updateLoginSection = function(login) {
        self.wnd.$.find('.r_login').find('.text').html(login);
        self.wnd.$.find('.r_pass').find('.text').html('****');
        self.wnd.$.find('.r_repeat_pass').find('.text').html('****');
    };

    this.updateMailSection = function(email) {
        self.wnd.$.find('.r_email').find('.text').html(email);
        self.wnd.$.find('.r_repeat_email').find('.text').html(email);
    };

    this.close = function() {
        //self.wnd.$.remove();
        self.wnd.remove();
        Engine.lock.remove('reg');
        Engine.registration = false;
        //delete (self.wnd);
    };

    this.init = function() {
        this.initWindow();
        this.initSections();
        this.createButtons();
        this.wnd.center();
        this.initFetch();
        Engine.lock.add('reg');
    };

    this.initSections = function() {
        this.createSection(1, 'login');
        this.createSection(2, 'email');
        this.createSection(3, 'consent');
    };

    this.initWindow = function() {

        Engine.windowManager.add({
            content: Tpl.get('registration'),
            //nameWindow        : 'registration',
            nameWindow: Engine.windowsData.name.REGISTRATION,
            nameRefInParent: 'wnd',
            objParent: self,
            title: self.tLang('reg_header'),
            onclose: () => {
                self.close();
            }
        });

        this.wnd.addToAlertLayer();
        this.wnd.$.find('.main-header').html(self.tLang('complete_registration'));
        this.wnd.$.find('.reward-header').html('rewards');
        this.wnd.$.find('.short-info').html("You're playing on temporary account that will be lost after you log out. if you enjoy the game, why not create a permanent account?");
    };

    this.initFetch = function() {
        // Engine.items.fetch('e', self.addItem);
        Engine.items.fetch(Engine.itemsFetchData.NEW_REGISTRATION_ITEM, self.addItem);
    }

};