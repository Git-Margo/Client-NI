/**
 * shared mechanics of hero and other players objects
 */
var Updateable = require('core/Updateable');
let HeroDirectionData = require('core/characters/HeroDirectionData');
//var DynamicLightIdManager 	= require('core/night/DynamicLightIdManager');
var ObjectDynamicLightManager = require('core/night/ObjectDynamicLightManager');
let CanvasObjectCommons = require('core/characters/CanvasObjectCommons.js');
let DataDrawer = require('core/DataDrawer.js');

let moduleData = {
    fileName: "Character.js"
};

var Character = function() {};

function putIntoWater(ctx, image, bgX, bgY, left, top, fw, fh) {
    ctx.globalAlpha = 0.25;
    ctx.drawImage(image, bgX, bgY, fw, fh, left, top, fw, fh);
    ctx.globalAlpha = 1;
}

function initStaticAnimation() {
    if (IE) Character.prototype.staticAnimation = true;
    //else Character.prototype.staticAnimation = Engine.opt(8);
    else Character.prototype.staticAnimation = !isSettingsOptionsInterfaceAnimationOn();
}


Character.prototype.staticAnimation = null;

Character.prototype = Object.create(Updateable.prototype);

Character.prototype.imgLoaded = false;
Character.prototype.onloadProperImg = false;

/**
 * Update html object
 */
Character.prototype.fetchError = function() {
    console.log('fetchError', this, this.d.icon);
    //var self = this;
    //this.bugImg = new Image();
    //this.bugImg.src = "/img/def-npc.gif";
    //this.bugImg.onload = function () {
    //	self.imgLoaded = true;
    //	initStaticAnimation();
    //}
};

Character.prototype.getImgLoaded = function() {
    return this.imgLoaded;
}

Character.prototype.getOnloadProperImg = function() {
    return this.onloadProperImg;
}

Character.prototype.setOnloadProperImg = function(state) {
    return this.onloadProperImg = state;
}

Character.prototype.initDataDrawer = function() {
    let dataDrawer = new DataDrawer();

    dataDrawer.init(this);

    this.updateDataDrawer = (dt) => {
        dataDrawer.update(dt);
    };

    this.getDataDrawer = () => {
        return dataDrawer;
    }

    this.clearDataToDraw = () => {
        dataDrawer.clearDataToDraw();
    }
}

Character.prototype.initOnSelfEmoList = function() {
    let onSelfEmoList = [];

    this.checkEmoExist = () => {
        return onSelfEmoList.length ? true : false;
    };

    this.getEmoLength = () => {
        return onSelfEmoList.length;
    };

    this.removeOnSelfEmoList = (index) => {
        onSelfEmoList.splice(index, 1);
    };

    this.getOnSelfEmoList = () => {
        return onSelfEmoList;
    };

    this.addToOnSelfEmoList = (el) => {
        onSelfEmoList.push(el);
    };

    this.refreshEmotions = () => {
        if (onSelfEmoList.length > 0) {
            for (const emo of onSelfEmoList) {
                emo.setXYOffset();
            }
        }
    };

    this.getEmotionIndex = (emo) => {
        return onSelfEmoList.indexOf(emo);
    }
};

Character.prototype.addDebugOptionMenu = function(menu) {
    CanvasObjectCommons.addDebugOptionMenu(this, menu);
}

Character.prototype.createPlaceHolderCharacter = function() {
    //this.placeHolderCharacter = new Image();
    //this.placeHolderCharacter.src = '../img/def-npc.gif';
    //this.placeHolderCharacter.onload = function () {
    //
    //}

    Engine.imgLoader.onload('../img/def-npc-sprite.gif', false, (i) => {
        this.placeHolderCharacter = i;
    });
};

Character.prototype.initDynamicLightCharacterManager = function() {

    let objectDynamicLightManager = new ObjectDynamicLightManager();

    objectDynamicLightManager.init();

    this.getObjectDynamicLightManager = () => {
        return objectDynamicLightManager
    }

    //let dynamicLightIdManager = new DynamicLightIdManager();
    //dynamicLightIdManager.init();
    //
    //let dynamicDirCharacterLightIdManager = new DynamicLightIdManager();
    //dynamicDirCharacterLightIdManager.init();
    //
    //this.removeAllDynamicLights = () => {
    //
    //	let a = dynamicLightIdManager.getArrayOfDynamicLightIds();
    //
    //	for (let id of a) {
    //		//Engine.dynamicLightsManager.rajRemoveAction(id);
    //		Engine.dynamicLightsManager.rajRemoveActionBeyondManager(id);
    //	}
    //
    //}
    //
    //this.removeDynamicLightId = (id) => {
    //	dynamicLightIdManager.removeDynamicLightId(id);
    //}
    //
    //this.addDynamicLightId = (id) => {
    //	if (dynamicLightIdManager.checkDynamicLightId(id)) {
    //		errorReport(moduleData, "addDynamicLightId", `Id ${id} already exist!`);
    //		return;
    //	}
    //	dynamicLightIdManager.addDynamicLightId(id);
    //};
    //
    //this.removeAllDynamicDirCharacterLights = () => {
    //
    //	let a = dynamicDirCharacterLightIdManager.getArrayOfDynamicLightIds();
    //
    //	for (let id of a) {
    //		Engine.dynamicDirCharacterLightsManager.rajRemoveActionBeyondManager(id);
    //	}
    //
    //};
    //
    //this.removeDynamicDirCharacterLightId = (id) => {
    //	dynamicDirCharacterLightIdManager.removeDynamicLightId(id);
    //};
    //
    //this.addDynamicDirCharacterLightId = (id) => {
    //	if (dynamicDirCharacterLightIdManager.checkDynamicLightId(id)) {
    //		errorReport(moduleData, "addDynamicDirCharacterLightId", `Id ${id} already exist!`);
    //		return;
    //	}
    //	dynamicDirCharacterLightIdManager.addDynamicLightId(id);
    //};
};

Character.prototype.setPlaceHolderIcon = function() {
    let i = this.getPlaceholderCharacter();
    this.fw = 32;
    this.fh = 48;
    this.halffw = 16;
    this.halffh = 24;
    this.activeFrame = 0;
    this.sprite = i;
    this.imgLoaded = true;
    this.frames = [{
        delay: 300
    }];
    this.afterLoadImage();
};

Character.prototype.getPlaceholderCharacter = function() {
    return this.placeHolderCharacter;
};

Character.prototype.changeWarShadowOpacity = function(dt) {
    if (this.warShadowOpacity != 1 && this.imgLoaded) {

        //if (Engine.opt(8)) {
        if (!isSettingsOptionsInterfaceAnimationOn()) {
            this.warShadowOpacity = 1;
            return
        }

        this.warShadowOpacity += dt * 2;

        if (this.warShadowOpacity > 1) {
            this.warShadowOpacity = 1;
            return
        }
    }
};

Character.prototype.decreaseWarShadowOpacity = function(dt) {
    if (this.warShadowOpacity != 0 && this.imgLoaded) {

        //if (Engine.opt(8)) {
        if (!isSettingsOptionsInterfaceAnimationOn()) {
            this.warShadowOpacity = 0;
            return
        }

        this.warShadowOpacity -= dt * 2;

        if (this.warShadowOpacity < 0) {
            this.warShadowOpacity = 0;
            return
        }
    }
};

Character.prototype.isHide = function() {
    return this.warShadowOpacity <= 0;
}

//Character.prototype.bugImg = null;

Character.prototype.warShadowOpacity = 0;

Character.prototype.getCanvasObjectType = function() {
    return this.canvasObjectType;
};

Character.prototype.setWarShadowAlpha = function(ctx) {
    ctx.globalAlpha = this.warShadowOpacity;
};

Character.prototype.setDefaultAlpha = function(ctx) {
    ctx.globalAlpha = 1;
};

Character.prototype.draw = function(ctx) {
    if (!this.imgLoaded) return;

    if (Engine.rajCharacterHide.checkHideObject(this)) return;
    if (Engine.rajMassObjectHide.checkMassObjectsHide(this)) return;
    if (Engine.rajCharacterImageChangerManager.checkHideObject(this)) return;

    this.drawIcon(ctx);
}

Character.prototype.getCharacterLeft = function() {
    let mapShift = Engine.mapShift.getShift();

    var left = this.rx * 32 + 16 - this.halffw +
        (isset(this.ofsetX) ? this.ofsetX : 0) -
        Engine.map.offset[0] - mapShift[0] + (typeof(this.leftPosMod) != 'undefined' ? this.leftPosMod : 0);

    return left;
}

Character.prototype.getCharacterTop = function() {
    let mapShift = Engine.mapShift.getShift();

    var top = this.ry * 32 - this.fh + 32 - Engine.map.offset[1] - mapShift[1];

    return top;
}

Character.prototype.getBgX = function() {
    return this.frame * this.fw;
}

Character.prototype.getBgY = function() {
    let bgY;

    var dir = isset(this.dir) ? this.dir : 'S';

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

    return bgY;
}

Character.prototype.drawIcon = function(ctx, ignoreWraithShadow) {
    //if (!this.imgLoaded) return;
    //
    //if (Engine.rajCharacterHide.checkHideObject(this)) return;
    //if (Engine.rajCharacterImageChangerManager.checkHideObject(this)) return;

    let mapShift = Engine.mapShift.getShift();

    var left = this.rx * 32 + 16 - this.halffw +
        (isset(this.ofsetX) ? this.ofsetX : 0) -
        Engine.map.offset[0] - mapShift[0] + (typeof(this.leftPosMod) != 'undefined' ? this.leftPosMod : 0);

    var top = this.ry * 32 - this.fh + 32 - Engine.map.offset[1] - mapShift[1];


    var dir = isset(this.dir) ? this.dir : 'S';
    var height = this.fh;
    var wpos = Math.round(this.rx) + Math.round(this.ry) * 256,
        wat = 0;
    var bgX = this.frame * this.fw,
        bgY = 0;
    var isWater = false;


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


    if (isset(Engine.map.water[wpos])) {
        wat = this.isPlayer ? Engine.map.water[wpos] : Engine.map.water[wpos] / 4;
        var topModify = this.isPlayer ? ((wat / 4) > 8 ? 0 : wat) : 0;
        top += topModify;

        isWater = true;

        if (!this.isPlayer && this.d.type === 4) {
            isWater = false;
        } else {
            height -= this.isPlayer ? ((wat / 4) > 8 ? (wat - 32) : wat) : (wat > 8 ? ((wat - 8) * 4) : 0);
        }

        this.waterTopModify = topModify;
    }

    left = Math.round(left);
    top = Math.round(top);

    if (this.img || this.staticAnimation) {
        if (isWater) putIntoWater(ctx, this.img || this.sprite, bgX, bgY, left, top, this.fw, this.fh);
        if (!ignoreWraithShadow) this.setWarShadowAlpha(ctx);
        ctx.drawImage(this.img || this.sprite, bgX, bgY, this.fw, height, left, top, this.fw, height);
        this.setDefaultAlpha(ctx);
    } else if (this.sprite && typeof(this.activeFrame) != 'undefined' && this.frames.length > 0 && !this.isPlayer && !this.fake) {
        if (isWater) putIntoWater(ctx, this.sprite, bgX, (bgY + (this.activeFrame * this.fh)), left, top, this.fw, this.fh);
        if (!ignoreWraithShadow) this.setWarShadowAlpha(ctx);
        ctx.drawImage(this.sprite, bgX, bgY + (this.activeFrame * this.fh), this.fw, height, left, top, this.fw, height);
        this.setDefaultAlpha(ctx);
    } else if (this.sprite && typeof(this.activeFrame) != 'undefined' && this.frames.length > 0 && (this.isPlayer || this.fake)) {
        if (isWater) putIntoWater(ctx, this.sprite, bgX, (bgY + (this.activeFrame * this.fh * 4)), left, top, this.fw, this.fh);
        if (!ignoreWraithShadow) this.setWarShadowAlpha(ctx);
        ctx.drawImage(this.sprite, bgX, bgY + (this.activeFrame * this.fh * 4), this.fw, height, left, top, this.fw, height);
        this.setDefaultAlpha(ctx);
    }

    //this.setDefaultAlpha(ctx);
};

Character.prototype.updateCollider = function() {
    let leftPosMod = (typeof(this.leftPosMod) != 'undefined' ? this.leftPosMod : 0);

    let t = this;
    this.collider = {
        box: [
            t.rx * 32 + 16 - t.fw / 2 + leftPosMod,
            t.ry * 32 + 32 - t.fh,
            t.rx * 32 + 16 + t.fw / 2 + leftPosMod,
            t.ry * 32 + 32
        ]
    };
};

Character.prototype.setStaticAnimation = function(state) {
    if (IE) Character.prototype.staticAnimation = true;
    else Character.prototype.staticAnimation = state;
};

//Character.prototype.createPlaceHolderCharacter();

module.exports = Character;