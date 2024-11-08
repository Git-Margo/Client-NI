module.exports = function() {
    var running = false;
    var $style = null;
    var origAppend = null;
    var $defImg = null;
    var msgs = [];
    var emoArray = {
        '8p': [':p'],
        'aww': [':ahh'],
        'biggrin': [';d', ':d'],
        'blush': [';wstydnis', ':wstydnis'],
        'boogie': [':tanczy'],
        'crying': [';('],
        "doh": ['x|'],
        "eek": [':|'],
        'evileye': [';>', ':>'],
        'evillaugh': [']:->', '];->'],
        'hmm': [':\\'],
        'kiss': [';*', ':*'],
        'lol': [';)))', ':)))'],
        'mad': [':x', ';x'],
        'o_o': [';o', ':o'],
        'oops': [':oops'],
        'razz': [';p'],
        'rotfl': [':rotfl'],
        'sad': [':('],
        'smile': [':)'],
        'smirk': [';]', ':]'],
        'thanks': [':thx'],
        'upset': [':/'],
        'wink': [';)'],
        'xd': ['xd'],
        'zombie': [':zombie']
    };

    function getEmoImg(emo) {
        var emo = emo.toLowerCase();
        for (var t in emoArray) {
            var ar = emoArray[t];
            for (var i in ar) {
                if (ar[i] == emo) {
                    return t;
                }
            }
        }
        return null;
    }

    function storeOldMessage($e, content) {
        var obj = {
            $el: $e,
            $old: content
        }
        for (var t in msgs) {
            if (msgs[t].$el == obj.$el) {
                msgs[t].$old = obj.$old;
                return;
            }
        }
        msgs.push(obj);
    }

    function restoreMessage(obj) {
        var content = obj.$el.children().eq(2);
        content.empty().append(obj.$old);
    }

    function parseChatMsg(e) {
        var $el = e[0];
        var obj = e[1];
        if (obj.s != "abs" && obj.s != "") return;
        var content = $el.children().eq(2).contents();
        var clone = content.clone(true, true);
        storeOldMessage($el, clone);
        var textContent = content.filter(function() {
            return this.nodeType === 3;
        });
        for (var t = 0; t < textContent.length; t++) {
            var text = textContent.eq(t);
            text.replaceWith(parseEmots(text.text()));
        }
    }

    function parseEmots(txt) {
        var ret = [];
        var words = txt.split(" ");
        for (var t in words) {
            var word = words[t];
            var img = getEmoImg(word);
            ret.push(document.createTextNode(" "));
            if (img !== null) {
                var $emo = $defImg.clone(true);
                $emo.attr("data-tip", word);
                //$emo.attr("src", "https://margonem.pl/obrazki/emots/" + img + ".gif");
                $emo.attr("src", "https://micc.garmory-cdn.cloud/obrazki/emots/" + img + ".gif");
                ret.push($emo);
            } else {
                ret.push(document.createTextNode(word));
            }
        }
        return ret;
    }

    this.start = function() {
        if (running) return;
        running = true;
        $style = $("<style>" +
            ".emots{" +
            "height: 13px;" +
            "position: relative;" +
            "top: 2px;" +
            "}" +
            "</style>").appendTo("head");
        $defImg = $("<img>").addClass("emots");
        API.addCallbackToEvent(Engine.apiData.NEW_MSG, parseChatMsg);
        API.addCallbackToEvent(Engine.apiData.UPDATE_MSG, parseChatMsg);
    };

    this.stop = function() {
        if (!running) return;
        running = false;
        API.removeCallbackFromEvent(Engine.apiData.NEW_MSG, parseChatMsg);
        API.removeCallbackFromEvent(Engine.apiData.UPDATE_MSG, parseChatMsg);
        $style.remove();
        for (var t in msgs) {
            restoreMessage(msgs[t]);
        }
        msgs = [];
    };

};