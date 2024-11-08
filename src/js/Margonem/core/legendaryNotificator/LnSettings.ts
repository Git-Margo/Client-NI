import LnStorage, {
    Preset,
    PresetSettingValue,
    SettingList
} from './LnStorage';
import LnNotifier from './LnNotifier';
import LnData, {
    FieldTypes,
    SettingKeys
} from './LnData';
import Checkbox from '../components/Checkbox';
import NativeColorPicker from '../components/NativeColorPicker';
import Slider from '../components/Slider';
import {
    LnLang
} from './LnManager';
import {
    errorReport,
    isset
} from '../HelpersTS';
import Button from '../components/Button';

interface FieldData {
    name: SettingList,
    type: FieldTypes,
    callback ? : () => void,
    menuOptions ? : any,
    menuData ? : any,
    value ? : number,
    onSelectedClb ? : () => void,
    setCssVariable ? : {
        unit ? : string
    } | boolean
    setCssClass ? : string
}


type Field = Slider | Checkbox | NativeColorPicker | JQuery | null;

type FormControls = {
    [key in SettingList]: Field
}

export default class LegendaryNotificatorSettings {

    private formControls: FormControls = {
        [SettingKeys.PRESETS]: null,
        [SettingKeys.OPACITY]: null,
        [SettingKeys.SIZE]: null,
        [SettingKeys.FRAME_MAP]: null,
        [SettingKeys.FRAME_MAP_COLOR]: null,
        [SettingKeys.FRAME_LOOT]: null,
        [SettingKeys.FRAME_LOOT_COLOR]: null,
        [SettingKeys.FRAME_ITEM]: null,
        [SettingKeys.FRAME_ITEM_COLOR]: null,
        [SettingKeys.MESSAGE]: null,
        // [SettingKeys.CLAN_MESSAGE]: null,
        [SettingKeys.SOUND]: null,
        [SettingKeys.ANIMATION]: null
    };

    private fieldsData: FieldData[] = [{
            name: SettingKeys.PRESETS,
            type: FieldTypes.MENU,
            menuOptions: {
                addNewOption: {
                    addItemConfirmText: LnLang("preset_provide_name"),
                    removeItemConfirmText: (val: string) => LnLang("preset_remove_confirm"),
                    addTipText: LnLang("preset_new"),
                    menuToAddAndRemove: this.LnStorage.getCustomPresetList(),
                    configAddItemIdAndName: {
                        nameFromInputVal: true,
                        firstPossibleId: 100,
                    },
                    autoSelect: true,
                    addItemConfirmValidate: function(val: string) {
                        return true
                    },
                    addItemConfirmClb: (data: {
                        val: string,
                        id: number,
                        newItemText: string
                    }) => {
                        this.LnStorage.addPreset(data.val, data.id);
                    },
                    removeItemConfirmClb: (data: {
                        id: number
                    }) => {
                        this.LnStorage.removePreset(data.id);
                    }
                }
            },
            menuData: this.LnStorage.getDefaultPresetList()
        },
        {
            name: SettingKeys.SOUND,
            type: FieldTypes.MENU,
            menuOptions: {
                addNewOption: {
                    addItemConfirmText: LnLang("sound_provide_url"),
                    removeItemConfirmText: (val: string) => LnLang("sound_remove_confirm"),
                    addTipText: LnLang("sound_new"),
                    menuToAddAndRemove: this.LnStorage.getCustomSoundList(),
                    configAddItemIdAndName: {
                        nameFromInputVal: false,
                        namePrefix: LnLang("custom") + " ",
                        firstPossibleId: 100,
                        showFirstPossibleIdUserFriendly: true
                    },
                    autoSelect: true,
                    addItemConfirmValidate: function(val: string) {
                        return true
                    },
                    addItemConfirmClb: (data: {
                        val: string,
                        id: number,
                        newItemText: string
                    }) => {
                        this.LnStorage.addSound(data.newItemText, data.id, data.val);
                    },
                    removeItemConfirmClb: (data: {
                        id: number
                    }) => {
                        this.LnStorage.removeSound(data.id);
                    }
                }
            },
            menuData: this.LnStorage.getDefaultSoundList(),
            onSelectedClb: () => {
                this.LnNotifier.playSound();
            }
        },
        {
            name: SettingKeys.ANIMATION,
            type: FieldTypes.MENU,
            menuData: this.LnStorage.getDefaultAnimationList()
        },
        {
            name: SettingKeys.FRAME_MAP,
            type: FieldTypes.CHECKBOX,
            setCssClass: 'ln-frame-map-active'
        },
        {
            name: SettingKeys.FRAME_LOOT,
            type: FieldTypes.CHECKBOX,
            setCssClass: 'ln-frame-loot-active'
        },
        {
            name: SettingKeys.FRAME_ITEM,
            type: FieldTypes.CHECKBOX,
            setCssClass: 'ln-frame-item-active'
        },
        {
            name: SettingKeys.MESSAGE,
            type: FieldTypes.CHECKBOX
        },
        // { name: SettingKeys.CLAN_MESSAGE, type: FieldTypes.CHECKBOX },
        {
            name: SettingKeys.FRAME_MAP_COLOR,
            type: FieldTypes.COLORPICKER,
            setCssVariable: true
        },
        {
            name: SettingKeys.FRAME_LOOT_COLOR,
            type: FieldTypes.COLORPICKER,
            setCssVariable: true
        },
        {
            name: SettingKeys.FRAME_ITEM_COLOR,
            type: FieldTypes.COLORPICKER,
            setCssVariable: true
        },
        {
            name: SettingKeys.OPACITY,
            type: FieldTypes.SLIDER,
            setCssVariable: true
        },
        {
            name: SettingKeys.SIZE,
            type: FieldTypes.SLIDER,
            setCssVariable: {
                unit: "px"
            }
        },
    ];

    // private storageData: Presets;
    private currentPresetData: Preset;
    // private allData: Preset;

    constructor(private wndEl: HTMLElement, private LnStorage: LnStorage, private LnNotifier: LnNotifier) {
        this.currentPresetData = this.LnStorage.getCurrentPresetData();
        this.createSettingFields();
        this.createTestButton();
    }

    createTestButton() {
        const buttonsContainerEl = this.wndEl.querySelector(`#ln-buttons-container`) as HTMLElement;
        const opts = {
            text: LnLang('test'),
            classes: ['small', 'green'],
            action: this.testBtnOnClick.bind(this),
            // disabled: true,
        };
        const testBtn: Button = new Button(opts);
        buttonsContainerEl.appendChild(testBtn.getButton());
    }

    testBtnOnClick() {
        this.LnNotifier.test();
    }

    createSettingFields() {
        this.createFields();
    }

    createFields() {
        for (const field of this.fieldsData) {
            let el!: HTMLElement;
            switch (field.type) {
                case FieldTypes.MENU:
                    el = this.createMenu(field);
                    break;
                case FieldTypes.CHECKBOX:
                    el = this.createCheckbox(field);
                    break;
                case FieldTypes.COLORPICKER:
                    el = this.createColorpicker(field);
                    break;
                case FieldTypes.SLIDER:
                    el = this.createSlider(field);
                    break;
            }

            if (isset(field.setCssVariable)) {
                // @ts-ignore
                this.setCssVariable(field.name, String(this.getPresetValue(field.name)), field!.setCssVariable!.unit);
            }
            const wrapperEl = this.wndEl.querySelector(`#ln-${field.name}`) as HTMLElement;
            wrapperEl.appendChild(el);
        }
    }

    getPresetValue(key: SettingList): PresetSettingValue {
        return key === SettingKeys.PRESETS ? this.currentPresetData.id : this.currentPresetData[key];
    }

    createMenu(field: FieldData) {
        const presetData = this.getPresetValue(field.name);
        const control = $('<div class="menu"></div>');
        const options = isset(field.menuOptions) ? field.menuOptions : {};
        control.createMenu(field.menuData, true, (value) => this.onSelected(field.name, Number(value)), options);
        control.setOptionWithoutCallbackByValue(String(presetData));

        this.formControls[field.name] = control;
        return control[0];
    }

    createCheckbox(field: FieldData) {
        const value = this.getPresetValue(field.name);
        const control = new Checkbox({
                id: 'ls-' + field.name,
                name: field.name,
                label: LnLang(field.name),
                value: < string > value,
                checked: < boolean > value,
            },
            (state: boolean) => this.onSelected(field.name, state),
        );

        if (isset(field.setCssClass)) {
            this.setOrRemoveCssClass( < string > field.setCssClass, < boolean > value);
        }

        this.formControls[field.name] = control;
        return control.getCheckbox();
    }

    createColorpicker(field: FieldData) {
        const control = new NativeColorPicker({
                id: 'ls-' + field.name,
                name: field.name,
                value: < string > this.getPresetValue(field.name),
            },
            (value: string) => this.onSelected(field.name, value),
        );
        this.formControls[field.name] = control;
        this.setCssVariable(field.name, < string > this.getPresetValue(field.name));
        return control.getElement();
    }

    createSlider(field: FieldData) {
        const control = new Slider({
            min: 0,
            max: 100,
            value: Number(this.getPresetValue(field.name)),
            updateEvent: 'pointerup',
            onUpdate: (value: number) => this.onSelected(field.name, value),
        });
        this.formControls[field.name] = control;
        return control.getElement();
    }

    onSelected(name: SettingList, value: PresetSettingValue) {
        if (name === SettingKeys.PRESETS) {
            this.changePreset(Number(value))
        } else {
            this.LnStorage.changeSetting(name, value);
            const fieldData = this.fieldsData!.find((field) => field.name === name);
            if (isset(fieldData!['setCssClass'])) {
                this.setOrRemoveCssClass( < string > fieldData!.setCssClass, < boolean > value);
            }
            if (isset(fieldData!['setCssVariable'])) {
                // @ts-ignore
                this.setCssVariable(name, String(value), fieldData!.setCssVariable!.unit);
            }
            // @ts-ignore
            if (isset(fieldData?.onSelectedClb)) fieldData!.onSelectedClb();
        }
    }

    changePreset(id: number) {
        this.LnStorage.changePreset(id);
        const presetData = this.LnStorage.getPresetData(id);
        if (presetData) {
            this.currentPresetData = presetData;
            this.changeValuesInFields();
        } else {
            errorReport('LnSettings.ts', "changePreset", `preset ${id} not exist!`);
        }
    }

    changeValuesInFields() {
        for (const field of this.fieldsData) {
            if (field.name === SettingKeys.PRESETS) continue;
            const formControl = this.formControls[field.name];

            switch (field.type) {
                case FieldTypes.MENU:
                    (formControl as JQuery).setOptionWithoutCallbackByValue(String(this.getPresetValue(field.name)));
                    break;
                case FieldTypes.CHECKBOX:
                    (formControl as Checkbox).setChecked( < boolean > this.getPresetValue(field.name));
                    break;
                case FieldTypes.COLORPICKER:
                    (formControl as NativeColorPicker).setValue(String(this.getPresetValue(field.name)));
                    break;
                case FieldTypes.SLIDER:
                    (formControl as Slider).setValue(Number(this.getPresetValue(field.name)));
                    break;
            }

            if (isset(field.setCssClass)) {
                this.setOrRemoveCssClass( < string > field.setCssClass, < boolean > this.getPresetValue(field.name));
            }
            if (isset(field.setCssVariable)) {
                // @ts-ignore
                this.setCssVariable(field.name, String(this.getPresetValue(field.name)), field!.setCssVariable!.unit);
            }
        }
    }

    setCssVariable(name: string, value: string, unit: string = '') {
        document.documentElement.style.setProperty(`--${LnData.SLUG_SHORT}-${name}`, value + unit);
    }

    setOrRemoveCssClass(name: string, value: boolean) {
        if (value) {
            document.body.classList.add(String(name));
        } else {
            document.body.classList.remove(String(name));
        }
    }

}