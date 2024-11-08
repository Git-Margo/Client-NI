let HandHeldMiniMapData = require('core/map/handheldMiniMap/HandHeldMiniMapData');
module.exports = function() {

    let list = {
        [HandHeldMiniMapData.STATIC_ICONS.SQUARE]: {},
        [HandHeldMiniMapData.STATIC_ICONS.CIRCLE]: {},
        [HandHeldMiniMapData.STATIC_ICONS.RHOMB]: {}

    };

    function init() {

    }

    function addImageObject(image, shape, size, color) {
        if (!isset(list[shape][size])) list[shape][size] = {};
        list[shape][size][color] = image;
    }

    function checkImageObjectExist(shape, size, color) {
        if (!isset(list[shape][size])) return false;
        if (!isset(list[shape][size][color])) return false;

        return true;
    }

    function getImageObject(shape, size, color) {
        return list[shape][size][color];
    }


    this.init = init;
    this.addImageObject = addImageObject;
    this.checkImageObjectExist = checkImageObjectExist;
    this.getImageObject = getImageObject;


};