let Templates = require('../Templates');
let AuctionData = require('core/auction/AuctionData');
let Storage = require('core/Storage');
let ProfData = require('core/characters/ProfData');
const InputMaskData = require('core/InputMaskData');

module.exports = function() {

    let $auctionContent = null;
    let content = null;

    let $auctionTypeMenu = null;
    let $itemProfMenu = null;
    let $itemRarityMenu = null;
    let $newFilterMenu = null;

    let storageFilters = null;

    let AUCTION_FILTERS = 'AUCTION_FILTERS';

    let $nameItemInput = null;
    let $minPriceInput = null;
    let $maxPriceInput = null;
    let $minLevelInput = null;
    let $maxLevelInput = null;

    const init = () => {
        $auctionContent = Engine.auctions.getAuctionWindow().getContent();

        initContent();
        getFiltersFromLocalStorage();
        initVars();
        initAllMenus();
        initButtons();
        createPlaceHoldersInInput();
        attachKeysEventToTextInput();
    };

    const initVars = () => {
        $auctionTypeMenu = content.find('.auction-type-wrapper').find('.menu-wrapper');
        $itemProfMenu = content.find('.item-prof-wrapper').find('.menu-wrapper');
        $itemRarityMenu = content.find('.item-rarity-wrapper').find('.menu-wrapper');
        $newFilterMenu = content.find('.new-filter-wrapper').find('.menu-wrapper');

        $nameItemInput = createNiInput({
            cl: 'name-item-input',
            keyUpClb: updateInput,
            focusoutClb: updateSetFilters,
            clearClb: updateSetFilters
        });
        $minPriceInput = createNiInput({
            cl: 'min-price-input',
            keyUpClb: updateInput,
            focusoutClb: updateSetFilters,
            clearClb: updateSetFilters,
            type: InputMaskData.TYPE.NUMBER_WITH_KMG
        });
        $maxPriceInput = createNiInput({
            cl: 'max-price-input',
            keyUpClb: updateInput,
            focusoutClb: updateSetFilters,
            clearClb: updateSetFilters,
            type: InputMaskData.TYPE.NUMBER_WITH_KMG
        });
        $minLevelInput = createNiInput({
            cl: 'min-level-input',
            keyUpClb: updateInput,
            focusoutClb: updateSetFilters,
            clearClb: updateSetFilters,
            type: InputMaskData.TYPE.NUMBER
        });
        $maxLevelInput = createNiInput({
            cl: 'max-level-input',
            keyUpClb: updateInput,
            focusoutClb: updateSetFilters,
            clearClb: updateSetFilters,
            type: InputMaskData.TYPE.NUMBER
        });

        content.find('.item-name-wrapper').append($nameItemInput);
        content.find('.item-price-wrapper').prepend($minPriceInput);
        content.find('.item-price-wrapper').append($maxPriceInput);
        content.find('.item-lvl-wrapper').prepend($minLevelInput);
        content.find('.item-lvl-wrapper').append($maxLevelInput);

        $nameItemInput = $nameItemInput.find('input');
        $minPriceInput = $minPriceInput.find('input');
        $maxPriceInput = $maxPriceInput.find('input');
        $minLevelInput = $minLevelInput.find('input');
        $maxLevelInput = $maxLevelInput.find('input');
    };

    const updateInput = (val, e) => {
        //console.log(val, e);focusoutClb:.log(val, e,
        if (e.originalEvent.key == "Enter") updateSetFilters();
    }

    const initContent = () => {
        content = Templates.get('auction-search-item');
        $auctionContent.find('.main-column-auction').prepend(content)
    };

    const createPlaceHoldersInInput = () => {
        let minPrice = Engine.auctions.tLang('min-price');
        let maxPrice = Engine.auctions.tLang('max-price');
        let minLevel = Engine.auctions.tLang('min-level');
        let maxLevel = Engine.auctions.tLang('max-level');

        createInputPlaceholder(_t('name_th', null, 'auction'), $nameItemInput);
        createInputPlaceholder(minPrice, $minPriceInput);
        createInputPlaceholder(maxPrice, $maxPriceInput);
        createInputPlaceholder(minLevel, $minLevelInput);
        createInputPlaceholder(maxLevel, $maxLevelInput);
    };

    const getValFromInput = ($element) => {
        return $element.val();
    };

    const getFiltersFromLocalStorage = () => {
        let data = Storage.get(AUCTION_FILTERS, []);

        if (!checkCorrectData(data)) {
            data = [];
        }

        fillIdToCompatibleNewCreateMenu(data);

        storageFilters = data;
    };

    const fillIdToCompatibleNewCreateMenu = (data) => {
        const FILTER_ID = AuctionData.FILTER_KEYS.FILTER_ID;

        for (let index in data) {
            let e = data[index];
            if (!isset(e[FILTER_ID])) {
                e[FILTER_ID] = parseInt(index);
            }
        }
    };

    const checkCorrectData = (data) => {
        let filterKeys = AuctionData.FILTER_KEYS;
        for (let k in data) {
            let d = data[k]
            let notExistKey = null;

            if (!isset(d[filterKeys.FILTER_NAME])) notExistKey = filterKeys.FILTER_NAME;
            if (!isset(d[filterKeys.MIN_LEVEL])) notExistKey = filterKeys.MIN_LEVEL;
            if (!isset(d[filterKeys.MAX_LEVEL])) notExistKey = filterKeys.MAX_LEVEL;
            if (!isset(d[filterKeys.RARITY])) notExistKey = filterKeys.RARITY;
            if (!isset(d[filterKeys.MIN_PRICE])) notExistKey = filterKeys.MIN_PRICE;
            if (!isset(d[filterKeys.MAX_PRICE])) notExistKey = filterKeys.MAX_PRICE;
            if (!isset(d[filterKeys.AUCTION_TYPE])) notExistKey = filterKeys.AUCTION_TYPE;
            if (!isset(d[filterKeys.PROF])) notExistKey = filterKeys.PROF;
            if (!isset(d[filterKeys.NAME_ITEM])) notExistKey = filterKeys.NAME_ITEM;

            if (notExistKey != null) {
                errorReport('AuctionSearchItems.js', 'checkCorrectData', `Key: ${notExistKey} not exist!`, d);
                return false
            }
        }
        return true;
    };

    const setFiltersInLocalStorage = () => {
        Storage.set(AUCTION_FILTERS, storageFilters);
    };

    const addToStorageFilters = (id, filterName, minLevel, maxLevel, rarity, minPrice, maxPrice, auctionType, prof, nameItem) => {

        let filterKeys = AuctionData.FILTER_KEYS;
        let o = {
            [filterKeys.FILTER_ID]: id,
            [filterKeys.FILTER_NAME]: filterName,
            [filterKeys.MIN_LEVEL]: minLevel,
            [filterKeys.MAX_LEVEL]: maxLevel,
            [filterKeys.RARITY]: rarity,
            [filterKeys.MIN_PRICE]: minPrice,
            [filterKeys.MAX_PRICE]: maxPrice,
            [filterKeys.AUCTION_TYPE]: auctionType,
            [filterKeys.PROF]: prof,
            [filterKeys.NAME_ITEM]: nameItem
        };

        storageFilters.push(o)
    }

    const removeFromStorageFilters = (id) => {
        if (!checkFilterExist(id)) {
            errorReport('AuctionSearchItems.js', 'overrideFilterAction', `Filter index not exist! : ${index}`, storageFilters);
            return;
        }

        let index = getIndexById(id);

        deleteElementFromArray(index, storageFilters);
    };

    const initButtons = () => {
        let $btn = createButton(_t('filter_refresh', null, 'auction'), ['green', 'small'], () => {

            let auctions = Engine.auctions;

            auctions.getAuctionRequest().firstPageOfMainAuctionRequest();
            auctions.getAuctionWindow().setVisibleAllAuctionsInfoWrapper(false);
            auctions.getAuctionWindow().setVisibleAmountOfAuction(true);
        });

        $auctionContent.find('.refresh-button-wrapper').append($btn);
    };

    const attachKeysEventToTextInput = () => {
        let textInput = [

            $nameItemInput,
            $minPriceInput,
            $maxPriceInput,
            $minLevelInput,
            $maxLevelInput
        ];

        for (let k in textInput) {
            attachKeyEventToOneFilter(textInput[k])
        }
    };

    const attachKeyEventToOneFilter = (oneEvent) => {
        oneEvent.on('keydown', function(e) {
            if (e.key == "Enter") {
                callFindItems();
            }
        });
    };

    const callFindItems = () => {
        Engine.auctions.getAuctionRequest().firstPageOfMainAuctionRequest();
    };

    const getFilterString = (_page) => {
        let auctions = Engine.auctions
        let tabType = auctions.getActualKindOfAuction();
        let auctionMode = auctions.getAuctionMode();
        let page = _page ? _page : auctions.getAuctionPages().getCurrentPage();
        let filterKeys = AuctionData.FILTER_KEYS;
        let o = geValFromAllInput();

        changeNullToEmptyString(o);

        return esc(o[filterKeys.MIN_LEVEL]) +
            '|' + esc(o[filterKeys.MAX_LEVEL]) +
            '|' + o[filterKeys.PROF] +
            '|' + o[filterKeys.RARITY] +
            '|' + esc(o[filterKeys.MIN_PRICE]) +
            '|' + esc(o[filterKeys.MAX_PRICE]) +
            '|' + o[filterKeys.AUCTION_TYPE] +
            '|' + tabType +
            '|' + auctionMode +
            '|' + page +
            '|' + esc(o[filterKeys.NAME_ITEM]);
    };

    const changeNullToEmptyString = (obj) => {
        for (let k in obj) {
            if (obj[k] == null) obj[k] = '';
        }
    };

    const geValFromAllInput = () => {
        let minLevel = getValFromInput($minLevelInput);
        let maxLevel = getValFromInput($maxLevelInput);
        let minPrice = getValFromInput($minPriceInput);
        let maxPrice = getValFromInput($maxPriceInput);
        let nameItem = getValFromInput($nameItemInput);

        let rarity = $itemRarityMenu.getValue();
        let auctionType = $auctionTypeMenu.getValue();
        let prof = $itemProfMenu.getValue();

        minLevel = isNaN(parseInt(minLevel)) ? null : parsePrice(minLevel);
        maxLevel = isNaN(parseInt(maxLevel)) ? null : parsePrice(maxLevel);
        minPrice = isNaN(parseInt(minPrice)) ? null : parsePrice(minPrice);
        maxPrice = isNaN(parseInt(maxPrice)) ? null : parsePrice(maxPrice);

        nameItem = nameItem == '' ? null : nameItem;

        let filterKeys = AuctionData.FILTER_KEYS;

        return {
            [filterKeys.NAME_ITEM]: nameItem,
            [filterKeys.MIN_LEVEL]: minLevel,
            [filterKeys.MAX_LEVEL]: maxLevel,
            [filterKeys.PROF]: prof,
            [filterKeys.MIN_PRICE]: minPrice,
            [filterKeys.MAX_PRICE]: maxPrice,
            [filterKeys.RARITY]: rarity,
            [filterKeys.AUCTION_TYPE]: auctionType
        }
    };

    // const initChangeEventInInput = () => {
    // 	$nameItemInput.on('change', ()=> {overrideFilterAction()});
    // 	$minPriceInput.on('change', ()=> {overrideFilterAction()});
    // 	$maxPriceInput.on('change', ()=> {overrideFilterAction()});
    // 	$minLevelInput.on('change', ()=> {overrideFilterAction()});
    // 	$maxLevelInput.on('change', ()=> {overrideFilterAction()});
    // }

    const initAllMenus = () => {

        let typeAucionMenu = [{
                text: _t('auction_type', null, 'auctions'),
                val: AuctionData.TYPE_OF_BUY_AUCTION.ALL
            },
            {
                text: _t('au_catmybids', null, 'auction'),
                val: AuctionData.TYPE_OF_BUY_AUCTION.BIDS
            },
            {
                text: _t('filter_buyout', null, 'auction'),
                val: AuctionData.TYPE_OF_BUY_AUCTION.BUY_NOW
            },
        ];

        let rarityMenuItem = [{
                text: _t('rarity', null, 'auctions'),
                val: null
            },
            {
                text: getTextType("all"),
                val: AuctionData.TYPE_OF_RARITY.ALL
            },
            {
                text: getTextType("unique"),
                val: AuctionData.TYPE_OF_RARITY.UNIQUE
            },
            {
                text: getTextType("heroic"),
                val: AuctionData.TYPE_OF_RARITY.HEROIC
            },
            {
                text: getTextType("legendary"),
                val: AuctionData.TYPE_OF_RARITY.LEGENDARY
            }
        ];

        let profMenuItem = [{
                text: Engine.auctions.tLang('filter_prof'),
                val: null
            },
            {
                text: getTextProf("warrior"),
                val: ProfData.WARRIOR
            },
            {
                text: getTextProf("paladin"),
                val: ProfData.PALADIN
            },
            {
                text: getTextProf("mage"),
                val: ProfData.MAGE
            },
            {
                text: getTextProf("hunter"),
                val: ProfData.HUNTER
            },
            {
                text: getTextProf("bdancer"),
                val: ProfData.BLADE_DANCER
            },
            {
                text: getTextProf("tracker"),
                val: ProfData.TRACKER
            }
        ];

        $itemProfMenu.createMenu(profMenuItem, true, function(e) {
            updateSetFilters()
        });

        $auctionTypeMenu.createMenu(typeAucionMenu, true, function(e) {
            updateSetFilters();
        });

        $itemRarityMenu.createMenu(rarityMenuItem, true, function(e) {
            updateSetFilters()
        });

        updateNewFilterMenu();
    };

    const updateSetFilters = (val, e) => {
        if (e && e.relatedTarget && e.relatedTarget.classList.contains('close-button')) return false;

        let auctions = Engine.auctions

        callFindItems();
        overrideFilterAction();
        auctions.getAuctionWindow().setVisibleAllAuctionsInfoWrapper(false);
        auctions.getAuctionWindow().setVisibleAmountOfAuction(true);
    }

    const overrideFilterAction = () => {
        let id = $newFilterMenu.getValue();

        //if (index == AuctionData.FILTER_ID.EMPTY_FILTER || index == AuctionData.FILTER_ID.ADD_FILTER) return;
        if (id == AuctionData.FILTER_ID.EMPTY_FILTER) {
            return;
        }

        if (!checkFilterExist(id)) {
            errorReport('AuctionSearchItems.js', 'overrideFilterAction', `Filter index not exist! : ${id}`, storageFilters);
            return;
        }

        let filterName = getFilterNameById(id);

        updateFilterFromLocalStorage(filterName, id);
    };

    const updateFilterFromLocalStorage = (filterName, id) => {

        let data = geValFromAllInput();
        let filterKeys = AuctionData.FILTER_KEYS;

        removeFromStorageFilters(id);

        addToStorageFilters(
            id,
            filterName,
            data[filterKeys.MIN_LEVEL],
            data[filterKeys.MAX_LEVEL],
            data[filterKeys.RARITY],
            data[filterKeys.MIN_PRICE],
            data[filterKeys.MAX_PRICE],
            data[filterKeys.AUCTION_TYPE],
            data[filterKeys.PROF],
            data[filterKeys.NAME_ITEM]
        )
        setFiltersInLocalStorage();
    };

    const createDataToNewFilterMenu = () => {
        let menu = [{
            text: _t('no_filter', null, 'auction'),
            val: AuctionData.FILTER_ID.EMPTY_FILTER
        }]

        return menu;
    }

    const createDataWithAddAndRemoveItemMenu = () => {

        let addAndRemoveItemMenu = [];
        const FILTER_ID = AuctionData.FILTER_KEYS.FILTER_ID;
        const FILTER_NAME = AuctionData.FILTER_KEYS.FILTER_NAME;

        for (let index in storageFilters) {
            let d = storageFilters[index];
            let filterId = d[FILTER_ID];
            let filterName = d[FILTER_NAME];

            addAndRemoveItemMenu.push({
                text: filterName,
                val: filterId,
                id: filterId
            })
        }

        return addAndRemoveItemMenu;
    };

    const getRemoveCallbackToNewFilterItem = (id, data) => {
        removeFromStorageFilters(id);
        setFiltersInLocalStorage()
    };

    const updateNewFilterMenu = () => {
        let newFilterMenuItem = createDataToNewFilterMenu();
        let addAndRemoveItemMenu = createDataWithAddAndRemoveItemMenu();


        let createMenuAddNewOption = {
            addItemConfirmText: _t('give_filter_name', null, 'auction'),
            removeItemConfirmText: (val) => _t('confirm_delete_filter', {
                '%val%': val
            }, 'ah_filter_history'),
            addTipText: _t("new_filter", null, "ah_filter_history"),
            menuToAddAndRemove: addAndRemoveItemMenu,
            configAddItemIdAndName: {
                nameFromInputVal: true,
                firstPossibleId: 4
            },
            //autoSelect              : true,
            addItemConfirmValidate: function(val) {
                if (checkInputValIsEmptyProcedure(val)) return false;

                if (checkNameOfFilterExist(val)) {
                    message(Engine.auctions.tLang('filter_exist'));
                    return false;
                }

                return true;
            },
            addItemConfirmClb: (data) => {
                let val = data.val;
                let id = data.id;
                addFilterAction(val, id);
            },
            removeItemConfirmClb: (data) => {
                getRemoveCallbackToNewFilterItem(data.id, data)
            }
        };

        let options = {
            addNewOption: createMenuAddNewOption,
            parseHTML: false
        }

        $newFilterMenu.empty();
        $newFilterMenu.createMenu(newFilterMenuItem, true, function(value) {

            if (value == AuctionData.FILTER_ID.EMPTY_FILTER) {
                setClearFilter();
                callFindItems();
                return;
            }

            setFilterAction(value);
            callFindItems();
            Engine.auctions.getAuctionWindow().setVisibleAllAuctionsInfoWrapper(false);
            Engine.auctions.getAuctionWindow().setVisibleAmountOfAuction(true);
        }, options);
    };

    const checkNameOfFilterExist = (name) => {
        for (let k in storageFilters) {
            if (storageFilters[k].FILTER_NAME == name) return true
        }
        return false;
    };

    const addFilterAction = (filterName, filterId) => {
        let data = geValFromAllInput();
        let filterKeys = AuctionData.FILTER_KEYS;

        addToStorageFilters(
            filterId,
            filterName,
            data[filterKeys.MIN_LEVEL],
            data[filterKeys.MAX_LEVEL],
            data[filterKeys.RARITY],
            data[filterKeys.MIN_PRICE],
            data[filterKeys.MAX_PRICE],
            data[filterKeys.AUCTION_TYPE],
            data[filterKeys.PROF],
            data[filterKeys.NAME_ITEM]
        )
        setFiltersInLocalStorage();
    };

    const setFilterAction = (val) => {
        if (!checkFilterExist(val)) {
            errorReport('AuctionSearchItems', 'setFilterAction', `Filter not exist: ${val}`, storageFilters);
            return
        }

        setFilterByIdFilter(val);
    };

    //const checkFilterIdExist = (id) => {
    //	return isset(storageFilters[id])
    //};

    const getStorageFilter = (id) => {
        const FILTER_ID = AuctionData.FILTER_KEYS.FILTER_ID;

        for (let k in storageFilters) {
            let e = storageFilters[k];
            if (e[FILTER_ID] == id) {
                return e;
            }
        }
    }

    const setFilterByIdFilter = (id) => {
        let storageFilter = getStorageFilter(id);
        let data = copyStructure(storageFilter);

        changeNullToEmptyString(data);

        setFilterByDataObject(data)
    };

    const setClearFilter = () => {
        let filterKeys = AuctionData.FILTER_KEYS;
        setFilterByDataObject({
            [filterKeys.NAME_ITEM]: '',
            [filterKeys.MIN_LEVEL]: '',
            [filterKeys.MAX_LEVEL]: '',
            [filterKeys.MIN_PRICE]: '',
            [filterKeys.MAX_PRICE]: '',
            [filterKeys.RARITY]: '',
            [filterKeys.PROF]: '',
            [filterKeys.AUCTION_TYPE]: AuctionData.TYPE_OF_BUY_AUCTION.ALL,
        })
    }

    const setFilterByDataObject = (data) => {

        let filterKeys = AuctionData.FILTER_KEYS;

        $nameItemInput.val(data[filterKeys.NAME_ITEM]);
        $minPriceInput.val(data[filterKeys.MIN_PRICE]);
        $maxPriceInput.val(data[filterKeys.MAX_PRICE]);
        $minLevelInput.val(data[filterKeys.MIN_LEVEL]);
        $maxLevelInput.val(data[filterKeys.MAX_LEVEL]);

        $nameItemInput.trigger('change');
        $minPriceInput.trigger('change');
        $maxPriceInput.trigger('change');
        $minLevelInput.trigger('change');
        $maxLevelInput.trigger('change');

        $auctionTypeMenu.setOptionWithoutCallbackByValue(data[filterKeys.AUCTION_TYPE]);
        $itemProfMenu.setOptionWithoutCallbackByValue(data[filterKeys.PROF]);
        $itemRarityMenu.setOptionWithoutCallbackByValue(data[filterKeys.RARITY]);
    }

    const checkFilterExist = (id) => {
        //return storageFilters[index] ? true : false
        const FILTER_ID = AuctionData.FILTER_KEYS.FILTER_ID

        for (let k in storageFilters) {
            if (storageFilters[k][FILTER_ID] == id) {
                return true
            }
        }

        return false
    };

    const getIndexById = (id) => {
        //return storageFilters[index] ? true : false
        const FILTER_ID = AuctionData.FILTER_KEYS.FILTER_ID

        for (let k in storageFilters) {
            if (storageFilters[k][FILTER_ID] == id) {
                return k
            }
        }

        return null
    };

    const getFilterNameById = (id) => {
        let storageFilter = getStorageFilter(id);
        return storageFilter[AuctionData.FILTER_KEYS.FILTER_NAME];
    };

    function getTextProf(val) {
        return _t("prof_" + val, null, "auction");
    }

    function getTextType(val) {
        return _t("type_" + val, null, "auction");
    }

    // this.geValFromAllInput = geValFromAllInput;
    this.getFilterString = getFilterString;
    this.init = init;
};