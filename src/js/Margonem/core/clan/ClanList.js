// var wnd = require('@core/Window');
var tpl = require('@core/Templates');
module.exports = function(Par) {
    var self = this;
    var content;
    var currentPage;
    var clansCount;
    var clansPerPage;
    var canLoadNextPage;
    var sortColum = 0;
    var normalSort = true;
    var maxPage;
    var timeOut = null;

    this.update = function(data) {
        currentPage = data.cur_page;
        clansCount = data.clans_count;
        clansPerPage = data.clans_per_page;
        maxPage = data.max_page;

        var l = data['id'].length;
        var $tableHeader = content.find('.clan-list-table-header');
        var $table = content.find('.clan-list-table');
        if (currentPage == 1) {
            $tableHeader.empty();
            $table.empty();
            canLoadNextPage = true;
        }
        if (currentPage == maxPage) canLoadNextPage = false;

        for (var i = 0; i < l; i++) {
            var id = data['id'][i];
            //var $logo =				this.createLogo(data['logo'][i]);
            var clName = data['name'][i];
            var $name = $('<span/>', {
                text: clName
            });
            //var add = 				$logo.add($name);
            var power = data['level'][i];
            var members = data['members_count'][i];
            var attributes = data['attributes'][i];
            var minLev = ((data['attributes'][i] >> 2) & 31) * 10;
            //var maxLev =		  ((data['attributes'][i] >> 7) & 31) * 10;
            var maxLev = 300 - (((data['attributes'][i] >> 7) & 31) * 10);
            var recruit = this.getRectruit(data['attributes'][i], id, minLev, maxLev);
            var cl = 'normal-td';
            var $tr = Par.createRecords(
                [$name, power, members, minLev, recruit],
                ['clan-name-td ' + cl, 'clan-lvl-td ' + cl, 'clan-members-td ' + cl, 'clan-minlvl-td ' + cl, cl]
            );
            $tr.addClass('hover one-clan-tr clan-id-' + id);
            self.trClick($tr, id);
            self.addIdToMyClan($tr, clName);
            $table.append($tr);
            $('.scroll-wrapper', content).trigger("updateBarPos");
            //$('.scroll-wrapper', content).trigger('update');
        }
        if (currentPage == 1) {
            var header = this.createTabHeaderClanList();
            $tableHeader.prepend(header);
            this.createHeaderSortButtons();
            $('.scroll-wrapper', content).trigger('update');
        }
    };

    this.getGetNextPage = function() {
        if (!canLoadNextPage) return;
        $('.scroll-wrapper', content).trigger("stopDragBar");
        self.sendRequest(currentPage + 1);
    };

    this.getRectruit = function(attr, id, minLev, maxLev) {
        let v = ((attr >> 21) & 3);
        if (v == 0) return _t('close_recruit');
        else {
            let tip;
            let heroLvl = getHeroLevel();
            let toLowLev = heroLvl < minLev ? true : false;
            let inClan = typeof Engine.hero.d.clan !== 'undefined' ? true : false;

            let toHighLev;
            if (maxLev == 300 && heroLvl > 300) toHighLev = false;
            else toHighLev = heroLvl > maxLev ? true : false;

            var btnClasses = toLowLev || toHighLev || inClan ? 'inactive' : '';
            var $btn = tpl.get('button').addClass('small green ' + btnClasses);
            if (inClan) {
                tip = _t('in_clan', null, 'clan');
            } else if (toHighLev) {
                tip = _t('to_high_lvl', null, 'clan');
            } else if (toLowLev) {
                tip = _t('to_low_lvl', null, 'clan');
            }
            $btn.tip(tip);
            if (v == 2) {
                $btn.find('.label').html(_t('Join_now'));
                if (!toLowLev && !toHighLev && !inClan) {
                    $btn.click(function(e) {
                        e.stopPropagation();
                        _g('clan&a=join&id=' + id, function() {
                            Par.close();
                        });
                    });
                }
            } else {
                $btn.find('.label').html(_t('Apply_now'));
                if (!toLowLev && !toHighLev && !inClan) {
                    $btn.click(function(e) {
                        e.stopPropagation();
                        _g('clan&a=apply&id=' + id)
                    });
                }
            }
            return $btn;
        }
    };

    this.createSkills = function(data, i) {
        var skills = {
            'maxParticipants': {
                'lvl': data['maxParticipants'][i]
            },
            'expBonus': {
                'lvl': data['expBonus'][i]
            },
            'questExpBonus': {
                'lvl': data['questExpBonus'][i]
            },
            'allyEnemyCount': {
                'lvl': data['allyEnemyCount'][i]
            },
            'blessing': {
                'lvl': data['blessing'][i]
            },
            'cursedItem': {
                'lvl': data['cursedItem'][i]
            },
            'healPower': {
                'lvl': data['healPower'][i]
            },
            'timeTickets': {
                'lvl': data['timeTickets'][i]
            }
        };
        return skills;
    };

    this.writeDataInElement = function($tr, attributes, level, depoTabs, skils, outfit) {
        var CA = Par.getClanAtributs();
        var attrData = CA.getMapOfBits(attributes, level, depoTabs, skils, outfit);
        $tr.data('atribute', attrData);
    };

    this.addIdToMyClan = function($tr, name) {
        var myClName = Par.getProp('name');
        if (name == myClName) {
            $tr.addClass('my-clan-list-clan');
        }
    };

    this.trClick = function($tr, id) {
        $tr.on('click', function() {
            _g("clan&a=getclan&id=" + id);
        });
    };

    this.createLogo = function(url) {
        var $logo = $('<td>').addClass('logo');
        $logo.css({
            'background': 'url(' + url + ')',
            'background-size': '100% 100%'
        });
        return $logo;
    };

    this.createTabHeaderClanList = function() {
        var clanInf = Par.getClanInf();
        var cl1 = 'hover-header header-sort';
        var rLang = Par.tLang('recruitment');
        var lMinLang = Par.tLang('min_level');
        return Par.createRecords(
            [clanInf[0], clanInf[1], clanInf[2], lMinLang, rLang], cl1);
    };

    this.createHeaderSortButtons = function() {
        var $firstTr = content.find('.clan-list-table-header tr');
        for (var i = 0; i < 5; i++) {
            this.clickSort($firstTr, i);
        }
    };

    this.clickSort = function($firstTr, i) {
        var $e = $firstTr.children().eq(i);
        if (i === 0) self.setArrows(i, true);
        $e.click(function() {
            if (sortColum == i) normalSort = !normalSort;
            else {
                sortColum = i;
                normalSort = true;
            }
            //self.setArrows($(this), normalSort);
            self.sendRequest(1);
        });
    };

    this.sendRequest = function(page, filter) {
        var val = esc(content.find('.clan-name-input').val());
        var search = val === '' ? '' : '&search=' + val;
        var ascending = normalSort ? 1 : 0;

        var f = filter ? filter : '';

        _g('clan&a=list&page=' + page + '&sort=' + sortColum + '&ascending=' + ascending + search + f, () => {
            self.setArrows(sortColum, ascending);
        });
    };

    // this.setArrows = ($el, isAsc) => {
    // 	const cl = isAsc ? 'header-sort--asc' : 'header-sort--desc';
    // 	$el.addClass(cl);
    // 	$el.siblings('td').removeClass('header-sort--asc header-sort--desc');
    // };

    this.setArrows = (colIndex, isAsc) => {
        const $el = content.find(`.clan-list-table-header tr td:eq(${colIndex})`);
        const cl = isAsc ? 'header-sort--asc' : 'header-sort--desc';
        $el.addClass(cl);
        $el.siblings('td').removeClass('header-sort--asc header-sort--desc');
    };

    this.init = function() {
        content = tpl.get('clan-list-content');
        Par.wnd.$.find('.card-content').append(content);
        $('.first-scroll-wrapper', content).addScrollBar({
            track: true,
            addScrollableClassToAnotherEl: $('.table-header-wrapper', content),
            callback: self.getGetNextPage
        });
        self.initInputSearch();
    };

    this.initInputSearch = function() {
        var $searchInput = content.find('.clan-name-input'),
            $searchX = content.find('.search-x');

        $searchInput.keyup(function() {
            if (timeOut) {
                clearTimeout(timeOut);
                timeOut = null;
                self.createTimeout();
            } else self.createTimeout()
        });

        $searchX.on('click', function() {
            $searchInput.val('')
                .blur()
                .trigger('keyup');
        });
    };

    this.createTimeout = function() {
        timeOut = setTimeout(function() {
            self.sendRequest(1);
        }, 300)
    };

    this.toBinary = function(val) {
        return (val >>> 0).toString(2)
    };

    //this.init();

};