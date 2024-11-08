module.exports = function() {
    var self = this;
    var a;
    this.master = null;
    this.d = {};
    this.color = null;
    this.mask = null;
    this.drawMask = null;
    this.maskLoad = false;

    this.getOrder = function() {
        return self.master.ry + 0.1;
    };

    this.update = function() {
        this.rx = self.master.rx - 0.025;
        this.ry = self.master.ry;
        this.d.x = self.master.d.x;
        this.d.y = self.master.d.y;
    };

    this.createImg = function() {
        //self.mask = new Image();
        //self.mask.src = "/img/mask.png";
        //self.mask.onload = function () {
        //	self.fw = self.master.fw + 4;
        //	self.fh = self.master.fh + 4;
        //	self.maskLoad = true;
        //};
        Engine.imgLoader.onload("/img/mask.png", false,
            (i) => {
                self.mask = i;
            },
            () => {
                self.fw = self.master.fw + 4;
                self.fh = self.master.fh + 4;
                self.maskLoad = true;
            }
        );
    };

    this.draw = function(ctx) {
        var left = this.rx * 32 + 16 - this.fw / 2 +
            (isset(this.offsetX) ? this.offsetX : 0) -
            Engine.map.offset[0] + (typeof(this.leftPosMod) != 'undefined' ? this.leftPosMod : 0);

        var top = this.ry * 32 - this.fh + 32 +
            (isset(this.offsetY) ? this.offsetY : 0) -
            Engine.map.offset[1];

        self.createMaskColor(1);

        var wpos = Math.round(this.rx) + Math.round(this.ry) * 256;
        var topModify = isset(Engine.map.water[wpos]) ? top + this.master.waterTopModify : top;

        left = Math.round(left);
        topModify = Math.round(topModify);

        if (self.drawMask) ctx.drawImage(self.drawMask, left, topModify, this.fw, this.fh);
    };

    this.updateColor = function(color) {
        var col = color ? color : self.master.d.whoIsHere;
        self.color = col;
        self.drawMask = null;
    };

    this.createMaskColor = function() {
        if (!self.drawMask && self.maskLoad) {
            var cns = document.createElement("canvas");
            var ctx = cns.getContext("2d");
            cns.width = 32;
            cns.height = 48;
            ctx.drawImage(self.mask, 0, 0, self.mask.width, self.mask.height);
            ctx.globalCompositeOperation = 'source-in';
            ctx.fillStyle = self.color;
            ctx.fillRect(0, 0, cns.width, cns.height);
            self.drawMask = cns;
        }
        return self.drawMask;
    };

    this.createObject = function(val, color) {
        self.master = val;
        self.d.id = self.master.d.id;
        if (self.master.leftPosMod) self.leftPosMod = self.master.leftPosMod;
        self.update();
        self.updateColor(color);
        self.createImg();
    };
};