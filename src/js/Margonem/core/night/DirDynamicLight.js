let RajGetSpecificData = require('@core/raj/RajGetSpecificData');
let DynamicLightCommons = require('@core/night/DynamicLightCommons');
let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');
let HeroDirectionData = require('@core/characters/HeroDirectionData');
let LightData = require('@core/night/LightData');

module.exports = function() {

    let moduleData = {
        fileName: "DirDynamicLight"
    };
    let onlyNight = true;
    let master = null;
    let id = null;
    let srajData = null;
    let additionalDataObject;
    let dirData = null;

    let battle = null;

    const BASE = "BASE";

    const init = () => {
        initDirData();
        setBattle(false);

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

    const setSrajData = (_srajData) => {
        srajData = _srajData;
    };

    const setBattle = (_battle) => {
        battle = _battle;
    }

    const setAdditionalData = (additionalData) => {
        additionalDataObject = additionalData
    };

    const updateData = (_id, data, additionalData, _framesWithHoles) => {

        setSrajData(data);
        setAdditionalData(additionalData);

        setBattle(data.battle ? true : false);

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

        createOneDirData(BASE, _id, o, LightData.DYNAMIC_LIGHT_KIND.DYNAMIC_DIR_CHARACTER_LIGHT, additionalData, _framesWithHoles);

        let dynamicLightCommons = getDynamicLightCommonsByDir(BASE);

        onlyNight = dynamicLightCommons.getOnlyNight(d);

        //setMaster(id, o.master, additionalData);

        master = dynamicLightCommons.getMaster();
        id = _id

        fillAllDirection(_id, o, data.d, additionalData, _framesWithHoles);
    };

    const fillAllDirection = (_id, o, allDirData, additionalData, _framesWithHoles) => {

        let a = [HeroDirectionData.N, HeroDirectionData.E, HeroDirectionData.S, HeroDirectionData.W];

        for (let specificDir of a) {

            if (!allDirData[specificDir]) continue;

            let mergeData = deepMergeData(o, {
                d: allDirData[specificDir]
            });

            createOneDirData(specificDir, _id, mergeData, null, additionalData, _framesWithHoles);
        }
    };

    const getDynamicLightCommonsByDir = (dir) => {
        if (!dirData[dir]) return null;

        return dirData[dir].dynamicLightCommons;
    };

    const createOneDirData = (dir, _id, o, kindDynamicLight, additionalData, _framesWithHoles) => {

        let dynamicLightCommons = new DynamicLightCommons();
        let d = o.d;
        let realXYPos = battle ? true : false;

        if (battle) {
            dynamicLightCommons.setFramesWithHoles(_framesWithHoles);
            o.d.middleOfCanvas = true;
        } else {
            let pos = dynamicLightCommons.getXY(_id, o.d);
            o.d.x = pos.x;
            o.d.y = pos.y;
        }


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


        let light = dynamicLightCommons.createLight(d, realXYPos);

        if (light && d.cover) light.setCover(true);

        dirData[dir] = {
            dynamicLightCommons: dynamicLightCommons,
            light: light
        };

        dynamicLightCommons.setMaster(_id, o.master, kindDynamicLight, additionalData);
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
        let realXYPos = battle ? true : false;

        if (!light) return;


        //light.setMasterFh(master.fh);
        // light.setX(master.rx);
        // light.setY(master.ry);

        //if (realXYPos) {
        //
        //} else {
        //
        //    setX(master.rx);
        //    setY(master.ry);
        //}


        light.updatePosByMaster(master);
    };

    //this.getDynamicHoleImg = () => {
    //    return dynamicHoleImgArray;
    //};

    //const isHeroWithProperDir = () => {
    //    //return master.canvasObjectType == CanvasObjectTypeData.HERO && master.getDir() == HeroDirectionData.W;
    //    return master.canvasObjectType == CanvasObjectTypeData.HERO && master.getNDir() == HeroDirectionData.W;
    //};

    const getLight = () => {
        //let dir = master.getNDir()
        let dir = getDir();

        if (dirData[dir] && dirData[dir].light) return dirData[dir].light;

        return dirData[BASE].light;
    }

    const getAllLights = () => {
        let a = [];
        for (let k in dirData) {
            if (a.push(dirData[k])) {
                dirData[k]
            }
        }

        return a;
    }

    const getDynamicLightCommons = () => {

        let dir = getDir();

        //let dir = master.getNDir()

        if (dirData[dir] && dirData[dir].dynamicLightCommons) return dirData[dir].dynamicLightCommons;

        return dirData[BASE].dynamicLightCommons;
    }

    const getDir = () => {
        let dir = null;

        if (!master) {
            return "N"
        }

        if (isset(master.getNDir)) {
            dir = master.getNDir()
        } else {
            if (isset(master.fightDir)) {
                dir = master.fightDir
            } else {
                dir = "N";
            }
        }

        return dir;
    };

    const masterIsHero = () => {
        return master.canvasObjectType == CanvasObjectTypeData.HERO;
    }

    const draw = (mainNightCtx, actualFrame) => {

        let dynamicLightCommons = getDynamicLightCommons();
        let realXYPos = battle ? true : false;
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
            dynamicLightCommons.drawDynamicHole(mainNightCtx, actualFrame, null, null, null, null, realXYPos);
        }

    };

    //const getLight = () => {
    //    //return light;
    //    return isHeroWithProperDir() ? light2 : light ;
    //};

    const getOnlyNight = () => {
        return onlyNight;
    };

    const setFramesWithHoles = (_framesWithHoles) => {
        let dynamicLightCommons = getDynamicLightCommons();

        dynamicLightCommons.setFramesWithHoles(_framesWithHoles);
    }

    const getId = () => id;
    const getMaster = () => master;
    const getSrajData = () => srajData;
    const getAdditionalData = () => additionalDataObject;

    this.init = init;
    this.draw = draw;
    this.updateData = updateData;
    this.update = update;
    this.getOnlyNight = getOnlyNight;
    this.getLight = getLight;
    this.getAllLights = getAllLights;
    this.getMaster = getMaster;
    this.getId = getId;
    this.getSrajData = getSrajData;
    this.getAdditionalData = getAdditionalData;
    this.setFramesWithHoles = setFramesWithHoles;
}