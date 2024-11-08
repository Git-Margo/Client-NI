let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let TextObject = require('core/canvasObject/TextObject');

module.exports = function() {

    let id = null;
    let targetKind = null;
    let targetId = null;
    let initTime = null;
    let textObject = null;
    let currentTime = null;

    //this.alwaysDraw = true;
    let alwaysDraw;
    this.rx;
    this.ry;

    const init = () => {
        setAlwaysDraw(true);
        textObject = new TextObject();
    };

    const updateData = (_id, _targetId, _targetKind, _time) => {
        if (_id != null) setId(_id);
        setTargetKind(_targetKind);
        setInitTime(_time + addActualSeconds());

        if (!getEngine().interfaceTimerManager.isHero()) {
            setTargetId(_targetId);
        }
    };

    const setId = (_id) => {
        id = _id;
    };

    const addActualSeconds = () => {
        return Math.round(new Date().getTime() / 1000)
    }

    const setInitTime = (_time) => {
        initTime = _time;
    };

    const setTargetKind = (_targetKind) => {
        targetKind = _targetKind;
    };

    const setTargetId = (_targetId) => {
        targetId = _targetId;
    };

    const getMaster = () => {
        switch (targetKind) {
            case CanvasObjectTypeData.HERO:
                return getEngine().hero;
            case CanvasObjectTypeData.NPC:
                return getEngine().npcs.getById(targetId);
        }
    };

    const update = (dt) => {
        //if (currentTime == null) {
        //    currentTime = initTime;
        //}
        //
        //currentTime -= dt;


        currentTime = initTime;
        currentTime -= addActualSeconds();

        if (id != null && currentTime < 0) {
            remove();
            return
        }

        let master = getMaster();

        if (!master) {
            return;
        }

        this.rx = master.rx;
        this.ry = master.ry;
    };

    const draw = (ctx) => {
        let master = getMaster();

        if (!master) {
            return
        }

        switch (targetKind) {
            case CanvasObjectTypeData.HERO:
                break;
            case CanvasObjectTypeData.NPC:
                if (!master.getOnloadProperImg()) {
                    return;
                }
                break;
        }

        if (currentTime < 0) return;

        let leftPosMod = (typeof(master.leftPosMod) != 'undefined' ? master.leftPosMod : 0);

        const offsetTop = master.checkEmoExist() ? 20 : 0;
        const offsetLeft = 16;

        let mapShift = Engine.mapShift.getShift();

        let left = this.rx * CFG.tileSize - Engine.map.offset[0] - mapShift[0] + leftPosMod + offsetLeft;
        let top = this.ry * CFG.tileSize - Engine.map.offset[1] - mapShift[1] + CFG.tileSize - master.fh - offsetTop;

        let minMs = currentTime < 0 ? 0 : currentTime;
        let sec = Math.floor(minMs);

        let formatTime = getSecondLeft(sec, {
            noVar: true
        });

        let color = getColor(sec);

        ctx.save();

        textObject.draw(ctx, formatTime, left, top, 11, color);

        ctx.restore();
    };

    const getColor = (sec) => {
        if (sec > 60) return '#ffffff';
        if (sec > 0) return '#ffa500';

        return '#ff0000';
    };

    const getOrder = () => {
        return 500;
    };

    const remove = () => {
        getEngine().interfaceTimerManager.removeCharacterTimer(id, targetKind);
    };

    const getId = () => {
        return id;
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
    this.updateData = updateData;
    this.update = update;
    this.draw = draw;
    this.getOrder = getOrder;
    this.getId = getId;
}