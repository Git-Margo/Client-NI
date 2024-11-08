const moduleData = {
    fileName: "RajRandomElements.js"
};

function manageRandomElementInObjectIfExist(data) {
    if (!checkRandomElementsExist(data)) return;

    randRandomElements(data);
}

function manageRandomElementInBehaviorIfExist(behaviorData) {
    if (!behaviorData) return;

    let list = behaviorData.list;

    for (let k in list) {
        let oneBehavior = list[k];
        if (!checkRandomElementsExist(oneBehavior)) continue;

        randRandomElements(oneBehavior);
    }
}

function checkRandomElementsExist(data) {
    return data.getRandomElements ? true : false;
}

function randRandomElements(data) {
    const FUNC = "randRandomElements";
    let randomElements = data.getRandomElements;

    if (!elementIsObject(randomElements)) {
        errorReport(moduleData.fileName, FUNC, "getRandomElements is not object!", data);
        return
    }

    let randomElementsOptions = randomElements.options;

    if (!randomElementsOptions) {
        errorReport(moduleData.fileName, FUNC, "getRandomElements have to attr options!", data);
        return
    }

    //let maxIndex        = randomElementsList.length - 1;
    //let newIndex        = Math.round(Math.random() * maxIndex);
    //let randomData      = randomElementsList[newIndex];
    let randomData = getRandomElementFromArray(randomElementsOptions);

    for (let attrName in randomData) {
        data[attrName] = randomData[attrName];
    }

    delete data.getRandomElements;
}


module.exports = {
    checkRandomElementsExist: checkRandomElementsExist,
    manageRandomElementInObjectIfExist: manageRandomElementInObjectIfExist,
    manageRandomElementInBehaviorIfExist: manageRandomElementInBehaviorIfExist
};