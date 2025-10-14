const tpl = require('@core/Templates');
const StaminaShop = require('@core/shop/StaminaShop');
const DraconiteShop = require('@core/shop/DraconiteShop');
const Premium = require('@core/Premium');

module.exports = function() {
    let now;
    let $content;
    let dataBanners;
    let t = []; // ids possible banners
    let interval;
    let resizeInterval;
    let block = false;
    let forceUpdate = true;
    let isSmall = false;
    const BANNER_WIDTH = 238;

    this.init = () => {
        this.initContent();
        this.initDataBanners();
        this.initButtons();
        this.updatePossibleBanners();
        this.initHover();
        //this.showOrHideBanners();
    };

    this.update = (force = false) => {
        if (force) forceUpdate = true;
        if (resizeInterval) clearTimeout(resizeInterval);
        resizeInterval = setTimeout(() => {
            this.updatePossibleBanners();
            clearTimeout(resizeInterval);
        }, 1000);
    };

    this.updatePossibleBanners = () => {
        if (!this.createTable()) return;
        this.clearBanners();
        this.initFirstBanner();
        this.initBanners();
    };

    this.startInterval = () => {
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            this.rightBtnClick();
        }, 600000);
    };

    this.clearBanners = () => {
        $content.find('.picture').remove();
    };

    this.showOrHideBanners = () => {
        //const bool = Engine.opt(17);
        const bool = !getEngine().settingsOptions.isBannersOn();
        if (!bool) $content.removeClass('nodisp');
        else $content.addClass('nodisp');
    };

    this.createTable = () => {
        if (!forceUpdate && isSmall === this.isSmall()) return false; // prevent recreate table if size is same
        isSmall = this.isSmall();
        t = [];
        forceUpdate = false;

        for (const i in dataBanners) {
            if (isset(dataBanners[i]) && dataBanners[i]) {
                if (!isset(dataBanners[i].lvl) ||
                    isset(dataBanners[i].lvl) && getHeroLevel() >= dataBanners[i].lvl[0] && getHeroLevel() <= dataBanners[i].lvl[1]) {
                    t.push(i);
                }
            }
        }
        return true;
    };

    this.initContent = () => {
        $content = tpl.get('b_wrapper');
        //Engine.interface.get$interfaceLayer().find('.right-column').find('.inner-wrapper .bottom-wrapper').append($content);

        let $rightMainColumnWrapper = Engine.interface.getRightMainColumnWrapper();

        $rightMainColumnWrapper.find('.bottom-wrapper').append($content);
    };

    this.initHover = () => {
        const $prevAndNext = $content.find('.left, .right');
        const elements = $content.find('.all-b, .left,.right');
        elements.hover(
            () => {
                $prevAndNext.css('display', 'inline-block');
            }, () => {
                $prevAndNext.css('display', 'none');
            }
        );
    };

    this.initBanners = () => {
        const l = t.length;
        if (l <= 0) return;
        $content.find('.all-b').width(l * 240);
        this.startInterval();
        const min = this.getValueOfBanner(now - 1);
        const max = this.getValueOfBanner(now + 1);
        const idsTab = [t[min], t[now], t[max]];
        for (let i = 0; i < 3; i++) {
            const id = idsTab[i];
            const $b = this.createBanner(id, dataBanners[id].btn, dataBanners[id].clb);
            this.addBannerToWrapper($b);
        }
    };

    this.getValueOfBanner = (val) => {
        const
            l = t.length,
            max = l - 1;
        if (val < 0) return max + val + 1;
        if (val > max) return val - max - 1;
        return val;
    };

    this.addBannerToWrapper = ($e) => {
        $content.find('.all-b').append($e);
    };

    this.isSmall = () => Engine.interface.get$InterfaceLayerHeight() < 880;

    this.createBanner = (id, btn, clb) => {
        const
            size = isSmall ? 's' : 'b',
            url = `url(../img/gui/banners/${_l()}/${id}${size}.png?v=${__build.version})`,
            $banner = tpl.get('one-baner');

        $banner.css('background', url);
        $banner.addClass('picture ' + size);
        if (!btn) return $banner;
        const $btns = this.createButtonsToBanner(clb, btn);
        $banner.append($btns);
        return $banner;
    };

    this.createButtonsToBanner = (clb, btns) => {
        let $btnsWrapper = $('<div />', {
            class: 'btns-wrapper'
        });
        if (Array.isArray(btns)) {
            for (let i = 0; i < btns.length; i++) {
                $btnsWrapper.append(this.createBtnToBanner(btns[i].clb, btns[i].title));
            }
            if ($btnsWrapper.children().length > 1) {
                $btnsWrapper.addClass('many');
            }
        } else {
            $btnsWrapper.append(this.createBtnToBanner(clb, btns));
        }
        return $btnsWrapper;
    };

    this.createBtnToBanner = (clb, text) => {
        const $btn = tpl.get('button').addClass('purple small');
        $btn.find('.label').text(text);
        $btn.click(clb);
        return $btn;
    };

    this.buyDraconite = () => {
        if (!Engine.draconiteShop) {
            Engine.draconiteShop = new DraconiteShop();
            Engine.draconiteShop.open();
        } else {
            Engine.draconiteShop.close();
        }
    };

    this.showPremium = () => {
        if (!Engine.premium) {
            Engine.premium = new Premium();
            Engine.premium.init();
        } else {
            Engine.premium.close();
        }
    };

    this.openPremiumShop = (shopId) => {
        if (!Engine.shop) _g(`creditshop&npc=${shopId}`);
        else Engine.shop.hide();
    }

    this.openStaminaShop = () => {
        if (!Engine.staminaShop) {
            Engine.staminaShop = new StaminaShop();
            Engine.staminaShop.init();
        } else Engine.staminaShop.hide();
    }

    this.openLink = (link) => {
        const wnd = window.open(
            link,
            '_blank'
        );
        wnd.opener = null;
    };

    this.initFirstBanner = () => {
        const min = 0;
        const max = t.length - 1;
        now = Math.round(Math.random() * (max - min) + min);
    };

    this.initButtons = () => {
        const $l = $content.find('.left');
        const $r = $content.find('.right');
        $l.click(this.leftBtnClick);
        $r.click(this.rightBtnClick);
    };

    this.leftBtnClick = () => {
        if (block) return;
        block = true;
        if (now > 0) now--;
        else now = t.length - 1;
        const newNow = t[this.getValueOfBanner(now - 1)];
        const b = dataBanners[newNow];
        const $b = this.createBanner(newNow, b.btn, b.clb);
        $content.find('.all-b').prepend($b);
        const $banners = $content.find('.all-b');
        const onComplete = () => {
            $banners.children().last().remove();
            block = false;
        }

        if (isSettingsOptionsInterfaceAnimationOn()) {
            const element = document.querySelector('.all-b');
            const animation = element.animate([{
                    transform: `translateX(${-BANNER_WIDTH * 2}px)`
                },
                {
                    transform: `translateX(${-BANNER_WIDTH}px)`
                }
            ], {
                duration: 500,
                easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
                fill: 'forwards'
            });
            animation.onfinish = onComplete;
        } else {
            onComplete();
        }
    };

    this.rightBtnClick = () => {
        if (block) return;
        block = true;
        const l = t.length - 1;
        if (now < l) now++;
        else now = 0;
        const newNow = t[this.getValueOfBanner(now + 1)];
        const b = dataBanners[newNow];
        const $b = this.createBanner(newNow, b.btn, b.clb);
        this.addBannerToWrapper($b);
        const $banners = $content.find('.all-b');
        const onComplete = () => {
            $banners.children().first().remove();
            block = false;
        }

        if (isSettingsOptionsInterfaceAnimationOn()) {
            const element = document.querySelector('.all-b');
            const animation = element.animate([{
                    transform: `translateX(${-BANNER_WIDTH}px)`
                },
                {
                    transform: `translateX(${-BANNER_WIDTH * 2}px)`
                }
            ], {
                duration: 500,
                easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
                fill: 'backwards'
            });
            animation.onfinish = onComplete;
        } else {
            onComplete();
        }
        this.startInterval();
    };

    this.getNow = () => {
        return now;
    };

    this.onResize = () => {
        this.update();
    };

    this.initDataBanners = () => {
        const {
            BannersDataPl
        } = require('./BannersDataPl');
        const {
            BannersDataEn
        } = require('./BannersDataEn');
        dataBanners = isPl() ? BannersDataPl : BannersDataEn;
    };

    //this.init();
};