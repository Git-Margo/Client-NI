// var Console = require('core/Console');
module.exports = new(function() {
    var interval = null;
    var firstSuccess = true;
    var timeout = 20;
    var self = this;

    this.start = function() {
        if (interval) return;
        var tab = [
            _t('server_connection_fail', null, 'reload'),
            _t('auto_reload in', null, 'reload')
        ];
        firstSuccess = false;
        Engine.stopJSONInterval();
        Engine.lock.add('reconnect');
        log(tab[0]);
        log(tab[1]);
        interval = setInterval(this.countDown, 1000);
    };

    this.stop = function() {
        if (!interval) return;
        clearInterval(interval);
        interval = null;
        timeout = 20;
    };

    this.stateInterval = function() {
        return interval;
    };

    this.countDown = function() {
        if (timeout <= 0) {
            window.location.reload();
        } else {
            timeout--;
            //var $w = Console.wnd.$;
            var $w = Engine.console.wnd.$;
            $w.find('#reconnectInfo').html(timeout + 's');
            _g('_', self.success);
        }
    };

    this.success = function() {
        if (firstSuccess) return;
        //var $w = Console.wnd.$;
        var $w = Engine.console.wnd.$;
        firstSuccess = true;
        $w.find('#reconnectInfo').removeAttr('id');
        Engine.lock.remove('reconnect');
        Engine.startGameThread();
    };

    this.disconnect = function(e) {
        //console.log(e);
        var st = e.status;
        if (st == 200 || st == 0) {
            Engine.reconnect.start();
        }
    };

})();