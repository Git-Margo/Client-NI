import ShowEq from './ShowEq';

declare const _l: () => void;

type Props = {
    id: number;
    account: number;
    nick: string;
    prof: string;
    lvl: number;
    icon: string;
    world: string;
};

type Windows = {
    [name: string]: ShowEq;
};

module.exports = class ShowEqManager {
    windows: Windows = {};
    lastOpenWindow: number | null = null;

    constructor() {
        this.getEngine().items.fetch(this.getEngine().itemsFetchData.NEW_OTHER_EQ_ITEM, this.setItems.bind(this));
    }

    update(playerData: Props) {
        if (this.windows[playerData.id]) return;
        this.getEqData(playerData);
    }

    getEqData(playerData: Props) {
        const domain = _l(), // 'pl' || 'en'
            dir = playerData.id % 128,
            // world = location.host.split('.')[0],
            world = playerData.world || this.getEngine().worldConfig.getWorldName(),
            url = `https://mec.garmory-cdn.cloud/${domain}/${world}/${dir}/${playerData.id}.json`;

        // $.getJSON(url, (items) => {
        //   this.newWindow(playerData, items);
        // }).fail(() => {
        //   this.newWindow(playerData, {});
        // });

        fetch(url)
            .then((response) => response.json())
            .then((items) => {
                this.newWindow(playerData, items);
            })
            .catch((error) => {
                this.newWindow(playerData, {});
            });
    }

    setItems(i: any) {
        if (this.lastOpenWindow && this.windows[this.lastOpenWindow]) {
            this.windows[this.lastOpenWindow].setItems(i);
        }
    }

    newWindow(playerData: Props, items: any) {
        const newWindow = new ShowEq(playerData);
        this.windows[playerData.id] = newWindow;
        this.lastOpenWindow = playerData.id;
        newWindow.update(items);
    }

    removeWindow(playerId: number) {
        delete this.windows[playerId];
    }

    getEngine() {
        return Engine;
    }
};