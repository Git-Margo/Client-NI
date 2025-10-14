let Templates = require('../Templates');
let AuctionData = require('@core/auction/AuctionData');
let Item = require('@core/items/Item');
const InputMaskData = require('@core/InputMaskData');
const ConfirmationQueue = require('../utils/ConfirmationQueue');
const ItemClass = require('../items/ItemClass');
const {
    Rarities
} = require('../items/ItemRarity');
const Checkbox = require('@core/components/Checkbox');

module.exports = function() {

    let $auctionContent = null;
    let auctionOffButton = null;
    let content = null;
    let auctionOffItem = null;
    let wnd = null;
    let featuredCheckBox = null;

    const init = (_$auctionContent) => {
        // $auctionContent = _$auctionContent;
        $auctionContent = Engine.auctions.getAuctionWindow().getContent();

        initWindow();
        createInputs();
        initRemoveAuctionOffItemEvent();
        createButtonAuctionOff();
        createButtonCloseAuctionOff();
        createSpecialFeatureCheckbox();
        addKeyupEvent();
        prepareCurrencyIcon();
        createPlaceHoldersInInput();
        setTipInElements();
        initLabels();
    }

    const initLabels = () => {
        content.find('.auction-bid').find('.label').html(Engine.auctions.tLang('filter_bid'))
        content.find('.auction-additional-gold-payment').find('.label').html(Engine.auctions.tLang('auction-additional-gold-payment'))
        content.find('.auction-buy-now').find('.label').html(Engine.auctions.tLang('auction-buy-now'))
        content.find('.auction-duration').find('.label').html(Engine.auctions.tLang('auction-duration'))
        content.find('.auction-tax').find('.tax-label').html(Engine.auctions.tLang('auction-tax'))
        content.find('.auction-cost').find('.cost-label').html(Engine.auctions.tLang('auction-cost'))
    }

    const setTipInElements = () => {
        content.find('.buy-info-icon').tip(_t('break_soulbound_info'))
    }

    const createInputs = () => {
        content.find('.auction-bid').append(createNiInput({
            type: InputMaskData.TYPE.NUMBER_WITH_KMG
        }));
        content.find('.auction-additional-gold-payment').append(createNiInput({
            type: InputMaskData.TYPE.NUMBER_WITH_KMG
        }));
        content.find('.auction-buy-now').append(createNiInput({
            type: InputMaskData.TYPE.NUMBER_WITH_KMG
        }));
        content.find('.auction-duration').append(createNiInput({
            type: InputMaskData.TYPE.NUMBER
        }));
    }

    const createPlaceHoldersInInput = () => {
        createInputPlaceholder('Min. 500', content.find('.auction-buy-now').find('input'));
        createInputPlaceholder('Min. 500', content.find('.auction-bid').find('input'));
        createInputPlaceholder('Min. 500', content.find('.auction-additional-gold-payment').find('input'));
        createInputPlaceholder('2-168', content.find('.auction-duration').find('input'));
    }

    const allInputChangeTrigger = () => {
        content.find('.auction-buy-now').find('input').trigger('change');
        content.find('.auction-bid').find('input').trigger('change');
        content.find('.auction-additional-gold-payment').find('input').trigger('change');
        content.find('.auction-duration').find('input').trigger('change');
    }

    const prepareCurrencyIcon = () => {
        let $gold = createSmallGoldIcon(0);
        let $sl = createSmallDraconiteIcon(AuctionData.COST_FEATURED_AUCTION);

        let $auctionCost = content.find('.auction-cost').find('.second-span');

        $auctionCost.append($gold)
        $auctionCost.append($sl)
    }

    const getCheckboxText = (active) => {
        let featuredCount = Engine.auctions.getFeaturedCount();
        let v = featuredCount + (active ? 1 : 0);
        let str = Engine.auctions.tLang('featured_offer')

        return `${str} (${v}/${AuctionData.MAX_FEATURED_COUNT})`;
    }

    const createSpecialFeatureCheckbox = () => {

        let txt = getCheckboxText(false);
        //let $oneCheckbox = createCheckBox(txt, '', () => {
        //
        //    updateCheckbox();
        //    manageVisibleElements(true);
        //});

        featuredCheckBox = new Checkbox.default({
                label: txt,
                i: 'auction',
                checked: false,
                highlight: false
            },
            (state) => {
                updateCheckbox();
                manageVisibleElements(true);
            }
        );


        content.find('.special-offer').append($(featuredCheckBox.getCheckbox()));
    };

    const updateCheckbox = () => {
        let active = getIsFeatured();

        updateCheckBoxLabel(active);
    }

    const updateCheckBoxLabel = (active) => {
        let txt = getCheckboxText(active);

        //content.find('.special-offer').find('.one-checkbox').find('.label').html(txt);
        //content.find('.special-offer').find('.checkbox-custom').find('.c-checkbox__label').html(txt);
        featuredCheckBox.setLabel(txt)
    };

    const manageVisibleElements = (forceDurationChange = false) => {
        let isAuctionOffItem = checkAuctionOffItem();
        let isSoulbound = isAuctionOffItem && auctionOffItem.issetSoulboundStat();
        let active = getIsFeatured()

        if (isAuctionOffItem) {
            let val = getAuctionCostByPatern(auctionOffItem);
            setValOfGoldIconAndVal(val);
            setVisibleGoldIconAndVal(true);

        } else {
            setVisibleGoldIconAndVal(false);
        }

        if (active) {

            if (isSoulbound) {
                setVisibleAdditionalGoldPayment(true);
                setVisibleAdditionalSoulboundPayment(true);
                setVisibleAuctionBid(false);
                setVisibleBuyIconInfo(true);

                let v = auctionOffItem.getUnbindCost() + _t('sl');

                setStatesOfBuyNowInput(true, v);
            } else {
                setVisibleAdditionalGoldPayment(false);
                setVisibleAdditionalSoulboundPayment(false);
                setVisibleAuctionBid(true);
                setVisibleBuyIconInfo(false);

                manageValOfBuyNowWhenAuctionIsNotFeatured()
            }

            setVisibleDraconiteIconAndVal(true);
            setStatesOfAuctionDuration(true, 336, forceDurationChange);

        } else {

            if (isSoulbound) {
                setVisibleAdditionalGoldPayment(true);
                setVisibleAdditionalSoulboundPayment(true);
                setVisibleAuctionBid(false);
                //setStatesOfAuctionDuration(true, 48);
                setVisibleBuyIconInfo(true);

                let v = auctionOffItem.getUnbindCost() + _t('sl');
                setStatesOfBuyNowInput(true, v);

            } else {

                setVisibleAdditionalGoldPayment(false);
                setVisibleAdditionalSoulboundPayment(false);
                setVisibleAuctionBid(true);
                //setStatesOfBuyNowInput(false, '');
                //setStatesOfAuctionDuration(false, 48);
                setVisibleBuyIconInfo(false);

                manageValOfBuyNowWhenAuctionIsNotFeatured();
            }

            setStatesOfAuctionDuration(false, 168, forceDurationChange);
            setVisibleDraconiteIconAndVal(false);

        }

        setTaxValue(isSoulbound);
        allInputChangeTrigger();

    }

    const initWindow = () => {
        content = Templates.get('auction-off-item-panel');

        wnd = Engine.windowManager.add({
            content: content,
            nameWindow: Engine.windowsData.name.AUCTION_OFF_ITEM_PANEL,
            title: Engine.auctions.tLang('auction_off_item'),
            onclose: () => {
                hideAndUnsetAuctionItemOff()
            }
        });
        wnd.addToAlertLayer();
        wnd.center();

        hide();
    };

    const close = () => {
        removeAuctionOffItemAndManageVisibleElements();
        removeKeyupEvent();
        wnd.remove();
    }

    const createButtonCloseAuctionOff = () => {
        let button = createButton(_t('cancel') + ' [Esc]', ['small'], () => {
            hideAndUnsetAuctionItemOff();
        });

        content.find('.auction-off-btn-wrapper').append($(button));
    }

    const createButtonAuctionOff = () => {
        let str = Engine.auctions.tLang('au_create');
        auctionOffButton = createButton(str + ' [âµ]', ['small', 'green', 'alert-accept-hotkey'], () => {
            setAuctionOffAction()
        });

        let $button = $(auctionOffButton);

        content.find('.auction-off-btn-wrapper').append($button)
    };

    const setAuctionOffAction = () => {
        if (!auctionOffItem) return;

        let data = getDataFromInputsToAuctionOffItem();
        if (data == null) return;

        const
            confirmationQueue = new ConfirmationQueue.default(),
            condition = isTooLowPriceForLegendItem(auctionOffItem, data);

        confirmationQueue
            .addCondition(() => condition, _t('too-low-price-legend-item-confirm', null, 'auction'), {
                isConfirmHotkey: false
            })
            .processConditions(() => sendRequestToCreateAuction(auctionOffItem.id, data));
    }

    const isTooLowPriceForLegendItem = (auctionOffItem, data) => {
        console.log('HERE')

        // return isset(data.buy_out) && data.buy_out >=500 && data.buy_out <= 100000000 &&
        //     ItemClass.isEquipCl(auctionOffItem.cl) &&
        //     isset(auctionOffItem._cachedStats['lvl']) && auctionOffItem._cachedStats['lvl'] > 20 &&
        //     isset(auctionOffItem._cachedStats['rarity']) && auctionOffItem._cachedStats['rarity'] === Rarities.LEGENDARY;

        return isset(data.buy_out) && data.buy_out >= 500 && data.buy_out <= 100000000 &&
            ItemClass.isEquipCl(auctionOffItem.cl) &&
            auctionOffItem.issetLvlStat() && auctionOffItem.getLvlStat() > 20 &&
            auctionOffItem.issetRarityStat() && auctionOffItem.getRarityStat() === Rarities.LEGENDARY;
    }

    const sendRequestToCreateAuction = (itemId, data) => {
        Engine.auctions.getAuctionRequest().setAuctionOffActionRequest(itemId, data);
        hideAndUnsetAuctionItemOff();
        setIsFeatured(false);
    }

    const addKeyupEvent = () => {
        $("body").keyup(keyUpEvent);
    }

    const removeKeyupEvent = () => {
        $("body").unbind('keyup', keyUpEvent);
    }

    const keyUpEvent = (e) => {
        // console.log('keyUpEvent')
        if (!wnd.checkWndOnPeak()) return;
        if (e.key == "Enter") setAuctionOffAction()
        if (e.key == "Esc") hideAndUnsetAuctionItemOff();
    }

    // const initAuctionOffItemEventBtn = () => {
    //     content.find('.auction-off-btn-wrapper').on('click', () => {
    //         if (!auctionOffItem) return;
    //
    //         let data = getDataFromInputsToAuctionOffItem();
    //
    //         _g("ah&action=sell&item=" + auctionOffItem.id + data.join(''));
    //     });
    // };

    const isShow = () => {
        return wnd.isShow()
    }

    const manageOfShow = () => {

        if (!isShow()) showAndSet();
        else wnd.setWndOnPeak();

        //let active = getIsFeatured();
        //updateCheckBoxLabel(active);
        updateCheckbox();
    }

    const showAndSet = () => {
        wnd.show();
        wnd.center();
        wnd.setWndOnPeak()
    }

    const hideAndUnsetAuctionItemOff = () => {
        // removeAuctionOffItem();
        removeAuctionOffItemAndManageVisibleElements();
        hide();
    }

    const hide = () => {
        wnd.hide();
    };

    const getIsFeatured = () => {
        //return content.find('.special-offer').find('.checkbox.active').length ? 1 : 0;
        return featuredCheckBox.getChecked() ? 1 : 0;
    };

    const setIsFeatured = (state) => {
        //let $ch = content.find('.special-offer').find('.checkbox.active');
        //state ? $ch.addClass('active') : $ch.removeClass('active');

        featuredCheckBox.getChecked(state);
    };

    const getDataFromInputsToAuctionOffItem = () => {
        let bid = content.find('.auction-bid').find('input').val();
        let buyNow = content.find('.auction-buy-now').find('input').val();
        let duration = content.find('.auction-duration').find('input').val();
        let additionGoldPayment = content.find('.auction-additional-gold-payment').find('input').val();
        let isFeatured = getIsFeatured();

        let arg = {};

        if (auctionOffItem.issetSoulboundStat()) {
            if (additionGoldPayment !== null) {
                let price = parsePrice(removeSpaces(additionGoldPayment));
                if (!checkParsePriceValueIsCorrect(price)) return null;

                arg['price'] = price;
            }
            if (!isFeatured && duration !== null) arg['time'] = duration;
        } else {
            if (bid !== "") {
                let price = parsePrice(removeSpaces(bid));
                if (!checkParsePriceValueIsCorrect(price)) return null;

                arg['price'] = price;
            }
            if (buyNow !== "") {
                let price = parsePrice(removeSpaces(buyNow));
                if (!checkParsePriceValueIsCorrect(price)) return null;

                arg['buy_out'] = price;
            }
            if (!isFeatured && duration !== null) arg['time'] = duration;
        }

        arg['is_featured'] = isFeatured;

        return arg;
    };

    const removeAuctionOffItem = () => {

        if (!auctionOffItem) return

        let idItem = auctionOffItem.id;
        removeItemView(idItem, Engine.itemsViewData.AUCTION_SELL_ITEM_VIEW);
        removeItemFromItemMovedManager(idItem);
        setAuctionOffItem(null);
        clearItemSlot();


        // let active = getIsFeatured();
        // manageVisibleElements(active);
    };

    const removeAuctionOffItemAndManageVisibleElements = () => {
        removeAuctionOffItem();
        manageVisibleElements();
    }

    const clearItemSlot = () => {
        content.find('.add-item-section').find('.item-slot').find('.item').remove();
    };

    const removeItemView = (idItem, kind) => {
        Engine.items.deleteViewIconIfExist(idItem, kind);
    };

    const getAuctionOffItem = () => {
        return auctionOffItem;
    }

    const setAuctionOffItem = (itemData) => {
        auctionOffItem = itemData;
    };

    const checkAuctionOffItem = () => {
        return auctionOffItem ? true : false;
    }

    const removeItemFromItemMovedManager = (idItem) => {
        Engine.itemsMovedManager.removeItem(idItem);
    };

    const attackRightClickToToCloneItemToSlot = ($item, itemData) => {
        $item.contextmenu(function(e, mE) {
            let callback = {
                txt: _t('unbuy all'),
                f: function() {
                    // removeAuctionOffItem();
                    removeAuctionOffItemAndManageVisibleElements()
                }
            };
            itemData.createOptionMenu(getE(e, mE), callback, {
                move: true,
                use: true
            });
        });
    };

    const putAuctionOffItem = (itemData) => {

        if (!checkIsItem(itemData)) return; // ??? need?
        if (itemData.issetPermboundStat()) return;
        if (checkSoulbondIsBlocked(itemData)) return;

        removeAuctionOffItem();

        let $cloneItem = getCloneItemToItemSlot(itemData);

        setAuctionOffItem(itemData);
        manageVisibleElements();
        attackRightClickToToCloneItemToSlot($cloneItem, itemData);
        addItemSlotItemToItemsMoveManager(itemData);
        attachCloneItemToItemSlot($cloneItem);
    };

    const attachCloneItemToItemSlot = ($cloneItem) => {
        content.find('.item-slot').append($cloneItem);
    };

    const getCloneItemToItemSlot = (itemData) => {
        let $item = Engine.items.createViewIcon(itemData.id, Engine.itemsViewData.AUCTION_SELL_ITEM_VIEW)[0];

        return $item;
    };

    const addItemSlotItemToItemsMoveManager = (itemData) => {
        Engine.itemsMovedManager.addItem(itemData, Engine.itemsMovedData.ITEM_TO_AUCTION, function() {
            // removeAuctionOffItem();
            removeAuctionOffItemAndManageVisibleElements()
        });
    };

    const checkIsItem = (item) => {
        return item instanceof Item;
    };

    const checkSoulbondIsBlocked = (itemData) => {
        if (!itemData.issetSoulboundStat()) return false;

        //let soulboundVal = valueBoundItem(itemData);
        let soulboundVal = itemData.getUnbindCost();

        if (soulboundVal == null) soulboundVal = 0;

        // if (soulboundVal <= 0) return true;

        return soulboundVal <= 0;
    };

    // const manageSoulbound = (itemData) => {
    //
    //     if (!itemData.checkSoulbound()) return;
    //
    //     let soulboundVal        = valueBoundItem(itemData);
    //
    //     if (soulboundVal <= 0) return;
    //
    //     //let active = getIsFeatured();
    //     //manageVisibleElements();
    // };

    const setVisibleBuyIconInfo = (state) => {
        setVisibleInElementByState(content.find('.buy-info-icon'), state)
    }

    const setVisibleDraconiteIconAndVal = (state) => {
        let $el = content.find('.small-currency-icon').find('.small-draconite').parent();
        $el.css('display', state ? 'table-cell' : 'none')
    };

    const setVisibleGoldIconAndVal = (state) => {
        let $el = content.find('.small-currency-icon').find('.small-money').parent();
        $el.css('display', state ? 'table-cell' : 'none')
    };

    const getAuctionCostByPatern = (itemData) => {
        let lvl = itemData.getLvlStat();

        if (!lvl) lvl = 10;

        return Math.max(lvl, 10) * 10;
    }

    const setValOfGoldIconAndVal = (val) => {
        let $el = content.find('.small-currency-icon').find('.small-money').parent().find('.value');
        $el.html(val);
    };

    const manageVisibleSpecialOffer = () => {
        let featuredCount = Engine.auctions.getFeaturedCount();
        let visibleSpecialOffer = featuredCount != AuctionData.MAX_FEATURED_COUNT;

        setVisibleSpecialOffer(visibleSpecialOffer)
    };

    const setVisibleSpecialOffer = (state) => {
        //setVisibleInElementByState(content.find('.special-offer'), state);

        let pEvents = state ? 'initial' : 'none';
        let opacity = state ? 1 : 0.5;
        let tip = state ? '' : _t('special_offer_limit_reach');
        let $sO = content.find('.special-offer');

        $sO.tip(tip);

        $sO.find('.one-checkbox').css({
            "pointer-events": pEvents,
            opacity: opacity
        })
    };

    const setVisibleAdditionalGoldPayment = (state) => {
        setVisibleInElementByState(content.find('.auction-additional-gold-payment'), state)
    };

    const setVisibleAdditionalSoulboundPayment = (state) => {
        setVisibleInElementByState(content.find('.additional-soulbond-payment'), state)
    };

    const setVisibleAuctionBid = (state) => {
        setVisibleInElementByState(content.find('.auction-bid'), state)
    };

    const manageValOfBuyNowWhenAuctionIsNotFeatured = () => {
        let $buyNowInput = content.find(".auction-buy-now").find("input");
        let val = $buyNowInput.val();

        // let newVal = val.search('SL') > -1 ? '' : val;
        let newVal = val.search(_t('sl')) > -1 ? '' : val;

        setStatesOfBuyNowInput(false, newVal);
    };

    const setStatesOfBuyNowInput = (disableState, val) => {
        setDisabledInputAndVal(content.find(".auction-buy-now").find("input"), disableState, val)
    };

    const setStatesOfAuctionDuration = (disableState, val, force = false) => {
        const $input = content.find(".auction-duration").find("input");
        if (!force) val = $input.val() === '' ? val : $input.val();
        setDisabledInputAndVal($input, disableState, val)
    }

    const setDisabledInputAndVal = ($element, disableState, val) => {
        $element.prop('disabled', disableState);
        $element.val(val);
    }

    const setVisibleInElementByState = ($element, state) => {
        $element.css('display', state ? 'block' : 'none')
    }

    const setTaxValue = (isSoulbound) => {
        const {
            creditsRatio,
            goldRatio,
            goldRatioFromSurcharge
        } = getTaxes();
        const taxValue = isSoulbound ?
            `${goldRatioFromSurcharge}% (${_t('gold_plural')})<br>
           ${creditsRatio}% (${_t('credits_plural')})` :
            `${goldRatio}%`;

        const $taxValue = content.find(".tax-val");
        $taxValue.html(taxValue);
    }

    const getTaxes = () => {
        const {
            gainedCreditsRatio,
            gainedGoldRatio,
            gainedGoldRatioFromSurcharge
        } = Engine.auctions.getConfig();
        const creditsRatio = 100 - gainedCreditsRatio;
        const goldRatio = 100 - gainedGoldRatio;
        const goldRatioFromSurcharge = 100 - gainedGoldRatioFromSurcharge;
        return {
            creditsRatio,
            goldRatio,
            goldRatioFromSurcharge
        }
    }

    // const valueBoundItem = (item) => {
    //     if (!isset(item._cachedStats.lvl)) return 0;
    //
    //     let baseMin     = 20;
    //     let baseReal    = 10 + (item._cachedStats.lvl / 10);
    //     let multipler   = 1;
    //
    //     if (isset(item.itemTypeName === 'legendary')) {
    //         multipler   = 3;
    //         baseMin     = 30;
    //     } else if (isset(item.itemTypeName === 'heroic')) {
    //         multipler   = 1.5;
    //         baseMin     = 30;
    //     } else if (isset(item.itemTypeName === 'unique')) {
    //         multipler = 1.2;
    //     }
    //
    //     let real = Math.min(baseReal, baseMin) * multipler;
    //
    //     return Math.round(real) * CFG.sl_multipler[_l()];
    // };

    const initRemoveAuctionOffItemEvent = () => {
        content.find('.item-slot').on('click', removeAuctionOffItemAndManageVisibleElements);
    };

    this.close = close;
    this.manageOfShow = manageOfShow;
    this.getAuctionOffItem = getAuctionOffItem;
    this.setAuctionOffItem = setAuctionOffItem;
    this.putAuctionOffItem = putAuctionOffItem;
    this.manageVisibleElements = manageVisibleElements;
    this.manageVisibleSpecialOffer = manageVisibleSpecialOffer;
    this.updateCheckbox = updateCheckbox;
    this.init = init;
}