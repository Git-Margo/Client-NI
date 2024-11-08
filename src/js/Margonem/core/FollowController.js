let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
var FollowGlow = require('core/glow/FollowGlow');

module.exports = function() {

    let followGlow = null;
    let hero = null;
    let followObject = null;
    let moduleData = {
        fileName: "FollowGlow.js"
    };

    const init = (_hero, _followObject) => {
        initHero(_hero);
        initFollowObject(_followObject);
    };

    const initHero = (_hero) => {
        hero = _hero;
    };

    const initFollowObject = (_followObject) => {
        followObject = _followObject;
    };

    const addFollowGlow = () => {
        let refFollowObj = hero.getRefFollowObj();

        if (refFollowObj) {

            let canvasObjectType = refFollowObj.canvasObjectType;


            switch (canvasObjectType) {
                case CanvasObjectTypeData.OTHER:
                    break;
                case CanvasObjectTypeData.NPC:
                case CanvasObjectTypeData.M_ITEM:
                case CanvasObjectTypeData.GATEWAY:
                    if (canvasObjectType == followObject.canvasObjectType && refFollowObj.d.id == followObject.d.id) return;
                    break;
                default:
                    errorReport(moduleData.fileName, "addFollowGlow", `Undefined canvasObjectType ${canvasObjectType}`);
                    return
            }

            hero.clearRefFollowObj();

        }

        followGlow = new FollowGlow();
        followGlow.createObject(followObject, 'red');
        hero.setRefFollowObj(followObject);
    };

    const clearFollowGlow = () => {
        followGlow = null;
    };

    const getFollowGlow = () => {
        return followGlow;
    };

    const checkFollowGlow = () => {
        return followGlow ? true : false;
    };


    this.init = init;
    this.addFollowGlow = addFollowGlow;
    this.clearFollowGlow = clearFollowGlow;
    this.getFollowGlow = getFollowGlow;
    this.checkFollowGlow = checkFollowGlow;

}