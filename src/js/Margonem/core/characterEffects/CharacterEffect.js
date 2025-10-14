let CharacterEffectsData = require('@core/characterEffects/CharacterEffectsData');
let HeroDirectionData = require('@core/characters/HeroDirectionData');
let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');

let CharacterEffect = function() {};

CharacterEffect.prototype.id = null;
CharacterEffect.prototype.x = null;
CharacterEffect.prototype.y = null;
//CharacterEffect.prototype.name          = null;
CharacterEffect.prototype.actualRepeat = 1;
CharacterEffect.prototype.data = null;
CharacterEffect.prototype.master = null;
CharacterEffect.prototype.fw = null;
CharacterEffect.prototype.fh = null;

CharacterEffect.prototype.delayBefore = null;
CharacterEffect.prototype.delayAfter = null;

CharacterEffect.prototype.cycleFinish = null;

CharacterEffect.prototype.getCycleFinish = function() {
    return this.cycleFinish;
};

CharacterEffect.prototype.setCycleFinish = function(state) {
    this.cycleFinish = state;
};

CharacterEffect.prototype.initObject = function(_id, _data) {
    this.setId(_id);
    this.setData(_data);
    //this.setName();
    this.setMaster(this.findMaster());

    let master = this.getMaster();
    if (!master) return;

    this.setXFromMaster();
    this.setYFromMaster();
};

CharacterEffect.prototype.isDelayBeforeInParams = function() {
    let data = this.getData();

    return data.params.delayBefore ? true : false;
};

CharacterEffect.prototype.setDelayBefore = function(v) {
    this.delayBefore = v
};

CharacterEffect.prototype.increaseDelayBefore = function(v) {
    this.setDelayBefore(this.delayBefore + v);
};

CharacterEffect.prototype.isDelayBeforeReach = function() {
    let data = this.getData();
    return this.delayBefore > data.params.delayBefore * 100;
};

CharacterEffect.prototype.isDelayAfterInParams = function() {
    let data = this.getData();

    return data.params.delayAfter ? true : false;
};

CharacterEffect.prototype.setDelayAfter = function(v) {
    this.delayAfter = v
};

CharacterEffect.prototype.increaseDelayAfter = function(v) {
    this.setDelayAfter(this.delayAfter + v);
};

CharacterEffect.prototype.isDelayAfterReach = function() {
    let data = this.getData();
    return this.delayAfter > data.params.delayAfter * 100;
};

CharacterEffect.prototype.shouldBreakDrawFromDelayBefore = function() {
    return this.isDelayBeforeInParams() && !this.isDelayBeforeReach()
};


CharacterEffect.prototype.setPosFromMaster = function() {
    let master = this.getMaster();
    if (!master) return;

    this.setXFromMaster();
    this.setYFromMaster();
}

CharacterEffect.prototype.setXFromMaster = function() {
    let master = this.getMaster();
    this.setX(master.rx);
};

CharacterEffect.prototype.setFw = function(_fw) {
    this.fw = _fw
};

//CharacterEffect.prototype.getChainIndex = function (_chainIndex) {
//  let data = this.getData();
//
//  if (!data.chainEffects) return null;
//
//  if (data.chainEffects.chainEffects != null) return data.chainEffects.chainEffects
//
//  return null;
//};

CharacterEffect.prototype.getFw = function() {
    return this.fw;
};

CharacterEffect.prototype.getFh = function() {
    return this.fh;
};

CharacterEffect.prototype.setFh = function(_fh) {
    this.fh = _fh
};

//CharacterEffect.prototype.setName = function () {
//  this.name = this.data.name
//};

//CharacterEffect.prototype.getName = function () {
//  return this.name;
//};

CharacterEffect.prototype.setYFromMaster = function() {
    let master = this.getMaster();
    this.setY(master.ry);
};

CharacterEffect.prototype.setX = function(_x) {
    this.x = _x
    this.rx = this.x
};

CharacterEffect.prototype.setY = function(_y) {
    this.y = _y;
    this.ry = this.y;
};

CharacterEffect.prototype.getX = function() {
    return this.x;
};

CharacterEffect.prototype.getY = function() {
    return this.y;
};

CharacterEffect.prototype.findMaster = function() {
    let data = this.getData();
    let kind = data.target.kind;
    let id = data.target.id;
    let master = null;


    switch (kind) {
        case CanvasObjectTypeData.FAKE_NPC:
            master = Engine.fakeNpcs.getById(id);
            break;
        case CanvasObjectTypeData.NPC:
            master = Engine.npcs.getById(id);
            break;
        case CanvasObjectTypeData.HERO:
            master = Engine.hero;
            break;
        case CanvasObjectTypeData.PET:
            master = Engine.hero.pet ? Engine.hero.pet : Engine.hero;
            break;
        default:
            errorReport('CharacterEffect.js', 'findMaster', 'incorrect attr kind!', data);
            return null
    }

    if (!master) {
        errorReport('CharacterEffect.js', 'findMaster', 'Master not exits!', data);
        return null
    }

    return master;
};

CharacterEffect.prototype.setMaster = function(_master) {
    this.master = _master;
};

CharacterEffect.prototype.getMaster = function() {
    return this.master;
};

CharacterEffect.prototype.getMasterKindObject = function() {
    let master = this.getMaster();

    return master.getCanvasObjectType();
};

CharacterEffect.prototype.getMasterId = function() {
    let master = this.getMaster();

    return master.d.id;
};

CharacterEffect.prototype.getOrder = function() {
    let data = this.getData();
    let up = this.textOrder ? this.textOrder : 0;

    if (data.params.behind) {
        let master = this.getMaster();
        return master.ry - 0.1;
    }

    return 10000 + up;
};

CharacterEffect.prototype.getActualRepeat = function() {
    return this.actualRepeat;
};

CharacterEffect.prototype.setActualRepeat = function(_actualRepeat) {
    this.actualRepeat = _actualRepeat;
};

CharacterEffect.prototype.getOffsetX = function() {
    let data = this.getData();

    return data.params.offsetX ? data.params.offsetX : 0;
};


CharacterEffect.prototype.getOffsetY = function() {
    let data = this.getData();

    return data.params.offsetY ? data.params.offsetY : 0;
};

CharacterEffect.prototype.getRepeat = function() {
    let data = this.getData();

    return data.params.repeat ? data.params.repeat : null;
};

CharacterEffect.prototype.setId = function(_id) {
    this.id = _id
};

CharacterEffect.prototype.setData = function(_data) {
    this.data = _data;
};

CharacterEffect.prototype.getEffect = function() {
    let data = this.getData();
    return data.effect;
}

CharacterEffect.prototype.getData = function() {
    return this.data;
};

CharacterEffect.prototype.getId = function() {
    return this.id;
};

CharacterEffect.prototype.getPos = function() {
    let x = this.getX();
    let y = this.getY();
    let master = this.getMaster();
    let leftPosMod = (typeof(master.leftPosMod) != 'undefined' ? master.leftPosMod : 0);
    // let offset = isset(master.ofsetX) ? master.ofsetX : 0

    let offsetX = this.getOffsetX();
    let offsetY = this.getOffsetY();

    let modify = this.getPositionModify();
    let mapShift = Engine.mapShift.getShift();

    let left = x * CFG.tileSize - Engine.map.offset[0] - mapShift[0] + modify[0] + leftPosMod + offsetX;
    let top = y * CFG.tileSize - Engine.map.offset[1] - mapShift[1] + modify[1] + CFG.tileSize + offsetY;

    return {
        left,
        top
    }
}

CharacterEffect.prototype.correctPosition = function(position) {

    switch (position) {
        case CharacterEffectsData.position.CENTER:
        case CharacterEffectsData.position.LEFT:
        case CharacterEffectsData.position.RIGHT:
        case CharacterEffectsData.position.TOP:
        case CharacterEffectsData.position.BOTTOM:
            return position
    }

    let master = this.getMaster();
    let dir = master.dir;

    switch (dir) {
        case HeroDirectionData.N:

            switch (position) {
                case CharacterEffectsData.position.FRONT:
                    return CharacterEffectsData.position.TOP;
                case CharacterEffectsData.position.BACK:
                    return CharacterEffectsData.position.BOTTOM;
                case CharacterEffectsData.position.LEFT_HAND:
                    return CharacterEffectsData.position.LEFT;
                case CharacterEffectsData.position.RIGHT_HAND:
                    return CharacterEffectsData.position.RIGHT;
            }
            break;
        case HeroDirectionData.S:

            switch (position) {
                case CharacterEffectsData.position.FRONT:
                    return CharacterEffectsData.position.BOTTOM;
                case CharacterEffectsData.position.BACK:
                    return CharacterEffectsData.position.TOP;
                case CharacterEffectsData.position.LEFT_HAND:
                    return CharacterEffectsData.position.RIGHT;
                case CharacterEffectsData.position.RIGHT_HAND:
                    return CharacterEffectsData.position.LEFT;
            }

            break;
        case HeroDirectionData.E:

            switch (position) {
                case CharacterEffectsData.position.FRONT:
                    return CharacterEffectsData.position.RIGHT;
                case CharacterEffectsData.position.BACK:
                    return CharacterEffectsData.position.LEFT;
                case CharacterEffectsData.position.LEFT_HAND:
                    return CharacterEffectsData.position.TOP;
                case CharacterEffectsData.position.RIGHT_HAND:
                    return CharacterEffectsData.position.BOTTOM;
            }

            break;
        case HeroDirectionData.W:

            switch (position) {
                case CharacterEffectsData.position.FRONT:
                    return CharacterEffectsData.position.LEFT;
                case CharacterEffectsData.position.BACK:
                    return CharacterEffectsData.position.RIGHT;
                case CharacterEffectsData.position.LEFT_HAND:
                    return CharacterEffectsData.position.BOTTOM;
                case CharacterEffectsData.position.RIGHT_HAND:
                    return CharacterEffectsData.position.TOP;
            }

            break;
    }
}

CharacterEffect.prototype.getPositionModify = function() {
    let master = this.getMaster();

    if (!master) return;

    let fw = this.getFw();
    let fh = this.getFh();
    let data = this.getData();
    let position = null;

    let effect = this.getEffect();

    switch (effect) {
        case CharacterEffectsData.effect.ANIMATION:
            position = this.correctPosition(data.params.position);
            break;
        case CharacterEffectsData.effect.TINT:
            position = CharacterEffectsData.position.CENTER;
            break;
        case CharacterEffectsData.effect.TEXT:
            position = CharacterEffectsData.position.TOP;
            break;
        default:
            errorReport('CharacterEffect.js', 'getPositionModify', 'incorrect attr effect!', data);
            return [0, 0];
    }


    switch (position) {
        case CharacterEffectsData.position.CENTER:
            // return [-fw / 2 + master.fw / 2, -fh / 2 - master.fh / 2]
            return [-fw / 2 + CFG.tileSize / 2, -fh / 2 - master.fh / 2]
        case CharacterEffectsData.position.LEFT:
            return [-fw, -fh / 2 - master.fh / 2]
        case CharacterEffectsData.position.RIGHT:
            return [master.fw, -fh / 2 - master.fh / 2]
        case CharacterEffectsData.position.TOP:
            return [-fw / 2 + master.fw / 2, -master.fh - fh]
        case CharacterEffectsData.position.BOTTOM:
            return [-fw / 2 + master.fw / 2, 0]
        default:
            errorReport('CharacterEffect.js', 'getPositionModify', 'incorrect attr position!', data)
            return [0, 0];
    }

}

module.exports = CharacterEffect;