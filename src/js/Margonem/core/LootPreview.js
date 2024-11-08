var tpl = require('core/Templates');
//var Items = require('core/items/ItemsManager');
module.exports = function() {
    var content;
    let fetchCounter = 0;
    const amountOfFetches = 2;

    this.tpls = [];
    this.content = [];
    this.reagents = [];
    this.recipePreview = false;

    this.init = function() {
        this.initWindow();
        this.initFetch();
        this.initScrollBar();
    };

    this.initScrollBar = () => {
        this.wnd.$.find('.scroll-wrapper').addScrollBar({
            track: true
        });
    };

    this.initFetch = () => {
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_TPL_PREVIEW, this.newTplPreview);
        Engine.tpls.fetch(Engine.itemsFetchData.NEW_OPEN_TPL, this.newOpenItem);
    };

    this.newOpenItem = (i, finish) => {
        let parent = i.isItem() ? Engine.items : Engine.tpls;
        let $clone = parent.createViewIcon(i.id, Engine.itemsViewData.OPEN_PREVIEW_ITEM_VIEW, 's')[0];
        Engine.lootPreview.wnd.$.find('.item-container').append($clone);
        //if (!i.hasMenu) return;

        $clone.css('cursor', `url(../img/gui/cursor/5n.png?v=${__build.version}), auto`);
        $clone.contextmenu(function(e, mE) {
            i.createOptionMenu(getE(e, mE));
            //e.preventDefault();
        });

        this.wnd.title(i.name);
        if (finish) {
            fetchCounter++;
            if (fetchCounter === amountOfFetches) this.afterFetch();
        }
    };

    this.afterFetch = () => {
        fetchCounter = 0;
        this.tpls = this.prepareTplsArray();
        this.tpls.map(item => {
            const
                type = this.getType(item.id),
                selfItemAsContent = item.id === this.tplId;
            this.createPreviewItem({
                item,
                type,
                selfItemAsContent
            });
        });
    }

    this.newTplPreview = (i, finish) => {
        if (finish) {
            if (!this.recipePreview) {
                this.wnd.$.find('.scroll-pane').empty();
            }
            fetchCounter++;
            if (fetchCounter === amountOfFetches) this.afterFetch();
        }
    };

    this.prepareTplsArray = () => {
        const items = [...this.content, ...this.reagents];

        return this.sortTpls(items.map(({
            id,
            amount
        }) => {
            const loc = id === this.tplId ? 's' : 'p';
            const tpl = Engine.tpls.getTplByIdAndLoc(id, loc);
            return {
                ...tpl,
                ...{
                    amount
                }
            }
        }));
    }

    this.getType = (id) => {
        return this.content.find(x => x.id === id) ? 'content' : 'reagents';
    }

    this.sortTpls = (data) => {
        return Object.values(data).sort((a, b) =>
            b.itemTypeSort - a.itemTypeSort || // sort by type
            b.pr - a.pr || // sort by price
            a.name.localeCompare(b.name) // sort alphabetically
        );
    };

    this.createPreviewItem = ({
        item: i,
        type,
        selfItemAsContent = false
    }) => {
        const
            $item = tpl.get('loot-preview-one-item'),
            parent = i.isItem() ? Engine.items : Engine.tpls,
            loc = !selfItemAsContent ? 'p' : 's',
            $clone = parent.createViewIcon(i.id, Engine.itemsViewData.PREVIEW_ITEM_VIEW, loc)[0];
        let destination = this.recipePreview ? `.${type}-list` : ''; // default .scroll-pane

        $item.find('.item-wrapper').append($clone);
        $item.find('.name-wrapper').append(i.name);
        $item.find('.amount-wrapper').append(`x${i.amount}`);
        Engine.lootPreview.wnd.$.find(`.scroll-pane ${destination}`).append($item);
        Engine.lootPreview.wnd.$.removeClass('v-hidden');
        $('.scroll-wrapper', content).trigger('update');
        Engine.lootPreview.wnd.center();

        //if (!i.hasMenu) return;
        this.addContextMenu(i, $clone);
    };

    this.addContextMenu = (i, $clone) => {
        $clone.css('cursor', `url(../img/gui/cursor/5n.png?v=${__build.version}), auto`);
        $clone.contextmenu(function(e, mE) {
            i.createOptionMenu(getE(e, mE));
            //e.preventDefault();
        });
    };

    this.update = function(v) {
        let desc = '';
        this.tplId = v.tpl_id;
        this.recipePreview = isset(v.reagents);
        this.reagents = [];
        this.content = v.content;
        this.wnd.$.find('.scroll-pane').empty();
        this.wnd.$.find('.item-container').empty();
        if (this.recipePreview) {
            this.setRecipePreview(v);
            desc = _t('desc', null, 'recipe_preview');
        } else {
            desc = v.type === 'lootbox' ? _t('will_get') : _t('shuffle')
        }
        this.wnd.$.find('.items-txt').html(desc);
    };

    this.setRecipePreview = (v) => {
        this.reagents = v.reagents;
        let recipeContent = tpl.get('recipe-preview-content');
        this.wnd.$.find('.scroll-pane').html(recipeContent);
        this.wnd.$.find('.content-txt').text(_t('result', null, 'recipe_preview'));
        this.wnd.$.find('.reagents-txt').text(_t('reagents', null, 'recipe_preview'));
    };

    this.initWindow = function() {
        content = tpl.get('loot-preview');

        Engine.windowManager.add({
            content: content,
            //nameWindow        : 'loot-preview',
            nameWindow: Engine.windowsData.name.LOOT_PREVIEW,
            type: Engine.windowsData.type.TRANSPARENT,
            nameRefInParent: 'wnd',
            objParent: this,
            title: _t('items_list'),
            addClass: 'fixed-wnd v-hidden',
            onclose: () => {
                this.close();
            }
        });
        //this.wnd.$.addClass('fixed-wnd v-hidden');
        this.wnd.addToAlertLayer();
    };

    this.close = () => {
        //Engine.tpls.removeCallback('p', this.newTplPreview);
        Engine.tpls.removeCallback(Engine.itemsFetchData.NEW_TPL_PREVIEW);
        Engine.tpls.deleteMessItemsByLoc('p');
        // Engine.tpls.removeCallback('s', this.newOpenItem);
        Engine.tpls.removeCallback(Engine.itemsFetchData.NEW_OPEN_TPL);
        Engine.tpls.deleteMessItemsByLoc('s');
        //this.wnd.$.remove();
        this.wnd.remove();
        Engine.lootPreview = false;
        //delete (this.wnd);
        //delete(this);
    };

    //this.init();
};