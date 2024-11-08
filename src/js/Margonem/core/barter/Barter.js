const Checkbox = require('core/components/Checkbox');
var tpl = require('../Templates');
let ProfData = require('core/characters/ProfData');
var ItemState = require('core/items/ItemState');
var TutorialData = require('core/tutorial/TutorialData');
const Slider = require('../components/Slider');
module.exports = function() {

    let content;
    let usesAmount = null;
    let offerSlider = null;

    this.items = {};

    this.barterId = null;
    this.barterName = null;

    this.desireItemId = null;

    this.lastCreatedId = null;

    this.showAffectedOfferId = null;

    this.barterOffersData = null;
    this.barterOwnedData = null;
    this.barterAvailableData = null;
    this.barterUsagesData = null;

    this.allParseOffers = null;
    this.allCategories = null;

    this.haveReagentsList = null;
    this.needReagentsList = null;

    this.init = function() {
        this.closeOtherWindows();
        this.initWindow();
        this.initLabels();
        this.initFetch();
        this.blockMove();
        this.initSelect();
        this.initSearch();
        this.initStartLvl();
        this.initStopLvl();
        this.initScrollsBar();
        this.createSafeCheckbox();
    };

    this.createSafeCheckbox = () => {
        const containerEl = content[0].querySelector('.safe-mode');
        const checkbox = new Checkbox.default({
                label: _t('safe'),
                id: 'safe-mode-barter',
                checked: Engine.settingsOptions.isExchangeSafeMode(),
                highlight: false
            },
            (state) => this.onSelected(state),
        );
        const checkboxEl = checkbox.getCheckbox();
        containerEl.appendChild(checkboxEl);
        $(containerEl).tip(_t('exchange-safe-tip'))
        containerEl.setAttribute('data-tip-type', 't-left');
    }

    this.onSelected = (state) => {
        this.sendSafeModeState(state)
    }

    this.sendSafeModeState = (state) => {
        _g(`barter&action=safemode&enabled=${Number(state)}`)
    }

    this.initStartLvl = function() {
        const $searchWrapper = content.find('.start-lvl-wrapper');
        const $search = createNiInput({
            cl: 'start-lvl',
            placeholder: _t('start'),
            changeClb: () => this.startFilter(),
            clearClb: () => this.startFilter(),
            type: 'number'
        });
        $searchWrapper.html($search);
    };

    this.initStopLvl = function() {
        const $searchWrapper = content.find('.stop-lvl-wrapper');
        const $search = createNiInput({
            cl: 'stop-lvl',
            placeholder: _t('stop'),
            changeClb: () => this.startFilter(),
            clearClb: () => this.startFilter(),
            type: 'number'
        });
        $searchWrapper.html($search);
    };

    this.initLabels = () => {
        this.wnd.$.find('.left-column-list-label').html(_t('exchange_list', null, 'item_changer'));
        this.wnd.$.find('.reagents-label').html(_t('reagents_label'));
    }

    this.initScrollsBar = function() {
        $('.left-scroll', content).addScrollBar({
            track: true
        });
        $('.right-scroll', content).addScrollBar({
            track: true
        });
    };

    this.updateScroll = function() {
        $('.left-scroll', content).trigger('update');
        $('.right-scroll', content).trigger('update');
    };

    this.initWindow = function() {
        content = tpl.get('left-grouped-list-and-right-description-window');
        content.addClass('barter-content');

        Engine.windowManager.add({
            content: content,
            title: 'Barter',
            nameWindow: Engine.windowsData.name.BARTER,
            objParent: this,
            nameRefInParent: 'wnd',
            addClass: 'barter-window',
            onclose: () => {
                this.close();
            }
        });

        this.wnd.addToAlertLayer();
        this.wnd.center();
    };

    this.initFetch = function() {
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_BARTER_TPL, this.createBarterItem);
    };

    this.addToCategories = (offer, item) => {
        let cl = item.cl;
        let id = item.id;
        let name = item.name;

        this.items[id] = item;

        if (!this.allCategories.hasOwnProperty(cl)) this.allCategories[cl] = [];

        offer.category = cl;
        offer.resultItemName = name;

        this.allCategories[cl].push(offer);
    };

    this.updateItem = (item) => {
        let id = item.id;

        for (let i = 0; i < this.allParseOffers.length; i++) {
            let checkOffer = this.allParseOffers[i];

            for (let k = 0; k < checkOffer.recived.length; k++) {
                let recivedId = checkOffer.recived[k][0];
                if (recivedId == id) this.addToCategories(checkOffer, item);
            }
        }
    };

    this.createBarterItem = (i, finish) => {
        this.items[i.id] = i;
        this.updateItem(i);

        if (finish) {

            this.buildRecipeList();

            if (this.showAffectedOfferId != null) this.showAgainClickOffer();

            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 34);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 34);

            this.wnd.updateWindowTrigger();
        }
    };

    this.createAllCategoriesDisableAndEnable = () => {
        let allCategoriesDisableAndEnable = {};

        for (let k in this.allCategories) {
            allCategoriesDisableAndEnable[k] = {
                enable: [],
                disable: []
            };
            let oneCategory = this.allCategories[k];
            for (let i = 0; i < oneCategory.length; i++) {

                let oneOfferData = oneCategory[i];

                if (oneOfferData.maxAmount) allCategoriesDisableAndEnable[k].enable.push(oneOfferData);
                else allCategoriesDisableAndEnable[k].disable.push(oneOfferData);
            }
        }

        for (let k in allCategoriesDisableAndEnable) {
            allCategoriesDisableAndEnable[k].disable.sort(this.compare);
            allCategoriesDisableAndEnable[k].enable.sort(this.compare);
        }

        return allCategoriesDisableAndEnable;
    };

    this.buildRecipeList = () => {
        let allCategoriesDisableAndEnable = this.createAllCategoriesDisableAndEnable();
        this.cleanList();

        this.drawAllRecipesOnList(allCategoriesDisableAndEnable);
        this.countRecipesPerGroup();
        this.updateScroll();
    };

    this.drawAllRecipesOnList = (allCategoriesDisableAndEnable) => {
        for (let k in allCategoriesDisableAndEnable) {
            let oneCategory = allCategoriesDisableAndEnable[k];

            for (let i = 0; i < oneCategory.enable.length; i++) {
                let oneOfferData = oneCategory.enable[i];
                let $oneOfferOnList = this.createOneOfferOnList(oneOfferData);
                this.createGroupElement(oneOfferData, $oneOfferOnList)
            }

            for (let i = 0; i < oneCategory.disable.length; i++) {
                let oneOfferData = oneCategory.disable[i];
                let $oneOfferOnList = this.createOneOfferOnList(oneOfferData);
                this.createGroupElement(oneOfferData, $oneOfferOnList)
            }
        }
    };

    this.compare = (a, b) => {
        const nameA = a.resultItemName.toUpperCase();
        const nameB = b.resultItemName.toUpperCase();

        let comparison = 0;

        if (nameA > nameB) comparison = 1;
        else if (nameA < nameB) comparison = -1;

        return comparison;
    };

    this.createOneOfferOnList = (data) => {
        let amount = data.maxAmount;
        let resultItemId = data.recived[0][0];
        let resultItem = this.items[resultItemId];

        let $one = tpl.get('one-item-on-divide-list').addClass('crafting-recipe-in-list ' + (amount ? 'enabled' : 'disabled'));
        let amountStr = amount > 0 ? ' (' + amount + ')' : '';

        $one.addClass('offer-id-' + data.id);
        $one.addClass('affectedId-id-' + data.affectedId);
        $one.find('.name').html(data.resultItemName + amountStr);

        this.createAttrToCraftingRecipe($one, resultItem);
        this.recipeClick($one, data);
        return $one;
    };

    this.createAttrToCraftingRecipe = ($recipe, itemData) => {
        let reqp = 'all';
        let typeItem = 'all';
        let cls = ['unique', 'heroic', 'legendary'];
        let stats = Engine.items.parseItemStat(itemData.stat);

        if (isset(stats.lvl)) $recipe.attr('lvl', stats.lvl);
        if (isset(stats.reqp)) reqp = stats.reqp;

        for (var i = 0; i < cls.length; i++) { // @ToDo - remove this loop after rarity changes
            if (itemData.itemTypeName === cls[i]) typeItem = cls[i];
        }

        $recipe.attr('typeItem', typeItem);
        $recipe.attr('reqp', reqp);
    };

    this.recipeClick = function(recipe, data) {
        recipe.click((e) => {
            e.stopPropagation();
            this.showAffectedOfferId = data.affectedId;
            this.createOffer(data);

            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 34);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 34);

            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 27);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 27);

            callCheckCanFinishExternalTutorialClickBarterOfferOnList(data.id)
        });
    };

    const callCheckCanFinishExternalTutorialClickBarterOfferOnList = (idBarterOffer) => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.CLICK_BARTER_OFFER_ON_LIST,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            idBarterOffer
        );

        Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger)
    };

    this.createOffer = (data) => {
        usesAmount = 1;
        var $header = tpl.get('crafting-description-header');
        var $reagents = tpl.get('crafting-description-reagents');
        var $sliderContainer = $('.additional-container', content);
        var $button = tpl.get('button');

        let recivedId = data.recived[0][0];
        let recivedAmount = data.recived[0][1];
        let item = this.items[recivedId];

        this.desireItemId = recivedId;

        let $icon = this.createViewItem(item);
        var $itemSlot = $header.find('.result-item');


        Engine.tpls.changeItemAmount(item, $icon, recivedAmount);
        $icon.attr('data-tip-type', item.$.data('tipType'));
        $icon.attr('data-item-type', item.$.data('itemType'));
        $icon.data('item', item);

        $itemSlot.append($icon);

        this.rightClickItem($icon, item, false);

        let limitCell = this.createLimitCell(data);
        limitCell = limitCell != '-' ? ('<br><span class="limit-cell">' + _t('limit', null, 'item_changer') + limitCell + '</span>') : '';

        let itemType = item.getItemType();

        $header.find('.offer-name').addClass(itemType).html(item.name + limitCell);

        const sortedReagents = this.sortReagents(data.required);
        this.createReagents($reagents, sortedReagents);
        this.createCost($reagents, data);
        this.createSlider($sliderContainer, {
            disabled: data.maxAmount < 1,
            range: [1, data.maxAmount]
        });
        this.useRecipeBtn($button, data);

        let $w = this.wnd.$;

        $w.find('.right-column-header').html($header);
        $w.find('.all-items-wrapper').html($reagents);
        $w.find('.right-column').find('.crafting-cost-panel').remove();
        $sliderContainer.append($button);

        this.markChooseOffer();
        this.updateScroll();
        this.manageEnableClassOfButton();
    };

    this.sortReagents = (reagents) => reagents.sort(([a], [b]) => { // destructuring a & b (first value = reagentId)
        a = this.items[a];
        b = this.items[b];
        return b.itemTypeSort - a.itemTypeSort || // sort by type
            b.pr - a.pr || // sort by price
            a.name.localeCompare(b.name) // sort alphabetically
    });

    this.createSlider = ($wrapper, {
        disabled,
        range = [1, 10]
    }) => {
        const value = !disabled ? 1 : 0;

        offerSlider = new Slider.default({
            min: 0,
            max: 10,
            range,
            value,
            ...(disabled ? {
                disabled
            } : {}),
            showValue: true,
            onUpdate: (value) => {
                this.sliderUpdate(value)
            }
        })
        $wrapper.html($(offerSlider.getElement()))
    }

    this.sliderUpdate = (value) => {
        usesAmount = value;
    }

    this.markChooseOffer = () => {
        let cl = 'mark-offer';
        this.wnd.$.find('.' + cl).removeClass(cl);
        this.wnd.$.find('.affectedId-id-' + this.showAffectedOfferId).addClass(cl);
    };

    this.rightClickItem = ($icon, item, block) => {
        $icon.off('contextmenu'); // #17388 prevent to fire context menu X times after each move item
        $icon.on('contextmenu', function(e, mE) {
            item.createOptionMenu(getE(e, mE), false, block);
        });
    };

    this.useRecipeBtn = function($button, data) {
        var str = _t('use_it', null, 'item');
        $button.addClass('small green');
        $button.find('.label').html(str);

        $button.on('click', () => {
            if ($button.hasClass('black')) return;
            this.askAlert(data);

            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 27);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 27);
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 28);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 28);

        })

    };

    this.createLimitCell = (data, breakLine) => {
        if (!data.limit) return '-';

        let u = this.findUsagesById(data.id);
        let useVal = u ? u : 0;
        let br = breakLine ? '<br>' : ' ';

        return this.returnLimitStr(useVal, data, br);
    };

    this.returnLimitStr = (useVal, data, br) => {
        switch (data.limit.period) {
            case 0:
                return '-';
            case 1:
                return useVal + '/' + data.limit.max + br + this.tLang('on_day');
            case 2:
                return useVal + '/' + data.limit.max + br + this.tLang('on_week');
            case 3:
                return useVal + '/' + data.limit.max + br + this.tLang('on_month');
            default:
                console.error('[Barter.js, returnLimitStr] BAD LIMIT PERIOD', data.limit.period);
                return '';
        }
    };

    this.findUsagesById = (id) => {
        for (let i = 0; i < this.barterUsagesData.length; i++) {
            let oneUsage = this.barterUsagesData[i];
            if (oneUsage[0] == id) return oneUsage[1];
        }
        return null;
    };

    this.getAmountAvailable = function(offerId, tplId) {
        for (let i = 0; i < this.barterAvailableData.length; i++) {
            let barterOffer = this.barterAvailableData[i];

            if (barterOffer.offerId == offerId) {
                if (!barterOffer.hasOwnProperty('tplId')) return barterOffer.count;
                else {
                    if (barterOffer.tplId == tplId) return barterOffer.count;
                }
            }
        }
        return 0;
    };

    this.askAlert = (data) => {
        const [
            [requiredId]
        ] = data.required;
        var offerId = data.id;
        var limitTxt = data.limit ? (_t('limit', null, 'item_changer') + '<b>' + this.createLimitCell(data) + '</b><br>') : '';
        var txt = _t('accept_barter_offer') + '<br>' + limitTxt;
        var dataAlert = {
            q: txt,
            clb: () => data.mode === 2 ? this.doBarter(offerId, requiredId) : this.doBarter(offerId)
        };

        this.setCostInData(data, dataAlert);
        askAlert(dataAlert);
    };

    this.doBarter = (offerId, requiredId) => {
        const required = isset(requiredId) ? `&requiredId=${requiredId}` : '';

        _g(`barter&id=${this.barterId}&offerId=${offerId}&action=use&usesCount=${usesAmount}&available=0&desiredItem=${this.desireItemId}${required}`);
        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 28);
        //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 28);

        callCheckCanFinishExternalTutorialUseBarterOffer(this.barterId)
    }

    const callCheckCanFinishExternalTutorialUseBarterOffer = (idBarterOffer) => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.USE_BARTER_OFFER,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            idBarterOffer
        );

        Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger)
    };

    this.setCostInData = (data, dataAlert) => {
        dataAlert['m'] = 'yesno4';
    };

    this.initSelect = () => {
        var $r = this.wnd.$;
        var $m = $r.find('.choose-prof');
        var $m2 = $r.find('.choose-item-type');
        var data1 = [{
                val: 'all',
                'text': _t('prof_all', null, 'auction')
            },
            {
                val: ProfData.MAGE,
                'text': _t('prof_mage', null, 'auction')
            },
            {
                val: ProfData.WARRIOR,
                'text': _t('prof_warrior', null, 'auction')
            },
            {
                val: ProfData.PALADIN,
                'text': _t('prof_paladin', null, 'auction')
            },
            {
                val: ProfData.TRACKER,
                'text': _t('prof_tracker', null, 'auction')
            },
            {
                val: ProfData.HUNTER,
                'text': _t('prof_hunter', null, 'auction')
            },
            {
                val: ProfData.BLADE_DANCER,
                'text': _t('prof_bdancer', null, 'auction')
            }
        ];
        $m.createMenu(data1, true, (pos) => {
            this.startFilter();
        });
        var data2 = [{
                val: 'all',
                text: _t('type_all', null, 'auction')
            },
            {
                val: 'unique',
                text: _t('type_unique', null, 'auction')
            },
            {
                val: 'heroic',
                text: _t('type_heroic', null, 'auction')
            },
            {
                val: 'legendary',
                text: _t('type_legendary', null, 'auction')
            }
        ];
        $m2.createMenu(data2, true, (pos) => {
            this.startFilter();
        });
    };

    this.initSearch = () => {
        let $searchInput = this.wnd.$.find('.search');
        let $searchX = this.wnd.$.find('.search-x');

        $searchInput.keyup(() => {
            this.startFilter()
        });
        $searchInput.attr('placeholder', _t('search'));

        $searchX.on('click', () => {
            $searchInput.val('').blur().trigger('keyup');
        });
    };

    this.startFilter = function() {
        this.wnd.$.find('.one-item-on-divide-list').removeClass('hide');
        this.searchKeyUp();
        this.lvlKeyUp();
        this.getValueFromProf();
        this.getValueFromItemType();
        this.countRecipesPerGroup();
        this.updateScroll();
    };

    this.searchKeyUp = () => {
        let v = this.wnd.$.find('.search').val();
        let $allRecipes = this.wnd.$.find('.one-item-on-divide-list');
        if (v == '') {} else {
            $allRecipes.each(function() {
                let txt = ($(this).find('.name').html()).toLowerCase();
                let disp = txt.search(v.toLowerCase()) > -1 ? true : false;
                disp ? $(this).removeClass('hide') : $(this).addClass('hide');
            });
        }
    };

    this.lvlKeyUp = () => {
        let v1 = this.wnd.$.find('.start-lvl input').val();
        let v2 = this.wnd.$.find('.stop-lvl input').val();
        let $allRecipes = this.wnd.$.find('.one-item-on-divide-list');
        if (v1 == '' && v2 == '') return;
        else {
            if (v1 == '') v1 = 0;
            if (v2 == '') v2 = 1000;
            $allRecipes.each(function() {
                if ($(this).css('display') == 'none') return;
                let lvl = $(this).attr('lvl');
                let disp = lvl >= parseInt(v1) && lvl <= parseInt(v2) ? true : false;
                disp ? $(this).removeClass('hide') : $(this).addClass('hide');
            });
        }
    };

    this.getValueFromProf = () => {
        let val = this.wnd.$.find('.choose-prof').find('.menu-option').attr('value');
        if (val == 'all') return;
        let $allRecipes = this.wnd.$.find('.one-item-on-divide-list');
        $allRecipes.each(function() {
            if ($(this).css('display') == 'none') return;
            let reqp = $(this).attr('reqp');
            let disp = reqp.indexOf(val) > -1 ? true : false;
            disp ? $(this).removeClass('hide') : $(this).addClass('hide');
        });
    };

    this.getValueFromItemType = () => {
        let val = this.wnd.$.find('.choose-item-type').find('.menu-option').attr('value');
        if (val == 'all') return;
        let $allRecipes = this.wnd.$.find('.one-item-on-divide-list');
        $allRecipes.each(function() {
            if ($(this).css('display') == 'none') return;
            let typeItem = $(this).attr('typeitem');
            var disp;
            switch (val) {
                case 'unique':
                    if (typeItem == 'unique' || typeItem == 'heroic' || typeItem == 'legendary') disp = true;
                    else disp = false;
                    break;
                case 'heroic':
                    if (typeItem == 'heroic' || typeItem == 'legendary') disp = true;
                    else disp = false;
                    break;
                case 'legendary':
                    if (typeItem == 'legendary') disp = true;
                    else disp = false;
                    break;
            }
            disp ? $(this).removeClass('hide') : $(this).addClass('hide');
        });
    };

    this.countRecipesPerGroup = () => {
        let $groups = this.wnd.$.find('.divide-list-group');
        $groups.each(function(index, el) {
            let $el = $(el);
            let amount = $el.find('.group-list .one-item-on-divide-list:not(.hide)').length;
            $(el).find('.amount').html(amount);
        });
    };

    this.createCost = ($costPanel, data) => {
        if (!data.cost) {
            $costPanel.find('.crafting-cost-wrapper').html('-');
            return;
        }

        var $costCell = tpl.get('cost-wrapper');
        switch (data.cost.currency) {
            case 1:
                var $reagent = this.createCostReagent(_t('gold'), data.cost.value, Engine.hero.d.gold, 'money-icon');
                $costPanel.append($reagent);
                break;
            case 2:
                var $reagent = this.createCostReagent(_t('stat-credits'), data.cost.value, Engine.hero.d.credits, 'draconite-icon');
                $costPanel.append($reagent);
                break;
                break;
            case 3:
                let have = this.lookForOwnedById(data.cost.itemTpl);
                var $reagent = this.createCostReagent(false, data.cost.value, have, false, data.cost.itemTpl);
                $costPanel.append($reagent);
                break;
            case 4:
                var $reagent = this.createCostReagent(_t('stat-honor'), data.cost.value, Engine.hero.d.honor, 'honor-icon');
                $costPanel.append($reagent);
                break;
            default:
                console.error('[Barter.js, createCost] Bad currency:', data.cost.currency)
        }
        $costPanel.find('.crafting-cost-wrapper').append($costCell);
    };

    this.setCostAvailableData = function($el, value = true) {
        $el.attr('data-cost-available', value);
    };

    this.createViewItem = (item) => {
        return Engine.tpls.createViewIcon(item.id, Engine.itemsViewData.BARTER_RECIVED_ITEM_VIEW, item.loc)[0];
    };

    this.createReagents = function($reagentsWrapper, required) {
        let oneUseReagentsArray = [];

        this.clearHaveReagentsList();
        this.clearNeedReagentsList();

        for (var i = 0; i < required.length; i++) {
            let id = required[i][0];
            let need = required[i][1];
            let item = this.items[id];
            let $icon = this.createViewItem(item);
            let $reagent = tpl.get('crafting-reagent');
            let $itemSlot = $reagent.find('.item-slot');
            let amountItem = item.haveStat('amount');

            let have = 0;
            let owned = 0;

            let itemType = item.getItemType();

            $icon.addClass('pattern-item');

            if (amountItem) need = need * item.getAmount();

            this.setNeedReagentsList(id, need);

            let $have = $reagent.find('.have');
            let $need = $reagent.find('.need');

            this.setLabelWithRoundVal($have, have);
            this.setLabelWithRoundVal($need, need);


            $reagent.find('.item-name').addClass(itemType).html(item.name);
            $itemSlot.addClass('reagent-tpl-' + id);
            $itemSlot.append($icon);

            this.rightClickItem($icon, item, false);

            let canFind = true;

            while (canFind) {
                let correctItem = this.findOneReagent(id, oneUseReagentsArray);
                canFind = false;
                if (correctItem) {
                    canFind = true;

                    if (amountItem) owned = owned + correctItem.getAmount();
                    if (!amountItem) owned++;

                    if (have >= need) continue;

                    if (amountItem) have = have + correctItem.getAmount();
                    if (!amountItem) have++;

                    this.setBarterItem(correctItem, $itemSlot);
                }
            }

            this.setHaveReagentsList(id, have);

            let $ownedItems = $reagent.find('.owned-items');
            this.setLabelWithRoundVal($ownedItems, owned, _t('owned', null, 'item_changer'));

            $reagentsWrapper.find('.reagents-list').append($reagent);
        }
    };

    this.setLabelWithRoundVal = ($el, val, prefix) => {
        if (val > 9995) $el.tip(val);
        else $el.tip('');
        let _prefix = prefix ? prefix : '';
        $el.html(_prefix + round(val, 4));
    };

    this.createCostReagent = (nameCurrency, need, have, cl, itemTpl) => {
        let $reagent = tpl.get('crafting-reagent');
        let $itemSlot = $reagent.find('.item-slot');

        let $icon;
        let currency;

        if (cl) {
            $icon = tpl.get('cost-icon-component');
            $icon.find('.icon').addClass(cl);
        }

        if (itemTpl) {
            let item = this.items[itemTpl];
            $icon = this.createViewItem(item);
            currency = item.name;
        }

        if (nameCurrency) currency = nameCurrency;

        let value = have > need ? need : have;

        let $ownedItems = $reagent.find('.owned-items');
        let $have = $reagent.find('.have');
        let $need = $reagent.find('.need');

        this.setLabelWithRoundVal($ownedItems, have, _t('owned', null, 'item_changer'));
        this.setLabelWithRoundVal($have, value);
        this.setLabelWithRoundVal($need, need);



        $reagent.find('.item-name').html(currency);
        $itemSlot.append($icon);
        return $reagent
    };

    this.getItemSlot = (tplId) => {
        let $wrapper = this.wnd.$.find('.reagent-tpl-' + tplId);
        let $itemSlot = null;

        return $wrapper;
    };

    this.setBarterItem = (itemData, $itemSlot) => {
        let id = itemData.id;
        let tplId = itemData.tpl;
        let $icon2 = Engine.items.createViewIcon(id, Engine.itemsViewData.BARTER_REAGENT_ITEM_VIEW)[0];
        let amountItem = itemData.haveStat('amount');
        let fillAllItems = $itemSlot;


        if (!$itemSlot) $itemSlot = this.getItemSlot(tplId);

        let $reagentWrapper = $itemSlot.closest('.reagent-wrapper');

        $itemSlot.append($icon2);

        let have = this.getHaveReagentsList(tplId);

        if (amountItem) have = have + itemData.getAmount();
        if (!amountItem) have++;

        this.setHaveReagentsList(tplId, have);

        let $have = $reagentWrapper.find('.have');

        this.setLabelWithRoundVal($have, have);

        if (!fillAllItems) {
            this.manageEnableClassOfButton();
        }
    };

    this.clearHaveReagentsList = () => {
        this.haveReagentsList = {};
    };

    this.getHaveReagentsList = (tplId) => {
        if (!this.haveReagentsList.hasOwnProperty(tplId)) return 0;
        return this.haveReagentsList[tplId];
    };

    this.setHaveReagentsList = (tplId, amount) => {
        this.haveReagentsList[tplId] = amount;
    };

    this.clearNeedReagentsList = () => {
        this.needReagentsList = {};
    };

    this.setNeedReagentsList = (tplId, amount) => {
        this.needReagentsList[tplId] = amount;
    };

    this.checkCanUseOffer = () => {

        for (let tplId in this.needReagentsList) {
            let need = this.needReagentsList[tplId];
            let have = this.haveReagentsList[tplId];
            if (have < need) return false;
        }

        return (this.getOfferAvailableByCost() ? true : false);
    };

    this.manageEnableClassOfButton = () => {
        const canUseOffer = this.checkCanUseOffer();
        let cl = canUseOffer ? 'green' : 'black';
        let $button = this.wnd.$.find('.additional-container').find('.button');
        $button.removeClass('green black');
        $button.addClass(cl);

        offerSlider.setState(!canUseOffer);
    };

    this.findOneReagent = (tplId, _missIdItemsArrays) => {
        let hItems = Engine.heroEquipment.getHItems();
        let confusing = ['upg', 'soulbound', 'lowreq', 'opis2', 'timelimit_upgs', 'lvlupgs', 'recovered'];
        let tmpConfuseItem = null;
        let tmpConfuseAmount = null;
        let missIdItemsArrays = _missIdItemsArrays ? _missIdItemsArrays : [];

        for (let k in hItems) {
            let item = hItems[k];
            let id = item.id;

            //if (item.st > 0)                                      continue;
            if (ItemState.isEquippedSt(item.st)) continue;
            if (missIdItemsArrays.includes(id)) continue;
            if (item.tpl != tplId) continue;
            if (item.haveStat('expires') && item.checkExpires()) continue;

            let confuseStatsAmount = this.getAmountOfConfuseStats(confusing, item._cachedStats);
            if (confuseStatsAmount) {

                if (tmpConfuseAmount == null || tmpConfuseAmount > confuseStatsAmount) {
                    tmpConfuseAmount = confuseStatsAmount;
                    tmpConfuseItem = item;
                }

            } else {
                missIdItemsArrays.push(id);
                return item;
            }
        }

        if (tmpConfuseItem) {
            missIdItemsArrays.push(tmpConfuseItem.id);
            return tmpConfuseItem;
        }

        return null;
    };

    this.getAmountOfConfuseStats = (confuseStatsArray, itemStatsObject) => {
        let confuseStatsAmount = 0;
        for (let i = 0; i < confuseStatsArray.length; i++) {
            let oneStat = confuseStatsArray[i];
            if (itemStatsObject.hasOwnProperty(oneStat)) confuseStatsAmount++;
        }
        return confuseStatsAmount;
    };

    this.lookForOwnedById = (id) => {
        for (let i = 0; i < this.barterOwnedData.length; i++) {
            let _id = this.barterOwnedData[i][0];
            if (id == _id) return this.barterOwnedData[i][1];
        }
        return 0;
    }

    this.createGroupElement = (oneOfferData, $oneOfferOnList) => {

        let category = oneOfferData.category;
        let $offerGroup = this.wnd.$.find('.group-' + category);
        let $offerGroupHeader;

        if ($offerGroup.length < 1) {
            $offerGroup = tpl.get('divide-list-group');
            $offerGroupHeader = $offerGroup.find('.group-header');

            $offerGroup.addClass(`group-${category} active`);
            $offerGroup.find('.label').html(_t('au_cat' + category, null, 'auction'));
            this.wnd.$.find('.items-list').append($offerGroup);
            $offerGroupHeader.click(function(e) {
                $offerGroup.toggleClass('active');
            });
        }
        $offerGroup.find('.group-list').append($oneOfferOnList);
    };

    this.cleanList = function() {
        var $w = this.wnd.$;
        $w.find('.items-list').empty();
    };

    this.update = (v, d) => {

        this.barterId = v.id;
        this.barterName = v.name;

        this.barterOffersData = v.offers;
        this.barterOwnedData = v.owned;
        this.barterAvailableData = v.available;
        this.barterUsagesData = v.usages;

        this.allCategories = {};
        this.lastCreatedId = 0;

        this.wnd.title(this.barterName);
        this.createOffers();

    };

    this.showAgainClickOffer = () => {
        for (let i = 0; i < this.allParseOffers.length; i++) {
            if (this.showAffectedOfferId == this.allParseOffers[i].affectedId) {
                this.createOffer(this.allParseOffers[i]);
                return;
            }
        }
    };

    this.getOfferAvailableByCost = () => {
        for (let i = 0; i < this.allParseOffers.length; i++) {
            if (this.showAffectedOfferId == this.allParseOffers[i].affectedId) {
                return this.allParseOffers[i].maxAmount;
            }
        }
        console.warn('[Barter.js, getOfferAvailableByCost] Not find')
        return 0;
    };

    this.createOffers = () => {
        this.allParseOffers = [];
        for (let i = 0; i < this.barterOffersData.length; i++) {

            let oneDataOffer = this.barterOffersData[i];

            switch (oneDataOffer.mode) {
                case 1:
                    this.prepareNormalOffer(oneDataOffer);
                    break;
                case 2:
                    this.prepareChooseOneRequiredFromBigRequiredListOffer(oneDataOffer);
                    break;
                default:
                    return console.error('[Barter.js, createOffers] Bad offer mode:', oneDataOffer.mode);
            }

        }

    };

    this.prepareNormalOffer = (oneDataOffer) => {

        let recived = oneDataOffer.recived;

        for (let i = 0; i < recived.length; i++) {
            let oneRecived = recived[i];

            let maxAmount = this.getAmountAvailable(oneDataOffer.id);

            let newOffer = {
                id: oneDataOffer.id,
                affectedId: this.lastCreatedId,
                mode: oneDataOffer.mode,
                required: oneDataOffer.required,
                recived: [oneRecived],
                maxAmount: maxAmount,
                category: null,
                resultItemName: null
            };

            this.lastCreatedId++;

            if (oneDataOffer.limit) newOffer.limit = oneDataOffer.limit;
            if (oneDataOffer.cost) newOffer.cost = oneDataOffer.cost;

            this.allParseOffers.push(newOffer);
        }

    };

    this.prepareChooseOneRequiredFromBigRequiredListOffer = (oneDataOffer) => {
        let required = oneDataOffer.required;

        for (let i = 0; i < required.length; i++) {
            let oneRequired = required[i];
            let requiredId = oneRequired[0];

            let maxAmount = this.getAmountAvailable(oneDataOffer.id, requiredId);

            let newOffer = {
                id: oneDataOffer.id,
                affectedId: this.lastCreatedId,
                mode: oneDataOffer.mode,
                required: [oneRequired],
                recived: oneDataOffer.recived,
                category: null,
                maxAmount: maxAmount,
                resultItemName: null
            };

            this.lastCreatedId++;

            if (oneDataOffer.limit) newOffer.limit = oneDataOffer.limit;
            if (oneDataOffer.cost) newOffer.cost = oneDataOffer.cost;

            this.allParseOffers.push(newOffer);
        }
    };

    this.blockMove = function() {
        Engine.lock.add('barter');
    };

    this.unblockMove = function() {
        Engine.lock.remove('barter');
    };

    this.close = () => {
        this.unblockMove();

        this.wnd.remove();
        Engine.tpls.removeCallback(Engine.itemsFetchData.NEW_BARTER_TPL);
        Engine.tpls.deleteMessItemsByLoc('f');
        Engine.barter = false;

        callCheckCanFinishExternalTutorialCloseBarter();
    };

    const callCheckCanFinishExternalTutorialCloseBarter = () => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_BREAK.CLOSE_BARTER,
            TutorialData.ON_FINISH_TYPE.BREAK,
            true
        );

        Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
    };


    this.tLang = (key) => {
        return _t(key)
    }

    this.closeOtherWindows = () => {
        const v = Engine.windowsData.windowCloseConfig.BARTER;
        Engine.windowCloseManager.callWindowCloseConfig(v);
    }

};