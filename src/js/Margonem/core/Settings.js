/**
 * Created by lukasz on 2015-01-15.
 */
var Templates = require('core/Templates');
var CatchChar = require('core/CatchChar');
let SOUND_DATA = require('core/sound/SoundData');
const {
    isMobileApp
} = require('./HelpersTS');

module.exports = function() {
    var self = this;
    var tpl = Templates.get('settings-window');
    //var opened = false;
    var servOpt = null;
    var notfiOpt = {};
    var wnd = null;
    var showCard = 0;

    this.init = function() {
        this.initWindow();
        this.initRadioButtons('serveroption');
        //this.initRadioButtons('localoption');
        this.initSoundBar();
        this.initNotifications();
        this.initButtons();
        this.initCards();
        this.initHeader();
        this.initScrollBar();
        this.initNotifOpt();
        this.attachVolumeMarkerDrag(tpl.find(".battle-effect-sound-wrapper"), SOUND_DATA.TYPE.BATTLE_EFFECT);
        this.attachVolumeMarkerDrag(tpl.find(".notification-sound-wrapper"), SOUND_DATA.TYPE.NOTIFICATION);
        this.attachVolumeMarkerDrag(tpl.find(".sraj-effect-sound-wrapper"), SOUND_DATA.TYPE.SRAJ);

    };

    //this.getOpen = function () {
    //	return opened;
    //};

    this.getBlockInput = function() {
        return Engine.catchChar;
    };

    this.initWindow = function() {
        wnd = Engine.windowManager.add({
            content: tpl,
            title: _t('settings-title', null, 'opts'),
            //nameWindow        : 'settings',
            nameWindow: Engine.windowsData.name.SETTINGS,
            widget: Engine.widgetsData.name.SETTINGS,
            startVH: 60,
            cssVH: 60,
            onclose: () => {
                self.close();
            }
        });
        wnd.hide();
    };

    this.initHeader = function() {
        var t = [
            'settings-notification',
            'settings-game',
            'settings-keys',
            'settings-notifications',
            'settings-sounds',
            '.edit-header-label'
        ];
        wnd.$.find('.move-keys>h2>span').html(_t('move-header', null, 'help'));
        wnd.$.find('.fight-keys>h2>span').html(_t('fight-header', null, 'help'));
        wnd.$.find('.map-keys>h2>span').html(_t('clickMiniMap'));
        wnd.$.find('.social-keys>h2>span').html(_t('society'));
        wnd.$.find('.other-keys>h2>span').html(_t('tab_other', null, 'auction'));


        wnd.$.find('.' + t[0] + '>span').html(_t(t[0]));
        wnd.$.find('.' + t[1] + '>span').html(_t(t[1]));
        //wnd.$.find('.'+ t[2]).html(_t(t[2]));
        wnd.$.find('.' + t[3] + '>span').html(_t(t[3]));
        wnd.$.find('.' + t[4] + '>span').html(_t(t[4]));
        wnd.$.find(t[5]).html(_t('settings_general'));
        //var $tr = this.createRecords([_t('panel'), _t('char'), _t('edit'), _t('show_blesses', null, 'clan') ], 'table-header');
        //tpl.find('.hot-keys-config').find('.static-bar-table').append($tr);
        //tpl.find('.loudly-panel-txt').html(_t('sound_notification_level'));
    };

    this.initSoundBar = () => {
        let $notificationSoundVolumeBar = Templates.get("sound-volume-bar");
        let $battleEffectSoundVolumeBar = Templates.get("sound-volume-bar");
        let $srajEffectSoundVolumeBar = Templates.get("sound-volume-bar");

        $notificationSoundVolumeBar.addClass("notification-sound-wrapper");
        $battleEffectSoundVolumeBar.addClass("battle-effect-sound-wrapper");
        $srajEffectSoundVolumeBar.addClass("sraj-effect-sound-wrapper");

        tpl.find('.notifications-config').find('.scroll-pane').append($notificationSoundVolumeBar);
        tpl.find('.notifications-config').find('.scroll-pane').append($battleEffectSoundVolumeBar);
        tpl.find('.notifications-config').find('.scroll-pane').append($srajEffectSoundVolumeBar);

        $notificationSoundVolumeBar.find('.loudly-panel-txt').html(_t('sound_notification_level'));
        $battleEffectSoundVolumeBar.find('.loudly-panel-txt').html(_t('sound_battle_effect_level'));
        $srajEffectSoundVolumeBar.find('.loudly-panel-txt').html(_t('tab_other', null, "auction"));
    };

    this.initNotifications = function() {
        var tab = {
            0: 'new-mail',
            1: 'enemy-here',
            2: 'friend-here',
            3: 'elite2-here',
            4: 'heroes-here',
            5: 'group-loot',
            6: 'abbys',
            7: 'your_turn',
            8: 'stasis-in'
        };
        var $wrapper = wnd.$.find('.notifications-config').find('.all-notification');
        for (var i in tab) {
            // if (_l() == "en" && i == 6) continue;
            if (isEn() && i == 6) continue;
            var name = tab[i];
            var str = _t(name, null, 'sound_notif');
            var $div = Templates.get('one-checkbox').addClass('sound-notif do-action-cursor ' + name);
            $div.find('.label').html(str);
            $div.attr('data-soundnotif', i);
            //$div.append($checkbox, $label);
            $div.click(function() {
                $(this).find('.checkbox').toggleClass('active');
            });
            $wrapper.append($div);
        }
    };

    this.saveNotifications = function() {
        var $allNotif = wnd.$.find('.notifications-config').find('.sound-notif');
        $allNotif.each(function() {
            var attr = $(this).attr('data-soundnotif');
            var value = $(this).find('.checkbox').hasClass('active');
            notfiOpt[attr] = value;
        });

        let objToSend = {};
        objToSend[getSoundNotificationPatch()] = notfiOpt;
        //console.log(objToSend);
        Engine.serverStorage.sendData(objToSend, function() {
            self.close();
        });
    };

    this.updateSoundNotification = function() {
        tpl.find('[data-soundnotif]').each(function() {
            self.updateNotifOption(this);
        });
    };

    this.getStateSoundNotifById = function(id) {
        return notfiOpt[id];
    };

    this.initNotifOpt = function() {
        notfiOpt = {};
        tpl.find('[data-soundnotif]').each(function() {
            var v = $(this).data('soundnotif');
            var stor = Engine.serverStorage.get(getSoundNotificationPatch(), v);
            if (stor == null) stor = false;
            notfiOpt[v] = stor;
        });
    };

    // this.getSoundNotificationPatch = () => {
    // 	return 'soundNotification_' + (mobileCheck() ? 'mobile' : 'pc');
    // };

    this.createBtn = function(label, $par, clb) {
        var $btn = Templates.get('button');
        $btn.addClass('green small');
        $btn.find('.label').html(label);
        $btn.click(clb);
        $par.append($btn);
        return $btn;
    };

    this.initButtons = function() {
        let callback = self.changeInterface;
        var $par1 = wnd.$.find('.options-config-buttons');
        var $par2 = wnd.$.find('.hot-keys-config-buttons');
        var $par3 = wnd.$.find('.notifications-config-buttons');
        var str1 = _t('defaultWidgets', null, 'opts');
        var str2 = _t('opt_save', null, 'opts');
        var str3 = _t('reset', null, 'opts');
        var str4 = _t('old_client');
        let str5 = this.getTutorialLabel();

        if (isPl()) {
            if (isMobileApp()) {
                callback = () => window.location.href = 'https://www.margonem.pl/mobile-client-settings';
                str4 = _t('app_settings')
            }
            var $b = this.createBtn(str4, $par1, callback);
            $b.addClass('change-interface-btn');
        }
        if (!isEn()) {
            let $tutorialB = this.createBtn(str5, $par1, self.manageTutorial);
            $tutorialB.addClass('manage-tutorial-btn');
        }

        this.createBtn(str2, $par1, self.saveAndClose);
        this.createBtn(str3, $par2, self.reset);
        this.createBtn(str2, $par3, self.saveNotifications);
        this.createBtn(str1, $par2, function() {
            Engine.widgetManager.resetWidgetButtons();
        });
    };

    this.manageTutorial = () => {
        if (Engine.tutorialValue < 0) {
            _g('tutorial&opt=0', function() {
                location.reload();
            });
        } else _g('tutorial&opt=-1');
    };

    this.setLabelOfTutorialBtn = () => {
        $('.manage-tutorial-btn>.label').html(this.getTutorialLabel());
    };

    this.getTutorialLabel = () => {
        let txt = Engine.tutorialValue < 0 ? 'turn_on' : 'turn_off';
        return _t(txt, null, 'new_tutorials');
    };

    this.changeInterface = function() {
        var ddd = new Date();
        ddd.setTime(ddd.getTime() + 3600000 * 24 * 30);
        setCookie('interface', 'si', ddd, '/', 'margonem.pl');
        window.location.reload();
    };

    this.initScrollBar = function() {
        //$('.scroll-wrapper', tpl).addScrollBar({track: true});
        tpl.find('.hero-options-config>.scroll-wrapper').addScrollBar({
            track: true
        });
        tpl.find('.hot-keys-config>.scroll-wrapper').addScrollBar({
            track: true
        });
        tpl.find('.notifications-config>.scroll-wrapper').addScrollBar({
            track: true
        });
    };

    this.updateScroll = function() {
        $('.scroll-wrapper', tpl).trigger('update');
    };

    this.reset = function() {
        mAlert(_t('sure_reset_hotkeys'), [{
            txt: _t('yes'),
            callback: function() {
                Engine.hotKeys.resetHotKeys(function() {
                    //Engine.hotKeys.rebuildHotKeys();
                    self.updateHotKeys();
                });
                return true;
            }
        }, {
            txt: _t('no'),
            callback: function() {
                return true;
            }
        }]);
    };

    this.initRadioButtons = function(name) {
        tpl.find('[data-' + name + ']').each(function() {
            var v = $(this).data(name);
            var str = _t('opt_' + v, null, 'opts');
            $(this).find('span.label').html(str);
        }).click(function() {
            self['toggle' + name]($(this).data(name));
        });
        // if (_l() != 'pl') tpl.find('[data-17]').css('display', 'none');
        if (!isPl()) tpl.find('[data-17]').css('display', 'none');
    };

    this.initCards = function() {
        var con = wnd.$.find('.cards-header');
        var str1 = _t('settings_general');
        var str2 = _t('settings_controlls');
        var str3 = _t('settings_notifications');
        this.newCard(con, str1, function() {
            Engine.widgetManager.setEditableWidget(false);
        });
        this.newCard(con, str2, function() {
            Engine.widgetManager.setEditableWidget(true);
        });
        this.newCard(con, str3, function() {
            Engine.widgetManager.setEditableWidget(false);
        });
        this.setFirstCard();
    };

    this.setFirstCard = function() {
        wnd.$.find('.section').eq(0).addClass('visible');
        wnd.$.find('.card').eq(0).addClass('active');
        this.updateScroll();
    };

    this.toggleserveroption = function(v) {
        var $checkBox = tpl.find('[data-serveroption="' + v + '"]').find('.checkbox');
        servOpt ^= 1 << v - 1;
        if (servOpt & (1 << v - 1)) {
            $checkBox.addClass('active');
        } else {
            $checkBox.removeClass('active');
        }
    };

    this.updateSingleserveroption = function(t, serverOptions = servOpt) {
        var id = $(t).data('serveroption');
        var $chBox = $(t).find('.checkbox');
        var bool = (serverOptions & (1 << id - 1)) > 0;

        bool ? $chBox.addClass('active') : $chBox.removeClass('active');
    };

    this.updateNotifOption = function(t) {
        var id = $(t).data('soundnotif');
        var $chBox = $(t).find('.checkbox');
        var bool = notfiOpt[id];

        bool ? $chBox.addClass('active') : $chBox.removeClass('active');
    };

    this.updateOptions = function(name) {
        servOpt = Engine.hero.d.opt;
        tpl.find('[data-' + name + ']').each(function() {
            self['updateSingle' + name](this);
        });
    };

    this.changeSingleOptionsAndSave = (optionId) => {
        let serverOptions = getEngine().hero.d.opt;
        serverOptions ^= 1 << optionId - 1;
        _g('config&opt=' + serverOptions);
        getEngine().hero.d.opt = serverOptions;
    }

    this.center = function() {
        wnd.center();
    };

    this.saveAndClose = function() {
        self.saveOptions();
        self.close();
    };

    this.saveOptions = function() {
        this.saveServOpt();
        //this.saveLocOpt();
        //var bool = this.getLocOptById(19);
        //var bool = Engine.opt(19);
        var bool = isSettingsOptionsMapAnimationOn();
        //Engine.chat.changeTab(0);
        Engine.map.setAnimated(bool);
        Engine.banners.showOrHideBanners();
        Engine.nightController.rebuiltAfterSettingsSave();
        Engine.battle.warriors.rebuildAnimateWarrior();
        //Engine.miniMapController.miniMapWindow.updateWindowMiniMap();
    };

    this.saveServOpt = function() {
        var $hL = $('.highlight');
        var $canvasIcon = $('.canvas-icon');
        var $canvasWarrior = $('.canvas-warrior');
        var $cssIcon = $('.css-icon');
        var $cssWarrior = $('.css-warrior');

        _g('config&opt=' + servOpt);
        Engine.hero.d.opt = servOpt;
        //Engine.setAllObjectsAnimationState(Engine.opt(8));
        Engine.setAllObjectsAnimationState(!isSettingsOptionsInterfaceAnimationOn());
        Engine.interface.setCSSAnimations();
        Engine.interface.setItemsHighlights();
    };

    this.open = function() {
        //wnd.$.appendTo($('.alerts-layer'));
        wnd.addToAlertLayer();
        wnd.show();
        wnd.setWndOnPeak(true);
        Engine.lock.add('settings');
        this.center();

        this.updateSoundSliderPos(tpl.find('.music-manager .volumeSlider .marker'), SOUND_DATA.TYPE.MUSIC);
        this.updateSoundSliderPos(tpl.find('.battle-effect-sound-wrapper .volumeSlider .marker'), SOUND_DATA.TYPE.BATTLE_EFFECT);
        this.updateSoundSliderPos(tpl.find('.notification-sound-wrapper .volumeSlider .marker'), SOUND_DATA.TYPE.NOTIFICATION);
        this.updateSoundSliderPos(tpl.find('.sraj-effect-sound-wrapper .volumeSlider .marker'), SOUND_DATA.TYPE.SRAJ);

        this.updateOptions('serveroption');
        //this.updateOptions('localoption');
        this.updateSoundNotification();
        this.updateHotKeys();
        self.setVisible(0);
        this.updateScroll();
        //opened = true;
    };

    this.updateHotKeys = function() {

        wnd.$.find('.hot-keys-list').empty();
        var d = Engine.hotKeys.getSortedHotKeys();
        for (var i = 0; i < d.length; i++) {
            var e = d[i];
            var key = e[0];
            var clbName = e[1];
            var icon = e[2];
            var group = isset(e[3]) ? e[3] : 'other';
            this.createOneHotKey(clbName, key, icon, group);
        }
    };

    this.createOneHotKey = function(clbName, key, icon, group) {
        var $btn = this.createEditKeyCodeBtn(clbName, key);
        var str = _t(clbName);
        var $icon = this.createDraggableIcon(icon);
        var $tr = this.createRecords([$icon, str, key ? key.toUpperCase() : _t('none'), $btn], '');

        wnd.$.find('.' + group + '-keys').find('table').append($tr);
    };

    this.createDraggableIcon = function(iconCl) {
        if (!iconCl) return $('<div>').html('-');
        var $iconWrapper = Templates.get('widget-button').addClass('from-settings-panel green no-hover');
        getEngine().widgetManager.set$BtnWidgetSize($iconWrapper);

        $iconWrapper.find('.icon').addClass(iconCl);

        getEngine().widgetManager.addDraggableAndDataAndTip($iconWrapper, _t('drag_and_drop_widget'), Engine.widgetsData.data.WIDGET_KEY, iconCl)

        //$iconWrapper.tip(_t('drag_and_drop_widget'));
        //$iconWrapper.data(Engine.widgetsData.data.WIDGET_KEY, iconCl);
        //$iconWrapper.draggable({
        //	helper: 'clone',
        //	cursorAt: {
        //		top: 16,
        //		left: 16
        //	},
        //	scroll: false,
        //	zIndex: 20
        //});
        return $iconWrapper;
    };

    this.createEditKeyCodeBtn = function(clbName, char) {
        var btn = Templates.get('button').addClass('small green');
        btn.append(Templates.get('add-bck').addClass('edit'));
        btn.tip(_t('edit_hotkey_char'));
        btn.click(function(e) {
            e.stopPropagation();
            self.createMAlert(clbName, char);
        });
        return btn;
    };

    this.createMAlert = function(clbName, char) {
        if (Engine.catchChar) return;
        Engine.catchChar = new CatchChar(clbName, char);
        Engine.catchChar.init();
    };

    this.sendNewValue = function(key, clbName, afterSaveServerStorageClb) {
        //if (char == newVal) return true;
        Engine.hotKeys.changeKey(clbName, key, afterSaveServerStorageClb);
    };

    this.canSendNewValue = (newVal, char, clbName) => {
        return char == newVal || Engine.hotKeys.canChangeKey(clbName, newVal);
    };

    this.close = function() {
        Engine.lock.remove('settings');
        //wnd.$.detach();
        wnd.detachFromLayer();
        //opened = false;
        Engine.widgetManager.setEditableWidget(false);
    };

    this.toggle = function() {

        if (wnd.isShow()) this.close();
        else this.open();
    };

    this.newCard = function($par, label, clb) {
        var $card = Templates.get('card');
        $card.find('.label').html(label);
        $par.append($card);
        //$card.append($label);
        $card.click(function() {
            var index = $(this).index();
            self.setVisible(index);
            self.updateScroll();
            tpl.find('.edit-header-label').html(label);
            if (clb) clb();
        });
    };

    this.setVisible = function(index) {
        var $allC = wnd.$.find('.card').removeClass('active');
        var $bottomBar = wnd.$.find('.bottom-bar');
        var $allS = wnd.$.find('.section').removeClass('visible');
        $allC.eq(index).addClass('active');
        $allS.eq(index).addClass('visible');
        $bottomBar.children().css('display', 'none');
        $bottomBar.children().eq(index).css('display', 'block');
        showCard = index;
    };

    this.createRecords = function(ob, addClass) {
        var $tr = $('<tr>');
        for (var i = 0; i < ob.length; i++) {
            var $td = $('<td>').html(ob[i]);
            if (typeof addClass == 'object') $td.addClass(addClass[i]);
            else $td.addClass(addClass);
            $tr.append($td);
        }
        return $tr;
    };

    this.attachVolumeMarkerDrag = function($soundVolumeBarWrapper, type) {
        let $e = $soundVolumeBarWrapper.find('.volumeSlider .marker');
        $e.draggable({
            axis: 'x',
            stop: function() {
                var v = Math.abs(parseInt($e.css('left')) / 0.85);
                Engine.soundManager.setVolumeWithSaveInServerStorage(v, type);
            },
            drag: function(event, ui) {
                var v = Math.abs(parseInt($e.css('left')) / 0.85);
                Engine.soundManager.setVolumeWithoutSaveInServerStorage(v, type);
                var max = ui.helper.parent().width() - 22;

                if (ui.position.left < 0) ui.position.left = 0;
                if (ui.position.left > max) ui.position.left = max;
            }
        });
        var $btn = Templates.get('button').addClass('small green');
        $btn.find('.label').html('Test');

        $soundVolumeBarWrapper.find('.loudly-panel-buttons').append($btn).addClass('test-sound');

        $btn.click(() => {
            if (!Engine.soundManager.checkAvailableSoundType(type)) return;

            switch (type) {
                case SOUND_DATA.TYPE.NOTIFICATION:
                    Engine.soundManager.createNotifSound(6);
                    break
                case SOUND_DATA.TYPE.BATTLE_EFFECT:
                    Engine.soundManager.createBattleEffectSound(-1);
                    break;
                case SOUND_DATA.TYPE.SRAJ:

                    let id = -99999;
                    let url = "owacje_VOLUME_TEST_DONT_REMOVE.mp3";
                    let srajData = {
                        sound: {
                            list: [{
                                id: id,
                                action: "CREATE",
                                url: url
                            }]
                        }
                    };

                    Engine.rajController.parseObject(srajData)

                    //Engine.soundManager.prepareSrajSound(url);
                    //let rajSound = new RajSound();
                    //
                    //rajSound.init();
                    //rajSound.updateData(oneRajSoundData);
                    //
                    //Engine.soundManager.createSrajSound(id, rajSound);
                    break
            }
        });
    };
    /*
    	this.checkPos = function (v, ui, $e, save) {
    		if (v < 0) {
    			$e.draggable( "disable" );
    			v = 0;
    			ui.position.left = 0;
    			if ($e) $e.css('left', 0);

    			// if (save) Engine.soundManager.setVolume(v, 'notif');
    			// else Engine.soundManager.setVolumeWithoutSave(v, 'notif');


    			if (save) Engine.soundManager.setVolumeWithSaveInServerStorage(v, SOUND_DATA.TYPE.NOTIFICATION);
    			else Engine.soundManager.setVolumeWithoutSaveInServerStorage(v, SOUND_DATA.TYPE.NOTIFICATION);

    			return;
    		}
    		if (v > 101) {
    			$e.draggable( "disable" );
    			v = 100;
    			ui.position.left = 85;
    			if ($e) $e.css('left', 85);

    			// if (save) Engine.soundManager.setVolume(v, 'notif');
                // else Engine.soundManager.setVolumeWithoutSave(v, 'notif');

    			if (save) Engine.soundManager.setVolumeWithSaveInServerStorage(v, SOUND_DATA.TYPE.NOTIFICATION);
    			else Engine.soundManager.setVolumeWithoutSaveInServerStorage(v, SOUND_DATA.TYPE.NOTIFICATION);

                return;
    		}
    		$e.draggable( "enable" );

    		// if (save) Engine.soundManager.setVolume(v, 'notif');
            // else Engine.soundManager.setVolumeWithoutSave(v, 'notif');

    		if (save) Engine.soundManager.setVolumeWithSaveInServerStorage(v, SOUND_DATA.TYPE.NOTIFICATION);
    		else Engine.soundManager.setVolumeWithoutSaveInServerStorage(v, SOUND_DATA.TYPE.NOTIFICATION);

    	};
    */
    this.updateSoundSliderPos = function($marker, type) {
        let volume = Engine.soundManager.getDataSettingVolume(type)
        let left = volume * 0.85;

        $marker.css('left', left);
    };

    // this.updateNotifSoundSliderPos = function () {
    // 	// var volume = Engine.soundManager.getData()['volume']['notif'];
    // 	let volume = Engine.soundManager.getDataSettingVolume(SOUND_DATA.TYPE.NOTIFICATION)
    // 	var $marker = tpl.find('.volumeSlider .marker');
    // 	var left = volume * 0.85;
    // 	$marker.css('left', left);
    // };
    // this.updateMusicSoundSliderPos = function () {
    // 	// var volume = Engine.soundManager.getData()['volume']['song'];
    // 	let volume = Engine.soundManager.getDataSettingVolume(SOUND_DATA.TYPE.MUSIC)
    // 	var $marker = tpl.find('.music-manager .volumeSlider .marker');
    // 	var left = volume * 0.85;
    // 	$marker.css('left', left);
    // };

    this.getContent = () => {
        return tpl;
    }

    //const checkTurnOnWeatherAndEventEffects = () => {
    //	return !Engine.opt(16);
    //};

    //this.checkTurnOnWeatherAndEventEffects = checkTurnOnWeatherAndEventEffects;

};