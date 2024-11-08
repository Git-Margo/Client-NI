// var wnd = require('core/Window');
var tpl = require('core/Templates');

module.exports = function() {

    this.result = [];

    var self = this,
        $content = tpl.get('conquer-stats');

    this.initWindow = function() {
        let header = _t('conquer_loc_stats', null, 'map');
        // this.wnd = new wnd({
        // 	content: $content,
        // 	title: _t('conquer_title'),
        // 	onclose: function () {
        // 		self.close();
        // 	}
        // });
        //$('.alerts-layer').append(this.wnd.$);
        //this.wnd.center();

        Engine.windowManager.add({
            content: $content,
            title: _t('conquer_title'),
            //nameWindow        : 'conquer-stats',
            nameWindow: Engine.windowsData.name.CONQUER_STATS,
            objParent: this,
            nameRefInParent: 'wnd',
            onclose: () => {
                this.close();
            }
        });

        this.wnd.show();
        this.wnd.addToAlertLayer();
        this.wnd.center();
        // this.wnd.$.show();
        this.wnd.$.find('.edit-header-label').text(header);
        this.initScroll();
    };

    this.init = function(data) {
        if (isset(self.wnd)) return;
        this.initWindow();
        this.initSearch();
        this.parseDataToJson(data);
        this.createList();
    };

    this.parseDataToJson = (data) => {
        if (data.length > 0) {
            data = data.split('|');
            for (var i = 0; i < data.length; i += 4) {
                var conquer = /m|t|b/.test(Engine.hero.d.prof) ? parseInt(data[i + 3]) * -1 : parseInt(data[i + 3]);
                this.result.push({
                    id: parseInt(data[i]),
                    pId: parseInt(data[i + 1]),
                    name: data[i + 2],
                    c: parseInt(conquer)
                });
            }
            this.result.sort(function(e1, e2) {
                return e2.c - e1.c;
            });
        }
    };

    this.createList = function() {
        let items = this.result;
        let $list = this.wnd.$.find('.conquer-stats-items');
        if (items.length < 1) {
            $list.text(_t('no_data', null, 'map'));
            return;
        }
        for (let item of items) {
            let $one = tpl.get('conquer-stat-one'),
                color = this.getPercentColor(item.c);

            $one.find('.map-name').text(item.name);
            $one.find('.rep-percent').text(item.c + '%').css('color', color);
            $one.tip(this.getTip(item));
            this.setProgressValue($one, item.c);
            $list.append($one);
        }
        this.updateScroll();
    };

    this.setProgressValue = function($one, value) {
        let side = value < 0 ? 'left' : 'right';
        value = Math.abs(value) == 100 ? 99 : Math.abs(value);
        $one.find(`.pb-fifty__one--${side} .progress`).css('width', Math.abs(value) + '%');
    };

    this.getPercentColor = function(value) {
        let color = 'white';
        if (value < 0) {
            color = '#de434a';
        } else if (value > 0) {
            color = '#1aba5c';
        }
        return color;
    };

    this.getTip = function(data) {
        var multiplier = 1 + (data.c / 100) * 3;
        if (data.c < 0) {
            return _t('loc_lost %val% %exp%', {
                '%val%': Math.abs(data.c),
                '%exp%': roundNumber(multiplier, 2)
            }, 'map'); //'Lokacja stracona w: '+Math.abs(e.c)+'% <br />Zmniejszenie doÅwiadczenia: '+roundNumber(multiplier,2)+'x';
        } else {
            return _t('loc_conquer %val% %exp%', {
                '%val%': data.c,
                '%exp%': roundNumber(multiplier, 2)
            }, 'map'); //'Lokacja podbita w: '+e.c+'% <br />ZwiÄkszenie doÅwiadczenia: '+roundNumber(multiplier,2)+'x';
        }
    };

    this.initSearch = function() {
        var $searchInput = this.wnd.$.find('.search'),
            $searchX = this.wnd.$.find('.search-x');
        $searchInput.keyup(function() {
            var v = $(this).val();
            var $allQuests = self.wnd.$.find('.conquer-stat-one');
            if (v === '') {
                $allQuests.css('display', 'block');
                self.updateScroll();
            } else {
                $allQuests.each(function() {
                    var txt = ($(this).find('.map-name').html()).toLowerCase();
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

    this.initScroll = function() {
        self.wnd.$.find('.scroll-wrapper').addScrollBar({
            track: true
        });
    };

    this.updateScroll = function() {
        $('.scroll-wrapper', self.wnd.$).trigger('update');
    };

    this.close = function() {
        //self.wnd.$.remove();
        // self.wnd.remove();
        self.wnd.remove();
        Engine.conquerStats = false;
        // delete (self.wnd);
        //delete (self);
    };

    //this.init();
};