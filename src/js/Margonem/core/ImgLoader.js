let imgLoader;
let gif = require('@core/GifReader');

function ImgLoader() {

    let moduleData = {
        fileName: "ImgLoader.js"
    }
    let graphicList = {};
    let graphicListGifReader = {};

    let graphicListFilter = {};
    let graphicListGifReaderFilter = {};

    let preLoadSuccessLoadedList = {};

    let yellowCanvas;

    this.init = () => {
        initYellowCanvas();
    };

    this.preLoadImages = () => {
        let list = [{
                url: CFG.r_epath + "elite-here3.gif",
                gifReader: {
                    speed: true,
                    externalSource: cdnUrl
                }
            },
            //{url: '../img/gui/dialogue/dialogue-border.png',                gifReader: false},
            //{url: '../img/gui/dialogue/dialogue-header.png',                gifReader: false},
            //{url: '../img/gui/buttony.png',                                 gifReader: false},
            {
                url: '../img/gui/buttony.png',
                gifReader: false
            },
            {
                url: CFG.oimg + "/questMapBorder/questMapCornerBorder.png",
                gifReader: false
            },
            {
                url: CFG.oimg + "/questMapBorder/questMapMiddleBorder.png",
                gifReader: false
            },
            {
                url: CFG.oimg + "/questMapBorder/questTrackingCornerBorder.png",
                gifReader: false
            },
            {
                url: CFG.oimg + "/questMapBorder/questTrackingMiddleBorder.png",
                gifReader: false
            },
            //{url: '../img/gui/buttony.png',                     gifReader: false},
            //{url: '../img/gui/eq.png',                          gifReader: false},
            //{url: '../img/gui/statystyki.png',                  gifReader: false},
            //{url: '../img/gui/newTutorial/5.gif',               gifReader: false},
            //{url: '../img/def-item.gif',                        gifReader: false}
        ];

        if (!list.length) {
            manageUnlockImages();
            return;
        }

        for (let i = 0; i < list.length; i++) {
            this.cacheInitGraphic(list[i].url, list[i].gifReader);
        }
    };

    this.add = (url, gifReader, image) => {
        if (gifReader) graphicListGifReader[url] = image;
        else graphicList[url] = image;
    };

    this.checkExist = (url, gifReader) => {
        if (gifReader) return graphicListGifReader[url];
        else return graphicList[url];
    };

    this.onload = (path, gifReaderData, beforeOnloadCallback, afterOnloadCallback, onError, reload429) => {
        let gifReader = gifReaderData ? true : false;
        let img = this.checkExist(path, gifReader);

        if (gifReader) this.gifReaderStrategy(img, path, gifReaderData, beforeOnloadCallback, afterOnloadCallback, onError, reload429);
        else this.imageReaderStrategy(img, path, beforeOnloadCallback, afterOnloadCallback, onError, reload429);
    };

    this.getImgWithFilter = (path, filter, gif) => {
        if (gif) {
            if (!graphicListGifReaderFilter[path]) {
                graphicListGifReaderFilter[path] = {};
            }

            let img = this.checkExist(path, {});

            if (!img) {
                return null
            }


            //return createFilterImage(img, filter)

            if (!graphicListGifReaderFilter[path][filter]) {
                graphicListGifReaderFilter[path][filter] = createFilterImage(img, filter)
            }

            return graphicListGifReaderFilter[path][filter]

        } else {
            if (!graphicListFilter[path]) {
                graphicListFilter[path] = {};
            }

            let img = this.checkExist(path, null);

            if (!img) {
                return null
            }

            //return createFilterImage(img, filter)

            if (!graphicListFilter[path][filter]) {
                graphicListFilter[path][filter] = createFilterImage(img, filter)
            }

            return graphicListFilter[path][filter]

        }
    }

    this.clearFilters = () => {
        graphicListFilter = {};
        graphicListGifReaderFilter = {};
    }

    const createFilterImage = (img, filter) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        if (filter == "binary") {

            binanryFilter(canvas);

        } else {
            ctx.filter = filter;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }



        return canvas
    };

    const binanryFilter = (canvas) => {

        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const threshold = 128;

        for (let i = 0; i < data.length; i += 4) {
            const brightness = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            const value = brightness > threshold ? 255 : 0;

            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
        }

        ctx.putImageData(imageData, 0, 0);
    };

    this.getEmptyImage = () => {
        return new Image()
    }

    const initYellowCanvas = () => {
        yellowCanvas = document.createElement('canvas');
        let ctx = yellowCanvas.getContext("2d");
        let tileSize = CFG.tileSize;

        yellowCanvas.width = tileSize;
        yellowCanvas.height = tileSize;

        ctx.fillStyle = "yellow";
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0, 0, tileSize, tileSize);
        ctx.globalAlpha = 1;
    }

    this.getYellowCanvas = () => {
        return yellowCanvas;
    }

    this.gifReaderStrategy = (img, path, gifReaderData, beforeOnloadCallback, afterOnloadCallback, onError, reload429) => {
        let i;
        let self = this;

        if (img) {

            i = img;
            gif.fetch(path, true, function(f) {
                if (beforeOnloadCallback) beforeOnloadCallback(i, f);
                if (afterOnloadCallback) afterOnloadCallback(i, f);
            })

        } else {

            i = self.getEmptyImage();

            gif.fetch(path, gifReaderData.speed,
                (f) => {

                    i.src = f.img;

                    if (beforeOnloadCallback) beforeOnloadCallback(i, f);

                    i.onload = function() {
                        if (!self.checkExist(path, true)) self.add(path, true, i);
                        if (afterOnloadCallback) afterOnloadCallback(i, f);
                    };

                },
                (e) => {
                    if (e.currentTarget.status == 0) {
                        manage429Status(path, gifReaderData, beforeOnloadCallback, afterOnloadCallback, onError);
                        return
                    }

                    //if (onError)    onError(e);
                    //else            console.error('[ImgLoader.js, gifReaderStrategy] FETCH ERROR!', path);

                    manageError(e, path, onError)

                },
                gifReaderData.externalSource,
                gifReaderData.insecureSource,
                reload429
            );

        }
    };

    //const checkImageExist = (url, clb) => {
    //    var r = new XMLHttpRequest();
    //
    //    r.open("GET", url, true);
    //
    //    r.onloadend = function(e) {
    //        if (r.status == 429) {
    //            checkImageExist(url, clb);
    //            return
    //        }
    //        clb(r.status == 200);
    //    };
    //
    //    r.send();
    //};

    const manage429Status = (path, gifReaderData, beforeOnloadCallback, afterOnloadCallback, onError) => {
        let randomTime = Math.floor(Math.random() * 100)
        let self = this;
        warningReport(moduleData.fileName, "manage429Status", `429 status. Try download again after ${randomTime}`, path);
        setTimeout(function() {
            self.onload(path, gifReaderData, beforeOnloadCallback, afterOnloadCallback, onError, true)
        }, randomTime);

    };

    this.imageReaderStrategy = (img, path, beforeOnloadCallback, afterOnloadCallback, onError, reonloadImage) => {
        let i;
        let self = this;

        if (img) {

            i = img;
            if (beforeOnloadCallback) beforeOnloadCallback(i);
            if (afterOnloadCallback) afterOnloadCallback(i);

        } else {

            //i     = new Image();
            //i.src = `${path}?v=${__build.version}`;

            if (reonloadImage) i = reonloadImage;
            else {
                i = self.getEmptyImage()

                if (beforeOnloadCallback) beforeOnloadCallback(i);
            }


            let xhr = new XMLHttpRequest();
            //xhr.open("GET", path + "?limit=true" + '?v=' + __build.version);
            xhr.open("GET", path + '?v=' + __build.version);
            xhr.responseType = "blob";

            xhr.onload = function(e) {
                let urlCreator = window.URL || window.webkitURL;
                let imageUrl = urlCreator.createObjectURL(this.response);

                i.src = imageUrl;

                i.onload = function() {
                    if (!self.checkExist(path, false)) self.add(path, false, i);
                    if (afterOnloadCallback) afterOnloadCallback(i);
                };

                //image.onerror = function (e) {
                //    debugger;
                //    if (onError) onError(e)
                //};


            };


            //i.onload = function () {
            //    if (!self.checkExist(path, false)) self.add(path, false, i);
            //    if (afterOnloadCallback) afterOnloadCallback(i);
            //};

            //i.onerror = function (e) {
            //    debugger;
            //    //checkImageExist(i.src, function (exist) {
            //    //    if (exist) {
            //    //        manage429Status();
            //    //        return
            //    //    }
            //    //
            //    //    if (onError) onError();
            //    //    console.error('[ImgLoader.js, imageReaderStrategy] Not found path', path, e)
            //    //})
            //
            //    if (onError) onError();
            //    console.error('[ImgLoader.js, imageReaderStrategy] Not found path', path, e)
            //}

            xhr.onerror = function(e) {
                if (xhr.status != 0) {

                    //if (onError)    onError(e);
                    //else            console.error('[ImgLoader.js, gifReaderStrategy] FETCH ERROR!', path);

                    manageError(e, path, onError);

                    return;
                }

                manage429Status(path, null, beforeOnloadCallback, afterOnloadCallback, onError);
            };

            xhr.send();

        }
    };

    this.cacheInitGraphic = (url, gifReaderData) => {

        let self = this;

        if (gifReaderData) {

            this.onload(url, gifReaderData,
                () => {
                    self.addToPreLoadSuccessLoadedList(url);
                },
                () => {
                    self.deleteFromPreLoadSuccessLoadedList(url);
                    self.manageUnlockImages();
                }
            );

        } else {

            self.onload(url, false,
                () => {
                    this.addToPreLoadSuccessLoadedList(url);
                },
                () => {
                    this.deleteFromPreLoadSuccessLoadedList(url);
                    this.manageUnlockImages();
                },
                () => {
                    this.deleteFromPreLoadSuccessLoadedList(url);
                    this.manageUnlockImages();
                }
            );

        }
    };


    this.addToPreLoadSuccessLoadedList = (url) => {
        preLoadSuccessLoadedList[url] = true
    };

    this.deleteFromPreLoadSuccessLoadedList = (url) => {
        delete preLoadSuccessLoadedList[url];
    };

    this.checkFinishPreLoad = () => {
        return !Object.keys(preLoadSuccessLoadedList).length;
    };

    this.manageUnlockImages = () => {
        if (!this.checkFinishPreLoad()) return;
        Engine.interface.lock.unlock('images');
        Engine.loader.load('images');
    }

    const manageError = (e, path, onError) => {
        if (onError) onError(e);
        else errorReport(moduleData.fileName, "manageError", 'FETCH ERROR!', path);
    }

}

function init(list) {
    imgLoader = new ImgLoader();
    imgLoader.init(list);
}

function getImgWithFilter(path, filter, gif) {
    return imgLoader.getImgWithFilter(path, filter, gif);
}

function onload(path, gifReaderData, beforeOnloadCallback, afterOnloadCallback, onError) {
    imgLoader.onload(path, gifReaderData, beforeOnloadCallback, afterOnloadCallback, onError);
}

function manageUnlockImages() {
    imgLoader.manageUnlockImages();
}

function preLoadImages() {
    imgLoader.preLoadImages();
}

function getYellowCanvas() {
    return imgLoader.getYellowCanvas();
}

function checkExist(url, gifReader) {
    return imgLoader.checkExist(url, gifReader);
}

function clearFilters() {
    return imgLoader.clearFilters();
}

module.exports = {
    init,
    onload,
    getImgWithFilter,
    manageUnlockImages,
    getYellowCanvas,
    preLoadImages,
    clearFilters,
    checkExist,
};