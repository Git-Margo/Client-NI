let Templates = require('../Templates');

module.exports = function() {

    let showCard = 0;

    const init = () => {

    }

    const newCard = ($par, label, clb) => {
        let $card = Templates.get('card');
        $card.find('.label').html(label);
        $par.append($card);
        $card.click(function() {

            let index = $(this).index();
            clickCard(index, clb);

        });
    };

    const clickCard = (index, clb) => {
        let content = Engine.auctions.getAuctionWindow().getContent();
        setVisible(index);
        Engine.auctions.getAuctionWindow().updateScroll();

        if (clb) clb();
    }

    const setVisible = (index) => {
        let content = Engine.auctions.getAuctionWindow().getContent();
        let $allC = content.find('.card').removeClass('active');
        let $bottomBar = content.find('.bottom-bar');
        let $allS = content.find('.section').removeClass('visible');

        $allC.eq(index).addClass('active');
        $allS.eq(index).addClass('visible');

        $bottomBar.children().css('display', 'none');
        $bottomBar.children().eq(index).css('display', 'block');
        showCard = index;
    };


    // this.setFirstCard = setFirstCard;
    this.init = init;
    this.clickCard = clickCard;
    this.newCard = newCard;
}