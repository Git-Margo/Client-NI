module.exports = function() {

    const moduleData = {
        fileName: "CharacterAura.js"
    };

    let ready = null;
    let parent = null;
    let alwaysDraw = null;

    let xPos = null;
    let yPos = null;

    let img = null;
    let src = null;

    const init = (_parent, srcId) => {
        setParent(_parent)
        setAlwaysDraw(true);

        const srcYellow = '/img/glow-yellow.png';
        const srcRed = '/img/glow-52.png';
        const srcBlue = '/img/glow-blue.png';

        if (!isset(srcId)) setSrc(srcYellow);
        else {
            switch (srcId) {
                case 0:
                    setSrc(srcYellow);
                    break;
                case 1:
                    setSrc(srcRed)
            }
        }

        loadImage();
    };

    const setSrc = (_src) => {
        src = _src;
    }

    const getOrder = () => {
        return parent.getRY() + 0.1;
    };

    const loadImage = () => {
        Engine.imgLoader.onload(src, false, false,
            (i) => {
                img = i;
                setReady(true)
            }
        );
    }

    const setXPos = (_xPos) => {
        xPos = _xPos;
    }

    const setYPos = (_yPos) => {
        yPos = _yPos;
    }

    const update = () => {
        if (!parent) {
            return;
        }

        let parentX = parent.getRX();
        let parentY = parent.getRY();

        setXPos(parentX);
        setYPos(parentY);
    };

    const draw = (ctx) => {
        if (!ready) return;

        //if (!enabled) return;

        let tileSize = CFG.tileSize;
        let halfTileSize = CFG.halfTileSize;
        let offset = getEngine().map.offset;
        let fw = img.width;
        let fh = img.height;

        let left = xPos * tileSize + halfTileSize - fw / 2 - offset[0];
        let top = yPos * tileSize + 7 - fh + tileSize - offset[1];

        //ctx.globalAlpha     = opacity;

        left = Math.round(left);
        top = Math.round(top);

        ctx.drawImage(img, 0, 0, fw, fh, left, top, fw, fh);

        ctx.globalAlpha = 1;
    };

    const getAlwaysDraw = () => {
        return alwaysDraw;
    };

    const setAlwaysDraw = (_alwaysDraw) => {
        alwaysDraw = _alwaysDraw
    };

    const setParent = (_parent) => {
        parent = _parent
    };

    const setReady = (_ready) => {
        ready = _ready
    };

    this.init = init;
    this.getAlwaysDraw = getAlwaysDraw;
    this.draw = draw;
    this.update = update;
    this.getOrder = getOrder;

}