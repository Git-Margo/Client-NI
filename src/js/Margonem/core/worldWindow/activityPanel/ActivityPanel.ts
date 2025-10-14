import Table, {
    CellType,
    RecordsData
} from "@core/components/Table";
import Button from "@core/components/Button";
import CharacterList, {
    TCharacterData
} from '@core/CharacterList';
import {
    getEngine,
    isHero,
    isset
} from "@core/HelpersTS";

const Tpl = require('@core/Templates');

interface Activity {
    id: number;
    name: string;
    description: string;
    category: number;
    isDone: boolean;
    isAvailable: boolean
}

interface Category {
    id: number;
    name: string;
}

interface ActivityPanelData {
    targetId: number;
    activities: Activity[];
    categories: Category[];
}

export default class ActivityPanel {
    private currentPlayerId!: number;
    private contentEl!: HTMLElement;
    private tabContentEl!: HTMLElement;
    private table!: Table;
    private charlist: CharacterList;

    constructor(private wndEl: HTMLElement, private data: ActivityPanelData) {
        this.charlist = Engine.characterList;
        this.setContent();
        this.createCharacters();
        this.createTable();
    }

    private setContent() {
        this.contentEl = Tpl.get('activities')[0] as HTMLElement;
        this.tabContentEl = this.wndEl.querySelector('.activities-content') as HTMLElement;
        this.tabContentEl.innerHTML = '';
        this.tabContentEl.appendChild(this.contentEl);
        this.createToggleObserveWindowButton();
        getEngine().hotKeys.replacetoggleActivityObserveBtnsNames();
    }

    private createTable() {
        const wrapper = this.contentEl.querySelector('.activities__table') as HTMLElement;
        wrapper.innerHTML = '';

        const headerRow = this.createHeaderRow();
        const bodyRows = this.createBodyRows();
        this.table = new Table({
            wrapper,
            headerRecord: headerRow,
            bodyRecordsArray: bodyRows,
            options: {
                useScrollbar: true,
                useStickyHeader: true
            }
        });
    }

    private createHeaderRow() {
        const cssClass = "table-with-static-header-header-td center";

        return {
            rowData: [{
                    content: this.tLang('activity-name'),
                    cssClass
                },
                {
                    content: '',
                    cssClass
                }
            ]
        };
    }

    private createBodyRows(): RecordsData[] {
        const cssClass = "center";
        const tableData: RecordsData[] = [];
        const targetId = this.data.targetId;

        this.data.activities.sort((a, b) => {
            if (a.isAvailable !== b.isAvailable) return a.isAvailable ? -1 : 1;
            return a.id - b.id;
        });

        this.data.categories.forEach(category => {
            tableData.push({
                rowData: [{
                    content: category.name,
                    cssClass,
                    tag: CellType.TH,
                    colspan: 3
                }]
            });
            const activitiesInCategory = this.data.activities.filter(
                activity => activity.category === category.id
            );
            activitiesInCategory.forEach(activity => {
                const button = isHero(targetId) ? this.createPinButton(activity, targetId) : '';
                const activityNameCellCssClass = `activities__name ${cssClass}${activity.isDone ? ' is-done' : ''}${isset(activity.isAvailable) &&!activity.isAvailable ? ' inactive' : ''}`
                tableData.push({
                    // ...(activity.isDone && { cssClass: 'is-done ' }),
                    attrs: {
                        'observe-id': activity.id
                    },
                    rowData: [{
                            content: parseBasicBB(activity.name),
                            tip: parseBasicBB(activity.description),
                            cssClass: activityNameCellCssClass
                        },
                        {
                            content: button,
                            cssClass
                        },
                    ]
                });
            });
        });

        return tableData;
    }

    getDoneText(isDone: boolean) {
        return isDone ? _t('yes') : _t('no');
    }

    private createPinButton(activity: Activity, targetId: number) {
        const activityObserve = getEngine().activityObserve;
        const isObserved = activityObserve.checkObserved(targetId, activity.id);
        return new Button({
            text: Tpl.get('add-bck').addClass('observed')[0],
            classes: ['small', isObserved ? 'green' : 'red', 'observe-toggle'],
            tip: _t('add_to_observe'),
            action: (e, el) => {
                const isActive = el.classList.contains('green');

                if (isActive) activityObserve.removeFromObserve(activity.id);
                else activityObserve.addToObserve(activity.id);
            },
        }).getButton();
    }

    updateFromObserved(activities: Activity[]) {
        const activitiesElements = this.contentEl.querySelectorAll('[observe-id]');
        activitiesElements.forEach(rowEl => {
            const activityId = Number(rowEl.getAttribute('observe-id'));
            const observeBtn = rowEl.querySelector('.observe-toggle') as HTMLElement;
            const nameCell = rowEl.querySelector('.activities__name') as HTMLElement;
            const observedActivity = activities.find((activity) => activity.id === activityId);
            if (observedActivity) {
                nameCell.classList.toggle('is-done', observedActivity.isDone);
                observeBtn.classList.add('green')
            } else {
                observeBtn.classList.remove('green');
            }
        })
    }

    private createToggleObserveWindowButton() {
        const button = new Button({
            text: this.tLang('open-activity'),
            classes: ['small', 'green', 'toggle-activity-observe'],
            action: (e, el) => {
                getEngine().activityObserve.managePanelVisible();
            },
        }).getButton();

        this.contentEl.querySelector('.bottom-bar') !.appendChild(button);
    }

    update(data: ActivityPanelData) {
        this.data = data;
        this.currentPlayerId = data.targetId;
        this.createTable();
    }

    private createCharacters() {
        const worldName = getEngine().worldConfig.getWorldName();
        const charactersContainer = this.contentEl.querySelector(`.activities__players`) !;

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
        _g(`activities&action=show&targetId=${characterId}`);
    }

    private tLang(name: string, category: string = 'activities', val: {} | null = null) {
        return typeof RUNNING_UNIT_TEST === 'undefined' ? _t(name, val, category) : '';
    }

    private close() {
        getEngine().worldWindow.activityPanel = false;
    }
}