let AuctionData = require('core/auction/AuctionData');
let Templates = require('../Templates');

module.exports = function AuctionItemCategory() {

    let $dropDownMenuSectionData = {};
    let showCategory = 0;
    let $categoryList = {};

    const init = () => {

        initYourAuctionMenu();
        initAllCategory();
    };

    const initYourAuctionMenu = () => {
        let category = AuctionData.MY_AUCTION
        let strHeader = _t('auction_type', null, 'auctions');
        let $yourAuction = createDropdownMenuSection(category, strHeader);
        let $categoryWrapper = $yourAuction.find('.item-category-wrapper');

        $yourAuction.addClass('type-auction-switch');

        for (let k in AuctionData.TYPE_OF_AUCTION) {
            let auctionMenuItem = createAuctionMenuItem(k, _t(k + '_auction'));

            $categoryWrapper.append(auctionMenuItem);
        }

        $categoryWrapper.find('.action-menu-item').first().addClass('selected');

        addDropDownMenuSectionToList(category, $yourAuction);

        let content = Engine.auctions.getAuctionWindow().getContent();
        let $allCategoriesAuction = content.find('.all-categories-auction');

        $allCategoriesAuction.append($yourAuction);
    }

    const createAuctionMenuItem = (key, label) => {
        let $auctionMenuItem = Templates.get("action-menu-item");

        $auctionMenuItem.find('.label').html(label);

        $auctionMenuItem.on('click', () => {
            let v;
            let content = Engine.auctions.getAuctionWindow().getContent();

            content.find('.type-auction-switch').find('.selected').removeClass('selected');
            $auctionMenuItem.addClass('selected');

            if (key == AuctionData.TYPE_OF_AUCTION.NORMAL) v = 0;
            else v = 1;

            Engine.auctions.setAuctionMode(v);
            // Engine.auctions.getAuctionWindow().clearRecordListAndOffersTableAndAttachHeaderOfTable()
            Engine.auctions.getAuctionRequest().firstPageOfMainAuctionRequest();
            Engine.auctions.getAuctionWindow().setVisibleAllAuctionsInfoWrapper(false);
            Engine.auctions.getAuctionWindow().setVisibleAmountOfAuction(true);
        });

        return $auctionMenuItem
    }

    const setShowCategory = (_showCategory) => {
        showCategory = _showCategory;
    };

    const clearItemCategory = () => {
        setShowCategory(0);
        removeClassSelectedFromCategory()
    }

    const removeActiveCategory = () => {

    }

    const initAllCategory = () => {

        let content = Engine.auctions.getAuctionWindow().getContent();
        let $allCategoriesAuction = content.find('.all-categories-auction');

        for (let category in AuctionData.CATEGORY) {

            let o = AuctionData.CATEGORY[category];
            let strHeader = getTextCat(category);
            let $oneTypeCategory = createDropdownMenuSection(category, strHeader);
            let $categoryWrapper = $oneTypeCategory.find('.item-category-wrapper');

            addDropDownMenuSectionToList(category, $oneTypeCategory)

            for (var t in o) {
                var id = o[t];
                let $oneCategory = createOneCategory($oneTypeCategory, id);

                $categoryList[id] = $oneCategory;
                $categoryWrapper.append($oneCategory);
            }

            $allCategoriesAuction.append($oneTypeCategory);
        }
    };

    const createDropdownMenuSection = function(categoryName, strHeader) {
        let $oneTypeCategory = Templates.get("drop-down-menu-section");

        $oneTypeCategory.find(".type-header-label").html(strHeader);

        $oneTypeCategory.find('.type-header').on('click', () => {
            toggleTypeOfCategoryState(categoryName);
            manageVisibleTypeOfCategory(categoryName)
            Engine.auctions.getAuctionWindow().updateScroll();
        });

        return $oneTypeCategory;
    };

    const toggleTypeOfCategoryState = (category) => {
        $dropDownMenuSectionData[category].state = !$dropDownMenuSectionData[category].state;
    };

    const manageVisibleTypeOfCategory = (category) => {
        let displayCss;
        let arrowClass;
        let o = $dropDownMenuSectionData[category];

        if (o.state) {
            displayCss = 'block';
            arrowClass = 'up-arrow';
        } else {
            displayCss = 'none';
            arrowClass = 'down-arrow';
        }

        o.$element.find('.state-of-type').removeClass('up-arrow down-arrow').addClass(arrowClass);
        o.$element.find('.content-wrapper').css('display', displayCss)
    };

    const addDropDownMenuSectionToList = (name, $oneHeaderCategoryMenu) => {
        $dropDownMenuSectionData[name] = {
            $element: $oneHeaderCategoryMenu,
            state: true
        };
    }

    function createOneCategory(cl, id) {
        let $oneCategoryAuction = Templates.get("one-category-auction");

        $oneCategoryAuction.tip(getTextTab(id));
        $oneCategoryAuction.find(".icon").addClass("cl-" + id);

        $oneCategoryAuction.on("click", function() {
            let newShowCategory = getNewShowCategory(id);
            clickCategoryOfItem(1, newShowCategory);
        });

        return $oneCategoryAuction;
    }

    const addClassSelectedToCategory = () => {
        //if (showCategory == 0) return
        if (!isShowCategoryExist()) return

        let content = Engine.auctions.getAuctionWindow().getContent();

        content.find('.one-category-auction').find(`.icon.cl-${showCategory}`).parent().addClass('selected');
    };

    const isShowCategoryExist = () => {
        return showCategory != 0;
    };

    const removeClassSelectedFromCategory = () => {
        let content = Engine.auctions.getAuctionWindow().getContent();

        content.find('.one-category-auction.selected').removeClass('selected');
    }

    const getNewShowCategory = (id) => {
        return showCategory == id ? 0 : id;
    }

    function getTextTab(val) {
        return _t("au_cat" + val, null, "auction");
    }

    const getTextCat = (val) => {
        return _t("tab_" + val, null, "auction");
    };

    const clickCategoryOfItem = (page, idCategory) => {
        removeClassSelectedFromCategory();
        setShowCategory(idCategory);
        addClassSelectedToCategory();

        // Engine.auctions.getAuctionWindow().clearRecordListAndOffersTableAndAttachHeaderOfTable();
        Engine.auctions.getAuctionRequest().mainAuctionRequest(page);
        Engine.auctions.getAuctionWindow().setVisibleAllAuctionsInfoWrapper(false);
        Engine.auctions.getAuctionWindow().setVisibleAmountOfAuction(true);
    };

    const getShowCategory = () => {
        return showCategory;
    }

    this.init = init;
    this.getShowCategory = getShowCategory;
    this.isShowCategoryExist = isShowCategoryExist;
    //this.setShowCategory = setShowCategory;
    this.clearItemCategory = clearItemCategory;

}