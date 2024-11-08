const moduleData = {
    fileName: "ChatMessageWithMarkReplace.js"
};

const getMyRegExp = (markData, additionalData) => {

    let getPattern = markData.getPattern;
    let getDynamicPattern = markData.getDynamicPattern;

    if (getPattern && getDynamicPattern) {
        errorReport(moduleData.fileName, "getMyGegExp", "Declare getPattern and additionalData is impossible!", oneMarkData);
        return markData.getPattern();
    }

    if (getPattern) return getPattern();
    if (getDynamicPattern) return getDynamicPattern(additionalData);
};

const getPrepareDataToCreateElementsArray = (str, markData, unsecure, additionalData) => {
    let lengthStr = str.length;
    let counter = 0;
    let lastIndex = 0;
    //let myRe            = additionalData ? markData.getPattern(additionalData) : markData.getPattern();
    let myRe = getMyRegExp(markData, additionalData);
    let marksDataArray = [];
    let htmlString = [];
    let myArray;

    while ((myArray = myRe.exec(str)) !== null) {

        let index = myArray.index;

        if (lastIndex < index) {
            let text = str.substr(lastIndex, index - lastIndex);

            htmlString.push(createTxtSpanString(text, unsecure));
            marksDataArray.push(getMarksData(str, myArray, markData));
            htmlString.push(createItemSpanString(counter, unsecure));

        } else {
            marksDataArray.push(getMarksData(str, myArray, markData));
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
        marksDataArray
    }
};

const getMarksData = (str, myArray, markData) => {


    if (!markData.dynamicMark) {
        return {
            style: markData.style,
            text: markData.text
        };
    } else {

        let o = {
            style: markData.style,
            dynamicData: []
        };

        for (let i = 1; i < myArray.length; i++) {

            let v = myArray[i];

            v = v.replaceAll('&quot;', '');
            v = v.replaceAll('"', '');

            o.dynamicData.push(v)
        }

        return o;
    }

};

const manageOfCheckAndRemoveIncorrectTags = (data) => { // issue with not closed tags... When that tag exist, here will remove
    let htmlString = data.htmlString;
    let toCheck = ['strong'];

    for (let k in htmlString) {
        let str = htmlString[k];
        let tagsData = getDataAllTagsCloseInStr(str, toCheck);

        if (tagsData.allClose) continue;

        removeNotCloseTagsFromTagsList(tagsData.list, htmlString, k);
    }
}

const removeNotCloseTagsFromTagsList = (listTagsToDelete, htmlString, htmlStringIndex) => {
    for (let kk in listTagsToDelete) {

        let tagNameToDelete = listTagsToDelete[kk];

        htmlString[htmlStringIndex] = htmlString[htmlStringIndex].replaceAll('<' + tagNameToDelete + '>', "");
        htmlString[htmlStringIndex] = htmlString[htmlStringIndex].replaceAll('</' + tagNameToDelete + '>', "");
    }
};

const getArrayWith$spanTextAnd$linkedItems = (data, markData, unsecure) => {
    //let $join         = $('<div>').html(data.htmlString);

    if (unsecure) manageOfCheckAndRemoveIncorrectTags(data);

    let $join = unsecure ? $('<div>' + data.htmlString.join('') + '</div>') : $('<div>').html(data.htmlString);
    let elementsArray = [];

    for (let i in data.marksDataArray) {
        let d = data.marksDataArray[i];
        let $el = createMarkItemSpan(d, markData);

        $join.find('.mark-' + i).replaceWith($el);
    }

    $join.children().each(function() {
        elementsArray.push($(this));
    });

    return elementsArray;
};

const createMarkItemSpan = (data, markData) => {
    let $span = $('<span>');

    // TODO CLASS $span.addClass('linked-chat-item');

    let style = null;

    try {
        style = JSON.parse(data.style);
    } catch (e) {
        errorReport('ChatMessageWithMarkReplace.js', 'createMarkItemSpan', 'Incorrect JSON format!', data.style);
    }

    if (style != null) $span.css(style);

    let txt = null;
    let tip = null;

    if (markData.dynamicMark) {
        txt = markData.dynamicMark(data.dynamicData);
        if (markData.getDynamicTip) tip = markData.getDynamicTip(data.dynamicData);
    } else {
        txt = data.text;
        if (markData.getTip) tip = markData.getTip();
    }

    //if (markData.dynamicMark)   txt = markData.dynamicMark(data.dynamicData);
    //else                        txt = data.text;

    $span.text(txt);
    $span.addClass("mark-message-span");

    if (tip != null) $span.tip(tip);

    return $span;
};

const getDataAllTagsCloseInStr = (str, tagsToCheck) => {
    let allClose = true;
    let list = [];

    for (let i = 0; i < tagsToCheck.length; i++) {
        let tagName = tagsToCheck[i];
        let tagStart = "<" + tagName + ">";
        let tagEnd = "</" + tagName + ">";
        let result = amountTagsIsCorrect(str, tagStart, tagEnd);

        if (result) continue;

        allClose = false;
        list.push(tagName);
    }

    return {
        allClose: allClose,
        list: list
    }
};

const amountTagsIsCorrect = (str, tagStart, tagEnd) => {
    //let str = "<strong>asdasdasdada</strong>fgfdsgdfg</strong>asdasdadasdasd<strong>asdasdasdada</strong>"

    let r0 = new RegExp(tagStart + "(.*?)" + tagEnd, "g");
    let r1 = new RegExp(tagStart, "g");
    let r2 = new RegExp(tagEnd, "g");

    let a0;
    let a1;
    let a2;

    let counter0 = 0;
    let counter1 = 0;
    let counter2 = 0;

    while ((a0 = r0.exec(str)) !== null) {
        counter0++;
    }

    while ((a1 = r1.exec(str)) !== null) {
        counter1++;
    }

    while ((a2 = r2.exec(str)) !== null) {
        counter2++;
    }

    //console.log(counter0)
    //console.log(counter1)
    //console.log(counter2)

    return counter0 == counter1 && counter1 == counter2;
}

const createTxtSpanString = (text, unsecure) => {
    //let $span = $('<span>').text(text);
    //$span.addClass('mark-text-span');

    return unsecure ? `<span class="mark-text-span">${text}</span>` : $('<span>').addClass('mark-text-span').text(text);

    //return $span;
};

const createItemSpanString = (counter, unsecure) => {
    //return $('<span>').addClass(`mark-${counter}`);
    return unsecure ? `<span class="mark-${counter}"></span>` : $('<span>').addClass(`mark-message-span mark-${counter}`);
};

const parseReceiveMessageWithMark = (str, markData, unsecure, additionalData) => {

    let data = getPrepareDataToCreateElementsArray(str, markData, unsecure, additionalData);
    let elementsArray = getArrayWith$spanTextAnd$linkedItems(data, markData, unsecure);

    return elementsArray;
};

const parseReceiveSystemMessageWithMark = (str, markData, unsecure, additionalData) => {

    let data = getPrepareDataToCreateElementsArray(str, markData, unsecure, additionalData);
    let elementsArray = getArrayWith$spanTextAnd$linkedItems(data, markData, unsecure);

    return elementsArray;
};

let o = {
    parseReceiveSystemMessageWithMark,
    parseReceiveMessageWithMark,
    getMyRegExp
};

module.exports = o;