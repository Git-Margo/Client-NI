module.exports = function() {
    const
        //addonKey = 'addon_17',
        addonKey = Engine.windowsData.name.addon_17,
        addonName = _t('elite_timer', null, 'elite_timer');

    var running = false;
    var self = this;
    var oldTitle = null;
    var interval = null;
    let revive = false;

    var msettings = ["elite", "elite2", "heroes", "titans", "hero-resp", "sound", "title"];
    var issettings = ["fadeout"];
    var defaultVal = {
        //"speed": 1,
        "fadeout": 60
    };
    var settingTip = {
        "elite": _t("elite_tip", null, "elite_timer"),
        "elite2": _t("elite2_tip", null, "elite_timer"),
        "heroes": _t("heroes_tip", null, "elite_timer"),
        "titans": _t("titans_tip", null, "elite_timer"),
        "hero-resp": _t("hero-resp_tip", null, "elite_timer"),
        "sound": _t("sound_tip", null, "elite_timer"),
        "title": _t("title_tip", null, "elite_timer"),
        //"speed": _t("speed_tip", null, "elite_timer"),
        "fadeout": _t("fadeout_tip", null, "elite_timer")
    };
    var colorTab = ["long", "short", "pass"];

    var settings = {
        elite: 1,
        elite2: 1,
        heroes: 1,
        titans: 1,
        "hero-resp": 1,
        sound: 0,
        title: 1,
        //speed: 1,
        fadeout: 60,
        show: false
    };

    const npcsTypes = {
        1: {
            short: 'E',
            fullname: _t('elita1', null, 'npcs_kind')
        },
        2: {
            short: 'E2',
            fullname: _t('elita2', null, 'npcs_kind')
        },
        3: {
            short: 'H',
            fullname: _t('heros', null, 'npcs_kind')
        },
        4: {
            short: 'T',
            fullname: _t('tytan', null, 'npcs_kind')
        },
    }

    var deadNpcs = [];
    let skippedDeads = [];

    var hwnd = null;
    var hwndEdit = null;
    var $style = null;
    var wantNew = false;
    var $inp = null;
    var $newinp = null;
    var inpActived = false;

    function isInRange(npc) {
        var hx = Engine.hero.d.x;
        var hy = Engine.hero.d.y;
        var nx = npc.d.x;
        var ny = npc.d.y;
        var max = Engine.map.d.visibility;
        if (max === null) {
            console.log('WarShadow range is null, 17 needs fix');
        }
        if (max === 0) {
            return true;
        }
        return Math.abs(hx - nx) <= max && Math.abs(hy - ny) <= max;
    }

    function removeNpc(e) {
        if (!isInRange(e) || Engine.hero.d.stasis === 1)
            return;
        var type = 0; //1-elite, 2-elite2
        if (e.d.wt > 19 && e.d.wt <= 29) {
            type = 2;
        } else if (e.d.wt > 9 && e.d.wt <= 19) {
            type = 1;
        } else if (e.d.wt > 79 && e.d.wt <= 89) { // heroes
            type = 3;
        } else if (e.d.wt > 99 && e.d.wt <= 109) { // titans
            type = 4;
        }
        const boolElite = type == 1 && settings.elite == 1;
        const boolE2 = type == 2 && settings.elite2 == 1;
        const boolHeroes = type == 3 && settings.heroes == 1;
        const boolTitans = type == 4 && settings.titans == 1;
        if (boolElite || boolE2 || boolHeroes || boolTitans) {
            addDeathNpc(e, type);
        }
    }

    function addDeathNpc(e, type) {
        const {
            respBaseSeconds,
            resp_rand = 10
        } = e.d;
        const respMultiplier = resp_rand / 100;
        if (!isset(respBaseSeconds) || respBaseSeconds === 1) return; // colossus

        const topRangeResp = getTopRangeResp(respBaseSeconds, respMultiplier);
        const bottomRangeResp = getBottomRangeResp(respBaseSeconds, respMultiplier);
        const obj = {
            id: e.d.id,
            name: e.d.nick,
            x: e.d.x,
            y: e.d.y,
            map: Engine.map.d.name,
            type: type,
            char: Engine.hero.d.id,
            heroData: getHeroData(),
            presp: unix_time() + topRangeResp,
            minResp: unix_time() + bottomRangeResp
        };

        addToData(obj, getIdOfObj(obj));
    }

    function getTopRangeResp(respBaseSeconds, respMultiplier) {
        return Math.round(respBaseSeconds * respMultiplier + respBaseSeconds);
    }

    function getBottomRangeResp(respBaseSeconds, respMultiplier) {
        return Math.round(respBaseSeconds - respBaseSeconds * respMultiplier);
    }

    function isHero(obj) {
        return isset(obj.type) && obj.type === 'hero';
    }

    function checkExistInSkippedDeads(id) {
        return skippedDeads.find(x => x.id === id);
    }

    function checkExistInDeads(id) {
        return deadNpcs.find(x => x.id === id)
    }

    function saveSkippedDeads({
        id,
        presp
    }) {
        if (checkExistInSkippedDeads(id)) return;
        skippedDeads.push({
            id,
            presp
        })
        saveSkippedDeadsToLS();
    }

    function checkAndRemovesOldSkippedDeads() {
        let deleted = 0;
        for (let i in skippedDeads) {
            if (skippedDeads[i].presp <= Math.ceil(unix_time(true))) {
                skippedDeads.splice(i, 1);
                deleted++;
            }
        }
        if (deleted > 0) {
            saveSkippedDeadsToLS();
        }
    }

    function itemUsed(item) {
        if (isset(item._cachedStats.revive)) {
            revive = true;
            //console.log('revive');
        }
    }

    function heroLogIn() { // for remove hero from Timer if not dead after login
        if (Engine.dead) return;

        const heroState = {
            id: Engine.hero.d.id,
            nick: Engine.hero.d.nick,
            sec: 0
        }
        heroDead(heroState);
    }

    function heroDead({
        nick,
        id,
        sec
    }) {
        if (!parseInt(settings['hero-resp'])) return;

        let existInDeads = checkExistInDeads(id);
        let existInSkippedDeads = checkExistInSkippedDeads(id);

        if (revive && existInDeads) {
            heroDeadUpdate({
                obj: existInDeads,
                sec
            });
            revive = false;
            return;
        }

        if (sec === 0) {
            removeHeroDead(id);
            return;
        }
        let currentTs = Math.ceil(unix_time(true));
        if (existInDeads || (existInSkippedDeads && existInSkippedDeads.presp) >= currentTs) return;
        addHeroDead({
            nick,
            id,
            sec
        });
    }

    function heroDeadUpdate({
        obj,
        sec
    }) {
        obj.presp = prepareRespTs(sec);

        refreshList();
        sortList();
        saveDataToLS();
    }

    function prepareRespTs(sec) {
        return Math.floor(unix_time(true)) + sec;
    }

    function prepareHeroDeadObj({
        nick,
        id,
        sec
    }) {
        let presp = prepareRespTs(sec);
        return {
            id,
            name: nick,
            presp,
            map: Engine.map.d.name,
            type: 'hero',
            heroData: getHeroData()
        }
    }

    function addHeroDead({
        nick,
        id,
        sec
    }) {
        const obj = prepareHeroDeadObj({
            nick,
            id,
            sec
        })
        addToData(obj, -1);
    }

    function removeHeroDead(id) {
        const existInDeads = checkExistInDeads(id);
        const npc = existInDeads;
        //console.log(npc);
        if (existInDeads) {
            if (isset(npc) && isset(npc.$)) {
                npc.$.remove();
            }
            deadNpcs.splice(existInDeads, 1);
            //console.log('remove');
        }

        let existInSkippedDeads = checkExistInSkippedDeads(id);
        if (existInSkippedDeads) skippedDeads.splice(existInSkippedDeads, 1);

        // refreshList();
        // sortList();
        //console.log(deadNpcs);
        saveDataToLS();
    }

    function checkData(now, obj) {
        if (obj.presp < (now - settings.fadeout)) {
            return true;
        }
        return false;
    }

    function checkArrayData() {
        var now = unix_time();
        for (var t in deadNpcs) {
            if (checkData(now, deadNpcs[t]))
                deadNpcs.splice(t, 1);
        }
    }

    function saveDataToLS() {
        checkArrayData();
        var bd = [];
        for (var t in deadNpcs) {
            var p = deadNpcs[t];
            var obj = {};
            if (isset(p.user)) {
                obj.user = p.user;
            } else {
                obj.char = p.char;
                obj.id = p.id;
                obj.map = p.map;
                obj.type = p.type;
                obj.x = p.x;
                obj.y = p.y;
            }
            obj.heroData = p.heroData;
            if (isset(p.type) && p.type === 'hero') {
                obj.type = p.type;
            }
            obj.name = p.name;
            obj.presp = p.presp;
            obj.minResp = p.minResp;
            bd.push(obj);
        }
        Engine.serverStorage.sendData({
            [addonKey]: {
                data: bd
            }
        }); // API.Storage.set("addon_17/data", bd);
        saveSkippedDeadsToLS();
    }

    function saveConfToLS() {
        Engine.serverStorage.sendData({
            [addonKey]: {
                settings: settings
            }
        }); // API.Storage.set("addon_17/settings", settings);
    }

    function saveSkippedDeadsToLS() {
        Engine.serverStorage.sendData({
            [addonKey]: {
                skippedDeads: skippedDeads
            }
        }); // API.Storage.set("addon_17/skippedDeads", skippedDeads);
    }

    function getAddonData() {
        return Engine.serverStorage.get(addonKey) || {}; //API.Storage.get("addon_17");
    }

    function closeEdit() {
        if (hwndEdit !== null) {
            //hwndEdit.$.remove();
            hwndEdit.remove();
            //delete hwndEdit;
            hwndEdit = null;
        }
    }

    function initEditWindow() {
        //hwndEdit = new API.Window({
        //	onclose: function () {
        //		closeEdit();
        //	}
        //});
        //hwndEdit.title(_t('option'));
        //var content = API.Templates.get("window-list-edit")
        //hwndEdit.content(content);
        //hwndEdit.$.find(".all-options").css({
        //	"margin-top": 9
        //});
        //hwndEdit.$.find('.buttons').wrap("<div class='bottom-bar'></div>");
        //var $buttonsBar = hwndEdit.$.find('.bottom-bar');
        //var $con = hwndEdit.$.find('.con');
        //$buttonsBar.insertAfter($con);
        //hwndEdit.$.find('.window-list-edit').addClass("elite-timer-edit");
        //$('.alerts-layer').append(hwndEdit.$);


        hwndEdit = Engine.windowManager.add({
            content: API.Templates.get("window-list-edit"),
            title: _t('option'),
            //nameWindow          : 'addon_17_edit',
            nameWindow: Engine.windowsData.name.addon_17_edit,
            onclose: () => {
                closeEdit();
            }
        });


        hwndEdit.$.find(".all-options").css({
            "margin-top": 9
        });
        hwndEdit.$.find('.buttons').wrap("<div class='bottom-bar'></div>");

        var $buttonsBar = hwndEdit.$.find('.bottom-bar');
        var $con = hwndEdit.$.find('.con');
        $buttonsBar.insertAfter($con);

        hwndEdit.$.find('.window-list-edit').addClass("elite-timer-edit");
        hwndEdit.addToAlertLayer();
    }

    function initEditAllOptions() {
        var $hlist = hwndEdit.$.find('.all-options');
        for (var t in msettings) {
            createOneEditOption($hlist, msettings[t], 0);
        }
        //for (var t in isettings) {
        //	createOneEditOption($hlist, isettings[t], 2);
        //}
        for (var t in issettings) {
            createOneEditOption($hlist, issettings[t], 1);
        }
    }

    function setTitle(txt) {
        if (oldTitle === null) {
            oldTitle = document.title;
        }
        document.title = txt;
    }

    function clearTitle() {
        if (oldTitle !== null) {
            document.title = oldTitle;
            oldTitle = null;
        }
    }

    function updateTitle() {
        if (settings.title == 0) {
            clearTitle();
            return;
        }
        if (deadNpcs.length > 0) {
            var obj = deadNpcs[0];
            var now = unix_time();
            var diff = obj.presp - now;
            var strb = utDiffToReadable(diff);
            let str = getStringOfTime(strb);
            setTitle(str + " - " + obj.name);
        } else {
            clearTitle();
        }
    }

    function createOneEditOption($h, name, input) {
        var $e = API.Templates.get("window-list-option");
        $e.find('.window-list-option').addClass("elite-timer-opt");
        $e.find(".txt-wrapper").css("width", "148px");
        $e.find(".control-wrapper").css("width", "100px");
        var $eMenu = $e.find(".control");
        $e.attr("id", name);
        $h.append($e);
        var txt = $e.find(".text").text(_t(name, null, 'elite_timer'));
        var $icon = $("<div>").addClass("info-icon");
        txt.prepend($icon);
        var stip = settingTip[name];
        if (isset(stip)) {
            $icon.tip(stip);
        }
        if (input == 0) {
            var data = [{
                'text': _t('yes'),
                'val': 1
            }, {
                'text': _t('no'),
                'val': 0
            }];
            $eMenu.createDivideButton(data, name);
            var state = settings[name];
            $eMenu.find('.option[value=' + state + ']').addClass('active');
        } else if (input == 1) {
            var ip = API.Templates.get("input");
            ip.find("input")
                .on("keydown", checkInput0)
                .on("keyup", checkInput0)
                .val(settings[name]);
            //.attr("placeholder", _t("seconds", null, "elite_timer"));
            $eMenu.append(ip);
        } else {
            var ip = API.Templates.get("input");
            ip.find("input")
                .on("keydown", checkInputD1a3)
                .on("keyup", checkInputD1a3)
                .val(settings[name]);
            $eMenu.append(ip);
        }
    }

    function initEditLabels() {
        hwndEdit.$.find('.header').html(_t('elite_timer', null, 'elite_timer'));
        /*
        $("<div>").appendTo(hwndEdit.$.find('.labels')).css({
        	"margin-left": 159
        }).html(_t('state', null, 'elite_timer'));
        */
    }

    function initEditSaveButton() {
        var $btn = API.Templates.get('button').addClass('green');
        $btn.find('.label').html(_t('save'));
        hwndEdit.$.find('.buttons').append($btn);
        $btn.on("click", function() {
            saveEditToStore();
        });
    }

    function saveEditToStore() {
        for (var t in msettings) {
            var $oneSet = hwndEdit.$.find("#" + msettings[t]);
            var active = $oneSet.find(".active");
            settings[msettings[t]] = active.attr('value');
        }
        //var isinp = isettings.concat(issettings);
        var isinp = issettings;
        for (var t in isinp) {
            var $oneVal = hwndEdit.$.find("#" + isinp[t] + " input");
            var val = parseInt($oneVal.val());
            if (isNaN(val)) {
                val = defaultVal[isinp[t]];
            }
            settings[isinp[t]] = val;
        }
        saveConfToLS();
        closeEdit();
    }

    function initWindow() {
        //hwnd = new API.Window({
        //	onclose: function () {
        //		self.manageVisible();
        //	},
        //	name: 'addon_17',
        //	type: 'transparent',
        //	manageOpacity: 3,
        //	managePosition:{x: 251, y: 100}
        //});
        //hwnd.title(_t("timer", null, "elite_timer"));
        //var content = API.Templates.get('window-list');
        //hwnd.content(content);
        //hwnd.$.addClass("elite-timer");
        //hwnd.$.find('.window-list').addClass("elite-timer-wnd");
        //hwnd.$.find(".list").addClass("npc-list");
        //hwnd.setTransparentWindon();
        //hwnd.changeDraggableContainment('.game-window-positioner');
        // hwnd.setSavePosWnd('addon_17', {
        // 	x: '251',
        // 	y: '100'
        // });
        //hwnd.$.hide();
        //$('.alerts-layer').append(hwnd.$);
        //hwnd.updatePos();

        hwnd = Engine.windowManager.add({
            content: API.Templates.get('window-list'),
            title: addonName,
            nameWindow: addonKey,
            widget: Engine.widgetsData.name.addon_17,
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            managePosition: {
                'x': 251,
                'y': 100
            },
            onclose: () => {
                self.manageVisible();
            }
        });

        hwnd.$.addClass("elite-timer");
        hwnd.$.find('.window-list').addClass("elite-timer-wnd");
        hwnd.$.find(".list").addClass("npc-list");
        //hwnd.changeDraggableContainment('.game-window-positioner');
        hwnd.hide();
        hwnd.addToAlertLayer();
        hwnd.updatePos();
    }

    function initAddBtn() {
        var $ctrls = hwnd.$.find(".window-controlls");
        $ctrls.show();
        var el = $("<div>").addClass("row row-add tw-list-item").on("click", function() {
            edit();
        });
        var allbg = $("<div>").addClass("add do-action-cursor").appendTo(el);
        $("<div>").addClass("btn-add").appendTo(allbg);
        $ctrls.append(el);
    }

    function inpsave(e) {
        var inps = $inp.find("input");
        var sec = parseInt(inps.eq(3).val());
        var min = parseInt(inps.eq(2).val());
        var hou = parseInt(inps.eq(1).val());
        var name = inps.eq(0).val();
        var obj = $inp.data("obj");
        if (inpActived && name.length > 0) {
            AddInputEdit(obj, name, sec, min, hou)
        }
        if (!wantNew) {
            $inp.parent().children().show();
        } else {
            $newinp.hide();
            hwnd.$.find('.scrollbar-wrapper').removeClass('is-input-show');
        }
        inps.val("");
        $inp.removeData("obj");
        $inp.detach();
        $(document).off("mousedown", outclick);
    }

    function checkInput0a60() {
        var currentvalÂ = $(this).val();
        var correctval = currentval.replace(/[^0-9]/g, "");
        if (isNaN(parseInt(correctval))) correctval = "";
        if (correctval > 60) correctval = "60";
        if (correctval < 0) correctval = "0";
        if (currentval !== correctval)
            $(this).val(correctval);
    }

    function checkInput0() {
        var currentvalÂ = $(this).val();
        var correctval = currentval.replace(/[^0-9]/g, "");
        if (isNaN(parseInt(correctval))) correctval = "";
        if (correctval < 0) correctval = "0";
        if (currentval !== correctval)
            $(this).val(correctval);
    }

    function checkInputD1a3() {
        var currentvalÂ = $(this).val();
        var correctval = currentval.replace(/,/g, ".");
        var correctval = currentval.replace(/[^0-9.]/g, "");
        if (correctval < 0) correctval = "0";
        if (correctval > 3) correctval = "3";
        var p = parseFloat(correctval);
        if (p != correctval) correctval = p;
        if (isNaN(p)) correctval = "";
        if (currentval !== correctval)
            $(this).val(correctval);
    }

    function initAddInput() {
        $inp = $("<div>").addClass("inp");
        var $name = API.Templates.get("input").appendTo($inp).addClass("iname")
            .children()
            .attr("placeholder", _t("name", null, "elite_timer"));
        var $hours = API.Templates.get("input").appendTo($inp).addClass("itime")
            .children()
            .attr("placeholder", "0")
            .on("keydown", checkInput0)
            .on("keyup", checkInput0)
            .attr("maxlength", 5).on("click", function() {
                $(this).select();
            });
        var $minutes = API.Templates.get("input").appendTo($inp).addClass("itime")
            .children()
            .attr("placeholder", "0")
            .on("keydown", checkInput0a60)
            .on("keyup", checkInput0a60)
            .attr("maxlength", 2).on("click", function() {
                $(this).select();
            });
        var $seconds = API.Templates.get("input").appendTo($inp).addClass("itime")
            .children()
            .attr("placeholder", "0")
            .on("keydown", checkInput0a60)
            .on("keyup", checkInput0a60)
            .attr("maxlength", 2).on("click", function() {
                $(this).select();
            });
        $inp.children().on("keypress", function(ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                inpsave();
            }
        }).on("mousedown", function() {
            inpActived = true;
        });
    }

    function initAddNewInp() {
        var $ctrls = hwnd.$.find(".window-controlls");
        $newinp = $("<div>").addClass("row row-input tw-list-item").hide().prependTo($ctrls);
        //$("<div>").addClass("bg").appendTo($newinp);
    }

    function AddInputEdit(obj, name, sec, min, hours) {
        var diff = (!isNaN(sec) ? sec : 0);
        diff += (!isNaN(min) ? min * 60 : 0);
        diff += (!isNaN(hours) ? hours * 3600 : 0);
        var idx = -1;
        if (isset(obj)) {
            idx = getIdOfObj(obj);
        }
        if (idx == -1) {
            self.add(name, diff);
        } else {
            deadNpcs[idx].name = name;
            deadNpcs[idx].presp = unix_time() + (diff > 0 ? diff : 0);
            addToData(deadNpcs[idx], idx);
        }
    }

    function initEditControlPanelBtn() {
        var $btn = API.Templates.get('settings-button');
        $btn.addClass('small green');
        $btn.find('.label').html('...');
        hwnd.$.find('.open-edit-panel').append($btn);
        $btn.on("click", function(e) {
            if (hwndEdit === null) {
                initEditWindow();
                initEditAllOptions();
                initEditLabels();
                hwndEdit.center();
                initEditSaveButton();
                e.stopPropagation();
            } else {
                closeEdit();
            }
        });
    }

    function initScroll() {
        hwnd.$.find('.scroll-wrapper').addScrollBar({
            track: true
        });
    }

    function initChangeStyle() {
        var $content = hwnd.$.find(".content");
        var $swrapper = $content.find(".scrollbar-wrapper");
        $swrapper.css({
            top: -11,
            bottom: 22
        });
    }

    function getTipOfDeadNpc(e) {
        const shortClass = e.minResp <= unix_time() && !(e.presp <= unix_time()) ? 'text-orange' : ''; //e.$ && e.$.hasClass('short') && !e.$.hasClass('pass') ? 'text-orange' : '';
        const passClass = e.presp <= unix_time() ? 'text-red' : '';
        const fullType = isset(npcsTypes[e.type]) ? npcsTypes[e.type].fullname : '';
        var tip = '<span class="elite_timer_tip_name">' + e.name + "</span>";
        tip += fullType ? `<i>${fullType}</i>` : '';
        if (!isset(e.user)) {
            tip += '<span class="elite_timer_tip_map">';
            if (e.type == 1) {
                tip += e.map + " (" + e.x + "," + e.y + ")";
            } else {
                tip += e.map;
            }
            tip += "</span>";
        }

        if (!isset(e.minResp)) {
            tip += '<span class="elite_timer_tip_date">';
            tip += _t("date %date%", {
                "%date%": ut_fulltime(e.presp, true)
            }, "elite_timer");
            tip += "</span>";
        } else {
            tip += `<br><span class="elite_timer_tip_date">${_t("resp_time", null, "elite_timer")}</span>`;
            tip += `<span class="elite_timer_tip_date ${shortClass}">`;
            tip += _t("min %date%", {
                "%date%": ut_fulltime(e.minResp, true)
            }, "elite_timer");
            tip += "</span>";

            tip += `<span class="elite_timer_tip_date ${passClass}">`;
            tip += _t("max %date%", {
                "%date%": ut_fulltime(e.presp, true)
            }, "elite_timer");
            tip += "</span>";
        }

        tip += `
			<br/>
			${_t('character',null,'elite_timer')}: ${e.heroData.name} ${e.heroData.lvl}${e.heroData.prof}<br/> 
			${_t('world',null,'elite_timer')}: <span class="first-letter-upper">${e.heroData.world}</span>
		`;
        if (e.heroData.id !== Engine.hero.d.id) {
            tip += `<br/><br/>${_t('click',null,'elite_timer')}`;
        }
        //tip += "<br>data: " + ut_fulltime(e.presp) + "<br>";
        return tip;
    }

    function utDiffToReadable(d) {
        var sec = d % 60;
        d -= sec;
        var tmin = (d % 3600)
        var min = tmin / 60;
        d -= tmin;
        var hou = d / 3600;
        if (sec < 0) sec = 0;
        if (min < 0) min = 0;
        if (hou < 0) hou = 0;
        var shou = (hou < 10 ? "0" : "") + hou;
        var smin = (min < 10 ? "0" : "") + min;
        var ssec = (sec < 10 ? "0" : "") + sec;
        if (hou > 99) {
            shou = smin = ssec = "99";
        }
        return [shou, smin, ssec];
    }

    function oneDel(e) {
        var parent = $(this).parents(".row");
        parent.remove();
        for (var t in deadNpcs) {
            const npc = deadNpcs[t];
            if (npc.$.is(parent)) {
                if (isHero(npc)) {
                    saveSkippedDeads(npc);
                }
                deadNpcs.splice(t, 1);
                break;
            }
        }
        $('.scroll-wrapper', hwnd.$).trigger('update');
        refreshList();
        sortList();
        saveDataToLS();
    }

    function oneEdit() {
        var obj = $(this).parents(".row").data("obj");
        edit(obj);
    }

    function oneList($list, obj, t) {
        var now = unix_time();
        var el = obj.$;
        if (checkData(now, obj)) {
            deadNpcs.splice(t, 1);
            if (isset(el)) {
                el.remove();
            }
            $('.scroll-wrapper', hwnd.$).trigger('update');
            return;
        }
        if (!isset(obj.$)) {
            el = $("<div>").addClass("row tw-list-item do-action-cursor");
            var cell1 = $("<div>").addClass("col").appendTo(el);
            var cell2 = $("<div>").addClass("col").appendTo(el);
            var conCell1 = $("<div>").addClass("name cell").appendTo(cell1);
            var conCell2 = $("<div>").addClass("time cell").appendTo(cell2);
            var $name = $("<div>").addClass("name-val").appendTo(conCell1);
            var $amend = $("<div>").addClass("btn btn-opt").hide().appendTo(conCell2);
            var $remove = $("<div>").addClass("btn btn-del").hide().appendTo(conCell2);
            var $time = $("<div>").addClass("time-val").appendTo(conCell2);
            $name.text(getShortType(obj.type) + obj.name);
            if (isset(obj.heroData)) {
                conCell1.on("dblclick", () => {
                    if (obj.heroData.id === Engine.hero.d.id) return;
                    Engine.changePlayer.changePlayerRequest(obj.heroData.id);
                });
            }
            if (isset(obj.minResp)) {
                $amend.addClass('disabled');
            }
            $remove.on("click", oneDel).tip(_t("delete", null, "buttons"));
            $amend.on("click", oneEdit).tip(_t("edit"));
            el.on("mouseover", function() {
                conCell1.addClass("min");
                conCell2.addClass("big");
                $remove.show();
                $amend.show();
            });
            el.on("mouseout", function() {
                conCell1.removeClass("min");
                conCell2.removeClass("big");
                $remove.hide();
                $amend.hide();
            });
            obj.$ = el;
            obj.$time = $time;
            el.data("obj", obj);
            $list.append(el);
        }

        const tipOfDead = getTipOfDeadNpc(obj);
        obj.$.find('.name.cell').tip(tipOfDead);
        obj.$.find('.time-val').tip(tipOfDead);
        setColorData(obj, now);
        var diff = obj.presp - now;
        var strb = utDiffToReadable(diff);
        var str = strb[0] + ":" + strb[1] + ":" + strb[2];
        var $p = obj.$time;

        if ($p.text() != str) $p.text(str);
        $('.scroll-wrapper', hwnd.$).trigger('update');
    }

    function getShortType(type) {
        return isset(npcsTypes[type]) ? `[${npcsTypes[type].short}] ` : '';
    }

    function getStringOfTime(strb) {
        if (strb[0] == "00") return strb[1] + ":" + strb[2];
        else return strb[0] + ":" + strb[1] + ":" + strb[2];
    }

    function refreshList() {
        var $list = hwnd.$.find(".npc-list");
        for (var t in deadNpcs) {
            oneList($list, deadNpcs[t], t);
        }
        if (deadNpcs.length == 0) {
            hwnd.$.find(".empty").show();
        } else {
            hwnd.$.find(".empty").hide();
        }
        updateTitle();
    }

    function sortList() {
        sortData();
        var $last = null;
        for (var t in deadNpcs) {
            var o = deadNpcs[t].$;
            if ($last !== null) {
                var $o = o.detach();
                $last.after($o);
            }
            $last = o;
        }
        $('.scroll-wrapper', hwnd.$).trigger('update');
    }

    function sortData() {
        deadNpcs.sort(function(a, b) {
            return a.presp - b.presp;
        });
    }

    function getIdOfObj(obj) {
        for (var t in deadNpcs) {
            var o = deadNpcs[t];
            if (
                (isset(obj.user) && isset(o.user) &&
                    o.name == obj.name && o.user == obj.user) ||
                (!isset(obj.user) && !isset(o.user) &&
                    o.id == obj.id && o.heroData.world == obj.heroData.world)
            ) {
                return t;
            }
        }
        return -1;
    }

    function setColorData(obj, v) {
        var sound = v != 0;
        if (sound) {
            now = v;
        } else {
            now = unix_time();
        }
        var diff = obj.presp - now;
        let color = 0;
        if (diff <= 0) {
            color = 2; // red
        } else if ((isset(obj.minResp) && now >= obj.minResp)) {
            color = 1
        }
        var wantedColor = colorTab[color];
        var unwantedColors = getListOfOtherColors(wantedColor);
        if (hasUnwantedColor(obj.$, wantedColor, unwantedColors)) {
            if (sound) {
                soundNotif(color);
                obj.$.addClass('changing')
                    .finish()
                    .addClass(wantedColor, 1000)
                    .removeClass(unwantedColors)
                    .removeClass('changing', 1200);
            } else {
                obj.$.addClass('changing')
                    .finish()
                    .addClass(wantedColor)
                    .removeClass(unwantedColors)
                    .removeClass('changing');
            }
        }
    }

    function getListOfOtherColors(color) {
        return colorTab.filter((a) => a != color);
    }

    function hasUnwantedColor($el, wanted, unwanteds) {
        if ($el.hasClass('changing'))
            return false;
        if (!$el.hasClass(wanted))
            return true;
        for (var i in unwanteds) {
            if ($el.hasClass(unwanteds[i]))
                return true;
        }
    }

    function addToData(obj, idx) {
        obj.tip = getTipOfDeadNpc(obj);
        if (idx == -1) {
            deadNpcs.push(obj);
        } else {
            obj.$ = deadNpcs[idx].$;
            obj.$time = deadNpcs[idx].$time;
            obj.$.find(".name").tip(obj.tip);
            obj.$.find(".name-val").text(getShortType(obj.type) + obj.name);
            obj.$.find(".time-val").tip(obj.tip);
            setColorData(obj, 0);
            deadNpcs[idx] = obj;
        }
        refreshList();
        sortList();
        saveDataToLS();
    }

    function outclick(event) {
        if (!$(event.target).closest($inp).length) {
            inpsave(event);
        }
    }

    function edit(obj = null) {
        $inp.find("input").val("");
        if (obj !== null) {
            $inp.find(".iname input").val(obj.name);
            $inp.data("obj", obj);
            var $times = $inp.find(".itime input");
            var now = unix_time();
            var diff = obj.presp - now;
            var strb = utDiffToReadable(diff);
            obj.$.find(".col").hide();
            obj.$.append($inp.detach());
            $times.each(function(e) {
                $(this).val(strb[e]);
            });
            wantNew = false;
            inpActived = false;
        } else if (!$newinp.is(":visible")) {
            $newinp.show();
            $newinp.append($inp);
            hwnd.$.find('.scrollbar-wrapper').addClass('is-input-show');
            wantNew = true;
            $inp.find(".iname input").focus();
            inpActived = true;
        }
        $(document).on("mousedown", outclick);
    }

    function loadData(obj) {
        var idx = getIdOfObj(obj);
        if (idx == -1) {
            var n = {};
            if (isset(obj.user)) {
                n.user = obj.user;
            } else {
                n.char = obj.char;
                n.id = obj.id;
                n.map = obj.map;
                n.type = obj.type;
                n.x = obj.x;
                n.y = obj.y;
            }
            n.heroData = obj.heroData;
            n.name = obj.name;
            n.presp = obj.presp;
            if (isset(obj.minResp)) n.minResp = obj.minResp;
            deadNpcs.push(n);
        } else {
            deadNpcs[idx].name = obj.name;
            deadNpcs[idx].presp = obj.presp;
            deadNpcs[idx].minResp = obj.minResp;
            deadNpcs[idx].tip = getTipOfDeadNpc(deadNpcs[idx]);
            if (isset(deadNpcs[idx].$)) {
                deadNpcs[idx].$.find(".name").tip(deadNpcs[idx].tip);
                deadNpcs[idx].$.find(".name-val").text(deadNpcs[idx].name);
            }
        }
    }

    function getHeroData() {
        return {
            id: Engine.hero.d.id,
            name: Engine.hero.d.nick,
            lvl: Engine.hero.d.lvl,
            prof: Engine.hero.d.prof,
            world: Engine.worldConfig.getWorldName()
        }
    };

    function soundNotif(id) {
        if (settings.sound == 0) {
            return;
        }
        if (id == 1) {
            Engine.soundManager.createNotifSound(5);
        }
    }

    function initStyle() {
        $style = $(`
		  <style>
			.elite-timer .content{
				padding: 0;
				margin: -12px -20px -18px -20px;
			}
			.elite-timer .header{
				display: none;
			}
			.elite-timer .scrollable .scrollbar-wrapper.is-input-show{
				bottom: 47px !important;
			}
			/*list main window*/
			.elite-timer .window-list{
				padding-top: 5px;
			}
			.elite-timer .npc-list{
				display: table;
				text-align: left;
				border-collapse: collapse;
				width: 100%;
			}
			.elite-timer .row{
				font-size: 11px;
				height: 22px;
				color: white;
			}
			.elite-timer .row.long{
				color: white;
			}
			.elite-timer .row.short{
				color: orange;
			}
			.elite-timer .row.pass{
				color: red;
			}
			.elite-timer .row .col{
				display: table-cell;
			}
			.elite-timer .row .col .cell{
				position: relative;
			}
			.elite-timer .row .col .name{
				width: 170px;
			}
			.elite-timer .scroll-wrapper.scrollable .row .col .name{
				width: 155px;
			}
			.elite-timer .row .col .time{
				margin-left: 3px;
			}
			.elite-timer .row .col .time-val{
				display: inline-block;
				margin-left: 6px;
				width: 44px;
			}
			.elite-timer .row .col .name-val{
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.elite-timer .row .col .min{
				width: 142px;
			}
			.elite-timer .scroll-wrapper.scrollable .row .col .min{
				width: 127px;
			}
			.elite-timer .row .col .btn{
				display: inline-block;
				position: relative;
				top: 2px;
				width: 12px;
				height: 12px;
				background: red;
			}
			.elite-timer .row .col .btn-opt{
				background: url('img/gui/buttony.png') -608px -118px;
			}
			.elite-timer .row .col .btn-opt:hover{
				background: url('img/gui/buttony.png') -660px -118px;
			}
			.elite-timer .row .col .btn-opt.disabled{
				pointer-events: none;
				visibility: hidden;
			}
			.elite-timer .npc-list .row .col .btn-del{
			  margin-left: 3px;
				background: url('img/gui/buttony.png') -625px -118px;
			}
			.elite-timer .npc-list .row .col .btn-del:hover{
				background: url('img/gui/buttony.png') -727px -118px;
			}
			/*scroll main window*/
			.elite-timer .scrollable .scroll-pane{
				padding-right: 12px;
			}
			/*add main window*/
			.elite-timer .window-controlls{
				margin-top: 1px;
			}
			/*button add main window*/
			.elite-timer .window-controlls .add{
				overflow: hidden;
			}
			/*.elite-timer .window-controlls .add .btn-add{*/
			/*	width: 12px;*/
			/*	height: 12px;*/
			/*	background: url('https://dzik.margonem.pl/img/minutnik_plus.png');*/
			/*	margin-left: auto;*/
			/*	margin-right: auto;*/
			/*	margin-top: 5px;*/
			/*}*/
			/*inputs add main window*/
			.elite-timer .inp{
				padding-left: 1px;
				padding-right: 1px;
			}
			.elite-timer .inp input{
				height: 12px;
				color: white;
				vertical-align: 0;
				font-size: 11px;
			}
			.elite-timer .inp .input-wrapper{
				display: inline-block;
				color: white;
			}
			.elite-timer .inp .iname input{
				width: 144px;
			}
			.elite-timer .scroll-wrapper.scrollable .inp .iname input{
				width: 130px;
			}
			.elite-timer .inp .itime input{
				width: 15px;
			}
			/*edit window*/
			.elite-timer-edit{
				width: 290px;
				height: 277px;
			}
			.elite-timer-edit .con .all-options{
				margin: auto;
				width: 260px;
			}
			.elite-timer-edit input{
				color: white;
				width: 90px;
				font-weight: bold;
				text-align: center;
			}
			.elite-timer-edit input.sec-inp{
				color: white;
				width: 66px;
			}
			.elite-timer-edit .sec-txt{
				color: white;
				margin-left: 5px;
			}
			.elite-timer-edit .info-icon{
				display: inline-block;
				position: relative;
				top: 2px;
				right: 4px;
				width: 16px;
				height: 16px;
				background: url('img/gui/buttony.png') no-repeat -499px -199px;
			}
			.elite-timer-edit .window-list-option{
				left: -7px;
			}
			.elite_timer_tip_name{
				font-weight: bold;
				display: block;
			}
			.elite_timer_tip_map{
				display: block;
			}
			.elite_timer_tip_date{
				display: block;
			}
		  </style>`).appendTo("head");
    }

    this.add = function(name, time) {
        var obj = {
            name: name,
            user: 1,
            presp: unix_time() + (time > 0 ? time : 0),
            heroData: getHeroData()
        };
        addToData(obj, -1);
    }

    this.manageVisible = function() {
        settings.show = !settings.show;
        if (settings.show) {
            hwnd.show();
            hwnd.setWndOnPeak();
            hwnd.updatePos();
        } else {
            hwnd.hide();
        }
        saveConfToLS();
    }

    this.start = function() {
        if (running) return;
        running = true;

        API.addCallbackToEvent(Engine.apiData.AFTER_INTERFACE_START, initAddon);

        if (getAlreadyInitialised()) {
            initAddon();
        }

        //initStyle();
        //initWindow();
        //initAddInput();
        //initAddNewInp();
        //initAddBtn();
        //initEditControlPanelBtn();
        //initScroll();
        //initChangeStyle();
        //
        //let { skippedDeads: nskippedDeads = [], data: ndata = {}, settings: nsettings = {} } = getAddonData(); // object destructuring
        //// console.log(nskippedDeads);
        //// console.log(ndata);
        //// console.log(nsettings);
        //
        //skippedDeads = nskippedDeads;
        //checkAndRemovesOldSkippedDeads();
        //
        //settings = { ...settings, ...nsettings };
        //
        //for (const t in ndata) {
        //	loadData(ndata[t]);
        //}
        //sortData();
        //if (hwnd !== null) {
        //	refreshList();
        //}
        //
        //heroLogIn();
        //
        //if (settings.show) {
        //	hwnd.show();
        //	hwnd.setWndOnPeak();
        //} else {
        //	hwnd.hide();
        //}
        ////hwnd.updateElementsWithOpacity();
        //
        //API.addCallbackToEvent(Engine.apiData.REMOVE_NPC, removeNpc);
        //API.addCallbackToEvent(Engine.apiData.HERO_DEAD, heroDead);
        //API.addCallbackToEvent(Engine.apiData.ITEM_USED, itemUsed);
        //interval = setInterval(refreshList, 1000);
    };

    const initAddon = () => {
        initStyle();
        initWindow();
        initAddInput();
        initAddNewInp();
        initAddBtn();
        initEditControlPanelBtn();
        initScroll();
        initChangeStyle();

        let {
            skippedDeads: nskippedDeads = [],
            data: ndata = {},
            settings: nsettings = {}
        } = getAddonData(); // object destructuring
        // console.log(nskippedDeads);
        // console.log(ndata);
        // console.log(nsettings);

        skippedDeads = nskippedDeads;
        checkAndRemovesOldSkippedDeads();

        settings = {
            ...settings,
            ...nsettings
        };

        for (const t in ndata) {
            loadData(ndata[t]);
        }
        sortData();
        if (hwnd !== null) {
            refreshList();
        }

        heroLogIn();

        if (settings.show) {
            hwnd.show();
            hwnd.setWndOnPeak();
        } else {
            hwnd.hide();
        }
        //hwnd.updateElementsWithOpacity();

        API.addCallbackToEvent(Engine.apiData.REMOVE_NPC, removeNpc);
        API.addCallbackToEvent(Engine.apiData.HERO_DEAD, heroDead);
        API.addCallbackToEvent(Engine.apiData.ITEM_USED, itemUsed);
        interval = setInterval(refreshList, 1000);
    }

    this.stop = function() {
        if (!running) return;
        running = false;
        API.removeCallbackFromEvent(Engine.apiData.REMOVE_NPC, removeNpc);
        API.removeCallbackFromEvent(Engine.apiData.HERO_DEAD, heroDead);
        API.removeCallbackFromEvent(Engine.apiData.ITEM_USED, itemUsed);
        API.removeCallbackFromEvent(Engine.apiData.AFTER_INTERFACE_START, initAddon);

        clearInterval(interval);
        interval = null;

        // Engine.serverStorage.clearDataBySpecificKey(addonKey); // API.Storage.remove("addon_17");
        ``
        closeEdit();
        //hwnd.$.remove();
        hwnd.remove();
        //delete hwnd;
        hwnd = null;

        $style.remove();

    };

}