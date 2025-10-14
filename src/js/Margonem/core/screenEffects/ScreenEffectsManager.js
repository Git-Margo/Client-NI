let ScreenEffect = require('@core/screenEffects/ScreenEffect.js');
let ScreenEffectData = require('@core/screenEffects/ScreenEffectData.js');
//let RajRandomElements   = require('@core/raj/RajRandomElements');
let RajActionManager = require('@core/raj/rajAction/RajActionManager');
let RajActionData = require('@core/raj/rajAction/RajActionData');

module.exports = function() {

    let screenEffectsList;
    let rajActionManager = null;
    let moduleData = {
        fileName: "ScreenEffectsManager.js"
    };

    const init = () => {
        onClear();
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        const TYPE = RajActionData.TYPE;
        const mode = ScreenEffectData.mode;
        const position = ScreenEffectData.position;

        rajActionManager = new RajActionManager();
        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                removeFunc: removeAction,
                checkExistFunc: checkEffectExist,
                createRequire: {
                    order: {
                        type: TYPE.INT,
                        optional: true
                    },
                    repeat: {
                        type: TYPE.INT_OR_BOOL,
                        optional: true
                    },
                    behavior: {
                        type: TYPE.OBJECT,
                        elementInObject: {
                            list: {
                                type: TYPE.ARRAY,
                                elementInArray: {
                                    mode: {
                                        conditionVal: {
                                            [mode.TRANSITION]: {
                                                color0: {
                                                    type: TYPE.RGBA_COLOR,
                                                    optional: true
                                                },
                                                color1: {
                                                    type: TYPE.RGBA_COLOR,
                                                    optional: true
                                                },
                                                holes: {
                                                    type: TYPE.ARRAY,
                                                    optional: true,
                                                    elementInArray: {
                                                        hole0: {
                                                            type: TYPE.OBJECT,
                                                            elementInObject: {
                                                                x: {
                                                                    type: TYPE.NUMBER
                                                                },
                                                                y: {
                                                                    type: TYPE.NUMBER
                                                                },
                                                                r: {
                                                                    type: TYPE.NUMBER
                                                                }
                                                            }
                                                        },
                                                        hole01: {
                                                            type: TYPE.OBJECT,
                                                            elementInObject: {
                                                                x: {
                                                                    type: TYPE.NUMBER
                                                                },
                                                                y: {
                                                                    type: TYPE.NUMBER
                                                                },
                                                                r: {
                                                                    type: TYPE.NUMBER
                                                                }
                                                            }
                                                        },
                                                    }
                                                }
                                            },
                                            [mode.STATIC]: {
                                                data: {
                                                    type: TYPE.OBJECT,
                                                    elementIsObject: {
                                                        duration: {
                                                            type: TYPE.NUMBER
                                                        },
                                                        color: {
                                                            type: TYPE.RGBA_COLOR
                                                        }
                                                    }
                                                }
                                            },
                                            [mode.IMAGE]: {
                                                url: true,
                                                withCreateInstantFadeIn: {
                                                    type: TYPE.BOOL,
                                                    optional: true
                                                },
                                                withRemoveInstantFadeOut: {
                                                    type: TYPE.BOOL,
                                                    optional: true
                                                },
                                                //position                    : {specificVal: [position.CENTER, position.LEFT_TOP, position.LEFT_BOTTOM, position.RIGHT_TOP, position.RIGHT_BOTTOM]},
                                                //position                    : {type: TYPE.ARRAY, elementInArray: {
                                                //
                                                //    }
                                                //}
                                                horizontal: {
                                                    specificVal: [position.LEFT, position.CENTER, position.RIGHT],
                                                    optional: true
                                                },
                                                vertical: {
                                                    specificVal: [position.TOP, position.CENTER, position.BOTTOM],
                                                    optional: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_LIST_ACTION_ID
        );

    };

    const updateData = (data, additionalData) => {

        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;

        let list = data.list;

        for (let k in list) {
            parseOneScreenEffectData(list[k])
        }

    };

    const parseOneScreenEffectData = (oneScreenEffectData) => {

        //RajRandomElements.manageRandomElementInObjectIfExist(oneScreenEffectData);

        //if (!Engine.rajCase.checkFullFillCase(oneScreenEffectData.case)) return;

        rajActionManager.updateData(oneScreenEffectData);
    };

    const createAction = (oneScreenEffectData) => {

        //return createScreenEffect(oneScreenEffectData);
        createScreenEffect(oneScreenEffectData);
    };

    const removeAction = (oneScreenEffectData) => {

        removeScreenEffect(oneScreenEffectData.id);
    };

    const createScreenEffect = (data) => {
        let screenEffect = new ScreenEffect();
        let id = data.id;

        screenEffect.init();
        screenEffect.updateData(data);

        addToScreenEffectsList(screenEffect, id);

        //return screenEffect;
    };

    const removeScreenEffect = (id) => {
        removeFromScreenEffectsList(id);
    };

    const update = (dt) => {
        for (let k in screenEffectsList) {
            screenEffectsList[k].update(dt);
        }
    };

    const onClear = () => {
        resetScreenEffectsList();
    };

    const resetScreenEffectsList = () => {
        screenEffectsList = {};
    }

    const addToScreenEffectsList = (rajScreenEffect, id) => {
        screenEffectsList[id] = rajScreenEffect;
    };

    const removeFromScreenEffectsList = (id) => {
        //if (!checkEffectExist(id)) return;

        delete screenEffectsList[id];
    };

    const getDrawableList = () => {
        if (!lengthObject(screenEffectsList)) return [];

        let a = [];

        for (let k in screenEffectsList) {

            let screenEffect = screenEffectsList[k];
            let f = screenEffect.checkDrawRajObject;

            if (!f || f && f()) {

                let actualBehaviourToRender = screenEffect.getBehaviourToRenderEffect();
                if (actualBehaviourToRender) a.push(actualBehaviourToRender)

            }

        }

        return a;
    };

    const checkEffectExist = (id) => {
        return screenEffectsList[id] ? true : false;
    };

    const resize = () => {
        resizeAllScreenEffects();
    };

    const resizeAllScreenEffects = () => {
        let $gameLayer = Engine.interface.get$gameLayer();
        let width = $gameLayer.width();
        let height = $gameLayer.height();

        if (width == 0 && height == 0) return;

        for (let k in screenEffectsList) {
            screenEffectsList[k].resize(width, height);
        }
    }

    this.init = init;
    this.onClear = onClear;
    this.getDrawableList = getDrawableList;
    this.update = update;
    this.updateData = updateData;
    this.checkEffectExist = checkEffectExist;
    this.removeScreenEffect = removeScreenEffect;
    this.resize = resize;
}