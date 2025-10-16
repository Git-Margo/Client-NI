var Templates = require('@core/Templates');
let ServerStorageData = require('@core/storage/ServerStorageData');
var TutorialData = require('@core/tutorial/TutorialData');
var ResolutionData = require('@core/resolution/ResolutionData');
const Storage = require('@core/Storage');
let StorageData = require('@core/StorageData');
let SettingsData = require('@core/settings/SettingsData.js');
const {
    isMobileApp
} = require('@core/HelpersTS');
module.exports = function() {

    const moduleData = {
        fileName: "WidgetManger.js"
    };

    var defaultWidgetSet = null;
    let attachWidgetList = {};

    let widgetLinkedWithSection = {};

    let widgetLoaded = false;
    let editableMode = false;

    const WIDGETS_IN_ONE_BAR = 7;
    const WIDGET_MARGIN = 5;
    const MARGIN_BETWEEN_COLUMN_AND_VERTICAL_WIDGETS = 0;

    //let widgetBarColumnVisibilityToggleSize = 42;

    //let widgetSize = null;

    let widgetSizeFactor = null;

    let widgetSizeData = null;
    let widgetVerticalOrientationData = null;
    let widgetBarStaticPositionData = null;
    let widgetBarColumnVisibilityToggleData = null;
    let widgetBarVisibilityToggleData = null;

    let self = this;

    this.init = () => {
        setWidgetSizeFactor(1);
        initWidgetSizeData();
        initWidgetVerticalOrientationData();
        initWidgetBarStaticPositionData();
        initWidgetBarColumnVisibilityToggleData();
        initWidgetBarVisibilityToggleData();




        if (mobileCheck()) {
            //if (getEngine().interface.getInterfaceLightMode()) {
            //	initMobileWidgetSet();
            //} else {
            //	initMobileClassicWidgetSet();
            //}

            initMobileWidgetsByLightMode();

        } else {

            if (getEngine().interface.getInterfaceLightMode()) {
                initLightWidgetSet();
            } else {
                initClassicWidgetSet();
            }

        }

        //initClassicWidgetSet();

        //this.setWidgetSize(ResolutionData.WIDGET_SIZE_BY_RES[ResolutionData.KEY._DEFAULT]);

        //updateWidgetSizeByResolution(ResolutionData.KEY._DEFAULT);
        //updateWidgetBarStaticPosition();
        //updateWidgetColumnVisibilityToggle();

        initColumnVisibilityButton();

        this.initDrop();

        //this.addElementToWidgetLinkedWithSection(Engine.widgetsData.name.CHAT,          () => {return Engine.chat.getChatSizeFromStorage();});
        this.addElementToWidgetLinkedWithSection(Engine.widgetsData.name.CHAT, () => {
            return Engine.chatController.getChatWindow().getChatSize();
        });
        this.addElementToWidgetLinkedWithSection(Engine.widgetsData.name.MAP, () => {
            return Engine.miniMapController.getMiniMapShow();
        });
        this.addElementToWidgetLinkedWithSection(Engine.widgetsData.name.EQ_TOGGLE, () => {
            return Engine.interface.getEqColumnsSizeFromStorage();
        });
        this.addElementToWidgetLinkedWithSection(Engine.widgetsData.name.BATTLE_LOG, () => {
            return Engine.battle.getBattleMessageShow()
        });

        this.initDefaultWidgetSet();

    };

    const initMobileWidgetsByLightMode = () => {
        if (getEngine().interface.getInterfaceLightMode()) {
            initMobileWidgetSet();
        } else {
            initMobileClassicWidgetSet();
        }
    }

    const getWidgetMargin = () => {
        if (Engine.interface.getInterfaceLightMode()) {
            return WIDGET_MARGIN;
        } else {
            return 0;
        }
    }

    const initColumnVisibilityButton = () => {
        const POS = Engine.widgetsData.pos;
        const $leftTop = getColumnVisibilityButton(POS.TOP_LEFT);
        const $rightTop = getColumnVisibilityButton(POS.TOP_RIGHT);
        const size = ResolutionData.WIDGET_BAR_COLUMN_VISIBILITY_TOGGLE_SIZE;

        $leftTop.width(size);
        $leftTop.height(size);

        $rightTop.width(size);
        $rightTop.height(size);

        $leftTop.on('click', () => {
            return Engine.interface.clickChat();
        });
        $rightTop.on('click', () => {
            return Engine.interface.clickEqColumnShow();
        });
    };

    const updateAmountOfEqColumnVisibleButton = (amount) => {
        updateAmountOfColumnVisibilityButton(Engine.widgetsData.pos.TOP_RIGHT, amount)
    }

    const updateAmountOfChatColumnVisibleButton = (amount) => {
        updateAmountOfColumnVisibilityButton(Engine.widgetsData.pos.TOP_LEFT, amount)
    }

    const updateAmountOfColumnVisibilityButton = (pos, amount) => {
        const $button = getColumnVisibilityButton(pos);

        $button.find('.amount').html(amount);
    }

    const getColumnVisibilityButton = (pos) => {
        const POS = Engine.widgetsData.pos;
        const $interfaceLayer = Engine.interface.get$interfaceLayer();

        let $positioner;

        switch (pos) {
            case POS.TOP_LEFT:
            case POS.TOP_RIGHT:
                $positioner = $interfaceLayer.find('.top.positioner')
                break;
            case POS.BOTTOM_LEFT:
            case POS.BOTTOM_RIGHT:
                $positioner = $interfaceLayer.find('.bottom.positioner')
                break;
        }

        if (!$positioner) {
            return null;
        }

        return $positioner.find('.' + pos + '-column-visibility-toggle')
    }

    const initWidgetSizeData = () => {
        const POS = Engine.widgetsData.pos;
        widgetSizeData = {
            [POS.TOP_LEFT]: null,
            [POS.TOP_RIGHT]: null,
            [POS.BOTTOM_LEFT]: null,
            [POS.BOTTOM_RIGHT]: null,
            [POS.BOTTOM_LEFT_ADDITIONAL]: null,
            [POS.BOTTOM_RIGHT_ADDITIONAL]: null,
        }

    };

    const initWidgetVerticalOrientationData = () => {
        const POS = Engine.widgetsData.pos;
        widgetVerticalOrientationData = {
            [POS.TOP_LEFT]: false,
            [POS.TOP_RIGHT]: false,
            [POS.BOTTOM_LEFT]: false,
            [POS.BOTTOM_RIGHT]: false,
            [POS.BOTTOM_LEFT_ADDITIONAL]: false,
            [POS.BOTTOM_RIGHT_ADDITIONAL]: false
        };

    };

    const initWidgetBarStaticPositionData = () => {
        const POS = Engine.widgetsData.pos;
        widgetBarStaticPositionData = {
            [POS.TOP_LEFT]: true,
            [POS.TOP_RIGHT]: true,
            [POS.BOTTOM_LEFT]: true,
            [POS.BOTTOM_RIGHT]: true,
            [POS.BOTTOM_LEFT_ADDITIONAL]: true,
            [POS.BOTTOM_RIGHT_ADDITIONAL]: true
        };

    };

    const initWidgetBarColumnVisibilityToggleData = () => {
        const POS = Engine.widgetsData.pos;
        widgetBarColumnVisibilityToggleData = {
            [POS.TOP_LEFT]: true,
            [POS.TOP_RIGHT]: true,
            [POS.BOTTOM_LEFT]: false,
            [POS.BOTTOM_RIGHT]: false,
            [POS.BOTTOM_LEFT_ADDITIONAL]: false,
            [POS.BOTTOM_RIGHT_ADDITIONAL]: false
        };

    };

    const initWidgetBarVisibilityToggleData = () => {
        const POS = Engine.widgetsData.pos;
        widgetBarVisibilityToggleData = {
            [POS.TOP_LEFT]: false,
            [POS.TOP_RIGHT]: false,
            [POS.BOTTOM_LEFT]: false,
            [POS.BOTTOM_RIGHT]: false,
            [POS.BOTTOM_LEFT_ADDITIONAL]: false,
            [POS.BOTTOM_RIGHT_ADDITIONAL]: false
        };

    };

    const initMobileWidgetSet = () => {
        const POS = Engine.widgetsData.pos;

        widgetVerticalOrientationData[POS.TOP_LEFT] = false;
        widgetVerticalOrientationData[POS.TOP_RIGHT] = false;
        widgetVerticalOrientationData[POS.BOTTOM_LEFT] = true;
        widgetVerticalOrientationData[POS.BOTTOM_RIGHT] = true;
        widgetVerticalOrientationData[POS.BOTTOM_LEFT_ADDITIONAL] = true;
        widgetVerticalOrientationData[POS.BOTTOM_RIGHT_ADDITIONAL] = true;


        widgetBarStaticPositionData[POS.TOP_LEFT] = true;
        widgetBarStaticPositionData[POS.TOP_RIGHT] = false;
        widgetBarStaticPositionData[POS.BOTTOM_LEFT] = false;
        widgetBarStaticPositionData[POS.BOTTOM_RIGHT] = false;
        widgetBarStaticPositionData[POS.BOTTOM_LEFT_ADDITIONAL] = false;
        widgetBarStaticPositionData[POS.BOTTOM_RIGHT_ADDITIONAL] = false;

        widgetBarColumnVisibilityToggleData[POS.TOP_LEFT] = true;
        widgetBarColumnVisibilityToggleData[POS.TOP_RIGHT] = true;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_LEFT] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_RIGHT] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_LEFT_ADDITIONAL] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_RIGHT_ADDITIONAL] = false;

        widgetBarVisibilityToggleData[POS.TOP_LEFT] = true;
        widgetBarVisibilityToggleData[POS.TOP_RIGHT] = true;
        widgetBarVisibilityToggleData[POS.BOTTOM_LEFT] = false;
        widgetBarVisibilityToggleData[POS.BOTTOM_RIGHT] = false;
        widgetBarVisibilityToggleData[POS.BOTTOM_LEFT_ADDITIONAL] = false;
        widgetBarVisibilityToggleData[POS.BOTTOM_RIGHT_ADDITIONAL] = false;
    };

    const initMobileClassicWidgetSet = () => {
        const POS = Engine.widgetsData.pos;

        widgetVerticalOrientationData[POS.TOP_LEFT] = false;
        widgetVerticalOrientationData[POS.TOP_RIGHT] = false;
        widgetVerticalOrientationData[POS.BOTTOM_LEFT] = false;
        widgetVerticalOrientationData[POS.BOTTOM_RIGHT] = false;
        widgetVerticalOrientationData[POS.BOTTOM_LEFT_ADDITIONAL] = false;
        widgetVerticalOrientationData[POS.BOTTOM_RIGHT_ADDITIONAL] = false;


        widgetBarStaticPositionData[POS.TOP_LEFT] = true;
        widgetBarStaticPositionData[POS.TOP_RIGHT] = true;
        widgetBarStaticPositionData[POS.BOTTOM_LEFT] = true;
        widgetBarStaticPositionData[POS.BOTTOM_RIGHT] = true;
        widgetBarStaticPositionData[POS.BOTTOM_LEFT_ADDITIONAL] = true;
        widgetBarStaticPositionData[POS.BOTTOM_RIGHT_ADDITIONAL] = true;

        widgetBarColumnVisibilityToggleData[POS.TOP_LEFT] = false;
        widgetBarColumnVisibilityToggleData[POS.TOP_RIGHT] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_LEFT] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_RIGHT] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_LEFT_ADDITIONAL] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_RIGHT_ADDITIONAL] = false;

        widgetBarVisibilityToggleData[POS.TOP_LEFT] = false;
        widgetBarVisibilityToggleData[POS.TOP_RIGHT] = false;
        widgetBarVisibilityToggleData[POS.BOTTOM_LEFT] = false;
        widgetBarVisibilityToggleData[POS.BOTTOM_RIGHT] = false;
        widgetBarVisibilityToggleData[POS.BOTTOM_LEFT_ADDITIONAL] = false;
        widgetBarVisibilityToggleData[POS.BOTTOM_RIGHT_ADDITIONAL] = false;
    };

    const initLightWidgetSet = () => {
        const POS = Engine.widgetsData.pos;

        widgetBarColumnVisibilityToggleData[POS.TOP_LEFT] = false;
        widgetBarColumnVisibilityToggleData[POS.TOP_RIGHT] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_LEFT] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_RIGHT] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_LEFT_ADDITIONAL] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_RIGHT_ADDITIONAL] = false;
    }

    const initClassicWidgetSet = () => {
        const POS = Engine.widgetsData.pos;

        widgetVerticalOrientationData[POS.TOP_LEFT] = false;
        widgetVerticalOrientationData[POS.TOP_RIGHT] = false;
        widgetVerticalOrientationData[POS.BOTTOM_LEFT] = false;
        widgetVerticalOrientationData[POS.BOTTOM_RIGHT] = false;
        widgetVerticalOrientationData[POS.BOTTOM_LEFT_ADDITIONAL] = false;
        widgetVerticalOrientationData[POS.BOTTOM_RIGHT_ADDITIONAL] = false;


        widgetBarStaticPositionData[POS.TOP_LEFT] = true;
        widgetBarStaticPositionData[POS.TOP_RIGHT] = true;
        widgetBarStaticPositionData[POS.BOTTOM_LEFT] = true;
        widgetBarStaticPositionData[POS.BOTTOM_RIGHT] = true;
        widgetBarStaticPositionData[POS.BOTTOM_LEFT_ADDITIONAL] = true;
        widgetBarStaticPositionData[POS.BOTTOM_RIGHT_ADDITIONAL] = true;

        widgetBarColumnVisibilityToggleData[POS.TOP_LEFT] = false;
        widgetBarColumnVisibilityToggleData[POS.TOP_RIGHT] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_LEFT] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_RIGHT] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_LEFT_ADDITIONAL] = false;
        widgetBarColumnVisibilityToggleData[POS.BOTTOM_RIGHT_ADDITIONAL] = false;

        widgetBarVisibilityToggleData[POS.TOP_LEFT] = false;
        widgetBarVisibilityToggleData[POS.TOP_RIGHT] = false;
        widgetBarVisibilityToggleData[POS.BOTTOM_LEFT] = false;
        widgetBarVisibilityToggleData[POS.BOTTOM_RIGHT] = false;
        widgetBarVisibilityToggleData[POS.BOTTOM_LEFT_ADDITIONAL] = false;
        widgetBarVisibilityToggleData[POS.BOTTOM_RIGHT_ADDITIONAL] = false;
    };

    const updateWidgetSizeByResolution = (resolution) => {

        if (mobileCheck()) {

            if (getEngine().interface.getInterfaceLightMode()) {
                resolution = "MOBILE";
            } else {
                resolution = "MOBILE_CLASSIC";
            }

        }

        const POS = Engine.widgetsData.pos;
        const IN_WINDOW = Engine.widgetsData.IN_WINDOW;
        const inWindowVal = ResolutionData.WIDGET_SIZE_BY_RES_AND_POS[resolution][IN_WINDOW];
        const lightMode = Engine.interface.getInterfaceLightMode();
        const getDataFromConfig = resolution == "MOBILE" || resolution == ResolutionData.KEY._920_X_555 || resolution == ResolutionData.KEY._1173_X_555 || !lightMode;

        setWidgetSizeData(IN_WINDOW, inWindowVal);

        for (let k in POS) {
            let pos = POS[k];
            let v = ResolutionData.WIDGET_SIZE_BY_RES_AND_POS[resolution][pos];

            if (!getDataFromConfig) { // TODO: SIZE CONFIGURATION
                v = getWidgetSizeFromServerStorage(pos)
            }

            setWidgetSizeData(pos, v);
        }
    }

    const getWidgetSizeFromServerStorage = (pos) => {
        const STANDARD_WIDGET_SIZE = ResolutionData.STANDARD_WIDGET_SIZE;

        if (!Engine.serverStorage) {
            return STANDARD_WIDGET_SIZE
        }

        let store = Engine.serverStorage.get(ServerStorageData.HOT_WIDGET_SIZE_PC);

        if (!store) {
            return STANDARD_WIDGET_SIZE
        }

        if (!store[pos]) {
            return STANDARD_WIDGET_SIZE
        }

        if (!isInt(store[pos])) {
            errorReport(moduleData.fileName, "getWidgetSizeFromServerStorage", "incorrect widget size!", store[pos]);
            return STANDARD_WIDGET_SIZE
        }

        return store[pos]
    };

    const updateWidgetColumnVisibilityToggle = () => {
        const POS = Engine.widgetsData.pos;

        const data = [
            POS.TOP_LEFT,
            POS.TOP_RIGHT,
            POS.BOTTOM_LEFT,
            POS.BOTTOM_RIGHT,
        ]

        for (let k in data) {
            const pos = data[k];
            const v = getWidgetColumnVisibilityToggle(pos);
            const $columnBtn = getColumnVisibilityButton(pos);

            $columnBtn.css('display', v ? 'block' : 'none');
        }
    }

    const updateWidgetBarStaticPosition = () => {
        const POS = Engine.widgetsData.pos;
        const STATIC_WIDGET_POSITION = 'static-widget-position';

        for (let k in POS) {
            const pos = POS[k];
            const $bar = getBar(pos);
            const $columnVisibilityButton = getColumnVisibilityButton(pos);
            const staticPosition = getWidgetBarStaticPosition(pos);

            if (staticPosition) {
                $bar.addClass(STATIC_WIDGET_POSITION)
                if ($columnVisibilityButton) {
                    $columnVisibilityButton.addClass(STATIC_WIDGET_POSITION);
                }
            } else {
                $bar.removeClass(STATIC_WIDGET_POSITION)
                if ($columnVisibilityButton) {
                    $columnVisibilityButton.removeClass(STATIC_WIDGET_POSITION);
                }
            }
        }
    };

    const getWidgetBarStaticPosition = (pos) => {
        return widgetBarStaticPositionData[pos];
    };

    const setWidgetBarStaticPosition = (pos, state) => {
        return widgetBarStaticPositionData[pos] = state;
    };

    const setWidgetSizeData = (pos, size) => {
        //const POS = Engine.widgetsData.pos;
        //if (!POS[pos]) {
        //	errorReport(moduleData.fileName, "pos not exist!", pos);
        //	return null;
        //}

        widgetSizeData[pos] = size
    }

    const getWidgetSize = (pos) => {
        //const POS = Engine.widgetsData.pos;
        //if (!POS[pos]) {
        //	errorReport(moduleData.fileName, "pos not exist!", pos);
        //	return  null;
        //}

        if (getEngine().interface.getInterfaceLightMode() && mobileCheck()) {
            return widgetSizeData[pos] * widgetSizeFactor
        } else {
            return widgetSizeData[pos]
        }


    };

    const setWidgetSizeFactor = (v) => {
        widgetSizeFactor = v;
    }


    //this.setWidgetSize = (_widgetSize) => {
    //	widgetSize = _widgetSize
    //};
    //
    //this.getWidgetSize = () => {
    //	return widgetSize;
    //};

    this.addElementToWidgetLinkedWithSection = (widgetName, funcToCheckIsSectionOpen) => {
        widgetLinkedWithSection[widgetName] = funcToCheckIsSectionOpen;
    };

    this.removeElementFromWidgetLinked = (widgetName) => {
        if (!this.checkWidgetIsLinkedToSection(widgetName)) return;

        delete widgetLinkedWithSection[widgetName];
    };

    this.checkWidgetIsLinkedToSection = (widgetName) => {
        return widgetLinkedWithSection[widgetName] ? true : false;
    };

    this.checkSectionIsShowByLinkedWidget = (widgetName) => {
        if (!widgetLinkedWithSection[widgetName]) return false;

        return widgetLinkedWithSection[widgetName]();
    };

    this.setTypeInDefaultWidgetSet = (name, type) => {
        defaultWidgetSet[name].type = type;
    };

    function addSeveralTypesToWidget() {
        let allTypes = '';
        if (!arguments.length) {
            errorReport('WidgetManager.js', 'addSeveralTypesToWidget', 'arguments is empty!');
            return allTypes;
        }
        for (let k in arguments) {
            allTypes += arguments[k];
            allTypes += ' ';
        }

        return allTypes.slice(0, allTypes.length - 1)
    };

    const checkWidgetInAdditionalBarInDefaultWidgetSet = (pos) => {
        for (let k in defaultWidgetSet) {
            if (defaultWidgetSet[k].pos == pos) {
                return true
            }
        }

        return false;
    };

    this.initDefaultWidgetSet = function() {
        const w = Engine.widgetsData.name;
        const p = Engine.widgetsData.pos;
        const t = Engine.widgetsData.type;
        var m = mobileCheck();
        var disabled = Engine.party ? '' : t.DISABLED;

        let o = Engine.interface;

        if (!m) {
            defaultWidgetSet = {
                //[w.EXIT]: 							{default: true, index: 0, pos: p.TOP_LEFT,  			txt: self.tLang('quit_game'),								type: t.GREEN, 										 clb: o.clickLogout,					requires: {minCharactersAmount: 2}},
                [w.EXIT]: {
                    default: true,
                    index: 0,
                    pos: p.TOP_LEFT,
                    txt: self.tLang('quit_game'),
                    type: t.GREEN,
                    clb: o.clickLogout
                },
                [w.WORLD]: {
                    default: true,
                    index: 1,
                    pos: p.TOP_LEFT,
                    txt: _t('title', null, 'world_window'),
                    type: t.GREEN,
                    clb: o.clickWorld
                },
                [w.SETTINGS]: {
                    default: true,
                    index: 2,
                    pos: p.TOP_LEFT,
                    txt: self.tLang('game-config'),
                    type: t.GREEN,
                    clb: o.clickSettings,
                    alwaysExist: true
                },
                //[w.FULL_SCREEN]: 					{default: true, index: 3, pos: p.TOP_LEFT,  			txt: self.tLang('full-screen'), 							type: t.GREEN, 										 clb: o.clickFullScreen},

                [w.REWARDS_CALENDAR]: {
                    default: true,
                    index: 3,
                    pos: p.TOP_LEFT,
                    txt: _t('clickEventCalendar'),
                    type: t.VIOLET,
                    clb: o.clickRewardsCalendar,
                    requires: {
                        minLvl: 25,
                        funcRequire: {
                            func: function() {
                                return Engine.rewardsCalendarActive
                            },
                            txt: _t('calendarNotAvailableNow')
                        }
                    }
                },

                [w.ADDONS]: {
                    default: true,
                    index: 6,
                    pos: p.TOP_RIGHT,
                    txt: self.tLang('addons-widget'),
                    type: t.GREEN,
                    clb: o.clickPuzzle,
                    requires: {
                        minLvl: 3
                    }
                },
                [w.CLAN]: {
                    default: true,
                    index: 5,
                    pos: p.TOP_RIGHT,
                    txt: self.tLang('clans-widget'),
                    type: t.GREEN,
                    clb: o.clickClan
                },
                [w.MAP]: {
                    default: true,
                    index: 4,
                    pos: p.TOP_RIGHT,
                    txt: self.tLang('show-minimap'),
                    type: t.GREEN,
                    clb: o.clickMiniMap
                },
                [w.PARTY]: {
                    default: true,
                    index: 3,
                    pos: p.TOP_RIGHT,
                    txt: self.tLang('party-widget'),
                    type: addSeveralTypesToWidget(t.BLUE, disabled),
                    clb: o.clickParty,
                    alwaysExist: true
                },

                [w.CHAT]: {
                    default: true,
                    index: 0,
                    pos: p.BOTTOM_LEFT,
                    txt: self.tLang('chat-widget'),
                    type: t.GREEN,
                    clb: o.clickChat,
                    alwaysExist: true
                },
                [w.CRAFTING]: {
                    default: true,
                    index: 1,
                    pos: p.BOTTOM_LEFT,
                    txt: _t('iconphoto'),
                    type: t.GREEN,
                    clb: o.clickCrafting,
                    requires: {
                        minLvl: isPl() ? 10 : 6
                    },
                    alwaysExist: true
                },
                [w.MINI_MAP]: {
                    default: true,
                    index: 2,
                    pos: p.BOTTOM_LEFT,
                    txt: _t('hotportablemap'),
                    type: t.GREEN,
                    clb: o.clickPortableMap
                },
                [w.WHO_IS_HERE]: {
                    default: true,
                    index: 3,
                    pos: p.BOTTOM_LEFT,
                    txt: _t('iconcompass'),
                    type: t.GREEN,
                    clb: o.clickWhoIsHere,
                    requires: {
                        minLvl: 3
                    }
                },

                [w.PREMIUM]: {
                    default: true,
                    index: 6,
                    pos: p.BOTTOM_RIGHT,
                    txt: _t('premium'),
                    type: t.BLINK_VIOLET,
                    clb: o.clickPremium,
                    alwaysExist: true
                },
                [w.SKILLS]: {
                    default: true,
                    index: 4,
                    pos: p.BOTTOM_RIGHT,
                    txt: self.tLang('skills-panel'),
                    type: t.GREEN,
                    clb: o.clickSkills,
                    alwaysExist: true,
                    requires: {
                        minLvl: 25
                    }
                },
                [w.COMMUNITY]: {
                    default: true,
                    index: 3,
                    pos: p.BOTTOM_RIGHT,
                    txt: _t('society'),
                    type: t.GREEN,
                    clb: o.clickSociety,
                    alwaysExist: true
                },
                [w.QUEST_LOG]: {
                    default: true,
                    index: 2,
                    pos: p.BOTTOM_RIGHT,
                    txt: self.tLang('quest-log'),
                    type: t.GREEN,
                    clb: o.clickQuests,
                    alwaysExist: true
                },

                [w.PICK_UP_ITEM]: {
                    default: false,
                    txt: _t('hotTakeGroundItem'),
                    type: t.GREEN,
                    clb: o.clickDragGroundItem
                },
                [w.ATTACK_MOB]: {
                    default: false,
                    txt: _t('hotAttackNearMob'),
                    type: t.GREEN,
                    clb: o.clickAttackNearMob,
                    contextMenu: function() {
                        return berserkContextMenu()
                    }
                },
                [w.ATTACK_PLAYER]: {
                    default: false,
                    txt: _t('hotAttackNearPlayer'),
                    type: t.GREEN,
                    clb: o.clickAttackNearPlayer
                },
                [w.TALK]: {
                    default: false,
                    txt: _t('hotTalkNearMob'),
                    type: t.GREEN,
                    clb: o.clickTalkNearMob
                },
                [w.BATTLE_LOG]: {
                    default: false,
                    txt: _t('showLog'),
                    type: t.GREEN,
                    clb: o.clickShowLog
                },
                [w.EQ_TOGGLE]: {
                    default: false,
                    txt: _t('eqcolumnshow'),
                    type: t.GREEN,
                    clb: o.clickEqColumnShow
                },
                [w.ATTACK_MOB_AUTO]: {
                    default: false,
                    txt: _t('autofightNearMob'),
                    type: t.GREEN,
                    clb: o.clickAutofightNearMob,
                    contextMenu: function() {
                        return berserkContextMenu()
                    }
                },
                [w.USE_DOOR]: {
                    default: false,
                    txt: _t('go-gateway'),
                    type: t.GREEN,
                    clb: o.clickGoGateway
                },
                [w.QUICK_PARTY]: {
                    default: false,
                    txt: _t('sendInviteToGroup'),
                    type: t.GREEN,
                    clb: o.clickQuickPaty
                },
                [w.CONSOLE]: {
                    default: false,
                    txt: self.tLang('iconconsole'),
                    type: t.GREEN,
                    clb: o.clickConsole
                },
                [w.CLAN_MSG]: {
                    default: false,
                    txt: _t('hotkey_send', null, 'clan_my_location'),
                    type: t.GREEN,
                    clb: o.clickSendMessageOnClanChat
                },

                [w.LOOT_FILTER]: {
                    default: true,
                    index: 4,
                    pos: p.BOTTOM_LEFT,
                    txt: _t('title', null, 'loot-filter'),
                    type: t.GREEN,
                    clb: o.clickLootFilter
                }
            };

            if (isPl()) defaultWidgetSet[w.NEWS] = {
                default: true,
                index: 5,
                pos: p.BOTTOM_RIGHT,
                txt: _t('news', null, 'news'),
                type: t.VIOLET,
                clb: o.clickNews,
                alwaysExist: true,
                requires: {
                    minLvl: 15
                }
            };

            if (isPl()) defaultWidgetSet[w.MATCHMAKING] = {
                default: true,
                index: 2,
                pos: p.TOP_RIGHT,
                txt: self.tLang('matchmaking'),
                type: t.GREEN,
                clb: o.clickMatchmaking,
                requires: {
                    minLvl: 40
                }
            };

            if (Engine.interface.getBattlePassActive()) defaultWidgetSet[w.BATTLE_PASS] = {
                default: true,
                index: 1,
                pos: p.BOTTOM_RIGHT,
                txt: _t('path_of_hero'),
                type: t.VIOLET,
                clb: o.clickBattlePass,
                alwaysExist: true,
                requires: {
                    minLvl: 10
                }
            };
        } else {

            defaultWidgetSet = {
                [w.ZOOM]: {
                    default: true,
                    index: 0,
                    pos: p.TOP_LEFT,
                    txt: _t('zoom-in-out-panel'),
                    type: t.GREEN,
                    clb: o.clickZoomOverlayPanel,
                    alwaysExist: true
                },
                [w.SETTINGS]: {
                    default: true,
                    index: 1,
                    pos: p.TOP_LEFT,
                    txt: self.tLang('game-config'),
                    type: t.GREEN,
                    clb: o.clickSettings,
                    alwaysExist: true
                },
                [w.ADDONS]: {
                    default: true,
                    index: 2,
                    pos: p.TOP_LEFT,
                    txt: self.tLang('addons-widget'),
                    type: t.GREEN,
                    clb: o.clickPuzzle,
                    requires: {
                        minLvl: 3
                    }
                },
                [w.WORLD]: {
                    default: true,
                    index: 3,
                    pos: p.TOP_LEFT,
                    txt: _t('title', null, 'world_window'),
                    type: t.GREEN,
                    clb: o.clickWorld
                },
                [w.PREMIUM]: {
                    default: true,
                    index: 5,
                    pos: p.TOP_LEFT,
                    txt: _t('premium'),
                    type: t.BLINK_VIOLET,
                    clb: o.clickPremium,
                    alwaysExist: true
                },
                [w.REWARDS_CALENDAR]: {
                    default: true,
                    index: 6,
                    pos: p.TOP_LEFT,
                    txt: _t('clickEventCalendar'),
                    type: t.VIOLET,
                    clb: o.clickRewardsCalendar,
                    requires: {
                        minLvl: 25,
                        funcRequire: {
                            func: function() {
                                return Engine.rewardsCalendarActive
                            },
                            txt: _t('calendarNotAvailableNow')
                        }
                    }
                },

                [w.COMMUNITY]: {
                    default: true,
                    index: 6,
                    pos: p.TOP_RIGHT,
                    txt: _t('society'),
                    type: t.GREEN,
                    clb: o.clickSociety,
                    alwaysExist: true
                },
                [w.CLAN]: {
                    default: true,
                    index: 5,
                    pos: p.TOP_RIGHT,
                    txt: self.tLang('clans-widget'),
                    type: t.GREEN,
                    clb: o.clickClan
                },
                [w.QUEST_LOG]: {
                    default: true,
                    index: 4,
                    pos: p.TOP_RIGHT,
                    txt: self.tLang('quest-log'),
                    type: t.GREEN,
                    clb: o.clickQuests,
                    alwaysExist: true
                },
                [w.MAP]: {
                    default: true,
                    index: 3,
                    pos: p.TOP_RIGHT,
                    txt: self.tLang('show-minimap'),
                    type: t.GREEN,
                    clb: o.clickMiniMap
                },
                [w.CRAFTING]: {
                    default: true,
                    index: 2,
                    pos: p.TOP_RIGHT,
                    txt: _t('iconphoto'),
                    type: t.GREEN,
                    clb: o.clickCrafting,
                    requires: {
                        minLvl: isPl() ? 10 : 6
                    },
                    alwaysExist: true
                },
                [w.SKILLS]: {
                    default: true,
                    index: 1,
                    pos: p.TOP_RIGHT,
                    txt: self.tLang('skills-panel'),
                    type: t.GREEN,
                    clb: o.clickSkills,
                    alwaysExist: true,
                    requires: {
                        minLvl: 25
                    }
                },

                //[w.FULL_SCREEN]: 					{default: true, index: 6, pos: p.BOTTOM_LEFT, 								txt: self.tLang('full-screen'), 												type: t.GREEN, 										 clb: o.clickFullScreen},
                //[w.REFRESH_PAGE]: 					{default: true, index: 0, pos: p.BOTTOM_LEFT, 								txt: _t('filter_refresh'), 														type: t.GREEN, 										 clb: o.clickRefresh, 				alwaysExist:true, contextMenu: function () {return refreshContextMenu()}},
                [w.LOOT_FILTER]: {
                    default: true,
                    index: 1,
                    pos: p.BOTTOM_LEFT,
                    txt: _t('title', null, 'loot-filter'),
                    type: t.GREEN,
                    clb: o.clickLootFilter
                },
                [w.PARTY]: {
                    default: true,
                    index: 2,
                    pos: p.BOTTOM_LEFT,
                    txt: self.tLang('party-widget'),
                    type: addSeveralTypesToWidget(t.BLUE, disabled),
                    clb: o.clickParty,
                    alwaysExist: true
                },
                //[w.EXIT]: 							{default: true, index: 3, pos: p.BOTTOM_LEFT,  								txt: self.tLang('quit_game'),													type: t.GREEN, 										 clb: o.clickLogout,				requires: {minCharactersAmount: 2}},
                [w.EXIT]: {
                    default: true,
                    index: 3,
                    pos: p.BOTTOM_LEFT,
                    txt: self.tLang('quit_game'),
                    type: t.GREEN,
                    clb: o.clickLogout
                },
                [w.WHO_IS_HERE]: {
                    default: true,
                    index: 4,
                    pos: p.BOTTOM_LEFT,
                    txt: _t('iconcompass'),
                    type: t.GREEN,
                    clb: o.clickWhoIsHere,
                    requires: {
                        minLvl: 3
                    }
                },
                [w.MINI_MAP]: {
                    default: true,
                    index: 5,
                    pos: p.BOTTOM_LEFT,
                    txt: _t('hotportablemap'),
                    type: t.GREEN,
                    clb: o.clickPortableMap
                },

                //[w.PAD]: 							{default: true, index: 6, pos: p.BOTTOM_LEFT_ADDITIONAL,  					txt: _t('padController'), 															type: t.GREEN, 										 clb: o.clickPad,								alwaysExist:true},

                [w.PICK_UP_ITEM]: {
                    default: true,
                    index: 6,
                    pos: p.BOTTOM_RIGHT,
                    txt: _t('hotTakeGroundItem'),
                    type: t.GREEN,
                    clb: o.clickDragGroundItem
                },
                [w.TALK]: {
                    default: true,
                    index: 5,
                    pos: p.BOTTOM_RIGHT,
                    txt: _t('hotTalkNearMob'),
                    type: t.GREEN,
                    clb: o.clickTalkNearMob
                },
                [w.ATTACK_PLAYER]: {
                    default: true,
                    index: 3,
                    pos: p.BOTTOM_RIGHT,
                    txt: _t('hotAttackNearPlayer'),
                    type: t.GREEN,
                    clb: o.clickAttackNearPlayer
                },
                [w.QUICK_PARTY]: {
                    default: true,
                    index: 1,
                    pos: p.BOTTOM_RIGHT,
                    txt: _t('sendInviteToGroup'),
                    type: t.GREEN,
                    clb: o.clickQuickPaty
                },
                [w.USE_DOOR]: {
                    default: false,
                    txt: _t('go-gateway'),
                    type: t.GREEN,
                    clb: o.clickGoGateway
                },

                [w.ATTACK_MOB]: {
                    default: true,
                    index: 6,
                    pos: p.BOTTOM_RIGHT_ADDITIONAL,
                    txt: _t('hotAttackNearMob'),
                    type: t.GREEN,
                    clb: o.clickAttackNearMob,
                    contextMenu: function() {
                        return berserkContextMenu()
                    }
                },
                [w.ATTACK_MOB_AUTO]: {
                    default: true,
                    index: 5,
                    pos: p.BOTTOM_RIGHT_ADDITIONAL,
                    txt: _t('autofightNearMob'),
                    type: t.GREEN,
                    clb: o.clickAutofightNearMob,
                    contextMenu: function() {
                        return berserkContextMenu()
                    }
                },
                [w.CLAN_MSG]: {
                    default: false,
                    txt: _t('hotkey_send', null, 'clan_my_location'),
                    type: t.GREEN,
                    clb: o.clickSendMessageOnClanChat
                },


                [w.EQ_TOGGLE]: {
                    default: false,
                    txt: _t('eqcolumnshow'),
                    type: t.GREEN,
                    clb: o.clickEqColumnShow
                },
                //[w.CHAT]: 							{default: false,  															txt: self.tLang('chat-widget'), 												type: t.GREEN, 										 clb: o.clickChat,					alwaysExist:true},

                [w.BATTLE_LOG]: {
                    default: false,
                    txt: _t('showLog'),
                    type: t.GREEN,
                    clb: o.clickShowLog
                },
                [w.CONSOLE]: {
                    default: false,
                    txt: self.tLang('iconconsole'),
                    type: t.GREEN,
                    clb: o.clickConsole
                },
            };



            if (isMobileApp()) {
                defaultWidgetSet[w.CHAT] = {
                    default: false,
                    txt: self.tLang('chat-widget'),
                    type: t.GREEN,
                    clb: o.clickChat,
                    alwaysExist: true
                };
            } else {
                defaultWidgetSet[w.CHAT] = {
                    default: true,
                    index: 0,
                    pos: p.BOTTOM_LEFT,
                    txt: self.tLang('chat-widget'),
                    type: t.GREEN,
                    clb: o.clickChat,
                    alwaysExist: true
                };
            }

            if (isMobileApp()) {
                defaultWidgetSet[w.REFRESH_PAGE] = {
                    default: true,
                    index: 0,
                    pos: p.BOTTOM_LEFT,
                    txt: _t('filter_refresh'),
                    type: t.GREEN,
                    clb: o.clickRefresh,
                    alwaysExist: true,
                    contextMenu: function() {
                        return refreshContextMenu()
                    }
                }
            } else {
                defaultWidgetSet[w.REFRESH_PAGE] = {
                    default: true,
                    index: 6,
                    pos: p.BOTTOM_LEFT,
                    txt: _t('filter_refresh'),
                    type: t.GREEN,
                    clb: o.clickRefresh,
                    alwaysExist: true,
                    contextMenu: function() {
                        return refreshContextMenu()
                    }
                }
            }

            // if (_l() == 'pl') defaultWidgetSet[w.NEWS] = 				  {default: true, index: 1, pos: p.BOTTOM_RIGHT, 							txt: _t('news', null, 'news'), 						          type: t.VIOLET,										  clb: o.clickNews,								alwaysExist:true, requires: {minLvl: 15}};
            // if (_l() != 'pl') defaultWidgetSet[w.ACHIEVEMENTS] =  {default: true, index: 5, pos: p.TOP_RIGHT, 								txt: self.tLang('achievements'), 					          type: t.GREEN,										  clb: o.clickAchivements,				  alwaysExist:true};
            // if (_l() == 'pl') defaultWidgetSet[w.MATCHMAKING] = 	{default: false, 																						txt: self.tLang('matchmaking'), 					          type: t.GREEN,										  clb: o.clickMatchmaking,         requires: {minLvl: 40}};

            if (isPl()) defaultWidgetSet[w.NEWS] = {
                default: true,
                index: 4,
                pos: p.TOP_LEFT,
                txt: _t('news', null, 'news'),
                type: t.VIOLET,
                clb: o.clickNews,
                alwaysExist: true,
                requires: {
                    minLvl: 15
                }
            };
            if (isPl()) defaultWidgetSet[w.MATCHMAKING] = {
                default: true,
                index: 0,
                pos: p.TOP_RIGHT,
                txt: self.tLang('matchmaking'),
                type: t.GREEN,
                clb: o.clickMatchmaking,
                requires: {
                    minLvl: 40
                }
            };


            if (Engine.interface.getBattlePassActive()) defaultWidgetSet[w.BATTLE_PASS] = {
                default: true,
                index: 1,
                pos: p.BOTTOM_RIGHT,
                txt: _t('path_of_hero'),
                type: t.VIOLET,
                clb: o.clickBattlePass,
                alwaysExist: true,
                requires: {
                    minLvl: 10
                }
            };
            //if (Engine.interface.rewardsCalendarActive()) defaultWidgetSet[[w.REWARDS_CALENDAR]] = {default: true, index: 3, pos: p.BOTTOM_LEFT_ADDITIONAL,		txt: _t('clickEventCalendar'),  type: t.VIOLET,										  clb: o.clickRewardsCalendar, 		alwaysExist:true, requires: {minLvl: 25}};
        }

        for (let k in defaultWidgetSet) {
            defaultWidgetSet[k].keyName = k;
        }
    };
    /*
    	this.initOneDropToDeleteWidget = function (name) {

    		Engine.interface.get$dropToDeleteWidgetLayer().find('.' + name).droppable({
    			accept: '.widget-in-interface-bar',
    			drop: function (e, ui) {
    				var widgetKey = ui.draggable.data(Engine.widgetsData.data.WIDGET_KEY);
    				if (isset(defaultWidgetSet[widgetKey].alwaysExist) && defaultWidgetSet[widgetKey].alwaysExist) {
    					mAlert(_t('ALWAYS_EXIST'));
    					return;
    				}

    				let keyName = self.getPathToHotWidgetVersion();

    				let prepareObj = {};
    				prepareObj[keyName] = {};
    				prepareObj[keyName][widgetKey] = false;

    				Engine.serverStorage.sendData(prepareObj, () => {
    					self.addWidgetButtons();
    				});

    			}
    		});
    	};
    */
    this.getDefaultWidgetSet = function() {
        return defaultWidgetSet;
    };

    const refreshContextMenu = () => {
        // let menu = [
        // 	[_t('refresh', null, "mails"), 	function () {pageReload()}],
        // 	[self.tLang('full-screen'), 	function () {Engine.interface.clickFullScreen()}],
        // 	[_t('clickLogout'), 			function () {getEngine().changePlayer.logout()}],
        // 	[_t('iconconsole'), 			function () {getEngine().console.open()}]
        // ];

        let menu = [
            [_t('refresh', null, "mails"), function() {
                pageReload()
            }]
        ];

        if (!isMobileApp()) {
            menu.push([self.tLang('full-screen'), function() {
                Engine.interface.clickFullScreen()
            }]);
        }

        menu.push([_t('clickLogout'), function() {
            getEngine().changePlayer.logout()
        }])
        menu.push([_t('iconconsole'), function() {
            getEngine().console.open()
        }])

        return menu
    }

    const berserkContextMenu = () => {
        const inputDataBerserk = getEngine().settingsOptions.getDataToCreateInput(SettingsData.KEY.BERSERK, SettingsData.VARS.BERSERK_VARS.V, function(e) {
            // console.log(e)
        });
        const inputDataBerserkGroup = getEngine().settingsOptions.getDataToCreateInput(SettingsData.KEY.BERSERK_GROUP, SettingsData.VARS.BERSERK_VARS.V, function(e) {
            // console.log(e)
        });

        let menu = [
            [_t('WINDOW_CONFIG'), () => {
                Engine.settings.open({
                    targetOption: SettingsData.KEY.BERSERK
                })
            }]
        ];

        if (isSettingsOptionsBerserk()) {
            menu.push([_t('turnOffAggressive'), () => {
                inputDataBerserk.changeCallback(0)
            }]);
        } else {
            menu.push([_t('turnOnAggressive'), () => {
                inputDataBerserk.changeCallback(1)
            }]);
        }

        if (isSettingsOptionsBerserkGroup()) {
            menu.push([_t('turnOffAggressiveGroup'), () => {
                inputDataBerserkGroup.changeCallback(0)
            }]);
        } else {
            menu.push([_t('turnOnAggressiveGroup'), () => {
                inputDataBerserkGroup.changeCallback(1)
            }]);
        }

        return menu
    }

    //this.addRewardCalendarWidgetIfNotExist = () => {
    //	if (!Engine.interface.rewardsCalendarActive()) {
    //		return;
    //	}
    //
    //	const REWARDS_CALENDAR 	= Engine.widgetsData.name.REWARDS_CALENDAR;
    //	const p 				= Engine.widgetsData.pos;
    //	const VIOLET 			= Engine.widgetsData.type.VIOLET;
    //
    //	if (this.checkAttachWidgetList(REWARDS_CALENDAR)) {
    //		return;
    //	}
    //
    //	//if (mobileCheck()) 	defaultWidgetSet[REWARDS_CALENDAR] = {default: true, index: 3, pos: p.BOTTOM_LEFT_ADDITIONAL,	txt: _t('clickEventCalendar'),  type: VIOLET,	clb: Engine.interface.clickRewardsCalendar, alwaysExist:true, requires: {minLvl: 25}};
    //	if (mobileCheck()) 	defaultWidgetSet[REWARDS_CALENDAR] = {default: true, index: 5, pos: p.TOP_LEFT,	txt: _t('clickEventCalendar'),  type: VIOLET,	clb: Engine.interface.clickRewardsCalendar, alwaysExist:true, requires: {minLvl: 25}};
    //	else 				defaultWidgetSet[REWARDS_CALENDAR] = {default: true, index: 4, pos: p.BOTTOM_LEFT,  			txt: _t('clickEventCalendar'),  type: VIOLET, 	clb: Engine.interface.clickRewardsCalendar,	alwaysExist:true, requires: {minLvl: 25}};
    //
    //
    //	this.rebuildWidgetButtons();
    //};

    this.initOneWidgetDroppable = function(dropName) {
        Engine.interface.get$interfaceLayer().find('.' + dropName).droppable({
            accept: '.widget-button'
        }).on('drop', function(e, ui) {
            var fromAddonPanel = ui.draggable.hasClass('from-addon-panel');
            var fromSettingsPanel = ui.draggable.hasClass('from-settings-panel');
            var index = self.getDropIndex(ui, dropName, $(this));
            var clName = ui.draggable.data(Engine.widgetsData.data.WIDGET_KEY);

            let objToSendToServerStorage = {};

            var $widgetInDropArea = self.checkOnIndexIsEmpty($(this), index);
            if ($widgetInDropArea) {
                if (fromAddonPanel || fromSettingsPanel) {
                    return message(_t('place_is_not_empty'));
                }

                //var wInDropAreaPos = ui.draggable.attr('widget-pos');
                var wInDropAreaPos = ui.draggable.attr(Engine.widgetsData.attr.WIDGET_POS);
                var wInDropAreaIndex = ui.draggable.attr(Engine.widgetsData.attr.WIDGET_INDEX);
                var wInDropAreaName = $widgetInDropArea.data(Engine.widgetsData.data.WIDGET_KEY);

                objToSendToServerStorage[wInDropAreaName] = [wInDropAreaIndex, wInDropAreaPos];
            }

            self.saveHotWidgetToStorage(clName, index, dropName, objToSendToServerStorage);

            let prepareObj = {};

            prepareObj[self.getPathToHotWidgetVersion()] = objToSendToServerStorage;

            if (fromAddonPanel) {
                var addonId = clName.slice(6);
                var title = Engine.addonsPanel.getAddonTitle(addonId);

                prepareObj[ServerStorageData.ADDONS] = {};
                prepareObj[ServerStorageData.ADDONS][addonId] = {
                    state: true
                };

            }

            console.log(prepareObj)

            Engine.serverStorage.sendData(prepareObj, () => {
                self.afterSaveWidgetInServerStorage(clName, index, dropName, fromAddonPanel);
            });

        });
    };

    this.initDrop = function() {
        let widgetsData = Engine.widgetsData;
        this.initOneWidgetDroppable(widgetsData.pos.BOTTOM_LEFT_ADDITIONAL);
        this.initOneWidgetDroppable(widgetsData.pos.BOTTOM_RIGHT_ADDITIONAL);
        this.initOneWidgetDroppable(widgetsData.pos.BOTTOM_LEFT);
        this.initOneWidgetDroppable(widgetsData.pos.BOTTOM_RIGHT);
        this.initOneWidgetDroppable(widgetsData.pos.TOP_RIGHT);
        this.initOneWidgetDroppable(widgetsData.pos.TOP_LEFT);
        //this.initOneDropToDeleteWidget('up-part');
        this.initOneDropToDeleteWidget('middle-part');
        //this.initOneDropToDeleteWidget('down-part');
    };


    //const checkPosIsCollisionWithLayers = (mousePos, whiteListLayersData) => {
    //	const posX 		= mousePos.x;
    //	const posY 		= mousePos.y;
    //
    //	for (let pos in whiteListLayersData) {
    //
    //		let $whiteLayerData = whiteListLayersData[pos];
    //		let $whiteLayer 	= $whiteLayerData[0];
    //		let margin 			= $whiteLayerData[1];
    //		let topTransition 	= $whiteLayerData[2];
    //		let position 		= $whiteLayer.position();
    //
    //		//let marginLeft 		= parseInt($whiteLayer.css('margin-left'));
    //		//let marginRight 	= parseInt($whiteLayer.css('margin-right'));
    //
    //		//let minX 			= position.left + marginLeft - marginRight - margin;
    //		let minX 			= position.left - margin;
    //		let minY 			= position.top + topTransition - margin;
    //		let maxX 			= minX + $whiteLayer.width()  + margin;
    //		let maxY 			= minY + $whiteLayer.height() + margin;
    //
    //		if (
    //			minX < posX && posX < maxX &&
    //			minY < posY && posY < maxY) {
    //
    //			return true
    //		}
    //
    //	}
    //
    //	return false
    //}

    this.initOneDropToDeleteWidget = function(name) {
        Engine.interface.get$dropToDeleteWidgetLayer().find('.' + name).droppable({
            accept: '.widget-in-interface-bar',
            drop: function(e, ui) {
                const POS = Engine.widgetsData.pos;

                let mousPos = {
                    x: ui.offset.left,
                    y: ui.offset.top
                };

                let a = [
                    [getBar(POS.TOP_LEFT), 35],
                    [getBar(POS.TOP_RIGHT), 35],
                    [getBar(POS.BOTTOM_LEFT), 35],
                    [getBar(POS.BOTTOM_LEFT_ADDITIONAL), 35],
                    [getBar(POS.BOTTOM_RIGHT), 35],
                    [getBar(POS.BOTTOM_RIGHT_ADDITIONAL), 35]
                ]

                let collistion = checkPosIsCollisionWithLayers(mousPos, a);

                if (collistion) {
                    return;
                }


                var widgetKey = ui.draggable.data(Engine.widgetsData.data.WIDGET_KEY);


                removeWidget(widgetKey);

            }
        });
    };

    const removeWidget = (widgetKey, callback) => {
        if (isset(defaultWidgetSet[widgetKey].alwaysExist) && defaultWidgetSet[widgetKey].alwaysExist) {
            mAlert(_t('ALWAYS_EXIST'));
            return;
        }

        let keyName = self.getPathToHotWidgetVersion();

        let prepareObj = {};
        prepareObj[keyName] = {};
        prepareObj[keyName][widgetKey] = false;

        Engine.serverStorage.sendData(prepareObj, () => {
            self.addWidgetButtons();
            if (callback) {
                callback();
            }
        });
    }

    const setVisibilityWidgetsByBars = (posToHide, state) => {
        const $interfaceLayer = Engine.interface.get$interfaceLayer();

        for (let k in posToHide) {
            let pos = posToHide[k]

            let $bar = getBar(pos);
            let $toggleButton = $interfaceLayer.find('.' + pos + '-column-visibility-toggle');

            if (state) {
                $bar.css('display', 'block')
                $toggleButton.css('visibility', 'inherit');
            } else {
                $bar.css('display', 'none')
                $toggleButton.css('visibility', 'hidden');
            }
        }
    }

    this.getPathToHotWidgetVersion = function() {
        //return 'hotWidget_' + (mobileCheck() ? 'mobile' : 'pc');
        if (mobileCheck()) return ServerStorageData.HOT_WIDGET_MOBILE;
        else return ServerStorageData.HOT_WIDGET_PC
    };

    this.saveHotWidgetToStorage = function(clName, index, pos, objToSendToServerStorage) {
        objToSendToServerStorage[clName] = [index, pos];
    };

    this.checkOnIndexIsEmpty = (parent, index) => {
        //var $widget = parent.find('[widget-index=' + index + ']');
        let selector = this.createAttrSelector(Engine.widgetsData.attr.WIDGET_INDEX, index);
        let $widget = parent.find(selector);

        return $widget.length > 0 ? $widget : false;
    };

    this.createAttrSelector = (attrName, attrVal) => {
        return `[${attrName}=${attrVal}]`;
    };

    this.setEqWidgetAmountShow = function(show) {
        let result = show ? true : false;
        //self.widgets.isActive('widget-eq-show-icon', result);
        self.widgets.isActive(Engine.widgetsData.name.EQ_TOGGLE, result);
    };

    this.getDropIndex = function(ui, dropName, $e) {
        let widgetsData = Engine.widgetsData;
        let left = dropName == widgetsData.pos.TOP_LEFT || dropName == widgetsData.pos.BOTTOM_LEFT || dropName == widgetsData.pos.BOTTOM_LEFT_ADDITIONAL;


        let widgetSize = getWidgetSize(dropName) + getWidgetMargin();

        //let index 			= Math.round((ui.offset.left  - $e.offset().left)  / widgetSize / Engine.zoomFactor);
        let index;
        let orientationVertical = getWidgetVerticalOrientation(dropName);

        if (orientationVertical) {
            index = Math.round((ui.offset.top - $e.offset().top) / widgetSize / Engine.zoomFactor);
        } else {
            index = Math.round((ui.offset.left - $e.offset().left) / widgetSize / Engine.zoomFactor);
        }

        //if (!left) index = Math.abs(index - 6);

        return index;
    };

    this.afterSaveWidgetInServerStorage = (clName, index, dropName, fromAddonPanel) => {
        if (fromAddonPanel) {
            let addonId = clName.slice(6);
            let title = Engine.addonsPanel.getAddonTitle(addonId);

            self.addKeyToDefaultWidgetSet(clName, index, dropName, title, Engine.widgetsData.type.GREEN, function() {
                //window[clName].manageVisible();
                Engine.addonsPanel.oneAddonManageVisible(addonId);
            });

            Engine.addonsPanel.setStateAddon('xD', true, addonId, true);
        }

        self.addWidgetButtons();
        self.widgetDrop(defaultWidgetSet[clName].txt, dropName + ' ' + index);
    };

    this.getWidgetsSlots = (exception) => {
        var canDelete = {
            name: '',
            pos: '',
            bar: ''
        };
        let widgetsData = Engine.widgetsData;
        var widgets = {
            [widgetsData.pos.TOP_LEFT]: ['', '', '', '', '', '', ''],
            [widgetsData.pos.TOP_RIGHT]: ['', '', '', '', '', '', ''],
            [widgetsData.pos.BOTTOM_LEFT]: ['', '', '', '', '', '', ''],
            [widgetsData.pos.BOTTOM_RIGHT]: ['', '', '', '', '', '', ''],
            [widgetsData.pos.BOTTOM_LEFT_ADDITIONAL]: ['', '', '', '', '', '', ''],
            [widgetsData.pos.BOTTOM_RIGHT_ADDITIONAL]: ['', '', '', '', '', '', '']
        };

        if (exception) {

            for (let j = 0; j < exception.length; j++) {
                let index = exception[j][0];
                let pos = exception[j][1];
                widgets[pos][index] = 'w';
            }

        }

        for (var k in widgets) {
            for (let i = 0; i < widgets[k].length; i++) {

                if (widgets[k][i] == 'w') continue;

                //let find = '[widget-index=' + i + ']';
                let cl = '.' + k;
                let find = self.createAttrSelector(Engine.widgetsData.attr.WIDGET_INDEX, i);
                let $w = Engine.interface.get$interfaceLayer().find(cl).find(find);

                if ($w.length) {
                    widgets[k][i] = 'w';
                    //let name = $w.attr('widget-name');
                    let name = $w.attr(Engine.widgetsData.attr.WIDGET_NAME);
                    if (defaultWidgetSet[name].addon) {
                        canDelete.name = name;
                        canDelete.pos = i;
                        canDelete.bar = k;
                    }
                }
            }
        }

        var result = {
            widgets: widgets,
            canDelete: canDelete
        };

        return result;
    };

    this.getFirstEmptyWidgetSlot = () => {
        var ws = this.getWidgetsSlots();
        let widgets = ws.widgets;
        for (var k in widgets) {
            var v = widgets[k].indexOf('');
            if (v > -1) {
                return {
                    slot: v,
                    container: k
                };
            }
        }
        return false;
    };

    const clearEmptySlotWidget = () => {
        $('.empty-slot-widget').remove();
    }

    this.createEmptySlotsWidget = function() {
        //$('.main-buttons-container').each(function () {
        //	for (let i = 0; i < 7; i++) {
        //		let $emptySlot = Templates.get('empty-slot-widget');
        //
        //		resizeWidget($emptySlot);
        //
        //		$(this).append($emptySlot);
        //	}
        //});

        //return

        const POS = Engine.widgetsData.pos;
        //const $interfaceLayer	= Engine.interface.get$interfaceLayer();

        for (let p in POS) {
            let pos = POS[p];
            let widgetSize = getWidgetSize(pos);
            let $bar = getBar(pos);
            //let selector 	= ".main-buttons-container." + pos;
            //let $bar 		= $interfaceLayer.find(selector);


            for (let index = 0; index < WIDGETS_IN_ONE_BAR; index++) {
                let $emptySlot = Templates.get('empty-slot-widget');

                resizeWidget($emptySlot, widgetSize);

                $emptySlot.attr(Engine.widgetsData.attr.WIDGET_POS, pos);

                $bar.append($emptySlot);

                setWidgetPosition($emptySlot, pos, index);
            }

        }
    };

    const getBar = (pos) => {
        const $interfaceLayer = Engine.interface.get$interfaceLayer();
        const selector = ".main-buttons-container." + pos;

        return $interfaceLayer.find(selector);
    }

    //this.resizeAllEmptySlotWidget = () => {
    //	//$('.empty-slot-widget').each(function () {
    //	//	resizeWidget($(this));
    //	//});
    //
    //	const POS 				= Engine.widgetsData.pos;
    //	const $interfaceLayer	= Engine.interface.get$interfaceLayer();
    //
    //	for (let p in POS) {
    //		let pos 		= POS[p];
    //		let widgetSize 	= getWidgetSize(pos);
    //		let selector 	= ".main-buttons-container." + pos;
    //		let $bar 		= $interfaceLayer.find(selector);
    //
    //
    //		$bar.find('.empty-slot-widget').each(function () {
    //			resizeWidget($(this), widgetSize);
    //		});
    //
    //	}
    //};

    this.resizeAllWidgetInAddons = () => {
        let content = getEngine().addonsPanel.getContent();
        let widgetSize = getWidgetSize(Engine.widgetsData.IN_WINDOW);

        content.find(".widget-button").each(function() {
            resizeWidget($(this), widgetSize);
        });

        content.find('.border-blink').css({
            width: widgetSize - 2,
            height: widgetSize - 2
        });
    };

    this.resizeAllWidgetInSettings = () => {
        let content = getEngine().settings.getContent();

        let widgetSize = getWidgetSize(Engine.widgetsData.IN_WINDOW);

        content.find(".widget-button").each(function() {
            resizeWidget($(this), widgetSize);
        });
    };

    const resizeWidget = ($emptySlotWidget, widgetSize) => {
        $emptySlotWidget.css({
            width: widgetSize,
            height: widgetSize
        });
    };

    this.showEmptySlots = function(show) {
        //$('.main-buttons-container').find('.empty-slot-widget').css('display', show ? 'block' : 'none');
        if (show) {
            $('.main-buttons-container').addClass('edit-mode')
        } else {
            $('.main-buttons-container').removeClass('edit-mode')
        }
    };

    this.updateAmountOtherElementFromWidget = (name, amount) => {
        switch (name) {
            case Engine.widgetsData.name.CHAT:
                Engine.widgetManager.updateAmountOfChatColumnVisibleButton(amount);
                break;
            default:
                // errorReport('WidgetManager.js', 'updateAmountOtherElementFromWidget', 'name: "' + name + '" not found');
                break;
        }

    }

    this.widgets = new(function() {
        this.add = function(widget, position) {
            Engine.interface.get$interfaceLayer().find('.main-buttons-container.' + position).append(widget);
        };

        this.toggleWidgetDisplay = function(name, show) {
            let DISABLED = Engine.widgetsData.type.DISABLED;
            if (show) {
                $('.main-buttons-container .widget-' + name).removeClass(DISABLED);
            } else {
                $('.main-buttons-container .widget-' + name).addClass(DISABLED);
            }
        };

        this.updateAmount = (name, amount) => {
            let $amount = Engine.interface.get$interfaceLayer().find(`.main-buttons-container .widget-${name} .amount`);
            Engine.widgetManager.updateAmountOtherElementFromWidget(name, amount);
            $amount.text(amount);
        };

        this.getWidgetAmount = (name) => {
            let $amount = Engine.interface.get$interfaceLayer().find(`.main-buttons-container .widget-${name} .amount`);
            return $amount.text()
        }

        this.isActive = (name, state) => {
            let $item = Engine.interface.get$interfaceLayer().find(`.main-buttons-container .widget-${name}`);
            if (state) {
                $item.addClass('is-active');
            } else {
                $item.removeClass('is-active');
            }
        }
    })();

    this.addKeyToDefaultWidgetSet = function(key, index, pos, txt, type, clb) {
        defaultWidgetSet[key] = {
            keyName: key,
            index: index,
            pos: pos,
            txt: txt,
            type: type,
            clb: clb,
            addon: true
        }
    };

    this.resetWidgetButtons = function() {
        mAlert(_t('sure_reset_widgets'), [{
            txt: _t('yes'),
            callback: function() {
                let objToSend = {};
                let key = self.getPathToHotWidgetVersion();
                objToSend[key] = false;
                Engine.serverStorage.sendData(objToSend, function() {
                    defaultWidgetSet = null;
                    self.initDefaultWidgetSet();
                    self.addWidgetButtons();
                });
                return true;
            }
        }, {
            txt: _t('no'),
            callback: function() {
                return true;
            }
        }]);
    };

    this.rebuildWidgetButtons = function() {
        this.addWidgetButtons(true);
        this.setEditableWidget(false);
    };

    this.rebuiltWidgetBarsIndex = function() {
        let objToSendToServerStorage = {};

        let widgetsData = Engine.widgetsData;

        this.rebuiltOneBarWidgetBar(widgetsData.pos.BOTTOM_LEFT, objToSendToServerStorage);
        this.rebuiltOneBarWidgetBar(widgetsData.pos.BOTTOM_RIGHT, objToSendToServerStorage);
        this.rebuiltOneBarWidgetBar(widgetsData.pos.BOTTOM_LEFT_ADDITIONAL, objToSendToServerStorage);
        this.rebuiltOneBarWidgetBar(widgetsData.pos.BOTTOM_RIGHT_ADDITIONAL, objToSendToServerStorage);
        this.rebuiltOneBarWidgetBar(widgetsData.pos.TOP_LEFT, objToSendToServerStorage);
        this.rebuiltOneBarWidgetBar(widgetsData.pos.TOP_RIGHT, objToSendToServerStorage);

        self.equalizeWidgetBars('left', objToSendToServerStorage);
        self.equalizeWidgetBars('right', objToSendToServerStorage);

        //I know. This is madness, but have not enough time to do this better!!
        this.rebuiltOneBarWidgetBar(widgetsData.pos.BOTTOM_LEFT, objToSendToServerStorage);
        this.rebuiltOneBarWidgetBar(widgetsData.pos.BOTTOM_RIGHT, objToSendToServerStorage);
        this.rebuiltOneBarWidgetBar(widgetsData.pos.BOTTOM_LEFT_ADDITIONAL, objToSendToServerStorage);
        this.rebuiltOneBarWidgetBar(widgetsData.pos.BOTTOM_RIGHT_ADDITIONAL, objToSendToServerStorage);
        self.equalizeWidgetBars('left', objToSendToServerStorage);
        self.equalizeWidgetBars('right', objToSendToServerStorage);
        //end madness

        let serverKeyName = self.getPathToHotWidgetVersion();

        let toSend = {};

        toSend[serverKeyName] = objToSendToServerStorage;

        Engine.serverStorage.sendData(toSend, function() {
            // self.addWidgetButtons(true);
            // self.setEditableWidget(false);
            self.rebuildWidgetButtons();
        });
    };

    this.rebuiltOneBarWidgetBar = (pos, objToSendToServerStorage) => {

        var leftWidgets = Engine.interface.get$interfaceLayer().find('.' + pos + '.main-buttons-container');
        for (var i = 0; i < WIDGETS_IN_ONE_BAR; i++) {

            //var $e = leftWidgets.find("[widget-index='" + i + "']");
            let selector = self.createAttrSelector(Engine.widgetsData.attr.WIDGET_INDEX, i);
            let $e = leftWidgets.find(selector);

            if ($e.length > 0) continue;
            var $wWithLeastIndex = this.getLeastWidgetIndex(leftWidgets, i);
            if ($wWithLeastIndex == null) continue;
            //$wWithLeastIndex.attr('widget-index', i);
            $wWithLeastIndex.attr(Engine.widgetsData.attr.WIDGET_INDEX, i);
            var clName = $wWithLeastIndex.data(Engine.widgetsData.data.WIDGET_KEY);

            objToSendToServerStorage[clName] = [i, pos];
        }
    };

    this.getLeastWidgetIndex = function(container, startIndex) {
        for (var i = startIndex; i < WIDGETS_IN_ONE_BAR; i++) {
            //var $e = container.find("[widget-index='" + i + "']");
            let selector = self.createAttrSelector(Engine.widgetsData.attr.WIDGET_INDEX, i);
            let $e = container.find(selector);

            if ($e.length > 0) return $e;
        }
        return null;
    };

    this.equalizeWidgetBars = (side, objToSendToServerStorage) => {

        let $interfaceLayer = Engine.interface.get$interfaceLayer();

        var bottomB = $interfaceLayer.find('.bottom-' + side + '.main-buttons-container').find('.widget-button');
        var bottomAddBar = $interfaceLayer.find('.bottom-' + side + '-additional.main-buttons-container').find('.widget-button');

        var bBSize = bottomB.length;
        var bABSize = bottomAddBar.length;

        if (bBSize == bABSize) return;

        if (bBSize > 0 || bABSize > 0) {
            if (bBSize > bABSize) {
                this.equalMoreObjAndLessObj(objToSendToServerStorage, bottomB, bottomAddBar, bBSize, bABSize, 'bottom-' + side + '-additional')
            } else {
                this.equalMoreObjAndLessObj(objToSendToServerStorage, bottomAddBar, bottomB, bABSize, bBSize, 'bottom-' + side)
            }
        }
    };

    this.equalMoreObjAndLessObj = function(objToSendToServerStorage, $moreObj, $lessObj, moreSize, lessSize, posToAdd) {
        while (moreSize > lessSize + 1) {
            var $last = $moreObj.eq(moreSize - 1);
            var clName = $last.data(Engine.widgetsData.data.WIDGET_KEY);

            objToSendToServerStorage[clName] = [lessSize, posToAdd];

            moreSize--;
            lessSize++;
        }
    };

    this.addWidgetButtonsWithInitZoom = () => {
        this.addWidgetButtons(true);
        Engine.interface.initZoomFactor(true);
        this.setEnableDraggingButtonsWidget(false);
    }

    this.updateOneWidgetNoticeProcedure = (nameWidget, type) => {

        if (!this.checkAttachWidgetList(nameWidget)) {
            let alwaysAvailable = Engine.widgetNoticeManager.checkAlwaysAvailableByWidgetName(nameWidget);
            if (alwaysAvailable) errorReport('WidgetManager.js', 'updateOneWidget', `Widget: ${nameWidget} not exits in AttachWidgetList!`, attachWidgetList);
            return;
        }

        let bData = defaultWidgetSet[nameWidget];

        if (!bData) {
            errorReport('WidgetManager.js', 'updateOneWidget', `Widget: ${nameWidget} not exits in defaultWidgetSet!`, attachWidgetList);
            return;
        }

        if (bData.type == type) return;

        let widget = this.getAttachWidgetByName(nameWidget);

        if (!widget) {
            return
        }

        let $widget = widget.getWidget();

        Engine.specificAnimationManager.deleteSpecificAnimationInElementIfExist($widget);

        this.setTypeInDefaultWidgetSet(nameWidget, type);
        this.manageBlinkAnimation($widget, type, bData.pos)
    };

    const updateSizeOfWidgetBars = () => {
        updateHeightAndWidthOfWidgetBar();
        updatePosOfStandardWidgetBar();
        updatePosOfAdditionalWidgetBar();
        updatePosOfTopBigMessagersLightMode();
    };

    const updatePosOfTopBigMessagersLightMode = () => {
        let top = getPossibleTopValOfLeftOrRightColumn(Engine.widgetsData.pos.TOP_LEFT);
        let $bigMessagesLightMode = getEngine().interface.get$bigMessagesLightMode();

        $bigMessagesLightMode.css('top', top);
    };

    const getWidgetVerticalOrientation = (pos) => {
        return widgetVerticalOrientationData[pos];
    };

    const setWidgetVerticalOrientation = (pos, state) => {
        return widgetVerticalOrientationData[pos] = state;
    };

    const getWidgetColumnVisibilityToggle = (pos) => {
        return widgetBarColumnVisibilityToggleData[pos];
    };

    const updateHeightAndWidthOfWidgetBar = () => {
        const POS = Engine.widgetsData.pos;

        for (let p in POS) {
            const pos = POS[p];
            //const widgetSize 	= getWidgetSize(pos);
            //const vertical 		= getWidgetVerticalOrientation(pos);
            //const $bar 			= getBar(pos);
            //let h 				= null;
            //let w 				= null;
            //
            //if (vertical) {
            //	h = (widgetSize + getWidgetMargin()) * 7 + 1;
            //	w = widgetSize;
            //} else {
            //	h = widgetSize + 1;
            //	w = (widgetSize + getWidgetMargin()) * 7;
            //}
            //
            //
            //
            //$bar.height(h);
            //$bar.width(w);

            let size = getMaxBarSize(pos);
            const $bar = getBar(pos);

            $bar.height(size.height);
            $bar.width(size.width);
        }
    };

    const getMaxBarSize = (pos) => {
        const widgetSize = getWidgetSize(pos);
        const vertical = getWidgetVerticalOrientation(pos);
        const m = getWidgetMargin();

        let w = null;
        let h = null;

        if (vertical) {
            h = (widgetSize + m) * WIDGETS_IN_ONE_BAR - m;
            w = widgetSize;
        } else {
            h = widgetSize + 1;
            w = (widgetSize + m) * WIDGETS_IN_ONE_BAR - m;
        }

        return {
            width: w,
            height: h
        }
    }

    const updatePosOfStandardWidgetBar = () => {
        const POS = Engine.widgetsData.pos;
        //const $interfaceLayer	= Engine.interface.get$interfaceLayer();

        let data = [{
                bar: POS.TOP_LEFT,
                horizontalPos: 'left',
                verticalPos: 'top'
            },
            {
                bar: POS.TOP_RIGHT,
                horizontalPos: 'right',
                verticalPos: 'top'
            },
            {
                bar: POS.BOTTOM_LEFT,
                horizontalPos: 'left',
                verticalPos: 'bottom'
            },
            {
                bar: POS.BOTTOM_RIGHT,
                horizontalPos: 'right',
                verticalPos: 'bottom'
            }
        ];

        for (let k in data) {
            const d = data[k];
            const pos = d.bar
            const vertical = getWidgetVerticalOrientation(pos);
            const verticalPos = d.verticalPos;
            const horizontalPos = d.horizontalPos;
            const columnVisibilityToggle = getWidgetColumnVisibilityToggle(pos);

            let verticalVal = null;
            let horizontalVal = null;

            if (vertical) {
                if (verticalPos == 'top') {
                    verticalVal = 4;
                    horizontalVal = MARGIN_BETWEEN_COLUMN_AND_VERTICAL_WIDGETS;
                } else {
                    verticalVal = 0;
                    horizontalVal = MARGIN_BETWEEN_COLUMN_AND_VERTICAL_WIDGETS;
                }

            } else {

                if (columnVisibilityToggle) {

                    let margin = 4;
                    let size = ResolutionData.WIDGET_BAR_COLUMN_VISIBILITY_TOGGLE_SIZE;

                    if (verticalPos == 'top') {
                        verticalVal = 4;
                        //horizontalVal 	= widgetBarColumnVisibilityToggleSize;
                        horizontalVal = size + margin;
                    } else {
                        verticalVal = 0;
                        //horizontalVal 	= widgetBarColumnVisibilityToggleSize;
                        horizontalVal = size + margin;
                    }

                } else {

                    if (verticalPos == 'top') {
                        verticalVal = 0;
                        horizontalVal = MARGIN_BETWEEN_COLUMN_AND_VERTICAL_WIDGETS;
                    } else {
                        verticalVal = 0;
                        horizontalVal = MARGIN_BETWEEN_COLUMN_AND_VERTICAL_WIDGETS;
                    }

                }


            }

            //$bar.css(verticalPos, verticalVal + "px");
            //$bar.css(horizontalPos, horizontalVal + "px");

            setPosBar(pos, verticalPos, verticalVal, horizontalPos, horizontalVal)

        }
    }

    const setPosBar = (pos, verticalPos, verticalVal, horizontalPos, horizontalVal) => {
        const $bar = getBar(pos);

        $bar.css(verticalPos, verticalVal + "px");
        $bar.css(horizontalPos, horizontalVal + "px");
    };

    const updatePosOfAdditionalWidgetBar = () => {

        const POS = Engine.widgetsData.pos;
        const margin = 7;
        //const $interfaceLayer	= Engine.interface.get$interfaceLayer();

        let data = [{
                bar: POS.BOTTOM_LEFT,
                additionalBar: POS.BOTTOM_LEFT_ADDITIONAL,
                cssPos: 'left'
            },
            {
                bar: POS.BOTTOM_RIGHT,
                additionalBar: POS.BOTTOM_RIGHT_ADDITIONAL,
                cssPos: 'right'
            }
        ];

        for (let k in data) {
            const d = data[k];
            const widgetSize = getWidgetSize(d.bar);
            const vertical = getWidgetVerticalOrientation(d.bar);
            const columnVisibilityToggle = getWidgetColumnVisibilityToggle(d.bar);
            const $bar = getBar(d.additionalBar);
            const cssPos = d.cssPos;

            let bottom = null;
            let cssPosVal = null;

            if (vertical) {
                bottom = 0;
                cssPosVal = widgetSize + margin
            } else {
                bottom = widgetSize + margin;

                if (columnVisibilityToggle) {
                    cssPosVal = $bar.find("." + d.bar + '-column-visibility-toggle');
                } else {
                    cssPosVal = 0
                }
            }

            $bar.css('bottom', bottom + "px");
            $bar.css(cssPos, cssPosVal + "px");
        }

    };

    this.addWidgetButtons = function(additionalBarHide) {
        let store = Engine.serverStorage.get(self.getPathToHotWidgetVersion());
        //Engine.interface.get$interfaceLayer().find('.main-buttons-container').find('.widget-button').remove();


        let resolution = Engine.resolution.getResolutionKey();

        updateWidgetSizeByResolution(resolution);
        updateWidgetBarStaticPosition();
        updateWidgetColumnVisibilityToggle();

        clearEmptySlotWidget();

        self.removeBlinkSpecificAnimation();
        self.removeWidgetFromSlots();
        removeWidgetBarVisibleFromSlots();
        self.clearAttachWidgetList();
        updateSizeOfWidgetBars();

        if (!store) store = {};

        let widgetsWithoutFreeSlot = [];

        if (additionalBarHide) self.hideAdditionalWidgetBars();
        for (var clName in defaultWidgetSet) {
            self.createOneWidget(clName, store, additionalBarHide, widgetsWithoutFreeSlot);
        }

        if (widgetsWithoutFreeSlot.length) {
            this.findPositionToWidgetsWithoutFreeSlot(widgetsWithoutFreeSlot, additionalBarHide);
        }

        self.createEmptySlotsWidget();

        Engine.hotKeys.rebuildHotKeys();
        if (Engine.party) Engine.party.onInterfaceReady();
        if (Engine.whoIsHere) Engine.whoIsHere.onInterfaceReady();
        this.setEqWidgetAmountShow(Engine.interface.checkEqColumnShow());

        if (!widgetLoaded) {
            setWidgetLoaded(true);
            Engine.widgetNoticeManager.forceUpdate();
        }

        updateWidgetBarVisibility()
    };

    const updateWidgetBarVisibility = () => {

        //debugger;

        for (let pos in widgetBarVisibilityToggleData) {
            if (widgetBarVisibilityToggleData[pos]) {
                // let index 	= getLastIndexOfWidget(pos);
                let $bar = getBar(pos);
                let $btn = createVisibleBarButton($bar, pos);

                $bar.append($btn)

            }
        }
    };

    const createVisibleBarButton = ($bar, pos) => {
        const POS = Engine.widgetsData.pos;
        const $widgetBarVisibleBtn = $('<div>').addClass('widget-bar-visible-btn');
        const $icon = $('<div>').addClass('icon');
        const widgetSize = getWidgetSize(pos);
        // const cssVal 				= (widgetSize + getWidgetMargin()) * (index + 1);
        const state = getWidgetVisibilityFromStorage(pos);


        let cssDirection = null;
        let index = null;

        switch (pos) {
            case POS.TOP_LEFT:
            case POS.BOTTOM_LEFT:
            case POS.BOTTOM_LEFT_ADDITIONAL:
                cssDirection = 'left';
                index = getLastIndexOfWidget(pos) + 1;
                break;
            case POS.TOP_RIGHT:
            case POS.BOTTOM_RIGHT:
            case POS.BOTTOM_RIGHT_ADDITIONAL:
                index = Math.abs((getFirstIndexOfWidget(pos)) - 7);
                cssDirection = 'right';
                break;
        }

        const cssVal = (widgetSize + getWidgetMargin()) * index;

        $icon.addClass(cssDirection + "-arrow");

        $widgetBarVisibleBtn.append($icon);
        $widgetBarVisibleBtn.css(cssDirection, cssVal);

        setVisibleWidgetWidgetBar(state, $icon, $bar, $widgetBarVisibleBtn, cssDirection, cssVal);

        $widgetBarVisibleBtn.on('click', function() {

            let _state = !getWidgetVisibilityFromStorage(pos);

            setVisibleWidgetWidgetBar(_state, $icon, $bar, $widgetBarVisibleBtn, cssDirection, cssVal);
            setWidgetVisibilityFromStorage(pos, _state);
        });

        return $widgetBarVisibleBtn;
    };

    const setVisibleWidgetWidgetBar = (visibleWidgetState, $arrow, $bar, $widgetBarVisibleBtn, cssDirection, cssVal) => {
        setArrowDirection(visibleWidgetState, $arrow, cssDirection);
        setWidgetHide(!visibleWidgetState, $bar, $widgetBarVisibleBtn, cssDirection, cssVal);
    };

    const setArrowDirection = (visibleWidgetState, $arrow, cssDirection) => {
        switch (cssDirection) {
            case 'left':
                if (visibleWidgetState) setArrow($arrow, 'left');
                else setArrow($arrow, 'right');
                break;
            case 'right':
                if (visibleWidgetState) setArrow($arrow, 'right');
                else setArrow($arrow, 'left');
                break;
        }
    };

    const setArrow = ($arrow, direction) => {
        switch (direction) {
            case 'left':
                $arrow.addClass('left-arrow');
                $arrow.removeClass('right-arrow');
                break;
            case 'right':
                $arrow.removeClass('left-arrow');
                $arrow.addClass('right-arrow');
                break;
        }
    };

    const setWidgetHide = (widgetHideState, $bar, $widgetBarVisibleBtn, cssDirection, cssVal) => {
        const WIDGET_HIDE_CL = 'widgets-hide';

        if (widgetHideState) {
            $bar.addClass(WIDGET_HIDE_CL);
            $widgetBarVisibleBtn.css(cssDirection, 0 + 'px');
        } else {
            $bar.removeClass(WIDGET_HIDE_CL);
            $widgetBarVisibleBtn.css(cssDirection, cssVal);
        }
    };

    const getWidgetVisibilityFromStorage = (pos) => {
        const POS = Engine.widgetsData.pos;

        switch (pos) {
            case POS.TOP_LEFT:
            case POS.BOTTOM_LEFT:
            case POS.BOTTOM_LEFT_ADDITIONAL:
            case POS.TOP_RIGHT:
            case POS.BOTTOM_RIGHT:
            case POS.BOTTOM_RIGHT_ADDITIONAL:
                break;
            default:
                errorReport(moduleData.fileName, "getWidgetVisibilityFromStorage", "incorrect pos", pos)
                return true;
        }

        let state = Storage.easyGet(StorageData.WIDGET_VISIBILITY_IN_BAR, pos);

        if (state === null) {
            return true;
        }

        return state;
    };

    const setWidgetVisibilityFromStorage = (pos, state) => {
        const POS = Engine.widgetsData.pos;

        switch (pos) {
            case POS.TOP_LEFT:
            case POS.BOTTOM_LEFT:
            case POS.BOTTOM_LEFT_ADDITIONAL:
            case POS.TOP_RIGHT:
            case POS.BOTTOM_RIGHT:
            case POS.BOTTOM_RIGHT_ADDITIONAL:
                break;
            default:
                errorReport(moduleData.fileName, "setWidgetVisibilityFromStorage", "incorrect pos", pos);
                return null;
        }

        Storage.easySet(state, StorageData.WIDGET_VISIBILITY_IN_BAR, pos);
    };

    const getLastIndexOfWidget = (pos) => {
        let index = null;

        for (let widgetName in attachWidgetList) {
            let widget = self.getAttachWidgetByName(widgetName);

            if (widget.getPos() != pos) {
                continue;
            }

            let _index = widget.getIndex();

            if (!isInt(_index)) {
                errorReport(moduleData.fileName, "getLastIndexOfWidget", "widget index is not integer!", _index);
                return null;
            }

            _index = parseInt(_index);

            if (index === null || _index > index) {
                index = _index;
            }

        }

        return index
    };

    const getFirstIndexOfWidget = (pos) => {
        let index = null;

        for (let widgetName in attachWidgetList) {
            let widget = self.getAttachWidgetByName(widgetName);

            if (widget.getPos() != pos) {
                continue;
            }

            let _index = widget.getIndex();

            if (!isInt(_index)) {
                errorReport(moduleData.fileName, "getLastIndexOfWidget", "widget index is not integer!", _index);
                return null;
            }

            _index = parseInt(_index);

            if (index === null || _index < index) {
                index = _index;
            }

        }

        return index
    };

    const getWidgetLoaded = () => {
        return widgetLoaded;
    }

    const setWidgetLoaded = (_widgetLoaded) => {
        widgetLoaded = _widgetLoaded;
    }

    this.findPositionToWidgetsWithoutFreeSlot = (widgetsWithoutFreeSlot, additionalBarHide) => {
        let objToSendToServerStorage = {};
        let exception = [];
        for (let i = 0; i < widgetsWithoutFreeSlot.length; i++) {
            let name = widgetsWithoutFreeSlot[i];
            let data = self.getBruteWidgetData(name, exception);
            Object.assign(objToSendToServerStorage, data);
        }
        this.saveNewPosWidgetsToServerStorage(objToSendToServerStorage, additionalBarHide);
    };

    this.saveNewPosWidgetsToServerStorage = (data, additionalBarHide) => {

        let objToSend = {};
        let key = self.getPathToHotWidgetVersion();
        objToSend[key] = data;
        Engine.serverStorage.sendData(objToSend, function() {

            self.addWidgetButtons(additionalBarHide);
            self.setEditableWidget(false);
        });
    };

    this.getBruteWidgetData = (widgetName, exception) => {
        let data = {};
        var ws = this.getWidgetsSlots(exception);
        var canDelete = ws.canDelete;
        var widgets = ws.widgets;
        for (var k in widgets) {
            var v = widgets[k].indexOf('');
            if (v > -1) {
                data[widgetName] = [v, k];
                exception.push([v, k])
                return data;
            }
        }

        data[canDelete.name] = false;
        data[widgetName] = [canDelete.pos, canDelete.bar];

        return data;
    };

    this.removeBlinkSpecificAnimation = () => {
        for (let k in attachWidgetList) {
            let widget = this.getAttachWidgetByName(k);
            let $btn = widget.getWidget();

            let haveSpecificAnimation = Engine.specificAnimationManager.checkElementHaveSpecificAnimation($btn);
            if (!haveSpecificAnimation) continue;

            Engine.specificAnimationManager.deleteSpecificAnimationInElementIfExist($btn)
        }
    };


    this.removeWidgetFromSlots = () => {
        Engine.interface.get$interfaceLayer().find('.main-buttons-container').find('.widget-button').remove();
    }

    const removeWidgetBarVisibleFromSlots = () => {
        Engine.interface.get$interfaceLayer().find('.main-buttons-container').find('.widget-bar-visible-btn').remove();
    };

    this.clearAttachWidgetList = () => {
        attachWidgetList = {};
    };

    this.addToAttachWidgetList = (name, $btn) => {
        attachWidgetList[name] = $btn;
    };

    this.removeFromAttachWidgetList = (name) => {
        delete attachWidgetList[name];
    };

    this.getAttachWidgetList = () => {
        return attachWidgetList;
    };

    this.checkAttachWidgetList = (name) => {
        return attachWidgetList[name] ? true : false;
    };

    this.getAttachWidgetByName = (name) => {
        return attachWidgetList[name];
    };

    this.unsetWidgetClassWindowIsOpen = (widgetName) => {
        let widget = this.getAttachWidgetByName(widgetName);

        if (!widget) {
            return
        }

        let $widget = widget.getWidget();

        $widget.removeClass('window-is-open');
    };

    this.setWidgetClassWindowIsOpen = (widgetName) => {
        let widget = this.getAttachWidgetByName(widgetName);

        if (!widget) {
            return
        }

        let $widget = widget.getWidget();

        $widget.addClass('window-is-open');
    };

    this.createOneWidget = function(clName, storeData, additionalBarHide, wigdetsWithoutFreeSlot) {
        var bData = defaultWidgetSet[clName];
        var index;
        var pos;

        const permissionData = this.checkWidgetPermission(bData);
        const result = permissionData.result;

        if (!isset(bData)) return; //widget deleted from defaultWidgetSet

        if (!isset(storeData[clName])) {
            var widgetD = defaultWidgetSet[clName];
            if (!widgetD.default) return; //block not default widget
            index = widgetD.index;
            pos = widgetD.pos;

            storeData[clName] = [index, pos]
        } else {

            if (storeData[clName] == false) return;

            index = storeData[clName][0];
            pos = storeData[clName][1];
        }

        let widgetSize = getWidgetSize(pos);
        let cl = '.' + pos;
        let find = self.createAttrSelector(Engine.widgetsData.attr.WIDGET_INDEX, index);
        let $w = Engine.interface.get$interfaceLayer().find(cl).find(find);
        //let widgetsData 	= Engine.widgetsData;

        if ($w.length) {
            wigdetsWithoutFreeSlot.push(clName);
            return;
        }

        var btn = Templates.get('widget-button');

        btn.addClass(bData.type + ' widget-in-interface-bar ' + 'widget-' + clName);
        btn.find('.icon').addClass(clName);
        self.set$BtnWidgetSize(btn, widgetSize);

        btn.bind('click', () => {

            const widgetData = Object.assign(bData, {
                index,
                pos
            }); //edge fix
            this.widgetOnClick({
                widgetData
            });
        });

        btn.on('contextmenu longpress', (e) => {
            if (e.type === 'longpress') e.type = 'contextmenu';
            manageContextMenu(clName, btn, bData, getE(e, e));
        });

        //if (pos == widgetsData.pos.TOP_LEFT || pos == widgetsData.pos.BOTTOM_LEFT || pos == widgetsData.pos.BOTTOM_LEFT_ADDITIONAL) {
        //	let orientation = getWidgetVerticalOrientation(pos) ? "top" : "left";
        //	btn.css(orientation, index * (widgetSize + getWidgetMargin()));
        //
        //} else {
        //	let orientation = getWidgetVerticalOrientation(pos) ? "bottom" : "right";
        //	btn.css(orientation, index * (widgetSize + getWidgetMargin()));
        //
        //	if (orientation == "bottom") {
        //		btn.css('left', "0px");
        //	}
        //}


        setWidgetPosition(btn, pos, index);

        let attr = {
            [Engine.widgetsData.attr.WIDGET_INDEX]: index,
            [Engine.widgetsData.attr.WIDGET_NAME]: clName,
            [Engine.widgetsData.attr.WIDGET_POS]: pos
        }

        btn.attr(attr);

        self.manageBlinkAnimation(btn, bData.type, bData.pos);

        self.addToAttachWidgetList(clName, {
            getWidget: () => {
                return btn
            },
            getPos: () => {
                return pos
            },
            getIndex: () => {
                return index
            }
        });

        let wManager = Engine.windowManager;
        if (wManager.checkWidgetIsLinkedToWindow(clName) && wManager.checkWindowIsShowByLinkedWidget(clName)) {
            self.manageClassOfWidget(clName, true);
        }

        if (this.checkWidgetIsLinkedToSection(clName) && this.checkSectionIsShowByLinkedWidget(clName)) {
            self.manageClassOfWidget(clName, true);
        }

        btn.css('position', 'absolute');
        let tipText = bData.txt;
        if (!result) {
            //btn.addClass('disabled');
            btn.addClass(Engine.widgetsData.type.DISABLED);
            //tipText += ` - ${_t('need__lvl', { '%val%': bData.requires.minLvl })}`;

            tipText = createTextPermission(tipText, permissionData.requireFail, true);
        }

        self.addDraggableAndDataAndTip(btn, tipText, Engine.widgetsData.data.WIDGET_KEY, clName)

        //btn.tip(tipText);
        //btn.data(Engine.widgetsData.data.WIDGET_KEY, clName);
        //btn.draggable({
        //	helper: 'clone',
        //	distance: 5,
        //	cursorAt: {
        //		top: 16,
        //		left: 16
        //	},
        //	scroll: false,
        //	zIndex: 20
        //});
        this.widgets.add(btn, pos);
        if (additionalBarHide) self.manageDisplayAdditionaWidgetBarsPerPos(storeData[clName][1]);
    };

    const setWidgetPosition = (btn, pos, index) => {
        let widgetsData = Engine.widgetsData;
        let widgetSize = getWidgetSize(pos);

        let additional = pos == widgetsData.pos.TOP_LEFT || pos == widgetsData.pos.BOTTOM_LEFT || pos == widgetsData.pos.BOTTOM_LEFT_ADDITIONAL;

        //if (pos == widgetsData.pos.TOP_LEFT || pos == widgetsData.pos.BOTTOM_LEFT || pos == widgetsData.pos.BOTTOM_LEFT_ADDITIONAL) {
        let orientation = getWidgetVerticalOrientation(pos) ? "top" : "left";
        btn.css(orientation, index * (widgetSize + getWidgetMargin()));

        if (!additional) {
            //let orientation = getWidgetVerticalOrientation(pos) ? "bottom" : "right"
            //if (orientation == "bottom") {
            //	btn.css('left', "0px");
            //}
            if (getWidgetVerticalOrientation(pos)) {
                btn.css('left', "0px");
            } else {
                //btn.css('left', "0px");
            }
        }

        //} else {
        //	let orientation = getWidgetVerticalOrientation(pos) ? "bottom" : "right";
        //	btn.css(orientation, index * (widgetSize + getWidgetMargin()));
        //
        //	if (orientation == "bottom") {
        //		btn.css('left', "0px");
        //	}
        //}
    };


    const manageContextMenu = (clName, btn, bData, e) => {

        let menu = [];

        menu.push([_t('edit'), function() {
            getEngine().settings.open();
            getEngine().settings.openSettingEditWidget();
        }]);

        if (!bData.alwaysExist) {
            menu.push([_t('delete'), function() {

                confirmWithCallback({
                    msg: _t("SURE_DELETE_WIDGET"),
                    clb: function() {
                        removeWidget(clName, function() {
                            self.setEditableWidget(editableMode ? true : false);
                        });
                    }
                })

            }, {
                button: {
                    cls: 'menu-item--red'
                }
            }])
        }

        if (bData.contextMenu) {
            let _menu = bData.contextMenu();

            for (let k in _menu) {
                menu.push(_menu[k]);
            }
        }

        Engine.interface.showPopupMenu(menu, e);
    };

    this.addDraggableAndDataAndTip = ($widget, tipText, widgetKeyData, clName, options) => {

        let config = {
            helper: 'clone',
            distance: 5,
            cursorAt: {
                top: 16,
                left: 16
            },
            //appendTo: Engine.interface.get$gameWindowPositioner(),
            appendTo: ".game-window-positioner",
            scroll: false,
            zIndex: 20
        };

        if (options) {

            if (!elementIsObject(options)) {
                errorReport(moduleData.fileName, "addDraggableAndDataAndTip", "incorrect format of options", options);
                options = {};
            }

            for (let optionsName in options) {
                config[optionsName] = options[optionsName];
            }
        }

        $widget.tip(tipText);
        $widget.data(widgetKeyData, clName);
        $widget.draggable(config);
    }

    this.set$BtnWidgetSize = ($btn, widgetSize) => {
        $btn.css({
            width: widgetSize,
            height: widgetSize
        });
    }

    this.manageBlinkAnimation = ($btn, type, pos) => {

        if (type != Engine.widgetsData.type.BLINK_VIOLET) return;

        let widgetSize = getWidgetSize(pos);

        let size = widgetSize * 0.75;

        Engine.specificAnimationManager.createBlinkedAnimation($btn, size, size, "#886199", 1.5, "widget-blink");
    };

    const callCheckCanFinishExternalTutorialClickWidget = (widgetName) => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.CLICK_WIDGET,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            widgetName
        );
        Engine.rajController.parseObject(tutorialDataTrigger);
        //Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
    };

    this.widgetOnClick = ({
        widgetData,
        eventType = 'click'
    }) => {

        let block = Engine.tutorialManager.checkBlockWidgets(widgetData.keyName);

        if (block) return;

        const permissionData = this.checkWidgetPermission(widgetData);
        const result = permissionData.result;

        if (result) {
            widgetData.clb();

            //console.log(defaultWidgetSet);
            callCheckCanFinishExternalTutorialClickWidget(widgetData.keyName)


            this.widgetClick(widgetData, eventType);

            let prepareObj = {};
            prepareObj[ServerStorageData.LAST_WIDGET_CLICK] = {
                name: widgetData.keyName
            };

            Engine.serverStorage.sendData(prepareObj, function() {});

        } else {
            //message(_t('too_low_lvl'));
            let messageText = createTextPermission('', permissionData.requireFail);
            message(messageText);
        }
    };

    this.widgetClick = debounce((widgetData, eventType) => {

        eventType = mobileCheck() ? 'mobile-tap' : eventType;
        Engine.interface.sendGA('widget', eventType, widgetData.txt);
    }, 300);

    this.widgetDrop = (widgetName, pos) => {
        Engine.interface.sendGA('widgetDrop', widgetName, pos);
    };

    const createTextPermission = (tipText, requireFail, htmlBreakLine) => {

        let addToTip = '';


        for (let k in requireFail) {

            let val = requireFail[k];
            let nextLine = null;

            if (tipText == '' && addToTip == '') nextLine = '';
            else nextLine = htmlBreakLine ? '<br>' : '\n';

            switch (k) {
                case 'minLvl':
                    addToTip += nextLine + _t('need__lvl', {
                        '%val%': val
                    });
                    break;
                case 'characterList':
                    break;
                case 'minCharactersAmount':
                    addToTip += nextLine + _t('need__characters', {
                        '%val%': val
                    });
                    break;
                case 'funcRequireFunc':
                    break;
                case 'funcRequireTxt':
                    break;
                case 'funcRequire':
                    addToTip += nextLine + val;
                    break;
            }

        }

        return tipText + addToTip;
    }

    this.checkWidgetPermission = (widgetData) => {
        // if (_l() !== 'pl' || Engine.worldName === 'berufs') return true; // #20007 - exception for Berufs
        //if (!isPl() || Engine.worldConfig.getWorldName() === 'berufs') return true; // #20007 - exception for Berufs
        //if (Engine.worldConfig.getWorldName() === 'berufs') return true; // #20007 - exception for Berufs

        const FUNC = 'checkWidgetPermission';
        const berufs = Engine.worldConfig.getWorldName() === 'berufs';

        //return !((isset(widgetData) && isset(widgetData.requires) && widgetData.requires.minLvl > getHeroLevel()) &&
        //((isset(widgetData.requires) && !isset(widgetData.requires.characters)) ||
        //(isset(widgetData.requires) && isset(widgetData.requires.characters) && Engine.characterList && widgetData.requires.characters === Object.keys(Engine.characterList.getList()).length)))

        let results = {
            result: null,
            requireFail: {}
        };

        if (!isset(widgetData)) {
            //return true
            results.result = true;
            return results;
        }

        if (!isset(widgetData.requires)) {
            //return true
            results.result = true;
            return results;
        }

        if (widgetData.requires.minLvl > getHeroLevel()) {
            if (!berufs) {
                //return false;
                results.result = false;
                results.requireFail.minLvl = widgetData.requires.minLvl;
            }
        }

        if (isset(widgetData.requires.minCharactersAmount)) {

            if (!Engine.characterList) {
                errorReport(moduleData.fileName, FUNC, 'characterList is not exist!')
                //return false
                results.result = false;
                results.requireFail.characterList = null;
            }

            let characterListAmount = lengthObject(Engine.characterList.getList());

            if (widgetData.requires.minCharactersAmount > characterListAmount) {
                if (!berufs) {
                    //return false;
                    results.result = false;
                    results.requireFail.minCharactersAmount = widgetData.requires.minCharactersAmount;
                }
            }

        }

        if (isset(widgetData.requires.funcRequire)) {
            if (!widgetData.requires.funcRequire.func) {
                errorReport(moduleData.fileName, FUNC, 'in funcRequire func not exist');
                //return false
                results.result = false;
                results.requireFail.funcRequireFunc = null;
            }

            if (!widgetData.requires.funcRequire.txt) {
                errorReport(moduleData.fileName, FUNC, 'in funcRequire txt not exist');
                //return false
                results.result = false;
                results.requireFail.funcRequireTxt = null;
            }

            if (!widgetData.requires.funcRequire.func()) {
                //return false
                results.result = false;
                results.requireFail.funcRequire = widgetData.requires.funcRequire.txt;
            }
        }


        if (results.result == null) {
            results.result = true
        }

        return results;
    };

    this.manageDisplayAdditionaWidgetBarsPerPos = function(pos) {
        let widgetsData = Engine.widgetsData;

        let $bottomPositioner = Engine.interface.getBottomPositioner();

        if (pos == widgetsData.pos.BOTTOM_LEFT_ADDITIONAL) {

            $bottomPositioner.find('.bg-additional-widget-left').css('display', 'block');
            $bottomPositioner.find('.bottom-left-additional').css('display', 'block');

            //Engine.chat.setChatOverAdditionaBarPanel(true);
            Engine.chatController.getChatWindow().setChatOverAdditionalBarPanel(true);
            self.setWidthAdditionaPanel('left', Engine.widgetsData.pos.BOTTOM_LEFT_ADDITIONAL, false);
            Engine.interface.get$interfaceLayer().find('.quick_messages').css('bottom', '110px');
        }
        if (pos == widgetsData.pos.BOTTOM_RIGHT_ADDITIONAL) {

            $bottomPositioner.find('.bg-additional-widget-right').css('display', 'block');
            $bottomPositioner.find('.bottom-right-additional').css('display', 'block');

            self.setAdditionalBarClass(true);
            Engine.interface.setStatsOverAdditionalBarPanel();
            self.setWidthAdditionaPanel("right", Engine.widgetsData.pos.BOTTOM_RIGHT_ADDITIONAL, false);
        }
    };

    this.setAdditionalBarClass = function(state) {
        let $gameWindowPositioner = Engine.interface.get$gameWindowPositioner();
        state ? $gameWindowPositioner.addClass('additional-bar-br') : $gameWindowPositioner.removeClass('additional-bar-br');
    };

    this.showAdditionaWidgetBars = function(setMaxWidth) {
        //Engine.chat.setChatOverAdditionaBarPanel(true);
        Engine.chatController.getChatWindow().setChatOverAdditionalBarPanel(true);
        self.setAdditionalBarClass(true);
        Engine.interface.setStatsOverAdditionalBarPanel();
        self.setWidthAdditionaPanel('left', Engine.widgetsData.pos.BOTTOM_LEFT_ADDITIONAL, setMaxWidth);
        self.setWidthAdditionaPanel('right', Engine.widgetsData.pos.BOTTOM_RIGHT_ADDITIONAL, setMaxWidth);

        let $bottomPositioner = Engine.interface.getBottomPositioner();

        $bottomPositioner.find('.bg-additional-widget-left, .bg-additional-widget-right').css('display', 'block');
        $bottomPositioner.find('.bottom-left-additional, .bottom-right-additional').css('display', 'block');

        Engine.interface.get$interfaceLayer().find('.quick_messages').css('bottom', '110px');
    };

    //this.setWidthAdditionaPanel = function (side, setMaxWidth) {
    this.setWidthAdditionaPanel = function(side, additionalPos, setMaxWidth) {

        let $bar = $('.bg-additional-widget-' + side);
        let index = null;
        let widgetSize = getWidgetSize(additionalPos);

        if (setMaxWidth) index = 6;
        //else 				index = getMaxWidgetIndex($('.bottom.positioner').find('.bottom-' + side + '-additional'));
        else index = getMaxWidgetIndex($('.bottom.positioner').find('.' + additionalPos), side);

        $bar.width((widgetSize * (index + 1) + 120) + 'px');
    };

    this.hideAdditionalWidgetBars = function() {
        //Engine.chat.setChatOverAdditionaBarPanel(false);
        getEngine().chatController.getChatWindow().setChatOverAdditionalBarPanel(false);
        getEngine().interface.updateTopOfRightColumn();
        self.setAdditionalBarClass(false);
        Engine.interface.setStatsOverAdditionalBarPanel();;

        let $bottomPositioner = Engine.interface.getBottomPositioner();

        $bottomPositioner.find('.bg-additional-widget-left, .bg-additional-widget-right').css('display', 'none');
        $bottomPositioner.find('.bottom-left-additional, .bottom-right-additional').css('display', 'none');

        Engine.interface.get$interfaceLayer().find('.quick_messages').css('bottom', '60px');
    };

    this.setEnableDraggingButtonsWidget = function(state) {
        var $elements1 = $('.bottom.positioner>.content').find('.widget-button');
        var $elements2 = $('.top.positioner>.content').find('.widget-button.widget-in-interface-bar');

        state ? $elements1.draggable("enable") : $elements1.draggable({
            disabled: true
        });
        state ? $elements2.draggable("enable") : $elements2.draggable({
            disabled: true
        });
    };

    this.tLang = function(name) {
        return _t(name, null, 'widgets-tip');
    };

    const setEditableMode = (state) => {
        editableMode = state
    };

    const getEditableMode = () => {
        return setEditableMode;
    };

    this.setEditableWidget = function(state) {
        setEditableMode(state);
        if (state) {
            self.setEnableDraggingButtonsWidget(true);
            self.showEmptySlots(true);
            self.showAdditionaWidgetBars(true);
        } else {
            self.setEnableDraggingButtonsWidget(false);
            self.showEmptySlots(false);
            Engine.interface.hideNotUseBars();
        }
    };

    this.manageClassOfWidget = (widgetName, openWindow) => {
        if (!this.checkAttachWidgetList(widgetName)) return;

        this.unsetWidgetClassWindowIsOpen(widgetName);

        if (openWindow) this.setWidgetClassWindowIsOpen(widgetName);

    };

    const getHeightOfBottomLeftBar = () => {
        const POS = Engine.widgetsData.pos;
        const $b1 = getBar(POS.BOTTOM_LEFT);

        return $b1.height();
    };

    const getHeightOfBottomLeftAdditionalBar = () => {
        const POS = Engine.widgetsData.pos;
        const $b = getBar(POS.BOTTOM_LEFT_ADDITIONAL);

        return $b.height();
    };

    const getHeightOfTopLeftBar = () => {
        const POS = Engine.widgetsData.pos;
        const $b1 = getBar(POS.TOP_LEFT);

        return $b1.height();
    };

    //const getHeightOfAllLeftBottomBars = (additionalPanelVisible) => {
    const getPossibleBottomValOfLeftColumn = (additionalPanelVisible) => {
        const POS = Engine.widgetsData.pos;
        //const vertical1 = getWidgetVerticalOrientation(POS.BOTTOM_LEFT);
        //const vertical2 = getWidgetVerticalOrientation(POS.BOTTOM_LEFT_ADDITIONAL);
        const height1 = getHeightOfBottomLeftBar();
        const height2 = getHeightOfBottomLeftAdditionalBar();
        const staticPos = getWidgetBarStaticPosition(POS.BOTTOM_LEFT);


        if (staticPos) {
            if (additionalPanelVisible) {
                return height1 + height2 + getWidgetMargin();
            } else {
                return height2;
            }
        }

        return 0;

        //if (vertical1 || vertical2) {
        //	return 0;
        //} else {
        //	if (additionalPanelVisible) {
        //		return height1 + height2;
        //	} else {
        //		return height2;
        //	}
        //
        //}
    };

    const getPossibleTopValOfLeftOrRightColumn = (pos) => {

        const POS = Engine.widgetsData.pos;

        if (![POS.TOP_LEFT, POS.TOP_RIGHT].includes(pos)) {
            errorReport(moduleData.fileName, 'incorect pos', pos);
            return null;
        }


        //const vertical 	= getWidgetVerticalOrientation(pos);
        const staticPos = getWidgetBarStaticPosition(pos);
        const columnVisibilityToggle = getWidgetColumnVisibilityToggle(pos);
        const margin = 4;

        let height = getHeightOfTopLeftBar();

        if (columnVisibilityToggle) {
            height = Math.max(height, ResolutionData.WIDGET_BAR_COLUMN_VISIBILITY_TOGGLE_SIZE)
        }

        if (staticPos) {
            return height + margin;
        }

        return 0 + margin;
    };


    this.getWidgetLoaded = getWidgetLoaded;
    this.addSeveralTypesToWidget = addSeveralTypesToWidget;
    this.getWidgetSize = getWidgetSize;
    this.updateWidgetSizeByResolution = updateWidgetSizeByResolution;
    this.getPossibleBottomValOfLeftColumn = getPossibleBottomValOfLeftColumn;
    this.getPossibleTopValOfLeftOrRightColumn = getPossibleTopValOfLeftOrRightColumn;
    this.setVisibilityWidgetsByBars = setVisibilityWidgetsByBars;
    this.updateAmountOfEqColumnVisibleButton = updateAmountOfEqColumnVisibleButton;
    this.updateAmountOfChatColumnVisibleButton = updateAmountOfChatColumnVisibleButton;
    this.getBar = getBar;
    this.getColumnVisibilityButton = getColumnVisibilityButton;
    this.getMaxBarSize = getMaxBarSize;
    this.setWidgetVerticalOrientation = setWidgetVerticalOrientation;
    this.setWidgetBarStaticPosition = setWidgetBarStaticPosition;
    this.initMobileWidgetsByLightMode = initMobileWidgetsByLightMode;
    this.checkWidgetInAdditionalBarInDefaultWidgetSet = checkWidgetInAdditionalBarInDefaultWidgetSet;

};