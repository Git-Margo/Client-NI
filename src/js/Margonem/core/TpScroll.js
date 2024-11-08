var tpl = require('core/Templates');
module.exports = function() {
    var self = this;
    var content;
    var loadedMaps = [];
    var activeIdMapChoice = null;
    var activeCoordsChoice = null;
    this.itemId;
    this.data = {};
    this.wnd = null;
    self.scale = null;

    this.init = function() {
        this.initWindow();
        this.modifyContent();
        this.initSearch();
        this.initScroll();
    };

    this.initWindow = function() {
        content = tpl.get('divide-panel').addClass('tp-scroll');

        Engine.windowManager.add({
            content: content,
            //nameWindow        : 'tpScroll',
            nameWindow: Engine.windowsData.name.TP_SCROLL,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('kcs_set'),
            onclose: () => {
                self.close();
            }
        });

        this.wnd.addToAlertLayer();
        this.wnd.center();
    };

    this.updateScroll = function() {
        $('.scroll-wrapper', self.wnd.$).trigger('update');
    };

    this.initScroll = function() {
        self.wnd.$.find('.left-column').find('.scroll-wrapper').addScrollBar({
            track: true
        });
    };

    this.initSearch = function() {
        var $search = this.wnd.$.find('.search-item'),
            $searchX = this.wnd.$.find('.search-x');
        $search.keyup(function() {
            var v = $(this).val();
            var $allItems = self.wnd.$.find('.divide-list-group');
            if (v == '') $allItems.css('display', 'block');
            else {
                $allItems.each(function() {
                    var txt = ($(this).find('.label').html()).toLowerCase();
                    var disp = txt.search(v.toLowerCase()) > -1 ? 'block' : 'none';
                    $(this).css('display', disp);
                });
            }
            self.updateScroll();
        });
        $search.attr('placeholder', _t('search'));

        $searchX.on('click', function() {
            $search.val('')
                .blur()
                .trigger('keyup');
        });
    };

    this.update = function(v) {
        this.itemId = v.item_id;
        this.data = v.targets;
        const cities = [];
        for (const idMap in this.data) {
            const mapName = this.data[idMap].n;
            const $oneCity = tpl.get('divide-list-group').addClass('city-' + idMap);
            $oneCity.find('.label').text(mapName);
            $oneCity.on('click', () => this.onClickEvent(idMap));

            cities.push($oneCity);
        }

        this.appendCityToWrapper(cities);
        this.updateScroll();
        this.openCurrentLocation();
    };

    this.appendCityToWrapper = function(cities) {
        if (cities.length > 0) {
            cities.sort(function(a, b) {
                var nA = a.find('.label').text().toLowerCase()[0];
                var nB = b.find('.label').text().toLowerCase()[0];
                return nA < nB ? -1 : nA > nB;
            });
            var $cityWrapper = this.wnd.$.find('.left-scroll').find('.scroll-pane');
            for (var i = 0; i < cities.length; i++) {
                $cityWrapper.append(cities[i]);
            }
        }
    };

    this.modifyContent = function() {
        var $wrapper = $('<div>').addClass('mini-map-wrapper');
        var $positioner = $('<div>').addClass('mini-map-positioner');
        $wrapper.append($positioner);
        self.wnd.$.find('.right-scroll').find('.scroll-pane').append($wrapper);

        var $cityName = $('<div>').addClass('city-name');
        self.wnd.$.find('.left-column-header').html(_t('loc'));
        self.wnd.$.find('.right-column-header').append($cityName);

        var $cityBufferWrapper = $('<div>').addClass('city-buffer-wrapper');
        var $cityBuffer = $('<div>').addClass('city-buffer');
        $cityBufferWrapper.append($cityBuffer);
        self.wnd.$.find('.right-column').append($cityBufferWrapper);

        var $btn = tpl.get('button').addClass('set-tp-stone small green disable');
        $btn.find('.label').html(_t('set_tp'));
        self.wnd.$.find('.bottom-part').append($btn);

        $btn.click(function() {
            const [x, y] = activeCoordsChoice;

            _g('moveitem&st=2&id=' + self.itemId + '&town_id=' + activeIdMapChoice + '&town_x=' + x + '&town_y=' + y, function() {
                self.close();
            });
        });
    };

    this.cordEvents = function($cord, idMap, idTp) {
        $cord.hover(function() {
            self.wnd.$.find('.cord-' + idTp).addClass('hover');
        }, function() {
            self.wnd.$.find('.cord-' + idTp).removeClass('hover');
        });
        $cord.click(function(e) {
            self.wnd.$.find('.cords').removeClass('active');
            self.wnd.$.find('.cord-' + idTp).addClass('active');

            self.wnd.$.find('.one-item-on-divide-list').removeClass('active');
            self.wnd.$.find('.city-' + idMap).find('.cord-list-' + idTp).addClass('active');
            self.setChoice(idMap, $cord.data('coords'));
            e.stopPropagation();
        });
        self.wnd.$.on('click', `.cord-${idTp}.map-${idMap}`, function() {
            self.wnd.$.find(`.city-${idMap} .cord-list-${idTp}`).click();
        });
    };

    this.resetChoice = function() {
        activeIdMapChoice = null;
        activeCoordsChoice = null;
        self.wnd.$.find('.set-tp-stone').addClass('disable');
    };

    this.setChoice = function(idMap, coords) {
        activeIdMapChoice = idMap;
        activeCoordsChoice = coords;
        self.wnd.$.find('.set-tp-stone').removeClass('disable');
    };

    this.showHideBuffer = function(show) {
        self.wnd.$.find('.city-buffer-wrapper').css('display', show ? 'block' : 'none');
    };

    this.onClickEvent = (id) => {
        const $city = this.wnd.$.find(`.city-${id}`)
        if ($city.hasClass('active')) {
            $city.removeClass('active');
            return;
        }
        _g('moveitem&st=1&id=' + this.itemId + '&locationId=' + id);
    };

    this.openCurrentLocation = () => {
        const currentMapId = Engine.map.d.id;
        if (isset(this.data[currentMapId])) {
            this.onClickEvent(currentMapId);
            const scrollPos = this.checkCityTabPosition(currentMapId);
            $('.scroll-wrapper', self.wnd.$).trigger('setScroll', scrollPos);
        }
    };

    this.checkCityTabPosition = (id) => self.wnd.$.find(`.left-scroll .city-${id}`).position().top;

    this.showLocation = (data) => {
        const $group = self.wnd.$.find(`.left-column .city-${data.id}`);
        this.createCords($group, data.coords, data.id)
        this.activeGeoupItem($group)

        let url = CFG.a_mpath + data.file;

        if (loadedMaps.indexOf(data.name) < 0) self.showHideBuffer(true);
        self.wnd.$.find('.one-item-on-divide-list').removeClass('active');
        self.resetChoice();
        this.updateScroll();
        Engine.imgLoader.onload(url, false, (i) => {
            fixCorsForTaintedCanvas(i);
        }, (i) => {
            self.afterOnload(i, data);
        });
    }

    this.createCords = ($oneCity, allCords, idMap) => {
        var $cords = $oneCity.find('.group-list');
        $cords.html('');

        for (var idCord = 0; idCord < allCords.length; idCord++) {
            var cords = allCords[idCord];
            var $oneCord = tpl.get('one-item-on-divide-list').addClass('cord-list-' + idCord);
            $oneCord.find('.name').html(cords[0] + ', ' + cords[1]);
            $oneCord.data('coords', cords);
            $cords.append($oneCord);
            this.cordEvents($oneCord, idMap, idCord);
        }
    }

    this.afterOnload = (i, data) => {
        var $positioner = self.wnd.$.find('.mini-map-positioner').empty();
        self.setMapBackground(data, i.width, i.height, $positioner);

        loadedMaps.push(data.name);

        for (var c = 0; c < data.coords.length; c++) {
            var cords = data.coords[c];
            var $cords = $('<div>').addClass(`cords cord-${c} map-${data.id}`).tip(cords[0] + ', ' + cords[1]);

            $positioner.append($cords);
            self.setCords($cords, cords);
        }
        self.showHideBuffer(false);
    };

    this.setMapBackground = function(data, w, h, $positioner) {
        var x = w / 32;
        var y = h / 32;
        var size = {
            x: x,
            y: y
        };

        self.wnd.$.find('.city-name').html(data.name);
        self.setScale(size);

        $positioner.css({
            'background': 'url(' + CFG.a_mpath + data.file + ') no-repeat',
            'width': size.x * self.scale + 'px',
            'height': size.y * self.scale + 'px',
            'background-size': 'contain'
        });
    };

    this.activeGeoupItem = function($clicked) {
        var active = $clicked.hasClass('active');
        self.wnd.$.find('.divide-list-group').removeClass('active');
        if (!active) $clicked.addClass('active');
    };

    this.setCords = function($obj, cords) {
        $obj.css('left', (self.scale * cords[0]) + 'px');
        $obj.css('top', (self.scale * cords[1]) + 'px');
    };

    this.setScale = function(size) {
        var miniMapWrapper = self.wnd.$.find('.mini-map-wrapper');
        var ratio = miniMapWrapper.width() / miniMapWrapper.height();
        self.scale = size.x > size.y * ratio ? miniMapWrapper.width() / size.x : miniMapWrapper.height() / size.y;
    };

    this.close = function() {
        //self.wnd.$.remove();
        self.wnd.remove();
        delete this.data;
        // delete (self.wnd);
        Engine.tpScroll = false;
        //delete(self);
    };

    //this.init();

};