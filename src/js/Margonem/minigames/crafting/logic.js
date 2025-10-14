// var Window = require('@core/Window');
var Templates = require('@core/Templates');

module.exports = function(loaderInstance) {
    this.initData = null;
    this.name = 'crafting';
    this.isLocked = true;
    this.l = loaderInstance;
    this.remainingTime = null;
    this.remainingTimeInterval = null;
    this.infobox = null;
    this.wnd = null;
    var self = this;
    this.init = function() {
        Engine.lock.add('minigames');
        this.infobox = $('<div>').attr('id', 'crafting-info');
        this.createInfoText();
        this.createImageSlot();
        this.createTimeLeft();
        this.createIndicator();
        this.startTimer();

        Engine.windowManager.add({
            content: this.infobox,
            nameWindow: Engine.windowsData.name.CRAFTING_MINI_GAME,
            type: Engine.windowsData.type.TRANSPARENT,
            nameRefInParent: 'wnd',
            objParent: this,
            title: '',
            closeable: false,
            onclose: () => {
                self.cancelGame();
            }
        });

        this.wnd.$.addClass('crafting-game-window');
        this.wnd.addToAlertLayer();
        this.wnd.addControll(_t('stop', null, 'minigames'), 'small', () => {
            self.cancelGame();
        });
        this.wnd.center();

        this.unlock();
    };
    this.cancelGame = function() {
        self.l.task({
            'c': 'cancel'
        });
        clearInterval(self.remainingTimeInterval);
    };
    this.initTimer = function(time) {
        this.remainingTime = time;
        self.updateTimerView();
        if (this.remainingTimeInterval != null) {
            clearInterval(self.remainingTimeInterval);
        }
        this.remainingTimeInterval = setInterval(function() {
            --self.remainingTime;
            if (self.remainingTime >= 0) {
                self.updateTimerView();
            }
            if (self.remainingTime <= 0) {
                self.l.task({
                    'c': 'check'
                });
                clearInterval(self.remainingTimeInterval);
            }
        }, 1000);
    };

    this.run = function() {
        this.init();
    };

    const onClear = () => {
        Engine.lock.remove('minigames');
        clearInterval(self.remainingTimeInterval);
        this.infobox.remove();
        self.wnd.fadeAndRemove();
    }

    this.endGame = function() {
        // Engine.lock.remove('minigames');
        // clearInterval(self.remainingTimeInterval);
        // this.infobox.remove();
        // self.wnd.fadeAndRemove();
        onClear();
        this.l.endGame();
    };
    this.parseMessage = function(msg) {
        switch (msg.t) {
            case 'check':
                break;
            case 'quit':
                this.endGame();
                break;
        }
    };
    this.lock = function() {
        this.isLocked = true;
    };
    this.unlock = function() {
        this.isLocked = false;
    }

    this.startTimer = function() {
        if (this.initData.time <= 0) {
            self.l.task({
                'c': 'check'
            });
        } else {
            this.initTimer(this.initData.time);
        }
    };

    this.updateTimerView = function() {
        let percent = (self.initData.stime - self.remainingTime) / self.initData.stime;
        if (self.remainingTime == 0)
            percent = 1;
        const percentText = Math.floor(percent * 100) + '%';
        self.$timeLeft.text(self.remainingTime + 's');
        self.$indicator.css('width', (percent * 100) + '%');
        self.$indicatorText.text(percentText);
    };

    this.createIndicator = function() {
        var $indicatorContainer = $('<div>').addClass('indicator-container');
        this.$indicator = $('<div>').addClass('indicator');
        this.$indicatorText = $('<span>').addClass('progress-info');
        $indicatorContainer.append(this.$indicator);
        $indicatorContainer.append(this.$indicatorText);
        this.infobox.append($indicatorContainer);
    };

    this.createTimeLeft = function() {
        this.$timeLeft = $('<div>').addClass('time-left');
        this.infobox.append(this.$timeLeft);
    };

    this.createImageSlot = function() {
        var $slot = Templates.get('item-slot');
        var $img = $('<img>');
        $img.attr('src', `${cdnUrl}/${this.initData.i[1]}`);
        $slot.append($img);
        this.infobox.append($slot);
    };

    this.createInfoText = function() {
        const $infoText = $('<div>').addClass('info-text');
        $infoText.text(this.initData.i[0]);
        this.infobox.append($infoText);
    };

    this.onClear = onClear;
};