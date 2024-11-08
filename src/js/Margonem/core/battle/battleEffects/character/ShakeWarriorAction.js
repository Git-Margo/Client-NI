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

        if (data.data.params.delay) {

            let delay = data.data.params.delay * 1000;
            setTimeout(() => {
                this.startShake();
            }, delay)

        } else {
            this.startShake()
        }
    };

    this.startShake = () => {
        let warriorId = data.data.id;
        let $warriorIcon = Engine.battle.getWarrior(warriorId).$.find('.canvas-warrior-icon');

        interval = setInterval(() => {
            let top = Math.sin(Math.random()) * 10;
            let left = Math.sin(Math.random()) * 10;

            $warriorIcon.css({
                top: top,
                left: left
            });
        }, 50);

        timeout = setTimeout(() => {
            $warriorIcon.css({
                left: 0,
                top: 0
            });

            this.stop()

        }, data.data.params.duration * 1000);
    }

    this.stop = () => {
        clearInterval(interval);
        clearTimeout(timeout);
        // data.setFinish();

        actualRepeat++;

        Engine.battle.battleEffectsController.afterStopAction(this, actualRepeat, data);
    }


};