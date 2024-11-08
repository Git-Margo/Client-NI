declare const _t: any;

export type Ranks = {
    [name: number]: {
        name: string;
        shortName: string;
        color: string;
    };
};

export const ranks: Ranks = {
    0: {
        name: _t('player', null, 'ranks'),
        shortName: '',
        color: '#ececec',
    },
    1: {
        name: _t('admin', null, 'ranks'),
        shortName: 'ADM',
        color: '#ff3b3b',
    },
    2: {
        name: _t('mg', null, 'ranks'),
        shortName: 'MG',
        color: '#84ff00',
    },
    4: {
        name: _t('super_chat_mod', null, 'ranks'),
        shortName: 'SMC',
        color: '#82e6ff',
    },
    16: {
        name: _t('super_mg', null, 'ranks'),
        shortName: 'SMG',
        color: '#ffde00',
    },
    32: {
        name: _t('chat_mod', null, 'ranks'),
        shortName: 'MC',
        color: '#ff0bb2',
    },
};