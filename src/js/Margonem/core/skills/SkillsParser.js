/**
 * Created by Michnik on 2015-08-31.
 */
let ProfData = require('@core/characters/ProfData');
var SkillTip = require('@core/skills/SkillTip');
var weapon = {
    'sw': ['weapon'],
    '1h': [1],
    '2h': [2],
    'bs': [3],
    'dis': [4],
    'fire': ['fire'],
    'light': ['light'],
    'frost': ['frost'],
    'sh': [14],
    'orb': [2],
    'h': [5],
    'poison': ['poison'],
    'phydis': ['phydis'],
    'wound': ['wound']
};
const skillsUsingByTrans = ["en-regen", "lightshield_per", "resfire_per", "resfrost_per", "reslight_per", "antidote", "dmg_evade_hpp-target_light", "dmg_evade_hpp-target_light", "energyout", "immunity_to_dmg"]

function getRoundLang(v) {
    if (v > 4) return _t('five_round');
    if (v > 1) return _t('two_round');
    return _t('one_round')
}

function getRound(value, second, first, stat) {
    if (!isset(value) || !isset(second)) return [value, second, ''];
    var index1 = value.search('@');
    var index2 = second.search('@');

    if (!(index1 > -1 || index2 > -1)) return [value, second, '']; //nima @

    const prefix = skillsUsingByTrans.includes(stat) ? _t('by') : _t('on');

    if (first == '') { //level 0
        var s = second.slice(0, index2);
        var v1 = value.slice(0, index1);
        var curentLvl = second.slice(index2 + 1, second.length);
        var desc = prefix + curentLvl + getRoundLang(curentLvl);
        return [v1, s, desc];
    }

    if (index1 > -1 && index2 > -1) { //level 0-9
        var curentLvl = value.slice(index1 + 1, value.length);
        var v1 = value.slice(0, index1);
        var amountRound = prefix + curentLvl;
        var nextLvl = second.slice(index2 + 1, second.length);
        var v2 = second.slice(0, index2);
        amountRound = amountRound + '<span> (' + nextLvl + ') </span> ' + getRoundLang(curentLvl);
        return [v1, v2, amountRound];
    }

    if (index1 > -1 && index2 < 0) { //level 10
        var f = value.slice(0, index1);
        var curentLvl = value.slice(index1 + 1, value.length);
        var desc = prefix + curentLvl + getRoundLang(curentLvl);
        return [f, second, desc];
    }
}

function checkPerLevel(value, second) {
    const isValueHasC = value.search('/*cplvl') > -1;
    var index1 = value.search('/*c?plvl');
    var str = !isValueHasC ? _t('value_increase_per_player') : _t('value_increase_per_player_max');
    var v1 = value.replace(/\*c?plvl/, '');

    if (!isset(second)) {
        var a1 = [v1, second, str];
        var a2 = [value, second, ''];
        return index1 > -1 ? a1 : a2;
    }
    var index2 = second.search('/*c?plvl');

    if (!(index1 > -1 || index2 > -1)) return [value, second, ''];
    var v2 = second.replace(/\*c?plvl/, '');
    return [v1, v2, str];
}

function dispatcher(stat, first, second) {
    var text = "";
    var b, c, i;
    var value = first == '' ? second : first;
    var spanClass = first == '' ? 'first' : second == '' ? 'normal' : 'compare';
    var transCat = 'default';

    var roundArray = getRound(value, second, first, stat);
    var amountRound = roundArray[2];
    value = roundArray[0];
    second = roundArray[1];

    var perLevelArray = checkPerLevel(value, second, first);
    var perLevel = perLevelArray[2];
    value = perLevelArray[0];
    second = perLevelArray[1];

    if (first != '' && isset(second) && second != '') {
        transCat = 'new_skills';
    }
    switch (stat) {
        /*basic */
        case 'step':
            text += '<span class=' + spanClass + '>' + _t('skill_' + stat);
            break;
        case 'norm-atack':
            text += '<span class=' + spanClass + '>' + _t('skill_' + stat);
            break;
            /*item_*/
        case 'acshield_per':
        case 'perdmg':
        case 'ac_per':
        case 'pdmg':
        case 'ac':
            text += '<span class=' + spanClass + '>' + _t('item_' + stat + ' %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat);
            break;

            /*skills_*/

        case 'decevade_per':
        case 'active_decevade_per':
            text += '<span class=' + spanClass + '>' + _t('skills_' + stat + ' %val%', {
                '%val%': value,
                '%val2%': second,
                '%val3%': (value < 2 ? _t('percentPoints1') : value > 4 ? _t('percentPoints3') : _t('percentPoints2'))
            }, transCat);
            break;
        case 'decevade':
            var str = value > 4 ? '' : '2';
            text += '<span class=' + spanClass + '>' + _t('skills_' + str + stat + ' %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat);
            break;
        case 'agi':
        case 'firebon':
        case 'lightbon':
        case 'frostbon':
            text += '<span class=' + spanClass + '>' + _t('skills_' + stat + ' %val%', {
                '%val%': mp(Math.floor(parseFloat(value) * 100)),
                '%val2%': mp(Math.floor(parseFloat(second) * 100))
            }, transCat);
            break;
        case 'critslow_per':
        case 'critslow':
        case 'critsa_per':
        case 'critsa':
        case 'immobilize':
        case 'lastcrit':
            //case 'decevade_per':
            //case 'decevade':
        case 'redslow':
        case 'woundred':
        case 'healpower':
        case 'engback':
        case 'sa-clothes':
        case 'red-sa':
        case 'footshoot':
        case 'critwound':
        case 'swing':
        case 'distract':
        case 'injure':
        case 'reusearrows':
        case 'pcontra':
        case 'fastarrow':
        case 'bandage_per':
        case 'bandage':
        case 'set':
        case 'resfrost_per':
        case 'resfire_per':
        case 'longfireshield':
        case 'longfrostshield':
        case 'longlightshield':
        case 'soullink':
        case 'poisonbon':
        case 'of-thirdatt':
        case 'woundchance':
        case 'wounddmgbon_perw':
        case 'wounddmgbon':
        case 'arrowrain':
        case 'insult':
        case 'frostpunch':
        case 'redstun':
        case 'active_redstun':
        case 'lightmindmg':
        case 'actdmg':
        case 'hpsa':
        case 'mresdmg':
            text += '<span class=' + spanClass + '>' + _t('skills_' + stat + ' %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat);
            break;
            /*skill_*/
        case 'disturbshoot':
            text += '<span class=' + spanClass + '>' + _t('skill_' + stat + ' %val%', {
                '%val%': value,
                '%val2%': value == 6 ? 12 : value == 15 ? 30 : second,
                '%val3%': value * 2,
                '%val4%': second * 2
            }, transCat);
            break;
        case 'str':
            //case 'of-str':
            //case 'footshoot2':
        case 'stepslow_per':
            //case 'poisonbon_perw':		!!!!
        case 'poisonbon_poison-perw':
            //case 'arrowrain_perw':	!!!!
        case 'arrowrain_all-perw':
        case 'manarestore_per':
        case 'rime_per':
            //case 'firepunch_perw':	!!!!
        case 'firepunch_fire-perw':
        case 'heal1_per':
            //case 'pdmg_perw':	!!!!
        case 'pdmg_physical-perw':
        case 'energyrestore_per':
        case 'allcritval':
        case 'vamp':
        case 'reddest_per':
            //case 'rotatingblade':
            //case 'daggerthrow':
        case 'poisonstab_perw':
        case 'woundextend':
            //case 'blackout':
        case 'energyout':
        case 'adrenalin_per':
        case 'adrenalin_sa_per':
        case 'adrenalin_sa_threshold_per':
        case 'adrenalin_evade_per':
        case 'adrenalin_evade_threshold_per':
        case 'critpoison_per':
        case 'slowfreeze_per':
        case 'absorb_per':
        case 'absorbm_per':
        case 'heal_per':
        case 'distractshoot':
        case 'blind_per':
        case 'alllowdmg':
            //case 'blesswords_perw':
        case 'aura-adddmg2_per-meele':
            //case 'firedmg_perw':	!!!!
        case 'firedmg_fire-perw':
        case 'chainlightning_perw':
        case 'absagain_per':
        case 'stealmana_per':
        case 'allcritmval':
            //case 'mlightshiled':
        case 'reslight_per':
        case 'mcurse':
        case 'weakness_per':
            //case 'disturbshoot':
        case 'antidote':
        case 'lowtension':
        case 'vulture_perw':
        case 'of-wounddmgbon_perw':
        case 'act':
        case 'rage_3turns':
        case 'critrage_perw':
        case 'resfire':
        case 'reslight':
        case 'resfrost':
        case 'adddmg_physical-perw':
        case 'active_acdmg_physical-perw':
        case 'adddmg_fire-perw':
        case 'active_acdmg_per':
        case 'active_absorbdest_per':
        case 'active_block_per':
        case 'decblock_per':
        case 'active_decblock_per':
        case 'active_decblock_per-enemies':
        case 'ac2_per':
        case 'active_add_light_cumulaction':
        case 'redacdmg_per':
            text += '<span class=' + spanClass + '>' + _t('skill_' + stat + ' %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat);
            break;
        case 'trickyknife':
            break;
        case 'blackout':
            break;
            /*skill_ mp()*/
        case 'str1h':
        case 'str2h':
        case 'of-str':
            text += '<span class=' + spanClass + '>' + _t('skill_' + stat + ' %val%', {
                '%val%': mp(Math.floor(parseFloat(value) * 100)),
                '%val2%': mp(Math.floor(parseFloat(second) * 100))
            }, transCat);
            break;
            /*bonus_*/
        case 'runes':
        case 'goldpack':
        case 'perheal':
        case 'crit':
        case 'active_crit':
        case 'of-crit':
        case 'critval':
        case 'of-critval':
        case 'critmval':
        case 'critmval_f':
        case 'critmval_c':
        case 'critmval_l':
        case 'heal':
        case 'pierce':
        case 'pierceb':
        case 'contra':
        case 'parry':
        case 'fire':
        case 'light':
        case 'adest':
        case 'absorb':
        case 'absorbm':
        case 'hpbon':
        case 'acdmg_per':
            //case 'acdmg_perw':	!!!!
        case 'acdmg_physical-perw':
            //case 'acdmg':
        case 'resdmg':
        case 'en-regen':
        case 'manastr':
        case 'manarestore':
        case 'manatransfer':
        case 'stun':
        case 'freeze':
        case 'hpcost':
        case 'cover':
        case 'allslow':
        case 'allslow_per':
            //case 'firearrow_perw':	!!!!
            //case 'firearrow_fire-perw':
        case 'dmg_evade-target_fire-perw':
        case 'dmg-target_fire-perw':
        case 'firewall_perw':
            //case 'firewall':
        case 'thunder':
        case 'storm':
        case 'lowdmg':
        case 'lowdmg_self':
        case 'lowdmg_enemy':
        case 'blizzard':
        case 'sunshield_per':
        case 'sunreduction':
        case 'healall_per':
        case 'healall':
        case 'heal1':
        case 'absorbd':
        case 'abdest':
        case 'endest':
        case 'manadest':
        case 'lowevade':
        case 'lowcrit':
        case 'arrowblock':
            //case 'evade_per':
        case 'redabdest_per':
            text += '<span class=' + spanClass + '>' + _t('bonus_' + stat + ' %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat);
            break;
        case 'evade_per':
            text += '<span class=' + spanClass + '>' + _t('bonus_' + stat + ' %val%', {
                '%val%': value,
                '%val2%': second,
                '%val3%': (value < 2 ? _t('percentPoints1') : value > 4 ? _t('percentPoints3') : _t('percentPoints2'))
            }, transCat);
            break;
            /*bonus_ mp()*/
        case 'hp':
        case 'sa_per':
        case 'sa2_per':
        case 'ds':
        case 'dz':
        case 'di':
        case 'da':
        case 'gold':
        case 'blok_per':
        case 'blok':
        case 'evade':
        case 'energybon':
        case 'energygain':
        case 'manabon':
        case 'managain':
        case 'aura-resall':
            text += '<span class=' + spanClass + '>' + _t('bonus_' + stat + ' %val%', {
                '%val%': mp(value),
                '%val2%': mp(second)
            }, transCat);
            break;
        case 'dmg_evade_hpp-target':
        case 'dmg_evade_hpp-target_light':
        case 'lightshield2_per':
        case 'lightshield_per':
        case 'lightshield':
            text += '<span class=' + spanClass + '>' + _t('skills_' + stat + ' %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat);
            break;
        case 'rage':
            text += '<span class=' + spanClass + '>' + _t('skills_rage %val% %turn%', {
                '%val%': value,
                '%turn%': (parseInt(value) > 1 ? (parseInt(value) > 4 ? _t('five_round') : _t('two_round')) : ' ' + _t('turn')),
                '%val2%': second
            }, transCat);
            break;
        case 'doubleshoot':
            text += '<span class=' + spanClass + '>' + _t('skill_doubleshoot');
            break;
        case 'disturb':
            text += '<span class=' + spanClass + '>' + _t('skills_disturb %val%', {
                '%val%': value,
                '%val2%': (parseInt(value) * 2),
                '%val3%': second,
                '%val4%': (parseInt(second) * 2)
            }, transCat);
            break;
        case 'shout':
            text += '<span class=' + spanClass + '>' + _t('skills_shout %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat) + ' ' + (value > 1 ? _t('moreenemy') : _t('oneenemy'));
            break;
        case 'sa1':
            text += '<span class=' + spanClass + '>' + _t('bonus_sa1 %val%', {
                '%val%': value / 100,
                '%val2%': second / 100
            }, transCat);
            break;
        case 'leczy':
            if (value > 0) text += '<span class=' + spanClass + '>' + _t('bonus_leczy %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat);
            else text += '<span class=' + spanClass + '>' + _t('bonus_truje %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat);
            break;
        case 'fullheal':
            text += '<span class=' + spanClass + '>' + _t('bonus_fullheal %val%', {
                '%val%': round(value, 2),
                '%val2%': round(second, 2)
            }, transCat);
            break;
        case 'creditsbon':
            text += '<span class=' + spanClass + '>' + _t('bonus_creditsbon');
            break;
        case 'revive':
            text += '<span class=' + spanClass + '>' + _t('revive %amount%', {
                '%amount%': value,
                '%val2%': second
            }, transCat);
            break;
        case 'frost':
            b = value.split(',');
            text += '<span class=' + spanClass + '>' + _t('bonus_frost %val% %slow%', {
                '%val%': b[1],
                '%slow%': (b[0] / 100)
            }, transCat);
            break;
        case 'poison':
            b = value.split(',');
            text += '<span class=' + spanClass + '>' + _t('bonus_poison %val% %slow%', {
                '%val%': b[1],
                '%slow%': (b[0] / 100)
            }, transCat);
            break;
        case 'slow':
            text += '<span class=' + spanClass + '>' + _t('bonus_slow %val%', {
                '%val%': (value / 100),
                '%val2%': (second / 100)
            }, transCat);
            break;
        case 'wound':
            b = value.split(',');
            text += '<span class=' + spanClass + '>' + _t('bonus_wound %val% %dmg%', {
                '%val%': b[0],
                '%dmg%': b[1]
            }, transCat);
            break;
        case 'energy':
            if (value > 0) text += '<span class=' + spanClass + '>' + _t('bonus_energy1 %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat);
            else text += '<span class=' + spanClass + '>' + _t('bonus_energy2 %val%', {
                '%val%': Math.abs(value),
                '%val2%': Math.abs(second)
            }, transCat);
            break;
        case 'energyp':
            if (value > 0) text += '<span class=' + spanClass + '>' + _t('bonus_energyp1 %val%', {
                '%val%': mp(value),
                '%val2%': mp(second)
            }, transCat);
            else text += '<span class=' + spanClass + '>' + _t('bonus_energyp2 %val%', {
                '%val%': Math.abs(value),
                '%val2%': Math.abs(second)
            }, transCat);
            break;
        case 'mana':
            if (value > 0) text += '<span class=' + spanClass + '>' + _t('bonus_mana1 %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat);
            else text += '<span class=' + spanClass + '>' + _t('bonus_mana2 %val%', {
                '%val%': Math.abs(value),
                '%val2%': Math.abs(second)
            }, transCat);
            break;
        case 'firearrow':
        case 'firepunch':
        case 'firebolt':
            text += '<span class=' + spanClass + '>' + _t('bonus_firebolt %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat);
            break;

        case 'sunshield':
            text += '<span class=' + spanClass + '>' + _t('bonus_sunshield %val%', {
                '%val%': value,
                '%val2%': (value / 2)
            }, transCat);
            break;
        case 'aura-ac_per':
        case 'aura-ac':
            text += '<span class=' + spanClass + '>' + _t('bonus_aura-ac %val%', {
                '%val%': mp(value),
                '%val2%': mp(second)
            }, transCat);
            break;
        case 'aura-sa_per':
            text += '<span class=' + spanClass + '>' + _t('bonus_aura-sa_per %val%', {
                '%val%': mp(value),
                '%val2%': mp(second)
            }, transCat);
            break;
        case 'aura-sa':
            text += '<span class=' + spanClass + '>' + _t('bonus_aura-sa %val%', {
                '%val%': mp(value / 100),
                '%val2%': mp(second / 100)
            }, transCat);
            break;
        case 'removedot':
        case 'removedot-allies':
        case 'removestun':
            text += '<span class=' + spanClass + '>' + _t('skill_' + stat, null, transCat);
            break;
        case 'stinkbomb':
            text += '<span class=' + spanClass + '>' + _t('bonus_stinkbomb %val% %crit%', {
                '%val%': (parseInt(value) * 2),
                '%crit%': value,
                '%val2%': (parseInt(second) * 2),
                '%crit2%': second
            }, transCat);
            break;
        case 'reqp':
            for (i = 0; i < value.length; i++) {
                text += '<div class="cl-icon icon-' + value.charAt(i) + '"></div>';
            }
            break;
        case 'reqw':
            b = value.split(',');
            var iconNumber = 0;
            for (i = 0; i < b.length; i++) {
                for (var j = 0; j < weapon[b[i]].length; j++) {
                    iconNumber = weapon[b[i]][j];
                    // if (Engine.hero.d.prof == 'm') {
                    if (Engine.hero.d.prof == ProfData.MAGE) {
                        if (weapon[b[i]][j] == 1) {
                            iconNumber = 6;
                        } else if (weapon[b[i]][j] == 2) {
                            iconNumber = 7;
                        }
                    }
                    text += '<div data-icon="icon-' + iconNumber + '" class="cl-icon icon-' + iconNumber + '"></div>';
                }
            }
            break;
        case 'add_attacks':
            var str = value > 1 ? 'add_moreAttacks %val%' : 'add_attacks %val%';

            text += '<span class=' + spanClass + '>' + _t(str, {
                '%val%': value,
                '%val2%': second
            }, transCat);
            break;


            // eng game

            //wartoï¿½ï¿½ z %
            //1. common
        case 'dmg_to_npc_per': // - "Obraï¿½enia zadawane potworom: val%"
        case 'dmg_from_npc_per': // - "Obraï¿½enia otrzymywane od potworï¿½w: val%"
        case 'dmg_to_player_per': // - "Obraï¿½enia zadawane graczom: val%"
        case 'dmg_from_player_per': // - "Obraï¿½enia otrzymywane od graczy: val%"
        case 'chest_armor_per': // - "Zwiï¿½kszenie pancerza ze zbroi o val%"
            //2. Wojownik:
            //case 'critval_enemies': 								// - "Siï¿½a krytyka fizycznego przeciwnikï¿½w: val%"
        case 'critval-enemies': // - "Siï¿½a krytyka fizycznego przeciwnikï¿½w: val%"
            //case 'critval_allies': 									// - "Siï¿½a krytyka fizycznego sojusznikï¿½w: val%"
        case 'critval-allies': // - "Siï¿½a krytyka fizycznego sojusznikï¿½w: val%"
            //case 'critmval_enemies': 								// - "Siï¿½a krytyka magicznego przeciwnikï¿½w: val%"
        case 'critmval-enemies': // - "Siï¿½a krytyka magicznego przeciwnikï¿½w: val%"
            //case 'critmval_allies': 								// - "Siï¿½a krytyka magicznego sojusznikï¿½w: val%"
        case 'critmval-allies': // - "Siï¿½a krytyka magicznego sojusznikï¿½w: val%"
        case 'crush_threshold_per': // - "Zmiaï¿½dï¿½enie, gdy przynajmniej val% obraï¿½eï¿½ przejdzie przez pancerz przeciwnika"
        case 'crush_dmg_per': // - "Zwiï¿½kszenie obraï¿½eï¿½ o val% po zmiaï¿½dï¿½eniu"
            //3. Tancerz ostrzy:
        case 'vamp_time_per': // - "Zwraca ï¿½ycie w wielkoï¿½ci val% zadanych obraï¿½eï¿½"
        case 'dmg-swing_physical-perw': // - "Atak o sile val% obraï¿½eï¿½ na 2 pozostaï¿½ych przeciwnikï¿½w"
            //4. ï¿½owca:
        case 'taken_dmg_per': // - "Zwiï¿½kszenie o val% przyjmowanych obraï¿½eï¿½"
        case 'critpierce_per': // - "Zwiï¿½kszenie niszczenia pancerza o val% podczas przebicia pancerza przeciwnika ciosem krytycznym"
            //5. Mag:
        case 'dmg-row_fire-perw': // - "ï¿½ciana ognia o mocy val% posiadanego ataku od ognia"
        case 'dmg-force-4_light-perw': // - "ï¿½aï¿½cuch piorunï¿½w o mocy val% posiadanego ataku od bï¿½yskawic"
            //6. Paladyn:
        case 'hp_per-allies': // - "Aura ï¿½ycia: +val% ï¿½ycia dla sojusznikï¿½w"
        case 'hp_per-enemies': // - "Aura ï¿½ycia: val% ï¿½ycia dla przeciwnikï¿½w"
            //7. Tropiciel:
        case 'heal_per-allies': // - "Zwiï¿½kszenie leczenia turowego z posiadanego ekwipunku sojusznikï¿½w o +val%"
        case 'heal_per-enemies':
            text += '<span class=' + spanClass + '>' + _t('end-game-percent' + stat + ' %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat);
            break;

            //wartoï¿½ï¿½ bez %
            //3. Tancerz ostrzy:
        case 'acdmg': // - "Niszczy val punktï¿½w pancerza podczas ciosu"
        case 'active_acdmg': // - "Niszczy val punktï¿½w pancerza podczas ciosu"
        case 'dmg-line_physical': // - "Atak o sile val obraï¿½eï¿½ w kaï¿½dego z trafionych przeciwnikï¿½w"
            //5. Mag:
        case 'immunity_to_dmg': // - "Niewraï¿½liwoï¿½ï¿½ na otrzymywane obraï¿½enia"
            //6. Paladyn:
        case 'dmg-target_physical': // - "Zadaje val obraï¿½eï¿½ fizycznych przeciwnikowi"
            //7. Tropiciel:
        case 'distortion': // - "Postaï¿½ spaczona automatycznie zaatakuje sama siebie"
            text += '<span class=' + spanClass + '>' + _t('end-game-without-percent' + stat + ' %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat);
            break;

            //dwie wartoï¿½ci w stacie
            //6. Paladyn:
        case 'manaendest': // - "Niszczenie many o val i energii o val2"
            text += '<span class=' + spanClass + '>' + _t('end-game-more-val' + stat + ' %val% %val2% %val3% %val4%', {
                '%val%': value,
                '%val2%': second,
                '%val3%': Math.round(value / 3),
                '%val4%': Math.round(second / 3)
            }, transCat);
            break;
            //do ukrycia
            //3. Tancerz ostrzy:
        case 'rotatingblade': // - trzeba ukryï¿½ ten stat w panelu UM, posï¿½uï¿½y tylko jako etykietka w logu walki
        case 'daggerthrow': // - trzeba ukryï¿½ ten stat w panelu UM, posï¿½uï¿½y tylko jako etykietka w logu walki
            //5. Mag:
        case 'chainlightning': // - trzeba ukryï¿½ ten stat w panelu UM, posï¿½uï¿½y tylko jako etykietka w logu walki
        case 'firewall': // - trzeba ukryï¿½ ten stat w panelu UM, posï¿½uï¿½y tylko jako etykietka w logu walki
            //6. Paladyn:
        case 'balloflight': // - trzeba ukryï¿½ ten stat w panelu UM, posï¿½uï¿½y tylko jako etykietka w logu walki
            break;

            //new stats


        case 'doublecastcost_per': // - UÅ¼ycie umiejÄtnoÅci drugi raz z rzÄdu podnosi jej koszt o x%
        case 'combo-crit': // - +x pkt. kombinacji za kaÅ¼dy zadany cios krytyczny
        case 'combo-block': // - +x pkt. kombinacji za kaÅ¼dy zablokowany cios
        case 'combo-evade': // - +x pkt. kombinacji za kaÅ¼dy unikniÄty cios
        case 'combo-wound': // - +x pkt. kombinacji za kaÅ¼dÄ zadanÄ gÅÄbokÄ ranÄ
        case 'combo-pierce': // - +x pkt. kombinacji za kaÅ¼dy zablokowany cios
        case 'combo-skill': // - +x pkt. kombinacji za kaÅ¼de uÅ¼ycie tej umiejÄtnoÅci
        case 'combo-max': // - ZuÅ¼ywa wszystkie punkty kombinacji oraz dodaje bonus za maksymalnie x pkt.
        case 'combo_perdmg': // - ZwiÄkszenie obraÅ¼eÅ o x% za kaÅ¼dy pkt. kombinacji
        case 'combo_resfire_per': // - Dodaje x% odpornoÅci na ogieÅ za kaÅ¼dy pkt. kombinacji
        case 'combo_resfrost_per': // - Dodaje x% odpornoÅci na zimno za kaÅ¼dy pkt. kombinacji
        case 'combo_reslight_per': // - Dodaje x% odpornoÅci na bÅyskawice za kaÅ¼dy pkt. kombinacji
        case 'combo_dmg_hpp-target': // - Zadaje wrogiemu graczowi obraÅ¼enia rÃ³wne x% jego maksymalnego Å¼ycia za kaÅ¼dy pkt. kombinacji
        case 'dmg_hpp-target': // - Zadaje wrogiemu graczowi obraÅ¼enia rÃ³wne x% jego maksymalnego Å¼ycia
        case 'combo_dmg_hpp-target_fire': // - Zadaje wrogiemu graczowi obraÅ¼enia od ognia rÃ³wne x% jego maksymalnego Å¼ycia za kaÅ¼dy pkt. kombinacji
        case 'dmg_hpp-target_fire': // - Zadaje wrogiemu graczowi obraÅ¼enia od ognia rÃ³wne x% jego maksymalnego Å¼ycia
        case 'combo_dmg_hpp-target_frost': // - Zadaje wrogiemu graczowi obraÅ¼enia od zimna rÃ³wne x% jego maksymalnego Å¼ycia za kaÅ¼dy pkt. kombinacji
        case 'dmg_hpp-target_frost': // - Zadaje wrogiemu graczowi obraÅ¼enia od zimna rÃ³wne x% jego maksymalnego Å¼ycia
        case 'combo_dmg_hpp-target_light': // - Zadaje wrogiemu graczowi obraÅ¼enia od bÅyskawic rÃ³wne x% jego maksymalnego Å¼ycia za kaÅ¼dy pkt. kombinacji
        case 'dmg_hpp-target_light': // - Zadaje wrogiemu graczowi obraÅ¼enia od bÅyskawic rÃ³wne x% jego maksymalnego Å¼ycia
        case 'combo_heal_per': //- Przywraca x% Å¼ycia za kaÅ¼dy pkt. kombinacji
        case 'combo_energyrestore_per': // - Przywraca x% energii za kaÅ¼dy pkt. kombinacji
        case 'combo_manarestore_per': // - Przywraca x% many za kaÅ¼dy pkt. kombinacji
        case 'combo_lowdmg_enemy': // - Zmniejsza zadawane przez przeciwnika obraÅ¼enia o x% za kaÅ¼dy pkt. kombinacji
        case 'dmg_hpp-row_fire': // - Wypala x% maksymalnego Å¼ycia graczy stojÄcych w jednej linii
        case 'dmg_hpp-row_frost': // - WymraÅ¼a x% maksymalnego Å¼ycia graczy stojÄcych w jednej linii
        case 'dmg_hpp-row_light': // - PoraÅ¼a x% maksymalnego Å¼ycia graczy stojÄcych w jednej linii
        case 'lowheal_per-enemies': // - OsÅabia o x% leczenie z aktywnych umiejÄtnoÅci przeciwnika
        case 'achpp_per': // - Dodaje 1% pancerza za kaÅ¼de brakujÄce x% Å¼ycia
        case 'adrenalin_reddest_threshold_per': // - PrÃ³g adrenaliny rÃ³wny x% Å¼ycia
        case 'adrenalin_reddest_per_sum': // - ZwiÄksza redukcjÄ niszczenia many i energii o x%
        case 'poisonspread': // - Rozprzestrzenienie trucizny na x przeciwnikÃ³w
        case 'taken_dmg_per-row':
        case 'taken_dmg_per-all':
        case 'perdmg-allies':
        case 'active_crit-allies':
        case 'disturb_crit':
        case 'disturb_pierce':
        case 'stinkbomb_crit':
        case 'stinkbomb_pierce':
            text += '<span class=' + spanClass + '>' + _t('skill_' + stat + ' %val%', {
                '%val%': value,
                '%val2%': second
            }, transCat);
            break;
        case 'removeslow-allies': // - UsuniÄcie spowolnieÅ ze swojej druÅ¼yny
        case 'removestun-allies': // - UsuniÄcie ogÅuszeÅ ze swojej druÅ¼yny
        case 'of-woundstart': // - Rani przeciwnika gÅÄbokÄ ranÄ pomocniczÄ, gdy ten nie byÅ wczeÅniej zraniony
        case 'poison_lowdmg_per-enemies': // - osÅabienie zadawanych obraÅ¼eÅ przez zatrutych przeciwnikÃ³w
            text += '<span class=' + spanClass + '>' + _t('skill_' + stat, {
                '%val%': value,
                '%val2%': second
            }, transCat);
            break;
        case 'cooldown': // - Czas odnowienia: x tur. //dla x=1 "tura", x=2,3,4 "tury" x>4 "tur"
            text += '<span class=' + spanClass + '>' + _t('skill_' + stat, {
                '%val%': value,
                '%val2%': second
            }, transCat);
            text += value == 1 ? _t('turn') : value > 4 ? _t('turn5') : _t('turns');
            break;
        case 'reqarrows': // - Wymaga x strzaÅ //dla x=1 "strzaÅy, x>1 "strzaÅ
            //console.log(value);
            var str = value > 4 ? '5arrow' : value > 1 ? '2arrow' : 'arrow';
            text += value + ' ' + _t(str);
            break;
        default:
            if (stat != '') text += '<span class=' + spanClass + '>' + _t('unknown_stat %val%', {
                '%val%': stat
            }, transCat); //'Nieznany stat: '+stat+'<br>'
            break;
    }

    return text + perLevel + amountRound;
}
var toRemove = ['reqp', 'reqw', 'lvl', 'reqarrows'];

function removeUnnecessaryStats(tab) {
    for (var i in toRemove) {
        for (var j in tab) {
            var index = tab[j].indexOf(toRemove[i]); // <-- Not supported in <IE9
            if (index !== -1) {
                tab.splice(index, 1);
            }
        }
    }
    return tab;
}

module.exports = {
    getSections: function(skillId, skill) {

        let tmp;
        let regs;
        let sections = {
            attr: {
                0: [],
                1: [],
                2: []
            },
            cost: [],
            regs: [],
            lvl: null
        }

        // let skill  = Engine.battle.getBattleSkill(skillId)
        // let skill  = Engine.battle.getBattleSkill(skillId)

        sections.lvl = skill.lvl;

        if (!skill.regs) {

            if (skill['kind'] == '') regs = [];
            else {
                tmp = skill['kind'].split('|')[0];
                regs = this.getRegs(tmp)
            }

        } else {
            regs = this.getRegs(skill.regs)
        }

        for (let k in regs) {
            let reg = regs[k];
            let newReg = Engine.battle.changeIconRegToTextReg(reg)
            sections.regs.push(newReg);
        }

        let stats = SkillTip.getStats(skill);
        let parseStats = this.getStats(stats, 10);

        for (let k in parseStats) {
            let section = 0;
            let text = parseStats[k];

            if (text.search('(passive effect)') > -1 || text.search('(efekt pasywny)') > -1) section = 1;
            if (text.search('combination points') > -1 || text.search('pkt kombinacji') > -1) section = 2;
            if (text.search(' cost: ') > -1 || text.search('Koszt ') > -1) section = 'cost';

            switch (section) {
                case 0:
                    sections['attr'][section].push(text);
                    break;
                case 1:
                    sections['attr'][section].push(text);
                    break;
                case 2:
                    sections['attr'][section].push(text);
                    break;
                case 'cost':
                    sections[section].push(text);
                    break;
            }

        }
        return sections;
    },
    getStats: function(i, lvl) {
        var splitted = i.split('&');

        if (splitted[0] == '' && splitted[1] == '') return [];

        var fSplit = splitted[0].split(';');
        var sSplit = splitted[1].split(';');
        var stats = [];

        var a, b, stat;

        fSplit = removeUnnecessaryStats(fSplit);
        sSplit = removeUnnecessaryStats(sSplit);
        var length = sSplit.length > fSplit.length ? sSplit.length : fSplit.length;

        for (var j = 0; j < length; j++) {
            a = !isset(fSplit[j]) ? ['', ''] : fSplit[j].split('=');
            b = !isset(sSplit[j]) ? ['', ''] : sSplit[j].split('=');
            a[0] = a[0] == '' ? b[0] : a[0];

            if (!isset(a[1])) a[1] = '';

            if (a[1] == b[1] && lvl == 10) b[1] = '';
            if (lvl == 0) a[1] = '';

            var statTxt = dispatcher(a[0], a[1], b[1]);

            if (statTxt) {
                stat = '<div class="skill-stat">' + statTxt + '</div>';
                stats.push(stat);
            }
        }

        return stats;
    },

    prepareFormattedHtmlStatsArrayFromSections: (sections) => {

        let htmlArray = [];

        for (let k in sections) {
            let oneSection = sections[k];

            if (oneSection.length) {
                oneSection.push('<div class="line"></div>div>')
            } else {
                delete sections[k];
            }
        }

        for (let k in sections) {
            let oneSection = sections[k]
            for (let kk in oneSection) {
                htmlArray.push(oneSection[kk])
            }
        }

        return htmlArray;
    },

    getStatsForTips: function(i, lvl) { // for battlestats=aura-sa_per:20@3+manarestore_per:44
        var fSplit = i.split('+');
        var stats = [];
        var a, stat;
        fSplit = removeUnnecessaryStats(fSplit);
        var length = fSplit.length;
        for (var j = 0; j < length; j++) {
            a = !isset(fSplit[j]) ? ['', ''] : fSplit[j].split(':');
            if (!isset(a[1])) {
                a[1] = '';
            }
            if (lvl == 0) a[1] = '';
            var statTxt = dispatcher(a[0], a[1], a[1]);
            if (statTxt) {
                stat = '<span class="tip-skill-stat">- ' + statTxt + '</span>';
                stats.push(stat);
            }
        }
        return stats;
    },

    getRegs: function(i) {
        const splitted = i.split(';');
        const regs = [];

        for (const segment of splitted) {
            const [key, value] = segment.split('=');

            if (key === 'reqp' || key === 'lvl') continue;

            const values = value.includes(',') ? value.split(',') : [value];

            values.forEach(req => {
                const statTxt = dispatcher(key, req);
                regs.push(statTxt);
            });
        }

        return regs;
    },

    getObjStats: function(i) {
        var splitted = i.split(';');
        var stats = {};
        for (var j in splitted) {
            var a = splitted[j].split('=');
            var key = a[0];
            var val = a.length > 1 ? a[1].replace(/\*c?plvl/, '') : true;
            stats[key] = val;
        }
        return stats
    }
};