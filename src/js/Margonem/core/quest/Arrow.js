/**
 * Created by Michnik on 2015-04-30.
 */
var Updateable = require('@core/Updateable');
var TrackArrow = function() {
    var self = this;
    this.enabled = true;
    this.d = {};
    this.collider = {};
    this.img = null;
    this.radians = 0;
    this.parent = null;
    this.objParent = null;
    this.typeParent = null;
    //this.alwaysDraw = true;
    let alwaysDraw;


    this.init = () => {
        setAlwaysDraw(true);
    }

    this.getOrder = function() {
        //return this.posY - 1;
        return 1000;
        //return getEngine().renderer.getWithoutSortOrder();
    };

    const getParentObject = () => {
        let parentObj;
        if (getEngine().rajTracking.checkParent()) parentObj = getEngine().rajTracking.getParent();
        else parentObj = Engine.hero;

        return parentObj
    }

    this.getRadians = function(pos) {
        let parentObject = getParentObject();

        return Math.atan2((parseInt(pos[2]) - parentObject.ry), (parseInt(pos[1]) - parentObject.rx));
    };

    this.update = function(dt) {
        //var pos = this.parent ? ['?', this.objParent.x, this.objParent.y] : ['?', 0, 0];
        var pos = self.getPos();
        if (!pos) {
            Engine.targets.deleteArrow(self.id);
            return
        }

        //var radians = Math.atan2((parseInt(pos[2]) - Engine.hero.ry ), ( parseInt(pos[1]) - Engine.hero.rx ));

        let parentObject = getParentObject();

        var dx = parentObject.rx - parseInt(pos[1]);
        var dy = parentObject.ry - parseInt(pos[2]);
        var dv = Math.max(Math.abs(dx), Math.abs(dy));
        var distance = Math.sqrt(dx * dx + dy * dy);
        var dist = Math.min(99, 16 * distance);
        var fade = this.setFade(distance);
        if (dv) {
            dx = Math.round(dist * dx / dv);
            dy = Math.round(dist * dy / dv);
        } else {
            dx = 0;
            dy = 0;
        }

        //self.opacity = 0.6 * (fade > 0 ? Math.min(1, fade) : 1);
        self.opacity = fade > 0 ? Math.min(1, fade) : 1;
        self.radians = self.getRadians(pos);
        self.enabled = fade > 0;
        self.posX = ((parentObject.rx - Engine.map.offset[0] / 32) * 32) - dx;
        self.posY = ((parentObject.ry - Engine.map.offset[1] / 32) * 32) - dy;
        self.updateCollider();
    };

    this.setFade = (distance) => {
        var min = 50,
            max = 130;
        var d2 = Math.min(max, 32 * distance);

        var range = max - min;
        var tdist = d2 - max + range;
        return tdist >= range ? 1 : (tdist <= 0 ? 0 : tdist / range);
    };

    this.getPos = function() {
        var pos;
        if (self.parent) {
            switch (self.typeParent) {
                case 'Npc':
                    if (!Engine.npcs.getById(self.objParent.d.id)) return false;
                    pos = ['?', self.objParent.rx, self.objParent.ry];
                    break;
                case 'Other':
                    if (!Engine.others.getById(self.objParent.d.id)) return false;
                    pos = ['?', self.objParent.rx, self.objParent.ry];
                    break;
                case 'Item':
                    if (!Engine.items.getItemById(self.objParent.id)) return false;
                    pos = ['?', self.objParent.x, self.objParent.y];
                    break;
                case 'TRACKING_ARROW':
                case 'SRAJ_TRACKING_ARROW':
                    pos = ['?', self.objParent.x, self.objParent.y];
                    break;
                default:
                    console.warn('[Arrow.js, getPos] buug');
                    return false;
                    break;
            }
        } else pos = ['?', 0, 0];
        return pos;
    };

    this.updateCollider = function() {
        this.collider = {
            box: [
                Engine.map.offset[0] + self.posX + 12 - self.fw / 2,
                Engine.map.offset[1] + self.posY + 24 - self.fh,
                Engine.map.offset[0] + self.posX + 12 + self.fw / 2,
                Engine.map.offset[1] + self.posY + 24
            ]
        };
    };

    this.draw = function(ctx) {
        if (!this.enabled) return;
        ctx.globalAlpha = this.opacity;
        ctx.save();
        ctx.translate(this.posX, this.posY);
        ctx.translate(this.fw / 2, this.fh / 2);
        ctx.rotate(this.radians);
        if (this.img) ctx.drawImage(this.img, -this.fw / 2, -this.fh / 2);
        ctx.restore();
        ctx.globalAlpha = 1;
    };

    this.afterUpdate = function() {
        if (!self.img) {
            //var img = new Image();
            //img.src = self.src ? this.src : '/img/qt-arrow.png';
            //img.onload = function () {
            //	self.fh = 24;
            //	self.fw = 24;
            //	self.img = this;
            //};

            let url = self.src ? this.src : '/img/qt-arrow.png';

            Engine.imgLoader.onload(url, false, false, (i) => {
                this.fh = 24;
                this.fw = 24;
                this.img = i;
            })
        }

        self.updateCollider();
    };

    this.onUpdate = new(function() {
        this.opacity = function(val) {
            self.opacity = val;
        };
        this.posX = function(val) {
            self.posX = val;
        };
        this.posY = function(val) {
            self.posY = val;
        };
        this.enabled = function(val) {
            self.enabled = val;
        };
        this.bgX = function(val) {
            self.bgX = val;
        };
        this.tip = function(val) {
            this.tip = ['' + parseBasicBB(val)];
        };
        this.radians = function(val) {
            self.radians = val;
        };
    })();

    const getAlwaysDraw = () => {
        return alwaysDraw
    };

    const setAlwaysDraw = (_alwaysDraw) => {
        alwaysDraw = _alwaysDraw
    };

    this.getAlwaysDraw = getAlwaysDraw;
    this.setAlwaysDraw = setAlwaysDraw;

};

TrackArrow.prototype = Object.create(Updateable.prototype);

module.exports = TrackArrow;