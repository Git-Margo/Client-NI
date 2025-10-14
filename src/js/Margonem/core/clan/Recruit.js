//var wnd = require('@core/Window');
var tpl = require('@core/Templates');
const {
    showProfile
} = require('../HelpersTS');
const OthersContextMenuData = require('@core/characters/OthersContextMenuData');
const Tabs = require('../components/Tabs');
const {
    getIconClose
} = require('@core/HelpersTS');
module.exports = function(Par, otherClan) {
    var content;
    var attrDataTab;
    var self = this;
    var cards;

    this.initCards = function() {
        // cards = [
        // 	['recruit-main', 			self.updateScroll],
        // 	['recruit-candidate', self.clickCuruitCandidate],
        // 	['recruit-invite', 		self.clickRecruitInvite]
        // ];
        cards = [
            'recruit-main',
            'recruit-candidate',
            'recruit-invite'
        ];
    };

    this.updateScroll = function() {
        $('.scroll-wrapper', content).trigger('update');
    };

    this.init = function() {
        this.initContent();
        this.initCards();
        this.initMenu();
        this.initTexts();
        this.initAttrTab();
        this.initTableHeaders();
        //this.initButtonsWrapper();
        this.initInviteBut();
        if (!otherClan) this.initSaveAttrBtn();
    };

    this.initButtonsWrapper = function() {
        var $b1 = tpl.get('button').addClass('small green');
        var $b2 = tpl.get('button').addClass('small');
        $b1.find('.label').html(_t('accept_all'));
        $b2.find('.label').html(_t('refuse_all'));
        content.find('.buttons-wrapper').append($b1);
        content.find('.buttons-wrapper').append($b2);
        $b1.click(function() {
            //console.log(1)
        });
        $b2.click(function() {
            //console.log(2)
        });
    };

    this.clickCuruitCandidate = function() {
        _g('clan&a=recruit_applications_show');
    };

    this.clickRecruitInvite = function() {
        _g('clan&a=invite_show');
    };

    this.getContent = function() {
        return content;
    };

    this.initMenu = function() {
        // var $menu = content.find('.clan-recruit-menu').find('.cards-header');
        // for (var i = 0; i < cards.length; i++) {
        // 	self.createRecruitCardMenu(cards[i], $menu);
        // }


        let tabCards = {
            [cards[0]]: {
                name: Par.tLang(cards[0]),
                initAction: () => {
                    cardCallback(cards[0]);
                    self.updateScroll()
                },
                contentTargetEl: content[0].querySelector(".section-recruit-main")
            },
            [cards[1]]: {
                name: Par.tLang(cards[1]),
                initAction: () => {
                    cardCallback(cards[1]);
                    self.clickCuruitCandidate()
                },
                contentTargetEl: content[0].querySelector(".section-recruit-candidate")
            },
            [cards[2]]: {
                name: Par.tLang(cards[2]),
                initAction: () => {
                    cardCallback(cards[2]);
                    self.clickRecruitInvite()
                },
                contentTargetEl: content[0].querySelector(".section-recruit-invite")
            }
        };

        const tabsOptions = {
            tabsEl: {
                navEl: content[0].querySelector('.clan-recruit-menu')
            }
        };

        this.tabsInstance = new Tabs.default(tabCards, tabsOptions);

        this.tabsInstance.activateCard(cards[0]);
    };

    this.inviteToClan = function() {
        var i = content.find('.player-nick');
        let v = i.val();

        if (checkInputValIsEmptyProcedure(v)) return;

        _g('clan&a=invite&n=' + esc(v), function() {
            i.val('');
        });
    };

    this.initInviteBut = function() {
        var myRank = Par.getProp('myrank');
        var bool = myRank & Math.pow(2, 3) ? 1 : 0;
        if (bool) content.find('.invite-to-clan').find('.input-wrapper').css('display', 'table-cell');
        else {
            //content.find('.input-wrapper').css('display', 'none');
            content.find('.js-rank-hide').css('display', 'none');
            return;
        }
        content.find('.invite-to-clan').find('.label-info').html(Par.tLang('clan_invite_new'));
        var $btn = Par.addControll(Par.tLang('inviteClan'), 'invite-but', self.inviteToClan);
        $btn.addClass('green small');
    };

    // this.createRecruitCardMenu = function (obj, $menu) {
    // 	var name = obj[0];
    // 	var clb = obj[1];
    // 	var text = Par.tLang(name);
    // 	var $div = tpl.get('card').addClass('card-' + name);
    // 	$div.find('.label').html(text);
    //
    // 	$menu.append($div);
    // 	$div.click(function () {
    // 		if (name == 'recruit-candidate' || name == 'recruit-invite') {
    // 			var myRank = Par.getProp('myrank');
    // 			var bool = myRank & Math.pow(2, 3) ? 1 : 0;
    // 			if (!bool) {
    // 				mAlert(_t('accessDenied'));
    // 				return;
    // 			}
    // 		}
    // 		self.showSection(name);
    // 		if (clb) clb();
    // 	});
    // };

    const cardCallback = (name) => {
        if (name == 'recruit-candidate' || name == 'recruit-invite') {
            var myRank = Par.getProp('myrank');
            var bool = myRank & Math.pow(2, 3) ? 1 : 0;
            if (!bool) {
                mAlert(_t('accessDenied'));
                return;
            }
        }
        this.tabsInstance.activateCard(name);
        showSection(name);
        // if (clb) clb();
    }

    this.initTableHeaders = function() {
        var t0 = [
            _t('date', null, 'matchmaking'),
            'Nick',
            _t('th_levelAndProf', null, 'clan'),
            _t('prof_th', null, 'auction'),
            _t('decision', null, 'clan'),
            _t('invitedBy', null, 'clan'),
            _t('delete', null, 'clan')
        ];
        var a = Par.createRecords([t0[0], t0[1], t0[2], t0[4]], 'table-header');
        var b = Par.createRecords([t0[0], t0[1], t0[2], t0[5], t0[6]], 'table-header');
        content.find('.recruit-candidate-table-header').html(a);
        content.find('.recruit-invite-table-header').html(b);
    };

    const showSection = function(name) {
        // content.find('.card').removeClass('active');
        // content.find('.card-' + name).addClass('active');
        content.find('.recruit-section').removeClass('active');
        content.find('.section-' + name).addClass('active');
    };

    this.update = function(v, clanData) {
        if (clanData) {
            this.updateAtributes();
            return;
        }
        if (v.clan_applications) this.updateClanApplications(v.clan_applications);
        if (v.clan_invitations) this.updateClanInvitations(v.clan_invitations);
        self.updateScroll();
    };

    this.updateClanApplications = function(v) {
        var $applicationWrapper = content.find('.recruit-candidate-table');
        $applicationWrapper.find('.one-applicant').remove();
        for (var p in v) {
            var oneP = v[p];
            this.createOneTr(oneP, $applicationWrapper);
        }
    };

    this.updateClanInvitations = function(v) {
        var $applicationWrapper = content.find('.recruit-invite-table');
        $applicationWrapper.find('.one-invitation').remove();
        for (var p in v) {
            var oneP = v[p];
            this.createOneTrInvitation(oneP, $applicationWrapper);
        }
    };

    this.createOneTr = function(oneP, $table) {
        var $accept = tpl.get('button').addClass('small green');
        var $refuse = tpl.get('button').addClass('small');
        //var $wrapper = $('<div>').addClass('buttons-wrapper');
        var $wrapper = tpl.get('clan-recruit-buttons-wrapper');
        var $nick = this.createNickElement(oneP);
        //var $tr = Par.createRecords([convertDateTime(oneP.send_ts, true), $nick, oneP.recruit_lvl + oneP.recruit_prof, $wrapper], 'normal-td');

        //let characterInfo = getCharacterInfo(null, {level: oneP.recruit_lvl, operationLevel: oneP.recruit_oplvl, prof: oneP.recruit_prof});
        let $characterInfoElement = createCharacterInfoElement(oneP);

        var $tr = Par.createRecords([convertDateTime(oneP.send_ts, true), $nick, $characterInfoElement, $wrapper], 'normal-td');
        $tr.addClass('one-applicant');
        $accept.find('.label').html(_t('accept_applicant'));
        $refuse.find('.label').html(_t('refuse_applicant'));
        $wrapper.append($accept);
        $wrapper.append($refuse);
        content.find('.section-recruit-candidate').find('.recruit-candidate-table').append($tr);
        $table.append($tr);
        $accept.click(function() {
            _g('clan&a=recruit_applications_accept&id=' + oneP.id)
        });
        $refuse.click(function() {
            _g('clan&a=recruit_applications_reject&id=' + oneP.id);
        })
    };

    const createCharacterInfoElement = (data) => {
        let characterInfoData = {
            nick: data.recruit_nick,
            level: data.recruit_lvl,
            operationLevel: data.recruit_oplvl,
            prof: data.recruit_prof,
            htmlElement: true
        };

        let $characterInfoWrapper = $('<div>').addClass('character-info-wrapper');
        let characterInfo = getCharacterInfo(characterInfoData);

        $characterInfoWrapper.html(characterInfo);

        //characterInfoData.showNick = true;

        addCharacterInfoTip($characterInfoWrapper, characterInfoData);

        return $characterInfoWrapper;
    }

    this.createOneTrInvitation = function(oneP, $table) {
        var $remove = tpl.get('button').addClass('small red');
        const $closeIcon = getIconClose(false);
        var $wrapper = tpl.get('clan-recruit-buttons-wrapper');
        var $nick = this.createNickElement(oneP);
        //var $tr = Par.createRecords([convertDateTime(oneP.send_ts, true), $nick, oneP.recruit_lvl + oneP.recruit_prof, oneP.recruiter_nick, $wrapper], 'normal-td');

        //let characterInfo = getCharacterInfo(null, {level: oneP.recruit_lvl, operationLevel: oneP.recruit_oplvl, prof: oneP.recruit_prof});
        let $characterInfoElement = createCharacterInfoElement(oneP);

        var $tr = Par.createRecords([convertDateTime(oneP.send_ts, true), $nick, $characterInfoElement, oneP.recruiter_nick, $wrapper], 'normal-td');
        $tr.addClass('one-invitation');
        $remove.append($closeIcon);
        $wrapper.append($remove);
        content.find('.section-recruit-candidate').find('.recruit-candidate-table').append($tr);
        $table.append($tr);
        $remove.click(function() {
            _g('clan&a=invite_cancel&id=' + oneP.id)
        });
    };

    this.updateAtributes = function() {
        var myClanBits = Par.getProp('attributes').toString();
        var ClanAtributes = Par.getClanAtributs();
        var skills = Par.getProp('quest_bonuses');
        var outfit = Par.getProp('has_outfit');
        var level = Par.getProp('level');
        var depoTabs = Par.getProp('depo_tabs');
        var bits = ClanAtributes.getMapOfBits(myClanBits, level, depoTabs, skills, outfit);

        var myRank = Par.getProp('myrank');
        var edit = myRank & 1 ? 1 : 0;
        //this.createAllAtributs(bits, true, 'inInput');
        this.createAllAtributs(bits, edit, edit ? 'inInput' : '.atribute-value');
    };

    //this.createContextMenu = (e, player) => {
    //	const contextMenu = [];
    //
    //	contextMenu.push([
    //		_t('send_message', null, 'chat'),
    //		function () {
    //			Engine.chatController.getChatInputWrapper().setPrivateMessageProcedure(player.nick);
    //		},
    //	]);
    //
    //	contextMenu.push([
    //		_t('show_eq'),
    //		() => {
    //			Engine.showEqManager.update({
    //				id: player.charId,
    //				account: player.accountId,
    //				lvl: player.lvl,
    //				nick: player.nick,
    //				prof: player.prof,
    //				icon: '',
    //				world: Engine.worldConfig.getWorldName(),
    //			});
    //		},
    //	]);
    //
    //	contextMenu.push([
    //		_t('invite_to_friend'),
    //		() => _g('friends&a=finvite&nick=' + player.nick.trim().split(' ').join('_'))
    //	]);
    //
    //	contextMenu.push([
    //		_t('show_profile', null, 'menu'),
    //		() => showProfile(player.accountId, player.charId)
    //	]);
    //
    //	if (contextMenu.length) {
    //		Engine.interface.showPopupMenu(contextMenu, e);
    //		return true;
    //	}
    //	return false;
    //}

    this.createNickElement = (oneP) => {
        const $nick = $('<span>', {
            class: 'clickable clickable--p1'
        }).text(oneP.recruit_nick);
        $nick.on('contextmenu', (e) => {
            //this.createContextMenu(e, { lvl: oneP.recruit_lvl, prof: oneP.recruit_prof, nick: oneP.recruit_nick, charId: oneP.recruit_id, accountId: oneP.recruit_account });

            getEngine().others.createOtherContextMenu(e, {
                lvl: oneP.recruit_lvl,
                prof: oneP.recruit_prof,
                nick: oneP.recruit_nick,
                charId: oneP.recruit_id,
                accountId: oneP.recruit_account
            }, [
                OthersContextMenuData.INVITE_TO_ENEMIES,
                OthersContextMenuData.INVITE_TO_PARTY
            ]);

        });
        $nick.on('click', () => {
            Engine.chatController.getChatInputWrapper().setPrivateMessageProcedure(oneP.recruit_nick);
        });

        return $nick;
    }

    this.initContent = function() {
        var str1 = 'clan-recruit-content';
        var str2 = 'clan-other-recruit-content';
        content = tpl.get(str1);
        if (otherClan) {
            content.removeClass(str1).addClass(str2);
            Par.getShowcaseWnd().$.find('.card-content').append(content);
        } else Par.wnd.$.find('.card-content').append(content);

        content.find('.section-recruit-main').find('.scroll-wrapper').addScrollBar({
            track: true,
            addScrollableClassToAnotherEl: $('.section-recruit-main .table-header-wrapper', content)
        });
        content.find('.section-recruit-candidate').find('.scroll-wrapper').addScrollBar({
            track: true,
            addScrollableClassToAnotherEl: $('.section-recruit-candidate .table-header-wrapper', content)
        });
        content.find('.section-recruit-invite').find('.scroll-wrapper').addScrollBar({
            track: true,
            addScrollableClassToAnotherEl: $('.section-recruit-invite .table-header-wrapper', content)
        });

    };

    this.initTexts = function() {
        var myRank = Par.getProp('myrank');
        var bool = myRank & Math.pow(2, 3) ? 1 : 0;
        if (bool) content.find('.clan-recruit-header-option').find('.header-text').html(Par.tLang('header-option'));
        content.find('.clan-recruit-header-atribute').find('.header-text').html(Par.tLang('header-atribute'));
        content.find('.clan-recruit-header-0').find('.header-text').html(Par.tLang('basic_atributes'));
        content.find('.clan-recruit-header-1').find('.header-text').html(Par.tLang('additional_atributes'));
        if (!otherClan) return;
        content.find('.clan-recruit-header-2').find('.header-text').html(Par.tLang('clan_skills'));
    };

    this.initAttrTab = function() {
        var ClanAtributs = Par.getClanAtributs();
        attrDataTab = ClanAtributs.getAttrDataTab();
    };

    this.initSaveAttrBtn = function() {
        var myRank = Par.getProp('myrank');
        var edit = myRank & 1 ? 1 : 0;
        if (!edit) return;
        var $btn = tpl.get('button').addClass('green small');
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
        if (otherClan) display = t[0];
        else {
            var myRank = Par.getProp('myrank');
            display = myRank & 1 ? t[1] : t[0];
        }
        //content.find('.input-wrapper, .save-atribute-wrapper').css('display', display);
        content.find('.one-clan-atribute').find('.input-wrapper').css('display', display);
    };

    this.cardCallback = cardCallback;
    //this.init();
};