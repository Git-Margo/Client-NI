const sexModify = (data, gender = Engine.hero.isMan()) => {
    let sexModify = data.match(/\[SEX\=(.*?)\]/g);
    if (sexModify) {
        for (let k in sexModify) {
            let fullStr = sexModify[k];
            let index = gender ? 0 : 1;
            let stringToCheck = fullStr.replace('[SEX=', '').replace(']', '');
            let strByGender = stringToCheck.split('|')[index];

            data = data.replace(fullStr, strByGender);
        }
    }

    return data
};

const nickUppercase = (text) => {
    return text.replace(/\[NICK_UPPERCASE\]/, Engine.hero.d.nick.toUpperCase());
};

const nick = (text) => {
    return text.replace(/\[NICK\]/, Engine.hero.d.nick);
};

const parseText = (text) => {
    if (!isHeroAlreadyInitialised()) return text;

    text = sexModify(text);
    text = nickUppercase(text);
    text = nick(text);
    return text;
}
module.exports = {
    sexModify,
    nickUppercase,
    parseText
};