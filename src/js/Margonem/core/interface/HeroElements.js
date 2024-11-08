module.exports = function() {
    var bloodFrame = 0;
    var $hpIndicator;
    var $xp;
    var $battleBars;
    var $expBars;
    var $extendedStats;
    var $lagemetr;
    let lagInterval;

    const LAG_METER_TIP_CLASS = "lag-meter-tip";

    this.init = function() {
        $hpIndicator = Engine.interface.get$interfaceLayer().find('.hp-indicator');
        $xp = Engine.interface.get$interfaceLayer().find('.exp-progress .progress .inner');
        $battleBars = Engine.interface.get$interfaceLayer().find('.battle-bars-wrapper');
        $expBars = Engine.interface.get$interfaceLayer().find('.exp-bar-wrapper');
        $extendedStats = Engine.interface.get$interfaceLayer().find('.extended-stats');
        $lagemetr = Engine.interface.get$interfaceLayer().find('.lag', '.lagmeter')

        //this.initTipLag();
        setTipLag(0);
        Engine.interface.get$interfaceLayer().find('.stats-section.legends h3').tip(_t('leg_bon_info_tip'));
    };

    this.setHp = function(hp, maxhp) {

        var percent = (hp / maxhp) * 100;
        $('.hpp .value', $hpIndicator).text(Math.round(percent) + '%');
        setPercentProgressBar($('.blood', $hpIndicator), percent);
        //$('.blood', $hpIndicator).stop(true).animate({
        //	height:percent + '%'
        //});
        //var $bloodFrame = $('.hp-indicator .blood-frame');
        var $bloodFrame = $hpIndicator.find('.blood-frame');
        var backgroundX;

        $bloodFrame.css('display', percent > 30 ? 'none' : 'block');

        if (percent > 30) backgroundX = 0;
        else if (percent > 25) backgroundX = -103;
        else if (percent > 20) backgroundX = -103;
        else if (percent > 15) backgroundX = -206;
        else if (percent > 10) backgroundX = -309;
        else if (percent > 5) backgroundX = -412;
        else backgroundX = -515;

        $bloodFrame.css('background-position-x', backgroundX + 'px');

        var tip = '<strong>' + _t('life_points', null, 'player') + ':</strong><br>' + round(hp, 10) + ' / ' + round(maxhp, 10);
        $('.bottom-panel .glass').tip(tip, 't_static');
    };

    this.checkAndSetEndGamePanel = function(lvl = Engine.hero.d.lvl) {
        if (/aldous|tempest/.test(location.hostname)) {
            if (lvl <= 299) return;
        } else {
            if (lvl <= 499) return;
        }
        var $bP = Engine.interface.get$interfaceLayer().find('.bottom-panel');
        $bP.addClass('end-game');
        $bP.find('.exp-progress.left>.overlay').addClass('end-game-overlay');
        $bP.find('.exp-progress.right>.overlay').addClass('end-game-overlay');
        $bP.find('.ribbon').addClass('end-game-ribbon');
        $bP.find('.glass').addClass('end-game-glass');
    };

    var bloodAnimation = setInterval(function() {
        //if (Engine && Engine.opt(8)) return;

        if (!getEngine().interface.getInterfaceStart()) {
            return;
        }

        if (!isSettingsOptionsInterfaceAnimationOn()) {
            return;
        }
        $('.blood', $hpIndicator).css({
            backgroundPosition: -((bloodFrame++) * 103) + 'px -9px'
        });
        if (bloodFrame == 4) bloodFrame = 0;
    }, 1000);

    this.setXp = function(v, exp, next, prev, lvl) {
        var v1 = Math.min(1, v / 0.5);
        var v2 = Math.max((v - 0.5) / 0.5, 0);
        var tip = '';
        //$($xp[0]).css('width', (100 * v1) + '%');
        //$($xp[1]).css('width', (100 * v2) + '%');

        //$($xp[0]).css('width', (100 * v1) + '%');
        //$($xp[1]).css('width', (100 * v2) + '%');

        setPercentProgressBar($($xp[0]), 100 * v1);
        setPercentProgressBar($($xp[1]), 100 * v2);

        if (lvl < 500) {
            tip = '<strong>' + _t('experience', null, 'player') + ':</strong><br>' +
                round(exp, (Math.ceil(exp.toString().length / 3) < 2 ? 2 : Math.ceil(exp.toString().length / 3))) +
                ' / ' +
                round(next, (Math.ceil(next.toString().length / 3) < 2 ? 2 : Math.ceil(next.toString().length / 3))) +
                '<br>' + _t('to %lvl% %exp%', {
                    '%lvl%': (lvl + 1),
                    '%exp%': round(next - exp, 10)
                }, 'player');
        }
        Engine.interface.get$interfaceLayer().find('.exp-progress').tip(tip, 't_static')
    };

    this.setEnergy = function(energy, energyMax) {
        var newEnergy = energy ? energy : 0;
        var energyMax = energyMax ? energyMax : 0;
        //var value = newEnergy / (newHEnergy == 0 ? 0.1 : newHEnergy);

        var value = energyMax == 0 ? 0 : newEnergy / energyMax * 100;

        $('.energy > .values', $battleBars).html(newEnergy);

        setPercentProgressBar($('.energy .inner', $battleBars), value);
    };

    this.setMana = function(mana, manaMax) {
        var newMana = mana ? mana : 0;
        var manaMax = manaMax ? manaMax : 0;
        //var value = newMana / (newHMana == 0 ? 0.1 : newHMana);

        var value = manaMax == 0 ? 0 : newMana / manaMax * 100;

        $('.mana > .values', $battleBars).html(newMana);

        setPercentProgressBar($('.mana .inner', $battleBars), value);
    };

    this.showElements = function(name) {
        switch (name) {
            case 'battle':
                $battleBars.show();
                $expBars.hide();
                break;
            case 'game':
                $battleBars.hide();
                $expBars.show();
                break;
        }
    };

    const setTipLag = function(lagVal) {
        let str = `<span class="${LAG_METER_TIP_CLASS}">${lagVal}ms</span>`;

        $lagemetr.tip(str, 't_static');
    };

    const updateLagClassAndTip = (lag) => {
        let lag2 = Math.min(Math.floor(lag / 50), 5);

        if (Engine.lag != lag2) {
            $lagemetr.attr('class', 'lag lag-' + lag2)
        }

        if (window.TIPS.checkTipExist() && window.TIPS.checkTipHasClass(`${LAG_METER_TIP_CLASS}`)) {
            setTipLag(lag);
        }

        Engine.lag = lag2;
    };

    const update = () => {
        let lag = ts() - Engine.getAts();
        updateLagClassAndTip(lag);
    }

    this.startLag = function() {
        if (lagInterval) {
            clearInterval(lagInterval);
        }

        Engine.setAts(ts());

        lagInterval = setInterval(function() {
            update();
        }, 50)
    };

    this.endLag = function() {
        if (lagInterval) {
            clearInterval(lagInterval);
        }

        update()
    };
};