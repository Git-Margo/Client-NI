let CanvasObjectTypeData = require('core/CanvasObjectTypeData');

function addDebugOptionMenu(canvasObject, menu) {
    if (!CFG.debug) return;


    let _id = canvasObject.getId();
    let _nick = canvasObject.getNick();
    let iconUrl = canvasObject.getImg();
    let canvasObjectType = canvasObject.canvasObjectType;
    let relativeUrl = CFG.r_npath + iconUrl;

    switch (canvasObjectType) {
        case CanvasObjectTypeData.HERO:
        case CanvasObjectTypeData.OTHER:
            relativeUrl = CFG.r_opath + fixSrc(iconUrl);
            break;
        case CanvasObjectTypeData.NPC:
            relativeUrl = CFG.r_npath + iconUrl;
            break;
        case CanvasObjectTypeData.PET:
            relativeUrl = CFG.r_ppath + iconUrl;
            break;
    }

    //let relativeUrl = CFG.r_npath + iconUrl;
    let absoluteUrl = cdnUrl + relativeUrl;

    let debugColor = {
        button: {
            cls: 'menu-item--debug'
        }
    }

    menu.push(['Info', function() {
        let info = `
			 ${_id}<br>
			 ${_nick}<br>
			 ${iconUrl}<br>
			 ${relativeUrl}<br>
			 <a target="_blank" href="${absoluteUrl}">${absoluteUrl}</a>
			`;

        mAlert(info);
    }, debugColor]);



    menu.push(['Copy id', function() {
        copyClipboard(_id);
    }, debugColor]);
    menu.push(['Copy nick', function() {
        copyClipboard(_nick);
    }, debugColor]);
    menu.push(['Copy short url', function() {
        copyClipboard(iconUrl);
    }, debugColor]);
    menu.push(['Copy relative url', function() {
        copyClipboard(relativeUrl);
    }, debugColor]);
    menu.push(['Copy absolute url', function() {
        copyClipboard(absoluteUrl);
    }, debugColor]);

    if (canvasObjectType == CanvasObjectTypeData.NPC) {
        menu.push(['Copy tpl', function() {
            copyClipboard(canvasObject.getTpl())
        }, debugColor]);
        menu.push(['get_external_properties', function() {
            console.log(canvasObject.getExternalProperties())
        }, debugColor]);
        menu.push(['getData', function() {
            console.log(canvasObject.getData())
        }, debugColor])
    }
}

module.exports = {
    addDebugOptionMenu
}