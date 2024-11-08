//var wnd = require('core/Window');
var tpl = require('core/Templates');
module.exports = function(Par) {
    var self = this;
    var content;
    var prepareToSort;
    var lastSortChoice = 'invertrank';

    this.createTabHeaderMemberList = function() {
        var charInf = Par.getCharInf();
        var $nickLoc = $('<div>').html(charInf[0] + '/' + charInf[1]);
        var $profAndLevel = $('<div>').html(charInf[4]);
        var $rank = $('<div>').html(charInf[2]);
        var status = $('<div>').html(charInf[3]);
        $nickLoc.tip(_t('sortForName'));
        $profAndLevel.tip(_t('sortForLvl'));
        $rank.tip(_t('sortForRank'));
        status.tip(_t('sortForStatus'));
        return Par.createRecords([$nickLoc, $profAndLevel, $rank, status], 'table-header hover-header header-sort');
    };

    this.update = function(v) {
        this.clearTable();
        for (var i = 0; i < v.length; i += 10) {
            var sliceD = v.slice(i, i + 10);
            var $tr = Par.createOneMember(sliceD, true, true);
            var id = sliceD[0];
            var memberList = Par.getMemberList();
            prepareToSort.push($tr);
            memberList[id] = sliceD;
        }
        this.createMembersListTable('invertrank');
    };

    this.clearTable = function() {
        prepareToSort = [];
        for (var i = 0; i < prepareToSort.length; i++) {
            prepareToSort[i].remove();
            delete prepareToSort[i];
        }
    };

    this.deleteTable = function() {
        content.find('.clan-members-table').detach();
        content.find('.clan-members-table').remove();
    };

    this.createMembersListTable = function(type) {
        var header = this.createTabHeaderMemberList();
        var $tableHeader = content.find('.clan-members-table-header');
        var $table = $('<table>').addClass('clan-members-table table-content');
        var sortedArray = this.getSortedTable(type);
        this.deleteTable();
        for (var k in sortedArray) {
            var $tr = sortedArray[k];
            $table.append($tr);
        }

        $tableHeader.html(header);
        content.find('.scroll-pane').append($table);
        this.createHeaderSortButtons();
        $('.scroll-wrapper', content).trigger('update');
    };

    this.createHeaderSortButtons = function() {
        var $firstTr = content.find('.clan-members-table-header tr');
        for (var i = 0; i < 4; i++) {
            this.clickSort($firstTr, i);
        }
    };

    this.clickSort = function($firstTr, i) {
        var t = ['name', 'lvl', 'rank', 'status'];
        var $e = $firstTr.children().eq(i);
        if (i === 2) self.setArrows(i, false);
        $e.click(function() {
            var choice = t[i];
            var bool = lastSortChoice == choice;
            if (bool) lastSortChoice = 'invert' + choice;
            else lastSortChoice = choice;
            self.createClanListTable(lastSortChoice);
            self.setArrows(i, !bool);
        });
    };

    this.createClanListTable = function(type) {
        var header = this.createTabHeaderMemberList();
        var $tableHeader = content.find('.clan-members-table-header');
        var $table = $('<table>').addClass('clan-members-table table-content');
        var sortedArray = this.getSortedTable(type);
        this.deleteTable();
        for (var k in sortedArray) {
            var $tr = sortedArray[k];
            $table.append($tr);
        }

        $tableHeader.html(header);
        content.find('.scroll-pane').append($table);
        this.createHeaderSortButtons();
        $('.scroll-wrapper', content).trigger('update');
    };

    this.getSortedTable = function(type) {
        switch (type) {
            case 'name':
                return this.sortByName(prepareToSort, '.char-stats');
            case 'invertname':
                return this.sortByName(prepareToSort, '.char-stats', true);
            case 'lvl':
                return this.sortByAmount(prepareToSort, '.member-lvl');
            case 'invertlvl':
                return this.sortByAmount(prepareToSort, '.member-lvl', true);
            case 'rank':
                return this.sortByRank(prepareToSort, '.member-rank');
            case 'invertrank':
                return this.sortByRank(prepareToSort, '.member-rank', true);
            case 'status':
                return this.sortByOnline(prepareToSort, '.online-status');
            case 'invertstatus':
                return this.sortByOnline(prepareToSort, '.online-status', true);
        }
    };

    this.sortByRank = function(o, selector, invert) {
        var array = [];
        for (var k in o)
            array[k] = o[k];
        array.sort(function(a, b) {
            var nA = parseInt(a.find(selector).attr('id-rank'));
            var nB = parseInt(b.find(selector).attr('id-rank'));
            if (invert) return nB - nA;
            else return nA - nB;
        });
        return array;
    };

    this.sortByOnline = function(o, selector, invert) {
        var array = [];
        var online = [];
        for (var k in o) {
            if (o[k].find(selector).html() != 'online') array.push(o[k]);
            else online.push(o[k]);
        }

        array.sort(function(a, b) {
            return self.orderPlayerPerTimeOffline(a, b, invert);
        });

        for (var i = 0; i < online.length; i++) {
            if (invert) array.push(online[i]);
            else array.unshift(online[i]);
        }
        return array;
    };

    this.orderPlayerPerTimeOffline = function(a, b, invert) {
        var aVal = parseInt(a.find('.time-offline').attr('time-offline'));
        var bVal = parseInt(b.find('.time-offline').attr('time-offline'));
        if (invert) return bVal - aVal;
        else return aVal - bVal;
    };

    this.sortByName = function(o, selector, invert) {
        var array = [];
        for (var k in o)
            array[k] = o[k];
        array.sort(function(a, b) {
            var nA = a.find(selector).text().toLowerCase()[0];
            var nB = b.find(selector).text().toLowerCase()[0];
            if (invert) return (nA > nB) ? -1 : (nA < nB) ? 1 : 0;
            else return (nA < nB) ? -1 : (nA > nB) ? 1 : 0;
        });
        return array;
    };

    this.sortByAmount = function(o, selector, invert) {
        var array = [];
        for (var k in o)
            array[k] = o[k];
        array.sort(function(a, b) {
            var nA = parseInt(a.find(selector).html());
            var nB = parseInt(b.find(selector).html());
            if (invert) return nB - nA;
            else return nA - nB;
        });
        return array;
    };

    this.setArrows = (colIndex, isAsc) => {
        const $el = content.find(`.clan-members-table-header tr td:eq(${colIndex})`);
        const cl = isAsc ? 'header-sort--asc' : 'header-sort--desc';
        $el.removeClass('header-sort--asc header-sort--desc').addClass(cl);
        $el.siblings('td').removeClass('header-sort--asc header-sort--desc');
    };

    this.createButRankEdit = function($mem, r, id, name) {
        var myrank = Par.getProp('myrank');
        var edit = myrank & 19;
        var clRank = Engine.hero.d.clan.rank;
        if (!edit || r >= clRank) return;
        var $but = tpl.get('button').addClass('small green');
        var bck = $('<div>').addClass('add-bck');
        $mem.find('.edit').append($but);
        $but.tip(_t('memberManage'));
        $but.append(bck);
        $but.tip(Par.tLang('redit_td'));
        $but.click(function() {
            var memberList = Par.getMemberList();
            var member = memberList[id];
            var str = $('<div>', {
                class: 'player-edit-title',
            }).html(_t('player_edit', null, 'clan')).prop('outerHTML') + name;
            Par.updatePlayerEdit(member);
            Par.showChooseCard('clan', 'clan-edit');
            Par.updateHeader(str);
        });
    };

    this.createAddToGroup = function($mem, id) {
        var hId = Engine.hero.d.id;
        if (hId == id) return;
        var $but = tpl.get('button').addClass('small green');
        var bck = $('<div>').addClass('add-bck');
        $but.tip(_t('sendInviteToGroup'));
        $mem.find('.add-to-group').append($but);
        $but.append(bck);
        $but.tip(_t('team_invite', null, 'menu'));
        $but.click(function() {
            _g('party&a=inv&id=' + id);
        });
    };

    this.hideDisableCards = function() {
        var $w = Par.getShowcaseWnd().$;
        var $card = $w.find('.card');
        $card.eq(1).add($card.eq(3)).css('display', 'inline-block');
        $card.eq(4).css('display', 'none');
    };

    this.init = function() {
        content = tpl.get('clan-members-content');
        Par.wnd.$.find('.card-content').append(content);
        $('.scroll-wrapper', content).addScrollBar({
            track: true,
            addScrollableClassToAnotherEl: $('.table-header-wrapper', content)
        });
    };

    //this.init();

};