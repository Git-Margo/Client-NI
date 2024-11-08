/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function(loaderInstance) {
    this.initData = null;
    this.name = 'questions';
    this.isLocked = true;
    this.l = loaderInstance;
    this.remainingTime = null;
    this.remainingTimeInterval = null;
    var self = this;
    var wnd = null;
    this.init = function() {
        Engine.lock.add('minigames');

        var aux = '<div class="input-wrapper"><input class=default placeholder="..." /></div>';
        var click = false;
        var callbacks = [{
                txt: _t('ok', null, 'buttons'),
                callback: function() {
                    if (click) return;
                    click = true;
                    self.l.task({
                        'c': 'check',
                        a: wnd.$.find('input').val()
                    });
                    return true;
                }
            },
            {
                txt: _t('cancel', null, 'buttons'),
                callback: function() {
                    if (click) return;
                    click = true;
                    self.l.task({
                        'c': 'endGame'
                    });
                    return true;
                }
            }
        ];

        mAlert(parseContentBB(this.initData.q) + '<br />' + _t('questions_time', null, 'minigames') + aux, callbacks, function(w) {
            wnd = w;
            wnd.$.addClass('askAlert');
            wnd.$.addClass('no-exit-button');
            wnd.$.width(300);
            if (!mobileCheck()) wnd.$.find('.input-wrapper > input').focus();
        });
        this.remainingTime = this.initData.time - 5;
        this.remainingTimeInterval = setInterval(function() {
            --self.remainingTime;
            wnd.$.find('.timer').html(self.remainingTime + 's');
            if (self.remainingTime <= 0) {
                self.l.task({
                    'c': 'endGame'
                });
                wnd.fadeAndRemove();
                clearInterval(self.remainingTimeInterval);
                Engine.lock.remove('minigames');
            }
        }, 1000);
        this.unlock();
    };

    this.run = function() {
        this.init();
    };

    this.endGame = function() {
        clearInterval(self.remainingTimeInterval);
        if (wnd !== null) wnd.fadeAndRemove();
        Engine.lock.remove('minigames');
        this.l.endGame();
    };
    this.parseMessage = function(msg) {
        switch (msg.t) {
            case 'check':
                this.checkStatus(msg.status);
                break;
            case 'quit':
                this.endGame();
                break;
        }
    };
    this.checkStatus = function(status) {
        if (status >= 1) this.endGame();
    };
    this.lock = function() {
        this.isLocked = true;
    };
    this.unlock = function() {
        this.isLocked = false;
    }
};