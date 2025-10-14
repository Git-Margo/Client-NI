module.exports = function() {


    let KIND_LINKED_ITEM = {
        ITEM: "ITEM",
        TPL: "TPL"
    };

    let block = {
        [KIND_LINKED_ITEM.ITEM]: {},
        [KIND_LINKED_ITEM.TPL]: {}
    };

    let list = {
        [KIND_LINKED_ITEM.ITEM]: {},
        [KIND_LINKED_ITEM.TPL]: {}
    };

    const init = () => {
        initFetch();
    };

    const initFetch = () => {
        Engine.items.fetch(Engine.itemsFetchData.NEW_CHAT_LINKED_ITEM, newChatLinkedItemItem);
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_CHAT_LINKED_TPL, newChatLinkedItemTpl);
    };

    const newChatLinkedItemItem = (data) => {
        let hid = data.hid;
        let _list = list[KIND_LINKED_ITEM.ITEM];

        if (_list[hid]) return;

        _list[hid] = data;
    };

    const newChatLinkedItemTpl = (data) => {
        let id = data.id;
        let _list = list[KIND_LINKED_ITEM.TPL];

        if (_list[id]) return;

        _list[id] = data;
    };

    const fetchItem = (id, kindLinkedItem, callback) => {

        let _list = list[kindLinkedItem];
        let _block = block[kindLinkedItem];

        if (_list[id]) {
            callback(_list[id]);
            return
        }

        if (_block[id]) return;

        _block[id] = setTimeout(() => {
            _block[id] = false
        }, 500);

        _g(`chat&getContent=${kindLinkedItem}%23${id}`, () => {
            callback(_list[id])
        })
    };

    const createShortLinkedItemSpan = (kindLinkedItem, hid, name) => {
        let $span = $('<span>');
        //let onEnter	= false;

        name = escapeHTML(name, true);

        $span.html(`[${name}]`);
        $span.addClass('linked-chat-item');

        addEventToLinkedItemSpan(kindLinkedItem, hid, $span);

        return $span;
    };

    const addEventToLinkedItemSpan = (kindLinkedItem, hid, $span) => {
        let onEnter = false;

        $span.on("mouseenter", function(e) {
            onEnter = true;
            if ($(this).hasClass('linked-chat-item-tip-created')) return;


            fetchItem(hid, kindLinkedItem, (itemData) => {
                if (!itemData) return;
                $(this).data('item', itemData);
                itemData.setTip($(this))
                // $(this).tip(MargoTipsParser.getTip(itemData), 't_item', itemData.itemType);
                $(this).addClass('linked-chat-item-tip-created');

                if (onEnter) $(this).tipShow(e);
            });
        });

        $span.on("mouseout", (e) => {
            onEnter = false;
        });

        $span.on("contextmenu longpress", function(e, mE) {
            if (!$(this).hasClass('linked-chat-item-tip-created')) return
            fetchItem(hid, kindLinkedItem, (itemData) => {

                let blockAttr = {
                    use: true,
                    move: true,
                    attachToQuickItems: true,
                    moveToEnhancement: true,
                    shop: true,
                    enhance: true,
                    play: true,
                    bonus_not_selected: true,
                    split: true,
                    drop: true,
                    destroy: true
                };

                itemData.createOptionMenu(getE(e, mE), false, blockAttr);
            });
        });
    };

    const parseReceiveMessageWithLinkedItem = (str, escStringMode, unsecure) => {

        let kindLinkedItem = getKindLinkedItem(str, escStringMode);

        if (kindLinkedItem == null) return;

        let data = getPrepareDataToCreateElementsArray(str, kindLinkedItem, escStringMode, unsecure);
        let elementsArray = getArrayWith$spanTextAnd$linkedItems(kindLinkedItem, data.htmlString, data.itemsData, unsecure);

        return elementsArray;
    };

    const getKindLinkedItem = (str, escStringMode) => {

        let isItemLinkedItem = checkIsItemLinkedItem(str, escStringMode);
        let isTplLinkedItem = checkIsTplLinkedItem(str, escStringMode);

        if (isItemLinkedItem) return KIND_LINKED_ITEM.ITEM;
        if (isTplLinkedItem) return KIND_LINKED_ITEM.TPL;

        errorReport('ChatLinkedItemsManager', 'getKindLinkedItem', 'not find KindLinkedItem in string!', str);

        return null;
    };

    const getPrepareDataToCreateElementsArray = (str, kindLinkedItem, escStringMode, unsecure) => {
        let myRe = getReceiveMessagePattern(kindLinkedItem, escStringMode);
        let lengthStr = str.length;
        let counter = 0;
        let lastIndex = 0;
        let htmlString = [];
        let itemsData = [];
        let myArray;

        while ((myArray = myRe.exec(str)) !== null) {

            let index = myArray.index;

            if (lastIndex < index) {
                let text = str.substr(lastIndex, index - lastIndex);

                htmlString.push(createTxtSpanString(text, unsecure));
                itemsData.push(getItemData(str, kindLinkedItem, myArray, escStringMode));
                htmlString.push(createItemSpanString(counter, unsecure));

            } else {
                itemsData.push(getItemData(str, kindLinkedItem, myArray, escStringMode));
                htmlString.push(createItemSpanString(counter, unsecure));
            }

            counter++;

            lastIndex = myArray.index + myArray[0].length;
        }

        if (lastIndex != lengthStr) {
            let text = str.substr(lastIndex, lengthStr - 1);

            htmlString.push(createTxtSpanString(text, unsecure));
        }

        return {
            htmlString,
            itemsData
        }
    };

    const getArrayWith$spanTextAnd$linkedItems = (kindLinkedItem, allText, itemsData, unsecure) => {
        //let $join         = $('<div>' + allText.join('') + '</div>');
        let $join = unsecure ? $('<div>' + allText.join('') + '</div>') : $('<div>').html(allText);
        let elementsArray = [];

        for (let i in itemsData) {
            let d = itemsData[i];
            let $el = createShortLinkedItemSpan(kindLinkedItem, d.hid, d.name);

            $join.find('.item-' + i).replaceWith($el);
        }

        $join.children().each(function() {
            elementsArray.push($(this));
        });

        return elementsArray;
    };

    const createTxtSpanString = (text, unsecure) => {
        //return `<span class="text">${text}</span>`
        return unsecure ? `<span class="text">${text}</span>` : $('<span>').text(text);
    };

    const createItemSpanString = (counter, unsecure) => {
        //return `<span class="item-${counter}"></span>`
        return unsecure ? `<span class="mark-message-span item-${counter}"></span>` : $('<span>').addClass(`mark-message-span item-${counter}`);
    };

    const getItemData = (str, kindLinkedItem, myArray, escStringMode) => {
        let text = myArray[0];
        let params = text.split(":");
        let hid = params[0].replace(kindLinkedItem + "#", '');

        let valToReplaceAll = escStringMode ? '&quot;' : '"';
        let name = params[1].replaceAll(valToReplaceAll, '');

        return {
            name: name,
            hid: hid
        }
    };

    const checkSendMessageIsItemLinked = (str) => {
        let myRe = getSendMessagePattern();

        return myRe.exec(str);
    };

    const getReplacedStrWithoutWorldWhereHeroStay = (str) => {
        let world = Engine.worldConfig.getWorldName();

        // let r     = new RegExp(KIND_LINKED_ITEM.ITEM + '#([0-9]+)+(\\.' + world +')?', "g");
        // let r     = new RegExp(KIND_LINKED_ITEM.ITEM + '#([0-9a-z]{64})+(\\.' + world +')?', "g");
        let r = new RegExp(KIND_LINKED_ITEM.ITEM + '#([0-9a-z]{64}|[0-9]{7,11})+(\\.' + world + ')?', "g");

        let newStr = str.replace(r, KIND_LINKED_ITEM.ITEM + "#$1");

        return newStr
    };

    const checkLinkedItemsAreOnlyFromWorldWhereHeroStay = (str) => {
        let myArray = null;
        let correct = true;
        let myRe = getSendMessagePattern();

        while ((myArray = myRe.exec(str)) !== null) {
            if (myArray[2]) {
                correct = false
            }
        }

        return correct
    };

    //const manageItemLinked = (str) => {
    //
    //	str           = getReplacedStrWithoutWorldWhereHeroStay(str);
    //	let isCorrect = checkLinkedItemsAreOnlyFromWorldWhereHeroStay(str);
    //
    //	if (isCorrect)  Engine.chat.sendRequest(str);
    //	else            alertOfGetItemsFromAnotherWorld(str)
    //};

    //const alertOfGetItemsFromAnotherWorld = (str) => {
    //	let msg = _t("item_from_another_world");
    //	Engine.chat.alert(msg, () => {
    //		Engine.chat.sendRequest(str);
    //	});
    //};

    const checkReceiveMessageHaveLinkedItem = (str, escStringMode) => {
        let isItemLinkedItem = checkIsItemLinkedItem(str, escStringMode);
        let isTplLinkedItem = checkIsTplLinkedItem(str, escStringMode);

        return isItemLinkedItem || isTplLinkedItem;
    };

    const checkIsItemLinkedItem = (str, escStringMode) => {
        return checkLinkedItemByKind(KIND_LINKED_ITEM.ITEM, str, escStringMode);
    };

    const checkIsTplLinkedItem = (str, escStringMode) => {
        return checkLinkedItemByKind(KIND_LINKED_ITEM.TPL, str, escStringMode);
    };

    const checkLinkedItemByKind = (kindLinkedItem, str, escStringMode) => {
        let re = getReceiveMessagePattern(kindLinkedItem, escStringMode);

        return re.exec(str) ? true : false
    };

    // const isTplLinkedItem = (str, escStringMode) => {
    // 	let itemRe  = getReceiveMessagePattern(KIND_LINKED_ITEM.TPL, escStringMode);
    //
    // 	return itemRe.exec(str) ? true : false
    // };

    const getReceiveMessagePattern = (kindLinkedItem, escStringMode) => {
        let myRe;

        switch (kindLinkedItem) {
            case KIND_LINKED_ITEM.ITEM:

                if (escStringMode) myRe = new RegExp(kindLinkedItem + `#([0-9a-z]{64}|[0-9]{7,11}):(\&quot;.*?&quot;)`, "g");
                else myRe = new RegExp(kindLinkedItem + `#([0-9a-z]{64}|[0-9]{7,11}):(\".*?")`, "g");

                break;
            case KIND_LINKED_ITEM.TPL:

                if (escStringMode) myRe = new RegExp(kindLinkedItem + `#([0-9]+):(\&quot;.*?&quot;)`, "g");
                else myRe = new RegExp(kindLinkedItem + `#([0-9]+):(\".*?")`, "g");

                break
        }

        return myRe;
    };

    const getSendMessagePattern = () => {

        return new RegExp(KIND_LINKED_ITEM.ITEM + '#([0-9a-z]{64}|[0-9]{7,11})+(\\.[a-z]+)?', "g");
    };

    const changeStringOn = (str, myRe, tag, newIndex) => {
        let lengthStr = str.length;
        // let counter     = 0;
        let lastIndex = 0;
        let htmlString = [];
        let itemsData = {};
        let myArray;

        while ((myArray = myRe.exec(str)) !== null) {

            let index = myArray.index;

            if (lastIndex < index) {
                let text = str.substr(lastIndex, index - lastIndex);

                htmlString.push(text);
                htmlString.push(tag + '_' + newIndex);
                //itemsData.push(myArray[0]);
            } else {
                htmlString.push(tag + '_' + newIndex);
                //itemsData.push(myArray[0]);
            }

            itemsData[newIndex] = myArray[0];
            newIndex++;

            // counter++;

            lastIndex = myArray.index + myArray[0].length;
        }

        if (lastIndex != lengthStr) {
            let text = str.substr(lastIndex, lengthStr - 1);

            htmlString.push(text);
        }

        return {
            htmlString,
            itemsData
        }
    }

    this.init = init;
    this.checkReceiveMessageHaveLinkedItem = checkReceiveMessageHaveLinkedItem;
    this.getReplacedStrWithoutWorldWhereHeroStay = getReplacedStrWithoutWorldWhereHeroStay;
    this.checkLinkedItemsAreOnlyFromWorldWhereHeroStay = checkLinkedItemsAreOnlyFromWorldWhereHeroStay;
    this.checkSendMessageIsItemLinked = checkSendMessageIsItemLinked;
    //this.manageItemLinked = manageItemLinked;
    this.addEventToLinkedItemSpan = addEventToLinkedItemSpan;
    this.parseReceiveMessageWithLinkedItem = parseReceiveMessageWithLinkedItem;
    this.changeStringOn = changeStringOn;
    this.getSendMessagePattern = getSendMessagePattern;
};