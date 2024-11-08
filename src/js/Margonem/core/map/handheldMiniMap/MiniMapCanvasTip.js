module.exports = function() {
    var $_canvas;

    this.init = function() {
        $_canvas = $('.handheld-mini-map-canvas');
    };

    this.show = function(e, o) {
        $_canvas.tip(null);
        let tip = o.getTip();

        if (!tip) {
            console.warn('tipNotExist', o.getRef());
            return
        }

        $_canvas.tip(tip[0], tip[1], null, tip[2]);
        $_canvas.tipShow(e, o);
    };

    this.hide = function(e) {
        $_canvas.tip(null);
        $_canvas.tipHide(e);
    }
};