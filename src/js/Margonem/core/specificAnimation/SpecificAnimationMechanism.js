module.exports = function() {

    const getBlinkData = (width, height, color, maxOpacity, _speed) => {
        return {
            width: width,
            height: height,
            ts: ts() / 1000,
            drawCallback: (dt, canvas, ctx, data) => {

                let speed = _speed ? _speed : 1;

                let opacity = Math.floor(Math.abs(Math.sin(speed * ts() / 1000 - data.ts)) * 100) / 100
                if (maxOpacity && opacity > maxOpacity) opacity = maxOpacity;

                let floorOpacity = Math.floor(opacity * 10);
                let diff = opacity * 10 - floorOpacity;

                if (diff > 0.5) opacity = floorOpacity + 0.5;
                else opacity = floorOpacity;

                opacity = opacity / 10;

                //console.log(opacity)
                if (ctx.globalAlpha == opacity) return

                ctx.clearRect(0, 0, data.width, data.height);
                ctx.fillRect(0, 0, data.width, data.height);

                ctx.fillStyle = color;
                ctx.globalAlpha = opacity;
            }
        }
    }

    this.getBlinkData = getBlinkData;
}