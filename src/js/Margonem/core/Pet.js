/**
 * Created by Michnik on 2015-11-05.
 */
var Updateable = require('core/Updateable');
var PetActions = require('core/PetActions');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let HeroDirectionData = require('core/characters/HeroDirectionData');
let CanvasObjectCommons = require('core/characters/CanvasObjectCommons.js');
let ObjectDynamicLightManager = require('core/night/ObjectDynamicLightManager');
//let ColliderData = require('core/collider/ColliderData');

var Pet = function() {
    var self = this;
    this.d = {};
    this.pos = 0;
    this.frame = 0;

    //this.onSelfEmoList = [];
    this.onSelfMarginEmo = 0;

    // this.stop 				= false;
    // this.canvasObjectType 	= 'Pet';
    this.canvasObjectType = CanvasObjectTypeData.PET;
    this.overMouse = false;
    this.warShadowOpacity = 0;

    let actionFrame = 0;
    this.actionCounter = 0;
    this.dir = 'S';
    this.specialAction = null;

    let actionsDataArray;
    let runActionIndex = null;

    let petActions = new PetActions();
    let timePassed = 0;
    let reached = false;
    let frameTime = 0;
    let diff = 0;
    let posMod = {
        1: [0, -1],
        2: [1, 0],
        3: [0, 1],
        4: [-1, 0]
    };

    let objectDynamicLightManager;

    //var speed = 4.5;
    var speed = 4.9;
    var drawLock = new Lock(['create', 'image', 'master'], function() {
        //self.setStaticAnimation(Engine.opt(8));
        self.setStaticAnimation(!isSettingsOptionsInterfaceAnimationOn());
        self.createTip();
        // self.checkAction();
        self.calculatePosition(self.d.isNew);
        self.updateCollider();
    });

    const init = () => {
        initDynamicLightFloatObjectManager();
    }

    const initDynamicLightFloatObjectManager = () => {
        objectDynamicLightManager = new ObjectDynamicLightManager();
        objectDynamicLightManager.init();
    };



    this.calculatePosition = function(isNew) {
        if (this.d.master == null) return;
        var m = this.d.master;
        var ox = this.d.x,
            oy = this.d.y;

        if (isNew || (!isNew && ((Math.abs(m.d.x - this.d.x) + Math.abs(m.d.y - this.d.y)) > 1) || this.pos)) {
            //var x = m.d.x + ((m.dir == 'W' || m.dir == 'E') ? ((m.dir == 'E' ? -1 : 1)) : 0);
            //var y = m.d.y + ((m.dir == 'S' || m.dir == 'N') ? ((m.dir == 'S' ? -1 : 1)) : 0);

            var x = m.d.x + ((m.dir == HeroDirectionData.W || m.dir == HeroDirectionData.E) ? ((m.dir == HeroDirectionData.E ? -1 : 1)) : 0);
            var y = m.d.y + ((m.dir == HeroDirectionData.S || m.dir == HeroDirectionData.N) ? ((m.dir == HeroDirectionData.S ? -1 : 1)) : 0);

            if (this.pos && isset(posMod[this.pos])) {
                x = m.d.x + posMod[this.pos][0];
                y = m.d.y + posMod[this.pos][1];
            }
            if (Engine.map.col.check(x, y)) {
                x = m.d.x;
                y = m.d.y;
            }
            this.d.x = x;
            this.d.y = y;

            if (isNew) {
                this.rx = x;
                this.ry = y;
            }

            if (ox != this.d.x || this.d.y != oy && !isNew) {

                if (this.checkActionIsRunning()) this.stopAction();

            }
        } else if (this.d.afterReload && (isset(m.d.x) && isset(m.d.y))) { //set pet position same as hero after game reload (on door use)
            this.d.x = m.d.x;
            this.d.y = m.d.y;
            this.d.afterReload = false;
        }
    };

    this.checkActionIsRunning = () => {
        return runActionIndex != null;
    }

    this.update = function(dt) {
        if (!Engine.allInit) return
        self.changeWarShadowOpacity(dt);
        if (this.rx != this.d.x || this.ry != this.d.y) {
            this.checkDiff();
            this.move(dt);
            //this.clearAnimationAndGw();
            this.animate(dt);
            // this.stop = false;
            // console.log(this.frame)
        } else {

            this.animate(dt);
            if (this.checkActionIsRunning()) {
                petActions.updateAction(self, dt);
                return
            }

            this.frame = 0;
            // this.stop = true;
        }
    };

    // var diff = 0;
    this.checkDiff = function() {
        diff = Math.abs(this.d.x - this.rx) + Math.abs(this.d.y - this.ry);
        if (diff > 2) {
            if (diff > 4) this.calculatePosition(true);
            var diffX = this.rx - this.d.x;
            var diffY = this.ry - this.d.y;
            if (diffY > 2) this.ry = this.d.y + 2;
            if (diffY < -2) this.ry = this.d.y - 2;
            if (diffX > 2) this.rx = this.d.x + 2;
            if (diffX < -2) this.rx = this.d.x - 2;
            this.updateCollider();
        }
    };

    // var reached = false;
    // var frameTime = 0;
    this.move = function(dt) {

        // if (drawLock.check().length || this.stop || !dt) return;
        if (drawLock.check().length || !dt) return;
        var l = speed * dt;
        this.run(l);

        frameTime += l;
        if (frameTime >= 0.5) {
            // console.log('up')
            self.frame++;
            frameTime = frameTime % 0.5;
            if (self.frame == (self.anim ? 5 : 4)) {
                self.frame = self.anim ? 1 : 0;
            }
        }
    };

    this.run = function(l) {
        if (this.rx < this.d.x) {
            this.dir = 'E';
            this.rx += l;
            reached = (this.rx >= this.d.x);
        } else if (this.rx > this.d.x) {
            this.dir = 'W';
            this.rx -= l;
            reached = (this.rx <= this.d.x);
        }
        if (reached) {
            this.rx = this.d.x;
            reached = false;
        }
        if (this.ry < this.d.y) {
            this.dir = 'S';
            this.ry += l;
            reached = (this.ry >= this.d.y);
        } else if (this.ry > this.d.y) {
            //this.dir = 'N';
            this.dir = HeroDirectionData.N;
            this.ry -= l;
            reached = (this.ry <= this.d.y);
        }
        if (reached) {
            this.ry = this.d.y;
            reached = false;
        }

        self.updateCollider();
    };

    this.clearAnimationAndGw = function() {
        this.activeFrame = 0;
        timePassed = 0;
    };

    this.animate = function(dt) {
        if (this.frames && this.frames.length > 1 && !IE) {
            timePassed += dt * 100;
            if (this.frames[this.activeFrame].delay < timePassed) {
                timePassed = timePassed - this.frames[this.activeFrame].delay;
                this.activeFrame = (this.frames.length == this.activeFrame + 1 ? 0 : this.activeFrame + 1);
            }
        }
    };

    this.setWarShadowAlpha = function(ctx) {
        ctx.globalAlpha = self.warShadowOpacity;
    };

    this.setDefaultAlpha = function(ctx) {
        ctx.globalAlpha = 1;
    };

    this.changeWarShadowOpacity = function(dt) {
        if (this.warShadowOpacity != 1 && this.imgLoaded) {
            //if (Engine.opt(8)) return this.warShadowOpacity = 1;

            if (!isSettingsOptionsInterfaceAnimationOn()) {
                return this.warShadowOpacity = 1;
            }

            if (this.warShadowOpacity > 1) {
                return this.warShadowOpacity = 1;
            }

            this.warShadowOpacity += dt * 2;
        }
    };

    this.draw = function(ctx) {
        if (drawLock.check().length) return;
        let mapShift = Engine.mapShift.getShift();

        if (Engine.rajCharacterHide.checkHideObject(this)) return;

        let left = this.rx * 32 + 16 - this.fw / 2 +
            (isset(this.ofsetX) ? this.ofsetX : 0) -
            Engine.map.offset[0] - mapShift[0];

        let top = this.ry * 32 - this.fh + 32 - Engine.map.offset[1] - mapShift[1];

        let dir = isset(this.dir) ? this.dir : 'S';
        let height = this.fh;
        let wpos = Math.round(this.rx) + Math.round(this.ry) * 256,
            wat = 0;
        // var bgX = this.frame * this.fw, bgY = 0;
        let bgY = 0;
        let isWater = false;


        if (self.checkActionIsRunning()) {
            switch (actionFrame) {
                case 0:
                    bgY = 0;
                    break;
                case 1:
                    bgY = this.fh;
                    break;
                case 2:
                    bgY = this.fh * 2;
                    break;
                case 3:
                    bgY = this.fh * 3;
                    break;
            }
        } else {
            //switch (dir) {
            //	case 'S': bgY = 0;				break;
            //	case 'W': bgY = this.fh; 		break;
            //	case 'E': bgY = this.fh * 2;	break;
            //	case 'N': bgY = this.fh * 3;	break;
            //}
            switch (dir) {
                case HeroDirectionData.S:
                    bgY = 0;
                    break;
                case HeroDirectionData.W:
                    bgY = this.fh;
                    break;
                case HeroDirectionData.E:
                    bgY = this.fh * 2;
                    break;
                case HeroDirectionData.N:
                    bgY = this.fh * 3;
                    break;
            }
        }

        if (isset(Engine.map.water[wpos])) {
            wat = Engine.map.water[wpos];

            top += ((wat / 4) > 8 ? 0 : wat);
            height -= ((wat / 4) > 8 ? (wat - 32) : wat);

            height = height == 0 ? 1 : height; // fix for FF
            isWater = true;
        }

        left = Math.round(left);
        top = Math.round(top);

        let xPosImg = self.frame * self.fw;
        let yPosImg = bgY + (self.activeFrame * self.fh * 4);

        // if (this.specialAction && this.sx != 0) {
        if (self.checkActionIsRunning()) {
            if (isWater) this.putIntoWater(ctx, this.sprite, xPosImg, yPosImg, left, top, this.fw, this.fh);
            if (this.staticAnimation) {
                self.setWarShadowAlpha(ctx);
                ctx.drawImage(this.sprite, xPosImg, yPosImg, this.fw, height, left, top, this.fw, height);
                self.setDefaultAlpha(ctx);
            } else {
                self.setWarShadowAlpha(ctx);
                ctx.drawImage(this.sprite, xPosImg, yPosImg, this.fw, height, left, top, this.fw, height);
                self.setDefaultAlpha(ctx);
            }

        } else if (this.d.x == this.rx && this.d.y == this.ry) {
            if (this.staticAnimation) {
                if (isWater) this.putIntoWater(ctx, this.sprite, xPosImg, yPosImg, left, top, this.fw, this.fh);
                self.setWarShadowAlpha(ctx);
                ctx.drawImage(this.sprite, xPosImg, yPosImg, this.fw, height, left, top, this.fw, height);
                self.setDefaultAlpha(ctx);
            } else {
                if (isWater) this.putIntoWater(ctx, this.sprite, xPosImg, yPosImg, left, top, this.fw, this.fh);
                self.setWarShadowAlpha(ctx);
                ctx.drawImage(this.sprite, xPosImg, yPosImg, this.fw, height, left, top, this.fw, height);
                self.setDefaultAlpha(ctx);
            }
        } else if (this.sprite && typeof(this.activeFrame) != 'undefined') {
            if (isWater) this.putIntoWater(ctx, this.sprite, xPosImg, yPosImg, left, top, this.fw, this.fh);
            self.setWarShadowAlpha(ctx);
            ctx.drawImage(this.sprite, xPosImg, yPosImg, this.fw, height, left, top, this.fw, height);
            self.setDefaultAlpha(ctx);
        }
    };

    this.putIntoWater = function(ctx, image, bgX, bgY, left, top, fw, fh) {
        ctx.globalAlpha = 0.25;
        ctx.drawImage(image, bgX, bgY, fw, fh, left, top, fw, fh);
        ctx.globalAlpha = 1;
    };

    this.afterUpdate = function() {
        drawLock.unlock('create');
    };

    this.setStaticAnimation = function(state) {
        if (IE) this.staticAnimation = true;
        else this.staticAnimation = state;
    };

    this.beforeOnload = (f, img, val) => {
        var r = new RegExp('-([0-9]+)(a?)\.gif');
        var fData = r.exec(val); //frames aux data

        if (!fData) fData = [0, 0, ''];

        this.auxFrames = isNaN(parseInt(fData[1])) ? 0 : parseInt(fData[1]);
        this.anim = fData[2] == 'a';
        this.frames = f.frames;
        this.activeFrame = 0;

        this.fw = f.hdr.width / (4 + self.auxFrames + (self.anim ? 1 : 0));
        this.fh = f.hdr.height / 4;

        this.sprite = img;
    };

    this.afterOnload = () => {
        drawLock.unlock('image');

        // this.sx         = 0;
        // this.sy         = 0;
        this.imgLoaded = true;
    };

    this.createActionsDataArrayForOther = (actionBin) => {
        actionsDataArray = null;
        actionsDataArray = petActions.createActionsDataArrayForOther(actionBin);
    }

    this.onUpdate = new(function() {
        this.outfit = function(val) {
            self.actionPossible = (isset(self.outfitSrc) && self.outfitSrc != val) ? false : true;
            let outUpdate = !!(!isset(self.outfitSrc) || self.outfitSrc != val);

            if (!outUpdate) return;

            self.outfitSrc = val;
            let url = CFG.r_ppath + val;
            //console.log(url)
            Engine.imgLoader.onload(url, {
                    speed: false,
                    externalSource: cdnUrl
                },
                (i, f) => {
                    this.beforeOnload(f, i, val);
                },
                (i) => {
                    this.afterOnload();
                }
            );

        };
        this.actions = function(val) {
            // var actions = val.split('|');
            // self.frameActions = [];
            // for (var i in actions) {getRunActionIndex
            // 	var data = actions[i].split('#');
            // 	self.frameActions.push({
            // 		name: data[0],
            // 		special: (isset(data[1]) ? parseInt(data[1]) : 3)
            // 	});
            // }
            //console.log(self.frameActions)
            let nameActionArray = val.split("|");
            // console.log(self.pos)
            actionsDataArray = petActions.createActionsDataArrayForHero(nameActionArray, self.pos);
            // console.log(actionsDataArray)
            // console.log(actionsDataArray)
        };
        this.action = function(val) {
            self.pos = petActions.getHalfByte(val, 0);

            if (!Engine.allInit) return;

            let actionIndex = this.findActionIndex(val);

            if (actionIndex == null) return;

            this.callAction(actionIndex);

        };
        this.master = function(val) {

            if (isset(val.d) && isset(val.d.x)) {
                drawLock.unlock('master');
            }
            if (val.d.id) {
                self.d.id = val.d.id;
            }
        };
    })();

    this.findActionIndex = (actionBin) => {

        if (!actionsDataArray) return;

        for (let k in actionsDataArray) {
            if (actionsDataArray[k].actionBinWithDir == actionBin) {
                return actionsDataArray[k].actionIndex;
            }
        }
        //errorReport('Pet.js', 'findActionIndex', 'Not find action bin : ' + actionBin );
        return null
    }

    this.getSpecialByRunActionIndex = () => {

        if (!actionsDataArray) return;

        for (let i = 0; i < actionsDataArray.length; i++) {
            if (actionsDataArray[i].actionIndex == runActionIndex) {
                return actionsDataArray[i].special;
            }
        }
    }

    /*
     * action: multibyte value (max 32bytes)
     * 0x000f - pet position
     * 0x00f0 - pet special action
     * 0x0f00 - special action additional param
     */
    // this.checkAction = function () {
    // 	var pos = self.getHalfByte(self.action, 0);
    // 	if (!self.d.isNew && self.pos == pos && self.actionPossible)  petActions.doAction(self);
    // 	self.pos = pos;
    // };

    this.updateCollider = () => {
        let leftPosMod = (typeof(this.leftPosMod) != 'undefined' ? this.leftPosMod : 0);
        if (this.sprite) this.collider = {
            box: [
                self.rx * 32 + 16 - self.fw / 2 + leftPosMod,
                self.ry * 32 + 32 - self.fh,
                self.rx * 32 + 16 + self.fw / 2 + leftPosMod,
                self.ry * 32 + 32
            ]
        };
    };

    this.getOrder = function() {
        if (!this.ry) return 0;
        return this.ry;
    };

    this.createTip = function() {
        let petTip = '<strong>' + self.d.name + '</strong><br>';

        if (isset(self.d.elite) && self.d.elite) {
            let name = null;
            switch (parseInt(self.d.elite)) {
                case 1:
                    name = 'elite';
                    break;
                case 2:
                    name = 'elite_her';
                    break;
                case 3:
                    name = 'elite_leg';
                    break;
            }
            if (name !== null) {
                name = _t(name, null, 'pet');
                petTip += '<i class="elite cls-' + self.d.elite + '">' + name + '</i>';
            }
        }

        petTip += _t('owner %name%', {
            '%name%': self.d.master.nick
        }, 'pet') + '</span>';
        self.tip = [petTip, 't_pet'];
    };

    // this.unlock = function () {
    // 	this.stopAction(true);
    // 	this.sx = 0;
    // };

    this.stopAction = () => {
        // console.log('stopAction')
        // clearInterval(this.actionInterval);
        // self.activeFrame = 0;
        // self.actionInterval = null;
        // self.specialAction = typeof (unlockMove) != 'undefined' && unlockMove ? false : true;
        // self.stop = typeof (unlockMove) != 'undefined' && unlockMove ? false : true;
        this.setActiveFrame(0);
        this.setActionFrame(0);
        this.setFrame(0);
        this.setRunActionIndex(null);
    };

    this.onmousedown = function() {};

    this.onhover = function(e, show) {
        self.overMouse = show;
        //self.setCursor(show);
        //getEngine().interface.setCursor(show, ColliderData.CURSOR.DO_ACTION);
        getEngine().interface.setDoActionCursor(show);
    };

    //this.setCursor = function (show) {
    //	const $GC = Engine.interface.get$GAME_CANVAS();
    //	const DO_ACTION 	= ColliderData.CURSOR.DO_ACTION;
    //
    //	if (show) 	$GC.addClass(DO_ACTION);
    //	else 		$GC.removeClass(DO_ACTION);
    //};

    this.callAction = (actionIndex) => {
        this.stopAction();
        this.setRunActionIndex(actionIndex);
        petActions.doAction(self);
    }

    this.oncontextmenu = function(e) {
        if (self.d.own) {
            let txt = _t('menu_hide', null, 'pet'); //'Schowaj'
            let m = [];

            if (!isset(self.d.quest) || !self.d.quest) m.push([txt, self.hideMyPet]);
            else m.push([txt, self.hideMyPet.bind(this, true)]);

            // if (self.frameActions) {
            // 	for (var i = 0; i < self.frameActions.length; i++) {
            // 		var a = (1 + i << 4) | (self.frameActions[i].special << 8);
            // 		m.push([self.frameActions[i].name, _g.bind(this, 'pet&a=' + (a))]);
            // 	}he
            // }

            if (actionsDataArray) {
                for (let j = 0; j < actionsDataArray.length; j++) {
                    let name = actionsDataArray[j].name
                    let reqFunc = () => {
                        _g('pet&a=' + actionsDataArray[j].actionBin)
                    }

                    m.push([name, reqFunc]);
                }
            }

            for (let i = 1; i <= 5; i++) {
                if (i == self.pos || (i == 5 && self.pos == 0)) continue;
                let n = '';
                switch (i) {
                    case 5:
                        n = 'menu_comeafter';
                        break; //'IdÅº za mnÄ'
                    case 1:
                        n = 'menu_standbehind';
                        break; //'StaÅ za mnÄ'
                    case 2:
                        n = 'menu_standright';
                        break; //'StaÅ po prawej'
                    case 3:
                        n = 'menu_standfront';
                        break; //'StaÅ przede mnÄ'canvas
                    case 4:
                        n = 'menu_standleft';
                        break; //'StaÅ po lewej'
                }
                n = _t(n, null, 'pet');
                m.push([n, _g.bind(this, 'pet&a=' + i)]);
            }

            CanvasObjectCommons.addDebugOptionMenu(self, m);

            Engine.interface.showPopupMenu(m, e, true);
        } else {
            let m = []
            CanvasObjectCommons.addDebugOptionMenu(self, m);

            if (m.length) Engine.interface.showPopupMenu(m, e, true);
        }

    };

    this.hideMyPet = function(ask) {
        if (isset(ask)) {
            mAlert(_t('are_u_sure', null, 'pet'), [{
                txt: _t('yes'),
                callback: function() {
                    _g('pet&a=0');
                    return true;
                }
            }, {
                txt: _t('no'),
                callback: function() {
                    return true;
                }
            }]); //'Czy jesteÅ pewien ?'
        } else {
            _g('pet&a=0');
        }
    };

    this.getImg = () => {
        return this.d.outfit;
    };

    this.getId = () => {
        return this.d.id;
    }

    this.getNick = () => {
        return this.d.name;
    }

    const getObjectDynamicLightManager = () => {
        return objectDynamicLightManager
    }

    this.getNDir = () => {
        return this.dir;
    };

    const removePet = () => {
        objectDynamicLightManager.removeAllDynamicLights();
        objectDynamicLightManager.removeAllDynamicDirCharacterLights();
        objectDynamicLightManager.removeAllDynamicBehaviorLights();
    };

    // this.setStop            = (state) => {this.stop = state};
    this.setActionFrame = (v) => {
        actionFrame = v
    };
    this.setActiveFrame = (v) => {
        this.activeFrame = v
    }
    this.setActionCounter = (v) => {
        this.actionCounter = v
    };
    this.setDir = (v) => {
        this.dir = v
    };
    this.setFrame = (v) => {
        this.frame = v
    };
    this.setSpecialAction = (state) => {
        this.specialAction = state
    };

    this.setRunActionIndex = (v) => {
        runActionIndex = v;
    }
    this.getRunActionIndex = () => {
        return runActionIndex
    }
    this.getAction = () => {
        return this.action
    }
    this.getActionFrame = () => {
        return actionFrame
    }
    this.getActionCounter = () => {
        return this.actionCounter
    }
    this.getAnim = () => {
        return this.anim
    }

    this.init = init
    this.removePet = removePet
    this.getObjectDynamicLightManager = getObjectDynamicLightManager


};

Pet.prototype = Object.create(Updateable.prototype);

Pet.prototype.constructor = Pet;


module.exports = Pet;