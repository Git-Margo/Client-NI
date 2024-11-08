let CanvasFade = require('core/canvasFade/CanvasFade.js');
let CanvasFadeData = require('core/canvasFade/CanvasFadeData.js');

module.exports = function() {

    let id = null;
    let originalObject = null;
    let canvasFade = null;
    let updateOriginalObject = null;
    let checkUpdateOriginalObject = null;
    //this.alwaysDraw                 = true;
    let alwaysDraw

    const init = () => {
        setAlwaysDraw(true);
        setUpdateOriginalObject(false);
        setCheckUpdateOriginalObject(() => {
            return true
        });
    };

    const setCheckUpdateOriginalObject = (func) => {
        checkUpdateOriginalObject = func;
    }

    const getOrder = () => {
        return originalObject.getOrder();
    };

    const setCanvasFade = (_data) => {
        let data = {
            action: CanvasFadeData.action.FADE_OUT,
            callback: () => {
                Engine.wraithObjectManager.removeWraithObject(id);
            }
        };

        if (isset(_data.startAlpha)) data.startAlpha = _data.startAlpha
        if (isset(_data.speed)) data.speed = _data.speed

        canvasFade = new CanvasFade();

        canvasFade.init();
        canvasFade.updateData(data);
    };

    const updateData = (data) => {
        setId(data.id);
        setOriginalObject(data.originalObject);

        if (isset(data.updateOriginalObject)) setUpdateOriginalObject(data.updateOriginalObject);
        if (isset(data.checkUpdateOriginalObject)) setCheckUpdateOriginalObject(data.checkUpdateOriginalObject);

        setCanvasFade(data);
    };

    const remove = () => {
        Engine.wraithObjectManager.remove(id);
    };

    const update = (dt) => {
        canvasFade.update(dt);
        if (updateOriginalObject && checkUpdateOriginalObject()) originalObject.update(dt);
    };

    const setId = (_id) => {
        id = _id;
    };

    const draw = (ctx) => {
        ctx.save();
        ctx.globalAlpha = canvasFade.getFadeValue();
        originalObject.draw(ctx);
        ctx.restore();
    };

    const setOriginalObject = (_originalObject) => {
        originalObject = _originalObject
    };

    const setUpdateOriginalObject = (_updateOriginalObject) => {
        updateOriginalObject = _updateOriginalObject
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
    this.updateData = updateData;
    this.update = update;
    this.draw = draw;
    this.getOrder = getOrder;

}