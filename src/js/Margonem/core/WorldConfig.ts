type TConfig = {
    api_domain: string;
    enableme: boolean;
    enablenar: boolean;
    skipmute: boolean;
    dropdestroylvl: number;
    loot: number;
    ttlootdel: boolean;
    pvplvloff: boolean;
    pvpstart: number | null;
    pvpend: number | null;
    nonpvpstart: number | null;
    nonpvpend: number | null;
    npcexp: number;
    npcresp: number;
    weaktitans: number;
    p_weakcollossus: number;
    ph: number;
    priv_world: boolean;
    questexp: number;
    supervisorIds: number[];
    wanted_show: number;
    hidelvl: boolean;
    worldname: string;
    pvp: boolean;
    hardcore: boolean;
    brutal: boolean;
    rpg: boolean;
};

module.exports = class WorldConfig {
    #config!: TConfig;

    constructor() {
        this.setDefaults();
    }

    setDefaults() {
        this.#config = {
            api_domain: '',
            enableme: false,
            enablenar: false,
            skipmute: false,
            dropdestroylvl: 0,
            loot: 0,
            ttlootdel: false,
            pvplvloff: false,
            pvpstart: null,
            pvpend: null,
            nonpvpstart: null,
            nonpvpend: null,
            npcexp: 0,
            npcresp: 0,
            weaktitans: 0,
            p_weakcollossus: 0,
            ph: 0,
            priv_world: false,
            questexp: 0,
            supervisorIds: [],
            wanted_show: 0,
            hidelvl: false,
            worldname: '',
            pvp: false,
            hardcore: false,
            brutal: false,
            rpg: false
        }
    }

    update(config: TConfig) {
        this.#config = {
            ...this.#config,
            ...config
        };
    }

    getApiDomain() {
        return this.#config.api_domain;
    }

    getEnableMe() {
        return this.#config.enableme;
    }

    getEnableNar() {
        return this.#config.enablenar;
    }

    getSkipMute() {
        return this.#config.skipmute;
    }

    getDropDestroyLvl() {
        return this.#config.dropdestroylvl;
    }

    getLoot() {
        return this.#config.loot;
    }

    getTtlLootDel() {
        return this.#config.ttlootdel;
    }

    getPvpLvlOff() {
        return this.#config.pvplvloff;
    }

    getPvpStart() {
        return this.#config.pvpstart;
    }

    getPvpEnd() {
        return this.#config.pvpend;
    }

    getNonPvpStart() {
        return this.#config.nonpvpstart;
    }

    getNonPvpEnd() {
        return this.#config.nonpvpend;
    }

    getNpcExp() {
        return this.#config.npcexp;
    }

    getNpcResp() {
        return this.#config.npcresp;
    }

    getWeakTitans() {
        return this.#config.weaktitans;
    }

    getPWeakCollossus() {
        return this.#config.p_weakcollossus;
    }

    getPh() {
        return this.#config.ph;
    }

    getPrivWorld() {
        return this.#config.priv_world;
    }

    getQuestExp() {
        return this.#config.questexp;
    }

    getSupervisorIds() {
        return this.#config.supervisorIds;
    }

    getWantedShow() {
        return this.#config.wanted_show;
    }

    getWorldName() {
        return this.#config.worldname;
    }

    getPvp() {
        return this.#config.pvp;
    }

    getHardcore() {
        return this.#config.hardcore;
    }

    getBrutal() {
        return this.#config.brutal;
    }

    getRpg() {
        return this.#config.rpg;
    }
};