module.exports = {
    CATEGORY: {
        weapon: [1, 4, 2, 6, 7, 3, 5, 29],
        armor: [8, 11, 10, 14, 9, 12, 13],
        other: [23, 16, 15, 22, 24, 27, 28, 32]
    },
    MY_AUCTION: 'MY_AUCTION',
    UPDATE_PAGES: 'UPDATE_PAGES',
    PREFIX_CARD: "CARD_",
    // KIND_MY_AUCTION 	: {
    // 	MY_AUCTION_OFF	: 1,
    // 	MY_WATCH		: 3,
    // 	MY_BID			: 2
    // },
    // KIND_OTHERS_AUCTION: {
    // 	ALL_AUCTION: 4
    // },
    KIND_MY_AUCTION: {
        MY_AUCTION_OFF: "MY_AUCTION_OFF",
        MY_WATCH: "MY_WATCH",
        MY_BID: "MY_BID"
    },
    KIND_OTHERS_AUCTION: {
        ALL_AUCTION: "ALL_AUCTION"
    },
    TYPE_OF_AUCTION: {
        NORMAL: 'NORMAL',
        EVENT: 'EVENT'
    },
    ALL_AUCTION: 'ALL_AUCTION',
    AUCTION_CEIL: {
        ITEM_SLOT_TD: {
            key: 'item-slot-td',
            sort: null
        },
        ITEM_TIME_TD: {
            key: 'item-time-td',
            sort: 1
        },
        ITEM_BID_TD: {
            key: 'item-bid-td',
            sort: 2
        },
        ITEM_BUY_NOW_TD: {
            key: 'item-buy-now-td',
            sort: 3
        },
        ITEM_LEVEL_TD: {
            key: 'item-level-td',
            sort: 4
        },
        ITEM_NAME_TD: {
            key: 'item-name-td',
            sort: 5
        },
        AUCTION_ACTION_TD: {
            key: 'auction-action-td',
            sort: null
        }
    },
    SORT_ORDER: {
        ASC: 0,
        DESC: 1
    },
    FILTER_KEYS: {
        FILTER_ID: 'FILTER_ID',
        FILTER_NAME: 'FILTER_NAME',
        FILTER_VAL: 'FILTER_VAL',
        MIN_LEVEL: 'MIN_LEVEL',
        PROF: 'PROF',
        MAX_LEVEL: 'MAX_LEVEL',
        RARITY: 'RARITY',
        MIN_PRICE: 'MIN_PRICE',
        MAX_PRICE: 'MAX_PRICE',
        AUCTION_TYPE: 'AUCTION_TYPE',
        NAME_ITEM: 'NAME_ITEM'
    },
    FILTER_ID: {
        EMPTY_FILTER: -2,
        ADD_FILTER: -1
    },
    TYPE_OF_BUY_AUCTION: {
        ALL: 0,
        BUY_NOW: 1,
        BIDS: 2
    },
    TYPE_OF_RARITY: {
        ALL: 0,
        UNIQUE: 1,
        HEROIC: 2,
        LEGENDARY: 3
    },
    BIDDER_VALUES: {
        NO_BIDDER: 0,
        SOMEBODY_BID: 1,
        YOU_BID: 2
    },
    MAX_QUANTITY_OF_ITEMS_PACKAGE: 15,
    COST_FEATURED_AUCTION: 100,
    MAX_FEATURED_COUNT: 10,
    MAX_OBSERVED: 100
};