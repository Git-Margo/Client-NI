import {
    itemRarity,
    Rarities
} from '../items/ItemRarity';
import LnStorage from './LnStorage';
import LnAnimations from './LnAnimations';
import {
    Item
} from '../items/Item';
import {
    Animations
} from './LnData';
import {
    isOwnItem
} from "../HelpersTS";

export default class LegendaryNotificatorNotifier {
    typesToTextNotify = [Rarities.UNIQUE, Rarities.HEROIC, Rarities.LEGENDARY];
    typesToLegendaryNotify = [Rarities.LEGENDARY];
    #hasLegendaryItem = false;

    private LnAnimations: LnAnimations;

    constructor(private LnStorage: LnStorage) {
        this.LnAnimations = new LnAnimations();
        Engine.items.fetch(Engine.itemsFetchData.FETCH_NEW_LOOT_ITEM, this.newItem.bind(this, false));
        Engine.items.fetch(Engine.itemsFetchData.FETCH_NEW_PERSONAL_LOOT_ITEM, this.newItem.bind(this, true));

    }

    newItem(personalLoot: boolean, item: Item, finish: boolean) {
        const shouldSendNotify = personalLoot ? isOwnItem(item) : true;
        if (shouldSendNotify) this.sendTextNotify(item.name, item.itemTypeName);
        if (this.typesToLegendaryNotify.includes(item.itemTypeName)) this.#hasLegendaryItem = true;

        if (this.#hasLegendaryItem && finish) { // one notification for many legendary items
            this.legendaryNotify(item);
            this.#hasLegendaryItem = false;
        }
    }

    legendaryNotify(item: Item) {
        // this.doGlowNotify(item.name, item.itemTypeName);
        this.doConfetti();
        this.playSound();
    }

    doConfetti() {
        const animation: Animations = this.LnStorage.getAnimationName();
        this.LnAnimations.animation(animation);
    }

    playSound() {
        const sound = this.LnStorage.getSoundUrl();
        if (!sound) return;

        const sm = Engine.soundManager;
        sm.createNotifSound(sound, {
            keyAsUrl: true
        });
    }

    // doGlowNotify(name: string, type: Rarities) {}

    sendTextNotify(name: string, type: Rarities) {
        if (this.typesToTextNotify.includes(type) && this.LnStorage.getMessageState()) {
            const {
                color
            } = itemRarity[type];
            const str = _t('earn-item %name%', {
                '%name%': `[color=${color}][${name}][/color]`
            }, 'loottext');
            message(str);
        }
    }

    remove() {
        Engine.items.removeCallback(Engine.itemsFetchData.FETCH_NEW_LOOT_ITEM);
        Engine.items.removeCallback(Engine.itemsFetchData.FETCH_NEW_PERSONAL_LOOT_ITEM);
    }

    test() {
        const t = Engine.heroEquipment.getItemBySt(20);
        const item = {
            1: {
                id: 1,
                hid: t.hid,
                tpl: t.tpl,
                name: t.name,
                own: t.own, //o0.id,
                loc: 'l',
                icon: t.icon,
                x: t.x,
                y: t.y,
                cl: t.cl,
                pr: t.pr,
                st: t.st,
                prc: 'zl',
                stat: 'bag=42;permbound;soulbound;rarity=legendary',
            },
        };
        const loot = {
            endTs: parseInt(Engine.getEv()) + 15,
            init: 1,
            source: 'fight',
            states: {
                1: 1,
            },
        };
        const allData = {
            item
        };
        Engine.communication.dispatcher['on_loot'](loot, allData);
        Engine.communication.dispatcher['on_item'](item);
        // Engine.loots.wnd.addClass('legendary-notificator-animations');
    }
}