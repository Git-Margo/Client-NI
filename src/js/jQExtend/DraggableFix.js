$.ui.ddmanager.prepareOffsets = function(t, event) {
    var i, j,
        m = $.ui.ddmanager.droppables[t.options.scope] || [],
        type = event ? event.type : null, // workaround for #2317
        list = (t.currentItem || t.element).find(":data(ui-droppable)").addBack();
    //list = ( t.currentItem || t.element ).find( "[data-ui-droppable]" ).addBack();

    droppablesLoop: for (i = 0; i < m.length; i++) {
        // No disabled and non-accepted
        if (m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0], (t.currentItem || t.element)))) {
            continue;
        }

        // Filter out elements in the current dragged item
        for (j = 0; j < list.length; j++) {
            if (list[j] === m[i].element[0]) {
                m[i].proportions().height = 0;
                continue droppablesLoop;
            }
        }

        m[i].visible = m[i].element.css("display") !== "none";
        if (!m[i].visible) {
            continue;
        }
        // Activate the droppable if used directly from draggables
        if (type === "mousedown") {
            m[i]._activate.call(m[i], event);
        }

        m[i].offset = m[i].element.offset();
        m[i].proportions({
            width: m[i].element[0].offsetWidth * Engine.zoomFactor,
            height: m[i].element[0].offsetHeight * Engine.zoomFactor
        });
    }

};

//const boundsFix = (el, position) => { // fix for mobile - window bounds
//	if (!mobileCheck()) return position;
//
//	const
//		topBoundOffsetOnMobile = 30,
//		targetWidth = el.outerWidth(),
//		targetHeight = el.outerHeight(),
//		bodyWidth = $('body').width(),
//		bodyHeight = $('body').height();
//
//	if (position.top < topBoundOffsetOnMobile) position.top = topBoundOffsetOnMobile;
//	if (position.top + targetHeight > bodyHeight) position.top = bodyHeight - targetHeight;
//	if (position.left + targetWidth > bodyWidth) position.left = bodyWidth - targetWidth;
//
//	return position;
//}


$.Widget.prototype._trigger = function(type, event, data) {
    var prop, orig,
        callback = this.options[type];

    data = data || {};
    event = $.Event(event);
    event.type = (type === this.widgetEventPrefix ?
        type :
        this.widgetEventPrefix + type).toLowerCase();
    // the original event may come from any element
    // so we need to reset the target on the new event
    event.target = this.element[0];

    // copy original event properties over to the new event
    orig = event.originalEvent;
    if (orig) {
        for (prop in orig) {
            if (!(prop in event)) {
                event[prop] = orig[prop];
            }
        }
    }

    if (isset(data.position)) {
        var zoom = typeof(Engine) != "undefined" && Engine.zoomFactor != null ? Engine.zoomFactor : 1;
        if (type == 'sort' || type == 'change') {
            var changeLeft = data.position.left - data.originalPosition.left;
            var newLeft = data.originalPosition.left + changeLeft / zoom - data.item.parent().offset().left;
            var newTop = data.position.top / zoom;
            data.helper.css({
                left: newLeft,
                top: newTop
            });
        } else {
            data.position.top = Math.round(data.position.top / zoom);
            data.position.left = Math.round(data.position.left / zoom);
            //data.position = boundsFix($(event.target), data.position);
        }
    }
    this.element.trigger(event, data);

    return !($.isFunction(callback) &&
        callback.apply(this.element[0], [event].concat(data)) === false ||
        event.isDefaultPrevented());
};

$.extend($.ui.draggable.prototype.options, {
    cursor: `url(../img/gui/cursor/1n.png?v=${__build.version}), auto`,
});