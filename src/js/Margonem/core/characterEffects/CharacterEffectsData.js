let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');
module.exports = {
    action: {
        CREATE: 'CREATE',
        REMOVE: 'REMOVE',
        REMOVE_IF_EXIST: 'REMOVE_IF_EXIST',
        CREATE_IF_NOT_EXIST: 'CREATE_IF_NOT_EXIST'
    },
    //characterTarget: {
    //HERO          		: CanvasObjectTypeData.HERO,
    //PET           		: CanvasObjectTypeData.PET,
    //NPC           		: CanvasObjectTypeData.NPC,
    //FAKE_NPC      		: CanvasObjectTypeData.FAKE_NPC,
    //THIS_NPC_INSTANCE   : "THIS_NPC_INSTANCE",
    //ALL_TALK_NPC  		: 'ALL_TALK_NPC',
    //ALL_MONSTER   		: 'ALL_MONSTER'
    //},
    windowTarget: {
        MAP: 'MAP',
        BATTLE: 'BATTLE'
    },
    effect: {
        ANIMATION: 'ANIMATION',
        TINT: 'TINT',
        SHAKE: 'SHAKE',
        TEXT: 'TEXT'
    },
    position: {
        CENTER: 'CENTER',
        LEFT: 'LEFT',
        RIGHT: 'RIGHT',
        TOP: 'TOP',
        BOTTOM: 'BOTTOM',

        FRONT: "FRONT",
        BACK: "BACK",
        LEFT_HAND: "LEFT_HAND",
        RIGHT_HAND: "RIGHT_HAND"
    },
    TINT_KIND: {
        SHOW_AND_HIDE: "SHOW_AND_HIDE",
        SHOW_AND_STICK: "SHOW_AND_STICK",
        HIDE: "HIDE"
    }
}