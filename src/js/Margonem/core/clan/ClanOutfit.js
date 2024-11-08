module.exports = function() {
    var ctx;
    var self = this;
    this.frame = 0;
    this.demoInterval = null;

    this.update = function(content, url, trans) {
        if (this.demoInterval) return;
        this.initCanvas(content);
        this.initImg(url, trans);
        this.startDemo();
    };

    this.initCanvas = function(content) {
        ctx = content.find('.clan-outfit')[0].getContext('2d');
        content.find('.clan-outfit').attr('width', '165px');
        content.find('.clan-outfit').attr('height', '115px');
    };

    this.initImg = function(url, trans) {
        Engine.imgLoader.onload(CFG.a_opath + url, false,
            (i) => {
                self.slot = 0;
                self.rotation = true;
                self.rx = 30 + trans;
                self.ry = 55;
            },
            (i) => {
                let maxWidth = 48;
                let maxHeight = 75;

                self.fw = i.width / 4;
                self.fh = i.height / 4;
                self.img = i;

                if (maxWidth < self.fw || maxHeight < self.fh) self.rotation = false;
            }
        );
    };

    this.startDemo = function() {
        this.demoInterval = setInterval(function() {
            self.frame = (self.frame + 1) & 15;
            var x = (self.frame & 3) * self.fw;
            var y = (self.frame >> 2);
            if (y == 2) y = 3;
            else if (y == 3) y = 2;
            y *= self.fh;
            self.sy = y;
            self.sx = x;
            self.draw();
        }, 400);
    };

    this.draw = function() {
        var left = self.rx;
        var top = self.ry;
        ctx.clearRect(left, top, self.fw, self.fh);
        if (self.img) ctx.drawImage(self.img, self.sx, self.sy, self.fw, self.fh, left, top, self.fw, self.fh);
    };

    this.remove = function() {
        if (!ctx) return;
        clearInterval(self.demoInterval);
        ctx.clearRect(self.rx, self.ry, self.fw, self.fh);
    };

};