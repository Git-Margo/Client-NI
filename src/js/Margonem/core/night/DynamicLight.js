//let RajData             = require('@core/raj/RajData');
let RajGetSpecificData = require('@core/raj/RajGetSpecificData');
let DynamicLightCommons = require('@core/night/DynamicLightCommons');
let LightData = require('@core/night/LightData');

module.exports = function() {

    let moduleData = {
        fileName: "DynamicLight"
    };
    let onlyNight = true;
    let light = null;
    //let master              = null;
    let dynamicLightCommons = null;

    const init = () => {
        dynamicLightCommons = new DynamicLightCommons();
    };

    //const setMaster = (id, masterData, additionalData) => {
    //    let targetObject = RajGetSpecificData.getTargetObject(masterData, additionalData);
    //
    //    if (!targetObject) return;
    //
    //    master = targetObject;
    //    master.getObjectDynamicLightManager().addDynamicLightId(id);
    //};

    const updateData = (data, additionalData) => {
        let id = data.id;
        let pos = dynamicLightCommons.getXY(id, data.d);


        data.d.x = pos.x;
        data.d.y = pos.y;

        dynamicLightCommons.prepareDynamicPointAndDynamicPointImg(data.d);

        light = dynamicLightCommons.createLight(data.d);
        onlyNight = dynamicLightCommons.getOnlyNight(data.d);

        dynamicLightCommons.setMaster(id, data.master, LightData.DYNAMIC_LIGHT_KIND.DYNAMIC_LIGHT, additionalData);

        //setMaster(id, data.master, additionalData);
    };

    const update = (dt) => {
        if (!light) return;

        let master = dynamicLightCommons.getMaster();

        if (!master) return;

        // light.setX(master.rx);
        // light.setY(master.ry);
        light.updatePosByMaster(master);
    };

    const draw = (mainNightCtx, actualFrame) => {
        /*
        let currentDynamicHoleImg 	= dynamicLightCommons.getDynamicHoleImgBuActualFrame(actualFrame);

        if (!currentDynamicHoleImg) return;

        let tileSize 				= CFG.tileSize;
        let halfTileSize 			= CFG.halfTileSize;
        let quarterTileSize 		= CFG.quarterTileSize;
        let mapShift 				= Engine.mapShift.getShift();

        let fw                      = currentDynamicHoleImg.width;
        let fh                      = currentDynamicHoleImg.height;

        let left = master.rx * tileSize + halfTileSize - fw / 2 +
            (isset(master.ofsetX) ? master.ofsetX : 0) -
            Engine.map.offset[0] - mapShift[0] + (typeof(master.leftPosMod) != 'undefined' ? master.leftPosMod : 0);

        let top = master.ry * tileSize - fh / 2 + quarterTileSize  - Engine.map.offset[1] - mapShift[1];

        mainNightCtx.drawImage(
            currentDynamicHoleImg,
            left,
            top
        );

        */

        if (getMaster()) {
            dynamicLightCommons.drawDynamicHole(mainNightCtx, actualFrame, null, null, null, null);
        }

    };

    const getLight = () => {
        return light;
    };

    const getOnlyNight = () => {
        return onlyNight;
    };

    //const getMaster = () => master;
    const getMaster = () => dynamicLightCommons.getMaster();

    this.init = init;
    this.draw = draw;
    this.updateData = updateData;
    this.update = update;
    this.getOnlyNight = getOnlyNight;
    this.getLight = getLight;
    this.getMaster = getMaster;
}