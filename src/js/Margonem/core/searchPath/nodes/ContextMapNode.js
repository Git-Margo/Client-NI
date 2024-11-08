var CostNode = require('core/searchPath/nodes/CostNode');
var ContextMapNode = function(node) {
    this.baseNode = node;
    this.neighbors = [];
    this.disabled = false;

    this.from = null;
    this.gScore = null;
    this.dests = [];
};

ContextMapNode.prototype.setChunk = function(chunk) {
    return this.baseNode.setChunk(chunk);
};
ContextMapNode.prototype.setChunkZone = function(zone) {
    return this.baseNode.setChunkZone(zone);
};
ContextMapNode.prototype.isChunkZoneEmpty = function() {
    return this.baseNode.isChunkZoneEmpty();
};
ContextMapNode.prototype.isOnChunk = function(chunk) {
    return this.baseNode.isOnChunk(chunk);
};
ContextMapNode.prototype.isOnSameChunk = function(node) {
    if (this.disabled)
        return false;
    return this.baseNode.isOnSameChunk(node.baseNode);
};
ContextMapNode.prototype.isConnectedWith = function(node) {
    if (this.disabled)
        return false;
    return this.baseNode.isConnectedWith(node.baseNode);
};
ContextMapNode.prototype.getChunkId = function() {
    return this.baseNode.getChunkId();
};

ContextMapNode.prototype.createNeighborsConnections = function(map) {
    for (var i = 0; i < this.baseNode.neighbors.length; i++) {
        var neighbor = this.baseNode.neighbors[i];
        this.neighbors[i] = map.getNodeById(neighbor.getId());
    }
};

ContextMapNode.prototype.disableNode = function() {
    this.disabled = true;
};
ContextMapNode.prototype.isBlocked = function() {
    if (this.disabled)
        return true;
    return this.baseNode.isBlocked();
};

ContextMapNode.prototype.getId = function() {
    return this.baseNode.id;
};
ContextMapNode.prototype.isNeighbor = function(node) {
    return this.baseNode.isNeighbor(node.baseNode);
};
ContextMapNode.prototype.getHCETo = function(node) {
    return this.baseNode.getHCETo(node.baseNode);
};
ContextMapNode.prototype.getHCE8To = function(node) {
    return this.baseNode.getHCE8To(node.baseNode);
};
ContextMapNode.prototype.isPosition = function(pos) {
    return this.baseNode.isPosition(pos);
};
ContextMapNode.prototype.getPosition = function() {
    return this.baseNode.getPosition();
};

// MapNode.prototype.setCollision = function (val) {
//     this.mapCollision = val > 0;
//     if (this.chunkZone !== null)
//         this.chunkZone.setCorruption();
// };
// MapNode.prototype.isBlocked = function () {
//     return this.mapCollision;
// };

// MapNode.prototype.clearIgnore = function () {
//     this.ignored = false;
// };
// MapNode.prototype.setIgnore = function () {
//     this.ignored = true;
// };
// MapNode.prototype.isIgnored = function () {
//     return this.ignored;
// };

ContextMapNode.prototype.setStartNodes = function(nodes) {
    this.from = null;
    this.gScore = 0;
    this.dests = [];
    for (var i = 0; i < nodes.length; i++) {
        this.dests.push(new CostNode(this));
    }
    this.updateCosts(nodes);
};
ContextMapNode.prototype.setPreviousNodes = function(current, nodes) {
    this.from = current;
    this.gScore = current.getGScore() + 1;
    this.updateCosts(nodes);
};
ContextMapNode.prototype.setGScore = function(value) {
    this.gScore = value;
};
ContextMapNode.prototype.isLowerCostThan = function(node) {
    var len = Math.min(this.dests.length, node.dests.length);
    for (var t = 0; t < len; t++) {
        var ownCost = this.dests[t];
        var otherCost = node.dests[t];
        if (ownCost.isLowerScore(otherCost))
            return true;
    }
    return false;
};
ContextMapNode.prototype.getGScore = function() {
    return this.gScore;
};
ContextMapNode.prototype.getFrom = function() {
    return this.from;
};

ContextMapNode.prototype.clearContext = function() {
    this.from = null;
    this.gScore = null;
    this.dests = [];
};

ContextMapNode.prototype.clearDisable = function() {
    this.disabled = false;
};



ContextMapNode.prototype.updateCosts = function(nodes) {
    for (var t = 0; t < nodes.length; t++) {
        var cost = this.getCostById(t);
        var node = nodes[t];
        cost.setScore(node);
    }
};
ContextMapNode.prototype.getCostById = function(id) {
    if (this.dests.length > id)
        return this.dests[id];
    var cost = new CostNode(this);
    this.dests[id] = cost;
    return cost;
};
module.exports = ContextMapNode;