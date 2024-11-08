export default {
    TITLE: '',
    SLUG: 'legendary-notificator',
    DEFAULT: 'default',
    SLUG_SHORT: 'ln',
    LN_ACTIVE_CLASS: 'ln-active',
};

export enum Sounds {
    NONE = 'NONE',
}

export enum Animations {
    NONE = 'NONE',
        FIREWORKS = 'FIREWORKS',
        CONFETTI = 'CONFETTI',
        CONFETTI_SIDE = 'CONFETTI_SIDE',
        STARS = 'STARS',
}

export enum SettingKeys {
    ACTIVE_PRESET = 'active_preset',
        PRESETS = 'presets',
        PRESET_CUSTOM_LIST = 'preset_custom_list',
        SOUND_CUSTOM_LIST = 'sound_custom_list',

        OPACITY = 'opacity',
        SIZE = 'size',
        FRAME_MAP = 'frame_map',
        FRAME_MAP_COLOR = 'frame_map_color',
        FRAME_LOOT = 'frame_loot',
        FRAME_LOOT_COLOR = 'frame_loot_color',
        FRAME_ITEM = 'frame_item',
        FRAME_ITEM_COLOR = 'frame_item_color',
        SOUND = 'sound',
        ANIMATION = 'animation',
        // CLAN_MESSAGE = 'clan_message',
        MESSAGE = 'message',
}

export enum FieldTypes {
    CHECKBOX = 'CHECKBOX',
        COLORPICKER = 'COLORPICKER',
        MENU = 'MENU',
        SLIDER = 'SLIDER',
}