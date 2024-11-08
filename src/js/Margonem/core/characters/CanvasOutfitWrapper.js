let HeroDirectionData = require('core/characters/HeroDirectionData');


module.exports = function() {

    let id;
    let drawSystem;
    let path;

    let fw;
    let fh;
    let frames;
    let sprite;
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

    let canvas;
    let ctx;


    let wasRemove = false;
    let ready = false;


    function init(_id) {
        id = _id;

        initCanvas();
    }

    function getId() {
        return id;
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

    function onClick(e) {
        let m = [];

        for (let i = 0; i < dirsTxt.length; i++) {
            let menuItem = createMenuItem(_t(dirsTxt[i]), i);
            m.push(menuItem);
        }

        if (chooseDir != null) m.push(createMenuItem(_t('cancel_action_or_dir'), null));

        m.push([_t('try_on'), () => Engine.hero.outfitPreview(path)]);

        Engine.interface.showPopupMenu(m, e);
    }

    function createMenuItem(dirName, _chooseDir) {
        let actionCallback = () => {
            chooseDir = _chooseDir
        };
        return [dirName, actionCallback]
    }

    function updateData(data) {
        drawSystem = data.drawSystem;
        path = data.path;

        loadImg();

        //self.updateCollider();
    }

    function loadImg() {
        Engine.imgLoader.onload(CFG.r_opath + path, {
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
                errorReport('CanvsCharacterWrapper.js', 'loadImg', 'Load img error')
            }
        );
    }

    function beforeOnload(f, i) {
        fw = f.hdr.width / 4;
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
        manageDir(dt);
        manageFrame(dt);
    }

    function manageDir(dt) {
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

        frameTime += dt * speed;

        if (frameTime >= 0.5) {
            frame++;
            frameTime = frameTime % 0.5;
            if (frame == 4) frame = 0;
        }
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

        //switch (dirs[dirIndex]) {
        //	case 'S':
        //		bgY = 0;
        //		break;
        //	case 'W':
        //		bgY = fh;
        //		break;
        //	case 'E':
        //		bgY = fh * 2;
        //		break;
        //	case 'N':
        //		bgY = fh * 3;
        //		break;
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

        let wPosImg = frame * fw;
        let yPosImg = bgY + (activeFrame * fh * 4);

        ctx.clearRect(0, 0, fw, fh);
        ctx.drawImage(sprite, wPosImg, yPosImg, fw, fh, 0, 0, fw, fh);
    }


    function remove() {
        $(canvas).remove();
        canvas = null;
        wasRemove = true
    }

    this.init = init;
    this.updateData = updateData;
    this.update = update;
    this.draw = draw;
    this.getCanvas = getCanvas;
    this.getId = getId;
    this.remove = remove;

};