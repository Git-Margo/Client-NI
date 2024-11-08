module.exports = function() {

    let ctx;
    let $canvas;
    // let updateCallback;
    let drawCallback;
    let data;
    let id;

    const init = (_id, _data) => {
        id = _id;
        initData(_data);
        createCanvas();
        setCanvasSize();
    }

    const createCanvas = () => {

        $canvas = $('<canvas>');
        ctx = $canvas[0].getContext("2d");

        $canvas.addClass('specific-animation');
        $canvas.attr('specific-animation-id', id);
    }

    const setCanvasSize = () => {
        $canvas.attr({
            width: data.width,
            height: data.height
        })
    }

    const initData = (_data) => {

        if (!checkDataIsCorrect) return

        data = _data;
        // updateCallback  = data.updateCallback;
        drawCallback = _data.drawCallback;
    }

    const checkDataIsCorrect = (data) => {
        if (!isset(data.height)) {
            warningReport('SpecificAnimation.js', "checkDataCorrect", "attr height not exist!")
            return false
        }
        if (!isset(data.width)) {
            warningReport('SpecificAnimation.js', "checkDataCorrect", "attr width not exist!")
            return false
        }
        if (!isset(data.drawCallback)) {
            warningReport('SpecificAnimation.js', "checkDataCorrect", "drawCallback drawCallback not exist!")
            return false
        }

        return true
    }

    // const update = (dt) => {
    //     updateCallback(dt)
    // }

    const draw = (dt) => {
        drawCallback(dt, $canvas, ctx, data);
    }

    const get$Canvas = () => {
        return $canvas;
    }

    const getId = () => {
        return id;
    }

    this.init = init;
    this.getId = getId;
    // this.updade = update;
    this.draw = draw;
    this.get$Canvas = get$Canvas;

}