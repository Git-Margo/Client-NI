var SearchPathMap = require("core/searchPath/maps/SearchPathMap");
var ContextMap = require("core/searchPath/maps/ContextMap");
var SearchContext = require("core/searchPath/SearchContext");
var Road = require("core/searchPath/Road");

var SearchPath = function() {
    var self = this;
    this.map = null;
    this.contextMap = null;
    this.roads = [];
    //window.SearchPath = this;

    asdasd = this;

    this.createMap = function(size) {
        self.map = new SearchPathMap(size);
        self.contextMap = new ContextMap(self.map);
        self.roads = [];
        //window.SearchPathMap = self.map;
    };

    this.find = function(heroObject, destinationPosition) {
        var context = new SearchContext(self.contextMap, destinationPosition);
        var road = this.createRoad(heroObject, context);
        road.findWay();
        self.roads.push(road);
        return road;
    };

    this.getEmptyRoad = function() {
        return this.createRoad(null, null);
    };

    this.createRoad = function(hero, context) {
        var road = new Road(hero, context, function() {
            var idx = self.roads.indexOf(road);
            if (idx !== -1) {
                self.roads.splice(idx, 1);
            }
        });
        return road;
    };

    this.readCollisions = function(col, cacheData) {
        if (cacheData) self.map.copyCollisionsToNodesCache(col);
        else self.map.copyCollisionsToNodes(col);
        self.reload();
    };

    this.changeCollision = function(x, y, type) {
        var node = self.map.getNode(x, y);
        if (node === null)
            return;
        var old = node.isBlocked();
        node.setCollision(type);
        if (old === node.isBlocked())
            return;
        for (var t in self.roads) {
            self.roads[t].changeCollision(x, y, type);
        }
    };

    this.reload = function() {
        if (self.map == null)
            return;
        //var t0 = performance.now();
        self.map.reloadCollisionsConnections();
        //var t1 = performance.now();
        self.reloadRoads();
        //var t2 = performance.now();
        //console.log("Map.reload took reload:" + (t1 - t0) + " ms; reloadRoads:" + (t2 - t1) + " ms: full:" + (t2 - t0) + " ms");
    };

    this.reloadRoads = function() {
        self.roads.forEach((a) => a.reloadConnections());
    };
};

module.exports = new SearchPath();