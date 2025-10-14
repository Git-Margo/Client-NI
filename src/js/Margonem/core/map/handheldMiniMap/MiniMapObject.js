let HandHeldMiniMapData = require('@core/map/handheldMiniMap/HandHeldMiniMapData');


module.exports = function() {

    let moduleData = {
        fileName: "MiniMapObject.js"
    };

    let color = null;
    let shape = null;
    let objRef = null;
    let kind = null;
    let belongType = null;
    let tip = null;

    let xMiniMapObject = null;
    let yMiniMapObject = null;

    let imageObject;
    let additionalMargin = 0;

    let alpha = null;
    let sinVal = 0;

    function init() {

    }

    function setRef(objData) {
        objRef = objData;
    }

    function setTip(content, t_type, i_type, params) {
        tip = [
            content,
            t_type,
            i_type,
            params
        ];
        //content, t_type, i_type = null, params = {}
    }

    function checkCanShowTip() {
        return Engine.rajCharacterHide.checkShowTip(objRef);
    }

    function getTip() {
        return tip;
    }

    function showTip() {

    }

    function setAlpha(_alpha) {
        alpha = _alpha;
    }

    function setPos() { // only for objects with change pos to update tip: Others, Hero
        xMiniMapObject = objRef.d.x;
        yMiniMapObject = objRef.d.y;
    }

    function getRef() {
        return objRef;
    }

    function setKind(_kind) {
        kind = _kind;
    }

    function getKind() {
        return kind;
    }

    function setBelongType(type) {
        belongType = type
    }

    function checkVisible() {

        if (!belongType) return false;

        return Engine.miniMapController.handHeldMiniMapController.canUpdate(belongType, kind) ? true : false;
    }

    function remove() {
        if (belongType != null) removeMapObjectFromCords();
        if (belongType != null) deleteFromBelongList();
    }

    function addMapObjectToCords() {
        let miniMapTipController = Engine.miniMapController.handHeldMiniMapController.getMiniMapTipController();

        //if (objRef.d.x == 29 && objRef.d.y == 23) debugger;

        let id = getIdFromObjRef();
        //if (id == null) return;

        if (!isset(objRef.d.x) || !isset(objRef.d.x)) {
            errorReport(moduleData.fileName, "addMapObjectToCords", "objRef.d.x || objRef.d.x not exist!", objRef);
        }

        miniMapTipController.addToCords(objRef.d.x, objRef.d.y, belongType, id);
    }

    function updateMapObjectInCords() {
        let miniMapTipController = Engine.miniMapController.handHeldMiniMapController.getMiniMapTipController();

        let id = getIdFromObjRef();
        //if (id == null) return;


        miniMapTipController.removeFromCords(xMiniMapObject, yMiniMapObject, belongType, id);
        miniMapTipController.addToCords(objRef.d.x, objRef.d.y, belongType, id);

    }

    function removeMapObjectFromCords() {
        let miniMapTipController = Engine.miniMapController.handHeldMiniMapController.getMiniMapTipController();

        let id = getIdFromObjRef();
        //if (id == null) return;

        miniMapTipController.removeFromCords(objRef.d.x, objRef.d.y, belongType, id);
    }

    function addToBelongList(type) {
        setBelongType(type);
        let objController = Engine.miniMapController.handHeldMiniMapController.getObjectController(belongType);
        let id;

        switch (type) {
            case HandHeldMiniMapData.TYPE.NPC:
            case HandHeldMiniMapData.TYPE.OTHER:
            case HandHeldMiniMapData.TYPE.ITEM:
            case HandHeldMiniMapData.TYPE.RIP:
            case HandHeldMiniMapData.TYPE.RESP:
                id = objRef.d.id;
                break;
            case HandHeldMiniMapData.TYPE.GATEWAY:
                id = objRef.d.affectedId;
                break;
            default:
                errorReport(moduleData.fileName, "addToBelongList", "type not exist", type);
        }

        objController.addToList(kind, id)
    }

    function getIdFromObjRef() {
        let id;

        //if (!belongType) return null;  // npc with level lower than miniMap min-level option not have belongType

        switch (belongType) {
            case HandHeldMiniMapData.TYPE.NPC:
            case HandHeldMiniMapData.TYPE.HERO:
            case HandHeldMiniMapData.TYPE.OTHER:
            case HandHeldMiniMapData.TYPE.ITEM:
            case HandHeldMiniMapData.TYPE.RIP:
            case HandHeldMiniMapData.TYPE.RESP:
                id = objRef.d.id;
                break;
            case HandHeldMiniMapData.TYPE.GATEWAY:
                id = objRef.d.affectedId;
                break;
            default:
                console.error('incorrect type', belongType);
        }

        return id;
    }

    function deleteFromBelongList() {

        let objController = Engine.miniMapController.handHeldMiniMapController.getObjectController(belongType);

        let id = getIdFromObjRef();
        //if (id == null) return;

        objController.deleteFromList(kind, id);
        setBelongType(null, null);
    }

    function setShape() {
        shape = Engine.miniMapController.handHeldMiniMapController.getShapeByKind(kind);
    }

    function setColor() {
        color = Engine.miniMapController.handHeldMiniMapController.getColorByKind(kind);
    }

    function draw(ctx, dt) {
        if (!objRef) return;

        if (!Engine.rajCharacterHide.checkDisplayOnMiniMap(objRef)) return;

        let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;
        let handHeldMiniMapWindow = handHeldMiniMapController.getHandHeldMiniMapWindow();

        //let scale             = handHeldMiniMapWindow.getScale();
        let margin = handHeldMiniMapWindow.getMargin();
        let squareData = handHeldMiniMapWindow.getSquareData();

        setImageObject(squareData);

        updateImageObject(dt);
        drawImageObject(ctx, margin, squareData);
    }

    function setImageObject(squareData) {
        if (!imageObject) {

            let minSize = squareData.minSize;
            let _imageObject = getImageObjectFromCache(minSize);

            switch (shape) {
                case HandHeldMiniMapData.STATIC_ICONS.SQUARE:


                    if (_imageObject) imageObject = _imageObject;
                    else {
                        imageObject = getSquareImageObject(squareData);
                        addImageObjectToCache(imageObject, minSize)
                    }

                    break;
                case HandHeldMiniMapData.STATIC_ICONS.CIRCLE:

                    if (_imageObject) imageObject = _imageObject;
                    else {
                        imageObject = getCircleImageObject(squareData);
                        addImageObjectToCache(imageObject, minSize)
                    }

                    break;
                case HandHeldMiniMapData.STATIC_ICONS.RHOMB:

                    if (_imageObject) imageObject = _imageObject;
                    else {
                        imageObject = getRhombImageObject(squareData);
                        addImageObjectToCache(imageObject, minSize)
                    }

                    //additionalMargin  = squareData.minSize * 0.1;
                    break
            }
        }
    }

    function getGradient(ctx, objectSize) {

        let grd = ctx.createRadialGradient(
            0, 0,
            0,
            0, 0,
            Math.round(objectSize - objectSize * 0.4)
        );

        grd.addColorStop(0, "white");
        grd.addColorStop(1, color);

        return grd;
    }

    function setShadowBlur(ctx) {
        //ctx.shadowOffsetX  = 1;
        //ctx.shadowOffsetY  = 1;
        //ctx.shadowBlur     = 1;
        //ctx.shadowColor    = "black";
    }

    function updateImageObject(dt) {
        if (alpha != null) updateAlpha(dt);
    }

    function updateAlpha(dt) {
        sinVal += dt * 3;

        if (sinVal > 3.14) sinVal = 0;

        alpha = Math.round(Math.sin(sinVal) * 100) / 100;
    }

    function drawImageObject(ctx, margin, squareData) {

        if (!imageObject) return;

        let normalSquareSize = squareData.normalSize;
        let oneSquareMargin = squareData.margin;

        if (alpha != null) ctx.globalAlpha = alpha;

        ctx.drawImage(
            imageObject,
            Math.round(objRef.rx * normalSquareSize + margin.left - oneSquareMargin - additionalMargin),
            Math.round(objRef.ry * normalSquareSize + margin.top - oneSquareMargin - additionalMargin)
        );

        if (alpha != null) ctx.globalAlpha = 1;

    }

    function newdrawImageObject(ctx, margin, squareData) {

        if (!imageObject) return;

        let normalSquareSize = squareData.normalSize;
        let oneSquareMargin = squareData.margin;

        if (alpha != null) ctx.globalAlpha = alpha;
        let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;
        let handHeldMiniMapWindow = handHeldMiniMapController.getHandHeldMiniMapWindow();

        // let minSquare = handHeldMiniMapWindow.getNewMinSquare();

        let offset = handHeldMiniMapWindow.getNewOffset();
        let left = objRef.rx * HandHeldMiniMapData.MIN_SQUARE + offset[0]
        let top = objRef.ry * HandHeldMiniMapData.MIN_SQUARE + offset[1]

        ctx.drawImage(
            imageObject,
            left,
            top
        );

        if (alpha != null) ctx.globalAlpha = 1;

    }

    function drawWarShadowOld(ctx) {

        let handHeldMiniMapWindow = Engine.miniMapController.handHeldMiniMapController.getHandHeldMiniMapWindow();
        let margin = handHeldMiniMapWindow.getMargin();
        let squareData = handHeldMiniMapWindow.getSquareData();
        let range = Engine.warShadow.warRangeAndMargin - 1;
        let normalSquareSize = squareData.normalSize;

        let halfSize = range * normalSquareSize - normalSquareSize;
        let size = 2 * halfSize + normalSquareSize;

        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#a6d500';
        ctx.strokeRect(
            objRef.rx * normalSquareSize + margin.left - halfSize,
            objRef.ry * normalSquareSize + margin.top - halfSize,
            size,
            size
        );
        ctx.restore();

    }

    function drawWarShadow(ctx) {

        let handHeldMiniMapWindow = Engine.miniMapController.handHeldMiniMapController.getHandHeldMiniMapWindow();
        let margin = handHeldMiniMapWindow.getMargin();
        let squareData = handHeldMiniMapWindow.getSquareData();
        let warShadowRange = Engine.warShadow.warRangeAndMargin - 2;
        let normalSquareSize = squareData.normalSize;

        //let leftMin   = objRef.rx * normalSquareSize + margin.left - warShadowRange * normalSquareSize;
        //let topMin    = objRef.ry * normalSquareSize + margin.top  - warShadowRange * normalSquareSize;

        //let leftMax   = leftMin  + warShadowRange * normalSquareSize * 2 + normalSquareSize;
        //let topMax    = topMin + warShadowRange * normalSquareSize * 2 + normalSquareSize;

        let leftMin = Math.max(0, objRef.rx - warShadowRange) * normalSquareSize + margin.left;
        let topMin = Math.max(0, objRef.ry - warShadowRange) * normalSquareSize + margin.top;

        let leftMax = Math.min(Engine.map.size.x, objRef.rx + warShadowRange + 1) * normalSquareSize + margin.left;
        let topMax = Math.min(Engine.map.size.y, objRef.ry + warShadowRange + 1) * normalSquareSize + margin.top;

        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#a6d500';
        ctx.beginPath();
        ctx.moveTo(leftMin, topMin);
        ctx.lineTo(leftMax, topMin);
        ctx.lineTo(leftMax, topMax);
        ctx.lineTo(leftMin, topMax);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

    }

    function clearImageObject() {
        imageObject = null;
    }

    function getImageObjectFromCache(sizeImageObject) {
        let imageObjectController = Engine.miniMapController.handHeldMiniMapController.getImageObjectController();

        let exist = imageObjectController.checkImageObjectExist(shape, sizeImageObject, color);

        if (exist) return imageObjectController.getImageObject(shape, sizeImageObject, color);

        return null;
    }

    function addImageObjectToCache(image, sizeImageObject) {
        let imageObjectController = Engine.miniMapController.handHeldMiniMapController.getImageObjectController();

        //console.log(shape, sizeImageObject, color)

        imageObjectController.addImageObject(image, shape, sizeImageObject, color);
    }

    function getSquareImageObject(squareData) {
        let _canvas = document.createElement('canvas');
        let ctx = _canvas.getContext('2d');

        let minOneSquare = squareData.minSize;

        _canvas.width = minOneSquare + 5;
        _canvas.height = minOneSquare + 5;

        ctx.save();

        ctx.fillStyle = getGradient(ctx, _canvas.width);

        ctx.fillRect(
            0,
            0,
            minOneSquare,
            minOneSquare
        );

        setShadowBlur(ctx);

        ctx.restore();

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';

        ctx.strokeRect(
            0,
            0,
            minOneSquare,
            minOneSquare
        );


        return _canvas;
    }

    function getCircleImageObject(squareData) {
        let _canvas = document.createElement('canvas');
        let ctx = _canvas.getContext('2d');

        let minOneSquare = squareData.minSize;

        _canvas.width = minOneSquare + 5;
        _canvas.height = minOneSquare + 5;

        let halfMinSquareSize = squareData.halfMinSize;

        ctx.fillStyle = getGradient(ctx, _canvas.width);

        ctx.save();

        setShadowBlur(ctx);

        ctx.beginPath();
        ctx.arc(
            halfMinSquareSize,
            halfMinSquareSize,
            halfMinSquareSize, 0, 2 * Math.PI, false
        );
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(
            halfMinSquareSize,
            halfMinSquareSize,
            halfMinSquareSize, 0, 2 * Math.PI, false
        );
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();

        return _canvas;
    }

    function getRhombImageObject(squareData) {
        let _canvas = document.createElement('canvas');
        let ctx = _canvas.getContext('2d');

        let oneSquareMargin = squareData.margin;
        let minOneSquare = squareData.minSize;

        let _minOneSquare = Math.round(minOneSquare + oneSquareMargin);
        let half_MinOneSquare = Math.round(_minOneSquare / 2);

        _canvas.width = _minOneSquare + 5;
        _canvas.height = _minOneSquare + 5;


        ctx.save();
        ctx.fillStyle = getGradient(ctx, _minOneSquare);

        setShadowBlur(ctx);

        ctx.beginPath();
        ctx.moveTo(half_MinOneSquare, 0);
        ctx.lineTo(_minOneSquare, half_MinOneSquare);
        ctx.lineTo(half_MinOneSquare, _minOneSquare);
        ctx.lineTo(0, half_MinOneSquare);
        ctx.closePath();

        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.moveTo(half_MinOneSquare, 0);
        ctx.lineTo(_minOneSquare, half_MinOneSquare);
        ctx.lineTo(half_MinOneSquare, _minOneSquare);
        ctx.lineTo(0, half_MinOneSquare);
        ctx.closePath();

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();


        return _canvas;
    }

    function getRhombImageObject2(squareData) {
        let _canvas = document.createElement('canvas');
        let ctx = _canvas.getContext('2d');

        let oneSquareMargin = squareData.margin;
        let minOneSquare = squareData.minSize * 1.2;

        let _minOneSquare = Math.round(minOneSquare + oneSquareMargin);
        let half_MinOneSquare = Math.round(_minOneSquare / 2);

        _canvas.width = _minOneSquare + 5;
        _canvas.height = _minOneSquare + 5;

        //ctx.translate(
        //	half_MinOneSquare - oneSquareMargin,
        //	-oneSquareMargin
        //);

        ctx.save();
        ctx.fillStyle = getGradient(ctx, _minOneSquare);

        setShadowBlur(ctx);

        let transX = 0;
        let transY = 0;

        ctx.beginPath();
        ctx.moveTo(0 + transX, half_MinOneSquare + transY);
        ctx.lineTo(half_MinOneSquare + transX, 0 + transY);
        ctx.lineTo(_minOneSquare + transX, half_MinOneSquare + transY);
        ctx.lineTo(half_MinOneSquare + transX, _minOneSquare + transY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();


        //ctx.beginPath();
        //ctx.moveTo(0, 0);
        //ctx.lineTo(half_MinOneSquare, half_MinOneSquare);
        //ctx.lineTo(0, _minOneSquare);
        //ctx.lineTo(-half_MinOneSquare, half_MinOneSquare);
        //ctx.closePath();
        //
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();


        return _canvas;
    }

    this.remove = remove;
    this.addToBelongList = addToBelongList;
    this.deleteFromBelongList = deleteFromBelongList;
    this.setRef = setRef;
    this.setTip = setTip;
    this.getTip = getTip;
    this.checkCanShowTip = checkCanShowTip;
    this.setAlpha = setAlpha;
    this.getRef = getRef;
    this.draw = draw;
    this.drawWarShadow = drawWarShadow;
    this.setKind = setKind;
    this.getKind = getKind;
    this.setColor = setColor;
    this.setShape = setShape;

    this.clearImageObject = clearImageObject;

    this.checkVisible = checkVisible;
    this.setBelongType = setBelongType;
    this.addMapObjectToCords = addMapObjectToCords;
    this.updateMapObjectInCords = updateMapObjectInCords;
    this.setPos = setPos;
    this.removeMapObjectFromCords = removeMapObjectFromCords;

};