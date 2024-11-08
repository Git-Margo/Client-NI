var HeroesRespParser = require('core/map/HeroesRespParser');
var HeroesResp = require('core/characters/HeroesResp');

module.exports = function() {

    let moduleData = {
        fileName: "HeroRespManager.js"
    };
    let heroesByMap = null;
    let heroesRespParser = null;

    let heroRespList = {};

    const init = () => {
        heroesByMap = {};
        heroesRespParser = new HeroesRespParser();
    };

    const updateData = (data) => {
        heroesRespParser.updateData(data);
    }

    const updateFullData = (data) => {
        for (let id in data) {
            let heroesResp;
            let oneData = data[id];

            if (!checkHeroesResp(id)) {
                heroesResp = createHeroesResp();
                heroesResp.init(oneData);

                addHeroesResp(id, heroesResp);
            } else {
                return; // maybe in future...
                heroesResp = getById(id);
                heroesResp.updateData(oneData);
            }

        }
        Engine.miniMapController.updateWindowMiniMapRespPos(data);
    };

    const checkHeroesResp = (id) => {
        return heroRespList[id] ? true : false;
    };

    const addHeroesResp = (id, heroesResp) => {
        return heroRespList[id] = heroesResp;
    };

    const createHeroesResp = () => {
        return new HeroesResp();
    }

    const getById = (id) => {
        if (!heroRespList[id]) {
            errorReport(moduleData.fileName, "getById", "HeroResp not exist!");
            return null;
        }

        return heroRespList[id];
    };

    const onClear = () => {
        heroRespList = {};
    };

    const test = () => {
        return heroRespList
    }

    this.init = init;
    this.getById = getById;
    this.updateData = updateData;
    this.updateFullData = updateFullData;
    this.test = test;
    this.onClear = onClear;

}