var tpl = require('@core/Templates');
var Input = require('@core/InputParser');
const {
    getAllProfName
} = require('./HelpersTS');
module.exports = function() {
    var self = this;
    var interval;
    var counter;
    this.wnd = null;

    this.init = function() {
        self.initWnd();
        self.initButton();
        self.centeWnd();
        //console.log('asd');
    };

    this.initWnd = function() {

        Engine.windowManager.add({
            content: tpl.get('log-off'),
            //nameWindow        : 'log-off',
            nameWindow: Engine.windowsData.name.LOG_OFF,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('log-out', null, 'logoff'),
            addClass: 'log-off-wnd',
            backdrop: Engine.interface.get$alertsLayer(),
            onclose: () => {
                self.close();
            }
        });
        this.wnd.addToAlertLayer();
    };

    this.update = function(val) {
        if (val === 0 || !Engine.changePlayer) {
            this.close();
            return;
        }
        if (interval) clearInterval(interval);

        Engine.lock.add('logoff');
        counter = val;
        self.updateLabel(counter);
        interval = setInterval(function() {
            counter--;
            self.updateLabel(counter);
        }, 1000);
    };

    this.updateLabel = function(val) {
        var str;
        var other = Engine.changePlayer.getDestinationCharacter();
        //var v = Math.floor(val - ts() / 1000) + 2;
        var v = val < 0 ? 0 : val;
        if (other !== null) str = _t('change-log-time %val% %nick%', {
            '%val%': v,
            '%nick%': other.nick,
            '%lvl%': other.lvl,
            '%prof%': other.prof,
            '%world%': capitalize(other.world)
        }, 'logoff');
        else str = _t('logout-time %val%', {
            '%val%': v
        }, 'logoff');
        self.wnd.$.find('.time-to-out').html(str);
    };

    this.centeWnd = function() {
        this.wnd.center();
    };

    this.initButton = function() {
        var $btn1 = tpl.get('button').addClass('small green');
        $btn1.find('.label').html(_t('cancel'));
        $btn1.click(function() {
            _g('logoff&a=stop');
        });
        this.wnd.$.find('.log-out-actions').append($btn1);
        if (Engine.changePlayer && Engine.changePlayer.id) {
            var other = Engine.changePlayer.getDestinationCharacter();
            if (other.world !== Engine.worldConfig.getWorldName()) {
                self.addRelogButton();
            }
            return;
        }
        var $btn2 = tpl.get('button').addClass('small green');
        $btn2.find('.label').html(_t('out', null, 'logoff'));
        $btn2.click(function() {
            window.location.replace('https://margonem.' + getMainDomain());
        });
        this.wnd.$.find('.log-out-actions').append($btn2);
    };

    this.addRelogButton = function() {
        var $btn2 = tpl.get('button').addClass('small green');
        $btn2.find('.label').html(_t('relog', null, 'logoff'));
        $btn2.click(function() {
            Engine.stop();
            self.out();
        });
        this.wnd.$.find('.log-out-actions').append($btn2);
    };

    this.out = function() {
        var id = Engine.changePlayer.id;
        if (id) Engine.changePlayer.reloadPlayer(id);
        else window.location = 'https://margonem.' + getMainDomain();
    };

    this.close = function() {
        clearInterval(interval);
        interval = null;
        Engine.lock.remove('logoff');
        //self.wnd.$.remove();
        self.wnd.remove();
        // delete (self.wnd);
        Engine.logOff = false;
        if (Engine.changePlayer) Engine.changePlayer.id = null;
        //delete(self);
    };

    //this.init();
};