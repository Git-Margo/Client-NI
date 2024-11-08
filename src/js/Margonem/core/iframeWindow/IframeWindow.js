let tpl = require('core/Templates');

module.exports = function() {

    let wnd;
    let content;
    let url;
    let wndData;
    let contentClass;
    let closeCallback;

    const init = (_url, contentClass, _wndData, _closeCallback) => {
        initData(_url, contentClass, _wndData, _closeCallback);
        initWindow();
        initIframe();
    }

    const initData = (_url, _contentClass, _wndData, _closeCallback) => {
        url = _url;
        wndData = _wndData || {};
        contentClass = _contentClass || '';
        closeCallback = _closeCallback || function() {}
    }

    const initIframe = () => {
        let content = wnd.getContent();
        content.find('.main-iframe').attr('src', url)
    }

    const initWindow = () => {
        let wndDefaultData = {
            content: tpl.get('iframe-window').addClass(contentClass),
            nameWindow: Engine.windowsData.name.DEPO,
            title: '',
            onclose: () => {
                closeCallback();
                close();
            }
        }

        wndData = $.extend(wndDefaultData, wndData)
        wnd = Engine.windowManager.add(wndData);

        wnd.addToAlertLayer();
        wnd.setWndOnPeak();
        wnd.center();
    }

    const close = () => {
        wnd.remove();
        Engine.iframeWindowManager.remove(url);
    }

    this.init = init;
    this.close = close;

}