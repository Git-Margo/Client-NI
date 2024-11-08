module.exports = function() {
    let running = false;
    let $style = null;

    const diff = 14;
    const multiplier = !Engine.worldConfig.getPrivWorld() ? 1.2 : 1.4;

    const countLowerLimit = (lvl) => {
        return Math.round((lvl - 4) / multiplier);
    }

    const countUpperLimit = (lvl) => {
        return Math.round(lvl * multiplier) + 4;
    }

    function loot(lvl) {
        let low;
        if (Engine.worldConfig.getPrivWorld()) {
            low = countLowerLimit(lvl);
            let countedLvl = countUpperLimit(low);
            low = lvl - countedLvl === 1 ? low + 1 : low;
        } else {
            low = countLowerLimit(lvl);
        }
        low = Math.min(low, lvl - diff);
        // const low = Math.min(countLowerLimit(lvl), lvl - diff);
        const high = Math.max(countUpperLimit(lvl), lvl + diff);

        return [Math.max(low, 1), Math.min(high, 500)];
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
        } else {
            character.tipUpdate();
        }
    }

    function reloadAllCharacterTips() {
        API.addCallbackToEvent(Engine.apiData.NEW_OTHER, restoreTip);
        API.removeCallbackFromEvent(Engine.apiData.NEW_OTHER, restoreTip);
        restoreTip(Engine.hero);
    }

    function changeTip(tipObj) {
        if (tipObj.object.d.lvl === 0)
            return;

        var range = loot(tipObj.object.d.lvl);
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