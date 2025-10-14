// var wnd = require('@core/Window');
var tpl = require('@core/Templates');
module.exports = function(Par) {
    var self = this;
    var content;

    this.update = function(v) {
        if (v.members) this.updateTable(v.members);
        else {
            var comMembers = this.createMembersTableForCom(v.members);
            this.updateTable(comMembers);
        }
        this.updateScroll();
    };

    this.createMembersTableForCom = function(v) {
        var t = [];
        for (var i = 0; i < v.length; i++) {
            t.push(v[i]);
            var bool1 = i != 0;
            var bool2 = (i + 1) % 4 == 0;
            if (bool1 && bool2) t.push('/noob/wm.gif');
        }
        return t;
    };

    this.updateTable = function(v) {
        var j = 1;
        var header = this.createOtherTabHeader();
        var $tableHeader = content.find('.js-table-header');
        var $table = content.find('.clan-other-members-table');
        $tableHeader.empty();
        $table.empty();

        for (var i = 0; i < v.length; i += 6) {
            var sliceD = v.slice(i, i + 6);
            var $tr = this.otherMember(sliceD, j);
            $table.append($tr);
            j++;
        }
        $tableHeader.prepend(header);
    };

    this.otherMember = function(v, i) {
        //var str = Par.tLang('member_level');
        var $mem = tpl.get('clan-member');
        var $info = v[0];
        var rank = v[4];
        var $rank = tpl.get('member-rank').html(rank);
        var url = CFG.a_opath + v[5];
        var $levelAndProf = tpl.get('level-and-prof');
        //var $memberLvl = tpl.get('member-lvl').html(v[1]+v[2]);

        let characterInfoData = {
            nick: v[0],
            prof: v[3],
            level: v[1],
            operationLevel: v[2],
            htmlElement: true
        };

        //var $memberLvl = tpl.get('member-lvl').html(getCharacterInfo(null, {prof: v[3], level:v[1], operationLevel:v[2]}));

        var $memberLvl = tpl.get('member-lvl').html(getCharacterInfo(characterInfoData));
        $memberLvl.attr("val-to-sort", characterInfoData.level)
        addCharacterInfoTip($memberLvl, characterInfoData);

        createImgStyle($mem.find('.icon-wrapper'), url);
        $mem.find('.char-stats').html($info);
        $rank.tip(rank);
        $levelAndProf.append($memberLvl);
        return Par.createRecords([i + '.', $mem, $levelAndProf, $rank], 'normal-td big-height-td');
    };

    this.updateScroll = function() {
        $('.scroll-wrapper', content).trigger('update');
    };

    this.createOtherTabHeader = function() {
        var charInf = Par.getCharInf();
        return Par.createRecords([charInf[5], charInf[0], charInf[4], charInf[2]], 'table-header interface-element-table-header-1-background');
    };

    this.init = function() {
        var $w = Par.getShowcaseWnd().$;
        content = tpl.get('clan-other-members-content');
        $w.find('.card-content').append(content);
        $('.scroll-wrapper', content).addScrollBar({
            track: true,
            addScrollableClassToAnotherEl: $('.table-header-wrapper', content)
        });
    };

    //this.init();

};