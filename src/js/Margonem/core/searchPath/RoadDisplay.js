var RoadDisplay = function() {
    this.road = [];
    this.running = false;
};

RoadDisplay.prototype.draw = function(ctx) {
    var map = Engine.map;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    for (var t in this.road) {
        var point = this.road[t];
        this.drawPoint(ctx, point, map.offset, 10);
    }
    ctx.restore();
};

RoadDisplay.prototype.getOrder = function() {
    if (isset(Engine.map))
        return Engine.map.getOrder() + 1;
    return 1;
};

RoadDisplay.prototype.drawPoint = function(ctx, point, offset, radius) {
    var x = point.x * 32 - offset[0] + 16;
    var y = point.y * 32 - offset[1] + 16;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
};

RoadDisplay.prototype.setRoad = function(road) {
    this.road = [];
    for (var t in road.road) {
        var node = road.road[t];
        this.road.push({
            x: node.x,
            y: node.y
        });
    }
    road.road = [];
    this.running = true;
};

RoadDisplay.prototype.clear = function() {
    this.road = [];
    this.running = false;
};

module.exports = RoadDisplay;