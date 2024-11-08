/**
 * Created by lukasz on 11.09.14.
 */
let HotKeysData = require('core/hotKeys/HotKeysData');
let HeroDirectionData = require('core/characters/HeroDirectionData');
/*
let normal = {
	"W": 'N',
	"ARROWUP": 'N',
	"S": 'S',
	"ARROWDOWN": 'S',
	"A": 'W',
	"ARROWLEFT": 'W',
	"D": 'E',
	"ARROWRIGHT": 'E'
};

let invert = {
	"W": 'S',
	"ARROWUP": 'S',

	"S": 'N',
	"ARROWDOWN": 'N',

	"A": 'E',
	"ARROWLEFT": 'E',

	"D": 'W',
	"ARROWRIGHT": 'W'
};
*/

let normal = {
    "W": HeroDirectionData.N,
    "ARROWUP": HeroDirectionData.N,
    "S": HeroDirectionData.S,
    "ARROWDOWN": HeroDirectionData.S,
    "A": HeroDirectionData.W,
    "ARROWLEFT": HeroDirectionData.W,
    "D": HeroDirectionData.E,
    "ARROWRIGHT": HeroDirectionData.E
};

let invert = {
    "W": HeroDirectionData.S,
    "ARROWUP": HeroDirectionData.S,

    "S": HeroDirectionData.N,
    "ARROWDOWN": HeroDirectionData.N,

    "A": HeroDirectionData.E,
    "ARROWLEFT": HeroDirectionData.E,

    "D": HeroDirectionData.W,
    "ARROWRIGHT": HeroDirectionData.W
};


let
    moveBindings = {},
    lastActivityK = null,
    lastActivityX = null,
    lastActivityY = null,
    ctrlKey = null,
    altKey = null,
    holdKeys = [], //key name like "p", "1" - key code from keypress and keyup events are different
    moveDir = null;
const
    ignoreInputFromTags = ['INPUT', 'TEXTAREA', "MAGIC_INPUT"];

function checkHoldKey(key) {
    return holdKeys.includes(key)
}

function removeHoldKey(key) {
    const index = holdKeys.indexOf(key);
    if (index > -1) {
        holdKeys.splice(index, 1);
    }
}

var input = new(function() {
    this.getMoveDirection = function() {
        return moveDir;
    };

    this.updateKeys = () => {
        /*
		normal = {
			"ARROWUP": 'N',
			"ARROWDOWN": 'S',
			"ARROWLEFT": 'W',
			"ARROWRIGHT": 'E'
		}

		invert = {
			"ARROWUP": 'S',
			"ARROWDOWN": 'N',
			"ARROWLEFT": 'E',
			"ARROWRIGHT": 'W'
		}
*/

        normal = {
            "ARROWUP": HeroDirectionData.N,
            "ARROWDOWN": HeroDirectionData.S,
            "ARROWLEFT": HeroDirectionData.W,
            "ARROWRIGHT": HeroDirectionData.E
        }

        invert = {
            "ARROWUP": HeroDirectionData.S,
            "ARROWDOWN": HeroDirectionData.N,
            "ARROWLEFT": HeroDirectionData.E,
            "ARROWRIGHT": HeroDirectionData.W
        }

        let up = Engine.hotKeys.getKeyByClbName(HotKeysData.name.move_up);
        let down = Engine.hotKeys.getKeyByClbName(HotKeysData.name.move_down);
        let left = Engine.hotKeys.getKeyByClbName(HotKeysData.name.move_left);
        let right = Engine.hotKeys.getKeyByClbName(HotKeysData.name.move_right);

        if (up != null) {
            //normal[up] = "N";
            //invert[up] = "S";

            normal[up] = HeroDirectionData.N;
            invert[up] = HeroDirectionData.S;
        }

        if (down != null) {
            //normal[down] = "S";
            //invert[down] = "N";

            normal[down] = HeroDirectionData.S;
            invert[down] = HeroDirectionData.N;
        }

        if (left != null) {
            //normal[left] = "W";
            //invert[left] = "E";

            normal[left] = HeroDirectionData.W;
            invert[left] = HeroDirectionData.E;
        }

        if (right != null) {
            //normal[right] = "E";
            //invert[right] = "W";

            normal[right] = HeroDirectionData.E;
            invert[right] = HeroDirectionData.W;
        }

        this.setKeyboardSystem();
    }

    this.setMoveDirection = function(dir) {
        input.setMoveDir(dir)
        if (Engine.dialogue) Engine.dialogue.checkIsBubbleCloud(); //for prevent block by bubble dialogs (pad controller)
    };

    this.setMoveDir = (_moveDir) => {
        moveDir = _moveDir;
    }

    this.getLastActivityK = function() {
        return lastActivityK;
    };

    this.getLastActivityX = function() {
        return lastActivityX;
    };

    this.getLastActivityY = function() {
        return lastActivityY;
    };
    this.getAltAndCtrl = function() {
        return altKey && ctrlKey;
    };
    this.setKeyboardSystem = function() {
        if (invertKeyInputOnSpecificMap()) moveBindings = invert;
        else moveBindings = normal;
    }
})();


function checkBlockInputEvent() {
    return !Engine.allInit || !Engine.settings || Engine.settings.getBlockInput();
}


function keyDown(e) {
    let key = correctKey(e.key);
    if (checkBlockInputEvent()) return;

    ctrlKey = e.ctrlKey;
    altKey = e.altKey;
    Engine.hero.blockMove = false;

    if (ignoreInputFromTags.indexOf(e.target.tagName) < 0) {
        if (isset(moveBindings[key + ''])) {
            if (Engine.battle.getShow()) {
                switch (key) {
                    case "W":
                        Engine.battle.getPosMarkObject(false, 1);
                        break;
                    case "ARROWUP":
                        Engine.battle.getPosMarkObject(false, 1);
                        break;
                    case "S":
                        Engine.battle.getPosMarkObject(false, -1);
                        break;
                    case "ARROWDOWN":
                        Engine.battle.getPosMarkObject(false, -1);
                        break;
                    case "A":
                        Engine.battle.getPosMarkObject(-1, false);
                        break;
                    case "ARROWLEFT":
                        Engine.battle.getPosMarkObject(-1, false);
                        break;
                    case "D":
                        Engine.battle.getPosMarkObject(1, false);
                        break;
                    case "ARROWRIGHT":
                        Engine.battle.getPosMarkObject(1, false);
                        break;
                }
                return;
            }
            //moveDir = moveBindings[e.keyCode + ''];
            //input.setMoveDir(moveBindings[e.keyCode + ''])
            input.setMoveDir(moveBindings[key + ''])
            Engine.hero.blockMove = true;
            setTimeout(function() {
                Engine.hero.blockMove = false;
            }, 50);
            //if (Engine.playerCatcher) Engine.playerCatcher.stopFollow();
            if (Engine.dialogue) Engine.dialogue.checkIsBubbleCloud(); //for prevent block by bubble dialogs (WSAD)
        }
    }

    if (key == "TAB") {
        if (ignoreInputFromTags.indexOf(e.target.tagName) < 0) {
            e.preventDefault();
        }
        //e.preventDefault();
    }

    let available = Engine ? Engine.hotKeys.getAvailableTagKeys() : [];

    if (available.includes(key)) {
        keyPressProcedure(e);
        return true
    }

    if (key == "ESCAPE") {
        if (Engine.hotKeys.checkCanCancelAlert()) return e.preventDefault();
        if (Engine.hotKeys.checkCanRefuseLoot()) return e.preventDefault();
        if (Engine.hotKeys.checkCanCloseConsole()) return e.preventDefault();
        if (Engine.hotKeys.checkCanCloseWindow()) return e.preventDefault();
        if (Engine.hotKeys.checkCanCloseMiniMap()) return e.preventDefault();
        if (Engine.hotKeys.checkCanCloseDialog()) return e.preventDefault();
        if (Engine.hotKeys.checkCanCloseTrade()) return e.preventDefault();
        if (Engine.hotKeys.checkCanBlurInput()) return e.preventDefault();
    }

    if (key == "ENTER") {
        if (Engine.hotKeys.checkCanAcceptAlert() || Engine.hotKeys.checkCanAcceptWindow()) return e.preventDefault();
    }
}

function keyUp(e) {
    // let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
    let key = correctKey(e.key);
    if (checkHoldKey(key)) removeHoldKey(key);

    if (!getAlreadyInitialised() && Engine.hotKeys.checkKeyIsConsole(key)) {} else {
        if (checkBlockInputEvent()) return;
    }

    ctrlKey = null;
    altKey = null;
    lastActivityK = e.keyCode;

    if (isset(moveBindings[key + '']) && moveBindings[key + ''] == moveDir) {
        Engine.hero.blockMove = true;
        input.setMoveDir(null)
    }
}

function keyPressProcedure(e) {
    let key = correctKey(e.key);

    if (!checkHoldKey(key)) holdKeys.push(key);
    else return;

    if (!getAlreadyInitialised() && Engine.hotKeys.checkKeyIsConsole(key)) {} else {
        if (checkBlockInputEvent()) return;
    }

    if (ignoreInputFromTags.indexOf(e.target.tagName) >= 0) {

        if (e.target.id == 'console_input' && key == '`') Engine.console.toggle();

    } else {
        //if (key > 96 && key < 123) key -= 32; // make chars uppercase
        switch (key) {
            case "ENTER": //Enter
                //Engine.interface.focusChat();
                console.log('input parser')
                e.preventDefault();
                Engine.chatController.getChatWindow().manageChatWindowAfterEnter();
                //Engine.chatController.getChatWindow().openIfClose();
                break;
        }
        if (!e.ctrlKey) Engine.hotKeys.checkKey(key);

        // if (key > 48 && key < 58) {

        if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(key)) {
            var d = Engine.dialogue;
            if (d) {
                var useKey = false;
                if (!d.getBubble()) useKey = true;
                //else if (key == 49) useKey = true;
                else if (key == 1) useKey = true;
                if (useKey) return Engine.dialogue.hotKeyLine(key)
            }
            if (Engine && Engine.buildsManager && Engine.matchmaking) {
                if (Engine.buildsManager.getBuildsWindow().getWindowShow() || Engine.matchmaking.getEqChooseOpen()) {
                    getEngine().buildsManager.manageBuildsHotkeys(parseInt(key));
                    return;
                }
            }
            // if (key == 57) return;
            if (key == 9) return;
            var b = Engine.battle;
            if (!b.endBattle) b.doSkillAction(key);
            if (!b.show) Engine.interfaceItems.doInterfaceItemAcion(key);
        }
    }
}


$(function() {

    $(document).on('keydown', function(e) {

        keyDown(e);

    }).on('keyup', function(e) {

        keyUp(e);

    }).on('keypress', function(e) {

        /*

        // keyDownCopy(e);

        //let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        let key = correctKey(e.key);
        //console.log('keypress', e, key);


        if (!checkHoldKey(key)) holdKeys.push(key);
        else                      return;

        if (!Engine.alreadyInitialised && Engine.hotKeys.checkKeyIsConsole(key)) {}
        else {
        	if (checkBlockInputEvent()) return;
        }

        if (ignoreInputFromTags.indexOf(e.target.tagName) >= 0) {

        	if (e.target.id == 'console_input' && key == '`') Engine.console.toggle();

        } else {
        	//if (key > 96 && key < 123) key -= 32; // make chars uppercase
        	switch (key) {
        		case "ENTER": //Enter
        			//Engine.interface.focusChat();
        			console.log('input parser')
        			e.preventDefault();
        			Engine.chatController.getChatWindow().manageChatWindowAfterEnter();
        			//Engine.chatController.getChatWindow().openIfClose();
        			break;
        	}
        	if (!e.ctrlKey) Engine.hotKeys.checkKey(key);

        	// if (key > 48 && key < 58) {

        	if (["1","2","3","4","5","6","7","8","9"].includes(key)) {
        		var d = Engine.dialogue;
        		if (d) {
        			var useKey = false;
        			if (!d.getBubble()) useKey = true;
        			//else if (key == 49) useKey = true;
        			else if (key == 1) useKey = true;
        			if (useKey) return Engine.dialogue.hotKeyLine(key)
        		}
        		// if (key == 57) return;
        		if (key == 9) return;
        		var b = Engine.battle;
        		if (!b.endBattle) b.doSkillAction(key);
        		if (!b.show) Engine.interfaceItems.doInterfaceItemAcion(key);
        	}
        }

        */

        keyPressProcedure(e);

    }).click(function(e) {
        lastActivityX = e.clientX;
        lastActivityY = e.clientY;
        //Engine.mPos.event(e);
    }).on('mouseup', function() {
        Engine.map.onmouseup();
    });

    $(window).on('blur', function() {
        Engine.map.onmouseup();
    });
});
module.exports = input;