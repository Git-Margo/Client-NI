var ChatData = require('core/chat/ChatData');

module.exports = function() {

    let channelsAvailable = {};

    const init = () => {
        initChannelsAvailable();
    };

    const initChannelsAvailable = () => {
        let channels = ChatData.AVAILABLE;

        for (let k in channels) {
            channelsAvailable[k] = channels[k];
        }
    }

    const setAvailable = (channelName, state) => {
        if (!isset(channelsAvailable[channelName])) {
            errorReport('ChatChannelAvailable.js', 'setAvailable', 'channelName: ' + channelName + ' not exist in ', channelsAvailable);
            return
        }

        channelsAvailable[channelName] = state;
    }

    const checkAvailable = (channelName) => {
        if (!isset(channelsAvailable[channelName])) {
            errorReport('ChatChannelAvailable.js', 'checkAvailable', 'channelName: ' + channelName + ' not exist in ', channelsAvailable);
            return
        }

        return channelsAvailable[channelName] ? true : false;
    }

    const checkAvailableProcedure = (channelName) => {

        if (!checkAvailable(channelName)) {
            let chanelStr = getEngine().chatController.chatLang(channelName.toLowerCase());
            if (getAlreadyInitialised()) message(getEngine().chatController.chatLang("channel_not_available", {
                "%channel%": chanelStr.toLowerCase()
            }));
            return false
        }

        return true
    };

    this.init = init;
    this.setAvailable = setAvailable;
    this.checkAvailableProcedure = checkAvailableProcedure;
    this.checkAvailable = checkAvailable;

}