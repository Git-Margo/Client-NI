module.exports = function() {

    var self = this;

    this.items = [];

    this.init = function() {};

    this.addItem = (item, loc, clb) => {
        this.items.push({
            id: item.id,
            loc: loc
        });
        //this.markItem(item.id, true);
        this.createMoveItem(item.id, clb);
    };

    this.createMoveItem = (id, clb) => {
        let item = Engine.items.getItemById(id);
        let views = Engine.items.getAllViewsById(id);
        let cl = 'moved disable-item-mark';

        this.addChooseToViews(id, views, cl, clb);
    };

    this.removeMoveItem = (id) => {
        let item = Engine.items.getItemById(id);
        let views = Engine.items.getAllViewsById(id);
        let cl = 'moved disable-item-mark';

        this.removeClassFromElements(views, cl);
    };

    this.removeItem = (itemId) => {
        this.items = this.items.filter(function(it) {
            //if (it.id == itemId) self.markItem(it.id, false);
            if (it.id == itemId) self.removeMoveItem(it.id);
            return it.id != itemId; // remove item with requested id
        });
    };

    this.removeItemsByTarget = (loc, excludes = []) => {
        this.items = this.items.filter((it) => {
            const itemId = parseInt(it.id);
            if (excludes.length === 0) {
                if (it.loc === loc) self.removeMoveItem(itemId);
                return it.loc !== loc; // remove all items with requested loc
            } else {
                if (it.loc === loc && !excludes.includes(itemId)) self.removeMoveItem(itemId);
                return it.loc !== loc || excludes.includes(itemId) // remove all items with requested loc or isset in excludes
            }
        });
    };

    this.addChooseToViews = (id, elements, cl, clb) => {
        let a = Array.isArray(elements) ? elements : [elements];
        for (let $view of a) {
            this.addChooseToOneView(id, $view, cl, clb)
        }
    };

    this.addChooseToOneView = (id, $view, cl, clb) => {
        let $chooseIcon = $view.find('.choose-icon');

        if ($chooseIcon.length) return;

        let $icon = $('<div>').addClass('choose-icon');
        let $clickArea = $('<div>').addClass('click-area');

        $view.addClass(cl);
        $view.append($icon);
        $view.append($clickArea);


        $clickArea.click((e) => {
            e.stopPropagation();
            //this.removeItem(id);
            if (!clb) return;
            clb();
        })

    };

    this.removeChooseIcon = ($item) => {
        $item.find('.choose-icon').remove();
        $item.find('.click-area').remove();
    };

    this.removeClassFromElements = (elements, cl) => {
        let a = Array.isArray(elements) ? elements : [elements];
        for (let i of a) {
            i.removeClass(cl);
            this.removeChooseIcon(i);
        }
    };
};