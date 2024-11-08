/* 
 * Load most needed scripts and initialise game
 */

API = require('api/Api');
window.Engine = new(require('core/Engine'))();


//var A = require('core/Away');
module.exports = new(function() {
    this.stop = function() {
        Engine.stop()
    };
    $(function() {
        Engine.init();
        //new A();
    });
})();