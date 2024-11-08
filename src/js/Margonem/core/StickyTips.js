module.exports = function() {
    var self = this;
    var maxZIndex = 10;
    let list = {};

    this.init = () => {
        // Engine.interface.$stLayer.on('mousedown', '.tip-wrapper', this.onClick.bind(this));
        // Engine.interface.$stLayer.on('click', '.close', this.onCloseClick.bind(this));
    };

    this.addItemToTip = function(id, tip, itemData) {
        let icon;
        if (itemData.isItem()) {
            //icon  = Engine.items.createViewIcon(id, 'sticky-item')[0][0];
            icon = Engine.items.createViewIcon(id, Engine.itemsViewData.STICKY_ITEM_VIEW)[0][0];
        } else {
            // icon  = Engine.tpls.createViewIcon(id, 'sticky-item', itemData.loc)[0][0];
            icon = Engine.tpls.createViewIcon(id, Engine.itemsViewData.STICKY_ITEM_VIEW, itemData.loc)[0][0];
        }

        let item = tip.querySelector('.item');
        if (item) item.remove();
        let itemHead = tip.querySelector('.item-head');
        itemHead.prepend(icon);
    };

    this.add = (data) => {
        let id = data.id;
        self.deleteIfExist(id);

        //let tipHtml = data.$.attr('data-tip');
        //let tipHtml = data.$.attr('data-tip');
        let tipHtml = data.$.getTipData();
        let tipItemClass = data.$.attr('data-item-type');

        let newTip = document.createElement('div');
        newTip.className = `tip-wrapper sticky-tip sticky-tip-id-${id}`;
        newTip.style.left = '271px';
        newTip.style.top = '70px';
        newTip.style.display = 'block';
        newTip.style.position = 'absolute';
        newTip.setAttribute('data-type', 't_item');
        newTip.setAttribute('data-item-type', tipItemClass);
        newTip.addEventListener('mousedown', this.onMouseDown.bind(this));

        let newTipInner = document.createElement('div');
        newTipInner.className = 'content';
        newTipInner.innerHTML = tipHtml;

        newTip.append(newTipInner);

        this.addCloseBtn(newTip);
        this.addDraggable(newTip);
        this.setZIndex(newTip);
        this.addItemToTip(id, newTip, data);
        Engine.interface.get$stickyTipsLayer()[0].append(newTip);
    };

    this.deleteIfExist = (id) => {
        let el = document.querySelector('.sticky-tip-id-' + id);
        if (!el) return;
        self.close(el);
    };

    this.addDraggable = (item) => {
        return $(item).draggable({
            handle: '.item-head',
            drag: function(evt, ui) {
                const maxW = document.body.clientWidth,
                    maxH = document.body.clientHeight,
                    elW = this.offsetWidth,
                    elH = this.offsetHeight;
                if (ui.position.left < 0) ui.position.left = 0;
                if (ui.position.top < 0) ui.position.top = 0;
                if (ui.position.left + elW > maxW) ui.position.left = maxW - elW;
                if (ui.position.top + elH > maxH) ui.position.top = maxH - elH;
            },
            stop: (event, ui) => {
                this.setZIndex(event.target);
            }
        });
    };

    this.addCloseBtn = (item) => {
        let close = document.createElement('div');
        close.className = 'close';
        close.addEventListener('click', this.onCloseClick.bind(this));
        $(close).tip(_t('delete'));
        item.appendChild(close);
    };

    this.onMouseDown = (event) => {
        this.setZIndex(event.currentTarget);
    };

    this.onCloseClick = (event) => {
        const target = event.currentTarget;
        const stickyTip = target.parentNode;
        this.close(stickyTip);
        $(target).tipHide();
    };

    this.setZIndex = (item) => {
        item.style.zIndex = maxZIndex++;
    };

    this.close = (stickyTip) => {
        let item = stickyTip.querySelector('.item');
        if (item) {
            let itemData = $(item).data().item;
            let itemId = itemData.id;
            if (itemData.isItem()) {
                //Engine.items.deleteViewIcon(itemId, 'sticky-item');
                Engine.items.deleteViewIcon(itemId, Engine.itemsViewData.STICKY_ITEM_VIEW);
            } else {
                //Engine.tpls.deleteViewIcon(itemId, 'sticky-item');
                Engine.tpls.deleteViewIcon(itemId, Engine.itemsViewData.STICKY_ITEM_VIEW);
            }
        }
        stickyTip.remove();
    };

};