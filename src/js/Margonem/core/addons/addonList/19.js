var SocietyData = require('@core/society/SocietyData');
const Checkbox = require('@core/components/Checkbox');

module.exports = function() {
    let addonKey = Engine.windowsData.name.addon_19;
    var running = false;
    var rxmsg = null;
    var hwnd = null;
    var $style = null;
    var $btn = null;
    var settings = {
        working: true,
        clan: true,
        friend: true,
        friend_clan: true,
        other: false
    };
    // var open = false;

    function checkMsg(text) {
        var d = rxmsg.exec(text);
        if (d !== null && isset(d[1])) return d[1];
        else return null;
    }

    function getRelation(nick, cb, data) {
        if (!cb) cb = function() {};
        var once = true;
        var getOther = function(e) {
            if (e.nick == nick && once) {
                cb(e.d.relation, data);
                once = false;
            }
        }
        API.addCallbackToEvent(Engine.apiData.NEW_OTHER, getOther);
        API.removeCallbackFromEvent(Engine.apiData.NEW_OTHER, getOther);
        if (once) {
            cb("", data);
        }
    }

    function goodRel(rel) {
        if (settings.working) {
            //if (settings.clan && rel == "cl") {
            if (settings.clan && rel == SocietyData.RELATION.CLAN) {
                return true;
            }
            //if (settings.friend && rel == "fr") {
            if (settings.friend && rel == SocietyData.RELATION.FRIEND) {
                return true;
            }
            //if (settings.friend_clan && rel == "cl-fr") {
            if (settings.friend_clan && rel == SocietyData.RELATION.CLAN_ALLY) {
                return true;
            }
            if (settings.other) {
                return true;
            }
        }
        return false;
    }

    function answerAsk(rel, data) {
        if (goodRel(rel)) {
            var backdrop = data[1].$backdrop;
            data[1].$.remove();
            if (backdrop) {
                data[1].$backdrop.remove();
            }
            delete data[1];
            _g(data[0].re + "1");
        }
    }

    function cbAskAlert(e) {
        var nick = checkMsg(e[0].q);
        if (nick !== null) {
            getRelation(nick, answerAsk, e);
        }
    }

    function saveConf() {
        API.Storage.set(addonKey + "/conf", settings);
    }

    function initWindow() {
        var istr = _t("intro", null, "auto_accept_party");
        var $txt = $("<div>").addClass("intro mb-2").text(istr);
        var $aap = $("<div>").addClass("auto_accept_party");

        $aap.append($txt);

        hwnd = Engine.windowManager.add({
            content: $aap,
            title: _t("title", null, "auto_accept_party"),
            //nameWindow          : 'addon_19',
            nameWindow: addonKey,
            widget: Engine.widgetsData.name.addon_19,
            type: Engine.windowsData.type.TRANSPARENT,
            manageShow: false,
            managePosition: {
                'x': 251,
                'y': 60
            },
            twPadding: 'md',
            onclose: () => {
                //hwnd.$.fadeOut(200);
                hwnd.hide();
                // open = false;
                // API.Storage.set(addonKey + "/show", false);
            }
        });

        // hwnd.hide();
        hwnd.$.addClass("auto_accept_party_wnd");
        hwnd.updatePos();
        hwnd.addToAlertLayer();
    }

    function setWorkingState() {
        const
            t = [
                _t('turn_on', null, 'auto_accept_party'),
                _t('turn_off', null, 'auto_accept_party')
            ],
            $label = $btn.find('.label');
        let str;
        if (settings.working) {
            str = t[1];
            hwnd.$.removeClass("disabled");
        } else {
            str = t[0];
            hwnd.$.addClass("disabled");
        }
        $label.html(str);
    }

    function initTurnOnBtn() {
        hwnd.$.find('.window-controlls').show();
        $btn = API.Templates.get('button');
        hwnd.$.find('.window-controlls').append($btn);
        $btn.addClass('small green turn-on-btn');
        $btn.find('.label').html("-");
        $btn.click(function() {
            clickWorking();
        });
        setWorkingState();
    }

    function clickWorking() {
        settings.working = !settings.working;
        setWorkingState();
        saveConf();
    }

    function initButtons() {
        var $h = hwnd.$.find(".auto_accept_party");
        addButton($h, "clan", _t("clan", null, "auto_accept_party"));
        addButton($h, "friend", _t("friend", null, "auto_accept_party"));
        addButton($h, "friend_clan", _t("friend_clan", null, "auto_accept_party"));
        addButton($h, "other", _t("other", null, "auto_accept_party"));
    }

    function setStateButton($chbx, id) {
        if (!settings[id]) $chbx.removeClass('active');
        else $chbx.addClass('active');
    }

    function addButton($h, id, name) {
        //var $e = API.Templates.get("one-checkbox").addClass("do-action-cursor");
        //$e.find(".label").html(name);
        //var $chbx = $e.find('.checkbox');
        //setStateButton($chbx, id)
        //$e.click(function () {
        //	settings[id] = !settings[id];
        //	setStateButton($chbx, id)
        //	saveConf();
        //});
        //$h.append($e);
        //debugger;

        let checked = settings[id] ? true : false;

        const checkbox = new Checkbox.default({
                label: name,
                i: id,
                checked: checked,
                highlight: false
            },
            (state) => {
                settings[id] = !settings[id];

                if (settings[id] != checkbox.getChecked()) {
                    checkbox.setChecked(settings[id] ? true : false)
                }

                saveConf();

            }
        );
        $h.append($(checkbox.getCheckbox()));
    }

    this.manageVisible = function() {
        // open = !open;

        if (hwnd.isShow()) hwnd.hide();
        else {
            hwnd.show();
            hwnd.setWndOnPeak();
        }

        // if (open) {
        // 	hwnd.show();
        // 	hwnd.setWndOnPeak();
        // } else {
        // 	hwnd.hide();
        // }
        // API.Storage.set(addonKey + "/show", open);
    }

    this.start = function() {
        if (running) return;
        running = true;
        // if(_l() == 'pl') {
        if (isPl()) {
            rxmsg = /Czy chcesz doÅÄczyÄ do druÅ¼yny gracza <strong>(.*)<\/strong>\?/;
        } else {
            rxmsg = /Party invitation received from <strong>(.*)<\/strong>\. Would you like to join\?/;
        }

        var tab = API.Storage.get(addonKey + "/conf", settings);
        for (var t in tab) {
            settings[t] = tab[t];
        }
        initWindow();
        initButtons();
        initTurnOnBtn();

        // if (API.Storage.get(addonKey + "/show", false)) {
        // 	hwnd.show();
        // 	open = true;
        // }
        $style = $(`<style>
			.auto_accept_party{
				color: white;
			}
		</style>`).appendTo("head");

        API.addCallbackToEvent(Engine.apiData.NEW_ASK, cbAskAlert);
    };

    this.stop = function() {
        if (!running) return;
        running = false;
        // delete rxmsg;
        rxmsg = null

        hwnd.remove();
        hwnd = null;

        $style.remove();

        API.Storage.remove(addonKey, true);
        API.removeCallbackFromEvent(Engine.apiData.NEW_ASK, cbAskAlert);
    };

}