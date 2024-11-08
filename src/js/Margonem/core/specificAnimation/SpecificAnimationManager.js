let SpecificAnimation = require('core/specificAnimation/SpecificAnimation.js');
let SpecificAnimationMechanism = require('core/specificAnimation/SpecificAnimationMechanism.js');

module.exports = function() {

    const animation = {};
    let specificAnimationMechanism;

    const init = () => {
        specificAnimationMechanism = new SpecificAnimationMechanism();
    }

    const addToAnimation = (id, o) => {
        animation[id] = o;
    }

    const removeFromAnimation = (id) => {
        delete animation[id];
    }

    const getFreeId = () => {
        let id = 0;
        while (animation[id]) {
            id++;
        }
        return id;
    }

    const update = (dt) => {
        for (let k in animation) {
            animation[k].update(dt);
        }
    }

    const draw = (dt) => {
        for (let k in animation) {
            animation[k].draw(dt);
        }
    }

    const getAnimation = () => {
        return animation;
    }

    const createAnimation = (data) => {
        let id = getFreeId();
        let specificAnimation = new SpecificAnimation();

        addToAnimation(id, specificAnimation);

        specificAnimation.init(id, data);

        return specificAnimation;
    }

    const removeAnimation = (id) => {

        removeFromAnimation(id);
    }

    const getSpecificAnimationMechanism = () => {
        return specificAnimationMechanism;
    }

    const getById = (id) => {
        if (!animation[id]) return null;
        return animation[id];
    }

    const checkElementHaveSpecificAnimation = ($element) => {
        let $sA = $element.find('.specific-animation');
        return $sA.length ? true : false
    };

    this.getSpecificAnimationIdFromElement = ($element) => {
        let $sA = this.getSpecificAnimationFromElement($element);

        return $sA.attr('specific-animation-id');
    };

    this.getSpecificAnimationFromElement = ($element) => {
        return $element.find('.specific-animation');
    };

    this.deleteSpecificAnimationInElementIfExist = ($element) => {
        let id = this.getSpecificAnimationIdFromElement($element);
        if (id != null) {
            this.removeAnimation(id);
            let $specificAnimation = this.getSpecificAnimationFromElement($element)
            $specificAnimation.remove();
        }
    };

    this.createBlinkedAnimation = ($element, width, height, color, speed, addClass) => {
        let animationData = specificAnimationMechanism.getBlinkData(width, height, color, false, speed);
        let animation = Engine.specificAnimationManager.createAnimation(animationData);
        let $canvas = animation.get$Canvas();

        $canvas.addClass(addClass);

        $element.prepend($canvas);
    };

    this.init = init;
    this.draw = draw;
    this.update = update;
    this.checkElementHaveSpecificAnimation = checkElementHaveSpecificAnimation;
    this.getById = getById;
    this.getSpecificAnimationMechanism = getSpecificAnimationMechanism;
    this.createAnimation = createAnimation;
    this.removeAnimation = removeAnimation;
    this.getAnimation = getAnimation;
}