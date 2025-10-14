/**
 * Created by Michnik on 2016-01-08.
 */
//var Interface = require('@core/Interface');
var tpl = require('@core/Templates');
var BattleLogHelpWindow = require('@core/battle/BattleLogHelpWindow');


module.exports = function() {
    var self = this;
    var $msgWrapper = null;
    //var $content = $('[data-section="log"]');
    var $content = null;
    //this.forumLog = [];
    this.forumLog = null;

    let show = false;
    let battleLogHelpWindow;
    //this.init = function () {
    //	$content = $('[data-section="log"]');
    //	$msgWrapper = $content.find('.battle-messages-wrapper .scroll-pane');
    //	$content.find('.copy-btn').click(self.copyForumLog);
    //	$('.battle-messages-wrapper', $content).addScrollBar({track: true});
    //};

    this.init = function() {
        $content = $('.battle-controller .left-column');
        $msgWrapper = $content.find('.scroll-pane');
        //$content.find('.copy-btn').click(self.copyForumLog);
        $('.scroll-wrapper', $content).addScrollBar({
            track: true
        });
        battleLogHelpWindow = new BattleLogHelpWindow();
        battleLogHelpWindow.init();
    };

    this.addToLogLogContent = ($logContent) => {
        let $clone = $logContent.clone()
        $msgWrapper[0].innerHTML += $logContent[0].innerHTML

        battleLogHelpWindow.addToLogLogContent($clone);
    }

    this.open = function() {
        show = true
        this.forumLog = [];
        self.updateScroll();

        self.showBattleLogHelpWindow();
    };

    this.updateScroll = function() {
        //$('.scroll-wrapper', $content).trigger('update');
        battleLogHelpWindow.updateScrollbar();
        $('.scroll-wrapper', $content).trigger('updateWhenBottom');
    };

    this.close = function() {
        show = true

        self.hideBattleLogHelpWindow();
        //Interface.leftColumn.hideSection('log');
    };

    this.showBattleLogHelpWindow = () => {
        battleLogHelpWindow.show();
    };

    this.hideBattleLogHelpWindow = () => {
        battleLogHelpWindow.hide();
    };

    this.getShow = function() {
        return show;
    };

    this.clear = function() {
        //$msgWrapper.html('');
        $msgWrapper.empty()
        battleLogHelpWindow.clear();
    };

    this.toggleAttachBattleLogHelpWindow = () => {
        battleLogHelpWindow.toggleAttach();
    }

    this.reload = function(a, b) {
        self.clear();
        //self.battleMsg('0;0;txt=' + _t('battle_starts_between %grp1% %grp2%', {
        //		'%grp1%': a.join(', '),
        //		'%grp2%': b.join(', ')
        //	}));
        self.battleMsg('0;0;txt=' + _t('battle_starts_between %grp1% %grp2%', {
            '%grp1%': a,
            '%grp2%': b
        }));
        self.updateScroll();
    };

    this.copyForumLog = function() {
        var $copyContent = document.createElement("textarea");
        $copyContent.style.position = 'absolute';
        $copyContent.style.opacity = '0';
        $copyContent.value = self.forumLog.join("\n");
        document.body.appendChild($copyContent);
        $copyContent.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.log("Your browser doesn't support copy button");
        }
        document.body.removeChild($copyContent);
    };

    this.battleMsg = function(msg, init, allM, indexMsg, $battleMessageWrapper) {
        var tmpMsg = msg;
        msg = msg.split(';');
        if (!isset(init)) init = false;
        var id1 = 0,
            id2 = 0,
            dotHp = false;
        if (msg[0].indexOf('=') > 0) {
            var tmp = msg[0].split('=');
            id1 = parseInt(tmp[0]); //&&init
            if (isset(Engine.battle.getShow()) && isset(Engine.battle.warriorsList[id1])) {
                Engine.battle.warriorsList[id1].correctHpp = Engine.battle.warriorsList[id1].hpp;
                Engine.battle.warriorsList[id1].hpp = parseInt(tmp[1]);
            }
            dotHp = true;
        } else id1 = parseInt(msg[0]);
        if (msg[1].indexOf('=') > 0) {
            var tmp = msg[1].split('=');
            id2 = parseInt(tmp[0]); //&&init
            if (isset(Engine.battle.getShow()) && isset(Engine.battle.warriorsList[id2])) {
                Engine.battle.warriorsList[id2].correctHpp = Engine.battle.warriorsList[id2].hpp;
                Engine.battle.warriorsList[id2].hpp = parseInt(tmp[1]);
            }
        } else id2 = parseInt(msg[1]);
        var f1;
        var f2;
        var g1 = '(a)';
        var g2 = '(a)';
        if (isset(Engine.battle.getShow())) {
            if (id1) {
                f1 = Engine.battle.warriorsList[id1];
            } else {
                f1 = {
                    name: 'BÅÄD#1!'
                };
            }
            if (id2) {
                f2 = Engine.battle.warriorsList[id2];
            } else {
                f2 = {
                    name: 'BÅÄD#1!'
                };
            }
        }

        if (isset(f1) && f1.gender != 'x') g1 = f1.gender == 'k' ? 'a' : ''; //gender1
        if (isset(f2) && f2.gender != 'x') g2 = f2.gender == 'k' ? 'a' : ''; //gender2
        // in strings: #=g1, $=g2
        msg.splice(0, 2);

        var tm = ['', '', ''],
            type = '',
            attack = '',
            take = '',
            takenum = 0;

        var isDot = id1 != 0 && id2 == 0 && dotHp; //current message is 'damage over time' effect description
        var tmpName = '';
        for (var k in msg) {
            tmpName = f1.name;
            if (k == (msg.length - 1) && isDot) {
                f1.name += '(' + f1.hpp + '%)';
            }
            var m = msg[k].split('=');

            Engine.battle.battleEffectsController.manageBattleEffects(m[0], m[1], f1, f2, msg, allM, indexMsg);

            switch (m[0]) {
                case 'winner':
                    //self.hideAutoBtn();
                    if (m[1] == '?') tm[1] += _t('battle_no_winner', null, 'battle'); //'Walka nie wyÅoniÅa zwyciÄzcy.'
                    else {
                        if (m[1].indexOf(',') < 0) {
                            var g1 = '';
                            for (var i in Engine.battle.warriorsList)
                                if (Engine.battle.warriorsList[i].name == m[1] && Engine.battle.warriorsList[i].gender == 'k') g1 = 'a';
                                else if (Engine.battle.warriorsList[i].name == m[1] && Engine.battle.warriorsList[i].gender == 'x') g1 = '(a)';
                            tm[1] += _t('winner_is %name% %posfix%', {
                                '%posfix%': g1,
                                '%name%': m[1]
                            }, 'battle'); //'ZwyciÄÅ¼yÅ'+g1+' '+m[1]+'.'
                        } else tm[1] += _t('winner_team_is %name% %posfix%', {
                            '%name%': m[1]
                        }, 'battle'); //'ZwyciÄÅ¼yÅa druÅ¼yna: '+m[1]+'.'
                    }
                    type = 'win';
                    break;
                case 'loser':
                    if (m[1].indexOf(',') < 0) {
                        var g1 = '';
                        for (var i in Engine.battle.warriorsList)
                            if (Engine.battle.warriorsList[i].name == m[1] && Engine.battle.warriorsList[i].gender == 'k') g1 = 'a';
                            else if (Engine.battle.warriorsList[i].name == m[1] && Engine.battle.warriorsList[i].gender == 'x') g1 = '(a)';
                        tm[1] += _t('loser_is %name% %posfix%', {
                            '%posfix%': g1,
                            '%name%': m[1]
                        }, 'battle'); //'PolegÅ:'+g1+' '+m[1]+'.'
                    } else tm[1] += _t('loser_team_is %name% %posfix%', {
                        '%name%': m[1]
                    }, 'battle'); //'PolegÅa druÅ¼yna: '+m[1]+'.'
                    type = 'lose';
                    break;
                case 'flee':
                    let splittedMsg = tmpMsg.split(';')
                    const [playerId, playerHp] = splittedMsg[0].split('=');
                    tm[1] += _t('msg_flee %name% %hp%', {
                        '%name%': tmpName,
                        '%hp%': playerHp + '%'
                    });
                    type = 'txt';
                    break;
                case 'txt':
                    tm[1] += m[1];
                    type = 'txt';
                    break;
                case 'loot':
                    tm[1] += _t('msg_loot %name% %g1% %m1%', {
                        '%name%': f1.name,
                        '%g1%': g1,
                        '%m1%': m[1]
                    }); //f1.name+' zdobyÅ'+g1+' '+m[1]
                    type = 'loot';
                    break;
                case '-reddest_per0':
                    break;
                case '-redabdest_per':
                    tm[1] += _t('msg_redabdest_per %m1%', {
                        '%m1%': m[1]
                    }) + '<br>'; // redukcja niszczenia absor
                    break;
                case 'dloot':
                    tm[1] += _t('msg_dloot %name% %g1% %m1%', {
                        '%name%': f1.name,
                        '%g1%': g1,
                        '%m1%': m[1]
                    }); //f1.name+' zdobyÅ'+g1+' '+m[1]+', jednak ze wzglÄdu na przewagÄ poziomu przedmiot ulegÅ zniszczeniu.'
                    type = 'loot';
                    break;
                case 'step':
                    tm[1] += "<font color='white'>" + _t('msg_step %name% %g1%', {
                        '%name%': f1.name,
                        '%g1%': g1
                    }) + '</font>'; //f1.name+' zrobiÅ'+g1+' krok do przodu.<br>'
                    type = 'neu';
                    break;
                case 'afterheal':
                    tm[1] += "<font color='4afffd'><i>" + _t('msg_afterheal %name% %val%', {
                        '%name%': f1.name,
                        '%val%': m[1]
                    }) + '</i></font><br>'; //'PrzywrÃ³cono '+m[1]+' punktÃ³w Å¼ycia '+f1.name+'.<br>'
                    type = 'neu';
                    break;
                case 'reusearrows':
                    tm[1] += '<font color= "41ff57"><i>';
                    if (m[1] == 1) tm[1] += _t('msg_reusearrows_one'); //'Odzyskano jednÄ strzaÅÄ '
                    else if (m[1] < 5) tm[1] += _t('msg_reusearrows %val% %arrows%', {
                        '%val%': m[1],
                        '%arrows%': _t('part_arrows_plural1')
                    }); //'Odzyskano '+m[1]+' strzaÅy '
                    else tm[1] += _t('msg_reusearrows %val% %arrows%', {
                        '%val%': m[1],
                        '%arrows%': _t('part_arrows_plural2')
                    }); //'Odzyskano '+m[1]+' strzaÅ '
                    tm[1] += ' ' + f1.name + '.</i></font><br>';
                    type = 'neu';
                    break;
                case 'wound':
                    var multi = m[1].split(',');
                    if (multi.length == 1) tm[1] += "<font color='85caff'><i>" + _t('msg_wound %name% %val%', {
                        '%name%': f1.name,
                        '%val%': m[1]
                    }) + '</i></font><br>'; //f1.name+': '+m[1]+' obraÅ¼eÅ z gÅÄbokiej rany.<br>'
                    else tm[1] += "<font color='85caff'><i>" + _t('msg_wound_multi %name% %val0% %val1%', {
                        '%name%': f1.name,
                        '%val0%': multi[0],
                        '%val1%': multi[1]
                    }) + '</i></font><br>'; //f1.name+': '+m[1]+' obraÅ¼eÅ z gÅÄbokiej rany.<br>'
                    type = 'neu';
                    break;
                case '+woundfrost':
                    tm[1] += "<font color='85caff'><i>" + _t('msg_woundfrost %val%', {
                        '%val%': m[1]
                    }) + '</i></font><br>'; //f1.name+': '+m[1]+' obraÅ¼eÅ z gÅÄbokiej rany.<br>'
                    type = 'neu';
                    break;
                case 'critwound':
                    var multi = m[1].split(',');
                    if (multi.length == 1) tm[1] += "<font color='ff4a20'><i><b>" + _t('msg_critwound %name% %val%', {
                        '%name%': f1.name,
                        '%val%': m[1]
                    }) + '</b></i></font><br>'; //f1.name+': '+m[1]+' obraÅ¼eÅ z ciÄÅ¼kiej rany.<br>'
                    else tm[1] += "<font color='ff4a20'><i><b>" + _t('msg_critwound %name% %val0% %val1%', {
                        '%name%': f1.name,
                        '%val0%': multi[0],
                        '%val1%': multi[1]
                    }) + '</b></i></font><br>';
                    type = 'neu';
                    break;
                case '+woundpoison':
                    tm[1] += _t('msg_woundpoison %val%', {
                        '%val%': m[1]
                    }) + '<br>';
                    type = 'neu';
                    break;
                case '+of_woundpoison':
                    tm[1] += _t('msg_of_woundpoison %val%', {
                        '%val%': m[1]
                    }) + '<br>';
                    type = 'neu';
                    break;
                case '+woundmagic':
                    tm[1] += _t('msg_woundmagic %val%', {
                        '%val%': m[1]
                    }) + '<br>';
                    type = 'neu';
                    break;
                case '+of_woundmagic':
                    tm[1] += _t('msg_of_woundmagic %val%', {
                        '%val%': m[1]
                    }) + '<br>';
                    type = 'neu';
                    break;
                case 'injure':
                    //tm[1] += _t('msg_injure %name% %val%', {'%name%': f1.name, '%val%': m[1]}) + '<br>'; //f1.name+': '+m[1]+' obraÅ¼eÅ po zranieniu.<br>'

                    var multi = m[1].split(',');
                    if (multi.length == 1) tm[1] += "<font color='30ff00'><i>" + _t('msg_injure %name% %val%', {
                        '%name%': f1.name,
                        '%val%': m[1]
                    }) + '</i></font><br>';
                    else tm[1] += "<font color='30ff00'><i>" + _t('msg_injure %name% %val0% %val1%', {
                        '%name%': f1.name,
                        '%val%': multi[0],
                        '%val1%': multi[1]
                    }) + '</i></font><br>';
                    type = 'neu';
                    break;
                case 'poison':
                    var multi = m[1].split(',');
                    if (multi.length == 1) tm[1] += "<font color='30ff00'><i>" + _t('msg_poison %name% %val%', {
                        '%name%': f1.name,
                        '%val%': m[1]
                    }) + '</i></font><br>'; //f1.name+': '+m[1]+' obraÅ¼eÅ z trucizny.<br>'
                    else tm[1] += "<font color='30ff00'><i>" + _t('msg_poison %name% %val0% %val1%', {
                        '%name%': f1.name,
                        '%val0%': multi[0],
                        '%val1%': multi[1]
                    }) + '</i></font><br>'; //f1.name+': '+m[1]+' obraÅ¼eÅ z trucizny.<br>'
                    type = 'neu';
                    break;
                case 'heal':
                    var multi = m[1].split(',');
                    if (multi.length == 1) {
                        tm[1] += "<font color='4afffd'><i>" + _t('msg_heal %gain_lost% %name% %val%', {
                            '%name%': f1.name,
                            '%val%': m[1],
                            '%gain_lost%': (m[1] >= 0 ? _t('part_gained') : _t('part_lost'))
                        }) + '</i></font><br>'; //(m[1]>0?'PrzywrÃ³cono ':'Stracono ')+m[1]+' punktÃ³w Å¼ycia '+f1.name+'.<br>'
                    } else {
                        tm[1] += "<font color='4afffd'><i>" + _t('msg_heal %gain_lost% %name% %val0% %val1%', {
                            '%name%': f1.name,
                            '%val0%': multi[0],
                            '%val1%': multi[1],
                            '%gain_lost%': (multi[0] >= 0 ? _t('part_gained') : _t('part_lost'))
                        }) + '</i></font><br>'; //(m[1]>0?'PrzywrÃ³cono ':'Stracono ')+m[1]+' punktÃ³w Å¼ycia '+f1.name+'.<br>'
                    }
                    type = 'neu';
                    break;
                case 'fire':
                    var multi = m[1].split(',');
                    if (multi.length == 1) tm[1] += '<font color="fffc00"><i>' + _t('msg_fire %name% %val%', {
                        '%name%': f1.name,
                        '%val%': m[1]
                    }) + '</i></font><br>'; //f1.name+' otrzymaÅ# '+m[1]+' obraÅ¼eÅ od ognia.<br>'
                    else tm[1] += '<font color="fffc00"><i>' + _t('msg_fire %name% %val0% %val1%', {
                        '%name%': f1.name,
                        '%val0%': multi[0],
                        '%val1%': multi[1]
                    }) + '</i></font><br>'; //f1.name+' otrzymaÅ# '+m[1]+' obraÅ¼eÅ od ognia.<br>'
                    type = 'neu';
                    break;
                case 'light':
                    var multi = m[1].split(',');
                    if (multi.length == 1) tm[1] += '<font color="ffff00"><i>' + _t('msg_light %name% %val%', {
                        '%name%': f1.name,
                        '%val%': m[1]
                    }) + '</i></font><br>'; //%name% otrzymaÅ# %val% obraÅ¼eÅ od bÅyskawic.
                    else tm[1] += '<font color="ffff00"><i>' + _t('msg_light %name% %val0% %val1%', {
                        '%name%': f1.name,
                        '%val0%': multi[0],
                        '%val1%': multi[1]
                    }) + '</i></font><br>';
                    type = 'neu';
                    break;
                case 'frost':
                    var multi = m[1].split(',');
                    if (multi.length == 1) tm[1] += _t('msg_frost %name% %val%', {
                        '%name%': f1.name,
                        '%val%': m[1]
                    }) + '<br>'; // %name% otrzymaÅ# %val% obraÅ¼eÅ od zimna.
                    else tm[1] += '<font color="85caff"><i>' + _t('msg_frost %name% %val0% %val1%', {
                        '%name%': f1.name,
                        '%val0%': multi[0],
                        '%val1%': multi[1]
                    }) + '<br>';
                    break;
                case 'shout':
                    tm[1] += "<font color='5eff06'>" + _t('msg_shout %name%', {
                        '%name%': f1.name,
                        '%name2%': m[1]
                    }) + '</font><br>'; //f1.name+' rzuciÅ# obraÅºliwe hasÅo w stronÄ przeciwnika.<br>'
                    type = 'neu';
                    break;
                case 'en-regen':
                    tm[1] += _t('msg_en-regen %gain_lost% %name% %val%', {
                        '%name%': f1.name,
                        '%val%': m[1],
                        '%gain_lost%': (m[1] > 0 ? _t('part_gained') : _t('part_lost'))
                    }) + '<br>'; //(m[1]>0?'PrzywrÃ³cono ':'Stracono ')+m[1]+' energii '+f1.name+'.<br>'
                    type = 'neu';
                    break;
                case 'achpp_per':
                    tm[1] += _t('achpp_per', {
                        '%val%': m[1]
                    }) + '<br>'; //'ZwiÄkszenie pancerza o %val%%<br>'
                    break;
                case 'allslow':
                    tm[1] += _t('msg_allslow') + '<br>'; //'PrzeszywajÄcy krzyk<br>'
                    break;
                case 'arrowrain':
                    tm[1] += _t('msg_arrowrain') + '<br>'; //'Deszcz strzaÅ<br>'
                    break;
                case 'aura-ac_per':
                    //tm[1] += _t('msg_aura-ac_per %val%', {'%val%': m[1]}) + '<br>'; // 'Aura ochrony fizycznej, pancerz+%val%.'
                    var fr = f2.team == Engine.battle.myteam ? "fr" : "en";
                    //tm[1] += _t('msg_aura-ac_per %val%', {'%val%': m[1]}) + '<br>'; // 'Aura ochrony fizycznej, pancerz+%val%.'
                    tm[1] += '<font class="' + fr + '">' + _t('msg_aura-ac_per %val% %name%', {
                        '%val%': mp(m[1]),
                        '%name%': f1.name
                    }) + '</font><br>'; //'Aura ochrony fizycznej, pancerz+%val%.'
                    break;
                case 'aura-ac':
                    tm[1] += _t('msg_aura-ac %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //'Aura ochrony fizycznej, pancerz+'+m[1]+'<br>'
                    break;
                case 'aura-resall':
                    //tm[1] += _t('msg_aura-resall %val%', {'%val%': m[1]}) + '<br>'; //'Aura ochrony magicznej, odpornoÅci +'+m[1]+'<br>'
                    var fr = f2.team == Engine.battle.myteam ? "fr" : "en";
                    //tm[1] += _t('msg_aura-resall %val%', {'%val%': m[1]}) + '<br>'; //'Aura ochrony magicznej, odpornoÅci +'+m[1]+'<br>'
                    tm[1] += '<font class="' + fr + '">' + _t('msg_aura-resall %val% %name%', {
                        '%val%': mp(m[1]),
                        '%name%': f1.name
                    }) + '</font><br>'; //'Aura ochrony fizycznej, pancerz+%val%.'
                    break;
                case 'aura-sa_per':
                    //tm[1] += _t('msg_aura-sa_per %val%', {'%val%': mp(m[1])}) + '<br>'; //'Aura szybkoÅci SA'+mp(m[1]/100)+'<br>'
                    var fr = f2.team == Engine.battle.myteam ? "fr" : "en";
                    tm[1] += '<font class="' + fr + '">' + _t('msg_aura-sa_per_new %val% %name%', {
                        '%val%': mp(m[1]),
                        '%name%': f1.name
                    }) + '</font><br>'; //'Aura szybkoÅci SA'+mp(m[1]/100)+'<br>'
                    break;
                case 'aura-sa':
                    tm[1] += _t('msg_aura-sa %val%', {
                        '%val%': mp(m[1] / 100)
                    }) + '<br>'; //'Aura szybkoÅci SA'+mp(m[1]/100)+'<br>'
                    break;
                case 'bandage':
                    var a = m[1].split(',');
                    if (a.length == 1) {
                        tm[1] += _t('msg_aura-bandage %val%', {
                            '%val%': a[0],
                            '%name%': f1.name
                        }) + '<br>';
                    } else {
                        tm[1] += _t('msg_aura-bandage-multi %val% %val2%', {
                            '%name%': f1.name,
                            '%val%': a[0],
                            '%val2%': a[1]
                        }) + '<br>';
                    }
                    break;
                case 'blizzard':
                    tm[1] += _t('msg_blizzard') + '<br>'; //'Lodowa zamieÄ<br>'
                    break;
                case 'cover':
                    tm[1] += _t('msg_cover') + '<br>'; //'OsÅona kompana ciaÅem<br>'
                    break;
                case 'disturb':
                    tm[1] += _t('msg_disturb') + '<br>'; //'Rozproszenie przeciwnika<br>'
                    break;
                case 'physical':
                    tm[1] += _t('msg_physical %name% %val%', {
                        '%name%': f1.name,
                        '%val%': m[1]
                    }) + '<br>'; //%name% otrzymaÅ# %val% obraÅ¼eÅ fizycznych.
                    break;
                case 'poison_lowdmg_per-enemies':
                    tm[1] += _t('msg_poison_lowdmg_per-enemies %val%', {
                        '%name%': tmpName,
                        '%val%': m[1]
                    }) + '<br>'; // OsÅabienie o %val%% zadawanych obraÅ¼eÅ przez zatrutych przeciwnikÃ³w.
                    break;
                case '-poison_lowdmg_per':
                    tm[1] += _t('msg_-poison_lowdmg_per %val%', {
                        '%val%': m[1]
                    }) + '<br>'; // -OsÅabienie przez truciznÄ zadawanych obraÅ¼eÅ o x%"
                    break;
                case 'doubleshoot':
                    tm[1] += _t('msg_doubleshoot %name%', {
                        '%name%': f1.name
                    }) + '<br>'; //f1.name+' wykonaÅ# podwÃ³jny strzaÅ<br>'
                    break;
                case '+energy':
                    tm[1] += _t('msg_+energy %val%', {
                        '%val%': m[1]
                    }) + '<br>'; // +ObniÅ¼enie energii o %val% po zamroczeniu
                    break;
                case 'energyout':
                    tm[1] += _t('msg_energyout %val%', {
                        '%val%': m[1]
                    }) + '<br>'; // -%val% energii przez 5 kolejnych ciosÃ³w
                    break;
                case 'energy':
                    tm[1] += _t('msg_energy %name% %gain_loss% %val%', {
                        '%name%': f1.name,
                        '%gain_loss%': (m[1] > 0 ? _t('part_loss_en') : _t('part_gain_en')),
                        '%val%': Math.abs(m[1])
                    }) + '<br>'; //f1.name+(m[1]>0?' straciÅ':' otrzymaÅ')+g1+' '+Math.abs(m[1])+' energii<br>'
                    break;
                case 'en-regen-cast':
                    tm[1] += _t('msg_en-regen-cast %name% %target%', {
                        '%name%': f1.name,
                        '%target%': (id1 == id2 ? _t('part_himself') : f2.name)
                    }) + '<br>'; //f1.name+' rzuciÅ# na '+(id1==id2?'siebie':f2.name)+' przywrÃ³cenie energii.<br>'
                    break;
                case 'firewall': //HIDE
                    //tm[1] += _t('msg_firewall %name%', {'%name%': f1.name}) + '<br>'; //f1.name+' rzuciÅ# czar Åciana ognia<br>'
                    break;
                case 'thunder':
                    tm[1] += _t('msg_thunder %name%', {
                        '%name%': f1.name
                    }) + '<br>'; //f1.name+' wezwaÅ# grom z nieba<br>'
                    break;
                case 'storm':
                    tm[1] += _t('msg_storm %name%', {
                        '%name%': f1.name
                    }) + '<br>'; //f1.name+' wezwaÅ# burzÄ z piorunami<br>'
                    break;
                case 'mlightshiled':
                    tm[1] += _t('msg_mlightshiled %name%', {
                        '%name%': f1.name,
                        '%target%': (id1 == id2 ? _t('part_himself') : f2.name)
                    }) + '<br>'; // '%name% rzuciÅ tarczÄ bÅyskawic na siebie (lub zamiast siebie na kompana).'
                    break;
                case 'fireshield':
                    tm[1] += _t('msg_fireshield %name%', {
                        '%name%': f1.name,
                        '%target%': (id1 == id2 ? _t('part_himself') : f2.name)
                    }) + '<br>'; //f1.name+' rzuciÅ# tarczÄ ognia na '+(id1==id2?'siebie':f2.name)+'<br>'
                    break;
                case 'lightshield2':
                    tm[1] += _t('msg_lightshield2 %name%', {
                        '%name%': f1.name,
                        '%target%': (id1 == id2 ? _t('part_himself') : f2.name)
                    }) + '<br>'; // '%name% rzuca magicznÄ barierÄ na siebie (lub zamiast siebie na kompana)
                    break;
                case 'lightshield':
                    tm[1] += _t('msg_lightshield %name%', {
                        '%name%': f1.name,
                        '%target%': (id1 == id2 ? _t('part_himself') : f2.name)
                    }) + '<br>'; //f1.name+' rzuciÅ# poraÅ¼ajÄcÄ tarczÄ na '+(id1==id2?'siebie':f2.name)+'<br>'
                    break;
                case 'frostshield':
                    tm[1] += _t('msg_frostshield %name%', {
                        '%name%': f1.name,
                        '%target%': (id1 == id2 ? _t('part_himself') : f2.name)
                    }) + '<br>'; //f1.name+' rzuciÅ# tarczÄ mrozu na '+(id1==id2?'siebie':f2.name)+'<br>'
                    break;
                case 'sunshield_per':
                case 'sunshield':
                    tm[1] += _t('msg_sunshield %name%', {
                        '%name%': f1.name,
                        '%target%': (id1 == id2 ? _t('part_himself') : f2.name)
                    }) + '<br>'; //f1.name+' rzuciÅ# tarczÄ sÅoÅca na '+(id1==id2?'siebie':f2.name)+'<br>'
                    break;
                case 'antidote':
                    tm[1] += _t('msg_antidote %val%', {
                        '%val%': m[1]
                    }) + '<br>';
                    break;
                case 'sunreduction':
                    tm[1] += _t('msg_sunreduction %name%', {
                        '%name%': f1.name,
                        '%target%': (id1 == id2 ? _t('part_himself') : f2.name)
                    }) + '<br>'; //f1.name+' rzuciÅ# odpornoÅÄ sÅoÅca na '+(id1==id2?'siebie':f2.name)+'<br>'
                    break;
                case 'footshoot':
                    tm[1] += _t('msg_footshoot %name%', {
                        '%name%': f1.name,
                        '%target%': (id1 == id2 ? _t('part_himself') : f2.name)
                    }) + '<br>'; //f1.name+' strzeliÅ# w stopÄ wroga: '+f2.name+'<br>'
                    break;
                case 'stealmana':
                    tm[1] += _t('msg_stealmana %name%', {
                        '%val%': m[1],
                        '%target%': f2.name
                    }) + '<br>'; // '%name% kradnie manÄ przeciwnika %target%'
                    break;
                case 'rime_per':
                    var mm = m[1].split(',');
                    tm[1] += _t('msg_rime_per %val% %name%', {
                        '%val%': mm[0],
                        '%name%': f1.name
                    }) + '<br>'; // '%name% wykonuje podmuch mrozu, spowolnienie przeciwnikÃ³w o %val%%'
                    break;
                case 'trickyknife':
                    tm[1] += _t('msg_trickyknife %name% %target%', {
                        '%name%': f1.name,
                        '%target%': f2.name
                    }) + '<br>'; // '%name% zadaje przeciwnikowi %target% zdradziecki cios'
                    break;
                case 'healall_per':
                    //tm[1] += _t('msg_healall_per %name% %val%', {'%name%': f1.name, '%val%': m[1]}) + '<br>'; //f1.name+' uzdrowiÅ# swojÄ druÅ¼ynÄ (+'+m[1]+')<br>'

                    var a = m[1].split(',');
                    if (a.length == 1) {
                        tm[1] += _t('msg_healall_per %name% %val%', {
                            '%name%': f1.name,
                            '%val%': a[0]
                        }) + '<br>';
                    } else {
                        tm[1] += _t('msg_healall_per_multi %name% %val% %val2%', {
                            '%name%': f1.name,
                            '%val%': a[0],
                            '%val2%': a[1]
                        }) + '<br>';
                    }
                    break;
                case 'healall':
                    tm[1] += _t('msg_healall %name% %val%', {
                        '%name%': f1.name,
                        '%val%': m[1]
                    }) + '<br>'; //f1.name+' uzdrowiÅ# swojÄ druÅ¼ynÄ (+'+m[1]+')<br>'
                    break;
                case 'manatransfer':
                    tm[1] += _t('msg_manatransfer %name% %val% %name2%', {
                        '%name2%': f2.name,
                        '%name%': f1.name,
                        '%val%': m[1]
                    }) + '<br>'; //f1.name+' przekazaÅ# '+m[1]+' many graczowi '+f2.name+'<br>'
                    break;
                case 'soullink':
                    tm[1] += _t('msg_soullink %name%', {
                        '%name%': f1.name
                    }) + '<br>'; //f1.name+' duchowo wspiera swojÄ druÅ¼ynÄ<br>'
                    break;
                case 'combo-max':
                    tm[1] += _t('msg_combo-max', {
                        '%val%': m[1]
                    }) + '<br>';
                    break;
                case 'poisonspread':
                    tm[1] += _t('msg_poisonspread') + m[1] + '<br>';
                    break;
                case 'poisonspread_failkey':
                    tm[1] += _t('msg_poisonspread_failkey') + '<br>';
                    break;
                case 'removeslow-allies':
                    tm[1] += _t('msg_removeslow-allies') + '<br>';
                    break;
                case 'removestun-allies':
                    tm[1] += _t('msg_removestun-allies') + '<br>';
                    break;
                case 'of-woundstart':
                    tm[1] += _t('msg_of-woundstart') + '<br>';
                    break;
                case 'lowheal_per-enemies':
                    tm[1] += _t('msg_lowheal_per-enemies val', {
                        '%val%': m[1]
                    }) + '<br>';
                    break;

                case 'stinkbomb':
                    tm[1] += _t('msg_stinkbomb %name% %name2%', {
                        '%name%': f1.name,
                        '%name2%': f2.name
                    }) + '<br>'; //f1.name+' rzuciÅ# ÅmierdzÄcy pocisk w przeciwnika '+f2.name+'<br>'
                    break;
                case 'managain':
                    tm[1] += _t('msg_managain %name% %val%', {
                        '%name%': f1.name,
                        '%val%': mp(m[1])
                    }) + '<br>'; //f1.name+' otrzymaÅ# '+mp(m[1])+' many<br>'
                    break;
                case 'insult':
                    tm[1] += _t('msg_insult %name% %name2% %val%', {
                        '%name%': f1.name,
                        '%val%': m[1],
                        '%name2%': f2.name
                    }) + '<br>'; //f1.name+' obraziÅ# '+f2.name+' na '+m[1]+' tur<br>'
                    break;
                case 'prepare':
                    //Engine.battle.warriorsList[id1].setCastAction();
                    tm[1] += _t('msg_prepare %name%', {
                        '%name%': f1.name,
                        '%name2%': m[1]
                    }) + '<br>'; //f1.name+' przygotowuje siÄ do rzucenia '+m[1]+'<br>'
                    type = 'auto';
                    break;
                case 'skillId':
                    break;
                case 'tspell':
                    tm[1] += _t('msg_tspell %name%', {
                        '%name%': f1.name,
                        '%name2%': m[1]
                    }) + '<br>'; //f1.name+' wykonuje '+m[1]+'<br>'
                    type = 'auto';
                    break;
                case 'legbon_lastheal':
                    var mm = m[1].split(',');
                    tm[1] += `<font color='00fff0'><b>${_t('msg_legbon_lastheal %val%', {'%val%': mm[1], '%val2%': mm[0]})}</b></font><br>`; //mm[1]+': Ostatni ratunek, +'+mm[0]+' punktÃ³w Å¼ycia<br>'
                    break;

                case '+superspell-dispel':
                    tm[1] += _t('msg_+dispel') + '<br>'; //'+Przerwanie ciosu specjalnego<br>'
                    break;
                case '-tenacity':
                    tm[1] += _t('msg_-tenacity') + '<br>'; //'-WytrwaÅoÅÄ<br>'
                    break;
                case '+oth_dmg':
                    var mm = m[1].split(',');
                    tm[1] += '<b class=dmg' + mm[1] + '>' + _t('msg_+oth_dmg %val% %name%', {
                        '%val%': mm[0],
                        '%name%': mm[2]
                    }) + '<br>'; //+'   -'+mm[0]+'</b> obraÅ¼eÅ otrzymaÅ(a) '+mm[2]+'<br>'
                    type = 'auto';
                    break;
                case '+oth_cover':
                    var mm = m[1].split(',');
                    tm[1] += _t('msg_+oth_cover %val% %name%', {
                        '%val%': mm[0],
                        '%name%': mm[2]
                    }) + '<br>'; //mm[1]+' przejÄÅ(eÅa) '+mm[0]+' obraÅ¼eÅ<br>'
                    break;
                case '+exp':
                    var str = _t('msg_+exp %val%', {
                        '%val%': m[1]
                    });
                    tm[1] += str + '<br>'; //'Zdobyto ÅÄcznie '+m[1]+' punktÃ³w doÅwiadczenia.'
                    //message(str);
                    //if (isset(Engine.battleSummary && Engine.battleSummary.visible)) Engine.battleSummary.setExp(m[1]);
                    type = 'exp';
                    break;
                case '+ph':
                    tm[1] += _t('msg_+ph %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //'Zdobyto ÅÄcznie '+m[1]+' punktÃ³w honoru.'
                    type = 'win';
                    break;
                case '+of_dmg':
                    attack += '<b class=dmgo>+' + m[1] + '</b>';
                    break;
                case '+thirdatt':
                    tm[1] += "<font color='ffc039'><b>" + _t('+third_strike') + '</b></font><br>'; //'+Trzeci cios
                    attack += '<b class=third>+' + m[1] + '</b>';
                    break;
                case '+crit':
                    tm[1] += "<font color='ff96b1'><i>" + _t('msg_+crit') + '</i></font><br>'; //'+Cios krytyczny<br>'
                    break;
                case '+verycrit':
                    tm[1] += "<font color='ff4e91'><i><b>" + _t('msg_+verycrit') + '</b></i></font><br>'; //'+Cios bardzo krytyczny<br>'
                    break;
                case '+of_crit':
                    tm[1] += "<font color='ff75d0'><i><b>" + _t('msg_+of_crit') + '</b></i></font><br>'; //'+Cios krytyczny broni pomocniczej<br>'
                    break;
                case '+wound':
                    tm[1] += _t('msg_+wound') + '<br>'; //'+GÅÄboka rana<br>'
                    break;
                case '+of_wound':
                    tm[1] += "<font color='ff753c'><i><b>" + _t('msg_+of_wound') + '</b></i></font><br>'; //'+GÅÄboka rana pomocnicza<br>'
                    break;
                case '+critwound':
                    tm[1] += _t('msg_+critwound') + '<br>'; //'+CiÄÅ¼ka rana<br>'
                    break;
                case '+critslow_per':
                    tm[1] += _t('msg_+critslow_per= %val%', {
                        '%val%': m[1]
                    }) + '<br>'; // '+Krytyczne spowolnienie o %val%%'
                    break;
                case '+critslow':
                    tm[1] += "<font color='ff6c2b'><i>" + _t('msg_+hithurt %val%', {
                        '%val%': m[1]
                    }) + '</i></font><br>'; //'+Bolesny cios, spowolnienie o '+m[1]+'% SA<br>';
                    break;
                case '+critsa_per':
                    tm[1] += _t('msg_+critsa_per %val%', {
                        '%val%': m[1]
                    }) + '<br>'; // Przyspieszenie SA o %val%% po krytyku na 3 tury;
                    break;
                case '+critsa':
                    tm[1] += _t('msg_+critsa %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //'+Przyspieszenie o '+m[1]+'% SA na +3 tury<br>'
                    break;
                case '+pierce':
                    tm[1] += "<font color='82ff88'>" + _t('msg_+pierce') + '</font><br>'; //'+Przebicie<br>'
                    break;
                case '+acdmg':
                    tm[1] += _t('msg_+acdmg %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //'+ObniÅ¼enie pancerza o '+m[1]+'<br>'
                    break;
                case '+acdmg_destroyed':
                    tm[1] += _t('msg_+acdmg_destroyed') + '<br>'; //+Zniszczono pancerz przeciwnika.
                    break;
                case '+resdmg':
                    tm[1] += _t('msg_+resdmg %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //'+ObniÅ¼enie odpornoÅci o '+m[1]+'%<br>'
                    break;
                case '+stun':
                    tm[1] += _t('msg_+stun') + '<br>'; //'+OgÅuszenie<br>'
                    break;
                case '+stun2':
                    tm[1] += _t('msg_+stun2') + '<br>'; //'+PotÄÅ¼ne ogÅuszenie<br>'
                    break;
                case '+stun2-f':
                    tm[1] += _t('msg_+stun2-f') + '<br>'; //'+PotÄÅ¼ne poparzenie<br>'
                    break;
                case '+stun2-l':
                    tm[1] += _t('msg_+stun2-l') + '<br>'; //'+PotÄÅ¼ne poraÅ¼enie<br>'
                    break;
                case '+stun2-c':
                    tm[1] += _t('msg_+stun2-c') + '<br>'; //'+PotÄÅ¼ne zamroÅ¼enie<br>'
                    break;
                case '+stun2-d':
                    tm[1] += _t('msg_+stun2-d') + '<br>'; //'+PotÄÅ¼na przeszywajÄca strzaÅa<br>'
                    break;
                case '+freeze':
                    tm[1] += "<font color='66efff'><i>" + _t('msg_+freeze') + '</i></font><br>'; //'+ZamroÅ¼enie<br>'
                    break;
                case '+immobilize':
                    tm[1] += _t('msg_+immobilize') + '<br>'; //'+Unieruchomienie<br>'
                    break;
                case '+distract':
                    tm[1] += _t('msg_+distract') + '<br>'; //'+WytrÄcenie z rÃ³wnowagi<br>'
                    break;
                case '+fastarrow':
                    tm[1] += "<font color='fffd78'><i>" + _t('msg_+fastarrow') + '</i></font><br>'; //'+Szybka strzaÅa<br>'
                    break;
                case '+engback':
                    tm[1] += _t('msg_+engback %val%', {
                        '%val%': mp(m[1])
                    }) + '<br>'; //mp(m[1])+' energii<br>'
                    break;
                case '+swing':
                    tm[1] += _t('msg_+swing') + '<br>'; //'+Szeroki zamach<br>'
                    break;
                case '+injure':
                    tm[1] += "<font color='ff829f'><b><i>" + _t('msg_+injure %val%', {
                        '%val%': m[1]
                    }) + '</i></b></font><br>'; //'+Zranienie ('+m[1]+')<br>'
                    break;
                case '+firearrow':
                    tm[1] += _t('msg_+firearrow') + '<br>'; //'+PÅonÄca strzaÅa<br>'
                    break;
                case '+manadest':
                case '-manadest':
                    //tm[1] += _t('msg_+manadest %val%', {'%val%': m[1]}) + '<br>'; //'+Zniszczono '+m[1]+' many<br>'

                    var a = m[1].split(',');
                    if (a.length == 1) tm[1] += _t(`msg_${m[0]} %val%`, {
                        '%val%': m[1]
                    }) + '<br>'; //'+Zniszczono '+m[1]+' many<br>'
                    else {
                        tm[1] += _t(`msg_${m[0]}_multi %val%`, {
                            '%val%': a[0],
                            '%val2%': a[1]
                        }) + '<br>';
                    }
                    break;
                case 'dmg_hpp':
                    tm[1] += _t('msg_-dmg_hpp') + '<br>'; //'Przeciwnik jest odporny na ten atak'
                    break;
                case '+endest':
                case '-endest':
                    //tm[1] += _t('msg_+endest %val%', {'%val%': m[1]}) + '<br>'; //'+Zniszczono '+m[1]+' energii<br>'

                    var a = m[1].split(',');
                    if (a.length == 1) tm[1] += _t(`msg_${m[0]} %val%`, {
                        '%val%': m[1]
                    }) + '<br>'; //'+Zniszczono '+m[1]+' energii<br>'
                    else {
                        tm[1] += _t(`msg_${m[0]}_multi %val%`, {
                            '%val%': a[0],
                            '%val2%': a[1]
                        }) + '<br>';
                    }
                    break;
                case '+abdest':
                    tm[1] += _t('msg_+abdest %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //'+Zniszczono '+m[1]+' absorpcji<br>'
                    break;
                case '+actdmg':
                    tm[1] += _t('msg_+actdmg %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //'ObniÅ¼enie odpornoÅci na truciznÄ o '+m[1]+'%<br>'
                    break;
                case "resfire_per":
                    tm[1] += _t('msg_resfire_per %val%', {
                        '%val%': m[1]
                    }) + '<br>';
                    break;
                case "reslight_per":
                    tm[1] += _t('msg_reslight_per %val%', {
                        '%val%': m[1]
                    }) + '<br>';
                    break;
                case "resfrost_per":
                    tm[1] += _t('msg_resfrost_per %val%', {
                        '%val%': m[1]
                    }) + '<br>';
                    break;
                case 'mana':
                    if (m[1] > 0) console.warn('[BattleMessage.js, battleMsg] Mana error');
                    else tm[1] += _t('msg_receivemana %name% %val%', {
                        '%name%': f1.name,
                        '%val%': Math.abs(m[1])
                    }) + '<br>';
                    break;



                case '+resdmgf':
                    tm[1] += _t('msg_+resdmgf %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //'ObniÅ¼enie odpornoÅci na ogieÅ o '+m[1]+'%<br>'
                    break;
                case '+resdmgc':
                    tm[1] += _t('msg_+resdmgc %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //'ObniÅ¼enie odpornoÅci na zimno o '+m[1]+'%<br>'
                    break;
                case '+resdmgl':
                    tm[1] += _t('msg_+resdmgl %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //'ObniÅ¼enie odpornoÅci na bÅyskawice o '+m[1]+'%<br>'
                    break;
                case '+legbon_verycrit':
                    tm[1] += "<font color='ff53a8'><b><i>" + _t('msg_+legbon_verycrit') + '</i></b></font><br>'; //'+Cios bardzo krytyczny<br>'
                    break;
                case '+mcurse':
                    tm[1] += _t('msg_+mcurse') + '<br>'; //'+KlÄtwa<br>'
                    break;
                case '-legbon_cleanse':
                    tm[2] += "<font color='ff9999'><b>" + _t('msg_-legbon_cleanse') + '</b></font><br>';
                    break;
                case '-legbon_glare':
                    tm[2] += "<font color='ffe25b'><b>" + _t('msg_-legbon_glare') + '</b></font><br>';
                    break;
                case '+superspell-prevented':
                    tm[2] += _t('msg_+superspell-prevented') + '<br>';
                    break;
                case '+legbon_curse':
                    tm[1] += "<font color='ffe25b'><b>" + _t('msg_+legbon_curse') + '</b></font><br>'; //'+KlÄtwa<br>'
                    break;
                case '+legbon_pushback':
                    tm[1] += _t('msg_+legbon_pushback') + '<br>'; //'+OdepchniÄcie<br>'
                    break;
                case '+legbon_holytouch':
                    //tm[1] += "<font color='00fff0'><i><b>" + _t('msg_+legbon_holytouch %val%', {'%val%': m[1]}) + '</b></i></font><br>'; //'+Dotyk anioÅa, Å¼ycie +'+m[1]+'<br>'
                    tm[1] += "<font color='00fff0'><i><b>" + _t('msg_+legbon_holytouch %val%') + '</b></i></font><br>';
                    break;
                case 'legbon_holytouch_heal':
                    tm[1] += "<font color='00fff0'><i><b>" + _t('msg_legbon_holytouch_heal %val%', {
                        '%val%': m[1],
                        '%name%': f1.name
                    }) + '</b></i></font><br>';
                    type = 'neu';
                    break;
                case '-legbon_dmgred':
                    tm[1] += _t('msg_-legbon_dmgred %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //'-Aktywna ochrona fizyczna '+m[1]+'% obraÅ¼eÅ na caÅÄ walkÄ<br />'
                    break;
                case 'anguish':
                    let anguishArray = m[1].split(",");
                    type = 'neu'
                    if (anguishArray.length == 1) {
                        tm[1] += _t('msg_anguish %name% %hpp% %val0%', {
                            '%name%': tmpName,
                            '%hpp%': f1.hpp,
                            '%val0%': anguishArray[0]
                        }) + '<br>';
                    } else {
                        tm[1] += _t('msg_anguish %name% %hpp% %val0% %val1%', {
                            '%name%': tmpName,
                            '%hpp%': f1.hpp,
                            '%val0%': anguishArray[0],
                            'val1': anguishArray[1]
                        }) + '<br>';
                    }
                    break;
                case '-legbon_facade':
                    tm[1] += `<font color="c7c8eb"><b><i>${_t('msg_-legbon_facade %val%', {'%val%': m[1]})}</i></b></font><br>`;
                    break;
                case '+legbon_anguish':
                    tm[1] += `<font color="ecb608"><b>${_t('msg_+legbon_anguish %val%', {'%val%': m[1]})}</b></font><br>`;
                    break;
                case '-legbon_retaliation':
                    tm[1] += _t('msg_-legbon_retaliation %val%', {
                        '%val%': m[1]
                    }) + '<br>';
                    break;
                case '+legbon_frenzy_main':
                    tm[1] += _t('msg_+legbon_frenzy_main %val%', {
                        '%val%': m[1]
                    }) + '<br>';
                    break;
                case '+legbon_frenzy_off':
                    tm[1] += _t('msg_+legbon_frenzy_off %val%', {
                        '%val%': m[1]
                    }) + '<br>';
                    break;
                case '-blok':
                    tm[2] += "<font color='8dff5b'><b>" + _t('msg_-blok %val%', {
                        '%val%': m[1]
                    }) + '</b></font><br>'; //'-Zablokowanie '+m[1]+' obraÅ¼eÅ<br>'
                    break;
                case '-evade':
                    tm[2] += "<font color='00baff'><b>" + _t('msg_-evade') + '</b></font><br>'; //'-Unik<br>'
                    break;
                case '-parry':
                    tm[2] += "<font color='d1d1d1'>" + _t('msg_-parry') + '</font><br>'; //'-Parowanie<br>'
                    break;
                case '-pierceb':
                    tm[2] += "<font color='8dff5b'><b>" + _t('msg_-pierceb') + '</b></font><br>'; //'-Blok przebicia<br>'
                    break;
                case '-contra':
                    tm[2] += _t('msg_-contra') + '<br>'; //'-Kontra<br>'
                    break;
                case '+rage':
                    tm[2] += _t('msg_+rage %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //'+WÅciekÅoÅÄ: atak %val%<br>'
                    break;
                case '-rage':
                    tm[2] += _t('msg_-rage') + '<br>'; //'-WÅciekÅoÅÄ<br>'
                    break;
                case '+absorb':
                    tm[2] += _t('msg_+absorb %val%', {
                        '%val%': m[1]
                    }) + '<br>'; // Odnowienie absorpcji %val%
                    break;
                case '-absorb':
                    tm[2] += _t('msg_-absorb %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //  '-Absorpcja %val% obraÅ¼eÅ fizycznych<br>'
                    break;
                case '+absorbm':
                    tm[2] += _t('msg_+absorbm %val%', {
                        '%val%': m[1]
                    }) + '<br>'; // Odnowienie absorpcji magicznej %val%
                    break;
                case '-absorbm':
                    tm[2] += _t('msg_-absorbm %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //'-Absorpcja '+m[1]+' obraÅ¼eÅ magicznych<br>'
                    break;
                case '-arrowblock':
                    tm[2] += _t('msg_-arrowblock') + '<br>'; //'StrzaÅa zablokowana<br>'
                    break;
                case '-thirdatt':
                    take += '<b class=third>-' + m[1] + '</b>';
                    takenum += m[1];
                    break;
                case '-legbon_critred':
                    tm[2] += `<font color='c7c8eb'><b>${_t(`msg_${m[0]} %val%`, {'%val%': m[1]})}</b></font><br>`;
                    break;
                case '+legbon_puncture':
                    tm[2] += `<font color='ecb608'><b><i>${_t(`msg_${m[0]} %val%`, {'%val%': m[1]})}</i></b></font><br>`;
                    break;
                case '-legbon_resgain':
                    tm[2] += _t('msg_-legbon_resgain') + '<br>'; //'-Ochrona Å¼ywioÅÃ³w<br>'
                    break;
                case 'ansgame':
                    tm[1] += _t('msg_ansgame', {
                        '%name%': f1.name
                    }) + '<br>';
                    break;
                case '+vulture':
                    tm[2] += _t('msg_+vulture= %val%', {
                        '%val%': m[1]
                    }) + '<br>'; // '+Wzmocnienie ataku o %val% %'
                    break;
                case '-reddest_per':
                    tm[2] += _t('msg_-reddest_per %val%', {
                        '%val%': m[1]
                    }) + '<br>'; // 'Redukcja many i energii o %val% %'
                    break;
                case '-redacdmg':
                    tm[2] += _t('msg_-redacdmg %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //  'Redukcja niszczenia pancerza o %val%'
                    break;
                case '-redacdmg_per':
                    tm[2] += _t('msg_-redacdmg_per %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //  'Redukcja niszczenia pancerza o %val% %'
                    break;
                case '-redmanadest_per':
                    tm[2] += _t('msg_-redmanadest_per %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //  'Redukcja niszczenia many o %val% %'
                    break;
                case '-redendest_per':
                    tm[2] += _t('msg_-redendest_per %val%', {
                        '%val%': m[1]
                    }) + '<br>'; //  'Redukcja niszczenia energii o %val% %'
                    break;
                case '-resmanaendest':
                    var mm = m[1].split(',');
                    tm[2] += _t('msg_-resmanaendest %val%', {
                        '%val1%': mm[0],
                        '%val2%': mm[1]
                    }) + '<br>';
                    break;
                case '+critpoison_per':
                    tm[2] += _t('msg_+critpoison_per %val%', {
                        '%val%': m[1]
                    }) + '<br>'; // +Czarna krew %val%
                    break;
                    //case 'allcritmval' :
                    //	var mm = m[1].split(',');
                    //	tm[1] += _t('msg_allcritmval %val% %name%', {'%val%': mm[0], '%name%': mm[2]}) + '<br>'; // '%name% wzmacnia magiczne krytyczne uderzenie druÅ¼yny o %val%%'
                    //	break;
                    //case 'allcritval' :
                    //	var mm = m[1].split(',');
                    //	tm[1] += _t('msg_allcritval %val% %name%', {'%val%': mm[0], '%name%': mm[2]}) + '<br>'; // '%name% wzmacnia krytyczne uderzenie druÅ¼yny o %val%%'
                    //	break;
                case 'alllowdmg':
                    var mm = m[1].split(',');
                    tm[1] += _t('msg_alllowdmg %val% %name%', {
                        '%val%': mm[0],
                        '%name%': mm[2]
                    }) + '<br>'; // '%name% posyÅa emanujÄcÄ strzaÅÄ w stronÄ przeciwnikÃ³w osÅabiajÄc ich atak o %val% % na +5 tur'
                    break;
                case 'allslow_per':
                    var mm = m[1].split(',');
                    tm[1] += _t('msg_allslow_per %val% %name%', {
                        '%val%': mm[0],
                        '%name%': f1.name
                    }) + '<br>'; // '%name% wykonuje przeraÅ¼ajÄcy okrzyk spowalniajÄcy wrogÃ³w o %val%%'
                    break;
                case 'blackout':
                    tm[1] += _t('msg_blackout') + '<br>'; // 'Zamroczenie'
                    break;
                case 'aura-adddmg2_per-meele':
                    tm[1] += _t('msg_blesswords_perw %val% %name%', {
                        '%val%': m[1],
                        '%name%': f1.name
                    }) + '<br>'; // '%name% wykonuje bÅogosÅawieÅstwo mieczy, wzmocnienie o %val%%'
                    break;
                case 'chainlightning': //HIDE
                    break;
                case 'chainlightning_perw':
                    tm[1] += _t('msg_chainlightning_perw %name%', {
                        '%name%': f1.name
                    }) + '<br>'; // '%name% przyzywa z nieba ÅaÅcuch piorunÃ³w.'
                    break;
                case 'critstagnation':
                    tm[1] += _t('msg_critstagnation') + '<br>'; // '+Stagnacja'
                    break;
                case 'distractshoot':
                    tm[1] += _t('msg_distractshoot') + '<br>'; // '+WytrÄcajÄca strzaÅa'
                    break;
                case 'disturbshoot':
                    tm[1] += _t('msg_disturbshoot') + '<br>'; // 'RozpraszajÄcy strzaÅ'
                    break;
                case '+rotatingblade':
                    //tm[1] += _t('msg_+rotatingblade') + '<br>'; // '+WirujÄce ostrze'  HIDE
                    break;
                case 'daggerthrow': //HIDE
                    break;
                case 'vamp':
                    tm[1] += _t('msg_vamp %val%', {
                        '%name%': f1.name,
                        '%target%': f2.name,
                        '%val%': m[1]
                    }) + '<br>'; // '%name% poÅ¼era przeciwnikowi %target% %val% Å¼ycia'
                    break;
                case 'woundextend':
                    tm[1] += _t('msg_woundextend %name% %target%', {
                        '%name%': f1.name,
                        '%target%': f2.name
                    }) + '<br>'; // '%name% rozszarpuje rany %target%'
                    break;
                case 'heal_per':
                    tm[1] += _t('msg_heal_per %name%', {
                        '%name%': f1.name,
                        '%target%': (id1 == id2 ? _t('part_himself') : f2.name)
                    }) + '<br>'; // %name% uzdrawia siebie (lub zamiast siebie to kompana)
                    break;
                case 'heal_target':
                    var a = m[1].split(',');
                    if (a.length == 1) {
                        tm[1] += _t('msg_heal_target %target% %val%', {
                            '%target%': f2.name,
                            '%val%': a[0]
                        }) + '<br>'; // %target% zostaÅ(a) uleczony(a) o %val% punktÃ³w Å¼ycia.
                    } else {
                        tm[1] += _t('msg_heal_target-multi %target% %val% %val2%', {
                            '%target%': f2.name,
                            '%val%': a[0],
                            '%val2%': a[1]
                        }) + '<br>'; // %target% zostaÅ(a) uleczony(a) o %val% punktÃ³w Å¼ycia.
                    }
                    break;
                case '-redmanadest':
                    tm[1] += _t('msg_-redmanadest %val%', {
                        '%val%': m[1]
                    }) + '<br>'; // -redukcja niszczenia %val% many
                    //tm[1] += _t('msg_-redmanadest %val%', {'%val%': Math.max(1, round(m[1] / 3))}) + '<br>'; // -redukcja niszczenia %val% many
                    break;
                case '-redendest':
                    tm[1] += _t('msg_-redendest %val%', {
                        '%val%': m[1]
                    }) + '<br> '; //-redukcja niszczenia %val% energii
                    break;
                case '+lowheal2turns':
                    tm[1] += _t('msg_+lowheal2turns %val%', {
                        '%val%': m[1]
                    }) + '<br>'; // +redukcja leczenia turowego o %val% Å¼ycia
                    break;
                case '-lowcritallval':
                    tm[1] += _t('msg_-lowcritallval %val%', {
                        '%val%': m[1]
                    }) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
                    break;

                case 'surpass_bonus_total':
                    tm[1] += _t('surpass_bonus_total %val% %name%', {
                        '%val%': m[1],
                        '%name%': f1.name.replace(new RegExp('\\(.+?\\)'), '')
                    }) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
                    break;

                    //END GAME
                    //only val
                case '+crush':
                case 'vamp_time':
                case '+taken_dmg':
                case '+critpierce':
                case 'critval-enemies':
                case 'critmval-enemies':
                case 'critval-allies':
                case 'critmval-allies':
                    if (m[0] != 'vamp_time') {
                        tm[1] += _t('eng_game_only_val_' + m[0] + ' %val%', {
                            '%val%': m[1]
                        }) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
                    } else {
                        var a = m[1].split(',');
                        if (a.length == 1) {
                            tm[1] += _t('eng_game_only_val_vamp_time %val%', {
                                '%val%': a[0]
                            }) + '<br>';
                        } else {
                            tm[1] += _t('eng_game_only_val_vamp_time %val% %val2%', {
                                '%val%': a[0],
                                '%val2%': a[1]
                            }) + '<br>';
                        }
                    }
                    break;
                    //only nick from message
                case '+spell-taken_dmg':
                    tm[1] += _t('eng_game_only_nick_' + m[0] + ' %name%', {
                        '%name%': m[1]
                    }) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
                    break;
                    //only nick
                case '+spell-vamp_time':
                case 'distortion':
                    //only opponent nick
                case 'stinkbomb_crit':
                case 'stinkbomb_pierce':
                    tm[1] += _t('eng_game_only_nick_' + m[0] + ' %name%', {
                        '%name%': f2.name
                    }) + '<br>'; // %name% ma obniÅ¼onÄ szansÄ na cios krytyczny.
                    break;
                    //nick and value
                case 'heal_per-allies':
                case 'heal_per-enemies':
                case 'hp_per-allies':
                case 'hp_per-enemies':
                    tm[1] += _t('eng_game_nick_and_value_' + m[0] + ' %name% %val%', {
                        '%name%': tmpName,
                        '%val%': m[1]
                    }) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
                    break;
                    //opponent_nick and value
                case 'dmg-target_physical':
                    tm[1] += _t('eng_game_opponent_nick_and_value_' + m[0] + ' %target% %val%', {
                        '%target%': f2.name,
                        '%val%': m[1]
                    }) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
                    break;
                    //nick and opponent
                case 'balloflight': //HIDE
                case 'active_decblock_per':
                case 'active_absorbdest_per':
                    break;
                case 'spell-taken_dmg':
                case '-spell-distortion':
                    tm[1] += _t('eng_game_nick_and_opponent_' + m[0] + ' %name% %target%', {
                        '%name%': f1.name,
                        '%target%': f2.name
                    }) + '<br>';
                    break;
                    //nick and FRIENDNICK
                case '-spell-immunity_to_dmg':
                    tm[1] += _t('eng_game_nick_and_friendnick_' + m[0] + ' %name%', {
                        '%name%': f1.name
                    }) + '<br>'; // -obniÅ¼enie siÅ krytyka magicznego i fizycznego x%val%
                    break;
                    //only info
                case '-immunity_to_dmg':
                case '+spell-taken_dmg-all':
                    tm[1] += _t('end-game-without-percent' + m[0]) + '<br>';
                    break;
                case 'active_decblock_per-enemies':
                case 'active_block_per':
                case '+abdest_per':
                case '+abmdest_per':
                    tm[1] += _t('msg_only_val_' + m[0], {
                        '%val%': m[1]
                    }) + '<br>';
                    break;
                case 'tcustom':
                    tm[1] += _t('msg_tcustom_target %target% %val%', {
                        '%target%': f2.name,
                        '%val%': m[1]
                    }) + '<br>'; // %target% - uÅ¼ycie specjalnej mikstury: %val%.
                    type = 'txt';
                    break;
                case 'removedot':
                case 'removedot-allies':
                case 'removestun':
                    tm[1] += _t('skill_' + m[0], null, 'new_skills') + '<br/>';
                    break;

                default:
                    if (m[0].substr(1, 3) == 'dmg') {
                        if (m[0].charAt(0) == '+') {

                            //if (!msg.includes('+crit')) Engine.battle.battleEffectsController.manageBattleEffects('normalAttack', [1], f1, f2, msg, allM);
                            Engine.battle.battleEffectsController.manageBattleEffects('normalAttack', [1], f1, f2, msg, allM, indexMsg);

                            attack += '<b class=' + m[0].substr(1) + '>+' + m[1] + '</b>';
                            //takenum += m[1];
                        } else {
                            take += '<b class=' + m[0].substr(1) + ' prof-' + f1.prof + '>-' + m[1] + '</b>';
                            takenum -= m[1];
                        }
                    } else tm[2] += _t('msg_unknown_prameter %val%', {
                        '%val%': msg[k]
                    }) + '</b><br>'; //'Nieznany parametr: <b>'+msg[k]
            }
        }
        if (tmpName != '') f1.name = tmpName;
        if (type == 'auto') type = Engine.battle.warriorsList[id1].team < 2 ? 'attack' : 'attack2';
        if (attack != '') {
            type = Engine.battle.warriorsList[id1].team < 2 ? 'attack' : 'attack2';

            Engine.battle.warriorsList[id1].setAttackAction();

            tm[0] = _t('msg_dmgdone %name1% %hpp% %val%', {
                '%name1%': f1.name,
                '%hpp%': f1.hpp,
                '%val%': attack
            }) + '<br>'; //f1.name+'('+f1.hpp+'%) uderzyÅ# z siÅÄ '+attack+'<br>'
            tm[2] += _t('msg_dmgtaken %name1% %hpp% %val%', {
                '%name1%': f2.name,
                '%hpp%': f2.hpp,
                '%val%': take
            }) + '<br>'; //f2.name+'('+f2.hpp+'%) otrzymaÅ$ '+take+' obraÅ¼eÅ<br>'


            if (!(Engine.battle.isAuto || !init) && take) {
                if (typeof(Engine.battle.takenQueue[f2.id]) == 'undefined') {
                    Engine.battle.takenQueue[f2.id] = 0;
                }

                (function() {
                    var fr = f2.team == Engine.battle.myteam ? "fr" : "en";
                    var tp = takenum < 0 ? "neg" : (takenum > 0 ? "pos" : '');
                    var text = takenum > 0 ? '+' : '';
                    var cl = fr + ' ' + tp;
                    //var $d = $('<div class="dmg ' + fr + ' ' + tp + '">' + (text) + takenum + '</div>');
                    var $d = tpl.get('dmg').html((text) + takenum).addClass(cl);

                    setTimeout(function() {
                        var top = parseInt(f2.$.css('top'));
                        $d.css({
                            top: top,
                            left: parseInt(f2.$.css('left')) - 15 + (Math.random() * 10) - 5
                        });
                        $('.battle-area', Engine.battle.$).append($d);
                        $d.animate({
                            top: top - 40,
                            opacity: 0
                        }, 1500, function() {
                            $(this).remove();
                        });
                    }, Engine.battle.takenQueue[f2.id] * 250);

                    Engine.battle.takenQueue[f2.id]++;
                })(f2);
            }

        }
        if (type != '') type = ' class=' + type;

        // pushing messages to array so user can copy them later in bbCode format
        var wrapper = '';
        switch (type.split('=')[1]) {
            case 'attack2':
                wrapper = 'i';
                break;
            case 'attack':
                wrapper = '';
                break;
            default:
                if (type == 'neu') {
                    console.log('[BattleMessage.js, battleMsg] Warn battle');
                    debugger;
                }
                wrapper = (type == 'neu' ? 'u' : 'b');
        }

        //replace gender signs #,$ only in pl version (display in forum copy log)
        var tmp3 = tm.join('');
        // if (_l() == 'pl') tmp3 = tmp3.replace(/#/g, g1).replace(/\$/g, g2);
        if (isPl()) tmp3 = tmp3.replace(/#/g, g1).replace(/\$/g, g2);
        var tmp2 = strip_tags(tmp3.replace(/<br>/gim, "\n"), false);

        self.forumLog.push(wrapper == '' ? tmp2 : '[' + wrapper + ']' + tmp2 + '[/' + wrapper + ']');

        //replace gender signs #,$ only in pl version (display in ingame log)
        var tmpM = tm.join('');
        // if (_l() == 'pl') tmpM = tmpM.replace(/#/g, g1).replace(/\$/g, g2);
        if (isPl()) tmpM = tmpM.replace(/#/g, g1).replace(/\$/g, g2);

        //replace all '++' to '+' (bug in many translation)
        tmpM = tmpM.replace(/\+\+/g, '+');

        var $msg = tpl.get('battle-msg').html(parseContentBB(tmpM, false));
        var s = type.split('=');
        $msg.addClass(s[1]);


        if ($battleMessageWrapper) {
            $battleMessageWrapper.append($msg)
        } else {
            $msgWrapper.append($msg);
        }

        //if (!Engine.dead) {
        //if (!Engine.opt(8)) {
        //if (isSettingsOptionsInterfaceAnimationOn()) {
        //	$msg.css('display', 'none');
        //	$msg.fadeIn("slow");
        //}
        //}
        if (!$battleMessageWrapper) {
            battleLogHelpWindow.appendMsg($msg.clone());
        }
        //self.updateScroll();
    };

    //var transitionEvent = whichTransitionEvent();
    //transitionEvent && $content[0].addEventListener(transitionEvent, function () {
    //	$('.scroll-wrapper', $content).trigger('update');
    //}, false);

    //this.init();
};











//var v = 1;
//var name = 'asd';
//
//var a = [
//'+crush' ,
//'vamp_time' ,
//'+taken_dmg' ,
//'+critpierce'
//];
//
//for (var i = 0; i < a.length; i++) {
//	_t('eng_game_only_val_' + a[i] + ' %val%', {'%val%': name})
//}
//
//
//_t('eng_game_only_nick_spell-vamp_time %name%', {'%name%': name});
//_t('eng_game_only_nick_distortion %name%', {'%name%': name});;
//
////nick and value
//_t('eng_game_nick_and_value_heal_per-allies %name% %val%', {'%name%': name, '%val%': name});
//_t('eng_game_nick_and_value_heal_per-enemies %name% %val%', {'%name%': name, '%val%': name});
//_t('eng_game_nick_and_value_hp_per-allies %name% %val%', {'%name%': name, '%val%': name});
//_t('eng_game_nick_and_value_hp_per-enemies %name% %val%', {'%name%': name, '%val%': name});
//
////opponent_nick and value
//
//_t('eng_game_opponent_nick_and_value_dmg-target_physical %target% %val%', {'%target%': name, '%val%': name});
//
////nick and opponent
//_t('eng_game_nick_and_opponent_spell-taken_dmg %name% %target%',{'%name%': name, '%target%': name});
//_t('eng_game_nick_and_opponent_balloflight %name% %target%',{'%name%': name, '%target%': name});
//_t('eng_game_nick_and_opponent_spell-distortion %name% %target%',{'%name%': name, '%target%': name});
////nick and FRIENDNICK
//
//_t('eng_game_nick_and_friendnick_immunity_to_dmg %name% %friend%', {'%name%': name, '%friend%': name});