export default {
    TITLE: '',
    SLUG: 'loot-filter',
    SLUG_SHORT: 'lf',
};

export enum SettingKeys {
    INVENTORY = 'inventory',
        CHESTS = 'chests',
        BAGS = 'bags',
        GOLD = 'gold',
        TELEPORTS = 'teleports',
        TALISMANS = 'talismans',
        NEUTRAL = 'neutral',
        RUNIC_SHARDS = 'runic_shards',
        USABLE = 'usable',
        UPGRADES = 'upgrades',
        OTHER = 'other',
        MINIMAL_LOOT_VALUE = 'minimal_loot_value',
        ONLY_HIGHEST_RANK = 'only_highest_rank',
        FROM_FIGHT = 'from_fight',
        FROM_NPC = 'from_npc',
        FROM_CHESTS = 'from_chests',
        AUTO_ACCEPT_LOOT = 'auto_accept_loot',
        TO_RANK = 'to_rank',
        IS_ENABLED = 'is_enabled'
}

export enum SettingCategories {
    ALONE = 'alone',
        SOLO = 'solo',
        GROUP = 'group'
}