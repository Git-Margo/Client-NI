let SettingsData = require('@core/settings/SettingsData.js');


let TEMPLATES = {};

const getLang = () => {
    if (typeof RUNNING_UNIT_TEST !== 'undefined') return;
    return _l();
}

const {
    RECEIVE_PRIVATE_CHAT_MESSAGE,
    INVITATION_TO_CLAN_AND_DIPLOMACY,
    TRADE_WITH_OTHERS,
    TURN_BASED_COMBAT_AFTER_MONSTER_ATTACK,
    INVITATION_TO_FRIENDS,
    MAIL_FROM_UNKNOWN,
    MOUSE_HERO_WALK,
    INTERFACE_ANIMATION,
    CLAN_MEMBER_ENTRY_CHAT_MESSAGE,
    CYCLE_DAY_AND_NIGHT,
    AUTO_GO_THROUGH_GATEWAY,
    SHOW_ITEMS_RANK,
    INVITATION_TO_PARTY_BEYOND_FRIENDS_AND_CLANS_AND_CLANS_ALLY,
    FRIEND_ENTRY_CHAT_MESSAGE,
    WEATHER_AND_EVENT_EFFECTS,
    BANNERS,
    ADD_OR_REMOVE_PARTY_MEMBER_CHAT_MESSAGE,
    MAP_ANIMATION,
    INFORM_ABOUT_FREE_PLACE_IN_BAG,
    LOADER_SPLASH,
    WAR_SHADOW,
    AUTO_COMPARE_ITEMS,
    BATTLE_EFFECTS,
    AUTO_CLOSE_BATTLE,
    RECEIVE_FROM_ENEMY_CHAT_MESSAGE,
    ANNOUNCE_CLAN_ABOUT_LEGEND_DROP_CHAT_MESSAGE,
    EXCHANGE_SAFE_MODE,
    LOOT_FILTER,
    KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL,
    BERSERK,
    BERSERK_GROUP,
} = SettingsData.KEY;
const BERSERK_VARS = SettingsData.VARS.BERSERK_VARS
const BERSERK_LVL_MIN_LVL_MAX = connectStrings(BERSERK, BERSERK_VARS.LVL_MIN, BERSERK_VARS.LVL_MAX);
const BERSERK_V = connectStrings(BERSERK, BERSERK_VARS.V);
const BERSERK_COMMON = connectStrings(BERSERK, BERSERK_VARS.COMMON);
const BERSERK_ELITE = connectStrings(BERSERK, BERSERK_VARS.ELITE);
const BERSERK_ELITE2 = connectStrings(BERSERK, BERSERK_VARS.ELITE2);

const BERSERK_GROUP_LVL_MIN_LVL_MAX = connectStrings(BERSERK_GROUP, BERSERK_VARS.LVL_MIN, BERSERK_VARS.LVL_MAX);
const BERSERK_GROUP_V = connectStrings(BERSERK_GROUP, BERSERK_VARS.V);
const BERSERK_GROUP_COMMON = connectStrings(BERSERK_GROUP, BERSERK_VARS.COMMON);
const BERSERK_GROUP_ELITE = connectStrings(BERSERK_GROUP, BERSERK_VARS.ELITE);
const BERSERK_GROUP_ELITE2 = connectStrings(BERSERK_GROUP, BERSERK_VARS.ELITE2);

const SOLO_BY_PRICE = SettingsData.VARS.LOOT_FILTER.SOLO_BY_PRICE
const SOLO_AUTO_ACCEPT = SettingsData.VARS.LOOT_FILTER.SOLO_AUTO_ACCEPT

//    <!-- standard game window !-->
TEMPLATES['border-window'] = `<div class="border-window">
        <!--<div class="border-image"></div>-->
        <div class="header-label-positioner">
            <div class="header-label">
                <div class="left-decor"></div>
                <div class="right-decor"></div>
                <div class="text"></div>
            </div>
        </div>
        <div class="content">
            <!--<div class="decoration-label">-->
                <!--<div class="decoration"></div>-->
                <!--<div class="label">-->
                <!--</div>-->
            <!--</div>-->
            <div class="inner-content"></div>
            <div class="window-controlls">
            </div>
        </div>
        <div class="close-button-corner-decor">
            <button type="button" class="close-button"></button>
        </div>
    </div>`;

TEMPLATES['stasis-incoming-overlay'] = `<div class="stasis-incoming-overlay map-overlay">
        <dev class="stasis-incoming-overlay__caption">
            <div class="stasis-incoming-overlay__text" data-trans="stasis-incoming">
            </div>
        </dev>
    </div>`;

TEMPLATES['stasis-overlay'] = `<div class="stasis-overlay map-overlay">
        <dev class="stasis-overlay__caption">
            <div class="stasis-overlay__title" data-trans="stasis"></div>
            <div class="stasis-overlay__text">
                <div data-trans="stasis_overlay_text"></div>
                <div class="stasis-overlay__time"></div>
            </div>
        </dev>
    </div>`;

TEMPLATES['map-reloader-splash'] = `<div class="map-reloader-splash map-overlay"></div>`;

TEMPLATES['dead-overlay'] = `<div class="dead-overlay map-overlay">
        <div class="positioner">
            <div class="inner-text" data-trans="unconcious_info_txt"></div>
            <div class="dazed-time"></div>
        </div>
    </div>`;

TEMPLATES['battle-bars-wrapper'] = `<div class="battle-bars-wrapper">
        <div class="battle-bar energy" data-trans="data-tip#stat-energy">
            <div class="background"></div>
            <div class="bar-overflow">
                <div class="inner" bar-horizontal="true"></div>
            </div>
            <div class="overlay"></div>
            <div class="values">0000/0000</div>
        </div>
        <div class="battle-bar mana" data-trans="data-tip#stat-mana">
            <div class="background"></div>
            <div class="bar-overflow">
                <div class="inner" bar-horizontal="true"></div>
            </div>
            <div class="overlay"></div>
            <div class="values">9999/9999</div>
        </div>
        <!--<div class="battle-bar-light-mode energy-battle-bar-light-mode" data-trans="data-tip#stat-energy">-->
            <!--<div class="inner" bar-horizontal="true" bar-percent="100"></div>-->
            <!--<div class="value"></div>-->
        <!--</div>-->
        <!--<div class="battle-bar-light-mode mana-battle-bar-light-mode" data-trans="data-tip#stat-mana">-->
            <!--<div class="inner" bar-horizontal="true" bar-percent="100"></div>-->
            <!--<div class="value"></div>-->
        <!--</div>-->
    </div>`;

TEMPLATES['popup-menu-layer'] = `<div class="popup-menu-layer layer"> </div>`;

TEMPLATES['captcha-layer'] = `<div class="captcha-layer layer"></div>`;

//<!--<div data-template="console-and-mAlert-layer" class="layer">-->
//<!--<div class="big-messages"></div>-->
//<!--</div>-->

TEMPLATES['console-layer'] = `<div class="console-layer layer">
        <div class="big-messages"></div>
    </div>`;

TEMPLATES['mAlert-layer'] = `<div class="mAlert-layer layer">
        <div class="big-messages"></div>
        <div class="big-messages-light-mode"></div>
    </div>`;

TEMPLATES['mAlert-mobile-layer'] = `<div class="mAlert-mobile-layer layer"></div>`;

TEMPLATES['alerts-layer'] = `<div class="alerts-layer layer">
        <div class="big-messages"></div>
        <div id="debug"></div>
    </div>`;

TEMPLATES['sticky-tips-layer'] = `<div class="sticky-tips-layer layer"></div>`;
TEMPLATES['drop-to-delete-widget-layer'] = `<div class="drop-to-delete-widget-layer layer">
        <div class="up-part"></div>
        <div class="middle-part"></div>
        <div class="down-part"></div>
    </div>`;

TEMPLATES['tutorial-layer'] = `<div class="tutorial-layer layer"></div>`;

TEMPLATES['chat-layer'] = `<div class="chat-layer layer">
        <div class="chat-overlay"></div>
        <div class="mobile-magic-input-wrapper"></div>
        <div class="send-mobile-message-wrapper"></div>
        <!--<div class="chat-mobile-input-wrapper">-->
            <!--<div class="remaining-chars"></div>-->
            <!--<textarea  class="mobile-input" data-trans="placeholder#chat_message#chat"></textarea>-->
        <!--</div>-->
    </div>`

TEMPLATES['loader-layer'] = `<div class="loader-layer layer">
        <div class="bottom-info"></div>
        <div class="progress-bar">
            <div class="progress-bar-and-image-wrapper">
                <img class="loader-image" src="${CFG.oimg}/gui/loader/loader-image${isPl() && !isSeptemberEnd() ? '-onc' : ''}.png" alt="Loading" />
                <!--<div class="text" data-trans="#loading_inprogressnew#static"></div>-->
                <div class="inner-wrapper">
                    <div class="inner" bar-horizontal="true"></div>
                </div>
            </div>
        </div>
    </div>`

TEMPLATES['zoom-layer'] = `<div class="zoom-layer layer">
        <div class="zoom-overlay"></div>
        <div class="minus">
            <div class="m-graph"></div>
        </div>
        <div class="plus">
            <div class="p-graph"></div>
        </div>
        <div class="btn-wrapper"> </div>
    </div>`

TEMPLATES['echh-layer'] = `<div class="echh-layer layer"></div>`;

TEMPLATES['interface-layer'] = `<div class="interface-layer layer">
        <div class="game-layer">
            <div class="map-overlay filter-map-fog"></div>
            <div class="map-overlay filter-map-night"></div>
            <!--<canvas id="MAP_CANVAS"></canvas>-->
            <canvas id="GAME_CANVAS" oncontextmenu="return false;"></canvas>
            <div class="map-overlay filter-map-weather"></div>
        </div>
        <div class="pre-captcha"></div>
        <div class="quick_messages"></div>
        <div class="left-column main-column">
            <div class="inner-wrapper"></div>
            <div class="border">
                <div class="wanted-mini"></div>
            </div>
        </div>
        <div class="right-column main-column">
            <div class="inner-wrapper">
                <div class="right-main-column-wrapper">
                    <div class="bottom-wrapper"></div>
                </div>
                <!--<div class="bottom-wrapper"></div>-->
            </div>
            <div class="border"></div>
            <div class="extended-stats scroll-wrapper">
                <div class="border"></div>
            </div>
        </div>
        <div class="top positioner">
            <div class="bg"></div>
            <div class="wanted-mini"></div>
            <div class="content">
                <div class="omg-tutorial-handler"></div>
                <div class="character-bars-light-mode">
                    <div class="hero-hp-top-progress-bar-light-mode interface-element-progress-bar-0">
                        <div class="inner" bar-horizontal="true" bar-percent="100"></div>
                        <div class="value"></div>
                    </div>
                    <div class="hero-exp-top-progress-bar-light-mode interface-element-progress-bar-0 yellow">
                        <div class="inner" bar-horizontal="true" bar-percent="100"></div>
                        <div class="value"></div>
                    </div>
                </div>
                <div class="gained-exp-indicator-light-mode"></div>
                <div data-trans="data-tip#iconchat" class="top-left-column-visibility-toggle column-visibility-toggle">
                    <div class="icon"></div>
                    <div class="amount interface-element-amount"></div>
                </div>
                <div data-trans="data-tip#eqcolumnshow" class="top-right-column-visibility-toggle column-visibility-toggle">
                    <div class="icon"></div>
                    <div class="amount interface-element-amount"></div>
                </div>
                <div class="top-left main-buttons-container"></div>
                <div class="hud-container"></div>
                <div class="matchmaking-timer"></div>
                <div class="top-right main-buttons-container"></div>
            </div>
        </div>
        <div class="bottom positioner">
            <div class="bg">
            </div>
            <div class="bg-additional-widget-left"></div>
            <div class="bg-additional-widget-right"></div>
            <div class="content">
                <div class="bottom-left-additional main-buttons-container"></div>
                <div class="bottom-right-additional main-buttons-container"></div>
                <div class="bottom-left main-buttons-container"></div>
                <div class="bottom-right main-buttons-container">
                    <div class="version-info"></div>
                    <div class="game-notifications"></div>
                </div>
            </div>
        </div>
    </div>`

TEMPLATES['hud-container'] = `<div class="hud-container">
        <div class="btn-min gold-btn">+</div>
        <div class="btn-min credits-btn">+</div>
        <div class="map_ball"></div>
        <div class="hero-data">
            <span class="heroname"></span>
        </div>
        <div class="map-data">
            <span class="map-timer"></span>
            <span class="location-id"></span>
            <span class="location"></span>
            <span class="coords"></span>
        </div>
        <div class="world-name"></div>
        <div class="gold-tip" data-trans="data-tip#gold"></div>
        <div class="credits-tip" data-trans="data-tip#stat-credits"></div>
        <div class="herogold"></div>
        <div class="herogold-difference"></div>
        <div class="herocredits"></div>
        <div class="herocredits-difference"></div>
        <div class="bm-register"></div>
        <div class="onc-btn"></div>
    </div>`

TEMPLATES['herogold-tip'] = `<div class="herogold-tip">
        <div class="h-gold"></div>
        <div class="h-gold-limit"></div>
    </div>`

TEMPLATES['bottom-panel-of-bottom-positioner'] = `<div class="bottom-panel-of-bottom-positioner bottom-panel">
        <div class="bottom-panel-graphic"></div>
        <!--<div class="helpers-numbers">-->
            <!--<span class="h-n-1">1</span>-->
            <!--<span class="h-n-2">2</span>-->
            <!--<span class="h-n-3">3</span>-->
            <!--<span class="h-n-4">4</span>-->
            <!--<span class="h-n-5">5</span>-->
            <!--<span class="h-n-6">6</span>-->
            <!--<span class="h-n-7">7</span>-->
            <!--<span class="h-n-8">8</span>-->
        <!--</div>-->

        <div class="battle-bars-wrapper-template"></div>
        <!--<div class="exp-bar-wrapper-template"></div>-->
        <div class="hp-indicator-wrapper-template"></div>

        <div class="lagmeter">
            <div class="lag"></div>
        </div>
        <!--
        <div class="slots right" data-trans="data-tip#hot_items_info">
            <div class="usable-slot usable-slot-8 interface-element-one-item-slot-2"><div class="help-number">8</div></div>
            <div class="usable-slot usable-slot-7 interface-element-one-item-slot-2"><div class="help-number">7</div></div>
            <div class="usable-slot usable-slot-6 interface-element-one-item-slot-2"><div class="help-number">6</div></div>
            <div class="usable-slot usable-slot-5 interface-element-one-item-slot-2"><div class="help-number">5</div></div>
        </div>
        <div class="slots left" data-trans="data-tip#hot_items_info">
            <div class="usable-slot usable-slot-1 interface-element-one-item-slot-2"><div class="help-number">1</div></div>
            <div class="usable-slot usable-slot-2 interface-element-one-item-slot-2"><div class="help-number">2</div></div>
            <div class="usable-slot usable-slot-3 interface-element-one-item-slot-2"><div class="help-number">3</div></div>
            <div class="usable-slot usable-slot-4 interface-element-one-item-slot-2"><div class="help-number">4</div></div>
        </div>
        -->
        <div class="slots right" data-trans="data-tip#hot_items_info">
            <div class="usable-slot usable-slot-8 interface-element-one-item-slot-2"></div>
            <div class="usable-slot usable-slot-7 interface-element-one-item-slot-2"></div>
            <div class="usable-slot usable-slot-6 interface-element-one-item-slot-2"></div>
            <div class="usable-slot usable-slot-5 interface-element-one-item-slot-2"></div>
        </div>
        <div class="slots left" data-trans="data-tip#hot_items_info">
            <div class="usable-slot usable-slot-1 interface-element-one-item-slot-2"></div>
            <div class="usable-slot usable-slot-2 interface-element-one-item-slot-2"></div>
            <div class="usable-slot usable-slot-3 interface-element-one-item-slot-2"></div>
            <div class="usable-slot usable-slot-4 interface-element-one-item-slot-2"></div>
        </div>
        <div class="exp-bar-wrapper-template"></div>
        <div class="exp-bar"></div>
        <div class="gained-exp-indicator"></div>
        <div class="bottom-panel-pointer-bg">
            <div class="pointer-exp-graphic"></div>
            <div class="pointer-ttl-graphic"></div>
            <div class="pointer-exp" data-trans="data-tip#exp#exp-ttl-pointer"></div>
            <div class="pointer-ttl" data-trans="data-tip#ttl#exp-ttl-pointer"></div>
        </div>
        <div class="skill-usable-slots left">
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="0"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="1"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="2"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="3"></div>
        </div>
        <div class="skill-usable-slots right">
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="7"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="6"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="5"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="4"></div>
        </div>
    </div>`


TEMPLATES['mini-map-controller'] = `<div class="mini-map-controller mini-map">
        <!--<div class="mini-map-header">-->
        <!--<div class="graphic"></div>-->
        <!--<div class="mini-map-label"></div>-->
        <!--</div>-->
        <div class="mini-map-map">
            <div class="graphic interface-element-middle-1-background"></div>
            <div class="mini-local-map"></div>
            <div class="mini-global-map-overflow">
                <div class="mini-global-map"></div>
            </div>
            <div class="mini-map-mouse-move"></div>
        </div>
        <div class="mini-map-panel">
            <div class="interface-element-active-card-background-stretch"></div>
            <div class="mini-map-buttons"></div>
        </div>
        <div class="mini-map-content"></div>
    </div>`;


TEMPLATES['extended-stats-tpl'] = `<div class="extended-stats-tpl scroll-pane">

        <div class="stats-section">
            <h3 data-trans="stats_attack"></h3>

            <div class="damage-section">
                <!-- filled in runime from few values !-->
                <div class="stat-row damage-normal warrior-stats" data-herostat="damage-normal">
                    <span class="label" data-trans="stat-damage-normal"></span>
                    <span class="value">-</span>
                </div>
                <div class="stat-row damage-offhand warrior-stats" data-herostat="damage-offhand" data-trans="data-tip#herostat-tip-damage-offhand">
                    <span class="label" data-trans="stat-damage-offhand"></span>
                    <span class="value">-</span>
                </div>
                <div class="stat-row damage-fire warrior-stats" data-herostat="damage-fire"  data-trans="data-tip#herostat-tip-damage-fire">
                    <span class="label" data-trans="stat-damage-fire"></span>
                    <span class="value">-</span>
                </div>
                <div class="stat-row damage-lightning warrior-stats" data-herostat="damage-lightning" data-trans="data-tip#herostat-tip-damage-lightning">
                    <span class="label" data-trans="stat-damage-lightning"></span>
                    <span class="value">-</span>
                </div>
                <div class="stat-row damage-cold warrior-stats" data-herostat="damage-cold" data-trans="data-tip#herostat-tip-damage-cold">
                    <span class="label" data-trans="stat-damage-cold"></span>
                    <span class="value">-</span>
                </div>
                <div class="stat-row damage-poison warrior-stats" data-herostat="damage-poison" data-trans="data-tip#herostat-tip-damage-poison">
                    <span class="label" data-trans="stat-damage-poison"></span>
                    <span class="value">-</span>
                </div>

                <div class="stat-group">
                    <h4 class="poison-header" data-trans="poison-header"></h4>
                    <div class="wound-stat-group">
                        <div class="stat-row damage-poison1 warrior-stats" data-herostat="poison1" data-trans="data-tip#herostat-tip-poison1">
                            <span class="label" data-trans="stat-poison1"></span>
                            <span class="value">-</span>
                        </div>
                        <div class="stat-row damage-of_poison1 warrior-stats" data-herostat="of_poison1" data-trans="data-tip#herostat-tip-of_poison1">
                            <span class="label" data-trans="stat-of_poison1"></span>
                            <span class="value">-</span>
                        </div>
                        <div class="stat-row damage-poison0 warrior-stats" data-herostat="poison0" data-trans="data-tip#herostat-tip-poison0">
                            <span class="label" data-trans="stat-poison0"></span>
                            <span class="value">-</span>
                        </div>
                    </div>
                </div>

                <div class="stat-group">
                    <h4 class="wound-header" data-trans="wound-header"></h4>
                    <div class="wound-stat-group">
                        <div class="stat-row damage-wound0 warrior-stats" data-herostat="wound0" data-trans="data-tip#herostat-tip-wound0">
                            <span class="label" data-trans="stat-wound0"></span>
                            <span class="value">-</span>
                        </div>
                        <div class="stat-row damage-wound1 warrior-stats" data-herostat="wound1" data-trans="data-tip#herostat-tip-wound1">
                            <span class="label" data-trans="stat-wound1"></span>
                            <span class="value">-</span>
                        </div>
                        <div class="stat-row damage-of_wound0 warrior-stats" data-herostat="of_wound0"  data-trans="data-tip#herostat-tip-of_wound0">
                            <span class="label" data-trans="stat-of_wound0"></span>
                            <span class="value">-</span>
                        </div>
                        <div class="stat-row damage-of_wound1 warrior-stats" data-herostat="of_wound1"  data-trans="data-tip#herostat-tip-of_wound1">
                            <span class="label" data-trans="stat-of_wound1"></span>
                            <span class="value">-</span>
                        </div>
                    </div>
                </div>
            </div>


            <div class="stat-row warrior-stats" data-herostat="speed-attack" data-trans="data-tip#herostat-tip-speed-attack"><span class="label" data-trans="stat-speed-attack"></span><span class="value">-</span></div>

            <div class="stat-row warrior-stats" data-herostat="crit-chance" data-trans="data-tip#herostat-tip-crit-chance"><span class="label" data-trans="stat-critic-chance"></span><span class="value">-</span></div>

            <div class="stat-row warrior-stats" data-herostat="helper-crit-chance" data-trans="data-tip#herostat-tip-helper-crit-chance"><span class="label" data-trans="stat-helper-critic-chance"></span><span class="value">-</span></div>

            <div class="stat-group">
                <h4 class ="magic-crit-title" data-trans="magic-crit-title"></h4>

                <div class="sub-stat-group">
                
                    <div class="stat-row warrior-stats" data-herostat="crit-power" data-trans="data-tip#herostat-tip-crit-power"><span class="label" data-trans="stat-critic-pow"></span><span class="value">-</span></div>

                    <div class="stat-row warrior-stats" data-herostat="helper-crit-power" data-trans="data-tip#herostat-tip-helper-crit-power"><span class="label" data-trans="stat-helper-critic-pow"></span><span class="value">-</span></div>

                    <div class="stat-row warrior-stats" data-herostat="mcrit-fire" data-trans="data-tip#herostat-tip-mcrit-fire"><span class="label" data-trans="mcrit-fire"></span><span class="value">-</span></div>

                    <div class="stat-row warrior-stats" data-herostat="mcrit-lightning" data-trans="data-tip#herostat-tip-mcrit-lightning"><span class="label" data-trans="mcrit-light"></span><span class="value">-</span></div>

                    <div class="stat-row warrior-stats" data-herostat="mcrit-cold" data-trans="data-tip#herostat-tip-mcrit-cold"><span class="label" data-trans="mcrit-cold"></span><span class="value">-</span></div>

                </div>
            </div>

            <div class="stat-row warrior-stats" data-herostat="acdmg" data-trans="data-tip#herostat-tip-acdmg">
                <span class="label" data-trans="stat-acdmg"></span>
                <span class="value">-</span>
            </div>

            <div class="stat-row warrior-stats" data-herostat="slow" data-trans="data-tip#herostat-tip-slow">
                <span class="label" data-trans="stat-slow"></span>
                <span class="value">-</span>
            </div>

            <div class="stat-row warrior-stats" data-herostat="lowevade" data-trans="data-tip#herostat-tip-lowevade">
                <span class="label" data-trans="stat-lowevade"></span>
                <span class="value">-</span>
            </div>

            <div class="stat-row warrior-stats" data-herostat="acmdmg" data-trans="data-tip#herostat-tip-acmdmg">
                <span class="label" data-trans="stat-acmdmg"></span>
                <span class="value">-</span>
            </div>
        </div>

        <div class="stats-section">
            <h3 data-trans="stats_defence"></h3>

            <div class="stat-row warrior-stats" data-herostat="armor-class" data-trans="data-tip#herostat-tip-armor-class">
                <span class="label" data-trans="def-ac"></span>
                <span class="value">-</span>
            </div>

            <div class="stat-row warrior-stats" data-herostat="lowcrit" data-trans="data-tip#herostat-tip-lowcrit">
                <span class="label" data-trans="stat-lowcrit"></span>
                <span class="value">-</span>
            </div>


            <div class="stat-row warrior-stats" data-herostat="evade" data-trans="data-tip#herostat-tip-evade">
                <span class="label" data-trans="def-evade"></span>
                <span class="value">-</span>
            </div>

            <div class="stat-row warrior-stats" data-herostat="block" data-trans="data-tip#herostat-tip-block"><span class="label" data-trans="def-block"></span><span class="value">-</span></div>

            <div class="stat-row warrior-stats" data-herostat="heal" data-trans="data-tip#herostat-tip-heal"><span class="label" data-trans="def-heal"></span><span class="value">-</span></div>

            <div class="stat-row warrior-stats" data-herostat="absorb" data-trans="data-tip#herostat-tip-absorb"><span class="label" data-trans="def-absorb"></span><span class="value">-</span></div>

            <div class="stat-row warrior-stats" data-herostat="absorbm" data-trans="data-tip#herostat-tip-absorbm"><span class="label" data-trans="def-absorbm"></span><span class="value">-</span></div>

            <div class="stat-group">
                <h4 data-trans="def-res"></h4>

                <div class="sub-stat-group">

                    <div class="stat-row res-fire" data-herostat="res-fire" data-trans="data-tip#herostat-tip-res-fire"><span class="label" data-trans="res-fire"></span><span class="value">-</span></div>

                    <div class="stat-row res-fire" data-herostat="res-lightning" data-trans="data-tip#herostat-tip-res-lightning"><span class="label" data-trans="res-light"></span><span class="value">-</span></div>

                    <div class="stat-row res-fire" data-herostat="res-cold" data-trans="data-tip#herostat-tip-res-cold"><span class="label" data-trans="res-cold"></span><span class="value">-</span></div>

                    <div class="stat-row res-fire" data-herostat="res-poison" data-trans="data-tip#herostat-tip-res-poison"><span class="label" data-trans="res-poison"></span><span class="value">-</span></div>
                </div>
            </div>
            <div class="stat-row warrior-stats text-stat" data-herostat="fatigs-mana" data-trans="data-tip#herostat-tip-fatigs-mana">
                <span class="value">-</span>
            </div>
            <div class="stat-row warrior-stats text-stat" data-herostat="fatigs-energy" data-trans="data-tip#herostat-tip-fatigs-energy">
                <span class="value">-</span>
            </div>
            
            <div class="stat-row warrior-stats" data-herostat="manadest" data-trans="data-tip#herostat-tip-manadest">
                <span class="label" data-trans="stat-manadest"></span>
                <span class="value">-</span>
            </div>

            <div class="stat-row warrior-stats" data-herostat="endest" data-trans="data-tip#herostat-tip-endest">
                <span class="label" data-trans="stat-endest"></span>
                <span class="value">-</span>
            </div>
        </div>

        <div class="stats-section">
            <h3 data-trans="stats_power"></h3>

            <div class="stat-row warrior-stats" data-herostat="mana" data-trans="data-tip#herostat-tip-mana">
                <span class="label" data-trans="stat-mana"></span>
                <span class="value">-</span>
            </div>
            <div class="stat-row warrior-stats" data-herostat="energy" data-trans="data-tip#herostat-tip-energy">
                <span class="label" data-trans="stat-energy"></span>
                <span class="value">-</span>
            </div>
            <div class="stat-row warrior-stats" data-herostat="energygain" data-trans="data-tip#herostat-tip-energygain">
                <span class="label" data-trans="stat-energygain"></span>
                <span class="value">-</span>
            </div>
            <div class="stat-row warrior-stats" data-herostat="managain" data-trans="data-tip#herostat-tip-managain">
                <span class="label" data-trans="stat-managain"></span>
                <span class="value">-</span>
            </div>
        </div>

        <div class="stats-section">
            <h3 data-trans="stats_basic"></h3>

            <div class="hand-out-points"></div>

            <div class="stat-row warrior-stats" data-herostat="strength" data-trans="data-tip#herostat-tip-strength">
                <span class="label" data-trans="stat-strength"></span>
                <span class="value">-</span>
            </div>
            <div class="stat-row warrior-stats" data-herostat="dexterity" data-trans="data-tip#herostat-tip-dexterity">
                <span class="label" data-trans="stat-dexterity"></span>
                <span class="value">-</span>

            </div>
            <div class="stat-row warrior-stats" data-herostat="intelligence" data-trans="data-tip#herostat-tip-intelligence">
                <span class="label" data-trans="stat-inteligence"></span>
                <span class="value">-</span>
            </div>
        </div>

        <div class="stats-section">
            <h3 data-trans="stats_aux"></h3>

            <div class="stat-row" data-herostat="honor-points" data-trans="data-tip#herostat-tip-honor-points"><span class="label" data-trans="stat-honor"></span><span class="value">-</span></div>
            <div class="stat-row" data-herostat="dragonite-tmp" data-trans="data-tip#herostat-tip-dragonite-tmp"><span class="label" data-trans="stat-credits2"></span><span class="value">-</span></div>
            <div class="stat-row" data-herostat="stamina" data-trans="data-tip#herostat-tip-stamina"><span class="label" data-trans="stat-stamina"></span><span class="value">-</span></div>
            <div class="stat-group">
                <h4 class="passive-stats-header" data-trans="passive-stats-header"></h4>
                <div class="sub-stat-group">
                    <div class="stat-row passive-stats" data-herostat="resp_reduction" data-trans="data-tip#herostat-tip-resp_reduction" data-unit="%"><span class="label" data-trans="stat-resp_reduction"></span><span class="value">-</span></div>
                    <div class="stat-row passive-stats" data-herostat="after_heal-chance" data-trans="data-tip#herostat-tip-after_heal-chance" data-unit="%"><span class="label" data-trans="stat-after_heal-chance"></span><span class="value">-</span></div>
                    <div class="stat-row passive-stats" data-herostat="after_heal-power" data-trans="data-tip#herostat-tip-after_heal-power"><span class="label" data-trans="stat-after_heal-power"></span><span class="value">-</span></div>
                </div>
            </div>
           
            
        </div>

        <div class="stats-section legends">
            <h3 data-trans="legend_bonuses"></h3>
            <span data-trans="#no_leg_bon" class="nolegbon-tmp"></span>
            <div class="bonuses"></div>
        </div>
    </div>`;



TEMPLATES['interface-element-equipment-with-additional-bag'] = `<div class="interface-element-equipment-with-additional-bag">
        <div class="equipment-wrapper-outline">
            <div class="equipment-outline-1 equipment-outline"></div>
            <div class="equipment-outline-2 equipment-outline"></div>
            <div class="equipment-outline-3 equipment-outline"></div>
            <div class="equipment-outline-4 equipment-outline"></div>
        </div>
        <div class="eq-slot" data-st="10"></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="1"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="2"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="3"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="4"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="5"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="6"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="7"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="8"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="9"><div class="eq-cl"></div></div>
    </div>`;


TEMPLATES['interface-element-equipment'] = `<div class="interface-element-equipment">
        <div class="equipment-wrapper-outline">
            <div class="equipment-outline-1 equipment-outline"></div>
            <div class="equipment-outline-2 equipment-outline"></div>
            <div class="equipment-outline-3 equipment-outline"></div>
            <div class="equipment-outline-4 equipment-outline"></div>
        </div>
        <div class="eq-slot" data-st="10"></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="1"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="2"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="3"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="4"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="5"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="6"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="7"><div class="eq-cl"></div></div>
        <div class="eq-slot interface-element-one-item-slot-background-to-repeat" data-st="8"><div class="eq-cl"></div></div>
    </div>`;

TEMPLATES['character_wrapper'] = `<div class="character_wrapper">
        <div class="hero-name-light-mode">
            <div class="hero-name"></div>
        </div>
        <div class="location-wrapper-light-mode interface-element-grid-border">
            <div class="location-wrapper-border interface-element-background-color-3 interface-element-box-shadow-2">
                <div class="map-ball"></div>
                <div class="location-name"></div>
                <div class="location-cords"></div>
            </div>
        </div>
        <div class="world-wrapper-light-mode interface-element-grid-border">
            <div class="world-wrapper-border interface-element-background-color-3 interface-element-box-shadow-2">
                <div class="world-name"></div>
            </div>
        </div>
        <div class="progress-bars-light-mode">
            <div class="hero-hp-progress-bar hero-progress-bar-light-mode interface-element-progress-bar-1">
                <div class="inner" bar-horizontal="true" bar-percent="100"></div>
                <div class="value"></div>
            </div>
            <div class="hero-exp-progress-bar hero-progress-bar-light-mode interface-element-progress-bar-1 yellow">
                <div class="inner" bar-horizontal="true" bar-percent="100"></div>
                <div class="value"></div>
            </div>
        </div>

        <div class="currency-light-mode interface-element-grid-border">
            <div class="currency-border interface-element-background-color-3 interface-element-box-shadow-2">
                <div class="gold-currency"></div>
                <div class="sl-currency"></div>
            </div>
        </div>
        <div class="stats-light-mode interface-element-grid-border">
            <div class="stats-border interface-element-background-color-3 interface-element-box-shadow-2">
                <div class="stats-button"></div>
                <ul class="stats-list">
                    <li class="attack" data-trans="data-tip#attack#stats"><span class="icon"></span><span class="value"></span></li>
                    <li class="attack-speed" data-trans="data-tip#attack-speed#stats"><span class="icon"></span><span class="value"></span></li>
                    <li class="defence" data-trans="data-tip#defence#stats"><span class="icon"></span><span class="value"></span></li>
                    <li class="resists" data-trans="data-tip#resists#stats">
                        <span class="icon"></span>
                        <span class="value">
                            <span class="resist-stats">
                                <span class="stat red js-res-fire"></span> /
                                <span class="stat yellow js-res-light"></span> /
                                <span class="stat blue js-res-frost"></span> /
                                <span class="stat green js-res-poison"></span> %
                            </span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="equipment-wrapper">
        </div>
        <div class="builds-interface">
            <div class="choose-build build-index"></div>
        </div>
        <div class="lagmeter-light-mode">
            <div class="lag-val">0</div>
            <div class="lag">
                <div class="one-lag lag-5"></div>
                <div class="one-lag lag-4"></div>
                <div class="one-lag lag-3"></div>
                <div class="one-lag lag-2"></div>
                <div class="one-lag lag-1"></div>
                <div class="one-lag lag-0"></div>
            </div>
        </div>
        <div class="stats-wrapper interface-element-background-color-3 interface-element-box-shadow-2 interface-element-grid-border">
            <div class="header-title-wrapper">
                <div class="interface-element-active-card-background-stretch"></div>
                <div class="header-title" data-trans="#stats-head-title#stats"></div>
            </div>
            <div class="stats-button"></div>
            <ul class="stats-list">
                <li class="attack" data-trans="data-tip#attack#stats"><span class="icon"></span><span class="value"></span></li>
                <li class="attack-speed" data-trans="data-tip#attack-speed#stats"><span class="icon"></span><span class="value"></span></li>
                <li class="defence" data-trans="data-tip#defence#stats"><span class="icon"></span><span class="value"></span></li>
                <li class="resists" data-trans="data-tip#resists#stats">
                    <span class="icon"></span>
                    <span class="value">
                        <span class="resist-stats">
                            <span class="stat red js-res-fire"></span> /
                            <span class="stat yellow js-res-light"></span> /
                            <span class="stat blue js-res-frost"></span> /
                            <span class="stat green js-res-poison"></span> %
                        </span>
                    </span>
                </li>
            </ul>
        </div>
        <div class="pvp-btn" data-trans="data-tip#pvp_tip#buttons" data-tip-type="t_static"></div>
        <div class="bm-register-light-mode"></div>
    </div>`

TEMPLATES['stat'] = `<span class="stat"></span>`

TEMPLATES['battle-set-wrapper'] = `<div class="battle-set-wrapper">
        <div class="battle-set-choice"></div>
        <div class="battle-set-choice"></div>
        <div class="battle-set-choice"></div>
    </div>`

//<!--<div data-template="equipment-wrapper">-->
//<!--<div class="eq-slot" data-st="10"></div>-->
//<!--<div class="eq-slot" data-st="1"></div>-->
//<!--<div class="eq-slot" data-st="2"></div>-->
//<!--<div class="eq-slot" data-st="3"></div>-->
//<!--<div class="eq-slot" data-st="4"></div>-->
//<!--<div class="eq-slot" data-st="5"></div>-->
//<!--<div class="eq-slot" data-st="6"></div>-->
//<!--<div class="eq-slot" data-st="7"></div>-->
//<!--<div class="eq-slot" data-st="8"></div>-->
//<!--<div class="eq-slot" data-st="9"></div>-->
//<!--<div class="skill-switch"></div>-->
//<!--</div>-->

TEMPLATES['inventory_wrapper'] = `<div class="inventory_wrapper">
        <div class="bags-navigation-bg interface-element-grid-border">
            <div class="interface-element-one-black-tile bag-1"><div class="interface-element-bag-eq-icon-background"></div></div>
            <div class="interface-element-one-black-tile bag-2"><div class="interface-element-bag-eq-icon-background"></div></div>
            <div class="interface-element-one-black-tile bag-3"><div class="interface-element-bag-eq-icon-background"></div></div>
            <div class="interface-element-one-black-tile bag-4"><div class="interface-element-bag-eq-icon-background"></div></div>
            <div class="bags-navigation">
                <div class="tutorial-bag"></div>
                <div class="bag-2-slot" data-trans="data-tip#bag_space"></div>
                <div class="bag-3-slot" data-trans="data-tip#bag_space"></div>
                <div class="bag-4-slot" data-trans="data-tip#keys_bag_space"></div>
            </div>
        </div>
        <div class="inventory-grid-bg interface-element-grid-border">
            <div class="interface-element-item-slot-grid-stretch"></div>
            <div class="inventory-grid">
                <div class="inner-grid">
                    <div class="scroll-pane"></div>
                </div>
            </div>
        </div>
    </div>`

TEMPLATES['b_wrapper'] = `<div class="b_wrapper">
        <div class="all-b"></div>
        <div class="left"></div>
        <div class="right"></div>
    </div>`

TEMPLATES['captcha-pre-info'] = `<div class="captcha-pre-info">
        <span data-trans="#captcha_time"></span>
        <span class="captcha-pre-info__time"></span>s
        <div class="captcha-pre-info__button"></div>
        <div class="captcha-pre-info__toggler">
            <div class="captcha-pre-info__arrow"></div>
        </div>
    </div>`

//TEMPLATES['chat-tpl'] = `<div class="chat-tpl section">
//    <div class="chat-pannel"></div>
//    <div class="tabs-pannel"></div>
//    <div class="right-tabs-wrapper connectedSortable"></div>
//    <div class="tabs-wrapper connectedSortable"></div>
//    <div class="messages-wrapper scroll-wrapper">
//        <div class="under-tab-decor"></div>
//        <div class="scroll-pane"></div>
//    </div>
//    <div class="input-wrapper">
//        <input data-trans="placeholder#enter_to_chat#chat" autocomplete="off" />
//    </div>
//    <div class="send-btn right"></div>
//    <div class="chat-plug"></div>
//</div>`

TEMPLATES['hp-indicator-wrapper'] = `<div class="hp-indicator-wrapper">
        <div class="hp-indicator">
            <div class="blood-frame"></div>
            <div class="blood" bar-horizontal="false"></div>
            <div class="hpp"><span class="value">50</span></div>
        </div>
        <div class="glass"></div>
    </div>`

TEMPLATES['exp-bar-wrapper'] = `<div class="exp-bar-wrapper">
        <div class="exp-progress left">
            <div class="progress">
                <div class="inner" bar-horizontal="true"></div>
            </div>
            <div class="overlay"></div>
            <div class="ribbon"></div>
            <div class="ribbon-up"></div>
            <div class="ribbon-down"></div>
        </div>
        <div class="exp-progress right">
            <div class="progress">
                <div class="inner" bar-horizontal="true"></div>
            </div>
            <div class="overlay"></div>
            <div class="ribbon"></div>
            <div class="ribbon-up"></div>
            <div class="ribbon-down"></div>
        </div>
    </div>`;

TEMPLATES['one-legend-bonus'] = `<div class="one-legend-bonus"></div>`;

//<!-- widget button !-->
TEMPLATES['widget-button'] = `<div class="widget-button">
        <div class="icon"></div>
        <div class="amount"></div>
    </div>`;

TEMPLATES['empty-slot-widget'] = `<div class="empty-slot-widget"></div>`;

//<!-- standard button !-->
TEMPLATES['button'] = `<div class="button">
        <div class="background"></div>
        <div class="label"></div>
    </div>`;

TEMPLATES['settings-button'] = `<div class="settings-button" data-trans="data-tip#option"></div>`;

TEMPLATES['toggle-size-button'] = `<div class="toggle-size-button" data-trans="data-tip#change_size"></div>`;

TEMPLATES['change-visible-button'] = `<div class="change-visible-button" data-trans="data-tip#change-visible-button"></div>`;

TEMPLATES['delete-button'] = `<div class="delete-button" data-trans="data-tip#delete"></div>`;

//<!-- tooltip !-->
TEMPLATES['tip-wrapper'] = `<div class="tip-wrapper">
        <div class="content"></div>
    </div>`;

//<!-- item template !-->
TEMPLATES['item'] = `<div class="item">
        <div class="highlight"></div>
        <canvas class="icon canvas-icon" width="32" height="32"></canvas>
        <canvas class="canvas-notice" width="32" height="32"></canvas>
    </div>`;
// <div class="icon css-icon"></div>
// <div class="cooldown"></div>

TEMPLATES['alert-item'] = `<div class="alert-item">
        <div class="alert-item-name"></div>
        <div class="alert-item-icon"></div>
    </div>`;

TEMPLATES['new-item'] = `<div class="new-item"></div>`;

TEMPLATES['afterUseBottonItem'] = `<div class="afterUseBottonItem"></div>`;

TEMPLATES['right-column-notif'] = `<div class="right-column-notif">
        <span class="notif-value c-amount"></span>
    </div>`;

TEMPLATES['popup-menu'] = `<div class="popup-menu"></div>`;
TEMPLATES['popup-menu-header'] = `<div class="popup-menu__header"></div>`;

TEMPLATES['menu-item'] = `<div class="menu-item"></div>`;

//<!--  bubbledialog template !-->
TEMPLATES['bubbledialog'] = `<div class="bubbledialog">
        <div class="bg-layer">
            <div class="top-frame"></div>
            <div class="left-frame"></div>
            <div class="right-frame"></div>
            <div class="bottom-frame"></div>
        </div>
        <div class="content-layer">
            <div class="inner">
                <div class="container">
                    <div class="message"></div>
                    <ul class="answers"></ul>
                </div>
            </div>
        </div>
    </div>`;

//<!--  bubbledialog answer template !-->
TEMPLATES['bubbledialog-answer'] = `<li class="bubbledialog-answer answer"></li>`;

//<!-- console !-->
TEMPLATES['console-window'] = `<div class="console-window">
        <div class="console-background interface-element-middle-2-background"></div>
        <div class="size-button toggle-size-button"></div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class=console-content></div>
            </div>
        </div>
        <div class="input-wrapper">
            <div class="gt_console">&gt;</div>
            <input class="console-input" id="console_input" placeholder="Console input" autocomplete="off"/>
        </div>
        <div class="console-bottom-panel-wrapper">
            <!--<div class="console-bottom-panel"></div>-->
            <div class="interface-element-bottom-bar-background-stretch"></div>
        </div>
    </div>`;


TEMPLATES['console-message'] = `<div class="console-message"></div>`;

//<!--&lt;!&ndash; wanted window !&ndash;&gt;-->
//<!--<div data-template="wanted-window">-->
//<!--<div class="header">-->
//<!--<span></span>-->
//<!--<input class="default">-->
//<!--</div>-->
//<!--<div class="waiter"></div>-->
//<!--<div class="pk-list-info"></div>-->
//<!--<div class="scroll-wrapper">-->
//<!--<div class="scroll-pane"></div>-->
//<!--</div>-->
//<!--</div>-->
//
//<!-- wanted-list !-->

TEMPLATES['wanted-list'] = `<div class="wanted-list">
        <div class="scroll-wrapper">
            <div class="scroll-pane">
                <div class="empty row-in-trans-window">----</div>
            </div>
        </div>
    </div>`

TEMPLATES['one-wanted'] = `<div class="one-wanted tw-list-item">
        <div class="nick"><div class="inner"></div></div>
        <div class="city"><div class="inner"></div></div>
        <div class="cords"></div>
    </div>`


TEMPLATES['one-baner'] = `<div class="one-baner"></div>`

TEMPLATES['mails-window'] = `
    <div class="mails-window">
        <div class="how-mail-or-char"></div>
        <div class="mails-window__tabs"></div>
        <div class="mails-window__contents"></div>
        <div class="bottom-mail-panel">
            <!--<div class="bottom-panel-graphics"></div>-->
            <div class="interface-element-bottom-bar-background-stretch"></div>
        </div>
    </div>`;

//<!-- mail column !-->
TEMPLATES['mail-column'] = `<div class="mail-column">
        <div class="middle-graphic interface-element-middle-1-background"></div>
        <div class="content-header interface-element-bottom-bar-background-stretch"></div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane"></div>
        </div>
        <div class="footer"></div>
    </div>`

//<!-- new mail -->
TEMPLATES['new-message'] = `<div class="new-message">
        <div class="middle-graphic interface-element-middle-1-background"></div>
        <div class="new-message-wrapper">
            <div class="content-header">
                <div class="interface-element-bottom-bar-background-stretch"></div>
                <div class="to">
                    <!--<div class="to-label to-item"></div>-->
                    <div class="wrapper-mail-to to-item">
                        <input data-trans="placeholder#recipient#mails" class="mail-to default"/>
                    </div>
                    <div class="to-buttons to-item"></div>
                </div>
            </div>
            <div class="text-area-wrapper">
                <textarea data-trans="placeholder#msgtext#mails" class="mail-msg"></textarea>
            </div>
        </div>
        <div class="footer">
            <div class="atachments">
                <div class="item-label foot-item"></div>
                <div class="foot-item">
                    <div class="send-item interface-element-one-item-slot"></div>
                </div>
                <div class="money-label foot-item"></div>
                <div class="wrapper-money-imput foot-item">
                    <input class="money-amount default"/>
                </div>
                <div class="send-mail-buttons foot-item"></div>
            </div>
        </div>
    </div>`

//<!-- one mail -->
TEMPLATES['one-mail-wraper'] = `<div class="one-mail-wraper">
        <div class="one-mail-head">
            <span class="from"></span>
            <span class="small"></span>
            <span class="when"></span>
        </div>
        <div class="msg-content"></div>
        <div class="mail-footer">
            <div class="a-info"></div>
            <div class="a-item">
            </div>
            <div class="a-money">
                <div class="item">
                    <div class="img"></div>
                </div>
            </div>
            <div class="a-tears">
                <div class="item">
                    <div class="img"></div>
                </div>
            </div>
        </div>
    </div>`

TEMPLATES['mail-fraud'] = `<div class="mail-fraud fraud"></div>`

TEMPLATES['mails-container'] = `<div class="mails-container"></div>`

TEMPLATES['mail-is-new'] = `<span class="mail-is-new is-new"></span>`

TEMPLATES['mail-box-empty'] = `<div class="mail-box-empty is-new"></div>`

//<!-- recovery Items !-->
TEMPLATES['recovery-item'] = `<div class="recovery-item">
        <!--<div class="header-graphics"></div>-->
        <!--<div class="header-wrapper">-->
        <!--<div class="graphic"></div>-->
        <!--<div class="edit-header-label" data-trans="#item_recover_header"></div>-->
        <!--</div>-->
        <!--<div class="info-1"> </div>-->
        <div class="middle-graphics interface-element-middle-1-background-stretch"></div>
        <!--<div class="info-2-wood interface-element-wood-box-background"></div>-->
        <!--<div class="info-box info-2"></div>-->
        <div class="info-box info-3">
            <div class="table-wrapper">
                <div class="text-1"></div>
                <!--<div class="img-wrapper">-->
                    <!--<div class="val">75</div>-->
                    <!--<div class="sl-graphics"></div>-->
                <!--</div>-->
            </div>
        </div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">

                <!--<div class="paper-graphics"></div>-->
<!--                <table class="recovery-items-table"></table>-->
            </div>
            <table class="static-bar-table interface-element-table-3"></table>
        </div>
        <div class="recover-bottom-panel">
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="chest-wrapper">
                <div class="interface-element-chest-sl"></div>
            </div>
            <div class="info-label"></div>
            <div class="buy-sl"></div>
        </div>
    </div>`

TEMPLATES['item-slot'] = `<div class="item-slot interface-element-one-item-slot"></div>`

TEMPLATES['tutorial'] = `<div class="tutorial">
        <!--<div class="paper-graphics"></div>-->
        <!--<div class="avatar"></div>-->
        <div class="graphic-area"></div>
        <div class="click-area"></div>
        <div class="con"></div>
        <div class="buttons">
            <div class="off-tutorial"></div>
            <div class="right-buttons">
                <div class="skip-tutorial"></div>
                <div class="finish-tutorial"></div>
            </div>
        </div>
    </div>`


//<!-- loading-element-component -->
TEMPLATES['loading-element-component'] = `<div class="loading-element-component">
        <div class="loading-element-text"></div>
    </div>`;

//<!-- depo -->
TEMPLATES['depo'] = `<div class="depo">
        <!--<div class="depo-header">-->
        <!--<div class="header-graphic"></div>-->
        <!--<div class="depo-header-label"></div>-->
        <!--</div>-->
        <div class="depo-graphic-background interface-element-middle-1-background"></div>
        <div class="find-and-manage-money-section">
            <div class="left-part">
                <div class="search-wrapper default">
                    <input class="search" data-trans="placeholder#search"/>
                    <div class="search-x" data-trans="data-tip#delete"></div>
                </div>
                <div class="manage-money-wrapper">
                    <!--<div class="manage-money-wrapper-graphic"></div>-->
                    <div class="interface-element-header-1-background-stretch"></div>
                    <div class="payments-bar-wrapper">
                        <div class="price-wrapper">
                            <input class="price default" data-trans="placeholder#fill-gold-value#depo"/>
                            <div class="info-icon" data-tip-type="t-left" data-trans="data-tip#unit_tip#depo"></div>
                        </div>
                        <div class="give"></div>
                        <div class="get"></div>
                    </div>
                </div>
            </div>

            <div class="right-part">
                <div class="money-info interface-element-wood-box-background"></div>
                <div class="gold-amound" data-trans="#gold-in-depo#depo"></div>
                <div class="gold-value"></div>
                <div class="date-available" data-trans="#date-available#depo"></div>
                <div class="date-value"></div>
            </div>
        </div>
        <div class="filter-section">
            <div class="filter-section-graphic"></div>
            <div class="all-menus-wrapper">
                <div class="first"></div>
                <div class="second"></div>
            </div>
        </div>
        <div class="item-section grid-wrapper">
            <!--<div class="slots-background"></div>-->
            <div class="interface-element-item-slot-grid-stretch"></div>
            <!--<div class="grid"></div>-->
            <div class="depo-expired depo-expired--hidden">
                <div class="depo-expired__text"></div>
            </div>
        </div>
        <div class="green-bar-section"></div>
        <div class="bottom-section">
            <div class="cards-menu">
                <div class="cards-background"></div>
                <div class="midle-cards-overflow">
                    <div class="cards-content tabs-nav"></div>
                </div>
            </div>
        </div>
        <div class="bottom-bar">
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="filter-label" data-trans="#filter-level"></div>
            <div class="available-slots" data-trans="data-tip#available-slots#depo">
                <span class="available-slots-current"></span>/<span class="available-slots-all"></span>
            </div>
            <div class="actions-bar-content">
                <div class="info-icon" data-trans="data-tip#depo-payment-info#depo"></div>
                <div class="depo-buy but"></div>
                <div class="depo-payment but"></div>
                <div class="upgrade but"></div>
            </div>
            <div class="start-lvl-wrapper"></div>
            <div class="stop-lvl-wrapper"></div>
        </div>
        <div class="depo-load-items-overlay"></div>
    </div>`


TEMPLATES['depo-item-grid'] = `
            <div class="grid"></div>
    `

TEMPLATES['depo_backlight'] = `<div class="depo_backlight"></div>`

TEMPLATES['depo-filter'] = `<div class="depo-filter">
        <div class="menu-wrapper">
            <div class="menu"></div>
        </div>
        <div class="back"></div>
    </div>`

//<!--&lt;!&ndash; depo &ndash;&gt;-->
//<!--<div data-template="depo">-->
//<!--<div class="depo-header">-->
//<!--<div class="header-buttons">-->
//<!--<div class="depo-buy but"></div>-->
//<!--<div class="depo-payment but"></div>-->
//<!--<div class="upgrade but"></div>-->
//<!--<div class="delete-deposit but"></div>-->
//<!--</div>-->
//<!--</div>-->
//<!--<div class="depo-content">-->
//<!--<div class="expire"></div>-->
//<!--<div class="gold-content">-->
//<!--<div class="gold-amount"></div>-->
//<!--<div class="gold-action">-->
//<!--<div class="input-wrapper in-line">-->
//<!--<input class="amount default"/>m-->
//<!--</div>-->
//<!--<div class="but-actions"></div>-->
//<!--</div>-->
//<!--</div>-->
//<!--<div class="grid-wrapper">-->
//<!--<div class="grid"></div>-->
//<!--</div>-->
//<!--</div>-->
//<!--</div>-->
//
//<!--
//<div data-template="depo">
//    <div class="depo-header">
//        <div class="header-buttons">
//            <div class="depo-payment but"></div>
//            <div class="upgrade but"></div>
//        </div>
//    </div>
//    <div class="depo-content">
//        <div class="expire"></div>
//        <div class="gold-content">
//            <div class="gold-amount"></div>
//            <div class="gold-action">
//                <div class="input-wrapper in-line">
//                    <input class="amount default"/>m
//                </div>
//                <div class="but-actions"></div>
//            </div>
//        </div>
//        <div class="grid-wrapper">
//            <div class="grid"></div>
//        </div>
//    </div>
//</div>
//-->

TEMPLATES['mini-map-local-content'] = `<div class="mini-map-local-content">
        <div class="scroll-wrapper">
            <div class="scroll-pane">

                <div class="graphic interface-element-middle-1-background-stretch"></div>
            </div>
        </div>
    </div>`

TEMPLATES['border-wrapper-mini-map'] = `<div class="border-wrapper-mini-map"></div>`

TEMPLATES['element-mini-map'] = `<div class="element-mini-map element">
        <div class="border-wrapper"></div>
    </div>`

TEMPLATES['icon-wrapper-map'] = `<div class="icon-wrapper-map icon-wrapper">
        <div class="emo-npc-icon"></div>
    </div>`

TEMPLATES['one-location-on-map'] = `<div class="one-location-on-map"></div>`

TEMPLATES['search-wrapper'] = `<div class="search-wrapper">
            <input class="search"/>
            <div class="search-x" data-trans="data-tip#delete"></div>
        </div>`;

TEMPLATES['mini-map-global-content'] = `<div class="mini-map-global-content">
        <!--<div class="border-window-middle-1-background-stretch"></div>-->
        <div class="search-wrapper default">
            <input class="search"/>
            <div class="search-x" data-trans="data-tip#delete"></div>
        </div>
        <div class="scroll-wrapper">
            <div class="scroll-pane">
                <div class="graphic interface-element-middle-1-background-stretch"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['local-map-element'] = `<div class="local-map-element">
        <div class="table-wrapper">
            <div class="left-side">
                <div class="label"></div>
                <div class="toggle"></div>
            </div>
            <div class="icon-wrapper">
                <div class="emo-npc-icon"></div>
            </div>
        </div>
        <div class="line interface-element-line-1-background"></div>
    </div>`;

TEMPLATES['mini-map-window'] = `<div class="mini-map-window">
        <div class="mini-map-positioner">
            <div class="hero-mark mark" data-trans="data-tip#my_character#map"></div>
        </div>
        <div class="search-wrapper search-item-wrapper">
            <input class="search"/>
            <div class="search-x" data-trans="data-tip#delete"></div>
        </div>
    </div>`;

TEMPLATES['handheld-mini-map'] = `<div class="handheld-mini-map">
           <canvas class="handheld-mini-map-canvas" ></canvas>
           <!--<div class="search-wrapper search-item-wrapper">-->
               <!--<input class="search"/>-->
               <!--<div class="search-x" data-trans="data-tip#delete"></div>-->
           <!--</div>-->
       </div>`;

TEMPLATES['dynamic-bck'] = `<div class="dynamic-bck bck"></div>`;

TEMPLATES['show-monsters-header'] = `<div class="show-monsters-header"></div>`;

TEMPLATES['color-label-window-map'] = `<div class="color-label-window-map color-label"></div>`;

TEMPLATES['show-label-window-map'] = `<div class="show-label-window-map show-label"></div>`;
//TEMPLATES['show-label-data-drawer'] = `<div class="show-label-data-drawer show-label"></div>`;
TEMPLATES['show-label-data-drawer-nick'] = `<div class="show-label-data-drawer-nick show-label"></div>`;
TEMPLATES['show-label-data-drawer-prof-and-level'] = `<div class="show-label-data-drawer-prof-and-level show-label"></div>`;
TEMPLATES['show-label-data-drawer-prof-and-level'] = `<div class="show-label-data-drawer-prof-and-level show-label"></div>`;
TEMPLATES['show-label-who-is-here'] = `<div class="show-label-who-is-here show-label"></div>`;
TEMPLATES['show-label-map-blur'] = `<div class="show-label-map-blur show-label"></div>`;

TEMPLATES['icons-column-mini-map'] = `<div class="icons-column-mini-map icons-column mm-mark-list"></div>`;

TEMPLATES['first-column-mini-map'] = `<div class="first-column-mini-map first-column"></div>`;

TEMPLATES['second-column-mini-map'] = `<div class="second-column-mini-map second-column"></div>`;

TEMPLATES['color-to-choose-mini-map'] = `<div class="color-to-choose-mini-map color-to-choose"></div>`;

TEMPLATES['mini-map-other'] = `<div class="mini-map-other other mark"></div>`;
TEMPLATES['mini-map-gateway'] = `<div class="mini-map-gateway gateway mark"></div>`;
TEMPLATES['mini-map-rip'] = `<div class="mini-map-rip rip mark"></div>`;
TEMPLATES['mini-map-monster'] = `<div class="mini-map-monster monster mark"></div>`;
TEMPLATES['mini-map-recovery'] = `<div class="mini-map-recovery recovery mark"></div>`;

TEMPLATES['hero-mark'] = `<div class="hero-mark mark"></div>`;

TEMPLATES['border-war-shadow'] = `<div class="border-war-shadow"></div>`;

//<!-- event calendar -->
TEMPLATES['event-calendar'] = `<div class="event-calendar">
        <div class="background">
            <div class="matrix">
                <div class="event-calendar-cell prev-week week-switch"></div>
                <div class="event-calendar-cell next-week week-switch"></div>
                <div class="days-wrapper"></div>
            </div>
            <div class="controlls">
                <div class="month-switch prev-month"></div>
                <div class="month-switch next-month"></div>
                <div class="date-display"></div>
                <div class="month-display"></div>
            </div>
        </div>
    </div>`;

//<!-- calender cell -->
TEMPLATES['event-calendar-cell'] = `<div class="event-calendar-cell">
        <div class="inner-cell">
            <div class="day-and-date"></div>
            <div class="events-holder"></div>
        </div>
    </div>`;

//<!-- chests-window -->
TEMPLATES['chests-window'] = `<div class="chests-window">
        <div class="brown-background interface-element-middle-1-background"></div>
        <div class="chests-choice-wrapper"></div>
        <div class="chests-bottom-panel">
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="chest-wrapper">
                <div class="chest interface-element-chest-sl"></div>
            </div>
            <div class="info-wrapper">
                <div class="info-label"></div>
                <div class="buy-sl"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['promo-window'] = `<div class="promo-window">
        <div class="background-graphic interface-element-middle-1-background"></div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="header-wrapper">
                    <div class="promo" data-trans="promo"></div>
                    <div class="promo-percent"></div>
                </div>
                <div class="items-wrapper"></div>
            </div>
        </div>
        <div class="promo-bottom-panel">
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="chest-wrapper">
                <div class="chest interface-element-chest-sl"></div>
            </div>
            <div class="info-wrapper">
                <div class="buy-sl"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['promo-chest'] = `<div class="promo-chest">
        <div class="header-txt"></div>
        <div class="img-wrapper">
            <div class="chest-img"></div>
        </div>
        <div class="txt-wrapper">
            <div class="txt-html"></div>
        </div>
        <div class="btn-wrapper btns-spacing"></div>
        <div class="price-txt"></div>
    </div>`;

TEMPLATES['shop-promo-item-wrapper'] = `<div class="shop-promo-item-wrapper">
        <div data-template="shop-promo-item img-wraper" class="img-wraper">
            <div class="item-wrapper"></div>
            <div class="item-price"></div>
            <div class="item-price-new"></div>
            <div class="btn-wrapper"></div>
        </div>
    </div>`;

TEMPLATES['shop-promo-item'] = `<div class="shop-promo-item img-wraper">
        <div class="item-wrapper interface-element-green-box-background">
          <div class="item-slot-container"></div>
          <div class="item-price"></div>
          <div class="item-price-new"></div>
        </div>
        <div class="btn-wrapper"></div>
    </div>`;

//<!--<div data-template="shop-promo-item" class="img-wraper">-->
//<!--<div class="item-wrapper"></div>-->
//<!--<div class="item-price"></div>-->
//<!--&lt;!&ndash;<div class="btn-wrapper"></div>&ndash;&gt;-->
//<!--</div>-->
//
//<!-- advent calendar -->
TEMPLATES['advent-calendar'] = `<div class="advent-calendar">
        <div class="background"></div>
        <div class="cell-grid"></div>
    </div>`;

//<!-- advent cell -->
TEMPLATES['advent-cell'] = `<div class="advent-cell">
        <div class="number"></div>
        <div class="item-container"></div>
    </div>`;

//<!-- book -->
TEMPLATES['book'] = `<div class="book">
        <div class="bg">
            <div class="left"></div>
            <div class="right">
                <div class="book-title"></div>
                <div class="author"></div>
                <div class="flower">
                    <div class="book-info">
                        <span class="which"></span>
                        <span class="amount"></span>
                    </div>
                    <div class="prev"></div>
                    <div class="next"></div>
                </div>
            </div>
        </div>
    </div>`;

//<!-- captcha -->
TEMPLATES['captcha'] = `<div class="captcha">
        <div class="captcha__question"></div>
        <div class="captcha__image"></div>
        <div class="captcha__buttons"></div>
        <div class="captcha__confirm"></div>
        <div class="captcha__triesleft"></div>
    </div>`;

//<!-- poll -->
TEMPLATES['poll'] = `<div class="poll">
        <form>
            <div class="poll__list"></div>
            <div class="poll__confirm"></div>
        </form>
    </div>`;

//<!-- poll list-item -->
TEMPLATES['poll__list-item'] = `<div class="poll__list-item">
        <div class="poll__question"></div>
        <div class="poll__answers"></div>
    </div>`;

//<!-- Promo input>-->
TEMPLATES['code-manager-input'] = `<div class="code-manager-input">
        <input class="code default"/>
    </div>`;

//<!-- Promo items-->
TEMPLATES['code-manager'] = `<div class="code-manager">
        <div class="wnd-dark-bg interface-element-middle-1-background"></div>
        <div class="wrapper">
            <div class="info-box"></div>
            <div class="info mt-3">
                <div class="info-desc"></div>
                <div class="promo-alert promo-alert-use"></div>
                <div class="promo-alert promo-alert-expire"></div>
            </div>
            <div class="grid"></div>
            <div class="info-label"></div>
        </div>
    </div>`;

//<!-- chat message !-->
TEMPLATES['chat-message'] = `<div class="chat-message">
        <span class="nick"></span>
        <span class="info">i</span>
        <span class="color-chat-msg"></span>
    </div>`;

TEMPLATES['chat-tab'] = `<div class="chat-tab tab">
        <div class="icon"></div>
        <div class="notif">
            <span class="counter">0</span>
        </div>
        <div class="close" data-tip-type="t_chat_card"></div>
    </div>`;

//<!--<div data-template="chat-tab" class="tab"></div>-->

TEMPLATES['chat-ban'] = `<div class="chat-ban">
        <div class="question"></div>
        <div class="days"></div>
        <div class="ban-reason-label" data-trans="banday_reason_label"></div>
        <div class="input-wrapper">
            <input class="ban-reason default">
        </div>
        <div class="ban-btn"></div>
    </div>`;

TEMPLATES['banday-row'] = `<div class="banday-row">
        <div class="table-wrapper">
            <div class="checkbox-wrapper">
                <div class="checkbox"></div>
            </div>
            <span class="nr"></span>
        </div>
    </div>`;

//<!-- minimap !-->
//<!--<div data-template="minimap-window">-->
//<!--<div class="currentmap"></div>-->
//<!--<div class="worldmap"><img>-->
//
//<!--<div id="wm_myloc"></div>-->
//<!--<div id="wm_highlighter"></div>-->
//<!--</div>-->
//<!--<div class="panel">-->
//<!--<div class="map-button"></div>-->
//<!--<div class="scroll-wrapper">-->
//<!--<div class="scroll-pane">-->
//<!--<div id="maplist"></div>-->
//<!--</div>-->
//<!--</div>-->
//<!--<input id="mapfilter" class="default">-->
//<!--</div>-->
//<!--</div>-->
//
//<!-- standard game dialogue window !-->
TEMPLATES['dialogue-window'] = `<div class="dialogue-window" data-opacity-lvl="1">
        <!--<div class="dialogue-background-color"></div>-->
        <!--<div class="dialogue-border"></div>-->
        <div class="content">
            <div class="border-image"></div>
            <div class="npc-dialogue-wrapper">
                <div class="h_content"></div>
                <div class="npc-message"></div>
            </div>
            <div class="inner scroll-wrapper small-bar">
                <div class="scroll-pane">
                    <ul class="answers"></ul>
                </div>
            </div>
        </div>
        <!--<header>-->

        <!--</header>-->
    </div>`;

//<!--  standard game dialogue answer !-->
TEMPLATES['dialogue-window-answer'] = `<li class="dialogue-window-answer answer">
        <div class="icon"></div>
        <span class="answer-text"></span>
    </li>`;

//<!--  standard game dialogue rewards !-->
TEMPLATES['dialogue-window-rewards'] = `<div class="dialogue-window-rewards">
        <h2 class="rewards-header"></h2>
        <div class="rewards-items"></div>
    </div>`;

//<!--  standard game dialogue reward line !-->
TEMPLATES['dialogue-window-reward-line'] = `<div class="dialogue-window-reward-line rewardLine"></div>`;

//<!--  standard game dialogue reward element !-->
TEMPLATES['dialogue-window-reward-el'] = `<div class="dialogue-window-reward-el rewardElement">
        <span class="label"></span>
        <!--<div class="container"></div>-->
    </div>`;

//<!--  standard game dialogue reward item !-->
TEMPLATES['dialogue-window-reward-item'] = `<div class="dialogue-window-reward-item container">
        <div class="interface-element-one-item-slot"></div>
        <div class="rew-item-slot"></div>
    </div>`;

//<!-- shop!-->
TEMPLATES['shop-wrapper'] = `<div class="shop-wrapper">
        <div class="shop-background">
            <div class="interface-element-middle-1-background-stretch"></div>
            <div class="interface-element-vertical-wood"></div>


            <div class="canopy"></div>
            <div class="paper-1"></div>
            <div class="paper-2"></div>
            <div class="outfit-pet-scene"></div>
            <div class="interface-element-line-1-background"></div>
            <div class="filter-wrapper-background">
                <div class="interface-element-wood-box-background"></div>
            </div>
            <div class="button-wrapper-background">
                <div class="interface-element-header-1-background-stretch"></div>
            </div>

        </div>
        <div class="shop-content">
            <!--<div class="header" data-trans="#shop_head#shop"></div>-->
            <!--<div class="close-button"></div>-->
            <!--<div class="for-you-plug"></div>-->
            <div class="shop-items interface-element-grid-border items-grid scroll-wrapper classic-bar">
                <div class="interface-element-item-slot-grid-stretch"></div>
                <div class="scroll-pane"></div>
            </div>
            <div class="buy-items interface-element-grid-border items-grid ">
                <div class="interface-element-item-slot-grid-stretch"></div>
                <span class="label interface-element-grid-border" data-trans="#buying_items#shop"></span>
            </div>
            <div class="sell-items interface-element-grid-border items-grid">
                <!--<span class="label" data-trans="#selling_items#shop"></span>-->
                <div class="interface-element-item-slot-grid-stretch"></div>
                <span class="label interface-element-grid-border"></span>

                <canvas class="SHOP_CANVAS"></canvas>
            </div>

            <div class="for-you-txt" data-trans="#badged#extManager"></div>
            <div class="for-you-plug-disabled">
                <div class="disabled-text" data-trans="#for_you_alert"></div>
            </div>

            <div class="shop-info-wrapper"></div>
            <div class="shop-balance">
                <div class="sell">0</div>
                <div class="buy">0</div>
                <div class="balance">0</div>
                <div class="total-price" data-trans="#total-price"></div>
            </div>
            <div class="finalize-button btns-spacing"></div>
            <div class="more-gold-button"></div>
            <div class="filters-heading" data-trans="#filters#shop"></div>
            <div class="quick-sell-heading" data-trans="#quick_sell#shop"></div>
            <div class="bag-heading" data-trans="#bag#shop"></div>
            <div class="great-merchamp btns-spacing"></div>
            <div class="show-items-filter">
                <div class="wrapper" data-trans="data-tip#own-profession-tip">
                    <div class="filter-label" data-trans="#own-profession-label"></div>
                    <div class="checkbox own-profession"></div>
                </div>
                <div class="wrapper" data-trans="data-tip#own-level-tip">
                    <div class="filter-label" data-trans="#own-level-label"></div>
                    <div class="checkbox own-level"></div>
                </div>
                <div class="wrapper" data-trans="data-tip#can-afford-tip">
                    <div class="filter-label" data-trans="#can-afford-label"></div>
                    <div class="checkbox can-afford"></div>
                </div>
            </div>
            <div class="shop-bottom-panel">
                <div class="interface-element-bottom-bar-background-stretch"></div>
                <div class="chest-wrapper">
                    <div class="chest"></div>
                </div>
                <div class="table-wrapper">
                    <div class="currency-label"></div>
                    <div class="buy-currency"></div>
                    <div class="recover-items"></div>
                </div>
            </div>
        </div>
    </div>`;

//<!-- shop info-currency (coupon) !-->
TEMPLATES['si-currency'] = `<div class="si-currency">
        <div class="si-currency__label"><b></b></div>
        <div class="si-currency__icon"></div>
        <div class="si-currency__desc"></div>
    </div>`

//<!-- scrollbar !-->
TEMPLATES['scrollbar-wrapper'] = `<div class="scrollbar-wrapper">
        <div class="background"></div>
        <div class="arrow-up"></div>
        <div class="arrow-down"></div>
        <div class="track">
            <div class="handle"></div>
        </div>
    </div>`;

TEMPLATES['mc-addon'] = `<div class="mc-addon">
        <div class="nick-header"></div>
        <div class="had-warn" data-trans="#had-warn#mc-addon"></div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="mc-addon-content">
                    <div class="all-texts"></div>
                    <div class="times-of-mute"></div>
                    <div class="unmute"></div>
                </div>
            </div>
        </div>
    </div>`;

TEMPLATES['mc-text'] = ` <div class="mc-text">
        <div class="label-wrapper">
            <div class="label-text"></div>
        </div>
        <div class="send"></div>
    </div>`;

//<!-- battle controller !-->
//<!--<div data-template="battle-controller">-->
//<!--<div class="toggle-battle"></div>-->
//<!--<div class="active-skills">-->
//<!--<div class="battle-skills-wrapper"></div>-->
//<!--</div>-->
//<!--<div class="time">-->
//<!--<div class="time-inner"></div>-->
//<!--</div>-->
//<!--<div class="inner">-->
//<!--<div class="buttons-wrapper left"></div>-->
//<!--<div class="enemy-info-wrapper"></div>-->
//<!--&lt;!&ndash;<div class="buttons-wrapper right"></div>&ndash;&gt;-->
//<!--</div>-->
//<!--</div>-->

TEMPLATES['battle-controller'] = `<div class="battle-controller">
        <div class="graphics">
            <div class="battle-border"></div>
            <!--<div class="header-graphic"></div>-->
            <div class="column-separator"></div>
            <div class="middle-graphic  interface-element-middle-4-background"></div>
            <div class="divide-wood interface-element-vertical-wood"></div>
            <div class="bottom-graphic">
                <div class="interface-element-bottom-bar-background-stretch"></div>
            </div>
        </div>
        <div class="battle-content">
            <div class="time-wrapper">
                <div class="pool-timer-wrapper">
                    <div class="pool-timer" data-trans="data-tip#pool-timer-tip#battle"></div>
                </div>
                <div class="time-progress-bar" data-trans="data-tip#turn-timer-tip#battle">
                    <div class="time-inner" bar-horizontal="true"></div>
                    <div class="seconds interface-element-amount"></div>
                </div>
            </div>
            <div class="nick"></div>
            <div class="level-icon">
                <div class="level"></div>
                <div class="prof-wrapper"></div>
            </div>
            <div class="toggle-battle"></div>
            <div class="attach-battle-log-help-window attach-icon" data-trans="data-tip#attach-battle-log-help-window"></div>
            <div class="attach-battle-prediction-help-window  attach-icon" data-trans="data-tip#attach-battle-prediction-help-window"></div>
            <div class="surrender"></div>
            <div class="left-column">
                <div class="scroll-wrapper">
                    <div class="scroll-pane"></div>
                </div>
            </div>
            <div class="stats-wrapper"></div>
            <div class="buffs-wrapper"></div>
            <div class="buttons-wrapper"></div>
            <div class="right-column">
                <div class="scroll-wrapper">
                    <div class="scroll-pane">
                        <div class="turn-prediction"></div>
                    </div>
                </div>
                <div class="battle-end-layer" data-trans="#battle_ended#battle"></div>
            </div>

            <div class="battle-bar-light-mode interface-element-progress-bar-2 energy-battle-bar-light-mode" data-trans="data-tip#stat-energy">
                <div class="inner" bar-horizontal="true" bar-percent="100"></div>
                <div class="value"></div>
            </div>
            <div class="battle-bar-light-mode interface-element-progress-bar-2 mana-battle-bar-light-mode" data-trans="data-tip#stat-mana">
                <div class="inner" bar-horizontal="true" bar-percent="100"></div>
                <div class="value"></div>
            </div>
        </div>
        <div class="skill-usable-slots-light-mode left">
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="0"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="1"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="2"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="3"></div>
        </div>
        <div class="skill-usable-slots-light-mode right">
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="7"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="6"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="5"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="4"></div>
        </div>
        <div class="skill-usable-add-slots left">
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="8"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="9"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="10"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="11"></div>
        </div>
        <div class="skill-usable-add-slots right">
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="15"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="14"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="13"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="12"></div>
        </div>
        <!--<div class="skill-hider"></div>-->
        <div class="battle-watch right"></div>
    </div>`;

TEMPLATES['battle-log-help-window'] = `
    <div class="battle-log-help-window">
        <!--<div class="toggle-size-button"></div>-->
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="middle-graphics"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['battle-prediction-help-window'] = `
    <div class="battle-prediction-help-window">
        <!--<div class="toggle-size-button"></div>-->
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="middle-graphics"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['turn-prediction__item'] = `<div class="turn-prediction__item">
        <div class="turn-prediction__content">
            <div class="turn-prediction__av"></div>
            <div class="turn-prediction__name"></div>
        </div>
    </div>`;

TEMPLATES['combo-wrapper'] = `<div class="combo-wrapper"></div>`;

TEMPLATES['combo-point'] = `<div class="combo-point"></div>`;

TEMPLATES['current-arrow'] = `<div class="current-arrow">
        <div class="css-arrow"></div>
        <div class="canvas-arrow"></div>
    </div>`;

TEMPLATES['after-use-skill'] = `<div class="after-use-skill"></div>`;

TEMPLATES['profs-icon'] = `<div class="profs-icon"></div>`;

TEMPLATES['buff'] = `<div class="buff"></div>`;

TEMPLATES['dmg'] = `<div class="dmg"></div>`;

TEMPLATES['battle-msg'] = `<div class="battle-msg"></div>`;

TEMPLATES['progress-bar-wrapper'] = `<div class="progress-bar-wrapper">
        <div class="background"></div>
        <div class="bar-percentage" bar-horizontal="true"></div>
        <div class="label"></div>
    </div>`;

//<!-- battle skill !-->
TEMPLATES['battle-skill'] = `<div class="battle-skill">
        <div class="background interface-element-box-shadow-1"></div>
        <div class="icon"></div>
        <div class="name"></div>
        <div class="type"></div>
    </div>`;

//<!-- battle window !-->
TEMPLATES['battle-window'] = `<div class="battle-window">
        <div class="battle-interface">
            <div class="inner">
            </div>
        </div>
        <div class="battle-area">
            <div class="battle-background"></div>
            <!--<div class="background"></div>-->
        </div>
        <canvas class="battle-effect-tint"></canvas>
        <canvas class="character-effects"></canvas>
        <!--<div class="battle-night-layer"></div>-->
        <canvas class="battle-night2-layer"></canvas>
    </div>`;

//<!--enemy info !-->
TEMPLATES['enemy-info'] = `<div class="enemy-info">
        <div class="avatar"></div>
        <div class="enemy-info-inner">
            <div class="w-name"></div>
            <div class="w-lvl-prof"></div>
            <div class="hp-wrapper">
                <div class="hp-wrapper-percentage"></div>
                <div class="hp-wrapper-inner"></div>
            </div>
            <div class="buffs-wrapper"></div>
        </div>
    </div>`;

//<!-- battlelog copy !-->
TEMPLATES['copy-log'] = `<div class="copy-log">
        <div class="battle-interface">
        </div>
        <div class="battlelog scroll-wrapper red-bar">
            <div class="scroll-pane"></div>
        </div>
        <textarea spellcheck="false"></textarea>

        <div class="copylog-info">

        </div>
    </div>`;

//<!-- battle summary !-->
TEMPLATES['battle-summary'] = `<div class="battle-summary">
        <div class="banner"></div>

        <div class="relative-content">
            <div class="scroll-wrapper">
                <div class="scroll-pane">
                    <div class="loot">
                        <div class="loot-header" data-trans="#loot_header#battle"></div>
                        <div class="loot-time"></div>
                        <div class="loot-inner">
                            <div class="loot-wrapper"></div>
                        </div>
                    </div>
                    <div class="report"></div>
                </div>
            </div>
        </div>
        <div class="bottom-bar-wrapper">
            <div class="bottom-bar">
                <div class="settings-button">
                    <div class="icon"></div>
                </div>
                <div class="close-fight-button"></div>
            </div>
            <div class="loot-time"></div>
        </div>
    </div>`;

//<!-- battle banner !-->
TEMPLATES['battle-banner'] = `<div class="battle-banner">
        <div class="result"></div>
        <div class="description"></div>
        <div class="exp-text"></div>
        <div class="exp"></div>
    </div>`;

//<!-- battle summary item !-->
TEMPLATES['battle-summary-item-wrapper'] = `<div data-state="want" class="battle-summary-item-wrapper">
        <div class="slot">
            <div class="item-wrapper"></div>
            <!--<div class="prof-icons-holder"></div>-->
        </div>
        <div class="text-info"></div>
        <div class="change-state-btn"></div>
    </div>`;

TEMPLATES['battle-report'] = `<div class="battle-report">
        <div class="report-header"></div>
    </div>`;


TEMPLATES['one-warrior'] = `<div class="one-warrior">
        <div class="warrior-info">
            <div class="warrior-name"></div>
            <div class="warrior-class"></div>
        </div>
        <div class="hover-selector"></div>
        <div class="selector"></div>
        <div class="warrior grave-warrior-npc"></div>
        <div class="warrior grave-warrior-other"></div>
        <div class="warrior canvas-warrior-icon"></div>
        <div class="warrior canvas-warrior-effects"></div>
        <div class="warrior-dmg"></div>
        <div class="warrior-buffs-wrapper"></div>
        <div class="progress-bar-wrapper"></div>
        <canvas class="canvas-graphic-effect canvas-icon-wrapper-top"></canvas>
        <canvas class="canvas-graphic-effect canvas-icon-wrapper-right"></canvas>
        <canvas class="canvas-graphic-effect canvas-icon-wrapper-bottom"></canvas>
        <canvas class="canvas-graphic-effect canvas-icon-wrapper-left"></canvas>
        <canvas class="canvas-graphic-effect canvas-icon-wrapper-center"></canvas>
    </div>`;

TEMPLATES['one-battle-skill-tip'] = `
      <div class="one-battle-skill-tip">
       
       <div class="skill-tip-header">
         <div class="skill-graphic-wrapper">
          <div class="battle-skill">
            <div class="icon skill-icon"></div>
          </div>
         </div>
         <div class="skill-name"></div>
       </div>
       
       <div class="skill-attrs"></div>
       <div class="skill-level"></div>
       <div class="skill-cost"></div>
      </div>>`

TEMPLATES['one-warrior-tip'] = `<div class="one-warrior-tip">
        <div class="nick"></div>
        <div class="cl"></div>

        <div class="one-warrior-tip-content">
            <div class="hp"></div>
            <div class="ac-content">
                <div class="line interface-element-line-1-background"></div>
                <span data-trans="#def-ac"></span>:
                <span class="ac"></span>
                <span class="ac-destroyed" data-trans="#def-ac-destroyed"></span>
            </div>
            <div class="resist-content">
                <div><span data-trans="#def-res"></span>:</div>
                <div>
                    <span class="resfire red"></span>
                    <span class="reslight yellow"></span>
                    <span class="resfrost blue"></span>
                    <span class="act green"></span>
                </div>
            </div>
            <div class="mana-energy-content">
                <div class="line interface-element-line-1-background"></div>
                <div class="mana-energy">
                    <div class="energy"></div>
                    <div class="mana"></div>
                </div>
            </div>
            <div class="sc-content">
                <div class="line interface-element-line-1-background"></div>
                <div data-trans="#super-cast"></div>
                <div>
                  <span class="sc-content__name"></span>:
                  <span class="sc-content__percent"></span>
                  (<span class="sc-content__turns"></span>)
                </div>
            </div>
        </div>
    </div>`;

TEMPLATES['super-cast'] = `<div class="super-cast">
        <div class="inner" bar-horizontal="true"></div>
    </div>`;

TEMPLATES['health-points'] = `<div class="health-points">
        <div class="inner" bar-horizontal="true"></div>
    </div>`;

TEMPLATES['energy-points'] = `<div class="energy-points">
        <div class="inner" bar-horizontal="true"></div>
    </div>`;

TEMPLATES['mana-points'] = `<div class="mana-points">
        <div class="inner" bar-horizontal="true"></div>
    </div>`;

TEMPLATES['cooldown-left'] = `<div class="cooldown-left"></div>`;

//<!--<div data-template="progress-bar-wrapper"></div>-->

//<!-- quests window !-->
TEMPLATES['quest-log'] = `<div class="quest-log">
        <!--<div class="header-wrapper">-->
        <!--<div class="graphic"></div>-->
        <!--<div class="edit-header-label" data-trans="#quests_wnd_title#quest"></div>-->
        <!--</div>-->
        <!--<div class="header-graphics"></div>-->
        <!--<div class="header-big-label"></div>-->
        <div class="search-wrapper quest-search">
            <input class="search"/>
            <div class="search-x" data-trans="data-tip#delete"></div>
        </div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="middle-graphics interface-element-middle-1-background"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['quest-box'] = `<div class="quest-box">
        <div class="info-wrapper">
            <!--<div class="border-window-bottom-bar-background-stretch"></div>-->
            <div class="interface-element-header-1-background-stretch"></div>
            <span class="quest-debug-id"></span>
            <div class="quest-title-wrapper">
                <div class="quest-title"></div>
            </div>
            <div class="quest-buttons">
                <div class="quest-buttons-wrapper"></div>
            </div>
        </div>
        <div class="quest-content">
            <div class="d-table">
                <div class="d-cell">
                    <div class="q_icon"></div>
                </div>
                <div class="d-cell">
                    <span class="q_doit"></span>
                    <span class="q_kill"></span>
                </div>
            </div>
        </div>
    </div>`;

//<!-- single quest-->
TEMPLATES['quest'] = `<div class="quest">
        <div class="npc-icon"></div>
        <div class="box">
            <div class="info-btn"></div>
            <div class="title"></div>
            <div class="npc-name"></div>
            <div class="text"></div>
            <div class="auxinfo"></div>
        </div>
        <div class="buttons"></div>
    </div>`;

//<!-- loot window !-->
TEMPLATES['loot-window'] = `<div class="loot-window">
        <div class="middle-graphics interface-element-middle-1-background"></div>
        <div class="items-wrapper"></div>
        <div class="col button-wrapper"></div>
        <div class="bottom-wrapper">
            <!--<div class="bottom-graphic"></div>-->
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="table-wrapper">
                <div class="time-left"></div>
                <div class="accept-button"></div>
                <div class="bag-left"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['loot-icon'] = `<div class="loot-icon icon"></div>`;

//<!-- loot item !-->
TEMPLATES['loot-item-wrapper'] = `<div class="loot-item-wrapper interface-element-background-color-1" data-state="want">
        <div class="slot interface-element-one-item-slot"></div>
        <div class="text-info interface-element-table-header-1-background"></div>
        <div class="button-holder"></div>
    </div>`;

//<!--help window !-->
TEMPLATES['help-window'] = `<div class="help-window">
        <div class="scroll-wrapper">
            <div class="scroll-pane">
                <div class="header">
                    <h2 class="controls"></h2>

                    <h2 class="symbols"></h2>
                </div>
                <div class="help-info-section">
                    <div class="help-info-wrapper">
                        <div class="help-info-img"></div>
                    </div>
                    <div class="help-info-text"></div>
                    <div class="help-old-info-text"></div>
                </div>
                <div class="help-legend-section"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['help-window2'] = `<div class="help-window2">
        <!--<div class="header-wrapper">-->
        <!--<div class="graphic"></div>-->
        <!--<div class="edit-header-label" data-trans="#move-and-fight#help"></div>-->
        <!--</div>-->
        <div class="cards-header-wrapper">
            <div class="header-background-graphic"></div>
            <div class="cards-header">
                <div class="card active" data-card="move-and-fight"><div class="label"></div></div>
                <div class="card" data-card="environment"><div class="label"></div></div>
                <div class="card" data-card="profs-and-items"><div class="label"></div></div>
                <div class="card" data-card="premium"><div class="label"></div></div>
            </div>
        </div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="graphic-background"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['help-move-and-fight'] = `<div class="help-move-and-fight">
        <div class="content-header margin" data-trans="#move-header#help"></div>
        <div class="section-1 center margin">
            <div class="move-ways-left">
                <div class="move-ways-small-header margin" data-trans="#move-ways-small-header#help"></div>
                <div class="move-ways" data-trans="#move-ways#help"></div>
            </div>
            <div class="move-ways-wrapper">
                <div class="move-ways-graphic ${getLang()}"></div>
            </div>
        </div>
        <div class="content-header margin" data-trans="#fight-header#help"></div>
        <div class="section-2 center">
            <div class="left-column">
                <div class="uppercase-header" data-trans="#start-fight-h#help"></div>
                <div class="kind-fight margin"></div>
                <div class="uppercase-header" data-trans="#move-in-fight-h#help"></div>
                <div class="move-in-fight margin"></div>
                <div class="uppercase-header" data-trans="#exp-h#help"></div>
                <div class="exp-in-fight margin justify" data-trans="#exp-in-fight#help"></div>
                <div class="img-wrapper margin">
                    <div class="level-img ${getLang()}"></div>
                </div>
                <div class="exp-level-info margin  justify" data-trans="#exp-level-info#help"></div>
            </div>
            <div class="right-column">
                <div class="uppercase-header" data-trans="#skills-h#help"></div>
                <div class="skill-desc margin justify" data-trans="#skills-desc#help"></div>
                <div class="img-wrapper margin">
                    <div class="skill-passive-active-img ${getLang()}"></div>
                </div>
                <div class="skill-passive-active-desc margin" data-trans="#skill-passive-active#help"></div>
                <div class="img-wrapper">
                    <div class="skill-in-bar ${getLang()}"></div>
                </div>
            </div>
        </div>
    </div>`;

TEMPLATES['help-box-with-img'] = `<div class="help-box-with-img">
        <div class="inner">
            <div class="title"></div>
            <div class="symbol ${getLang()}"></div>
            <div class="text"></div>
        </div>
    </div>`;

TEMPLATES['help-environment'] = `<div class="help-environment">
        <div class="content-header margin" data-trans="#environment#help"></div>
        <div class="left-column">
            <div class="uppercase-header" data-trans="#dialog-h#help"></div>
            <div class="margin" data-trans="#dialog-desc#help"></div>
            <div class="uppercase-header" data-trans="#interface-customization-h#help"></div>
            <div class="margin" data-trans="#interface-customization-desc#help"></div>
            <div class="img-interface-customization margin ${getLang()}"></div>
            <div class="uppercase-header" data-trans="#players_interaction-h#help"></div>
            <div data-trans="#interaction-desc#help"></div>
            <div class="uppercase-header" data-trans="#quests-h#help"></div>
            <div class="margin" data-trans="#quests-desc#help"></div>
            <div class="img-wrapper margin">
                <div class="npc-img ${getLang()}"></div>
            </div>
        </div>
        <div class="right-column">
            <div class="uppercase-header" data-trans="#quests-window-h#help"></div>
            <div class="margin" data-trans="#quests-window-desc#help"></div>
            <div class="img-wrapper margin">
                <div class="quest-img ${getLang()}"></div>
            </div>
            <div class="uppercase-header" data-trans="#shop-h#help"></div>
            <div data-trans="#shop-desc#help"></div>
            <div class="img-wrapper margin">
                <div class="shop-img ${getLang()}"></div>
            </div>
            <div class="uppercase-header" data-trans="#filter-bag-h#help"></div>
            <div class="margin" data-trans="#filter-bag-desc#help"></div>
            <div class="img-wrapper margin">
                <div class="filter-loot-img ${getLang()}"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['help-profs-and-items'] = `<div class="help-profs-and-items">
        <div class="content-header" data-trans="#profs#help"></div>
        <div class="profs-content"></div>
        <div class="content-header" data-trans="#items#help"></div>
        <div class="items-content">
            <div class="column-1">
                <div class="column-header uppercase-header" data-trans="#items-cl#help"></div>
                <div class="column-content"></div>
            </div>
            <div class="column-2">
                <div class="column-header uppercase-header" data-trans="#items-type#help"></div>
                <div class="column-content"></div>
            </div>
            <div class="column-3">
                <div class="column-header uppercase-header" data-trans="#items-soulbound#help"></div>
                <div class="column-content" data-trans="#items-soulbound-desc#help"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['help-one-prof'] = `<div class="help-one-prof">
        <div class="first-line">
            <div class="symbol"></div>
            <div class="name"></div>
        </div>
        <div class="second-line">
            <div class="avatar-wrapper">
                <div class="avatar"></div>
            </div>
            <div class="text"></div>
        </div>
        <div class="link-wrapper">
            <a class="link" target="_blank"></a>
        </div>
    </div>`;

TEMPLATES['help-one-cl-item'] = `<div class="help-one-cl-item">
        <div class="wrapper">
            <div class="icon cl-icon"></div>
        </div>
        <div class="text"></div>
    </div>`;

TEMPLATES['help-premium'] = `<div class="help-premium">
        <div class="content-header margin" data-trans="#premium#help"></div>
        <div class="left-column">
            <div class="uppercase-header margin" data-trans="#what-is-h#help"></div>
            <div class="premium-offer margin" data-trans="#premium_offer#help"></div>
            <div class="uppercase-header margin" data-trans="#boost-h#help"></div>
            <div class="boost-account margin" data-trans="#boost-account#help"></div>
            <div class="img-wrapper margin">
                <div class="boost-img ${getLang()}"></div>
            </div>
        </div>
        <div class="right-column">
            <div class="uppercase-header margin" data-trans="#where-is-shop-h#help"></div>
            <div class="margin" data-trans="#where-is-shop-desc#help"></div>
            <div class="img-wrapper margin">
                <div class="premium-img ${getLang()}"></div>
            </div>
            <div class="uppercase-header margin" data-trans="#sl-investment-h#help"></div>
            <div class="margin" data-trans="#sl-investment#help"></div>
        </div>
        <div class="center">
            <div class="box-1 box">
                <div class="margin bold" data-trans="#incredible_items#help"></div>
                <div class="img-wrapper margin">
                    <div class="premium-img ${getLang()}"></div>
                </div>
            </div>
            <div class="box-2 box">
                <div class="margin bold" data-trans="#great_items#help"></div>
                <div class="img-wrapper margin">
                    <div class="premium-img ${getLang()}"></div>
                </div>
            </div>
            <div class="box-3 box">
                <div class="margin bold" data-trans="#exceptional_items#help"></div>
                <div class="img-wrapper margin">
                    <div class="premium-img ${getLang()}"></div>
                </div>
            </div>
        </div>
    </div>`;

TEMPLATES['help-icon'] = `<div class="help-icon">
        <div class="wrapper">
            <div class="icon"></div>
        </div>
        <div class="text"></div>
    </div>`;

TEMPLATES['bonus-reselect-wnd'] = `<div class="bonus-reselect-wnd">
        <div class="bonus-reselect-wnd__bg interface-element-middle-1-background"></div>
        <div class="bonus-reselect-wnd__content">
            <div class="enhance__info enhance__info--1">
                <div class="info-box enhance__info--top" data-trans="#bonus-reselect-info#enhancement"></div>
                <div class="info-icon" data-tip-type="t-left" data-trans="data-tip#info_tip2#enhancement"></div>
            </div>
            <div class="bonus-reselect-wnd__item interface-element-one-item-slot-decor"></div>
            <div class="bonus-reselect-wnd__finalize">
                <div class="info-box enhance__info" data-trans="#bonus-reselect-info2#enhancement"></div>
                <!--<div class="interface-element-one-item-slot"></div>-->
                <div class="bonus-reselect-wnd__require">
                <div class="interface-element-one-item-slot"></div>
                </div>
                <div class="bonus-reselect-wnd__buttons"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['bonus-selector-wnd'] = `<div class="bonus-selector-wnd">
        <div class="bonus-selector-wnd__bg  interface-element-middle-1-background"></div>
        <div class="bonus-selector-wnd__content">
            <div class="enhance__info enhance__info--1">
                <div class="info-box enhance__info--top" data-trans="#info4#enhancement"></div>
                <div class="info-icon" data-tip-type="t-left" data-trans="data-tip#info_tip2#enhancement"></div>
            </div>
            <div class="enhance__bonus"></div>
        </div>
    </div>`;

TEMPLATES['bonus-selector'] = `<div class="bonus-selector">
        <div class="bonus-selector__bonuses"></div>
        <div class="bonus-selector__submit"></div>
    </div>`;

//<!-- friend and enemy list!-->
TEMPLATES['friend-enemy-list'] = `<div class="friend-enemy-list">
        <!--<div class="friend-enemy-header">-->
        <!--<div class="header-title"></div>-->
        <!--</div>-->
<!--        <div class="header-background-graphic"></div>-->
        <div class="friend-enemy-cards cards-header"></div>
        <div class="amound-wrapper">
            <div class="interface-element-header-1-background-stretch"></div>
            <span class="amound-value"></span>
        </div>
        <div class="bottom-friend-panel">
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="input-wrapper">
                <input class="add-person default"/>
            </div>
            <div class="add-wrapper"></div>
            <div class="sort-wrapper"></div>
            <div class="wanted-wrapper"></div>
        </div>
    </div>`;

//<!-- column to friend and enemy list!-->
TEMPLATES['column'] = `<div class="column">
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="middle-graphics interface-element-middle-1-background"></div>
                <div class="list"></div>
            </div>
        </div>
    </div>`;

//<!--one Friend or Enemy !-->
TEMPLATES['one-person'] = `<div class="one-person">
        <!--<div class="online-symbol"></div>-->
        <div class="prof-and-level">
            <div class="lvl-wrapper">
                <span class="lvl"></span>
            </div>
        </div>
        <div class="img-wrapper">
            <!--<div class="img"></div>-->
        </div>
        <div class="info">
            <span class="who"></span>
            <span class="location"></span>
            <span class="cords"></span>
            <span class="online-text"></span>
        </div>
        <div class="buttons action-buttons btns-spacing">
        </div>
        <div class="buttons sort-buttons btns-spacing">
        </div>
        <div class="line interface-element-line-1-background"></div>
    </div>`;

//<!-- clan -->
TEMPLATES['clan'] = `<div class="clan">
        <div class="left-column">
            <div class="wood-background-1 interface-element-middle-1-background-stretch"></div>
            <div class="clan-info interface-element-green-box-background">
                <div class="clan-name">
                    <span class="name"></span>
                </div>
                <div class="clan-level"></div>
                <!--<div class="clan-emblem"></div>-->
                <!--<div class="stats">-->
                    <div class="clan-member-amount"></div>
                    <div class="clan-recruit-state"></div>
                <!--</div>-->
                <!--<div class="clan-look-for-clan-btn"></div>-->
                <div class="clan-showcase-but"></div>
                <!--<div class="edit-logo-but"></div>-->
            </div>
            <!--<div class="clan-list-repeat"></div>-->
            <!--<div class="clan-list-bottom"></div>-->
            <div class="scroll-wrapper classic-bar">
                <div class="scroll-pane tabs-nav"></div>
            </div>
        </div>
        <div class="right-column">
            <div class="interface-element-middle-2-background-stretch"></div>
            <div class="card-content"></div>
        </div>
    </div>`;

//<!-- clan list -->
TEMPLATES['clan-list-content'] = `<div class="clan-list-content">
        <div class="clan-list-show-btn"></div>
        <div class="search-wrapper">
            <input class="search clan-name-input" data-trans="placeholder#search"/>
            <div class="search-x" data-trans="data-tip#delete"></div>
        </div>
        <div class="table-header-wrapper">
            <table class="table-header clan-list-table-header interface-element-table-header-1-background"></table>
        </div>
        <div class="first-scroll-wrapper scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <table class="clan-list-table table-content"></table>
            </div>
        </div>
    </div>`;


TEMPLATES['clan-info-content'] = `<div class="clan-info-content">
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="first-text mtop" data-trans="#clan_info_txt#clan"></div>
                <div class="heading" data-trans="#clan_info_first-text-header#clan"></div><br />
                <div class="first-text" data-trans="#clan_info_first-text#clan"></div>
                <div class="buttons">
                    <div class="look-for-clan"></div>
                    <div class="clan-look-for-clan-btn"></div>
                </div>
                <div class="heading" data-trans="#clan_info_ribbon#clan"></div>
                <div class="second-text" data-trans="#clan_info_second-text#clan"></div>
                <div class="ribbon"></div>

                <!--<div class="green-box-test"></div>-->
            </div>
        </div>
    </div>`;

TEMPLATES['clan-list-find-panel'] = `<div class="clan-list-find-panel">
        <div class="interface-element-middle-1-background-stretch"></div>
        <div class="scroll-wrapper classic-bar clan-list-find-content">
            <div class="scroll-pane">
                <div class="background-wrapper">
                    <div class="clan-find-header-0 interface-element-table-header-1-background"></div>
                    <div class="clan-part-0"></div>
                    <div class="clan-find-header-1 interface-element-table-header-1-background"></div>
                    <div class="clan-part-1"></div>
                    <div class="clan-find-header-2 interface-element-table-header-1-background"></div>
                    <div class="clan-part-2"></div>
                </div>
            </div>
        </div>
        <div class="clan-list-butts-wrapper">
            <div class="clan-list-butts">
                <div class="clan-list-hide-btn"></div>
                <div class="clan-list-find-btn"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['one-clan-atribute'] = `<div class="one-clan-atribute">
        <div class="atribute-name-wrapper">
            <span class="atribute-name"></span>
        </div>
        <div class="atribute-value-wrapper">
            <span class="atribute-value"></span>
        </div>
        <div class="input-wrapper"></div>
        <!--<div class="save-atribute-wrapper"></div>-->
    </div>`;

TEMPLATES['clan-recruit-content'] = `<div class="clan-recruit-content">
        <div class="clan-recruit-menu">
<!--            <div class="cards-header-wrapper">-->
<!--                <div class="header-background-graphic"></div>-->
<!--                <div class="cards-header"></div>-->
<!--            </div>-->
        </div>
        <div class="recruit-section section-recruit-main">
            <div class="scroll-wrapper classic-bar">
                <div class="scroll-pane">
                    <div class="header-bar padd clan-recruit-header-option js-rank-hide">
                        <div class="interface-element-header-1-background-stretch"></div>
                        <span class="header-text"></span>
                    </div>
                    <div class="green-box interface-element-green-box-background js-rank-hide">
                        <div class="invite-to-clan">
                            <div class="v-align">
                                <div class="label-info v-item"></div>
                                <div class="input-wrapper v-item">
                                    <input class="player-nick default">
                                </div>
                                <div class="invite-but v-but v-item"></div>
                            </div>
                        </div>
                    </div>

                    <!--<div class="clan-recruit-header-0"></div>-->
                    <div class="header-bar padd clan-recruit-header-atribute">
                        <div class="interface-element-header-1-background-stretch"></div>
                        <span class="header-text"></span>
                    </div>
                    <div class="green-box interface-element-green-box-background">
                        <div class="clan-part-0"></div>
                        <!--<div class="clan-recruit-header-1"></div>-->
                        <div class="clan-part-1"></div>
                        <!--<div class="clan-recruit-header-2"></div>-->
                        <div class="clan-part-2"></div>
                    </div>
                    <div class="clan-list-butts-wrapper">
                        <div class="interface-element-header-1-background-stretch"></div>
                        <div class="save-atributes"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="recruit-section section-recruit-candidate">
            <div class="table-header-wrapper">
                <table class="table-header recruit-candidate-table-header interface-element-table-header-1-background"></table>
            </div>
            <div class="scroll-wrapper classic-bar">
                <div class="scroll-pane">
                    <table class="recruit-candidate-table table-content"></table>
                    <div class="buttons-wrapper"></div>
                </div>
            </div>
        </div>
        <div class="recruit-section section-recruit-invite">
            <div class="table-header-wrapper interface-element-table-header-1-background">
                <table class="table-header recruit-invite-table-header"></table>
            </div>
            <div class="scroll-wrapper classic-bar">
                <div class="scroll-pane">
                    <table class="recruit-invite-table table-content"></table>
                </div>
            </div>
        </div>
    </div>`;

TEMPLATES['clan-recruit-buttons-wrapper'] = `<div class="clan-recruit-buttons-wrapper buttons-wrapper btns-spacing"></div>`;

TEMPLATES['clan-other-recruit-content'] = `<div class="clan-other-recruit-content">
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="background-wrapper">
                    <div class="clan-recruit-header-0 header-bar">
                        <div class="interface-element-header-1-background-stretch"></div>
                        <span class="header-text"></span>
                    </div>
                    <div class="clan-part-0"></div>
                    <div class="clan-recruit-header-1 header-bar">
                        <div class="interface-element-header-1-background-stretch"></div>
                        <span class="header-text"></span>
                    </div>
                    <div class="clan-part-1"></div>
                    <div class="clan-recruit-header-2 header-bar">
                        <div class="interface-element-header-1-background-stretch"></div>
                        <span class="header-text"></span>
                    </div>
                    <div class="clan-part-2"></div>
                    <div class="save-atributes"></div>
                </div>
            </div>
        </div>
    </div>`;


//<!-- clan members list -->
TEMPLATES['clan-members-content'] = `<div class="clan-members-content">
        <div class="table-header-wrapper">
            <table class="table-header clan-members-table-header interface-element-table-header-1-background"></table>
        </div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <table class="clan-members-table table-content"></table>
            </div>
        </div>
    </div>`;

//<!-- other clan members list -->
TEMPLATES['clan-other-members-content'] = `<div class="clan-other-members-content">
        <div class="table-header-wrapper">
            <table class="table-header js-table-header"></table>
        </div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <table class="clan-other-members-table table-content"></table>
            </div>
        </div>
    </div>`;

//<!-- clan quests list -->
TEMPLATES['clan-quests-content'] = `<div class="clan-quests-content">
        <div class="header-bar padd">
            <div class="interface-element-header-1-background-stretch"></div>
            <div class="complete-quest-amount"></div>
            <div class="toggle-show"></div>
        </div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="clan-quests-content-container">
                    <div class="active-quests"></div>
                    <div class="complete-and-unactive-quests">
                        <div class="unactive-quests"></div>
                        <div class="complete-quests"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

//<!-- one clan quest -->
TEMPLATES['one-clan-quest'] = `<div class="one-clan-quest">
        <div class="left-side">
            <div class="quest-header"></div>
            <div class="quest-content"></div>
            <div class="quest-bring-item-wrapper"></div>
        </div>
        <div class="right-side"></div>
        <div class="quest-progress-wrapper">
            <div class="quest-progress">
                <div class="progress-text"></div>
            </div>
            <div class="clan-progress-bar">
                <div class="background-bar" bar-horizontal="true"></div>
            </div>
            <div class="quest-percent"></div>
        </div>
        <div class="quest-state"></div>
    </div>`;

TEMPLATES['use-lvl'] = `<div class="use-lvl"></div>`;

TEMPLATES['empty-lvl'] = `<div class="empty-lvl"></div>`;

TEMPLATES['increase-decrease-stamina'] = `<div class="increase-decrease-stamina">
        <div class="header-label" data-trans="#timeTicketsAlert1"></div>
        <div class="stamina-pay-options">
            <span class="st_pay_1"data-trans="#for_today_new"></span>
        </div>
    </div>`;

TEMPLATES['quest-bring-item'] = `<div class="quest-bring-item v-align" >
        <div class="item-wrapper v-item interface-element-one-item-slot"></div>
        <div class="input-wrapper v-item">
            <input class="default">
        </div>
        <div class="give-item-btn v-item"></div>
    </div>`;

//<!-- clan skill list -->
TEMPLATES['clan-skills-content'] = `<div class="clan-skills-content">
        <div class="header-bar padd">
            <div class="interface-element-header-1-background-stretch"></div>
            <div class="clan-skill-header"></div>
        </div>
        <div class="clan-skill-heading-text"></div>
        <!--<div class="clan-skill-reset"></div>-->
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="clan-skills-container"></div>
            </div>
        </div>
    </div>`;

//<!-- clan bless list -->
TEMPLATES['clan-bless-content'] = `<div class="clan-bless-content">
        <div class="header-bar padd">
            <div class="interface-element-header-1-background-stretch"></div>
            <div class="back-to-skill-btn"></div>
        </div>
        <div class="bless-header"></div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="clan-bless-container"></div>
            </div>
        </div>
    </div>`;

//<!-- one bless skill -->
TEMPLATES['one-bless-skill'] = `<div class="one-bless-skill">
        <div class="item-wrapper"></div>
        <div class="info-wrapper">
            <div class="bless-name"></div>
            <div class="bless-description"></div>
            <!--<div class="bless-price"></div>-->
        </div>
        <div class="bless-use">
            <div class="bless-duration"></div>
        </div>
    </div>`;

//<!-- one clan skill -->
TEMPLATES['one-clan-skill'] = `<div class="one-clan-skill">
        <div class="skill-icon-wrapper">
            <div class="skill-icon"></div>
            <div class="skill-level-bck">
                <span class="skill-level"></span>
            </div>
            <div class="skill-increase-decrease"></div>
        </div>
        <div class="skill-clan-info">
            <div class="skill-clan-name"></div>
            <div class="skill-clan-description"></div>
            <div class="skill-progress">
                <div class="skill-slots-wrapper"></div>
                <div class="skill-points-wrapper"></div>
            </div>
            <div class="skill-actual-val"></div>
        </div>
        <div class="skill-clan-buts-wrapper">
            <div class="skill-clan-buts-label" data-trans="#use_clan_point"></div>
            <div class="skill-clan-buts-add-point"></div>
            <div class="skill-clan-buts-turn-on-off"></div>
        </div>
    </div>`;

//<!-- one clan member -->
TEMPLATES['clan-member'] = `<div class="clan-member">
        <div class="icon-wrapper">
            <!--<div class="icon"></div>-->
        </div>
        <div class="char-info">
            <div class="char-stats"></div>
            <divn class="last-visit"></divn>
        </div>
        <div class="add-to-group"></div>
        <div class="edit"></div>
    </div>`;

//<!-- clan player edit -->
TEMPLATES['clan-edit-content'] = `<div class="clan-edit-content">
        <div class="table-header-wrapper no-scroll">
            <table class="table-header js-table-header interface-element-table-header-1-background"></table>
        </div>
        <table class="player-edit-table table-content"></table>
        <div class="player-edit-pane">
            <div class="edit-rank">
                <div class="label"></div>
                <div class="v-align">
                    <div class="v-item">
                        <div class="rank-menu menu default"></div>
                    </div>
                    <div class="change-rank-but v-but v-item"></div>
                </div>
            </div>
            <div class="send-tears">
                <div class="label"></div>
                <div class="v-align">
                    <div class="v-item">
                        <div class="send-menu menu default"></div>
                    </div>
                    <div class="send-but v-but v-item"></div>
                </div>
            </div>
        </div>
        <div class="bottom-buttons">
            <div class="remove-from-clan"></div>
            <div class="back-to-members"></div>
        </div>
    </div>`;

//<!-- clan treasury -->
TEMPLATES['clan-treasury-content'] = `<div class="clan-treasury-content">
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="left-part">
                    <div class="gold-part">
                        <div class="gold-info"></div>
                        <div class="green-box interface-element-green-box-background">
                            <div class="send-gold">
                                <div class="label-info"></div>
                                <div class="v-align">
                                    <div class="input-wrapper v-item">
                                        <input class="amount-send-gold default">
                                    </div>
                                    <div class="send-gold-but v-but v-item"></div>
                                </div>
                            </div>
                            <div class="send-to-player">
                                <div class="label-info"></div>
                                <div class="v-align">
                                    <div class="v-item">
                                        <div class="choose-player menu default"></div>
                                    </div>
                                    <div class="send-gold-player-but v-but v-item"></div>
                                </div>
                            </div>
                        </div>
                        <div class="sl-info"></div>
                        <div class="green-box interface-element-green-box-background">
                            <div class="send-sl">
                                <div class="label-info"></div>
                                <div class="v-align">
                                    <div class="input-wrapper v-item">
                                        <input class="amount-send-sl default">
                                    </div>
                                    <div class="send-sl-but v-item v-but"></div>
                                </div>
                            </div>
                            <!--<div class="no-send-sl">-->
                            <!--<div class="label-info"></div>-->
                            <!--</div>-->
                            <div class="on-off-send-sl"></div>
                        </div>
                    </div>
                </div>
                <div class="right-part">
                    <div class="header-bar padd outfit-header">
                        <div class="interface-element-header-1-background-stretch"></div>
                        <span class="header-text"></span>
                    </div>
                    <div class="outfit-content">
                        <div class="to-dress-available"></div>
                        <div class="to-dress-but"></div>
                        <div class="not-dress-but"></div>
                        <canvas class="clan-outfit"></canvas>
                    </div>
                </div>
                <table class="history-table table-content"></table>
            </div>
        </div>
    </div>`;

//<!-- clan manage -->
TEMPLATES['clan-manage-content'] = `<div class="clan-manage-content">
        <div class="header-bar text-center padd">
            <div class="interface-element-header-1-background-stretch"></div>
            <span class="header-text" data-trans="#header-option#clan"></span>
        </div>
        <div class="green-box interface-element-green-box-background">
            <div class="change-clan-name">
                <div class="label-info"></div>
                <div class="v-align">
                    <div class="input-wrapper v-item">
                        <input class="new-clan-name default">
                    </div>
                    <div class="v-item">
                        <div class="paid-kind menu default"></div>
                    </div>
                    <div class="change-clan-name-but v-but v-item"></div>
                </div>
            </div>
            <div class="inline">
                <div class="dissolve-clan">
                    <div class="label-info"></div>
                    <div class="v-align">
                        <div class="input-wrapper v-item">
                            <input class="confirm-dissolve default">
                        </div>
                        <div class="dissolve-but v-but v-item"></div>
                    </div>
                </div>
                <div class="leave-clan">
                    <div class="label-info"></div>
                    <div class="v-align">
                        <div class="input-wrapper v-item">
                            <input class="confirm-leave default">
                        </div>
                        <div class="leave-but v-but v-item"></div>
                    </div>
                </div>
                <!--<div class="invite-to-clan ">-->
                <!--<div class="label-info"></div>-->
                <!--<div class="v-align">-->
                <!--<div class="input-wrapper v-item">-->
                <!--<input class="player-nick default">-->
                <!--</div>-->
                <!--<div class="invite-but v-but v-item"></div>-->
                <!--</div>-->
                <!--</div>-->
            </div>
            <div class="add-rank">
                <div class="label-info"></div>
                <div class="v-align">
                    <div class="add-id-wrapper v-item">
                        <input class="default add-id">
                    </div>
                    <div class="input-wrapper v-item">
                        <input class="default add-name-rank">
                    </div>
                    <div class="add-id-but v-item"></div>
                </div>
            </div>
            <!--<div class="socplay">-->
            <!--<div class="label-info"></div>-->
            <!--<div class="v-align">-->
            <!--<div class="input-wrapper v-item">-->
            <!--<input class="soc-fill-gr default">-->
            <!--</div>-->
            <!--<div class="input-wrapper v-item">-->
            <!--<div class="soc-group-name label-box v-item"></div>-->
            <!--</div>-->
            <!--<div class="save-soc-gr-but v-but v-item"></div>-->
            <!--<div class="remove-soc-gr-but v-but v-item"></div>-->
            <!--<div class="input-wrapper v-item last">-->
            <!--<input class="soc-fill-pass default">-->
            <!--</div>-->
            <!--<div class="input-wrapper v-item last">-->
            <!--<div class="soc-pass-name label-box v-item"></div>-->
            <!--</div>-->
            <!--<div class="save-soc-pass-but v-but v-item"></div>-->
            <!--<div class="remove-soc-pass-but v-but v-item"></div>-->
            <!--</div>-->
            <!--</div>-->
        </div>
        <div class="header-bar text-center padd">
            <div class="interface-element-header-1-background-stretch"></div>
            <div class="rank-edit-header"></div>
        </div>
        <div class="table-header-wrapper">
            <table class="table-header rank-edit-table-header interface-element-table-header-1-background"></table>
        </div>
        <div class="scroll-wrapper classic-bar right-content">
            <div class="scroll-pane">
                <table class="rank-edit-table"></table>
            </div>
        </div>
    </div>`;

TEMPLATES['clan-icon'] = `<div class="clan-icon"></div>`;

//<!-- clan diplomacy -->
TEMPLATES['clan-diplomacy-content'] = `<div class="clan-diplomacy-content">
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="header-bar js-rank-hide">
                    <div class="interface-element-header-1-background-stretch"></div>
                    <span class="header-text" data-trans="#header-option#clan"></span>
                </div>
                <div class="green-box interface-element-green-box-background js-rank-hide">
                    <div class="friend">
                        <div class="v-align">
                            <div class="label-info v-item"></div>
                            <div class="input-wrapper v-item">
                                <input class="invite-friend default">
                            </div>
                            <div class="invite-friend-but v-item v-but"></div>
                        </div>
                    </div>
                    <div class="enemy">
                        <div class="v-align">
                            <div class="label-info v-item"></div>
                            <div class="input-wrapper v-item">
                                <input class="add-enemy default">
                            </div>
                            <div class="add-enemy-but v-item v-but"></div>
                        </div>
                    </div>
                </div>
                <div class="table-header-wrapper">
                    <table class="table-header friend-table-header"></table>
                </div>
                <table class="friend-table table-content"></table>
                <div class="table-header-wrapper">
                    <table class="table-header enemy-table-header"></table>
                </div>
                <table class="enemy-table table-content"></table>
            </div>
        </div>
    </div>`;

//<!-- clan history -->
TEMPLATES['clan-history-content'] = `<div class="clan-history-content">
        <div class="header-bar">
            <div class="interface-element-header-1-background-stretch"></div>
            <span class="header-text" data-trans="#filters#clan"></span>
        </div>
        <div class="chose-show interface-element-green-box-background">
            <div class="v-align">
                <div class="witch-depo v-item"></div>
                <div class="without-depo v-item"></div>
            </div>
        </div>
        <div class="table-header-wrapper">
            <table class="table-header history-table-header"></table>
        </div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <table class="history-table table-content"></table>
            </div>
        </div>
    </div>`;

//<!-- clan page -->
TEMPLATES['clan-page-content'] = `<div class="clan-page-content">
        <div class="clan-page-header"></div>
        <div class="header-bar">
            <div class="interface-element-header-1-background-stretch"></div>
            <div class="d-inline-block">
                <div class="edit-page-but"></div>
            </div>
            <span class="clan-desc"></span>
        </div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="page-wrapper">
                    <div class="page-content"></div>
                </div>
            </div>
        </div>
    </div>`;

//<!-- clan edit page -->
TEMPLATES['clan-edit-page-content'] = `<div class="clan-edit-page-content">
        <div class="header-bar">
            <div class="interface-element-header-1-background-stretch"></div>
            <div class="action-buttons">
                <div class="save-change-but"></div>
                <div class="cancel-change-but"></div>
            </div>
        </div>
        <div class="edit-area-wrapper">
            <textarea class="edit-area"></textarea>
        </div>
    </div>`;

//<!-- clan rank edit -->
TEMPLATES['clan-rank-edit-content'] = `<div class="clan-rank-edit-content">
        <div class="header-bar">
            <div class="bottom-buttons">
                <div class="v-align">
                    <div class="save-change v-item"></div>
                    <div class="cancel-edit v-item"></div>
                    <div class="remove-rank v-item"></div>
                </div>
            </div>
        </div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="edit-rank-name-id">
                    <div class="v-align">
                        <div class="input-wrapper id-wrapper v-item right">
                            <div class="label-id"></div>
                            <input class="edit-id default">
                        </div>
                        <div class="input-wrapper name-wrapper v-item">
                            <div class="label-name"></div>
                            <input class="edit-name default">
                        </div>
                    </div>
                </div>
                <div class="check-rank">
                    <div class="left-ranks"></div>
                    <div class="right-ranks"></div>
                </div>
                <div class="numerable-ranks"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['iframe-window'] = `<div class="iframe-window">
        <div class="iframe-wrapper">
            <iframe class="main-iframe" allow="clipboard-write"></iframe>
        </div>
    </div>`;

//<!-- socPlay Group -->
TEMPLATES['clan-socPlayGroup-content'] = `<div class="clan-socPlayGroup-content">
        <iframe class="socplay-iframe"></iframe>
    </div>`;

//<!-- clan banner -->
TEMPLATES['clan-banner-name'] = `<div class="clan-banner-name">
        <div class="clan-emblem"></div>
        <div class="clan-name"></div>
        <div class="edit-logo-but"></div>
    </div>`;

//<!-- showcase -->
TEMPLATES['showcase'] = `<div class="showcase">
        <div class="header">
            <!--<div class="players-logo"></div>-->
            <div class="showcase-header-bar">
                <div class="interface-element-header-1-background-stretch"></div>
                <span class="clan-level"></span>
                <span class="amount-members"></span>
                <span class="recruite-info"></span>
            </div>
        </div>
        <div class="header-menu"></div>
        <div class="showcase-background interface-element-middle-2-background"></div>
        <div class="card-content"></div>
    </div>`;

//<!-- one rank -->
TEMPLATES['one-rank'] = `<div class="one-rank">
        <div class="v-align">
            <div class="label v-item"></div>
            <div class="wrapper v-item">
                <div class="clan-icon"></div>
            </div>
            <div class="check-box-wrapper v-item">
                <div class="checkbox">
                    <div class="bck"></div>
                </div>
            </div>
        </div>
    </div>`;

TEMPLATES['online-status'] = `<span class="online-status"></span>`;

TEMPLATES['online-status-wrapper'] = `<div class="online-status-wrapper"></div>`;

TEMPLATES['level-and-prof'] = `<div class="level-and-prof"></div>`;

TEMPLATES['prof-wrapper'] = `<div class="prof-wrapper">
        <div class="profs-icon"></div>
    </div>`;

TEMPLATES['member-rank'] = `<div class="member-rank"></div>`;

TEMPLATES['member-lvl'] = `<span class="member-lvl"></span>`;
/*
    //<!-- logged price -->
    TEMPLATES['logged-price'] = `<div class="logged-price">
        <div class="price-header"></div>
        <div class="price-content"></div>
        <div class="price-get-item"></div>
    </div>`;

    //<!-- one price -->
    TEMPLATES['one-price'] = `<div class="one-price">
        <div class="item-wrapper"></div>
        <div class="price-state"></div>
        <div class="price-day"><span></span></div>
    </div>`;
*/
//<!-- one checkbox -->
//<!--<div data-template="check-box-wrapper">-->
//<!--<div class="check-box">-->
//<!--<div class="bck"></div>-->
//<!--</div>-->
//<!--</div>-->
//
//<!-- one checkbox -->
//<!--<div data-template="one-checkbox">-->
//<!--</div>-->
//
//<!-- one numerable rank -->
TEMPLATES['one-numerable-rank'] = `<div class="one-numerable-rank">
        <div class="v-align">
            <div class="label v-item"></div>
            <div class="wrapper v-item">
                <div class="clan-icon"></div>
            </div>
            <div class="menu default"></div>
        </div>
    </div>`;

//<!-- label witch amount -->
TEMPLATES['amount-label'] = `<div class="amount-label">
        <div class="interface-element-header-1-background-stretch"></div>
        <div class="label-wprapper">
            <div class="label"></div>
        </div>
        <div class="amount-wprapper">
            <div class="amount"></div>
        </div>
    </div>`;

//<!-- premium panel -->
TEMPLATES['premium-panel'] = `<div class="premium-panel">
        <!--<div class="premium-header">-->
        <!--<div class="graphic"></div>-->
        <!--<div class="premium-label">Premium</div>-->
        <!--</div>-->
        <div class="premium-graphic interface-element-middle-1-background"></div>
        <div class="product-kind"></div>
        <div class="premium-bottom-panel">
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="chest-wrapper">
                <div class="chest"></div>
            </div>
            <div class="table-wrapper">
                <div class="currency-label"></div>
                <div class="buy-currency"></div>
                <div class="recover-items"></div>
            </div>
        </div>
    </div>`;
/*
    TEMPLATES['item-changer-group'] = `<div class="item-changer-group">
        <div class="header-wrapper"></div>
        <div class="background-grid"></div>
        <div class="grid"></div>
    </div>`;

    TEMPLATES['item-changer'] = `<div class="item-changer">
        <!--<div class="header-wrapper">-->
        <!--<div class="graphic"></div>-->
        <!--<div class="item-changer-label"></div>-->
        <!--</div>-->

        <div class="filter-wrapper">
            <div class="filter-label" data-trans="#filter-level"></div>
            <input class="start-lvl default"/>
            <input class="stop-lvl default"/>
            <div class="choose-prof-wrapper">
                <div class="choose-prof menu"></div>
            </div>
            <div class="choose-item-type-wrapper">
                <div class="choose-item-type menu"></div>
            </div>
            <div class="choose-cl-wrapper">
                <div class="choose-cl menu"></div>
            </div>
        </div>

        <div class="scroll-wrapper classic-bar">
            <div class="main-scroll-pane scroll-pane">
                <div class="middle-graphics"></div>
                <div class="paper-graphics"></div>
                <!--                <table class="table-item-changer-content"></table>-->
            </div>
            <table class="static-bar-table"></table>
        </div>
        <div class="bottom-item-changer-panel">
            <div class="bottom-panel-graphics"></div>
            <!--<div class="do-recipe"></div>-->
        </div>
    </div>`;
*/
TEMPLATES['require-and-receive-item'] = `<div class="require-and-receive-item">
        <div class="require-wrapper">
            <div class="require-wrapper-align"></div>
        </div>
        <div class="arrow"></div>
        <div class="recive-wrapper">
            <div class="recive-wrapper-align"></div>
        </div>
    </div>`;

TEMPLATES['require-item'] = `<div class="require-item">
        <div class="item-wrapper"></div>
        <div class="require-state">
            <div class="require-state-inner">
                <span class="current-owned"></span><span class="seperator">/</span><span class="need-to-use"></span>
            </div>
        </div>
    </div>`;

TEMPLATES['recive-item'] = `<div class="recive-item">
        <div class="item-wrapper"></div>
    </div>`;

TEMPLATES['cost-item'] = `<div class="cost-item">
        <div class="item-wrapper"></div>
        <div class="require-state">
            <div class="require-state-inner">
                <span class="current-owned"></span><span class="seperator">/</span><span class="need-to-use"></span>
            </div>
        </div>
    </div>`;

TEMPLATES['cost-wrapper'] = `<div class="cost-wrapper"></div>`;

TEMPLATES['cost-icon-component'] = `<div class="cost-icon-component">
        <div class="cost-icon-wrapper">
            <div class="text"></div>
            <div class="cost"></div>
            <div class="icon"></div>
        </div>
    </div>`;

TEMPLATES['news-panel'] = `<div class="news-panel">
        <!--<div class="header-wrapper">-->
        <!--<div class="graphic"></div>-->
        <!--<div class="news-panel-label"></div>-->
        <!--</div>-->
        <div class="middle-graphics interface-element-middle-1-background"></div>
        <div class="news-content">
            <div class="crazy-bar interface-element-vertical-wood"></div>
            <div class="news-section">
                <div class="section-content">
                    <div class="news-section-overflow"></div>
                </div>
                <div class="left-news-btn news-graph-arrow news-arrow-element"></div>
                <div class="right-news-btn news-graph-arrow news-arrow-element"></div>
                <div class="news-pagination"></div>
            </div>
            <div class="news-for-you-section">
                <div class="section-header interface-element-table-header-1-background" data-trans="#forYou#news"></div>
                <div class="section-content">
                    <div class="for-you"></div>
                </div>
                <div class="left-arrow news-arrow news-arrow-element"></div>
                <div class="right-arrow news-arrow news-arrow-element"></div>
            </div>
            <div class="news-time-promo-section">
                <!--<div class="section-header" data-trans="#timePromo#news"></div>-->
                <div class="section-content">
                    <div class="time-promo-background"></div>
                    <div class="package-positioner">
                        <div class="package-wrapper"></div>
                    </div>
                    <div class="requires-text-wrapper">
                        <div class="requires-text"></div>
                    </div>
                </div>
            </div>

        </div>
        <div class="bottom-panel-graphics"></div>
    </div>`;

TEMPLATES['news-classic-tile'] = `<div class="news-classic-tile">
        <div class="tile-background">
            <div class="graphic-bck"></div>
            <div class="title-bck"></div>
        </div>
        <div class="tile-items-positioner">
            <div class="tile-items-wrapper"></div>
        </div>
        <div class="requires-text-wrapper">
            <div class="requires-level"></div>
            <div class="requires-text"></div>
        </div>
        <div class="used-text"></div>
        <div class="buy-button-wrapper"></div>
        <div class="buy-info"></div>
    </div>`;

TEMPLATES['news-time-promo-tile'] = `<div class="news-time-promo-tile">
        <div class="tile-background"></div>
        <div class="title-time-promo-tile"></div>
        <div class="price-time-promo-tile"></div>
        <div class="tile-items-positioner">
            <div class="tile-items-wrapper"></div>
        </div>
        <div class="used-text-wrapper">
            <div class="used-text"></div>
        </div>
        <div class="buy-button-wrapper"></div>
        <div class="buy-info"></div>
    </div>`;

//TEMPLATES['news-message'] = `<div class="news-message">
//    <div class="news-date"></div>
//    <div class="news-text"></div>
//    <div class="news-author"></div>
//</div>`;

TEMPLATES['buy-button-wrapper'] = `<div class="buy-button-wrapper buy-button"></div>`;

TEMPLATES['buy-button-news'] = `<div class="buy-button-news buy-button"></div>`;

TEMPLATES['label-news'] = `<div class="label-news label"></div>`;

//<!-- stamina shop -->
TEMPLATES['stamina-shop'] = `<div class="stamina-shop">
        <!--<div class="header-wrapper">-->
        <!--<div class="graphic"></div>-->
        <!--<div class="edit-header-label" data-trans="#stat-stamina"></div>-->
        <!--</div>-->
        <div class="background-graphic interface-element-middle-1-background"></div>
        <div class="description1" data-trans="#stamina_renew_4h#static"></div>
        <div class="description" data-trans="#stamina_renew_4h#static"></div>
        <div class="one-day">
            <div class="info-label"></div>
            <div class="but btns-spacing"></div>
        </div>
        <div class="one-week">
            <div class="info-label"></div>
            <div class="but btns-spacing"></div>
        </div>
        <div class="one-month">
            <div class="info-label"></div>
            <div class="but btns-spacing"></div>
        </div>
        <!--<div class="cancel-but"></div>-->
        <div class="footer">
            <!--<div class="bottom-panel-graphics"></div>-->
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="chest-graphic interface-element-chest-sl"></div>
            <div class="table-wrapper">
                <div class="sl-label"></div>
                <div class="buy-sl-btn"></div>
                <div class="close-btn"></div>
            </div>
        </div>
    </div>`;

//<!-- trade !-->
TEMPLATES['trade-window'] = `<div class="trade-window interface-element-border-window-frame">
        <!--<div class="window-background">-->
        <!--</div>-->
        <header>
            <div class="h_background">
                <div class="left"></div>
                <div class="middle"></div>
                <div class="right"></div>
            </div>
            <div class="h_content"></div>
        </header>
        <div class="interface-element-middle-3-background-stretch"></div>
        <div class="content">
            <div class="decision-background interface-element-background-color-2 interface-element-box-shadow-1"></div>
            <div class="info-icon tip"></div>
            <div class="info">
                <div class="interface-element-grid-border watch label"></div>
                <div class="interface-element-grid-border show label"></div>
                <div class="interface-element-grid-border buy label"></div>
                <div class="interface-element-grid-border sell label"></div>
                <div class="interface-element-grid-border gold-left label gold-label"></div>
                <div class="interface-element-grid-border gold-right label gold-label"></div>
                <div class="interface-element-grid-border credits-left label credits-label"></div>
                <div class="interface-element-grid-border credits-right label credits-label"></div>
            </div>
            <div class="other-buy-item interface-element-grid-border">
                <div class="interface-element-item-slot-grid-stretch"></div>
            </div>
            <div class="hero-sell-item interface-element-grid-border">
                <div class="interface-element-item-slot-grid-stretch"></div>
            </div>
            <div class="other-watch-item  interface-element-grid-border">
                <div class="slot-1 interface-element-one-item-slot"></div>
                <div class="slot-2 interface-element-one-item-slot"></div>
                <div class="slot-3 interface-element-one-item-slot"></div>
            </div>
            <div class="hero-show-item  interface-element-grid-border">
                <div class="slot-1 interface-element-one-item-slot"></div>
                <div class="slot-2 interface-element-one-item-slot"></div>
                <div class="slot-3 interface-element-one-item-slot"></div>
            </div>
            <div class="wood-1 interface-element-vertical-wood"></div>
            <div class="wood-2 interface-element-vertical-wood"></div>
            <div class="decision">
                <div class="other_decision dec-item"></div>
                <div class="line-1 interface-element-line-1-background"></div>
                <div class="line-2 interface-element-line-1-background"></div>
                <div class="other-result result refuse"></div>
                <div class="hero_decision dec-item"></div>
                <div class="hero-result result refuse"></div>
            </div>
            <div class="prize">
                <div class="other-prize interface-element-grid-border gold-prize">0</div>
                <input class="hero-prize interface-element-grid-border gold-prize" placeholder="0"/>
            </div>
            <div class="credits">
              <span class="other-credits interface-element-grid-border"></span>
              <span class="hero-credits interface-element-grid-border"></span>
            </div>
            <div class="buttons btns-spacing-y"></div>
        </div>
        <div class="bottom-bar">
            <div class="interface-element-bottom-bar-background-stretch"></div>
        </div>
    </div>`;

TEMPLATES['divide-panel'] = `<div class="divide-panel">
        <!--<div class="header-wrapper">-->
        <!--<div class="graphic"></div>-->
        <!--<div class="green-panel-label"></div>-->
        <!--</div>-->
        <div class="left-column">
        <div class="interface-element-middle-1-background-stretch"></div>
            <!--<div class="top-left-column-graphics"></div>-->
            <!--<div class="middle-left-column-graphics"></div>-->
            <!--<div class="bottom-left-column-graphics"></div>-->
            <div class="header-graphic interface-element-active-card-background-stretch"></div>
            <div class="left-column-header"></div>
            <div class="search-wrapper search-item-wrapper">
                <input class="search search-item"/>
                <div class="search-x" data-trans="data-tip#delete"></div>
            </div>
            <div class="left-scroll scroll-wrapper classic-bar">
                <div class="scroll-pane"></div>
            </div>
        </div>
        <div class="right-column">
        <div class="interface-element-middle-1-background-stretch"></div>
            <!--<div class="location-graphics"></div>-->
            <!--<div class="middle-graphics"></div>-->
            <div class="header-graphic interface-element-active-card-background-stretch"></div>
            <div class="right-column-header"></div>
            <div class="right-scroll scroll-wrapper classic-bar">
                <div class="scroll-pane"></div>
            </div>
        </div>
        <div class="bottom-part">
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <!--<div class="bottom-panel-graphics"></div>-->
        </div>
    </div>`;

TEMPLATES['table'] = `
        <table class="table">
            <thead></thead>
            <tbody></tbody>
        </table>
    `;

TEMPLATES['table-component'] = `
        <div class="c-table"></div>
    `;


TEMPLATES['table-wrapper'] = `
        <div class="table__wrapper">
            <table class="table__header"></table>
        </div>
    `;
TEMPLATES['table-scrollbar'] = `
        <div class="table__scroll-wrapper scroll-wrapper classic-bar">
            <div class="table__scroll-pane scroll-pane">
                ${TEMPLATES['table']}
            </div>
        </div>
    `;


TEMPLATES['party'] = `<div class="party">
        <!--<div class="header"></div>-->
        <div class="players-number">
            (<span class="num"></span>) <div class="info-icon small-header-info" data-trans="data-tip#amount#party"></div>
        </div>
        <div class="list"></div>
        <!--<div class="exp-info">-->
        <div class="exp-percent"></div>
        <div class="exp-q"></div>
        <!--</div>-->
    </div>`;

TEMPLATES['crown-party'] = `<div class="crown-party crown"></div>`;
TEMPLATES['kick-out-party'] = `<div class="kick-out-party kick-out"></div>`;
TEMPLATES['give-lead-party'] = `<div class="give-lead-party give-lead"></div>`;
TEMPLATES['destroy-group-party'] = `<div class="destroy-group-party destroy-group"></div>`;

//<!--<div data-template="party-member">-->
//<!--<div class="avatar">-->
//<!--<div class="cfg-icon"></div>-->
//<!--</div>-->
//<!--<div class="details">-->
//<!--<div class="controlls">-->
//<!--</div>-->
//<!--<div class="info">-->
//<!--<div class="nickname"></div>-->
//<!--<div class="hp-bar">-->
//<!--<div class="bar"></div>-->
//<!--<div class="overlay"></div>-->
//<!--<div class="percent-value"><span>999%</span></div>-->
//<!--</div>-->
//<!--</div>-->
//<!--</div>-->
//<!--</div>-->

TEMPLATES['party-member'] = `<div class="party-member tw-list-item">
        <div class="border-blink"></div>
        <div class="table-wrapper">
            <div class="nickname">
                <div class="nickname-text"></div>
            </div>
            <div class="party-options"></div>
            <div class="crown-wrapper"></div>
            <div class="stasis-icon" data-trans="data-tip#in_stasis#party"></div>
            <div class="stasis-incoming-icon" data-trans="data-tip#in_stasis-incoming#party"></div>
            <div class="hp">
                <div class="hp-bck"></div>
                <div class="hp-bar"></div>
                <div class="hp-label hp-label-percent"></div>
                <div class="hp-label hp-label-real"></div>
            </div>
            <div class="lvl"></div>
        </div>
    </div>`;

//<!-- registration window !-->
//<!--TEMPLATES['dupa'] = <div class="registration">-->
//<!--<div class="main-header"></div>-->
//<!--<div class="short-info"></div>-->
//<!--<div class="main-content">-->
//<!--<div class="input-section">-->
//<!--<div class="section-wrapper login"></div>-->
//<!--<div class="section-wrapper email"></div>-->
//<!--<div class="save"></div>-->
//<!--</div>-->
//<!--<div class="reward-section">-->
//<!--<div class="header"></div>-->
//<!--<div class="rewards-row row1"></div>-->
//<!--<div class="rewards-row row2"></div>-->
//<!--<div class="btn-wrapper"></div>-->
//<!--</div>-->
//<!--</div>-->
//<!--</div>-->
//
//<!-- registration window !-->
TEMPLATES['registration'] = `<div class="registration">
        <div class="main-header"></div>
        <div class="short-info"></div>
        <div class="reward-header"></div>
        <div class="main-content">
            <!--<div class="section-wrapper login"></div>-->
            <!--<div class="section-wrapper email"></div>-->
            <!--<div class="section-wrapper consent"></div>-->
        </div>
        <div class="buttons-wrapper">
            <div class="save-button"></div>
            <div class="collect-button"></div>
        </div>
    </div>`;

TEMPLATES['registration-section-wrapper'] = `<div class="registration-section-wrapper">
        <div class="inputs-column"></div>
        <div class="reward-column"></div>
    </div>`;

TEMPLATES['registration-inputs-wrapper'] = `<div class="registration-inputs-wrapper"></div>`;

//<!-- reward-box for registration window !-->
TEMPLATES['reward-box'] = `<div class="reward-box">
        <div class="rew-info-holder"></div>
        <div class="item-slot item0"></div>
        <div class="item-slot item1"></div>
        <div class="item-slot item2"></div>
    </div>`;

//<!-- row for registration window !-->
//<!--TEMPLATES['dupa'] = <div class="register-row">-->
//<!--<label></label>-->
//
//<!--<div class="input-wrapper">-->
//<!--<input class="default">-->
//<!--</div>-->
//<!--</div>-->

TEMPLATES['register-row'] = `<div class="register-row">
        <label></label>
        <div class="input-wrapper">
            <input class="default">
        </div>
        <div class="text"></div>
    </div>`;

TEMPLATES['register-row-checkbox'] = `<div class="register-row-checkbox">
        <div class="text"></div>
    </div>`;

TEMPLATES['add-bck'] = `<div class="add-bck"></div>`;

TEMPLATES['label-input'] = `<div class="label-input"></div>`;

TEMPLATES['between-arrow'] = `<div class="between-arrow"></div>`;

TEMPLATES['container'] = `<div class="container"></div>`;

TEMPLATES['button-handler'] = `<div class="button-handler"></div>`;

TEMPLATES['info-icon'] = `<div class="info-icon"></div>`;

TEMPLATES['icon'] = `<div class="icon"></div>`;

TEMPLATES['post-input'] = `<span class="post-input"></span>`;


TEMPLATES['builds-handheld-window'] = `
        <div class="builds-handheld-window">
            <div class="builds-list"></div>
        </div>
    `;

TEMPLATES['one-handheld-build'] = `
    <div class="one-handheld-build">
        <div class="build-index-wrapper">
          <div class="build-index"></div>
        </div>
    </div>

    `;

TEMPLATES['builds-window'] = `
        <div class="builds-window">
            <div class="attach-icon-show-handheld attach-icon" data-trans="data-tip#attach_to_quick_items"></div>
            <div class="scroll-wrapper classic-bar">
                <div class="window-wood-background interface-element-middle-1-background"></div>
                <div class="scroll-pane">

                </div>
            </div>
            <div class="info-icon"></div>
        </div>
    `;

TEMPLATES['one-build'] = `
        <div class="one-build">
            <div class="build-name-wrapper">
                <!--<div class="build-number"></div>-->
                <div class="build-name"></div>
            </div>
            <div class="build-icon-wrapper">
                <div class="build-icon"></div>
            </div>
            <div class="build-items-wrapper">
                <!--<div class="items"></div>-->
                <!--<div class="build-index-wrapper">-->
                    <!--<div class="build-index"></div>-->
                <!--</div>-->
            </div>
            <div class="build-index-wrapper">
                <div class="build-index"></div>
            </div>
            <div class="build-skills-left-wrapper">
                <span class="build-skills-left"></span>
            </div>
            <div class="build-overlay"></div>
        </div>
    `;

TEMPLATES['one-build-to-buy'] = `
        <div class="one-build-to-buy">
            <div class="build-name-wrapper">
                <div class="build-name"></div>
            </div>
            <div class="build-items-wrapper">
                <div class="items"></div>
            </div>
            <div class="build-overlay"></div>
            <div class="build-buttons-wrapper"></div>
            <!--<div class="buttons-overlay"></div>-->
        </div>
    `;

TEMPLATES['auction-window'] = `
        <div class="auction-window">
            <div class="middle-graphic interface-element-middle-1-background"></div>
            <div class="cards-header-wrapper">
<!--                <div class="header-background-graphic"></div>-->
<!--                <div class="cards-header"></div>-->
            </div>

            <div class="left-column-auction-and-main-column-auction interface-element-vertical-wood">

            </div>

            <div class="left-column-auction">
<!--                <div class="scroll-wrapper left-column-scroll classic-bar">-->
<!--                    <div class="scroll-pane">-->
                        <div class="all-categories-auction"></div>
<!--                    </div>-->
<!--                </div>-->
            </div>
            


            <div class="main-column-auction">
                <div class="all-auction-info-wrapper">
                    <div class="all-auction-info" data-trans="#choose_category#auction"></div>
                </div>
                <div class="all-auction-section section middle">
                    <table class="auction-table-header interface-element-table-3"></table>
                    <div class="scroll-wrapper main-all-auction-scroll classic-bar">
                        <div class="scroll-pane">
                            <table class="auction-table interface-element-table-3"></table>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bottom-part">
                <!--<div class="bottom-panel-graphics"></div>-->
                <div class="interface-element-bottom-bar-background-stretch"></div>
<!--                <div class="additional-soulbond-payment" data-trans="#filter_bound_price_info#auction"></div>-->
                <div class="auction-off-btn-wrapper"></div>
                <div class="auction-renew-btn-wrapper"></div>
                <div class="amount-of-auction"></div>
            </div>
        </div>`;

TEMPLATES['auction-off-item-panel'] = `
                <div class="auction-off-item-panel">
                    <div class="middle-graphic interface-element-middle-1-background"></div>
                    <div class="auction-off-item-panel-wrapper">
                        <div class="item-slot-wrapper">
                            <div class="item-slot interface-element-one-item-slot"></div>
                        </div>
                        <div class="all-field">
                            <div class="one-record auction-bid"><div class="label"></div></div>
                            <div class="one-record auction-additional-gold-payment"><div class="label"></div></div>
                            <div class="one-record auction-buy-now"><div class="label"></div><div class="info-icon buy-info-icon"></div></div>
                            <div class="one-record auction-duration"><div class="label"></div><div class="h-char">h</div></div>
                        </div>
                        <div class="one-info special-offer"></div>
                        <div class="one-info auction-tax"><span class="first-span tax-label"></span><span class="second-span tax-val"></span></div>
                        <div class="one-info auction-cost">
                            <span class="first-span cost-label"></span>
                            <span class="second-span currency-icons"></span>
                        </div>
                    </div>
                    <div class="auction-off-btn-wrapper"></div>
                </div>
        `

TEMPLATES['auction-search-item'] = `<div class="auction-search-item top">
        <div class="first-column-bar-search column-bar-search">
            <div class="item-name-wrapper one-record one-line">
<!--                <input class="default name-item-input"/>-->
            </div>
            <div class="item-price-wrapper one-record one-line">
<!--                <input class="default min-price-input min-input"/>-->
                <div class="between-arrow"></div>
<!--                <input class="default max-price-input min-input"/>-->
            </div>
            <div class="item-lvl-wrapper one-record one-line">
<!--                <input class="default min-level-input min-input"/>-->
                <div class="between-arrow"></div>
<!--                <input class="default max-level-input min-input"/>-->
            </div>
        </div>

        <div class="second-column-bar-search column-bar-search menu-bar-search">
            <div class="auction-type-wrapper one-record one-line">
                <div class="menu-wrapper menu default"></div>
            </div>
            <div class="item-rarity-wrapper one-record one-line">
                <div class="menu-wrapper menu default"></div>
            </div>
            <div class="item-prof-wrapper one-record one-line">
                <div class="menu-wrapper menu default"></div>
            </div>
        </div>

        <div class="third-column-bar-search column-bar-search  menu-bar-search">
            <div class="new-filter-wrapper one-record one-line">
                <div class="menu-wrapper menu default"></div>
            </div>
            <div class="refresh-button-wrapper"></div>
        </div>

    </div>`;

TEMPLATES['auction-observe-action'] = `
        <div class="auction-observe-action">
            <div class="observe-img"></div>
        </div>
    `


TEMPLATES['action-menu-item'] = `
        <div class="action-menu-item drop-down-menu-item">
            <div class="label"></div>
        </div>
    `
// TEMPLATES['your-auction-menu'] =`
// <div class="your-auction-menu">
//     <div class="your-auction-header">
//         <div class="label">Twoje Aukcje</div>
//     </div>
//     <div class="your-auction-off action-menu-item">
//         <div class="label">Wystawione</div>
//     </div>
//     <div class="your-watch action-menu-item">
//         <div class="label">Obserwowane</div>
//     </div>
//     <div class="your-bid action-menu-item">
//         <div class="label">Licytowane</div>
//     </div>
// </div>
// `


TEMPLATES['drop-down-menu-section'] =
    `<div class="drop-down-menu-section">
        <div class="type-header">
            <div class="type-header-label"></div>
        </div>
        <div class="state-of-type up-arrow"></div>
        <div class="content-wrapper">
            <div class="item-category-wrapper">
        
            </div>
        </div>
      </div>`;

TEMPLATES['one-category-auction'] =
    `<div class="one-category-auction drop-down-menu-item">
        <div class="icon"></div>
      </div>`;

TEMPLATES['auction-but'] = `<div class="auction-but">
        <div class="label"></div>
    </div>`;

TEMPLATES['auction-cost-ceil'] = `
        <div class="auction-cost-ceil">
            <div class="auction-cost-label"></div>
            <div class="auction-cost-btn-wrapper"></div>
        </div>`;

TEMPLATES['auction-input-cost-ceil'] = `
        <div class="auction-input-cost-ceil">
            <input class="default input-cost"/>
            <div class="own-input-cost"></div>
            <span class="auction-cost-currency"></span>
            <div class="auction-cost-btn-wrapper"></div>
        </div>`;

//<!-- dropdown menu !-->
TEMPLATES['dropdown-menu'] = `<div class="dropdown-menu">
        <div class="arrow">
            <div class="menu-arrow"></div>
        </div>
        <div class="reset" data-trans="data-tip#reset#ah_filter_history"><div class="ie-icon ie-icon-close"></div></div>

        <div class="scroll-wrapper menu-wrapper">
            <div class="wrapper scroll-pane"></div>
        </div>
    </div>`;

//<!-- gold shop !-->
//<!--TEMPLATES['dupa'] = <div class="gold-shop">-->
//<!--<div class="gold-inner-content">-->
//<!--<div class="header"></div>-->
//<!--<div class="options"></div>-->
//<!--<div class="sl-link"></div>-->
//<!--<div class="close-btn"></div>-->
//<!--</div>-->
//<!--</div>-->
//
//<!-- gold shop !-->
TEMPLATES['gold-shop'] = `<div class="gold-shop">
        <!--<div class="header-graphics"></div>-->
        <div class="header-big-label"></div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="middle-graphics interface-element-middle-1-background"></div>
            </div>
        </div>
        <div class="footer">
            <!--<div class="bottom-panel-graphics"></div>-->
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="chest-graphic"></div>
            <div class="table-wrapper">
                <div class="sl-label"></div>
                <div class="buy-sl-btn"></div>
                <div class="close-btn"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['one-offer'] = `<div class="one-offer">
        <div class="sl-header"></div>
        <div class="gold-header"></div>
        <div class="change-btn"></div>
        <div class="save-money"></div>
    </div>`;

//<!-- gold box !-->
TEMPLATES['gold-box'] = `<div class="gold-box">
        <div class="bg">
            <span class="sl"></span>
            <span class="gold-span"></span>
        </div>
    </div>`;

TEMPLATES['draconite-shop'] = `<div class="draconite-shop">
        <div class="draconite-shop-content">
            <iframe class="sl-window"></iframe>
        </div>
    </div>`;

TEMPLATES['addons-panel'] = `<div class="addons-panel">
        <div class="left-column">
            <div class="interface-element-middle-3-background-stretch"></div>
            <div class="main-header">
            <div class="interface-element-active-card-background-stretch"></div>
                <div class="addon-list-label"></div>
            </div>
            <div class="search-wrapper addon-search">
                <input class="search" data-trans="placeholder#search"/>
                <div class="search-x" data-trans="data-tip#delete"></div>
            </div>
            <div class="left-scroll scroll-wrapper classic-bar">
                <div class="scroll-pane">
                    <div class="addon-list"></div>
                </div>
            </div>
        </div>
        <div class="right-column">
            <div class="interface-element-middle-2-background-stretch"></div>
            <div class="right-header-graphic">
                <div class="interface-element-active-card-background-stretch"></div>
            </div>
            <div class="addon-header">
                <div class="img-wrapper">
                    <div class="widget-button red no-hover">
                        <div class="addon-header-img icon"></div>
                    </div>
                </div>
                <div class="title-wrapper">
                    <div class="addon-header-title"></div>
                </div>
            </div>
            <div class="right-scroll scroll-wrapper classic-bar">
                <div class="scroll-pane">
                </div>
            </div>
        </div>
    </div>`;

TEMPLATES['border-blink'] = `<div class="border-blink"></div>`;


TEMPLATES['one-addon-on-list'] = `<div class="one-addon-on-list">
        <div class="img-wrapper">
            <div class="widget-button red no-hover">
                <div class="addon-img icon"></div>
            </div>
        </div>
        <div class="title-wrapper">
            <div class="addon-title"></div>
        </div>
    </div>`;


//<!--<div data-template="one-addon-on-list">-->
//<!--<div class="addon-icon-wrapper">-->
//<!--<div class="addon-icon"></div>-->
//<!--</div>-->
//<!--<div class="addon-info">-->
//<!--<div class="addon-tittle"></div>-->
//<!--<div class="addon-author"></div>-->
//<!--<div class="addon-points"></div>-->
//<!--<div class="addon-more-btn"></div>-->
//<!--</div>-->
//<!--</div>-->
//
//<!-- one addon description !-->
//<!--<div data-template="one-addon-description">-->
//<!--<div class="addon-header">-->
//<!--<div class="addon-icon-wrapper">-->
//<!--<div class="addon-icon"></div>-->
//<!--</div>-->
//<!--<div class="addon-info">-->
//<!--<div class="addon-top-header">-->
//<!--<div class="addon-title"></div>-->
//<!--</div>-->
//<!--<div class="addon-down-header">-->
//<!--<div class="addon-author"></div>-->
//<!--<div class="addon-born"></div>-->
//<!--<div class="addon-public">-->
//<!--<div class="wrapper">-->
//<!--<div class="addon-points"></div>-->
//<!--</div>-->
//<!--<div class="wrapper">-->
//<!--<div class="addon-like"></div>-->
//<!--</div>-->
//<!--<div class="wrapper">-->
//<!--<div class="addon-unlike"></div>-->
//<!--</div>-->
//<!--<div class="wrapper">-->
//<!--<div class="addon-spoil"></div>-->
//<!--</div>-->
//<!--</div>-->
//<!--<div class="addon-desc-action-buts"></div>-->
//<!--</div>-->
//<!--</div>-->
//<!--</div>-->
//<!--<div class="scroll-wrapper">-->
//<!--<div class="scroll-pane">-->
//<!--<div class="addon-description-label"></div>-->
//<!--<div class="addon-description"></div>-->
//<!--<div class="addon-comm-label"></div>-->
//<!--<div class="addon-add-comm"></div>-->
//<!--<textarea class="addon-comm-txt"></textarea>-->
//
//<!--<div class="addon-add-comm-btn"></div>-->
//<!--<div class="addon-all-comments-label"></div>-->
//<!--<div class="addon-all-comments"></div>-->
//<!--</div>-->
//<!--</div>-->
//<!--</div>-->
//
//<!-- one addon comment !-->
//<!--<div data-template="one-addon-comment">-->
//<!--<div class="addon-nick"></div>-->
//<!--<div class="addon-ago"></div>-->
//<!--<div class="addon-comment"></div>-->
//<!--</div>-->

TEMPLATES['one-addon-description'] = `<div class="one-addon-description">
        <div class="on-off-button"></div>
        <div class="description-label" data-trans="#description#extManager"></div>
        <div class="description-text"></div>
        <!--<div class="location-menu menu"></div>-->
        <div class="drag-info" data-trans="#drag-info#extManager"></div>
    </div>`;

//<!-- skills !-->
TEMPLATES['skills-window'] = `<div class="skills-window">
        <!--<div class="header-wrapper">-->
        <!--<div class="graphic"></div>-->
        <!--<div class="edit-header-label" data-trans="#clickSkills"></div>-->
        <!--</div>-->
        <div class="left-column">
            <div class="middle-graphic interface-element-middle-1-background"></div>
            <div class="list-label-wrapper">
                <div class="interface-element-active-card-background-stretch"></div>
                <div class="list-border"></div>
                <div class="list-label">
                    <div class="label" data-trans="#skills_tip#buttons"></div>
                </div>
            </div>
            <div class="scroll-wrapper classic-bar skills-wrapper">
                <div class="scroll-pane">
                    <div class="description-wrapper"></div>
                </div>
            </div>
        </div>
        <div class="right-column">
            <div class="middle-graphic interface-element-middle-2-background"></div>
            <!--<div class="maku-wood"></div>-->
            <div class="points-header-wrapper">
                <div class="interface-element-active-card-background-stretch"></div>
                <div class="skills-points-wrapper">
                    <div class="skills-points-description" data-trans="#skills_points_description#skills"></div>
                    <div class="skills-points">
                    <span class="skills_learnt"></span>/<span class="skills_total"></span>
                    </div>
                </div>
                <!--<div class="operations-cost"></div>-->
                <!--<div class="btn-wrapper"></div>-->
            </div>
            <div class="scroll-wrapper classic-bar info-description">
                <div class="scroll-pane">
                    <div class="empty">
                        <div class="center">
                            <div class="info1" data-trans="#how_to_description#skills"></div>
                            <div class="info2" data-trans="#how_to_description2#skills"></div>
                            <div class="empty-reset-button"></div>
                        </div>
                    </div>
                    <div class="description-wrapper"></div>
                </div>
            </div>
        </div>
        <div class="bottom-part">
            <!--<div class="bottom-panel-graphics"></div>-->
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="free-skills-label"></div>
            <div class="MB-wrapper">
                <div class="MB-label-1" data-trans="#available_label"></div>
                <div class="info-icon" data-trans="data-tip#mb_tip"></div>
                <div class="MB-label-2" data-trans="#mbattle"></div>
                <div class="MB-button"></div>
                <div class="MB-icon skill-icon pl icon-106"></div>
            </div>
            <div class="bottom-right"></div>
        </div>
    </div>`;

//<!-- single skill !-->
TEMPLATES['skill'] = `<div class="skill">
        <div class="icon-background"></div>
        <div class="val-background"></div>
        <div class="skill-tip"></div>
        <div class="skill-background"></div>
        <div class="label-wrapper">
            <div class="label-background">
                <label></label>
            </div>
        </div>
        <div class="active"></div>
        <div class="quick-skill"></div>
    </div>`;

//<!-- skill description !-->
TEMPLATES['skill-description'] = `<div class="skill-description">
        <div class="skill-learn">
            <div class="skill-slider"></div>
            <div class="skill-learn-price">
                <span class="price"></span>
                <span class="small-money"></span>
            </div>
            <div class="skill-learn-btn"></div>
        </div>
        <div class="header">
            <div class="icon-wrapper"></div>
            <div class="right-wrapper">
                <div class="name"></div>
                <div class="description"></div>
                <div class="show-in-battle"></div>
            </div>
        </div>
        <div class="board-wrapper">
            <!--<div class="board-graphic"></div>-->
            <div class="requirements-wrapper stone interface-element-active-card-border-image">
                <div class="title" data-trans="#lower_requirements#skills"></div>
                <div class="icons"></div>
            </div>
            <div class="stats-wrapper stone interface-element-active-card-border-image">
                <div class="stats-h" data-trans="#stats_header#skills"></div>
                <div class="icon-tip" data-trans="data-tip#next_level_stat_info#buttons"></div>
                <div class="all-stats"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['skills-description-wrapper'] = `<div class="info-box skills-description-wrapper description-wrapper"></div>`;

TEMPLATES['skills-notif'] = `<div class="skills-notif notif"></div>`;

TEMPLATES['del-skill-middle-layer'] = `<div class="del-skill-middle-layer"></div>`;
TEMPLATES['del-skill-left-layer'] = `<div class="del-skill-left-layer"></div>`;
TEMPLATES['del-skill-right-layer'] = `<div class="del-skill-right-layer"></div>`;

TEMPLATES['skill-background-tpl'] = `<div class="skill-background-tpl interface-element-box-shadow-1 background"></div>`;

TEMPLATES['battle-skill-in-skill-panel'] = `<div class="battle-skill-in-skill-panel battle-skill"></div>`;

//<!-- MBEditor !-->
TEMPLATES['MBEditor'] = `<div class="MBEditor">
        <div class="list-name"></div>
        <div class="buttons-wrapper">
            <!--<div class="close-btn"></div>-->
            <div class="interface-element-header-1-background-stretch"></div>
            <div class="save-btn"></div>
            <div class="clear-btn"></div>
            <div class="checkbox-wrapper">
                <div class="mb-box-input checkbox"></div>
                <div class="mb-label checkbox-label" data-trans="#repeat_list#skills"></div>
            </div>
        </div>
        <div class="skills-list"></div>

    </div>`;

TEMPLATES['additional-skill-panel'] = `<div class="additional-skill-panel">
        <div class="graphics">
            <div class="additional-skill-panel-border"></div>
            <div class="bottom-graphic">
                <div class="interface-element-bottom-bar-background-stretch"></div>
            </div>
        </div>
        <div class="header-tip" data-trans="#dragSkills#skills"></div>
        <div class="skill-usable-add-slots left">
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="8"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="9"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="10"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="11"></div>
        </div>
        <div class="skill-usable-add-slots right">
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="15"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="14"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="13"></div>
            <div class="skill-usable-slot interface-element-one-item-slot-2" slot="12"></div>
        </div>
    </div>`;

TEMPLATES['single-skill-row'] = `<div class="single-skill-row">
        <div class="number"></div>
        <div class="skill-name"></div>
        <div class="buy-wrapper">
            <div class="money-buy"></div>
            <div class="sl-buy"></div>
        </div>
        <div class="arrows-wrapper">
            <div class="down-arrow pos-up"></div>
            <div class="up-arrow pos-up"></div>
            <div class="remove-cross pos-up"></div>
        </div>
    </div>`;


TEMPLATES['battle-pass-window'] =
    `<div class="battle-pass-window">
        <div class="cards-header-wrapper">
            <div class="header-background-graphic"></div>
            <div class="cards-header"></div>
        </div>
        <div class="battle-pass-header-wrapper">
            <div class="battle-pass-banner-graphic"></div>
            <div class="battle-pass-banner-icon"></div>
            <div class="battle-pass-buttons"></div>
        </div>
        <div class="battle-pass-challenges section">
            <div class="scroll-wrapper classic-bar">
                <div class="battle-pass-bg interface-element-middle-1-background"></div>
                <div class="scroll-pane">
                    <div class="daily-mission battle-pass-tiles-wrapper">
                        <div class="tiles-wrapper-header" data-trans="#daily_chalanges"></div>
                        <div class="tiles-wrapper-header-time"></div>
                        <div class="tiles-wrapper"></div>
                        <div class="roll-mission-wrapper">
                            <div class="roll-mission-label" data-trans="#reload_mission"></div>
                            <div class="roll-mission-icon"></div>
                            <div class="line interface-element-line-1-background"></div>
                        </div>
                    </div>
                    <div class="global-mission battle-pass-tiles-wrapper">
                        <div class="tiles-wrapper-header" data-trans="#season_chalanges"></div>
                        <div class="tiles-wrapper-header-time"></div>
                        <div class="tiles-wrapper"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="battle-pass-rewards section">
            <div class="scroll-wrapper classic-bar">
                <div class="battle-pass-bg"></div>
                <div class="scroll-pane">
                    <div class="reward-header">
                        <div class="free-label" data-trans="#free_rewards"></div>
                        <div class="battle-pass-icon-wrapper">
                            <div class="battle-pass-icon"></div>
                        </div>
                        <div class="premium-label" data-trans="#premium_rewards"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-row-panel">
        <div class="interface-element-middle-2-background-stretch"></div>
            <!--<div class="bottom-panel-graphics"></div>-->
            <div class="your-all-points-wrapper">
                <div class="all-points-icon"></div>
                <div class="points"></div>
            </div>
        </div>
      </div>`;

TEMPLATES['battle-pass-mission-tile'] =
    `<div class="battle-pass-mission-tile">
         <div class="mission-reward-wrapper">
            <div class="mission-reward-icon"></div>
            <div class="mission-reward-label"></div>
         </div>
         <div class="mission-header"></div>
         <div class="mission-stage"></div>
         <div class="mission-prev-button"></div>
         <div class="mission-next-button"></div>
         <div class="mission-description"></div>
         <div class="place-to-mission-progress-bar"></div>
      </div>`;

TEMPLATES['battle-pass-reward-record'] = `
        <div class="battle-pass-reward-record">
            <div class="battle-pass-table">
                <div class="standard-reward-button-ceil"></div>
                <div class="standard-reward-item-ceil reward-item-ceil">
                    <div class="reward-item-wrapper"></div>
                </div>
                <div class="premium-reward-item-ceil reward-item-ceil">
                    <div class="reward-item-wrapper"></div>
                </div>
                <div class="premium-reward-button-ceil"></div>
            </div>
            <div class="line interface-element-line-1-background"></div>
            <div class="battle-pass-reward-progress-barr-wrapper">
                <div class="vertical-progress-bar-wrapper">
                    <div class="inner"></div>
                    <div class="progress-bar-background"></div>
                </div>
                <div class="threshold amount-border"></div>
            </div>
        </div>
    `;


TEMPLATES['mission-progress-bar'] = `
        <div class="mission-progress-bar">
            <div class="inner-wrapper">
                <div class="inner" bar-horizontal="true"></div>
                <div class="progress-bar-background"></div>
                <div class="text"></div>
            </div>
        </div>`;

//<!-- settings window !-->
TEMPLATES['settings-window'] = `<div class="settings-window">
        <!--
        <div class="cards-header-wrapper">
            <div class="header-background-graphic"></div>
            <div class="cards-header"></div>
        </div>
        -->
        <div class="cards-header-wrapper"></div>
        <div class="hero-options-config section">
            <div class="scroll-wrapper classic-bar">
                <div class="scroll-pane">
                    <div class="graphic-background interface-element-middle-1-background"></div>
                    <div class="first-c">
                        <h2 class="settings-notification">
                            <div class="interface-element-header-1-background-stretch"></div>
                            <span></span>
                        </h2>
                        <ul class="hero-options">
                            <li data-serveroption="1" class="opt_${RECEIVE_PRIVATE_CHAT_MESSAGE}"></li>
                            <li data-serveroption="6" class="opt_${MAIL_FROM_UNKNOWN}"></li>
                            <li data-serveroption="3" class="opt_${TRADE_WITH_OTHERS}"></li>
                            <li data-serveroption="5" class="opt_${INVITATION_TO_FRIENDS}"></li>
                            <li data-serveroption="21" class="opt_${INFORM_ABOUT_FREE_PLACE_IN_BAG}"></li>
                            <li data-serveroption="2" class="opt_${INVITATION_TO_CLAN_AND_DIPLOMACY}"></li>
                            <li data-serveroption="14" class="opt_${INVITATION_TO_PARTY_BEYOND_FRIENDS_AND_CLANS_AND_CLANS_ALLY}"></li>
                            <li data-serveroption="9" class="opt_${CLAN_MEMBER_ENTRY_CHAT_MESSAGE}"></li>
                            <li data-serveroption="15" class="opt_${FRIEND_ENTRY_CHAT_MESSAGE}"></li>
                            <li data-serveroption="18" class="opt_${ADD_OR_REMOVE_PARTY_MEMBER_CHAT_MESSAGE}"></li>
                        </ul>
                    </div>
                    <div class="seccond-c">
                        <h2 class="settings-game">
                            <div class="interface-element-header-1-background-stretch"></div>
                            <span></span>
                        </h2>
                        <ul class="hero-options">

                            <li data-serveroption="8" class="opt_${INTERFACE_ANIMATION}"></li>
                            <li data-serveroption="7" class="opt_${MOUSE_HERO_WALK}"></li>
                            <li data-serveroption="16" class="opt_${WEATHER_AND_EVENT_EFFECTS}"></li>
                            <li data-serveroption="11" class="opt_${CYCLE_DAY_AND_NIGHT}"></li>
                            <li data-serveroption="23" class="opt_${LOADER_SPLASH}"></li>
                            <li data-serveroption="24" class="opt_${WAR_SHADOW}"></li>
                            <li data-serveroption="17" class="opt_${BANNERS}"></li>

            

                            <li data-serveroption="19" class="opt_${MAP_ANIMATION}"></li>
                            <li data-serveroption="13" class="opt_${SHOW_ITEMS_RANK}"></li>
                            <li data-serveroption="12" class="opt_${AUTO_GO_THROUGH_GATEWAY}"></li>
                            
                            <li data-serveroption="25" class="opt_${AUTO_COMPARE_ITEMS}"></li>
                            

                            <li>
                                <div class="settings-opt-menu-wrapper opt_${KIND_OF_SHOW_LEVEL_AND_OPERATION_LEVEL}"></div>
                            </li>

                        </ul>
                    </div>
                    
                    <div class="third-c">
                        <h2 class="settings-battle">
                            <div class="interface-element-header-1-background-stretch"></div>
                            <span></span>
                        </h2>
                        <ul class="hero-options">
                            ${isEn() ? '' :`<li data-serveroption="26" class="opt_${BATTLE_EFFECTS}"></li>`}
                            <li data-serveroption="4" class="opt_${TURN_BASED_COMBAT_AFTER_MONSTER_ATTACK}"></li>
                            <li data-serveroption="27" class="opt_${AUTO_CLOSE_BATTLE}"></li>
                            <div class="opt_${BERSERK}">
                              <li data-serveroption="${BERSERK_V}"></li>
                              <li data-serveroption="${BERSERK_LVL_MIN_LVL_MAX}"></li>
                              <div class="berserk-opt-label opt-label" data-trans="#monster_type"></div>
                              <li data-serveroption="${BERSERK_COMMON}"></li>
                              <li data-serveroption="${BERSERK_ELITE}"></li>
                              <li data-serveroption="${BERSERK_ELITE2}"></li>
                            </div>
                            <div class="opt_${BERSERK_GROUP}">
                              <li data-serveroption="${BERSERK_GROUP_V}"></li>
                              <li data-serveroption="${BERSERK_GROUP_LVL_MIN_LVL_MAX}"></li>
                              <div class="berserk-group-opt-label opt-label" data-trans="#monster_type"></div>
                              <li data-serveroption="${BERSERK_GROUP_COMMON}"></li>
                              <li data-serveroption="${BERSERK_GROUP_ELITE}"></li>
                              <li data-serveroption="${BERSERK_GROUP_ELITE2}"></li>
                            </div>
                        </ul>
                    </div>
                    
                    <!--<div class="options-config-buttons"></div>-->
                </div>
            </div>
        </div>
        <div class="hot-keys-config section">
            <div class="scroll-wrapper classic-bar">
                <div class="scroll-pane">
                    <div class="graphic-background interface-element-middle-1-background"></div>
                    <!--<h2 class="settings-keys"></h2>-->

                    <div class="move-keys keys-section">
                        <table class="hot-keys-list interface-element-table-3">
                            <tr class="table-header-tr"><td colspan="4" data-trans="#move-header#help"></td></tr>
                        </table>
                    </div>
                    <div class="fight-keys keys-section">
                        <table class="hot-keys-list interface-element-table-3">
                            <tr class="table-header-tr"><td colspan="4" data-trans="#fight-header#help"></td></tr>
                        </table>
                    </div>
                    <div class="map-keys keys-section">
                        <table class="hot-keys-list interface-element-table-3">
                        <tr class="table-header-tr"><td colspan="4" data-trans="#clickMiniMap"></td></tr>
                        </table>
                    </div>
                    <div class="social-keys keys-section">
                        <table class="hot-keys-list interface-element-table-3">
                            <tr class="table-header-tr"><td colspan="4" data-trans="#society"></td></tr>
                        </table>
                    </div>
                    <div class="other-keys keys-section">
                        <table class="hot-keys-list interface-element-table-3">
                            <tr class="table-header-tr"><td colspan="4" data-trans="#tab_other#auction"></td></tr>
                        </table>
                    </div>
                </div>
                <!--<table class="static-bar-table"></table>-->
            </div>
            <!--<div class="hot-keys-config-buttons"></div>-->
        </div>
        <div class="notifications-config section">
            <div class="scroll-wrapper classic-bar">
                <div class="scroll-pane">
                    <div class="graphic-background interface-element-middle-1-background"></div>
                    <h2 class="settings-notifications">
                        <div class="interface-element-header-1-background-stretch"></div>
                        <span></span>
                    </h2>
                    <div class="all-notification"></div>
                    <!--<div class="notifications-config-buttons"></div>-->
                    <h2 class="settings-sounds">
                        <div class="interface-element-header-1-background-stretch"></div>
                        <span></span>
                    </h2>
                    <div class="display-table">
                        <div class="middle music-manager-wrapper"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-bar">
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="options-config-buttons save-card-button"></div>
            <div class="hot-keys-config-buttons save-card-button"></div>
            <div class="notifications-config-buttons save-card-button"></div>
        </div>
    </div>`;

TEMPLATES['sound-volume-bar-old'] = `
        <div class="display-table">
            <div class="middle">
                <!--<div class="loudly-panel-txt" data-trans="#sound_notification_level"></div>-->
                <div class="loudly-panel-txt" data-trans="#sound_notification_level"></div>
                <div class="loudly-panel">
                    <div class="center">
                        <div class="icon-wrapper">
                            <div class="loudly-icon"></div>
                        </div>
                        <div class="slider-wrapper">
                            <div class="volumeSlider">
                                <div class="marker"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="loudly-panel-buttons"></div>
            </div>
        </div>`;

TEMPLATES['sound-volume-bar'] = `
        <div class="display-table">
            <div class="middle">
                <!--<div class="loudly-panel-txt" data-trans="#sound_notification_level"></div>-->
                <div class="loudly-panel-txt" data-trans="#sound_notification_level"></div>
                <div class="loudly-panel">
                    <div class="center">
                        <div class="icon-wrapper">
                            <div class="loudly-icon"></div>
                        </div>
                        <div class="slider-wrapper"></div>
                    </div>
                </div>
                <div class="loudly-panel-buttons"></div>
            </div>
        </div>`;

TEMPLATES['catch-char'] = `<div class="catch-char">
        <div class="middle-background interface-element-middle-2-background-stretch"></div>
        <div class="give-char"></div>
        <div class="cancel-char btns-spacing"></div>
    </div>`;

TEMPLATES['pad-controller'] = `<div class="pad-controller">
        <div class="pad-bck interface-element-box-shadow-2">
            <div class="pad-ball"></div>
        </div>
    </div>`;

TEMPLATES['one-checkbox'] = `<div class="one-checkbox">
        <div class="checkbox"></div>
        <span class="label"></span>
    </div>`;

//<!-- stat-row !-->
TEMPLATES['stat-row'] = `<div class="stat-row" data-herostat="">
        <span class="label" data-trans=""></span>
        <span class="value">-</span>
    </div>`;

TEMPLATES['input'] = `<div class="input input-wrapper in-line">
        <input class="default">
    </div>`;

TEMPLATES['ni-input-text'] = `<div class="ni-input">
        <input class="default">
        <div class="clear-cross"></div>
    </div>`;

//<!-- ability points window !-->
TEMPLATES['ability-points'] = `<div class="ability-points">
        <div class="ability-header"></div>
        <div class="ability-content"></div>
    </div>`;

//<!--ability row !-->
TEMPLATES['ability-row'] = `<div class="ability-row">
        <div class="img-wrapper">
            <div class="img"></div>
        </div>
        <div class="row-content">
            <div class="row-header"></div>
            <div class="description"></div>
        </div>
        <div class="points">
            <div class="text"></div>
            <div class="btn-wrapper"></div>
        </div>
    </div>`;

//<!-- motel !-->
TEMPLATES['motel-window'] = `<div class="motel-window">
        <!--<div class="header-wrapper">-->
        <!--<div class="graphic"></div>-->
        <!--<div class="motel-label"></div>-->
        <!--</div>-->
        <div class="interface-element-middle-1-background-stretch"></div>
        <!--<div class="desc"></div>-->
        <div class="table-wrapper scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="info-box info-box-1" data-trans="yours-room-header"></div>
                <!--<div class="interface-element-header-1">-->
                    <!--<div class="interface-element-header-1-background-stretch"></div>-->
                    <!--<span data-trans="yours-room-header"></span>-->
                <!--</div>-->
                <table class="yours-room interface-element-table-3">
                    <thead>
                    <tr class="table-header-tr">
                        <td class="room-th"></td>
                        <td class="state-th"></td>
                        <td class="amount-th"></td>
                        <td class="price-th"></td>
                        <td class="action-th"></td>
                    </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <div class="info-box info-box-2" data-trans="rooms-to-rent-header"></div>
                <!--<div class="interface-element-header-1">-->
                    <!--<div class="interface-element-header-1-background-stretch"></div>-->
                    <!--<span data-trans="rooms-to-rent-header"></span>-->
                <!--</div>-->
                    <!--<div class="rooms-description" data-trans="rooms-to-rent-header"></div>-->
                <table class="to-rent-room interface-element-table-3">
                    <thead>
                    <tr class="table-header-tr">
                        <td class="room-th"></td>
                        <td class="state-th"></td>
                        <td class="time-th"></td>
                        <td class="price-th"></td>
                        <td class="action-th"></td>
                    </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <!--<div class="info-wrapper"></div>-->
            </div>
        </div>
    </div>`;


TEMPLATES['music-manager-old'] = `<div class="music-manager">
        <div class="loudly-panel-txt" data-trans="#clickMusic"></div>
        <div class="loudly-panel">
            <div class="center">
                <div class="icon-wrapper">
                    <div class="loudly-icon"></div>
                </div>
                <div class="slider-wrapper">
                    <div class="volumeSlider">
                        <div class="marker"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="loudly-panel-buttons">
            <div class="quality-wrapper"></div>
            <div class="list-wrapper"></div>
            <div class="divide-wrapper"></div>
        </div>
    </div>`;

TEMPLATES['music-manager'] = `<div class="music-manager loudly-panel-buttons">
            <div class="quality-wrapper"></div>
            <div class="list-wrapper"></div>
            <div class="divide-wrapper"></div>
    </div>`;

TEMPLATES['relogger'] = `<div class="relogger">
        <div class="relogger__success">
            <div class="relogger__top">
                <div class="relogger__characters"></div>
                <div class="c-line mt-0 mb-0"></div>
            </div>
            <div class="relogger__collapse">
                <div class="relogger__header mt-2 mb-2" data-trans="#select_world#change_player"></div>
                <div class="scroll-wrapper">
                    <div class="scroll-pane">
                        <div class="relogger__worlds"></div>
                    </div>
                </div>
                <div class="c-line mt-0"></div>
                <div class="relogger__bottom"></div>
            </div>
        </div>
        <div class="relogger__error"></div>
    </div>`;

// TEMPLATES['change-player'] = `<div class="change-player">
//     <div class="scroll-wrapper">
//         <div class="scroll-pane">
//             <div class="header"></div>
//             <div class="menu-wrapper">
//                 <div class="menu change-world"></div>
//             </div>
//             <div class="all-world"></div>
//             <div class="magic-line"></div>
//             <div class="log-out"></div>
//         </div>
//     </div>
// </div>`;
//
// TEMPLATES['change-player-world'] = `<div class="change-player-world world">
//     <div class="world-player-list btns-spacing-y"></div>
// </div>`;
//
// TEMPLATES['change-player-one-world'] = `<div class="change-player-one-world one-world"></div>`;

TEMPLATES['who-is-here'] = `<div class="who-is-here">
        <div class="open-edit-panel"></div>
        <div class="players-number">
            (<span class="num"></span>) <div class="info-icon small-header-info" data-tip=""></div>
        </div>
        <div class="header"></div>
        <div class="scroll-wrapper">
            <div class="scroll-pane">
                <div class="empty">----</div>
                <div class="player-list"></div>
            </div>
        </div>
        <!--<div class="search-wrapper">-->
            <!--<input class="search" data-trans="placeholder#search">-->
            <!--<div class="search-x" data-trans="data-tip#delete"></div>-->
        <!--</div>-->
    </div>`;

TEMPLATES['quest-observe-window'] = `<div class="quest-observe-window">
        <div class="scroll-wrapper">
            <div class="scroll-pane">
                <div class="empty">----</div>
                <div class="quest-observe-list"></div>
            </div>
        </div>
        <div class="relogger__error"></div>
    </div>`;

TEMPLATES['activity-observe'] = `<div class="activity-observe">
        <div class="activity-observe__players"></div>
        <div class="c-line mt-0 mb-2"></div>
        <div class="scroll-wrapper">
            <div class="scroll-pane">
                <div class="activity-observe__list"></div>
                <div class="activity-observe__empty" data-trans="#no-activities#activities"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['activity-observe-category'] = `<div class="activity-observe__category"></div>`;

TEMPLATES['one-observe'] = `<div class="one-observe">
        <span class="one-observe__debug"></span>
        <div class="one-observe__title"></div>
        <div class="one-observe__content"></div>
        <div class="one-observe__remove-btn"><div class="ie-icon ie-icon-close"></div></div>
        <div class="c-line end-line"></div>
    </div>`;

TEMPLATES['outfit-selector-arrow'] = `<div class="outfit-selector-arrow"></div>`

TEMPLATES['outfit-selector-header'] = `<div class="outfit-selector-header">
        <span class="header-wrapper">
            <span class="outfit-selector-index"></span> z <span class="outfit-selector-index-max"></span>
        </span>
    </div>`;

TEMPLATES['choose-outfit'] = `<div class="choose-outfit">
        <div class="middle-graphics interface-element-middle-1-background"></div>
        <div class="choose-outfit-info" data-trans="#choose-outfit-info"></div>
        <div class="all-outfits"></div>
        <div class="buttons-wrapper">
            <div class="save-button"></div>
            <div class="cancel-button"></div>
        </div>
    </div>`;

TEMPLATES['choose-outfit-wrapper'] = `<div class="choose-outfit-wrapper">
        <div class="outfit-name"></div>
        <div class="outfit-image"></div>
        <!--<div class="outfit"></div>-->
    </div>`;


TEMPLATES['change-outfit'] = `<div class="change-outfit">
        <div class="middle-graphics interface-element-middle-1-background"></div>

        <div class="cards-header-wrapper">
            <!--<div class="header-background-graphic"></div>-->
            <!--<div class="cards-header"></div>-->
        </div>

        <div class="default-section scroll-wrapper section classic-bar">
            <div class="scroll-pane default-outfits"></div>
        </div>

        <div class="equip-section scroll-wrapper section classic-bar">
            <div class="scroll-pane equip-outfits">
                <div class="empty-info" data-trans="#empty-info"></div>
            </div>
        </div>

        <div class="your-outfit">
            <div class="outfit-header interface-element-table-header-1-background"></div>
            <div class="outfit-wrapper">
                <div class="outfit-graphic"></div>
            </div>
        </div>

        <div class="crazy-bar interface-element-vertical-wood"></div>

        <div class="preview-outfit">
            <div class="outfit-header interface-element-table-header-1-background"></div>
            <div class="outfit-wrapper">
                <div class="outfit-graphic"></div>
            </div>
        </div>

        <div class="bottom-change-outfit-panel">
            <!--<div class="bottom-panel-graphics"></div>-->
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="save-button"></div>
        </div>
    </div>`;

//TEMPLATES['one-outfit'] = `<div class="one-outfit">
//    <div class="outfit-border"></div>
//    <div class="outfit-wrapper"></div>
//    <div class="outfit-timelimit"></div>
//    <div class="requirements">
//        <span class="text"></span>
//    </div>
//    <div class="amount"></div>
//</div>`;

TEMPLATES['character-reset'] = `<div class="character-reset">
        <div class="graphic-background interface-element-middle-1-background"></div>
        <div class="sex-section">
            <div class="info-box" data-trans="#selectGenderLabel#characterReset"></div>
            <div class="sex-wrapper"></div>
        </div>
        <div class="prof-section">
            <div class="info-box" data-trans="#selectProfLabel#characterReset"></div>
            <div class="prof-wrapper"></div>
            <div class="prof-description"></div>
        </div>
        <div class="payment-section">
            <div class="info-box" data-trans="#confirmCharacterReset#characterReset"></div>
            <div class="payment-wrapper info-box-cost"></div>
        </div>
        <div class="button-wrapper"></div>
    </div>`;

TEMPLATES['outfit-card'] = `<div class="outfit-card">
        <div class="outfit-border"></div>
        <div class="outfit-wrapper"></div>
        <div class="disable-text"></div>
        <div class="text-wrapper">
            <span class="text"></span>
        </div>
        <div class="amount"></div>
    </div>`;

TEMPLATES['who-is-here-one-type'] = `<div class="who-is-here-one-type clearfix">
        <div class="type"></div>
        <div class="amount"></div>
    </div>`;

TEMPLATES['log-off'] = `<div class="log-off">
        <div class="middle-background interface-element-middle-2-background-stretch"></div>
        <div class="time-to-out"></div>
        <div class="log-out-actions btns-spacing"></div>
    </div>`;

TEMPLATES['wanted-skull-wrapper'] = `<div class="wanted-skull-wrapper wanted-wrapper">
        <div class="skull"></div>
    </div>`;

TEMPLATES['who-is-here-edit'] = `<div class="who-is-here-edit">
        <div class="con">
            <!--<div class="header"></div>-->
            <div class="middle-graphics"></div>
            <div class="show-label"></div>
            <div class="color-label"></div>
            <div class="show-map-label"></div>
            <div class="all-colors"></div>
        </div>
        <div class="bottom-bar">
            <div class="buttons">
                <div class="save-colors"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['first-column-who-is-here'] = `<div class="first-column-who-is-here first-column"></div>`;

TEMPLATES['second-column-who-is-here'] = `<div class="second-column-who-is-here second-column"></div>`;

TEMPLATES['color-to-choose-who-is-here'] = `<div class="color-to-choose-who-is-here color-to-choose"></div>`;

TEMPLATES['rewards-calendar'] = `<div class="rewards-calendar">
        <div class="calendar-background"></div>
        <div class="calendar-year"></div>
        <div class="calendar-month-header">
            <div class="month-wrapper">
                <div class="prev-month month-item"></div>
                <div class="click-prev month-item direction"><</div>
                <div class="actual-month"></div>
                <div class="click-next month-item direction">></div>
                <div class="next-month month-item"></div>
            </div>
        </div>
        <div class="calendar-days-header"></div>
        <div class="calendar-days-content"></div>
    </div>`;

TEMPLATES['day-header'] = `<div class="day-header"></div>`;

TEMPLATES['day-wrapper-reward-calendar'] = `<div class="day-wrapper-reward-calendar day-wrapper">
        <div class="day">
            <div class="event-name"></div>
            <div class="day-nr"></div>
            <div class="reward">
                <div class="item-wrapper"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['reward-reward-calendar'] = `<div class="reward-reward-calendar"></div>`;

//<!--<div data-template="who-is-here-color">-->
//<!--<div class="txt-wrapper"><div class="text"></div></div>-->
//<!--<div class="menu-wrapper"><div class="menu"></div></div>-->
//<!--<div class="choose-color-wrapper">-->
//<!--<div class="open-palette"></div>-->
//<!--<div class="back-color"></div>-->
//<!--</div>-->
//<!--<div class="pick-color"></div>-->
//<!--</div>-->
//
//<!--<div data-template="who-is-here-color">-->
//<!--<div class="txt-wrapper"><div class="text"></div></div>-->
//<!--<div class="menu-wrapper"><div class="menu"></div></div>-->
//<!--<div class="choose-color-wrapper">-->
//<!--<div class="open-palette"></div>-->
//<!--<div class="back-color"></div>-->
//<!--</div>-->
//<!--<div class="pick-color"></div>-->
//<!--</div>-->

TEMPLATES['who-is-here-color'] = `<div class="who-is-here-color">
        <div class="txt-wrapper"><div class="text"></div></div>
        <div class="show-checkbox-wrapper"></div>
        <div class="glow-checkbox-wrapper"></div>
        <div class="choose-color-wrapper"></div>
        <div class="pick-color"></div>
        <div class="gray"></div>
    </div>`;

TEMPLATES['divide-and-color-edit'] = `<div class="divide-and-color-edit">
        <div class="middle-graphic interface-element-middle-1-background"></div>
        <div class="global-option-wrapper">
            <div class="info-box visibility-header" data-trans="#visibility-header#edit-panel-option"></div>
            <div class="global-option"></div>
            <div class="info-box display-header" data-trans="#display-header#edit-panel-option"></div>
        </div>
        <div class="by-name-option"></div>
        <div class="bottom-bar">
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="buttons save-colors"></div>
        </div>
    </div>`;

TEMPLATES['text-and-input'] = `<div class="text-and-input">
        <div class="text"></div>
        <!--<div class="input-wrapper">-->
            <!--<input type="number" class="amount-val default">-->
        <!--</div>-->
    </div>`;

TEMPLATES['divide-and-color-record'] = `<div class="divide-and-color-record">
        <div class="txt-wrapper"><div class="text"></div></div>
        <!--<div class="menu-wrapper"><div class="menu"></div></div>-->
        <div class="show-hand-held-mini-map-checkbox-wrapper"></div>
        <div class="show-data-drawer-nick-checkbox-wrapper"></div>
        <div class="show-data-drawer-prof-and-level-checkbox-wrapper"></div>
        <div class="show-who-is-here-checkbox-wrapper"></div>
        <div class="show-map-blur-checkbox-wrapper"></div>
        <div class="choose-color-wrapper"></div>
        <div class="pick-color"></div>
    </div>`;


TEMPLATES['color-picker'] = `
        <div class="color-picker">
            <div class="choose-color-wrapper">
                <div class="choose-color-bck"></div>
            </div>
            <div class="choose-icon-wrapper">
                <div class="choose-icon"></div>
            </div>
                <div class="pick-color-palette">
                    <div class="first-column-icon"></div>
                    <div class="first-column-color"></div>
                    <div class="second-column-color"></div>
                </div>
        </div>
    `;
/*
    TEMPLATES['divide-edit-panel'] = `<div class="divide-edit-panel">
        <div class="header-wrapper">
            <div class="graphic"></div>
            <div class="edit-header-label"></div>
        </div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="middle-graphic"></div>
                <div class="show-label"></div>
            </div>
        </div>
        <div class="bottom-bar">
            <div class="buttons save-colors"></div>
        </div>
    </div>`;
*/
//<!--TEMPLATES['dupa'] = <div class="one-edit-option">-->
//<!--<div class="txt-wrapper"><div class="text"></div></div>-->
//<!--<div class="menu-wrapper"><div class="menu"></div></div>-->
//<!--<div class="choose-color-wrapper">-->
//<!--<div class="open-palette"></div>-->
//<!--<div class="back-color"></div>-->
//<!--</div>-->
//<!--</div>-->


TEMPLATES['edit-panel-option'] = `<div class="edit-panel-option">
        <div class="icon-wrapper"><div class="icon-mark"></div></div>
        <div class="txt-wrapper"><div class="text"></div></div>
        <div class="menu-wrapper"><div class="menu"></div></div>
    </div>`;

TEMPLATES['one-other'] = `<div class="one-other tw-list-item">
        <div class="tip-container"></div>
        <div class="center">
            <div class="name"><div class="inner"></div></div>
            <div class="stasis" data-trans="data-tip#in_stasis#party"></div>
            <div class="stasis-incoming" data-trans="data-tip#in_stasis-incoming#party"></div>
            <div class="lvl"></div>
        </div>
    </div>`;


TEMPLATES['great-merchamp-menu'] = `<div class="great-merchamp-menu">
        <div class="header"></div>
        <div class="info"></div>
        <div class="checkbox-list">
            <div class="one-group">
                <div class="gr-1-label group-header" data-trans="#greatMerchampItemRank"></div>
                <div class="gr-1"></div>
            </div>
            <div class="one-group">
                <div class="gr-2-label group-header" data-trans="#greatMerchampItemSoulbound"></div>
                <div class="gr-2"></div>
            </div>
            <div class="one-group">
                <div class="gr-3-label group-header" data-trans="#greatMerchampItemKinds"></div>
                <div class="gr-3"></div>
            </div>
        </div>
        <div class="button-pannel btns-spacing"></div>
    </div>`;
/*
    TEMPLATES['loot-filter-manager'] = `<div class="loot-filter-manager">
        <div class="text-wrapper">
            <span class="loot-text"></span>
        </div>
        <div class="input-wrapper">
            <input class="more-than default" maxlength ="12" placeholder="0"/>
        </div>
        <div class="button-wrapper"></div>
        <div class="loot-info"></div>
    </div>`;
*/
TEMPLATES['details-progress'] = `<div class="details-progress">
        <div class="details-header"></div>
        <div class="details-txt"></div>
    </div>`;

TEMPLATES['matchmaking-overlay'] = `<div class="matchmaking-overlay"></div>`;

TEMPLATES['matchmaking-summary'] = `<div class="matchmaking-summary">
        <div class="graphic-background interface-element-middle-1-background-stretch"></div>
        <div class="summary-content">
            <div class="difficult-stars wood-bar">

                <div class="interface-element-header-1-background-stretch"></div>
                <div class="difficult-stars-val wood-bar-val">
                    <div class="text" data-trans="#fight_dificult"></div>
                    <div class="stars-wrapper">

                    </div>
                </div>
            </div>
            <div class="result-panel">
                <div class="your-side">
                    <div class="your-result"></div>
                    <div class="your-name"></div>
                    <div class="your-level-and-prof"></div>
                    <div class="your-prof"></div>
                    <div class="your-pr"></div>
                </div>
                <div class="middle-side">
                    <div class="middle-wrapper">
                        <div class="avatars-info-wrapper">
                            <div class="your-outfit-wrapper">
                                <div class="out-icon"></div>
                            </div>
                            <div class="vs-img-wrapper">
                                <div class="vs-img">VS</div>
                            </div>
                            <div class="enemy-outfit-wrapper">
                                <div class="out-icon"></div>
                            </div>
                        </div>
                    </div>
                    <div class="pr-change"></div>
                    <div class="arrow"></div>
                </div>
                <div class="enemy-side">
                    <div class="enemy-result"></div>
                    <div class="enemy-name"></div>
                    <div class="enemy-level-and-prof"></div>
                    <div class="enemy-pr"></div>
                </div>
            </div>
            <div class="progress-points wood-bar">

                <div class="interface-element-header-1-background-stretch"></div>
                <div class="progress-points-val wood-bar-val"></div>
            </div>
            <div class="current-stage"></div>
            <div class="price-info" data-trans="#price_info#matchmaking"></div>
            <div class="classification-match wood-bar">
                <div class="interface-element-header-1-background-stretch"></div>
                <div class="classification-match-val wood-bar-val"></div>
            </div>
        </div>

        <div class="bottom-panel-graphics">
        <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="tokens-amount"></div>
            <div class="close-wrapper"></div>
        </div>
    </div>`;

TEMPLATES['card'] = `<div class="card">
        <div class="label">
            <div class="number"></div>
            <div class="icons">
                <div class="cl-icon icon-soulbound"></div>
            </div>
        </div>
        <div class="card-notification"></div>
        <div class="amount"></div>
    </div>`;

TEMPLATES['achievement-section'] = `<div class="achievement-section"></div>`;

TEMPLATES['achievement-panel'] = `<div class="achievement-panel">
        <!--<div class="header-wrapper">-->
        <!--<div class="graphic"></div>-->
        <!--<div class="edit-header-label"></div>-->
        <!--</div>-->
        <div class="cards-header-wrapper">
            <div class="header-background-graphic"></div>
            <div class="cards-header"></div>
        </div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="middle-graphics interface-element-middle-1-background">
                </div>
            </div>
        </div>
        <div class="bottom-panel-graphics">
            <div class="interface-element-bottom-bar-background-stretch"></div>
        </div>
    </div>`;

TEMPLATES['one-achievement'] = `<div class="one-achievement">
        <div class="title-wrapper">
            <div class="achievement-title"></div>
            <div class="state-wrapper">
                <span>[</span>
                <span class="current"></span>
                <span>/</span>
                <span class="max"></span>
                <span>]</span>
            </div>
        </div>
        <div class="middle-wrapper">
            <div class="icon-wrapper">
                <div class="icon"></div>
            </div>
            <div class="info-wrapper">
                <div class="description-wrapper"></div>
            </div>
            <div class="progress-bar-wrapper">
                <div class="progress-bar"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['show-miniature'] = `<div class="show-miniature">
<!--        <div class="info-icon pet-action-info" data-trans="data-tip#action_info#pet"></div>-->
        <div class="info-icon pet-action-info"></div>
        <div class="canvas-wrapper">
            <!--<canvas class="show-miniature-canvas"></canvas>-->
        </div>
        <div class="menu-wrapper"></div>
    </div>`;

TEMPLATES['matchmaking-panel'] = `<div class="matchmaking-panel">
        <div class="header-wrapper">
            <div class="graphic"></div>
            <div class="edit-header-label"></div>
        </div>
        <div class="middle-graphics interface-element-middle-1-background"></div>
        <div class="bottom-panel-graphics">
            <div class="interface-element-bottom-bar-background-stretch"></div>
        </div>
        <div class="all-pages">
            <div class="matchmaking-menu main-wnd">
                <div class="show-reward-season-item"></div>
                <div class="matchmaking-menu-bottom-panel">
                    <div class="turn-on-off-tutorial"></div>
                    <div class="warning-points" data-trans="data-tip#warning_point_desc">
                        <div class="info-icon"></div>
                        <div class="text"></div>
                    </div>
                </div>
            </div>

            <div class="choose-eq main-wnd no-exit">
                <div class="builds-wrapper scroll-wrapper classic-bar">
                    <div class="scroll-pane"></div>
                </div>
                <div class="choose-eq-bottom-panel">
                    <div class="time-ball">
                        <div class="time">10 s</div>
                    </div>
                    <div class="blink-wait-label" data-trans="#wait-for-label#matchmaking"></div>
                    <div class="you-info">
                        <div class="avatar-wrapper">
                            <div class="avatar-icon"></div>
                        </div>
                        <div class="attributes">
                            <div class="name"></div>
                            <div class="level-rating-wrapper">
                                <div class="level-rating"></div>
                            </div>
                        </div>
                    </div>

                    <div class="vs-wrapper">
                        <div class="vs-graphic">VS</div>
                    </div>
                    <div class="opponent-info">
                        <div class="avatar-wrapper">
                            <div class="avatar-icon hidden-prof"></div>
                        </div>
                        <div class="attributes">
                            <div class="name"></div>
                            <div class="level-rating-wrapper">
                                <div class="level-rating"></div>
                            </div>
                        </div>
                    </div>
                    <div class="fight-button"></div>
                </div>
            </div>

            <div class="stats-and-history main-wnd">
                <div class="stats-and-history-tabs">
                    <div class="header-background-graphic"></div>
                    <div class="cards-header"></div>
                </div>
                <div class="progress-wnd section">
                    <div class="left-side">
                        <div class="char-info"></div>
                        <div class="outfit-wrapper">
                            <!--<div class="outfit-img"></div>-->
                        </div>
                        <!--<div class="tokens-amount"></div>-->
                        <div class="btns-wrapper">
                            <div class="details-btn"></div>
                            <div class="go-to-shop-btn"></div>
                        </div>
                    </div>
                    <div class="right-side"></div>
                    <div class="progress-bottom-panel">
                        <div class="chempions-amount"></div>
                        <div class="back-to-main"></div>
                        <div class="get-all"></div>
                    </div>
                </div>
                <div class="stats-wnd section">
                    <table class="stats-table"></table>
                    <div class="stats-bottom-panel">
                        <div class="back-to-main"></div>
                        <div class="stats-info" data-trans="#statisticsinfo_tip#matchmaking"></div>
                    </div>
                </div>

                <div class="history-wnd section">
                    <table class="history-table"></table>
                    <div class="history-bottom-panel">
                        <div class="back-to-main"></div>
                        <div class="page-info"></div>
                        <div class="prev-page"></div>
                        <div class="input-wrapper">
                            <input class="page-number default">
                        </div>
                        <div class="next-page"></div>
                    </div>
                </div>

                <div class="season-wnd section">

                    <!--<div class="middle-wood"></div>-->
                    <div class="interface-element-vertical-wood"></div>

                    <!--<div class="reward-header season-header" data-trans="#rewards_of_season#matchmaking"></div>-->
                    <div class="reward-header interface-element-header-2-background season-header" data-trans="#rewards_of_season#matchmaking"></div>
                    <div class="reward-wrapper scroll-wrapper classic-bar">
                        <!--<div class="reward-graphic"></div>-->
                        <div class="scroll-pane"></div>
                    </div>

                    <div class="winners-header interface-element-header-2-background season-header" data-trans="#last_season_winners#matchmaking"></div>
                    <div class="winners-wrapper">
                        <!--<div class="winners-not-exist" data-trans="#winners_not_exist#matchmaking"></div>-->
                        <div class="header-info"></div>
                        <div class="txt-info"></div>
                        <div class="outfits-wrapper">
                            <div class="players-in-ranking-info"></div>
                            <div class="amount-players-got-outfit-info"></div>
                            <div class="wrapper-outfit-info"></div>
                        </div>
                    </div>

                    <div class="season-bottom-panel">
                        <!--<div class="season-tip-info info-icon" data-trans="data-tip#rankingpoints#matchmaking"></div>-->
                        <!--<div class="played-battle"></div>-->
                        <div class="back-to-main"></div>
                        <div class="your-records">
                            <div class="your-season-record"></div>
                            <div class="your-career-record">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="statistics-detailed-wnd section">
                    <table class="statistics-detailed-table"></table>
                    <div class="statistics-detailed-bottom-panel">
                        <div class="back-to-main"></div>
                    </div>
                </div>
            </div>

            <div class="matchmaking-ranking main-wnd">
                <div class="ranking-tabs"></div>
                <div class="general-ranking-wnd section">
                    <table class="ranking-table"></table>
                    <div class="ladder_global-bottom-panel ranking-bottom-panel">
                        <div class="refresh"></div>
                        <div class="back-to-main"></div>
                        <div class="page-info"></div>
                        <div class="prev-page"></div>
                        <div class="input-wrapper">
                            <input class="page-number default">
                        </div>
                        <div class="next-page"></div>
                    </div>
                </div>
                <div class="clan-ranking-wnd section">
                    <table class="ranking-table"></table>
                    <div class="text-info" data-trans="#clan_not_exist"></div>
                    <div class="ladder_clan-bottom-panel ranking-bottom-panel">
                        <div class="refresh"></div>
                        <div class="back-to-main"></div>
                        <div class="page-info"></div>
                        <div class="prev-page"></div>
                        <div class="input-wrapper">
                            <input class="page-number default">
                        </div>
                        <div class="next-page"></div>
                    </div>
                </div>
                <div class="friends-ranking-wnd section">
                    <table class="ranking-table"></table>
                    <div class="text-info" data-trans="#friend_not_exist"></div>
                    <div class="ladder_friends-bottom-panel ranking-bottom-panel">
                        <div class="refresh"></div>
                        <div class="back-to-main"></div>
                        <div class="page-info"></div>
                        <div class="prev-page"></div>
                        <div class="input-wrapper">
                            <input class="page-number default">
                        </div>
                        <div class="next-page"></div>
                    </div>
                </div>
            </div>

            <div class="wait-for-opponent no-exit main-wnd">
                <div class="section">
                    <!--<div class="wait-for-graphic"></div>-->
                    <div class="wait-for-label" data-trans="#wait-for-label#matchmaking"></div>
                </div>
            </div>

            <div class="season-reward-main  main-wnd">
                <div class="your-place"></div>
                <div class="txt-info-1 txt-info" data-trans="#txt-info-1#matchmaking"></div>
                <div class="txt-info-2 txt-info" data-trans="#txt-info-2#matchmaking"></div>
                <div class="your-reward-wrapper">
                    <div class="your-reward"></div>
                    <div class="your-outfits"></div>
                </div>
                <div class="season-reward-bottom-panel">
                    <div class="take-reward"></div>
                    <div class="take-reward-now"></div>
                </div>
            </div>

        </div>
        <!--<div class="time-ball">-->
        <!--<div class="time"></div>-->
        <!--</div>-->
    </div>`;

TEMPLATES['fight-result'] = `<div class="fight-result"></div>`;

TEMPLATES['season-outfit'] = `<div class="season-outfit">
        <div class="place"></div>
    </div>`;

TEMPLATES['rage-wrapper'] = `<div class="rage-wrapper"></div>`;

TEMPLATES['place-matchmaking'] = `<div class="place-matchmaking place"></div>`;

TEMPLATES['item-wrapper-matchmaking'] = `<div class="item-wrapper-matchmaking item-wrapper"></div>`;

TEMPLATES['item-chest-slot-matchmaking'] = `<div class="item-chest-slot-matchmaking item-chest-slot">
        <div class="item-chest-border"></div>
    </div>`;

TEMPLATES['measure-matchmaking'] = `<div class="measure-matchmaking measure"></div>`;

TEMPLATES['matchmaking-tutorial-overlay'] = `<div class="matchmaking-tutorial-overlay"></div>`;

TEMPLATES['first-cell-matchmaking'] = `<div class="first-cell-matchmaking first-cell">
        <div class="img-wrapper"></div>
        <div class="info"></div>
    </div>`;

//TEMPLATES['skill-set-matchmaking'] = `<div class="skill-set-matchmaking skill-set"></div>`;

TEMPLATES['outfit-check-wrapper'] = `<div class="outfit-check-wrapper">
        <!--<div data-template-inside="one-checkbox"></div>-->
        ${TEMPLATES['one-checkbox']}
        <div class="outfit-wrapper">
            <div class="text-label"></div>
        </div>
    </div>`;

TEMPLATES['star-matchmaking'] = `<div class="star-matchmaking star"></div>`;

TEMPLATES['completed-matches'] = `<div class="completed-matches">
        <div class="info-icon"></div>
        <div class="text"></div>
    </div>`;

TEMPLATES['matchmaking-progress-stage'] = `<div class="matchmaking-progress-stage">
        <div class="points-side">
            <div class="stage"></div>
            <div class="ratio"></div>
        </div>
        <div class="bar-and-item-side">
            <div class="progress-bar">
                <div class="background-bar"></div>
            </div>
            <div class="items-wrapper"></div>
        </div>
    </div>`;

TEMPLATES['matchmaking-tile'] = `<div class="matchmaking-tile">
        <div class="matchmaking-tile-header-wrapper">
            <div class="matchmaking-tile-header"></div>
        </div>
        <!--<div class="matchmaking-tile-background"></div>-->
        <div class="matchmaking-tile-content"></div>
        <div class="matchmaking-tile-img"></div>
        <div class="matchmaking-tile-bottom-label"></div>
    </div>`;

TEMPLATES['cloud-tip'] = `<div class="cloud-tip">
        <div class="close">
            <div class="cross">x</div>
        </div>
        <div class="header"></div>
        <div class="content"></div>
        <div class="cloud-tail"></div>
        <div class="next" data-trans="#next#tutorials"></div>

    </div>`;

//TEMPLATES['eq-items-set'] = `<div class="eq-items-set">
//    <div class="eq-slot st-10"></div>
//    <div class="eq-slot st-1"></div>
//    <div class="eq-slot st-2"></div>
//    <div class="eq-slot st-3"></div>
//    <div class="eq-slot st-4"></div>
//    <div class="eq-slot st-5"></div>
//    <div class="eq-slot st-6"></div>
//    <div class="eq-slot st-7"></div>
//    <div class="eq-slot st-8"></div>
//    <div class="eq-slot st-9"></div>
//</div>`;

TEMPLATES['premium-item-wrapper'] = `<div class="premium-item-wrapper"></div>`;

TEMPLATES['premium-item'] = `<div class="premium-item">
        <div class="premium-text"></div>
    </div>`;

TEMPLATES['crafting-description-header'] = `<div class="crafting-description-header">
        <div class="item-name-wrapper">
            <div class="result-item interface-element-one-item-slot"></div>
            <div class="offer-name"></div>
        </div>
    </div>`;

TEMPLATES['crafting-description-reagents'] = `<div class="crafting-description-reagents">
        <div class="reagents-list"></div>
    </div>`;

TEMPLATES['crafting-cost-panel'] = `<div class="crafting-cost-panel">
        <div class="cost-header-label" data-trans="#cost#recover"></div>
        <div class="crafting-cost-wrapper"></div>
    </div>`;

TEMPLATES['crafting-description-button'] = `<div class="crafting-description-button">
        <div class="use-recipe-btn"></div>
    </div>`;

TEMPLATES['one-item-on-divide-list'] = `<div class="one-item-on-divide-list">
        <!--<div class="item-wrapper">-->
        <!--<div class="result-item item-slot"></div>-->
        <!--</div>-->
        <div class="name-wrapper">
            <div class="name"></div>
        </div>
    </div>`;

TEMPLATES['crafting-reagent'] = `<div class="crafting-reagent">
        <div class="reagent-wrapper">
            <div class="item-reagent-wrapper">
                <div class="item-reagent interface-element-one-item-slot"></div>
            </div>
            <div class="reagent-info">
                <div class="item-name"></div>
                <div class="amount-items">
                    <span class="have"></span>/<span class="need"></span>
                </div>
            </div>
            <div class="owned-items"></div>
        </div>
    </div>`;

TEMPLATES['crafting'] = `<div class="crafting">
        <div class="crafting__tabs"></div>
        <div class="crafting__contents"></div>
    </div>`;

TEMPLATES['salvage'] = `<div class="salvage">
        <div class="salvage__content">
            <div class="info-box mt-3" data-trans="#info#salvager"></div>
            <div class="salvage__reagents items-grid">
                <div class="interface-element-item-slot-grid-stretch"></div>
                <div class="salvage__label" data-trans="#selected#salvager"></div>
            </div>
            <div class="salvage__arrows"></div>
            <div class="salvage__receives">
                <div class="interface-element-item-slot-grid-stretch"></div>
                <div class="salvage__label" data-trans="#result#salvager"></div>
            </div>
            <div class="salvage__submit"></div>
        </div>
    </div>`;

TEMPLATES['extraction'] = `<div class="extraction">
        <div class="extraction__content">
            <div class="info-box mt-3" data-trans="#info#extraction"></div>
            <div class="extraction__item interface-element-one-item-slot-decor mt-5"></div>
            <div class="extraction__arrows"></div>
            <div class="extraction__receives">
                <div class="interface-element-item-slot-grid-stretch"></div>
                <div class="extraction__label" data-trans="#result#extraction"></div>
            </div>
            <div class="extraction__finalize mt-5">
                <div class="extraction__payment"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['payment-selector'] = `
        <div class="payment-selector">
            <div class="info-box"></div>
            <div class="payment-selector__methods"></div>
            <div class="payment-selector__submit"></div>
        </div>
    `;

TEMPLATES['payment-selector-option'] = `
        <div class="payment-selector__option">
            <div class="payment-selector__icon"></div>
            <div class="payment-selector__amount"></div>
        </div>
    `;


TEMPLATES['socket_enchantment'] = `<div class="socket_enchantment">
        <div class="socket_enchantment__content">
            <div class="info-box mt-3">
                <div data-trans="#info#socket_enchantment"></div>
                <div class="info-icon" data-trans="data-tip#info_tip#socket_enchantment"></div>
            </div>
            <div class="d-flex justify-content-evenly mt-5">
                <div class="socket_enchantment__source-item-slot interface-element-one-item-slot-decor"></div>
                <div class="socket_enchantment__enhancer-item-slot interface-element-one-item-slot-decor"></div>
            </div>
            <div class="extraction__arrows"></div>
            <div class="d-flex justify-content-evenly">
                <div class="socket_enchantment__result-item interface-element-one-item-slot-decor"></div>
            </div>
            <div class="socket_enchantment__submit d-flex justify-content-evenly mt-5"></div>
        </div>
    </div>`;

TEMPLATES['socket_extraction'] = `<div class="socket_extraction">
        <div class="socket_extraction__content">
            <div class="info-box mt-3">
                <div data-trans="#info#socket_extraction"></div>
                <div class="info-icon" data-trans="data-tip#info_tip#socket_extraction"></div>
            </div>
            <div class="d-flex justify-content-evenly mt-5">
                <div class="socket_extraction__source-item-slot interface-element-one-item-slot-decor"></div>
            </div>
            <div class="extraction__arrows"></div>
            <div class="d-flex justify-content-evenly">
              <div class="socket_extraction__result-items ie-grid ie-grid--1x2">
                  <div class="interface-element-item-slot-grid-stretch"></div>
                  <div class="ie-grid__label" data-trans="#result#extraction"></div>
              </div>
            </div>
            <div class="socket_extraction__payment mt-5"></div>
        </div>
    </div>`;

TEMPLATES['socket_composition'] = `<div class="socket_composition">
        <div class="socket_composition__content">
            <div class="info-box mt-3">
                <div data-trans="#info#socket_composition"></div>
                <div class="info-icon socket-recipes-handler" data-trans="data-tip#info_tip#socket_composition"></div>
            </div>
            <div class="d-flex justify-content-evenly mt-5">
                <div class="socket_composition__source-items ie-grid ie-grid--1x3">
                  <div class="interface-element-item-slot-grid-stretch"></div>
                  <div class="ie-grid__label" data-trans="#selected#enhancement"></div>
              </div>
            </div>
            <div class="extraction__arrows"></div>
            <div class="d-flex justify-content-evenly">
              <div class="socket_composition__result-item-slot interface-element-one-item-slot-decor"></div>
            </div>
            <div class="socket_composition__payment mt-5"></div>
        </div>
    </div>`;



TEMPLATES['cost-component'] = `
        <div class="cost-component">
            <div class="icon"></div>
            <div class="amount"></div>
        </div>
    `;

TEMPLATES['enhance'] = `
    <div class="enhance">
        <div class="enhance__content">
            <div class="info-box enhance__info enhance__info--top mt-3">
                <div class="enhance__info--1" data-trans="#info#enhancement"></div>
                <div class="enhance__info--3" data-trans="#info3#enhancement"></div>
            </div>
            <div class="enhance__top">
                <div class="enhance__item enhance__item--current interface-element-one-item-slot-decor">
                    <div class="slot"></div>
                    <div class="lvl">
                        <div class="cl-icon icon-star-0"></div>
                    </div>
                </div>
                <div class="enhance__progressbar">
                    <div class="enhance__progress-bg"></div>
                    <div class="enhance__progress enhance__progress--current"></div>
                    <div class="enhance__progress enhance__progress--preview"></div>
                    <div class="enhance__progress-text enhance__progress-text--current"></div>
                    <div class="enhance__progress-text enhance__progress-text--preview"></div>
                </div>
                <div class="enhance__item enhance__item--receive interface-element-one-item-slot-decor">
                    <div class="slot"></div>
                    <div class="lvl">
                        <div class="cl-icon icon-star-0"></div>
                    </div>
                </div>
            </div> 
            
            <div class="enhance__enchant">
                <div class="info-box mt-4">
                    <div data-trans="#info5#enhancement"></div>
                    <div class="info-icon" data-trans="data-tip#info_tip#enhancement"></div>
                </div>
                <div class="enhance__wrapper">
                    <div class="enhance__autofiller"></div>
                    <div class="enhance__reagents items-grid disabled">
                        <div class="interface-element-item-slot-grid-stretch"></div>
                        <div class="enhance__label" data-trans="#selected#enhancement"></div>
                    </div>
                </div>
                <div class="enhance__limit">
                    <span data-trans="#limit#enhancement"></span>:
                    <span class="enhance__counter"></span>
                </div> 
                <div class="enhance__submit"></div> 
            </div>
            
            <div class="enhance__enhance">
                <div class="enhance__bonus"></div>
                <div class="enhance__requires">
                    <div class="enhance__r-gold">
                        <div class="enhance__r-gold-icon"></div>
                        <div class="enhance__r-gold-amount"></div>
                    </div>
                    <div class="enhance__r-item interface-element-one-item-slot"></div>
                </div>
                <div class="enhance__submit2"></div> 
            </div>
        </div>
    </div>`;

TEMPLATES['autofiller'] = `
      <div class="autofiller"></div>
    `;

TEMPLATES['autofiller-config'] = `<div class="autofiller-config">
        <div class="autofiller-config__heading tw-heading mb-4"></div>
        <div class="autofiller-config__groups"></div>
        <div class="autofiller-config__buttons btns-spacing"></div>
    </div>`;

TEMPLATES['autofiller-config-group'] = `<div class="autofiller-config__group">
        <div class="autofiller-config__title"></div>
        <div class="autofiller-config__checkboxes"></div>
    </div>`;

TEMPLATES['world-window'] = `
    <div class="world-window">
        <div class="world-window__tabs"></div>
        <div class="world-window__contents"></div>
    </div>`;

TEMPLATES['tabs-nav'] = `
    <div class="tabs__nav"></div>`;

TEMPLATES['tabs-content'] = `
    <div class="tabs__contents"></div>`;

TEMPLATES['players-online'] = `
    <div class="players-online">
        <div class="players-online__content">
            <div class="world-window__bg interface-element-middle-1-background"></div>
            <div class="players-online__header">
                <div class="search-wrapper">
                    <input class="search clan-name-input" data-trans="placeholder#search"/>
                    <div class="search-x" data-trans="data-tip#delete"></div>
                </div>
                <div class="players-online__info world-window__info">
                    <!--<span data-trans="#players-online2#world_window"></span>:&nbsp;-->
                    <!--<span class="players-online__amount"></span>&nbsp;-->
                    <span data-trans="data-from"></span>&nbsp;<span class="players-online__date"></span>
                    <div class="info-icon" data-trans="data-tip#info_tip#world_window"></div>
                </div>
            </div>
            <div class="scroll-wrapper classic-bar">
                <div class="scroll-pane">
                    <div class="players-online__items-container"></div>
                </div>
            </div>
            <div class="bottom-bar">
                <div class="interface-element-bottom-bar-background-stretch"></div>
                <div class="filter-label" data-trans="#filter-level"></div>
                <div class="start-lvl-wrapper"></div>
                <div class="stop-lvl-wrapper"></div>
                <div class="choose-prof menu"></div>
                <div class="legend">
                  <span data-trans="#player-ranks#world_window"></span>
                  <span class="info-icon"></span>
                </div>
            </div>
        </div>
    </div>`;

TEMPLATES['players-online-item'] = `
    <div class="players-online__item">
        <div class="players-online__nick"></div>
        <div>
          (<span class="players-online__lvl"></span><span class="players-online__prof"></span>)
        </div>
    </div>`;

TEMPLATES['server-parameters'] = `
    <div class="server-parameters">
        <div class="server-parameters__content">
            <div class="world-window__bg interface-element-middle-1-background"></div>
            <div class="scroll-wrapper classic-bar">
                <div class="scroll-pane">
                    <div class="server-parameters__items-container"></div>
                </div>
            </div>
            <div class="bottom-bar">
                <div class="interface-element-bottom-bar-background-stretch"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['server-parameters-item'] = `
    <div class="server-parameters__item">
      <div class="server-parameters__item-name"></div>
      <div class="server-parameters__item-value"></div>
    </div>`;

TEMPLATES['location-parameters'] = `
    <div class="location-parameters">
        <div class="location-parameters__content">
            <div class="world-window__bg  interface-element-middle-1-background"></div>
            <div class="scroll-wrapper classic-bar">
                <div class="scroll-pane">
                    <div class="location-parameters__items-container"></div>
                </div>
            </div>
            <div class="bottom-bar">
                <div class="interface-element-bottom-bar-background-stretch"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['location-parameters-item'] = `
    <div class="location-parameters__item">
      <div class="location-parameters__item-name"></div>
      <div class="location-parameters__item-value"></div>
    </div>`;

TEMPLATES['hunting-statistics-table-header'] = `
    <table class="hunting-statistics-table-header">
        <thead>
            <tr class="hunting-statistics__head"></tr>
        </thead>
    </table>`;

TEMPLATES['hunting-statistics'] = `
    <div class="hunting-statistics">
        <div class="hunting-statistics__content">
            <div class="world-window__bg interface-element-middle-1-background"></div>
            <div class="hunting-statistics__header">
                <div class="search-wrapper">
                    <input class="search clan-name-input" data-trans="placeholder#search"/>
                    <div class="search-x" data-trans="data-tip#delete"></div>
                </div>
            </div>
            <div class="hunting-statistics-table-header-wrapper">
                ${TEMPLATES['hunting-statistics-table-header']}
            </div>
            <div class="scroll-wrapper classic-bar">
                <div class="scroll-pane">
                    <table class="hunting-statistics-table"></table>
                </div>
            </div>
            <div class="bottom-bar">
                <div class="interface-element-bottom-bar-background-stretch"></div>
                <div class="filter-label" data-trans="#filter-level"></div>
                <div class="start-lvl-wrapper"></div>
                <div class="stop-lvl-wrapper"></div>
                <div class="choose-prof menu"></div>
                <div class="choose-type menu"></div>
                <div class="load"></div>
                <div class="legend">
                  <span class="info-icon" data-trans="data-tip#tip-info#hunting_statistics"></span>
                </div>
            </div>
        </div>
    </div>`;


TEMPLATES['hunting-statistics-item'] = `
    <tr class="hunting-statistics-item">
      <td class="hunting-statistics-item__name"></td>
      <td class="hunting-statistics-item__level"></td>
      <td class="hunting-statistics-item__kills"></td>
      <td class="hunting-statistics-item__unique color-unique"></td>
      <td class="hunting-statistics-item__heroic color-heroic"></td>
      <td class="hunting-statistics-item__legendary color-legendary"></td>
    </tr>`;

TEMPLATES['activities'] = `
    <div class="activities">
        <div class="activities__content">
            <div class="world-window__bg  interface-element-middle-1-background"></div>
            <div class="activities__content-inner">
                <div class="activities__players"></div>
                <div class="activities__table"></div>
            </div>
<!--            <div class="scroll-wrapper classic-bar">-->
<!--                <div class="scroll-pane">-->
<!--                    <div class="activities__items-container"></div>-->
<!--                </div>-->
<!--            </div>-->
            <div class="bottom-bar">
                <div class="interface-element-bottom-bar-background-stretch"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['radio-info'] = `
    <div class="radio-info">
        <div class="radio-before-label"></div>
        <div class="radio-label"></div>
        <div class="radio-after-label"></div>
    </div>`;
//TEMPLATES['radio-label'] = `<div class="radio-label"></div>`;

TEMPLATES['radio-list'] = `<div class="radio-list"></div>`;

TEMPLATES['radio-custom'] = `
        <div class="radio-custom">
            <input type="radio" id="xxx" name="xxx">
            <label for="xxx"></label>
        </div>
    `;

TEMPLATES['checkbox-list'] = `<div class="radio-list"></div>`;

TEMPLATES['checkbox-custom'] = `
        <div class="checkbox-custom">
            <input type="checkbox" id="xxx" name="xxx">
            <label for="xxx"></label>
        </div>
    `;

TEMPLATES['checkbox-list'] = `<div class="radio-list"></div>`;

TEMPLATES['checkbox-custom'] = `
        <div class="checkbox-custom">
            <input type="checkbox" id="xxx" name="xxx">
            <label for="xxx"></label>
        </div>
    `;

TEMPLATES['c-color-picker'] = `
        <div class="c-color-picker">
            <input type="color" id="xxx" name="xxx">
            <label class="c-color-picker__label" for="xxx"></label>
        </div>
    `;

TEMPLATES['left-grouped-list-and-right-description-window'] = `<div class="left-grouped-list-and-right-description-window">
        <!--<div class="main-header">-->
             <!--<div class="card-background-wrapper">-->
                <!--<div class="border-window-active-card-background-stretch"></div>-->
             <!--</div>-->
            <!--<div class="left-column-list-label"></div>-->
        <!--</div>-->
        <div class="left-column">
            <!--<div class="middle-left-column-graphics"></div>-->
            <div class="interface-element-middle-3-background-stretch"></div>
            <div class="main-header">
             <!--<div class="card-background-wrapper">-->
            <div class="interface-element-active-card-background-stretch"></div>
             <!--</div>-->
            <div class="left-column-list-label"></div>
            </div>
            <div class="search-wrapper search-in-left-column">
                <input class="search" data-trans="placeholder#search"/>
                <div class="search-x" data-trans="data-tip#delete"></div>
            </div>
            <!--<div class="bottom-left-column-graphics"></div>-->
            <div class="left-scroll scroll-wrapper classic-bar">
                <div class="scroll-pane">
                    <div class="items-list"></div>
                </div>
            </div>
        </div>
        <div class="right-column">
            <!--<div class="middle-right-column-graphics"></div>-->
            <div class="interface-element-middle-2-background-stretch"></div>
            <div class="right-header-graphic">
                <div class="interface-element-active-card-background-stretch"></div>
            </div>
            <div class="right-column-header"></div>
            <!--<div class="paper-graphics"></div>-->
            <div class="right-scroll scroll-wrapper classic-bar">
                <div class="scroll-pane">
                    <div class="additional-container"></div>
                    <div class="reagents-label"></div>
                    <div class="reagents-list">
                        <div class="board"></div>
                        <div class="all-items-wrapper"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-row-panel">
            <!--<div class="bottom-panel-graphics"></div>-->
            <div class="interface-element-bottom-bar-background-stretch"></div>
            <div class="filter-label" data-trans="#filter-level"></div>
            <div class="start-lvl-wrapper"></div>
            <div class="stop-lvl-wrapper"></div>
            <div class="choose-prof-wrapper">
                <div class="choose-prof menu"></div>
            </div>
            <div class="choose-item-type-wrapper">
                <div class="choose-item-type menu"></div>
            </div>
            <div class="safe-mode"></div>
            <div class="do-recipe"></div>
        </div>
    </div>`;

TEMPLATES['divide-list-group'] = `<div class="divide-list-group">
        <div class="group-header">
            <div class="card-graphic interface-element-active-card-border-image"></div>
            <div class="label"></div>
            <div class="direction"></div>
            <div class="amount"></div>
        </div>
        <div class="group-list"></div>
    </div>`;

//<!-- default window with list !-->
TEMPLATES['window-list'] = `<div class="window-list">
        <div class="open-edit-panel"></div>
        <div class="header"></div>
        <div class="scroll-wrapper">
            <div class="scroll-pane">
                <div class="empty">----</div>
                <div class="list"></div>
            </div>
        </div>
    </div>`

//<!-- default edit window with list !-->
TEMPLATES['window-list-edit'] = `<div class="window-list-edit">
        <div class="all-options"></div>
        <div class="buttons mt-3"></div>
    </div>`;

TEMPLATES['loot-preview'] = `<div class="loot-preview">
        <div class="open-item-header"></div>
        <div class="item-container d-none"></div>
        <div class="items-txt"></div>
        <div class="scroll-wrapper">
            <div class="scroll-pane"></div>
        </div>
    </div>`;

TEMPLATES['loot-preview-one-item'] = `<div class="loot-preview-one-item tw-list-item">
        <div class="item-wrapper"></div>
        <div class="name-wrapper"></div>
        <div class="amount-wrapper"></div>
    </div>`;

TEMPLATES['socket-recipe-preview-one-item'] = `<div class="socket-recipe-preview-one-item tw-list-item justify-content-between">
        <div class="left-items"></div>
        <div class="equals">=</div>
        <div class="right-items"></div>
    </div>`;

TEMPLATES['recipe-preview-content'] = `<div class="recipe-preview-content">
        <div class="content-txt"></div>
        <div class="content-list"></div>
        <div class="reagents-txt"></div>
        <div class="reagents-list"></div>
    </div>`;

TEMPLATES['ans-game'] = `<div class="ans-game">
        <div class="info" data-trans="#ans_game_new#battle"></div>
        <div class="runs"></div>
    </div>`;

TEMPLATES['unit'] = `<div class="unit"></div>`;

TEMPLATES['ans-black-layer'] = `<div class="ans-black-layer"></div>`;

TEMPLATES['show-eq'] = `<div class="show-eq">
        <div class="info-icon"></div>
        <div class="show-eq-bck">
            <div class="player-info"></div>
            <div class="table-wrapper">
                <div class="left-side">
                    <div class="prof-image"></div>
                </div>
                <div class="right-side">
                    <div class="other-items-wrapper">
                        <!--<div class="other-items">-->
                            <!--<div class="other-eq-slot st-10"></div>-->
                            <!--<div class="other-eq-slot st-1"></div>-->
                            <!--<div class="other-eq-slot st-2"></div>-->
                            <!--<div class="other-eq-slot st-3"></div>-->
                            <!--<div class="other-eq-slot st-4"></div>-->
                            <!--<div class="other-eq-slot st-5"></div>-->
                            <!--<div class="other-eq-slot st-6"></div>-->
                            <!--<div class="other-eq-slot st-7"></div>-->
                            <!--<div class="other-eq-slot st-8"></div>-->
                            <!--<div class="other-eq-slot st-9"></div>-->
                        <!--</div>-->
                    </div>
                </div>
            </div>
        </div>
    </div>`;

TEMPLATES['conquer-stats'] = `<div class="conquer-stats">
        <!--<div class="header-wrapper">-->
        <!--<div class="graphic"></div>-->
        <!--<div class="edit-header-label"></div>-->
        <!--</div>-->
        <div class="middle-graphics interface-element-middle-1-background"></div>
        <div class="search-wrapper conquer-stats-search">
            <input class="search" data-trans="placeholder#search" />
            <div class="search-x" data-trans="data-tip#delete"></div>
        </div>
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="conquer-stats-items"></div>
            </div>
        </div>
    </div>`;

TEMPLATES['conquer-stat-one'] = `<div class="conquer-stat-one">
        <div class="map-name"></div>
        <div class="flex">
            <div class="rep-percent"></div>
            <div class="pb-fifty">
                <div class="pb-fifty__one pb-fifty__one--left">
                    <div class="progress"></div>
                </div>
                <div class="pb-fifty__one pb-fifty__one--right">
                    <div class="progress"></div>
                </div>
            </div>
        </div>
    </div>`;

TEMPLATES['item-details'] = `
    <div class="item-details">
        <div class="item-details__slot interface-element-one-item-slot"></div>
        <div class="item-details__rows"></div>
    </div>`;

TEMPLATES['item-details-row'] = `
    <div class="item-details__row row">
        <div class="col col--f-width">
            <div class="item-details__content"></div>
        </div>
        <div class="col">
            <div class="item-details__copy-btn"></div>
        </div>
    </div>`;

TEMPLATES['item-details-special-row'] = `
    <div class="row align-items-center justify-content-between">
        <div class="col">
            <div class="item-details__txt"></div>
        </div>
        <div class="col d-flex align-items-center">
            <div class="item-details__val"></div>
            <div class="item-details__ico"></div>
        </div>
    </div>`;

TEMPLATES['chat-input-wrapper'] = `
    <div class="chat-input-wrapper">
        <div class="control-wrapper">
            <div class="menu-card">
                <div class="card-name"></div>
                <div class="card-remove close-button"></div>
                <div class="card-list"></div>
            </div>
            <div class="private-nick"></div>
            <div class="style-message"></div>
            <div class="chat-notification-wrapper"></div>
            <div class="chat-info-wrapper">
                <div class="info-icon" data-trans="data-tip#info_tip#chat_lang"></div>
            </div>
            <div class="chat-config-wrapper"></div>
        </div>
        <div class="magic-input-wrapper">
            <div class="type-mobile-message" data-trans="#chat_placeholder#chat_lang"></div>
        </div>
    </div>`;

TEMPLATES['chat-notification-wrapper'] = `
    <div class="chat-notification-wrapper">

    </div>`;

TEMPLATES['chat-message-wrapper'] = `
    <div class="scroll-wrapper chat-message-wrapper">
        <div class="scroll-pane"></div>
    </div>`;

TEMPLATES['chat-channel-card'] = `
    <div class="chat-channel-card card">
        <div class="chat-channel-card-icon"></div>
        <div class="chat-channel-not-read-counter"></div>
    </div>`;

TEMPLATES['chat-channel-card-wrapper'] = `
    <div class="chat-channel-card-wrapper tabs-nav">

    </div>`;

//</div>
TEMPLATES['new-chat-window'] = `
    <div class="new-chat-window">
        <div class="chat-channel-card-wrapper"></div>
        <div class="chat-message-wrapper"></div>
        <div class="chat-input-wrapper"></div>
    </div>
`;

TEMPLATES['chat-configure-window'] = `
    <div class="chat-configure-window">
        <div class="scroll-wrapper classic-bar">
            <div class="scroll-pane">
                <div class="middle-graphic interface-element-middle-1-background"></div>
                <div class="info-box mt-2" data-trans="#notifications#chat_lang"></div>
                <div class="notification-text" data-trans="#notifications_on_global_chat#chat_lang"></div>
                <div class="notification-configuration"></div>
                <div class="info-box" data-trans="#formatting#chat_lang"></div>
                <div class="color-configuration"></div>
                <div class="default-colors-wrapper"></div>
                <div class="time-configuration"></div>
                <div class="tag-configuration"></div>
                <div class="emo-configuration"></div>
                <div class="enemy-msg-configuration" data-serveroption="28"></div>
                <div class="get-legendary-item-clan-notification" data-serveroption="29"></div>
            </div>
        </div>
    </div>
`;


TEMPLATES['new-chat-message'] = `
    <div class="new-chat-message">
        <span class="information-part">
            <span class="ts-section"></span>
            <span class="channel-section"></span>
            <span class="guest-section" data-trans="data-tip#deputy">[Z]</span>
            <span class="author-section"></span>
            <span class="receiver-arrow-section">-></span>
            <span class="receiver-section"></span>
        </span>
        <span class="message-part">
            <span class="message-section"></span>
        </span>

    </div>
`;

TEMPLATES['copy-btn'] = `<div class="copy-btn"></div>`;

TEMPLATES['ln-content'] = `<div class="ln-content">
    <div class="ln_presets mt-1">
      <div class="ln-control">
            <div class="ln-label" data-trans="#preset#legendary-notificator"></div>
            <div id="ln-presets"></div>
        </div>
    </div>
    <div class="tw-heading mt-3 mb-3" data-trans="#highlight#legendary-notificator"></div>
    <div>
        <div class="ln-control">
            <div class="ln-label" data-trans="#opacity#legendary-notificator"></div>
            <div id="ln-opacity"></div>
        </div>
        <div class="ln-control mt-2 mb-2">
            <div class="ln-label" data-trans="#size#legendary-notificator"></div>
            <div id="ln-size"></div>
        </div>
        <div class="ln-control">
            <div id="ln-frame_map"></div>
            <div id="ln-frame_map_color"></div>
        </div>
        <div class="ln-control">
            <div id="ln-frame_loot"></div>
            <div id="ln-frame_loot_color"></div>
        </div>
        <div class="ln-control">
            <div id="ln-frame_item"></div>
            <div id="ln-frame_item_color"></div>
        </div>
        <div class="ln-control">
            <div id="ln-message"></div>
        </div>
    </div>
    <div class="tw-heading mt-3 mb-4" data-trans="#other-effects#legendary-notificator"></div>
    <div>
        <div class="ln-control">
            <div class="ln-label" data-trans="#sound#legendary-notificator"></div>
            <div id="ln-sound"></div>
        </div>
        <div class="ln-control">
            <div class="ln-label" data-trans="#effect#legendary-notificator"></div>
            <div id="ln-animation"></div>
        </div>
    </div>
    <div class="ln-buttons-container" id="ln-buttons-container"></div>
</div>`;

TEMPLATES['lf-content'] = `<div class="lf-content">
    <div class="tw-tabs">
<!--        <div class="do-action-cursor is-active" data-trans="#solo#loot-filter" data-tab="alone"></div>-->
<!--        <div class="do-action-cursor" data-trans="#group#loot-filter" data-tab="group"></div>-->
    </div>
    <div class="c-line mb-0"></div>
    <div class="scroll-wrapper classic-bar">
        <div class="scroll-pane">
            <div class="lf-fields-container"></div>
        </div>
    </div>
    <div class="c-line mt-0"></div>
    <div class="lf-buttons-container"></div>
</div>`;

TEMPLATES['cd-content'] = `<div class="cd-content">
    <div class="cd-controls">
        <div class="cd-control">
            <div class="cd-label" data-trans="#collision-opacity#collision_detector"></div>
            <div id="cd-opacity"></div>
        </div>
        <div class="cd-control">
            <div class="cd-label" data-trans="#collision-color#collision_detector"></div>
            <div id="cd-color"></div>
        </div>
    </div>
    <div class="cd-buttons-container" id="cd-buttons-container">
        <div id="cd-state"></div>
    </div>
</div>`;


module.exports = TEMPLATES;