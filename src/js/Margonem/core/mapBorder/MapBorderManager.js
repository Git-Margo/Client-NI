let MapBorderData = require('@core/mapBorder/MapBorderData');
let MapBorder = require('@core/mapBorder/MapBorder');

module.exports = function() {

    const moduleData = {
        fileName: "MapBorderManager.js"
    };

    //let cornerImage     = null;
    //let middleImage     = null;
    //let ready           = false;
    //let borderToDraw    = null;
    let mapBorderList = null;
    //let alwaysDraw      = null;

    const init = () => {
        //setAlwaysDraw(true);
        //clearBorderToDraw();
        //initCornverImage();
        //initMiddleImage();
        clearMapBorderList();
    };

    const clearMapBorderList = () => {
        mapBorderList = {};
    };

    const addToMapBorderList = (id, mapBorder) => {
        mapBorderList[id] = mapBorder;
    };

    const removeFromMapBorderList = (id) => {
        delete mapBorderList[id]
    };

    const checkMapBorderList = (id) => {
        return mapBorderList[id] ? true : false
    };

    //const getOrder = () => {
    //    return getEngine().renderer.getQuestMapOrderWithoutSort();
    //};

    //const initCornverImage = () => {
    //    let path    = CFG.oimg + "/questMapBorder/questMapCornerBorder.png";
    //    getEngine().imgLoader.onload(path, null, null, (_cornerImage) => {
    //        cornerImage = _cornerImage;
    //    });
    //};

    //const initMiddleImage = () => {
    //    let path    = CFG.oimg + "/questMapBorder/questMapMiddleBorder.png";
    //    getEngine().imgLoader.onload(path, null, null, (_middleImage) => {
    //        middleImage = _middleImage;
    //    });
    //};

    //const createCanvasData = () => {
    //    let canvas      = document.createElement("canvas");
    //    let ctx         = canvas.getContext("2d");
    //    return {canvas: canvas, ctx: ctx};
    //};

    //const prepareBorderCanvas = (color) => {
    //    if (!cornerImage || !middleImage) {
    //        setTimeout(() => {
    //            prepareBorderCanvas(color);
    //        }, 500);
    //        return
    //    }
    //
    //    let size                        = getEngine().map.size;
    //
    //    drawBorder(color, 0, 0, size.x, size.y);
    //    //drawBorder(color, 2, 2, 20, 20);
    //};

    //const drawBorder = (color) => {
    //    let cornerImageWidth            = cornerImage.width;
    //    let cornerImageHeight           = cornerImage.height;
    //    let size                        = getEngine().map.size;
    //    let mapWidth                    = size.x * CFG.tileSize;
    //    let mapHeight                   = size.y * CFG.tileSize;
    //    let middleHorizontalWidth       = mapWidth - cornerImageWidth * 2;
    //    let middleVerticalWidth         = mapHeight - cornerImageWidth * 2;
    //    let _middleHorizontalWidth      = mapWidth - cornerImageWidth;
    //    let _middleVerticalWidth        = mapHeight - cornerImageWidth;
    //
    //
    //    //let color = {r: 255,g:0,b:100};
    //
    //    let horizontalBorder   = drawPartOfBorder(middleHorizontalWidth);
    //    let verticalBorder     = drawPartOfBorder(middleVerticalWidth);
    //
    //    let e0 = drawOneElement(horizontalBorder, 0,                        0,                      horizontalBorder.width, horizontalBorder.height,    0,   0,                         0,                      color);
    //    let e1 = drawOneElement(verticalBorder,   _middleHorizontalWidth,   0,                      verticalBorder.height,  verticalBorder.width,       90,  cornerImageHeight,         0,                      color);
    //
    //    let e2 = drawOneElement(horizontalBorder, cornerImageWidth,         _middleVerticalWidth,   horizontalBorder.width, horizontalBorder.height,    180, horizontalBorder.width,    cornerImageHeight,      color);
    //    let e3 = drawOneElement(verticalBorder,   0,                        cornerImageHeight,      verticalBorder.height,  verticalBorder.width,       270, 0,                         verticalBorder.width,   color);
    //
    //    borderToDraw.push(e0);
    //    borderToDraw.push(e1);
    //
    //    borderToDraw.push(e2);
    //    borderToDraw.push(e3);
    //
    //
    //    let bckColor = color ? [color.r, color.g, color.b] : [0,0,0];
    //
    //    getEngine().map.setBackgroundColor(bckColor);
    //
    //    ready = true;
    //};

    //const drawOneElement = (partOfBorder, x, y, width, height, angle, translateX, translateY, color) => {
    //    let canvasData      = createCanvasData();
    //    let canvas          = canvasData.canvas;
    //    let ctx             = canvasData.ctx;
    //
    //    canvas.width        = width;
    //    canvas.height       = height;
    //
    //    if (color) {
    //        ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    //        ctx.fillRect(0, 0, canvas.width, canvas.height);
    //    }
    //
    //    ctx.save();
    //    ctx.translate(translateX, translateY);
    //    ctx.rotate(angle * Math.PI / 180);
    //
    //    if (color) ctx.globalCompositeOperation = "destination-in";
    //
    //    ctx.drawImage(partOfBorder, 0, 0);
    //    ctx.restore();
    //
    //    return {
    //        x   : x,
    //        y   : y,
    //        img : canvas
    //    }
    //};
    //
    //const drawPartOfBorder = (middleGraphicWidth) => {
    //    let cornerImageWidth            = cornerImage.width;
    //    let cornerImageHeight           = cornerImage.height;
    //    let middleImageHeight           = middleImage.height;
    //    let canvasData                  = createCanvasData();
    //    let ctx                         = canvasData.ctx;
    //
    //    canvasData.canvas.width     = cornerImageWidth + middleGraphicWidth;
    //    canvasData.canvas.height    = cornerImageHeight;
    //
    //    ctx.fillStyle = ctx.createPattern(middleImage, "repeat");
    //
    //    ctx.drawImage(cornerImage, 0, 0);
    //    ctx.rect(cornerImageWidth, 0, middleGraphicWidth, middleImageHeight);
    //    ctx.fill();
    //
    //    return canvasData.canvas;
    //};

    //const draw = (ctx) => {
    //    if (!ready) return;
    //
    //    let mapShift 	= getEngine().mapShift.getShift();
    //    let mapOffset   = getEngine().map.offset;
    //
    //    for (let i = 0; i < borderToDraw.length; i++) {
    //        let e = borderToDraw[i];
    //
    //        let left  = e.x - mapOffset[0] - mapShift[0];
    //        let top   = e.y - mapOffset[1] - mapShift[1];
    //
    //        ctx.drawImage(e.img, Math.round(left), Math.round(top));
    //    }
    //
    //};

    const updateData = (data) => {

        if (!checkData(data)) {
            return
        }

        const ACTION = MapBorderData.ACTION;

        switch (data.action) {
            case ACTION.CREATE:
                createProcedure(data);
                break;
            case ACTION.REMOVE:
                removeProcedure(data);
                break;
        }
    };

    const createProcedure = (data) => {
        const FILE_NAME = moduleData.fileName;
        const FUNC = "createProcedure";

        let id = data.id;

        if (checkMapBorderList(data.id)) {
            errorReport(FILE_NAME, FUNC, `object with id ${id} exist!`, data);
            return
        }

        createMapBorder(data);
    };

    const createMapBorder = (data) => {
        let mapBorder = new MapBorder();
        let imageUrl = getImageUrlByKind(data.kind);
        let order = getOrderByKind(data.kind);

        addToMapBorderList(data.id, mapBorder);

        mapBorder.init();
        mapBorder.updateData(data.id, data.kind, data.color, order, imageUrl.cornerImageUrl, imageUrl.middleImageUrl, data.startX, data.startY, data.endX, data.endY);
    }

    const getOrderByKind = (kind) => {
        const KIND = MapBorderData.KIND;
        const renderer = getEngine().renderer;

        switch (kind) {
            case KIND.QUEST_MAP:
                return renderer.getQuestMapOrderWithoutSort();
            case KIND.QUEST_TRACKING_AREA:
                return renderer.getMapBorderOrderWithoutSort();
        }
    };

    const getImageUrlByKind = (kind) => {
        const KIND = MapBorderData.KIND;

        switch (kind) {
            case KIND.QUEST_MAP:
                return {
                    cornerImageUrl: CFG.oimg + "/questMapBorder/questMapCornerBorder.png",
                        middleImageUrl: CFG.oimg + "/questMapBorder/questMapMiddleBorder.png"
                };
                break;
            case KIND.QUEST_TRACKING_AREA:
                return {
                    cornerImageUrl: CFG.oimg + "/questMapBorder/questTrackingCornerBorder.png",
                        middleImageUrl: CFG.oimg + "/questMapBorder/questTrackingMiddleBorder.png"
                };
                break;
        }
    };

    const removeProcedure = (data) => {
        const FILE_NAME = moduleData.fileName;
        const FUNC = "removeProcedure";

        let id = data.id;

        if (!checkMapBorderList(id)) {
            errorReport(FILE_NAME, FUNC, `object with id ${id} not exist!`, data);
            return
        }

        removeMapBorder(id);
    };

    const removeMapBorder = (id) => {
        removeFromMapBorderList(id);
    }

    const checkData = (data) => {
        const FUNC = "checkData";
        const FILE_NAME = moduleData.fileName;
        const ACTION = MapBorderData.ACTION;
        const KIND = MapBorderData.KIND;


        if (!elementIsObject(data)) {
            errorReport(FILE_NAME, FUNC, "data is not object!", data);
            return false
        }

        if (!isset(data.action)) {
            errorReport(FILE_NAME, FUNC, "attr action not exist!", data);
            return false
        }

        if (!isset(data.id)) {
            errorReport(FILE_NAME, FUNC, "attr id not exist!", data);
            return false
        }

        if (![ACTION.CREATE, ACTION.REMOVE].includes(data.action)) {
            errorReport(FILE_NAME, FUNC, "action not registered!", data);
            return false
        }

        if (data.action == ACTION.REMOVE) {
            return true
        }

        if (!isset(data.kind)) {
            errorReport(FILE_NAME, FUNC, "attr kind not exist!", data);
            return false
        }

        //if (![KIND.QUEST_MAP, KIND.QUEST_TRACKING_AREA].includes(data.kind)) {
        if (!checkAvailableKind(data.kind)) {
            errorReport(FILE_NAME, FUNC, "kind not registered!", data);
            return false
        }

        //if (!isset(data.color)) {
        //    errorReport(FILE_NAME, FUNC, "attr color not exist!", data);
        //    return false
        //}

        if (!isset(data.startX)) {
            errorReport(FILE_NAME, FUNC, "attr startX not exist!", data);
            return false
        }

        if (!isset(data.startY)) {
            errorReport(FILE_NAME, FUNC, "attr startY not exist!", data);
            return false
        }

        if (!isset(data.endX)) {
            errorReport(FILE_NAME, FUNC, "attr endX not exist!", data);
            return false
        }

        if (!isset(data.endY)) {
            errorReport(FILE_NAME, FUNC, "attr endY not exist!", data);
            return false
        }

        if (data.color && !checkRGBObject(FILE_NAME, FUNC, data.color, data)) {
            return false
        }

        return true;
    };

    const onClear = () => {
        clearMapBorderList();
        clearFilterBackground();
        setFilterBackground({
            r: 57,
            g: 37,
            b: 83
        });
    };

    const setFilterBackground = (color) => {

        let filterMapNight = getEngine().interface.get$interfaceLayer().find(".filter-map-night")

        if (filterMapNight.css('display') == "block") {
            return;
        }

        filterMapNight.css({
            'display': "block",
            'background': `rgba(${color.r},${color.g},${color.b},1)`
        });
    };

    const clearFilterBackground = () => {
        let filterBackground = getEngine().interface.get$interfaceLayer().find(".filter-map-fog");

        if (filterBackground.css('display') == "none") return;

        filterBackground.css('display', "none");

    };

    const getDrawableList = () => {
        let a = [];

        if (lengthObject(mapBorderList) == 0) {
            return a;
        }

        for (let k in mapBorderList) {
            a.push(mapBorderList[k]);
        }

        return a;
    };

    const checkAvailableKind = (kind) => {
        const KIND = MapBorderData.KIND;

        return KIND[kind] ? true : false;
    };

    const clearByKind = (kind) => {

        if (!checkAvailableKind(kind)) {
            errorReport(moduleData.fileName, "clearByKind", `kind ${kind} not exist!}`);
            return false
        }

        for (let id in mapBorderList) {
            let mapBorder = mapBorderList[id];
            let mapBorderKind = mapBorder.getKind(kind);

            if (mapBorderKind == kind) {
                removeMapBorder(id);
            }

        }

        if (kind == MapBorderData.KIND.QUEST_MAP) {
            clearFilterBackground();
            setFilterBackground({
                r: 57,
                g: 37,
                b: 83
            });
        }
    };

    this.clearByKind = clearByKind;
    this.getDrawableList = getDrawableList;
    this.init = init;
    this.onClear = onClear;
    this.updateData = updateData;

};

/*
getEngine().mapBorderManager.updateData({
    id 		: "QUEST_TRACKING_AREA_0",
    action 	: "CREATE",
    kind	: "QUEST_TRACKING_AREA",
    startX 	: 5,
    startY 	: 5,
    endX   	: 20,
    endY   	: 20,
    color: {
        r: 25,
        g: 131,
        b: 157
    }
});



 getEngine().mapBorderManager.updateData({
 id 		: "QUEST_TRACKING_AREA_2",
 action 	: "CREATE",
 kind	: "QUEST_TRACKING_AREA",
 startX 	: 28,
 startY 	: 8,
 endX   	: 35,
 endY   	: 15

    */