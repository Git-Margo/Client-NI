module.exports = function() {
    var self = this;
    var running = false;
    var all_tps = [];
    var handle = null;
    var $style = null;

    function check() {
        let now = unix_time(true);
        for (let t in all_tps) {
            let item = all_tps[t];

            updateTimeInItemAndView(item, now)
        }
    }

    function updateTimeInItemAndView(item, now) {
        let val = geValToUpdateTime(item, now);

        if (val != null) updateTime(item, val);
    }

    function geValToUpdateTime(item, now) {
        //if (isset(cachedStats.timelimit)) {
        if (item.issetTimelimitStat()) {

            //let s 		= cachedStats.timelimit.split(",");
            let s = item.getTimelimitStat().split(",");
            let diff = 0;

            if (s.length >= 2) diff = Math.ceil((parseInt(s[1]) - now) / 60);

            return diff;

            //} else if (isset(cachedStats.ttl)) return cachedStats.ttl;
        } else if (item.issetTtlStat()) return item.getTtlStat();

        return null;
    }

    function isCooldownItem(item) {
        //return isset(item._cachedStats.timelimit) || (isset(item._cachedStats.ttl) && item.st > 0 && item.st != 9)
        return item.issetTimelimitStat() || (item.issetTtlStat() && item.st > 0 && item.st != 9)
    }

    function addToAll_Tps(a) {
        all_tps[a.id] = a;
    }

    function newColldownItem(item) {
        if (!isCooldownItem(item)) return;
        let now1 = unix_time(true);

        addToAll_Tps(item);
        appendCooldownElementToItemAndViews(item);
        updateTimeInItemAndView(item, now1);
        addAfterUpdate(item)
    }

    function addAfterUpdate(item) {
        item.on('afterUpdate', function(old) {
            let now2 = unix_time(true);
            updateTimeInItemAndView(item, now2);
        })
    }

    function createCooldownElement() {
        return $('<div>').addClass('cooldown');
    }

    function appendCooldownElementToItemAndViews(item) {

        let item$cooldown = createCooldownElement();
        item.$.append(item$cooldown);

        let views = Engine.items.getAllViewsById(item.id);

        for (let k in views) {
            let $cooldown = createCooldownElement();
            views[k].append($cooldown)
        }
    }

    function updateTime(o, diff) {
        let id = o.id;
        let items = Engine.items.getViews()[id];

        let $cooldown = o.$.find(".cooldown");
        let newVal = diff <= 0 ? '' : diff

        self.setCooldownVal($cooldown, newVal);

        for (let k in items) {
            if (k == 'tip-item') continue;

            let l = items[k].length;
            for (let i = 0; i < l; i++) {

                let $cooldown = items[k][i][0].find(".cooldown");
                let newVal = diff <= 0 ? '' : diff

                self.setCooldownVal($cooldown, newVal);
            }
        }
    }

    this.setCooldownVal = ($cooldown, newVal) => {

        let oldVal = $cooldown.html();

        if (newVal == oldVal) return
        $cooldown.html(newVal);
    }

    this.start = function() {
        if (running) return;

        running = true;
        all_tps = [];
        self.addStyle();
        self.initFetch()

        handle = setInterval(check, 5000);
        check();
    };

    this.initFetch = () => {
        Engine.items.fetch(Engine.itemsFetchData.FETCH_CHECK_IF_TP_ITEM, newColldownItem);
    };

    this.addStyle = () => {
        $style = $("<style>" +
            ".cooldown{" +
            "position: absolute;" +
            "top: 8px;" +
            "width: 32px;" +
            "height: 16px;" +
            "text-align: center;" +
            "text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;" +
            "color: white;" +
            "pointer-events: none;" +
            "}" +
            "</style>").appendTo("head");
    }

    this.stop = function() {
        if (!running) return;

        running = false;
        clearInterval(handle);
        $style.remove();

        Engine.items.removeCallback(Engine.itemsFetchData.FETCH_CHECK_IF_TP_ITEM);
        removeCooldownElementFromAllItem()
        all_tps = [];
    };

    function removeCooldownElementFromAllItem() {
        for (var t in all_tps) {
            let item = all_tps[t];
            removeColdownElementFromItem(item);
        }
    }

    function removeColdownElementFromItem(item) {
        let views = Engine.items.getAllViewsById(item.id);

        item.$.find('.cooldown').remove()

        for (let k in views) {
            views[k].find('.cooldown').remove()
        }
    }

};