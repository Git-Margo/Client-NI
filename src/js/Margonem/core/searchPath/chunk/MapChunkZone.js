var MapChunkZone = function(parent, isBlocked, idProvider) {
    this.parent = parent;
    this.closeFlag = isBlocked;
    this.idProvider = idProvider;
    this.nodes = [];
    this.edges = {
        sx: [],
        sy: [],
        mx: [],
        my: []
    };
    this.connectionId = null;
    this.corrupted = false;
};

MapChunkZone.prototype.setCorruption = function() {
    this.corrupted = true;
    this.parent.setToReload();
};

MapChunkZone.prototype.isCorrupted = function() {
    return this.corrupted;
};

MapChunkZone.prototype.clear = function() {
    this.unassignNodes();
    this.connectionId = null;
    this.edges = {
        sx: [],
        sy: [],
        mx: [],
        my: []
    };
};

MapChunkZone.prototype.addNode = function(node) {
    this.nodes.push(node);
};

MapChunkZone.prototype.unassignNodes = function() {
    this.nodes.forEach((a) => {
        a.setChunkZone(null);
    });
    this.nodes = [];
};

MapChunkZone.prototype.setEdges = function(edges) {
    this.edges = edges;
};

MapChunkZone.prototype.hasEdges = function() {
    return this.edges.sx.length > 0 || this.edges.mx.length > 0 || this.edges.sy.length > 0 || this.edges.my.length > 0;
};

MapChunkZone.prototype.getEdges = function() {
    return this.edges;
};

MapChunkZone.prototype.isConnectedWith = function(zone) {
    if (this.connectionId !== null && this.connectionId === zone.connectionId)
        return true;
    return false;
};

MapChunkZone.prototype.setConnectionId = function(id) {
    this.releaseConnectionId();
    this.connectionId = this.idProvider.use(id);
};


MapChunkZone.prototype.isConnected = function(id) {
    return this.connectionId !== null;
};

MapChunkZone.prototype.releaseConnectionId = function() {
    if (this.connectionId !== null)
        this.idProvider.release(this.connectionId);
    this.connectionId = null;
};


module.exports = MapChunkZone;