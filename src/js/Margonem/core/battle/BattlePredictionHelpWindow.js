var tpl = require('core/Templates');
let StorageFuncBattle = require('core/battle/StorageFuncBattle');
let WindowManageSize = require('core/window/WindowManageSize');

module.exports = function() {

    let content = null;
    let wnd = null;
    let $wndScrollbar = null;
    let $wndMsgWrapper = null;
    let attach;
    //let sizeOpt;

    let windowManageSize;

    //let sizeArray   = [
    //    {w: 148, h:200},
    //    {w: 148, h:400},
    //    {w: 148, h:600},
    //    {w: 235, h:200},
    //    {w: 235, h:400},
    //    {w: 235, h:600}
    //];

    const init = () => {
        initContent();
        initWindow();
        //initClickSetSize();
        initData();
        //setSizeWindow();
        //managePosOfWndOutOfScreen();
        //initWindowManageSize()
    };

    //const initWindowManageSize = () => {
    //    let sizeArray   = [
    //        {w: 148, h:200},
    //        {w: 148, h:400},
    //        {w: 148, h:600},
    //        {w: 235, h:200},
    //        {w: 235, h:400},
    //        {w: 235, h:600}
    //    ];
    //
    //    windowManageSize = new WindowManageSize();
    //
    //    windowManageSize.init(wnd, getEngine().windowsData.name.BATTLE_PREDICTION_HELP_WINDOW, content, content, sizeArray, updateScrollbar);
    //};

    //const initClickSetSize = () => {
    //    content.find('.toggle-size-button').on('click', toggleSizeOpt);
    //};

    const initContent = () => {
        content = tpl.get('battle-prediction-help-window');
    };

    //const setSizeWindow = () => {
    //    let opt = sizeArray[sizeOpt];
    //
    //    content.css({
    //        'width' : opt.w,
    //        'height': opt.h
    //    });
    //
    //    updateScrollbar();
    //};

    //function managePosOfWndOutOfScreen () {
    //    if (!wnd.checkPassTheScreenBounds()) return;
    //
    //    wnd.setWindowOnLeftTopCorner();
    //
    //    if (sizeOpt == 0)                 return;
    //    if (!wnd.checkPassTheScreenBounds())  return;
    //
    //    setSizeOpt(0);
    //
    //    setSizeWindow()
    //}

    const initData = () => {
        let attachData = StorageFuncBattle.getAttachBattlePredictionHelpWindow();
        //let sizeOptData = StorageFuncBattle.getBattlePredictionHelpWindowSizeOpt(sizeArray);


        setAttach(attachData);
        //setSizeOpt(sizeOptData);
    };

    const initWindow = () => {

        let sizeArray = [{
                w: 148,
                h: 200
            },
            {
                w: 148,
                h: 325
            },
            //{w: 148, h:600},
            {
                w: 235,
                h: 200
            },
            {
                w: 235,
                h: 325
            },
            //{w: 235, h:600}
        ];

        wnd = Engine.windowManager.add({
            content: content,
            nameWindow: Engine.windowsData.name.BATTLE_PREDICTION_HELP_WINDOW,
            title: _t('prediction'),
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            manageSize: {
                sizeArray: sizeArray,
                callback: updateScrollbar
            },
            managePosition: {
                x: '251',
                y: '60',
                position: Engine.windowsData.position.CENTER_OR_STICK_TO_EQ
            },
            addClass: 'battle-prediction-help-window-transparent',
            onclose: () => {
                callProcedureOfAttach(false);
            }
        });
        wnd.addToAlertLayer();
        wnd.center();

        $wndScrollbar = wnd.$.find('.scroll-wrapper');
        $wndMsgWrapper = wnd.$.find('.scroll-pane');
        $wndScrollbar.addScrollBar({
            track: true
        });

        wnd.$.find('.inner-content').css({
            'margin-top': '5px'
        });
        wnd.$.find('.content').css({
            margin: '-17px -22px -18px'
        });
        //content.css({
        //    height: 325
        //});
        $wndScrollbar.css('height', '100%');

        wnd.$.find('.scrollbar-wrapper').css({
            top: -13,
            bottom: -6
        })

        hide();
    };

    const appendWarrior = (warrior, warriorIcon, warriorNpc) => {
        let $warrior = $(warrior);
        let $clone = $warrior.clone();
        let turnItemAv = $clone[0].querySelector('.turn-prediction__av');

        getEngine().battle.createAvatar(turnItemAv, warriorIcon, warriorNpc);
        $wndMsgWrapper.append($clone);
    };

    const updateScrollbar = () => {
        $wndScrollbar.trigger('update');
        //$wndScrollbar.trigger('updateWhenBottom');
    };

    const clear = () => {
        $wndMsgWrapper.empty();
    };

    //const setSizeOpt = (_sizeOpt) => {
    //    sizeOpt = _sizeOpt;
    //};

    const setAttach = (_attach) => {
        attach = _attach;
    };

    const getAttach = () => {
        return attach;
    };

    const show = () => {
        if (!attach) return;

        wnd.show();
    }

    const hide = () => {
        wnd.hide();
    }

    const toggleAttach = () => {
        //setAttach(!attach);
        //
        //StorageFuncBattle.setAttachBattleLogHelpWindow(attach)
        //
        //if (attach) show();
        //else        hide();

        callProcedureOfAttach(!attach);
    };

    const callProcedureOfAttach = (_attach) => {
        setAttach(_attach);

        StorageFuncBattle.setAttachBattlePredictionHelpWindow(attach)

        if (attach) show();
        else hide();
    }

    //const toggleSizeOpt = () => {
    //    setSizeOpt(sizeOpt + 1);
    //
    //    if (sizeOpt > sizeArray.length - 1) setSizeOpt(0);
    //
    //    StorageFuncBattle.setBattlePredictionHelpWindowSizeOpt(sizeOpt);
    //
    //    setSizeWindow();
    //    managePosOfWndOutOfScreen();
    //};

    this.init = init;
    this.clear = clear;
    this.toggleAttach = toggleAttach;
    this.appendWarrior = appendWarrior;
    this.updateScrollbar = updateScrollbar;
    this.show = show;
    this.hide = hide;
}