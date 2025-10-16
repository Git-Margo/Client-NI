var SOUND_DATA = require('@core/sound/SoundData');
var SocietyData = require('@core/society/SocietyData');
module.exports = function() {

    const moduleData = {
        fileName: "Sound2.js"
    };

    const playSoundsList = {
        [SOUND_DATA.TYPE.MUSIC]: {},
        [SOUND_DATA.TYPE.NOTIFICATION]: {},
        [SOUND_DATA.TYPE.BATTLE_EFFECT]: {},
        [SOUND_DATA.TYPE.SRAJ]: {},
        [SOUND_DATA.TYPE.TMP]: {},
        [SOUND_DATA.TYPE.ITEM]: {},
    };

    const volumeSoundsList = {
        [SOUND_DATA.TYPE.MUSIC]: 100,
        [SOUND_DATA.TYPE.NOTIFICATION]: 50,
        [SOUND_DATA.TYPE.BATTLE_EFFECT]: 20,
        [SOUND_DATA.TYPE.SRAJ]: 80,
        [SOUND_DATA.TYPE.TMP]: 80,
        [SOUND_DATA.TYPE.ITEM]: 80,
    }

    let MUSIC_DATA = {
        '002': {
            file: '002.mp3',
            gr: 1
        },
        '003': {
            file: '003.mp3',
            gr: 2
        },
        '004': {
            file: '004.mp3',
            gr: 1
        },
        '006': {
            file: '006.mp3',
            gr: 1
        },
        '013': {
            file: '013.mp3',
            gr: 2
        },
        '014': {
            file: '014.mp3',
            gr: 2
        },
        '015': {
            file: '015.mp3',
            gr: 2
        },
        '027': {
            file: '027.mp3',
            gr: 1
        },
        '27n': {
            file: '027.mp3',
            gr: null
        },
        '032': {
            file: '032.mp3',
            gr: 3
        },
        '007': {
            file: '007.mp3',
            gr: 4
        },
        'm11': {
            file: '007.mp3',
            gr: null
        },
        '07n': {
            file: '007.mp3',
            gr: null
        },
        '018': {
            file: '018.mp3',
            gr: 8
        },
        '019': {
            file: '019.mp3',
            gr: 7
        },
        '19n': {
            file: '019.mp3',
            gr: null
        },
        '035': {
            file: '035.mp3',
            gr: 4
        },
        '35n': {
            file: '035.mp3',
            gr: null
        },
        '005': {
            file: '005.mp3',
            gr: 3
        },
        '008': {
            file: '008.mp3',
            gr: 3
        },
        '009': {
            file: '009.mp3',
            gr: 3
        },
        '010': {
            file: '010.mp3',
            gr: 4
        },
        '011': {
            file: '011.mp3',
            gr: 4
        },
        '012': {
            file: '012.mp3',
            gr: 3
        },
        '021': {
            file: '021.mp3',
            gr: 4
        },
        '033': {
            file: '033.mp3',
            gr: 8
        },
        '034': {
            file: '034.mp3',
            gr: 7
        },
        'aa1': {
            file: 'a.mp3',
            gr: null
        },
        'aa2': {
            file: 'a.mp3',
            gr: null
        },
        'bb': {
            file: 'b.mp3',
            gr: null
        },
        'cc1': {
            file: 'c.mp3',
            gr: null
        },
        'cc2': {
            file: 'c.mp3',
            gr: null
        },
        'dd1': {
            file: 'd.mp3',
            gr: null
        },
        'dd2': {
            file: 'd.mp3',
            gr: null
        },
        'dd3': {
            file: 'd.mp3',
            gr: null
        },
        'dd4': {
            file: 'd.mp3',
            gr: null
        },
        'ee': {
            file: 'e.mp3',
            gr: null
        },
        'f': {
            file: 'f.mp3',
            gr: 0
        },
        'g': {
            file: 'g.mp3',
            gr: 0
        },
        'h': {
            file: 'h.mp3',
            gr: 0
        },
        'i': {
            file: 'i.mp3',
            gr: 6
        },
        'j': {
            file: 'j.mp3',
            gr: 5
        },
        'k': {
            file: 'k.mp3',
            gr: 5
        },
        'l': {
            file: 'l.mp3',
            gr: 5
        }
    };

    const BATTLE_EFFECT_DATA = {
        "-1": "123_szadz.mp3"
    }

    const NOTIFICATION_DATA = {
        0: 'new_mail.mp3',
        1: 'enemy_here.mp3',
        2: 'friend_here.mp3',
        3: 'elite2_here.mp3',
        4: 'heroes_here.mp3',
        5: 'timer.mp3',
        6: 'abbys.mp3',
        7: 'group_loot.mp3',
        8: 'your_turn.mp3',
        9: 'stasis_in.mp3',

        10: '1.wav',
        11: '2.wav',
        12: '3.wav',
        13: '4.wav',
        14: '5.wav',
        15: '6.wav',
        16: '7.wav',
        17: '8.mp3',
        18: '9.mp3',
        19: '10.mp3',
        20: '11.mp3',
    };

    const SRAJ_DATA = {
        "-1": 'owacje_VOLUME_TEST_DONT_REMOVE.mp3'
    }

    const ITEM_DATA = {};

    const fadeLength = 4000;
    let userClicked = false;
    let soundSystemIsReady = false;

    const queueSound = [];
    let groupObj = null;
    const dataSettings = {
        play: !mobileCheck(),
        shuffle: false,
        quality: SOUND_DATA.QUALITY.HQ,
        mainVolume: 100,
        volume: {
            [SOUND_DATA.TYPE.MUSIC]: 100,
            [SOUND_DATA.TYPE.NOTIFICATION]: 100,
            [SOUND_DATA.TYPE.BATTLE_EFFECT]: 100,
            [SOUND_DATA.TYPE.SRAJ]: 100,
            [SOUND_DATA.TYPE.TMP]: 100,
            [SOUND_DATA.TYPE.ITEM]: 100
        }
    }

    const addToBATTLE_EFFECT_DATA = (key, fileName) => {
        if (!BATTLE_EFFECT_DATA[key]) BATTLE_EFFECT_DATA[key] = fileName;
    }

    const addToSRAJ_DATA = (key, fileName) => {
        if (!SRAJ_DATA[key]) SRAJ_DATA[key] = fileName;
    }

    const addToITEM_DATA = (key, fileName) => {
        if (!ITEM_DATA[key]) ITEM_DATA[key] = fileName;
    }

    const loadToCache = (key, type) => {

        //new Audio(getSoundUrl(key, SOUND_DATA.TYPE.BATTLE_EFFECT))
        new Audio(getSoundUrl(key, type))
    }

    const setDataSettingPlay = (val) => {
        dataSettings.play = val
    }

    const setDataSettingQuality = (val) => {
        if (![SOUND_DATA.QUALITY.HQ, SOUND_DATA.QUALITY.LQ].includes(val)) {
            return;
        }

        dataSettings.quality = val
    }

    const setDataSettingShuffle = (val) => {
        dataSettings.shuffle = val
    }

    const setDataSettingMainVolume = (val) => {
        if (!isNumberFunc(val)) {
            return;
        }

        dataSettings.mainVolume = val
    }

    const setDataSettingVolume = (val, type) => {
        if (!checkAvailableSoundType(type)) {
            return;
        }

        if (!isNumberFunc(val)) {
            return;
        }

        dataSettings.volume[type] = val
    }

    const getDataSettingVolume = (type) => {
        if (!checkAvailableSoundType(type)) return

        return dataSettings.volume[type];
    }

    const getDataSettingMainVolume = () => {
        return dataSettings.mainVolume;
    }

    const getDataSettingQuality = () => {
        return dataSettings.quality;
    }

    const getDataSettingShuffle = () => {
        return dataSettings.shuffle;
    }

    const getDataSettingPlay = (val) => {
        return dataSettings.play;
    }

    const checkAvailableSoundType = (type) => {
        if (SOUND_DATA.TYPE[type]) return true
        errorReport('Sound', "checkAvailableSoundType", "Incorrect type of sound" + type)
        return false;
    };

    const addToPlaySound = (sound, type) => {
        if (!checkAvailableSoundType(type)) return;
        let id = sound.soundData.id;
        playSoundsList[type][id] = sound;
    };

    const removeFromPlaySound = (type, id) => {
        if (!checkAvailableSoundType(type)) return;

        delete playSoundsList[type][id];
    };

    const init = () => {
        initSoundManager();
        refreshGroupObj();
        initSettings();
        initClickEvent();
    };

    const initClickEvent = () => {
        // console.log('initClickEvent')
        $(document).one('mousedown keydown', function() {
            if (userClicked) return
            userClicked = true;
            for (let k in queueSound) {
                queueSound[k].soundData.play();
            }
        })
    }

    const createMusic = (newBg) => {
        let type = SOUND_DATA.TYPE.MUSIC;
        let newKey = newBg ? newBg : getMusicDataKeyByTownBgFile();
        let url = getSoundUrl(newKey, type)

        if (url == null) return;

        let id = getFreeId(type);
        let sound = createSound(id, type, newKey, url);

        if (!sound) {
            return
        }

        addToPlaySound(sound, type)

        // console.log('createMusic:', newKey)

        autoPlayFix(sound);
        //console.log(sound);
    }

    const addSrajMapMusic = (id, file, group) => {
        if (MUSIC_DATA[id]) {
            errorReport("Sound2", "addSrajMapMusic", `id ${id} already exist!`);
            return;
        }

        MUSIC_DATA[id] = {
            file: file,
            gr: group,
            sraj: true
        }
    }

    const removeSrajMapMusic = (id) => {
        if (!MUSIC_DATA[id]) {
            errorReport("Sound2", "removeSrajMapMusic", `id ${id} not exist!`);
            return;
        }

        delete MUSIC_DATA[id];
    }


    const setMusic = (forceFadeOutIfExist) => {
        if (!dataSettings.play) return;

        let exist = checkMusicExist();
        if (exist) {

            if (forceFadeOutIfExist) {
                setMusicFadeOut()
                return
            }

            let o = getPlayingMusic();
            if (checkSameGroup(o)) return;
            setMusicFadeOut()
        } else {
            createMusic();
        }
    }

    const checkMusicExist = () => {
        for (let k in playSoundsList[SOUND_DATA.TYPE.MUSIC]) {
            return true
        }

        return false
    }

    const checkSameGroup = (o) => {
        let newKey = getMusicDataKeyByTownBgFile();
        let url = getSoundUrl(newKey, SOUND_DATA.TYPE.MUSIC);

        if (!url) return false;

        let newGr = getGrByMusicKey(newKey);
        let actualGr = getGrByMusicKey(o.soundKey);

        if (newGr == null || actualGr == null) return false;

        return newGr == actualGr;
    };

    const getGrByMusicKey = (musicKey) => {
        if (!MUSIC_DATA[musicKey]) return null;

        return MUSIC_DATA[musicKey].gr
    };

    const getFreeId = () => {
        let id = 0;

        while (playSoundsList[SOUND_DATA.TYPE.MUSIC][id] ||
            playSoundsList[SOUND_DATA.TYPE.NOTIFICATION][id] ||
            playSoundsList[SOUND_DATA.TYPE.BATTLE_EFFECT][id] ||
            //playSoundsList[SOUND_DATA.TYPE.SRAJ][id] ||
            playSoundsList[SOUND_DATA.TYPE.TMP][id]) {
            id++;
        }

        return id;
    };

    const initSoundManager = () => {
        soundManager.setup({
            flashVersion: 9,
            useFlashBlock: false,
            onready: function() {
                soundSystemIsReady = true;
            }
        });
    };

    const setNextMusicFromGroup = (oldO) => {

        let soundKey = oldO.soundKey;
        let gr = getGrByMusicKey(soundKey);

        if (gr == null) {
            setMusic();
            return
        }

        let specificGroup = groupObj[gr];
        let newKey;

        if (dataSettings.shuffle == 1) newKey = getNextKeyFromGroupShuffle(soundKey, specificGroup)
        else newKey = getNextKeyFromGroup(soundKey, specificGroup);

        createMusic(newKey)
    };

    const getNextKeyFromGroupShuffle = (soundKey, specificGroup) => {

        if (!Object.keys(specificGroup).length) {
            errorReport("Sound.js", "getNextKeyFromGroup", "group is empty" + specificGroup);
            return null;
        }

        if (Object.keys(specificGroup).length == 1) return soundKey;

        let a = [];

        for (let k in specificGroup) {
            if (k != soundKey) a.push(k);
        }

        let index = Math.round(Math.random() * (a.length - 1));

        return a[index];
    }

    const getNextKeyFromGroup = (soundKey, specificGroup) => {
        let firstKey = null;
        let next = null;

        if (!Object.keys(specificGroup).length) {
            errorReport("Sound.js", "getNextKeyFromGroup", "group is empty" + specificGroup);
            return null;
        }

        for (let k in specificGroup) {
            if (firstKey == null) firstKey = k;

            if (next) return k;

            if (soundKey == k) next = true
        }

        return firstKey;
    }

    const testMainSound = () => {
        const TEST_MAIN_SOUND = "TEST_MAIN_SOUND";

        if (soundManager.getSoundById(TEST_MAIN_SOUND)) {
            return;
        }

        let testSound = null;
        let o = {
            soundData: null
        };
        let name = 1;
        let type = SOUND_DATA.TYPE.NOTIFICATION;
        let url = getSoundUrl(name, type);

        console.log(url);

        let soundData = {
            id: "TEST_MAIN_SOUND",
            position: 0,
            url: `${url}?v=${__build.version}`,
            volume: dataSettings.mainVolume,
            onfinish: () => {
                removeSound(o)
            },
            whileplaying: () => {
                o.soundData.setVolume(dataSettings.mainVolume);
            }
        };


        o.soundData = soundManager.createSound(soundData);

        autoPlayFix(o);
    };

    const checkMute = (type) => {
        return dataSettings.mainVolume == 0 || volumeSoundsList[type] == 0
    }

    const createSound = (id, type, soundKey, url, additionalData) => {

        if (!checkAvailableSoundType(type)) return

        if (checkMute(type)) {
            return
        }

        let o = {
            type: type,
            soundKey: soundKey,
            soundData: null,
            additionalData: null
        };

        let soundData = {
            id: id,
            position: 0,
            url: `${url}?v=${__build.version}`,
            volume: volumeSoundsList[type]
        }

        switch (type) {
            case SOUND_DATA.TYPE.MUSIC:
                o.fadeOut = false;
                o.fadeOutStart = null;
                o.fadeIn = true;
                o.finishing = false

                soundData.onfinish = () => {
                    onFinishSound(o)
                };
                soundData.whileplaying = () => {
                    whilePlayingSound(o)
                };
                break;

            case SOUND_DATA.TYPE.BATTLE_EFFECT:
            case SOUND_DATA.TYPE.NOTIFICATION:
            case SOUND_DATA.TYPE.ITEM:
            case SOUND_DATA.TYPE.TMP:
                soundData.onfinish = () => {
                    onFinishSound(o)
                };
                soundData.whileplaying = () => {
                    whilePlayingSound(o)
                };
                break;
            case SOUND_DATA.TYPE.SRAJ:
                soundData.onfinish = () => {
                    onFinishSound(o)
                };
                soundData.whileplaying = () => {
                    whilePlayingSound(o)
                };
                o.rajSound = additionalData.rajSound;
                break;
        }

        o.soundData = soundManager.createSound(soundData);

        manageVolume(o)

        return o;
    };

    const removeSound = (o) => {
        o.soundData.destruct();
    }

    const getSoundUrl = (soundKey, type, options = defaultSoundUrlOptions) => {

        if (!checkAvailableSoundType(type)) return null;

        const FUNC = "getSoundUrl";
        const fileName = moduleData.fileName;

        switch (type) {
            case SOUND_DATA.TYPE.MUSIC:

                if (!MUSIC_DATA[soundKey]) {
                    errorReport(fileName, FUNC, "MUSIC_DATA sound not exist: " + soundKey);
                    return null;
                }

                let sourceUrl = null;

                if (MUSIC_DATA[soundKey].sraj) sourceUrl = cdnUrl + CFG.r_srajSound;
                else sourceUrl = cdnUrl + '/';

                return sourceUrl + "music/" + dataSettings.quality + "/" + MUSIC_DATA[soundKey].file;

            case SOUND_DATA.TYPE.BATTLE_EFFECT:

                if (!BATTLE_EFFECT_DATA[soundKey]) {
                    errorReport(fileName, FUNC, "BATTLE_EFFECT_DATA sound not exist: " + soundKey);
                    return null;
                }
                return cdncrUrl + CFG.r_battleEffectsSound + BATTLE_EFFECT_DATA[soundKey];

            case SOUND_DATA.TYPE.NOTIFICATION:
                if (options.keyAsUrl) return soundKey;

                if (!NOTIFICATION_DATA[soundKey]) {
                    errorReport(fileName, FUNC, "NOTIFICATION_DATA sound not exist: " + soundKey);
                    return null;
                }
                return "/sounds/" + NOTIFICATION_DATA[soundKey];
            case SOUND_DATA.TYPE.SRAJ:
                if (!SRAJ_DATA[soundKey]) {
                    errorReport(fileName, FUNC, "SRAJ_DATA sound not exist: " + soundKey);
                    return null;
                }
                return cdnUrl + CFG.r_srajSound + SRAJ_DATA[soundKey];
            case SOUND_DATA.TYPE.TMP:
                return cdnUrl + "/obrazki/" + soundKey;
            case SOUND_DATA.TYPE.ITEM:
                if (!ITEM_DATA[soundKey]) {
                    errorReport(fileName, FUNC, "ITEM_DATA sound not exist: " + soundKey);
                    return null;
                }
                return soundKey;
        }
    }

    const autoPlayFix = (o) => {

        if (!userClicked) queueSound.push(o);
        else o.soundData.play();

    };

    const onFinishSound = (o) => {
        // console.log("onFinishSound")

        let type = o.type;

        if (!checkAvailableSoundType(type)) return

        removeFromPlaySound(o.type, o.soundData.id);
        removeSound(o);

        switch (type) {
            case SOUND_DATA.TYPE.MUSIC:
                let sameGroup = checkSameGroup(o);

                if (sameGroup) setNextMusicFromGroup(o);
                else setMusic();

                break;
            case SOUND_DATA.TYPE.NOTIFICATION:
            case SOUND_DATA.TYPE.BATTLE_EFFECT:
            case SOUND_DATA.TYPE.ITEM:
                break;
            case SOUND_DATA.TYPE.SRAJ:
                o.rajSound.finishSound();
                break;
        }
    };

    const whilePlayingSound = function(o) {
        manageVolume(o)
    };

    const manageVolume = (o) => {
        let type = o.type;
        let volume;
        switch (type) {
            case SOUND_DATA.TYPE.MUSIC:
                manageFadeOutMusic(o);
                volume = getUpdatedMusicVolume(o);
                break;
            case SOUND_DATA.TYPE.BATTLE_EFFECT:
            case SOUND_DATA.TYPE.NOTIFICATION:
            case SOUND_DATA.TYPE.TMP:
            case SOUND_DATA.TYPE.ITEM:
                volume = getUpdatedSoundVolume(type);
                break;
            case SOUND_DATA.TYPE.SRAJ:
                let _volume = getUpdatedSoundVolume(type) / 100;
                let source = o.rajSound.checkSource();
                let specificVolume = o.rajSound.getSpecificVolume();
                let percentVolume = (specificVolume != null ? specificVolume : getUpdatedSoundVolume(type)) / 100;

                if (source) volume = _volume * (percentVolume * o.rajSound.getVolumeForSourceSound(Engine.hero.rx, Engine.hero.ry));
                else volume = _volume * (percentVolume * 100);

                break;
        }

        o.soundData.setVolume(volume * dataSettings.mainVolume / 100);
    };

    const getUpdatedMusicVolume = (o) => {

        let volume;
        let v = volumeSoundsList[SOUND_DATA.TYPE.MUSIC];

        if (o.fadeOut) {
            let percent = Math.abs((o.soundData.position - o.fadeOutStart) / fadeLength - 1);
            volume = v * percent
        } else volume = v;

        return volume < 0 ? 0 : volume > 100 ? 100 : volume;
    };

    const getUpdatedSoundVolume = (type) => {
        if (!checkAvailableSoundType(type)) return;

        let v = volumeSoundsList[type];

        return v < 0 ? 0 : v > 100 ? 100 : v;
    };

    const getPlayingMusic = () => {
        for (let k in playSoundsList[SOUND_DATA.TYPE.MUSIC]) {
            return playSoundsList[SOUND_DATA.TYPE.MUSIC][k]
        }

        return null;
    }

    const setMusicFadeOut = () => {
        // console.log('setMusicFadeOut')

        let o = getPlayingMusic();

        if (o.fadeOut) return;

        if (!o) {
            errorReport("Sound.js", "setMusicFadeOut", "Music not exist!");
            return
        }

        o.fadeOut = true
        o.fadeOutStart = o.soundData.position
    }

    const manageFadeOutMusic = (o) => {
        let position = o.soundData.position
        let timeLeft = o.soundData.duration - position;

        if (o.soundData.duration == null) {
            return;
        }

        if (o.fadeOut) {

            if (position - o.fadeOutStart > fadeLength) {
                onFinishSound(o);
            }

            return;
        }

        if (fadeLength > timeLeft) setMusicFadeOut();
    }

    const manageOtherNotifications = (other) => {
        let enemyHere = getStateSoundNotifById(1);
        let friendHere = getStateSoundNotifById(2);

        //if (enemyHere && other.relation == 'en') 	return createNotifSound(1);
        //if (friendHere && other.relation == 'fr') 	return createNotifSound(2);

        if (enemyHere && other.relation == SocietyData.RELATION.ENEMY) return createNotifSound(1);
        if (friendHere && other.relation == SocietyData.RELATION.FRIEND) return createNotifSound(2);
    };

    const manageNpcNotifications = (npc) => {
        let e2Here = getStateSoundNotifById(3);
        let titanOrHerosHere = getStateSoundNotifById(4);
        let attackNpc = npc.type == 2 || npc.type == 3;

        if (!attackNpc) {
            return;
        }

        let newKey = null;

        if (titanOrHerosHere && npc.wt > 79) newKey = 4
        else if (e2Here && npc.wt < 30 && npc.wt > 19) newKey = 3;

        if (newKey != null) createNotifSound(newKey);
    }

    const getStateSoundNotifById = (v) => {
        let key = getSoundNotificationPatch();
        let store = Engine.serverStorage.get(key, v);

        return store != null ? store : false;
    };

    const getMusicDataKeyByTownBgFile = () => {
        let key = null;
        let rMM = Engine.rajMapMusicManager;
        let lastPlayId = rMM.getLastPlayId();

        if (lastPlayId != null) key = rMM.getMusicIdByMapMusicId(lastPlayId);
        else {
            let v = /(.*?)\.jpg/.exec(Engine.map.d.bg);

            if (v == null) key = null;
            else key = v[1];
        }

        //let key = /(.*?)\.jpg/.exec(Engine.map.d.bg);

        if (key == null) return "l";

        if (!MUSIC_DATA[key]) return "l";

        return key;
    };

    const refreshGroupObj = () => {
        groupObj = {};

        for (let k in MUSIC_DATA) {
            let gr = MUSIC_DATA[k].gr;

            if (gr == null) continue;

            if (!groupObj[gr]) groupObj[gr] = {};

            if (groupObj[gr][k]) warningReport("Sound.js", "prepareGroupObj", "This key already exist");
            else groupObj[gr][k] = true;

        }
    };

    const createSrajSound = (newKey, rajSound) => {
        let type = SOUND_DATA.TYPE.SRAJ;
        let url = getSoundUrl(newKey, type);

        if (url == null) return;

        //let id    	= getFreeId(type, rajSound);
        let id = rajSound.getId();
        let sound = createSound(id, type, newKey, url, {
            rajSound: rajSound
        });

        if (!sound) {
            return
        }

        //rajSound.setSoundId(id);

        addToPlaySound(sound, type);
        autoPlayFix(sound);
    };

    const prepareSrajSound = (url) => {
        this.addToSRAJ_DATA(url, url);
        this.loadToCache(url, SOUND_DATA.TYPE.SRAJ);
    }

    const checkSrajSoundIsPlaying = (soundId) => {
        for (let _soundId in playSoundsList[SOUND_DATA.TYPE.SRAJ]) {
            if (soundId == _soundId) return true
        }

        return false;
    }

    const finishPlayingSrajSound = (id) => {
        let sound = playSoundsList[SOUND_DATA.TYPE.SRAJ][id];

        onFinishSound(sound);
    }

    const createItemSound = (newKey, id) => {
        let type = SOUND_DATA.TYPE.ITEM;
        let url = getSoundUrl(newKey, type);

        if (url == null) return;

        let sound = createSound(id, type, newKey, url);

        if (!sound) {
            return
        }

        addToPlaySound(sound, type);
        autoPlayFix(sound);
    };

    const prepareItemSound = (url) => {
        addToITEM_DATA(url, url);
        loadToCache(url, SOUND_DATA.TYPE.ITEM);
    };

    const checkItemSoundIsPlaying = (soundId) => {
        for (let _soundId in playSoundsList[SOUND_DATA.TYPE.ITEM]) {
            if (soundId == _soundId) return true
        }

        return false;
    };

    const finishPlayingItemSound = (id) => {
        let sound = playSoundsList[SOUND_DATA.TYPE.ITEM][id];

        onFinishSound(sound);
    };

    const finishPlayingTmpSound = () => {
        const sound = playSoundsList[SOUND_DATA.TYPE.TMP][0];
        onFinishSound(sound);
    }

    const createBattleEffectSound = (newKey) => {
        let type = SOUND_DATA.TYPE.BATTLE_EFFECT;
        let url = getSoundUrl(newKey, type)

        if (url == null) return

        let id = getFreeId(type);
        let sound = createSound(id, type, newKey, url);

        if (!sound) {
            return
        }

        addToPlaySound(sound, type)
        autoPlayFix(sound);
    }

    const createTmpSound = (newKey) => {
        let type = SOUND_DATA.TYPE.TMP;
        let url = getSoundUrl(newKey, type);

        if (url == null) return;
        let isAlreadyPlay = checkTmpSoundIsAlreadyPlay();
        if (isAlreadyPlay) finishPlayingTmpSound();

        let id = 0; // always 0 - only one sound
        let sound = createSound(id, type, newKey, url);

        if (!sound) {
            return
        }

        addToPlaySound(sound, type)
        autoPlayFix(sound);
    }

    const defaultSoundUrlOptions = {
        keyAsUrl: false
    };

    const createNotifSound = (newKey, options = defaultSoundUrlOptions) => {

        options = {
            ...defaultSoundUrlOptions,
            ...options
        };

        let type = SOUND_DATA.TYPE.NOTIFICATION;
        let url = getSoundUrl(newKey, type, options);

        if (url == null) return;

        let isAlreadyPlay = checkNotifSoundIsAlreadyPlay(newKey);

        if (isAlreadyPlay) return;

        let id = getFreeId(type);
        let sound = createSound(id, type, newKey, url);

        if (!sound) {
            return
        }

        addToPlaySound(sound, type)
        autoPlayFix(sound);
    }

    const checkNotifSoundIsAlreadyPlay = (soundKey) => {
        let allPlayingNotification = playSoundsList[SOUND_DATA.TYPE.NOTIFICATION];

        for (let k in allPlayingNotification) {
            if (allPlayingNotification[k].soundKey == soundKey) return true;
        }

        return false;
    };

    const checkTmpSoundIsAlreadyPlay = () => isset(playSoundsList[SOUND_DATA.TYPE.TMP][0])

    const initSettings = () => {
        initMusicDataSettings();
        initVolumeSoundsList();
    };

    const initVolumeSoundsList = () => {
        volumeSoundsList[SOUND_DATA.TYPE.MUSIC] = dataSettings.volume[SOUND_DATA.TYPE.MUSIC];
        volumeSoundsList[SOUND_DATA.TYPE.NOTIFICATION] = dataSettings.volume[SOUND_DATA.TYPE.NOTIFICATION];
        volumeSoundsList[SOUND_DATA.TYPE.BATTLE_EFFECT] = dataSettings.volume[SOUND_DATA.TYPE.BATTLE_EFFECT];
        volumeSoundsList[SOUND_DATA.TYPE.SRAJ] = dataSettings.volume[SOUND_DATA.TYPE.SRAJ];
        volumeSoundsList[SOUND_DATA.TYPE.TMP] = dataSettings.volume[SOUND_DATA.TYPE.TMP];
        volumeSoundsList[SOUND_DATA.TYPE.ITEM] = dataSettings.volume[SOUND_DATA.TYPE.ITEM];
    }

    const initMusicDataSettings = () => {
        let storage = issetSoundStorage();

        if (!storage) return

        //console.log(storage);

        if (isset(storage.play)) setDataSettingPlay(storage.play);
        if (isset(storage.shuffle)) setDataSettingShuffle(storage.shuffle);
        if (isset(storage.quality)) setDataSettingQuality(storage.quality);
        if (isset(storage.mainVolume)) setDataSettingMainVolume(storage.mainVolume);

        if (isset(storage.volume)) {
            if (isset(storage.volume[SOUND_DATA.TYPE.MUSIC])) setDataSettingVolume(storage.volume[SOUND_DATA.TYPE.MUSIC], SOUND_DATA.TYPE.MUSIC);
            if (isset(storage.volume[SOUND_DATA.TYPE.NOTIFICATION])) setDataSettingVolume(storage.volume[SOUND_DATA.TYPE.NOTIFICATION], SOUND_DATA.TYPE.NOTIFICATION);
            if (isset(storage.volume[SOUND_DATA.TYPE.BATTLE_EFFECT])) setDataSettingVolume(storage.volume[SOUND_DATA.TYPE.BATTLE_EFFECT], SOUND_DATA.TYPE.BATTLE_EFFECT);
            if (isset(storage.volume[SOUND_DATA.TYPE.SRAJ])) setDataSettingVolume(storage.volume[SOUND_DATA.TYPE.SRAJ], SOUND_DATA.TYPE.SRAJ);
            if (isset(storage.volume[SOUND_DATA.TYPE.TMP])) setDataSettingVolume(storage.volume[SOUND_DATA.TYPE.TMP], SOUND_DATA.TYPE.TMP);
            if (isset(storage.volume[SOUND_DATA.TYPE.ITEM])) setDataSettingVolume(storage.volume[SOUND_DATA.TYPE.ITEM], SOUND_DATA.TYPE.ITEM);
        }

    }

    const issetSoundStorage = () => {
        return Engine.serverStorage.get(getSoundParametersPatch());
    };

    const setVolumeWithoutSaveInServerStorage = (volume, type) => {
        if (!checkAvailableSoundType(type)) return;
        volume = parseInt(volume < 0 ? 0 : volume > 100 ? 100 : volume);

        volumeSoundsList[type] = volume;
    };

    const setVolumeWithSaveInServerStorage = (volume, type) => {

        for (let index in type) {
            let oneType = type[index];

            if (!checkAvailableSoundType(oneType)) {
                return;
            }

            setVolumeWithoutSaveInServerStorage(volume, oneType);
            setDataSettingVolume(volumeSoundsList[oneType], oneType);
        }

        saveSettings();
    };

    const setMainVolumeWithoutSaveInServerStorage = (volume) => {
        let _volume = parseInt(volume < 0 ? 0 : volume > 100 ? 100 : volume);

        setDataSettingMainVolume(_volume);
    };

    const setMainVolumeWithSaveInServerStorage = (volume) => {

        //if (!checkAvailableSoundType(type)) return;
        setMainVolumeWithoutSaveInServerStorage(volume);


        saveSettings();
    };

    const saveSettings = () => {
        let objToSend = {};
        objToSend[getSoundParametersPatch()] = {
            play: getDataSettingPlay(),
            mainVolume: getDataSettingMainVolume(),
            volume: dataSettings.volume,
            shuffle: getDataSettingShuffle(),
            quality: getDataSettingQuality()
        };
        Engine.serverStorage.sendData(objToSend);
    };

    const toggleQuality = () => {
        let v = dataSettings.quality == SOUND_DATA.QUALITY.LQ ? SOUND_DATA.QUALITY.HQ : SOUND_DATA.QUALITY.LQ
        setDataSettingQuality(v);
        saveSettings();
        clearMusic();
        if (dataSettings.play) {
            setMusic();
        }
    };

    const toggleShuffle = function() {
        let v = dataSettings.shuffle = !dataSettings.shuffle;
        setDataSettingShuffle(v);
        saveSettings();
    };

    const musicPlayToggle = () => {
        let v = dataSettings.play = !dataSettings.play;
        setDataSettingPlay(v);
        saveSettings();
        clearMusic();
        if (dataSettings.play) {
            setMusic();
        }
    };

    const clearMusic = () => {
        let o = getPlayingMusic();
        if (!o) return
        removeFromPlaySound(o.type, o.soundData.id);
        removeSound(o);
    }

    const synchroStart = () => {

    };



    this.checkMute = checkMute;


    this.finishPlayingItemSound = finishPlayingItemSound;
    this.checkItemSoundIsPlaying = checkItemSoundIsPlaying;
    this.createItemSound = createItemSound;
    this.prepareItemSound = prepareItemSound;


    this.setMainVolumeWithoutSaveInServerStorage = setMainVolumeWithoutSaveInServerStorage;
    this.setMainVolumeWithSaveInServerStorage = setMainVolumeWithSaveInServerStorage;
    this.testMainSound = testMainSound;

    this.checkSrajSoundIsPlaying = checkSrajSoundIsPlaying;
    this.prepareSrajSound = prepareSrajSound;
    this.createSrajSound = createSrajSound;
    this.finishPlayingSrajSound = finishPlayingSrajSound;
    this.finishPlayingTmpSound = finishPlayingTmpSound;

    this.loadToCache = loadToCache;
    this.addToBATTLE_EFFECT_DATA = addToBATTLE_EFFECT_DATA;
    this.addToSRAJ_DATA = addToSRAJ_DATA;
    this.checkAvailableSoundType = checkAvailableSoundType;
    this.musicPlayToggle = musicPlayToggle;
    this.toggleShuffle = toggleShuffle;
    this.toggleQuality = toggleQuality;

    this.setVolumeWithSaveInServerStorage = setVolumeWithSaveInServerStorage;
    this.setVolumeWithoutSaveInServerStorage = setVolumeWithoutSaveInServerStorage;
    this.getDataSettingQuality = getDataSettingQuality;
    this.getDataSettingShuffle = getDataSettingShuffle;
    this.getDataSettingPlay = getDataSettingPlay

    this.getDataSettingMainVolume = getDataSettingMainVolume;
    this.getDataSettingVolume = getDataSettingVolume;
    this.setMusicFadeOut = setMusicFadeOut;
    this.createBattleEffectSound = createBattleEffectSound;
    this.createNotifSound = createNotifSound;
    this.createTmpSound = createTmpSound;
    this.getStateSoundNotifById = getStateSoundNotifById;
    this.init = init;
    this.setMusic = setMusic;
    this.manageOtherNotifications = manageOtherNotifications;
    this.manageNpcNotifications = manageNpcNotifications;
    this.synchroStart = synchroStart;
    this.addSrajMapMusic = addSrajMapMusic;
    this.refreshGroupObj = refreshGroupObj;
    this.removeSrajMapMusic = removeSrajMapMusic;

};