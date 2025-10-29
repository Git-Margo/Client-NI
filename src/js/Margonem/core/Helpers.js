//var tpl = require('@core/Templates');
var averageTimeTestTool = require('@core/AverageTimeTestTool');
var slugify = require('slugify');
let LayersData = require('@core/interface/LayersData');
let ServerStorageData = require('@core/storage/ServerStorageData');
var ItemState = require('@core/items/ItemState');
const {
    decodeHtmlEntities
} = require('./HelpersTS');
const InputMaskData = require('@core/InputMaskData');
const {
    parseText
} = require('./TextModifyByTag');
const TextModifyByTag = require('./TextModifyByTag');
let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');
let CharacterInfo = require('@core/characters/CharacterInfo');
// var TutorialData = require('@core/tutorial/TutorialData');

var Helpers = new(function() {

    let moduleData = {
        fileName: "Helpers.js"
    };

    window.slugify = text => slugify(text, {
        lower: true
    });

    window.log = (msg) => Engine.console.log(msg);
    window.warn = (msg) => Engine.console.warn(msg);
    window.error = (msg) => Engine.console.error(msg);

    window.Lock = function(list, callback, afterUnlock) {
        var list = list;

        this.unlock = function(name) {
            if (list.indexOf(name) >= 0) list.splice(list.indexOf(name), 1);
            if (!list.length && typeof(callback) == 'function') callback();
            if (typeof(afterUnlock) == 'function') afterUnlock(list);
        };

        this.check = function() {
            return list;
        }
    };

    window.averageTimeTestTool = new averageTimeTestTool();

    window.getNpcFramesAmount = (patch) => {
        var myRe = new RegExp(/_s_(.*?)_e_/g);
        var myArray = myRe.exec(patch);
        //let frameAmount = 1;

        if (!myArray) return 1;

        if (myArray.length > 2) {
            console.error('[Helpers.js, getNpcFramesAmount] Multiple declaration', patch);
            return 1;
        }

        let args = myArray[1];

        for (let k of args) {
            let pInt = parseInt(k);
            if (!Number.isInteger(pInt)) {
                console.error('[Helpers.js, getNpcFramesAmount] Argument is not integer');
                return 1
            }
            //else {
            //frameAmount = Math.max(frameAmount, (pInt + 1));
            //}
        }
        //frameAmount = 4;
        return 5;
    };

    window.getEngine = () => {
        return Engine;
    }

    window.createLoadingElement = ($wrapper, text) => {
        let $loadingElement = require('@core/Templates').get('loading-element-component')

        $loadingElement.find('.loading-element-text').html(text ? text : _t('city_loading'));

        $wrapper.append($loadingElement)

        return $loadingElement;
    }

    window.cutTextAndAddTip = ($el, text, rowsAmount) => {
        $el.html(text);
        //$el.css("line-clamp", lineClamp);
        $el.addClass("overflow-text-with-several-rows");
        $el.css("-webkit-line-clamp", rowsAmount.toString());
        $el.tip(text, "overflow-text-with-several-rows");
    }

    window.getClickEventName = function() {
        return mobileCheck() ? 'touchend' : "click";
        // return mobileCheck() ? 'pointerdown' : "click";
        // return  "click";
    }

    //window.createOtherContextMenu = (e, player) => {
    //	const contextMenu = [];
    //
    //	let issetCharId = isset(player.charId);
    //	let issetAccountId = isset(player.accountId);
    //	let issetLvl = isset(player.lvl);
    //	let issetNick = isset(player.nick);
    //	let issetProf = isset(player.prof);
    //
    //	contextMenu.push([
    //		_t('send_message', null, 'chat'),
    //		function () {
    //			Engine.chatController.getChatInputWrapper().setPrivateMessageProcedure(player.nick);
    //		},
    //	]);
    //
    //	if (issetCharId && issetAccountId && issetLvl && issetNick && issetProf) {
    //		contextMenu.push([
    //			_t('show_eq'),
    //			() => {
    //				Engine.showEqManager.update({
    //					id: player.charId,
    //					account: player.accountId,
    //					lvl: player.lvl,
    //					nick: player.nick,
    //					prof: player.prof,
    //					icon: '',
    //					world: Engine.worldConfig.getWorldName(),
    //				});
    //			},
    //		]);
    //	}
    //
    //	if (issetNick) {
    //
    //		contextMenu.push([
    //			_t('invite_to_friend'),
    //			() => _g('friends&a=finvite&nick=' + player.nick.trim().split(' ').join('_'))
    //		]);
    //
    //	}
    //
    //	if (issetAccountId && issetCharId) {
    //
    //		const {showProfile} = require('@core/HelpersTS.ts');
    //
    //		contextMenu.push([
    //			_t('show_profile', null, 'menu'),
    //			() => showProfile(player.accountId, player.charId)
    //		]);
    //
    //	}
    //
    //	if (contextMenu.length) {
    //		Engine.interface.showPopupMenu(contextMenu, e);
    //		return true;
    //	}
    //	return false;
    //}

    window.isSettingsOptionsInterfaceAnimationOn = () => {
        //if (!Engine.settingsOptions.heroOptExist()) {
        //	return false;
        //}
        if (!isHeroAlreadyInitialised()) {
            return false
        }

        return Engine.settingsOptions.isInterfaceAnimationOn();
    };

    window.isSettingsOptionsAutoCompareItemsOn = () => {
        return Engine.settingsOptions.isAutoCompareItemsOn();
    };

    window.isSettingsOptionsWeatherAndEventEffectsOn = () => {
        return Engine.settingsOptions.isWeatherAndEventEffectsOn();
    };

    window.isSettingsOptionsCycleDayAndNightOn = () => {
        return getEngine().settingsOptions.isCycleDayAndNightOn()
    };

    window.isSettingsOptionsMouseHeroWalkOn = () => {
        return Engine.settingsOptions.isMouseHeroWalkOn();
    };

    window.isSettingsOptionsAutoGoThroughGatewayOn = () => {
        return Engine.settingsOptions.isAutoGoThroughGatewayOn();
    };

    window.isSettingsOptionsMapAnimationOn = () => {
        return Engine.settingsOptions.isMapAnimationOn();
    };

    window.isSettingsOptionsWarShadowOn = () => {
        return Engine.settingsOptions.isWarShadowOn();
    };

    window.isSettingsOptionsShowItemsRankOn = () => {
        return Engine.settingsOptions.isShowItemsRankOn();
    };

    window.isSettingsOptionsBerserk = () => {
        return Engine.settingsOptions.isBerserk();
    };

    window.isSettingsOptionsBerserkGroup = () => {
        return Engine.settingsOptions.isBerserkGroup();
    };

    window.getKindOfShowLevelAndOperationLevel = () => {
        //return getRandomElementFromArray([0,1,2,3,4]);
        //return 0;
        return Engine.settingsOptions.getKindOfShowLevelAndOperationLevel()
    }

    window.getBerserkLvlMin = () => {
        return Engine.settingsOptions.getBerserkLvlMin()
    }

    window.getBerserkLvlMax = () => {
        return Engine.settingsOptions.getBerserkLvlMax()
    }

    window.getBerserkCommon = () => {
        return Engine.settingsOptions.getBerserkCommon()
    }

    window.getBerserkElite = () => {
        return Engine.settingsOptions.getBerserkElite()
    }

    window.getBerserkElite2 = () => {
        return Engine.settingsOptions.getBerserkElite2()
    }

    window.getBerserkGroupLvlMin = () => {
        return Engine.settingsOptions.getBerserkGroupLvlMin()
    }

    window.getBerserkGroupLvlMax = () => {
        return Engine.settingsOptions.getBerserkGroupLvlMax()
    }

    window.getBerserkGroupCommon = () => {
        return Engine.settingsOptions.getBerserkGroupCommon()
    }

    window.getBerserkGroupElite = () => {
        return Engine.settingsOptions.getBerserkGroupElite()
    }

    window.getBerserkGroupElite2 = () => {
        return Engine.settingsOptions.getBerserkGroupElite2()
    }

    window.checkBattleWindowActive = () => {
        return Engine.battle.getShow();
    };

    window.createTextGraphic = (text, heightText, colorText, backgroundColor) => {
        let tempCanvas = document.createElement('canvas');
        let ctx = tempCanvas.getContext('2d');

        tempCanvas.width = 200;
        tempCanvas.height = 50;

        ctx.font = `${heightText}px Arimo regular`;

        let textWidth = ctx.measureText(text).width;

        tempCanvas.width = textWidth;
        tempCanvas.height = heightText + heightText / 4;

        ctx.font = `${heightText}px Arimo regular`;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        ctx.fillStyle = colorText;
        ctx.fillText(text, 0, heightText);

        return {
            img: tempCanvas,
            url: tempCanvas.toDataURL()
        }
    };

    window.createCheckBox = (str, cl, clb) => {
        let $oneCheckBox = require('@core/Templates').get('one-checkbox')

        $oneCheckBox.addClass(cl);
        $oneCheckBox.find('.label').html(str);
        $oneCheckBox.click(function() {

            let $checkbox = $(this).find('.checkbox');
            $checkbox.toggleClass('active');
            let active = $checkbox.hasClass('active')

            clb(active, $oneCheckBox);
        });

        return $oneCheckBox;
    }

    window.isFirefoxBrowser = function() {
        return navigator.userAgent.toLowerCase().includes('firefox');
    };

    /***** usefull functions *****/
    window.round = function(n, precise, sep, cutAfter = 0) {
        precise = isset(precise) ? precise : 1;
        n = Math.abs(parseFloat(n));
        var sign = (n < 0) ? '-' : '';
        var result = '';
        switch (precise) {
            case 10:
                if (!isset(sep)) sep = ' ';
                if (n.toString().length < 4) {
                    result = n;
                } else {
                    result = n.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1" + sep);
                }
                break;
            default:
                var data = roundParser(n);
                if (!isset(sep)) sep = '.';
                result = Math.round(data.val * Math.pow(10, precise - 1)) / Math.pow(10, precise - 1);
                if (cutAfter) {
                    result = cutFloat(result, cutAfter);
                }
                result = result + data.postfix;
                result = result.replace(/\./, sep);
                if (n < 10000) return sign + n;
                break;
        }
        return sign + result;
    };

    window.roundShorten = (string) => { // for item amount/ammo - i'm not happy with that :(
        const replacer = (match, p1, p2, suffix, offset, string) => {
            if (p1.length === 3 && p2.length === 2) return `${p1}${suffix}`; //199.36k -> 199k
            if (p1.length === 2 && p2.length === 2) return `${p1}.${p2.slice(0, -1)}${suffix}`; //99.99k -> 99.9k
            return string;
        }
        return round(string, 9, '.', 2).replace(/^(\d*)[.](\d*)([kmg])$/g, replacer);
    };

    window.cutFloat = function(n, cutAfter) {
        if (!(n.toString().indexOf('.') >= 0)) return n; // cut if n is float only

        var h = Math.pow(10, 12),
            num = (Math.floor(n * h) / h).toString();
        return num.substring(0, num.indexOf(".") + cutAfter + 1); //= 123.35
    };

    window.mp = function(x) { // changes 5 to +5, -5 to -5
        if (x > 0) return '+' + formNumberToNumbersGroup(x);
        else return '-' + formNumberToNumbersGroup(String(x).slice(1));
    };

    window.formNumberToNumbersGroup = function(number) {
        var array = ((number.toString()).split('')).reverse();
        var newArray = [];
        if (number.toString().indexOf('.') > -1) return number;
        for (var i = 0; i < array.length; i++) {
            var bool1 = i % 3 == 0;
            var bool2 = i != 0;
            if (bool1 && bool2) newArray.push(" ");
            newArray.push(array[i]);
        }
        newArray.reverse();
        return newArray.join('');
    };

    window.changeViewOfHelper = function($helper, id, tplLoc = false) {
        let $icon = !tplLoc ?
            Engine.items.createViewIcon(id)[0] :
            Engine.tpls.createViewIcon(id, Engine.itemsViewData.HELPER_VIEW, tplLoc)[0];

        $helper.find('.canvas-icon').replaceWith($icon);
    };

    window.getZoomFactor = function() {
        var $body = $('body');
        var zoom = Engine.zoomFactor;
        var actualWidth = $body.width();
        var widthNormal = zoom * actualWidth;
        return actualWidth / widthNormal;
    };

    window.goToUrl = function(url) {
        //url = 'http://' + url;
        //var pattern = new RegExp('^https://([a-z1-9.]*?)(margonem\.pl)[^/\\?=a-z]?');
        //if (pattern.test(url)) window.open(url);
        //else {
        var safeURL = window.escapeHTML(url);
        safeURL = ' ' + parseContentBB(safeURL);
        mAlert(_t('url_chat_warning %url%', {
            '%url%': safeURL
        }), [{
            txt: _t('yes'),
            callback: function() {
                var wnd = window.open(url);
                wnd.opener = null;
                return true;
            }
        }, {
            txt: _t('no'),
            callback: function() {
                return true;
            }
        }]);
        //}

        /*
         *'<b style="color:red">PamiÄtaj, aby NIGDY nie podawaÄ swojego hasÅa<br>'
         +'na stronach oferujÄcych darmowe SÅ i zÅoto.</b> PodajÄc tam hasÅo masz 100% pewnoÅci, '
         +'Å¼e wÅaÅciciel tej strony ukradnie z Twojego konta wszystko, co wartoÅciowe.'
         +'<br><br><center><b>Czy jesteÅ pewny, Å¼e chcesz wejÅÄ pod adres:</b><br><u style="color:#090">'
         +url+'</u> ?</center><br>'
         */
    };

    window.ts = function() { //TS in microseconds
        var now = new Date();
        return parseInt(now.getTime());
    };

    window.getTimeStampEv = function() {
        let ev = Engine.getEv();
        if (!ev) return null;
        var date = new Date(ev * 1000);
        //var date = new Date();
        var day = "0" + date.getDate();
        var mounth = "0" + (date.getMonth() + 1);
        var year = "0" + date.getFullYear();
        return day.substr(-2) + '.' + mounth.substr(-2) + '.' + year.substr(-4);
    };

    window.getStartYear = function(ts) {
        var d = new Date(ts * 1000);
        return d.getFullYear();
    };

    window.getStartMonth = function(ts) {
        var d = new Date(ts * 1000);
        return d.getMonth();
    };

    window.getStartDay = function(ts) {
        var d = new Date(ts * 1000);
        return d.getDate();
    };

    window.createNiInput = ({
        val,
        cl,
        type,
        placeholder,
        changeClb,
        focusoutClb,
        clearClb,
        tipClearClb,
        keyUpClb,
        tip,
        readonly = false,
        clear = true,
        useDebounce = false
    }) => {
        let $niInput = require('@core/Templates').get("ni-input-text");
        let $input = $niInput.find('input').val(val);
        let $clearCross = $niInput.find('.clear-cross');

        if (tip) {
            $input.tip(tip);
        }

        if (cl) {
            $niInput.addClass(cl);
        }

        let waitTime = 300;

        if (isset(useDebounce)) {

            let debounceIntVal = useDebounce !== true && isIntVal(useDebounce)

            if (debounceIntVal) {
                waitTime = useDebounce;
            }
        }

        const debouncedCallback = window.debounce((callback) => callback(), waitTime);

        setInputMask($input, type);

        if (clear) {
            $clearCross.tip(tipClearClb ? tipClearClb : _t('delete'));
            $clearCross.on('click', () => {
                let clearVal = $input.val();

                if ($input.val('') != '') $input.val('');

                manageClearCrossVisible();
                if (isset(clearClb)) clearClb(clearVal);
            });
        }

        $input.on('change input', (e, e2) => {
            if (clear) {
                manageClearCrossVisible();
            }

            if (e.isTrigger) return

            if (isset(changeClb)) {
                let val = $input.val();
                if (!useDebounce) {
                    changeClb(val);
                } else {
                    debouncedCallback(() => changeClb(val));
                }
            }
        });

        $input.keyup((e) => {
            if (clear) {
                manageClearCrossVisible();
            }

            if (isset(keyUpClb)) {
                let val = $input.val();

                if (!useDebounce) {
                    keyUpClb(val, e);
                } else {
                    debouncedCallback(() => keyUpClb(val, e));
                }
            }
        });

        $input.focusout(function(e) {
            if (isset(focusoutClb)) {
                let val = $input.val();
                focusoutClb(val, e);
            }
        })

        function manageClearCrossVisible() {
            if (readonly) return;

            let clearCrossVisibility = $niInput.hasClass('isClearCross');
            let val = $input.val();
            if (val === '') {
                if (clearCrossVisibility) $niInput.removeClass('isClearCross');
            } else {
                if (!clearCrossVisibility) $niInput.addClass('isClearCross');
            }
        }

        if (placeholder) {
            createInputPlaceholder(placeholder, $input);
        }

        if (readonly) {
            $input.prop("readonly", true);
        }

        return $niInput;
    };

    window.getStartWeekDay = function(ts) {
        var d = new Date(ts * 1000);
        return d.getDay();
    };

    window.ut_date = function(ts) { // date from unix timestamp
        var d = new Date(ts * 1000),
            y = d.getFullYear();

        return `${zero(d.getDate())}.${zero(d.getMonth()+1)}.${y}`;
    };

    window.ut_time = function(ts, sec, twelveHour) { // date&time from unix timestamp
        var d = new Date(ts * 1000);
        let hours = d.getHours();
        let str = null;

        if (twelveHour) {


            let suffix = null;

            if (hours > 11) {
                hours -= 12;
                suffix = 'PM';
            } else {
                suffix = 'AM';
            }

            hours = hours == 0 ? 12 : hours;

            str = zero(hours) + ":" + zero(d.getMinutes());
            if (sec) str += ":" + zero(d.getSeconds());
            str += suffix;

        } else {
            str = zero(hours) + ":" + zero(d.getMinutes());
            if (sec) str += ":" + zero(d.getSeconds());
        }

        return str;
    };

    window.devConsoleLog = function() {
        //let a = [];

        //for (let i = 0; i < arguments.length; i++) {
        //	a.push(arguments[i]);
        //}

        if (!getDebug()) return;

        //if (Engine.worldConfig.getWorldName() == "dev") console.log("DEV MSG", a.join(", "));
        if (Engine.worldConfig.getWorldName() == "dev") {

            if (arguments[0] && arguments[1] && arguments[2]) console.log("DEV MSG", arguments[0], arguments[1], arguments[2]);
            else if (arguments[0] && arguments[1]) console.log("DEV MSG", arguments[0], arguments[1]);
            else console.log("DEV MSG", arguments[0]);
        }
    }

    window.ut_fulltime = function(ts, full = false, firstWriteTime = false) { // date&time from unix timestamp
        //return ut_date(ts) + ' ' + ut_time(ts, full);
        return firstWriteTime ? (ut_time(ts, full) + " " + ut_date(ts)) : (ut_date(ts) + ' ' + ut_time(ts, full));
    };

    window.getNIInfoIcon = function(data) {
        let $smallInfo = require('@core/Templates').get('info-icon');

        if (isset(data.tip)) $smallInfo.tip(data.tip);

        return $smallInfo;
    };

    window.getRandomElementFromArray = function(randomArray) {
        let maxIndex = randomArray.length - 1;
        let index = Math.round(Math.random() * maxIndex);

        return randomArray[index];
    }

    window.getCurrentDate = (data) => {
        const
            date = new Date(),
            day = zero(date.getDate()),
            month = zero(date.getMonth() + 1),
            year = date.getFullYear();

        if (!data) return `${day}.${month}.${year}`;
        else {
            let str = '';

            if (data.day) str += day + '.';
            if (data.month) str += month + '.';
            if (data.year) str += year + '.';

            return str.slice(0, -1);
        }
    };

    window.createHamburgerMenuButton = (cl, clb) => {
        const $manageHamburgerButton = $('<div>');
        const $iconClose = $('<div>').addClass('ie-icon ie-icon-menu');

        $manageHamburgerButton.addClass(cl);
        $manageHamburgerButton.append($iconClose);

        $manageHamburgerButton.click(function(e) {
            let menu = [];

            clb(e, menu);

            Engine.interface.showPopupMenu(menu, getE(e, e));
        });

        return $manageHamburgerButton;
    }

    window.zero = function(x, z) {
        if (!isset(z)) z = 2;
        x = x.toString();
        while (x.length < z) x = '0' + x;
        return x;
    };

    window.isBooleanWithWarning = function(val) {
        if (isBoolean(val)) return true;
        else {
            errorReport('Helpers.js', "isBooleanWithWarning", "This is not boolean", val);
            return false
        }
    };

    window.pageReload = function() {
        location.reload();
    }

    window.checkPosIsCollisionWithLayers = function(mousePos, whiteListLayersData) {
        const posX = mousePos.x;
        const posY = mousePos.y;

        for (let pos in whiteListLayersData) {

            let $whiteLayerData = whiteListLayersData[pos];
            let $whiteLayer = $whiteLayerData[0];
            let margin = $whiteLayerData[1];
            let rect = $whiteLayer[0].getBoundingClientRect();
            let minX = rect.left - margin;
            let minY = rect.top - margin;
            let maxX = minX + rect.width + margin;
            let maxY = minY + rect.height + margin;

            if (
                minX < posX && posX < maxX &&
                minY < posY && posY < maxY) {

                return true
            }

        }

        return false
    };

    window.hexToRgb = function(hex) {

        const FUNC = "hexToRgb";

        let bugColor = {
            r: 0,
            g: 0,
            b: 0
        };

        if (!isStringVal(hex)) {
            errorReport(moduleData.fileName, FUNC, "it is not string!", hex);
            return bugColor
        }

        if (hex.length != 7) {
            errorReport(moduleData.fileName, FUNC, "incorrect length!", hex);
            return bugColor
        }

        if (hex[0] != '#') {
            errorReport(moduleData.fileName, FUNC, "hash not defined", hex);
            return bugColor
        }

        hex = hex.replace(/^#/, '');

        var r = parseInt(hex.substring(0, 2), 16);
        var g = parseInt(hex.substring(2, 4), 16);
        var b = parseInt(hex.substring(4, 6), 16);

        return {
            r: r,
            g: g,
            b: b
        };
    }

    //window.SHADOW_COLOR = "black";
    //window.STROKE_STYLE_COLOR = "black";

    window.calculateDiff = function(s1, s2) {
        //var s1 = unix_time();
        //if (typeof (s2) == 'undefined') s2 = unix_time();
        var diff = Math.abs(isset(s2) ? s1 - s2 : s1) / 60;
        if (diff < 110) return _t('time_min %val%', {
            '%val%': Math.round(diff)
        }, 'time_diff');
        else if (diff < 1440) return _t('time_h %val%', {
            '%val%': Math.round(diff / 60)
        }, 'time_diff');
        else return _t('time_days %val%', {
            '%val%': Math.round(diff / 1440)
        }, 'time_diff');
    };

    window.calculateDiffFull = function(s1, s2, color = true) {
        const diff = (s1 - s2) * 1000;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        let dayHidden = d < 1;
        let hourHidden = dayHidden && h < 1;
        let secHidden = d > 0;

        let classes = '';
        if (color) {
            classes = 'green';
            if (hourHidden && m > 4) classes = 'orange';
            if (hourHidden && m <= 4) classes = 'red';
        }

        return `
			<span class="${classes}">
				${!dayHidden ? _t('time_days_short %val%', {'%val%': d}, 'time_diff') : ''}
				${!hourHidden ? _t('time_h_short %val%',    {'%val%': h}, 'time_diff') : ''}
				${_t('time_min_short %val%',  {'%val%': m}, 'time_diff')}
				${!secHidden ? _t('time_sec_short %val%',  {'%val%': s}, 'time_diff') : ''}
			</span>
		`;
    };

    window.secToParsedTime = function(sec, showSec = true, color = true) {
        const diff = sec;
        const d = Math.floor(diff / (60 * 60 * 24));
        const h = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
        const m = Math.floor((diff % (60 * 60)) / 60);
        const s = Math.floor(diff % 60);

        let dayHidden = d < 1;
        let hourHidden = dayHidden && h < 1;
        let secHidden = d > 0 || !showSec;

        let classes = '';
        if (color) {
            classes = 'green';
            if (hourHidden && m > 4) classes = 'orange';
            if (hourHidden && m <= 4) classes = 'red';
        }

        return `
			<span class="${classes}">
				${!dayHidden ? _t('time_days_short %val%', {'%val%': d}, 'time_diff') : ''}
				${!hourHidden ? _t('time_h_short %val%',    {'%val%': h}, 'time_diff') : ''}
				${_t('time_min_short %val%',  {'%val%': m}, 'time_diff')}
				${!secHidden ? _t('time_sec_short %val%',  {'%val%': s}, 'time_diff') : ''}
			</span>
		`;
    };

    window.getAlreadyInitialised = () => {
        let engine = getEngine();
        return engine && engine.interface && Engine.interface.getAlreadyInitialised();
    };

    window.isHeroAlreadyInitialised = () => {
        let engine = getEngine();
        //return engine && Object.keys(engine.hero.d).length > 0;
        return engine && engine.hero && engine.hero.getHeroAlreadyInitialised();
    };

    window.getProfIcons = function(p) {
        var tab = '';
        for (var i in p)
            tab += '<div class="profs-icon ' + p[i] + '"></div>';
        return tab;
    };

    window.getAllProfName = function(p) {
        var prof = {
            m: _t('prof_mag', null, 'eq_prof'),
            w: _t('prof_warrior', null, 'eq_prof'),
            p: _t('prof_paladyn', null, 'eq_prof'),
            t: _t('prof_tracker', null, 'eq_prof'),
            h: _t('prof_hunter', null, 'eq_prof'),
            b: _t('prof_bladedancer', null, 'eq_prof')
        };
        return prof[p];
    };

    window.setPercentProgressBar = function($progressBar, val) {
        //$progressBar.attr('bar-percent', Math.floor(val));
        $progressBar[0].setAttribute('bar-percent', Math.floor(val));
    };

    window.getMobile = function() {
        var check = false;
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            check = true;
        }
        return check;
    };

    window.mobileCheck = function() {
        return isset(window.Engine) && isset(Engine.mobile) ? Engine.mobile : getMobile();
    };

    window.getFirstElementInObject = (obj) => {
        for (let k in obj) {
            return obj[k];
        }
        return null;
    }

    window.checkObjectIsEmpty = (obj) => {
        return Object.keys(obj).length == 0;
    }

    window.blockMouseOnSpecificMap = function() {
        if ([3714, 3277, 3278, 3279, 3280].indexOf(Engine.map.d.id) > -1) return true;
    };

    window.invertKeyInputOnSpecificMap = function() {
        if ([3714].indexOf(Engine.map.d.id) > -1) return true;
    };

    window.crazyBodyOnSpecificMap = function() {
        if ([3714].indexOf(Engine.map.d.id) > -1) return true;
    };

    window.errorReport = function(file, method, message, optionalData1, optionalData2) {
        optionalData1 = optionalData1 ? optionalData1 : '';
        if (optionalData2) {
            console.error(`[${file}, ${method}] ${message}`, optionalData1, optionalData2);
            return
        }
        console.error(`[${file}, ${method}] ${message}`, optionalData1);
    };

    window.warningReport = function(file, method, message, optionalData) {
        optionalData = optionalData ? optionalData : '';
        console.warn(`[${file}, ${method}] ${message}`, optionalData);
    };

    window.connectStrings = function(...str) {
        return str.join("_");
    }

    window.getSecondLeft = function(time, opt) {
        var m = Math.floor(time / 60);
        var h = Math.floor(m / 60);
        var d = Math.floor(h / 24);

        var secondLeft = (time - m * 60);
        var minutesLeft = m - h * 60;
        var hoursLeft = h - d * 24;

        if (opt && opt.noVar) {
            let hour = hoursLeft > 9 ? hoursLeft : '0' + hoursLeft.toString();
            let minute = minutesLeft > 9 ? minutesLeft : '0' + minutesLeft.toString();
            let sec = secondLeft > 9 ? secondLeft : '0' + secondLeft.toString();

            return hour + ':' + minute + ':' + sec;
        }

        if (opt && opt.short) {
            if (d == 0 && h == 0) return minutesLeft + 'm ' + secondLeft + 's';
            if (d == 0) return hoursLeft + 'h ' + minutesLeft + 'm';
            return d + 'd ' + hoursLeft + 'h';
        }
        if (opt && (opt.d || opt.h || opt.m || opt.s)) {
            let str = '';
            if (opt.d) str += opt.h || opt.m || opt.s ? d + 'd ' : d + 'd';
            if (opt.h) str += opt.m || opt.s ? hoursLeft + 'h ' : hoursLeft + 'h';
            if (opt.m) str += opt.s ? minutesLeft + 'm ' : minutesLeft + 'm';

            if (opt.s) str += secondLeft + 's';

            return str
        }
        return d + 'd ' + hoursLeft + 'h ' + minutesLeft + 'm ' + secondLeft + 's';
    };

    window.datediff = function(first_ts, second_ts) {
        if (typeof(second_ts) == 'undefined') second_ts = unix_time();
        var ret = ['', 0];
        var diff = Math.abs(Math.ceil((first_ts - second_ts) / 60));
        ret[1] = (first_ts - second_ts) > 0 ? '+' : '-';

        if (diff < 110) ret[0] = Math.round(diff) + 'min';
        else if (diff < 1440) ret[0] = Math.round(diff / 60) + 'h';
        else ret[0] = Math.round(diff / 1440) + ' dni';

        return ret;
    };

    window.roundParser = function(n) {
        n = Math.floor(n);
        var diff = n.toString().length % 3;
        var length = n.toString().length;
        var postfix = '';
        var val = n / Math.pow(10, length > 9 ? 9 : length - (diff == 0 ? 3 : diff));
        var postfixList = {
            '0': '',
            '3': 'k',
            '6': 'm',
            '9': 'g'
        };
        for (var i in postfixList) {
            if (length > parseInt(i)) {
                postfix = postfixList[i];
            }
        }
        return {
            val: val,
            postfix: postfix
        };
    };

    //simple round with precision
    window.roundNumber = function(num, dec) {
        var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
        return result;
    };

    /* converts 12.3k to 12300 */
    window.parsePrice = function(x) {
        if (!x) return '';
        x += '';
        if (x == '' || x == ' ') return '';
        x = x.split(',').join('.');
        if (x.slice(-1) == 'g' || x.slice(-1) == 'G') return Math.round(parseFloat(x) * 1000000000);
        if (x.slice(-1) == 'm' || x.slice(-1) == 'M') return Math.round(parseFloat(x) * 1000000);
        if (x.slice(-1) == 'k' || x.slice(-1) == 'K') return Math.round(parseFloat(x) * 1000);

        if (!isNumberFunc(x)) return NaN;

        return parseInt(x);
    };

    window.setTimeoutScroll = function() {
        setTimeout(function() {
            $(".scroll-wrapper").trigger("update");
            //console.log('dialogue scroll update');
        }, 1000);
    };

    window.setTipWhenNameToLong = function($el, tip) {
        if ($el[0].scrollWidth > Math.round($el.innerWidth())) $el.tip(parseBasicBB(tip));
        else $el.tip();
    };

    window.unix_time = function(raw) {
        var now = new Date();
        //var time = (now.getTime() / 1000) - ((isset(raw) && raw) ? 0 : Engine.getServerTimeDiff());

        var time = now.getTime() / 1000;

        if (!isset(raw)) return Math.round(time);
        else return time;
    };

    window.lengthObject = function(obj) {
        var size = 0,
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    // DisableItemsManager ItemsMovedManager //
    window.itemIsDisabled = ($item) => {
        return $item.hasClass('disable-item-mark');
    };

    window.getSoundNotificationPatch = function() {
        //return 'soundNotification_' + (mobileCheck() ? 'mobile' : 'pc');
        if (mobileCheck()) return ServerStorageData.SOUND_NOTIFICATION_MOBILE;
        else return ServerStorageData.SOUND_NOTIFICATION_PC;
    };

    window.getSoundParametersPatch = function() {
        //return 'margoSounds_' + (mobileCheck() ? 'mobile' : 'pc');
        if (mobileCheck()) return ServerStorageData.MARGO_SOUNDS_MOBILE;
        else return ServerStorageData.MARGO_SOUNDS_PC;
    };

    window.setCursorAtInDraggable = function(top, left, draggableOpt) {
        let mobile = mobileCheck();
        if (mobile) return
        draggableOpt['cursorAt'] = {
            top: mobile ? 0 : top,
            left: mobile ? 0 : left
        }
    };

    window.reloadClient = function() {
        let txt = 'break_connection';
        mAlert(_t(txt), [{
            txt: _t('yes'),
            callback: function() {
                //location.reload();
                pageReload();
                return true;
            }
        }, {
            txt: _t('no'),
            callback: function() {
                let domain = getMainDomain();
                window.location.href = `https://margonem.${domain}`;
            }
        }]);
    };

    window.goToMainPageAlert = () => {
        mAlert(_t("GoToMainPage"), [{
            txt: _t('yes'),
            callback: function() {
                let domain = getMainDomain();
                window.location.href = `https://margonem.${domain}`;
                //location.reload();
                pageReload();

            }
        }, {
            txt: _t('no'),
            callback: function() {
                return true;
            }
        }]);
    };

    window.hideInterface = function() {
        $('.top.positioner').css('display', 'none');
        $('.bottom.positioner').css('display', 'none');
        $('.right-column.main-column').css('display', 'none');
        //$('.game-layer.layer').css({'top':'0px', 'right':'0px', 'bottom':'0px'});
        Engine.interface.get$gameLayer().css({
            'top': '0px',
            'right': '0px',
            'bottom': '0px'
        });
    };

    window.getFreeIdOfObject = (object, minId) => {
        let id = isset(minId) ? minId : 0;

        while (isset(object[id])) {
            id++;
        }

        return id;
    };

    window.getFreeIdOfArray = (array, minId) => {
        let object = {};

        for (let k in array) {
            let id = array[k].id;
            object[id] = true;
        }

        return getFreeIdOfObject(object, minId);
    };

    window.getCookie = function(name, unscp) {
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return null;
        } else
            begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1)
            end = dc.length;

        var str = dc.substring(begin + prefix.length, end);
        return unscp ? unescape(str) : decodeURI(str);
    };

    window.toggleFullScreen = function() {
        if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            turnOnFullScreen();
        } else {
            turnOffFullScreen();
        }
    };

    window.turnOnFullScreen = function() {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        //if (!mobileCheck()) return;
        //var Storage = require('@core/Storage');
        //var store = Storage.get('zoomFactorMobile');
        //if (!store) {
        //	Engine.zoomFactor = 0.6;
        //	Storage.set('zoomFactorMobile', 0.6);
        //} else {
        //	Engine.zoomFactor = store;
        //}
        Engine.onResize();
    };

    window.turnOffFullScreen = function() {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        //var Storage = require('@core/Storage');
        //require('@core/Interface').setZoomFactor(Storage.get('ZoomFactor'));
        Engine.onResize();
    };

    //window.tooBigScreen2 = function (newFactor) {
    //	var bodyW;
    //	//if (Engine.zoomFactor == newFactor) return false;
    //	//if (Engine.zoomFactor > newFactor) bodyW = ($('body').width() * newFactor) * Engine.zoomFactor;
    //	//else bodyW = $('body').width() / newFactor * Engine.zoomFactor;
    //
    //	//bodyW = $('body').width() / newFactor * Engine.zoomFactor * Engine.zoomFactor;
    //	bodyW = $('body').width() / newFactor * Engine.zoomFactor * Engine.zoomFactor * newFactor;
    //
    //	var rightDownWidgetW = $('.bottom-right.main-buttons-container').width() * newFactor;
    //	var leftDownWidgetW  = $('.bottom-left.main-buttons-container').width() * newFactor;
    //	var ballAndSlotsW = $('.bottom-panel.end-game').width() * newFactor;
    //
    //	console.log('body', bodyW);
    //	console.log('L R', leftDownWidgetW);
    //	console.log('Ball', ballAndSlotsW);
    //	console.log('newFactor', newFactor);
    //	console.log('\n');
    //
    //	if (leftDownWidgetW + rightDownWidgetW + ballAndSlotsW > bodyW) {
    //		//console.log('down bar is bigger than bottom positioner');
    //		return true;
    //	}
    //
    //	//console.log('ok');
    //	return false;
    //};

    //window.getWidthOfBar = function ($bar) {
    //	var index = getMaxWidgetIndex($bar);
    //	//for (var i = 6; i > 0; i--) {
    //	//	if ($bar.find("[widget-index='" + i + "']").size() > 0) {
    //	//		index = i;
    //	//		break;
    //	//	}
    //	//}
    //	return $bar.width() / 6 * index;
    //};

    window.getMaxWidgetIndex = function($bar, side) {
        //var index = 0;
        if (side == 'left') {
            for (var i = 6; i > 0; i--) {
                if ($bar.find("[widget-index='" + i + "']").length > 0) {
                    return i;
                }
            }
        } else {
            for (var i = 0; i < 6; i++) {
                if ($bar.find("[widget-index='" + i + "']").length > 0) {
                    return Math.abs(i - 6);
                }
            }
        }
        return 0;
    };

    //window.tooBigScreen = function (newFactor) {
    //	var bodyW = $('body').width() * newFactor;
    //	var leftDownWidgetW  = 308 * newFactor;
    //	var ballAndSlotsW = 564 * newFactor;
    //	if (2 * leftDownWidgetW  + ballAndSlotsW > bodyW) return true;
    //	return false;
    //};

    //window.tooBigScreen = function (newFactor) {
    //	//var bodyW = $('body').width() * newFactor;
    //
    //	var ballAndSlotsW = 564 * newFactor;
    //	var halfBody = $('body').width() * newFactor / 2;
    //	var halfHudCont = $('.hud-container').width()* newFactor / 2;
    //	var halfBallPanel = ballAndSlotsW / 2;
    //
    //	var leftDownWidgetW  = getWidthOfBar($('.bottom-left.main-buttons-container')) * newFactor;
    //	if (leftDownWidgetW + halfBallPanel > halfBody) {
    //		return 'leftDownWidgetW'
    //	}
    //	var rightDownWidgetW  = getWidthOfBar($('.bottom-right.main-buttons-container')) * newFactor;
    //	if (rightDownWidgetW + halfBallPanel > halfBody) {
    //		return 'rightDownWidgetW';
    //	}
    //
    //	var leftAddWidgetW  = getWidthOfBar($('.bg-additional-widget-left')) * newFactor;
    //	if (leftAddWidgetW + halfBallPanel > halfBody) {
    //		return 'leftAddWidgetW';
    //	}
    //	var rightAddWidgetW  = getWidthOfBar($('.bg-additional-widget-left')) * newFactor;
    //	if (rightAddWidgetW + halfBallPanel > halfBody) {
    //		return 'rightAddWidgetW';
    //	}
    //
    //	var leftUpWidgetW  = getWidthOfBar($('.top-left.main-buttons-container')) * newFactor;
    //	if (leftUpWidgetW + halfHudCont > halfBody) {
    //		return 'leftUpWidgetW';
    //	}
    //	var rightUpWidgetW  = getWidthOfBar($('.top-right.main-buttons-container')) * newFactor;
    //	if (rightUpWidgetW + halfHudCont > halfBody) {
    //		return 'rightUpWidgetW';
    //	}
    //
    //	return false;
    //};

    window.setCookie = function(name, value, expires, path, domain, secure) {
        var curCookie = name + "=" + escape(value) +
            ((expires) ? "; expires=" + expires.toGMTString() : "") +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            ((secure) ? "; secure" : "");
        document.cookie = curCookie;
    };

    window.isStringVal = (v) => {
        return typeof v == "string"
    };

    window.isIntVal = (val) => {
        let parseVal = parseInt(val)
        if (Number.isNaN(parseInt(parseVal))) return false;

        return parseVal == val;
    };

    window.isSpecificIntVal = (val, valsArray) => {
        let parseVal = parseInt(val)
        if (Number.isNaN(parseInt(parseVal))) return false;

        return valsArray.indexOf(parseVal) > -1;
    };

    window.isFloatVal = (val) => {
        let parseVal = parseFloat(val);
        if (Number.isNaN(parseFloat(parseVal))) return false;

        return parseVal == val;
    };

    window.isIntOrFloatVal = (val) => {
        return isInt(val) || isFloatVal(val);
    };

    window.isIntOrBool = (val) => {
        return isInt(val) || isBoolean(val)
    };

    window.isIntsValWithSeperator = (v) => {
        if (v == '') return false;

        let allItems = v.split(",");

        for (let k in allItems) {
            let val = allItems[k];
            let correctVal = isIntVal(val);

            if (!correctVal) return false
        }

        return true
    };

    window.elementIsObject = (element) => {
        let isObject = !elementIsArray(element) && typeof element === "object";

        return isObject;
    }

    window.elementIsArray = (element) => {
        return Array.isArray(element);
    }

    window.isset = function(x) {
        return typeof(x) != 'undefined';
    };

    window.ucfirst = function(str) {
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    };

    window.addToArrayRecord = function(a, indexToAdd, v) {
        a.splice(indexToAdd, 0, v)
    }

    window.checkRGBAObject = function(fileName, method, color, data) {
        if (!isset(color.r) || !isset(color.g) || !isset(color.b) || !isset(color.a)) {
            errorReport(fileName, method, 'attr color.r or color.g or color.b or color.a not exist!', data);
            return false
        }
        if (!isInt(color.r) || !isInt(color.g) || !isInt(color.b)) {
            errorReport(fileName, method, 'attr color.r or color.g or color.b have to integer!', data);
            return false
        }
        if (!isFloatVal(data.color.a)) {
            errorReport(fileName, method, 'attr color.a have to double val!', data);
            return false
        }

        if (data.color.a < 0 || data.color.a > 1) {
            errorReport(fileName, method, 'attr color.a have to 0-1 val!', data);
            return false
        }


        return true;
    }

    window.checkRGBOrRGBAObject = function(fileName, method, color, data, allowOnlyAlpha) {
        if (!isset(color.r) || !isset(color.g) || !isset(color.b)) {

            if (isset(color.a) && allowOnlyAlpha) {
                if (!isFloatVal(color.a)) {
                    errorReport(fileName, method, 'attr color.a have to double val!', data);
                    return false
                }

                return true;
            }

            errorReport(fileName, method, 'attr color.r or color.g or color.b not exist!', data);
            return false
        }
        if (!isInt(color.r) || !isInt(color.g) || !isInt(color.b)) {
            errorReport(fileName, method, 'attr color.r or color.g or color.b have to integer!', data);
            return false
        }

        if (isset(color.a)) {
            if (!isFloatVal(color.a)) {
                errorReport(fileName, method, 'attr color.a have to double val!', data);
                return false
            }
        }

        return true;
    }

    window.checkRGBObject = function(fileName, method, color, data) {
        if (!isset(color.r) || !isset(color.g) || !isset(color.b)) {
            errorReport(fileName, method, 'attr color.r or color.g or color.b not exist!', data);
            return false
        }
        if (!isInt(color.r) || !isInt(color.g) || !isInt(color.b)) {
            errorReport(fileName, method, 'attr color.r or color.g or color.b have to integer!', data);
            return false
        }

        return true;
    }

    window.createRecords = function(ob, addClass, callback) {
        var $tr = $('<tr>');
        for (var i = 0; i < ob.length; i++) {
            var $td = $('<td>').html(ob[i]);

            if (typeof addClass == 'object') $td.addClass(addClass[i]);
            else $td.addClass(addClass);

            recordCallback($td, callback, i);

            $tr.append($td);
        }
        return $tr;
    };

    function recordCallback($td, callback, i) {
        if (callback && callback[i]) $td.on('click', () => {
            callback[i]()
        });
    }

    window.createImgStyle = function($imgWrapper, src, cssObjNormal, cssObjBig, crazyWidth) {
        Engine.imgLoader.onload(src, false, false, (i) => {
            createImgStyleAfterOnload(i, $imgWrapper, src, cssObjNormal, cssObjBig, crazyWidth);
        }, () => {
            createImgStyle($imgWrapper, '../img/def-npc-sprite.gif', cssObjNormal, cssObjBig, crazyWidth)
        });

    };

    window.createImgStyleAfterOnload = function(imageData, $imgWrapper, src, cssObjNormal, cssObjBig, crazyWidth) {
        var $img = $imgWrapper.find('.img-avatar-correct');
        var defaultWidth = crazyWidth ? crazyWidth : 48;
        if ($img.length < 1) {
            var $imgTable = $('<div>').addClass('table-img-avatar');
            var $imgTableCell = $('<div>').addClass('table-cell-img-avatar');
            $img = $('<div>').addClass('img-avatar-correct');
            $imgTableCell.append($img);
            $imgTable.append($imgTableCell);
            $imgWrapper.append($imgTable)
        }

        var bckStyleOld = $img.css('background-image');
        var bckStyleNew = 'url("' + src + '")';
        if (bckStyleOld == bckStyleNew) return;

        var w = imageData.width / 4;
        var h = imageData.height / 4;

        if (cssObjNormal && isset(cssObjNormal.sprite) && !cssObjNormal.sprite) {
            w = imageData.width;
            h = imageData.height;
        }

        $img.css('background-image', bckStyleNew);
        $img.css('background-size', '');

        if (w > defaultWidth) {
            $img.css('background-size', '400% 400%');
            if (cssObjBig) $img.css(cssObjBig);
        } else {
            $img.width(w);
            $img.height(h);
        }
        if (h < 48 && !cssObjNormal) return;
        if (cssObjNormal) {
            if (parseInt(cssObjNormal.width) > w) cssObjNormal.width = w + 'px';
            if (parseInt(cssObjNormal.height) > h) cssObjNormal.height = h + 'px';
            $img.css(cssObjNormal);
        }

    };

    window.objectToString = (obj) => {
        let stringObject = HARD_JSON_STRINGIFY(obj);
        stringObject = removeFirstLetter(stringObject);

        return removeLastLetter(stringObject);
    }

    window.removeFirstLetter = (str) => {
        return str.substring(1);;
    }

    window.removeLastLetter = (str) => {
        return str.slice(0, -1)
    }

    window.createNpcIcon = (cl1, cl2, url, frameAMount, _fw, _fh, maxW, maxH) => {
        let fw = _fw;
        let fh = _fh;
        let scale = 1;

        if (maxW && fw > maxW) scale = maxW / fw;
        if (maxH && fh > maxH) scale = maxH / fh;

        fw = fw * scale;
        fh = fh * scale;

        let backgroundSize = 100 * frameAMount;


        return `
		  <div class=${cl1}>
			  <div class=${cl2}
          style="
            	  background : url(${url});
			      width      : ${fw}px;
			      height     : ${fh}px;
			      margin     : auto;
			      background-size: ${backgroundSize}%;
			    "
			  </div>
			</div>`;
    }

    window.getDescriptionOfKindMonster = function(wt) {
        let kind = null;

        if (wt > 99) kind = 'tytan'
        else if (wt > 89) kind = 'colossus'
        else if (wt > 79) kind = 'heros'; //heros
        else if (wt > 29) kind = 'elita3'; //elita III
        else if (wt > 19) kind = 'elita2'; //elita II
        else if (wt > 9) kind = 'elita1'; //elita I

        return kind;
    }

    window.createInputPlaceholder = (txt, $input) => {
        $input.attr("placeholder", txt);
    }

    window.createCostIconComponent = function(text, val, valClass, iconClass, item) {
        var $costIconComponent = require('@core/Templates').get('cost-icon-component'),
            txt = text === true ? _t('cost', null, 'recover') : text,
            cost;

        $costIconComponent.find('.text').html(txt);

        if (item) $costIconComponent.find('.icon').append(item);
        else $costIconComponent.find('.icon').addClass(getClImageFromPath(iconClass));

        var currency = getClImageFromPath(iconClass);
        if (currency && currency == 'money-icon') {
            cost = round(val, 2);
        } else {
            cost = val;
        }

        $costIconComponent.find('.cost').html(cost).addClass(valClass);
        return $costIconComponent;
    };

    window.getClImageFromPath = function(p) {
        switch (p) {
            case '../img/goldIconNormal.png':
                return 'money-icon';
            case '../img/draconiteIconNormal.gif':
                return 'draconite-icon';
            case '../img/honorIconNormal.gif':
                return 'honor-icon';
            default:
                return p;
        }
    };

    window.specificElementsExist = function() {
        return Engine.mails || Engine.trade || Engine.depo || Engine.auctions || Engine.shop || Engine.bonusReselectWindow || (Engine.crafting && (Engine.crafting.salvage || Engine.crafting.enhancement || Engine.crafting.extraction));
    };

    window.getE = function(e, mobileE) {
        //return isset(mobileE) ? mobileE : e;
        if (mobileCheck()) {
            if (isset(mobileE)) {
                mobileE.clientY = mobileE.clientY / Engine.zoomFactor;
                mobileE.clientX = mobileE.clientX / Engine.zoomFactor;
                return mobileE;
            } else {
                e.clientY = e.clientY / Engine.zoomFactor;
                e.clientX = e.clientX / Engine.zoomFactor;
                return e;
            }
        } else return e;
    };

    window.getXYFromRealLeftTop = function(clientX, clientY) {
        let zoom = getEngine().zoomManager.getActualZoom();
        let factor = Engine.zoomFactor;
        let $GAME_CANVAS = getEngine().interface.get$GAME_CANVAS();
        let $offset = $GAME_CANVAS.offset();
        let left = $offset.left;
        let top = $offset.top;

        return {
            x: (clientX - left) / factor / zoom + Engine.map.offset[0],
            y: (clientY - top) / factor / zoom + Engine.map.offset[1]
        }
    }

    //window.transformEPointerEventIfMobile = function (e) {
    //	getE(e)
    //}

    window.isBoolean = (val) => {
        return typeof val == "boolean";
    };

    window.isInt = function(value) {
        return !isNaN(value) && (function(x) {
            return (x | 0) === x;
        })(parseFloat(value))
    }

    window.createSmallDraconiteIcon = (price) => {
        return createSmallCurrencyIconWithCost(price, 'small-draconite')
    };

    window.createSmallGoldIcon = (price) => {
        return createSmallCurrencyIconWithCost(price, 'small-money')
    };

    window.isNumberFunc = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    window.setPositiveAndNegativeNumberInInput = function($input) {
        $input.mask('Z0000000', {
            translation: {
                // 'Z': { pattern: /-?/, optional: true },
                'Z': {
                    pattern: /[-]/,
                    optional: true
                },
                '0': {
                    pattern: /\d/
                }
            }
        });
    }

    window.setOnlyPositiveNumberInInput = function($input) {
        $input.mask('0#');
    }

    window.setOnlyPositiveFloatNumberInInput = function($input) {
        $input.mask('0999999999Y999', {
            translation: {
                'Y': {
                    pattern: /[.]/,
                    optional: true
                }
            }
        });
    };

    window.setOnlyPositiveNumberInInputWithLetter = ($input) => {
        $input.mask('0999999999Y999K', {
            translation: {
                'Y': {
                    pattern: /[.|,]/,
                    optional: true
                },
                'K': {
                    pattern: /[k|m|g]/,
                    optional: true
                }
            }
        });
    }

    window.isIframe = () => {
        return window.self != window.top;
    }

    window.setInputMask = ($input, type) => {
        switch (type) {
            case InputMaskData.TYPE.NUMBER_POSITIVE_AND_NEGATIVE:
                setPositiveAndNegativeNumberInInput($input);
                break;
            case InputMaskData.TYPE.NUMBER:
                setOnlyPositiveNumberInInput($input);
                break;
            case InputMaskData.TYPE.NUMBER_FLOAT:
                setOnlyPositiveFloatNumberInInput($input);
                break;
            case InputMaskData.TYPE.NUMBER_WITH_KMG:
                setOnlyPositiveNumberInInputWithLetter($input);
                break;
            default:
                // allow all characters
        }
    }

    function createSmallCurrencyIconWithCost(price, currencyClass) {
        let $wrapper = $('<span>').addClass("small-currency-icon");
        let $icon = $('<div>').addClass(`icon ${currencyClass}`);
        let $cost = $('<span>').addClass('value').html(formNumberToNumbersGroup(price));

        $wrapper.append($cost);
        $wrapper.append($icon);

        return $wrapper;
    }

    window.askAlert = function(data) {

        var callbacks = [];
        var re = data.re;
        var clb = data.clb;
        var inputCheck = data.inputCheck;
        const question = TextModifyByTag.parseText(data.q);
        var postName = data.postName;
        var wnd = null;
        var aux = '';
        var icon = '';
        var color = '';
        const confirmType = isset(data.m) ? data.m : data.type;
        const isConfirmHotkey = isset(data.isConfirmHotkey) ? data.isConfirmHotkey : true;
        const isCancelHotkey = isset(data.isCancelHotkey) ? data.isCancelHotkey : true;

        if (isset(data.ip) && confirmType != 'inputClbAndUpdateCost' && confirmType != 'yesno4') {
            var patch = data.ik ? CFG[data.ik] + '' + data.ip : data.ip;
            patch = patch.replace(/"/g, '&quot;');
            icon = '<div class="icon" style="background-image: url(' + patch + ')"></div>';
            if (isset(data.it)) {
                var newIt = data.it;
                if (typeof data.it == 'string') data.it = escapeHTML(data.it);
                var price = isInt(newIt) ? round(newIt, 10) : newIt;
                icon = '<div class="text">' + _t('stamina_shop_cost') + '<b> ' + price + '</b></div>' + icon;
            }
            icon = '<div class="icon-wrapper">' + icon + '</div>';
        }


        switch (confirmType) {
            case 'okcancel':
                callbacks = [{
                        txt: _t('ok', null, 'buttons'),
                        callback: function() {
                            _g(re + '1');
                            return true;
                        }
                    },
                    {
                        txt: _t('cancel', null, 'buttons'),
                        callback: function() {
                            _g(re + '0');
                            return true;
                        }
                    }
                ];
                break;
            case 'yesno':
                //return;
                callbacks = [{
                        txt: _t('yes', null, 'buttons'),
                        callback: function() {
                            Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.PL, 25);
                            //Engine.tutorialManager.checkCanFinishAndFinish(CFG.LANG.EN, 25);
                            _g(re + '1');
                            if (clb) clb();
                            return true;
                        }
                    },
                    {
                        txt: _t('no', null, 'buttons'),
                        callback: function() {
                            _g(re + '0');
                            return true;
                        }
                    }
                ];
                break;
            case 'yesno2':
                callbacks = [{
                        txt: _t('yes', null, 'buttons'),
                        callback: function() {
                            _g(re);
                            if (clb) clb();
                            return true;
                        }
                    },
                    {
                        txt: _t('no', null, 'buttons'),
                        callback: function() {
                            return true;
                        }
                    }
                ];
                break;
            case 'input':
            case 'inputNumeric':
                if (confirmType === 'inputNumeric') {
                    aux = '<div class="input-wrapper"><input class="default with-spin" value="0" type="number" /></div>';
                } else {
                    aux = '<div class="input-wrapper"><input class="default" placeholder="..." /></div>';
                }
                callbacks = [{
                        txt: _t('ok', null, 'buttons'),
                        callback: () => {
                            let val = wnd.$.find('input').val();
                            _g(re + esc(val));
                            return true;
                        }
                    },
                    {
                        txt: _t('cancel', null, 'buttons'),
                        callback: () => {
                            _g(re + '&inputCancel=1');
                            return true;
                        }
                    }
                ];
                break;
            case 'inputclb':
                aux = '<div class="input-wrapper"><input class="default" placeholder="..." /></div>';
                callbacks = [{
                        txt: _t('ok', null, 'buttons'),
                        callback: function() {
                            var val = wnd.$.find('input').val();
                            let result = clb(val);
                            if (isset(result)) return result;
                            return true;
                        }
                    },
                    {
                        txt: _t('cancel', null, 'buttons'),
                        callback: function() {
                            return true;
                        }
                    }
                ];
                break;
                // case 'numberinputclb':
                // 	aux = '<div class="input-wrapper"><input type="number" class="default" placeholder="..." /></div>';
                // 	callbacks = [
                // 		{
                // 			txt: _t('ok', null, 'buttons'),
                // 			callback: function () {
                // 				var val = wnd.$.find('input').val();
                // 				val = isNumberFunc(val) ? Math.floor(val) : val;
                // 				let result = clb(val);
                // 				if (isset(result)) return result;
                // 				return true;
                // 			}
                // 		},
                // 		{
                // 			txt: _t('cancel', null, 'buttons'),
                // 			callback: function () {
                // 				return true;
                // 			}
                // 		}
                // 	];
                // 	break;
            case 'inputClbAndUpdateCost':
                aux = '<div class="input-wrapper"><input class="default" placeholder="..." /></div>';
                callbacks = [{
                        txt: _t('ok', null, 'buttons'),
                        callback: function() {
                            var val = wnd.$.find('input').val();
                            clb(val);
                            return true;
                        }
                    },
                    {
                        txt: _t('cancel', null, 'buttons'),
                        callback: function() {
                            return true;
                        }
                    }
                ];
                break;
            case 'yesno4':
                callbacks = [{
                        txt: _t('ok', null, 'buttons'),
                        callback: function() {
                            clb();
                            return true;
                        }
                    },
                    {
                        txt: _t('cancel', null, 'buttons'),
                        callback: function() {
                            return true;
                        }
                    }
                ];
                break;
            case 'input2':
                aux = '<div class="input-wrapper"><input class="default" placeholder="..." /></div>';
                callbacks = [{
                        txt: _t('ok', null, 'buttons'),
                        callback: function() {
                            const val = wnd.$.find('input').val();
                            if (isset(inputCheck)) {
                                if (inputCheck(val)) {
                                    _g(re + val);
                                    return true;
                                }
                                return true;
                            } else {
                                _g(re + val);
                                return true;
                            }
                        }
                    },
                    {
                        txt: _t('cancel', null, 'buttons'),
                        callback: function() {
                            return true;
                        }
                    }
                ];
                break;
            case 'inputPostData':
                aux = '<div class="input-wrapper"><input class="default" placeholder="..." /></div>';
                callbacks = [{
                        txt: _t('ok', null, 'buttons'),
                        callback: function() {
                            var o = {};
                            var v = wnd.$.find('input').val();
                            Engine.codeProm.setCode(v);
                            o[postName] = Engine.codeProm.getCode();
                            _g(re, false, o);
                            return true;
                        }
                    },
                    {
                        txt: _t('cancel', null, 'buttons'),
                        callback: function() {
                            return true;
                        }
                    }
                ];
                break;
            case 'inputDataCodeProm': // hot fix!!!!!!!
                aux = '<div class="input-wrapper"><input class="default" id="promo-code-input" placeholder="..." /></div>';
                callbacks = [{
                        txt: _t('ok', null, 'buttons'),
                        callback: function() {
                            var v = wnd.$.find('input').val();
                            Engine.codeProm.setCode(v);

                            if (checkInputValIsEmptyProcedure(v)) return false

                            _g(re + Engine.codeProm.getCode());
                            return true;
                        }
                    },
                    {
                        txt: _t('cancel', null, 'buttons'),
                        callback: function() {
                            return true;
                        }
                    }
                ];
                break;
            case 'buttons':
                const {
                    buttons, hotkey
                } = data.config;
                callbacks = buttons.map(button => {
                    const btnTitle = isset(button.title.text) ? button.title.text : _t('ETK_' + button.title.key) // ETK = Engine Translate Key
                    return {
                        txt: btnTitle,
                        ...(!hotkey && {
                            hotkeyClass: ''
                        }),
                        callback: () => {
                            _g(re + button.opt);
                            return true;
                        }
                    }
                });
                break;
            case 'no-quit':
                Engine.lock.add('ask-alert');
                aux = '<div class="input-wrapper"><input class="default" placeholder="..." /></div>';
                callbacks = [{
                    txt: _t('ok', null, 'buttons'),
                    callback: function() {
                        var val = wnd.$.find('input').val();
                        if (val.toLowerCase() === 'ok') {
                            Engine.lock.remove('ask-alert');
                            return true;
                        }
                    }
                }];
                break;
        }

        const [confirmClb, cancelClb] = callbacks;
        if (isset(confirmClb) && !isset(confirmClb.hotkeyClass) && !isConfirmHotkey) confirmClb.hotkeyClass = '';
        if (isset(cancelClb) && !isset(cancelClb.hotkeyClass) && !isCancelHotkey) cancelClb.hotkeyClass = '';

        mAlert(question + icon + aux, callbacks, function(w) {
            wnd = w;
            if (confirmType == 'no-quit') {
                wnd.$.addClass('no-exit-button');
            }
            wnd.$.addClass('askAlert');

            if (data.tpl) {
                var $itemClone = null;
                var loc = data.tpl[0];
                var id = data.tpl[1];

                function createItem(i) {
                    if (i.id != id) return;
                    $itemClone = i.$.clone();
                    //$itemClone = Engine.tpls.createViewIcon(i.id, 'alert-item', i.loc)[0];
                    $itemClone = Engine.tpls.createViewIcon(i.id, Engine.itemsViewData.ALERT_ITEM_VIEW, i.loc)[0];
                }

                let keyName = Engine.itemsFetchData.M_ALERT_TPL.k;

                Engine.tpls.fetch({
                    k: keyName,
                    loc: loc
                }, createItem);
                Engine.tpls.removeCallback(keyName);

                if ($itemClone != null) {
                    if (!wnd.tpls) wnd.tpls = {};
                    wnd.tpls[id] = $itemClone;
                }
            }

            if (confirmType == 'inputClbAndUpdateCost') {
                if (data.it) {
                    if (data.tpl) wnd.$.find('.inner-content').append(createCostIconComponent(_t('stamina_shop_cost'), data.it, '', false, wnd.tpls[id]));
                    else wnd.$.find('.inner-content').append(createCostIconComponent(_t('stamina_shop_cost'), data.it, '', data.ip, false));
                    wnd.$.find('.default').keyup(function() {
                        var val = wnd.$.find('.default').val()
                        wnd.$.find('.cost').html(parseInt(val) * parseInt(data.it));
                    });
                }

            }

            if (confirmType == 'yesno4') {
                if (data.it) {
                    if (data.tpl) wnd.$.find('.inner-content').append(createCostIconComponent(_t('stamina_shop_cost'), data.it, '', false, wnd.tpls[id]));
                    else wnd.$.find('.inner-content').append(createCostIconComponent(_t('stamina_shop_cost'), data.it, '', data.ip, false));
                }
            }

        });
        return wnd;
    };

    window.checkInputValIsEmptyProcedure = (v, _alertText) => {
        let empty = checkValIsEmpty(v);
        if (!empty) return false;

        sendEmptyAlertText(_alertText);
        return true;
    }

    window.checkParsePriceValueIsCorrect = (v) => {
        let nan = isNaN(v);

        //if (nan) mAlert("Incorrect money val!");
        if (nan) mAlert(_t("split_bad_value", null, 'item'));

        return !nan
    };

    const checkValIsEmpty = (v) => {
        return String(v).trim() === '';
    }

    const sendEmptyAlertText = (_alertText) => {
        // let alertText = _alertText ? _alertText : 'Nie wpisano Å¼adnej wartoÅci!';
        let alertText = _alertText ? _alertText : _t('No_value_was_entered!');
        mAlert(alertText);
    }

    window.mAlert2 = function(data) {
        var txt = '<div style="text-align:center;"><span style="font-size:0.8em;color:#666;">' + _t('write_ok_to_confirm') + '</div>';
        askAlert({
            q: data + txt,
            m: 'no-quit'
        });
    };

    window.isOwnItem = (item) => item.own === Engine.hero.d.id;

    window.notOwnItem = function(id, item) {
        if (!isOwnItem(item)) {
            Engine.items.deleteItem(id);
            if (Engine.trade) {
                Engine.trade.removeTradeItem(id);
                return true;
            }
            return false;
        }
        return false;
    };

    window.copyClipboard = function(messaage) {
        var $copyContent = document.createElement("textarea");
        $copyContent.style.position = 'absolute';
        $copyContent.style.opacity = '0';
        $copyContent.value = messaage;
        document.body.appendChild($copyContent);
        $copyContent.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.log("Your browser doesn't support copy button");
        }
        document.body.removeChild($copyContent);
    };


    /**
     * default callback -> first callback accept action, sencond cancel action. Depend with hotkey "Enter" and "Esc" issue
     *
     * callbacks: [
     *   {txt:'',callback:function:(){}},
     *   {txt:'',callback:function:(){}}
     * ]
     *
     * if you dont want default callback hothey use hotkeyClass:
     * callbacks: [
     *   {
     *     txt:'',
     *     hotkeyClass: 'alert-cancel-hotkey',
     *     callback:function:(){},
     *   {
     *     txt:'',
     *     hotkeyClass: 'alert-accept-hotkey',
     *     callback:function:(){}
     *   },
     *   {
     *     txt:'',
     *     hotkeyClass: '',
     *     callback:function:(){}
     *   }
     * ]
     * hotkeyClass opt: '', 'alert-accept-hotkey', 'alert-cancel-hotkey'
     **/
    window.mAlert = function(content, callbacks, wndHandle, layerName) {
        if (isSameAlertExist(content)) return;

        if (!layerName) layerName = LayersData.$_M_ALERT_LAYER;
        else console.log(layerName);

        let $parentLayer;

        switch (layerName) {
            case LayersData.$_M_ALERT_LAYER:
                $parentLayer = Engine.interface.get$mAlertLayer();
                break;
            case LayersData.$_M_ALERT_MOBILE_LAYER:
                $parentLayer = Engine.interface.get$mAlertMobileLayer();
                break;
                // case 2: $parentLayer = Engine.interface.get$consoleLayer();break;
                // case 3: $parentLayer = Engine.interface.get$tutorialLayer();break;
                // case 4: $parentLayer = Engine.interface.get$alertsLayer();break;
            default:
                console.error('[Helpers.js, mAlert] Bad Name LAYER', layerName);
        }

        var wnd = Engine.windowManager.add({
            content: content,
            //nameWindow        : 'alert-wnd',
            nameWindow: Engine.windowsData.name.ALERT_WND,
            title: _t('alert_default_title'),
            backdrop: $parentLayer,
            closeable: false,
            addClass: 'mAlert'
        });

        wnd.$.prepend($('<div>').addClass('paper-background interface-element-middle-1-background-stretch'));

        switch (layerName) {
            case LayersData.$_M_ALERT_LAYER:
                wnd.addToMAlertLayer();
                break;
            case LayersData.$_M_ALERT_MOBILE_LAYER:
                wnd.addToMobileAlertLayer();
                break;
                // case 2: wnd.addToConsoleLayer();break;
                // case 3: wnd.addToTutorialLayer();break;
                // case 4: wnd.addToAlertLayer();break;
            default:
                console.error('[Helpers.js, mAlert] Bad Name LAYER', layerName);
        }

        //wnd.$.addClass('mAlert');
        //wnd[appendWndFuncName]();			// <--- appendWindowToLayer
        //wnd.$.appendTo($parentLayer);

        if (typeof(callbacks) != 'undefined' && callbacks) {
            //ALERT WINDOW WITH CUSTOM CALLBACKS
            for (var i = 0; i < callbacks.length; i++) {
                (function(c, index) {
                    var $but = wnd.addControll(c.txt, 'small', function() {
                        if (c.callback()) {
                            wnd.close();
                            wnd.remove();
                        }
                    });
                    if (c.hasOwnProperty('hotkeyClass')) {
                        if (c.hotkeyClass == '') return
                        if (c.hotkeyClass == 'alert-accept-hotkey') {
                            $but.addClass('alert-accept-hotkey');
                            $but.find('.label').html(c.txt + ' [âµ]');
                            return
                        }
                        if (c.hotkeyClass == 'alert-cancel-hotkey') {
                            $but.addClass('alert-cancel-hotkey');
                            $but.find('.label').html(c.txt + ' [Esc]');
                            return
                        }
                        console.log('Bug! undefined c.hotkeyClass: ', c.hotkeyClass);
                        return;
                    }
                    if (index == 0) {
                        $but.addClass('alert-accept-hotkey');
                        $but.find('.label').html(c.txt + ' [âµ]');
                        return
                    }
                    if (index == 1) {
                        $but.addClass('alert-cancel-hotkey');
                        $but.find('.label').html(c.txt + ' [Esc]');
                        return
                    }
                })(callbacks[i], i);
            }
        } else {
            //DEFAULT ALERT WINDOW
            let $but = wnd.addControll("Ok", 'small', function() {
                wnd.close();
                wnd.remove();
            });
            $but.addClass('alert-accept-hotkey');
            $but.find('.label').html('Ok [âµ]');
        }

        //if (isset(arguments[2])) wnd.label(arguments[2]);


        wnd.center();

        //wnd handle for asynchronous require call
        if (typeof(wndHandle) == 'function') wndHandle(wnd);
    };

    window.isSameAlertExist = function(content) {
        var $test = $('<div>').html(content);
        var searchContent = $test.html();
        var $alerts = $(".mAlert .inner-content");
        var isExist = false;
        if ($alerts.length > 0) {
            $($alerts).each(function(index, element) {
                if (searchContent === $(element).html()) isExist = true;
            });
        }
        $test.remove();
        return isExist;
    };

    window.getHeroLevel = () => {
        if (!Engine.hero) {
            return 0;
        }

        return Engine.hero.getLevel();
    };

    window.getHeroProf = () => {
        if (!Engine.hero) {
            return 0;
        }

        return Engine.hero.getProf();
    };
    /*
    	window.addCharacterInfoTip = ($objectToTip, charData) => {

    		let br 					= "<br>";
    		let colon 				= ": ";
    		let nick 				= charData.nick;
    		let level 				= charData.level;
    		let operationLevel 		= charData.operationLevel;
    		let prof 				= charData.prof;

    		if (level < 301) {
    			operationLevel = 0;
    		}

    		let operationLevelStr 	= operationLevel ? (_t('character_operation_lvl') + colon + operationLevel + br) : '';


    		let tip = _t('character_nick') + colon + nick + br +
    			_t('character_lvl') + colon + level + br +
    			operationLevelStr +
    			_t('character_prof') + colon + getAllProfName(prof) + br;

    		$objectToTip.tip(tip);
    	};
    */

    window.addCharacterInfoTip = ($objectToTip, data) => {
        CharacterInfo.addCharacterInfoTip($objectToTip, data);
    }

    window.getCharacterInfo = (data) => {
        return CharacterInfo.getCharacterInfo(data);
    };

    window.updateAllCharacterInfo = () => {
        CharacterInfo.updateAllCharacterInfo();
    };
    /*
    	window.getCharacterInfo = (options = {}) => {
    		let nick;

    		if (options.showNick) {
    			nick = options.nick;
    			nick += " ";
    		} else {
    			nick = "";
    		}

    		let operationLevel 		=  options.operationLevel;
    		let level 				=  options.level;
    		let prof				=  options.prof;

    		if (level < 301) {
    			operationLevel = 0;
    		}

    		//let strOperationLevel 	= operationLevel ? ("|" + operationLevel + prof) : '';
    		//let strProf 			= prof ? prof : '';

    		//let kindOfShowLevelAndOperationLevel = getKindOfShowLevelAndOperationLevel();

    		let result = getCharacterInfoText(nick, level, operationLevel, prof);

    		//switch (kindOfShowLevelAndOperationLevel) {
    		//	case 0: result = nick + "(" + level + strProf + strOperationLevel + ")";	break;
    		//	case 1: result = nick + "(" + strOperationLevel + level + strProf + ")";	break;
    		//	case 2: result = nick + "(" + level + strProf + ")";						break;
    		//	case 3: result = nick + "(" + strOperationLevel + ")";						break;
    		//	default : {
    		//		errorReport("Helpers.js", "getCharacterInfo", "incorrect case", kindOfShowLevelAndOperationLevel);
    		//		result =  nick + "(" + level + strProf + strOperationLevel + ")";
    		//	}
    		//}

    		if (!options.htmlElement) {
    			return result;
    		}

    		result = `<div class="character-info" nick="${nick}" level="${level}" operationLevel="${operationLevel}" prof="${prof}">${result}</div>`;

    		return result;

    		//return nick + "(" + level + strProf + strOperationLevel + ")";
    	};

    	window.getLevelAndOperationLevel = (nick, level, operationLevel, prof) => {
    		let strOperationLevel 	= operationLevel ? ("|" + operationLevel + prof) : '';
    		let strProf 			= prof ? prof : '';

    		return nick + "(" + level + strProf + strOperationLevel + ")"
    	};

    	window.getOperationLevelAndLevel = (nick, level, operationLevel, prof) => {
    		let strOperationLevel 	= operationLevel ? (operationLevel + prof + "|") : '';
    		let strProf 			= prof ? prof : '';

    		return nick + "(" + strOperationLevel + level + strProf + ")"
    	};

    	window.getOnlyLevel = (nick, level, operationLevel, prof) => {
    		let strProf 			= prof ? prof : '';

    		return	nick + "(" + level + strProf + ")";
    	};

    	window.getOnlyOperationLevel = (nick, level, operationLevel, prof) => {
    		let strOperationLevel 	= operationLevel ? (operationLevel + prof) : (level + prof);

    		return nick + "(" + strOperationLevel + ")"
    	};

    	window.getCharacterInfoText = (nick, level, operationLevel, prof) => {
    		let kindOfShowLevelAndOperationLevel = getKindOfShowLevelAndOperationLevel();

    		let result = '';

    		switch (kindOfShowLevelAndOperationLevel) {
    			case 0: result = getLevelAndOperationLevel(nick, level, operationLevel, prof);			break;
    			case 1: result = getOperationLevelAndLevel(nick, level, operationLevel, prof);			break;
    			case 2: result = getOnlyLevel(nick, level, operationLevel, prof);						break;
    			case 3: result = getOnlyOperationLevel(nick, level, operationLevel, prof);				break;
    			default : {
    				errorReport("Helpers.js", "getCharacterInfo", "incorrect case", kindOfShowLevelAndOperationLevel);
    				result =  getLevelAndOperationLevel(nick, level, operationLevel, prof);
    			}
    		}

    		return result;
    	}

    	window.updateAllCharacterInfo = function () {

    		getEngine().others.otherTipRefresh();
    		//getEngine().others.clearDataToDraw();
    		Engine.miniMapController.handHeldMiniMapController.refreshMiniMapController();
    		Engine.whoIsHere.updateWhoIsHereAfterSaveInServerStorage();
    		Engine.hero.updateTip();
    		Engine.hero.updateNick();

    		let $allCharacterInfo = $(".character-info");

    		console.log($allCharacterInfo.length);

    		$allCharacterInfo.each(function () {
    			let $this = $(this);

    			let nick 			= $this.attr("nick");
    			let level 			= $this.attr("level");
    			let operationLevel 	= parseInt($this.attr("operationLevel"));
    			let prof 			= $this.attr("prof");
    			let result 			= getCharacterInfoText(nick, level, operationLevel, prof);

    			$this.html(result);
    		})
    	}
    */
    window.message = function(text, noWait) {
        if (text === '') return;
        text = decodeHtmlEntities(text);
        text = parseText(text);
        //if (Engine.opt(8)) noWait = true;
        if (!isSettingsOptionsInterfaceAnimationOn()) {
            noWait = true;
        }
        var display = $('.loader-layer').css('display');
        let interfaceLightMode = getEngine().interface && getEngine().interface.getInterfaceLightMode();
        let selectorOfBigMessages = interfaceLightMode ? '.big-messages-light-mode' : '.big-messages'
        var $bigMessage = Engine.interface.get$mAlertLayer().find(selectorOfBigMessages);

        if (!noWait && display == 'block') {
            setTimeout(function() {
                message(text);
            }, 500);
            return;
        }

        var recenter = function() {
            //var $bigMessage = $('.game-window-positioner').find('.mAlert-layer .big-messages');
            //var h = $(window).height() / (Engine.dialogue ? 3 : 1.4) - $('.console-and-mAlert-layer .big-messages').height() / 2;
            var h = $(window).height() / (Engine.dialogue ? 3 : 1.4) - $bigMessage.height() / 2;
            var attr = {
                'top': h
            };
            if (noWait) attr['left'] = 240;
            $bigMessage.css(attr);
        };

        var $m = $('<div class="message"><div class="inner">' + parseContentBB(text) + '</div></div>');
        // if (noWait) Engine.interface.get$mAlertLayer().find('.message').remove();
        $bigMessage.append($m);
        $m.click(function() {
            $(this).remove();
        });

        if (interfaceLightMode) {
            //$m.addClass('active');
            setTimeout(function() {
                $m.delay(4000).fadeOut(300, function() {
                    $(this).remove();
                });
            }, 100);
            return
        }

        if (noWait) {
            $m.addClass('active');
            setTimeout(function() {
                $m.remove();
                recenter();
            }, 4000);
        } else {
            setTimeout(function() {
                $m.addClass('active').delay(4000).fadeOut(300, function() {
                    $(this).remove();
                    recenter();
                });
            }, 100);
        }
        recenter();
    };

    window.achMessage = function(text) {
        var data = text.split(',');
        message(parsePopupBB(data[3]));
    };

    window.whichTransitionEvent = function() {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    };

    window._l = function() {
        //return 'en';
        return __build.lang;
    };

    // window.getGeoDomain = function () {
    // 	let l = _l();
    // 	switch (l) {
    // 		case CFG.LANG.PL:
    // 			return CFG.DOMAIN.PL;
    // 		case CFG.LANG.EN:
    // 			return 'com';
    // 		default :
    // 			console.warn('[Helper.js, getGeoDomain] Bad lang', l);
    // 			return null;
    // 	}
    // };

    window.getMainDomain = function() {
        let l = _l();
        switch (l) {
            case CFG.LANG.PL:
                return CFG.DOMAIN.PL;
            case CFG.LANG.EN:
                return CFG.DOMAIN.COM;
            default:
                console.warn('[Helper.js, getMainDomain] Incorrect lang', l);
                return null;
        }
    };

    window.isEn = function() {
        return _l() == CFG.LANG.EN;
    }

    window.isPl = function() {
        return _l() == CFG.LANG.PL;
    }

    window.strip_tags = function(html, allowed) {
        //it adds space after all replaced text
        if (arguments.length < 3) {
            html = html.replace(/<\/?(?!\!)[^>]*>/gi, ' ');
        } else {
            var specified = eval("[" + arguments[2] + "]");
            if (allowed) {
                var regex = '</?(?!(' + specified.join('|') + '))\b[^>]*>';
                html = html.replace(new RegExp(regex, 'gi'), ' ');
            } else {
                var regex = '</?(' + specified.join('|') + ')\b[^>]*>';
                html = html.replace(new RegExp(regex, 'gi'), ' ');
            }
        }
        var clean_string = html;
        return clean_string;
    };

    window.htmlspecialchars = function(p_string) {
        p_string = p_string.replace(/&/g, '&amp;');
        p_string = p_string.replace(/"/g, '&quot;');
        p_string = p_string.replace(/'/g, '&#039;');
        return p_string;
    };

    window.deletePositionFixed = function(text) {
        return text.replace(/position\s*:\s*(fixed|absolute)/gi, '')
    };

    window.esc = function(str) {
        if (!str) return '';
        return encodeURIComponent(str);
        // return escape(str);
        // return str.replace(/%/g, "%25").replace(/&/g, "%26").replace(/#/g, "%23")
        // 	.replace(/\?/g, "%3f").replace(/\n/g, "%0A").replace(/\r/g, "%0D");
    };

    window.hideOrShowScrolbar = function(heightToShowScroll, content, top) {
        var height = 0;
        var $sW = content.find('.scroll-wrapper');
        var $sP = content.find($('.scroll-pane'));
        $sP.children().each(function(i, e) {
            if ($(e).css('display') != 'none')
                height += $(e).height();
        });
        if (height > heightToShowScroll) {
            $sW.css('height', heightToShowScroll + 'px');
        } else {
            $sW.css('height', 'auto');
        }
        $('.scroll-wrapper', content).trigger('update');
        if (top) $('.scroll-wrapper', content).trigger('scrollTop');
    };

    window.strtotime = function(text, now) {
        //  discuss at: http://phpjs.org/functions/strtotime/
        //     version: 1109.2016
        // original by: Caio Ariede (http://caioariede.com)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Caio Ariede (http://caioariede.com)
        // improved by: A. MatÃ­as Quezada (http://amatiasq.com)
        // improved by: preuter
        // improved by: Brett Zamir (http://brett-zamir.me)
        // improved by: Mirko Faber
        //    input by: David
        // bugfixed by: Wagner B. Soares
        // bugfixed by: Artur Tchernychev
        //        note: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
        //   example 1: strtotime('+1 day', 1129633200);
        //   returns 1: 1129719600
        //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
        //   returns 2: 1130425202
        //   example 3: strtotime('last month', 1129633200);
        //   returns 3: 1127041200
        //   example 4: strtotime('2009-05-04 08:30:00 GMT');
        //   returns 4: 1241425800

        var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

        if (!text) {
            return fail;
        }

        // Unecessary spaces
        text = text.replace(/^\s+|\s+$/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/[\t\r\n]/g, '')
            .toLowerCase();

        // in contrast to php, js Date.parse function interprets:
        // dates given as yyyy-mm-dd as in timezone: UTC,
        // dates with "." or "-" as MDY instead of DMY
        // dates with two-digit years differently
        // etc...etc...
        // ...therefore we manually parse lots of common date formats
        match = text.match(
            /^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

        if (match && match[2] === match[4]) {
            if (match[1] > 1901) {
                switch (match[2]) {
                    case '-': { // YYYY-M-D
                        if (match[3] > 12 || match[5] > 31) {
                            return fail;
                        }

                        return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                    case '.': { // YYYY.M.D is not parsed by strtotime()
                        return fail;
                    }
                    case '/': { // YYYY/M/D
                        if (match[3] > 12 || match[5] > 31) {
                            return fail;
                        }

                        return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                }
            } else if (match[5] > 1901) {
                switch (match[2]) {
                    case '-': { // D-M-YYYY
                        if (match[3] > 12 || match[1] > 31) {
                            return fail;
                        }

                        return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                    case '.': { // D.M.YYYY
                        if (match[3] > 12 || match[1] > 31) {
                            return fail;
                        }

                        return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                    case '/': { // M/D/YYYY
                        if (match[1] > 12 || match[3] > 31) {
                            return fail;
                        }

                        return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                }
            } else {
                switch (match[2]) {
                    case '-': { // YY-M-D
                        if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
                            return fail;
                        }

                        year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
                        return new Date(year, parseInt(match[3], 10) - 1, match[5],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                    case '.': { // D.M.YY or H.MM.SS
                        if (match[5] >= 70) { // D.M.YY
                            if (match[3] > 12 || match[1] > 31) {
                                return fail;
                            }

                            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                        }
                        if (match[5] < 60 && !match[6]) { // H.MM.SS
                            if (match[1] > 23 || match[3] > 59) {
                                return fail;
                            }

                            today = new Date();
                            return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                                match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
                        }

                        return fail; // invalid format, cannot be parsed
                    }
                    case '/': { // M/D/YY
                        if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
                            return fail;
                        }

                        year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
                        return new Date(year, parseInt(match[1], 10) - 1, match[3],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                    case ':': { // HH:MM:SS
                        if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
                            return fail;
                        }

                        today = new Date();
                        return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                            match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
                    }
                }
            }
        }

        // other formats and "now" should be parsed by Date.parse()
        if (text === 'now') {
            return now === null || isNaN(now) ? new Date()
                .getTime() / 1000 | 0 : now | 0;
        }
        if (!isNaN(parsed = Date.parse(text))) {
            return parsed / 1000 | 0;
        }

        date = now ? new Date(now * 1000) : new Date();
        days = {
            'sun': 0,
            'mon': 1,
            'tue': 2,
            'wed': 3,
            'thu': 4,
            'fri': 5,
            'sat': 6
        };
        ranges = {
            'yea': 'FullYear',
            'mon': 'Month',
            'day': 'Date',
            'hou': 'Hours',
            'min': 'Minutes',
            'sec': 'Seconds'
        };

        function lastNext(type, range, modifier) {
            var diff, day = days[range];

            if (typeof day !== 'undefined') {
                diff = day - date.getDay();

                if (diff === 0) {
                    diff = 7 * modifier;
                } else if (diff > 0 && type === 'last') {
                    diff -= 7;
                } else if (diff < 0 && type === 'next') {
                    diff += 7;
                }

                date.setDate(date.getDate() + diff);
            }
        }

        function process(val) {
            var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
                type = splt[0],
                range = splt[1].substring(0, 3),
                typeIsNumber = /\d+/.test(type),
                ago = splt[2] === 'ago',
                num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

            if (typeIsNumber) {
                num *= parseInt(type, 10);
            }

            if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
                return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
            }

            if (range === 'wee') {
                return date.setDate(date.getDate() + (num * 7));
            }

            if (type === 'next' || type === 'last') {
                lastNext(type, range, num);
            } else if (!typeIsNumber) {
                return false;
            }

            return true;
        };

        times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
            '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
            '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
        regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

        match = text.match(new RegExp(regex, 'gi'));
        if (!match) {
            return fail;
        }

        for (i = 0, len = match.length; i < len; i++) {
            if (!process(match[i])) {
                return fail;
            }
        }

        // ECMAScript 5 only
        // if (!match.every(process))
        //    return false;

        return (date.getTime() / 1000);
    };

    window.convertDateTime = function(date, fromTs) {

        // convert date from "2019-02-05 08:07:25" and unix timestamp to "05.02.2019 08:07"

        var today;
        fromTs = (typeof fromTs !== 'undefined') ? fromTs : false;

        if (fromTs) {
            today = new Date(date * 1000);
        } else {
            today = new Date(date);
        }

        var dd = addZero(today.getDate());
        var mm = addZero(today.getMonth() + 1); //January is 0!
        var yyyy = today.getFullYear();
        var hh = addZero(today.getHours());
        var mins = addZero(today.getMinutes());

        function addZero(num) {
            if (num < 10) {
                num = '0' + num
            }
            return num;
        }
        return `${dd}.${mm}.${yyyy} ${hh}:${mins}`;
    };

    window.debounce = function(callback, wait, immediate = false) {
        let timeout = null;
        return function() {
            const callNow = immediate && !timeout;
            const next = () => callback.apply(this, arguments);
            clearTimeout(timeout);
            timeout = setTimeout(next, wait);
            if (callNow) {
                next()
            }
        }
    };

    window.throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    };

    window.capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    };

    window.removeSpaces = (s) => {
        return s.replace(/\s/g, '');
    };

    window.createButton = (name, classes, clb) => {
        //const btn = tpl.get('button')[0];
        const btn = require('@core/Templates').get('button')[0];
        btn.classList.add(...classes);
        btn.querySelector('.label').innerHTML = name;
        btn.addEventListener(getClickEventName(), clb);
        return btn;
    };

    window.createSmallButtonWithBackground = (imgClass, btnClasses, clb) => {
        //const btn = tpl.get('button')[0];
        const btn = require('@core/Templates').get('button')[0];
        const bck = require('@core/Templates').get('add-bck')[0];
        btn.append(bck)
        btn.classList.add('small');
        btn.classList.add('small-button-with-background');
        btn.classList.add(...btnClasses);
        bck.classList.add(...imgClass);
        //btn.querySelector('.label').innerHTML = name;
        btn.addEventListener('click', clb);
        return btn;
    };

    window.setDebugMode = (debugKeysList) => {

        if (!elementIsArray(debugKeysList)) {
            errorReport("Helpers.js", "setDebugMode", "debugKeysList is not array", debugKeysList);
            return;
        }

        for (let debugKey in CFG.DEBUG_KEYS) {
            CFG.debug[debugKey] = debugKeysList.includes(debugKey);
        }

        afterDebugModeChanged();

        let debugCl = 'debug-mode-on';
        let $body = $('body');

        if (CFG.debug[CFG.DEBUG_KEYS.MAIN]) $body.addClass(debugCl);
        else $body.removeClass(debugCl);
    }

    window.getDebug = (key = CFG.DEBUG_KEYS.MAIN) => {
        return CFG.debug[key];
    }

    window.afterDebugModeChanged = () => {
        const npcs = Engine.npcs.check();
        for (const k in npcs) {
            npcs[k].debugRefreshTip();
            npcs[k].manageUpdateCollider();
        }

        const gateways = Engine.map.gateways.getList();
        for (const g in gateways) {
            gateways[g].debugRefreshTip();
        }

        const items = Engine.items.test().items;
        for (const i in items) {
            items[i].debugRefreshTip();
        }

        const tpls = Engine.tpls.test().tpls;
        for (const loc in tpls) {
            for (const i in tpls[loc]) {
                tpls[loc][i].debugRefreshTip();
            }
        }

        if (Engine.skills) {
            Engine.skills.debugRefreshTip()
        }
    }

    window.getCurrencyIcon = (prc = '') => {
        let icon;
        switch (prc) {
            case 'zl':
                icon = '/img/currency/goldIcon16.gif';
                break;
            case 'sl':
                icon = '/img/currency/draconiteIcon16.gif';
                break;
            case 'ph':
                icon = '/img/currency/phIcon16.gif';
                break;
            default:
                if (prc.includes('|')) {
                    prc = prc.split('|')[1]
                }
                icon = `${window.CFG.a_ipath}/${prc}`;
        }
        return `<i class="prc-icon" style="background: url('${icon}?v=${__build.version}') center / contain;"></i>`;
    };

    window.convertTimeToSec = (time) => { // time is 2d / 1h / 65m / 20s etc
        var unit = time.replace(/[0-9]/g, ''); //remove digits
        var value = time.replace(/\D/g, ''); //remove all except digits
        var seconds;
        switch (unit) {
            case 'd':
                seconds = value * 60 * 60 * 24;
                break;
            case 'h':
                seconds = value * 60 * 60;
                break;
            case 'm':
                seconds = value * 60;
                break;
            case 's':
                seconds = value;
                break;
        }
        return seconds;
    };

    window.convertSecToTime = (seconds) => {
        var days = Math.floor(seconds / (24 * 60 * 60));
        seconds -= days * (24 * 60 * 60);
        var hours = Math.floor(seconds / (60 * 60));
        seconds -= hours * (60 * 60);
        var minutes = Math.floor(seconds / (60));
        seconds -= minutes * (60);
        return {
            "d": days,
            "h": hours,
            "m": minutes,
            "s": seconds
        };
    };

    window.stringToHtml = (string) => {
        const tmpDIv = document.createElement('template');
        tmpDIv.innerHTML = string;
        return tmpDIv.content;
    };

    // vanilla js get siblings
    window.siblings = el => [...el.parentElement.children].filter(children => children !== el);

    window.removeFromArray = (arr, el) => {
        const index = arr.indexOf(el);
        if (index > -1) {
            arr.splice(index, 1);
            return true;
        }
        return false;
    }

    window.count = (operator, a, b) => {
        switch (operator) {
            case '<':
                return a < b;
            case '<=':
                return a <= b;
            case '>':
                return a > b;
            case '>=':
                return a >= b;
            case '==':
                return a == b;
            case '===':
                return a === b;
            case '!==':
                return a !== b;
        }
    }

    window.deleteElementFromArray = (index, array) => {
        array.splice(index, 1);
    }

    window.copyStructure = (arrayOrObject) => {
        //return JSON.parse(JSON.stringify(arrayOrObject));
        return GET_HARD_COPY_STRUCTURE(arrayOrObject);
    }

    window.arrayEquals = (array1, array2) => {
        const array1Sorted = array1.slice().sort();
        const array2Sorted = array2.slice().sort();
        return JSON.stringify(array1Sorted) === JSON.stringify(array2Sorted);
    };

    window.setAttributes = (el, attrs) => {
        for (const key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    };

    window.fixSrc = (src) => {
        if (src == '') return '';
        if (src[0] != '/') return src;
        return src.slice(1, src.length)
    }

    window.createTransVal = (val, unit = '', prefix = '', suffix = '', key = '%val%') => ({
        [key]: `${prefix}${val}${unit}${suffix}`
    });

    window.removeClassStartingWith = (node, prefix) => {
        const regx = new RegExp('\\b' + prefix + '[^ ]*[ ]?\\b', 'g');
        node.className = node.className.replace(regx, '');
        return node;
    }

    window.checkItemsAmount = (tplId) => {
        let hItems = Engine.heroEquipment.getHItems();
        let amount = 0;

        for (let k in hItems) {
            let item = hItems[k];

            //if (item.st > 0) continue;
            if (ItemState.isEquippedSt(item.st)) continue;
            if (item.tpl != tplId) continue;

            //amount += parseInt(item._cachedStats['amount']);
            if (item.issetAmountStat()) {
                amount += item.getAmountStat();
            } else {
                amount++;
            }
        }

        return amount;
    }

    window.deepMergeData = function() {

        let target = {};

        let merger = (obj) => {
            for (let prop in obj) {

                if (!obj.hasOwnProperty(prop)) continue;

                let isObject = Object.prototype.toString.call(obj[prop]) === '[object Object]';

                if (isObject) target[prop] = deepMergeData(target[prop], obj[prop]);
                else target[prop] = obj[prop];

            }
        };

        for (let i = 0; i < arguments.length; i++) {
            merger(arguments[i]);
        }

        return target;
    };



    window.getCharCode = (kCode) => {
        let char = null;
        let keysCode = {
            186: ';',
            188: ',',
            190: '.',
            191: '/',
            192: '`',
            189: '-',
            187: '=',
            219: '[',
            220: "\\",
            221: ']',
            222: "'",
            111: "/",
            106: "*",
            109: "-",
            107: "+",
            110: ","
        };

        if (keysCode[kCode]) char = keysCode[kCode];
        else char = String.fromCharCode(kCode);
        return char;
    }

    window.confirmWithCallback = ({
        msg,
        clb,
        accept = _t('yes'),
        cancel = _t('no')
    }) => {
        mAlert(msg, [{
                txt: accept,
                callback: function() {
                    if (typeof clb === "function") clb();
                    return true;
                }
            },
            {
                txt: cancel,
                callback: function() {
                    return true;
                }
            }
        ]);
    };


    window.confirmWithCallbackAcceptCost = (str, req, currencyKind, val, clb) => {
        let data = {
            ik: "oimg",
            m: "yesno2",
            q: str,
            it: val,
            re: req
        };

        if (clb) {
            data.clb = clb;
        }

        switch (currencyKind) {
            case 'z':
            case 'gold':
                data.ip = "/goldIconNormal.png";
                break;
            case 's':
            case 'credits':
                data.ip = "/draconite_small.gif";
                break;
            default:
                errorReport("Helpers.js", 'confirmWithCallbackSl', "undefined currencyKind", currencyKind);
        }

        askAlert(data);
    };

    window.confirmWithTwoCallback = ({
        msg,
        clb1,
        clb2,
        accept = _t('yes'),
        cancel = _t('no')
    }) => {
        mAlert(msg, [{
                txt: accept,
                callback: function() {
                    if (typeof clb1 === "function") clb1();
                    return true;
                }
            },
            {
                txt: cancel,
                callback: function() {
                    if (typeof clb2 === "function") clb2();
                    return true;
                }
            }
        ]);
    }

    window.confirmWitchTextInput = (msg, clb, length) => { //clb return false not close alert window
        let wnd = askAlert({
            q: msg,
            m: 'inputclb',
            clb: function(val) {
                return clb(val);
            }
        });
        const $input = wnd.$.find('.input-wrapper').find('input');
        $input.attr('maxlength', length ? length : 20);
        if (!mobileCheck()) $input.focus();
    };

    window.confirmWitchNumberTextInput = (msg, clb, options = {}) => { //clb return false not close alert window
        let wnd = askAlert({
            q: msg,
            m: 'inputclb',
            clb: function(val) {
                return clb(val);
            }
        });
        let $input = wnd.$.find('.input-wrapper').find('input');

        $input.attr('maxlength', 20);
        $input.mask('0#');

        if (isset(options.placeholder)) {
            $input.attr('placeholder', options.placeholder);
        }

        if (isset(options.value)) {
            $input.val(options.value);
        }
    };

    window.correctKey = (key) => {
        return key ? key.toUpperCase() : key;
    };

    window.fixCorsForTaintedCanvas = (i) => {
        if (i.getAttribute('crossOrigin') == null) i.setAttribute('crossOrigin', '');
    }

    //window.turnOnDebug = () => {
    //	CFG.debug.MAIN = true;
    //}
    //
    //window.turnOffDebug = () => {
    //	CFG.debug.MAIN = false
    //}

    //window.isDebug = () => {
    //	return CFG.debug;
    //}

    window.isSeptemberEnd = () => {
        const targetDate = new Date(2023, 8, 30, 23, 0, 0); // Month is zero-based (8 is September).
        const now = new Date();
        return now > targetDate;
    }

    window.getEuclideanDistance = (aX, aY, bX, bY) => {
        let dx = aX - bX;
        let dy = aY - bY;

        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }

    window.checkPartyExist = () => {
        return Engine && Engine.party;
    }

    (function($) {
        $.fn.removeClassStartingWith = function(filter) {
            $(this).removeClass(function(index, className) {
                return (className.match(new RegExp("\\S*" + filter + "\\S*", 'g')) || []).join(' ')
            });
            return this;
        };

        $.event.special.destroyed = {
            remove: function(o) {
                if (o.handler) {
                    o.handler();
                }
            }
        }

        $.fn.tipOverflow = function() {
            $(this).one("mouseenter", function() {
                if (this.offsetWidth < this.scrollWidth) {
                    $(this).tip($(this).text());
                }
            });
        };
    })(jQuery);

})();
module.exports = Helpers;