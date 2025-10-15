module.exports = function() {

    const WALKING_BLOCKADE = "WALKING_BLOCKADE";
    const BLOCKADE_TIME = 700;

    let blockadeTimer = null;
    let blockade = false;

    const init = () => {
        resetBlockade();
    }

    const updateData = (v) => {
        if (v.isDisabled) {
            startBlockade();
        } else {
            resetBlockade();
        }
    }

    const setBlockade = (_blockade) => {
        blockade = _blockade;
    }

    const startBlockade = () => {
        console.log('startBlockade')
        setBlockade(true)
        createBlockadeTimer();

        Engine.lock.add(WALKING_BLOCKADE);
    }

    const createBlockadeTimer = () => {
        if (blockadeTimer) {
            removeBlockadeTimer();
        }

        blockadeTimer = setInterval(() => {
            resetBlockade();
        }, BLOCKADE_TIME);
    }

    const removeBlockadeTimer = () => {
        if (!blockadeTimer) {
            return
        }

        clearTimeout(blockadeTimer);
        blockadeTimer = null;
    }

    const resetBlockade = () => {
        setBlockade(false);
        removeBlockadeTimer();
        Engine.lock.remove(WALKING_BLOCKADE);
    }

    const checkBlockade = () => {
        return blockade ? true : false
    }

    const onClear = () => {
        resetBlockade();
    }

    this.init = init;
    this.checkBlockade = checkBlockade;
    this.updateData = updateData;
    this.resetBlockade = resetBlockade;
    this.onClear = onClear;
}