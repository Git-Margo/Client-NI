var ProfData = require('@core/characters/ProfData');
var TutorialData = require('@core/tutorial/TutorialData');
var SkillsData = require('@core/skills/SkillsData');

module.exports = function() {

    let self = this;

    let eqcolumnshow = 'eqcolumnshow';
    let quickFightNearMobHotkey = 'autofightNearMob';

    let eqcolumnshowWidget = 'eq-show-icon';
    let quickFightWidget = 'auto-fight-near-mob';


    const HIDDEN_WINDOW = "hidden-window"

    this.init = () => {
        this.addPlDataToList();
    };

    this.attachSkipTutorial = () => {
        $('.skip-tutorial-span').click(function() {
            Engine.tutorials.turnOffTutorial();
        });
    };

    this.getQuestObserve = () => {
        return '.border-window:has(.content):has(.quest-observe-window)';
    }

    this.checkAdditionalTutorialRequire2 = (id) => {
        return !(Engine.tutorialManager.bitIsSet(Engine.tutorialValue, 1));
    };

    this.checkAdditionalTutorialRequire6 = (id, data) => {
        return parseInt(data.auto) == 0;
    };

    this.checkAdditionalTutorialRequire18 = (id) => {
        return Engine.tutorialManager.itemsInBasket(17);
    };

    this.checkAdditionalTutorialRequire19 = (id) => {
        return Engine.hero.d.warrior_stats.hp / Engine.hero.d.warrior_stats.maxhp < 0.5;
    };

    this.checkAdditionalTutorialRequire22 = (id, data) => {
        return data._cachedStats.recipe;
    };

    this.checkAdditionalTutorialRequire23 = (id, data) => {
        return $('.items-list>.divide-list-group>.group-list>.crafting-recipe-in-list.enabled').length;
    };

    this.checkAdditionalTutorialRequire24 = (id, data) => {
        return Engine.crafting.recipes;
    };

    this.checkAdditionalTutorialRequire25 = (id, data) => {
        return Engine.crafting.recipes;
    };

    this.checkAdditionalTutorialRequire26 = (id, data) => {
        return Engine.crafting.recipes;
    };

    this.checkAdditionalTutorialRequire27 = (id, data) => {
        return !($('.group-list>.offer-id-1616.disabled').length) && $('.barter-content>.bottom-row-panel>.do-recipe>.button.green').length;
    };

    this.checkAdditionalTutorialRequire34 = (id, data) => {
        return !($('.group-list>.offer-id-1616.disabled').length);
    };

    this.checkAdditionalTutorialRequire32 = (id) => {
        return Engine.tutorialManager.itemsInBasket(31);
    };

    this.checkFullFill19 = (id) => {
        return Engine.hero.d.warrior_stats.hp / Engine.hero.d.warrior_stats.maxhp > 0.5;
    };

    this.checkFullFill17 = () => {

        if (Engine.tutorialManager.itemsInBasket(17)) return true;

        let o = {
            itemsNeed: {
                items: {
                    [ProfData.WARRIOR]: {
                        1: {
                            loc: 'g',
                            tpl: 119
                        },
                        14: {
                            loc: 'g',
                            tpl: 72
                        },
                        8: {
                            loc: 'g',
                            tpl: 34019
                        },
                        9: {
                            loc: 'g',
                            tpl: 66
                        },
                        10: {
                            loc: 'g',
                            tpl: 83
                        }
                    },

                    [ProfData.PALADIN]: {
                        1: {
                            loc: 'g',
                            tpl: 119
                        },
                        14: {
                            loc: 'g',
                            tpl: 72
                        },
                        8: {
                            loc: 'g',
                            tpl: 34019
                        },
                        9: {
                            loc: 'g',
                            tpl: 66
                        },
                        10: {
                            loc: 'g',
                            tpl: 83
                        }
                    },

                    [ProfData.HUNTER]: {
                        4: {
                            loc: 'g',
                            tpl: 85
                        },
                        29: {
                            loc: 'g',
                            tpl: 658
                        },
                        8: {
                            loc: 'g',
                            tpl: 34019
                        },
                        9: {
                            loc: 'g',
                            tpl: 66
                        },
                        10: {
                            loc: 'g',
                            tpl: 83
                        }
                    },
                    [ProfData.TRACKER]: {
                        4: {
                            loc: 'g',
                            tpl: 85
                        },
                        29: {
                            loc: 'g',
                            tpl: 658
                        },
                        8: {
                            loc: 'g',
                            tpl: 34019
                        },
                        9: {
                            loc: 'g',
                            tpl: 66
                        },
                        10: {
                            loc: 'g',
                            tpl: 83
                        }
                    },
                    [ProfData.BLADE_DANCER]: {
                        1: {
                            loc: 'g',
                            tpl: 119
                        },
                        5: {
                            loc: 'g',
                            tpl: 28985
                        },
                        8: {
                            loc: 'g',
                            tpl: 34019
                        },
                        9: {
                            loc: 'g',
                            tpl: 66
                        },
                        10: {
                            loc: 'g',
                            tpl: 83
                        }
                    },
                    [ProfData.MAGE]: {
                        6: {
                            loc: 'g',
                            tpl: 141
                        },
                        7: {
                            loc: 'g',
                            tpl: 25571
                        },
                        8: {
                            loc: 'g',
                            tpl: 34019
                        },
                        9: {
                            loc: 'g',
                            tpl: 66
                        },
                        10: {
                            loc: 'g',
                            tpl: 83
                        }
                    }
                },
            }
        };

        return Engine.tutorialManager.needItemsTest(o);
    };

    this.checkFullFill20 = (id) => {
        let o = {
            itemsNeed: {
                items: {
                    [ProfData.WARRIOR]: {
                        15: {
                            loc: 'g'
                        }
                    },
                    [ProfData.PALADIN]: {
                        15: {
                            loc: 'g'
                        }
                    },
                    [ProfData.MAGE]: {
                        15: {
                            loc: 'g'
                        }
                    },
                    [ProfData.TRACKER]: {
                        15: {
                            loc: 'g'
                        }
                    },
                    [ProfData.HUNTER]: {
                        15: {
                            loc: 'g'
                        }
                    },
                    [ProfData.BLADE_DANCER]: {
                        15: {
                            loc: 'g'
                        }
                    },
                },
                stats: {
                    quest: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 1723]
                }
            },
        };
        return Engine.tutorialManager.needItemsTest(o);
    };

    this.checkFullFill21 = (item) => {
        return item._cachedStats.recipe
    };

    this.checkFullFill23 = ($recipeWithState) => {
        return !($recipeWithState.hasClass('black'));
    };

    this.checkFullFill34 = () => {
        return $('.offer-id-1616.mark-offer').length;
    };

    this.checkCanFinish = (id, data) => {
        let dataFromList = Engine.tutorialManager.getDataFromList(id);
        switch (id) {
            case 53:
            case 0:
                return true;
            case 1:
                return Engine.tutorialManager.checkIsMoveTutorial();
            case 2:
                return Engine.tutorialManager.checkIsSameNpc(data, dataFromList.canvasMultiGlow.list[0].id);
            case 3:
                return Engine.tutorialManager.needItemsTest(Engine.tutorialManager.getDataFromList(4));
            case 4:
                return Engine.tutorialManager.checkIsSameNpc(data, dataFromList.canvasMultiGlow.list[0].id);
            case 5:
                return true;
            case 6:
                return true;
            case 7:
                return true;
            case 8:
                return true;
            case 9:
                return Engine.tutorialManager.checkIsSameNpc(data, dataFromList.canvasMultiGlow.list[0].id); // to fix
            case 10:
                //return Engine.tutorialManager.checkIsSameNpc(data, dataFromList.canvasMultiGlow.list[0].id); // to fix
                return true
            case 11:
                return Engine.tutorialManager.itemIsLootbox(data);
            case 12:
                return true;
            case 13:
                return Engine.tutorialManager.needItemsTest({
                    itemsNeed: {
                        items: {
                            [ProfData.WARRIOR]: {
                                9: {
                                    loc: 'g'
                                }
                            },
                            [ProfData.PALADIN]: {
                                9: {
                                    loc: 'g'
                                }
                            },
                            [ProfData.MAGE]: {
                                9: {
                                    loc: 'g'
                                }
                            },
                            [ProfData.TRACKER]: {
                                9: {
                                    loc: 'g'
                                }
                            },
                            [ProfData.HUNTER]: {
                                9: {
                                    loc: 'g'
                                }
                            },
                            [ProfData.BLADE_DANCER]: {
                                9: {
                                    loc: 'g'
                                }
                            },
                        },
                        inUse: true,
                        stats: {
                            lvl: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 5]
                        }
                    },
                });
                //return true;
            case 14:
                return true;
            case 15:
                return true;
            case 16:
                return Engine.tutorialManager.itemIsLootbox(data);
            case 17:
                return this.checkFullFill17();
                //return Engine.tutorialManager.itemsInBasket(17) || Engine.tutorialManager.needItemsTest(Engine.tutorialManager.getDataFromList(19));
            case 18:
                return true;
            case 19:
                return this.checkFullFill19();
            case 20:
                return this.checkFullFill20();
            case 21:
                return this.checkFullFill21(data);
            case 22:
                return true;
            case 23:
                return this.checkFullFill23(data);
            case 24:
                return true;
            case 25:
                return true;
            case 26:
                return true;
            case 27:
                return true;
            case 28:
                return true;
            case 29:
                return true;
            case 30:
                return true;
            case 31:
                return Engine.tutorialManager.itemsInBasket(31);
            case 32:
                return true;
            case 33:
                return Engine.tutorialManager.needItemsTest({
                    itemsNeed: {
                        htmlMultiGlow: true,
                        items: {
                            [ProfData.WARRIOR]: {
                                24: {
                                    loc: 'g',
                                    amount: 2
                                }
                            },
                            [ProfData.PALADIN]: {
                                24: {
                                    loc: 'g',
                                    amount: 2
                                }
                            },
                            [ProfData.MAGE]: {
                                24: {
                                    loc: 'g',
                                    amount: 2
                                }
                            },
                            [ProfData.TRACKER]: {
                                24: {
                                    loc: 'g',
                                    amount: 2
                                }
                            },
                            [ProfData.HUNTER]: {
                                24: {
                                    loc: 'g',
                                    amount: 2
                                }
                            },
                            [ProfData.BLADE_DANCER]: {
                                24: {
                                    loc: 'g',
                                    amount: 2
                                }
                            }
                        },
                        inUse: true
                    }
                });
            case 34:
                return this.checkFullFill34(data);
            default:
                console.log('not supported Finish tutorial... Yet...');
                return false;
        }
    };

    this.manageEqColumn = () => {
        let isShow = Engine.interface.checkEqColumnIsShow();
        if (isShow) return;
        Engine.interface.clickEqColumnShow();
    };

    this.getNormalAttackIcon = () => {
        return "icon-" + SkillsData.specificSkills.NORMAL_ATTACK_ID;
    }

    this.addPlDataToList = () => {

        Engine.tutorialManager.list.pl = {
            53: [{
                textPc: 't_53_ni_pl',
                textMobile: 't_53_ni_pl',

                headerPc: "movement_header_ni",
                headerMobile: 'mobile_53_tutorial',

                idMaps: [1456],
                graphic: '/img/gui/newTutorial/0.png',
                //click: {txt: 'Zaczynamy', clb:self.goToTutorial1},
                click: {
                    txt: 'Zaczynamy',
                    clb: function() {
                        Engine.tutorials.finishTutorial()
                    }
                },
                additionalFunctionAfterCreate: self.attachSkipTutorial
            }],
            1: [{
                textPc: 't_1_ni_pl',
                textMobile: 't_1_ni_mobile_pl',

                headerPc: "t_header_1_ni_pl",
                headerMobile: "t_header_1_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/6.gif',
                idMaps: [1456],
                htmlFocus: '.echh-layer',
                canvasMultiGlow: {
                    list: [{
                        kind: TutorialData.TYPE_OBJECT.HERO
                    }]
                },
                blink: true,
                canvasPosition: {
                    kind: TutorialData.TYPE_OBJECT.HERO,
                },
                //draggableWnd: false
            }],
            2: [{
                textPc: 't_2_ni_pl',
                textMobile: 't_2_ni_mobile_pl',

                headerPc: "t_header_2_ni_pl",
                headerMobile: "t_header_2_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/8.gif',
                //htmlFocus: '.echh-layer',
                htmlMultiGlow: ['.widget-in-interface-bar.widget-npc-talk-icon', self.getQuestObserve()],
                canvasMultiGlow: {
                    list: [{
                        kind: TutorialData.TYPE_OBJECT.NPC,
                        id: 178339
                    }]
                },
                //canvasFocus: {
                //	kind: 'npc',
                //	id: 178339
                //},
                canvasPosition: {
                    kind: TutorialData.TYPE_OBJECT.NPC,
                    id: 178339
                },
                blink: true,
                idMaps: [1456],
                additionalRequireFunction: self.checkAdditionalTutorialRequire2,
            }],
            3: [{
                textPc: 't_3_ni_pl',
                textMobile: 't_3_ni_mobile_pl',

                headerPc: "t_header_3_ni_pl",
                headerMobile: "t_header_3_ni_pl",

                //mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/4.gif',
                htmlFocus: '.interface-layer>.right-column.main-column',
                htmlPosition: '.interface-layer>.right-column.main-column',
                htmlMultiGlow: ['.character_wrapper>.equipment-wrapper>[data-st=5]', '.character_wrapper>.equipment-wrapper>[data-st=7]'],
                blink: true,
                idMaps: [1456],
                itemsNeed: {
                    htmlMultiGlow: true,
                    items: {
                        //[ProfData.WARRIOR]: {1: {loc: 'g'}, 14: {loc: 'g'}},
                        [ProfData.WARRIOR]: {
                            1: {
                                loc: 'g',
                                tpl: 10446
                            },
                            14: {
                                loc: 'g',
                                tpl: 10447
                            }
                        },
                        [ProfData.PALADIN]: {
                            1: {
                                loc: 'g'
                            },
                            14: {
                                loc: 'g'
                            }
                        },
                        [ProfData.MAGE]: {
                            6: {
                                loc: 'g'
                            },
                            7: {
                                loc: 'g'
                            }
                        },
                        [ProfData.TRACKER]: {
                            4: {
                                loc: 'g'
                            },
                            29: {
                                loc: 'g'
                            }
                        },
                        [ProfData.HUNTER]: {
                            4: {
                                loc: 'g'
                            },
                            29: {
                                loc: 'g'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            1: {
                                loc: 'g'
                            },
                            5: {
                                loc: 'g'
                            }
                        }
                    },
                    minOneOfAllNotEquip: true, // val only true
                },
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            4: [{
                textPc: 't_4_ni_pl',
                textMobile: 't_4_ni_mobile_pl',

                headerPc: "t_header_4_ni_pl",
                headerMobile: "t_header_4_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                //htmlPosition: '.border-window:has(.content:has(.quest-observe-window))',
                //htmlMultiGlow: ['.border-window:has(.content:has(.quest-observe-window))'],
                htmlPosition: self.getQuestObserve(),
                htmlMultiGlow: [self.getQuestObserve()],
                graphic: '/img/gui/newTutorial/8.gif',
                canvasMultiGlow: {
                    list: [{
                        kind: TutorialData.TYPE_OBJECT.NPC,
                        id: 178339
                    }]
                },
                blink: true,
                idMaps: [1456],
                itemsNeed: {
                    items: {
                        [ProfData.WARRIOR]: {
                            1: {
                                loc: 'g',
                            },
                            14: {
                                loc: 'g'
                            }
                        },
                        [ProfData.PALADIN]: {
                            1: {
                                loc: 'g',
                            },
                            14: {
                                loc: 'g'
                            }
                        },
                        [ProfData.MAGE]: {
                            6: {
                                loc: 'g',
                            },
                            7: {
                                loc: 'g'
                            }
                        },
                        [ProfData.TRACKER]: {
                            4: {
                                loc: 'g',
                            },
                            29: {
                                loc: 'g'
                            }
                        },
                        [ProfData.HUNTER]: {
                            4: {
                                loc: 'g',
                            },
                            29: {
                                loc: 'g'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            1: {
                                loc: 'g',
                            },
                            5: {
                                loc: 'g'
                            }
                        }
                    },
                    inUse: true
                }
            }],
            5: [{
                textPc: 't_5_ni_pl',
                textMobile: 't_5_ni_mobile_pl',

                headerPc: "t_header_5_ni_pl",
                headerMobile: "t_header_5_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/7.gif',
                //htmlFocus: '.echh-layer',
                canvasMultiGlow: {
                    list: [{
                        kind: TutorialData.TYPE_OBJECT.NPC,
                        id: 178348
                    }]
                },
                //canvasFocus: {
                //	kind: 'npc',
                //	id: 178348
                //},
                //canvasPosition: {
                //	kind: 'npc',
                //	id: 178348
                //},
                //htmlPosition: '.border-window:has(.content:has(.quest-observe-window))',
                htmlPosition: '.omg-tutorial-handler',
                hasQuestId: 1761,
                idMaps: [1456],
                itemsNeed: {
                    items: {
                        [ProfData.WARRIOR]: {
                            1: {
                                loc: 'g'
                            },
                            14: {
                                loc: 'g'
                            }
                        },
                        [ProfData.PALADIN]: {
                            1: {
                                loc: 'g'
                            },
                            14: {
                                loc: 'g'
                            }
                        },
                        [ProfData.MAGE]: {
                            6: {
                                loc: 'g'
                            },
                            7: {
                                loc: 'g'
                            }
                        },
                        [ProfData.TRACKER]: {
                            4: {
                                loc: 'g'
                            },
                            29: {
                                loc: 'g'
                            }
                        },
                        [ProfData.HUNTER]: {
                            4: {
                                loc: 'g'
                            },
                            29: {
                                loc: 'g'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            1: {
                                loc: 'g'
                            },
                            5: {
                                loc: 'g'
                            }
                        }
                    },
                    inUse: true
                },
                blink: true,
                blockedHotKeys: [quickFightNearMobHotkey],
                blockedWidget: [quickFightWidget],
                htmlMultiGlow: ['.widget-button.widget-in-interface-bar.widget-attack-near-mob', self.getQuestObserve()],
            }],
            6: [{
                textPc: 't_6_ni_pl',
                textMobile: 't_6_ni_mobile_pl',

                headerPc: "t_header_6_ni_pl",
                headerMobile: "t_header_6_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/5.gif',
                idMaps: [1456],
                //htmlFocus: '.skill-usable-slot:has(.battle-skill:has(.' + self.getNormalAttackIcon() + '))',
                //htmlPosition: '.skill-usable-slot:has(.battle-skill:has(.' + self.getNormalAttackIcon() + '))',
                htmlFocus: '.skill-usable-slot:has(.battle-skill):has(.' + self.getNormalAttackIcon() + ')',
                htmlPosition: '.skill-usable-slot:has(.battle-skill):has(.' + self.getNormalAttackIcon() + ')',
                htmlMultiGlow: [self.getQuestObserve()],
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire6,
            }],
            7: [{
                textPc: 't_7_ni_pl',
                textMobile: 't_7_ni_mobile_pl',

                headerPc: "t_header_7_ni_pl",
                headerMobile: "t_header_7_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/5.gif',
                idMaps: [1456],
                //htmlMultiGlow: ['.skill-usable-slot:has(.battle-skill:has(.' + self.getNormalAttackIcon() + '))'],
                //htmlPosition: '.skill-usable-slot:has(.battle-skill:has(.' + self.getNormalAttackIcon() + '))',
                htmlMultiGlow: ['.skill-usable-slot:has(.battle-skill):has(.' + self.getNormalAttackIcon() + ')'],
                htmlPosition: '.skill-usable-slot:has(.battle-skill):has(.' + self.getNormalAttackIcon() + ')',
                blink: true
            }, ],
            8: [{
                textPc: 't_8_ni_pl',
                textMobile: 't_8_ni_mobile_pl',

                headerPc: "t_header_8_ni_pl",
                headerMobile: "t_header_8_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/9.gif',
                htmlFocus: '.close-battle-ground',
                htmlPosition: '.close-battle-ground',
                idMaps: [1456],
                blink: true,
            }, ],
            9: [{
                textPc: 't_9_ni_pl',
                textMobile: 't_9_ni_mobile_pl',

                headerPc: "t_header_9_ni_pl",
                headerMobile: "t_header_9_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/1.gif',
                idMaps: [1456],
                //htmlPosition: '.border-window:has(.content:has(.quest-observe-window))',
                //htmlMultiGlow: ['.border-window:has(.content:has(.quest-observe-window))'],
                htmlPosition: self.getQuestObserve(),
                htmlMultiGlow: [self.getQuestObserve()],
                canvasMultiGlow: {
                    list: [{
                        kind: TutorialData.TYPE_OBJECT.NPC,
                        id: 178339
                    }]
                },
                blink: true
            }],
            10: [{
                textPc: 't_10_ni_pl',
                textMobile: 't_10_ni_mobile_pl',

                headerPc: "t_header_10_ni_pl",
                headerMobile: "t_header_10_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/1.gif',
                idMaps: [1456],
                itemsNeed: {
                    items: {
                        [ProfData.WARRIOR]: {
                            19: {
                                loc: 'g'
                            }
                        },
                        [ProfData.PALADIN]: {
                            19: {
                                loc: 'g'
                            }
                        },
                        [ProfData.MAGE]: {
                            19: {
                                loc: 'g'
                            }
                        },
                        [ProfData.TRACKER]: {
                            19: {
                                loc: 'g'
                            }
                        },
                        [ProfData.HUNTER]: {
                            19: {
                                loc: 'g'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            19: {
                                loc: 'g'
                            }
                        },
                    }
                },
                //htmlMultiGlow: ['.border-window:has(.content:has(.quest-observe-window))'],
                htmlMultiGlow: [self.getQuestObserve()],
                canvasMultiGlow: {
                    list: [{
                        kind: TutorialData.TYPE_OBJECT.NPC,
                        id: 178358
                    }]
                },
                //htmlPosition: '.border-window:has(.content:has(.quest-observe-window))',
                htmlPosition: self.getQuestObserve(),
                blink: true
            }],
            11: [{
                textPc: 't_11_ni_pl',
                textMobile: 't_11_ni_mobile_pl',

                headerPc: "t_header_11_ni_pl",
                headerMobile: "t_header_11_ni_pl",

                //mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/4.gif',
                idMaps: [707],
                //minLevel: 5,
                htmlFocus: '.interface-layer>.right-column.main-column',
                htmlPosition: '.inventory_wrapper>.inventory-grid-bg',
                itemsNeed: {
                    htmlMultiGlow: true,
                    items: {
                        //[ProfData.WARRIOR]		: {16: {loc: 'g'}},
                        //[ProfData.PALADIN]		: {16: {loc: 'g'}},
                        //[ProfData.MAGE]			: {16: {loc: 'g'}},
                        //[ProfData.TRACKER]		: {16: {loc: 'g'}},
                        //[ProfData.HUNTER]		: {16: {loc: 'g'}},
                        //[ProfData.BLADE_DANCER]	: {16: {loc: 'g'}},

                        [ProfData.WARRIOR]: {
                            16: {
                                loc: 'g',
                                tpl: 25356
                            }
                        },
                        [ProfData.PALADIN]: {
                            16: {
                                loc: 'g',
                                tpl: 25356
                            }
                        },
                        [ProfData.MAGE]: {
                            16: {
                                loc: 'g',
                                tpl: 25356
                            }
                        },
                        [ProfData.TRACKER]: {
                            16: {
                                loc: 'g',
                                tpl: 25356
                            }
                        },
                        [ProfData.HUNTER]: {
                            16: {
                                loc: 'g',
                                tpl: 25356
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            16: {
                                loc: 'g',
                                tpl: 25356
                            }
                        }
                    }
                    //stats: {
                    //	lootbox: true,
                    //	lvl: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 5]
                    //}
                },
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            12: [{
                textPc: 't_12_ni_pl',
                textMobile: 't_12_ni_mobile_pl',

                headerPc: "t_header_12_ni_pl",
                headerMobile: "t_header_12_ni_pl",

                //mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/1.gif',
                idMaps: [707],
                htmlFocus: '.bottom-wrapper>.table-wrapper>.accept-button>.button',
                //htmlPosition: '.border-window:has(.content:has(.inner-content:has(.loot-window)))',
                htmlPosition: '.border-window:has(.content):has(.inner-content):has(.loot-window)',
                itemsNeed: {
                    items: {
                        [ProfData.WARRIOR]: {
                            16: {
                                loc: 'l'
                            },
                            9: {
                                loc: 'l'
                            },
                            17: {
                                loc: 'l'
                            }
                        },
                        [ProfData.PALADIN]: {
                            16: {
                                loc: 'l'
                            },
                            9: {
                                loc: 'l'
                            },
                            17: {
                                loc: 'l'
                            }
                        },
                        [ProfData.MAGE]: {
                            16: {
                                loc: 'l'
                            },
                            9: {
                                loc: 'l'
                            },
                            17: {
                                loc: 'l'
                            }
                        },
                        [ProfData.TRACKER]: {
                            16: {
                                loc: 'l'
                            },
                            9: {
                                loc: 'l'
                            },
                            17: {
                                loc: 'l'
                            }
                        },
                        [ProfData.HUNTER]: {
                            16: {
                                loc: 'l'
                            },
                            9: {
                                loc: 'l'
                            },
                            17: {
                                loc: 'l'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            16: {
                                loc: 'l'
                            },
                            9: {
                                loc: 'l'
                            },
                            17: {
                                loc: 'l'
                            }
                        },
                    }
                },
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            13: [{
                textPc: 't_13_ni_pl',
                textMobile: 't_13_ni_mobile_pl',

                headerPc: "t_header_13_ni_pl",
                headerMobile: "t_header_13_ni_pl",

                //mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/4.gif',
                idMaps: [707],
                maxLevel: 7,
                htmlFocus: '.interface-layer>.right-column.main-column',
                htmlPosition: '.interface-layer>.right-column.main-column',
                htmlMultiGlow: ['.character_wrapper>.equipment-wrapper>[data-st=1]'],
                itemsNeed: {
                    htmlMultiGlow: true,
                    items: {
                        [ProfData.WARRIOR]: {
                            9: {
                                loc: 'g',
                                tpl: 65
                            }
                        },
                        [ProfData.PALADIN]: {
                            9: {
                                loc: 'g',
                                tpl: 65
                            }
                        },
                        [ProfData.MAGE]: {
                            9: {
                                loc: 'g',
                                tpl: 65
                            }
                        },
                        [ProfData.TRACKER]: {
                            9: {
                                loc: 'g',
                                tpl: 65
                            }
                        },
                        [ProfData.HUNTER]: {
                            9: {
                                loc: 'g',
                                tpl: 65
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            9: {
                                loc: 'g',
                                tpl: 65
                            }
                        },
                    },
                    minOneOfAllNotEquip: true,
                    stats: {
                        lvl: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 5]
                    }
                },
                minLevel: 5,
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            14: [{
                textPc: 't_14_ni_pl',
                textMobile: 't_14_ni_mobile_pl',

                headerPc: "t_header_14_ni_pl",
                headerMobile: "t_header_14_ni_pl",

                //mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/4.gif',
                idMaps: [707],
                htmlFocus: '.interface-layer>.right-column.main-column',
                htmlPosition: '.interface-layer>.right-column.main-column',
                //htmlMultiGlow: ['.character_wrapper>.equipment-wrapper', '.inventory_wrapper>.bags-navigation'],
                itemsNeed: {
                    htmlMultiGlow: true,
                    items: {
                        [ProfData.WARRIOR]: {
                            17: {
                                loc: 'g',
                                tpl: 25357
                            }
                        },
                        [ProfData.PALADIN]: {
                            17: {
                                loc: 'g',
                                tpl: 25357
                            }
                        },
                        [ProfData.MAGE]: {
                            17: {
                                loc: 'g',
                                tpl: 25357
                            }
                        },
                        [ProfData.TRACKER]: {
                            17: {
                                loc: 'g',
                                tpl: 25357
                            }
                        },
                        [ProfData.HUNTER]: {
                            17: {
                                loc: 'g',
                                tpl: 25357
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            17: {
                                loc: 'g',
                                tpl: 25357
                            }
                        },
                    },
                    stats: {
                        gold: true
                    }
                },
                minLevel: 5,
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
                additionalRequireFunction: function() {
                    return !Engine.addonsPanel.checkAddonOnList(Engine.addonsPanel.getAddonIdKey(28))
                }, // EXCEPTION WITH ADDON TO EAT GOLD... MADNESS...
            }],
            15: [{
                textPc: 't_15_ni_pl',
                textMobile: 't_15_ni_mobile_pl',

                headerPc: "t_header_15_ni_pl",
                headerMobile: "t_header_15_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/3.gif',
                idMaps: [1508],
                htmlMultiGlow: [
                    //'.border-window:has(.content:has(.quest-observe-window))',
                    self.getQuestObserve(),
                    '.main-buttons-container>.widget-auto-fight-near-mob',
                    '.widget-button.widget-in-interface-bar.widget-auto-fight-near-mob'
                ],
                //htmlPosition: '.border-window:has(.content:has(.quest-observe-window))',
                htmlPosition: self.getQuestObserve(),
                blink: true
            }],
            16: [{
                textPc: 't_16_ni_pl',
                textMobile: 't_16_ni_mobile_pl',

                headerPc: "t_header_16_ni_pl",
                headerMobile: "t_header_16_ni_pl",


                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/4.gif',
                htmlFocus: '.interface-layer>.right-column.main-column',
                htmlPosition: '.interface-layer>.right-column.main-column',
                //htmlMultiGlow: ['.character_wrapper>.equipment-wrapper', '.inventory_wrapper>.bags-navigation'],
                idMaps: [707],
                itemsNeed: {
                    htmlMultiGlow: true,
                    items: {
                        [ProfData.WARRIOR]: {
                            16: {
                                loc: 'g'
                            }
                        },
                        [ProfData.PALADIN]: {
                            16: {
                                loc: 'g'
                            }
                        },
                        [ProfData.MAGE]: {
                            16: {
                                loc: 'g'
                            }
                        },
                        [ProfData.TRACKER]: {
                            16: {
                                loc: 'g'
                            }
                        },
                        [ProfData.HUNTER]: {
                            16: {
                                loc: 'g'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            16: {
                                loc: 'g'
                            }
                        },
                    },
                    stats: {
                        lootbox: true,
                        lvl: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 10]
                    }
                },
                minLevel: 10,
                blink: true,
                additionalRequireFunction: function() {
                    return false
                }, // turn off
            }],
            17: [{
                textPc: 't_17_ni_pl',
                textMobile: 't_17_ni_mobile_pl',

                headerPc: "t_header_17_ni_pl",
                headerMobile: "t_header_17_ni_pl",


                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/1.gif',
                idMaps: [707],
                itemsNeed: {
                    htmlMultiGlow: true,
                    tpls: {
                        [ProfData.WARRIOR]: {
                            1: {
                                loc: 'n',
                                tpl: 119
                            },
                            14: {
                                loc: 'n',
                                tpl: 72
                            },
                            8: {
                                loc: 'n',
                                tpl: 34019
                            },
                            9: {
                                loc: 'n',
                                tpl: 66
                            },
                            10: {
                                loc: 'n',
                                tpl: 83
                            }
                        },
                        [ProfData.PALADIN]: {
                            1: {
                                loc: 'n',
                                tpl: 119
                            },
                            14: {
                                loc: 'n',
                                tpl: 72
                            },
                            8: {
                                loc: 'n',
                                tpl: 34019
                            },
                            9: {
                                loc: 'n',
                                tpl: 66
                            },
                            10: {
                                loc: 'n',
                                tpl: 83
                            }
                        },
                        [ProfData.HUNTER]: {
                            4: {
                                loc: 'n',
                                tpl: 85
                            },
                            29: {
                                loc: 'n',
                                tpl: 658
                            },
                            8: {
                                loc: 'n',
                                tpl: 34019
                            },
                            9: {
                                loc: 'n',
                                tpl: 66
                            },
                            10: {
                                loc: 'n',
                                tpl: 83
                            }
                        },
                        [ProfData.TRACKER]: {
                            4: {
                                loc: 'n',
                                tpl: 85
                            },
                            29: {
                                loc: 'n',
                                tpl: 658
                            },
                            8: {
                                loc: 'n',
                                tpl: 34019
                            },
                            9: {
                                loc: 'n',
                                tpl: 66
                            },
                            10: {
                                loc: 'n',
                                tpl: 83
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            1: {
                                loc: 'n',
                                tpl: 119
                            },
                            5: {
                                loc: 'n',
                                tpl: 28985
                            },
                            8: {
                                loc: 'n',
                                tpl: 34019
                            },
                            9: {
                                loc: 'n',
                                tpl: 66
                            },
                            10: {
                                loc: 'n',
                                tpl: 83
                            }
                        },
                        [ProfData.MAGE]: {
                            6: {
                                loc: 'n',
                                tpl: 141
                            },
                            7: {
                                loc: 'n',
                                tpl: 25571
                            },
                            8: {
                                loc: 'n',
                                tpl: 34019
                            },
                            9: {
                                loc: 'n',
                                tpl: 66
                            },
                            10: {
                                loc: 'n',
                                tpl: 83
                            }
                        }

                    },
                    stats: {
                        lvl: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 10]
                    }
                },
                htmlMultiGlow: ['.inner-content>.shop-wrapper>.shop-content>.buy-items'],
                //htmlPosition: '.border-window:has(.content:has(.inner-content:has(.shop-wrapper)))',
                htmlPosition: '.border-window:has(.content):has(.inner-content):has(.shop-wrapper)',
                minLevel: 10,
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            18: [{
                textPc: 't_18_ni_pl',
                textMobile: 't_18_ni_mobile_pl',

                headerPc: "t_header_18_ni_pl",
                headerMobile: "t_header_18_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/1.gif',
                idMaps: [707],
                htmlMultiGlow: ['.shop-wrapper>.shop-content>.finalize-button'],
                //htmlPosition: '.border-window:has(.content:has(.inner-content:has(.shop-wrapper)))',
                htmlPosition: '.border-window:has(.content):has(.inner-content):has(.shop-wrapper)',
                minLevel: 10,
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire18,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            19: [{
                textPc: 't_19_ni_pl',
                textMobile: 't_19_ni_mobile_pl',

                headerPc: "t_header_19_ni_pl",
                headerMobile: "t_header_19_ni_pl",


                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/4.gif',
                htmlPosition: '.interface-layer>.right-column.main-column',
                minLevel: 5,
                maxLevel: 20,
                idMaps: [707, 1540, 1508, 1835, 4732],
                itemsNeed: {
                    htmlMultiGlow: true,
                    items: {
                        [ProfData.WARRIOR]: {
                            16: {
                                loc: 'g',
                                tpl: 31946
                            }
                        },
                        [ProfData.PALADIN]: {
                            16: {
                                loc: 'g',
                                tpl: 31946
                            }
                        },
                        [ProfData.MAGE]: {
                            16: {
                                loc: 'g',
                                tpl: 31946
                            }
                        },
                        [ProfData.TRACKER]: {
                            16: {
                                loc: 'g',
                                tpl: 31946
                            }
                        },
                        [ProfData.HUNTER]: {
                            16: {
                                loc: 'g',
                                tpl: 31946
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            16: {
                                loc: 'g',
                                tpl: 31946
                            }
                        },
                    },
                    //stats: {
                    //	leczy: true
                    //}
                },
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire19,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            20: [{
                textPc: 't_20_ni_pl',
                textMobile: 't_20_ni_mobile_pl',

                headerPc: "t_header_20_ni_pl",
                headerMobile: "t_header_20_ni_pl",


                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/3.gif',
                htmlMultiGlow: ['.main-buttons-container>.widget-drag-item-icon', '.widget-button.widget-in-interface-bar.widget-drag-item-icon'],
                htmlPosition: '.interface-layer>.right-column.main-column',
                minLevel: 10,
                idMaps: [3969],
                canvasMultiGlow: {
                    list: [{
                        kind: TutorialData.TYPE_OBJECT.GROUND_ITEM_COLLECTIONS,
                        szablon: 441
                    }]
                },
                itemsNeed: {
                    items: {
                        [ProfData.WARRIOR]: {
                            20: {
                                loc: 'm'
                            }
                        },
                        [ProfData.PALADIN]: {
                            20: {
                                loc: 'm'
                            }
                        },
                        [ProfData.MAGE]: {
                            20: {
                                loc: 'm'
                            }
                        },
                        [ProfData.TRACKER]: {
                            20: {
                                loc: 'm'
                            }
                        },
                        [ProfData.HUNTER]: {
                            20: {
                                loc: 'm'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            20: {
                                loc: 'm'
                            }
                        },

                    },
                    stats: {
                        szablon: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 441]
                    }
                },
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            21: [{
                textPc: 't_21_ni_pl',
                textMobile: 't_21_ni_mobile_pl',

                headerPc: "t_header_21_ni_pl",
                headerMobile: "t_header_21_ni_pl",


                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/4.gif',
                htmlPosition: '.interface-layer>.right-column.main-column',
                minLevel: 10,
                idMaps: [707],
                itemsNeed: {
                    htmlMultiGlow: true,
                    items: {
                        [ProfData.WARRIOR]: {
                            27: {
                                loc: 'g'
                            }
                        },
                        [ProfData.PALADIN]: {
                            27: {
                                loc: 'g'
                            }
                        },
                        [ProfData.MAGE]: {
                            27: {
                                loc: 'g'
                            }
                        },
                        [ProfData.TRACKER]: {
                            27: {
                                loc: 'g'
                            }
                        },
                        [ProfData.HUNTER]: {
                            27: {
                                loc: 'g'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            27: {
                                loc: 'g'
                            }
                        },

                    },
                    stats: {
                        //recipe:['n==', 595]
                        recipe: true
                    }
                },
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            22: [{
                textPc: 't_22_ni_pl',
                textMobile: 't_22_ni_mobile_pl',

                headerPc: "t_header_22_ni_pl",
                headerMobile: "t_header_22_ni_pl",


                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/1.gif',
                htmlPosition: '.widget-button:has(.icon.photo)',
                htmlMultiGlow: ['.widget-button>.icon.photo'],
                minLevel: 10,
                idMaps: [707],
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire22,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            23: [{
                textPc: 't_23_ni_pl',
                textMobile: 't_23_ni_mobile_pl',

                headerPc: "t_header_23_ni_pl",
                headerMobile: "t_header_23_ni_pl",


                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/1.gif',
                //htmlPosition: '.border-window:has(.content:has(.inner-content:has(.recipes-manager)))',
                htmlPosition: '.border-window:has(.content):has(.inner-content):has(.recipes-manager)',
                htmlMultiGlow: ['.items-list>.divide-list-group>.group-list>.crafting-recipe-in-list.enabled'],
                minLevel: 10,
                idMaps: [707],
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire23,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            24: [{
                textPc: 't_24_ni_pl',
                textMobile: 't_24_ni_mobile_pl',

                headerPc: "t_header_24_ni_pl",
                headerMobile: "t_header_24_ni_pl",


                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/1.gif',
                //htmlPosition: '.border-window:has(.content:has(.inner-content:has(.recipes-manager)))',
                htmlPosition: '.border-window:has(.content):has(.inner-content):has(.recipes-manager)',
                htmlMultiGlow: ['.use-recipe-btn>.button'],
                itemsNeed: {
                    items: {
                        [ProfData.WARRIOR]: {
                            15: {
                                loc: 'g'
                            }
                        },
                        [ProfData.PALADIN]: {
                            15: {
                                loc: 'g'
                            }
                        },
                        [ProfData.MAGE]: {
                            15: {
                                loc: 'g'
                            }
                        },
                        [ProfData.TRACKER]: {
                            15: {
                                loc: 'g'
                            }
                        },
                        [ProfData.HUNTER]: {
                            15: {
                                loc: 'g'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            15: {
                                loc: 'g'
                            }
                        }

                    },
                    stats: {
                        capacity: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 5],
                        cansplit: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 0],
                        quest: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 1723]
                    }
                },
                additionalRequireFunction: self.checkAdditionalTutorialRequire24,
                minLevel: 10,
                idMaps: [707],
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            25: [{
                textPc: 't_25_ni_pl',
                textMobile: 't_25_ni_mobile_pl',

                headerPc: "t_header_25_ni_pl",
                headerMobile: "t_header_25_ni_pl",


                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/10.gif',
                htmlPosition: '.mAlert-layer>.mAlert',
                htmlMultiGlow: ['.mAlert-layer>.mAlert>.content>.window-controlls>.alert-accept-hotkey'],
                itemsNeed: {
                    items: {
                        [ProfData.WARRIOR]: {
                            15: {
                                loc: 'g'
                            }
                        },
                        [ProfData.PALADIN]: {
                            15: {
                                loc: 'g'
                            }
                        },
                        [ProfData.MAGE]: {
                            15: {
                                loc: 'g'
                            }
                        },
                        [ProfData.TRACKER]: {
                            15: {
                                loc: 'g'
                            }
                        },
                        [ProfData.HUNTER]: {
                            15: {
                                loc: 'g'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            15: {
                                loc: 'g'
                            }
                        }

                    },
                    stats: {
                        capacity: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 5],
                        cansplit: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 0],
                        quest: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 1723]
                    }
                },
                additionalRequireFunction: self.checkAdditionalTutorialRequire25,
                minLevel: 10,
                idMaps: [707],
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            26: [{
                textPc: 't_26_ni_pl',
                textMobile: 't_26_ni_mobile_pl',

                headerPc: "t_header_26_ni_pl",
                headerMobile: "t_header_26_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/11.gif',
                //htmlPosition: '.content:has(.inner-content:has(.recipes-manager)) ~ .close-button-corner-decor>.close-button',
                //htmlMultiGlow: ['.content:has(.inner-content:has(.recipes-manager)) ~ .close-button-corner-decor>.close-button'],
                htmlPosition: '.content:has(.inner-content):has(.recipes-manager) ~ .close-button-corner-decor>.close-button',
                htmlMultiGlow: ['.content:has(.inner-content):has(.recipes-manager) ~ .close-button-corner-decor>.close-button'],
                itemsNeed: {
                    items: {
                        [ProfData.WARRIOR]: {
                            16: {
                                loc: 'g'
                            }
                        },
                        [ProfData.PALADIN]: {
                            16: {
                                loc: 'g'
                            }
                        },
                        [ProfData.MAGE]: {
                            16: {
                                loc: 'g'
                            }
                        },
                        [ProfData.TRACKER]: {
                            16: {
                                loc: 'g'
                            }
                        },
                        [ProfData.HUNTER]: {
                            16: {
                                loc: 'g'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            16: {
                                loc: 'g'
                            }
                        }

                    },
                    stats: {
                        leczy: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 200],
                        capacity: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 20],
                        cansplit: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 1]
                    }
                },
                additionalRequireFunction: self.checkAdditionalTutorialRequire26,
                minLevel: 10,
                idMaps: [707],
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            27: [{
                textPc: 't_27_ni_pl',
                textMobile: 't_27_ni_mobile_pl',

                headerPc: "t_header_27_ni_pl",
                headerMobile: "t_header_27_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/1.gif',
                htmlPosition: '.barter-content>.bottom-row-panel>.do-recipe>.button',
                //htmlMultiGlow: ['.barter-offer-1616>.action>.action-wrapper>.button>.label'],
                htmlMultiGlow: ['.barter-content>.bottom-row-panel>.do-recipe>.button.green'],
                minLevel: 10,
                maxLevel: 20,
                idMaps: [368],
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire27, //xD instead itemsNeed
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            28: [{
                textPc: 't_28_ni_pl',
                textMobile: 't_28_ni_mobile_pl',

                headerPc: "t_header_28_ni_pl",
                headerMobile: "t_header_28_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/10.gif',
                htmlPosition: '.mAlert-layer>.mAlert',
                htmlMultiGlow: ['.mAlert-layer>.mAlert>.content>.window-controlls>.alert-accept-hotkey'],
                minLevel: 10,
                maxLevel: 20,
                idMaps: [368],
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire27, //xD instead itemsNeed
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            29: [{
                textPc: 't_29_ni_pl',
                textMobile: 't_29_ni_mobile_pl',

                headerPc: "t_header_29_ni_pl",
                headerMobile: "t_header_29_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/1.gif',
                //htmlPosition: '.border-window:has(.content:has(.inner-content:has(.shop-wrapper)))',
                htmlPosition: '.border-window:has(.content):has(.inner-content):has(.shop-wrapper)',
                //htmlMultiGlow: ['.shop-wrapper>.shop-content>.great-merchamp>.btn-num:first'],
                htmlFocus: '.shop-wrapper>.shop-content>.great-merchamp>.btn-num:first',
                minLevel: 10,
                maxLevel: 20,
                idMaps: [368],
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            30: [{
                textPc: 't_30_ni_pl',
                textMobile: 't_30_ni_mobile_pl',

                headerPc: "t_header_30_ni_pl",
                headerMobile: "t_header_30_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/1.gif',
                //htmlPosition:'.border-window:has(.content:has(.inner-content:has(.shop-wrapper)))',
                htmlPosition: '.shop-wrapper>.shop-content>.finalize-button',
                htmlMultiGlow: ['.shop-wrapper>.shop-content>.finalize-button'],
                minLevel: 10,
                maxLevel: 20,
                idMaps: [368],
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            31: [{
                textPc: 't_31_ni_pl',
                textMobile: 't_31_ni_mobile_pl',

                headerPc: "t_header_31_ni_pl",
                headerMobile: "t_header_31_ni_pl",

                //mobileAddClass: HIDDEN_WINDOW,

                itemsNeed: {
                    htmlMultiGlow: true,
                    tpls: {
                        [ProfData.WARRIOR]: {
                            15: {
                                loc: 'n',
                                tpl: 34279
                            }
                        },
                        [ProfData.PALADIN]: {
                            15: {
                                loc: 'n',
                                tpl: 34279
                            }
                        },
                        [ProfData.MAGE]: {
                            15: {
                                loc: 'n',
                                tpl: 34279
                            }
                        },
                        [ProfData.TRACKER]: {
                            15: {
                                loc: 'n',
                                tpl: 34279
                            }
                        },
                        [ProfData.HUNTER]: {
                            15: {
                                loc: 'n',
                                tpl: 34279
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            15: {
                                loc: 'n',
                                tpl: 34279
                            }
                        }
                    }
                },

                graphic: '/img/gui/newTutorial/1.gif',
                htmlMultiGlow: ['.inner-content>.shop-wrapper>.shop-content>.buy-items'],
                //htmlPosition: '.border-window:has(.content:has(.inner-content:has(.shop-wrapper)))',
                htmlPosition: '.border-window:has(.content):has(.inner-content):has(.shop-wrapper)',
                minLevel: 6,
                maxLevel: 20,
                idMaps: [707],
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            32: [{
                textPc: 't_32_ni_pl',
                textMobile: 't_32_ni_mobile_pl',

                headerPc: "t_header_32_ni_pl",
                headerMobile: "t_header_32_ni_pl",

                //mobileAddClass: HIDDEN_WINDOW,

                itemsNeed: {
                    htmlMultiGlow: true,
                    tpls: {
                        [ProfData.WARRIOR]: {
                            15: {
                                loc: 'n',
                                tpl: 34279
                            }
                        },
                        [ProfData.PALADIN]: {
                            15: {
                                loc: 'n',
                                tpl: 34279
                            }
                        },
                        [ProfData.MAGE]: {
                            15: {
                                loc: 'n',
                                tpl: 34279
                            }
                        },
                        [ProfData.TRACKER]: {
                            15: {
                                loc: 'n',
                                tpl: 34279
                            }
                        },
                        [ProfData.HUNTER]: {
                            15: {
                                loc: 'n',
                                tpl: 34279
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            15: {
                                loc: 'n',
                                tpl: 34279
                            }
                        }
                    }
                },

                graphic: '/img/gui/newTutorial/1.gif',
                htmlMultiGlow: ['.shop-wrapper>.shop-content>.finalize-button'],
                //htmlPosition: '.border-window:has(.content:has(.inner-content:has(.shop-wrapper)))',
                htmlPosition: '.border-window:has(.content):has(.inner-content):has(.shop-wrapper)',
                minLevel: 6,
                maxLevel: 20,
                idMaps: [707],
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire32,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }],
            33: [{
                textPc: 't_33_ni_pl',
                textMobile: 't_33_ni_mobile_pl',

                headerPc: "t_header_33_ni_pl",
                headerMobile: "t_header_33_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                itemsNeed: {
                    htmlMultiGlow: true,
                    items: {
                        //[ProfData.WARRIOR]: {24: {loc: 'g', amount:2}},
                        //[ProfData.PALADIN]: {24: {loc: 'g', amount:2}},
                        //[ProfData.MAGE]: {24: {loc: 'g', amount:2}},
                        //[ProfData.TRACKER]: {24: {loc: 'g', amount:2}},
                        //[ProfData.HUNTER]: {24: {loc: 'g', amount:2}},
                        //[ProfData.BLADE_DANCER]: {24: {loc: 'g', amount:2}}


                        [ProfData.WARRIOR]: {
                            24: {
                                loc: 'g',
                                tpl: 25364
                            }
                        },
                        [ProfData.PALADIN]: {
                            24: {
                                loc: 'g',
                                tpl: 25364
                            }
                        },
                        [ProfData.MAGE]: {
                            24: {
                                loc: 'g',
                                tpl: 25364
                            }
                        },
                        [ProfData.TRACKER]: {
                            24: {
                                loc: 'g',
                                tpl: 25364
                            }
                        },
                        [ProfData.HUNTER]: {
                            24: {
                                loc: 'g',
                                tpl: 25364
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            24: {
                                loc: 'g',
                                tpl: 25364
                            }
                        }


                    },
                    minOneOfAllNotEquip: true
                },

                graphic: '/img/gui/newTutorial/12.gif',
                htmlMultiGlow: ['.game-window-positioner>.interface-layer>.right-column>.inner-wrapper>.inventory_wrapper>.bags-navigation>.tutorial-bag'],
                htmlPosition: '.interface-layer>.right-column.main-column',
                minLevel: 10,
                maxLevel: 20,
                idMaps: [707],
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
                //additionalRequireFunction: self.checkAdditionalTutorialRequire32,
            }],
            34: [{
                textPc: 't_34_ni_pl',
                textMobile: 't_34_ni_mobile_pl',

                headerPc: "t_header_34_ni_pl",
                headerMobile: "t_header_34_ni_pl",

                mobileAddClass: HIDDEN_WINDOW,

                graphic: '/img/gui/newTutorial/1.gif',
                htmlPosition: '.barter-window',
                //htmlMultiGlow: ['.barter-offer-1616>.action>.action-wrapper>.button>.label'],
                htmlMultiGlow: ['.offer-id-1616'],
                minLevel: 10,
                maxLevel: 20,
                //idMaps: [707], 707 do testï¿½w, ale docelowo bï¿½dzie na 368, dlatego jeï¿½li moï¿½na od tego nie uzaleï¿½niaï¿½ to nie uzaleï¿½niajmy.
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire34, //xD instead itemsNeed
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn
            }]
        }
    }
};

//
// if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
//     module.exports = PLDataTutorial;
// else
//     window.PLDataTutorial = PLDataTutorial;