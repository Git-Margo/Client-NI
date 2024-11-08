let CharacterEffectData = require('core/characterEffects/CharacterEffectsData');
let CharacterEffect = require('core/characterEffects/CharacterEffect');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let HeroDirectionData = require('core/characters/HeroDirectionData');
let CharacterEffectsData = require('core/characterEffects/CharacterEffectsData');
let RajObjectInterface = require('core/raj/RajObjectInterface');
let RajData = require('core/raj/RajData');

let TintEffect = function() {

    const moduleData = {
        fileName: "TintEffect.js"
    };

    let ctxTint;
    let canvasTint;
    let drawCanvasTint = false;
    let tintVal;
    let kind;
    let maxTintVal = 3.14;
    let tintAlpha = 0;
    let reachSolid = false;


    const init = (_id, _data) => {
        implementRajInterface();
        this.updateDataRajObject(_data);
        this.initObject(_id, _data);

        initKind();
        createCanvasAndStartAfterMasterLoaded();
    };

    const implementRajInterface = () => {
        (new RajObjectInterface()).implementRajObject(this, RajData.CHARACTER_EFFECT);
    }

    const initKind = () => {
        let data = this.getData();

        let _kind = data.params.kind;

        const KIND = CharacterEffectsData.TINT_KIND;

        if (!isset(_kind)) {
            _kind = KIND.SHOW_AND_HIDE;
        } else {
            switch (_kind) {
                case KIND.SHOW_AND_HIDE:
                    _kind = KIND.SHOW_AND_HIDE;
                    break;
                case KIND.SHOW_AND_STICK:
                    _kind = KIND.SHOW_AND_STICK;
                    break;
                case KIND.HIDE:
                    _kind = KIND.HIDE;
                    break;
                default:
                    errorReport(moduleData.file, "initKind", `Kind ${_kind} not exist!`);
            }
        }

        setKind(_kind);
    };

    const setKind = (_kind) => {
        kind = _kind;
    };

    const createCanvasAndStartAfterMasterLoaded = () => {
        createCanvasTint(() => {
            start();
        });
    };

    const createCanvasTint = (onload) => {
        let master = this.getMaster();

        if (!master) return;

        if (master.canvasObjectType == CanvasObjectTypeData.NPC && !master.onloadProperImg) {
            setTimeout(() => {
                createCanvasTint(onload);
            }, 100);
            return
        }

        canvasTint = document.createElement('canvas');
        ctxTint = canvasTint.getContext('2d');

        canvasTint.width = master.fw;
        canvasTint.height = master.fh;

        this.setFw(master.fw);
        this.setFh(master.fh);

        onload();
    };

    const drawMask = () => {
        let data = this.getData();
        let master = this.getMaster();
        let c = data.params.color;
        var dir = isset(master.dir) ? master.dir : 'S';
        var bgX = master.frame * master.fw;
        let bgY = null;


        switch (dir) {
            case HeroDirectionData.S:
                bgY = 0;
                break;
            case HeroDirectionData.W:
                bgY = master.fh;
                break;
            case HeroDirectionData.E:
                bgY = master.fh * 2;
                break;
            case HeroDirectionData.N:
                bgY = master.fh * 3;
                break;
        }

        bgY += master.activeFrame * master.fh;

        ctxTint.globalCompositeOperation = "source-over";
        ctxTint.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
        ctxTint.fillRect(0, 0, master.fw, master.fh);
        ctxTint.globalCompositeOperation = "destination-in";
        ctxTint.drawImage(
            master.sprite,
            bgX, bgY,
            master.fw, master.fh,
            0, 0,
            master.fw, master.fh
        );
    }

    const draw = (ctx) => {
        if (!drawCanvasTint) return;

        if (!this.getMaster()) {
            return;
        }

        if (this.shouldBreakDrawFromDelayBefore()) return;
        if (this.getCycleFinish()) return;

        let fw = this.getFw();
        let fh = this.getFh();

        ctx.save();
        ctx.globalAlpha = tintAlpha;

        let pos = this.getPos();

        let bgX = 0;
        let bgY = 0;

        let left = Math.round(pos.left);
        let top = Math.round(pos.top);

        drawMask();

        ctx.drawImage(
            canvasTint,
            bgX, bgY,
            fw, fh,
            left, top,
            fw, fh
        );

        ctx.restore();
    };

    const update = (dt) => {
        if (!drawCanvasTint) return;
        let data = this.getData();
        let val = data.params.color.a == 1 ? 0.99 : data.params.color.a;
        let v = dt * 100;

        if (this.isDelayBeforeInParams()) {
            this.increaseDelayBefore(v);
            if (!this.isDelayBeforeReach()) return
        }

        if (this.getCycleFinish()) {

            if (this.isDelayAfterInParams()) {
                this.increaseDelayAfter(v);

                if (this.isDelayAfterReach()) stop();

            } else stop();

            return;
        }

        if (this.getMaster()) {
            this.setXFromMaster();
            this.setYFromMaster();
        }

        if (reachSolid && kind == CharacterEffectsData.TINT_KIND.SHOW_AND_STICK) {
            return;
        }

        let addDuration = maxTintVal * (1 - val) * data.params.duration;

        let duration = data.params.duration + addDuration;

        tintVal += (dt * maxTintVal * 1) / duration;
        if (tintVal > maxTintVal) {
            tintVal = 0;
            reachSolid = false;
            //stop();
            this.setCycleFinish(true);
        }
        tintAlpha = Math.round(Math.sin(tintVal) * 100) / 100;


        if (tintAlpha > val && !reachSolid) {
            reachSolid = true;
            tintAlpha = val;
            tintVal = maxTintVal - tintVal;
        }


    };

    const start = () => {
        tintVal = 0;
        drawCanvasTint = true;

        if (kind == CharacterEffectsData.TINT_KIND.HIDE) {
            let data = this.getData();
            reachSolid = true;
            tintAlpha = data.params.color.a;
            tintVal = Math.round((maxTintVal - Math.sin(tintAlpha)) * 10) / 10;
        }

        this.setCycleFinish(false);
        this.setDelayBefore(0);
        this.setDelayAfter(0);
    };

    const stop = () => {
        let id = this.getId();
        let actualRepeat = this.getActualRepeat();
        drawCanvasTint = false;
        actualRepeat++;
        this.setCycleFinish(false);
        this.setActualRepeat(actualRepeat);
        Engine.characterEffectsMapManager.afterStopAction(id)
    };

    this.init = init;
    this.start = start;
    this.update = update;
    this.draw = draw;

};

TintEffect.prototype = Object.create(CharacterEffect.prototype);
TintEffect.prototype.constructor = TintEffect;

module.exports = TintEffect;