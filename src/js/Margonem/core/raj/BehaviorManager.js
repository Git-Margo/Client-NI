module.exports = function() {

    let parent = null;
    let behaviorList = null;
    let behaviorRepeat = null;
    let oneBehaviorRepeat = null;
    let behaviorIndex = null;
    let behaviorData = null;
    let duration = null;
    let allBehaviorFinished = false;
    let defaultRepeat = null;


    let tempBehaviourIndex = null;
    let switchBehavior = false;
    let breakBehaviour = false;
    let newBehaviorData = null;

    let oneBehaviorFinishCallback = null;
    let allBehaviorFinishCallback = null;

    const init = (_parent, _oneBehaviorFinishCallback, _allBehaviorFinishCallback) => {
        setParent(_parent);

        setOneBehaviorFinishCallback(_oneBehaviorFinishCallback);
        setAllBehaviorFinishCallback(_allBehaviorFinishCallback);
    };

    const manageBehaviorIndex = () => {
        if (behaviorIndex == null) {
            updateBehaviorIndex(0);
            return
        }

        if (oneBehaviorRepeat === true) {
            return;
        }

        decreaseOneBehaviorRepeat();

        if (oneBehaviorRepeat <= 0) {

            updateBehaviorIndex(behaviorIndex + 1);

            if (behaviorList.length < behaviorIndex + 1) {

                updateBehaviorIndex(0);

                if (behaviorRepeat === true) {
                    return;
                }

                decreaseBehaviorRepeat();

                if (behaviorRepeat <= 0) endBehaviourCallback();

            }
        }
    };

    const updateBehaviorIndex = (_behaviorIndex) => {
        setBehaviorIndex(_behaviorIndex);

        let _oneBehaviorRepeat = getActualBehaviorRepeatData();

        if (_oneBehaviorRepeat != null) setOneBehaviorRepeat(_oneBehaviorRepeat);
        else setOneBehaviorRepeat(defaultRepeat);
    };

    const endBehaviourCallback = () => {
        if (switchBehavior) restoreBehaviour();
        else {
            setAllBehaviorFinished(true);
            allBehaviorFinishCallback();
        }

        //setAllBehaviorFinished(true);
        //allBehaviorFinishCallback();
    };

    const restoreBehaviour = () => {

        setBehaviorList(parent.prepareBehaviorList(copyStructure(behaviorData.list)));
        setBehaviorRepeat(behaviorData.repeat);
        setBehaviorIndex(tempBehaviourIndex - 1);

        clearTempBehaviourIndex();
        setSwitchBehavior(false);

        callBehavior();
    };

    const clearTempBehaviourIndex = () => {
        tempBehaviourIndex = null;
    }

    const setSwitchBehavior = (_switchBehavior) => {
        switchBehavior = _switchBehavior;
    };

    const callBehavior = () => {
        oneBehaviorFinishCallback();
        manageSwitchBehaviourProcedure();
        manageBehaviorIndex();

        if (allBehaviorFinished) {
            return
        }

        startBehavior();
    };

    const manageSwitchBehaviourProcedure = () => {
        if (!breakBehaviour) return;

        if (!checkCacheTempBehaviourIndexIsSet()) cacheTempBehaviourIndex();

        setBehaviorList(parent.prepareBehaviorList(copyStructure(newBehaviorData.list)));
        setBehaviorRepeat(isset(newBehaviorData.repeat) ? newBehaviorData.repeat : defaultRepeat);
        setBehaviorIndex(null);

        setSwitchBehavior(true);
        setBreakBehavior(false);
    };

    const startBehavior = () => {
        let name = getActualBehaviorName();
        let externalProperties = getActualBehaviorExternal_propertiesData();
        let caseData = getActualBehaviorCaseData();

        if (caseData != null && !Engine.rajCase.checkFullFillCase(caseData)) {
            callBehavior();
            return;
        }

        if (externalProperties) parent.serverRayControllerData(externalProperties);

        parent.startBehavior(name);
    };

    const cacheTempBehaviourIndex = () => {
        tempBehaviourIndex = behaviorIndex;
    }

    const checkCacheTempBehaviourIndexIsSet = () => {
        return tempBehaviourIndex != null;
    }

    const getActualBehaviorCaseData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.case ? b.case : null;
    };

    const getActualBehaviorName = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.name;
    };

    const getActualBehaviorExternal_propertiesData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.external_properties ? b.external_properties : null;
    };

    const getActualBehaviorRepeatData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.repeat ? b.repeat : null;
    };

    const getActualBehaviorDurationData = () => {
        let b = getActualBehavior();
        if (!b) return null;

        return b.duration ? b.duration : null;
    };

    const decreaseBehaviorRepeat = () => {
        setBehaviorRepeat(behaviorRepeat - 1);
    };

    const decreaseOneBehaviorRepeat = () => {
        setOneBehaviorRepeat(oneBehaviorRepeat - 1);
    };

    const decreaseDuration = (val) => {
        setDuration(duration - val);
    };

    const setParent = (_parent) => {
        parent = _parent;
    };

    const setDuration = (_duration) => {
        duration = _duration;
    };

    const setBehaviorList = (_behaviorList) => {
        behaviorList = _behaviorList
    };

    const setBehaviorRepeat = (_behaviorRepeat) => {
        behaviorRepeat = _behaviorRepeat;
    };

    const setOneBehaviorRepeat = (_oneBehaviorRepeat) => {
        oneBehaviorRepeat = _oneBehaviorRepeat
    };

    const setBehaviorIndex = (_behaviorIndex) => {
        behaviorIndex = _behaviorIndex;
    };

    const setDefaultRepeat = (_defaultRepeat) => {
        defaultRepeat = _defaultRepeat
    };

    const setBehaviorData = (_behaviorData) => {
        behaviorData = _behaviorData
    };

    const setNewBehaviorData = (_newBehaviorData) => {
        newBehaviorData = _newBehaviorData;
    };

    const setAllBehaviorFinished = (_allBehaviorFinished) => {
        allBehaviorFinished = _allBehaviorFinished;
    };

    const setOneBehaviorFinishCallback = (_oneBehaviorFinishCallback) => {
        oneBehaviorFinishCallback = _oneBehaviorFinishCallback;
    };

    const setAllBehaviorFinishCallback = (_allBehaviorFinishCallback) => {
        allBehaviorFinishCallback = _allBehaviorFinishCallback;
    };

    const setBreakBehavior = (_breakBehaviour) => {
        breakBehaviour = _breakBehaviour;
    };

    const getAllBehaviorFinished = () => allBehaviorFinished;
    const getDuration = () => duration;
    const getActualBehavior = () => behaviorList[behaviorIndex];
    const getBehaviorList = () => behaviorList;
    const getBehaviorRepeat = () => behaviorRepeat;
    const getOneBehaviorRepeat = () => oneBehaviorRepeat;
    const getBehaviorIndex = () => behaviorIndex;
    const getBreakBehavior = () => breakBehaviour;


    this.init = init;
    this.callBehavior = callBehavior;
    this.decreaseDuration = decreaseDuration;
    this.setDuration = setDuration;
    this.setBehaviorRepeat = setBehaviorRepeat;
    this.setOneBehaviorRepeat = setOneBehaviorRepeat;
    this.setBehaviorList = setBehaviorList;
    this.setBehaviorData = setBehaviorData;
    this.setDefaultRepeat = setDefaultRepeat;
    this.setBreakBehavior = setBreakBehavior;
    this.setNewBehaviorData = setNewBehaviorData;
    this.getActualBehaviorDurationData = getActualBehaviorDurationData;
    this.getActualBehaviorName = getActualBehaviorName;
    this.getActualBehavior = getActualBehavior;
    this.getAllBehaviorFinished = getAllBehaviorFinished;
    this.getDuration = getDuration;
    this.getBreakBehavior = getBreakBehavior;

}