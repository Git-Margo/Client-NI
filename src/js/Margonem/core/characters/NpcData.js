var EmotionsData = require('@core/emotions/EmotionsData');
let o = {
    BITS: {
        [EmotionsData.NAME.INKEEPER]: 0,
        [EmotionsData.NAME.AUCTION]: 1,
        [EmotionsData.NAME.MAIL]: 2,
        [EmotionsData.NAME.DEPO]: 3,
        [EmotionsData.NAME.DEPO_CLAN]: 4,
        [EmotionsData.NAME.SHOP]: 5,
        //[EmotionsData.NAME.DAILY_QUEST]   : 6,
        //[EmotionsData.NAME.NORMAL_QUEST]  : 7,
        [EmotionsData.NAME.HEAL]: 8
    },
    PRIORITY_EMO_MAP: null
};

o.PRIORITY_EMO_MAP = {
    [EmotionsData.NAME.MAIL]: 10,
    [EmotionsData.NAME.INKEEPER]: 20,
    [EmotionsData.NAME.DEPO_CLAN]: 30,
    [EmotionsData.NAME.AUCTION]: 40,
    [EmotionsData.NAME.DEPO]: 50,
    [EmotionsData.NAME.SHOP]: 60,
    [EmotionsData.NAME.HEAL]: 70,
    [EmotionsData.NAME.DAILY_QUEST]: 80,
    [EmotionsData.NAME.NORMAL_QUEST]: 90,
    [EmotionsData.NAME.NPC_TALK]: 100,
    [EmotionsData.NAME.AGGRESSIVE_1]: 101,
    [EmotionsData.NAME.AGGRESSIVE_2]: 102,
    [EmotionsData.NAME.ELITE_HERE]: 103,
};

o.GATE_URL = {
    "mas/exit-h64c.gif": true,
    "mas/exit.gif": true,
    "obj/cos.gif": true
}

o.DIFFICULTIES = ['', 'normal', 'hard', 'master'];


module.exports = o