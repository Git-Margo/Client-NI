let o = {
    getNewVectorsFromDestinyAndPowerOfVectors: (actualPos, destiny, speed) => {

        let xLength = Math.abs(actualPos.x - destiny.x);
        let yLength = Math.abs(actualPos.y - destiny.y);

        if (xLength + yLength == 0) return {
            newXVector: 0,
            newYVector: 0
        };

        let xDir = actualPos.x <= destiny.x ? 1 : -1;
        let yDir = actualPos.y <= destiny.y ? 1 : -1;

        let newXVector = (xLength * speed) / (xLength + yLength);
        let newYVector = (yLength * speed) / (xLength + yLength);

        return {
            newXVector: newXVector * xDir,
            newYVector: newYVector * yDir
        }

    },
    getNewVectorsFromDestinyAndDuration: (actualPos, destinyPos, duration) => {

        let xLength = Math.abs(actualPos.x - destinyPos.x);
        let yLength = Math.abs(actualPos.y - destinyPos.y);

        if (xLength + yLength === 0) return {
            newXVector: 0,
            newYVector: 0
        };


        let xDir = actualPos.x <= destinyPos.x ? 1 : -1;
        let yDir = actualPos.y <= destinyPos.y ? 1 : -1;

        let totalDistance = Math.sqrt(xLength * xLength + yLength * yLength);
        let speed = totalDistance / duration;
        let scale = speed / totalDistance;
        let newXVector = xLength * scale * xDir;
        let newYVector = yLength * scale * yDir;

        return {
            newXVector,
            newYVector
        };
    },
    getNewPositionFromVectors: (_x, _y, _xVector, _yVector, dt, speed) => {
        let tileSize = CFG.tileSize;
        let newX = _x * tileSize + _xVector * dt * (isset(speed) ? speed : 100);
        let newY = _y * tileSize + _yVector * dt * (isset(speed) ? speed : 100);

        return {
            newX: newX / tileSize,
            newY: newY / tileSize
        }
    },
    getNewPositionFromVectorsCorrect: (_x, _y, _xVector, _yVector, dt, speed) => {
        let tileSize = CFG.tileSize;

        let newX = _x * tileSize + _xVector * tileSize * dt * (isset(speed) ? speed : 100); // CORRECT, BUT...
        let newY = _y * tileSize + _yVector * tileSize * dt * (isset(speed) ? speed : 100); // CORRECT, BUT...

        return {
            newX: newX / tileSize,
            newY: newY / tileSize
        }
    },
    checkReachCord: (actualPos, destinyPos, vectors) => {

        let reachX = false;
        let reachY = false;

        if (vectors.xVector == 0) reachX = true;
        else {

            if (vectors.xVector > 0) {
                if (actualPos.x > destinyPos.x) reachX = true
            } else {
                if (actualPos.x < destinyPos.x) reachX = true
            }

        }

        if (vectors.yVector == 0) reachY = true;
        else {
            if (vectors.yVector > 0) {
                if (actualPos.y > destinyPos.y) reachY = true
            } else {
                if (actualPos.y < destinyPos.y) reachY = true
            }
        }


        return reachX && reachY;
    },
    getReachEdge: (newPosition, imageWidth, imageHeight) => {

        let tileSize = CFG.tileSize;
        let reachEdge = false;

        let maxX = (Engine.map.size.x + 2) * tileSize;
        let maxY = (Engine.map.size.y + 2) * tileSize;

        let newX = newPosition.newX * tileSize;
        let newY = newPosition.newY * tileSize;

        if (newX < 0 - imageWidth) reachEdge = true;
        if (newX > maxX) reachEdge = true;

        if (newY < 0 - imageHeight) reachEdge = true;
        if (newY > maxY) reachEdge = true;

        return reachEdge;
    }

}

module.exports = o;