module.exports = function() {
    this.list = [];

    /* Adds element to lock list*/
    this.add = function(id) {
        //Engine.hero.autoPath.clear();
        Engine.hero.clearAutoPathOfHero();
        if (this.list.indexOf(id) < 0) this.list.push(id);

        Engine.stepsToSend.reset();
        Engine.hero.setHeroInLastServerPos();
    };

    /* Removes element from lock list */
    this.remove = function(id) {
        if (this.list.indexOf(id) >= 0) this.list.splice(this.list.indexOf(id), 1);
    };

    /* Checks if lock is active */
    this.check = function(name) {
        if (isset(name)) return this.list.indexOf(name) >= 0;
        return this.list.length > 0;
    }
};