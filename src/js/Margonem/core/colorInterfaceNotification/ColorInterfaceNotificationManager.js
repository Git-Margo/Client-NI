const ColorInterfaceNotificationData = require('core/colorInterfaceNotification/ColorInterfaceNotificationData');
const ColorInterfaceNotification = require('core/colorInterfaceNotification/ColorInterfaceNotification');

module.exports = function() {

    const moduleData = {
        fileName: "ColorInterfaceNotificationManager.js"
    };
    const ACTION_CREATE = ColorInterfaceNotificationData.ACTION.CREATE;
    const ACTION_REMOVE = ColorInterfaceNotificationData.ACTION.REMOVE;
    const ACTION_SHOW = ColorInterfaceNotificationData.ACTION.SHOW;
    const ACTION_HIDE = ColorInterfaceNotificationData.ACTION.HIDE;

    let notificationList = null;
    let mainCanvas = null;
    let mainCtx = null;
    let initialized = null;
    let blink = null;


    const init = () => {
        //createMainCanvas();
        clearNotificationList();
    };

    const clearNotificationList = () => {
        notificationList = {};
    };

    const updateData = (data) => {
        if (!checkCorrectData(data)) {
            return
        }

        switch (data.action) {
            case ACTION_CREATE:
                createColorInterfaceNotification(data);
                break;
            case ACTION_REMOVE:
                removeColorInterfaceNotification(data);
                break;
            case ACTION_SHOW:
                showColorInterfaceNotification(data, true);
                break;
            case ACTION_HIDE:
                showColorInterfaceNotification(data, false);
                break;
        }
    };

    const addToNotificationList = (id, colorInterfaceNotification) => {
        notificationList[id] = colorInterfaceNotification;
    };

    const createColorInterfaceNotification = (data) => {

        let id = data.id;
        let color = data.color;
        let blur = data.blur ? data.blur : ColorInterfaceNotificationData.DEFAULT_DATA.BLUR;

        if (checkNotificationExist(id)) {
            errorReport(moduleData.fileName, "createColorInterfaceNotification", "id exist!", data);
            return
        }

        let colorInterfaceNotification = new ColorInterfaceNotification();

        addToNotificationList(id, colorInterfaceNotification);

        colorInterfaceNotification.init(color, blur);
    };

    const removeColorInterfaceNotification = (data) => {
        let id = data.id;

        if (!checkNotificationExist(id)) {
            errorReport(moduleData.fileName, "createColorInterfaceNotification", "id not exist!");
            return
        }

        delete notificationList[id];
    }

    const showColorInterfaceNotification = (data, show) => {
        let id = data.id;

        if (!checkNotificationExist(id)) {
            errorReport(moduleData.fileName, "createColorInterfaceNotification", "id not exist!", data);
            return
        }

        let colorInterfaceNotification = getColorInterfaceNotification(id);

        colorInterfaceNotification.setActive(show);

        if (!show) {
            clearCanvas();
        }
    };

    const checkNotificationExist = (id) => {
        return notificationList[id] ? true : false;
    };

    const getColorInterfaceNotification = (id) => {
        return notificationList[id];
    };

    const checkCorrectData = (data) => {
        const FUNC = "checkCorrectData";

        if (!elementIsObject(data)) {
            errorReport(moduleData.fileName, FUNC, "data have to be object!", data);
            return false
        }

        if (!data.action) {
            errorReport(moduleData.fileName, FUNC, "attr action not exist!", data);
            return false
        }

        if (!data.id) {
            errorReport(moduleData.fileName, FUNC, "attr id not exist!", data);
            return false
        }

        if (data.blur) {
            if (!isNumberFunc(data.blur)) {
                errorReport(moduleData.fileName, FUNC, "attr blur is not number!", data);
                return false
            }
        }

        if (![ACTION_CREATE, ACTION_REMOVE, ACTION_SHOW, ACTION_HIDE].includes(data.action)) {
            errorReport(moduleData.fileName, FUNC, "unregistered action", data);
            return false
        }

        if (data.action == ACTION_CREATE) {
            if (!data.color) {
                errorReport(moduleData.fileName, FUNC, "attr color not exist!", data);
                return false
            }
        }

        return true
    };

    //const getDrawableList = () => {
    //    let a = [];
    //
    //    for (let k in notificationList) {
    //        a.push(notificationList[k]);
    //    }
    //
    //    return a;
    //};

    const onClear = () => {
        clearNotificationList();
    };

    const onResize = () => {
        setSizeCanvas();

        for (let k in notificationList) {
            notificationList[k].onResize();
        }
    };

    const setBlink = (state) => {
        blink = state ? true : false;
    };

    const createMainCanvas = () => {
        //let $GAME_CANVAS = getEngine().interface.get$GAME_CANVAS();

        mainCanvas = document.createElement("canvas");
        mainCtx = mainCanvas.getContext('2d');
        mainCanvas.id = 'color-interface-notification';

        mainCanvas.classList.add('color-interface-notification');
        //setSizeCanvas(mainCanvas, $GAME_CANVAS.width(), $GAME_CANVAS.height());
        setSizeCanvas()

        Engine.interface.get$gameLayer().append(mainCanvas);
    };

    const setSizeCanvas = () => {
        let $GAME_CANVAS = getEngine().interface.get$GAME_CANVAS();
        mainCanvas.width = $GAME_CANVAS.width();
        mainCanvas.height = $GAME_CANVAS.height();
    };

    const update = (dt) => {
        if (!checkDraw()) {
            return
        }

        for (let k in notificationList) {
            notificationList[k].update(dt);
        }
    }

    const checkDraw = () => {
        if (!mainCtx) {
            return false;
        }

        for (let k in notificationList) {
            if (notificationList[k].getActive()) {
                return true;
            }
        }

        return false;
    };

    const clearCanvas = () => {
        if (!mainCtx) {
            return;
        }

        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    }

    const draw = () => {

        if (!checkDraw()) {
            if (mainCtx) {
                hideCanvas();
            }
            return
        }

        showCanvas();

        clearCanvas();

        for (let k in notificationList) {
            notificationList[k].draw(mainCtx);
        }
    };

    const hideCanvas = () => {
        if (mainCanvas.style.display == 'none') {
            return
        }

        mainCanvas.style.display = "none";
    };

    const showCanvas = () => {
        if (mainCanvas.style.display == 'block') {
            return
        }

        mainCanvas.style.display = "block";
    }

    const createForceColorInterfaceNotification = (id, color, blur) => {
        if (Engine.colorInterfaceNotificationManager.checkNotificationExist(id)) {
            Engine.colorInterfaceNotificationManager.updateData({
                action: ACTION_REMOVE,
                id: id
            });
        }

        Engine.colorInterfaceNotificationManager.updateData({
            action: ACTION_CREATE,
            id: id,
            color: color,
            blur: blur
        });
        Engine.colorInterfaceNotificationManager.updateData({
            action: ACTION_SHOW,
            id: id
        })
    };

    const getBlink = () => blink;

    this.init = init;
    this.updateData = updateData;
    this.onClear = onClear;
    this.checkNotificationExist = checkNotificationExist;
    this.onResize = onResize;
    this.createMainCanvas = createMainCanvas;
    this.getBlink = getBlink;
    this.setBlink = setBlink;
    this.update = update;
    this.draw = draw;
    this.createForceColorInterfaceNotification = createForceColorInterfaceNotification;

};