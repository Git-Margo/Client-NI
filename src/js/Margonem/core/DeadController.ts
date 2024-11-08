declare const API: any;

module.exports = class DeadController {

    constructor() {}

    public set(v: number) {
        if (!this.getEngine().dead) {
            this.getEngine().dead = true;
            this.getEngine().interface.get$gameLayer().find('.dead-overlay').show()
            this.getEngine().lock.add('dead');
        }
        this.updateCounter(v);
    }

    public unset(fade = true) {
        this.getEngine().dead = false;
        this.getEngine().hero.updateCollider();
        if (fade) {
            this.getEngine().interface.get$gameLayer().find('.dead-overlay').fadeOut();
        } else {
            this.getEngine().interface.get$gameLayer().find('.dead-overlay').hide();
        }
        this.getEngine().lock.remove('dead');
    }

    private updateCounter(v: number) {
        const
            sec = (v % 60),
            min = (v > 59) ? Math.floor(v / 60) : '',
            text = min !== '' ? `${min}min ${sec}s` : `${sec}s`;

        this.getEngine().interface.get$gameLayer().find('.dazed-time').text(text);
    }

    public update(v: number) {
        if (v > 0) {
            this.set(v);
        } else {
            if (this.getEngine().dead) {
                this.unset();
            }
        }
        //API.callEvent('heroDead', { id: this.getEngine().hero.d.id, nick: this.getEngine().hero.d.nick, sec: v });
        //if (this.getEngine.getInitLvl() == 2) {
        //debugger;
        if (this.getEngine().getInitLvl() == 2) {
            this.getEngine().questTracking.clearQuestTrackingDataAfterDie();
        }
        API.callEvent(this.getEngine().apiData.HERO_DEAD, {
            id: this.getEngine().hero.d.id,
            nick: this.getEngine().hero.d.nick,
            sec: v
        });
    }

    getEngine() {
        return Engine;
    }
}