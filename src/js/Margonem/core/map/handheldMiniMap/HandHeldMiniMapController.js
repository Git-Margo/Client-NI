var StorageFuncHandHeldMiniMap = require('@core/map/StorageFuncHandHeldMiniMap');

let HandHeldMiniMapData = require('@core/map/handheldMiniMap/HandHeldMiniMapData');
let MapObject = require('@core/map/handheldMiniMap/MapObject');
let MiniMapObject = require('@core/map/handheldMiniMap/MiniMapObject');
let HandHeldMiniMapWindow = require('@core/map/handheldMiniMap/HandHeldMiniMapWindow');


let ImageObjectController = require('@core/map/handheldMiniMap/ImageObjectController');
let MiniMapTipController = require('@core/map/handheldMiniMap/MiniMapTipController');
let MiniMapHeroController = require('@core/map/handheldMiniMap/MiniMapHeroController');
let MiniMapOtherController = require('@core/map/handheldMiniMap/MiniMapOtherController');
let MiniMapNpcController = require('@core/map/handheldMiniMap/MiniMapNpcController');
let MiniMapItemController = require('@core/map/handheldMiniMap/MiniMapItemController');
let MiniMapRipController = require('@core/map/handheldMiniMap/MiniMapRipController');
let MiniMapGatewayController = require('@core/map/handheldMiniMap/MiniMapGatewayController');
let MiniMapRespController = require('@core/map/handheldMiniMap/MiniMapRespController');

var StorageData = require('@core/StorageData');

module.exports = function() {

    const moduleData = {
        fileName: "HandHeldMiniMapController"
    };

    let map = null;
    let handHeldMiniMapWindow = null;

    let imageObjectController;
    let miniMapTipController;

    let miniMapOtherController;
    let miniMapHeroController;
    let miniMapNpcController;
    let miniMapItemController;
    let miniMapRipController;
    let miniMapGatewayController;
    let miniMapRespController;

    let showDataDrawerObject = null;
    let showObject = null;
    let canDraw = false;

    let namesTab = null;
    let optionDataTab = null;

    let minLevel = null;
    let widthDataDrawer = null;
    let fontSizeDataDrawer = null;
    // let range    = null;

    function init() {
        initNamesTab();
        initHandHeldMiniMapWindow();
        initControllers();
        updateObjects();
        updateMinLevelAndRange();
        initMap();
    }

    function iconNameToIconIndex(name) {
        if (!HandHeldMiniMapData.STATIC_ICONS.hasOwnProperty(name)) {
            console.error(`invalid name of HandHeldMiniMapData.STATIC_ICONS: ${name}`)
            return HandHeldMiniMapData.STATIC_ICONS.SQUARE;
        }

        return HandHeldMiniMapData.STATIC_ICONS[name];
    }

    function initHandHeldMiniMapWindow() {
        handHeldMiniMapWindow = new HandHeldMiniMapWindow();
        handHeldMiniMapWindow.init();
    }

    function iconIndexToName(index) {
        for (let name in HandHeldMiniMapData.STATIC_ICONS) {
            if (HandHeldMiniMapData.STATIC_ICONS[name] == index) return name;
        }
    }

    function clearShowObject() {
        showObject = {
            [HandHeldMiniMapData.TYPE.NPC]: {},
            [HandHeldMiniMapData.TYPE.OTHER]: {},
            [HandHeldMiniMapData.TYPE.RIP]: {},
            [HandHeldMiniMapData.TYPE.GATEWAY]: {},
            [HandHeldMiniMapData.TYPE.ITEM]: {},
            [HandHeldMiniMapData.TYPE.HERO]: {},
            [HandHeldMiniMapData.TYPE.RESP]: {}
        };
    }

    function clearShowDataDrawerObject() {
        showDataDrawerObject = {
            [HandHeldMiniMapData.TYPE.NPC]: {},
            [HandHeldMiniMapData.TYPE.OTHER]: {}
        };
    }

    function initControllers() {
        imageObjectController = new ImageObjectController();
        miniMapTipController = new MiniMapTipController();
        miniMapHeroController = new MiniMapHeroController();
        miniMapOtherController = new MiniMapOtherController();
        miniMapNpcController = new MiniMapNpcController();
        miniMapItemController = new MiniMapItemController();
        miniMapRipController = new MiniMapRipController();
        miniMapGatewayController = new MiniMapGatewayController();
        miniMapRespController = new MiniMapRespController();

        imageObjectController.init();
        miniMapTipController.init();

        miniMapHeroController.init();
        miniMapOtherController.init();
        miniMapNpcController.init();
        miniMapItemController.init();
        miniMapRipController.init();
        miniMapGatewayController.init();
        miniMapRespController.init();
    }

    function getMiniMapNpcController() {
        return miniMapNpcController;
    }

    function getMiniMapHeroController() {
        return miniMapHeroController;
    }

    function getMiniMapOtherController() {
        return miniMapOtherController;
    }

    function getMiniMapItemsController() {
        return miniMapItemController;
    }

    function getMiniMapRipController() {
        return miniMapRipController;
    }

    function getMiniMapGatewayController() {
        return miniMapGatewayController;
    }

    function getMiniMapTipController() {
        return miniMapTipController;
    }

    function getImageObjectController() {
        return imageObjectController;
    }

    function getHandHeldMiniMapWindow() {
        return handHeldMiniMapWindow;
    }

    function getObjectController(belongType) {

        switch (belongType) {
            case HandHeldMiniMapData.TYPE.HERO:
                return miniMapHeroController;
            case HandHeldMiniMapData.TYPE.NPC:
                return miniMapNpcController;
            case HandHeldMiniMapData.TYPE.OTHER:
                return miniMapOtherController;
            case HandHeldMiniMapData.TYPE.ITEM:
                return miniMapItemController;
            case HandHeldMiniMapData.TYPE.RIP:
                return miniMapRipController;
            case HandHeldMiniMapData.TYPE.GATEWAY:
                return miniMapGatewayController;
            case HandHeldMiniMapData.TYPE.RESP:
                return miniMapRespController;
            default:
                console.error('incorrect type', belongType);
        }
    }

    function initMap() {
        map = new MapObject();
    }

    function setOptionDataTab() {

        optionDataTab = {};

        optionDataTab[HandHeldMiniMapData.KIND.MARK_OBJECT] = {
            color: '#c71618',
            icon: HandHeldMiniMapData.STATIC_ICONS.SQUARE,
            type: HandHeldMiniMapData.TYPE.OTHER
        };

        for (var name in namesTab) {

            let color = StorageFuncHandHeldMiniMap.getColorOfKindByName(name);
            let icon = StorageFuncHandHeldMiniMap.getIconOfKindByName(name);
            let state = StorageFuncHandHeldMiniMap.getStateOfKindByName(name);

            if (!color) color = getDefaultColor(name);
            if (icon == null) icon = getDefaultIcon(name);
            if (state == null) state = true;

            optionDataTab[name] = {
                color: color,
                icon: icon,
                state: state
            };

            let oneKindOptions = optionDataTab[name];
            let oneNameTab = namesTab[name];

            if (!isset(oneNameTab.dataDrawerNick) && !isset(oneNameTab.dataDrawerProfAndLevel)) {
                continue;
            }

            if (isset(namesTab[name].dataDrawerNick)) {
                oneKindOptions.nick = getDataDrawerNickOfKindByName(name);
            }

            if (isset(namesTab[name].dataDrawerProfAndLevel)) {
                oneKindOptions.lvlAndProf = getDataDrawerProfAndLevelOfKindByName(name);
            }

        }
    }

    const getDataDrawerNickOfKindByName = function(name) {
        let store = StorageFuncHandHeldMiniMap.getDataDrawerNickOfKindByName(name);
        if (store !== null) {
            return store;
        } else {
            return getDefaultDataDrawerNick(name);
        }
    };

    const getDataDrawerProfAndLevelOfKindByName = function(name) {
        let store = StorageFuncHandHeldMiniMap.getDataDrawerProfAndLevelOfKindByName(name);
        if (store !== null) {
            return store;
        } else {
            return getDefaultDataDrawerProfAndLevel(name);
        }
    };

    const getWhoIsHereOfKindByName = function(name) {
        let store = StorageFuncHandHeldMiniMap.getWhoIsHereOfKindByName(name);
        if (store !== null) {
            return store;
        } else {
            return getDefaultWhoIsHere(name);
        }
    };

    const getMapBlurOfKindByName = function(name) {
        let store = StorageFuncHandHeldMiniMap.getMapBlurOfKindByName(name);
        if (store !== null) {
            return store;
        } else {
            return getDefaultMapBlur(name);
        }
    };

    function getDefaultWhoIsHere(name) {
        return namesTab[name].whoIsHere;
    }

    function getDefaultMapBlur(name) {
        return namesTab[name].mapBlur;
    }

    function getDefaultColor(name) {
        return namesTab[name].color;
    }

    function getDefaultDataDrawerNick(name) {
        return namesTab[name].dataDrawerNick;
    }

    function getDefaultDataDrawerProfAndLevel(name) {
        return namesTab[name].dataDrawerProfAndLevel;
    }

    //function getDefaultWhoIsHere (name) {
    //	return namesTab[name].whoIsHere;
    //}
    //
    //function getDefaultMapBlur (name) {
    //	return namesTab[name].mapBlur;
    //}

    function getDefaultIcon(name) {
        return namesTab[name].icon;
    }

    function getColorByKind(kind) {
        if (!optionDataTab[kind]) return '000000';
        return optionDataTab[kind].color;
    }

    function getShapeByKind(kind) {
        if (!optionDataTab[kind]) return 0;
        return optionDataTab[kind].icon;
    }

    function getShowObject(type) {
        return showObject[type];
    }

    function initNamesTab() {
        let NPC = HandHeldMiniMapData.TYPE.NPC;
        let OTHER = HandHeldMiniMapData.TYPE.OTHER;
        let RESP = HandHeldMiniMapData.TYPE.RESP;
        let CIRCLE = HandHeldMiniMapData.STATIC_ICONS.CIRCLE;
        let SQUARE = HandHeldMiniMapData.STATIC_ICONS.SQUARE;
        let RHOMB = HandHeldMiniMapData.STATIC_ICONS.RHOMB;
        let KIND = HandHeldMiniMapData.KIND;
        let GATEWAY = HandHeldMiniMapData.TYPE.GATEWAY;
        let ITEM = HandHeldMiniMapData.TYPE.ITEM;
        let RIP = HandHeldMiniMapData.TYPE.RIP
        let HERO = HandHeldMiniMapData.TYPE.HERO

        namesTab = {
            [KIND.HERO]: {
                handheldMap: true,
                mapBlur: true,
                color: '#87fdff',
                icon: RHOMB,
                type: HERO
            },
            [KIND.NORMAL_OTHER]: {
                handheldMap: true,
                whoIsHere: true,
                mapBlur: true,
                color: '#eaeaea',
                icon: RHOMB,
                type: OTHER,
                dataDrawerNick: false,
                dataDrawerProfAndLevel: false
            },
            [KIND.FRIEND]: {
                handheldMap: true,
                whoIsHere: true,
                mapBlur: true,
                color: '#46a31d',
                icon: RHOMB,
                type: OTHER,
                dataDrawerNick: false,
                dataDrawerProfAndLevel: false
            },
            [KIND.ENEMY]: {
                handheldMap: true,
                whoIsHere: true,
                mapBlur: true,
                color: '#c71618',
                icon: RHOMB,
                type: OTHER,
                dataDrawerNick: false,
                dataDrawerProfAndLevel: false
            },
            [KIND.CLAN]: {
                handheldMap: true,
                whoIsHere: true,
                mapBlur: true,
                color: '#4cfa4f',
                icon: RHOMB,
                type: OTHER,
                dataDrawerNick: false,
                dataDrawerProfAndLevel: false
            },
            [KIND.CLAN_FRIEND]: {
                handheldMap: true,
                whoIsHere: true,
                mapBlur: true,
                color: '#ffba37',
                icon: RHOMB,
                type: OTHER,
                dataDrawerNick: false,
                dataDrawerProfAndLevel: false
            },
            [KIND.CLAN_ENEMY]: {
                handheldMap: true,
                whoIsHere: true,
                mapBlur: true,
                color: '#fc3e40',
                icon: RHOMB,
                type: OTHER,
                dataDrawerNick: false,
                dataDrawerProfAndLevel: false
            },
            [KIND.GROUP]: {
                handheldMap: true,
                whoIsHere: true,
                mapBlur: true,
                color: '#b554ff',
                icon: RHOMB,
                type: OTHER,
                dataDrawerNick: false,
                dataDrawerProfAndLevel: false
            },
            [KIND.WANTED]: {
                handheldMap: true,
                color: '#ec0c0c',
                icon: RHOMB,
                type: OTHER,
                dataDrawerNick: false,
                dataDrawerProfAndLevel: false
            },
            [KIND.NPCS]: {
                handheldMap: true,
                color: '#fef348',
                icon: CIRCLE,
                type: NPC,
                dataDrawerNick: true
            },
            [KIND.NORMAL_MONSTER]: {
                handheldMap: true,
                color: '#b1b7bd',
                icon: SQUARE,
                type: NPC,
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.ELITE_1]: {
                handheldMap: true,
                color: '#87fdff',
                icon: SQUARE,
                type: NPC,
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.ELITE_2]: {
                handheldMap: true,
                color: '#40bfff',
                icon: SQUARE,
                type: NPC,
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.ELITE_3]: {
                handheldMap: true,
                color: '#ffba37',
                icon: SQUARE,
                type: NPC,
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.HEROS]: {
                handheldMap: true,
                color: '#fe5afb',
                icon: SQUARE,
                type: NPC,
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.HEROES_RESP]: {
                handheldMap: true,
                color: '#ffba37',
                icon: SQUARE,
                type: RESP
            },
            [KIND.HEROES_RESP_E]: {
                handheldMap: true,
                color: '#ffba37',
                icon: SQUARE,
                type: RESP
            },
            [KIND.COLOSSUS]: {
                handheldMap: true,
                color: '#a500fc',
                icon: SQUARE,
                type: NPC,
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.TYTAN]: {
                handheldMap: true,
                color: '#3559ff',
                icon: SQUARE,
                type: NPC,
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.TITAN_RESP]: {
                handheldMap: true,
                color: '#acda22',
                icon: SQUARE,
                type: RESP
            },
            [KIND.RECOVERY]: {
                handheldMap: true,
                color: '#ffa9fe',
                icon: CIRCLE,
                type: [ITEM, NPC]
            },
            [KIND.GATEWAY]: {
                handheldMap: true,
                color: '#3559ff',
                icon: CIRCLE,
                type: GATEWAY
            },
            [KIND.RIP]: {
                handheldMap: true,
                color: '#292929',
                icon: CIRCLE,
                type: RIP
            }
        };

        const mobileSettings = {
            [KIND.HERO]: {},
            [KIND.NORMAL_OTHER]: {
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.FRIEND]: {
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.ENEMY]: {
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.CLAN]: {
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.CLAN_FRIEND]: {
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.CLAN_ENEMY]: {
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.GROUP]: {
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.WANTED]: {
                dataDrawerNick: true,
                dataDrawerProfAndLevel: true
            },
            [KIND.NPCS]: {},
            [KIND.NORMAL_MONSTER]: {},
            [KIND.ELITE_1]: {},
            [KIND.ELITE_2]: {},
            [KIND.ELITE_3]: {},
            [KIND.HEROS]: {},
            [KIND.HEROES_RESP]: {},
            [KIND.HEROES_RESP_E]: {},
            [KIND.COLOSSUS]: {},
            [KIND.TYTAN]: {},
            [KIND.TITAN_RESP]: {},
            [KIND.RECOVERY]: {},
            [KIND.GATEWAY]: {},
            [KIND.RIP]: {}
        };

        if (!mobileCheck()) return;
        for (const key in mobileSettings) {
            if (!namesTab.hasOwnProperty(key)) continue;
            namesTab[key] = {
                ...namesTab[key],
                ...mobileSettings[key]
            };
        }
    }

    function getDataToWhoIsHere() {
        const FUNC = "getDataToWhoIsHere";
        let statesFromStorage = {};

        for (let kindName in namesTab) {

            let issetWhoIsHere = isset(namesTab[kindName].whoIsHere);

            if (!issetWhoIsHere && !isset(namesTab[kindName].mapBlur)) {
                continue;
            }

            let color = StorageFuncHandHeldMiniMap.getColorOfKindByName(kindName);
            let whoIsHere = StorageFuncHandHeldMiniMap.getWhoIsHereOfKindByName(kindName);
            let mapBlur = StorageFuncHandHeldMiniMap.getMapBlurOfKindByName(kindName);


            if (color == null) color = getDefaultColor(kindName);

            if (whoIsHere == null) whoIsHere = getDefaultWhoIsHere(kindName);
            else {
                if (!isBoolean(whoIsHere)) {
                    whoIsHere = getDefaultWhoIsHere(kindName);
                    errorReport(moduleData.fileName, FUNC, "incorrect val!", whoIsHere);
                }
            }

            if (mapBlur == null) mapBlur = getDefaultMapBlur(kindName);
            else {
                if (!isBoolean(mapBlur)) {
                    mapBlur = getDefaultMapBlur(kindName);
                    errorReport(moduleData.fileName, FUNC, "incorrect val!", mapBlur);
                }
            }

            statesFromStorage[kindName] = {
                whoIsHere: issetWhoIsHere ? whoIsHere : null,
                mapBlur: mapBlur,
                color: color
            };

        }

        return statesFromStorage;
    }

    function updateObjects() {
        setOptionDataTab();
        clearShowObject();
        clearShowDataDrawerObject();

        createShowObject();
        createShowDataDrawerObject();
    }

    function createShowObject() {
        showObject[HandHeldMiniMapData.TYPE.OTHER][HandHeldMiniMapData.KIND.MARK_OBJECT] = true;

        for (let name in optionDataTab) {
            if (optionDataTab[name].state) {
                let type = namesTab[name].type;
                if (typeof type === 'object') {
                    for (const oneType of type) {
                        showObject[oneType][name] = true;
                    }
                } else {
                    showObject[type][name] = true;
                }
            }
        }
    }

    function createShowDataDrawerObject() {
        for (let name in optionDataTab) {
            if (!optionDataTab[name].nick && !optionDataTab[name].lvlAndProf) {
                continue
            }

            let type = namesTab[name].type;
            showDataDrawerObject[type][name] = true;
        }
    }

    function updateMinLevelAndRange() {
        minLevel = getAmountElementFromStorage(HandHeldMiniMapData.MIN_LEVEL_DATA);
        widthDataDrawer = getAmountElementFromStorage(HandHeldMiniMapData.DATA_DRAWER_WIDTH_DATA);
        fontSizeDataDrawer = getAmountElementFromStorage(HandHeldMiniMapData.DATA_DRAWER_FONT_SIZE_DATA);

        getEngine().npcs.clearDataToDraw();
        getEngine().others.clearDataToDraw();
    }

    function getAmountElementFromStorage(data) {
        let store = null;
        let name = data.KEY;
        let defaultVal = data.DEFAULT;
        let min = data.MIN;
        let max = data.MAX;

        switch (name) {
            case HandHeldMiniMapData.MIN_LEVEL_DATA.KEY:
                store = StorageFuncHandHeldMiniMap.getMinLevelOfKindByName();
                break;
            case HandHeldMiniMapData.DATA_DRAWER_WIDTH_DATA.KEY:
                store = StorageFuncHandHeldMiniMap.getWidthDataDrawerOfKindByName();
                break;
            case HandHeldMiniMapData.DATA_DRAWER_FONT_SIZE_DATA.KEY:
                store = StorageFuncHandHeldMiniMap.getFontSizeDataDrawerOfKindByName();
                break;
        }

        if (store !== null) {
            if (!isInt(store)) return defaultVal;
            if (store < min) return defaultVal;
            if (store > max) return defaultVal;

            return store;
        } else {
            // var amount = defaultVal;
            // StorageFuncHandHeldMiniMap.setMinLevelOfKindByName(amount);
            // return amount;
            return defaultVal;
        }
    }

    function updateHero() {
        miniMapHeroController.updateData();
    }

    function updateOther(otherData) {
        miniMapOtherController.updateData(otherData);
    }

    function updateNpc(npcData) {
        miniMapNpcController.updateData(npcData)
    }

    function updateRip(ripData) {
        miniMapRipController.updateData(ripData)
    }

    function updateResp(respData) {
        miniMapRespController.updateData(respData)
    }

    function updateGateway(gatewayData) {
        miniMapGatewayController.updateData(gatewayData)
    }

    function updateItems() {
        miniMapItemController.setFetch();
    }

    function updateMap(objData) {
        map.updateData(objData);
        handHeldMiniMapWindow.prepareScaleMarginSquareData();
        setDraw(true);
    }

    function setDraw(state) {
        canDraw = state;
    }

    function canUpdate(type, kind) {
        return showObject[type][kind];
    }

    function canUpdateDataDrawer(type, kind) {
        return showDataDrawerObject[type][kind];
    }

    function getMinLevel() {
        return minLevel
    }

    function getWidthDataDrawer() {
        return widthDataDrawer
    }

    function getFontSizeDataDrawer() {
        return fontSizeDataDrawer
    }

    function clearCanvas(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function updateAndDraw(dt) {
        if (!canDraw) return;

        let ctx = handHeldMiniMapWindow.getCtx();
        let canvas = handHeldMiniMapWindow.getCanvas();

        clearCanvas(ctx, canvas);

        //handHeldMiniMapWindow.updateOffset();

        map.draw(ctx, dt);

        miniMapRespController.draw(ctx, dt);
        miniMapNpcController.draw(ctx, dt);
        miniMapItemController.draw(ctx, dt);
        miniMapRipController.draw(ctx, dt);
        miniMapGatewayController.draw(ctx, dt);
        miniMapOtherController.draw(ctx, dt);
        miniMapHeroController.draw(ctx, dt);
    }

    function updateAllCharacters() {
        var npcs = Engine.npcs.check();
        var npcsArray = [];
        var others = Engine.others.check();
        var gateways = Engine.map.gateways.getDrawableItems();
        var rip = Engine.map.rip.getDrawableList();
        var resp = Engine.heroesRespManager.test();

        miniMapItemController.clearFetch();

        for (let k in npcs) {
            npcsArray.push(npcs[k].d);
        }

        clearCharacterList();
        miniMapTipController.clearCords();

        updateHero();
        updateNpc(npcsArray);
        updateOther(others);
        updateItems();
        updateGateway(gateways);
        updateRip(rip);
        updateResp(resp);
    }

    function clearCharacterList() {
        miniMapHeroController.clearAllLists();
        miniMapOtherController.clearAllLists();
        miniMapNpcController.clearAllLists();
        miniMapOtherController.clearAllLists();
        miniMapItemController.clearAllLists();
        miniMapRipController.clearAllLists();
        miniMapGatewayController.clearAllLists();
        miniMapRespController.clearAllLists();
    }

    function clearMiniMap() {
        setDraw(false);
        clearCharacterList();
        miniMapTipController.clearCords();
    }


    function refreshMiniMapController() {
        updateMinLevelAndRange();
        updateObjects();
        updateAllCharacters()
    }

    function onResize() {
        handHeldMiniMapWindow.onResize();
    }

    function getNamesTab() {
        return namesTab;
    }

    function getIcons() {
        let a = [];
        for (let k in HandHeldMiniMapData.STATIC_ICONS) {
            a.push(k);
        }
        return a;
    }

    this.init = init;
    //this.update                     = update;
    this.updateAndDraw = updateAndDraw;

    this.updateHero = updateHero;
    this.updateMap = updateMap;
    this.updateNpc = updateNpc;
    this.updateOther = updateOther;
    this.updateRip = updateRip;
    this.updateResp = updateResp;
    this.updateGateway = updateGateway;
    this.clearMiniMap = clearMiniMap;
    this.refreshMiniMapController = refreshMiniMapController;
    this.canUpdateDataDrawer = canUpdateDataDrawer;
    this.canUpdate = canUpdate;
    this.onResize = onResize;

    this.getColorByKind = getColorByKind;
    this.getShapeByKind = getShapeByKind;
    this.getShowObject = getShowObject;
    this.getMinLevel = getMinLevel;
    this.getWidthDataDrawer = getWidthDataDrawer;
    this.getFontSizeDataDrawer = getFontSizeDataDrawer;

    this.getAmountElementFromStorage = getAmountElementFromStorage;

    this.getDefaultColor = getDefaultColor;
    this.getDefaultIcon = getDefaultIcon;
    this.iconIndexToName = iconIndexToName;
    this.iconNameToIconIndex = iconNameToIconIndex;

    this.getIcons = getIcons;
    this.getNamesTab = getNamesTab;
    this.getMiniMapNpcController = getMiniMapNpcController;
    this.getMiniMapHeroController = getMiniMapHeroController;
    this.getMiniMapOtherController = getMiniMapOtherController;
    this.getMiniMapItemsController = getMiniMapItemsController;
    this.getMiniMapRipController = getMiniMapRipController;
    this.getMiniMapGatewayController = getMiniMapGatewayController;
    this.getObjectController = getObjectController;
    this.getMiniMapTipController = getMiniMapTipController;
    this.getImageObjectController = getImageObjectController;
    this.getHandHeldMiniMapWindow = getHandHeldMiniMapWindow;

    //this.getDataDrawerOfKindByName = getDataDrawerOfKindByName;
    this.getDataDrawerNickOfKindByName = getDataDrawerNickOfKindByName;
    this.getDataDrawerProfAndLevelOfKindByName = getDataDrawerProfAndLevelOfKindByName;
    this.getWhoIsHereOfKindByName = getWhoIsHereOfKindByName;
    this.getMapBlurOfKindByName = getMapBlurOfKindByName;

    //this.getDefaultDataDrawer 				= getDefaultDataDrawer;
    this.getDefaultDataDrawerNick = getDefaultDataDrawerNick;
    this.getDefaultDataDrawerProfAndLevel = getDefaultDataDrawerProfAndLevel;
    this.getDefaultWhoIsHere = getDefaultWhoIsHere;
    this.getDefaultMapBlur = getDefaultMapBlur;

    this.getDataToWhoIsHere = getDataToWhoIsHere;

};