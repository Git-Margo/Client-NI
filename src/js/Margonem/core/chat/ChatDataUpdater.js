var ChatData = require('@core/chat/ChatData');
let CodeMessageData = require('@core/codeMessage/CodeMessageData');

var ServerStorageData = require('@core/storage/ServerStorageData.js');

module.exports = function() {

    let archivedMessage = [];

    const init = () => {

    };

    const getArchivedMessage = () => {
        return archivedMessage
    };

    const setArchivedMessage = (_archivedMessage) => {
        archivedMessage = _archivedMessage;
    };

    const checkIdMessageIsArchived = (id) => {
        return archivedMessage.includes(id);
    }

    const updateData = (data) => {
        if (isset(data.channels)) updateChannelsData(data.channels);
        if (isset(data.clear)) updateClearMessages(data.clear);
        if (isset(data.muteLeftSeconds)) {
            updateMuteLeftSeconds(data.muteLeftSeconds, ChatData.CHANNEL.GLOBAL);
            updateMuteLeftSeconds(data.muteLeftSeconds, ChatData.CHANNEL.LOCAL);
            updateMuteLeftSeconds(data.muteLeftSeconds, ChatData.CHANNEL.TRADE);
        }
    };

    const mergeServerDataMessageFromAllChannels = (data) => {
        let mergeMessage = [];
        let mergeArchivedMessage = [];

        for (let serverChannelName in data) {
            let oneChannelData = data[serverChannelName];
            let channelName = getChannelNameByServerChannelName(serverChannelName);

            if (oneChannelData.archivedIds) {

                let oneArchivedMsg = oneChannelData.archivedIds;

                for (let k in oneArchivedMsg) {
                    mergeArchivedMessage.push(oneArchivedMsg[k]);
                }

            }

            if (oneChannelData.msg) {

                let oneChannelMsg = oneChannelData.msg;

                for (let k in oneChannelMsg) {
                    let oneMsg = oneChannelMsg[k];
                    oneMsg.channel = channelName;

                    mergeMessage.push(oneMsg)
                }
            }



        }

        return {
            mergeMessage: mergeMessage,
            mergeArchivedMessage: mergeArchivedMessage
        };
    };

    const updateBlockadeFromAllChannels = (data) => {
        for (let serverChannelName in data) {

            let oneChannelData = data[serverChannelName];
            let channelName = getChannelNameByServerChannelName(serverChannelName);

            if (isset(oneChannelData.blockadeLeftSeconds)) updateBlockade(oneChannelData.blockadeLeftSeconds, channelName);
        }
    };

    const updateMessagesFromAllChannels = (data) => {
        if (checkArchiveDataExist(data)) saveArchiveDataFromAllData(data);

        let mergeData = mergeServerDataMessageFromAllChannels(data);

        if (!mergeData.mergeMessage.length) return;

        let sortedMsg = sortMessage(mergeData);

        updateMessages(sortedMsg);
    };

    const checkArchiveDataExist = (data) => {
        let serverLocalName = ChatData.SERVER_CHANNEL[ChatData.CHANNEL.LOCAL];

        return data[serverLocalName] && data[serverLocalName].archivedIds;
    };

    const saveArchiveDataFromAllData = (data) => {
        let serverLocalName = ChatData.SERVER_CHANNEL[ChatData.CHANNEL.LOCAL];

        setArchivedMessage(data[serverLocalName].archivedIds);
    };

    const updateChannelsData = (data) => {
        updateBlockadeFromAllChannels(data);
        updateMessagesFromAllChannels(data)
    };

    const sortMessage = (mergeData) => {
        let sortableNormalMessages = [];
        let sortableArchivedMessages = [];


        let allMsg = mergeData.mergeMessage;
        let mergeArchivedMessage = mergeData.mergeArchivedMessage;

        for (let k in allMsg) {
            let oneMsg = allMsg[k];
            let id = isset(oneMsg.id) ? oneMsg.id : oneMsg.getId();

            if (oneMsg.channel == ChatData.CHANNEL.COMMERCIAL) oneMsg.ts = ts() / 1000;

            if (mergeArchivedMessage.includes(id)) sortableArchivedMessages.push(oneMsg);
            else sortableNormalMessages.push(oneMsg);
        }


        if (sortableArchivedMessages.length) sortArrayByTs(sortableArchivedMessages);
        if (sortableNormalMessages.length) sortArrayByTs(sortableNormalMessages);

        let lastTownIndex = null;

        for (let i = 0; i < sortableNormalMessages.length; i++) {

            let style;
            let snm = sortableNormalMessages[i];
            let issetStyle = isset(snm.style);
            let issetGetStyle = isset(snm.getStyle);

            if (!issetStyle && !issetGetStyle) style = null;
            else {
                if (issetStyle) style = snm.style;
                if (issetGetStyle) style = snm.getStyle();
            }

            if (style == ChatData.SERVER_STYLE.TOWN) lastTownIndex = i;
        }

        if (sortableArchivedMessages.length) {
            if (lastTownIndex == null) {

                for (let i = 0; i < sortableArchivedMessages.length; i++) {
                    sortableNormalMessages.push(sortableArchivedMessages[i]);
                }

                sortArrayByTs(sortableNormalMessages);

            } else {

                for (let i = 0; i < sortableArchivedMessages.length; i++) {
                    addToArrayRecord(sortableNormalMessages, lastTownIndex + i + 1, sortableArchivedMessages[i]);
                }

            }
        }


        return sortableNormalMessages;
    };

    const sortArrayByTs = (sortArray) => {
        sortArray.sort(function(a, b) {
            let aTs = isset(a.ts) ? a.ts : a.getTs();
            let bTs = isset(b.ts) ? b.ts : b.getTs();

            return aTs - bTs;
        });
    }

    const addInOrderToLocalMessage = (localMsgArray, msgToAdd) => {
        let msgToAddTs = msgToAdd.ts;
        let last = null;

        for (let i = 0; i < localMsgArray.length; i++) {

            let localMsg = localMsgArray[i];
            let townMessage = localMsg.style == ChatData.SERVER_STYLE.TOWN;

            if (!townMessage && localMsg.ts > msgToAddTs) {

                if (last == null) localMsgArray.push(msgToAdd);
                else addToArrayRecord(localMsgArray, last, msgToAdd);

                return;
            }

            last = i;
        }

        localMsgArray.push(msgToAdd);
    };

    const updateMessages = (allMsg) => {
        const CHANNEL = ChatData.CHANNEL;

        for (let k in allMsg) {

            let oneMessage = allMsg[k];
            let id = oneMessage.id;
            let channel = oneMessage.channel;
            let isClanMessage = channel == CHANNEL.CLAN;
            let isSystemMessage = channel == CHANNEL.SYSTEM;
            let isCommercial = channel == CHANNEL.COMMERCIAL;
            let idAuthor = oneMessage.sender;
            let idReceiver = isset(oneMessage.receiver) ? oneMessage.receiver : null;
            let guest = isset(oneMessage.guest);
            let isTown = channel == CHANNEL.LOCAL && !isset(idAuthor) && !isset(idAuthor);

            if (getEngine().chatController.checkMessageExist(id, channel)) continue;

            if (isSystemMessage && oneMessage.code || isClanMessage && oneMessage.code) {

                getEngine().chatController.addToMessageList(oneMessage, id, channel);
                let jsonCodeData = JSON.parse(oneMessage.code);

                oneMessage.isCodeMessage = function() {
                    return true
                };
                oneMessage.getTs = function() {
                    return oneMessage.ts
                };
                //oneMessage.getCommercials                       = function () {return null};
                oneMessage.getSystemRelatedBusinessCard = function() {
                    return isset(oneMessage.related && oneMessage.related[0]) ? getEngine().businessCardManager.getCard(oneMessage.related[0]) : null;
                };


                for (let k in jsonCodeData.message) {
                    getEngine().codeMessageManager.updateData(jsonCodeData.message[k], CodeMessageData.SOURCE.CHAT, oneMessage);
                }
                continue
            }

            //let idAuthor                = oneMessage.sender;
            //let idReceiver              = isset(oneMessage.receiver) ? oneMessage.receiver : null;
            let _ts = oneMessage.ts;
            let msg = oneMessage.msg;
            let style = isset(oneMessage.style) ? oneMessage.style : null;
            let authorBusinessCard = getEngine().businessCardManager.getCard(idAuthor);
            let receiverBusinessCard = null;


            if (!authorBusinessCard && !(isSystemMessage || isCommercial || isTown)) {
                errorReport('ChatDataUpdater.js', 'updateMessages', 'authorBusinessCard not exist! Author id:' + idAuthor);
                continue;
            }

            if (idReceiver != null && !isSystemMessage) {
                receiverBusinessCard = getEngine().businessCardManager.getCard(idReceiver);

                if (!receiverBusinessCard) {
                    errorReport('ChatDataUpdater.js', 'updateMessages', 'receiverBusinessCard not exist! Receiver id:' + idReceiver);
                    continue;
                }

            }


            let preparedMessageData = {
                //commercials             : isCommercial ? oneMessage.commercials: null,
                town: isTown,
                ts: _ts,
                guest: guest,
                expiredMessage: checkExpiredMessage(id, _ts),
                id: id,
                style: style,
                channel: channel,
                authorBusinessCard: authorBusinessCard,
                receiverBusinessCard: receiverBusinessCard,
                text: msg
            };

            getEngine().chatController.addMessage(preparedMessageData)

            getEngine().chatController.soundNoticePrivateMessage(id, channel);
        }
    };

    const checkExpiredMessage = (id, _ts) => {
        return checkIdMessageIsArchived(id) || (ts() / 1000) - 10 > _ts;
    };

    const updateClearMessages = (serverChannelName) => {

        if (serverChannelName == "*") {
            for (let channelName in ChatData.CHANNEL) {
                clearOneChannel(channelName);
            }
            return
        }

        clearOneChannel(getChannelNameByServerChannelName(serverChannelName));
    };

    const clearOneChannel = (channelName) => {
        getEngine().chatController.getChatMessageWrapper().clearAllMessageFromWrapperByChannelName(channelName);
        getEngine().chatController.clearMessageList(channelName);
        getEngine().chatController.getChatChannelCardWrapper().showNotReadElement(channelName, false);
        getEngine().chatController.getChatMessageWrapper().updateScroll();
    }

    const updateMuteLeftSeconds = (muteLeftSeconds, channelName) => {

        let chatInputWrapper = getEngine().chatController.getChatInputWrapper();
        let MUTE = ChatData.NOTIFICATION.MUTE;

        let startClb = () => {

            let inputChannelName = chatInputWrapper.getChannelName();
            if (inputChannelName != channelName) return;

            let text = getEngine().chatController.chatLang('MUTE_NEXT_MESSAGE_TIME') + " " + getTimeTip(muteLeftSeconds);

            chatInputWrapper.getChatNotificationView().turnOnNotification(MUTE, text);
        };

        let tickClb = () => {
            muteLeftSeconds--;

            let inputChannelName = chatInputWrapper.getChannelName();
            if (inputChannelName != channelName) return;

            let text = getEngine().chatController.chatLang('MUTE_NEXT_MESSAGE_TIME') + " " + getTimeTip(muteLeftSeconds);

            chatInputWrapper.getChatNotificationView().turnOnNotification(MUTE, text);
        };

        let endClb = () => {
            let inputChannelName = chatInputWrapper.getChannelName();
            if (inputChannelName != channelName) return;

            chatInputWrapper.getChatNotificationView().turnOffNotification(MUTE);
        };

        chatInputWrapper.getChatNotificationManager().setMuteLeftSeconds(channelName, muteLeftSeconds, startClb, tickClb, endClb);

    };

    const getTimeTip = (time) => {
        return getSecondLeft(time, {
            short: true
        }) + " (" + ut_fulltime(ts() / 1000 + time, true, true) + ")";
    }

    const updateBlockade = (blockadeLeftSeconds, channelName) => {

        let chatInputWrapper = getEngine().chatController.getChatInputWrapper();
        let WATCH = ChatData.NOTIFICATION.WATCH;

        if (blockadeLeftSeconds == 0) {
            return
        }

        let startClb = () => {
            let inputChannelName = chatInputWrapper.getChannelName();
            if (inputChannelName != channelName) return;

            let text = getEngine().chatController.chatLang('BLOCKADE_NEXT_MESSAGE_TIME') + " " + getTimeTip(blockadeLeftSeconds);
            chatInputWrapper.getChatNotificationView().turnOnNotification(WATCH, text);
        };

        let tickClb = () => {
            blockadeLeftSeconds--;

            let inputChannelName = chatInputWrapper.getChannelName();
            if (inputChannelName != channelName) return;

            let text = getEngine().chatController.chatLang('BLOCKADE_NEXT_MESSAGE_TIME') + " " + getTimeTip(blockadeLeftSeconds);
            chatInputWrapper.getChatNotificationView().turnOnNotification(WATCH, text);
        };

        let endClb = () => {
            let inputChannelName = chatInputWrapper.getChannelName();
            if (inputChannelName != channelName) return;
            chatInputWrapper.getChatNotificationView().turnOffNotification(WATCH);
        };

        chatInputWrapper.getChatNotificationManager().setBlockadeLeftSeconds(channelName, blockadeLeftSeconds, startClb, tickClb, endClb);
    };

    const getChannelNameByServerChannelName = (serverChannelName) => {
        for (let channelName in ChatData.SERVER_CHANNEL) {
            if (serverChannelName == ChatData.SERVER_CHANNEL[channelName]) return channelName
        }

        errorReport('ChatDataUpdater.js', 'getChannelNameByServerChannelName', 'Incorrect serverChannelName!', serverChannelName);

        return ChatData.CHANNEL.LOCAL;
    }

    const getServerChannelNameByChannelName = (channelName) => {

        let serverChannelName = ChatData.SERVER_CHANNEL[channelName];

        if (serverChannelName) return serverChannelName

        errorReport('ChatDataUpdater.js', 'getChannelNameByServerChannelName', 'Incorrect serverChannelName!', serverChannelName);

        return ChatData.SERVER_CHANNEL.LOCAL;
    }

    const getShortInputChannelData = (data) => {
        let short = null;
        if (isPl()) short = data.short.pl;
        if (isEn()) short = data.short.en;

        return short
    }

    const setDataFromServerStorage = () => {
        let store = getEngine().serverStorage.get(ServerStorageData.CHAT);

        const VISIBLE = ChatData.SERVER_STORAGE.VISIBLE;
        const CHANNEL = ChatData.SERVER_STORAGE.CHANNEL;
        const DATA = ChatData.SERVER_STORAGE.DATA;

        if (!store) return;

        //if (store[CHANNEL]) {
        //    let channelName = store[CHANNEL];
        //
        //    getEngine().chatController.getChatWindow().setChannel(channelName, null, true);
        //}

        if (isset(store[VISIBLE])) {
            let visible = store[VISIBLE];
            getEngine().chatController.getChatWindow().setChatVisible(visible);
        }

        if (store[DATA]) {
            getEngine().chatController.getChatConfig().getDataFromServerStorageAndSetStorageData(store[DATA]);
            getEngine().chatController.rebuiltMessage();
        }

        if (store[CHANNEL]) {
            let channelName = store[CHANNEL];

            getEngine().chatController.getChatWindow().setChannel(channelName, null, true);
        }

    }



    this.init = init;
    this.sortMessage = sortMessage;
    this.getArchivedMessage = getArchivedMessage;
    this.getServerChannelNameByChannelName = getServerChannelNameByChannelName;
    this.getShortInputChannelData = getShortInputChannelData;
    this.setDataFromServerStorage = setDataFromServerStorage;
    this.updateMessages = updateMessages;
    this.updateData = updateData;
    this.checkExpiredMessage = checkExpiredMessage;
}