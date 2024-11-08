module.exports = function(idO, color) {
    this.fw = 40;
    this.fh = 52;
    this.margin = 5;
    this.color = color;
    this.collider = null;
    var self = this;

    this.update = function() {
        this.updatePos();
        // this.updateCollider();
    };

    this.updatePos = function() {
        var o = Engine.others.getById(idO);
        this.rx = o.rx;
        this.ry = o.ry;
        this.fw = o.fw + this.margin;
        this.fh = o.fh + this.margin;
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

    this.draw = function(ctx) {
        var left = this.rx * 32 + 16 - this.fw / 2 -
            Engine.map.offset[0];

        var top = this.ry * 32 - this.fh + 34 -
            Engine.map.offset[1];

        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.strokeRect(left, top, this.fw, this.fh);
    };

    this.onclick = function(e) {

    };

    this.getOrder = function() {
        return this.ry;
    };

    this.init = function() {
        this.updatePos();
        // this.updateCollider();
    };
};