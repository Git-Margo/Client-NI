module.exports = function() {
    let running = false;

    this.checkAllInventoryItems = () => {
        const inventoryItems = Engine.heroEquipment.getInvItems();
        for (const item of Object.values(inventoryItems)) {
            if (this.isGold(item)) {
                //this.useItem(item.id);
                //if (Engine.interface.alreadyInitialised) {
                Engine.heroEquipment.sendUseRequest(item);
                //}
            }
        }
    }

    this.newItem = (item) => {
        if (this.isGold(item)) {
            //this.useItem(item.id);
            //if (Engine.interface.alreadyInitialised) {
            Engine.heroEquipment.sendUseRequest(item);
            //}
        }
    }

    this.isGold = (item) => item.cl === 17 && item.st === 0;

    //this.useItem = (itemId) => {
    //	_g("moveitem&st=1&id=" + itemId);
    //}

    this.start = () => {
        if (running) return;
        running = true;

        // this.checkAllInventoryItems();

        API.addCallbackToEvent(Engine.apiData.AFTER_INTERFACE_START, initAddon);

        if (getAlreadyInitialised()) {
            initAddon();
        }

    };

    const initAddon = () => {
        Engine.items.fetch(Engine.itemsFetchData.FETCH_NEW_ITEM, this.newItem);
    }

    this.stop = () => {
        if (!running) return;
        running = false;

        Engine.items.removeCallback(Engine.itemsFetchData.FETCH_NEW_ITEM);

        API.removeCallbackFromEvent(Engine.apiData.AFTER_INTERFACE_START, initAddon);
    };

};