let CharacterData = require('core/characters/CharactersData');
let Tpl = require('core/Templates');

module.exports = function() {
    let self = this;
    this.list = [];
    this.$header = null;
    this.chooseOutfitFromList = 0;

    this.init = (d) => {
        this.slot = d.slot;
        this.prepareList(d.list);
        this.setHeader();
        this.setOutfit();
    };

    this.removeOldOutfit = () => {
        let outfit = this.getOutfitData();
        let $canvas = $(outfit.canvasCharacterWrapper);
        let id = outfit.canvasCharacterWrapperId;

        Engine.shop.basket.removeFromCanvasCharacterSlots(this.slot);

        $canvas.remove();
        Engine.canvasCharacterWrapperManager.removeCharacter(id);
    };

    this.setHeader = () => {
        this.$header = Tpl.get('outfit-selector-header');
        this.$arrow = Tpl.get('outfit-selector-arrow');
        let left = self.slot * 28;

        this.$header.addClass('outfit-selector-slot-' + this.slot);
        this.$arrow.addClass('outfit-selector-arrow-' + this.slot);

        this.$header.css({
            left: left
        });

        this.$arrow.css({
            left: left
        });

        this.$arrow.on('click', this.changeOutfit);

        this.setOutfitSelectorIndex();
        this.$header.find('.outfit-selector-index-max').html(this.list.length);

        Engine.shop.wnd.$.find('.sell-items').append(this.$header);
        Engine.shop.wnd.$.find('.sell-items').append(this.$arrow);
    };

    this.setOutfitSelectorIndex = () => {
        this.$header.find('.outfit-selector-index').html(this.chooseOutfitFromList + 1);
    };

    this.prepareList = (list) => {
        for (let k in list) {
            this.list.push({
                path: list[k].img,
                gender: list[k].gender,
                name: list[k].name,
                canvasCharacterWrapper: null,
                canvasCharacterWrapperId: null
            });
        }
    };

    this.setOutfit = () => {
        let outfit = this.getOutfitData();
        this.name = outfit.name;
        this.gender = outfit.gender;

        this.setAvatar();
    };

    this.getOutfitData = () => {
        return this.list[this.chooseOutfitFromList];
    };

    this.setCanvasCharacterWrapper = (canvas, id) => {
        let outfit = this.getOutfitData();

        outfit.canvasCharacterWrapper = canvas;
        outfit.canvasCharacterWrapperId = id;
    };

    this.setAvatar = () => {

        let outfit = this.getOutfitData();

        let canvasCharacterWrapper = Engine.canvasCharacterWrapperManager.addCharacter({
            drawSystem: CharacterData.drawSystem.PLAYER_OUTFIT,
            path: outfit.path
        });

        let id = canvasCharacterWrapper.getId();
        let $canvas = $(canvasCharacterWrapper.getCanvas());

        this.setCanvasCharacterWrapper($canvas, id);
        Engine.shop.basket.addToCanvasCharacterSlots(this.slot, id);

        $canvas.addClass('canvasCharacterWrapper slot-id-' + this.slot);
        Engine.shop.wnd.$.find('.sell-items').append($canvas);
    };

    this.nextChooseOutfitFromList = () => {
        this.chooseOutfitFromList++;
        if (this.chooseOutfitFromList + 1 > this.list.length) this.chooseOutfitFromList = 0;
    };

    this.changeOutfit = () => {
        this.removeOldOutfit();
        this.nextChooseOutfitFromList();
        this.setOutfit();
        this.setOutfitSelectorIndex();
    };

};