let ProfData = require('core/characters/ProfData');
var TutorialData = require('core/tutorial/TutorialData');
var SkillsData = require('core/skills/SkillsData');

module.exports = function() {

    let self = this;

    let eqcolumnshow = 'eqcolumnshow';
    let quickFightNearMobHotkey = 'autofightNearMob';

    let eqcolumnshowWidget = 'eq-show-icon';
    let quickFightWidget = 'auto-fight-near-mob';


    this.init = () => {
        this.addEnDataToList();
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


    this.checkAdditionalTutorialRequire9 = (id, data) => {
        return !Engine.npcs.check()[131703]
    };

    this.checkFullFill14 = (item) => {
        return item.tpl == 22616;
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
        let r = Engine.crafting.recipes
        let $b = $('.recipes-manager .use-recipe-btn .button');
        return r && r.getShowId() == 804 && $b && !$b.hasClass('black');
    };

    this.checkAdditionalTutorialRequire25 = (id, data) => {
        return Engine.crafting.recipes;
    };

    this.checkAdditionalTutorialRequire26 = (id, data) => {
        return Engine.crafting.recipes;
    };

    this.checkAdditionalTutorialRequire27 = (id, data) => {
        return !($('.group-list>.offer-id-1890.disabled').length) && $('.barter-content>.bottom-row-panel>.do-recipe>.button.green').length;
    };

    this.checkAdditionalTutorialRequire34 = (id, data) => {
        return !($('.group-list>.offer-id-1890.disabled').length);
    };

    this.checkAdditionalTutorialRequire32 = (id) => {
        return Engine.tutorialManager.itemsInBasket(31);
    };

    this.checkFullFill19 = (id) => {
        return Engine.hero.d.warrior_stats.hp / Engine.hero.d.warrior_stats.maxhp > 0.5;
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
                    quest: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 703],
                    amount: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 6],
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

    this.checkCanFinish = (id, data) => {
        let dataFromList = Engine.tutorialManager.getDataFromList(id);
        switch (id) {
            case 30:
            case 31:
            case 32:
            case 33:
            case 53:
            case 0:
                return true;
            case 1:
                return Engine.tutorialManager.checkIsMoveTutorial();
            case 2:
                return Engine.tutorialManager.checkIsSameNpc(data, dataFromList.canvasMultiGlow.list[0].id);
            case 3:
                return Engine.tutorialManager.needItemsTest(Engine.tutorialManager.getDataFromList(5));
            case 4:
                //return Engine.tutorialManager.checkIsSameNpc(data,  dataFromList.canvasMultiGlow.list[0].id);
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
                return Engine.tutorialManager.checkIsSameNpc(data, dataFromList.canvasMultiGlow.list[0].id); // to fix
            case 11:
                return Engine.tutorialManager.itemIsLootbox(data);
            case 12:
                // return Engine.tutorialManager.needItemsTest({
                // 	itemsNeed: {
                // 		items: {
                // 			[ProfData.WARRIOR]: {10: {loc: 'g'}, 17: {loc: 'g'}},
                // 			[ProfData.PALADIN]: {10: {loc: 'g'}, 17: {loc: 'g'}},
                // 			[ProfData.MAGE]: {10: {loc: 'g'}, 17: {loc: 'g'}},
                // 			[ProfData.TRACKER]: {10: {loc: 'g'}, 17: {loc: 'g'}},
                // 			[ProfData.HUNTER]: {10: {loc: 'g'}, 17: {loc: 'g'}},
                // 			[ProfData.BLADE_DANCER]: {10: {loc: 'g'}, 17: {loc: 'g'}},
                // 		}
                // 	},
                // });

                return true;
            case 13:
                return Engine.tutorialManager.needItemsTest({
                    itemsNeed: {
                        items: {
                            [ProfData.WARRIOR]: {
                                10: {
                                    loc: 'g'
                                }
                            },
                            [ProfData.PALADIN]: {
                                10: {
                                    loc: 'g'
                                }
                            },
                            [ProfData.MAGE]: {
                                10: {
                                    loc: 'g'
                                }
                            },
                            [ProfData.TRACKER]: {
                                10: {
                                    loc: 'g'
                                }
                            },
                            [ProfData.HUNTER]: {
                                10: {
                                    loc: 'g'
                                }
                            },
                            [ProfData.BLADE_DANCER]: {
                                10: {
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
                return this.checkFullFill14(data);
            case 15:
                return true;
            case 16:
                return Engine.tutorialManager.itemIsLootbox(data);
            case 17:
                return Engine.tutorialManager.itemsInBasket(17);
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
            case 34:
                return true;
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

    this.addEnDataToList = () => {

        Engine.tutorialManager.list.en = { // 2340
            53: [{
                textPc: 't_53_ni_pl',
                textMobile: 't_53_ni_pl',

                headerPc: "movement_header_ni",
                headerMobile: "mobile_53_tutorial",

                idMaps: [3877],
                graphic: '/img/gui/newTutorial/0_eng.png',
                //click: {txt: 'Zaczynamy', clb:self.goToTutorial1},
                click: {
                    txt: 'Start!',
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

                graphic: '/img/gui/newTutorial/6_eng.gif',
                idMaps: [3877],
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
            }],
            2: [{
                textPc: 't_2_ni_pl',
                textMobile: 't_2_ni_mobile_pl',

                headerPc: "t_header_2_ni_pl",
                headerMobile: "t_header_2_ni_pl",

                graphic: '/img/gui/newTutorial/8_eng.gif',
                //htmlFocus: '.echh-layer',
                canvasMultiGlow: {
                    list: [{
                        kind: TutorialData.TYPE_OBJECT.NPC,
                        id: 113018
                    }]
                },
                //canvasFocus: {
                //	kind: 'npc',
                //	id: 113018
                //},
                canvasPosition: {
                    kind: TutorialData.TYPE_OBJECT.NPC,
                    id: 113018
                },
                htmlMultiGlow: ['.widget-in-interface-bar.widget-npc-talk-icon'],
                blink: true,
                idMaps: [3877],
                additionalRequireFunction: self.checkAdditionalTutorialRequire2,
            }],
            3: [{
                textPc: 't_3_ni_pl',
                textMobile: 't_3_ni_mobile_pl',

                headerPc: "t_header_3_ni_pl",
                headerMobile: "t_header_3_ni_pl",

                graphic: '/img/gui/newTutorial/4_eng.gif',
                htmlFocus: '.interface-layer>.right-column.main-column',
                htmlPosition: '.interface-layer>.right-column.main-column',
                htmlMultiGlow: ['.character_wrapper>.equipment-wrapper>[data-st=5]', '.character_wrapper>.equipment-wrapper>[data-st=6]', '.character_wrapper>.equipment-wrapper>[data-st=7]'],
                blink: true,
                idMaps: [3877],
                itemsNeed: {
                    htmlMultiGlow: true,
                    items: {
                        [ProfData.WARRIOR]: {
                            8: {
                                loc: 'g'
                            },
                            1: {
                                loc: 'g'
                            },
                            14: {
                                loc: 'g'
                            }
                        },
                        [ProfData.PALADIN]: {
                            8: {
                                loc: 'g'
                            },
                            1: {
                                loc: 'g'
                            },
                            14: {
                                loc: 'g'
                            }
                        },
                        [ProfData.MAGE]: {
                            8: {
                                loc: 'g'
                            },
                            6: {
                                loc: 'g'
                            },
                            5: {
                                loc: 'g'
                            }
                        },
                        [ProfData.TRACKER]: {
                            8: {
                                loc: 'g'
                            },
                            4: {
                                loc: 'g'
                            },
                            21: {
                                loc: 'g'
                            }
                        },
                        [ProfData.HUNTER]: {
                            8: {
                                loc: 'g'
                            },
                            4: {
                                loc: 'g'
                            },
                            21: {
                                loc: 'g'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            8: {
                                loc: 'g'
                            },
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
            5: [{
                textPc: 't_5_ni_pl',
                textMobile: 't_5_ni_mobile_pl',

                headerPc: "t_header_5_ni_pl",
                headerMobile: "t_header_5_ni_pl",

                //htmlPosition: '.border-window:has(.content:has(.quest-observe-window))',
                //htmlMultiGlow: ['.border-window:has(.content:has(.quest-observe-window))'],
                graphic: '/img/gui/newTutorial/7_eng.gif',
                //htmlFocus: '.echh-layer',
                canvasMultiGlow: {
                    list: [{
                        kind: TutorialData.TYPE_OBJECT.NPC,
                        id: 131714
                    }]
                },

                htmlPosition: '.omg-tutorial-handler',
                itemsNeed: {
                    htmlMultiGlow: true,
                    items: {
                        [ProfData.WARRIOR]: {
                            8: {
                                loc: 'g'
                            },
                            1: {
                                loc: 'g'
                            },
                            14: {
                                loc: 'g'
                            }
                        },
                        [ProfData.PALADIN]: {
                            8: {
                                loc: 'g'
                            },
                            1: {
                                loc: 'g'
                            },
                            14: {
                                loc: 'g'
                            }
                        },
                        [ProfData.MAGE]: {
                            8: {
                                loc: 'g'
                            },
                            6: {
                                loc: 'g'
                            },
                            5: {
                                loc: 'g'
                            }
                        },
                        [ProfData.TRACKER]: {
                            8: {
                                loc: 'g'
                            },
                            4: {
                                loc: 'g'
                            },
                            21: {
                                loc: 'g'
                            }
                        },
                        [ProfData.HUNTER]: {
                            8: {
                                loc: 'g'
                            },
                            4: {
                                loc: 'g'
                            },
                            21: {
                                loc: 'g'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            8: {
                                loc: 'g'
                            },
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
                hasQuestId: 767,
                minLevel: 2,
                htmlMultiGlow: ['.widget-button.widget-in-interface-bar.widget-attack-near-mob'],
                blink: true,
                blockedHotKeys: [quickFightNearMobHotkey],
                blockedWidget: [quickFightWidget],
                idMaps: [3877],
            }],
            6: [{
                textPc: 't_6_ni_pl',
                textMobile: 't_6_ni_mobile_pl',

                headerPc: "t_header_6_ni_pl",
                headerMobile: "t_header_6_ni_pl",

                graphic: '/img/gui/newTutorial/5_eng.gif',
                idMaps: [3877],
                //htmlFocus: '.skill-usable-slot:has(.battle-skill:has(.' + self.getNormalAttackIcon() + '))',
                //htmlPosition: '.skill-usable-slot:has(.battle-skill:has(.' + self.getNormalAttackIcon() + '))',
                htmlFocus: '.skill-usable-slot:has(.battle-skill):has(.' + self.getNormalAttackIcon() + ')',
                htmlPosition: '.skill-usable-slot:has(.battle-skill):has(.' + self.getNormalAttackIcon() + ')',
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire6,
            }],
            7: [{
                textPc: 't_7_ni_pl',
                textMobile: 't_7_ni_mobile_pl',

                headerPc: "t_header_7_ni_pl",
                headerMobile: "t_header_7_ni_pl",

                graphic: '/img/gui/newTutorial/5_eng.gif',
                idMaps: [3877],
                // htmlMultiGlow: ['.skill-usable-slot:has(.battle-skill:has(.icon--1))'],
                // htmlPosition: '.skill-usable-slot:has(.battle-skill:has(.icon--1))',
                htmlMultiGlow: ['.skill-usable-slot:has(.battle-skill):has(.' + self.getNormalAttackIcon() + ')'],
                htmlPosition: '.skill-usable-slot:has(.battle-skill):has(.' + self.getNormalAttackIcon() + ')',
                blink: true
            }, ],
            8: [{
                textPc: 't_8_ni_pl',
                textMobile: 't_8_ni_mobile_pl',

                headerPc: "t_header_8_ni_pl",
                headerMobile: "t_header_8_ni_pl",

                graphic: '/img/gui/newTutorial/9_eng.gif',
                htmlFocus: '.close-battle-ground',
                htmlPosition: '.close-battle-ground',
                idMaps: [3877],
                blink: true,
            }],
            9: [{
                textPc: 't_9_ni_pl',
                textMobile: 't_9_ni_mobile_pl',

                headerPc: "t_header_9_ni_pl",
                headerMobile: "t_header_9_ni_pl",

                graphic: '/img/gui/newTutorial/8_eng.gif',
                idMaps: [3877],
                //htmlPosition: '.border-window:has(.content:has(.quest-observe-window))',
                //htmlMultiGlow: ['.border-window:has(.content:has(.quest-observe-window))'],
                htmlPosition: self.getQuestObserve(),
                htmlMultiGlow: [self.getQuestObserve()],
                canvasMultiGlow: {
                    list: [{
                        kind: TutorialData.TYPE_OBJECT.NPC,
                        id: 131717
                    }]
                },
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire9,
            }],
            11: [{
                textPc: 't_11_ni_pl',
                textMobile: 't_11_ni_mobile_pl',

                headerPc: "t_header_11_ni_pl",
                headerMobile: "t_header_11_ni_pl",

                graphic: '/img/gui/newTutorial/4_eng.gif',
                idMaps: [3877],
                minLevel: 5,
                //htmlFocus: '.inventory_wrapper>.inventory-grid-bg',
                htmlFocus: '.interface-layer>.right-column.main-column',
                htmlPosition: '.inventory_wrapper>.inventory-grid-bg',
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
                        lvl: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 5]
                    }
                },
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            12: [{
                textPc: 't_12_ni_pl',
                textMobile: 't_12_ni_mobile_pl',

                headerPc: "t_header_12_ni_pl",
                headerMobile: "t_header_12_ni_pl",

                graphic: '/img/gui/newTutorial/1.gif',
                idMaps: [3877],
                htmlFocus: '.bottom-wrapper>.table-wrapper>.accept-button>.button',
                //htmlPosition: '.border-window:has(.content:has(.inner-content:has(.loot-window)))',
                htmlPosition: '.border-window:has(.content):has(.inner-content):has(.loot-window)',
                itemsNeed: {
                    items: {
                        [ProfData.WARRIOR]: {
                            10: {
                                loc: 'l'
                            },
                            17: {
                                loc: 'l'
                            }
                        },
                        [ProfData.PALADIN]: {
                            10: {
                                loc: 'l'
                            },
                            17: {
                                loc: 'l'
                            }
                        },
                        [ProfData.MAGE]: {
                            10: {
                                loc: 'l'
                            },
                            17: {
                                loc: 'l'
                            }
                        },
                        [ProfData.TRACKER]: {
                            10: {
                                loc: 'l'
                            },
                            17: {
                                loc: 'l'
                            }
                        },
                        [ProfData.HUNTER]: {
                            10: {
                                loc: 'l'
                            },
                            17: {
                                loc: 'l'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            10: {
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
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            13: [{
                textPc: 't_13_ni_pl',
                textMobile: 't_13_ni_mobile_pl',

                headerPc: "t_header_13_ni_pl",
                headerMobile: "t_header_13_ni_pl",

                graphic: '/img/gui/newTutorial/4_eng.gif',
                idMaps: [3877],
                htmlFocus: '.interface-layer>.right-column.main-column',
                htmlPosition: '.interface-layer>.right-column.main-column',
                htmlMultiGlow: ['.character_wrapper>.equipment-wrapper>[data-st=8]'],
                itemsNeed: {
                    htmlMultiGlow: true,
                    items: {
                        [ProfData.WARRIOR]: {
                            10: {
                                loc: 'g'
                            }
                        },
                        [ProfData.PALADIN]: {
                            10: {
                                loc: 'g'
                            }
                        },
                        [ProfData.MAGE]: {
                            10: {
                                loc: 'g'
                            }
                        },
                        [ProfData.TRACKER]: {
                            10: {
                                loc: 'g'
                            }
                        },
                        [ProfData.HUNTER]: {
                            10: {
                                loc: 'g'
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            10: {
                                loc: 'g'
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
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            14: [{
                textPc: 't_14_ni_pl',
                textMobile: 't_14_ni_mobile_pl',

                headerPc: "t_header_14_ni_pl",
                headerMobile: "t_header_14_ni_pl",

                graphic: '/img/gui/newTutorial/4_eng.gif',
                idMaps: [3877],
                htmlFocus: '.interface-layer>.right-column.main-column',
                htmlPosition: '.interface-layer>.right-column.main-column',
                //htmlMultiGlow: ['.character_wrapper>.equipment-wrapper', '.inventory_wrapper>.bags-navigation'],
                itemsNeed: {
                    htmlMultiGlow: true,
                    items: {
                        [ProfData.WARRIOR]: {
                            17: {
                                loc: 'g',
                                tpl: 22616
                            }
                        },
                        [ProfData.PALADIN]: {
                            17: {
                                loc: 'g',
                                tpl: 22616
                            }
                        },
                        [ProfData.MAGE]: {
                            17: {
                                loc: 'g',
                                tpl: 22616
                            }
                        },
                        [ProfData.TRACKER]: {
                            17: {
                                loc: 'g',
                                tpl: 22616
                            }
                        },
                        [ProfData.HUNTER]: {
                            17: {
                                loc: 'g',
                                tpl: 22616
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            17: {
                                loc: 'g',
                                tpl: 22616
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
            }],
            15: [{
                textPc: 't_15_ni_pl',
                textMobile: 't_15_ni_mobile_pl',

                headerPc: "t_header_15_ni_pl",
                headerMobile: "t_header_15_ni_pl",

                graphic: '/img/gui/newTutorial/3.gif',
                idMaps: [3987],
                //htmlMultiGlow: [
                //	'.border-window:has(.content:has(.quest-observe-window))',
                //	'.widget-button.widget-in-interface-bar.widget-auto-fight-near-mob'
                //],
                htmlMultiGlow: [
                    self.getQuestObserve(),
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
                graphic: '/img/gui/newTutorial/4.gif',
                htmlFocus: '.interface-layer>.right-column.main-column',
                htmlPosition: '.interface-layer>.right-column.main-column',
                //htmlMultiGlow: ['.character_wrapper>.equipment-wrapper', '.inventory_wrapper>.bags-navigation'],
                idMaps: [3881],
                itemsNeed: {
                    htmlMultiGlow: true,
                    items: {
                        [ProfData.WARRIOR]: {
                            16: {
                                loc: 'g',
                                tpl: 22624
                            }
                        },
                        [ProfData.PALADIN]: {
                            16: {
                                loc: 'g',
                                tpl: 22624
                            }
                        },
                        [ProfData.MAGE]: {
                            16: {
                                loc: 'g',
                                tpl: 22624
                            }
                        },
                        [ProfData.TRACKER]: {
                            16: {
                                loc: 'g',
                                tpl: 22624
                            }
                        },
                        [ProfData.HUNTER]: {
                            16: {
                                loc: 'g',
                                tpl: 22624
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            16: {
                                loc: 'g',
                                tpl: 22624
                            }
                        },
                    }
                },
                minLevel: 6,
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            17: [{
                textPc: 't_17_ni_pl',
                textMobile: 't_17_ni_mobile_pl',

                headerPc: "t_header_17_ni_pl",
                headerMobile: "t_header_17_ni_pl",

                graphic: '/img/gui/newTutorial/1.gif',
                idMaps: [3987],
                itemsNeed: {
                    htmlMultiGlow: true,
                    tpls: {
                        [ProfData.PALADIN]: {
                            11: {
                                loc: 'n',
                                tpl: 19112
                            },
                            16: {
                                loc: 'n',
                                tpl: 19050
                            },
                            9: {
                                loc: 'n',
                                tpl: 19113
                            }
                        },
                        [ProfData.WARRIOR]: {
                            11: {
                                loc: 'n',
                                tpl: 19112
                            },
                            16: {
                                loc: 'n',
                                tpl: 19050
                            },
                            9: {
                                loc: 'n',
                                tpl: 19113
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            11: {
                                loc: 'n',
                                tpl: 19112
                            },
                            16: {
                                loc: 'n',
                                tpl: 19050
                            },
                            9: {
                                loc: 'n',
                                tpl: 19113
                            }
                        },
                        [ProfData.HUNTER]: {
                            11: {
                                loc: 'n',
                                tpl: 19112
                            },
                            16: {
                                loc: 'n',
                                tpl: 19050
                            },
                            9: {
                                loc: 'n',
                                tpl: 19113
                            }
                        },
                        [ProfData.TRACKER]: {
                            11: {
                                loc: 'n',
                                tpl: 19112
                            },
                            16: {
                                loc: 'n',
                                tpl: 19050
                            },
                            9: {
                                loc: 'n',
                                tpl: 19113
                            }
                        },
                        [ProfData.MAGE]: {
                            11: {
                                loc: 'n',
                                tpl: 19112
                            },
                            16: {
                                loc: 'n',
                                tpl: 19050
                            },
                            9: {
                                loc: 'n',
                                tpl: 19113
                            }
                        },
                    },
                    stats: {
                        lvl: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 6]
                    }
                },
                htmlMultiGlow: ['.inner-content>.shop-wrapper>.shop-content>.buy-items'],
                //htmlPosition: '.border-window:has(.content:has(.inner-content:has(.shop-wrapper)))',
                htmlPosition: '.border-window:has(.content):has(.inner-content):has(.shop-wrapper)',
                minLevel: 6,
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

                graphic: '/img/gui/newTutorial/1.gif',
                idMaps: [3987],
                htmlMultiGlow: ['.shop-wrapper>.shop-content>.finalize-button'],
                //htmlPosition: '.border-window:has(.content:has(.inner-content:has(.shop-wrapper)))',
                htmlPosition: '.border-window:has(.content):has(.inner-content):has(.shop-wrapper)',
                minLevel: 6,
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire18,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            19: [{
                textPc: 't_19_ni_pl',
                textMobile: 't_19_ni_mobile_pl',

                headerPc: "t_header_19_ni_pl",
                headerMobile: "t_header_19_ni_pl",

                graphic: '/img/gui/newTutorial/4_eng.gif',
                htmlPosition: '.interface-layer>.right-column.main-column',
                minLevel: 5,
                maxLevel: 20,
                idMaps: [3881],
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
                        fullheal: true
                    }
                },
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire19,
            }],
            20: [{
                textPc: 't_20_ni_pl',
                textMobile: 't_20_ni_mobile_pl',

                headerPc: "t_header_20_ni_pl",
                headerMobile: "t_header_20_ni_pl",

                graphic: '/img/gui/newTutorial/2.gif',
                htmlPosition: '.interface-layer>.right-column.main-column',
                idMaps: [3881],
                canvasMultiGlow: {
                    list: [{
                        kind: 'groundItemCollections',
                        allId: [113101, 113102, 113103, 113104, 113105, 113106, 113107, 113108, 113109, 113110, 113111, 113112, 113113, 113114, 113115]
                    }]
                },
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
                        lvl: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 7]
                    }
                },
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            21: [{
                textPc: 't_21_ni_pl',
                textMobile: 't_21_ni_mobile_pl',

                headerPc: "t_header_21_ni_pl",
                headerMobile: "t_header_21_ni_pl",

                graphic: '/img/gui/newTutorial/4_eng.gif',
                htmlPosition: '.interface-layer>.right-column.main-column',
                minLevel: 7,
                idMaps: [3881],
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
                        recipe: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 804]
                        //recipe: true
                    }
                },
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            22: [{
                textPc: 't_22_ni_pl',
                textMobile: 't_22_ni_mobile_pl',

                headerPc: "t_header_22_ni_pl",
                headerMobile: "t_header_22_ni_pl",

                graphic: '/img/gui/newTutorial/1.gif',
                htmlPosition: '.widget-button:has(.icon.photo)',
                htmlMultiGlow: ['.widget-button>.icon.photo'],
                minLevel: 7,
                idMaps: [3881],
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire22,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            23: [{
                textPc: 't_23_ni_pl',
                textMobile: 't_23_ni_mobile_pl',

                headerPc: "t_header_23_ni_pl",
                headerMobile: "t_header_23_ni_pl",

                graphic: '/img/gui/newTutorial/1.gif',
                //htmlPosition: '.border-window:has(.content:has(.inner-content:has(.recipes-manager)))',
                htmlPosition: '.border-window:has(.content):has(.inner-content):has(.recipes-manager)',
                htmlMultiGlow: ['.items-list>.divide-list-group>.group-list>.crafting-recipe-in-list.enabled'],
                minLevel: 7,
                idMaps: [3881],
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire23,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            24: [{
                textPc: 't_24_ni_pl',
                textMobile: 't_24_ni_mobile_pl',

                headerPc: "t_header_24_ni_pl",
                headerMobile: "t_header_24_ni_pl",

                graphic: '/img/gui/newTutorial/1.gif',
                //htmlPosition: '.border-window:has(.content:has(.inner-content:has(.recipes-manager)))',
                htmlPosition: '.border-window:has(.content):has(.inner-content):has(.recipes-manager)',
                htmlMultiGlow: ['.use-recipe-btn>.button'],
                itemsNeed: {
                    items: {
                        [ProfData.WARRIOR]: {
                            15: {
                                loc: 'g',
                                tpl: 19134
                            }
                        },
                        [ProfData.PALADIN]: {
                            15: {
                                loc: 'g',
                                tpl: 19134
                            }
                        },
                        [ProfData.MAGE]: {
                            15: {
                                loc: 'g',
                                tpl: 19134
                            }
                        },
                        [ProfData.TRACKER]: {
                            15: {
                                loc: 'g',
                                tpl: 19134
                            }
                        },
                        [ProfData.HUNTER]: {
                            15: {
                                loc: 'g',
                                tpl: 19134
                            }
                        },
                        [ProfData.BLADE_DANCER]: {
                            15: {
                                loc: 'g',
                                tpl: 19134
                            }
                        }

                    }
                },
                additionalRequireFunction: self.checkAdditionalTutorialRequire24,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
                minLevel: 7,
                idMaps: [3881],
                blink: true
            }],
            25: [{
                textPc: 't_25_ni_pl',
                textMobile: 't_25_ni_mobile_pl',

                headerPc: "t_header_25_ni_pl",
                headerMobile: "t_header_25_ni_pl",

                graphic: '/img/gui/newTutorial/10_eng.gif',
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
                        capacity: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 1],
                        lvl: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 7],
                        quest: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 767],
                        amount: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 1],
                        cansplit: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 0],
                    }
                },
                additionalRequireFunction: self.checkAdditionalTutorialRequire25,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
                minLevel: 7,
                idMaps: [3881],
                blink: true
            }],
            26: [{
                textPc: 't_26_ni_pl',
                textMobile: 't_26_ni_mobile_pl',

                headerPc: "t_header_26_ni_pl",
                headerMobile: "t_header_26_ni_pl",

                graphic: '/img/gui/newTutorial/11_eng.gif',
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
                        lvl: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 7],
                        fullheal: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 1500],
                        amount: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 1],
                        capacity: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 10],
                        cansplit: [TutorialData.STAT_OPERATION.NUMBER_EQUAL, 0],
                    }
                },
                additionalRequireFunction: self.checkAdditionalTutorialRequire26,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
                minLevel: 7,
                idMaps: [3881],
                blink: true
            }],
            27: [{
                textPc: 't_27_ni_pl',
                textMobile: 't_27_ni_mobile_pl',

                headerPc: "t_header_27_ni_pl",
                headerMobile: "t_header_27_ni_pl",

                graphic: '/img/gui/newTutorial/1.gif',
                htmlPosition: '.barter-content>.bottom-row-panel>.do-recipe>.button',
                //htmlMultiGlow: ['.barter-offer-1616>.action>.action-wrapper>.button>.label'],
                htmlMultiGlow: ['.barter-content>.bottom-row-panel>.do-recipe>.button'],
                minLevel: 7,
                //maxLevel: 20,
                idMaps: [3881],
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire27, //xD instead itemsNeed
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            28: [{
                textPc: 't_28_ni_pl',
                textMobile: 't_28_ni_mobile_pl',

                headerPc: "t_header_28_ni_pl",
                headerMobile: "t_header_28_ni_pl",

                graphic: '/img/gui/newTutorial/10_eng.gif',
                htmlPosition: '.mAlert-layer>.mAlert',
                htmlMultiGlow: ['.mAlert-layer>.mAlert>.content>.window-controlls>.alert-accept-hotkey'],
                minLevel: 7,
                idMaps: [3881],
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire27, //xD instead itemsNeed
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            29: [{
                textPc: 't_29_ni_pl',
                textMobile: 't_29_ni_mobile_pl',

                headerPc: "t_header_29_ni_pl",
                headerMobile: "t_header_29_ni_pl",

                graphic: '/img/gui/newTutorial/1.gif',
                //htmlPosition: '.border-window:has(.content:has(.inner-content:has(.shop-wrapper)))',
                htmlPosition: '.border-window:has(.content):has(.inner-content):has(.shop-wrapper)',
                //htmlMultiGlow: ['.shop-wrapper>.shop-content>.great-merchamp>.btn-num:first'],
                htmlFocus: '.shop-wrapper>.shop-content>.great-merchamp>.btn-num:first',
                minLevel: 7,
                idMaps: [3881],
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            30: [{
                textPc: 't_30_ni_pl',
                textMobile: 't_30_ni_mobile_pl',

                headerPc: "t_header_30_ni_pl",
                headerMobile: "t_header_30_ni_pl",

                graphic: '/img/gui/newTutorial/1.gif',
                //htmlPosition:'.border-window:has(.content:has(.inner-content:has(.shop-wrapper)))',
                htmlPosition: '.shop-wrapper>.shop-content>.finalize-button',
                htmlMultiGlow: ['.shop-wrapper>.shop-content>.finalize-button'],
                minLevel: 7,
                idMaps: [3881],
                blink: true,
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }],
            34: [{
                textPc: 't_34_ni_pl',
                textMobile: 't_34_ni_mobile_pl',

                headerPc: "t_header_34_ni_pl",
                headerMobile: "t_header_34_ni_pl",

                graphic: '/img/gui/newTutorial/1.gif',
                htmlPosition: '.barter-window',
                //htmlMultiGlow: ['.barter-offer-1616>.action>.action-wrapper>.button>.label'],
                htmlMultiGlow: ['.offer-id-1890'],
                minLevel: 7,
                idMaps: [3881],
                //idMaps: [707], 707 do testï¿½w, ale docelowo bï¿½dzie na 368, dlatego jeï¿½li moï¿½na od tego nie uzaleï¿½niaï¿½ to nie uzaleï¿½niajmy.
                blink: true,
                additionalRequireFunction: self.checkAdditionalTutorialRequire34, //xD instead itemsNeed
                blockedWidget: [eqcolumnshowWidget],
                blockedHotKeys: [eqcolumnshow],
                additionalFunctionBeforeCreate: self.manageEqColumn,
            }]
        }
    }
};