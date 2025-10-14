// var wnd = require('@core/Window');
var tpl = require('@core/Templates');
module.exports = function(Par, otherClan) {
    var content;
    var attrDataTab;

    this.init = function() {
        this.initContent();
        this.initTexts();
        this.initAttrTab();
        //if (!otherClan) this.initSaveAttrBtn();
    };

    this.getContent = function() {
        return content;
    };

    this.update = function() {
        var myClanBits = Par.getProp('attributes').toString();
        var ClanAtributes = Par.getClanAtributs();
        var skills = Par.getProp('quest_bonuses');
        var outfit = Par.getProp('has_outfit');
        var level = Par.getProp('level');
        var depoTabs = Par.getProp('depo_tabs');
        var bits = ClanAtributes.getMapOfBits(myClanBits, level, depoTabs, skills, outfit);
        this.createAllAtributs(bits, true, 'inInput');
    };

    this.initContent = function() {
        var str2 = 'clan-other-recruit-content';
        content = tpl.get(str2);
        Par.getShowcaseWnd().$.find('.card-content').append(content);
        $('.scroll-wrapper', content).addScrollBar({
            track: true
        });
    };

    this.initTexts = function() {
        content.find('.clan-recruit-header-0').find('.header-text').html(Par.tLang('basic_atributes'));
        content.find('.clan-recruit-header-1').find('.header-text').html(Par.tLang('additional_atributes'));
        //if (!otherClan) return;
        content.find('.clan-recruit-header-2').find('.header-text').html(Par.tLang('clan_skills'));
    };

    this.initAttrTab = function() {
        var ClanAtributs = Par.getClanAtributs();
        attrDataTab = ClanAtributs.getAttrDataTab();
    };

    this.initSaveAttrBtn = function() {
        var $btn = tpl.get('button').addClass('green');
        var str = Par.tLang('save');
        $btn.find('.label').html(str);
        $btn.click(function() {
            var ClanAtributs = Par.getClanAtributs();
            ClanAtributs.saveAtributes();
        });

        content.find('.save-atributes').append($btn);
    };

    this.createAllAtributs = function(bits, edit, selectorToOption) {
        var $attrWrapper = content.find('.scroll-pane');
        var ClanAtributs = Par.getClanAtributs();
        $attrWrapper.find('.one-clan-atribute').remove();
        var arg = bits ? [bits, selectorToOption] : false;
        for (var id in attrDataTab) {
            if (id > 99 && !otherClan) break;
            ClanAtributs.createAtribute($attrWrapper, id, content, arg, edit, true);
        }
        this.updateRights();
    };

    this.updateRights = function() {
        var t = [
            'none',
            'table-cell'
        ];
        var display;
        //if (otherClan) display = t[0];
        //else {
        //	var myRank = Par.getProp('myrank');
        //	display = myRank & 1 ? t[1] : t[0];
        //}
        display = t[0];
        //content.find('.input-wrapper, .save-atribute-wrapper').css('display', display);
        content.find('.input-wrapper').css('display', display);
    };

    //this.init();
};