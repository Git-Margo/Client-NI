/**
 * Created by Michnik on 2015-11-20.
 */
//var Templates = require('@core/Templates');
let CanvasObjectTypeData = require('@core/CanvasObjectTypeData');
let ItemData = require('@core/items/data/ItemData');
module.exports = new(function(options) {
    var t = this;
    this.counter = 0;
    this.target = null;
    this.tipBindToCanvas = false;
    this.$tip = null;
    this.$eqTip = null;
    this.leftSideEqTip = false;
    this.mousePos = null;
    this.vert = false;
    this.timeout = null;
    this.allTips = {};

    window.TIPS = t;
    //asd = this;

    $.fn.extend({
        /**
         * Sets tip for selected element
         * @param content - tip content
         * @param t_type tip type
         * @returns {*}
         */
        getTipData: function() {
            var $target = $(this);
            let id = $target.attr('tip-id');
            return t.allTips[id];
        },

        tip: function(content, t_type, i_type = null, params = {}) {
            var $target = $(this);
            let id = $target.attr('tip-id');

            if (content) {

                if (!isset(id) || params.forceNewId) {

                    id = t.getId();
                    t.allTips[id] = content;
                    $target.attr('tip-id', id).trigger('tipupdate');
                    $target.attr('data-tip-type', isset(t_type) ? t_type : null);
                    $target.attr('data-item-type', isset(i_type) ? i_type : null);

                } else {

                    if (t.allTips[id] == content) return this;

                    t.allTips[id] = content;
                    $target.attr('tip-id', id).trigger('tipupdate');
                }

            } else {

                if (t.allTips[id]) delete t.allTips[id];

                $target.removeAttr('tip-id');
                $target.removeAttr('data-tip-type');
                $target.removeAttr('data-item-type');

            }
            if (!$.isEmptyObject(params)) {
                $target.data('params', params);
            } else {
                $target.data('params', '');
            }


            //$target.attr('tip-id', id);
            return this;
        },
        concatTip: function(content) {
            var $target = $(this);
            //var currentContent = $target.data('tip');
            //var currentContent = $target.attr('data-tip');
            //$target.attr('data-tip', currentContent + '<br>' + content);
            let id = $target.attr('tip-id');
            var currentContent = t.allTips[id];
            //$target.data('tip', currentContent + '<br>' + content);
            t.allTips[id] = currentContent + '<br>' + content;
        },
        changeInTip: function(selector, content) {
            var $target = $(this);
            //var currentContent = $target.attr('data-tip');
            let id = $target.attr('tip-id');
            var currentContent = t.allTips[id]
            var tmpDiv = $('<div/>').html(currentContent);
            if (tmpDiv.find(selector).length > 0) {
                tmpDiv.find(selector).html(content);
                //$target.attr('data-tip', tmpDiv.html());
                //$target.data('tip', tmpDiv.html());
                //let id = $target.data('tip-id');
                //$target.data('tip', tmpDiv.html());
                t.allTips[id] = tmpDiv.html();
            }
        },
        checkAndRemoveEqTip: function() {
            var eqI = t.checkCanShowEqTip();
            t.removeEqTip(eqI);
        },
        tipShow: function(e, o) {
            this.checkAndRemoveEqTip();
            t._in(e, o);
            //if (Engine.hero.d.opt && Engine.opt(25)) return; //if no auto cmp
            if (!isSettingsOptionsAutoCompareItemsOn()) {
                return;
            }
            t.showEqTip();
        },
        tipHide: function(e) {
            t._out(e);
            //if (Engine.opt(25)) return; //if no auto cmp
            if (!isSettingsOptionsAutoCompareItemsOn()) {
                return;
            }
            this.checkAndRemoveEqTip();
        }
    });

    this._in = function(e, o) {
        // if (o && o.canvasObjectType == 'mItem') {
        if (o && o.canvasObjectType == CanvasObjectTypeData.M_ITEM) {
            this.target = o.$;
            this.tipBindToCanvas = true;
        } else {
            this.target = $(e.currentTarget);
            this.tipBindToCanvas = false;
            this.target.bind('destroyed', function() {
                t._out()
            });
        }
        this._update(e);
        e.stopPropagation();
    };

    this._out = function(e) {
        if (!this.target) return;
        var eqI = t.checkCanShowEqTip();
        var target = this.target;
        this.target = null;
        this.removeEqTip(eqI);
        this.counter = 0;
        if (this.$tip) {
            this.$tip.detach();
            if (target.hasClass('item') || target.hasClass('linked-chat-item')) this.removeItemFromViews(target);
        }
    };

    this._move = function(e) {
        if (this.$tip === null) this._in(e);
        this.updateMainItemTipPosition(e);
    };

    this.updateMainItemTipPosition = function(e) {
        var pos = this.getPosition(e);
        this.$tip.css({
            top: pos[1],
            left: pos[0]
        });
    }

    this._update = function(e) {
        if (this.target !== null) {
            // if (mobileCheck()) {
            // 	if (this.$tip.attr('data-type') != 't_item') {
            // 		if (this.counter > 5) return this._out();
            // 		this.counter++;
            // 	}
            // }
            //var $content = this.parseTip(this.target.data('tip'));
            //var $content = this.parseTip(this.target.attr('data-tip'));

            var params = this.target.data('params');
            this.$tip.attr('data-type', '');
            this.$tip.attr('data-tip-type', '');
            this.$tip.attr('data-item-type', '');
            //if (!(Engine.hero.d.opt & 4096)) this.$tip.attr('data-item-type', this.target.attr('data-item-type'));
            this.$tip.attr('data-item-type', this.target.attr('data-item-type'));
            this.$tip.attr('data-type', this.target.attr('data-tip-type'));
            //this.$tip.css('display', 'block');
            this.contentUpdate();
            this.$tip.css('box-shadow', '');
            if (params && params.borderColor) {
                this.$tip.css('box-shadow', this.border(params.borderColor));
            }
            var eqI = t.checkCanShowEqTip();
            this.removeEqTip(eqI);
            $('body').append(this.$tip);
            this._move(e);
            this._eqTipMove(e, true);
        }
    };

    this.contentUpdate = function() {
        const tipId = this.tipBindToCanvas ? Engine.interface.get$GAME_CANVAS().attr('tip-id') : this.target.attr('tip-id'); // fix for canvas tip
        const $content = this.parseTip(this.allTips[tipId]);
        this.$tip.find('.content').html($content);
        if (this.target && (this.target.hasClass('item') || this.target.hasClass('linked-chat-item'))) this.addItemToView(false, this.target, this.$tip);
    };

    this.addItemToView = function(itemData, target, $tip) {
        var item = itemData ? itemData : target.data().item;
        if (!item) return;
        var id = item.id;
        //var Parent = item.isItem() ? Engine.items : Engine.tpls;
        var $icon;

        // if (item.isItem()) 	$icon = Engine.items.createViewIcon(id, 'tip-item')[0];
        // else 				$icon = Engine.tpls.createViewIcon(id, 'tip-tpl-item', item.loc)[0];


        if (item.isItem()) $icon = Engine.items.createViewIcon(id, Engine.itemsViewData.TIP_ITEM_VIEW)[0];
        else $icon = Engine.tpls.createViewIcon(id, Engine.itemsViewData.TIP_TPL_ITEM_VIEW, item.loc)[0];

        $tip.find('.item-head').prepend($icon);
    };

    this.removeItemFromViews = function(target, itemData) {
        var item = itemData ? itemData : target.data().item;
        if (!item) return;
        //var item = target.data().item;
        //var Parent = item.isItem() ? Engine.items : Engine.tpls;
        //var viewName = item.isItem() ? 'tip-item' : 'tpl-item';
        //Parent.deleteViewIconIfExist(item.id, viewName);

        // if (item.isItem()) 	Engine.items.deleteViewIconIfExist(item.id, 'tip-item');
        // else 				Engine.tpls.deleteViewIconIfExist(item.id, 'tip-tpl-item', item.loc);

        if (item.isItem()) Engine.items.deleteViewIconIfExist(item.id, Engine.itemsViewData.TIP_ITEM_VIEW);
        else Engine.tpls.deleteViewIconIfExist(item.id, Engine.itemsViewData.TIP_TPL_ITEM_VIEW, item.loc);
    };

    this.parseTip = function(msg) {
        var r = new RegExp('#tdiff:([0-9]+?)#');
        if (r.test(msg)) {
            var d = r.exec(msg);
            msg = msg.replace(r, calculateDiff(parseInt(d[1]), unix_time()));
        }
        return msg;
    };

    this.getPosition = function(e, eqTip) {
        const tipShadowSize = 7 * 2;
        const minYTip = 44;
        const w = this.$tip.width() + tipShadowSize;
        const h = this.findMaxHeight();
        const tipHeight = this.$tip.height() + tipShadowSize;
        const eqTipTitleH = 40;
        const z = Engine.zoomFactor;
        const wWidth = $(window).width() / z;
        const wHight = $(window).height() / z;
        const offsetWindow = 10;
        const offsetBeetween = 6;
        const offsetCursor = 20;
        let transX = 0;
        if (eqTip) transX = w + offsetBeetween;
        else this.leftSideEqTip = false;

        var req = [e.clientX + offsetCursor + transX + offsetWindow, e.clientY];
        var ret = req;

        if (eqTip) this.vert = false;

        if ((req[0] + w) > wWidth) {
            ret[0] = e.clientX - offsetBeetween - w - offsetWindow - transX;
            if (!eqTip) this.leftSideEqTip = true;
            if (eqTip && !this.leftSideEqTip) {
                ret[0] = e.clientX - transX - offsetWindow;
                // if(this.$tip.position().left < t.mousePos[0]) {
                // 	ret[0] += transX + 70;
                // } else {
                // 	ret[0] += transX;
                // }
                if (eqTip && this.isTipOffCanvasHor(ret, offsetWindow)) {
                    ret = alignTipsVertically(ret);
                    this.vert = true;
                }
            } else if (eqTip && this.isTipOffCanvasHor(ret, offsetWindow)) { //on the left and cmp tip off window
                ret = alignTipsVertically(ret, false);
                this.vert = true;
            }
        }

        function alignTipsVertically(ret, onTheRight = true) {
            ret[0] = onTheRight ? e.clientX + offsetCursor + offsetWindow : e.clientX - transX - offsetWindow;
            ret[1] = e.clientY - h - offsetBeetween - offsetWindow - 3;
            if (ret[1] < 0 + eqTipTitleH + offsetWindow) {
                ret[1] = e.clientY + tipHeight + eqTipTitleH;
            }
            return ret;
        }

        if (!this.vert && (req[1] + h) > wHight - offsetWindow) {
            var newY = e.clientY - h - offsetWindow;
            ret[1] = newY < 0 ? minYTip : newY;
        }

        // if (eqTip) { // update main item tip position when mouseenter fired only (move works correct)
        // 	this.updateMainItemTipPosition(e);
        // }

        return ret;
    };

    this.isTipOffCanvasHor = (ret, offsetWindow) => ret[0] < offsetWindow;

    this.findMaxHeight = function() {
        var tipH = this.$tip.height();
        if (!this.$eqTip) return this.$tip.height();
        else {
            var egTipH = this.$eqTip.height();
            return Math.max(tipH, egTipH);
        }
    };

    this.initPosEqTip = function() {
        var keyDownPos = this.getKeyDownPos();
        var e = {
            clientX: keyDownPos[0],
            clientY: keyDownPos[1]
        };
        var pos = this.getPosition(e, true);
        this.$eqTip.css({
            top: pos[1],
            left: pos[0]
        });
    };

    this.getKeyDownPos = function() {
        var pos = this.$tip.position();
        var zoom = Engine.zoomFactor;
        var clientX = pos.left / zoom - 25;
        if (this.leftSideEqTip) clientX += 90 - 35 + this.$tip.width();
        return [clientX, pos.top / zoom];
    };

    this.showEqTip = function() {
        if (!this.target || this.target && !this.target.attr('data-cl') || this.$eqTip) return;
        var eqI = this.checkCanShowEqTip();
        if (!eqI) return;
        eqI.on('delete', function() { // fix for remove $view from eqTip #16765
            t.removeEqTip(eqI);
        });
        var targetData = this.target.data('item');
        if (!targetData) return;

        var targetStats = targetData.parseStats();
        var tip = eqI.getTipContent(targetStats);
        this.createEqTip(tip, eqI);
        this.initPosEqTip();
    };

    this.checkCanShowEqTip = function() {
        if (!this.target) return false;
        var eq = Engine.heroEquipment.getEqItems();
        var cl = this.target.data('cl');

        var clSameSlot = [
            [ItemData.CL.ORB_WEAPON, ItemData.CL.SHIELD]
        ];

        for (const oneClGroup of clSameSlot) {
            if ($.inArray(cl, oneClGroup) >= 0) {
                for (let i = 0; i < oneClGroup.length; i++) {
                    if (eq[oneClGroup[i]]) {
                        return eq[oneClGroup[i]];
                    }
                }
            }
        }

        return eq[cl];
    };

    this.createEqTip = function(content, eqData) {
        var itemType = eqData.itemType;
        var con = this.parseTip(content);
        //this.$eqTip = require('@core/Templates').get('tip-wrapper').addClass('cmp-tip');
        this.$eqTip = this.getTemplateTipWrapper('cmp-tip');
        this.$eqTip.attr('data-type', 't_item');
        //if (!(Engine.hero.d.opt & 4096)) this.$eqTip.attr('data-item-type', itemType);
        if (isSettingsOptionsShowItemsRankOn()) {
            this.$eqTip.attr('data-item-type', itemType);
        }
        this.$tip.css('display', 'block');
        this.$eqTip.find('.content').html(con);
        this.addItemToView(eqData, false, this.$eqTip);
        this.appendEqTip();
        this.addLabelEqTip();
    };

    this.addLabelEqTip = function() {
        //var label = require('@core/Templates').get('tip-wrapper');
        var label = this.getTemplateTipWrapper('tip-wrapper');
        this.$eqTip.append(label);
        label.find('.content').html(_t('own', null, 'item'));
        label.addClass('own');
    };

    this.appendEqTip = function() {
        if (this.$eqTip) $('body').append(this.$eqTip);
    };

    this.removeEqTip = function(eqData) {
        if (!eqData || !this.$eqTip) return;
        t.removeItemFromViews(eqData.$);
        this.$eqTip.remove();
        this.$eqTip = null;
    };

    this._eqTipMove = function(e) {
        if (!this.$eqTip) return;
        var pos = this.getPosition(e, true);
        this.$eqTip.css({
            top: pos[1],
            left: pos[0]
        });
    };

    this.getId = () => {
        let id = 0;
        while (this.allTips[id]) {
            id++;
        }
        return id;
    };

    this.border = function(borderColor) {
        return '0px 0px 0px 0px #2b282a, 0px 0px 0px 1px #353131, 0px 0px 0px 2px #191311, 0px 0px 0px 3px #2b2727, 0px 0px 0px 4px #59595a, 0px 0px 0px 5px ' + borderColor + ', 0px 0px 0px 6px #5a585b, 0px 0px 0px 7px #2c2625';
    };

    const events = mobileCheck() ? 'touchstart touchend' : 'mouseenter mouseleave';

    //$(document).on(`${events} mousemove tipupdate`, '[data-tip]', function (e) {
    $(document).on(`${events} pointermove tipupdate`, '[tip-id]', function(e) {
        //$(document).on('mouseenter mouseleave mousemove', '[data-tip]', function (e) {
        var factor = Engine.zoomFactor;
        if (e.type !== 'tipupdate' && e.type !== 'touchend') { //tipupdate & touchend doesn't exist clientX and clientY
            e.clientX = !isNaN(e.clientX) ? e.clientX / factor : e.touches[0].clientX / factor;
            e.clientY = !isNaN(e.clientY) ? e.clientY / factor : e.touches[0].clientY / factor;
        }

        switch (e.type) {
            case 'touchstart':
            case 'mouseenter':

                //if (!canShowTipByMobile()) {
                //	e.stopPropagation();
                //	return;
                //}

                if (!canShopTipByTipType(e)) {
                    return;
                }

                if (checkTipOfWidgetAndPadControllerIsShow(e)) {
                    e.stopPropagation();
                    break;
                }

                t._in(e);
                //if (Engine.hero.d.opt && Engine.opt(25)) break; //if no auto cmp
                if (!isSettingsOptionsAutoCompareItemsOn()) {
                    break;
                }
                t.showEqTip();
                break;
            case 'touchend':
            case 'mouseleave':

                var eqI = t.checkCanShowEqTip();
                t._out(e);
                //if (Engine.opt(25)) break; //if no auto cmp
                if (!isSettingsOptionsAutoCompareItemsOn()) {
                    break;
                }
                t.removeEqTip(eqI);
                break;
                // case 'mousemove':
            case 'pointermove':
                t.mousePos = [e.clientX, e.clientY];
                t._move(e);
                t._eqTipMove(e);
                break;
            case 'tipupdate':
                if (t.$eqTip) {

                    if (t.target) t.contentUpdate(); //update for counters e.g. "timelimit", "expires" stat
                    else console.warn("TIP CAN CRASH!")

                } else {
                    t._update(e);
                }
                break;
        }
    }).on('keydown keyup', function(e) {
        //if (!Engine || !Engine.hero || !Engine.hero.d || !Engine.hero.d.hasOwnProperty('opt') || !Engine.opt(25)) return; //if auto cmp
        if (isSettingsOptionsAutoCompareItemsOn()) return;
        switch (e.type) {
            case 'keyup':
                if (!e.ctrlKey) {
                    var eqI = t.checkCanShowEqTip();
                    t.removeEqTip(eqI);
                }
                break;
            case 'keydown':
                if (e.ctrlKey) t.showEqTip();
                break;
        }
    });

    // const canShowTipByMobile = () => {
    // 	if (mobileCheck() && Engine && Engine.padController && Engine.padController.isShow()) {
    // 		return false
    // 	}
    //
    // 	return true;
    // }

    const canShopTipByTipType = (e) => {
        let $target = $(e.currentTarget);

        if ($target.attr("data-tip-type") == "overflow-text-with-several-rows") {
            let element = $target[0]
            let bigger = element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
            if (!bigger) {
                return false
            }
        }

        return true
    }

    const checkTipOfWidgetAndPadControllerIsShow = (e) => {
        if (!Engine.padController) {
            return false;
        }

        let target = e.target;
        if (!target) {
            return false
        }

        return e.target.classList.contains('widget-button') && Engine.padController.isShow()
    }

    this.checkTipExist = () => {
        return this.$tip ? true : false
    }

    this.checkTipHasClass = (classToFind) => {
        if (!this.$tip) {
            return false
        }

        return this.$tip.find(`.${classToFind}`).length ? true : false;
    }

    this.getTemplateTipWrapper = (addClass) => {
        return $('<div class="tip-wrapper ' + addClass + '"><div class="content"></div></div>');
    }

    //t.$tip = require('@core/Templates').get('tip-wrapper').addClass('normal-tip');
    t.$tip = this.getTemplateTipWrapper('normal-tip');

    $.event.special.destroyed = {
        remove: function(o) {
            if (o.handler) {
                o.handler();
            }
        }
    };

})();