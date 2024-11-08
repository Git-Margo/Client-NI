var BaseConnectionNode = function() {
    this.chunk = null;
    this.chunkZone = null;
};
BaseConnectionNode.prototype.setChunk = function(chunk) {
    this.chunk = chunk;
};
BaseConnectionNode.prototype.setChunkZone = function(zone) {
    this.chunkZone = zone;
};
BaseConnectionNode.prototype.isChunkZoneEmpty = function() {
    return this.chunkZone === null;
};
BaseConnectionNode.prototype.isOnChunk = function(chunk) {
    return this.chunk === chunk;
};
BaseConnectionNode.prototype.isOnSameChunk = function(node) {
    if (this.chunk === null)
        return false;
    if (node.chunk === null)
        return false;
    return this.chunk === node.chunk;
};
BaseConnectionNode.prototype.isConnectedWith = function(node) {
    if (this.chunkZone === null)
        return false;
    if (node.chunkZone === null)
        return false;
    return this.chunkZone.isConnectedWith(node.chunkZone);
};
BaseConnectionNode.prototype.getChunkId = function() {
    if (this.chunk !== null)
        return this.chunk.getId();
    return null;
};

module.exports = BaseConnectionNode;