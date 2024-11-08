/**
 * Created by lukasz on 2014-10-21.
 */
var Tpl = require('core/items/Item');

function isset(x) {
    return typeof(x) != 'undefined';
}
module.exports = new(function() {
    var self = this;
    var tpls = {};
    var locationCallbacks = {};
    var views = {};
    var fetchPackageController = {};
    let animTs;
    let noticeTop = 0;
    let drawNotice = true;

    this.init = () => {
        this.createPlaceHolderItem();

        addClbToRedrawTplsAfterFocus();
    };

    const addClbToRedrawTplsAfterFocus = () => {
        getEngine().interface.addCallbackToInteraceFocusList(redrawItemsAfterFocus);
    };

    const redrawItemsAfterFocus = () => {
        for (let loc in tpls) {
            let oneLoc = tpls[loc];
            for (let kk in oneLoc) {
                oneLoc[kk].setShouldDrawIcon(null);
            }
        }
    };

    this.createPlaceHolderItem = () => {
        //this.placeHolderItem = new Image();
        //this.placeHolderItem.src = '../img/def-item.gif'
        //this.placeHolderItem.onload = function () {
        //	//console.log('YEAAAAHH!');
        //}

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

    this.createViewIcon = function(itemId, viewName, tplLoc) {

        let i = self.getTplByIdAndLoc(itemId, tplLoc); // This is not good solution, but... Sometimes tpl have the same tplId, then you should use argument loc too :(

        let $clone = i.$.clone(true);
        let loc = i.loc;

        let oldCanvas = i.$canvasIcon[0];
        let newCanvas = $clone.find('.canvas-icon')[0];
        let context = newCanvas.getContext('2d');

        let $noticeCanvas = $clone.find('.canvas-notice');

        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;

        context.drawImage(oldCanvas, 0, 0);

        let viewData; // = [$clone, context, newCanvas, loc];
        if ($noticeCanvas.length) {
            let noticeCanvas = $noticeCanvas[0];
            let noticeContext = noticeCanvas.getContext("2d");
            viewData = [$clone, context, newCanvas, loc, noticeCanvas, noticeContext];
        } else {
            viewData = [$clone, context, newCanvas, loc];
        }

        if (!isset(views[itemId])) views[itemId] = {};
        if (!isset(views[itemId][viewName])) views[itemId][viewName] = [];
        views[itemId][viewName].push(viewData);

        this.checkViewExist(viewName);

        return viewData
    };

    this.checkViewExist = (viewName) => {
        if (!Engine.itemsViewData[viewName]) errorReport('TplsManager.js', 'createViewIcon', 'Unregistered viewName: ' + viewName);
    }

    this.changePlaceHolderIconIntoNormalIcon = (itemId, loc) => {

        let allViewsInViewsName = views[itemId];

        if (!allViewsInViewsName) return;
        if (!tpls[loc] || !tpls[loc][itemId]) return;

        let i = tpls[loc][itemId];

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

    this.deleteViewIconIfExist = function(idItem, viewName, loc) {
        if (views[idItem] && views[idItem][viewName]) {

            this.removeAllViewInArrayByIdItemAndViewNameAndLoc(idItem, viewName, loc);
            this.removeIdItemViewsIfEmpty(idItem);
        }
    };

    this.deleteViewIcon = function(idItem, viewName, index) {
        // if (!views[idItem]) 		  return console.warn('view of item: ' + idItem + ' not exist!');
        // if (!views[idItem][viewName]) return console.warn('viewName of itemId: '+ idItem + ' not exist:' + viewName);

        let l = views[idItem][viewName].length;

        if (isset(index)) {
            if (!isset(views[idItem][viewName][index])) return console.warn('index: ' + index + ' of itemId: ' + idItem + ' with viewName : ' + viewName + ' not exist');
            views[idItem][viewName][index][0].remove();
            views[idItem][viewName].splice(index, 1);

            if (!views[idItem][viewName].length) delete views[idItem][viewName];

        } else {
            for (let i = 0; i < l; i++) {
                views[idItem][viewName][i][0].remove();
            }
            delete views[idItem][viewName];
        }

        //if (!views[idItem][viewName].length) delete views[idItem][viewName];
    };

    this.removeAllViewInArrayByIdItemAndViewNameAndLoc = function(idItem, viewName, loc) {
        let allViewOfOneViewNameData = views[idItem][viewName];

        for (let i = 0; i < allViewOfOneViewNameData.length; i++) {
            let itemLoc = allViewOfOneViewNameData[i][3];
            if (itemLoc == loc) {
                self.deleteViewIcon(idItem, viewName, i);
                i--;
            }
        }
    };

    this.deleteViewWithAllIcon = function(idItem, loc) {
        if (!views[idItem]) return;
        for (let viewName in views[idItem]) {
            // let allViewOfOneViewNameData = views[idItem][viewName];
            //
            // for (let i = 0; i < allViewOfOneViewNameData.length; i++) {
            // 	let itemLoc = allViewOfOneViewNameData[i][3];
            // 	if (itemLoc == loc) {
            // 		self.deleteViewIcon(idItem, viewName, i);
            // 		i--;
            // 	}
            // }
            this.removeAllViewInArrayByIdItemAndViewNameAndLoc(idItem, viewName, loc)
        }
        // if (!Object.keys(views[idItem]).length) delete views[idItem];
        this.removeIdItemViewsIfEmpty(idItem);
    };

    this.removeIdItemViewsIfEmpty = function(idItem) {
        if (!Object.keys(views[idItem]).length) delete views[idItem];
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

    this.updateDATA = function(d) {
        let idFetchPackage = self.addAndGetIdToFetchPackageController(d);
        for (var i in d) {
            if (this.checkExist(i, d[i])) this.deleteTpl(d[i].loc, i);
            this.newTpl(i, d[i], idFetchPackage, true);
        }
        this.checkClearFetchPackageController(idFetchPackage);
    };

    this.checkExist = function(i, obj) {
        var loc = obj.loc;
        var oneLoc = tpls[loc];
        if (isset(oneLoc) && isset(oneLoc[i])) return oneLoc[i];

        return false;
    };

    this.newTpl = function(i, d, idFetchPackage, getNow) {
        let tpl = new Tpl(i, d, 'tpl');
        let loc = d.loc;

        if (!isset(tpls[loc])) tpls[loc] = {};
        tpls[loc][i] = tpl;

        tpl.setIdFetchPackage(idFetchPackage);
        tpl.update(d);
        //this.newTplInLocation(loc, tpl);
        if (getNow) tpl.firstGetNow();
    };

    this.deleteTpl = function(loc, i) {
        if (isset(tpls[loc][i])) {
            tpls[loc][i].beforeDelete();
            Engine.stickyTips.deleteIfExist(i);
            self.deleteViewWithAllIcon(i, loc);
            delete(tpls[loc][i]);
        }
    };

    this.newTplInLocation = function(loc, tpl, idFetchPackage) {
        let finishFetch = self.checkFetchFinish(idFetchPackage, tpl.loc);
        if (isset(locationCallbacks[loc])) {
            for (var i in locationCallbacks[loc]) {
                self.delayLocationCallbacks(tpl, loc, i, finishFetch);
            }
        }
    };

    this.delayLocationCallbacks = function(tpl, loc, i, finishFetch) {
        var locCallback = locationCallbacks[loc][i];
        locCallback(tpl, finishFetch);
    };

    this.fetchLocationTpls = function(loc) {
        var ret = [];
        if (isset(tpls[loc])) {
            var objcs = tpls[loc];
            for (var i in objcs) {
                let loc = objcs[i].loc;
                if (tpls[loc] && tpls[loc][i]) ret.push(objcs[i]);
            }
        }

        return ret;
    };

    this.addCallback = function(loc, name, c) {
        if (!isset(locationCallbacks[loc])) locationCallbacks[loc] = {};

        if (locationCallbacks[loc][name]) {
            console.error('[TplsManager.js, addCallback] Fetch callback already use!', name);
            return;
        }
        locationCallbacks[loc][name] = c;

        // locationCallbacks[loc].push(c);
    };

    this.removeCallback = function(data) {
        // console.log('removeCallback TPLS', data)
        let loc = data.loc.split(',');
        let keyName = data.k;

        if (!isset(locationCallbacks[loc])) {
            console.error('[TplsManager.js, removeCallback] Fetch callback not exist!', keyName);
            return;
        }

        delete locationCallbacks[loc][keyName];
        if (!Object.keys(locationCallbacks[loc]).length) delete locationCallbacks[loc];

        // if (!isset(locationCallbacks[loc])) return;
        // var idx = locationCallbacks[loc].indexOf(c);
        // if (idx >= 0) {
        // 	locationCallbacks[loc].splice(idx, 1);
        // }
    };

    this.fetch = function(data, f) {
        // console.log('fetch TPLS', data)
        let locations = data.loc.split(',');
        let keyName = data.k;
        if (typeof(f) != 'function') return;

        for (var i = 0; i < locations.length; i++) {
            self.addCallback(locations[i], keyName, f);
            var loc_tpls = self.fetchLocationTpls(locations[i]);
            let lastIndex = loc_tpls.length - 1;
            for (var k in loc_tpls) {
                let finish = lastIndex == k;
                f(loc_tpls[k], finish);
            }
        }
    };

    this.parseTplStat = function(s) {
        s = s.split(';');
        var obj = {};
        for (var i = 0; i < s.length; i++) {
            var pair = s[i].split('=');
            obj[pair[0]] = isset(pair[1]) ? pair[1] : null;
        }
        return obj;
    };

    this.changeItemAmount = function(item, $item, serverAmount, recalcPrice = false) {
        var newVal;
        var $cloneAmount = $item.find('.amount');

        if ($cloneAmount.length > 0) {
            newVal = parseInt($cloneAmount.html()) * serverAmount;
            $cloneAmount.html(roundShorten(newVal));
        } else {
            if (serverAmount == 1) return;
            var $newAmount = $('<div>').addClass('amount');
            newVal = serverAmount;
            $newAmount.html(roundShorten(newVal));
            $item.append($newAmount);
        }
        self.changeAmountInTip(item, $item, newVal, {
            recalcPrice,
            serverAmount
        });
    };

    this.changeAmountInTip = function(item, $item, newVal, {
        recalcPrice = false,
        serverAmount
    }) {
        newVal = formNumberToNumbersGroup(newVal);
        // var tip = $item.getTipData();
        const tip = item.getTipContent();
        var $tip = $('<div>').append(tip);

        $tip.find('.amount').remove();
        $tip.find('.item').append($('<div>').html(newVal).addClass('amount'));

        if (recalcPrice) {
            const newPrice = item.pr * serverAmount;
            $tip.find('.value-item .val').text(round(newPrice, (newPrice < 10000 ? 10 : 2)));
        }

        var $amountText = $tip.find('.amount-text');

        if ($amountText.length > 0) $amountText.html(newVal);
        else {
            var cursedFlag = isset(item._cachedStats.cursed);
            //var valAndTag = '<span class="amount-text">' + newVal + '</span>';

            var strTab = [
                _t('cursed_amount %val%', {
                    '%val%': ''
                }),
                _t('amount %val% %split%', {
                    '%val%': '',
                    '%split%': ''
                })
            ];
            var amountStr = strTab[cursedFlag ? 0 : 1];
            var $section = $tip.siblings('.s-4');
            var $wrapper = $('<span>').html(amountStr);
            var dmgWrapper = $('<span>').addClass('damage');
            $amountText = $('<span>').html(newVal).addClass('amount-text');
            dmgWrapper.append($amountText);
            $wrapper.append(dmgWrapper);


            if ($section.length > 0) $section.append($wrapper);
            else {
                $section = $('<div>').addClass('item-tip-section s-4');
                $section.append($wrapper);
                const allSections = $tip.children();
                allSections.push($section[0]);
                allSections.sort((a, b) => {
                    const nA = $(a).attr('class').toLowerCase();
                    const nB = $(b).attr('class').toLowerCase();
                    return (nA < nB) ? -1 : (nA > nB) ? 1 : 0;
                });
                $tip = $('<div>').html(allSections);
            }
        }

        item.setTip($item, $tip[0].innerHTML, {
            forceNewId: true
        });
    };


    this.onClear = function() {
        //TODO: remove ground items
    };

    this.deleteMessItemsByLoc = function(loc) {
        if (isset(tpls[loc])) {
            var obj = tpls[loc];
            for (var k in obj) {
                self.deleteTpl(loc, k);
                //delete obj[k]
            }
        }
    };

    this.getTplByIdAndLoc = function(id, locTpl) { // locTpl - when id tpl located in more loc

        if (locTpl) {
            let allInOneLocTpls = tpls[locTpl];
            for (let tplId in allInOneLocTpls) {
                if (tplId == id) return tpls[locTpl][tplId];
            }
            return null
        }

        // for (let loc in tpls) {
        // 	let allInOneLocTpls = tpls[loc];
        // 	for (let tplId in allInOneLocTpls) {
        // 		if (tplId == id) return tpls[loc][tplId];
        // 	}
        // }
        //
        // return null
    };

    this.getAllTpls = function(loc) {
        return tpls.hasOwnProperty(loc) ? tpls[loc] : {};
    }

    this.test = function() {
        return {
            tpls: tpls,
            callbacks: locationCallbacks
        };
    }

    this.update = function(dt) {
        let updated = {};
        for (let i in views) {
            for (let j in views[i]) {
                let loc = views[i][j][0][3];

                if (!updated[i]) updated[i] = [];
                if (updated[i].indexOf(loc) < 0) {
                    tpls[loc][i].updateDraw(dt);
                    updated[i].push(loc);
                }
            }
        }
    };

    this.drawItems = function() {
        for (let i in views) {
            for (let j in views[i]) {
                for (let k = 0; k < views[i][j].length; k++) {
                    let iconCtx = views[i][j][k][1];
                    let iconCanvas = views[i][j][k][2];
                    let loc = views[i][j][k][3];
                    let noticeCanvas = views[i][j][k][4];
                    let noticeCtx = views[i][j][k][5];

                    tpls[loc][i].drawItem(iconCtx, iconCanvas, j, drawNotice, noticeCanvas, noticeCtx);
                }
            }
        }
    }

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

    this.updateTrackHighlights = () => {
        for (let loc in tpls) {
            for (let id in tpls[loc]) {
                let oneTplItem = tpls[loc][id];
                oneTplItem.$.find('.highlight').removeClass('track');
                if (this.getAllViewsById(id).length === 0) continue;
                this.getAllViewsById(id)[0].find('.highlight').removeClass('track');
            }
        }

        return
        if (Engine.questTrack && Engine.questTrack.activeTrack) {
            for (let c in Engine.questTrack.tasks) {


                for (let _loc in tpls) {
                    for (let id in tpls[_loc]) {
                        let oneTplItem = tpls[_loc][id];
                        if (oneTplItem.name == Engine.questTrack.tasks[c].name && Engine.questTrack.tasks[c].type === 'item') {
                            oneTplItem.$.find('.highlight').addClass('track');
                            // if (oneTplItem.loc === "m" || this.getAllViewsById(id).length === 0) continue;
                            this.getAllViewsById(id)[0].find('.highlight').addClass('track').removeClass('nodisp');
                        }
                    }
                }


            }
        }
    };

    this.getViews = function() {
        return views;
    };

    this.getViewById = function(id) {
        return views[id];
    };
})();