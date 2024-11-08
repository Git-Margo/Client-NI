var ResolutionData = require('core/resolution/ResolutionData');

module.exports = function() {

    let resolutionData = {
        width: null,
        height: null
    };

    let resolutionKey = null;

    let moduleData = {
        fileName: "Resolution.js"
    };

    const init = () => {
        setResolution(ResolutionData.KEY._DEFAULT, true);
    };

    const setResolution = (_resolutionKey, clientInit) => {
        if (!resolutionIsCorrect(_resolutionKey)) return;

        setResolutionKey(_resolutionKey);
        setResolutionData();
        setResolutionWindows();

        if (!clientInit) getEngine().onResize();
    };

    const setResolutionData = () => {
        let w = ResolutionData.DATA[resolutionKey].w;
        let h = ResolutionData.DATA[resolutionKey].h;

        resolutionData.width = w;
        resolutionData.height = h;
    };

    const getResolutionData = () => {
        return {
            w: resolutionData.width,
            h: resolutionData.height
        }
    }

    const setResolutionKey = (_resolutionKey) => {
        resolutionKey = _resolutionKey;
    };

    const getResolutionKey = () => {
        return resolutionKey;
    }

    const resolutionIsCorrect = (_resolutionKey) => {
        if (!ResolutionData.KEY[_resolutionKey]) {
            errorReport(moduleData, "setResolution", "resolutionKey not exist!", _resolutionKey);
            return false;
        }

        return true;
    };

    const setResolutionWindows = () => {
        document.body.setAttribute("data-res", ResolutionData.RES[resolutionKey]);
    };

    this.init = init;
    this.setResolution = setResolution;
    this.getResolutionData = getResolutionData;
    this.getResolutionKey = getResolutionKey;

};