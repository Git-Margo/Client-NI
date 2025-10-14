// var Window = require('@core/Window');
module.exports = function(loaderInstance) {
    this.initData = null;
    this.name = 'mastermind';
    this.isLocked = true;
    this.l = loaderInstance;
    this.files = [];
    this.steps = 0;
    this.remainingTime = null;
    this.remainingTimeInterval = null;
    this.marked = {};
    this.wnd = null;
    var self = this;
    this.init = function() {
        Engine.lock.add('minigames');
        this.window = $(document.createElement('div')).attr('id', 'mastermind');
        //UÅÃ³Å¼ tajny kod! Kieruj siÄ podpowiedziami:<br />- A - liczba kolorÃ³w na wÅaÅciwych miejscach.<br />- B - liczba dobrze wybranych kolorÃ³w na, ale na niewÅaÅciwych miejscach.<br />- C - iloÅÄ pozostaÅych prÃ³b uÅoÅ¼enia kodu.
        //Liczba kolorÃ³w na wÅaÅciwych miejscach
        //Liczba dobrze wybranych kolorÃ³w, ale na niewÅaÅciwych miejscach
        //IloÅÄ pozostaÅych prÃ³b uÅoÅ¼enia kodu
        this.window.append('<div class="gameWrapper"><div class=gameinfo>' + _t('mastermind_infotxt', null, 'minigames') + '</div><div class="timer"></div><div class="colorMatrix"></div><div class="attemptListWrapper"><div class="attemptList" id="mastermindAttemptList"></div><div class="scrollButton up"></div><div class="scrollButton down"></div></div><div class="infoPanel"><div class="infoA" tip="' + _t('masterming_infoA_tip', null, 'minigames') + '"><span></span></div><div class="infoB" tip="' + _t('mastermind_infoB_tip', null, 'minigames') + '"><span></span></div><div class="infoC" tip="' + _t('mastermind_infoC_tip', null, 'minigames') + '"><span>' + self.initData.tries + '</span></div><div class="sendButton">' + _t('open') + '</div></div></div>')
        this.window.find('.gameWrapper').css('background', 'url(js/Margonem/minigames/' + this.name + '/img/' + this.initData.files.list.bg + ') no-repeat');
        for (var i = 0; i < this.initData.colors.length; i++) {
            for (var j = 0; j < this.initData.columns; j++) {
                var box = $(document.createElement('div')).addClass('cBox ' + this.initData.colors[i] + ' col' + j).attr('box', this.initData.colors[i] + '_' + j).css({
                    top: i * 29,
                    left: j * 29,
                    opacity: 0.4
                });
                this.window.find('.colorMatrix').append(box);
            }
        }
        this.remainingTime = this.initData.time - 5;
        this.window.find('.timer').html(self.remainingTime + 's');
        this.remainintTimeInterval = setInterval(function() {
            --self.remainingTime
            self.window.find('.timer').html(self.remainingTime + 's');
            if (self.remainingTime <= 0) {
                self.l.task({
                    'c': 'endGame'
                });
                clearInterval(self.remainintTimeInterval);
            }
        }, 1000);
        this.window.find('.colorMatrix .cBox').click(function() {
            if (this.isLocked) return false;
            var box = $(this).attr('box').split('_');
            $('#mastermind .cBox.col' + box[1]).removeClass('active').css('opacity', 0.4);;
            $(this).addClass('active').css('opacity', 1);
            self.marked[box[1]] = box[0];
        });
        this.window.find('.infoPanel .sendButton').click(function() {
            if (!self.isLocked) self.l.task({
                c: 'check',
                data: self.marked
            });
        });
        $('#centerbox').append(this.window);
        for (i = 0; i < this.initData.attempts.length; i++) {
            this.addStep(this.initData.attempts[i]);
        }
        this.window.find('.attemptListWrapper .scrollButton').on('click', function() {
            $('#mastermind .attemptList').scrollTop($('#mastermind .attemptList').scrollTop() + ($(this).hasClass('up') ? -10 : 10));
        });
        this.window.find('.attemptList').on('mousewheel', function(e) {
            var pos = e.wheelDelta == undefined ? (e.detail < 0 ? 10 : -10) : (e.wheelDelta < 0 ? 10 : -10);
            $('#mastermind .attemptList').scrollTop($('#mastermind .attemptList').scrollTop() + (pos));
        });


        // this.wnd = new Window({
        // 	content: this.window,
        // 	title: _t('mastermind_title', null, 'minigames'),
        // 	onclose: function () {
        // 		self.l.task({'c': 'endGame'});
        // 	}
        // });
        // $('.alerts-layer').append(this.wnd.$);


        Engine.windowManager.add({
            content: this.window,
            //nameWindow        : 'mastermind',
            nameWindow: Engine.windowsData.name.MASTERMIND_MINI_GAME,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('mastermind_title', null, 'minigames'),
            onclose: () => {
                self.l.task({
                    'c': 'endGame'
                });
            }
        });

        this.wnd.addToAlertLayer();
        this.wnd.center();
        this.unlock();
    };

    this.parseMessage = function(msg) {
        switch (msg.t) {
            case 'check':
                this.window.find('.infoPanel .infoA span').text(msg.step.g);
                this.window.find('.infoPanel .infoB span').text(msg.step.b);
                this.window.find('.infoPanel .infoC span').text(msg.tries);
                this.addStep(msg.step);
                this.checkStatus(msg.s);
                break;
            case 'error':
                mAlert(msg.msg);
                break;
            case 'quit':
                this.endGame();
                break;
        }
    };
    this.checkStatus = function(s) {
        if (s > 1) this.endGame();
    };
    this.addStep = function(step) {
        var html = '<div class="attempt"><span>' + _t('attempt') + ' ' + (++this.steps) + '</span>';
        for (var i in step.c) {
            html += '<div class="mini_cBox ' + step.c[i] + '"></div>';
        }
        html += '<div class="step_info"><span>B: ' + step.b + '</span></div><div class="step_info"><span>A: ' + step.g + '</span></div><div style="clear:both;"></div></div>';
        this.window.find('.attemptList').append(html);
        if (this.steps > 5) $('#mastermind .scrollButton').css({
            display: 'block'
        });
        setTimeout(function() {
            self.window.find('.attemptList').scrollTop(1000)
        }, 50);
    };
    this.run = function() {
        this.init();
    };

    const onClear = () => {
        clearInterval(self.remainintTimeInterval);
        this.wnd.fadeAndRemove();
        Engine.lock.remove('minigames');
    }
    this.endGame = function() {
        // clearInterval(self.remainintTimeInterval);
        // this.wnd.fadeAndRemove();
        // this.l.game = null;
        // Engine.lock.remove('minigames');
        onClear();
        this.l.game = null;
        this.l.endGame();
    };
    this.lock = function() {
        this.isLocked = true;
    };
    this.unlock = function() {
        this.isLocked = false;
    }

    this.onClear = onClear;
};