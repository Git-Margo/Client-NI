module.exports = function() {

    const moduleData = {
        fileName: "ItemStats.js"
    };

    let allItemStats = null;

    const setAllItemStats = (_allItemStats) => {
        allItemStats = _allItemStats;
    };

    const getAllItemStats = () => {
        return allItemStats
    };

    const issetStat = (statName) => {
        if (!checkCorrectStat(statName)) {
            return
        }

        return isset(allItemStats[statName])
    };

    const getStat = (statName) => {
        if (!checkCorrectStat(statName)) {
            return
        }

        if (!issetStat(statName)) {
            return null
        }

        return allItemStats[statName];
    };

    const checkCorrectStat = () => {
        return true
    };

    const getStatsDebugStr = () => {
        let str = "";

        for (let statName in allItemStats) {
            str += `<div><span style="color:yellow">` + statName + '</span>:' + allItemStats[statName] + "</div>";
        }

        return str;
    };

    this.setAllItemStats = setAllItemStats;
    this.issetStat = issetStat;
    this.getStat = getStat;
    this.getStatsDebugStr = getStatsDebugStr;

};