const Template = require('@core/Templates');

module.exports = function() {

    let $searchWrapper = null;
    let $searchInput = null;
    let $searchX = null;

    let keyUpCallback = null;

    const init = (data) => {
        initSearchWrapper(data);
        initVars();
        initPlaceholder();
        initEvents(data);
    };

    const initSearchWrapper = (data) => {
        $searchWrapper = Template.get('search-wrapper');

        if (data.addClass) {
            $searchWrapper.addClass(data.addClass);
        }
    };

    const initVars = () => {
        $searchInput = $searchWrapper.find('.search');
        $searchX = $searchWrapper.find('.search-x');
    };

    const initPlaceholder = () => {
        $searchInput.attr('placeholder', _t('search'));
    };

    const initEvents = (data) => {

        keyUpCallback = data.keyUpCallback

        $searchInput.keyup(function(e) {
            keyUp(e)
        });

        $searchX.on('click', function() {
            clear();
        });
    };

    const keyUp = (e) => {
        let val = $searchInput.val();
        keyUpCallback(e, val)
    }

    const getSearchWrapper = () => {
        return $searchWrapper;
    };

    const clear = () => {
        let $searchInput = $searchWrapper.find('.search');

        $searchInput.val('')
            .blur()
            .trigger('keyup');
    };


    this.init = init;
    this.getSearchWrapper = getSearchWrapper;
    this.keyUp = keyUp;
    this.clear = clear;
}