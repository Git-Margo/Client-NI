const tpl = require('@core/Templates');
const ChatData = require('@core/chat/ChatData');

const RadioList = require('@core/components/RadioList');
const ColorPicker = require('@core/components/ColorPicker');
const SettingsData = require('@core/settings/SettingsData');
const Checkbox = require('@core/components/Checkbox');

module.exports = function() {

    const moduleData = {
        fileName: "ChatConfigureWindow.js"
    };

    let wnd = null;
    let content = null;

    const init = () => {
        initWindow();
        showNotificationChannelConfiguration();
        showTimeConfiguration();
        showChanelTagConfiguration();
        showEmoConfiguration();
        showEnemyMsgConfiguration();
        getLegendaryItemClanNotification();
        showColorsConfiguration();
        setDefaultColorsButton();
        initScroll();
        updateScroll();

        wnd.center();
    }

    const initScroll = () => {
        content.find('.scroll-wrapper').addScrollBar({
            track: true
        });
    };

    const updateScroll = () => {
        $('.scroll-wrapper', content).trigger('update');
    };

    const setDefaultColorsButton = () => {
        let $wrapper = wnd.$.find('.default-colors-wrapper');

        let defaultColorsBtn = createButton(_t("default-chat-colors"), ["small", "green"], function() {
            defaultColorsProcedure();
        });

        $wrapper.append($(defaultColorsBtn));
    }

    const showColorsConfiguration = () => {

        let $wrapper = wnd.$.find('.color-configuration').empty();
        const MESSAGES_COLORS = ChatData.MESSAGES_COLORS;
        const HERO_MSG_COLOR = ChatData.KIND_MESSAGE_COLOR.HERO_MSG_COLOR;
        const OTHER_MSG_COLOR = ChatData.KIND_MESSAGE_COLOR.OTHER_MSG_COLOR;
        const EDIT_COLOR = ChatData.MESSAGES_COLORS_OPT.EDIT_COLOR;
        const chatConfig = getEngine().chatController.getChatConfig();

        for (let name in MESSAGES_COLORS) {

            let data = ChatData.MESSAGES_COLORS[name].EDIT_COLOR;

            if (!data.edit) continue

            let saveApart = data.saveApart;

            if (saveApart) {

                let heroMsgColor = chatConfig.getColorMessageData(name, EDIT_COLOR, HERO_MSG_COLOR);
                let otherMsgColor = chatConfig.getColorMessageData(name, EDIT_COLOR, OTHER_MSG_COLOR);

                createColorChoose($wrapper, name, heroMsgColor, [HERO_MSG_COLOR], HERO_MSG_COLOR);
                createColorChoose($wrapper, name, otherMsgColor, [OTHER_MSG_COLOR], OTHER_MSG_COLOR);
            } else {
                let heroMsgColor = chatConfig.getColorMessageData(name, EDIT_COLOR, HERO_MSG_COLOR);

                createColorChoose($wrapper, name, heroMsgColor, [HERO_MSG_COLOR, OTHER_MSG_COLOR]);
            }

        }
    };

    const defaultColorsProcedure = () => {
        setDefaultColorsInStorage();

        getEngine().chatController.rebuiltMessage();
        getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();

        showColorsConfiguration();
    };

    const setDefaultColorsInStorage = () => {
        const MESSAGES_COLORS = ChatData.MESSAGES_COLORS;
        const STATIC_MESSAGES_COLORS = ChatData.STATIC_KEYS.MESSAGES_COLORS;
        const HERO_MSG_COLOR = ChatData.KIND_MESSAGE_COLOR.HERO_MSG_COLOR;
        const OTHER_MSG_COLOR = ChatData.KIND_MESSAGE_COLOR.OTHER_MSG_COLOR;
        const EDIT_COLOR = ChatData.MESSAGES_COLORS_OPT.EDIT_COLOR;
        const INPUT_CHANNEL_HEADER = ChatData.INPUT_CHANNEL_HEADER;
        const chatConfig = getEngine().chatController.getChatConfig();

        for (let name in MESSAGES_COLORS) {

            let saveApart = MESSAGES_COLORS[name][EDIT_COLOR].saveApart;
            let channelData = INPUT_CHANNEL_HEADER[name];

            if (saveApart) {

                let heroMsgColor = channelData[HERO_MSG_COLOR];
                let otherMsgColor = channelData[OTHER_MSG_COLOR];

                chatConfig.setStorageData(
                    [STATIC_MESSAGES_COLORS, name, EDIT_COLOR, HERO_MSG_COLOR],
                    heroMsgColor);

                chatConfig.setStorageData(
                    [STATIC_MESSAGES_COLORS, name, EDIT_COLOR, OTHER_MSG_COLOR],
                    otherMsgColor);

            } else {

                let heroMsgColor = channelData[HERO_MSG_COLOR];

                chatConfig.setStorageData(
                    [STATIC_MESSAGES_COLORS, name, EDIT_COLOR, HERO_MSG_COLOR],
                    heroMsgColor);

            }

        }
    };

    const createColorChoose = ($wrapper, channelName, color, toSave, subName) => {


        let name = _t(channelName.toLowerCase(), null, 'chat_lang') + (subName ? " " + _t(subName) : "");
        let colorPicker = new ColorPicker();

        let $div = $('<div>').addClass('oneColorRow');

        colorPicker.init();
        colorPicker.updateData($div, color, null, function(_color) {

            for (let i = 0; i < toSave.length; i++) {
                let parToSave = toSave[i];

                getEngine().chatController.getChatConfig().setStorageData(
                    [ChatData.STATIC_KEYS.MESSAGES_COLORS, channelName, ChatData.MESSAGES_COLORS_OPT.EDIT_COLOR, parToSave],
                    _color);
            }

            getEngine().chatController.rebuiltMessage();
            getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();

        });

        $div.append($('<div>').addClass("color-name").html(name));

        let $colorPicker = colorPicker.get$colorPicker();

        $colorPicker.css('display', "inline-block");

        $wrapper.append($div);
    }

    const hidePalette = () => {
        wnd.$.find('.pick-color-palette').css('display', 'none');
    };

    const initWindow = () => {
        content = tpl.get('chat-configure-window');

        wnd = getEngine().windowManager.add({
            content: content,
            //title             : _t("chat_options", null, 'chat_lang'),
            title: getEngine().chatController.chatLang("chat_options"),
            nameWindow: getEngine().windowsData.name.CHAT_CONFIGURE,
            onclose: () => {
                closeWindow();
                getEngine().chatController.getChatInputWrapper().clearChatConfigureWindow();
            }
        });

        wnd.addToAlertLayer();

    }

    const showTimeConfiguration = () => {
        let $wrapper = wnd.$.find('.time-configuration').empty();

        let twelveHour = getEngine().chatController.getChatConfig().getMessageSectionData(ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.TWELVE_HOUR)

        let radioListData1 = {
            radios: [{
                    value: 1,
                    label: '12h',
                    selected: twelveHour
                },
                {
                    value: 0,
                    label: '24h',
                    selected: !twelveHour
                },
            ],
            name: ChatData.MESSAGE_SUB_SECTIONS.TWELVE_HOUR,
            onSelected: clickHour
        }

        let allUnit = getEngine().chatController.getChatConfig().getMessageSectionData(ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.ALL_UNIT)

        let radioListData2 = {
            radios: [{
                    value: 0,
                    label: 'hh:mm',
                    selected: !allUnit
                },
                {
                    value: 1,
                    label: 'hh:mm:ss',
                    selected: allUnit
                },
            ],
            name: ChatData.MESSAGE_SUB_SECTIONS.ALL_UNIT,
            onSelected: clickHour
        }

        //const radioList1 = new RadioList.default(radioListData1, { isInline: true, label: _t('time_format', null, "chat_lang") }).getList();
        //const radioList2 = new RadioList.default(radioListData2, { isInline: true, label: _t('hour_format', null, "chat_lang") }).getList();
        const radioList1 = new RadioList.default(radioListData1, {
            isInline: true,
            label: getEngine().chatController.chatLang('time_format')
        }).getList();
        const radioList2 = new RadioList.default(radioListData2, {
            isInline: true,
            label: getEngine().chatController.chatLang('hour_format')
        }).getList();

        //let $one = createCheckBox(_t("show_time", null, 'chat_lang'), '', function (state) {
        //let $one = createCheckBox(getEngine().chatController.chatLang("show_time"), '', function (state) {
        //
        //    let chatConfig = getEngine().chatController.getChatConfig();
        //
        //    chatConfig.setStorageData(
        //        [ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY],
        //        state
        //    );
        //
        //    if (state) {
        //        radioList1.classList.add('active-section');
        //        radioList2.classList.add('active-section');
        //    } else {
        //        radioList1.classList.remove('active-section');
        //        radioList2.classList.remove('active-section');
        //    }
        //
        //    getEngine().chatController.rebuiltMessage();
        //    getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();
        //});

        let state = getEngine().chatController.getChatConfig().getMessageSectionData(ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY);
        if (state) {
            //$one.find('.checkbox').addClass('active');
            radioList1.classList.add('active-section');
            radioList2.classList.add('active-section');
        }


        const oneCheckbox = new Checkbox.default({
                label: getEngine().chatController.chatLang("show_time"),
                i: "show-time",
                checked: state,
                highlight: false
            },
            (state) => {
                let chatConfig = getEngine().chatController.getChatConfig();

                chatConfig.setStorageData(
                    [ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY],
                    state
                );

                if (state) {
                    radioList1.classList.add('active-section');
                    radioList2.classList.add('active-section');
                } else {
                    radioList1.classList.remove('active-section');
                    radioList2.classList.remove('active-section');
                }

                getEngine().chatController.rebuiltMessage();
                getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();
            }
        );

        let $oneCheckbox = $(oneCheckbox.getCheckbox())


        $wrapper.append($oneCheckbox);
        $wrapper[0].appendChild(radioList1);
        $wrapper[0].appendChild(radioList2);
    }

    const showChanelTagConfiguration = () => {
        let $wrapper = wnd.$.find('.tag-configuration').empty();


        let allTag = getEngine().chatController.getChatConfig().getMessageSectionData(ChatData.MESSAGE_SECTIONS.CHANNEL_TAG, ChatData.MESSAGE_SUB_SECTIONS.ALL_TAG)

        let radioListData = {
            radios: [{
                    value: 1,
                    label: _t("full_channel_tag", null, 'chat_lang'),
                    selected: allTag
                },
                {
                    value: 0,
                    label: _t("shot_channel_tag", null, 'chat_lang'),
                    selected: !allTag
                },
            ],
            name: ChatData.MESSAGE_SUB_SECTIONS.ALL_TAG,
            onSelected: clickHour
        }

        const label = _t('tag_format', null, "chat_lang");
        const $smallIcon = $('<div>').addClass('small-icon-wrapper').append(tpl.get('info-icon').addClass('small-info').tip(_t("tag_format_tip", null, "chat_lang")));
        const radioList = new RadioList.default(radioListData, {
            isInline: true,
            label: label,
            elementAfterLabel: $smallIcon[0]
        }).getList();
        //const $one          = createCheckBox(_t("tag_show_options", null, 'chat_lang'), '', function (state) {
        //
        //    getEngine().chatController.getChatConfig().setStorageData(
        //        [ChatData.MESSAGE_SECTIONS.CHANNEL_TAG, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY],
        //        state
        //    );
        //
        //    if (state)  radioList.classList.add('active-section');
        //    else        radioList.classList.remove('active-section');
        //
        //    getEngine().chatController.rebuiltMessage();
        //    getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();
        //});

        let state = getEngine().chatController.getChatConfig().getMessageSectionData(ChatData.MESSAGE_SECTIONS.CHANNEL_TAG, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY);
        if (state) {
            //$one.find('.checkbox').addClass('active');
            radioList.classList.add('active-section');
        }

        const oneCheckbox = new Checkbox.default({
                label: _t("tag_show_options", null, 'chat_lang'),
                i: "tag-conf",
                checked: state,
                highlight: false
            },
            (state) => {
                getEngine().chatController.getChatConfig().setStorageData(
                    [ChatData.MESSAGE_SECTIONS.CHANNEL_TAG, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY],
                    state
                );

                if (state) radioList.classList.add('active-section');
                else radioList.classList.remove('active-section');

                getEngine().chatController.rebuiltMessage();
                getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();
            }
        );

        let $oneCheckbox = $(oneCheckbox.getCheckbox())

        $wrapper.append($oneCheckbox);
        $wrapper[0].appendChild(radioList);
    }

    const showEmoConfiguration = () => {
        const $wrapper = wnd.$.find('.emo-configuration').empty();
        //const $one          = createCheckBox(getEngine().chatController.chatLang("show_emo_icons"), '', function (state) {
        //
        //    getEngine().chatController.getChatConfig().setStorageData(
        //        [ChatData.MESSAGE_SECTIONS.EMO_ICON, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY],
        //        state
        //    );
        //
        //    getEngine().chatController.rebuiltMessage();
        //    getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();
        //});

        let state = getEngine().chatController.getChatConfig().getMessageSectionData(ChatData.MESSAGE_SECTIONS.EMO_ICON, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY);
        //if (state) {
        //    $one.find('.checkbox').addClass('active');
        //}

        const oneCheckbox = new Checkbox.default({
                label: getEngine().chatController.chatLang("show_emo_icons"),
                i: "emo",
                checked: state,
                highlight: false
            },
            (state) => {
                getEngine().chatController.getChatConfig().setStorageData(
                    [ChatData.MESSAGE_SECTIONS.EMO_ICON, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY],
                    state
                );

                getEngine().chatController.rebuiltMessage();
                getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();
            }
        );

        let $oneCheckbox = $(oneCheckbox.getCheckbox())

        $wrapper.append($oneCheckbox);
    };

    const showEnemyMsgConfiguration = () => {
        /*
        const settings      = getEngine().settings;
        const optionId      = SettingsData.KEY.RECEIVE_FROM_ENEMY_CHAT_MESSAGE;
        const checkboxData  = settings.getDataToCreateCheckBox(optionId);
        const $wrapper      = wnd.$.find('.enemy-msg-configuration').empty();
        const $one          = createCheckBox(_t(`opt_${optionId}`, null, 'SettingsOptions'), '', function (state) {
            //settings.changeSingleOptionsAndSave(optionId)
            let nextValue = !checkboxData.getValue();
            checkboxData.changeCallback(nextValue);
        });

        const $checkbox = $one.find('.checkbox')

        $wrapper.append($one);
        //settings.updateSingleserveroption('.enemy-msg-configuration', getEngine().hero.d.opt);
        //settings.updateSingleserveroption('.enemy-msg-configuration');
        settings.updateOneCheckBoxOption(optionId, $checkbox);

        Engine.settings.addUpdateSettingsTrigger(moduleData.fileName, optionId, null, function (v) {
            settings.updateOneCheckBoxOption(optionId, $checkbox);
        })
        */

        const optionId = SettingsData.KEY.RECEIVE_FROM_ENEMY_CHAT_MESSAGE;
        const $wrapper = wnd.$.find('.enemy-msg-configuration').empty();

        getEngine().settings.createOneSettingsCheckbox(moduleData.fileName, optionId, null, null, $wrapper);
    };

    const getLegendaryItemClanNotification = () => {
        /*
        const settings      = getEngine().settings;
        const optionId      = SettingsData.KEY.ANNOUNCE_CLAN_ABOUT_LEGEND_DROP_CHAT_MESSAGE;
        const checkboxData  = settings.getDataToCreateCheckBox(optionId);
        const $wrapper      = wnd.$.find('.get-legendary-item-clan-notification').empty();
        const $one          = createCheckBox(_t(`opt_${optionId}`, null, 'SettingsOptions'), '', function (state) {
            //settings.changeSingleOptionsAndSave(optionId)
            let nextValue = !checkboxData.getValue();
            checkboxData.changeCallback(nextValue);
        });

        const $checkbox = $one.find('.checkbox')

        $wrapper.append($one);
        //settings.updateSingleserveroption('.get-legendary-item-clan-notification');
        settings.updateOneCheckBoxOption(optionId, $checkbox);

        Engine.settings.addUpdateSettingsTrigger(moduleData.fileName, optionId, null, function (v) {
            settings.updateOneCheckBoxOption(optionId, $checkbox);
        })
        */

        const optionId = SettingsData.KEY.ANNOUNCE_CLAN_ABOUT_LEGEND_DROP_CHAT_MESSAGE;
        const $wrapper = wnd.$.find('.get-legendary-item-clan-notification').empty();

        getEngine().settings.createOneSettingsCheckbox(moduleData.fileName, optionId, null, null, $wrapper);
    };

    const clickHour = (e1, e2) => {

        let value = e1.target.value;
        let name = e1.target.name;

        if (value === "1") value = true;
        if (value === "0") value = false;

        let chatConfig = getEngine().chatController.getChatConfig();

        switch (name) {
            case ChatData.MESSAGE_SUB_SECTIONS.ALL_TAG:
                chatConfig.setStorageData([ChatData.MESSAGE_SECTIONS.CHANNEL_TAG, name], value);
                break;
            case ChatData.MESSAGE_SUB_SECTIONS.ALL_UNIT:
                chatConfig.setStorageData([ChatData.MESSAGE_SECTIONS.TS, name], value);
                break;
            case ChatData.MESSAGE_SUB_SECTIONS.TWELVE_HOUR:
                chatConfig.setStorageData([ChatData.MESSAGE_SECTIONS.TS, name], value);
                break;
        }

        getEngine().chatController.rebuiltMessage();
        getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();
    }

    const showNotificationChannelConfiguration = () => {
        let CHANNEL_CARDS = ChatData.CHANNEL_CARDS;
        let $wrapper = wnd.$.find('.notification-configuration');

        for (let k in CHANNEL_CARDS) {
            if (k == ChatData.CHANNEL.GENERAL) continue;

            let $one = addMessageToGeneralOneCheckbox(k, k);
            $wrapper.append($one);
        }
    }

    const addMessageToGeneralOneCheckbox = (name, cl) => {
        //let $one = createCheckBox(_t(name.toLowerCase(), null, 'chat_lang'), cl, function (state) {
        //    getEngine().chatController.getChatConfig().setStorageData(
        //        [ChatData.STATIC_KEYS.MESSAGES_ADD_TO_GENERAL, name, ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD],
        //        state);
        //
        //    getEngine().chatController.rebuiltMessage();
        //    getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();
        //});


        let state = getEngine().chatController.getChatConfig().getMessagesAddToGeneralData(name, ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD);
        //if (state) $one.find('.checkbox').addClass('active');

        const oneCheckbox = new Checkbox.default({
                label: _t(name.toLowerCase(), null, 'chat_lang'),
                i: name,
                checked: state,
                highlight: false
            },
            (state) => {
                getEngine().chatController.getChatConfig().setStorageData(
                    [ChatData.STATIC_KEYS.MESSAGES_ADD_TO_GENERAL, name, ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD],
                    state);

                getEngine().chatController.rebuiltMessage();
                getEngine().chatController.getChatConfig().saveInServerStorageChatConfigStorage();
            }
        );

        let $oneCheckbox = $(oneCheckbox.getCheckbox())

        $oneCheckbox.addClass(cl)

        return $oneCheckbox
    };

    const closeWindow = () => {
        getEngine().settings.removeUpdateSettingsTrigger(moduleData.fileName);
        wnd.remove();
    }

    this.init = init;
    this.closeWindow = closeWindow;

}