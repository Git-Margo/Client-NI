module.exports = function() {

    this.defaultDiff = 150;
    this.stasisDiff = 500;
    this.deactivatedCard = 10000;
    this.diff = this.defaultDiff;
    this.lastRequest = (new Date()).getTime();
    let blockSend = false;

    this.tick = function() {
        if (!this.checkCanSendRequest()) return;

        if (Engine.communication.checkCanSendTaskFromTaskQueue()) Engine.communication.sendTaskFromQueue();
        else {

            let data = Engine.serverStorage.getPackageToSendToServerStorage();

            if (data) {
                Engine.serverStorage.createOldDataAndResetNewData();
                Engine.serverStorage.sendDataToServerStorage(data);
            } else _g('_');

        } //request '_' can be send only here!!!! if you send somewhere more, it crush taskQueue!!
    };

    this.checkCanSendRequest = function() {
        if (blockSend) return false;

        var t = (new Date()).getTime();

        let diff = Engine.browserCardManager.getChromeCardActive() ? this.diff : this.deactivatedCard;

        return t - this.lastRequest >= diff && Engine.tickSuccess;
    };

    this.reset = function() {
        this.lastRequest = (new Date()).getTime();
    };

    this.setDiff = (diff) => {
        this.diff = diff;
    };

    this.setDefaultDiff = () => {
        this.setDiff(this.defaultDiff);
    };

    this.setStasisDiff = () => {
        this.setDiff(this.stasisDiff);
    };

    this.setBlockSend = (_blockSend) => {
        blockSend = _blockSend;
    }
};