module.exports = function() {

    const diff = 14;
    const min = 1;
    const preMax = 300;
    const max = 500;

    let running = false;
    let $style = null;
    //let multiplier 	= null;

    const countLowerLimit = (lvl) => Math.round((Math.min(preMax, lvl) - 4) / getMultiplier());
    const countUpperLimit = (lvl) => Math.round(lvl * getMultiplier()) + 4;

    const getMultiplier = () => {
        return Engine.worldConfig.getPrivWorld() || Engine.worldConfig.getRpg() ? 1.4 : 1.2;
    };

    function loot(lvl) {
        let low = countLowerLimit(lvl);
        let high = countUpperLimit(lvl);
        if (Engine.worldConfig.getPrivWorld()) {
            let countedLvl = countUpperLimit(low);
            if (Math.min(preMax, lvl) - countedLvl === 1) low++;
        }
        low = Math.min(low, lvl - diff);
        high = Math.max(high, lvl + diff)

        return adjustLimits(low, high);
    }

    function adjustLimits(low, high) {
        low = Math.min(low, preMax);
        high = high >= preMax ? max : high;
        return [Math.max(low, min), Math.min(high, max)];
    }

    function rangeText(a, b) {
        return a + ' - ' + b;
    }

    function getText(v) {
        return _t(v, null, "info_tooltip");
    }

    function restoreTip(character) {
        if (Engine.hero === character) {
            character.updateTip();

            let miniMapHeroController = Engine.miniMapController.handHeldMiniMapController.getMiniMapHeroController();
            let heroObject = miniMapHeroController.getObject();

            miniMapHeroController.createTipToHero(heroObject);

        } else {
            character.tipUpdate();

            let charId = character.getId();
            let whoIsHere = Engine.whoIsHere;
            let whoIsHereOther = whoIsHere.getWhoIsHereOther(charId);
            let miniMapOtherController = Engine.miniMapController.handHeldMiniMapController.getMiniMapOtherController();
            let other = miniMapOtherController.getObject(charId);

            if (!whoIsHereOther || !other) {
                return
            }

            let $whoIsHereOther = whoIsHereOther.$;
            let $tipContainer = $whoIsHereOther.find('.tip-container');

            Engine.whoIsHere.createTipWrapper($tipContainer, character);

            miniMapOtherController.createTipToOther(other);

        }
    }

    function reloadAllCharacterTips() {
        API.addCallbackToEvent(Engine.apiData.NEW_OTHER, restoreTip);
        API.removeCallbackFromEvent(Engine.apiData.NEW_OTHER, restoreTip);
        restoreTip(Engine.hero);
    }

    function changeTip(tipObj) {

        if (tipObj.object.getLevel() === 0)
            return;

        var range = loot(tipObj.object.getLevel());
        var txt = rangeText(range[0], range[1]);
        tipObj.text += '<div class="info_tooltip_cont">' +
            '<div class="line"></div>' +
            '<div class="info_tooltip_loot">' +
            getText("loot") +
            '<div class="value">' + txt + '</div>' +
            '</div>' +
            '</div>';
    }

    this.start = function() {
        if (running)
            return;
        running = true;

        API.addCallbackToEvent(Engine.apiData.AFTER_INTERFACE_START, initAddon);

        if (getAlreadyInitialised()) {
            initAddon();
        }


        //$style = $("<style>" +
        //	".info_tooltip_cont{" +
        //	"display: block;" +
        //	"margin-top: -1px;" +
        //	"width: 100%;" +
        //	"height: 14px;" +
        //	"font-size: 11px;" +
        //	"}" +
        //	".info_tooltip_loot{" +
        //	"float: right;" +
        //	"}" +
        //	".info_tooltip_loot .value{" +
        //	"display: inline-block;" +
        //	"margin-left: 2px;" +
        //	"color: #d5bf74;" +
        //	"}" +
        //	".tip-wrapper[data-type=\"t_other\"] .mute {" +
        //	"bottom: 18px !important;" +
        //	"}" +
        //	"</style>").appendTo("head");
        //
        //API.addCallbackToEvent(Engine.apiData.AFTER_CHARACTER_TIP_UPDATE, changeTip);
        //reloadAllCharacterTips();
    };

    const initAddon = () => {

        $style = $("<style>" +
            ".info_tooltip_cont{" +
            "display: block;" +
            "margin-top: -1px;" +
            "width: 100%;" +
            "height: 14px;" +
            "font-size: 11px;" +
            "}" +
            ".info_tooltip_loot{" +
            "float: right;" +
            "}" +
            ".info_tooltip_loot .value{" +
            "display: inline-block;" +
            "margin-left: 2px;" +
            "color: #d5bf74;" +
            "}" +
            ".tip-wrapper[data-type=\"t_other\"] .mute {" +
            "bottom: 18px !important;" +
            "}" +
            "</style>").appendTo("head");

        API.addCallbackToEvent(Engine.apiData.AFTER_CHARACTER_TIP_UPDATE, changeTip);
        reloadAllCharacterTips();
    }

    this.stop = function() {
        if (!running)
            return;
        running = false;
        $style.remove();

        API.removeCallbackFromEvent(Engine.apiData.AFTER_CHARACTER_TIP_UPDATE, changeTip);
        API.removeCallbackFromEvent(Engine.apiData.AFTER_INTERFACE_START, initAddon);
        reloadAllCharacterTips();
    };

}