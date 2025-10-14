var EmotionsData = require('@core/emotions/EmotionsData');


function Action() {};
Action.prototype.init = function() {};
Action.prototype.exit = function() {};
Action.prototype.setXYOffset = function() {
    if (!this.parameters.offset) {
        this.offsetX = 0;
        this.offsetY = 0;
    } else {
        this.offsetX = this.parameters.offset[0];
        this.offsetY = this.parameters.offset[1];
    }
};

Action.prototype.initObjectPosXY = function() {
    this.rx = this.endPos[0];
    this.ry = this.endPos[1];
};
Action.prototype.doAction = function() {};

Action.prototype.drawInStartPos = function() {
    if (this.stopBeforeMove < 3) {
        this.stopBeforeMove++;
        this.rx = this.source.rx;
        this.ry = this.source.ry;
        return true;
    }
    return false;
};

Action.prototype.actionWithTwoId = function() {
    this.startPos = [this.source.rx, this.source.ry];
    this.currentPos = this.startPos;
    if (this.parameters.modify) {
        var m = this.parameters.modify;
        this.endPos = [this.target.rx + m[0], this.target.ry + m[1]];
    } else {
        this.endPos = [this.target.rx, this.target.ry];
    }
};

Action.prototype.actionWithOneId = function() {
    this.endPos = [this.source.rx, this.source.ry];
};


function ActionBetweenPlayers() {
    this.setStartAndEndPos = function() {
        this.actionWithTwoId();
        this.initObjectPosXY();
        this.inTarget = true;
    };

    this.doAction = function() {
        this.inTarget = true;
        if (this.startPos[0] > this.endPos[0])
            this.offsetX = 16;
        if (this.startPos[0] < this.endPos[0])
            this.offsetX = -16;
        switch (this.startPos[1] - this.endPos[1]) {
            case -1:
                this.offsetY = -65;
                break;
            case 0:
                this.offsetY = -50;
                break;
            case 1:
                this.offsetY = -35;
                break;
        }
    };
}

ActionBetweenPlayers.prototype = Object.create(Action.prototype);


function ActionCharToChar() {
    this.setStartAndEndPos = function() {
        this.actionWithTwoId();
        this.setAAndBDetermine();
    };

    this.lengthWay = function() {
        var x = Math.pow(this.endPos[0] - this.currentPos[0], 2);
        var y = Math.pow(this.endPos[1] - this.currentPos[1], 2);
        return Math.sqrt(x + y);
    };

    this.reachEndPosition = function() {
        if (this.endPos[0] == roundNumber(this.rx, 1) &&
            this.endPos[1] == roundNumber(this.ry, 1)) {
            this.initObjectPosXY();
            this.framesBeforeInTarget = false;
            this.inTarget = true;
            return true;
        }
        return false;
    };

    this.goToTarget = function(dt) {
        var sPos = this.currentPos;
        var ePos = this.endPos;
        var newSpeed = this.lengthWay() > 0.3 ? 5 * dt : dt;
        var xDiff = Math.abs(ePos[0] - sPos[0]);
        var yDiff = Math.abs(ePos[1] - sPos[1]);
        var newPos;

        if (xDiff >= yDiff) {
            if (this.aAndB[0] == 0) {
                if (sPos[0] > ePos[0]) this.rx = this.rx - newSpeed;
                if (sPos[0] < ePos[0]) this.rx = this.rx + newSpeed;
            } else {
                newPos = sPos[0] + (sPos[0] > ePos[0] ? -newSpeed : newSpeed);
                this.rx = newPos;
                this.ry = this.aAndB[0] * this.rx + this.aAndB[1];
            }
        }

        if (xDiff < yDiff) {
            if (this.aAndB[0] == 0) {
                if (sPos[1] > ePos[1]) this.ry = this.ry - newSpeed;
                if (sPos[1] < ePos[1]) this.ry = this.ry + newSpeed;
            } else {
                newPos = sPos[1] + (sPos[1] > ePos[1] ? -newSpeed : newSpeed);
                this.ry = newPos;
                this.rx = (this.ry - this.aAndB[1]) / this.aAndB[0];
            }
        }
        this.currentPos = [this.rx, this.ry];
    };

    this.setAAndBDetermine = function() {
        if (this.source && this.target) {
            var sPos = this.currentPos;
            var ePos = this.endPos;
            var xDif = sPos[0] - ePos[0];
            var yDif = sPos[1] - ePos[1];
            var a = xDif == 0 ? 0 : yDif / xDif;
            var b = sPos[1] - a * sPos[0];
            this.aAndB = [a, b];
        }
    };

    this.doAction = function(dt) {
        if (this.drawInStartPos())
            return;
        if (!this.reachEndPosition())
            this.goToTarget(dt);
    };
}

ActionCharToChar.prototype = Object.create(Action.prototype);


function ActionFire() {
    this.setStartAndEndPos = function() {
        this.actionWithOneId();
        this.initObjectPosXY();
    };

    this.setXYOffset = function() {
        this.offsetX = this.parameters.offset[0];
        this.offsetY = -18;
    };

    this.doAction = function(dt) {
        if (this.drawInStartPos())
            return;
        if (!this.framesBeforeInTarget)
            this.inTarget = true;
        if (this.parameters.offset[1] > this.offsetY) {
            this.framesBeforeInTarget = false;
            this.inTarget = true;
            return;
        }
        this.offsetY -= (this.parameters.preLoop ? 2 : 10);
    };
}

ActionFire.prototype = Object.create(Action.prototype);


function ActionOnSelf() {
    this.setStartAndEndPos = function() {
        this.actionWithOneId();
        this.inTarget = true;
    };

    // this.setXYOffset = function () {
    // 	if (!this.parameters.offset) {
    // 		this.offsetX = 0;
    // 		this.offsetY = -50;
    // 	} else {
    // 		this.offsetX = this.parameters.offset[0];
    // 		this.offsetY = this.parameters.offset[1];
    // 	}
    // };


    this.setXYOffset = function() {
        if (!this.parameters.position) this.offsetY = -this.source.fh - 2;
        else {
            switch (this.parameters.position) {
                case 'bottom':
                    this.offsetY = 0;
                    break;
            }
        }

        this.offsetX = 0 + isset(this.source.leftPosMod) ? this.source.leftPosMod : 0;

        if (this.parameters.offset) {
            this.offsetX += this.parameters.offset[0];
            this.offsetY += this.parameters.offset[1];
        }
    };

    this.doAction = function(dt) {
        const source = this.source;
        const index = source.getEmotionIndex(this);

        this.rx = source.rx;
        this.ry = source.ry;

        if (this.sourceType == EmotionsData.OBJECT_TYPE.NPC && Engine.npcs.isTalkNpc(source.d.id)) {
            return;
        }

        if (index != -1) {
            this.leftModif = this.fw * index - source.onSelfMarginEmo;
        }
    };

    this.init = function() {
        const source = this.source;

        source.addToOnSelfEmoList(this);

        const length = source.getEmoLength();
        //this.source.onSelfEmoList.push(this);
        source.onSelfMarginEmo = this.calcMargin(length);
    };

    this.exit = function() {
        //const onSelfEmoList = this.source.getOnSelfEmoList();
        //
        //var idx = onSelfEmoList.indexOf(this);
        const source = this.source;
        const index = source.getEmotionIndex(this);

        if (index != -1) {
            source.removeOnSelfEmoList(index);
        }

        const length = source.getEmoLength();
        source.onSelfMarginEmo = this.calcMargin(length);
    };

    this.calcMargin = function(length) {
        //var size = -8;
        //for (var t in list) {
        //	size += 8;
        //}
        //return size;

        return -8 + length * 8;
    }
}

ActionOnSelf.prototype = Object.create(Action.prototype);


function ActionOnNpc() {
    this.setStartAndEndPos = function() {
        this.actionWithOneId();
        this.inTarget = true;
    };

    this.setXYOffset = function() {
        if (!this.parameters.position) this.offsetY = -this.source.fh - 7;
        else {
            switch (this.parameters.position) {
                case 'bottom':
                    this.offsetY = 0;
                    break;
            }
        }

        this.offsetX = 0 + isset(this.source.leftPosMod) ? this.source.leftPosMod : 0;

        if (this.parameters.offset) {
            this.offsetX += this.parameters.offset[0];
            this.offsetY += this.parameters.offset[1];
        }
    };

    this.doAction = function(dt) {
        this.rx = this.source.rx;
        this.ry = this.source.ry;
    };
}

ActionOnNpc.prototype = Object.create(Action.prototype);


function ActionStickToAnotherPlayer() {
    this.setStartAndEndPos = function() {
        this.actionWithTwoId();
        this.inTarget = true;
    };

    this.doAction = function() {
        this.rx = this.target.rx;
        this.ry = this.target.ry;
    };
}

ActionStickToAnotherPlayer.prototype = Object.create(Action.prototype);


function ActionStickToMap() {
    this.setStartAndEndPos = function() {
        this.actionWithOneId();
        this.initObjectPosXY();
        this.inTarget = true;
    };
}

ActionStickToMap.prototype = Object.create(Action.prototype);

function ActionLantern() {
    this.setStartAndEndPos = function() {
        this.actionWithOneId();
        this.initObjectPosXY();
        this.inTarget = true;
    };

    this.doAction = function(dt) {
        this.offsetX = this.offsetX + dt * 20;
        this.offsetY = this.offsetY - dt * 30;
    };
}

ActionLantern.prototype = Object.create(Action.prototype);


module.exports = {
    getActionBetweenPlayers: ActionBetweenPlayers,
    getActionCharToChar: ActionCharToChar,
    getActionFire: ActionFire,
    getActionOnSelf: ActionOnSelf,
    getActionOnNpc: ActionOnNpc,
    getActionStickToAnotherPlayer: ActionStickToAnotherPlayer,
    getActionStickToMap: ActionStickToMap,
    getActionLantern: ActionLantern
};