var tpl = require('@core/Templates');
//var OutfitStore = require('@core/shop/OutfitStore');
//var PetStore = require('@core/shop/PetStore');
let CharacterData = require('@core/characters/CharactersData');
let PetActions = require('@core/PetActions');
const {
    getParsedPetData
} = require('./HelpersTS');

module.exports = function() {

    let previewId = null;
    let petActions = new PetActions();

    this.init = () => {
        this.initWnd();
        this.wnd.center();
    };

    this.setPreviewId = (id) => {
        previewId = id;
    };

    this.initWnd = () => {
        Engine.windowManager.add({
            content: tpl.get('show-miniature'),
            nameWindow: Engine.windowsData.name.SHOW_MINIATURE,
            type: Engine.windowsData.type.TRANSPARENT,
            nameRefInParent: 'wnd',
            objParent: this,
            addClass: 'show-miniature-window',
            onclose: () => {
                this.close();
            }
        });

        this.wnd.addToAlertLayer();
        this.wnd.setWndOnPeak();
    };

    this.onUpdate = (i, kind) => {

        let name;
        let tempList;
        let canvasCharacterWrapper;

        switch (kind) {
            case CharacterData.drawSystem.PLAYER_OUTFIT:

                //tempList  = i._cachedStats['outfit'].split(',');
                tempList = i.getOutfitStat().split(',');
                name = i.name;

                canvasCharacterWrapper = Engine.canvasCharacterWrapperManager.addCharacter({
                    drawSystem: CharacterData.drawSystem.PLAYER_OUTFIT,
                    path: tempList[1],
                });

                this.wnd.$.find('.info-icon').tip(_t('action_info_outfit'))
                break;
            case CharacterData.drawSystem.PET:

                //tempList  			= i._cachedStats['pet'].split(',');
                tempList = i.getPetStat().split(',');
                name = tempList[0];
                let path = tempList[1]
                let actionAmount = petActions.checkActionsAmount(path)

                let actions = actionAmount ? tempList[tempList.length - 1] : '';

                canvasCharacterWrapper = Engine.canvasCharacterWrapperManager.addCharacter({
                    drawSystem: CharacterData.drawSystem.PET,
                    path: path,
                    actions: actions,
                    //fullPetData	: getParsedPetData(i._cachedStats['pet'])
                    fullPetData: getParsedPetData(i.getPetStat())
                });

                this.wnd.$.find('.info-icon').tip(_t('action_info', null, 'pet'))
                break;
            default:
                errorReport('ShowMiniature.js', 'onUpdate', "Bad kind of miniature!" + kind);
                break;
        }

        let id = canvasCharacterWrapper.getId();
        let $canvas = $(canvasCharacterWrapper.getCanvas());

        this.setPreviewId(id);
        this.wnd.$.find('.canvas-wrapper').append($canvas);
        this.wnd.title(name);
    };

    this.close = () => {
        this.wnd.remove();
        if (previewId != null) Engine.canvasCharacterWrapperManager.removeCharacter(previewId);
        Engine.showMiniature = false;
    };

};