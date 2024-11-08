module.exports = function() {

    this.ctx = null;
    this.active = false;
    this.canvas = null;
    this.blink = false;
    this.glow = true;
    this.initialized = false;
    this.shouldDraw = true;

    let framesAmount = 20;
    let timePassed = 0;
    let activeFrame = 0;
    let frameTime = 3.14;
    let increase = true;
    let canvasArray = [];

    this.init = function() {
        //initAllCanvas();
        //clearCanvasObjectToDraw();
    };

    const initAllCanvas = () => {
        for (let i = 0; i != framesAmount; i++) {

            canvasArray.push({
                canvas: document.createElement('canvas'),
                toDraw: null
            })
        }

        setSizeInAllCanvas();
    }

    const getAlpha = () => {
        let diff = 0.05;

        return Math.floor(diff * activeFrame * 100) / 100;
    };

    const setSizeInAllCanvas = () => {
        let gameCanvas = getEngine().interface.get$GAME_CANVAS()[0];

        let w = gameCanvas.width;
        let h = gameCanvas.height;

        for (let k in canvasArray) {
            canvasArray[k].canvas.width = w;
            canvasArray[k].canvas.height = h;
        }
    };

    const clearCanvasObjectToDraw = () => {
        for (let k in canvasArray) {
            canvasArray[k].toDraw = false;
        }
    };

    this.update = (dt) => {
        if (!this.active) {
            return;
        }

        if (!this.blink) {
            return;
        }

        timePassed += dt * 80;

        if (timePassed < frameTime) {
            return
        }

        timePassed = timePassed - frameTime;

        if (increase) activeFrame++;
        else activeFrame--;

        if (activeFrame == 0 || activeFrame + 1 == canvasArray.length) {
            increase = !increase;
        }

    };

    this.draw = () => {
        if (!this.active) return;

        if (this.glow && this.shouldDraw) this.setGlow();
    };

    this.createCanvas = () => {
        this.canvas = document.createElement("canvas");
        this.canvas.id = 'low-health-layer';
        this.canvas.classList.add('low-health-layer');

        let $GAME_CANVAS = getEngine().interface.get$GAME_CANVAS()

        this.setSizeCanvas($GAME_CANVAS.width(), $GAME_CANVAS.height());

        Engine.interface.get$gameLayer().append(this.canvas);

        this.ctx = this.canvas.getContext('2d');
    };

    this.create = () => {
        const c = document.getElementById('low-health-layer');
        if (c) return;

        this.createCanvas();
        //this.setBlink(!Engine.opt(8));
        this.setBlink(isSettingsOptionsInterfaceAnimationOn());

        initAllCanvas();
        clearCanvasObjectToDraw();

        this.initialized = true;

        if (this.isLowHealth()) {
            this.setActive(true);
        }
    };

    this.isLowHealth = () => {
        let mHp = Engine.hero.d.warrior_stats.maxhp;
        let hp = Engine.hero.d.warrior_stats.hp;

        return parseFloat(hp) / parseFloat(mHp) < 0.3;
    };

    this.setBlink = (state) => {
        this.blink = state ? true : false;
    };

    this.setGlow = () => {
        let canvasData = canvasArray[activeFrame];
        let canvas = canvasData.canvas;

        if (!canvasData.toDraw) {
            drawFrameInArray();
        }

        this.clearCanvas();
        this.ctx.drawImage(canvas, 0, 0);
    };

    const drawFrameInArray = () => {
        let canvasData = canvasArray[activeFrame];
        let canvas = canvasData.canvas;
        let ctx = canvas.getContext("2d");
        let left = 0;
        let top = 0;
        let w = canvas.width;
        let h = canvas.height;
        let margin = 120;

        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.beginPath();
        ctx.rect(left - margin, top - margin, w + margin * 2, h + margin * 2);
        ctx.clip();

        ctx.globalAlpha = getAlpha();
        ctx.lineWidth = margin * 2;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = margin;
        ctx.shadowColor = "#b71212";

        ctx.strokeRect(left - margin, top - margin, w + margin * 2, h + margin * 2);
        ctx.restore();

        canvasData.toDraw = true;
    }

    this.onResize = () => {
        setSizeInAllCanvas();
        clearCanvasObjectToDraw();
    };

    this.setActive = (active) => {
        this.active = active;
        if (!active) {
            this.clearCanvas();
        }
    };

    this.getActive = () => {
        return this.active;
    };

    this.clearCanvas = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    this.getCanvas = () => {
        return this.canvas;
    }

    this.setSizeCanvas = (w, h) => {
        if (!this.canvas) {
            return
        }

        this.canvas.width = w;
        this.canvas.height = h;
    }
};