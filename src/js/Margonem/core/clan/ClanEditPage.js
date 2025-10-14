//var wnd = require('@core/Window');
var tpl = require('@core/Templates');
module.exports = function(Par, which, $parent) {
    var self = this;
    var content;
    var $w;
    var menu;

    this.update = function(v) {
        var $tArea = $w.find('.edit-area');
        $tArea.val(v);
    };

    this.init = function() {
        this.initWindow();
        this.initContent();
        this.initButs();
    };

    this.initWindow = function() {
        menu = $parent;
        $w = $parent == 'clan' ? Par.wnd.$ : Par.getShowcaseWnd().$;
    };

    this.initButs = function() {
        var t = [
            Par.tLang('save'),
            Par.tLang('cancel')
        ];
        Par.addControll(t[0], 'save-change-but', this.saveChange, content).addClass('small green');
        Par.addControll(t[1], 'cancel-change-but', this.cancelChange, content).addClass('small green');
    };

    this.saveChange = function() {
        var $tArea = content.find('.edit-area');
        var req = which == 'official-page' ? 'official' : 'info';
        _g('clan&a=save&f=' + req, function(d) {}, {
            v: $tArea.val()
        });
        self.afterSave($tArea);
    };

    this.cancelChange = function() {
        Par.showChooseCard(menu, 'clan_' + which);
    };

    this.afterSave = function($tArea) {
        if (which == 'official-page') {
            var v = {
                official: $tArea.val(),
                name: Par.getProp('name')
            };
            Par.updateOfficialPage(v);
        }
        Par.showChooseCard('clan', 'clan_' + which);
    };

    this.initContent = function() {
        content = tpl.get('clan-edit-page-content');
        content.addClass('clan-edit-' + which + '-content');
        $w.find('.card-content').append(content);
    };

    //this.init();

};