import {
    getEngine,
    getHeroId,
    isHero,
    isset
} from "@core/HelpersTS";
import CharacterList, {
    TCharacterData
} from "@core/CharacterList";

var Tpl = require('@core/Templates');

interface Activity {
    id: number;
    isDone: boolean;
    isAvailable: boolean;
}

interface Activities {
    [key: string]: Activity[];
}

interface Template {
    id: number;
    name: string;
    category: number;
    description: string;
}

interface Data {
    activities: Activities;
    tpl: Template[];
}

export default class ActivityObserve {
    private currentPlayerId: number = 0;
    private lastData: Data | null = null;
    private activityTpls: Template[] = [];
    private listEl!: HTMLElement;
    private list: Activities = {};
    private charlist!: CharacterList;
    private wnd: any;
    private wndEl!: HTMLElement;

    constructor() {
        this.initWindow();
        this.listEl = this.wndEl.querySelector('.activity-observe__list') as HTMLElement;
    };

    private initWindow() {

        Engine.windowManager.add({
            content: Tpl.get('activity-observe'),
            title: _t('observe-window-title', null, 'activities'),
            nameWindow: Engine.windowsData.name.ACTIVITY_OBSERVE,
            objParent: this,
            nameRefInParent: 'wnd',
            addClass: 'activity-observe-window',
            type: Engine.windowsData.type.TRANSPARENT,
            manageShow: false,
            manageOpacity: 3,
            managePosition: {
                x: '251',
                y: '60'
            },
            twPadding: 'md',
            onclose: () => {
                this.managePanelVisible();
            }
        });

        this.wnd.addToAlertLayer();
        this.wnd.updatePos();
        this.wndEl = this.wnd.$[0];
    };

    private openPanel() {
        this.wnd.$.css('display', 'block');
        this.wnd.show();
        this.wnd.setWndOnPeak();
        this.updateScroll();
    };

    private closePanel() {
        //this.wnd.$.css('display', 'none');
        this.wnd.hide();
    };

    private updateScroll() {
        $('.scroll-wrapper', this.wnd.$).trigger('update');
    };

    onCharlistLoaded() {
        this.charlist = Engine.characterList;
        this.currentPlayerId = getHeroId();
        this.createCharacters();
    }

    private createCharacters() {
        const worldName = getEngine().worldConfig.getWorldName();
        const charactersContainer = this.wndEl.querySelector(`.activity-observe__players`) !;

        this.charlist.getCharactersByWorld(worldName).forEach(character => {
            const characterEl = this.createOneCharacter(character) as HTMLElement;
            charactersContainer.appendChild(characterEl);
        });
    }

    private createOneCharacter(charData: TCharacterData) {
        return this.charlist.createCharacterAvatar(charData, {
            onClickCallback: () => this.characterOnClick(charData.id),
            cssClass: `activities__one-character${isHero(charData.id) ? ' active' : ' inactive'}`,
            selectable: true
        });
    }

    private characterOnClick(characterId: number) {
        this.currentPlayerId = characterId;
        this.clearActivities();
        this.createActivities();
    }

    update(data: Data) {
        if (JSON.stringify(this.lastData) === JSON.stringify(data)) return; // prevent re-render if data is the same
        const heroId = getHeroId();

        const {
            activities,
            tpl
        } = data;
        this.addTpls(tpl);

        if (!this.currentPlayerId) this.currentPlayerId = heroId;

        for (const playerId in activities) {
            this.list[playerId] = activities[playerId];
        }
        // Object.keys(this.list).forEach(key => {
        //     if (!activities[key]) delete this.list[key];
        // })
        if (this.list[heroId] && !activities[heroId]) {
            if (this.currentPlayerId === heroId) this.clearActivities();
            delete this.list[heroId];
        }

        this.lastData = data;

        this.updateActivityPanel();
        this.createActivities();
    };

    private addTpls(tpls: Template[]) {
        for (const tpl of tpls) {
            if (this.activityTpls.some(tpl2 => tpl2.id === tpl.id)) continue;
            this.activityTpls.push(tpl);
        }
    };

    private clearActivities() {
        this.listEl.innerHTML = '';
    };

    private createActivities() {
        if (!this.list[this.currentPlayerId]?.length) return;

        const activities = this.list[this.currentPlayerId].sort((a, b) => {
            if (a.isAvailable !== b.isAvailable) return a.isAvailable ? -1 : 1;
            return a.id - b.id;
        });

        const activityTemplates = activities.map(activity => {
            const template = this.getActivityData(activity.id) as Template;
            return {
                ...activity,
                ...template
            };
        });

        const groupedByCategory = Object.groupBy(activityTemplates, item => item.category);
        this.clearActivities();

        Object.entries(groupedByCategory).forEach(([category, categoryActivities]) => {
            const categorySection = Tpl.get('activity-observe-category')[0];
            categorySection.dataset.category = category;

            categoryActivities!.forEach(activity => {
                const activityElement = this.createActivityElement(activity);
                categorySection.appendChild(activityElement!);
            });

            this.listEl.appendChild(categorySection);
        });

        this.updateScroll();
    }

    private updateActivityPanel() {
        const activities = this.list[getHeroId()] ?? [];
        const activityPanel = getEngine().worldWindow?.activityPanel;
        if (activityPanel) {
            activityPanel.updateFromObserved(activities);
        }
    }

    private createActivityElement(activity: Activity & Template): HTMLElement {
        const oneObserve = Tpl.get('one-observe')[0]
        oneObserve.classList.add('quest-observe-' + activity.id);

        if (activity.isDone) oneObserve.classList.add('one-observe--done');
        if (isset(activity.isAvailable) && !activity.isAvailable) oneObserve.classList.add('one-observe--inactive');

        oneObserve.querySelector('.one-observe__debug').innerText = activity.id;

        const oneObserveContentEl = oneObserve.querySelector('.one-observe__content') as HTMLElement;
        oneObserveContentEl.innerHTML = parseBasicBB(activity.name);
        $(oneObserveContentEl).tip(parseBasicBB(activity.description));

        const removeBtn = oneObserve.querySelector('.one-observe__remove-btn');
        if (isHero(this.currentPlayerId)) {
            $(removeBtn).tip(_t('detach_from_observe'));
            removeBtn.addEventListener('click', () => {
                this.removeFromObserve(activity.id);
            })
        } else {
            removeBtn.style.display = 'none';
        }

        return oneObserve;
    };

    private getActivityData(id: number) {
        return this.activityTpls.find(tpl => tpl.id === id);
    }

    checkObserved(targetId: number, activityId: number) {
        return !!this.list?.[targetId]?.some(activity => activity.id === activityId);
    }

    addToObserve(activityId: number) {
        _g(`activities&action=observe&activityId=${activityId}&isObserved=1`);
    }

    removeFromObserve(activityId: number) {
        _g(`activities&action=observe&activityId=${activityId}&isObserved=0`);
    }

    managePanelVisible() {
        this.wnd.isShow() ? this.closePanel() : this.openPanel();
    }
};