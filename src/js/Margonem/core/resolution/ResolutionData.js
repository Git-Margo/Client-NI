var WidgetsData = require('@core/interface/widgets/WidgetsData');

let KEY = {
    _DEFAULT: "_DEFAULT",
    _920_X_555: "_920_X_555",
    _1173_X_555: "_1173_X_555",
    _1024_X_768: "_1024_X_768",
    _1277_X_768: "_1277_X_768",
    _1200_X_675: "_1200_X_675",
    _1253_X_675: "_1253_X_675",
    _1366_X_768: "_1366_X_768",
    _1619_X_768: "_1619_X_768",
    _1600_X_900: "_1600_X_900",
    _1853_X_900: "_1853_X_900",
    _1920_X_1080: "_1920_X_1080"
};

const IN_WINDOW = WidgetsData.IN_WINDOW;
const TOP_LEFT = WidgetsData.pos.TOP_LEFT;
const TOP_RIGHT = WidgetsData.pos.TOP_RIGHT;
const BOTTOM_LEFT = WidgetsData.pos.BOTTOM_LEFT;
const BOTTOM_RIGHT = WidgetsData.pos.BOTTOM_RIGHT;
const BOTTOM_RIGHT_ADDITIONAL = WidgetsData.pos.BOTTOM_RIGHT_ADDITIONAL;
const BOTTOM_LEFT_ADDITIONAL = WidgetsData.pos.BOTTOM_LEFT_ADDITIONAL;
const TOP_RIGHT_ADDITIONAL = WidgetsData.pos.TOP_RIGHT_ADDITIONAL;
const TOP_LEFT_ADDITIONAL = WidgetsData.pos.TOP_LEFT_ADDITIONAL;

const smallWidgetSize = 32;
const smallStandardWidgetSize = 36;
const standardWidgetSize = 44;
const bigWidgetSize = 57;

module.exports = {
    KEY: KEY,
    RES: {
        [KEY._DEFAULT]: 'default',
        [KEY._920_X_555]: '920x555',
        [KEY._1173_X_555]: '1173x555',
        [KEY._1024_X_768]: '1024x768',
        [KEY._1277_X_768]: '1277x768',
        [KEY._1200_X_675]: '1200x675',
        [KEY._1253_X_675]: '1253x675',
        [KEY._1366_X_768]: '1366x768',
        [KEY._1619_X_768]: '1619x768',
        [KEY._1600_X_900]: '1600x900',
        [KEY._1853_X_900]: '1853x900',
        [KEY._1920_X_1080]: '1920x1080'
    },
    DATA: {
        [KEY._DEFAULT]: {
            w: null,
            h: null
        },
        [KEY._920_X_555]: {
            w: 920,
            h: 555
        },
        [KEY._1173_X_555]: {
            w: 1173,
            h: 555
        },
        [KEY._1024_X_768]: {
            w: 1024,
            h: 768
        },
        [KEY._1277_X_768]: {
            w: 1277,
            h: 768
        },
        [KEY._1200_X_675]: {
            w: 1200,
            h: 675
        },
        [KEY._1253_X_675]: {
            w: 1253,
            h: 675
        },
        [KEY._1366_X_768]: {
            w: 1366,
            h: 768
        },
        [KEY._1619_X_768]: {
            w: 1619,
            h: 768
        },
        [KEY._1600_X_900]: {
            w: 1600,
            h: 900
        },
        [KEY._1853_X_900]: {
            w: 1853,
            h: 900
        },
        [KEY._1920_X_1080]: {
            w: 1920,
            h: 1080
        }
    },
    WINDOW_HEIGHT_BY_RES: {
        [KEY._DEFAULT]: {
            v: 60,
            k: "vh"
        },
        [KEY._920_X_555]: {
            v: 345,
            k: "px"
        },
        [KEY._1173_X_555]: {
            v: 345,
            k: "px"
        },
        [KEY._1024_X_768]: {
            v: 495,
            k: "px"
        },
        [KEY._1277_X_768]: {
            v: 495,
            k: "px"
        },
        [KEY._1200_X_675]: {
            v: 460,
            k: "px"
        },
        [KEY._1253_X_675]: {
            v: 460,
            k: "px"
        },
        [KEY._1366_X_768]: {
            v: 495,
            k: "px"
        },
        [KEY._1619_X_768]: {
            v: 495,
            k: "px"
        },
        [KEY._1600_X_900]: {
            v: 580,
            k: "px"
        },
        [KEY._1853_X_900]: {
            v: 580,
            k: "px"
        },
        [KEY._1920_X_1080]: {
            v: 580,
            k: "px"
        }
    },
    //WIDGET_SIZE_BY_RES: {
    //    [KEY._DEFAULT]       : 44,
    //    [KEY._920_X_555]     : 32,
    //    [KEY._1173_X_555]    : 36,
    //    [KEY._1024_X_768]    : 36,
    //    [KEY._1277_X_768]    : 44,
    //    [KEY._1200_X_675]    : 44,
    //    [KEY._1253_X_675]    : 44,
    //    [KEY._1366_X_768]    : 44,
    //    [KEY._1619_X_768]    : 44,
    //    [KEY._1600_X_900]    : 44,
    //    [KEY._1853_X_900]    : 44,
    //    [KEY._1920_X_1080]   : 44
    //},

    WIDGET_BAR_COLUMN_VISIBILITY_TOGGLE_SIZE: bigWidgetSize,

    BIG_WIDGET_SIZE: bigWidgetSize,
    STANDARD_WIDGET_SIZE: standardWidgetSize,
    SMALL_WIDGET_SIZE: smallWidgetSize,
    WIDGET_SIZE_BY_RES_AND_POS: {
        MOBILE: {
            [IN_WINDOW]: standardWidgetSize,
            [TOP_LEFT]: smallWidgetSize,
            [TOP_RIGHT]: smallWidgetSize,
            [BOTTOM_LEFT]: bigWidgetSize,
            [BOTTOM_RIGHT]: bigWidgetSize,
            [BOTTOM_RIGHT_ADDITIONAL]: bigWidgetSize,
            [BOTTOM_LEFT_ADDITIONAL]: bigWidgetSize
        },
        MOBILE_CLASSIC: {
            [IN_WINDOW]: standardWidgetSize,
            [TOP_LEFT]: standardWidgetSize,
            [TOP_RIGHT]: standardWidgetSize,
            [BOTTOM_LEFT]: standardWidgetSize,
            [BOTTOM_RIGHT]: standardWidgetSize,
            [BOTTOM_RIGHT_ADDITIONAL]: standardWidgetSize,
            [BOTTOM_LEFT_ADDITIONAL]: standardWidgetSize
        },
        [KEY._DEFAULT]: {
            [IN_WINDOW]: standardWidgetSize,
            [TOP_LEFT]: standardWidgetSize,
            [TOP_RIGHT]: standardWidgetSize,
            [BOTTOM_LEFT]: standardWidgetSize,
            [BOTTOM_RIGHT]: standardWidgetSize,
            [BOTTOM_RIGHT_ADDITIONAL]: standardWidgetSize,
            [BOTTOM_LEFT_ADDITIONAL]: standardWidgetSize
        },
        [KEY._920_X_555]: {
            [IN_WINDOW]: smallWidgetSize,
            [TOP_LEFT]: smallWidgetSize,
            [TOP_RIGHT]: smallWidgetSize,
            [BOTTOM_LEFT]: smallWidgetSize,
            [BOTTOM_RIGHT]: smallWidgetSize,
            [BOTTOM_RIGHT_ADDITIONAL]: smallWidgetSize,
            [BOTTOM_LEFT_ADDITIONAL]: smallWidgetSize
        },
        [KEY._1173_X_555]: {
            [IN_WINDOW]: smallWidgetSize,
            [TOP_LEFT]: smallWidgetSize,
            [TOP_RIGHT]: smallWidgetSize,
            [BOTTOM_LEFT]: smallWidgetSize,
            [BOTTOM_RIGHT]: smallWidgetSize,
            [BOTTOM_RIGHT_ADDITIONAL]: smallWidgetSize,
            [BOTTOM_LEFT_ADDITIONAL]: smallWidgetSize
        },
        [KEY._1024_X_768]: {
            [IN_WINDOW]: smallStandardWidgetSize,
            [TOP_LEFT]: smallStandardWidgetSize,
            [TOP_RIGHT]: smallStandardWidgetSize,
            [BOTTOM_LEFT]: smallStandardWidgetSize,
            [BOTTOM_RIGHT]: smallStandardWidgetSize,
            [BOTTOM_RIGHT_ADDITIONAL]: smallStandardWidgetSize,
            [BOTTOM_LEFT_ADDITIONAL]: smallStandardWidgetSize
        },
        [KEY._1277_X_768]: {
            [IN_WINDOW]: standardWidgetSize,
            [TOP_LEFT]: standardWidgetSize,
            [TOP_RIGHT]: standardWidgetSize,
            [BOTTOM_LEFT]: standardWidgetSize,
            [BOTTOM_RIGHT]: standardWidgetSize,
            [BOTTOM_RIGHT_ADDITIONAL]: standardWidgetSize,
            [BOTTOM_LEFT_ADDITIONAL]: standardWidgetSize
        },
        [KEY._1200_X_675]: {
            [IN_WINDOW]: standardWidgetSize,
            [TOP_LEFT]: standardWidgetSize,
            [TOP_RIGHT]: standardWidgetSize,
            [BOTTOM_LEFT]: standardWidgetSize,
            [BOTTOM_RIGHT]: standardWidgetSize,
            [BOTTOM_RIGHT_ADDITIONAL]: standardWidgetSize,
            [BOTTOM_LEFT_ADDITIONAL]: standardWidgetSize
        },
        [KEY._1253_X_675]: {
            [IN_WINDOW]: standardWidgetSize,
            [TOP_LEFT]: standardWidgetSize,
            [TOP_RIGHT]: standardWidgetSize,
            [BOTTOM_LEFT]: standardWidgetSize,
            [BOTTOM_RIGHT]: standardWidgetSize,
            [BOTTOM_RIGHT_ADDITIONAL]: standardWidgetSize,
            [BOTTOM_LEFT_ADDITIONAL]: standardWidgetSize
        },
        [KEY._1366_X_768]: {
            [IN_WINDOW]: standardWidgetSize,
            [TOP_LEFT]: standardWidgetSize,
            [TOP_RIGHT]: standardWidgetSize,
            [BOTTOM_LEFT]: standardWidgetSize,
            [BOTTOM_RIGHT]: standardWidgetSize,
            [BOTTOM_RIGHT_ADDITIONAL]: standardWidgetSize,
            [BOTTOM_LEFT_ADDITIONAL]: standardWidgetSize
        },
        [KEY._1619_X_768]: {
            [IN_WINDOW]: standardWidgetSize,
            [TOP_LEFT]: standardWidgetSize,
            [TOP_RIGHT]: standardWidgetSize,
            [BOTTOM_LEFT]: standardWidgetSize,
            [BOTTOM_RIGHT]: standardWidgetSize,
            [BOTTOM_RIGHT_ADDITIONAL]: standardWidgetSize,
            [BOTTOM_LEFT_ADDITIONAL]: standardWidgetSize
        },
        [KEY._1600_X_900]: {
            [IN_WINDOW]: standardWidgetSize,
            [TOP_LEFT]: standardWidgetSize,
            [TOP_RIGHT]: standardWidgetSize,
            [BOTTOM_LEFT]: standardWidgetSize,
            [BOTTOM_RIGHT]: standardWidgetSize,
            [BOTTOM_RIGHT_ADDITIONAL]: standardWidgetSize,
            [BOTTOM_LEFT_ADDITIONAL]: standardWidgetSize
        },
        [KEY._1853_X_900]: {
            [IN_WINDOW]: standardWidgetSize,
            [TOP_LEFT]: standardWidgetSize,
            [TOP_RIGHT]: standardWidgetSize,
            [BOTTOM_LEFT]: standardWidgetSize,
            [BOTTOM_RIGHT]: standardWidgetSize,
            [BOTTOM_RIGHT_ADDITIONAL]: standardWidgetSize,
            [BOTTOM_LEFT_ADDITIONAL]: standardWidgetSize
        },
        [KEY._1920_X_1080]: {
            [IN_WINDOW]: standardWidgetSize,
            [TOP_LEFT]: standardWidgetSize,
            [TOP_RIGHT]: standardWidgetSize,
            [BOTTOM_LEFT]: standardWidgetSize,
            [BOTTOM_RIGHT]: standardWidgetSize,
            [BOTTOM_RIGHT_ADDITIONAL]: standardWidgetSize,
            [BOTTOM_LEFT_ADDITIONAL]: standardWidgetSize
        }
    }
};