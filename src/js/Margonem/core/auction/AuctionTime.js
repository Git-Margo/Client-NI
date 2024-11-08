module.exports = function() {

    let interval = null;

    const init = () => {
        initInterval();
    }

    const initInterval = () => {
        interval = setInterval(() => {
            updateTimeOfAuction()
        }, 1000)
    }

    //const clearInterval = () => {
    //    clearInterval(interval)
    //    interval = null;
    //}

    const updateTimeOfAuction = () => {
        Engine.auctions.updateTimeOfAuction();
    }

    const destroy = () => {
        clearInterval(interval)
        interval = null;
    }

    this.init = init;
    this.destroy = destroy;

}