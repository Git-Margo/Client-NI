const Template = require('@core/Templates')

module.exports = function() {

    let $outfit = null;
    let id = null;
    let state = false;

    const init = () => {
        $outfit = Template.get('outfit-card');
    };

    const create = (data) => {

        if (isset(data.id)) {
            setId(data.id);
        }

        if (isset(data.state)) {
            setState(data.state);
        }

        setOutfit(data.url);

        console.log(data.url)

        if (isset(data.text)) {
            setText(data.text);
        }

        if (isset(data.textColor)) {
            setTextColor(data.textColor);
        }

        if (isset(data.disable)) {
            setDisable(data.disable)
        }

        if (isset(data.disableText)) {
            setDisableText(data.disableText);
        }

        if (isset(data.amount)) {
            setAmount(data.amount);
        }

        if (isset(data.cl)) {
            $outfit.addClass(data.cl);
        }

        initClick(data.clb, data.beforeClb, data.afterClb);
    };

    const setId = (_id) => {
        id = _id
    };

    const initClick = (clb, beforeClb, afterClb) => {
        $outfit.on('click', () => {
            //let newState = !state;
            let newState = true;

            if (beforeClb) {
                beforeClb(newState, this);
            }

            setState(newState);
            updateState();

            if (clb) {
                clb(state, this);
            }

            if (afterClb) {
                afterClb(state, this);
            }
        })
    };

    const setState = (_state) => {
        state = _state;

        //let $outfitBorder = $outfit.find('.outfit-border');
        //
        //if (!state) {
        //    $outfitBorder.removeClass('active');
        //} else {
        //    $outfitBorder.addClass('active');
        //}
    };

    const updateState = () => {
        let $outfitBorder = $outfit.find('.outfit-border');

        if (!state) {
            $outfitBorder.removeClass('active');
        } else {
            $outfitBorder.addClass('active');
        }
    };

    const setStateAndUpdate = (state) => {
        setState(state);
        updateState();
    };

    const setOutfit = (url) => {
        let patch = CFG.a_opath + '/' + url;

        let $outfitWrapper = $outfit.find('.outfit-wrapper')

        $outfitWrapper.empty();

        createImgStyle($outfitWrapper, patch);
    };

    const setDisable = (_disable) => {
        _disable ? $outfit.addClass('disable') : $outfit.removeClass('disable');
    };

    const setText = (text) => {
        $outfit.find('.text').html(text);
    };

    const setTextColor = (textClass) => {
        let $text = $outfit.find('.text');

        $text.removeClass("red green");
        $text.addClass(textClass);
    };

    const setDisableText = (disableText) => {
        $outfit.find('.disable-text').text(disableText);
    }

    const setAmount = (amount) => {
        $outfit.addClass('show-amount')
        $outfit.find('.amount').text(amount);
    };

    const updateData = (data) => {
        create(data);
    };

    const getState = () => {
        return state;
    };

    const getOutfit = () => {
        return $outfit;
    };

    const getId = () => {
        return id;
    };

    this.setDisable = setDisable;
    this.setState = setState;
    this.setOutfit = setOutfit;
    this.setStateAndUpdate = setStateAndUpdate;
    this.setDisableText = setDisableText;
    this.getState = getState;
    this.init = init;
    this.updateData = updateData;
    this.getId = getId;
    this.getOutfit = getOutfit;

}