module.exports = function() {
    let opacity;
    //let fw;
    //let fh;
    let img;
    let xPos;
    let yPos;
    let enabled;
    let tip;
    let ready;
    let objectParent;
    let src;
    let defaultSrc = '/img/glow-blue.png';
    //this.alwaysDraw = true;
    let alwaysDraw;

    const init = function() {
        setAlwaysDraw(true);
    };

    const loadImage = () => {
        Engine.imgLoader.onload(src, false, false,
            (i) => {
                img = i;
                setReady(true)
            }
        );
    }

    const setSrc = (v) => {
        src = v;
    };

    const updateData = (_objectParent, lookAt, _tip, _src) => {
        setObjectParent(_objectParent);
        setPosition(lookAt.x, lookAt.y);
        setTip(_tip);

        if (_src) setSrc(_src);
        else setSrc(defaultSrc);

        loadImage();
        setOpacity(1);
    };

    const setPosition = function(x, y) {
        xPos = parseInt(x);
        yPos = parseInt(y);
    };

    const setEnabled = function(state) {
        enabled = state;
    };

    const setReady = function(state) {
        ready = state;
    };

    const setTip = function(val) {
        tip = val;
    };

    const setOpacity = function(val) {
        opacity = val;
    };

    const getOrder = function() {
        return Math.max(yPos - 0.1, 0);
        //return yPos;
    };

    const setObjectParent = (_objectParent) => {
        objectParent = _objectParent;
    }

    const update = () => {
        let _opacity;

        if (isDefaultSrc()) {
            let parentX = objectParent.getRX();
            let parentY = objectParent.getRY();
            //let distance    = getDistance(parentX, parentY, xPos, yPos);
            let distance = getEuclideanDistance(parentX, parentY, xPos, yPos);
            _opacity = calculateFade(distance);
        } else {
            _opacity = 1;
        }

        setOpacity(_opacity);
    };

    const calculateFade = (distance, npc = true) => {
        const
            multiplier = npc ? 16 : 48,
            min = 50,
            max = 130,
            d2 = Math.min(max, multiplier * distance),
            range = max - min,
            tdist = d2 - max + range;

        let v = tdist >= range ? 1 : (tdist <= 0 ? 0 : tdist / range);

        return 1 - v;
    };

    //const getDistance = (aX, aY, bX, bY) => {
    //    let dx = aX - bX;
    //    let dy = aY - bY;
    //
    //    return Math.sqrt(Math.pow(dx,2) + Math.pow(dy, 2));
    //};

    const draw = function(ctx) {
        if (!ready) return;

        if (!enabled) return;

        let tileSize = CFG.tileSize;
        let halfTileSize = CFG.halfTileSize;
        let offset = getEngine().map.offset;
        let fw = img.width;
        let fh = img.height;

        let left = xPos * tileSize + halfTileSize - fw / 2 - offset[0];
        let top = yPos * tileSize + 7 - fh + tileSize - offset[1];

        ctx.globalAlpha = opacity;

        left = Math.round(left);
        top = Math.round(top);

        ctx.drawImage(img, 0, 0, fw, fh, left, top, fw, fh);

        ctx.globalAlpha = 1;
    };

    const isDefaultSrc = () => {
        return src == defaultSrc;
    }

    const getAlwaysDraw = () => {
        return alwaysDraw
    };

    const setAlwaysDraw = (_alwaysDraw) => {
        alwaysDraw = _alwaysDraw
    };

    this.getAlwaysDraw = getAlwaysDraw;
    this.setAlwaysDraw = setAlwaysDraw;

    this.init = init;
    this.getOrder = getOrder;
    this.update = update;
    this.updateData = updateData;
    this.setEnabled = setEnabled;
    this.isDefaultSrc = isDefaultSrc;
    this.draw = draw;
};