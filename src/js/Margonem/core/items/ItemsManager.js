/**
 * Created by lukasz on 2014-10-21.
 */
var Item = require('core/items/Item');
var Storage = require('core/Storage');

function isset(x) {
    return typeof(x) != 'undefined';
}
module.exports = function() {
    var self = this;
    var items = {};
    var locationCallbacks = {};
    var views = {};
    var fetchPackageController = {};
    let animTs;
    let noticeTop = 0;
    let drawNotice = true;


    let beforeUpdateDATACallbacks = {};
    let afterUpdateDATACallbacks = {};

    this.init = () => {
        this.createPlaceHolderItem();
        this.initTs();

        addClbToRedrawItemsAfterFocus();
    };

    const addClbToRedrawItemsAfterFocus = () => {
        getEngine().interface.addCallbackToInteraceFocusList(redrawItemsAfterFocus);
    };

    const redrawItemsAfterFocus = () => {
        for (let k in items) {
            items[k].setShouldDrawIcon(null);
        }
    };

    this.createPlaceHolderItem = () => {

        Engine.imgLoader.onload('../img/def-item.gif', false, (i) => {
            this.placeHolderItem = i;
        });
    };

    this.initTs = () => {
        animTs = ts();
    };

    this.updateNoticeTop = () => {
        let speed = 4;
        let newNoticeTop = Math.round(Math.abs(Math.sin(speed * ts() / 1000 - animTs)) * 4 * 10) / 10;
        //newNoticeTop = Math.round(newNoticeTop);

        let floorNewNoticeTop = Math.floor(newNoticeTop);

        let diff = newNoticeTop - floorNewNoticeTop;

        if (diff > 0.5) newNoticeTop = floorNewNoticeTop + 0.5;
        else newNoticeTop = floorNewNoticeTop;

        if (newNoticeTop == noticeTop) {
            drawNotice = false;
            return;
        }
        noticeTop = newNoticeTop;
        //console.log(noticeTop)
        drawNotice = true
    };

    this.getNoticeTop = () => {
        return noticeTop;
    };

    this.getPlaceholderItem = () => {
        return this.placeHolderItem;
    };

    this.createViewIcon = function(itemId, viewName) {

        let i = items[itemId];

        if (!i) {
            debugger;
            return false;
        }

        let $clone = i.$.clone(true);

        let oldCanvas = i.$canvasIcon[0];
        let newCanvas = $clone.find('.canvas-icon')[0];
        let context = newCanvas.getContext('2d');

        let $noticeCanvas = $clone.find('.canvas-notice');
        let noticeExist = $noticeCanvas.length;
        let noticeCanvas = null;
        let noticeContext = null;

        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;

        context.drawImage(oldCanvas, 0, 0);
        //noticeContext.clearRect(0, 0, noticeCanvas.width, noticeCanvas.height);

        i.updateDynamicTips($clone, /timelimit=([0-9]+)/, 1000);
        i.updateDynamicTips($clone, /expires=([0-9]+)/, 1000);

        let viewData; // = [$clone, context, newCanvas];

        if (noticeExist) {
            noticeCanvas = $noticeCanvas[0];
            noticeContext = noticeCanvas.getContext("2d");
            viewData = [$clone, context, newCanvas, noticeCanvas, noticeContext];
        } else {
            viewData = [$clone, context, newCanvas];
        }


        if (viewName) {
            if (!isset(views[itemId])) views[itemId] = {};
            if (!isset(views[itemId][viewName])) views[itemId][viewName] = [];
            views[itemId][viewName].push(viewData);

            this.checkViewExist(viewName);

        }

        if (noticeExist) {
            i.drawNotice(noticeContext, noticeCanvas);
        }

        return viewData
    };

    this.checkViewExist = (viewName) => {
        if (!Engine.itemsViewData[viewName]) errorReport('ItemsManager.js', 'createViewIcon', 'Unregistered viewName: ' + viewName);
    }

    this.changePlaceHolderIconIntoNormalIcon = (itemId) => {

        let allViewsInViewsName = views[itemId];

        if (!allViewsInViewsName) return;

        let i = items[itemId];


        for (let k in allViewsInViewsName) {
            let arrayViewsOfOneName = allViewsInViewsName[k];

            for (let j = 0; j < arrayViewsOfOneName.length; j++) {


                let $clone = i.$.clone(true);

                let oldCanvas = i.$canvasIcon[0];
                let newCanvas = $clone.find('.canvas-icon')[0];

                let context = newCanvas.getContext('2d');

                newCanvas.width = oldCanvas.width;
                newCanvas.height = oldCanvas.height;

                context.drawImage(oldCanvas, 0, 0);

                arrayViewsOfOneName[j][0].find('.canvas-icon').replaceWith($(newCanvas));
                arrayViewsOfOneName[j][1] = context;
                arrayViewsOfOneName[j][2] = newCanvas;
            }
        }
    };

    this.deleteViewIconIfExist = function(idItem, viewName) {
        if (views[idItem] && views[idItem][viewName]) Engine.items.deleteViewIcon(idItem, viewName);
    };

    this.deleteViewIcon = function(idItem, viewName) {
        if (!views[idItem]) return console.error('[ItemsManager.js, deleteViewIcon] View of item: ' + idItem + ' not exist!');
        if (!views[idItem][viewName]) return console.error('[ItemsManager.js, deleteViewIcon] ViewName of itemId: ' + idItem + ' not exist:' + viewName);

        let l = views[idItem][viewName].length;

        for (let i = 0; i < l; i++) {
            views[idItem][viewName][i][0].remove();
        }

        //views[idItem][viewName][0].remove();
        delete views[idItem][viewName];
    };

    this.deleteViewWithAllIcon = function(idItem) {
        for (let viewName in views[idItem]) {
            self.deleteViewIcon(idItem, viewName);
        }
        delete views[idItem];
    };

    this.addAndGetIdToFetchPackageController = function(d) {
        let id = 0;

        while (fetchPackageController[id]) {
            id++;
        }

        fetchPackageController[id] = {};

        for (let k in d) {
            let loc = d[k].loc;
            if (!loc) continue;
            if (!isset(fetchPackageController[id][loc])) fetchPackageController[id][loc] = 0;
            fetchPackageController[id][loc]++;
        }

        return id;
    };

    this.getFetchPackageController = function() {
        return fetchPackageController;
    };

    this.decreaseFetchPackageController = function(idFetchPackage, loc) {
        fetchPackageController[idFetchPackage][loc]--;

        if (fetchPackageController[idFetchPackage][loc] < 1) delete fetchPackageController[idFetchPackage][loc];

        this.checkClearFetchPackageController(idFetchPackage);
    };


    this.checkClearFetchPackageController = (idFetchPackage) => {
        if (!fetchPackageController[idFetchPackage]) return;

        if (!Object.keys(fetchPackageController[idFetchPackage]).length) delete fetchPackageController[idFetchPackage]
    };


    this.checkFetchFinish = function(idFetchPackage, loc) {
        self.decreaseFetchPackageController(idFetchPackage, loc);

        if (fetchPackageController[idFetchPackage]) {
            return !isset(fetchPackageController[idFetchPackage][loc]);
        }

        return true;
    };

    this.getLocToUpdate = (d) => {
        let o = {};
        for (let i in d) {
            let loc = d[i].loc;
            if (!o[loc]) {
                o[loc] = true
            }
        }
        return o;
    };

    this.updateDATA = function(d) {

        let locToUpdate = this.getLocToUpdate(d);
        let idFetchPackage = this.addAndGetIdToFetchPackageController(d);

        this.beforeUpdate(d, locToUpdate);

        for (var i in d) {

            if (isset(d[i].del)) {
                this.deleteItem(i);
                continue;
            }

            if (isset(items[i])) this.updateItem(i, d[i], idFetchPackage);
            else this.newItem(i, d[i], idFetchPackage, true);

        }

        this.checkClearFetchPackageController(idFetchPackage);
        this.afterUpdate(d, locToUpdate);
    };

    this.addToBeforeUpdateItemsCallback = (data, f) => {
        let loc = data.loc;
        if (!beforeUpdateDATACallbacks[loc]) beforeUpdateDATACallbacks[loc] = [];
        beforeUpdateDATACallbacks[loc].push(f)
    };

    this.addToAfterUpdateItemsCallback = (data, f) => {
        let loc = data.loc;
        if (!afterUpdateDATACallbacks[loc]) afterUpdateDATACallbacks[loc] = [];
        afterUpdateDATACallbacks[loc].push(f)
    };

    this.beforeUpdate = (d, locToUpdate) => {
        for (let loc in beforeUpdateDATACallbacks) {

            if (!locToUpdate[loc]) continue;

            for (let index in beforeUpdateDATACallbacks[loc]) {
                beforeUpdateDATACallbacks[loc][index](d);
            }
        }
    };

    this.afterUpdate = (d, locToUpdate) => {
        for (let loc in afterUpdateDATACallbacks) {

            if (!locToUpdate[loc]) continue;

            for (let index in afterUpdateDATACallbacks[loc]) {
                afterUpdateDATACallbacks[loc][index](d);
            }
        }
    };

    this.updateItem = function(i, d, idFetchPackage) {
        var changeLoc = items[i].loc != d.loc;
        var changeSt = items[i].st != d.st
        var isEnhancedItem = CFG.enhancedItemId == i;

        if (changeLoc || changeSt || isEnhancedItem) {
            this.checkGetNow(i, d);
            this.deleteItem(i);
            this.newItem(i, d, idFetchPackage, changeLoc);
        } else {
            items[i].update(d, idFetchPackage);
            this.decreaseFetchPackageController(idFetchPackage, items[i].loc);
        }
    };

    this.checkGetNow = function(i, d) {
        var bool1 = isset(items[i].getNow);
        var bool2 = items[i].loc == 'g';
        if (bool1 && bool2) d.getNow = false;
    };

    this.newItem = function(i, d, idFetchPackage, getNow) {
        if (Engine.reload && isset(d.loc) && d.loc == 'g' &&
            !(isset(Engine.hero.oldLvl) && Engine.hero.oldLvl > Engine.hero.d.lvl && Engine.hero.d.lvl === 1) // dirty fix for lvl-down to 1 (items update - for Berufs)
        ) return;
        var item = new Item(i, d, 'item');
        items[i] = item;

        item.setIdFetchPackage(idFetchPackage);
        item.update(d);
        if (getNow) item.firstGetNow();

        //this.newItemInLocation(d.loc, item, iteration);       <--------------------- MOVE TO ITEM UPDATE ICON CASE
        //Engine.itemsMarkManager.newItem(item);                <--------------------- MOVE TO ITEM UPDATE ICON CASE
    };

    this.deleteItem = function(i, beforeDelete = true) {
        if (isset(items[i])) {
            if (beforeDelete) {
                items[i].beforeDelete();
            }
            self.deleteViewWithAllIcon(i);
            Engine.stickyTips.deleteIfExist(i);
            Engine.itemsMarkManager.removeItem(items[i]);
            delete(items[i]);
        }
    };

    this.newItemInLocation = function(loc, item, idFetchPackage) {
        let finishFetch = self.checkFetchFinish(idFetchPackage, item.loc);
        //if (finishFetch) console.log('fetch finish id loc package:', loc, idFetchPackage);
        if (isset(locationCallbacks[loc])) {
            for (var i in locationCallbacks[loc]) {
                self.delayLocationCallbacks(item, loc, i, finishFetch);
            }
        }
    };

    this.delayLocationCallbacks = function(item, loc, i, finishFetch) {
        var locCallback = locationCallbacks[loc][i];
        locCallback(item, finishFetch);
        //if (item.onload) locCallback(item);
        //else setTimeout(function () {
        //	if (locationCallbacks[loc][i]) self.delayLocationCallbacks(item, loc, i);
        //}, 10);
    };

    this.fetchLocationItems = function(loc) {
        var ret = [];
        for (var i in items) {
            if (items[i].loc == loc && items[i]) ret.push(items[i]);
        }

        return ret;
    };

    this.addCallback = function(loc, name, c) {
        if (!isset(locationCallbacks[loc])) locationCallbacks[loc] = {};

        if (locationCallbacks[loc][name]) {
            console.error('[ItemsManager.js, addCallback] Fetch callback already use!', name);
            return;
        }

        locationCallbacks[loc][name] = c;
        // locationCallbacks[loc].push(c);
    };

    // this.removeCallback = function (loc, c) {
    this.removeCallback = function(data) {
        //console.log('removeCallback ITEMS', data)
        //console.log('removeCallback ITEMS', data)

        let loc = data.loc.split(',');
        let keyName = data.k;

        if (!isset(locationCallbacks[loc])) {
            console.error('[ItemsManager.js, removeCallback] Fetch callback not exist!', keyName);
            return;
        }

        delete locationCallbacks[loc][keyName];
        if (!Object.keys(locationCallbacks[loc]).length) delete locationCallbacks[loc];

        // var idx = locationCallbacks[loc].indexOf(c);
        // if (idx >= 0) {
        // 	locationCallbacks[loc].splice(idx, 1);
        // }
    };

    //this.fetch = function (locations, f) {
    this.fetch = function(data, f) {
        // console.log('fetch ITEMS', data)

        let locations = data.loc.split(',');
        let keyName = data.k;
        //var locations = locations.split(',');
        if (typeof(f) != 'function') return;

        for (var i = 0; i < locations.length; i++) {
            self.addCallback(locations[i], keyName, f);
            var loc_items = self.fetchLocationItems(locations[i]);
            let lastIndex = loc_items.length - 1;
            for (var k in loc_items) {
                let finish = lastIndex == k;
                f(loc_items[k], finish);
            }
        }
    };

    this.parseItemStat = function(s) {
        s = s.split(';');
        var obj = {};
        for (var i = 0; i < s.length; i++) {
            var pair = s[i].split('=');
            obj[pair[0]] = isset(pair[1]) ? pair[1] : null;
        }
        return obj;
    };

    this.deleteUnnecessaryItems = function() {
        var itemsTab = self.fetchLocationItems('l');
        for (var i in itemsTab) {
            self.deleteItem(itemsTab[i].id);
        }
    };

    this.getItemById = function(id) {
        return items[id];
    };

    this.onClear = function() {
        //TODO: remove ground items
    };

    this.test = function() {
        return {
            items: items,
            callbacks: locationCallbacks
        };
    };

    this.updateTrackHighlights = function() {
        for (let i in items) {
            items[i].$.find('.highlight').removeClass('track');
            //if (items[i].loc === "m" || Engine.items.getAllViewsById(i).length === 0) continue;
            if (items[i].loc === Engine.itemsFetchData.NEW_GROUND_ITEM.loc || Engine.items.getAllViewsById(i).length === 0) continue;
            Engine.items.getAllViewsById(i)[0].find('.highlight').removeClass('track');
        }


        return;
        if (Engine.questTrack && Engine.questTrack.activeTrack) {
            for (let c in Engine.questTrack.tasks) {
                for (let j in items) {
                    if (items[j].name == Engine.questTrack.tasks[c].name && Engine.questTrack.tasks[c].type === 'item') {
                        items[j].$.find('.highlight').addClass('track');
                        //if (items[j].loc === "m" || Engine.items.getAllViewsById(j).length === 0) continue;
                        if (items[j].loc === Engine.itemsFetchData.NEW_GROUND_ITEM.loc || Engine.items.getAllViewsById(j).length === 0) continue;
                        Engine.items.getAllViewsById(j)[0].find('.highlight').addClass('track').removeClass('nodisp');
                    }
                }
            }
        }
    };

    this.testMyItems = function() {
        let o = {};
        let it = this.test().items;
        for (let k in it) {
            if (it[k].loc == 'g') o[k] = it[k];
        }
        return o;
    };

    this.update = function(dt) {
        this.updateNoticeTop();

        for (let i in views) {
            items[i].updateDraw(dt);
        }
    };

    this.getViews = function() {
        return views;
    };

    this.getViewById = function(id) {
        return views[id];
    };

    this.getViewByIdAndLoc = function(id, viewNameGroup) {
        let allViewNameGroups = views[id];
        if (isset(allViewNameGroups[viewNameGroup])) {
            return allViewNameGroups[viewNameGroup][0][0];
        }
    };

    this.getAllViewsById = function(id) {
        let a = [];
        let allViewNameGroups = views[id];
        for (let k in allViewNameGroups) {
            let allViewInOneGroup = allViewNameGroups[k];
            for (let i = 0; i < allViewInOneGroup.length; i++) {
                a.push(allViewInOneGroup[i][0]);
            }
        }

        return a;
    };

    this.getAllViewsByViewName = function(viewName) {
        let a = [];
        for (const viewId in views) {
            if (isset(views[viewId][viewName])) {
                console.log(viewId)
                a.push(views[viewId][viewName][0][0]);
            }
        }

        return a;
    };

    this.deleteAllViewsByViewName = function(viewName) {
        for (const viewId in views) {
            if (isset(views[viewId][viewName])) {
                this.deleteViewIcon(viewId, viewName);
                delete views[viewId][viewName];
            }
        }
    }

    this.getAllViewsByIdAndViewName = function(id, viewName) {
        let a = [];
        let allViewNameGroups = views[id];
        for (let k in allViewNameGroups) {
            if (k != viewName) continue;
            let allViewInOneGroup = allViewNameGroups[k];
            for (let i = 0; i < allViewInOneGroup.length; i++) {
                a.push(allViewInOneGroup[i][0]);
            }
        }

        return a;
    };

    this.getAllViewsItemsById = function(id) {
        let $items = $();
        const itemsArray = this.getAllViewsById(id);
        for (let k in itemsArray) {
            $items.push.apply($items, itemsArray[k]);
        }
        return $items;
    };

    this.drawItems = function() {
        for (let i in views) {
            for (let j in views[i]) {
                for (let k = 0; k < views[i][j].length; k++) {
                    let item = items[i];
                    let oneView = views[i][j][k];
                    let iconCtx = oneView[1];
                    let iconCanvas = oneView[2];
                    let noticeCanvas = oneView[3];
                    let noticeCtx = oneView[4];


                    if (!checkDraw(item)) {
                        continue
                    }

                    item.drawItem(iconCtx, iconCanvas, j, drawNotice, noticeCanvas, noticeCtx);
                }
            }
        }
    }

    const checkDraw = (item) => {
        let loc = item.getLoc();

        let e = getEngine();

        switch (loc) {
            case e.itemsFetchData.NEW_CLAN_DEPO_ITEM.loc:
            case e.itemsFetchData.NEW_PRIVATE_DEPO_ITEM.loc:
                if (e.depo) {
                    let activeCard = e.depo.getVisible();
                    let nrCardOfItem = Math.floor(item.getX() / 12);

                    if (activeCard != nrCardOfItem) {
                        return false
                    }
                }
        }

        return true

    };

    this.deleteMessItemsByLoc = function(loc, beforeDelete = true) {
        for (let k in items) {
            if (items[k].loc === loc) self.deleteItem(k, beforeDelete);
        }
    };

    this.deleteMessItemsByLocAndOwnId = function(loc, ownId, beforeDelete = true) {
        for (let k in items) {
            if (items[k].loc === loc && items[k].own === ownId) self.deleteItem(k, beforeDelete);
        }
    };

};