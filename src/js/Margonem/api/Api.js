var Storage = require('core/Storage');
// var Window = require('core/Window');
var Templates = require('core/Templates');
module.exports = new(function() {

    var eventHandlers = {};

    this.init = function() {
        this.Storage = Storage;
        // this.Window = Window;
        this.Templates = Templates;
    };

    this.callEvent = function(eventName, eventData) {
        if (!eventHandlers[eventName]) return;
        var handlers = eventHandlers[eventName];
        for (var i = 0; i < handlers.length; i++) {
            var handler = handlers[i];
            handler(eventData);
        }
    };

    this.checkCorrectEvent = (event) => {
        let apiData = Engine.apiData;

        for (let k in apiData) {
            if (apiData[k] == event) return true
        }

        return false;
    }

    this.addCallbackToEvent = function(eventName, callback) {

        if (!this.checkCorrectEvent(eventName)) {
            errorReport('Api.js', 'addCallbackToEvent', `Event name "${eventName}" not exist in ApiData!`);
        }

        var data = this.getData(eventName);
        if (!isset(eventHandlers[eventName])) eventHandlers[eventName] = [];
        var handlers = eventHandlers[eventName];

        var l = handlers.length;
        if (handlers.indexOf(callback) > -1) throw 'this callback already exist ' + callback;
        handlers.push(callback);
        for (var id in data) {
            handlers[l](data[id]);
        }
    };

    this.removeCallbackFromEvent = function(eventName, callback) {
        if (!this.checkCorrectEvent(eventName)) {
            errorReport('Api.js', 'removeCallbackFromEvent', `Event name "${eventName}" not exist in ApiData!`);
        }

        var handlers = eventHandlers[eventName];
        if (!handlers) throw 'No eventName found [' + eventName + ']';
        for (var i = 0; i < handlers.length; i++) {
            if (handlers[i] == callback) {
                handlers.splice(i, 1);
                return;
            }
        }
        throw 'No callback found [' + eventName + ']';
    };

    this.getData = function(eventName) {
        var data = null;
        switch (eventName) {
            case Engine.apiData.NEW_OTHER:
                data = Engine.others.check();
                break;
            case Engine.apiData.NEW_NPC:
                data = Engine.npcs.check();
                break;
            case Engine.apiData.NEW_WARRIOR:
                if (!Engine.battle) return;
                data = Engine.battle.warriorsList;
                break;
            case Engine.apiData.NEW_MSG:
                data = [];
                $('.chat-message').each(function() {
                    data.push([$(this), $(this).data('data')]);
                });
                break;
            default:
                data = {};
                break;
        }
        return data;
    };

    this.init();

})();