const updateRandomFirstIndex = (behaviorData) => {

    let list = behaviorData.list;
    let forActions = behaviorData.randomFirstIndex.forActions;

    for (let i = 0; i < list.length; i++) {
        let oneBehavior = list[i];
        oneBehavior._tempIndex = i;
    }

    if (forActions) behaviorData.list = getNewArrayWithChooseOrderOfFirstIndex(list, getBehaviorListToRandomByActions(list, forActions));
    else behaviorData.list = getNewArrayWithChooseOrderOfFirstIndex(list, list);

    console.log(list, behaviorData.list)
};

const getBehaviorListToRandomByActions = (behaviorDataList, forActions) => {
    let a = [];

    for (let oneActionsOnList of behaviorDataList) {
        for (let nameOfActionToAdd of forActions) {

            if (oneActionsOnList.name == nameOfActionToAdd) a.push(oneActionsOnList);
        }
    }

    return a;
}

const getNewArrayWithChooseOrderOfFirstIndex = (oldArray, arrayToRandom) => {

    let randomElement = getRandomElementFromArray(arrayToRandom);
    let newIndex = randomElement._tempIndex;
    let oldArrayLength = oldArray.length;
    let newArray = [];

    console.log('newIndex', newIndex);

    for (let i = newIndex; i < oldArrayLength; i++) {

        let oldArrayElement = oldArray[i];

        newArray.push(oldArrayElement);

        if (newArray.length == oldArrayLength) return newArray;

        if (i + 1 == oldArrayLength) i = -1;
    }
};

module.exports = {
    updateRandomFirstIndex: updateRandomFirstIndex
}