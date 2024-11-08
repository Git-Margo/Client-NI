var Updateable = function() {};
Updateable.prototype.updateDATA = function(data, allData, additionalData) {
    //try{
    var old = $.extend({}, this.d);
    if (isset(this.beforeUpdate) && typeof this.beforeUpdate == 'function') this.beforeUpdate(data, old, allData, additionalData);
    for (var i in data) {
        if (isset(this.onUpdate) && typeof this.onUpdate[i] == 'function')
            //typeof this.onUpdate[i].call(this, data[i], this.d[i], data);
            this.onUpdate[i].call(this, data[i], this.d[i], data, allData);
        this.d[i] = data[i];
    }
    if (isset(this.afterUpdate) && typeof this.afterUpdate == 'function') this.afterUpdate(data, old, allData);
    //}catch(e){
    //	console.trace('Error in updateable');
    //	console.log(e)
    //}
};

module.exports = Updateable;