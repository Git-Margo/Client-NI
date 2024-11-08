module.exports = {
    action: {
        CREATE: "CREATE",
        REMOVE: "REMOVE",
        CREATE_IF_NOT_EXIST: "CREATE_IF_NOT_EXIST",
        REMOVE_IF_EXIST: "REMOVE_IF_EXIST"
    },
    behavior: {
        IDLE: "IDLE",
        WALK: "WALK",
        TP: "TP",
        WALK_START: "WALK_START",
        TP_START: "TP_START",
        WALK_AND_TP_START: "WALK_AND_TP_START"
    },
    defaultData: {
        BEHAVIOR_REPEAT: 1,
        BEHAVIOR_DURATION: 5
    }
}