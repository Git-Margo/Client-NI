const tpl = require('@core/Templates');
var ChatData = require('@core/chat/ChatData');
var ServerStorageData = require('@core/storage/ServerStorageData.js');

module.exports = function() {

    let $chatChannelCardWrapper = null;
    let counter = {};
    let activeChannelName;

    const init = () => {
        init$chatChannelCardWrapper();
        appendChatChannelCardWrapper();
        initChatChannelCards();
        initCounterChannel();
    };

    const init$chatChannelCardWrapper = () => {
        $chatChannelCardWrapper = tpl.get("chat-channel-card-wrapper");
    };



    const appendChatChannelCardWrapper = () => {
        let $chatWindow = getEngine().chatController.getChatWindow().get$chatWindow();

        $chatWindow.find(".chat-channel-card-wrapper").replaceWith($chatChannelCardWrapper);
    };

    const initChatChannelCards = () => {
        let CHANNEL_CARDS = ChatData.CHANNEL_CARDS;
        for (let k in CHANNEL_CARDS) {
            let $chatChannelCard = createChatChannelCard(CHANNEL_CARDS[k]);
            $chatChannelCardWrapper.append($chatChannelCard);
        }
    };

    const initCounterChannel = () => {
        let CHANNEL = ChatData.CHANNEL;
        for (let k in CHANNEL) {
            counter[k] = 0;
        }
    };

    const setChannelCard = (channelName) => {
        activeChannelName = channelName;
        $chatChannelCardWrapper.find('.chat-channel-card').removeClass('active');
        $chatChannelCardWrapper.find(`.${channelName}-channel`).addClass('active')
    };

    const createChatChannelCard = (channelName) => {
        let $chatChannelCard = tpl.get("chat-channel-card");
        $chatChannelCard.addClass(`${channelName}-channel`);

        $chatChannelCard.on("click", function() {

            if (!getEngine().chatController.getChatChannelsAvailable().checkAvailableProcedure(channelName)) return;

            showNotReadElement(channelName, false);
            getEngine().chatController.getChatWindow().setChannel(channelName);

            let CHAT_KEY = ServerStorageData.CHAT;
            let CHANNEL = ChatData.SERVER_STORAGE.CHANNEL;

            getEngine().serverStorage.sendData({
                [CHAT_KEY]: {
                    [CHANNEL]: channelName
                }
            });
        });

        let short = ChatData.INPUT_CHANNEL_HEADER[channelName].short[_l()];
        //let tip     = _t(channelName.toLocaleLowerCase(), null, 'chat_lang') + (short ? ' /' + short + short : '');
        //let tip     = getEngine().chatController.chatLang(channelName.toLocaleLowerCase()) + (short ? ' /' + short + short : '');
        //let tip     = addGeneralText(channelName, getEngine().chatController.chatLang(channelName.toLocaleLowerCase())) + (short ? ' /' + short + short : '');
        let tip = getEngine().chatController.chatLang(channelName.toLocaleLowerCase()) + (short ? ' /' + short + short : '');

        $chatChannelCard.tip(tip);

        return $chatChannelCard
    };

    //const addGeneralText = (channelName, text) => {
    //    switch (channelName) {
    //        case ChatData.CHANNEL_CARDS.GLOBAL :
    //        case ChatData.CHANNEL_CARDS.LOCAL :
    //        case ChatData.CHANNEL_CARDS.TRADE :
    //            return _t('chat_global_tab') + " (" + text + ") ";
    //        default :
    //            return text
    //    }
    //}

    const showNotReadElement = (channelName, state) => {
        let display = state ? "block" : 'none';

        if (state == false) {
            resetNotReadCounter(channelName);
            updateValInChatChannelCounter(channelName);
        }

        $chatChannelCardWrapper.find(`.${channelName}-channel`).find('.chat-channel-not-read-counter').css('display', display);
    };

    const increaseNotReadCounter = (channelName) => {
        counter[channelName]++;
    };

    const resetNotReadCounter = (channelName) => {
        counter[channelName] = 0;
    };

    const updateValInChatChannelCounter = (channelName) => {
        let v = counter[channelName];

        $chatChannelCardWrapper.find(`.${channelName}-channel`).find('.chat-channel-not-read-counter').html(v > 99 ? '+99' : v);
    };

    const getActiveChannelName = () => {
        return activeChannelName;
    };

    const addOneMessageCounterProcedure = (channelName, author, wasRead) => {

        if (wasRead) return;
        if (getEngine().hero.d.nick == author) return;
        //if (author == null)                     return;
        if (activeChannelName == channelName) return;

        let state = getEngine().chatController.getChatConfig().getMessagesAddToGeneralData(channelName, ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD);
        //if (activeChannelName == ChatData.CHANNEL.GLOBAL && state) return;
        if (activeChannelName == ChatData.CHANNEL.GENERAL && state) return;

        increaseNotReadCounter(channelName);
        updateValInChatChannelCounter(channelName);
        showNotReadElement(channelName, true);
    };

    this.init = init;
    this.addOneMessageCounterProcedure = addOneMessageCounterProcedure;
    this.showNotReadElement = showNotReadElement;
    this.setChannelCard = setChannelCard;
    this.getActiveChannelName = getActiveChannelName;

}