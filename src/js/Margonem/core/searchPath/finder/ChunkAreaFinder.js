var Finder = require('core/searchPath/finder/Finder');

var ChunkAreaFinder = function(node) {
    Finder.call(this);
    this.node = node;
    this.matched = [];
};

ChunkAreaFinder.prototype = Object.create(Finder.prototype);
ChunkAreaFinder.prototype.constructor = ChunkAreaFinder;

ChunkAreaFinder.prototype.prepare = function() {
    if (this.node.isBlocked())
        return;
    this.node.setIgnore();
    this.openSet.push(this.node);
};

//you should clear ignore flag for all nodes in map before use this finder
ChunkAreaFinder.prototype.checkNode = function() {
    this.currentNode.setIgnore();
    this.matched.push(this.currentNode);
    var neighbors = this.currentNode.neighbors;
    for (var t in neighbors) {
        var neighbor = neighbors[t];
        if (neighbor.isBlocked() || neighbor.isIgnored() || !neighbor.isOnSameChunk(this.node)) {
            continue;
        }
        neighbor.setIgnore();
        this.openSet.push(neighbor);
    }
};

module.exports = ChunkAreaFinder;