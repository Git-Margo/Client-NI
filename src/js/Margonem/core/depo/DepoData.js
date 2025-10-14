//const MAX_X_IN_OPEN_TAB =

let o = {
    ITEM_SLOT_SIZE: 33,
    ITEM_SLOT_MARGIN: 1,
    ITEM_IN_ROW: 14,
    ITEM_IN_COLUMN: 8,
    ITEM_IN_GRID: 112,
    OPEN_TAB_AMOUNT: 8,
    MAX_OPEN_TAB_ID: 2
}


o.MAX_X_IN_OPEN_TAB = o.OPEN_TAB_AMOUNT * o.ITEM_IN_ROW

module.exports = o;