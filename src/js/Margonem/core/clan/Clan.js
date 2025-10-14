//var wnd = require('@core/Window');
var tpl = require('@core/Templates');
var D = require('@core/clan/Diplomacy');
var PE = require('@core/clan/PlayerEdit');
var RE = require('@core/clan/RankEdit');
var S = require('@core/clan/Showcase');
var M = require('@core/clan/Members');
var OC = require('@core/clan/OtherClan');
var OP = require('@core/clan/ClanPage');
var CEP = require('@core/clan/ClanEditPage');
var I = require('@core/clan/ClanInfo');
var T = require('@core/clan/Treasury');
var MA = require('@core/clan/Manage');
var H = require('@core/clan/History');
var CP = require('@core/clan/ClanPage');
var CO = require('@core/clan/ClanOutfit');
var CQ = require('@core/clan/ClanQuests');
var CS = require('@core/clan/ClanSkills');
var CL = require('@core/clan/ClanList');
var FP = require('@core/clan/FindPanel');
var R = require('@core/clan/Recruit');
var RO = require('@core/clan/RecruitOther');
var CA = require('@core/clan/ClanAtributes');
var CB = require('@core/clan/ClanBless');

module.exports = function(clan) {
    var self = this;
    var d;
    var clList = {};
    var content;
    var memberList = {};
    var cards;
    var charInf;
    var clanInf;
    var clanRankInf;

    //class
    var Members;
    var OtherClan;
    var OtherClanRecruit;
    var ClanList;
    var Recruit;
    var FindPanel;
    var ClanAtributes;
    var PlayerEdit;
    var Treasury;
    var Manage;
    var Diplomacy;
    var Info;
    var History;
    var ClanOutfit;
    var RankEdit;
    var Showcase;
    var OfficialPage;
    var OtherClanOfficialPage;
    var PrivPage;
    var EditOfficialPage;
    var EditPrivPage;
    var ClanQuests;
    var ClanSkills;
    var ClanBless;

    this.initTable = function() {
        cards = [
            'clan_info',
            'clan_list',
            'clan-official-page',
            'clan_priv-page',
            'clan_recruit',
            'clan_members',
            'clan_treasury',
            'clan_manage',
            'clan_diplomacy',
            'clan_history',
            'clan_quests',
            'clan_skills'
        ];
        charInf = [
            this.tLang('th_nick'),
            this.tLang('th_location'),
            this.tLang('th_rank'),
            this.tLang('th_status'),
            this.tLang('th_levelAndProf'),
            this.tLang('th_lp')
        ];
        clanInf = [
            this.tLang('clan_name'),
            this.tLang('clan_level'),
            this.tLang('clan_amount_members'),
            this.tLang('clan_info')
        ];
        clanRankInf = [
            this.tLang('creator_th'),
            this.tLang('rank_rEdit'),
            this.tLang('rank_treasury'),
            this.tLang('rank_invite'),
            this.tLang('rank_dismiss'),
            this.tLang('rank_privatepage'),
            this.tLang('rank_officialpage'),
            this.tLang('rank_diplomate'),
            this.tLang('rank_outfit'),
            this.tLang('tabview_th'),
            this.tLang('tabuse_th'),
            this.tLang('tablimit_th')
        ];
    };

    this.update = function(v, allData) {
        this.updateData(v);
        this.updateTitle();
        this.updateRanks(v.ranks, allData);
        this.updateGoldLog(v.goldlog);
        this.updateLabels();
        this.updateLogo(content, d['logo']);
        this.hideOrShowChangeLogoBut();
    };

    this.updateClasses = function() {
        self.updateTreasury(T);
        self.updateManage(MA);
        self.updateHistory(H);
        self.updatePrivPage(CP);
        self.updateOfficialPage();
        self.updateRecruit(false, true);
    };

    this.updateData = function(v) {
        if (!d) {
            var $cards = this.wnd.$.find('.card');
            $cards.removeClass('active');
            $cards.eq(2).addClass('active');
            this.showChooseCard('clan', 'clan-official-page');
            this.updateHeader(this.tLang('clan-official-page'));
            this.initD();
        }
        for (var k in v) {
            d[k] = v[k];
        }
    };

    this.updateRanks = function(ran, allData) {
        var clRank;
        if (isset(allData.h) && isset(allData.h.clan) && isset(allData.h.clan.rank)) clRank = allData.h.clan.rank;
        else clRank = Engine.hero.d.clan.rank;
        if (!ran) {
            d['myrank'] = d['ranks'][clRank].r;
            return;
        }
        var r = ran.split(';');
        var r2 = [];
        for (var i in r) {
            r[i] = r[i].split(',');
            r2[parseInt(r[i][0])] = {
                'name': r[i][1],
                'r': parseInt(r[i][2])
            };
        }
        d['ranks'] = r2;
        d['myrank'] = r2[clRank].r;
    };

    this.updateGoldLog = function(v) {
        if (!v) return;
        var glog = v.split('<br>');
        var log2 = [];
        var s;
        for (var i in glog) {
            s = glog[i].split(';');
            log2[i] = {
                'kind': s[0],
                'txt': s[1]
            };
        }
        d['goldlog'] = log2;
    };

    this.updateLogo = function(con, newUrl, onlyShowcase) {
        var $e = con.find('.clan-emblem');
        this.updateShowcaseLogo(newUrl);
        if (!onlyShowcase) this.updateClasListLogo(newUrl);
        this.setLogo($e, newUrl);
    };

    this.updateClasListLogo = function(newUrl) {
        if (!ClanList) return;
        var $logoClList = this.wnd.$.find('.my-clan-list-clan>td>.logo');
        this.setLogo($logoClList, newUrl, true);
    };

    this.updateShowcaseLogo = function(l) {
        var myclan = clList[Engine.hero.d.clan];
        if (!Showcase || !myclan) return;
        var $sw = Showcase.wnd.$;
        var $e = $sw.find('.clan-emblem');
        var $showcaseClName = $sw.find('.clan-name>.val').html();
        var clName = myclan.name;
        if ($showcaseClName == clName) this.setLogo($e, l);
    };

    this.setLogo = function($e, url, clanListLogo) {
        var option = url ? 1 : 0;
        if (clanListLogo && option == 0) option = 2;
        var t = [
            ['#000', ''],
            ['#000 url(' + url + ') center no-repeat'],
            ['url()', '']
        ];
        $e.css({
            'background': t[option][0]
        });
        if (option === 1) {
            $e.addClass('hasImage');
        } else {
            $e.removeClass('hasImage');
        }
    };

    this.updateClanList = function(v) {
        //if (!ClanList) {
        //	ClanList = new CL(self);
        //	FindPanel = new FP(self);
        //	ClanList.update(v);
        //} else ClanList.update(v);
        ClanList.update(v);
        self.updateClList(v);
    };

    this.updateTreasury = function(T) {
        if (!Treasury) {
            Treasury = new T(self);
            Treasury.init();
        }
        Treasury.update();
    };

    this.updateManage = function(MA) {
        if (!Manage) {
            Manage = new MA(self);
            Manage.init();
        }
        Manage.update();
    };

    this.updateHistory = function(H) {
        if (!History) {
            History = new H(self);
            History.init();
        }
        History.update();
    };

    this.updatePrivPage = function(PP) {
        if (!PrivPage) {
            PrivPage = new PP(self, 'priv-page', 'clan');
            PrivPage.init();
        }
        PrivPage.update();
    };

    this.updateClanQuests = function(v) {
        ClanQuests.update(v);
    };

    this.updateClanSkills = function(v) {
        ClanSkills.update(v);
    };

    this.updateClanBless = function(v) {
        if (!ClanBless) {
            ClanBless = new CB(self);
            ClanBless.init();
        }
        ClanBless.update(v);
    };

    this.updateRecruit = function(v, clanData) {
        if (!Recruit) {
            Recruit = new R(self);
            Recruit.init();
        }
        Recruit.update(v, clanData);
    };

    this.updateAttributes = function(v) {
        var bits = v[3];
        OtherClanRecruit.createAllAtributs(bits, false, '.atribute-value');
    };

    this.updateShowcase = function(v) {
        Showcase.updateInfo(v);
        this.updateAttributes(v);
        OfficialPage.updateScroll();
    };

    this.updateMembers = function(v) {
        Members.update(v);
    };

    this.updateOtherClan = function(v) {
        var CA = self.getClanAtributs();
        var skills = self.createSkills(v);
        var attrData = CA.getMapOfBits(v.attributes, v.level, v.depo_tabs, skills, v.has_outfit);
        var numberOfMembers = v.members.length / 6;
        var val = [
            //v.name, v.level, v.depo_tabs, v.members2.length / 5, 'meee?', v.logo, attrData
            v.name, v.level, numberOfMembers, attrData
        ];
        this.updateShowcase(val);
        OtherClan.update(v);
        this.updateLogo(Showcase.wnd.$, v.logo, true);
    };

    this.updatePlayerEdit = function(v) {
        PlayerEdit.update(v);
    };

    this.updateRankEdit = function(v) {
        RankEdit.update(v);
    };

    this.updateDiplomacy = function(v, fOrE) {
        Diplomacy['update' + fOrE](v);
    };

    this.updateOfficialPage = function() {
        OfficialPage.update();
    };

    this.updateOtherClanOfficialPage = function(v) {
        OtherClanOfficialPage.showOtherClanOfficial();
        OtherClanOfficialPage.update(v);
    };

    this.updateEditPrivPage = function(v) {
        EditPrivPage.update(v);
    };

    this.updateEditOfficialPage = function(v) {
        EditOfficialPage.update(v);
    };

    this.updateClanOutfit = function(v) {
        if (!ClanOutfit) {
            ClanOutfit = [];
            ClanOutfit.push(new CO);
            ClanOutfit.push(new CO);
            self.updateDataToOutfits(v);
        } else this.updateDataToOutfits(v);
    };

    this.updateDataToOutfits = function(v) {
        if (v) {
            ClanOutfit[0].update(content, v[0], v[1]);
            ClanOutfit[1].update(content, v[2], v[3]);
        } else {
            ClanOutfit[0].remove();
            ClanOutfit[1].remove();
        }
    };

    this.updateTitle = function() {
        this.wnd.$.find('.clan-name>.name').removeClass('no-clan').text(d['name']);
    };

    this.updateHeader = function(text) {
        self.wnd.$.find('.header').html(text);
    };

    this.updateClList = function(data) {
        clList = data;
    };

    this.init = function() {
        this.initWindow();
        this.initTable();
        this.createAllCards();
        this.initButtons();
        this.initClass();
        this.wnd.center();
        this.showChooseCard('clan', 'clan-info');
        this.updateLabels(true);
        this.updateLogo(content);
        this.initHoverLogo(this.wnd.$);
        $('.scroll-wrapper', content).trigger('update');
    };

    this.initD = function() {
        d = {};
        content.find('.clan-look-for-clan-btn').css('display', 'none');
        content.find('.clan-showcase-but').css('display', 'block');
        content.find('.stats').css('display', 'block');
        this.showCards();
        $('.scroll-wrapper', content).trigger('update');
    };

    this.initHoverLogo = function($w) {
        var $b = $w.find('.edit-logo-but');
        var $ce = $w.find('.clan-emblem');
        $ce.add($b).hover(
            function() {
                $b.css('opacity', 1);
            },
            function() {
                $b.css('opacity', 0);
            })
    };

    this.initButtons = function() {
        var str1 = this.tLang('clan_showcase');
        var str2 = this.tLang('create_clan');
        var but1 = this.addControll(str1, 'clan-showcase-but', this.showcaseButClick);
        var but2 = this.addControll(str2, 'clan-look-for-clan-btn', this.createClan);
        but1.addClass('green small');
        but2.addClass('green small');
    };

    this.showcaseButClick = function() {
        var id = d['id'];
        _g("clan&a=getclan&id=" + id);
    };

    this.createClan = function() {
        //var str = self.tLang('give_clan_name');
        //var re = 'clan&a=create&name=';
        //askAlert({q: str, re: re, m: 'input2'});
        _g('clan&a=create');
    };

    this.createEditLogoBut = function($w) {
        var txt = this.tLang('edit_logo');
        var $but = self.addControll(txt, 'edit-logo-but', this.changeLogo, $w);
        $but.addClass('small green');
    };

    this.changeLogo = function() {
        var str = self.tLang('logo_url');
        var re = 'clan&a=save&f=logo&v=';
        askAlert({
            q: str,
            re: re,
            m: 'input2',
            inputCheck: this.checkHttps
        });
    };

    this.checkHttps = (url) => {
        if (url === '') return true;
        const isHttps = url.startsWith("https://");
        if (isHttps) {
            return true;
        } else {
            mAlert(_t('https_alert', null, 'clan'));
            return false;
        }
    };

    this.hideOrShowChangeLogoBut = function() {
        var t = [
            'none', 'block'
        ];
        var bool = this.canChangeLogo();
        var $b = content.find('.edit-logo-but');
        $b.css('display', bool ? t[1] : t[0]);
    };

    this.canChangeLogo = function() {
        return d['myrank'] & 1;
    };

    this.initClass = function() {
        ClanList = new CL(self);
        ClanList.init();
        ClanAtributes = new CA(self);
        FindPanel = new FP(self);
        FindPanel.init();
        Info = new I(self);
        Info.init();
        Diplomacy = new D(self);
        Diplomacy.init();
        Showcase = new S(self);
        Showcase.init();
        PlayerEdit = new PE(self);
        PlayerEdit.init();
        RankEdit = new RE(self);
        RankEdit.init();
        Members = new M(self);
        Members.init();
        OtherClan = new OC(self);
        OtherClan.init();
        OfficialPage = new OP(self, 'official-page', 'clan');
        OfficialPage.init();
        OtherClanOfficialPage = new OP(self, 'official-page', 'showcase');
        OtherClanOfficialPage.init();
        EditPrivPage = new CEP(self, 'priv-page', 'clan');
        EditOfficialPage = new CEP(self, 'official-page', 'clan');
        EditPrivPage.init();
        EditOfficialPage.init();
        //ClanAtributes = new CA(self);
        //Recruit = new R(self);
        OtherClanRecruit = new RO(self, true);
        OtherClanRecruit.init();
        ClanBless = new CB(self);
        ClanBless.init();
        ClanSkills = new CS(self);
        ClanSkills.init();
        ClanQuests = new CQ(self);
        ClanQuests.init();
    };

    this.updateLabels = function(onlyInit) {
        if (onlyInit) {
            content.find('.stats').css('display', 'none');
            return;
        }
        //if (isset(d.bits)) content.find('.clan-level').html(d.level).tip(this.tLang('clan_level') + ': ' +d.level);
        if (isset(d.bits)) content.find('.clan-level').html(this.tLang('clan_level') + ': ' + d.level);
        //if (isset(d.mlist)) content.find('.clan-member-amount').html(self.tLang('clan_amount_members') + '<span>' + (d.mlist.length / 2) + '</span>');
        if (isset(d.mlist)) content.find('.clan-member-amount').html(self.tLang('clan_amount_members') + ": " + (d.mlist.length / 2));
        if (isset(d.attributes)) {
            var atributes = self.getProp('attributes');
            var v = (atributes >> 21) & 3;
            var str = v ? v == 1 ? _t('open_recruit') : _t('free recruitment') : _t('close_recruit');

            //content.find('.clan-recruit-state').html(self.tLang('rank_inviting') + '<br><span>' + str + '</span>');
            content.find('.clan-recruit-state').html(self.tLang('rank_inviting') + ': ' + str);
        }
    };

    this.showChooseCard = function(which, name) {
        var $o;
        switch (which) {
            case 'clan':
                $o = self.wnd.$;
                break;
            case 'showcase':
                $o = Showcase.wnd.$;
                break;
        }
        var $ch = $o.find('.card-content').children();
        var name = name.replace('_', '-') + '-content';
        $ch.css('display', 'none');
        $o.find('.' + name).css('display', 'block');
    };

    this.createAllCards = function() {
        var pane = this.wnd.$.find('.scroll-pane');
        for (var i = 0; i < cards.length; i++) {
            this.createCard('clan', pane, cards[i]);
            this.hideCards(i);
        }
        this.wnd.$.find('.card').eq(0).addClass('active');
        this.updateHeader(this.tLang(cards[0]));
    };

    this.createCard = function(which, $menu, name) {
        var text = self.tLang(name);
        //var $div = $('<div>').addClass('card');
        //var $label = $('<span>').html(text);
        var $div = tpl.get('card');
        $div.find('.label').html(text);
        $div.find('.label').attr('name', text);
        var func = name.substring(5);
        $div.attr('data-card', func);
        $menu.append($div);
        //$div.append($label);
        $div.click(function() {
            var bool = name == 'clan_info' || name == 'clan_list';
            if (
                which == 'clan' && !d && !bool ||
                self.breakSwitch(func)
            ) return;

            self.setActiveTab(func, $menu);

            if (which == 'clan') self.updateHeader(text);
            self.showChooseCard(which, name);
            $('.scroll-wrapper', '.clan-' + func + '-content').trigger('update');
        });
    };

    this.setActiveTab = (name, $menu = null) => {
        $menu = $menu === null ? this.wnd.$.find('.left-column .scroll-pane') : $menu;
        $menu.find(`.card[data-card="${name}"]`).addClass('active')
            .siblings('.card').removeClass('active');
    };

    this.breakSwitch = function(func) {
        var f = self[func + 'Click'];
        if (!f) return false;
        if (f()) return true;
    };

    this.recruitClick = function() {
        // Recruit.showSection('recruit-main');
        Recruit.cardCallback('recruit-main');
        return false;
    };

    this.listClick = function() {
        _g('clan&a=list&page=1');
        FindPanel.hideFindPanel();
        return false;
    };

    this.membersClick = function() {
        _g('clan&a=members');
        return false;
    };

    this.diplomacyClick = function() {
        _g('clan&a=dipl');
        return false;
    };

    this.skillsClick = function() {
        _g('clan&a=skills_show');
        return false;
    };

    this.questsClick = function() {
        _g('clan&a=quests_show');
        return false;
    };

    this.hideCards = function(nr) {
        if (nr == 0 || nr == 1) return;
        content.find('.card').eq(nr).hide();
    };

    this.showCards = function() {
        content.find('.card').show();
    };

    this.alert = function(msg, f) {
        mAlert(msg, [{
            txt: self.tLang('yes'),
            callback: function() {
                f();
                return true;
            }
        }, {
            txt: self.tLang('no'),
            callback: function() {
                return true;
            }
        }]);
    };

    this.createRecords = function(ob, addClass) {
        var $tr = $('<tr>');
        for (var i = 0; i < ob.length; i++) {
            var $td = $('<td>').html(ob[i]);
            if (typeof addClass == 'object') {
                $td.addClass(addClass[i]);
            } else {
                $td.addClass(addClass);
            }
            $tr.append($td);
        }
        return $tr;
    };

    this.addControll = function(label, where, callback, wnd) {
        var $btn = tpl.get('button');
        if (callback) $btn.click(callback.bind(self));
        $btn.find('.label').html(label);
        wnd = wnd ? wnd : this.wnd.$;
        wnd.find('.' + where).append($btn);
        return $btn;
    };

    this.createOneMember = function(v, edit, addGroup) {
        let online;
        let $mem = tpl.get('clan-member');
        let $info = v[1];
        let lastVisit = escapeHTML(v[5]) + ' (' + v[6] + ', ' + v[7] + ')';

        if (v[9] == 0) online = tpl.get('online-status').addClass('online-status green').html('online');
        else {
            let str =
                '<div class="online-status">offline</div>' +
                '<div class="time-offline" time-offline="' + v[9] + '">' +
                calculateDiff(v[9]) +
                '</div>';
            online = tpl.get('online-status-wrapper').addClass('red v-item').html(str);
        }

        let allR = d['ranks'];
        let rankName = allR[v[8]].name;
        let $rank = tpl.get('member-rank').html(rankName);
        let url = CFG.a_opath + v[10];
        let $levelAndProf = tpl.get('level-and-prof');
        //let $memberLvl    = tpl.get('member-lvl').html(v[2]+v[3]);

        let characterInfoData = {
            nick: v[1],
            prof: v[4],
            level: v[2],
            operationLevel: v[3],
            htmlElement: true
        };
        let $memberLvl = tpl.get('member-lvl').html(getCharacterInfo(characterInfoData));
        $memberLvl.attr("val-to-amount-sort", characterInfoData.level)
        addCharacterInfoTip($memberLvl, characterInfoData);

        $rank.tip(rankName);
        $rank.attr('id-rank', v[8]);
        $levelAndProf.append($memberLvl);

        createImgStyle($mem.find('.icon-wrapper'), url);
        $mem.find('.char-stats').html($info);
        $mem.find('.last-visit').html(lastVisit);

        if (addGroup) Members.createAddToGroup($mem, v[0]);

        if (edit) {
            Members.createButRankEdit($mem, v[8], v[0], v[1]);
        }
        return this.createRecords([$mem, $levelAndProf, $rank, online], 'normal-td big-height-td');
    };

    this.createPlaceHolder = function(name, txt, con) {
        var input = con.find(name);
        input.attr('placeholder', txt);
    };

    this.amountNumericalRights = function(i, r) {
        var val = 0;
        switch (i) {
            case 9:
                val = (r & (0x200 + 0x400 + 0x800)) >> 9;
                break;
            case 10:
                val = (r & (0x1000 + 0x2000 + 0x4000)) >> 12;
                break;
            case 11:
                val = (r & (0x8000 + 0x10000)) >> 15;
                break;
        }
        return val;
    };

    this.initWindow = function() {
        content = tpl.get('clan');

        Engine.windowManager.add({
            content: content,
            title: self.tLang('clan_title'),
            //nameWindow        : 'clanWnd',
            nameWindow: Engine.windowsData.name.CLAN_WND,
            widget: Engine.widgetsData.name.CLAN,
            objParent: self,
            nameRefInParent: 'wnd',
            startVH: 60,
            cssVH: 60,
            onclose: () => {
                self.close();
            }
        });

        let disabled = self.tLang('haveNotClan');
        self.wnd.show();
        self.wnd.addToAlertLayer();
        content.find('.clan-name>.name').addClass('no-clan').html(disabled);
        $('.scroll-wrapper', content).addScrollBar({
            track: true
        });
    };

    this.close = function() {
        //self.wnd.$.remove();
        self.wnd.remove();
        Showcase.close();
        Engine.clan = false;
        //Engine.tpls.removeCallback('q', ClanQuests.newBringItem);
        Engine.tpls.removeCallback(Engine.itemsFetchData.NEW_BRING_CLAN_QUEST_TPL);
        Engine.tpls.removeCallback(Engine.itemsFetchData.NEW_BLESS_TPL);
        Engine.tpls.deleteMessItemsByLoc('q');
        Engine.tpls.deleteMessItemsByLoc('b');
        //delete (self.wnd);
        //delete(self);
    };

    this.createSkills = function(data) {
        return {
            'maxParticipants': {
                'lvl': data['maxParticipants']
            },
            'expBonus': {
                'lvl': data['expBonus']
            },
            'questExpBonus': {
                'lvl': data['questExpBonus']
            },
            'allyEnemyCount': {
                'lvl': data['allyEnemyCount']
            },
            'blessing': {
                'lvl': data['blessing']
            },
            'cursedItem': {
                'lvl': data['cursedItem']
            },
            'healPower': {
                'lvl': data['healPower']
            },
            'timeTickets': {
                'lvl': data['timeTickets']
            }
        };
    };

    this.getProp = function(name) {
        if (!d) return false;
        return d[name];
    };

    this.getMemberList = function() {
        return memberList;
    };

    this.getOtherClan = function(id) {
        var obj = {};
        var length = clList['id'].length;
        for (var i = 0; i < length; i++) {
            if (id == clList['id'][i]) break;
        }
        for (var k in clList) {
            obj[k] = clList[k][i];
        }
        return obj;
    };

    this.getOtheClanModule = () => {
        return OtherClan;
    }

    this.getCharInf = function() {
        return charInf;
    };

    this.getClanInf = function() {
        return clanInf;
    };

    this.getClanRankInf = function() {
        return clanRankInf;
    };

    this.getShowcaseWnd = function() {
        return Showcase.wnd;
    };

    this.getRecruit = function() {
        return Recruit;
    };

    this.getClanList = function() {
        return ClanList;
    };

    this.getOtherClanRecruit = function() {
        return OtherClanRecruit;
    };

    this.getClanAtributs = function() {
        return ClanAtributes;
    };

    this.tLang = function(name, other) {
        return _t(name, null, other ? other : 'clan');
    };

    //this.init();
};