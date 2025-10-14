var tpl = require('@core/Templates');
let ProfData = require('@core/characters/ProfData');

module.exports = function() {

    var $content;
    var self = this;
    var itemClArray = null;
    this.$profsanditems = null;
    this.$environment = null;
    this.$premium = null;
    this.$moveandfight = null;

    this.init = function() {
        this.initWindow();
        this.initCards();
        this.initItemClArray();
        this.initClasses();
        this.initMoveAndFight();
        this.initProfsAndItems();
        this.initScrollBar();
        this.setContent('move-and-fight');
        this.wnd.center();
    };

    this.initItemClArray = function() {
        //_t('soulbound', null, 'help')
        itemClArray = [self.eqClLang('soulbound2'), self.eqClLang('cl_onehanded'), self.eqClLang('cl_twohanded'), self.eqClLang('cl_bastard'), self.eqClLang('cl_distance'), self.eqClLang('cl_helpers'), self.eqClLang('cl_wands'), self.eqClLang('cl_staffs'),
            self.eqClLang('cl_armor'), self.eqClLang('cl_helmets'), self.eqClLang('cl_boots'), self.eqClLang('cl_gloves'), self.eqClLang('cl_rings'), self.eqClLang('cl_neclaces'), self.eqClLang('cl_shield'), self.eqClLang('cl_neutral'), self.eqClLang('cl_usable'),
            self.eqClLang('cl_gold'), self.eqClLang('cl_keys'), self.eqClLang('cl_quests'), self.eqClLang('cl_renewable'), self.eqClLang('cl_arrows'), self.eqClLang('cl_talisman'), /*self.eqClLang('cl_books'), self.eqClLang('cl_bags'), self.eqClLang('cl_bless'),*/
        ];
    };

    this.initClasses = function() {
        this.$profsanditems = tpl.get('help-profs-and-items');
        this.$environment = tpl.get('help-environment');
        this.$premium = tpl.get('help-premium');
        this.$moveandfight = tpl.get('help-move-and-fight');
    };

    this.initWindow = function() {
        $content = tpl.get('help-window2');

        Engine.windowManager.add({
            content: $content,
            title: _t('help_window_title', null, 'help'),
            //nameWindow        : 'help_window',
            nameWindow: Engine.windowsData.name.HELP_WINDOW,
            widget: Engine.widgetsData.name.HELP,
            objParent: this,
            nameRefInParent: 'wnd',
            startVH: 60,
            cssVH: 60,
            onclose: () => {
                this.close();
            }
        });

        this.wnd.show();
        this.wnd.addToAlertLayer();
    };

    this.initScrollBar = function() {
        $('.scroll-wrapper', $content).addScrollBar({
            track: true
        });
    };

    this.updateScroll = function() {
        $('.scroll-wrapper', $content).trigger('update');
    };

    this.initCards = function() {
        var $allCards = $content.find('.card');
        $allCards.each(function() {
            var name = $(this).attr('data-card');
            $(this).find('.label').html(_t(name, null, 'help'));
            $(this).click(function() {
                $allCards.removeClass('active');
                $(this).addClass('active');
                $content.find('.edit-header-label').html(_t(name, null, 'help'));
                self.setContent(name);
                $('.scroll-wrapper', $content).trigger('scrollTop');
            });
        });
    };

    this.setContent = function(name) {
        var $scroll = $content.find('.scroll-pane');
        if ($scroll.children().length > 1) $scroll.children().eq(1).detach();
        var n = (name.replace(/-/gi, ''));
        $scroll.append(self['$' + n]);
        self.updateScroll();
    };

    this.initMoveAndFight = function() {
        self.createBoxesWithImg('fight', ['turn', 'quick', 'pvp'], '.kind-fight'); // kind fight
        self.createBoxesWithImg('move', ['basic', 'advance'], '.move-in-fight'); // moves
    };

    this.initProfsAndItems = function() {
        self.createAllProfs();
        self.createClItems();
        self.createTypeItems();
    };

    this.createAllKindsOfFight = function() {
        var t = ['turn', 'quick', 'pvp'];
        for (var i = 0; i < t.length; i++) {
            var ft = t[i];
            var $oneFight = tpl.get('help-one-move');
            $oneFight.find('.title').html(_t('fight-' + ft + '-name', null, 'help') + ':');
            $oneFight.find('.symbol').addClass('symbol-' + ft);
            $oneFight.find('.text').html(_t('fight-' + ft + '-description', null, 'help'));
            self.$moveandfight.find('.kind-fight').append($oneFight);
        }
    };

    this.createBoxesWithImg = function(type, names, appendDestSelector) {
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            var $singleBox = tpl.get('help-box-with-img');
            $singleBox.find('.title').html(_t(type + '-' + name + '-name', null, 'help') + ':');
            $singleBox.find('.symbol').addClass('symbol-' + name);
            $singleBox.find('.text').html(_t(type + '-' + name + '-description', null, 'help'));
            self.$moveandfight.find(appendDestSelector).append($singleBox);
        }
    };

    this.createAllProfs = function(prof) {
        // var t = ['t', 'p', 'h', 'b', 'w', 'm'];
        var t = [
            ProfData.TRACKER,
            ProfData.PALADIN,
            ProfData.HUNTER,
            ProfData.BLADE_DANCER,
            ProfData.WARRIOR,
            ProfData.MAGE
        ];
        var links = {
            pl: 'http://pomoc.margonem.pl/index/view,342#',
            en: 'http://help.margonem.com/index/view,342#',
        };

        for (var i = 0; i < t.length; i++) {
            var cl = t[i];
            var $oneProf = tpl.get('help-one-prof');
            $oneProf.find('.symbol').addClass(cl);
            $oneProf.find('.name').html(getAllProfName(cl));
            $oneProf.find('.avatar').addClass('avatar-' + cl);
            $oneProf.find('.text').html(_t('prof-desription-' + cl, null, 'help'));
            $oneProf.find('.link').html(_t('more-link', null, 'help'))
                .attr('href', links[_l()] + cl);
            self.$profsanditems.find('.profs-content').append($oneProf);
        }
    };

    this.createClItems = function() {
        self.createOneCl(-1, self.eqClLang('unsoulbound'));
        self.createOneCl(-2, self.eqClLang('permbound'));

        for (var i = 0; i < 23; i++) {
            self.createOneCl(i, itemClArray[i]);
        }

        self.createOneCl(26, self.eqClLang('cl_improve'));
        self.createOneCl(27, self.eqClLang('cl_recipes'));
    };

    this.createOneCl = function(i, text) {
        var $oneItem = tpl.get('help-one-cl-item');
        $oneItem.find('.icon').addClass(' icon-' + i);
        $oneItem.find('.text').html(text);
        self.$profsanditems.find('.column-1>.column-content').append($oneItem);
    };

    this.createTypeItems = function() {
        var t = ['normal-help', 'unique-help', 'heroic-help', 'legend-help', 'upgrade-help'];
        for (var i = 0; i < 5; i++) {
            var $oneItem = tpl.get('help-one-cl-item');
            $oneItem.find('.icon').addClass(t[i]);
            $oneItem.find('.text').html(_t(t[i], null, 'help'));
            self.$profsanditems.find('.column-2>.column-content').append($oneItem);
        }
    };

    this.eqClLang = function(name) {
        return _t(name, null, 'eq_cl');
    };

    this.close = function() {
        //self.wnd.$.remove();
        self.wnd.remove();
        Engine.help = null;
    };

    //this.init();
};