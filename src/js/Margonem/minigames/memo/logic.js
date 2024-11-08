// var Window = require('core/Window');
module.exports = function(loaderInstance) {
    var self = this;
    var showedTime = 0x3E8;
    this.name = null;
    this.initData = null;
    this.image = null;
    this.window = null;
    this.wnd = null;
    this.remainingTime = null;
    this.remainintTimeInterval = null;
    this.$attempText = null;
    this.$itemList = null;
    this.objects = [];
    this.discoveredCards = 0;

    this.addElementToMap = function($map, id) {
        var item = $("<div>").addClass("memoCard cardBack");
        item.click(function() {
            self.checkCardId(item, id);
        });
        item.appendTo($map);
        return item;
    };

    this.checkCardId = function(el, id) {
        if (el.hasClass("cardFront") || el.hasClass("cardBlank"))
            return;
        if (!self.isLocked) {
            loaderInstance.task({
                'c': 'check',
                'id': id
            });
        }
    };

    this.cardIdToPosition = function(id) {
        var x = id % 6;
        var y = (id - x) / 6;
        var rx = x * 64 + (x + 1);
        var ry = y * 64 + (y + 1);
        return "-" + rx + "px -" + ry + "px";
    };

    this.coverAllCards = function(e1) {
        for (var t in self.objects) {
            var o = self.objects[t];
            if (o.hasClass("cardBack") || o.hasClass("cardBlank")) {
                continue;
            }
            o.clearQueue().empty().removeClass("cardFront");
            o.addClass("cardBack");
        }
        self.discoveredCards = 0;
    };

    this.updateCard = function(obj) {
        var idx = obj.id;
        var command = obj.c;
        var $el = self.objects[idx];
        switch (command) {
            case "d":
                $el.empty().removeClass("cardBack");
                $el.addClass("cardFront cardBlank");
                break;
            case "d2":
                $el.clearQueue().addClass("cardBlank");
                $el.delay(1000).queue(function(n) {
                    $(this).empty().removeClass("cardBack");
                    $(this).addClass("cardFront");
                    n();
                });
                break;
            case "b":
                $el.clearQueue().delay(showedTime).queue(function(n) {
                    $(this).empty().removeClass("cardFront");
                    $(this).addClass("cardBack");
                    n();
                });
                break;
            case "s":
                $el.removeClass("cardBack");
                $el.addClass("cardFront");
                var $symbol = $("<div>").addClass("cardSymbol");
                var posImg = self.cardIdToPosition(obj.src);
                $symbol.css("background-position", posImg);
                $el.empty().append($symbol);
                self.discoveredCards++;
                break;
        }
    };

    this.timerTick = function($timer) {
        --self.remainingTime;
        $timer.html(self.remainingTime + 's')
        if (self.remainingTime <= 0) {
            loaderInstance.task({
                'c': 'endGame'
            });
            clearInterval(self.remainintTimeInterval);
        }
    }

    this.init = function() {
        Engine.lock.add('minigames');
        self.window = $("<div>").attr('id', 'memocard');
        var $gameWrapper = $("<div>").addClass("gameWrapper").appendTo(self.window);
        var $timer = $("<div>").addClass("timer").appendTo($gameWrapper);
        var $itemMap = $("<div>").addClass("itemMap").appendTo($gameWrapper);
        var $infoGame = $("<div>").addClass("infoGame").appendTo($gameWrapper);
        var infoGameHeaderStr = _t("memo_info_header", null, "minigames");
        var infoGameContentStr = _t("memo_info_content", null, "minigames");
        $("<div>").addClass("infoGameHeader").html(infoGameHeaderStr).appendTo($infoGame);
        $("<div>").addClass("infoGameContent").html(infoGameContentStr).appendTo($infoGame);
        self.objects = [];
        var restOfDiv = self.initData.cols - 1;
        for (var t = 0; t < self.initData.objects; t++) {
            var o = self.addElementToMap($itemMap, t);
            if (t % (self.initData.cols) == restOfDiv) {
                $("<br>").appendTo($itemMap);
            }
            self.objects.push(o);
        }
        if (isset(self.initData.showedTime)) {
            showedTime = self.initData.showedTime;
        }
        self.remainingTime = self.initData.time;
        $timer.html(self.remainingTime + 's')
        self.remainintTimeInterval = setInterval(function() {
            self.timerTick($timer);
        }, 1000);

        // this.wnd = new Window({
        // 	content: this.window,
        // 	title: _t('memo_title', null, 'minigames'),
        // 	onclose: function () {
        // 		loaderInstance.task({'c': 'endGame'});
        // 	}
        // });
        // $('.alerts-layer').append(this.wnd.$);

        Engine.windowManager.add({
            content: self.window,
            //nameWindow        : 'memo',
            nameWindow: Engine.windowsData.name.MEMO_MINI_GAME,
            nameRefInParent: 'wnd',
            objParent: self,
            title: _t('memo_title', null, 'minigames'),
            onclose: () => {
                loaderInstance.task({
                    'c': 'endGame'
                });
            }
        });

        self.wnd.addToAlertLayer();
        self.wnd.center();
        self.unlock();
    };

    this.run = function() {
        this.init();
        self.checkStatus(self.initData);
    };

    this.endGame = function() {
        clearInterval(self.remainintTimeInterval);
        self.wnd.fadeAndRemove();
        loaderInstance.game = null;
        loaderInstance.endGame();
        Engine.lock.remove('minigames');
    };

    this.checkStatus = function(msg) {
        if (self.discoveredCards >= 2) {
            self.coverAllCards();
        }
        if (isset(msg.cards)) {
            for (var t in msg.cards) {
                self.updateCard(msg.cards[t]);
            }
        }
        if (isset(msg.time)) {
            self.remainingTime = msg.time;
        }
        if (isset(msg.end))
            return self.endGame();
    };

    this.parseMessage = function(msg) {
        switch (msg.t) {
            case 'check':
                self.checkStatus(msg);
                break;
            case 'error':
                mAlert(_t("memo_err_" + msg.msg, null, "minigames"));
                break;
            case 'quit':
                self.endGame();
                break;
        }
    };

    this.lock = function() {
        self.isLocked = true;
    };

    this.unlock = function() {
        self.isLocked = false;
    };

    return this;
}