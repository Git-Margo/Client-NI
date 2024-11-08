const InputMaskData = require('core/InputMaskData');
const {
    CL
} = require('core/items/data/ItemData');

module.exports = function() {
    var self = this;
    var running = false;
    // var open = false;
    var works = false;
    var hwnd = null;
    var $style = null;
    var correctSource = null;
    const allowSources = ['fight', 'dialog'];
    var itemDecisedCounter = 0;
    var itemsDecision = {};
    var freeSpace = 0;

    let addonKey = Engine.windowsData.name.addon_20;

    var forceTake = [
        'upgby', 'artefact', 'legendary', 'heroic', 'upgraded',
        'runes', 'expadd', 'perheal', 'revive', 'action'
    ];

    function prTest(rule, e, opt, stats) {
        if (e.pr >= parseInt(opt))
            return true;
        return false;
    }

    function rarityTest(rule, item, opt, stats) {
        if (statTest(rule, item, opt, stats)) return true; // for old rarity system
        if (isset(stats['rarity'])) { // new rarity system (rarity in stats as key: value)
            if (typeof rule.val === "object") {
                if (rule.val.includes(item.itemTypeName)) return true;
            } else {
                if (item.itemTypeName === rule.val) return true;
            }
        }
        return false;
    }

    function statTest(rule, e, opt, stats) {
        if (typeof rule.val === "object") {
            for (var i in rule.val) {
                if (issetAndTestedStat(stats, rule.val[i], rule.test, opt)) {
                    return true;
                }
            }
        } else {
            if (issetAndTestedStat(stats, rule.val, rule.test, opt)) {
                return true;
            }
        }
        return false;
    }

    function clTest(rule, e, opt, stats) {
        if (e.cl == rule.val)
            return true;
        return false;
    }

    function questTest(rule, e, opt, stats) {
        if (isset(stats.quest) || e.cl === 19)
            return true;
        return false;
    }

    var rules = {
        "minval": new inputRule(prTest, null, null, null, {
            type: InputMaskData.TYPE.NUMBER_WITH_KMG
        }),
        "minheal": new inputRule(statTest, ["leczy", "fullheal"], equalHigherNotZero, false, {
            suffix: getText('hp'),
            type: InputMaskData.TYPE.NUMBER_WITH_KMG
        }),
        "unique": new checkboxRule(rarityTest, "unique", 0, true),
        "key": new checkboxRule(clTest, CL.KEYS, 0, true),
        "bag": new checkboxRule(clTest, CL.BAG),
        "gold": new checkboxRule(statTest, "gold", 0, true),
        "bless": new checkboxRule(clTest, CL.BLESS, 0, true),
        "teleport": new checkboxRule(clTest, CL.TELEPORTS),
        "talismans": new checkboxRule(clTest, CL.TALISMAN),
        "quest": new checkboxRule(questTest, 0, 0, true),
        "neutral": new checkboxRule(clTest, CL.NEUTRAL)
    };

    function rule() {
        this.testFunc = arguments[0];
        this.val = arguments[1];
        this.test = arguments[2];
        if (arguments.length >= 3) {
            this.defaultVal = arguments[3];
        } else {
            this.defaultVal = false;
        }
    }

    function inputRule() {
        this.options = {};
        if (isset(arguments[4])) {
            this.options = {
                ...this.options,
                ...arguments[4]
            };
        }
        rule.apply(this, arguments);
    }

    function checkboxRule() {
        rule.apply(this, arguments);
    }

    function equalHigherNotZero(e, v) {
        if (v != 0 && e >= v) {
            return true;
        }
        return false;
    }

    function issetAndTestedStat(stats, stat, test, opt) {
        if (isset(stats[stat]) && (!test || test(stats[stat], opt))) return true;

        return false;
    }

    function lootUpdate(data) {
        if (!works) return;
        if (isset(data.init)) {
            itemsDecision = {};
            freeSpace = Engine.heroEquipment.getFreeSlots();
            correctSource = allowSources.includes(data.source);
            itemDecisedCounter = Object.keys(data.states).length;
        }
    }

    function newLoot(item, finish) {
        if (!works) return;
        if (!correctSource) return;
        var decide = decideLoot(item);
        var newState;
        var opts = Engine.loots.states;

        if (decide) newState = Engine.loots.getGroupped() ? opts[2].key : opts[1].key;
        else newState = opts[0].key;

        itemsDecision[item.id] = newState;

        if (finish) afterItemsDecisions();
    }

    function checkForceTake(item, stats) {
        for (var t in forceTake) {
            var str = forceTake[t];
            if (isset(stats[str]) || item.itemTypeName === str) {
                return true;
            }
        }
        return false;
    }

    function decideLoot(e) {
        var stats = e.parseStats();

        if (checkForceTake(e, stats)) return true;

        for (var t in rules) {
            var rule = rules[t];
            let opt = getValueFromServerStorage(t, rule.defaultVal);

            if (opt !== false && rule.testFunc(rule, e, opt, stats)) return true;
        }
        return false;
    }

    function isAutoSendFinalDecision() {

        let auto = getValueFromServerStorage('auto_accept', false);
        let enoughSpace = itemDecisedCounter <= freeSpace;

        if (auto && enoughSpace) return true;

        return false;
    }

    function afterItemsDecisions() {
        if (isAutoSendFinalDecision()) {
            //sendFinalDecision();
            Engine.loots.finalize(itemsDecision);
        } else {
            Engine.loots.setLootItems(itemsDecision);
        }
        itemDecisedCounter = 0;
        itemsDecision = {};
    }

    function prepareTabOfChangeItem() {
        var prepareTabNewItemsDecision = [];

        for (var id in itemsDecision) {
            var decision = itemsDecision[id];
            prepareTabNewItemsDecision.push([id, decision]);
        }
        return prepareTabNewItemsDecision;
    }

    function load() {
        let dataToSend = {};

        // open  = API.Storage.get(addonKey + "/open", open);
        works = API.Storage.get(addonKey + "/works", works);

        if (getValueFromServerStorage("minval") === null) setValueDataToSend(dataToSend, 'minval', 0);
        if (getValueFromServerStorage("minheal") === null) setValueDataToSend(dataToSend, 'minheal', 0);

        if (Object.keys(dataToSend).length) {
            sendDataToServerStorage(dataToSend, () => {
                init();
            });
            return;
        }

        init();
    }

    function getAllObjectToSend(dataToSend) {
        let id = Engine.hero.d.id;
        let obj = {};
        obj[addonKey] = {
            person: {}
        };
        obj[addonKey].person[id] = dataToSend;

        return obj;
    }

    function save() {

        // API.Storage.set(addonKey + "/open", open);
        API.Storage.set(addonKey + "/works", works);
    }

    function show() {
        //hwnd.$.show();
        hwnd.show();
        hwnd.setWndOnPeak();
        hwnd.updatePos();
    }

    function hide() {
        hwnd.hide();
    }

    function initWindow() {
        var $cnt = $("<div>").addClass("loot-filter");

        hwnd = Engine.windowManager.add({
            content: $cnt,
            title: _t('loot-filter', null, 'widgets-tip'),
            nameWindow: addonKey,
            widget: Engine.widgetsData.name.addon_20,
            type: Engine.windowsData.type.TRANSPARENT,
            addClass: "loot-filter-window",
            manageOpacity: 3,
            managePosition: {
                'x': 251,
                'y': 60
            },
            manageShow: false,
            onclose: () => {
                hide();
                // open = false;
                //API.Storage.set("addon_20/open", open);
                // API.Storage.set(addonKey + "/open", open);
            }
        });
        // hwnd.hide();
        hwnd.addToAlertLayer();
        hwnd.updatePos();
    }

    function initTurnOnBtn() {
        var $btn = API.Templates.get('button').addClass('small green turn-on-btn');
        hwnd.$.find(".window-controlls").append($btn).show();
        $btn.click(changeStateFilter);

        setWndClassTurnOnBtn();
        setTextTurnOnBtn();
    }

    function initList() {
        var $cnt = hwnd.$.find(".loot-filter");
        addButton($cnt, 'auto_accept', confirmAutoAccept);
        for (var t in rules) {
            var r = rules[t];
            if (r instanceof inputRule) {
                addInput($cnt, t, r.options);
            } else if (r instanceof checkboxRule) {
                addButton($cnt, t);
            }
        }
    }

    function getText(val) {
        return _t(val, null, "lootfilter");
    }

    function setValueDataToSend(dataToSend, name, val) {
        dataToSend[name] = val;
    }

    function sendDataToServerStorage(dataToSend, clb) {
        let allObjectToSend = getAllObjectToSend(dataToSend);

        Engine.serverStorage.sendData(allObjectToSend, () => {
            if (clb) clb();
        });
    }

    function getValueFromServerStorage(name, defaultVal) {

        let toReturn = isset(defaultVal) ? defaultVal : null;
        let store = Engine.serverStorage.get(addonKey);
        let id = Engine.hero.d.id;

        if (!store) return toReturn;
        if (!store.person) return toReturn;
        if (!store.person[id]) return toReturn;
        if (!store.person[id].hasOwnProperty(name)) return toReturn;

        return store.person[id][name];
    }

    function setWndClassTurnOnBtn() {
        hwnd.$.removeClass("disabled");
        hwnd.$.addClass(works ? "" : "disabled");
    }

    function setTextTurnOnBtn() {
        var t = [
            _t('turn_on', null, 'loot'),
            _t('turn_off', null, 'loot')
        ];
        var $label = hwnd.$.find('.turn-on-btn').find('.label');
        var str = works ? t[1] : t[0];
        $label.html(str);
    }

    function confirmAutoAccept(cb) {
        var str = getText('confirm_auto_accept_info');
        var callbacks = [{
                txt: _t('ok', null, 'buttons'),
                callback: function() {
                    cb(true);
                    return true;
                }
            },
            {
                txt: _t('cancel', null, 'buttons'),
                callback: function() {
                    cb(false);
                    return true;
                }
            }
        ];
        mAlert(str, callbacks, function(w) {
            w.$.addClass('askAlert');
        });
    }

    function changeButtonState($chbx, id, val) {
        let dataToSend = {};
        setValueDataToSend(dataToSend, id, val);
        sendDataToServerStorage(dataToSend, () => {
            setStateButton($chbx, id);
        });
    }

    function addButton($h, id, turnOnConfirm) {
        var $e = API.Templates.get("one-checkbox").addClass("row do-action-cursor");
        $e.find(".label").html(getText(id) + ": ");
        var $chbx = $e.find('.checkbox');
        setStateButton($chbx, id);
        $e.click(function() {
            let old = getValueFromServerStorage(id, false);

            if (turnOnConfirm && !old) {
                var callback = function(confirm) {
                    if (confirm)
                        changeButtonState($chbx, id, !old);
                };
                turnOnConfirm(callback);
            } else {
                changeButtonState($chbx, id, !old);
            }

        });
        $h.append($e);
    }

    function parseInput(el, val, suffix) {
        if (suffix) val = val.split(suffix).join("");

        val = parsePrice(val);
        //if (isNaN(val)) val = 0;
        if (!checkParsePriceValueIsCorrect(val)) val = 0;

        var goodVal = val;
        if (suffix && val != 0) val += suffix;

        el.val(val);
        return goodVal;
    }

    function addInput($h, id, options) {
        var $d = $("<div>").addClass("row");
        var $e = API.Templates.get("input");
        $("<span>").addClass("label").html(getText(id) + ": ").appendTo($d);
        $e.find('input').attr('name', 'lf_' + id);
        $e.appendTo($d);
        var $inp = $e.find("input");
        setInputValue($inp, id, null);
        // setOnlyPositiveNumberInInput($inp);
        setInputMask($inp, options.type);
        if (isset(options.suffix) && $inp.val() != 0) {
            $inp.val($inp.val() + options.suffix);
        }
        $inp.change(function() {
            var val = parseInput($(this), $(this).val(), options.suffix);


            let dataToSend = {};
            setValueDataToSend(dataToSend, id, val);
            sendDataToServerStorage(dataToSend);
        });
        $h.append($d);
    }

    function setStateButton($chbx, id) {
        var defVal = false;
        if (isset(rules[id])) {
            defVal = rules[id].defaultVal;
        }

        if (getValueFromServerStorage(id, defVal)) {
            $chbx.addClass('active');
        } else {
            $chbx.removeClass('active');
        }
    }

    function setInputValue($chbx, id, val) {
        var v = val;
        if (val === null) {
            v = getValueFromServerStorage(id, 0);
        }
        $chbx.val(v);
    }

    function changeStateFilter() {
        works = !works;

        setWndClassTurnOnBtn();
        setTextTurnOnBtn();
        save();
    }

    this.manageVisible = function() {
        // open = !open;

        if (hwnd.isShow()) hide();
        else show();

        //API.Storage.set("addon_20/open", open);
        // API.Storage.set(addonKey + "/open", open);
    };

    function addStyle() {
        $style = $(`<style>
			.loot-filter{
				margin-top: 11px;
				color: white;
			}
			.loot-filter-window .content{
				margin: -5px -15px;
				width: 210px;
			}
			.loot-filter .one-checkbox .checkbox{
				float: right;
			}
			.loot-filter .label{
				float: left;
			}
			.loot-filter .input input{
				border: 1px solid grey;
				width: 50px;
				color: white;
				text-align: right;
			}
			.loot-filter .row{
				clear: both;
			}
			.loot-filter .row:first-child.one-checkbox{
				height: 30px;
			}
			.loot-filter .input{
				float: right;
				margin-top: -6px;
				margin-bottom: 8px;
			}
			.loot-filter .button-container{
				text-align: center;
			}
			.loot-filter-window .window-controlls {
				margin-top: 2px;
			}
			</style>`).appendTo("head");
    };

    function init() {
        addStyle();
        initWindow();
        initList();
        initTurnOnBtn();

        // if (open) show();

        Engine.items.fetch(Engine.itemsFetchData.FETCH_NEW_LOOT, newLoot);
        API.addCallbackToEvent(Engine.apiData.LOOT_UPDATE, lootUpdate);
    }

    this.start = function() {
        if (running) return;
        running = true;
        //load();


        API.addCallbackToEvent(Engine.apiData.AFTER_INTERFACE_START, initAddon);

        if (getAlreadyInitialised()) {
            initAddon();
        }

    };

    const initAddon = () => {
        load();
    }

    this.stop = function() {
        if (!running) return;
        running = false;
        hwnd.close();

        hwnd.remove();
        hwnd = null;
        works = false;
        API.Storage.remove(addonKey, true);
        Engine.items.removeCallback(Engine.itemsFetchData.FETCH_NEW_LOOT);
        API.removeCallbackFromEvent(Engine.apiData.LOOT_UPDATE, lootUpdate);
        API.removeCallbackFromEvent(Engine.apiData.AFTER_INTERFACE_START, initAddon);
        $style.remove();
    };

};