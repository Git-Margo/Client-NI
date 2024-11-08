module.exports = function() {

    let activeMapGoMark = false;
    let xMapGoMark = null;
    let yMapGoMark = null;
    let timeMapGoMark = null;
    let markImg = null;

    //this.alwaysDraw     = true;
    let alwaysDraw;

    const init = () => {
        setAlwaysDraw(true);
        initMarkImage();
        clear();
    };

    const initMarkImage = () => {
        getEngine().imgLoader.onload('/img/cross.gif', false, (i) => {
            markImg = i;
        });
    };

    const getOrder = () => {
        return 0.09;
    };

    const update = (dt) => {
        if (!activeMapGoMark) {
            return;
        }

        let time = (new Date()).getTime() - timeMapGoMark;

        if (time > 1000) {
            //setActiveMapGoMark(false);
            clear();
        }
    };

    const draw = (ctx) => {
        if (!activeMapGoMark) {
            return;
        }

        if (!markImg) {
            return
        }

        let offset = getEngine().map.getOffset();
        let tileSize = CFG.tileSize;
        let time = (new Date()).getTime() - timeMapGoMark;
        let v = Math.max(0, 1 - (time / 1000));

        ctx.globalAlpha = v;
        ctx.drawImage(
            markImg,
            Math.round(xMapGoMark * tileSize - offset[0]),
            Math.round(yMapGoMark * tileSize - offset[1])
        );
        ctx.globalAlpha = 1;
    };

    const clear = () => {
        setActiveMapGoMark(false);
        setXMapGoMark(null);
        setYMapGoMark(null);
        setTimeMapGoMark(null);
    };

    const onClear = () => {
        clear();
    };

    const createMapGoMark = (x, y) => {
        setActiveMapGoMark(true);
        setXMapGoMark(x);
        setYMapGoMark(y);
        setTimeMapGoMark((new Date()).getTime());
    };

    const setActiveMapGoMark = (active) => {
        activeMapGoMark = active;
    };

    const setXMapGoMark = (x) => {
        xMapGoMark = x;
    };

    const setYMapGoMark = (y) => {
        yMapGoMark = y;
    };

    const setTimeMapGoMark = (time) => {
        timeMapGoMark = time;
    };


    const getAlwaysDraw = () => {
        return alwaysDraw
    };

    const setAlwaysDraw = (_alwaysDraw) => {
        alwaysDraw = _alwaysDraw
    };

    this.getAlwaysDraw = getAlwaysDraw;
    this.setAlwaysDraw = setAlwaysDraw;

    this.init = init;
    this.update = update;
    this.draw = draw;
    this.onClear = onClear;
    this.createMapGoMark = createMapGoMark;
    this.getOrder = getOrder;

};