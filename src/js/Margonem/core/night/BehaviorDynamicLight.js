let BehaviorDynamicLightData = require('@core/night/BehaviorDynamicLightData');
let RajGetSpecificData = require('@core/raj/RajGetSpecificData');
let DynamicLightCommons = require('@core/night/DynamicLightCommons');
let BehaviorManager = require('@core/raj/BehaviorManager');
let RajMoveNoise = require('@core/raj/RajMoveNoise');
let LightData = require('@core/night/LightData');
let VectorCalculate = require('@core/VectorCalculate');
let RajObjectInterface = require('@core/raj/RajObjectInterface');
let RajData = require('@core/raj/RajData');

module.exports = function() {

    let moduleData = {
        fileName: "BehaviorDynamicLight.js"
    }

    let behaviorManager = null;
    let rajMoveNoise = null
    let id = null;

    let srajData = null;

    let xVector = null;
    let yVector = null;

    let onlyNight = true;
    let light = null;
    let dynamicLightCommons = null;

    let destinyX = false;
    let destinyY = false;

    let rColorSpeed = null;
    let gColorSpeed = null;
    let bColorSpeed = null;
    let aColorSpeed = null;

    let rHoleSpeed = null;
    let rLightSpeed = null;

    let lightXPos = null;
    let lightYPos = null;

    let battle = null;

    let additionalDataObject;

    const setBattle = (_battle) => {
        battle = _battle;
    }

    const init = () => {
        dynamicLightCommons = new DynamicLightCommons();
        setBattle(false);
        implementRajInterface();
        initBehaviorManager();
        initRajMoveNoise();

        behaviorManager.setBehaviorRepeat(BehaviorDynamicLightData.defaultData.BEHAVIOR_REPEAT);
    };

    const implementRajInterface = () => {
        (new RajObjectInterface()).implementRajObject(this, RajData.BEHAVIOR_DYNAMIC_LIGHT);
    }

    const initRajMoveNoise = () => {
        rajMoveNoise = new RajMoveNoise();
        rajMoveNoise.init(this);
    };

    const attachMoveNoiseManage = () => {
        let attachMoveNoise = getActualBehaviorAttachMoveNoise();

        if (attachMoveNoise == null) return;

        rajMoveNoise.startMoveNoiseBehavior();
    };

    const initBehaviorManager = () => {
        behaviorManager = new BehaviorManager();
        behaviorManager.init(
            this,
            () => {
                clearStates()
            },
            () => {
                remove();
                //Engine.floatObjectManager.remove(id);
            }
        );
        behaviorManager.setDefaultRepeat(BehaviorDynamicLightData.defaultData.BEHAVIOR_REPEAT)
    };

    const setAllData = (data, additionalData) => {
        setId(data.id);
        setSrajData(data);

        setAdditionalData(additionalData)

        setX(RajGetSpecificData.getCharacterData(data.d.x, additionalData));
        setY(RajGetSpecificData.getCharacterData(data.d.y, additionalData));
    };

    const setSrajData = (_srajData) => {
        srajData = _srajData;
    };

    const setId = (_id) => {
        id = _id;
    };

    const setAdditionalData = (additionalData) => {
        additionalDataObject = additionalData
    }

    const updateData = (_id, data, additionalData) => {
        setAllData(data, additionalData);

        setBattle(data.battle ? true : false);

        behaviorManager.setBehaviorList(copyStructure(srajData.d.behavior.list));


        if (battle) {
            data.d.middleOfCanvas = true;
        } else {
            let pos = dynamicLightCommons.getXY(id, data.d);
            data.d.x = pos.x;
            data.d.y = pos.y;
        }

        dynamicLightCommons.prepareDynamicPointAndDynamicPointImg(data.d);

        let realXYPos = battle ? true : false;

        light = dynamicLightCommons.createLight(data.d, realXYPos);
        onlyNight = dynamicLightCommons.getOnlyNight(data.d);

        if (isset(data.d.behavior.repeat)) behaviorManager.setBehaviorRepeat(srajData.d.behavior.repeat);

        if (data.master) dynamicLightCommons.setMaster(id, data.master, LightData.DYNAMIC_LIGHT_KIND.BEHAVIOR_DYNAMIC_LIGHT, additionalData);

        this.updateDataRajObject(data);

        behaviorManager.callBehavior();
    };

    const update = (dt, actualFrame) => {

        let behaviorName = behaviorManager.getActualBehaviorName();
        let BEHAVIOR = BehaviorDynamicLightData.behavior;
        let master = dynamicLightCommons.getMaster();
        let updatePosByMasterPos = checkUpdatePosByMaterPos();
        let realXYPos = battle ? true : false;
        let halfTileSize = CFG.halfTileSize;


        if (master) {
            if (isset(master.getOnloadProperImg) && !master.getOnloadProperImg()) {
                return
            }

            if (isset(master.getReady) && !master.getReady()) {
                return
            }
        }

        rajMoveNoise.updateMoveNoise(dt);

        if (updatePosByMasterPos) {
            if (realXYPos) {

            } else {

                setX(master.rx);
                setY(master.ry);
            }
        }


        switch (behaviorName) {
            case BEHAVIOR.IDLE:
                updateIdleAction(dt);
                break;
            case BEHAVIOR.MOVE_TO_CORDS:
                updateMoveToCordsAction(dt);
                break;
            case BEHAVIOR.FOLLOW:
                updateFollowAction(dt);
                break;
            case BEHAVIOR.TRANSITION:
                updateTransitionAction(dt);
                break;
            case BEHAVIOR.TRANSITION_AND_MOVE_TO_CORDS:
                updateTransitionAndMoveToCordsAction(dt);
                break;
        }

        if (light) {
            light.setXMoveNoise(rajMoveNoise.getXMoveNoise());
            light.setYMoveNoise(rajMoveNoise.getYMoveNoise());

            if (updatePosByMasterPos) light.updatePosByMaster(master);
            else light.updatePos(lightXPos, lightYPos);

        }


    };

    const updateIdleAction = (dt) => {
        behaviorManager.decreaseDuration(dt);

        let duration = behaviorManager.getDuration();
        if (duration < 0) behaviorManager.callBehavior();
    };

    const updateMoveToCordsAction = (dt) => {
        updateMoveToCords(dt);

        if (xVector == null && yVector == null) behaviorManager.callBehavior();
    };

    const updateFollowAction = (dt) => {
        let master = dynamicLightCommons.getMaster();
        if (master) {
            let destinyData = {
                x: master.getRX(),
                y: master.getRY()
            };
            setNewVector(destinyData);
        }

        behaviorManager.decreaseDuration(dt);
        let newPosition = VectorCalculate.getNewPositionFromVectors(lightXPos, lightYPos, xVector, yVector, dt);

        setX(newPosition.newX);
        setY(newPosition.newY);


        let duration = behaviorManager.getDuration();
        if (duration < 0) {
            behaviorManager.callBehavior();
            return
        }

        let reach = VectorCalculate.checkReachCord({
            x: lightXPos,
            y: lightYPos
        }, {
            x: destinyX,
            y: destinyY
        }, {
            xVector: xVector,
            yVector: yVector
        });
        if (!reach) return;

        setX(destinyX);
        setY(destinyY);

        behaviorManager.callBehavior();
    };

    const updateMoveToCords = (dt) => {

        if (xVector == null && yVector == null) return;

        //let newPosition = getNewPositionFromVectors(lightXPos, lightYPos, xVector, yVector, dt);
        let newPosition = VectorCalculate.getNewPositionFromVectors(lightXPos, lightYPos, xVector, yVector, dt);

        setX(newPosition.newX);
        setY(newPosition.newY);


        //let reach = checkReachCord({x:lightXPos,y:lightYPos}, {x: destinyX, y: destinyY}, {xVector:xVector, yVector:yVector});
        let reach = VectorCalculate.checkReachCord({
            x: lightXPos,
            y: lightYPos
        }, {
            x: destinyX,
            y: destinyY
        }, {
            xVector: xVector,
            yVector: yVector
        });
        if (!reach) return;

        setXVector(null);
        setYVector(null);

        setX(destinyX);
        setY(destinyY);
    };

    //const checkReachCord = (actualPos, destinyPos, vectors) => {
    //
    //    let reachX = false;
    //    let reachY = false;
    //
    //    if (vectors.xVector == 0) reachX = true;
    //    else {
    //
    //        if (vectors.xVector > 0) {
    //            if (actualPos.x > destinyPos.x) reachX = true
    //        } else {
    //            if (actualPos.x < destinyPos.x) reachX = true
    //        }
    //
    //    }
    //
    //    if (vectors.yVector == 0) reachY = true;
    //    else {
    //        if (vectors.yVector > 0) {
    //            if (actualPos.y > destinyPos.y) reachY = true
    //        } else {
    //            if (actualPos.y < destinyPos.y) reachY = true
    //        }
    //    }
    //
    //
    //    return reachX && reachY;
    //};

    //const getNewPositionFromVectors = (_x, _y, _xVector, _yVector, dt) => {
    //    let tileSize    = CFG.tileSize;
    //    let newX        = _x * tileSize + _xVector * dt * 100;
    //    let newY        = _y * tileSize + _yVector * dt * 100;
    //
    //    return {
    //        newX:newX / tileSize,
    //        newY:newY / tileSize
    //    }
    //};

    const updateTransitionAction = (dt) => {
        updateTransition(dt);

        if (rHoleSpeed == null && rLightSpeed == null && rColorSpeed == null && gColorSpeed == null && bColorSpeed == null && aColorSpeed == null) behaviorManager.callBehavior();

    };

    const updateTransition = (dt) => {

        let rHoleData = getActualBehaviorHoleRData();
        let lightData = getActualBehaviorLightData();

        if (rLightSpeed) {
            let behaviorLightR = lightData.r;
            let actualLightR = light.getR();
            let newLightRData = getNewLightRData(dt, actualLightR, behaviorLightR, rLightSpeed);

            light.setR(newLightRData.newLightR);

            if (newLightRData.finish) rLightSpeed = null;
        }


        if (rHoleSpeed) {
            let behaviorHoleR = rHoleData;
            let actualFrame = Engine.nightController.getActualFrame();
            let framesOfNightLength = Engine.nightController.getNightFrameLength();
            let lastFrame = actualFrame - 1;

            if (lastFrame < 0) lastFrame = framesOfNightLength - 1;

            let actualHoleR = dynamicLightCommons.getDynamicHoleRByFrame(lastFrame);
            let actualHoleOffsetX = dynamicLightCommons.getDynamicHoleOffsetXByFrame(actualFrame);
            let actualHoleOffsetY = dynamicLightCommons.getDynamicHoleOffsetYByFrame(actualFrame);
            let newHoleRData = getNewHoleRData(dt, actualHoleR, behaviorHoleR, rHoleSpeed);

            let dataToCreatePos = {
                d: {
                    offsetX: actualHoleOffsetX,
                    offsetY: actualHoleOffsetY,
                    r: Math.round(newHoleRData.newHoleR)
                }
            };

            let pos = dynamicLightCommons.getXY(id, dataToCreatePos.d);

            if (newHoleRData.finish) {

                for (let i = 0; i < framesOfNightLength; i++) {
                    updateROfHole(i, pos.x, pos.y, newHoleRData.newHoleR);
                }

                rHoleSpeed = null;
            } else {
                updateROfHole(actualFrame, pos.x, pos.y, newHoleRData.newHoleR);
            }

        }


        if (rColorSpeed || gColorSpeed || bColorSpeed || aColorSpeed) {
            let behaviorColor = lightData.color;
            let actualLightColor = light.getColorLightData();
            let newColorData = getNewColorData(dt, actualLightColor, behaviorColor, rColorSpeed, gColorSpeed, bColorSpeed, aColorSpeed);

            light.setColorLightData(newColorData.newColor.r, newColorData.newColor.g, newColorData.newColor.b, newColorData.newColor.a);
            light.refreshColorLightStop();

            if (newColorData.finish) {
                rColorSpeed = null;
                gColorSpeed = null;
                bColorSpeed = null;
                aColorSpeed = null;
            }
        }

    };

    const updateROfHole = (nightFrameIndex, x, y, newHoleR) => {
        dynamicLightCommons.setDynamicHoleXByFrame(nightFrameIndex, x);
        dynamicLightCommons.setDynamicHoleYByFrame(nightFrameIndex, y);
        dynamicLightCommons.setDynamicHoleRByFrame(nightFrameIndex, newHoleR);
        dynamicLightCommons.drawHoleByFrame(nightFrameIndex);
    };

    const getNewHoleRData = (dt, actualHoleR, behaviorHoleR, _rHoleSpeed) => {
        let newHoleR = actualHoleR;
        let finish = false;

        if (_rHoleSpeed) {
            let result = changeValLinearBySpeedAndActualValAndDesinyVal(dt, _rHoleSpeed, actualHoleR, behaviorHoleR);
            newHoleR = result.newVal;
            finish = setFinishIfFinishInObject(finish, result);
        }

        return {
            newHoleR: newHoleR,
            finish: finish
        }
    };

    const getNewLightRData = (dt, actualLightR, behaviorLightR, _rLightSpeed) => {
        let newLightR = actualLightR;
        let finish = false;

        if (_rLightSpeed) {
            let result = changeValLinearBySpeedAndActualValAndDesinyVal(dt, _rLightSpeed, actualLightR, behaviorLightR);
            newLightR = result.newVal;
            finish = setFinishIfFinishInObject(finish, result);
        }

        return {
            newLightR: newLightR,
            finish: finish
        }
    };

    const getNewColorData = (dt, actualLightColor, behaviorColor, _rColorSpeed, _gColorSpeed, _bColorSpeed, _aColorSpeed) => {
        let newColor = {
            r: actualLightColor.r,
            g: actualLightColor.g,
            b: actualLightColor.b,
            a: actualLightColor.a
        };
        let finish = false;

        if (_rColorSpeed) {
            let result = changeValLinearBySpeedAndActualValAndDesinyVal(dt, _rColorSpeed, actualLightColor.r, behaviorColor.r);
            newColor.r = result.newVal;
            finish = setFinishIfFinishInObject(finish, result);
        }
        if (_gColorSpeed) {
            let result = changeValLinearBySpeedAndActualValAndDesinyVal(dt, _gColorSpeed, actualLightColor.g, behaviorColor.g);
            newColor.g = result.newVal;
            finish = setFinishIfFinishInObject(finish, result);
        }
        if (_bColorSpeed) {
            let result = changeValLinearBySpeedAndActualValAndDesinyVal(dt, _bColorSpeed, actualLightColor.b, behaviorColor.b);
            newColor.b = result.newVal;
            finish = setFinishIfFinishInObject(finish, result);
        }
        if (_aColorSpeed) {
            let result = changeValLinearBySpeedAndActualValAndDesinyVal(dt, _aColorSpeed, actualLightColor.a, behaviorColor.a);
            newColor.a = result.newVal;
            finish = setFinishIfFinishInObject(finish, result);
        }

        return {
            newColor: newColor,
            finish: finish
        }
    }

    const setFinishIfFinishInObject = (finish, result) => {
        if (finish) return true;

        if (result.finish) return true;

        return false;
    };

    const changeValLinearBySpeedAndActualValAndDesinyVal = (dt, speed, actualVal, destinyVal) => {
        let result = {
            newVal: actualVal + dt * speed,
            finish: null
        };

        if (speed > 0) {
            if (result.newVal > destinyVal) result.finish = true;
        } else {
            if (result.newVal < destinyVal) result.finish = true;
        }

        if (result.finish) result.newVal = destinyVal;

        return result;
    };

    const updateTransitionAndMoveToCordsAction = (dt) => {
        updateMoveToCords(dt);
        updateTransition(dt);

        if (xVector == null && yVector == null && rHoleSpeed == null && rLightSpeed == null && rColorSpeed == null && gColorSpeed == null && bColorSpeed == null && aColorSpeed == null) behaviorManager.callBehavior();
    };

    const setX = (_x) => {
        lightXPos = _x;
        this.x = _x;
        this.rx = _x;
    };

    const setY = (_y) => {
        lightYPos = _y;
        this.y = _y;
        this.ry = _y;
    };

    const startBehavior = (name) => {
        const BEHAVIOR = BehaviorDynamicLightData.behavior;

        switch (name) {
            case BEHAVIOR.IDLE:
                startIdleBehavior();
                break;
            case BEHAVIOR.MOVE_FROM_VECTORS:
                startMoveFromVectorsBehavior();
                break;
            case BEHAVIOR.MOVE_TO_CORDS:
                startMoveToCordsBehavior(true);
                break;
            case BEHAVIOR.FOLLOW:
                startFollowBehavior(true);
                break;
            case BEHAVIOR.TRANSITION:
                startTransitionBehavior(true);
                break;
            case BEHAVIOR.TRANSITION_AND_MOVE_TO_CORDS:
                startTransitionAndMoveToCordsBehavior();
                break;
            case BEHAVIOR.TP_TO_CORDS:
                startTpBehavior();
                break;
            case BEHAVIOR.TP_ON_OTHER_SIDE:
                startTpOnOtherSideBehavior();
                break;
            default:
                errorReport(moduleData.fileName, "startBehavior", "Incorrect name!", name);
        }
    };

    const startFollowBehaviorOld = () => {
        let destinyData = getActualBehaviorDestinyData();
        let speedData = getActualBehaviorSpeedData();
        let pos = getRxRyFromSrajData({
            x: destinyData.x,
            y: destinyData.y
        });


        setDestinyX(pos.rx);
        setDestinyY(pos.ry);

        speedData = speedData == null ? BehaviorDynamicLightData.defaultData.SPEED : speedData;

        let data = VectorCalculate.getNewVectorsFromDestinyAndPowerOfVectors({
                x: lightXPos,
                y: lightYPos
            }, {
                x: destinyX,
                y: destinyY
            },
            speedData
        );

        setXVector(data.newXVector);
        setYVector(data.newYVector);

        //attachRotationManage();
        attachMoveNoiseManage()

        let durationData = behaviorManager.getActualBehaviorDurationData();

        if (durationData != null) behaviorManager.setDuration(durationData);
    };

    const startFollowBehavior = () => {
        let destinyData;
        let master = dynamicLightCommons.getMaster();

        if (master) destinyData = {
            x: master.getRX(),
            y: master.getRY()
        };
        else destinyData = getActualBehaviorDestinyData();

        setNewVector(destinyData);

        attachMoveNoiseManage();

        let durationData = behaviorManager.getActualBehaviorDurationData();

        if (durationData != null) behaviorManager.setDuration(durationData);
    };

    const setNewVector = (destinyData) => {
        let pos = getRxRyFromSrajData({
            x: destinyData.x,
            y: destinyData.y
        });
        let speedData = getActualBehaviorSpeedData();
        speedData = speedData == null ? BehaviorDynamicLightData.defaultData.SPEED : speedData;

        setDestinyX(pos.rx);
        setDestinyY(pos.ry);

        let data = VectorCalculate.getNewVectorsFromDestinyAndPowerOfVectors({
                x: lightXPos,
                y: lightYPos
            }, {
                x: destinyX,
                y: destinyY
            },
            speedData
        );

        setXVector(data.newXVector);
        setYVector(data.newYVector);
    }

    const startIdleBehavior = () => {
        let durationData = behaviorManager.getActualBehaviorDurationData();

        if (durationData != null) behaviorManager.setDuration(durationData);


        attachMoveNoiseManage()
    };

    const serverRayControllerData = (data) => {
        Engine.rajController.parseObject(data, false, {
            floatObjectId: id
        });
    };

    const getSpeedFromDuration = (startPosX, startPosY, endPosX, endPosY, behaviorDuration) => {
        //v = d / t
        let d = Math.sqrt(Math.abs(startPosX - endPosX) + Math.abs(startPosY - endPosY));

        return d / behaviorDuration
    };

    const setSpeedByLengthAndDuration = (a, b, behaviorDuration) => {
        if (a == b) return null;

        if (a > b) return (b - a) / behaviorDuration;
        else return (b - a) / behaviorDuration;
    };

    const startTransitionAndMoveToCordsBehavior = () => {
        startMoveToCordsBehavior();
        startTransitionBehavior();

        attachMoveNoiseManage();
    };

    const startTransitionBehavior = (attachMoveNoise) => {
        let behaviorDuration = behaviorManager.getActualBehaviorDurationData();
        behaviorDuration = behaviorDuration === null ? BehaviorDynamicLightData.defaultData.BEHAVIOR_DURATION : behaviorDuration;

        let rHoleData = getActualBehaviorHoleRData();
        let lightData = getActualBehaviorLightData();

        if (lightData) {
            if (lightData.color) {
                let behaviorColor = lightData.color;
                let actualLightColor = light.getColorLightData();

                rColorSpeed = setSpeedByLengthAndDuration(actualLightColor.r, behaviorColor.r, behaviorDuration);
                gColorSpeed = setSpeedByLengthAndDuration(actualLightColor.g, behaviorColor.g, behaviorDuration);
                bColorSpeed = setSpeedByLengthAndDuration(actualLightColor.b, behaviorColor.b, behaviorDuration);
                aColorSpeed = setSpeedByLengthAndDuration(actualLightColor.a, behaviorColor.a, behaviorDuration);
            }

            if (lightData.r) {
                let behaviorLightR = lightData.r;
                let actualLightR = light.getR();

                rLightSpeed = setSpeedByLengthAndDuration(actualLightR, behaviorLightR, behaviorDuration);
            }
        }

        if (rHoleData != null) {
            let behaviorHoleR = rHoleData;

            let actualFrame = Engine.nightController.getActualFrame();
            let actualHoleR = dynamicLightCommons.getDynamicHoleRByFrame(actualFrame);
            let frameLength = Engine.nightController.getNightFrameLength();
            let durationForOneFrame = behaviorDuration / frameLength;

            rHoleSpeed = setSpeedByLengthAndDuration(actualHoleR, behaviorHoleR, durationForOneFrame);
        }


        if (attachMoveNoise) {
            attachMoveNoiseManage()
        }
    };

    const startMoveToCordsBehavior = (attachMoveNoise) => {
        let destinyData = getActualBehaviorDestinyData();
        let behaviorDuration = behaviorManager.getActualBehaviorDurationData();
        let pos = getRxRyFromSrajData({
            x: destinyData.x,
            y: destinyData.y
        });
        let speedData = null;

        setDestinyX(pos.rx);
        setDestinyY(pos.ry);

        behaviorDuration = behaviorDuration == null ? BehaviorDynamicLightData.defaultData.BEHAVIOR_DURATION : behaviorDuration;
        speedData = getSpeedFromDuration(lightXPos, lightYPos, destinyX, destinyY, behaviorDuration);


        let data = getNewVectorsFromDestinyAndPowerOfVectors({
                x: lightXPos,
                y: lightYPos
            }, {
                x: destinyX,
                y: destinyY
            },
            speedData
        );

        setXVector(data.newXVector);
        setYVector(data.newYVector);

        if (attachMoveNoise) {
            attachMoveNoiseManage()
        }
    };

    const getNewVectorsFromDestinyAndPowerOfVectors = (actualPos, destiny, speed) => {

        let xLength = Math.abs(actualPos.x - destiny.x);
        let yLength = Math.abs(actualPos.y - destiny.y);

        if (xLength + yLength == 0) return {
            newXVector: 0,
            newYVector: 0
        };

        let xDir = actualPos.x <= destiny.x ? 1 : -1;
        let yDir = actualPos.y <= destiny.y ? 1 : -1;

        let newXVector = (xLength * speed) / (xLength + yLength);
        let newYVector = (yLength * speed) / (xLength + yLength);

        return {
            newXVector: newXVector * xDir,
            newYVector: newYVector * yDir
        }
    };

    const getRxRyFromSrajData = (data) => {
        return {
            rx: RajGetSpecificData.getCharacterData(data.x),
            ry: RajGetSpecificData.getCharacterData(data.y)
        };
    };

    const getActualBehaviorDestinyData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return {
            x: b.x,
            y: b.y
        };
    };

    const getActualBehaviorAttachMoveNoise = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.attachMoveNoise ? b.attachMoveNoise : null;
    };

    const getActualBehaviorLightData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.light ? b.light : null;
    };

    const getActualBehaviorHoleRData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.r ? b.r : null;
    };

    const clearStates = () => {
        behaviorManager.setDuration(BehaviorDynamicLightData.defaultData.BEHAVIOR_DURATION);
    };

    const getActualBehavior = () => {
        //return behaviorList[behaviorIndex];
        return behaviorManager.getActualBehavior();
    };

    const getActualBehaviorSpeedData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.speed ? b.speed : null;
    };

    const setXVector = (_xVector) => {
        xVector = _xVector;
    };

    const setYVector = (_yVector) => {
        yVector = _yVector;
    };

    const setDestinyX = (_destinyX) => {
        destinyX = _destinyX;
    };

    const setDestinyY = (_destinyY) => {
        destinyY = _destinyY;
    };

    const remove = () => {
        Engine.behaviorDynamicLightsManager.rajRemoveActionBeyondManager(id)
    }

    const draw = (mainNightCtx, actualFrame) => {

        if (battle) {
            debugger;
        }

        let xNoise = rajMoveNoise.getXMoveNoise();
        let yNoise = rajMoveNoise.getYMoveNoise();
        let updatePosByMasterPos = checkUpdatePosByMaterPos();

        let realXYPos = battle ? true : false;


        if (updatePosByMasterPos) dynamicLightCommons.drawDynamicHole(mainNightCtx, actualFrame, null, null, xNoise, yNoise, realXYPos);
        else dynamicLightCommons.drawDynamicHole(mainNightCtx, actualFrame, lightXPos, lightYPos, xNoise, yNoise, realXYPos);
    };
    /*
        const drawBattle = (mainNightCtx, actualFrame) => {

            let xNoise                  = rajMoveNoise.getXMoveNoise();
            let yNoise                  = rajMoveNoise.getYMoveNoise();

            let scale                   = srajData.scale;
            let position                = srajData.position;

            dynamicLightCommons.drawDynamicHoleBattle(mainNightCtx, actualFrame, lightXPos,   lightYPos, xNoise, yNoise, scale, position);
        };
    */
    const checkUpdatePosByMaterPos = () => {
        const behaviorName = behaviorManager.getActualBehaviorName();
        const master = dynamicLightCommons.getMaster();
        const BEHAVIOR = BehaviorDynamicLightData.behavior;

        return master && [BEHAVIOR.IDLE, BEHAVIOR.TRANSITION].includes(behaviorName)
    };

    const setFramesWithHoles = (_framesWithHoles) => {
        dynamicLightCommons.setFramesWithHoles(_framesWithHoles);
    }

    const getLight = () => light;

    const getId = () => id;

    const getOnlyNight = () => onlyNight;

    const getMaster = () => dynamicLightCommons.getMaster();

    const getSrajData = () => srajData;

    const getAdditionalData = () => additionalDataObject;

    const getDynamicPointImg = () => dynamicLightCommons.getDynamicPointImg();
    const getDynamicPoint = () => dynamicLightCommons.getDynamicPoint();

    this.init = init;
    this.draw = draw;
    this.update = update;
    this.updateData = updateData;
    this.getOnlyNight = getOnlyNight;
    this.getLight = getLight;
    this.getId = getId;
    this.getMaster = getMaster;
    this.startBehavior = startBehavior;
    this.getActualBehavior = getActualBehavior;
    this.getSrajData = getSrajData;
    this.getAdditionalData = getAdditionalData;
    //this.drawBattle             = drawBattle;
    this.getDynamicPointImg = getDynamicPointImg;
    this.getDynamicPoint = getDynamicPoint;
    this.setFramesWithHoles = setFramesWithHoles;

}