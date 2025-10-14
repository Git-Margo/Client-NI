let CharacterData = require('@core/characters/CharactersData')
let CanvasOutfitWrapper = require('@core/characters/CanvasOutfitWrapper');
let CanvasPetWrapper = require('@core/characters/CanvasPetWrapper');

module.exports = function() {
    let list = {};

    function init() {

    }

    function checkDataCorrect(data) {
        if (!data.drawSystem) {
            errorReport('CanvasCharacterWrapperManager.js', 'checkDataCorrect', 'Attr drawSystem not exist!');
            return false
        }

        if (!data.path) {
            errorReport('CanvasCharacterWrapperManager.js', 'checkDataCorrect', 'Attr drawSystem not exist!');
            return false
        }

        if (!CharacterData.drawSystem[data.drawSystem]) {
            errorReport('CanvasCharacterWrapperManager.js', 'checkDataCorrect', 'That draw system not exist:' + data.drawSystem);
            return false
        }

        if (data.drawSystem == CharacterData.drawSystem.PET) {
            if (!data.hasOwnProperty('actions')) {
                errorReport('CanvasCharacterWrapperManager.js', 'checkDataCorrect', 'Attr actions not exist!');
                return false
            }
        }

        return true
    }

    function getFreeId() {
        let id = 0;
        while (list[id]) {
            id++;
        }
        return id;
    }

    function addCharacter(data) {


        if (!checkDataCorrect(data)) return false;

        let id = getFreeId();
        let canvasCharacterWrapper = createObject(data);

        addToList(id, canvasCharacterWrapper);

        list[id].init(id);
        list[id].updateData(data);

        return list[id];
    }

    function removeCharacter(id) {

        if (!checkCharacterExist(id)) {
            errorReport('CanvasCharacterWrapperManager.js', 'removeCharacter', 'Character not exit:' + id);
            return
        }
        list[id].remove();
        removeFromList(id);
    }

    function checkCharacterExist(id) {
        return list[id] ? true : false;
    }

    function createObject(data) {
        switch (data.drawSystem) {
            case CharacterData.drawSystem.PLAYER_OUTFIT:
                return new CanvasOutfitWrapper();
            case CharacterData.drawSystem.PET:
                return new CanvasPetWrapper();
            default:
                errorReport('CanvasCharacterWrapperManager.js', 'createObject', 'That drawSystem not supporter yet:' + data.drawSystem);
        }
    }

    function addToList(id, canvasCharacterWrapper) {
        list[id] = canvasCharacterWrapper;
    }

    function removeFromList(id) {
        delete list[id];
    }

    function update(dt) {
        for (let k in list) {
            list[k].update(dt);
        }
    }

    function draw() {
        for (let k in list) {
            list[k].draw();
        }
    }

    function getList() {
        return list;
    }

    this.init = init;
    this.draw = draw;
    this.getList = getList;
    this.update = update;
    this.addCharacter = addCharacter;
    this.removeCharacter = removeCharacter;


}