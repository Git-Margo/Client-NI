module.exports = function() {
    this.steps = [];
    this.times = [];
    this.append = function(pos) {
        this.steps.push(pos.x + ',' + pos.y);
        this.times.push(unix_time(false, true));
    };
    this.correct = function(x, y) {
        var idx = this.steps.indexOf(x + ',' + y);
        if (idx >= 0) this.steps = this.steps.splice(idx - 1);
    };
    this.slice = function(idx) {
        this.steps = this.steps.slice(idx);
        this.times = this.times.slice(idx);
    };

    this.checkAndSlice = function(pos) {
        var idx = null;
        for (var i = this.steps.length; i > 0; i--) {
            if (this.steps[i - 1] == pos.x + ',' + pos.y) {
                idx = i - 1;
                break;
            }
        }
        if (idx !== null) {
            this.slice(idx + 1);
            return true;
        }
        return false;
    };
    this.reset = function() {
        this.steps = [];
        this.times = [];
    };
    this.isStepsToSend = function() {
        return this.steps.length > 0;
    }
};