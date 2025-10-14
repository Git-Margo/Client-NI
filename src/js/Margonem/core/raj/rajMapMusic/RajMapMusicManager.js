let RajActionManager = require('@core/raj/rajAction/RajActionManager');
let RajActionData = require('@core/raj/rajAction/RajActionData');

module.exports = function() {

    let moduleData = {
        fileName: "RajMapMusicManager.js"
    };
    let mapMusicList = null;
    let lastPlayId = null;
    let rajActionManager = null;

    const init = () => {
        mapMusicList = {};
        initRajActionsManager();
    };

    const initRajActionsManager = () => {
        const TYPE = RajActionData.TYPE;

        rajActionManager = new RajActionManager();
        rajActionManager.init(
            moduleData.fileName, {
                createFunc: createAction,
                removeFunc: removeAction,
                checkExistFunc: checkMapMusicExist,
                createRequire: {
                    file: {}
                },
                mainDataRequire: {
                    play: {
                        type: TYPE.OBJECT,
                        optional: true,
                        elementInObject: {
                            id: {}
                        }
                    }
                }
            },
            RajActionData.GROUP_NAME.OBJECT_WITH_OPTIONAL_LIST_ACTION_ID
        );

    };

    const updateData = (data, additionalData) => {
        if (!rajActionManager.checkCorrectMainData(data, additionalData)) return;

        if (data.list) updateMapMusicList(data.list);

        if (data.play) updatePlay(data.play);
    };

    const updateMapMusicList = (list) => {

        for (let k in list) {
            updateOne(list[k]);
        }

        Engine.soundManager.refreshGroupObj();
    };

    const updatePlay = (play) => {
        setLastPlayId(play.id)

        Engine.soundManager.setMusic(true);
    };

    const updateOne = (mapMusicData) => {
        //switch (mapMusicData.action) {
        //    case "CREATE":
        //        createAction(mapMusicData);
        //        break;
        //    case "REMOVE":
        //        removeAction(mapMusicData);
        //        break;
        //}

        rajActionManager.updateData(mapMusicData);
    };

    const createAction = (mapMusicData) => {
        //let id = mapMusicData.id;

        //if (checkMapMusicExist(id)) {
        //
        //    if (!createIfNotExist) {
        //        errorReport(moduleData.fileName, "createAction", `Object ${id} already exist!`, mapMusicList);
        //    }
        //    return;
        //}

        createElement(mapMusicData);
    };

    const removeAction = (mapMusicData) => {
        let id = mapMusicData.id;

        //if (!checkMapMusicExist(id)) {
        //
        //    if (!removeIfExist) {
        //        errorReport(moduleData.fileName, "removeAction", `Object ${id} not exist!`, mapMusicList);
        //    }
        //    return;
        //
        //}

        removeElement(id)

    };

    const createElement = (mapMusicData) => {
        let id = mapMusicData.id;

        //https://micc.garmory-cdn.cloud/gifcache/obrazki/grafikiRaj/

        let rajMapMusic = {
            id: id,
            musicId: "SRAJ_" + id,
            file: mapMusicData.file,
            group: 999
        };

        addToMapMusicList(id, rajMapMusic);

        Engine.soundManager.addSrajMapMusic(rajMapMusic.musicId, rajMapMusic.file, rajMapMusic.group);
    };

    const removeElement = (id) => {
        let mapMusic = getMapMusic(id);

        removeFromMapMusicList(id);

        Engine.soundManager.removeSrajMapMusic(mapMusic.musicId);
    };

    const getMapMusic = (id) => {
        return mapMusicList[id];
    };

    const checkMapMusicExist = (id) => {
        return mapMusicList[id] ? true : false;
    };

    const addToMapMusicList = (id, mapMusic) => {
        mapMusicList[id] = mapMusic;
    };

    const removeFromMapMusicList = (id) => {
        delete mapMusicList[id];
    };

    const setLastPlayId = (_lastPlayId) => {
        lastPlayId = _lastPlayId;
    };

    const getMusicIdByMapMusicId = (id) => {
        let mapMusic = getMapMusic(id);

        if (!mapMusic) {
            errorReport(moduleData.fileName, "getMusicIdByMapMusicId", `Map music ${id} not exist!`, mapMusicList);
            return null
        }

        return mapMusic.musicId;
    };

    const onClear = () => {
        let exist = lengthObject(mapMusicList);

        for (let id in mapMusicList) {
            removeElement(id);
        }

        if (exist) Engine.soundManager.refreshGroupObj();

        setLastPlayId(null);
    };

    const getLastPlayId = () => lastPlayId;

    this.init = init;
    this.updateData = updateData;
    this.getLastPlayId = getLastPlayId;
    this.getMusicIdByMapMusicId = getMusicIdByMapMusicId;
    this.onClear = onClear;

}