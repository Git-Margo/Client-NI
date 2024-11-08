const Button = require("../../components/Button");
const NativeColorPicker = require("../../components/NativeColorPicker");
const Slider = require("../../components/Slider");
const ServerStorageData = require('../../storage/ServerStorageData.js');
const {
    hex2rgb,
    mergeObjects
} = require("../../HelpersTS");

const Tpl = require('core/Templates');

module.exports = function() {
    let
        running = false,
        state = false,
        hwnd = null,
        content = null,
        alwaysDraw = false;
    mergedData = null;

    const
        addonKey = 'addon_1',
        addonSlug = 'collision_detector',
        addonName = _t('title', null, addonSlug),
        moduleData = {
            fileName: "1.js"
        };

    const map = Engine.map;
    const oldDraw = map.draw;

    const FieldTypes = {
        COLORPICKER: 'COLORPICKER',
        SLIDER: 'SLIDER',
        BUTTON: 'BUTTON',
    }

    const SettingKeys = {
        COLOR: 'color',
        OPACITY: 'opacity',
        STATE: 'state'
    }

    const formControls = {
        [SettingKeys.COLOR]: null,
        [SettingKeys.OPACITY]: null,
        [SettingKeys.STATE]: null,
    };

    const fieldsData = [{
            name: SettingKeys.COLOR,
            type: FieldTypes.COLORPICKER
        },
        {
            name: SettingKeys.OPACITY,
            type: FieldTypes.SLIDER
        },
        {
            name: SettingKeys.STATE,
            type: FieldTypes.BUTTON,
            action: () => {
                toggleState();
            }
        }
    ];

    const defaultData = {
        [SettingKeys.COLOR]: '#008000',
        [SettingKeys.OPACITY]: 60,
        [SettingKeys.STATE]: false,
    }

    const getValue = (fieldName) => {
        return mergedData[fieldName];
    }

    const createColorpicker = (field) => {
        const control = new NativeColorPicker.default({
                id: 'cd-' + field.name,
                name: field.name,
                value: getValue(field.name) //this.getPresetValue(field.name),
            },
            (value) => onChange(field.name, value)
        );
        formControls[field.name] = control;
        return control.getElement();
    }

    const createSlider = (field) => {
        const control = new Slider.default({
            min: 0,
            max: 100,
            value: getValue(field.name), //Number(this.getPresetValue(field.name)),
            updateEvent: 'pointerup',
            onUpdate: (value) => onChange(field.name, value),
        });
        formControls[field.name] = control;
        return control.getElement();
    }

    const createButton = (field) => {
        const control = new Button.default({
            text: _t('on', null, 'buttons'),
            classes: ['small', 'green'],
            action: () => {
                field.action()
            }
        });
        formControls[field.name] = control;
        return control.getButton();
    }

    const createFields = () => {
        for (const field of fieldsData) {
            let el;
            switch (field.type) {
                case FieldTypes.COLORPICKER:
                    el = createColorpicker(field);
                    break;
                case FieldTypes.SLIDER:
                    el = createSlider(field);
                    break;
                case FieldTypes.BUTTON:
                    el = createButton(field);
                    break;
            }

            const wrapperEl = content.querySelector(`#cd-${field.name}`);
            wrapperEl.appendChild(el);
        }
    }

    const onChange = (name, value) => {
        mergedData[name] = value;
        saveStorageData();
    }

    const toggleState = () => {
        const newState = !state;
        setState(newState);
        onChange(SettingKeys.STATE, newState)
        manageOfRenderCallbackByState();
    }

    const setState = (_state) => {
        state = _state;
        setStateButtonLabel();
        if (state) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    }

    const manageOfRenderCallbackByState = () => {
        if (state) {
            addRenderCallback();
        } else {
            removeRenderCallback();
        }
    }

    const initRenderCallbacks = () => {
        if (!state) {
            return;
        }
        addRenderCallback()
    };

    const clearRenderCallback = () => {
        if (!state) {
            return;
        }
        removeRenderCallback();
    }

    const addRenderCallback = () => {
        API.addCallbackToEvent(Engine.apiData.CALL_DRAW_ADD_TO_RENDERER, addToRenderer);
    }

    const removeRenderCallback = () => {
        API.removeCallbackFromEvent(Engine.apiData.CALL_DRAW_ADD_TO_RENDERER, addToRenderer);
    }

    const setStateButtonLabel = () => {
        formControls[SettingKeys.STATE].setLabel(state ? _t('off', null, 'buttons') : _t('on', null, 'buttons'))
    }

    const initWindow = () => {
        hwnd = Engine.windowManager.add({
            content,
            title: addonName,
            nameWindow: addonKey,
            type: Engine.windowsData.type.TRANSPARENT,
            widget: Engine.widgetsData.name.addon_1,
            addClass: `${addonSlug}-options-window`,
            manageOpacity: 3,
            managePosition: {
                'x': 251,
                'y': 60
            },
            manageShow: false,
            onclose: close
        });

        hwnd.updatePos();
        hwnd.addToAlertLayer();
    }

    const initContent = () => {
        content = Tpl.get('cd-content')[0];
    }

    const loadStorageData = () => {
        const data = Engine.serverStorage.get(ServerStorageData.CD_SETTINGS);
        mergedData = data ? mergeObjects(data, defaultData, 'id') : {
            ...defaultData
        };
    }

    const saveStorageData = () => {
        Engine.serverStorage.sendData({
            [ServerStorageData.CD_SETTINGS]: mergedData
        });
    }

    const open = () => {
        hwnd.show();
        hwnd.setWndOnPeak();
        hwnd.updatePos();
    }

    const close = () => {
        hwnd.hide();
    }

    this.manageVisible = function() {
        if (!hwnd.isShow()) open();
        else close();
    };

    this.start = function() {
        if (running) return;
        running = true;

        setAlwaysDraw(true);
        loadStorageData();
        initContent();
        createFields();
        initWindow();
        setState(getValue(SettingKeys.STATE));
        //setDrawCollision();

        initRenderCallbacks();
    }

    this.stop = function() {
        if (!running) return;
        running = false;

        clearRenderCallback();

        setState(false);
        //setDrawCollision();
        hwnd.remove();
        hwnd = null;


        Engine.serverStorage.clearDataBySpecificKey(ServerStorageData.CD_SETTINGS);
    }

    const getColor = () => {
        const {
            r,
            g,
            b
        } = hex2rgb(getValue(SettingKeys.COLOR));
        return `rgba(${r}, ${g}, ${b}, ${getValue(SettingKeys.OPACITY)}%)`;
    }

    //const setDrawCollision = () => {
    //	map.draw = (ctx) => {
    //		const ret = oldDraw.call(map, ctx);
    //		if (state) drawCollisions(map, ctx);
    //		return ret;
    //	};
    //}

    const drawCollisions = (map, ctx) => {
        const rgbaColor = getColor();
        for (let n = 0; n < map.d.x; n++)
            for (let e = 0; e < map.d.y; e++)
                if (map.col.check(n, e, 1)) {
                    ctx.fillStyle = rgbaColor;
                    ctx.fillRect(32 * n - map.offset[0], 32 * e - map.offset[1], 32, 32);
                }
    };

    const addToRenderer = () => {
        Engine.renderer.add(this);
    };

    this.getOrder = () => {
        return 0.05;
    };

    this.draw = (ctx) => {
        drawCollisions(Engine.map, ctx);
    };

    const getAlwaysDraw = () => {
        return alwaysDraw
    };

    const setAlwaysDraw = (_alwaysDraw) => {
        alwaysDraw = _alwaysDraw
    };

    this.getAlwaysDraw = getAlwaysDraw;
    this.setAlwaysDraw = setAlwaysDraw;

};