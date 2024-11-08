module.exports = function() {

    let $magicInput = null;
    let $magicInputPlaceholder = null;
    let $magicInputWrapper = null;
    let inputHtmlValue = "";
    let keyDownCaretData = null;
    let inputData = {};
    let channelInputData = {};
    let INPUT_DATA = null;
    let CHANNEL_INPUT_DATA = null;
    let sendCallbackFunc = null;
    let inputChangeCallbackFunc = null;
    let blockNearOnEnterUp = null;

    const init = function($chatInputWrapper, _INPUT_DATA, _CHANNEL_INPUT_DATA, placeholderText, sendCallback, inputChangeCallback) {
        //return;
        setBlockNearOnEnterUp(false);
        setINPUT_DATA(_INPUT_DATA);
        setCHANNEL_INPUT_DATA(_CHANNEL_INPUT_DATA);
        initSendCallbackFunc(sendCallback);
        initInputChangeCallbackFunc(inputChangeCallback);
        initInputData();
        initChannelInputData();
        init$magicInput();
        init$magicInputPlaceholder(placeholderText);
        init$magicInputWrapper();
        initStyle();
        appendElemstsTo$magicInputWrapper();
        appendMagicInput($chatInputWrapper);

        attachInputEvent();

        initOnKeyDownEvent();
        initOnKeyUpEvent();
        initClickEvent();
    };

    const init$magicInputPlaceholder = (placeholderText) => {
        $magicInputPlaceholder = $("<div>").addClass('magic-input-placeholder');
        $magicInputPlaceholder.html(placeholderText);
    }

    const setDisplay$magicPlaceholder = (state) => {

        let display = $magicInputPlaceholder.css('display');
        let newDisplay = state ? 'block' : 'none';

        if (state) {
            if (display == 'block') return
        } else {
            if (display == 'none') return
        }

        $magicInputPlaceholder.css('display', newDisplay);
    };

    const appendElemstsTo$magicInputWrapper = () => {
        $magicInputWrapper.append($magicInputPlaceholder);
        $magicInputWrapper.append($magicInput);
    }

    const initInputChangeCallbackFunc = (_inputChangeCallbackFunc) => {
        inputChangeCallbackFunc = _inputChangeCallbackFunc
    }

    const initSendCallbackFunc = (_sendCallbackFunc) => {
        sendCallbackFunc = _sendCallbackFunc
    }

    const setINPUT_DATA = (_INPUT_DATA) => {
        INPUT_DATA = _INPUT_DATA;
    };

    const setCHANNEL_INPUT_DATA = (_CHANNEL_INPUT_DATA) => {
        CHANNEL_INPUT_DATA = _CHANNEL_INPUT_DATA;
    };

    const setColorInput = (color) => {
        $magicInput.css({
            "caret-color": color,
            "color": color,
        })
    };

    const initInputData = () => {
        for (let k in INPUT_DATA) {
            inputData[k] = {};
        }
    };

    const initChannelInputData = () => {
        for (let k in CHANNEL_INPUT_DATA) {
            channelInputData[k] = {};
        }
    };

    const init$magicInput = () => {
        $magicInput = $("<MAGIC_INPUT>").addClass('magic-input');
        $magicInput.attr("contenteditable", "true");
        $magicInput.html("")
    };

    const init$magicInputWrapper = () => {
        $magicInputWrapper = $("<div>").addClass('magic-input-wrapper');
    };

    const appendMagicInput = ($element) => {
        //$("body").append($magicInput);
        $element.replaceWith($magicInputWrapper);
    };

    const initClickEvent = () => {
        $magicInput.on("click", function() {
            removeLinkedItemActive();
        });
    };

    const removeLinkedItemActive = () => {
        let $linkedItems = $magicInput.find(".linked-item")

        $linkedItems.each(function() {
            removeActiveClass($(this));
        });
    };

    const initOnKeyDownEvent = () => {
        $magicInput.on('keydown', function(e) {
            if (e.originalEvent.key == "Enter") {
                e.preventDefault();
                if (getFullInputVal() == "" && isFocus()) blur();
            }
            keyDownCaretData = getCaretData()
        });
    };

    const attachInputEvent = () => {
        $magicInput[0].addEventListener("input", function(e) {
            afterChangeInput();
        });
    };

    const escapeInputValue = (val) => {
        return val.replace(/(?=\s)[^\r\n\t]/g, ' ');
    }

    const getEscapeFullInputVal = () => {
        return escapeInputValue(getFullInputVal());
    }

    const initOnKeyUpEvent = () => {
        $magicInput.on('keyup', function(e) {
            debugger;
            updateValue();

            if (e.originalEvent.key == "Enter") {

                if (blockNearOnEnterUp) {
                    setBlockNearOnEnterUp(false);
                    return
                }

                let val = getFullInputVal();
                val = escapeInputValue(val);

                sendCallbackFunc(val);
                return
            }

            if (e.originalEvent.key == "Escape") {
                blur();
                return
            }

            afterChangeInput();

        });
    };

    const clearMagicInput = () => {
        setInputHtmlValue("");
        setMagicInputValue("");

        blur();

        afterChangeInput();
    };

    const afterChangeInput = () => {
        let clear = $magicInput.html() == '';

        setDisplay$magicPlaceholder(clear);
        inputChangeCallbackFunc(clear)
    }

    const getMagicInputValue = () => {
        return $magicInput[0].innerHTML;
    };

    const getMagicInputText = () => {
        return $magicInput[0].textContent
    };

    const setMagicInputValue = (v) => {
        return $magicInput.html(v);
    };

    const setInputHtmlValue = (_inputValue) => {
        inputHtmlValue = _inputValue
    };

    const manageInputData = (html, tag) => {
        for (let k in inputData[tag]) {
            let fullTag = tag + '_' + k;
            if (html.indexOf(fullTag) < 0) delete inputData[tag][k];
        }
    };

    const getNewIndex = (tag) => {
        let index = 0;

        if (!lengthObject(inputData[tag])) return 0;

        for (let k in inputData[tag]) {
            let checkIndex = parseInt(k)
            if (checkIndex > index) index = checkIndex;
        }

        return index + 1;
    };

    const updateValue = () => {
        if (isSameValue()) {
            return;
        }

        if (isValueHasEvent()) {
            return;
        }

        let fData = getForbiddenChildNodesData();

        if (fData.shouldUpdate) {
            let caretData = getCaretData();
            let data = getPosAndNodeIndexAfterChildNodesUpdate(caretData, fData.data);

            setMagicInputValue(data.html);
            setInputHtmlValue(data.html);
            setCaret($magicInput[0], data.nodeIndex, data.pos);
            keyDownCaretData = caretData;
        }

        if (!isFirefoxBrowser()) { // turn off INPUT_DATA replace on ff
            for (let k in INPUT_DATA) {
                let html = getMagicInputValue();
                let caretData = getCaretData();
                html = clearAmp(html);
                oneReplaceProcedure(html, INPUT_DATA[k], caretData);
            }
        }

        for (let kk in CHANNEL_INPUT_DATA) {
            let html = getMagicInputValue();
            oneChannelChangeProcedure(html, CHANNEL_INPUT_DATA[kk]);
        }
    };

    const clearAmp = (html) => {
        return html.replace(/&amp;/g, '&');
    }

    const getPosAndNodeIndexAfterChildNodesUpdate = (caretData, data) => {
        let pos = caretData.baseOffset;
        let nodeIndex = caretData.childNodeIndex;
        let data2 = [];
        let html = '';

        if (data.length != $magicInput[0].childNodes.length) {
            warningReport('MagicInput3', "getPosAndNodeIndexAfterChildNodesUpdate", 'possible caret bug, data.length != $magicInput[0].childNodes');
        }

        for (let i = 0; i < data.length; i++) {
            let rec = data[i];
            if (!rec.toRemoveStyle) continue;

            if (nodeIndex == i) pos = rec.innerText.length;

            rec.isText = true;
            rec.outerHTML = null;
            rec.toRemoveStyle = false;
        }

        let isText = null;

        let decreaseIndexCount = 0;

        for (let i = 0; i < data.length; i++) {
            let rec = data[i];

            if (isText == null) {
                data2.push(rec);
                isText = rec.isText;
                continue;
            }

            if (isText && rec.isText) {
                let last = data2.length - 1;
                let lastLength = data2[last].innerText.length;

                data2[last].innerText += rec.innerText;

                if (i <= nodeIndex + decreaseIndexCount) {
                    if (i == nodeIndex + decreaseIndexCount) pos += lastLength;
                    nodeIndex--;
                    decreaseIndexCount++
                }
            } else {
                isText = rec.isText;
                data2.push(rec)
            }
        }

        for (let k in data2) {
            let rec = data2[k];
            html += rec.parseSpan ? rec.outerHTML : rec.innerText
        }

        pos--;

        return {
            html: html,
            pos: pos,
            nodeIndex: nodeIndex
        };
    };

    const setParentChildIndex = (i, parentChildNodes) => {
        if (parentChildNodes == null) return i;
        else return parentChildNodes;

    }

    const getAllNodesData = (childNodes, deep, parentChildNodes) => {
        let data = [];
        let shouldUpdate = false;
        let newChildNodesLength = childNodes.length;

        for (let i = 0; i < newChildNodesLength; i++) {
            let element = childNodes[i];

            if (isFirefoxBrowser() && isBrNode(element)) { // turn off INPUT_DATA replace on ff
                continue;
            }

            if (element.nodeName == '#text') {

                let o = getTextObjectData(setParentChildIndex(i, parentChildNodes), element.textContent, deep);
                data.push(o);

            } else {

                let isParseSpan = hasClass(element, 'parse-span');

                if (isParseSpan) {

                    let o = getParseSpanObjectData(setParentChildIndex(i, parentChildNodes), element.innerText, element.outerHTML, deep);
                    data.push(o);

                } else {

                    let elementChildNodes = element.childNodes;

                    if (elementChildNodes.length) {

                        let d = getAllNodesData(elementChildNodes, true, setParentChildIndex(i, parentChildNodes));

                        mergeArray(data, d.data);

                    } else {

                        let o = getNormalSpanObjectData(setParentChildIndex(i, parentChildNodes), element.innerText, element.outerHTML, deep);
                        data.push(o);
                    }

                    shouldUpdate = true;
                }

            }

        }

        return {
            data: data,
            shouldUpdate: shouldUpdate
        }
    };

    const mergeArray = (firstArray, secondArray) => {
        for (let k in secondArray) {
            firstArray.push(secondArray[k]);
        }
    };

    const getTextObjectData = (parentChildIndex, text, deep) => {
        return {
            isText: true,
            innerText: text,
            outerHTML: null,
            toRemoveStyle: false,
            deep: deep,
            parentChildIndex: parentChildIndex,
        };
    };

    const getParseSpanObjectData = (parentChildIndex, innerText, outerHTML, deep) => {
        return {
            isText: false,
            parseSpan: true,
            innerText: innerText,
            outerHTML: outerHTML,
            toRemoveStyle: false,
            deep: deep,
            parentChildIndex: parentChildIndex,
        };
    };

    const getNormalSpanObjectData = (parentChildIndex, innerText, outerHTML, deep) => {
        return {
            isText: false,
            parseSpan: false,
            innerText: innerText,
            outerHTML: outerHTML,
            toRemoveStyle: true,
            deep: deep,
            parentChildIndex: parentChildIndex,
        };
    };

    const getForbiddenChildNodesData = () => {
        let childNodes = $magicInput[0].childNodes;
        let newChildNodesLength = childNodes.length;

        if (newChildNodesLength == 0) return {
            data: [],
            shouldUpdate: false
        };

        let d = getAllNodesData(childNodes, false, null);
        let data = d.data;
        let shouldUpdate = d.shouldUpdate;


        let isText = null;

        for (let ii = 0; ii < data.length; ii++) {
            let rec = data[ii];
            if (isText == null) {
                isText = rec.isText;
                continue
            };

            if (isText && rec.isText) {
                shouldUpdate = true;
                break;
            }

            isText = rec.isText;
        }

        let data2 = [];

        for (let i = 0; i < data.length; i++) { // connect deep text and add toRemoveFlag = true
            let rec = copyStructure(data[i]);
            if (rec.deep) {

                if (data2[rec.parentChildIndex]) {
                    let lastIndex = data2.length - 1;
                    let lastRec = data2[lastIndex];

                    lastRec.toRemoveStyle = true;
                    lastRec.innerText += rec.innerText;

                } else {
                    rec.toRemoveStyle = true;
                    data2.push(rec);
                }

            } else {
                data2.push(rec);
            }
        }

        return {
            data: data2,
            shouldUpdate: shouldUpdate
        }
    };

    const hasClass = (element, checkClass) => {
        return element.classList.contains(checkClass);
    };

    const oneChannelChangeProcedure = (html, replaceData) => {
        let myRe = replaceData.getPattern();
        let execData = myRe.exec(html);

        if (execData) {

            if (replaceData) replaceData.callback(execData[1]);
            else replaceData.callback();

            html = html.replace(replaceData.getPattern(), "");
            $magicInput.html(html);

            //console.log('max');
            let length = $magicInput[0].childNodes.length;

            setCaret($magicInput[0], length - 1, -1);
            setInputHtmlValue(html);
        }
    };

    const oneReplaceProcedure = (html, replaceData, caretData) => {
        let tag = replaceData.tag;
        manageInputData(html, replaceData.tag);

        let myRe = replaceData.getPattern();
        let execData = myRe.exec(html);

        if (execData) {
            //let data        = getInputDataAfterAddLinkedItems(replaceData.getPattern(), html, tag, replaceData.spanClass, replaceData.style, replaceData.text);
            let data = getInputDataAfterAddLinkedItems(html, replaceData, execData, caretData);
            let itemsToAdd = data.itemsToAdd;

            for (let itemIndex in itemsToAdd) {
                inputData[tag][itemIndex] = itemsToAdd[itemIndex];
            }

            html = data.html;

            $magicInput.html(html);

            // $magicInput.find(".linked-item").dblclick(function () {
            //   doubleClickOfActiveElement($(this));
            // });

            setCaret($magicInput[0], data.childNodeIndex, data.caretPos)
            setInputHtmlValue(html);
        }

    };

    const getDataAfterHidReplaceOnObjectReplace = (html, replaceData) => {

        let tag = replaceData.tag;
        let newIndex = getNewIndex(tag);
        let data = getEngine().chatLinkedItemsManager.changeStringOn(html, replaceData.getPattern(), tag, newIndex);
        let itemsData = data.itemsData;
        let itemsToAdd = {};

        for (let itemIndex in itemsData) {
            for (let wordIndex in data.htmlString) {

                let word = data.htmlString[wordIndex];
                let iData = itemsData[itemIndex].replace("&nbsp;", " ");

                if (word != tag + "_" + itemIndex) continue;

                itemsToAdd[itemIndex] = iData;

                data.htmlString[wordIndex] = getStringImg(word, itemIndex, replaceData, createJSONToItemDataHelper(iData));
            }
        }

        return {
            html: data.htmlString.join(''),
            itemsToAdd: itemsToAdd
        };
    };

    const createJSONToItemDataHelper = (iData) => {
        let o = {
            data: iData.split("")
        };

        return JSON.stringify(o);
    }

    const getStringImg = (word, itemIndex, replaceData, iData) => {

        let img = `<img tag-data="${replaceData.tag}" tag-and-index-data="${word}" tag-index-data="${itemIndex}" item-data-helper='${iData}' `;
        //let img = `<img tag-data="${replaceData.tag}" tag-and-index-data="${word}" tag-index-data="${itemIndex}" `;

        if (replaceData.spanClass) img += `class="parse-span"`;
        else img += `class="parse-span ${replaceData.spanClass}"`;

        if (replaceData.getSrc) img += `src="${replaceData.getSrc()}"`;
        if (replaceData.style) img += `style="${replaceData.style}"`;

        img += `>&nbsp;`;

        return img;
    };

    const getInputDataAfterAddLinkedItems = (html, _replaceData, execData, caretData) => {
        let replaceData = getDataAfterHidReplaceOnObjectReplace(html, _replaceData);
        let itemsToAdd = replaceData.itemsToAdd;
        html = replaceData.html;

        let positionData = getPositionData(itemsToAdd, execData, caretData);
        let newChildNodeIndex = positionData.childNodeIndex;
        let pos = positionData.caretPos;

        return {
            html: html,
            caretPos: pos,
            childNodeIndex: newChildNodeIndex,
            itemsToAdd: itemsToAdd
        }
    };

    const getPositionData = (itemsToAdd, execData, caretData) => {
        let newChildNodeIndex = null;
        let pos = null;
        let lengthItemsToAdd = lengthObject(itemsToAdd);

        //if (keyDownCaretData.childNodeIndex == null) { // last test
        if (caretData.childNodeIndex == null || caretData.childNodeIndex == 0) {
            //newChildNodeIndex = lengthItemsToAdd * 2 - 1;
            if (caretData.baseOffset == execData[0].length) {
                newChildNodeIndex = lengthItemsToAdd * 2 - 1;

                if (caretData.baseOffset == caretData.baseNodeLength) pos = -1;
                else pos = 0;

            } else {

                if (execData.index == 0) newChildNodeIndex = lengthItemsToAdd * 2 - 1;
                else newChildNodeIndex = lengthItemsToAdd * 2;

                //if (caretData.baseOffset != caretData.baseNodeLength && execData.index > 0) pos = caretData.baseOffset - execData[0].length - 1;
                if (caretData.baseOffset != caretData.baseNodeLength && execData.index > 0) pos = 0;
                else pos = -1

            }

            //pos = -1

        } else {

            newChildNodeIndex = keyDownCaretData.childNodeIndex;
            for (let k in itemsToAdd) {
                //let v = itemsToAdd[k].length == keyDownCaretData.baseNode.length ? 1 : 2;                             // TEST!!!
                let v = itemsToAdd[k].replaceAll("&nbsp;", " ").length == keyDownCaretData.baseNode.length ? 1 : 2; // TEST!!!
                newChildNodeIndex += v;
            }

            let samePos = keyDownCaretData.baseOffset == keyDownCaretData.baseNodeLength;

            if (samePos) pos = -1;
            else pos = 0;
        }

        return {
            caretPos: pos,
            childNodeIndex: newChildNodeIndex
        }
    };

    const checkChildNodeExist = (childNodeIndex) => {
        return $magicInput[0][childNodeIndex] ? true : false
    };

    const doubleClickOfActiveElement = ($element) => {

        addActiveClass($element);

        let childNodeIndex = getChildNodeIndex($element[0]);

        setCaret($magicInput[0], childNodeIndex + 1, 0)
    }

    const getChildNodeIndex = (element) => {
        //let e = null;


        if (element == $magicInput[0]) return 0;

        let e = getElementNodeSameLike$magicInput(element);

        if (e == null) return null;

        //if (element == $magicInput[0]) return 0;
        //else {
        //  if (element.parentNode == $magicInput[0]) e = element;
        //  else {
        //    if (element.parentNode.parentNode == $magicInput[0]) e = element.parentNode;
        //    else {
        //      if (element.parentNode.parentNode.parentNode == $magicInput[0]) e = element.parentNode.parentNode;
        //      else return null;
        //    }
        //  }
        //}

        let list = $magicInput[0].childNodes;

        for (let i = 0; i < list.length; i++) {
            if (list[i] == e) return i
        }

        return null;
    };

    const setCaret = (el, childNodeIndex, pos) => { // pos = -1 -> max, pos = -2 -> min
        let range = document.createRange();
        let sel = window.getSelection();


        if (childNodeIndex == null) {
            errorReport("MagicInput.js", "setCaret", "childNodeIndex = null!")
            childNodeIndex = 0;
        }

        if (!el.childNodes.length) return // caret not exist. It's not bug, input val = "". Crazy...

        if (!el.childNodes[childNodeIndex]) {
            errorReport("MagicInput.js", "setCaret", "childNodes with childNodeIndex:" + childNodeIndex + ' not exist!');
            childNodeIndex = el.childNodes.length - 1; // TEST!!!
            //return                                                // TEST!!!
        }

        let childNode = el.childNodes[childNodeIndex];
        let childNodeLength = childNode.length

        pos = pos == -1 ? childNodeLength - 1 : pos;
        pos = pos == -2 ? -1 : pos;

        if (pos >= childNodeLength) {
            errorReport("MagicInput.js", "setCaret", "Pos is bigger than childNodeLength");
            return
        }

        range.setStart(el.childNodes[childNodeIndex], pos + 1);
        //range.setEnd(el.childNodes[childNodeIndex], pos+1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    };

    const getElementNodeSameLike$magicInput = (element) => {
        let counter = 0;
        let maxCounter = 10;

        if ($magicInput[0] == element) return element;

        let _element = element;

        while (_element.parentNode != $magicInput[0]) {

            if (counter == maxCounter) return null;

            _element = _element.parentNode;
            counter++;
        }

        return _element;
    };

    const getCaretData = () => {

        let selection = window.getSelection();
        let anchorNode = selection.anchorNode
        //if (anchorNode == $magicInput[0] || anchorNode.parentNode == $magicInput[0] || anchorNode.parentNode.parentNode == $magicInput[0] || anchorNode.parentNode.parentNode.parentNode == $magicInput[0]) {

        let anchorNodeSameLike$magicInput = getElementNodeSameLike$magicInput(anchorNode);

        if (anchorNodeSameLike$magicInput) {

            let childNodeIndex = getChildNodeIndex(selection.anchorNode);
            //let childNodeIndex = getChildNodeIndex(anchorNode);

            return {
                //baseNode        : selection.baseNode,
                //baseNodeLength  : selection.baseNode != null ? selection.baseNode.length : null,
                baseNode: selection.focusNode, // ff test
                baseNodeLength: selection.focusNode != null ? selection.focusNode.length : null,
                baseOffset: selection.baseOffset,
                extentNode: selection.extentNode,
                extentOffset: selection.extentOffset,
                childNodeIndex: childNodeIndex
            }

        } else {
            errorReport('MagicInput', 'getCaretData', 'null')
            return null;
        }


    };

    const addActiveClass = ($element) => {
        $element.css('background', 'yellow')
    };

    const removeActiveClass = ($element) => {
        $element.css('background', 'none')
    };

    const isSameValue = () => {
        return inputHtmlValue == getMagicInputValue();
    };

    const isValueHasEvent = () => {
        let events = [
            'onerror',
            'onload',
            'onfocus',
        ];

        //let v = getMagicInputValue();
        let v = getMagicInputText();

        for (let index in events) {
            let eventPattern = new RegExp('(\\s|\&nbsp;)' + events[index] + '(\\s|\&nbsp;)*\=', "g");

            if (eventPattern.exec(v)) {
                return true
            }

        }

        let scriptTag = new RegExp('\<(\/*)script>', "g");

        if (scriptTag.exec(v)) {
            return true
        }

        let alert = new RegExp('alert(\\s|\&nbsp;)*\\(', "g");

        if (scriptTag.exec(v)) {
            return true
        }


        return false;
    };

    const initStyle = () => {
        $magicInput.css({
            "outline-width": 0,
            "display": "block",
            //"padding": 4,
            "box-shadow": "inset 0px 0px 3px 3px black",
            "font-size": 13,
            "max-height": "60vh",
            "overflow": "hidden"
        });

        $magicInputPlaceholder.css({
            "color": "#787878",
            "position": "absolute",
            "top": 5,
            "left": 6,
            "pointer-events": "none"
        });
    };

    const focus = () => {
        $magicInput.focus();
    };

    const blur = () => {
        $magicInput.blur();
    };

    const isFocus = () => {
        //return document.activeElement == $magicInput[0]
        return $magicInput.is(":focus");
    };

    const setInput = (v) => {
        //$magicInput.focus();
        focus();
        keyDownCaretData = getCaretData();
        setMagicInputValue(v);
        updateValue();
        setDisplay$magicPlaceholder($magicInput.html() == '');
    };

    const addToInput = (val) => {
        setInput(inputHtmlValue + val);
    };

    isTextNode = (element) => {
        return element.nodeName == '#text';
    }

    const isBrNode = (element) => {
        return element.nodeName == 'BR';
    }

    const getDataAtrr = (element, attrName) => {

        let attributes = element.attributes
        for (let k in attributes) {
            if (attributes[k].name == attrName) return attributes[k].textContent
        }

        errorReport("MagicInput", "getInputDataAtrr", attrName + " attr not exist!", attributes);

        return null;

    }

    const getFullInputVal = () => {
        let childNodes = $magicInput[0].childNodes;
        let childNodesLength = childNodes.length;

        let str = '';

        for (let i = 0; i < childNodesLength; i++) {
            let element = childNodes[i];

            if (isTextNode(element)) {
                str += element.textContent;
                continue;
            }

            if (isFirefoxBrowser() && isBrNode(element)) {
                continue;
            }

            let tagDataAttr = getDataAtrr(element, "tag-data");
            let tagItemDataHelper = getDataAtrr(element, "item-data-helper");

            if (!tagDataAttr) return '';

            let tagIndexDataAttr = getDataAtrr(element, "tag-index-data");
            if (!tagIndexDataAttr) {
                return '';
            }

            if (inputData[tagDataAttr] && inputData[tagDataAttr][tagIndexDataAttr]) {
                str += inputData[tagDataAttr][tagIndexDataAttr];
                continue;
            }

            if (tagItemDataHelper) {
                let data = JSON.parse(tagItemDataHelper).data;
                let strData = data.join("");
                str += strData;

                errorReport("MagicInput.js", "getFullInputVal", 'Take data from item-data-helper attr...', strData);
                continue;
            }

            if (!inputData[tagDataAttr]) {
                errorReport("MagicInput.js", "getFullInputVal", 'inputData.' + tagDataAttr + ' not exist!', inputData);
                return '';
            }

            if (!inputData[tagDataAttr][tagIndexDataAttr]) {
                errorReport("MagicInput.js", "getFullInputVal", 'inputData.' + tagDataAttr + '[' + tagIndexDataAttr + '] not exist!', inputData);
                return '';
            }

        }

        return str
    };

    const setCaretOnTheEndOfInput = () => {
        //debugger;
        let length = $magicInput[0].childNodes.length;
        setCaret($magicInput[0], length - 1, -1);
    }

    const setBlockNearOnEnterUp = (_blockNearOnEnterUp) => {
        blockNearOnEnterUp = _blockNearOnEnterUp;
    };

    this.init = init;
    this.addToInput = addToInput;
    this.setCaretOnTheEndOfInput = setCaretOnTheEndOfInput;
    this.isFocus = isFocus;
    this.focus = focus;
    this.blur = blur;
    this.clearMagicInput = clearMagicInput;
    this.setInput = setInput;
    this.setColorInput = setColorInput;
    this.getFullInputVal = getFullInputVal;
    this.getEscapeFullInputVal = getEscapeFullInputVal;
    this.setBlockNearOnEnterUp = setBlockNearOnEnterUp;

}