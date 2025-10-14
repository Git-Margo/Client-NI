var SettingsData = require('@core/settings/SettingsData');


module.exports = function() {

    const moduleData = {
        fileName: "SettingsOptions.js"
    };

    const init = () => {

    };

    const isReceivePrivateChatMessageOn = () => {
        //return getEngine().settingsStorage.getValue(1);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.RECEIVE_PRIVATE_CHAT_MESSAGE);
    };

    const isInvitationToClanAndDiplomacyOn = () => {
        //return getEngine().settingsStorage.getValue(2);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.INVITATION_TO_CLAN_AND_DIPLOMACY);
    };

    const isTradeWithOthersOn = () => {
        //return getEngine().settingsStorage.getValue(3);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.TRADE_WITH_OTHERS);
    };

    const isTurnBasedCombatAfterMonsterAttackOn = () => {
        //return getEngine().settingsStorage.getValue(4);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.TURN_BASED_COMBAT_AFTER_MONSTER_ATTACK);
    };

    const isInvitationToFriendsOn = () => {
        //return getEngine().settingsStorage.getValue(5);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.INVITATION_TO_FRIENDS);
    };

    const isMailFromUnknownOn = () => {
        //return getEngine().settingsStorage.getValue(6);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.MAIL_FROM_UNKNOWN);
    };

    const isMouseHeroWalkOn = () => {
        //return getEngine().settingsStorage.getValue(7);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.MOUSE_HERO_WALK);
    };

    const isInterfaceAnimationOn = () => {
        //return getEngine().settingsStorage.getValue(8);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.INTERFACE_ANIMATION);
    };

    const isClanMemberEntryChatMessageOn = () => {
        //return getEngine().settingsStorage.getValue(9);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.CLAN_MEMBER_ENTRY_CHAT_MESSAGE);
    };


    // 10 empty

    const isCycleDayAndNightOn = () => {
        //return getEngine().settingsStorage.getValue(11);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.CYCLE_DAY_AND_NIGHT);
    };

    const isAutoGoThroughGatewayOn = () => {
        //return getEngine().settingsStorage.getValue(12);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.AUTO_GO_THROUGH_GATEWAY);
        //return checkOpt(12) ? false : true;
    };

    const isShowItemsRankOn = () => {
        //return getEngine().settingsStorage.getValue(13);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.SHOW_ITEMS_RANK);
        //return checkOpt(13) ? false : true;
    };

    const isBerserk = () => {
        //return getEngine().settingsStorage.getValue(13);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.BERSERK);
        //return checkOpt(13) ? false : true;
    };

    const isBerserkGroup = () => {
        //return getEngine().settingsStorage.getValue(13);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.BERSERK_GROUP);
        //return checkOpt(13) ? false : true;
    };

    const isInvitationToPartyBeyondFriendsAndClansAndClansAllyOn = () => {
        //return getEngine().settingsStorage.getValue(14);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.INVITATION_TO_PARTY_BEYOND_FRIENDS_AND_CLANS_AND_CLANS_ALLY);
        //return checkOpt(13) ? false : true;
    };

    const isFriendEntryChatMessageOn = () => {
        //return getEngine().settingsStorage.getValue(15);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.FRIEND_ENTRY_CHAT_MESSAGE);
    };

    const isWeatherAndEventEffectsOn = () => {
        //return getEngine().settingsStorage.getValue(16);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.WEATHER_AND_EVENT_EFFECTS);
        //return checkOpt(16) ? false : true;
    };

    const isBannersOn = () => {
        //return getEngine().settingsStorage.getValue(17);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.BANNERS);
        //return checkOpt(17) ? false : true;
    };

    const isAddOrRemovePartyMemberChatMessageOn = () => {
        //return getEngine().settingsStorage.getValue(18);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.ADD_OR_REMOVE_PARTY_MEMBER_CHAT_MESSAGE);
        //return checkOpt(17) ? false : true;
    };

    const isMapAnimationOn = () => {
        //return getEngine().settingsStorage.getValue(19);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.MAP_ANIMATION);
        //return checkOpt(19) ? true : false;
    };

    //20 empty

    const isInformAboutFreePlaceInBagOn = () => {
        //return getEngine().settingsStorage.getValue(21);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.INFORM_ABOUT_FREE_PLACE_IN_BAG);
    };

    //22 empty

    const isLoaderSplashOn = () => {
        //return getEngine().settingsStorage.getValue(23);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.LOADER_SPLASH);
        //return checkOpt(23) ? false : true;
    };

    const isWarShadowOn = () => {
        //return getEngine().settingsStorage.getValue(24);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.WAR_SHADOW);
        //return checkOpt(24) ? false : true;
    };

    const isAutoCompareItemsOn = () => {
        //return getEngine().settingsStorage.getValue(25);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.AUTO_COMPARE_ITEMS);
        //return checkOpt(25) ? false : true;
    };

    const isBattleEffectsOn = () => {
        //return getEngine().settingsStorage.getValue(26);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.BATTLE_EFFECTS);
        //return checkOpt(26) ? false : true;
    };

    const isAutoCloseBattleOn = () => {
        //return getEngine().settingsStorage.getValue(27);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.AUTO_CLOSE_BATTLE);
        //return checkOpt(27) ? true : false;
    };

    const isExchangeSafeMode = () => {
        // return checkOpt(30) ? true : false;
        return getEngine().settingsStorage.getValue(SettingsData.KEY.EXCHANGE_SAFE_MODE);
    }

    const isReceiveFromEnemyChatMessageOn = () => {
        //return getEngine().settingsStorage.getValue(28);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.RECEIVE_FROM_ENEMY_CHAT_MESSAGE);
    };

    const isAnnouceClanAboutLeggendDropChatMessageOn = () => {
        //return getEngine().settingsStorage.getValue(29);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.ANNOUNCE_CLAN_ABOUT_LEGEND_DROP_CHAT_MESSAGE);
    };

    const getBerserkLvlMin = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.BERSERK, SettingsData.VARS.BERSERK_VARS.LVL_MIN);
    };

    const getBerserkLvlMax = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.BERSERK, SettingsData.VARS.BERSERK_VARS.LVL_MAX);
    };

    const getBerserkCommon = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.BERSERK, SettingsData.VARS.BERSERK_VARS.COMMON);
    };

    const getBerserkElite = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.BERSERK, SettingsData.VARS.BERSERK_VARS.ELITE);
    };

    const getBerserkElite2 = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.BERSERK, SettingsData.VARS.BERSERK_VARS.ELITE2);
    };

    const getBerserkGroupLvlMin = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.BERSERK_GROUP, SettingsData.VARS.BERSERK_VARS.LVL_MIN);
    };

    const getBerserkGroupLvlMax = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.BERSERK_GROUP, SettingsData.VARS.BERSERK_VARS.LVL_MAX);
    };

    const getBerserkGroupCommon = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.BERSERK_GROUP, SettingsData.VARS.BERSERK_VARS.COMMON);
    };

    const getBerserkGroupElite = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.BERSERK_GROUP, SettingsData.VARS.BERSERK_VARS.ELITE);
    };

    const getBerserkGroupElite2 = () => {
        return getEngine().settingsStorage.getValue(SettingsData.KEY.BERSERK_GROUP, SettingsData.VARS.BERSERK_VARS.ELITE2);
    };

    const getKindOfShowLevelAndOperationLevel = () => {
        //return getEngine().settingsStorage.getObjectValue(SettingsData.KEY.KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL, SettingsData.VARS.OPERATION_LEVEL.MODE);
        return getEngine().settingsStorage.getValue(SettingsData.KEY.KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL, SettingsData.VARS.OPERATION_LEVEL.MODE);
    };

    const numberToCheckboxes = (number, length) => {
        return Array.from({
            length
        }, (_, i) => Boolean(number & (1 << (length - 1 - i)))).reverse();;
    }

    const checkSettingsNumberExist = (settingsNumber) => {

        if (!SettingsData.LIST[settingsNumber]) {
            errorReport(moduleData.fileName, "checkSettingsNUmberExist", "settingsNumber no exist", settingsNumber);
            return false;
        }

        return true
    }

    const getCheckBoxListData = (settingsNumber, key) => {
        const FUNC = "getCheckBoxListData";

        if (!checkSettingsNumberExist(settingsNumber)) {
            return null
        }

        let data = SettingsData.LIST[settingsNumber];

        //if (!data) {
        //    errorReport(moduleData.fileName, FUNC, "settingsNumber no exist", settingsNumber);
        //    return null;
        //}


        if (key) {

            if (!checkCorrectDataWithKey(data)) {
                return
            }

            data = data.object[key];

            if (!data.bits) {
                errorReport(moduleData.fileName, FUNC, `data.object[${key}].bits not exist!`, settingsNumber);
                return null;
            }

        } else {

            if (!data.bits) {
                errorReport(moduleData.fileName, FUNC, "settingsNumber no exist bits", settingsNumber);
                return null;
            }

        }

        let bits = [];

        let bitsLength = data.bits.length;

        for (let i = 0; i < bitsLength; i++) {
            let bitOption = data.bits[i];
            if (bitOption === null) continue;

            bits.push({
                text: getOneBitLang(settingsNumber, key, bitOption),
                bitOption: bitOption,
                bit: i
            });
        }


        let getValueFunc = () => getEngine().settingsStorage.getValue(settingsNumber, key);

        //let value = getValueFunc();

        return {
            bits: bits,
            labelTip: data.labelTip,
            getValue: getValueFunc,
            //statesArray : numberToCheckboxes(value, bitsLength)
            getStatesArray: () => getStatesArray(settingsNumber, key, getValueFunc()),
        }
    }

    const getStatesArray = (settingsNumber, key, value) => {

        if (!checkSettingsNumberExist(settingsNumber)) {
            return null
        }

        let data = SettingsData.LIST[settingsNumber];

        if (key) {

            data = data.object[key];

            if (!data.bits) {
                return null;
            }

        } else {

            if (!data.bits) {
                return null;
            }

        }

        let bitsLength = data.bits.length;

        return numberToCheckboxes(value, bitsLength);
    };

    const getInputData = (settingsNumber, key) => {
        const FUNC = "getCheckBoxData";
        let data = SettingsData.LIST[settingsNumber];

        if (!data) {
            errorReport(moduleData.fileName, FUNC, "settingsNumber no exist", settingsNumber);
            return null;
        }

        if (key) {

            if (!checkCorrectDataWithKey(data)) {
                return null;
            }

            data = data.object[key];

        } else {
            if (data.type != "INT") {
                errorReport(moduleData.fileName, FUNC, `settingsNumber ${settingsNumber} has BOOL type!`, data);
                return null;
            }
        }

        return {
            getValue: () => getEngine().settingsStorage.getValue(settingsNumber, key),
            labelTip: data.labelTip,
            min: data.min,
            max: data.max
        }
    };

    const getCheckBoxData = (settingsNumber, key) => {
        const FUNC = "getCheckBoxData";
        let data = SettingsData.LIST[settingsNumber];

        if (!data) {
            errorReport(moduleData.fileName, FUNC, "settingsNumber no exist", settingsNumber);
            return null;
        }

        if (key) {

            if (!checkCorrectDataWithKey(data)) {
                return null;
            }
            data = data.object[key];

        } else {
            if (data.type != "BOOL") {
                errorReport(moduleData.fileName, FUNC, `settingsNumber ${settingsNumber} has BOOL type!`, data);
                return null;
            }
        }

        return {
            getValue: () => getEngine().settingsStorage.getValue(settingsNumber, key),
            labelTip: data.labelTip
        }
    }

    const getMenuData = (settingsNumber, key) => {
        const FUNC = "getMenuData";
        let data = SettingsData.LIST[settingsNumber];

        if (!data) {
            errorReport(moduleData.fileName, FUNC, "settingsNumber no exist", settingsNumber);
            return null;
        }

        if (key) {

            if (!checkCorrectDataWithKey(data)) {
                return
            }

            data = data.object[key];

            if (!data.list) {
                errorReport(moduleData.fileName, FUNC, `data.object[${key}].list not exist!`, settingsNumber);
                return null;
            }

        } else {

            if (!data.list) {
                errorReport(moduleData.fileName, FUNC, "settingsNumber no exist list", settingsNumber);
                return null;
            }

        }

        let list = [];

        for (let i = 0; i < data.list.length; i++) {
            const menuOptionObject = data.list[i];
            if (menuOptionObject === null) continue;

            const menuOption = menuOptionObject.val;
            list.push({
                text: getOneListItemLang(settingsNumber, key, menuOption),
                menuOption: menuOption,
                val: i,
                ...(menuOptionObject.isRed && {
                    isRed: menuOptionObject.isRed
                })
            });
        }

        return {
            list: list,
            getValue: () => getEngine().settingsStorage.getValue(settingsNumber, key),
            labelTip: data.labelTip
        }
    };

    const getOneListItemLang = (settingsNumber, key, menuOption) => {
        let keyStr = key ? ("__key_" + key) : "";

        return _t("opt_" + settingsNumber + keyStr + "__menuOption_" + menuOption, null, "SettingsOptions")
    };

    const getOneBitLang = (settingsNumber, key, bitOption) => {
        let keyStr = key ? ("__key_" + key) : "";

        return _t("opt_" + settingsNumber + keyStr + "__bitOption_" + bitOption, null, "SettingsOptions")
    }

    const checkCorrectDataWithKey = (data) => {
        const FUNC = "FUNC";

        if (!data.object) {
            errorReport(moduleData.fileName, FUNC, "data.object not exist!", data);
            return false;
        }


        if (!isset(data)) {
            errorReport(moduleData.fileName, FUNC, `data.object[${key}] not exist!`, data);
            return false;
        }

        return true;
    }

    const getLabelText = (settingsNumber, key) => {
        let keyStr = key ? ("__key_" + key) : "";

        return _t("opt_" + settingsNumber + keyStr, null, "SettingsOptions")
    }

    const getLabelTip = (settingsNumber, key) => {
        let keyStr = key ? ("__key_label-tip_" + key) : "";

        return _t("opt_" + settingsNumber + keyStr, null, "SettingsOptions")
    }

    const getDataToCreateInput = (settingsNumber, key, callback) => {
        key = key ? key : null;

        let data = getInputData(settingsNumber, key);

        if (!data) {
            return
        }

        return {
            settingNumber: settingsNumber,
            settingKey: key,
            labelText: getLabelText(settingsNumber, key),
            labelTip: data.labelTip ? getLabelTip(settingsNumber, key) : null,
            getValue: data.getValue,
            min: data.min,
            max: data.max,
            changeCallback: function(value) {
                getEngine().settingsStorage.sendRequest(settingsNumber, key, value);
                if (callback) {
                    callback(value);
                }
            }
        }
    }

    const getDataToCreateCheckBoxList = (settingsNumber, key, callback) => {

        const FUNC = "getDataToCreateChekboxList"

        key = key ? key : null;

        let data = getCheckBoxListData(settingsNumber, key);

        if (!data) {
            return
        }

        return {
            settingNumber: settingsNumber,
            settingKey: key,
            labelText: getLabelText(settingsNumber, key),
            labelTip: data.labelTip ? getLabelTip(settingsNumber, key) : null,
            bits: data.bits,
            getValue: data.getValue,
            getStatesArray: data.getStatesArray,
            changeCallback: function(statesArray) {

                if (!elementIsArray(statesArray)) {
                    errorReport(moduleData.fileName, FUNC, "it is not array", statesArray);
                    return
                }

                if (statesArray.length != data.bits.length) {
                    errorReport(moduleData.fileName, FUNC, "statesArray != data.bits.length", statesArray);
                    return;
                }

                statesArray.reverse();

                let v = statesArray.reduce((acc, bit, index) => acc | (bit ? 1 : 0) << (statesArray.length - 1 - index), 0);

                getEngine().settingsStorage.sendRequest(settingsNumber, key, v);
                if (callback) {
                    callback(v);
                }
            }
        }
    }

    const getDataToCreateMenu = (settingsNumber, key, callback) => {

        key = key ? key : null;

        let data = getMenuData(settingsNumber, key);

        if (!data) {
            return
        }

        return {
            settingNumber: settingsNumber,
            settingKey: key,
            labelText: getLabelText(settingsNumber, key),
            labelTip: data.labelTip ? getLabelTip(settingsNumber, key) : null,
            getValue: data.getValue,
            list: data.list,
            changeCallback: function(index) {
                getEngine().settingsStorage.sendRequest(settingsNumber, key, index);
                if (callback) {
                    callback(index);
                }
            }
        }
    }

    const getDataToCreateCheckBox = (settingsNumber, key, callback) => {
        key = key ? key : null;

        let data = getCheckBoxData(settingsNumber, key);

        if (!data) {
            return
        }

        return {
            settingNumber: settingsNumber,
            settingKey: key,
            labelText: getLabelText(settingsNumber, key),
            labelTip: data.labelTip ? getLabelTip(settingsNumber, key) : null,
            getValue: data.getValue,
            changeCallback: function(value) {
                getEngine().settingsStorage.sendRequest(settingsNumber, key, value);
                if (callback) {
                    callback(value);
                }
            }
        }
    }


    this.init = init;
    this.isAutoCompareItemsOn = isAutoCompareItemsOn;
    this.isInterfaceAnimationOn = isInterfaceAnimationOn;
    this.isWeatherAndEventEffectsOn = isWeatherAndEventEffectsOn;
    this.isInformAboutFreePlaceInBagOn = isInformAboutFreePlaceInBagOn;
    this.isMapAnimationOn = isMapAnimationOn;
    this.isWarShadowOn = isWarShadowOn;
    this.isBannersOn = isBannersOn;
    this.isAutoCloseBattleOn = isAutoCloseBattleOn;
    this.isExchangeSafeMode = isExchangeSafeMode;
    this.isBattleEffectsOn = isBattleEffectsOn;
    this.isAutoGoThroughGatewayOn = isAutoGoThroughGatewayOn;
    this.isMouseHeroWalkOn = isMouseHeroWalkOn;
    this.isShowItemsRankOn = isShowItemsRankOn;
    this.isLoaderSplashOn = isLoaderSplashOn;
    this.isCycleDayAndNightOn = isCycleDayAndNightOn;
    this.isBerserk = isBerserk;
    this.isBerserkGroup = isBerserkGroup;

    this.getBerserkLvlMin = getBerserkLvlMin;
    this.getBerserkLvlMax = getBerserkLvlMax;
    this.getBerserkCommon = getBerserkCommon;
    this.getBerserkElite = getBerserkElite;
    this.getBerserkElite2 = getBerserkElite2;

    this.getBerserkGroupLvlMin = getBerserkGroupLvlMin;
    this.getBerserkGroupLvlMax = getBerserkGroupLvlMax;
    this.getBerserkGroupCommon = getBerserkGroupCommon;
    this.getBerserkGroupElite = getBerserkGroupElite;
    this.getBerserkGroupElite2 = getBerserkGroupElite2;

    this.getKindOfShowLevelAndOperationLevel = getKindOfShowLevelAndOperationLevel;


    this.getMenuData = getMenuData;
    this.getCheckBoxData = getCheckBoxData;
    this.getCheckBoxListData = getCheckBoxListData;
    this.getInputData = getInputData;


    this.getDataToCreateMenu = getDataToCreateMenu
    this.getDataToCreateCheckBox = getDataToCreateCheckBox
    this.getDataToCreateCheckBoxList = getDataToCreateCheckBoxList
    this.getDataToCreateInput = getDataToCreateInput

    this.getStatesArray = getStatesArray;
    this.checkSettingsNumberExist = checkSettingsNumberExist;
    //this.heroOptExist                   = heroOptExist;

}