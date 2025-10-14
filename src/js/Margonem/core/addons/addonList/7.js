const DepoData = require('@core/depo/DepoData');

module.exports = function() {
    var running = false;
    var $style = null;
    var amountCards;

    function addGrid() {
        const ITEM_IN_ROW = DepoData.ITEM_IN_ROW;
        const ITEM_IN_GRID = DepoData.ITEM_IN_GRID;
        const ITEM_IN_COLUMN = DepoData.ITEM_IN_COLUMN;
        const NUMBER_TRANS = 2;

        var end = (amountCards + 1) * ITEM_IN_ROW;
        var start = end - ITEM_IN_ROW;
        var count = 1;
        var add = amountCards * ITEM_IN_GRID;

        for (var y = 0; y < ITEM_IN_COLUMN; y++) {
            for (var x = start; x < end; x++) {
                var $nr = $('<div>').addClass('depo-number').html(count + add).css('position', 'absolute');
                Engine.depo.setPos($nr, x, y, NUMBER_TRANS);
                count++;
            }
        }
    }

    this.start = function() {
        if (running) return;
        running = true;
        addStyles();
        if (Engine.depo) {
            init();
            updateDepo();
        }
        API.addCallbackToEvent(Engine.apiData.DEPO_INIT, init);
        API.addCallbackToEvent(Engine.apiData.CLAN_DEPO_INIT, init);
        API.addCallbackToEvent(Engine.apiData.DEPO_UPDATE, updateDepo);
        API.addCallbackToEvent(Engine.apiData.CLAN_DEPO_UPDATE, updateDepo);
    };

    function addStyles() {
        $style = $("<style>" +
            ".depo-number{" +
            "position: absolute;" +
            "margin-left: 3px;" +
            "z-index: 3;" +
            "color: #dbdbd6;" +
            "text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;" +
            "font-size: 8px;" +
            "user-select: none;" +
            "pointer-events: none;" +
            "}" +
            "</style>").appendTo("head");
    }

    function init() {
        amountCards = 0;
    }

    function updateDepo() {
        if (!Engine.depo) return;
        while (amountCards < Engine.depo.getAmountCards()) {
            addGrid();
            amountCards++;
        }
    }

    this.stop = function() {
        if (!running) return;
        running = false;
        $style.remove();
        $(".depo-number").remove();
        API.removeCallbackFromEvent(Engine.apiData.DEPO_INIT, init);
        API.removeCallbackFromEvent(Engine.apiData.CLAN_DEPO_INIT, init);
        API.removeCallbackFromEvent(Engine.apiData.DEPO_UPDATE, updateDepo);
        API.removeCallbackFromEvent(Engine.apiData.CLAN_DEPO_UPDATE, updateDepo);
    };

};