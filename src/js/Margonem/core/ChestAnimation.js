module.exports = function() {
    var self = this;
    var content;

    this.animation = false;

    this.init = function() {
        if (this.animation) {
            this.doAnimation();
        }
    };

    this.doAnimation = function() {
        this.initWindow();
        self.wnd.center();
    };

    this.initWindow = function() {
        Engine.windowManager.add({
            content: content,
            nameWindow: Engine.windowsData.name.CHESTS_ANIMATION,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('loot_choose', null, 'loot'),
            onclose: () => {
                this.close();
            }
        });
        this.wnd.addToAlertLayer();
    };

    this.close = function() {
        Engine.chestAnimation = false;
        self.wnd.remove();
        Engine.chests = false;
    };
};