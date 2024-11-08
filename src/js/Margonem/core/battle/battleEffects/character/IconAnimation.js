let BFD = require('core/battle/battleEffects/BattleEffectsData');

module.exports = function() {

    let timeStart = 0;
    let timePassed = null;
    let activeFrame = null;
    let actualRepeat = 1;
    let image = null;
    let frames = null;
    let fw = null;
    let fh = null;
    let fetchReady = false;
    let data = null;
    let parent = null;
    let drawIcon = false;

    let canvas = null;
    let ctx = null;
    let warriorId = null
    let $warrior = null

    this.init = () => {

    };

    this.createCanvas = () => {
        //$warrior        = Engine.battle.getBattleArea().find('.other-id-battle-' + warriorId);
        let p = data.data.params.position.toLowerCase();

        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');

        let $canvas = $(canvas);
        $canvas.addClass('canvas-graphic-effect canvas-icon-wrapper-' + p);
        $warrior.append($canvas);
        // canvas      = $warrior.find('.canvas-icon-wrapper-' + p)[0];
    }

    this.getFH = () => {
        return fh;
    };

    this.getFW = () => {
        return fw;
    };

    this.getData = () => {
        return data;
    };

    this.getFetchReady = () => {
        return fetchReady;
    };

    this.getDrawIcon = () => {
        return drawIcon;
    };

    this.set$warrior = () => {
        $warrior = Engine.battle.getBattleArea().find('.other-id-battle-' + warriorId);
    }

    this.updateData = (_parent, d, _warriorId) => {
        parent = _parent;
        data = d;
        warriorId = _warriorId;

        this.set$warrior();
        this.createCanvas()
    };

    this.update = (dt) => {
        if (!drawIcon) return;
        if (frames && frames.length > 1) {
            let v = dt * 100;

            timePassed += v;
            timeStart += v;

            // if (timeStart > data.data.params.duration * 100) {
            //     activeFrame = 0;
            //     this.stop();
            //     return;
            // }

            if (frames[activeFrame].delay < timePassed) {
                timePassed = timePassed - frames[activeFrame].delay;

                if (frames.length == activeFrame + 1) {
                    activeFrame = 0;
                    this.stop();
                } else activeFrame = activeFrame + 1;

            }
        }

    };

    // this.draw = (ctx, index) => {
    this.draw = () => {
        if (!drawIcon) return;

        let opacity = data.data.params.opacity;

        if (opacity) {
            ctx.save();
            ctx.globalAlpha = opacity;
        }

        //ctx.drawImage(image, index * fw, -activeFrame * fh);
        ctx.clearRect(0, 0, fw, fh);
        ctx.drawImage(image, 0, -activeFrame * fh);

        if (opacity) ctx.restore();
    };


    this.start = () => {
        timePassed = 0;
        activeFrame = 0;
        drawIcon = true;
    };

    this.stop = () => {
        drawIcon = false;
        actualRepeat++;
        Engine.battle.battleEffectsController.afterStopAction(this, actualRepeat, data)
    };

    this.startFetch = () => {
        let self = this;
        let gifUrl = CFG.r_battleEffectsGif + data.data.params.gifUrl;
        let gifReaderData = {
            speed: false,
            externalSource: cdncrUrl
        };

        Engine.imgLoader.onload(gifUrl, gifReaderData,
            (i, f) => {
                self.beforeOnload(f, i);
            },
            (i) => {
                self.afterOnload()
            }
        );
    };

    this.beforeOnload = (f, i) => {
        image = i;
        fw = f.hdr.width;
        fh = f.hdr.height;
        frames = f.frames;
        fetchReady = true;
    };

    this.afterOnload = () => {
        let f;
        switch (data.data.params.position) {
            case BFD.params.position.TOP:
                f = this.setPosition_topCanvas;
                break
            case BFD.params.position.RIGHT:
                f = this.setPosition_rightCanvas;
                break
            case BFD.params.position.BOTTOM:
                f = this.setPosition_bottomCanvas;
                break
            case BFD.params.position.LEFT:
                f = this.setPosition_leftCanvas;
                break
            case BFD.params.position.CENTER:
                f = this.setPosition_centerCanvas;
                break
            default:
                console.error('[AnimationWarriorAction.js, rebuildCanvasPosition] Position not exist!', data.params.position);
        }

        let fwWarrior = $warrior.width();
        let fhWarrior = $warrior.height();

        let cssObject = f(fwWarrior, fhWarrior);

        canvas.width = fw;
        canvas.height = fh;

        $(canvas).css(cssObject);

        this.start();
    }

    this.setPosition_topCanvas = (fwWarrior, fhWarrior) => {
        return {
            top: (-fh) + 'px',
            left: (fwWarrior / 2 - fw / 2) + 'px'
        }
    };

    this.setPosition_rightCanvas = (fwWarrior, fhWarrior) => {
        return {
            top: (fhWarrior / 2 - fh / 2) + 'px',
            left: (fwWarrior) + 'px'
        }
    };

    this.setPosition_bottomCanvas = (fwWarrior, fhWarrior) => {
        return {
            top: (fhWarrior) + 'px',
            left: (fwWarrior / 2 - fw / 2) + 'px'
        }
    };

    this.setPosition_leftCanvas = (fwWarrior, fhWarrior) => {
        return {
            top: (fhWarrior / 2 - fh / 2) + 'px',
            left: (-fw) + 'px'
        }
    };

    this.setPosition_centerCanvas = (fwWarrior, fhWarrior) => {
        return {
            top: (fwWarrior / 2 - fh / 2) + 'px',
            left: (fwWarrior / 2 - fw / 2) + 'px'
        }
    };

    this.remove = () => {
        $(canvas).remove();
    }

};