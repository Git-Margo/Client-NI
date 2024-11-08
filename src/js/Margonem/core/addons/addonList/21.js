const Slider = require('core/components/Slider');
const ServerStorageData = require('core/storage/ServerStorageData.js');


module.exports = function() {

    const
        addonKey = 'addon_21',
        moduleData = {
            fileName: "29.js"
        },
        OPACITY_CHARACTER_BLUR = "OPACITY_CHARACTER_BLUR",
        MARGIN_OUTFIT_CHARACTER_BLUR = "MARGIN_OUTFIT_CHARACTER_BLUR",
        SHADOW_BLUR_CHARACTER_BLUR = "SHADOW_BLUR_CHARACTER_BLUR";

    let running = false,
        hwnd = null,
        $content = null,
        changeSliderTimeout = null,
        opacityCharacterBlur = null,
        marginOutfitCharacterBlur = null,
        shadowBlurCharacterBlur = null;


    let configSliders = {
        [OPACITY_CHARACTER_BLUR]: {
            min: 0,
            max: 100,
            default: 80,
            getCurrentF: () => getOpacityCharacterBlur(),
            setCurrentF: (v) => {
                setOpacityCharacterBlur(v)
            }
        },
        [MARGIN_OUTFIT_CHARACTER_BLUR]: {
            min: 0,
            max: 10,
            default: 1,
            getCurrentF: () => getMarginOutfitCharacterBlur(),
            setCurrentF: (v) => {
                setMarginOutfitCharacterBlur(v)
            }
        },
        [SHADOW_BLUR_CHARACTER_BLUR]: {
            min: 0,
            max: 10,
            default: 10,
            getCurrentF: () => getShadowBlurCharacterBlur(),
            setCurrentF: (v) => {
                setShadowBlurCharacterBlur(v)
            }
        }
    };

    const initContent = () => {
        $content = getContent();

        addStyles();
        initWindow();

        initAllSliders();
    };

    const addStyles = () => {
        const styleEl = stringToHtml(style());
        document.head.appendChild(styleEl);
    };

    const initAllSliders = () => {
        for (let name in configSliders) {
            let oneSlider = configSliders[name];

            createOneRecord(name, oneSlider)
        }
    };

    const createOneRecord = (name, oneSliderData) => {
        let $oneConfigOption = getOneConfigOption();

        createName(name, $oneConfigOption);
        createSkillSlider(oneSliderData, $oneConfigOption);

        hwnd.$.find('.config-panel').append($oneConfigOption)
    };

    const createName = (name, $oneConfigOption) => {
        $oneConfigOption.find('.name-option').html(_t(name, null, "colors_group"));
    };

    const createSkillSlider = (oneSliderData, $oneConfigOption) => {
        let min = oneSliderData.min;
        let max = oneSliderData.max;
        let current = oneSliderData.getCurrentF();
        let setCurrentF = oneSliderData.setCurrentF;

        const slider = new Slider.default({
            min: min,
            max: max,
            value: current,
            onUpdate: (value) => {
                if (changeSliderTimeout) {
                    clearChangeSliderTimeout();
                }
                createChangeSlidedTimeout(setCurrentF, value)

            }
        });

        $oneConfigOption.find('.slider-wrapper').append($(slider.getElement()));

    };

    const createChangeSlidedTimeout = (setCurrentF, value) => {
        changeSliderTimeout = setTimeout(function() {
            setCurrentF(value);
            afterChangeSlider();
            clearChangeSliderTimeout();
        }, 10);
    };

    const clearChangeSliderTimeout = () => {
        clearTimeout(changeSliderTimeout);
        changeSliderTimeout = null;
    };

    const afterChangeSlider = () => {
        getEngine().npcs.clearAllCharacterBlur();
    };

    const initWindow = () => {

        hwnd = Engine.windowManager.add({
            content: $content,
            title: _t("colors_group", null, "colors_group"),
            nameWindow: Engine.windowsData.name.addon_21,
            widget: Engine.widgetsData.name.addon_21,
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            managePosition: {
                'x': 251,
                'y': 60
            },
            manageShow: false,
            addClass: addonKey + "-wnd",
            onclose: () => {
                close();
            }
        });

        hwnd.updatePos();
        hwnd.addToAlertLayer();
    };

    const start = () => {
        if (running) return;

        running = true;

        initContent();
    };

    const stop = () => {
        remove();
    };

    const manageVisible = () => {
        if (!hwnd.isShow()) open();
        else close();
    };

    const remove = () => {
        hwnd.remove();
        hwnd = null;
    };

    const open = () => {
        hwnd.show();
        hwnd.setWndOnPeak();
    };

    const close = () => {
        hwnd.hide();
    };

    const sendRainbowStorage = (subKeyStorage, v) => {
        let objToSendToServerStorage = {
            [subKeyStorage]: v
        };

        Engine.serverStorage.sendData({
            [ServerStorageData.RAINBOW_GROUPS]: objToSendToServerStorage
        }, function() {});
    };

    const getRainbowStorage = (subKeyStorage) => {
        let store = Engine.serverStorage.get(ServerStorageData.RAINBOW_GROUPS);

        if (!store || !isset(store[subKeyStorage])) {
            return configSliders[subKeyStorage].default;
        }

        return store[subKeyStorage];
    };

    const getOpacityCharacterBlur = () => {
        return getCorrectValue(opacityCharacterBlur, OPACITY_CHARACTER_BLUR);
    };

    const getMarginOutfitCharacterBlur = () => {
        return getCorrectValue(marginOutfitCharacterBlur, MARGIN_OUTFIT_CHARACTER_BLUR);
    };

    const getShadowBlurCharacterBlur = () => {
        return getCorrectValue(shadowBlurCharacterBlur, SHADOW_BLUR_CHARACTER_BLUR);
    };

    const getCorrectValue = (v, key) => {
        if (v == null) {
            v = getRainbowStorage(key);
        }

        return changeOnDefaultValIfIncorrect(v, key);
    };

    const setOpacityCharacterBlur = (v) => {
        opacityCharacterBlur = v;
        sendRainbowStorage(OPACITY_CHARACTER_BLUR, v);
    };

    const setMarginOutfitCharacterBlur = (v) => {
        marginOutfitCharacterBlur = v;
        sendRainbowStorage(MARGIN_OUTFIT_CHARACTER_BLUR, v);
    };

    const setShadowBlurCharacterBlur = (v) => {
        shadowBlurCharacterBlur = v;
        sendRainbowStorage(SHADOW_BLUR_CHARACTER_BLUR, v);
    };

    const changeOnDefaultValIfIncorrect = (v, key) => {
        let data = configSliders[key];
        let defaultV = configSliders[key].default;

        if (!isNumberFunc(v)) {
            return defaultV
        }

        let correct = data.min <= v && v <= data.max;

        return correct ? v : defaultV;
    };

    const getContent = () => {
        return $(`
            <div id="${addonKey}">
                <div class="config-panel"></div>
            </div>

        `);
    };

    const getOneConfigOption = () => {
        return $(`
            <div class="one-config-option-character-blur">
                <div class="name-option-wrapper">
                    <div class="name-option"></div>
                </div>
                <div class="slider-wrapper"></div>
            </div>
        `)
    };

    const style = () => {

        return `
		<style id="${addonKey}-style">

			.${addonKey}-wnd .content {
			    margin-left: -15px;
                margin-right: -15px;


                #${addonKey} {
                    height: 95px;
                    margin-top: 6px;
                    font-size:12px;

                    .config-panel {
                        color:white;
                        margin-top: 12px;
                        .one-config-option-character-blur {
                        height: 30px;
                            .name-option-wrapper,
                            .slider-wrapper {
                                width: 49%;
                                display: inline-block;
                            }
                            .config-panel {
                                color:white;
                            }
                        }
                    }

			    }
			}


		</style>`;
    };

    this.getOpacityCharacterBlur = getOpacityCharacterBlur;
    this.getMarginOutfitCharacterBlur = getMarginOutfitCharacterBlur;
    this.getShadowBlurCharacterBlur = getShadowBlurCharacterBlur;
    this.manageVisible = manageVisible;
    this.stop = stop;
    this.start = start;

};