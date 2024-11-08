var Arrow = require('core/quest/Arrow');
var Target = require('core/quest/Target');

module.exports = function() {
    var list = {};
    let targetList = {}
    var self = this;

    this.check = function() {
        return list;
    };

    this.removeOne = function(id) {
        deleteArrow(id);
    };

    this.addArrow = function(idArrow, name, objParent, typeParent, typeArrow, target) {
        let id = idArrow ? idArrow : (typeParent + '-' + objParent.d.id);
        if (list[id]) return;
        list[id] = new Arrow();
        list[id].init();
        list[id].id = id;
        if (objParent) {
            list[id].parent = true;
            list[id].objParent = objParent;
            list[id].typeParent = typeParent;
        }
        if (typeArrow) list[id].src = '/img/' + typeArrow + '-arrow.png';
        list[id].enabled = true;
        list[id].tip = ['' + name];

        if (target) {
            let oneTarget = new Target();
            let src = target.src ? target.src : null;

            oneTarget.init();
            oneTarget.setEnabled(true);
            oneTarget.updateData(getEngine().hero, objParent, ['' + name], src);
            targetList[id] = oneTarget;
        }

        list[id].afterUpdate();
    };

    this.deleteAllOtherArrows = function() {
        for (let k in list) {
            if (list[k].typeParent && list[k].typeParent == 'Other') this.deleteArrow(k);
        }
    };

    this.deleteArrow = function(id) {
        if (list[id]) delete list[id];
        if (targetList[id]) delete targetList[id];
    };

    this.checkExistById = function(id) {
        return list[id];
    };

    this.checkExistInSpecificPosById = function(id, x, y) {
        let pos = list[id].getPos();

        return pos[1] == x && pos[2] == y;
    };

    this.checkTargetIsDefaultSrc = (id) => {
        return targetList[id].isDefaultSrc();
    }

    this.update = function(dt) {
        for (var k in list) {
            list[k].update(dt);
            if (targetList[k]) targetList[k].update(dt)
        }
    };

    this.onClear = function() {
        list = {};
        targetList = {};
    };

    this.getDrawableList = function() {
        var arr = [];
        for (var i in list) {
            arr.push(list[i]);
        }
        for (var j in targetList) {
            arr.push(targetList[j]);
        }
        return arr;
    };
};