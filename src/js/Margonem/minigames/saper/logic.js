/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
// var Window = require('@core/Window');
module.exports = function(loaderInstance) {
    this.initData = null;
    this.name = 'saper';
    this.isLocked = true;
    this.l = loaderInstance;
    this.isLocked = true;
    this.files = [];
    this.fields = null;
    this.remainingTime = null;
    this.remainingTimeInterval = null;
    this.wnd = null; //new window holder
    var self = this;
    this.init = function() {
        Engine.lock.add('minigames');
        this.window = $(document.createElement('div')).attr('id', 'saper');
        //Odkryj wszystkie zielone krysztaÅy, uwaÅ¼aj aby nie trafiÄ na czerwone. KaÅ¼dy krysztaÅ ma numer, ktÃ³ry okreÅla ile pÃ³l wokÃ³Å niego zawiera w sobie zielony krysztaÅ (nie dotyczy przekÄtnych).
        //PozostaÅe pola:
        //IloÅc szans:
        this.window.append('<div class="gameWrapper"><div class=gameinfo>' + _t('saper_infotxt', null, 'minigames') + '</div><div class="array"></div><div class="timer"></div><div class=fieldsleft>' + _t('saper_left_fields', null, 'minigames') + '<div id="_saper_fieldsleft"></div></div><div class=fieldsleft style="top: 430px;">' + _t('saper_chance_left', null, 'minigames') + '<div id="_saper_chanceleft"></div></div></div>');
        this.window.find('.gameWrapper').css('background', 'url(js/Margonem/minigames/' + this.name + '/img/' + this.initData.files.list.bg + ') no-repeat');
        this.m = this.initData.m;
        this.parseFields(this.m);

        $(document.createElement('div')).attr('rollover', 22).addClass('quitButton closebut').click(function() {
            self.l.task({
                'c': 'endGame'
            });
        }).appendTo(self.window.find('.label'));

        $('#centerbox').append(this.window);
        this.remainingTime = this.initData.time - 5;
        $('#_saper_fieldsleft').html(this.initData.req);
        $('#_saper_chanceleft').html(this.initData.tries);
        this.window.find('.timer').html(self.remainingTime + 's');
        this.remainintTimeInterval = setInterval(function() {
            --self.remainingTime;
            self.window.find('.timer').html(self.remainingTime + 's');
            if (self.remainingTime <= 0) {
                self.l.task({
                    'c': 'endGame'
                });
                clearInterval(self.remainintTimeInterval);
            }
        }, 1000);
        this.unlock();

        // this.wnd = new Window({
        // 	content: this.window,
        // 	title: _t('saper_title', null, 'minigames'),
        // 	onclose: function () {
        // 		self.l.task({'c': 'endGame'});
        // 	}
        // });
        // $('.alerts-layer').append(this.wnd.$);

        Engine.windowManager.add({
            content: this.window,
            //nameWindow        : 'saper',
            nameWindow: Engine.windowsData.name.SAPER_MINI_GAME,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('saper_title', null, 'minigames'),
            onclose: () => {
                self.l.task({
                    'c': 'endGame'
                });
            }
        });
        this.wnd.addToAlertLayer();
        this.wnd.center();
    };

    this.parseFields = function(m) {
        var m = m.split(',');
        var eq = {
            r: -30,
            b: -59,
            g: 0
        };
        var mod = 204 / 2 - 34 * self.initData.s / 2;
        for (var i in m) {
            var v = m[i][0];
            var c = m[i][1];
            $('#jevel_' + i).remove();
            var obj = $(document.createElement('div')).addClass('jvl ' + c).attr('id', 'jevel_' + i);
            obj.css({
                top: Math.floor(parseInt(i) / self.initData.s) * 34 + mod,
                left: Math.floor(parseInt(i) % self.initData.s) * 34 + mod,
                'background-position': (parseInt(v) * -1 * 30) + 'px ' + (eq[c]) + 'px'
            }).click(function() {
                var id = $(this).attr('id').split('_');
                self.l.task({
                    c: 'check',
                    i: id[1]
                });
            });
            this.window.find('.array').append(obj);
        }
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
        // Engine.lock.remove('minigames');
        onClear();
        this.l.endGame();
    };
    this.parseMessage = function(msg) {
        switch (msg.t) {
            case 'update':
                this.parseFields(msg.m);
                $('#_saper_fieldsleft').html(msg.r);
                $('#_saper_chanceleft').html(msg.tr);
                break;
            case 'check':
                this.checkStatus(msg.status);
                break;
            case 'error':
                mAlert(msg.msg);
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