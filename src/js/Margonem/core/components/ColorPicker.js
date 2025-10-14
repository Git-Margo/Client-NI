var tpl = require('@core/Templates');

module.exports = function() {


    let moduleData = {
        fileName: "ColorPicker.js"
    };
    let standardColors = null;
    let standardIcons = null;
    let $colorPicker = null;
    let $chooseColorBck = null;
    let $chooseIcon = null;
    let $palette = null;

    let colorPickerClb = null;
    let chooseColor = null;
    let chooseIconId = null;

    const init = () => {
        initColorsTab();
        initIcons();
        initTemplate();
        initPickIcon();
        initPalete();
        initChooseColorBtn();
    };

    const updateData = ($wrapper, color, iconId, _clb) => {
        if (iconId != null) {
            setVisibleOfIconMode(true);
            setIconIdAndUpdate(iconId);
        }
        setColorAndUpdate(color);

        if (_clb) setColorPickerClb(_clb);

        appendToWrapper($wrapper);
    };

    const appendToWrapper = ($wrapper) => {
        $wrapper.append($colorPicker)
    };

    const initChooseColorBtn = () => {
        $chooseColorBck.on('click', function(e) {
            e.stopPropagation();
            togglePalette();
        });
    };

    const initIcons = () => {
        standardIcons = {
            0: true, // "SQUARE",
            1: true, // "CIRCLE",
            2: true // "RHOMB"
        }
    }

    const initColorsTab = () => {
        standardColors = [
            '#fc3e40',
            '#767676',
            '#87fdff',
            '#93441c',
            //'#6B3114',
            '#4cfa4f',
            '#fe5afb',
            '#40bfff',
            '#f37125',
            '#a500fc',
            '#ffba37',
            '#eaeaea',
            '#93b900',
            '#fef348',
            '#3559ff',
            '#c71618',
            '#ffa9fe',
            '#46a31d',
            '#292929',
            '#FFFFFF',
            '#D49999',
            '#ACDA22',
            '#B554FF',
            '#FFA500',
            '#B1B7BD',
            '#ec0c0c',
            '#CC32D0'
        ];
    };

    const initTemplate = () => {
        $colorPicker = tpl.get('color-picker');
        $palette = $colorPicker.find('.pick-color-palette');
        $chooseColorBck = $colorPicker.find('.choose-color-bck');
        $chooseIcon = $colorPicker.find('.choose-icon');
    };

    const initPickIcon = () => {
        createPickIcon();
    };

    const createPickIcon = function() {

        for (let iconId in standardIcons) {
            createOneIconOnWrapper(parseInt(iconId));
        }
    };

    const createOneIconOnWrapper = (iconId) => {
        let $icon = $('<div>').addClass("icon-to-choose mark-id-" + iconId);
        let iconToChooseWrapper = $('<div>').addClass("icon-to-choose-wrapper");

        iconToChooseWrapper.on("click", function() {
            setIconIdAndUpdate(iconId);
        });

        $palette.find(".first-column-icon").append(iconToChooseWrapper.append($icon));
    }

    const initPalete = () => {
        //$palette = $colorPicker.find('.pick-color-palette');

        createPalete();
    };

    const createPalete = function() {
        var $ic = $palette.find('.first-column-icon');
        var $f = $palette.find('.first-column-color');
        var $s = $palette.find('.second-column-color');

        $palette.append($ic, $f, $s);

        for (var i = 0; i < standardColors.length; i++) {
            let $wrapper = i < 13 ? $f : $s;
            createOneColorOnPalete($wrapper, standardColors[i]);
        }
    };

    const createOneColorOnPalete = ($wrapper, color) => {
        var $color = $('<div>').addClass("palette-one-color");

        $color.css('background-color', color);

        $color.on("click", function() {
            setColorAndUpdate(color);

            if (colorPickerClb) colorPickerClb(chooseColor);

            hidePalette();
        });

        $wrapper.append($color);
    };

    const hidePalette = () => {
        $palette.css('display', 'none');
    };

    const togglePalette = () => {
        let visible = $palette.css('display') == "block";

        if (visible) hidePalette();
        else showPalette();
    }

    const showPalette = () => {
        $palette.css('display', 'block');
    };

    const updateColorOfBck = () => {
        $chooseColorBck.css('background-color', chooseColor);
    };

    const updateColorOfIconToChoose = () => {
        $palette.find('.icon-to-choose').css('background-color', chooseColor);
    };

    const updateIcon = () => {
        if (!standardIcons[chooseIconId]) {
            errorReport(moduleData.fileName, "updateIcon", "chooseIconId not exist", chooseIconId);
            return;
        }

        for (let idIcon in standardIcons) {
            $chooseIcon.removeClass("mark-id-" + idIcon);
        }

        $chooseIcon.addClass("mark-id-" + chooseIconId)
    }

    const setColorAndUpdate = (color) => {
        setChooseColor(color);
        updateColorOfBck();
        updateColorOfIconToChoose();
    }

    const setIconIdAndUpdate = (iconId) => {
        setChooseIconId(iconId);
        updateIcon();
    }

    const setVisibleOfIconMode = (state) => {
        let visibleToSet = state ? "block" : "none";

        $chooseIcon.css("display", visibleToSet);
        $palette.find(".first-column-icon").css("display", visibleToSet);
    }

    //const setIconOfBck = (name, color, icon = false) => {
    //    var $e = this.wnd.$.find('#' + name).find('.open-palette').find('.mm-mark');
    //    $e.css('background-color', color);
    //    if (icon !== false) {
    //        $e.data('icon', icon);
    //        $e.attr('class', '').addClass('mm-mark mm-mark--' + icon);
    //    }
    //};

    const setColorPickerClb = (_colorPickerClb) => {
        colorPickerClb = _colorPickerClb;
    };

    const setChooseColor = (_chooseColor) => {
        chooseColor = _chooseColor
    };

    const setChooseIconId = (_chooseIconId) => {
        if (!standardIcons[_chooseIconId]) {
            errorReport(moduleData.fileName, "setChooseIconId", "chooseIconId not exist", chooseIconId);
            chooseIconId = 0;
            return
        }

        chooseIconId = _chooseIconId;
    };

    const getChooseIconId = () => chooseIconId;
    const getChooseColor = () => chooseColor;
    const get$colorPicker = () => $colorPicker;

    this.init = init;
    this.updateData = updateData;
    this.getChooseColor = getChooseColor;
    this.getChooseIconId = getChooseIconId;
    this.get$colorPicker = get$colorPicker;
    this.setColorAndUpdate = setColorAndUpdate;
    this.setIconIdAndUpdate = setIconIdAndUpdate;

}