let tpl = require('@core/Templates');
module.exports = function() {
    var self = this;
    var content;
    var intervals = {};
    var tileWidth = 134;
    var tileNewsGraphWidth = 402;
    var globalBckUrl;
    var getTimePromo;
    var banerInterval;
    var newsCurrentIndex = 0;

    this.leftPromo = 0; // sory  ['left' + kind] ['leftPromo']
    this.leftNews = 0;
    this.$pagination = null;
    this.newsLength = null;

    this.wnd = null;

    this.init = function() {
        this.initWindow();
        this.getNews();
        this.initFetch();
        this.initArrows();
        clearNewsWidgetNotice();
    };

    const clearNewsWidgetNotice = () => {
        //Engine.widgetManager.setTypeInDefaultWidgetSet(Engine.widgetsData.name.NEWS, Engine.widgetsData.type.VIOLET);
        //Engine.widgetManager.rebuildWidgetButtons();
        Engine.widgetManager.updateOneWidgetNoticeProcedure(Engine.widgetsData.name.NEWS, Engine.widgetsData.type.VIOLET)
    }

    this.connectEvents = () => {
        $(document).on('click', '.news-section .news-pagination-item', this.paginationOnClick.bind(this));
        content.find('.left-news-btn').on('click', this.newsPrev.bind(this));
        content.find('.right-news-btn').on('click', this.newsNext.bind(this));
    };

    this.initArrows = function() {
        content.find('.left-arrow').click(function() {
            self.updatePosition(true, '.for-you', tileWidth, 'Promo');
        });
        content.find('.right-arrow').click(function() {
            self.updatePosition(false, '.for-you', tileWidth, 'Promo');
        });
    };

    this.initPagination = () => {
        this.$pagination = content.find('.news-pagination');
        for (let i = 0; i < self.newsLength; i++) {
            let $el = $('<div class="news-pagination-item" />');
            if (i === 0) {
                $el.addClass('active');
            }
            this.$pagination.append($el);
        }
    };

    this.paginationOnClick = (e) => {
        let $target = $(e.currentTarget),
            index = $target.index();

        this.goTo(index);
    };

    this.paginationUpdate = (index) => {
        let $activePaginationItem = this.$pagination.find(`.news-pagination-item:eq(${index})`);
        $activePaginationItem
            .addClass('active')
            .siblings('.news-pagination-item')
            .removeClass('active');
    };

    this.goTo = (index) => {
        let $wrapper = content.find('.news-section-overflow'),
            newPosition = -(index * tileNewsGraphWidth);

        self.paginationUpdate(index);
        newsCurrentIndex = index;
        $wrapper.css('left', newPosition);
        self.setIntervalNews();
    };

    this.setIntervalNews = () => {
        if (banerInterval) {
            clearInterval(banerInterval);
        }
        let length = self.newsLength;
        if (length <= 1) return;
        banerInterval = setInterval(function() {
            newsCurrentIndex++;
            let nextSlide = newsCurrentIndex >= length ? 0 : newsCurrentIndex;
            self.goTo(nextSlide);
        }, 5000);
    };

    this.newsNext = () => {
        newsCurrentIndex++;
        let nextSlide = newsCurrentIndex >= self.newsLength ? 0 : newsCurrentIndex;
        self.goTo(nextSlide);
    };

    this.newsPrev = () => {
        newsCurrentIndex--;
        let prevSlide = newsCurrentIndex < 0 ? self.newsLength - 1 : newsCurrentIndex;
        self.goTo(prevSlide);
    };

    this.initFetch = function() {
        // Engine.tpls.fetch('o', self.newPackItem);
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_PACK_TPL, self.newPackItem);
    };

    this.newPackItem = function(item) {
        var $items = Engine.news.wnd.$.find('.offer-' + item.id);
        $items.each(function() {
            //var $clone = item.$.clone();
            var $clone = Engine.tpls.createViewIcon(item.id, Engine.itemsViewData.NEWS_VIEW, 'o')[0];
            var serwerAmount = $(this).attr('data-amount');
            Engine.tpls.changeItemAmount(item, $clone, serwerAmount);
            $(this).append($clone);
            $clone.attr('data-tip-type', item.$.data('tipType'));
            $clone.attr('data-item-type', item.$.data('itemType'));
            $clone.data('item', item);
            $clone.contextmenu(function(e, mE) {
                //item.createOptionMenu(getE(e, mE), false, {canPreview:true});
                item.createOptionMenu(getE(e, mE), false);
            });
        });
    };

    this.createNewsText = function(data) {
        var $msg = self.wnd.$.find('.news-section-overflow').html(parseNewsBB(data.replace(/\\/gi, '')));
        self.newsLength = $msg.find("a").children().length;
        self.wnd.$.find('.news-section-overflow').css('width', self.newsLength * tileNewsGraphWidth);
        self.wnd.$.find('.news-graph-arrow').css('display', self.newsLength > 1 ? 'block' : 'none');
        self.connectEvents();
        self.setIntervalNews();
        self.initPagination();
    };

    this.initWindow = function() {
        //var title = _t('news', null, 'news');
        content = tpl.get('news-panel');
        //content.find('.news-panel-label').html(title);
        //this.wnd = new wnd({
        //	content: content,
        //	title: title,
        //	onclose: function () {
        //		self.close();
        //	}
        //});


        Engine.windowManager.add({
            content: content,
            title: _t('news', null, 'news'),
            //nameWindow        : 'news',
            nameWindow: Engine.windowsData.name.NEWS,
            widget: Engine.widgetsData.name.NEWS,
            objParent: this,
            nameRefInParent: 'wnd',
            onclose: () => {
                this.close();
            }
        });
        this.wnd.addToAlertLayer();
        //$('.alerts-layer').append(this.wnd.$);
        this.wnd.center();
        this.wnd.show();
    };

    this.getNews = function() {
        var url = 'https://forum.margonem.pl/ajax/premiumnews.php';
        $.ajax({
            url: url,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function(response) {
                var data = JSON.parse(response);
                self.createNewsText(data);
                //self.updateScroll();
            },
            error: function(response) {
                console.log('error', response);
            }
        });
    };

    // this.getSecondLeft = function (time, opt) {
    // 	var m = Math.floor(time / 60);
    // 	var h = Math.floor(m / 60);
    // 	var d = Math.floor(h / 24);
    //
    // 	var secondLeft = (time - m * 60);
    // 	var minutesLeft = m - h * 60;
    // 	var hoursLeft = h - d * 24;
    //
    // 	if (opt && opt.short) {
    // 		if (d == 0 && h == 0) return minutesLeft + 'm : ' + secondLeft + 's';
    // 		if (d == 0)           return hoursLeft + 'h : ' + minutesLeft + 'm';
    // 		return d + 'd : ' + hoursLeft + 'h';
    // 	}
    // 	return d + 'd : ' + hoursLeft + 'h : ' + minutesLeft + 'm : ' + secondLeft + 's';
    // };

    this.updateChanged = function(data) {
        for (var k in data) {
            if (data[k].is_used) this.setTileUsed(data[k].id);
        }
    };

    this.setTileUsed = function(id) {
        self.wnd.$.find('.promo-tile-id-' + id).addClass('is-used');
    };

    this.update = function(v) {
        var $wrapper = content.find('.news-for-you-section').find('.for-you');
        var data = v.active;
        this.updateGlobalBackground(v.background);
        getTimePromo = true;

        var count = this.getContLocalAndGlobalPromo(data);
        var kind = count.global > 2 ? 'small' : 'big';
        var width = count.local * tileWidth;

        this.showOrHideArrows(count.local);

        var count = 1;
        //for (var k in data) {
        for (var i = 0; i < data.length; i++) {
            var rec = data[i];
            if (rec.is_personal == 1) this.createClassicTile(rec);
            else {
                this.createTimePromoTile(rec, kind, count);
                count++;
            }
        }

        $wrapper.css('left', 0);
        $wrapper.css('width', width + 'px');
    };

    this.showOrHideArrows = function(count) {
        var display = count > 3 ? 'block' : 'none';
        self.wnd.$.find('.news-arrow').css('display', display);
    };

    this.getContLocalAndGlobalPromo = function(data) {
        var countLocal = 0;
        var countGlobal = 0;
        //for (var k in data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].is_personal == 1) countLocal++;
            else countGlobal++;
        }
        return {
            local: countLocal,
            global: countGlobal
        }
    };

    this.updateGlobalBackground = function(bck) {
        if (!isset(bck)) {
            console.error('[News.js, updateGlobalBackground] News: no promo background from engine');
            return;
        }
        var image = 'url(' + window.cdnUrl + '/obrazki/promocje/' + bck + ')'; //TODO: we should add this url to window.CFG
        globalBckUrl = image;
        self.wnd.$.find('.time-promo-background').css('background', image);
    };

    this.createClassicTile = function(rec) {
        var id = rec.id;
        var image = 'url(' + window.cdnUrl + '/obrazki/promocje/' + rec.image + ')'; //data[k].image; 'spr4.png' //TODO: we should add this url to window.CFG
        var $tile = tpl.get('news-classic-tile').addClass('promo-tile-id-' + id);
        var short = isset(rec.lvl_max) && isset(rec.seconds_left);
        var price = isset(rec.price) ? rec.price : 0;

        $tile.find('.tile-background').css('background', image);
        $tile.find('.title-bck').css('background', image + '0 -167px');
        $tile.find('.graphic-bck').css('background', image + '0 -209px');
        $tile.find('.buy-info').html(price + _t('sl', null, 'clan'));
        if (rec.lvl_max) $tile.find('.requires-level').html('Max Lvl: ' + rec.lvl_max + (short ? ' | ' : ''));

        var $buy = tpl.get('button').addClass('small purple');
        $buy.find('.label').html(_t('buy_promo'));
        $tile.find('.buy-button-wrapper').append($buy);
        $buy.click(function() {
            self.usePromoId(rec.id);
        });



        this.createSlotsOnItems($tile, rec.offer);
        this.setInterval(id, rec.seconds_left, $tile, short);

        content.find('.news-for-you-section').find('.for-you').append($tile);

        if (rec.is_used) this.setTileUsed(id);
    };

    this.createTimePromoTile = function(rec, kind, count) {
        var id = rec.id;
        var $tile = tpl.get('news-time-promo-tile').addClass(kind).addClass('promo-tile-id-' + id);
        //var image = 'url(../img/gui/spr5.png)'; //globalBckUrl
        var image = globalBckUrl;
        var position = kind == 'big' ? '0px -381px' : '-85px -381px';
        var buttonPosition = kind == 'big' ? ['-85px -493px', '-85px -530px'] : ['-85px -567px', '-85px -596px'];
        var price = isset(rec.price) ? rec.price : 0;

        $tile.find('.tile-background').css('background', image);
        $tile.find('.tile-background').css('background-position', position);
        $tile.find('.title-time-promo-tile').html('Pakiet ' + count); //rec.name
        $tile.find('.price-time-promo-tile').html(price + ' ' + _t('sl', null, 'clan'));

        //var $buy = $('<div>').addClass('buy-button').css({
        var $buy = tpl.get('buy-button-news').css({
            'background': image,
            'background-position': buttonPosition[0]
        });
        $buy.hover(function() {
            $buy.css('background-position', buttonPosition[1])
        }, function() {
            $buy.css('background-position', buttonPosition[0])
        });
        //$buy.append($('<div>').html(_t('buy_promo')).addClass('label'));
        $buy.append(tpl.get('label-news').html(_t('buy_promo'))); //.addClass('label'));
        $tile.find('.buy-button-wrapper').append($buy);

        $buy.click(function() {
            self.usePromoId(id);
        });

        this.createSlotsOnItems($tile, rec.offer, [image, '-147px -381px']);
        self.wnd.$.find('.package-wrapper').append($tile);

        if (rec.is_used) this.setTileUsed(id);
        if (getTimePromo) {
            getTimePromo = false;
            var $con = self.wnd.$.find('.news-time-promo-section');
            this.setInterval(id, rec.seconds_left, $con);
        }
    };

    this.usePromoId = function(id) {
        _g('promotions&a=use&id=' + id)
    };

    this.updatePosition = function(next, wrapperContentSelector, widthOneElement, kind) {
        var $wrapper = content.find(wrapperContentSelector);
        var w = parseInt($wrapper.css('width'));
        var wOverflow = parseInt($wrapper.parent().width());
        var nextTileNotExist = false;
        var index;

        var key = 'left' + kind; //		this.leftNews orn this.leftPromo

        if (next) self[key] += widthOneElement;
        else self[key] -= widthOneElement;

        if (self[key] > 0) self[key] = 0;
        if (Math.abs(self[key]) > w - wOverflow) {
            self[key] = -(w - wOverflow);
            nextTileNotExist = true;
        }
        index = Math.abs(self[key] / wOverflow);
        self.paginationUpdate(index);

        $wrapper.css('left', self[key]);


        return nextTileNotExist;
    };

    this.setInterval = function(id, time, $tile, short) {
        if (intervals[id]) this.clearInterval(id);
        var t = time;
        if (!isset(time)) return;
        $tile.find('.requires-text').html(getSecondLeft(t, {
            short
        }));
        if (t == 0) return;
        intervals[id] = setInterval(function() {
            if (t == 0) self.clearInterval(id);
            $tile.find('.requires-text').html(getSecondLeft(t--, {
                short
            }));
        }, 1000);
    };

    this.clearInterval = function(id) {
        clearInterval(intervals[id]);
        intervals[id] = null;
        delete intervals[id];
    };

    this.createSlotsOnItems = function($tile, offer, timeBackground) {
        for (var i = 0; i < offer.length; i++) {
            var rec = offer[i];
            var id = rec[0];
            var amount = rec[1];
            //var $slot = $('<div>').addClass('item-slot offer-' + id);
            var $slot = tpl.get('item-slot').addClass('offer-' + id);
            if (timeBackground) $slot.css({
                'background': timeBackground[0],
                'background-position': timeBackground[1]
            });
            $slot.attr('data-amount', amount);
            $tile.find('.tile-items-wrapper').append($slot);
        }
    };


    this.close = function() {
        for (var i in intervals) {
            this.clearInterval(i);
        }
        intervals = {};
        //delete intervals
        if (banerInterval) {
            clearInterval(banerInterval);
            banerInterval = null;
        }
        //self.wnd.$.remove();
        self.wnd.remove();
        // Engine.tpls.removeCallback('o', self.newPackItem);
        Engine.tpls.removeCallback(Engine.itemsFetchData.NEW_PACK_TPL);
        Engine.tpls.deleteMessItemsByLoc('o');
        //delete (self.wnd);
        Engine.news = false;
        //delete(self);
    };

    //this.init();

};