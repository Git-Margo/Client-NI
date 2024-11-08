let PetActions = require('core/PetActions.js');
let HeroDirectionData = require('core/characters/HeroDirectionData');

module.exports = function() {

    let self = this;

    let id;
    // let drawSystem;
    let path;
    let nameActionArray;
    let actionsDataArray;

    let actionFrame = 0;

    let fw;
    let fh;
    let frames;
    let sprite;
    let auxFrames;
    let anim;
    let activeFrame = 0;
    let timePassed = 0;
    let frameTime = 0;
    let frame = 0;

    let chooseDir = null;

    let dirTimePassed = 0;
    //let dirs           = ['S', 'W', 'N', 'E'];
    let dirs = [HeroDirectionData.S, HeroDirectionData.W, HeroDirectionData.N, HeroDirectionData.E];
    let dirsTxt = ['down', 'left', 'up', 'right'];
    let dirIndex = 0;

    let speed = 2;

    let runActionIndex = null;

    let canvas;
    let ctx;

    let wasRemove = false;
    let ready = false;

    let petActions = null;


    function init(_id) {
        id = _id;
        petActions = new PetActions();

        initCanvas();
    }

    function getId() {
        return id
    }

    function setSizeOfCanvas(w, h) {
        canvas.width = w;
        canvas.height = h;
    }

    function initCanvas() {
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');

        $(canvas).on('contextmenu', (e) => {
            getE(e);
            onClick(e)
        });

        setSizeOfCanvas(32, 48)
    }

    function updateData(data) {
        path = data.path;

        if (data.actions != '') {
            nameActionArray = data.actions.split("|");
            actionsDataArray = petActions.createActionsDataArrayForHero(nameActionArray)
        }

        loadImg();
    }

    function onClick(e) {
        var m = [];

        if (!actionsDataArray) return;

        for (var i = 0; i < actionsDataArray.length; i++) {
            let menuItem = createMenuActionItem(actionsDataArray[i]);
            m.push(menuItem);
        }

        for (let i = 0; i < dirsTxt.length; i++) {
            let menuItem = createMenuDirItem(_t(dirsTxt[i]), i);
            m.push(menuItem);
        }


        if (chooseDir != null || checkActionIsRunning()) {

            // m.push([_t('cancel_action_or_dir'), () => {
            // 	chooseDir = null;
            // 	stopAction();
            // }]);
            m.push(createMenuDirItem(_t('cancel_action_or_dir'), null));

        }

        Engine.interface.showPopupMenu(m, e);
    }

    function createMenuDirItem(dirName, _chooseDir) {
        let actionCallback = () => {
            chooseDir = _chooseDir
            stopAction();
        };
        return [dirName, actionCallback]
    }

    function createMenuActionItem(actionsData) {
        let actionCallback = () => {
            callAction(actionsData.actionIndex);
        };
        return [actionsData.name, actionCallback]
    }

    function callAction(actionIndex) {
        stopAction();
        setRunActionIndex(actionIndex);
        petActions.doAction(self)
    }

    function setRunActionIndex(v) {
        runActionIndex = v;
    }

    function getRunActionIndex() {
        return runActionIndex;
    }

    function getAnim() {
        return anim;
    }

    function getSpecialByRunActionIndex() {

        for (let i = 0; i < actionsDataArray.length; i++) {
            if (actionsDataArray[i].actionIndex == runActionIndex) {
                return actionsDataArray[i].special;
            }
        }
    }

    function loadImg() {
        Engine.imgLoader.onload(CFG.r_ppath + path, {
                speed: false,
                externalSource: cdnUrl
            },
            (i, f) => {
                if (wasRemove) return;
                beforeOnload(f, i);
            },
            (i) => {
                if (wasRemove) return;
                afterLoadImage(i);
            },
            () => {
                if (wasRemove) return;
                errorReport('CanvasCharacterWrapper.js', 'loadImg', 'Load img error')
            }
        );
    }

    function beforeOnload(f, i) {
        var r = new RegExp('-([0-9]+)(a?)\.gif');
        let fData = r.exec(path);

        if (!fData) fData = [0, 0, ''];

        auxFrames = isNaN(parseInt(fData[1])) ? 0 : parseInt(fData[1]);
        anim = fData[2] == 'a';

        fw = f.hdr.width / (4 + auxFrames + (anim ? 1 : 0));
        fh = f.hdr.height / 4;
        frames = f.frames;
        sprite = i;

        setSizeOfCanvas(fw, fh);
    }

    function afterLoadImage() {
        ready = true;
    }

    function update(dt) {

        animate(dt);

        if (checkActionIsRunning()) {

            petActions.updateAction(self, dt);
            //console.log(actionFrame);
            return
        }
        //console.log(actionFrame, frame);

        manageDir(dt);
        manageFrame(dt);
    }

    function manageDir(dt) {

        if (checkActionIsRunning()) return;

        if (chooseDir != null) {
            dirIndex = chooseDir;
            return;
        }

        dirTimePassed += dt * 100;

        if (200 > dirTimePassed) return;

        dirTimePassed = 0;
        dirIndex++;

        if (dirIndex + 1 > dirs.length) dirIndex = 0;
    }

    function manageFrame(dt) {

        if (checkActionIsRunning()) return;

        frameTime += dt * speed;

        if (frameTime >= 0.5) {
            frame++;
            frameTime = frameTime % 0.5;
            if (frame == (anim ? 5 : 4)) frame = anim ? 1 : 0;
        }
    }

    function checkActionIsRunning() {
        return runActionIndex != null;
    }

    function animate(dt) {
        if (frames && frames.length > 1 && dt) {

            timePassed += dt * 100;

            if (frames[activeFrame].delay < timePassed) {

                timePassed = timePassed - frames[activeFrame].delay;
                activeFrame = (frames.length == activeFrame + 1 ? 0 : activeFrame + 1);

            }
        }
    }

    function getCanvas() {
        return canvas;
    }

    function draw() {
        if (!ready) return;

        let bgY;

        if (checkActionIsRunning()) {
            switch (actionFrame) {
                case 0:
                    bgY = 0;
                    break;
                case 1:
                    bgY = fh;
                    break;
                case 2:
                    bgY = fh * 2;
                    break;
                case 3:
                    bgY = fh * 3;
                    break;
            }
        } else {
            //switch (dirs[dirIndex]) {
            //	case 'S' : bgY = 0;       break;
            //	case 'W' : bgY = fh;      break;
            //	case 'E' : bgY = fh * 2;  break;
            //	case 'N' : bgY = fh * 3;  break;
            //}

            switch (dirs[dirIndex]) {
                case HeroDirectionData.S:
                    bgY = 0;
                    break;
                case HeroDirectionData.W:
                    bgY = fh;
                    break;
                case HeroDirectionData.E:
                    bgY = fh * 2;
                    break;
                case HeroDirectionData.N:
                    bgY = fh * 3;
                    break;
            }

        }

        let wPosImg = frame * fw;
        let yPosImg = bgY + (activeFrame * fh * 4);

        ctx.clearRect(0, 0, fw, fh);
        ctx.drawImage(sprite, wPosImg, yPosImg, fw, fh, 0, 0, fw, fh);
    }

    function stopAction() {
        setActiveFrame(0);
        setActionFrame(0);
        setFrame(0);
        setRunActionIndex(null);
    }

    function setDirIndex(v) {
        dirIndex = v;
    }

    function setFrame(v) {
        frame = v;
    }

    function setActiveFrame(v) {
        activeFrame = v;
    }

    function setActionFrame(v) {
        actionFrame = v;
    }

    function getActionFrame() {
        return actionFrame;
    }

    function remove() {
        $(canvas).remove();
        canvas = null;
        wasRemove = false;
    }

    this.init = init;
    this.updateData = updateData;
    this.update = update;
    this.draw = draw;
    this.getCanvas = getCanvas;
    this.getId = getId;
    this.stopAction = stopAction;
    this.setRunActionIndex = setRunActionIndex;
    this.getRunActionIndex = getRunActionIndex;
    this.getSpecialByRunActionIndex = getSpecialByRunActionIndex;
    this.setDirIndex = setDirIndex;
    this.getAnim = getAnim;
    this.setFrame = setFrame;
    this.getActionFrame = getActionFrame;
    this.setActionFrame = setActionFrame;
    this.remove = remove;

};