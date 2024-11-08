let CharacterEffectBattle = require('core/characterEffects/CharacterEffectBattle');
let CharacterEffectsData = require('core/characterEffects/CharacterEffectsData');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');

module.exports = function() {


    let canvas;
    let ctx;
    let list = {};

    const init = () => {
        initCanvas();
        setCanvasSize();
    };

    const updateData = (oneData) => {
        switch (oneData.action) {
            case CharacterEffectsData.action.CREATE:
                createCharecterEffectFromData(oneData);
                break;
            case CharacterEffectsData.action.REMOVE:
                removeCharecterEffectFromData(oneData);
                break;
        }
    };

    const createCharecterEffectFromData = (oneData) => {
        if (oneData.effect == CharacterEffectsData.effect.ANIMATION) newCharacterEffect(oneData);
    };

    const removeCharecterEffectFromData = (oneData) => {
        let objectsToDelete = getEffectsToRemove(oneData);

        for (let k in objectsToDelete) {
            let id = objectsToDelete[k].getId();
            removeMapObject(id);
        }
    };

    const getEffectsToRemove = (oneData) => {
        return getEffectsByName(oneData.name, oneData.target.kind, oneData.target.id)
    };

    const afterStopAction = (id) => {
        let obj = list[id];
        let repeat = obj.getRepeat();
        let actualRepeat = obj.getActualRepeat();

        if (repeat == null) {
            removeMapObject(id);
            return;
        }

        if (repeat == true) {
            obj.start();
            return
        }

        if (actualRepeat > repeat) removeMapObject(id);
        else obj.start();
    };

    const getNewId = () => {
        if (lengthObject(list) == 0) return 0;
        for (let k in list) {
            let newId = parseInt(k) + 1;
            if (!list[newId]) return newId
        }

        errorReport('MapObjectManager.js', 'getNewId', 'newId empty! list :', list)

        return Math.random();
    };

    const newCharacterEffect = (data) => {
        let characterEffect = new CharacterEffectBattle();
        let id = getNewId();

        characterEffect.init(id, data);
        addToList(id, characterEffect);
    };

    const removeMapObject = (id) => {
        if (!list[id]) {
            errorReport('MapObjectManager.js', 'removeMapObject', `id ${id} not exist!`, list);
            return
        }
        removeFromList(id);
    };

    const getEffectsByName = (name, kind, id) => {
        let objects = [];

        for (let k in list) {
            let oneMapElement = list[k];
            let masterKindObject = oneMapElement.getMasterKindObject();
            let nameMapEffect = oneMapElement.getName();

            if (nameMapEffect != name) continue;
            if (masterKindObject != kind) continue;

            let correct = false;

            switch (masterKindObject) {
                case CanvasObjectTypeData.HERO:
                    correct = true;
                    break;
                case CanvasObjectTypeData.NPC:
                    if (oneMapElement.getMasterId() == id) correct = true;
                    break;
            }

            if (correct) objects.push(oneMapElement);
        }

        return objects;
    };


    const addToList = (id, mapObject) => {
        list[id] = (mapObject);
    };

    const removeFromList = (id) => {
        delete list[id];
    };

    const update = (dt) => {
        for (let k in list) {
            list[k].update(dt);
        }
    };

    const onClear = () => {
        list = {};
    };

    const getDrawableList = () => {
        //if (lengthObject(list) > 0) debugger
        let a = [];
        for (let k in list) {
            a.push(list[k])
        }
        return a;
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let k in list) {
            list[k].draw(ctx);
        }
    }

    const onResize = () => {
        setCanvasSize();
    };

    const initCanvas = () => {
        canvas = Engine.battle.$.find('.character-effects')[0];
        ctx = canvas.getContext('2d');
    };

    const setCanvasSize = () => {
        let $b = Engine.battle.$;
        canvas.width = $b.width();
        canvas.height = $b.height();
    };

    this.init = init;
    this.updateData = updateData;
    this.getDrawableList = getDrawableList;
    this.onResize = onResize;
    this.update = update;
    this.draw = draw;
    this.onClear = onClear;
    this.afterStopAction = afterStopAction;

};