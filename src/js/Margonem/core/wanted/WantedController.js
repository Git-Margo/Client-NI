/**
 * Created by Michnik on 2015-04-21.
 */

var Storage = require('core/Storage');
var Chat = require('core/Chat');
var Character = require('core/characters/Character');
var WantedList = require('core/wanted/WantedList');

var WantedController = function() {
    var self = this;
    var list = null;
    var watchList = [];
    var miniPos = 0; // 0 - bottom, 1 top
    var firstParse = null;
    var wantedList = null;

    this.init = function() {
        this.getSettings();
        this.initWantedList();
    };

    this.initWantedList = function() {
        wantedList = new WantedList();
        wantedList.init();
    };

    this.toggleWatch = function(id) {
        id = parseInt(id);
        if (watchList.indexOf(id) < 0) {
            this.addToWatch(id);
            return 1;
        } else {
            this.removeFromWatch(id);
            return 0;
        }
    };

    this.addToWatch = function(id) {
        var limit = 10;
        var added = false;
        if (watchList.indexOf(id) < 0 && watchList.length >= limit) {
            for (var i = 0; i < watchList.length; i++) {
                if (!isset(list[watchList[i]])) {
                    watchList.splice(i, 1, id);
                    added = true;
                    break;
                }
            }
        } else if (watchList.indexOf(id) < 0) {
            watchList.push(parseInt(id));
            added = true;
        }
        if (added) {
            this.saveSettings();
            this.updateHuntedList();
        } else message(this.tLang('observed_limi_reached'));
    };

    this.addAllToWatch = () => {
        if (list == null)
            return;
        var wantedList = Object.keys(list);
        var watchList = self.getWachList();
        for (let i = 0; i < wantedList.length; i++) {
            if (watchList.indexOf(parseInt(wantedList[i])) < 0) {
                self.addToWatch(wantedList[i]);
            }
        }
    };

    this.removeFromWatch = function(id) {
        if (watchList.indexOf(id) >= 0) watchList.splice(watchList.indexOf(id), 1);
        this.saveSettings();
        this.updateHuntedList();
    };

    this.getList = function() {
        return list;
    };

    this.lvl = function(val) {
        Chat.sendMessage('/lvl ' + val);
    };

    this.updateHuntedList = function() {
        //console.log(list);
        wantedList.wnd.$.find('.scroll-pane').find('.one-wanted').remove();
        if (list.length <= 0) {
            wantedList.setVisibleEmptyRecord();
            return;
        }
        for (var i in list) {
            wantedList.update(i, list[i]);
        }
        wantedList.setVisibleEmptyRecord();
        wantedList.setSize();
    };

    this.getWantedList = function() {
        return wantedList;
    };

    this.updateList = function(data) {
        if (lengthObject(data) < 1) return;
        this.getSettings();
        //if (isset(data)) this.parse(data);
        list = {};
        for (var k in data) {
            list[k] = data[k];
        }
        //self.addAllToWatch();
        this.updateHuntedList();
    };

    this.parse = function(data) {
        if (data != '') {
            var data2 = data.split(';');
            var tmp = null;
            list = {};
            for (var i = 0; i < data2.length; i++) {
                tmp = data2[i].split(',');
                list[tmp[0]] = tmp;
            }
        } else list = null;
        firstParse = true;
    };

    this.getSettings = function() {
        var cfg = Storage.get('pkWatch');
        if (!cfg) return;
        cfg = cfg.split('|');
        miniPos = parseInt(cfg[1]);
    };

    this.saveSettings = function() {
        Storage.set('pkWatch', '0|' + miniPos);
    };

    this.getWachList = function() {
        return watchList;
    };

    this.tLang = function(name) {
        return _t(name, null, 'pklist');
    };

    //this.init();

};

// var Glow = function () {
//
// 	var self = this;
// 	this.master = null;
// 	this.d = {};
//
// 	var drawLock = new Lock(['image', 'master'], function () {
// 		self.rx = self.master.rx - 0.025;
// 		self.ry = self.master.ry + 0.2;
// 		self.d.x = self.master.d.x;
// 		self.d.y = self.master.d.y;
// 		self.imgLoaded = true;
// 	});
//
// 	this.getOrder = function () {
// 		return self.master.ry - 1;
// 	};
//
// 	this.update = function () {
// 		this.rx = self.master.rx - 0.025;
// 		this.ry = self.master.ry + 0.2;
// 		this.d.x = self.master.d.x;
// 		this.d.y = self.master.d.y;
// 	};
//
// 	this.afterUpdate = function () {
// 		var img = new Image();
// 		img.src = '../img/glow-52.png';
// 		img.onload = function () {
// 			self.frame = 0;
// 			self.fw = img.width;
// 			self.fh = img.height;
// 			self.img = this;
// 			drawLock.unlock('image');
// 		};
// 	};
//
// 	this.onUpdate = new (function () {
// 		this.master = function (val) {
// 			self.master = val;
// 			drawLock.unlock('master');
// 		};
// 	})();
//
// };

// Glow.prototype = Object.create(Character.prototype);

module.exports = {
    WantedController: WantedController,
    // Glow: Glow
};