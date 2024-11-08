declare const _t: (name: string, val ? : string | {} | null, category ? : string) => string;

export const npcRarity = {
    HERO: 'Hero',
    TITAN: 'Titan',
    COLOSSUS: 'Colossus',
    ELITE: 'Elite',
    ELITE2: 'Elite2',
    ELITE3: 'Elite3',
}

export const npcRarityData = {
    [npcRarity.HERO]: {
        name: _t('wt_hero', null, 'npc')
    },
    [npcRarity.TITAN]: {
        name: _t('wt_titan', null, 'npc')
    },
    [npcRarity.COLOSSUS]: {
        name: _t('wt_colossus', null, 'npc')
    },
    [npcRarity.ELITE]: {
        name: _t('eliteI', null, 'npc')
    },
    [npcRarity.ELITE2]: {
        name: _t('eliteII', null, 'npc')
    },
    [npcRarity.ELITE3]: {
        name: _t('wt_elite3', null, 'npc')
    },
}