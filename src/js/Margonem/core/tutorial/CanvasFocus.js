var WhoIsHereGlow = require('core/whoIsHere/WhoIsHereGlow2');
const TutorialData = require("./TutorialData");

module.exports = function() {

    this.target = null;
    this.active = false;

    this.xStart = -100;
    this.yStart = -100;

    this.size = [400, 400];

    this.glow = null;

    this.val = 0;
    this.maxVal = 3.14;
    this.blink = false;


    this.init = () => {
        this.setCollider();
    };

    // this.initGlow = () => {
    // 	this.glow = new WhoIsHereGlow();
    // };

    this.setGlow = () => {
        if (!this.target.imgLoaded) {
            setTimeout(() => {
                this.setGlow();
            }, 500);
            return;
        }
        this.glow = new WhoIsHereGlow();
        this.glow.createObject(this.target, '#3ed1de');
    };

    this.clearGlow = () => {
        this.glow = null;
    };

    this.addOverlayAndTarget = (tutorialData, blink) => {
        let target = this.getTargetFromTutorialData(tutorialData);

        if (!target) return;

        //Engine.lock.add('canvasFocus');

        this.setBlink(blink);

        this.addTarget(target);
        this.setGlow();
        this.setActive(true);
    };

    this.setBlink = (state) => {
        this.blink = state ? true : false;
    };

    this.setCollider = () => {
        this.collider = {
            box: [
                this.xStart * 32,
                this.yStart * 32,
                this.size[0] * 32,
                this.size[1] * 32
            ]
        };
    };

    this.onclick = () => {
        //console.log('onclick canvasFocus');
        return false;
    };

    this.getTarget = () => {
        return this.target;
    };

    this.getTargetFromTutorialData = (tutorialData) => {
        let target = null;

        switch (tutorialData.kind) {
            case TutorialData.TYPE_OBJECT.HERO:
                target = Engine.hero;
                break;
            case TutorialData.TYPE_OBJECT.NPC:
                target = Engine.npcs.getById(tutorialData.id);
                break;
            default:
                console.error('[CanvasFocus.js, getTargetFromTutorialData] Unsupported kind: ', tutorialData.kind);
                return null;
        }

        if (target == null) console.error('[CanvasFocus.js, ]Object not exist', tutorialData.id);

        return target;
    };

    this.removeOverlayAndTarget = () => {
        if (!this.getActive()) return;
        //Engine.lock.remove('canvasFocus');
        this.clearGlow();
        this.clearTarget();
        this.setActive(false);
        this.setBlink(false);
    };

    this.addTarget = (target) => {
        this.target = target;
        this.target.increaseTutorialOrder();
    };

    this.clearTarget = () => {
        this.target.clearTutorialOrder();
        this.target = null;
    };

    this.getOrder = () => {
        return 300;
    };

    this.update = (dt) => {
        if (!this.active || !this.glow) return;

        this.val += dt;
        if (this.val > this.maxVal) this.val = 0;

        let alpha = Math.round(Math.sin(this.val) * 100) / 100;

        if (this.blink) this.glow.setAlpha(alpha);

        this.glow.update();
    };

    this.draw = (ctx) => {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = 'black';
        //ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        var left = this.xStart * 32 - Engine.map.offset[0];
        var top = this.yStart * 32 - Engine.map.offset[1];

        ctx.fillRect(left, top, this.size[0] * 32, this.size[1] * 32);

        ctx.globalAlpha = 1;
        if (this.glow) this.glow.draw(ctx);
    };

    this.setActive = (active) => {
        this.active = active;
    };

    this.getActive = () => {
        return this.active;
    };

    this.getCanvasFocus = () => {
        return this.active ? [this] : [];
    };

};