module.exports = function() {
    let mouse_pos = {
        mapX: 0,
        mapY: 0,
        px: 0,
        py: 0,
        clientX: 0,
        clientY: 0
    };
    let draw = false;
    let running = false;
    let _self = this;

    //this.alwaysDraw = true;
    let alwaysDraw;

    this.start = function() {
        if (running) return;
        running = true;

        setAlwaysDraw(true);

        Engine.interface.get$GAME_CANVAS().on("mousemove", updateCords);
        //Engine.get$_canvas().on("mouseenter", setDraw);
        Engine.interface.get$GAME_CANVAS().on("mouseout", unsetDraw);

        API.addCallbackToEvent(Engine.apiData.HERO_MOVE, setCoordsPos);
        API.addCallbackToEvent(Engine.apiData.CALL_DRAW_ADD_TO_RENDERER, addToRenderer);
        //API.addCallbackToEvent("call_draw_update", this.update);
    }

    this.stop = function() {
        if (!running) return;
        running = false;

        Engine.interface.get$GAME_CANVAS().off("mousemove", updateCords);
        //Engine.get$_canvas().off("mouseenter", setDraw);
        Engine.interface.get$GAME_CANVAS().off("mouseout", unsetDraw);

        API.removeCallbackFromEvent(Engine.apiData.HERO_MOVE, setCoordsPos);
        API.removeCallbackFromEvent(Engine.apiData.CALL_DRAW_ADD_TO_RENDERER, addToRenderer);
    }

    function updateCords(e) {
        setPos(e);
        setCoordsPos();
    }

    function setDraw() {
        draw = true
    }

    function unsetDraw() {
        draw = false;
    }

    function checkOuterMap(map, currentX, currentY) {
        const {
            x,
            y
        } = map.d;

        if (currentX > x || currentY > y || currentX < 0 || currentY < 0) {
            unsetDraw();
        } else {
            setDraw();
        }
    }

    function setCoordsPos() {
        const off = Engine.interface.get$GAME_CANVAS().offset();
        const map = Engine.map;
        const emo = map.offset;
        const zoom = Engine.zoomManager.getActualZoom();

        mouse_pos.px = mouse_pos.clientX - off.left / zoom;
        mouse_pos.py = mouse_pos.clientY - off.top / zoom;

        mouse_pos.mapX = Math.floor((emo[0] + mouse_pos.px) / CFG.tileSize);
        mouse_pos.mapY = Math.floor((emo[1] + mouse_pos.py) / CFG.tileSize);

        checkOuterMap(map, mouse_pos.mapX, mouse_pos.mapY);

        // set tip position
        mouse_pos.tipPosX = mouse_pos.px - 55;
        mouse_pos.tipPosY = mouse_pos.py + 35;
    }

    function setPos(e) {
        mouse_pos.clientX = e.clientX;
        mouse_pos.clientY = e.clientY;
    }

    this.getOrder = () => {
        return 10000;
    }

    this.draw = (ctx) => {
        if (!draw) return;

        //ctx.save();
        ctx.fillStyle = "white";
        ctx.shadowColor = "black";
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 4;
        ctx.font = "14px Arimo";

        ctx.fillText(`(${mouse_pos.mapX}, ${mouse_pos.mapY})`, mouse_pos.tipPosX, mouse_pos.tipPosY);

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;

        //ctx.restore();
    }

    function addToRenderer() {
        Engine.renderer.add(_self);
    }

    const getAlwaysDraw = () => {
        return alwaysDraw
    };

    const setAlwaysDraw = (_alwaysDraw) => {
        alwaysDraw = _alwaysDraw
    };

    this.getAlwaysDraw = getAlwaysDraw;
    this.setAlwaysDraw = setAlwaysDraw;

}