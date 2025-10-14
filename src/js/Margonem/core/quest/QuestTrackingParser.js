let QuestData = require('@core/quest/QuestData');

module.exports = function() {

    const moduleData = {
        fileName: "QuestTrackingParser.js"
    };

    const init = () => {

    }

    const getParseData = (data) => {
        let afterRemoveRepeats = deleteDoubleRecords(data);


        let newData = [];

        for (let oneData of afterRemoveRepeats) {
            let oneDataObj = parseOneData(oneData);
            if (oneDataObj) newData.push(oneDataObj);
        }

        //console.log(newData);

        return newData;
    };

    const parseOneData = (data) => {
        if (data == '*') {
            return null;
        }

        if (data == '') {
            return null;
        }

        let splitData = data.split("|");

        if (splitData.length == 5) {
            return parseMargoPlOneData(splitData);
        }

        errorReport(moduleData.fileName, "parseOneData", "undefined data format", data);

        //if (splitData.length == 3) return parseMargoComOneData(splitData);

    };

    const parseMargoPlOneData = (splitData) => {

        let name1 = splitData[3];

        let mixData = getMixData(splitData[4], name1);

        if (mixData.pos.x == -1 && mixData.pos.y == -1) return null;

        let kind = getKindPl(splitData[1]);

        let quest = {
            questId: splitData[0],
            kind: kind,
            killCounter: getKillConter(kind, splitData[2]),
            toCollect: getToCollectPl(kind, splitData[2]),
            name1: name1, // text on map table, or item in shop
            name2: mixData.name, // name of item or npc to find on map
            pos: mixData.pos
        };

        return quest
    };

    const parseMargoComOneData = (splitData) => {

        let name1 = getName1Com(splitData[1]);

        let mixData = getMixData(splitData[2], name1);

        if (mixData.pos.x == -1 && mixData.pos.y == -1) return null;

        let kind = getKindCom(splitData[1]);

        let quest = {
            questId: splitData[0],
            kind: kind,
            killCounter: getKillConterCom(kind, splitData[1]),
            toCollect: getToCollectCom(kind, splitData[1]),
            name1: name1,
            name2: mixData.name, // text on map table, or item in shop
            pos: mixData.pos // name of item or npc to find on map
        };

        return quest
    };

    const getName1Com = (data) => {
        return data.replace(/#[KB]\.([0-9]+)#/g, '').replace("Find: ", "").replace("Go to: ", "").replace("Kill: ", "").replace(/\s\([0-9]+\/[0-9]+\)/, "")
    };

    const getKindPl = (kind) => {
        const TYPE = QuestData.TYPE
        switch (kind) {
            case TYPE.TALK:
                return TYPE.TALK;
            case TYPE.KILL:
                return TYPE.KILL;
            case TYPE.COLLECT:
                return TYPE.COLLECT;
                //case "BRING" : return "BRING";
        }

    };

    const getKindCom = (data) => {

        const TYPE = QuestData.TYPE
        let kind = null

        if (/#[K]\.([0-9]+)#/.test(data)) {
            kind = TYPE.KILL
        }

        if (/#[B]\.([0-9]+)#/.test(data)) {
            kind = TYPE.COLLECT
        }

        if (!kind) kind = TYPE.TALK

        return kind;
    };

    const getKillConterCom = (kind, data) => {
        if (kind != QuestData.TYPE.KILL) return null;

        let d = /\([0-9]+\/[0-9]+\)/.exec(data);

        if (!d) return null;

        let val = d[0];

        val = val.replace("(", "");
        val = val.replace(")", "");

        let splitData = val.split("/");

        return {
            current: parseInt(splitData[0]),
            toKill: parseInt(splitData[1])
        }
    };

    const getKillConter = (kind, data) => {
        if (kind != QuestData.TYPE.KILL) return null;

        let splitData = data.split("/");

        return {
            current: parseInt(splitData[0]),
            toKill: parseInt(splitData[1])
        }
    };

    const getToCollect = (kind, data) => {
        if (kind != QuestData.TYPE.COLLECT) return null;

        return parseInt(data)
    };

    const getToCollectCom = (kind, data) => {
        if (kind != QuestData.TYPE.COLLECT) return null;

        let d = /\([0-9]+\/[0-9]+\)/.exec(data);

        if (!d) return null;

        let val = d[0];

        val = val.replace("(", "");
        val = val.replace(")", "");

        let splitData = val.split("/");

        return parseInt(splitData[1])
    };

    const getToCollectPl = (kind, data) => {
        if (kind != QuestData.TYPE.COLLECT) return null;

        let dataSplit = data.split("/");

        if (dataSplit.length == 1) {
            return data;
        }

        return dataSplit[1];
    };

    const getMixData = (data, name1) => {
        let splitData = data.split(".");

        let mixData = {
            pos: {
                x: parseInt(splitData[1]),
                y: parseInt(splitData[2]),
                mapId: parseInt(splitData[0])
            }
        };

        mixData['name'] = splitData.length == 4 ? splitData[3] : name1;

        return mixData;
    };

    const deleteDoubleRecords = function(data) {
        var newData = [];
        var exist = [];
        for (var i = 0; i < data.length; i++) {
            var e = data[i];
            if (newData.indexOf(e) > -1) continue; //delete the same records
            var oneRecord = e.split('|');
            if (Array.isArray(oneRecord) && oneRecord[1] == QuestData.TYPE.KILL) { //delete the same enemies
                var name = oneRecord[3];
                if (exist.indexOf(name) > -1) continue;
                newData.push(e);
                exist.push(name);
            } else newData.push(e);
        }
        return newData;
    };

    this.getParseData = getParseData;
};