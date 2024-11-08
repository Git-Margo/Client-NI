var BaseMap = require("core/searchPath/maps/BaseMap");

var SearchPathMap = function(size) {
    BaseMap.call(this, size.x, size.y, 8);
    var nodes = [];
    var chunks = [];

    for (var y = 0; y < this.getHeight(); y++) {
        for (var x = 0; x < this.getWidth(); x++) {
            var node = this.createNode(x, y);
            nodes[node.id] = node;
        }
    }

    this.setNodes(nodes);

    for (var y = 0; y < this.getChunksRows(); y++) {
        for (var x = 0; x < this.getChunksInRow(); x++) {
            chunks.push(this.createChunk(x, y));
        }
    }
    this.setChunks(chunks);
    this.createNeighborConnections();
};

SearchPathMap.prototype = Object.create(BaseMap.prototype);
SearchPathMap.prototype.constructor = SearchPathMap;

module.exports = SearchPathMap;