/**
 * Created by lukasz on 12.09.14.
 */
const RajCharacterImageChangerData = require('core/raj/rajCharacterImageChanger/RajCharacterImageChangerData');
var Character = require('core/characters/Character');
var WhoIsHereGlow = require('core/whoIsHere/WhoIsHereGlow2');
var CharacterBlur = require('core/characters/CharacterBlur');
//var FollowGlow = require('core/glow/FollowGlow');
var EmotionsData = require('core/emotions/EmotionsData');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let NpcData = require('core/characters/NpcData');
//let NpcTimer = require('core/NpcTimer');
let CharacterTimer = require('core/interfaceTimer/CharacterTimer.js');
let HeroDirectionData = require('core/characters/HeroDirectionData');
var RajData = require('core/raj/RajData');
var FollowController = require('core/FollowController');
var RajMapEventsData = require('core/raj/rajMapEvents/RajMapEventsData');
let ColliderData = require('core/collider/ColliderData');

var Npc = function() {
    var self = this;
    this.d = {};
    this.inMove = false;
    this.frame = 0;
    this.frames = null;
    this.dlg = false;
    this.killTimer = null;
    //this.isStatic = false;
    // this.canvasObjectType = "Npc";
    this.dir = HeroDirectionData.S;
    this.canvasObjectType = CanvasObjectTypeData.NPC;
    this.collider = null;
    this.isPlayer = false;
    //this.lastEmo = '';
    this.overMouse = false;
    this.initOrder = false;
    this.order = 0;
    //this.onSelfEmoList = [];
    this.onSelfMarginEmo = 0;
    this.mapColSet = null;
    this.frameAmount = 1;
    this.sequence = [];
    this.sequenceIndex = 0;
    this.tutorialOrder = 0;
    this.walkOver = false;
    this.eliteHereWasCall = false;
    //this.onloadProperImg = false;

    this.eliteHereWasCall = false;

    let followController = null;

    let gateNpc;

    let extraLightsId = {};

    let kind = null;

    var trackLock = new Lock(['image', 'afterUpdate'], function() {
        //if (Engine.questTrack)
        //	Engine.questTrack.checkTaskNpcOrItem(self.d.id, 'npc');
    });

    this.init = () => {
        self.createPlaceHolderCharacter();
        self.initOnSelfEmoList();
        self.initDataDrawer();
        this.initDynamicLightCharacterManager();
        initFollowController();
    }

    const initFollowController = () => {
        followController = new FollowController();
        followController.init(getEngine().hero, this);
    }

    this.getFollowController = function() {
        return followController
    };

    const addExtraLightId = (id) => {
        extraLightsId[id] = true;
    };

    const checkExtraLightId = (id) => {
        return extraLightsId[id] ? true : false;
    };

    const getFreeIdOfExtraLights = () => {
        return getFreeIdOfObject(extraLightsId);
    }

    const removeExtraLightId = (id) => {
        delete extraLightsId[id];
    };

    const removeAllExtraLights = () => {
        //let framesOfNight = Engine.nightController.getFramesOfNight();

        for (let id in extraLightsId) {
            //Engine.rajExtraLight.rajRemoveAction(id, null, framesOfNight);
            Engine.rajExtraLight.rajRemoveActionBeyondManager(id);
            removeExtraLightId(id);
        }
    }

    this.createKillTimer = (val) => {
        //this.killTimer = new NpcTimer();
        //this.killTimer.init(this, val * 1000);
        this.killTimer = new CharacterTimer();
        this.killTimer.init();
        this.killTimer.updateData(null, this.d.id, CanvasObjectTypeData.NPC, val);
    }

    //this.getOnloadProperImg = () => {
    //	return this.onloadProperImg;
    //};

    this.delete = function() {
        //API.callEvent('removeNpc', self);
        API.callEvent(Engine.apiData.REMOVE_NPC, self);
        // Engine.map.col.unset(self.mapColSet[0], self.mapColSet[1], 2);

        if (!Engine.hero.checkStasis()) Engine.rajMapEvents.callAllActionsBySpecificEventAndNpc(RajMapEventsData.ON_DIE_NPC, {
            npcId: self.d.id
        });
        if (!Engine.hero.checkStasis()) Engine.rajCharacterImageChangerManager.callAllActionsBySpecificEventAndNpc(RajCharacterImageChangerData.KIND.ON_DIE, {
            npcId: self.d.id
        });

        self.deleteNpcCollision();
        Engine.npcs.removeOne(self.d.id);
        Engine.rajEmoActions.deleteOneNpcActionsList(self.d.id);
        Engine.emotions.removeAllFromSourceId(self.d.id);
        Engine.characterEffectsMapManager.removeCharacterEffectFromDeleteCharacter(this.canvasObjectType, self.d.id);

        removeAllExtraLights();

        this.getObjectDynamicLightManager().removeAllDynamicBehaviorLights();

        //if (Engine.hero.checkStasis()) return;
        //
        //Engine.rajMapEvents.callAllActionsBySpecificEventAndNpc(RajData.event.MAP.ON_DIE_NPC, self.d.id);
    };

    this.deleteNpcCollision = () => {
        if (self.mapColSet === null) return;

        Engine.map.col.unset(self.mapColSet[0], self.mapColSet[1], 2);
    };

    this.addNpcCollision = () => {
        Engine.map.col.set(self.mapColSet[0], self.mapColSet[1], 2);
    };

    this.seMapColSet = (data) => {
        this.mapColSet = [data.x, data.y];
    };

    this.addNpcCollisionOrDeleteOldCollisionAndAddNewCollision = (data) => {
        if (this.mapColSet) this.deleteNpcCollision();

        this.seMapColSet(data);
        this.addNpcCollision();
    };

    var timePassed = 0;
    this.update = function(dt) {

        if (!Engine.allInit) return

        self.changeWarShadowOpacity(dt);

        if (isIconInvisible()) {
            return;
        }

        if (this.getOnloadProperImg() && this.frames && this.frames.length > 1) {
            timePassed += dt * 100;
            if (this.frames[this.activeFrame].delay < timePassed) {
                timePassed = timePassed - this.frames[this.activeFrame].delay;
                //this.activeFrame = (this.frames.length == this.activeFrame + 1 ? 0 : this.activeFrame + 1);

                if (this.frames.length == this.activeFrame + 1) {
                    this.activeFrame = 0;
                    this.manageSequenceAction();
                } else this.activeFrame = this.activeFrame + 1;

            }
        }

        //if (isset(this.followGlow)) this.followGlow.update();
        if (followController.checkFollowGlow()) followController.getFollowGlow().update();

        if (self.overMouse && isset(this.npcGlow)) {
            this.npcGlow.update();
        }

        if (isset(this.characterBlur)) {
            this.characterBlur.update();
        }

        if (self.killTimer) self.killTimer.update(dt);

        self.getDataDrawer().update(dt);
    };

    this.manageSequenceAction = function() {
        if (!self.sequence.length) return;

        self.sequenceIndex++;

        if (self.sequenceIndex > self.sequence.length - 1) {
            self.sequenceIndex = 0;
            self.frame = 0
        } else self.frame = self.sequence[self.sequenceIndex];
    };

    this.beforeOnload = (f, i, d) => {
        self.fw = f.hdr.width / self.frameAmount;
        self.fh = f.hdr.height;
        self.halffw = self.fw / 2;
        self.halffh = self.fh / 2;
        self.frames = f.frames;
        self.leftPosMod = ((d.type > 3 && !(self.fw % 64)) ? -16 : 0);
        self.activeFrame = 0;
        self.sprite = i;

        self.manageUpdateCollider();

    };

    this.manageUpdateCollider = () => {
        if (CFG.debug || self.d.type != 4) {
            self.updateCollider();
        } else {
            self.collider = null;
        }
    }

    this.afterOnload = () => {
        //this.onloadProperImg = true;
        this.setOnloadProperImg(true)
        this.afterLoadImage();
        this.manageEmo();

        this.refreshEmotions();
    }

    this.afterLoadImage = () => {
        trackLock.unlock('image');

        if (self.grp) {
            self.npcGlow = new WhoIsHereGlow();
            self.npcGlow.createObject(self, '#ccccff');

            let color = getEngine().npcs.getGroupColor(self.grp);

            self.characterBlur = new CharacterBlur();
            self.characterBlur.init(this, color);
        }
        if (Engine && Engine.dialogue) {
            Engine.dialogue.updateDialogAfterChangeNpc(self);
        }
    };

    //this.refreshEmotions = () => {
    //	const emoList = this.getOnSelfEmoList();
    //	if (emoList.length > 0) {
    //		for (const emo of emoList) {
    //			emo.setXYOffset();
    //		}
    //	}
    //};

    this.setActions = function(patch) {
        //var myRe = new RegExp(/\((.*?)\)/g);
        var myRe = new RegExp(/_s_(.*?)_e_/g);
        var myArray = myRe.exec(patch);

        if (!myArray) return;

        if (myArray.length > 2) return console.warn('[Npc.js, setActions] Multiple declaration', patch)

        //let args = myArray[1].split('-');
        let args = myArray[1];

        let sequence = [];

        for (let k of args) {
            let pInt = parseInt(k);
            if (!Number.isInteger(pInt)) {
                self.frameAmount = 1;
                console.warn('[Npc.js, setActions] Argument is not integer');
                return
            } else {
                //self.frameAmount = Math.max(self.frameAmount, (pInt + 1));
                sequence.push(pInt);
            }
        }
        self.frameAmount = 5;
        self.sequence = sequence;
    };

    this.updateIcon = function(v, o, d) {
        self.setPlaceHolderIcon();
        self.setStaticAnimation(!isSettingsOptionsInterfaceAnimationOn());

        if (d.type != 4) self.updateCollider();

        let path = CFG.r_npath + v;
        let isFast = d.wt > 9;

        self.setActions(path);

        let gateUrl = getEngine().npcs.isGateUrl(v);
        setGateNpc(gateUrl);

        if (isIconInvisible()) {
            let i = Engine.imgLoader.getYellowCanvas();
            let tileSize = CFG.tileSize;
            let f = {
                hdr: {
                    width: tileSize,
                    height: tileSize
                },
                frames: [{}]
            };

            this.beforeOnload(f, i, d);
            this.afterOnload();

            return;
        }

        Engine.imgLoader.onload(path, {
                speed: isFast,
                externalSource: cdnUrl
            },
            (i, f) => {
                this.beforeOnload(f, i, d);
            },
            (i) => {
                this.afterOnload();
            },
            () => {
                self.fetchError();
            }
        );

        if (Engine && Engine.dialogue) {
            Engine.dialogue.updateDialogAfterChangeNpc(self);
        }
    };

    this.checkNpcHasCollision = (_type) => {
        let type = isset(_type) ? _type : this.d.type;

        if (type != 4 || (type == 7 && isEn())) return true;

        return false;
    }

    this.onUpdate = new(function() {

        this.type = function(v, old, data) {
            // if (v != 4 || (v == 7 && _l() == 'en') ) {
            //if (v != 4 || (v == 7 && isEn()) ) {
            if (self.checkNpcHasCollision(v)) {
                self.addNpcCollisionOrDeleteOldCollisionAndAddNewCollision(data);
            }
        };

        this.nick = function(v, old, data) {
            if (old && v != old) {
                self.clearDataToDraw();
            }
        }

        this.grp = function(val) {
            if (!val) return;
            self.grp = val;
        };

        this.isNonAggressive = function(val) {
            //console.log('isNonAggressive', this)
        }

        this.actions = function(v) {

            //if (self.checkActionsBitByName(NpcData.NAMES.QUEST, v)) self.qm = EmotionsData.NAME.NORMAL_QUEST;
            //if (self.checkActionsBitByName(NpcData.NAMES.DAILY_QUEST, v)) self.qm = EmotionsData.NAME.BLUE_QUEST_MARK;
            //if (self.checkActionsBitByName(EmotionsData.NAME.NORMAL_QUEST, v)) self.addEmoToQm(EmotionsData.NAME.NORMAL_QUEST);
            //if (self.checkActionsBitByName(EmotionsData.NAME.DAILY_QUEST, v)) self.addEmoToQm(EmotionsData.NAME.DAILY_QUEST);
            //if (self.checkActionsBitByName(EmotionsData.NAME.DEPO, v)) self.addEmoToQm(EmotionsData.NAME.DEPO);
            this.createNpcEmoFromActions(v);
        };

        this.hasOnetimeQuest = function() {
            self.addEmoToQm(EmotionsData.NAME.NORMAL_QUEST);
        }

        this.hasDailyQuest = function() {
            self.addEmoToQm(EmotionsData.NAME.DAILY_QUEST);
        }

        this.killSeconds = function(v) {
            //console.log('killSeconds', v);
            if (!this.killTimer) this.killTimer = null;

            if (v == 0) return

            this.createKillTimer(v);
        }

        this.qm = function(v) {

            //if(v == 1) self.qm = EmotionsData.NAME.YELLOW_EXCLAMATION;
            //if(v == 2) self.qm = EmotionsData.NAME.BLUE_EXCLAMATION;

            if (v == 1) self.addEmoToQm(EmotionsData.NAME.YELLOW_EXCLAMATION);
            if (v == 2) self.addEmoToQm(EmotionsData.NAME.BLUE_EXCLAMATION);
        };

    })();

    this.createNpcEmoFromActions = (v) => {

        let emoNameArray = Engine.npcs.getAllEmoNameOfNpc(this, v);

        for (let k in emoNameArray) {
            let name = emoNameArray[k];

            if (!isset(NpcData.BITS[name])) {
                continue;
            }

            if (self.checkActionsBitByName(name, v)) {
                self.addEmoToQm(name);
            }
        }
    };

    this.clearQm = () => {
        this.qm = [];
    };

    this.addEmoToQm = (emoName) => {
        if (this.qm.includes(emoName)) return;

        this.qm.push(emoName);
    }

    this.beforeUpdate = function(data) {
        this.rx = data.x;
        this.ry = data.y;
        //self.qm = '';
        this.clearQm();
    };

    this.manageEliteHereEmo = () => {
        let isEliteHere = self.d.wt < 90 && self.d.wt > 79 && !self.eliteHereWasCall;
        let attackNpc = self.d.type == 2 || self.d.type == 3;

        if (!attackNpc) {
            return;
        }

        if (!isEliteHere) {
            return;
        }

        self.eliteHereWasCall = true;
        Engine.emotions.updateData([{
            name: EmotionsData.NAME.ELITE_HERE,
            source_id: self.d.id,
            source_type: EmotionsData.OBJECT_TYPE.NPC
        }]);
    };

    this.manageActionsEmo = () => {

        //if (!self.qm.length) {
        //
        //	Engine.emotions.removeEmotionBySourceIdAndEmoType(self.d.id, EmotionsData.NAME.NORMAL_QUEST);
        //	Engine.emotions.removeEmotionBySourceIdAndEmoType(self.d.id, EmotionsData.NAME.BLUE_QUEST_MARK);
        //	Engine.emotions.removeEmotionBySourceIdAndEmoType(self.d.id, EmotionsData.NAME.YELLOW_EXCLAMATION);
        //	Engine.emotions.removeEmotionBySourceIdAndEmoType(self.d.id, EmotionsData.NAME.BLUE_EXCLAMATION);
        //
        //	return false;
        //} else {
        //
        //	for (let k in this.qm) {
        //		Engine.emotions.updateData([{name: self.qm[k], source_id: self.d.id, source_type: EmotionsData.OBJECT_TYPE.NPC}]);
        //	}
        //	return true
        //}
        this.clearAllActionsEmo();
        if (!self.qm.length) return;

        let npcId = self.d.id;
        let rajEmoActions = getEngine().rajEmoActions;

        for (let k in this.qm) {

            let cl = self.qm[k];
            let srajData = rajEmoActions.checkOneNpcActionsList(npcId);

            if (srajData && !rajEmoActions.getShowNotify(npcId, cl)) continue;

            Engine.emotions.updateData([{
                name: cl,
                source_id: npcId,
                source_type: EmotionsData.OBJECT_TYPE.NPC
            }]);
        }
    };

    this.clearAllActionsEmo = () => {

        const NAME = EmotionsData.NAME;
        const npcId = self.d.id;
        const removeEmotionBySourceIdAndEmoType = getEngine().emotions.removeEmotionBySourceIdAndEmoType;

        removeEmotionBySourceIdAndEmoType(npcId, NAME.NORMAL_QUEST);
        removeEmotionBySourceIdAndEmoType(npcId, NAME.DAILY_QUEST);
        removeEmotionBySourceIdAndEmoType(npcId, NAME.YELLOW_EXCLAMATION);
        removeEmotionBySourceIdAndEmoType(npcId, NAME.BLUE_EXCLAMATION);
        removeEmotionBySourceIdAndEmoType(npcId, NAME.AUCTION);
        removeEmotionBySourceIdAndEmoType(npcId, NAME.MAIL);
        removeEmotionBySourceIdAndEmoType(npcId, NAME.SHOP);
        removeEmotionBySourceIdAndEmoType(npcId, NAME.HEAL);
        removeEmotionBySourceIdAndEmoType(npcId, NAME.DEPO_CLAN);
        removeEmotionBySourceIdAndEmoType(npcId, NAME.DEPO);
        removeEmotionBySourceIdAndEmoType(npcId, NAME.INKEEPER);

        // TODO: in future fix update rajEmoAction, after update npc
        //let arrayNames = Engine.rajEmoDefinitions.getArrayOfDefinitionsName();

        //for (let k in arrayNames) {
        //	let name = arrayNames[k];
        //	Engine.emotions.removeEmotionBySourceIdAndEmoType(self.d.id, name);
        //}
        // TODO: in future fix update rajEmoAction, after update npc
    };

    this.manageEmo = function() {

        if (!self.imgLoaded) return;

        self.manageEliteHereEmo(); // tp 971
        self.manageAggressiveEmo();
        self.manageActionsEmo();

        if (this.d.external_properties) {
            //let k = RajData.keys;

            Engine.rajController.parseObject(this.d.external_properties, [
                RajData.INTERFACE_SKIN,
                RajData.WEATHER,
                RajData.NIGHT,
                RajData.SCREEN_EFFECTS,
                RajData.MAP_FILTER,
                RajData.EARTHQUAKE,
                RajData.CHARACTER_EFFECT,
                RajData.FAKE_NPC,
                RajData.TUTORIAL,
                RajData.BATTLE_EVENTS,
                RajData.MAP_EVENTS,
                RajData.CHARACTER_IMAGE_CHANGER,
                RajData.WINDOW_EVENTS,
                RajData.MAP_EXTERNAL_PROPERTIES_REFRESH,
                RajData.PROGRAMMER,
                RajData.EXTRA_LIGHT,
                RajData.DYNAMIC_LIGHT,
                RajData.BEHAVIOR_DYNAMIC_LIGHT,
                RajData.TEMPLATE,
                RajData.FLOAT_FOREGROUND,
                RajData.FLOAT_OBJECT,
                RajData.CAMERA,
                RajData.CHARACTER_HIDE,
                RajData.DIALOGUE,
                RajData.CALL_INSTANT_BEHAVIOR_FAKE_NPC,
                RajData.YELLOW_MESSAGE,
                RajData.SEQUENCE,
                RajData.RANDOM_CALLER,
                RajData.SOUND,
                RajData.AREA_TRIGGER,
                RajData.CONNECT_SRAJ,
                RajData.MAP_MUSIC,
                RajData.ZOOM,
                RajData.TRACKING
            ], {
                npcId: self.d.id
            });
        }
    };

    this.manageAggressiveEmo = function() {
        let AGGRESSIVE_EMO = EmotionsData.NAME.AGGRESSIVE;
        const npcLvl = !isset(this.d.elasticLevelFactor) ? this.d.lvl : this.elasticLevel;
        const isAggressive = self.d.type === 3 && npcLvl >= Engine.hero.d.lvl - 1 && !self.d.isNonAggressive;

        Engine.emotions.removeEmotionBySourceIdAndEmoType(self.d.id, AGGRESSIVE_EMO);

        if (isAggressive) {
            Engine.emotions.updateData([{
                name: AGGRESSIVE_EMO,
                source_id: self.d.id,
                source_type: EmotionsData.OBJECT_TYPE.NPC
            }]);
        }
    };

    const firstAfterUpdate = () => {
        setKind(getEngine().npcs.findKindNpc(this));
        //self.getDataDrawer().initOrder();
    }

    this.afterUpdate = function(data, old) {

        if (data.icon) self.updateIcon(data['icon'], old['icon'], data);

        if (isset(this.d.del)) return this.delete(); // TODO .del is deprecated!

        if (isset(this.d.elasticLevelFactor)) {
            this.elasticLevel = this.getElasticMobLevel();
        }

        let externalPropertiesExist = isset(this.d.external_properties);

        if (externalPropertiesExist) {
            Engine.characterEffectsMapManager.removeCharacterEffectFromDeleteCharacter(this.canvasObjectType, self.d.id);
            //Engine.rajMapEvents.clearAllEventsByNpcId(self.d.id);
            removeAllExtraLights();
            Engine.rajController.parseObject(this.d.external_properties, [
                RajData.BATTLE_EVENTS,
                RajData.EMO_ACTIONS
            ], {
                npcId: self.d.id
            });
        }


        //if (this.d.lvl || this.d.type != 4) {
        if (drawNickOrTip()) {
            //this.tip = [Engine.npcs.getTip(self), 't_npc'];
            this.createTipFromNpcData();
        }

        this.manageWalkOver(data);
        self.manageEmo();


        //if (externalPropertiesExist) Engine.rajController.parseObject(this.d.external_properties, [RajData.keys.BATTLE_EVENTS], {npcId:self.d.id});

        trackLock.unlock('afterUpdate');
    };

    const drawNickOrTip = () => {
        return CFG.debug || this.d.lvl || this.d.type != 4;
    }

    this.createTipFromNpcData = () => {
        this.tip = [getEngine().npcs.getTip(this), 't_npc'];
    }

    this.manageWalkOver = (data) => {
        delete this.d.walkover;

        if (data.walkover) {
            this.d.walkover = 1;
            this.walkOver = true;
            this.deleteNpcCollision();
        } else {
            this.walkOver = false;
            let t = data.type;
            // if (t != 4 || (t == 7 && _l() == 'en') ) {
            //if (t != 4 || (t == 7 && isEn()) ) {
            if (self.checkNpcHasCollision(t)) {
                this.addNpcCollisionOrDeleteOldCollisionAndAddNewCollision(data);
            }
        }
    };

    this.refreshTip = () => {
        if (!this.d.hasOwnProperty('elasticLevelFactor')) return;

        //if (this.d.lvl || this.d.type != 4) {
        if (drawNickOrTip()) {
            //this.tip = [Engine.npcs.getTip(self), 't_npc'];
            this.createTipFromNpcData();
        }
    };

    this.debugRefreshTip = () => {
        //this.tip = [Engine.npcs.getTip(self), 't_npc'];
        this.createTipFromNpcData();
    }

    this.getElasticMobLevelAfterSubElasticLevelFactor = () => {

        let eLF = parseInt(this.d.elasticLevelFactor);

        if (!Engine.party) return parseInt(Engine.hero.d.lvl) + eLF;

        let member = Engine.party.getMemberFromHeroMapWithTheBigestLevel();

        return member ? (parseInt(member.d.lvl) + eLF) : (parseInt(Engine.hero.d.lvl) + eLF);
    };

    this.getElasticMobLevel = () => {
        let level = this.getElasticMobLevelAfterSubElasticLevelFactor();

        return Math.min(level, 300);
    };

    this.getOrder = function() {
        if (!self.initOrder) {
            this.order = 0.2;
            if (this.d.type == 4 || this.d.type == 7) {
                this.order += parseInt(this.d.wt);
                if (this.order < 0) {
                    return 0.01; // behind ground items
                }
            }
            this.initOrder = true;
        }
        return this.ry + this.order + this.tutorialOrder;
    };

    this.increaseTutorialOrder = () => {
        this.tutorialOrder = 301;
    };

    this.clearTutorialOrder = () => {
        this.tutorialOrder = 0;
    };

    this.onhover = function(e, show) {
        self.overMouse = show;
        self.setCursor(show);
        var idGroup = self.grp;
        if (self.grp) Engine.npcs.groupShining(idGroup, show);
    };

    this.setCursor = function(show) {
        const $GC = Engine.interface.get$GAME_CANVAS();
        const t = this.d.type;
        const CURSOR = ColliderData.CURSOR;

        if (show) {

            let gateUrl = getEngine().npcs.isGateUrl(self.d.icon);
            if (gateUrl) {
                $GC.addClass(CURSOR.DO_ACTION);
                return;
            }

            //if (t == 7) 						$GC.addClass('do-action-cursor');
            //if (t == 0 || t == 5 || t == 6) 	$GC.addClass('dialogue-cursor');
            //if (t == 2 || t == 3) 				$GC.addClass('attack-cursor');
            if (t == 7) $GC.addClass(CURSOR.PICK_UP);
            if (t == 0 || t == 5 || t == 6) $GC.addClass(CURSOR.DIALOGUE);
            if (t == 2 || t == 3) $GC.addClass(CURSOR.ATTACK);
            //} else 									$GC.removeClass('get-cursor do-action-cursor dialogue-cursor attack-cursor')
        } else $GC.removeClass(`${CURSOR.DO_ACTION} ${CURSOR.PICK_UP} ${CURSOR.DIALOGUE} ${CURSOR.ATTACK}`);
    };

    this.elliteIIWithSmallLevel = function() {
        var isElliteIIMob = this.isEliteIIMob(self);

        if (isElliteIIMob) {
            if (self.mobHaveLevelOverweight(isElliteIIMob, 50)) return isElliteIIMob;
        } else {
            if (!self.hasOwnProperty('grp')) return false;
            var _grp = Engine.npcs.getAllGroup()[self.grp];

            if (!_grp) {
                return
            }

            let grp = grp.list;

            for (var i = 0; i < grp.length; i++) {
                isElliteIIMob = this.isEliteIIMob(grp[i]);
                if (isElliteIIMob) {
                    if (self.mobHaveLevelOverweight(isElliteIIMob, 50)) return isElliteIIMob;
                }
            }
        }
    };

    this.isEliteIIMob = function(obj) {
        return obj.d.wt < 30 && obj.d.wt > 19 ? obj : null;
    };

    this.mobHaveLevelOverweight = function(mob, amount) {
        return Engine.hero.d.lvl - mob.d.lvl > amount
    };

    this.isTalkNpc = () => {
        let type = this.d.type;

        return type == 0 || type == 5 || type == 6;
    };

    this.oncontextmenu = (e) => {
        e.stopPropagation();

        let npcAndPlayerOnTile = self.npcAndPlayerOnTile();
        let type = this.d.type;
        let isCall = false;

        //if ((type == 0 || type == 5 || type == 6 || type == 7) && npcAndPlayerOnTile) {
        if ((type == 0 || type == 5 || type == 6 || type == 7)) {
            let menu = [];
            let actionName = 'talk';

            if (type === 7) {
                actionName = 'take';
            }

            let gateUrl = getEngine().npcs.isGateUrl(self.d.icon);
            if (gateUrl) {
                actionName = 'go';
            }

            menu.push([_t(actionName, null, 'menu'), function() {
                if (!Engine.hero.getAutoGw()) {
                    Engine.hero.addAfterFollowAction(self, function() {
                        Engine.hero.sendRequestToTalk(self.d.id);
                    });
                }
            }]);

            isCall = true;
            self.addDebugOptionMenu(menu);

            if (!Engine.dialogue) {
                //if (menu.length == 1 && !npcAndPlayerOnTile) menu[0][1]();
                //else {
                if (!e) return;
                Engine.interface.showPopupMenu(menu, e, true)
                //}
            }
            return;
        }

        if (type == 2 || type == 3) {

            isCall = true;
            callDebugMenu(e);


            let far = self.getFar();
            if (far) {
                //if (!Engine.opt(7))
                if (isSettingsOptionsMouseHeroWalkOn()) {
                    Engine.hero.autoGoTo({
                        x: self.d.x,
                        y: self.d.y
                    }, false);
                }
                return false;
            }

            Engine.hero.heroAtackRequest(self.d.id, true);
            return false;
        }

        if (!isCall) callDebugMenu(e);
    };

    //const addDebugOptionMenu = (menu) => {
    //	if (!CFG.debug) return;
    //
    //	let _id 		= self.getId();
    //	let _nick 		= self.getNick();
    //	let iconUrl		= self.d.icon;
    //	let relativeUrl = CFG.r_npath + iconUrl;
    //	let absoluteUrl = cdnUrl + relativeUrl;
    //
    //	menu.push(['Info', function () {
    //		mAlert(`
    //		 ${_id}<br>
    //		 ${_nick}<br>
    //		 ${iconUrl}<br>
    //		 ${relativeUrl}<br>
    //		 <a target="_blank" href="${absoluteUrl}">${absoluteUrl}</a>
    //		`);
    //	}]);
    //
    //	menu.push(['Copy id', 			function () {copyClipboard(_id);}]);
    //	menu.push(['Copy nick', 		function () {copyClipboard(_nick);}]);
    //	menu.push(['Copy short url', 	function () {copyClipboard(iconUrl);}]);
    //	menu.push(['Copy relative url', function () {copyClipboard(relativeUrl);}]);
    //	menu.push(['Copy absolute url', function () {copyClipboard(absoluteUrl);}]);
    //};

    const callDebugMenu = (e) => {
        if (!CFG.debug) return
        let menu = [];
        this.addDebugOptionMenu(menu);
        Engine.interface.showPopupMenu(menu, e, true)
    };

    this.getFar = () => {
        return Math.abs(Engine.hero.d.x - this.d.x) > 1 || Math.abs(Engine.hero.d.y - this.d.y) > 1;
    };

    this.npcAndPlayerOnTile = () => {
        if (Engine.hero.d.x == this.d.x && Engine.hero.d.y == this.d.y) return true;
        let others = Engine.others.check();
        let x = this.d.x;
        let y = this.d.y;
        for (let k in others) {
            let o = others[k];
            if (o.d.x == x && o.d.y == y) return true;
        }
        return false;
    };

    this.onclick = function(e) {
        e.stopPropagation();
        var ret = true;

        var far = self.getFar();
        let hero = getEngine().hero;

        //self.addFollow();
        followController.addFollowGlow();

        if (far) {
            //if (!Engine.opt(7))
            if (isSettingsOptionsMouseHeroWalkOn()) {
                hero.autoGoTo({
                    x: self.d.x,
                    y: self.d.y
                }, false);
            }
            return false;
        } else ret = false;

        if (self.d.walkover && !hero.samePosWithHero(self.d.x, self.d.y)) {
            //if (!Engine.opt(7)) hero.autoGoTo({ x: self.d.x, y: self.d.y }, false);
            if (isSettingsOptionsMouseHeroWalkOn()) {
                hero.autoGoTo({
                    x: self.d.x,
                    y: self.d.y
                }, false);
            }
            return false;
        }

        var type = this.d.type;

        if (type == 4) return ret;
        if (type == 0 || type == 6 || type == 7) {
            if (!Engine.hero.getAutoGw()) {
                Engine.hero.sendRequestToTalk(self.d.id);
                return ret
            }
        }

        if (type == 2 || type == 3) {
            Engine.hero.heroAtackRequest(self.d.id, false);
            return ret
        }

        if (type == 5) {
            Engine.hero.sendRequestToTalk(self.d.id);
            return ret
        }
        return ret;
    };

    this.checkActionsBitByName = (name, _actions) => {
        let bitPos = NpcData.BITS[name];
        let exist = false;
        let actions = isset(_actions) ? _actions : this.d.actions;

        if (bitPos == NpcData.BITS.DEPO) {
            if ((actions >> NpcData.BITS.DEPO) & 1) exist = true;
            if ((actions >> NpcData.BITS.DEPO_CLAN) & 1) exist = true;
        } else if ((actions >> bitPos) & 1) exist = true;

        return exist;
    }

    this.getExternalProperties = () => {
        return this.d.external_properties;
    }

    this.getNick = () => {
        return this.d.nick;
    };

    this.getX = () => {
        return this.d.x;
    };

    this.getY = () => {
        return this.d.y;
    };

    const getFw = function() {
        return this.fw;
    };

    const getFh = function() {
        return this.fh;
    };

    const getOffsetX = function() {
        return isset(this.ofsetX) ? this.ofsetX : 0;
    };

    const getOffsetY = function() {
        return isset(this.ofsetY) ? this.ofsetY : 0;
    };

    this.getDir = () => {
        return this.dir;
    };

    this.getActiveFrame = () => {
        return this.activeFrame;
    };

    this.getImg = () => {
        return this.d.icon;
    };

    this.getData = () => {
        return this.d;
    }

    this.getOldImg = () => {
        return null;
    };

    this.getId = () => {
        return this.d.id
    }

    this.getProf = () => {
        return this.d.prof;
    };

    const setGateNpc = (state) => {
        gateNpc = state;
    }

    const isGateNpc = () => {
        return gateNpc;
    }

    const getLevel = () => {
        return this.d.lvl;
    }

    const isMachine = () => {
        return this.d.type == 5;
    }

    const isGroup = () => {
        return isset(self.grp);
    }

    const getGroup = () => {
        return isset(self.grp) ? self.grp : null;
    }

    const setKind = (_kind) => {
        kind = _kind
    }

    const getCanvasObjectType = () => {
        return this.canvasObjectType
    }

    const getWt = () => {
        return this.d.wt;
    }

    const checkKillTimer = () => {
        return this.killTimer ? true : false;
    }

    const getElasticLevel = () => {
        return this.elasticLevel;
    }

    this.hasOnetimeQuest = function() {
        self.addEmoToQm(EmotionsData.NAME.NORMAL_QUEST);
    }

    this.hasDailyQuest = function() {
        self.addEmoToQm(EmotionsData.NAME.DAILY_QUEST);
    }

    const getHasOnetimeQuest = () => {
        return this.d.hasOnetimeQuest ? true : false;
    }

    const getHasDailyQuest = () => {
        return this.d.hasDailyQuest ? true : false;
    }

    const getType = () => {
        return this.d.type;
    }

    const getKind = () => kind

    const resetActiveFrame = () => {
        this.activeFrame = 0;
    }

    const getTpl = () => {
        return this.d.tpl;
    }

    const getSprite = () => {
        return this.sprite;
    }

    const isIconInvisible = () => {
        return isset(this.d.isIconInvisible) ? this.d.isIconInvisible : false;
    }

    this.addExtraLightId = addExtraLightId;
    this.getFreeIdOfExtraLights = getFreeIdOfExtraLights;
    this.drawNickOrTip = drawNickOrTip;
    this.isGateNpc = isGateNpc;
    this.isMachine = isMachine;
    this.getLevel = getLevel;
    this.getGroup = getGroup;
    this.isGroup = isGroup;
    this.getKind = getKind;
    this.getTpl = getTpl;
    this.firstAfterUpdate = firstAfterUpdate;
    this.getCanvasObjectType = getCanvasObjectType;
    this.getWt = getWt;
    this.getType = getType;
    this.checkKillTimer = checkKillTimer;
    this.getElasticLevel = getElasticLevel;
    this.resetActiveFrame = resetActiveFrame;
    this.getHasOnetimeQuest = getHasOnetimeQuest;
    this.getHasDailyQuest = getHasDailyQuest;
    this.getSprite = getSprite;
    this.getFw = getFw;
    this.getFh = getFh;
    this.getOffsetX = getOffsetX;
    this.getOffsetY = getOffsetY;
    this.isIconInvisible = isIconInvisible;

};
Npc.prototype = Object.create(Character.prototype);

Npc.prototype.constructor = Npc;

module.exports = Npc;