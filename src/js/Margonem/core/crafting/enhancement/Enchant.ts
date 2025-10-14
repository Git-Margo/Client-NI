import Autofiller from '../../autofiller/Autofiller';
import {
    checkBetterItemClass,
    checkEnhancedItems,
    checkPersonalItems,
    checkReducedRequirementItems,
    isset,
} from '../../HelpersTS';
import ConfirmationQueue from '../../utils/ConfirmationQueue';
import {
    Item
} from '../../items/Item';
import {
    specialFilters
} from "../../autofiller/AutofillerData";
const ItemData = require('@core/items/data/ItemData');
const ServerStorageData = require('@core/storage/ServerStorageData');

declare const removeFromArray: Function;
declare const createButton: Function;
declare const Engine: any;
declare const debounce: any;

interface Data {
    bonuses: [],
    goldPrice: number,
    ingredientPrice: number,
    ingredientTplId: number
    upgradeLevel: number
}

interface Slots {
    [name: string]: number
}

export default class Enchant {

    private reagentsGridEl!: HTMLElement;
    private autofillerEl!: HTMLElement;
    public autofiller!: Autofiller;
    private usageCounterEl!: HTMLElement;
    private reagentsGridSize: {
        x: number,
        y: number
    } = {
        x: 5,
        y: 5
    };
    private maxReagentsLimit: number = this.reagentsGridSize.y * this.reagentsGridSize.x;
    private reagentSlots: Slots = {};
    private addReagentsBlock: boolean = true;
    private selectedInventoryItems: number[] = [];

    constructor(private el: HTMLElement) {
        this.createContent();
        this.droppableInit();
    }

    createContent() {
        this.createAutofiller();
        this.createConfirmButton();
        this.reagentsGridEl = this.el.querySelector('.enhance__reagents') as HTMLElement;
        this.usageCounterEl = this.el.querySelector('.enhance__counter') as HTMLElement;
        if (this.getEngine().enhanceUsages) this.updateUsages(this.getEngine().enhanceUsages);
    }

    createAutofiller() {
        this.autofillerEl = this.el.querySelector('.enhance__autofiller') as HTMLElement;
        const autofillerOptions = {
            btnTip: (i: number) => _t('advanced_craftsman_choose_bag %val%', {
                '%val%': i
            }),
            btnFn: (items: any) => this.autofillFrom(items),
            storageName: ServerStorageData.ENCHANT_AUTOFILLER,
            filters: {
                cl: [{
                        key: ItemData.CL.ONE_HAND_WEAPON,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: ItemData.CL.TWO_HAND_WEAPON,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: ItemData.CL.ONE_AND_HALF_HAND_WEAPON,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: ItemData.CL.DISTANCE_WEAPON,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: ItemData.CL.HELP_WEAPON,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: ItemData.CL.WAND_WEAPON,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: ItemData.CL.ORB_WEAPON,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: ItemData.CL.ARMOR,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: ItemData.CL.HELMET,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: ItemData.CL.BOOTS,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: ItemData.CL.GLOVES,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: ItemData.CL.RING,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: ItemData.CL.NECKLACE,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: ItemData.CL.SHIELD,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: ItemData.CL.QUIVER,
                        checked: true,
                        groupId: 1
                    },
                    {
                        key: specialFilters.PER_TYPE,
                        checked: false,
                        groupId: 1,
                        label: _t('per-type', null, 'autofiller')
                    }
                ],
                // rarity: Object.keys(itemRarity).map(rarity => ({ key: rarity, checked: true, groupId: 2 })),
            },
            configWindow: {
                title: _t('advanced_craftsman'),
                heading: this.tLang('info6'),
                cssClass: '',
                groups: [{
                        id: 1,
                        title: _t('itemKinds', null, 'autofiller')
                    },
                    // { id: 2,  title: _t('itemKinds', null, 'autofiller') }
                ],
            },
            itemGrabberOptions: {
                allow: {
                    cls: [],
                    stats: [{
                            name: 'rarity',
                            params: ['===', 'common']
                        },
                        // ['rarity', ['includes', ['common', 'legendary']]],
                        {
                            name: 'lvl',
                            params: ['>=', 20]
                        }
                    ],
                },
                deny: {
                    stats: ['artisan_worthless', 'soulbound', 'permbound'],
                }
            }
        }
        this.autofiller = new Autofiller(autofillerOptions);
        this.autofiller.disabled();
        this.autofillerEl.appendChild(this.autofiller.getContent());
    }

    autofillFrom(items: any) {
        this.addManyReagentItems(items);
    }

    droppableInit() {
        $(this.reagentsGridEl).droppable({
            accept: '.inventory-item',
            drop: (e, ui) => {
                ui.draggable.css('opacity', '');
                this.getEnhancement().onClickInventoryItem(ui.draggable.data('item'));
            }
        });
    }

    onClickReagent(i: any) {
        if (this.addReagentsBlock || this.getEnhancement().requestBlock) return;
        const itemId = i.id;

        if (!this.selectedInventoryItems.includes(itemId)) {
            if (!this.canSelectNextItem()) return;
            this.selectedInventoryItems.push(itemId);
            i.on('delete', () => this.onReagentDelete(itemId));
            this.sendReagentsRequest(i);
        } else {
            this.reagentDelete(i.id, true);
        }
    }

    isCorrectReagent(i: any) {
        const enhancedItem = this.getEngine().items.getItemById(this.getEnhancement().selectedEnhanceItem);
        if (enhancedItem.id === i.id) return false;

        const hasTargetRarity = isset(i._cachedStats.target_rarity);
        return !hasTargetRarity || (hasTargetRarity && i._cachedStats.target_rarity === enhancedItem.itemTypeName);
    }

    onReagentDelete(itemId: number) {
        removeFromArray(this.selectedInventoryItems, itemId);
        this.deboucedReagentDelete(itemId);
    }

    deboucedReagentDelete = debounce((itemId: number) => { // ugly but it's the only solution
        this.reagentDelete(itemId);
    }, 10);

    onEmptyReagents() {
        this.getEnhancement().onEmptyReagents();
    }

    reagentDelete(itemId: number, byClick: boolean = false) { // unselect item or external - e.g. change battle set
        const i = this.getEngine().items.getItemById(itemId);
        removeFromArray(this.selectedInventoryItems, itemId);
        if (this.selectedInventoryItems.length > 0) {
            this.sendReagentsRequest(i, false);
        } else {
            this.removeReagentItem(itemId);
            if (byClick) this.onEmptyReagents();
        }
    }

    sendReagentsRequest(i: any, addItem = true) { // addItem - add or remove
        this.getEnhancement().sendRequest(this.getEnhancement().RT.CHECK_PROGRESS, this.selectedInventoryItems, () => {
            if (addItem) {
                if (this.isCorrectReagent(i)) { // bad solution - it should be before request but engine need send error message
                    this.addReagentItem(i);
                } else {
                    removeFromArray(this.selectedInventoryItems, i.id);
                }
            } else {
                if (isset(i)) this.removeReagentItem(i.id);
            }
        });
        // this.sendRequest(this.RT.ADD_COMPONENT_ITEM);
    }

    addManyReagentItems(items: any[]) {
        let i = 0;
        for (const item of items) {
            if (this.isCorrectReagent(item) && !this.isReagentItemIsSelectedAlready(item.id) && this.canSelectNextItem()) {
                i++;
                this.selectedInventoryItems.push(item.id);
                this.addReagentItem(item);
            }
        }

        if (i > 0) {
            this.getEnhancement().sendRequest(this.getEnhancement().RT.CHECK_PROGRESS, this.selectedInventoryItems);
        }
    }

    isReagentItemIsSelectedAlready(itemId: number) {
        return this.selectedInventoryItems.includes(itemId);
    }

    addReagentItem(i: any) {
        let slot: number[] | null = null;
        for (var y = 0; y < this.reagentsGridSize.y; y++) {
            for (var x = 0; x < this.reagentsGridSize.x; x++) {
                if (!isset(this.reagentSlots[x + ',' + y])) {
                    slot = [x, y];
                    break;
                }
            }
            if (slot) break;
        }

        if (slot !== null) {
            this.reagentSlots[slot[0] + ',' + slot[1]] = i.id;
            //let itemEl = this.getEngine().items.createViewIcon(i.id, 'enhance-reagent')[0][0];
            let itemEl = this.getEngine().items.createViewIcon(i.id, this.getEngine().itemsViewData.ENHANCE_REAGENT_VIEW)[0][0];
            itemEl.dataset.item = i;
            itemEl.style.top = slot[1] * 32 + slot[1] + 1 + 'px';
            itemEl.style.left = slot[0] * 32 + slot[0] + 1 + 'px';

            this.reagentsGridEl.appendChild(itemEl);

            itemEl.addEventListener('click', () => {
                this.onClickReagent(i);
            });

            itemEl.addEventListener('contextmenu', (e: any) => {
                let callback = {
                    txt: _t('move', null, 'item'),
                    f: () => {
                        this.onClickReagent(i);
                    }
                };

                i.createOptionMenu(e, callback, {
                    move: true,
                    use: true,
                    split: true,
                    drop: true,
                    itemId: true,
                    destroy: true,
                    enhance: true,
                    attachToQuickItems: true,
                    moveToEnhancement: true
                });
            });

            //this.getEngine().itemsMovedManager.addItem(i, 'enhance', () => {
            this.getEngine().itemsMovedManager.addItem(i, this.getEngine().itemsMovedData.ENHANCE, () => {
                this.onClickReagent(i);
            });
        }
        this.setEnchantConfirmButton();
    }

    removeReagentItem(itemId: number) {
        for (const key in this.reagentSlots) {
            if (this.reagentSlots[key] == itemId) delete this.reagentSlots[key];
        }
        removeFromArray(this.selectedInventoryItems, itemId);
        // this.getEngine().items.deleteViewIconIfExist(itemId, 'enhance-reagent');
        this.getEngine().items.deleteViewIconIfExist(itemId, this.getEngine().itemsViewData.ENHANCE_REAGENT_VIEW);
        this.getEngine().itemsMovedManager.removeItem(itemId);
        this.setEnchantConfirmButton();
    }

    canSelectNextItem() {
        const selectedItemsAmount = this.selectedInventoryItems.length;
        // return selectedItemsAmount < this.maxReagentsLimit && !this.getEnhancement().progressbar.isFull();
        return selectedItemsAmount < this.maxReagentsLimit;
    }

    createConfirmButton() {
        const opts = {
            selector: '.enhance__submit',
            txt: this.tLang('submit_btn'),
            classes: ['small', 'green', 'disable'],
            onClick: this.confirmOnClick.bind(this)
        };
        const
            confirmButton = createButton(opts.txt, opts.classes, opts.onClick),
            buttonEl = this.el.querySelector(opts.selector) as HTMLElement;

        buttonEl.appendChild(confirmButton);
    }

    setEnchantConfirmButton() { // zaklinaj
        const confirmBtnEl = this.el.querySelector('.enhance__submit .button') as HTMLElement;
        if (Object.keys(this.reagentSlots).length > 0) {
            confirmBtnEl.classList.remove('disable');
        } else {
            confirmBtnEl.classList.add('disable');
        }
    };

    confirmOnClick() {
        const
            confirmationQueue = new ConfirmationQueue(),
            enhancedItem = this.getEngine().items.getItemById(this.getEnhancement().selectedEnhanceItem) as Item,
            doEnchant = () => this.getEnhancement().sendRequest(this.getEnhancement().RT.ENCHANT, this.selectedInventoryItems, this.afterEnchant.bind(this));

        confirmationQueue
            .addCondition(() => true, this.tLang('confirm-prompt')) // default confirm
            .addCondition(() => checkReducedRequirementItems(this.selectedInventoryItems), _t('reduced-requirement-item-confirm')) // reduced requirement items
            .addCondition(() => checkBetterItemClass(this.selectedInventoryItems, enhancedItem), _t('better-item-class-confirm')) // better class item
            .addCondition(() => checkEnhancedItems(this.selectedInventoryItems), _t('enhanced-item-confirm')) // enchanted item
            .addCondition(() => checkPersonalItems(this.selectedInventoryItems), _t('personal-item-confirm')) // personal item
            .processConditions(doEnchant);
    }

    afterEnchant(v: any) {
        // this.getEnhancement().requestBlock = false;
        // this.clearReagents();
    }

    setEnchantDisableState(state: boolean = true) { // true is disabled
        if (state) {
            this.el.classList.add('disabled');
            this.addReagentsBlock = true;
            this.setReagentsDisableState(true);
        } else {
            this.el.classList.remove('disabled');
            this.addReagentsBlock = false;
            this.setReagentsDisableState(false);
        }
        this.setEnchantConfirmButton();
    }

    setReagentsDisableState(state: boolean = true) {
        if (state) {
            this.reagentsGridEl.classList.add('disabled');
            this.autofiller.disabled();
            this.addReagentsBlock = true;
        } else {
            this.autofiller.enabled();
            this.reagentsGridEl.classList.remove('disabled');
            this.addReagentsBlock = false;
        }
        this.setEnchantConfirmButton();
    }

    updateUsages({
        count,
        limit
    }: {
        count: number,
        limit: number
    }) {
        this.usageCounterEl.textContent = `${count}/${limit}`;
    }

    update({
        data,
        disable
    }: {
        data ? : Data,
        disable ? : boolean
    }) {
        if (typeof disable !== 'undefined') {
            this.setEnchantDisableState(disable);
        }
    }

    clearReagents() {
        this.selectedInventoryItems = [];
        this.reagentSlots = {};
        // this.getEngine().items.deleteAllViewsByViewName('enhance-reagent');
        this.getEngine().items.deleteAllViewsByViewName(this.getEngine().itemsViewData.ENHANCE_REAGENT_VIEW);

        const enhanceItem = this.getEnhancement().selectedEnhanceItem ? [this.getEnhancement().selectedEnhanceItem] : []
        //this.getEngine().itemsMovedManager.removeItemsByTarget('enhance', enhanceItem); // uncheck overflow selected items
        this.getEngine().itemsMovedManager.removeItemsByTarget(this.getEngine().itemsMovedData.ENHANCE, enhanceItem); // uncheck overflow selected items

        this.setEnchantConfirmButton();
    }

    reset() {
        this.setEnchantDisableState(false);
        this.setReagentsDisableState(true);
        this.setEnchantConfirmButton();
        this.clearReagents();
    }

    destroy() {
        this.autofiller.reset();
    }

    tLang(name: string, category: string = 'enhancement') {
        return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, null, category) : '';
    };

    getEnhancement() {
        return this.getEngine().crafting.enhancement;
    }

    getEngine() {
        return Engine;
    }
}