var ChatData = require('@core/chat/ChatData.js');
var ChatConfig = require('@core/chat/ChatConfig.js');
var ChatInputWrapper = require('@core/chat/ChatInputWrapper');
var ChatChannelCardWrapper = require('@core/chat/ChatChannelCardWrapper');
var ChatMessageWrapper = require('@core/chat/ChatMessageWrapper');
var ChatWindow = require('@core/chat/ChatWindow');
var ChatMessage = require('@core/chat/ChatMessage');
var ChatChannelsAvailable = require('@core/chat/ChatChannelsAvailable');
var ChatPrivateMessageData = require('@core/chat/ChatPrivateMessageData');
var ChatDataUpdater = require('@core/chat/ChatDataUpdater');
var ServerStorageData = require('@core/storage/ServerStorageData.js');

module.exports = function() {

    let chatConfig = null;
    let chatInputWrapper = null;
    let chatChannelsAvailable = null;
    let chatPrivateMessageData = null;
    let chatChannelCardWrapper = null;
    let chatMessageWrapper = null;
    let chatDataUpdater = null;
    let chatWindow = null;
    let messageList = null;

    const init = () => {
        initObjects();

        chatWindow.setChannel(ChatData.CHANNEL.GLOBAL);
    };

    const initObjects = () => {
        chatDataUpdater = new ChatDataUpdater();
        chatPrivateMessageData = new ChatPrivateMessageData();
        chatChannelsAvailable = new ChatChannelsAvailable();
        chatConfig = new ChatConfig();
        chatInputWrapper = new ChatInputWrapper();
        chatChannelCardWrapper = new ChatChannelCardWrapper();
        chatMessageWrapper = new ChatMessageWrapper();
        chatWindow = new ChatWindow();


        chatDataUpdater.init();
        chatChannelsAvailable.init();
        chatPrivateMessageData.init();
        chatWindow.init();
        chatConfig.init();
        chatInputWrapper.init();
        chatChannelCardWrapper.init();
        chatMessageWrapper.init();

        initMessageList();
    };

    const initMessageList = () => {

        messageList = {};

        let CHANNEL = ChatData.CHANNEL;
        for (let channelName in CHANNEL) {
            messageList[channelName] = {};
        }
    };

    const rebuiltMessage = () => {
        chatMessageWrapper.clearAllMessageWrapperChannel();
        chatConfig.updateSectionsVisible();
        chatConfig.updateChannelsColor();
        chatConfig.updateMessagesAddToGeneral();
        chatInputWrapper.updateMenu();

        let dataUpdater = getEngine().chatController.getChatDataUpdater();
        let mergeMsg = getArrayOfMessageInCorrectOrder();
        let archivedMessage = dataUpdater.getArchivedMessage();

        let sortedMsg = dataUpdater.sortMessage({
            mergeMessage: mergeMsg,
            mergeArchivedMessage: archivedMessage
        });


        for (let k in sortedMsg) {

            if (sortedMsg[k].isCodeMessage()) {

            }

            if (!sortedMsg[k].isCodeMessage()) {
                sortedMsg[k].updateMessage();
                sortedMsg[k].appendMessageToChannel(true);
            }
        }

        chatMessageWrapper.updateScroll()
    };

    const getSortMessage = (allMsg) => {
        let sortable = [];

        for (let k in allMsg) {
            sortable.push(allMsg[k]);
        }

        sortable.sort(function(a, b) {
            return a.getTs() - b.getTs();
        });

        return sortable;
    };

    const getArrayOfMessageInCorrectOrder = () => {
        let allMessage = [];
        for (let channelName in messageList) {
            let oneChannel = messageList[channelName];
            for (let k in oneChannel) {
                allMessage.push(oneChannel[k]);
            }
        }

        return allMessage
    };

    const addMessage = (data) => {

        if (data.id == undefined) {
            errorReport("ChatController.js", "addMessage", "Chat message id == undefined !")
            return
        }

        let messageId = data.id;
        let channelName = data.channel;


        let newMessage = new ChatMessage();

        //console.log(data.authorBusinessCard.getNick());


        if (data.receiverBusinessCard && data.authorBusinessCard && data.authorBusinessCard.getNick() != getEngine().hero.d.nick) chatPrivateMessageData.addReceiveMessageUser(data.authorBusinessCard.getNick());
        if (data.receiverBusinessCard && data.authorBusinessCard && data.authorBusinessCard.getNick() == getEngine().hero.d.nick) chatPrivateMessageData.addSendMessageUser(data.receiverBusinessCard.getNick());

        addToMessageList(newMessage, messageId, channelName);

        if (!data.town) getEngine().chatController.getChatMessageWrapper().manageChatWidgetAmountAfterAddMessage();

        newMessage.init(data);
        newMessage.updateMessage();

        newMessage.appendMessageToChannel(!getEngine().allInit);
    };

    const soundNoticePrivateMessage = (id, channel) => {


        const CHANNEL = ChatData.CHANNEL;

        if (channel != CHANNEL.PRIVATE) {
            return;
        }

        if (getEngine().isInitLoadTime()) {
            return;
        }

        if (!checkMessageExist(id, channel)) {
            return;
        }

        let oneMessage = getMessage(id, channel);

        if (oneMessage.isHeroMessage()) {
            return;
        }

        let sm = getEngine().soundManager;

        if (!sm.getStateSoundNotifById(0)) {
            return;
        }

        sm.createNotifSound(0);
    };



    //const showCommercials = (data, kind) => {
    //    if (!data.length) return;
    //
    //    deleteCommercialMessage(kind);
    //
    //    chatDataUpdater.updateMessages(data);
    //}

    //const deleteCommercialMessage = (kind) => {
    //    let data = messageList[ChatData.CHANNEL.GLOBAL];
    //
    //    for (let k in data) {
    //        let commercials = data[k].getCommercials();
    //        if (commercials && commercials == kind) {
    //            data[k].remove();
    //            delete data[k];
    //        }
    //    }
    //}

    const clearMessageList = (channel) => {
        messageList[channel] = {};
    }

    const checkMessageExist = (id, channel) => {
        return messageList[channel][id] ? true : false;
    };

    const getMessage = (id, channel) => {
        return messageList[channel][id]
    }

    const addToMessageList = (newMessage, id, channel) => {
        messageList[channel][id] = newMessage;
    };

    const getMessageList = () => {
        return messageList;
    }

    const getChatConfig = () => {
        return chatConfig;
    };

    const getChatWindow = () => {
        return chatWindow;
    };

    const getChatInputWrapper = () => {
        return chatInputWrapper;
    };

    const getChatMessageWrapper = () => {
        return chatMessageWrapper;
    };

    const getChatChannelCardWrapper = () => {
        return chatChannelCardWrapper;
    };

    const getChatChannelsAvailable = () => {
        return chatChannelsAvailable;
    };

    const getChatPrivateMessageData = () => {
        return chatPrivateMessageData;
    };

    const getChatDataUpdater = () => {
        return chatDataUpdater;
    };


    const chatLang = (key, parameters) => {
        return _t(key, parameters ? parameters : null, "chat_lang")
    }

    this.init = init;
    //this.showCommercials = showCommercials;
    //this.getChatSizeFromServerStorage = getChatSizeFromServerStorage;
    this.getChatConfig = getChatConfig;
    this.getChatWindow = getChatWindow;
    this.getChatDataUpdater = getChatDataUpdater;
    this.getChatInputWrapper = getChatInputWrapper;
    this.getChatMessageWrapper = getChatMessageWrapper;
    this.getChatChannelCardWrapper = getChatChannelCardWrapper;
    this.getChatChannelsAvailable = getChatChannelsAvailable;
    this.getChatPrivateMessageData = getChatPrivateMessageData;
    this.addMessage = addMessage;
    this.rebuiltMessage = rebuiltMessage;
    this.checkMessageExist = checkMessageExist;
    this.soundNoticePrivateMessage = soundNoticePrivateMessage;
    this.addToMessageList = addToMessageList;
    this.clearMessageList = clearMessageList;
    this.chatLang = chatLang;
    this.getMessageList = getMessageList;

}