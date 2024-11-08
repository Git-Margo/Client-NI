let RajGetSpecificData = require('core/raj/RajGetSpecificData');
let DynamicLightCommons = require('core/night/DynamicLightCommons');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let HeroDirectionData = require('core/characters/HeroDirectionData');
let LightData = require('core/night/LightData');

module.exports = function() {

    let moduleData = {
        fileName: "DirDynamicLight"
    };
    let onlyNight = true;
    let master = null;
    let dirData = null;

    const BASE = "BASE";

    const init = () => {
        initDirData();

        //dynamicLightCommons = new DynamicLightCommons();
        //dynamicLightCommons2 = new DynamicLightCommons();
    };

    const initDirData = () => {
        dirData = {
            [BASE]: null,
            [HeroDirectionData.N]: null,
            [HeroDirectionData.E]: null,
            [HeroDirectionData.S]: null,
            [HeroDirectionData.W]: null
        }
    };

    //const setMaster = (id, masterData, additionalData) => {
    //    let targetObject = RajGetSpecificData.getTargetObject(masterData, additionalData);
    //
    //    if (!targetObject) return;
    //
    //    master = targetObject;
    //    master.getObjectDynamicLightManager().addDynamicDirCharacterLightId(id);
    //};

    //const getNpcTarget = (targetObject) => {
    //    return {
    //        kind :"NPC",
    //        id   : targetObject.getId()
    //    }
    //};
    /*
     const updateData = (id, data, additionalData) => {

     let tileSize 			= CFG.tileSize;
     let halfTileSize 		= CFG.halfTileSize;
     let d                   = data.d;
     let r                   = isset(d.r) ? d.r : Engine.dynamicLightsManager.getframesWithHoles().getDefaultR();
     let p                   = r  / tileSize - halfTileSize / tileSize;
     let offsetX             = isset(d.offsetX) ? d.offsetX : 0;
     let offsetY             = isset(d.offsetY) ? d.offsetY : 0;

     setMaster(id, data.master, additionalData);

     d.x = p + (Math.abs(offsetX) / tileSize);
     d.y = p + (Math.abs(offsetY) / tileSize);

     let nightFrameLength    = Engine.nightController.getNightFrameLength();
     dynamicPoint            = Engine.dynamicLightsManager.getframesWithHoles().getOnePoint(d, nightFrameLength, true);

     dynamicPointImg         = [];

     drawAllHole();

     if (!d.light) return;

     let oneLightPoint = Engine.nightController.createOneLightPoint(d);

     if (!oneLightPoint) return;

     light     = oneLightPoint;
     onlyNight = d.light.onlyNight;
     };
     */
    const updateData = (id, data, additionalData) => {

        //let data = {
        //    "action" : "CREATE",
        //    "id"     : 10,
        //    "master" : {"kind": "HERO"},
        //    "d": {
        //        "base": {
        //            "r"     : 80,
        //            "light" : {"r": 15, "color": {"r": 255,"g": 0,"b": 0,"a": 0.3}}
        //        },
        //        "S" : {"offsetX" : -10},
        //        "N" : {"offsetX" : 10},
        //        "W" : {"cover"   : true}
        //    }
        //};


        //if (!data.master || data.master.kind != "HERO") return;

        let o = {
            action: data.action,
            id: data.id,
            master: copyStructure(data.master),
            d: copyStructure(data.d.base)
        };


        let d = o.d;

        createOneDirData(BASE, id, o, LightData.DYNAMIC_LIGHT_KIND.DYNAMIC_DIR_CHARACTER_LIGHT, additionalData);

        let dynamicLightCommons = getDynamicLightCommonsByDir(BASE);

        onlyNight = dynamicLightCommons.getOnlyNight(d);

        //setMaster(id, o.master, additionalData);

        master = dynamicLightCommons.getMaster();

        fillAllDirection(id, o, data.d, additionalData);
    };

    const fillAllDirection = (id, o, allDirData, additionalData) => {

        let a = [HeroDirectionData.N, HeroDirectionData.E, HeroDirectionData.S, HeroDirectionData.W];

        for (let specificDir of a) {

            if (!allDirData[specificDir]) continue;

            let mergeData = deepMergeData(o, {
                d: allDirData[specificDir]
            });

            createOneDirData(specificDir, id, mergeData, null, additionalData);
        }
    };

    const getDynamicLightCommonsByDir = (dir) => {
        if (!dirData[dir]) return null;

        return dirData[dir].dynamicLightCommons;
    };

    const createOneDirData = (dir, id, o, kindDynamicLight, additionalData) => {

        let dynamicLightCommons = new DynamicLightCommons();
        let pos = dynamicLightCommons.getXY(id, o.d);
        let d = o.d;

        o.d.x = pos.x;
        o.d.y = pos.y;

        if (!d.cover) dynamicLightCommons.prepareDynamicPointAndDynamicPointImg(d);
        else {
            let dataGradient = [{
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0.8
                },
                {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0.2
                },
                {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0.0
                }
            ];
            dynamicLightCommons.prepareDynamicPointAndDynamicPointImg(d, dataGradient);
        }

        //console.log("dynamicLightCommons.createLight(d)", d);

        let light = dynamicLightCommons.createLight(d);

        if (light && d.cover) light.setCover(true);

        dirData[dir] = {
            dynamicLightCommons: dynamicLightCommons,
            light: light
        };

        dynamicLightCommons.setMaster(id, o.master, kindDynamicLight, additionalData);
    };

    //const createDynamicLightCommonsByDir = (dir) => {
    //    dirData[dir] = new DynamicLightCommons();
    //}

    //const drawAllHole = () => {
    //    setTimeout(function () {
    //        let data = dynamicPoint[drawHoleIndex];
    //
    //        dynamicPointImg[drawHoleIndex] = Engine.dynamicLightsManager.getframesWithHoles().getDynamicHoleImg(data);
    //
    //        drawHoleIndex++;
    //
    //        if (dynamicPoint[drawHoleIndex]) drawAllHole();
    //        else {
    //            //console.log(dynamicPointImg)
    //        }
    //    }, 0)
    //}

    const update = (dt) => {



        if (!master) return;

        //let l = isHeroWithProperDir() ? light2 : light;
        let light = getLight();

        if (!light) return;


        //light.setMasterFh(master.fh);
        light.setX(master.rx);
        light.setY(master.ry);
    };

    //this.getDynamicHoleImg = () => {
    //    return dynamicHoleImgArray;
    //};

    //const isHeroWithProperDir = () => {
    //    //return master.canvasObjectType == CanvasObjectTypeData.HERO && master.getDir() == HeroDirectionData.W;
    //    return master.canvasObjectType == CanvasObjectTypeData.HERO && master.getNDir() == HeroDirectionData.W;
    //};

    const getLight = () => {
        let dir = master.getNDir()

        if (dirData[dir] && dirData[dir].light) return dirData[dir].light;

        return dirData[BASE].light;
    }

    const getDynamicLightCommons = () => {
        let dir = master.getNDir()

        if (dirData[dir] && dirData[dir].dynamicLightCommons) return dirData[dir].dynamicLightCommons;

        return dirData[BASE].dynamicLightCommons;
    }

    const masterIsHero = () => {
        return master.canvasObjectType == CanvasObjectTypeData.HERO;
    }

    const draw = (mainNightCtx, actualFrame) => {
        let dynamicLightCommons = getDynamicLightCommons();
        /*
        let currentDynamicHoleImg = dynamicLightCommons.getDynamicHoleImgBuActualFrame(actualFrame);

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
        if (master) {
            dynamicLightCommons.drawDynamicHole(mainNightCtx, actualFrame, null, null, null, null);
        }

    };

    //const getLight = () => {
    //    //return light;
    //    return isHeroWithProperDir() ? light2 : light ;
    //};

    const getOnlyNight = () => {
        return onlyNight;
    };

    const getMaster = () => master;

    this.init = init;
    this.draw = draw;
    this.updateData = updateData;
    this.update = update;
    this.getOnlyNight = getOnlyNight;
    this.getLight = getLight;
    this.getMaster = getMaster;
}