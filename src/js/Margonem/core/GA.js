var Storage = require('core/Storage');
var ItemState = require('core/items/ItemState');

module.exports = function() {
    this.init = () => {

    };

    this.onRequest = (request, data) => {
        // if ((request === '_' && !isset(data.item)) || _l() !== 'en') return;
        if ((request === '_' && !isset(data.item)) || !isEn()) return;

        var requestString = 't=' + request;
        var searchParams = new URLSearchParams(requestString);

        switch (searchParams.get('t')) {
            case 'creditshop': // enter premium shop
                this.send('premiumShop', 'enter', 'Enter to the premium shop');
                break;
            case 'shop': //buy only premium shop
                if (searchParams.get('buy')) {
                    if (!data.item || !Engine.shop.wnd ||
                        (!Engine.shop.wnd.$.find('.shop-content').hasClass('normal-shop-sl') &&
                            !Engine.shop.wnd.$.find('.shop-content').hasClass('pet-shop-sl'))) return;
                    var items = searchParams.get('buy').split(';');
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i].split(','),
                            itemID = item[0],
                            amount = item[1],
                            tpl = Engine.tpls.getTplByIdAndLoc(itemID, 'n'),
                            name = tpl.name,
                            price = tpl.pr * amount;

                        this.send('premiumShop', 'purchase', 'Premium Purchase: ' + amount + ' x ' + name, price);
                    }
                }
                break;
            case 'talk':
                if (Engine.map.d.id == 3877) { //tutorial map
                    if (searchParams.get('id') == 113018 && searchParams.get('c') == "q.696.55") { //skip tutorial
                        this.send('tutorial', 'skipped', 'Tutorial skipped');
                    }
                    if (searchParams.get('id') == 113018 && searchParams.get('c') == "q.696.42" && data.item) { //player got crafting items
                        this.send('tutorial', 'playerDead', 'Player has gotten crafting items');
                        Storage.set('tutorialCraftingStartTime', Date.now());
                    }
                    if (searchParams.get('id') == 113074 && searchParams.get('c') == "q.696.51") { //finish` tutorial
                        this.send('tutorial', 'Complete', 'tutorial-10-april-2019');
                    }
                }
                if (Engine.map.d.id == 3881) {
                    if ((searchParams.get('id') == 113386 || searchParams.get('id') == 113387) && searchParams.get('c') == "1.1") { //player has ben healed by npc
                        this.send('tutorial', 'playerHealed', '[Forest Retreat] Player has been healed by NPC.');
                    }
                }
                break;
            case 'init': //dead
                if (Engine.map.d.id == 3877) {
                    if (searchParams.get('initlvl') == 4 && data.dead) {
                        var opponentId = Object.keys(data.f.w)[1], //always second key for this case
                            opponentName = data.f.w[opponentId].name;
                        this.send('tutorial', 'playerDead', 'Player has been killed by ' + opponentName);
                    }
                }
                break;
            case 'fight': //fight with mob
                if (Engine.map.d.id == 3877) {
                    return;
                    if (searchParams.get('id')) {
                        var mobId = Math.abs(searchParams.get('id')),
                            mobName = Engine.npcs.getById(mobId).d.nick;
                        this.send('tutorial', 'playerAttack', 'Player has attacked ' + mobName);
                    }
                }
                break;
            case 'craft': //player have crafted item
                if (Engine.map.d.id == 3877) {
                    if (searchParams.get('a') == 'use' && data.item) {
                        this.send('tutorial', 'craft', 'Player has crafted an item');
                        var tutorialCraftingStartTime = Storage.get('tutorialCraftingStartTime');
                        if (tutorialCraftingStartTime) {
                            let timeSec = (Date.now() - tutorialCraftingStartTime) / 1000;
                            let timeMin = (timeSec / 60).toFixed(1);
                            this.send('tutorial', 'craft', `Player has crafted an item in ${timeMin}min (${timeSec.toFixed(1)}s)`);
                        }
                    }
                }
                break;
            case 'moveitem': //player learn recipe
                if (Engine.map.d.id == 3877) {
                    if (data.msg && data.msg[0].includes("You have learned recipe")) {
                        this.send('tutorial', 'craft', 'Player has learned recipe');
                    }
                }
                break;
            case '_':
                if (
                    isset(data.item) &&
                    Engine.map.d.id == 1 &&
                    isset(data.msg) &&
                    data.msg[0].includes('You are now under a spell:')
                ) {
                    for (let key in data.item) {
                        const item = data.item[key];
                        //if (item.hasOwnProperty('st') && item.st === 10 && this.watchedItems.includes(item.name)) {
                        if (item.hasOwnProperty('st') && ItemState.isBlessSt(item.st) && this.watchedItems.includes(item.name)) {
                            //const stats = Engine.items.parseItemStat(item.stat);
                            //if (stats.ttl === "19") { // problem with ttl=20 & ttl=19
                            const text = item.name !== 'Cooldown' ? '[Blessed Shrine] Player has drawn BLESS' : '[Blessed Shrine] Player has removed the blessing (Cooldown).';
                            this.send('tutorial', 'playerBlessed', text);
                        }
                    }
                }
                break;
        }
        // console.log(searchParams.get('t'));
        // console.log(request, data);
    };

    this.send = function(category, action, label, value = '') {
        ma.trackEvent(category, action, label, value);
    };

    this.watchedItems = [
        'Blessing of Adventure',
        'Blessing of Deadly Strikes',
        'Blessing of Defense',
        'Blessing of Divine Favor',
        'Blessing of Knowledge',
        'Blessing of Magical Prowess',
        'Blessing of Nimbleness',
        'Blessing of Obstacle',
        'Blessing of Perception',
        'Blessing of Soul',
        'Blessing of Swiftness',
        'Blessing of Vigor',
        'Blessing of Vitality',
        'Enchanted Blessing of Adventure',
        'Enchanted Blessing of Deadly Strikes',
        'Enchanted Blessing of Defense',
        'Enchanted Blessing of Divine Favor',
        'Enchanted Blessing of Knowledge',
        'Enchanted Blessing of Magical Prowess',
        'Enchanted Blessing of Nimbleness',
        'Enchanted Blessing of Obstacle',
        'Enchanted Blessing of Perception',
        'Enchanted Blessing of Soul',
        'Enchanted Blessing of Swiftness',
        'Enchanted Blessing of Vigor',
        'Enchanted Blessing of Vitality',
        'Greater Blessing of Adventure',
        'Greater Blessing of Deadly Strikes',
        'Greater Blessing of Defense',
        'Greater Blessing of Divine Favor',
        'Greater Blessing of Knowledge',
        'Greater Blessing of Magical Prowess',
        'Greater Blessing of Nimbleness',
        'Greater Blessing of Obstacle',
        'Greater Blessing of Perception',
        'Greater Blessing of Soul',
        'Greater Blessing of Swiftness',
        'Greater Blessing of Vigor',
        'Greater Blessing of Vitality',
        'Lesser Blessing of Adventure',
        'Lesser Blessing of Deadly Strikes',
        'Lesser Blessing of Defense',
        'Lesser Blessing of Divine Favor',
        'Lesser Blessing of Knowledge',
        'Lesser Blessing of Magical Prowess',
        'Lesser Blessing of Nimbleness',
        'Lesser Blessing of Obstacle',
        'Lesser Blessing of Perception',
        'Lesser Blessing of Soul',
        'Lesser Blessing of Swiftness',
        'Lesser Blessing of Vigor',
        'Lesser Blessing of Vitality',
        'Cooldown'
    ];
};