var tpl = require('core/Templates');
//var QT = require('core/quest/QuestTracking');
//var MMW  = require('core/map/MiniMapWindow');
var HandHeldMiniMapController = require('core/map/handheldMiniMap/HandHeldMiniMapController');
var StorageFuncMiniMapController = require('core/map/StorageFuncMiniMapController');
const DragZoom = require('js/jQExtend/DragZoom/DragZoom');
let NpcData = require('core/characters/NpcData');
const EmotionsData = require('core/emotions/EmotionsData');

module.exports = function() {

    var self = this;
    this.$ = null;
    this.handHeldMiniMapController = null;
    var oneTile = null;
    var resizeTimeOut = null;
    var miniMapShow = false;
    var globalMapLoaded = false;
    var mapList = null;

    var mapWidth;
    var mapHeight;
    let dragZoom;

    this.getMiniMapShow = function() {
        return miniMapShow;
    };

    this.init = function() {

        this.initTemplate();

        this.createLocalContent();
        this.createGlobalContent();
        this.createButtonsPanel();
        this.initDragAndZoom();
        this.handHeldMiniMapController = new HandHeldMiniMapController();
        this.handHeldMiniMapController.init();

        this.initSearch();
    };

    this.initDragAndZoom = () => {
        dragZoom = new DragZoom('.mini-global-map-overflow', {
            minScale: .1,
            maxScale: 2,
            factor: .2
        });
    };

    this.initTemplate = function() {
        this.$ = tpl.get('mini-map-controller');
        Engine.interface.get$interfaceLayer().find('.right-column').after(this.$);
    };

    this.showLocalAndHideGlobalMap = function(bool) {
        if (Engine.map) {
            var title = bool ? Engine.map.d.name : _t('show-minimap', null, 'widgets-tip');
            self.$.find('.mini-map-label').html(title);
        }

        if (!bool && !globalMapLoaded) _g('minimap');

        self.$.find('.mini-map-local-content').css('display', bool ? 'block' : 'none');
        self.$.find('.mini-local-map').css('display', bool ? 'block' : 'none');
        self.$.find('.mini-map-global-content').css('display', !bool ? 'block' : 'none');
        self.$.find('.mini-global-map').css('display', !bool ? 'block' : 'none');
        self.$.find('.mini-global-map-overflow').css('display', !bool ? 'block' : 'none');
        self.$.find('.show-global-map-btn').tip(_t(bool ? 'global_map' : 'local_map'));

        this.updateScroll();
    };

    this.toggleBckType = function($btn, bool) {
        var globalCl = 'mimi-map-global-bck';
        var $bck = $btn.find('.add-bck');
        $bck.removeClass(globalCl + ' ' + localCl);
        $bck.addClass(bool ? localCl : globalCl);
    };

    this.createButtonsPanel = function() {
        var $wrapper = self.$.find('.mini-map-buttons');
        var $btn1 = tpl.get('button').addClass('small green toggle-btn set-local-map-btn');
        var $btn2 = tpl.get('button').addClass('small green toggle-btn set-global-map-btn');
        $btn1.find('.label').html(_t('local_map'));
        $btn2.find('.label').html(_t('iconglobe'));
        $wrapper.append($btn1);
        $wrapper.append($btn2);
        $btn1.click(function() {
            self.showLocalAndHideGlobalMap(true);
            self.setDisable($(this));
        });
        $btn2.click(function() {
            self.showLocalAndHideGlobalMap(false);
            self.setDisable($(this));
        });
        this.createButton('close-mini-map-btn', $wrapper, 'close', this.toggleMiniMap);
        this.$.find('.close-mini-map-btn').tip(_t('hotkey_close'));
    };

    this.setDisable = function($b) {
        self.$.find('.toggle-btn').removeClass('disable');
        $b.addClass('disable')
    };

    this.createButton = function(cl, wrapper, bck, clb) {
        var $btn = tpl.get('button').addClass('small ' + cl);
        wrapper.append($btn);

        $btn.append(tpl.get('add-bck').addClass(bck));
        $btn.click(clb);
        return $btn;
    };

    this.updateMiniMapWindow = function() {
        self.handHeldMiniMapController.updateMap(Engine.map);
    };

    this.updateWindowMiniMapHeroPos = function(x, y) {
        self.handHeldMiniMapController.updateHero(x, y);
    };

    this.updateWindowMiniMapMonsterPos = function(monsters) {
        self.handHeldMiniMapController.updateNpc(monsters);
    };

    this.updateWindowMiniMapOthersPos = function(others, force = false) {
        self.handHeldMiniMapController.updateOther(others);
    };

    this.updateWindowMiniMapGatewaysPos = function() {
        let Gateways = Engine.map.gateways.getDrawableItems();
        self.handHeldMiniMapController.updateGateway(Gateways);
    };

    this.updateWindowMiniMapRipsPos = function(Rips) {
        self.handHeldMiniMapController.updateRip(Rips);
    };

    this.updateWindowMiniMapRespPos = function(Resp) {
        self.handHeldMiniMapController.updateResp(Resp);
    };

    this.openMiniMap = function() {
        this.$.css('display', 'block');
        Engine.lock.add('miniMapBlock');
        miniMapShow = true;
        self.setHeader();
        self.updateLocalMapAndElements();
        self.updateScroll();
        dragZoom.resetScale();
        var mainId = Engine.map.d.mainid;
        var id = mainId == 0 ? Engine.map.d.id : mainId;
        var obj = mapList ? mapList[id] : null;
        if (!obj) {
            dragZoom.resetPosition();

        } else self.centerMapOnElement(self.$.find('#map_id_' + id));
        self.showLocalAndHideGlobalMap(false);
        self.setDisable(self.$.find('.set-global-map-btn'));
        if (globalMapLoaded) self.showMyLoc();

        Engine.widgetManager.manageClassOfWidget(Engine.widgetsData.name.MAP, true);
    };

    this.closeMiniMap = function() {
        Engine.lock.remove('miniMapBlock');
        this.$.css('display', 'none');
        miniMapShow = false;
        Engine.widgetManager.manageClassOfWidget(Engine.widgetsData.name.MAP, false);
    };

    this.toggleMiniMap = function() {
        if (miniMapShow) self.closeMiniMap();
        else self.openMiniMap();
    };

    this.toggleMiniMapWindow = () => {
        this.handHeldMiniMapController.getHandHeldMiniMapWindow().toggleMiniMap();
    };

    this.setHeader = function() {
        self.$.find('.mini-map-label').html(Engine.map.d.name);
        self.$.find('.hero-is-here').tip(Engine.map.d.name);
    };

    this.onResize = function() {
        if (!Engine.map.size) return;
        if (miniMapShow) self.updateLocalMapAndElements();
    };

    this.updateLocalMapAndElements = function() {
        self.clearElements();
        self.setLocalMap();
        if (resizeTimeOut) clearTimeout(resizeTimeOut);
        resizeTimeOut = setTimeout(function() {
            self.setElementsOnMiniMap();
        }, 200);
    };

    this.setLocalMap = function() {
        var m = Engine.map;
        var $mMM = self.$.find('.mini-map-map');
        let mapSize = m.getSize();

        oneTile = $mMM.height() / m.size.y;

        var newWidth = mapSize.x * oneTile;
        var newHeight = mapSize.y * oneTile;

        if (newWidth > $mMM.width()) {
            oneTile = $mMM.width() / mapSize.x;
            newWidth = $mMM.width();
            newHeight = mapSize.y * oneTile;
        }

        self.$.find('.mini-local-map').css({
            width: newWidth + 'px',
            height: newHeight + 'px'
        });

        if (m.isBackgroundOffsetExist()) redrawLocalMiniMapWithBackgroundOffset();
        else setbackgroundOfMiniLocalMap(m.src);


    };

    const setbackgroundOfMiniLocalMap = (src) => {
        self.$.find('.mini-local-map').css({
            background: 'url(' + src + ') no-repeat center',
            'background-size': 'contain'
        });
    };

    const redrawLocalMiniMapWithBackgroundOffset = () => {

        let m = getEngine().map;

        Engine.imgLoader.onload(m.src, false,
            (i) => {},
            (i) => {
                let backgroundOffset = m.getBackgroundOffset();
                let mapSize = m.getSize();
                let mapImage = m.getRedrawImageWithBackgroundOffset(i, mapSize.x, mapSize.y, backgroundOffset.x, backgroundOffset.y);

                mapImage.toBlob(function(blob) {

                    let urlCreator = window.URL || window.webkitURL;
                    let imageUrl = urlCreator.createObjectURL(blob);

                    setbackgroundOfMiniLocalMap(imageUrl);

                }, 'image/png');
            }
        )
    };

    this.getSpecialElementsFromNpc = () => {
        var npcs = Engine.npcs.check();
        var specialElementsObject = self.setSearchElementsFromDivideButtons();

        for (var i in npcs) {
            let npc = npcs[i];
            let type = npc.getType();

            if (type == 3 || type == 2) {
                continue;
            }

            for (var name in specialElementsObject.BITS) {
                self.checkbitPosAndAddElement(npc, name, specialElementsObject.BITS);
            }

            if (lengthObject(specialElementsObject.OTHER)) {

                const NORMAL_QUEST = EmotionsData.NAME.NORMAL_QUEST;
                const DAILY_QUEST = EmotionsData.NAME.DAILY_QUEST;

                if (specialElementsObject.OTHER[NORMAL_QUEST]) {
                    checkbitOtherSpecialElementsAndAddElement(npc, NORMAL_QUEST, specialElementsObject.OTHER, npc.getHasOnetimeQuest());
                }

                if (specialElementsObject.OTHER[DAILY_QUEST]) {
                    checkbitOtherSpecialElementsAndAddElement(npc, DAILY_QUEST, specialElementsObject.OTHER, npc.getHasDailyQuest());
                }

            }


        }

        let specialElements = {};

        for (let k in specialElementsObject.BITS) {
            specialElements[k] = specialElementsObject.BITS[k];
        }

        for (let kk in specialElementsObject.OTHER) {
            specialElements[kk] = specialElementsObject.OTHER[kk];
        }

        return specialElements;
    };

    this.checkbitPosAndAddElement = function(npc, name, specialElements) {

        let add = npc.checkActionsBitByName(name);
        if (add) specialElements[name].push(npc);
    };

    const checkbitOtherSpecialElementsAndAddElement = (npc, name, specialElements, result) => {
        if (!result) {
            return
        }

        specialElements[name].push(npc);
    };

    this.setSearchElementsFromDivideButtons = function() {
        var search = {
            BITS: {},
            OTHER: {}
        };

        for (var name in NpcData.BITS) {
            if (this.getActive(name)) search.BITS[name] = [];
        }

        const NORMAL_QUEST = EmotionsData.NAME.NORMAL_QUEST;
        const DAILY_QUEST = EmotionsData.NAME.DAILY_QUEST;

        if (this.getActive(NORMAL_QUEST)) search.OTHER[NORMAL_QUEST] = [];
        if (this.getActive(DAILY_QUEST)) search.OTHER[DAILY_QUEST] = [];

        return search;
    };

    this.getActive = function(cl) {
        return this.$.find('.' + cl + '-switch').find('.left').hasClass('active');
    };

    this.drawHero = function(oneTileWidth, oneTileHeight) {
        var h = Engine.hero.d;
        var hero = {
            x: h.x,
            y: h.y,
            name: _t('my_character', null, 'map'),
            cl: 'hero'
        };
        this.drawOneTile([hero], oneTileWidth, oneTileHeight);
    };

    this.setElementsOnMiniMap = function() {
        var w = self.$.find('.mini-local-map').width();
        var h = self.$.find('.mini-local-map').height();
        var x = Engine.map.size.x;
        var y = Engine.map.size.y;
        var oneTileWidth = w / x;
        var oneTileHeight = h / y;
        var listToDraw = {};
        var specialElementsFromNpc = this.getSpecialElementsFromNpc();

        for (var name in specialElementsFromNpc) {
            this.setElements(specialElementsFromNpc[name], listToDraw, name);
        }

        if (this.getActive('gateway')) this.setElements(Engine.map.gateways.getDrawableItems(), listToDraw, 'gateway');

        for (var x in listToDraw) {
            for (var y in listToDraw[x]) {
                var oneTile = listToDraw[x][y];
                this.drawOneTile(oneTile, oneTileWidth, oneTileHeight);
            }
        }
        this.drawHero(oneTileWidth, oneTileHeight);
    };

    this.setElements = function(list, listToDraw, cl) {
        for (var k in list) {
            var x = list[k].d.x;
            var y = list[k].d.y;
            var nick = list[k].d.nick;

            if (!isset(listToDraw[x])) listToDraw[x] = {};
            if (!isset(listToDraw[x][y])) listToDraw[x][y] = [];

            var obj = {
                x: list[k].d.x,
                y: list[k].d.y,
                cl: cl,
                tip: isset(nick) ? nick : list[k].tip.join()
            };
            listToDraw[x][y].push(obj);
        }
    };

    this.drawOneTile = function(oneTile, oneTileWidth, oneTileHeight) {
        for (var i = 0; i < oneTile.length; i++) {
            var obj = oneTile[i];
            var x = obj.x;
            var y = obj.y;
            var tip = obj.tip;
            var iconCl = obj.cl;
            var $iconWrapper = tpl.get('icon-wrapper-map');
            $iconWrapper.find('.emo-npc-icon').addClass(`i-${iconCl}`).tip(tip);
            var $element = self.getWrapperElement(x, y, iconCl);
            $element.find('.border-wrapper').append($iconWrapper);
            var marginL = oneTileWidth < 19 ? (19 - oneTileWidth) / -2 : (oneTileWidth - 19) / 2;
            var marginT = oneTileHeight < 19 ? (19 - oneTileHeight) / -2 : (oneTileHeight - 19) / 2;
            $element.css({
                'left': x * oneTileWidth,
                'top': y * oneTileHeight,
                'margin-left': marginL,
                'margin-top': marginT
            });
        }
    };

    this.getWrapperElement = function(x, y, objCl) {
        var posCl = 'wrapper-x' + x + '-y' + y;
        var $element = self.$.find('.' + posCl);
        var isHero = objCl == 'hero';
        if ($element.length < 1 || isHero) { //hero exception

            $element = tpl.get('element-mini-map').addClass(posCl);

            self.$.find('.mini-local-map').append($element);
        } else {
            $element.find('.border-wrapper').css('display', 'none');
            self.activeHover($element);
        }
        return $element;
    };

    this.activeHover = function($element) {
        if ($element.hasClass('hover-active')) return;
        $element.addClass('more hover-active');
        $element.hover(function() {
            $(this).find('.border-wrapper').css('display', 'inline-block');
            $(this).addClass('hide-more');
        }, function() {
            $(this).removeClass('hide-more');
            $(this).find('.border-wrapper').css('display', 'none');
        });
    };

    this.updateScroll = function() {
        $('.scroll-wrapper', self.$).trigger('update');
    };

    this.createLocalContent = function() {
        var localContent = tpl.get('mini-map-local-content');
        this.$.find('.mini-map-content').append(localContent);
        //for (var k in bitMapFromNpc) {
        for (var k in NpcData.BITS) {
            this.createLocalMapElement(k);
        }

        this.createLocalMapElement(EmotionsData.NAME.NORMAL_QUEST);
        this.createLocalMapElement(EmotionsData.NAME.DAILY_QUEST);

        this.createLocalMapElement('gateway');
        localContent.find('.scroll-wrapper').addScrollBar({
            track: true
        });
    };

    this.createGlobalContent = function() {
        var globalContent = tpl.get('mini-map-global-content');
        this.$.find('.mini-map-content').append(globalContent);
        globalContent.find('.scroll-wrapper').addScrollBar({
            track: true
        });
    };

    this.centerMapOnElement = function($element) {
        dragZoom.centerOn($element[0]); // pass DOM object - not jQuery
    };

    this.createLocationList = function() {
        var $list = [];
        for (var k in mapList) {
            var name = mapList[k].name;
            if (self.hideZapelniacz(name)) continue;
            var $oneLoc = $('<div>').addClass('one-location-on-list').html(escapeHTML(name));
            $oneLoc.attr('id', 'location-id-' + mapList[k].id);
            $list.push($oneLoc);
            $oneLoc.click(function() {
                var id = $(this).attr('id').replace('location-id-', '');
                var $element = self.$.find('#map_id_' + id);
                self.centerMapOnElement($element);
            });
        }

        self.$.find('.mini-map-global-content').find('.scroll-pane').append($list);

        self.$.find('.one-location-on-list').hover(
            function() {
                var id = $(this).attr('id').replace('location-id-', '');
                self.$.find('#map_id_' + id).addClass('mark');
            },
            function() {
                var id = $(this).attr('id').replace('location-id-', '');
                self.$.find('#map_id_' + id).removeClass('mark');
            }
        );
        self.updateScroll();
    };

    this.hideZapelniacz = function(name) {
        return /zape.niacz/.test(name.toLowerCase());
    };

    this.initSearch = function() {
        var $searchInput = this.$.find('.search'),
            $searchX = this.$.find('.search-x');
        $searchInput.keyup(function() {
            var v = $(this).val();
            var $allLocation = self.$.find('.one-location-on-list');
            if (v == '') $allLocation.css('display', 'block');
            else {
                $allLocation.each(function() {
                    var txt = ($(this).html()).toLowerCase();
                    var disp = txt.search(v.toLowerCase()) > -1 ? 'block' : 'none';
                    $(this).css('display', disp);
                    self.updateScroll();
                });
            }
        });
        $searchInput.attr('placeholder', _t('search'));

        $searchX.on('click', function() {
            $searchInput.val('')
                .blur()
                .trigger('keyup');
        });
    };

    this.getMapUrl = () => {

        let which = isPl() ? 'ni' : 'en';
        return CFG.a_vpath + 'minimap-' + which + '.png';
    };

    this.setSizeAndBckGlobalMap = () => {

        self.$.find('.mini-global-map').css({

        });
        const mapImg = $('<img />', {
            class: 'world-map',
            src: this.getMapUrl(),
        });
        self.$.find('.mini-global-map').append(mapImg);
    };

    this.updateGlobalMap = (data) => {
        if (globalMapLoaded) return;

        Engine.imgLoader.onload(this.getMapUrl(), false, false, (i) => {
            mapWidth = i.width;
            mapHeight = i.height;
            globalMapLoaded = true;
            mapList = {};

            self.setSizeAndBckGlobalMap();
            self.loadMapList(data);
            self.createLocationList();
            self.createMyLocMarker();
            self.showMyLoc();
        });

    };

    this.createMyLocMarker = function() {
        var $marker = $('<div>').addClass('hero-is-here').tip(_t('you_are_here', null, 'map') + '<br>' + Engine.map.d.name);
        self.$.find('.mini-global-map').append($marker)
    };

    this.loadMapList = function(data) {
        var coords = data.split(';');
        var $mapTips = [];
        for (var k in coords) {
            var c = coords[k].split(',');

            let id = parseInt(c[0]);

            mapList[id] = {
                id: id,
                name: c[1],
                x: parseInt(c[2]),
                y: parseInt(c[3]),
                width: parseInt(c[4]),
                height: parseInt(c[5])
            };

            var $oneLocationOnMap = tpl.get('one-location-on-map');
            $oneLocationOnMap.attr('id', 'map_id_' + c[0]);
            $oneLocationOnMap.tip(c[1], 't_static');
            $oneLocationOnMap.css({
                left: parseInt(c[2]),
                top: parseInt(c[3]),
                width: parseInt(c[4]),
                height: parseInt(c[5])
            });
            $mapTips.push($oneLocationOnMap);
            self.createMouseEvents($oneLocationOnMap, id);
        }
        mapList = this.sortMapList(mapList);
        self.$.find('.mini-global-map').append($mapTips);
    };

    this.sortMapList = (data) => {
        return Object.values(data).sort((a, b) =>
            a.name.localeCompare(b.name) // sort alphabetically
        );
    };

    this.createMouseEvents = ($oneLocationOnMap, id) => {
        $oneLocationOnMap.hover(
            function() {
                var id = $(this).attr('id').replace('location-id-', '');
                self.$.find('#' + id).addClass('mark');
            },
            function() {
                var id = $(this).attr('id').replace('location-id-', '');
                self.$.find('#' + id).removeClass('mark');
            }
        );
        $oneLocationOnMap.on('click', function() {
            let dis = [0, 4, 32];

            if (dis.includes(Engine.hero.d.uprawnienia)) return;

            _g('gm&a=teleport&target=' + id, function(v) {
                Engine.interface.checkTeleport(v);
            });
        })
    }

    this.showMyLoc = function() {
        if (!mapList) return;
        var mainId = Engine.map.d.mainid;
        var id = mainId == 0 ? Engine.map.d.id : mainId;
        var obj = mapList.find(x => x.id === id);
        if (!obj) return self.$.find('.hero-is-here').css('display', 'none');
        self.centerMapOnElement(self.$.find('#map_id_' + id));
        self.$.find('.hero-is-here').css({
            left: obj.x,
            top: obj.y,
            width: obj.width,
            height: obj.height,
            display: 'block'
        });
    };

    this.createLocalMapElement = function(cl) {
        var mapElement = tpl.get('local-map-element').addClass(cl + '-switch');
        this.$.find('.mini-map-local-content').find('.scroll-pane').append(mapElement);
        mapElement.find('.label').html(_t('place-' + cl, null, 'mini-map'));
        mapElement.find('.emo-npc-icon').addClass(`i-${cl}`);
        this.createDivideButtons(mapElement.find('.toggle'), cl);
    };

    this.createDivideButtons = function($par, cl) {
        var $div = $('<div>');
        $par.append($div);
        var t = [{
                'text': _t('yes'),
                'val': '0'
            },
            {
                'text': _t('no'),
                'val': '1'
            }
        ];
        // var s = Store.get('miniMapController/' + cl + '/state');
        var s = StorageFuncMiniMapController.getStateByKind(cl);
        if (s === null) {
            // Store.set('miniMapController/' + cl + '/state', true);
            StorageFuncMiniMapController.setStateByKind(cl, true);
            s = true;
        }
        $div.createDivideButton(t, 0, false, function(v) {
            self.clearElements();
            self.setElementsOnMiniMap();
            //Store.set('miniMapController/' + cl + '/state', parseInt(v) ? false : true);
            let value = parseInt(v) ? false : true;
            StorageFuncMiniMapController.setStateByKind(cl, value);
        });
        var $options = $div.find('.option');
        $options.eq(s ? 0 : 1).addClass('active');
    };

    this.clearElements = function() {
        self.$.find('.mini-local-map').find('.element').remove();
    };

};