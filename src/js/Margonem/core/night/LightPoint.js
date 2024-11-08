let FloatObjectData = require('core/floatObject/FloatObjectData');
let KindOrderObject = require('core/raj/kindOrderObject/KindOrderObject');

module.exports = function() {

    let x;
    let y;
    let r;
    let offsetX;
    let offsetY;
    let data;

    let cover = false;
    let realXYPos = false;
    let lightImage = null;
    let redrawLightImage = false;

    let xMoveNoise = 0;
    let yMoveNoise = 0;

    //this.alwaysDraw = true;
    let alwaysDraw;

    let kindOrderObject = null;

    const init = (_data, _realXYPos) => {
        setAlwaysDraw(true);
        setX(_data.x);
        setY(_data.y);
        setR(_data.r);
        setData(_data);
        setOffsetX(_data.offsetX);
        setOffsetY(_data.offsetY);
        setOffsetY(_data.offsetY);

        initKindOrderObject(_data);

        if (_realXYPos) setRealXYPos(_realXYPos)

        setRedrawLightImage(false);

        createLightImage();
        prepareLightImage();
    };

    const initKindOrderObject = (_data) => {
        kindOrderObject = new KindOrderObject();
        kindOrderObject.init();

        let order = _data.light && _data.light.order;

        if (order && kindOrderObject.checkCorrectData(order)) {
            kindOrderObject.setOrderData(order);
        }
    }

    const createLightImage = () => {
        lightImage = document.createElement('canvas');
    };

    const prepareLightImage = () => {
        lightImage.width = r * 2;
        lightImage.height = r * 2;

        let left = r;
        let top = r;

        let _ctx = lightImage.getContext('2d');
        let grd = _ctx.createRadialGradient(left, top, 0, left, top, r);

        grd.addColorStop(0, data.stop0);
        grd.addColorStop(1, data.stop1);

        _ctx.fillStyle = grd;
        _ctx.beginPath();
        _ctx.arc(left, top, r, 0, 2 * Math.PI);
        //_ctx.fillRect(r/2, r/2, r, r);
        _ctx.fill();
    };

    const setData = (_data) => {
        data = _data
    }

    const setRealXYPos = (_realXYPos) => {
        realXYPos = _realXYPos;
    };

    const setX = (_x) => {
        x = _x;
    };

    const setY = (_y) => {
        y = _y;
    };

    const setR = (_r) => {
        r = _r;

        setRedrawLightImage(true);
    };

    const setOffsetX = (_offsetX) => {
        offsetX = _offsetX;
    };

    const setOffsetY = (_offsetY) => {
        offsetY = _offsetY;
    };

    const getOrder = () => {
        if (cover) {
            return y - 0.01;
        }

        //return y + 200

        return kindOrderObject.getOrder(y);
    };

    const setCover = (_cover) => {
        cover = _cover;
    };

    const setRedrawLightImage = (state) => {
        redrawLightImage = state;
    }

    //const update = (dt) => {
    //
    //}

    //let rChannelVal = 0;

    const draw = (ctx) => {

        let tileSize = CFG.tileSize;
        let mapShift = Engine.mapShift.getShift();
        let halfTileSize = CFG.halfTileSize;

        //let left    = x * tileSize + tileSize / 2 + offsetX - Engine.map.offset[0] - mapShift[0];
        //let top     = y * tileSize + halfTileSize + offsetY - Engine.map.offset[1] - mapShift[1];

        let left;
        let top;

        if (realXYPos) {
            left = x + offsetX;
            top = y + offsetY;
        } else {
            left = x * tileSize + tileSize / 2 + offsetX - Engine.map.offset[0] - mapShift[0];
            top = y * tileSize + halfTileSize + offsetY - Engine.map.offset[1] - mapShift[1];
        }

        left += xMoveNoise * tileSize;
        top += yMoveNoise * tileSize;

        newDraw(ctx, left, top);
    };

    const newDraw = (ctx, left, top) => {
        left -= r;
        top -= r;


        if (redrawLightImage) {
            prepareLightImage();
            setRedrawLightImage(false)
        }

        let clipImg = Engine.map.clipObject(left, top, lightImage.width, lightImage.height);

        if (clipImg) {
            ctx.drawImage(
                lightImage,
                clipImg.backgroundPositionX, clipImg.backgroundPositionY,
                clipImg.width, clipImg.height,
                clipImg.left, clipImg.top,
                clipImg.width, clipImg.height
            );
        }
    }

    const getColorLightData = () => {
        if (!data.light) return null;

        return data.stop0Data;
    }

    const setColorLightData = (rChannel, gChannel, bChannel, aChannel) => {
        if (!data.light) return null;

        data.stop0Data.r = rChannel;
        data.stop0Data.g = gChannel;
        data.stop0Data.b = bChannel;
        data.stop0Data.a = aChannel;

        data.stop1Data.r = rChannel;
        data.stop1Data.g = gChannel;
        data.stop1Data.b = bChannel;

        setRedrawLightImage(true);
    };

    const refreshColorLightStop = () => {
        data.stop0 = `rgba(${data.stop0Data.r},${data.stop0Data.g},${data.stop0Data.b},${data.stop0Data.a})`;
        data.stop1 = `rgba(${data.stop1Data.r},${data.stop1Data.g},${data.stop1Data.b},0)`;

        setRedrawLightImage(true);
    };

    const setXMoveNoise = (_xMoveNoise) => {
        xMoveNoise = _xMoveNoise
    };

    const setYMoveNoise = (_yMoveNoise) => {
        yMoveNoise = _yMoveNoise
    }

    const getR = () => r;

    const getAlwaysDraw = () => {
        return alwaysDraw
    };

    const setAlwaysDraw = (_alwaysDraw) => {
        alwaysDraw = _alwaysDraw
    };

    this.getAlwaysDraw = getAlwaysDraw;
    this.setAlwaysDraw = setAlwaysDraw;

    this.getOrder = getOrder;
    this.draw = draw;
    this.init = init;
    this.setCover = setCover;
    this.setX = setX;
    this.setY = setY;
    this.setR = setR;
    this.getR = getR;
    this.setXMoveNoise = setXMoveNoise;
    this.setYMoveNoise = setYMoveNoise;
    this.getColorLightData = getColorLightData;
    this.setColorLightData = setColorLightData;
    this.refreshColorLightStop = refreshColorLightStop;
}