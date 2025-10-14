var tpl = require('@core/Templates');
//var RajEventsData = require('@core/raj/RajEventsData');
var RajData = require('@core/raj/RajData');
var RajBattleEventsData = require('@core/raj/rajBattleEvents/RajBattleEventsData');
let ProfData = require('@core/characters/ProfData');
var SkillTip = require('@core/skills/SkillTip');
let ColliderData = require('@core/collider/ColliderData');
module.exports = function() {

    var self = this;
    var timePassed = 0;
    let $superCast = null;
    let originalId = null;
    let focus = null;

    this.sequenceIndex = 0;
    this.frame = 0;
    this.frameAmount = 1;
    this.sequence = [];
    this.frames = null;
    this.ctx = null;
    this.fw = null;
    this.fh = null;
    this.sprite = null;
    this.fightDir = null;
    this.loaded = false;

    let notDrawSkillsAnimation = false;
    let lastSkillsAnimation = false;

    let onStartFightWithNpcCall = false;

    this.fightAction = null;

    let properWarriorImageLoaded = false;

    this.updateDrawOrNoSkillsAnimation = () => {
        if (notDrawSkillsAnimation) {
            return
        }

        if (lastSkillsAnimation) {
            setLastSkillsAnimation(false);
            setNotDrawSkillsAnimation(true);
        }
    };

    const setLastSkillsAnimation = (_lastSkillsAnimation) => {
        lastSkillsAnimation = _lastSkillsAnimation
    }

    const setNotDrawSkillsAnimation = (_notDrawSkillsAnimation) => {
        notDrawSkillsAnimation = _notDrawSkillsAnimation
    }

    const getNotDrawSkillsAnimation = () => {
        return notDrawSkillsAnimation;
    }

    this.setActions = function(patch) {

        if (!this.npc) return;

        var myRe = new RegExp(/_s_(.*?)_e_/g);
        var myArray = myRe.exec(patch);

        if (!myArray) return;

        if (myArray.length > 2) return console.warn('[OneWarrior.js, setActions] Multiple declaration', patch);

        let args = myArray[1];

        let sequence = [];

        for (let k of args) {
            let pInt = parseInt(k);
            if (!Number.isInteger(pInt)) {
                self.frameAmount = 1;
                console.warn('[OneWarrior.js, setActions] Argument is not integer');
                return
            } else {
                //self.frameAmount = Math.max(self.frameAmount, (pInt + 1));
                sequence.push(pInt);
            }
        }

        self.frameAmount = 5;

        self.sequence = sequence;
    };

    this.getFrameWidth = (w) => {
        return w / (this.npc ? self.frameAmount : 4);
    };

    this.getFrameHeight = (w) => {
        return w / (this.npc ? 1 : 4);
    };

    /*
        this.afterFetch = (f, src) => {
            //self.loaded = true;
            //self.$.css('display', 'block')
            //var i = new Image();
            //i.src = (IE ? CFG.npath + v : f.img);
            //self.fw = this.getFrameWidth(f.hdr.width);
            //self.fh = this.getFrameHeight(f.hdr.height);
            //self.halffw = self.fw / 2;
            //self.halffh = self.fh / 2;
            //self.frames = f.frames;
            //
            ////self.leftPosMod = ((d.type > 3 && !(self.fw % 64)) ? -16 : 0);
            //self.activeFrame = 0;
            //self.sprite = i;
            //self.createCanvasIcon();
            //self.appendCanvasIcon();
            //self.draw();
            //
            //self.$.css({
            //    width: self.fw,
            //    height: self.fh,
            //    marginLeft: -(self.fw / 2) + 'px'
            //});
            //
            //self.$.find('.selector, .hover-selector').css({
            //    'height': 40,
            //    'width': self.fw,
            //    'border-radius': 60,
            //    'bottom': -15
            //});
            //
            //Engine.battle.warriors.updatePositions();
            //Engine.battle.infoUpdate();
            //Engine.battle.scaleBattle.manageBattleAreaPosition();
            Engine.imgLoader.onload(src, f, (i) => {
                  this.beforeOnload(f, i);
              }
            );
        };
    */
    this.beforeOnload = (f, i) => {
        this.loaded = true;
        this.fw = this.getFrameWidth(f.hdr.width);
        this.fh = this.getFrameHeight(f.hdr.height);
        this.halffw = self.fw / 2;
        this.halffh = self.fh / 2;
        this.frames = f.frames;
        //this.activeFrame    = 0;
        this.sprite = i;
        this.resetActiveFrame();
        this.setWarriorCharacter();

        setProperWarriorImageLoaded();
    };

    const setProperWarriorImageLoaded = () => {
        properWarriorImageLoaded = true;

        getEngine().battle.warriors.allWarriorsLoadedCallback();
    };

    this.getProperWarriorImageLoaded = () => {
        return properWarriorImageLoaded
    };

    this.addAnimateWarrior = () => {
        this.$.addClass('animate-warrior')
    };

    this.removeAnimateWarrior = () => {
        this.$.addClass('animate-warrior')
    };

    this.setWarriorCharacter = () => {
        this.$.css('display', 'block');
        this.createCanvasIcon();
        this.appendCanvasIcon();
        this.draw();

        this.$.css({
            width: self.fw,
            height: self.fh,
            marginLeft: -(self.fw / 2) + 'px'
        });

        this.$.find('.selector, .hover-selector').css({
            'height': 40,
            'width': self.fw,
            'border-radius': 60,
            'bottom': -15
        });


        Engine.battle.warriors.updatePositions();
        Engine.battle.infoUpdate();
        Engine.battle.scaleBattle.manageBattleAreaPosition();

        let isPossible = Engine.rajBattleEvents.isPossibleCallBattleEventsFromExternalProperties(this);

        if (isSettingsOptionsInterfaceAnimationOn()) setTimeout(this.addAnimateWarrior, 800);

        if (!isPossible) return;

        if (onStartFightWithNpcCall) return;

        onStartFightWithNpcCall = true;

        let _originalId = this.getOriginalId();
        let sraj = Engine.npcs.getSraj(_originalId);

        //Engine.rajController.parseObject(externalProperties, ['interface_skin', 'weather', 'night', 'mapFilter', 'earthQuake', 'characterEffect', 'fakeNpc', 'tutorial'], {npcId:_originalId});


        Engine.rajController.parseObject(sraj, [
            RajData.INTERFACE_SKIN,
            RajData.WEATHER,
            RajData.FLOAT_OBJECT,
            RajData.FLOAT_FOREGROUND,
            RajData.SCREEN_EFFECTS,
            RajData.NIGHT,
            RajData.MAP_FILTER,
            RajData.EARTHQUAKE,
            RajData.CHARACTER_EFFECT,
            RajData.FAKE_NPC,
            RajData.TUTORIAL,
            RajData.MAP_EVENTS,
            RajData.CHARACTER_IMAGE_CHANGER,
            RajData.EMO_DEFINITIONS,
            RajData.EMO_ACTIONS,
            RajData.MAP_EVENTS,
            RajData.EXTRA_LIGHT,
            RajData.DYNAMIC_LIGHT,
            RajData.BEHAVIOR_DYNAMIC_LIGHT,
            RajData.YELLOW_MESSAGE,
            RajData.SEQUENCE,
            RajData.SOUND,
            RajData.AREA_TRIGGER,
            RajData.RANDOM_CALLER,
            RajData.CONNECT_SRAJ,
            RajData.ZOOM,
            RajData.TRACKING,
        ], {
            npcId: _originalId
        });

        Engine.rajController.parseObject({
            [RajData.CALLBACK_INTERNAL_FUNCTION]: true
        }, false, false, function() {
            Engine.rajBattleEvents.callAllActionsBySpecificEventAndWarrior(RajBattleEventsData.ON_START_FIGHT_WITH_NPC, _originalId);
        })

        //Engine.rajController.addToCallbackQueue(function () {
        //    Engine.rajBattleEvents.callAllActionsBySpecificEventAndWarrior(RajBattleEventsData.ON_START_FIGHT_WITH_NPC, _originalId);
        //})
    }

    this.appendCanvasIcon = () => {
        this.setFightDir();
        this.$.find('.canvas-warrior-icon').html(this.$canvasIcon);
        Engine.battle.warriors.addCanvasWarrior(this.id, this);
        this.loaded = true;
    };

    this.setFightDir = function() {
        if (this.npc) this.fightDir = 'S';
        else this.fightDir = this.team == Engine.battle.myteam ? 'N' : 'S';
    };

    this.updateIcon = () => {

        let src;
        const icon = this.isHero() && Engine.hero.previewOutfit ? Engine.hero.previewOutfit : this.icon;

        if (!this.npc) src = CFG.r_opath + fixSrc(icon);
        else src = CFG.r_npath + fixSrc(icon);

        self.setActions(src);
        //self.setStaticAnimation(Engine.opt(8));
        self.setStaticAnimation(!isSettingsOptionsInterfaceAnimationOn());
        this.setPlaceHolderIcon();

        Engine.imgLoader.onload(src, {
            speed: true,
            externalSource: cdnUrl
        }, (i, f) => {
            this.beforeOnload(f, i);
        });

    };

    this.setPlaceHolderIcon = function() {
        let i = this.getPlaceholderCharacter();
        this.fw = 32;
        this.fh = 48;
        this.halffw = 16;
        this.halffh = 24;
        //this.activeFrame = 0;
        this.sprite = i;
        this.imgLoaded = true;
        this.frames = [{
            delay: 300
        }];
        this.resetActiveFrame();
        this.setWarriorCharacter();
    };

    this.getPlaceholderCharacter = function() {
        return this.placeHolderCharacter;
    };

    this.createCanvasIcon = function(i) {
        this.$canvasIcon = $('<canvas>');
        this.$canvasIcon.attr({
            width: self.fw,
            height: self.fh
        });
        this.ctx = this.$canvasIcon[0].getContext("2d");
    };

    this.getOriginalId = () => {
        return originalId;
    };

    this.createPlaceHolderCharacter = function() {
        Engine.imgLoader.onload('../img/def-npc-sprite.gif', false, (i, f) => {
            this.placeHolderCharacter = i;
        });
    };

    this.init = function(w, isAuto) {
        this.createPlaceHolderCharacter();
        this.id = w.id;
        originalId = w.originalId;
        this.$ = tpl.get('one-warrior').addClass('transition');
        this.$.addClass('other-id-battle-' + w.id);

        if (w.npc) {
            this.npc = true;
            this.$.addClass('one-warrior--npc');
        }
        this.setCursor(w.team);
        this.$.on('click contextmenu longpress', function(e) {
            return Engine.battle.clickCharacter(w.id, e);
        });
        this.xPos = -1;
        this.energyBar = false;
        this.manaBar = false;
        var $progressBar = this.$.find('.progress-bar-wrapper');

        var $hpp = tpl.get('health-points').addClass("stat-bar");
        $progressBar.append($hpp);

        var cont = this.$.find(".progress-bar-wrapper");

        if (this.npc) {
            $superCast = tpl.get('super-cast').addClass("stat-bar");
            $progressBar.append($superCast);
        }

        // if (w.energy0 > 0 && w.prof != 'm') {
        if (w.energy0 > 0 && w.prof != ProfData.MAGE) {
            var ep = tpl.get('energy-points').addClass("stat-bar");
            var epi = ep.find('.inner');

            ep.appendTo(cont);
            var p = w.energy / w.energy0;
            Engine.battle.warriors.setBar(epi, p * 100);
            this.energyBar = true;
        }

        // if (w.mana0 > 0 && ['w', 'b', 'h'].indexOf(w.prof) < 0 ) {
        if (w.mana0 > 0 && [ProfData.WARRIOR, ProfData.BLADE_DANCER, ProfData.HUNTER].indexOf(w.prof) < 0) {
            var mp = tpl.get('mana-points').addClass("stat-bar stat-bar-bottom");
            var mpi = mp.find('.inner');

            mp.appendTo(cont);
            var p = w.mana / w.mana0;
            Engine.battle.warriors.setBar(mpi, p * 100);
            this.manaBar = true;
        }

        if (this.energyBar || this.manaBar) {
            $hpp.addClass("stat-bar-top");
        }

        if (this.energyBar && this.manaBar) {
            ep.addClass("stat-bar-middle");
        } else if (this.energyBar && !this.manaBar) {
            ep.addClass("stat-bar-bottom");
        }

        if (!isAuto) {
            this.$.appendTo(Engine.battle.$.find('.battle-area'));
        }
    };

    this.setCursor = (team) => {
        const DO_ACTION = ColliderData.CURSOR.DO_ACTION;
        this.$.addClass(DO_ACTION);
        // if (Engine.battle.myteam === team) {
        //     this.$.addClass('do-action-cursor');
        // } else {
        //     this.$.addClass('attack-cursor');
        // }
    };

    this.update = (dt) => {

        if (this.frames && this.frames.length > 1) {
            timePassed += dt * 100;
            if (this.frames[this.activeFrame].delay < timePassed) {
                timePassed = timePassed - this.frames[this.activeFrame].delay;

                if (this.frames.length == this.activeFrame + 1) {
                    //this.activeFrame = 0;
                    this.resetActiveFrame();

                    if (this.loopAction) return;

                    this.manageSequenceAction();
                } else this.activeFrame = this.activeFrame + 1;

            }
        }
    };

    this.manageSequenceAction = function() {
        if (!self.sequence.length) return;

        self.sequenceIndex++;

        if (self.sequenceIndex > self.sequence.length - 1) {
            self.sequenceIndex = 0;
            self.frame = 0
        } else self.frame = self.sequence[self.sequenceIndex];
    };

    this.draw = function(notClear) {
        if (!this.loaded) return;

        if (!notClear) this.ctx.clearRect(0, 0, this.fw, this.fh);

        var left = 0;
        var top = 0;

        var dir = isset(this.fightDir) ? this.fightDir : 'S';
        var height = this.fh;
        var bgX = this.frame * this.fw,
            bgY = 0;
        switch (dir) {
            case 'S':
                bgY = 0;
                break;
            case 'W':
                bgY = this.fh;
                break;
            case 'E':
                bgY = this.fh * 2;
                break;
            case 'N':
                bgY = this.fh * 3;
                break;
        }

        if (this.img || this.staticAnimation) {

            this.ctx.drawImage(this.img || this.sprite, bgX, bgY, this.fw, height, left, top, this.fw, height);

        } else if (this.sprite && typeof(this.activeFrame) != 'undefined' && this.frames.length > 0 && this.npc) {

            this.ctx.drawImage(this.sprite, bgX, bgY + (this.activeFrame * this.fh), this.fw, height, left, top, this.fw, height);

        } else if (this.sprite && typeof(this.activeFrame) != 'undefined' && this.frames.length > 0 && !this.npc) {

            this.ctx.drawImage(this.sprite, bgX, bgY + (this.activeFrame * this.fh * 4), this.fw, height, left, top, this.fw, height);
        }
    };

    this.updateWarrior = (w, clientTriggeredUpdate = false) => {
        let lines = Engine.battle.warriors.getLines();

        for (var i in w) {
            var old = this[i];
            this[i] = w[i];
            switch (i) {
                case 'name':
                    this.$.find('.warrior-name').text(this.name);
                    break;
                case 'icon':
                    this.updateIcon();
                    /*
                (function (_w) {
                    _w.updateIcon(_w);
                    var img = new Image();
                    let src;
                    if (!_w.npc) {
                        img.src = CFG.opath + _w.icon.substr(1);
                        src = CFG.opath + _w.icon.substr(1);
                    } else {
                        img.src = CFG.npath + _w.icon;
                        src = CFG.npath + _w.icon;
                    }
                    // self.setActions(path);
                    // gif.fetch(path, false, function (f) {
                    // 	self.afterFetch(f, src);
                    // }, function () {
                    // 	console.warn('Error load battle warrior');
                    // });

                    img.onload = function () {
                        _w.loaded = true;
                        _w.fw = _w.npc ? img.width / getNpcFramesAmount(_w.icon) : img.width / 4;
                        _w.fh = _w.npc ? img.height : img.height / 4;

                        //if (_w.npc) {
                            _self.createCanvasWarriorIcon(_w);

                        //}

                        _w.$.css({
                            //background: 'url(' + img.src + ')',
                            width: _w.fw,
                            height: _w.fh,
                            marginLeft: -(_w.fw / 2) + 'px'
                        });
                        // _w.$.find('.css-warrior').css({
                        // 	background: 'url(' + img.src + ')',
                        // 	//top: (_w.team != 1 ? '-12px' : '0px'),
                        // 	width: _w.fw,
                        // 	height: _w.fh
                        // });
                        //_self.setCanvasImage(_w, parent.myteam, this);
                        _w.$.find('.selector, .hover-selector').css({
                            //height: _w.fw,
                            //width: _w.fw,
                            //'border-radius': _w.fw / 2,
                            //bottom: -_w.fh / 4

                            height: 40,
                            width: _w.fw,
                            'border-radius': 60,
                            bottom: -15


                        });
                        // if (!_w.npc && _w.team == parent.myteam) {
                        // 	_w.$.find('.css-warrior').css({
                        // 		backgroundPosition: '0px ' + ((_w.id < 0 ? 0 : -3) * _w.fh) + 'px'
                        // 	});
                        // }
                        _self.updatePositions();
                        //_w.$.find('.progress-bar-wrapper').css({
                        //	'margin-left': -(46 - _w.fw / 2)
                        //});


                        Engine.battle.infoUpdate();
                    }
                })(warrior);
                    */
                    break;
                case 'y':
                    if (Engine.battle.myteam != 1) this.y = 5 - this.y;
                    if (isset(old)) {
                        var index = lines[old].indexOf(this);
                        lines[old].splice(index, 1);
                    }
                    lines[this.y].push(this);
                    lines[this.y].sort(function(w1, w2) {
                        return w1.xPos - w2.xPos;
                    });
                    this.$.css('zIndex', 5 - this.y);
                    break;
                case 'hpp':
                    if (isset(old)) {

                        if (!notDrawSkillsAnimation > 0 && this.hpp == 0) {
                            setLastSkillsAnimation(true);
                        }

                        this.showDamage(old);
                    } else {

                        if (this.hpp == 0) {
                            setNotDrawSkillsAnimation(true);
                        }

                    }
                    break;
                case 'buffs':
                    //if (old) {
                    var $wrapper = this.$.find('.warrior-buffs-wrapper');
                    $wrapper.css('margin-left', -(28 - this.fw / 2));
                    Engine.battle.updateWarriorBuffs($wrapper, this.hpp, this.buffs);
                    //}
                    break;
                case 'cooldowns':
                    var cooldowns = this.cooldowns;

                    if (cooldowns.length == 0) {
                        //$('.bottom.positioner').find('.cooldown-left').remove();
                        Engine.battle.skillBattleMenu.removeAllCooldown();
                    }

                    for (var c = 0; c < cooldowns.length; c++) {
                        var a = cooldowns[c];
                        var left = a[1];
                        var $parent = $('.bottom.positioner').find('.icon-' + a[0]).parent();
                        var $slot = $parent.parent();
                        if (left == 0) {
                            $parent.removeClass('cooldown-disabled');
                            $slot.find('.cooldown-left').remove();
                            Engine.battle.skillBattleMenu.deleteCooldownFromMenuItem(a[0]);
                        } else {
                            var $cooldownLeft = $slot.find('.cooldown-left');
                            if ($cooldownLeft.length < 1) {
                                //$cooldownLeft = $('<div>').addClass('cooldown-left');
                                $cooldownLeft = tpl.get('cooldown-left');
                                $slot.append($cooldownLeft);
                                $cooldownLeft.click(function() {
                                    message(_t('can_not_use_skill_now'))
                                });
                            }
                            $parent.addClass('cooldown-disabled');
                            $cooldownLeft.html(left);
                            Engine.battle.skillBattleMenu.updateCooldownMenuInMenuItem(a[0], left);
                        }
                    }
                    break;
                case 'doublecastcost':
                    var $positioner = $('.bottom.positioner');
                    var $doublecastcost = $positioner.find('.double-cast-cost').removeClass('double-cast-cost');
                    $doublecastcost.each(function() {
                        var oldVal = $(this).attr('old-val');
                        let $battleSkill = $(this).parent();
                        let skillId = $battleSkill.attr('battle-skill-id');
                        let battleSkillData = Engine.battle.getBattleSkill(skillId);
                        let type = Engine.battle.getBattleSkillType(battleSkillData.cost);
                        let tip = battleSkillData.name + ' <span class="' + type + '">(' + oldVal + ')</span>';

                        $(this).removeAttr('old-val');
                        $(this).html(oldVal.slice(0, -1));

                        battleSkillData.cost = oldVal;
                        SkillTip.changeCostInTip($battleSkill, battleSkillData.cost.slice(0, -1));
                    });
                    Engine.battle.skillBattleMenu.deleteAllDoubleCostFromMenu();
                    var a = this.doublecastcost;
                    if (a.length < 1) break;
                    var val = a[1];
                    let $battleSkill = $('.bottom.positioner').find('.icon-' + a[0]).parent();
                    if ($battleSkill.length === 0) break;
                    var $type = $battleSkill.find('.type');
                    var oldVal = $type.html();

                    $type.addClass('double-cast-cost').html(val.slice(0, -1));

                    let battleSkillData = Engine.battle.getBattleSkill(a[0]);
                    let type = Engine.battle.getBattleSkillType(val);

                    battleSkillData.cost = val;

                    $type.attr('old-val', (oldVal + type));
                    SkillTip.changeCostInTip($battleSkill, battleSkillData.cost.slice(0, -1));

                    Engine.battle.skillBattleMenu.addDoubleCastCostToMenuItem(a[0], a[1]);
                    break;
                case 'combo':
                    //console.log('set combo points', w[i]);
                    var combo = Engine.battle.getComboPoints();
                    Engine.battle.setComboPoints(this.combo);
                    //if (combo == this.combo) break;
                    //else Engine.battle.setComboPointsOnSkill();
                    if (combo != this.combo) Engine.battle.setComboPointsOnSkill();
                    break;
                case 'mana0':
                    if (this.manaBar && this.mana0 > 0) {
                        var nw = this.$.find(".mana-points").find(".inner");
                        var p = this.mana / this.mana0;
                        Engine.battle.warriors.setBar(nw, p * 100);
                    }
                    break;
                case 'energy0':
                    if (this.energyBar) {
                        var nw = this.$.find(".energy-points").find(".inner");
                        var p = this.energy / this.energy0;
                        Engine.battle.warriors.setBar(nw, p * 100);
                    }
                    break;
                case 'wt':
                    const warriorClass = Engine.battle.warriors.getMobClassByWType(this.wt);
                    this.$.addClass('wt-' + warriorClass);
                    break;
                case 'super_cast':
                    const sc = this.super_cast.turn / this.super_cast.total_turns * 100;

                    $superCast.addClass('active');
                    if (this.super_cast.turn === this.super_cast.total_turns) {
                        $superCast.addClass('completed');
                    }
                    this.removeSuperCastDividers();
                    const dividersEl = this.createSuperCasDividers(this.super_cast.total_turns);
                    $superCast.append(dividersEl);
                    const $progressBar = $superCast.find('.inner');

                    Engine.battle.warriors.setBar($progressBar, sc);
                    break;
            }
        }

        updateFocus(w);

        if (!this.isHero() && this.super_cast && !isset(w.super_cast) && !clientTriggeredUpdate) {
            this.super_cast = null;
            $superCast.addClass('finish').removeClass('completed')
            setTimeout(() => {
                $superCast.removeClass('finish active')
            }, 500)
        }

        if (this.isHero()) {
            var e = this.energy;
            var eMax = this.energy0;
            var m = this.mana;
            var mMax = this.mana0;
            Engine.interface.heroElements.setEnergy(e, eMax);
            Engine.interface.heroElements.setMana(m, mMax);
            Engine.battle.heroMana = m;
            Engine.battle.heroEnergy = e;
        }

        this.updateHpp();
        this.createWarriorTip();
        this.setFocusGlow();

        if (this.hpp == 0) {
            $('.buff', this.$).remove();
            if (Engine.battle.selectedWarriorID == this.id) {
                Engine.battle.selectedWarriorID = null;
                Engine.battle.skillBattleMenu.closeMenu();
            }
            Engine.battle.deleteWarrior(this.id);
            //var img = 'http://dev.margonem.pl/img/rip' + (this.id > 0 ? '1' : '2') + '.gif';
            this.loaded = true;
            //this.fw = 32;
            //this.fh = 32;
            this.$.find('.selector').css('display', 'none');
            this.$.css('display', 'block');
            this.$.addClass('die-warrior');
            this.createGrave();
            this.$.find('.canvas-warrior-icon').css('display', 'none');
            Engine.battle.warriors.setDieMob(this.id);

            let isPossible = Engine.rajBattleEvents.isPossibleCallBattleEventsFromExternalProperties(this);
            if (isPossible) {
                //Engine.rajBattleEvents.callAllActionsBySpecificEventAndWarrior(RajBattleEventsData.ON_DIE_NPC, this.getOriginalId());

                Engine.rajController.parseObject({
                    [RajData.CALLBACK_INTERNAL_FUNCTION]: true
                }, false, false, function() {
                    Engine.rajBattleEvents.callAllActionsBySpecificEventAndWarrior(RajBattleEventsData.ON_DIE_NPC, self.getOriginalId());
                });

            }
        }

        Engine.battle.warriors.updatePositions();
    };

    this.isHero = () => {
        return this.id === Engine.hero.d.id;
    }

    const updateFocus = (data) => {
        focus = isset(data.focusedBy) && data.focusedBy !== null ? data.focusedBy : null;
    }

    this.getFocusedBy = () => {
        return focus;
    }

    this.turnTranslation = (amount) => {
        let translation;
        if (amount === 1) {
            translation = _t('turn');
        } else if (amount > 1 && amount < 5) {
            translation = _t('turns');
        } else {
            translation = _t('turn5');
        }
        return `${amount} ${translation}`;
    }

    this.createSuperCasDividers = (amount) => {
        const wrapperEl = document.createElement("div");
        wrapperEl.classList.add('dividers');
        for (let i = 1; i < amount; i++) {
            const el = document.createElement("div");
            el.classList.add('divider')
            el.style.left = (i / amount * 100) + '%';
            wrapperEl.appendChild(el);
        }
        return wrapperEl;
    };

    this.removeSuperCastDividers = () => {
        const dividers = $superCast[0].querySelector('.dividers');
        if (dividers) dividers.parentNode.removeChild(dividers);
    }

    this.fillTipSuperCast = ($tip) => {
        if (isset(this.super_cast) && this.super_cast !== null) {
            const {
                name,
                total_turns,
                turn
            } = this.super_cast;
            const sc = !total_turns ? 100 : turn / total_turns * 100;
            const scPercent = parseInt(sc) + '%';
            const turnsRemaining = total_turns - turn;

            $tip.find('.sc-content').addClass('active');
            $tip.find('.sc-content__name').text(name);
            $tip.find('.sc-content__percent').text(scPercent);
            $tip.find('.sc-content__turns').text(this.turnTranslation(turnsRemaining));
        } else {
            $tip.find('.sc-content').removeClass('active');
        }
    };

    this.fillTipResistances = ($tip) => {
        let isExist = false;
        if (isset(this.ac)) {
            let bonus = this.ac.bonus === 0 ? '' : `(+${this.ac.bonus})`;
            $tip.find('.ac').text(`${this.ac.cur} ${bonus} `);
            $tip.find('.ac-content').addClass('active');
            if (isset(this.ac.destroyed)) {
                $tip.find('.ac-destroyed').addClass('active');
            }
        }
        if (isset(this.resfire)) {
            let bonus = this.resfire.bonus === 0 ? '' : `(+${this.resfire.bonus})`;
            $tip.find('.resfire').text(`${this.resfire.cur} ${bonus} `);
            isExist = true;
        }
        if (isset(this.resfrost)) {
            let bonus = this.resfrost.bonus === 0 ? '' : `(+${this.resfrost.bonus})`;
            $tip.find('.resfrost').text(`${this.resfrost.cur} ${bonus} `);
            isExist = true;
        }
        if (isset(this.reslight)) {
            let bonus = this.reslight.bonus === 0 ? '' : `(+${this.reslight.bonus})`;
            $tip.find('.reslight').text(`${this.reslight.cur} ${bonus} `);
        }
        if (isset(this.act)) {
            let bonus = this.act.bonus === 0 ? '' : `(+${this.act.bonus})`;
            $tip.find('.act').text(`${this.act.cur} ${bonus} `);
        }

        if (isExist) $tip.find('.resist-content').addClass('active');
    };

    this.fillTipEnergyAndMana = ($tip) => {
        let isExist = false;
        if (Engine.battle.myteam === this.team) {
            if (isset(this.energyBar) && this.energyBar) {
                isExist = true;
                $tip.find('.energy').text(_t('energy_amount %val%', {
                    '%val%': this.energy + '/' + this.energy0
                }, 'battle'));
            }
            if (isset(this.manaBar) && this.manaBar) {
                isExist = true;
                $tip.find('.mana').text(_t('mana_amount %val%', {
                    '%val%': this.mana + '/' + this.mana0
                }, 'battle'));
            }
        }
        if (isExist) $tip.find('.mana-energy-content').addClass('active');
    };

    this.createWarriorTip = () => {
        const $tip = tpl.get('one-warrior-tip').addClass('info-wrapper');

        let characterInfo = getCharacterInfo({
            showNick: true,
            nick: parseContentBB(this.name),
            level: this.lvl,
            operationLevel: this.oplvl,
            prof: this.prof,
            htmlElement: true
        });

        //$tip.find('.nick').html(`${parseContentBB(this.name)} (${this.lvl + this.prof})`);
        $tip.find('.nick').html(characterInfo);
        $tip.find('.hp').text(_t('life_percent %val%', {
            '%val%': self.hpp
        }, 'battle'));
        this.fillTipResistances($tip);
        this.fillTipEnergyAndMana($tip);
        this.fillTipSuperCast($tip);

        this.$.find('.canvas-warrior-icon, .grave-warrior-other, .grave-warrior-npc').tip($tip.prop('outerHTML'));
    };

    this.setFocusGlow = () => {
        if (focus) this.$.addClass('focus-active');
        else this.$.removeClass('focus-active');
    }

    this.createGrave = () => {
        //w.id > 0 ? '1' : '2'
        let $grave = this.id > 0 ? this.$.find('.grave-warrior-other') : this.$.find('.grave-warrior-npc');

        $grave.css('display', 'block');
    };

    this.showDamage = (old) => {
        var newHp = this.hpp;
        if (old == newHp) return;
        var $div = this.$.find('.warrior-dmg');
        var val = newHp - old;
        $div.removeClass('green red');
        $div.addClass(val > 0 ? 'green' : 'red');
        $div.html((val > 0 ? '+' : '-') + Math.abs(val) + '%');
        $div.css({
            'margin-left': -$div.width() / 2,
            'display': 'block'
        });
        self.manageDamageAnimation($div);
    };

    this.manageDamageAnimation = function($div) {
        //if (Engine.opt(8)) {
        if (!isSettingsOptionsInterfaceAnimationOn()) {
            let top = parseInt($div.css('top'));
            $div.css('top', (top - 30) + 'px');
            setTimeout(function() {
                $div.remove();
            }, 1000)
        } else {
            $div.animate({
                top: "-=30px"
            }, 500, function() {
                $(this).fadeOut(500, function() {
                    $(this).css('top', 0);
                });
            });
        }
    }

    this.updateHpp = function() {
        if (Engine.battle.selectedWarriorID == this.id) Engine.battle.updateHpProgressBar(this.hpp);

        var $heal = this.$.find('.health-points');
        var $progressBar = $heal.find('.inner');
        var value = this.hpp / 100;
        if (value == 0) {
            $heal.css('display', 'none');
            this.$.find(".energy-points").css('display', 'none');
            this.$.find(".mana-points").css('display', 'none');
            this.$.find('.warrior-background').css('display', 'none');
            return;
        }
        Engine.battle.warriors.setBar($progressBar, value * 100);
    };

    this.setStaticAnimation = function(state) {
        if (IE) this.staticAnimation = true;
        else this.staticAnimation = state;
    };

    this.goBackToSequence = () => {
        this.frame = 0;
        this.resetActionIndex();
        this.loopAction = false;
    };

    this.setIdle1Action = () => {
        if (!this.isSequenceWarrior()) return;
        this.resetActionIndex();
        this.frame = 0;
        this.loopAction = false;
    };

    this.setIdle2Action = () => {
        if (!this.isSequenceWarrior()) return;
        this.resetActionIndex();
        this.frame = 1;
        this.loopAction = false;
    };

    this.setIdle3Action = () => {
        if (!this.isSequenceWarrior()) return;
        this.resetActionIndex();
        this.frame = 2;
        this.loopAction = false;
    };

    this.setAttackAction = () => {
        if (!this.isSequenceWarrior()) return;
        this.resetActionIndex();
        this.frame = 3;
        this.loopAction = false;
    };

    this.setCastAction = () => {
        if (!this.isSequenceWarrior()) return;
        this.resetActionIndex();
        this.frame = 4;
        this.loopAction = true;
    };

    this.resetActionIndex = () => {
        if (!this.isSequenceWarrior()) return;
        this.sequenceIndex = 0;
        //this.activeFrame = 0;
        this.resetActiveFrame();
    };

    this.resetActiveFrame = () => {
        this.activeFrame = 0;
    }

    this.isSequenceWarrior = () => {
        return this.npc && this.sequence.length;
    }

    this.getNotDrawSkillsAnimation = getNotDrawSkillsAnimation;

};