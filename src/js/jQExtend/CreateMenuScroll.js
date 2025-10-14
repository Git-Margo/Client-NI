var Templates = require('@core/Templates');
module.exports = new(function() {
    /**
     * add dropdown menu to <div class="menu">
     * @param menu [] - array with objects like {text: '+', selectedText: 'Nowy filtr', disableSelected: true, val: -1}
     * @param setFirstOption - boolean
     * @param clb - function
     * @param options - object
     */
    $.fn.createMenu = function(menu, setFirstOption, clb = null, options = {}) {

        let moduleData = {
            fileName: "CreateMenuScroll.js"
        };

        let self = $(this);

        //if (!self.hasClass('menu') || !$.isArray(menu)) return;

        setFirstOption = setFirstOption || false;

        const ADD_NEW_ITEM = "ADD_NEW_ITEM";
        const MENU_ITEM_ID = "menu-item-id";
        const defaultOptions = {
            capitalize: true,
            parseHTML: true
        };
        const opts = $.extend({}, defaultOptions, options);

        let $menuItems = [];
        let choosen = null;
        let selected = null;
        let bcontainer = null;
        let showed = false;
        let $scroll_wrapper = null;
        let $wrapper = null;
        let $menuWrapper = null;
        let $dropDownMenu = null;
        let $menuArrow = null;
        let tmp = null;
        let bck = null;


        function checkCorrectMenuData() {
            if (!self.hasClass('menu') || !$.isArray(menu)) {
                errorReport(moduleData.fileName, "checkCorrectMenuData", "menu data incorrect", menu);
                return false;
            }

            let addNewOption = options.addNewOption;

            if (addNewOption) {
                if (!checkCorrectAddNewOptionData(addNewOption)) {
                    return false;
                }
            }

            return true;
        }

        function checkCorrectAddNewOptionData(addNewOption) {

            const FILE_NAME = moduleData.fileName;
            const FUNC = "checkCorrectAddNewOptionData";

            let addItemConfirmText = addNewOption.addItemConfirmText;
            let removeItemConfirmText = addNewOption.removeItemConfirmText;
            let addItemConfirmClb = addNewOption.addItemConfirmClb;
            let removeItemConfirmClb = addNewOption.removeItemConfirmClb;

            if (!addItemConfirmText) {
                errorReport(FILE_NAME, FUNC, "attr addItemConfirmText not exist", addNewOption);
                return false;
            }

            //if (typeof addItemConfirmText !== 'function') {
            //	errorReport(FILE_NAME, FUNC, "attr addItemConfirmText is not function", addNewOption);
            //	return false;
            //}

            if (!removeItemConfirmText) {
                errorReport(FILE_NAME, FUNC, "attr removeItemConfirmText not exist", addNewOption);
                return false;
            }

            if (typeof removeItemConfirmText !== 'function') {
                errorReport(FILE_NAME, FUNC, "attr removeItemConfirmText is not function", addNewOption);
                return false;
            }

            if (!addItemConfirmClb) {
                errorReport(FILE_NAME, FUNC, "attr addItemConfirmClb not exist", addNewOption);
                return false;
            }

            if (typeof addItemConfirmClb !== 'function') {
                errorReport(FILE_NAME, FUNC, "attr addItemConfirmClb is not function", addNewOption);
                return false;
            }

            if (!removeItemConfirmClb) {
                errorReport(FILE_NAME, FUNC, "attr removeItemConfirmClb not exist", addNewOption);
                return false;
            }

            if (typeof removeItemConfirmClb !== 'function') {
                errorReport(FILE_NAME, FUNC, "attr removeItemConfirmClb is not function", addNewOption);
                return false;
            }

            let menuToAddAndRemove = addNewOption.menuToAddAndRemove;

            if (!menuToAddAndRemove) {
                errorReport(FILE_NAME, FUNC, "attr menuToAddAndRemove not exist", addNewOption);
                return false;
            }

            for (let k in menuToAddAndRemove) {
                if (!isset(menuToAddAndRemove[k].id)) {
                    errorReport(FILE_NAME, FUNC, "in element of menuToAddAndRemove not exist id attr", addNewOption);
                    return false;
                }
            }

            return true;
        }

        function init() {
            bcontainer = Engine.interface.get$gameWindowPositioner().find('.mAlert-layer');

            if (options.addNewOption) {
                addNewOptionManage();
            }

            for (var i in menu) {
                let $menuItem = createMenuItem(menu[i]);
                $menuItems.push($menuItem);
            }

            self.addClass('menu-list');
            bck = $('<div>').addClass('bck button small green no-hover');

            bck.append($('<span>').addClass('menu-option'));
            self.append(bck);

            tmp = Templates.get('dropdown-menu');

            self.append(tmp);

            $menuArrow = self.find('.menu-arrow');
            $dropDownMenu = tmp;
            $menuWrapper = self.find('.menu-wrapper');
            $wrapper = self.find('.wrapper');

            if (!opts.capitalize) {
                $menuWrapper.addClass('menu-wrapper--no-capitalize');
            }

            $wrapper.append($('<div>').addClass('bck-wrapper').html($menuItems));

            // auto-css
            $menuWrapper.css({
                display: 'none',
                width: self.outerWidth() - 8
            });
            $menuWrapper.addScrollBar({
                track: true
            });
            $menuWrapper.on("mousewheel DOMMouseScroll", stopProp);
            $scroll_wrapper = $menuWrapper.find('.scrollbar-wrapper');
            $scroll_wrapper.on("mousedown", stopProp);

            if (setFirstOption) {
                setChosen($menuItems[0][0]);
                setFirst();
            }

            //var showed = false;
            self.off();
            self.on('click', () => {
                show()
            });

            self.find('.reset').on('click', (e) => {
                e.stopPropagation();
                setFirstWitchCallback()
            });
            self.find('.option').hover(function() {
                if (selected !== null) selected.removeClass("selected");
            });

            attachAllEvents();
        }

        function addNewOptionManage() {
            let addNewOption = options.addNewOption;
            let menuToAddAndRemove = addNewOption.menuToAddAndRemove;
            let configAddItemIdAndName = addNewOption.configAddItemIdAndName ? addNewOption.configAddItemIdAndName : {};

            for (var i in menuToAddAndRemove) {
                let e = menuToAddAndRemove[i];
                e.text = getNewItemText(configAddItemIdAndName, e.text, e.id);
                e.remove = getRemoveToItemMenu();

                menu.push(menuToAddAndRemove[i])
            }

            let addNewData = {
                text: '+',
                disableSelected: true,
                val: ADD_NEW_ITEM
            };

            if (addNewOption.addTipText) {
                addNewData.tip = addNewOption.addTipText;
            }

            menu.push(addNewData);
        }

        function checkRemoveDataIsCorrect(removeData) {
            if (!isset(removeData.txt)) {
                errorReport('CreateMenuScroll.js', 'checkRemoveDataIsCorrect', 'Remove data incorrect! attr txt undefined!', removeData);
                return false
            }
            if (!isset(removeData.clb)) {
                errorReport('CreateMenuScroll.js', 'checkRemoveDataIsCorrect', 'Remove data incorrect! attr clb undefined!', removeData);
                return false
            }
            return true;
        }

        function fillMenuItemFromRemoveData($menuItem, data) {
            let $removeWrapper = $('<div>').addClass('remove-wrapper');
            let $remove = $('<div>').addClass('remove');

            $remove.tip(data.remove.txt);
            $removeWrapper.append($remove);

            $remove.on('mousedown', (e) => {
                e.stopPropagation();
                data.remove.clb(data);
            });

            $menuItem.append($removeWrapper)
            $menuItem.addClass('option-with-remove')
        }

        function createMenuItem(data) {
            let $menuItem = $('<div/>');
            let $text = $('<div/>');

            $menuItem.append($text);

            $text.addClass('text');
            $menuItem.addClass('option');
            $menuItem.attr('value', data.val == null ? '' : data.val);

            if (opts.parseHTML) {
                $text.html(data.text);
            } else {
                $text.text(data.text);
            }

            if (isset(data.id)) $menuItem.attr(MENU_ITEM_ID, data.id);
            if (isset(data.selectedText)) $menuItem.attr('selectedText', data.selectedText);
            if (isset(data.disableSelected)) $menuItem.attr('disableSelected', true);
            if (isset(data.blockClick)) $menuItem.attr('blockClick', true);
            if (isset(data.tip)) $menuItem.tip(data.tip);
            if (data.isRed) $menuItem.addClass('option--red');

            if (isset(data.remove) && checkRemoveDataIsCorrect(data.remove)) fillMenuItemFromRemoveData($menuItem, data);

            return $menuItem
        }

        function show() {
            if (showed) return;
            showed = true;
            $menuArrow.addClass('close-menu');
            $menuWrapper.detach();
            $menuWrapper.appendTo(bcontainer);

            //fix to correct recalc position
            $menuWrapper.show();
            recalcPos();
            $menuWrapper.hide();

            $menuWrapper.slideDown({
                duration: 'fast',
                start: function() {
                    $scroll_wrapper.trigger("update");
                    if (selected !== null) {
                        selected.addClass("selected");
                        $scroll_wrapper.trigger("setScroll", [(selected[0].offsetTop - 3)]);
                    }
                    $(self).on("close", hideNow);
                    $(window).on("mousedown", function(e) {
                        if (!checkElementIsOption(e.target)) hide();
                    });
                    $(window).on("mousewheel", hideNow);
                    $(window).on("resize", recalcPos);
                },
                complete: recalcPos
            });
        }

        function hide(event) {
            removeEventListeners();
            $menuWrapper.slideUp('fast', function() {
                showed = false;
                $menuWrapper.detach();
                $dropDownMenu.append($menuWrapper);
                $menuArrow.removeClass('close-menu');
            });
        }

        function hideNow(event) {
            removeEventListeners();
            $menuWrapper.hide();
            showed = false;
            $menuWrapper.detach();
            $dropDownMenu.append($menuWrapper);
            $menuArrow.removeClass('close-menu');
        }

        function setValue(v) {
            selected = v;

            let $menuOption = self.find('.menu-option');
            let selectedTextAttr = v.attr('selectedText');
            let text = selectedTextAttr ? selectedTextAttr : v.find('.text').html();

            manageVisibleArrowAndReset();

            $menuOption.html(text);
            $menuOption.attr('value', v.attr('value'));
            if (v.hasClass('option--red')) {
                $menuOption.closest('.button').removeClass('green');
            } else {
                $menuOption.closest('.button').addClass('green');
            }
        }

        function stopProp(event) {
            event.stopPropagation();
        }

        function preSelect(e) {
            if (!checkElementIsOption(e.target)) return;

            stopProp(e);

            let option = getOptionFromTarget(e.target);

            if (!checkCanClick(option)) {
                return;
            }
            if (!checkCanSelect(option)) {
                let v = getValueAttrFromElement($(option));
                hide();
                callCallback(v);
                return;
            }
            setChosen(option);

            //console.log(option)

            postSelect(e)
        }

        function checkCanSelect(element) {
            return $(element).attr('disableSelected') ? false : true;
        }

        function checkCanClick(element) {
            return $(element).attr('blockClick') ? false : true;
        }

        function setChosen(element) {
            choosen = element;
        }

        function manageVisibleArrowAndReset() {
            let firstValue = $menuItems[0].attr('value');
            let selectedValue = selected.attr('value');

            if (firstValue == selectedValue) {
                showArrow();
                hideReset();
            } else {
                hideArrow();
                showReset();
            }
        }

        function checkElementIsOption(element) {
            let $element = $(element);

            if ($element.hasClass('option')) return true;
            if ($element.closest('.option').length > 0) return true;

            return false;
        }

        function getOptionFromTarget(target) {
            let $target = $(target);

            if ($target.hasClass('option')) return ($target)[0];
            if ($target.closest('.option').length > 0) return ($target.closest('.option'))[0];

            errorReport('CreateMenuScroll.js', 'getOptionFromTarget', 'Incorrect target', target);

            return null;
        }

        function postSelect(e) {
            if (!checkElementIsOption(e.target)) return;

            let option = getOptionFromTarget(e.target);

            if (choosen != option) {
                return;
            }
            //debugger;
            //let v = getChooseValueAttr();
            //
            //setValue($(option));
            //hide();
            //callCallback(v);
            afterPostSelect(option);
        }

        function afterPostSelect(option) {
            let v = getChooseValueAttr();

            setValue($(option));
            hide();
            callCallback(v);
        }

        function getChooseValueAttr() {
            return getValueAttrFromElement($(choosen));
        }

        function getValueAttrFromElement(element) {
            return element.attr('value');
        }

        function callCallback(v) {
            if (clb && typeof clb === "function") {

                if (v == ADD_NEW_ITEM) {
                    addNewItem();
                    return;
                }

                clb(v);
            }
        }

        function getNewItemText(configAddItemIdAndName, val, newId) {
            let newItemText;

            if (configAddItemIdAndName.nameFromInputVal) {
                newItemText = val;
            } else {
                let namePrefix = configAddItemIdAndName.namePrefix;
                let _newId = newId - (configAddItemIdAndName.showFirstPossibleIdUserFriendly ? configAddItemIdAndName.firstPossibleId - 1 : 0)
                newItemText = (isset(namePrefix) ? namePrefix : '') + _newId;
            }

            return newItemText;
        }

        function addNewItem() {
            let addNewOption = options.addNewOption;

            confirmWitchTextInput(addNewOption.addItemConfirmText, (val) => {

                if (addNewOption.addItemConfirmValidate && !addNewOption.addItemConfirmValidate(val)) {
                    return;
                }

                let configAddItemIdAndName = addNewOption.configAddItemIdAndName ? addNewOption.configAddItemIdAndName : {};
                let menuToAddAndRemove = addNewOption.menuToAddAndRemove;
                let firstPossibleId = configAddItemIdAndName.firstPossibleId;
                firstPossibleId = isset(firstPossibleId) ? firstPossibleId : 0;
                let newId = getFreeIdOfArray(menuToAddAndRemove, firstPossibleId);
                let newItemText = getNewItemText(configAddItemIdAndName, val, newId);

                let newItem = {
                    text: newItemText,
                    tip: val,
                    val: newId,
                    id: newId,
                    remove: getRemoveToItemMenu()
                };
                let $newMenuItem = createMenuItem(newItem);

                menu.splice(menu.length - 1, 0, newItem);
                $menuItems.splice($menuItems.length - 1, 0, $newMenuItem);

                addNewOption.menuToAddAndRemove.push({
                    text: newItemText,
                    val: newId,
                    tip: val,
                    id: newId
                })

                attachClickToOption($newMenuItem[0]);

                if (addNewOption.addItemConfirmClb) {
                    let data = {
                        val: val,
                        id: newId,
                        newItemText: newItemText
                    };

                    addNewOption.addItemConfirmClb(data);
                }

                //refresh$menuItemsView();
                addItemToWrapper($newMenuItem, newId)


                if (addNewOption.autoSelect) {
                    //debugger;
                    //return;
                    setChosen($newMenuItem);
                    afterPostSelect($newMenuItem);
                }

            }, 300);
        }

        function addItemToWrapper($newMenuItem, $newMenuItemId) {


            let add = false;
            let $addNewItemElement = $wrapper.find('.bck-wrapper').find('.option').last();

            $newMenuItemId = parseInt($newMenuItemId);

            let $optionsWithRemove = $wrapper.find(".option-with-remove");

            $optionsWithRemove.each(function() {
                let actualElementId = $(this).attr(MENU_ITEM_ID);

                if (parseInt(actualElementId) > $newMenuItemId && !add) {
                    add = true;
                    $newMenuItem.insertBefore($(this));
                }
            });

            if (!add) {
                $newMenuItem.insertBefore($addNewItemElement);
            }

        };

        function removeItemFromWrapper(id) {
            //$wrapper.find('.bck-wrapper').find(".option-with-remove").attr("menu-item-id", id).remove();

            let $elements = $wrapper.find('.bck-wrapper').find(".option-with-remove");

            $elements.each(function() {
                let $this = $(this);
                if ($this.attr(MENU_ITEM_ID) == id) {
                    $this.remove();
                }
            });
        }

        function refresh$menuItemsView() {
            $wrapper.find('.bck-wrapper').empty().html($menuItems);
        }

        function getRemoveToItemMenu() {
            return {
                txt: _t('delete'),
                clb: removeItem
            }
        }

        function removeItem(data) {
            let addNewOption = options.addNewOption;
            confirmWithCallback({
                msg: addNewOption.removeItemConfirmText(data.text),
                clb: () => {
                    removeItemFrom$menuItems(data.id);
                    removeItemFromMenu(data.id);
                    removeItemFromMenuToAddAndRemove(data.id);
                    //refresh$menuItemsView();

                    removeItemFromWrapper(data.id);
                    addNewOption.removeItemConfirmClb(data);

                    if (String(data.id) === getChooseValueAttr()) {
                        setFirstWitchCallback();
                        // hide();
                    }
                }
            })
        }

        function removeItemFrom$menuItems(id) {
            for (let k in $menuItems) {
                let $e = $menuItems[k];
                if (!$e.hasClass("option-with-remove")) {
                    continue
                }

                if ($e.attr(MENU_ITEM_ID) == id) {
                    removeFromArray($menuItems, $e);
                    return;
                }
            }
        }

        function removeItemFromMenu(id) {
            for (let k in menu) {
                let e = menu[k];

                if (e.id == id) {
                    removeFromArray(menu, e);
                    return;
                }
            }
        }

        function removeItemFromMenuToAddAndRemove(id) {
            let menuToAddAndRemove = options.addNewOption.menuToAddAndRemove
            for (let k in menuToAddAndRemove) {
                let e = menuToAddAndRemove[k];

                if (e.id == id) {
                    removeFromArray(menuToAddAndRemove, e);
                    return;
                }
            }
        }

        function recalcPos() {
            var width = self.outerWidth() - 8;
            $menuWrapper.css({
                width
            });

            var pos = self.offset();
            pos.left += 5;
            var listHeight = $wrapper.find('.bck-wrapper').outerHeight();
            var wrapperH = $wrapper.outerHeight();
            var height = pos.top + (listHeight > wrapperH ? wrapperH : listHeight);
            var topOffset = 27;

            if (height + topOffset > $(window).height()) {
                pos.top -= (height - $(window).height());
                topOffset = -6;
            }
            if (width > $(window).width()) {
                pos.left -= (width - $(window).width());
            }

            $menuWrapper.css({
                top: pos.top > 0 ? pos.top / Engine.zoomFactor + topOffset : 0,
                left: pos.left > 0 ? pos.left / Engine.zoomFactor - 3 : 0
            });
        }

        function removeEventListeners() {
            $(window).off("mousedown", hide);
            $(window).off("mousewheel", hideNow);
            $(window).off("resize", recalcPos);
        }

        function showArrow() {
            self.find('.arrow').css('display', 'block');
        }

        function hideArrow() {
            self.find('.arrow').css('display', 'none');
        }

        function showReset() {
            self.find('.reset').css('display', 'block');
        }

        function hideReset() {
            self.find('.reset').css('display', 'none');
        }

        function setFirst() {
            setValue($menuItems[0]);
        }

        function setLast() {
            let index = $menuItems.length - 1;
            setValue($menuItems[index]);
        }

        function setFirstWitchCallback() {
            setFirst();
            setChosen($menuItems[0][0]);
            let v = getChooseValueAttr();
            callCallback(v)
        }

        function setOptionWithoutCallbackByValue(_value) {
            for (let k in $menuItems) {
                let value = getValueAttrFromElement($menuItems[k]);
                if (_value == value) {

                    setValue($menuItems[k]);
                    setChosen($menuItems[k][0]);

                    return
                }
            }

            errorReport('CreateMenuScroll', 'setOptionWithoutCallbackByValue', `Value ${_value} not exist!`)
        }

        function getValue() {
            let v = getValueAttrFromElement($(self).find('.menu-option'));

            return v == undefined ? null : v;
        }

        function attachAllEvents() {
            let allOptions = self.find('.option');

            allOptions.each(function() {
                attachClickToOption(this);
            })
        }

        function attachClickToOption(option) {
            option.addEventListener("click", (e) => {
                //console.log(option);
                preSelect(e);
            });
        }

        this.getValue = getValue;
        this.setFirst = setFirst;
        this.setOptionWithoutCallbackByValue = setOptionWithoutCallbackByValue;
        this.setLast = setLast;


        if (!checkCorrectMenuData()) {
            return
        }

        init();

    };
})();