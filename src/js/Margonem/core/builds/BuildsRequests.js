const BuildsData = require('core/builds/BuildsData.js');

module.exports = function() {

    const init = () => {

    };

    const setCurrentBuildId = (id) => {
        //Engine.communication.setStateTestJSONData('BUILDS_CHANGE_ID', {currentId: id})

        const BUILDS_REQ = BuildsData.REQUEST;

        let skills = Engine.skills ? '&skillshop=1' : '';

        _g(`${BUILDS_REQ.BUILDS}&${BUILDS_REQ.ACTION}=${BUILDS_REQ.UPDATE_CURRENT}&${BUILDS_REQ.ID}=${id}${skills}`);
    };

    const buyBuild = (id, kind) => {
        //Engine.communication.setStateTestJSONData('BUILDS_BUY_BUILD', {id: id})

        const reqStr = buyBuildStr(id, kind);

        _g(reqStr);
    };

    const buyBuildStr = (id, kind) => {
        const BUILDS_REQ = BuildsData.REQUEST;

        return `${BUILDS_REQ.BUILDS}&${BUILDS_REQ.ACTION}=${BUILDS_REQ.BUY}&${BUILDS_REQ.CURRENCY}=${kind}`
    };

    const setNameInBuild = (name, id) => {
        //Engine.communication.setStateTestJSONData('BUILDS_CHANGE_NAME', {name: name, id: id});

        const BUILDS_REQ = BuildsData.REQUEST;

        _g(`${BUILDS_REQ.BUILDS}&${BUILDS_REQ.ACTION}=${BUILDS_REQ.UPDATE}&${BUILDS_REQ.ID}=${id}&${BUILDS_REQ.NAME}=${name}`);
    };


    this.init = init;
    this.setCurrentBuildId = setCurrentBuildId;
    this.buyBuild = buyBuild;
    this.setNameInBuild = setNameInBuild;


    this.buyBuildStr = buyBuildStr;

}