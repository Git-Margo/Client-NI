var Templates = require('core/Templates');
let ServerStorageData = require('core/storage/ServerStorageData');
var TutorialData = require('core/tutorial/TutorialData');
var ResolutionData = require('core/resolution/ResolutionData');
module.exports = function() {

    var defaultWidgetSet = null;
    let attachWidgetList = {};

    let widgetLinkedWithSection = {};

    let widgetLoaded = false;

    let widgetSize = null;

    let self = this;

    this.init = () => {
        this.setWidgetSize(ResolutionData.WIDGET_SIZE_BY_RES[ResolutionData.KEY._DEFAULT]);
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

    this.setWidgetSize = (_widgetSize) => {
        widgetSize = _widgetSize
    };

    this.getWidgetSize = () => {
        return widgetSize;
    };

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

    this.initDefaultWidgetSet = function() {
        const w = Engine.widgetsData.name;
        const p = Engine.widgetsData.pos;
        const t = Engine.widgetsData.type;
        var m = mobileCheck();
        var disabled = Engine.party ? '' : t.DISABLED;

        let o = Engine.interface;

        if (!m) {
            defaultWidgetSet = {
                [w.EXIT]: {
                    default: true,
                    index: 0,
                    pos: p.TOP_LEFT,
                    txt: self.tLang('quit_game'),
                    type: t.GREEN,
                    clb: o.clickLogout,
                    requires: {
                        minLvl: 10,
                        characters: 1
                    }
                },
                //[w.HELP]: 							{default: true, index: 1, pos: p.TOP_LEFT,  			txt: self.tLang('game-controlls'),											type: t.GREEN, 										 clb: o.clickHelp},
                [w.SETTINGS]: {
                    default: true,
                    index: 2,
                    pos: p.TOP_LEFT,
                    txt: self.tLang('game-config'),
                    type: t.GREEN,
                    clb: o.clickSettings,
                    alwaysExist: true
                },
                [w.FULL_SCREEN]: {
                    default: true,
                    index: 3,
                    pos: p.TOP_LEFT,
                    txt: self.tLang('full-screen'),
                    type: t.GREEN,
                    clb: o.clickFullScreen
                },

                [w.ADDONS]: {
                    default: true,
                    index: 0,
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
                    index: 1,
                    pos: p.TOP_RIGHT,
                    txt: self.tLang('clans-widget'),
                    type: t.GREEN,
                    clb: o.clickClan
                },
                [w.MAP]: {
                    default: true,
                    index: 2,
                    pos: p.TOP_RIGHT,
                    txt: self.tLang('show-minimap'),
                    type: t.GREEN,
                    clb: o.clickMiniMap
                },
                //[w.PARTY]: 							{default: true, index: 3, pos: p.TOP_RIGHT, 			txt: self.tLang('party-widget'), 												type: 'blue ' + disabled + ' party-widget',clb: o.clickParty,						alwaysExist:true},
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
                    clb: o.clickPhoto,
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
                    index: 0,
                    pos: p.BOTTOM_RIGHT,
                    txt: _t('premium'),
                    type: t.BLINK_VIOLET,
                    clb: o.clickPremium,
                    alwaysExist: true
                },
                [w.SKILLS]: {
                    default: true,
                    index: 2,
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
                    index: 4,
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
                    clb: o.clickAttackNearMob
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
                    clb: o.clickAutofightNearMob
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
                //[w.WORLD]:            	{default: false, 																  txt: _t('title', null, 'world_window'),type: t.GREEN, 										 clb: o.clickWorld}
                [w.WORLD]: {
                    default: true,
                    index: 1,
                    pos: p.TOP_LEFT,
                    txt: _t('title', null, 'world_window'),
                    type: t.GREEN,
                    clb: o.clickWorld
                }
            };
            // if (_l() == 'pl') defaultWidgetSet[w.NEWS] = {					                    default: true, index: 1, pos: p.BOTTOM_RIGHT, 			txt: _t('news', null, 'news'), 						type: t.VIOLET,				clb: o.clickNews,						alwaysExist:true, requires: {minLvl: 15}};
            // if (_l() != 'pl') defaultWidgetSet[w.ACHIEVEMENTS] = {	                    default: true, index: 5, pos: p.TOP_RIGHT, 					txt: self.tLang('achievements'), 					type: t.GREEN,				clb: o.clickAchivements,			alwaysExist:true};
            // if (_l() == 'pl') defaultWidgetSet[w.MATCHMAKING] = {	                      default: true, index: 4, pos: p.TOP_RIGHT, 					txt: self.tLang('matchmaking'), 					type: t.GREEN,				clb: o.clickMatchmaking,     requires: {minLvl: 40}};

            if (isPl()) defaultWidgetSet[w.NEWS] = {
                default: true,
                index: 1,
                pos: p.BOTTOM_RIGHT,
                txt: _t('news', null, 'news'),
                type: t.VIOLET,
                clb: o.clickNews,
                alwaysExist: true,
                requires: {
                    minLvl: 15
                }
            };
            if (!isPl()) defaultWidgetSet[w.ACHIEVEMENTS] = {
                default: true,
                index: 5,
                pos: p.TOP_RIGHT,
                txt: self.tLang('achievements'),
                type: t.GREEN,
                clb: o.clickAchivements,
                alwaysExist: true
            };
            if (isPl()) defaultWidgetSet[w.MATCHMAKING] = {
                default: true,
                index: 4,
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
                index: 5,
                pos: p.BOTTOM_RIGHT,
                txt: _t('path_of_hero'),
                type: t.VIOLET,
                clb: o.clickBattlePass,
                alwaysExist: true,
                requires: {
                    minLvl: 10
                }
            };
            //if (Engine.interface.rewardsCalendarActive()) defaultWidgetSet[w.REWARDS_CALENDAR] = {	default: true, index: 4, pos: p.BOTTOM_LEFT,  			txt: _t('clickEventCalendar'),            type: t.VIOLET, 			clb: o.clickRewardsCalendar,	alwaysExist:true, requires: {minLvl: 25}};
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
                [w.EXIT]: {
                    default: true,
                    index: 1,
                    pos: p.TOP_LEFT,
                    txt: self.tLang('quit_game'),
                    type: t.GREEN,
                    clb: o.clickLogout,
                    requires: {
                        minLvl: 10,
                        characters: 1
                    }
                },
                //[w.HELP]: 								{default: true, index: 2, pos: p.TOP_LEFT,  								txt: self.tLang('game-controlls'),											type: t.GREEN, 										 clb: o.clickHelp},
                [w.SETTINGS]: {
                    default: true,
                    index: 3,
                    pos: p.TOP_LEFT,
                    txt: self.tLang('game-config'),
                    type: t.GREEN,
                    clb: o.clickSettings,
                    alwaysExist: true
                },
                [w.FULL_SCREEN]: {
                    default: true,
                    index: 4,
                    pos: p.TOP_LEFT,
                    txt: self.tLang('full-screen'),
                    type: t.GREEN,
                    clb: o.clickFullScreen
                },

                [w.EQ_TOGGLE]: {
                    default: true,
                    index: 0,
                    pos: p.TOP_RIGHT,
                    txt: _t('eqcolumnshow'),
                    type: t.GREEN,
                    clb: o.clickEqColumnShow
                },
                [w.ADDONS]: {
                    default: true,
                    index: 1,
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
                    index: 2,
                    pos: p.TOP_RIGHT,
                    txt: self.tLang('clans-widget'),
                    type: t.GREEN,
                    clb: o.clickClan
                },
                [w.MAP]: {
                    default: true,
                    index: 3,
                    pos: p.TOP_RIGHT,
                    txt: self.tLang('show-minimap'),
                    type: t.GREEN,
                    clb: o.clickMiniMap
                },
                [w.PARTY]: {
                    default: true,
                    index: 4,
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
                [w.PAD]: {
                    default: true,
                    index: 1,
                    pos: p.BOTTOM_LEFT,
                    txt: _t('padController'),
                    type: t.GREEN,
                    clb: o.clickPad,
                    alwaysExist: true
                },
                [w.CRAFTING]: {
                    default: true,
                    index: 2,
                    pos: p.BOTTOM_LEFT,
                    txt: _t('iconphoto'),
                    type: t.GREEN,
                    clb: o.clickPhoto,
                    requires: {
                        minLvl: isPl() ? 10 : 6
                    },
                    alwaysExist: true
                },
                [w.MINI_MAP]: {
                    default: true,
                    index: 3,
                    pos: p.BOTTOM_LEFT,
                    txt: _t('hotportablemap'),
                    type: t.GREEN,
                    clb: o.clickPortableMap
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

                [w.QUEST_LOG]: {
                    default: true,
                    index: 4,
                    pos: p.BOTTOM_RIGHT,
                    txt: self.tLang('quest-log'),
                    type: t.GREEN,
                    clb: o.clickQuests,
                    alwaysExist: true
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
                [w.SKILLS]: {
                    default: true,
                    index: 2,
                    pos: p.BOTTOM_RIGHT,
                    txt: self.tLang('skills-panel'),
                    type: t.GREEN,
                    clb: o.clickSkills,
                    alwaysExist: true,
                    requires: {
                        minLvl: 25
                    }
                },
                [w.PREMIUM]: {
                    default: true,
                    index: 0,
                    pos: p.BOTTOM_RIGHT,
                    txt: _t('premium'),
                    type: t.BLINK_VIOLET,
                    clb: o.clickPremium,
                    alwaysExist: true
                },

                [w.ATTACK_MOB]: {
                    default: true,
                    index: 0,
                    pos: p.BOTTOM_RIGHT_ADDITIONAL,
                    txt: _t('hotAttackNearMob'),
                    type: t.GREEN,
                    clb: o.clickAttackNearMob
                },

                [w.TALK]: {
                    default: false,
                    txt: _t('hotTalkNearMob'),
                    type: t.GREEN,
                    clb: o.clickTalkNearMob
                },
                [w.PICK_UP_ITEM]: {
                    default: false,
                    txt: _t('hotTakeGroundItem'),
                    type: t.GREEN,
                    clb: o.clickDragGroundItem
                },
                [w.ATTACK_PLAYER]: {
                    default: false,
                    txt: _t('hotAttackNearPlayer'),
                    type: t.GREEN,
                    clb: o.clickAttackNearPlayer
                },
                [w.BATTLE_LOG]: {
                    default: false,
                    txt: _t('showLog'),
                    type: t.GREEN,
                    clb: o.clickShowLog
                },
                [w.ATTACK_MOB_AUTO]: {
                    default: false,
                    txt: _t('autofightNearMob'),
                    type: t.GREEN,
                    clb: o.clickAutofightNearMob
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
                [w.CLAN_MSG]: {
                    default: false,
                    txt: _t('hotkey_send', null, 'clan_my_location'),
                    type: t.GREEN,
                    clb: o.clickSendMessageOnClanChat
                },
                [w.CONSOLE]: {
                    default: false,
                    txt: self.tLang('iconconsole'),
                    type: t.GREEN,
                    clb: o.clickConsole
                },
                //[w.WORLD]:              	{default: false, 																            txt: _t('title', null, 'world_window'),type: t.GREEN, 										 clb: o.clickWorld}
                [w.WORLD]: {
                    default: true,
                    index: 2,
                    pos: p.TOP_LEFT,
                    txt: _t('title', null, 'world_window'),
                    type: t.GREEN,
                    clb: o.clickWorld
                }
            };
            // if (_l() == 'pl') defaultWidgetSet[w.NEWS] = 				  {default: true, index: 1, pos: p.BOTTOM_RIGHT, 							txt: _t('news', null, 'news'), 						          type: t.VIOLET,										  clb: o.clickNews,								alwaysExist:true, requires: {minLvl: 15}};
            // if (_l() != 'pl') defaultWidgetSet[w.ACHIEVEMENTS] =  {default: true, index: 5, pos: p.TOP_RIGHT, 								txt: self.tLang('achievements'), 					          type: t.GREEN,										  clb: o.clickAchivements,				  alwaysExist:true};
            // if (_l() == 'pl') defaultWidgetSet[w.MATCHMAKING] = 	{default: false, 																						txt: self.tLang('matchmaking'), 					          type: t.GREEN,										  clb: o.clickMatchmaking,         requires: {minLvl: 40}};

            if (isPl()) defaultWidgetSet[w.NEWS] = {
                default: true,
                index: 1,
                pos: p.BOTTOM_RIGHT,
                txt: _t('news', null, 'news'),
                type: t.VIOLET,
                clb: o.clickNews,
                alwaysExist: true,
                requires: {
                    minLvl: 15
                }
            };
            if (!isPl()) defaultWidgetSet[w.ACHIEVEMENTS] = {
                default: true,
                index: 5,
                pos: p.TOP_RIGHT,
                txt: self.tLang('achievements'),
                type: t.GREEN,
                clb: o.clickAchivements,
                alwaysExist: true
            };
            if (isPl()) defaultWidgetSet[w.MATCHMAKING] = {
                default: false,
                txt: self.tLang('matchmaking'),
                type: t.GREEN,
                clb: o.clickMatchmaking,
                requires: {
                    minLvl: 40
                }
            };


            if (Engine.interface.getBattlePassActive()) defaultWidgetSet[w.BATTLE_PASS] = {
                default: true,
                index: 5,
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

    this.addRewardCalendarWidgetIfNotExist = () => {
        if (!Engine.interface.rewardsCalendarActive()) {
            return;
        }

        const REWARDS_CALENDAR = Engine.widgetsData.name.REWARDS_CALENDAR;
        const p = Engine.widgetsData.pos;
        const VIOLET = Engine.widgetsData.type.VIOLET;

        if (this.checkAttachWidgetList(REWARDS_CALENDAR)) {
            return;
        }

        if (mobileCheck()) defaultWidgetSet[REWARDS_CALENDAR] = {
            default: true,
            index: 3,
            pos: p.BOTTOM_LEFT_ADDITIONAL,
            txt: _t('clickEventCalendar'),
            type: VIOLET,
            clb: Engine.interface.clickRewardsCalendar,
            alwaysExist: true,
            requires: {
                minLvl: 25
            }
        };
        else defaultWidgetSet[REWARDS_CALENDAR] = {
            default: true,
            index: 4,
            pos: p.BOTTOM_LEFT,
            txt: _t('clickEventCalendar'),
            type: VIOLET,
            clb: Engine.interface.clickRewardsCalendar,
            alwaysExist: true,
            requires: {
                minLvl: 25
            }
        };


        this.rebuildWidgetButtons();
    };

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
        this.initOneDropToDeleteWidget('up-part');
        this.initOneDropToDeleteWidget('middle-part');
        this.initOneDropToDeleteWidget('down-part');
    };

    this.initOneDropToDeleteWidget = function(name) {
        Engine.interface.get$dropToDeleteWidgetLayer().find('.' + name).droppable({
            accept: '.widget-in-interface-bar',
            drop: function(e, ui) {
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
        let index = Math.round((ui.offset.left - $e.offset().left) / widgetSize / Engine.zoomFactor);

        if (!left) index = Math.abs(index - 6);

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

    this.createEmptySlotsWidget = function() {
        $('.main-buttons-container').each(function() {
            for (let i = 0; i < 7; i++) {
                let $emptySlot = Templates.get('empty-slot-widget');

                resizeWidget($emptySlot);

                $(this).append($emptySlot);
            }
        });
    };

    this.resizeAllEmptySlotWidget = () => {
        $('.empty-slot-widget').each(function() {
            resizeWidget($(this));
        });
    };

    this.resizeAllWidgetInAddons = () => {
        let content = getEngine().addonsPanel.getContent();
        content.find(".widget-button").each(function() {
            resizeWidget($(this));
        });

        content.find('.border-blink').css({
            width: widgetSize - 2,
            height: widgetSize - 2
        });
    };

    this.resizeAllWidgetInSettings = () => {
        let content = getEngine().settings.getContent();
        content.find(".widget-button").each(function() {
            resizeWidget($(this));
        });
    };

    const resizeWidget = ($emptySlotWidget) => {
        $emptySlotWidget.css({
            width: widgetSize,
            height: widgetSize
        });
    };

    this.showEmptySlots = function(show) {
        $('.main-buttons-container').find('.empty-slot-widget').css('display', show ? 'block' : 'none');
    };

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
        for (var i = 0; i < 7; i++) {

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
        for (var i = startIndex; i < 7; i++) {
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

        let $widget = this.getAttachWidgetByName(nameWidget);

        Engine.specificAnimationManager.deleteSpecificAnimationInElementIfExist($widget);

        this.setTypeInDefaultWidgetSet(nameWidget, type);
        this.manageBlinkAnimation($widget, type)
    };

    this.addWidgetButtons = function(additionalBarHide) {
        let store = Engine.serverStorage.get(self.getPathToHotWidgetVersion());
        //Engine.interface.get$interfaceLayer().find('.main-buttons-container').find('.widget-button').remove();

        self.removeBlinkSpecificAnimation();
        self.removeWidgetFromSlots();
        self.clearAttachWidgetList();

        if (!store) store = {};

        let widgetsWithoutFreeSlot = [];

        if (additionalBarHide) self.hideAdditionalWidgetBars();
        for (var clName in defaultWidgetSet) {
            self.createOneWidget(clName, store, additionalBarHide, widgetsWithoutFreeSlot);
        }

        if (widgetsWithoutFreeSlot.length) {
            this.findPositionToWidgetsWithoutFreeSlot(widgetsWithoutFreeSlot, additionalBarHide);
        }

        Engine.hotKeys.rebuildHotKeys();
        if (Engine.party) Engine.party.onInterfaceReady();
        if (Engine.whoIsHere) Engine.whoIsHere.onInterfaceReady();
        this.setEqWidgetAmountShow(Engine.interface.checkEqColumnShow());

        if (!widgetLoaded) {
            setWidgetLoaded(true);
            Engine.widgetNoticeManager.forceUpdate();
        }
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
            let $btn = attachWidgetList[k];

            let haveSpecificAnimation = Engine.specificAnimationManager.checkElementHaveSpecificAnimation($btn);
            if (!haveSpecificAnimation) continue;

            Engine.specificAnimationManager.deleteSpecificAnimationInElementIfExist($btn)
        }
    };


    this.removeWidgetFromSlots = () => {
        Engine.interface.get$interfaceLayer().find('.main-buttons-container').find('.widget-button').remove();
    }

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
        let $widget = this.getAttachWidgetByName(widgetName);
        $widget.removeClass('window-is-open');
    };

    this.setWidgetClassWindowIsOpen = (widgetName) => {
        let $widget = this.getAttachWidgetByName(widgetName);
        $widget.addClass('window-is-open');
    };

    this.createOneWidget = function(clName, storeData, additionalBarHide, wigdetsWithoutFreeSlot) {
        var bData = defaultWidgetSet[clName];
        var index;
        var pos;

        const allow = this.checkWidgetPermission(bData);

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

        let cl = '.' + pos;
        let find = self.createAttrSelector(Engine.widgetsData.attr.WIDGET_INDEX, index);
        let $w = Engine.interface.get$interfaceLayer().find(cl).find(find);

        if ($w.length) {
            wigdetsWithoutFreeSlot.push(clName);
            return;
        }

        var btn = Templates.get('widget-button');
        btn.addClass(bData.type + ' widget-in-interface-bar ' + 'widget-' + clName);
        btn.find('.icon').addClass(clName);
        self.set$BtnWidgetSize(btn);
        btn.bind('click', () => {

            const widgetData = Object.assign(bData, {
                index,
                pos
            }); //edge fix
            this.widgetOnClick({
                widgetData
            });
        });

        let widgetsData = Engine.widgetsData;

        if (pos == widgetsData.pos.TOP_LEFT || pos == widgetsData.pos.BOTTOM_LEFT || pos == widgetsData.pos.BOTTOM_LEFT_ADDITIONAL) btn.css('left', index * widgetSize);
        else btn.css('right', index * widgetSize);

        btn.attr({
            [Engine.widgetsData.attr.WIDGET_INDEX]: index,
            [Engine.widgetsData.attr.WIDGET_NAME]: clName,
            [Engine.widgetsData.attr.WIDGET_POS]: pos
        });

        self.manageBlinkAnimation(btn, bData.type);

        self.addToAttachWidgetList(clName, btn);

        let wManager = Engine.windowManager;
        if (wManager.checkWidgetIsLinkedToWindow(clName) && wManager.checkWindowIsShowByLinkedWidget(clName)) {
            self.manageClassOfWidget(clName, true);
        }

        if (this.checkWidgetIsLinkedToSection(clName) && this.checkSectionIsShowByLinkedWidget(clName)) {
            self.manageClassOfWidget(clName, true);
        }

        btn.css('position', 'absolute');
        let tipText = bData.txt;
        if (!allow) {
            //btn.addClass('disabled');
            btn.addClass(Engine.widgetsData.type.DISABLED);
            tipText += ` - ${_t('need__lvl', { '%val%': bData.requires.minLvl })}`;
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

    this.addDraggableAndDataAndTip = ($widget, tipText, widgetKeyData, clName) => {
        $widget.tip(tipText);
        $widget.data(widgetKeyData, clName);
        $widget.draggable({
            helper: 'clone',
            distance: 5,
            cursorAt: {
                top: 16,
                left: 16
            },
            scroll: false,
            zIndex: 20
        });
    }

    this.set$BtnWidgetSize = ($btn) => {
        $btn.css({
            width: widgetSize,
            height: widgetSize
        });
    }

    this.manageBlinkAnimation = ($btn, type) => {

        if (type != Engine.widgetsData.type.BLINK_VIOLET) return;

        let size = widgetSize * 0.75;

        Engine.specificAnimationManager.createBlinkedAnimation($btn, size, size, "#886199", 1.5, "widget-blink");
    };

    const callCheckCanFinishExternalTutorialClickWidget = (widgetName) => {
        let tutorialDataTrigger = Engine.tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_REQUIRE.CLICK_WIDGET,
            TutorialData.ON_FINISH_TYPE.REQUIRE,
            widgetName
        );

        Engine.tutorialManager.checkCanFinishExternalAndFinish(tutorialDataTrigger);
    };

    this.widgetOnClick = ({
        widgetData,
        eventType = 'click'
    }) => {

        let block = Engine.tutorialManager.checkBlockWidgets(widgetData.keyName);

        if (block) return;

        if (this.checkWidgetPermission(widgetData)) {
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
            message(_t('too_low_lvl'));
        }
    };

    this.widgetClick = debounce((widgetData, eventType) => {

        eventType = mobileCheck() ? 'mobile-tap' : eventType;
        Engine.interface.sendGA('widget', eventType, widgetData.txt);
    }, 300);

    this.widgetDrop = (widgetName, pos) => {
        Engine.interface.sendGA('widgetDrop', widgetName, pos);
    };

    this.checkWidgetPermission = (widgetData) => {
        // if (_l() !== 'pl' || Engine.worldName === 'berufs') return true; // #20007 - exception for Berufs
        //if (!isPl() || Engine.worldConfig.getWorldName() === 'berufs') return true; // #20007 - exception for Berufs
        if (Engine.worldConfig.getWorldName() === 'berufs') return true; // #20007 - exception for Berufs

        return !((isset(widgetData) && isset(widgetData.requires) && widgetData.requires.minLvl > Engine.hero.d.lvl) &&
            ((isset(widgetData.requires) && !isset(widgetData.requires.characters)) ||
                (isset(widgetData.requires) && isset(widgetData.requires.characters) && Engine.changePlayer && widgetData.requires.characters === Object.keys(Engine.changePlayer.getList()).length)))
    };

    this.manageDisplayAdditionaWidgetBarsPerPos = function(pos) {
        let widgetsData = Engine.widgetsData;

        let $bottomPositioner = Engine.interface.getBottomPositioner();

        if (pos == widgetsData.pos.BOTTOM_LEFT_ADDITIONAL) {

            $bottomPositioner.find('.bg-additional-widget-left').css('display', 'block');
            $bottomPositioner.find('.bottom-left-additional').css('display', 'block');

            //Engine.chat.setChatOverAdditionaBarPanel(true);
            Engine.chatController.getChatWindow().setChatOverAdditionalBarPanel(true);
            self.setWidthAdditionaPanel('left', false);
            Engine.interface.get$interfaceLayer().find('.quick_messages').css('bottom', '110px');
        }
        if (pos == widgetsData.pos.BOTTOM_RIGHT_ADDITIONAL) {

            $bottomPositioner.find('.bg-additional-widget-right').css('display', 'block');
            $bottomPositioner.find('.bottom-right-additional').css('display', 'block');

            self.setAdditionalBarClass(true);
            Engine.interface.setStatsOverAdditionalBarPanel();
            self.setWidthAdditionaPanel('right', false);
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
        self.setWidthAdditionaPanel('left', setMaxWidth);
        self.setWidthAdditionaPanel('right', setMaxWidth);

        let $bottomPositioner = Engine.interface.getBottomPositioner();

        $bottomPositioner.find('.bg-additional-widget-left, .bg-additional-widget-right').css('display', 'block');
        $bottomPositioner.find('.bottom-left-additional, .bottom-right-additional').css('display', 'block');

        Engine.interface.get$interfaceLayer().find('.quick_messages').css('bottom', '110px');
    };

    this.setWidthAdditionaPanel = function(side, setMaxWidth) {
        let $bar = $('.bg-additional-widget-' + side);
        let index = null

        if (setMaxWidth) index = 6;
        else index = getMaxWidgetIndex($('.bottom.positioner').find('.bottom-' + side + '-additional'));


        $bar.width((widgetSize * (index + 1) + 120) + 'px');
    };

    this.hideAdditionalWidgetBars = function() {
        //Engine.chat.setChatOverAdditionaBarPanel(false);
        Engine.chatController.getChatWindow().setChatOverAdditionalBarPanel(false);
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

    this.setEditableWidget = function(state) {
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

    this.getWidgetLoaded = getWidgetLoaded;
    this.addSeveralTypesToWidget = addSeveralTypesToWidget;

};