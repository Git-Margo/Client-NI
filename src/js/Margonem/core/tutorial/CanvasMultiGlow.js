var WhoIsHereGlow = require('@core/whoIsHere/WhoIsHereGlow2');
var TutorialData = require('@core/tutorial/TutorialData');

module.exports = function() {

    //this.target = [];
    this.target = {};
    this.active = false;

    //this.glow = [];
    this.glow = {};

    this.val = 0;
    this.maxVal = 3.14;
    this.blink = false;
    //this.alwaysDraw = true;
    let alwaysDraw;

    this.init = () => {
        setAlwaysDraw(true);
    };

    this.setGlow = (index) => {
        if (!this.target[index].imgLoaded) {
            setTimeout(() => {
                this.setGlow(index);
            }, 500);
            return;
        }
        this.glow[index] = new WhoIsHereGlow();
        this.glow[index].createObject(this.target[index], '#3ed1de');
    };

    this.clearGlow = () => {
        //this.glow = [];
        this.glow = {};
    };

    this.addMultiGlowTarget = (tutorialData, blink) => {
        for (let k in tutorialData) {
            let target = this.getTargetFromTutorialData(tutorialData[k]);

            if (!target) return;
            if (!Array.isArray(target)) target = [target];

            for (let i = 0; i < target.length; i++) {
                this.setBlink(blink);

                //let newId = this.getNewTargetId();
                let newId = target[i].d.id;
                this.addTarget(target[i]);
                this.setGlow(newId);
            }
        }
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
            case TutorialData.TYPE_OBJECT.GROUND_ITEM_COLLECTIONS:
                // let lang = _l();

                // if (lang == 'pl') target = Engine.map.groundItems.getItemsByStatAndVal('szablon', tutorialData.szablon);
                // if (lang == 'en') target = Engine.npcs.getByArrayId(tutorialData.allId);
                if (isPl()) target = Engine.map.groundItems.getItemsByStatAndVal('szablon', tutorialData.szablon);
                if (isEn()) target = Engine.npcs.getByArrayId(tutorialData.allId);

                break;
            default:
                console.warn('[CanvasMultiGlow.js, getTargetFromTutorialData] Unsupported kind: ', tutorialData.kind);
                return null;
        }

        if (target == null) console.warn('[CanvasMultiGlow.js, getTargetFromTutorialData] Object not exist', tutorialData.id);

        return target;
    };

    this.removeMultiGlowTarget = () => {
        if (!this.getActive()) return;
        this.clearGlow();
        this.clearTarget();
        this.setActive(false);
        this.setBlink(false);
    };

    this.removeMultiGlowTargetById = (id) => {
        if (!this.getActive()) return;
        if (!this.glow[id]) return;
        delete this.glow[id];
        delete this.target[id];
    };

    // this.getNewTargetId = () => {
    //     return this.target.length;
    // };

    this.addTarget = (target) => {
        //this.target.push(target);

        this.target[target.d.id] = target;

        target.increaseTutorialOrder();
    };

    this.clearTarget = () => {
        // for (let i = 0; i < this.target.length; i++) {
        //     this.target[i].clearTutorialOrder();
        // }
        // this.target = [];

        for (let k in this.target) {
            this.target[k].clearTutorialOrder();
        }
        this.target = {};

    };

    //0px 0px 8px 0 rgba(255,215,0, 1), 0px 0px 20px 0 rgba(255,215,0, 1)

    this.getOrder = () => {
        return 300;
    };

    this.update = (dt) => {
        //if (!this.active || this.glow.length != this.target.length) return;
        if (!this.active || Object.keys(this.glow).length != Object.keys(this.target).length) return;

        this.val += dt;
        if (this.val > this.maxVal) this.val = 0;

        let alpha = Math.round(Math.sin(this.val) * 100) / 100;

        if (this.blink) {
            // for (let i = 0 ; i < this.glow.length; i++) {
            //     this.glow[i].setAlpha(alpha);
            // }

            for (let k in this.glow) {
                this.glow[k].setAlpha(alpha);
            }


        }
        // for (let i = 0 ; i < this.glow.length; i++) {
        //     this.glow[i].update();
        // }

        for (let kk in this.glow) {
            this.glow[kk].update();
        }

    };

    this.draw = (ctx) => {
        //if (!this.glow.length) return;
        if (!Object.keys(this.glow).length) return;

        // for (let i = 0; i < this.glow.length; i++) {
        //     this.glow[i].draw(ctx);
        // }

        for (let k in this.glow) {
            this.glow[k].draw(ctx);
        }

    };

    this.setActive = (active) => {
        this.active = active;
    };

    this.getActive = () => {
        return this.active;
    };

    this.getCanvasMultiGlow = () => {
        return this.active ? [this] : [];
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