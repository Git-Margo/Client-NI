let Tutorials = require('core/tutorial/Tutorials');
let PLDataTutorial = require('core/tutorial/PLDataTutorial');
let ENDataTutorial = require('core/tutorial/ENDataTutorial');
var bigInt = require("big-integer");
let ItemState = require('core/items/ItemState');
var TutorialData = require('core/tutorial/TutorialData');

module.exports = function() {

    let self = this;
    const moduleData = {
        fileName: "TutorialManager.js"
    };

    this.list = {};
    this.externalList = {
        [CFG.LANG.PL]: {},
        [CFG.LANG.EN]: {}
    };

    this.plData = null;
    this.enData = null;

    this.oneSend = false;

    //this.idToStartAfterInterfaceLoad = {};
    this.idToStartAfterInterfaceLoad = [];



    this.init = () => {
        //Engine.bigInt = bigInt;
        //console.log('bigInt', bigInt(1));

        this.plData = new PLDataTutorial();
        this.plData.init();

        this.enData = new ENDataTutorial();
        this.enData.init();

        this.test();
    };

    this.test = () => {
        this.testHeader(Engine.tutorialManager.list.en);
        this.testHeader(Engine.tutorialManager.list.pl);

        this.testText(Engine.tutorialManager.list.en);
        this.testText(Engine.tutorialManager.list.pl);

        this.testAvailableTutorialId(Engine.tutorialManager.list.en);
        this.testAvailableTutorialId(Engine.tutorialManager.list.pl);
    };

    this.literatGetAllHeadersName = () => {
        let pl = Engine.tutorialManager.list.pl;
        let str = '';
        debugger;
        for (let k in pl) {
            str += 'id: ' + k + ' ' + _t(pl[k][0].headerPc, null, 'new_tutorials') + '\n';
        }
        return str;
    };

    this.literatGetHeadersNameOfDoneTutorialStepByBits = (literatBits) => {

        let list = Engine.tutorialManager.list[_l()];
        let str = '\n';

        for (let k in list) {
            if (this.bitIsSet(literatBits, k)) {
                let headerStr = k == 53 ? 'Witaj w Margonem!' : _t(list[k][0].headerPc, null, 'new_tutorials');
                str += k + '| ' + headerStr + ';\n';
            }
        }
        return str;
    };

    this.literatGetRaportAllHeadersName = () => {
        let list = Engine.tutorialManager.list[_l()];
        let str = '';
        // debugger;
        for (let k in list) {
            let headerStr = k == 53 ? 'Witaj w Margonem!' : _t(list[k][0].headerPc, null, 'new_tutorials');
            str += k + '| ' + headerStr + ';\n';
        }
        return str;
    };

    this.testAvailableTutorialId = (testList) => {
        if (testList.hasOwnProperty('0')) return console.error('Tutorial id must be more than 0!');

        for (let k in testList) {

            if (isNaN(parseInt(k))) return console.error('Tutorial id must be integer!', k);
            if (k > 53) return console.error('Tutorial id more than 53 is forbidden! Incorrect id:', k);
        }
    };

    this.testHeader = (testList) => {
        for (let k in testList) {
            let oneTutorialStep = testList[k][0];

            if (!oneTutorialStep.hasOwnProperty('headerPc')) return console.error('tutorialStep:', k, 'has not headerPc!');
            if (!oneTutorialStep.hasOwnProperty('headerMobile')) return console.error('tutorialStep:', k, 'has not headerMobile!');

        }

    };

    this.testText = (testList) => {
        for (let k in testList) {
            let oneTutorialStep = testList[k][0];

            if (!oneTutorialStep.hasOwnProperty('textPc')) return console.error('tutorialStep:', k, 'has not textPc!');
            if (!oneTutorialStep.hasOwnProperty('textMobile')) return console.error('tutorialStep:', k, 'has not textMobile!');

        }

    };

    this.bitIsSet = (bits, id) => {
        //return bigInt(bits).and(Math.pow(2, id - 1)) > 0
        return bigInt(bits).and(bigInt(2).pow(id - 1)) > 0
    };

    this.setBit = (bits, id) => {
        //Math.pow(2, id);
        //return bigInt(bits).or(Math.pow(2, id - 1))
        return bigInt(bits).or(bigInt(2).pow(id - 1))
    };

    this.safariBigIntOr = (val1, val2) => {
        console.log(bigInt(val1).or(val2));
    };

    this.OLDbitIsSet = (bits, id) => {
        //return !((bits & Math.pow(2, id)) == 0);
        let bigIntBits = BigInt(bits);
        //return bits & (1 << id - 1);

        let bigIntId = BigInt(id);

        return parseInt(((bigIntBits & (BigInt(1) << bigIntId - BigInt(1))).toString()));
    };

    this.OLDsetBit = (bits, id) => {
        let bigIntBits = BigInt(bits);
        let bigIntId = BigInt(id);
        //bigIntBits ^= BigInt(1) << bigIntId - BigInt(1);      // To toggle a bit
        //bigIntBits &= ~(BigInt(1) << bigIntId - BigInt(1));   // To clear a bit:
        bigIntBits |= BigInt(1) << bigIntId - BigInt(1); // To set a bit:
        let parseVal = parseInt(bigIntBits.toString());
        console.log(parseVal);
        return parseVal;
    };

    //let asd = 4503599627370496;     // max 2^52	---> bit 53 is set

    //this.setAsdBit = (id) => {
    //    asd = this.setBit(asd, id);
    //}

    //this.bitsTest = (val) => {
    //    for (let i = 0 ; i < 64; i++) {
    //        if (Engine.tutorialManager.bitIsSet(asd, i) != 0) console.log('bit ' +i+ ' is set')
    //    }
    //};

    this.getItemByClass = (allItems, clObjectToClone, data) => {
        let clObject = JSON.parse(JSON.stringify(clObjectToClone));

        // let items = Engine.items.test().items;
        let findItems = [];

        let allItemsEquip = true;
        let allItemsInBag = true;

        for (let k in allItems) {

            let i = allItems[k];
            let cl = i.cl;

            if (!clObject.hasOwnProperty(cl)) continue;
            if (i.loc != clObject[cl].loc) continue;
            if (clObject[cl].hasOwnProperty('tpl') && clObject[cl].tpl != i.getTpl()) continue;

            let add = false;

            if (!data) add = true;
            else {

                let fullFillInUse = null;
                let fullFillMinOneOfAllNotEquip = null;
                let fullFillStats = null;

                if (data.hasOwnProperty('inUse')) {
                    fullFillInUse = false;

                    if (data.inUse && ItemState.isEquippedSt(i.st) || !data.inUse && ItemState.isInBagSt(i.st)) fullFillInUse = true;
                }

                if (data.hasOwnProperty('minOneOfAllNotEquip')) {
                    fullFillInUse = true;
                    if (ItemState.isInBagSt(i.st)) allItemsEquip = false;
                }

                if (data.hasOwnProperty('haveOneOfAllAndAllNotEquip')) {
                    fullFillInUse = true;
                    if (!ItemState.isInBagSt(i.st)) allItemsInBag = false;
                }

                if (data.stats) {
                    fullFillStats = false;
                    if (this.checkFulfillStatsInItem(i, data.stats)) fullFillStats = true;

                }

                add = this.addManage([fullFillInUse, fullFillMinOneOfAllNotEquip, fullFillStats]);

            }

            if (add) {
                findItems.push(i);

                if (clObject[cl].hasOwnProperty('amount')) {

                    clObject[cl].amount--;
                    if (clObject[cl].amount < 1) delete clObject[cl];

                } else delete clObject[cl];
            }

            if (data && data.hasOwnProperty('minOneOfAllNotEquip')) {

                if (!Object.keys(clObject).length) return allItemsEquip ? false : findItems;

            }

            if (!Object.keys(clObject).length) {

                if (data && data.hasOwnProperty('haveOneOfAllAndAllNotEquip')) return allItemsInBag ? findItems : false;

                return findItems;
            }
        }

        if (data && data.hasOwnProperty('haveOneOfAllAndAllNotEquip') && findItems.length) return allItemsInBag ? findItems : false;

        return false;
    };

    this.addManage = (statesArray) => {
        let statesToCheck = [];
        for (let i = 0; i < statesArray.length; i++) {
            let val = statesArray[i];
            if (val !== null) statesToCheck.push(val)
        }
        return !(statesToCheck.indexOf(false) > -1);
    };

    this.checkFulfillStatsInItem = (item, stats) => {
        let copyStats = this.copyObject(stats);

        for (let k in copyStats) {
            let canDel = false;
            let hasProperty = item._cachedStats.hasOwnProperty(k);

            if (!hasProperty) continue;

            if (copyStats[k] === true) canDel = true;
            else {
                let typeCompare = copyStats[k][0];
                let requireStatVal = copyStats[k][1];
                let parseRequireStatVal = parseInt(requireStatVal);
                let parseItemStatVal = parseInt(item._cachedStats[k]);

                switch (typeCompare) {
                    case '>=':
                        if (parseItemStatVal >= parseRequireStatVal) canDel = true;
                        break;
                    case '<=':
                        if (parseItemStatVal <= parseRequireStatVal) canDel = true;
                        break;
                    case TutorialData.STAT_OPERATION.NUMBER_EQUAL: // numbers compare
                        if (parseItemStatVal == parseRequireStatVal) canDel = true;
                        break;
                    case TutorialData.STAT_OPERATION.STRING_EQUAL: // strings compare
                        if (item._cachedStats[k] == requireStatVal) canDel = true;
                        break;
                    default:
                        console.warn('[TutorialManager.js, checkFulfillStatsInItem] Unsupported compare type:', typeCompare);
                        break;
                }
            }
            if (canDel) delete copyStats[k];
        }

        return !Object.keys(copyStats).length;
    };

    this.copyObject = (obj) => {
        let copyObj = {};
        for (let j in obj) {
            copyObj[j] = obj[j]
        }
        ``
        return copyObj;
    };

    this.checkHasQuest = (id) => {
        //return true;
        return Engine.quests.getQuestData(id);
    };

    this.checkMinLevel = (minLevel) => {
        return Engine.hero.d.lvl >= minLevel;
    };

    this.checkMaxLevel = (maxLevel) => {
        return Engine.hero.d.lvl <= maxLevel;
    };

    this.checkMap = (idMaps) => {
        return idMaps.indexOf(Engine.map.d.id) > -1;
    };

    this.needItemsTest = (dataFromList) => {
        if (!dataFromList.itemsNeed) return true;
        let iNeed = dataFromList.itemsNeed;
        let itemsToSearch = null; // = iNeed.items[Engine.hero.d.prof];
        let allItems = null;
        let dataOpt = {};

        if (iNeed.items) {
            itemsToSearch = iNeed.items[Engine.hero.d.prof];
            allItems = Engine.items.test().items;
        }
        if (iNeed.tpls) {
            itemsToSearch = iNeed.tpls[Engine.hero.d.prof];
            let firstElement = getFirstElementInObject(itemsToSearch);
            allItems = Engine.tpls.test().tpls[firstElement.loc];

            if (allItems == null) return false;
        }

        if (allItems == null) {
            errorReport('TutorialManager.js', 'needItemsTest', 'iNeed have not attr iNeed.items or iNeed.tpls!', iNeed);
            return false
        }

        if (iNeed.hasOwnProperty('minOneOfAllNotEquip')) dataOpt['minOneOfAllNotEquip'] = true;
        if (iNeed.hasOwnProperty('haveOneOfAllAndAllNotEquip')) dataOpt['haveOneOfAllAndAllNotEquip'] = true;
        if (iNeed.hasOwnProperty('inUse')) dataOpt['inUse'] = iNeed.inUse;
        if (iNeed.hasOwnProperty('stats')) dataOpt['stats'] = iNeed.stats;

        let d = Object.keys(dataOpt).length ? dataOpt : false;

        return this.getItemByClass(allItems, itemsToSearch, d);
    };

    this.getTutorialNeedItems = () => {
        let id = Engine.tutorials.getActive();
        let dataFromList = this.getDataFromList(id);
        return dataFromList.itemsNeed;
    };

    this.checkUseItemIsRightWithTutorialItemsNeed = (itemData) => {
        let id = Engine.tutorials.getActive();
        let dataFromList = this.getDataFromList(id);

        let prof = Engine.hero.d.prof;
        let items = dataFromList.itemsNeed.items[prof];
        let existTplInNeedItems = false;
        let tplId = itemData.tpl;

        for (let k in items) {

            if (!items[k].tpl) continue;
            if (items[k].tpl == tplId) return true;

            existTplInNeedItems = true;
        }

        return existTplInNeedItems ? false : true;
    };

    this.checkBlockHotKeys = (clbName) => {
        if (!Engine.tutorials) return false;
        let dataFromList = this.getDataFromList(Engine.tutorials.active);
        if (!dataFromList.blockedHotKeys) return false;

        if (dataFromList.blockedHotKeys.includes(clbName)) {
            message(_t('hotkey_forbidden'));
            return true
        }
        return false
    };

    this.checkBlockWidgets = (clbName) => {
        if (!Engine.tutorials) return false;
        let dataFromList = this.getDataFromList(Engine.tutorials.active);
        if (!dataFromList.blockedWidget) return false;

        if (dataFromList.blockedWidget.includes(clbName)) {
            message(_t('widget_forbidden'));
            return true
        }
        return false
    };

    this.checkFullFillFromList = (id, data, externalData) => {

        let dataFromList = externalData ? externalData : this.getDataFromList(id);

        if (dataFromList.idMaps && !this.checkMap(dataFromList.idMaps)) return false;

        if (dataFromList.itemsNeed && !this.needItemsTest(dataFromList)) return false;

        if (dataFromList.canvasFocus) {
            let _id = dataFromList.canvasFocus.id;
            let type = dataFromList.canvasFocus.kind;
            if (type == TutorialData.TYPE_OBJECT.NPC && !Engine.npcs.getById(_id)) return false;
        }

        if (dataFromList.canvasMultiGlow) {
            let o = dataFromList.canvasMultiGlow.list[0];
            if (o.type == TutorialData.TYPE_OBJECT.NPC && !Engine.npcs.getById(o.id)) return false;
        }

        //if (dataFromList.htmlMultiGlow) {
        //    for (let k in dataFromList.htmlMultiGlow) {
        //        if (!$(dataFromList.htmlMultiGlow[k]).length) return false;
        //    }
        //}

        if (dataFromList.hasQuestId && !this.checkHasQuest(dataFromList.hasQuestId)) return false;

        if (dataFromList.minLevel && !this.checkMinLevel(dataFromList.minLevel)) return false;

        if (dataFromList.maxLevel && !this.checkMaxLevel(dataFromList.maxLevel)) return false;

        if (dataFromList.additionalRequireFunction && !dataFromList.additionalRequireFunction(id, data)) return false;

        return true;
    };

    this.checkFullFillInterfaceRequire = (id, data, externalData) => {
        return this.checkFullFillFromList(id, data, externalData);
    };

    this.checkIsSameNpc = (data, id) => {
        return data.idNpc == id;
    };

    this.getDataFromList = (id) => {
        //return this.list[_l()][id][0];
        let lang = _l();
        if (this.list[lang][id]) return this.list[lang][id][0];
        if (this.externalList[lang][id]) return this.externalList[lang][id][0];

        errorReport("TutorialManager.js", "getDataFromList", `id ${id} not exist!`, this.list);
        errorReport("TutorialManager.js", "getDataFromList", `id ${id} not exist!`, this.externalList);

        return {};
    };

    this.itemIsLootbox = (item) => {
        return item._cachedStats.lootbox
    };

    this.getSelectorsFromNeedItems = (t, a) => {
        //let a = [];
        let items = Engine.tutorialManager.needItemsTest(t);
        for (let j = 0; j < items.length; j++) {
            a.push(".item-id-" + items[j].id);
        }
        //return a;
    };

    this.itemsInBasket = (id) => {
        let dataFromList = this.getDataFromList(id);
        let items = [];

        this.getSelectorsFromNeedItems(dataFromList, items);

        if (!items.length) return false;

        let $basket = Engine.shop.wnd.$.find('.buy-items');

        for (let i = 0; i < items.length; i++) {
            if (!$basket.find(items[i]).length) return false
        }

        return true;
    };

    this.checkIsMoveTutorial = () => {
        let moveTutorial = Engine.tutorials.active === 1;
        if (moveTutorial) {
            if (this.oneSend) return false;
            else {
                this.oneSend = true;
                return true
            }
        }
        return false;
    };

    this.idExist = (id) => {
        for (let i = 0; i < this.idToStartAfterInterfaceLoad.length; i++) {
            if (this.idToStartAfterInterfaceLoad[i].id == id) return true;
        }
        return false;
    };

    this.tutorialStart = function(lang, id, data, externalData) {
        //if (_l() != 'pl') return
        if (_l() != lang) return;

        //console.log('tutorialCheck', id);
        if (Engine.tutorials && Engine.tutorials.active == id) {
            //console.log('refreshView');
            Engine.tutorials.refreshViewOfTutorialStep();
        }

        if (!externalData && this.bitIsSet(Engine.tutorialValue, id)) return;

        if (!externalData && !getAlreadyInitialised()) {
            //this.idToStartAfterInterfaceLoad[id] = {id:id,data:data};
            if (!this.idExist(id)) {
                let o = {
                    lang: _l(),
                    id: id,
                    data: data
                }
                //if (externalData) o.externalData = externalData;
                this.idToStartAfterInterfaceLoad.push(o);
            }
            return;
        }

        if (!this.checkFullFillInterfaceRequire(id, data, externalData)) return;

        if (!Engine.tutorials) Engine.tutorials = new Tutorials();
        Engine.tutorials.create(id, externalData);
    };

    this.startAfterInterfaceLoad = () => {
        // for (let k in this.idToStartAfterInterfaceLoad) {
        //     let rec = this.idToStartAfterInterfaceLoad[k];
        //     this.tutorialStart(rec.id, rec.data);
        // }

        for (let i = 0; i < this.idToStartAfterInterfaceLoad.length; i++) {
            let rec = this.idToStartAfterInterfaceLoad[i];
            this.tutorialStart(rec.lang, rec.id, rec.data, isset(rec.externalData) ? rec.externalData : null);
        }
    };
    //
    //const getNewId = (lang) => {
    //    let min     = -1; // 0 is forbidden! The biggest id is -1!
    //    let _list   = this.externalList[lang];
    //
    //    if (lengthObject(_list) == 0) return -1;
    //
    //    for (let k in _list) {
    //        let parseNumber = parseInt(k);
    //        if (parseNumber < min) min = parseNumber
    //    }
    //
    //    return min - 1;
    //}

    this.startTutorialFromRayController = (data) => {
        //if (data.case && !Engine.rajCase.checkFullFillCase(data.case)) return;
        if (!Engine.rajCase.checkFullFillCase(data.case)) return;

        const FUNT = "startTutorialFromRayController";

        let lang = _l();
        //let newId = getNewId(lang);
        let newId = data.id;

        if (!isInt(newId) || newId > -1) {
            errorReport(moduleData.fileName, FUNT, `only negative number is correct for id!`, data);
            return
        }

        if (this.externalList[lang][newId]) return;

        if (this.checkPreventRepeatExist(data)) {

            if (!this.checkCanAddToExternalList(data)) return;

        }

        this.externalList[lang][newId] = [data];

        Engine.tutorialManager.tutorialStart(lang, newId, null, data);
    };

    this.checkPreventRepeatExist = (_externalData) => {
        if (!_externalData.preventRepeat) return false;
        if (!_externalData.preventRepeat.name) return false;

        return true;
    }

    this.checkCanAddToExternalList = (externalData) => {

        if (!this.checkPreventRepeatExist(externalData)) return true;

        let lang = _l();

        for (let k in this.externalList[lang]) {
            let data = this.externalList[lang][k][0];

            if (!this.checkPreventRepeatExist(data)) continue;

            if (this.checkPreventRepeatNameSame(externalData, data)) return false;
        }

        return true
    }

    this.checkPreventRepeatNameSame = (externalData1, _externalData2) => {
        return externalData1.preventRepeat.name == _externalData2.preventRepeat.name;
    }

    // this.callNextTutorialIfFullFillRequires = (id) => {
    //     let nextId = this.getNextTutorialIdIfExist(id);
    //     if (nextId != null) {
    //         this.tutorialStart(nextId);
    //     }
    // };

    this.checkCanFinishExternalAndFinish = (tutorialDataTrigger) => {

        if (!Engine.tutorials) return;

        let activeId = Engine.tutorials.getActive();
        let _list = this.externalList[_l()];
        let oneTutorialData = _list[activeId];

        if (!_list[activeId]) return;
        //if (!checkExternalFinish(oneTutorialData, tutorialDataTrigger, activeId))   return;
        let result = checkExternalFinish(oneTutorialData, tutorialDataTrigger, activeId);

        if (!result.result) return;

        Engine.tutorials.finishTutorial();
        delete _list[activeId];

        //if (this.checkOnFinishExternalProperties(oneTutorialData)) this.callOnFinishExternalProperties(oneTutorialData);

        let externalPropertiesExist = this.checkOnFinishExternalProperties(oneTutorialData);

        if (externalPropertiesExist) {

            if (result.kind == TutorialData.ON_FINISH_TYPE.BREAK) return;

            this.callOnFinishExternalProperties(oneTutorialData);
        }

    };

    this.checkOnFinishExternalProperties = (data) => {
        return data[0].onFinish.external_properties ? true : false;
    }

    this.callOnFinishExternalProperties = (data) => {
        let d = data[0].onFinish.external_properties;
        Engine.rajController.parseObject(d);
    }

    const checkExternalFinish = (oneTutorialData, tutorialDataTrigger, activeId) => { // tutorialFinishRequireName) => {
        let onFinish = oneTutorialData[0].onFinish;

        if (!onFinish) {
            errorReport("TutorialManager.js", "checkExternalFinish", "onFinish not exist :O", oneTutorialData);
            message('LOOK TO CONSOLE!');
            //return false;
            return {
                result: false,
                kind: "SYSTEM"
            };
        }

        let require = onFinish[TutorialData.ON_FINISH_TYPE.REQUIRE];
        let absoluteFinish = onFinish[TutorialData.ON_FINISH_TYPE.ABSOLUTE_FINISH];
        let breakTutorial = onFinish[TutorialData.ON_FINISH_TYPE.BREAK];

        if (!require) {
            errorReport("TutorialManager.js", "checkExternalFinish", "onFinish.require not exist :O", oneTutorialData);
            message('LOOK TO CONSOLE!')
            //return false;
            return {
                result: false,
                kind: "SYSTEM"
            };
        }


        if (breakTutorial && tutorialDataTrigger.type == TutorialData.ON_FINISH_TYPE.BREAK) {
            for (let i = 0; i < breakTutorial.length; i++) {
                let oneBreakName = breakTutorial[i];

                //if (oneBreakName == tutorialDataTrigger.name) return true;
                if (oneBreakName == tutorialDataTrigger.name) return {
                    result: true,
                    kind: TutorialData.ON_FINISH_TYPE.BREAK
                };
            }
        }

        if (absoluteFinish && tutorialDataTrigger.type == TutorialData.ON_FINISH_TYPE.ABSOLUTE_FINISH) {
            for (let i = 0; i < absoluteFinish.length; i++) {
                let oneAbsoluteFinishName = absoluteFinish[i];

                //if (oneAbsoluteFinishName == tutorialDataTrigger.name) return true;
                if (oneAbsoluteFinishName == tutorialDataTrigger.name) return {
                    result: true,
                    kind: TutorialData.ON_FINISH_TYPE.ABSOLUTE_FINISH
                };
            }
        }

        for (let i = 0; i < require.length; i++) {
            let oneRequire = require[i];

            if (!oneRequire[tutorialDataTrigger.name]) continue;
            if (!checkExternalOneTutorialRequireFullFill(oneRequire, tutorialDataTrigger, activeId)) continue;

            require.splice(i, 1);
            i--;
        }

        let result = require.length ? false : true;

        return {
            result: result,
            kind: TutorialData.ON_FINISH_TYPE.REQUIRE
        };
    };

    this.createTutorialDataTrigger = (name, type, val) => {
        return {
            name: name,
            type: type,
            [name]: val
        }

    }

    const checkExternalOneTutorialRequireFullFill = (oneRequire, tutorialDataTrigger, activeId) => {

        const OFR = TutorialData.ON_FINISH_REQUIRE;
        const USE_ITEM_TPL = OFR.USE_ITEM_TPL;
        const TALK_NPC_ID = OFR.TALK_NPC_ID;
        const CLICK_RECIPE_ON_LIST = OFR.CLICK_RECIPE_ON_LIST;
        const CLICK_BARTER_OFFER_ON_LIST = OFR.CLICK_BARTER_OFFER_ON_LIST;
        const USE_RECIPE = OFR.USE_RECIPE;
        const USE_BARTER_OFFER = OFR.USE_BARTER_OFFER;
        const ATTACK_NPC_ID = OFR.ATTACK_NPC_ID;
        const USE_BATTLE_SKILL = OFR.USE_BATTLE_SKILL;
        const CLICK_WIDGET = OFR.CLICK_WIDGET;
        const OPEN_WINDOW = OFR.OPEN_WINDOW;



        switch (tutorialDataTrigger.name) {
            case USE_ITEM_TPL:
                return oneRequire[USE_ITEM_TPL].includes(tutorialDataTrigger[USE_ITEM_TPL]);
            case TALK_NPC_ID:
                return oneRequire[TALK_NPC_ID] == tutorialDataTrigger[TALK_NPC_ID];
            case CLICK_RECIPE_ON_LIST:
                return oneRequire[CLICK_RECIPE_ON_LIST] == tutorialDataTrigger[CLICK_RECIPE_ON_LIST];
            case CLICK_BARTER_OFFER_ON_LIST:
                return oneRequire[CLICK_BARTER_OFFER_ON_LIST] == tutorialDataTrigger[CLICK_BARTER_OFFER_ON_LIST];
            case USE_RECIPE:
                return oneRequire[USE_RECIPE] == tutorialDataTrigger[USE_RECIPE];
            case USE_BARTER_OFFER:
                return oneRequire[USE_BARTER_OFFER] == tutorialDataTrigger[USE_BARTER_OFFER];
            case ATTACK_NPC_ID:
                return oneRequire[ATTACK_NPC_ID] == tutorialDataTrigger[ATTACK_NPC_ID];
            case USE_BATTLE_SKILL:
                return oneRequire[USE_BATTLE_SKILL] == tutorialDataTrigger[USE_BATTLE_SKILL];
            case CLICK_WIDGET:
                return oneRequire[CLICK_WIDGET] == tutorialDataTrigger[CLICK_WIDGET];
            case OPEN_WINDOW:
                return oneRequire[OPEN_WINDOW] == tutorialDataTrigger[OPEN_WINDOW];
            case OFR.ITEMS_IN_BASKET:
                return self.itemsInBasket(activeId);
            case OFR.MOVE_REQUIRE:
                return true;
            case OFR.HERO_LEAVE_BATTLE_BUTTON_OR_HOTKEY:
                return true;
            case OFR.ACCEPT_BASKET:
                return true;
            default:
                errorReport("TargetsManager.js", "checkExternalTutorialRequireFinish", "tutorialFinishRequireName not exist!", tutorialDataTrigger.name);
                return false;
        }
    }

    this.onClear = () => {
        this.externalList[CFG.LANG.PL] = {};
        this.externalList[CFG.LANG.EN] = {};
    }

    this.checkCanFinishAndFinish = (lang, id, data) => {
        //if (_l() != 'pl') return
        if (_l() != lang) return;

        if (!Engine.tutorials) return;
        if (Engine.tutorials.active != id) return;

        switch (lang) {
            case CFG.LANG.PL:
                if (!this.plData.checkCanFinish(id, data)) return;
                break;
            case CFG.LANG.EN:
                if (!this.enData.checkCanFinish(id, data)) return;
                break;

                //break;
            default:
                console.warn('[TutorialManager.js, checkCanFinishAndFinish] Lang: ' + lang + ' not supported!');
                return;
                break;
        }
        //if (!this.checkCanFinish(id, data)) return;
        Engine.tutorials.finishTutorial();
        //this.callNextTutorialIfFullFillRequires(id);
    };

};
//return
//debugger;
//Engine.tutorialManager.tutorialStart('pl', -1, null, {
// "textPc": "testowy textPc",
// "textMobile": "testowy textMobile",
// "headerPc": "testowy HeaderPc",
// "headerMobile": "testowy HeaderMobile",
// "graphic" : '/img/gui/newTutorial/1.gif',
// "htmlFocus": '.interface-layer>.right-column.main-column',
// "htmlPosition": '.interface-layer>.right-column.main-column',
// "itemsNeed": {
//   "htmlMultiGlow": true,
//   "items": {
//     "w": {"15":{"loc": "g", "tpl": 19809}},
//     "p": {"15":{"loc": "g", "tpl": 19809}},
//     "m": {"15":{"loc": "g", "tpl": 19809}},
//     "t": {"15":{"loc": "g", "tpl": 19809}},
//     "h": {"15":{"loc": "g", "tpl": 19809}},
//     "b": {"15":{"loc": "g", "tpl": 19809}}
//   }
// },
// "blink": true,
//    onFinish : ["useItemTpl": 123]
//
//
//
//})