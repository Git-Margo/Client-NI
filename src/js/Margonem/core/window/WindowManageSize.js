let Storage = require('core/Storage');

module.exports = function() {

    let moduleData = {
        fileName: "WindowManageSize"
    };
    let sizeArray = null;
    let wnd = null;
    let content = null;
    let sizeOpt = null;
    let name = null;
    let callback = null;

    const DEFAULT_SIZE = 1;
    const WINDOW_OPT_SIZE = "WINDOW_OPT_SIZE";

    const init = (_wnd, _name, _buttonWrapper, _content, _sizeArray, _callback) => {
        setName(_name);
        setSizeArray(_sizeArray);
        setContent(_content);

        if (_callback) setCallback(_callback);
        if (_wnd) setWnd(_wnd);

        createToggleSizeButton(_buttonWrapper);
        initData();
        setSizeWindow();
        managePosOfWndOutOfScreen();
    };

    const initData = () => {
        let sizeOptData = getWindowSizeOptFromStorage();

        setSizeOpt(sizeOptData);
    };

    const toggleSizeOpt = () => {
        setSizeOpt(sizeOpt + 1);

        if (sizeOpt > sizeArray.length - 1) setSizeOpt(0);

        setBattlePredictionHelpWindowSizeOpt();

        setSizeWindow();
        managePosOfWndOutOfScreen();

        callCallback();
    };

    const setBattlePredictionHelpWindowSizeOpt = () => {
        Storage.easySet(sizeOpt, WINDOW_OPT_SIZE, name);
    }

    const getWindowSizeOptFromStorage = () => {
        let sizeOptData = Storage.easyGet(WINDOW_OPT_SIZE, name);

        if (sizeOptData === null) return DEFAULT_SIZE;

        if (isInt(sizeOptData) && -1 < sizeOptData && sizeOptData < sizeArray.length) return sizeOptData;

        errorReport(moduleData.fileName, "getWindowSizeOptFromStorage", "incorrect sizeOptData", sizeOptData);

        return DEFAULT_SIZE;
    };

    const setSizeArray = (_sizeArray) => {
        sizeArray = _sizeArray;
    };

    const setName = (_name) => {
        name = _name
    };

    const setCallback = (_callback) => {
        callback = _callback;
    };

    const setWnd = (_wnd) => {
        wnd = _wnd;
    };

    const setContent = (_content) => {
        content = _content;
    };

    const createToggleSizeButton = (_buttonWrapper) => {
        let $toggleSizeButton = $("<div>").addClass('toggle-size-button');

        $toggleSizeButton.on('click', toggleSizeOpt)

        _buttonWrapper.append($toggleSizeButton);
    };

    const setSizeWindow = () => {
        let opt = sizeArray[sizeOpt];

        let o = {};

        if (opt.w) o.width = opt.w;
        if (opt.h) o.height = opt.h;

        content.css(o);

        //updateScrollbar();
    };

    const managePosOfWndOutOfScreen = () => {
        if (!wnd) return;

        if (!wnd.checkPassTheScreenBounds()) return;

        wnd.setWindowOnLeftTopCorner();

        if (sizeOpt == 0) return;

        if (!wnd.checkPassTheScreenBounds()) return;

        setSizeOpt(0);

        setSizeWindow();

        callCallback();
    };

    const callCallback = () => {
        if (!callback) return

        callback();
    };

    const setSizeOpt = (_sizeOpt) => {
        sizeOpt = _sizeOpt;
    };

    this.init = init;

};