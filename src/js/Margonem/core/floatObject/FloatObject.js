let FloatObjectData = require('core/floatObject/FloatObjectData');
let RajGetSpecificData = require('core/raj/RajGetSpecificData');
var DynamicLightIdManager = require('core/night/DynamicLightIdManager');
var ObjectDynamicLightManager = require('core/night/ObjectDynamicLightManager');
var CanvasFade = require('core/canvasFade/CanvasFade.js');
var CanvasFadeData = require('core/canvasFade/CanvasFadeData.js');
let RajBehaviorCommons = require('core/raj/RajBehaviorCommons');
let BehaviorManager = require('core/raj/BehaviorManager');
let HeroDirectionData = require('core/characters/HeroDirectionData');
let VectorCalculate = require('core/VectorCalculate');
let RajRotation = require('core/raj/RajRotation');
let RajMoveNoise = require('core/raj/RajMoveNoise');
let RajScale = require('core/raj/RajScale');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let KindOrderObject = require('core/raj/kindOrderObject/KindOrderObject');
//let RajObject      			    = require('core/raj/RajObject');
let RajObjectInterface = require('core/raj/RajObjectInterface');
let RajData = require('core/raj/RajData');

module.exports = function() {

    let moduleData = {
        fileName: "FloatObject.js"
    };

    let id = null;
    let x = null;
    let y = null;
    let behaviorManager = null;

    let kind = FloatObjectData.kind.SPRITE;

    this.canvasObjectType = CanvasObjectTypeData.FLOAT_OBJECT;

    this.x = null; // back compatible
    this.y = null; // back compatible
    this.fh = null; // back compatible
    this.fw = null; // back compatible
    this.halffw = null; // back compatible
    this.ofsetX = 0; // back compatible
    this.ofsetY = 0; // back compatible
    this.frame = 0; // back compatible

    var speed = 5;
    var frameTime = 0;

    let frames = null;
    let activeFrame = null;
    let timePassed = 0;

    let srajData = null;
    let canvasFade = null;
    let xVector = null;
    let yVector = null;
    let color = null;
    let orderData = null;
    let alpha = 1;
    let show = true;
    let url = null;
    let ready = false;
    let image = null;
    let removed = false;

    let additionalData = null;

    let tpX = false;
    let tpY = false;
    let destinyX = false;
    let destinyY = false;

    let kindOrderObject = null;

    let rajRotation = null
    let rajMoveNoise = null
    let rajScale = null

    let objectDynamicLightManager;

    //let rajObject = null;

    const init = (data, _additionalData) => {
        //devConsoleLog([moduleData.fileName, 'init', data]);

        implementRajInterface();
        this.updateDataRajObject(data, _additionalData);

        initBehaviorManager();
        initRajRotation();
        initRajMoveNoise();
        initRajScale();
        behaviorManager.setBehaviorRepeat(FloatObjectData.defaultData.BEHAVIOR_REPEAT);

        initKindOrderObject(data);

        //setOrderData({
        //    kind : FloatObjectData.orderData.kind.FLOAT_OBJECT,
        //    v    : FloatObjectData.defaultData.V_ORDER
        //});

        if (data.behavior.randomFirstIndex) RajBehaviorCommons.updateRandomFirstIndex(data.behavior);

        setAdditionalData(_additionalData);

        setAllData(data);

        behaviorManager.setBehaviorData(data.behavior);

        loadImage();
        initDynamicLightFloatObjectManager();

        behaviorManager.setBehaviorList(prepareBehaviorList(copyStructure(data.behavior.list)));

        if (isset(srajData.behavior.repeat)) behaviorManager.setBehaviorRepeat(data.behavior.repeat);


        manageFadeInWithOnCreate();

        behaviorManager.callBehavior();
    };

    const implementRajInterface = () => {
        (new RajObjectInterface()).implementRajObject(this, RajData.FLOAT_OBJECT);
    }

    const initKindOrderObject = (data) => {
        kindOrderObject = new KindOrderObject();
        kindOrderObject.init();
    }

    const initRajRotation = () => {
        rajRotation = new RajRotation();
        rajRotation.init(this);
    };

    const initRajMoveNoise = () => {
        rajMoveNoise = new RajMoveNoise();
        rajMoveNoise.init(this);
    };

    const initRajScale = () => {
        rajScale = new RajScale();
        rajScale.init(this);
    };

    const initBehaviorManager = () => {
        behaviorManager = new BehaviorManager();
        behaviorManager.init(
            this,
            () => {
                clearStates()
            },
            () => {
                remove();
                Engine.floatObjectManager.remove(id);
            }
        );
        behaviorManager.setDefaultRepeat(FloatObjectData.defaultData.BEHAVIOR_REPEAT)
    };

    const setAdditionalData = (_additionalData) => {
        additionalData = _additionalData;
    }

    const createCanvasData = (width, height) => {
        let canvas = document.create("canvas");

        let canvasData = {
            canvas: canvas,
            ctx: canvas.getContext("2d")
        };

        canvasData.width = width * Math.SQRT2;
        canvasData.height = height * Math.SQRT2;

        return canvasData;
    };

    const manageFadeInWithOnCreate = () => {
        let fadeInWithOnCreate = true;

        if (isset(srajData.withCreateInstantFadeIn) && srajData.withCreateInstantFadeIn) fadeInWithOnCreate = false;

        if (fadeInWithOnCreate) createCanvasFadeIn();

    };

    const checkFadeOutWithOnRemove = () => {
        let fadeOutWithOnRemove = true;

        if (isset(srajData.withRemoveInstantFadeOut) && srajData.withRemoveInstantFadeOut) fadeOutWithOnRemove = false;

        return fadeOutWithOnRemove;
    };

    const createCanvasFadeIn = () => {
        let data = {
            action: CanvasFadeData.action.FADE_IN,
            finishAlpha: alpha,
            callback: () => {
                canvasFade = null;
            }
        };

        canvasFade = new CanvasFade();
        canvasFade.init();
        canvasFade.updateData(data);
    };


    const initDynamicLightFloatObjectManager = () => {

        objectDynamicLightManager = new ObjectDynamicLightManager();

        objectDynamicLightManager.init();

        //this.getObjectDynamicLightManager = () => {
        //    return objectDynamicLightManager
        //}

        //let dynamicLightIdManager = new DynamicLightIdManager();
        //dynamicLightIdManager.init();
        //
        //this.removeAllDynamicLights = () => {
        //
        //    let a = dynamicLightIdManager.getArrayOfDynamicLightIds();
        //
        //    for (let id of a) {
        //        Engine.dynamicLightsManager.rajRemoveActionBeyondManager(id);
        //    }
        //};
        //
        //this.removeDynamicLightId = (id) => {
        //    dynamicLightIdManager.removeDynamicLightId(id);
        //};
        //
        //this.addDynamicLightId = (id) => {
        //    if (dynamicLightIdManager.checkDynamicLightId(id)) {
        //        errorReport(moduleData, "addDynamicLightId", `Id ${id} already exist!`);
        //        return;
        //    }
        //    dynamicLightIdManager.addDynamicLightId(id);
        //};
    };

    const getObjectDynamicLightManager = () => {
        return objectDynamicLightManager
    }

    const setAllData = (data) => {
        setId(data.id);
        setSrajData(data);
        //setUrl(RajGetSpecificData.getCharacterData(data.url, additionalData));
        setX(RajGetSpecificData.getCharacterData(data.x, additionalData));
        setY(RajGetSpecificData.getCharacterData(data.y, additionalData));


        //if (isset(data.order)) {
        //    setOrderData(prepareOrderData(data.order));
        //}
        //
        //if (isset(data.kind))       setKind(data.kind);
        //if (isset(data.offsetX))    setOffsetX(data.offsetX);
        //if (isset(data.offsetY))    setOffsetY(data.offsetY);
        //
        //if (kind == FloatObjectData.kind.IDLE_FAKE_NPC_FRAME) {
        //    if (isset(data.dir))    setDir(RajGetSpecificData.getCharacterData(data.dir, additionalData));
        //    else                    setDir(HeroDirectionData.S);
        //}
        //
        //if (isset(data.color)) {
        //
        //    let c = data.color;
        //
        //    if (isset(c.r) && isset(c.g) && isset(c.b)) setColor(c);
        //    if (isset(c.a)) {
        //        setAlpha(c.a);
        //    }
        //
        //}

        setDataRelateWithImg(data)
    };

    const setDataRelateWithImg = (data) => {
        setUrl(RajGetSpecificData.getCharacterData(data.url, additionalData));

        if (isset(data.order)) {
            //setOrderData(prepareOrderData(data.order));
            let order = data.order;
            if (kindOrderObject.checkCorrectData(order)) {
                kindOrderObject.setOrderData(order);
            }
        }

        if (isset(data.kind)) setKind(data.kind);
        if (isset(data.offsetX)) setOffsetX(data.offsetX);
        if (isset(data.offsetY)) setOffsetY(data.offsetY);

        if (kind == FloatObjectData.kind.IDLE_FAKE_NPC_FRAME) {
            if (isset(data.dir)) setDir(RajGetSpecificData.getCharacterData(data.dir, additionalData));
            else setDir(HeroDirectionData.S);
        }

        if (isset(data.color)) {

            let c = data.color;

            if (isset(c.r) && isset(c.g) && isset(c.b)) setColor(c);
            if (isset(c.a)) {
                setAlpha(c.a);
            }

        }
    };

    const clearImageData = () => {
        setReady(false);
        setImage(null);
        setColor(null);
        setOffsetX(0);
        setOffsetY(0);
        setFrame(0);

        self.fw = null;
        self.fh = null;
        self.halffw = null;
        frames = null;
        activeFrame = 0;

    }

    const loadImage = () => {

        switch (kind) {
            case FloatObjectData.kind.SPRITE:
                loadSprite();
                break;
            case FloatObjectData.kind.GIF:
                loadGif(CFG.r_rajGraphics + url, 1);
                break;
            case FloatObjectData.kind.FAKE_NPC:
                loadGif(CFG.r_opath + fixSrc(url), 4);
                break;
            case FloatObjectData.kind.IDLE_FAKE_NPC_FRAME:
                loadGif(CFG.r_opath + fixSrc(url), 4);
                break;
        }

    };

    const loadSprite = () => {

        let self = this;

        Engine.imgLoader.onload(CFG.a_rajGraphics + url, false, false, (i) => {

            let _img;

            if (color) _img = getImageColorMask(i);
            else _img = i;

            setImage(_img);

            self.fw = i.width;
            self.fh = i.height;
            self.halffw = self.fw / 2;

            setReady(true);
        });
    };

    const loadGif = (fullUrl, divide) => {
        Engine.imgLoader.onload(fullUrl, {
                speed: false,
                externalSource: cdnUrl
            },
            (i, f) => {
                let data = getDataGif(f, i, divide);
                this.fw = data.fw;
                this.fh = data.fh;
                this.halffw = data.halffw;
                frames = data.frames;
                //image           = data.image;
                activeFrame = 0;

                setImage(data.image)
            },
            (i) => {
                afterOnload(i);
            },
            () => {
                fetchError();
            }
        );
    };

    const getDataGif = (f, i, divide) => {
        return {
            fw: f.hdr.width / divide,
            fh: f.hdr.height / divide,
            halffw: (this.fw / 2) / divide,
            frames: f.frames,
            image: i
        }
    };

    const afterOnload = (i) => {
        let _img;

        if (color) _img = getImageColorMask(i);
        else _img = i;

        setImage(_img);

        setReady(true);
    };

    const getImageColorMask = (i) => {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext("2d");

        canvas.width = i.width;
        canvas.height = i.height;

        ctx.drawImage(i, 0, 0);
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;

        ctx.fillRect(0, 0, i.width, i.height);

        return canvas;
    };

    const fetchError = () => {
        errorReport(moduleData.fileName, "fetchError", "Error fetch error :" + url);
    };

    //const checkOrderDataCorrect = (_orderData) => {
    //    const FUNC = "checkOrderDataCorrect";
    //
    //    if (isset(_orderData.kind)) {
    //        const KIND      = FloatObjectData.orderData.kind;
    //        const possibles = [KIND.MAP_OBJECT, KIND.FLOAT_OBJECT];
    //
    //        if (!possibles.includes(_orderData.kind)) {
    //            errorReport(moduleData.fileName, FUNC, "order kind not exist!", _orderData);
    //            return false;
    //        }
    //    }
    //
    //    if (isset(_orderData.v)) {
    //        if (!isNumberFunc(_orderData.v)) {
    //            errorReport(moduleData.fileName, FUNC, "v is not number!", _orderData);
    //            return false;
    //        }
    //    }
    //
    //    return true;
    //};

    //const prepareOrderData = (_orderData) => {
    //    let _kind    = FloatObjectData.orderData.kind.FLOAT_OBJECT;
    //    let v        = 0;
    //
    //    if (isset(_orderData.v))     v       = _orderData.v;
    //    if (isset(_orderData.kind))  _kind   = _orderData.kind;
    //
    //    return {
    //        kind : _kind,
    //        v    : v
    //    }
    //};

    const getOrder = () => {

        //const KIND      = FloatObjectData.orderData.kind;
        //const v         = orderData.v;
        //const _y        = !isNumberFunc(y) ? 0 : y;
        //
        //switch (orderData.kind) {
        //    case KIND.FLOAT_OBJECT:    return 200 + v;
        //    case KIND.MAP_OBJECT:      return _y + v;
        //}
        return kindOrderObject.getOrder(y);
    };

    const attachRotationManage = () => {
        let attachRotation = getActualBehaviorAttachRotation();

        if (attachRotation == null) return;

        startRotationBehavior(true);
    };

    const attachMoveNoiseManage = () => {
        let attachMoveNoise = getActualBehaviorAttachMoveNoise();

        if (attachMoveNoise == null) return;

        rajMoveNoise.startMoveNoiseBehavior();
    };

    const attachScaleManager = () => {
        // if (id == "attachScaleTest") debugger;

        let attachScale = getActualBehaviorAttachScale();

        if (attachScale == null) return;

        rajScale.startScaleBehavior();
    };

    const update = (dt) => {
        if (!ready) return;

        let breakBehavior = behaviorManager.getBreakBehavior();

        if (breakBehavior) {
            behaviorManager.callBehavior();
            return;
        }

        rajRotation.updateRotationAngle(dt);
        rajMoveNoise.updateMoveNoise(dt);
        rajScale.updateScale(dt);

        const behaviorName = behaviorManager.getActualBehaviorName();
        const BEHAVIOR = FloatObjectData.behavior;
        const KIND = FloatObjectData.kind;

        switch (behaviorName) {
            case BEHAVIOR.IDLE:
                updateIdleAction(dt);
                break;
            case BEHAVIOR.IDLE_GIF_ANIMATION:
                updateIdleAnimationAction(dt);
                break;
            case BEHAVIOR.MOVE_FROM_VECTORS:
                updateMoveFromVectorsAction(dt);
                break;
            case BEHAVIOR.MOVE_TO_CORDS:
                updateMoveToCordsAction(dt);
                break;
            case BEHAVIOR.FOLLOW:
                updateFollowAction(dt);
                break;
            case BEHAVIOR.TP_TO_CORDS:
                updateTpToCordsAction(dt);
                break;
            case BEHAVIOR.TP_ON_OTHER_SIDE:
                updateTpOnOtherSideAction(dt);
                break;
            case BEHAVIOR.FADE_IN:
                updateFadeInAction(dt);
                break;
            case BEHAVIOR.FADE_OUT:
                updateFadeOutAction(dt);
                break;
            case BEHAVIOR.ROTATION:
                rajRotation.updateRotateAction(dt);
                break;
            case BEHAVIOR.CHANGE_IMG:
                updateChangeImgAction(dt);
                break;
        }

        if (canvasFade) canvasFade.update(dt);

        switch (kind) {
            case KIND.SPRITE:
                updateSprite(dt);
                break;
            case KIND.GIF:
            case KIND.FAKE_NPC:
            case KIND.IDLE_FAKE_NPC_FRAME:
                updateGif(dt);
                break;
        }

    };

    const updateFadeInAction = (dt) => {
        if (kind == FloatObjectData.kind.FAKE_NPC) setFrame(0);
        if (kind == FloatObjectData.kind.IDLE_FAKE_NPC_FRAME) setFrame(0);
    };

    const updateChangeImgAction = () => {
        if (kind == FloatObjectData.kind.FAKE_NPC) setFrame(0);
        if (kind == FloatObjectData.kind.IDLE_FAKE_NPC_FRAME) setFrame(0);
    };

    const updateFadeOutAction = (dt) => {
        if (kind == FloatObjectData.kind.FAKE_NPC) setFrame(0);
        if (kind == FloatObjectData.kind.IDLE_FAKE_NPC_FRAME) setFrame(0);
    };

    const updateRotateAction = (dt) => {
        if (finishRotation) {
            setFinishRotation(false);
            behaviorManager.callBehavior();
        }
    };

    const updateIdleAction = (dt) => {
        behaviorManager.decreaseDuration(dt);

        if (kind == FloatObjectData.kind.FAKE_NPC) setFrame(0);
        if (kind == FloatObjectData.kind.IDLE_FAKE_NPC_FRAME) setFrame(0);

        let duration = behaviorManager.getDuration();
        if (duration < 0) behaviorManager.callBehavior();
    };

    const updateIdleAnimationAction = (dt) => {
        if (kind == FloatObjectData.kind.FAKE_NPC) setFrame(0);
        if (kind == FloatObjectData.kind.IDLE_FAKE_NPC_FRAME) setFrame(0);

        if (frames.length != activeFrame + 1) return;

        timePassed = 0;
        activeFrame = 0;

        behaviorManager.callBehavior();
    };

    const updateMoveFromVectorsAction = (dt) => {
        let newPosition = VectorCalculate.getNewPositionFromVectors(x, y, xVector, yVector, dt);
        let reachEdge = VectorCalculate.getReachEdge(newPosition, this.fw, this.fh);


        setX(newPosition.newX);
        setY(newPosition.newY);

        if (kind == FloatObjectData.kind.FAKE_NPC) updateSteps(dt);

        if (!reachEdge) return;

        behaviorManager.callBehavior();
    };

    const updateMoveToCordsAction = (dt) => {

        let newPosition = VectorCalculate.getNewPositionFromVectors(x, y, xVector, yVector, dt);

        setX(newPosition.newX);
        setY(newPosition.newY);

        if (kind == FloatObjectData.kind.FAKE_NPC) updateSteps(dt);

        let reach = VectorCalculate.checkReachCord({
            x: x,
            y: y
        }, {
            x: destinyX,
            y: destinyY
        }, {
            xVector: xVector,
            yVector: yVector
        });
        if (!reach) return;

        setX(destinyX);
        setY(destinyY);

        behaviorManager.callBehavior();
    };

    const updateFollowAction = (dt) => {
        behaviorManager.decreaseDuration(dt);
        let newPosition = VectorCalculate.getNewPositionFromVectors(x, y, xVector, yVector, dt);

        setX(newPosition.newX);
        setY(newPosition.newY);

        if (kind == FloatObjectData.kind.FAKE_NPC) updateSteps(dt);


        let duration = behaviorManager.getDuration();
        if (duration < 0) {
            behaviorManager.callBehavior();
            return
        }

        let reach = VectorCalculate.checkReachCord({
            x: x,
            y: y
        }, {
            x: destinyX,
            y: destinyY
        }, {
            xVector: xVector,
            yVector: yVector
        });
        if (!reach) return;

        setX(destinyX);
        setY(destinyY);

        behaviorManager.callBehavior();
    };

    const updateTpToCordsAction = (dt) => {
        if (kind == FloatObjectData.kind.FAKE_NPC) setFrame(0);
        if (kind == FloatObjectData.kind.IDLE_FAKE_NPC_FRAME) setFrame(0);
    };

    const updateTpOnOtherSideAction = (dt) => {
        if (kind == FloatObjectData.kind.FAKE_NPC) setFrame(0);
        if (kind == FloatObjectData.kind.IDLE_FAKE_NPC_FRAME) setFrame(0);
    };

    const updateGif = (dt) => {
        let shouldUpdate = frames && frames.length > 1 && dt;

        if (!shouldUpdate) return;


        updateActiveFrame(dt);
    };

    const updateSteps = (dt) => {
        let l = dt * speed;
        frameTime += l;

        if (frameTime >= 0.5) {
            setFrame(this.frame + 1);
            frameTime = frameTime % 0.5;
            if (this.frame == 4) setFrame(0);
        }
    };

    const updateActiveFrame = (dt) => {
        timePassed += dt * 100;

        if (frames[activeFrame].delay > timePassed) return;

        timePassed = timePassed - frames[activeFrame].delay;
        activeFrame = (frames.length == activeFrame + 1 ? 0 : activeFrame + 1);
    };

    const updateSprite = (dt) => {

    };

    const draw = (ctx) => {
        if (!ready) return;

        if (Engine.rajCharacterHide.checkHideObject(this)) {
            return;
        }

        let globalAlpha = calculateGlobalAlpha();
        let shouldUpdateAlpha = !removed && globalAlpha != 1;

        if (shouldUpdateAlpha) {
            // ctx.save();
            ctx.globalAlpha = globalAlpha;
        }


        switch (kind) {
            case FloatObjectData.kind.SPRITE:
                drawSprite(ctx);
                break;
            case FloatObjectData.kind.GIF:
            case FloatObjectData.kind.FAKE_NPC:
            case FloatObjectData.kind.IDLE_FAKE_NPC_FRAME:
                drawGif(ctx);
                break;
        }

        // if (shouldUpdateAlpha) ctx.restore();
        if (shouldUpdateAlpha) ctx.globalAlpha = 1;
    };

    const calculateGlobalAlpha = () => {
        if (!show) return 0;
        return canvasFade ? canvasFade.getFadeValue() : alpha;
    };

    const drawGif = (ctx) => {
        let tileSize = CFG.tileSize;
        let halfTileSize = CFG.halfTileSize;

        let fw = this.fw;
        let fh = this.fh;
        let halffw = this.halffw;
        let dirsAmount = 1;

        let bgX = 0;
        let bgY = 0;

        if (kind == FloatObjectData.kind.FAKE_NPC) {
            bgY = getFakeNpcBgY(xVector, yVector, fh);
            bgX = this.frame * fw;
            dirsAmount = 4;
        }

        if (kind == FloatObjectData.kind.IDLE_FAKE_NPC_FRAME) {
            bgY = this.dirIndex * fh;
            bgX = this.frame * fw;
            dirsAmount = 4;
        }

        let mapShift = Engine.mapShift.getShift();

        let horizontalCorrect = null;
        if (kind == FloatObjectData.kind.FAKE_NPC || kind == FloatObjectData.kind.IDLE_FAKE_NPC_FRAME) horizontalCorrect = 0;
        else horizontalCorrect = halfTileSize - halffw;


        let left = Math.round(x * tileSize + horizontalCorrect + this.ofsetX - (Engine.map.offset[0] - mapShift[0]));
        let top = Math.round(y * tileSize - fh + tileSize + this.ofsetY - (Engine.map.offset[1] - mapShift[1]));

        left += rajMoveNoise.getXOffsetMoveNoise();
        top += rajMoveNoise.getYOffsetMoveNoise();

        // let scale =  rajScale.getScale();

        if (!rajRotation.checkNormalPos()) {

            let rotateImage = rajRotation.getRotateImage(image, fw, fh, bgX, bgY + (activeFrame * fh * dirsAmount));

            left -= rotateImage.width / 2 - fw / 2;
            top -= rotateImage.height / 2 - fh / 2;

            drawImage(ctx, left, top, rotateImage, rotateImage.width, rotateImage.height, 0, 0);

        } else {

            // let clipImg     = Engine.map.clipObject(left, top, fw, fh);
            //
            // if (!clipImg) return;
            //
            // ctx.drawImage(
            //     image,
            //     bgX + clipImg.backgroundPositionX,      bgY + (activeFrame * fh * dirsAmount) + clipImg.backgroundPositionY,
            //     clipImg.width,                          clipImg.height,
            //     clipImg.left,                           clipImg.top,
            //     clipImg.width,                          clipImg.height
            // );

            drawImage(ctx, left, top, image, fw, fh, bgX, bgY + (activeFrame * fh * dirsAmount));

        }



    };

    const getFakeNpcBgY = (_xVector, _yVector, _fh) => {
        let _bgY = 0;

        if (_xVector == null && _yVector == null) return _bgY;

        if (Math.abs(_xVector) > Math.abs(_yVector)) {
            if (_xVector > 0) _bgY = _fh * 2;
            else _bgY = _fh;
        } else {
            if (_yVector > 0) _bgY = 0;
            else _bgY = _fh * 3;
        }

        return _bgY;
    }

    const drawSprite = (ctx) => {

        let tileSize = CFG.tileSize;
        let halfTileSize = CFG.halfTileSize;

        let mapShift = Engine.mapShift.getShift();

        // let scale           =  rajScale.getScale();

        var left = Math.round(x * tileSize + halfTileSize - this.halffw + this.ofsetX - Engine.map.offset[0] - mapShift[0]);
        var top = Math.round(y * tileSize - this.fh + tileSize + this.ofsetY - Engine.map.offset[1] - mapShift[1]);

        if (rajMoveNoise) {
            left += rajMoveNoise.getXOffsetMoveNoise();
            top += rajMoveNoise.getYOffsetMoveNoise();
        }

        if (!rajRotation.checkNormalPos()) {

            let rotateImage = rajRotation.getRotateImage(image, image.width, image.height, 0, 0);

            left -= rotateImage.width / 2 - image.width / 2;
            top -= rotateImage.height / 2 - image.height / 2;

            drawImage(ctx, left, top, rotateImage, rotateImage.width, rotateImage.height, 0, 0);
        } else {
            drawImage(ctx, left, top, image, image.width, image.height, 0, 0);
        }

    };

    const drawImage = (ctx, left, top, image, frameWidth, frameHeight, backgroundPositionX, backgroundPositionY) => {
        let clipImg = null;
        let widthScale = null;
        let heightScale = null;

        let scale = rajScale.getScale();

        if (scale == 1) {
            clipImg = Engine.map.clipObject(left, top, frameWidth, frameHeight);

            if (!clipImg) {
                return;
            }

            widthScale = clipImg.width;
            heightScale = clipImg.height;

        } else {

            let scaleOffsetX = rajScale.getScaleOffsetX();
            let scaleOffsetY = rajScale.getScaleOffsetY();

            clipImg = Engine.map.clipObjectScale(left, top, frameWidth, frameHeight, scale, scaleOffsetX, scaleOffsetY);

            if (!clipImg) {
                return;
            }

            widthScale = clipImg.widthScale;
            heightScale = clipImg.heightScale;
        }

        if (CFG.debugRender) {
            ctx.strokeStyle = "yellow";
            ctx.strokeRect(clipImg.left, clipImg.top, clipImg.width, clipImg.height)
        }

        ctx.drawImage(
            image,
            backgroundPositionX + clipImg.backgroundPositionX, backgroundPositionY + clipImg.backgroundPositionY,
            widthScale, heightScale,
            clipImg.left, clipImg.top,
            clipImg.width, clipImg.height
        );

        if (CFG.debugRender) {
            ctx.fillStyle = "yellow";
            ctx.font = "12px";
            ctx.fillText(id, clipImg.left + 2, clipImg.top + 10);
        }
    }

    const remove = () => {
        this.getObjectDynamicLightManager().removeAllDynamicLights();
        this.getObjectDynamicLightManager().removeAllDynamicBehaviorLights();
        setRemoved(true);
    };

    const prepareBehaviorList = (_behaviorList) => {
        let newBehaviorList = [];

        for (let k in _behaviorList) {

            let oneBehavior = _behaviorList[k];
            let name = oneBehavior.name;

            switch (name) {
                case FloatObjectData.behavior.MOVE_TO_START_CORDS:
                    oneBehavior.name = FloatObjectData.behavior.MOVE_TO_CORDS;
                    oneBehavior.x = this.startX;
                    oneBehavior.y = this.startY;
                    newBehaviorList.push(oneBehavior)
                    break;
                case FloatObjectData.behavior.TP_START_CORDS:
                    oneBehavior.name = FloatObjectData.behavior.TP;
                    oneBehavior.x = this.startX;
                    oneBehavior.y = this.startY;
                    newBehaviorList.push(oneBehavior);
                    break;
                default:
                    newBehaviorList.push(_behaviorList[k]);
                    break;

            }
        }

        return newBehaviorList;
    };

    const startBehavior = (name) => {

        switch (name) {
            case FloatObjectData.behavior.IDLE:
                startIdleBehavior();
                break;
            case FloatObjectData.behavior.IDLE_GIF_ANIMATION:
                startIdleAnimateBehavior();
                break;
            case FloatObjectData.behavior.MOVE_FROM_VECTORS:
                startMoveFromVectorsBehavior();
                break;
            case FloatObjectData.behavior.MOVE_TO_CORDS:
                startMoveToCordsBehavior();
                break;
            case FloatObjectData.behavior.FOLLOW:
                startFollowBehavior();
                break;
            case FloatObjectData.behavior.TP_TO_CORDS:
                startTpBehavior();
                break;
            case FloatObjectData.behavior.TP_ON_OTHER_SIDE:
                startTpOnOtherSideBehavior();
                break;
            case FloatObjectData.behavior.FADE_IN:
                startFadeInBehavior();
                break;
            case FloatObjectData.behavior.FADE_OUT:
                startFadeOutBehavior();
                break;
            case FloatObjectData.behavior.ROTATION:
                startRotationBehavior(false);
                break;
            case FloatObjectData.behavior.CHANGE_IMG:
                startChangeImg(false);
                break;
            default:
                errorReport(moduleData.fileName, "startBehavior", "Incorrect name!", name);
        }
    };

    const startRotationBehavior = (fromAttachRotationData) => {
        rajRotation.startRotationBehavior(fromAttachRotationData);
    };

    const startChangeImg = () => {
        let data = {};

        let orderData = getActualBehaviorOrderData();
        let kindData = getActualBehaviorKindData();
        let offsetXData = getActualBehaviorOffsetXData();
        let offsetYData = getActualBehaviorOffsetYData();
        let colorData = getActualBehaviorColorData();
        let urlData = getActualBehaviorUrlData();


        if (orderData) data.order = orderData;
        if (kindData) data.kind = kindData;
        if (offsetXData) data.offsetX = offsetXData;
        if (offsetYData) data.offsetY = offsetYData;
        if (colorData) data.color = colorData;
        if (urlData) data.url = urlData;

        clearImageData();
        setDataRelateWithImg(data);
        loadImage();
        callBehavior();
    }

    const startFadeOutBehavior = () => {
        if (canvasFade) canvasFade = null;

        let instantData = getActualBehaviorInstantData();

        attachRotationManage();
        attachMoveNoiseManage()

        if (instantData) {
            setShow(false);
            behaviorManager.callBehavior();
            return;
        }

        let data = {
            action: CanvasFadeData.action.FADE_OUT,
            finishAlpha: alpha,
            callback: () => {
                canvasFade = null;
                setShow(false);
                behaviorManager.callBehavior();
            }
        };

        canvasFade = new CanvasFade();

        canvasFade.init();
        canvasFade.updateData(data);
    };

    const startFadeInBehavior = () => {
        if (canvasFade) canvasFade = null;

        let instantData = getActualBehaviorInstantData();

        attachRotationManage();
        attachMoveNoiseManage()
        setShow(true);

        if (instantData) {
            behaviorManager.callBehavior();
            return;
        }

        let data = {
            action: CanvasFadeData.action.FADE_IN,
            finishAlpha: alpha,
            callback: () => {
                canvasFade = null;
                behaviorManager.callBehavior();
            }
        };

        canvasFade = new CanvasFade();

        canvasFade.init();
        canvasFade.updateData(data);
    };

    const startTpBehavior = () => {
        let tpData = getActualBehaviorTpData();

        setTpX(RajGetSpecificData.getCharacterData(tpData.x, additionalData));
        setTpY(RajGetSpecificData.getCharacterData(tpData.y, additionalData));

        setX(tpX);
        setY(tpY);

        behaviorManager.callBehavior();
    };

    const startTpOnOtherSideBehavior = () => {
        let tileSize = CFG.tileSize;

        let actualX = x * tileSize;
        let actualY = y * tileSize;

        let maxX = (Engine.map.size.x + 2) * tileSize;
        let maxY = (Engine.map.size.y + 2) * tileSize;

        if (actualX < 0 - this.fw) actualX = maxX;
        if (actualX > maxX) actualX = 0;

        if (actualY < 0 - this.fh) actualY = maxY;
        if (actualY > maxY) actualY = 0;

        setX(actualX / tileSize);
        setY(actualY / tileSize);

        behaviorManager.callBehavior();
    }

    const startIdleBehavior = () => {
        let durationData = behaviorManager.getActualBehaviorDurationData();

        if (durationData != null) behaviorManager.setDuration(durationData);
        attachRotationManage();
        attachMoveNoiseManage();
        attachScaleManager();
    };

    const startIdleAnimateBehavior = () => {
        //console.log('startIdleAnimateBehavior')
        timePassed = 0;
        activeFrame = 0;
    };

    const startMoveFromVectorsBehavior = () => {
        let _xVector = getActualBehaviorXVectorData();
        let _yVector = getActualBehaviorYVectorData();

        _xVector = _xVector == null ? FloatObjectData.defaultData.X_VECTOR : _xVector;
        _yVector = _yVector == null ? FloatObjectData.defaultData.Y_VECTOR : _yVector;

        setXVector(_xVector);
        setYVector(_yVector);

        attachRotationManage();
        attachMoveNoiseManage();
        attachScaleManager();
    };

    const startMoveToCordsBehavior = () => {
        let destinyData = getActualBehaviorDestinyData();
        let speedData = getActualBehaviorSpeedData();
        let pos = getRxRyFromSrajData({
            x: destinyData.x,
            y: destinyData.y
        });


        setDestinyX(pos.rx);
        setDestinyY(pos.ry);

        speedData = speedData == null ? FloatObjectData.defaultData.SPEED : speedData;

        let data = VectorCalculate.getNewVectorsFromDestinyAndPowerOfVectors({
                x: x,
                y: y
            }, {
                x: destinyX,
                y: destinyY
            },
            speedData
        );

        setXVector(data.newXVector);
        setYVector(data.newYVector);

        attachRotationManage();
        attachMoveNoiseManage();
        attachScaleManager();
    };

    const startFollowBehavior = () => {
        let destinyData = getActualBehaviorDestinyData();
        let speedData = getActualBehaviorSpeedData();
        let pos = getRxRyFromSrajData({
            x: destinyData.x,
            y: destinyData.y
        });


        setDestinyX(pos.rx);
        setDestinyY(pos.ry);

        speedData = speedData == null ? FloatObjectData.defaultData.SPEED : speedData;

        let data = VectorCalculate.getNewVectorsFromDestinyAndPowerOfVectors({
                x: x,
                y: y
            }, {
                x: destinyX,
                y: destinyY
            },
            speedData
        );

        setXVector(data.newXVector);
        setYVector(data.newYVector);

        attachRotationManage();
        attachMoveNoiseManage()
        attachScaleManager();

        let durationData = behaviorManager.getActualBehaviorDurationData();

        if (durationData != null) behaviorManager.setDuration(durationData);
    };

    const getRxRyFromSrajData = (data) => {
        return {
            rx: RajGetSpecificData.getCharacterData(data.x, additionalData),
            ry: RajGetSpecificData.getCharacterData(data.y, additionalData)
        };
    };

    const clearStates = () => {
        setDestinyX(null);
        setDestinyY(null);
        setTpX(null);
        setTpY(null);
        behaviorManager.setDuration(FloatObjectData.defaultData.BEHAVIOR_DURATION);
    };

    const serverRayControllerData = (data) => {
        //Engine.rajController.parseObject(data, false, {floatObjectId: id});
        Engine.rajController.parseObject(data, false, additionalData);
    };

    const getActualBehavior = () => {
        return behaviorManager.getActualBehavior();
    };

    const getActualBehaviorOrderData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return isset(b.order) ? b.order : null;
    };

    const getActualBehaviorKindData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return isset(b.kind) ? b.kind : null;
    };

    const getActualBehaviorOffsetXData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return isset(b.offsetX) ? b.offsetX : null;
    };

    const getActualBehaviorOffsetYData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return isset(b.offsetY) ? b.offsetY : null;
    };

    const getActualBehaviorColorData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return isset(b.color) ? b.color : null;
    };

    const getActualBehaviorUrlData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return isset(b.url) ? b.url : null;
    };

    const getActualBehaviorTpData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return {
            x: b.x,
            y: b.y
        };
    };

    const getActualBehaviorInstantData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.instant ? true : false;
    };

    const getActualInstantFadeInData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return isset(b.instantFadeIn) ? b.instantFadeIn : null;
    };

    const getActualInstantFadeOutData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return isset(b.instantFadeOut) ? b.instantFadeOut : null;
    };

    const getActualBehaviorSpeedData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.speed ? b.speed : null;
    };

    const getActualBehaviorAttachRotation = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.attachRotation ? b.attachRotation : null;
    };

    const getActualBehaviorAttachRotationAddAngleData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.attachRotation.addAngle ? b.attachRotation.addAngle : null;
    };

    const getActualBehaviorAttachRotationRotationOffsetData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.attachRotation.rotationOffset ? b.attachRotation.rotationOffset : null;
    };

    const getActualBehaviorDestinyData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return {
            x: b.x,
            y: b.y
        };
    };

    const getActualBehaviorXVectorData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return isset(b.xVector) ? b.xVector : null;
    };

    const getActualBehaviorYVectorData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return isset(b.yVector) ? b.yVector : null;;
    };

    const getActualBehaviorAttachMoveNoise = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.attachMoveNoise ? b.attachMoveNoise : null;
    };

    const getActualBehaviorAttachScale = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.attachScale ? b.attachScale : null;
    }

    const setDestinyY = (_destinyY) => {
        destinyY = _destinyY;
    };

    const setShow = (_show) => {
        show = _show
    };

    const setReady = (_ready) => {
        ready = _ready;
    };

    const setDestinyX = (_destinyX) => {
        destinyX = _destinyX;
    };

    const setRemoved = (_removed) => {
        removed = _removed;
    };

    const setOffsetX = (_offsetX) => {
        this.ofsetX = _offsetX;
    };

    const setOffsetY = (_offsetY) => {
        this.ofsetY = _offsetY;
    };

    const setFrame = (_frame) => {
        this.frame = _frame;
    };

    const setDir = (dir) => {
        this.dir = dir;
        this.dirIndex = HeroDirectionData.dirMapping.indexOf(dir);
    };

    const setXVector = (_xVector) => {
        xVector = _xVector;
    };

    const setKind = (_kind) => {
        kind = _kind;
    };

    //const setOrderData = (data) => {
    //    orderData = {
    //        kind : data.kind,
    //        v    : isset(data.v) ? data.v : 0
    //    };
    //};

    const setYVector = (_yVector) => {
        yVector = _yVector;
    };

    const setId = (_id) => {
        id = _id;
    };

    const getId = () => id;

    const setSrajData = (_srajData) => {
        srajData = _srajData;
    };

    const setTpX = (_tpX) => {
        tpX = _tpX;
    };

    const setTpY = (_tpY) => {
        tpY = _tpY;
    };

    const setX = (_x) => {
        x = _x;
        this.x = _x;
        this.rx = _x;
    };

    const setY = (_y) => {
        y = _y;
        this.y = _y;
        this.ry = _y;
    };

    const setUrl = (_url) => {
        url = _url;
    };

    const setColor = (_color) => {
        if (_color == null) {
            color = null;
            return
        }

        color = {
            r: _color.r,
            g: _color.g,
            b: _color.b
        }
    };

    const setAlpha = (_alpha) => {
        alpha = _alpha;
    };

    const getAllBehaviorFinished = () => {
        return behaviorManager.getAllBehaviorFinished();
    };

    const callBehavior = () => {
        behaviorManager.callBehavior();
    }

    const setBreakBehavior = (_breakBehavior) => {
        behaviorManager.setBreakBehavior(_breakBehavior);
    };

    const setNewBehaviourData = (_newBehaviourData) => {
        behaviorManager.setNewBehaviorData(_newBehaviourData);
    }

    const setImage = (_image) => {
        image = _image;
    }

    const getImg = () => {
        return url
    };

    const getAlpha = () => alpha;
    const getReady = () => ready;
    const getRemoved = () => removed;

    this.init = init;
    this.update = update;
    this.draw = draw;
    this.remove = remove;
    this.callBehavior = callBehavior;
    this.startBehavior = startBehavior;
    this.serverRayControllerData = serverRayControllerData;
    this.checkFadeOutWithOnRemove = checkFadeOutWithOnRemove;
    this.getAllBehaviorFinished = getAllBehaviorFinished;
    this.getRemoved = getRemoved;
    this.getAlpha = getAlpha;
    this.getOrder = getOrder;
    this.getActualBehavior = getActualBehavior;
    this.getActualBehaviorSpeedData = getActualBehaviorSpeedData;
    this.getId = getId
    this.getImg = getImg;
    this.getReady = getReady;
    this.setBreakBehavior = setBreakBehavior
    this.setNewBehaviourData = setNewBehaviourData
    this.prepareBehaviorList = prepareBehaviorList;
    this.getObjectDynamicLightManager = getObjectDynamicLightManager;

};