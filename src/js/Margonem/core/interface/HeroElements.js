module.exports = function() {
    var bloodFrame = 0;
    var $hpIndicator;
    var $hpLightMode;
    var $hpTopLightMode;
    var $expTopLightMode;
    var $xp;
    var $expLightMode;
    var $battleBars;
    var $expBars;
    var $extendedStats;
    var $lagemetr;
    var $lagemetrLightMode;
    var $lagemetrValLightMode;
    let lagInterval;

    const LAG_METER_TIP_CLASS = "lag-meter-tip";

    this.init = function() {

        let $interfaceLayer = Engine.interface.get$interfaceLayer();

        $hpIndicator = $interfaceLayer.find('.hp-indicator');
        $hpLightMode = $interfaceLayer.find('.progress-bars-light-mode').find('.hero-hp-progress-bar');
        $hpTopLightMode = $interfaceLayer.find('.hero-hp-top-progress-bar-light-mode');
        $xp = $interfaceLayer.find('.exp-progress .progress .inner');
        $expLightMode = $interfaceLayer.find('.progress-bars-light-mode').find('.hero-exp-progress-bar');
        $expTopLightMode = $interfaceLayer.find('.hero-exp-top-progress-bar-light-mode');
        $battleBars = $interfaceLayer.find('.battle-bars-wrapper');
        $expBars = $interfaceLayer.find('.exp-bar-wrapper');
        $extendedStats = $interfaceLayer.find('.extended-stats');
        $lagemetr = $interfaceLayer.find('.lagmeter').find('.lag');
        $lagemetrLightMode = $interfaceLayer.find('.lagmeter-light-mode').find('.lag');
        $lagemetrValLightMode = $interfaceLayer.find('.lagmeter-light-mode').find('.lag-val');

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


        setPercentProgressBar($hpLightMode.find('.inner'), Math.round(percent));
        $hpLightMode.find('.value').html(Math.round(percent) + '%').tip(tip);

        setPercentProgressBar($hpTopLightMode.find('.inner'), Math.round(percent));
        $hpTopLightMode.find('.value').html(Math.round(percent) + '%').tip(tip);
    };

    this.checkAndSetEndGamePanel = function(lvl = getHeroLevel()) {
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
        $bP.find('.ribbon-up').addClass('end-game-ribbon');
        $bP.find('.ribbon-down').addClass('end-game-ribbon');
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

        let str = (Math.round(v * 10000) / 100) + '%';

        setPercentProgressBar($expLightMode.find('.inner'), Math.round(v * 100));
        $expLightMode.find('.value').html(str);

        setPercentProgressBar($expTopLightMode.find('.inner'), Math.round(v * 100));
        $expTopLightMode.find('.value').html(str);

        //if (lvl < 500) {
        if (!heroHasEndGameLevel()) {
            tip = '<strong>' + _t('experience', null, 'player') + ':</strong><br>' +
                round(exp, (Math.ceil(exp.toString().length / 3) < 2 ? 2 : Math.ceil(exp.toString().length / 3))) +
                ' / ' +
                round(next, (Math.ceil(next.toString().length / 3) < 2 ? 2 : Math.ceil(next.toString().length / 3))) +
                '<br>' + _t('to %lvl% %exp%', {
                    '%lvl%': (lvl + 1),
                    '%exp%': round(next - exp, 10)
                }, 'player');
        }
        Engine.interface.get$interfaceLayer().find('.exp-progress').tip(tip, 't_static');
        $expLightMode.tip(tip);
        $expTopLightMode.tip(tip);
    };

    this.setEnergy = function(energy, energyMax) {
        var newEnergy = energy ? energy : 0;
        var energyMax = energyMax ? energyMax : 0;
        //var value = newEnergy / (newHEnergy == 0 ? 0.1 : newHEnergy);

        var value = energyMax == 0 ? 0 : newEnergy / energyMax * 100;

        $('.energy > .values', $battleBars).html(newEnergy);

        //let energyLightMode = $battleBars.find('.energy-battle-bar-light-mode');
        let $energyLightMode = getEngine().battle.getEnergyBarLightMode();

        $energyLightMode.find('.value').html(newEnergy + "/" + energyMax)

        setPercentProgressBar($('.energy .inner', $battleBars), value);
        setPercentProgressBar($energyLightMode.find('.inner'), value);
    };

    this.setMana = function(mana, manaMax) {
        var newMana = mana ? mana : 0;
        var manaMax = manaMax ? manaMax : 0;
        //var value = newMana / (newHMana == 0 ? 0.1 : newHMana);

        var value = manaMax == 0 ? 0 : newMana / manaMax * 100;

        $('.mana > .values', $battleBars).html(newMana);

        //let manaLightMode = $battleBars.find('.mana-battle-bar-light-mode')
        let $manaLightMode = getEngine().battle.getManaBarLightMode();
        $manaLightMode.find('.value').html(newMana + "/" + manaMax)

        setPercentProgressBar($('.mana .inner', $battleBars), value);
        setPercentProgressBar($manaLightMode.find('.inner'), value);
    };

    this.showElements = function(name) {
        switch (name) {
            case 'battle':
                $battleBars.show();
                if (!heroHasEndGameLevel()) {
                    $expBars.hide();
                }
                break;
            case 'game':
                $battleBars.hide();
                $expBars.show();
                break;
        }
    };

    const heroHasEndGameLevel = () => {
        return getHeroLevel() == 500;
    }

    const setTipLag = function(lagVal) {
        let str = `<span class="${LAG_METER_TIP_CLASS}">${lagVal}ms</span>`;

        $lagemetr.tip(str, 't_static');
    };

    const updateLagClassAndTip = (lag) => {
        let lag2 = Math.min(Math.floor(lag / 50), 5);

        if (Engine.lag != lag2) {
            $lagemetr.attr('class', 'lag lag-' + lag2)
            $lagemetrLightMode.attr('class', 'lag lag-' + lag2)
        }

        let val = $lagemetrValLightMode.html();
        let lagVal = (Math.round(lag / 10) * 10) + 'ms';

        if (val != lagVal) {
            $lagemetrValLightMode.html(lagVal);
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

    const get$expLightMode = () => {
        return $expLightMode
    }

    const get$expTopLightMode = () => {
        return $expTopLightMode
    }

    this.get$expLightMode = get$expLightMode;
    this.get$expTopLightMode = get$expTopLightMode;
};