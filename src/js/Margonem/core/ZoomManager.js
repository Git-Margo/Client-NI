module.exports = function() {

    let zoom = 1;
    let actualZoom = 1;
    let speed = 2;

    const init = () => {

    };

    const update = (dt) => {
        if (zoom == actualZoom) return;

        getEngine().map.setForceRender(true);

        let z = null;

        if (zoom < actualZoom) {
            let newActualZoom = actualZoom - speed * dt;
            z = zoom < newActualZoom ? newActualZoom : zoom;
        } else {
            let newActualZoom = actualZoom + speed * dt;
            z = zoom > newActualZoom ? newActualZoom : zoom;
        }

        setActualZoom(z);

    };

    const setZoom = (_zoom) => {
        zoom = _zoom;
    };

    const setSpeed = (_speed) => {
        speed = _speed;
    };

    const setActualZoom = (_zoom) => {
        actualZoom = _zoom;
    };

    const clearZoom = () => {
        setZoom(1);
        setSpeed(2);
    };

    const onClear = () => {
        clearZoom();
        setActualZoom(1);
    }

    const getActualZoom = () => actualZoom;
    const getZoom = () => zoom;


    this.init = init;
    this.update = update;
    this.getActualZoom = getActualZoom;
    this.getZoom = getZoom;
    this.setZoom = setZoom;
    this.setSpeed = setSpeed;
    this.clearZoom = clearZoom;
    this.onClear = onClear;
}