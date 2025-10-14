var Templates = require('@core/Templates');
let SOUND_DATA = require('@core/sound/SoundData');

module.exports = function() {

    let $musicManager;

    const init = () => {
        initMusicManager();
        //this.initButtons();
        //this.attachVolumeMarkerDrag();
        //this.initSliderPos();
    };

    const initMusicManager = () => {
        //this.wnd.content(Templates.get('music-manager'));
        $musicManager = Templates.get('music-manager');
        //$('.game-window-positioner .settings-window').find('.music-manager-wrapper').append(this.$musicManager);
        //Engine.interface.get$gameWindowPositioner().find('.settings-window').find('.music-manager-wrapper').append(this.$musicManager);
    };

    const initButtons = ($settingWindow) => {
        // var data = Engine.soundManager.getData();

        let data = {
            quality: Engine.soundManager.getDataSettingQuality(),
            shuffle: Engine.soundManager.getDataSettingShuffle(),
            play: Engine.soundManager.getDataSettingPlay()
        };

        var $wrap1 = $musicManager.find('.quality-wrapper');
        var $wrap2 = $musicManager.find('.list-wrapper');
        var $wrap3 = $musicManager.find('.divide-wrapper');
        var str3 = ['HQ', 'LQ'];

        createToggleBtn(str3, $wrap1, data.quality == SOUND_DATA.QUALITY.HQ ? 1 : 0, hdOption);

        createToogleBckBut($wrap2, data.shuffle == true ? 1 : 0, ['random', 'queue'], random);
        createToogleBckBut($wrap3, data.play == true ? 1 : 0, ['play', 'pause'], musicPlayToggle);

        $settingWindow.find(".loudly-panel-buttons").remove();
        $settingWindow.find('.middle').append($musicManager);
    };

    const createToogleBckBut = ($par, bool, cl, clb) => {
        var $btn = Templates.get('button').addClass('green small');

        $btn.append($('<div>').addClass('add-bck'));
        $btn.find('.add-bck').addClass(cl[bool]);
        $btn.find('.label').html('0').css('visibility', 'hidden');
        $btn.tip(_t('music_' + cl[bool]));

        $btn.click(function() {
            bool = !bool;
            var opt = bool ? 1 : 0;
            var bck = $btn.find('.add-bck');
            bck.removeClass(cl.join(' '));
            $btn.find('.add-bck').addClass(cl[opt]);
            $btn.tip(_t('music_' + cl[opt]));
            clb(opt);
        });
        $par.append($btn);
    };

    const musicPlayToggle = (bool) => {
        //!bool ? Engine.soundManager.checkStop() : Engine.soundManager.checkStart();
        Engine.soundManager.musicPlayToggle();
    };

    const createToggleBtn = (label, $par, bool, clb) => {
        var $btn = Templates.get('button').addClass('green small');
        var on = bool;
        $btn.find('.label').html(label[bool]);
        $btn.tip(_t('music_' + label[bool].toLowerCase()));

        $btn.click(function() {
            on = !on;
            var opt = on ? 1 : 0;
            $btn.find('.label').html(label[opt]);
            $btn.tip(_t('music_' + label[opt].toLowerCase()));
            clb();
        });
        $par.append($btn);
    };

    //this.attachVolumeMarkerDrag = function () {
    //		var sm = Engine.soundManager;
    //		var $e = self.$musicManager.find('.volumeSlider .marker');
    //		$e.draggable({
    //			axis: 'x',
    //			stop: function () {
    //				var v = Math.abs(parseInt($e.css('left')) / 0.85);
    //				// sm.setVolume(v, 'song');
    //				sm.setVolumeWithSaveInServerStorage(v, SOUND_DATA.TYPE.MUSIC);
    //			},
    //			drag: function (event, ui) {
    //				var v = Math.abs(parseInt($e.css('left'))  / 0.85);
    //				// sm.setVolumeWithoutSave(v, 'song');
    //				sm.setVolumeWithoutSaveInServerStorage(v, SOUND_DATA.TYPE.MUSIC);
    //				var max = ui.helper.parent().width() - 22;
    //				if (ui.position.left < 0) ui.position.left = 0;
    //				if (ui.position.left > max) ui.position.left = max;
    //			}
    //		});
    //};

    //this.initSliderPos = function () {
    //	// var volume = Engine.soundManager.getData()['volume']['song'];
    //	let volume = Engine.soundManager.getDataSettingVolume(SOUND_DATA.TYPE.MUSIC)
    //	// console.log(volume)
    //	var $marker = self.$musicManager.find('.volumeSlider .marker');
    //	var left = volume * 0.85;
    //	$marker.css('left', left);
    //};

    const random = () => {
        Engine.soundManager.toggleShuffle();
    };

    const hdOption = () => {
        Engine.soundManager.toggleQuality();
    };

    //this.initContent = function () {
    //	tpl = Templates.get('music-manager');
    //	//$('.interface-layer .top.positioner').append(tpl);
    //	Engine.interface.getTopPositioner().append(tpl);
    //};

    //this.showDialog = function () {
    //
    //};
    //
    //this.close = function () {
    //		Engine.musicPanel = false;
    //		self.wnd.$.remove();
    //		//delete self;
    //};
    //
    //this.tLang = function (name) {
    //	return _t(name, null, 'sound');
    //};

    //this.init();

    this.init = init;
    this.initButtons = initButtons;
};