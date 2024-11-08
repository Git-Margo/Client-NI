/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
// var Window = require('core/Window');
module.exports = function(loaderInstance) {
    this.initData = null;
    this.name = 'pipes';
    this.isLocked = true;
    this.l = loaderInstance;
    this.isLocked = true;
    this.files = [];
    this.fields = null;
    this.remainingTime = null;
    this.remainingTimeInterval = null;
    this.ballAnimationInterval = null;
    this.wnd = null;
    var self = this;
    var sourcePosition = null;

    this.getZoomFactor = function() {
        if (isset(Engine) && isset(Engine.zoomFactor)) {
            return Engine.zoomFactor;
        }
        return 1;
    }

    this.init = function() {
        Engine.lock.add('minigames');

        this.window = $(document.createElement('div')).attr('id', 'pipes');
        this.window.append('<div class="gameWrapper"><div class=gameinfo>' + _t('pipes_desc', null, 'minigames') + '</div><div class="array"></div><div class="timer"></div></div>'); //PomÃ³Å¼ kulce dostaÄ siÄ z jednej strony na drugÄ. PrzeciÄgaj rurki we wÅaÅciwe miejsca, by poÅÄczyÄ dwie duÅ¼e rury!
        this.window.find('.gameWrapper').css('background', 'url(js/Margonem/minigames/' + this.name + '/img/' + this.initData.files.list.bg + ') no-repeat');
        this.fields = this.initData.fields;
        this.parseFields(this.fields);

        this.remainingTime = this.initData.time - 5;
        if (this.initData.status > 1) {
            self.l.task({
                c: 'check'
            });
        } else if (this.remainingTime <= 0) {
            self.l.task({
                'c': 'endGame'
            });
        } else {
            this.window.find('.timer').html(self.remainingTime + 's');
            this.remainintTimeInterval = setInterval(function() {
                --self.remainingTime;
                self.window.find('.timer').html(self.remainingTime + 's');
                if (self.remainingTime <= 0) {
                    self.animateBall();
                    clearInterval(self.remainintTimeInterval);
                }
            }, 1000);
            this.unlock();
        }

        // this.wnd = new Window({
        // 	onclose: function () {
        // 		self.l.task({'c': 'endGame'});
        // 	},
        // 	title: _t('pipes_title', null, 'minigames'),
        // 	content: this.window
        // });
        // $('.alerts-layer').append(this.wnd.$);


        Engine.windowManager.add({
            content: this.window,
            //nameWindow        : 'pipes',
            nameWindow: Engine.windowsData.name.PIPES_MINI_GAME,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('pipes_title', null, 'minigames'),
            onclose: () => {
                self.l.task({
                    'c': 'endGame'
                });
            }
        });

        this.wnd.addToAlertLayer();
        this.wnd.center();
    };

    this.parseFields = function(fields) {
        this.initData.fields = fields;
        fields = fields.split(',');
        var tiles = [];
        for (var i in fields) {
            var put = true;
            var f = fields[i];
            var col = parseInt(i >= 8 ? i % 8 : i);
            var row = Math.floor(i / 8);
            var tmpF = parseInt(f);
            if (!isNaN(tmpF)) {
                if (tmpF == -2) f = 'bl';
                else {
                    put = false
                }
            }
            if (put) {
                var tile = $(document.createElement('div')).css({
                    top: row * 29,
                    left: col * 29
                }).addClass('tile ' + f).attr('id', 'pipecell_' + row + '_' + col);
                if (f == 'bl') tile.css('opacity', 0.3);
                tiles.push(tile[0]);
            }
        }
        this.window.find('.gameWrapper .array').html(tiles).append('<div class="ball"></div>');
        setTimeout(function() {
            self.window.find('.gameWrapper .array .tile:not(.bl)').draggable({
                start: function(e, ui) {
                    if (self.isLocked) return false;
                    $(this).css('opacity', 0.7);
                    var gridOffset = $("#pipes .gameWrapper .array").offset();
                    var zoom = self.getZoomFactor();
                    var dy = Math.floor((ui.offset.top - gridOffset.top + ui.helper.height() * zoom / 2) / 29 / zoom);
                    var dx = Math.floor((ui.offset.left - gridOffset.left + ui.helper.width() * zoom / 2) / 29 / zoom);
                    if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 8) {
                        sourcePosition = {
                            x: dx,
                            y: dy
                        };
                    }
                },
                stop: function(e, ui) {
                    if (self.isLocked) return false;
                    if (sourcePosition == null) return false;
                    $(this).css('opacity', 1);
                    var gridOffset = $("#pipes .gameWrapper .array").offset();
                    var zoom = self.getZoomFactor();
                    var dy = Math.floor((ui.offset.top - gridOffset.top + ui.helper.height() * zoom / 2) / 29 / zoom);
                    var dx = Math.floor((ui.offset.left - gridOffset.left + ui.helper.width() * zoom / 2) / 29 / zoom);
                    dy = Math.max(Math.min(8, dy), 0);
                    dx = Math.max(Math.min(7, dx), 0);
                    var data = {
                        dstRow: dy,
                        dstCol: dx,
                        srcRow: sourcePosition.y,
                        srcCol: sourcePosition.x
                    };
                    sourcePosition = null;
                    if (!self.isLocked) self.l.task({
                        c: 'put',
                        data: data
                    });
                },
                //containment: "#pipes .gameWrapper .array",
                cursorAt: {
                    top: 14,
                    left: 14
                }
            });
        }, 200)
    };

    this.run = function() {
        this.init();
    };

    this.endGame = function() {
        clearInterval(self.remainintTimeInterval);
        clearInterval(self.ballAnimationInterval);
        this.wnd.fadeAndRemove();
        //this.l.game = null;
        this.l.endGame();
        Engine.lock.remove('minigames');
    };
    this.parseMessage = function(msg) {
        switch (msg.t) {
            case 'update':
                this.parseFields(msg.fields);
                if (msg.ball != undefined) this.checkBall(msg);
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
    this.checkBall = function(msg) {
        if (msg.ball) {
            clearInterval(self.remainintTimeInterval);
            this.animateBall(msg.fields)
        }
    };
    this.animateBall = function() {
        this.lock();
        var b = $('.gameWrapper .array .ball');
        var m = this.initData.fields.split(',');
        var startSide = 'l';
        var endSide = 'r';
        var c1 = ['u', 'l', 'd', 'r'];
        var c2 = ['d', 'r', 'u', 'l'];
        var active = [6, 0];
        var y = 188.5;
        var x = 0;
        var v = 1;
        var r = 14.5;
        var an = null;
        var vr = v / r;
        var vm = null;
        var modx = 0;
        var mody = 0;
        var stop = false;
        var next = [null, null];

        this.ballAnimationInterval = setInterval(function() {
            active = [Math.floor(((y)) / 29), Math.floor((x) / 29)];
            if (active[0] != next[0] || active[1] != next[1]) {
                next = active;
                if ((x <= 0 || x >= 8 * 29 || y <= 0 || y >= 8 * 29) && (active[0] != 6 && active[0] != 0)) {
                    stop = true;
                    clearInterval(self.ballAnimationInterval);
                    self.l.task({
                        c: 'check'
                    });
                } else {
                    var tile = m[next[0] * 8 + next[1]];
                    var tmpSide = c2[c1.indexOf(endSide)];
                    for (var i = 0; i < 2; i++) {
                        if (tmpSide != tile[i]) endSide = tile[i];
                        else startSide = tile[i];
                    }
                    if (active[0] == 1 && active[1] == 8 || (c2[c1.indexOf(tmpSide)] != c1[c2.indexOf(startSide)]) || !isNaN(parseInt(tile)) || (x < 0 || x > 8 * 29 || y < 0 || y > 8 * 29)) {
                        stop = true;
                        clearInterval(self.ballAnimationInterval);
                        self.l.task({
                            c: 'check'
                        });
                    }
                    an = null;
                    vm = null;
                    modx = 0;
                    mody = 0;
                }
            }
            if (c1.indexOf(startSide) == c2.indexOf(endSide)) {
                if (startSide == 'l') {
                    x += v
                }
                if (startSide == 'r') {
                    x -= v
                }
                if (startSide == 'u') {
                    y += v
                }
                if (startSide == 'd') {
                    y -= v
                }
            } else {
                var s = startSide;
                var e = endSide;
                if (an == null) {
                    if (e == 'u') {
                        an = 0.5 * Math.PI;
                        modx = active[1] * 29 + (s == 'r' ? 2 * r : 0);
                        mody = active[0] * 29;
                    }
                    if (e == 'd') {
                        an = 1.5 * Math.PI;
                        modx = active[1] * 29 + (s == 'r' ? 2 * r : 0);
                        mody = active[0] * 29 + 2 * r;
                    }
                    if (e == 'r') {
                        an = 1 * Math.PI;
                        modx = active[1] * 29 + 2 * r;
                        mody = active[0] * 29 + (s == 'd' ? 2 * r : 0);
                    }
                    if (e == 'l') {
                        an = 0 * Math.PI;
                        modx = active[1] * 29;
                        mody = active[0] * 29 + (s == 'd' ? 2 * r : 0);
                    }
                    if ((s == 'l' && e == 'u') || (s == 'd' && e == 'l') || (s == 'r' && e == 'd') || (s == 'u' && e == 'r')) {
                        vm = -1;
                    } else {
                        vm = 1;
                    }
                }
                an += vr * vm;
                x = Math.cos(an) * r + modx;
                y = Math.sin(an) * r + mody;
            }
            if (!stop) b.css({
                display: 'block',
                top: y - r,
                left: x - r
            });
        }, 10);
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