//var wnd = require('@core/Window');
var tpl = require('@core/Templates');
module.exports = function(Par) {
    var self = this;
    var content;

    this.update = function() {
        self.showHistory(true);
    };

    this.init = function() {
        this.initContent();
        this.initButs();
    };

    this.initContent = function() {
        content = tpl.get('clan-history-content');
        Par.wnd.$.find('.card-content').append(content);
        $('.scroll-wrapper', content).addScrollBar({
            track: true,
            addScrollableClassToAnotherEl: $('.table-header-wrapper', content)
        });
    };

    this.initButs = function() {
        var t = [
            Par.tLang('hist_filter_depo'), 'witch-depo',
            Par.tLang('hist_filter_nodepo'), 'without-depo'
        ];
        Par.addControll(t[0], t[1], function() {
            self.showHistory(true);
        }).addClass('green');
        Par.addControll(t[2], t[3], function() {
            self.showHistory(false);
        }).addClass('green');
    };

    this.showHistory = function(depo) {
        var $tableHeader = content.find('.history-table-header');
        var $table = content.find('.history-table');
        var $header = self.createHeaderTable();
        $table.html('');
        var goldlog = Par.getProp('goldlog');
        for (var i in goldlog) {
            var o = goldlog[i];
            if (self.checkContinue(o, depo)) continue;
            var t = self.splitString(o);
            var dateFormatted = convertDateTime(t[0]);
            var $tr = Par.createRecords([dateFormatted, t[1]], 'normal-td');
            $table.append($tr)
        }
        $tableHeader.html($header);
        self.setButDisable(depo);
        $('.scroll-wrapper', content).trigger('update');
    };

    this.splitString = function(o) {
        var t = o.txt.split(/](.+)/);
        t[0] = t[0].replace('[', '');
        return t;
    };

    this.checkContinue = function(o, depo) {
        //return !isset(o.txt) || o.txt.match(r) || !depo && o.kind == 'depo';
        if (!isset(o.txt)) return true;
        var r = new RegExp('depozyt zakï¿½|z depozytu|do depozytu,', 'gi');

        return o.txt.match(r) && !depo || o.kind == 'depo' && !depo;
    };

    this.setButDisable = function(depo) {
        var b1 = content.find('.witch-depo>.button');
        var b2 = content.find('.without-depo>.button');
        var o = depo ? b1 : b2;
        b1.add(b2).removeClass('black').addClass('green');
        o.removeClass('green').addClass('black');
    };

    this.createHeaderTable = function() {
        var t = [
            Par.tLang('date_time'),
            Par.tLang('clan_action')
        ];
        return Par.createRecords([t[0], t[1]], 'table-header interface-element-table-header-1-background');
    };

    //this.init();

};