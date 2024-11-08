/**
 * Created by Michnik on 2016-01-04.
 */

var OneWarrior = require('core/battle/OneWarrior');
var tpl = require('core/Templates');

module.exports = function() {

    var _self = this;
    var lines = [];
    var startSideLines = [];
    var dieMob = false;
    var canvasWarriors = {};

    this.addCanvasWarrior = (id, o) => {
        canvasWarriors[id] = o;
    };

    this.deleteCanvasWarrior = (id) => {
        delete canvasWarriors[id];
    };

    this.clearCanvasWarriors = () => {
        for (let k in canvasWarriors) {
            this.deleteCanvasWarrior(k);
        }
    };

    this.updateAllWarriors = (dt) => {
        for (let k in canvasWarriors) {
            canvasWarriors[k].update(dt);
        }
    };

    this.drawAllWarriors = () => {
        for (let k in canvasWarriors) {
            canvasWarriors[k].draw();
        }
    };

    this.init = function() {
        _self.resetLines();
    };

    this.checkAllWarriorsProperWarriorImageLoaded = () => {
        for (var y = 0; y < lines.length; y++) {
            let row = lines[y];

            for (let x = 0; x < row.length; x++) {
                if (!row[x].getProperWarriorImageLoaded()) return false;
            }
        }

        return true;
    };

    this.allWarriorsLoadedCallback = () => {
        if (!this.checkAllWarriorsProperWarriorImageLoaded()) return;

        let engine = getEngine();

        let allProperWarriorImageLoaded = engine.battle.getAllProperWarriorImageLoaded();

        if (!allProperWarriorImageLoaded && engine.battle.getShow()) {
            console.log('allWarriorsLoadedCallback')
            engine.battle.battleNight.rebuildBattleNight();
        }

    };

    this.resetLines = function() {
        //console.log('reset lines');
        while (lines.length) lines.pop();
        lines = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
        _self.resetStartSideLines();
        //startSideLines = [
        //	{firstLeft:null,firstRight:null},
        //	{firstLeft:null,firstRight:null},
        //	{firstLeft:null,firstRight:null},
        //	{firstLeft:null,firstRight:null},
        //	{firstLeft:null,firstRight:null},
        //	{firstLeft:null,firstRight:null}
        //];
    };

    this.resetStartSideLines = function() {
        startSideLines = [{
                firstLeft: null,
                firstRight: null
            },
            {
                firstLeft: null,
                firstRight: null
            },
            {
                firstLeft: null,
                firstRight: null
            },
            {
                firstLeft: null,
                firstRight: null
            },
            {
                firstLeft: null,
                firstRight: null
            },
            {
                firstLeft: null,
                firstRight: null
            }
        ];
    };

    this.getLines = function() {
        return lines;
    };

    this.getStartSideLines = function() {
        return startSideLines;
    };

    //var separatorWidth = [80, 65, 50, 35, 20, 5];
    var separatorWidth = [75, 60, 45, 30, 15, 0];
    //var separatorWidth = [65, 50, 35, 20, 5, -10];
    //var separatorWidth = [130, 105, 80, 55, 30, 5];
    //var separatorWidth = [165, 125, 95, 65, 35, 5];
    //var separatorWidth = [205, 165, 125, 85, 45, 5];

    this.getSeparatoprWidth = () => {
        return separatorWidth;
    }

    this.updatePositions2 = function() {
        var loaded = 0;

        for (var i in Engine.battle.warriorsList) {
            if (Engine.battle.warriorsList[i].loaded) loaded++;
        }
        for (var y = 0; y < lines.length; y++) {
            var rowWidth = 0;
            for (var x = 0; x < lines[y].length; x++) {
                rowWidth += (lines[y][x].loaded ? (lines[y][x].fw + separatorWidth[y]) : 0);
            }
            //var rowStart = 256 - rowWidth / 2;
            var rowStart = 256
            var rowX = 0;
            for (var x = 0; x < lines[y].length; x++) {
                if (!lines[y][x].loaded) continue;
                //var yPos = 384 - ((y - 3) * 40);
                var yPos = Engine.battle.getYPosByLine(y);
                var xPos = rowStart + rowX + (lines[y][x].loaded ? lines[y][x].fw / 2 : 0) + (y % 2 == 0 ? -16 : +16);
                rowX += (lines[y][x].loaded ? (lines[y][x].fw + separatorWidth[y]) : 0);

                let top = yPos - (lines[y][x].loaded ? lines[y][x].fh : 0);

                var pos = {
                    top: top,
                    left: xPos
                };

                if (lines[y][x].xPos >= 0 && loaded == Engine.battle.w_amount) lines[y][x].$.stop(true).animate(pos);
                else lines[y][x].$.stop(true).css(pos);

                //needed to calculate index in new line when warrior's y change
                lines[y][x].xPos = xPos;
                lines[y][x].yPos = yPos;
            }
        }
    };


    const updateWidthAndSeparatorWidthInAllWarriors = (minMobWidth, maxMobWidth, separatorWidth) => {
        for (let y = 0; y < lines.length; y++) {
            for (let x = 0; x < lines[y].length; x++) {
                if (!lines[y][x].loaded) continue;

                manageWidthInGrid(x, y, minMobWidth, maxMobWidth, separatorWidth);
            }
        }
    };

    const updateNormalXYInRowsInAllWarriors = () => {
        for (let y = 0; y < lines.length; y++) {
            for (let x = 0; x < lines[y].length; x++) {
                if (!lines[y][x].loaded) continue;

                lines[y][x].xPos = getXPos(x, y);
                lines[y][x].yPos = Engine.battle.getYPosByLine(y);
            }
        }
    };

    const updateXYToAveragePosInAllWarriors = () => {
        let getBattleAreaWidth = getEngine().battle.getBattleArea().width();
        let halfWidthOfBattleArea = getBattleAreaWidth / 2;

        if (halfWidthOfBattleArea == 0) halfWidthOfBattleArea = 256;

        for (let y = 0; y < lines.length; y++) {

            if (!lines[y].length) continue;

            let currentLineStartX = getPosWarriorInMiddleOfLine(y);
            let toAdd = halfWidthOfBattleArea - currentLineStartX;

            for (let x = 0; x < lines[y].length; x++) {
                if (!lines[y][x].loaded) continue;
                lines[y][x].xPos += toAdd;
            }

        }
    };

    const updateXYToPosToDoCheckerInAllWarriors = (minMobWidth) => {
        for (let y = 0; y < lines.length; y++) {
            for (let x = 0; x < lines[y].length; x++) {
                if (!lines[y][x].loaded) continue;

                let evenY = y % 2 == 0;

                if (evenY) lines[y][x].xPos += minMobWidth;
            }
        }
    };

    const updateXYPosWarriorsInLines = () => {
        let oneW = Engine.battle.$.width() / 15;
        let scale = oneW > 80 ? 1 : oneW / 80;

        scale = Math.max(0.45, scale);

        let minMobWidth = 50 * scale;
        let maxMobWidth = 100 * scale;
        let separatorWidth = CFG.tileSize * 2 * scale;

        updateWidthAndSeparatorWidthInAllWarriors(minMobWidth, maxMobWidth, separatorWidth);
        updateNormalXYInRowsInAllWarriors();
        updateXYToAveragePosInAllWarriors();
        updateXYToPosToDoCheckerInAllWarriors(minMobWidth);
    };

    const getPosWarriorInMiddleOfLine = (y) => {
        let length = lines[y].length;
        let maxX = length - 1;

        if (maxX % 2 == 0) startX = maxX / 2;
        else startX = Math.floor(maxX / 2);

        return getXPos(startX, y);
    };

    this.updatePositions = function() {
        if (Engine.zoomMode) {
            updatePositions2();
            return
        }

        updateXYPosWarriorsInLines();
        updateCssPos();
    }

    const updateCssPos = () => {
        let loaded = 0;

        for (let i in Engine.battle.warriorsList) {
            if (Engine.battle.warriorsList[i].loaded) loaded++;
        }

        for (let y = 0; y < lines.length; y++) {
            for (let x = 0; x < lines[y].length; x++) {

                let warriorFromLine = lines[y][x];
                if (!warriorFromLine.loaded) continue;

                let xPos = warriorFromLine.xPos;
                let yPos = warriorFromLine.yPos;

                let top = yPos - (lines[y][x].loaded ? lines[y][x].fh : 0);

                let pos = {
                    top: top,
                    left: xPos
                };

                if (lines[y][x].xPos >= 0 && loaded == Engine.battle.w_amount) lines[y][x].$.stop(true).animate(pos);
                else lines[y][x].$.stop(true).css(pos);



            }
        }
    };

    const manageWidthInGrid = (x, y, minMobWidth, maxMobWidth, separatorWidth) => {

        let currentWarrior = lines[y][x];
        let currentWarriorFw = currentWarrior.fw;

        if (!currentWarrior.loaded) {
            lines[y][x].widthWarriorInGrid = minMobWidth;
            lines[y][x].widthSeparatorInGrid = separatorWidth;
            return;
        }

        let withToWarrior;


        if (currentWarriorFw > minMobWidth) {

            if (currentWarriorFw > maxMobWidth) withToWarrior = currentWarriorFw;
            else withToWarrior = minMobWidth

        } else {
            withToWarrior = minMobWidth
        }

        lines[y][x].widthWarriorInGrid = withToWarrior;
        lines[y][x].widthSeparatorInGrid = separatorWidth;
    };

    const getXPos = (findX, y) => {

        let sumWidth = 0;

        for (let currentX = 0; currentX < findX; currentX++) {

            let currentWarrior = lines[y][currentX];
            //let currentWarriorFw = currentWarrior.fw;
            let currentWidthWarriorInGrid = currentWarrior.widthWarriorInGrid;
            let currentWidthSeparatorInGrid = currentWarrior.widthSeparatorInGrid;

            sumWidth += currentWidthWarriorInGrid / 2;
            sumWidth += currentWidthSeparatorInGrid;
        }


        return sumWidth;
    };

    this.update = function(w, isAuto) {
        var isExist = true;
        if (!isset(Engine.battle.warriorsList[(w.id).toString()])) {
            let oneWarrior = new OneWarrior();
            oneWarrior.init(w, isAuto);
            //_self.new(w, isAuto);
            Engine.battle.warriorsList[w.id] = oneWarrior;
            isExist = false;
        }
        var warrior = Engine.battle.warriorsList[w.id];

        warrior.updateWarrior(w);

        _self.updatePositions();

        if (Engine.battle.scaleBattle) Engine.battle.scaleBattle.manageBattleAreaPosition();

        //if (isExist) API.callEvent('updateWarrior', warrior);
        //else API.callEvent('newWarrior', warrior);

        if (isExist) API.callEvent(Engine.apiData.UPDATE_WARRIOR, warrior);
        else API.callEvent(Engine.apiData.NEW_WARRIOR, warrior);
    }
    /*
    	this.updateOld = function (w, isAuto) {
    		var isExist = true;
    		if (!isset(Engine.battle.warriorsList[(w.id).toString()])){
    			let oneWarrior = new Warrior();
    			oneWarrior.init(w, isAuto);
    			//_self.new(w, isAuto);
    			Engine.battle.warriorsList[w.id] = oneWarrior;
    			isExist = false;
    		}

    		var warrior = Engine.battle.warriorsList[w.id];
    		for (var i in w) {
    			var old = warrior[i];
    			warrior[i] = w[i];
    			switch (i) {
    				case 'name':
    					warrior.$.find('.warrior-name').text(warrior.name);
    					break;
    				case 'icon':
    					warrior.updateIcon(warrior);

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

    					break;
    				case 'y':
    					if (Engine.battle.myteam != 1) warrior.y = 5 - warrior.y;
    					if (isset(old)) {
    						var index = lines[old].indexOf(warrior);
    						lines[old].splice(index, 1);
    					}
    					lines[warrior.y].push(warrior);
    					lines[warrior.y].sort(function (w1, w2) {
    						return w1.xPos - w2.xPos;
    					});
    					warrior.$.css('zIndex', 5 - warrior.y);
    					break;
    				case 'hpp':
    					if (isset(old)) this.showDamage(old, warrior);
    					break;
    				case 'buffs':
    					//if (old) {
    						var $wrapper = warrior.$.find('.warrior-buffs-wrapper');
    						$wrapper.css('margin-left', -(28 - warrior.fw / 2));
    						Engine.battle.updateWarriorBuffs($wrapper, warrior.hpp, warrior.buffs);
    					//}
    					break;
    				case 'cooldowns':
    					var cooldowns = warrior.cooldowns;

    					if (cooldowns.length == 0) {
    						$('.bottom.positioner').find('.cooldown-left').remove();
    						Engine.battle.skillBattleMenu.removeAllCooldown();
    					}

    					for (var c = 0 ; c < cooldowns.length; c++) {
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
    								$cooldownLeft.click(function () {
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
    					$doublecastcost.each(function () {
    						var oldVal = $(this).attr('old-val');
    						$(this).removeAttr('old-val');
    						$(this).html(oldVal);
    					});
    					Engine.battle.skillBattleMenu.deleteAllDoubleCostFromMenu();
    					var a = warrior.doublecastcost;
    					if (a.length < 1) break;
    					var val = a[1].slice(0, -1);
    					var $type = $('.bottom.positioner').find('.icon-' + a[0]).parent().find('.type');
    					var oldVal = $type.html();
    					$type.addClass('double-cast-cost').html(val);
    					$type.attr('old-val', oldVal);
    					Engine.battle.skillBattleMenu.addDoubleCastCostToMenuItem(a[0], a[1]);
    					break;
    				case 'combo':
    					var combo = Engine.battle.getComboPoints();
    					Engine.battle.setComboPoints(warrior.combo);
    					if (combo == null) break;
    					else Engine.battle.setComboPointsOnSkill();

    					break;
    				case 'mana0':
    					if (warrior.manaBar && warrior.mana0 > 0) {
    						var nw = warrior.$.find(".mana-points").find(".inner");
    						var p = warrior.mana / warrior.mana0;
    						_self.setBar(nw, p * 100);
    					}
    					break;
    				case 'energy0':
    					if(warrior.energyBar) {
    						var nw = warrior.$.find(".energy-points").find(".inner");
    						var p = warrior.energy / warrior.energy0;
    						_self.setBar(nw, p * 100);
    					}
    					break;
    				case 'wt':
    					const warriorClass = this.getMobClassByWType(warrior.wt);
    					warrior.$.addClass('wt-'+warriorClass);
    			}
    		}

    		if (warrior.id == Engine.hero.d.id) {
    			var e = warrior.energy;
    			var eMax = warrior.energy0;
    			var m = warrior.mana;
    			var mMax = warrior.mana0;
    			Engine.interface.heroElements.setEnergy(e, eMax);
    			Engine.interface.heroElements.setMana(m, mMax);
    			Engine.battle.heroMana = m;
    			Engine.battle.heroEnergy = e;
    		}

    		_self.updateHpp(warrior);
    		var profClass = "profs-icon " + warrior.prof;
    		var manaEnergyTip = '';
    		if (Engine.battle.myteam === warrior.team) {
    			if (isset(warrior.energyBar) && warrior.energyBar)
    				manaEnergyTip += '<div class="energy">'+ _t('energy_amount %val%', {'%val%': warrior.energy+'/'+warrior.energy0}, 'battle') + '</div>';
    			if (isset(warrior.manaBar) && warrior.manaBar)
    				manaEnergyTip += '<div class="mana">'+ _t('mana_amount %val%', {'%val%': warrior.mana+'/'+warrior.mana0}, 'battle') + '</div>';
    		}

    		var tip = '<div class="info-wrapper">' +
    			'<div class="nick">' +warrior.name + '</div>' +
    			'<div class="' + profClass + '"></div>' +
    			'<div class="lvl">' + warrior.lvl + ' lvl</div><br/>' +
    			'<div class="hp">'+ _t('life_percent %val%', {'%val%': warrior.hpp}, 'battle') + '</div>' +
    				manaEnergyTip +
    			'</div>';

    		//var tip =
    		//	'<div class="nick">' +warrior.name + '</div>' +
    		//	'<div class="' + profClass + '"></div>' +
    		//	'<div class="lvl">' + warrior.lvl + ' lvl</div>';

    		//if (warrior.id != Engine.hero.d.id && warrior.team == 1) {
    		//	tip += '<div class="warrior-energy">' + warrior.energy + '</div>' +
    		//		'<div class="warrior-mana">' + warrior.mana + '</div>';
    		//}
    		warrior.$.tip(tip);

    		if (warrior.hpp == 0) {
    			$('.buff', warrior.$).remove();
    			if (Engine.battle.selectedWarriorID == warrior.id) {
    				Engine.battle.selectedWarriorID = null;
    				Engine.battle.skillBattleMenu.closeMenu();
    			}
    			Engine.battle.deleteWarrior(warrior.id);
    			var img = 'http://dev.margonem.pl/img/rip' + (warrior.id > 0 ? '1' : '2') + '.gif';
    			warrior.loaded = true;
    			warrior.fw = 32;
    			warrior.fh = 32;
    			// warrior.$.find('.css-warrior, .canvas-warrior').css({
    			// 	'background-image': 'url(' + img + ')',
    			// 	width: '32px',
    			// 	height: '32px',
    			// 	backgroundPosition: '0px 0px'
    			// });
    			warrior.$.find('.selector').css('display', 'none');
    			warrior.$.addClass('die-warrior');
    			//_self.
    			_self.createGrave(warrior);
    			// warrior.$.find('.css-warrior, .canvas-warrior').addClass('do-action-cursor'); //.removeClass('attack-cursor').addClass('do-action-cursor');
    			// warrior.$.find('.css-warrior, .canvas-warrior').css('display', 'block');
    			warrior.$.find('.canvas-warrior-icon').css('display', 'none');
    			//Engine.battle.clearMarkWarior();
    			//Engine.battle.setFirstMarkObj();
    			dieMob = true;
    		}

    		_self.updatePositions();
    		if (isExist) API.callEvent('updateWarrior', warrior);
    		else API.callEvent('newWarrior', warrior);
    	};
    */

    this.getMobClassByWType = (wt) => {
        let warriorClass;
        if (wt >= 80 && wt <= 89) { // heroes
            warriorClass = "heroes";
        } else if (wt >= 100) { //titan
            warriorClass = "titan";
        } else if (wt >= 90) { //colossus
            warriorClass = "colossus";
        } else if (wt >= 10 && wt < 20) { //elite1
            warriorClass = "elite";
        } else if (wt >= 20 && wt < 30) { //elite2
            warriorClass = "elite2";
        } else if (wt >= 30 && wt < 40) { //elite3
            warriorClass = "elite3";
        } else {
            warriorClass = "normal"
        }
        return warriorClass;
    };

    this.setBar = function(nw, p) {
        //nw.width(p * 56);
        setPercentProgressBar(nw, p);
    };

    this.getDieMob = function() {
        return dieMob;
    };

    this.setDieMob = function(state) {
        dieMob = state;
    };

    this.setWarriorsAnimationState = (state) => {
        for (let k in canvasWarriors) {
            canvasWarriors[k].setStaticAnimation(state);
        }
    }

    this.rebuildAnimateWarrior = () => {
        let state = isSettingsOptionsInterfaceAnimationOn();

        for (let y = 0; y < lines.length; y++) {
            for (let x = 0; x < lines[y].length; x++) {
                let oneWarrior = lines[y][x];

                if (state) oneWarrior.addAnimateWarrior();
                else oneWarrior.removeAnimateWarrior();
            }
        }

    };

    this.resetActiveFrame = () => {
        for (let k in canvasWarriors) {
            canvasWarriors[k].resetActiveFrame();
        }
    }

    this.resetWarriorsActionAnimation = () => {
        for (let k in canvasWarriors) {
            canvasWarriors[k].goBackToSequence();
        }
    }

};