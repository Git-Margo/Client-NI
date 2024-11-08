const LegendaryNotificator = require('../../legendaryNotificator/LnManager');

module.exports = function() {
    let running = false;
    const confettiPackageUrl = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';

    function addScript(src) {
        const script = document.createElement('script');
        script.setAttribute('src', src);
        document.body.appendChild(script);
    }

    function removeScript(src) {
        const script = document.querySelector(`script[src='${src}']`);
        script.remove();
    }

    this.manageVisible = function() {
        Engine.legendaryNotificator.windowToggle();
    }

    this.start = function() {
        if (running) return;
        running = true;

        addScript(confettiPackageUrl);
        Engine.legendaryNotificator = new LegendaryNotificator.default();
    };

    this.stop = function() {
        if (!running) return;
        running = false;

        removeScript(confettiPackageUrl);
        Engine.legendaryNotificator.remove();
        Engine.legendaryNotificator = null;
    };

}