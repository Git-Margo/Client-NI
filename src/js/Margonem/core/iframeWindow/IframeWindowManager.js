var IframeWindow = require('@core/iframeWindow/IframeWindow');
module.exports = function() {

    const list = {};

    const init = () => {

    };

    const check = (url) => !!list[url];

    const add = (url, contentClass, wndData, closeCallback) => {
        if (check(url)) return;

        list[url] = new IframeWindow();
        list[url].init(url, contentClass, wndData, closeCallback);
    }

    const close = (url) => {
        list[url].close();
    }

    const remove = (url) => {
        delete list[url];
    }

    const newPlayerProfile = (opts) => {
        let url;
        const options = {
            staticUrl: false,
            accountId: '',
            characterId: '',
            worldName: Engine.worldConfig.getWorldName(),
            contentClass: 'iframe-profile-wnd',
            wndData: {
                title: _t('preview', false, 'shop')
            },
            ...opts
        }

        if (options.staticUrl) {
            url = options.staticUrl.replace('#', '?source=client#');
        } else {
            if (options.accountId === '') {
                throw new Error('[IframeWindowManager.js, newPlayerProfile] If you want create profile link you need provide accountId');
            }
            const char = options.characterId ? `#char_${options.characterId},${options.worldName}` : '';
            url = `https://www.margonem.pl/profile/view,${options.accountId}?source=client${char}`;
        }
        add(url, options.contentClass, options.wndData);
    }

    const newClanPage = (opts) => {
        let url;
        const options = {
            staticUrl: false,
            clanId: '',
            worldName: Engine.worldConfig.getWorldName(),
            contentClass: 'iframe-clan-page-wnd',
            wndData: {
                title: _t('preview', false, 'shop')
            },
            ...opts
        }

        if (options.staticUrl) {
            url = options.staticUrl + '?source=client';
        } else {
            if (options.clanId === '') {
                throw new Error('[IframeWindowManager.js, newClanPage] If you want create clan link you need provide clanId');
            }
            url = `https://www.margonem.pl/guilds/view,${options.worldName},${options.clanId}?source=client`;
        }
        add(url, options.contentClass, options.wndData);
    }

    const integrationPage = (opts) => {
        const url = "https://www.margonem.pl/config?source=client#inne";
        const options = {
            contentClass: 'iframe-integration-page-wnd',
            wndData: {
                title: _t('integration')
            },
            ...opts
        }
        add(url, options.contentClass, options.wndData);
    }

    this.init = init;
    this.add = add;
    this.remove = remove;
    this.close = close;
    this.check = check;
    this.list = list;
    this.newPlayerProfile = newPlayerProfile;
    this.newClanPage = newClanPage;
    this.integrationPage = integrationPage;

}