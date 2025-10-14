var tpl = require('@core/Templates');
const Tabs = require('../components/Tabs');
module.exports = function(Par) {
    var self = this;
    var content;
    var card;

    this.initTab = function() {
        card = [
            'clan-official-page',
            // 'clan_other-members',
            // 'clan_other-recruit'
            'clan-other-members',
            'clan-other-recruit'
        ];
    };

    this.initAllCards = function() {
        // var $menu = content.find('.header-menu');
        // for (var i = 0; i < card.length; i++)
        // 	Par.createCard('showcase', $menu, card[i]);
        // content.find('.card').eq(0).addClass('active');

        let cards = {
            [card[0]]: {
                name: Par.tLang(card[0]),
                initAction: () => cardCallback(card[0])
            },
            [card[1]]: {
                name: Par.tLang("clan_other-members"),
                initAction: () => {
                    cardCallback(card[1]);
                    let otherClan = Engine.clan.getOtheClanModule()
                    if (otherClan) {
                        otherClan.updateScroll();
                    }
                }
            },
            [card[2]]: {
                name: Par.tLang("clan_other-recruit"),
                initAction: () => cardCallback(card[2])
            }
        };

        const tabsOptions = {
            tabsEl: {
                navEl: content[0].querySelector('.header-menu')
            }
        };

        this.tabsInstance = new Tabs.default(cards, tabsOptions);
    };

    const cardCallback = (slug) => {
        this.tabsInstance.activateCard(slug);

        let $cardContent = content.find(".card-content");
        $cardContent.find(`.${card[0]}-content`).css('display', "none")
        $cardContent.find(`.${card[1]}-content`).css('display', "none")
        $cardContent.find(`.${card[2]}-content`).css('display', "none")

        $cardContent.find(`.${slug}-content`).css('display', "block")
    }

    this.updateInfo = function(v) {
        if (!v) return;
        this.showShowcase();
        if (isset(v[0])) {
            this.setTitle(v[0]);
        }
        var state = parseInt(v[3][21], 2); // crazy is my life
        var str = '';
        var $banner = tpl.get('clan-banner-name');
        //$banner.find('.clan-name').remove();

        content.find('.clan-banner-name').remove();
        content.find('.header').prepend($banner);

        if (state == 0) str = _t('close_recruit');
        else {
            if (state == 1) str = _t('open_recruit');
            else str = _t('free recruitment');
        }
        var t = [
            '.clan-name', '', escapeHTML(v[0]),
            '.clan-level', Par.tLang('clan_level') + ': ', v[1],
            '.amount-members', Par.tLang('clan_amount_members') + ': ', v[2],
            '.recruite-info', Par.tLang('recruitment') + ': ', str
        ];
        for (var i = 0; i < t.length; i += 3) {
            var where = t[i];
            var lang = t[i + 1];
            var val = t[i + 2];
            var span = '<span class="val">' + val + '</span>';
            content.find(where).html(lang + span);
        }
    };

    this.initHeader = function() {
        var str = Par.tLang('clan_showcase');
        content.find('.header').html(str);
    };

    this.init = function() {
        this.initWindow();
        this.initTab();
        this.initAllCards();
    };

    this.initWindow = function() {

        content = tpl.get('showcase');

        Engine.windowManager.add({
            content: content,
            //nameWindow        : 'showcase',
            nameWindow: Engine.windowsData.name.SHOWCASE,
            objParent: self,
            nameRefInParent: 'wnd',
            startVH: 60,
            cssVH: 60,
            onclose: () => {
                self.hide();
            }
        });

        self.wnd.addToAlertLayer();
        self.wnd.hide();
    };

    this.setTitle = (title = Par.tLang('clan_showcase')) => {
        this.wnd.title(title);
    };

    this.showShowcase = function() {
        self.wnd.center();
        var ww = $(window).width();
        self.wnd.$.css({
            'display': 'block',
            'left': ww / 2 + 110
        });
        Par.wnd.$.css('left', ww / 2 - 640);
    };

    this.hide = function() {
        //self.wnd.$.css('display', 'none');
        self.wnd.hide();
        Par.wnd.center();
    };

    this.close = function() {
        //self.wnd.$.remove();
        self.wnd.remove();
        //delete self.wnd;
    };

    //this.init();

};