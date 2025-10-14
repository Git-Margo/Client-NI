var GroupFinder = require('@core/searchPath/finder/GroupFinder');
var PathFinder = require('@core/searchPath/finder/PathFinder');
var ContextMapNode = require('@core/searchPath/nodes/ContextMapNode');
var ContextMap = require('@core/searchPath/maps/ContextMap');

var SearchContext = function(map, destinationPosition) {
    this.map = map;
    this.destinationPosition = destinationPosition;
    this.endNode = null;
    this.map.clearDisables();
};

/**
 * Find and return road from source to one of destionation nodes
 * @param {number} sourceNodeX - x for source node
 * @param {number} soruceNodeY - y for source node
 * @param {ContextMapNode[]} oldRoad - list of previous returned road (optional)
 * @returns {ContextMapNode[]} - road
 */
SearchContext.prototype.getRoad = function(sourceNodeX, soruceNodeY, oldRoad) {
    var sourceNode = this.map.getNode(sourceNodeX, soruceNodeY);
    var destinationNodes = this.getNearestDestination(sourceNode);
    this.map.clearContext();
    var pathFinder = new PathFinder(sourceNode, destinationNodes);
    pathFinder.finalize();
    var road = this.reconstructRoad(pathFinder.endNode, sourceNode);

    if (road.length === 0)
        road = this.breakRoad(sourceNode, oldRoad);

    if (road.length > 0)
        this.endNode = road[0];
    return road;
};

/**
 * Find node by x and y and set collision on this node
 * @param {number} x
 * @param {number} y
 */
SearchContext.prototype.disableNode = function(x, y) {
    var node = this.map.getNode(x, y);
    node.disableNode();
};

/**
 * Find a destination node which you can go to it
 * @param {ContextMapNode} sourceNode - a node which the player current stays on
 * @returns {ContextMapNode[]} - propably destinations (returns more than one when a player cannot go to the wanted node)
 */
SearchContext.prototype.getNearestDestination = function(sourceNode) {
    var destinationNode = this.map.getNode(this.destinationPosition.x, this.destinationPosition.y);
    if (!destinationNode.isConnectedWith(sourceNode)) {
        var groupFinder = new GroupFinder(destinationNode, sourceNode);
        groupFinder.finalize();
        this.map.clearContext();
        return groupFinder.getLowerCostNodes();
    }
    return [destinationNode];
};

SearchContext.prototype.breakRoad = function(sourceNode, oldRoad) {
    var newRoad = [];
    var started = false;
    for (var t = oldRoad.length - 1; t > 0; t--) {
        var node = oldRoad[t];
        if (node.isBlocked())
            break;
        if (started)
            newRoad.unshift(node);
        if (!started && node == sourceNode)
            started = true;
    }
    return newRoad;
};

SearchContext.prototype.reconstructRoad = function(endNode, sourceNode) {
    var road = [];
    var currentNode = endNode;
    if (currentNode === null)
        return road;

    while (currentNode != sourceNode) {
        road.push(currentNode);
        currentNode = currentNode.getFrom();
    }
    return road;
};

module.exports = SearchContext;