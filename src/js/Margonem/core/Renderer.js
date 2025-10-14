/**
 * Created by lukasz on 2014-11-18.
 */

module.exports = function() {
    let list = [];
    let highestOrderWithoutSortList = [];
    let weatherOrderWithoutSortList = [];
    let mapBorderOrderWithoutSortList = [];
    let activeColliders = [];
    let fullNightDataDrawer = [];

    let nightObject = null;
    let questObject = null;
    let warShadowObject = null;

    const HIGHEST_ORDER_WITHOUT_SORT = 20006;
    const WAR_SHADOW_ORDER_WITHOUT_SORT = 20005;
    const QUEST_MAP_ORDER_WITHOUT_SORT = 20004;
    const MAP_BORDER_ORDER_WITHOUT_SORT = 20003;
    const NIGHT_ORDER_WITHOUT_SORT = 20002;
    const FULL_BLACK_NIGHT_DATA_DRAWER_WITHOUT_SORT = 20001;
    const WEATHER_ORDER_WITHOUT_SORT = 20000;
    const WITHOUT_SORT = 19999;

    let screeSize = {
        x: null,
        y: null,
        maxX: null,
        maxY: null
    }

    /**
     * Add drawable object to draw queue
     * @param o - drawable object, must have .draw() method and .getOrder()
     */
    this.add = function() {
        for (var i = 0; i < arguments.length; i++) {

            let e = arguments[i];

            //if (e.alwaysDraw || screeSize.x < e.rx && e.rx < screeSize.maxX && screeSize.y < e.ry && e.ry < screeSize.maxY) {
            if (e.getAlwaysDraw && e.getAlwaysDraw() || screeSize.x < e.rx && e.rx < screeSize.maxX && screeSize.y < e.ry && e.ry < screeSize.maxY) {

                let order = e.getOrder();

                if (order > WITHOUT_SORT) {

                    if (order == HIGHEST_ORDER_WITHOUT_SORT) {
                        highestOrderWithoutSortList.push(e);
                        continue;
                    }

                    if (order == WAR_SHADOW_ORDER_WITHOUT_SORT) {
                        highestOrderWithoutSortList.push(e);
                        continue;
                    }

                    if (order == WEATHER_ORDER_WITHOUT_SORT) {
                        weatherOrderWithoutSortList.push(e);
                        continue;
                    }

                    if (order == MAP_BORDER_ORDER_WITHOUT_SORT) {
                        mapBorderOrderWithoutSortList.push(e);
                        continue;
                    }

                    if (order == QUEST_MAP_ORDER_WITHOUT_SORT) {
                        questObject = e;
                        continue;
                    }

                    if (order == NIGHT_ORDER_WITHOUT_SORT) {
                        nightObject = e;
                        continue;
                    }

                    if (order == FULL_BLACK_NIGHT_DATA_DRAWER_WITHOUT_SORT) {
                        fullNightDataDrawer.push(e);
                        continue;
                    }

                    if (order == warShadowObject) {
                        warShadowObject = e;
                        continue;
                    }
                }



                list.push(e);

                if (e.collider && activeColliders.indexOf(e) < 0) {
                    activeColliders.push(e)
                }

            }

        }
    };

    this.updateScreenSize = (size, defaultSize) => {
        if (defaultSize) this.setDefaultScreenSize();
        else this.setScreenSize(size.x, size.y, size.maxX, size.maxY);
    }

    this.setDefaultScreenSize = () => {
        this.setScreenSize(0, 0, 100 * 32, 100 * 32);
    }

    this.setScreenSize = (x, y, maxX, maxY) => {
        screeSize = {
            x: x,
            y: y,
            maxX: maxX,
            maxY: maxY
        }
    }

    /**
     * Updates objects order and draw them on canvas context
     * @param ctx - canvas context
     */
    this.draw = function(ctx) {
        list.sort(function(a, b) {
            var diff = a.getOrder() - b.getOrder();
            if (diff == 0 && a.d && b.d) return a.d.id > b.d.id ? diff + 0.2 : diff - 0.2;
            return diff;
        });

        for (var i = 0; i < list.length; i++) {
            list[i].draw(ctx);
        }

        for (let j = 0; j < weatherOrderWithoutSortList.length; j++) {
            weatherOrderWithoutSortList[j].draw(ctx);
        }

        for (let j = 0; j < mapBorderOrderWithoutSortList.length; j++) {
            mapBorderOrderWithoutSortList[j].draw(ctx);
        }

        for (let j = 0; j < fullNightDataDrawer.length; j++) {
            fullNightDataDrawer[j].draw(ctx);
        }

        if (nightObject) {
            nightObject.draw(ctx);
        }

        if (questObject) {
            questObject.draw(ctx);
        }

        if (warShadowObject) {
            warShadowObject.draw(ctx);
        }

        for (let k = 0; k < highestOrderWithoutSortList.length; k++) {
            highestOrderWithoutSortList[k].draw(ctx);
        }

        this.updateColliders();

        //list 						= [];
        //weatherOrderWithoutSortList = [];
        //highestOrderWithoutSortList = [];

        clearAllObjectToDraw()
    };

    this.updateColliders = function() {
        var toRemove = [];
        for (var i = activeColliders.length - 1; i >= 0; i--) {
            if (list.indexOf(activeColliders[i]) < 0) {
                toRemove.push(activeColliders[i]);
            }
        }

        for (var i = 0; i < toRemove.length; i++) {
            activeColliders.splice(activeColliders.indexOf(toRemove[i]), 1);
        }

        //delete toRemove;

        activeColliders.sort(function(a, b) {
            return b.getOrder() - a.getOrder();
        });
    };

    this.getCollisionsAt = function(x, y) {
        var ret = [];
        for (var i = 0; i < activeColliders.length; i++) {
            if (!activeColliders[i].collider) continue;

            //exception for map collider (always active)
            if (!activeColliders[i].collider.box) {
                ret.push(activeColliders[i]);
                continue;
            }

            var b = activeColliders[i].collider.box;
            if (x > b[0] && y > b[1] && x < b[2] && y < b[3]) ret.push(activeColliders[i]);
        }

        return ret;
    };

    this.getHighestOrderWithoutSort = () => {
        return HIGHEST_ORDER_WITHOUT_SORT;
    };

    this.getWeatherOrderWithoutSort = () => {
        return WEATHER_ORDER_WITHOUT_SORT;
    };

    this.getWeatherOrderWithoutSort = () => {
        return WEATHER_ORDER_WITHOUT_SORT;
    };

    this.getQuestMapOrderWithoutSort = () => {
        return QUEST_MAP_ORDER_WITHOUT_SORT;
    };

    this.getMapBorderOrderWithoutSort = () => {
        return MAP_BORDER_ORDER_WITHOUT_SORT;
    };

    this.getWarShadowOrderWithoutSort = () => {
        return WAR_SHADOW_ORDER_WITHOUT_SORT;
    };

    this.getFullBlackNightDataDrawerWithoutSort = () => {
        return FULL_BLACK_NIGHT_DATA_DRAWER_WITHOUT_SORT
    }

    this.getNightOrderWithoutSort = () => {
        return NIGHT_ORDER_WITHOUT_SORT;
    };

    //const isWithoutSortOrder = (obj) => {
    //	return obj.getOrder() == WITHOUT_SORT_OBJECT;
    //}

    const clearAllObjectToDraw = () => {
        list = [];
        weatherOrderWithoutSortList = [];
        highestOrderWithoutSortList = [];
        mapBorderOrderWithoutSortList = [];
        fullNightDataDrawer = [];

        nightObject = null;
        questObject = null;
        warShadowObject = null;
    }

    this.onClear = function() {
        activeColliders = [];
        //list 							= [];
        //weatherOrderWithoutSortList 	= [];
        //highestOrderWithoutSortList 	= [];
        clearAllObjectToDraw();
    }
};