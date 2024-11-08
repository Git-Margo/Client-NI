module.exports = function() {
    var progressBar;
    var rx;
    var ry;
    let widthMargin = 10;
    var width = 70;
    let height = 10;
    var progress = 0;
    var opacity = 1;
    var fadeOutStart = false;

    let helpCanvas = null;
    let helpCtx = null;

    //this.alwaysDraw = true;
    let alwaysDraw;

    this.init = () => {
        setAlwaysDraw(true);
        createHelpCanvas();
    }

    const createHelpCanvas = () => {
        helpCanvas = document.createElement('canvas');
        helpCanvas.width = width + widthMargin;
        helpCanvas.height = height;
        helpCtx = helpCanvas.getContext('2d');
    };

    this.setProgress = function(min, max) {
        progress = (width + 6) - (min / max * (width + 6));
    };

    this.updateData = function(v) {
        if (!progressBar || !rx || !ry) {
            this.setPos();
            opacity = 1;
            Engine.lock.add('progressBar');
            progressBar = true;
        }
        if (v[0] === 0) {
            Engine.lock.remove('progressBar');
            this.fadeOut();
        }
        this.setProgress(v[0], v[1]);
    };

    this.fadeOut = function() {
        if (fadeOutStart) return;
        fadeOutStart = true;
        var interval = setInterval(function() {
            opacity -= 0.05;
            if (opacity < 0.1) {
                progressBar = false;
                fadeOutStart = false;
                clearInterval(interval);
            }
        }, 50);
    };

    this.clear = function() {
        progressBar = false;
    };

    this.getDrawableList = function() {
        if (!progressBar) return;
        return [this];
    };

    this.setPos = function() {
        rx = Engine.hero.rx;
        ry = Engine.hero.ry;
    };

    this.getOrder = function() {
        //return ry + 5;
        return getEngine().renderer.getHighestOrderWithoutSort();
    };

    this.draw = function(ctx) {
        let tileSize = CFG.tileSize;

        let left = rx * tileSize + CFG.halfTileSize - (width + widthMargin) / 2 - Engine.map.offset[0];
        let top = ry * tileSize - tileSize - height - Engine.map.offset[1];

        // helpCtx.clearRect(0,0, helpCanvas.width, helpCanvas.height);

        let _left = 5;
        let _top = 5;

        helpCtx.fillStyle = 'black';
        helpCtx.fillRect(0, 0, helpCanvas.width, helpCanvas.height);

        helpCtx.globalAlpha = opacity;
        helpCtx.beginPath();
        helpCtx.lineCap = "round";
        helpCtx.lineWidth = 10;
        helpCtx.strokeStyle = "white";
        helpCtx.moveTo(_left, _top);
        helpCtx.lineTo(_left + width, _top);
        helpCtx.stroke();

        helpCtx.beginPath();
        helpCtx.lineCap = "round";
        helpCtx.lineWidth = 8;
        helpCtx.strokeStyle = "black";
        helpCtx.moveTo(_left, _top);
        helpCtx.lineTo(_left + width, _top);
        helpCtx.stroke();

        helpCtx.fillStyle = 'green';
        helpCtx.fillRect(_left - 3, _top - 3, progress, 6);
        helpCtx.globalAlpha = 1;

        ctx.drawImage(helpCanvas, left, top);
    };

    const getAlwaysDraw = () => {
        return alwaysDraw
    };

    const setAlwaysDraw = (_alwaysDraw) => {
        alwaysDraw = _alwaysDraw
    };

    this.getAlwaysDraw = getAlwaysDraw;
    this.setAlwaysDraw = setAlwaysDraw;
};