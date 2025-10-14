let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');
const {
    roundToNextStep,
    roundToPrevStep
} = require('../HelpersTS');
const {
    secToParsedTime
} = require('@core/HelpersTS');
const npcClasses = {
    HEROES: 'HEROES',
    COLOSSUS: 'COLOSSUS',
    TITAN: 'TITAN'
}

module.exports = function() {

    let self = this;

    // START this shit to backward compatibility
    this.d = null;
    this.id = null;
    this.rx = null;
    this.ry = null;
    this.fw = null;
    this.fh = null;
    // END this shit to backward compatibility

    this.canvasObjectType = CanvasObjectTypeData.HEROES_RESP;

    //let onloadProperImg = false;
    let d;
    let frameAmount = 1;
    let activeFrame = 0;
    let halffw;
    let halffh;
    let frames;
    let sprite;

    const init = (_d) => {
        d = {
            nick: _d.nick,
            icon: _d.icon,
            lvl: _d.lvl,
            prof: _d.prof,
            kind: _d.kind,
            wt: _d.wt,
            resp: _d.resp,
            z: _d.z,
            x: _d.x,
            y: _d.y,
            id: _d.id
        }

        // START this shit to backward compatibility
        this.d = {
            id: _d.id,
            x: _d.x,
            y: _d.y
        };

        this.id = _d.id;
        this.rx = _d.x;
        this.ry = _d.y;
        // END this shit to backward compatibility

        if (d.icon) updateIcon();
    };

    //const getOnloadProperImg = () => {
    //    return onloadProperImg;
    //};

    const beforeOnload = (f, i) => {
        self.fw = f.hdr.width / frameAmount;
        self.fh = f.hdr.height;
        halffw = self.fw / 2;
        halffh = self.fh / 2;
        frames = f.frames;
        activeFrame = 0;
        sprite = i;
    };

    const afterOnload = () => {
        //onloadProperImg = true;
        self.setOnloadProperImg(true)
    };

    const fetchError = () => {

    };

    const update = (data) => {


    };

    const updateIcon = function() {

        let path = CFG.r_npath + d.icon;

        Engine.imgLoader.onload(path, {
                speed: false,
                externalSource: cdnUrl
            },
            (i, f) => {
                beforeOnload(f, i);
            },
            (i) => {
                afterOnload();
            },
            () => {
                fetchError();
            }
        );

    };

    const updateData = () => {

    };

    const draw = () => {

    };

    const remove = () => {

    };

    const getLvl = () => {
        return d.lvl;
    };

    const getKind = () => {
        return d.kind;
    };

    const getWt = () => {
        return d.wt;
    };

    const getNick = () => {
        return d.nick;
    };

    const getResp = () => {
        return d.resp;
    };

    const getIcon = () => {
        return d.icon;
    };

    const getClass = () => {
        let npcClass;
        const wt = getWt();
        if (wt > 99) npcClass = npcClasses.TITAN;
        else if (wt > 89) npcClass = npcClasses.COLOSSUS;
        else if (wt > 79) npcClass = npcClasses.HEROES;

        return npcClass;
    }

    const getFrameAmount = () => {
        return frameAmount;
    };

    const getPreparedResp = () => {
        let minResp = 0;
        let maxResp = 0;
        switch (getClass()) {
            case npcClasses.HEROES:
                minResp = roundToPrevStep(d.resp * 0.5 / Engine.worldConfig.getNpcResp(), 1);
                maxResp = roundToNextStep(d.resp * 1.5 / Engine.worldConfig.getNpcResp(), 1);
                break;
            case npcClasses.TITAN:
                minResp = roundToPrevStep(d.resp * 0.75 / Engine.worldConfig.getNpcResp(), 1);
                maxResp = roundToNextStep(d.resp * 1.25 / Engine.worldConfig.getNpcResp(), 1);
                break;
            default:
                errorReport('HeroesResp.js', 'getPreparedResp', 'Unknown npc class');
        }
        const options = {
            showDays: false,
            showSec: false
        }
        return `${secToParsedTime(minResp * 60, options)} - ${secToParsedTime(maxResp * 60, options)}`;
    };

    const getLvlRanges = () => {
        if (getClass() === npcClasses.TITAN) return false;

        const respLvl = this.getLvl();
        const respKind = this.getKind();
        const dropDestroyLvl = Engine.worldConfig.getDropDestroyLvl();

        if (respKind === 0) {
            if (respLvl > 250) return [respLvl - 50, '-'];
            if (respLvl > 100) return [respLvl - 50, respLvl + dropDestroyLvl];
            return [respLvl / 2, respLvl + dropDestroyLvl];
        }

        if (respKind === 1 || respKind === 2) return [respLvl / 2, '-'];

        return false;
    }

    const getPreparedLvlRanges = () => {
        if (getClass() === npcClasses.TITAN) return false;

        const [min, max] = this.getLvlRanges();

        return `${Math.floor(min)} lvl - ${max === '-' ? _t('no-limitations') : max + ' lvl'}`;
    }

    const getData = () => {
        return {
            d
        };
    }

    this.init = init;
    //this.getOnloadProperImg     = getOnloadProperImg;
    this.getKind = getKind;
    this.getLvl = getLvl;
    this.getWt = getWt;
    this.getClass = getClass;
    this.getResp = getResp;
    this.getNick = getNick;
    this.getFrameAmount = getFrameAmount;
    this.getIcon = getIcon;
    this.getData = getData;
    this.getPreparedResp = getPreparedResp;
    this.getLvlRanges = getLvlRanges;
    this.getPreparedLvlRanges = getPreparedLvlRanges;
    this.updateData = updateData;
}