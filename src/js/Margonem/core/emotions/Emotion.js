var EmotionsData = require('core/emotions/EmotionsData');


var Emotion = function(parameters, data, onEnd) {
    var self = this;
    this.type = data.type;
    this.sourceType = data.sourceType;
    this.sourceId = data.sourceId;
    this.targetType = data.targetType;
    this.targetId = data.targetId;
    this.endTime = data.endTime;
    this.parameters = parameters; //emo parameters from objects tab
    this.source = null;
    this.target = null;
    this.isNPC = false;
    this.frame = 0;
    this.frames = 0;
    this.loop = 0;
    this.startPos = null;
    this.currentPos = null;
    this.endPos = null;
    this.aAndB = null;
    this.isStatic = false;
    this.stopBeforeMove = 0;
    this.stopAfterUse = 10;
    this.framesBeforeInTarget = null;
    this.framTime = 0;
    this.timePassed = 0;
    this.amoundFrames = 0;
    this.inTarget = false;
    this.opacity = 1;
    this.afterUse = false;
    this.revert = false;
    this.lenghtEmoOnSelfList = 0;
    this.leftModif = 0;

    let display = true;
    let bubbleEmo = null;

    let jumpLastTs = ts();
    let jumpY = 0;

    this.update = function(dt) {
        this.checkEnd();
        this.drawObject(dt);
        this.doAction(dt);
        this.updateJump();
        this.fadeOutEmo();
    };

    let lastTs = ts();

    this.updateJump = () => {
        if (!this.parameters.jump) return;

        if (!this.checkCanJump()) {
            jumpY = 0;
            return;
        }

        let speed = 4;
        let y = Math.floor(Math.abs(Math.sin(speed * ts() / 1000 - jumpLastTs)) * 100) / 100
        jumpY = y * 5;
        // jumpY = Math.round(jumpY);
    };

    this.checkCanJump = () => {
        if (!this.parameters.jumpCondition) return true;
        return this.parameters.jumpCondition();
    }

    this.setDisplay = (_display) => {
        display = _display;
    };

    this.getDisplay = () => {
        return display;
    };

    this.setStaticAnimation = function(state) {
        if (IE) this.staticAnimation = true;
        else this.staticAnimation = false; //state;    - allow to animation in emo
    };

    this.fadeOutEmo = function() {
        if (!this.afterUse)
            return;
        if (this.stopAfterUse > 0) {
            this.stopAfterUse--;
            return;
        }
        this.opacity -= 0.06;
        if (this.opacity < 0.1) {
            this.opacity = 0;
            this.delete();
            onEnd(this);
            Engine.emotions.manageDisplayOfNpcEmo(this.sourceType, this.sourceId);
        }
    };

    this.getMadnessTargetHeight = () => {
        let targetHeight = this.target ? this.target.fh : this.source.fh;

        switch (this.sourceType) {
            case EmotionsData.OBJECT_TYPE.HERO:
            case EmotionsData.OBJECT_TYPE.OTHER:
                return 0;
            case EmotionsData.OBJECT_TYPE.NPC:
            case EmotionsData.OBJECT_TYPE.PET:
                return 0;
        }

        errorReport('Emotion.js', 'getMadnessTargetHeight', 'Incorrect this.sourceType', this.sourceType);

        return 0;
    };

    this.draw = function(ctx) {
        //var targetHeight = this.target ? this.target.fh : this.source.fh;



        let mapShift = Engine.mapShift.getShift();

        var left = this.rx * 32 + 16 - this.fw / 2 +
            //var left = this.rx * 32 + 16  +
            (isset(this.offsetX) ? this.offsetX : 0) -
            Engine.map.offset[0] - mapShift[0] + (typeof(this.leftPosMod) != 'undefined' ? this.leftPosMod : 0);

        //var top = this.ry * 32 - this.fw + 32 + (!this.isNPC ? (48 - targetHeight) : 0) + //this.ry * 32 - this.fw + 32 +
        var top = this.ry * 32 - this.fh + 32 + self.getMadnessTargetHeight() +
            (isset(this.offsetY) ? this.offsetY : 0) -
            Engine.map.offset[1] - mapShift[1];

        left += this.leftModif;
        top = top + jumpY;

        left = Math.round(left)
        top = Math.round(top)

        if (this.staticAnimation) {
            if (this.img) ctx.drawImage(this.img, 0, 0, this.fw, this.fh, left, top, this.fw, this.fh);
            else if (this.sprite) ctx.drawImage(this.sprite, 0, 0, this.fw, this.fh, left, top, this.fw, this.fh);
            ctx.globalAlpha = 1;
            return;
        }

        var bgX = 0,
            bgY = 0;

        if (this.revert) bgX = (this.amoundFrames - this.frame) * this.fh;
        else bgX = this.frame * this.fh;

        if (self.getDisplay()) {

            // top = top + jumpY;

            ctx.globalAlpha = this.opacity;

            if (this.checkDrawBubbleEmo()) this.drawBubbleEmo(ctx, left, top);

            if (this.img) {
                ctx.drawImage(this.img, bgY, bgX, this.fw, this.fh, left, top, this.fw, this.fh);
            } else if (this.sprite && typeof(this.activeFrame) != 'undefined' && this.frames.length > 0) {
                ctx.drawImage(this.sprite, bgX, bgY + (this.activeFrame * this.fh), this.fw, this.fh, left, top, this.fw, this.fh);
            }
            ctx.globalAlpha = 1;
        }
    };

    this.checkDrawBubbleEmo = () => {
        return this.sourceType == EmotionsData.OBJECT_TYPE.NPC &&
            Engine.npcs.isTalkNpc(this.source.d.id) &&
            this.type !== EmotionsData.NAME.BATTLE; // exception for talkNpc, which starts fight from dialog
    }

    this.loadBubbleEmo = () => {
        let path = CFG.r_epath + 'speech_bubble.gif';
        Engine.imgLoader.onload(path, {
            speed: true,
            externalSource: cdnUrl
        }, false, (i) => {
            bubbleEmo = i;
        });
    };

    this.drawBubbleEmo = (ctx, left, top) => {
        if (!bubbleEmo) return;

        ctx.drawImage(
            bubbleEmo,
            left - bubbleEmo.width / 2 + this.fw / 2,
            top - bubbleEmo.height / 2 + Math.max(this.fh, 24) / 2
        );
    };

    this.initBubbleImage = () => {
        if (this.sourceType != EmotionsData.OBJECT_TYPE.NPC) return;
    };

    this.initId = function() {
        //if (self.isNPC) {
        if (this.sourceType == EmotionsData.OBJECT_TYPE.NPC) {
            this.source = Engine.npcs.getById(this.sourceId);
            if (this.source == undefined) this.source = this.getCharacterById(this.sourceId, this.sourceType);
            return this.source;
        }

        if (this.sourceType == EmotionsData.OBJECT_TYPE.PET) {
            this.source = Engine.hero.getPet();
            return this.source;
        }

        this.source = this.getCharacterById(this.sourceId, this.sourceType);

        if (this.targetId != '0') {
            this.target = this.getCharacterById(this.targetId, this.targetType);
            if (!this.target) {
                return false;
            }
        }
        return true;
    };

    this.getCharacterById = function(id, sourceType) {
        // if (Engine.hero.d.id == id) {
        // 	return Engine.hero;
        // } else {
        // 	return Engine.others.getById(id);
        // }
        switch (sourceType) {
            case EmotionsData.OBJECT_TYPE.HERO:
                return Engine.hero;
            case EmotionsData.OBJECT_TYPE.OTHER:
                return Engine.others.getById(id);
            case EmotionsData.OBJECT_TYPE.NPC:
                return Engine.npcs.getById(id);
            default:
                errorReport("Emotion.js", "getCharacterById", "Incorrect type of self.sourceType Emo!", self.sourceType);
        }
    };

    this.getOrder = function() {
        return self.ry + 1;
    };

    this.delete = function() {
        if (this.gifTimeOut) clearTimeout(this.gifTimeOut);
        if (self.exit) self.exit();
    };

    this.setImagePath = function() {
        this.path = this.parameters.path ? this.parameters.path : CFG.r_epath;
        this.name = this.parameters.filename ? this.parameters.filename : this.type;
    };

    this.setIsNpc = () => {
        this.isNPC = this.sourceType == EmotionsData.OBJECT_TYPE.NPC;
    }

    this.withCreateObject = function() {
        // if (self.parameters.action == 'ScriptEmo') {
        if (self.parameters.action == EmotionsData.ACTION.SCRIPT_EMO) {
            self.startScriptEmo();
            return;
        }
        //self.isNPC = npc;
        self.setIsNpc();
        var initEmo = self.initId();
        self.init();
        if (this.sourceType == EmotionsData.OBJECT_TYPE.NPC) self.loadBubbleEmo();
        if (!initEmo) {
            this.delete();
            onEnd(this);
            return;
        }
        self.initBubbleImage();
        self.setImagePath();
        self.setXYOffset();
        self.setStartAndEndPos();
        self.createObject();
        //self.setStaticAnimation(Engine.opt(8));
        self.setStaticAnimation(!isSettingsOptionsInterfaceAnimationOn());
    };

    this.clearRenderVariables = function() {
        self.afterUse = false;
        self.frame = 0;
        self.framTime = 0;
        self.opacity = 1;
        self.timePassed = 0;
        self.activeFrame = 0;
        self.loop = 0;
    };

    this.renew = function() {
        var initEmo = self.initId();
        if (!initEmo) {
            this.delete();
            onEnd(this);
            // if (self.sourceType == EmotionsData.OBJECT_TYPE.NPC) Engine.npcs.manageDisplayOfNpcEmo(self.sourceId);
            Engine.emotions.manageDisplayOfNpcEmo(this.sourceType, this.sourceId);
            return;
        }
        self.clearRenderVariables();
        self.setImagePath();
        self.setXYOffset();
        self.setStartAndEndPos();
        //self.setStaticAnimation(Engine.opt(8));
        self.setStaticAnimation(!isSettingsOptionsInterfaceAnimationOn());
    };

    this.startScriptEmo = () => {
        $.getScript('https://www.margonem.pl/js/' + this.parameters.filename + '.min.js')
    }

};
module.exports = Emotion;