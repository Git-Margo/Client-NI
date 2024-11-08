module.exports = function() {
    var load = {};
    var progress = 0;

    this.load = function(name) {
        if (load[name] == true) return;
        load[name] = true;
        progress += 20;
        this.updateProgressBar();
    };

    this.updateProgressBar = function() {
        var $progressBar = Engine.interface.get$gameWindowPositioner().find('.loader-layer .progress-bar .inner');
        setPercentProgressBar($progressBar, progress);
        if (progress >= 100) {
            Engine.interface.lock.unlock('loader');
        }
    };
};