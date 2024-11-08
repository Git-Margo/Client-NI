import {
    isset,
    sameClGroup
} from '../../HelpersTS';

export {}

const Tpl = require('core/Templates');
const ItemState = require('core/items/ItemState');
import Progressbar from './Progressbar';
import Enchant from './Enchant';
import Upgrade from './Upgrade';

declare const Engine: any;
declare const removeClassStartingWith: any;

export default class Enhancement {

    private contentEl!: HTMLElement;
    private enhanceItemSlotCurrent!: HTMLElement;
    private enhanceItemSlotReceive!: HTMLElement;
    private enhanceItemSlotCurrentLvl!: HTMLElement;
    private enhanceItemSlotReceiveLvl!: HTMLElement;

    private upgradeLvl: number = 0;
    private maxUpgradeLvl: number = 5;

    private topInfoEl!: HTMLElement;

    private selectedEnhanceItem: number | null = null;

    private requestBlock: boolean = false;

    private progressbar!: Progressbar;
    private enchant!: Enchant;
    private upgrade!: Upgrade;

    public RT = { // request types
        SET_ENHANCE_ITEM: 'SET_ENHANCE_ITEM',
        CHECK_PROGRESS: 'CHECK_PROGRESS',
        ENCHANT: 'ENCHANT',
        UPGRADE: 'UPGRADE',
    }

    constructor(private wndEl: HTMLElement) {
        this.createContent();
        this.initScroll();
        //this.getEngine().items.fetch('u', this.newReceivedItem.bind(this));
        this.getEngine().items.fetch(this.getEngine().itemsFetchData.NEW_ENHANCEMENT_RECEIVED_ITEM, this.newReceivedItem.bind(this));
        // this.getEngine().disableItemsManager.startSpecificItemKindDisable('enhance');
        this.dimStartDefault();
        this.getEngine().interfaceItems.setDisableSlots('enhance');
    }

    createContent() {
        const template = Tpl.get('enhance')[0];
        this.contentEl = this.wndEl.querySelector('.enhancement-content') as HTMLElement;
        this.contentEl.innerHTML = '';
        this.contentEl.appendChild(template);

        this.topInfoEl = this.contentEl.querySelector('.enhance__info--top') as HTMLElement;
        this.enhanceItemSlotCurrent = this.contentEl.querySelector('.enhance__item--current .slot') as HTMLElement;
        this.enhanceItemSlotCurrentLvl = this.contentEl.querySelector('.enhance__item--current .lvl') as HTMLElement;
        this.enhanceItemSlotReceive = this.contentEl.querySelector('.enhance__item--receive .slot') as HTMLElement;
        this.enhanceItemSlotReceiveLvl = this.contentEl.querySelector('.enhance__item--receive .lvl') as HTMLElement;

        const enchantEl = this.contentEl.querySelector('.enhance__enchant') as HTMLElement;
        this.enchant = new Enchant(enchantEl);

        const progressbarEl = this.contentEl.querySelector('.enhance__progressbar') as HTMLElement;
        this.progressbar = new Progressbar(progressbarEl);

        const upgradeEl = this.contentEl.querySelector('.enhance__enhance') as HTMLElement;
        this.upgrade = new Upgrade(upgradeEl);
    }

    initScroll() {
        $(this.contentEl).find('.scroll-wrapper').addScrollBar({
            track: true
        });
    };

    updateScroll() {
        $('.scroll-wrapper', $(this.contentEl)).trigger('update');
    };

    newReceivedItem(item: any) {
        // const iconEl = this.getEngine().items.createViewIcon(item.id, 'enhance-require-item', 'u')[0][0];
        const iconEl = this.getEngine().items.createViewIcon(item.id, this.getEngine().itemsViewData.ENHANCE_REQUIRE_ITEM_VIEW, 'u')[0][0];
        this.enhanceItemSlotReceive.appendChild(iconEl);
        item.on('afterUpdate', () => this.receivedItemAfterUpdate(item, iconEl));

        iconEl.addEventListener('contextmenu', (e: any) => {
            item.createOptionMenu(e, false, {
                itemId: true
            });
        });


        this.receivedItemAfterUpdate(item, iconEl);
    }

    receivedItemAfterUpdate(item: any, iconEl: any) {
        this.setUpgradeLvl(true, item);
        item.updadeViewAfterUpdateItem($(iconEl));
    }

    setUpgradeLvl(received: boolean = true, item ? : any) {
        let itemUpgradeLvlEl = received ? this.enhanceItemSlotReceiveLvl : this.enhanceItemSlotCurrentLvl;
        let upgradeLvl = parseInt(isset(item) && isset(item._cachedStats.enhancement_upgrade_lvl) ? item._cachedStats.enhancement_upgrade_lvl : 0)
        let oldUpgradeLvl = parseInt(itemUpgradeLvlEl.getAttribute('data-lvl') as string);
        if (upgradeLvl !== oldUpgradeLvl) {
            this.changeLvlAnim();
            itemUpgradeLvlEl.setAttribute('data-lvl', upgradeLvl.toString())
            let lvlStar = itemUpgradeLvlEl.querySelector('.cl-icon') as HTMLElement;
            removeClassStartingWith(lvlStar, 'icon-star-');
            lvlStar.classList.add(`icon-star-${upgradeLvl}`)
        }
    }

    changeLvlAnim() {
        this.enhanceItemSlotReceiveLvl.classList.add('upper');
        setTimeout(() => {
            this.enhanceItemSlotReceiveLvl.classList.remove('upper');
        }, 200)
    }

    sendRequest(requestType: string, selectedInventoryItems: [] = [], callback ? : () => void) {
        if (!this.selectedEnhanceItem) return;

        const reagentIds = selectedInventoryItems.join(",");
        switch (requestType) {
            case this.RT.SET_ENHANCE_ITEM:
                this.requestBlock = true;
                _g(`enhancement&action=status&item=${this.selectedEnhanceItem}`, this.afterRequest.bind(this));
                break;
            case this.RT.CHECK_PROGRESS:
                this.requestBlock = true;
                _g(`enhancement&action=progress_preview&item=${this.selectedEnhanceItem}&ingredients=${reagentIds}`, () => {
                    if (callback) callback();
                    this.requestBlock = false;
                });
                break;
            case this.RT.ENCHANT:
                _g(`enhancement&action=progress&item=${this.selectedEnhanceItem}&ingredients=${reagentIds}`, callback);
                break;
                // case this.RT.UPGRADE:
                //   _g(`enhancement&action=upgrade&item=${this.selectedEnhanceItem}`, callback);
                //   break;
        }
    }

    afterRequest({
        enhancement
    }: any) {
        this.requestBlock = false;
        if (isset(enhancement) && (isset(enhancement.upgradable || enhancement.progressing || enhancement.completed))) {
            this.addItemToEnchant();
        }
    }

    addItemToEnchant() {
        let item = this.getEngine().items.getItemById(this.selectedEnhanceItem);
        let iconEl = this.getEngine().items.createViewIcon(item.id, this.getEngine().itemsViewData.ENHANCE_ITEM_VIEW)[0][0];

        iconEl.addEventListener('click', () => {
            this.onClickInventoryItem(item);
        });

        iconEl.addEventListener('contextmenu', (e: any) => {
            let callback = {
                txt: _t('move', null, 'item'),
                f: () => {
                    this.onClickInventoryItem(item);
                }
            };

            item.createOptionMenu(e, callback, {
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

        // this.getEngine().itemsMovedManager.addItem(item, 'enhance', () => {
        this.getEngine().itemsMovedManager.addItem(item, this.getEngine().itemsMovedData.ENHANCE, () => {
            this.onClickInventoryItem(item);
        });
        item.on('delete', () => this.clearAll());
        this.enhanceItemSlotCurrent.innerHTML = '';
        this.enhanceItemSlotCurrent.appendChild(iconEl);

        item.on('afterUpdate', () => this.enchantItemAfterUpdate(item.id, iconEl));
        this.enchantItemAfterUpdate(item.id, iconEl);
        this.dimStartIngredients(item._cachedStats['rarity']);
        this.markReagents();
    }

    enchantItemAfterUpdate(itemId: number, iconEl: any) {
        const item = this.getEngine().items.getItemById(itemId);
        this.setUpgradeLvl(false, item);
        this.addUpgradedLevelClass();
        item.updadeViewAfterUpdateItem($(iconEl));
    }

    removeItemFromEnchant() {
        if (this.selectedEnhanceItem != null) {
            const item = this.getEngine().items.getItemById(this.selectedEnhanceItem);
            const iconEl = this.getEngine().items.getViewByIdAndLoc(item.id, this.getEngine().itemsViewData.ENHANCE_ITEM_VIEW);
            item.unregisterCallback('afterUpdate', () => this.enchantItemAfterUpdate(item.id, $(iconEl)));
            item.unregisterCallback('delete', () => this.clearAll());
            this.selectedEnhanceItem = null;
        }
    }

    addUpgradedLevelClass() {
        const contentInnerEl = this.contentEl.querySelector('.enhance__content') as HTMLElement;
        this.removeUpgradedLevelClass();
        contentInnerEl.classList.add(`upgraded-${this.upgradeLvl}`);
    }

    removeUpgradedLevelClass() {
        const contentInnerEl = this.contentEl.querySelector('.enhance__content') as HTMLElement;
        removeClassStartingWith(contentInnerEl, 'upgraded-');
    }

    onEmptyReagents() {
        this.sendRequest(this.RT.SET_ENHANCE_ITEM);
    }

    onClickInventoryItem(i: any) { // click or drop on grid
        if (this.requestBlock) return;
        const itemId = parseInt(i.id);
        if (!this.selectedEnhanceItem) {
            this.selectedEnhanceItem = itemId;
            this.sendRequest(this.RT.SET_ENHANCE_ITEM);
            return;
        }

        if (this.selectedEnhanceItem === itemId) {
            this.clearAll();
            return;
        }

        //if (i.st !== 0) return;
        if (!ItemState.isInBagSt(i.st)) return;

        this.enchant.onClickReagent(i);
    }

    update(v: any) {
        this.requestBlock = false;
        this.enchant.setReagentsDisableState(false);
        this.enchant.setEnchantConfirmButton();

        if (this.getEngine().crafting.tempEnhanceItemId && (isset(v.upgradable) || isset(v.progressing) || isset(v.completed))) {
            if (!this.selectedEnhanceItem) {
                this.selectedEnhanceItem = this.getEngine().crafting.tempEnhanceItemId;
                this.addItemToEnchant();
                this.getEngine().crafting.tempEnhanceItemId = null;
            }
        }

        if (isset(v.progressing)) {
            this.upgradeLvl = v.progressing.upgradeLevel;
            this.progressbar.update({
                current: v.progressing.current,
                max: v.progressing.max,
                upgradeLevel: v.progressing.upgradeLevel
            });
            this.enchant.clearReagents();
        }
        if (isset(v.progress_preview)) {
            this.progressbar.update({
                gained: v.progress_preview.gained,
                current: v.progress_preview.current,
                max: v.progress_preview.max,
                upgradeLevel: v.progress_preview.upgradeLevel
            });
        }
        if (isset(v.upgradable)) {
            this.upgradeLvl = v.upgradable.upgradeLevel;
            this.enchant.reset();
            this.progressbar.update({
                current: v.upgradable.current,
                max: v.upgradable.max,
                upgradeLevel: v.upgradable.upgradeLevel
            });
            this.upgrade.update({
                data: v.upgradable,
                disable: false
            });
            this.enchant.setReagentsDisableState(true);
            // if (v.upgradable.upgradeLevel === 4) {
            this.enchant.setEnchantDisableState(true);
            this.setTopInfo(true);
            // }
            this.unmarkReagents();
        }
        if (isset(v.completed)) {
            this.upgradeLvl = this.maxUpgradeLvl;
            this.onCompleted();
        }
        if (isset(v.usages_preview)) {
            this.getEngine().enhanceUsages = v.usages_preview;
            this.enchant.updateUsages(this.getEngine().enhanceUsages);
        }

        this.updateScroll();
    }

    public getReagentBonus(item: any) {
        const enhancedItem = this.getEngine().items.getItemById(this.selectedEnhanceItem);
        if (!isset(item) || !this.canMarkItems() || isset(item._cachedStats['target_rarity'])) return false;
        // if (item.st > 0) return false;
        if (ItemState.isEquippedSt(item.st)) return false;
        if (item.tpl === enhancedItem.tpl) return 4;
        if (item.itemTypeName === enhancedItem.itemTypeName && sameClGroup([item.cl, enhancedItem.cl])) return 3;
        if (item.itemTypeName === enhancedItem.itemTypeName) return 2;
        if (sameClGroup([item.cl, enhancedItem.cl])) return 1;
        return false;
    }

    canMarkItems() {
        return !(this.upgradeLvl === this.maxUpgradeLvl || // 5
            (this.upgradeLvl === (this.maxUpgradeLvl - 1) && this.progressbar.isFull())) // 4 and progressbar is full
    }

    markReagents() {
        if (!this.canMarkItems()) return;

        let enableItems = this.getEngine().disableItemsManager.getEnabledItems();
        if (enableItems.includes(this.selectedEnhanceItem)) {
            enableItems = enableItems.filter((item: number) => item !== this.selectedEnhanceItem)
        }
        this.getEngine().itemsMarkManager.markEnhanceReagentItems(enableItems);
    }

    unmarkReagents() {
        this.getEngine().itemsMarkManager.unmarkEnhanceReagentItems();
    }

    setTopInfo(isChooseBonus: boolean = false) {
        isChooseBonus ? this.topInfoEl.classList.add('is-bonus') : this.topInfoEl.classList.remove('is-bonus');
    }

    onCompleted() {
        this.enchant.update({
            disable: true
        });
        this.upgrade.update({
            disable: true
        });
        this.progressbar.completed();
        this.getEngine().items.deleteMessItemsByLoc('u'); // remove preview item
    }

    dimStartDefault() {
        this.getEngine().disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.ENHANCE_INGR);
        this.getEngine().disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.ENHANCE);
    }

    dimStartIngredients(targetRarity: string) {
        this.getEngine().disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.ENHANCE);
        this.getEngine().disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.ENHANCE_INGR, {
            linkedConditions: [{
                    classes: [26],
                    stats: ['enhancement_add', {
                        'target_rarity': ['===', targetRarity]
                    }]
                },
                {
                    classes: [26],
                    stats: ['enhancement_add_point', {
                        'target_rarity': ['===', targetRarity]
                    }]
                },
            ]
        });
    }

    upgradeLvlReset() {
        this.setUpgradeLvl(true);
        this.setUpgradeLvl(false);
    }

    clearAll() {
        this.removeItemFromEnchant();
        this.progressbar.reset();
        this.upgrade.reset();
        this.enchant.reset();
        this.setTopInfo();
        this.getEngine().items.deleteMessItemsByLoc('u');
        //this.getEngine().items.deleteAllViewsByViewName('enhance-item');
        this.getEngine().items.deleteAllViewsByViewName(this.getEngine().itemsViewData.ENHANCE_ITEM_VIEW);
        // this.getEngine().itemsMovedManager.removeItemsByTarget('enhance');
        this.getEngine().itemsMovedManager.removeItemsByTarget(this.getEngine().itemsMovedData.ENHANCE);
        // this.getEngine().itemsMovedManager.removeItemsByTarget('enhance-ingr');
        this.getEngine().itemsMovedManager.removeItemsByTarget(this.getEngine().itemsMovedData.ENHANCE_INGR);
        this.unmarkReagents();
        this.removeUpgradedLevelClass();
        this.dimStartDefault();
        this.upgradeLvlReset();
        this.updateScroll();
    }

    close() {
        this.clearAll();
        this.getEngine().crafting.tempEnhanceItemId = null;
        this.upgrade.destroy();
        this.enchant.destroy();
        //this.getEngine().items.removeCallback('u', this.newReceivedItem);
        this.getEngine().items.removeCallback(this.getEngine().itemsFetchData.NEW_ENHANCEMENT_RECEIVED_ITEM);
        this.getEngine().disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.ENHANCE);
        this.getEngine().disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.ENHANCE_INGR);
        this.getEngine().interfaceItems.setEnableSlots('enhance');
        this.getEngine().crafting.enhancement = false;
    }

    tLang(name: string, category: string = 'enhancement') {
        return typeof RUNNING_UNIT_TEST === "undefined" ? _t(name, null, category) : '';
    };

    getEngine() {
        return Engine;
    }
}