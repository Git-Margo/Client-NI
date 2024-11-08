let CanvasObjectTypeData = require('core/CanvasObjectTypeData');

module.exports = {
    addOffsetOfEmo: (master, oneLine) => {
        if (!master.checkEmoExist) return 0;

        if (!master.checkEmoExist()) return 0;

        return oneLine ? 20 : 18;
    },

    addOffsetOfKillTimer: (master, oneLine) => {
        if (!master.checkKillTimer) return 0;

        if (!master.checkKillTimer()) return 0;

        return oneLine ? 20 : 25;
    },

    addOffsetOfCharacterTimer: (master) => {
        if (!master.getCanvasObjectType) return 0;

        const NPC = CanvasObjectTypeData.NPC;

        if (master.getCanvasObjectType() != NPC) return 0;

        return getEngine().interfaceTimerManager.check(NPC, master.getId()) ? 20 : 0

    },

    addOffsetOfDataDrawNick: (master) => {
        return master.getDataDrawer && master.getDataDrawer() ? 25 : 0;
    }
}