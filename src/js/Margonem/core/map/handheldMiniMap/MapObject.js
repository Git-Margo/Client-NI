module.exports = function() {

    let objRef = null;
    let mapImage = null;
    let dsa;

    function init() {

    }

    function updateData(objData) {
        setRef(objData);
        setImage();
    }

    function setRef(objData) {
        objRef = objData;
    }

    function setImage() {
        let src = objRef.src;
        Engine.imgLoader.onload(src, false, false, (i) => {

            let map = getEngine().map;

            if (map.isBackgroundOffsetExist()) {
                let backgroundOffset = map.getBackgroundOffset();
                let mapSize = map.getSize();
                mapImage = map.getRedrawImageWithBackgroundOffset(i, mapSize.x, mapSize.y, backgroundOffset.x, backgroundOffset.y);

            } else {
                mapImage = i;
            }

        })
    }

    function update() {

    }

    function clearMapImage() {
        mapImage = null;
    }

    function draw(ctx, dt) {
        if (!mapImage) return;

        let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;
        let handHeldMiniMapWindow = handHeldMiniMapController.getHandHeldMiniMapWindow();

        let scale = handHeldMiniMapWindow.getScale();
        let margin = handHeldMiniMapWindow.getMargin();
        let xMap = objRef.size.x * CFG.tileSize * scale;
        let yMap = objRef.size.y * CFG.tileSize * scale;

        ctx.save();
        ctx.filter = 'blur(0.3px)';

        ctx.drawImage(mapImage, margin.left, margin.top, xMap, yMap);

        ctx.restore();
    }

    function newdraw(ctx) {
        if (!mapImage) return;

        let handHeldMiniMapController = Engine.miniMapController.handHeldMiniMapController;
        let handHeldMiniMapWindow = handHeldMiniMapController.getHandHeldMiniMapWindow();

        let newScale = handHeldMiniMapWindow.getNewScale();
        let xMap = objRef.size.x * CFG.tileSize * newScale;
        let yMap = objRef.size.y * CFG.tileSize * newScale;

        let offset = handHeldMiniMapWindow.getNewOffset();

        let left = offset[0];
        let top = offset[1];

        ctx.save();
        ctx.filter = 'blur(0.3px)';

        ctx.drawImage(mapImage, left, top, xMap, yMap);

        ctx.restore();
    }

    this.init = init;
    this.setRef = setRef;
    this.clearMapImage = clearMapImage;
    this.draw = draw;
    this.updateData = updateData;
};