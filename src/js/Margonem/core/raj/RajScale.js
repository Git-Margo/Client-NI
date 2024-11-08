let VectorCalculate = require('core/VectorCalculate');


module.exports = function() {


    const moduleData = {
        fileName: "RajScale.js"
    };

    let scale = null;
    // let offsetScaleX            = null;
    // let offsetScaleY            = null;

    let scaleOffsetX = null;
    let scaleOffsetY = null;


    let scaleDestiny = null;
    let repeatScale = null;
    let valsScale = null;
    let indexScale = null;
    let master = null;
    let durationScale = null;
    let scaleFactor = null;


    const init = (_master) => {
        setMaster(_master);

        setScale(1);
        setDurationScale(5);
        setRepeatScale(1);
    };


    const startScaleBehavior = () => {
        let actualBehaviorAttachScale = getActualBehaviorAttachScale();
        let vals = actualBehaviorAttachScale.vals;
        let attachScaleRepeatData = actualBehaviorAttachScale.repeat;

        if (attachScaleRepeatData != null) setRepeatScale(attachScaleRepeatData);

        setIndexScale(null);
        setValsScale(vals);
        setDataByActualIndexScale();
    };

    const calculateScaleFactor = (startScale, _destinyScale, duration) => {

        let scaleRange = Math.abs(startScale - _destinyScale);
        //let v           = actualDuration / _destinyDuration;

        let direction = startScale < _destinyScale ? 1 : -1;

        return scaleRange / duration * direction;
    }

    const setDataByActualIndexScale = () => {
        manageIndexScale();

        let actualValScale = getActualValScaleByIndex();

        if (!actualValScale) return; // rajScale is destroy;

        let _scale = isset(actualValScale.scale) ? actualValScale.scale : 1;

        let duration = isset(actualValScale.duration) ? actualValScale.duration : 5;
        setDurationScale(duration);
        //setScale(_scale);

        setScaleDestiny(_scale);

        setScaleOffsetX(actualValScale.scaleOffset && actualValScale.scaleOffset.x ? actualValScale.scaleOffset.x : null);
        setScaleOffsetY(actualValScale.scaleOffset && actualValScale.scaleOffset.y ? actualValScale.scaleOffset.y : null);

        let _scaleFactor = calculateScaleFactor(scale, scaleDestiny, durationScale);

        setScaleFactor(_scaleFactor);
    };

    const manageIndexScale = () => {
        if (indexScale == null) {
            setIndexScale(0);
            return;
        }

        setIndexScale(indexScale + 1);

        if (valsScale.length < indexScale + 1) {

            if (repeatScale === true) { //  infinitive
                setIndexScale(0);
                return
            }

            setRepeatScale(repeatScale - 1);

            if (repeatScale <= 0) {
                //destroy();
                return
            }

            setIndexScale(0);

        }

    };

    const updateScale = (dt) => {

        if (scale == 1 && scaleDestiny == null) {
            return;
        }

        // let newPosition = VectorCalculate.getNewPositionFromVectorsCorrect(xMoveNoise, yMoveNoise, xVectorMoveNoise, yVectorMoveNoise, dt, 1);
        //let newScale = VectorCalculate.getNewPositionFromVectorsCorrect(xMoveNoise, yMoveNoise, xVectorMoveNoise, yVectorMoveNoise, dt, 1);

        // let newScale = scale * scaleFactor * dt;
        let newScale = scaleFactor * dt;

        setScale(scale + newScale);

        decreaseDurationScale(dt);

        if (durationScale > 0) {
            return;
        }

        setScale(scaleDestiny);


        setDataByActualIndexScale();
    };

    const getActualBehaviorAttachScale = () => {
        let b = master.getActualBehavior();
        if (!b) return null;

        return b.attachScale ? b.attachScale : null;
    };

    const increaseIndexScale = () => {
        setIndexScale(indexScale + 1);
    };

    const setIndexScale = (index) => {
        indexScale = index
    };

    const setValsScale = (vals) => {
        valsScale = vals;
    };


    const setDurationScale = (_durationScale) => {
        durationScale = _durationScale;
    };

    const decreaseDurationScale = (dt) => {
        let duration = durationScale - dt;
        setDurationScale(duration)
    };


    const setScaleDestiny = (_scaleDestiny) => {
        scaleDestiny = _scaleDestiny;
    };

    const setMaster = (_master) => {
        master = _master;
    };


    const setScale = (_scale) => {
        scale = _scale;
    };

    const setScaleOffsetX = (_offsetScaleX) => {
        scaleOffsetX = _offsetScaleX;
    };

    const setScaleOffsetY = (_offsetScaleY) => {
        scaleOffsetY = _offsetScaleY;
    };


    const setScaleFactor = (_scaleFactor) => {
        scaleFactor = _scaleFactor;
    };

    const setRepeatScale = (repeat) => {
        repeatScale = repeat;
    };

    const getActualValScaleByIndex = () => {
        if (!valsScale) {
            return null;
        }

        return valsScale[indexScale];
    }

    const getScale = () => {
        return scale;
    }

    const getScaleOffsetX = () => {
        return scaleOffsetX;
    }

    const getScaleOffsetY = () => {
        return scaleOffsetY;
    }

    this.init = init;
    this.getScale = getScale;
    this.startScaleBehavior = startScaleBehavior;
    this.updateScale = updateScale;
    this.getScaleOffsetX = getScaleOffsetX;
    this.getScaleOffsetY = getScaleOffsetY;



}