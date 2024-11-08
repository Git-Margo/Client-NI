module.exports = function() {

    let shift = [0, 0];

    const init = () => {

    };

    const setShift = (x, y) => {
        shift[0] = x;
        shift[1] = y;
    };

    const getShift = () => {
        return [shift[0], shift[1]];
    };

    this.init = init;
    this.getShift = getShift;
    this.setShift = setShift;

};