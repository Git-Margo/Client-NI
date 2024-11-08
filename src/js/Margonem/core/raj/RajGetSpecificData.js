const moduleData = {
    fileName: "RajGetSpecificData.js"
};
let RajActionData = require('core/raj/rajAction/RajActionData');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');

function prepareData(data, additionalData) {

    //if (isset(data.getCharacterData)) {
    let d = data.getCharacterData;

    let targetObject = getTargetObject(d, additionalData);

    if (!targetObject) return null;

    return getDataFromTargetObject(targetObject, d);
    //}

    //return null;

}

function getTargetObject(data, additionalData) {
    const FUNC = "getTargetObject";

    if (!isset(data.kind)) {
        errorReport(moduleData.fileName, FUNC, 'Attr kind is obligatory!', data);
        return null;
    }

    let targetObject;

    switch (data.kind) {

        case CanvasObjectTypeData.FLOAT_OBJECT:
            if (!isset(data.id)) {
                errorReport(moduleData.fileName, FUNC, 'Attr id is obligatory!', data);
                return null;
            }
            targetObject = Engine.floatObjectManager.getById(data.id);
            if (!targetObject) {
                errorReport(moduleData.fileName, FUNC, `NPC with id ${data.id} not exist!`, data);
                return null;
            }
            return targetObject;
        case CanvasObjectTypeData.FAKE_NPC:
            if (!isset(data.id)) {
                errorReport(moduleData.fileName, FUNC, 'Attr id is obligatory!', data);
                return null;
            }
            targetObject = Engine.fakeNpcs.getById(data.id);
            if (!targetObject) {
                errorReport(moduleData.fileName, FUNC, `NPC with id ${data.id} not exist!`, data);
                return null;
            }
            return targetObject;
        case CanvasObjectTypeData.NPC:
            if (!isset(data.id)) {
                errorReport(moduleData.fileName, FUNC, 'Attr id is obligatory!', data);
                return null;
            }
            targetObject = Engine.npcs.getById(data.id);
            if (!targetObject) {
                errorReport(moduleData.fileName, FUNC, `NPC with id ${data.id} not exist!`, data);
                return null;
            }
            return targetObject;
        case RajActionData.TARGET_KIND.THIS_NPC_INSTANCE:
            if (!isset(additionalData.npcId)) {
                errorReport(moduleData.fileName, FUNC, 'Attr id is obligatory!', data);
                return null;
            }
            targetObject = Engine.npcs.getById(additionalData.npcId);
            if (!targetObject) {

                if (Engine.npcs.checkDeleteNpc(additionalData.npcId)) {
                    console.log('getFromDeleteNpc');
                    return Engine.npcs.getDeleteNpc(additionalData.npcId);
                }

                errorReport(moduleData.fileName, FUNC, `NPC with id ${data} not exist!`, data);
                return null;
            }
            return targetObject;
        case CanvasObjectTypeData.HERO:
            targetObject = Engine.hero;
            return targetObject;
        case CanvasObjectTypeData.PET:
            if (!Engine.hero.havePet()) {
                errorReport(moduleData.fileName, FUNC, `PET not exist!`, data);
                return null;
            }
            targetObject = Engine.hero.getPet();
            return targetObject;
        case "WARRIOR":
            targetObject = Engine.battle.getWarrior(data.id);
            if (!targetObject) {
                errorReport(moduleData.fileName, FUNC, `WARRIOR not exist!`, data);
                return null;
            }

            //return targetObject;
            return null
        default:
            errorReport(moduleData.fileName, FUNC, 'undefined kind!', data);
            return null;
    }
}

function getDataFromTargetObject(targetObject, d) {

    if (!isset(d.toGet)) {
        errorReport(moduleData.fileName, 'getDataFromTargetObject', 'attr toGet is obligatory!', d);
        return null;
    }

    switch (d.toGet) {
        case "nick":
            return targetObject.getNick();
        case "x":
            return getXPos(d, targetObject);
        case "y":
            return getYPos(d, targetObject);
        case "rx":
            return getRXPos(d, targetObject);
        case "ry":
            return getRYPos(d, targetObject);
        case "img":
            return targetObject.getImg();
        case "oldImg":
            return targetObject.getOldImg();
        case "dir":
            return targetObject.getDir();
        case "id":
            return getId(d, targetObject);
        default:
            errorReport(moduleData.fileName, 'getDataFromTargetObject', 'undefined data to get', d);
            return null;
    }
}


let angle = -90

function getAngle() {
    switch (Engine.hero.d.dir) {
        case 0:
            return 0
        case 1:
            return 90
        case 2:
            return -90
        case 3:
            return 180
    }
}

function getRXPos(data, targetObject) {
    let rx = targetObject.getRX();
    return getXPos(data, targetObject, rx)
}

function getId(data, targetObject) {

    let id = targetObject.getId();

    if (data.prefix) id = data.prefix + id;
    if (data.modify) id = id + data.modify;

    return id;
}

function getXPos(data, targetObject, x) {

    x = isset(x) ? x : targetObject.getX();
    //let x = targetObject.getX();



    if (isset(data.rotation)) {

        let pos = rotate(data.rotation.x, data.rotation.y, getAngle());

        x = x + pos[0];
    } else {
        if (data.modify) x = modifyVal(x, data.modify);
    }

    return x;
}

function getRYPos(data, targetObject) {
    let ry = targetObject.getRY();
    return getYPos(data, targetObject, ry);
}

function getYPos(data, targetObject, y) {
    //let y = targetObject.getY();

    y = isset(y) ? y : targetObject.getY();


    if (isset(data.rotation)) {

        let pos = rotate(data.rotation.x, data.rotation.y, getAngle());

        y = y + pos[1];
    } else {
        if (data.modify) y = modifyVal(y, data.modify);
    }

    return y;
}

function modifyVal(v, modify) {
    return v + modify;
}

function toRadians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function rotate(x, y, alpha) {
    let radians = Math.floor(toRadians(alpha) * 1000) / 1000
    return [
        Math.round(x * Math.cos(radians) - y * Math.sin(radians)),
        Math.round(x * Math.sin(radians) + y * Math.cos(radians))
    ]
}

function checkGetCharacterData(data) {
    return elementIsObject(data) && isset(data.getCharacterData)
}

function getCharacterData(data, additionalData) {
    if (!checkGetCharacterData(data)) return data;
    else return prepareData(data, additionalData);
}

module.exports = {
    getCharacterData: getCharacterData,
    getTargetObject: getTargetObject,
    checkGetCharacterData: checkGetCharacterData
};