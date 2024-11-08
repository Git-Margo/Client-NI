// let wnd = require('core/Window');
let Templates = require('core/Templates');
let CharacterData = require('core/characters/CharactersData');

module.exports = function() {

    this.itemId = null;
    this.ttl = null;
    this.active = null;
    this.canvsCharacterWrapperIdArray = [];

    this.init = (preview) => {
        this.initWindow(preview);
        this.initButtons();
    };

    this.initButtons = () => {
        let $but1 = Templates.get('button').addClass('green disable small');
        let $but2 = Templates.get('button').addClass('green small');
        this.wnd.$.find('.save-button').append($but1);
        this.wnd.$.find('.cancel-button').append($but2);
        $but1.find('.label').html(_t('accept', null, 'trade'));
        $but2.find('.label').html(_t('cancel'));

        $but1.on('click', () => {
            this.acceptAlert();
        });
        $but2.on('click', () => {
            this.close();
        });
    };

    this.acceptAlert = () => {
        var txt = _t('one-choose');
        mAlert(txt, [{
            txt: _t('accept', null, 'trade'),
            callback: () => {
                console.log(this.active);
                _g("moveitem&st=2&id=" + this.itemId + "&outfit_id=" + this.active, () => {
                    this.close();
                });
                return true;
            }
        }, {
            txt: _t('cancel'),
            callback: function() {
                return true;
            }
        }]);
    };

    this.update = (data) => {
        this.itemId = data.item_id;
        this.ttl = data.outfitsTTL;

        for (let k in data.outfits) {
            this.createOutfits(data.outfits[k], k);
        }

        this.wnd.center();
    };

    this.createOutfits = (outfits, id) => {
        const genderHtmlCodes = {
            1: '&#9794;',
            2: '&#9792;'
        };
        let $outfitWrapper = Templates.get('choose-outfit-wrapper');

        let $span = $('<span>').html(outfits.name);
        let $gender = $('<div>').addClass('gender gender-' + outfits.gender);
        let $wrapper = $('<div>');

        $gender.html(genderHtmlCodes[outfits.gender]);
        $wrapper.append($span);
        $wrapper.append($gender);

        $outfitWrapper.find('.outfit-name').html($wrapper);

        this.setImage($outfitWrapper.find('.outfit-image'), outfits.img);
        this.wnd.$.find('.all-outfits').append($outfitWrapper);
        $outfitWrapper.click(() => {
            this.wnd.$.find('.choose-outfit-wrapper').removeClass('active');
            this.wnd.$.find('.save-button').find('.button').removeClass('disable');
            $outfitWrapper.addClass('active');
            this.active = id;
        })
    };

    this.setImage = ($outfitWrapper, url) => {

        let canvasCharacterWrapper = Engine.canvasCharacterWrapperManager.addCharacter({
            drawSystem: CharacterData.drawSystem.PLAYER_OUTFIT,
            path: url
        });

        let id = canvasCharacterWrapper.getId();
        let $canvas = $(canvasCharacterWrapper.getCanvas());

        this.canvsCharacterWrapperIdArray.push(id);

        $canvas.addClass('outfit');

        $outfitWrapper.append($canvas);
    };

    this.initWindow = (preview) => {

        let dataObject = {
            content: Templates.get('choose-outfit'),
            nameWindow: Engine.windowsData.name.CHOOSE_OUTFIT,
            nameRefInParent: 'wnd',
            objParent: this,
            addClass: 'choose-outfit-window',
            onclose: () => {
                this.close();
            }
        };

        if (preview) {
            dataObject.type = Engine.windowsData.type.TRANSPARENT;
            dataObject.title = _t('preview', null, 'shop');
        } else {
            dataObject.title = _t('choose_outfit');
        }

        Engine.windowManager.add(dataObject);
        this.wnd.addToAlertLayer();
    };

    this.removeAllCanvasCharacterWprapper = () => {
        for (let i = 0; i < this.canvsCharacterWrapperIdArray.length; i++) {
            let id = this.canvsCharacterWrapperIdArray[i];
            Engine.canvasCharacterWrapperManager.removeCharacter(id);
        }
    };

    this.close = () => {
        this.removeAllCanvasCharacterWprapper();
        this.wnd.remove();
        Engine.chooseOutfit = null;
    };

};