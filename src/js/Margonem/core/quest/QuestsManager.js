const Quests = require('@core/quest/Quests');

module.exports = function() {
    this.update = (questsObj, allData) => {
        if (questsObj.hasOwnProperty('data')) {
            this.setQuests(questsObj.data, allData);
        }
        if (questsObj.hasOwnProperty('finish')) {
            this.setFinishQuest(questsObj.finish);
        }
        if (questsObj.hasOwnProperty('del')) {
            this.questDelete(questsObj.del);
        }
        if (questsObj.hasOwnProperty('set_track')) {
            this.setSettrack(questsObj.set_track);
        }
        if (questsObj.hasOwnProperty('update_data_track')) {
            updateDataTrack(questsObj.update_data_track);
        }
        if (questsObj.hasOwnProperty('update_data_set_track')) {
            updateDataSetTrack(questsObj.update_data_set_track);
        }
        if (questsObj.hasOwnProperty('track')) {
            this.setTrack(questsObj.track);
        }
        if (questsObj.hasOwnProperty('observe')) {
            this.setQuestObserve(questsObj.observe);
        }
    };

    this.setFinishQuest = (v) => {
        Engine.quests.setFinishQuest(v);
    }

    this.setQuests = (v, allData) => {
        if (!Engine.quests) Engine.quests = new Quests();
        Engine.quests.refresh(v, allData);

        if (isPl()) {
            Engine.tutorialManager.tutorialStart(CFG.LANG.PL, 5);
            //Engine.tutorialManager.tutorialStart(CFG.LANG.EN, 5);
        }
    };

    const updateDataTrack = (v) => {
        getEngine().questTracking.updateData(v);
    };

    const updateDataSetTrack = (v) => {
        //getEngine().questTracking.saveActiveQuestTrackingInStorage(v);
        getEngine().questTracking.setActiveServerTrackingQuest(v);
    };

    this.setTrack = (v) => {
        getEngine().questTracking.startTrackingIfActiveTrackingQuestExist();
        getEngine().quests.refreshTrackQuestButtons();
    };

    this.setSettrack = (v) => {
        getEngine().questTracking.setActiveQuestTrackingProcedure(v);
        getEngine().quests.refreshTrackQuestButtons();
    };

    this.setQuestObserve = (v) => {
        Engine.questsObserve.update(v);
    };

    this.questDelete = (v) => {
        Engine.quests.deleteQuest(v);
        for (let i = 0; i < v.length; i++) {
            let questId = v[i];
            getEngine().questTracking.deleteFromQuestTrackingDataIfExist(questId);
        }
    }
};