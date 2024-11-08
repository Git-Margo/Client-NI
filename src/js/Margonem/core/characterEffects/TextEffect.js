let CharacterEffect = require('core/characterEffects/CharacterEffect');
let TextObject = require('core/canvasObject/TextObject');
let TextOffset = require('core/canvasObject/TextOffset');
let RajObjectInterface = require('core/raj/RajObjectInterface');
let RajData = require('core/raj/RajData');

let TextEffect = function() {

    let timePassed = null;
    let betweenPassed = null;
    let duration = 5;
    let between = 5;
    let text = null;
    let textIndex = null;
    let callTextQuantity = null;
    let canDraw = false;
    let waitForStop = false;
    let textObject = null;

    this.textOrder = null;


    const init = (_id, _data) => {
        implementRajInterface();
        this.updateDataRajObject(_data);
        this.initObject(_id, _data);
        initTextObject();


        if (isset(_data.params.duration)) setDuration(_data.params.duration);
        if (isset(_data.params.between)) setBetween(_data.params.between);

        setText(_data.params.text);
        initTextOrder();
        start();
    };

    const implementRajInterface = () => {
        (new RajObjectInterface()).implementRajObject(this, RajData.CHARACTER_EFFECT);
    }

    const countTextOrder = () => {
        let data = this.getData();
        let effect = data.effect;
        let kind = data.target.kind
        let id = data.target.id

        let textEffectArray = Engine.characterEffectsMapManager.getEffectsByEffectNameAndMaster(effect, kind, id);

        if (!textEffectArray.length) return 0;

        let maxTextOrder = 0;

        for (let k in textEffectArray) {
            let textOrder = textEffectArray[k].textOrder;
            if (maxTextOrder < textOrder) maxTextOrder = textOrder;
        }

        return maxTextOrder + 1;
    }

    const setTextOrder = (_textOrder) => {
        this.textOrder = _textOrder
    }

    const initTextOrder = () => {
        let textOrder = countTextOrder();
        //console.log(textOrder)
        setTextOrder(textOrder);
    }

    const initTextObject = () => {
        textObject = new TextObject();
    };

    const setText = (_text) => {
        text = _text;
        //console.log(text);
    };

    const setDuration = (_duration) => {
        duration = _duration;
    };

    const setBetween = (_between) => {
        between = _between;
    };

    const manageCanDraw = (dt) => {
        if (between == 0) {
            canDraw = true;
            return;
        }

        if (betweenPassed == 0) {
            canDraw = true;
            return;
        }

        betweenPassed -= dt;

        if (betweenPassed < 0) {

            betweenPassed = 0;
            canDraw = true;

        } else canDraw = false;

    };

    const update = (dt) => {

        manageCanDraw(dt);

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


        if (waitForStop) {
            //if (betweenPassed == 0) stop();
            if (betweenPassed == 0) this.setCycleFinish(true);
            return;
        }

        if (!canDraw) return;

        let stickMap = this.data.params.stickMap;

        if (stickMap) {
            if (!checkPosInStickMapIsSet()) this.setPosFromMaster()
        } else {
            if (this.getMaster()) this.setPosFromMaster()
        }

        timePassed += dt;

        if (timePassed > duration) endDurationOfOneWord()

    };

    const checkPosInStickMapIsSet = () => {
        return this.getX() !== null && this.getY() !== null
    };

    const endDurationOfOneWord = () => {
        let textLength = text.length
        let stickMap = isset(this.data.params.stickMap);
        let random = this.data.params.random;

        timePassed = timePassed - duration;
        betweenPassed = between;
        canDraw = false;

        if (stickMap) {
            this.setX(null);
            this.setY(null);
        }

        callTextQuantity++;

        textIndex = getNewTextIndex(textLength, random, textIndex);
        callTextQuantity = getNewCallTextQuantity(textLength, random, callTextQuantity);
        //console.log(text[textIndex])

        if (callTextQuantity > textLength - 1) {
            waitForStop = true;
            return
        }

        if (!this.isDelayBeforeInParams() && between == 0) canDraw = true; // if between 0 prevent blink text


    };

    const getNewTextIndex = (textLength, random, _textIndex) => {
        if (random) _textIndex = Math.round(Math.random() * (textLength - 1));
        else _textIndex++;

        return _textIndex
    };

    const getNewCallTextQuantity = (textLength, random, _callTextQuantity) => {
        if (!random) return _callTextQuantity

        if (random == 'ONE') _callTextQuantity = textLength;

        return _callTextQuantity
    };

    const start = () => {
        let textLength = text.length
        let random = this.data.params.random;

        timePassed = 0;
        betweenPassed = 0;
        textIndex = getNewTextIndex(textLength, random, -1);
        callTextQuantity = 0;
        waitForStop = false;
        //console.log(text[textIndex])
        this.setPosFromMaster()
        this.setCycleFinish(false);
        this.setDelayBefore(0);
        this.setDelayAfter(0);
    };

    const stop = () => {
        let id = this.getId();
        let actualRepeat = this.getActualRepeat();
        actualRepeat++;
        this.setCycleFinish(false);
        this.setActualRepeat(actualRepeat);
        Engine.characterEffectsMapManager.afterStopAction(id)
    };

    const draw = (ctx) => {
        if (!canDraw) return;

        let master = this.getMaster();

        if (!master) return;

        if (this.shouldBreakDrawFromDelayBefore()) return;
        if (this.getCycleFinish()) return;

        let pos = this.getPos();
        let offsetTop = 0;
        offsetTop += TextOffset.addOffsetOfEmo(master, false);
        offsetTop += TextOffset.addOffsetOfKillTimer(master, false);
        offsetTop += TextOffset.addOffsetOfDataDrawNick(master);

        let left = Math.round(pos.left);
        let top = Math.round(pos.top) - offsetTop;
        let data = this.getData();
        let height = data.params.height;
        let color = data.params.color;

        height = height ? height : 11;
        //color   = color ? ("rgb(" + color + ")") : "#ffffff"
        color = color ? (`rgb(${color.r},${color.g},${color.b})`) : "#ffffff";

        ctx.save();
        textObject.draw(ctx, text[textIndex], left, top, height, color);
        ctx.restore();
    };

    this.start = start;
    this.stop = stop;
    this.init = init;
    this.update = update;
    this.draw = draw;

};

TextEffect.prototype = Object.create(CharacterEffect.prototype);
TextEffect.prototype.constructor = TextEffect;

module.exports = TextEffect;