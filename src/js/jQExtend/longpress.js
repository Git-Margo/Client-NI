(function(window, document) {
    'use strict';

    const LONG_PRESS_DELAY = 600;

    let timer = null;
    let startX, startY;
    let targetElement = null;
    let longPressTriggered = false;

    document.addEventListener('touchstart', function(e) {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        targetElement = e.target;
        longPressTriggered = false;

        timer = setTimeout(() => {
            longPressTriggered = true;

            const longPressEvent = new MouseEvent('longpress', {
                bubbles: true,
                cancelable: true,
                clientX: startX,
                clientY: startY,
                detail: {
                    clientX: startX,
                    clientY: startY,
                    target: targetElement
                }
            });

            targetElement.dispatchEvent(longPressEvent);
            // console.log('longpress dispatched on:', targetElement);
        }, LONG_PRESS_DELAY);
    }, true);

    document.addEventListener('touchend', function() {
        clearTimeout(timer);
        timer = null;
        setTimeout(() => {
            longPressTriggered = false;
        }, 100);
    }, true);

    document.addEventListener('touchmove', function(e) {
        if (!timer) return;
        const touch = e.touches[0];
        if (Math.abs(touch.clientX - startX) > 10 || Math.abs(touch.clientY - startY) > 10) {
            clearTimeout(timer);
            timer = null;
            longPressTriggered = false;
        }
    }, true);

    document.addEventListener('contextmenu', function(e) {
        if (longPressTriggered) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

})(window, document);