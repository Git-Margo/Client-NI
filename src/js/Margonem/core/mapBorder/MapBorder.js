let MapBorderData = require('@core/mapBorder/MapBorderData');

module.exports = function() {

    let alwaysDraw = false;

    let borderToDraw = null;
    let kind = null;
    let order = null;
    let color = null;
    let id = null;
    let ready = false;
    let cornerImageUrl = null;
    let middleImageUrl = null;

    let cornerImage = null;
    let middleImage = null;

    let startX = null;
    let startY = null;
    let endX = null;
    let endY = null;

    const init = () => {
        setAlwaysDraw(true);
        initBorderToDraw();
    };

    const initBorderToDraw = () => {
        borderToDraw = [];
    };

    const updateData = (_id, _kind, _color, _order, _cornerImageUrl, _middleImageUrl, _startX, _startY, _endX, _endY) => {
        setId(_id);
        setKind(_kind);
        setOrder(_order);
        setColor(_color);
        setCornerImageUrl(_cornerImageUrl);
        setMiddleImageUrl(_middleImageUrl);

        setStartX(_startX);
        setStartY(_startY);

        setEndX(_endX);
        setEndY(_endY);

        initCornerImage();
        initMiddleImage();

        prepareBorderCanvas();
    };

    const getOrder = () => {


        return order;
        //return getEngine().renderer.getQuestMapOrderWithoutSort();
        //
        //const KIND = MapBorderData.KIND;
        //
        //switch (kind) {
        //    case KIND.QUEST_MAP:
        //        break;
        //    case KIND.QUEST_TRACKING_AREA:
        //        break;
        //}
    };

    const prepareBorderCanvas = () => {
        if (!cornerImage || !middleImage) {
            setTimeout(() => {
                prepareBorderCanvas(color);
            }, 500);
            return
        }

        //let size                        = getEngine().map.size;

        drawBorder(color, startX, startY, endX, endY);
        //drawBorder(color, 2, 2, 20, 20);
    };

    const drawBorder = (_color, x, y, xDestiny, yDestiny) => {
        let tileSize = CFG.tileSize;
        let cornerImageWidth = cornerImage.width;
        let cornerImageHeight = cornerImage.height;
        let _endX = xDestiny * tileSize;
        let _endY = yDestiny * tileSize;
        let middleHorizontalWidth = _endX - cornerImageWidth * 2 - x * tileSize;
        let middleVerticalWidth = _endY - cornerImageWidth * 2 - y * tileSize;
        let _middleHorizontalWidth = _endX - cornerImageWidth;
        let _middleVerticalWidth = _endY - cornerImageWidth;

        let horizontalBorder = drawPartOfBorder(middleHorizontalWidth);
        let verticalBorder = drawPartOfBorder(middleVerticalWidth);

        x *= tileSize;
        y *= tileSize;


        let e0 = drawOneElement(horizontalBorder, x, y, horizontalBorder.width, horizontalBorder.height, 0, 0, 0, _color);
        let e1 = drawOneElement(verticalBorder, _middleHorizontalWidth, y, verticalBorder.height, verticalBorder.width, 90, cornerImageHeight, 0, _color);

        let e2 = drawOneElement(horizontalBorder, cornerImageWidth + x, _middleVerticalWidth, horizontalBorder.width, horizontalBorder.height, 180, horizontalBorder.width, cornerImageHeight, _color);
        let e3 = drawOneElement(verticalBorder, x, cornerImageHeight + y, verticalBorder.height, verticalBorder.width, 270, 0, verticalBorder.width, _color);

        borderToDraw.push(e0);
        borderToDraw.push(e1);

        borderToDraw.push(e2);
        borderToDraw.push(e3);


        let bckColor = _color ? [_color.r, _color.g, _color.b] : [0, 0, 0];

        if (kind == MapBorderData.KIND.QUEST_MAP) {
            getEngine().map.setBackgroundColor(bckColor);
        }

        setReady(true);
    };

    const createCanvasData = () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        return {
            canvas: canvas,
            ctx: ctx
        };
    };

    const drawPartOfBorder = (middleGraphicWidth) => {
        let cornerImageWidth = cornerImage.width;
        let cornerImageHeight = cornerImage.height;
        let middleImageHeight = middleImage.height;
        let canvasData = createCanvasData();
        let ctx = canvasData.ctx;

        canvasData.canvas.width = cornerImageWidth + middleGraphicWidth;
        canvasData.canvas.height = cornerImageHeight;

        ctx.fillStyle = ctx.createPattern(middleImage, "repeat");

        ctx.drawImage(cornerImage, 0, 0);
        ctx.rect(cornerImageWidth, 0, middleGraphicWidth, middleImageHeight);
        ctx.fill();

        return canvasData.canvas;
    };

    const drawOneElement = (partOfBorder, x, y, width, height, angle, translateX, translateY, color) => {
        let canvasData = createCanvasData();
        let canvas = canvasData.canvas;
        let ctx = canvasData.ctx;

        canvas.width = width;
        canvas.height = height;

        if (color) {
            ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.save();
        ctx.translate(translateX, translateY);
        ctx.rotate(angle * Math.PI / 180);

        if (color) ctx.globalCompositeOperation = "destination-in";

        ctx.drawImage(partOfBorder, 0, 0);
        ctx.restore();

        return {
            x: x,
            y: y,
            img: canvas
        }
    };

    const update = () => {

    };

    const draw = (ctx) => {
        if (!ready) return;

        let mapShift = getEngine().mapShift.getShift();
        let mapOffset = getEngine().map.offset;

        for (let i = 0; i < borderToDraw.length; i++) {
            let e = borderToDraw[i];

            let left = Math.round(e.x - mapOffset[0] - mapShift[0]);
            let top = Math.round(e.y - mapOffset[1] - mapShift[1]);

            let clipImg = Engine.map.clipObject(left, top, e.img.width, e.img.height);

            if (!clipImg) {
                continue;
            }

            //ctx.drawImage(e.img, Math.round(left), Math.round(top));
            ctx.drawImage(
                e.img,
                clipImg.backgroundPositionX, clipImg.backgroundPositionY,
                clipImg.width, clipImg.height,
                clipImg.left, clipImg.top,
                clipImg.width, clipImg.height
            );
        }

    };

    const setKind = (_kind) => {
        kind = _kind;
    };

    const setOrder = (_order) => {
        order = _order;
    };

    const setId = (_id) => {
        id = _id;
    };

    const setCornerImageUrl = (_cornerImageUrl) => {
        cornerImageUrl = _cornerImageUrl
    };

    const setMiddleImageUrl = (_middleImageUrl) => {
        middleImageUrl = _middleImageUrl;
    };

    const setReady = (_ready) => {
        ready = _ready;
    }

    const setColor = (_color) => {
        color = _color;
    }

    const setStartX = (_startX) => {
        startX = _startX;
    };

    const setStartY = (_startY) => {
        startY = _startY;
    };

    const setEndX = (_endX) => {
        endX = _endX;
    };

    const setEndY = (_endY) => {
        endY = _endY;
    };

    const initCornerImage = () => {
        getEngine().imgLoader.onload(cornerImageUrl, null, null, (_cornerImage) => {
            cornerImage = _cornerImage;
        });
    };

    const initMiddleImage = () => {
        getEngine().imgLoader.onload(middleImageUrl, null, null, (_middleImage) => {
            middleImage = _middleImage;
        });
    };

    const getAlwaysDraw = () => {
        return alwaysDraw
    };

    const setAlwaysDraw = (_alwaysDraw) => {
        alwaysDraw = _alwaysDraw
    };

    const getKind = () => kind;

    this.getKind = getKind;
    this.getAlwaysDraw = getAlwaysDraw;
    this.setAlwaysDraw = setAlwaysDraw;
    this.init = init;
    this.updateData = updateData;
    this.getOrder = getOrder;
    this.draw = draw;
    this.update = update;

}