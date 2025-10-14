let WeatherData = require('@core/weather/WeatherData');

module.exports = function(Par, kind, type, data) {
    var self = this;
    var draw = false;
    this.startFadeOut = null;
    this.startFadeIn = null;
    this.opacity = 1;
    this.timePassed = 0;

    let old = false;
    let bubbleMask = null;

    this.update = function(dt) {
        this['update' + kind](dt);
    };

    this.setSpeed = function() {
        self['setSpeed' + kind]();
    };

    this.setSize = function() {
        this['setSize' + kind]();
    };

    this.draw = function(ctx) {

        let clip = Engine.map.getMinLeftMaxLeftAndMinTopMaxTop();
        let tileSize = CFG.tileSize;

        let left = this.rx * tileSize + 16 - this.fw / 2 - Engine.map.offset[0];
        let top = this.ry * tileSize - this.fw + tileSize - Engine.map.offset[1];

        if (left < clip.minLeft || left > clip.maxLeft) return;
        if (top < clip.minTop || top > clip.maxTop) return;

        ctx.beginPath();
        this['draw' + kind](ctx, left, top, this.rx, this.ry);
    };

    this.updateRain = function(dt) {
        this.ry = this.ry + this.sppedY * dt;
        this.rx = this.rx + this.sppedX * dt;
        if (this.ry > this.startY + this.lengthWay) this.setPos();
        if (this.ry < -10) this.setPos();
    };

    this.updateFish = function(dt) {
        this.drawObject(dt);
        this.ry = this.ry + this.sppedY * dt;
        this.rx = this.rx + this.sppedX * dt;

        //if (this.objectIsOutOfScreenArea()) {
        //
        //}

        if (this.rx < -1) this.rx = Par.mapSize.x - 2;
        if (this.rx > Par.mapSize.x + 1) this.rx = 0;
        if (this.ry < -1) this.ry = Par.mapSize.y;
        if (this.ry > Par.mapSize.y + 1) this.ry = 0;
    };

    this.updateSnow = function(dt) {
        if (this.startFadeIn > this.ry) this.opacity += dt * 2; // startSnow
        if (this.startFadeOut < this.ry) this.opacity -= dt * 2; // finishSnow
        this.ry = this.ry + this.sppedY * dt;
        this.rx = this.rx + this.sppedX * dt;
        //if (this.rx < 0 || this.rx > Par.mapSize.x || this.ry > this.startY + this.lengthWay) {

        if (this.objectIsOutOfScreenArea() || this.ry > this.startY + this.lengthWay) {
            this.setPos();
            this.setOpacity();
        }
    };

    this.updateBubble = function(dt) {
        this.ry = this.ry + this.sppedY * dt;
        this.rx = this.rx + this.sppedX * dt;
        var time = (new Date()).getTime();
        self.widthScale = Math.sin(time / 200) * 0.1 + this.sppedY;
        self.heightScale = -1 * Math.sin(time / 200) * 0.1 + this.sppedY;

        //let minX = Engine.map.getMinX();
        //let maxX = Engine.map.getMaxX();
        //let minY = Engine.map.getMinY();
        //let maxY = Engine.map.getMaxY();

        if (this.objectIsOutOfScreenArea()) {
            this.setPos();
            this.setOpacity();
        }
    };

    this.objectIsOutOfScreenArea = () => {
        let minX = Engine.map.getMinX() - 1;
        let maxX = Engine.map.getMaxX();
        let minY = Engine.map.getMinY() - 5;
        let maxY = Engine.map.getMaxY();

        return this.ry < minY || this.ry > maxY || this.rx < minX || this.rx > maxX;
    }

    this.drawRain = function(ctx, left, top) {
        let mapShift = Engine.mapShift.getShift();

        let l = left - mapShift[0];
        let t = top - mapShift[1];


        let clipImg = Engine.map.clipObject(left, top, this.fw, this.fh);

        if (!clipImg || clipImg.left != left || clipImg.top != top || clipImg.width != this.fw || clipImg.height != this.fh) {
            return;
        }

        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";

        ctx.moveTo(l, top);
        ctx.lineTo(l + self.fw, t + self.fh);
        ctx.stroke();
    };

    this.drawFish = function(ctx) {

        if (this.objectIsOutOfScreenArea()) return;

        let mapShift = Engine.mapShift.getShift();


        var left = this.rx * 32 + 16 - this.fw / 2 - Engine.map.offset[0] - mapShift[0];
        var top = this.ry * 32 - this.fw + 32 - Engine.map.offset[1] - mapShift[1];
        var bgX = 0,
            bgY = 0;
        if (this.sprite && typeof(this.activeFrame) != 'undefined' && this.frames.length > 0) {
            left = Math.round(left);
            top = Math.round(top);
            //ctx.drawImage(this.sprite, bgX, bgY + (this.activeFrame * this.fh), this.fw, this.fh, left, top, this.fw, this.fh);

            let clipImg = Engine.map.clipObject(left, top, this.fw, this.fh);
            if (clipImg) {

                ctx.drawImage(
                    this.sprite,
                    bgX + clipImg.backgroundPositionX, bgY + (this.activeFrame * this.fh) + clipImg.backgroundPositionY,
                    clipImg.width, clipImg.height,
                    clipImg.left, clipImg.top,
                    clipImg.width, clipImg.height
                );
            }


        }
    };

    this.drawSnow = function(ctx, left, top, x, y) {

        if (x <= -0.4) {
            return
        }

        if (y <= -0.4) {
            return
        }

        let mapShift = Engine.mapShift.getShift();

        let l = left - mapShift[0];
        let t = top - mapShift[1];

        let clipImg = Engine.map.clipObject(left, top, this.fw, this.fh);

        if (!clipImg || clipImg.left != left || clipImg.top != top || clipImg.width != this.fw || clipImg.height != this.fh) {
            return;
        }

        //ctx.globalAlpha = this.opacity;
        ctx.arc(l, t, self.fw, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        //ctx.strokeStyle = "gray";
        //ctx.lineWidth = 0.4;
        //ctx.stroke();
        //ctx.globalAlpha = 1;
    };

    let mask = null;

    this.createMask = () => {
        mask = document.createElement('canvas');
        mask.width = 10;
        mask.height = 10;
        let ctxMask = mask.getContext("2d");
        ctxMask.arc(5, 5, self.fw, 0, 2 * Math.PI);
        ctxMask.fillStyle = "white";
        ctxMask.fill();
        ctxMask.strokeStyle = "gray";
        ctxMask.lineWidth = 0.4;
        ctxMask.stroke();

    };

    this.drawSnowstorm = function(ctx, left, top) {


        //if (!mask) {
        //	self.createMask();
        //	return;
        //}

        let mapShift = Engine.mapShift.getShift();

        let l = left - mapShift[0];
        let t = top - mapShift[1];

        //ctx.drawImage(mask, l, t);

        ctx.globalAlpha = this.opacity;
        ctx.arc(l, t, self.fw, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        //ctx.strokeStyle = "gray";
        //ctx.lineWidth = 0.4;
        //ctx.stroke();
        //ctx.globalAlpha = 1;
    };

    const drawMask = (size) => {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext("2d");

        getEngine().canvasFilter.updateFilterWithoutPath(ctx);

        let widthScale = 1;
        let heightScale = 1;

        let l = canvas.width / 2;
        let t = canvas.height / 2;

        ctx.save();
        ctx.translate(l, t);
        ctx.scale(widthScale, heightScale);
        ctx.arc(0, 0, size / 2 - 2, 0, 2 * Math.PI, false);
        ctx.restore();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = '#8ED6FF';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#555';
        ctx.stroke();
        ctx.beginPath();
        ctx.save();
        ctx.translate(l, t);
        ctx.scale(widthScale, heightScale);
        ctx.arc(1, 1, size / 10, 0, 2 * Math.PI, false);
        ctx.restore();
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.globalAlpha = 1;

        return canvas
    }

    this.drawBubble = function(ctx, left, top) {

        let mapShift = Engine.mapShift.getShift();

        let l = Math.round(left - mapShift[0]);
        let t = Math.round(top - mapShift[1]);

        if (!old) {

            if (!bubbleMask) {
                let size = getRandomElementFromArray([20, 19, 18, 15, 14]);
                bubbleMask = drawMask(size);
            }


            let clipImg = Engine.map.clipObject(l, t, bubbleMask.width, bubbleMask.height);

            if (!clipImg) return;

            ctx.drawImage(
                bubbleMask,
                clipImg.backgroundPositionX, clipImg.backgroundPositionY,
                clipImg.width, clipImg.height,
                clipImg.left, clipImg.top,
                clipImg.width, clipImg.height
            );
            //ctx.drawImage(bubbleMask, l, t);

        } else {

            ctx.save();
            ctx.translate(l, t);
            ctx.scale(self.widthScale, self.heightScale);
            ctx.arc(0, 0, 10, 0, 2 * Math.PI, false);
            ctx.restore();
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = '#8ED6FF';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#555';
            ctx.stroke();
            ctx.beginPath();
            ctx.save();
            ctx.translate(l, t);
            ctx.scale(self.widthScale, self.heightScale);
            ctx.arc(1, 1, 2, 0, 2 * Math.PI, false);
            ctx.restore();
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    };



    this.getKind = function() {
        return kind;
    };

    this.getType = function() {
        return type;
    };

    this.getData = function() {
        return data;
    };

    this.setSpeedRain = function() {
        let xSpeed = isset(data.speedX) ? data.speedX : 1;
        let ySpeed = isset(data.speedY) ? data.speedY : 1;

        self.sppedX = (Math.random() * 0.2) * xSpeed;
        self.sppedY = (7 + Math.random() * 5) * ySpeed;
    };

    this.setSpeedSnow = function() {
        let xSpeed = isset(data.speedX) ? data.speedX : 1;
        let ySpeed = isset(data.speedY) ? data.speedY : 1;

        self.sppedX = (0.0 + Math.random()) * xSpeed;
        self.sppedY = (0.5 + Math.random()) * ySpeed;
    };

    this.setSpeedBubble = function() {
        let xSpeed = isset(data.speedX) ? data.speedX : 1;
        let ySpeed = isset(data.speedY) ? data.speedY : 1;

        self.sppedX = (0.1 * Math.random()) * xSpeed;
        self.sppedY = (-0.8 * Math.random()) * ySpeed;
    };

    this.setSpeedFish = function() {
        //self.sppedX = 0.2;
        //self.sppedX = 2;
        self.sppedX = data.speedX;
        self.sppedY = data.speedY;
    };

    this.setSizeRain = function() {
        var t = [
            [0.5, 6],
            [0.5, 10],
            [0.5, 12]
        ];
        var s = Math.floor(Math.random() * 3);
        self.fw = t[s][0];
        self.fh = t[s][1];
    };

    this.setSizeSnow = function() {
        var t = [2, 2.5, 3];
        var s = Math.floor(Math.random() * 3);
        self.fw = t[s];
        self.fh = t[s];
    };

    this.setSizeBubble = function() {
        var t = [
            [1, 2],
            [2, 7],
            [7, 2]
        ];
        var s = Math.floor(Math.random() * 3);
        self.fw = t[s][0];
        self.fh = t[s][1];
    };

    this.setSizeFish = function() {
        var t = [
            [1, 2],
            [2, 7],
            [7, 2]
        ];
        var s = Math.floor(Math.random() * 3);
        self.fw = t[s][0];
        self.fh = t[s][1];
    };

    this.setOpacity = function() {
        //if (kind == 'Rain') return;
        if (kind == WeatherData.weather.RAIN) return;
        self.opacity = 0;
        self.startFadeOut = self.ry + self.lengthWay * 0.8;
        self.startFadeIn = self.ry + self.lengthWay * 0.2;
    };

    this.setPosOld = function() {
        if (isset(data.startPos)) {
            self.rx = data.startPos.x;
            self.ry = data.startPos.y;
        } else {
            self.rx = Math.random() * Par.mapSize.x;
            self.ry = Math.random() * Par.mapSize.y - 2;
        }
        self.startY = self.ry;
    };

    this.setPos = function() {
        if (isset(data.startPos)) {
            self.rx = data.startPos.x;
            self.ry = data.startPos.y;
        } else {
            //debugger;


            let minX = Engine.map.getMinX();
            let minY = Engine.map.getMinY() - 5;

            let maxX = Engine.map.getMaxX();
            let maxY = Engine.map.getMaxY();

            self.rx = minX + Math.random() * (maxX - minX);
            self.ry = minY + Math.random() * (maxY - minY);

            //let minLeftMaxLeftAndMinTopMaxTop = Engine.map.getMinLeftMaxLeftAndMinTopMaxTop();
            //
            //let minLeft = minLeftMaxLeftAndMinTopMaxTop.minLeft;
            //let maxLeft = minLeftMaxLeftAndMinTopMaxTop.maxLeft;
            //let minTop = minLeftMaxLeftAndMinTopMaxTop.minTop;
            //let maxTop = minLeftMaxLeftAndMinTopMaxTop.maxTop;
            //
            //self.rx = minLeft + Math.random() * (maxLeft - minLeft);
            //self.ry = minTop + Math.random() * (maxTop - minTop);

        }
        self.startY = self.ry;
    };

    this.changeDir = function() {
        this.sppedX = this.sppedX * -1
    };

    this.setDir = function() {
        //if (isset(data.dir)) {
        //	if (!data.dir) self.changeDir();
        //	return;
        //}
        //if (kind == 'Fish') return;
        if (kind == WeatherData.weather.FISH) return;
        var bool = Math.round(Math.random());
        if (bool) this.changeDir()
    };

    this.setLengthWay = function() {
        //if (kind == 'Fish') this.lengthWay = 10;
        if (kind == WeatherData.weather.FISH) this.lengthWay = 10;
        else this.lengthWay = 20;
    };

    this.drawObject = function(dt) {
        if (this.frames && this.frames.length > 1 && !IE) {
            this.timePassed += dt * 100;
            if (this.frames[this.activeFrame].delay < this.timePassed) {
                this.timePassed = this.timePassed - this.frames[this.activeFrame].delay;
                this.activeFrame = (this.frames.length == this.activeFrame + 1 ? 0 : this.activeFrame + 1);
            }
        }
    };

    this.getOrder = function() {
        //return this.ry + 5;
        return getEngine().renderer.getWeatherOrderWithoutSort();
    };

    const getPath = () => {
        return CFG.r_fpath + 'fish/' + data.icon;
    }

    this.setIcon = function() {
        if (!isset(data.icon)) return;
        //var url = CFG.r_fpath + 'fish/' + data.icon;

        Engine.imgLoader.onload(getPath(), {
                speed: false,
                externalSource: cdnUrl
            },
            (i, f) => {
                self.beforeOnload(f, i);
            },
            (i) => {
                updateFilterImage();
            }
        );
    };

    this.beforeOnload = (f, i) => {
        self.fw = f.hdr.width;
        self.fh = f.hdr.height;
        self.frames = f.frames;
        self.activeFrame = 0;
        self.sprite = i;
    };

    this.createObject = function() {
        self.setPos();
        self.setSpeed();
        self.setSize();
        self.setLengthWay();
        self.setOpacity();
        self.setDir();
        self.setIcon();
    };

    const updateFilterImage = () => {
        if (this.sprite) {
            this.sprite = getEngine().canvasFilter.updateFilter(getPath(), this.sprite, true);
        }
        if (bubbleMask) {
            bubbleMask = null
        }

    }

    this.updateFilterImage = updateFilterImage
    //this.createObject();

};