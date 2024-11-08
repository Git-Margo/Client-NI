let FloatObjectData = require('core/floatObject/FloatObjectData');

module.exports = function() {

    let master;

    //let fromAttachRotationData;

    let rotationAngle = 0;
    let rotationSpeed = 50;
    let rotationAngleDestiny = 0;
    let rotationOffset = null;
    let finishRotation = null;

    let helpCanvas = null;
    let helpCanvasCtx = null;


    const init = (_master) => {
        initHelpCanvas();

        setMaster(_master);

        setRotationSpeed(FloatObjectData.defaultData.ROTATION_SPEED);

        setFinishRotation(false);

    }

    const initHelpCanvas = () => {
        helpCanvas = document.createElement('canvas');
        helpCanvasCtx = helpCanvas.getContext('2d');
    }

    const updateRotateAction = (dt) => {
        if (finishRotation) {
            setFinishRotation(false);
            //behaviorManager.callBehavior();
            //destroy();
            master.callBehavior()
        }
    };


    const updateRotationAngle = (dt) => {
        if (rotationAngle == rotationAngleDestiny) return;

        let v = rotationSpeed * dt * 100;

        if (rotationAngle < rotationAngleDestiny) {

            rotationAngle += v;
            if (rotationAngle >= rotationAngleDestiny) {
                rotationAngle = rotationAngleDestiny;
                setFinishRotation(true);
            }

        } else {

            rotationAngle -= v;
            if (rotationAngle <= rotationAngleDestiny) {
                rotationAngle = rotationAngleDestiny;
                setFinishRotation(true);
            }

        }

    };

    const checkNormalPos = () => {
        return rotationAngle % 360 == 0 && rotationOffset == null;
    }

    const startRotationBehavior = (_fromAttachRotationData) => {
        //let instantData = getActualBehaviorInstantData();
        //
        //if (instantData) {}

        //fromAttachRotationData = _fromAttachRotationData;

        setFinishRotation(false);


        let speedData;
        let setAngleData;
        let addAngleData;
        let rotationOffsetData;
        let attachRotationRepeatData = null;

        if (_fromAttachRotationData) {
            speedData = getActualBehaviorAttachRotationSpeedData();
            setAngleData = getActualBehaviorAttachRotationSetAngleData();
            addAngleData = getActualBehaviorAttachRotationAddAngleData();
            rotationOffsetData = getActualBehaviorAttachRotationRotationOffsetData();
            attachRotationRepeatData = getActualBehaviorAttachRotationRepeatData();

            if (attachRotationRepeatData != null) {
                addAngleData = getAngleDataFromAttachRotationRepeatData(attachRotationRepeatData, addAngleData);
            }


        } else {
            speedData = master.getActualBehaviorSpeedData();
            setAngleData = getActualBehaviorSetAngleData();
            addAngleData = getActualBehaviorAddAngleData();
            rotationOffsetData = getActualBehaviorRotationOffsetData();
        }

        if (speedData != null) setRotationSpeed(speedData);



        setRotationOffset(rotationOffsetData ? rotationOffsetData : null);

        // if (rotationOffsetData != null) {
        //     setRotationOffset(rotationOffsetData);
        // }

        if (setAngleData != null) {
            setRotationAngleDestiny(setAngleData);
            return
        }

        if (addAngleData != null) {
            setRotationAngleDestiny(rotationAngle + addAngleData);
            return
        }


    }

    const drawSprite = (ctx, left, top, image, scaleClipImg) => {
        ctx.save();
        // ctx.translate(left + master.fw / 2, top + master.fh / 2);
        // ctx.rotate(rotationAngle * Math.PI / 180);

        let rotationOffsetX = rotationOffset == null ? master.fw / 2 : rotationOffset.x;
        let rotationOffsetY = rotationOffset == null ? master.fh / 2 : rotationOffset.y;

        if (scaleClipImg) {

            ctx.translate(scaleClipImg.left + master.fw / 2, scaleClipImg.top + master.fh / 2);
            // ctx.translate(left + master.fw / 2, top + master.fh / 2);
            ctx.rotate(rotationAngle * Math.PI / 180);


            ctx.fillRect(0 - rotationOffsetX, 0 - rotationOffsetY, scaleClipImg.width, scaleClipImg.height)

            ctx.drawImage(
                image,
                0, 0,
                scaleClipImg.widthScale, scaleClipImg.heightScale,
                0 - rotationOffsetX, 0 - rotationOffsetY,
                scaleClipImg.width, scaleClipImg.height
            );

        } else {

            ctx.translate(left + master.fw / 2, top + master.fh / 2);
            ctx.rotate(rotationAngle * Math.PI / 180);

            ctx.fillRect(0 - rotationOffsetX, 0 - rotationOffsetY, image.width, image.height)

            ctx.drawImage(
                image,
                0, 0,
                image.width, image.height,
                0 - rotationOffsetX, 0 - rotationOffsetY,
                image.width, image.height
            );


        }


        ctx.restore();
    }

    const drawSprite2 = (ctx, left, top, image, width, height, backgroundPositionX, backgroundPositionY) => {
        ctx.save();

        let rotationOffsetX = rotationOffset == null ? master.fw / 2 : rotationOffset.x;
        let rotationOffsetY = rotationOffset == null ? master.fh / 2 : rotationOffset.y;

        rotationOffsetX += (width - image.width) / 2;
        rotationOffsetY += (height - image.height) / 2;

        ctx.translate(left + rotationOffsetX + master.fw / 2, top + rotationOffsetY + master.fh / 2);
        ctx.rotate(rotationAngle * Math.PI / 180);

        ctx.fillRect(0 - rotationOffsetX, 0 - rotationOffsetY, width, height)

        ctx.drawImage(
            image,
            backgroundPositionX, backgroundPositionY,
            width, height,
            0 - rotationOffsetX, 0 - rotationOffsetY,
            width, height
        );

        ctx.restore();
    }

    const getRotateImage = (image, frameWidth, frameHeight, backgroundPositionX, backgroundPositionY) => {

        let canvasWidth = helpCanvas.width;
        let canvasHeight = helpCanvas.height;

        let imageWidth = frameWidth;
        let imageHeight = frameHeight;
        let minCanvasWidth = imageWidth * 2;
        let minCanvasHeight = imageHeight * 2;

        if (canvasWidth < minCanvasWidth) {
            helpCanvas.width = minCanvasWidth;
            canvasWidth = minCanvasWidth;
        }

        if (canvasHeight < minCanvasHeight) {
            helpCanvas.height = minCanvasHeight;
            canvasHeight = minCanvasHeight;
        }

        helpCanvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

        let centerX = canvasWidth / 2;
        let centerY = canvasHeight / 2;

        helpCanvasCtx.save();

        helpCanvasCtx.translate(centerX, centerY)
        helpCanvasCtx.rotate(rotationAngle * Math.PI / 180);


        let left = rotationOffset ? -rotationOffset.x : -imageWidth / 2;
        let top = rotationOffset ? -rotationOffset.y : -imageHeight / 2;

        helpCanvasCtx.drawImage(
            image,
            backgroundPositionX, backgroundPositionY,
            imageWidth, imageHeight,
            left, top,
            imageWidth, imageHeight
        );


        helpCanvasCtx.restore();

        return helpCanvas;
    }

    const getAngleDataFromAttachRotationRepeatData = (attachRotationRepeatData, addAngleData) => {
        if (attachRotationRepeatData == true) {

            if (addAngleData != null) return addAngleData > 0 ? Infinity : -Infinity;

        } else {

            if (addAngleData != null) return addAngleData * attachRotationRepeatData;

        }

        return null;
    }

    //const destroy = () => {
    //    //console.log('destroy', "fromAttachRotationData:", fromAttachRotationData)
    //    //master.removeRajRotation()
    //}

    const getActualBehaviorAttachRotationSpeedData = () => {
        let b = master.getActualBehavior();
        if (!b) return null;

        return b.attachRotation.speed ? b.attachRotation.speed : null;
    };

    const getActualBehaviorAttachRotationSetAngleData = () => {
        let b = master.getActualBehavior();
        if (!b) return null;

        return b.attachRotation.setAngle ? b.attachRotation.setAngle : null;
    };

    const getActualBehaviorAttachRotationAddAngleData = () => {
        let b = master.getActualBehavior();
        if (!b) return null;

        return b.attachRotation.addAngle ? b.attachRotation.addAngle : null;
    };

    const getActualBehaviorAttachRotationRotationOffsetData = () => {
        let b = master.getActualBehavior();
        if (!b) return null;

        return b.attachRotation.rotationOffset ? b.attachRotation.rotationOffset : null;
    };

    const getActualBehaviorAttachRotationRepeatData = () => {
        let b = master.getActualBehavior();
        if (!b) return null;

        return b.attachRotation.repeat ? b.attachRotation.repeat : null;
    };

    const getActualBehaviorSetAngleData = () => {
        let b = master.getActualBehavior();
        if (!b) return null;

        return b.setAngle ? b.setAngle : null;
    };

    const getActualBehaviorAddAngleData = () => {
        let b = master.getActualBehavior();
        if (!b) return null;

        return b.addAngle ? b.addAngle : null;
    };

    const getActualBehaviorRotationOffsetData = () => {
        let b = master.getActualBehavior();
        if (!b) return null;

        return b.rotationOffset ? b.rotationOffset : null;
    };

    const setRotationSpeed = (_rotationSpeed) => {
        rotationSpeed = _rotationSpeed;
    };

    const setRotationAngleDestiny = (_rotationAngleDestiny) => {
        rotationAngleDestiny = _rotationAngleDestiny;
    };

    const setRotationOffset = (_rotationOffset) => {
        rotationOffset = _rotationOffset;
    };

    const setFinishRotation = (_finishRotation) => {
        finishRotation = _finishRotation;
    };

    const setMaster = (_master) => {
        master = _master;
    }

    const getRotationAngle = () => {
        return rotationAngle;
    }

    const getRotationOffset = () => {
        return rotationOffset;
    }

    this.init = init;
    this.setRotationSpeed = setRotationSpeed;
    this.startRotationBehavior = startRotationBehavior;
    this.updateRotationAngle = updateRotationAngle;
    this.updateRotateAction = updateRotateAction;
    this.checkNormalPos = checkNormalPos;
    this.drawSprite = drawSprite;
    this.drawSprite2 = drawSprite2;
    this.getRotationAngle = getRotationAngle;
    this.getRotateImage = getRotateImage;
    this.getRotationOffset = getRotationOffset;


}