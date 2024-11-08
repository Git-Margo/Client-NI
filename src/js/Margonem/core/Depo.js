var tpl = require('core/Templates');
let ProfData = require('core/characters/ProfData');
var ItemLocation = require('core/items/ItemLocation');
const InputMaskData = require('core/InputMaskData');
const {
    CL
} = require('./items/data/ItemData');

module.exports = function(clan) {
    var self = this;
    var exp;
    var content;
    var visible = 0;
    var itemTable = {};
    var amountCards = 0;
    var amountAllCards = 0;
    var rights;
    var costProlong;
    var costUpgrade;
    var costCreate;
    var is_new = false;
    var allInit = false;
    var isBuy = false;
    let firstItemsFetch = true;
    var bindArray = [];
    var profArray = [];
    var typeArray = [];
    var statArray = [];
    var gridSize = 112;
    var cardItems = [];

    let $itemGrid = null;


    var last_search = {
        name: null,
        bind: null,
        prof: null,
        type: null,
        kstat: null,
        vstat: null,
        additionalParam: null,
        minLvl: null,
        maxLvl: null
    };

    var depoSearchList = [{
            name: "stats",
            filter: [null, null]
        },
        {
            name: "fullheal",
            filter: ["fullheal", null]
        },
        {
            name: "leczy",
            filter: ["leczy", null]
        },
        {
            name: "perheal",
            filter: ["perheal", null]
        },
        {
            name: "action_nloc",
            filter: ["action", "nloc"]
        },
        {
            name: "summonparty",
            filter: ["summonparty", null]
        },
        {
            name: "action_flee",
            filter: ["action", "flee"]
        },
        {
            name: "action_mail",
            filter: ["action", "mail"]
        },
        {
            name: "action_auction",
            filter: ["action", "auction"]
        },
        {
            name: "action_shop",
            filter: ["action", "shop"]
        },
        {
            name: "action_deposit",
            filter: ["action", "deposit"]
        },
        {
            name: "action_clandeposit",
            filter: ["action", "clandeposit"]
        },
        {
            name: "revive",
            filter: ["revive", null]
        },
        {
            name: "action_fatigue",
            filter: ["action", "fatigue"]
        },
        {
            name: "emo",
            filter: ["emo", null]
        },
        {
            name: "expadd",
            filter: ["expadd", null]
        },
        {
            name: "expired",
            filter: ["expires", null, true]
        },
        {
            name: "expires",
            filter: ["expires", null, false]
        },
        {
            name: "nodesc",
            filter: ["nodesc", null]
        }
    ];

    var optDrag = {
        appendTo: 'body',
        helper: 'clone',
        delay: 100,
        distance: 6,
        cursorAt: {
            top: 16,
            left: 16
        },
        containment: $('body'),
        zIndex: 20,
        start: function(e, ui) {
            changeViewOfHelper(ui.helper, $(this).data().item.id);
        }
    };

    let isDebtOverLimit = false;
    let nextExpiration = '';

    this.setVisibleAttrToGrid = (nr) => {
        //this.wnd.$.find('.grid').attr('card-visible', nr)
        $itemGrid.attr('card-visible', nr)
    }

    const initItemGrid = () => {
        $itemGrid = tpl.get("depo-item-grid");
    }

    const appendItemGrid = () => {
        this.wnd.$.find('.grid-wrapper').append($itemGrid)
    }

    this.init = function() {
        this.closeOtherWindows();
        initItemGrid();
        self.initWindow();
        self.initItem();
        self.initDropGrid();
        self.addGrid(true);
        self.initMenusBindArray();
        if (!clan) self.initDeleteDepoBut();
        if (!clan) self.initPaymentBut();
        self.initUpgradeBut();
        if (!clan) self.initBuyDepoBut();
        self.initButtons();
        self.createSearchPanel();
        this.initLvlFilter();
        self.setVisibleAttrToGrid(0);

        if (clan) {
            self.wnd.$.find('.gold-action').css('display', 'none');
            self.wnd.$.find('.manage-money-wrapper').css('display', 'none');
            self.wnd.$.find('.find-and-manage-money-section').find('.left-part').css('display', 'block');
            self.wnd.$.find('.find-and-manage-money-section').find('.right-part').css('display', 'none');
            Engine.disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.DEPO_CLAN);

        } else {
            Engine.disableItemsManager.startSpecificItemKindDisable(Engine.itemsDisableData.DEPO);
        }
        self.wnd.center();
        Engine.lock.add('depo');
    };

    this.resetPayments = function() {
        costProlong = {
            gold: null,
            credits: null
        };
        costUpgrade = {
            gold: null,
            credits: null
        };
        costCreate = {
            gold: null,
            credits: null
        };
    };

    this.escapeDia = function(str) {
        return str.replace(/Ä/g, 'a')
            .replace(/Ä/g, 'c')
            .replace(/Ä/g, 'e')
            .replace(/Å/g, 'l')
            .replace(/Å/g, 'n')
            .replace(/Ã³/g, 'o')
            .replace(/Å/g, 's')
            .replace(/Å¼/g, 'z')
            .replace(/Åº/g, 'z');
    };

    this.createSearchInput = function() {
        var $input = self.wnd.$.find('.search');
        $input
            .attr("placeholder", _t("search"))
            .keyup(self.txtSearch)
            .change(self.txtSearch);

        self.wnd.$.find('.search-x').on('click', function() {
            $input.val('')
                .blur()
                .trigger('keyup');
        });
    };

    this.txtSearch = function() {
        var name = self.wnd.$.find('.search').val().toLowerCase();
        if (name == "") {
            name = null;
        } else {
            name = self.escapeDia(name).replace(/[^a-z0-9 ]/gi, "").split(" ").join(".*");
            name = new RegExp(name);
        }
        if (name != last_search.name) {
            is_new = true;
            last_search.name = name;
        }
        self.searchDepoItem();
    };

    this.searchDepoItem = function() {
        if (!is_new) return;
        is_new = false;
        self.hideBacklight();

        if (last_search.name === null && last_search.bind === null &&
            last_search.prof === null && last_search.type === null &&
            last_search.kstat === null &&
            last_search.minLvl === null && last_search.maxLvl === null) {
            return;
        }
        for (var x in itemTable) {
            for (var y in itemTable[x]) {
                if (itemTable[x][y] == null) continue;

                let specificCord = itemTable[x][y];

                for (let id in specificCord) {

                    var itemData = specificCord[id].itemData;
                    var $itemClone = specificCord[id].$itemClone;
                    var px = itemData.x % 14;
                    var card = (itemData.x - px) / 14;

                    if (self.isMatch(itemData)) self.backlightCard(card);
                    else self.backlightSlot($itemClone);

                }
            }
        }
    };

    this.getDepoItemTable = function() {
        return itemTable;
    };

    this.backlightCard = function(id) {
        $(".depo .card").eq(id).css({
            color: "rgb(255, 70, 30)"
        });
    };

    this.backlightSlot = function($clone, x, y) {
        $clone.find('.depo_backlight').css('display', 'block');
    };

    this.hideBacklight = function() {
        self.wnd.$.find('.depo_backlight').css('display', 'none');
        self.wnd.$.find('.card').css({
            color: ""
        });
    };

    this.createSearchPanel = function() {
        var $f = self.wnd.$.find('.first');
        var $s = self.wnd.$.find('.second');
        self.createSearchInput();
        self.createMenu(bindArray, 'bind', $f);
        self.createMenu(profArray, 'prof', $f);
        self.createMenu(typeArray, 'type', $s);
        self.createMenu(statArray, 'stat', $s);
    };

    this.createMenu = function(data, cl, wrapper) {
        var $depoFilter = tpl.get('depo-filter');
        wrapper.append($depoFilter);
        var $m = $depoFilter.find('.menu');
        $m.addClass(cl);
        $m.createMenu(data, true, function(val) {
            self.setValueInLastSearch(val, cl);
            self.searchDepoItem();
        });
    };

    this.prepareArrayToMenu = function(destinyArray, lang, dataT) {
        for (var i = 0; i < dataT.length; i += 2) {
            var text = _t(dataT[i], null, lang);
            var val = dataT[i + 1];
            var obj = {
                text: text,
                val: val
            };
            destinyArray.push(obj);
        }
    };

    this.setValueInLastSearch = function(val, cl) {
        if (typeof val == "undefined") val = null;
        var t = ['bind', 'prof', 'type'];
        if (t.lastIndexOf(cl) > -1) {
            if (val == 0) val = null;
            if (val != last_search[cl]) {
                is_new = true;
                last_search[cl] = val;
            }
        } else {
            var v = depoSearchList[val].filter;
            if (v[0] != last_search.kstat || v[1] != last_search.vstat || (isset(v[2]) && last_search.additionalParam !== v[2])) {
                is_new = true;
                last_search.kstat = v[0];
                last_search.vstat = v[1];
                last_search.additionalParam = isset(v[2]) ? v[2] : null;
            }
        }
    };

    this.initMenusBindArray = function() {
        self.prepareArrayToMenu(bindArray, 'depo_search', [
            "bind_state", 0,
            "unbound", 1,
            "bound", 2,
            "permbound", 3
        ]);

        self.prepareArrayToMenu(profArray, 'eq_prof', [
            "prof", 0,
            "prof_warrior", ProfData.WARRIOR,
            "prof_paladyn", ProfData.PALADIN,
            "prof_mag", ProfData.MAGE,
            "prof_hunter", ProfData.HUNTER,
            "prof_bladedancer", ProfData.BLADE_DANCER,
            "prof_tracker", ProfData.TRACKER
        ]);

        self.prepareArrayToMenu(typeArray, 'eq_cl', [
            "type", 0,
            "cl_onehanded", CL.ONE_HAND_WEAPON,
            "cl_twohanded", CL.TWO_HAND_WEAPON,
            "cl_bastard", CL.ONE_AND_HALF_HAND_WEAPON,
            "cl_distance", CL.DISTANCE_WEAPON,
            "cl_helpers", CL.HELP_WEAPON,
            "cl_wands", CL.WAND_WEAPON,
            "cl_staffs", CL.ORB_WEAPON,
            "cl_armor", CL.ARMOR,
            "cl_helmets", CL.HELMET,
            "cl_boots", CL.BOOTS,
            "cl_gloves", CL.GLOVES,
            "cl_rings", CL.RING,
            "cl_neclaces", CL.NECKLACE,
            "cl_shield", CL.SHIELD,
            "cl_neutral", CL.NEUTRAL,
            "cl_usable", CL.CONSUME,
            "cl_keys", CL.KEYS,
            "cl_quests", CL.QUEST,
            "cl_arrows", CL.QUIVER,
            "cl_talisman", CL.TALISMAN,
            "cl_books", CL.BOOK,
            "cl_bags", CL.BAG,
            "cl_bless", CL.BLESS,
            "cl_improve", CL.UPGRADE,
            "cl_coinage", CL.COINAGE,
            "cl_outfits", CL.OUTFITS,
            "cl_pets", CL.PETS,
            "cl_teleports", CL.TELEPORTS,
            "cl_gear", [CL.ARMOR, CL.HELMET, CL.BOOTS, CL.GLOVES, CL.SHIELD], // armors
            "cl_weapons", [CL.ONE_HAND_WEAPON, CL.TWO_HAND_WEAPON, CL.ONE_AND_HALF_HAND_WEAPON, CL.DISTANCE_WEAPON, CL.HELP_WEAPON, CL.WAND_WEAPON, CL.ORB_WEAPON, CL.QUIVER],
            "cl_jewellery", [CL.RING, CL.NECKLACE],
        ]);

        var list = [];
        var idx = 0;
        for (var t in depoSearchList) {
            list = list.concat([depoSearchList[t].name, idx]);
            idx++;
        }
        self.prepareArrayToMenu(statArray, 'depo_search', list);
    };

    this.checkName = function(src, str) {
        if (str === null) {
            return false;
        }
        return str.test(self.escapeDia(src));
    };

    this.isMatch = function(o) {
        if (last_search.bind !== null) {
            var isSoulbound = isset(o._cachedStats["soulbound"]);
            var isPermbound = isset(o._cachedStats["permbound"]);
            var bool1 = last_search.bind == 1 && (isSoulbound || isPermbound);
            var bool2 = last_search.bind == 2 && (!isSoulbound || isPermbound);
            var bool3 = last_search.bind == 3 && !isPermbound;
            if (bool1 || bool2 || bool3)
                return false;
        }

        if (last_search.type !== null) {
            const cls = last_search.type.split(",").map(Number);
            if (!cls.includes(o.cl)) return false;
        }

        if (
            ((isset(o._cachedStats['lvl'])) &&
                ((last_search.minLvl !== null && Number(o._cachedStats['lvl']) < last_search.minLvl) ||
                    (last_search.maxLvl !== null && Number(o._cachedStats['lvl']) > last_search.maxLvl))) ||
            (!isset(o._cachedStats['lvl']) && (last_search.maxLvl !== null || last_search.minLvl !== null))
        ) return false;

        if (last_search.name !== null && !self.checkName(o.name.toLowerCase(), last_search.name)) return false;

        if (last_search.prof !== null && isset(o._cachedStats["reqp"]) && o._cachedStats["reqp"].indexOf(last_search.prof) == -1)
            return false;

        if (last_search.kstat !== null) {
            let kstats = last_search.kstat.split('|');
            let result = false;
            for (let i = 0; i < kstats.length; i++) { // for multiple stats (separated "|")
                if (isset(o._cachedStats[kstats[i]])) {
                    result = true;
                    if (kstats[i] === 'expires') result = last_search.additionalParam ? o.checkExpires() : !o.checkExpires();
                }
            }
            if (!result) return false;
        }


        if (last_search.kstat !== null && last_search.vstat !== null && o._cachedStats[
                last_search.kstat].split(",")[0] != last_search.vstat)
            return false;

        return true;
    };

    this.getUpgradePrice = function() {
        var g = costUpgrade['gold'];
        var c = costUpgrade['credits'];
        var price = {};
        if (g) price.gold = g;
        if (c) price.credits = c;
        return price;
    };

    this.updatePayments = function(cost_p, cost_u, cost_c) {
        this.resetPayments();
        if (cost_p) {
            var costPGold = cost_p['gold'];
            var costPCredits = cost_p['credits'];
        }
        if (cost_u) {
            var costUGold = cost_u['gold'];
            var costUCredits = cost_u['credits'];
        }
        if (cost_c) {
            var costCGold = cost_c['gold'];
            var costCCredits = cost_c['credits'];
        }

        if (costPGold) costProlong['gold'] = costPGold;
        if (costPCredits) costProlong['credits'] = costPCredits;
        if (costUGold) costUpgrade['gold'] = costUGold;
        if (costUCredits) costUpgrade['credits'] = costUCredits;
        if (costCGold) costCreate['gold'] = costCGold;
        if (costCCredits) costCreate['credits'] = costCCredits;
    };

    this.manageMultiZeroZero = (v) => {
        if (!v) return;

        message(_t('depoMultiZeroZero'));

        for (let k in itemTable[0][0]) {
            itemTable[0][0][k].$itemClone.addClass('doubled')
        }

    };

    this.updateData = function(v) {
        isDebtOverLimit = v.is_debt_over_limit;
        nextExpiration = v.next_expiration;
        this.manageMultiZeroZero(v.has_multi_items_at_zero_zero);

        while (cardItems.length < v.size) {
            cardItems.push(0);
        }

        isBuy = v.size === 0;
        if (!clan) this.updateGold(v.gold);
        else {
            if (isset(v.myrights)) {
                var bool = this.updateRight(v.myrights);
                if (bool) return;
            }
        }
        this.updatePayments(v.cost_prolong, v.cost_upgrade, v.cost_create);
        this.updateAvailable(v.size, v.expire);
        this.updateUpgradeBut(v.size, v.msize, v.expire);
        this.setExpiredOverlay(v.size, v.expire);

        if (!clan) this.updatePaymentBut(v.size, v.expire);
        if (!clan) this.updateDeleteBut(v.size, v.expire);
        if (!clan) this.updateBuyBut(v.size, v.expire);

        this.updateCards(v.size, v.msize, v.expire);
        this.setSizeCardContent();
        this.setVisibleArrows();
        this.initMoveCardScroll();

        const $priceInput = this.wnd.$.find('.price');
        $priceInput.val('');
        setInputMask($priceInput, InputMaskData.TYPE.NUMBER_WITH_KMG)

        allInit = true;
    };

    this.setSizeCardContent = function() {
        var widthAB = self.wnd.$.find('.actions-bar-content').width();
        var widthBS = self.wnd.$.find('.bottom-section').width();
        var v = widthBS - widthAB - 1;
        //self.wnd.$.find('.cards-menu').css('width', v);
        ///self.wnd.$.find('.cards-content').css('width', 35 * amountCards);
    };

    this.initMoveCardScroll = function() {
        self.wnd.$.find('.left-arrow').click(function() {
            self.changePosCardsOverflow(false);
        });
        self.wnd.$.find('.right-arrow').click(function() {
            self.changePosCardsOverflow(true);
        });
    };

    this.changePosCardsOverflow = function(inc) {
        var newLeft, bool;
        var left = self.wnd.$.find('.cards-content').position().left;
        var $cardsOverflow = self.wnd.$.find('.cards-content');
        var widthCardsOverf = self.wnd.$.find('.cards-content').width();
        if (inc) {
            newLeft = left - 35;
            var widthCardsCon = self.wnd.$.find('.midle-cards-overflow').width();
            bool = Math.abs(newLeft) + widthCardsCon > widthCardsOverf;

            if (bool) newLeft = (widthCardsOverf - widthCardsCon) * -1;
            $cardsOverflow.css('left', newLeft);
        } else {
            newLeft = left + 35;
            bool = newLeft >= 0;
            $cardsOverflow.css('left', bool ? 0 : newLeft);
        }
    };

    this.updateBuyBut = function(size, expire) {
        var state = (size == 0 || expire == 0) ? 'inline-block' : 'none';
        //if (asdasd)this.wnd.$.find('.depo-buy').css('display', state);
        //else this.wnd.$.find('.depo-buy').css('display', 'inline-block');
        this.wnd.$.find('.depo-buy').css('display', state);
    };

    this.updatePaymentBut = function(size, expire) {
        var state = (size == 0 || expire == 0) ? 'none' : 'inline-block';
        this.wnd.$.find('.depo-payment').css('display', state);
    };

    this.updateDeleteBut = function(size, expire) {
        var state = 'inline-block';
        if (size == 0 || expire === 0) state = 'none';
        self.wnd.$.find('.delete-deposit').css('display', state)
    };

    this.updateCards = function(size, msize, expire) {
        const $buts = this.wnd.$.find('.cards-content');
        const maxsize = clan ? msize : 8;
        while (amountAllCards < maxsize) {
            if (amountCards < size) {
                this.addGrid();
                this.newCard($buts, maxsize, true); // enabled cards
                amountCards++; // count enabled cards
            } else {
                this.newCard($buts, maxsize, false); // disabled cards
            }
            amountAllCards++ // count all cards
        }
        if (amountCards < size) { // buy slot - enable disabled card
            this.setBoughtCard(size);
            this.addGrid();
            amountCards++;
        }
        this.setVisible(visible);
        this.setAmountOnCards();
    };

    this.setBoughtCard = function(nr) {
        let $card = self.wnd.$.find('.card').eq(nr - 1);
        $card.removeClass('disabled');
        $card.find('.amount').text(gridSize);
    };

    this.setVisibleArrows = function() {
        var $w = self.wnd.$;
        //if (clan) {
        //	return;
        //}
        var widthCardsOverflow = $w.find('.cards-content').width();
        var widthCardsContent = $w.find('.midle-cards-overflow').width();
        var bool = widthCardsOverflow > widthCardsContent;
        var pos = bool ? 17 : 2;
        $w.find('.left-arrow, .right-arrow').css('display', bool ? 'block' : 'none');
        $w.find('.midle-cards-overflow').css({
            'left': pos,
            'right': pos
        });
    };

    this.updateUpgradeBut = function(size, msize, expire) {
        if (size == msize) return this.setStateUpgradeCard(true);

        if (clan) {
            self.wnd.$.find('.upgrade').find('.label').html(isBuy ? _t('buydepo') : _t('increase'));
            var canUpgrade = rights & 1;
            if (canUpgrade) this.setStateUpgradeCard(false);
            else this.setStateUpgradeCard(true);
        } else {
            var canUpgrade = !(size == 0 || expire === 0);
            if (canUpgrade) this.setStateUpgradeCard(false);
            else this.setStateUpgradeCard(true);
        }
    };


    //this.updateUpgradeBut = function (size, msize, expire) {
    //	if (size == msize) return this.setStateUpgradeCard(true);
    //	if (size == 0 || expire === 0) return this.setStateUpgradeCard(true);
    //	if (!(rights & 1) && clan) return this.setStateUpgradeCard(true);
    //	if (!clan || rights & 1 && clan) this.setStateUpgradeCard(false);
    //};

    this.initUpgradeBut = function() {
        this.createBut('add_card', 'upgrade', function() {
            var data = self.getUpgradePrice();

            if (clan) {
                var str = '';
                if (isBuy) str = _t('buydepoalert', {
                    '%gold%': round(data.gold),
                    '%credits%': data.credits
                }, 'depo');
                else str = _t('increasedepoalert', {
                    '%gold%': round(data.gold),
                    '%credits%': data.credits
                }, 'depo');

                mAlert(str, [{
                    txt: _t('pay_gold %val%', {
                        '%val%': round(data.gold)
                    }, 'depo'),
                    hotkeyClass: '',
                    callback: function() {
                        _g('clan&a=depo&op=upgrade&pay=z');
                        return true;
                    }
                }, {
                    txt: _t('pay_gold %val%', {
                        '%val%': data.credits
                    }, 'depo') + ' ' + _t('sl', null, 'clan'),
                    hotkeyClass: '',
                    callback: function() {
                        _g('clan&a=depo&op=upgrade&pay=s');
                        return true;
                    }
                }, {
                    txt: _t('cancel'),
                    hotkeyClass: 'alert-cancel-hotkey',
                    callback: function() {
                        return true;
                    }
                }]);

            } else {
                var str = _t('depo_upgrade_confirm_' + 'credits' + ' %val%', {
                    '%val%': data.credits
                }, 'depo');
                mAlert(str, [{
                    txt: _t('yes'),
                    callback: function() {
                        _g('depo&upgrade=1');
                        return true;
                    }
                }, {
                    txt: _t('no'),
                    callback: function() {
                        return true;
                    }
                }]);
            }
        }, 'green');
    };

    this.initBuyDepoBut = function() {
        if (clan) return;
        this.createBut('buy_depo', 'depo-buy', function() {
            self.paymentButActions('Create');
        }, 'green');
    };

    this.initDeleteDepoBut = function() {
        if (clan) return;
        this.createBut('delete-deposit', 'delete-deposit', function() {
            self.deleteDeposit();
        });
    };

    this.setStateUpgradeCard = function(state) {
        var w = this.wnd.$;
        var $addCard = w.find('.upgrade');
        if (state) $addCard.css('display', 'none');
        else $addCard.css('display', 'inline-block')
    };

    this.newCard = function($par, msize, bought = true) {
        const nr = amountAllCards;
        const shownNumber = nr + 1;
        const $card = tpl.get('card').addClass('active');
        if (!bought) {
            $card.addClass('disabled');
        }
        $card.width(100 / msize + "%");
        $card.find('.label .number').html(shownNumber);
        if (shownNumber === msize && msize === 8 && !clan) {
            $card.find('.label .icons').append($('<div>', {
                class: 'k-b'
            }));
        }
        var timeOut = null;
        $par.append($card);
        //$card.append($label);

        $card.click(function() {
            if ($card.hasClass('disabled')) return;
            self.setVisible(nr);
            self.correctCardPos(nr);
        });

        $card.droppable({
            over: function(e) {
                if (e.target.classList.contains('disabled')) return; // fix for engine stop
                timeOut = setTimeout(function() {
                    self.setVisible(nr);
                }, 1000);
            },
            out: function() {
                clearTimeout(timeOut);
                timeOut = null;
            },
            drop: function(e, ui) {
                if (e.target.classList.contains('disabled')) return; // fix for engine stop
                if (timeOut) clearTimeout(timeOut);
                var item = ui.draggable.data('item');
                self.setDepoItem(item, nr);
                timeOut = null;
            }
        });
    };

    this.correctCardPos = function(nr) {
        var wCard = 35;
        var aCard = nr * wCard;
        var bCard = aCard + wCard;
        var $cardContent = self.wnd.$.find('.cards-content');
        var wOverflow = self.wnd.$.find('.midle-cards-overflow').width();
        var aVisiblePos = Math.abs($cardContent.position().left);
        var bVisiblePos = aVisiblePos + wOverflow;
        var bool1 = aCard < aVisiblePos;
        var bool2 = bCard > bVisiblePos;

        if (bool1 && !bool2) {
            $cardContent.css('left', aCard * -1);
        }
        if (!bool1 && bool2) {
            var wOverflow = self.wnd.$.find('.midle-cards-overflow').width();
            var newLeft = bCard - wOverflow;
            $cardContent.css('left', newLeft * -1)
        }
    };

    this.setVisible = function(nr) {
        //var $grid = self.wnd.$.find('.grid');
        var $cards = self.wnd.$.find('.card');
        self.setVisibleAttrToGrid(nr);
        $itemGrid.css('left', nr * (-490));
        $cards.removeClass('active');
        $cards.eq(nr).addClass('active');
        visible = nr;
    };

    this.initWindow = function() {

        var title = clan ? this.tLang('clan_depo') : this.tLang('depo');
        content = tpl.get('depo');
        if (clan) content.addClass('depo-clan');

        Engine.windowManager.add({
            content: content,
            //nameWindow        : 'depo',
            nameWindow: Engine.windowsData.name.DEPO,
            nameRefInParent: 'wnd',
            objParent: this,
            title: title,
            onclose: () => {
                self.close();
            }
        });

        this.wnd.addToAlertLayer();
    };

    this.updateAvailable = function(size, expire) {
        var t = [
            this.tLang('depo-txt-rent'),
            this.tLang('depo_available_info'),
            this.tLang('depo_missing'),
            this.tLang('yes'),
            this.tLang('no')
        ];
        var str = '';
        var $w = this.wnd.$;
        var $expire = $w.find('.date-value');
        if (expire === 0) str = t[2];
        else str = this.timeOut(expire);
        $expire.html(str);
    };

    this.initLvlFilter = () => {
        const
            minLvlWrapperEl = this.wnd.$[0].querySelector('.start-lvl-wrapper'),
            maxLvlWrapperEl = this.wnd.$[0].querySelector('.stop-lvl-wrapper'),
            minLvlEl = createNiInput({
                cl: 'start-lvl',
                placeholder: _t('start'),
                changeClb: (val) => this.minLvlOnChange(val),
                clearClb: () => this.minLvlOnChange(''),
                type: 'number',
            })[0],
            maxLvlEl = createNiInput({
                cl: 'stop-lvl',
                placeholder: _t('stop'),
                changeClb: (val) => this.maxLvlOnChange(val),
                clearClb: () => this.maxLvlOnChange(''),
                type: 'number',
            })[0];

        minLvlWrapperEl.appendChild(minLvlEl);
        maxLvlWrapperEl.appendChild(maxLvlEl);
    }

    this.minLvlOnChange = (val) => {
        val = val !== '' ? Number(val) : null;
        if (val !== last_search.minLvl) is_new = true;
        last_search.minLvl = val;
        this.searchDepoItem();
    }

    this.maxLvlOnChange = (val) => {
        val = val !== '' ? Number(val) : null;
        if (val !== last_search.maxLvl) is_new = true;
        last_search.maxLvl = val;
        this.searchDepoItem();
    }

    this.timeOut = function(expire) {
        var e = ut_fulltime(expire);
        var bool = expire < unix_time();
        if (bool) return '<span>' + e + '</span>';
        else return e;
    };

    this.updateGold = function(gold) {
        var $w = this.wnd.$;
        //var $gold = $w.find('.gold-amount');
        //$gold.html(this.tLang('depo-balance') + ' ' + gold);
        $w.find('.gold-value').html(formNumberToNumbersGroup(gold));
    };

    this.updateRight = function(myrights) {
        var r = ((0x200 + 0x400 + 0x800) & myrights) >> 9;
        var str = this.tLang('no_rights_to_see_cd');
        rights = myrights;
        if (r == 0 && !(myrights & 1)) {
            this.close();
            mAlert(str);
            return true;
        }
        return false;
    };

    this.initPaymentBut = () => {
        this.createBut('depo-payment', 'depo-payment', () => {
            if (!nextExpiration) {
                mAlert(_t('max_next_expiration', null, 'depo'));
                return;
            }
            this.paymentButActions('Prolong');
        }, 'green');
    };

    this.initButtons = function() {
        var w = this.wnd.$;
        var t = [
            'pay-in',
            'pay-out',
            'but-actions',
            this.tLang('depo_monthcost'),
            this.tLang('depo_next_renew')
        ];
        var g = [
            'depo&goldin=',
            'depo&goldout='
        ];
        if (clan) return;
        w.find('.info').html(t[3] + '<br>' + t[4] + ut_fulltime(exp));

        this.createBut(t[0], 'give', function() {
            var v = parsePrice(removeSpaces(w.find('.price').val()));

            if (checkInputValIsEmptyProcedure(v)) return;
            if (!checkParsePriceValueIsCorrect(v)) return

            _g(g[0] + v);
        }, 'green');
        this.createBut(t[1], 'get', function() {
            var v = parsePrice(removeSpaces(w.find('.price').val()));

            if (checkInputValIsEmptyProcedure(v)) return;
            if (!checkParsePriceValueIsCorrect(v)) return

            _g(g[1] + v);
        }, 'green');
    };

    this.getPayProlong = function(attr) {
        return costProlong[attr];
    };

    this.getPayCreate = function(attr) {
        return costCreate[attr];
    };

    this.paymentButActions = function(typePay) { //typePay: 'Prolong' / 'Create'
        var gReq, strA;
        var goldObj = roundParser(costCreate['gold']);
        var creditsObj = roundParser(costCreate['credits']);
        var gold = goldObj.val + goldObj.postfix;
        var credits = creditsObj.val + creditsObj.postfix;

        if (!clan) {
            gReq = [
                'depo&pay=z&time=1',
                'depo&pay=s&time=1'
            ];
            var bool = typePay == 'Prolong';
            if (bool) {
                let costInfo = isDebtOverLimit ? 'depo_debt_cost' : 'depo_month_cost';
                strA = this.tLang(costInfo) + '<br>' + this.tLang('depo_next_renew') + ut_fulltime(nextExpiration);
            } else {
                strA = _t('depo_create %gold% %credits%', {
                    '%gold%': gold,
                    '%credits%': credits
                }, 'depo');
            }
        } else {
            //var bool = typePay == 'Prolong';
            //if (bool) {
            //	gReq = ['clan&a=depo&op=prolong&m=1'];
            //	strA = this.tLang('depo_clan_month_cost') + '<br>' + this.tLang('depo_next_renew') + ut_fulltime(strtotime('+1 month', exp));
            //}
            //else {
            //	gReq = ['clan&a=depo&op=create'];
            //	strA = _t('depo_clan_create %gold% %credits%', {'%gold%': gold}, 'depo');
            //}
        }

        mAlert(strA, [{
            txt: _t('cancel'),
            hotkeyClass: 'alert-cancel-hotkey',
            callback: function() {
                return true;
            }
        }], function(wnd) {

            var fName = 'getPay' + typePay;
            var g = self[fName]('gold');
            var c = self[fName]('credits');

            if (g) {
                var str = _t('pay_gold %val%', {
                    '%val%': round(g)
                }, 'depo');
                self.addControlBut(wnd, str, function() {
                    _g(gReq[0]);
                }, 'small');
            }

            if (c) {
                var str = _t('pay_tears %val%', {
                    '%val%': c
                }, 'depo');
                self.addControlBut(wnd, str, function() {
                    _g(gReq[1]);
                }, 'small');
            }

            // move cancel button to end
            var $cancelBtn = wnd.$.find('.button').first(),
                $parent = $cancelBtn.parent();
            $parent.append($cancelBtn);
        });
    };

    this.addControlBut = function(wnd, label, f, addCl) {
        var b = wnd.addControll(label, null, function() {
            f();
            wnd.close();
        });
        if (addCl) b.addClass(addCl);
    };

    this.deleteDeposit = function() {
        mAlert(self.tLang('depo_remove_confirm_txt'), [{
            txt: self.tLang('yes'),
            callback: function() {
                _g('depo&remove=OK', function(v) {
                    if (!isset(v.msg)) {
                        self.itemTableDelete();
                    }
                });
                return true;
            }
        }, {
            txt: self.tLang('no'),
            callback: function() {
                return true;
            }
        }]);
    };

    this.createBut = function(name, cont, f, addClass) {
        var w = this.wnd.$;
        var $b = tpl.get('button').addClass('small ' + addClass);
        var $cont = w.find('.' + cont);
        var str = this.tLang(name);
        $b.find('.label').text(str);
        $cont.append($b);
        $b.click(f);
    };

    this.initItem = function() {
        let data = clan ? Engine.itemsFetchData.NEW_CLAN_DEPO_ITEM : Engine.itemsFetchData.NEW_PRIVATE_DEPO_ITEM;
        Engine.items.fetch(data, self.newDepoItem);
    };

    this.newDepoItem = function(i, finish) {
        //var $clone = $(i.$[0]);



        //var $clone = Engine.items.createViewIcon(i.id, 'depo-item')[0];
        var $clone = Engine.items.createViewIcon(i.id, Engine.itemsViewData.DEPO_ITEM_VIEW)[0];
        let $backlight = tpl.get("depo_backlight");
        self.setItem($clone, i);
        self.itemCallbacks($clone, i);

        $clone.prepend($backlight)
        $clone.data('item', i);
        $clone.draggable(optDrag);
        $clone.click(function(e) {
            self.clickDepoItem(getE(e), i);
        });
        $clone.contextmenu(function(e, mE) {
            if (clan) self.depoClanItemMenu(getE(e, mE), i);
            else self.depoItemMenu(getE(e, mE), i);
            //e.preventDefault();
        });

        if (!firstItemsFetch) {
            is_new = true;
            self.searchDepoItem();
        }
        i.on("delete", function() {
            is_new = true;
            self.searchDepoItem();
        });
        i.on("afterUpdate", function() {
            is_new = true;
            self.searchDepoItem();

            if (i.x > 0 || i.y > 0) $clone.removeClass('doubled');

        });
        self.countItemsPerCard(i.x, true);
        if (finish) {
            self.setAmountOnCards();

            if (firstItemsFetch) {
                appendItemGrid();
            }

            firstItemsFetch = false;
        }
    };

    this.countItemsPerCard = function(x, increment = true) {
        let cardNumber = parseInt(x / 14);

        while (cardItems[cardNumber] == undefined) {
            cardItems.push(0);
        }

        if (increment) {
            cardItems[cardNumber]++;
        } else {
            cardItems[cardNumber]--;
        }
    };

    this.setAmountOnCards = function() {
        let $cards = self.wnd.$.find('.cards-content .card');
        let $availableSlots = self.wnd.$.find('.available-slots .available-slots-current');
        let $allSlots = self.wnd.$.find('.available-slots .available-slots-all');
        let current = 0;
        let all = amountCards * gridSize;
        for (let i = 0; i < cardItems.length; i++) {
            let val = gridSize - cardItems[i];
            $cards.eq(i).find('.amount').text(val);
            if (i < amountCards) {
                current += val;
            }
        }
        $availableSlots.text(current);
        $allSlots.text(all);
    };

    this.clickDepoItem = function(e, i) {
        // var can = i.hasMenu && mobileCheck();
        if (clan) {
            // if (can) {
            // 	this.depoClanItemMenu(e, i);
            // 	return;
            // }
            _g('clan&a=depo&op=item_get&id=' + i.id);
        } else {
            // if (can) {
            // 	this.depoItemMenu(e, i);
            // 	return;
            // }
            _g('depo&get=' + i.id);
        }
    };

    this.depoClanItemMenu = function(e, i) {
        var o = {
            txt: _t('move', null, 'item'),
            f: function() {
                _g('clan&a=depo&op=item_get&id=' + i.id);
            }
        };
        i.createOptionMenu(e, o);
    };

    this.depoItemMenu = function(e, i) {
        var o = {
            txt: _t('move', null, 'item'),
            f: function() {
                _g('depo&get=' + i.id)
            }
        };
        i.createOptionMenu(e, o);
    };

    this.getAmountCards = function() {
        return amountCards;
    };

    this.getCardItems = function() {
        return cardItems;
    };

    this.addGrid = function(init) {
        if (!init && amountCards == 0) return;
        //var $grid = self.wnd.$.find('.grid');
        $itemGrid.css('width', (amountCards + 1) * 491);
    };

    this.setItem = function($clone, i) {
        self.slotItemTable(i, $clone);
        self.setPos($clone, i.x, i.y);
    };

    this.itemCallbacks = function($clone, d) {
        d.on('afterUpdate', function(old) {
            if (old.x != d.x || old.y != d.y) {
                self.setItem($clone, d);
                delete itemTable[old.x][old.y];
                self.countItemsPerCard(old.x, false);
                self.countItemsPerCard(d.x, true);
                self.setAmountOnCards();
            }
        });
        d.on('delete', function() {
            delete itemTable[d.x][d.y];
            self.countItemsPerCard(d.x, false);
            self.setAmountOnCards();
            $clone.remove();
        });
    };

    this.slotItemTable = function(i, $clone) {
        var x = i.x;
        var y = i.y;
        var id = i.id;

        if (!itemTable[x]) itemTable[x] = {};
        if (!itemTable[x][y]) itemTable[x][y] = {};

        itemTable[x][y][id] = {
            itemData: i,
            $itemClone: $clone
        };
    };

    this.setPos = function($o, x, y, move) {
        //var $grid = self.wnd.$.find('.grid');
        var trans = move ? move : 0;
        $o.css({
            'left': x * 35 + 2 - trans,
            'top': y * 35 + 2 - trans
        });

        $o.removeClassStartingWith('x-');
        $o.addClass('x-' + Math.floor((x / 14)));

        $itemGrid.append($o);
    };

    this.setExpiredOverlay = function(size, expire) {
        var $expiredOverlay = self.wnd.$.find('.depo-expired');
        var $expiredOverlayText = $expiredOverlay.find('.depo-expired__text');
        if (size == 0 || expire == 0) {
            $expiredOverlay.removeClass('depo-expired--hidden');
        } else {
            $expiredOverlay.addClass('depo-expired--hidden');
        }
        let ownClan = rights & 1;
        let str = clan ? (ownClan ? 'depo-clan-expired' : 'depo-clan-expired-others') : 'depo-expired';
        $expiredOverlayText.html(_t(str, null, 'depo'));
    };

    this.close = function() {
        // var loc = clan ? 'c' : 'd';
        let data = clan ? Engine.itemsFetchData.NEW_CLAN_DEPO_ITEM : Engine.itemsFetchData.NEW_PRIVATE_DEPO_ITEM;
        Engine.items.removeCallback(data);
        //self.wnd.$.remove();
        self.wnd.remove();
        this.itemTableDelete();
        if (clan) _g('clan&a=depo&op=close');
        // delete (self.wnd);
        Engine.lock.remove('depo');
        Engine.depo = false;

        if (clan) Engine.disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.DEPO_CLAN);
        else Engine.disableItemsManager.endSpecificItemKindDisable(Engine.itemsDisableData.DEPO);

        //delete(self);
    };

    this.itemTableDelete = function() {
        // var loc = clan ? 'c' : 'd';
        let loc = clan ? Engine.itemsFetchData.NEW_CLAN_DEPO_ITEM.loc : Engine.itemsFetchData.NEW_PRIVATE_DEPO_ITEM.loc;
        Engine.items.deleteMessItemsByLoc(loc, false);
        //for (var x in itemTable) {
        //	for (var y in itemTable[x]) {
        //		delete itemTable[x][y];
        //	}
        //	delete itemTable[x];
        //}
        itemTable = null;
    };

    this.setDepoItem = function(data, pos) {
        var place = isset(pos) ? pos : visible;
        var xLength = (place + 1) * 14;
        var xStart = xLength - 14;
        // var act = data.loc == Engine.itemsFetchData.NEW_EQUIP_ITEM.loc ? 'put' : 'move';
        var act = ItemLocation.isEquipItemLoc(data.loc) ? 'put' : 'move';

        for (var y = 0; y < 8; y++) {
            for (var x = xStart; x < xLength; x++) {
                if (!itemTable[x] || (itemTable[x] && !itemTable[x][y])) {
                    if (clan) {
                        // if (data.loc == 'g') _g('clan&a=depo&op=item_put&id=' + data.id + '&x=' + x + '&y=' + y);
                        // if (data.loc == Engine.itemsFetchData.NEW_EQUIP_ITEM.loc) _g('clan&a=depo&op=item_put&id=' + data.id + '&x=' + x + '&y=' + y);
                        if (ItemLocation.isEquipItemLoc(data.loc)) _g('clan&a=depo&op=item_put&id=' + data.id + '&x=' + x + '&y=' + y);
                        else _g('clan&a=depo&op=item_move&id=' + data.id + '&x=' + x + '&y=' + y);

                    } else {
                        _g('depo&' + act + '=' + data.id + '&x=' + x + '&y=' + y);
                    }
                    return;
                }
            }
        }
    };

    this.initDropGrid = function() {
        this.wnd.$.find('.grid-wrapper').droppable({
            accept: '.item:not(.shop-item)',
            drop: function(e, ui) {
                var item = ui.draggable.data('item');
                var gridOffset = $(this).offset();
                var dy = Math.floor((ui.offset.top + ui.draggable.height() * Engine.zoomFactor / 2 - gridOffset.top) / 35 / Engine.zoomFactor);
                var dx = Math.floor((ui.offset.left + ui.draggable.width() * Engine.zoomFactor / 2 - gridOffset.left) / 35 / Engine.zoomFactor) + visible * 14;
                switch (item.loc) {
                    //case 'd':
                    case Engine.itemsFetchData.NEW_PRIVATE_DEPO_ITEM.loc:
                        _g('depo&move=' + item.id + '&x=' + dx + '&y=' + dy);
                        break;
                        // case 'g':
                    case Engine.itemsFetchData.NEW_EQUIP_ITEM.loc:
                        if (clan) _g('clan&a=depo&op=item_put&id=' + item.id + '&x=' + dx + '&y=' + dy);
                        else _g('depo&put=' + item.id + '&x=' + dx + '&y=' + dy);
                        break;
                        // case 'c':
                    case Engine.itemsFetchData.NEW_CLAN_DEPO_ITEM.loc:
                        _g('clan&a=depo&op=item_move&id=' + item.id + '&x=' + dx + '&y=' + dy);
                        break;
                }
            }
        });
    };

    this.tLang = function(name) {
        return _t(name, null, 'depo');
    };

    this.closeOtherWindows = () => {
        const v = Engine.windowsData.windowCloseConfig.DEPO;
        Engine.windowCloseManager.callWindowCloseConfig(v);
    }

    const getVisible = () => {
        return visible;
    };


    this.getVisible = getVisible;
    //this.init();
};