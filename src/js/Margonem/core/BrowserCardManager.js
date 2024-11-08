module.exports = function() {

    let chromeCardIsActive = true;

    const init = function() {
        initChromeCardEvent();
    };


    const setChromeCardActive = (state) => {
        chromeCardIsActive = state;
    };

    const getChromeCardActive = () => {
        return chromeCardIsActive;
    };

    const initChromeCardEvent = () => {
        document.addEventListener('visibilitychange', (event) => {
            if (document.hidden) {
                setChromeCardActive(false)
            } else {
                setChromeCardActive(true)
            }
        });
    }

    this.init = init;
    this.getChromeCardActive = getChromeCardActive;

};