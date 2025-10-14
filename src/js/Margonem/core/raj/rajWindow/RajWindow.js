const RajGetSpecificData = require('@core/raj/RajGetSpecificData');
const WindowPosition = require('@core/tutorial/WindowPosition');


module.exports = function() {

    let wnd = null;
    let id = null;
    let $content = null;
    let amountImageToUpdate = 0;
    let addToAlertLayer = false;

    let target = null;
    let htmlTarget = null;

    const init = () => {
        initWindow();
    };

    const inreaseAmountImageToUpdate = () => {
        amountImageToUpdate++;
    };

    const decreaseAmountImageToUpdate = () => {
        amountImageToUpdate--;
    };

    const initWindow = () => {

        $content = $('<div>').addClass('sraj-content');

        wnd = Engine.windowManager.add({
            content: $content,
            title: '',
            nameWindow: Engine.windowsData.name.SRAJ_WINDOW,
            type: Engine.windowsData.type.TRANSPARENT,
            manageOpacity: 3,
            addClass: "sraj-wnd",
            onclose: () => {
                getEngine().rajWindowManager.removeWindow(id);
            }
        });


    };

    const addWindowToAlertLayer = () => {
        if (addToAlertLayer) {
            return;
        }

        addToAlertLayer = true;
        wnd.addToAlertLayer();
    };

    const updateData = (data, additionalData) => {
        wnd.title(data.header);

        if (data.overlay) {
            wnd.addBackdrop(Engine.interface.get$alertsLayer())
        }

        if (data.position) {

            if (data.position.target) {
                let targetObject = RajGetSpecificData.getTargetObject(data.position.target, additionalData);

                if (targetObject) {
                    setTarget(targetObject);
                }
            }

            if (data.position.htmlTarget) {
                setHtmlTarget(data.position.htmlTarget)
            }

        }

        setId(data.id);
        countImageOccur(data.list);
        updateContent(data.list);
        updateWindow();
    };

    const setTarget = (_target) => {
        target = _target
    };

    const setHtmlTarget = (_htmlTarget) => {
        htmlTarget = _htmlTarget;
    };

    const updateWindow = () => {
        if (amountImageToUpdate != 0) {
            return
        }

        if (!Engine.rajWindowManager.checkWindowListExist(id)) {
            return;
        }

        addWindowToAlertLayer();

        updateWindowPos();
    };

    const updateWindowPos = () => {
        let $wnd = wnd.$;
        let tileSize = CFG.tileSize;
        let mapOffset = getEngine().map.getOffset();

        if (target) {
            wnd.show();
            WindowPosition.findPosition(
                wnd.$,
                target.fw,
                target.fh,
                (target.d.x - mapOffset[0] / tileSize) * tileSize + Engine.interface.get$GAME_CANVAS().offset().left,
                (target.d.y - mapOffset[1] / tileSize) * tileSize + Engine.interface.get$GAME_CANVAS().offset().top
            );

            return
        }

        if (htmlTarget) {
            let $obj = $(htmlTarget);

            if (!$obj.length) {
                wnd.updatePos();
                return;
            }

            let offsetObj = $obj.offset();
            let wObj = $obj.width();
            let hObj = $obj.height();

            wnd.show();
            WindowPosition.findPosition(
                $wnd,
                wObj,
                hObj,
                offsetObj.left,
                offsetObj.top,
                $obj,
                null
            );

            return
        }

        wnd.updatePos();
    };

    const setId = (_id) => {
        id = _id;
    };

    const updateContent = (data) => {
        for (let k in data) {
            let one = data[k];

            switch (one.name) {
                case "TEXT":
                    updateText(one);
                    break;
                case "IMAGE":
                    updateImage(one);
                    break;
                case "BUTTON":
                    updateButton([one]);
                    break;
                case "BUTTON_CONTAINER":
                    updateButton(one.list);
                    break;
            }

        }

    };

    const countImageOccur = (data) => {
        for (let k in data) {
            if (data[k].name == "IMAGE") {
                inreaseAmountImageToUpdate();
            }
        }
    };

    const updateImage = (data) => {

        let fullUrl = CFG.a_rajGraphics + data.url;
        let $img = $('<div>').addClass('sraj-img');

        Engine.imgLoader.onload(fullUrl, false, false,
            (i) => {
                $img.append($(i));
                decreaseAmountImageToUpdate();
                updateWindow();
            },
            () => {
                decreaseAmountImageToUpdate();
                updateWindow();
            }
        );

        $content.append($img);
    };

    const updateText = (data) => {
        let $div = $('<div>').html(parseClanBB(data.text));
        $div.addClass('sraj-text');
        $content.append($div);
    };

    const updateButton = (buttonList) => {
        let $srajButtonWrapper = createButtonWrapper();

        for (let k in buttonList) {
            let $button = createSrajButton(buttonList[k]);
            $srajButtonWrapper.append($button);
        }

        appendButtonWrapper($srajButtonWrapper);
    };

    const createButtonWrapper = () => {
        return $('<div>').addClass('sraj-button-wrapper')
    };

    const appendButtonWrapper = ($buttonWrapper) => {
        $content.append($buttonWrapper);
    };

    const createSrajButton = (data) => {
        return createButton(data.label, ['small', 'green'], function() {
            let clickData = data.click;

            if (!clickData) {
                return
            }

            if (clickData.external_properties) {
                Engine.rajController.parseObject(clickData.external_properties, []);
            }

            if (clickData.jsScript) {
                eval(clickData.jsScript);
            }

            if (clickData.function && clickData.function == 'CLOSE') {
                getEngine().rajWindowManager.removeWindow(id);
            }
        });
    };

    const remove = () => {
        wnd.remove();
        wnd = null;
    };

    this.init = init;
    this.updateData = updateData;
    this.remove = remove;

};