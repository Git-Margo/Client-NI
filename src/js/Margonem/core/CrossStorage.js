const CrossStorageClient = require('cross-storage').CrossStorageClient;

module.exports = function() {
    this.storage = null;
    this.isConnected = false;

    this.init = async (autostart = true) => {
        if (autostart) {
            this.initService();
            await this.connectToService();
        }
    };

    this.initService = () => {
        const hitUrl = this.getHitUrl();
        this.storage = new CrossStorageClient(hitUrl);
    };

    this.connectToService = async () => {
        await this.storage.onConnect().then(() => {
            this.isConnected = true;
            this.unlockGameInterface();
        }, (err) => {
            this.unlockGameInterface();
        });
    };

    this.unlockGameInterface = () => {
        this.getEngine().interface.lock.unlock('crossStorage');
    }

    this.getHitUrl = () => {
        const commonUrl = this.getCommonsUrl();
        return `${commonUrl}/cross-storage/hub.html`;
    };

    this.getCommonsUrl = () => {
        return __build.commonsURL;
    }

    this.set = (key, value) => {
        if (typeof value === 'string') {
            return this.storage.set(key, value);
        } else {
            return this.storage.set(key, JSON.stringify(value));
        }
    };

    this.get = (key) => {
        return this.storage.get(key);
    };

    this.getEngine = () => {
        return Engine;
    }
};