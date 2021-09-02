var Ticker = function () {
    var dos = []
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function start() {
        let ms = 100;
        while (true) {
            dos.forEach(element => {
                element(ms);
            });
            await sleep(ms);
        }

    };

    return {
        onTick: function (callback) { dos.push(callback) },
        removeFromTick: function (callback) { dos.filter(function (item) { return item === callback; }) },
        start: start
    }
}();
