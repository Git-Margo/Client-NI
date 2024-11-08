var CostNode = function(node) {
    this.node = node;
    this.fScore = null;
};

CostNode.prototype.setScore = function(node) {
    var hceResult = this.node.getHCETo(node);
    this.fScore = this.node.getGScore() + hceResult;
};

CostNode.prototype.isLowerScore = function(costNode) {
    return this.fScore < costNode.fScore;
};

module.exports = CostNode;