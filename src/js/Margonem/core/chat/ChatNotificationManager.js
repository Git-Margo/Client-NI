var ChatData = require('core/chat/ChatData');

module.exports = function() {

    let blockadeLeftSeconds = null;
    let muteLeftSeconds = null;

    const init = () => {
        initBlockadeLeftSeconds();
        initMuteLeftSeconds();
    };

    const initBlockadeLeftSeconds = () => {
        blockadeLeftSeconds = {
            [ChatData.CHANNEL.GLOBAL]: null,
            [ChatData.CHANNEL.LOCAL]: null,
            [ChatData.CHANNEL.TRADE]: null,
            [ChatData.CHANNEL.GROUP]: null,
            [ChatData.CHANNEL.CLAN]: null,
            [ChatData.CHANNEL.PRIVATE]: null
        }
    };

    const initMuteLeftSeconds = () => {
        muteLeftSeconds = {
            [ChatData.CHANNEL.GLOBAL]: null,
            [ChatData.CHANNEL.LOCAL]: null,
            [ChatData.CHANNEL.TRADE]: null,
            [ChatData.CHANNEL.GROUP]: null,
            [ChatData.CHANNEL.CLAN]: null,
            [ChatData.CHANNEL.PRIVATE]: null
        }
    };

    const setMuteLeftSeconds = (channelName, time, blockadeStartClb, blockadeTickClb, blockadeEndClb) => {
        if (checkMuteLeftSeconds(channelName)) clearMuteLeftSeconds(channelName);

        if (blockadeStartClb) blockadeStartClb(channelName);
        if (blockadeTickClb) blockadeTickClb(channelName);

        setMuteTimeout(channelName, time, blockadeTickClb, blockadeEndClb);
    };

    const setBlockadeLeftSeconds = (channelName, time, blockadeStartClb, blockadeTickClb, blockadeEndClb) => {
        if (checkBlockadeLeftSeconds(channelName)) clearBlockadeLeftSeconds(channelName);

        if (blockadeStartClb) blockadeStartClb(channelName);

        setBLockadeTimeout(channelName, time, blockadeTickClb, blockadeEndClb);
    };

    const setBLockadeTimeout = (channelName, time, blockadeTickClb, blockadeEndClb) => {
        let endTs = ts() + time * 1000;
        blockadeLeftSeconds[channelName] = setInterval(function() {

            if (blockadeTickClb) blockadeTickClb();

            if (ts() < endTs) return;

            if (blockadeEndClb) {
                blockadeEndClb(channelName);
                clearBlockadeLeftSeconds(channelName);
            }
        }, 1000);
    };

    const setMuteTimeout = (channelName, time, blockadeTickClb, muteEndClb) => {
        let endTs = ts() + time * 1000;
        muteLeftSeconds[channelName] = setInterval(function() {


            if (blockadeTickClb) blockadeTickClb();

            if (ts() < endTs) return;

            if (muteEndClb) {
                clearMuteLeftSeconds(channelName);
                muteEndClb(channelName);
            }
        }, 1000);
    }

    const checkBlockadeLeftSeconds = (channelName) => {
        return blockadeLeftSeconds[channelName] ? true : false;
    };

    const checkMuteLeftSeconds = (channelName) => {
        return muteLeftSeconds[channelName] ? true : false;
    };

    const clearBlockadeLeftSeconds = (channelName) => {
        //clearTimeout(blockadeLeftSeconds[channelName]);
        clearInterval(blockadeLeftSeconds[channelName]);

        blockadeLeftSeconds[channelName] = null;
    }

    const clearMuteLeftSeconds = (channelName) => {
        //clearTimeout(muteLeftSeconds);
        clearInterval(muteLeftSeconds[channelName]);

        muteLeftSeconds[channelName] = null;
    }

    const setVisible = (inputChannelName) => {
        let chatNotificationView = getEngine().chatController.getChatInputWrapper().getChatNotificationView();
        //
        //let visible                 = checkBlockadeLeftSeconds(inputChannelName);
        //let WATCH                   = ChatData.NOTIFICATION.WATCH;
        //
        //if (visible)    chatNotificationView.turnOnNotification(WATCH);
        //else            chatNotificationView.turnOffNotification(WATCH);

        let WATCH = ChatData.NOTIFICATION.WATCH;
        let MUTE = ChatData.NOTIFICATION.MUTE;

        let aName = [MUTE, WATCH];
        let aVisible = [checkMuteLeftSeconds, checkBlockadeLeftSeconds];

        for (let k in aName) {
            let notifName = aName[k];
            let visible = aVisible[k](inputChannelName);

            if (visible) chatNotificationView.turnOnNotification(notifName);
            else chatNotificationView.turnOffNotification(notifName);

        }

    }

    this.init = init;
    this.setBlockadeLeftSeconds = setBlockadeLeftSeconds;
    this.setMuteLeftSeconds = setMuteLeftSeconds;
    this.checkBlockadeLeftSeconds = checkBlockadeLeftSeconds;
    this.setVisible = setVisible;


}