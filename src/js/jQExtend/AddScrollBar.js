/**
 * Created by Michnik on 2015-11-20.
 */
function isset(x) {
    return typeof(x) != 'undefined';
}

var Templates = require('@core/Templates');
module.exports = new(function() {
    /**
     * @param options {} - object with options
     * available options : track (bool), wheelSpeed(integer), callback (function)
     * @returns {$}
     */
    $.fn.addScrollBar = function(options) {

        var self = this;
        var $pane = $('.scroll-pane', this);
        var is_bottom = false;
        var stop = true;
        var $bar = null;
        var interval = null;
        var timeout = null;
        var lastYTouch = null;
        var wheelSpeed = options.wheelSpeed ? options.wheelSpeed : 20;
        var addScrollableClassToAnotherEl = options.addScrollableClassToAnotherEl ? options.addScrollableClassToAnotherEl : false;

        var addScrollBarWrapper = function() {
            $(self).append(Templates.get('scrollbar-wrapper'));
            $bar = $('.scrollbar-wrapper .track', self);
            $('.scrollbar-wrapper', self).click(function(e) {
                e.stopPropagation();
                return false;
            });
            initScrollBarWrapper();
        };

        var setNewBarPos = function(increase, distance) {
            const paneEl = $pane[0];
            var new_pos = paneEl.scrollTop + (increase ? -distance : distance);
            var max_scroll = paneEl.scrollHeight - paneEl.clientHeight;
            if (new_pos > max_scroll) new_pos = max_scroll;
            if (new_pos < 0) new_pos = 0;

            var p = new_pos / max_scroll;
            updateBarPosition(p);
            scrollTo(p);
        };

        var initScrollBarWrapper = function() {
            $('.handle', $bar).draggable({
                axis: 'y',
                //containment: 'parent',
                scroll: false,
                start: function() {
                    stop = false;
                },
                drag: function(e, ui) {
                    if (stop) return false;
                    var percent = ui.position.top / ($bar.height() - $(this).height());
                    if (percent < 0) percent = 0;
                    if (percent > 1) percent = 1;
                    if (ui.position.top < 0) ui.position.top = 0;
                    var max = ui.helper.parent().height() - 45;
                    if (ui.position.top > max) ui.position.top = max;
                    scrollTo(percent);
                },
                stop: function() {
                    stop = true;
                }
            });
        };

        var updateBarPos = function() {
            var new_pos = $pane.scrollTop();
            var max_scroll = $pane[0].scrollHeight - $pane.height();
            if (new_pos > max_scroll) new_pos = max_scroll;
            if (new_pos < 0) new_pos = 0;

            var p = new_pos / max_scroll;
            updateBarPosition(p);
            scrollTo(p);
        };

        var isVisible = function() {
            return $(self).hasClass('scrollable');
        };

        var updateCallback = function() {
            //toggle visibility of scrollbar if needed
            if ($pane[0].scrollHeight - $pane.height() > 1) { // 1 instead of 0 because it's buggy FF
                $(self).addClass('scrollable');
                if (options.addScrollableClassToAnotherEl) {
                    options.addScrollableClassToAnotherEl.addClass('scrollable');
                }
            } else {
                $(self).removeClass('scrollable');
                if (options.addScrollableClassToAnotherEl) {
                    options.addScrollableClassToAnotherEl.removeClass('scrollable');
                }
            }

            if (is_bottom) scrollTo(1);
        };

        var updateBarPosition = function(percentage) {
            const barEl = $bar[0];
            const handleEl = $('.handle', $bar)[0];
            if (!options.track) return;
            const top = Math.round((barEl.clientHeight - handleEl.clientHeight) * percentage);
            handleEl.style.top = top + 'px';
        };

        var bottomReached = true;
        var scrollTo = function(percentage) {
            const paneEl = $pane[0];
            paneEl.scrollTop = Math.round((paneEl.scrollHeight - paneEl.clientHeight) * percentage);
            is_bottom = percentage > 0.99;
            updateBarPosition(percentage);
            if (is_bottom && isset(options.callback) && bottomReached) {
                options.callback();
                bottomReached = false;
            } else if (is_bottom != 1) {
                bottomReached = true;
            }
        };

        var myClearInterval = function() {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };

        var initClearInterval = function(selector) {
            $(self).find(selector).mouseleave(function() {
                myClearInterval();
            }).mouseup(function() {
                myClearInterval();
            });
        };

        var initArrowInterval = function(selector, increase) {
            $(self).find(selector).mousedown(function() {
                setNewBarPos(increase, 20);
                timeout = setTimeout(function() {
                    interval = setInterval(function() {
                        setNewBarPos(increase, 10);
                    }, 50);
                }, 500);
            });
        };
        var setScroll = function(new_pos) {
            var max_scroll = $pane[0].scrollHeight - $pane.height();
            if (new_pos > max_scroll) new_pos = max_scroll;
            if (new_pos < 0) new_pos = 0;

            var p = new_pos / max_scroll;
            updateBarPosition(p);
            scrollTo(p);
        };

        var touchMoveGoUp = function(currentY) {
            if (currentY > lastYTouch) return true;
            else if (currentY < lastYTouch) return false;
        };

        var calculateTouchPower = function(currentY) {
            return Math.abs(lastYTouch - currentY);
        };

        const scrollToElement = (selector) => {
            const $target = $(selector);
            if ($target.length) {
                const paneOffset = $pane.offset().top;
                const targetOffset = $target.offset().top;
                const scrollTop = $pane.scrollTop() + (targetOffset - paneOffset);

                // setScroll($target.position().top); // relative to parent with position: relative :/
                setScroll(scrollTop);
            }
        }

        $(this).on('mousewheel DOMMouseScroll', function(e) {
            var isFirefox = typeof InstallTrigger !== 'undefined';
            var stateScroll = isFirefox ? e.originalEvent.detail : e.originalEvent.deltaY;
            setNewBarPos(stateScroll < 0, wheelSpeed);
        }).on('update', function() {
            updateCallback();
            updateBarPos();
        }).on('scrollBottom', function() {
            scrollTo(1);
        }).on('scrollTop', function() {
            scrollTo(0);
        }).on('stopDragBar', function() {
            stop = true;
        }).on('updateBarPos', function() {
            updateBarPos();
        }).on('setScroll', function(ev, n) {
            setScroll(n);
        }).on('scrollToElement', function(ev, selector) {
            scrollToElement(selector);
        }).on('updateWhenBottom', function() {
            var scrollVisible = isVisible();
            updateCallback();
            updateBarPos();
            if (scrollVisible) {
                if (is_bottom) scrollTo(1);
            } else scrollTo(1);
        });

        if (mobileCheck()) {
            $(this).bind('touchstart', function(e) {
                if (!lastYTouch) {
                    //e.preventDefault();
                    lastYTouch = e.originalEvent.touches[0].clientY;
                }
            }).bind('touchmove', function(e) {
                if (!e.target.classList.contains('c-slider__input')) e.preventDefault();
                if (e.target.classList.contains('ui-draggable')) {
                    return
                }
                var currentY = e.originalEvent.touches[0].clientY;
                var goUp = touchMoveGoUp(currentY);
                var power = calculateTouchPower(currentY) / Engine.zoomFactor;
                setNewBarPos(goUp, power);
                lastYTouch = currentY;
            }).bind('touchend', function(e) {
                //e.preventDefault();
                lastYTouch = null;
            });
        }

        if (options.track) {
            addScrollBarWrapper();
            initArrowInterval('.arrow-up', true);
            initArrowInterval('.arrow-down', false);
            initClearInterval('.arrow-up');
            initClearInterval('.arrow-down');
        }

        updateCallback();
        return this;
    };
})();