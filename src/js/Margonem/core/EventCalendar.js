var tpl = require('core/Templates');
module.exports = function() {
    var self = this;
    var data = null;
    var content;
    var startDate = null;
    var mNames = null;
    var dNames = null;

    this.init = function() {
        this.initWindow();
        this.initTable();
        this.changeButsInit();
        this.languageDifference();
        this.wnd.center();
        Engine.lock.add('eCalendar');
    };

    this.initTable = function() {
        mNames = [
            'm_styczen',
            'm_luty',
            'm_marzec',
            'm_kwiecien',
            'm_maj',
            'm_czerwiec',
            'm_lipiec',
            'm_sierpien',
            'm_wrzesien',
            'm_pazdziernik',
            'm_listopad',
            'm_grudzien'
        ];
        dNames = [
            'd_monday',
            'd_tuesday',
            'd_wednesday',
            'd_thursday',
            'd_friday',
            'd_saturday',
            'd_sunday'
        ];
        this.tLangLoop(mNames);
        this.tLangLoop(dNames);
    };

    this.changeButsInit = function() {
        this.initClick('next', 'Week');
        this.initClick('next', 'Month');
        this.initClick('prev', 'Week');
        this.initClick('prev', 'Month');
    };

    this.initClick = function(pOrN, how) {
        var w = this.wnd.$;
        var but = w.find('.' + pOrN + '-' + how.toLowerCase());
        but.click(self[pOrN + how]);
    };

    this.languageDifference = function() {
        var $w = this.wnd.$;
        var lang = _l();
        $w.find('.background').addClass('bck-' + lang);
        $w.find('.prev-week').addClass(lang);
        $w.find('.next-week').addClass(lang);
    };

    this.updateData = function(v) {
        data = v;
        for (var i in data) {
            this.testRegExp(data[i]);
        }
        startDate = this.getStartPoint(new Date());
        this.setDateChange();
    };

    this.testRegExp = function(e) {
        if (/#lvl\[.*?\]#/.test(e.descr)) {
            var tmpData = /#lvl\[([0-9]*),([0-9]*)\]#/.exec(e.descr);
            e.lvl_req = [parseInt(tmpData[1]), parseInt(tmpData[2])];
            e.descr = e.descr.replace(/#lvl\[.*?\]#/, '');
        }
    };

    this.setDateChange = function() {
        this.clear();
        var w = this.wnd.$;
        var dd = startDate.getDate() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getFullYear();
        var md = mNames[startDate.getMonth()];
        w.find('.date-display').html(dd);
        w.find('.month-display').html(md);
        this.printWeek();
    };

    this.initWindow = function() {

        content = tpl.get('event-calendar');

        Engine.windowManager.add({
            content: content,
            title: this.tLang('event_calendar'),
            //nameWindow        : 'event_calendar',
            nameWindow: Engine.windowsData.name.EVENT_CALENDAR,
            objParent: this,
            nameRefInParent: 'wnd',
            onclose: () => {
                this.close();
            }
        });
        this.wnd.addToAlertLayer();

    };

    this.getStartPoint = function(d) {
        if (d.getDay() != 1) {
            d.setTime(d.getTime() - (((d.getDay() == 0 ? 7 : d.getDay()) - 1) * 24 * 3600000));
        }
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        return d;
    };

    this.printWeek = function() {
        var old_year = null;
        for (var i = 0; i < 14; i++) {

            var date = new Date(startDate.getTime() + (i * 24 * 3600 * 1000));

            if (old_year === null) old_year = date.getFullYear();

            var display = [];
            for (var k in data) {
                if (isset(data[k].lvl_req)) {
                    var l = data[k].lvl_req;
                    var lvl = Engine.hero.d.lvl;
                    if (!(lvl >= l[0] && lvl <= l[1])) continue;
                }
                var tmp = data[k];
                tmp.attr = tmp.attr & ~1;
                switch (tmp.attr) {
                    case 6:
                    case 0:
                        this.annualCase(tmp, old_year, date, display, k);
                        break;
                    case 2:
                        this.weeklyCase(tmp, date, display);
                        break;
                    case 4:
                        this.monthlyCase(tmp, date, display);
                        break;
                }
            }
            this.createCell(i, display, date);
        }
        this.animateSEvents();
    };

    this.annualCase = function(tmp, old_year, date, display, k) {
        var t_date = parseInt(tmp.date);
        var d = t_date % 100;
        var m = parseInt(Math.floor(t_date / 100));
        var y = date.getFullYear();

        if (old_year != y) y = old_year;

        var start = strtotime(this.pad(y) + '-' + this.pad(m) + '-' + this.pad(d) + ' 00:00:00');
        var end = start + 24 * 3600 - 1 + ((tmp.duration - 1) * 24 * 3600);
        var d_time = date.getTime() / 1000;
        if (d_time >= start && d_time <= end) {
            display.push(tmp);
            if (k == 44) {}
        }
    };

    this.weeklyCase = function(tmp, date, display) {
        var dur = (tmp.duration > 7 ? 7 : tmp.duration);
        var d_arr = [];
        var d = tmp.date;
        while (d < tmp.date + dur) {
            d_arr.push(d % 7);
            d++
        }
        if (d_arr.indexOf(date.getDay()) >= 0) display.push(tmp);
    };

    this.monthlyCase = function(tmp, date, display) {
        if (tmp.date < 40) {
            this.lessThanFourty(tmp, date, display);
        } else {
            this.moreThanFourty(tmp, date, display);
        }
    };

    this.lessThanFourty = function(tmp, date, display) {
        var d = this.pad(tmp.date);
        var m = this.pad(date.getMonth() + 1);
        var y = date.getFullYear();
        var start = strtotime(this.pad(y) + '-' + this.pad(m) + '-' + this.pad(d) + ' 00:00:00');
        var end = start;
        if (tmp.duration > 1) {
            end = strtotime('+' + (tmp.duration - 1) + ' days', start) + 24 * 3600 - 1; //setting to last day with time 23:59:59
        }
        var d_time = date.getTime() / 1000;
        if (d_time > start && d_time < end) {
            display.push(tmp);
        }
    };

    this.moreThanFourty = function(tmp, date, display) {
        var m = this.pad(date.getMonth() + 1);
        var y = date.getFullYear();
        var start = strtotime(this.pad(y) + '-' + this.pad(m) + '-' + this.pad(d) + ' 00:00:00');
        var start_date = new Date(start * 1000);
        var week_day = tmp.date % 10;
        var week_num = Math.floor((tmp.date - 30) / 10);
        var start_day = start_date.getDay() == 0 ? 7 : start_date.getDay();
        var start_dd = start + ((week_day - start_day) * 24 * 3600) + ((week_num - ((week_day - start_day) < 0 ? 0 : 1)) * 7 * 24 * 3600);
        var end = start_dd + (tmp.duration) * 24 * 3600 - 1;

        var d_time = date.getTime() / 1000;
        if (d_time >= start_dd && d_time <= end) {
            display.push(tmp);
        }
    };

    this.createCell = function(i, display, date) {
        var w = this.wnd.$;
        var html = tpl.get('event-calendar-cell');
        var $o = $(html);
        var htm1 = '<span class=day-name>' + dNames[i % 7] + '</span>';
        var htm2 = '<span class=day>' + date.getDate() + '/' + (this.pad(date.getMonth() + 1)) + '</span>';

        $o.find('.day-and-date').append(htm1);
        $o.find('.day-and-date').append(htm2);
        display.sort(function(a, b) {
            return a.duration - b.duration;
        });
        var tmpDisp = display.splice(0, 2);
        var $holder = $o.find('.events-holder');
        for (var n in tmpDisp) {
            this.createSingleEvent(tmpDisp, $holder, n);
        }
        w.find('.days-wrapper').append($o);
    };

    this.createSingleEvent = function(tmpDisp, $holder, n) {
        var $se = $('<div class="single-event"></div>');
        var tmp = tmpDisp[n];
        var lab = '<span class=ev-name>' + tmp.name + '</span>';

        $se.append(lab);
        if (tmp.descr != '') $se.tip(tmp.descr, 't_static');
        if (tmp.icon) {
            var $bg = $('<div class=bg></div>');
            if (tmp.icon.match(/\./))
                $bg.css({
                    backgroundImage: 'url(' + tmp.icon + ')'
                });
            else
                $bg.css({
                    backgroundColor: tmp.icon,
                    opacity: 0.2
                });
            $se.prepend($bg);
        }
        $holder.append($se);
    };

    this.animateSEvents = function() {
        this.wnd.$.find('.single-event').hover(
            function() {
                self.stretchEvent($(this));
            },
            function() {
                self.restoreSize($(this));
            }
        );
    };

    this.stretchEvent = function($o) {
        var $ch = $o.parent().children();
        if ($ch.length < 2) return;
        var i = $o.index();
        if (i == 0) {
            $ch.last().css('top', '100%');
            $ch.first().css('bottom', 0);
        } else {
            $ch.last().css('top', 0);
            $ch.first().css('bottom', '100%');
        }
    };

    this.restoreSize = function($o) {
        var $ch = $o.parent().children();
        if ($ch.length < 2) return;
        $ch.last().css('top', '50%');
        $ch.first().css('bottom', '50%');
    };

    this.close = function() {
        //self.wnd.$.remove();
        self.wnd.remove();
        // delete (self.wnd);
        Engine.lock.remove('eCalendar');
        Engine.eventCalendar = false;
        //delete(self);
    };

    this.nextMonth = function() {
        startDate.setMonth(startDate.getMonth() + 1);
        startDate = self.getStartPoint(startDate);
        self.setDateChange();
    };

    this.nextWeek = function() {
        startDate.setDate(startDate.getDate() + 7);
        self.setDateChange();
    };

    this.prevMonth = function() {
        startDate.setMonth(startDate.getMonth() - 1);
        startDate = self.getStartPoint(startDate);
        self.setDateChange();
    };

    this.prevWeek = function() {
        startDate.setDate(startDate.getDate() - 7);
        self.setDateChange();
    };

    this.pad = function(n) {
        return (n < 10) ? ("0" + n) : n;
    };

    this.clear = function() {
        var w = this.wnd.$;
        w.find('.date-display').empty();
        w.find('.month-display').empty();
        w.find('.days-wrapper').empty();
    };

    this.tLang = function(name) {
        return _t(name, null, 'event_calendar');
    };

    this.tLangLoop = function(table) {
        for (var i = 0; i < table.length; i++)
            table[i] = this.tLang(table[i])
    };

    //this.init();
};