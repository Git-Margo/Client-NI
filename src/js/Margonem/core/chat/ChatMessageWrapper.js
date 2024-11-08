const tpl = require('core/Templates');
var ChatData = require('core/chat/ChatData');

module.exports = function() {

    let $chatMessageWrapper;
    let hideChatMessageCounter;

    const init = () => {
        resetHideChatMessageCounter();
        init$chatMessageWrapper();
        append$chatMessageWrapperToChatWindow();
        initAllMessageWrapperChannel();
        initScrollBar();
        updateScroll();
    };

    const increaseHideChatMessageCounter = () => {
        hideChatMessageCounter++;
    };

    const resetHideChatMessageCounter = () => {
        hideChatMessageCounter = 0;
    };

    const resetHideChatMessageCounterAndChatWidgetAmount = () => {
        resetHideChatMessageCounter();
        getEngine().widgetManager.widgets.updateAmount(getEngine().widgetsData.name.CHAT, '');
    };

    const manageChatWidgetAmountAfterAddMessage = () => {

        if (getEngine().getFirstNotInit() === true) return;

        let show = getEngine().interface.isShowLeftColumn();

        if (show) return;

        increaseHideChatMessageCounter();

        getEngine().widgetManager.widgets.updateAmount(getEngine().widgetsData.name.CHAT, (hideChatMessageCounter > 999 ? "+999" : hideChatMessageCounter));
    };

    const initScrollBar = () => {
        $chatMessageWrapper.addScrollBar({
            track: true,
            callback: scrollMove
        });
    };

    const setScrollOnBottom = () => {
        $chatMessageWrapper.trigger('scrollBottom');
    };

    const updateScroll = () => {
        $chatMessageWrapper.trigger('update');
    };

    const scrollMove = (e) => {
        //console.log('scrollmove')
    };

    const initAllMessageWrapperChannel = () => {
        let CHANNEL = ChatData.CHANNEL;
        for (let k in CHANNEL) {
            let $oneChatMessageWrapper = createOneChatMessageWrapper(k);
            $chatMessageWrapper.find('.scroll-pane').append($oneChatMessageWrapper);
        }
    };

    const clearAllMessageFromWrapperByChannelName = (channel) => {
        $chatMessageWrapper.find('.chat-' + channel + '-message').remove()
    };

    const clearAllMessageWrapperChannel = () => {
        $chatMessageWrapper.find('.one-message-wrapper').empty()
    };

    const init$chatMessageWrapper = () => {
        $chatMessageWrapper = tpl.get("chat-message-wrapper");
    };

    const setChannelMessageWrapper = (channelName) => {
        $chatMessageWrapper.find('.one-message-wrapper').removeClass('active');
        $chatMessageWrapper.find(`.${channelName}-message-wrapper`).addClass('active')
    }

    const createOneChatMessageWrapper = (channelName) => {
        let $oneChatMessageWrapper = $('<div>').addClass(`one-message-wrapper`);
        $oneChatMessageWrapper.addClass(`${channelName}-message-wrapper`);


        return $oneChatMessageWrapper
    }

    const append$chatMessageWrapperToChatWindow = (channelName) => {
        let $chatWindow = getEngine().chatController.getChatWindow().get$chatWindow()

        $chatWindow.find(".chat-message-wrapper").replaceWith($chatMessageWrapper);
    };

    const appendMessageToMessageWrapper = (channelName, author, $message, wasRead) => {

        let scrollVisibleBeforeAppend = checkScrollVisible();

        $chatMessageWrapper.find(`.${channelName}-message-wrapper`).append($message);

        if (channelName != ChatData.CHANNEL.GENERAL) {
            //if (channelName != ChatData.CHANNEL.GLOBAL) {

            let state = getEngine().chatController.getChatConfig().getMessagesAddToGeneralData(channelName, ChatData.MESSAGES_ADD_TO_GENERAL_OPT.ADD);
            if (state) {
                let $cloneMessage = $message.clone(true);
                //$cloneMessage.addClass(channelName + '-in-general');
                //$cloneMessage.addClass(channelName + '-channel-in-' + ChatData.CHANNEL.GLOBAL + '-channel');
                $cloneMessage.addClass(channelName + '-channel-in-' + ChatData.CHANNEL.GENERAL + '-channel');
                //$chatMessageWrapper.find(`.${ChatData.CHANNEL.GLOBAL}-message-wrapper`).append($cloneMessage);
                $chatMessageWrapper.find(`.${ChatData.CHANNEL.GENERAL}-message-wrapper`).append($cloneMessage);
            }
        }

        getEngine().chatController.getChatChannelCardWrapper().addOneMessageCounterProcedure(channelName, author, wasRead);

        updateScroll();

        let scrollVisibleAfterAppend = checkScrollVisible();

        if (!getAlreadyInitialised() || !scrollVisibleBeforeAppend && scrollVisibleAfterAppend) setScrollOnBottom();
    };

    const checkScrollVisible = () => {
        return $chatMessageWrapper.hasClass('scrollable');
    }

    this.init = init;
    this.setChannelMessageWrapper = setChannelMessageWrapper;
    this.appendMessageToMessageWrapper = appendMessageToMessageWrapper;
    this.updateScroll = updateScroll;
    this.setScrollOnBottom = setScrollOnBottom;
    this.manageChatWidgetAmountAfterAddMessage = manageChatWidgetAmountAfterAddMessage;
    this.resetHideChatMessageCounterAndChatWidgetAmount = resetHideChatMessageCounterAndChatWidgetAmount;
    this.clearAllMessageWrapperChannel = clearAllMessageWrapperChannel;
    this.clearAllMessageFromWrapperByChannelName = clearAllMessageFromWrapperByChannelName;

}