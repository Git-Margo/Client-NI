/**
 * Created by lukasz on 2015-01-15.
 */
var Templates = require('@core/Templates');
var CatchChar = require('@core/CatchChar');
let SOUND_DATA = require('@core/sound/SoundData');
const Slider = require('@core/components/Slider');
//import Tabs from '../components/Tabs';
let Tabs = require('@core//components/Tabs');
let SettingsData = require('@core/settings/SettingsData.js');
const {
    isMobileApp,
    highlightElement
} = require('@core/HelpersTS');
const InputMaskData = require('@core/InputMaskData');
const Checkbox = require('@core/components/Checkbox');

module.exports = function() {
    var self = this;
    const moduleData = {
        fileName: "Settings.js"
    }

    var tpl = Templates.get('settings-window');
    //var opened = false;
    //var servOpt = null;
    var soundCheckBox = {};
    var notfiOpt = {};
    var wnd = null;
    //var showCard = 0;

    let changeSliderTimeout = null;

    let configSliders = null;

    let settingsTrigger = null;
    const TABS = SettingsData.TABS;

    this.init = function() {
        this.initWindow();
        initSettingsTrigger();
        //this.initRadioButtons();
        initCheckBoxes();
        //this.initRadioButtons('localoption');
        //this.initSoundBar();
        this.initNotifications();
        this.initButtons();
        this.initCards();
        this.initHeader();
        initLangs();
        this.initScrollBar();
        //this.initNotifOpt();
        initMenus();

        initRangeInputs();

        initConfigSliders();
        initSliders();
    };

    const initConfigSliders = () => {

        let soundManager = getEngine().soundManager;
        const TYPE = SOUND_DATA.TYPE;
        const MAIN = "MAIN";
        const BATTLE_EFFECT = TYPE.BATTLE_EFFECT;
        const NOTIFICATION = TYPE.NOTIFICATION;
        const MUSIC = TYPE.MUSIC;
        const SRAJ = TYPE.SRAJ;
        const TMP = TYPE.TMP;
        const ITEM = TYPE.ITEM;

        configSliders = {
            [MAIN]: {
                min: 0,
                max: 100,
                default: 100,
                text: _t('sound_main_level'),
                testBtnF: () => soundManager.testMainSound(),
                getCurrentF: () => soundManager.getDataSettingMainVolume(),
                setCurrentF: (v) => {
                    soundManager.setMainVolumeWithSaveInServerStorage(v)
                }
            },
            [MUSIC]: {
                min: 0,
                max: 100,
                default: 100,
                text: _t('iconmusic'),
                attachToSlider: ($soundVolumeBar) => getEngine().musicPanel.initButtons($soundVolumeBar),
                getCurrentF: () => soundManager.getDataSettingVolume(MUSIC),
                setCurrentF: (v) => {
                    soundManager.setVolumeWithSaveInServerStorage(v, [MUSIC])
                }
            },
            [NOTIFICATION]: {
                min: 0,
                max: 100,
                default: 100,
                text: _t('sound_notification_level'),
                testBtnF: () => soundManager.createNotifSound(6),
                getCurrentF: () => soundManager.getDataSettingVolume(NOTIFICATION),
                setCurrentF: (v) => {
                    soundManager.setVolumeWithSaveInServerStorage(v, [NOTIFICATION])
                }
            },
            [BATTLE_EFFECT]: {
                min: 0,
                max: 100,
                default: 100,
                text: _t('sound_battle_effect_level'),
                testBtnF: () => soundManager.createBattleEffectSound(-1),
                getCurrentF: () => soundManager.getDataSettingVolume(BATTLE_EFFECT),
                setCurrentF: (v) => {
                    soundManager.setVolumeWithSaveInServerStorage(v, [BATTLE_EFFECT])
                }
            },
            [SRAJ]: {
                min: 0,
                max: 100,
                default: 100,
                text: _t('sound_events_level'),
                testBtnF: () => createTestSrajSound(),
                getCurrentF: () => soundManager.getDataSettingVolume(SRAJ),
                setCurrentF: (v) => {
                    soundManager.setVolumeWithSaveInServerStorage(v, [SRAJ, TMP, ITEM])
                }
            }
        };
    };

    const initSliders = () => {
        let $scrollPane = tpl.find('.notifications-config').find('.scroll-pane');

        for (let k in configSliders) {
            let $soundVolumeBar = Templates.get("sound-volume-bar");
            let oneSliderConfig = configSliders[k];


            $soundVolumeBar.find('.loudly-panel-txt').html(configSliders[k].text);

            createOneSlider(oneSliderConfig, $soundVolumeBar);

            if (oneSliderConfig.testBtnF) {
                createTestButton(oneSliderConfig, $soundVolumeBar);
            }

            if (oneSliderConfig.attachToSlider) {
                oneSliderConfig.attachToSlider($soundVolumeBar)
            }

            $scrollPane.append($soundVolumeBar);
        }

    }

    const createTestButton = (oneSliderConfig, $soundVolumeBar) => {
        var $btn = Templates.get('button').addClass('small green');
        $btn.find('.label').html('Test');

        $soundVolumeBar.find('.loudly-panel-buttons').append($btn).addClass('test-sound');

        $btn.click(() => {
            oneSliderConfig.testBtnF();
        });
    }

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

    const initLangs = () => {
        wnd.$.find(`.berserk-opt-label`).tip(_t('berserk_monster_type'))
        wnd.$.find(`.berserk-group-opt-label`).tip(_t('berserk_monster_type'))
    }

    this.initHeader = function() {
        var t = [
            'settings-notification',
            'settings-game',
            'settings-keys',
            'settings-notifications',
            'settings-sounds',
            '.edit-header-label',
            'settings-battle',
        ];
        //wnd.$.find('.move-keys>h2>span').html(_t('move-header', null,'help'));
        //wnd.$.find('.fight-keys>h2>span').html(_t('fight-header', null,'help'));
        //wnd.$.find('.map-keys>h2>span').html(_t('clickMiniMap'));
        //wnd.$.find('.social-keys>h2>span').html(_t('society'));
        //wnd.$.find('.other-keys>h2>span').html(_t('tab_other', null, 'auction'));


        wnd.$.find('.' + t[0] + '>span').html(_t(t[0]));
        wnd.$.find('.' + t[1] + '>span').html(_t(t[1]));
        //wnd.$.find('.'+ t[2]).html(_t(t[2]));
        wnd.$.find('.' + t[3] + '>span').html(_t(t[3]));
        wnd.$.find('.' + t[4] + '>span').html(_t(t[4]));
        wnd.$.find(t[5]).html(_t('settings_general'));
        wnd.$.find('.' + t[6] + '>span').html(_t(t[6]));
        //var $tr = this.createRecords([_t('panel'), _t('char'), _t('edit'), _t('show_blesses', null, 'clan') ], 'table-header');
        //tpl.find('.hot-keys-config').find('.static-bar-table').append($tr);
        //tpl.find('.loudly-panel-txt').html(_t('sound_notification_level'));
    };

    this.initSoundBar = () => {
        let $mainSoundVolumeBar = Templates.get("sound-volume-bar");
        let $notificationSoundVolumeBar = Templates.get("sound-volume-bar");
        let $battleEffectSoundVolumeBar = Templates.get("sound-volume-bar");
        let $srajEffectSoundVolumeBar = Templates.get("sound-volume-bar");

        $mainSoundVolumeBar.addClass("main-sound-wrapper");
        $notificationSoundVolumeBar.addClass("notification-sound-wrapper");
        $battleEffectSoundVolumeBar.addClass("battle-effect-sound-wrapper");
        $srajEffectSoundVolumeBar.addClass("sraj-effect-sound-wrapper");

        let $scrollPane = tpl.find('.notifications-config').find('.scroll-pane');

        $mainSoundVolumeBar.insertBefore($scrollPane.find('.music-manager-wrapper').parent());

        $scrollPane.append($notificationSoundVolumeBar);
        $scrollPane.append($battleEffectSoundVolumeBar);
        $scrollPane.append($srajEffectSoundVolumeBar);

        $mainSoundVolumeBar.find('.loudly-panel-txt').html(_t('sound_main_level'));
        $notificationSoundVolumeBar.find('.loudly-panel-txt').html(_t('sound_notification_level'));
        $battleEffectSoundVolumeBar.find('.loudly-panel-txt').html(_t('sound_battle_effect_level'));
        $srajEffectSoundVolumeBar.find('.loudly-panel-txt').html(_t('sound_events_level'));
    };

    const createOneSlider = (oneSliderData, $oneConfigOption) => {
        let min = oneSliderData.min;
        let max = oneSliderData.max;
        let current = oneSliderData.getCurrentF();
        let setCurrentF = oneSliderData.setCurrentF;

        const slider = new Slider.default({
            min: min,
            max: max,
            value: current,
            onUpdate: (value) => {
                if (changeSliderTimeout) {
                    clearChangeSliderTimeout();
                }
                createChangeSlidedTimeout(setCurrentF, value)

            }
        });

        if (oneSliderData.labelTip) $oneConfigOption.find('.loudly-panel-txt').tip(oneSliderData.labelTip);
        $oneConfigOption.find('.slider-wrapper').append($(slider.getElement()));

    }

    const createChangeSlidedTimeout = (setCurrentF, value) => {
        changeSliderTimeout = setTimeout(function() {
            setCurrentF(value);
            afterChangeSlider();
            clearChangeSliderTimeout();
        }, 10);
    };

    const clearChangeSliderTimeout = () => {
        clearTimeout(changeSliderTimeout);
        changeSliderTimeout = null;
    };

    const afterChangeSlider = () => {
        getEngine().npcs.clearAllCharacterBlur();
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
        soundCheckBox = {};
        notfiOpt = {};

        var $wrapper = wnd.$.find('.notifications-config').find('.all-notification');
        for (var i in tab) {
            // if (_l() == "en" && i == 6) continue;
            if (isEn() && i == 6) continue;
            var name = tab[i];
            //var str = _t(name, null, 'sound_notif');
            //var $div = Templates.get('one-checkbox').addClass('sound-notif do-action-cursor ' + name);
            //$div.find('.label').html(str);
            //$div.attr('data-soundnotif', i);
            //$div.append($checkbox, $label);
            //$div.click(function () {
            //	$(this).find('.checkbox').toggleClass('active');
            //	self.saveNotifications();
            //});

            var stor = Engine.serverStorage.get(getSoundNotificationPatch(), i);
            if (stor == null) stor = true;
            notfiOpt[i] = stor;

            const checkbox = new Checkbox.default({
                    label: _t(name, null, 'sound_notif'),
                    id: name,
                    checked: stor,
                    highlight: false
                },
                (state) => {
                    self.saveNotifications();
                }
            );

            soundCheckBox[i] = checkbox;

            $wrapper.append($(checkbox.getCheckbox()));
        }
    };

    this.saveNotifications = function() {
        //var $allNotif = wnd.$.find('.notifications-config').find('.sound-notif');

        for (let attr in soundCheckBox) {
            let checked = soundCheckBox[attr].getChecked();
            notfiOpt[attr] = checked;
        }

        //$allNotif.each(function () {
        //	var attr = $(this).attr('data-soundnotif');
        //	var value = $(this).find('.checkbox').hasClass('active');
        //	notfiOpt[attr] = value;
        //});

        let objToSend = {};
        objToSend[getSoundNotificationPatch()] = notfiOpt;
        Engine.serverStorage.sendData(objToSend, function() {
            //self.close();
        });
    };

    //this.updateSoundNotification = function () {
    //	tpl.find('[data-soundnotif]').each(function () {
    //		self.updateNotifOption(this);
    //	});
    //};

    this.getStateSoundNotifById = function(id) {
        return notfiOpt[id];
    };

    //this.initNotifOpt = function () {
    //	notfiOpt = {};
    //	tpl.find('[data-soundnotif]').each(function () {
    //		var v = $(this).data('soundnotif');
    //		var stor = Engine.serverStorage.get(getSoundNotificationPatch(), v);
    //		if (stor == null) stor = true;
    //		notfiOpt[v] = stor;
    //	});
    //};

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
        var $par1 = wnd.$.find('.options-config-buttons');
        var $par2 = wnd.$.find('.hot-keys-config-buttons');
        var $par3 = wnd.$.find('.notifications-config-buttons');
        var str1 = _t('defaultWidgets', null, 'opts');
        var str2 = _t('opt_save', null, 'opts');
        var str3 = _t('reset', null, 'opts');
        var str4 = _t('old_client');
        let str5 = this.getTutorialLabel();
        var str6 = _t('app_settings');

        if (isMobileApp()) {
            const callback = () => window.location.href = 'https://www.margonem.pl/mobile-client-settings';
            const $b = this.createBtn(str6, $par1, callback);
            $b.addClass('app-settings-btn');
        } else if (isPl()) {
            const callback = self.changeInterface;
            const $b = this.createBtn(str4, $par1, callback);
            $b.addClass('change-interface-btn');
        }

        if (!isEn()) {
            let $tutorialB = this.createBtn(str5, $par1, self.manageTutorial);
            $tutorialB.addClass('manage-tutorial-btn');
        }

        //this.createBtn(str2, $par1, self.saveAndClose);
        this.createBtn(str3, $par2, self.reset);
        //this.createBtn(str2, $par3, self.saveNotifications);
        this.createBtn(str1, $par2, function() {
            Engine.widgetManager.resetWidgetButtons();
        });
    };

    this.manageTutorial = () => {
        if (Engine.tutorialValue < 0) {
            _g('tutorial&opt=0', function() {
                //location.reload();
                pageReload();
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
        //window.location.reload();
        pageReload();
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
        //$('.scroll-wrapper', tpl).trigger('update');
        tpl.find('.hero-options-config>.scroll-wrapper').trigger('update');
        tpl.find('.hot-keys-config>.scroll-wrapper').trigger('update');
        tpl.find('.notifications-config>.scroll-wrapper').trigger('update');
    };

    this.changeTab = (tab) => {
        this.tabsInstance.activateCard(tab)
    }

    this.scrollToOption = (option) => {
        if (!isset(SettingsData.LIST[option])) {
            errorReport(moduleData.fileName, 'scrollToOption', 'Unknown settings option', option);
            return;
        }
        this.scrollTo(TABS.GENERAL, `.opt_${option}`);
    }

    this.scrollTo = (tab, selector) => {
        let $scrollbar = null;

        switch (tab) {
            case TABS.GENERAL:
                $scrollbar = tpl.find('.hero-options-config>.scroll-wrapper');
                break;
            case TABS.CONTROLS:
                $scrollbar = tpl.find('.hot-keys-config>.scroll-wrapper');
                break;
            case TABS.MUSIC:
                $scrollbar = tpl.find('.notifications-config>.scroll-wrapper');
                break;
            default:
                errorReport(moduleData.fileName, 'changeTabAndScrollTo', 'Unknown tab', tab);
                return;
        }
        this.changeTab(tab);
        $scrollbar.trigger("scrollToElement", [selector]);
        highlightElement(selector);
    }

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

    //this.initRadioButtons = function () {
    //	let name = "serveroption";
    //
    //	tpl.find('[data-'+ name +']').each(function () {
    //		var v = $(this).data(name);
    //		var str = _t('opt_' + v, null, 'SettingsOptions');
    //		$(this).find('span.label').html(str);
    //	}).click(function () {
    //		self['toggle' + name]($(this).data(name));
    //	});
    //	// if (_l() != 'pl') tpl.find('[data-17]').css('display', 'none');
    //	if (!isPl()) tpl.find('[data-17]').css('display', 'none');
    //};

    const initRangeInputs = () => {
        const KEY = SettingsData.KEY;
        const VARS = SettingsData.VARS;

        let rangeInputs = [{
                id: KEY.BERSERK,
                firstRange: VARS.BERSERK_VARS.LVL_MIN,
                secondRange: VARS.BERSERK_VARS.LVL_MAX,
                firstOptions: {},
                secondOptions: {}
            },
            {
                id: KEY.BERSERK_GROUP,
                firstRange: VARS.BERSERK_VARS.LVL_MIN,
                secondRange: VARS.BERSERK_VARS.LVL_MAX,
                firstOptions: {},
                secondOptions: {}
            }
        ]

        for (let k in rangeInputs) {
            createOneRangeSetting(rangeInputs[k]);
        }
    }

    const createOneRangeSetting = (oneRangeData) => {
        let id = oneRangeData.id;
        let firstRange = oneRangeData.firstRange;
        let secondRange = oneRangeData.secondRange;
        let firstOptions = oneRangeData.firstOptions ? oneRangeData.firstOptions : null;
        let secondOptions = oneRangeData.secondOptions ? oneRangeData.secondOptions : null;
        let combineKey = connectStrings(id, firstRange, secondRange);
        let $wrapper = tpl.find(`[data-serveroption="${combineKey}"]`);

        let $wrapperFirst = $('<div>').addClass('opt-range-wrapper opt-range-first');
        let $wrapperSecond = $('<div>').addClass('opt-range-wrapper opt-range-second');

        createOneSettingsInput(moduleData.fileName, id, firstRange, $wrapperFirst, firstOptions, function(v) {
            // Engine.settings.setSettingsValue(combineKey, v);
        });
        createOneSettingsInput(moduleData.fileName, id, secondRange, $wrapperSecond, secondOptions, function(v) {

        });

        const inputData = getEngine().settingsOptions.getDataToCreateInput(id, firstRange);

        if (inputData.labelTip) {
            $wrapper.tip(inputData.labelTip);
        }

        $wrapper.addClass('settings-opt-range-wrapper');
        $wrapper.append($wrapperFirst);
        $wrapper.append($wrapperSecond);
    }

    const initCheckBoxes = () => {
        const KEY = SettingsData.KEY;
        const BERSERK = SettingsData.KEY.BERSERK;
        const BERSERK_GROUP = SettingsData.KEY.BERSERK_GROUP;
        const BERSERK_VARS = SettingsData.VARS.BERSERK_VARS;
        const BERSERK_COMMON = connectStrings(BERSERK, BERSERK_VARS.COMMON);
        const BERSERK_ELITE = connectStrings(BERSERK, BERSERK_VARS.ELITE);
        const BERSERK_ELITE2 = connectStrings(BERSERK, BERSERK_VARS.ELITE2);

        const SELECTOR_BERSERK_COMMON = `[data-serveroption="${BERSERK_COMMON}"]`;
        const SELECTOR_BERSERK_ELITE = `[data-serveroption="${BERSERK_ELITE}"]`;
        const SELECTOR_BERSERK_ELITE2 = `[data-serveroption="${BERSERK_ELITE2}"]`;

        const BERSERK_LVL_MIN_LVL_MAX = connectStrings(BERSERK, BERSERK_VARS.LVL_MIN, BERSERK_VARS.LVL_MAX);
        const SELECTOR_BERSERK_LVL_MIN_LVL_MAX = `[data-serveroption="${BERSERK_LVL_MIN_LVL_MAX}"]`;

        const BERSERK_GROUP_COMMON = connectStrings(BERSERK_GROUP, BERSERK_VARS.COMMON);
        const BERSERK_GROUP_ELITE = connectStrings(BERSERK_GROUP, BERSERK_VARS.ELITE);
        const BERSERK_GROUP_ELITE2 = connectStrings(BERSERK_GROUP, BERSERK_VARS.ELITE2);

        const SELECTOR_BERSERK_GROUP_COMMON = `[data-serveroption="${BERSERK_GROUP_COMMON}"]`;
        const SELECTOR_BERSERK_GROUP_ELITE = `[data-serveroption="${BERSERK_GROUP_ELITE}"]`;
        const SELECTOR_BERSERK_GROUP_ELITE2 = `[data-serveroption="${BERSERK_GROUP_ELITE2}"]`;

        const BERSERK_GROUP_LVL_MIN_LVL_MAX = connectStrings(BERSERK_GROUP, BERSERK_VARS.LVL_MIN, BERSERK_VARS.LVL_MAX);
        const SELECTOR_BERSERK_GROUP_LVL_MIN_LVL_MAX = `[data-serveroption="${BERSERK_GROUP_LVL_MIN_LVL_MAX}"]`;

        let checkboxes = [{
                id: KEY.RECEIVE_PRIVATE_CHAT_MESSAGE
            },
            {
                id: KEY.INVITATION_TO_CLAN_AND_DIPLOMACY
            },
            {
                id: KEY.TRADE_WITH_OTHERS
            },
            {
                id: KEY.TURN_BASED_COMBAT_AFTER_MONSTER_ATTACK
            },
            {
                id: KEY.INVITATION_TO_FRIENDS
            },
            {
                id: KEY.MAIL_FROM_UNKNOWN
            },
            {
                id: KEY.MOUSE_HERO_WALK
            },
            {
                id: KEY.INTERFACE_ANIMATION
            },
            {
                id: KEY.CLAN_MEMBER_ENTRY_CHAT_MESSAGE
            },
            {
                id: KEY.CYCLE_DAY_AND_NIGHT
            },
            {
                id: KEY.AUTO_GO_THROUGH_GATEWAY
            },
            {
                id: KEY.SHOW_ITEMS_RANK
            },
            {
                id: KEY.INVITATION_TO_PARTY_BEYOND_FRIENDS_AND_CLANS_AND_CLANS_ALLY
            },
            {
                id: KEY.FRIEND_ENTRY_CHAT_MESSAGE
            },
            {
                id: KEY.WEATHER_AND_EVENT_EFFECTS
            },
            {
                id: KEY.ADD_OR_REMOVE_PARTY_MEMBER_CHAT_MESSAGE
            },
            {
                id: KEY.MAP_ANIMATION
            },
            {
                id: KEY.INFORM_ABOUT_FREE_PLACE_IN_BAG
            },
            {
                id: KEY.LOADER_SPLASH
            },
            {
                id: KEY.WAR_SHADOW
            },
            {
                id: KEY.AUTO_COMPARE_ITEMS
            },
            {
                id: KEY.BATTLE_EFFECTS
            },
            {
                id: KEY.AUTO_CLOSE_BATTLE
            },
            {
                id: KEY.RECEIVE_FROM_ENEMY_CHAT_MESSAGE
            },
            {
                id: KEY.BERSERK,
                key: BERSERK_VARS.V,
                children: {
                    source: tpl,
                    list: [
                        SELECTOR_BERSERK_LVL_MIN_LVL_MAX,
                        SELECTOR_BERSERK_COMMON,
                        SELECTOR_BERSERK_ELITE,
                        SELECTOR_BERSERK_ELITE2,
                        ".berserk-opt-label"
                    ]
                }
            },
            {
                id: KEY.BERSERK,
                key: BERSERK_VARS.COMMON
            },
            {
                id: KEY.BERSERK,
                key: BERSERK_VARS.ELITE
            },
            {
                id: KEY.BERSERK,
                key: BERSERK_VARS.ELITE2
            },
            {
                id: KEY.BERSERK_GROUP,
                key: BERSERK_VARS.V,
                children: {
                    source: tpl,
                    list: [
                        SELECTOR_BERSERK_GROUP_LVL_MIN_LVL_MAX,
                        SELECTOR_BERSERK_GROUP_COMMON,
                        SELECTOR_BERSERK_GROUP_ELITE,
                        SELECTOR_BERSERK_GROUP_ELITE2,
                        ".berserk-group-opt-label"
                    ]
                }
            },
            {
                id: KEY.BERSERK_GROUP,
                key: BERSERK_VARS.COMMON
            },
            {
                id: KEY.BERSERK_GROUP,
                key: BERSERK_VARS.ELITE
            },
            {
                id: KEY.BERSERK_GROUP,
                key: BERSERK_VARS.ELITE2
            }
        ];

        if (isPl()) {
            checkboxes.push({
                id: KEY.BANNERS
            })
        }

        if (isEn()) {
            tpl.find('[data-17]').css('display', 'none')
        }

        for (let k in checkboxes) {

            let oneData = checkboxes[k];
            let keyExist = isset(oneData.key)
            let id = oneData.id;
            let key = keyExist ? oneData.key : null;
            let children = isset(oneData.children) ? oneData.children : null;
            let serverOption = keyExist ? connectStrings(id, key) : id;
            let $wrapper = tpl.find(`[data-serveroption="${serverOption}"]`);

            createOneSettingsCheckbox(moduleData.fileName, id, key, children, $wrapper);
        }
    };

    const oneCheckboxListCallback = (checkBoxList, checkboxListData) => {
        let _stateArray = [];

        for (let kk in checkBoxList) {
            //let active = checkBoxList[kk].find('.checkbox').hasClass('active');
            let active = checkBoxList[kk].getChecked();
            _stateArray.push(active);
        }

        checkboxListData.changeCallback(_stateArray)
    }

    const createOneSettingsCheckboxList = (moduleName, settingId, key, $checkboxListWrapper, callback) => {
        let checkboxListData = getEngine().settingsOptions.getDataToCreateCheckBoxList(settingId, key, callback);
        let bitsList = checkboxListData.bits;
        let startStatesArray = checkboxListData.getStatesArray();
        let $label = $('<div>').addClass('option-description');
        const $optionContainer = $('<div>').addClass('option-container checkbox-list');
        let checkBoxList = [];

        $label.html(checkboxListData.labelText);
        if (checkboxListData.labelTip) $label.tip(checkboxListData.labelTip);

        $optionContainer.append($label);

        for (let i in bitsList) {
            let data = bitsList[i];
            const checkbox = _createCheckBox(data.text, settingId, key, i, startStatesArray[i] ? true : false, checkBoxList, checkboxListData)
            let $one = $(checkbox.getCheckbox());

            checkBoxList.push(checkbox);
            $optionContainer.append($one);
        }
        $checkboxListWrapper.append($optionContainer);

        Engine.settings.addUpdateSettingsTrigger(moduleName, settingId, key, function(v) {
            let triggerStatesArray = checkboxListData.getStatesArray();

            for (let k in checkBoxList) {
                updateOneCheckBoxOption(triggerStatesArray[k], checkBoxList[k])
            }

            if (callback) {
                callback();
            }
        })
    };

    const _createCheckBox = (text, settingId, key, i, checked, checkBoxList, checkboxListData) => {
        const checkbox = new Checkbox.default({
                name: `settings`,
                label: text,
                i: `${settingId}_${key}_${i}`,
                checked: checked,
                highlight: false
            },
            (state) => {
                oneCheckboxListCallback(checkBoxList, checkboxListData)

            }
        );

        return checkbox;
    }

    const setOpacityOnChildren = (state, checkboxData, childrenObjects) => {

        for (let k in childrenObjects) {
            let child = childrenObjects[k];
            if (state) {
                child.removeClass('opt-disable');
            } else {
                child.addClass('opt-disable');
            }
        }
    }

    const createOneSettingsCheckbox = (moduleName, settingId, key, children, $checkboxWrapper, callback) => {
        let checkboxData = getEngine().settingsOptions.getDataToCreateCheckBox(settingId, key);
        let checkboxValue = checkboxData.getValue();

        let childrenObjects = null

        const i = key ? `${settingId}_${key}` : settingId;
        const checkbox = new Checkbox.default({
                name: `settings`,
                label: checkboxData.labelText,
                value: `asd`,
                i,
                checked: checkboxValue ? true : false,
                highlight: false,
                ...(checkboxData.labelTip && {
                    tip: checkboxData.labelTip
                })
            },
            (state) => {
                let nextValue = !checkboxData.getValue();
                checkboxData.changeCallback(nextValue);

                if (!children) {
                    return
                }

                setOpacityOnChildren(nextValue, checkboxData, childrenObjects);
            }
        );


        if (children) {
            let list = children.list
            let source = children.source

            childrenObjects = [];

            for (let k in list) {
                let $el = source.find(list[k]);
                childrenObjects.push($el);

                $el.addClass('child-opt')
            }

            setOpacityOnChildren(checkboxValue, checkboxData, childrenObjects)
        }

        $checkboxWrapper.append($(checkbox.getCheckbox()));


        Engine.settings.addUpdateSettingsTrigger(moduleName, settingId, key, function(v) {

            let _checkboxValue = checkboxData.getValue();

            updateOneCheckBoxOption(_checkboxValue, checkbox)

            if (children) {
                setOpacityOnChildren(_checkboxValue, checkboxData, childrenObjects)
            }

            if (callback) {
                callback();
            }
        })

    };

    const initMenus = () => {
        let menus = [{
            id: SettingsData.KEY.KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL,
            key: SettingsData.VARS.OPERATION_LEVEL.MODE,
            wrapper: tpl.find('.opt_' + SettingsData.KEY.KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL)
        }];

        for (let k in menus) {
            createOneSettingsMenu(moduleData.fileName, menus[k].id, menus[k].key, menus[k].wrapper);
        }
    };

    const createOneSettingsInput = (moduleName, settingsNumber, key, $inputWrapper, options = {}, callback) => {
        const inputData = getEngine().settingsOptions.getDataToCreateInput(settingsNumber, key, callback);
        const $optionContainer = $('<div>').addClass('option-container');
        const $label = $('<div>').addClass('option-description');

        let changeTimeout = null;

        let niInputOption = {
            cl: 'max-level-input',
            val: inputData.getValue(),
            useDebounce: 0,
            changeClb: function(value) {
                if (changeTimeout) {
                    clearTimeout(changeTimeout);
                    changeTimeout = null;
                }

                if (!changeTimeout) {
                    changeTimeout = setTimeout(function() {
                        inputData.changeCallback(value)
                        // console.log('changeClb timeout sendRequest')
                    }, 5000);
                }
                // console.log('changeClb')
            },
            focusoutClb: function(value) {
                if (changeTimeout) {
                    clearTimeout(changeTimeout);
                    changeTimeout = null;
                }

                if (inputData.getValue() == value) {
                    // console.log('focusoutClb without sendRequest')
                    return;
                }
                inputData.changeCallback(value)
                // console.log('focusoutClb sendRequest')
            },
            clear: false,
            type: InputMaskData.TYPE.NUMBER_POSITIVE_AND_NEGATIVE
        };

        Object.assign(niInputOption, options);

        const $input = createNiInput(niInputOption);

        $label.html(inputData.labelText);

        if (inputData.labelTip) {
            $label.tip(inputData.labelTip);
        }

        $optionContainer.append($label);
        $optionContainer.append($input);
        $inputWrapper.append($optionContainer);

        Engine.settings.addUpdateSettingsTrigger(moduleName, settingsNumber, key, function(v) {
            $input.find('input').val(inputData.getValue());
        });
    };

    const createOneSettingsMenu = (moduleName, settingsNumber, key, $wrapper, callback) => {
        let menuData = getEngine().settingsOptions.getDataToCreateMenu(settingsNumber, key);
        const $optionContainer = $('<div>', {
            class: 'option-container'
        });
        const $menu = $('<div>', {
            class: 'menu'
        });
        const $label = $('<div>', {
            class: 'option-description'
        });

        $label.html(menuData.labelText);
        if (menuData.labelTip) $label.tip(menuData.labelTip);

        $menu.createMenu(menuData.list, false, function(index) {
            menuData.changeCallback(index)
        });

        $menu.setOptionWithoutCallbackByValue(menuData.getValue());
        $optionContainer.append($label);
        $optionContainer.append($menu);
        $wrapper.append($optionContainer);

        Engine.settings.addUpdateSettingsTrigger(moduleName, settingsNumber, key, function(v) {

            let menuValue = v.value;
            if ($menu.getValue() != menuValue) {
                $menu.setOptionWithoutCallbackByValue(menuValue);
            }

            if (callback) {
                callback();
            }
        })
    }

    this.initCards = function() {
        let cards = {
            [TABS.GENERAL]: {
                name: _t('settings_general'),
                afterShowFn: () => clickTab(false),
                contentTargetEl: tpl[0].querySelector(".hero-options-config")
            },
            [TABS.CONTROLS]: {
                name: _t('settings_controlls'),
                afterShowFn: () => clickTab(true),
                contentTargetEl: tpl[0].querySelector(".hot-keys-config")
            },
            [TABS.MUSIC]: {
                name: _t('settings_notifications'),
                afterShowFn: () => clickTab(false),
                contentTargetEl: tpl[0].querySelector(".notifications-config")
            }
        };


        const tabsOptions = {
            tabsEl: {
                navEl: tpl[0].querySelector('.cards-header-wrapper'),
            }
        };

        this.tabsInstance = new Tabs.default(cards, tabsOptions);
    };

    const openSettingEditWidget = () => {
        this.tabsInstance.activateCard(TABS.CONTROLS);
    }

    const clickTab = (widgetEditable) => {
        Engine.widgetManager.setEditableWidget(widgetEditable)
        updateBottomBarVisible()
        self.updateScroll();
    };

    const updateBottomBarVisible = () => {
        let cardId = this.tabsInstance.getCurrentTab();
        let $bottomBar = wnd.$.find('.bottom-bar');

        let $optionsConfigButtons = $bottomBar.find('.options-config-buttons');
        let $hotKeysConfigButtons = $bottomBar.find('.hot-keys-config-buttons');
        let $notificationsConfigButtons = $bottomBar.find('.notifications-config-buttons');

        $optionsConfigButtons.css('display', "none");
        $hotKeysConfigButtons.css('display', "none");
        $notificationsConfigButtons.css('display', "none");


        switch (cardId) {
            case TABS.GENERAL:
                $optionsConfigButtons.css('display', "block");
                break;
            case TABS.CONTROLS:
                $hotKeysConfigButtons.css('display', "block");
                break;
            case TABS.MUSIC:
                $notificationsConfigButtons.css('display', "block");
                break;
        }
    };

    const updateOneCheckBoxOption = (value, checkbox) => {
        if (value != checkbox.getChecked()) {
            checkbox.setChecked(value);
        }
    }

    this.changeSingleOptionsAndSave = (optionId) => {
        let v = getEngine().settingsStorage.getValue(optionId);

        getEngine().settingsStorage.sendRequest(optionId, null, !v);
    }

    this.center = function() {
        wnd.center();
    };

    // this.saveAndClose = function () {
    // 	self.saveOptions();
    // 	self.close();
    // };

    this.updateData = function() {

        //if (!Engine.interface.getInterfaceStart()) {
        //	return;
        //}

        if (Engine.isInitLoadTime()) {
            return;
        }


        updateSettingsTrigger();

        this.saveServOpt();

        //this.updateOptions();

        var bool = isSettingsOptionsMapAnimationOn();
        //Engine.chat.changeTab(0);
        Engine.map.setAnimated(bool);
        Engine.banners.showOrHideBanners();
        Engine.nightController.rebuiltAfterSettingsSave();
        Engine.battle.warriors.rebuildAnimateWarrior();
        updateAllCharacterInfo()

        Engine.npcs.refreshAggressiveEmo();
        //Engine.miniMapController.miniMapWindow.updateWindowMiniMap();
    };

    const initSettingsTrigger = () => {
        settingsTrigger = {};
    }

    const addUpdateSettingsTrigger = (moduleName, idSettings, idKey, func) => {
        if (!settingsTrigger[moduleName]) {
            settingsTrigger[moduleName] = {};
        }

        if (!getEngine().settingsOptions.checkSettingsNumberExist(idSettings)) {
            return
        }

        if (!settingsTrigger[moduleName][idSettings]) {
            settingsTrigger[moduleName][idSettings] = {};
        }

        if (idKey) {
            settingsTrigger[moduleName][idSettings][idKey] = func;
        } else {
            settingsTrigger[moduleName][idSettings] = func;
        }
    };

    const removeUpdateSettingsTrigger = (moduleName) => {
        if (!settingsTrigger[moduleName]) {
            return
        }

        delete settingsTrigger[moduleName]
    };

    const updateSettingsTrigger = () => {
        let settingsStorage = getEngine().settingsStorage;
        let dataToSend = settingsStorage.getDataToSend();

        if (dataToSend == null) {
            errorReport(moduleData.fileName, 'updateSettingsTrigger', 'dataToSendNotExist');
            return
        }

        for (let moduleName in settingsTrigger) {

            let oneModule = settingsTrigger[moduleName];

            let settingsNumber = dataToSend.id;
            let settingsKey = dataToSend.key;

            if (!oneModule[settingsNumber]) {
                continue;
            }

            let result = getResultData(settingsNumber, settingsKey);

            if (settingsKey) {
                oneModule[settingsNumber][settingsKey](result);
            } else {
                oneModule[settingsNumber](result);
            }

        }

        // settingsStorage.resetDataToSend();
        settingsStorage.removeFirstElementFromDataToSend();
    };

    const getResultData = (settingsNumber, settingsKey) => {
        let settingsStorage = getEngine().settingsStorage;
        let settingsOptions = getEngine().settingsOptions;

        let result = {
            value: settingsStorage.getValue(settingsNumber, settingsKey)
        };
        let statesArray = settingsOptions.getStatesArray(settingsNumber, settingsKey, result.val);

        if (statesArray) {
            result.statesArray = statesArray;
        }

        return result;
    }

    this.saveServOpt = function() {

        Engine.setAllObjectsAnimationState(!isSettingsOptionsInterfaceAnimationOn());
        Engine.interface.setCSSAnimations();
        Engine.interface.setItemsHighlights();
    };

    this.open = function(options = {}) {
        const defaultOptions = {
            tab: TABS.GENERAL
        };
        options = {
            ...defaultOptions,
            ...options
        };

        let {
            tab,
            targetOption
        } = options;
        if (!isset(tab) || !isset(TABS[tab])) tab = TABS.GENERAL;

        wnd.addToAlertLayer();
        wnd.show();
        wnd.setWndOnPeak(true);
        Engine.lock.add('settings');
        this.center();

        this.tabsInstance.activateCard(tab);
        if (isset(targetOption)) {
            this.scrollToOption(targetOption);
        }

        //this.updateSoundSliderPos(tpl.find('.main-sound-wrapper .volumeSlider .marker'));
        //this.updateSoundSliderPos(tpl.find('.music-manager .volumeSlider .marker'), 				SOUND_DATA.TYPE.MUSIC);
        //this.updateSoundSliderPos(tpl.find('.battle-effect-sound-wrapper .volumeSlider .marker'), 	SOUND_DATA.TYPE.BATTLE_EFFECT);
        //this.updateSoundSliderPos(tpl.find('.notification-sound-wrapper .volumeSlider .marker'), 	SOUND_DATA.TYPE.NOTIFICATION);
        //this.updateSoundSliderPos(tpl.find('.sraj-effect-sound-wrapper .volumeSlider .marker'), 			SOUND_DATA.TYPE.SRAJ);

        //this.updateOptions('serveroption');
        //this.updateOptions();
        //this.updateOptions('localoption');
        //this.updateSoundNotification();
        this.updateHotKeys();
        //self.setVisible(0);
        this.updateScroll();
        //opened = true;
    };

    this.updateHotKeys = function() {

        //wnd.$.find('.hot-keys-list').empty();
        wnd.$.find('.hot-keys-list').find('.normal-tr').remove();
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
        let widgetManager = getEngine().widgetManager;
        let widgetSize = widgetManager.getWidgetSize(Engine.widgetsData.IN_WINDOW);

        widgetManager.set$BtnWidgetSize($iconWrapper, widgetSize);

        $iconWrapper.find('.icon').addClass(iconCl);

        //widgetManager.addDraggableAndDataAndTip($iconWrapper, _t('drag_and_drop_widget'), Engine.widgetsData.data.WIDGET_KEY, iconCl, {appendTo: 'body'})
        widgetManager.addDraggableAndDataAndTip($iconWrapper, _t('drag_and_drop_widget'), Engine.widgetsData.data.WIDGET_KEY, iconCl)

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

    this.createRecords = function(ob, addClass) {
        var $tr = $('<tr>').addClass('normal-tr');
        for (var i = 0; i < ob.length; i++) {
            var $td = $('<td>').html(ob[i]);
            if (typeof addClass == 'object') $td.addClass(addClass[i]);
            else $td.addClass(addClass);
            $tr.append($td);
        }
        return $tr;
    };

    const createTestSrajSound = () => {
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

        Engine.rajController.parseObject(srajData);
    };

    this.getContent = () => {
        return tpl;
    }

    this.addUpdateSettingsTrigger = addUpdateSettingsTrigger;
    this.removeUpdateSettingsTrigger = removeUpdateSettingsTrigger;

    this.createOneSettingsCheckbox = createOneSettingsCheckbox;
    this.createOneSettingsMenu = createOneSettingsMenu;
    this.createOneSettingsCheckboxList = createOneSettingsCheckboxList;
    this.createOneSettingsInput = createOneSettingsInput;
    this.openSettingEditWidget = openSettingEditWidget;

};