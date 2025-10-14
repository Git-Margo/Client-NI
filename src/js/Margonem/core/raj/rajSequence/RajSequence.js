let SequenceBehaviour = require('@core/raj/rajSequence/RajSequenceBehavior.js');
let RajSequenceData = require('@core/raj/rajSequence/RajSequenceData.js');
let RajSequenceBehaviorData = require('@core/raj/rajSequence/RajSequenceBehaviorData.js');

module.exports = function() {

    let actualBehaviourIndex;
    let behaviourList;
    let id;
    let repeat;
    let actualRepeat;
    let moduleData = {
        fileName: "RajSequence.js"
    };
    let additionalData = null;


    const init = () => {
        resetStates();
        setRepeat(RajSequenceData.defaultData.REPEAT);
        setActualRepeat(RajSequenceData.defaultData.REPEAT);
    };

    const setAdditionalData = (_additionalData) => {
        additionalData = _additionalData;
    }

    const getAdditionalData = () => {
        return additionalData;
    }

    const updateData = (data, _additionalData) => {

        setId(data.id);
        if (data.behavior.repeat) setRepeat(data.repeat);

        let list = data.behavior.list;

        setAdditionalData(_additionalData);

        for (let k in list) {
            let sequenceBehaviour = new SequenceBehaviour(this);

            addToBehaviourList(sequenceBehaviour);

            sequenceBehaviour.init();
            sequenceBehaviour.updateData(list[k]);
        }

        manageOfRajCaseAndCallProperBehavior(0);

    };

    const update = (dt) => {
        let multiUpdate = false; // create to synchronus screenEffects and sequence
        let tempActualBehaviourIndex;

        while (tempActualBehaviourIndex != actualBehaviourIndex) {

            tempActualBehaviourIndex = actualBehaviourIndex;

            if (!checkActualBehaviourExist()) return;

            if (multiUpdate) dt = 0;

            let actualBehaviour = getActualBehaviour();
            actualBehaviour.update(dt);

            multiUpdate = true;

            if (actualBehaviourIndex == null) return

        }

    };

    const resetStates = () => {
        setActualBehaviourIndex(0);
        clearBehaviourList();
    };

    const clearBehaviourList = () => {
        behaviourList = [];
    };

    const addToBehaviourList = (behaviour) => {
        behaviourList.push(behaviour);
    };

    //const getBehaviourToRenderEffect = () => {
    //    if (actualBehaviourIndex == null) return null;
    //    if (!checkActualBehaviourExist()) return null;
    //
    //    return getActualBehaviour();
    //};

    const checkActualBehaviourExist = () => {

        if (behaviourList[actualBehaviourIndex]) return true;

        errorReport(moduleData.fileName, "checkActualBehaviourExist", `behaviour index ${actualBehaviourIndex} not exist!`, behaviourList);

        return false;
    };

    const setNextBehaviour = (passedLifeTime) => {
        if (checkActualBehaviourIsLast()) {

            increaseActualRepeat();

            if (checkRepeatIsOver()) {
                remove();
                return
            }

            setActualBehaviourIndex(0);
            resetLifeTimeInAllBehaviour();
            resetActualRepeatInAllBehaviour();
            resetActualDelayBeforeInAllBehaviour();
            resetSrayWasCallInAllBehaviour();

            manageOfRajCaseAndCallProperBehavior(passedLifeTime);
            return;
        }

        actualBehaviourIndex++;

        let actualBehavior = getActualBehaviour();
        if (actualBehavior) {
            actualBehavior.setActualLifeTime(passedLifeTime);
        }

        manageOfRajCaseAndCallProperBehavior(passedLifeTime);
    };

    const manageOfRajCaseAndCallProperBehavior = (passedLifeTime) => {
        let srajCase = getActualBehaviour().getSrajCase();

        //if (srajCase != null) {
        //    if (Engine.rajCase.checkFullFillCase(srajCase)) {}
        //    else {
        //        setNextBehaviour(passedLifeTime);
        //    }
        //}
        if (srajCase == null) return;

        if (!Engine.rajCase.checkFullFillCase(srajCase)) setNextBehaviour(passedLifeTime);
    };

    const resetLifeTimeInAllBehaviour = () => {
        for (let k in behaviourList) {
            behaviourList[k].setActualLifeTime(0);
        }
    };

    const resetActualRepeatInAllBehaviour = () => {
        for (let k in behaviourList) {
            behaviourList[k].setActualRepeat(RajSequenceBehaviorData.defaultData.REPEAT);
        }
    };

    const resetActualDelayBeforeInAllBehaviour = () => {
        for (let k in behaviourList) {
            behaviourList[k].setActualDelayBefore(RajSequenceBehaviorData.defaultData.DELAY_BEFORE);
        }
    };

    const resetSrayWasCallInAllBehaviour = () => {
        for (let k in behaviourList) {
            behaviourList[k].setSrayWasCall(false);
        }
    };

    const checkActualBehaviourIsLast = () => {
        return behaviourList.length == actualBehaviourIndex + 1;
    };

    const remove = () => {
        //Engine.rajSequenceManager.removeAction(id);
        Engine.rajSequenceManager.rajRemoveActionBeyondManager(id, additionalData);
    };

    const checkRepeatIsOver = () => {
        if (repeat === true) return false;

        return actualRepeat > repeat;
    };

    const increaseActualRepeat = () => {
        setActualRepeat(actualRepeat + 1);
    };

    const getId = () => {
        return id;
    };
    const getActualBehaviour = () => {
        return behaviourList[actualBehaviourIndex]
    };


    const setRepeat = (_repeat) => {
        repeat = _repeat;
    };
    const setActualRepeat = (_actualRepeat) => {
        actualRepeat = _actualRepeat;
    };
    const setId = (_id) => {
        id = _id;
    };
    const setActualBehaviourIndex = (_actualBehaviourIndex) => {
        actualBehaviourIndex = _actualBehaviourIndex
    };

    this.init = init;
    this.remove = remove;
    //this.getBehaviourToRenderEffect     = getBehaviourToRenderEffect;
    this.update = update;
    this.updateData = updateData;
    this.getId = getId;
    this.setNextBehaviour = setNextBehaviour;
    this.getAdditionalData = getAdditionalData;
}