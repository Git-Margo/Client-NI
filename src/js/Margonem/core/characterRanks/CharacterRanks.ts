declare const _t: any;

export type Rank = {
    name: string;
    shortName: string;
    color: string;
};

export type Ranks = {
    [name: number]: Rank
};

export const ranks: Ranks = {
    0: {
        name: _t('player', null, 'ranks'),
        shortName: '',
        color: '#ececec',
    },
    1: {
        name: _t('admin', null, 'ranks'),
        shortName: _t('admin', null, 'heroranks'),
        color: '#ff3b3b',
    },
    2: {
        name: _t('mg', null, 'ranks'),
        shortName: _t('mg', null, 'heroranks'),
        color: '#84ff00',
    },
    4: {
        name: _t('super_chat_mod', null, 'ranks'),
        shortName: _t('super_chat_mod', null, 'heroranks'),
        color: '#82e6ff',
    },
    16: {
        name: _t('super_mg', null, 'ranks'),
        shortName: _t('super_mg', null, 'heroranks'),
        color: '#ffde00',
    },
    32: {
        name: _t('chat_mod', null, 'ranks'),
        shortName: _t('chat_mod', null, 'heroranks'),
        color: '#ff0bb2',
    },
};