var BaseMap = require("core/searchPath/maps/BaseMap");
var ContextMapNode = require("core/searchPath/nodes/ContextMapNode");

var ContextMap = function(map) {
    //var t0 = performance.now();
    this.map = new BaseMap(map.getWidth(), map.getHeight(), map.getChunkSize());

    var nodes = map.getNodes().map((a) => new ContextMapNode(a));
    this.map.setNodes(nodes);
    nodes.forEach((a) => a.createNeighborsConnections(this.map));

    //var chunks = map.getChunks().map((a) => new ContextMapChunk(a, this.map));
    this.map.setChunks(map.getChunks());

    //nodes.forEach((a) => a.createChunkConnections(this.map));

    //console.log(this);
    //var t1 = performance.now();
    //console.log('ContextMap done in ' + (t1 - t0) + ' ms');
};

ContextMap.prototype.getNode = function(x, y) {
    return this.map.getNode(x, y);
};

ContextMap.prototype.clearContext = function() {
    var nodes = this.map.getNodes();
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].clearContext();
    }
};
ContextMap.prototype.clearDisables = function() {
    var nodes = this.map.getNodes();
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].clearDisable();
    }
};
module.exports = ContextMap;