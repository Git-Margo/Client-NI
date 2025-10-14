let CharacterEffectData = require('@core/characterEffects/CharacterEffectsData');
let CharacterEffect = require('@core/characterEffects/CharacterEffect');
let RajGetSpecificData = require('@core/raj/RajGetSpecificData');
let RajObjectInterface = require('@core/raj/RajObjectInterface');
let RajData = require('@core/raj/RajData');

let IconEffect = function() {

    let image;
    let drawIcon = false;
    let timeStart = 0;
    let timePassed = null;
    let activeFrame = null;
    let backgroundImage = null;
    let frames;
    let fetchReady;


    const init = (_id, _data, additionalData) => {
        implementRajInterface();
        this.updateDataRajObject(_data);
        this.initObject(_id, _data);
        startFetch(additionalData);
    };

    const implementRajInterface = () => {
        (new RajObjectInterface()).implementRajObject(this, RajData.CHARACTER_EFFECT);
    }

    const startFetch = (additionalData) => {
        let data = this.getData();
        //let gifUrl          = CFG.r_characterEffects + data.params.gifUrl;
        //let gifUrl          = CFG.r_rajGraphics + data.params.gifUrl;
        let gifUrl = CFG.r_rajGraphics + RajGetSpecificData.getCharacterData(data.params.gifUrl, additionalData);
        let gifReaderData = {
            speed: false,
            externalSource: cdnUrl
        };

        Engine.imgLoader.onload(gifUrl, gifReaderData,
            (i, f) => {
                beforeOnload(f, i);
            },
            (i) => {
                afterOnload()
            }
        );

        if (!data.params.speechBubble) return;


        let path = CFG.r_epath + 'speech_bubble.gif';
        Engine.imgLoader.onload(path, {
            speed: true,
            externalSource: cdnUrl
        }, false, (i) => {
            backgroundImage = i;
        });
    };

    const beforeOnload = (f, i) => {
        image = i;
        frames = f.frames;
        fetchReady = true;

        this.setFw(f.hdr.width);
        this.setFh(f.hdr.height);
    };

    const afterOnload = () => {
        start();
    };

    const start = () => {
        timePassed = 0;
        activeFrame = 0;
        drawIcon = true;

        this.setCycleFinish(false);
        this.setDelayBefore(0);
        this.setDelayAfter(0);
    };

    const stop = () => {
        let id = this.getId();
        let actualRepeat = this.getActualRepeat();

        drawIcon = false;

        actualRepeat++;

        this.setCycleFinish(false);
        this.setActualRepeat(actualRepeat);
        Engine.characterEffectsMapManager.afterStopAction(id)
    };


    const update = (dt) => {
        if (!drawIcon) return;
        if (frames && frames.length > 1) {
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

            timePassed += v;
            timeStart += v;

            if (frames[activeFrame].delay < timePassed) {
                timePassed = timePassed - frames[activeFrame].delay;

                if (frames.length == activeFrame + 1) {
                    activeFrame = 0;
                    //stop();
                    this.setCycleFinish(true);
                } else activeFrame = activeFrame + 1;

            }
        }

        if (!this.getMaster()) return;

        this.setXFromMaster();
        this.setYFromMaster();

    };

    const draw = (ctx) => {
        if (!drawIcon) return;

        if (!this.getMaster()) return;

        if (this.shouldBreakDrawFromDelayBefore()) return;
        if (this.getCycleFinish()) return;

        let data = this.getData();
        let opacity = data.params.opacity;

        let fw = this.getFw();
        let fh = this.getFh();

        if (opacity) {
            //ctx.save();
            ctx.globalAlpha = opacity;
        }

        let pos = this.getPos();

        let bgX = 0;
        let bgY = activeFrame * fh;

        let left = Math.round(pos.left);
        let top = Math.round(pos.top);


        if (backgroundImage) {
            ctx.drawImage(
                backgroundImage,
                left - backgroundImage.width / 2 + this.fw / 2,
                top - backgroundImage.height / 2 + this.fh / 2
            );
        }

        ctx.drawImage(
            image,
            bgX, bgY,
            fw, fh,
            left, top,
            fw, fh
        );

        if (opacity) {
            //ctx.restore();
            ctx.globalAlpha = 1;
        }
    };


    this.init = init;
    this.update = update;
    this.draw = draw;
    this.start = start;
    this.stop = stop;

};

IconEffect.prototype = Object.create(CharacterEffect.prototype);
IconEffect.prototype.constructor = IconEffect;

module.exports = IconEffect;