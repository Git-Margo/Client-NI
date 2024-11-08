/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Updateable = require('core/Updateable');
var Collisions = require('core/Collisions');
var Input = require('core/InputParser');
var Rips = require('core/map/Rips');
var Gateways = require('core/map/Gateways');
var GroundItems = require('core/map/GroundItems');
var QuestProgressBar = require('core/map/QuestProgressBar');
var SearchPath = require('core/searchPath/SearchPath');
var I = require('core/InputParser');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
var ThemeData = require('core/themeController/ThemeData');
var TutorialData = require('core/tutorial/TutorialData');
var RajData = require('core/raj/RajData');
const MapConfig = require('core/map/MapConfig');
var Map = function() {
    var self = this;
    var animated = false;
    this.d = {};
    this.$worldPane;
    this.$mapLoaderSplash;
    // this.canvasObjectType = 'Map';
    this.canvasObjectType = CanvasObjectTypeData.MAP;
    this.focusTarget = null;
    this.focusNow = null;
    this.collider = true;
    this.offset = [0, 0];
    this.mode = null;
    this.water = [];
    this.src = null;
    this.imgLoaded = false;
    this.offsetIsSet = false;
    this.size = {
        x: null,
        y: null
    };
    this.goMark = null;

    let backgroundOffset;

    let minLeftMaxLeftAndMinTopMaxTop = {
        minLeft: null,
        maxLeft: null,
        minTop: null,
        maxTop: null
    }

    //this.alwaysDraw = true;
    let alwaysDraw;

    let backgroundColor = {
        r: null,
        g: null,
        b: null,
        a: null
    }

    //let markImg;

    var moveBlock = false;
    //var $GAME_CANVAS;

    var drawable = false;
    var unlock = false;

    this.col = new Collisions();
    var img = null;

    let externalProperties = null;

    let forceRender = false;
    //var gtwImg = new Image();
    //gtwImg.src = '/img/exit.png';

    const updateMinLeftMaxLeftAndMinTopMaxTop = () => {
        minLeftMaxLeftAndMinTopMaxTop.minLeft = clip[0] - Engine.map.offset[0];
        minLeftMaxLeftAndMinTopMaxTop.maxLeft = clip[0] + clip[2] - Engine.map.offset[0];
        minLeftMaxLeftAndMinTopMaxTop.minTop = clip[1] - Engine.map.offset[1];
        minLeftMaxLeftAndMinTopMaxTop.maxTop = clip[1] + clip[3] - Engine.map.offset[1];
    }

    const setBackgroundOffset = (x, y) => {
        backgroundOffset = {
            x: x,
            y: y
        }
    }

    const getBackgroundOffset = () => {
        return {
            x: backgroundOffset.x,
            y: backgroundOffset.y
        }
    }

    const resetBackgroundOffset = () => {
        setBackgroundOffset(0, 0);
    }

    this.init = function() {
        //this.$GAME_CANVAS = $('#GAME_CANVAS');
        setAlwaysDraw(true);
        this.config = new MapConfig();
        this.$worldPane = Engine.interface.get$gameLayer();
        this.$mapLoaderSplash = Engine.interface.get$gameLayer().find('.map-reloader-splash');
        this.lock = new Lock(['game_init'], function() {
            Engine.lock.remove('mapLoadedAndAllInit');
            unlock = true;
            self.hideLoaderSplash();
            //Engine.lowHealthCanvas.create();
            getEngine().map.setForceRender(true);
            self.update(0);
            //self.serveRayControllerData(['weather', 'night', 'mapFilter', 'earthQuake', 'tutorial']);
            self.serveRayControllerData([
                RajData.PROGRAMMER,
                RajData.WEATHER,
                RajData.CONNECT_SRAJ,
                //RajData.RANDOM_CALLER,
                RajData.SCREEN_EFFECTS,
                RajData.SEQUENCE,
                RajData.FLOAT_OBJECT,
                RajData.FLOAT_FOREGROUND,
                RajData.NIGHT,
                RajData.MAP_FILTER,
                RajData.EARTHQUAKE,
                RajData.TUTORIAL,
                RajData.SOUND,
                RajData.AREA_TRIGGER,
                RajData.MAP_MUSIC,
                RajData.ZOOM,
                RajData.TRACKING,
            ]);
        });

        this.gateways = new Gateways(self);
        this.groundItems = new GroundItems();
        this.groundItems.init();
        this.rip = new Rips(self);
        this.questProgressBar = new QuestProgressBar();
        this.questProgressBar.init();

        //this.getEngine().imgLoader.onload('/img/cross.gif', false, (i) => {
        //	markImg = i;
        //});
    };

    this.setExternalProperties = (data) => {
        externalProperties = data;
    }

    this.getExternalProperties = () => {
        return externalProperties;
    }

    this.getSpecificKeyFromExternalProperties = (specificKey) => {
        return externalProperties[specificKey];
    }

    this.getMapMusicFromSraj = () => {
        if (!externalProperties) return null;

        if (!externalProperties[RajData.MAP_MUSIC]) return null;

        return externalProperties[RajData.MAP_MUSIC];
    };

    this.blockMove = function() {
        moveBlock = true;
    };

    //Added for test purposes
    this.getMoveBlock = function() {
        return moveBlock;
    };

    this.getDrawable = function() {
        return drawable;
    };

    this.isFocusSet = () => {
        return self.focusNow !== null && clip !== null
    };

    this.getUnlock = function() {
        return unlock;
    };

    this.setUnlock = function(state) {
        unlock = Boolean(state);
    };

    // this.setTutorials = function () {
    // 	var id = self.d.id;
    // 	var mainId = self.d.mainid;
    // 	var lvl = Engine.hero.lvl;
    // 	var startIds = {579: 1, 1058: 1, 1059: 1, 1060: 1, 1062: 1, 1084: 1};
    //
    // 	var bool = !(isset(startIds[id]) || isset(startIds[mainId])) && lvl < 7;
    // 	// var bool2 = [2, 9, 35].indexOf(id) >= 0 && _l() == 'en';
    // 	var bool2 = [2, 9, 35].indexOf(id) >= 0 && isEn();
    //
    // 	//if (bool) tutorialStart(9);
    // 	//else if (isset(startIds[id])) tutorialStart(2);
    // 	//if (bool2) tutorialStart(21);
    // };

    this.unBlockMove = function() {
        moveBlock = false;
    };

    this.setSetings = function() {
        //var bool = Engine.settings.getLocOptById(19);
        //var bool = Engine.opt(19);
        var bool = isSettingsOptionsMapAnimationOn();
        self.setAnimated(bool ? true : false);
    };

    this.setAnimated = function(bool) {
        animated = bool;
    };

    //this.beforeUpdate = function (data) {
    //if (isset(data.file) && (!isset(this.d.file) || this.d.file != data.file)) {
    //	this.$mapLoaderSplash.show();
    //	this.$mapLoaderSplash.html('<div>' + _t("changing_location", null, 'map') + '</div>');
    //}
    //};

    this.beforeUpdate = function(data) {
        self.setExternalProperties(null);
        if (data.params) {
            self.config.setDefaults();
            self.config.update(data.params);
        }
    };

    this.showLoaderSplash = function() {

        //Engine.miniMapController.handHeldMiniMapController.clearMiniMap();

        self.setOffsetIsSet(false);
        //if (Engine.opt(23)) return;

        if (!getEngine().settingsOptions.isLoaderSplashOn()) {
            return;
        }

        Engine.interface.get$GAME_CANVAS().css('display', 'none');
        self.$mapLoaderSplash.html('<div>' + _t("changing_location", null, 'map') + '</div>');
        self.$mapLoaderSplash.stop(true, true);
        self.$mapLoaderSplash.css({
            display: 'block',
            opacity: 1
        });
    };

    this.hideLoaderSplash = function() {
        if (unlock) {
            Engine.interface.get$GAME_CANVAS().css('display', 'block');
            //Engine.interface.get$MAP_CANVAS().css('display', 'block');
            //if (Engine.settings && Engine.settings.getLocOptById(23)) self.$mapLoaderSplash.css('display', 'none');
            //if (Engine.opt(8)) self.$mapLoaderSplash.css('display', 'none');
            if (!isSettingsOptionsInterfaceAnimationOn()) self.$mapLoaderSplash.css('display', 'none');
            else self.$mapLoaderSplash.fadeOut(300);
        }
    };

    this.getBackgroundColor = () => {
        return backgroundColor;
    }

    const manageQuestFog = () => {

        if (!this.config.getIsQuestFogEnabled()) return;

        getEngine().questMapBorderManager.prepareBorderCanvas({
            r: backgroundColor.r,
            g: backgroundColor.g,
            b: backgroundColor.b
        });
    };

    this.setBackgroundColor = function(color) { // array [255,255,255]
        let data;
        if (!isset(color)) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            context.drawImage(img, 0, 0);
            data = context.getImageData(0, 0, 1, 1).data;
        } else {
            data = color;
        }

        backgroundColor.r = data[0];
        backgroundColor.g = data[1];
        backgroundColor.b = data[2];
        backgroundColor.a = 1;

        //$('.game-layer').css('background', 'rgba(' + data[0] + ', ' + data[1] + ', ' + data[2] + ', ' + 1 + ')');
        Engine.interface.get$gameLayer().css('background', 'rgba(' + data[0] + ', ' + data[1] + ', ' + data[2] + ', ' + 1 + ')');
    };

    this.createCollisionMap = function() {
        if (self.size.x === null || self.size.y === null)
            return;
        SearchPath.createMap(self.size);
        self.col.setMapSize(self.size);
    };

    this.refreshRayControllerData = (keysToRefresh) => {
        if (!this.getExternalProperties()) {
            errorReport("Map.js", "this.refreshRayControllerData", "external_properties not exist in this map!");
            return;
        }

        if (!Array.isArray(keysToRefresh)) {
            errorReport("Map.js", "this.refreshRayControllerData", "mapExternalPropertiesRefresh must be array!", keysToRefresh);
            return;
        }

        for (let k in keysToRefresh) {
            this.refreshOneKeyInMapExternalProperties(keysToRefresh[k]);
        }
    };

    this.refreshOneKeyInMapExternalProperties = (key) => {
        if (!Engine.rajController.checkRajKeyExist(key)) {
            errorReport("Map.js", "refreshRayControllerData", 'Key: ' + key + " not exist in RajData!");
            return;
        }

        if (!this.keyExistInExternalProperties(key)) {
            errorReport("Map.js", "refreshRayControllerData", 'Key: ' + key + "not exist in map external_properties!");
            return;
        }

        let specificKeyData = this.getSpecificKeyFromExternalProperties(key);

        Engine.rajController.parseObject({
            [key]: specificKeyData
        });
    };

    this.keyExistInExternalProperties = (key) => {
        return externalProperties[key] ? true : false;
    };

    this.serveRayControllerData = (exceptionKeys) => {
        if (!externalProperties) return;
        // console.log('serveRayControllerData')

        Engine.rajController.parseObject(externalProperties, exceptionKeys, {
            mapId: self.d.id
        });
    }

    this.afterOnload = () => {
        self.imgLoaded = true;
        Engine.loader.load('map');
        self.width = img.width;
        self.height = img.height;
        self.size = {
            x: self.width / CFG.tileSize,
            y: self.height / CFG.tileSize
        };

        I.setKeyboardSystem(self.d.id);
        Engine.map.centerOn(Engine.hero.rx, Engine.hero.ry);
        drawable = true;

        //console.log(Engine.allInit);
        if (Engine.allInit) Engine.startGameThread();

        self.hideLoaderSplash();
        self.setBackgroundColor();
        manageQuestFog();
        Engine.miniMapController.updateMiniMapWindow();
        Engine.miniMapController.showMyLoc();
        Engine.hero.updateCollider();
        Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 15);
        //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 15);
        //Engine.weather.setWeather(self.d.id);
    };

    const isBackgroundOffsetExist = () => {
        return backgroundOffset.x != 0 || backgroundOffset.y != 0
    }

    const getRedrawImageWithBackgroundOffset = (mapImage, xSize, ySize, backgroundOffsetX, backgroundOffsetY) => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let tileSize = CFG.tileSize;

        if (!xSize || !ySize || !backgroundOffsetX || !backgroundOffsetY) {
            return;
        }

        canvas.width = xSize * tileSize;
        canvas.height = ySize * tileSize;

        ctx.drawImage(mapImage,
            Math.abs(backgroundOffsetX) * tileSize, Math.abs(backgroundOffsetY) * tileSize,
            canvas.width, canvas.height,
            0, 0,
            canvas.width, canvas.height
        );

        return canvas
    };

    this.onUpdate = new(function() {
        this.file = function(new_v, old_v, allData) {
            self.src = CFG.a_mpath + new_v;;

            Engine.lock.add('mapLoadedAndAllInit');


            Engine.imgLoader.onload(self.src, false,
                (i) => {
                    fixCorsForTaintedCanvas(i);
                    moveBlock = false;
                    self.imgLoaded = false;
                    img = i;
                },
                (i) => {

                    if (isBackgroundOffsetExist()) {
                        img = getRedrawImageWithBackgroundOffset(img, allData.x, allData.y, allData.backgroundOffset.x, allData.backgroundOffset.y);
                    }

                    self.afterOnload();
                }
            );


        };
        this.external_properties = function(val) {
            self.setExternalProperties(val)
        };
        this.backgroundOffset = function(val, old) {
            setBackgroundOffset(val.x, val.y);
        };
        this.x = function(val, old) {
            self.size.x = val;
            self.createCollisionMap();
        };
        this.y = function(val, old) {
            self.size.y = val;
            self.createCollisionMap();
        };
        this.name = function(val, old) {
            const
                $l = Engine.interface.get$interfaceLayer().find('.location'),
                label = _t('location_name');
            $l.html(escapeHTML(val)).tip(label + parseBasicBB(val));
        };
        this.pvp = function(v) {
            var colors = {
                    0: 'green',
                    1: 'yellow',
                    2: 'red',
                    4: 'orange'
                },
                mode = _t('pvp_mode', null, 'map'),
                show_wanted = _t('click_to_show_killers', null, 'map'),
                conquer_stats_tip = _t('conquer-stats-tip'),
                canParty = !Engine.map.config.getIsPartiesDisabled() ? _t('party_on') : _t('party_off'),
                partyTxt = `${_t('party', null, 'map')}: ${canParty}`;

            var tipSuffix = Engine.worldConfig.getPvp() ? conquer_stats_tip : show_wanted;

            Engine.interface.get$interfaceLayer()
                .find('.map_ball')
                .removeClass('yellow green red orange')
                .addClass(colors[v]).tip(mode + ' ' + _t('pvp_' + colors[v]) + '<br/>' + partyTxt + '<br/><br/>' + tipSuffix);
            //if (v == 1 || v == 2 || v == 4) tutorialStart(15);
        };
        this.mode = function(v) {
            self.mode = v;
        };
        this.conquer = function(v) {
            if (v) return;

            var $ball = Engine.interface.get$interfaceLayer().find('.map_ball'),
                //ballTip = $ball.attr('data-tip'),
                ballTip = $ball.getTipData(),
                can_conquer = '<br /><br />' + _t('location_conquer_possible');

            $ball.tip(ballTip + can_conquer);
        };
        this.visibility = function(v) {
            Engine.warShadow.setWarRange(v);
        };
        this.water = function(v) {
            var water = v.split('|');
            var ww = null;
            for (var i in water) {
                ww = water[i].split(',');
                for (var j = 1 * ww[0]; j <= 1 * ww[1]; j++) {
                    self.water[j + 256 * ww[2]] = 4 * ww[3];
                }
            }
        };
        this.welcome = function(v) {
            message(v);
        };
        //this.params = (v) => {
        //	self.config.setDefaults();
        //	self.config.update(v);
        //};

    })();

    this.afterUpdate = function(data) {
        // if(data.interface_skin) Engine.themeController.updateData(data.interface_skin, 2);

        self.updateCanvasSizeMinMaxWHClipOffset(0);

        //if(data.interface_skin) Engine.themeController.updateData(data.interface_skin, ThemeData.THEME_KIND.CITY);
        //else           			Engine.themeController.removeCityThemeIfExist();

        //if (externalProperties) self.serveRayControllerData(['characterEffect', 'fakeNpc']);
        if (externalProperties) {
            self.serveRayControllerData([
                RajData.CHARACTER_EFFECT,
                RajData.YELLOW_MESSAGE,
                RajData.FAKE_NPC,
                RajData.EMO_DEFINITIONS,
                RajData.EMO_ACTIONS,
                RajData.DYNAMIC_LIGHT,
                RajData.DYNAMIC_DIR_CHARACTER_LIGHT,
                RajData.BEHAVIOR_DYNAMIC_LIGHT,
                RajData.MAP_EVENTS,
                RajData.CHARACTER_IMAGE_CHANGER,
                RajData.RANDOM_CALLER,
            ]);
        }

        //Engine.soundManager.setMusic();
        if (!self.getMapMusicFromSraj()) Engine.soundManager.setMusic();
        if (Engine.worldWindow && Engine.worldWindow.locationParameters) Engine.worldWindow.locationParameters.updateParameters();
    }

    this.getTranslatedMousePos = function(clientX, clientY) {
        //var x = Math.max(0, Math.min(self.size.x, Math.floor((clientX) / 32)));
        //var y = Math.max(0, Math.min(self.size.y, Math.floor((clientY) / 32)));
        //return {x: x, y: y};
        return this.getCorrectAutoGoPos(
            Math.floor((clientX) / CFG.tileSize),
            Math.floor((clientY) / CFG.tileSize)
        );

    };

    this.getCorrectAutoGoPos = function(x, y) {
        var x = Math.max(0, Math.min(self.size.x, x));
        var y = Math.max(0, Math.min(self.size.y, y));
        return {
            x: x,
            y: y
        };
    };

    this.getTranslatedPixelMousePos = function(clientX, clientY) {
        var x = e.clientX - $(this).offset().left + self.map.offset[0];
        var y = e.clientY - $(this).offset().top + self.map.offset[1];
        return {
            x: x,
            y: y
        };
    };

    this.setNpcCollision = function() {

    };

    this.setCollisions = function(cl) {
        this.col.setCl(cl);
        if (isset(Engine.hero.pet)) Engine.hero.pet.calculatePosition();
    };


    //sets new camera position to tween to
    this.centerOn = function(x, y) {
        // console.log (x, y);
        // console.trace();
        if (moveBlock) return;
        if (this.focusTarget == null && this.focusNow == null) {
            this.focusTarget = [x, y];
            this.focusNow = [x, y];
            return;
        }

        this.focusTarget = [x, y];
    };

    var clip = null;

    this.setFocusNowLikeFocusTager = () => {
        self.focusNow = self.focusTarget;
    };

    this.setfocusNowAndFocusTarget = (dt) => {
        let a = self.focusNow;
        let b = self.focusTarget;
        let maxDiff = 50;
        let diff = Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
        let diffRatio = diff / maxDiff;

        let vect = [b[0] - a[0], b[1] - a[1]];

        if (diff < 0.05) self.setFocusNowLikeFocusTager();
        else {
            let v = Math.min(dt * 5, 0.4);
            self.focusNow[0] += vect[0] * (diffRatio > 1 ? 1 : v);
            self.focusNow[1] += vect[1] * (diffRatio > 1 ? 1 : v);
        }
    };

    this.updateCanvasSizeMinMaxWHClipOffset = (dt) => {
        var canvasSize = this.getEngine().getCanvasViewSize();
        //if (self.focusNow == null || self.focusTarget == null || !canvasSize.height || !canvasSize.width) return;
        if (self.focusNow == null || self.focusTarget == null) return;

        if (!animated) self.setFocusNowLikeFocusTager();
        else self.setfocusNowAndFocusTarget(dt);

        let zoom = Engine.zoomManager.getActualZoom();
        let tileSize = CFG.tileSize;
        let halfTileSize = CFG.halfTileSize;

        let canvasWidth = !canvasSize.width ? window.innerWidth : canvasSize.width;
        let canvasHeight = !canvasSize.height ? window.innerHeight : canvasSize.height;

        let mapHeight = self.size.y * tileSize * zoom;
        let mapWidth = self.size.x * tileSize * zoom;

        var cx = self.focusNow[0] * tileSize + halfTileSize;
        var cy = self.focusNow[1] * tileSize + halfTileSize;

        var minH = Math.min(mapHeight / 2, canvasHeight / zoom / 2);
        var minW = Math.min(mapWidth / 2, canvasWidth / zoom / 2);

        var startX = Math.max(0, cx - minW);
        var startY = Math.max(0, cy - minH);

        clip = [
            Math.min(startX, Math.max(mapWidth / zoom - canvasWidth / zoom, 0)), //start x
            Math.min(startY, Math.max(mapHeight / zoom - canvasHeight / zoom, 0)), //start y
            Math.min(canvasWidth, mapWidth), //width
            Math.min(canvasHeight, mapHeight) //height
        ];

        self.offset = [
            clip[0] - (canvasWidth / 2 - clip[2] / 2),
            clip[1] - (canvasHeight / 2 - clip[3] / 2)
        ];

        self.minX = self.offset[0] / tileSize;
        self.minY = self.offset[1] / tileSize;

        self.maxX = this.minX + canvasWidth / tileSize;
        self.maxY = this.minY + canvasHeight / tileSize;

        updateMinLeftMaxLeftAndMinTopMaxTop();

        if (drawable && !self.offsetIsSet) self.setOffsetIsSet(true); //#34454
    };

    this.update = function(dt) {
        /*
		var canvasSize = this.getEngine().getCanvasViewSize();
		if (self.focusNow == null || self.focusTarget == null || !canvasSize.height || !canvasSize.width) return;

			if (!animated)  self.setFocusNowLikeFocusTager();
			else            self.setfocusNowAndFocusTarget(dt);

		var cx = self.focusNow[0] * 32 + 16;
		var cy = self.focusNow[1] * 32 + 16;
		//var canvas = $GAME_CANVAS[0];

		var minH = Math.min(self.height / 2, canvasSize.height / 2);
		var minW = Math.min(self.width / 2, canvasSize.width / 2);

		var startX = Math.max(0, cx - minW);
		var startY = Math.max(0, cy - minH);

		clip = [
			Math.min(startX, Math.max(self.width - canvasSize.width, 0)), //start x
			Math.min(startY, Math.max(self.height - canvasSize.height, 0)), //start y
			Math.min(canvasSize.width, self.width), //width
			Math.min(canvasSize.height, self.height) //height
		];

		self.offset = [
			clip[0] - (canvasSize.width / 2 - clip[2] / 2),
			clip[1] - (canvasSize.height / 2 - clip[3] / 2)
		];

		self.minX = self.offset[0] / 32;
		self.minY = self.offset[1] / 32;

		self.maxX = this.minX + canvasSize.width  / 32;
		self.maxY = this.minY + canvasSize.height / 32;

		if (drawable && !self.offsetIsSet) {
			self.setOffsetIsSet(true);
			// self.serveRayControllerData();
		}

		//self.offset = [
		//	Math.round(clip[0] - (canvas.width / 2 - clip[2] / 2)),
		//	Math.round(clip[1] - (canvas.height / 2 - clip[3] / 2))
		//];
*/
        if (!Engine.allInit) return
        self.updateCanvasSizeMinMaxWHClipOffset(dt);

        self.getGroundItems().update(dt);
        self.getGateways().update(dt);

        //added return to make sure that function passed
        return true;
    };

    this.setOffsetIsSet = (state) => {
        this.offsetIsSet = state;
    };

    this.getOffsetIsSet = () => {
        return this.offsetIsSet;
    };

    this.getOrder = function() {
        return 0;
    };

    this.blockDrawable = function() {
        drawable = false;
    };

    let oldClip = null;


    const checkRender = () => {
        if (!oldClip) {
            return true;
        }

        if (forceRender) {
            return true;
        }

        let clipNotChange = clip[0] == oldClip[0] && clip[1] == oldClip[1] && clip[2] == oldClip[2] && clip[3] == oldClip[3];

        return !clipNotChange;
    }

    this.drawold = function(ctx) {
        //if (drawable && self.focusNow !== null && clip !== null) {
        //return
        if (drawable && self.isFocusSet()) {
            var canvasSize = Engine.getCanvasViewSize();
            let mapShift = Engine.mapShift.getShift();

            let _clip = [
                clip[0] + mapShift[0],
                clip[1] + mapShift[1],
                clip[2] + mapShift[0],
                clip[3] + mapShift[1]
            ];

            var width = _clip[2];
            var height = _clip[3];

            let ctxMap = getEngine().getCtxMap();
            let zoom = Engine.zoomManager.getActualZoom();
            let zoomChange = zoom != ctxMap.globalAlpha;


            if (!checkRender()) {
                return
            }

            //console.log('draw')

            setForceRender(false);

            let _ctx = ctxMap

            oldClip = [clip[0], clip[1], clip[2], clip[3]];

            if (zoomChange) {
                _ctx.save();
            }
            _ctx.clearRect(0, 0, _ctx.canvas.width, _ctx.canvas.height);

            if (zoomChange) {
                _ctx.scale(zoom, zoom);
            }

            _ctx.drawImage(
                img,
                Math.round(_clip[0]),
                Math.round(_clip[1]),
                width,
                height,
                Math.round(canvasSize.width / 2 - _clip[2] / 2),
                Math.round(canvasSize.height / 2 - _clip[3] / 2),
                width,
                height
            );

            if (zoomChange) {
                _ctx.restore();
            }

            //if (this.goMark) this.drawGoMark(ctx);
        }
    };

    const drawImage = (_ctx, w, h) => {
        _ctx.drawImage(
            img,
            Math.round(_clip[0]),
            Math.round(_clip[1]),
            w,
            h,
            Math.round(canvasSize.width / 2 - _clip[2] / 2),
            Math.round(canvasSize.height / 2 - _clip[3] / 2),
            w,
            h
        );
    }


    //var markImg = new Image();
    //markImg.src = '/img/cross.gif';

    //this.drawGoMark = function (ctx) {
    //	var time = (new Date()).getTime() - this.goMark.time;
    //
    //	if (time > 1000) {
    //		this.goMark = null;
    //		return;
    //	}
    //
    //	ctx.globalAlpha = 1 - (time / 1000);
    //	ctx.drawImage(
    //		markImg,
    //		Math.round(this.goMark.x * CFG.tileSize - self.offset[0]),
    //		Math.round(this.goMark.y * CFG.tileSize - self.offset[1])
    //	);
    //	ctx.globalAlpha = 1;
    //};


    this.partial = false;

    this.draw = function(ctx) {
        //if (drawable && self.focusNow !== null && clip !== null) {
        //return
        if (drawable && self.isFocusSet()) {
            var canvasSize = Engine.getCanvasViewSize();
            let mapShift = Engine.mapShift.getShift();

            let zoom = Engine.zoomManager.getActualZoom();

            let _clip = [
                clip[0] + mapShift[0],
                clip[1] + mapShift[1],
                clip[2] + mapShift[0],
                clip[3] + mapShift[1]
            ];

            var width = _clip[2];
            var height = _clip[3];

            // if (zoom < 1) {
            // 	width /= zoom;
            // 	height /= zoom;
            // }

            //let ctxMap 			= getEngine().getCtxMap();
            //let zoomChange 		= zoom != ctxMap.globalAlpha;


            //if (!checkRender()) {
            //	return
            //}

            //console.log('draw')

            //setForceRender(false);

            //let _ctx = ctxMap

            //oldClip = [clip[0], clip[1], clip[2], clip[3]];

            //if (zoomChange) {
            //	_ctx.save();
            //}
            //_ctx.clearRect(0, 0, _ctx.canvas.width, _ctx.canvas.height);

            //if (zoomChange) {
            //	_ctx.scale(zoom, zoom);
            //}

            if (!self.partial) {
                self.drawImage(ctx, width, height, 0, 0, _clip, canvasSize);
                //ctx.drawImage(
                //	img,
                //	Math.round(_clip[0]),
                //	Math.round(_clip[1]),
                //	width,
                //	height,
                //	Math.round(canvasSize.width / 2 - _clip[2] / 2),
                //	Math.round(canvasSize.height / 2 - _clip[3] / 2),
                //	width,
                //	height
                //);
            } else {

                let w = width / 2;
                let h = height / 2;

                self.drawImage(ctx, w, h, 0, 0, _clip, canvasSize);
                //ctx.drawImage(
                //	img,
                //	Math.round(_clip[0]),
                //	Math.round(_clip[1]),
                //	w,
                //	h,
                //	Math.round(canvasSize.width / 2 - _clip[2] / 2),
                //	Math.round(canvasSize.height / 2 - _clip[3] / 2),
                //	w,
                //	h
                //);

                self.drawImage(ctx, w, h, w, 0, _clip, canvasSize);
                //ctx.drawImage(
                //	img,
                //	Math.round(_clip[0]) + w,
                //	Math.round(_clip[1]),
                //	w,
                //	h,
                //	Math.round(canvasSize.width / 2 - _clip[2] / 2) + w,
                //	Math.round(canvasSize.height / 2 - _clip[3] / 2),
                //	w,
                //	h
                //);

                self.drawImage(ctx, w, h, 0, h, _clip, canvasSize);
                //ctx.drawImage(
                //	img,
                //	Math.round(_clip[0]),
                //	Math.round(_clip[1]) + h,
                //	w,
                //	h,
                //	Math.round(canvasSize.width / 2 - _clip[2] / 2),
                //	Math.round(canvasSize.height / 2 - _clip[3] / 2) + h,
                //	w,
                //	h
                //);

                self.drawImage(ctx, w, h, w, h, _clip, canvasSize);
                //ctx.drawImage(
                //	img,
                //	Math.round(_clip[0]) + w,
                //	Math.round(_clip[1]) + h,
                //	w,
                //	h,
                //	Math.round(canvasSize.width / 2 - _clip[2] / 2) + w,
                //	Math.round(canvasSize.height / 2 - _clip[3] / 2) + h,
                //	w,
                //	h
                //);


            }


            //if (zoomChange) {
            //	_ctx.restore();
            //}

            //if (this.goMark) this.drawGoMark(ctx);
        }
    };

    this.drawImage = (ctx, w, h, x, y, _clip, canvasSize) => {
        ctx.drawImage(
            img,
            Math.round(_clip[0] + x),
            Math.round(_clip[1] + y),
            w,
            h,
            Math.round(canvasSize.width / 2 - _clip[2] / 2 + x),
            Math.round(canvasSize.height / 2 - _clip[3] / 2 + y),
            w,
            h
        );
    }

    var mousedownAt = -1;
    this.onclick = function(e) {

        let zoomFactor = Engine.zoomFactor;
        let zoom = Engine.zoomManager.getActualZoom();

        //if (!Engine.opt(7)) {
        if (isSettingsOptionsMouseHeroWalkOn()) {
            let offset = Engine.interface.get$gameLayer().offset();

            let pos = self.getTranslatedMousePos(
                e.clientX - offset.left / zoomFactor / zoom + self.offset[0],
                e.clientY - offset.top / zoomFactor / zoom + self.offset[1]
            );

            Engine.hero.autoGoTo(pos, false); //true
            Input.setMoveDirection(null);
        }
        mousedownAt = -1;
        //if (Engine.playerCatcher) Engine.playerCatcher.stopFollow();
        if (Engine.dialogue) Engine.dialogue.checkIsBubbleCloud();
    };

    var activeMouse = false;
    this.mousePos = null;
    this.moveDir = null;

    this.onmousedown = (e) => {
        mousedownAt = (new Date()).getTime();
        if (blockMouseOnSpecificMap()) return;
        if (e.which == 1) {
            Engine.hero.blockMove = false;
            activeMouse = true;
            this.mousePos = {
                clientX: e.clientX,
                clientY: e.clientY
            };
        }
        if (e.which == 3) {
            Engine.hero.blockMove = false;
        }
    };

    this.onmouseup = (e) => {
        activeMouse = false;
        this.mousePos = null;
        Input.setMoveDirection(null);
    };

    this.onmousemove = (e) => {
        //if (activeMouse && !Engine.opt(7)) {
        if (activeMouse && isSettingsOptionsMouseHeroWalkOn()) {
            this.mousePos = {
                clientX: e.clientX,
                clientY: e.clientY
            };
            this.setDirFromMousePosition();
        }
    };

    this.setDirFromMousePosition = function() {
        if (!Engine.map.mousePos) return;
        let $GAME_CANVAS = Engine.interface.get$GAME_CANVAS();
        var angle = Math.atan2(
            ((Engine.hero.d.y - Math.floor(Engine.map.offset[1] / CFG.tileSize)) * CFG.tileSize + $GAME_CANVAS.offset().top) - Engine.map.mousePos.clientY,
            ((Engine.hero.d.x - Math.floor(Engine.map.offset[0] / CFG.tileSize)) * CFG.tileSize + $GAME_CANVAS.offset().left) - Engine.map.mousePos.clientX
        );
        if (angle > 2.25 || angle <= -2.25) {
            Engine.map.moveDir = Engine.map.col.check(Engine.hero.d.x + 1, Engine.hero.d.y) ? (angle >= 0 ? 'N' : 'S') : 'E';
        } else if (angle > 0.75 && angle <= 2.25) {
            Engine.map.moveDir = Engine.map.col.check(Engine.hero.d.x, Engine.hero.d.y - 1) ? (angle >= 1.5 ? 'E' : 'W') : 'N';
        } else if (angle > -0.75 && angle <= 0.75) {
            Engine.map.moveDir = Engine.map.col.check(Engine.hero.d.x - 1, Engine.hero.d.y) ? (angle >= 0 ? 'N' : 'S') : 'W';
        } else if (angle > -2.25 && angle <= -0.75) {
            Engine.map.moveDir = Engine.map.col.check(Engine.hero.d.x, Engine.hero.d.y + 1) ? (angle >= -1.5 ? 'W' : 'E') : 'S';
        }
        Input.setMoveDirection(Engine.map.moveDir);
    };

    const clipObjectScale = (left, top, width, height, scale = 1, offsetScaleX, offsetScaleY) => {

        let minLeft = minLeftMaxLeftAndMinTopMaxTop.minLeft;
        let maxLeft = minLeftMaxLeftAndMinTopMaxTop.maxLeft;
        let minTop = minLeftMaxLeftAndMinTopMaxTop.minTop;
        let maxTop = minLeftMaxLeftAndMinTopMaxTop.maxTop;

        let o = {
            left: left,
            top: top,
            backgroundPositionX: 0,
            backgroundPositionY: 0,
            widthOrigin: width,
            heightOrigin: height,
            width: width * scale,
            height: height * scale,
            widthScale: width,
            heightScale: height,
        };

        // o.left += (o.widthOrigin - o.width) / 2;
        // o.top  += (o.heightOrigin - o.height) / 2;
        // o.top  -= o.height - o.widthOrigin / 2 - o.widthOrigin;
        // o.top  -= o.height - 50;

        if (offsetScaleX != null) {
            o.left -= o.width - offsetScaleX;
        } else {
            o.left += (o.widthOrigin - o.width) / 2;
        }

        if (offsetScaleY != null) {
            o.top -= o.height - offsetScaleY;
        } else {
            o.top += (o.heightOrigin - o.height) / 2;
        }


        if (left > maxLeft) return null;
        if (top > maxTop) return null;

        if (o.left < minLeft) {
            let absLeft = Math.abs(o.left - minLeft);
            o.width = o.width - absLeft;
            o.widthScale = o.widthScale - absLeft / scale;

            if (o.width <= 0) return null;

            o.backgroundPositionX = absLeft / scale;
            o.left = minLeft;
        }

        if (o.left + o.width > maxLeft) {
            let v = ((o.left + o.width) - maxLeft)
            o.width = o.width - v;
            o.widthScale = o.widthScale - v / scale;
        }

        if (o.top < minTop) {
            let absTop = Math.abs(o.top - minTop);
            o.height = o.height - absTop;
            o.heightScale = o.heightScale - absTop / scale;

            if (o.height <= 0) return null;

            o.backgroundPositionY = absTop / scale;
            o.top = minTop;
        }

        if (o.top + o.height > maxTop) {
            let v = ((o.top + o.height) - maxTop);
            o.height = o.height - v;
            o.heightScale = o.heightScale - v / scale;
        }

        return o;

    };

    const clipObject = (left, top, width, height) => {

        let minLeft = minLeftMaxLeftAndMinTopMaxTop.minLeft;
        let maxLeft = minLeftMaxLeftAndMinTopMaxTop.maxLeft;
        let minTop = minLeftMaxLeftAndMinTopMaxTop.minTop;
        let maxTop = minLeftMaxLeftAndMinTopMaxTop.maxTop;

        let o = {
            left: left,
            top: top,
            backgroundPositionX: 0,
            backgroundPositionY: 0,
            width: width,
            height: height
        };

        if (left > maxLeft) return null;
        if (top > maxTop) return null;

        if (o.left < minLeft) {
            let absLeft = Math.abs(o.left - minLeft);
            o.width = o.width - absLeft;

            if (o.width <= 0) return null;

            o.backgroundPositionX = absLeft;
            o.left = minLeft;
        }

        if (o.left + o.width > maxLeft) o.width = o.width - ((o.left + o.width) - maxLeft);

        if (o.top < minTop) {
            let absTop = Math.abs(o.top - minTop);
            o.height = o.height - absTop;

            if (o.height <= 0) return null;

            o.backgroundPositionY = absTop;
            o.top = minTop;
        }

        if (o.top + o.height > maxTop) o.height = o.height - ((o.top + o.height) - maxTop);

        return o;

    };

    this.setDrawable = function(val) {
        drawable = val;
    };

    //called before new map loads
    this.onClear = function() {
        resetBackgroundOffset();
        this.setBackgroundColor([0, 0, 0]);
        this.goMark = null;
        this.focusTarget = null;
        this.focusNow = null;
        this.water = [];
        this.d = {};
        this.size = {
            x: null,
            y: null
        };
        this.col.onClear();
        this.getGroundItems().clear();
        this.getGateways().clear();
        this.getRips().clear();
        this.getQuestProgressBar().clear();
    };

    this.onResize = () => {
        let $GAME_CANVAS = Engine.interface.get$GAME_CANVAS();
        if ($GAME_CANVAS.width() <= 0 || $GAME_CANVAS.height() <= 0) {
            this.blockDrawable();
        } else {
            this.setDrawable(true);
        }
    };

    this.getGroundItems = () => {
        if (!isset(this.groundItems)) {
            throw Error('this.groundItems is not defined');
        }
        return this.groundItems;
    };

    this.getGateways = () => {
        if (!isset(this.gateways)) {
            throw Error('this.gateways is not defined');
        }
        return this.gateways;
    };

    this.getRips = () => {
        if (!isset(this.rip)) {
            throw Error('this.rip is not defined');
        }
        return this.rip;
    };

    this.getQuestProgressBar = () => {
        if (!isset(this.questProgressBar)) {
            throw Error('this.questProgressBar is not defined');
        }
        return this.questProgressBar;
    };

    /* istanbul ignore next */
    this.getEngine = () => {
        return Engine;
    };

    this.getClip = () => {
        return clip;
    }

    this.clipObject = clipObject;
    this.clipObjectScale = clipObjectScale;

    this.getMinLeftMaxLeftAndMinTopMaxTop = () => {
        return minLeftMaxLeftAndMinTopMaxTop
    }

    const setForceRender = (_forceRender) => {
        forceRender = _forceRender;
    }

    const getOffset = () => {
        return this.offset;
    }

    const getSize = () => {
        return {
            x: this.size.x,
            y: this.size.y,
        }
    }

    const getAlwaysDraw = () => {
        return alwaysDraw
    };

    const setAlwaysDraw = (_alwaysDraw) => {
        alwaysDraw = _alwaysDraw
    };

    this.getAlwaysDraw = getAlwaysDraw;
    this.setAlwaysDraw = setAlwaysDraw;

    this.getMinX = () => {
        return this.minX
    };
    this.getMinY = () => {
        return this.minY
    };
    this.getMaxX = () => {
        return this.maxX
    };
    this.getMaxY = () => {
        return this.maxY
    };
    this.getSize = getSize
    this.getBackgroundOffset = getBackgroundOffset;
    this.setForceRender = setForceRender;
    this.getOffset = getOffset;
    this.isBackgroundOffsetExist = isBackgroundOffsetExist;
    this.getRedrawImageWithBackgroundOffset = getRedrawImageWithBackgroundOffset;
};
Map.prototype = Object.create(Updateable.prototype);

Map.prototype.constructor = Map;

module.exports = Map;