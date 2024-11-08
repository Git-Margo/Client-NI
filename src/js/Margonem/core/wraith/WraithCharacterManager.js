module.exports = function() {
    var list = {};
    var self = this;

    this.check = function() {
        return list;
    };

    this.removeOne = function(id) {
        delete list[id];
    };

    this.addWraith = function(obj, id) {
        list[id] = obj;
        list[id].rx = list[id].d.x;
        list[id].ry = list[id].d.y;
    };

    this.addPetWraith = function(obj, id) {
        list[id] = obj;
    };

    this.update = function(dt) {
        for (var k in list) {
            //if (Engine.opt(8)) {
            if (!isSettingsOptionsInterfaceAnimationOn()) {
                self.removeOne(k);
                continue;
            }
            list[k].warShadowOpacity -= dt * 2;
            if (list[k].warShadowOpacity < 0) self.removeOne(k);
        }
    };

    this.onClear = function() {
        list = {};
    };

    this.getDrawableList = function() {
        var arr = [];
        for (var i in list) {
            arr.push(list[i]);
        }
        return arr;
    };

};