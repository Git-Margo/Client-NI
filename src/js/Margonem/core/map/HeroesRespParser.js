const {
    heroRespKind
} = require('./HeroesRespData');

module.exports = function() {

    let allHeroResp;

    const init = () => {

    };

    const updateData = (data) => {
        allHeroResp = [];
        let freeIdObjectOnAllMaps = {};

        for (let i = 0; i < data.length; i++) {
            let oneData = data[i];
            updateOneHeroesData(oneData, freeIdObjectOnAllMaps);
        }
        Engine.heroesRespManager.updateFullData(allHeroResp);
    };

    const updateOneHeroesData = (data, freeIdObjectOnAllMaps) => {
        let pos = data.pos;

        for (let i = 0; i < pos.length; i++) {
            let posData = pos[i];
            allHeroResp.push(createHeroResp(data, posData, freeIdObjectOnAllMaps))
        }
    };

    const createHeroResp = (respData, posData, freeIdObjectOnAllMaps) => {
        let heroesResp = createOneHeroesResp(respData, posData);
        let z = heroesResp.z;

        if (!isset(freeIdObjectOnAllMaps[z])) freeIdObjectOnAllMaps[z] = 0;
        else freeIdObjectOnAllMaps[z]++;

        heroesResp.id = freeIdObjectOnAllMaps[z];

        return heroesResp;
    };

    const createOneHeroesResp = (respData, posData) => {

        return {
            nick: respData.name,
            icon: respData.icon,
            lvl: respData.lvl,
            kind: heroRespKind[respData.kind],
            wt: respData.wtype,
            resp: respData.resp,
            z: 0,
            x: posData[0],
            y: posData[1],
            id: null
        }
    };

    this.init = init;
    this.updateData = updateData;

}