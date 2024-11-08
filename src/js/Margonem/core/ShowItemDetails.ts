import {
    copyToClipboard
} from './HelpersTS';

const tpl = require('core/Templates');
const ItemLocation = require('core/items/ItemLocation');

declare const CFG: any;
declare const _t: any;
declare const isset: Function;
declare const mAlert: Function;
declare const createNiInput: ({}: any) => JQuery;

type ItemType = 'common' | 'unique' | 'heroic' | 'upgraded' | 'legendary';

enum rowType {
    ID = 'id',
        NAME = 'name',
        UNBIND_COST = 'unbind_price',
        SALVAGE_ITEMS = 'extract_value',
        ENHANCEMENT_POINTS = 'enhance_value',
}

module.exports = class ShowItemDetails {
    private wnd: any;

    private item: any;
    private itemId: number;
    private isItem: boolean;

    private contentEl!: HTMLElement;
    private itemSlotEl!: HTMLElement;
    private rowsEl!: HTMLElement;

    private creditsIcon = '/img/draconite_small.gif';
    private itemTypes = {
        common: {
            extIcon: CFG.a_ipath + '/neu/ese_zwycz.gif',
            enhIcon: CFG.a_ipath + '/upg/comm_enh_ball.gif',
        },
        unique: {
            extIcon: CFG.a_ipath + '/neu/ese_unikat.gif',
            enhIcon: CFG.a_ipath + '/upg/uniq_enh_ball.gif',
        },
        heroic: {
            extIcon: CFG.a_ipath + '/neu/ese_hero.gif',
            enhIcon: CFG.a_ipath + '/upg/hero_enh_ball.gif',
        },
        upgraded: {
            extIcon: CFG.a_ipath + '/neu/ese_ulep.gif',
            enhIcon: CFG.a_ipath + '/upg/upgr_enh_ball.gif',
        },
        legendary: {
            extIcon: CFG.a_ipath + '/neu/pyl-sakryfikacji.gif',
            enhIcon: CFG.a_ipath + '/upg/lege_enh_ball.gif',
        },
    };

    constructor(item: any) {
        this.item = item;
        this.isItem = item.isItem();
        this.itemId = Math.abs(parseInt(item.id));
        if (this.isExist()) return;

        this.getEngine().itemDetailWindows.push(this.itemId);
        this.setContent();
        this.initWindow();
        this.show(item);
        item.on('delete', () => {
            this.close();
        });
    }

    isExist() {
        return this.getEngine().itemDetailWindows.includes(this.itemId);
    }

    setContent() {
        this.contentEl = tpl.get('item-details')[0] as HTMLElement;
        this.itemSlotEl = this.contentEl.querySelector('.item-details__slot') as HTMLElement;
        this.rowsEl = this.contentEl.querySelector('.item-details__rows') as HTMLElement;
    }

    show(item: any) {
        let $itemIcon;
        if (this.isItem) {
            $itemIcon = this.getEngine().items.createViewIcon(item.id, Engine.itemsViewData.ITEM_DETAILS_VIEW)[0];
        } else {
            $itemIcon = this.getEngine().tpls.createViewIcon(item.id, Engine.itemsViewData.ITEM_DETAILS_VIEW, item.loc)[0];
        }

        this.itemSlotEl.appendChild($itemIcon[0]);
        this.createRows(item);

        this.wnd.center();
    }

    createRows(item: any) {
        const {
            name,
            itemTypeName: type,
            hid
        } = item;

        this.rowsEl.appendChild(this.createRow(rowType.NAME, name, type));

        if (isset(hid) && !ItemLocation.isPromoItemLoc(item.loc)) {
            const id = 'ITEM#' + hid + '.' + this.getEngine().worldConfig.getWorldName();
            this.rowsEl.appendChild(this.createRow(rowType.ID, id, type));
        }

        if (isset(item.unbindCost)) {
            this.rowsEl.appendChild(this.createRow(rowType.UNBIND_COST, item.unbindCost.toString(), type));
        }

        if (isset(item.salvageItems)) {
            this.rowsEl.appendChild(this.createRow(rowType.SALVAGE_ITEMS, item.salvageItems.toString(), type));
        }

        if (isset(item.enhancementPoints)) {
            this.rowsEl.appendChild(this.createRow(rowType.ENHANCEMENT_POINTS, item.enhancementPoints.toString(), type));
        }
    }

    initWindow() {
        this.getEngine().windowManager.add({
            content: this.contentEl,
            title: this.tLang('details'),
            //nameWindow: 'ItemDetails',
            nameWindow: this.getEngine().windowsData.name.ITEM_DETAILS,
            type: this.getEngine().windowsData.type.TRANSPARENT,
            addClass: 'item-details-wnd',
            objParent: this,
            nameRefInParent: 'wnd',
            onclose: () => {
                this.close();
            },
        });

        this.wnd.addToAlertLayer();
    }
    //createNiInput({})
    createRow(rType: rowType, value: string, itemType: ItemType) {
        const rowEl = tpl.get('item-details-row')[0] as HTMLElement;
        const contEl = rowEl.querySelector('.item-details__content') as HTMLElement;
        const btnEl = rowEl.querySelector('.item-details__copy-btn') as HTMLElement;
        let iconUrl;
        let specificContent;

        switch (rType) {
            case rowType.UNBIND_COST:
                iconUrl = this.creditsIcon;
                specificContent = this.createSpecificRowContent(value, iconUrl, rType);
                contEl.appendChild(specificContent);
                btnEl.parentNode!.removeChild(btnEl); // remove copy button for this row
                break;
            case rowType.SALVAGE_ITEMS:
                iconUrl = this.itemTypes[itemType].extIcon;
                specificContent = this.createSpecificRowContent(value, iconUrl, rType);
                contEl.appendChild(specificContent);
                btnEl.parentNode!.removeChild(btnEl); // remove copy button for this row
                break;
            case rowType.ENHANCEMENT_POINTS:
                iconUrl = this.itemTypes[itemType].enhIcon;
                specificContent = this.createSpecificRowContent(value, iconUrl, rType);
                contEl.appendChild(specificContent);
                btnEl.parentNode!.removeChild(btnEl); // remove copy button for this row
                break;
            default:
                const inputWrapper = createNiInput({
                    readonly: true
                })[0] as HTMLElement;
                const inputEl = inputWrapper.querySelector('input') as HTMLInputElement
                inputEl.value = value;
                contEl.appendChild(inputWrapper);
        }

        $(btnEl).tip(this.tLang('copy'));
        btnEl.addEventListener('click', () => {
            copyToClipboard(value);
        });

        return rowEl;
    }

    createSpecificRowContent(value: string, iconUrl: string, type: rowType) {
        const specificRowEl = tpl.get('item-details-special-row')[0] as HTMLElement;
        const txtEl = specificRowEl.querySelector('.item-details__txt') as HTMLElement;
        const valEl = specificRowEl.querySelector('.item-details__val') as HTMLElement;
        const icoEl = specificRowEl.querySelector('.item-details__ico') as HTMLElement;
        txtEl.innerHTML = this.tLang(type);
        valEl.innerHTML = value;
        icoEl.style.backgroundImage = `url('${iconUrl}')`;
        return specificRowEl;
    }

    getEngine() {
        return Engine;
    }

    tLang(name: string, category: string = 'item_id', val: {} | null = null) {
        return typeof RUNNING_UNIT_TEST === 'undefined' ? _t(name, val, category) : '';
    }

    close() {
        this.getEngine().itemDetailWindows = this.getEngine().itemDetailWindows.filter(
            (item: number) => item !== this.itemId,
        );
        this.wnd.hide();
        if (this.isItem) {
            this.getEngine().items.deleteViewIconIfExist(this.itemId, Engine.itemsViewData.ITEM_DETAILS_VIEW);
        } else {
            this.getEngine().tpls.deleteViewIconIfExist(this.itemId, Engine.itemsViewData.ITEM_DETAILS_VIEW);
        }
    }
};