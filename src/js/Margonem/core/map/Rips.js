/**
 * Created by Michnik on 2015-11-24.
 */
module.exports = function(map) {
    var rips = [];
    let ripList = {};
    var Map = map;

    this.updateData = function(v) {
        for (var i = 0; i < v.length; i += 9) {
            var r = new ripObejct(this);
            r.init(v.slice(i, i + 9));
            ripList[r.d.id] = r;
            //rips.push(r);
            Engine.miniMapController.updateWindowMiniMapRipsPos([r])
        }
    };

    this.update = function(dt) {
        //for (var i in rips) {
        //	rips[i].update(dt);
        //}
        for (var i in ripList) {
            ripList[i].update(dt);
        }
    };

    this.refreshLevelAndTip = () => {
        for (var i in ripList) {
            ripList[i].updateLev();
            ripList[i].createTip();
        }
    }

    this.clear = function() {
        //rips = [];
        ripList = {};
        //if (Engine.miniMapController.miniMapWindow) {
        //	Engine.miniMapController.miniMapWindow.wnd.$.find('.mini-map-rip').remove();
        //}
    };

    this.delete = function(left, nick) {
        let slugifiedNick = slugify(nick);
        let id = slugifiedNick + left;

        //Engine.miniMapController.miniMapWindow.wnd.$.find('.r-' + left + '-' + slugifiedNick).remove();
        Engine.miniMapController.handHeldMiniMapController.getMiniMapRipController().deleteRip(id);
        delete ripList[id];
    };

    this.getRipByLeftAnd = (nick, left) => {
        let slugifiedNick = slugify(nick);
        let id = slugifiedNick + left;

        return ripList[id];
    };

    this.getRipById = (id) => {
        return ripList[id];
    };

    this.getDrawableList = function() {
        let list = [];

        for (let k in ripList) {
            list.push(ripList[k]);
        }

        return list;
    };

    var ripObejct = function(R) {
        var s = this;

        this.init = function(v) {
            this.slugifiedNick = slugify(v[0]);
            this.nick = v[0];


            this.level = v[1];
            this.operationLevel = v[2];
            this.prof = v[3];

            //let characterData = {
            //	level 			: v[1],
            //	operationLevel 	: v[2],
            //	prof 			: v[3]
            //}
            //
            ////getCharacterInfo(null, characterData)
            //
            //this.lev = getCharacterInfo(characterData);
            this.updateLev();
            this.rx = v[4];
            this.ry = v[5];
            this.left = v[6];
            this.info = v[7];
            this.quote = v[8];
            this.fw = 40;
            this.fh = 52;
            this.img = null;
            this.warShadowOpacity = 0;
            this.imgLoaded = false;
            this.d = {
                id: this.slugifiedNick + this.left,
                x: this.rx,
                y: this.ry
            };
            this.createObject();
            this.createTip();
            this.collider = {
                box: [
                    s.rx * 32 + 16 - s.fw / 2,
                    s.ry * 32 + 32 - s.fh,
                    s.rx * 32 + 16 + s.fw / 2,
                    s.ry * 32 + 32
                ]
            };
        };

        this.updateLev = () => {
            let characterData = {
                level: this.level,
                operationLevel: this.operationLevel,
                prof: this.prof
            }

            //getCharacterInfo(null, characterData)

            this.lev = getCharacterInfo(characterData);
        }

        this.changeWarShadowOpacity = function(dt) {
            if (s.warShadowOpacity != 1 && s.imgLoaded) {
                //if (Engine.opt(8)) return s.warShadowOpacity = 1;
                if (!isSettingsOptionsInterfaceAnimationOn()) {
                    return s.warShadowOpacity = 1;
                }
                if (s.warShadowOpacity > 1) return s.warShadowOpacity = 1;
                s.warShadowOpacity += dt * 2;
            }
        };

        this.createTip = function() {
            var tip = '<b>' + _t('rip_prefix') + ' ' + this.nick +
                ' ' + this.lev + '</b><br><i>' + this.info +
                '</i><br><i>' + this.quote + '</i>';
            this.tip = [tip, 't_rip'];
        };

        this.setLeft = function() {
            var now = unix_time();
            var left = (300 + 1 * s.left - now) * 1000;
            //s.ts = time;
            s.opacity = 1;
            setTimeout(s.fadeOut, left);
        };

        this.getOrder = function() {
            return this.ry - 0.1;
        };

        this.update = function(dt) {
            this.changeWarShadowOpacity(dt);
        };

        this.fadeOut = function() {
            var interval = setInterval(function() {
                s.opacity -= 0.1;
                if (s.opacity < 0.1) {
                    R.delete(s.left, s.nick);
                    //delete s;
                    clearInterval(interval);
                }
            }, 100);
        };

        this.draw = function(ctx) {

            let mapShift = Engine.mapShift.getShift();

            var left = this.rx * 32 + 16 -
                this.fw / 2 -
                Map.offset[0] - mapShift[0];

            var top = this.ry * 32 -
                this.fh + 32 -
                Map.offset[1] - mapShift[1];

            left = Math.round(left);
            top = Math.round(top);

            ctx.globalAlpha = this.opacity;
            if (this.img) {
                ctx.globalAlpha = s.warShadowOpacity;
                ctx.drawImage(this.img, 0, 0, this.fw, this.fh, left, top, this.fw, this.fh);
                ctx.globalAlpha = 1;
            }
            ctx.globalAlpha = 1;
        };

        this.createObject = function() {
            //var img = new Image();
            //img.src = '/img/rip2.gif';
            //img.onload = function () {
            //	s.imgLoaded = true;
            //	s.setLeft();
            //	s.fw = this.width;
            //	s.fh = this.height;
            //	s.img = this;
            //};
            Engine.imgLoader.onload('/img/rip2.gif', false, false, (i) => {
                s.imgLoaded = true;
                s.fw = i.width;
                s.fh = i.height;
                s.img = i;

                s.setLeft();
            });
        };
    }
};