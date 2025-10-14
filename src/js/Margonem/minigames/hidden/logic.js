module.exports = function(loaderInstance) {
    var self = this;
    this.name = null;
    this.initData = null;
    this.window = null;
    this.wnd = null;
    this.remainingTime = null;
    this.timeToUseHint = null;
    this.timeInterval = null;
    this.$attemptText = null;
    this.$itemList = null;
    this.$board = null;
    this.$hint = null;
    this.$hintContainer = null;
    this.$timerText = null;
    this.$waitingScreen = null;
    this.waitingInv = null;
    var canvasContext = null;
    var boardBackground = null;
    var itemImages = [];

    this.run = function() {
        this.init();
        self.checkStatus(self.initData);
    };

    this.init = function() {
        Engine.lock.add('minigames');
        boardBackground = null;
        itemImages = [];
        self.remainingTime = self.initData.time;

        self.createUI();
        self.lock();

        self.loadBoardImage();
        self.createBoardElements();
        self.startTimeLoop();

        $('#centerbox').append(self.window);
    };

    this.close = function() {
        loaderInstance.task({
            'c': 'endGame'
        });
    };

    this.updateElements = function(tab) {
        self.$itemList.empty();
        tab.sort(function(a, b) {
            return a.length - b.length;
        });

        for (var t in tab) {
            var text = tab[t];
            var $span = $("<div>").addClass("itemName");
            $span.text(text);
            $span.tip(text);
            self.$itemList.append($span);
        }
    };

    this.boardClick = function(e) {
        if (!self.isLocked) {
            self.checkPosition(e.offsetX, e.offsetY);
        }
    };

    this.updateBoard = function() {
        self.drawBackground();

        for (var t in self.initData.objects) {
            var o = self.initData.objects[t];
            self.drawItem(o);
        }
    };

    const onClear = () => {
        clearInterval(self.timeInterval);
        self.wnd.fadeAndRemove();
        Engine.lock.remove('minigames');
    }

    this.endGame = function() {
        // clearInterval(self.timeInterval);
        // self.wnd.fadeAndRemove();
        // Engine.lock.remove('minigames');
        onClear();
        loaderInstance.endGame();
    };

    //Items

    this.createBoardElements = function() {
        for (var t in self.initData.objects) {
            var o = self.initData.objects[t];
            self.loadItem(o);
        }
    };

    this.loadItem = function(obj) {
        if (isset(itemImages[obj.src]))
            return;
        itemImages[obj.src] = null;
        Engine.imgLoader.onload(self.getItemUrl(obj), false, false, (i) => {
            itemImages[obj.src] = {
                image: i,
                width: i.width,
                height: i.height
            };
            self.onItemLoaded();
        });
    };

    this.drawItem = function(obj) {
        if (!isset(itemImages[obj.src]))
            return;
        var d = itemImages[obj.src];
        var sourceWidth = d.width * (obj.size[2] / obj.size[0]);
        var sourceHeight = d.height * (obj.size[3] / obj.size[1]);
        canvasContext.drawImage(d.image,
            -obj.size[4], -obj.size[5],
            sourceWidth, sourceHeight,
            obj.pos[0], obj.pos[1],
            obj.size[2], obj.size[3]
        );
    };

    this.createItemInHTML = function(obj) {
        var item = $("<div>").addClass("hiddenObject").appendTo(self.$board);
        item.css({
            left: obj.pos[0],
            top: obj.pos[1],
            backgroundSize: obj.size[0] + 'px ' + obj.size[1] + 'px',
            width: obj.size[2],
            height: obj.size[3],
            backgroundPosition: obj.size[4] + 'px ' + obj.size[5] + 'px',
            backgroundImage: 'url("' + self.getItemUrl(obj) + '")'
        });
        return item;
    };

    this.getItemUrl = function(obj) {
        return CFG.a_imgpath + obj.src;
    };

    // Board
    this.loadBoardImage = function() {
        var url = self.getBoardUrl();
        Engine.imgLoader.onload(url, false, false, (i) => {
            boardBackground = i;
            self.onBoardLoaded();
        });
    };

    this.drawBackground = function() {
        if (boardBackground === null)
            return;
        canvasContext.drawImage(boardBackground,
            self.initData.image[1], self.initData.image[2],
            boardBackground.width, boardBackground.height);
    };

    this.getBoardUrl = function() {
        return "js/Margonem/minigames/" + self.initData.name + "/img/map/" + self.initData.image[0];
    };

    // Image loader
    this.onBoardLoaded = function() {
        if (self.isAllItemsLoaded())
            self.onAllImageLoaded();
    };

    this.onItemLoaded = function() {
        if (self.isAllItemsLoaded() && boardBackground !== null)
            self.onAllImageLoaded();
    };

    this.isAllItemsLoaded = function() {
        for (var t in itemImages) {
            if (itemImages[t] === null)
                return false;
        }
        return true;
    };

    this.onAllImageLoaded = function() {
        self.updateBoard();
        self.unlock();
    };

    // UI
    this.createElementWithContainer = function(tag, classname) {
        var container = $("<div>").addClass(classname + "Container");
        var content = $(tag).addClass(classname).appendTo(container);
        return {
            container: container,
            content: content
        };
    };

    this.createUITimer = function($content) {
        var timer = self.createElementWithContainer("<div>", "timer");
        timer.container.appendTo($content);
        self.$timerText = timer.content;
    };

    this.createUIBottom = function($content) {
        var bottom = self.createElementWithContainer("<div>", "bottom");
        bottom.container.appendTo($content);

        var $helpMessage = $("<div>").addClass("helpMessage").prependTo(bottom.container);
        $helpMessage.text(_t("hiddenobject_infotxt", null, "minigames"));

        var hint = $("<input>").addClass("hintButton").attr("type", "button");
        hint.prependTo(bottom.container);
        hint.on('click', self.getHint);
        self.$hintText = hint;
        self.timeToHint(true);

        var attemptText = self.createElementWithContainer("<div>", "attemptText");
        attemptText.container.addClass("block").prependTo(bottom.container);
        self.$attemptText = attemptText.content;

        var helpText = self.createElementWithContainer("<div>", "helpText");
        helpText.container.addClass("block").prependTo(bottom.container);
        helpText.content.text(_t("hiddenobject_info_header", null, "minigames"));

        bottom.content.addClass("itemsList");
        self.$itemList = bottom.content;
    };

    this.createUIBoard = function($content) {
        var board = self.createElementWithContainer("<div>", "board");
        board.container.appendTo($content);
        self.$hintContainer = $("<div>").addClass("hintContainer");
        self.$hintContainer.appendTo(board.container);
        self.$board = board.content;
        self.$board.click(self.boardClick);

        var $canvas = $("<canvas>").addClass("boardBackground");
        $canvas[0].width = 480;
        $canvas[0].height = 300;
        canvasContext = $canvas[0].getContext('2d');
        self.$board.append($canvas);
    };

    this.createUI = function() {
        self.window = $("<div>").attr('id', 'hiddenobject');
        var $content = $("<div>").addClass("gameWrapper").appendTo(self.window);
        self.createUITimer($content);
        self.createUIBoard($content);
        self.createUIBottom($content);

        Engine.windowManager.add({
            content: this.window,
            nameWindow: Engine.windowsData.name.HIDDEN_MINI_GAME,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('hidden_title', null, 'minigames'),
            onclose: () => {
                self.close();
            }
        });

        self.$waitingScreen = $("<div>").addClass("waiting").appendTo($content);
        var waitingScreenGrid = $("<div>").addClass("grid").appendTo(self.$waitingScreen);
        $("<div>").addClass("img").appendTo(waitingScreenGrid);

        self.wnd.addToAlertLayer();
        self.wnd.center();
    };

    // Timer
    this.startTimeLoop = function() {
        self.$timerText.html(self.remainingTime + 's');
        self.timeInterval = setInterval(function() {
            self.timeToHint();
            self.showRemainingTime();
            if (self.remainingTime <= 0) {
                self.timeToHint(true);
                self.close();
                clearInterval(self.timeInterval);
            }
        }, 1000);
    };

    this.showRemainingTime = function() {
        --self.remainingTime;
        self.$timerText.html(self.remainingTime + 's');
    };

    // Hint

    this.getHint = function() {
        if (!self.isLocked) {
            loaderInstance.task({
                'c': 'hint'
            });
        }
    };

    this.timeToHint = function(clear) {
        if (self.timeToUseHint == -1) {
            self.$hintText.val(_t("hint", null, "minigames"));
            self.$hintText.addClass("disable");
        } else if (self.timeToUseHint == 0) {
            self.$hintText.val(_t("hint", null, "minigames"));
            self.$hintText.removeClass("disable");
        } else {
            var seconds = Math.round(Math.abs(self.timeToUseHint));
            var str = seconds + " s";
            self.$hintText.val(_t("hint_timer %val%", {
                "%val%": str
            }, "minigames"));
            self.$hintText.addClass("disable");
        }
        if (!clear && self.timeToUseHint > 0) {
            --self.timeToUseHint;
        }
    };

    this.highlightObject = function(id) {
        self.removeHint();
        if (isset(self.initData.objects[id])) {
            var el = self.initData.objects[id];
            self.highlightElement(el);
        }
    };

    this.animateHint = function(element, pos, offset, size) {
        var animOpt = {
            top: pos[1] + offset,
            left: pos[0] + offset,
            width: size,
            height: size
        };
        element.animate(animOpt, 500, "linear");
        if ($.fx.off) {
            element.delay(500);
        }
    };

    this.highlightElement = function(el) {
        var maxFactor = 1.5;
        var minFactor = 0.5;
        var repeat = 5;
        var origSize = Math.min(el.size[2], el.size[3]);
        var size = self.getCircleSizeByRect(origSize * maxFactor);
        var minSize = self.getCircleSizeByRect(origSize * minFactor);
        var offset = self.getCircleOffsetToCenter(size, origSize);
        var minOffset = self.getCircleOffsetToCenter(minSize, origSize);
        var pos = el.pos;
        self.$hint = $("<div>").addClass("hintObject");
        self.$hint.css({
            top: pos[1] + offset,
            left: pos[0] + offset,
            width: size + 'px',
            height: size + 'px'
        });
        self.$hint.appendTo(self.$hintContainer);
        for (var i = 0; i < repeat; i++) {
            self.animateHint(self.$hint, pos, minOffset, minSize);
            self.animateHint(self.$hint, pos, offset, size);
        }
        self.animateHint(self.$hint, pos, minOffset, minSize);
        self.$hint.fadeOut(200, function() {
            self.$hint.remove();
            self.$hint = null;
        });
    };

    this.getCircleSizeByRect = function(a) {
        return Math.sqrt(2 * (a * a)) * 128 / 120;
    };

    this.getCircleOffsetToCenter = function(circleSize, rectSize) {
        return -((circleSize / 2) - (rectSize / 2));
    };

    this.removeHint = function() {
        if (self.$hint == null) {
            return;
        }
        var $el = self.$hint;
        self.$hint = null;
        $el.clearQueue("fx").fadeOut(200, function() {
            $el.remove();
        });
    };

    //soemthing

    this.removeObject = function(objectsId) {
        var obj = self.initData.objects[objectsId];
        if (isset(obj)) {
            self.createItemInHTML(obj).fadeOut("fast", function() {
                self.removeHint();
                $(this).remove();
            });
            self.initData.objects.splice(objectsId, 1);
            self.updateBoard();
        }
    };

    // communication

    this.checkStatus = function(msg) {
        if (isset(msg.removeObj)) {
            self.removeObject(msg.removeObj);
        }
        if (isset(msg.clicks) && isset(msg.maxTry)) {
            var attempStr = _t("hiddenobject_attemp %val%/%val2%", {
                "%val%": msg.clicks,
                "%val2%": msg.maxTry
            }, "minigames");
            self.$attemptText.text(attempStr);
        }
        if (isset(msg.elements)) {
            self.updateElements(msg.elements);
        }
        if (isset(msg.hint)) {
            self.highlightObject(msg.hint, self.hintTimes);
        }
        if (isset(msg.timeToUseHint)) {
            self.timeToUseHint = msg.timeToUseHint;
            self.timeToHint(true);
        }
        if (isset(msg.time)) {
            self.remainingTime = msg.time;
        }
        if (isset(msg.msg)) {
            var str = _t("hiddenobject_message_" + msg.msg, null, "minigames");
            message(str);
        }
        if (isset(msg.end)) {
            return self.endGame();
        }
    };

    this.checkPosition = function(x, y) {
        loaderInstance.task({
            'c': 'check',
            't': y,
            'l': x
        });
    };

    this.parseMessage = function(msg) {
        switch (msg.t) {
            case 'check':
                self.checkStatus(msg);
                break;
            case 'error':
                mAlert(msg.msg);
                break;
            case 'quit':
                self.endGame();
                break;
        }
    };

    //lock

    this.lock = function() {
        self.isLocked = true;
        self.showWaiting();

    };

    this.unlock = function() {
        self.isLocked = false;
        self.hideWaiting();
    };

    //spinner

    this.showWaiting = function() {
        if (self.waitingInv !== null) {
            clearTimeout(self.waitingInv);
        }
        self.waitingInv = setTimeout(function() {
            self.$waitingScreen.fadeIn('fast').delay(100);
            self.waitingInv = null;
        }, 300);
    };

    this.hideWaiting = function() {
        if (self.waitingInv !== null) {
            clearTimeout(self.waitingInv);
        }
        self.waitingInv = null;
        self.$waitingScreen.fadeOut('fast');
    };

    this.onClear = onClear;

    return this;
};