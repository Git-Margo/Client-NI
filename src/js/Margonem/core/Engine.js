/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let apiData = require('api/ApiData');
let fetchData = require('core/items/data/FetchData');
let viewData = require('core/items/data/ViewData');
let movedData = require('core/items/data/MovedData');
let disableData = require('core/items/data/DisableData');
var Console = require('core/Console');
let SettingsOptions = require('core/SettingsOptions.js');
var RequestCorrect = require('core/RequestCorrect');
let GlobalAddons = require('core/GlobalAddons');
var ServerStorage = require('core/storage/ServerStorage');
var ServerStorageData = require('core/storage/ServerStorageData');
var ThemeController = require('core/themeController/ThemeController');
var ZoomManager = require('core/ZoomManager');
var RajZoomManager = require('core/raj/rajZoom/RajZoomManager');
var Map = require('core/map/Map');
var MapGoMark = require('core/map/MapGoMark');
var MapAreaCordTriggerManager = require('core/map/mapAreaCordTrigger/MapAreaCordTriggerManager');
var MapShift = require('core/map/MapShift');
var EarthQuakeManager = require('core/weather/EarthQuakeManager');
var Hero = require('core/characters/Hero');
var BuildsManager = require('core/builds/BuildsManager');
var CanvasMultiGlow = require('core/tutorial/CanvasMultiGlow');
var HtmlMultiGlow = require('core/tutorial/HtmlMultiGlow');
var CanvasFocus = require('core/tutorial/CanvasFocus');
var HtmlFocus = require('core/tutorial/HtmlFocus');
var LowHealthCanvas = require('core/LowHealthCanvas');
var ColorInterfaceNotificationManager = require('core/colorInterfaceNotification/ColorInterfaceNotificationManager');
var ColorInterfaceNotificationData = require('core/colorInterfaceNotification/ColorInterfaceNotificationData');
var SpecificAnimationManager = require('core/specificAnimation/SpecificAnimationManager.js');
let WidgetNoticeManager = require('core/interface/widgets/WidgetNoticeManager');
var HeroEquipment = require('core/items/HeroEquipment');
var StepsToSend = require('core/StepsToSend');
var Lock = require('core/Lock');
var BrowserCardManager = require('core/BrowserCardManager');
var IdleJSON = require('core/IdleJSON');
var CanvasTip = require('core/CanvasTip');
var Loader = require('core/Loader');
var Communication = require('core/Communication');
var CodeMessageManager = require('core/codeMessage/CodeMessageManager');
var Interface = require('core/interface/Interface');
var WidgetManager = require('core/interface/widgets/WidgetManager');
var WraithCharacterManager = require('core/wraith/WraithCharacterManager');
var WraithObjectManager = require('core/wraith/WraithObjectManager');
var TargetsManager = require('core/targets/TargetsManager');
var HeroesRespManager = require('core/characters/HeroesRespManager');
var NpcIconManager = require('core/characters/NpcIconManager');
var NpcTplManager = require('core/characters/NpcTplManager');
var NpcManager = require('core/characters/NpcManager');
var FakeNpcManager = require('core/characters/FakeNpcManager');
var OthersManager = require('core/characters/OthersManager');
var WhoIsHere = require('core/whoIsHere/WhoIsHere');
var EmotionsManager = require('core/emotions/EmotionsManager');
//var Commercials = require('core/commercials2/Commercials');
var Chat = require('core/Chat.js');
var BusinessCardManager = require('core/businessCards/BusinessCardsManager.js');
var ChatController = require('core/chat/ChatController.js');
var Items = require('core/items/ItemsManager');
var ChatLinkedItemsManager = require('core/items/ChatLinkedItemsManager');
var InterfaceItems = require('core/items/InterfaceItems');
var Tpls = require('core/items/TplsManager');
var Renderer = require('core/Renderer');
var Collider = require('core/collider/EventCollider');
var Reconnect = require('core/Reconnect');
var Loot = require('core/Loot');
//var MPos = require('core/MPos');
var WeatherMgr = require('core/weather/WeatherManager');
var MapFilter = require('core/weather/MapFilter');
//var MiniMap = require('core/map/MiniMap');
var HotKeys = require('core/hotKeys/HotKeys');
// var Sound = require('core/sound/Sound');
var Sound = require('core/sound/Sound2');
var PadController = require('core/PadController');
//var LootFilter = require('core/LootFilter');
var MiniMapController = require('core/map/MiniMapController');
var Matchmaking = require('core/Matchmaking');
var MatchmakingTutorial = require('core/MatchmakingTutorial');
//var QuestTracking = require('core/quest/QuestTracking');
var NewQuestTracking = require('core/quest/NewQuestTracking');
var StickyTips = require('core/StickyTips');
var Captcha = require('core/captcha/Captcha');
var Poll = require('core/Poll');
var WarShadow = require('core/WarShadow');
var ItemsMarkManager = require('core/items/ItemsMarkManager');
var ItemsMovedManager = require('core/items/ItemsMovedManager');
var DisableItemsManager = require('core/items/DisableItemsManager');
var QuestObserve = require('core/quest/QuestObserve');
var GA = require('core/GA');
var Storage = require('core/Storage');
var TutorialManager = require('core/tutorial/TutorialManager');
const {
    getStatsForTips
} = require('core/skills/SkillsParser');
const CrossStorage = require('core/CrossStorage');
const Crafting = require('core/crafting/Crafting');
const WindowCloseManager = require('core/window/WindowCloseManager.js');
const windowsData = require('core/window/WindowsData.js');
const widgetsData = require('core/interface/widgets/WidgetsData');
var WindowManager = require('core/window/WindowManager.js');
//var NightController = require('core/night/NightController2.js');
var NightController = require('core/night/NightController.js');
var OverrideDayNightCycle = require('core/raj/OverrideDayNightCycle.js');
var AddonsPanel = require('core/addons/AddonsPanel');
var Settings = require('core/Settings');

var InterfaceTimerManager = require('core/interfaceTimer/InterfaceTimerManager.js');

var FloatForegroundManager = require('core/floatForeground/FloatForegroundManager.js');
var FloatObjectManager = require('core/floatObject/FloatObjectManager.js');
//var FogController = require('core/FogController.js');
var ImgLoader = require('core/ImgLoader.js');
const WorldWindow = require('core/worldWindow/WorldWindow');
const DeadController = require('core/DeadController');
const RajController = require('core/raj/RajController.js');
const RajPreloadImage = require('core/raj/RajPreloadImage.js');
const RajSequenceManager = require('core/raj/rajSequence/RajSequenceManager.js');
const RajRandomCallerManager = require('core/raj/rajRandomCaller/RajRandomCallerManager.js');
const RajAreaTriggerManager = require('core/raj/rajAreaTrigger/RajAreaTriggerManager.js');
const RajSoundManager = require('core/raj/rajSound/RajSoundManager.js');
const RajMapMusicManager = require('core/raj/rajMapMusic/RajMapMusicManager.js');
const RajEmoActions = require('core/raj/RajEmoActions.js');
const ScreenEffectsManager = require('core/screenEffects/ScreenEffectsManager.js');
const RajEmoDefinitions = require('core/raj/RajEmoDefinitions.js');
//const RajCase = require('core/raj/RajCase.js');
const RajCase = require('core/raj/RajCase2.js');
const RajDialogue = require('core/raj/RajDialogue.js');
const RajProgrammer = require('core/raj/rajProgrammer/RajProgrammer.js');
const RajExtraLight = require('core/raj/RajExtraLight.js');
const DynamicLightsManager = require('core/night/DynamicLightsManager.js');
const DynamicDirCharacterLightsManager = require('core/night/DynamicDirCharacterLightsManager.js');
const BehaviorDynamicLightsManager = require('core/night/BehaviorDynamicLightsManager.js');
const RajCamera = require('core/raj/RajCamera.js');
const RajTracking = require('core/raj/RajTracking.js');
const RajCharacterHide = require('core/raj/RajCharacterHide.js');
const RajMassObjectHide = require('core/raj/rajMassObjectHide/RajMassObjectHide.js');
const CharacterEffectsManager = require('core/characterEffects/CharacterEffectsManager');
const CharacterEffectsMapManager = require('core/characterEffects/CharacterEffectsMapManager');
const CharacterEffectsBattleManager = require('core/characterEffects/CharacterEffectsBattleManager');
//const CharacterEffectsChainManager = require('core/characterEffects/CharacterEffectsChainManager');
const CanvasCharacterWrapperManager = require('core/characters/CanvasCharacterWrapperManager.js');
const ShowEqManager = require('core/showEq/ShowEqManager');
const IframeWindowManager = require('core/iframeWindow/IframeWindowManager');
const RajBattleEvents = require('core/raj/rajBattleEvents/RajBattleEvents.js');
const RajYellowMessage = require('core/raj/RajYellowMessage.js');
const RajCharacterImageChangerManager = require('core/raj/rajCharacterImageChanger/RajCharacterImageChangerManager.js');
const RajMapEvents = require('core/raj/rajMapEvents/RajMapEvents.js');
const RajWindowEvents = require('core/raj/rajWindowEvents/RajWindowEvents.js');
const Battle = require('core/battle/Battle');
//const BattleNight = require('core/battle/BattleNight');
// const MagicInput = require('core/MagicInput');
//const MagicInput = require('core/MagicInput2');
//const ChatInputWrapper = require('core/ChatInputWrapper');
const HeroDirectionData = require('core/characters/HeroDirectionData');
const WorldConfig = require('core/WorldConfig');
const Resolution = require('core/resolution/Resolution.js');
const ResolutionData = require('core/resolution/ResolutionData.js');
//const RenderConnectedImage = require('core/raj/RenderConnectedImage.js');
const QuestMapBorderManager = require('core/questMapBorder/QuestMapBorderManager.js');
const {
    isMobileApp
} = require('core/HelpersTS.ts');

module.exports = function() {
    var self = this;
    //var game_thread = null;
    var game_thread_running = false;
    var stopInit = false;
    var RAF = null;
    var clearReact = true;

    // var $GAME_CANVAS;
    var ctx;
    var ctxMap;
    var time, dt, rafRunning = false;
    var canvasViewWidth = 0;
    var canvasViewHeight = 0;
    this.mode = null;
    //this.ev = "";
    //var lastEv = 0;
    this.ev = null;
    var lastEv = null;

    let framePerSecond = 60;

    let lastClickOnCanvas;

    let firstNotInit = null;
    let initLvl = null;

    this.initCanvasContext = () => {
        // $GAME_CANVAS = $('#GAME_CANVAS');
        ctx = this.interface.get$GAME_CANVAS()[0].getContext('2d');
    };

    this.initMapCanvasContext = () => {
        ctxMap = this.interface.get$MAP_CANVAS()[0].getContext('2d');
    };

    //this.loadGlobalScripts = () => {
    //	return
    //	Engine.globalAddons.loadScriptsList();
    //};

    this.init = function() {

        this.resetEvAndLastEv();

        this.resolution = new Resolution();
        this.resolution.init();
        this.settingsOptions = new SettingsOptions();
        this.settingsOptions.init();
        this.ResolutionData = ResolutionData;
        this.browserCardManager = new BrowserCardManager();
        this.browserCardManager.init();

        this.requestCorrect = new RequestCorrect();
        this.requestCorrect.init();

        this.worldConfig = new WorldConfig();
        this.imgLoader = ImgLoader;
        this.canvasCharacterWrapperManager = new CanvasCharacterWrapperManager();
        this.canvasCharacterWrapperManager.init();
        this.imgLoader.init();
        //this.chatInputWrapper = new ChatInputWrapper();
        //this.chatInputWrapper.init();

        this.apiData = apiData;
        this.itemsFetchData = fetchData;
        this.itemsViewData = viewData;
        this.itemsMovedData = movedData;
        this.itemsDisableData = disableData;

        this.rajController = new RajController();
        this.rajController.init();
        this.rajZoomManager = new RajZoomManager();
        this.rajZoomManager.init();

        this.mapAreaCordTriggerManager = new MapAreaCordTriggerManager();
        this.mapAreaCordTriggerManager.init();

        this.rajAreaTriggerManager = new RajAreaTriggerManager();
        this.rajAreaTriggerManager.init();
        this.rajSoundManager = new RajSoundManager();
        this.rajSoundManager.init();
        this.rajMapMusicManager = new RajMapMusicManager();
        this.rajMapMusicManager.init();
        this.rajSequenceManager = new RajSequenceManager();
        this.rajSequenceManager.init();
        this.rajPreloadImage = new RajPreloadImage();
        this.rajPreloadImage.init();
        this.rajRandomCallerManager = new RajRandomCallerManager();
        this.rajRandomCallerManager.init();
        this.rajYellowMessage = new RajYellowMessage();
        this.rajYellowMessage.init();
        this.rajCase = new RajCase();
        this.rajCase.init();
        this.rajEmoActions = new RajEmoActions();
        this.rajEmoActions.init();
        //this.mapAreaCordTriggerManager = new MapAreaCordTriggerManager();
        //this.mapAreaCordTriggerManager.init();
        this.screenEffectsManager = new ScreenEffectsManager();
        this.screenEffectsManager.init();
        this.rajEmoDefinitions = new RajEmoDefinitions();
        this.rajEmoDefinitions.init();
        this.rajProgrammer = new RajProgrammer();
        this.rajProgrammer.init();

        this.rajDialogue = new RajDialogue();
        this.rajDialogue.init();

        this.rajExtraLight = new RajExtraLight();
        this.rajExtraLight.init();

        this.rajCamera = new RajCamera();
        this.rajCamera.init();

        this.rajTracking = new RajTracking();
        this.rajTracking.init();

        this.zoomManager = new ZoomManager()
        this.zoomManager.init()

        this.rajCharacterHide = new RajCharacterHide();
        this.rajCharacterHide.init();

        this.rajMassObjectHide = new RajMassObjectHide();
        this.rajMassObjectHide.init();

        this.windowsData = windowsData;
        this.widgetsData = widgetsData;
        this.windowCloseManager = new WindowCloseManager();
        this.windowCloseManager.init();
        this.windowManager = new WindowManager();
        this.windowManager.init();
        this.interface = new Interface();
        this.interface.init();


        this.colorInterfaceNotificationManager = new ColorInterfaceNotificationManager();
        this.colorInterfaceNotificationManager.init();

        this.colorInterfaceNotificationManager.updateData({
            action: ColorInterfaceNotificationData.ACTION.CREATE,
            id: ColorInterfaceNotificationData.NAME.LOW_HEALTH,
            color: "#b71212"
        });

        this.widgetManager = new WidgetManager();
        this.widgetManager.init();
        this.console = new Console();
        this.console.init();
        this.globalAddons = new GlobalAddons();
        this.globalAddons.init();
        //this.initMapCanvasContext();
        this.initCanvasContext();

        this.mobile = getMobile();

        if (isMobileApp()) {
            setFramePerSecond(30)
        }

        this.themeController = new ThemeController();
        this.themeController.init();
        this.serverStorage = new ServerStorage();
        this.crossStorage = new CrossStorage();
        this.crossStorage.init();
        this.eventCollider = new Collider();
        this.idleJSON = new IdleJSON();
        this.loader = new Loader();
        this.lock = new Lock();
        this.canvasTip = new CanvasTip();
        this.canvasTip.init();
        this.stepsToSend = new StepsToSend();
        this.renderer = new Renderer();
        this.GA = new GA();

        this.setInterface();

        this.communication = new Communication();
        this.businessCardManager = new BusinessCardManager();
        this.codeMessageManager = new CodeMessageManager();
        this.codeMessageManager.init()
        this.deadController = new DeadController();

        if (CFG.webSocketVersion) {
            this.webSocketConnect = false;
            this.communication.initWebSocket();
        }

        this.soundManager = new Sound();
        this.heroesRespManager = new HeroesRespManager();
        this.heroesRespManager.init();

        this.npcIconManager = new NpcIconManager();
        this.npcIconManager.init();
        this.npcTplManager = new NpcTplManager();
        this.npcTplManager.init();
        this.npcs = new NpcManager();
        this.npcs.init();

        this.fakeNpcs = new FakeNpcManager();
        this.fakeNpcs.init();
        this.others = new OthersManager();
        this.wraithCharacterManager = new WraithCharacterManager();
        this.wraithObjectManager = new WraithObjectManager();
        this.items = new Items();
        this.items.init();
        this.tpls = Tpls;
        this.tpls.init();
        //this.commercials = new Commercials();
        //this.commercials.init();
        this.chatLinkedItemsManager = new ChatLinkedItemsManager();
        this.chatLinkedItemsManager.init();
        Loot.init();
        this.emotions = new EmotionsManager();
        this.emotions.init();
        this.firstLoadInit1 = true;
        this.firstLoadInit2 = true;
        this.firstLoadInit4 = true;

        Storage.checkToResetLocalStorage();

        //this.chat = new Chat();
        //this.chat.init();

        this.chatController = new ChatController();
        this.chatController.init();

        this.overrideDayNightCycle = new OverrideDayNightCycle();
        this.overrideDayNightCycle.init();

        this.nightController = new NightController();
        this.nightController.init();

        this.dynamicLightsManager = new DynamicLightsManager();
        this.dynamicLightsManager.init();

        this.dynamicDirCharacterLightsManager = new DynamicDirCharacterLightsManager();
        this.dynamicDirCharacterLightsManager.init();

        this.behaviorDynamicLightsManager = new BehaviorDynamicLightsManager();
        this.behaviorDynamicLightsManager.init();



        this.hero = new Hero();
        this.hero.init();

        this.interfaceTimerManager = new InterfaceTimerManager();
        this.interfaceTimerManager.init();

        this.canvasMultiGlow = new CanvasMultiGlow();
        this.canvasMultiGlow.init();
        this.htmlMultiGlow = new HtmlMultiGlow();
        this.htmlMultiGlow.init();
        this.canvasFocus = new CanvasFocus();
        this.canvasFocus.init();
        this.htmlFocus = new HtmlFocus();
        this.htmlFocus.init();
        //this.lowHealthCanvas = new LowHealthCanvas();
        //this.lowHealthCanvas.init();

        this.widgetNoticeManager = new WidgetNoticeManager();
        this.widgetNoticeManager.init();

        this.specificAnimationManager = new SpecificAnimationManager();
        this.specificAnimationManager.init();

        this.heroEquipment = new HeroEquipment();
        this.heroEquipment.init();
        this.interfaceItems = new InterfaceItems();
        this.interfaceItems.init();

        this.buildsManager = new BuildsManager();
        this.buildsManager.init();

        this.mapShift = new MapShift();
        this.mapShift.init();
        this.earthQuakeManager = new EarthQuakeManager();
        this.earthQuakeManager.init();
        this.map = new Map();
        this.map.init();
        this.mapGoMark = new MapGoMark();
        this.mapGoMark.init();
        //this.miniMap = MiniMap;

        this.tutorialManager = new TutorialManager();
        this.tutorialManager.init();
        this.tutorials = null;
        this.tutorialValue = null;

        this.miniMapController = new MiniMapController();
        this.miniMapController.init();

        //this.mustHaveRestart = false;
        this.blockSendNextInit = null;

        this.targets = new TargetsManager();

        this.weather = WeatherMgr;
        this.weather.init();
        this.mapFilter = new MapFilter();
        this.mapFilter.init();
        //this.nightController = new NightController();
        //this.nightController.init();
        this.floatForegroundManager = new FloatForegroundManager();
        this.floatForegroundManager.init();
        this.floatObjectManager = new FloatObjectManager();
        this.floatObjectManager.init();
        //this.fogController = new FogController();
        //this.fogController.init();
        this.reconnect = Reconnect;
        this.whoIsHere = new WhoIsHere();

        this.dialogue = false;
        this.shop = false;
        this.shopFilters = null;
        this.mails = false;
        this.recoveryItems = false;
        this.society = false;
        this.trade = false;
        this.codeProm = false;
        this.depo = false;
        this.eventCalendar = false;
        this.adventCalendar = false;
        this.book = false;
        this.premium = false;
        this.goldShop = false;
        this.staminaShop = false;
        this.draconiteShop = false;
        this.quests = false;
        this.roadDisplay = false; //testing flag
        this.allInit = null;
        this.bags = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0], false, false, false, [0, 0]
        ];
        //this.mPos = MPos;
        //this.agressiveNpc = [];
        this.setAts(0);
        this.lag = 0;
        this.help = false;
        this.bonusSelector = false;
        this.hotKeys = new HotKeys();
        this.hotKeys.init();
        this.musicPanel = null;
        this.crafting = new Crafting();
        this.crafting.init();
        //this.lootFilter = new LootFilter();
        this.loggedPrice = null;
        this.addons = null;
        this.addonsPanel = null;
        this.banners = null;
        this.itemsMarkManager = new ItemsMarkManager();
        this.itemsMarkManager.init();
        this.itemsMovedManager = new ItemsMovedManager();
        this.itemsMovedManager.init();
        this.greatMerchamp = false;
        this.showEqManager = new ShowEqManager();
        this.iframeWindowManager = new IframeWindowManager();
        this.changePlayer = null;
        this.changeOutfit = null;
        this.chooseOutfit = null;
        this.conquerStats = false;
        this.catchChar = null;
        this.dead = false;
        this.mcAddon = false;
        this.smcAddon = false;
        this.auctions = false;
        // this.playersOnline = false;
        this.interfaceStart = false;
        this.reload = false;
        this.zoomFactor = null;
        this.canEditWidget = false;
        this.padController = mobileCheck() ? new PadController() : false;
        this.matchmaking = new Matchmaking();
        this.matchmaking.init();
        this.matchmakingTutorial = new MatchmakingTutorial();
        this.matchmakingTutorial.init();
        this.lootPreview = null;
        this.questsObserve = new QuestObserve();
        this.questsObserve.init();

        this.disableItemsManager = new DisableItemsManager();
        this.disableItemsManager.init();
        this.tickSuccess = true;
        //this.instantRequestSuccess = true;

        this.battlePass = null;
        this.showMiniature = false;
        //this.clientVer = false;
        this.news = false;
        this.tpScroll = false;
        //this.questTrack = new QuestTracking();
        //this.questTrack.init();
        this.questTracking = new NewQuestTracking();
        this.questTracking.init();
        this.stickyTips = new StickyTips();
        this.stickyTips.init();
        this.captcha = new Captcha();
        this.poll = new Poll();
        this.rewardsCalendar = false;
        this.rewardsCalendarActive = false;
        this.battlePassActice = false;
        this.warShadow = new WarShadow();
        this.initChanger = null;
        this.windowMaxZIndex = 0;
        //this.lastClickOnCanvas = null;

        setLastClickOnCanvas(null);
        //this.lastClickOnCanvas = null;

        this.getStatsForTips = getStatsForTips;
        this.bonusReselectWindow = false;
        this.itemDetailWindows = [];

        //this.setInterface();

        this.rajBattleEvents = new RajBattleEvents();
        this.rajBattleEvents.init();

        this.rajCharacterImageChangerManager = new RajCharacterImageChangerManager();
        this.rajCharacterImageChangerManager.init();

        this.rajMapEvents = new RajMapEvents();
        this.rajMapEvents.init();

        this.rajWindowEvents = new RajWindowEvents();
        this.rajWindowEvents.init();

        this.battle = new Battle();
        this.battle.init();
        //this.battleNight  = new BattleNight();
        //this.battleNight.init();

        this.characterEffectsManager = new CharacterEffectsManager();
        this.characterEffectsMapManager = new CharacterEffectsMapManager();
        this.characterEffectsBattleManager = new CharacterEffectsBattleManager();
        //this.characterEffectsChainManager = new CharacterEffectsChainManager();

        this.characterEffectsManager.init();
        this.characterEffectsMapManager.init();
        this.characterEffectsBattleManager.init();
        //this.characterEffectsChainManager.init();

        //this.renderConnectedImage = new RenderConnectedImage();
        //this.renderConnectedImage.init();
        this.questMapBorderManager = new QuestMapBorderManager();
        this.questMapBorderManager.init();

        //Engine.interface.preloadImages();
        Engine.imgLoader.preLoadImages();
        this.onClear();
        if (!CFG.webSocketVersion) this.reCallInitQueue();
        this.setCTXScaleMode(3);
        //Interface.initZoomFactor(true);
        var $progressBar = Engine.interface.get$gameWindowPositioner().find('.loader-layer .progress-bar .inner');
        setPercentProgressBar($progressBar, 0);

        this.initTickWorker();

        let el = document.createElement("script");
        el.type = "text/javascript"
        el.innerHTML = `
			const ___ADD_FROM_SCRIPT_HEIGHT = document.documentElement.clientHeight
			const ___ADD_FROM_SCRIPT_TIME = new Date().getTime()
		`;


        document.documentElement.appendChild(el);


        setClientDataInServerStorage();

        if (mobileCheck()) {
            setTimeout(function() {
                self.crazy();
            }, 5000)
        }
    };

    this.crazy = () => {}

    this.setAts = (_ats) => {
        this.ats = _ats
    }

    this.getAts = () => {
        return this.ats;
    }
    const setClientDataInServerStorage = () => {
        let data = {
            [ServerStorageData.M_CLIENT_DATA]: {
                WIDTH: (___M_WIDTH_0 + ___M_WIDTH_1 + ___M_WIDTH_2 + ___M_WIDTH_3 + ___M_WIDTH_4 + document.documentElement.clientWidth) / 6,
                HEIGHT: (___M_HEIGHT_0 + ___M_HEIGHT_1 + ___M_HEIGHT_2 + ___M_HEIGHT_3 + ___M_HEIGHT_4 + document.documentElement.clientHeight) / 6,
                TIME: (___M_TIME_0 + ___M_TIME_1 + ___M_TIME_2 + ___M_TIME_3 + ___M_TIME_4 + new Date().getTime()) / 6,
                ZOOM: (___M_ZOOM_0 + ___M_ZOOM_1 + ___M_ZOOM_2 + ___M_ZOOM_3 + ___M_ZOOM_4 + devicePixelRatio) / 6,
                MOBILE: mobileCheck()
            }
        };

        getEngine().serverStorage.sendData(data);
    };

    // this.activeMustHaveRestart = () => {
    // 	//return;
    // 	this.mustHaveRestart = true;
    // };

    // this.callRestartIfMustHave = () => {
    // 	if (this.mustHaveRestart) location.reload();
    // };

    this.setWebSocketConnect = (state) => {
        this.webSocketConnect = state;
    };

    const initAddons = function() {
        Engine.addonsPanel = new AddonsPanel();
        Engine.addonsPanel.init();
    };

    const initSettings = function() {
        if (!Engine.settings) {
            Engine.settings = new Settings;
            Engine.settings.init();
        }
    };

    this.initAfterServerStorageLoaded = () => {
        this.whoIsHere.init();
        this.soundManager.init();
        Engine.hotKeys.rebuildHotKeys();
        Engine.chatController.getChatDataUpdater().setDataFromServerStorage();

        initSettings();
        initAddons();

        //let v = Engine.handHeldMiniMapController.getAmountElementFromStorage('width-data-drawer');
        //console.log(v);
    };

    this.afterServerStorageReloaded = (data) => {
        // debugger;
        // console.log('afterServerStorageReloaded')
        if (data.includes('hotKeys')) Engine.hotKeys.rebuildHotKeys();
        if (data.includes('whoIsHere')) Engine.whoIsHere.updateWhoIsHereAfterSaveInServerStorage();
        if (data.includes('hotWidget_pc') || data.includes('hotWidget_mobile')) Engine.widgetManager.addWidgetButtons(true);
    };

    // this.get$_canvas = () => {
    // 	return $GAME_CANVAS;//$_canvas;
    // };

    this.fetchURISteps = function() {
        var url = '';
        //var dirMapping = ['S', 'W', 'E', 'N'];
        var dirMapping = Engine.hero.dirMapping();
        var steps = this.stepsToSend.steps.join(';');
        var times = this.stepsToSend.times.join(';');

        if (!self.requestCorrect.checkStepsToSendCorrect(this.stepsToSend.steps)) return '';
        if (!self.requestCorrect.checkTimesToSendCorrect(this.stepsToSend.times)) return '';

        if (steps && times) url = '&ml=' + steps + '&mts=' + times;
        else {
            if (this.hero.setCorrectDir(dirMapping)) {
                url = '&pdir=' + dirMapping.indexOf(this.hero.dir);
            }
        }

        return url;
    };

    this.initTickWorker = () => {
        this.tickWorker = new Worker(`js/Margonem/workers/TickWorker.js?v=${__build.version}`);
        this.tickWorker.onmessage = function(event) {

            if (!game_thread_running || !event) return;

            switch (event.data) {
                case 'tick':
                    self.idleJSON.tick();
                    break;
                default:
                    console.warn(event.data);
            }

        };
    };

    this.startGameThread = function() {
        this.reload = false;
        this.idleJSON.reset();
        Engine.interface.lock.unlock('game_init');
        Engine.map.lock.unlock('game_init');

        //clearInterval(game_thread);
        //game_thread = setInterval(function () {
        //self.idleJSON.tick(dt);
        //}, 50);

        this.startJSONInterval();

        if (RAF) {
            cancelAnimationFrame(RAF);
        }
        callDraw();
    };

    var update = function(dt) {

        let battleWindowActive = checkBattleWindowActive();

        self.zoomManager.update(dt);

        self.fakeNpcs.update(dt);
        self.hero.update(dt);
        self.others.update(dt);
        self.npcs.update(dt);
        self.map.rip.update(dt);
        //self.lowHealthCanvas.update(dt);
        self.colorInterfaceNotificationManager.update(dt);
        self.characterEffectsMapManager.update(dt);
        Engine.rajCamera.update(dt);
        Engine.rajSequenceManager.update(dt);
        Engine.screenEffectsManager.update(dt);
        Engine.rajSoundManager.update(dt);

        self.interfaceTimerManager.update(dt);

        if (!battleWindowActive) {
            self.map.update(dt);
            self.mapGoMark.update(dt);
            self.floatForegroundManager.update(dt);
            self.floatObjectManager.update(dt);
            self.rajCharacterImageChangerManager.update(dt);
            self.dynamicLightsManager.update(dt, "MAP");
            self.dynamicDirCharacterLightsManager.update(dt, "MAP");
            self.emotions.update(dt);
            self.weather.update(dt);
            self.nightController.update(dt);
            self.behaviorDynamicLightsManager.update(dt);
            self.wraithCharacterManager.update(dt);
            self.wraithObjectManager.update(dt);
            self.questTracking.update(dt);
            self.targets.update(dt);
            self.warShadow.update(dt);
        }

        self.canvasCharacterWrapperManager.update(dt);

        self.htmlMultiGlow.update(dt);
        self.canvasMultiGlow.update(dt);

        // self.lowHealthCanvas.update(dt);

        self.htmlFocus.update(dt);
        self.canvasFocus.update(dt);

        //if (self.shop) self.shop.update();
        //if (self.showMiniature) self.showMiniature.update();
        if (self.dialogue) self.dialogue.update();

        //if (!Engine.opt(8)) {
        if (isSettingsOptionsInterfaceAnimationOn()) {
            self.items.update(dt);
            self.tpls.update(dt);
            if (self.battle) {
                self.battle.warriors.updateAllWarriors(dt);
                if (self.battle.getShow()) {
                    self.battle.battleNight.update(dt);
                }
                self.battle.battleEffectsController.getBattleBackgroundTintAction().update(dt);
                self.battle.battleEffectsController.getBattleWarriorsActionController().updateAllEffects(dt);
                self.characterEffectsBattleManager.update(dt)
            }
        }

        //API.callEvent('call_draw_update', dt);
        API.callEvent(self.apiData.CALL_DRAW_UPDATE, dt);

        //self.lowHealthCanvas.draw();
        self.colorInterfaceNotificationManager.draw();
        self.htmlFocus.draw();
        self.specificAnimationManager.draw(dt);
        self.renderer.add.apply(self.renderer, self.canvasFocus.getCanvasFocus());
        self.renderer.add.apply(self.renderer, self.canvasMultiGlow.getCanvasMultiGlow());

        //add items to renderer to calculate their order in global draw queue

        if (!battleWindowActive) {
            self.renderer.add(self.map, self.mapGoMark, self.hero);
            self.renderer.add.apply(self.renderer, self.questMapBorderManager.getDrawableList());
            self.renderer.add.apply(self.renderer, self.warShadow.getWarShadow());
            //self.renderer.add.apply(self.renderer, self.fogController.getFog());
            self.renderer.add.apply(self.renderer, self.screenEffectsManager.getDrawableList());
            self.renderer.add.apply(self.renderer, self.floatForegroundManager.getDrawableList());
            self.renderer.add.apply(self.renderer, self.floatObjectManager.getDrawableList());
            self.renderer.add.apply(self.renderer, self.rajCharacterImageChangerManager.getDrawableList());
            self.renderer.add.apply(self.renderer, self.nightController.getNight());
            self.renderer.add.apply(self.renderer, self.others.getDrawableList());
            self.renderer.add.apply(self.renderer, self.emotions.getDrawableList());
            self.renderer.add.apply(self.renderer, self.npcs.getDrawableList());
            self.renderer.add.apply(self.renderer, self.fakeNpcs.getDrawableList());
            self.renderer.add.apply(self.renderer, self.hero.getDrawableList());
            self.renderer.add.apply(self.renderer, self.wraithCharacterManager.getDrawableList());
            self.renderer.add.apply(self.renderer, self.wraithObjectManager.getDrawableList());
            self.renderer.add.apply(self.renderer, self.targets.getDrawableList());
            self.renderer.add.apply(self.renderer, self.weather.getDrawableList());
            self.renderer.add.apply(self.renderer, self.map.groundItems.getDrawableItems());
            self.renderer.add.apply(self.renderer, self.map.gateways.getDrawableItems());
            self.renderer.add.apply(self.renderer, self.map.rip.getDrawableList());
            self.renderer.add.apply(self.renderer, self.map.questProgressBar.getDrawableList());
            self.renderer.add.apply(self.renderer, self.characterEffectsMapManager.getDrawableList());
            if (self.roadDisplay) self.renderer.add(self.hero.roadDisplay);
            //if (self.questTrack) self.renderer.add.apply(self.renderer, self.questTrack.getDrawableList());
        }

        self.canvasCharacterWrapperManager.draw();

        //if (!Engine.opt(8)) {
        if (isSettingsOptionsInterfaceAnimationOn()) {
            self.items.drawItems();
            self.tpls.drawItems();
            if (self.battle) {
                self.battle.warriors.drawAllWarriors();
                self.battle.battleEffectsController.getBattleBackgroundTintAction().draw();
                self.battle.battleEffectsController.getBattleWarriorsActionController().drawAllEffects();
                self.characterEffectsBattleManager.draw(dt)
                if (self.battle.getShow()) self.battle.battleNight.draw();
            }
        }

        Engine.miniMapController.handHeldMiniMapController.updateAndDraw(dt);

        self.updateScreenSize();

        //API.callEvent('call_draw_add_to_renderer');
        API.callEvent(self.apiData.CALL_DRAW_ADD_TO_RENDERER);

    };

    this.updateScreenSize = function() {
        let drawable = self.map.getDrawable();

        if (!drawable) {
            self.renderer.updateScreenSize(false, true);
            return
        }

        let margin = 5;

        Engine.renderer.updateScreenSize({
            x: Engine.map.minX - 5,
            y: Engine.map.minY - 6,
            maxX: Engine.map.maxX + 4,
            maxY: Engine.map.maxY + 7
        });

    }

    var draw = function(clearRect) {
        ctx.clearRect(0, 0, canvasViewWidth, canvasViewHeight);

        let zoom = getEngine().zoomManager.getActualZoom();
        let zoomChange = zoom != 1;

        if (zoomChange) {
            ctx.save();
            ctx.scale(zoom, zoom);
        }

        self.renderer.draw(ctx);

        if (zoomChange) {
            ctx.restore();
        }
        clearReact = !clearReact;
    };


    let dtCounter = [];

    var callDraw = function() {
        //Engine.requestAnimationFrameUpdateFinished = false;
        var now = new Date().getTime();
        dt = (now - (time || now)) / 1000;


        if (!time) {
            time = now;
        }

        let margin = 0.004

        if (dt > 1 / framePerSecond - margin) {

            Engine.requestAnimationFrameUpdateFinished = false;
            //if (true) {

            time = now;


            dtCounter.push(dt);

            if (dtCounter.length == 50) {
                let v = 0;
                for (let k in dtCounter) {
                    v += dtCounter[k];
                }

                //console.log('dt', v / dtCounter.length);

                dtCounter = [];
            }

            //rafRunning RequestAnimationFrame is running
            rafRunning = dt <= 0.2;
            if (rafRunning) {
                update(dt);
                draw();
                Engine.mapAreaCordTriggerManager.draw(ctx); // it is incorrect place to draw this, but is only for testers
                Engine.requestAnimationFrameUpdateFinished = true;
            }
        }

        RAF = requestAnimationFrame(callDraw);
    };


    // this.framePerSecond = 15;
    //
    // let timePassed = 0;
    //
    // var callDraw = function () {
    //
    //
    // 	Engine.requestAnimationFrameUpdateFinished = false;
    //
    // 	let timeToDraw 	= 1000 / self.framePerSecond / 1000;
    // 	var now 		= new Date().getTime();
    // 	dt 				= (now - (time || now)) / 1000;
    // 	time 			= now;
    //
    // 	timePassed += dt;
    //
    // 	update(dt);
    //
    // 	rafRunning = dt <= 0.2;
    // 	if (rafRunning) {
    //
    //
    //
    // 		if (timePassed > timeToDraw) {
    //
    // 			timePassed = timePassed - timeToDraw;
    // 			if (timePassed > timeToDraw) timePassed = 0;
    //
    //
    // 			draw();
    //
    // 		}
    // 		// console.log(dt, timePassed)
    //
    //
    // 		Engine.requestAnimationFrameUpdateFinished = true;
    // 	}
    //
    // 	RAF = requestAnimationFrame(callDraw);
    //
    // };


    this.onResize = function() {
        if (Engine.mobile != getMobile()) {
            location.reload();
            return
        }

        if (!Engine.interfaceStart) return;

        this.interface.setInterfaceSize();

        this.resizeScreen();

        let oldCanvasWidth = canvasViewWidth;
        let oldCanvasHeight = canvasViewHeight;

        this.ctxResize();
        this.nightController.resizeMainCanvas();
        this.screenEffectsManager.resize();

        let oldWindowSize = {
            width: window.innerWidth - canvasViewWidth + oldCanvasWidth,
            height: window.innerHeight - canvasViewHeight + oldCanvasHeight
        };

        let newWindowSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        let increase = null;

        if (newWindowSize.width != oldWindowSize.width || newWindowSize.height != oldWindowSize.height) {

            increase = newWindowSize.width > oldWindowSize.width || newWindowSize.height > oldWindowSize.height;

        }

        if (this.battle) this.battle.onResize();
        if (this.dialogue) this.dialogue.onResize();
        //if (this.auctions) this.auctions.onResize();
        if (this.banners) this.banners.onResize();
        if (this.quests) this.quests.onResize();
        //if (this.wantedController) this.wantedController.getWantedList().onResize();
        if (this.miniMapController) this.miniMapController.onResize();
        this.miniMapController.handHeldMiniMapController.onResize();
        //if (this.lowHealthCanvas) this.lowHealthCanvas.onResize();
        if (this.colorInterfaceNotificationManager) this.colorInterfaceNotificationManager.onResize();
        this.setPosOfAllWindow();
        $('.scroll-wrapper').trigger('update');
        if (this.tutorials) this.tutorials.onResize();

        //Engine.chat.onResize();
        Engine.hero.onResize();
        Engine.map.onResize();
        Engine.weather.onResize(newWindowSize, oldWindowSize, increase);
        if (Engine && Engine.dialogue) {
            Engine.dialogue.updateBubblePos();
        }
        Engine.addonsPanel.onResize();
        getEngine().map.setForceRender(true);
    };

    this.setPosOfAllWindow = function() {
        //$('.alerts-layer').find('.border-window').each(function () {
        //	$(this).data().updatePos();
        //});
        //$('.mAlert-mobile-layer').find('.border-window').each(function () {
        //	$(this).data().updatePos();
        //});

        let LayersData = require('core/interface/LayersData');

        // Engine.windowManager.updatePosOfWindowsInSpecificLayer(0);
        // Engine.windowManager.updatePosOfWindowsInSpecificLayer(1);
        Engine.windowManager.updatePosOfWindowsInSpecificLayer(LayersData.$_ALERTS_LAYER);
        Engine.windowManager.updatePosOfWindowsInSpecificLayer(LayersData.$_M_ALERT_LAYER);
        Engine.windowManager.updatePosOfWindowsInSpecificLayer(LayersData.$_CONSOLE_LAYER);
    };

    this.resizeScreen = function() {
        const val = Engine.zoomFactor ? Engine.zoomFactor : 1;
        const $body = $('body');
        $body.width(window.innerWidth / val);
        $body.height(window.innerHeight / val);
        $body.css('transform', 'scale(' + val + ')');
    };

    this.setCTXScaleMode = function(mode) {
        if (mode === 1) { //new mode
            this.mode = function(width, height) {
                var scale = 1;
                if (isset(window.devicePixelRatio))
                    scale = Math.round(window.devicePixelRatio * 100) / 100;

                var canvasWidth = Math.round(width * scale);
                var canvasHeight = Math.round(height * scale);

                canvasWidth += canvasWidth % 2;
                canvasHeight += canvasHeight % 2;

                var viewWidth = Math.round(canvasWidth / scale);
                var viewHeight = Math.round(canvasHeight / scale);
                return {
                    canvas: {
                        width: canvasWidth,
                        height: canvasHeight
                    },
                    css: {
                        width: viewWidth,
                        height: viewHeight
                    },
                    store: {
                        width: viewWidth,
                        height: viewHeight
                    },
                    scale: scale
                };
            };
        } else if (mode === 2) { //old mode without floatpoint
            this.mode = function(width, height) {
                var canvasWidth = Math.round(width);
                var canvasHeight = Math.round(height);

                canvasWidth += canvasWidth % 2;
                canvasHeight += canvasHeight % 2;

                return {
                    canvas: {
                        width: canvasWidth,
                        height: canvasHeight
                    },
                    css: {
                        width: canvasWidth,
                        height: canvasHeight
                    },
                    store: {
                        width: canvasWidth,
                        height: canvasHeight
                    },
                    scale: 1
                };
            };
        } else if (mode === 3) { //old mode
            this.mode = function(width, height) {
                var canvasWidth = width;
                var canvasHeight = height;

                canvasWidth += canvasWidth % 2;
                canvasHeight += canvasHeight % 2;

                return {
                    canvas: {
                        width: canvasWidth,
                        height: canvasHeight
                    },
                    css: {
                        width: canvasWidth,
                        height: canvasHeight
                    },
                    store: {
                        width: canvasWidth,
                        height: canvasHeight
                    },
                    scale: 1
                };
            };
        }
    };

    this.ctxResize = function() {
        //var $gameLayer = $('.game-layer');
        let $gameLayer = Engine.interface.get$gameLayer();
        let width = $gameLayer.width();
        let height = $gameLayer.height();
        let sizes = this.mode(width, height);

        let $GAME_CANVAS = this.interface.get$GAME_CANVAS();
        //let $MAP_CANVAS 	= this.interface.get$MAP_CANVAS();
        //let $echhLayer 		= this.interface.get$echhLayer();
        //let lowHealthLayer 	= this.lowHealthCanvas.getCanvas();

        $GAME_CANVAS
            .attr('width', sizes.canvas.width)
            .attr('height', sizes.canvas.height)
            .css({
                width: sizes.css.width + 'px',
                height: sizes.css.height + 'px'
            });

        //$MAP_CANVAS
        //	.attr('width', sizes.canvas.width)
        //	.attr('height', sizes.canvas.height)
        //	.css({
        //		width: sizes.css.width + 'px',
        //		height: sizes.css.height + 'px'
        //	});

        //getEngine().lowHealthCanvas.setSizeCanvas(sizes.canvas.width, sizes.canvas.height);

        //if (lowHealthLayer) {
        //	lowHealthLayer.width 	= sizes.canvas.width;
        //	lowHealthLayer.height 	= sizes.canvas.height;
        //}

        if (sizes.scale !== 1) {
            ctx.scale(sizes.scale, sizes.scale);
        }
        canvasViewWidth = sizes.store.width;
        canvasViewHeight = sizes.store.height;
        Engine.warShadow.setSizeCanvas();
    };

    this.setDefaultInterfaceCookie = function() {
        var ddd = new Date();
        ddd.setTime(ddd.getTime() + 3600000 * 24 * 30);
        setCookie('interface', 'ni', ddd, '/', 'margonem.' + getMainDomain());
    };

    this.setInterface = function() {
        //if (_l() == 'en') return;
        var i = getCookie('interface');
        if (i == null) self.setDefaultInterfaceCookie();
        else {
            if (i != 'ni') self.setDefaultInterfaceCookie();
        }
    };

    this.setBlockSendNextInit = (state) => {
        this.blockSendNextInit = state;
    };

    this.setFirstLoadInit1 = (state) => {
        this.firstLoadInit1 = state;
    };

    this.setFirstLoadInit2 = (state) => {
        this.firstLoadInit2 = state;
    };

    this.setFirstLoadInit4 = (state) => {
        this.firstLoadInit4 = state;
    };

    //this.opt = function (which, opt) {
    //	if (opt) {
    //		return opt & (1 << which - 1);
    //	}
    //	if (!Engine || !Engine.hero || !Engine.hero.d || !Engine.hero.d.hasOwnProperty('opt')) {
    //		// console.trace();
    //		// console.log('opt warn');
    //		return;
    //	}
    //	return Engine.hero.d.opt & (1 << which - 1);
    //
    //};

    this.setAllObjectsAnimationState = function(state) {
        this.hero.setStaticAnimation(state);
        if (this.hero.pet) this.hero.pet.setStaticAnimation(state);
        if (this.battle) this.battle.warriors.setWarriorsAnimationState(state);
        this.others.setOthersAnimationState(state);
        this.npcs.setNpcsAnimationState(state);
        this.fakeNpcs.setFakeNpcAnimationState(state);
        this.emotions.setEmotionsAnimationsState(state);
        this.map.groundItems.setGroundItemsAnimationsState(state); //Engine.opt(8)
        //this.lowHealthCanvas.setBlink(!state);
        this.colorInterfaceNotificationManager.setBlink(!state);
    };

    this.setFirstNotInit = (state) => {
        firstNotInit = state;
    };

    this.getFirstNotInit = () => {
        return firstNotInit;
    };

    this.getWebdriver = () => {
        return navigator.webdriver;
    };

    this.isInitLoadTime = () => {
        return this.allInit ? false : true;
    }

    const getInitLvl = () => {
        return initLvl
    }

    //called on start and every time when called _g('walk') or "reload" comes from server
    this.reCallInitQueue = function(captchaAnswer) {
        if (self.getWebdriver()) {
            mAlert(_t('forbidden_webdriver'));
            return
        }
        if (!Engine.tickSuccess) {
            console.log('reCallInitQueue BUG!')
            return
        }
        initLvl = 1;
        self.allInit = false;
        self.setFirstNotInit(null);
        this.stopJSONInterval();
        var cleared = false;

        var initCall = function() {
            if (stopInit) return;
            //var ts = init == 1 ? "&clientTs=" + unix_time(true) : '';
            var ts = "&clientTs=" + unix_time(true);
            let serverStorage = '';
            let captchaRequest = '';
            let payLoad = null;
            let ignoreChat = '';

            if (initLvl == 1) {
                if (Engine.firstLoadInit1) {
                    self.setBlockSendNextInit(false);
                    self.setFirstLoadInit1(false);
                    if (captchaAnswer) captchaRequest = captchaAnswer;
                    serverStorage = '&configGet=1';
                } else {
                    Engine.deadController.unset(false);
                }
            }

            if (Engine.firstLoadInit2 && initLvl == 2) {
                self.setFirstLoadInit2(false);

                //Engine.loadGlobalScripts();

                if (Engine.serverStorage.getReloadServerStorageAfterAnswerInInit1()) {

                    serverStorage = '&configSet=1';
                    payLoad = Engine.serverStorage.prepareMergeObjToSend();
                    Engine.serverStorage.createOldDataAndResetNewData();
                }
            }

            if (initLvl == 4) {
                if (Engine.firstLoadInit4) self.setFirstLoadInit4(false);
                else ignoreChat = "&ignoreChat=1";
            }

            let callbacks = [
                function() {
                    if (!cleared) {
                        self.onClear();
                        cleared = true;
                    }
                },
                function(data) {
                    if (data.t == 'stop') return;
                    if (initLvl == 1 && Engine.blockSendNextInit) return;

                    initLvl++;

                    //if (init == 4) return

                    if (initLvl == 2) {
                        Engine.loader.load('players');
                        Engine.loader.load('npc');
                    }
                    if (initLvl > 4) {
                        self.allInit = true;
                        self.afterAllInitData();
                        if (Engine.map.getDrawable()) self.startGameThread();
                        self.lock.remove("change_location");
                    } else initCall();
                }
            ];

            if (CFG.webSocketVersion) Engine.communication.send2('init&initlvl=' + initLvl + ts + serverStorage + ignoreChat + captchaRequest + '&mucka=' + Math.random(), callbacks, payLoad ? payLoad : false);
            else Engine.communication.send('init&initlvl=' + initLvl + ts + serverStorage + ignoreChat + captchaRequest + '&mucka=' + Math.random(), callbacks, payLoad ? payLoad : false);
        };
        this.beforeAllInitData();
        initCall();
    };

    this.beforeAllInitData = () => {
        if (Engine.dialogue) Engine.dialogue.endTalk();
    }

    this.afterAllInitData = () => {
        //Engine.nightController.nightManage();
        //return;
        // Engine.map.serveRayControllerData();
        //     Engine.npcs.serveRayControllerData();
        Engine.fakeNpcs.serveRayControllerData();
        Engine.questTracking.startTrackingIfActiveTrackingQuestExist();
        if (!isset(this.worldWindow)) {
            this.worldWindow = new WorldWindow.default();
            this.worldWindow.init();
        }
        //Engine.commercials.showCommercials();

    };

    this.stop = function() {
        stopInit = true;
        this.stopJSONInterval();
    };

    this.start = function() {
        stopInit = false;
    };

    this.startJSONInterval = function() {
        game_thread_running = true;
    };

    this.stopJSONInterval = function() {
        //clearInterval(game_thread);
        game_thread_running = false;
    };

    this.getEv = () => {
        return this.ev; // TODO after delete Engine.ev from xawd-client project, this.ev change to private ev
    };

    this.getLastEv = () => {
        return lastEv;
    };

    this.setEv = (_ev) => {
        this.ev = _ev; // TODO after delete Engine.ev from xawd-client project, this.ev change to private ev
    };

    this.setLastEv = (_lastEv) => {
        lastEv = _lastEv;
    };

    this.onClear = function() {
        // console.log('onClear')
        this.rajCharacterImageChangerManager.onClear()
        this.rajZoomManager.onClear();
        this.questMapBorderManager.onClear();
        this.rajCamera.onClear();
        this.rajTracking.onClear();
        this.rajCharacterHide.onClear();
        this.rajMassObjectHide.onClear();
        this.rajDialogue.onClear();
        this.rajSequenceManager.onClear();
        this.rajEmoDefinitions.onClear();
        this.mapAreaCordTriggerManager.onClear();
        this.rajEmoActions.onClear();
        this.rajAreaTriggerManager.onClear();
        this.rajSoundManager.onClear();
        this.rajMapMusicManager.onClear();
        this.hero.onClear();
        this.map.onClear();
        this.npcTplManager.onClear();
        this.npcIconManager.onClear();
        this.mapGoMark.onClear();
        this.npcs.onClear();
        this.fakeNpcs.onClear();
        this.wraithObjectManager.onClear();
        this.others.onClear(false);
        this.heroesRespManager.onClear();
        this.interfaceTimerManager.onClear();
        this.emotions.onClear();
        this.weather.onClear();
        this.mapFilter.onClear();
        this.items.onClear();
        this.zoomManager.onClear();
        this.nightController.onClear();
        this.screenEffectsManager.onClear();
        this.rajExtraLight.onClear();
        this.dynamicLightsManager.onClear();
        this.dynamicDirCharacterLightsManager.onClear();
        this.behaviorDynamicLightsManager.onClear();
        this.floatForegroundManager.onClear();
        this.floatObjectManager.onClear();
        //this.fogController.onClear();
        //if (this.shop) this.shop.close();
        //if (this.showMiniature) this.showMiniature.close();
        this.renderer.onClear();
        Engine.miniMapController.handHeldMiniMapController.clearMiniMap();
        this.characterEffectsMapManager.onClear();
        this.characterEffectsBattleManager.onClear();

        this.questTracking.onClear();

        this.earthQuakeManager.onClear();
        this.themeController.onClear();

        //Engine.chat.onClear();
        this.stepsToSend.reset();
        Engine.tutorialManager.onClear();
        this.rajProgrammer.onClear();
        this.resetEvAndLastEv();
        //this.agressiveNpc = [];

        this.rajBattleEvents.onClear();
        this.rajMapEvents.onClear();
        this.rajWindowEvents.onClear();

        Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 10);
    };

    this.resetEvAndLastEv = () => {
        this.setEv("");
        this.setLastEv(0);
    };

    this.getCollisionAtEvent = function(e) {
        var factor = Engine.zoomFactor;
        e.clientX = e.clientX / factor;
        e.clientY = e.clientY / factor;
        let $GAME_CANVAS = this.interface.get$GAME_CANVAS();
        return Engine.eventCollider.dispatch(e,
            e.clientX - $GAME_CANVAS.offset().left / factor + self.map.offset[0],
            e.clientY - $GAME_CANVAS.offset().top / factor + self.map.offset[1]
        );
    };

    this.getCanvasViewSize = function() {
        return {
            width: canvasViewWidth,
            height: canvasViewHeight
        };
    }

    this.getWorldTime = () => {
        return this.worldTime;
    };

    const setLastClickOnCanvas = (_lastClickOnCanvas) => {
        lastClickOnCanvas = _lastClickOnCanvas;
    };

    const getLastClickOnCanvas = () => {
        return lastClickOnCanvas;
    }

    const setFramePerSecond = (_framePerSecond) => {
        framePerSecond = _framePerSecond;
    }

    const getCtxMap = () => {
        return ctxMap
    }

    this.setLastClickOnCanvas = setLastClickOnCanvas;
    this.getLastClickOnCanvas = getLastClickOnCanvas;
    this.getInitLvl = getInitLvl;
    this.setFramePerSecond = setFramePerSecond;
    this.getCtxMap = getCtxMap;
};