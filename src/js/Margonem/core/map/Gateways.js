/**
 * Created by Michnik on 2015-11-24.
 */

//var FollowGlow = require('core/glow/FollowGlow');
var FollowController = require('core/FollowController');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
//let ColliderData = require('core/collider/ColliderData');

module.exports = function(map) {
    var self = this;
    var Map = map;
    this.townnames = {};
    var list = [];
    var blockedHighlights = [];
    //var readyToDraw = false;
    //var gtw_img = new Image();
    //gtw_img.src = '/img/exit.png';
    //var gtwh_img = new Image();
    //gtwh_img.src = '/img/exit-highlight.png';
    //gtw_img.onload = function () {
    //	readyToDraw = true;
    //};
    //gtwh_img.onload = function () {
    //	readyToDraw = true;
    //};

    let gtw_img;
    let gtwh_img;
    let readyGt = false;
    let readyGtH = false;
    let readyToDraw = false;

    Engine.imgLoader.onload('/img/exit.png', false,
        (i) => {
            gtw_img = i;
        },
        () => {
            readyGt = true;
            if (readyGt && readyGtH) readyToDraw = true;
        }
    );

    Engine.imgLoader.onload('/img/exit-highlight.png', false,
        (i) => {
            gtwh_img = i;
        },
        () => {
            readyGtH = true;
            if (readyGt && readyGtH) readyToDraw = true;
        }
    );

    var mGateway = function(d) {
        this.d = d;
        this.rx = d.x;
        this.ry = d.y;
        this.fw = 32;
        this.fh = 32;
        // this.canvasObjectType = 'Gateway';
        this.canvasObjectType = CanvasObjectTypeData.GATEWAY;
        this.highlight = false;
        this.overMouse = false;
        this.warShadowOpacity = 0;


        this.d.affectedId = this.d.id + 'x' + this.d.x + 'y' + this.d.y;

        var _self = this;

        let followController = null;


        this.init = () => {
            updateTip();
            initFollowController();
        };

        const initFollowController = () => {
            followController = new FollowController();
            followController.init(getEngine().hero, _self);
        };

        this.getFollowController = function() {
            return followController
        };

        this.changeWarShadowOpacity = function(dt) {
            if (_self.warShadowOpacity != 1) {
                //if (Engine.opt(8)) return _self.warShadowOpacity = 1;
                if (!isSettingsOptionsInterfaceAnimationOn()) {
                    return _self.warShadowOpacity = 1;
                }
                if (_self.warShadowOpacity > 1) return _self.warShadowOpacity = 1;
                _self.warShadowOpacity += dt * 2;
            }
        };

        this.update = function(dt) {
            _self.changeWarShadowOpacity(dt);
        };

        this.getFar = () => {
            return Engine.hero.rx != this.d.x || Engine.hero.ry != this.d.y
        };

        this.draw = function(ctx) {
            if (readyToDraw) {

                let mapShift = Engine.mapShift.getShift();

                ctx.globalAlpha = _self.warShadowOpacity;
                ctx.drawImage(
                    this.highlight ? gtwh_img : gtw_img,
                    0,
                    1, // 1px offset #15760
                    32, 32,
                    Math.round(this.d.x * 32 - Map.offset[0] - mapShift[0]),
                    Math.round(this.d.y * 32 - Map.offset[1] - mapShift[1]),
                    32, 32
                );
                ctx.globalAlpha = _self.warShadowOpacity;
            }
        };

        this.onhover = function(e, show) {
            this.overMouse = show;
            //this.setCursor(show);
            //getEngine().interface.setCursor(show, ColliderData.CURSOR.DO_ACTION);
            getEngine().interface.setDoActionCursor(show);
        };

        this.onclick = (e) => {
            e.stopPropagation();
            let far = this.getFar();
            let h = Engine.hero;

            if (far) {
                let beforeFollowHeroStandOnGateway = Engine.map.gateways.getOpenGtwAtPosition(h.d.x, h.d.y);

                h.addAfterFollowAction(this, function() {
                    //if (Engine.opt(12)) return;
                    if (isSettingsOptionsAutoGoThroughGatewayOn()) {
                        return;
                    }
                    if (beforeFollowHeroStandOnGateway) h.getTroughGateway();
                });

            } else {
                h.getTroughGateway();
            }

            return far;
        };

        this.oncontextmenu = (e) => {
            const menu = [];
            const hero = getEngine().hero;

            menu.push([_t('go', null, 'menu'), function() {
                hero.addAfterFollowAction(_self, function() {
                    hero.getTroughGateway()
                });
            }]);

            getEngine().interface.showPopupMenu(menu, e, true);
            return true;
        };


        //this.addFollow = () => {
        //	let refFollowObj = Engine.hero.getRefFollowObj();
        //	if (refFollowObj) {
        //		//if (refFollowObj.constructor.name == this.constructor.name && refFollowObj.d.id == this.d.id) return;
        //		if (refFollowObj.canvasObjectType == this.canvasObjectType && refFollowObj.d.id == this.d.id) return;
        //		Engine.hero.clearRefFollowObj();
        //	}
        //
        //	this.followGlow = new FollowGlow();
        //	this.followGlow.createObject(this, 'red');
        //	Engine.hero.setRefFollowObj(this);
        //};
        //
        //this.clearFollow = () => {
        //	delete this.followGlow
        //};

        //this.setCursor = function (show) {
        //	const $GC 		= Engine.interface.get$GAME_CANVAS();
        //	const DO_ACTION = ColliderData.CURSOR.DO_ACTION;
        //
        //	if (show) 	$GC.addClass(DO_ACTION);
        //	else 		$GC.removeClass(DO_ACTION)
        //};

        this.getOrder = function() {
            //return Math.max(0.1, this.ry - 0.1);
            return 0.1;
        };

        this.addHightlight = function() {
            this.highlight = true;
        };
        this.removeHightlight = function() {
            this.highlight = false;
        };

        this.collider = {
            box: [
                this.d.x * 32,
                this.d.y * 32,
                this.d.x * 32 + 32,
                this.d.y * 32 + 32
            ]
        };

        const updateTip = () => {
            var tip = escapeHTML(self.townnames[this.d.id]) + (this.d.key ? '<br>(' + _t('require_key', null, 'gtw') + ')' : ''); //wymaga klucza
            var data = {
                min: (this.d.lvl & 0xffff),
                max: ((this.d.lvl >> 16) & 0xffff)
            };
            var available = true;
            if (this.d.lvl != 0) {
                if (data.min != data.max) {
                    tip += '<br>' + _t('gateway_availavle', null, 'gtw') + //PrzejÅcie dostÄpne'
                        (data.min != 0 ? _t('from_lvl %lvl%', {
                            '%lvl%': data.min
                        }, 'gtw') : '') + //' od '+data.min
                        (data.max >= 1000 ? '' : _t('to_lvl %lvl%', {
                            '%lvl%': data.max
                        }, 'gtw')) + _t('lvl_lvl', null, 'gtw'); //' do '+data.max //' poziomu'
                    if (data.min != 0 && data.min > Engine.hero.d.lvl) available = false;
                    else if (data.max < 1000 && data.max < Engine.hero.d.lvl) available = false;
                } else {
                    tip += '<br>' + _t('gateway_availavle_for %lvl%', {
                        '%lvl%': data.max
                    }, 'gtw'); //PrzejÅcie dostÄpne dla '+data.max+' poziomu'
                    if (data.max != Engine.hero.d.lvl) available = false;
                }
            }
            let debug = (CFG.debug ? getTipDebugContent(this.d.id) : '');
            this.tip = [tip + debug, ''];
            this.available = available;
        }

        const getTipDebugContent = (id) => CFG.debug ? `<br><span class="debug-content">
			id: ${id}
		</span>` : '';

        this.debugRefreshTip = () => {
            updateTip();
        }

        // var tip = escapeHTML(self.townnames[this.d.id]) + (this.d.key ? '<br>(' + _t('require_key', null, 'gtw') + ')' : ''); //wymaga klucza
        // var data = {min: (this.d.lvl & 0xffff), max: ((this.d.lvl >> 16) & 0xffff)};
        // var available = true;
        // if (this.d.lvl != 0) {
        // 	if (data.min != data.max) {
        // 		tip += '<br>' + _t('gateway_availavle', null, 'gtw') + //PrzejÅcie dostÄpne'
        // 			(data.min != 0 ? _t('from_lvl %lvl%', {'%lvl%': data.min}, 'gtw') : '') + //' od '+data.min
        // 			(data.max >= 1000 ? '' : _t('to_lvl %lvl%', {'%lvl%': data.max}, 'gtw')) + _t('lvl_lvl', null, 'gtw'); //' do '+data.max //' poziomu'
        // 		if (data.min != 0 && data.min > Engine.hero.d.lvl) available = false;
        // 		else if (data.max < 1000 && data.max < Engine.hero.d.lvl) available = false;
        // 	}
        //
        // 	else {
        // 		tip += '<br>' + _t('gateway_availavle_for %lvl%', {'%lvl%': data.max}, 'gtw'); //PrzejÅcie dostÄpne dla '+data.max+' poziomu'
        // 		if (data.max != Engine.hero.d.lvl) available = false;
        // 	}
        // }
        // let debug = (CFG.debug ? (' id: ' + this.d.id) : '');
        // this.tip = [tip + debug, ''];
        // this.available = available;
    };



    this.update = function(dt) {
        for (var i = 0; i < list.length; i++) {
            list[i].update(dt)
        }
    };

    this.updateData = function(d, townnames) {
        //Map.setDrawable(false);
        if (isset(townnames)) self.townnames = townnames;
        for (var k = 0; k < d.length; k += 5) {
            var gw = new mGateway({
                id: d[k],
                x: d[k + 1],
                y: d[k + 2],
                key: d[k + 3],
                lvl: d[k + 4]
            }, this.townnames[d[k]]);

            gw.init();

            if (gw.d.x == Engine.hero.d.x && gw.d.y == Engine.hero.d.y) Engine.hero.autoWalkLock = true;

            list.push(gw);
        }
    };

    this.clear = function() {
        list = [];
    };

    this.setLockFor = function(id) {
        if (blockedHighlights.indexOf(id) < 0) blockedHighlights.push(id);
        this.addHightlight(id);
    };

    this.removeLock = function() {
        blockedHighlights = [];
    };

    this.addHightlight = function(id) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].d.id == id) list[i].addHightlight();
        }
    };

    this.removeHightlights = function(id) {
        var i;
        if (id) {
            if (blockedHighlights.indexOf(id) >= 0) return;
            for (i = 0; i < list.length; i++) {
                if (list[i].d.id == id)
                    list[i].removeHightlight();
            }
            return;
        }
        for (i = 0; i < list.length; i++) {
            list[i].removeHightlight();
        }
    };

    this.getGtwById = function(id) {
        var temp = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].d.id == id) temp.push(list[i]);
        }
        return temp.length ? temp : false;
    };

    this.getOpenGtwAtPosition = function(x, y) {
        var gtw = this.getGtwAtPosition(x, y);
        return gtw && gtw.available ? gtw : null;
    };

    this.getGtwAtPosition = function(x, y) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].d.x == x && list[i].d.y == y) return list[i];
        }
    };

    this.getList = () => {
        return list;
    };

    this.getDrawableItems = function() {
        let arr = [];
        for (let i = 0; i < list.length; i++) {
            arr.push(list[i]);
            //if (list[i].followGlow) arr.push(list[i].followGlow)

            let followController = list[i].getFollowController();

            if (followController.checkFollowGlow()) arr.push(followController.getFollowGlow())
        }
        return arr;
    };
};