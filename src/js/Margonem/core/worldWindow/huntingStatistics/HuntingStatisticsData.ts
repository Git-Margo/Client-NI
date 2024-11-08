const TABLE_HEADERS = [{
        key: 'name',
        sort: true
    },
    {
        key: 'level',
        sort: true,
        default: true
    },
    {
        key: 'kills',
        sort: true
    },
    {
        key: 'unique',
        sort: true
    },
    {
        key: 'heroic',
        sort: true
    },
    {
        key: 'legendary',
        sort: true
    },
];

const SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc',
};

const DIFFICULTIES = ['', 'normal', 'hard', 'master'];

export {
    TABLE_HEADERS,
    SORT_ORDER,
    DIFFICULTIES,
};