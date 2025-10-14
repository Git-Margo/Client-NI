const SettingsData = require('@core/settings/SettingsData.js');
import LfStorage from './LfStorage';
import {
    SettingCategories,
    SettingKeys
} from './LfData';
import Button from '@core/components/Button';
import {
    LfLang
} from './LfManager';
import FormBuilder, {
    AllFieldData
} from "@core/formBuilder/FormBuilder";
import {
    FieldTypes
} from "@core/formBuilder/FormBuilderData";
import Tabs, {
    Cards
} from "@core/components/Tabs";

const fileName = 'LfSettings.ts';
const settingsKey = SettingsData.KEY.LOOT_FILTER;
const settingsField = SettingsData.VARS.LOOT_FILTER;


export default class LootFilterSettings {
    private enableSettingData: any;
    private isEnabled!: boolean;
    private fieldsData: AllFieldData[] = [];
    private formBuilder: FormBuilder;
    private tabs!: Tabs;
    private cards: Cards = {
        [SettingCategories.SOLO]: {
            name: LfLang(SettingCategories.SOLO),
            initAction: () => this.tabOpen(SettingCategories.SOLO),
        },
        [SettingCategories.GROUP]: {
            name: LfLang(SettingCategories.GROUP),
            initAction: () => this.tabOpen(SettingCategories.GROUP),
        },
    };

    constructor(private wndEl: HTMLElement, private LfStorage: LfStorage) {
        this.enableSettingData = Engine.settingsOptions.getDataToCreateCheckBox(settingsKey, settingsField.V);
        this.createTabs();
        this.setEnabled();
        this.formBuilder = new FormBuilder(this.fieldsData, {
            onChangeCallback: (fieldName, value) => this.onChange(fieldName, value),
            prefix: 'lf-'
        });
        this.createFields(SettingCategories.SOLO);
        this.createFields(SettingCategories.GROUP);
        this.createSwitchBtn();
        this.tabOpen(SettingCategories.SOLO);

        Engine.settings.addUpdateSettingsTrigger(fileName, settingsKey, settingsField.V, () => this.updateEnabled())
    }

    setEnabled() {
        this.isEnabled = this.enableSettingData.getValue();
        const fieldsContainerEl = this.wndEl.querySelector('.lf-fields-container') as HTMLElement;
        fieldsContainerEl.classList.toggle('disabled', !this.isEnabled);
    }

    updateEnabled() {
        this.setEnabled();
        const fieldData = this.fieldsData.find((field) => field.name === SettingKeys.IS_ENABLED);
        const control = fieldData?.control as Button;
        control.setLabel(this.getEnableBtnLabel());
    }

    createTabs() {
        const tabsOptions = {
            tabsEl: {
                navEl: this.wndEl.querySelector('.tw-tabs') as HTMLElement,
                contentsEl: this.wndEl.querySelector('.lf-fields-container') as HTMLElement,
            },
        };
        this.tabs = new Tabs(this.cards, tabsOptions);
        tabsOptions.tabsEl.navEl.classList.remove('tabs-nav');
    }

    tabOpen(tabName: SettingCategories) {
        this.tabs.activateCard(tabName)
    }

    private getEnableBtnLabel() {
        return !this.isEnabled ?
            _t('on', null, 'buttons') :
            _t('off', null, 'buttons');
    }

    private createFields(tabName: SettingCategories) {
        const cat = tabName.toUpperCase();
        const wrapperElement = this.wndEl.querySelector(`.${tabName}-content`) as HTMLElement;
        const $wrapper = $(wrapperElement);
        const options = {
            wrapperElement
        };
        const labelOptions = {
            ...options,
            cssClass: 'fw-bold'
        };

        this.formBuilder.createLabel(LfLang('loot-filtering') + ':', labelOptions);
        Engine.settings.createOneSettingsMenu(fileName, settingsKey, settingsField[`${cat}_EQ`], $wrapper);
        Engine.settings.createOneSettingsMenu(fileName, settingsKey, settingsField[`${cat}_LOOTBOX`], $wrapper);
        Engine.settings.createOneSettingsMenu(fileName, settingsKey, settingsField[`${cat}_BAG`], $wrapper);
        Engine.settings.createOneSettingsMenu(fileName, settingsKey, settingsField[`${cat}_GOLD`], $wrapper);
        Engine.settings.createOneSettingsMenu(fileName, settingsKey, settingsField[`${cat}_TP`], $wrapper);
        Engine.settings.createOneSettingsMenu(fileName, settingsKey, settingsField[`${cat}_TALISMAN`], $wrapper);
        Engine.settings.createOneSettingsMenu(fileName, settingsKey, settingsField[`${cat}_NEUTRAL`], $wrapper);
        Engine.settings.createOneSettingsMenu(fileName, settingsKey, settingsField[`${cat}_DRAGON_RUNE`], $wrapper);
        Engine.settings.createOneSettingsMenu(fileName, settingsKey, settingsField[`${cat}_CONSUMABLE`], $wrapper);
        Engine.settings.createOneSettingsMenu(fileName, settingsKey, settingsField[`${cat}_IMPROVEMENT`], $wrapper);
        Engine.settings.createOneSettingsMenu(fileName, settingsKey, settingsField[`${cat}_OTHER`], $wrapper);
        this.formBuilder.createLabel(LfLang('loot-value') + ':', labelOptions);
        Engine.settings.createOneSettingsMenu(fileName, settingsKey, settingsField[`${cat}_FROM_RARITY`], $wrapper);
        Engine.settings.createOneSettingsInput(fileName, settingsKey, settingsField[`${cat}_BY_PRICE`], $wrapper, {
            useDebounce: true
        });
        Engine.settings.createOneSettingsCheckbox(fileName, settingsKey, settingsField[`${cat}_ONLY_HIGHEST_RARITY`], null, $wrapper);
        this.formBuilder.createSeparator(options);
        this.formBuilder.createLabel(LfLang('auto-loot-accept') + ':', labelOptions);
        Engine.settings.createOneSettingsCheckboxList(fileName, settingsKey, settingsField[`${cat}_AUTO_ACCEPT`], $wrapper);
        Engine.settings.createOneSettingsMenu(fileName, settingsKey, settingsField[`${cat}_TO_RARITY`], $wrapper);

        // this.formBuilder.createLabel(LfLang('loot-filtering') + ':', labelOptions);
        // this.formBuilder.createField(SettingKeys.INVENTORY);
        // this.formBuilder.createField(SettingKeys.CHESTS);
        // this.formBuilder.createField(SettingKeys.BAGS);
        // this.formBuilder.createField(SettingKeys.GOLD);
        // this.formBuilder.createField(SettingKeys.TELEPORTS);
        // this.formBuilder.createField(SettingKeys.TALISMANS);
        // this.formBuilder.createField(SettingKeys.NEUTRAL);
        // this.formBuilder.createField(SettingKeys.RUNIC_SHARDS);
        // this.formBuilder.createField(SettingKeys.USABLE);
        // this.formBuilder.createField(SettingKeys.UPGRADES);
        // this.formBuilder.createField(SettingKeys.OTHER);
        // this.formBuilder.createLabel(LfLang('loot-value') + ':', labelOptions);
        // this.formBuilder.createField(SettingKeys.MINIMAL_LOOT_VALUE);
        // this.formBuilder.createField(SettingKeys.ONLY_HIGHEST_RANK);
        // this.formBuilder.createSeparator(options);
        // this.formBuilder.createLabel(LfLang('auto-loot-accept') + ':', labelOptions);
        // this.formBuilder.createField(SettingKeys.AUTO_ACCEPT_LOOT);
        // this.formBuilder.createField(SettingKeys.TO_RANK);
    }

    private createSwitchBtn() {
        const enableBtnText = this.getEnableBtnLabel();
        const buttonsContainerEl = this.wndEl.querySelector(`.lf-buttons-container`) as HTMLElement;
        this.formBuilder.createField({
            name: SettingKeys.IS_ENABLED,
            label: LfLang(SettingKeys.IS_ENABLED),
            type: FieldTypes.BUTTON,
            createFullComponent: false,
            value: this.isEnabled,
            wrapperElement: buttonsContainerEl
        }, {
            buttonOptions: {
                text: enableBtnText,
                classes: ['small', 'green', 'mx-auto']
            },
        });
    }

    private onChange(fieldName: string, value: any) {
        const fieldData = this.fieldsData.find((field) => field.name === fieldName);
        // console.log(fieldName, value)
        // console.log(fieldData);
        if (fieldName === SettingKeys.IS_ENABLED) {
            this.enableSettingData.changeCallback(!this.isEnabled);
        }
    }

}