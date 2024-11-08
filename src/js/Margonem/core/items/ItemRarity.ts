declare const _t: any;

export enum Rarities {
    COMMON = "common",
        UNIQUE = "unique",
        HEROIC = "heroic",
        UPGRADED = "upgraded",
        LEGENDARY = "legendary",
        ARTEFACT = "artefact",
}

export type Rarity = {
    [name: string]: {
        name: string;
        namePlural: string;
        color: string;
        sort: number;
    };
};

export const itemRarity: Rarity = {
    [Rarities.COMMON]: {
        name: _t('rarity_common', null, 'item'),
        namePlural: _t('rarity_plural_common', null, 'item'),
        color: '#9da1a7',
        sort: 1,
    },
    [Rarities.UNIQUE]: {
        name: _t('rarity_unique', null, 'item'),
        namePlural: _t('rarity_plural_unique', null, 'item'),
        color: '#fffb00',
        sort: 2,
    },
    [Rarities.HEROIC]: {
        name: _t('rarity_heroic', null, 'item'),
        namePlural: _t('rarity_plural_heroic', null, 'item'),
        color: '#38b8eb',
        sort: 3,
    },
    [Rarities.UPGRADED]: {
        name: _t('rarity_upgraded', null, 'item'),
        namePlural: _t('rarity_plural_upgraded', null, 'item'),
        color: '#ff59af',
        sort: 4,
    },
    [Rarities.LEGENDARY]: {
        name: _t('rarity_legendary', null, 'item'),
        namePlural: _t('rarity_plural_legendary', null, 'item'),
        color: '#ff8400',
        sort: 5,
    },
    [Rarities.ARTEFACT]: {
        name: _t('rarity_artefact', null, 'item'),
        namePlural: _t('rarity_plural_artefact', null, 'item'),
        color: '#e84646',
        sort: 6,
    },
};