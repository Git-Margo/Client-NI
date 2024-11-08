var Tpl = require('core/Templates');
var ChatData = require('core/chat/ChatData.js');
var ServerStorageData = require('core/storage/ServerStorageData.js');

module.exports = function() {

    let $chatWindow = null;
    let chatVisible = true;

    const init = () => {
        initChatWindow();
        initCloseMobileOverlay();
        appendChatWindow();
    };

    const initCloseMobileOverlay = () => {
        getEngine().interface.get$gameWindowPositioner().find('.chat-layer').find('.chat-overlay').click(() => {
            setVisibleMobileView(false)
        });
    }

    const initChatWindow = () => {
        $chatWindow = Tpl.get("new-chat-window");
    };

    const appendChatWindow = () => {
        //$('body').append($chatWindow);
        getEngine().interface.get$interfaceLayer().find('.left-column').find('.inner-wrapper').append($chatWindow);
    };

    //const appendMessageToChatWindow = ($msg) => {
    //    $chatWindow.find(".message-wrapper").append($msg);
    //}

    const get$chatWindow = () => {
        return $chatWindow;
    };

    const setChannel = (channelName, _styleMessage, ignoreCheckCardCanChoose) => {
        //let data            = ChatData.INPUT_CHANNEL_HEADER[channelName];
        let styleMessage = _styleMessage ? _styleMessage : null;
        let inputWrapperName = ChatData.INPUT_CHANNEL_HEADER[channelName].inputWrapper;
        let data = ChatData.INPUT_CHANNEL_HEADER[inputWrapperName];

        getEngine().chatController.getChatChannelCardWrapper().setChannelCard(channelName);
        getEngine().chatController.getChatInputWrapper().setChannel(data, null, styleMessage, ignoreCheckCardCanChoose);
        getEngine().chatController.getChatMessageWrapper().setChannelMessageWrapper(channelName);
        getEngine().chatController.getChatMessageWrapper().updateScroll();
        getEngine().chatController.getChatMessageWrapper().setScrollOnBottom();
    };

    const getChatSize = () => {
        return chatVisible ? 1 : 0;
    };

    const manageChatWindowAfterEnter = () => {
        let s = getChatSize();

        if (!s) chatToggle();

        getEngine().chatController.getChatInputWrapper().focus();
        getEngine().chatController.getChatInputWrapper().setBlockNearOnEnterUp();
    };

    const chatToggle = function() {
        const CHAT_KEY = ServerStorageData.CHAT;
        const VISIBLE = ChatData.SERVER_STORAGE.VISIBLE;

        setChatVisible(!chatVisible);

        let data = {
            [CHAT_KEY]: {
                [VISIBLE]: chatVisible
            }
        };

        getEngine().serverStorage.sendData(data);
        rebuildChatAfterToggle();
    };

    const rebuildChatAfterToggle = () => {
        getEngine().interface.setChat();

        if (!getEngine().interface.isShowLeftColumn()) return;

        let chatMessageWrapper = getEngine().chatController.getChatMessageWrapper();

        chatMessageWrapper.resetHideChatMessageCounterAndChatWidgetAmount();
        chatMessageWrapper.setScrollOnBottom();

    };

    const setChatVisible = (_chatVisible) => {
        chatVisible = _chatVisible;
    };

    const setChatOverAdditionalBarPanel = (state) => {
        var bottom = state ? 49 : 0;
        $chatWindow.css('bottom', bottom + 'px');
    };

    const setVisibleMobileView = (state) => {
        getEngine().interface.get$gameWindowPositioner().find('.chat-layer').css('display', state ? 'block' : "none");
    };

    this.init = init;
    this.setChatOverAdditionalBarPanel = setChatOverAdditionalBarPanel;
    this.get$chatWindow = get$chatWindow;
    this.manageChatWindowAfterEnter = manageChatWindowAfterEnter;
    this.setChatVisible = setChatVisible;
    this.chatToggle = chatToggle;
    //this.appendMessageToChatWindow = appendMessageToChatWindow;
    this.setChannel = setChannel;
    this.getChatSize = getChatSize;
    this.setVisibleMobileView = setVisibleMobileView;

};