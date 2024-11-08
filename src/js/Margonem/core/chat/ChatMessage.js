var ChatData = require('core/chat/ChatData.js');
var Tpl = require('core/Templates');
var ChatMessageWithMarkReplace = require('core/chat/ChatMessageWithMarkReplace');
var MCAddon = require('core/MCAddon');
var SMCAddon = require('core/SMCAddon');
const {
    showProfile
} = require('../HelpersTS');

module.exports = function() {

    let moduleData = {
        fileName: "ChatMessage.js"
    };
    let $chatMsg = null;
    let $cloneChatMsg = null;

    //let commercials                 = null;
    let id = null;
    let ts = null;
    let expiredMessage = null;
    let channel = null;
    let text = null;
    let systemRelatedBusinessCard = null;

    let authorBusinessCard = null;
    let receiverBusinessCard = null;

    let author = null;
    let receiver = null;
    let guest = null;

    let color = null;
    let style = null;

    const init = (data) => {
        initChatMessage();
        initChatMessgeData(data);

        $chatMsg.addClass('chat-' + channel + '-message');

        manageGuestMessage();
        manageExpiredMessage();
        //manageCommercialsMessage();
    };

    const manageGuestMessage = () => {
        if (!guest) {
            return;
        }

        $chatMsg.addClass('guest-message');
    }

    const manageExpiredMessage = () => {
        if (!expiredMessage) return;
        $chatMsg.addClass('expired-message');
    };

    //const manageCommercialsMessage = () => {
    //    if (!commercials) return;
    //    $chatMsg.addClass(`commercials-${commercials}-message`);
    //};

    const appendMessageToChannel = (wasRead) => {
        getEngine().chatController.getChatMessageWrapper().appendMessageToMessageWrapper(channel, author, $chatMsg, wasRead);
    };

    const initChatMessgeData = (data) => {
        id = data.id;
        ts = data.ts;
        //commercials                 = isset(data.commercials) ? data.commercials : null;
        expiredMessage = data.expiredMessage;
        channel = data.channel;
        authorBusinessCard = data.authorBusinessCard;
        receiverBusinessCard = data.receiverBusinessCard;
        text = data.text;
        systemRelatedBusinessCard = isset(data.systemRelatedBusinessCard) ? data.systemRelatedBusinessCard : null;

        if (data.authorBusinessCard) author = authorBusinessCard.getNick();
        if (data.receiverBusinessCard) receiver = receiverBusinessCard.getNick();
        if (data.style) style = data.style;
        if (data.guest) guest = true;
    };

    const initChatMessage = () => {
        $chatMsg = createMessage();
    };

    //const setCloneChatMessage = () => {
    //    $cloneChatMsg = $chatMsg.clone(true);
    //};

    const createMessage = () => {
        return Tpl.get("new-chat-message");
    };

    const updateMessage = () => {
        updateColor();
        updateTsSection();
        updateChannelSection();
        updateAuthorSection();
        updateReceiverSection();
        updateMessageSection();
        updateMessageStyle();
    };

    const updateColor = () => {
        let color = $chatMsg.css("color");

        let chatConfig = getEngine().chatController.getChatConfig();
        let heroMessage = getEngine().hero.d.nick == author;
        let configChannelColor = chatConfig.getChannelColor(channel, heroMessage);


        $chatMsg.css("color", configChannelColor);
    };

    const setSectionDisplay = ($element, state) => {
        let elementVisibleState = $element.css('display') == "inline";

        if (elementVisibleState == state) return;

        let visible = state ? "inline" : "none";

        $element.css("display", visible);
    };

    const updateTsSection = () => {

        let chatConfig = getEngine().chatController.getChatConfig();
        let display = chatConfig.getMessageSectionData(ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY);
        let $tsSection = $chatMsg.find('.ts-section');

        setSectionDisplay($tsSection, display);

        if (!display) return;

        let allUnit = chatConfig.getMessageSectionData(ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.ALL_UNIT);
        let twelveHour = chatConfig.getMessageSectionData(ChatData.MESSAGE_SECTIONS.TS, ChatData.MESSAGE_SUB_SECTIONS.TWELVE_HOUR);
        let formattedTime = ut_time(Math.floor(ts), allUnit, twelveHour);

        $tsSection.html('[' + formattedTime + '] ');
        $tsSection.tip(ut_time(Math.floor(ts), true, twelveHour));
    };

    const updateChannelSection = () => {
        let chatConfig = getEngine().chatController.getChatConfig();
        let display = chatConfig.getMessageSectionData(ChatData.MESSAGE_SECTIONS.CHANNEL_TAG, ChatData.MESSAGE_SUB_SECTIONS.DISPLAY);
        let $channelSection = $chatMsg.find('.channel-section');

        setSectionDisplay($channelSection, display);

        if (!display) return;

        let allTag = chatConfig.getMessageSectionData(ChatData.MESSAGE_SECTIONS.CHANNEL_TAG, ChatData.MESSAGE_SUB_SECTIONS.ALL_TAG);
        //let str     = _t(channel.toLocaleLowerCase(), null, 'chat_lang');
        let str = getEngine().chatController.chatLang(channel.toLocaleLowerCase());
        let html = allTag ? str : str[0];

        $channelSection.html("[" + html + "] ");
        $channelSection.tip(str);
    };

    const checkTownMessage = () => {
        return style == ChatData.SERVER_STYLE.TOWN;
    }

    const updateAuthorSection = () => {
        let $authorSection = $chatMsg.find('.author-section');


        //setSectionDisplay($authorSection, visible);

        //if (!visible) return;

        if (style == ChatData.SERVER_STYLE.ME || !author) $authorSection.css('display', 'none');

        $authorSection.html(author + (receiver ? '' : ': '));

        //if (visible) menageMessageEvent()
        menageMessageEvent()
    };

    const updateReceiverSection = () => {

        let $receiverSection = $chatMsg.find('.receiver-section');
        let $receiverArrowSection = $chatMsg.find('.receiver-arrow-section');

        let visible = receiver ? true : false;

        setSectionDisplay($receiverArrowSection, visible);
        setSectionDisplay($receiverSection, visible);

        if (!visible) return;

        $receiverSection.html(receiver + ': ');

        menageMessageEvent()


    };

    const menageMessageEvent = () => {
        let clickData = getClickData();

        if (!clickData) return;

        attachClickMessage(clickData)
    };

    const getClickData = (systemMessageWithMarkData) => {

        if (channel == ChatData.CHANNEL.SYSTEM || channel == ChatData.CHANNEL.CLAN && systemMessageWithMarkData) {
            if (systemMessageWithMarkData) return {
                id: systemMessageWithMarkData.id,
                acc: systemMessageWithMarkData.acc,
                nick: systemMessageWithMarkData.nick,
                prof: systemMessageWithMarkData.prof,
                icon: systemMessageWithMarkData.icon,
                lvl: systemMessageWithMarkData.lvl,
                $clickField: systemMessageWithMarkData.$clickField
            };

            return null;
        }

        let heroNick = getEngine().hero.d.nick;


        if (channel == ChatData.CHANNEL.PRIVATE) {

            if (author == heroNick) {
                return {
                    id: receiverBusinessCard.getId(),
                    acc: receiverBusinessCard.getAcc(),
                    nick: receiver,
                    prof: receiverBusinessCard.getProf(),
                    icon: receiverBusinessCard.getIcon(),
                    lvl: receiverBusinessCard.getLvl(),
                    $clickField: $chatMsg.find('.receiver-section')
                };
            } else {
                return {
                    id: authorBusinessCard.getId(),
                    acc: authorBusinessCard.getAcc(),
                    nick: author,
                    prof: authorBusinessCard.getProf(),
                    icon: authorBusinessCard.getIcon(),
                    lvl: authorBusinessCard.getLvl(),
                    $clickField: $chatMsg.find('.author-section')
                };
            }

        }

        if (author == heroNick) return null;

        let dataBusinessCard = null;

        if (author) dataBusinessCard = authorBusinessCard;
        else dataBusinessCard = receiverBusinessCard;

        return {
            id: dataBusinessCard ? dataBusinessCard.getId() : null,
            acc: dataBusinessCard ? dataBusinessCard.getAcc() : null,
            nick: author,
            prof: dataBusinessCard ? dataBusinessCard.getProf() : null,
            icon: dataBusinessCard ? dataBusinessCard.getIcon() : null,
            lvl: dataBusinessCard ? dataBusinessCard.getLvl() : null,
            $chatMessage: $chatMsg,
            $clickField: $chatMsg.find('.author-section')
        };
    };

    const attachClickMessage = (clickData) => {
        clickData.$clickField.addClass('click-able');

        clickData.$clickField.on('click', function() {

            getEngine().chatController.getChatInputWrapper().setPrivateMessageProcedure(clickData.nick);
        });

        clickData.$clickField.on('contextmenu', function(e, mE) {
            console.log(clickData);
            let menu = [];

            let $clickMsg = $(this).parent().parent();
            replyItem(clickData.nick, menu);
            goToGroupOrClan($clickMsg, menu);
            putNickInInput(clickData.nick, menu);
            showEq(clickData.id, clickData.nick, clickData.prof, clickData.icon, clickData.lvl, clickData.acc, menu);
            addToFriends(clickData.nick, menu);
            addToEnemies(clickData.nick, menu);
            addToParty(clickData.id, menu);
            showPlayerProfile(clickData.acc, clickData.id, menu);
            checkSmc(clickData.nick, menu);

            //e.preventDefault();

            let newE = getE(e, mE);

            //newE.clientX += 330;
            //newE.clientX += 330;
            getEngine().interface.showPopupMenu(menu, newE);
        });

        //clickData.$clickField.tip('Priv message to: ' + clickData.nick);
        clickData.$clickField.tip(getEngine().chatController.chatLang('privMessageTo') + clickData.nick);
    };

    const showEq = (id, nick, prof, icon, lvl, account, menu) => {
        menu.push([_t('show_eq'), function() {
            Engine.showEqManager.update({
                id,
                nick,
                prof,
                icon,
                lvl,
                account
            });
        }]);
    };

    const addToFriends = (nick, menu) => {
        menu.push([_t('invite_to_friend'), function() {
            addToFriendsRequest(nick);
        }]);
    };

    const addToEnemies = (nick, menu) => {
        menu.push([_t('add_to_enemies'), function() {
            addToEnemiesRequest(nick);
        }]);
    }

    const addToParty = (playerId, menu) => {
        menu.push([_t('team_invite', null, 'menu'), function() {
            _g('party&a=inv&id=' + playerId);
        }]);
    }

    const showPlayerProfile = (accountId, playerId, menu) => {
        menu.push([
            _t('show_profile', null, 'menu'),
            () => showProfile(accountId, playerId)
        ]);
    }


    const addToFriendsRequest = (nick) => {
        _g('friends&a=finvite&nick=' + nick.trim().split(' ').join('_'));
    }

    const addToEnemiesRequest = (nick) => {
        _g('friends&a=eadd&nick=' + nick.trim().split(' ').join('_'));
    }

    const replyItem = (nick, menu) => {
        menu.push([_t('send_message', null, 'chat'), function() {
            getEngine().chatController.getChatInputWrapper().setPrivateMessageProcedure(nick);
        }]);
    };

    const goToGroupOrClan = function($msg, menu) {
        if ($msg.hasClass(ChatData.CHANNEL.CLAN + '-channel-in-' + ChatData.CHANNEL.GLOBAL + '-channel')) {
            menu.push([_t('to-clan'), function() {
                getEngine().chatController.getChatWindow().setChannel(ChatData.CHANNEL.CLAN);
            }]);
        }

        if ($msg.hasClass(ChatData.CHANNEL.GROUP + '-channel-in-' + ChatData.CHANNEL.GLOBAL + '-channel')) {
            menu.push([_t('to-group'), function() {
                getEngine().chatController.getChatWindow().setChannel(ChatData.CHANNEL.GROUP);
            }]);
        }
    };

    const putNickInInput = (nick, menu) => {
        menu.push([_t('player_nick', null, 'clan'), function() {
            //debugger;
            getEngine().chatController.getChatInputWrapper().addToInput(nick + '&nbsp;', true);
        }]);
    };

    const checkSmc = (nick, menu) => {
        var rights = getEngine().hero.d.uprawnienia;
        if (rights == 0) return;
        if (nick == getEngine().hero.d.nick || nick == 'System') return;

        menu.push(['MC Panel', function() {
            if (!getEngine().mcAddon) {
                getEngine().mcAddon = new MCAddon(self);
                getEngine().mcAddon.init();
            }
            getEngine().mcAddon.update(nick);
        }]);

        if (rights == 4 || rights == 16) {
            menu.push(['SMC Panel', function() {
                if (getEngine().smcAddon) getEngine().smcAddon.close();
                getEngine().smcAddon = new SMCAddon(nick);
                getEngine().smcAddon.init();
            }]);
        }
    };


    const updateMessageSection = () => {
        let isSystem = channel == ChatData.CHANNEL.SYSTEM;
        let isClan = channel == ChatData.CHANNEL.CLAN;
        let isCommercial = channel == ChatData.CHANNEL.COMMERCIAL;
        let isTownMessage = checkTownMessage();
        let nodes;

        if (isSystem) nodes = getReplaceNodes(text, true, true);
        if (isClan && systemRelatedBusinessCard) nodes = getReplaceNodes(text, true, true);
        if (isCommercial) nodes = parseChatBB(text);
        if (!nodes) nodes = getReplaceNodes(text, false, !isTownMessage);

        $chatMsg.find('.message-section').html(nodes);
    };

    const updateMessageStyle = () => {
        if (!style) return;

        $chatMsg.find('.message-part').addClass('special-style-' + style);
        $chatMsg.addClass('wrapper-special-style-' + style);
    };


    const getReplaceNodes = (_text, parseBB, parseMessageMark) => {

        if (parseBB) _text = parseChatBB(_text);

        let nodes = [createTextNode(_text, parseBB)];

        for (let i = 0; i < nodes.length; i++) {

            let textNode = nodes[i];
            let textContent = textNode.textContent;

            if (textNode.nodeName != '#text') {

                if (textNode.hasClass("mark-message-span")) continue;
                else {

                    if (parseBB) textContent = textNode.html();
                    else textContent = textNode.text();

                }

            }

            if (checkMessageHaveLink(textContent)) {
                deleteIndexFromArray(nodes, i);
                parseMessageWithLink(i, nodes, textContent, parseBB);
                i--;
                continue;
            }

            if (getEngine().chatLinkedItemsManager.checkReceiveMessageHaveLinkedItem(textContent, false)) {
                deleteIndexFromArray(nodes, i);
                addToArray(i, nodes, getEngine().chatLinkedItemsManager.parseReceiveMessageWithLinkedItem(textContent, false, parseBB));
                i--;
                continue;
            }

            if (checkSystemMessageMark(textContent)) {
                deleteIndexFromArray(nodes, i);
                addToArray(i, nodes, parseMessageWithSystemMark(i, nodes, textContent, parseBB));
                i--;
                continue;
            }

            if (parseMessageMark && checkMessageMark(textContent)) {
                deleteIndexFromArray(nodes, i);
                addToArray(i, nodes, parseMessageWithMark(i, nodes, textContent, parseBB));
                i--;
                continue;
            }

        }

        return nodes;
    };

    const isEmoMark = (oneMarkData) => {
        return oneMarkData.kind == ChatData.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON;
    }

    const showEmoMark = () => {
        const EMO_ICON = ChatData.MESSAGE_MARK_REGEXP_KINDS.EMO_ICON;
        const DISPLAY = ChatData.MESSAGE_SUB_SECTIONS.DISPLAY;

        let chatConfig = getEngine().chatController.getChatConfig();

        return chatConfig.getMessageSectionData(EMO_ICON, DISPLAY);
    };

    const checkMessageMark = (textContent) => {

        let messageMark = ChatData.MESSAGE_MARK_REGEXP;
        let additionalData = {};

        for (let k in messageMark) {

            let oneMarkData = messageMark[k];

            //if (display == false && oneMarkData.kind == EMO_ICON) continue;

            if (isEmoMark(oneMarkData) && !showEmoMark()) continue;

            if (checkPatternIsMatch(oneMarkData, textContent, additionalData)) return true;
        }

        return false;
    };

    const checkSystemMessageMark = (textContent) => {
        let isSystem = channel == ChatData.CHANNEL.SYSTEM;
        let isClan = channel == ChatData.CHANNEL.CLAN;
        let isSystemRelatedBusinessCard = isSystem && systemRelatedBusinessCard || isClan && systemRelatedBusinessCard;

        if (!isSystemRelatedBusinessCard) {
            return false;
        }

        let relatedNick = systemRelatedBusinessCard.getNick();
        let additionalData = {
            relatedNick: relatedNick
        };
        let messageMark = ChatData.SYSTEM_MESSAGE_MARK_REGEXP;


        for (let k in messageMark) {

            let oneMarkData = messageMark[k];

            //if (display == false && oneMarkData.kind == EMO_ICON) continue;
            if (isEmoMark(oneMarkData) && !showEmoMark()) continue;

            if (checkPatternIsMatch(oneMarkData, textContent, additionalData)) return true;
        }

        return false;
    };

    const parseMessageWithMark = (startIndex, nodes, textContent, unsecure) => {

        let messageMark = ChatData.MESSAGE_MARK_REGEXP;
        let additionalData = {};

        for (let k in messageMark) {

            let oneMarkData = messageMark[k];

            if (!checkPatternIsMatch(oneMarkData, textContent, additionalData)) continue;

            return ChatMessageWithMarkReplace.parseReceiveMessageWithMark(textContent, oneMarkData, unsecure)
        }


    };

    const parseMessageWithSystemMark = (startIndex, nodes, textContent, unsecure) => {

        let systemMessageMark = ChatData.SYSTEM_MESSAGE_MARK_REGEXP;

        let additionalData = {
            relatedId: systemRelatedBusinessCard.getId(),
            relatedAcc: systemRelatedBusinessCard.getAcc(),
            relatedNick: systemRelatedBusinessCard.getNick(),
            relatedProf: systemRelatedBusinessCard.getProf(),
            relatedIcon: systemRelatedBusinessCard.getIcon(),
            relatedLvl: systemRelatedBusinessCard.getLvl()
        };

        for (let k in systemMessageMark) {

            let oneMarkData = systemMessageMark[k];

            if (!checkPatternIsMatch(oneMarkData, textContent, additionalData)) continue;

            let nodesWithClickSpan = ChatMessageWithMarkReplace.parseReceiveSystemMessageWithMark(textContent, oneMarkData, unsecure, additionalData);

            if (oneMarkData.editMark) attachRelatedNickWithContextMenu(oneMarkData, nodesWithClickSpan, additionalData);

            return nodesWithClickSpan;
        }

    };

    const attachRelatedNickWithContextMenu = (oneMarkData, nodesWithClickSpan, additionalData) => {
        for (let k in nodesWithClickSpan) {
            let $e = nodesWithClickSpan[k];

            if (!$e.hasClass('mark-message-span')) continue;

            oneMarkData.editMark(this, $e, additionalData);
            return
        }
    };

    const attachContextMenuToRelatedNick = ($e, additionalData) => {
        let clickData = getClickData({
            $clickField: $e,
            id: additionalData.relatedId,
            acc: additionalData.relatedAcc,
            nick: additionalData.relatedNick,
            prof: additionalData.relatedProf,
            icon: additionalData.relatedIcon,
            lvl: additionalData.relatedLvl
        });

        attachClickMessage(clickData);
    };

    const checkPatternIsMatch = (oneMarkData, textContent, additionalData) => {

        let myRe = ChatMessageWithMarkReplace.getMyRegExp(oneMarkData, additionalData);

        if (myRe == null) return false;

        let execData = myRe.exec(textContent);

        if (!execData) return false;

        return true;
    }

    const parseMessageWithLink = (startIndex, nodes, textContent, unsecure) => {
        let tokens = linkify.tokenize(textContent);

        for (let k in tokens) {
            let o = tokens[k];

            if (o.isLink) {
                addToArray(startIndex, nodes, createLinkPart(o));
                startIndex++;
            } else {
                let oneText = o.toString();
                addToArray(startIndex, nodes, [createTextNode(oneText, unsecure)]);
                startIndex++;
            }

        }
    };

    const deleteIndexFromArray = (array, index) => {
        array.splice(index, 1);
    };

    const checkMessageHaveLink = (textContent) => {
        let tokens = linkify.tokenize(textContent);

        for (let k in tokens) {
            let o = tokens[k];
            let text = o.toString();
            if (o.type == "url" && checkCorrectlyURL(text)) return true;
            //if (tokens[k].isLink) return true
        }

        return false;
    };

    const checkCorrectlyURL = function(url) {
        var rx = /^(?:(https?:\/\/)|(www\.))/i;
        return rx.test(url);
    };

    const replaceContent = () => {

    };

    const addToArray = (startIndex, a1, a2) => {
        for (let i = 0; i < a2.length; i++) {
            let index = startIndex + i;
            a1.splice(index, 0, a2[i])
        }
    };

    const createLinkPart = (o) => {
        let url = o.toObject('https');

        let whiteListLinData = getWhiteListLink(url.href);

        if (whiteListLinData) return createLinkNodeFromWhiteList(url, whiteListLinData);
        else return createUnsecureLinkNode(url);
    };

    const createLinkNodeFromWhiteList = (url, whiteListLinData) => {
        let $link = $("<span>");
        let styles = null;
        let htmlClass = whiteListLinData.htmlClass;
        let getTip = whiteListLinData.getTip;

        try {
            styles = JSON.parse(whiteListLinData.style);
        } catch (e) {
            errorReport('ChatMessage.js', 'createLinkNodeFromWhiteList', 'Incorrect JSON format!', styles);
        }

        if (htmlClass != null) $link.addClass(htmlClass);
        if (styles != null) $link.css(styles);
        if (getTip != null) $link.tip(getTip());

        $link.addClass('message-mark "mark-message-span');
        $link.text(whiteListLinData.getText());

        $link.click(function() {
            switch (whiteListLinData.linkType) {
                case ChatData.LINK_TYPES.PLAYER_PROFILE:
                    getEngine().iframeWindowManager.newPlayerProfile({
                        staticUrl: url.href
                    })
                    break;
                case ChatData.LINK_TYPES.CLAN_PROFILE:
                    getEngine().iframeWindowManager.newClanPage({
                        staticUrl: url.href
                    })
                    break;
            }
        });

        return [$link];
    };

    const createUnsecureLinkNode = (url) => {
        let $u = $("<u>");

        $u.addClass('link mark-message-span');
        $u.text(url.href);

        $u.click(function() {
            window.goToUrl(url.href);
        });

        return [$u];
    };

    const createTextNode = (text, unsecure) => {
        //return unsecure ? document.createElement('span').innerHTML = text :document.createTextNode(text);
        let element;
        if (unsecure) {
            element = document.createElement('span');
            element.innerHTML = text;
            element = $('<span>').html(text);
            //element.innerHTML = text;
        } else {
            element = document.createTextNode(text);
        }

        return element
    };

    const getWhiteListLink = (url) => {
        let messageLink = ChatData.MESSAGE_LINK_REGEXP;

        for (let k in messageLink) {

            let oneLinkData = messageLink[k];
            let myRe = oneLinkData.getPattern();
            let execData = myRe.exec(url);

            if (execData) return oneLinkData;
        }

        return null;
    };

    const getTextWithNickReplace = (parseText) => {
        let nick = getEngine().hero.d.nick;
        let re = new RegExp('^' + nick + ' | ' + nick + ' | ' + nick + '$|^' + nick + '$', 'ig');

        return parseText.replace(re, ' <b class="yourname">' + nick + '</b> ');
    };

    const getTs = () => {
        return ts;
    };

    const getId = () => {
        return id;
    };

    const getStyle = () => {
        return style;
    };

    const isCodeMessage = () => {
        return false;
    };

    //const getCommercials = () => {
    //    return commercials ? commercials : null;
    //};

    const remove = () => {
        $chatMsg.remove();
        if ($cloneChatMsg) $cloneChatMsg.remove();
    };

    this.init = init;
    this.getTs = getTs;
    this.getId = getId;
    this.getStyle = getStyle;
    this.isCodeMessage = isCodeMessage;
    this.updateMessage = updateMessage;
    //this.getCommercials = getCommercials;
    this.remove = remove;
    this.appendMessageToChannel = appendMessageToChannel;
    this.attachContextMenuToRelatedNick = attachContextMenuToRelatedNick;
}