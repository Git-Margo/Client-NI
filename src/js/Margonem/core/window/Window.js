/**
 * Created by lukasz on 2014-09-25.
 */
//var tpl = require('@core/Templates');
//var Store = require('@core/Storage');
var tpl = require('@core/Templates');
var TutorialData = require('@core/tutorial/TutorialData');
//var Store = require('@core/Storage');
let LayersData = require('@core/interface/LayersData');
let StorageFuncWindow = require('@core/window/StorageFuncWindow');
//var RajData = require('@core/raj/RajData');

let WindowManageOpacity = require('@core/window/WindowManageOpacity');
let WindowManageSize = require('@core/window/WindowManageSize');
let RajWindowEventsData = require('@core/raj/rajWindowEvents/RajWindowEventsData');
let SearchComponent = require('@core/components/SearchComponent');
const {
    isMobileApp
} = require('@core/HelpersTS');

module.exports = function(options) {
    let moduleData = {
        fileName: "Window.js"
    };
    var self = this;
    var dialogWnd = null;
    var parentWnd = null;
    let attachLayerName = null;
    let attachWidgetName = null;
    let content = null;
    let collapsed = false;
    let searchComponent = null;
    const topBoundOffset = mobileCheck() ? 30 : 0;

    const SEARCH_HIDE_CL = "search-hide";

    let $buttonsMenu;

    let windowManageOpacity;
    let windowManageSize;

    this.$backdrop = null;

    this.getWindowTpl = () => {
        return tpl.get('border-window');
    };

    this.initTplAndDraggable = () => {
        this.$ = this.getWindowTpl();



        let draggableData = {
            handle: '.header-label-positioner',
            scroll: false,
            drag: function(evt, ui) {
                if (mobileCheck()) {
                    updateMobileDrag(ui);
                }
            },
            start: function() {
                self.setWndOnPeak();
            },
            stop: function(e) {
                self.stopDrag(e);
            }
        };


        if (!mobileCheck()) {
            draggableData.containment = 'body';
        }

        this.$.draggable(draggableData).css('position', 'absolute');

        options = $.extend({
            onclose: function() {
                self.fadeAndRemove();
            },
            onstopdrag: function(e) {},
            onopen: function() {},
            backdrop: false,
            closeable: true
        }, options);
    };

    this.init = () => {
        this.initTplAndDraggable();
        this.initOptions();
        this.initClose();
    };

    const getZoom = () => {
        return typeof(Engine) != "undefined" && Engine.zoomFactor != null ? Engine.zoomFactor : 1;
    };

    const updateMobileDrag = (ui) => {
        let $e = ui.helper;
        let $body = $('body');

        let outerWidth = $e.outerWidth();
        let outerHeight = $e.outerHeight();

        let bodyWidth = $body.width();
        let bodyHeight = $body.height();

        let left = Math.round(ui.position.left);
        let top = Math.round(ui.position.top);

        let newPosition = mobileBoundsFix(outerWidth, outerHeight, bodyWidth, bodyHeight, left, top);

        ui.position.left = newPosition.left;
        ui.position.top = newPosition.top;
    };

    const mobileBoundsFix = (targetWidth, targetHeight, bodyWidth, bodyHeight, left, top) => {

        const topBoundOffsetOnMobile = 30;

        if (left < 0) {
            left = 0;
        }

        if (top < topBoundOffsetOnMobile) top = topBoundOffsetOnMobile;
        if (top + targetHeight > bodyHeight) top = bodyHeight - targetHeight;
        if (left + targetWidth > bodyWidth) left = bodyWidth - targetWidth;

        return {
            left: left,
            top: top
        };
    }

    this.getAttachWidgetName = () => {
        return attachWidgetName;
    };

    this.setAttachWidgetName = (nameWidget) => {
        attachWidgetName = nameWidget;
    };

    this.addNameToWindow = (name) => {
        this._nameWindow = name;
    };

    this.addControll = function(label, type, callback) {
        this.$.find('.window-controlls').show();
        var btn = tpl.get('button');
        this.$.find('.window-controlls').append(btn);
        if (type) btn.addClass(type);
        self.addCallback(callback, btn);
        btn.find('.label').html(label);

        return btn;
    };

    this.correctPositionMenuToRightEdgeOfWnd = () => {
        let niInterface = getEngine().interface;
        let $popUpMenu = niInterface.getPopupMenu();

        if ($popUpMenu == null) return;

        let position = this.$.position()
        let left = position.left;
        let top = position.top;

        let wWnd = this.$.outerWidth();
        let hWnd = this.$.outerHeight();
        let wPopUpMenu = $popUpMenu.outerWidth();
        let hPopUpMenu = $popUpMenu.outerHeight();
        let zoomFactor = Engine.zoomFactor;

        left = left / zoomFactor + wWnd + wPopUpMenu / 2;
        top = top / zoomFactor + hWnd / 2;

        let p = niInterface.calcPopupMenuPos(left, top, wPopUpMenu, hPopUpMenu, false);

        $popUpMenu.css({
            left: p.left,
            top: p.top
        })

        //let $popUpMenu = getEngine().interface.getPopupMenu();

        $popUpMenu.css('transition', 'none');
    };


    this.setStartVH = function(VH) {
        if (!mobileCheck()) return;
        this.startVH = VH;
    };

    this.setCssVH = function() {
        if (!mobileCheck()) return;

        return

        var name = self.$.find('.inner-content>div').attr('class');
        var selector = '.mobile-version>.game-window-positioner>.alerts-layer>.border-window>.content>.inner-content>.';
        var style = "<style>";

        for (var i = 10; i > 3; i--) {
            var zoomSelector = '.zoom-factor-' + (i * 10);
            var additionalVH = (100 - i * 10) * 1.5;
            var newVH = self.startVH + additionalVH;
            style += zoomSelector + selector + name;
            style += "{";
            style += "height: " + newVH + "vh;";
            style += "}";
        }
        style += "</style>";
        $(style).appendTo("head");
    };

    this.addCallback = function(callback, $btn) {
        if (!callback) return;
        callback.bind(self);
        $btn.click(function() {
            // $(this).unbind('click');
            callback();
        });
    };

    this.initZIndex = function() {
        self.$.on('click', function(e) {
            if (e.target.classList.contains('label') || e.target.closest('.not-peak') !== null) return; //prevent for click button/link
            self.setWndOnPeak();
        });
        self.$.one("append", function() {
            self.setWndOnPeak();
            if (options.backdrop) {
                self.addBackdrop(options.backdrop);
            }

        });
        self.$.on("destroyed", function() {
            self.removeBackdrop();
        })
    };

    this.checkWndOnPeak = () => {
        return self.$.hasClass('window-on-peak');
    }

    this.setWndOnPeak = function(force = false) {
        var cl = 'window-on-peak';
        if (self.$.hasClass(cl) && !force) return;

        self.$.siblings('.border-window').removeClass(cl);

        self.$.css('z-index', Engine.windowMaxZIndex++);

        self.$.addClass(cl);
    };

    this.removeWndOnPeak = () => {
        var cl = 'window-on-peak';
        if (self.$.hasClass(cl)) self.$.removeClass(cl);
    }

    this.setAsParent = function(a) {
        if (a.constructor !== module.exports) return;
        parentWnd = a;
    };

    this.removeParent = function() {
        parentWnd = null;
    };

    this.setWindowAsDialog = function(a) {
        if (a.constructor !== module.exports) return;
        a.parentWnd = self;
        dialogWnd = a;
        self.$.addClass("disable");
    };

    this.removeDialog = function() {
        dialogWnd = null;
        self.$.removeClass("disable");
    };

    this.initClose = () => {
        this.$.find('.close-button').on(getClickEventName(), function() {
            options.onclose.call(self);
            $(this).tipHide();
        });
    };

    this.changeDraggableContainment = function(target) {
        this.$.draggable({
            containment: target
        });
    };

    this.fadeAndRemove = function() {
        if (options.backdrop) {
            this.removeBackdrop();
        }

        this.$.remove();
    };

    this.title = function(title) {
        this.$.find('.header-label .text').html(title).attr('name', title);
    };

    this.addClass = function(addClass) {
        this.$.addClass(addClass)
    };

    this.setTransparentWindow = () => {
        self.$.addClass('transparent');
        self.$.append($('<div>').addClass('border-image'));

        $buttonsMenu = $('<div>').addClass('transparent-window-buttons-menu');
        const $iconClose = $('<div>').addClass('ie-icon ie-icon-close');

        self.$.append($buttonsMenu);
        self.$.find('.close-button').html($iconClose);
    };

    //this.setManageOpacity = (val) => {
    //	let $but = $('<div>', {
    //		class: 'increase-opacity'
    //	});
    //	self.$.append($but);
    //	$but.tip(_t('window-opacity'));
    //	$but.click(this.increaseOpacity);
    //	this.setSaveOpacityWnd(val);
    //};

    this.setTipWindow = function() {
        self.$.addClass('tip-window');
    };

    //this.setOpacityOnBackground = (opacity) => {
    //	this.$.attr('data-opacity-lvl', opacity);
    //};

    this.setWndType = function(type) {
        switch (type) {
            case Engine.windowsData.type.TRANSPARENT:
                self.setTransparentWindow();
                break;
            case 'tip-window':
                self.setTipWindow();
                break;
            default:
                console.error('[Window.js, setWndType] bad wnd type: ' + type);
                break;
        }

    };

    this.label = function(label) {

        debugger;
        console.log('LABEL')

        if (label) {
            this.$.find('.decoration-label').show().find('.label').html(label);
        } else {
            this.$.find('.decoration-label').hide().find('.label').html("");
        }
    };

    //this.setSaveOpacityWnd = (defaultOpacity) => {
    //
    //	//let opacity = Store.get(this._nameWindow + '/opacity');
    //	let opacity = StorageFuncWindow.getOpacityWindow(this._nameWindow);
    //
    //	if (opacity == null) {
    //		opacity = defaultOpacity;
    //		this.saveOpacityInStorage(opacity);
    //	}
    //	this.setOpacityOnBackground(opacity);
    //};

    //this.saveOpacityInStorage = (opacity) => {
    //	//Store.set(this._nameWindow + '/opacity', opacity);
    //	StorageFuncWindow.setOpacityWindow(opacity, this._nameWindow);
    //};

    //this.getWindowOpacity = () => parseInt(this.$.attr('data-opacity-lvl'));

    //this.increaseOpacity = () => {
    //	let opacity = this.getWindowOpacity();
    //	opacity = opacity + 1;
    //	opacity = opacity > 5 ? 1 : opacity;
    //	this.setOpacityOnBackground(opacity);
    //	this.saveOpacityInStorage(opacity);
    //};

    this.stopDrag = function() {

        if (options.managePosition) {
            if (
                options.managePosition.x && options.managePosition.y ||
                options.managePosition.position == Engine.windowsData.position.CENTER_OR_SAVE_IN_STORAGE
            ) {
                self.saveWindowPosition();
            }
        }

    };

    this.updatePos = function() {
        let pos = this.getPos();
        this.setContentPos(pos.x + 'px', pos.y + 'px');
    };

    const updateSizeWindow = () => {
        if (!windowManageSize) {
            return
        }

        windowManageSize.updateSizeWindow();
    }

    this.getPos = () => {

        //let storagePos = Store.get(this._nameWindow + '/pos');
        let storagePos = StorageFuncWindow.getPositionWindow(this._nameWindow);

        if (storagePos) {

            let isCorrect = this.checkPosIsCorrect(storagePos.x, storagePos.y);
            if (isCorrect) return {
                x: storagePos.x,
                y: storagePos.y
            }

        }


        if (!options.managePosition) return this.getCenterPos();


        if ( // default pos
            options.managePosition &&
            isset(options.managePosition.x) &&
            isset(options.managePosition.y) &&
            options.managePosition.position != Engine.windowsData.position.RIGHT_POSITIONING
        ) {
            return {
                x: options.managePosition.x,
                y: options.managePosition.y
            }
        }


        switch (options.managePosition.position) {
            case Engine.windowsData.position.CENTER_OR_STICK_TO_EQ:
                return this.getCenterPosOrStickToEqColumnPos()
            case Engine.windowsData.position.CENTER:
                return this.getCenterPos();
            case Engine.windowsData.position.CENTER_OR_SAVE_IN_STORAGE:
                return this.getCenterPos();
            case Engine.windowsData.position.RIGHT_POSITIONING:
                return this.getRightPos();
            case Engine.windowsData.position.TOP_POSITIONING:
                return getTopPos();
            default:
                errorReport('Window.js', "getPos", 'NANANAA');
        }

        return null;
    }


    this.checkPassTheScreenBounds = () => {
        let headerHeight = 5;
        let height = this.$.height() + headerHeight;
        let top = this.$.position().top;
        let screenHeight = window.innerHeight;

        let width = this.$.width();
        let left = this.$.position().left;
        let screenWidth = window.innerWidth;

        return top + height > screenHeight || left + width > screenWidth;
    };

    //this.setWindowOnLeftTopCorner = () => {
    //	this.setContentPos('251px', '60px');
    //	this.saveWindowPosition();
    //};

    this.checkPosIsCorrect = (posX, posY) => {
        let zoomFactor = Engine.zoomFactor == null ? 1 : Engine.zoomFactor;
        //let $body			= $('body');
        //let screenW 		= $body.width();
        //let screenH 		= $body.height();
        let screenW = Math.round(window.innerWidth * (1 / zoomFactor));
        let screenH = Math.round(window.innerHeight * (1 / zoomFactor));
        let windowWidth = self.$.outerWidth();
        let windowHeight = self.$.outerHeight();

        const leftAndTopBound = posX >= 0 && posY >= topBoundOffset;
        const rightAntBottomBound = posX + windowWidth <= screenW && posY + windowHeight <= screenH;

        return leftAndTopBound && rightAntBottomBound;
    }

    this.setContentPos = function(left, top) {
        self.$.css({
            'left': left,
            'top': top
        });
    };

    this.saveWindowPosition = () => {
        var position = this.$.position();
        var pos = {
            x: position.left / Engine.zoomFactor,
            y: position.top / Engine.zoomFactor
        };
        //Store.set(this._nameWindow + '/pos', pos);
        StorageFuncWindow.setPositionWindow(pos, this._nameWindow);
    };

    this.getContent = () => {
        return content;
    }

    this.content = function(_content) {
        this.$.find('.inner-content').html(_content);
        var tip = '';
        if (options.type) {
            if (options.type == 'transparent') tip = _t('close');
        } else tip = _t('hotkey_close');
        this.$.find('.close-button-corner-decor').find('.close-button').tip(tip);
        this.initZIndex();
        content = _content;
    };

    this.getCenterPos = function() {

        return {
            x: self.getCenterPosXOfWidth(),
            y: self.getCenterPosYOfHeight()
        };
    };

    this.getStickToEqColumnPos = () => {
        return {
            x: Engine.interface.getXPosOfObjectStickToEqColumn(this.$.outerWidth()),
            y: this.getCenterPosYOfHeight()
        }
    }

    this.getCenterPosOrStickToEqColumnPos = () => {
        let windowWidth = this.$.outerWidth();
        let objectCoverEqColumn = Engine.interface.centerObjectCoverEqColumn(windowWidth);

        if (objectCoverEqColumn) return this.getStickToEqColumnPos();
        else return this.getCenterPos();

    };

    this.getRightPos = () => {
        return {
            x: $('body').width() - self.$.outerWidth() - options.managePosition.x,
            y: options.managePosition.y
        }
    };

    const getTopPos = () => {
        return {
            x: self.getCenterPosXOfWidth(),
            y: topBoundOffset
        }
    };

    this.getCenterPosXOfWidth = () => {
        //let w = $('body').width();
        let zoomFactor = Engine.zoomFactor == null ? 1 : Engine.zoomFactor;
        let w = Math.round(window.innerWidth * (1 / zoomFactor));
        let x = w / 2 - this.$.outerWidth() / 2;
        if (x < 0) x = 0;

        return x;
    }

    this.getCenterPosYOfHeight = () => {
        //let h = $('body').height();
        let zoomFactor = Engine.zoomFactor == null ? 1 : Engine.zoomFactor;
        let h = Math.round(window.innerHeight * (1 / zoomFactor));
        let y = h / 2 - this.$.outerHeight() / 2;
        if (y < 0) y = 0;

        return y;
    }

    this.center = function() {
        let centre = this.getCenterPos();
        this.$.css({
            left: centre.x,
            top: centre.y
        })
    };

    this.setYPos = function(y) {
        this.$.css({
            top: y
        })
    };

    this.setXPos = function(y) {
        this.$.css({
            left: y
        })
    };

    this.addBackdrop = ($parentLayer) => {
        this.$backdrop = $('<div/>', {
            class: 'window-backdrop'
        });

        $parentLayer.prepend(this.$backdrop);

        this.setBackdropZIndex();
    };

    this.setBackdropZIndex = () => {
        //if (options.backdrop) {
        if (this.$backdrop) {
            let zIndex = this.$.css('z-index');
            this.$backdrop.css('z-index', zIndex);
        }
    };

    this.removeBackdrop = () => {
        //if (options.backdrop && this.$backdrop) {
        if (this.$backdrop) {
            this.$backdrop.remove();
        }
    };

    this.remove = () => {
        if (attachWidgetName) Engine.widgetManager.manageClassOfWidget(attachWidgetName, false);
        Engine.windowManager.remove(this._nameWindow, this._idWindow);
    };

    const callCheckCanFinishExternalTutorialOpenWindow = () => {

        if (!Engine.tutorialManager) {
            //errorReport("Window.js", "callCheckCanFinishExternalTutorialOpenWindow", "Engine.tutorialManager not exist");
            return
        }

        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.OPEN_WINDOW,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            this._nameWindow
        );

        //Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
        Engine.rajController.parseObject(tutorialDataTrigger);
    };

    this.show = () => {
        this.$.css('display', 'block');
        if (isset(options.manageShow)) StorageFuncWindow.setShowWindow(true, this._nameWindow);
        if (attachWidgetName) Engine.widgetManager.manageClassOfWidget(attachWidgetName, true);

        callCheckCanFinishExternalTutorialOpenWindow();

        if (!Engine.tutorialManager) {
            //console.trace();
            //errorReport("Window.js", "show", "Engine.tutorialManager not exist");
            return
        }

        if (!Engine.rajWindowEvents) {
            //console.trace();
            //errorReport("Window.js", "show", "Engine.rajWindowEvents not exist");
            return
        }

        Engine.rajWindowEvents.callAllActionsBySpecificEventAndWindowName(RajWindowEventsData.ON_OPEN, this._nameWindow);
    };

    this.updateWindowTrigger = () => {
        if (!Engine.tutorialManager) {
            errorReport("Window.js", "updateWindowTrigger", "Engine.tutorialManager not exist");
            return
        }

        if (!Engine.rajWindowEvents) {
            errorReport("Window.js", "updateWindowTrigger", "Engine.rajWindowEvents not exist");
            return
        }

        Engine.rajWindowEvents.callAllActionsBySpecificEventAndWindowName(RajWindowEventsData.ON_UPDATE, this._nameWindow);
    };

    this.hide = () => {
        this.$.css('display', 'none');
        if (isset(options.manageShow)) StorageFuncWindow.setShowWindow(false, this._nameWindow);
        if (attachWidgetName) Engine.widgetManager.manageClassOfWidget(attachWidgetName, false);
    };

    this.isShow = () => {
        return this.$.css('display') != 'none';
    };

    this.toggle = () => {
        this.isShow() ? this.hide() : this.show();
    };

    this.setAttachLayerName = (layerName) => {
        if (layerName == null) {
            attachLayerName = null;
            return
        }

        if (!LayersData[layerName]) {
            console.error("[Window.js, setAttachLayerName] Layer name not exist:", layerName);
        }

        attachLayerName = layerName;
    }

    this.addToAlertLayer = () => {
        //$('.alerts-layer').append(this.$);
        Engine.interface.get$alertsLayer().append(this.$);
        // attachLayerName = '$alertsLayer';
        this.setAttachLayerName(LayersData.$_ALERTS_LAYER)
        Engine.windowManager.addToAttachLayer(this);
    };

    this.addToMAlertLayer = () => {
        //$('.alerts-layer').append(this.$);
        Engine.interface.get$mAlertLayer().append(this.$);
        // attachLayerName = '$mAlertLayer';
        this.setAttachLayerName(LayersData.$_M_ALERT_LAYER)
        Engine.windowManager.addToAttachLayer(this);
    };

    this.addToCaptchaLayer = () => {
        Engine.interface.get$captchaLayer().append(this.$);
        // attachLayerName = '$captchaLayer';
        this.setAttachLayerName(LayersData.$_CAPTCHA_LAYER);
        Engine.windowManager.addToAttachLayer(this);
    };

    this.addToTutorialLayer = () => {
        //$('.alerts-layer').append(this.$);
        Engine.interface.get$tutorialLayer().append(this.$);
        // attachLayerName = '$tutorialLayer';
        this.setAttachLayerName(LayersData.$_TUTORIAL_LAYER);
        Engine.windowManager.addToAttachLayer(this);
    };

    this.addToConsoleLayer = () => {
        //$('.alerts-layer').append(this.$);
        Engine.interface.get$consoleLayer().append(this.$);
        // attachLayerName = '$consoleLayer';
        this.setAttachLayerName(LayersData.$_CONSOLE_LAYER);
        Engine.windowManager.addToAttachLayer(this);
    };

    this.addToMobileAlertLayer = () => {
        Engine.interface.get$mAlertMobileLayer().append(this.$);
        this.setAttachLayerName(LayersData.$_M_ALERT_MOBILE_LAYER);
        Engine.windowManager.addToAttachLayer(this);
    };

    this.detachFromLayer = () => {
        this.hide();
        this.$.detach();
        Engine.windowManager.removeFromAttachLayer(this);
        this.setAttachLayerName(null);
    };

    this.getAttachLayerName = () => {
        return attachLayerName;
    };

    this.initOptions = () => {

        this.close = options.onclose;

        if (options.nameWindow) {
            this.addNameToWindow(options.nameWindow);
        } else return console.error('[Window.js, initOptions] manageOpacity require window name');

        if (options.title) this.title(options.title);
        if (options.label) this.label(options.label);
        if (options.addClass) this.addClass(options.addClass);
        if (options.content) this.content(options.content);
        if (options.startVH) this.setStartVH(options.startVH);
        if (options.cssVH) this.setCssVH(options.cssVH);
        if (options.type) this.setWndType(options.type);
        if (options.widget) this.setAttachWidgetName(options.widget);
        if (!options.closeable) this.$.addClass('no-exit-button');

        if (isset(options.draggable)) this.$.draggable((options.draggable ? 'enable' : 'disable'));

        if (isset(options.manageShow)) this.manageShow(options.manageShow);

        if (options.managePosition) { // value means default pos e.g {x: 123, y: 123}
            let p = options.managePosition;

            if (p.position) {
                if (!Engine.windowsData.position[p.position]) return errorReport("Window.js", "initOptions", "incorrect val of position: " + p.position)
            }

            if (p.position) {
                switch (p.position) {
                    case Engine.windowsData.position.CENTER_OR_SAVE_IN_STORAGE:
                    case Engine.windowsData.position.CENTER_OR_STICK_TO_EQ:
                    case Engine.windowsData.position.CENTER:
                        break;
                    case Engine.windowsData.position.RIGHT_POSITIONING:
                        if (!self.checkXOrYExist(p)) return;
                        break
                }
            } else {
                //if (!isset(p.x) || !isset(p.y)) return errorReport('Window.js', 'initOptions', "bad argument of managePosition. Should be e.g {x: 123, y: 123}", this._nameWindow)
                if (!self.checkXOrYExist(p)) return;

            }


            //if (p.position != Engine.windowsData.position.CENTER_OR_SAVE_IN_STORAGE) {
            //	if (!isset(p.x) || !isset(p.y)) return console.error('[Window.js, initOptions] bad argument of managePosition. Should be e.g {x: 123, y: 123}', this._nameWindow);
            //}
        }



        if (isset(options.manageOpacity)) { // value means default opacity

            //if (!options.nameWindow) 					      return console.error('manageOpacity require window name');
            if (options.type !== Engine.windowsData.type.TRANSPARENT) return console.error('[Window.js, initOptions] manageOpacity require transparent window type', this._nameWindow);
            if (options.manageOpacity < 0) return console.error('[Window.js, initOptions] manageOpacity require value >= 0 // 0 - 0.0 light mode, 1 - 0.25, 2 - 0.5, 3 - 0.75, 4 - 1', this._nameWindow);

            //this.setManageOpacity(options.manageOpacity);

            let lightModeCss = options.lightModeCss ? options.lightModeCss : null;

            windowManageOpacity = new WindowManageOpacity();
            windowManageOpacity.init(this, this._nameWindow, $buttonsMenu, this.$, lightModeCss);
            windowManageOpacity.setManageOpacity(options.manageOpacity);
        }

        if (isset(options.manageConfiguration)) {
            setManageConfigurationButton(options.manageConfiguration);
        }

        if (options.manageSize) {
            setManageSize(options.manageSize, options.type);
        }

        if (options.manageCollapse) {
            this.setManageCollapse(options.manageCollapse);
        }

        if (options.search) {
            initSearchInTransparentWindow();
        }

        if (isset(options.manageOpacity) || isset(options.manageConfiguration) || options.manageSize || options.manageCollapse || options.mobileMenu || isMobileApp() && searchComponent) {
            manageHamburger();
        }
    };

    const manageHamburger = () => {
        //let $manageHamburgerButton = $('<div>').addClass('manage-hamburger-button');
        //
        //const $iconClose = $('<div>').addClass('ie-icon ie-icon-menu');
        //$manageHamburgerButton.append($iconClose);


        let $manageHamburgerButton = createHamburgerMenuButton('manage-hamburger-button', function(e, menu) {
            if (windowManageOpacity) {
                menu.push([_t('WINDOW_OPACITY_UP'), function() {
                    windowManageOpacity.increaseOpacity()
                }, {
                    button: {
                        cls: 'not-close'
                    }
                }])
                //menu.push(['OPACITY_DOWN', function () {windowManageOpacity.decreaseOpacity()}])
            }

            if (options.manageConfiguration) {

                menu.push([_t('WINDOW_CONFIG'), function() {
                    if (options.manageConfiguration.fn) {
                        options.manageConfiguration.fn(e, options.manageConfiguration)
                    }
                }]);

            }

            if (windowManageSize) {
                menu.push([_t('SIZE_UP'), function() {
                    windowManageSize.callNextSizeOpt()
                }, {
                    button: {
                        cls: 'not-close'
                    }
                }]);
                //menu.push(['SIZE_DOWN', function () {windowManageSize.callPreviousSizeOpt()}]);
            }

            if (options.manageCollapse) {
                menu.push([_t('COLLAPSE_TOGGLE'), function() {
                    self.collapseToggle(e, options.manageCollapse.callbackFn)
                }, {
                    button: {
                        cls: 'not-close'
                    }
                }]);
            }

            if (isMobileApp() && searchComponent) {
                menu.push([_t('search'), function(e) {
                    toogleSearchInTransparentWindow()
                }]);
            }

            if (options.mobileMenu) {
                for (let k in options.mobileMenu) {
                    menu.push(options.mobileMenu[k]);
                }
            }
        });

        //$manageHamburgerButton.addClass('manage-hamburger-button');

        $buttonsMenu.prepend($manageHamburgerButton);

        //$manageHamburgerButton.click(function (e) {
        //
        //	let menu = [];
        //
        //	if (windowManageOpacity) {
        //		menu.push([_t('WINDOW_OPACITY_UP'), function () {windowManageOpacity.increaseOpacity()}, {button:{cls:'not-close'}}])
        //		//menu.push(['OPACITY_DOWN', function () {windowManageOpacity.decreaseOpacity()}])
        //	}
        //
        //	if (options.manageConfiguration) {
        //
        //		menu.push([_t('WINDOW_CONFIG') , function () {
        //			if (options.manageConfiguration.fn) {
        //				options.manageConfiguration.fn(e, options.manageConfiguration)
        //			}
        //		}]);
        //
        //	}
        //
        //	if (windowManageSize) {
        //		menu.push([_t('SIZE_UP'), function () {windowManageSize.callNextSizeOpt()}, {button:{cls:'not-close'}}]);
        //		//menu.push(['SIZE_DOWN', function () {windowManageSize.callPreviousSizeOpt()}]);
        //	}
        //
        //	if (options.manageCollapse) {
        //		menu.push([_t('COLLAPSE_TOGGLE'), function () {self.collapseToggle(e, options.manageCollapse.callbackFn)}, {button:{cls:'not-close'}}]);
        //	}
        //
        //	if (searchComponent) {
        //		menu.push([_t('search'), function (e) {toogleSearchInTransparentWindow()}]);
        //	}
        //
        //	if (options.mobileMenu) {
        //		for (let k in options.mobileMenu) {
        //			menu.push(options.mobileMenu[k]);
        //		}
        //	}
        //
        //	Engine.interface.showPopupMenu(menu, getE(e, e));
        //});
    }

    const setManageConfigurationButton = (configurationData) => {
        let $manageConfigurationButton = $('<div>').addClass('manage-configuration-button settings-button').tip(_t('iconconfig'));
        $buttonsMenu.append($manageConfigurationButton)

        $manageConfigurationButton.on('click', function(e) {
            if (configurationData.fn) {
                configurationData.fn(e, configurationData)
            }
        })

    }

    const setManageSize = (manageSize, optionsType) => {
        if (optionsType !== getEngine().windowsData.type.TRANSPARENT) {
            errorReport(moduleData.fileName, "initOptions", "manageSize require transparent window type", this._nameWindow);
            return;
        }

        let manageSizeCallback = manageSize.callback ? manageSize.callback : null;
        windowManageSize = new WindowManageSize();

        windowManageSize.init(this, this._nameWindow, $buttonsMenu, content, manageSize.sizeArray, manageSizeCallback);
    }

    this.setManageCollapse = ({
        defaultVal,
        callbackFn,
        leftPos
    }) => {
        let $btn = this.createCollapseBtn(leftPos);
        const stateFromStorage = StorageFuncWindow.getCollapseWindow(this._nameWindow)
        const state = stateFromStorage !== null ? stateFromStorage : defaultVal;
        this.setCollapse($btn, state);

        $btn.on('click', (e) => this.collapseToggle(e, callbackFn));
    }

    this.createCollapseBtn = (leftPos) => {
        let $btn = $('<div>', {
            class: 'collapse'
        });
        //this.$.append($btn)
        $buttonsMenu.append($btn)

        //if (isset(leftPos)) {
        //	$btn.css({ left: leftPos })
        //} else if (options.manageOpacity) {
        //	$btn.css({ left: '2px' })
        //}

        return $btn;
    }

    this.setCollapse = ($btn, state) => {
        collapsed = state;
        this.setCollapseTip($btn);
    }

    this.collapseToggle = (e, callbackFn) => {
        collapsed = !collapsed;
        const $btn = $(e.currentTarget);
        this.setCollapseTip($btn);
        this.setCollapseClass();
        callbackFn(collapsed);
        StorageFuncWindow.setCollapseWindow(collapsed, this._nameWindow);
    }

    this.setCollapseTip = ($btn) => {
        const tip = collapsed ? _t('expand') : _t('collapse');
        $btn.tip(tip);
        this.setCollapseClass();
    }

    this.setCollapseClass = () => {
        if (collapsed) this.$.addClass('window--collapsed')
        else this.$.removeClass('window--collapsed')
    }

    this.manageShow = () => {
        let show = StorageFuncWindow.getShowWindow(this._nameWindow);
        if (show == null) StorageFuncWindow.setShowWindow(options.manageShow, this._nameWindow);

        this.manageShowFromStorage();
    };

    this.manageShowFromStorage = () => {
        let show = StorageFuncWindow.getShowWindow(this._nameWindow);
        show ? this.show() : this.hide();
    };

    this.checkXOrYExist = (p) => {
        if (!isset(p.x) || !isset(p.y)) {
            errorReport('Window.js', 'initOptions', "bad argument of managePosition. Should be e.g {x: 123, y: 123}", this._nameWindow)
            return false
        }
        return true
    }

    const getActualWindowManageSize = () => {
        if (!windowManageSize) {
            return null
        }

        return windowManageSize.getActualSize();
    }

    const callNextSizeOpt = (dontGoToFirst) => {
        if (!windowManageSize) {
            return null
        }

        return windowManageSize.callNextSizeOpt(dontGoToFirst);
    }

    const callPreviousSizeOpt = (dontGoToFirst) => {
        if (!windowManageSize) {
            return null
        }

        return windowManageSize.callPreviousSizeOpt(dontGoToFirst);
    }

    const toogleSearchInTransparentWindow = () => {
        if (!isTransparent()) {
            return
        }

        if (!searchComponent) {
            return
        }

        if (!mobileCheck()) {
            return;
        }

        if (this.$.hasClass(SEARCH_HIDE_CL)) {
            this.$.removeClass(SEARCH_HIDE_CL)
        } else {
            this.$.addClass(SEARCH_HIDE_CL)
        }

    }

    const isTransparent = () => {
        return options.type == getEngine().windowsData.type.TRANSPARENT;
    }

    const initSearchInTransparentWindow = () => {

        if (!isTransparent()) {
            return
        }

        if (mobileCheck()) {
            this.$.addClass(SEARCH_HIDE_CL);
        }

        let data = {
            keyUpCallback: options.search.keyUpCallback
        };

        if (options.search.addClass) {
            data.addClass = options.search.addClass;
        }

        searchComponent = new SearchComponent();
        searchComponent.init(data);

        content.append(searchComponent.getSearchWrapper())
    };

    const getSearchComponent = () => {
        return searchComponent
    };


    this.getSearchComponent = getSearchComponent;
    this.getActualWindowManageSize = getActualWindowManageSize;
    this.updateSizeWindow = updateSizeWindow;
    this.callNextSizeOpt = callNextSizeOpt;
    this.callPreviousSizeOpt = callPreviousSizeOpt;
    this.initSearchInTransparentWindow = initSearchInTransparentWindow;
};