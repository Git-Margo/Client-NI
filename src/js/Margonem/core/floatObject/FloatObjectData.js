let FLOAT_OBJECT = "FLOAT_OBJECT"

module.exports = {
    action: {
        "CREATE": "CREATE",
        "CREATE_IF_NOT_EXIST": "CREATE_IF_NOT_EXIST",
        "REMOVE": "REMOVE",
        "REMOVE_IF_EXIST": "REMOVE_IF_EXIST"
    },
    behavior: {
        IDLE: "IDLE",
        IDLE_GIF_ANIMATION: "IDLE_GIF_ANIMATION",
        MOVE_FROM_VECTORS: "MOVE_FROM_VECTORS",
        MOVE_TO_CORDS: "MOVE_TO_CORDS",
        MOVE_TO_START_CORDS: "MOVE_TO_START_CORDS",
        TP_TO_CORDS: "TP_TO_CORDS",
        FOLLOW: "FOLLOW",
        TP_START_CORDS: "TP_START_CORDS",
        TP_ON_OTHER_SIDE: "TP_ON_OTHER_SIDE",
        FADE_IN: "FADE_IN",
        FADE_OUT: "FADE_OUT",
        ROTATION: "ROTATION",
        CHANGE_IMG: "CHANGE_IMG"
    },
    defaultData: {
        BEHAVIOR_REPEAT: 1,
        BEHAVIOR_DURATION: 5,
        SPEED: 2,
        X_VECTOR: -0.6,
        Y_VECTOR: 1.4,
        //V_ORDER             : 0,
        ROTATION_SPEED: 0.5
    },
    //orderData: {
    //    kind: {
    //        MAP_OBJECT: "MAP_OBJECT",
    //        FLOAT_OBJECT: "FLOAT_OBJECT"
    //    }
    //},
    kind: {
        SPRITE: "SPRITE",
        GIF: "GIF",
        FAKE_NPC: "FAKE_NPC",
        IDLE_FAKE_NPC_FRAME: "IDLE_FAKE_NPC_FRAME"
    }
}