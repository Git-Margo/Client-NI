const Tpl = require('@core/Templates');
import LfData from './LfData';
import {
    LfLang
} from './LfManager';

export default class LootFilterWindow {
    wnd: any;
    constructor() {
        this.initWindow();
    }

    initWindow() {
        const title = LfLang('window-title')
        const content = Tpl.getEl('lf-content');

        this.wnd = Engine.windowManager.add({
            content,
            title,
            nameWindow: Engine.windowsData.name.LOOT_FILTER_SETTINGS,
            widget: Engine.widgetsData.name.LOOT_FILTER,
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            managePosition: {
                x: '251',
                y: '60'
            },
            manageShow: false,
            addClass: `${LfData.SLUG}-options-window`,
            twPadding: 'md',
            onclose: () => {
                this.close();
            }
        });

        this.wnd.el = this.wnd.$[0];
        this.wnd.updatePos();
        this.wnd.addToAlertLayer();
        this.addScrollbar();
        // setContent();
    }

    scrollBarUpdate() {
        this.wnd.$.find('.scroll-wrapper').trigger('update');
    }

    addScrollbar() {
        this.wnd.$.find('.scroll-wrapper').addScrollBar({
            track: true
        });
    }

    windowToggle() {
        if (!this.wnd.isShow()) {
            this.open();
        } else {
            this.close();
        }
    }

    open() {
        this.wnd.show();
        this.wnd.setWndOnPeak();
        this.wnd.updatePos();
        this.scrollBarUpdate();
    }

    close() {
        this.wnd.hide();
    }

    remove() {
        this.wnd.remove();
        this.wnd = null;
    }


}