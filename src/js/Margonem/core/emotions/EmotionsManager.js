var Emotion = require('core/emotions/Emotion');
var EmotionsDefinitions = require('core/emotions/EmotionsDefinitions');
var RenderGifStrategy = require('core/emotions/RenderGifStrategy');
var Action = require('core/emotions/Action');
var EmotionsData = require('core/emotions/EmotionsData');
module.exports = function() {
    var self = this;
    var list = [];
    //this.readyGifLoaded = {};

    this.init = function() {
        self.emotionsDefinitions = new EmotionsDefinitions();
        self.initJumpCondition();
    };

    this.updateData = function(data) {
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            var type = obj.name;
            var sourceId = obj.source_id;
            var targetId = isset(obj.target_id) ? obj.target_id : 0;
            var timeToRemove = isset(obj.end_ts) ? obj.end_ts : 0;

            this.prepareData(obj);

            let sourceType = obj.source_type;
            let targetType = obj.target_type;

            if (self.ignoreEmo(type, sourceType, sourceId)) continue;
            if (!self.checkSourceObjectExist(obj)) continue;

            self.addEmo(type, sourceType, sourceId, targetType, targetId, timeToRemove);

            if (sourceType == EmotionsData.OBJECT_TYPE.NPC) Engine.npcs.manageDisplayOfNpcEmo(sourceId);
        }
    };

    this.initJumpCondition = () => {
        // this.addJumpCondition(EmotionsData.NAME.DAILY_QUEST);
        // this.addJumpCondition(EmotionsData.NAME.NORMAL_QUEST);
        // this.addJumpCondition(EmotionsData.NAME.MAIL, () => {
        // 	return Engine.hero.d.mails ? true : false;
        // });
    }

    this.addJumpCondition = (type, f) => {
        var emoData = self.emotionsDefinitions.get(type);
        if (!emoData) {
            errorReport('EmotionManager.js', 'addJumpCondition', 'Type Emo not exist', type)
            return
        }
        emoData.jump = true;
        if (f) emoData.jumpCondition = f;
    }

    this.setDisplayOfEmoFromArray = (emoArray, display) => {
        for (let k in emoArray) {
            emoArray[k].setDisplay(display);
        }
    };

    this.prepareData = (obj) => {

        let heroId = Engine.hero.d.id;

        if (obj.source_type == EmotionsData.OBJECT_TYPE.OTHER && heroId == obj.source_id) obj.source_type = EmotionsData.OBJECT_TYPE.HERO;

        if (obj.target_type == EmotionsData.OBJECT_TYPE.OTHER && heroId == obj.target_id) obj.target_type = EmotionsData.OBJECT_TYPE.HERO;

    };

    this.checkSourceObjectExist = (obj) => {
        switch (obj.source_type) {
            case EmotionsData.OBJECT_TYPE.HERO:
                return Engine.hero.d.id == obj.source_id;
            case EmotionsData.OBJECT_TYPE.NPC:
                return Engine.npcs.check()[obj.source_id] ? true : false;
            case EmotionsData.OBJECT_TYPE.OTHER:
                return Engine.others.check()[obj.source_id] ? true : false;
            case EmotionsData.OBJECT_TYPE.PET:
                return Engine.hero.havePet() ? true : false;
        }
        return false;
    }

    this.ignoreEmo = function(type, sourceType, sourceId) {
        // if (type == 'VisualEffects') return false;
        if (type == EmotionsData.NAME.VISUAL_EFFECTS) return false;
        var bool1 = this.dontAddBattle(type, sourceId);

        let sourceExist = false

        switch (sourceType) {
            case EmotionsData.OBJECT_TYPE.NPC:
            case EmotionsData.OBJECT_TYPE.OTHER:
            case EmotionsData.OBJECT_TYPE.HERO:
            case EmotionsData.OBJECT_TYPE.PET:
                sourceExist = true
                break;
            default:
                errorReport("EmotionsManager.js", "ignoreEmo", "Incorrect type of sourceType Emo!", sourceType);
        }

        return bool1 || !sourceExist;
    };

    this.update = function(dt) {
        for (var i in list) {
            list[i].update(dt);
        }
    };

    this.dontAddBattle = function(type, sourceId) {
        let BATTLE = EmotionsData.NAME.BATTLE;
        if (type != BATTLE) return false;
        //var emo = this.getEmoByIdSource(sourceId, 'battle');
        var emo = this.getEmoByIdSource(sourceId, BATTLE);
        if (emo) return true;
        return false;
    };

    this.deleteAllSourceEmo = function(sourceId, type) {
        for (var key in list) {
            var o = list[key];
            if (o.sourceId == sourceId && o.type == type) {
                o.delete();
                self.removeEmoFromList(o);
                o.fadeOutEmo();
                self.manageDisplayOfNpcEmo(o.sourceType, o.sourceId);
            }
        }
    };

    this.deleteEmoByType = function(type) {
        for (var key in list) {
            var o = list[key];
            if (o.type == type) {
                o.delete();
                self.removeEmoFromList(o);
                o.fadeOutEmo();
                self.manageDisplayOfNpcEmo(o.sourceType, o.sourceId);

            }
        }
    };

    this.manageDisplayOfNpcEmo = (sourceType, sourceId) => {
        if (sourceType == EmotionsData.OBJECT_TYPE.NPC) Engine.npcs.manageDisplayOfNpcEmo(sourceId);
    }

    this.removeEmoFromList = function(obj) {
        var idx = list.indexOf(obj);
        if (idx == -1)
            return;
        list.splice(idx, 1);
    };

    this.renderStrategy = function(obj) {
        if (obj.height)
            return new RenderGifStrategy.getSpriteObject();
        else
            return new RenderGifStrategy.getGifObject();
    };

    this.kindOfAction = function(obj) {
        let action = obj.action;

        switch (action) {
            case EmotionsData.ACTION.ON_SELF:
                return new Action.getActionOnSelf();
            case EmotionsData.ACTION.CHAR_TO_CHAR:
                return new Action.getActionCharToChar();
            case EmotionsData.ACTION.STICK_TO_PLAYER:
                return new Action.getActionStickToAnotherPlayer();
            case EmotionsData.ACTION.STICK_TO_MAP:
                return new Action.getActionStickToMap();
            case EmotionsData.ACTION.FIRE:
                return new Action.getActionFire();
            case EmotionsData.ACTION.BETWEEN_PLAYERS:
                return new Action.getActionBetweenPlayers();
            case EmotionsData.ACTION.LANTERN:
                return new Action.getActionLantern();
            default:
                errorReport('EmotionsManager', 'kindOfAction', `Incorrect action ${action}!`);
        }
    };

    this.getEmoByIdSource = function(sourceId, type) {
        for (var key in list) {
            var o = list[key];
            if (o.sourceId == sourceId && o.type == type) {
                return o;
            }
        }
        return null;
    };

    this.getEmoByTargetSourceType = function(sourceId, targetId, type, sourceType) {
        for (var key in list) {
            var o = list[key];
            if (
                o.sourceId == sourceId &&
                o.type == type &&
                o.targetId == targetId &&
                o.sourceType == sourceType) {
                return o;
            }
        }
        return null;
    };

    this.removeAllFromSourceId = function(sourceId) {
        for (var i = 0; i < list.length; i++) {
            var o = list[i];
            if (o.sourceId != sourceId)
                continue;
            o.delete();
            list.splice(i, 1);
            i--;
            o.fadeOutEmo();
            self.manageDisplayOfNpcEmo(o.sourceType, o.sourceId);
        }
    };

    this.removeEmotionBySourceIdAndEmoType = function(sourceId, type) {
        for (var i = 0; i < list.length; i++) {
            var o = list[i];
            if (o.sourceId == sourceId && o.type == type) {
                o.delete();
                list.splice(i, 1);
                o.fadeOutEmo();
                self.manageDisplayOfNpcEmo(o.sourceType, o.sourceId);
                return;
            }
        }
    };

    this.emoClear = function(sourceId, tab) {
        for (var t in tab) {
            self.deleteAllSourceEmo(sourceId, tab[t]);
        }
    };

    this.addEmo = function(type, sourceType, sourceId, targetType, targetId, endTime) {
        var emoData = self.emotionsDefinitions.get(type);
        //if (!isset(emoData)) {
        if (emoData == null) {

            let rajData = Engine.rajEmoDefinitions.getDefinition(type);

            if (!rajData) {
                errorReport('EmotionsManager', "addEmo", `name emo: ${type} not exist!`);
                return;
            }
            emoData = rajData;
        }

        var opt = {
            sourceType: sourceType,
            sourceId: sourceId,
            targetType: targetType,
            targetId: targetId,
            endTime: endTime === 0 && isset(emoData.timeout) ? Engine.getEv() + emoData.timeout / 1000 : endTime,
            type: type
        };

        if (isset(emoData.clear)) self.emoClear(sourceId, emoData.clear);
        if (type == EmotionsData.NAME.NO_EMO) return;
        if (emoData.action == EmotionsData.ACTION.ON_SELF) {
            var sameEmo = self.getEmoByTargetSourceType(sourceId, targetId, type, sourceType);
            if (sameEmo != null) {
                sameEmo.renew();
                return;
            }
        }
        var emo = new Emotion(emoData, opt, self.removeEmoFromList);
        emo = $.extend(emo, self.renderStrategy(emoData), self.kindOfAction(emoData));
        emo.withCreateObject();
        list.push(emo);
    };

    this.onClear = function() {
        for (var i in list) {
            list[i].delete();
        }
        list = [];
    };

    this.setEmotionsAnimationsState = function(state) {
        for (var i in list) {
            list[i].setStaticAnimation(state);
        }
    };

    this.getList = () => {
        return list;
    }

    this.getDrawableList = function() {
        var arr = [];
        for (var i in list)
            arr.push(list[i]);
        return arr;
    }
};