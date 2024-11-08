var ChatData = require('core/chat/ChatData.js');
var ServerStorageData = require('core/storage/ServerStorageData.js');

module.exports = function() {

    let moduleData = {
        fileName: "ChatConfig.js"
    };

    let messagesAddToGeneral = null;
    let sectionsVisible = null;
    let channelsColor = null;
    let storageData = {};

    const init = () => {
        updateMessagesAddToGeneral();
        updateSectionsVisible();
        updateChannelsColor();
    };

    const updateMessagesAddToGeneral = () => {

        messagesAddToGeneral = {};

        for (let section in ChatData.MESSAGES_ADD_TO_GENERAL) {

            let stateData = ChatData.MESSAGES_ADD_TO_GENERAL[section];
            let oneSection = copyStructure(stateData);
            messagesAddToGeneral[section] = oneSection;

            for (let opt in oneSection) {
                let val = getStorageData(ChatData.STATIC_KEYS.MESSAGES_ADD_TO_GENERAL, section, opt);
                if (val === null) continue

                oneSection[opt] = val;
            }

        }
    };

    const updateSectionsVisible = () => {

        sectionsVisible = {};

        for (let section in ChatData.MESSAGE_SECTIONS_VISIBLE) {

            let stateData = ChatData.MESSAGE_SECTIONS_VISIBLE[section];
            let oneSection = copyStructure(stateData);
            sectionsVisible[section] = oneSection;

            for (let subSection in oneSection) {
                let val = getStorageData(section, subSection);
                if (val === null) continue

                oneSection[subSection] = val;
            }

        }
    };

    const updateChannelsColor = () => {

        //channelsColor = {};
        //
        //for (let k in ChatData.INPUT_CHANNEL_HEADER) {
        //    let one = ChatData.INPUT_CHANNEL_HEADER[k];
        //
        //    channelsColor[one.name] = {
        //        heroMsgColor : one.heroMsgColor,
        //        otherMsgColor: one.otherMsgColor
        //    }
        //}


        channelsColor = {};

        const EDIT_COLOR = ChatData.MESSAGES_COLORS_OPT.EDIT_COLOR;
        const MESSAGES_COLORS = ChatData.MESSAGES_COLORS;
        const HERO_MSG_COLOR = ChatData.KIND_MESSAGE_COLOR.HERO_MSG_COLOR;
        const OTHER_MSG_COLOR = ChatData.KIND_MESSAGE_COLOR.OTHER_MSG_COLOR;


        for (let name in MESSAGES_COLORS) {

            let color = ChatData.INPUT_CHANNEL_HEADER[name];

            if (!channelsColor[name]) channelsColor[name] = {
                [EDIT_COLOR]: {
                    [HERO_MSG_COLOR]: null,
                    [OTHER_MSG_COLOR]: null
                }
            };

            let colorObj = channelsColor[name][EDIT_COLOR];

            colorObj[HERO_MSG_COLOR] = color[HERO_MSG_COLOR];
            colorObj[OTHER_MSG_COLOR] = color[OTHER_MSG_COLOR];

            let heroMsgColor = null;
            let otherMsgColor = null;

            if (MESSAGES_COLORS[name][EDIT_COLOR].saveApart) {

                heroMsgColor = getStorageData(ChatData.STATIC_KEYS.MESSAGES_COLORS, name, EDIT_COLOR, HERO_MSG_COLOR);
                otherMsgColor = getStorageData(ChatData.STATIC_KEYS.MESSAGES_COLORS, name, EDIT_COLOR, OTHER_MSG_COLOR);

            } else {

                let val = getStorageData(ChatData.STATIC_KEYS.MESSAGES_COLORS, name, EDIT_COLOR, HERO_MSG_COLOR);
                heroMsgColor = val;
                otherMsgColor = val;

            }

            if (heroMsgColor !== null) colorObj[HERO_MSG_COLOR] = heroMsgColor;
            if (otherMsgColor !== null) colorObj[OTHER_MSG_COLOR] = otherMsgColor;
        }
    };

    const getMessageSectionData = (section, subSection) => {
        const FUNC = "getMessageSectionData";

        if (!isset(ChatData.MESSAGE_SECTIONS_VISIBLE[section])) {
            errorReport(moduleData.fileName, FUNC, `SECTION: ${section} not exist!`, ChatData.MESSAGE_SECTIONS_VISIBLE);
            return false
        }

        if (!isset(ChatData.MESSAGE_SECTIONS_VISIBLE[section][subSection])) {
            errorReport(moduleData.fileName, FUNC, `SUB_SECTION: ${subSection} not exist!`, ChatData.MESSAGE_SECTIONS_VISIBLE[section][subSection]);
            return false
        }

        return sectionsVisible[section][subSection];
    };

    const getMessagesAddToGeneralData = (section, subSection) => {
        //if (section == ChatData.CHANNEL.GLOBAL) return true;
        if (section == ChatData.CHANNEL.GENERAL) return true;

        const FUNC = "getColorMessageData";

        if (!isset(ChatData.MESSAGES_ADD_TO_GENERAL[section])) {
            errorReport(moduleData.fileName, FUNC, `SECTION: ${section} not exist!`, ChatData.MESSAGES_ADD_TO_GENERAL[section]);
            return false
        }

        if (!isset(ChatData.MESSAGES_ADD_TO_GENERAL_OPT[subSection])) {
            errorReport(moduleData.fileName, FUNC, `OPT: ${subSection} not exist!`, ChatData.MESSAGES_ADD_TO_GENERAL_OPT);
            return false
        }

        return messagesAddToGeneral[section][subSection];
    }

    const getColorMessageData = (section, subSection, kindMessageColor) => {

        const FUNC = "getColorMessageData";
        const HERO_MSG_COLOR = ChatData.KIND_MESSAGE_COLOR.HERO_MSG_COLOR;
        const OTHER_MSG_COLOR = ChatData.KIND_MESSAGE_COLOR.OTHER_MSG_COLOR;

        if (!isset(ChatData.MESSAGES_COLORS[section])) {
            errorReport(moduleData.fileName, FUNC, `SECTION: ${section} not exist!`, ChatData.MESSAGES_COLORS);
            return false
        }

        if (!isset(ChatData.MESSAGES_COLORS_OPT[subSection])) {
            errorReport(moduleData.fileName, FUNC, `OPT: ${subSection} not exist!`, ChatData.MESSAGES_COLORS_OPT);
            return false
        }


        if (![HERO_MSG_COLOR, OTHER_MSG_COLOR].includes(kindMessageColor)) {
            errorReport(moduleData.fileName, FUNC, `only available kindMessageColor: is ${HERO_MSG_COLOR}} or ${OTHER_MSG_COLOR}!`, kindMessageColor);
            return false
        }

        return channelsColor[section][subSection][kindMessageColor];
    }

    const getChannelColor = (name, heroMessage) => {
        const HERO_MSG_COLOR = ChatData.KIND_MESSAGE_COLOR.HERO_MSG_COLOR;
        const OTHER_MSG_COLOR = ChatData.KIND_MESSAGE_COLOR.OTHER_MSG_COLOR;

        let kindMessageColor = heroMessage ? HERO_MSG_COLOR : OTHER_MSG_COLOR;
        let EDIT_COLOR = ChatData.MESSAGES_COLORS_OPT.EDIT_COLOR;

        return channelsColor[name][EDIT_COLOR][kindMessageColor];
    };
    /*
        const setStorageData = (keys, val) => {

            let mainKey     = keys[0];
            let deepKey     = keys[1];
            let deeperKey   = isset(keys[2]) ? keys[2] : null;


            if (!storageData[mainKey]) storageData[mainKey] = {};

            if (deeperKey == null) storageData[mainKey][deepKey] = val;
            else {

                if (!storageData[mainKey][deepKey]) storageData[mainKey][deepKey] = {};

                storageData[mainKey][deepKey][deeperKey] = val;

            }
        };
    */
    const setStorageData = (keys, val) => {

        let mainKey = keys[0];
        let deepKey = keys[1];
        let deeperKey = isset(keys[2]) ? keys[2] : null;
        let deeperDeeperKey = isset(keys[3]) ? keys[3] : null;


        if (!storageData[mainKey]) storageData[mainKey] = {};

        if (deeperKey == null) storageData[mainKey][deepKey] = val;
        else {

            if (!storageData[mainKey][deepKey]) storageData[mainKey][deepKey] = {};

            if (deeperDeeperKey == null) storageData[mainKey][deepKey][deeperKey] = val;
            else {

                if (!storageData[mainKey][deepKey][deeperKey]) storageData[mainKey][deepKey][deeperKey] = {};

                storageData[mainKey][deepKey][deeperKey][deeperDeeperKey] = val;

            }

            //storageData[mainKey][deepKey][deeperKey] = val;

        }
    };

    const getStorageData = (mainKey, deepKey, deeperKey, deeperDeeperKey) => {
        if (!isset(storageData[mainKey])) return null;
        if (!isset(storageData[mainKey][deepKey])) return null;

        if (!isset(deeperKey)) return storageData[mainKey][deepKey];
        else {

            if (!isset(storageData[mainKey][deepKey][deeperKey])) return null;

            if (!isset(deeperDeeperKey)) return storageData[mainKey][deepKey][deeperKey];
            else {

                if (!isset(storageData[mainKey][deepKey][deeperKey][deeperDeeperKey])) return null;

                return storageData[mainKey][deepKey][deeperKey][deeperDeeperKey];

            }
            //return storageData[mainKey][deepKey][deeperKey];
        }
    };

    const allStorageData = () => {
        return storageData;
    };

    const saveInServerStorageChatConfigStorage = () => {
        const CHAT_KEY = ServerStorageData.CHAT;
        const DATA = ChatData.SERVER_STORAGE.DATA;

        getEngine().serverStorage.sendData({
            [CHAT_KEY]: {
                [DATA]: storageData
            }
        });
    };

    const checkDataFromServerStorageIsCorrect = (data) => {

        if (!elementIsObject(data)) {
            errorReport(moduleData.fileName, "checkDataFromServerStorageIsCorrect", "Chat serverStorageData have to be obj!", data);
            return false;
        }


        const FUNC = "checkDataFromServerStorageIsCorrect";
        let CHANNEL_TAG = ChatData.MESSAGE_SECTIONS.CHANNEL_TAG;
        let EMO_ICON = ChatData.MESSAGE_SECTIONS.EMO_ICON;
        let MESSAGES_ADD_TO_GENERAL = ChatData.STATIC_KEYS.MESSAGES_ADD_TO_GENERAL;
        let MESSAGES_COLORS = ChatData.STATIC_KEYS.MESSAGES_COLORS;
        let TS = ChatData.MESSAGE_SECTIONS.TS;


        if (data[CHANNEL_TAG] && elementIsObject(data[CHANNEL_TAG])) {
            let d = data[CHANNEL_TAG];
            let ALL_TAG = ChatData.MESSAGE_SUB_SECTIONS.ALL_TAG;

            if (isset(d[ALL_TAG])) {
                let allTagValue = d[ALL_TAG];
                if (!isBooleanWithWarning(allTagValue)) {
                    errorReport(moduleData.fileName, FUNC, `Chat serverStorageData data.${ALL_TAG} have to be bool value!`, data);
                    return false
                }
            }

        }

        if (data[EMO_ICON] && elementIsObject(data[EMO_ICON])) {
            let d = data[EMO_ICON];
            let DISPLAY = ChatData.MESSAGE_SUB_SECTIONS.DISPLAY;

            if (isset(d[DISPLAY])) {
                let displayValue = d[DISPLAY];
                if (!isBooleanWithWarning(displayValue)) {
                    errorReport(moduleData.fileName, FUNC, `Chat serverStorageData data.${DISPLAY} have to be bool value!`, data);
                    return false
                }
            }
        }


        if (data[MESSAGES_ADD_TO_GENERAL] && elementIsObject(data[MESSAGES_ADD_TO_GENERAL])) {

            let ADD = ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD;
            let d = data[MESSAGES_ADD_TO_GENERAL];

            for (let channelName in d) {
                if (!ChatData.CHANNEL[channelName]) {
                    errorReport(moduleData.fileName, FUNC, `Chat serverStorageData data.${MESSAGES_ADD_TO_GENERAL} Channel not exist!`, data);
                    return false;
                }

                let oneChannelData = d[channelName];

                if (!elementIsObject(oneChannelData)) {
                    errorReport(moduleData.fileName, FUNC, `Chat serverStorageData data.${MESSAGES_ADD_TO_GENERAL} Channel data have to object!`, data);
                    return false;
                }

                if (isset(oneChannelData[ADD])) {
                    let addValue = oneChannelData[ADD];
                    if (!isBooleanWithWarning(addValue)) {
                        errorReport(moduleData.fileName, FUNC, `Chat serverStorageData data.[channel]${ADD} have to bool data!`, data);
                        return false;
                    }
                }

            }
        }

        if (data[MESSAGES_COLORS] && elementIsObject(data[MESSAGES_COLORS])) {

            let EDIT_COLOR = ChatData.MESSAGES_COLORS_OPT.EDIT_COLOR;
            let d = data[MESSAGES_COLORS];

            for (let channelName in d) {
                if (!ChatData.CHANNEL[channelName]) {
                    errorReport(moduleData.fileName, FUNC, `Chat serverStorageData data.${MESSAGES_COLORS} Channel not exist!`, data);
                    return false;
                }

                let oneChannelData = d[channelName];

                if (!elementIsObject(oneChannelData)) {
                    errorReport(moduleData.fileName, FUNC, `Chat serverStorageData data.${MESSAGES_COLORS} Channel data have to object!`, data);
                    return false;
                }

                if (isset(oneChannelData[EDIT_COLOR]) && !elementIsObject(oneChannelData[EDIT_COLOR])) {
                    errorReport(moduleData.fileName, FUNC, `Chat serverStorageData data.${MESSAGES_COLORS} EDIT_COLOR must be obj!`, data);
                    return false
                }

            }
        }

        if (data[TS] && elementIsObject(data[TS])) {

            let DISPLAY = ChatData.MESSAGE_SUB_SECTIONS.DISPLAY;
            let ALL_UNIT = ChatData.MESSAGE_SUB_SECTIONS.ALL_UNIT;
            let TWELVE_HOUR = ChatData.MESSAGE_SUB_SECTIONS.TWELVE_HOUR;
            let tsData = data[TS];

            if (isset(tsData[DISPLAY])) {
                let displayValue = tsData[DISPLAY];
                if (!isBooleanWithWarning(displayValue)) {
                    errorReport(moduleData.fileName, FUNC, `Chat serverStorageData data.${DISPLAY} have to bool data!`, data);
                    return false;
                }
            }

            if (isset(tsData[ALL_UNIT])) {
                let allUnitValue = tsData[ALL_UNIT];
                if (!isBooleanWithWarning(allUnitValue)) {
                    errorReport(moduleData.fileName, FUNC, `Chat serverStorageData data.${ALL_UNIT} have to bool data!`, data);
                    return false;
                }
            }

            if (isset(tsData[TWELVE_HOUR])) {
                let twelveHourValue = tsData[TWELVE_HOUR];
                if (!isBooleanWithWarning(twelveHourValue)) {
                    errorReport(moduleData.fileName, FUNC, `Chat serverStorageData data.${TWELVE_HOUR} have to bool data!`, data);
                    return false;
                }
            }

        }

        return true;
    };

    const getDataFromServerStorageAndSetStorageData = (_storageData) => {
        if (!checkDataFromServerStorageIsCorrect(_storageData)) return;

        storageData = _storageData
    };

    this.init = init;
    this.setStorageData = setStorageData;
    this.getStorageData = getStorageData;
    this.allStorageData = allStorageData;
    this.getMessageSectionData = getMessageSectionData;

    this.getMessagesAddToGeneralData = getMessagesAddToGeneralData;
    this.getColorMessageData = getColorMessageData;
    this.saveInServerStorageChatConfigStorage = saveInServerStorageChatConfigStorage;
    this.getDataFromServerStorageAndSetStorageData = getDataFromServerStorageAndSetStorageData;

    this.getChannelColor = getChannelColor;
    this.updateSectionsVisible = updateSectionsVisible;
    this.updateMessagesAddToGeneral = updateMessagesAddToGeneral;
    this.updateChannelsColor = updateChannelsColor;

}