var Storage = require('@core/Storage');
var Templates = require('@core/Templates');
//var Settings = require('@core/Settings');
var Premium = require('@core/Premium');
var Banners = require('@core/banners/Banners');
var DraconiteShop = require('@core/shop/DraconiteShop');
var Help = require('@core/Help2');
//var MusicPanel = require('@core/sound/MusicPanel');
//var AddonsPanel = require('@core/addons/AddonsPanel');

var ChangePlayer = require('@core/ChangePlayer');
//var PadController = require('@core/PadController');
var TpScroll = require('@core/TpScroll');
var HeroElements = require('@core/interface/HeroElements');
var MailsElements = require('@core/interface/MailsElements');
let LayersData = require('@core/interface/LayersData');
var ChatData = require('@core/chat/ChatData');
const {
    WW
} = require('@core/worldWindow/WorldWindow');
const {
    isMobileApp
} = require('../HelpersTS');
const ColliderData = require('@core/collider/ColliderData');
const CostComponent = require('@core/components/CostComponent');
const CanvasObjectTypeData = require('@core/CanvasObjectTypeData');
const StorageData = require('@core/StorageData');
var ResolutionData = require('@core/resolution/ResolutionData');



module.exports = function() {
    var self = this;

    var notifQueue = [];

    //var lastSendClanMessage = 0;

    let interfaceLightMode = false

    let layers = {};

    let interfaceFocusList = [];
    let interfaceBlurList = [];

    let $gameWindowPositioner = null;
    let $gameLayer = null;
    let $MAP_CANVAS;
    let $GAME_CANVAS;

    let $bottomPositioner;
    let $topPositioner;
    let $rightColumn

    let $bigMessagesLightMode
    let $buildsInterface;
    let $location;
    let $locationLightMode;
    let $locationId;
    let $mapTimer;
    let $mapBall;
    let $mapBallLightMode;
    let $inventory

    let goldCostComponent = null;
    let slCostComponent = null;

    //this.alreadyInitialised = false;

    let alreadyInitialised = false;


    const SHOW_RIGHT_COLUMN_WIDTH = 241

    const setAlreadyInitialised = (_alreadyInitialised) => {
        alreadyInitialised = _alreadyInitialised;
    };

    const initCostStatsLightMode = () => {
        const $interfaceLayer = Engine.interface.get$interfaceLayer();
        const $currencyLightMode = $interfaceLayer.find('.currency-light-mode');

        goldCostComponent = new CostComponent();
        slCostComponent = new CostComponent();

        goldCostComponent.init();
        slCostComponent.init();

        $currencyLightMode.find('.gold-currency')[0].appendChild(goldCostComponent.getElement());
        $currencyLightMode.find('.sl-currency')[0].appendChild(slCostComponent.getElement());
    };

    const updateCredits = (val, tip) => {
        slCostComponent.updateData({
            currency: "credits",
            price: val,
            cl: ['small']
        });
        $(slCostComponent.getElement()).tip(tip)
    }

    const updateGold = (val) => {
        self.get$interfaceLayer().find('.herogold').html(val);
        goldCostComponent.updateData({
            currency: "gold",
            price: val,
            cl: ['small']
        });
    }

    const getGoldCostComponent = () => {
        return goldCostComponent
    }

    this.getAlreadyInitialised = () => {
        return alreadyInitialised;
    };

    this.lock = new Lock(['game_init', 'loader', 'images', 'crossStorage', 'charlist'], function() {

        let tempAlreadyInitialised = alreadyInitialised;

        if (!tempAlreadyInitialised) self.afterUnlock();

        Engine.interfaceStart = true;

        if (!tempAlreadyInitialised) {
            devConsoleLog(['initialise onResize']);
            Engine.onResize();
            Engine.tutorialManager.startAfterInterfaceLoad();
        }
    });

    const getInterfaceStart = () => {
        return Engine.interfaceStart;
    }

    this.get$gameWindowPositionerHeight = () => {
        return $gameWindowPositioner.height();
    };

    this.get$InterfaceLayerHeight = () => {
        return this.get$interfaceLayer().height();
    };

    this.initPositioners = () => {
        $bottomPositioner = this.get$interfaceLayer().find('.bottom.positioner');
        $topPositioner = this.get$interfaceLayer().find('.top.positioner');

        $rightColumn = $gameWindowPositioner.find('.right-column.main-column');
    };

    this.get$rightColumn = () => {
        return $rightColumn;
    }

    this.getBottomPositioner = () => {
        return $bottomPositioner;
    };

    this.getTopPositioner = () => {
        return $topPositioner;
    };

    this.init$MAP_CANVAS = () => {
        $MAP_CANVAS = $('#MAP_CANVAS');
    };

    this.init$GAME_CANVAS = () => {
        $GAME_CANVAS = $('#GAME_CANVAS');
    };

    this.init$gameWindowPositioner = () => {
        $gameWindowPositioner = $('.game-window-positioner');
    };

    const init$location = () => {
        $location = this.get$interfaceLayer().find('.location');
    };

    const init$locationLightMode = () => {
        $locationLightMode = this.get$interfaceLayer().find('.location-wrapper-light-mode').find('.location-name');
    };

    const get$mapBall = () => {
        return $mapBall
    }

    const get$mapBallLightMode = () => {
        return $mapBallLightMode
    }

    const init$mapBall = () => {
        $mapBall = this.get$interfaceLayer().find('.map_ball');
    }

    const init$mapBallLightMode = () => {
        $mapBallLightMode = this.get$interfaceLayer().find('.map-ball');
    }

    const init$locationId = () => {
        $locationId = this.get$interfaceLayer().find('.location-id');
    };

    const init$buildsInterface = () => {
        $buildsInterface = this.get$interfaceLayer().find('.builds-interface');
    };

    const init$bigMessagesLightMode = () => {
        $bigMessagesLightMode = this.get$interfaceLayer().find('.big-messages-light-mode');
    };

    const init$mapTimer = () => {
        $mapTimer = this.get$interfaceLayer().find('.map-timer');
    };

    const get$locationLightMode = () => {
        return $locationLightMode;
    };

    const get$location = () => {
        return $location;
    };

    const get$locationId = () => {
        return $locationId;
    };

    const get$buildsInterface = () => {
        return $buildsInterface;
    };

    const get$bigMessagesLightMode = () => {
        return $bigMessagesLightMode;
    };

    const setTip$mapTimer = (tip) => {
        $mapTimer.tip(tip)
    };

    const addClassTo$mapTimer = (addClass) => {
        $mapTimer.addClass(addClass);
    }

    const removeClassFrom$mapTimer = (addClass) => {
        $mapTimer.removeClass(addClass);
    }

    const show$mapTimer = (state) => {
        const SHORT = "short";
        const SHOW = "show";

        if (state) {
            $location.addClass(SHORT);
            $locationId.addClass(SHORT);
            $mapTimer.addClass(SHOW);
        } else {
            $location.removeClass(SHORT);
            $locationId.removeClass(SHORT);
            $mapTimer.removeClass(SHOW);
        }
    }


    this.interfaceFocus = true;

    this.init = function() {


        addCallbackToInterfaceBlurList(function(e) {
            self.interfaceFocus = false;
        });

        addCallbackToInteraceFocusList(function(e) {
            self.interfaceFocus = true;
        })

        initInterfaceFocus();
        initInterfaceBlur();

        this.init$gameWindowPositioner();
        this.blockWheel();
        this.initCachedScripts();

        this.initAppend();
        this.initLayers();
        //this.init$MAP_CANVAS();
        this.init$GAME_CANVAS();

        this.initPositioners();
        this.initMouseEvent();

        if (mobileCheck()) {
            initTouchEvent();
            // initTouchEvent2();
        }

        this.initInterfaceTemplates();

        this.createZoomOverlay();

        this.heroElements = new HeroElements();
        this.heroElements.init();
        this.mailsElements = new MailsElements(this);

        init$buildsInterface();
        init$bigMessagesLightMode();
        init$location();
        init$locationLightMode();
        init$locationId();
        init$mapTimer();
        init$mapBall();
        init$mapBallLightMode();
        initCostStatsLightMode();

        var $loader = this.get$loaderLayer().find('.progress-bar .inner');
        $loader.css('display', 'block');

        setPercentProgressBar($loader, 0);
        $(window).on('resize', function() {

            Engine.onResize();
        })
    };

    this.initMouseEvent = () => {
        $GAME_CANVAS.on("mouseup mousedown click mousemove mouseleave mouseenter contextmenu longpress", function(e) {
            if (e.type === 'longpress') e.type = 'contextmenu';
            let factor = Engine.zoomFactor;
            let zoom = getEngine().zoomManager.getActualZoom();

            let $offset = $GAME_CANVAS.offset();
            let left = $offset.left;
            let top = $offset.top;

            e.clientX = e.clientX / factor;
            e.clientY = e.clientY / factor;
            e.clientX = e.clientX / zoom;
            e.clientY = e.clientY / zoom;

            Engine.eventCollider.dispatch(
                e,
                e.clientX - left / factor / zoom + Engine.map.offset[0],
                e.clientY - top / factor / zoom + Engine.map.offset[1]
            );
        });

        $([
                this.get$interfaceLayer()[0],
                this.get$mAlertLayer()[0],
                this.get$alertsLayer()[0]
            ]).on('mousedown', function() {
                if (!blockRemoveMobileMenu) $('.popup-menu').remove();
            })
            .on('mouseup', function() {
                var others = Engine.others.check();
                for (var k in others) {
                    var o = others[k];
                    if (o.colorMark && o.colorMark.color == 'green') {
                        delete o.colorMark;
                        Engine.targets.deleteArrow('Other-' + o.d.id);
                    }

                }
                hideColorPickerPalette();
            });
    };

    const initTouchEvent = () => {
        let padTimeout = null;
        /*
            $GAME_CANVAS.on("pointerdown pointermove pointerup pointercancel", function (e) {
              switch (e.type) {
                case 'pointerdown': {

                  let pos = getXYFromRealLeftTop(e.pageX, e.pageY);
                  let list = Engine.renderer.getCollisionsAt(pos.x, pos.y);

                  if (!checkCanCallPad(list)) {
                    return;
                  }

                  padTimeout = setTimeout(function () {
                    Engine.padController.show(e);

                    let zoom = 1 / Engine.zoomFactor;
                    let pLeft = e.pageX * zoom;
                    let pTop = e.pageY * zoom;
                    let padSize = Engine.padController.getPadSize();
                    let margin = 4;
                    let h = padSize + margin;

                    pLeft = pLeft - h / 2;
                    pTop = pTop - h / 2;

                    Engine.padController.setPos(pLeft, pTop);
                    Engine.padController.touchstartEvent(e);
                    e.preventDefault();
                  }, 200);
                  break;
                }

                case 'pointermove': {
                  if (Engine.padController.isShow()) {

                    Engine.padController.touchmoveEvent(e);
                  }
                  e.preventDefault();
                  break;
                }

                case 'pointerup':
                case 'pointercancel': {
                  // debugger;
                  if (padTimeout) {
                    clearTimeout(padTimeout);
                    padTimeout = null;
                  }
                  if (Engine.padController.isShow()) {
                    Engine.padController.touchendEvent();
                    e.preventDefault();
                    Engine.padController.hide();
                  }
                  break;
                }
              }
            });
        */




        $GAME_CANVAS.on("touchstart touchmove touchend", function(e) {
            // $GAME_CANVAS.on("mousedown mousemove mouseup", function (e) {

            let padISShow = Engine.padController.isShow();
            let padEventId = Engine.padController.getTouchEventId();
            let identifier = e.changedTouches[0].identifier

            switch (e.type) {
                case 'touchstart':
                    // case 'mousedown':

                    if (padISShow && identifier != padEventId) {
                        console.log('break touchstart')
                        break;
                    }

                    let touches = e.changedTouches[0]
                    let pos = getXYFromRealLeftTop(touches.pageX, touches.pageY);
                    let list = Engine.renderer.getCollisionsAt(pos.x, pos.y);


                    if (!checkCanCallPad(list)) {
                        return;
                    }

                    padTimeout = setTimeout(function() {
                        Engine.padController.show(e);

                        touches = e.changedTouches[0];
                        let zoom = 1 / Engine.zoomFactor;
                        let pLeft = touches.pageX * zoom;
                        let pTop = touches.pageY * zoom;
                        let padSize = Engine.padController.getPadSize();
                        let margin = 4;
                        let h = padSize + margin;
                        let pagePos = e.changedTouches[0];

                        pLeft = pLeft - h / 2;
                        pTop = pTop - h / 2;

                        Engine.padController.setTouchEventId(identifier);
                        Engine.padController.setPos(pLeft, pTop);
                        Engine.padController.touchstartEvent(pagePos);
                        e.preventDefault();
                    }, 200);
                    break;
                case 'touchmove':
                    // case 'mousemove':
                    //   if (Engine.padController.isShow() && e.targetTouches[0].identifier != Engine.padController.getTouchEventId()) {
                    //     console.log('break touchmove')
                    //     break;
                    //   }
                    if (padISShow && identifier == padEventId) {
                        let pagePos = e.changedTouches[0];
                        Engine.padController.touchmoveEvent(pagePos);
                        // e.preventDefault();
                    }
                    e.preventDefault();
                    break;
                case 'touchend':
                    // case 'mouseup':
                    if (padTimeout) {
                        clearTimeout(padTimeout);
                        padTimeout = null;
                    }

                    // if (Engine.padController.isShow() && e.changedTouches[0].identifier != Engine.padController.getTouchEventId()) {
                    //   console.log('break touchend')
                    //   break;
                    // }

                    if (padISShow && identifier == padEventId) {
                        Engine.padController.touchendEvent();
                        e.preventDefault();
                        Engine.padController.hide();
                    }
                    break;

            }
        })



    };

    const initTouchEvent2 = () => {
        let padTimeout = null;

        // $GAME_CANVAS.on("touchstart touchmove touchend", function (e) {
        $GAME_CANVAS.on("pointerdown pointermove pointerup", function(e) {
            // $GAME_CANVAS.on("mousedown mousemove mouseup", function (e) {

            let padISShow = Engine.padController.isShow();
            let padEventId = Engine.padController.getTouchEventId();
            let identifier = e.pointerId

            switch (e.type) {
                // case 'mousedown':
                case 'pointerdown':
                    // case 'mousedown':
                    // $GAME_CANVAS[0].setPointerCapture(identifier);
                    if (padISShow && identifier != padEventId) {
                        console.log('break touchstart')
                        break;
                    }

                    // let touches 	= e.changedTouches[0]
                    let touches = {
                        pageX: e.pageX,
                        pageY: e.pageY
                    }
                    let pos = getXYFromRealLeftTop(touches.pageX, touches.pageY);
                    let list = Engine.renderer.getCollisionsAt(pos.x, pos.y);


                    if (!checkCanCallPad(list)) {
                        return;
                    }

                    padTimeout = setTimeout(function() {
                        Engine.padController.show(e);

                        // touches 	  = e.changedTouches[0];
                        touches = {
                            pageX: e.pageX,
                            pageY: e.pageY
                        }
                        let zoom = 1 / Engine.zoomFactor;
                        let pLeft = touches.pageX * zoom;
                        let pTop = touches.pageY * zoom;
                        let padSize = Engine.padController.getPadSize();
                        let margin = 4;
                        let h = padSize + margin;
                        let pagePos = {
                            pageX: e.pageX,
                            pageY: e.pageY
                        }

                        pLeft = pLeft - h / 2;
                        pTop = pTop - h / 2;

                        Engine.padController.setTouchEventId(identifier);
                        Engine.padController.setPos(pLeft, pTop);
                        Engine.padController.touchstartEvent(pagePos);
                        // e.preventDefault();
                    }, 200);
                    break;
                    // case 'touchmove':
                case 'pointermove':
                    // case 'mousemove':
                    //   if (Engine.padController.isShow() && e.targetTouches[0].identifier != Engine.padController.getTouchEventId()) {
                    //     console.log('break touchmove')
                    //     break;
                    //   }
                    if (padISShow && identifier == padEventId) {
                        // let pagePos = e.changedTouches[0];
                        // $GAME_CANVAS[0].setPointerCapture(identifier);
                        let pagePos = {
                            pageX: e.pageX,
                            pageY: e.pageY
                        }
                        Engine.padController.touchmoveEvent(pagePos);
                        // e.preventDefault();
                    }
                    // e.preventDefault();
                    break;
                    // case 'touchend':
                case 'pointerup':
                    // case 'mouseup':
                    if (padTimeout) {
                        clearTimeout(padTimeout);
                        padTimeout = null;
                    }

                    // if (Engine.padController.isShow() && e.changedTouches[0].identifier != Engine.padController.getTouchEventId()) {
                    //   console.log('break touchend')
                    //   break;
                    // }

                    if (padISShow && identifier == padEventId) {
                        // $GAME_CANVAS[0].releasePointerCapture(identifier);
                        Engine.padController.touchendEvent();
                        // e.preventDefault();
                        Engine.padController.hide();
                    }
                    break;

            }
        })



    };

    const checkCanCallPad = (collisionList) => {

        if (!collisionList.length) {
            return true;
        }

        for (let k in collisionList) {
            let canvasObject = collisionList[k];

            if (!canvasObject.getCanvasObjectType) {
                continue;
            }

            let canvasObjectType = canvasObject.getCanvasObjectType();

            switch (canvasObjectType) {
                case CanvasObjectTypeData.NPC:
                    if (canvasObject.isTalkOrTakeOrGoNpc()) {
                        return false;
                    }
                    break;
                case CanvasObjectTypeData.PET:
                    if (canvasObject.isPetMine()) {
                        return false;
                    }
                    break;
                case CanvasObjectTypeData.HERO:
                case CanvasObjectTypeData.GATEWAY:
                case CanvasObjectTypeData.OTHER:
                case CanvasObjectTypeData.M_ITEM:
                case CanvasObjectTypeData.RIP:
                    return false;
            }
        }

        return true;
    };

    const hideColorPickerPalette = () => {
        $('.pick-color-palette').css('display', 'none');
    }

    this.blockWheel = function() {
        var isFirefox = typeof InstallTrigger !== 'undefined';
        if (isFirefox) return; // OMG :(
        var w = window;
        var height = w.innerHeight;
        var scrollHeight = document.documentElement.scrollHeight

        window.addEventListener("wheel", function(e) {
            var $target = $(e.target);
            if (!$target.is("textarea") && !$target.closest('.unblock-scroll').length > 0) {
                e.preventDefault();
            }

        }, {
            passive: false
        })
    };

    this.initLayers = function() {
        layers[LayersData.$_CAPTCHA_LAYER] = Templates.get('captcha-layer');
        layers[LayersData.$_ALERTS_LAYER] = Templates.get('alerts-layer');
        layers[LayersData.$_M_ALERT_MOBILE_LAYER] = Templates.get('mAlert-mobile-layer');
        layers[LayersData.$_INTERFACE_LAYER] = Templates.get('interface-layer');
        layers[LayersData.$_LOADER_LAYER] = Templates.get('loader-layer');
        layers[LayersData.$_POP_UP_LAYER] = Templates.get('popup-menu-layer');
        layers[LayersData.$_CONSOLE_LAYER] = Templates.get('console-layer');
        layers[LayersData.$_M_ALERT_LAYER] = Templates.get('mAlert-layer');
        layers[LayersData.$_STICKY_TIPS_LAYER] = Templates.get('sticky-tips-layer');
        layers[LayersData.$_TUTORIAL_LAYER] = Templates.get('tutorial-layer');
        layers[LayersData.$_ECHH_LAYER] = Templates.get('echh-layer');
        layers[LayersData.$_DROP_TO_DELETE_WIDGET_LAYER] = Templates.get('drop-to-delete-widget-layer');
        layers[LayersData.$_ZOOM_LAYER] = Templates.get('zoom-layer');
        layers[LayersData.$_CHAT_LAYER] = Templates.get('chat-layer');

        $gameLayer = layers[LayersData.$_INTERFACE_LAYER].find('.game-layer');

        layers[LayersData.$_LOADER_LAYER].css('display', 'block');

        for (let k in layers) {
            $gameWindowPositioner.append(layers[k]);
        }
    };

    this.showTutorialLayer = () => {
        this.get$tutorialLayer().css('display', 'block');
    };

    this.hideTutorialLayer = () => {
        this.get$tutorialLayer().css('display', 'none');
    };

    this.initInterfaceTemplates = () => {

        var $hpTpl = Templates.get('hp-indicator-wrapper');
        var $expTpl = Templates.get('exp-bar-wrapper');
        var $battleBarsTpl = Templates.get('battle-bars-wrapper');
        var $extendedStats = Templates.get('extended-stats-tpl');
        var $bottomPanel = Templates.get('bottom-panel-of-bottom-positioner');
        var $hudContainer = Templates.get('hud-container');

        let $iLayer = this.get$interfaceLayer();

        $iLayer.find('.bottom.positioner .content').append($bottomPanel);
        $iLayer.find('.hp-indicator-wrapper-template').append($hpTpl);
        $iLayer.find('.hud-container').replaceWith($hudContainer);
        $iLayer.find('.exp-bar-wrapper-template').append($expTpl);
        $iLayer.find('.battle-bars-wrapper-template').append($battleBarsTpl);
        $iLayer.find('.extended-stats').append($extendedStats);

        $gameLayer.append(Templates.get('stasis-incoming-overlay'));
        $gameLayer.append(Templates.get('stasis-overlay'));
        $gameLayer.append(Templates.get('map-reloader-splash'));
        $gameLayer.append(Templates.get('dead-overlay'));

        var $character = Templates.get('character_wrapper');
        $inventory = Templates.get('inventory_wrapper');

        let $equipment = Templates.get("interface-element-equipment-with-additional-bag").addClass("equipment-wrapper");

        $character.find('.equipment-wrapper').replaceWith($equipment);

        const $rightMainColumnWrapper = getRightMainColumnWrapper();

        $rightMainColumnWrapper.append($character);
        $rightMainColumnWrapper.append(Templates.get('battle-set-wrapper'));
        $rightMainColumnWrapper.append($inventory);
        $rightMainColumnWrapper.append($('<div>').addClass('tutorial-banner-anchor'));
    };

    const getRightMainColumnWrapper = () => {
        return $gameWindowPositioner.find('.right-column').find('.inner-wrapper').find('.right-main-column-wrapper');
    }

    this.addToGameWindowPositioner = ($element) => {
        $gameWindowPositioner.append($element);
    };

    this.tooMoreZoomOut = function() {
        return $('body').width() > $(window).width() * 2;
    };

    this.initChangePlayer = () => {
        if (Engine.changePlayer) return;
        Engine.changePlayer = new ChangePlayer.default();
    }

    this.initBattleSetPanel = function() {

        var $children = self.get$interfaceLayer().find('.battle-set-wrapper').children();
        $children.each(function(index) {
            $(this).addClass('battle-set-nr-' + index);
            $(this).click(function() {
                var skills = Engine.skills ? '&skillshop=1' : '';
                _g('moveitem&set=' + (index + 1) + skills);
            });
        });
        self.setActiveInBattleSet(Engine.hero.d.cur_battle_set);
    };

    this.setActiveInBattleSet = function(index) {

        var $battleChoice = self.get$interfaceLayer().find('.battle-set-wrapper').find('.battle-set-choice');
        $battleChoice.removeClass('active');
        $battleChoice.eq(index - 1).addClass('active');
    };

    this.initZoomFactor = function(init) {
        if (!mobileCheck()) {
            self.setZoomFactor(1);
            return;
        }

        //var zoomFactor = Storage.get('ZoomFactor');
        var zoomFactor = getZoomFactorFromStorage();
        if (zoomFactor == null || !init) {
            Engine.zoomFactor = 1;
            var zoom = self.findTheBestZoom();
            self.setZoomFactor(zoom);
        } else {
            Engine.zoomFactor = zoomFactor;
            this.addZoomClassToBody();
        }
        Engine.onResize();
    };

    this.findTheBestZoom = function() {
        var zoom = 1;
        while (tooBigScreen(zoom)) {
            self.decreaseZoom();
            zoom -= 0.1;
            if (zoom < 0.5) return zoom;
        }
        return zoom;
    };

    this.setZoomFactor = function(val) {
        Engine.zoomFactor = val;

        setZoomFactorInStorage(val);
        this.addZoomClassToBody();
    };

    const getZoomFactorFromStorage = () => {
        let store = null;

        if (checkHorizontalOrientation()) {
            store = StorageData.ZOOM_FACTOR_HORIZONTAL;
        } else {
            store = StorageData.ZOOM_FACTOR_VERTICAL;
        }

        return Storage.get(store);
    }

    const setZoomFactorInStorage = (val) => {
        let store = null;

        if (checkHorizontalOrientation()) {
            store = StorageData.ZOOM_FACTOR_HORIZONTAL;
        } else {
            store = StorageData.ZOOM_FACTOR_VERTICAL;
        }

        Storage.set(store, val);
    }

    const checkHorizontalOrientation = () => {
        return window.innerWidth > window.innerHeight
    }

    this.addZoomClassToBody = function() {
        let $body = $('body');
        $body.removeClass('zoom-factor-160');
        $body.removeClass('zoom-factor-150');
        $body.removeClass('zoom-factor-140');
        $body.removeClass('zoom-factor-130');
        $body.removeClass('zoom-factor-120');
        $body.removeClass('zoom-factor-110');
        $body.removeClass('zoom-factor-100');
        $body.removeClass('zoom-factor-90');
        $body.removeClass('zoom-factor-80');
        $body.removeClass('zoom-factor-70');
        $body.removeClass('zoom-factor-60');
        $body.removeClass('zoom-factor-50');
        $body.removeClass('zoom-factor-40');
        $body.addClass('zoom-factor-' + Math.floor((Engine.zoomFactor * 100)));
    };

    this.initCachedScripts = function() {
        jQuery.cachedScript = function(url, options) {
            options = $.extend(options || {}, {
                dataType: "script",
                cache: true,
                url: url
            });
            return jQuery.ajax(options);
        };
    };

    //this.initGlobalScript = function () {
    //	//var __nga = isNaN(parseInt(getCookie('__nga'))) ? 0 : parseInt(getCookie('__nga'));
    //	//debugger;
    //	//return
    //
    //	let globalAddons = Storage.get('globalAddons');
    //
    //
    //	if (globalAddons === null || globalAddons === false) {
    //		window.log('Global addon unblocked (gadblock on to block)');
    //		$.getJSON("/engine?t=getvar_addon&callback=?",{},function(scripts){
    //			if(scripts != '') {
    //				console.log(scripts);
    //
    //				$.getJSON(scripts,{},function(d, e){
    //					console.log(e)
    //					//debugger;
    //					if(d!=''){
    //						console.log(d);
    //
    //					}
    //				});
    //
    //
    //
    //			}
    //		});
    //	} else {
    //		window.log('Global addon blocked (gadblock off to unblock)');
    //	}
    //
    //	//case 'gadblock':
    //	//var d=new Date();
    //	//var val = par=='off'?0:1;
    //	//d.setTime(d.getTime()+3600000*24*30);
    //	//setCookie('__nga', val, d);
    //	//if (val==1) log('Global addon blocked (\'gadblock off\' to unblock)');
    //	//else log('Global addon unblocked (\'gadblock on\' to block)');
    //	//break;
    //
    //};

    this.initAppend = function() {
        var origAppend = $.fn.append;

        $.fn.append = function() {
            return origAppend.apply(this, arguments).trigger("append");
        };
    };

    this.setSizeScreen = function() {
        if (mobileCheck()) {}
    };

    this.afterUnlock = function() {
        // if (self.alreadyInitialised) return;
        //self.alreadyInitialised = true;
        setAlreadyInitialised(true);
        $('body').contextmenu(function(e) {
            if (e.ctrlKey) return;
            e.preventDefault();
        });
        //$('.logs-btn').click(function () {
        //	var $chat = self.get$interfaceLayer().find('.chat-tpl');
        //	var top = parseInt($chat.css('top'));
        //	if (top > 50) $chat.css('top', '40px');
        //	else $chat.css('top', '50%');
        //});
        // Engine.onResize();
        this.get$interfaceLayer().show();
        //Engine.widgetManager.initDefaultWidgetSet();
        this.addStaticButtons();
        //Engine.widgetManager.createEmptySlotsWidget();
        //this.showEmptySlots(false);
        this.shopButtons();
        //this.initEngineSettings();
        this.initBattleSetPanel();
        this.afterCharacterListLoaded();

        Engine.map.setSetings();

        Engine.soundManager.synchroStart();

        this.get$interfaceLayer().show();
        //Engine.chat.setScrollOnBottom();

        Engine.console.displayMsg('Game started.');
        self.setLangClass();
        self.manageMobile();
        self.manageIframe();
        self.setCSSAnimations();
        self.setItemsHighlights();
        //self.initAddons();
        Engine.widgetManager.addWidgetButtonsWithInitZoom();

        //self.initAchievements();
        self.setSizeEqColumnSize();
        //self.pvpIcon();
        self.pvpIcon($mapBall);
        self.pvpIcon($mapBallLightMode);
        self.worldName();
        self.initBanners();
        //Engine.nightController.nightManage();

        Engine.itemsMarkManager.compareAllItems();
        self.get$loaderLayer().fadeOut();

        self.updateInterfaceLayerScrollbars();
        //Engine.tutorialManager.startAfterInterfaceLoad();
        self.setChat();
        getEngine().colorInterfaceNotificationManager.createMainCanvas();
        getEngine().questTracking.afterInterfaceStart();
        getEngine().quests.setTrackItemsAfterInterfaceStart();


        //Engine.communication.setStateTestJSONData('BUILDS_INIT_MORE_BUILDS')

        initFullScreenAlert();

        API.callEvent(Engine.apiData.AFTER_INTERFACE_START);
    };

    this.afterCharacterListLoaded = () => {
        this.initChangePlayer();
        if (Engine.activityObserve) Engine.activityObserve.onCharlistLoaded();
    }

    this.updateInterfaceLayerScrollbars = () => {
        this.get$interfaceLayer().find('.battle-controller .scroll-wrapper').trigger('scrollBottom');
        this.get$interfaceLayer().find('.scroll-wrapper').trigger('update');
    };

    this.checkIfIframe = () => {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    };

    this.manageIframe = function() {
        var iframe = this.checkIfIframe();
        if (iframe && !mobileCheck()) {
            self.fullScreenInfoAlert(_t('full_screen'));
        }
    };

    this.manageMobile = function() {
        var mobile = mobileCheck();

        if (!mobile) return;
        $('body').addClass('mobile-version');
        //Engine.padController = new PadController();

        if (Engine.padController) Engine.padController.init();
        else errorReport('Interface.js', 'managerMobile', "Engine.padController nor exist!");

        //if (!isMobileApp()) self.fullScreenInfoAlert(_t('mobile_info'));
    };

    const initFullScreenAlert = () => {
        if (!mobileCheck()) return;

        if (!isMobileApp()) self.fullScreenInfoAlert(_t('mobile_info'));
    }

    this.fullScreenInfoAlert = (msg) => {

        mAlert(msg, [{
            txt: 'OK',
            callback: function() {
                self.clickFullScreen();
                return true;
            }
        }, {
            txt: _t('no'),
            callback: function() {
                return true;
            }
        }], false, LayersData.$_M_ALERT_MOBILE_LAYER);
    };

    this.setCSSAnimations = function() {
        //if (!Engine.opt(8)) {
        if (isSettingsOptionsInterfaceAnimationOn()) {
            $('body').addClass('anim-on');
        } else {
            $('body').removeClass('anim-on');
        }
    };

    this.setItemsHighlights = function() {
        //if (Engine.opt(13)) {
        //	$('body').addClass('s-item-highlights-off');
        //} else {
        //	$('body').removeClass('s-item-highlights-off');
        //}
        if (isSettingsOptionsShowItemsRankOn()) $('body').removeClass('s-item-highlights-off');
        else $('body').addClass('s-item-highlights-off');

    };

    this.setLangClass = function() {
        $('body').addClass(`lang-${_l()}`);
    };

    this.createNotif = (name) => {
        let $notif = Templates.get('right-column-notif');

        this.addToQueue(name);
        $notif.attr('id', name);

        this.get$interfaceLayer().find('.bottom-right').find('.game-notifications').append($notif);
        this.setPositionNotif(name);

        return $notif;
    };

    this.deleteNotif = function(name) {
        var index = this.getNotifIndex(name);
        if (index === null) return;
        var $notif = $('#' + name);
        $notif.remove();
        notifQueue.splice(index, 1);
        self.rebuildPosAllNotif();
    };

    this.setPositionNotif = function(name) {
        var index = this.getNotifIndex(name);
        if (index === null) return;
        var $notif = $('#' + name);
        var pos = 43 * index;
        $notif.css('bottom', pos + 'px');
    };

    this.rebuildPosAllNotif = function() {
        for (var i = 0; i < notifQueue.length; i++) {
            var name = notifQueue[i];
            this.setPositionNotif(name);
        }
    };

    this.getNotifIndex = function(name) {
        var index = notifQueue.indexOf(name);
        if (index > -1) return index;
        return null;
    };

    this.addToQueue = function(name) {
        var index = this.getNotifIndex(name);
        if (index !== null) return;
        notifQueue.push(name);
    };

    //this.initEngineSettings = function () {
    //	if (!Engine.settings) {
    //		Engine.settings = new Settings;
    //		Engine.settings.init();
    //	}
    //};



    this.canShowAddons = function() {
        var worlds = ['dev', 'new', 'experimental'];
        return worlds.indexOf(Engine.worldConfig.getWorldName()) > -1;
    };

    //this.initAddons = function () {
    //	Engine.addonsPanel = new AddonsPanel();
    //	Engine.addonsPanel.init();
    //};

    this.initBanners = function() {
        Engine.banners = new Banners();
        Engine.banners.init();
        Engine.banners.showOrHideBanners();
    };


    this.showConsoleNotif = function() {
        var name = 'consoleNotif';
        var $lvlUp = $('#' + name);
        if ($lvlUp.length) return;
        var $notif = self.createNotif(name);
        var str = _t('warn_tip', null, 'static');
        $notif.tip(str);
        $notif.click(function() {
            Engine.console.open();
        });
    };

    //this.focusChat = () => {
    //	var $column = this.get$interfaceLayer().find('.left-column.main-column');
    //	if ($column.css('display') == 'none') {
    //		this.clickChat();
    //	}
    //   Engine.chat.focus();
    //};

    this.isShowLeftColumn = () => {
        return this.get$interfaceLayer().find('.left-column.main-column').css('display') != 'none';
    }

    this.createZoomOverlay = function() {
        var $zL = $('.zoom-layer');

        let eventName = getClickEventName();

        // $zL.find('.plus').click(function () {
        $zL.find('.plus').on(eventName, function() {
            self.clickIncreaseZoom();
        });
        // $zL.find('.minus').click(function () {
        $zL.find('.minus').on(eventName, function() {
            self.clickDecreaseZoom();
        });
        var $btn = Templates.get('button').addClass('green');
        $btn.find('.label').html(_t('out', null, 'logoff'));
        var $btn2 = Templates.get('button').addClass('green');
        $btn2.find('.label').html(_t('standart_zoom'));
        $zL.find('.btn-wrapper').append($btn);
        $zL.find('.btn-wrapper').append($btn2);
        $btn.click(self.clickZoomOverlayPanel);
        $btn2.click(function() {
            self.setZoomFactor(1);
            Engine.onResize();
            self.initZoomFactor(false);
        });
    };

    this.clickZoomOverlayPanel = function() {
        let visible = self.get$zoomLayer().css('display') == 'block';
        let newState = visible ? 'none' : 'block';

        self.get$zoomLayer().css('display', newState);
    };

    this.getPopupMenu = () => {
        //let $popUpMenu = $('.popup-menu');
        let $popUpMenu = self.get$popUpLayer().find('.popup-menu')
        if (!$popUpMenu.length) return null;

        return $popUpMenu;
    };

    const removePopupMenu = () => {
        let $popUpMenu = self.getPopupMenu();

        if ($popUpMenu) {
            $popUpMenu.remove()
        }
    }

    this.showPopupMenu = function(menu, e, options = {}) {
        e.stopPropagation();
        e.preventDefault();
        const defaultOptions = {
            onMap: false,
        }
        options = Object.assign({}, defaultOptions, options);

        removePopupMenu();

        if (!menu.length) return;
        var $m = Templates.get("popup-menu");
        if (options.cssClass) $m.addClass(options.cssClass);
        if (options.header) {
            const $header = Templates.get("popup-menu-header");
            $header.html(options.header);
            $m.append($header);
        }
        var $btn = Templates.get('button').addClass('small');

        for (var i in menu) {
            (function(i) {
                var clone = Templates.get("menu-item").html(parseBasicBB(menu[i][0], false));
                if (isset(menu[i][2])) {
                    clone.addClass(menu[i][2].button.cls);
                }
                $(clone).click(function() {
                    menu[i][1]();
                    if (!clone.hasClass('not-close')) $m.remove();
                });
                $m.append(clone);
            })(i);
        }
        var zIndex = self.get$popUpLayer().children().length + 1;
        self.get$popUpLayer().append($m);

        let isMobile = mobileCheck();
        if (isMobile) $m.addClass('mobile-menu');

        let w = $m.outerWidth();
        let h = $m.outerHeight();

        if (isMobile) {
            const wHeight = window.innerHeight / Engine.zoomFactor;
            if (h > wHeight) {
                $m.removeClass('mobile-menu');
                h = $m.outerHeight();
            }
        }

        const {
            left,
            top
        } = this.calcPopupMenuPos(e.clientX, e.clientY, w, h, options.onMap);


        $m.css({
            top: top,
            left: left,
            'z-index': zIndex
        }).addClass('show');
    };

    this.calcPopupMenuPos = function(clientX, clientY, mWidth, mHeight, onMap) {
        const zoomFactor = Engine.zoomFactor
        const wHeight = window.innerHeight / zoomFactor;
        const wWidth = window.innerWidth / zoomFactor;
        const rightMenuBound = wWidth - mWidth;
        const bottomMenuBound = wHeight - mHeight;

        //let clientX = e.clientX;
        //let clientY = e.clientY;

        if (onMap) {
            let zoom = Engine.zoomManager.getActualZoom();
            clientX *= zoom;
            clientY *= zoom;
        }

        let top = clientY - mHeight / 2;
        let left = clientX - mWidth / 2;

        if (left < 0) left = 0;
        if (top < 0) top = 0;

        if (left > rightMenuBound) left = rightMenuBound;
        if (top > bottomMenuBound) top = bottomMenuBound;

        return {
            left,
            top
        };
    };

    this.isDecember = function() {
        var d = new Date();
        var n = d.getMonth();

        return n == 11 ? '' : 'disabled';
    };

    this.getBattlePassActive = function() {
        return Engine.battlePassActive;
    };

    this.rewardsCalendarActive = function() {
        return Engine.rewardsCalendarActive;
    };

    this.clickLogout = () => {
        Engine.changePlayer.managePanelVisible();
    };

    this.clickHelp = function() {
        if (!Engine.help) {
            Engine.help = new Help();
            Engine.help.init();
        } else Engine.help.close();
    };

    this.clickSettings = function() {
        Engine.settings.toggle();

        //if (!Engine.musicPanel) {
        //	Engine.musicPanel = new MusicPanel();
        //	Engine.musicPanel.init();
        //}
    };

    this.clickMatchmaking = function() {
        Engine.matchmaking.toggle();
    };


    this.clickNews = function() {
        //gameanalytics.GameAnalytics.addDesignEvent("News:ClickNews", 1);
        if (Engine.news) Engine.news.close();
        else _g('promotions&a=show')
    };

    this.clickBattlePass = function() {
        //gameanalytics.GameAnalytics.addDesignEvent("News:ClickNews", 1);
        if (Engine.battlePass) Engine.battlePass.close();
        else _g('battlepass&action=status')
    };

    this.clickParty = function() {
        if (Engine.party) Engine.party.toggle();
        else message(_t('no-party', null, 'party'));
    };

    this.clickMiniMap = function() {
        Engine.miniMapController.toggleMiniMap();
    };

    this.clickClan = function() {
        if (!Engine.clan) {
            if (Engine.hero.d.clan) {
                _g("clan&a=myclan");
            } else {
                _g('clan&a=list&page=1');
            }
        } else Engine.clan.close();
    };

    this.clickEventCalendar = function() {
        if (!Engine.eventCalendar) _g('calendar');
        else Engine.eventCalendar.close();
    };

    this.clickChat = function() {
        Engine.chatController.getChatWindow().chatToggle();
    };

    this.setChat = function() {

        let s = Engine.chatController.getChatWindow().getChatSize();

        //Engine.chatController.getChatDataUpdater().setDataFromServerStorage();
        Engine.widgetManager.manageClassOfWidget(Engine.widgetsData.name.CHAT, s ? true : false);

        $gameWindowPositioner.removeClass('chat-size-0 chat-size-1').addClass(`chat-size-${s}`);

        Engine.onResize();
        Engine.map.onResize();
    };

    //this.genClanChatMessage = function () {
    //	var command = "/k";
    //	// if(_l() == "pl"){
    //	if(isPl()){
    //		command = "/k";
    //	}else{
    //		command = "/g";
    //	}
    //	return command + " " + _t("my_location %map% %x% %y%", {
    //			"%map%": Engine.map.d.name,
    //			"%x%": Engine.hero.d.x,
    //			"%y%": Engine.hero.d.y
    //		}, "clan_my_location");
    //};

    this.clickSendMessageOnClanChat = function() {
        //var now = unix_time();
        //if (Engine.hero.d.clan != 0 && (now - lastSendClanMessage) > 0) {
        //	lastSendClanMessage = now;
        //	_g("chat", false, { c: self.genClanChatMessage() });
        //}

        let text = _t("my_location %map% %x% %y%", {
            "%map%": Engine.map.d.name,
            "%x%": Engine.hero.d.x,
            "%y%": Engine.hero.d.y
        }, "clan_my_location");

        if (!getEngine().chatController.getChatChannelsAvailable().checkAvailableProcedure(ChatData.CHANNEL.CLAN)) return;

        Engine.chatController.getChatInputWrapper().sendMessageGhostMessageProcedure(text, ChatData.CHANNEL.CLAN);
    };

    this.clickWorld = function() {
        if (!Engine.worldWindow.opened) Engine.worldWindow.open(WW.MODULES.PLAYERS_ONLINE);
        else Engine.worldWindow.close()
    };

    this.clickLootFilter = function() {
        Engine.lootFilter.windowToggle();
    };

    this.clickQuests = function() {
        Engine.quests.managePanelVisible();
    };

    this.clickSociety = function() {
        if (!Engine.society) _g("friends&a=show");
        else Engine.society.close();
    };

    this.clickSkills = function() {
        if (!Engine.skills) _g('skillshop');
        else Engine.skills.close();
    };

    this.clickPremium = function() {
        self.turnOnPremium();
    };

    this.clickPad = function() {
        if (!Engine.padController) return;
        Engine.padController.toggleVisible();
    };

    this.turnOnChest = function() {
        if (Engine.shop) Engine.shop.close();
        var chestId = isPl() ? 436 : '';
        var promoId = 190;

        if (Engine.premium) return Engine.premium.close();

        if (Engine.chests) Engine.chests.close();
        else _g('creditshop&npc=' + chestId);

    };

    this.turnOnPremium = function() {
        //GameAnalytics("addDesignEvent", "Premium:ClickPremium", 1);
        if (!Engine.premium) {
            Engine.premium = new Premium();
            Engine.premium.init();
        } else Engine.premium.close();
    };

    this.clickRewardsCalendar = function() {
        if (Engine.rewardsCalendar) Engine.rewardsCalendar.close();
        else _g('rewards_calendar&action=show');
    };

    this.clickMusic = function() {

    };

    this.clickConsole = function() {

        Engine.console.toggle();
    };

    this.clickFullScreen = function() {
        if (isMobileApp()) {
            window.location.href = 'https://www.margonem.pl/mobile-client-refresh';
            return
        }
        toggleFullScreen();
    };

    this.clickRefresh = function() {
        if (isMobileApp()) {
            window.location.href = 'https://www.margonem.pl/mobile-client-refresh';
        } else {
            pageReload();
        }
    };

    this.clickWhoIsHere = function() {
        Engine.whoIsHere.managePanelVisible()
    };

    this.clickPuzzle = function() {
        Engine.addonsPanel.manageVisible();
    };

    this.clickCrafting = function() {
        if (!Engine.crafting.isOpen()) Engine.crafting.triggerOpen();
        else Engine.crafting.triggerClose();
    };

    this.clickDragGroundItem = function() {
        const {
            x,
            y
        } = Engine.hero.d;

        // for items
        const items = Engine.map.groundItems.getGroundItemOnPosition(x, y);
        if (items.length > 0) {
            _g("takeitem&id=" + items[0].id);
        }

        // for renewable npc
        const renewableNpc = Engine.npcs.getRenewableNpcByPosition(x, y);
        if (renewableNpc) {
            Engine.hero.sendRequestToTalk(renewableNpc.d.id)
        }
    };

    this.clickQuickPaty = function() {
        Engine.hero.addToPartyNearPlayer();
    };

    this.clickAttackNearMob = function() {
        Engine.hero.atackNearMob();
    };

    this.clickAttackNearPlayer = function() {
        Engine.hero.atackNearPlayer();
    };

    this.clickTalkNearMob = function() {
        if (Engine.dialogue) return;
        Engine.hero.talkNearMob();
    };

    this.clickShowLog = function() {
        if (!Engine.battle.getfirstLogsExist()) return mAlert(_t('noLogs', null, 'battle'));
        Engine.battle.toogleBattleLogs();
    };

    this.clickPortableMap = function() {
        Engine.miniMapController.toggleMiniMapWindow()
    };

    this.checkEqColumnIsShow = () => {
        return $rightColumn.css('display') == 'block';
    };

    this.clickEqColumnShow = function() {
        let isShow = self.checkEqColumnIsShow();

        if (isShow) {
            self.showEqColumn(false);
            Storage.set('eqcolumnsize', 0);
        } else {
            self.showEqColumn(true);
            Storage.set('eqcolumnsize', 1);
        }
        Engine.onResize();
    };

    this.centerObjectCoverEqColumn = (centerObjectWidth) => {
        let eqColumnIsShow = Engine.interface.checkEqColumnIsShow();
        if (!eqColumnIsShow) return false;
        else {
            let $rightColumn = Engine.interface.get$rightColumn();
            let eqColumnWidth = $rightColumn.outerWidth();
            let $interfaceLayer = Engine.interface.get$interfaceLayer().width();

            if ($interfaceLayer > eqColumnWidth * 2 + centerObjectWidth) return false;
            else return true
        }
    }

    this.getXPosOfObjectStickToEqColumn = (stickToEqColumnObjectWidth) => {
        let $interfaceLayerWidth = this.get$interfaceLayer().width();
        let eqColumnWidth = $rightColumn.outerWidth();

        let x = $interfaceLayerWidth - eqColumnWidth - stickToEqColumnObjectWidth + (window.innerWidth - $interfaceLayerWidth) / 2;

        return x < 0 ? 0 : x;
    }

    this.showEqColumn = (show) => {
        let a = ["eq-column-size-0", "eq-column-size-1"];

        $gameWindowPositioner.removeClass(a);
        $gameWindowPositioner.addClass(show ? a[1] : a[0]);

        this.setEqWidgetAmountShow(show);

        Engine.widgetManager.manageClassOfWidget(Engine.widgetsData.name.EQ_TOGGLE, show);
        Engine.onResize();
    };

    this.checkEqColumnShow = () => {
        var $rC = this.get$interfaceLayer().find('.right-column.main-column');
        return $rC.css('display') === 'block';
    };

    this.setSizeEqColumnSize = function() {
        var s = this.getEqColumnsSizeFromStorage();
        if (s === null) {
            //Storage.set('chatSize', 1);  // this is bug (chatSize always equal 1 after page refresh)
            self.showEqColumn(true);
        } else {
            if (s == 0) self.showEqColumn(false);
            else self.showEqColumn(true);
        }
    };

    this.getEqColumnsSizeFromStorage = () => {
        return Storage.get('eqcolumnsize');
    };

    this.setEqWidgetAmountShow = function(show) {
        if (show) {
            //Engine.widgetManager.widgets.isActive('widget-eq-show-icon', true);
            Engine.widgetManager.widgets.isActive(Engine.widgetsData.name.EQ_TOGGLE, true);
        } else {
            //Engine.widgetManager.widgets.isActive('widget-eq-show-icon', false);
            Engine.widgetManager.widgets.isActive(Engine.widgetsData.name.EQ_TOGGLE, false);
        }
    };

    const getStateOfLightInterfaceFromStorage = () => {
        return Storage.easyGet(StorageData.LIGHT_INTERFACE);
    };

    const setStateOfLightInterfaceInStorage = (state) => {
        return Storage.easySet(state, StorageData.LIGHT_INTERFACE);
    };

    const setLighModeByDataInStorage = () => {
        let state = getStateOfLightInterfaceFromStorage();

        if (state == null) {
            this.setInterfaceLightMode(true);
            return
        }

        if (state) {
            this.setInterfaceLightMode(true);
        } else {
            this.setInterfaceLightMode(false);
        }

    }

    this.clickAutofightNearMob = function() {
        Engine.hero.atackNearMob(true);
    };

    this.clickGoGateway = function() {
        var h = Engine.hero;
        if (Engine.map.gateways.getOpenGtwAtPosition(Math.round(h.rx), Math.round(h.ry))) Engine.hero.getTroughGateway();
    };

    this.decreaseZoom = function() {
        self.setZoomFactor(Engine.zoomFactor - 0.1);
        Engine.onResize();
        //console.log(Engine.zoomFactor)
    };

    this.clickDecreaseZoom = function() {
        if (self.tooMoreZoomOut()) return mAlert(_t('cannot_Decrease'), false, function(wnd) {
            wnd.$.addClass('huge-alert');
            wnd.$.find('.small').removeClass('small');
        });
        self.decreaseZoom()
    };

    const getShowRightColumnWidth = () => {
        if (this.checkEqColumnIsShow()) {
            return Engine.interface.get$rightColumn().outerWidth()
        } else {
            return SHOW_RIGHT_COLUMN_WIDTH
        }

    }

    const tooBigScreen = (newZoomFactor) => {



        const POS = Engine.widgetsData.pos;
        const widgetManager = getEngine().widgetManager;

        const $topLeftBar = widgetManager.getBar(POS.TOP_LEFT);
        const $topRightBar = widgetManager.getBar(POS.TOP_RIGHT);

        const $topLeftVisibilityColumn = widgetManager.getColumnVisibilityButton(POS.TOP_LEFT);
        const $topRightVisibilityColumn = widgetManager.getColumnVisibilityButton(POS.TOP_RIGHT);

        const $topLeftVisibilityWidgets = $topLeftBar.find('.widget-bar-visible-btn');
        const $topRightVisibilityWidgets = $topRightBar.find('.widget-bar-visible-btn');

        const topLeftSize = widgetManager.getMaxBarSize(POS.TOP_LEFT);
        const topRightSize = widgetManager.getMaxBarSize(POS.TOP_RIGHT);

        const bottomLeftSize = widgetManager.getMaxBarSize(POS.BOTTOM_LEFT);
        const bottomRightSize = widgetManager.getMaxBarSize(POS.BOTTOM_RIGHT);

        const bottomLeftAdditionalSize = widgetManager.getMaxBarSize(POS.BOTTOM_LEFT_ADDITIONAL);
        const bottomRightAdditionalSize = widgetManager.getMaxBarSize(POS.BOTTOM_RIGHT_ADDITIONAL);


        if (!isMobileApp()) {

            if (window.innerWidth < getShowRightColumnWidth() * newZoomFactor * 2) {
                return true
            }


            return false
        }


        let wTopBars = 0;

        wTopBars += topLeftSize.width * newZoomFactor;
        wTopBars += topRightSize.width * newZoomFactor;

        if (isMobileApp()) {

            wTopBars += $topLeftVisibilityColumn.width() * newZoomFactor;
            wTopBars += $topRightVisibilityColumn.width() * newZoomFactor;

        }

        if ($topLeftVisibilityWidgets.length) wTopBars += $topLeftVisibilityWidgets.width() * newZoomFactor;
        if ($topRightVisibilityWidgets.length) wTopBars += $topRightVisibilityWidgets.width() * newZoomFactor;


        //if (!isMobileApp()) {
        //	wTopBars 		+= $topPositioner.find('.hud-container').width() / 2 * newZoomFactor
        //}

        //wTopBars 		+= $topLeftVisibilityWidgets.width() * newZoomFactor;
        //wTopBars 		+= $topRightVisibilityWidgets.width() * newZoomFactor;

        if (isMobileApp()) {

            wTopBars += getShowRightColumnWidth() * newZoomFactor;

        }

        if (window.innerWidth < wTopBars) {
            return true
        }

        //if (!isMobileApp()) {
        //	let leftWBottomBars 		= Math.max(bottomLeftSize.width * newZoomFactor,  bottomLeftAdditionalSize.width * newZoomFactor);
        //	let rightWBottomBars 		= Math.max(bottomRightSize.width * newZoomFactor, bottomRightAdditionalSize.width * newZoomFactor);
        //
        //
        //	let $bottomPanelOfBottomPositioner = $bottomPositioner.find('.bottom-panel-of-bottom-positioner');
        //
        //	let bottowPanelOfBotomPositionerW = $bottomPanelOfBottomPositioner.width() * newZoomFactor;
        //
        //	if (window.innerWidth < leftWBottomBars + bottowPanelOfBotomPositionerW / 2 + rightWBottomBars) {
        //		return true
        //	}
        //}


        let leftHBottomBars = Math.max(bottomLeftSize.height * newZoomFactor, bottomLeftAdditionalSize.height * newZoomFactor);
        let rightHBottomBars = Math.max(bottomRightSize.height * newZoomFactor, bottomRightAdditionalSize.height * newZoomFactor);


        let maxHeightOfBottomBars = Math.max(leftHBottomBars, rightHBottomBars);
        let maxHeightOfTopBars = ResolutionData.WIDGET_BAR_COLUMN_VISIBILITY_TOGGLE_SIZE * newZoomFactor;
        let h = maxHeightOfBottomBars + maxHeightOfTopBars;


        if (window.innerHeight < h) {
            return true
        }
        /*
        		let top = $inventory.position().top + $inventory.height()  * newZoomFactor;

        		if (window.innerHeight < top) {
        			return true
        		}
        */
        return false
    };

    this.clickIncreaseZoom = function() {
        self.setZoomFactor(Engine.zoomFactor + 0.1);
        Engine.onResize();

        var result = tooBigScreen(Engine.zoomFactor);
        if (result) {
            mAlert(_t('CAN_NOT_ZOOM_IN_MORE'));
            self.clickDecreaseZoom();
        }

    };

    this.getTheMostIndex = function() {

    };

    //this.clickToggleRightColumn = () => {
    //	var $rC = this.get$interfaceLayer().find.find('.right-column.main-column');
    //	if ($rC.css('display') == 'block') {
    //		$rC.css('display', 'none');
    //		$gameLayer.css('right', 0);
    //		$('.right-column-notif').css('right', 0);
    //	} else {
    //		$rC.css('display', 'block');
    //		$gameLayer.css('right', '245px');
    //		this.get$interfaceLayer().find('.right-column-notif').css('right', 255);
    //	}
    //	Engine.onResize();
    //};

    this.isAlwaysExist = function(key) {
        var alwaysExist = isset(defaultWidgetSet[key]['alwaysExist']) && defaultWidgetSet[key]['alwaysExist'];
        if (alwaysExist) {
            mAlert('Can not override this slot');
            return false;
        }
        return true;
    };

    this.tLang = function(name) {
        return _t(name, null, 'widgets-tip');
    };

    this.hideNotUseBars = function() {

        var store = Engine.serverStorage.get(Engine.widgetManager.getPathToHotWidgetVersion());
        Engine.widgetManager.hideAdditionalWidgetBars();

        if (!store) {
            const p = Engine.widgetsData.pos;
            const widgetManager = Engine.widgetManager
            const additionalLeft = p.BOTTOM_LEFT_ADDITIONAL;
            const additionalRight = p.BOTTOM_RIGHT_ADDITIONAL;

            if (widgetManager.checkWidgetInAdditionalBarInDefaultWidgetSet(additionalLeft)) {
                Engine.widgetManager.manageDisplayAdditionaWidgetBarsPerPos(additionalLeft);
            }

            if (widgetManager.checkWidgetInAdditionalBarInDefaultWidgetSet(additionalRight)) {
                Engine.widgetManager.manageDisplayAdditionaWidgetBarsPerPos(additionalRight);
            }

            return
        }

        for (var k in store) {
            Engine.widgetManager.manageDisplayAdditionaWidgetBarsPerPos(store[k][1]);
        }
    };

    this.sendGA = (category, eventType, label) => {
        if (Engine.worldConfig.getWorldName() === 'dev') return;
        Engine.GA.send(category, eventType, label);
    };

    //this.showEmptySlots = function (show) {
    //	$('.main-buttons-container').find('.empty-slot-widget').css('display', show ? 'block' : 'none');
    //	//$('.bottom-left-additional.main-buttons-container, .bottom-right-additional.main-buttons-container').css('display', show ? 'block' : 'none');
    //};

    this.addStaticButtons = function() {
        var btn1 = Templates.get('button');
        btn1.addClass('small green stats-expand');

        btn1.click(this.clickMoreBtn);
        self.get$interfaceLayer().find('.stats-wrapper').find('.stats-button').append(btn1);
        getMoreBtnText(null, btn1, btn1.find('.label'));

        var btn2 = Templates.get('button');
        btn2.addClass('small green stats-expand');

        btn2.click(this.clickMoreBtn);
        self.get$interfaceLayer().find('.stats-light-mode').find('.stats-button').append(btn2);
        getMoreBtnText(null, btn2, btn2.find('.label'));

        if (isset(Engine.hero.previewAcc) && isEn()) {
            appendRegisterButton();
        }
        if (isPl()) {
            appendOncButton();
        }
        self.initPvpButton();

        /*
        if (Engine.hero.d.lvl > 24) {
        	var str = _t('skillset_chng', null, 'buttons');
        	var cl = 'skill-switch skill-set-' + Engine.hero.cur_skill_set;
        	var $switch = $('.skill-switch');
        	$switch.attr('class', cl);
        	$switch.click(Engine.hero.changeSkillSet);
        	$switch.tip(str, 't_static');
        }
        */
    };

    this.registrationCall = function() {
        _g('registernoob');
    };

    this.initPvpButton = function() {
        var $pvp = $('.pvp-btn');
        if (Engine.hero.d.pvp == 1) {
            $pvp.addClass('fight');
        }


        $pvp.bind(getClickEventName(), function() {
            $(this).removeClass('fight');
            Engine.hero.d.pvp = Engine.hero.d.pvp ? 0 : 1;
            if (Engine.hero.d.pvp) {
                $(this).addClass('fight');
            }
            _g("setpvp&mode=" + Engine.hero.d.pvp);
        });

    };

    this.clickMoreBtn = function() {
        let $interfaceLayer = self.get$interfaceLayer()
        let $btn1 = $interfaceLayer.find('.stats-wrapper').find('.stats-button').find('.stats-expand');
        let $btn2 = $interfaceLayer.find('.stats-light-mode').find('.stats-button').find('.stats-expand');

        $btn1.toggleClass('active');
        $btn2.toggleClass('active');
        self.get$interfaceLayer().find('.extended-stats').toggleClass('active').trigger('update');

        let $label1 = $btn1.find('.label');
        getMoreBtnText(null, $btn1, $label1);

        let $label2 = $btn2.find('.label');
        getMoreBtnText(null, $btn2, $label2);

        if (getEngine().interface.getInterfaceLightMode()) {
            //let $rightTop = $('.top-right.main-buttons-container');
            //let $rightBottom = $('.bottom-right.main-buttons-container');
            //let $rightBottomAdditional = $('.bottom-right-additional.main-buttons-container');
            //let $topRightVisibilityToggle = $('.top-right-column-visibility-toggle');
            //
            //if (self.isStatsExpanded()) {
            //	$rightTop.css('display', 'none');
            //	$rightBottom.css('display', 'none');
            //	$rightBottomAdditional.css('display', 'none');
            //	$topRightVisibilityToggle.css('visibility', 'hidden');
            //} else {
            //	$rightTop.css('display', 'block');
            //	$rightBottom.css('display', 'block');
            //	$rightBottomAdditional.css('display', 'block');
            //	$topRightVisibilityToggle.css('visibility', 'inherit');
            //}

            const POS = Engine.widgetsData.pos;
            const widgetManger = getEngine().widgetManager;
            const a = [
                POS.TOP_RIGHT,
                POS.BOTTOM_RIGHT_ADDITIONAL,
                POS.BOTTOM_RIGHT
            ];
            const expanded = self.isStatsExpanded();

            widgetManger.setVisibilityWidgetsByBars(a, !expanded);
        }


    };

    const getMoreBtnText = function(value, $btn, $label) {
        //var $btn = self.get$interfaceLayer().find('.stats-wrapper').find('.stats-button').find('.stats-expand');
        //var str = !$btn.hasClass('active') ?  _t('btn_stats_default') : _t('btn_stats_active');
        let str = null;

        if (interfaceLightMode) {
            str = _t('stats-expand', null, "widgets-tip")
        } else {
            str = !$btn.hasClass('active') ? _t('btn_stats_default') : _t('btn_stats_active');
        }

        $label.html(str);
        Engine.hotKeys.replaceshowhideStatsBtnsNames();
    };

    this.isStatsExpanded = () => this.get$interfaceLayer().find('.extended-stats').hasClass('active');

    this.shopButtons = function() {
        self.get$interfaceLayer().find('.gold-btn').click(function() {
            if (!Engine.goldShop) _g('creditshop&credits_gold=-1');
            else Engine.goldShop.close();
        }).tip(_t('gold_shop_head_info'));
        self.get$interfaceLayer().find('.credits-btn').click(function() {
            if (!Engine.draconiteShop) {
                Engine.draconiteShop = new DraconiteShop();
                Engine.draconiteShop.open();
            } else Engine.draconiteShop.close();
        }).tip(_t('buy_sl'));
    };

    this.setStatsOverAdditionalBarPanel = function() {
        var $statsPanel = self.get$interfaceLayer().find('.extended-stats');
        $statsPanel.trigger('update');
    };

    this.setAdditionalBarClass = function(state) {
        state ? $gameWindowPositioner.addClass('additional-bar-br') : $gameWindowPositioner.removeClass('additional-bar-br');
    };

    this.pvpIcon = ($element) => {
        //this.get$interfaceLayer().find('.map_ball').on('click', function() {
        $element.on('click', function() {
            if (Engine.worldConfig.getPvp()) {
                _g('conquer');
            } else {
                if (Engine.worldConfig.getWantedShow()) {
                    let wC = Engine.wantedController;
                    if (wC) {
                        wC.getWantedList().toggleVisible();
                    } else {
                        _g('wanted&show=1', function() {
                            Engine.wantedController.getWantedList().toggleVisible();
                        });
                    }
                }
            }
        });
    };

    this.worldName = function() {
        let $worldName = self.get$interfaceLayer().find('.world-name');

        $worldName.html(capitalize(Engine.worldConfig.getWorldName()));
        $worldName.tip(_t('world_name') + ': ' + capitalize(Engine.worldConfig.getWorldName())); // capitalize each words
    };

    this.checkTeleport = (v) => {
        if (isset(v.t) && v.t == 'reload') { // teleport
            Engine.map.showLoaderSplash();
        }
    };

    this.setInterfaceSize = () => {
        $(".tmp-chat .middle").height($(window).height() - 493);

    };

    this.get$MAP_CANVAS = () => {
        return $MAP_CANVAS; //$_canvas;
    };

    this.get$GAME_CANVAS = () => {
        return $GAME_CANVAS; //$_canvas;
    };

    this.get$gameWindowPositioner = () => {
        return $gameWindowPositioner;
    };

    this.get$gameLayer = () => {
        return $gameLayer
    };

    this.get$interfaceLayer = () => {
        return layers[LayersData.$_INTERFACE_LAYER];
    };

    this.get$alertsLayer = () => {
        return layers[LayersData.$_ALERTS_LAYER];
    };

    this.get$mAlertLayer = () => {
        return layers[LayersData.$_M_ALERT_LAYER];
    };

    this.get$captchaLayer = () => {
        return layers[LayersData.$_CAPTCHA_LAYER];
    };

    this.get$popUpLayer = () => {
        return layers[LayersData.$_POP_UP_LAYER];
    };

    this.get$consoleLayer = () => {
        return layers[LayersData.$_CONSOLE_LAYER];
    };

    this.get$mAlertMobileLayer = () => {
        return layers[LayersData.$_M_ALERT_MOBILE_LAYER];
    };

    this.get$loaderLayer = () => {
        return layers[LayersData.$_LOADER_LAYER];
    };

    this.get$tutorialLayer = () => {
        return layers[LayersData.$_TUTORIAL_LAYER];
    };

    this.get$stickyTipsLayer = () => {
        return layers[LayersData.$_STICKY_TIPS_LAYER];
    };

    this.get$echhLayer = () => {
        return layers[LayersData.$_ECHH_LAYER];
    };

    this.get$dropToDeleteWidgetLayer = () => {
        return layers[LayersData.$_DROP_TO_DELETE_WIDGET_LAYER];
    };

    this.get$zoomLayer = () => {
        return layers[LayersData.$_ZOOM_LAYER];
    };

    const appendRegisterButton = () => {
        const registerBtn1 = Templates.get('widget-button');
        registerBtn1.addClass('red blink');
        registerBtn1.find('.icon').addClass('register-icon');
        registerBtn1.tip(_t('bm_register', null, 'ingame_register'), 't_static');
        registerBtn1.find('.label').text(_t('reg_header', null, 'ingame_register'));

        const registerBtn2 = registerBtn1.clone();

        registerBtn1.appendTo(self.get$interfaceLayer().find('.bm-register'));
        registerBtn2.appendTo(self.get$interfaceLayer().find('.bm-register-light-mode'));

        registerBtn1.click(function() {
            self.registrationCall();
        });
        registerBtn2.click(function() {
            self.registrationCall();
        });
    }

    const appendOncButton = () => {
        if (isSeptemberEnd()) return;
        const registerBtn = Templates.get('widget-button');
        registerBtn.addClass('violet');
        registerBtn.find('.icon').addClass('onc-icon');
        registerBtn.tip('One Night Casino', 't_static');
        registerBtn.appendTo(self.get$interfaceLayer().find('.onc-btn'));
        registerBtn.click(function() {
            Engine.iframeWindowManager.integrationPage();
        });
    }

    const setCursor = (show, cursorClass) => {
        const $GC = Engine.interface.get$GAME_CANVAS();

        if (show) $GC.addClass(cursorClass);
        else $GC.removeClass(cursorClass)
    };

    const setDoActionCursor = (show) => {
        setCursor(show, ColliderData.CURSOR.DO_ACTION);
    };

    const setDialogueCursor = (show) => {
        setCursor(show, ColliderData.CURSOR.DIALOGUE);
    };

    const setPickUpCursor = (show) => {
        setCursor(show, ColliderData.CURSOR.PICK_UP);
    };

    const addCallbackToInteraceFocusList = (clb) => {
        interfaceFocusList.push(clb);
    }

    const addCallbackToInterfaceBlurList = (clb) => {
        interfaceBlurList.push(clb);
    }

    const initInterfaceFocus = () => {
        window.addEventListener("focus", function(e) {
            for (let k in interfaceFocusList) {
                interfaceFocusList[k](e);
            }
        });
    };

    const initInterfaceBlur = () => {
        window.addEventListener("blur", function(e) {
            for (let k in interfaceBlurList) {
                interfaceBlurList[k](e);
            }
        });
    };

    const setInterfaceLightMode = (state) => {
        interfaceLightMode = state;
        if (state) {
            $gameWindowPositioner.addClass('light-interface');
            $gameWindowPositioner.removeClass('classic-interface');
        } else {
            $gameWindowPositioner.removeClass('light-interface');
            $gameWindowPositioner.addClass('classic-interface');
        }
    };

    const toggleInterfaceLightMode = () => {

        if (Engine.battle.isBattleShow()) {
            return;
        }

        this.setInterfaceLightMode(!interfaceLightMode);


        if (mobileCheck()) {
            setStateOfLightInterfaceInStorage(interfaceLightMode)
            Engine.widgetManager.initMobileWidgetsByLightMode()
        }

        Engine.widgetManager.rebuildWidgetButtons();
        Engine.onResize()
    }

    const checkInterfaceLightMode = () => {
        return $gameWindowPositioner.hasClass('light-interface');
    }

    const getInterfaceLightMode = () => {
        return interfaceLightMode
    }

    const updateTopOfRightColumn = () => {
        let $rightMainColumnWrapper = getRightMainColumnWrapper();
        let top = null;

        if (getInterfaceLightMode()) {
            top = getEngine().widgetManager.getPossibleTopValOfLeftOrRightColumn(Engine.widgetsData.pos.TOP_RIGHT);
        } else {
            top = 0;
        }

        $rightMainColumnWrapper.css('top', top);
    }

    this.getInterfaceStart = getInterfaceStart;
    this.setCursor = setCursor;
    this.setDoActionCursor = setDoActionCursor;
    this.setDialogueCursor = setDialogueCursor;
    this.setPickUpCursor = setPickUpCursor;
    this.addCallbackToInteraceFocusList = addCallbackToInteraceFocusList;
    this.get$location = get$location;
    this.get$locationLightMode = get$locationLightMode;
    this.get$locationId = get$locationId;
    this.get$buildsInterface = get$buildsInterface;
    this.get$bigMessagesLightMode = get$bigMessagesLightMode;
    this.show$mapTimer = show$mapTimer;
    this.setTip$mapTimer = setTip$mapTimer;
    this.addClassTo$mapTimer = addClassTo$mapTimer;
    this.removeClassFrom$mapTimer = removeClassFrom$mapTimer;
    this.setInterfaceLightMode = setInterfaceLightMode;
    this.checkInterfaceLightMode = checkInterfaceLightMode;
    this.updateCredits = updateCredits;
    this.updateGold = updateGold;
    this.getGoldCostComponent = getGoldCostComponent;
    this.getInterfaceLightMode = getInterfaceLightMode;
    this.updateTopOfRightColumn = updateTopOfRightColumn;
    this.getRightMainColumnWrapper = getRightMainColumnWrapper;
    this.get$mapBallLightMode = get$mapBallLightMode;
    this.get$mapBall = get$mapBall;
    this.getZoomFactorFromStorage = getZoomFactorFromStorage;
    this.toggleInterfaceLightMode = toggleInterfaceLightMode;
    this.removePopupMenu = removePopupMenu;
    this.setLighModeByDataInStorage = setLighModeByDataInStorage;
    this.getStateOfLightInterfaceFromStorage = getStateOfLightInterfaceFromStorage;

};