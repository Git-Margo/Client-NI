const tpl = require('core/Templates');
var ChatData = require('core/chat/ChatData');
var MagicInput3 = require('core/chat/MagicInput3');
var ChatNotificationView = require('core/chat/ChatNotificationView');
var ChatNotificationManager = require('core/chat/ChatNotificationManager');
var ChatConfigureWindow = require('core/chat/ChatConfigureWindow');

module.exports = function() {

    let channelName = ChatData.CHANNEL.GLOBAL;
    let $chatInputWrapper = null;
    let $clearCross = null;
    let magicInput = null;
    let chatNotificationView = null;
    let chatNotificationManager = null;
    let privateReceiver = null;
    let styleMessage = null;
    let chatConfigureWindow = null;


    let mode = null; //todo #30935 //#30932

    const init = () => {
        //return
        resestMode();
        initWrapperElement();
        initMagicInput();
        initChatNotificationManager();
        initChatNotificationView();
        setPrivateStyle();
        appendChatInputWrapper();
        initMenu();
        initBackToDefault();
        initChatConfigWrapper();
        initRemoveMessage();
        initMobilePlug();
        //appendRemoveMessage();
    };

    const initMobilePlug = () => {
        if (!mobileCheck()) return;

        let $typeMobileMessage = $chatInputWrapper.find('.magic-input-wrapper').find('.type-mobile-message');

        $typeMobileMessage.css('display', "block");


        $typeMobileMessage.click(() => {
            focus();
        })
    }

    const initRemoveMessage = () => {
        let clearCrossWrapper;

        $clearCross = $('<div>').addClass('clear-cross');
        $clearCross.tip(_t('reset', null, 'ah_filter_history'));

        $clearCross.on('click', () => {
            setClearCross(false);
            magicInput.setInput('');
        });

        if (mobileCheck()) clearCrossWrapper = getEngine().interface.get$gameWindowPositioner().find('.chat-layer').find('.magic-input-wrapper');
        else clearCrossWrapper = $chatInputWrapper.find('.magic-input-wrapper');

        clearCrossWrapper.append($clearCross);
    };

    //const appendRemoveMessage = () => {
    //    $chatInputWrapper.find('.magic-input-wrapper').append($clearCross);
    //}

    const resestMode = () => {
        setMode(null);
    };

    const initChatConfigWrapper = () => {
        let $b = $('<div>').addClass('chat-config-wrapper-button');

        $b.on('click', function() {

            if (chatConfigureWindow) closeChatConfigureWindow();
            else initChatConfigureWindow();

        });

        //$b.tip(_t("config_button", null, "chat_lang"));
        $b.tip(getEngine().chatController.chatLang("config_button"));

        $chatInputWrapper.find(".chat-config-wrapper").append($b)
    }

    const initChatConfigureWindow = () => {
        chatConfigureWindow = new ChatConfigureWindow();
        chatConfigureWindow.init();
    }

    const closeChatConfigureWindow = () => {
        chatConfigureWindow.closeWindow();
        clearChatConfigureWindow();
    }

    const clearChatConfigureWindow = () => {
        chatConfigureWindow = null;
    }

    const setPrivateStyle = () => {
        const HERO_MSG_COLOR = ChatData.KIND_MESSAGE_COLOR.HERO_MSG_COLOR;
        let color = getEngine().chatController.getChatConfig().getColorMessageData(ChatData.CHANNEL.PRIVATE, ChatData.MESSAGES_COLORS_OPT.EDIT_COLOR, HERO_MSG_COLOR);

        $chatInputWrapper.find(".private-nick").css('color', color);
    };

    const setVisibleBackToDefault = () => {

        let chooseCard = getEngine().chatController.getChatChannelCardWrapper().getActiveChannelName();
        let inputWrapperName = ChatData.INPUT_CHANNEL_HEADER[chooseCard].inputWrapper;
        let visible;

        if (inputWrapperName == ChatData.INPUT_CHANNEL_HEADER[chooseCard].name) visible = chooseCard == channelName ? "none" : "inline-block";
        else visible = channelName == inputWrapperName ? "none" : "inline-block";

        $chatInputWrapper.find(".card-remove").css('display', visible);
    };

    const initBackToDefault = () => {
        //let data = ChatData.INPUT_CHANNEL_HEADER[name];
        //
        //setChannel(data);
        let $cardRemove = $chatInputWrapper.find(".card-remove");
        $cardRemove.on("click", () => {
            //debugger;
            let name = getEngine().chatController.getChatChannelCardWrapper().getActiveChannelName();
            let inputWrapperName = ChatData.INPUT_CHANNEL_HEADER[name].inputWrapper;
            let data = ChatData.INPUT_CHANNEL_HEADER[inputWrapperName];

            setChannel(data);
        });
        $cardRemove.tip(_t('reset', null, 'ah_filter_history'));
    };

    const initMenu = () => {
        $chatInputWrapper.find(".card-name").on("click", (e) => {
            e.stopPropagation();
            togleCardList();
        });
        createMenu();
    };

    const createMenu = (recreate) => {
        let list = ChatData.INPUT_CHANNEL_HEADER;
        let $cardList = $chatInputWrapper.find(".card-list");

        if (recreate) $cardList.empty();

        for (let k in list) {
            createOneChannelElement(list[k], $cardList)
        }

        if (recreate) return;

        $("body").on("click", function(e) {
            if (getVisibleCardList()) hideCardList();
        })
    };

    const createOneChannelElement = (oneChannelData, $cardList) => {

        if (!oneChannelData.menu) return;

        const HERO_MSG_COLOR = ChatData.KIND_MESSAGE_COLOR.HERO_MSG_COLOR;
        const EDIT_COLOR = ChatData.MESSAGES_COLORS_OPT.EDIT_COLOR;

        let channelName = oneChannelData.name;
        let short = oneChannelData.short[_l()];
        let color = getEngine().chatController.getChatConfig().getColorMessageData(channelName, EDIT_COLOR, HERO_MSG_COLOR);
        let $oneChannel = $("<div>").addClass("input-channel-item").html(getEngine().chatController.chatLang(oneChannelData.name.toLowerCase()) + ' /' + short);

        $oneChannel.css("color", color);

        oneChannelClickInit($oneChannel, oneChannelData);

        $cardList.append($oneChannel, oneChannelData);
    };

    const updateMenu = () => {
        createMenu(true);

        setPrivateStyle();

        let data = ChatData.INPUT_CHANNEL_HEADER[channelName];
        setChannel(data);
    };

    const oneChannelClickInit = ($oneChannel, oneChannelData) => {
        $oneChannel.on("click", function() {
            setChannel(oneChannelData);
        })
    };

    const setChannel = (oneChannelData, _privateReciver, _styleMessage, ignoreCheckCardCanChoose) => {
        const HERO_MSG_COLOR = ChatData.KIND_MESSAGE_COLOR.HERO_MSG_COLOR;
        const EDIT_COLOR = ChatData.MESSAGES_COLORS_OPT.EDIT_COLOR;

        let name = oneChannelData.name;
        let color = getEngine().chatController.getChatConfig().getColorMessageData(name, EDIT_COLOR, HERO_MSG_COLOR);

        if (!ignoreCheckCardCanChoose) {
            if (!getEngine().chatController.getChatChannelsAvailable().checkAvailableProcedure(name)) return;
        }

        privateReceiver = _privateReciver ? _privateReciver : null;
        styleMessage = _styleMessage ? _styleMessage : null;
        channelName = name;

        setCardHeader(name);
        setColorCardName(color);
        setVisibleBackToDefault();
        setPrivateReceiverHeader(privateReceiver);
        setStyleMessageHeader(styleMessage);
        //hideCardList();

        chatNotificationManager.setVisible(channelName);

        magicInput.setColorInput(color)
    };

    const setColorCardName = (color) => {
        $chatInputWrapper.find(".card-name").css("color", color);
    };

    const getVisibleCardList = () => {
        return $chatInputWrapper.find(".card-list").css('display') != "none"
    };


    const initChatNotificationView = () => {
        chatNotificationView = new ChatNotificationView();
        chatNotificationView.init($chatInputWrapper.find('.chat-notification-wrapper'));
    }

    const initChatNotificationManager = () => {
        chatNotificationManager = new ChatNotificationManager();
        chatNotificationManager.init();
    }

    const createMobileSendMessage = () => {
        let button = createButton(_t('send_message', null, "chat"), ['small', 'green'], () => {
            sendCallback(getEscapeVal());
        });

        getEngine().interface.get$gameWindowPositioner().find('.chat-layer').find(".send-mobile-message-wrapper").append($(button));
    };

    const initMagicInput = () => {
        magicInput = new MagicInput3();

        let $magicInputWrapper;

        let isMobile = mobileCheck();
        let $chatLayer = getEngine().interface.get$gameWindowPositioner().find('.chat-layer');

        if (isMobile) {
            $magicInputWrapper = $chatLayer.find(".mobile-magic-input-wrapper");
            createMobileSendMessage();
        } else {
            $magicInputWrapper = $chatInputWrapper.find('.magic-input-wrapper');
        }

        magicInput.init(
            $magicInputWrapper,
            ChatData.INPUT_REGEXP,
            ChatData.CHANNEL_INPUT_DATA,
            //getEngine().chatController.chatLang("chat_placeholder"),
            _t("enter_to_chat", null, "chat"),
            sendCallback,
            changeInputCallback
        )
    };

    const changeInputCallback = (clear) => {
        getEngine().chatController.getChatMessageWrapper().updateScroll();
        setClearCross(!clear);
    }

    const setClearCross = (newDisplay) => {
        let currentDisplay = $clearCross.css('display');

        if (currentDisplay == 'none' && newDisplay) {
            $clearCross.css('display', 'block');
            return
        }

        if (currentDisplay == 'block' && !newDisplay) {
            $clearCross.css('display', 'none');
            return
        }
    }

    const checkDice = (val) => {
        let r = new RegExp('^\/dice(\\s{1}|\&nbsp;)([0-9]+)', "g");
        let result = r.exec(val);

        return result;
    }

    const checkLevel = (val) => {
        let r = new RegExp('^\/lvl(\\s{1}|\&nbsp;)([ÄÄÄÄÄÄÅÅÅÅÃÃ³ÅÅÅ¹ÅºÅ»Å¼A-Za-z\_]+)', "g");
        let result = r.exec(val);

        return result;
    }

    const isClsVal = (val) => {
        return val == '/cls';
    }

    const isClsAllVal = (val) => {
        return val == '/clsall';
    }

    const isChatCommand = (val, withoutFuckingCrazyDiceWhichSooMuchExceptional) => {
        if (isClsVal(val)) return true;
        if (isClsAllVal(val)) return true;
        if (checkLevel(val)) return true;

        if (!withoutFuckingCrazyDiceWhichSooMuchExceptional && checkDice(val)) return true;

        return false;
    }

    const checkIncorrectSlash = (val) => {
        if (isChatCommand(val)) return false;

        return val[0] == "/";
    }

    const getDataAndSendRequest = (val) => {
        let dataToSend = getDataToSend();

        sendRequest(
            dataToSend.channelRequest,
            dataToSend.reciverRequest,
            dataToSend.styleRequest,
            val
        );
    };

    const alertOfGetItemsFromAnotherWorld = (str) => {
        let msg = _t("item_from_another_world");
        confirmWithCallback({
            msg: msg,
            clb: () => {
                getDataAndSendRequest(str);
                clearInput();
            }
        });
    };

    const sendCallback = (val, notClearInput) => {
        if (!checkValToSendIsCorrect(val)) return;

        let chatLinkedItemsManager = getEngine().chatLinkedItemsManager;
        let isLinkedItem = chatLinkedItemsManager.checkSendMessageIsItemLinked(val);

        if (isLinkedItem) {
            val = chatLinkedItemsManager.getReplacedStrWithoutWorldWhereHeroStay(val);
            let isCorrect = chatLinkedItemsManager.checkLinkedItemsAreOnlyFromWorldWhereHeroStay(val);

            if (!isCorrect) {
                alertOfGetItemsFromAnotherWorld(val);
                blur();
                return
            }

        }

        if (mobileCheck()) getEngine().chatController.getChatWindow().setVisibleMobileView(false);
        getDataAndSendRequest(val);

        if (!notClearInput) clearInput();
    };

    const getDataToSend = () => {
        let serverChannelName = getEngine().chatController.getChatDataUpdater().getServerChannelNameByChannelName(channelName);
        let reciverRequest = privateReceiver ? '&receiver=' + privateReceiver.replaceAll(" ", "_") : "";
        let styleRequest = styleMessage ? '&style=' + styleMessage : "";
        let channelRequest = '&channel=' + serverChannelName;

        return {
            serverChannelName: serverChannelName,
            reciverRequest: reciverRequest,
            styleRequest: styleRequest,
            channelRequest: channelRequest
        }
    };

    const sendRequest = (channelRequest, reciverRequest, styleRequest, val) => {
        _g('chat' + channelRequest + reciverRequest + styleRequest, false, {
            c: val
        });
    };

    const setLinkedItem = (hid) => {
        let linkedItem = `ITEM#${hid} `;

        if (mobileCheck()) {
            getEngine().chatController.getChatWindow().setVisibleMobileView(true);
            addToInput(linkedItem, true); //todo mobile input ....
        } else {
            addToInput(linkedItem, true);
        }

    };

    const checkValToSendIsCorrect = (val) => {
        if (val == '') return false;
        if (val.trim() == '') return false;

        if (checkIncorrectSlash(val)) {
            //message("incorect slash!");
            message(_t("4501002_EChatBroadcastError_InvalidCharacters", null, "MessageController"));
            return false;
        }

        if (channelName == ChatData.CHANNEL.PRIVATE && privateReceiver == null) {
            //if (checkBreak(val)) {
            if (!isChatCommand(val)) {
                message(getEngine().chatController.chatLang("private_reciver_not_exist"));
                return false
            }
        }

        if (channelName == ChatData.CHANNEL.SYSTEM) {
            //if (checkBreak(val)) {
            if (!isChatCommand(val)) {
                message(getEngine().chatController.chatLang("can_not_send_msg_on_system"));
                return false
            }
        }

        if (chatNotificationManager.checkBlockadeLeftSeconds(channelName)) {
            if (!isChatCommand(val, true)) {
                message(getEngine().chatController.chatLang("toFastMessageSendOn") + getEngine().chatController.chatLang(channelName.toLocaleLowerCase()));
                return false
            }
        }

        if (privateReceiver && privateReceiver.toLocaleLowerCase() == getEngine().hero.d.nick.toLocaleLowerCase()) {
            message(_t('can_not_send_message_to_yourself'));
            return false
        }

        return true;
    };

    const initWrapperElement = () => {
        $chatInputWrapper = tpl.get("chat-input-wrapper");
    };

    const appendChatInputWrapper = () => {
        let $chatWindow = getEngine().chatController.getChatWindow().get$chatWindow()

        $chatWindow.find(".chat-input-wrapper").replaceWith($chatInputWrapper);
    };

    const setCardHeader = (headerName) => {
        //console.log(`set input header ${headerName}`);
        //$chatInputWrapper.find(".card-name").html(_t(headerName.toLowerCase(), null, 'chat_lang'))
        $chatInputWrapper.find(".card-name").html(getEngine().chatController.chatLang(headerName.toLowerCase()))
    };

    const setPrivateReceiverHeader = (_privateReceiver) => {
        $chatInputWrapper.find(".private-nick").html(_privateReceiver ? _privateReceiver.replaceAll("_", " ") : '');
    };

    const setStyleMessageHeader = (_styleMessage) => {
        $chatInputWrapper.find(".style-message").html(_styleMessage ? _styleMessage : '');
    };

    const showCardList = () => {
        $chatInputWrapper.find(".card-list").css('display', 'block');
    };

    const hideCardList = () => {
        $chatInputWrapper.find(".card-list").css('display', 'none');
    };

    const togleCardList = () => {
        if (getVisibleCardList()) hideCardList();
        else showCardList();
    }

    const getVal = () => {
        return magicInput.getFullInputVal();
    }

    const getEscapeVal = () => {
        return magicInput.getEscapeFullInputVal()
    }

    const getChannelName = () => {
        return channelName
    }

    const getPrivateReceiver = () => {
        return privateReceiver
    }

    const getStyleMessage = () => {
        return styleMessage
    }

    const getChatNotificationManager = () => {
        return chatNotificationManager
    };

    const getChatNotificationView = () => {
        return chatNotificationView
    };

    const setMode = (_mode) => {
        mode = _mode;
    };

    const clearInput = () => {
        magicInput.clearMagicInput();
    }

    const focus = () => {

        if (mobileCheck()) getEngine().chatController.getChatWindow().setVisibleMobileView(true);

        magicInput.focus();
    };

    const setBlockNearOnEnterUp = () => {
        magicInput.setBlockNearOnEnterUp(true);
    }

    const blur = () => {

        if (mobileCheck()) getEngine().chatController.getChatWindow().setVisibleMobileView(false);

        magicInput.blur();
    };

    const isFocus = () => {
        magicInput.isFocus();
    };

    const setInput = (val) => {
        magicInput.setInput(val);
    };

    const addToInput = (val, pleaseFocus) => {
        let v = getVal();
        let newVal = null;

        if (v == '') newVal = val;
        else {
            let length = v.length;
            let lastChar = v[length - 1];

            if (lastChar == " ") newVal = v + val;
            else newVal = v + " " + val;
        }

        setInput(newVal);
        if (!pleaseFocus) return;
        magicInput.setCaretOnTheEndOfInput();
    };

    const setPrivateMessageProcedure = (nick) => {
        focus();
        setChannel(ChatData.INPUT_CHANNEL_HEADER.PRIVATE, nick);
        magicInput.setCaretOnTheEndOfInput();
    };

    const sendMessageGhostMessageProcedure = (text, _channelName) => { // message without change input val
        let tempChannel = channelName;


        setChannel(ChatData.INPUT_CHANNEL_HEADER[_channelName]);
        sendCallback(text, true);
        setChannel(ChatData.INPUT_CHANNEL_HEADER[tempChannel]);
    };

    this.init = init;
    this.setChannel = setChannel;
    this.clearInput = clearInput;
    this.focus = focus;
    this.setBlockNearOnEnterUp = setBlockNearOnEnterUp;
    this.blur = blur;
    this.isFocus = isFocus;
    this.setInput = setInput;
    this.addToInput = addToInput;
    this.setPrivateMessageProcedure = setPrivateMessageProcedure;
    this.getVal = getVal;
    this.getChannelName = getChannelName;
    this.getPrivateReceiver = getPrivateReceiver;
    this.getStyleMessage = getStyleMessage;
    this.clearChatConfigureWindow = clearChatConfigureWindow;
    this.getChatNotificationManager = getChatNotificationManager;
    this.getChatNotificationView = getChatNotificationView;
    this.getDataAndSendRequest = getDataAndSendRequest;
    this.setLinkedItem = setLinkedItem;
    this.sendMessageGhostMessageProcedure = sendMessageGhostMessageProcedure;
    this.updateMenu = updateMenu;

}