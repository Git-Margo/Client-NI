// var wnd = require('core/Window');
var tpl = require('core/Templates');
const TutorialData = require("./TutorialData");
module.exports = function() {
    this.active = null;
    this.activeStep = null;
    this.queue = [];
    this.content = null;
    this.interval = null;
    this.$blinkObj = null;
    this.focusCollider = null;

    var self = this;
    let externalData = null;

    this.list = Engine.tutorialManager.list;

    this.getActiveStepData = () => {
        if (externalData) return externalData;

        return self.list[_l()][this.active][this.activeStep]
    };

    const setExternalData = (_externalData) => {
        externalData = _externalData;
    }

    this.create = function(id, _externalData) {

        console.log('CHECK TUTORIAL_START !!!!!!!!!!!!!', id);

        if (this.setVariables(id, _externalData)) return;

        if (_externalData) setExternalData(_externalData);

        console.log('tutorialStart !!!!!!!!!!!!!', id);

        this.requestRemoveCloud();
        this.addAdditionalFunctionBeforeCreate();
        this.initWindow();
        this.initMargin()
        //this.content.css('display', 'block');
        this.addButts();
        this.canvasFocus();
        this.changeNameBut();
        this.setHeader();
        this.setText();
        this.setGraphic();
        this.setExternalProperties();
        this.blink();
        this.htmlFocus();
        this.canvasMultiGlow();
        this.htmlMultiGlow();
        this.setPosition();
        this.doCallback();
        this.addClick();
        this.addAdditionalFunctionAfterCreate();
    };
    //-28px -20px -13px
    this.initMargin = function() {
        this.wnd.$.find('.content').css({
            'margin-top': '-12px',
            'margin-left': '-23px',
            'margin-right': '-23px',
            'margin-bottom': '-20px'
        });
    };

    this.addAdditionalFunctionBeforeCreate = () => {
        let additionalFunctionBeforeCreate = this.getActiveStepData().additionalFunctionBeforeCreate;
        if (!additionalFunctionBeforeCreate) return;
        additionalFunctionBeforeCreate();
    }

    this.addAdditionalFunctionAfterCreate = () => {
        let additionalFunctionAfterCreate = this.getActiveStepData().additionalFunctionAfterCreate;
        if (!additionalFunctionAfterCreate) return;
        additionalFunctionAfterCreate();
    }

    this.canvasFocus = () => {
        let canvasFocus = this.getActiveStepData().canvasFocus;
        let blink = this.getActiveStepData().blink;

        if (!canvasFocus) return;
        if (!this.checkCanvasDataIsCorrect(canvasFocus)) return;

        //Engine.interface.$gLayer.addClass('canvas-focus');
        Engine.htmlFocus.create(Engine.interface.get$gameLayer(), false, false);

        if (canvasFocus.kind != 'ONLY_CANVAS') Engine.canvasFocus.addOverlayAndTarget(canvasFocus, blink);
    };

    this.checkCanvasDataIsCorrect = (canvasFocusData) => {

        if (!canvasFocusData.hasOwnProperty('kind')) {
            console.warn('[Tutorial.js, checkCanvasDataIsCorrect] Not exist "kind" property in canvasFocus');
            return false;
        }

        switch (canvasFocusData.kind) {
            case 'ONLY_CANVAS':
            case TutorialData.TYPE_OBJECT.HERO:
                return true;
            case TutorialData.TYPE_OBJECT.NPC:
                if (canvasFocusData.hasOwnProperty('id')) return true;
                console.warn('[Tutorial.js, checkCanvasDataIsCorrect] Not exist "id" property in canvasFocus');
                return false;
            default:
                console.warn('[Tutorial.js, checkCanvasDataIsCorrect] bad "kind" property: ', canvasFocusData.kind);
                return false;
        }
    };

    //this.addClickOld = function () {
    //	let selector = self.getActiveStepData().click;
    //	if (!selector) return;
    //	self.wnd.$.find('.click-area').css('display', 'block');
    //	let $clone = $(selector).clone(true);
    //	$clone.css({
    //		display:'block',
    //		margin: 0,
    //		position: 'absolute',
    //		top: '50%',
    //		left: '50%',
    //		'margin-right': '-50%',
    //		transform: 'translate(-50%, -50%)',
    //	});
    //	self.wnd.$.find('.click-area').append($clone);
    //};

    this.addClick = function() {
        let clickData = self.getActiveStepData().click;
        if (!clickData) return;
        self.wnd.$.find('.click-area').css('display', 'block');
        let $clone = tpl.get('button').addClass('small green');
        $clone.find('.label').html(clickData.txt);

        self.wnd.$.find('.click-area').append($clone);
        $clone.click(clickData.clb);
    };

    this.initWindow = () => {

        this.content = tpl.get('tutorial');

        let wndOption = {
            content: this.content,
            nameWindow: Engine.windowsData.name.TUTORIAL_CLOUD,
            objParent: this,
            nameRefInParent: 'wnd',
            type: Engine.windowsData.type.TRANSPARENT,
            closeable: false,
            onclose: () => {
                this.skipTutorial();
            }
        };


        let draggableWnd = this.getActiveStepData().draggableWnd;

        if (draggableWnd === false) wndOption.draggable = false;

        Engine.windowManager.add(wndOption);
        this.wnd.hide();

        this.wnd.addToTutorialLayer();
    };

    this.requestRemoveCloud = function(id) {
        if (externalData) return

        let _id = id ? id : this.active;
        //var v = BigInt(id ? id : this.active);
        //var val = BigInt(Engine.tutorialValue);
        //_g('tutorial&opt=' + (val | Math.pow(2, v)));


        //val ^= BigInt(1) << v - BigInt(1);

        let newBits = Engine.tutorialManager.setBit(Engine.tutorialValue, _id);

        //_g('tutorial&opt=' + parseInt(val.toString()));
        _g('tutorial&opt=' + newBits);
    };

    this.addButts = function() {
        var c = this.content;
        //this.createBtn(this.tLang('turn_off'), c.find('.off-tutorial'), this.turnOffTutorial).addClass('small');
        //this.createBtn(this.tLang('skip'), c.find('.skip-tutorial'), this.skipTutorial).addClass('green small');
        //this.createBtn(this.tLang('next'), c.find('.finish-tutorial'), this.finishTutorial).addClass('green small');
    };

    this.setHeader = function() {
        //var id = this.active;
        //var step = this.activeStep;
        let name = Engine.mobile ? 'headerMobile' : 'headerPc';
        let header = null;

        if (externalData) header = externalData[name] ? parseContentBB(externalData[name]) : 'none';
        else {
            header = self.getActiveStepData()[name];

            if (!header) header = "none";
            else header = _t(header, null, 'new_tutorials');
        }

        //var header = externalData ? externalData[name] : self.getActiveStepData()[name];

        //if (!header) header = 'none';
        //else         header = _t(header, null, 'new_tutorials');

        self.wnd.title(header);
    };

    this.setText = function() {
        //var id = this.active;
        //var step = this.activeStep;

        let name = Engine.mobile ? 'textMobile' : 'textPc';
        let txt = null;
        //var txt = self.getActiveStepData()[name];

        if (externalData) txt = parseContentBB(externalData[name]);
        else txt = _t(self.getActiveStepData()[name], null, 'new_tutorials');

        this.content.find('.con').html(txt);
    };

    this.setGraphic = function() {
        let graphic = self.getActiveStepData()['graphic'];
        if (!graphic || Engine.mobile) return;

        //let id      = this.active;
        //let step    = this.activeStep;
        //let url     = self.getActiveStepData()['graphic'];
        let $graph = this.content.find('.graphic-area');
        let $img = $('<img>').attr('src', graphic).addClass('tutorial-graphic');

        $graph.css('display', 'block').append($img);
    };

    this.setExternalProperties = () => {
        let external_properties = self.getActiveStepData()['external_properties'];

        if (!external_properties) return;

        Engine.rajController.parseObject(external_properties, false, {
            tutorialId: this.active
        });
    }

    // this.bitIsSet = (id) => {
    // 	(Engine.tutorialValue & Math.pow(2, id)) == 0;
    // };

    this.setVariables = function(id, _externalData) {
        if (_externalData) {

            if (this.active === null) {
                this.active = id;
                this.activeStep = 0;
                return false;
            } else {
                this.addToQueue(id, _externalData);
                return true;
            }


        }

        var val = Engine.tutorialValue;
        var bool1 = val !== null && isset(this.list[_l()][id]) && this.active === null;
        //var bool2 = !((val & Math.pow(2, id)) == 0);
        //var bool2 = val & (1 << id - 1);
        let bool2 = Engine.tutorialManager.bitIsSet(val, id);
        if (bool1) {
            if (bool2) {
                this.active = null;
                this.activeStep = null;
                this.closeTutorials();
                return true;
            }
            this.active = id;
            //console.log(this.active);
            this.activeStep = 0;
        } else {
            this.addToQueue(id);
            return true;
        }
    };

    this.addToQueue = function(id, _externalData) {

        let list = _externalData ? Engine.tutorialManager.externalList : self.list;

        if (isset(list[_l()][id])) {

            let o = {
                id: id
            };

            if (_externalData) o.externalData = _externalData;

            this.queue.push(o);
        }
    };

    this.turnOffTutorial = function() {
        //_g('tutorial&opt=' + 0xffffff);
        _g('tutorial&opt=-1');
        self.queue = null;
        self.closeCloud();
    };

    this.skipTutorial = function() {
        self.requestRemoveCloud();
        self.removeDomCloud();
    };

    this.blink = function() {
        var cl = 'tutorial-border';
        var selector = self.getActiveStepData().blink;
        if (!selector) return;
        this.$blinkObj = $(selector);
        this.interval = setInterval(function() {
            var bool = self.$blinkObj.hasClass(cl);
            if (bool) self.$blinkObj.removeClass(cl);
            else self.$blinkObj.addClass(cl);
        }, 500);
    };

    this.getStyles = ($obj) => {
        let obj = {};

        var el = $obj[0];
        var curr_style;
        if (window.getComputedStyle) {
            curr_style = window.getComputedStyle(el);
        } else if (el.currentStyle) {
            curr_style = $.extend(true, {}, el.currentStyle);
        } else {
            throw "shit browser";
        }

        for (let k in curr_style) {
            if (Number.isInteger(parseInt(k))) continue;

            if (k == 'length') continue;
            if (k == "z-index" || k == "zIndex") continue;

            if (curr_style[k] == '' || curr_style[k] === null) continue;
            //if (curr_style[k].constructor.name == "Function") continue;
            if (curr_style[k].constructor.name == "Function") continue;
            obj[k] = curr_style[k]
        }

        return obj;
    };

    this.addItemToView = function(itemData, target, $tip) {
        var item = itemData ? itemData : target.data().item;
        var id = item.id;

        var $icon;

        // if (item.isItem()) 	$icon = Engine.items.createViewIcon(id, 'tip-item')[0];
        // else 				$icon = Engine.tpls.createViewIcon(id, 'tip-tpl-item', item.loc)[0];

        if (item.isItem()) $icon = Engine.items.createViewIcon(id, Engine.itemsViewData.TIP_ITEM_VIEW)[0];
        else $icon = Engine.tpls.createViewIcon(id, Engine.itemsViewData.TIP_TPL_ITEM_VIEW, item.loc)[0];

        $tip.find('.item-head').prepend($icon);
    };

    this.htmlFocus = () => {
        let selector = this.getActiveStepData().htmlFocus;
        let blink = this.getActiveStepData().blink;

        if (!selector) return;
        Engine.htmlFocus.create($(selector), true, blink);
    };

    this.canvasMultiGlow = () => {
        let canvasMultiGlowData = this.getActiveStepData().canvasMultiGlow;
        let blink = this.getActiveStepData().blink;

        if (!canvasMultiGlowData) return;
        Engine.canvasMultiGlow.addMultiGlowTarget(canvasMultiGlowData.list, blink);
    };

    this.htmlMultiGlow = () => {
        let t = self.getActiveStepData();
        let htmlMultiGlow = t.htmlMultiGlow;
        let htmlItemsMultiGlow = this.getItemsMultiGlow();
        let blink = t.blink;
        if (!htmlMultiGlow && !htmlItemsMultiGlow) return;

        let data = this.getArrayToMultiGlow(htmlMultiGlow, htmlItemsMultiGlow);
        //this.getSelectorsItemsMultiGlow();


        //console.log(data);
        Engine.htmlMultiGlow.addMultiGlowTarget(data, blink);
    };

    this.getItemsMultiGlow = () => {
        let t = self.getActiveStepData();
        if (t.itemsNeed && t.itemsNeed.htmlMultiGlow) {
            if (t.itemsNeed.items) return t.itemsNeed.items;
            if (t.itemsNeed.tpls) return t.itemsNeed.tpls;
        }
        return false;
    };

    //this.getSelectorsItemsMultiGlow = () => {
    //	debugger;
    //	let t = self.list[self.active][self.activeStep];
    //		let items = Engine.tutorialManager.needItemsTest(t);
    //		if (items) {
    //
    //		}
    //		//return t.itemsNeed.items;
    //	return false;
    //};

    this.getArrayToMultiGlow = (normalMultiGlowArray, profItemsMultiGlowObject) => {
        let a = [];

        if (normalMultiGlowArray) {
            for (let i = 0; i < normalMultiGlowArray.length; i++) {
                a.push(normalMultiGlowArray[i]);
            }
        }

        if (profItemsMultiGlowObject) {
            let t = self.getActiveStepData();

            Engine.tutorialManager.getSelectorsFromNeedItems(t, a);

        }
        return a;
    };

    this.findItemsInElementsAndChangeOnItemView = ($element) => {
        let $items = $element.find('.item');
        $items.each(function() {
            let item = $(this).data('item');
            let $icon;

            // if (item.isItem()) 	$icon = Engine.items.createViewIcon(item.id, 'tutorial-item')[0];
            // else 				        $icon = Engine.tpls.createViewIcon(item.id, 'tutorial-tpl-item', item.loc)[0];

            if (item.isItem()) $icon = Engine.items.createViewIcon(item.id, Engine.itemsViewData.TUTORIAL_ITEM_VIEW)[0];
            else $icon = Engine.tpls.createViewIcon(item.id, Engine.itemsViewData.TUTORIAL_TPL_ITEM_VIEW, item.loc)[0];

            $(this).replaceWith($icon);
        });
    };

    this.findViewsInElementsAndRemove = function($element) {
        let $items = $element.find('.item');
        $items.each(function() {
            let item = $(this).data('item');

            // if (item.isItem()) 	Engine.items.deleteViewIconIfExist(item.id, 'tutorial-item');
            // else 				        Engine.tpls.deleteViewIconIfExist(item.id, 'tutorial-tpl-item', item.loc);

            if (item.isItem()) Engine.items.deleteViewIconIfExist(item.id, Engine.itemsViewData.TUTORIAL_ITEM_VIEW);
            else Engine.tpls.deleteViewIconIfExist(item.id, Engine.itemsViewData.TUTORIAL_TPL_ITEM_VIEW, item.loc);
        });
    };

    this.setStyleInAllChildren = ($elToCopy) => {
        let $copyWithoutStyle = $elToCopy.clone(true);
        let stylesArray = [];
        let i = [0];

        this.prepareStyles($elToCopy, stylesArray);
        this.setStyles($copyWithoutStyle, stylesArray, i);

        let pos = $elToCopy.offset();

        $copyWithoutStyle.css({
            position: 'fixed',
            left: pos.left,
            top: pos.top
        });

        return $copyWithoutStyle;
    };

    this.prepareStyles = ($objectToCheck, stylesArray) => {
        let children = $objectToCheck.children();
        if (children.length) {
            children.each(function() {
                self.prepareStyles($(this), stylesArray);
            });
        }
        stylesArray.push(this.getStyles($objectToCheck));
    };

    this.setStyles = ($copyWithoutStyle, stylesArray, i) => {
        let children = $copyWithoutStyle.children();
        if (children.length) {
            children.each(function() {
                self.setStyles($(this), stylesArray, i);
            });
        }
        $copyWithoutStyle.css(stylesArray[i[0]]);
        i[0]++;
    };

    this.setPosition = () => {
        let htmlPosition = self.getActiveStepData().htmlPosition;
        let htmlPositionOffset = self.getActiveStepData().htmlPositionOffset;
        let canvasPosition = self.getActiveStepData().canvasPosition;

        if (htmlPosition) return this.setHtmlPosition(htmlPosition, htmlPositionOffset);
        if (canvasPosition) return this.setCanvasPosition(canvasPosition);

        self.wnd.show();
        this.wnd.center();
    };

    this.setHtmlPosition = (selector, htmlPositionOffset) => {
        let $obj = $(selector);
        if (!Engine.mobile) {
            let $graphicArea = Engine.tutorials.wnd.$.find('.graphic-area>img');
            if ($graphicArea.length && !$graphicArea[0].complete) {
                setTimeout(() => {
                    this.setHtmlPosition(selector, htmlPositionOffset);
                }, 100);
                return
            }
        }

        //if (!Engine.mobile && !Engine.tutorials.wnd.$.find('.graphic-area>img')[0].complete) {
        //	setTimeout(() => {
        //		this.setHtmlPosition(selector);
        //	},100);
        //	return
        //}
        if (!$obj.length) return;
        let offsetObj = $obj.offset();
        let wObj = $obj.width();
        let hObj = $obj.height();

        self.findPosition(wObj, hObj, offsetObj.left, offsetObj.top, $obj, htmlPositionOffset ? htmlPositionOffset : null);
    };

    this.setCanvasPosition = function(canvasPosition) {

        let target;
        //let isObject = typeof canvasPosition === "object";

        if (!this.checkCanvasDataIsCorrect(canvasPosition)) return;
        target = Engine.canvasFocus.getTargetFromTutorialData(canvasPosition);

        // if (isObject) {
        //
        // 	if (!this.checkCanvasDataIsCorrect(canvasPosition)) return;
        // 	target = Engine.canvasFocus.getTargetFromTutorialData(canvasPosition);
        //
        // } else target = Engine.canvasFocus.getTarget();


        if (!target) {
            self.wnd.show();
            console.warn('[Tutorial.js, setCanvasPosition] target in canvasFocus not exist!');
            return;
        }

        this.setPositionCloudAfterCanvasObjectLoad(target);

        //self.findPosition(target.fw, target.fh,
        //	(target.d.x - Engine.map.offset[0] / 32) * 32 + Engine.get$_canvas().offset().left,
        //	(target.d.y - Engine.map.offset[1] / 32) * 32 + Engine.get$_canvas().offset().top
        //);
    };

    this.setPositionCloudAfterCanvasObjectLoad = (target) => {
        if (!(target.imgLoaded && Engine.map.getOffsetIsSet())) {
            setTimeout(() => {
                this.setPositionCloudAfterCanvasObjectLoad(target);
            }, 500);
            return
        }
        self.findPosition(target.fw, target.fh,
            (target.d.x - Engine.map.offset[0] / 32) * 32 + Engine.interface.get$GAME_CANVAS().offset().left,
            (target.d.y - Engine.map.offset[1] / 32) * 32 + Engine.interface.get$GAME_CANVAS().offset().top
        );
    };

    this.getShift = ($htmlObj) => {
        let width = 0;
        let height = 0;
        if ($htmlObj) {
            if ($htmlObj.css('border-left-width')) width += parseInt($htmlObj.css('border-left-width'));
            if ($htmlObj.css('border-right-width')) width += parseInt($htmlObj.css('border-right-width'));
            if ($htmlObj.css('border-top-width')) height += parseInt($htmlObj.css('border-top-width'));
            if ($htmlObj.css('border-bottom-width')) height += parseInt($htmlObj.css('border-bottom-width'));
        } else {
            // width = 20;
            // height = 40;
        }
        return [width, height];
    };

    this.findPosition = (wObj, hObj, left, top, $htmlObj, offset) => {
        let $w = self.wnd.$;
        let marginTutorialWnd = 4;
        //let wTutorialWnd = $w.width() + 2 * marginTutorialWnd;
        //let hTutorialWnd = $w.height() + 2 * marginTutorialWnd;
        let wTutorialWnd = $w.outerWidth();
        let hTutorialWnd = $w.outerHeight();

        let shift = this.getShift($htmlObj);

        let borderWidth = shift[0];
        let borderHeight = shift[1];

        let distBeetweenTargetAndTutorialWnd = 10;

        let posArray = [
            [
                left + wObj + borderWidth + distBeetweenTargetAndTutorialWnd, //right down
                top + hObj + borderHeight + distBeetweenTargetAndTutorialWnd
            ],
            [ //left up
                left - wTutorialWnd - distBeetweenTargetAndTutorialWnd,
                top - hTutorialWnd - distBeetweenTargetAndTutorialWnd
            ],
            [
                left + wObj + borderWidth + distBeetweenTargetAndTutorialWnd, //right up
                top - hTutorialWnd - distBeetweenTargetAndTutorialWnd
            ],
            [
                left - wTutorialWnd - distBeetweenTargetAndTutorialWnd, //left down
                top + hObj + borderHeight + distBeetweenTargetAndTutorialWnd
            ]
        ];

        let wXMax = $(window).width();
        let hYMax = $(window).height();
        let opt = -1;

        for (let i = 0; i < posArray.length; i++) {
            let x = posArray[i][0];
            let y = posArray[i][1];
            let xMax = x + wTutorialWnd;
            let yMax = y + hTutorialWnd;

            if (x > 0 && y > 0 && xMax < wXMax && yMax < hYMax) {
                opt = i;
                break;
            }
        }

        if (opt == -1) {

            //let y = top - wTutorialWnd + borderHeight;
            let y = top + (hObj + borderHeight) / 2 - wTutorialWnd / 2;

            posArray = [

                [left - wTutorialWnd - distBeetweenTargetAndTutorialWnd, y], //left  middle top
                [left + wObj + borderWidth + distBeetweenTargetAndTutorialWnd, y] //right middle top

            ];

            for (let i = 0; i < posArray.length; i++) {
                let x = posArray[i][0];
                let xMax = x + wTutorialWnd;

                if (x > 0 && xMax < wXMax) {
                    opt = i;
                    break;
                }
            }
        }
        self.wnd.show();
        $w.css('left', posArray[opt][0] + (offset && offset.left ? offset.left : 0));
        $w.css('top', posArray[opt][1] + (offset && offset.top ? offset.top : 0));
    };

    this.onResize = () => {
        this.refreshViewOfTutorialStep();
    };

    this.refreshViewOfTutorialStep = () => {
        if (!this.wnd) return;
        this.clearOverlay();
        this.htmlFocus();
        this.canvasFocus();
        this.canvasMultiGlow();
        this.htmlMultiGlow();
        this.setPosition();
    };

    this.doCallback = function() {
        var callback = self.getActiveStepData().callback;
        if (callback) callback();
    };

    this.clearOverlay = () => {
        //$('.canvas-focus').removeClass('canvas-focus');

        Engine.canvasFocus.removeOverlayAndTarget();
        Engine.htmlFocus.removeOverlayAndTarget();
        Engine.canvasMultiGlow.removeMultiGlowTarget();
        Engine.htmlMultiGlow.removeMultiGlowTarget();
    };

    this.clearClick = function() {
        self.wnd.$.find('.click-area').empty().css('display', 'none');
    };

    this.clearGraphic = function() {
        self.wnd.$.find('.graphic-area').empty().css('display', 'none');;
    };

    this.clearBlink = function() {
        if (!this.interval) return;
        clearInterval(this.interval);
        this.$blinkObj.removeClass('tutorial-border');
        this.$blinkObj = null;
        this.interval = null;
    };

    this.changeNameBut = function() {
        if (externalData) return
        var l = self.list[_l()][self.active].length;
        if (self.activeStep == l - 1) {
            var txt = this.tLang('finish');
            this.content.find('.finish-tutorial>.button>.label').html(txt);
        }
    };

    this.finishTutorial = function() {
        //var l = self.list[_l()][self.active].length;
        //if (l - 1 > self.activeStep) {
        if (false) {
            self.clearEvents();
            self.activeStep++;
            self.canvasFocus();
            self.changeNameBut();
            self.htmlFocus();
            self.canvasMultiGlow();
            self.htmlMultiGlow();
            self.blink();
            self.addClick();
            self.setHeader();
            self.setText();
            self.setGraphic();
            self.setPosition();
        } else {
            //console.log('requestRemoveCloud');
            //self.requestRemoveCloud();
            self.removeDomCloud();
        }
    };

    this.removeDomCloud = function() {
        var l = self.queue.length;
        if (l >= 1) this.closeCloud(true);
        else this.closeCloud();
    };

    this.clearEvents = function() {
        this.clearOverlay();
        this.clearBlink();
        this.clearClick();
        this.clearGraphic();
    };

    this.closeCloud = function(closeAndOpen) {
        // self.wnd.$.remove();
        self.clearEvents();
        self.wnd.remove();
        self.active = null;
        self.activeStep = null;
        if (!closeAndOpen) {
            self.closeTutorials();
            return;
        }
        var nextCloudData = self.getDataNextCloud();
        let _externalData = nextCloudData.externalData ? nextCloudData.externalData : null;
        self.create(nextCloudData.id, _externalData);
    };

    this.closeTutorials = function() {
        Engine.tutorials = false;
    };

    this.getDataNextCloud = function() {
        var dataCloud = self.queue[0];
        this.queue.shift();
        return dataCloud;
    };

    this.tLang = function(name) {
        return _t(name, null, 'tutorials');
    };

    this.createBtn = function(label, $where, callback) {
        var $btn = tpl.get('button');
        $btn.click(callback);
        $btn.find('.label').html(label);
        $where.append($btn);
        return $btn;
    };

    this.getActive = () => {
        return this.active;
    }
};