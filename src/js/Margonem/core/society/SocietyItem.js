var tpl = require('core/Templates');
//var Chat = require('core/Chat');
//var Interface = require('core/Interface');
let SocietyData = require('core/society/SocietyData');
module.exports = function() {
    var self = this;

    this.init = function(d, kind, sortButton) {
        self.id = d[0];
        self.nick = d[1];
        self.kind = kind;

        self.setImgLevelProf(d, kind);
        self.setCityPosOnlineAgo(d);
        self.sortButton = sortButton;
    };

    this.setImgLevelProf = function(d, kind) {
        self.img = kind == SocietyData.KIND.WANTED ? d[8] : d[2];
        self.level = kind == SocietyData.KIND.WANTED ? d[6] : d[3];
        self.prof = kind == SocietyData.KIND.WANTED ? d[7] : d[4];
    };

    this.setCityPosOnlineAgo = function(d) {
        if (self.kind == SocietyData.KIND.FRIEND) {
            self.city = d[5];
            self.pos = {
                x: d[6],
                y: d[7]
            };
            self.online = d[8];
            self.ago = parseInt(d[9]);
        }

        if (self.kind == SocietyData.KIND.WANTED) {
            self.city = d[2];
            self.pos = {
                x: d[4],
                y: d[5]
            };
            self.online = SocietyData.STATE.ONLINE;
        }

        if (self.kind == SocietyData.KIND.ENEMY) self.ago = parseInt(d[5]);
    };

    this.newElement = function($c) {
        var $oP = tpl.get('one-person');
        $c.find('.list').append($oP);
        self.$ = $oP;
        self.createImg();
        self.createInfo();
        self.createLoc();
        self.createProfAndLevel();
        self.createOnline();
        self.createInviteButton();
        self.createChatToButton();
        self.createRemoveButton();
        self.createSortButtons();
        //self.createWantedButton();
    };

    this.createImg = function() {
        var name = CFG.a_opath + self.img;
        var img = self.$.find('.img-wrapper');
        createImgStyle(img, name);
    };

    this.createInfo = function() {
        var sInfo = self.nick;
        var who = self.$.find('.who');
        who.append(sInfo);
    };

    this.createProfAndLevel = function() {
        var $level = self.$.find('.lvl');
        $level.html(self.level + self.prof);
    };

    this.createOnline = function() {
        var $online = self.$.find('.online-text');
        if (self.kind == SocietyData.KIND.WANTED) {
            //$online.append(self.online).addClass('green');
            return;
        }
        if (self.online == 'offline' || !self.online) {
            if (self.kind == SocietyData.KIND.FRIEND) {
                self.online = _t('offline_from %time%', {
                    '%time%': calculateDiff(self.ago)
                }, 'default');
                $online.addClass('gray');
            } else {
                var enstate = [{
                        text: _t('active_sometime_ago', null, 'default'),
                        class: 'blue'
                    },
                    {
                        text: _t('active_fewdays_ago', null, 'default'),
                        class: 'gray'
                    },
                    {
                        text: _t('inactive_longtime', null, 'default'),
                        class: 'gray'
                    }
                ];
                self.online = enstate[self.ago].text;
                $online.addClass(enstate[self.ago].class);
            }
        } else {
            if (self.online == SocietyData.STATE.ONLINE) {
                // self.online = 'online';
                $online.addClass('green'); // online
            } else {
                self.online = SocietyData.STATE.ONLINE + ', ' + _t('unconscious', null, 'default');
                $online.addClass('blue'); // online but unconscious
            }
        }
        if (self.online.length > 22) {
            $online.tip(self.online, 't_static');
            self.online = self.online.slice(0, 22) + '...';
        }
        $online.append(self.online);
    };

    this.createLoc = function() {
        if (this.kind == SocietyData.KIND.ENEMY) return;
        var pos = "(" + self.pos.x + ", " + self.pos.y + ")";
        var $loc = self.$.find('.location');
        self.$.find('.cords').html(pos);
        var sLoc = escapeHTML(self.city);
        if (sLoc.length > 35) {
            $loc.tip(sLoc, 't_static');
            sLoc = sLoc.slice(0, 35) + '...';
        }
        $loc.html(sLoc);
    };

    this.createChatToButton = function() {
        if (self.kind != 'f') return;
        var $chat = tpl.get('button').addClass('small green');
        var $img = tpl.get('add-bck').addClass('chat');
        $chat.append($img);
        $chat.click(function() {
            //Engine.chat.replyTo(self.nick);
            //Engine.interface.focusChat();
            Engine.chatController.getChatInputWrapper().setPrivateMessageProcedure(self.nick);
        });
        this.$.find('.action-buttons').append($chat);
    };

    this.createInviteButton = function() {
        if (self.kind != SocietyData.KIND.FRIEND) return;
        var $invite = tpl.get('button').addClass('small green');
        //var $bck = $('<div>').addClass('add-bck invite-friend');
        var $bck = tpl.get('add-bck').addClass('invite-friend');
        this.$.find('.action-buttons').append($invite);
        $invite.append($bck);
        $invite.click(function() {
            _g('party&a=inv&id=' + self.id);
        });
    };

    this.createRemoveButton = function() {
        if (self.kind == 'w') return;
        var $x = tpl.get('button').addClass('small');
        var $butttons = self.$.find('.action-buttons');
        //var $img = $('<div>').addClass('bck remove');
        var $img = tpl.get('add-bck').addClass('remove');
        $x.append($img);
        $butttons.append($x);
        $x.click(function() {
            mAlert(_t('delete ' + self.kind + ' %person%', {
                '%person%': self.nick
            }), [{
                txt: _t('yes'),
                callback: function() {
                    _g("friends&a=" + self.kind + "del&id=" + self.id);
                    return true;
                }
            }, {
                txt: _t('no'),
                callback: function() {
                    return true;
                }
            }]);
        });
    };

    this.createSortButtons = function() {
        if (!this.sortButton) return;
        for (var i = 0; i < self.sortButton.length; i++)
            self.createSortB(self.sortButton[i]);
    };

    this.createWantedButton = function() {
        if (self.kind != SocietyData.KIND.WANTED) return;
        var t = [
            _t('hunt', null, 'pklist'),
            _t('stop_hunt', null, 'pklist')
        ];
        var $butttons = self.$.find('.action-buttons');
        var $toggleWanted = tpl.get('button').addClass('small green wanted-state');
        var watchList = Engine.wantedController.getWachList();
        var isW = watchList.indexOf(parseInt(self.id)) >= 0; //is wanted
        var str;
        if (isW) {
            str = t[1];
            $toggleWanted.addClass('on-list');
        } else {
            str = t[0];
            $toggleWanted.removeClass('on-list');
        }
        $toggleWanted.find('.label').html(str);
        $butttons.append($toggleWanted);
        $toggleWanted.click(function() {
            var state = Engine.wantedController.toggleWatch(parseInt(self.id));
            $toggleWanted.find('.label').html(t[state]);
            if (state) Engine.wantedController.getWantedList().openPanel();
        });
    };

    this.createSortB = function(name) {
        var $sort = tpl.get('button').addClass('small green');
        var $butttons = self.$.find('.sort-buttons');
        //var $img = $('<div>').addClass('bck ' + name);
        var $img = tpl.get('add-bck').addClass(name);
        $sort.append($img);
        $sort.append($img);
        $butttons.append($sort);
        $sort.click(function() {
            _g("friends&a=" + self.kind + name + "&id=" + self.id);
        });
    };
};