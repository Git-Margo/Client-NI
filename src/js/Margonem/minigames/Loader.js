/**
 * Created by lukaszkowalski on 22/05/15.
 */
var crafting = require('minigames/crafting/logic');
var mastermind = require('minigames/mastermind/logic');
var pipes = require('minigames/pipes/logic');
var questions = require('minigames/questions/logic');
var saper = require('minigames/saper/logic');
var memo = require('minigames/memo/logic');
var hidden = require('minigames/hidden/logic');
module.exports = new(function() {
    this.game = null;
    this.v = null;
    this.data = null;
    this.loadedGames = [];
    var self = this;
    var running = false;
    this.loadImages = function(files) {
        var amount = [0];
        for (var i in files.list) {
            //var img = new Image();
            //img.src = 'js/Margonem/minigames/' + this.data.name + '/img/' + files.list[i];
            //img.onload = function () {
            //	amount++;
            //	if (amount == files.amount) self.start()
            //}
            let path = 'js/Margonem/minigames/' + this.data.name + '/img/' + files.list[i];

            this.setImgLoader(files, path, amount);
        }
    };
    this.setImgLoader = (files, path, amount) => {
        Engine.imgLoader.onload(path, false, false, (i) => {
            amount[0]++;
            if (amount[0] == files.amount) this.start()
        });
    };
    this.loadCss = function(file) {
        $('head').append('<link rel="stylesheet" type="text/css" href="js/Margonem/minigames/' + this.data.name + '/' + file + '?ts=' + unix_time() + '" />');
    };
    this.initGame = function(data) {
        this.v = data;
        this.task({
            c: 'init'
        });
    };
    this.loadScripts = function(data) {
        this.data = data;
        //$('#centerbox').append('<div style="position:absolute;top:100px;left:100px;background-color:#000;color:#fff" id="load_game">Åadowanie gry</div>');
        self.game = null;
        switch (data.name) {
            case 'crafting':
                self.game = new crafting(self);
                break;
            case 'mastermind':
                self.game = new mastermind(self);
                break;
            case 'pipes':
                self.game = new pipes(self);
                break;
            case 'questions':
                self.game = new questions(self);
                break;
            case 'saper':
                self.game = new saper(self);
                break;
            case 'memo':
                self.game = new memo(self);
                break;
            case 'hidden':
                self.game = new hidden(self);
                break;
        }
        self.game.initData = data;

        if (self.loadedGames.indexOf(data.name) < 0) {
            if (isset(data.files)) self.loadImages(data.files);
            if (isset(data.css)) self.loadCss(data.css);
            self.loadedGames.push(data.name);
            if (!isset(data.files)) self.start();
        } else {
            self.start();
        }
        //if (!isset(data.files)) self.start();
    };
    this.start = function() {
        setTimeout(function() { // temporary solution, minigames have to entirely refactoring
            $('#load_game').remove();
            self.game.run();
            running = true;
        }, 500)
    };
    this.task = function(data) {
        if (this.game != null) this.game.lock();
        $.ajax({
            url: `${Engine.worldConfig.getApiDomain()}/minigames/${Engine.worldConfig.getWorldName()}`,
            type: 'post',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            dataType: 'json',
            data: {
                d: data,
                g: self.v
            },
            success: function(msg) {
                if (self.game != null) self.game.unlock();
                self.parseMessage(msg);
            }
        });
    };
    this.parseMessage = function(msg) {
        if (!msg) return false;
        switch (msg.t) {
            case 'init':
                this.loadScripts(msg);
                break;
            case 'nogame':
                if (this.game != null) this.game.endGame();
                else _g('endgame');
                Engine.lock.remove('minigame');
                break;
            default:
                this.game.parseMessage(msg);
        }
    };
    this.endGame = function() {
        if (!running)
            return;
        _g('endgame', function(d) {
            if (!isset(d.e) || d.e != 'ok') {
                running = true;
            }
        });
        running = false;
    };
})();