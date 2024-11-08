var RefUsedSet = function() {
    this.set = [0];
};
RefUsedSet.prototype.getFree = function() {
    for (var id = 0; id < this.set.length; id++) {
        if (this.set[id] <= 0) {
            this.set[id];
            return id;
        }
    }
    this.set.push(0);
    return this.set.length - 1;
};

RefUsedSet.prototype.use = function(id) {
    this.set[id]++;
    //console.log('alloc new zoneId ' + id + '(' + this.set[id] + ')');
    return id;
};

RefUsedSet.prototype.release = function(id) {
    this.set[id]--;
    //console.log('release zoneId ' + id + '(' + this.set[id] + ')');
    return null;
};

module.exports = RefUsedSet;