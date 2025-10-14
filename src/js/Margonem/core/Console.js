/**
 * Created by lukasz on 2014-10-02.
 */
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var log, warn, error;
// var wnd = require('@core/Window');
var tpl = require('@core/Templates');
// var Storage = require('@core/Storage');
//var Items = require('@core/items/ItemsManager');
var Templates = require('@core/Templates');
let ThemeData = require('@core/themeController/ThemeData');
const Storage = require("@core/Storage");
const {
    CONSOLE_COMMANDS
} = require("@core/StorageData");
const {
    isMobileApp
} = require('@core/HelpersTS');
module.exports = function() {
    var self = this;
    var game = null;
    var queue = [];
    let list = [];

    let buttonLastCommandAttach = false;
    let buttonCSSThemeAttach = false;
    let initCrazyButtonAttach = false;
    //this.isOpen = false;

    this.init = function() {
        this.initWindow();
        this.initContent();
        this.initInputKeyCodes();
        this.initScrollBar();
        this.initSizeButton()
    };


    const initCSSThemeButton = () => {
        if (buttonCSSThemeAttach) {
            return
        }

        let btm1 = createButton("CSS_THEME", ["small", "css-theme-button"], function() {
            //self.commandLine.previous()
            getEngine().cssLoader.createWindow()
            self.close();
        });

        let wrapper = this.wnd.$.find('.console-bottom-panel-wrapper')[0];

        wrapper.appendChild(btm1);

        buttonCSSThemeAttach = true;
    }

    const getTextToLightModeApp = () => {

        let storeLightMode = Engine && Engine.interface && Engine.interface.getStateOfLightInterfaceFromStorage();

        storeLightMode = storeLightMode || storeLightMode == null;

        if (storeLightMode) {
            return _t('off', null, 'buttons') + ' ' + _t('TEST_APP');
        } else {
            return _t('on', null, 'buttons') + ' ' + _t('TEST_APP');
        }
    }

    const initCrazyButton = () => {

        if (!isMobileApp()) {
            return;
        }

        if (initCrazyButtonAttach) {
            return;
        }

        let str = getTextToLightModeApp();
        let btm1 = createButton(str, ["small", "green", "mobile-test"], function() {


            let niInterface = Engine.interface;

            niInterface.toggleInterfaceLightMode();
            str = getTextToLightModeApp();

            $(this).find('.label').html(str);

            if (niInterface.getInterfaceLightMode()) {
                var zoom = niInterface.findTheBestZoom();
                niInterface.setZoomFactor(zoom);
            }


        });

        let wrapper = this.wnd.$.find('.console-bottom-panel-wrapper')[0];

        wrapper.appendChild(btm1);

        initCrazyButtonAttach = true
    }

    const crazy = () => {}

    const initCommandButton = () => {
        if (!mobileCheck()) {
            return
        }

        if (buttonLastCommandAttach) {
            return
        }

        let btm1 = createButton("PREV_CMD", ["small", "prev-cmd-button"], function() {
            self.commandLine.previous()
        });

        let btm2 = createButton("NEXT_CMD", ["small", "next-cmd-button"], function() {
            self.commandLine.next()
        });

        let wrapper = this.wnd.$.find('.console-bottom-panel-wrapper')[0];

        wrapper.appendChild(btm1);
        wrapper.appendChild(btm2);

        buttonLastCommandAttach = true;
    }

    this.initSizeButton = function() {
        this.wnd.$.find('.console-window').find('.size-button').click(function() {
            self.wnd.$.find('.console-window').toggleClass('big-size');
            $('.scroll-wrapper', self.wnd.$).trigger('update')
            self.wnd.center();
        });
    };

    this.setVisibleOnSizeButton = function() {
        this.wnd.$.find('.console-window').find('.size-button').css('display', 'block');
    };

    this.initWindow = function() {
        // this.wnd = new wnd({
        // 	onclose: function () {
        // 		self.close();
        // 	}
        // });

        Engine.windowManager.add({
            content: tpl.get('console-window'),
            title: _t('iconconsole'),
            nameWindow: Engine.windowsData.name.CONSOLE,
            widget: Engine.widgetsData.name.CONSOLE,
            objParent: this,
            nameRefInParent: 'wnd',
            addClass: 'console-wnd',
            onclose: () => {
                self.close();
            }
        });
        this.wnd.hide();
    };

    this.initContent = function() {
        //this.wnd.title('Console');
        //this.wnd.content(tpl.get('console-window'));
        this.displayMsg('Margonem console.');
        this.displayMsg(`Client version: ${__build.serviceVersion}`);
    };

    this.initInputKeyCodes = function() {
        this.wnd.$.find('input').on('keydown', function(e) {
            if (e.keyCode == 38) self.commandLine.previous(e);
            if (e.keyCode == 40) self.commandLine.next(e);
            if (e.keyCode == 13) self.commandLine.sendMessage($(this).val());
        });
    };

    this.newEquipItem = function(data, finish) {
        list.push(data);
        if (finish) self.showEquipItems();
    };

    this.showEquipItems = () => {
        var l = location.host.split('.'),
            w = l[0];
        if (w.indexOf('game') == 0) w = w.substr(4);
        for (let i in list) {
            parent.log(list[i].name + ' ITEM#' + list[i].hid + '.' + w);
        }
        list = [];
        Engine.items.removeCallback(Engine.itemsFetchData.NEW_EQUIP_ITEM);
    };

    this.initScrollBar = function() {
        $('.scroll-wrapper', self.wnd.$).addScrollBar({
            track: true
        });
    };

    this.putMsg = function(msg, blockNotify) {
        if (!blockNotify) this.showConNotif();
        if (typeof this.wnd == 'undefined') queue.splice(0, 0, msg);
        else this.displayMsg(msg);
        this.wnd.$.find('.scroll-pane').trigger('updateHTML', true);
    };

    this.displayMsg = function(msg) {
        var $consoleMsg = tpl.get('console-message');
        $consoleMsg.html(msg);
        this.wnd.$.find('.console-content').append($consoleMsg);
        this.scrollBottom();
    };

    this.scrollBottom = function() {
        $('.scroll-wrapper', this.wnd.$).trigger('update').trigger('scrollBottom');
    };

    this.log = function(msg) {
        this.sendMessage(msg, null, true);
    };

    this.showConNotif = function() {
        var Interface = Engine.interface;
        var bool = getAlreadyInitialised();
        if (!bool) {
            this.open();
            return;
        }
        //if (this.isOpen) return;
        if (this.wnd.isShow()) return;
        Interface.showConsoleNotif();
    };

    this.deleteConsoleNotif = function() {
        var Interface = Engine.interface;
        var bool = getAlreadyInitialised();
        if (!bool) return;
        Interface.deleteNotif('consoleNotif');
    };

    this.warn = function(msg) {
        this.sendMessage(msg, 'yellow')
    };

    this.error = function(msg) {
        this.sendMessage(msg, 'red')
        self.open();
    };

    this.createMessage = (msg, cl) => {
        let $wrap = $('<span/>', {
            class: cl
        });
        $wrap.html(parseContentBB(msg, false));

        return $wrap;
    }

    this.sendMessage = (msg, cl, blockNotify = false) => {
        if (Array.isArray(msg)) { // array of messages
            for (const one of msg) {
                let $wrap = this.createMessage(one, cl);
                this.putMsg($wrap, blockNotify);
            }
        } else { // one message (string)
            let $wrap = this.createMessage(msg, cl);
            this.putMsg($wrap, blockNotify);
        }

    }

    this.open = function() {
        //if (this.isOpen) return false;
        if (this.wnd.isShow()) return false;
        //$('.console-and-mAlert-layer').append(this.wnd.$);
        // Engine.interface.$cLayer.append(this.wnd.$);
        this.wnd.addToConsoleLayer();

        //this.isOpen = true;
        //if (!mobileCheck()) {
        setTimeout(function() {
            $('#console_input').focus().val('');
        }, 50);
        //}
        this.wnd.center();
        this.wnd.show();
        this.scrollBottom();
        this.deleteConsoleNotif();
    };

    this.close = function() {
        //this.wnd.$.detach();
        this.wnd.detachFromLayer();
        //this.isOpen = false;
    };

    this.toggle = function(forceshow) {
        //if (this.isOpen && typeof forceshow == 'undefined') this.close();
        if (this.wnd.isShow() && typeof forceshow == 'undefined') this.close();
        else this.open();
    };

    this.dump = function(arr, level) {
        var dumped_text = "";
        if (!level) level = 0;
        if (level > 3) return '';

        //The padding given at the beginning of the line.
        var level_padding = "";
        for (var j = 0; j < level + 1; j++) level_padding += "&nbsp;&nbsp;"; //"    ";

        if (typeof(arr) == 'object') { //Array/Hashes/Objects
            for (var item in arr) {
                var value = arr[item];

                if (typeof(value) == 'object') { //If it is an array,
                    dumped_text += level_padding + "'" + item + "' :<BR>";
                    dumped_text += dump(value, level + 1);
                } else
                if (typeof(value) == 'undefined')
                    dumped_text += level_padding + "'" + item + "' => \"undefinied\"<BR>";
                else
                    dumped_text += level_padding + "'" + item + "' => \"" + value.toString().replace(/</g, "&lt;") + "\"<BR>";

            }
        } else { //Stings/Chars/Numbers etc.
            dumped_text = "===>" + arr + "<===(" + typeof(arr) + ")";
        }
        return dumped_text;
    };

    this.commandLine = new(function(p) {
        var parent = p;
        var custom = null;
        var activeIdx = null;

        const getCommands = () => {
            return Storage.get(CONSOLE_COMMANDS) || [];
        }

        const saveCommands = () => {
            Storage.set(CONSOLE_COMMANDS, commands.slice(-10));
        }

        const commands = getCommands();

        this.next = function(e) {
            if (e) {
                e.preventDefault();
            }

            if (activeIdx == null) return;
            activeIdx++;
            if (activeIdx >= commands.length) {
                activeIdx = null;
                $('#console_input').val(custom);
                custom = null;
            } else {
                this.setCustom();
                $('#console_input').val(commands[activeIdx]);
            }
        };

        this.previous = function(e) {
            if (e) {
                e.preventDefault();
            }

            if (activeIdx == null) activeIdx = commands.length - 1;
            else if (activeIdx > 0) {
                activeIdx--;
            }

            this.setCustom();
            $('#console_input').val(commands[activeIdx]);
        };

        this.setCustom = function() {
            if (custom == null) custom = $('#console_input').val();
        };

        this.sendMessage = function(msg) {
            if (msg == '') return;
            var c = msg.split(' ');
            var cmd = c[0];
            c[0] = '';
            var par = c.join(' ').substr(1);
            parent.log('<i style="color:white">&gt; ' + msg + '</i>');

            //adding only new command to console history
            if (activeIdx == null || (activeIdx != null && commands[activeIdx] != msg)) {
                commands.push(msg);
                saveCommands();
                ``
            }
            if (cmd.substr(0, 1) == '.') _g('console&custom=' + esc(msg));
            else {
                switch (cmd) {
                    case 'cls':
                        $('.console-content').html('');
                        break;
                    case 'dump':
                        parent.log("<b>Dumping variable " + par + "</b><br>" + self.dump(eval(par)));
                        break;
                    case 'show':
                        //$('#' + par).show();
                        if (par == 'battle') {
                            if (!Engine.battle.getfirstLogsExist()) return mAlert(_t('noLogs', null, 'battle'));
                            Engine.battle.toogleBattleLogs();
                        }
                        break;
                        //case 'gadblock':
                        //	if (!c[1]) {
                        //		return
                        //	}
                        //	if (!['on', 'off'].includes(c[1])) {
                        //		return;
                        //	}
                        //
                        //	let val;
                        //	if (c[1] == 'on')   val = true;
                        //	if (c[1] == 'off')  val = false;
                        //
                        //	Storage.set('globalAddons', val);
                        //	location.reload();
                        //	break;
                    case 'hide':
                        $('#' + par).hide();
                        break;
                    case 'stop':
                        Engine.stop();
                        parent.log('Engine stopped.');
                        break;
                    case 'skin':
                        $('#hero').css('backgroundImage', 'url(' + par + ')');
                        break;
                    case 'changelog':
                        _g('gm&a=changelog');
                        break;
                    case 'noclip':
                        Engine.map.col.check = function() {
                            return 0;
                        };
                        break;
                    case 'equip':
                        //Engine.items.fetch('g', self.newEquipItem);
                        Engine.items.fetch(Engine.itemsFetchData.NEW_EQUIP_ITEM, self.newEquipItem);
                        break;
                    case 'group':
                        //require(['core/Sound'], function (S) {
                        //	//log(S.getActiveGroup());
                        //});
                        break;
                    case 'cols':
                        var cols = [
                            [],
                            [],
                            []
                        ];
                        for (var x1 = -1; x1 < 2; x1++)
                            for (var y1 = -1; y1 < 2; y1++)
                                cols[y1 + 1][x1 + 1] = map.isCol(hero.realX() + x1, hero.realY() + x1);
                        parent.log(dump(cols));
                        break;
                    case 'respnpc':
                        _g('gm&a=respnpc');
                        break;
                    case 'testskin':
                        // Engine.themeController.updateData(par, 1);
                        Engine.themeController.updateData(par, ThemeData.THEME_KIND.EVENT);
                        break;
                    case 'resetskin':
                        parent.log("deprecated! interfaceSkin you can use only rom SRAJ!");
                        //Engine.themeController.removeEventThemeIfExist();
                        break;
                    case 'loc':
                        _g('gm&a=locate&who=' + esc(par), function(e) {
                            //con.log(e.n) // fix for doubled msg
                        });
                        break;
                    case 'nloc':
                        _g('gm&a=npclocate&who=' + esc(par), function(e) {
                            //con.log(e.n) // fix for doubled msg
                        });
                        break;
                    case 'tp':
                        _g('gm&a=teleport&target=' + par, function(v) {
                            Engine.interface.checkTeleport(v);
                        });
                        break;
                    case 'ver':
                        parent.log("Margonem MMORPG ver 3.0");
                        break;
                    case 'about':
                        parent.log("Margonem MMORPG (c) by Thinker 2005-2014 [www.margonem.pl, thinker@margonem.pl]");
                        break;
                    case 'cls':
                        $('#contxt').empty();
                        break;
                    case 'show':
                        $('#' + par).show();
                        if (par == 'battle') g.lock.add('battle');
                        break;
                    case 'hide':
                        $('#' + par).hide();
                        break;
                    case 'outfit':
                        Engine.hero.onUpdate.img(par, Engine.hero.d.img, {
                            insecureSource: true
                        });
                        break;
                    case 'ff':
                        _g('fight&a=f');
                        break;
                    case '':
                        break;
                    default:
                        try {
                            eval(msg)
                        } catch (err) {
                            parent.log(err.toString())
                        }
                        break;
                }
            }
            $('#console_input').val('');
            custom = null;
            activeIdx = null;
        }
    })(this);


    this.initCSSThemeButton = initCSSThemeButton;
    this.initCommandButton = initCommandButton;
    this.initCrazyButton = initCrazyButton;
};

// con.init();
// window.log = con.log;
// window.warn = con.warn;
// window.error = con.error;

// module.exports = con;
/**
 * Short alias for Console.log - displays string in game console
 * @param {string} msg
 * @returns {undefined}
 */