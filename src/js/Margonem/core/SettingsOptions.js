module.exports = function() {

    const moduleData = {
        fileName: "SettingsOptions.js"
    };

    const init = () => {

    };

    const isMouseHeroWalkOn = () => {
        return checkOpt(7) ? false : true;
    };

    const isInterfaceAnimationOn = () => {
        return checkOpt(8) ? false : true;
    };

    const isCycleDayAndNightOn = () => {
        return checkOpt(11) ? false : true;
    };

    const isAutoGoThroughGatewayOn = () => {
        return checkOpt(12) ? false : true;
    };

    const isShowItemsRankOn = () => {
        return checkOpt(13) ? false : true;
    };

    const isWeatherAndEventEffectsOn = () => {
        return checkOpt(16) ? false : true;
    };

    const isBannersOn = () => {
        return checkOpt(17) ? false : true;
    };

    const isMapAnimationOn = () => {
        return checkOpt(19) ? true : false;
    };

    const isInformAboutFreePlaceInBagOn = () => {
        return checkOpt(21) ? false : true;
    };

    const isLoaderSplashOn = () => {
        return checkOpt(23) ? false : true;
    };

    const isWarShadowOn = () => {
        return checkOpt(24) ? false : true;
    };

    const isAutoCompareItemsOn = () => {
        return checkOpt(25) ? false : true;
    };

    const isBattleEffectsOn = () => {
        return checkOpt(26) ? false : true;
    };

    const isAutoCloseBattleOn = () => {
        return checkOpt(27) ? true : false;
    };

    const isExchangeSafeMode = () => {
        return checkOpt(30) ? true : false;
    }

    //const checkOpt = function (which, opt) {
    const checkOpt = function(which) {
        //if (opt) {
        //    return opt & (1 << which - 1);
        //}

        if (!Engine || !Engine.hero || !Engine.hero.d || !isset(Engine.hero.d.opt)) {
            //debugger;
            errorReport(moduleData.fileName, "checkOpt", "can not check opt!");
            console.trace()
            return;
        }

        return Engine.hero.d.opt & (1 << which - 1);

    };

    const heroOptExist = () => {
        return isset(Engine.hero) && isset(Engine.hero.d) && isset(Engine.hero.d.opt);
    }


    this.init = init;
    this.isAutoCompareItemsOn = isAutoCompareItemsOn;
    this.isInterfaceAnimationOn = isInterfaceAnimationOn;
    this.isWeatherAndEventEffectsOn = isWeatherAndEventEffectsOn;
    this.isInformAboutFreePlaceInBagOn = isInformAboutFreePlaceInBagOn;
    this.isMapAnimationOn = isMapAnimationOn;
    this.isWarShadowOn = isWarShadowOn;
    this.isBannersOn = isBannersOn;
    this.isAutoCloseBattleOn = isAutoCloseBattleOn;
    this.isBattleEffectsOn = isBattleEffectsOn;
    this.isAutoGoThroughGatewayOn = isAutoGoThroughGatewayOn;
    this.isMouseHeroWalkOn = isMouseHeroWalkOn;
    this.isShowItemsRankOn = isShowItemsRankOn;
    this.isLoaderSplashOn = isLoaderSplashOn;
    this.isCycleDayAndNightOn = isCycleDayAndNightOn;
    this.heroOptExist = heroOptExist;
    this.isExchangeSafeMode = isExchangeSafeMode;

}