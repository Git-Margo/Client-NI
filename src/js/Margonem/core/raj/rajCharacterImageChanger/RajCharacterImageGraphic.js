const RajCharacterImageChangerData = require('core/raj/rajCharacterImageChanger/RajCharacterImageChangerData');
let KindOrderObject = require('core/raj/kindOrderObject/KindOrderObject');

module.exports = function() {

    const moduleData = {
        fileName: "RajCharacterImageGraphic.js"
    };

    this.rx = null; // back compatible
    this.ry = null; // back compatible
    this.fh = null; // back compatible
    this.fw = null; // back compatible
    this.halffw = null; // back compatible
    this.ofsetX = 0; // back compatible
    this.ofsetY = 0; // back compatible
    this.frame = 0; // back compatible

    let frames = null;
    let activeFrame = null;
    let timePassed = 0;
    let image = null;

    let ready = null;

    let behind
    let orderData;
    let url;
    let kind;
    let characterHide;
    let actualRepeat;
    let repeat;
    let parentId;
    let id;
    let target;
    let targetImage;
    let drawTarget;
    let pos;
    let kindOrderObject;

    const init = (_drawTarget) => {
        initKindOrderObject();
        setDefaultData();
        setDrawTarget(_drawTarget)

        setReady(false)
    };

    const initKindOrderObject = (_data) => {
        kindOrderObject = new KindOrderObject();
        kindOrderObject.init();
    }

    const setDrawTarget = (_drawTarget) => {
        drawTarget = _drawTarget
    }

    const setDefaultBehind = () => {
        setBehind(RajCharacterImageChangerData.DEFAULT_DATA.BEHIND)
    };

    const setDefaultActualRepeat = () => {
        setActualRepeat(RajCharacterImageChangerData.DEFAULT_DATA.ACTUAL_REPEAT)
    };

    const setDefaultRepeat = () => {
        setRepeat(RajCharacterImageChangerData.DEFAULT_DATA.REPEAT)
    };

    //const setDefaultOrderData = () => {
    //    const DEFAULT_DATA = RajCharacterImageChangerData.DEFAULT_DATA;
    //
    //    setOrderData(DEFAULT_DATA.ORDER_DATA_KIND, DEFAULT_DATA.ORDER_DATA_V);
    //};

    const setDefaultCharacterHide = () => {
        setCharacterHide(RajCharacterImageChangerData.DEFAULT_DATA.CHARACTER_HIDE)
    }

    const setDefaultData = () => {
        setDefaultBehind();
        setDefaultActualRepeat();
        setDefaultRepeat();
        setDefaultCharacterHide();
        //setDefaultOrderData();
    }

    const updateData = (_id, _parentId, data, _target, additionalData) => {
        setTarget(_target);
        setId(_id);
        setParentId(_parentId);
        setKind(data.kind);
        setUrl(data.url);

        if (target) {
            updatePosByParent();
        }

        if (isset(data.characterShow)) setCharacterHide(!data.characterShow);
        if (isset(data.repeat)) setRepeat(data.repeat);
        if (isset(data.behind)) setBehind(data);
        if (isset(data.external_properties)) Engine.rajController.parseObject(data.external_properties, false, additionalData);

        if (isset(data.order)) {
            let order = data.order;
            if (kindOrderObject.checkCorrectData(order)) {
                kindOrderObject.setOrderData(order);
            }
        }


        loadGif(CFG.r_rajGraphics + url, 1);
        updateCharacterHide();
        managetTargetImage();
    };

    const updateCharacterHide = () => {
        getEngine().rajCharacterImageChangerManager.setCharacterHide(target.getId(), "NPC", characterHide);
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

        let width = f.hdr.width;

        return {
            fw: width / divide,
            fh: f.hdr.height / divide,
            halffw: (width / 2) / divide,
            frames: f.frames,
            image: i
        }
    };

    const fetchError = () => {
        errorReport(moduleData.fileName, "fetchError", "Error fetch error :" + url);
    };

    const afterOnload = (i) => {
        setImage(i);
        setReady(true);
    };

    const update = (dt) => {
        if (ready) {
            updatePosByParent();

            updateActiveFrame(dt);
        }

        managetTargetImage();
    };

    const updatePosByParent = () => {
        this.rx = target.getX();
        this.ry = target.getY();
    }

    const managetTargetImage = () => {
        if (!target.getOnloadProperImg()) {
            return
        }

        if (targetImage) {
            return
        }

        setTargetImage(target.getSprite());
    };

    const setTargetImage = (_targetImage) => {
        targetImage = _targetImage
    };

    const draw = (ctx) => {
        //if (!ready) {
        //    return;
        //}

        if (!behind) {
            drawTargetIcon(ctx);
        }

        if (ready) {
            drawGif(ctx);
        }

        if (behind) {
            drawTargetIcon(ctx);
        }
    };

    const drawTargetIcon = (ctx) => {
        if (drawTarget && !characterHide) {
            target.drawIcon(ctx, true);
        }
    }

    const updateActiveFrame = (dt) => {
        timePassed += dt * 100;

        if (frames[activeFrame].delay > timePassed) return;

        timePassed = timePassed - frames[activeFrame].delay;
        //activeFrame     = (frames.length == activeFrame + 1 ? 0 : activeFrame + 1);


        if (frames.length == activeFrame + 1) {
            activeFrame = 0;
            onFinish();
        } else {
            activeFrame++;
        }
    };

    const getOrder = () => {
        //const ORDER_DATA_KIND       = RajCharacterImageChangerData.ORDER_DATA_KIND;
        //const v                     = orderData.v;
        //
        //let y                       = target.getY();
        //y                           = !isNumberFunc(y) ? 0 : y;
        //
        //switch (orderData.kind) {
        //    case ORDER_DATA_KIND.FLOAT_OBJECT:    return 200 + v;
        //    case ORDER_DATA_KIND.MAP_OBJECT:      return y + v;
        //}

        return kindOrderObject.getOrder(this.ry);
    };

    const setUrl = (_url) => {
        url = _url;
    };

    //const setOrderData = (kind, v) => {
    //    orderData = {
    //        kind : kind,
    //        v    : v
    //    };
    //};

    const setKind = (_kind) => {
        kind = _kind;
    };


    const getKind = () => {
        return kind;
    };

    const setCharacterHide = (_kind) => {
        characterHide = _kind;
    };

    const setRepeat = (_repeat) => {
        repeat = _repeat;
    };

    const setActualRepeat = (_actualRepeat) => {
        actualRepeat = _actualRepeat;
    };

    const setBehind = (_behind) => {
        behind = _behind;
    };

    const setParentId = (_parentId) => {
        parentId = _parentId;
    };

    const getParentId = () => {
        return parentId;
    }

    const setId = (_id) => {
        id = _id;
    };

    const setTarget = (_target) => {
        target = _target;
    };

    const setImage = (_image) => {
        image = _image;
    }

    const setReady = (_ready) => {
        ready = _ready;
    }

    const drawGif = (ctx) => {
        let tileSize = CFG.tileSize;
        let halfTileSize = CFG.halfTileSize;

        let fw = this.fw;
        let fh = this.fh;
        let halffw = this.halffw;
        let dirsAmount = 1;

        let bgX = this.frame * fw;
        let bgY = 0;
        let mapShift = getEngine().mapShift.getShift();
        let horizontalCorrect = halfTileSize - halffw;

        let left = Math.round(this.rx * tileSize + horizontalCorrect + this.ofsetX - (Engine.map.offset[0] - mapShift[0]));
        let top = Math.round(this.ry * tileSize - fh + tileSize + this.ofsetY - (Engine.map.offset[1] - mapShift[1]));

        //left += rajMoveNoise.getXMoveNoise() * tileSize;
        //top  += rajMoveNoise.getYMoveNoise() * tileSize;


        let clipImg = Engine.map.clipObject(left, top, fw, fh);

        if (!clipImg) return;

        ctx.drawImage(
            image,
            bgX + clipImg.backgroundPositionX, bgY + (activeFrame * fh * dirsAmount) + clipImg.backgroundPositionY,
            clipImg.width, clipImg.height,
            clipImg.left, clipImg.top,
            clipImg.width, clipImg.height
        );
    };

    const onFinish = () => {
        if (repeat === true) {
            return
        }

        setActualRepeat(actualRepeat + 1);

        if (actualRepeat == repeat) {
            remove();
            return
        }
    };

    const remove = () => {

        //console.log('remove',id);

        if (characterHide) {
            setCharacterHide(false);
            target.resetActiveFrame();
        }

        updateCharacterHide();
        getEngine().rajCharacterImageChangerManager.removeCharacterImageGraphic(id);
    };

    const getTarget = () => {
        return target;
    }


    this.init = init;
    this.updateData = updateData;
    this.update = update;
    this.draw = draw;
    this.getOrder = getOrder;
    this.getKind = getKind;
    this.getParentId = getParentId;
    this.getTarget = getTarget;

}