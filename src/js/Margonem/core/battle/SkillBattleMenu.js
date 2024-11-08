function SkillBattleMenu() {

    let self = this;

    this.showMenuSkills = function(e, w, battleSkills) {
        let request, name;
        let menu = [];
        let order = [];
        let type = self.getType(w);

        let enemy = type == 2;
        let friendOrMyself = type == 0 || type == 1;
        let myself = type == 0;

        for (let id in battleSkills) {
            order.push(id);
        }

        order.sort(function(a, b) {
            return battleSkills[a].hotSlot - battleSkills[b].hotSlot;
        });

        for (var count = 0; count < order.length; count++) {
            let id = order[count];
            var sk = battleSkills[id];

            if (id == -1) {
                if (enemy) {
                    name = _t('attack', null, 'battle');
                    request = "fight&a=strike&id=";
                    menu.push(self.createMenuSkill(name, request, false, -1));
                }
                continue;
            }

            if (id == -2) {
                if (myself) {
                    name = _t('move_forward', null, 'battle');
                    request = "fight&a=move";
                    menu.push(self.createMenuSkill(name, request, false, -2));
                }
                continue;
            }

            if (self.canUseSkillOnThisPerson(sk, w)) {
                request = "fight&a=spell&s=" + id + "&id=";
                menu.push(self.createMenuSkill(sk.name, request, sk.cost, id));
            }
        }

        let newE = getE(e);

        newE.clientX += 100;
        Engine.interface.showPopupMenu(menu, newE);
        Engine.interface.get$popUpLayer().find('.popup-menu').addClass('skill-popup-menu');
    };

    this.canUseSkillOnThisPerson = function(sk, w) {
        let add = false;
        let type = self.getType(w);

        if ((sk.attr & 8) && !type) add = true;
        if ((sk.attr & 16) && type == 1) add = true;
        if (!(sk.attr & 24) && type == 2) add = true;

        return add;
    };

    this.getType = function(w) {
        let hero = Engine.battle.warriorsList[Engine.hero.d.id];
        let type = 1;
        if (w == hero) type = 0;
        else if (w.team != hero.team) type = 2;
        return type; // type : 0-self, 1-friend, 2-enemy
    };

    this.createMenuSkill = function(name, request, cost, skillID) {
        let cl = {
            button: {
                cls: 'not-close menu-item-skill menu-item-skill-id-' + skillID
            }
        };
        let $skill = Engine.interface.get$interfaceLayer().find('.icon-' + skillID).parent();
        let $cooldown = $skill.parent().find('.cooldown-left'); //check parent!!!!!
        let $combo = $skill.parent().find('.combo-wrapper'); //check parent!!!!!

        let txt = '<span class="name-menu-skill">' + name + '</span>';

        if (cost) {
            let $doubleCastCost = $skill.parent().find('.double-cast-cost');
            let $cost = $('<span>').html('(' + cost + ')').addClass('cost-menu-skill');

            if ($doubleCastCost.length) {
                let costType = self.getCostType($skill);
                let strDoubleCost = '(' + $doubleCastCost.html() + costType + ')';
                let $doubleCost = $('<span>').html(strDoubleCost).addClass('menu-double-cast-cost');

                txt += $doubleCost[0].outerHTML;
                $cost.css('display', 'none');
            }

            txt += $cost[0].outerHTML;
        }

        if (skillID == -1) cl.button.cls += ' one-step-skill-menu ';

        if ($cooldown.length) {
            let $clone = $cooldown.clone();
            $clone.html($clone.html() + 't');
            txt += $clone[0].outerHTML;
            cl.button.cls += ' cooldown-disabled';
        }

        if ($combo.length) {
            let $clone = $combo.clone();
            txt += $clone[0].outerHTML;
        }

        return [txt, function() {
            Engine.battle.sendRequest($skill, request, skillID);
        }, cl];
    };

    this.getCostType = function($skill) {
        if ($skill.hasClass('m')) return 'm';
        if ($skill.hasClass('e')) return 'e';
        console.error('[SkillBattleMenu.js, getCostType] Bad skill cost type');
        return '';
    };

    this.updateCooldownMenuInMenuItem = function(id, val) {
        var $menuSkill = self.getMenuSkill(id);
        var $cooldownLeft = self.getMenuSkill(id).find('.cooldown-left');

        if (!$cooldownLeft.length) {
            $cooldownLeft = $('<div>').addClass('cooldown-left cooldown-disabled');
            $menuSkill.append($cooldownLeft);
            $menuSkill.addClass('cooldown-disabled');
        }

        $cooldownLeft.html(val + 't');
    };

    this.deleteCooldownFromMenuItem = function(id) {
        let $menuSkill = self.getMenuSkill(id)
        let $cooldown = $menuSkill.find('.cooldown-left');
        if ($cooldown.length) {
            $cooldown.remove();
            $menuSkill.removeClass('cooldown-disabled');
        }
    };

    this.removeAllCooldown = function() {
        Engine.interface.get$popUpLayer().find('.menu-item-skill').find('.cooldown-left').remove();
        Engine.interface.get$popUpLayer().find('.cooldown-disabled').removeClass('cooldown-disabled');
        Engine.interface.get$interfaceLayer().find('.cooldown-left').remove();
    };

    this.getMenuSkill = function(id) {
        return Engine.interface.get$popUpLayer().find('.menu-item-skill-id-' + id);
    };

    this.removeDisabledClassFromMenuSkill = function(id) {
        Engine.interface.get$popUpLayer().find('.menu-item-skill-id-' + id).removeClass('disabled');
    };

    this.addDisabledClassToAllMenuItems = function() {
        Engine.interface.get$popUpLayer().find('.menu-item-skill').addClass('disabled');
    };


    this.addDoubleCastCostToMenuItem = function(id, val) {
        let $menuSkill = self.getMenuSkill(id);
        let $doubleCost = $('<span>').html('(' + val + ')').addClass('menu-double-cast-cost');
        $menuSkill.append($doubleCost);
        $menuSkill.find('.cost-menu-skill').css('display', 'none');
    };

    //this.deleteDoubleCostFromMenuItem = function (id) {
    //	let $menuSkill = self.getMenuSkill(id);
    //	$menuSkill.find('.menu-double-cast-cost').remove();
    //	$menuSkill.find('.cost-menu-skill').css('display', 'block');
    //};

    this.deleteAllDoubleCostFromMenu = function() {
        Engine.interface.get$popUpLayer().find('.menu-double-cast-cost').remove();
        Engine.interface.get$popUpLayer().find('.cost-menu-skill').css('display', 'inline');
    };

    this.closeMenu = function() {
        Engine.interface.get$popUpLayer().find('.skill-popup-menu').remove();
    }

}

module.exports = SkillBattleMenu;