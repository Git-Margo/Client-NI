import {
    getEngine
} from "@core/HelpersTS";

const Tpl = require('@core/Templates');
const TutorialData = require('@core/tutorial/TutorialData');


export default class CraftingWindow {
    public opened: boolean = false;
    private wnd: any;
    private wndEl!: HTMLElement;
    private content = '';

    constructor(title: string) {
        this.initWindow(title);
        this.centerWindow();
    }

    closeAll() {
        if (getEngine().crafting.recipes) getEngine().crafting.recipes.close();
        if (getEngine().crafting.itemCraft) getEngine().crafting.itemCraft.close();
    }

    manageVisible() {
        if (!this.opened) {
            this.closeOtherWindows();
            this.windowOpen();
        } else {
            this.windowClose();
        }
    };

    windowOpen() {
        this.wnd.show();
        this.opened = true;
        this.wnd.setWndOnPeak();
        getEngine().lock.add('crafting');
    };

    windowClose() {
        this.wnd.hide();
        this.opened = false;
        getEngine().lock.remove('crafting');
    };

    private initWindow(title: string) {
        this.content = Tpl.get('crafting');

        getEngine().windowManager.add({
            content: this.content,
            title,
            //nameWindow        : 'Recipes',
            nameWindow: getEngine().windowsData.name.CRAFTING,
            widget: getEngine().widgetsData.name.CRAFTING,
            objParent: this,
            nameRefInParent: 'wnd',
            startVH: 60,
            cssVH: 60,
            onclose: () => {
                this.close();
            }
        });

        this.wnd.addToAlertLayer();
        this.windowClose();
        this.wndEl = this.wnd.$[0];
    };

    private centerWindow() {
        this.wnd.center();
    };

    getWindow() {
        return this.wndEl;
    }

    closeOtherWindows() {
        const v = getEngine().windowsData.windowCloseConfig.CRAFTING;
        getEngine().windowCloseManager.callWindowCloseConfig(v);
    }

    callCheckCanFinishExternalTutorialCloseBarter() {
        let tutorialDataTrigger = getEngine().tutorialManager.createTutorialDataTrigger(
            TutorialData.ON_FINISH_BREAK.CLOSE_CRAFTING,
            TutorialData.ON_FINISH_TYPE.BREAK,
            true
        );
        getEngine().rajController.parseObject(tutorialDataTrigger);
    };

    close() {
        this.closeAll();
        this.windowClose()
        this.callCheckCanFinishExternalTutorialCloseBarter();
        delete getEngine().crafting.recipes;
    };

}