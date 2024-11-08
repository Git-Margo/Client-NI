module.exports = function() {
    var running = false;
    var $style = null;
    var amountCards;

    function addGrid() {
        var end = (amountCards + 1) * 14;
        var start = end - 14;
        var count = 1;
        var add = amountCards * 112;
        for (var y = 0; y < 8; y++) {
            for (var x = start; x < end; x++) {
                var $nr = $('<div>').addClass('depo-number').html(count + add).css('position', 'absolute');
                Engine.depo.setPos($nr, x, y, 2);
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