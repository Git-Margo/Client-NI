module.exports = function() {

    let filter = null;

    //let filter = "sepia(100%) hue-rotate(35deg) saturate(150%) brightness(105%) contrast(95%)"
    //let filter = "sepia(80%) grayscale(30%) contrast(90%) brightness(90%)"
    //let filter = "blur(1px) brightness(120%) contrast(150%)"
    //let filter = "brightness(120%) contrast(150%)"


    const init = () => {

    }

    const setFilter = (_filter) => {
        filter = _filter;
    }

    const getFitler = () => {
        return filter;
    }

    const updateFilter = (path, img, gif, withoutFilter) => {


        let _img = Engine.imgLoader.checkExist(path, gif);

        let i = _img ? _img : img;

        if (withoutFilter) {
            return i;
        }

        if (!filter || filter == 'none') {
            return i;
        }

        let newImg = Engine.imgLoader.getImgWithFilter(path, filter, gif);

        if (!newImg) {
            return i;
        }

        return newImg;
    };

    const updateFilterWithoutPath = (ctx, img) => {
        let filter = getEngine().canvasFilter.getFitler();

        if (filter == null || filter == 'none') {

        } else {
            if (img) {

            }

            if (ctx) {
                ctx.filter = filter;
            }
        }
    }

    const refreshObjects = () => {
        Engine.npcs.refreshFilter();
        Engine.fakeNpcs.refreshFilter();
        Engine.others.refreshFilter();
        Engine.map.updateFilterImage();
        Engine.map.groundItems.refreshFilter();
        Engine.floatObjectManager.refreshFilter();
        Engine.hero.updateFilterImage();
        if (Engine.hero.havePet()) {
            Engine.hero.getPet().updateFilterImage();
        }
        Engine.weather.refreshFilter();
        Engine.nightController.refreshFilter();
        Engine.rajExtraLight.refreshFilter();
        Engine.dynamicLightsManager.refreshFilter();
        Engine.dynamicDirCharacterLightsManager.refreshFilter();
        Engine.behaviorDynamicLightsManager.refreshFilter();
    }


    this.init = init;
    this.setFilter = setFilter;
    this.getFitler = getFitler;
    this.updateFilter = updateFilter;
    this.updateFilterWithoutPath = updateFilterWithoutPath;
    this.refreshObjects = refreshObjects;

};