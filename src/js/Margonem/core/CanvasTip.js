module.exports = function() {
    var $_canvas;

    this.init = function() {
        $_canvas = Engine.interface.get$GAME_CANVAS();
    };

    this.show = function(e, o) {
        $_canvas.tip(null);
        $_canvas.tip(o.tip[0], o.tip[1], null, o.tip[2]);
        $_canvas.tipShow(e, o);
    };

    this.hide = function(e) {
        //console.log('hide');
        $_canvas.tip(null);
        $_canvas.tipHide(e);
    }
};