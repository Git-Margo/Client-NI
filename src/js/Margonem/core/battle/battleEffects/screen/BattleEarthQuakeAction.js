module.exports = function() {

    let interval;
    let timeout;
    let data;

    let actualRepeat = 1;

    this.init = () => {

    };

    this.updateData = (d) => {
        data = d;
    };

    this.start = () => {
        if (interval) this.stop();

        Engine.battle.$.css({
            'transform': 'scale(1.05)'
        });

        interval = setInterval(() => {
            let top = Math.sin(Math.random()) * 15;
            let left = Math.sin(Math.random()) * 15;

            Engine.battle.$.css({
                top: top,
                left: left
            });
        }, 50);

        timeout = setTimeout(() => {
            //clearInterval(interval);
            Engine.battle.$.css({
                transform: 'scale(1.0)',
                left: 0,
                top: 0
            });

            this.stop()

        }, data.data.params.duration * 1000);
    };

    this.stop = () => {
        clearInterval(interval);
        clearTimeout(timeout);

        actualRepeat++;

        Engine.battle.battleEffectsController.afterStopAction(this, actualRepeat, data);
    }

};