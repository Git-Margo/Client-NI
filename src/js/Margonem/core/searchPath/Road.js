let CanvasObjectTypeData = require('core/CanvasObjectTypeData');

var Road = function(characterObject, searchContext, onDestroy) {

    let moduleData = {
        fillName: "Road.js"
    };

    this.context = searchContext;
    this.road = [];
    this.roadNodes = [];
    this.lastPathCorrupted = false;

    this.count = function() {
        return this.road.length;
    };

    this.clear = function() {
        this.road = [];
        this.free();
    };

    this.pop = function() {
        var el = this.road.pop();
        if (this.road.length === 0)
            this.free();
        return el;
    };

    this.get = function(idx) {
        return this.road[idx];
    };

    this.free = function() {
        this.lastPathCorrupted = false;
        onDestroy();
    };

    this.changeCollision = function(x, y, type) {
        if (!type) return;
        this.context.disableNode(x, y);
        if (!this.isCollidedNode(x, y))
            return;
        this.road = [];
        this.lastPathCorrupted = true;
    };

    this.reloadConnections = function() {
        if (!this.lastPathCorrupted)
            return;
        this.lastPathCorrupted = false;
        this.findWay();
    };

    this.findWay = function() {
        var sourcePosition = this.getCharacterPosition();
        this.roadNodes = this.context.getRoad(sourcePosition.x, sourcePosition.y, this.roadNodes);
        this.createPointsRoad();
        if (this.road.length === 0)
            this.free();
    };

    this.isCollidedNode = function(x, y) {
        var position = this.createPoint(x, y);
        for (var t in this.roadNodes) {
            var node = this.roadNodes[t];
            if (node.isPosition(position))
                return true;
        }
        return false;
    };

    //this.getCharacterPosition = function (real) {
    this.getCharacterPosition = function() {
        //if (real)
        //	return this.createPoint(characterObject.rx, characterObject.ry);

        switch (characterObject.canvasObjectType) {
            case CanvasObjectTypeData.FAKE_NPC:
                return this.createPoint(characterObject.d.x, characterObject.d.y);
            case CanvasObjectTypeData.HERO:
                return this.createPoint(characterObject.d.x, characterObject.d.y);
        }

        errorReport(moduleData.fillName, "getCharacterPosition", "undefined canvasObjectType", characterObject.canvasObjectType);

        return null;
        //return this.createPoint(characterObject.d.x, characterObject.d.y);
    };

    this.createPoint = function(x, y) {
        return {
            x: x,
            y: y
        };
    };

    this.createPointsRoad = function() {
        var road = [];
        for (var t in this.roadNodes) {
            road.push(this.roadNodes[t].getPosition());
        }
        this.road = road;
    };
};

module.exports = Road;