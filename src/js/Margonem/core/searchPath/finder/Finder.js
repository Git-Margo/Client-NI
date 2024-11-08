var Finder = function() {
    this.openSet = [];
    this.closeSet = [];
    this.currentNode = null;
};

Finder.prototype.finalize = function() {
    this.prepare();
    while (this.isOpenSetNoEmpty()) {
        this.currentNode = this.getFirstNode();
        this.checkNode();
    }
};

Finder.prototype.prepare = function() {};

Finder.prototype.isOpenSetNoEmpty = function() {
    return this.openSet.length > 0;
};

Finder.prototype.getFirstNode = function() {
    return this.openSet.shift();
};

Finder.prototype.checkNode = function() {
    this.checkNeighbors();
    this.addToCloseSet();
};

Finder.prototype.checkNeighbors = function() {};

Finder.prototype.addToCloseSet = function() {
    this.closeSet.push(this.currentNode);
};

module.exports = Finder;