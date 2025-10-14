/**
 * Created by Michnik on 2015-08-12.
 */
const Tpl = require('@core/Templates');
const {
    isMobileApp
} = require("@core/HelpersTS");
module.exports = function() {

    this.initWindow = function() {
        Engine.windowManager.add({
            content: Tpl.get('draconite-shop'),
            //nameWindow        : 'draconite-shop',
            nameWindow: Engine.windowsData.name.DRACONITE_SHOP,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('buy_sl_pane', null, 'shop'),
            onclose: () => {
                this.close();
            }
        });

    };

    this.open = function() {
        if (isset(Engine.hero.d.guest)) {
            const infoTxt = _t('guest_cannot_buy_draconite');
            mAlert(infoTxt);
            Engine.draconiteShop = false;
            return;
        }
        // if (_l() != 'pl') {
        if (!isPl()) {
            const wnd = window.open("https://margonem.com/draconite");
            wnd.opener = null;
            Engine.draconiteShop = false;
            return;
        }
        this.initWindow();
        if (isMobileApp()) {
            this.wnd.$.find('iframe').remove();
            this.wnd.$.find('.draconite-shop-content').addClass('not-available').text(_t('temporarily-unavailable'));
        } else {
            this.wnd.$.find('iframe').attr('src', "https://www.margonem.pl/profile/payments")
        }
        this.wnd.addToAlertLayer();
        this.wnd.setWndOnPeak();
        this.wnd.center();
        this.wnd.$.show();
    };

    this.close = function() {
        Engine.draconiteShop = false;
        this.wnd.remove();
    };

};