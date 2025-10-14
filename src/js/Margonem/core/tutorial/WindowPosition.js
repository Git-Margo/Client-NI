let WindowPosition = {
    findPosition: ($w, wObj, hObj, left, top, $htmlObj, offset) => {

        let wWnd = $w.outerWidth();
        let hWnd = $w.outerHeight();
        let shift = WindowPosition.getShift($htmlObj);
        let borderWidth = shift[0];
        let borderHeight = shift[1];
        let distBetweenTargetAndlWnd = 10;

        let posArray = [
            [
                left + wObj + borderWidth + distBetweenTargetAndlWnd, //right down
                top + hObj + borderHeight + distBetweenTargetAndlWnd
            ],
            [ //left up
                left - wWnd - distBetweenTargetAndlWnd,
                top - hWnd - distBetweenTargetAndlWnd
            ],
            [
                left + wObj + borderWidth + distBetweenTargetAndlWnd, //right up
                top - hWnd - distBetweenTargetAndlWnd
            ],
            [
                left - wWnd - distBetweenTargetAndlWnd, //left down
                top + hObj + borderHeight + distBetweenTargetAndlWnd
            ]
        ];

        let wXMax = $(window).width();
        let hYMax = $(window).height();
        let opt = -1;

        for (let i = 0; i < posArray.length; i++) {
            let x = posArray[i][0];
            let y = posArray[i][1];
            let xMax = x + wWnd;
            let yMax = y + hWnd;

            if (x > 0 && y > 0 && xMax < wXMax && yMax < hYMax) {
                opt = i;
                break;
            }
        }

        if (opt == -1) {

            //let y = top - wTutorialWnd + borderHeight;
            let y = top + (hObj + borderHeight) / 2 - wWnd / 2;

            posArray = [

                [left - wWnd - distBetweenTargetAndlWnd, y], //left  middle top
                [left + wObj + borderWidth + distBetweenTargetAndlWnd, y] //right middle top

            ];

            for (let i = 0; i < posArray.length; i++) {
                let x = posArray[i][0];
                let xMax = x + wWnd;

                if (x > 0 && xMax < wXMax) {
                    opt = i;
                    break;
                }
            }
        }

        //self.wnd.show();

        if (!isset(posArray[opt])) {
            return
        }

        let l = (posArray[opt][0] + (offset && offset.left ? offset.left : 0)) / Engine.zoomFactor;
        let t = (posArray[opt][1] + (offset && offset.top ? offset.top : 0)) / Engine.zoomFactor;


        $w.css('left', l);
        $w.css('top', t);

    },
    getShift: ($htmlObj) => {
        let width = 0;
        let height = 0;
        if ($htmlObj) {
            if ($htmlObj.css('border-left-width')) width += parseInt($htmlObj.css('border-left-width'));
            if ($htmlObj.css('border-right-width')) width += parseInt($htmlObj.css('border-right-width'));
            if ($htmlObj.css('border-top-width')) height += parseInt($htmlObj.css('border-top-width'));
            if ($htmlObj.css('border-bottom-width')) height += parseInt($htmlObj.css('border-bottom-width'));
        } else {
            // width = 20;
            // height = 40;
        }
        return [width, height];
    }
}

module.exports = WindowPosition;