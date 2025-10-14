const Template = require('@core/Templates');

module.exports = function() {

    let price = null;
    let currency = null;
    let cl = null;
    let element = null;

    const init = () => {
        element = createPaymentOption();
    };

    const createPaymentOption = function() {
        return Template.get('cost-component')[0];
    };

    const updateCurrency = () => {
        element.classList.remove('credits', 'gold');
        element.classList.add(currency)
    };

    const updatePrice = () => {
        //element.querySelector('.amount').innerHTML = round(price, 2);
        element.querySelector('.amount').innerHTML = price;
    };

    const updateCl = () => {
        element.classList.remove('small');
        if (cl) {
            element.classList.add(cl)
        }
    };

    const setCurrency = (_currency) => {
        currency = _currency
    };

    const setPrice = (_price) => {
        price = _price;
    };

    const setCl = (_cl) => {
        cl = _cl;
    };

    const updateData = (data) => {
        setCurrency(data.currency);
        setPrice(data.price);

        if (data.cl) {
            setCl(data.cl ? data.cl : null);
        }

        updateCurrency();
        updatePrice();
        updateCl();
    };

    const getElement = () => {
        return element;
    };

    this.init = init;
    this.updateData = updateData;
    this.getElement = getElement;
    this.updatePrice = updatePrice;
};