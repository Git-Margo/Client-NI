// var Parser = require('@core/skills/SkillsParser');
var Tpl = require('@core/Templates');
const {
    replaceNumber
} = require('../HelpersTS');

module.exports = {

    setSkillTip: function($skill, skill) {
        let skillId = skill['id'];
        let name = skill['name'];
        let sections = require('@core/skills/SkillsParser').getSections(skillId, skill)
        let text = this.getSkillTextBySectionsData(sections);
        let $oneBattleSkillTip = Tpl.get('one-battle-skill-tip');

        $oneBattleSkillTip.find('.skill-name').html(name);
        $oneBattleSkillTip.find('.skill-attrs').html(text.join(' '));

        if (sections.cost != '') {
            let v = sections.cost.join('').replace(/\((\D+[\d\D]*)\)/g, ""); // to remove text between parentheses in cost
            $oneBattleSkillTip.find('.skill-cost').html(v);
        }
        if (sections.lvl != '') $oneBattleSkillTip.find('.skill-level').html(_t('level', null, 'pklist') + sections.lvl);

        $oneBattleSkillTip.find('.icon').addClass('icon-' + skillId + ' ' + _l());
        if (getDebug()) $oneBattleSkillTip.append(this.getDebugContent(skill))

        $skill.tip($oneBattleSkillTip.prop('outerHTML'), 't_skill');
    },

    getDebugContent: (skill) => `
    <span class="debug-content">
      id: ${skill.id}, 
      name: ${skill.name}<br>
      regs: ${skill.regs}<br>
      stats: ${skill.stats}<br>
      kind: ${skill.kind}
    </span>
  `,

    changeIconRegToTextReg: function(text) {
        let iconTips = Engine.battle.getIconTips()
        for (let k in iconTips) {
            if (text.search(k) > -1) return '<span class="weapon-require">' + iconTips[k] + '</span>'
        }

        return text
    },

    getSkillTextBySectionsData: function(sections) {
        let text = [];

        for (let k in sections.attr) {
            let oneSection = sections.attr[k];
            if (!oneSection.length) continue;
            for (let kk in oneSection) {
                text.push(oneSection[kk])
            }
            text.push('<div class="line"></div>')
        }

        if (sections.regs.length) {
            text.push('<div>' + _t('lower_requirements', null, 'skills') + '</div>')

            for (let kk in sections.regs) {
                text.push(`- ${sections.regs[kk]}<br>`)
            }

            text.push('<div class="line"></div>')
        }

        // if (sections.cost.length) {
        //   text.push(sections.cost[0])
        // }
        //
        // if (sections.lvl) {
        //   text.push(sections.lvl)
        // }

        return text;
    },
    getStats: function(skill, lvl) {
        let stats = null;

        // var splitted = sk['kind'].split('|');
        // if (splitted[0] == 'unav')  stats = sk['stats'] + '&' + splitted[1] + ';' + splitted[2];
        // else                        stats = sk['stats'] + '&' + splitted[0] + ';' + splitted[1];
        //
        // if (splitted.length == 1) stats = sk['stats'] + '&' + sk['stats'];

        if (!isset(skill.cLvl)) { // fix for battle skills
            return skill.allStats[0] + '&' + skill.allStats[0];
        }
        const destLvl = isset(lvl) ? lvl - 1 : skill.cLvl;
        const currentStats = skill.allStats[skill.currentStatsIndex];
        const nextStats = skill.regs + ';' + skill.allStats[destLvl];

        if (skill.cLvl < skill.mLvl) {
            stats = currentStats + '&' + nextStats;
        } else {
            stats = currentStats + '&' + currentStats;
        }

        return stats;
    },

    changeCostInTip: ($skill, cost) => {
        const tipData = $skill.getTipData();
        const tmpDiv = $('<div/>').html(tipData);
        const selector = '.skill-cost span';

        if (tmpDiv.find(selector).length > 0) {
            const $cost = tmpDiv.find(selector);
            const costString = $cost.text();
            $cost.text(replaceNumber(costString, cost));
            $skill.changeInTip(selector, $cost.html());
        }
    }

}