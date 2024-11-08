module.exports = function() {

    let data;

    let tintVal;
    let maxTintVal = 3.14;
    let drawCanvasTint = false;
    let tintAlpha;

    let actualRepeat = 1;

    let delay = 0;

    let warriorObject = null;

    this.init = () => {

    };

    this.updateData = (d, _warriorObject) => {
        data = d;
        warriorObject = _warriorObject;
    };

    this.start = () => {
        tintVal = 0;
        drawCanvasTint = true;
    };

    this.stop = () => {
        drawCanvasTint = false;

        actualRepeat++;

        Engine.battle.battleEffectsController.afterStopAction(this, actualRepeat, data)
    };

    this.update = (dt) => {
        if (!drawCanvasTint) return;

        if (!this.checkDelayCanAnimationPass()) {
            delay += dt;
            return
        }

        tintVal += dt * maxTintVal * 1 / data.data.params.duration;
        if (tintVal > maxTintVal) {
            tintVal = 0;
            this.stop();
        }
        tintAlpha = Math.round(Math.sin(tintVal) * 100) / 100;
    };

    this.checkDelayCanAnimationPass = () => {
        if (!data.data.params.delay) return true;

        return data.data.params.delay < delay;
    };

    this.draw = () => {
        if (!warriorObject.ctx) return;

        if (!this.checkDelayCanAnimationPass()) return;

        warriorObject.ctx.save();
        warriorObject.ctx.fillStyle = "rgba(" + data.data.params.color + "," + tintAlpha + ")";
        warriorObject.ctx.fillRect(0, 0, warriorObject.fw, warriorObject.fh);
        warriorObject.ctx.globalCompositeOperation = "destination-in";

        warriorObject.draw(true);

        warriorObject.ctx.restore();
    };

};