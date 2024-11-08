let QuestMapBorderData = require('core/questMapBorder/QuestMapBorderData');

module.exports = function() {

    let cornerImage = null;
    let middleImage = null;
    let ready = false;
    let borderToDraw;

    //this.alwaysDraw     = true;
    let alwaysDraw;

    const init = () => {
        setAlwaysDraw(true);
        clearBorderToDraw();
        initCornverImage();
        initMiddleImage();
    };

    const getOrder = () => {
        return getEngine().renderer.getQuestMapOrderWithoutSort();
    };

    const initCornverImage = () => {
        let path = CFG.oimg + "/questMapBorder/questMapCornerBorder.png";
        getEngine().imgLoader.onload(path, null, null, (_cornerImage) => {
            cornerImage = _cornerImage;
        });
    };

    const initMiddleImage = () => {
        let path = CFG.oimg + "/questMapBorder/questMapMiddleBorder.png";
        getEngine().imgLoader.onload(path, null, null, (_middleImage) => {
            middleImage = _middleImage;
        });
    };

    const createCanvasData = () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        return {
            canvas: canvas,
            ctx: ctx
        };
    };

    const prepareBorderCanvas = (color) => {
        if (!cornerImage || !middleImage) {
            setTimeout(() => {
                prepareBorderCanvas(color);
            }, 500);
            return
        }

        drawBorder(color);
    };

    const drawBorder = (color) => {
        let cornerImageWidth = cornerImage.width;
        let cornerImageHeight = cornerImage.height;
        let size = getEngine().map.size;
        let mapWidth = size.x * CFG.tileSize;
        let mapHeight = size.y * CFG.tileSize;
        let middleHorizontalWidth = mapWidth - cornerImageWidth * 2;
        let middleVerticalWidth = mapHeight - cornerImageWidth * 2;
        let _middleHorizontalWidth = mapWidth - cornerImageWidth;
        let _middleVerticalWidth = mapHeight - cornerImageWidth;


        //let color = {r: 255,g:0,b:100};

        let horizontalBorder = drawPartOfBorder(middleHorizontalWidth);
        let verticalBorder = drawPartOfBorder(middleVerticalWidth);

        let e0 = drawOneElement(horizontalBorder, 0, 0, horizontalBorder.width, horizontalBorder.height, 0, 0, 0, color);
        let e1 = drawOneElement(verticalBorder, _middleHorizontalWidth, 0, verticalBorder.height, verticalBorder.width, 90, cornerImageHeight, 0, color);

        let e2 = drawOneElement(horizontalBorder, cornerImageWidth, _middleVerticalWidth, horizontalBorder.width, horizontalBorder.height, 180, horizontalBorder.width, cornerImageHeight, color);
        let e3 = drawOneElement(verticalBorder, 0, cornerImageHeight, verticalBorder.height, verticalBorder.width, 270, 0, verticalBorder.width, color);

        borderToDraw.push(e0);
        borderToDraw.push(e1);

        borderToDraw.push(e2);
        borderToDraw.push(e3);


        let bckColor = color ? [color.r, color.g, color.b] : [0, 0, 0];

        getEngine().map.setBackgroundColor(bckColor);

        ready = true;
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

    const draw = (ctx) => {
        if (!ready) return;

        let mapShift = getEngine().mapShift.getShift();
        let mapOffset = getEngine().map.offset;

        for (let i = 0; i < borderToDraw.length; i++) {
            let e = borderToDraw[i];

            let left = e.x - mapOffset[0] - mapShift[0];
            let top = e.y - mapOffset[1] - mapShift[1];

            ctx.drawImage(e.img, Math.round(left), Math.round(top));
        }

    };

    const updateData = () => {

    };

    const clearBorderToDraw = () => {
        borderToDraw = [];
    };

    const onClear = () => {
        clearBorderToDraw();
        clearFilterBackground();
        setFilterBackground({
            r: 57,
            g: 37,
            b: 83
        });
    };

    const setFilterBackground = (color) => {

        //let stringNightColor 	= getCalculateStringNightColor();
        //let strColor 			= `rgba(${stringNightColor})`;

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

    }

    const getDrawableList = () => {
        return [this];
    }

    const getAlwaysDraw = () => {
        return alwaysDraw
    };

    const setAlwaysDraw = (_alwaysDraw) => {
        alwaysDraw = _alwaysDraw
    };

    this.getAlwaysDraw = getAlwaysDraw;
    this.setAlwaysDraw = setAlwaysDraw;

    this.getDrawableList = getDrawableList;
    this.getOrder = getOrder;
    this.draw = draw;
    this.init = init;
    this.prepareBorderCanvas = prepareBorderCanvas;
    this.onClear = onClear;

};