let CharacterEffectData = require('@core/characterEffects/CharacterEffectsData');

module.exports = function() {

    let id = null;

    let x = null;
    let y = null;

    let name = null;

    let timeStart = 0;
    let timePassed = null;
    let activeFrame = null;
    let actualRepeat = 1;
    let image;
    let frames;
    let fw;
    let fh;
    let fetchReady;
    let data = null

    let master = null;
    let drawIcon = false;
    //this.alwaysDraw     = true;
    let alwaysDraw;


    /**
	 data = {
      action        : "CREATE"              // "CREATE" || "REMOVE" (obligatory)
      windowTarget  : "MAP",                // "MAP" || "BATTLE"  (obligatory)
      name          : "wsad",               // name of characterEffect (obligatory)
      effect        : "ANIMATION",          // "SHAKE" || "TINT" || "ANIMATION" (obligatory)
      target        : {kind: "Npc", id: 1}  // kind: "Npc" || "Item" || "Hero"  // if Hero only kind {kind: "Hero"} (obligatory)
      params        : {
        gifUrl      : "battle.gif",         // only for "ANIMATION" (obligatory)
        duration    : 0.2,                  // s duration, only for "TINT" "SHAKE" (obligatory)
        opacity     : 1,                    //
        color       : 255,255,255,          // r,g,b, only for "TINT" (obligatory)
        repeat      : 1,                    // quantity repeat or true(infinity), default 1
        position    : "CENTER"              // "TOP" || "RIGHT" || "BOTTOM" || "LEFT" || "CENTER", only for "ANIMATION" (obligatory)
      }

   }
	 */

    const init = (_id, _data) => {
        setAlwaysDraw(true);
        setId(_id);
        setData(_data);
        setName();
        setMaster(findMaster());
        setXFromMaster();
        setYFromMaster();
        startFetch();
    };

    const setXFromMaster = () => {
        setX(master.xPos);
    }

    const setName = () => {
        name = data.name
    }

    const getName = () => {
        return name;
    }

    const setYFromMaster = () => {
        setY(master.yPos);
    }

    const setX = (_x) => {
        x = _x
    }

    const setY = (_y) => {
        y = _y;
    }

    const findMaster = () => {
        let id = data.target.id;


        let warriorsList = Engine.battle.warriorsList

        for (let k in warriorsList) {
            if (warriorsList[k].getOriginalId() == id) return warriorsList[k];
        }

        return null;
    }

    const setMaster = (_master) => {
        master = _master;
    }

    const getMasterKindObject = () => {
        return master.getCanvasObjectType();
    }

    const getMasterId = () => {
        return master.id;
    }

    const startFetch = () => {
        let self = this;
        let gifUrl = CFG.r_battleEffectsGif + data.params.gifUrl;
        let gifReaderData = {
            speed: false,
            externalSource: cdncrUrl
        };

        Engine.imgLoader.onload(gifUrl, gifReaderData,
            (i, f) => {
                beforeOnload(f, i);
            },
            (i) => {
                afterOnload()
            }
        );
    };

    const beforeOnload = (f, i) => {
        image = i;
        fw = f.hdr.width;
        fh = f.hdr.height;
        frames = f.frames;
        fetchReady = true;
    };

    this.getOrder = () => {
        return 10000;
    }

    const afterOnload = () => {

        start();
    }

    const start = () => {
        timePassed = 0;
        activeFrame = 0;
        drawIcon = true;
    };

    const stop = () => {
        drawIcon = false;
        actualRepeat++;
        Engine.characterEffectsBattleManager.afterStopAction(id)
    };

    const getActualRepeat = () => {
        return actualRepeat;
    };

    const getRepeat = () => {
        return data.params.repeat ? data.params.repeat : null;
    };

    const setId = (_id) => {
        id = _id
    };

    const setData = (_data) => {
        data = _data;
    };

    const getId = () => {
        return id;
    };

    const update = (dt) => {
        if (!drawIcon) return;
        if (frames && frames.length > 1) {
            let v = dt * 100;

            timePassed += v;
            timeStart += v;

            if (frames[activeFrame].delay < timePassed) {
                timePassed = timePassed - frames[activeFrame].delay;

                if (frames.length == activeFrame + 1) {
                    activeFrame = 0;
                    stop();
                } else activeFrame = activeFrame + 1;

            }
        }

    };

    const draw = (ctx) => {
        if (!drawIcon) return;

        let opacity = data.params.opacity;

        if (opacity) {
            ctx.save();
            ctx.globalAlpha = opacity;
        }

        let modify = getPositionModify();

        let left = Engine.battle.$[0].offsetWidth / 2 - Engine.battle.getBattleArea()[0].offsetWidth / 2 + x + modify[0] - master.fw / 2;
        let top = Engine.battle.$[0].offsetHeight / 2 - Engine.battle.getBattleArea()[0].offsetHeight / 2 + y + modify[1] - 1.5 * master.fh;

        let bgX = 0;
        let bgY = activeFrame * fh;

        console.log(x, y, master.id)

        ctx.drawImage(
            image,
            bgX, bgY,
            fw, fh,
            left, top,
            fw, fh
        );

        if (opacity) ctx.restore();
    };

    const getPositionModify = () => {

        let masterFw = master.fw;
        let masterFh = master.fh;

        switch (data.params.position) {
            case CharacterEffectData.position.CENTER:
                return [
                    masterFw / 2 - fw / 2,
                    -masterFh / 2
                ];
            case CharacterEffectData.position.LEFT:
                return [
                    -fw,
                    -masterFh / 2
                ];
            case CharacterEffectData.position.RIGHT:
                return [
                    masterFw,
                    -masterFh / 2
                ];
            case CharacterEffectData.position.TOP:
                return [
                    masterFw / 2 - fw / 2,
                    -masterFh - fh / 2
                ];
            case CharacterEffectData.position.BOTTOM:
                return [
                    masterFw / 2 - fw / 2,
                    fh / 2
                ];
            default:
                errorReport('MapObject.js', 'getPositionModify', 'position not exist', position)
                return [0, 0];
        }

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
    this.getId = getId;
    this.getName = getName;
    this.getActualRepeat = getActualRepeat;
    this.getRepeat = getRepeat;
    this.update = update;
    this.draw = draw;
    this.start = start;
    this.getMasterKindObject = getMasterKindObject;
    this.getMasterId = getMasterId;

}