var Storage = require('core/Storage');

module.exports = function() {

    this.ctx = null;
    this.active = false;
    this.canvas = null;
    this.target = null;
    this.focusCollider = null;
    this.val = 0;
    this.maxVal = 3.14;
    this.alpha = 1;
    this.blink = false;
    this.glow = false

    this.init = function() {

    };

    this.update = (dt) => {
        if (!this.active) return;

        if (this.blink) {
            this.val += dt;
            if (this.val > this.maxVal) this.val = 0;
            this.alpha = Math.round(Math.sin(this.val) * 100) / 100;
        }
    };

    this.draw = () => {
        if (!this.active) return;

        this.drawOverlay();
        if (this.glow) this.setGlow();
        this.drawMask();
    };

    this.getProportionalVal = (normalVal) => {

        if (Engine.zoomFactor != null) return normalVal / (Engine.zoomFactor / 1);
        if (!mobileCheck()) return normalVal;

        let zoomFactor = Storage.get('ZoomFactor');
        if (zoomFactor != null) return normalVal / (zoomFactor / 1);

        return normalVal;
    };

    this.createCanvas = () => {
        let w = this.getProportionalVal(window.innerWidth);
        let h = this.getProportionalVal(window.innerHeight);

        this.canvas = $('<canvas>').attr({
            width: w,
            height: h
        });

        this.ctx = this.canvas[0].getContext('2d');

        this.canvas.addClass('tutorial-overlay');
        this.canvas.css({
            position: 'absolute',
            left: 0,
            top: 0,
            opacity: 0.5
        });

        if (mobileCheck()) this.canvas.css('pointer-events', 'none');

        //Engine.interface.addToGameWindowPositioner(this.canvas);
        Engine.interface.get$tutorialLayer().before(this.canvas)
        this.canvas.css('z-index', 12);
    };

    this.drawOverlay = () => {
        let w = this.canvas[0].width;
        let h = this.canvas[0].height;
        this.ctx.clearRect(0, 0, w, h);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, w, h);
    };

    this.htmlFocusMouseEventsInit = () => {
        //$(document).on('touchStart', this.mouseDown);
        //$(document).on('touchstart', this.mouseDown);
        //$(document).on('touchstart', this.mouseDown2);
        //document.ontouchstart = this.mouseDown;
        //$(document).mousedown(this.mouseDown);
        $(document).mouseenter(this.mouseEnter);
        $(document).mousemove(this.mouseMove);
        $(document).mouseout(this.mouseOut);
    };

    this.htmlFocusMouseEventsRemove = () => {
        //$(document).off('touchStart', this.mouseDown);
        //$(document).off('mousedown', this.mouseDown);
        $(document).off('mouseenter', this.mouseEnter);
        $(document).off('mousemove', this.mouseMove);
        $(document).off('mouseout', this.mouseOut);
    };

    this.collideWithMask = (e) => {

        let clientX = e.clientX;
        let clientY = e.clientY;

        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        let axisX = this.focusCollider[0] < clientX && clientX < this.focusCollider[2];
        let axisY = this.focusCollider[1] < clientY && clientY < this.focusCollider[3];

        if (e.touches) {
            e.stopPropagation();
        }

        return axisX && axisY;
    };

    this.manageCanvasPointerEvents = (e) => {
        let $overlay = $('.tutorial-overlay');

        if (this.collideWithMask(e) || mobileCheck()) $overlay.css('pointer-events', 'none');
        else $overlay.css('pointer-events', 'auto');
    };

    this.mouseMove = (e) => {
        this.manageCanvasPointerEvents(e);
    };

    this.mouseOut = (e) => {
        this.manageCanvasPointerEvents(e);
    };

    this.mouseEnter = (e) => {
        this.manageCanvasPointerEvents(e);
    };

    this.mouseDown = (e) => {
        console.log('mouseDown1', e.target, this.collideWithMask(e));
        this.manageCanvasPointerEvents(e);
    };

    this.mouseDown2 = (e) => {
        console.log('mouseDown2', e.target, this.collideWithMask(e));
        this.manageCanvasPointerEvents(e);
    };


    this.create = ($element, glow, blink) => {
        this.addTarget($element);
        this.createCanvas();
        this.htmlFocusMouseEventsInit();
        this.drawOverlay();

        //Engine.lock.add('htmlFocus');

        this.setBlink(blink);
        this.alpha = 1;
        this.glow = glow;

        let w = this.target.width();
        let h = this.target.height();
        let pos = this.target.offset();
        let left = this.getProportionalVal(pos.left);
        let top = this.getProportionalVal(pos.top);

        this.createFocusCollider(left, top, w, h);

        if (this.glow) this.setGlow();
        this.drawMask();

        this.setActive(true);
    };

    this.setBlink = (state) => {
        this.blink = state ? true : false;
    };

    this.drawMask = () => {
        let left = this.focusCollider[0];
        let top = this.focusCollider[1];
        let width = this.focusCollider[4];
        let height = this.focusCollider[5];

        this.ctx.save();
        this.ctx.globalCompositeOperation = "xor";
        this.ctx.fillRect(left, top, width, height);
        this.ctx.fill();
        this.ctx.restore();
    };

    this.createFocusCollider = (left, top, width, height) => {
        this.focusCollider = [
            left,
            top,
            left + width,
            top + height,
            width,
            height
        ];
    };

    this.setGlow = () => {

        let left = this.focusCollider[0];
        let top = this.focusCollider[1];
        let w = this.focusCollider[4];
        let h = this.focusCollider[5];

        let margin = 0;
        this.ctx.save();

        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = "#3ed1de";
        this.ctx.fillStyle = "#3ed1de";
        this.ctx.shadowColor = "#3ed1de";


        this.ctx.globalAlpha = this.alpha;
        this.ctx.shadowBlur = 50;

        this.ctx.strokeRect(left - margin, top - margin, w + margin * 2, h + margin * 2);

        this.ctx.fillRect(left - margin, top - margin, w + margin * 2, h + margin * 2);
        this.ctx.fillRect(left - margin, top - margin, w + margin * 2, h + margin * 2);
        this.ctx.fillRect(left - margin, top - margin, w + margin * 2, h + margin * 2);
        this.ctx.fillRect(left - margin, top - margin, w + margin * 2, h + margin * 2);

        this.ctx.restore();
    };

    this.setActive = (active) => {
        this.active = active;
    };

    this.getActive = () => {
        return this.active;
    };

    this.getCanvasFocus = () => {
        return this.active ? [this] : [];
    };

    this.addTarget = ($element) => {
        this.target = $element;
    };

    this.clearTarget = () => {
        this.target = null;
    };

    this.clearCanvas = () => {
        this.canvas.remove();
        this.canvas = null;
    };

    this.clearFocusCollider = () => {
        this.focusCollider = null;
    };

    this.removeOverlayAndTarget = () => {
        if (!this.getActive()) return;

        //Engine.lock.remove('htmlFocus');

        this.clearTarget();
        this.clearCanvas();
        this.clearFocusCollider();
        this.htmlFocusMouseEventsRemove();
        this.setBlink(false);
        this.setActive(false);
    };
};