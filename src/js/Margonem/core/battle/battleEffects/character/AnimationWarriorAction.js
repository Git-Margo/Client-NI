let IconAnimation = require('core/battle/battleEffects/character/IconAnimation');
let BFD = require('core/battle/battleEffects/BattleEffectsData');

module.exports = function() {

    let allCanvas;
    let allAnimation;
    let warriorId;
    //let effectId        = null;
    let list = {};

    // let allIconReady = false;

    this.init = (_warriorId, _effectId) => {
        this.setWarriorId(_warriorId);
        //this.setEffectId(_effectId);
        // this.initAllAnimation();
        // this.initAllCanvas();
    };

    this.getList = () => {
        return list;
    }

    this.setWarriorId = (_warriorId) => {
        warriorId = _warriorId;
    };

    //this.setEffectId = (_effectId) => {
    //    effectId = _effectId;
    //};

    // this.initAllAnimation = () => {
    //     allAnimation = {};
    //     allAnimation[BFD.params.position.TOP] = [];
    //     allAnimation[BFD.params.position.RIGHT] = [];
    //     allAnimation[BFD.params.position.BOTTOM] = [];
    //     allAnimation[BFD.params.position.LEFT] = [];
    //     allAnimation[BFD.params.position.CENTER] = [];
    // };

    // this.getAllAnimation = () => {
    //     return allAnimation;
    // };

    this.checkAllAnimationEmpty = () => {
        // for (let position in allAnimation) {
        //     if (allAnimation[position].length) return false
        // }

        return !Object.keys(list).length

        // return true;
    };

    // this.clearAllCanvas = () => {
    //     for (let position in allCanvas) {
    //         let ctx         = allCanvas[position].ctx;
    //         let canvas      = allCanvas[position].canvas;
    //
    //
    //         ctx.clearRect(0,0, canvas.width, canvas.height);
    //     }
    // };

    // this.initAllCanvas = () => {
    //
    //     let $warrior = Engine.battle.getBattleArea().find('.other-id-battle-' + warriorId);
    //
    //
    //     let canvasTop = $warrior.find('.canvas-icon-wrapper-top')[0];
    //     let canvasRight = $warrior.find('.canvas-icon-wrapper-right')[0];
    //     let canvasBottom = $warrior.find('.canvas-icon-wrapper-bottom')[0];
    //     let canvasLeft = $warrior.find('.canvas-icon-wrapper-left')[0];
    //     let canvasCenter = $warrior.find('.canvas-icon-wrapper-center')[0];
    //
    //     allCanvas = {};
    //
    //     allCanvas[BFD.params.position.TOP] = {
    //         canvas: canvasTop,
    //         ctx: canvasTop.getContext('2d'),
    //         sumWidth: null,
    //         maxHeight: null
    //     }
    //
    //     allCanvas[BFD.params.position.RIGHT] = {
    //         canvas: canvasRight,
    //         ctx: canvasRight.getContext('2d'),
    //         sumWidth: null,
    //         maxHeight: null
    //     }
    //
    //     allCanvas[BFD.params.position.BOTTOM] = {
    //         canvas: canvasBottom,
    //         ctx: canvasBottom.getContext('2d'),
    //         sumWidth: null,
    //         maxHeight: null
    //     }
    //
    //     allCanvas[BFD.params.position.LEFT] = {
    //         canvas: canvasLeft,
    //         ctx: canvasLeft.getContext('2d'),
    //         sumWidth: null,
    //         maxHeight: null
    //     };
    //
    //     allCanvas[BFD.params.position.CENTER] = {
    //         canvas: canvasCenter,
    //         ctx: canvasCenter.getContext('2d'),
    //         sumWidth: null,
    //         maxHeight: null
    //     };
    // };

    this.initCanvas = () => {

    }

    this.updateData = (d) => {

        //let position        = d.data.params.position;
        //let animation       = this.createOneAnimationObject(d);
        let iconAnimation = new IconAnimation();

        let effectId = d.effectId;

        list[effectId] = iconAnimation;

        //this.addToAllAnimation(iconAnimation, position);

        iconAnimation.init();
        iconAnimation.updateData(this, d, warriorId);
        iconAnimation.startFetch();
    };


    this.removeIconAnimation = (effectId, position) => {
        //let index = this.getIndexOfIconAnimation(effectId, position);

        //this.removeIconByPositionAndIndex(index, position);
        list[effectId].remove();
        delete list[effectId];

    };

    // this.removeIconByPositionAndIndex = (index, position) => {
    //     let onePositionArray    = allAnimation[position];
    //
    //     onePositionArray.splice(index, 1);
    // };

    this.getIndexOfIconAnimation = (effectId, position) => {
        let onePositionArray = allAnimation[position];

        for (let i = 0; i < onePositionArray.length; i++) {
            let _effectId = onePositionArray[i].getData().effectId;
            if (_effectId == effectId) return i;
        }

        console.error('[AnimationWarriorAction.js, getIndexOfIconAnimation] Index not exist by data', effectId, position);

        return -1;
    };

    // this.checkAllFeachReady = () => {
    //     for (let position in allAnimation) {
    //
    //         let allIcon     = allAnimation[position];
    //
    //         for (let i = 0; i < allIcon.length; i++) {
    //             if (!allIcon[i].getFetchReady()) return false;
    //         }
    //     }
    //     return true;
    // };

    //this.manageAllIconReady = () => {
    // if (!this.checkAllFeachReady()) return;
    //
    // allIconReady = true;

    // for (let position in allCanvas) {
    //     allCanvas[position].maxHeight   = this.getMaxHeightOfFrame(position);
    //     allCanvas[position].sumWidth    = this.getSumWidthOfFrame(position);
    // }

    // this.rebuildCanvasSize();
    // this.rebuildCanvasPosition();
    //};

    // this.rebuildCanvasSize = () => {
    //     for (let position in allCanvas) {
    //
    //         let canvas = allCanvas[position].canvas;
    //
    //         let sumWidth    = allCanvas[position].sumWidth;
    //         let maxHeight   = allCanvas[position].maxHeight;
    //
    //         if (canvas.width != sumWidth)   canvas.width    = sumWidth;
    //         if (canvas.height != maxHeight) canvas.height   = maxHeight;
    //
    //     }
    // };

    // this.rebuildCanvasPosition = () => {
    //     let $warrior    = Engine.battle.getBattleArea().find('.other-id-battle-' + warriorId);
    //     let fw          = $warrior.width();
    //     let fh          = $warrior.height();
    //
    //     for (let position in allCanvas) {
    //
    //         //let funcName    = 'setPosition_' + position + 'Canvas';
    //         let sumWidth    = allCanvas[position].sumWidth;
    //         let maxHeight   = allCanvas[position].maxHeight;
    //
    //         let f;
    //
    //         switch (position) {
    //             case BFD.params.position.TOP:      f = this.setPosition_topCanvas;break
    //             case BFD.params.position.RIGHT:    f = this.setPosition_rightCanvas;break
    //             case BFD.params.position.BOTTOM:   f = this.setPosition_bottomCanvas;break
    //             case BFD.params.position.LEFT:     f = this.setPosition_leftCanvas;break
    //             case BFD.params.position.CENTER:   f = this.setPosition_centerCanvas;break
    //             default:
    //                 console.error('[AnimationWarriorAction.js, rebuildCanvasPosition] Position not exist!', position);
    //         }
    //
    //         let cssObject = f(fw, fh, maxHeight, sumWidth);
    //
    //         $(allCanvas[position].canvas).css(cssObject);
    //     }
    // };

    // this.setPosition_topCanvas = (fw, fh, maxHeight, sumWidth) => {
    //     return {
    //         top     : (-maxHeight) + 'px',
    //         left    : (fw / 2 - sumWidth / 2) + 'px'
    //     }
    // };
    //
    // this.setPosition_rightCanvas = (fw, fh, maxHeight, sumWidth) => {
    //     return {
    //         top     : (fh / 2 - maxHeight /2) + 'px',
    //         left    : (fw) + 'px'
    //     }
    // };
    //
    // this.setPosition_bottomCanvas = (fw, fh, maxHeight, sumWidth) => {
    //     return {
    //         top     : (fh) + 'px',
    //         left    : (fw / 2 - sumWidth / 2) + 'px'
    //     }
    // };
    //
    // this.setPosition_leftCanvas = (fw, fh, maxHeight, sumWidth) => {
    //     return {
    //         top     : (fh / 2 - maxHeight / 2) + 'px',
    //         left    : (-sumWidth) + 'px'
    //     }
    // };
    //
    // this.setPosition_centerCanvas = (fw, fh, maxHeight, sumWidth) => {
    //     return {
    //         top     : (fh / 2 - maxHeight / 2) + 'px',
    //         left    : (fw / 2 - sumWidth / 2) + 'px'
    //     }
    // };

    // this.getMaxHeightOfFrame = (position) => {
    //     let maxHeight   = 0;
    //     let allIcon     = allAnimation[position];
    //
    //     for (let i = 0; i < allIcon.length; i++) {
    //         let fh = allIcon[i].getFH();
    //         if (fh > maxHeight) maxHeight = fh
    //     }
    //     return maxHeight;
    // };
    //
    // this.getSumWidthOfFrame = (position) => {
    //     let sum   = 0;
    //     let allIcon     = allAnimation[position];
    //
    //     for (let i = 0; i < allIcon.length; i++) {
    //         let drawIcon =  allIcon[i].getDrawIcon();
    //         if (!drawIcon) continue;
    //         sum += allIcon[i].getFW();
    //
    //     }
    //     return sum;
    // };

    // this.addToAllAnimation = (iconAnimation, position) => {
    //     allAnimation[position].push(iconAnimation);
    // };

    this.update = (dt) => {
        // if (!allIconReady) return;

        for (let k in list) {
            list[k].update(dt);
        }

        // for (let position in allAnimation) {
        //
        //     let onePositionArray = allAnimation[position];
        //
        //     for (let i = 0; i < onePositionArray.length; i++) {
        //         onePositionArray[i].update(dt);
        //     }
        //
        // }
    };


    this.draw = () => {
        // if (!allIconReady) return;

        for (let k in list) {
            list[k].draw();
        }

        // for (let position in allAnimation) {
        //
        //     let onePositionArray = allAnimation[position];
        //     let ctx              = allCanvas[position].ctx;
        //     let canvas           = allCanvas[position].canvas;
        //
        //     ctx.clearRect(0,0, canvas.width, canvas.height);
        //
        //     for (let i = 0; i < onePositionArray.length; i++) {
        //         onePositionArray[i].draw(ctx, i);
        //     }
        //
        // }
    };

    this.start = (effectId) => {

    };

    this.stop = () => {

    };

};