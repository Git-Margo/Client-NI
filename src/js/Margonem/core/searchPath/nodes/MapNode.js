var BaseConnectionNode = require('core/searchPath/nodes/BaseConnectionNode');

var MapNode = function(x, y, map) {
    BaseConnectionNode.call(this);
    this.x = x;
    this.y = y;
    this.id = y * map.getWidth() + x;
    this.mapCollision = false;
    this.ignored = false;
    this.neighbors = [];
};
MapNode.prototype = Object.create(BaseConnectionNode.prototype);
MapNode.prototype.constructor = MapNode;

MapNode.prototype.findAndSetNeighbors = function(map) {
    this.neighbors = map.getNeighbors(this);
};

MapNode.prototype.getId = function() {
    return this.id;
};

MapNode.prototype.isNeighbor = function(node) {
    return Math.abs(node.x - this.x) <= 1 && Math.abs(node.y - this.y) <= 1;
};

MapNode.prototype.getHCETo = function(node) {
    return Math.abs(this.x - node.x) + Math.abs(this.y - node.y);
};

MapNode.prototype.getHCE8To = function(node) {
    return Math.sqrt(Math.pow(this.x - node.x, 2) + Math.pow(this.y - node.y, 2));
};

MapNode.prototype.isPosition = function(pos) {
    return pos.x === this.x && pos.y === this.y;
};

MapNode.prototype.getPosition = function() {
    return {
        x: this.x,
        y: this.y
    };
};

MapNode.prototype.setCollision = function(val) {
    this.mapCollision = val > 0;
    if (this.chunkZone !== null)
        this.chunkZone.setCorruption();
};
MapNode.prototype.isBlocked = function() {
    return this.mapCollision;
};

MapNode.prototype.clearIgnore = function() {
    this.ignored = false;
};
MapNode.prototype.setIgnore = function() {
    this.ignored = true;
};
MapNode.prototype.isIgnored = function() {
    return this.ignored;
};

module.exports = MapNode;