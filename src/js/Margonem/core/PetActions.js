module.exports = function() {

    let timePassed = 0;
    let loopIndex = 0;
    let loopLength = 0;
    let lastActionFrame = null;
    let reachLastActionFrame = false;
    let timeOfActionFrame = null;
    let invertedData = null;

    let incrementActionFrame = true;

    function getHalfByte(intvalue, index) {
        return (intvalue >> (4 * index)) & 0xf;
    }

    function createActionsDataArrayForHero(nameActionArray, posIndex) {
        let actionsData = [];

        for (let i in nameActionArray) {

            let data = nameActionArray[i].split('#');
            let special = (isset(data[1]) ? parseInt(data[1]) : 3);
            let actionIndex = parseInt(i) + 1;


            let o = {
                name: data[0],
                actionIndex: actionIndex,
                actionBin: actionIndex << 4 | (isset(special) && special ? (special << 8) : 0),
                actionBinWithDir: posIndex + (actionIndex << 4 | (isset(special) && special ? (special << 8) : 0)),
                special: special
            };

            actionsData.push(o);


        }

        return actionsData;
    }

    function createActionsDataArrayForOther(actionBin) {
        let actionIndex = getHalfByte(actionBin, 1);
        let special = getHalfByte(actionBin, 2);

        let o = {
            name: null,
            actionIndex: actionIndex,
            actionBin: actionBin,
            actionBinWithDir: actionBin,
            special: special
        }

        return [o];
    }

    function resetStates() {
        timePassed = 0;
        loopIndex = 0;
        loopLength = 0;
        lastActionFrame = null;
        reachLastActionFrame = false;
        timeOfActionFrame = 100;
        invertedData = null;
        incrementActionFrame = true;
    }

    function doAction(pet) {

        let runActionIndex = pet.getRunActionIndex();
        let special = pet.getSpecialByRunActionIndex();

        resetStates();

        if (special == 0) {
            loopLength = 1;
            lastActionFrame = 3;
        }

        if (special >= 1 && special <= 9) loopLength = special;

        if (special >= 13 && special <= 15) {

            switch (special) {
                case 13:
                    timeOfActionFrame = 150;
                    break;
                case 14:
                    timeOfActionFrame = 200;
                    break;
                case 15:
                    timeOfActionFrame = 300;
                    break;
            }
            loopLength = 3;
        }

        if (special >= 10 && special <= 12) {

            invertedData = {
                timeOfWaitToInvert: null,
                waitTime: null
            };
            lastActionFrame = 0;

            switch (special) {
                case 10:
                    invertedData.timeOfWaitToInvert = 0;
                    break;
                case 11:
                    invertedData.timeOfWaitToInvert = 5000;
                    break;
                case 12:
                    invertedData.timeOfWaitToInvert = 20000;
                    break;
            }
            loopLength = 1;
        }

        pet.setActionFrame(0);
        pet.setFrame((4 + (pet.getAnim() ? 1 : 0)) + runActionIndex - 1)


    }

    function updateAction(pet, dt) {

        if (reachLastActionFrame) return;


        if (invertedData && invertedData.waitTime != null) {

            invertedData.waitTime += dt * 1000;

            if (invertedData.waitTime < invertedData.timeOfWaitToInvert) return;

            invertedData = null;
            incrementActionFrame = false;

        }


        timePassed += dt * 1000;

        let actionFrame = pet.getActionFrame();

        if (timePassed < timeOfActionFrame) return;


        timePassed = 0;

        if (incrementActionFrame) {
            actionFrame++;
            if (actionFrame > 3) {
                oneLoopDone(pet);
                return
            }
        }

        if (!incrementActionFrame) {
            actionFrame--;
            if (actionFrame < 0) {
                oneLoopDone(pet);
                return
            }
        }

        pet.setActionFrame(actionFrame);
    }

    function oneLoopDone(pet) {

        loopIndex++;

        if (loopIndex == loopLength) lastLoopDone(pet);
        else pet.setActionFrame(0);

    }

    function lastLoopDone(pet) {
        if (invertedData) {

            invertedData.waitTime = 0;
            loopIndex--;
            return
        }

        if (lastActionFrame == null) pet.stopAction();
        else reachLastActionFrame = true;

    }

    function checkActionsAmount(filePatch) {
        var r = new RegExp('-([0-9]+)(a?)\.gif');
        var fData = r.exec(filePatch);

        return fData ? parseInt(fData[1]) : 0;
    }


    this.createActionsDataArrayForOther = createActionsDataArrayForOther;
    this.createActionsDataArrayForHero = createActionsDataArrayForHero;
    this.doAction = doAction;
    this.updateAction = updateAction;
    this.getHalfByte = getHalfByte;
    this.checkActionsAmount = checkActionsAmount;

};