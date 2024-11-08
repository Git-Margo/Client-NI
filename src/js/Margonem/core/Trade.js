var tpl = require('core/Templates');
const InputMaskData = require('core/InputMaskData');
const ConfirmationQueue = require("./utils/ConfirmationQueue");
const {
    checkPersonalItems
} = require("./HelpersTS");

module.exports = function(tId) {
    var self = this;
    var list = {};
    var hAccept = false;
    var oAccept = false;
    var countT = 0;
    var acceptAmount = 0;
    let disableClass = 'inactive no-hover';
    var aGoldValue = {
        h: 0,
        o: 0
    };
    let timeout = null;
    var tradeSuccess = false;
    var lastGold;
    let gainedCreditsRatio = 0.1;

    const setTimer = (sec) => {
        if (timeout) clearTimeout(timeout);

        let $tradeAccept = this.$.find('.accept-trade');

        if (!checkBlockAccept()) {
            $tradeAccept.addClass(disableClass);
            $tradeAccept.tip(_t("change_money_or_items"))
        }

        timeout = setTimeout(() => {
            $tradeAccept.removeClass(disableClass);

            $tradeAccept.tip('');
            $tradeAccept.tipHide();
        }, sec * 1000);

    };

    const checkBlockAccept = () => {
        let $tradeAccept = this.$.find('.accept-trade');

        return $tradeAccept.hasClass(disableClass);
    };

    this.update = function(val) {
        if (val.close && val.close == 1) this.closeTrade(val);

        if (isset(val.acceptLockSeconds)) {
            setTimer(val.acceptLockSeconds);
        }

        if (isset(val.gainedCreditsRatio)) {
            gainedCreditsRatio = val.gainedCreditsRatio;
        }

        if (isset(val.mygold)) {
            this.$.find('.hero-prize').val(val.mygold == 0 ? '' : round(val.mygold, 3));
            this.$.find('.hero-prize').attr('data-prize', val.mygold);
            this.$.find('.hero-prize').tip(formNumberToNumbersGroup(val.mygold));
            this.acceptBtnActive();
        }

        const creditsRatio = (1 - gainedCreditsRatio) * 100; // percent
        if (isset(val.credits)) {
            this.$.find('.other-credits').text(val.credits);
            this.$.find('.other-credits').attr('other-credits', val.credits);
            this.$.find('.other-credits').tip(this.tLang('credits-tip', {
                "%val%": creditsRatio
            }));
        }

        if (isset(val.mycredits)) {
            this.$.find('.hero-credits').text(val.mycredits);
            this.$.find('.hero-credits').attr('data-credits', val.mycredits);
            this.$.find('.hero-credits').tip(this.tLang('credits-tip', {
                "%val%": creditsRatio
            }));
        }

        if (isset(val.gold)) {
            this.$.find('.other-prize').html(round(val.gold, 3));
            this.$.find('.other-prize').attr('data-prize', val.gold);
            this.$.find('.other-prize').tip(formNumberToNumbersGroup(val.gold));
        }
        this.tradeState(val.myaccept, val.accept);
        this.buttonState(val.myaccept, val.accept);
    };

    this.init = function() {
        this.closeOtherWindows();
        Engine.lock.add('trade');
        this.$ = tpl.get('trade-window');
        //$('.interface-layer .bottom.positioner')
        Engine.interface.getBottomPositioner().append(this.$);
        this.createTradeDialog();
        this.createRightSide();
        this.initButton();
        //this.show();
        this.initDropable('show', 's');
        this.initDropable('sell', 't');
        this.initGoldChange();
        this.createButAcceptGold();
    };

    this.createTradeDialog = function() {
        var tip = this.$.find('.tip');
        var tab = ['watch', 'show', 'buy', 'sell', 'gold-label', 'credits-label'];
        self.getDelayedNick();
        tip.tip(this.tLang('how_trade_info'), 't_static');
        for (var i = 0; i < tab.length; i++)
            this.setLabel(tab[i]);
    };

    this.getDelayedNick = function() {
        var i = setInterval(function() {
            var trader = Engine.others.getById(tId);
            if (trader) {
                var who = _t('trade_with %nick%', {
                    '%nick%': trader.nick
                }, 'trade');
                self.$.find('header .h_content').html(who);
                clearInterval(i);
            }
        }, 100);
    };

    this.createRightSide = function() {
        var tab = ['other_decision', 'hero_decision'];
        for (var i = 0; i < tab.length; i++)
            this.setLabel(tab[i]);
    };

    this.setLabel = function(name) {
        var html = this.tLang(name);
        this.$.find('.' + name).html(html);
    };

    this.initButton = function() {
        this.addButton('accept', 'green', this.tradeAccept);
        this.addButton('cancel', false, function() {
            _g('trade&a=cancel');
        });
        var $label = this.$.find('.cancel-trade').find('.label');
        $label.html($label.html() + ' [Esc]');
        // Engine.items.fetch('t', self.newTradeItem);
        // Engine.items.fetch('s', self.newTradeItem);

        Engine.items.fetch(Engine.itemsFetchData.NEW_TRADE_ITEM_T, self.newTradeItem);
        Engine.items.fetch(Engine.itemsFetchData.NEW_TRADE_ITEM_S, self.newTradeItem);
    };

    //this.show = function () {
    //	setTimeout(function () {
    //		self.$.addClass('active');
    //	}, 100);
    //};

    this.initDropable = function(kind, loc) {
        this.$.find('.hero-' + kind + '-item').droppable({
            accept: '.item',
            drop: function(e, ui) {
                e.stopPropagation();
                var item = ui.draggable.data('item');
                _g('trade&a=add&' + loc + 'id=' + item.id);
            }
        });
    };

    this.initGoldChange = function() {
        var $heroPrize = this.$.find('.hero-prize');
        var tip = $heroPrize.data('value');
        setInputMask($heroPrize, InputMaskData.TYPE.NUMBER_WITH_KMG)
        $heroPrize.focus(function() {
            lastGold = self.checkPrize($heroPrize.val());
            $(this).keyup(self.acceptGold);
        }).focusout(function() {
            var v;
            $(this).off('keydown', self.acceptGold);
            if (self.$.find('.acceptMoney').is(':hover')) return;
            if (lastGold == 0) {
                v = ''
                self.acceptBtnDeactive();
            } else {
                v = lastGold;
                self.acceptBtnActive();
            }
            $(this).val(v);
        }).tip(tip, 't_static');
    };

    this.acceptBtnActive = function() {
        this.$.find('.acceptMoney').addClass('active');
    };

    this.acceptBtnDeactive = function() {
        this.$.find('.acceptMoney').removeClass('active');
    };

    this.createButAcceptGold = function() {
        var tip = self.tLang('press_enter');
        var $bck = tpl.get('add-bck');
        var $but = tpl.get('button').addClass('green').tip(tip);
        this.$.find('.info').append($but);
        $but.append($bck);
        $but.click(function() {
            self.acceptGold();
        }).addClass('small acceptMoney');
    };

    this.acceptGold = function(event) {
        var myGold = self.checkPrize(self.$.find('.hero-prize').val());
        var pPrice = myGold == 0 ? 0 : parsePrice(myGold);

        if (!checkParsePriceValueIsCorrect(pPrice)) return;

        var task = 'trade&a=gold&val=' + pPrice;
        var k;
        if (event) k = event.keyCode;
        if (event) {
            if (lastGold != myGold) {
                self.acceptBtnDeactive();
            } else {
                self.acceptBtnActive();
            }
        }
        if (!event || k == 13) {
            _g(task, function() {
                lastGold = myGold;
                self.$.find('.hero-prize').blur();
            });
        }
    };

    this.tradeAccept = function() {
        if (checkBlockAccept()) return;
        if (hAccept) {
            _g('trade&a=noaccept');
            return;
        }
        var oGold = self.checkPrize(parsePrice(self.$.find('.other-prize').attr('data-prize')));
        var hGold = self.checkPrize(parsePrice(self.$.find('.hero-prize').attr('data-prize')));
        var buy = [];
        var sell = [];
        for (var k in list) {
            var o = list[k];
            if (o.kind === 'sell') sell.push(k);
            if (o.kind === 'buy') buy.push(k);
        }
        _g('trade&a=accept&buy=' +
            oGold + self.formTab(buy) +
            '&sell=' + hGold +
            self.formTab(sell));
    };

    this.formTab = function(tab) {
        var str = tab.toString();
        if (str != "") str = ',' + str;
        return str;
    };

    this.addButton = function(name, cl, click) {
        var $but = tpl.get('button').addClass(cl);
        this.$.find('.buttons').append($but);
        $but.find('.label').text(_t(name, null, 'trade'));
        $but.click(function() {
            click();
        }).addClass(name + '-trade');
    };

    this.buttonState = function(hA, oA) {
        var hAcceptB = this.$.find('.accept-trade').find('.label');
        var tLang = hA ? 'refuse' : 'accept';
        hAcceptB.text(this.tLang(tLang));
        this.decision('hero', hA);
        this.decision('other', oA);
    };

    this.decision = function(who, accept) {
        var result = this.$.find('.' + who + '-result');
        var dec = accept ? 'accept' : 'refuse';
        result.html(this.tLang(who + '-' + dec));
        accept ? result.addClass('accept') : result.removeClass('accept');
        who == 'hero' ? hAccept = accept : oAccept = accept;
    };

    this.hide = function() {
        //this.$.removeClass('active');
        //var te = whichTransitionEvent();
        //te && this.$[0].addEventListener(te, function () {
        // Engine.items.removeCallback('s', self.newTradeItem);
        // Engine.items.removeCallback('t', self.newTradeItem);

        Engine.items.removeCallback(Engine.itemsFetchData.NEW_TRADE_ITEM_S);
        Engine.items.removeCallback(Engine.itemsFetchData.NEW_TRADE_ITEM_T);

        self.refreshLoc();
        list = null;
        Engine.trade = false;
        Engine.lock.remove('trade');
        this.$.remove();
        //delete self;
        //}, false);
    };

    this.tradeState = function(hA, oA) {
        if (hA || oA) {
            this.countTItem();
            this.setTAmount();
            this.setGold()
        }
        if (!hA && hAccept || !oA && oAccept) {
            this.countTItem();
            // this.isChangeSomething();
        }
    };

    this.countTItem = function() {
        countT = 0;
        for (var k in list)
            if (list[k].data[k].loc == 't')
                countT++;
    };

    // this.isChangeSomething = function () {
    // 	var hGold = self.checkPrize(parsePrice(self.$.find('.hero-prize').val()));
    // 	var oGold = parsePrice(self.$.find('.other-prize').html());
    // 	if (aGoldValue['h'] != hGold ||
    // 		aGoldValue['o'] != oGold ||
    // 		countT != acceptAmount) {
    // 		message(this.tLang('trade_terms_changed'));
    // 		aGoldValue['h'] = 0;
    // 		aGoldValue['o'] = 0;
    // 		acceptAmount = 0;
    // 	}
    // };

    this.setTAmount = function() {
        if (acceptAmount) return;
        acceptAmount = countT;
    };

    this.setGold = function() {
        if (aGoldValue['h'] || aGoldValue['o']) return;
        aGoldValue['h'] = self.checkPrize(parsePrice(self.$.find('.hero-prize').val()));
        aGoldValue['o'] = parsePrice(self.$.find('.other-prize').html());
    };

    this.closeTrade = function(val) {
        tradeSuccess = val.myaccept == 1 && val.accept == 1;
        this.hide();
    };

    this.checkPrize = function(val) {
        if (val == '') return 0;
        else return val;
    };

    this.theLowestSlot = function(kind) {
        for (var i = 0; i < 10; i++) {
            var exist = false;
            for (var key in list) {
                if (list[key].kind != kind) continue;
                if (list[key].slot == i) {
                    exist = true;
                    break;
                }
            }
            if (!exist) return i;
        }
    };

    this.setSellItem = function(item) {
        const confirmationQueue = new ConfirmationQueue.default();

        confirmationQueue
            .addCondition(() => checkPersonalItems(item), _t('personal-item-confirm2')) // personal item
            .processConditions(() => {
                _g('trade&a=add&tid=' + item.id);
            });
    };
    this.setShowItem = function(item) {
        _g('trade&a=add&sid=' + item.id);
    };

    this.kindOfItem = function(who, loc) {
        if (who == 'hero' && loc == 's')
            return 'show';
        if (who == 'other' && loc == 's')
            return 'watch';
        if (who == 'hero' && loc == 't')
            return 'sell';
        if (who == 'other' && loc == 't')
            return 'buy';
    };

    this.createData = function(d) {
        var data = {
            cl: d.cl,
            icon: d.icon,
            loc: d.loc,
            name: d.name,
            own: d.own,
            pr: d.pr,
            prc: d.prc,
            st: d.st,
            stat: d.stat,
            x: d.x,
            y: d.y,
            unbindCost: d.unbindCost,
            enhancementPoints: d.enhancementPoints,
            salvageItems: d.salvageItems
        };
        var nD = {};
        nD[d.id] = data;
        return nD;
    };

    this.newTradeItem = function(data) {
        var idHero = Engine.hero.d.id;
        var loc = data.loc;
        var viewName = data.loc === 't' ? Engine.itemsViewData.TRADE_ITEM_T_VIEW : Engine.itemsViewData.TRADE_ITEM_S_VIEW;
        var $e = Engine.items.createViewIcon(data.id, viewName)[0];
        var who = data.own == idHero ? 'hero' : 'other';
        var multiplier = loc == 't' ? 35.4 : 70.8;
        var kind = self.kindOfItem(who, loc);
        var slot = self.theLowestSlot(kind);
        var top = 2;
        var newData = self.createData(data);

        list[data.id] = {};
        list[data.id].$ = $e;
        list[data.id].slot = slot;
        list[data.id].kind = kind;
        list[data.id].data = newData;
        if (slot > 4) {
            top = 38;
            slot -= 5;
        }
        $e.css({
            'left': (1 + slot * multiplier),
            'top': top
        });

        //if (data.hasMenu)
        $e.css('cursor', `url(../img/gui/cursor/5n.png?v=${__build.version}), auto`);

        self.$.find('.' + who + '-' + kind + '-item').append($e);
        self.tradeItemClick(data, who, $e);

    };

    this.tradeItemClick = function(data, who, $icon) {
        //var $item = data.$;
        if (who == 'hero') self.yourItemEvents(data, $icon);
        else self.otherItemEvents(data, $icon);
    };

    this.yourItemEvents = function(data, $item) {
        //if (mobileCheck()) {
        //	$item.click(function (e) {
        //		if (data.hasMenu) self.moveEvent(e, data);
        //		else 							self.actionAfterClick(data);
        //	});
        //} else {
        $item.click(function() {
            self.actionAfterClick(data);
        });
        $item.contextmenu(function(e, mE) {
            self.moveEvent(getE(e, mE), data);
            //e.preventDefault();
        });
        //}
    };

    this.otherItemEvents = function(data, $item) {
        //if (mobileCheck()) {
        //	if (!data.hasMenu) return;
        //	$item.click(function (e) {
        //		data.createOptionMenu(e, false, {canPreview:true});
        //	});
        //} else {
        $item.contextmenu(function(e, mE) {
            data.createOptionMenu(getE(e, mE), false);
            //e.preventDefault();
        });
        //}
    };

    this.moveEvent = function(e, data) {
        var o = {
            txt: _t('move', null, 'item'),
            f: function() {
                self.actionAfterClick(data);
            }
        };
        data.createOptionMenu(e, o);
    };

    this.actionAfterClick = function(data) {
        var sOrT = data.loc == 't' ? 'tid' : 'sid';
        _g('trade&a=del&' + sOrT + '=' + data.id, function() {
            self.removeTradeItem(data.id);
        });
    };

    this.refreshLoc = function() {
        for (var id in list) {
            var o = list[id].data[id];
            self.refreshOneLoc(o, 's', id);
            if (!tradeSuccess) self.refreshOneLoc(o, 't', id);
        }
    };

    this.refreshOneLoc = function(o, loc, id) {
        if (o.loc != loc) return;
        if (o.own != Engine.hero.d.id) {
            Engine.items.deleteItem(id);
        } else {
            // o.loc = 'g';
            o.loc = Engine.itemsFetchData.NEW_EQUIP_ITEM.loc;
            Engine.items.updateDATA(list[id].data);
        }
    };

    this.removeTradeItem = function(id) {
        if (isset(list[id])) {
            list[id].$.remove();
            delete list[id];
        }
    };

    this.closeOtherWindows = () => {
        const v = Engine.windowsData.windowCloseConfig.TRADE;
        Engine.windowCloseManager.callWindowCloseConfig(v);
    }

    this.tLang = function(name, params = null) {
        return _t(name, params, 'trade');
    };

    //this.init();

};