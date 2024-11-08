var tpl = require('core/Templates');
var StorageFuncBattle = require('core/battle/StorageFuncBattle');

module.exports = function() {


    let content;
    let wnd;
    let $crazyWndScrollbar;
    let $crazy$msgWrapper;
    let attach;
    //let sizeOpt;
    let moduleData = {
        fileName: "BattleLogHelpWindow.js"
    };

    //let sizeArray   = [
    //    {w: 235, h:200},
    //    {w: 235, h:400},
    //    {w: 235, h:600},
    //    {w: 330, h:200},
    //    {w: 330, h:400},
    //    {w: 330, h:600}
    //];


    const init = () => {
        initContent();
        initWindow();
        //initClickSetSize();
        initData();
        //setSizeWindow();
        //managePosOfWndOutOfScreen();
    };

    //const initClickSetSize = () => {
    //    content.find('.toggle-size-button').on('click', toggleSizeOpt);
    //};

    const initContent = () => {
        content = tpl.get('battle-log-help-window');
    };

    //const setSizeWindow = () => {
    //    let opt = sizeArray[sizeOpt];
    //
    //    content.css({
    //        'width' : opt.w,
    //        'height': opt.h
    //    });
    //
    //    content.attr("size-opt", sizeOpt);
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
        let attachData = StorageFuncBattle.getAttachBattleLogHelpWindow();
        //let sizeOptData = StorageFuncBattle.getBattleLogHelpWindowSizeOpt(sizeArray);


        setAttach(attachData);
        //setSizeOpt(sizeOptData);
    };

    const initWindow = () => {
        let sizeArray = [{
                w: 235,
                h: 200
            },
            {
                w: 235,
                h: 325
            },
            {
                w: 235,
                h: 450
            },
            {
                w: 235,
                h: 600
            },
            {
                w: 330,
                h: 200
            },
            {
                w: 330,
                h: 325
            },
            {
                w: 330,
                h: 450
            },
            {
                w: 330,
                h: 600
            }
        ];

        wnd = Engine.windowManager.add({
            content: content,
            nameWindow: Engine.windowsData.name.BATTLE_LOG,
            title: _t('battle_logs', null, "battle"),
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
            addClass: 'battle-log-help-window-transparent',
            //manageCollapse    : { defaultVal: 0, callbackFn: (state) => collapse(state)},
            onclose: () => {
                callProcedureOfAttach(false);
            }
        });
        wnd.addToAlertLayer();
        wnd.center();

        $crazyWndScrollbar = wnd.$.find('.scroll-wrapper');
        $crazy$msgWrapper = wnd.$.find('.scroll-pane');
        $crazyWndScrollbar.addScrollBar({
            track: true
        });

        wnd.$.find('.inner-content').css({
            'margin-top': '5px'
        });
        wnd.$.find('.content').css({
            margin: '-17px -22px -18px'
        });
        //content.css({
        //    height: 350
        //});
        $crazyWndScrollbar.css('height', '100%');

        wnd.$.find('.scrollbar-wrapper').css({
            top: -13,
            bottom: -6
        })

        hide();
    }

    const updateScrollbar = () => {
        $crazyWndScrollbar.trigger('updateWhenBottom');
    }

    const appendMsg = ($msg) => {
        $msg.css('opacity', 1);
        wnd.$.find('.scroll-pane').append($msg);
    };

    const clear = () => {
        $crazy$msgWrapper.empty();
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

        StorageFuncBattle.setAttachBattleLogHelpWindow(attach)

        if (attach) show();
        else hide();
    }

    //const toggleSizeOpt = () => {
    //    setSizeOpt(sizeOpt + 1);
    //
    //    if (sizeOpt > sizeArray.length - 1) setSizeOpt(0);
    //
    //    StorageFuncBattle.setBattleLogHelpWindowSizeOpt(sizeOpt);
    //
    //    setSizeWindow();
    //    managePosOfWndOutOfScreen();
    //};

    this.init = init;
    this.updateScrollbar = updateScrollbar;
    this.show = show;
    this.toggleAttach = toggleAttach;
    this.hide = hide;
    this.clear = clear;
    this.appendMsg = appendMsg;

}