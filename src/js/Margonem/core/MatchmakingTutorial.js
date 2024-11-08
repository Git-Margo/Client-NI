var tpl = require('core/Templates');
var Storage = require('core/Storage');
module.exports = function() {
    /*
    p
    0 - left up
    1 - left down
    2 - right down
    */
    var self = this;
    var data;

    this.init = function() {
        this.initData();
        this.initTutorialStateInMMWnd();
    };

    this.initData = function() {
        /*
         p
         0 - left up cloud-tail
         1 - left down cloud-tail
         2 - right down cloud-tail
         */
        data = {
            id0: [{
                    p: 0,
                    t: '.matchmaking-tile.statistick',
                    h: self.tLang('progress-h'),
                    txt: self.tLang('tid0txt0')
                },
                {
                    p: 1,
                    t: '.matchmaking-tile.queue',
                    h: self.tLang('look-for-battle'),
                    txt: self.tLang('tid0txt1')
                },
                {
                    p: 2,
                    t: '.matchmaking-tile.history',
                    h: self.tLang('ranking'),
                    txt: self.tLang('tid0txt2')
                }
            ],
            id1: [{
                    p: 0,
                    t: '.stats-and-history .cards-header .card:first',
                    h: self.tLang('progress-wnd-h'),
                    txt: self.tLang('tid1txt0')
                },
                {
                    p: 2,
                    t: '.details-btn',
                    h: self.tLang('progress-wnd-h'),
                    txt: self.tLang('tid1txt2')
                },
                {
                    p: 2,
                    t: '.outfit-wrapper',
                    h: self.tLang('progress-wnd-h'),
                    txt: self.tLang('tid1txt3')
                },
                {
                    p: 2,
                    t: '.go-to-shop-btn',
                    h: self.tLang('progress-wnd-h'),
                    txt: self.tLang('tid1txt4')
                },
                {
                    p: 2,
                    t: '.progress-bar:first',
                    h: self.tLang('progress-wnd-h'),
                    txt: self.tLang('tid1txt5')
                },
                {
                    p: 2,
                    t: '.item-chest-slot:first',
                    h: self.tLang('progress-wnd-h'),
                    txt: self.tLang('tid1txt6')
                }
            ],
            id2: [{
                    p: 0,
                    t: '.stats-and-history .cards-header .card:nth-of-type(2)',
                    h: self.tLang('your-stats-h'),
                    txt: self.tLang('tid2txt0')
                },
                {
                    p: 2,
                    //t: '.stats-wnd .stats-table tr:first',
                    t: '.stats-wnd .stats-table',
                    h: self.tLang('your-stats-h'),
                    txt: self.tLang('tid2txt1')
                },
                {
                    p: 1,
                    //t: '.stats-wnd .stats-table tr:nth(1) td:first',
                    t: '.stats-wnd .stats-table',
                    h: self.tLang('your-stats-h'),
                    txt: self.tLang('tid2txt2')
                },
                {
                    p: 0,
                    //t: '.stats-wnd .stats-table tr:nth(1) td:nth(1)',
                    t: '.stats-wnd .stats-table',
                    h: self.tLang('your-stats-h'),
                    txt: self.tLang('tid2txt3')
                }
            ],
            id3: [{
                p: 2,
                t: '.stats-and-history .cards-header .card:nth-of-type(3)',
                h: self.tLang('battle-history-h'),
                txt: self.tLang('tid3txt0')
            }],
            id4: [{
                    p: 2,
                    t: '.stats-and-history .cards-header .card:nth-of-type(4)',
                    h: self.tLang('season-h'),
                    txt: self.tLang('tid4txt0')
                },
                {
                    p: 2,
                    t: '.reward-wrapper',
                    h: self.tLang('season-h'),
                    txt: self.tLang('tid4txt1')
                },
                {
                    p: 2,
                    t: '.reward-wrapper',
                    h: self.tLang('season-h'),
                    txt: self.tLang('tid1txt1')
                },
                {
                    p: 2,
                    t: '.winners-wrapper',
                    h: self.tLang('season-h'),
                    txt: self.tLang('tid4txt2')
                },
                {
                    p: 2,
                    t: '.your-season-record',
                    h: self.tLang('season-h'),
                    txt: self.tLang('tid4txt3')
                },
                {
                    p: 2,
                    t: '.your-career-record',
                    h: self.tLang('season-h'),
                    txt: self.tLang('tid4txt4')
                }
            ],
            id5: [{
                p: 2,
                t: '.matchmaking-ranking .cards-header-wrapper .cards-header .card:first',
                h: self.tLang('general-ranking-h'),
                txt: self.tLang('tid5txt0')
            }],
            id6: [{
                p: 2,
                t: '.matchmaking-ranking .cards-header-wrapper .cards-header .card:nth(1)',
                h: self.tLang('clan-ranking-h'),
                txt: self.tLang('tid6txt0')
            }],
            id7: [{
                p: 2,
                t: '.matchmaking-ranking .cards-header-wrapper .cards-header .card:nth(2)',
                h: self.tLang('friends-ranking-h'),
                txt: self.tLang('tid7txt0')
            }]
        };
    };

    this.initTutorialStateInMMWnd = function() {
        this.getTutorialState();
        if (this.getTutorialState()) Engine.matchmaking.wnd.$.find('.checkbox').addClass('active');
    };

    this.getLastStep = function(id) {
        var lastStep = Storage.get('MM_Tutorial/' + id);
        if (lastStep == null) {
            Storage.set('MM_Tutorial/' + id, -1);
            return -1;
        }
        return lastStep;
    };

    this.clearTutorial = function() {
        Storage.remove('MM_Tutorial');
    };

    this.setCloudWatchInStorage = function(id, step) {
        var last = data['id' + id].length <= step + 1;
        if (last) Storage.set('MM_Tutorial/' + id, 'watched');
        else Storage.set('MM_Tutorial/' + id, step);
    };

    this.createOverlayAndMarkObj = function($element) {
        //var $tutorialOverlay = $('<div>').addClass('matchmaking-tutorial-overlay');
        var $tutorialOverlay = tpl.get('matchmaking-tutorial-overlay');
        $element.addClass('tutorial-element-on-top');
        var position = $element.css('position');
        if (!(position == 'abosolute' || position == 'relative')) $element.addClass('add-relative');
        $tutorialOverlay.insertBefore($element);
    };

    this.removeOverlayAndMark = function() {
        Engine.matchmaking.wnd.$.find('.matchmaking-tutorial-overlay').remove();
        Engine.matchmaking.wnd.$.find('.tutorial-element-on-top').removeClass('tutorial-element-on-top add-relative');
        Engine.matchmaking.wnd.$.find('.tutorial-element-on-top').removeClass('tutorial-element-on-top');
    };

    this.createCloudTip = function(id, step, $element) {
        var $cloud = tpl.get('cloud-tip');
        var rec = data['id' + id][step];
        $('body').append($cloud);
        $cloud.attr('id', 'cloud-tip');
        $cloud.find('.header').html(rec.h);
        $cloud.find('.content').html(rec.txt);
        $cloud.find('.cloud-tail').addClass('pos-' + rec.p);
        $cloud.find('.close').click(function() {
            self.removeCloundAndOverlay();
        });
        $cloud.find('.next').click(function() {
            $element.unbind('click', self.clickMarkElement);
            self.removeCloundAndOverlay();
            self.setTutorialByIdQuick(id);
        });
        $element.bind('click', self.clickMarkElement);
        self.setCloudWatchInStorage(id, step);
    };

    this.clickMarkElement = function() {
        $(this).unbind('click', self.clickMarkElement);
        self.removeCloundAndOverlay();
    };

    this.nextStep = function(id, step) {
        if (!isset(data['id' + id][step])) return;
        self.setTutorialByIdQuick(id);
    };

    this.setTutorialById = function(id) {
        setTimeout(function() { //OMG! I'm NOBODY!
            self.setTutorialByIdQuick(id)
        }, 50);
    };

    this.checkCloudExist = function() {
        return $('#cloud-tip').length > 0;
    };

    this.setTutorialByIdQuick = function(id) {
        if (!self.getTutorialState()) return;
        if (self.checkCloudExist()) return;
        var step = self.getLastStep(id);
        if (step == 'watched') return;
        step++;
        var $element = Engine.matchmaking.wnd.$.find(data['id' + id][step].t);
        self.createOverlayAndMarkObj($element);
        self.createCloudTip(id, step, $element);
        self.setCloudPosition(id, step, $element);
        Engine.matchmaking.wnd.setWndOnPeak();
    };

    this.getTutorialState = function() {
        var data = Storage.get('MM_Tutorial/status');
        if (data === null) {
            Storage.set('MM_Tutorial/status', false);
            return false;
        }
        return data;
    };

    this.setCloudPosition = function(id, step, $element) {
        var l = $element.offset().left;
        var t = $element.offset().top;
        var $cloudTip = $('#cloud-tip');
        var left, top;
        var upMargin = 20;
        var downMargin = 30;
        switch (data['id' + id][step].p) {
            case 0:
                left = l + $element.width() / 2;
                top = t + $element.height() + upMargin;
                break;
            case 1:
                left = l + $element.width() / 2;
                top = t - $cloudTip.height() - downMargin;
                break;
            case 2:
                left = l + $element.width() / 2 - $cloudTip.width();
                top = t - $cloudTip.height() - downMargin;
                break;
        }
        $cloudTip.css({
            left: left,
            top: top
        });
    };

    this.removeCloud = function() {
        $('#cloud-tip').remove();
    };

    this.removeCloundAndOverlay = function() {
        this.removeCloud();
        this.removeOverlayAndMark();
    };

    this.tLang = function(name) {
        return _t(name, null, 'matchmaking-tutorial');
    };

    //this.init()

};