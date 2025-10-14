import {
    SettingCategories,
    SettingKeys
} from "./LfData";

export default class LootFilterStorage {
    private values = {
        // [SettingKeys.IS_ENABLED]: true,
        // [SettingCategories.ALONE]: {
        //   [SettingKeys.INVENTORY]: 1,
        //   [SettingKeys.CHESTS]: 2,
        //   [SettingKeys.BAGS]: 2,
        //   [SettingKeys.GOLD]: 1,
        //   [SettingKeys.TELEPORTS]: 1,
        //   [SettingKeys.TALISMANS]: 3,
        //   [SettingKeys.NEUTRAL]: 2,
        //   [SettingKeys.RUNIC_SHARDS]: 1,
        //   [SettingKeys.USABLE]: 3,
        //   [SettingKeys.UPGRADES]: 2,
        //   [SettingKeys.OTHER]: 1,
        //   [SettingKeys.MINIMAL_LOOT_VALUE]: 0,
        //   [SettingKeys.ONLY_HIGHEST_RANK]: true,
        //   [SettingKeys.AUTO_ACCEPT_LOOT]: 7,
        //   [SettingKeys.TO_RANK]: 2
        // },
        // [SettingCategories.GROUP]: {
        //   [SettingKeys.INVENTORY]: 3,
        //   [SettingKeys.CHESTS]: 1,
        //   [SettingKeys.BAGS]: 3,
        //   [SettingKeys.GOLD]: 1,
        //   [SettingKeys.TELEPORTS]: 2,
        //   [SettingKeys.TALISMANS]: 1,
        //   [SettingKeys.NEUTRAL]: 1,
        //   [SettingKeys.RUNIC_SHARDS]: 2,
        //   [SettingKeys.USABLE]: 3,
        //   [SettingKeys.UPGRADES]: 1,
        //   [SettingKeys.OTHER]: 2,
        //   [SettingKeys.MINIMAL_LOOT_VALUE]: 100,
        //   [SettingKeys.ONLY_HIGHEST_RANK]: false,
        //   [SettingKeys.AUTO_ACCEPT_LOOT]: 3,
        //   [SettingKeys.TO_RANK]: 4
        // }
    }

    constructor() {

    }

    getValuesByCategory(category: SettingCategories) {
        // return this.values[category];
    }

    setValues() {

    }

    updateValues(values: any) {

    }
}