var EmotionsData = require('@core/emotions/EmotionsData');
module.exports = function() {

    let OnSelfGif = EmotionsData.ACTION.ON_SELF;
    let OnSelfSprite = EmotionsData.ACTION.ON_SELF;

    let Remover = EmotionsData.ACTION.REMOVER;
    let Lantern = EmotionsData.ACTION.LANTERN;
    let Fire = EmotionsData.ACTION.FIRE;
    let StickToPlayer = EmotionsData.ACTION.STICK_TO_PLAYER;

    let StickToMapGif = EmotionsData.ACTION.STICK_TO_MAP;
    let StickToMapSprite = EmotionsData.ACTION.STICK_TO_MAP;

    let CharToCharGif = EmotionsData.ACTION.CHAR_TO_CHAR;
    let CharToCharSprite = EmotionsData.ACTION.CHAR_TO_CHAR;

    let BetweenPlayers = EmotionsData.ACTION.BETWEEN_PLAYERS;
    let ScriptEmo = EmotionsData.ACTION.SCRIPT_EMO;

    let clearPlayersEmos = [
        EmotionsData.NAME.FRND,
        EmotionsData.NAME.BATTLE,
        EmotionsData.NAME.PVP_PROTECTED,
        EmotionsData.NAME.LOGOFF
    ];
    let definitions = {
        [EmotionsData.NAME.NPC_TALK]: {
            action: OnSelfGif,
            filename: 'talking_mark.gif',
            offset: [0, -4]
        },
        [EmotionsData.NAME.ELITE_HERE]: {
            action: OnSelfGif,
            filename: 'elite-here3.gif',
            offset: [0, 20],
            position: 'bottom',
            timeout: 800
        },
        [EmotionsData.NAME.AGGRESSIVE_1]: {
            action: OnSelfGif,
            filename: 'angry-demon.gif',
            offset: [0, 0]
        },
        [EmotionsData.NAME.AGGRESSIVE_2]: {
            action: OnSelfGif,
            filename: 'berserk.gif',
            offset: [0, 0]
        },
        [EmotionsData.NAME.WALKOVER]: {
            action: OnSelfGif,
            filename: 'battle.gif',
            offset: [0, 0]
        },

        // qm NPC EMO
        [EmotionsData.NAME.BLUE_EXCLAMATION]: {
            action: OnSelfGif,
            filename: 'exclamation_mark_2.gif',
            offset: [0, -10]
        },
        [EmotionsData.NAME.YELLOW_EXCLAMATION]: {
            action: OnSelfGif,
            filename: 'exclamation_mark_1.gif',
            offset: [0, -10]
        },
        [EmotionsData.NAME.RED_EXCLAMATION]: {
            action: OnSelfGif,
            filename: 'exclamation_mark_3.gif',
            offset: [0, -10]
        },
        // qm NPC EMO END

        // ACTIONS NPC EMO
        [EmotionsData.NAME.DAILY_QUEST]: {
            action: OnSelfGif,
            filename: 'daily_quest_mark',
            offset: [0, 0]
        },
        [EmotionsData.NAME.NORMAL_QUEST]: {
            action: OnSelfGif,
            filename: 'quest_mark.gif',
            offset: [0, 0]
        },
        [EmotionsData.NAME.AUCTION]: {
            action: OnSelfGif,
            filename: 'auctions_mark.gif',
            offset: [0, 0]
        },
        [EmotionsData.NAME.DEPO]: {
            action: OnSelfGif,
            filename: 'depo_mark.gif',
            offset: [0, 0],
            clear: [EmotionsData.NAME.DEPO_CLAN]
        },
        [EmotionsData.NAME.DEPO_CLAN]: {
            action: OnSelfGif,
            filename: 'depo_mark.gif',
            offset: [0, 0],
            clear: [EmotionsData.NAME.DEPO]
        },
        [EmotionsData.NAME.MAIL]: {
            action: OnSelfGif,
            filename: 'mail_mark.gif',
            offset: [0, 0]
        },
        [EmotionsData.NAME.SHOP]: {
            action: OnSelfGif,
            filename: 'shop_mark.gif',
            offset: [0, 0]
        },
        [EmotionsData.NAME.HEAL]: {
            action: OnSelfGif,
            filename: 'heal_mark.gif',
            offset: [0, 0]
        },
        [EmotionsData.NAME.INKEEPER]: {
            action: OnSelfGif,
            filename: 'inn_mark.gif',
            offset: [0, 0]
        },
        // ACTIONS NPC EMO END

        [EmotionsData.NAME.FLAG_ENGLAND]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-anglia.gif'
        },
        [EmotionsData.NAME.FLAG_CROATIA]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-chorwacja.gif'
        },
        [EmotionsData.NAME.FLAG_CZECH]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-czechy.gif'
        },
        [EmotionsData.NAME.FLAG_DENMARK]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-dania.gif'
        },
        [EmotionsData.NAME.FLAG_FRANCE]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-francja.gif'
        },
        [EmotionsData.NAME.FLAG_GREECE]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-grecja.gif'
        },
        [EmotionsData.NAME.FLAG_SPAIN]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-hiszpania.gif'
        },
        [EmotionsData.NAME.FLAG_NETHERLAND]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-holandia.gif'
        },
        [EmotionsData.NAME.FLAG_IRELAND]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-irlandia.gif'
        },
        [EmotionsData.NAME.FLAG_GERMANY]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-niemcy.gif'
        },
        [EmotionsData.NAME.FLAG_POLAND]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-polska.gif'
        },
        [EmotionsData.NAME.FLAG_PORTUGAL]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-portugalia.gif'
        },
        [EmotionsData.NAME.FLAG_RUSSIA]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-rosja.gif'
        },
        [EmotionsData.NAME.FLAG_SKULL]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-skull.gif'
        },
        [EmotionsData.NAME.FLAG_SWEDEN]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-szwecja.gif'
        },
        [EmotionsData.NAME.FLAG_UKRAINE]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-ukraina.gif'
        },
        [EmotionsData.NAME.FLAG_ITALY]: {
            action: OnSelfGif,
            timeout: 8000,
            filename: 'flag-wlochy.gif'
        },
        [EmotionsData.NAME.ABBYS_OUT]: {
            action: OnSelfGif,
            timeout: 2000
        },
        [EmotionsData.NAME.ANGRY]: {
            action: OnSelfGif,
            timeout: 8000
        },
        [EmotionsData.NAME.AWAY]: {
            action: OnSelfGif,
            timeout: 8000
        },
        [EmotionsData.NAME.BAT]: {
            action: OnSelfGif,
            timeout: 8000,
        },
        [EmotionsData.NAME.BATTLE]: {
            action: OnSelfGif,
        },
        [EmotionsData.NAME.STASIS]: {
            action: OnSelfGif,
        },
        [EmotionsData.NAME.STASIS_INCOMING]: {
            action: OnSelfGif,
        },
        [EmotionsData.NAME.FRND]: {
            action: OnSelfGif,
            timeout: 3750
        },
        [EmotionsData.NAME.LOGIN]: {
            action: OnSelfGif,
            timeout: 2000
        },
        [EmotionsData.NAME.LOGOFF]: {
            action: OnSelfGif,
            timeout: 4000
        },
        [EmotionsData.NAME.LVL_UP]: {
            action: OnSelfGif,
            timeout: 1000,
            position: 'bottom',
            offset: [0, -30]
        },
        [EmotionsData.NAME.PVP_PROTECTED]: {
            action: OnSelfGif,
            timeout: 5000
        },
        [EmotionsData.NAME.RESPAWNED]: {
            action: OnSelfGif,
            timeout: 2000
        },
        [EmotionsData.NAME.SPIDER]: {
            action: OnSelfGif,
            timeout: 3000
        },
        [EmotionsData.NAME.TELEPORTED]: {
            action: OnSelfGif,
            timeout: 2000
        },

        [EmotionsData.NAME.BUBBLES]: {
            action: OnSelfSprite,
            height: 48,
            frameTime: 0.120,
            offset: [0, 32]
        },
        [EmotionsData.NAME.CURSE]: {
            action: OnSelfSprite,
            height: 32,
            frameTime: 0.200,
            offset: [0, 10],
            filename: 'klatwa.gif',
            loop: 2
        },
        [EmotionsData.NAME.TUNE]: {
            action: OnSelfSprite,
            height: 32,
            frameTime: 0.100,
            offset: [0, 0]
        },
        [EmotionsData.NAME.GUM_1]: {
            action: OnSelfSprite,
            height: 48,
            frameTime: 0.120,
            offset: [0, 32]
        },
        [EmotionsData.NAME.GUM_2]: {
            action: OnSelfSprite,
            height: 48,
            frameTime: 0.120,
            offset: [0, 32]
        },
        [EmotionsData.NAME.GUM_3]: {
            action: OnSelfSprite,
            height: 48,
            frameTime: 0.120,
            offset: [0, 32]
        },
        [EmotionsData.NAME.GUM_4]: {
            action: OnSelfSprite,
            height: 48,
            frameTime: 0.120,
            offset: [0, 32]
        },
        [EmotionsData.NAME.KUCIAK]: {
            action: OnSelfSprite,
            height: 32,
            frameTime: 0.150,
            offset: [0, 0],
            filename: 'kuciak.png',
            stopAfterUse: 80
        },
        [EmotionsData.NAME.BIRD]: {
            action: OnSelfSprite,
            height: 32,
            frameTime: 0.085,
            offset: [0, 0],
            filename: 'ptaszek.png',
            loop: 8
        },

        [EmotionsData.NAME.EMO_SNOW]: {
            action: StickToMapSprite,
            height: 32,
            frameTime: 0.070,
            offset: [-32, 0]
        },
        [EmotionsData.NAME.GHOST]: {
            action: StickToMapSprite,
            height: 48,
            frameTime: 0.200,
            offset: [0, -45],
            loop: 3
        },
        [EmotionsData.NAME.WATER]: {
            action: StickToMapSprite,
            height: 64,
            frameTime: 0.125,
            offset: [0, -50],
            filename: 'water.png'
        },

        [EmotionsData.NAME.FACE_1]: {
            action: StickToPlayer,
            height: 48,
            frameTime: 0.070,
            offset: [-1, -15]
        },
        [EmotionsData.NAME.FACE_2]: {
            action: StickToPlayer,
            height: 48,
            frameTime: 0.070,
            offset: [-1, -15]
        },
        [EmotionsData.NAME.ROSE]: {
            action: StickToPlayer,
            height: 32,
            frameTime: 0.070,
            offset: [-1, 0],
            stopAfterUse: 1000
        },

        [EmotionsData.NAME.COCOS]: {
            action: CharToCharSprite,
            height: 32,
            frameTime: 0.200,
            offset: [0, -20]
        },
        [EmotionsData.NAME.EMO_HUG_1]: {
            action: CharToCharSprite,
            height: 32,
            frameTime: 0.200,
            offset: [0, -37]
        },
        [EmotionsData.NAME.EMO_HUG_2]: {
            action: CharToCharSprite,
            height: 32,
            frameTime: 0.200,
            offset: [0, -37]
        },
        [EmotionsData.NAME.EMO_HUG_3]: {
            action: CharToCharSprite,
            height: 32,
            frameTime: 0.200,
            offset: [0, -40]
        },
        [EmotionsData.NAME.GIFT]: {
            action: CharToCharSprite,
            height: 32,
            frameTime: 0.200,
            offset: [0, -10],
            stopAfterUse: 40
        },
        [EmotionsData.NAME.HOLLY]: {
            action: CharToCharSprite,
            height: 32,
            frameTime: 0.300,
            offset: [0, -40]
        },
        [EmotionsData.NAME.SNOWBALL]: {
            action: CharToCharSprite,
            height: 16,
            frameTime: 0.150,
            offset: [0, -20]
        },
        [EmotionsData.NAME.PILLOW]: {
            action: CharToCharSprite,
            height: 32,
            frameTime: 0.100,
            framesBeforeInTarget: 3,
            filename: 'poducha.gif'
        },

        [EmotionsData.NAME.FIRE_1]: {
            action: Fire,
            height: 48,
            frameTime: 0.075,
            offset: [0, -60]
        },
        [EmotionsData.NAME.FIRE_2]: {
            action: Fire,
            height: 48,
            frameTime: 0.075,
            offset: [0, -60]
        },
        [EmotionsData.NAME.FIRE_3]: {
            action: Fire,
            height: 48,
            frameTime: 0.075,
            offset: [2, -60]
        },
        [EmotionsData.NAME.FIRE_4]: {
            action: Fire,
            height: 48,
            frameTime: 0.075,
            offset: [2, -60]
        },
        [EmotionsData.NAME.FIRE_5]: {
            action: Fire,
            height: 48,
            frameTime: 0.075,
            offset: [-2, -60]
        },
        [EmotionsData.NAME.FIRE_6]: {
            action: Fire,
            height: 48,
            frameTime: 0.075,
            offset: [-2, -60]
        },
        [EmotionsData.NAME.FIRE_7]: {
            action: Fire,
            height: 48,
            frameTime: 0.075,
            offset: [-2, -60]
        },
        [EmotionsData.NAME.FIRE_8]: {
            action: Fire,
            height: 48,
            frameTime: 0.075,
            offset: [0, -60]
        },
        [EmotionsData.NAME.FIRE_9]: {
            action: Fire,
            height: 48,
            frameTime: 0.075,
            offset: [0, -37]
        },
        [EmotionsData.NAME.FIREWORKS]: {
            action: Fire,
            height: 48,
            frameTime: 0.120,
            offset: [0, -120],
            framesBeforeInTarget: 1,
            preLoop: true
        },

        [EmotionsData.NAME.STARS]: {
            action: OnSelfSprite,
            height: 32,
            frameTime: 0.120,
            filename: 'gwiazdki.gif',
            loop: 3
        },
        [EmotionsData.NAME.TERMOFOR]: {
            action: OnSelfSprite,
            height: 32,
            frameTime: 0.200,
            offset: [0, 0]
        },

        [EmotionsData.NAME.LANTERN_1]: {
            action: Lantern,
            height: 48,
            frameTime: 0.2,
            revert: true,
            stopAfterUse: 600
        },
        [EmotionsData.NAME.LANTERN_2]: {
            action: Lantern,
            height: 48,
            frameTime: 0.2,
            revert: true,
            stopAfterUse: 600
        },
        [EmotionsData.NAME.LANTERN_3]: {
            action: Lantern,
            height: 48,
            frameTime: 0.2,
            revert: true,
            stopAfterUse: 600
        },
        [EmotionsData.NAME.LANTERN_4]: {
            action: Lantern,
            height: 48,
            frameTime: 0.2,
            revert: true,
            stopAfterUse: 600
        },
        [EmotionsData.NAME.LANTERN_5]: {
            action: Lantern,
            height: 48,
            frameTime: 0.2,
            revert: true,
            stopAfterUse: 600
        },

        [EmotionsData.NAME.NO_EMO]: {
            action: Remover,
            clear: clearPlayersEmos
        },

        [EmotionsData.NAME.ZOMBIE]: {
            action: StickToMapGif,
            timeout: 1500,
            offset: [0, -15]
        },

        [EmotionsData.NAME.KISS_2]: {
            action: CharToCharGif,
            timeout: 8000,
            offset: [0, -30]
        }, //, modify:[0, -1]},

        [EmotionsData.NAME.KISS_1]: {
            action: BetweenPlayers,
            timeout: 8000
        },

        [EmotionsData.NAME.VISUAL_EFFECTS]: {
            action: ScriptEmo,
            filename: 'VisualEffects2'
        }
    };

    this.get = function(name) {
        var def = definitions[name];
        if (isset(def)) {
            return def;
        }
        return null;
    };


    //this.createReadyGifLoaded = function (name, path, loadedGifEmo) {
    //	//if (definitions[name].fillname
    //	var newName = definitions[name].filename ? definitions[name].filename : name;
    //	newName = /\.gif/.test(newName) ? newName.replace('.gif', '') : newName;
    //		var allP = path + newName + '.gif';
    //		gif.fetch(allP, false, function (f) {
    //			loadedGifEmo[name] = f;
    //		});
    //};
};