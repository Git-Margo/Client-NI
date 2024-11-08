module.exports = function() {

    // let animTs = null;
    // let noticeTop = null;
    let noticeImg;
    let drawReady = false;
    let kind = null;
    let item;

    let noticeData = {
        heal: {
            x: 442,
            y: 258,
            width: 12,
            height: 14
        },
        lootBox: {
            x: 458,
            y: 258,
            width: 12,
            height: 14
        },
        noBonus: {
            x: 458,
            y: 260,
            width: 12,
            height: 14
        },
        expired: {
            x: 492,
            y: 260,
            width: 12,
            height: 14
        },
        higherScore: {
            x: 474,
            y: 258,
            width: 12,
            height: 14
        },
        enhanceBonus1: {
            x: 631,
            y: 258,
            width: 28,
            height: 8
        },
        enhanceBonus2: {
            x: 568,
            y: 258,
            width: 28,
            height: 8
        },
        enhanceBonus3: {
            x: 697,
            y: 258,
            width: 28,
            height: 8
        },
        enhanceBonus4: {
            x: 729,
            y: 258,
            width: 28,
            height: 8
        },

    }

    const init = (_kind, _item) => {
        initKind(_kind);
        setItem(_item);
        initImg();
    };

    const setItem = (_item) => {
        item = _item;
    };

    const initKind = (_kind) => {
        kind = _kind;
    }

    const initImg = () => {
        Engine.imgLoader.onload('../img/gui/buttony.png', false,
            (i) => {
                noticeImg = i
            },
            (i) => {
                drawReady = true;
                firstDraw();
            });
    }

    const firstDraw = () => {
        let view = item.getView();

        for (let k in view) {
            let noticeCtx = view[k][4];

            if (item.isItem()) noticeCtx = view[k][4];
            else noticeCtx = view[k][5];

            draw(noticeCtx);
        }
    };

    const draw = (ctxNotice, canvasNotice, index) => {
        if (!drawReady) return;

        let x = noticeData[kind].x;
        let y = noticeData[kind].y;
        let w = noticeData[kind].width
        let h = noticeData[kind].height

        ctxNotice.drawImage(
            noticeImg,
            x,
            y,
            w, h,
            32 - w,
            Engine.items.getNoticeTop(),
            w, h);

    }

    //this.update = update
    this.draw = draw
    this.init = init

}