let OutfitCard = require('@core//components/OutfitCard');
let HeroDirectionData = require('@core/characters/HeroDirectionData');

module.exports = function() {


    let outfitCards = null;
    let interval = null;

    let xFrame = null;
    let yFrame = null;

    const init = () => {
        outfitCards = {};
        createInterval();
    };

    const setXFrame = (v) => {
        xFrame = v;
    };

    const setYFrame = (v) => {
        yFrame = v;
    };

    const resetFrame = () => {
        setXFrame(0);
        setYFrame(0);
    }

    const updateMove = () => {
        setXFrame(xFrame + 1);

        if (xFrame > 3) {
            setXFrame(0);
            setYFrame(yFrame + 1);

            if (yFrame > 3) {
                setYFrame(0);
            }
        }
    };

    const updateOutfitsPos = () => {
        for (let k in outfitCards) {
            if (!outfitCards[k].getState()) {
                continue
            }

            let $outfit = outfitCards[k].getOutfit();
            let $img = $outfit.find('.img-avatar-correct');

            if (!$img.length) {
                return
            }

            setPosition($img);
            return
        }

    };

    const setPosition = ($img) => {
        let width = $img.width();
        let height = $img.height();

        $img.css({
            backgroundPositionX: xFrame * width,
            backgroundPositionY: yFrame * height
        })
    };

    const createInterval = () => {
        interval = setInterval(function() {
            updateMove();
            updateOutfitsPos();
        }, 200);
    };

    const getActiveOutfitCard = () => {
        for (let k in outfitCards) {
            if (outfitCards[k].getState()) {
                return outfitCards[k];
            }
        }

        return null;
    };

    const setStateAndUpdate = (state) => {
        for (let k in outfitCards) {
            outfitCards[k].setStateAndUpdate(state)
        }
    };



    const updateData = (data, $wrapper, clb) => {

        for (let k in data) {
            let oneData = data[k];
            let id = oneData.id;
            //let action      = oneData.action;

            //if (action == "INIT_DATA") {
            let outfitCard = createOneOutfitCard(data[k], clb);
            addToOutfitCard(id, outfitCard);
            $wrapper.append(outfitCard.getOutfit());
            //}

            //if (action == "UPDATE_DATA") {
            //
            //    let outfitCard = getByID(id);
            //    if (!outfitCard) {
            //        continue;
            //    }
            //    if (oneData.url) {
            //        outfitCard.setOutfit(oneData.url);
            //    }
            //}

        }

        resetFrame();
    };

    const addToOutfitCard = (id, outfitCard) => {
        outfitCards[id] = outfitCard;
    };

    const getByID = (id) => {
        return outfitCards[id];
    }

    const createOneOutfitCard = (oneData, clb) => {
        let outfitCard = new OutfitCard();

        oneData.beforeClb = () => {
            resetFrame();
            updateOutfitsPos();
            setStateAndUpdate(false);
        };

        oneData.afterClb = (state, activeElement) => {
            clb(state, activeElement);
        };

        outfitCard.init();
        outfitCard.updateData(oneData);

        return outfitCard
    };

    const destroy = () => {
        clearInterval(interval);
    };

    const getOutfitCards = () => {
        return outfitCards
    }

    this.init = init;
    this.updateData = updateData;
    this.destroy = destroy;
    this.getOutfitCards = getOutfitCards;

};