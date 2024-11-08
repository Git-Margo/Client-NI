var MapChunk = require("core/searchPath/chunk/MapChunk");
var MapChunkZone = require("core/searchPath/chunk/MapChunkZone");
var RefUsedSet = require("core/searchPath/RefUsedSet");
var MapNode = require("core/searchPath/nodes/MapNode");

var BaseMap = function(width, height, chunkSize) {
    this.width = width;
    this.height = height;
    this.chunkSize = chunkSize;
    this.nodes = [];
    this.chunks = [];
    this.zones = [];
    this.chunksInRow = Math.ceil(this.width / this.chunkSize);
    this.chunksRows = Math.ceil(this.height / this.chunkSize);
    this.zoneConnectionIds = new RefUsedSet();
};

BaseMap.prototype.setNodes = function(nodes) {
    this.nodes = nodes;
};
BaseMap.prototype.getNodes = function() {
    return this.nodes;
};
BaseMap.prototype.setChunks = function(chunks) {
    this.chunks = chunks;
};
BaseMap.prototype.getChunks = function() {
    return this.chunks;
};
BaseMap.prototype.getChunkById = function(id) {
    return this.chunks[id];
};
BaseMap.prototype.getWidth = function() {
    return this.width;
};
BaseMap.prototype.getHeight = function() {
    return this.height;
};
BaseMap.prototype.getChunksInRow = function() {
    return this.chunksInRow;
};
BaseMap.prototype.getChunksRows = function() {
    return this.chunksRows;
};
BaseMap.prototype.getChunkSize = function() {
    return this.chunkSize;
};
BaseMap.prototype.createChunk = function(x, y) {
    var id = x * this.chunksInRow + y;
    var chunk = new MapChunk(id, x, y, this.chunkSize, this);
    var chunkNodes = [];
    var sx = x * this.chunkSize;
    var sy = y * this.chunkSize;
    for (var ix = 0; ix < this.chunkSize; ix++)
        for (var iy = 0; iy < this.chunkSize; iy++)
            chunkNodes.push(this.getNode(ix + sx, iy + sy));

    chunk.setNodes(chunkNodes);
    return chunk;
};
BaseMap.prototype.createNode = function(x, y) {
    return new MapNode(x, y, this);
};

BaseMap.prototype.isCorrectPosition = function(x, y) {
    if (x < 0)
        return false;
    if (y < 0)
        return false;
    if (x >= this.getWidth())
        return false;
    if (y >= this.getHeight())
        return false;
    return true;
};

BaseMap.prototype.correctPosition = function(x, y) {
    var obj = {
        x: x,
        y: y
    };
    if (obj.x >= this.getWidth())
        obj.x = this.getWidth() - 1;
    if (obj.y >= this.getHeight())
        obj.y = this.getHeight() - 1;
    return obj;
};

BaseMap.prototype.getNode = function(x, y) {
    var pos = this.correctPosition(x, y);
    var id = pos.y * this.getWidth() + pos.x;
    var node = this.getNodeById(id);
    if (node.isPosition(pos)) {
        return node;
    }
    return null;
};

BaseMap.prototype.getNodeById = function(id) {
    return this.nodes[id];
};

BaseMap.prototype.createNeighborConnections = function() {
    for (var t in this.nodes) {
        this.nodes[t].findAndSetNeighbors(this);
    }
};
BaseMap.prototype.copyCollisionsToNodes = function(colManager) {
    for (var i = 0; i < this.nodes.length; i++) {
        var node = this.nodes[i];
        if (colManager.check(node.x, node.y))
            node.setCollision(true);
    }
};

BaseMap.prototype.copyCollisionsToNodesCache = function(nodeCollisionList) {
    for (var i = 0; i < nodeCollisionList.length; i++) {

        let index = nodeCollisionList[i];
        var node = this.nodes[index];

        node.setCollision(true);
    }
};

BaseMap.prototype.clearIgnores = function() {
    for (var t in this.nodes)
        this.nodes[t].clearIgnore();
};

BaseMap.prototype.reloadCollisionsConnections = function() {
    for (var i = 0; i < this.chunks.length; i++)
        this.chunks[i].reloadGroups();

    for (var i = 0; i < this.chunks.length; i++)
        this.chunks[i].createConnection();
};

BaseMap.prototype.createChunkZone = function(chunk, isBlocked) {
    var zone = new MapChunkZone(chunk, isBlocked, this.zoneConnectionIds);
    if (!isBlocked) {
        this.createSingleConnectionChunkZone(zone);
    }
    this.zones.push(zone);
    return zone;
};

BaseMap.prototype.removeChunkZone = function(zone) {
    var oldId = zone.connectionId;
    zone.unassignNodes();
    zone.releaseConnectionId();
    this.zones.forEach((a) => {
        if (a.connectionId === oldId)
            a.releaseConnectionId();
    });
    var idx = this.zones.indexOf(zone);
    if (idx !== -1)
        this.zones.splice(idx, 1);
};

BaseMap.prototype.connectNodesChunkZone = function(nodeA, nodeB) {
    this.connectChunkZone(nodeA.chunkZone, nodeB.chunkZone);
};

BaseMap.prototype.createSingleConnectionChunkZone = function(zone) {
    var id = this.zoneConnectionIds.getFree();
    zone.setConnectionId(id);
};

BaseMap.prototype.connectChunkZone = function(zoneA, zoneB) {
    if (zoneA.connectionId === null && zoneB.connectionId === null) {
        var id = this.zoneConnectionIds.getFree();
        zoneA.setConnectionId(id);
        zoneB.setConnectionId(id);
    } else if (zoneA.connectionId === zoneB.connectionId) {
        return;
    } else if (zoneA.connectionId === null) {
        zoneA.setConnectionId(zoneB.connectionId);
    } else if (zoneB.connectionId === null) {
        zoneB.setConnectionId(zoneA.connectionId);
    } else {
        var oldId = zoneB.connectionId;
        var newId = zoneA.connectionId;
        this.zones.forEach((a) => {
            if (a.connectionId === oldId) {
                a.setConnectionId(newId);
            }
        });
    }
};

BaseMap.prototype.getNeighbors = function(node) {
    var ids = [node.id - 1, node.id + 1, node.id - this.getWidth(), node.id + this.getWidth()];
    var neighbors = [];
    for (var t in ids) {
        var id = ids[t];
        var checkNode = this.nodes[id];
        if (isset(checkNode) && node.isNeighbor(checkNode)) {
            neighbors.push(checkNode);
        }
    }
    return neighbors;
};

BaseMap.prototype.generateMap = function() {
    var self = this;
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '10';

    var update = () => {
        const pixelSize = 8;
        canvas.width = this.width * pixelSize + (this.chunksInRow - 1) * pixelSize / 2;
        canvas.height = this.height * pixelSize + (this.chunksRows - 1) * pixelSize / 2;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var i in self.chunks) {
            self.chunks[i].draw(ctx, pixelSize);
        }
        requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
};

module.exports = BaseMap;