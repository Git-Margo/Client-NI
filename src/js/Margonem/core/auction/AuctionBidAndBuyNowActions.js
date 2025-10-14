let Templates = require('../Templates');
let AuctionData = require('@core/auction/AuctionData');
const InputMaskData = require('@core/InputMaskData');

module.exports = function() {

    const init = (_$auctionContent) => {

    };

    const getBidCeil = (d) => {
        let bidGold = d.bid_g;
        let bidSl = d.bid_c;

        if (!bidGold && !bidSl) return '';

        let textData = getBidTextData(d);

        if (textData.ownAuction) return getInputCostCeil(textData);

        let color = getColorBidButton(d);
        let clb;

        if (textData.ownBid) clb = null;
        else clb = (inputCostCeil) => {
            bidAlert(d, inputCostCeil)
        };

        let buttonTip = textData.ownBid ? _t('youAreBid') : '';

        return getInputCostCeil(textData, {
            text: _t('bid', null, 'auction'),
            clb: clb,
            color: color,
            buttonTip: buttonTip
        });
    };

    const getMinBid = (price, bidder) => {
        return bidder == AuctionData.BIDDER_VALUES.SOMEBODY_BID ? (Math.ceil((price * 11) / 10)) : price;
    }

    const getBuyNowCeil = (d) => {
        let buyNowGold = d.bo_g;
        let buyNowSl = d.bo_c;

        if (!buyNowGold && !buyNowSl) return '';

        let text = getBuyNowText(d);

        if (d.own_auction) return getCostCeil(text);

        let color = getColorBuyNowButton(d);
        let clb = () => {
            buyNowAlert(d)
        };

        return getCostCeil(text, {
            text: _t('au_price_buynow', null, 'auction'),
            clb: clb,
            color: color
        });
    };

    const getBidTextData = (d) => {
        let bidGold = d.bid_g;
        let bidSl = d.bid_c;
        let bidder = d.bidder;

        let o = {
            fullVal: null,
            strVal: null,
            tip: null
        };

        if (bidGold) {
            let v = getMinBid(bidGold, bidder);
            o.fullVal = v;
            o.strVal = round(v, 3);
            o.currency = '';
            //if (bidder) o.lastBid = bidGold
            if (bidder) o.lastBid = bidGold
        }

        if (bidSl) {
            let v = getMinBid(bidSl, bidder);
            o.fullVal = v;
            o.strVal = v;
            if (bidder) o.lastBid = bidSl
            o.currency = _t("sl")
        }

        if (d.own_auction) o.ownAuction = true;
        if (d.bidder == AuctionData.BIDDER_VALUES.YOU_BID) o.ownBid = true;

        return o;
    }

    const getBuyNowText = (d) => {
        let buyNowGold = d.bo_g;
        let buyNowSl = d.bo_c;

        if (buyNowGold && buyNowSl) return round(buyNowGold, 3) + ' + ' + buyNowSl + _t("sl");
        else {
            if (buyNowGold) return round(buyNowGold, 3);
            if (buyNowSl) return buyNowSl + _t("sl");
        }

        errorReport('AuctionManager', 'getBuyNowText', "option not exist", d)

        return null
    };

    const getColorBidButton = (d) => {
        let bidder = d.bidder;
        let bidGold = d.bid_g;
        let bidSl = d.bid_c;
        let cl = '';

        if (bidder == AuctionData.BIDDER_VALUES.YOU_BID) cl += 'disabled ';

        if (bidGold) return cl + 'green';
        if (bidSl) return cl + 'violet';

        errorReport('AuctionManager', 'getColorBidButton', "option not exist", d);

        return null
    };

    const getColorBuyNowButton = (d) => {
        let buyNowGold = d.bo_g;
        let buyNowSl = d.bo_c;

        if (buyNowGold && buyNowSl) return 'violet';
        else {
            if (buyNowGold) return 'green';
            if (buyNowSl) return 'violet';
        }

        errorReport('AuctionManager', 'getColorBuyNowButton', "option not exist", d);

        return null
    };

    const getInputCostCeil = (textData, buttonData) => {
        let $costInput;
        let $costInputCeil = Templates.get('auction-input-cost-ceil');
        let $auctionCostBtnWrapper = $costInputCeil.find('.auction-cost-btn-wrapper')

        if (textData.ownAuction) {
            $auctionCostBtnWrapper.css('display', 'none');
        }

        if (textData.ownAuction || textData.ownBid) {
            $costInput = $costInputCeil.find('.own-input-cost')
            $costInput.css('display', 'block');
            $costInput.html(textData.strVal);
        } else {
            $costInput = $costInputCeil.find('.input-cost');
            $costInput.css('display', 'table-cell');
            $costInput.val(textData.strVal);
        }

        if (textData.lastBid) {
            let somebodyBid = $('<div>').addClass('somebody-bid');
            somebodyBid.tip(_t('somebody-bid'));
            $costInputCeil.append(somebodyBid);
            $costInput.tip(_t('last_bid') + formNumberToNumbersGroup(textData.lastBid));
        }

        $costInputCeil.find('.auction-cost-currency').html(textData.currency);

        if (!buttonData) return $costInputCeil;

        setInputMask($costInput, InputMaskData.TYPE.NUMBER_WITH_KMG)
        $costInput.attr('full-cost', textData.fullVal);

        $costInput.change(function() {
            $costInput.attr('full-cost', parsePrice($(this).val()));
        });

        let $button = auctionButton(buttonData.text, buttonData.color, () => {
            if (buttonData.clb) buttonData.clb($costInputCeil);
        });

        if (buttonData.buttonTip) $button.tip(buttonData.buttonTip);

        $costInputCeil.find('.auction-cost-btn-wrapper').append($button);

        return $costInputCeil;
    };

    const getCostCeil = (text, buttonData) => {
        let $costCeil = Templates.get('auction-cost-ceil');

        $costCeil.find('.auction-cost-label').html(text);

        if (!buttonData) {
            $costCeil.find('.auction-cost-btn-wrapper').css('display', 'none');
            return $costCeil;
        }

        let $button = auctionButton(buttonData.text, buttonData.color, buttonData.clb);

        $costCeil.find('.auction-cost-btn-wrapper').append($button);

        return $costCeil;
    };

    const getBidAlertString = (bidGold, bidSl, itemId, itemName) => {

        let kind = null;
        let v = null;

        if (bidGold) {
            kind = 'item_confirm_au';
            v = bidGold
        }

        if (bidSl) {
            kind = 'item_confirm_au_sl';
            v = bidSl
        }

        return _t(kind + ' %name% %val%', {
            '%name%': itemName,
            '%price%': formNumberToNumbersGroup(v)
        }, 'auction');
    };

    const getBuyNowAlertString = (buyNowGold, buyNowSl, itemId, itemName) => {
        let str = "";

        if (buyNowGold == 0 && buyNowSl > 1) {

            str = _t('item_confirm_buynow_sl %name% %price%', {
                '%name%': itemName,
                '%price%': formNumberToNumbersGroup(buyNowSl)
            }, 'auction');

        } else if (buyNowGold > 0 && buyNowSl > 0) {

            str = _t('item_confirm_buynow_sl_gold %name% %price% %price2%', {
                '%name%': itemName,
                '%price%': formNumberToNumbersGroup(buyNowSl),
                '%price2%': formNumberToNumbersGroup(buyNowGold)
            }, 'auction');

        } else {

            str = _t("item_confirm_buynow %name% %price%", {
                '%name%': itemName,
                '%price%': formNumberToNumbersGroup(buyNowGold)
            }, 'auction');

        }

        return str;
    };


    const buyNowAlert = (d) => {
        let buyNowGold = d.bo_g == undefined ? 0 : d.bo_g;
        let buyNowSl = d.bo_c == undefined ? 0 : d.bo_c;
        let auctionId = d.id;
        let itemId = d.item_id;
        let itemName = Engine.auctions.getAuctionItems().getItemName(itemId);

        let txt = getBuyNowAlertString(buyNowGold, buyNowSl, itemId, itemName);

        confirmWithCallback({
            msg: txt,
            clb: () => {
                Engine.auctions.getAuctionRequest().buyNowRequest(auctionId);
            }
        })
    };

    const bidAlert = (d, $inputCostCeil) => {
        let bidGold = d.bid_g == undefined ? 0 : d.bid_g;
        let bidSl = d.bid_c == undefined ? 0 : d.bid_c;
        let auctionId = d.id;
        let itemId = d.item_id;
        let itemName = Engine.auctions.getAuctionItems().getItemName(itemId);

        //let val = parsePrice($inputCostCeil.find('.input-cost').val());
        let val = parsePrice($inputCostCeil.find('.input-cost').attr('full-cost'));

        if (checkInputValIsEmptyProcedure(val)) return;
        if (!checkParsePriceValueIsCorrect(val)) return;

        let txt = getBidAlertString(
            bidGold ? val : null,
            bidSl ? val : null,
            itemId,
            itemName
        );

        //console.log(txt, val);
        confirmWithCallback({
            msg: txt,
            clb: () => {
                Engine.auctions.getAuctionRequest().bidRequest(auctionId, val);
            }
        })
    };

    const auctionButton = (text, cl, clb) => {
        var $but = Templates.get('auction-but').addClass('small ' + cl);
        $but.find('.label').html(text);
        $but.on('click', clb);

        return $but;
    };

    this.init = init;
    this.getBuyNowCeil = getBuyNowCeil;
    this.getBidCeil = getBidCeil;


}