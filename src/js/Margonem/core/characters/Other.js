/**
 * Created by lukasz on 12.09.14.
 */
var Character = require('core/characters/Character');
var SocietyData = require('core/society/SocietyData');
var Pet = require('core/Pet');
//var WantedController = require('core/wanted/WantedController');
var Chat = require('core/Chat');
var ShowEq = require('core/showEq/ShowEq');
var ColorMark = require('core/ColorMark');
var WhoIsHereGlow = require('core/whoIsHere/WhoIsHereGlow2');
//var FollowGlow = require('core/glow/FollowGlow');
var FollowController = require('core/FollowController');
var EmotionsData = require('core/emotions/EmotionsData');
let CanvasObjectTypeData = require('core/CanvasObjectTypeData');
let HeroDirectionData = require('core/characters/HeroDirectionData');
const {
    showProfile
} = require('../HelpersTS');
const OthersContextMenuData = require('core/characters/OthersContextMenuData');
const CharacterAura = require('core/CharacterAura');

var Other = function() {
    var self = this;
    var ranks = [_t('admin', null, 'ranks'), _t('super_mg', null, 'ranks'), _t('mg', null, 'ranks'), _t('chat_mod', null, 'ranks'), _t('super_chat_mod', null, 'ranks')];
    this.d = {};
    this.inMove = false;
    this.isPlayer = true;
    this.frame = 0;
    this.frames = null;
    this.collider = null;
    // this.canvasObjectType = 'Other';
    this.canvasObjectType = CanvasObjectTypeData.OTHER;
    this.overMouse = false;
    //this.onSelfEmoList = [];
    this.onSelfMarginEmo = 0;
    var drawLock = new Lock(['create', 'image'], function() {
        //self.draw();
    });
    this.$ = $('<div class="other character"></div>');

    let dynamicHoleImg;

    //var dirMapping = ['S', 'W', 'E', 'N'];
    var dirMapping = [HeroDirectionData.S, HeroDirectionData.W, HeroDirectionData.E, HeroDirectionData.N];
    var speed = 5;
    var frameTime = 0;
    var timePassed = 0;
    let kind = null;

    let followController = null;

    this.init = () => {
        initFollowController();
        self.createPlaceHolderCharacter();
        self.initOnSelfEmoList();
        self.initDataDrawer();
        //initDynamicHoleImg()
    };

    const initFollowController = () => {
        followController = new FollowController();
        followController.init(getEngine().hero, this);
    };

    this.getFollowController = function() {
        return followController
    };

    this.update = function(dt) {

        if (!Engine.allInit) return

        this.changeWarShadowOpacity(dt);
        this.inMove = false;
        if (isset(this.pet)) this.pet.update(dt);
        if (this.rx != this.d.x || this.ry != this.d.y) {
            //if (isset(this.pet)) this.pet.unlock();
            this.inMove = true;
            var l = dt * speed;
            frameTime += l;
            if (this.rx < this.d.x) {
                this.rx += l;
                if (this.rx > this.d.x) {
                    this.rx = this.d.x;
                }
            } else if (this.rx > this.d.x) {
                this.rx -= l;
                if (this.rx < this.d.x) {
                    this.rx = this.d.x;
                }
            }
            if (this.ry < this.d.y) {
                this.ry += l;
                if (this.ry > this.d.y) {
                    this.ry = this.d.y;
                }
            } else if (this.ry > this.d.y) {
                this.ry -= l;
                if (this.ry < this.d.y) {
                    this.ry = this.d.y;
                }
            }
            //if (isset(this.wantedGlow)) this.wantedGlow.update();
            if (isset(this.colorMark)) this.colorMark.update();
            if (isset(this.whoIsHereGlow)) this.whoIsHereGlow.update();
            //if (isset(this.followGlow)) this.followGlow.update();

            if (followController.checkFollowGlow()) followController.getFollowGlow().update();


            //if (isset(this.playerCatcher)) this.playerCatcher.update();
        } else if (this.frame != 0) {
            this.frame = 0;
        }
        // else {
        //	this.animate(dt);
        //}
        this.animate(dt);

        if (frameTime >= 0.5) {
            this.frame++;
            frameTime = frameTime % 0.5;
            if (this.frame == 4) this.frame = 0;
        }

        if (self.matchmakingChampionAura) {
            self.matchmakingChampionAura.update();
        }

        if (self.wanted) {
            self.wanted.update();
        }

        this.updateCollider();
        self.getDataDrawer().update(dt);
    };

    this.animate = function(dt) {
        if (this.frames && this.frames.length > 1 && dt) {
            timePassed += dt * 100;
            if (this.frames[this.activeFrame].delay < timePassed) {
                timePassed = timePassed - this.frames[this.activeFrame].delay;
                this.activeFrame = (this.frames.length == this.activeFrame + 1 ? 0 : this.activeFrame + 1);
            }
        }
    };

    // this.updateCollider = function () {
    // 	this.collider = {
    // 		box: [
    // 			self.rx * 32 + 16 - self.fw / 2,
    // 			self.ry * 32 + 32 - self.fh,
    // 			self.rx * 32 + 16 + self.fw / 2,
    // 			self.ry * 32 + 32
    // 		]
    // 	};
    // };

    this.delete = function(animation) {
        //API.callEvent('removeOther', self);
        API.callEvent(Engine.apiData.REMOVE_OTHER, self);
        if (self.colorMark && self.colorMark.color == 'red') Engine.hero.markOtherObj = null;
        Engine.others.removeOne(self.d.id, animation);
        Engine.emotions.removeAllFromSourceId(self.d.id);
    };

    const firstAfterUpdate = () => {
        //setKind(getEngine().others.findKindOther(this));
        //self.getDataDrawer().initOrder();
    }

    const refreshKind = () => {
        setKind(getEngine().others.findKindOther(this));
    }

    const clearDataToDrawIfKindChange = (tempKind) => {
        if (tempKind == kind) {
            return;
        }

        this.clearDataToDraw();
    }

    const manageRefreshKind = () => {
        let tempKind = kind;
        refreshKind();
        clearDataToDrawIfKindChange(tempKind);
    }

    const updateDataMatchmakingChampion = (data) => {

        let createData = data.action && data.action == "CREATE";

        if (!createData) {
            return;
        }

        if (data.wanted) {
            return;
        }

        if (!self.matchmakingChampionAura && data.matchmaking_champion) {
            createChampion(this)
        }
    };

    const createChampion = (parent) => {
        self.matchmakingChampionAura = new CharacterAura();
        self.matchmakingChampionAura.init(parent);
    };

    const createActionFunc = () => {
        self.wanted = null;
        self.d.wanted = null;
        self.matchmakingChampionAura = null;

        delete self.d.matchmaking_champion;
    }

    this.beforeUpdate = (val) => {

        if (val.action) {
            if (val.action == "CREATE") {
                createActionFunc()
            }
        }
    }

    this.afterUpdate = function(val, oldData) {
        if (isset(val.icon) && !isset(val.pet) && isset(this.pet)) this.deletePet();
        if (isset(this.d.del)) return this.delete();

        updateDataMatchmakingChampion(val);

        //if (isset(val.relation) || val.wanted || oldData.wanted && !val.wanted) {
        //
        //}

        //let tempKind = kind;
        //refreshKind();
        //
        //clearDataToDrawIfKindChange(tempKind);

        manageRefreshKind();

        if (!isset(this.rx) || !isset(this.ry)) {
            this.rx = this.d.x;
            this.ry = this.d.y;
        } else {
            var diffX = this.rx - this.d.x;
            var diffY = this.ry - this.d.y;

            if (diffX < -2) this.rx = this.d.x - 2;
            if (diffX > 2) this.rx = this.d.x + 2;
            if (diffY < -2) this.ry = this.d.y - 2;
            if (diffY > 2) this.ry = this.d.y + 2;

        }
        if (isset(this.pet)) this.pet.calculatePosition();

        if (drawLock.check().length) drawLock.unlock('create');

        //var tip = '';
        //if (self.rights) {
        //	var rank = -1;
        //	if (self.rights & 1) rank = 0;
        //	else if (self.rights & 16) rank = 1;
        //	else if (self.rights & 2) rank = 2;
        //	else if (self.rights & 4) rank = 4;
        //	else rank = 3;
        //
        //	//tip += '<div class="rank"><div class="con">' + ranks[rank] + '</div></div>';
        //	tip += '<div class="rank">' + ranks[rank] + '</div>';
        //}
        //if (isset(self.d.guest) && parseInt(self.d.guest)) tip += '<div class="rank">' + _t('deputy') + '</div>';
        //
        //tip += self.setTipHeader(self);
        //
        //if (isset(self.wanted) && parseInt(self.wanted) == 1) tip += '<div class=wanted></div>'; //Poszukiwany<br/>listem goÅczym
        //if (self.d.clan != '') tip += '<div class="clan-in-tip">' + self.d.clan + '</div>';// + '</div><div class="line"></div>';
        //tip += self.setBuffsSections();


        this.tip = [self.createStrTip(), 't_other', {
            borderColor: self.whoIsHere
        }];
        if (isset(this.petLock)) this.petLock.unlock('petUpdate');

        // if (self.wanted && !isset(self.wantedGlow)) {
        // 	self.wantedGlow = new WantedController.Glow();
        // 	self.wantedGlow.updateDATA({master: self});
        // }

        this.updateWhoIsHereGlow();
    };

    this.tipUpdate = function() {
        this.tip = [self.createStrTip(), 't_other', {
            borderColor: self.whoIsHere
        }];
    };

    this.createStrTip = function() {
        var tip = '';
        if (self.rights) {
            var rank = -1;
            if (self.rights & 1) rank = 0;
            else if (self.rights & 16) rank = 1;
            else if (self.rights & 2) rank = 2;
            else if (self.rights & 4) rank = 4;
            else rank = 3;

            //tip += '<div class="rank"><div class="con">' + ranks[rank] + '</div></div>';
            tip += '<div class="rank">' + ranks[rank] + '</div>';
        }
        if (isset(self.d.guest) && parseInt(self.d.guest)) tip += '<div class="rank">' + _t('deputy') + '</div>';

        tip += self.setTipHeader(self);

        if (self.wanted) tip += '<div class="wanted"></div>'; //Poszukiwany<br/>listem goÅczym
        //if (isset(self.matchmaking_champion) && !self.wanted) tip += '<div class="matchmaking_champion"></div>';
        if (self.d.matchmaking_champion && !self.wanted) tip += '<div class="matchmaking_champion"></div>';
        if (self.d.clan) tip += '<div class="clan-in-tip">' + escapeHTML(self.d.clan.name) + '</div>'; // + '</div><div class="line"></div>';
        tip += self.setBuffsSections();

        var tipObj = {
            text: tip,
            object: self
        };
        //API.callEvent('afterCharacterTipUpdate', tipObj);
        API.callEvent(Engine.apiData.AFTER_CHARACTER_TIP_UPDATE, tipObj);
        return tipObj.text;
    };

    this.updateWhoIsHereGlow = function() {
        if (isset(self.whoIsHereGlow)) delete self.whoIsHereGlow; // delete for update height

        if (self.whoIsHere && self.imgLoaded) {
            self.whoIsHereGlow = new WhoIsHereGlow();
            self.whoIsHereGlow.createObject(self);
        }
    };

    //this.addFollow = function () {
    //	if (Engine.hero.getRefFollowObj()) Engine.hero.clearRefFollowObj();
    //
    //	this.followGlow = new FollowGlow();
    //	this.followGlow.createObject(self, 'red');
    //	getEngine().hero.setRefFollowObj(self);
    //};
    //
    //this.clearFollow = function () {
    //	delete this.followGlow
    //};

    this.getFar = () => {
        return Math.abs(Engine.hero.d.x - this.d.x) > 1 || Math.abs(Engine.hero.d.y - this.d.y) > 1;
    };

    this.setBuffsSections = function() {
        var buffs = '';
        var bless = isset(self.d.is_blessed) && self.d.is_blessed ? '<div class="bless"></div>' : '';
        var mute = self.d.attr & 1 ? '<div class="mute"></div>' : '';
        var kB = isset(self.d.vip) && self.d.vip == '1' ? '<div class="k-b"></div>' : '';
        var warn = self.d.attr & 2 ? '<div class="warn"></div>' : '';
        var line = self.d.clan ? '<div class="line"></div>' : '';
        var wanted = self.d.wanted ? '<div class="wanted-i"></div>' : '';
        var matchmaking_champion = self.d.matchmaking_champion ? '<div class="matchmaking_champion-i"></div>' : '';

        if (bless != '' || mute != '' || kB != '' || warn != '' || wanted != '' || matchmaking_champion != '') buffs = '<div class="buffs-wrapper">' + line + wanted + bless + mute + kB + warn + matchmaking_champion + '</div>';

        return buffs;
    };

    this.setTipHeader = function(o) {
        var prof = isset(self.d.prof) ? self.d.prof : '';
        var lvl = o.d.lvl == 0 ? '' : '(' + o.d.lvl + prof + ')';
        var nick = '<div class="nick">' + o.nick + ' ' + lvl + '</div>';
        return '<div class="info-wrapper">' + nick + '</div>';
    };

    this.getOrder = function() {
        return this.ry + 0.4;
    };

    this.onmousemove = function() {
        return false;
    };

    this.oncontextmenu = function(e) {
        e.stopPropagation();
        //var hero = Engine.hero;
        //return hero.d.x == this.d.x && hero.d.y == this.d.y ? true : !this.createMenu(e);
        this.createMenu(e);
        return false;
    };

    this.markIsRed = function() {
        return self.colorMark && self.colorMark.color == 'red';
    };

    this.deleteRedMark = function() {
        var obj = {};
        obj[self.d.id] = self.d;
        Engine.hero.markOtherObj = null;
        Engine.targets.deleteArrow('Other-' + self.d.id);
        Engine.miniMapController.updateWindowMiniMapOthersPos(obj);
        delete(self.colorMark);
    };

    this.createMenu = function(e) {
        var hero = Engine.hero;
        var menu = [];
        var p = Engine.party;
        if (!p || p && !isset(p.getMembers()[self.d.id])) {
            if (self.markIsRed()) {
                menu.push([
                    _t('stop_attack', null, 'menu'),
                    function() {
                        self.deleteRedMark();
                    }
                ]);
            } else {
                menu.push([
                    _t('attack', null, 'menu'),
                    function() {
                        var mOObj = Engine.hero.markOtherObj;
                        var obj = {};
                        obj[self.d.id] = self.d;
                        if (mOObj && mOObj.colorMark.color == 'red') {
                            obj[mOObj.d.id] = mOObj.d;
                            Engine.targets.deleteArrow('Other-' + mOObj.d.id);
                            delete mOObj.colorMark;
                        }
                        Engine.hero.markOtherObj = self;
                        Engine.miniMapController.updateWindowMiniMapOthersPos(obj);
                        self.colorMark = new ColorMark(self.d.id, 'red');
                        self.colorMark.init();
                        Engine.targets.addArrow(false, self.nick, self, 'Other', 'attack');
                        Engine.hero.heroAtackOtherRequest();
                    }
                ]);
            }
        }

        //if (Math.abs(hero.d.x - this.d.x) < 2 || Math.abs(hero.d.y - this.d.y) < 2) {
        menu.push([
            _t('trade', null, 'menu'),
            function() {
                Engine.hero.addAfterFollowAction(self, function() {
                    _g('trade&a=ask&id=' + self.d.id);
                });
            }
        ]);
        if (hero.d.lvl > 29) {
            menu.push([
                _t('kiss', null, 'menu'),
                function() {
                    Engine.hero.addAfterFollowAction(self, function() {
                        _g('emo&a=kiss&id=' + self.d.id);
                    });
                }
            ]);
        }
        if (hero.d.vip) { //if (hero.d.vip && !isset(self.d.vip)) {
            menu.push([
                _t('crimson_bless', null, 'menu'),
                function() {
                    Engine.hero.addAfterFollowAction(self, function() {
                        _g('emo&a=bless&id=' + self.d.id);
                    });
                }
            ]);
        }

        this.addShowEqAndMessageToMenu(menu);

        menu.push([
            _t('invite_to_friend'),
            function() {
                _g('friends&a=finvite&nick=' + self.d.nick.trim().split(' ').join('_'));
            }
        ]);

        menu.push([
            _t('team_invite', null, 'menu'),
            function() {
                //Engine.hero.addAfterFollowAction(self, function () {
                _g('party&a=inv&id=' + self.d.id);
                //});
            }
        ]);

        menu.push([
            _t('show_profile', null, 'menu'),
            () => showProfile(this.d.account, this.d.id)
        ]);

        if (mobileCheck()) {
            var nawExist = Engine.targets.checkExistById('Other-' + self.d.id);
            if (!nawExist) {
                menu.push([
                    _t('navigate'),
                    function() {
                        Engine.targets.deleteAllOtherArrows();
                        Engine.targets.addArrow(false, self.nick, self, 'Other', 'navigate');
                    }
                ]);
            } else {

                menu.push([
                    _t('stop_navigate'),
                    function() {
                        Engine.targets.deleteArrow('Other-' + self.d.id);
                    }
                ]);
            }
        }

        self.addDebugOptionMenu(menu);

        if (menu.length) {
            Engine.interface.showPopupMenu(menu, e, true);
            return true;
        }
        return false
    };

    this.createBasicMenu = function(e) {
        //var menu = [];
        //this.addShowEqAndMessageToMenu(menu);
        //Engine.interface.showPopupMenu(menu, e);
        //return true;

        getEngine().others.createOtherContextMenu(e, {
            lvl: self.getLvl(),
            prof: self.getProf(),
            nick: self.getNick(),
            charId: self.getId(),
            accountId: self.getAccountId()
        }, [
            OthersContextMenuData.INVITE_TO_FRIEND,
            OthersContextMenuData.INVITE_TO_ENEMIES,
            OthersContextMenuData.INVITE_TO_PARTY
        ]);

    };

    this.addShowEqAndMessageToMenu = function(menu) {
        //if (self.d.relation != "en") {
        if (self.d.relation != SocietyData.RELATION.ENEMY) {
            menu.push([
                _t('send_message', null, 'chat'),
                function() {
                    //Engine.chat.replyTo(self.d.nick);
                    //Engine.interface.focusChat();
                    Engine.chatController.getChatInputWrapper().setPrivateMessageProcedure(self.d.nick);
                }
            ]);
        }

        menu.push([_t('show_eq'), this.showEq]);
    };

    this.showEq = () => {
        Engine.showEqManager.update(self.d);
    };

    this.updatePet = function(d) {
        var del = jQuery.isEmptyObject(d) ? true : false;
        if (!isset(this.pet)) {
            d.isNew = true;
            d.master = self;
            this.pet = new Pet();
            this.pet.updateDATA(d);
            this.petLock = new Lock(['petUpdate'], function() {
                if (d.action) self.pet.createActionsDataArrayForOther(d.action);
                self.pet.updateDATA({
                    master: self
                });
                delete self.petLock;
            });
        } else {
            if (del) {
                this.deletePet();
            } else {
                d.isNew = false;
                if (d.action) self.pet.createActionsDataArrayForOther(d.action);
                self.pet.updateDATA(d);
            }
        }
    };

    this.deletePet = function() {
        if (isset(this.pet)) {
            delete this.pet;
        }
    };

    this.onhover = function(e, show) {
        self.overMouse = show;
        //self.setCursor(show);
        getEngine().interface.setDoActionCursor(show);
        var idGroup = self.grp;
        if (self.grp) Engine.npcs.groupShining(idGroup, show);
    };

    //this.setCursor = function (show) {
    //	const $GC 			= Engine.interface.get$GAME_CANVAS();
    //	const DO_ACTION 	= ColliderData.CURSOR.DO_ACTION;
    //
    //	if (show) 	$GC.addClass(DO_ACTION);
    //	else 		$GC.removeClass(DO_ACTION);
    //};

    this.setStasis = function(v) {
        if (v === 1) {
            self.stasis = v;
        } else {
            delete self.stasis;
            delete self.d.stasis;
        }
    };

    this.setStasisEmo = (v, allData, incoming = false) => {
        let id = self.d.id ? self.d.id : allData.id;
        let e = Engine.emotions;
        let STASIS = incoming ? EmotionsData.NAME.STASIS_INCOMING : EmotionsData.NAME.STASIS;
        if (v > 0) e.updateData([{
            name: STASIS,
            source_id: id,
            source_type: EmotionsData.OBJECT_TYPE.OTHER
        }]);
        else e.removeEmotionBySourceIdAndEmoType(id, STASIS);
    }
    /*
    	this.afterFetch = (val, f) => {
    		//var i = new Image();
    		//i.src = (IE ? CFG.opath + val : f.img);
    		//self.fw = f.hdr.width / 4;
    		//self.fh = f.hdr.height / 4;
    		//self.halffw = self.fw / 2;
    		//self.halffh = self.fh / 2;
    		//self.frames = f.frames;
    		//self.activeFrame = 0;
    		//self.sprite = i;
    		//drawLock.unlock('image');
    		//self.updateCollider();
    		//i.onload = function () {
    		//	//self.imgLoaded = true;
    		//	//delete self.whoIsHereGlow; // delete for update height
    		//	//self.updateWhoIsHereGlow();
    		//	self.afterLoadImage()
    		//};

    		let src = CFG.opath + val;
    		Engine.imgLoader.onload(src, f,
    			(i) => {
    				this.beforeOnload(f, i);
    			},
    			(i) => {
    				this.afterLoadImage();
    			}
    		)
    	};
    */
    this.beforeOnload = (f, i) => {
        self.fw = f.hdr.width / 4;
        self.fh = f.hdr.height / 4;
        self.halffw = self.fw / 2;
        self.halffh = self.fh / 2;
        self.frames = f.frames;
        self.activeFrame = 0;
        self.sprite = i;
        drawLock.unlock('image');
        self.updateCollider();
    };

    this.afterLoadImage = () => {
        this.imgLoaded = true;
        this.setOnloadProperImg(true)
        this.updateWhoIsHereGlow(); // only for bigger outfit size
        this.refreshEmotions()
    };

    //this.refreshEmotions = () => {
    //	const emoList = this.getOnSelfEmoList();
    //	if (emoList.length > 0) {
    //		for (const emo of emoList) {
    //			emo.setXYOffset();
    //		}
    //	}
    //};

    this.getId = () => {
        return this.d.id
    }

    this.getNick = () => {
        return this.d.nick;
    };

    this.getImg = () => {
        return this.d.icon;
    };

    this.getLvl = () => {
        return this.d.lvl;
    };

    this.getProf = () => {
        return this.d.prof;
    };

    const getLevel = () => {
        return this.d.lvl;
    }

    this.getRelation = () => {
        return this.d.relation;
    };

    this.getAccountId = () => {
        return this.d.account;
    };

    this.onUpdate = new(function() {
        this.icon = function(val, old) {
            let path = CFG.r_opath + fixSrc(val);

            self.setPlaceHolderIcon();
            //self.setStaticAnimation(Engine.opt(8));
            self.setStaticAnimation(!isSettingsOptionsInterfaceAnimationOn());
            //Gif.fetch(path, true, function (f) {
            //	self.afterFetch(val, f);
            //}, function () {
            //	self.fetchError();
            //});

            //console.log('other', path)
            Engine.imgLoader.onload(path, {
                    speed: true,
                    externalSource: cdnUrl
                },
                (i, f) => {
                    this.beforeOnload(f, i);
                },
                (i) => {
                    this.afterLoadImage();
                },
                () => {
                    self.fetchError();
                }
            );
        };

        this.x = function(v) {
            if (isset(self.stasis) && self.stasis === 1) {
                self.setStasis(0);
            }
        };

        this.dir = function(v) {
            this.dir = dirMapping[v];
            this.dir2 = dirMapping[v];
        };

        this.nick = function(val) {
            self.nick = val;
        };

        this.pet = function(val) {
            self.updatePet(val);
        };

        this.wanted = function(val) {
            self.wanted = new CharacterAura();
            self.wanted.init(self, 1);
        };

        this.whoIsHere = function(val) {
            self.whoIsHere = val;
            if (self.whoIsHereGlow) self.whoIsHereGlow.updateColor(self.whoIsHere);
        };

        this.rights = function(val) {
            self.rights = val;
        };

        this.prof = function(val) {
            self.prof = val;
        };

        this.lvl = function(val) {
            self.lvl = val;
        };

        this.stasis = function(val, old, allData) {
            self.setStasis(val);
            self.setStasisEmo(val, allData);
        };

        this.stasis_incoming_seconds = function(val, old, allData) {
            self.setStasisEmo(val, allData, true);
        };

    })();


    const setKind = (_kind) => {
        kind = _kind
    }

    const getCanvasObjectType = () => {
        return this.canvasObjectType;
    }

    const getKind = () => kind

    this.getRX = () => {
        return this.rx;
    };

    this.getRY = () => {
        return this.ry;
    };

    this.getLevel = getLevel;
    this.getKind = getKind;
    this.firstAfterUpdate = firstAfterUpdate;
    this.refreshKind = refreshKind;
    this.getCanvasObjectType = getCanvasObjectType;
    //this.clearDataToDrawIfKindChange 	= clearDataToDrawIfKindChange;
    this.manageRefreshKind = manageRefreshKind;
    //
    //const initDynamicHoleImg = () => {
    //	dynamicHoleImg = Engine.nightController.getFramesWithHoles().getDynamicHoleImg(100);
    //};
    //
    //this.getDynamicHoleImg = () => {
    //	return dynamicHoleImg;
    //};
};
Other.prototype = Object.create(Character.prototype);

Other.prototype.constructor = Other;

module.exports = Other;