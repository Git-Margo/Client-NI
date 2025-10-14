let Storage = require('@core/Storage');
let StorageData = require('@core/StorageData');
var Templates = require('@core/Templates');

module.exports = function() {

    let scriptsList = null;

    const init = () => {

    };

    const initGlobalAddonLink = (addonUrl) => {
        let addonsTurnOn = Engine.globalAddons.checkAddonsTurnOn();

        if (addonsTurnOn) {
            //data = data.replace('GLOBAL_ADDON' + '("', '');
            //data = data.replace('")', '');

            //Engine.communication.startCallInitAfterRecivedAddons();     // BLOCK GLOBAL ADDONS IN DEPLOY 12.0.0
            //return

            if (addonUrl == '') Engine.communication.startCallInitAfterRecivedAddons();
            else loadScriptsProcedureFromLink(addonUrl);
        }
    };

    const checkIsGlobalAddonRequestAnswer = (data) => {
        //return !Engine.communication.getGlobalAddonsWasReceived() && data.search("GLOBAL_ADDON") > -1;
        return isset(data.addon);
    };

    const checkAddonsTurnOn = () => {
        let globalAddons = Storage.get(StorageData.GLOBAL_ADDONS.mainKey);

        if (globalAddons === null) return true;

        return globalAddons
    };

    const toggleStateAddons = () => {
        let globalAddonsState = Storage.get(StorageData.GLOBAL_ADDONS.mainKey);

        let nextState = globalAddonsState === null ? false : !globalAddonsState;

        Storage.set(StorageData.GLOBAL_ADDONS.mainKey, nextState);
    };

    const loadScriptsFromLinkAndCall = () => {
        if (!checkAddonsTurnOn()) return;

        //$.getJSON(scriptsList, {}, function(d, e) {
        //	console.log(e)
        //	if(d!='')console.log(d);
        //
        //});

        $.ajax({
            type: "GET",
            url: scriptsList,
            success: function() {
                log('Addons ' + scriptsList + ' loaded successfully.');
                console.log('Addons ' + scriptsList + ' loaded successfully.');
                //Engine.reCallInitQueue();
                Engine.communication.startCallInitAfterRecivedAddons();
            },
            error: function() {
                log('Addons ' + scriptsList + ' loaded fail.');
                console.log('Addons ' + scriptsList + ' loaded fail.');
                //Engine.reCallInitQueue();
                Engine.communication.startCallInitAfterRecivedAddons();
            },
            dataType: "script",
            cache: true
        });

    };

    const setMsgInConsoleAndCreateButtonInConsole = () => {

        let addonsTurnOn = checkAddonsTurnOn();

        let globalAddonsTxt = "Global addons: " + scriptsList;
        let globalAddonsStatus = "Global addons status: " + (addonsTurnOn ? 'on' : 'off');

        if (scriptsList) {
            log(globalAddonsTxt);
            log(globalAddonsStatus);
            createGlobalAddonStateButton(addonsTurnOn);
        } else {
            createGlobalAddonStateButton(addonsTurnOn);
        }
    };

    const createGlobalAddonStateButton = (addonsTurnOn, addClass) => {

        let $consoleWnd = Engine.console.wnd.$;
        let $btn = Templates.get('button');

        $consoleWnd.addClass('global-addons-exist');
        $btn.addClass('small green global-addons-state-button');
        $btn.find('.label').text(addonsTurnOn ? _t('global-addons-off') : _t('global-addons-on'));

        $btn.css('display', 'none');

        if (addClass) $btn.addClass(addClass);

        $btn.click(() => {
            toggleStateAddons();
            //location.reload();
            pageReload();
        });

        $consoleWnd.find('.console-bottom-panel-wrapper').append($btn);
    };

    const setVisibleOfTurnOnOffAddonButton = (state) => {
        //return  // BLOCK GLOBAL ADDONS IN DEPLOY 12.0.0
        let $consoleWnd = Engine.console.wnd.$;
        let display = state ? 'block' : 'none';
        $consoleWnd.find('.global-addons-state-button').css('display', display);
    }

    const loadScriptsProcedureFromLink = (scripts) => {
        scriptsList = scripts;

        //setMsgInConsoleAndCreateButtonInConsole();
        loadScriptsFromLinkAndCall();
    };

    this.init = init;
    this.initGlobalAddonLink = initGlobalAddonLink;
    this.checkAddonsTurnOn = checkAddonsTurnOn;
    this.checkIsGlobalAddonRequestAnswer = checkIsGlobalAddonRequestAnswer;
    this.setMsgInConsoleAndCreateButtonInConsole = setMsgInConsoleAndCreateButtonInConsole;
    this.setVisibleOfTurnOnOffAddonButton = setVisibleOfTurnOnOffAddonButton;

};