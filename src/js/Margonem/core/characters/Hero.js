/**
 * Created by Michnik on 2015-09-14.
 */
var Character = require('@core/characters/Character');
//var DynamicLightCharacterManager = require('@core/night/DynamicLightCharacterManager');
var Input = require('@core/InputParser');
var Tpl = require('@core/Templates');
var Pet = require('@core/Pet');
var SearchPath = require('@core/searchPath/SearchPath');
var WhoIsHereGlow = require('@core/whoIsHere/WhoIsHereGlow2');
var ChangeOutfit = require('@core/ChangeOutfit');
var RoadDisplay = require('@core/searchPath/RoadDisplay');
var EmotionsData = require('@core/emotions/EmotionsData');
let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');
let HeroDirectionData = require('@core/characters/HeroDirectionData');
var TutorialData = require('@core/tutorial/TutorialData');
var ChatData = require('@core/chat/ChatData');
const ProfData = require('@core/characters/ProfData');
const MapAreaCordTriggerCaller = require('@core/map/mapAreaCordTrigger/MapAreaCordTriggerCaller');
const {
    showProfile,
    isMan
} = require('../HelpersTS');
const ColorInterfaceNotificationData = require('@core/colorInterfaceNotification/ColorInterfaceNotificationData');
const CharacterAura = require('@core/CharacterAura');
const {
    HeroData
} = require("@core/characters/HeroData");
//let ColliderData = require('@core/collider/ColliderData');

var Hero = function() {

    let moduleData = {
        fileName: "Hero.js"
    };
    var self = this;
    //var $stats = $('.extended-stats .stats-section');
    var $stats; // = Engine.interface.$iLayer.find('.extended-stats .stats-section');
    let $allStats = {};
    this.d = {};
    this.frame = 0;
    this.isPlayer = true;
    this.autoPath = SearchPath.getEmptyRoad();
    this.roadDisplay = new RoadDisplay();
    //this.cdir = '';
    this.markOtherObj = false;
    //this.refFollowObj = null;

    let refFollowObj;

    this.autoWalkLock = false;
    // this.canvasObjectType = 'Hero';
    this.canvasObjectType = CanvasObjectTypeData.HERO;
    this.overMouse = false;
    this.damageSum = '';
    this.stop = true;
    //this.onSelfEmoList = [];
    this.onSelfMarginEmo = 0;
    this.goldLimit = false;
    this.st;
    this.tutorialOrder = 0;
    this.waitForDialog = false;
    this.teleportLessThan5 = false;
    this.previewOutfit = false;
    this.previewOutfitTimeout = null;
    this.previewPetTimeout = null;

    let src

    let heroAlreadyInitialised = false;

    //this.startClickOnMapMove 	= false;
    let startClickOnMapMove;

    //this.afterFollowAction		= null;
    let afterFollowAction;

    this.outfitData = {
        original: null,
        preview: null
    }

    //let dynamicLightCharacterManager = null;

    //let dynamicHoleImg;

    //var speed = 4.5; //hero max speed 5.1 fields per second; optimal - 4.5
    var speed = 4.9; //hero max speed 5.1 fields per second; optimal - 4.5
    var rest = null;
    var timePassed = 0;
    var reached = false;
    var autoGW = null;
    var delayedPos = null;
    var expDiff = 0;
    var changeDir = false;
    var lastGTW = null;
    let idleTime = 0;

    let oldImg = null;

    var dirMapping = [HeroDirectionData.S, HeroDirectionData.W, HeroDirectionData.E, HeroDirectionData.N];

    //percent addon
    var lastExpGained = null;

    //percent addon

    var lastTTLAddon = null;
    var lastExpAddon = null;
    var lastLvlAddon = null;

    var prevexpAddon = 0;
    var nextexpAddon = 1;

    let mapAreaCordTriggerCaller = null;
    let stasisIncomingTimeout = null;
    this.tempPetObj = null;


    const setHeroAlreadyInitialised = () => {
        heroAlreadyInitialised = true;
    };

    const getHeroAlreadyInitialised = () => {
        return heroAlreadyInitialised;
    };

    const setStartClickOnMapMove = (state) => {
        startClickOnMapMove = state;
    };

    this.getStartClickOnMapMove = () => {
        return startClickOnMapMove;
    };

    const setAfterFollowAction = (_afterFollowAction) => {
        afterFollowAction = _afterFollowAction;
    };

    const setRefFollowObj = (_refFollowObj) => {
        refFollowObj = _refFollowObj;
    };

    this.dirMapping = () => {
        return dirMapping;
    }

    this.resetIdleTime = () => {
        this.setIdleTime(0);
        //if (Engine.questTrack) Engine.questTrack.clearAnim();
    }

    this.setIdleTime = (_idleTime) => {
        idleTime = _idleTime;
    }

    this.incrementIdleTimeByTd = (dt) => {
        idleTime += dt;
    }

    this.getIdleTime = () => {
        return idleTime;
    }

    this.update = function(dt) {

        if (!Engine.allInit) return

        this.changeWarShadowOpacity(dt);
        this.calculateNextStep();
        let lock = Engine.lock.check();
        if (!lock) Engine.map.centerOn(this.rx, this.ry);
        this.animate(dt);

        if (this.rx != this.d.x || this.ry != this.d.y) {
            this.resetIdleTime();

            if (Engine.canvasFocus.getActive()) Engine.tutorials.setPosition();
            if (!mobileCheck()) {
                Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 1);
            }
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 1);

            self.callCheckCanFinishExternalTutorialMove();

            this.move(dt);
            this.stop = false;
        } else {
            this.incrementIdleTimeByTd(dt);
            this.stop = true;
            if (this.dir != this.ndir) {
                this.frame = 0;
                if (!isset(this.ndir)) this.ndir = this.dir;
                else this.dir = this.ndir;
            }
        }
        if (isset(this.pet)) this.pet.update(dt);
        if (isset(this.whoIsHereGlow)) this.whoIsHereGlow.update();
        //if (Engine.questTrack && Engine.questTrack.activeTrack) Engine.questTrack.drawArrow(dt);
        if (!lock) Engine.map.centerOn(this.rx, this.ry);

        if (self.wanted) {
            self.wanted.update();
        }

        if (self.matchmakingChampionAura) {
            self.matchmakingChampionAura.update();
        }
    };


    this.callCheckCanFinishExternalTutorialMove = () => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.MOVE_REQUIRE,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            true
        );

        //Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
        Engine.rajController.parseObject(tutorialDataTrigger);
    };

    this.callCheckCanFinishExternalTutorialTalkNpc = (npcId) => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.TALK_NPC_ID,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            npcId
        );

        //Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
        Engine.rajController.parseObject(tutorialDataTrigger);
    };

    this.callCheckCanFinishExternalTutorialAttackNpc = (npcId) => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.ATTACK_NPC_ID,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            npcId
        );

        //Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
        Engine.rajController.parseObject(tutorialDataTrigger);
    };

    this.getAutoGw = function() {
        return autoGW;
    };

    this.isMan = () => {
        return isMan(this.d.gender);
    }

    this.setCorrectDir = function(dirMapping) {
        if (!this.stop || !isset(this.dir)) return false;
        return this.dir != dirMapping[this.d.dir];
    };

    this.move = function(dt) {
        const diffFrames = (Math.abs(this.rx - this.d.x) + Math.abs(this.ry - this.d.y));
        if (diffFrames > 1 && diffFrames <= 5) {
            this.teleportLessThan5 = true;
        }

        if (diffFrames > 5) { //teleport or something else which changes player position more that by 5 fields
            this.rx = this.d.x;
            this.ry = this.d.y;
            this.frame = 0;
            if (isset(this.pet)) this.pet.calculatePosition();
            this.updateCollider();
        } else {
            var l = speed * dt;
            this.run(l);

            if (autoGW) {
                clearInterval(autoGW);
                autoGW = null;
            }

            if (reached) {
                if (this.teleportLessThan5) {
                    if (isset(this.pet)) this.pet.calculatePosition();
                    this.teleportLessThan5 = false;
                }
                this.heroAtackOtherRequest();
                //this.checkAgressiveNpcs();
                this.locationInfo();
                reached = false;
                rest = Math.abs(this.rx - this.d.x) || Math.abs(this.ry - this.d.y);
                this.rx = this.d.x;
                this.ry = this.d.y;

                if (delayedPos) {
                    searchPath(delayedPos);
                    delayedPos = null;
                }

                if (this.calculateNextStep(rest)) {
                    this.run(rest);
                } else {
                    this.onPositionChange(this.d.x, this.d.y);
                }
                //API.callEvent('heroMove');
                mapAreaCordTriggerCaller.manageTileReach(this.d.x, this.d.y, Engine.mapAreaCordTriggerManager);
                API.callEvent(Engine.apiData.HERO_MOVE);
            }
            this.frame = this.d.x == this.rx && this.d.y == this.ry ? 0 : Math.floor((this.rx + this.ry) * 2) % 4;
        }
    };

    this.run = function(l) {
        if (this.rx < this.d.x) {
            this.rx += l;
            reached = (this.rx >= this.d.x);
        } else if (this.rx > this.d.x) {
            this.rx -= l;
            reached = (this.rx <= this.d.x);
        }

        if (this.ry < this.d.y) {
            this.ry += l;
            reached = (this.ry >= this.d.y);
        } else if (this.ry > this.d.y) {
            this.ry -= l;
            reached = (this.ry <= this.d.y);
        }
        Engine.map.setDirFromMousePosition();
        this.updateCollider();
    };

    this.autoGoTo = function(to, clickInMapCanvas) {
        if (blockMouseOnSpecificMap()) return mAlert(_t('block_mouse_move'));
        if (Engine.hero.rx != Engine.hero.d.x || Engine.hero.ry != Engine.hero.d.y) {
            if (!clickInMapCanvas) Engine.hero.blockMove = false;
            delayedPos = to;
        } else {
            if (!clickInMapCanvas) Engine.hero.blockMove = false;
            Engine.hero.searchPath(to);
        }
    };

    this.samePosWithHero = (x, y) => {
        return Math.floor(Engine.hero.rx) == Math.floor(x) && Math.floor(Engine.hero.ry) == Math.floor(y)
    }

    this.setInputParser = () => {
        Engine.inputParser = Input;
    };

    this.calculateNextStep = function(rest) {
        var steps = Engine.stepsToSend['steps'];
        var stepsL = Engine.stepsToSend['steps'].length;

        if (stepsL > 9) return false;
        if (this.rx != this.d.x || this.ry != this.d.y || Engine.lock.check()) return false;

        var nextStep = true;
        var nextX = this.d.x;
        var nextY = this.d.y;
        var dir = Input.getMoveDirection();

        if (dir) {
            this.clearAutoPathOfHero();
            //this.autoPath.clear();
            //switch (dir) {
            //	case 'W':
            //		if (this.dir == 'W') nextX = this.d.x - 1; else this.ndir = 'W';
            //		break;
            //	case 'E':
            //		if (this.dir == 'E') nextX = this.d.x + 1; else this.ndir = 'E';
            //		break;
            //	case 'N':
            //		if (this.dir == 'N') nextY = this.d.y - 1; else this.ndir = 'N';
            //		break;
            //	case 'S':
            //		if (this.dir == 'S') nextY = this.d.y + 1; else this.ndir = 'S';
            //		break;
            //}


            switch (dir) {
                case HeroDirectionData.W:
                    if (this.dir == HeroDirectionData.W) nextX = this.d.x - 1;
                    else this.ndir = HeroDirectionData.W;
                    break;
                case HeroDirectionData.E:
                    if (this.dir == HeroDirectionData.E) nextX = this.d.x + 1;
                    else this.ndir = HeroDirectionData.E;
                    break;
                case HeroDirectionData.N:
                    if (this.dir == HeroDirectionData.N) nextY = this.d.y - 1;
                    else this.ndir = HeroDirectionData.N;
                    break;
                case HeroDirectionData.S:
                    if (this.dir == HeroDirectionData.S) nextY = this.d.y + 1;
                    else this.ndir = HeroDirectionData.S;
                    break;
            }


        }

        if (this.blockMove && !rest) return false;

        if (this.autoPath.count() > 0) {
            var pos = this.autoPath.pop();
            dir = this.getDirectionFromNextPos(pos);
            this.ndir = this.dir;
            nextX = pos.x;
            nextY = pos.y;
        } else {
            this.doActionAfterFinishRoadOfSearchPath();
        }

        if (stepsL) {
            var check = steps[stepsL - 1].split(',');
            var xAbsDif = Math.abs(nextX - parseInt(check[0]));
            var yAbsDif = Math.abs(nextY - parseInt(check[1]));

            //if ((Math.abs(nextX - parseInt(check[0])) + Math.abs(nextY - parseInt(check[1]))) > 1) {

            if (xAbsDif + yAbsDif > 1) {
                nextStep = false;
                Engine.stepsToSend.reset(); //MLRESET
            }
        }

        if (nextStep && this.checkNextTileFromDirection(dir)) {
            //this.checkAgressiveNpcs();

            if (!Engine.map.gateways.getOpenGtwAtPosition(this.d.x, this.d.y)) this.autoWalkLock = false;

            if (this.d.x != nextX || this.d.y != nextY) this.nextStep(nextX, nextY);

            this.d.x = nextX;
            this.d.y = nextY;
            if (isset(this.pet)) this.pet.calculatePosition();
            return true;
        }
        return false;
    };

    this.getDirectionFromNextPos = function(pos) {
        var tempX = this.d.x - pos.x;
        var tempY = this.d.y - pos.y;
        var dir = null;
        if (tempX != 0) {
            //dir = tempX > 0 ? 'W' : 'E';
            dir = tempX > 0 ? HeroDirectionData.W : HeroDirectionData.E;
        } else if (tempY != 0) {
            //dir = tempY > 0 ? 'N' : 'S';
            dir = tempY > 0 ? HeroDirectionData.N : HeroDirectionData.S;
        }
        if (dir) this.dir = dir;
        return dir;
    };

    this.getRefFollowObj = () => {
        //return self.refFollowObj
        return refFollowObj
    };

    //this.addRefFollowObj = (_refFollowObj) => {
    //	//self.refFollowObj = refFollowObj
    //	refFollowObj = _refFollowObj
    //};

    this.clearRefFollowObj = () => {
        //this.refFollowObj.clearFollow();
        //this.refFollowObj = null;
        refFollowObj.getFollowController().clearFollowGlow();
        setRefFollowObj(null);
    };

    this.doActionAfterFinishRoadOfSearchPath = () => {
        //if (!this.startClickOnMapMove) return;
        //this.startClickOnMapMove = false;
        if (!startClickOnMapMove) return;
        setStartClickOnMapMove(false);

        //let afterFollowAction = this.afterFollowAction;
        //let lastClick = Engine.lastClickOnCanvas;
        let lastClick = getEngine().getLastClickOnCanvas();
        //let refFollowObj = Engine.hero.getRefFollowObj();

        if (!refFollowObj) return;
        if (afterFollowAction) {
            afterFollowAction();
            this.clearAfterFollowAction();
        } else {
            let far = refFollowObj.getFar();
            if (far) {
                this.clearAfterFollowAction();
                return
            }

            //if (refFollowObj.constructor.name !== 'Npc') return;
            // if (refFollowObj.canvasObjectType !== 'Npc') return;
            if (refFollowObj.canvasObjectType !== CanvasObjectTypeData.NPC) return;
            if (lastClick[0].type === "click") refFollowObj.onclick(lastClick[0]);
            if (lastClick[0].type === "contextmenu") refFollowObj.oncontextmenu(lastClick[0]);
        }


        // let lastClick = Engine.lastClickOnCanvas;
        // let afterFollowAction = this.afterFollowAction;
        // let list = Engine.renderer.getCollisionsAt(lastClick[1], lastClick[2]);
        //
        // for (let i = 0; i < list.length; i++) {
        // 	if (isset(list[i].gateways)) continue;
        // 	switch (list[i].constructor.name) {
        // 		case "Map":
        // 		case "Hero":
        // 		case "Pet":
        // 		case "mGateway":
        // 			break;
        // 		case "mItem":
        // 		case "Other":
        // 			if (afterFollowAction) {
        // 				afterFollowAction();
        // 				this.clearAfterFollowAction()
        // 			}
        // 			break;
        // 		case "Npc":
        // 			if (afterFollowAction) {
        // 				afterFollowAction();
        // 				this.clearAfterFollowAction()
        // 			} else {
        // 				if (lastClick[0].type == "click") list[i].onclick(lastClick[0]);
        // 				if (lastClick[0].type == "contextmenu") list[i].oncontextmenu(lastClick[0]);
        // 			}
        // 			break;
        // 		default:
        // 			console.warn('bad val', list[i].constructor.name);
        // 			break
        // 	}
        // }
    };

    this.addAfterFollowAction = (object, action) => {
        let far = object.getFar();
        let x = object.d.x;
        let y = object.d.y;

        if (object.getFollowController) object.getFollowController().addFollowGlow();

        if (far) {
            this.autoGoTo({
                x: x,
                y: y
            });
            //this.startClickOnMapMove = true;
            setStartClickOnMapMove(true);
            //this.afterFollowAction = action;
            setAfterFollowAction(action);
        } else {
            this.clearAfterFollowAction();
            action();
        }
    };

    this.clearAfterFollowAction = () => {
        //this.afterFollowAction = null;
        setAfterFollowAction(null);
        //if (this.refFollowObj) this.clearRefFollowObj();
        if (refFollowObj) this.clearRefFollowObj();
    };

    this.checkNextTileFromDirection = function(dir) {
        var pos = null;
        var cPos = { //current position
            x: Math.floor(this.rx),
            y: Math.floor(this.ry)
        };
        //switch (dir) {
        //	case 'N':
        //		pos = !Engine.map.col.check(cPos.x, cPos.y - 1);
        //		break;
        //	case 'S':
        //		pos = !Engine.map.col.check(cPos.x, cPos.y + 1);
        //		break;
        //	case 'W':
        //		pos = !Engine.map.col.check(cPos.x - 1, cPos.y);
        //		break;
        //	case 'E':
        //		pos = !Engine.map.col.check(cPos.x + 1, cPos.y);
        //		break;
        //}


        switch (dir) {
            case HeroDirectionData.N:
                pos = !Engine.map.col.check(cPos.x, cPos.y - 1);
                break;
            case HeroDirectionData.S:
                pos = !Engine.map.col.check(cPos.x, cPos.y + 1);
                break;
            case HeroDirectionData.W:
                pos = !Engine.map.col.check(cPos.x - 1, cPos.y);
                break;
            case HeroDirectionData.E:
                pos = !Engine.map.col.check(cPos.x + 1, cPos.y);
                break;
        }

        return pos;
    };

    this.nextStep = function(x, y) {
        Engine.stepsToSend.append({
            x: x,
            y: y
        });
        this.d.x = x;
        this.d.y = y;
    };

    this.animate = function(dt) {
        if (this.frames && this.frames.length > 1 && dt) {
            timePassed += dt * 100;
            if (this.frames[this.activeFrame].delay < timePassed) {
                timePassed = timePassed - this.frames[this.activeFrame].delay;
                this.activeFrame = (this.frames.length == this.activeFrame + 1 ? 0 : this.activeFrame + 1);
            }
        }
    };

    this.clearAnimationAndGw = function() {
        this.activeFrame = 0;
        timePassed = 0;
    };

    /**
     * Search for a path from hero position to destination and set mark on destination point
     * @param to destination point
     * @param to.x int destination x
     * @param to.y int destination y
     * @returns {Array} list of fields [{x:3,y:12}[,obj]] in path
     */
    var searchPath = function(to) {
        Engine.hero.autoPath.clear();
        self.roadDisplay.clear();
        //self.autoPath.clear();
        if (isNaN(to.x) || isNaN(to.y))
            return;
        //Engine.hero.startClickOnMapMove = true;
        //console.log('startClickOnMapMove');

        //let npcWithWalkover = Engine.npcs.getNpcWithWalkOverByCord(to.x, to.y);

        //if (npcWithWalkover) npcWithWalkover.addNpcCollision();

        self.autoPath = SearchPath.find(self, to);
        if (Engine.roadDisplay)
            self.roadDisplay.setRoad(self.autoPath);
        if (self.autoPath.count() > 0) {
            var entry = self.autoPath.get(0);
            getEngine().mapGoMark.createMapGoMark(entry.x, entry.y);
            //Engine.map.goMark = {
            //	time: (new Date()).getTime(),
            //	x: entry.x,
            //	y: entry.y
            //};
        }

        //if (npcWithWalkover) npcWithWalkover.deleteNpcCollision();
    };

    this.searchPath = searchPath;

    this.getHeroNode = () => {
        return SearchPath.map.getNode(Engine.hero.d.x, Engine.hero.d.y)
    }

    //this.beforeUpdate = function (data, old, allData) {
    //	if (data && isset(data.opt)) {
    //		if (!self.d) {
    //			self.d = {};
    //		}
    //
    //		self.d.opt = data.opt;
    //	}
    //};

    const updateNick = () => {
        const $heroName1 = Engine.interface.get$interfaceLayer().find('.heroname');
        const $heroName2 = Engine.interface.get$interfaceLayer().find('.hero-name-light-mode').find('.hero-name');

        let options = {
            showNick: true,
            nick: this.getNick(),
            level: this.getLevel(),
            prof: this.getProf(),
            operationLevel: this.getOperationLevel()
        };

        $heroName1.html(getCharacterInfo(options));
        addCharacterInfoTip($heroName1, options);

        $heroName2.html(getCharacterInfo(options));
        addCharacterInfoTip($heroName2, options);

        //$heroName.tip(tip);
    };

    this.afterUpdate = function(data, old, allData) {
        // Engine.map.centerOn(this.rx, this.ry); // probably unnecessary call to center on hero - fix for dialog teleport #19054

        //var tip = [_t('my_character', null, 'map')];
        if (data.hasOwnProperty('x') && data.hasOwnProperty('y')) Engine.miniMapController.updateWindowMiniMapHeroPos(data.x, data.y);

        if (data.nick) {
            updateNick();
            self.updateTip();
        }

        if ((data.back == 1) || ((old.x != this.d.x || old.y != this.d.y) && Engine.lock.check() && Engine.stepsToSend['steps'].length > 0)) {
            console.log('back');
            Engine.stepsToSend.reset(); //MLRESET
            this.clearAutoPathOfHero();
            //this.autoPath.clear();
            this.onPositionChange(data.x, data.y);
        } else {
            if (Engine.stepsToSend['steps'].length > 0 && (isset(data.x) && isset(data.y))) { // (isset(data.x) && isset(data.y) ---> fix Bug #16834
                if (Engine.stepsToSend.checkAndSlice({
                        x: this.d.x,
                        y: this.d.y
                    })) {
                    this.d.x = old.x;
                    this.d.y = old.y;
                } else {
                    var p0 = Engine.stepsToSend['steps'][0].split(',');
                    if ((Math.abs(p0[0] - this.d.x) + Math.abs(p0[1] - this.d.y) > 1)) {
                        Engine.stepsToSend.reset();
                        this.rx = this.d.x;
                        this.ry = this.d.y;
                        if (this.pet) this.pet.calculatePosition();
                    }
                }
            }
        }

        if (isset(allData.d) && isset(data.dir)) {
            //var dirMapping = ['S', 'W', 'E', 'N'];
            var dirMapping = [HeroDirectionData.S, HeroDirectionData.W, HeroDirectionData.E, HeroDirectionData.N];
            self.dir = dirMapping[data.dir];
            self.ndir = self.dir;
        }

        if (isset(data.warrior_stats) && isset(data.warrior_stats.hp)) {
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 19);
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 19);
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 19);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 19);
        }

        if (isset(data.lvl) && isset(old.lvl) && data.lvl !== old.lvl) {
            Engine.widgetManager.rebuildWidgetButtons();
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 16);
        }

        this.locationInfo();
        if (isset(this.petLock)) this.petLock.unlock('petUpdate');
        //if (self.d.ttl < 0) $('.exp-progress .progress').addClass('noexp');
        //else $('.exp-progress .progress').removeClass('noexp');

        let $expProgress = Engine.interface.get$interfaceLayer().find('.exp-progress .progress');
        let $expLightMode = Engine.interface.heroElements.get$expLightMode();
        let $expTopLightMode = Engine.interface.heroElements.get$expTopLightMode();

        if (self.d.ttl < 0) {
            $expProgress.addClass('noexp');
            $expLightMode.addClass('noexp');
            $expTopLightMode.addClass('noexp');
        } else {
            $expProgress.removeClass('noexp');
            $expLightMode.removeClass('noexp');
            $expTopLightMode.removeClass('noexp');
        }

        this.updateWhoIsHereGlow();
        updateDataMatchmakingChampion(data);
    };

    const updateDataMatchmakingChampion = (data) => {

        if (isset(data.matchmaking_champion) && data.matchmaking_champion == false) {
            if (self.matchmakingChampionAura) {
                removeMatchmakingChampionAura();
            }
            return;
        }

        if (self.wanted || data.wanted) {
            if (self.matchmakingChampionAura) {
                removeMatchmakingChampionAura();
            }
            return;
        }

        if (!self.matchmakingChampionAura && data.matchmaking_champion) {
            createMatchmakingChampionAura(this)
        }
    };

    const setSrc = (_src) => {
        src = _src;
    }

    const getSrc = () => {
        return src;
    }

    const removeMatchmakingChampionAura = () => {
        delete self.matchmakingChampionAura;
    };

    const createMatchmakingChampionAura = (parent) => {
        self.matchmakingChampionAura = new CharacterAura();
        self.matchmakingChampionAura.init(parent);
    };

    this.clearAutoPathOfHero = () => {
        //this.startClickOnMapMove = false;
        setStartClickOnMapMove(false);
        this.clearAfterFollowAction();
        this.autoPath.clear();
        this.roadDisplay.clear();
    };

    this.updateTip = function() {
        var tip = self.createStrTip();
        this.tip = [tip, 't_other'];
    };

    this.removeBless = function() {
        delete this.d.is_blessed;
        this.updateTip();
    };

    this.createStrTip = function() {
        let tip = '';
        let rankText = '';
        let uprawnienia = self.d.uprawnienia;
        if (uprawnienia) {
            let rank;
            if (uprawnienia & 1) rank = 0;
            else if (uprawnienia & 16) rank = 1;
            else if (uprawnienia & 2) rank = 2;
            else if (uprawnienia & 4) rank = 4;
            else if (uprawnienia & 8) rank = 5;
            else rank = 3;

            const ranks = [
                _t('admin', null, 'heroranks'),
                _t('super_mg', null, 'heroranks'),
                _t('mg', null, 'heroranks'),
                _t('chat_mod', null, 'heroranks'),
                _t('super_chat_mod', null, 'heroranks')
            ];

            if (isset(ranks[rank]) && ranks[rank] !== '') rankText = ` [${ranks[rank]}]`;
        }
        tip += `<div class="rank">${_t('my_character', null, 'map')}${rankText}</div>`;

        if (isset(self.d.guest) && parseInt(self.d.guest)) tip += '<div class="rank">' + _t('deputy') + '</div>';

        tip += self.setTipHeader();

        //if (isset(self.wanted) && parseInt(self.wanted) >= 90) tip += '<div class=wanted></div>'; //Poszukiwany<br/>listem goÅczym
        if (self.wanted) tip += '<div class=wanted></div>'; //Poszukiwany<br/>listem goÅczym
        //if (self.matchmaking_champion && (!self.wanted || parseInt(self.wanted) < 90)) tip += '<div class="matchmaking_champion"></div>';
        if (self.d.matchmaking_champion && !self.wanted) tip += '<div class="matchmaking_champion"></div>';
        if (self.d.clan) tip += '<div class="clan-in-tip">' + escapeHTML(self.d.clan.name) + '</div>'; // + '</div><div class="line"></div>';
        tip += self.setBuffsSections();

        var tipObj = {
            text: tip,
            object: self
        };
        //API.callEvent('afterCharacterTipUpdate', tipObj);
        API.callEvent(Engine.apiData.AFTER_CHARACTER_TIP_UPDATE, tipObj);
        return tipObj.text;
    };

    this.setTipHeader = function(o) {
        //var prof = isset(o.d.prof) ? o.d.prof : '';
        //let debug = (CFG.debug ? (' ' + o.d.id) : '');
        //var nick = '<div class="nick">' + o.nick + debug + ' (' + (o.getLevel ? o.getLevel() : o.lvl) + prof + ')' + '</div>';

        //let obj = o ? null : this;
        //let options = {showNick:true};
        //if (o) {
        //	options.nick 			= o.nick;
        //	options.level 			= o.d.lvl;
        //	options.prof 			= o.d.prof;
        //	options.operationLevel 	= 0
        //}

        let options = {
            showNick: true,
            nick: o ? o.nick : this.getNick(),
            level: o ? o.d.lvl : this.getLevel(),
            prof: o ? o.d.prof : this.getProf(),
            operationLevel: o ? 0 : this.getOperationLevel()
        };

        //let info = '<div class="nick">' + getCharacterInfo(obj, options) + '</div>';
        let info = '<div class="nick">' + getCharacterInfo(options) + '</div>';

        return '<div class="info-wrapper">' + info + '</div>';
    };

    this.updateWhoIsHereGlow = function() {
        //self.whoIsHere = '#ff0000';
        if (self.whoIsHere && !isset(self.whoIsHereGlow) && self.imgLoaded) {
            self.whoIsHereGlow = new WhoIsHereGlow();
            self.whoIsHereGlow.createObject(self);
            self.whoIsHereGlow.updateColor(self.whoIsHere);
        }
    };

    this.setBuffsSections = function() {
        var buffs = '';
        var bless = isset(self.d.is_blessed) && self.d.is_blessed ? '<div class="bless"></div>' : '';
        var mute = self.d.attr & 1 ? '<div class="mute"></div>' : '';
        var kB = isset(self.d.vip) && self.d.vip == '1' ? '<div class="k-b"></div>' : '';
        var warn = self.d.attr & 2 ? '<div class="warn"></div>' : '';
        var line = self.d.clan ? '<div class="line"></div>' : '';
        var wanted = self.d.wanted ? '<div class="wanted-i"></div>' : '';
        var matchmaking_champion = self.d.matchmaking_champion ? '<div class="matchmaking_champion-i"></div>' : '';

        if (bless != '' || mute != '' || kB != '' || warn != '' || wanted != '' || matchmaking_champion != '') buffs = '<div class="buffs-wrapper">' + line + wanted + bless + mute + kB + warn + matchmaking_champion + '</div>';

        return buffs;
    };

    this.updateGainedExp = function(d) {
        if (d && d.exp && self.getLevel()) {
            if (lastExpGained !== null) {
                var diff = d.exp - lastExpGained;
                if (diff !== 0) { // if not same (eg. reload)
                    self.showGainedExp(diff, self.getLevel());
                }
            }
            lastExpGained = d.exp;
        }
    };

    this.showGainedExp = function(val, lvl) {
        const $indicator = Engine.interface.get$interfaceLayer().find('.gained-exp-indicator');
        const $indicatorLightMode1 = Engine.interface.get$interfaceLayer().find('.top.positioner').find('.gained-exp-indicator-light-mode');
        var nextexp = Math.round(Math.pow(lvl, 4) + 10);
        var prevexp = Math.round(Math.pow(lvl - 1, 4) + 10);
        if (lvl == 1) {
            prevexp = 0;
        }
        var percentExp = val / (nextexp - prevexp);
        var perc = Math.round(percentExp * 10000) / 100;
        var txt = (val > 0 ? "+" : "-") + round(val) + " (" + Math.abs(perc) + "%)";
        var txt2 = (val > 0 ? "+" : "-") + round(val) + " (" + Math.abs(perc) + "%)";
        //$('.gained-exp-indicator').finish().text(txt);
        //$('.gained-exp-indicator').show().delay(3000).fadeOut();
        if (val > 0) {
            $indicator.css('color', 'lime');
            $indicatorLightMode1.css('color', 'lime');
        } else {
            $indicator.css('color', 'orangered');
            $indicatorLightMode1.css('color', 'orangered');
        }
        $indicator.finish().text(txt);
        $indicatorLightMode1.finish().text(txt2);
        $indicator.show().delay(3000).fadeOut();
        $indicatorLightMode1.show().delay(3000).fadeOut();
    };

    this.showDifference = ($wrapper, newValue, oldValue) => {
        if (!oldValue || newValue === oldValue) return;

        let diff = formNumberToNumbersGroup(newValue - oldValue);
        let txt;
        const $el = $('<div>', {
            class: 'diff-msg'
        });
        if (newValue > oldValue) {
            txt = '+' + diff;
            $el.css('color', 'lime');
        } else {
            txt = diff;
            $el.css('color', 'orangered');
        }
        $el.text(txt);
        $wrapper.prepend($el);
        $el.delay(3000).fadeOut(() => $el.remove());
    }
    /*
    	this.afterFetch = function (f, path) {
    		//var i = new Image();
    		//i.src = (IE ? CFG.opath + val : f.img);
    		//self.fw = f.hdr.width / 4;
    		//self.fh = f.hdr.height / 4;
    		//self.halffw = self.fw / 2;
    		//self.halffh = self.fh / 2;
    		//self.frames = f.frames;
    		//self.activeFrame = 0;
    		//self.sprite = i;
    		//self.updateCollider();
    		//i.onload = function () {
    		//	//self.imgLoaded = true;
    		//	//delete self.whoIsHereGlow; // delete for update height
    		//	//self.updateWhoIsHereGlow();
    		//	self.afterLoadImage()
    		//};

    		Engine.imgLoader.onload(path, f,
    			(i) => {
    				this.beforeOnload(f, i);
    			},
    			(i) => {
    				this.afterLoadImage();
    			}
    		);
    	};
    */
    this.beforeOnload = (f, i) => {
        const
            fw = f.hdr.width / 4,
            fh = f.hdr.height / 4;

        const outfitData = {
            kind: 'original',
            fw,
            fh,
            halffw: fw / 2,
            halffh: fh / 2,
            frames: f.frames,
            activeFrame: 0,
            sprite: i
        }

        this.setOutfitData(outfitData);
        this.updateCollider();
    };

    this.afterLoadImage = () => {
        this.setOnloadProperImg(true)
        delete self.whoIsHereGlow; // delete for update height
        self.updateWhoIsHereGlow();
    };

    const updateFilterImage = (withoutFilter = false) => {
        this.sprite = getEngine().canvasFilter.updateFilter(getSrc(), this.sprite, true, withoutFilter);
    }

    /**
     * Update field callbacks (data from json)
     */
    this.onUpdate = new(function() {
        this.id = function() {
            Engine.loader.load('hero');
        };
        this.dir = function(_dir) {
            if (_dir == -1) {
                debugger
            }
            this.dir = dirMapping[_dir];
        };

        this.lvl = function(val, old) {
            if (val && old && val > old) {
                //if (mobileCheck() && val > 20) window.location.reload();
                Engine.banners.update(true);
            }
            Engine.hero.oldLvl = old;
            self.setLowLvlClass(val);
            Engine.itemsMarkManager.heroLvlChanged(val);
        };
        this.img = function(val, old, allData) {
            if (val == old) return;

            //let path  = /http/.test(val) ? val : CFG.r_opath + val;
            //let v     = isset(allData) ? allData.opt : self.d.opt;

            if (Engine.hero.d.img != null) oldImg = Engine.hero.d.img;

            let path;
            //let v;
            let o = {
                speed: true
            };

            if (allData.hasOwnProperty('insecureSource')) {
                path = val;
                //v       = self.d.opt;
                o['insecureSource'] = true
            } else {
                path = CFG.r_opath + fixSrc(val);
                //v       = allData.opt;
                o['externalSource'] = cdnUrl;
            }

            //if (/http/.test(val)) {           // exception!! Outfit from console. Example: "outfit http://www.margonem.pl/obrazki/postacie/paid/panna-mloda01.gif"
            //	path    = val;
            //	v       = self.d.opt;
            //	o['insecureSource'] = true
            //} else {
            //	path    = CFG.r_opath + val;
            //	v       = allData.opt;
            //	o['externalSource'] = cdnUrl;
            //}

            self.setPlaceHolderIcon();
            //self.setStaticAnimation(Engine.opt(8, v));
            self.setStaticAnimation(!isSettingsOptionsInterfaceAnimationOn());
            // console.log('hero', path)

            setSrc(path);

            Engine.imgLoader.onload(path, o,
                (i, f) => {
                    self.beforeOnload(f, i);
                },
                (i) => {
                    updateFilterImage();
                    self.afterLoadImage();
                },
                () => {
                    self.fetchError();
                }
            );

            //Gif.fetch(path, true, function (f) {
            //	self.afterFetch(f, path);
            //}, function () {
            //	self.fetchError();
            //});
        };
        this.x = function(val, old) {
            this.lastServerX = val;
            if (typeof(old) == 'undefined') self.rx = val;
            //Engine.miniMapController.updateWindowMiniMapHeroPos(val, false);
        };
        this.y = function(val, old) {
            this.lastServerY = val;
            if (typeof(old) == 'undefined') self.ry = val;
            //Engine.miniMapController.updateWindowMiniMapHeroPos(false, val);
        };
        this.pvp = function(val, old) {
            //var $switch = $('.pvp-btn');
            var $switch = Engine.interface.get$interfaceLayer().find('.pvp-btn');
            if (val == 1) $switch.addClass('fight');
            else $switch.removeClass('fight');
        };
        /*
        this.cur_skill_set = function (val) {
        	self.cur_skill_set = val;
        	var $class = 'skill-switch';
        	$class += ' skill-set-' + Engine.hero.cur_skill_set;
        	//$('.skill-switch').attr('class', $class);
        	Engine.interface.get$interfaceLayer().find('.skill-switch').attr('class', $class);
        };
        this.cur_battle_set = function (v) {
        	Engine.interface.setActiveInBattleSet(v);
        };
        */
        this.credits = function(val) {
            this.showDifference(Engine.interface.get$interfaceLayer().find('.herocredits-difference'), val, Engine.hero.d.credits);

            const precise = val.toString().length > 9 ? 4 : 10;
            const credits = round(val, precise);
            const $heroCredits = Engine.interface.get$interfaceLayer().find('.herocredits');
            const tip = _t('dragonites') + ' ' + credits;

            $heroCredits.html(credits);
            $heroCredits.tip(_t('dragonites') + ' ' + credits);

            if (Engine.premium) {
                Engine.premium.updateSl();
            }

            Engine.interface.updateCredits(self.getParseGold(val), tip);
        };
        this.mails = function(val) {
            Engine.interface.mailsElements.mailsRefresh(val);
        };
        this.mails_all = function(val) {
            Engine.interface.mailsElements.newMail(val);
        };
        this.mails_last = function(val) {
            Engine.interface.mailsElements.setRecipient(val);
        };
        this.daily_bonus = function() {
            //Interface.showLoggedPriceNotif();
        };
        this.gold = function(val) {
            this.showDifference(Engine.interface.get$interfaceLayer().find('.herogold-difference'), val, Engine.hero.d.gold);

            let v = self.getParseGold(val);
            //Engine.interface.get$interfaceLayer().find('.herogold').html(v);
            self.updateGoldTip(_t('gold') + ': ' + round(val, 10), 'gold')

            Engine.interface.updateGold(v);
        };
        this.clan = function(val) {
            //var v = parseInt(val) ? 1 : 0;
            //Engine.chat.setVisibleCard(1, 1);
            Engine.chatController.getChatChannelsAvailable().setAvailable(ChatData.CHANNEL.CLAN, true);
        };
        this.goldlim = function(val) {
            var str = _t('goldlimit', null, 'player');
            //$('#herogold').concatTip(str + ' ' + round(val, 10));
            //Engine.interface.get$interfaceLayer().find('.herogold');
            self.updateGoldTip(str + ' ' + round(val, 10), 'goldLimit')
        };
        this.nick = function(val, old, data) {
            //const lvl = data.lvl || self.getLevel();
            //const prof = data.prof || self.d.prof;
            //const tip = `${_t('hero_name')}: ${val}</br>${_t('hero_lvl')} ${lvl}</br>${_t('prof')}: ${getAllProfName(prof)}`;
            //const $heroname = Engine.interface.get$interfaceLayer().find('.heroname');
            //$heroname.html(`${val} (${lvl}${prof})`);
            //$heroname.tip(tip);
            self.nick = val;
        };
        this.prof = function(val) {
            // Engine.interface.get$interfaceLayer().find('.hero_class').removeClass('w p b h t m').addClass(val).tip(getAllProfName(val));
        };
        this.hp = function(val, old, data) {
            var mHp = data.maxhp;
            var hp = data.hp;
            var percent = parseFloat(hp) / parseFloat(mHp);

            const ACTION = ColorInterfaceNotificationData.ACTION;
            const LOW_HEALTH = ColorInterfaceNotificationData.NAME.LOW_HEALTH;
            const action = percent < 0.3 ? ACTION.SHOW : ACTION.HIDE;

            getEngine().colorInterfaceNotificationManager.updateData({
                action: action,
                id: LOW_HEALTH
            });

            Engine.interface.heroElements.setHp(val, mHp || self.d.maxhp);
            Engine.itemsMarkManager.heroHpChanged(percent);
        };
        this.exp = function(val, old, data) {
            if (lastExpGained == null) lastExpGained = val;
            var nextexp = Math.round(Math.pow(data.lvl, 4) + 10);
            var prevexp = Math.round(Math.pow(data.lvl - 1, 4) + 10);

            if (data.lvl == 1) prevexp = 0;
            Engine.interface.heroElements.checkAndSetEndGamePanel(data.lvl);
            var exp = Math.min(Math.max((data.exp - prevexp) / (nextexp - prevexp), 0.001), 1);
            Engine.interface.heroElements.setXp(exp, val, nextexp, prevexp, data.lvl);

            var d = nextexp - prevexp;
            if (d == 0) d = 1;

            var pexp = (val - prevexp) / d;
            if (pexp > 1) pexp = 1;
            if (pexp < 0) pexp = 0;
            pexp = Math.round(pexp * 10000);

            var ppexp = pexp % 100;
            var pcexp = (pexp - ppexp) / 100;
            if (ppexp < 10) ppexp = '0' + ppexp;
            //$('.pointer-exp').text(pcexp + "," + ppexp + "%");
            Engine.interface.get$interfaceLayer().find('.pointer-exp').text(pcexp + "," + ppexp + "%");


            self.updateGainedExp(data);
        };
        this.ac = function(v) {
            self.updateStat('armor-class', v);
            //$('.stats-list .defence .value').text(v);
            Engine.interface.get$interfaceLayer().find('.stats-list .defence .value').text(formNumberToNumbersGroup(v));
        };
        this.sa = function(v) {
            self.updateStat('speed-attack', v);
            Engine.interface.get$interfaceLayer().find('.stats-list .attack-speed .value').text(v);
        };
        this.st = function(v) {
            self.updateStat('strength', v);
        };
        this.ag = function(v) {
            self.updateStat('dexterity', v);
        };
        this.it = function(v) {
            self.updateStat('intelligence', v);
        };
        this.crit = function(v) {
            self.updateStat('crit-chance', v, '%');
        };
        this.critval = function(v) {
            self.updateStat('crit-power', Math.round(v * 100), '%');
        };
        this.pttl = function(v) {
            //$('[data-herostat="stamina"]').tip(v);
            // Engine.interface.get$interfaceLayer().find('[data-herostat="stamina"]').tip(v);
        };
        this.ttl_value = function(v) {
            //$('[data-herostat="stamina"]').tip(_t('limit_on_day', {'%val%': Math.round(v / 60)}));
            // Engine.interface.get$interfaceLayer().find('[data-herostat="stamina"]').tip(_t('limit_on_day', {'%val%': Math.round(v / 60)}));
        };
        this.ttl_end = function(val, old, data) {
            if (Engine.staminaShop && val != 0) {
                Engine.staminaShop.updateDescription(val, data.ttl_del);
            }
        };
        this.attack = function(v) {
            let poisonValue = 0;
            const range = v.range;
            for (const k in v) {
                if (k === HeroData.ATTACK_TYPES.RANGE) continue;

                const damage = v[k];
                const isMinMax = isset(damage.min) && isset(damage.max);
                const txt = isMinMax ? `${formNumberToNumbersGroup(damage.min)} - ${formNumberToNumbersGroup(damage.max)}` : formNumberToNumbersGroup(damage);
                const updateOpts = {
                    formNumber: false
                };
                const averageDamage = isMinMax ? Math.round((damage.min + damage.max) / 2) : damage;
                switch (k) {
                    case 'physicalMainHand':
                        const isDistance = range === HeroData.ATTACK.RANGE.DISTANCE;
                        const tip = isDistance ? 'herostat-tip-damage-normal-distance' : 'herostat-tip-damage-normal';
                        updateOpts.statName = isDistance ? _t('stat-damage-distance') : _t('stat-damage-normal');
                        self.updateStat('damage-normal', txt, null, null, _t(tip), updateOpts);
                        self.damageSum += self.createDmgStat(averageDamage);
                        break;
                    case 'physicalOffHand':
                        self.updateStat('damage-offhand', txt, null, null, null, updateOpts);
                        self.damageSum += self.createDmgStat(averageDamage, 'orange');
                        break;
                    case 'lightning':
                        self.updateStat('damage-lightning', txt, null, null, null, updateOpts);
                        self.damageSum += self.createDmgStat(averageDamage, 'yellow');
                        break;
                    case 'fire':
                        self.updateStat('damage-fire', txt, null, null, null, updateOpts);
                        self.damageSum += self.createDmgStat(averageDamage, 'red');
                        break;
                    case 'frost':
                        self.updateStat('damage-cold', txt, null, null, null, updateOpts);
                        self.damageSum += self.createDmgStat(averageDamage, 'blue');
                        break;
                    case 'poisonMainHand':
                        $stats.find('.poison-header').css('display', 'block');
                        self.updateStat('poison1', txt, null, null, null, updateOpts);
                        poisonValue += averageDamage;
                        break;
                    case 'poisonOffHand':
                        $stats.find('.poison-header').css('display', 'block');
                        self.updateStat('of_poison1', txt, null, null, null, updateOpts);
                        poisonValue += averageDamage;
                        break;
                    default:
                        console.log(`Error: "${k}" attack stat is not exist.`);
                }
            }
            if (poisonValue) {
                self.damageSum += self.createDmgStat(poisonValue, 'green');
            }

        };

        this.fatigs = function(v) {
            for (const k in v) {
                const values = v[k];
                const params = {
                    '%power%': values.power,
                    '%chance%': values.chance
                };
                const txt = _t(`stat-fatigs-${k}`, params);
                const updateOpts = {
                    formNumber: false
                };
                switch (k) {
                    case 'mana':
                        self.updateStat('fatigs-mana', txt, null, null, _t('herostat-tip-fatigs-mana', params), updateOpts);
                        break;
                    case 'energy':
                        self.updateStat('fatigs-energy', txt, null, null, _t('herostat-tip-fatigs-energy', params), updateOpts);
                        break;
                    default:
                        console.log(`Error: "${k}" fatigs stat is not exist.`);
                }
            }
        };

        this.uprawnienia = function(v) {
            const margoConsole = Engine.console;

            margoConsole.initCrazyButton();
            if (!v) {
                return
            }

            margoConsole.setVisibleOnSizeButton();
            margoConsole.initCommandButton();
            margoConsole.initCSSThemeButton();
            getEngine().cssLoader.updateData();
        };
        this.poison0 = function(v) {
            $stats.find('.poison-header').css('display', 'block');
            self.updateStat('poison0', roundNumber(v / 100, 2));
        };

        this.wound0 = function(v) {
            $stats.find('.wound-header').css('display', 'block');
            self.updateStat('wound0', v, '%');
        };
        this.wound1 = function(v) {
            $stats.find('.wound-header').css('display', 'block');
            self.updateStat('wound1', Math.round(v));
        };
        this.of_wound0 = function(v) {
            $stats.find('.wound-header').css('display', 'block');
            self.updateStat('of_wound0', v, '%');
        };
        this.of_wound1 = function(v) {
            $stats.find('.wound-header').css('display', 'block');
            self.updateStat('of_wound1', Math.round(v));
        };
        this.manadest = function(v) {
            self.updateStat('manadest', v);
        };
        this.endest = function(v) {
            self.updateStat('endest', v);
        };
        this.acdmg = function(v) {
            self.updateStat('acdmg', v);
        };
        this.slow = function(v) {
            self.updateStat('slow', roundNumber(v / 100, 2));
        };
        this.lowevade = function(v) {
            self.updateStat('lowevade', v);
        };
        this.acmdmg = function(v) {
            self.updateStat('acmdmg', v, '%');
        };
        this.energygain = function(v) {
            self.updateStat('energygain', v);
        };
        this.managain = function(v) {
            self.updateStat('managain', v);
        };
        this.lowcrit = function(v) {
            self.updateStat('lowcrit', v);
        };
        this.critmval_c = function(v) {
            self.updateStat('mcrit-cold', Math.round(v * 100), '%');
        };
        this.critmval_f = function(v) {
            self.updateStat('mcrit-fire', Math.round(v * 100), '%');
        };
        this.critmval_l = function(v) {
            self.updateStat('mcrit-lightning', Math.round(v * 100), '%');
        };

        this.of_crit = function(v) {
            self.updateStat('helper-crit-chance', v, '%');
        };
        this.of_critval = function(v) {
            self.updateStat('helper-crit-power', Math.round(v * 100), '%');
        };
        this.critmval = function(v) {
            self.updateStat('magic-crit-power', v);
        };
        this.mana = function(v) {
            self.updateStat('mana', v);
        };
        this.energy = function(v) {
            self.updateStat('energy', v);
        };
        this.evade = function(v) {
            //var percentage = ' (' + Math.min(50, Math.round(40 * v / self.d.lvl)) + '%)';
            //if (_l() == 'en') {
            //	if (Engine.worldname == "dev") {
            //		self.updateStat('evade', v[0], ' (' + v[1] + '%)', false, _t('evade_change', {'%val%' : 50}));
            //	} else {
            //		var percentage = ' (' + Math.min(50, Math.round(40 * v / self.d.lvl)) + '%)';
            //		self.updateStat('evade', v, percentage);
            //	}
            //} else {
            self.updateStat('evade', v[0], ' (' + v[1] + '%)', false);
            //}
        };
        //this.block = function (v) {
        this.blok = function(v) {
            var val = Math.round(20 * v / Math.min(self.getLevel(), 300));
            var percentage = ' (' + (val > 50 ? 50 : val) + '%)';
            self.updateStat('block', v, percentage);
        };
        this.act = function(v) {
            self.updateStat('res-poison', v, '%');
            Engine.interface.get$interfaceLayer().find('.stats-list .resists .js-res-poison').html(v);
        };
        this.resfire = function(v) {
            self.updateStat('res-fire', v, '%');
            Engine.interface.get$interfaceLayer().find('.stats-list .resists .js-res-fire').html(v);
        };
        this.resfrost = function(v) {
            self.updateStat('res-cold', v, '%');
            Engine.interface.get$interfaceLayer().find('.stats-list .resists .js-res-frost').html(v);
        };
        this.reslight = function(v) {
            self.updateStat('res-lightning', v, '%');
            Engine.interface.get$interfaceLayer().find('.stats-list .resists .js-res-light').html(v);
        };
        this.honor = function(v) {
            self.updateStat('honor-points', v);
        };
        this.runes = function(v) {
            self.updateStat('dragonite-tmp', v);
        };
        this.ttl = function(v) {
            var val = Math.max(v, 0);
            self.updateStat('stamina', val);
            //$('.pointer-ttl').text(val + " min");
            Engine.interface.get$interfaceLayer().find('.pointer-ttl').text(val + " min");
        };
        this.absorb = function(v) {
            self.updateStat('absorb', v);
        };
        this.absorbm = function(v) {
            self.updateStat('absorbm', v);
        };
        this.heal = function(v) {
            self.updateStat('heal', v);
        };
        this.wanted = function(v) {
            if (v) {

                if (!self.wanted) {
                    self.wanted = new CharacterAura();
                    self.wanted.init(self, 1);
                }

            } else {
                self.wanted = null;
            }

        };
        //this.matchmaking_champion = function (v) {
        //	self.matchmaking_champion = v;
        //};
        this.whoIsHere = function(val) {
            self.whoIsHere = val;
            if (self.whoIsHereGlow) self.whoIsHereGlow.updateColor(self.whoIsHere);
        };
        this.preview_acc = function(v) {
            self.previewAcc = v;
        };
        this.guest = function(v) {
            // for MuteLog addon, if guest -> MuteLog off
        };
        this.warrior_stats = function(v) {
            $stats.find('.warrior-stats').css('display', 'none');
            $stats.find('.wound-header').css('display', 'none');
            $stats.find('.poison-header').css('display', 'none');
            //$('.legends .nolegbon-tmp').css('display', 'block');
            //$('.legends .bonuses').find('.one-legend-bonus').remove();
            Engine.interface.get$interfaceLayer().find('.legends .nolegbon-tmp').css('display', 'block');
            Engine.interface.get$interfaceLayer().find('.legends .bonuses').find('.one-legend-bonus').remove();
            var key = 'onUpdate';
            self.damageSum = '';
            for (var k in v) {
                if (this[key][k]) this[key][k](v[k], self.d[k], v);
            }
            //$('.stats-list .attack .value').text(self.damageSum);
            Engine.interface.get$interfaceLayer().find('.stats-list .attack .value').html(self.damageSum);
            //this.updateStatsScrollbar();
        };
        this.passive_stats = function(v) {
                $stats.find('.passive-stats, .passive-stats-header').css('display', 'none');
                if (v !== null) $stats.find('.passive-stats-header').css('display', 'block');

                const passiveStat = (v, prevObjName = '') => {
                    for (const k in v) {
                        if (typeof v[k] === 'object') {
                            passiveStat(v[k], k);
                            continue;
                        }
                        const statName = (prevObjName ? prevObjName + '-' : '') + k;
                        const unit = self.getUnit(statName);
                        self.updateStat(statName, v[k], unit);
                    }
                }
                passiveStat(v);
            },
            this.legbon_verycrit = function(v) {
                self.updateLegendStat('legbon_verycrit', v);
            };
        this.legbon_holytouch = function(v) {
            self.updateLegendStat('legbon_holytouch', v);
        };
        this.legbon_holytouch_hp = function(v) {
            self.updateLegendStat('legbon_holytouch_hp', v);
        };
        this.legbon_curse = function(v) {
            self.updateLegendStat('legbon_curse', v);
        };
        this.legbon_glare = function(v) {
            self.updateLegendStat('legbon_glare', v);
        };
        this.legbon_cleanse = function(v) {
            self.updateLegendStat('legbon_cleanse', v);
        };
        this.legbon_lastheal = function(v) {
            self.updateLegendStat('legbon_lastheal', v);
        };
        this.legbon_critred = function(v) {
            self.updateLegendStat('legbon_critred', v);
        };
        this.legbon_facade = function(v) {
            self.updateLegendStat('legbon_facade', v);
        };
        this.legbon_anguish = function(v) {
            self.updateLegendStat('legbon_anguish', v);
        };
        this.legbon_retaliation = function(v) {
            self.updateLegendStat('legbon_retaliation', v);
        };
        this.legbon_puncture = function(v) {
            self.updateLegendStat('legbon_puncture', v);
        };
        this.legbon_frenzy = function(v) {
            self.updateLegendStat('legbon_frenzy', v);
        };
        this.legbon_resgain = function(v) {
            self.updateLegendStat('legbon_resgain', v);
        };
        this.legbon_dmgred = function(v) {
            self.updateLegendStat('legbon_dmgred', v);
        };
        this.stasis_incoming_seconds = (v, old, allData) => {
            self.stasisIncomingInfo(v);
            self.setStasisEmo(v, allData, true);
        }
        this.stasis = function(v, old, allData) {
            self.setStasisOverlay(v);
            self.setRequestDiff(v);
            if (v && v !== old) {
                self.stasisNotif(v);
            }

            self.setStasisEmo(v, allData);
        };
    })();

    this.setStasisEmo = (v, allData, incoming = false) => {
        let id = self.d.id ? self.d.id : allData.id;
        let e = Engine.emotions;
        let STASIS = incoming ? EmotionsData.NAME.STASIS_INCOMING : EmotionsData.NAME.STASIS;
        if (v > 0) e.updateData([{
            name: STASIS,
            source_id: id,
            source_type: EmotionsData.OBJECT_TYPE.HERO
        }]);
        else e.removeEmotionBySourceIdAndEmoType(id, STASIS);
    }

    this.createDmgStat = (value, cls, separator = '+') => {
        const symbol = self.damageSum ? separator : '';
        const dmgEl = Tpl.get('stat')[0];
        dmgEl.classList.add(cls);
        dmgEl.innerText = symbol + value;
        return dmgEl.outerHTML;
    };

    this.setStasisOverlay = (v) => {
        if (v) {
            Engine.interface.get$gameLayer().find('.stasis-overlay').show();
        } else {
            Engine.interface.get$gameLayer().find('.stasis-overlay').hide();
        }
    };

    this.stasisIncomingInfo = (v) => {
        let countdown = v;
        const $stasisIncomingLayer = Engine.interface.get$gameLayer().find('.stasis-incoming-overlay');
        const $stasisIncomingText = $stasisIncomingLayer.find('.stasis-incoming-overlay__text');
        const intervalFn = () => {
            $stasisIncomingText.html(_t('stasis-incoming', {
                '%val%': countdown--
            }));
            if (countdown === 0) {
                removeInterval();
            }
        };
        const removeInterval = () => {
            if (stasisIncomingTimeout) clearInterval(stasisIncomingTimeout);
        }

        removeInterval();

        if (v) {
            intervalFn();
            stasisIncomingTimeout = setInterval(intervalFn, 1000);
            $stasisIncomingLayer.show();
        } else {
            $stasisIncomingLayer.hide();
        }
    };

    this.checkStasis = () => {
        return self.d.stasis
    }

    this.setRequestDiff = function(v) {
        if (v) {
            Engine.idleJSON.setStasisDiff();
        } else {
            Engine.idleJSON.setDefaultDiff();
        }
    };

    this.stasisNotif = (v) => {
        var sm = Engine.soundManager;
        if (sm && v && sm.getStateSoundNotifById(8)) sm.createNotifSound(9);
    };

    this.getParseGold = (val) => {
        var precise = val.toString().length > 9 ? 12 : 10;
        var sep = val.toString().length > 9 ? '.' : ' ';
        return round(val, precise, sep, 3);
    };

    this.updateGoldTip = function(content, type) {
        const $tipTpl = Tpl.get('herogold-tip');
        const goldComponent = Engine.interface.getGoldCostComponent();
        const $costElement = $(goldComponent.getElement());

        if (type == 'gold') {
            $tipTpl.find('.h-gold').html(content);
            let goldlim = Engine.hero.d.goldlim;
            if (goldlim) { //add current goldlimit
                $tipTpl.find('.h-gold-limit').html(_t('goldlimit', null, 'player') + ' ' + round(goldlim, 10));
            }
            Engine.interface.get$interfaceLayer().find('.herogold').tip($tipTpl.html(), 't-right');
            $costElement.tip($tipTpl.html(), 't-right');
        }
        if (type == 'goldLimit') { //add new goldlimit
            $tipTpl.find('.h-gold-limit').html(content);
            Engine.interface.get$interfaceLayer().find('.herogold').changeInTip('.h-gold-limit', content);
            $costElement.changeInTip('.h-gold-limit', content);
        }

    };

    this.updateStat = function(name, value, unit, beforeVal, tip, options = {}) {
        const defaultOptions = {
            formNumber: true,
            statName: undefined
        }
        const opts = {
            ...defaultOptions,
            ...options
        };

        const $stat = self.getStat(name);
        const $par = $stat.parent();
        const $label = $stat.parent().find('.label');

        if ($par.css('display') == 'none') $par.css('display', 'flex');
        if (opts.statName) $label.text(opts.statName);
        if (tip) $par.tip(tip);

        let val = (beforeVal ? beforeVal : '') + (opts.formNumber ? formNumberToNumbersGroup(value) : value) + (unit ? unit : '');
        let oldHtml = $stat.html();

        if (oldHtml != val) $stat.html(val);

        //if(self.st) clearTimeout(self.st);
        //self.st = setTimeout(self.updateStatsScrollbar,100);
    };

    this.getStat = (name) => {
        if (!$allStats[name]) $allStats[name] = Engine.interface.get$interfaceLayer().find('[data-herostat="' + name + '"] .value', $stats);
        return $allStats[name]
    };

    this.getUnit = (statName) => {
        const $stat = self.getStat(statName);
        return $stat.closest('[data-herostat]').data('unit') || '';
    }

    this.updateLegendStat = function(name, value) {
        var txt;
        if (isset(value.length)) {
            var atrs = {};
            var newName = name;

            for (var i = 0; i < value.length; i++) {
                var key = '%val' + i + '%';
                atrs[key] = value[i];
                newName += ' ' + key;
            }

            txt = _t(newName, atrs, 'legendary_stats');

        } else txt = _t(name + ' %val0%', {
            '%val0%': value
        }, 'legendary_stats');


        var $o = Tpl.get('one-legend-bonus').html(txt);

        //$('.legends .nolegbon-tmp').css('display', 'none');
        //$('.legends .bonuses').append($o);
        Engine.interface.get$interfaceLayer().find('.legends .nolegbon-tmp').css('display', 'none');
        Engine.interface.get$interfaceLayer().find('.legends .bonuses').append($o);
        //this.updateStatsScrollbar();
        //   if(self.st) clearTimeout(self.st);
        //   self.st = setTimeout(self.updateStatsScrollbar,100);
    };

    this.updateStatsScrollbar = function() {
        Engine.interface.get$interfaceLayer().find('.extended-stats').trigger('update');
    };

    this.locationInfo = function() {
        //$('#coords').html('(' + this.d.x + ',' + this.d.y + ')');
        Engine.interface.get$interfaceLayer().find('.coords').html('(' + this.d.x + ',' + this.d.y + ')');
        Engine.interface.get$interfaceLayer().find('.location-wrapper-light-mode').find('.location-cords').html('(' + this.d.x + ',' + this.d.y + ')');
    };

    this.setLowLvlClass = (lvl) => {
        if (Engine.worldConfig.getWorldName() === 'berufs') return; // #20007 - exception for Berufs

        var $el = $('body'),
            lvlClass;
        if (lvl < 7) { // to 6
            lvlClass = 7;
        } else if (lvl < 10) { // to 9
            lvlClass = 10;
        } else if (lvl < 15) { // to 14
            lvlClass = 15;
        } else if (lvl < 20) { // to 19
            lvlClass = 20;
        } else if (lvl < 25) { // to 24
            lvlClass = 25;
        } else if (lvl < 26) { // to 25
            lvlClass = 26;
        }
        lvlClass ? $el.attr('data-lvl', lvlClass) : $el.attr('data-lvl', '');
    };

    this.changeSkillSet = function() {
        var setSkillSet = self.cur_skill_set > 2 ? 1 : self.cur_skill_set + 1;
        var skills = Engine.skills ? '&show=1' : '';
        _g('skills&set=' + setSkillSet + skills);
    };

    //this.checkAgressiveNpcs = function () {
    //	var aNpcs = Engine.agressiveNpc; // agressive Npcs
    //	var npcs = Engine.npcs.check();
    //	for (var i in aNpcs) {
    //		if (!isset(npcs[i])) continue;
    //		self.checkAndSendRequestToTalkAgresiveNpc(aNpcs, npcs, i);
    //	}
    //};

    //this.checkAndSendRequestToTalkAgresiveNpc = function (aNpcs, npcs, id){
    //	let dialog_radius = isset(npcs[id].d.dialog_radius) ? npcs[id].d.dialog_radius: 1;
    //	var bool = (Math.abs(npcs[id].d.x - this.d.x) <= dialog_radius && Math.abs(npcs[id].d.y - this.d.y) <= dialog_radius);
    //	if (!aNpcs[id] && bool) {
    //		aNpcs[id] = true;
    //		self.waitForDialog = true;
    //		_g('talk&id=' + id, function (data) {
    //			if (isset(data.w)) aNpcs[id] = false;
    //			self.waitForDialog = false;
    //		});
    //	}
    //};

    this.onhover = function(e, show) {
        self.overMouse = show;
        //self.setCursor(show);
        //getEngine().interface.setCursor(show, ColliderData.CURSOR.DO_ACTION);
        getEngine().interface.setDoActionCursor(show);
    };

    //this.setCursor = function (show) {
    //	// var $gP = $('.game-window-positioner');
    //	const $GC = Engine.interface.get$GAME_CANVAS();
    //	const DO_ACTION 	= ColliderData.CURSOR.DO_ACTION;
    //
    //	if (show) 	$GC.addClass(DO_ACTION);
    //	else 		$GC.removeClass(DO_ACTION);
    //};

    this.onClear = function() {
        Engine.stepsToSend.reset();

        updateFilterImage(true);
        if (self.havePet()) {
            self.getPet().updateFilterImage();
        }

        mapAreaCordTriggerCaller.onClear();

        this.getObjectDynamicLightManager().removeAllDynamicLights();
        this.getObjectDynamicLightManager().removeAllDynamicDirCharacterLights();
        this.getObjectDynamicLightManager().removeAllDynamicBehaviorLights();
        this.deletePet();
        this.clearAutoPathOfHero();
        //this.autoPath.clear();
        this.frame = 0;
        delete this.lastServerX;
        delete this.lastServerY;
        delete this.d.x;
        delete this.d.y;
        delete this.rx;
        //self.setStaticAnimation(Engine.opt(8));
        delete this.ry;
    };

    //const removeAllDynamicLights = () => {
    //	dynamicLightCharacterManager.removeAllDynamicLights();
    //}

    this.onResize = function() {
        //$('.extended-stats').trigger('update');
        Engine.interface.get$interfaceLayer().find('.extended-stats').trigger('update');
    };

    this.setHeroInLastServerPos = () => {
        this.clearAutoPathOfHero();

        this.d.x = this.lastServerX;
        this.d.y = this.lastServerY;

        this.onPositionChange(this.lastServerX, this.lastServerY);
        Engine.map.centerOn(this.lastServerX, this.lastServerY);
    }

    // this.onclick = function (e) {
    // 	return true;
    // };

    this.oncontextmenu = function(e) {
        e.stopPropagation();
        var menu = [];
        var d = Engine.hero.d;
        //if (Engine.map.groundItems.getGroundItemOnPosition(d.x, d.y).length && (_l() == 'pl')) {
        // 	menu.push([_t('take', null, 'menu'), function () {
        // 		_g("takeitem");
        // 	}]);a
        //}

        //if (Engine.map.gateways.getOpenGtwAtPosition(d.x, d.y)) {
        //	menu.push([_t('go', null, 'menu'), function () {
        //		self.getTroughGateway();
        //	}]);
        //}

        if (self.getLevel() > 19) {
            menu.push([_t('emo_mad', null, 'menu'), function() {
                _g('emo&a=angry');
            }]);
        }

        //menu.push(["Dej mnie outfit", () => {
        menu.push([_t('change_outfit'), () => {
            this.getOutfits();
        }]);

        menu.push([
            _t('show_profile', null, 'menu'),
            () => showProfile(d.account, d.id)
        ]);

        self.addDebugOptionMenu(menu);

        Engine.interface.showPopupMenu(menu, e, {
            onMap: true
        });
    };

    //after getting into new position (rx, ry fully changed to next tile)
    this.onPositionChange = function(x, y) {
        if (Engine.lock.check("change_location") || Engine.lock.check("npcdialog") ||
            Engine.lock.check("logoff") || Engine.lock.check("battle")) return;

        var gateway = Engine.map.gateways.getGtwAtPosition(x, y);
        //if (gateway && !Engine.opt(12)) {
        if (gateway && isSettingsOptionsAutoGoThroughGatewayOn()) {
            if (this.autoWalkLock) return;
            if (autoGW) return;
            autoGW = setTimeout(function() {
                if (Engine.hero.waitForDialog || Engine.dialogue || Engine.shop) {
                    clearInterval(autoGW);
                    autoGW = null;
                    return;
                }
                self.getTroughGateway();
            }, 200);
        }
    };

    this.getTroughGateway = function() {
        if (Engine.lock.check("npcdialog") || Engine.lock.check("battle")) return;

        Engine.lock.add('change_location');
        Engine.map.blockMove();
        _g('walk', function(v) {
            autoGW = null;
            if (isset(v.t) && v.t === 'reload') {
                Engine.map.showLoaderSplash();
            } else {
                Engine.map.unBlockMove();
            }

            //if (v.t == 'reload') Engine.reloadStats = false;

            Engine.lock.remove('change_location');
        });
    };

    // this.updateCollider = function () {
    // 	this.collider = {
    // 		box: [
    // 			self.rx * 32 + 16 - self.fw / 2,
    // 			self.ry * 32 + 32 - self.fh,
    // 			self.rx * 32 + 16 + self.fw / 2,
    // 			self.ry * 32 + 32
    // 		]
    // 	};
    // };

    this.tryPet = (petObj) => {
        this.tempPetObj = {
            ...petObj,
            ...{
                isPreview: 1
            }
        };
        if (Engine.hero.pet) this.pet.hidePet(() => this.updatePet(this.tempPetObj, {}));
        else this.updatePet(this.tempPetObj, {})

        message(_t('preview_start'))
        this.previewPetTimeout = setTimeout(this.removePreviewPet, 60000);
    }

    this.removePreviewPet = () => {
        clearTimeout(this.previewPetTimeout);
        message(_t('preview_end'));
        this.updatePet({}, {})
    }

    this.updatePet = function(d, allData) {
        var emptyObj = jQuery.isEmptyObject(d);
        if (allData.t == 'reload' && !emptyObj) return;
        // d.afterReload = isset(allData.worldname); //for door use fix (game reload)
        //d.afterReload = isset(Engine.worldConfig.getWorldName()); //for door use fix (game reload)
        d.afterReload = !Engine.allInit; //for door use fix (game reload)

        if (!emptyObj && this.pet && this.pet.d.name != d.name) { // xD! Name compare, because id NOT EXIST!
            this.deletePet();
        }

        if (!isset(this.pet)) {
            clearTimeout(this.previewPetTimeout);
            d.own = true;
            d.master = self;
            d.isNew = true;
            this.pet = new Pet();
            this.pet.init();
            this.pet.updateDATA(d);
            this.petLock = new Lock(['petUpdate'], function() {
                self.pet.updateDATA({
                    master: self
                });
                delete self.petLock;
            });
        } else {
            if (emptyObj) {
                this.deletePet();
            } else {
                if (isset(allData.h)) { // fix for block action on go by gateway
                    d.action = ((d.action >> (4 * 0)) & 0xf);
                }
                if (!isset(d.elite)) {
                    d.elite = null;
                }
                d.isNew = false;
                self.pet.updateDATA(d);
            }
        }
    };

    this.deletePet = function() {
        if (isset(this.pet)) {
            this.pet.removePet();
            delete this.pet;
        }
    };

    this.havePet = () => {
        return isset(this.pet);
    }

    this.getPet = () => {
        return this.pet;
    }

    this.getDrawableList = function() {
        var list = [];
        const HERO = CanvasObjectTypeData.HERO;
        let interfaceTimerManager = getEngine().interfaceTimerManager;

        if (isset(this.pet) && this.pet.getOrder) list.push(this.pet);
        if (isset(this.matchmakingChampionAura)) list.push(this.matchmakingChampionAura);
        if (this.wanted) list.push(this.wanted);
        if (isset(this.whoIsHereGlow) && !Engine.rajCharacterHide.checkHideObject(this)) list.push(this.whoIsHereGlow);
        if (interfaceTimerManager.check(HERO)) list.push(interfaceTimerManager.getCharacterTimer(HERO));

        return list;
    };

    this.getData = () => {
        return this.d;
    }

    this.getOrder = function() {
        return this.ry + this.tutorialOrder + 0.5;
    };

    this.increaseTutorialOrder = () => {
        this.tutorialOrder = 301;
    };

    this.clearTutorialOrder = () => {
        this.tutorialOrder = 0;
    };

    this.atackNearMob = function(auto) {
        var npcs = Engine.npcs.check();
        var npcId = null;
        for (var id in npcs) {
            var npc = npcs[id];
            var fightNpc = npc.d.type == 2 || npc.d.type == 3;
            if (!fightNpc) continue;
            var bool1 = this.d.x - 2 < npc.d.x && this.d.x + 2 > npc.d.x;
            var bool2 = this.d.y - 2 < npc.d.y && this.d.y + 2 > npc.d.y;
            if (bool1 && bool2) {
                npcId = npc.d.id;
                if (this.getCharacterFrontOfHero(npc)) return this.heroAtackRequest(npcId, auto);
            }
        }
        if (npcId) return this.heroAtackRequest(npcId, auto);
    };

    this.addToPartyNearPlayer = function() {
        var others = Engine.others.check();
        var idToSend = [];
        var idToIgnore = [];
        var p = Engine.party;
        if (p) {
            var members = p.getMembers();
            for (var m in members) {
                idToIgnore.push(m);
            }
        }
        for (var id in others) {
            var o = others[id];
            var bool1 = this.d.x - 2 < o.d.x && this.d.x + 2 > o.d.x;
            var bool2 = this.d.y - 2 < o.d.y && this.d.y + 2 > o.d.y;
            var bool3 = idToIgnore.indexOf(id) < 0;
            if (bool1 && bool2 && bool3) idToSend.push(o.d.id);
        }
        if (idToSend.length != 0) self.inviteToParty(idToSend);
        else console.log('none');
    };

    this.inviteToParty = function(idToSend) {
        _g('party&a=inv&id=' + idToSend[0], function() {
            idToSend.shift();
            if (idToSend.length != 0) self.inviteToParty(idToSend)
        });
    };

    this.atackNearPlayer = function() {
        let nearPlayerId = getNearPlayerId();

        if (nearPlayerId == null) {
            return;
        }

        // _g('fight&a=attack&id=' + nearPlayerId, function () {});
        heroAttackRequest(nearPlayerId);
    };

    const heroAttackRequest = (id, callback, options = {}) => {
        let autoFight = options.autoFight ? "&ff=1" : '';
        let minus = options.minus ? "-" : '';

        //console.log('block');
        _g('fight&a=attack&id=' + minus + id + autoFight, function(callbackData) {

            //Engine.lock.add('heroAttack');


            if (callback) {
                callback(callbackData);
            }
        });
    }

    const getNearPlayerId = () => {
        let others = Engine.others.check();
        let oId = null;
        let idToIgnore = [];
        let p = Engine.party;

        if (p) {
            var members = p.getMembers();
            for (var m in members) {
                idToIgnore.push(m);
            }
        }

        for (var id in others) {
            let o = others[id];
            let bool1 = this.d.x - 3 <= o.d.x && this.d.x + 3 >= o.d.x;
            let bool2 = this.d.y - 3 <= o.d.y && this.d.y + 3 >= o.d.y;
            let bool3 = idToIgnore.indexOf(id) < 0;

            if (bool1 && bool2 && bool3) {
                oId = o.d.id;

                if (this.getCharacterFrontOfHero(o)) {
                    return oId
                }
            }
        }

        return oId
    };

    this.checkPlayerIdIsHeroId = (id) => {
        return self.d.id == id;
    }

    this.talkNearMob = function() {
        var npcs = Engine.npcs.check();
        var npcId = null;
        for (var id in npcs) {
            var npc = npcs[id];
            var talkNpc = npc.d.type == 0 || npc.d.type == 5 || npc.d.type == 6 || npc.d.type == 7;
            if (!talkNpc) continue;
            var bool1 = this.d.x - 2 < npc.d.x && this.d.x + 2 > npc.d.x;
            var bool2 = this.d.y - 2 < npc.d.y && this.d.y + 2 > npc.d.y;
            if (bool1 && bool2) {
                npcId = npc.d.id;
                //if (this.getCharacterFrontOfHero(npc)) return _g('talk&id=' + npcId);
                if (this.getCharacterFrontOfHero(npc)) return this.sendRequestToTalk(npcId)
            }
        }
        // if (npcId) return _g('talk&id=' + npcId, function(v) {
        // 	Engine.interface.checkTeleport(v);
        // });
        if (npcId) return this.sendRequestToTalk(npcId)
    };

    this.sendRequestToTalk = (npcId) => {
        this.waitForDialog = true;
        _g('talk&id=' + npcId, function(v) {
            self.waitForDialog = false;
            if (!isset(v.d)) Engine.hero.clearAutoPathOfHero(); // #14220 fix for remove red glow if npc no talk
            Engine.interface.checkTeleport(v);

            //if (v.t == 'reload') Engine.reloadStats = false;

            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 2, {
                idNpc: npcId
            });
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 2, {idNpc:npcId});
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 4, {
                idNpc: npcId
            });
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 5, {idNpc:npcId});
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 9, {
                idNpc: npcId
            });
            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 9, {idNpc:npcId});
            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 10, {
                idNpc: npcId
            });

            self.callCheckCanFinishExternalTutorialTalkNpc(npcId);
        });
    };

    this.getCharacterFrontOfHero = function(o) {
        //switch (this.dir) {
        //	case 'N':
        //		if (o.d.x == this.d.x && o.d.y == this.d.y - 1) return true;
        //		break;
        //	case 'S':
        //		if (o.d.x == this.d.x && o.d.y == this.d.y + 1) return true;
        //		break;
        //	case 'W':
        //		if (o.d.x == this.d.x - 1 && o.d.y == this.d.y) return true;
        //		break;
        //	case 'E':
        //		if (o.d.x == this.d.x + 1 && o.d.y == this.d.y) return true;
        //		break;
        //}

        switch (this.dir) {
            case HeroDirectionData.N:
                if (o.d.x == this.d.x && o.d.y == this.d.y - 1) return true;
                break;
            case HeroDirectionData.S:
                if (o.d.x == this.d.x && o.d.y == this.d.y + 1) return true;
                break;
            case HeroDirectionData.W:
                if (o.d.x == this.d.x - 1 && o.d.y == this.d.y) return true;
                break;
            case HeroDirectionData.E:
                if (o.d.x == this.d.x + 1 && o.d.y == this.d.y) return true;
                break;
        }


        return false;
    };

    this.heroAtackOtherRequest = function() {
        if (!this.markOtherObj) return;
        var o = this.markOtherObj;
        //var range = Engine.map.pvp == 1 ? 4 : 2; //  ???????
        var range = 2;
        if (Math.abs(o.d.x - self.rx) <= range && Math.abs(o.d.y - self.ry) <= range) {
            // _g('fight&a=attack&id=' + o.d.id, function (d) {
            // 	if (isset(d.alert)) Engine.hero.markOtherObj.deleteRedMark();
            // });

            heroAttackRequest(o.d.id, function(d) {
                if (isset(d.alert)) Engine.hero.markOtherObj.deleteRedMark();
            });

        }
    };

    this.heroAtackRequest = function(id, auto) {
        //var str = '';
        //if (auto) str = !Engine.party ? '&ff=1' : '';
        //else str = !Engine.party && Engine.settings.getLocOptById(18) ? '&ff=1' : '';

        //if (auto) str = '&ff=1';
        //else str = Engine.settings.getLocOptById(18) ? '&ff=1' : '';

        if (auto) {
            // _g("fight&a=attack&id=-" + id + '&ff=1', function () {
            // 	Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 5, {idNpc:self.d.id});
            // 	//Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 5, {idNpc:self.d.id});
            // 	//Engine.tutorialManager.checkCanFinishExternalAndFinish({name: TutorialData.ON_FINISH_REQUIRE.ATTACK_NPC_ID, [TutorialData.ON_FINISH_REQUIRE.ATTACK_NPC_ID]: id})
            // 	self.callCheckCanFinishExternalTutorialAttackNpc(id)
            // });

            heroAttackRequest(id, function() {
                Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 5, {
                    idNpc: self.d.id
                });
                self.callCheckCanFinishExternalTutorialAttackNpc(id)
            }, {
                autoFight: true,
                minus: true
            })

        } else {

            // _g("fight&a=attack&id=-" + id, function () {
            // 	Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 5, {idNpc:self.d.id});
            // 	//Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 5, {idNpc:self.d.id});
            // 	//Engine.tutorialManager.checkCanFinishExternalAndFinish({name: TutorialData.ON_FINISH_REQUIRE.ATTACK_NPC_ID, [TutorialData.ON_FINISH_REQUIRE.ATTACK_NPC_ID]: id})
            // 	self.callCheckCanFinishExternalTutorialAttackNpc(id)
            // });
            heroAttackRequest(id, function() {
                Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 5, {
                    idNpc: self.d.id
                });
                self.callCheckCanFinishExternalTutorialAttackNpc(id)
            }, {
                minus: true
            })
        }
    };

    //$('.extended-stats').addScrollBar({track: true});

    this.init = function() {
        self.initOnSelfEmoList();
        setStartClickOnMapMove(false);
        setAfterFollowAction(null);
        setRefFollowObj(null);
        self.createPlaceHolderCharacter();
        $stats = Engine.interface.get$interfaceLayer().find('.extended-stats .stats-section');
        Engine.interface.get$interfaceLayer().find('.extended-stats').addScrollBar({
            track: true
        });
        self.setInputParser()
        this.initDynamicLightCharacterManager();

        mapAreaCordTriggerCaller = new MapAreaCordTriggerCaller();
        mapAreaCordTriggerCaller.init();

        //initDynamicHoleImg();
    };

    //const initDynamicLightCharacterManager = () => {
    //	dynamicLightCharacterManager = new DynamicLightCharacterManager();
    //	dynamicLightCharacterManager.init();
    //};

    //const addDynamicLightId = (id) => {
    //	if (dynamicLightCharacterManager.checkDynamicLightId(id)) {
    //		errorReport(moduleData, "addDynamicLightId", `Id ${id} already exist!`, dynamicLightCharacterManager);
    //		return;
    //	}
    //	dynamicLightCharacterManager.addDynamicLightId(id);
    //};

    this.getOutfits = () => {
        if (!Engine.changeOutfit) {
            const domain = getMainDomain();
            const isWWW = isPl() ? 'www.' : '';

            $.ajax({
                type: 'post',
                url: `https://${isWWW}margonem.${domain}/ajax/getoutfits`,
                xhrFields: {
                    withCredentials: true
                },
                data: {
                    world: Engine.worldConfig.getWorldName(),
                    id: Engine.hero.d.id,
                    h2: getCookie('hs3')
                },
                success: (data) => {
                    //console.log(JSON.parse(data));
                    Engine.changeOutfit = new ChangeOutfit();
                    Engine.changeOutfit.init();
                    Engine.changeOutfit.update(JSON.parse(data));
                }
            });
        } else Engine.changeOutfit.close();
    }

    this.getNick = () => {
        return this.d.nick;
    };

    this.getRX = () => {
        return this.rx;
    };

    this.getRY = () => {
        return this.ry;
    };

    this.getX = () => {
        return this.d.x;
    };

    this.getY = () => {
        return this.d.y;
    };

    this.getNDir = () => {
        //let dirMapping = [HeroDirectionData.S, HeroDirectionData.W, HeroDirectionData.E, HeroDirectionData.N];

        return this.ndir;
    };

    this.getDir = () => {
        let dirMapping = [HeroDirectionData.S, HeroDirectionData.W, HeroDirectionData.E, HeroDirectionData.N];

        return dirMapping[this.d.dir];
    };

    this.getImg = () => {
        return this.d.img;
    };

    this.getOldImg = () => {
        return oldImg;
    };

    this.getId = () => {
        return this.d.id
    }

    this.getLvl = () => {
        return this.d.lvl
    }

    this.getProf = () => {
        return this.d.prof;
    };

    this.getLevel = () => {
        if (!this.d.lvl) {
            return 0;
        }

        return this.d.lvl
    }

    this.getOperationLevel = () => {
        if (!this.d.oplvl) {
            return 0;
        }

        return this.d.oplvl
    }

    this.outfitPreview = (val) => {
        let path;
        let o = {
            speed: false
        };

        path = CFG.r_opath + fixSrc(val);
        o['externalSource'] = cdnUrl;

        Engine.imgLoader.onload(path, o,
            (i, f) => {
                self.previewOutfit = val;
                self.beforeOnloadPreview(f, i);
            },
            (i) => {
                self.afterLoadImage();
            },
            () => {
                // self.fetchError();
            }
        );
    };

    this.beforeOnloadPreview = (f, i) => {
        const
            fw = f.hdr.width / 4,
            fh = f.hdr.height / 4;

        const outfitData = {
            kind: 'preview',
            fw,
            fh,
            halffw: fw / 2,
            halffh: fh / 2,
            frames: f.frames,
            activeFrame: 0,
            sprite: i
        }

        this.setOutfitData(outfitData)

    };

    this.setOutfitData = (outfitData) => {
        this.outfitData[outfitData.kind] = outfitData;
        this.setKindOutfit(outfitData.kind);
    }

    this.setKindOutfit = (kind) => {
        this.fw = this.outfitData[kind].fw;
        this.fh = this.outfitData[kind].fh;
        this.halffw = this.outfitData[kind].halffw;
        this.halffh = this.outfitData[kind].halffh;
        this.frames = this.outfitData[kind].frames;
        this.activeFrame = this.outfitData[kind].activeFrame;
        this.sprite = this.outfitData[kind].sprite;

        clearTimeout(this.previewOutfitTimeout);

        if (kind === 'original') {
            if (this.previewOutfit) message(_t('preview_end'));
            this.previewOutfit = false;
        } else {
            message(_t('preview_start'))
            this.previewOutfitTimeout = setTimeout(() => {
                this.setKindOutfit('original');
            }, 60000)
        }
        Engine.battle.updateHeroOutfit();
    }

    this.setRefFollowObj = setRefFollowObj;
    this.setStartClickOnMapMove = setStartClickOnMapMove;
    this.setHeroAlreadyInitialised = setHeroAlreadyInitialised;
    this.getHeroAlreadyInitialised = getHeroAlreadyInitialised;
    this.updateNick = updateNick;
    this.updateFilterImage = updateFilterImage;

    //const initDynamicHoleImg = () => {
    //	dynamicHoleImg = Engine.nightController.getFramesWithHoles().getDynamicHoleImg(100);
    //};

    //this.getDynamicHoleImg = () => {
    //	return dynamicHoleImg;
    //};

    //this.addDynamicLightId 		= addDynamicLightId;
    //this.removeAllDynamicLights = removeAllDynamicLights;

    this.setSpeed = (_speed) => {
        speed = _speed;
    }

};

Hero.prototype = Object.create(Character.prototype);

Hero.prototype.constructor = Hero;

module.exports = Hero;