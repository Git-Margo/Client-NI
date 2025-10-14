/**
 * Created by lukasz on 09.09.14.
 */
var SearchPath = require('@core/searchPath/SearchPath');
module.exports = function() {
    /**
     * Collisions:
     * 1 - solid
     * 2 - npc
     * 4 - map borders
     */
    var self = this;
    var tmp_cl = null;
    var col = [];
    var rowSize = null,
        colSize = null;
    var queue = [];
    var loaded = false;

    let cacheData = true;
    let cacheCol = {};


    var lock = null;

    this.flushQueue = function() {
        for (var i = 0; i < queue.length; i++) {
            var q = queue[i];
            this.set(q.x, q.y, q.type);
        }
        queue = [];
    };

    function dec2Bin(dec) {
        return Number(dec).toString(2);
    }

    this.set = function(x, y, type) {
        if (rowSize == null) {
            queue.push({
                x: x,
                y: y,
                type: type
            });
            return;
        }
        if (loaded) {
            SearchPath.changeCollision(x, y, type);
        }
        col[y * rowSize + x] |= type;
    };

    this.unset = function(x, y, type) {
        var id = y * rowSize + x;
        col[id] &= ~type;
        SearchPath.changeCollision(x, y, col[id]);
    };

    /**
     * Checks if given field has a collision and return its value, 0 means no collision
     * @param x - coordinates
     * @param y
     * @param type [optional] collision type
     */
    this.check = function(x, y, type) {
        if (x < 0 || y < 0 || x > rowSize - 1 || y > colSize - 1) return 4;
        var field = col[x + y * rowSize];
        if (!isset(field)) return 0;
        if (isset(type)) return field & type;
        return field;
    };

    this.setMapSize = function(obj) {
        rowSize = obj.x;
        colSize = obj.y;
        lock.unlock('map');
    };

    this.setCl = function(cl) {
        tmp_cl = cl;
        lock.unlock('cl');
        Engine.lock.remove('cl');
    };

    this.setStaticCols = function() {
        var idx = 0,
            tc = new Array;
        for (var i = 0; i < tmp_cl.length; i++) {
            var a = tmp_cl.charCodeAt(i);
            if (a > 95 && a < 123)
                for (var j = 95; j < a; j++)
                    for (var k = 0; k < 6; k++) tc[idx++] = 0;
            else {
                a -= 32;
                for (var j = 0; j < 6; j++) tc[idx++] = (a & Math.pow(2, j)) ? 1 : 0;
            }
        }
        for (var i = 0; i < tc.length; i++) {
            this.set(i % rowSize, Math.floor(i / rowSize), tc[i]);
        }
    };

    this.setStaticColsCache = function() {
        let id = Engine.map.d.id;
        if (cacheCol[id]) {
            col = JSON.parse(JSON.stringify(cacheCol[id].col));
            return
        } else {
            cacheCol[id] = {
                col: null,
                index: []
            };
        }

        var idx = 0,
            tc = new Array;
        for (var i = 0; i < tmp_cl.length; i++) {
            var a = tmp_cl.charCodeAt(i);
            if (a > 95 && a < 123)
                for (var j = 95; j < a; j++)
                    for (var k = 0; k < 6; k++) tc[idx++] = 0;
            else {
                a -= 32;
                for (var j = 0; j < 6; j++) tc[idx++] = (a & Math.pow(2, j)) ? 1 : 0;
            }
        }

        for (var i = 0; i < tc.length; i++) {
            let x = i % rowSize;
            let y = Math.floor(i / rowSize);
            let field = x + y * rowSize;
            this.set(x, y, tc[i]);

            if (col[field]) cacheCol[id].index.push(field);
        }

        cacheCol[id].col = JSON.parse(JSON.stringify(col));

    };

    this.onClear = function() {
        tmp_cl = null;
        col = [];
        rowSize = null;
        colSize = null;
        queue = [];

        if (typeof RUNNING_UNIT_TEST === "undefined") {
            //to fix: illegal constructor
            lock = new Lock(['map', 'cl'], function() {
                loaded = false;
                self.setStaticCols();

                if (cacheData) self.setStaticColsCache();
                else self.setStaticCols();

                self.flushQueue();
                SearchPath.readCollisions(self);

                if (cacheData) SearchPath.readCollisions(cacheCol[Engine.map.d.id].index, true);
                else SearchPath.readCollisions(self, false);

                loaded = true;
            });
        }


        //Engine.lock.add('cl');
    };

    this.test = function() {
        var str = "";
        for (var i = 0; i < col.length; i++) {
            str += (!(i % rowSize) ? "\n" : '') + this.check(i % rowSize, Math.floor(i / rowSize));
        }
        console.log(str);
        console.log(rowSize);
        console.log("length: " + col.length)
    }
};