//var wnd = require('@core/Window');
var tpl = require('@core/Templates');
module.exports = function(Par) {
    var content;
    var self = this;
    var attrDataTab;

    this.init = function() {
        this.initContent();
        this.initAttrTab();
        this.createFindPanel();
        this.createShowFindPanelBtn();
        this.hideElements();
    };

    this.hideElements = function() {
        //content.find('.atribute-value-wrapper, .save-atribute-wrapper').css('display', 'none');
        content.find('.atribute-value-wrapper').css('display', 'none');
    };

    this.initContent = function() {
        content = tpl.get('clan-list-find-panel');
        Par.wnd.$.find('.clan-list-content').append(content);
        $('.clan-list-find-content').addScrollBar({
            track: true
        });
    };

    this.initAttrTab = function() {
        var ClanAtributs = Par.getClanAtributs();
        attrDataTab = ClanAtributs.getAttrDataTab();
    };

    this.createFindPanel = function() {
        this.createHideBtn();
        this.createFindBtn();
        this.createFindPanelHeaders();
        this.createAllAtributes();
    };

    this.createAllAtributes = function() {
        var $attrWrapper = content.find('.clan-list-find-content');
        var ClanAtributs = Par.getClanAtributs();
        for (var id in attrDataTab) {
            if (attrDataTab[id].name == 'empty') continue;
            ClanAtributs.createAtribute($attrWrapper, id, content, false, true);
        }
    };

    this.createFindPanelHeaders = function() {
        var key = 'clan-find-header-';
        content.find('.' + key + 0).html(Par.tLang(key + 0));
        content.find('.' + key + 1).html(Par.tLang(key + 1));
        content.find('.' + key + 2).html(Par.tLang(key + 2));
        content.find('.clan-list-find-header').html(Par.tLang('advanced-find'));
    };

    this.showFindPanel = function() {
        content.toggleClass('active');
    };

    this.hideFindPanel = function() {
        content.removeClass('active');
    };

    this.createShowFindPanelBtn = function() {
        var $btn = tpl.get('button').addClass('small green');
        var str = Par.tLang('filter');
        var $w = Par.wnd.$;
        $btn.click(self.showFindPanel);
        $btn.find('.label').html(str);
        $w.find('.clan-list-show-btn').append($btn);
    };

    this.createHideBtn = function() {
        var $btn = tpl.get('button').addClass('small green');
        var str = _t('hide');
        $btn.find('.label').html(str);
        $btn.click(self.hideFindPanel);
        content.find('.clan-list-hide-btn').append($btn);
    };

    this.createFindBtn = function() {
        var $btn = tpl.get('button').addClass('small green');
        var str = _t('search');
        $btn.find('.label').html(str);
        $btn.click(self.sortAttrClans);
        content.find('.clan-list-find-btn').append($btn);
    };

    this.sortAttrClans = function() {
        var filter = '&filters=' + self.getFilter().join('');
        var ClanList = Par.getClanList();
        ClanList.sendRequest(1, filter);
        //console.log(filter);
        self.hideFindPanel();
    };

    this.checkClanMatch = function($oneClan, oneClanAttrs, filter) {
        var match = true;
        for (var id in filter) {
            var kindSort = !isset(attrDataTab[id].find) ? 'Equal' : attrDataTab[id].find;
            var func = 'is' + kindSort;
            var val = this.getLookingForVal(filter[id], id);
            if (self[func](oneClanAttrs[id], val)) continue;
            match = false;
            break;
        }
        if (!match) $oneClan.addClass('hide');
    };

    this.getLookingForVal = function(val, id) {
        var range = attrDataTab[id].range;
        if (!range) return val;
        if (range[3]) return Math.abs((val - range[1]) / range[2]);
        else return (val - range[0]) / range[2];
    };

    this.isEqual = function(a, findVal) {
        return parseInt(a, 2) == findVal;
    };

    this.isBiggerOrEqual = function(a, findVal) {
        return parseInt(a, 2) >= findVal;
    };

    this.isLesserOrEqual = function(a, findVal) {
        return parseInt(a, 2) <= findVal;
    };

    //this.getFilter = function () {
    //	var filter = {};
    //	for (var k in attrDataTab) {
    //		var bool = attrDataTab[k].input == 'i';
    //		var $o = content.find('.input-val-' + k);
    //		if (bool) $o.val();
    //		var v = bool ? $o.val() : $o.attr('value');
    //		if (v != '') filter[k] = v;
    //	}
    //	return filter;
    //};

    this.getFilter = function() {
        //var filter = {};
        var a = new Array(15);
        for (var k in attrDataTab) {
            var id = attrDataTab[k].clanListFilter;
            if (attrDataTab[k].name == 'empty') continue;
            var kind = attrDataTab[k].input;
            var $o = content.find('.input-val-' + k);
            //if (bool) $o.val();
            var v;
            switch (kind) {
                case 'i':
                    v = $o.val();
                    break;
                case 'm':
                    v = $o.attr('value');
                    break;
                case 'c':
                    v = $o.find('.active').attr('value');
                    break;
            }

            //var v = bool ? $o.val() : $o.attr('value');
            if (v != '') {
                //filter[k] = v;
                a[id] = v + '|';
            } else {
                a[id] = '|';
            }
        }
        //return filter;
        return a;
    };

    //this.init();

};