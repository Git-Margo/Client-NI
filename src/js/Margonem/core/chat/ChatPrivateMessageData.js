module.exports = function() {

    let sendMessageUser = [];
    let receiveMessageUser = [];


    const init = () => {

    };

    const addSendMessageUser = (user) => {
        sendMessageUser.push(user)
    };

    const addReceiveMessageUser = (user) => {
        receiveMessageUser.push(user)
    };

    const getLastUserWhoGetFromHeroPrivateMessage = () => {
        let length = sendMessageUser.length;

        if (!length) null;

        return sendMessageUser[length - 1];
    };

    const getLastUserWhoSendToHeroPrivateMessage = () => {
        let length = receiveMessageUser.length;

        if (!length) null;

        return receiveMessageUser[length - 1];
    };

    this.init = init;
    this.addSendMessageUser = addSendMessageUser;
    this.addReceiveMessageUser = addReceiveMessageUser;
    this.getLastUserWhoSendToHeroPrivateMessage = getLastUserWhoSendToHeroPrivateMessage;
    this.getLastUserWhoGetFromHeroPrivateMessage = getLastUserWhoGetFromHeroPrivateMessage;

};