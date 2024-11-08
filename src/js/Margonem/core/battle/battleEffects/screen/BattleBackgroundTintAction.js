module.exports = function() {

    let ctxTint;
    let canvasTint;

    let drawCanvasTint = false;

    let data;

    let tintVal;
    let maxTintVal = 3.14;

    let actualRepeat = 1;

    let tintAlpha;

    this.init = () => {
        canvasTint = Engine.battle.$.find('.battle-effect-tint')[0];
        ctxTint = canvasTint.getContext('2d');

        this.setCanvasSize();
    };

    this.updateData = (d) => {
        data = d;
    };

    this.update = (dt) => {
        if (!drawCanvasTint) return;

        tintVal += dt * maxTintVal * 1 / data.data.params.duration;
        if (tintVal > maxTintVal) {
            tintVal = 0;
            this.stop();
        }
        tintAlpha = Math.round(Math.sin(tintVal) * 100) / 100;
    };

    this.draw = () => {
        if (!drawCanvasTint) return;

        ctxTint.clearRect(0, 0, canvasTint.width, canvasTint.height);
        ctxTint.save();
        ctxTint.globalAlpha = tintAlpha;
        ctxTint.fillStyle = 'rgb(' + data.data.params.color + ')';
        ctxTint.fillRect(0, 0, canvasTint.width, canvasTint.height);
        ctxTint.restore();
    };

    this.onResize = () => {
        this.setCanvasSize();
    };

    this.setCanvasSize = () => {
        let $b = Engine.battle.$;
        canvasTint.width = $b.width();
        canvasTint.height = $b.height();
    };

    this.start = () => {
        $(canvasTint).css('display', 'block');
        tintVal = 0;
        drawCanvasTint = true;
    };

    this.stop = () => {
        $(canvasTint).css('display', 'none');
        drawCanvasTint = false;

        actualRepeat++;

        Engine.battle.battleEffectsController.afterStopAction(this, actualRepeat, data);
    };

    this.getTint = () => {
        return drawCanvasTint ? [] : [self];
    };

};