/**
 * class fix draggable elements which can click (only mobile)
 */

window.blockRemoveMobileMenu = false;
const delay = 200;

function getTs() {
    return (new Date()).getTime();
}

function checkCanCallEvent($sourceObj, eventName) {
    if ($sourceObj.hasClass('clickable')) return true; // skills
    if ($sourceObj.hasClass('click-area')) return true; // itemsmoved
    if (!$sourceObj.hasClass('ui-draggable')) return false;
    if (!$sourceObj.hasClass('item')) return false;
    var events = $._data($sourceObj[0], 'events');
    return events && events[eventName];
}

if (mobileCheck()) {
    var leftClickTimeout = null;
    var startX = null;
    var startTs = null;

    $(document).on('mousedown', function(e) {
        startTs = getTs();
        leftClickTimeout = setTimeout(function() {
            startX = null;
            var $target = $(e.target);
            if (checkCanCallEvent($target, 'contextmenu')) $target.trigger('contextmenu', e);
            blockRemoveMobileMenu = true;
        }, delay);
    });

    $(document).on('mousemove', function(e) {
        if (startX == null) startX = e.clientX;
        if (leftClickTimeout && (e.clientX > startX + 6 || e.clientX < startX - 6)) {
            clearTimeout(leftClickTimeout);
            leftClickTimeout = null;
            startX = null;
        }
    });

    $(document).on('mouseup', function(e) {
        if (leftClickTimeout) {
            var tsNow = getTs();
            var speedClick = startTs + delay > tsNow;
            var $target = $(e.target);

            if (checkCanCallEvent($target, 'click') && speedClick) $target.trigger('click', e);

            startTs = null;
            clearTimeout(leftClickTimeout);
            leftClickTimeout = null;

            setTimeout(function() {
                blockRemoveMobileMenu = false;
                startX = null;
            }, 10)
        }
    });
}