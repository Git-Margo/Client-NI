module.exports = function() {
    var self = this;
    this.master = null;
    this.d = {};
    this.color = null;
    this.mask = null;
    this.drawMask = null;
    this.maskLoad = false;
    this.alpha = 1;

    this.getOrder = function() {
        return self.master.ry + 0.1;
    };

    this.update = function() {
        if (!Engine.allInit) return
        this.rx = self.master.rx - 0.025;
        this.ry = self.master.ry;
        this.d.x = self.master.d.x;
        this.d.y = self.master.d.y;
    };

    this.setAlpha = (alpha) => {
        this.alpha = alpha;
    };
    /*
    	this.createImg = function () {
    		let path    = "/img/mask.png";
    		let img     = Engine.imgLoader.checkExist(path);

    		self.fw = self.master.fw + 4;
    		self.fh = self.master.fh + 4;

    		if (img) {
    			self.mask     = img;
    			self.maskLoad = true;
    		}
    		else {
    			self.mask     = new Image();
    			self.mask.src = path;
    		}
    		//self.mask.src = "/img/mask.png";
    		self.mask.onload = function () {
    			if (!Engine.imgLoader.checkExist(path)) Engine.imgLoader.add(path, self.mask);
    			//self.fw = self.master.fw + 4;
    			//self.fh = self.master.fh + 4;
    			self.maskLoad = true;
    		};
    	};
    */
    this.createImg = function() {
        let path = "/img/mask.png";

        Engine.imgLoader.onload(path, false,
            (i) => {
                this.beforeOnload(i);
            },
            (i) => {
                this.afterOnload(i);
            }
        );

    };

    this.beforeOnload = (i) => {
        this.fw = self.master.fw + 4;
        this.fh = self.master.fh + 4;
        self.mask = i;
    };

    this.afterOnload = () => {
        this.maskLoad = true;
    };

    this.draw = function(ctx) {

        let mapShift = Engine.mapShift.getShift();

        ctx.globalAlpha = this.alpha;
        var left = this.rx * 32 + 16 - this.fw / 2 +
            (isset(this.offsetX) ? this.offsetX : 0) -
            Engine.map.offset[0] - mapShift[0] + (typeof(this.leftPosMod) != 'undefined' ? this.leftPosMod : 0);

        var top = this.ry * 32 - this.fh + 32 +
            (isset(this.offsetY) ? this.offsetY : 0) -
            Engine.map.offset[1] - mapShift[1];

        self.createMaskColor(1);

        var wpos = Math.round(this.rx) + Math.round(this.ry) * 256;
        var topModify = isset(Engine.map.water[wpos]) ? top + this.master.waterTopModify : top;

        left = Math.round(left);
        topModify = Math.round(topModify);

        if (self.drawMask) {
            let clipImg = Engine.map.clipObject(left, topModify, this.fw, this.fh);

            //ctx.drawImage(self.drawMask, left, topModify, this.fw, this.fh);


            if (clipImg) {

                //console.log('drawMask', this.fw, this.fh, clipImg.width, clipImg.height)

                ctx.drawImage(
                    self.drawMask,
                    clipImg.backgroundPositionX, clipImg.backgroundPositionY,
                    clipImg.width, clipImg.height,
                    clipImg.left, clipImg.top,
                    clipImg.width, clipImg.height
                );
            }
        }
        ctx.globalAlpha = 1;
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
            cns.width = self.fw;
            cns.height = self.fh;
            ctx.drawImage(self.mask, 0, 0, self.fw, self.fh);
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
        self.update();
        self.updateColor(color);
        self.createImg();
    };
};