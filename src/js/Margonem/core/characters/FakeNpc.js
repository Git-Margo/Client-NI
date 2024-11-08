var Character = require('core/characters/Character');
let HeroDirectionData = require('core/characters/HeroDirectionData');
let FakeNpcData = require('core/characters/FakeNpcData');
var SearchPath = require('core/searchPath/SearchPath');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let RajGetSpecificData = require('core/raj/RajGetSpecificData');
let RajBehaviorCommons = require('core/raj/RajBehaviorCommons');
let BehaviorManager = require('core/raj/BehaviorManager');
let RajData = require('core/raj/RajData');
let RajObjectInterface = require('core/raj/RajObjectInterface');
//let RajObject      			= require('core/raj/RajObject');

let FakeNpc = function() {

    let self = this;

    //let rajObject = null;

    this.d = {};
    this.id = null;
    this.rx = null;
    this.ry = null;
    this.dir = HeroDirectionData.S;
    this.canvasObjectType = CanvasObjectTypeData.FAKE_NPC;

    let behaviorManager = null;

    this.fake = true;

    //this.duration = null;

    //this.destiny = false;
    this.destinyX = false;
    this.destinyY = false;

    this.destinyNextTile = null;

    //this.behavior = null;
    //this.behaviourIndex = null;
    this.external_properties = null;

    //this.behaviorRepeat 	= FakeNpcData.defaultData.BEHAVIOR_REPEAT;
    //this.oneBehaviorRepeat 	= FakeNpcData.defaultData.BEHAVIOR_REPEAT;

    this.autoPath = SearchPath.getEmptyRoad();

    this.clickData = null;

    this.fw = null;
    this.fh = null;

    this.halfFw = null;
    this.halfFh = null;

    this.frame = 0;
    this.frames = null;
    this.activeFrame = null;

    this.sprite = null;
    let timePassed = 0;

    let speed = null

    let inMove = false;

    //let tempBehaviourIndex	= null;
    //let switchBehavior 		= false;
    //let breakBehaviour 		= false;
    //let newBehaviourData	= null;

    let instantFadeOut = false;

    let ignoreUpdateCollisionAndStartEndPos = false;

    let allIgnorePositions = [];

    let notUpdatedRoad = null;

    const init = () => {
        self.createPlaceHolderCharacter();
        implementRajInterface();
        initBehaviorManager();
        setSpeed(4.9);
        this.initDynamicLightCharacterManager();
        //setSpeed(1);
    };

    const implementRajInterface = () => {
        (new RajObjectInterface()).implementRajObject(this, RajData.FAKE_NPC);
    }

    //const initRajObject = () => {
    //	rajObject = new RajObject();
    //	rajObject.init();
    //}

    const initBehaviorManager = () => {
        behaviorManager = new BehaviorManager();
        behaviorManager.init(
            this,
            () => {
                clearStates()
            },
            () => {
                removeFakeNpc();
            }
        );
        behaviorManager.setDefaultRepeat(FakeNpcData.defaultData.BEHAVIOR_REPEAT)
        behaviorManager.setOneBehaviorRepeat(FakeNpcData.defaultData.BEHAVIOR_REPEAT);
    };

    const setIgnoreUpdateCollisionAndStartEndPos = (state) => {
        ignoreUpdateCollisionAndStartEndPos = state;
    };

    const resetAllIgnorePositions = () => {
        allIgnorePositions = [];
    }

    const addIgnorePositions = (x, y) => {

        for (let i = 0; i < allIgnorePositions.length; i++) {
            if (allIgnorePositions[i].x == x && allIgnorePositions[i].y == y) return;
        }

        allIgnorePositions.push({
            x: x,
            y: y
        })
    };

    const setSpeed = (_speed) => {
        speed = _speed;
    }

    const setInstantFadeOut = (_instantFadeOut) => {
        instantFadeOut = _instantFadeOut
    }

    //const setSwitchBehavior = (_switchBehavior) => {
    //	switchBehavior = _switchBehavior;
    //};

    //const setBreakBehaviour = (_breakBehaviour) => {
    //	breakBehaviour = _breakBehaviour;
    //};

    //const checkCacheTempBehaviourIndexIsSet = () => {
    //	return tempBehaviourIndex != null;
    //}

    //const cacheTempBehaviourIndex = () => {
    //	tempBehaviourIndex = this.behaviourIndex;
    //}

    //const clearTempBehaviourIndex = () => {
    //	tempBehaviourIndex = null;
    //}

    //const setNewBehaviourData = (_newBehaviourData) => {
    //	newBehaviourData = _newBehaviourData;
    //};

    const update = (dt) => {
        if (!self.sprite) return

        if (!Engine.allInit) return

        animate(dt);

        let behaviorName = behaviorManager.getActualBehaviorName();

        switch (behaviorName) {
            case FakeNpcData.behavior.WALK:
                this.changeWarShadowOpacity(dt);
                walkProcedure(dt);
                break;
            case FakeNpcData.behavior.IDLE:
                this.changeWarShadowOpacity(dt);
                idleProcedure(dt);
                break;
            case FakeNpcData.behavior.TP:
                tpProcedure(dt);
                break;
        }

        self.updateCollider();

        //if (checkCameraUpdate()) {
        //	Engine.map.centerOn(this.rx, this.ry);
        //}
    };

    //const checkCameraUpdate = () => {
    //	if (!getActualCameraTarget()) 	return false;
    //	if (!Engine.lock.check()) 		return false;
    //
    //	return Engine.lock.check('npcdialog') || Engine.lock.check('progressBar');
    //};

    const tpProcedure = (dt) => {
        this.decreaseWarShadowOpacity(dt);

        if (this.isHide()) {

            this.rx = this.tpX;
            this.ry = this.tpY;

            this.d.x = this.tpX;
            this.d.y = this.tpY;

            behaviorManager.callBehavior();
        }
    }

    const idleProcedure = (dt) => {
        //this.duration -= dt;
        behaviorManager.decreaseDuration(dt);

        let breakBehavior = behaviorManager.getBreakBehavior();

        if (breakBehavior) {
            behaviorManager.callBehavior();
            return;
        }

        let duration = behaviorManager.getDuration();

        if (duration < 0) behaviorManager.callBehavior();
    }


    const walkProcedure = (dt) => {
        if (isDestiny()) {
            inMove = false;

            behaviorManager.callBehavior();
            return;
        }

        if (!inMove) {

            if (!checkRoadExist()) {
                alignFakeNpcToSaveTileByStartCords(Math.floor(this.rx), Math.floor(this.ry));
                startWalkBehavior();

                inMove = false;
                return;
            }

            startInMoveProcedure();

        }

        let data = getNextPosData(dt, this.dir, this.d.x, this.d.y, this.rx, this.ry, this.destinyNextTile.x, this.destinyNextTile.y);

        if (data.recallRoad && data.reach) {

            alignFakeNpcToSaveTileByStartCords(Math.floor(this.rx), Math.floor(this.ry));
            startWalkBehavior();

            inMove = false;
            return;
        }

        let breakBehavior = behaviorManager.getBreakBehavior();

        if (breakBehavior && data.reach) {
            alignFakeNpcToTile(data.lastReachX, data.lastReachY);

            //this.dir 	= data.dir;
            inMove = false;

            behaviorManager.callBehavior();
            return;
        }

        this.rx = data.rx;
        this.ry = data.ry;
        this.d.x = data.lastReachX;
        this.d.y = data.lastReachY;
        this.dir = data.dir;
        this.destinyNextTile.x = data.destinyNextTileX;
        this.destinyNextTile.y = data.destinyNextTileY;

        updateFrameInMove();
    };

    const alignFakeNpcToSaveTileByStartCords = (startX, startY) => {
        let tile = lookForFreeTile(startX, startY);

        alignFakeNpcToTile(tile.x, tile.y)
    }

    const alignFakeNpcToTile = (x, y) => {
        this.rx = x;
        this.ry = y;
        this.d.x = x;
        this.d.y = y;
    }

    const startInMoveProcedure = () => {
        if (checkCollision(Math.floor(this.rx), Math.floor(this.ry))) {
            console.log('OMG3');
        }
        //console.log('startInMoveProcedure', this.id)
        inMove = true;
        this.destinyNextTile = getNextTilePosRoad();
        this.dir = getNewDir(this.d.x, this.d.y, this.destinyNextTile.x, this.destinyNextTile.y);

    }

    const updateFrameInMove = () => {
        this.frame = this.d.x == this.rx && this.d.y == this.ry ? 0 : Math.floor((this.rx + this.ry) * 2) % 4;
    }

    //const getActualBehaviorRepeatData = () => {
    //	let b = getActualBehavior();
    //	if (!b) return null;
    //
    //	return b.repeat ? b.repeat : null;
    //}

    const getActualBehaviorIgnoreStartAndEndPosition = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.ignoreBehaviourStartAndEndPosition ? true : false;
    }

    //const getActualBehaviorName = () => {
    //	let b = getActualBehavior();
    //	if (!b) return null;
    //
    //	return b.name;
    //}

    const getActualCameraTarget = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.cameraTarget;
    }

    const getActualBehaviorDestinyData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return {
            x: b.x,
            y: b.y
        };
    }

    //const getActualBehaviorExternal_propertiesData = () => {
    //	let b = getActualBehavior();
    //	if (!b) return null;
    //
    //	return b.external_properties ? b.external_properties : null;
    //}

    //const getActualBehaviorCaseData = () => {
    //	let b = getActualBehavior();
    //	if (!b) return null;
    //
    //	return b.case ? b.case : null;
    //};

    const getActualBehaviorSpeedData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.speed ? b.speed : null;
    }

    //const getActualBehaviorDurationData = () => {
    //	let b = getActualBehavior();
    //	if (!b) return null;
    //
    //	return b.duration ? b.duration : null;
    //}

    const getActualBehaviorDirData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.dir ? RajGetSpecificData.getCharacterData(b.dir) : null;
    }

    const getActualBehaviorTpData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return {
            x: b.x,
            y: b.y
        };
    }

    const getActualBehavior = () => {
        //return this.behavior[this.behaviourIndex]
        return behaviorManager.getActualBehavior();
    }

    const getNextPosData = (dt, dir, lastReachX, lastReachY, rx, ry, destinyNextTileX, destinyNextTileY) => {

        let roadLength = speed * dt;

        let nextPosFromDir = getNextPosFromDir(dir, lastReachX, lastReachY, rx, ry, roadLength);
        let reachNextTileData = getReachNextTileData(dir, lastReachX, lastReachY, nextPosFromDir);
        let reach = false;
        let recallRoad = null;

        if (reachNextTileData) {
            let rest = reachNextTileData.rest;
            let tileX = reachNextTileData.tileX;
            let tileY = reachNextTileData.tileY;

            reach = true;
            lastReachX = tileX;
            lastReachY = tileY;

            if (destinyIsBlock()) recallRoad = true;

            if (!recallRoad && checkRoadExist()) {
                let destinyNextTile = getNextTilePosRoad();

                destinyNextTileX = destinyNextTile.x;
                destinyNextTileY = destinyNextTile.y;
                dir = getNewDir(tileX, tileY, destinyNextTileX, destinyNextTileY, dir);
                nextPosFromDir = getNextPosFromDir(dir, lastReachX, lastReachY, rx, ry, rest);

                let floorNextPosFromDirX = Math.floor(nextPosFromDir.x);
                let floorNextPosFromDirY = Math.floor(nextPosFromDir.y);

                if (checkCollision(tileX, tileY, true)) recallRoad = true;
                if (checkCollision(floorNextPosFromDirX, floorNextPosFromDirY, true)) recallRoad = true;


            } else {

                let floorNextPosFromDirX = Math.floor(nextPosFromDir.x);
                let floorNextPosFromDirY = Math.floor(nextPosFromDir.y);
                nextPosFromDir = {
                    x: lastReachX,
                    y: lastReachY
                };

                if (checkCollision(destinyNextTileX, destinyNextTileY, true)) recallRoad = true;
                if (checkCollision(floorNextPosFromDirX, floorNextPosFromDirY, true)) recallRoad = true;
            }

        }

        return {
            rx: nextPosFromDir.x,
            ry: nextPosFromDir.y,
            lastReachX: lastReachX,
            lastReachY: lastReachY,
            dir: dir,
            destinyNextTileX: destinyNextTileX,
            destinyNextTileY: destinyNextTileY,
            reach: reach,
            recallRoad: recallRoad
        }
    };

    const getNewDir = (currentX, currentY, destinyX, destinyY, dir) => {

        if (currentX != destinyX) {
            return currentX < destinyX ? HeroDirectionData.E : HeroDirectionData.W;
        }

        if (currentY != destinyY) {
            return currentY > destinyY ? HeroDirectionData.N : HeroDirectionData.S;
        }

        errorReport('FakeNpc.js', 'getNewDir', 'BUG! New dir not find!');

        //return HeroDirectionData.E
        //return null
        return dir
    }

    // this.setNewPos = (x, y) => {
    // 	this.rx = x;
    // 	this.ry = y;
    // }

    const getReachNextTileData = (dir, lastReachX, lastReachY, nextPos) => {

        let x
        let y

        switch (dir) {
            case HeroDirectionData.N:
                y = lastReachY - 1;

                if (nextPos.y < y) {

                    return {
                        rest: Math.abs(y - nextPos.y),
                        tileX: lastReachX,
                        tileY: y
                    }

                } else return false;


            case HeroDirectionData.S:
                y = lastReachY + 1;

                if (nextPos.y > y) {

                    return {
                        rest: Math.abs(y - nextPos.y),
                        tileX: lastReachX,
                        tileY: y
                    }

                } else return false;

            case HeroDirectionData.W:
                x = lastReachX - 1;

                if (nextPos.x < x) {

                    return {
                        rest: Math.abs(x - nextPos.x),
                        tileX: x,
                        tileY: lastReachY
                    }

                } else return false;

            case HeroDirectionData.E:
                x = lastReachX + 1;

                if (nextPos.x > x) {

                    return {
                        rest: Math.abs(x - nextPos.x),
                        tileX: x,
                        tileY: lastReachY
                    }

                } else return false;

        }
    };

    const getNextPosFromDir = (dir, lastReachX, lastReachY, posX, posY, roadLength) => {

        switch (dir) {
            case HeroDirectionData.N:
                return {
                    x: lastReachX, y: posY - roadLength
                };
            case HeroDirectionData.S:
                return {
                    x: lastReachX, y: posY + roadLength
                };
            case HeroDirectionData.W:
                return {
                    x: posX - roadLength, y: lastReachY
                };
            case HeroDirectionData.E:
                return {
                    x: posX + roadLength, y: lastReachY
                };
        }

        errorReport('FakeNpc.js', 'getNextPosFromDir', 'incorrect dir', dir);

        return {
            x: posX,
            y: posY
        };
    }

    const getNextTilePosRoad = () => {
        let pos;
        if (ignoreUpdateCollisionAndStartEndPos) pos = notUpdatedRoad.pop();
        else pos = this.autoPath.pop();

        return pos;
    };

    const checkRoadExist = () => {
        let count;

        if (ignoreUpdateCollisionAndStartEndPos) count = notUpdatedRoad.length;
        else count = this.autoPath.count();

        return count > 0
    }

    const isDestiny = () => {
        return this.rx == this.destinyX && this.ry == this.destinyY;
    }

    const clearRoad = () => {
        this.autoPath.clear();

        if (!ignoreUpdateCollisionAndStartEndPos) return;

        notUpdatedRoad = null;
    }

    const createAutoPath = (to) => {
        this.autoPath = SearchPath.find(this, to);

        if (!ignoreUpdateCollisionAndStartEndPos) return;

        let road = this.autoPath.road;

        notUpdatedRoad = [];

        for (let i = 0; i < road.length; i++) {
            let x = road[i].x;
            let y = road[i].y;

            notUpdatedRoad.push({
                x: x,
                y: y
            });
        }

    }

    const searchPath = (to) => {
        clearRoad();

        if (isNaN(to.x) || isNaN(to.y)) return;


        let collisionsToMute = [];

        for (let i = 0; i < allIgnorePositions.length; i++) {
            let c = allIgnorePositions[i];
            let cKind = Engine.map.col.check(c.x, c.y);
            if (cKind == 2) collisionsToMute.push({
                x: c.x,
                y: c.y
            });
        }

        for (let i = 0; i < collisionsToMute.length; i++) {
            let c = collisionsToMute[i];
            Engine.map.col.unset(c.x, c.y, 2);
        }

        if (collisionsToMute.length) SearchPath.reload();

        createAutoPath(to);

        for (let i = 0; i < collisionsToMute.length; i++) {
            let c = collisionsToMute[i];
            Engine.map.col.set(c.x, c.y, 2);
        }

        if (collisionsToMute.length) SearchPath.reload();

        //console.log('searchPath', GET_HARD_COPY_STRUCTURE(this.autoPath.road))
    };

    // const updateDPosToPatchFinding = () => {
    // 	this.d.x = Math.floor(this.rx);
    // 	this.d.y = Math.floor(this.ry);
    // };

    const beforeOnload = (f, i) => {
        self.fw = f.hdr.width / 4;
        self.fh = f.hdr.height / 4;

        self.halfFw = this.fw / 2;
        self.halfFh = this.fh / 2;

        self.frames = f.frames;
        self.activeFrame = 0;
        self.sprite = i;
        self.updateCollider();
    };

    //const callBehavior = () => {
    //	clearStates();
    //	manageSwitchBehaviourProcedure();
    //	manageBehaviorIndex();
    //	startBehavior();
    //}

    //const manageSwitchBehaviourProcedure = () => {
    //	if (!breakBehaviour) return;
    //
    //	if (!checkCacheTempBehaviourIndexIsSet()) cacheTempBehaviourIndex();
    //
    //	this.behavior 				= prepareBehaviorList(copyStructure(newBehaviourData.list));
    //	this.behaviorRepeat 		= isset(newBehaviourData.repeat) ? newBehaviourData.repeat : FakeNpcData.defaultData.BEHAVIOR_REPEAT;
    //	this.behaviourIndex 		= null;
    //
    //	setSwitchBehavior(true);
    //	setBreakBehaviour(false);
    //};

    //const manageBehaviorIndex = () => {
    //	if (this.behaviourIndex == null) {
    //		updateBehaviorIndex(0);
    //		return
    //	}
    //
    //	if (this.oneBehaviorRepeat === true) {
    //		//console.log('infinitive one behavior')
    //		return;
    //	}
    //
    //	this.oneBehaviorRepeat--;
    //
    //	if (this.oneBehaviorRepeat <= 0) {
    //
    //		updateBehaviorIndex(this.behaviourIndex + 1);
    //
    //		if (this.behavior.length < this.behaviourIndex + 1) {
    //			this.behaviourIndex = 0;
    //
    //			updateBehaviorIndex(0);
    //
    //			if (this.behaviorRepeat === true) {
    //				//console.log('infinitive behavior tab')
    //				return;
    //			}
    //
    //			this.behaviorRepeat--;
    //
    //			if (this.behaviorRepeat <= 0) endBehaviourCallback();
    //
    //		}
    //	}
    //};

    //const updateBehaviorIndex = (_behaviourIndex) => {
    //	//this.behaviourIndex = _behaviourIndex;
    //	setBehaviorIndex(_behaviorIndex);
    //
    //	let _oneBehaviorRepeat = getActualBehaviorRepeatData();
    //
    //	if (_oneBehaviorRepeat != null) 	setOneBehaviorRepeat(_oneBehaviorRepeat);
    //	else							    setOneBehaviorRepeat(FakeNpcData.defaultData.BEHAVIOR_REPEAT)
    //
    //}

    //const endBehaviourCallback = () => {
    //
    //	if (switchBehavior) 	restoreBehaviour();
    //	else 					removeFakeNpc();
    //};

    //const restoreBehaviour = () => {
    //
    //	this.behavior 				= prepareBehaviorList(copyStructure(this.d.behavior.list));
    //	this.behaviorRepeat 		= this.d.behavior.repeat;
    //	this.behaviourIndex 		= tempBehaviourIndex - 1;
    //
    //	//console.log(tempBehaviourIndex);
    //
    //	clearTempBehaviourIndex();
    //	setSwitchBehavior(false);
    //
    //	callBehavior();
    //};

    const removeFakeNpc = () => {
        //console.log('removeFakeNpc', this.id);
        this.getObjectDynamicLightManager().removeAllDynamicLights();
        this.getObjectDynamicLightManager().removeAllDynamicDirCharacterLights();
        this.getObjectDynamicLightManager().removeAllDynamicBehaviorLights();
        Engine.fakeNpcs.removeFakeNpc(this.id)
    };

    const startBehavior = (name) => {
        //let name              	= getActualBehaviorName();
        //let externalProperties  = getActualBehaviorExternal_propertiesData();
        //let caseData            = getActualBehaviorCaseData();
        //
        //if (caseData != null && !Engine.rajCase.checkFullFillCase(caseData)) {
        //	callBehavior();
        //	return;
        //}
        //
        //if (externalProperties) serverRayControllerData(externalProperties)

        // console.log(name);

        switch (name) {
            case FakeNpcData.behavior.WALK:
                startWalkBehavior();
                break;
            case FakeNpcData.behavior.IDLE:
                startIdleBehavior();
                break;
            case FakeNpcData.behavior.TP:
                startTpBehavior();
                break;
            default:
                errorReport("FakeNpc.js", "startBehavior", "Incorrect name!", name);
        }
    }

    const manageIgnorePositions = (startBehaviourTileX, startBehaviourTileY, endBehaviorTileX, endBehaviorTileY) => {
        resetAllIgnorePositions();

        if (!ignoreUpdateCollisionAndStartEndPos) return;

        addIgnorePositions(this.startX, this.startY);
        addIgnorePositions(startBehaviourTileX, startBehaviourTileY);
        addIgnorePositions(endBehaviorTileX, endBehaviorTileY);

    }

    const startWalkBehavior = () => {
        let destinyData = getActualBehaviorDestinyData();
        let speedData = getActualBehaviorSpeedData();
        let pos = getRxRyFromSrajData({
            x: destinyData.x,
            y: destinyData.y
        });

        manageIgnorePositions(this.rx, this.ry, pos.rx, pos.ry);

        let tile = lookForFreeTile(pos.rx, pos.ry);

        if (!tile) {
            console.log('can crash?', tile);
            return;
        }

        this.destinyX = tile.x;
        this.destinyY = tile.y;

        if (speedData != null) setSpeed(speedData);

        searchPath({
            x: this.destinyX,
            y: this.destinyY
        });
    };

    const destinyIsBlock = () => {
        return checkCollision(this.destinyX, this.destinyY, true)
    };

    const lookForFreeTile = (xToCheck, yToCheck) => {
        if (!checkCollision(xToCheck, yToCheck, true)) return {
            x: xToCheck,
            y: yToCheck
        };

        let a = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1]
        ];

        for (let k in a) {
            let onePos = a[k];
            let x = xToCheck + onePos[0];
            let y = yToCheck + onePos[1];

            if (!checkCollision(x, y, true)) return {
                x: x,
                y: y
            };

        }

        errorReport('FakeNpc.js', "lookForFreeTile", "Can not find free tile for FakeNpc id: " + this.id);
        return null;
    };

    const checkCollision = (x, y, withoutError) => {
        let isCollision = Engine.map.col.check(x, y);

        if (isCollision) {
            let ignoreCollision = checkCollisionIsIgnore(x, y, isCollision);

            if (ignoreCollision) return false;
        }

        if (isCollision && !withoutError) errorReport('FakeNpc.js', "startWalkBehavior", "incorrect pos: " + this.destinyX + ', ' + this.destinyY + ' is collision! FakeNpc id: ' + this.id);

        return isCollision ? true : false;
    };

    const checkCollisionIsIgnore = (x, y, kindCollision) => {
        if (kindCollision != 2) return false;

        for (let i = 0; i < allIgnorePositions.length; i++) {
            let ignorePos = allIgnorePositions[i];
            if (ignorePos.x == x && ignorePos.y == y) return true;
        }

        return false;
    }

    const startIdleBehavior = () => {
        let durationData = behaviorManager.getActualBehaviorDurationData();
        let dirData = getActualBehaviorDirData();

        if (durationData != null) behaviorManager.setDuration(durationData);
        if (dirData != null) this.dir = dirData;
    }

    const startTpBehavior = () => {
        let tpData = getActualBehaviorTpData();

        this.tpX = tpData.x;
        this.tpY = tpData.y;
    }

    const clearStates = () => {
        this.destinyX = null;
        this.destinyY = null;
        this.tpX = null;
        this.tpY = null;
        //this.duration = 5;
        behaviorManager.setDuration(FakeNpcData.defaultData.BEHAVIOR_DURATION);
    }

    const afterLoadImage = () => {
        this.setOnloadProperImg(true)
    };

    const onUpdate = new(function() {
        this.id = function(val) {
            setId(val);
        };
        this.behavior = function(val) {
            behaviorManager.setBehaviorData(val);
            behaviorManager.setBehaviorList(prepareBehaviorList(copyStructure(val.list)));
            behaviorManager.setBehaviorRepeat(isset(val.repeat) ? val.repeat : FakeNpcData.defaultData.BEHAVIOR_REPEAT);


            //this.behavior 		= prepareBehaviorList(copyStructure(val.list));
            //this.behaviorRepeat = isset(val.repeat) ? val.repeat : FakeNpcData.defaultData.BEHAVIOR_REPEAT;
        };
        this.click = function(val) {
            this.clickData = val;
        };
        this.img = function(val, old) {
            setImg(val)
        };
        this.dir = function(val, old) {
            this.dir = val;
        };
        this.external_properties = function(val, old) {
            this.external_properties = val;
        };
        this.speed = function(val) {
            setSpeed(val);
        };
        this.instantCreateFadeIn = (val) => {
            if (val == true) self.warShadowOpacity = 1;
        };
        this.instantRemoveFadeOut = (val) => {
            setInstantFadeOut(val);
        };
    });

    const prepareBehaviorList = (behaviorList) => {
        let newBehaviorList = [];

        for (let k in behaviorList) {

            let oneBehavior = behaviorList[k];
            let name = oneBehavior.name;

            switch (name) {
                case FakeNpcData.behavior.WALK_START:
                    oneBehavior.name = FakeNpcData.behavior.WALK
                    oneBehavior.x = this.startX;
                    oneBehavior.y = this.startY;
                    newBehaviorList.push(oneBehavior)
                    break;
                case FakeNpcData.behavior.TP_START:
                    oneBehavior.name = FakeNpcData.behavior.TP
                    oneBehavior.x = this.startX;
                    oneBehavior.y = this.startY;
                    newBehaviorList.push(oneBehavior)
                    break;
                case FakeNpcData.behavior.WALK_AND_TP_START:
                    oneBehavior.name = FakeNpcData.behavior.WALK
                    newBehaviorList.push(oneBehavior);
                    newBehaviorList.push({
                        name: FakeNpcData.behavior.TP,
                        x: this.startX,
                        y: this.startY
                    });
                    break;
                default:
                    newBehaviorList.push(behaviorList[k]);
                    break;

            }
        }

        return newBehaviorList;
    }

    const setImg = (val) => {

        let v = RajGetSpecificData.getCharacterData(val);

        if (v == null) return;

        let path = CFG.r_opath + fixSrc(v);

        self.setPlaceHolderIcon();
        //self.setStaticAnimation(Engine.opt(8), Engine.hero.d.opt);
        self.setStaticAnimation(!isSettingsOptionsInterfaceAnimationOn());

        Engine.imgLoader.onload(path, {
                speed: true,
                externalSource: cdnUrl
            },
            (i, f) => {
                beforeOnload(f, i);
            },
            (i) => {
                afterLoadImage();
            },
            () => {
                self.fetchError();
            }
        );
    }

    const beforeUpdate = (data, old, allData, additionalData) => {
        if (data.behavior.randomFirstIndex) RajBehaviorCommons.updateRandomFirstIndex(data.behavior);

        let pos = getRxRyFromSrajData(data, additionalData);

        if (pos.rx == null) return;
        if (pos.ry == null) return;

        this.rx = pos.rx;
        this.ry = pos.ry;

        this.startX = this.rx;
        this.startY = this.ry;


        if (data.ignoreUpdateCollisionAndStartEndPos) {
            setIgnoreUpdateCollisionAndStartEndPos(true);
            addIgnorePositions(this.startX, this.startY)
        }

        if (checkCollision(this.startX, this.startY)) {
            console.log('can crash?')
            return
        }

        this.updateDataRajObject(data, additionalData);
    };

    const getRxRyFromSrajData = (data, additionalData) => {
        return {
            rx: RajGetSpecificData.getCharacterData(data.x, additionalData),
            ry: RajGetSpecificData.getCharacterData(data.y, additionalData)
        };
    };

    const animate = (dt) => {
        if (this.frames && this.frames.length > 1 && dt) {
            timePassed += dt * 100;
            if (this.frames[this.activeFrame].delay < timePassed) {
                timePassed = timePassed - this.frames[this.activeFrame].delay;
                this.activeFrame = (this.frames.length == this.activeFrame + 1 ? 0 : this.activeFrame + 1);
            }
        }
    };

    const afterUpdate = () => {

        this.d.x = this.rx;
        this.d.y = this.ry;

        behaviorManager.callBehavior();
        if (this.external_properties) serverRayControllerData(this.external_properties);
        if (this.clickData) this.onhover = onhover
    };

    const serverRayControllerData = (data) => {
        Engine.rajController.parseObject(data, false, {
            fakeNpcId: this.id
        });
    }

    const getOrder = () => {
        return this.ry + 0.1;
    };

    const onclick = (e) => {
        if (this.clickData) {
            if (isset(this.clickData.range)) {
                let range = this.clickData.range;
                let hero = Engine.hero;

                if (Math.abs(this.rx - hero.rx) <= range && Math.abs(this.ry - hero.ry) <= range) serverRayControllerData(this.clickData.external_properties);

            } else serverRayControllerData(this.clickData.external_properties);


        }

        return true;
    }

    const onhover = (e, show) => {
        //setCursor(show);
        getEngine().interface.setDialogueCursor(show);
    };

    //const setCursor = function (show) {
    //	const $GC 		= Engine.interface.get$GAME_CANVAS();
    //	const CURSOR 	= ColliderData.CURSOR;
    //
    //	if (show) 			$GC.addClass(CURSOR.DIALOGUE);
    //	else 				$GC.removeClass(`${CURSOR.DIALOGUE} ${CURSOR.ATTACK}`)
    //};

    const setBreakBehavior = (_breakBehavior) => {
        behaviorManager.setBreakBehavior(_breakBehavior);
    };

    const setNewBehaviourData = (_newBehaviourData) => {
        behaviorManager.setNewBehaviorData(_newBehaviourData);
    }

    const getInstantFadeOut = () => instantFadeOut;

    const setId = (_id) => {
        this.id = _id
    };
    const getId = () => {
        return this.id
    };

    const getNDir = () => {
        return this.dir;
    }

    //const getRajObject = () => rajObject;


    this.init = init;
    //this.getRajObject = getRajObject;
    this.onclick = onclick;
    //this.onhover = onhover;
    this.update = update;
    this.onUpdate = onUpdate;
    this.beforeUpdate = beforeUpdate;
    this.afterUpdate = afterUpdate;
    this.getOrder = getOrder;
    this.getInstantFadeOut = getInstantFadeOut;
    this.afterLoadImage = afterLoadImage;

    this.getId = getId;
    this.getNDir = getNDir;

    this.setBreakBehavior = setBreakBehavior;
    this.setNewBehaviourData = setNewBehaviourData;
    this.startBehavior = startBehavior;
    this.serverRayControllerData = serverRayControllerData;
    this.prepareBehaviorList = prepareBehaviorList;

};

FakeNpc.prototype = Object.create(Character.prototype);

FakeNpc.prototype.constructor = FakeNpc;

module.exports = FakeNpc;