var BusinessCard = require('@core/businessCards/BusinessCard');

module.exports = function() {

    let businesCards = {};

    const init = () => {

    };

    const updateData = (data) => {
        for (let k in data) {

            let oneCardData = data[k];
            let id = oneCardData.id;
            let cardExist = checkCardExist(id);
            let card = null;

            if (cardExist) card = getCard(id);
            else {
                card = newCard();
                card.init();
                addCard(id, card);
            }

            card.updateData(oneCardData);
        }

    };

    const getCard = (id) => {
        return businesCards[id]
    };

    const newCard = () => {
        return new BusinessCard();
    };

    const checkCardExist = (id) => {
        return businesCards[id] ? true : false;
    };

    const addCard = (id, card) => {
        businesCards[id] = card;
    };

    this.init = init;
    this.updateData = updateData;
    this.getCard = getCard;
    this.checkCardExist = checkCardExist;
    //this.getList = () => {return businesCards}

};