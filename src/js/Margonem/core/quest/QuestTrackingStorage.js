var Storage = require('core/Storage');

module.exports = function() {

    let init = () => {

    };

    const setQuestTrackingId = (id) => {
        let heroId = getEngine().hero.getId();
        Storage.set('questTracking' + heroId, parseInt(id));
    };

    const checkQuestTrackingId = () => {
        let heroId = getEngine().hero.getId();
        let data = Storage.get('questTracking' + heroId);

        return data !== null ? true : false;
    };

    const getQuestTrackingId = () => {
        let heroId = getEngine().hero.getId();
        return Storage.get('questTracking' + heroId);
    };

    const removeQuestTracking = () => {
        let heroId = getEngine().hero.getId();
        if (!Storage.get('questTracking' + heroId)) return;
        Storage.remove('questTracking' + heroId);
    };



    this.init = init;
    this.setQuestTrackingId = setQuestTrackingId;
    this.getQuestTrackingId = getQuestTrackingId;
    this.checkQuestTrackingId = checkQuestTrackingId;
    this.removeQuestTracking = removeQuestTracking;
};