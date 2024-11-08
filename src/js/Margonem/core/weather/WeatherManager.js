let FallObj = require('core/weather/FallObj');
let WeatherData = require('core/weather/WeatherData');
let RajRandomElements = require('core/raj/RajRandomElements');
let RajActionData = require('core/raj/rajAction/RajActionData');
let RajActionManager = require('core/raj/rajAction/RajActionManager');

module.exports = new(function() {

    let moduleData = {
        fileName: "WeatherManager.js"
    };
    let list = [];
    let actualWeather = {};
    let self = this;
    this.mapSize = null;
    let resizeTimeout = null;
    let rajActionManager = null;

    //let amountDependOfSizeScreen = ['Bubble', 'Rain', 'Snow'];
    let amountDependOfSizeScreen = [WeatherData.weather.BUBBLE, WeatherData.weather.RAIN, WeatherData.weather.SNOW];


    //orientationY
    //yDir  (0 - only down, 1 - only up) && orientationY - true
    //xDir  0 - only left, 1 - only right

    var config = {
        'meduza': {
            'orientationY': true,
            'yDir': 0
        },
        'bat': {
            'speedY': 1.5
        },
        'batpumpupdown': {
            'orientationY': true,
            'speedX': 1.5
        },
        'batskullupdown': {
            'orientationY': true
        },
        'batupdown': {
            'orientationY': true
        }
    };

    var configKindDefault = {
        fish: {
            minSpeed: [],
            maxSpeed: []
        },
        bat: {
            minSpeed: [],
            maxSpeed: []
        }
    };


    const init = () => {
        initRajActionsManager();
    }

    const initRajActionsManager = () => {

        const WEATHER = WeatherData.weather;

        rajActionManager = new RajActionManager();

        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createWeather,
                removeFunc: removeWeather,
                createRequire: {
                    name: {
                        specificVal: [
                            WEATHER.SNOW,
                            WEATHER.RAIN,
                            WEATHER.BUBBLE,
                            WEATHER.FISH,
                            WEATHER.LIGHT,
                            WEATHER.BAT,
                            WEATHER.HALLOWEEN_BAT,
                            WEATHER.LATERN
                        ]
                    }
                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_NAME
        );
    };

    this.getActualWeather = () => {
        return actualWeather;
    }

    this.setMapSize = function() {
        var s = Engine.map.size;
        if (!s) return;
        this.mapSize = Engine.map.size;
    };

    this.onClear = () => {
        for (var i in list) {
            delete list[i];
        }
        list = [];
        clearActualWeather();
        //this.clearFilter();
    };

    this.update = function(dt) {
        for (var i in list) {
            list[i].update(dt);
        }
    };

    const createWeather = (data) => {

        let kind = data.name;

        this.setMapSize();
        if (!this.mapSize) return;
        this.createObjects(kind, data);
    };

    const removeWeather = (data) => {

        let type = data.name;

        for (let i = 0; i < list.length; i++) {
            if (list[i].getType() == type) {
                list.splice(i, 1);
                i--
            }
        }
        removeActualWeather(type);
    }

    this.setActualWeather = (kind, amount) => {
        actualWeather[kind] = amount;
    };

    const removeActualWeather = (kind) => {
        delete actualWeather[kind];
    };

    const clearActualWeather = () => {
        actualWeather = {};
    };

    this.createObjects = (kind, data) => {
        let groups = this.createGroups(kind);
        let amount = this.getAmountOfObjects(kind);

        this.setActualWeather(kind, amount);

        if (groups) this.createGroupFallObject(groups, kind, amount);
        else this.createNormalFallObjects(amount, kind, data);
    };

    this.createGroupFallObject = (groups, kind, amount) => {
        var groupIndex = 0;

        for (let i = 0; i < amount; i++) {

            let o = groups[groupIndex];
            //let fallObj = new FallObj(self, 'Fish', o);
            let fallObj = new FallObj(self, WeatherData.weather.FISH, kind, o);

            fallObj.createObject();
            list.push(fallObj);

            if (groupIndex == groups.length - 1) {
                groupIndex = 0;
                groups = [];
                self['create' + kind + 'Set'](groups);
            } else groupIndex++;
        }
    };

    this.createNormalFallObjects = (amount, kind, _data) => {
        for (let i = 0; i < amount; i++) {
            let data = _data ? _data : {};
            let fallObj = new FallObj(self, kind, kind, data);
            fallObj.createObject();
            list.push(fallObj);
        }
    };

    this.removeNormalFallObjects = (amountToRemove, type) => {

        while (amountToRemove > 0) {
            let length = list.length - 1;
            let index = Math.round(length * Math.random());
            let _type = list[index].getType();

            if (type == _type) {
                list.splice(index, 1);
                amountToRemove--;
            }
        }
    };

    this.createGroups = (kind) => {
        let groups = [];
        switch (kind) {
            case WeatherData.weather.BUBBLE:
            case WeatherData.weather.RAIN:
            case WeatherData.weather.SNOW:
            case WeatherData.weather.SNOWSTORM:
                return null;
            case WeatherData.weather.FISH:
                self.createFishSet(groups);
                break;
            case WeatherData.weather.HALLOWEEN_BAT:
                self.createHalloweenBatSet(groups);
                break;
            case WeatherData.weather.BAT:
                self.createBatSet(groups);
                break;
            case WeatherData.weather.LIGHT:
                self.createLightSet(groups);
                break;
            case WeatherData.weather.LATERN:
                self.createLaternSet(groups);
                break;
            default:
                errorReport(moduleData.fileName, 'createGroups', `Incorrect kind of weather: "${kind}" not exist! Possible weather`, WeatherData.weather);
                return null
        }

        if (!groups.length) {
            console.error(`Object weather group is empty ${kind}`);
            return null;
        }

        return groups
    };

    this.createLaternSet = function(groups) {
        self.createMapPos(1, 1, 1, groups, 4, 'lampion');
    };

    this.createLightSet = function(groups) {
        self.createMapPos(1, 1, 1, groups, 0, 'light');
        self.createMapPos(1, 1, 1, groups, 0, 'lightconstant');
    };

    this.createHalloweenBatSet = function(groups) {
        self.createMapPos(1, 1, 1, groups, 0, 'batpump');
        self.createMapPos(1, 1, 1, groups, 0, 'batskull');
        self.createMapPos(1, 1, 1, groups, 0, 'bat');
        self.createMapPos(1, 1, 1, groups, 0, 'batpumpupdown');
        self.createMapPos(1, 1, 1, groups, 0, 'batskullupdown');
        self.createMapPos(1, 1, 1, groups, 0, 'batupdown');
        self.createMapPos(1, 1, 1, groups, 0, 'batpumpupdown');
        self.createMapPos(1, 1, 1, groups, 0, 'batskullupdown');
        self.createMapPos(1, 1, 1, groups, 0, 'batupdown');
    };

    this.createBatSet = function(groups) {
        //self.createMapPos(1, 1, 1, groups, 0, 'batpump');
        //self.createMapPos(1, 1, 1, groups, 0, 'batskull');
        self.createMapPos(1, 1, 1, groups, 0, 'bat');
        //self.createMapPos(1, 1, 1, groups, 0, 'batpumpupdown');
        //self.createMapPos(1, 1, 1, groups, 0, 'batskullupdown');
        self.createMapPos(1, 1, 1, groups, 0, 'batupdown');
        //self.createMapPos(1, 1, 1, groups, 0, 'batpumpupdown');
        //self.createMapPos(1, 1, 1, groups, 0, 'batskullupdown');
        self.createMapPos(1, 1, 1, groups, 0, 'batupdown');
    };

    this.createFishSet = function(groups) {
        self.createMapPos(5, 3, 3, groups, 2, 'rybka');
        self.createMapPos(3, 3, 3, groups, 2, 'kalamarnica');
        self.createMapPos(3, 1, 3, groups, 1, 'rekin');
        self.createMapPos(3, 2, 2, groups, 0, 'krewetka');
        self.createMapPos(3, 3, 3, groups, 2, 'meduza');
        self.createMapPos(2, 1, 3, groups, 1, 'wegorz');
        self.createMapPos(1, 3, 3, groups, 1, 'wengorz');
    };

    this.createMapPos = function(amontInGroup, col, rec, tab, maxNumberGif, name) {
        if (amontInGroup > col * rec) {
            warningReport(moduleData.fileName, "createMapPos", "impossible", name)
            return
        }
        var pos = [];

        for (var i = 0; i < amontInGroup; i++) {
            var num;
            do {
                num = Math.round(Math.random() * col * rec);
            } while (pos.indexOf(num) > -1);
            pos.push(num);
        }

        var orientationY = self.checkConfig(name, 'orientationY', false);

        var speedMinFactor = orientationY ? [0.01, 1] : [1, 0.01];
        var speedMaxFactor = orientationY ? [0.5, 3] : [3, 0.5];

        var xDir = self.checkConfig(name, 'xDir', Math.round(Math.random()));
        var yDir = self.checkConfig(name, 'yDir', Math.round(Math.random()));

        var posX = Math.max(5, Math.random() * self.mapSize.x - 5);
        var posY = Math.max(0.1, Math.random() * self.mapSize.y);


        var speedX = Math.max(speedMinFactor[0], Math.random() * speedMaxFactor[0]);
        var speedY = Math.max(speedMinFactor[1], Math.random() * speedMaxFactor[1]);

        var dirIcon;
        if (orientationY) dirIcon = yDir == 0 ? 'U' : 'D';
        else dirIcon = xDir == 0 ? 'L' : 'R';


        for (var i = 0; i < pos.length; i++) {
            var p = pos[i];
            var v = Math.floor(p / col);
            var y = posX + v;
            var x = posY + p - v;
            var iconNr = Math.round(Math.random() * maxNumberGif);
            //console.log(speedX, speedY, name);

            tab.push({
                'startPos': self.checkConfig(name, 'startPos', {
                    'x': x,
                    'y': y
                }),
                'speedX': self.checkConfig(name, 'speedX', speedX * (xDir ? 1 : -1)),
                'speedY': self.checkConfig(name, 'speedY', speedY * (yDir ? 1 : -1)),
                'icon': self.checkConfig(name, 'icon', dirIcon + name + iconNr + '.gif')
            });
        }
    };

    this.checkConfig = function(name, stat, val) {
        if (isset(config[name])) {
            if (isset(config[name][stat])) return config[name][stat];
            else return val;
        } else return val;
    };

    //this.updateDataFilterFromRayController = (v) => {
    //
    //    RajRandomElements.manageRandomElementInObjectIfExist(v);
    //
    //    if (!this.checkFilterDataCorrect(moduleData.fileName, v)) return;
    //
    //    if (!Engine.rajCase.checkFullFillCase(v.case)) return;
    //
    //    if (isset(v.remove)) {
    //        warningReport(moduleData.fileName, "updateDataFilterFromRayController", `attr remove is deprecated. Use "clear":true`, v);
    //        this.clearFilter();
    //        return
    //    }
    //
    //    if (isset(v.clear)) {  // todo: in future attach RajActionManager!!
    //        this.clearFilter();
    //        return
    //    }
    //
    //    // if (!this.checkFilterExist(v)) {
    //    //     errorReport('WeatherManager', "updateDataFilterFromRayController", 'Filter not exist!', v);
    //    //     return;
    //    // }
    //
    //    Engine.weather.setFilter(v);
    //
    //}

    this.updateDataWeatherFromRayController = (v) => {
        //const FUNC = "updateDataWeatherFromRayController";

        //if (!v instanceof Object) {
        //    errorReport(moduleData.fileName, FUNC, 'Incorrect WeatherData! WeatherData have to object! E.G. {"weather":{"list":[{"action":"CREATE","name":"Rain"}]}} or {"weather":{"list":[{"action":"REMOVE","name":"Rain"}]}}')
        //    return;
        //}
        //
        //if (!isset(v.list)) {
        //    errorReport(moduleData.fileName, FUNC, 'Incorrect WeatherData! WeatherData have to object! E.G. {"weather":{"list":[{"action":"CREATE","name":"Rain"}]}} or {"weather":{"list":[{"action":"REMOVE","name":"Rain"}]}}')
        //    return;
        //}

        if (!rajActionManager.checkCorrectMainData(v)) return;

        for (let k in v.list) {

            //RajRandomElements.manageRandomElementInObjectIfExist(v.list[k]);        // this is exception because object in this place may not have attr name

            let data = v.list[k];

            //if (!self.checkWeatherDataCorrect(data)) continue;
            //if (!getEngine().rajCase.checkFullFillCase(data.case)) continue;

            rajActionManager.updateData(data);
        }

    }

    this.getData = () => {

    }

    //this.checkWeatherDataCorrect = (data) => {
    //    const FUNC = "checkWeatherDataCorrect";
    //
    //    if (!isset(data.action)) {
    //        errorReport(moduleData.fileName, FUNC, "data.action is obligatory!", data);
    //        return false
    //    }
    //
    //    let ACTIONS = {
    //        [RajActionData.CREATE] : true,
    //        [RajActionData.REMOVE] : true
    //    }
    //    if (!ACTIONS[data.action]) {
    //        errorReport(moduleData.fileName, FUNC, "Undefined weather action!", data);
    //        return false
    //    }
    //
    //    if (!isset(data.name)) {
    //        errorReport(moduleData.fileName, FUNC, "data.name is obligatory!", data)
    //        return false
    //    }
    //
    //    if (!this.checkWeatherExist(data.name)) {
    //        errorReport(moduleData.fileName, FUNC, "Undefined weather name!", data);
    //        return false
    //    }
    //
    //    return true;
    //}

    //this.checkWeatherDataArrayIsCorrect = (v) => {
    //    for (let k in v) {
    //        let w = v[k];
    //        let exist = this.checkWeatherExist(w);
    //        if (!exist) {
    //            errorReport(moduleData.fileName, "checkWeatherDataArrayIsCorrect", `Weather "${w}" not exist! Possible weather:`, WeatherData.weather);
    //            return false
    //        }
    //    }
    //    return true;
    //}

    //this.checkWeatherExist = (v) => {
    //    for (let wKey in WeatherData.weather) {
    //        if (v == WeatherData.weather[wKey]) return true
    //    }
    //    return false
    //}

    // this.checkFilterExist = (v) => {
    //     for (let wKey in WeatherData.filter) {
    //         if (v == WeatherData.filter[wKey]) return true
    //     }
    //     return false
    // };

    this.getDrawableList = function() {
        //if (!Engine.settings || !Engine.settings.checkTurnOnWeatherAndEventEffects()) {
        if (!isSettingsOptionsWeatherAndEventEffectsOn()) {
            return [];
        }


        return list;
    };

    this.onResize = (newWindowSize, oldWindowSize, increase) => {

        if (resizeTimeout) clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
            if (increase) this.increaseSize();
            if (increase == false) this.decreaseSize();

            resizeTimeout = null;
        }, 200)

    };

    this.getAmountOfObjects = (kind) => {
        var sizeScreen = (Engine.map.getMaxX() - Engine.map.getMinX()) * (Engine.map.getMaxY() - Engine.map.getMinY());
        let sizeMap = this.mapSize.x * this.mapSize.y;
        if (!sizeScreen) sizeScreen = 260; // is not possible get size of map
        switch (kind) {
            case WeatherData.weather.BUBBLE:
                return Math.floor(sizeScreen / 20);
            case WeatherData.weather.RAIN:
            case WeatherData.weather.SNOW:
                return Math.floor(sizeScreen / 10);
            case WeatherData.weather.FISH:
                return Math.floor(sizeMap / 100);
            case WeatherData.weather.BAT:
            case WeatherData.weather.HALLOWEEN_BAT:
            case WeatherData.weather.LIGHT:
            case WeatherData.weather.LATERN:
                return Math.floor(sizeMap / 180);

            default:
                return errorReport(moduleData.fileName, 'getAmountOfObjects', `Incorrect kind of weather: "${kind}" not exist! Possible weather`, WeatherData.weather);
        }
    };

    this.increaseSize = () => {
        for (let kind in actualWeather) {

            if (!amountDependOfSizeScreen.includes(kind)) continue;

            let currentAmount = actualWeather[kind];
            let amount = this.getAmountOfObjects(kind);
            let diff = amount - currentAmount;
            if (diff > 0) {
                let data = this.getDataOfRandomFallObjectByKind(kind);
                //console.log(data);
                this.createNormalFallObjects(diff, kind, data);
                this.setActualWeather(kind, amount);
            }

        }
    };

    this.getDataOfRandomFallObjectByKind = (kind) => {

        if (!list.length) return {
            action: RajActionData.CREATE,
            kind: kind
        };

        let maxFind = 10;
        let counter = 0;
        let maxIndex = list.length - 1;

        while (maxFind != counter) {
            let index = Math.round(maxIndex * Math.random());
            let obj = list[index];

            if (obj.getKind() == kind) return copyStructure(obj.getData());

            counter++;
        }

        return {
            action: RajActionData.CREATE,
            kind: kind
        };
    }

    this.decreaseSize = () => {
        for (let kind in actualWeather) {

            if (!amountDependOfSizeScreen.includes(kind)) continue;

            let currentAmount = actualWeather[kind];
            let amount = this.getAmountOfObjects(kind);
            let diff = currentAmount - amount;
            if (diff > 0) {
                //console.log(`DECREASE currentAmount:${currentAmount}, diff:${diff}`);
                this.removeNormalFallObjects(diff, kind);
                this.setActualWeather(kind, amount);
            }

        }
    };

    this.init = init;

})();