/**
 * Created by lukasz on 2014-10-09.
 */
module.exports = new(function() {
    var ls = localStorage;
    var storageName = 'Margonem';
    var data = null;
    var self = this;

    var save = function() {
        ls.setItem(storageName, JSON.stringify(data));
    };

    this.checkToResetLocalStorage = function() {
        var version = this.get('version');

        if (!version) {
            this.resetLocalStorage();
        } else {
            if (version != CFG.storage.version) {
                this.resetLocalStorage();
            }
        }
    };

    this.resetLocalStorage = function() {
        for (let i = 0; i < CFG.storage.keysToRemove.length; i++) {
            if (this.get(CFG.storage.keysToRemove[i]))
                this.remove(CFG.storage.keysToRemove[i]);
        }
        this.setStorageVersion();
    };

    this.setStorageVersion = function() {
        this.set('version', CFG.storage.version);
    };

    this.get = function(name, default_value) {
        var path = name.split('/');
        var root = data;
        while (path.length) {
            var first = path.splice(0, 1)[0];
            if (typeof(root[first]) != 'undefined') root = root[first];
            else {
                return typeof(default_value) == 'undefined' ? null : default_value;
            }
        }
        return root;
    };

    this.set = function(name, value) {
        var path = name.split('/');
        var root = data;
        while (path.length > 1) {
            var first = path.splice(0, 1)[0];
            if (typeof(root[first]) == 'undefined') root[first] = {};
            root = root[first];
        }
        root[path[0]] = value;
        save();
    };

    this.easySet = function(value) { // deep and deeper arguments
        if (arguments.length < 2) {
            console.error('[Storage.js, easySet, Incorrect quantity arguments]', arguments)
            return
        }
        let index = 1;
        let path = '';

        while (arguments[index]) {
            let p = arguments[index];
            if (!p) {
                console.error('[Storage.js, easySet, Incorrect path value]', p);
                return;
            }
            path += arguments[index] + '/'
            index++;
        }


        self.set(path.slice(0, -1), value);
    }

    this.easyGet = function() { // deep and deeper arguments
        if (!arguments.length) {
            console.error('[Storage.js, easyGet, Incorrect quantity arguments]', arguments)
        }

        let index = 0;
        let path = '';

        while (arguments[index]) {
            let p = arguments[index];
            if (!p) {
                console.error('[Storage.js, easyGet, Incorrect path value]', p);
                return
            }
            path += arguments[index] + '/'
            index++;
        }

        return self.get(path.slice(0, -1));
    }

    this.remove = function(name, onlyWarning) {
        var path = name.split('/');
        var root = data;
        var propertyToRemove = path.splice(0, 1)[0];
        while (path.length >= 1) {
            root = root[propertyToRemove];
            propertyToRemove = path.splice(0, 1)[0];
        }
        if (typeof(root[propertyToRemove]) == 'undefined') {
            if (onlyWarning) {
                warningReport("Storage.js", "remove", name + " not found in storage")
                return
            }
            throw name + " not found in storage";

        }
        delete(root[propertyToRemove]);
        save();
    };

    data = JSON.parse(ls.getItem('Margonem'));
    if (data == null) {
        data = {};
        save();
    }
})();