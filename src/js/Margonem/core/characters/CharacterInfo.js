const moduleData = {
    fileName: "CharacterInfo.js"
};

const getCharacterInfo = (data) => {

    if (!checkCorrectCharacterData(data)) {
        return '';
    }

    let nick;

    if (data.showNick) {
        nick = data.nick;
        nick += " ";
    } else {
        nick = "";
    }

    let operationLevel = data.operationLevel || 0;
    let level = data.level || 0;
    let prof = data.prof;

    if (level < 301) {
        operationLevel = 0;
    }
    const useHtml = !!data.htmlElement;
    let result = getCharacterInfoText(nick, level, operationLevel, prof, useHtml);

    if (!useHtml) return result;

    return `<div class="character-info" nick="${nick}" level="${level}" operationLevel="${operationLevel}" prof="${prof}">${result}</div>`;
};

const checkCorrectCharacterData = (data) => {
    const FUNC = "checkCorrectCharacterData";

    if (!elementIsObject(data)) {
        errorReport(moduleData.fileName, FUNC, "incorrect data object!", data);
        return false;
    }

    if (!isset(data.level)) {
        errorReport(moduleData.fileName, FUNC, "attr level not exist!", data);
        return false
    }

    if (!isset(data.operationLevel)) {
        errorReport(moduleData.fileName, FUNC, "attr operationLevel not exist!", data);
        return false
    }

    //if (!isset(data.prof)) {      // npc issue
    //    errorReport(moduleData.fileName, FUNC, "attr prof not exist!", data);
    //    return false
    //}

    return true;
};

const getLevelAndOperationLevel = (level, operationLevel, prof) => {
    const profStr = prof || '';
    return operationLevel ?
        `${level}${profStr}|${operationLevel}${profStr}` :
        `${level}${profStr}`;
};

const getOperationLevelAndLevel = (level, operationLevel, prof) => {
    const profStr = prof ? prof : '';

    return operationLevel ?
        `${operationLevel}${profStr}|${level}${profStr}` :
        `${level}${profStr}`;
};

const getOnlyOperationLevel = (level, operationLevel, prof) => {
    const profStr = prof ? prof : '';

    return operationLevel ?
        `${operationLevel}${profStr}` :
        `${level}${profStr}`;
};

const getOnlyLevel = (level, operationLevel, prof) => {
    const profStr = prof ? prof : '';

    return `${level}${profStr}`;
};

const getLevelAndProfString = (level, operationLevel, prof) => {
    const kindOfShowLevelAndOperationLevel = getKindOfShowLevelAndOperationLevel();

    switch (kindOfShowLevelAndOperationLevel) {
        case 0:
            return getLevelAndOperationLevel(level, operationLevel, prof);
        case 1:
            return getOperationLevelAndLevel(level, operationLevel, prof);
        case 2:
            return getOnlyOperationLevel(level, operationLevel, prof);
        case 3:
            return getOnlyLevel(level, operationLevel, prof);
        default:
            errorReport("Helpers.js", "getCharacterInfo", "incorrect case", kindOfShowLevelAndOperationLevel);
            return getLevelAndOperationLevel(level, operationLevel, prof);
    }
};

const formatNick = (nick, useHtml = false) => {
    return useHtml ? `<span class="character-info-nick">${nick}</span>` : nick;
};

const getCharacterInfoText = (nick, level, operationLevel, prof, useHtml = false) => {
    const kindOfShowLevelAndOperationLevel = getKindOfShowLevelAndOperationLevel();
    const formattedNick = formatNick(nick, useHtml);
    const levelString = getLevelAndProfString(level, operationLevel, prof, kindOfShowLevelAndOperationLevel);

    return `${formattedNick}(${levelString})`;
};

const updateAllCharacterInfo = function() {

    let e = getEngine();
    let $allCharacterInfo = $(".character-info");

    e.others.otherTipRefresh();
    e.map.rip.refreshLevelAndTip();
    e.miniMapController.handHeldMiniMapController.refreshMiniMapController();
    e.whoIsHere.updateWhoIsHereAfterSaveInServerStorage();
    e.hero.updateTip();
    e.hero.updateNick();

    $allCharacterInfo.each(function() {
        let $this = $(this);
        let nick = $this.attr("nick");
        let level = $this.attr("level");
        let operationLevel = parseInt($this.attr("operationLevel"));
        let prof = $this.attr("prof");
        let result = getCharacterInfoText(nick, level, operationLevel, prof, true);

        $this.html(result);
    })
};

const addCharacterInfoTip = ($objectToTip, data) => {

    if (!$objectToTip) {
        errorReport("Helpers.js", "addCharacterInfoTip", "$objectToTip is null");
        return;
    }

    if (!checkCorrectCharacterData(data)) {
        return;
    }

    let br = "<br>";
    let colon = ": ";
    let nick = data.nick;
    let level = data.level;
    let operationLevel = data.operationLevel;
    let prof = data.prof;

    if (level < 301) {
        operationLevel = 0;
    }

    let operationLevelStr = operationLevel ? (_t('character_operation_lvl') + colon + operationLevel + br) : '';

    let tip = _t('character_nick') + colon + nick + br +
        _t('character_lvl') + colon + level + br +
        operationLevelStr +
        _t('character_prof') + colon + getAllProfName(prof) + br;

    $objectToTip.tip(tip);
};

module.exports = {
    getCharacterInfo: getCharacterInfo,
    updateAllCharacterInfo: updateAllCharacterInfo,
    addCharacterInfoTip: addCharacterInfoTip
};