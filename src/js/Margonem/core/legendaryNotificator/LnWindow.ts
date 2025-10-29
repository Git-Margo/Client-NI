const Tpl = require('@core/Templates');
import LnData from './LnData';
import LegendaryNotificator, {
    LnLang
} from './LnManager';

export default class LegendaryNotificatorWindow {
    wnd: any;
    constructor() {
        this.initWindow();
    }

    initWindow() {
        const title = `${LnLang('window-title')}`
        const content = Tpl.get('ln-content')[0];

        this.wnd = Engine.windowManager.add({
            content,
            title,
            nameWindow: Engine.windowsData.name.LEGENDARY_NOTIFICATOR_SETTINGS,
            widget: Engine.widgetsData.name.addon_25,
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            managePosition: {
                x: '251',
                y: '60'
            },
            manageShow: false,
            addClass: `${LnData.SLUG}-options-window`,
            twPadding: 'md',
            onclose: () => {
                this.close();
            }
        });

        this.wnd.el = this.wnd.$[0];
        this.wnd.updatePos();
        this.wnd.addToAlertLayer();
        // setContent();
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
    }

    close() {
        this.wnd.hide();
    }

    remove() {
        this.wnd.remove();
        this.wnd = null;
    }


}