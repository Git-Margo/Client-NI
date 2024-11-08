module.exports = function() {

    const textType = "px Arial regular";

    const draw = (ctx, text, left, top, fontHeight, fontColor, maxWidth = 200, paddingHorizontal = 10, paddingVertical = 5) => {

        ctx.textAlign = "center";
        ctx.font = fontHeight + textType;

        //let maxWidth              = 200;
        let rowsData = getRowsData(ctx, text, maxWidth);
        let rows = rowsData.rows;
        let rowsLength = rows.length;
        let rowsMaxWidth = rowsData.maxWidth;
        let backgroundHeight = fontHeight * rowsLength;
        let textBetweenHeadHeight = 10;
        //let topTrans              = -fontHeight + fontHeight/4 + fontHeight * (-rowsLength + 1) - textBetweenHeadHeight;
        let topTrans = getTopTrans(fontHeight, rowsLength, textBetweenHeadHeight);

        drawBackground(
            ctx,
            left, top + topTrans,
            rowsMaxWidth, backgroundHeight,
            paddingHorizontal,
            paddingVertical
        );

        for (let i = 0; i < rowsLength; i++) {

            topTrans = fontHeight * (-rowsLength + i + 1) - textBetweenHeadHeight;

            drawStyleText(ctx, fontHeight, rows[i].str, fontColor, left, top + topTrans);
        }

    };

    const getTopTrans = (fontHeight, rowsLength, textBetweenHeadHeight = 10) => {
        return -fontHeight + fontHeight / 4 + fontHeight * (-rowsLength + 1) - textBetweenHeadHeight
    };

    const drawBackground = (ctx, left, top, _w, _h, paddingHorizontal, paddingVertical) => {

        let w = _w + 2 * paddingHorizontal;
        let h = _h + 2 * paddingVertical;


        let bckLeft = left - w / 2;
        let bckTop = top - paddingVertical;

        ctx.globalAlpha = 0.4;
        ctx.fillStyle = "rgb(86, 86, 86)";

        ctx.fillRect(bckLeft, bckTop, w, h);

        ctx.globalAlpha = 0.23;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgb(255, 255, 255)";

        ctx.strokeRect(bckLeft, bckTop, w, h);
    };

    const drawStyleText = (ctx, fontHeight, text, color, left, top) => {
        //let rgb = hexToRgb(color);

        ctx.textAlign = "center";
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        ctx.font = fontHeight + textType;
        ctx.shadowColor = "black";
        //ctx.shadowColor   = `rgb(${r}, ${g}, ${b})`;
        ctx.shadowBlur = 0;
        ctx.lineWidth = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.strokeStyle = "black";

        ctx.strokeText(text, left, top);

        ctx.shadowBlur = 0;
        ctx.fillText(text, left, top);
    };

    const getRowsData = (ctx, textToBreak, maxWidth) => {
        let words = textToBreak.split(" ");
        let index = 0;
        let rowsData = {
            rows: [],
            maxWidth: 0
        };

        let rows = rowsData.rows;
        let spaceWidth = ctx.measureText(' ').width;


        rows.push({
            str: '',
            width: 0
        });

        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            //let wordWidth   	= ctx.measureText(word).width + spaceWidth;
            let wordWidth = ctx.measureText(word).width;
            let newWidth = rows[index].width + wordWidth;
            let str = rows[index].str;

            if (str != '') newWidth += spaceWidth;

            if (newWidth < maxWidth) {
                //let str       = rows[index].str;
                let strToAdd = word;

                if (str != '') strToAdd = ' ' + strToAdd;

                rows[index].str += strToAdd;
                rows[index].width = newWidth;
            } else {
                index++;
                rows.push({
                    str: words[i],
                    width: wordWidth - spaceWidth
                });
            }

            if (rowsData.maxWidth < rows[index].width) rowsData.maxWidth = rows[index].width;
        }

        return rowsData;
    };

    this.draw = draw;
    this.getTopTrans = getTopTrans;

};