var Finder = require('core/searchPath/finder/Finder');

var PathFinder = function(source, destinations) {
    Finder.call(this);
    this.endNode = null;
    this.source = source;
    this.destinations = destinations;
    if (this.destinations.length > 0)
        this.openSet.push(source);
};

PathFinder.prototype = Object.create(Finder.prototype);
PathFinder.prototype.constructor = PathFinder;

PathFinder.prototype.prepare = function() {
    this.source.setStartNodes(this.destinations);
};

PathFinder.prototype.isOpenSetNoEmpty = function() {
    return this.openSet.length > 0 && this.endNode === null;
};

PathFinder.prototype.getFirstNode = function() {
    if (this.openSet.length > 0) {
        var checkId = 0;
        for (var id = 1; id < this.openSet.length; id++) {
            if (this.openSet[id].isLowerCostThan(this.openSet[checkId]))
                checkId = id;
        }
        var first = this.openSet[checkId];
        this.openSet.splice(checkId, 1);
        return first;
    }
    return null;
};

PathFinder.prototype.checkNode = function() {
    for (var t in this.destinations) {
        if (this.destinations[t].getId() == this.currentNode.getId()) {
            this.endNode = this.currentNode;
            return;
        }
    }
    this.addToCloseSet();
    this.checkNeighbors();
};

PathFinder.prototype.checkNeighbors = function() {
    var neighbors = this.currentNode.neighbors;
    for (var t in neighbors) {
        var neighbor = neighbors[t];
        if (neighbor.isBlocked() || this.closeSet.indexOf(neighbor) !== -1) {
            continue;
        }
        this.checkNeighbor(neighbor);
    }
};

PathFinder.prototype.checkNeighbor = function(neighbor) {
    var nextgScore = neighbor.getGScore() + 1;
    if (this.openSet.indexOf(neighbor) === -1) {
        this.openSet.push(neighbor);
    } else if (nextgScore >= neighbor.getGScore()) {
        return;
    }
    neighbor.setPreviousNodes(this.currentNode, this.destinations);
};

module.exports = PathFinder;