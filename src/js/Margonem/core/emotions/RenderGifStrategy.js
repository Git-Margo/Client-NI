function SpriteObject() {
    this.drawObject = function(dt) {
        this.animateObjectBeforeInTarget(dt);
        if (!this.inTarget || this.afterUse)
            return;
        this.framTime += dt;
        if (this.framTime >= this.parameters.frameTime) {
            this.frame++;
            this.framTime = this.framTime % this.parameters.frameTime;
            this.animateObjectAgainOrDelete();
        }
    };

    this.animateObjectBeforeInTarget = function(dt) {
        if (!this.framesBeforeInTarget)
            return;
        this.framTime += dt;
        if (this.framTime >= this.parameters.frameTime + 0.1) {
            if (this.parameters.framesBeforeInTarget > this.frame) {
                this.frame++;
                this.framTime = this.framTime % this.parameters.frameTime;
            } else {
                if (this.parameters.preLoop) {
                    this.frame = 0;
                }
            }
        }
    };

    this.animateObjectAgainOrDelete = function() {
        if (this.frame != this.amoundFrames)
            return;
        if (!this.parameters.loop) {
            this.afterUse = true;
        } else {
            this.loop++;
            if (this.loop == this.parameters.loop) {
                this.afterUse = true;
                return;
            }
            this.frame = 0;
        }
    };

    this.createObject = function() {
        this.setFramesBeforeInTarget();
        this.setStopAfterUse();
        this.setRevert();
        var self = this;
        //var img = new Image();

        var name = /\./.test(this.name) ? this.name : this.name + '.gif';
        var allP = cdnUrl + this.path + name;

        //img.src = allP;
        //
        //img.onload = function () {
        //	var mulipler = this.height / self.parameters.height;
        //	self.amoundFrames = mulipler - 1;
        //	self.fw = this.width;
        //	self.fh = this.height / mulipler;
        //	self.img = this;
        //};

        Engine.imgLoader.onload(allP, false, false, (i) => {
            var mulipler = i.height / self.parameters.height;
            self.amoundFrames = mulipler - 1;
            self.fw = i.width;
            self.fh = i.height / mulipler;
            self.img = i;
        })
    };

    this.setFramesBeforeInTarget = function() {
        this.framesBeforeInTarget = this.parameters.framesBeforeInTarget ? true : false;
    };

    this.setStopAfterUse = function() {
        if (this.parameters.stopAfterUse) this.stopAfterUse = this.parameters.stopAfterUse;
    };

    this.setRevert = function() {
        this.revert = this.parameters.revert ? true : false;
    }

    this.checkEnd = function() {

    }
}

function GifObject() {

    this.checkEnd = function() {
        if (this.endTime === 0) return;
        if (Engine.getEv() > this.endTime) {
            this.afterUse = true;
            this.fadeOutEmo();
        }
    }

    this.drawObject = function(dt) {
        //if (this.frames && this.frames.length > 1 && !Engine.opt(8) && !IE) {
        if (this.frames && this.frames.length > 1 && isSettingsOptionsInterfaceAnimationOn() && !IE) {
            this.timePassed += dt * 100;
            if (this.frames[this.activeFrame].delay < this.timePassed) {
                this.timePassed = this.timePassed - this.frames[this.activeFrame].delay;
                this.activeFrame = (this.frames.length == this.activeFrame + 1 ? 0 : this.activeFrame + 1);
            }
        }
    };

    this.createObject = function() {
        var self = this;
        var name = /\.gif/.test(this.name) ? this.name.replace('.gif', '') : this.name;
        var allP = this.path + name + '.gif';

        Engine.imgLoader.onload(allP, {
            speed: false,
            externalSource: cdnUrl
        }, (i, f) => {
            let dType = 4;

            self.correctPosition();

            self.fw = f.hdr.width;
            self.fh = f.hdr.height;
            self.frames = f.frames;
            self.activeFrame = 0;
            self.sprite = i;
            self.isStatic = (dType > 3 && !(self.fw % 64));
        });
    };

    this.correctPosition = function() {
        if (this.parameters.position && this.parameters.position == 'bottom') {
            //this.offsetY += f.hdr.height;
        }
    };
}

module.exports = {
    getGifObject: GifObject,
    getSpriteObject: SpriteObject
};