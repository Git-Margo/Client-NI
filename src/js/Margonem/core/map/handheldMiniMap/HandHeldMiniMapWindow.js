let tpl = require('core/Templates');
// let Store                   = require('core/Storage');
var EditMiniMapWindowPanel = require('core/map/EditMiniMapWindowPanel');
var HandHeldMiniMapData = require('core/map/handheldMiniMap/HandHeldMiniMapData');
var StorageFuncHandHeldMiniMap = require('core/map/StorageFuncHandHeldMiniMap');
// var StorageFuncWindow = require('core/window/StorageFuncWindow');


module.exports = function() {

    let wnd;
    let canvas;
    let ctx;

    // const handheldStoreKey = 'handheld-window';

    let searchValue = '';

    let editMiniMapWindowPanel;

    let resizeTimeOut = null;

    // let minSquare     = 14
    let sizes = [230, 300, 450, 650];
    let maxSize = sizes.length - 1;
    let currentSize = 0;

    let scale = null;
    let squareData = {
        normalSize: null,
        minSize: HandHeldMiniMapData.MIN_SIZE,
        margin: 0
    };
    let margin = {
        left: 0,
        top: 0
    };

    function init() {
        initWindow();
        setSizeOfMiniMapWindow();
        initSearch();
        createChangeSizeBtn();
        createSettingsBtn();
        initCanvas();
        initMouseEvent();
        initScrollEvents();
        setCanvasSize(sizes[currentSize], sizes[currentSize]);
        // setStateOfMiniMapWindow();
        wnd.updatePos();
    }

    function initWindow() {
        wnd = Engine.windowManager.add({
            content: tpl.get('handheld-mini-map'),
            nameWindow: Engine.windowsData.name.HANDHELD_WINDOW,
            widget: Engine.widgetsData.name.MINI_MAP,
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            //lightModeCss		: `.handheld-mini-map .search-wrapper.search-item-wrapper {display: none}`,
            managePosition: {
                x: '251',
                y: '60',
                position: Engine.windowsData.position.RIGHT_POSITIONING
            },
            title: _t('portable_map'),
            addClass: 'handheld-window',
            manageShow: true,
            onclose: () => {
                closeMiniMap();
            }
        });

        wnd.addToAlertLayer();
    }

    // function setStateOfMiniMapWindow () {
    // 	// let state = Store.get(handheldStoreKey + '/show');
    // 	//let state = StorageFuncHandHeldMiniMap.getShowWindow()
    // 	let state = StorageFuncWindow.getShowWindow(Engine.windowsData.name.HANDHELD_WINDOW)
    //
    // 	if (state == null) {
    // 		// Store.set(handheldStoreKey + '/show', true)
    // 		//StorageFuncHandHeldMiniMap.setShowWindow(true)
    // 		StorageFuncWindow.setShowWindow(true, Engine.windowsData.name.HANDHELD_WINDOW);
    // 	} else {
    //
    // 		if (state == false) wnd.hide();
    //
    // 	}
    //
    // }

    function initSearch() {
        let $searchInput = wnd.$.find('.search');
        let $searchX = wnd.$.find('.search-x');

        $searchInput.keyup(function() {
            searchValue = $(this).val();
            Engine.miniMapController.handHeldMiniMapController.refreshMiniMapController();
        });

        $searchInput.attr('placeholder', _t('search'));

        $searchX.on('click', function() {
            $searchInput.val('')
                .blur()
                .trigger('keyup');
        });
    }

    function initScrollEvents() {
        $(canvas).on('mousewheel DOMMouseScroll', onScrollMap);
    }

    function onScrollMap(e) {
        if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {

            if (currentSize == maxSize) return;
            sizeWindowPlusLoop();

        } else sizeWindowMinusLoop();
        Engine.miniMapController.handHeldMiniMapController.refreshMiniMapController();
    }

    function onResize() {
        if (!wnd.isShow()) return;

        if (resizeTimeOut) clearTimeout(resizeTimeOut);

        resizeTimeOut = setTimeout(function() {
            managePosOfMiniMapWhenWndOutOfScreen();
        }, 200);
    }

    function nameIsCorrect(_name) {
        if (searchValue == '') return true;

        let name = _name;
        name = !name ? name : name.toLowerCase();

        return name.search(searchValue.toLowerCase()) > -1;
    }

    function setSizeOfMiniMapWindow() {
        // var s = Store.get(handheldStoreKey + '/big');
        var s = StorageFuncHandHeldMiniMap.getSizeWindow();

        if (s === null) {
            currentSize = 0;
            saveCurrentSizeInStorage();
        } else currentSize = s
    }

    function createChangeSizeBtn() {
        let $toggleSize = tpl.get('toggle-size-button');

        wnd.$.find('.handheld-mini-map').append($toggleSize);

        $toggleSize.addClass('settings-button1');
        $toggleSize.click(function(e) {
            sizeWindowPlusLoop();
            Engine.miniMapController.handHeldMiniMapController.refreshMiniMapController();
        });
    }

    function createSettingsBtn() {
        let $settings2 = tpl.get('settings-button');
        wnd.$.find('.handheld-mini-map').append($settings2);
        $settings2.addClass('settings-button2');
        $settings2.click(function(e) {
            e.stopPropagation();
            createControllPanel();
        });
    }

    function createControllPanel() {
        if (editMiniMapWindowPanel) editMiniMapWindowPanel.close();
        else {
            editMiniMapWindowPanel = new EditMiniMapWindowPanel();
            editMiniMapWindowPanel.init();
        }
    };

    function removeControlPanel() {
        editMiniMapWindowPanel = null;
    }

    function sizeWindowPlusLoop() {
        if (currentSize == maxSize) currentSize = 0;
        else currentSize++;

        saveCurrentSizeInStorage();
        updateMiniMapWindowSize();
        managePosOfMiniMapWhenWndOutOfScreen();
    }

    function sizeWindowMinusLoop() {
        if (currentSize < 1) return

        currentSize--;

        saveCurrentSizeInStorage();
        updateMiniMapWindowSize();
        managePosOfMiniMapWhenWndOutOfScreen();
    }

    function saveCurrentSizeInStorage() {
        // Store.set(handheldStoreKey + '/big', currentSize);
        StorageFuncHandHeldMiniMap.setSizeWindow(currentSize);
    }

    function managePosOfMiniMapWhenWndOutOfScreen() {
        if (!wnd.checkPassTheScreenBounds()) return;

        //wnd.setWindowOnLeftTopCorner();
        wnd.updatePos();

        if (currentSize == 0) return;
        if (!wnd.checkPassTheScreenBounds()) return;

        currentSize = 0;

        saveCurrentSizeInStorage();
        updateMiniMapWindowSize();

        //wnd.updatePos();
    }

    function updateMiniMapWindowSize() {
        let s = sizes[currentSize];
        setCanvasSize(s, s);
        prepareScaleMarginSquareData();
    }

    function initCanvas() {
        canvas = wnd.$.find('canvas')[0];
        ctx = canvas.getContext('2d');
    }

    function setCanvasSize(w, h) {
        canvas.width = w;
        canvas.height = h;

        wnd.$.find('.handheld-mini-map').css('height', parseInt(h));
    }

    function initMouseEvent() {
        let $canvas = $(canvas);

        $canvas.on("click mousemove mouseleave mouseenter contextmenu", function(e) {
            e.preventDefault();
            if (e.type == 'click') clickMiniMap(e, $canvas);
            else moveMouseMiniMap(e, $canvas);

        });
    }

    function clickMiniMap(e, $canvas) {

        let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;
        let miniMapTipController = handHeldMiniMapController.getMiniMapTipController();

        let refFollowObj = Engine.hero.getRefFollowObj();
        if (refFollowObj) Engine.hero.clearRefFollowObj();

        let cordsArray = getCords(e, $canvas);
        let objectFromCordsArray = miniMapTipController.getObjectFromCordsArray(cordsArray);

        if (objectFromCordsArray) {
            Engine.hero.autoGoTo(objectFromCordsArray.cords);
            return
        }

        let cordsArray2 = getCords(e, $canvas, true);
        let correctPos = Engine.map.getCorrectAutoGoPos(cordsArray2[0].x, cordsArray2[0].y);

        Engine.hero.autoGoTo(correctPos);
    }

    function moveMouseMiniMap(e, $canvas) {
        let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;
        let miniMapTipController = handHeldMiniMapController.getMiniMapTipController();

        let cordsArray = getCords(e, $canvas);
        let objectFromCordsArray = miniMapTipController.getObjectFromCordsArray(cordsArray);

        miniMapTipController.manageShowHideTip(e, objectFromCordsArray);
    }

    function getCords(e, $canvas, notPunch) {
        let factor = Engine.zoomFactor;

        let handHeldMiniMapWindow = Engine.miniMapController.handHeldMiniMapController.getHandHeldMiniMapWindow();

        let squareData = handHeldMiniMapWindow.getSquareData();

        let leftOffset = $canvas.offset().left;
        let topOffset = $canvas.offset().top;

        let xMap = Engine.map.size.x;
        let yMap = Engine.map.size.y;

        let clientX = e.clientX;
        let clientY = e.clientY;

        let sc;

        if (xMap > yMap) sc = canvas.width / xMap * factor;
        else sc = canvas.height / yMap * factor;

        if (!notPunch && squareData.margin != 0) return getAreaCords(clientX, clientY, leftOffset, topOffset, margin, sc);

        let l = ((clientX - leftOffset) - margin.left);
        let t = ((clientY - topOffset) - margin.top);

        return [{
            x: Math.floor(l / sc),
            y: Math.floor(t / sc)
        }];
    }

    function getAreaCords(clientX, clientY, leftOffset, topOffset, margin, sc) {
        let obj = {};

        let start = Math.floor(squareData.margin) * -1;
        let end = Math.floor(squareData.normalSize) - start;

        for (let _clientY = start; _clientY < end; _clientY++) {

            for (let _clientX = start; _clientX < end; _clientX++) {

                let __l = ((clientX + _clientX - leftOffset) - margin.left);
                let __t = ((clientY + _clientY - topOffset) - margin.top);

                let x = Math.floor(__l / sc);
                let y = Math.floor(__t / sc);

                if (!obj[y]) obj[y] = {};

                if (!obj[y][x]) obj[y][x] = true;

            }

        }

        let a = [];

        for (let y in obj) {
            for (let x in obj[y]) {
                a.push({
                    x: x,
                    y: y
                })
            }
        }

        return a;
    }

    function prepareScaleMarginSquareData() {
        prepareScaleMargin();
        prepareSquareData();
    }

    function prepareScaleMargin() {
        let xMap = Engine.map.size.x;
        let yMap = Engine.map.size.y;

        let canvasWidth = canvas.width;
        let canvasHeight = canvas.height;

        let realWidthMap = xMap * CFG.tileSize;
        let realHeightMap = yMap * CFG.tileSize;

        if (xMap > yMap) {
            setScale(canvasWidth / realWidthMap);

            let topMargin = (canvasHeight - (realHeightMap * scale)) / 2;
            setMargin(0, topMargin);
        } else {
            setScale(canvasHeight / realHeightMap);

            let leftMargin = (canvasWidth - (realWidthMap * scale)) / 2;
            setMargin(leftMargin, 0);
        }
    }

    function prepareSquareData() {
        let oneSquareSize = CFG.tileSize * scale;
        let minOneSquareSize = Math.max(oneSquareSize, HandHeldMiniMapData.MIN_SIZE);
        let oneSquareMargin = 0;

        if (minOneSquareSize > oneSquareSize) oneSquareMargin = (minOneSquareSize - oneSquareSize) / 2;

        setSquareData(oneSquareSize, minOneSquareSize, oneSquareMargin);
    }

    function openMiniMap() {
        // Store.set(handheldStoreKey + '/show', true);
        //StorageFuncHandHeldMiniMap.setShowWindow(true)
        wnd.show();
        wnd.setWndOnPeak();
    }

    function closeMiniMap() {
        wnd.hide();
        // Store.set(handheldStoreKey + '/show', false);
        //StorageFuncHandHeldMiniMap.setShowWindow(false)
    }

    function toggleMiniMap() {
        if (wnd.isShow()) closeMiniMap();
        else openMiniMap();
    }

    function setMargin(left, top) {
        margin.left = left;
        margin.top = top;
    }

    function getMargin() {
        return margin;
    }

    function getScale() {
        return scale;
    }

    function getNewScale() {
        let xMap = Engine.map.size.x;
        let yMap = Engine.map.size.y;

        let canvasWidth = canvas.width;
        let canvasHeight = canvas.height;

        let realWidthMap = xMap * CFG.tileSize;
        let realHeightMap = yMap * CFG.tileSize;

        let widthMiniMap = xMap * HandHeldMiniMapData.MIN_SQUARE;
        let heightMiniMap = yMap * HandHeldMiniMapData.MIN_SQUARE;


        return widthMiniMap / realWidthMap;
    }

    function getNewOffset() {
        return [
            -Engine.hero.rx * HandHeldMiniMapData.MIN_SQUARE + canvas.width / 2,
            -Engine.hero.ry * HandHeldMiniMapData.MIN_SQUARE + canvas.height / 2
        ]
    }

    // function getNewMinSquare () {
    // 	return minSquare;
    // }

    function setSquareData(normalSizeSquare, minSizeSquare, marginSquare) {
        //console.log(normalSizeSquare);
        squareData.normalSize = normalSizeSquare;
        squareData.minSize = minSizeSquare;
        squareData.margin = marginSquare;
        squareData.halfNormalSize = normalSizeSquare / 2;
        squareData.halfMinSize = minSizeSquare / 2;
    }

    function getSquareData() {
        return squareData;
    }

    function setScale(_scale) {
        scale = _scale;
    }

    function getCtx() {
        return ctx;
    }

    function getCanvas() {
        return canvas;
    }


    this.init = init;
    this.getCtx = getCtx;
    this.getCanvas = getCanvas;
    this.getMargin = getMargin;
    this.getScale = getScale;
    this.getSquareData = getSquareData;
    this.nameIsCorrect = nameIsCorrect;
    this.setScale = setScale;
    this.getNewScale = getNewScale;
    // this.getNewMinSquare = getNewMinSquare;
    this.getNewOffset = getNewOffset;

    this.setSquareData = setSquareData;
    this.setMargin = setMargin;
    this.onResize = onResize;
    this.toggleMiniMap = toggleMiniMap;
    this.removeControlPanel = removeControlPanel;
    this.prepareScaleMarginSquareData = prepareScaleMarginSquareData;
    this.createControllPanel = createControllPanel;



}