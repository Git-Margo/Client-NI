// var wnd = require('core/Window');
var tpl = require('core/Templates');
module.exports = function(Par, which, $parent) {
    var self = this;
    var content;
    var $w;

    this.init = function() {
        this.initWindow();
        this.initBut();
    };

    this.initWindow = function() {
        content = tpl.get('clan-info-content');
        Par.wnd.$.find('.card-content').append(content);
        $('.scroll-wrapper', content).addScrollBar({
            track: true
        });
    };

    this.initBut = function() {
        var str1 = Par.tLang('look_for_clan');
        var str2 = Par.tLang('create_clan');
        Par.addControll(str1, 'look-for-clan', this.lookForClanAction, content).addClass('small green');
        Par.addControll(str2, 'clan-look-for-clan-btn', Par.createClan, content).addClass('small green');
    };

    this.lookForClanAction = function() {
        var $cards = Par.wnd.$.find('.card');
        $cards.removeClass('active');
        $cards.eq(1).addClass('active');
        Par.showChooseCard('clan', 'clan-list');
    };


    //this.init();

};