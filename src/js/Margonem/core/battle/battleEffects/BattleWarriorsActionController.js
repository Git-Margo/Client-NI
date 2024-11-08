let TintWarriorAction = require('core/battle/battleEffects/character/TintWarriorAction');
let ShakeWarriorAction = require('core/battle/battleEffects/character/ShakeWarriorAction');
let AnimationWarriorAction = require('core/battle/battleEffects/character/AnimationWarriorAction');
let BFD = require('core/battle/battleEffects/BattleEffectsData');


module.exports = function() {

    let warriorsTintAction = {};
    let warriorsShakeAction = {};
    let warriorsAnimationAction = {};

    this.init = () => {

    };

    this.clearWarriorsActionController = () => {
        warriorsTintAction = {};
        warriorsShakeAction = {};
        warriorsAnimationAction = {};
    }

    this.getVars = () => {
        return [warriorsTintAction, warriorsShakeAction, warriorsAnimationAction];
    }

    this.updateData = (dataEffect) => {
        let effectName = dataEffect.data.effect;

        if (dataEffect.data.soundUrl) {
            Engine.soundManager.createBattleEffectSound(dataEffect.data.soundUrl)
        }

        if (effectName == BFD.effect.TINT) this.addTintAction(dataEffect);
        if (effectName == BFD.effect.SHAKE) this.addShakeAction(dataEffect);
        if (effectName == BFD.effect.ANIMATION) this.addAnimationAction(dataEffect);
    };

    this.addTintAction = (dataEffect) => {
        let warriorId = dataEffect.data.id;
        let dataWarrior = Engine.battle.getWarrior(warriorId);
        let tintWarriorAction = new TintWarriorAction();

        if (!warriorsTintAction[warriorId]) warriorsTintAction[warriorId] = {};

        let effectId = Engine.battle.battleEffectsController.getEmptyId(warriorsTintAction[warriorId]);
        dataEffect.effectId = effectId;

        warriorsTintAction[warriorId][effectId] = tintWarriorAction;

        warriorsTintAction[warriorId][effectId].updateData(dataEffect, dataWarrior);
        warriorsTintAction[warriorId][effectId].start();
    };

    this.addShakeAction = (dataEffect) => {
        let warriorId = dataEffect.data.id;
        let shakeWarriorAction = new ShakeWarriorAction();

        if (!warriorsShakeAction[warriorId]) warriorsShakeAction[warriorId] = {};

        let effectId = Engine.battle.battleEffectsController.getEmptyId(warriorsShakeAction[warriorId]);

        dataEffect.effectId = effectId;

        warriorsShakeAction[warriorId][effectId] = shakeWarriorAction;

        warriorsShakeAction[warriorId][effectId].updateData(dataEffect);
        warriorsShakeAction[warriorId][effectId].start();
    };

    this.addAnimationAction = (dataEffect) => {
        let warriorId = dataEffect.data.id;
        let animationWarriorAction = null;

        if (warriorsAnimationAction[warriorId]) animationWarriorAction = warriorsAnimationAction[warriorId];
        else {
            animationWarriorAction = new AnimationWarriorAction();
            warriorsAnimationAction[warriorId] = animationWarriorAction;

            animationWarriorAction.init(warriorId);
        }

        dataEffect.effectId = Engine.battle.battleEffectsController.getEmptyId(warriorsAnimationAction[warriorId].getList());


        animationWarriorAction.updateData(dataEffect);
    };

    this.removeAction = (oneData) => {

        if (oneData.data.effect == BFD.effect.SHAKE) this.removeShakeAction(oneData);
        if (oneData.data.effect == BFD.effect.TINT) this.removeTintAction(oneData);
        if (oneData.data.effect == BFD.effect.ANIMATION) this.removeAnimationAction(oneData)
    };

    this.removeShakeAction = (oneData) => {
        let warriorId = oneData.data.id;
        let effectId = oneData.effectId;

        if (!warriorsShakeAction[warriorId]) return;

        delete warriorsShakeAction[warriorId][effectId]
        if (!Object.keys(warriorsShakeAction[warriorId]).length) delete warriorsShakeAction[warriorId];
    };

    this.removeTintAction = (oneData) => {
        let warriorId = oneData.data.id;
        let effectId = oneData.effectId;

        if (!warriorsShakeAction[warriorId]) return;

        delete warriorsTintAction[warriorId][effectId];

        if (!Object.keys(warriorsTintAction[warriorId]).length) delete warriorsTintAction[warriorId];
    };

    this.removeAnimationAction = (oneData) => {
        let warriorId = oneData.data.id;
        let position = oneData.data.params.position;
        let effectId = oneData.effectId;

        warriorsAnimationAction[warriorId].removeIconAnimation(effectId, position);

        let allEmpty = warriorsAnimationAction[warriorId].checkAllAnimationEmpty();

        if (allEmpty) {
            //warriorsAnimationAction[warriorId].clearAllCanvas();
            delete warriorsAnimationAction[warriorId];

            //if (!Object.keys(warriorsAnimationAction[warriorId]).length) delete warriorsAnimationAction[warriorId];
        }
    };

    this.updateAllEffects = (dt) => {
        for (let char1 in warriorsTintAction) {

            let oneWarrior = warriorsTintAction[char1];

            for (let effectId in oneWarrior) {
                warriorsTintAction[char1][effectId].update(dt)
            }
        }

        for (let char2 in warriorsAnimationAction) {

            let oneWarrior = warriorsAnimationAction[char2];

            oneWarrior.update(dt)

            //for (let effectId in oneWarrior) {
            //    oneWarrior[char2].update(dt)
            //}
        }

    };

    this.drawAllEffects = () => {
        for (let char1 in warriorsTintAction) {

            let oneWarrior = warriorsTintAction[char1];

            for (let effectId in oneWarrior) {
                warriorsTintAction[char1][effectId].draw();
            }
        }

        for (let char2 in warriorsAnimationAction) {

            let oneWarrior = warriorsAnimationAction[char2];

            oneWarrior.draw()

            //for (let effectId in oneWarrior) {
            //    warriorsAnimationAction[char2].draw()
            //}
        }

    };

};