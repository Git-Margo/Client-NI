let StorageFuncWindow = require('core/window/StorageFuncWindow');

module.exports = function() {

    let $wrapper;
    let nameWindow;
    let lightModeCss;

    const init = (wnd, _nameWindow, _wrapper, _lightModeCss) => {
        set$Wrapper(_wrapper);
        setNameWindow(_nameWindow);

        if (_lightModeCss != null) setLightModeCss(_lightModeCss);
    };

    const set$Wrapper = (_$wrapper) => {
        $wrapper = _$wrapper
    };

    const setLightModeCss = (_lightModeCss) => {
        lightModeCss = _lightModeCss
    };

    const setNameWindow = (_nameWindow) => {
        nameWindow = _nameWindow
    };

    const setManageOpacity = (val) => {
        let $but = $('<div>', {
            class: 'increase-opacity'
        });
        $wrapper.append($but);
        $but.tip(_t('window-opacity'));
        $but.click(increaseOpacity);
        setSaveOpacityWnd(val);
    };

    const increaseOpacity = () => {
        let opacity = getWindowOpacity();
        opacity = opacity + 1;
        opacity = opacity > 5 ? 0 : opacity;
        setWindowOpacity(opacity);
        saveOpacityInStorage(opacity);
    };

    const addStyles = (style) => {
        const styleEl = stringToHtml(style);
        document.head.appendChild(styleEl);
    };

    const setOpacityOnBackground = (opacity) => {
        $wrapper.attr('data-opacity-lvl', opacity);
    };

    const setWindowOpacity = (opacity) => {
        setOpacityOnBackground(opacity);
        setLightModeStyle(opacity);

    }

    const setLightModeStyle = (opacity) => {
        if (lightModeCss == null) {
            return;
        }

        switch (opacity) {
            case 0:
                addLightModeStyle();
                break;
            case 1:
                removeLightModeStyle();
                break;
        }
    };

    const getStyleId = () => {
        return 'light-mode-style-' + nameWindow;
    }

    const removeLightModeStyle = () => {
        debugger;
        $('#' + getStyleId()).remove();
    }

    const addLightModeStyle = () => {
        let style = `
        <style id=${getStyleId()}>

            ${lightModeCss}

        </style>`;

        addStyles(style)
    };

    const setSaveOpacityWnd = (defaultOpacity) => {
        let opacity = StorageFuncWindow.getOpacityWindow(nameWindow);

        if (opacity == null) {
            opacity = defaultOpacity;
            saveOpacityInStorage(opacity);
        }
        //setOpacityOnBackground(opacity);
        setWindowOpacity(opacity)
    };

    const saveOpacityInStorage = (opacity) => {
        //Store.set(this._nameWindow + '/opacity', opacity);
        StorageFuncWindow.setOpacityWindow(opacity, nameWindow);
    };

    const getWindowOpacity = () => parseInt($wrapper.attr('data-opacity-lvl'));


    this.init = init;
    this.setManageOpacity = setManageOpacity;
}