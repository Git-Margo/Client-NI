var Finder = require('@core/searchPath/finder/Finder');

var GroupFinder = function(node, destination) {
    Finder.call(this);
    this.node = node;
    this.destination = destination;
    this.probably = [];
    this.lastDistance = null;
};

GroupFinder.prototype = Object.create(Finder.prototype);
GroupFinder.prototype.constructor = GroupFinder;

GroupFinder.prototype.prepare = function() {
    this.node.setStartNodes([this.destination]);
    this.openSet.push(this.node);
};

GroupFinder.prototype.isOpenSetNoEmpty = function() {
    return this.openSet.length > 0;
};

GroupFinder.prototype.checkNode = function() {
    this.addToCloseSet();
    this.checkNeighbors();
};

GroupFinder.prototype.checkNeighbors = function() {
    var neighbors = this.currentNode.neighbors;
    for (var t in neighbors) {
        var neighbor = neighbors[t];
        if (this.openSet.indexOf(neighbor) !== -1 ||
            this.closeSet.indexOf(neighbor) !== -1) {
            continue;
        }
        this.checkNeighbor(neighbor);
    }
};

GroupFinder.prototype.checkNeighbor = function(neighbor) {
    neighbor.setGScore(this.currentNode.getGScore() + 1);
    if (this.lastDistance !== null && this.lastDistance < neighbor.getGScore())
        return;

    if (neighbor.isConnectedWith(this.destination)) {
        this.probably.push(neighbor);
        if (this.lastDistance === null) {
            this.lastDistance = neighbor.getGScore();
        }
    }
    this.openSet.push(neighbor);
};
GroupFinder.prototype.getLowerCostNodes = function() {
    var tab = [];
    var lowest = null;
    for (var t in this.probably) {
        var node = this.probably[t];
        var dist = this.getDistance(node);
        if (lowest === null || lowest > dist) {
            lowest = dist;
        }
        tab.push({
            node: node,
            dist: dist
        });
    }
    tab = tab.filter(function(a) {
        return a.dist <= lowest;
    });
    return tab.map(function(a) {
        return a.node;
    });
};

GroupFinder.prototype.getDistance = function(node) {
    return node.getHCE8To(this.node);
};

module.exports = GroupFinder;