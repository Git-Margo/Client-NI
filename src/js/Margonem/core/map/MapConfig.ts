type TMapConfig = {
    lvlMin: number | null;
    lvlMax: number | null;
    isLvlAddLootRangeEnabled: boolean;
    isPrivRoom: boolean;
    isTeleportBlocked: boolean;
    isRespawnShortened: boolean;
    isClearEnabled: boolean;
    isTimeticketsUsageDisabled: boolean;
    isTpOutAfterOffline: boolean;
    isPartiesDisabled: boolean;
    isChangeOutfitAtDie: boolean;
    isTeleportAt5AM: boolean;
    isPvpLvlAdvantageDisabled: boolean;
    isAlwaysPvpForced: boolean;
    isMakeNoobImmune: boolean;
    //isQuestFogEnabled: boolean;
    questFog: {
        color: string | null;
        isEnabled: boolean;
    } | null;
    isBattlePvPQuickModeEnabled: boolean;
    respawn: string;
    pvnBattleTurnTimes: number[] | null;
    pvpBattleTurnTimes: number[] | null;
    isWantedDisabled: boolean;
    battlePoolTimeLimits: {
        total: number;
        minimum: number;
        penalty: number;
    } | null;
};

module.exports = class MapConfig {
    #config!: TMapConfig;

    constructor() {
        this.setDefaults();
    }

    setDefaults() {
        this.#config = {
            lvlMin: null,
            lvlMax: null,
            isLvlAddLootRangeEnabled: false,
            isPrivRoom: false,
            isTeleportBlocked: false,
            isRespawnShortened: false,
            isClearEnabled: false,
            isTimeticketsUsageDisabled: false,
            isTpOutAfterOffline: false,
            isPartiesDisabled: false,
            isChangeOutfitAtDie: false,
            isTeleportAt5AM: false,
            isPvpLvlAdvantageDisabled: false,
            isAlwaysPvpForced: false,
            isMakeNoobImmune: false,
            //isQuestFogEnabled: false,
            questFog: null,
            isBattlePvPQuickModeEnabled: false,
            respawn: '',
            pvnBattleTurnTimes: null,
            pvpBattleTurnTimes: null,
            isWantedDisabled: false,
            battlePoolTimeLimits: null,
        };
    }

    update(config: TMapConfig) {
        this.#config = {
            ...this.#config,
            ...config
        };
    }

    getLvlMin() {
        return this.#config.lvlMin;
    }

    getLvlMax() {
        return this.#config.lvlMax;
    }

    getIsLvlAddLootRangeEnabled() {
        return this.#config.isLvlAddLootRangeEnabled;
    }

    getIsPrivRoom() {
        return this.#config.isPrivRoom;
    }

    getIsTeleportBlocked() {
        return this.#config.isTeleportBlocked;
    }

    getIsRespawnShortened() {
        return this.#config.isRespawnShortened;
    }

    getIsClearEnabled() {
        return this.#config.isClearEnabled;
    }

    getIsTimeticketsUsageDisabled() {
        return this.#config.isTimeticketsUsageDisabled;
    }

    getIsTpOutAfterOffline() {
        return this.#config.isTpOutAfterOffline;
    }

    getIsPartiesDisabled() {
        return this.#config.isPartiesDisabled;
    }

    getIsChangeOutfitAtDie() {
        return this.#config.isChangeOutfitAtDie;
    }

    getIsTeleportAt5AM() {
        return this.#config.isTeleportAt5AM;
    }

    getIsPvpLvlAdvantageDisabled() {
        return this.#config.isPvpLvlAdvantageDisabled;
    }

    getIsAlwaysPvpForced() {
        return this.#config.isAlwaysPvpForced;
    }

    getIsMakeNoobImmune() {
        return this.#config.isMakeNoobImmune;
    }

    //getIsQuestFogEnabled() {
    //  return this.#config.isQuestFogEnabled;
    //}

    getQuestFog() {
        return this.#config.questFog;
    }

    getIsBattlePvPQuickModeEnabled() {
        return this.#config.isBattlePvPQuickModeEnabled;
    }

    getRespawn() {
        return this.#config.respawn;
    }

    getPvnBattleTurnTimes() {
        return this.#config.pvnBattleTurnTimes;
    }

    getPvpBattleTurnTimes() {
        return this.#config.pvpBattleTurnTimes;
    }

    getIsWantedDisabled() {
        return this.#config.isWantedDisabled;
    }

    getBattlePoolTimeLimits() {
        return this.#config.battlePoolTimeLimits;
    }
};