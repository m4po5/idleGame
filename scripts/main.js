$(document).ready(function () {
    var Ticker = function () {
        var dos = []
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function start() {
            while (true) {
                dos.forEach(element => {
                    element();
                });
                await sleep(100);
            }

        };

        return {
            onTick: function (callback) { dos.push(callback) },
            removeFromTick: function (callback) { dos.filter(function (item) { return item === callback; }) },
            start: start
        }
    }();

    var ResourceMonitor = function (Ticker) {
        var minerals = 0, biomatter = 0, deepWater = 0, power = 0;
        var mRate = 1 / 10, bRate = 3 / 10, dwRate = 5 / 100, pRate = 0;

        Ticker.onTick(function () {
            minerals += mRate;
            biomatter += bRate;
            deepWater += dwRate;
            power += pRate + (parseInt($("#powerPlants").text(),10) * 3 / 100);

            updateView();
        });

        function updateView() {
            $("#minerals").text(Math.floor(minerals));
            $("#biomatter").text(Math.floor(biomatter));
            $("#deepWater").text(Math.floor(deepWater));
            $("#power").text(Math.floor(power));
        }

        function enoughMinerals(req) {
            return minerals >= req;
        }

        function enoughBiomatter(req) {
            return biomatter >= req;
        }

        function enoughDeepWater(req) {
            return deepWater >= req;
        }

        function enoughPower(req) {
            return power >= req;
        }

        function withdrawResources(sums){
            minerals -= sums[0];
            biomatter -= sums[1];
            deepWater -= sums[2];
            power -= sums[3];
        }

        var methods = {
            enoughMinerals: enoughMinerals,
            enoughBiomatter: enoughBiomatter,
            enoughDeepWater: enoughDeepWater,
            enoughPower: enoughPower,
            withdrawResources: withdrawResources
        }

        return methods;
    }(Ticker);

    var StructureManager = function (Ticker) {
        var powerPlants = 0;
        var baseReqs = {
            powerPlant: [50, 120, 0, 0, 3/100]
        }

        function getReqPowerPlant() {
            var f = powerPlants * 1.5;
            var m = baseReqs.powerPlant[0], b = baseReqs.powerPlant[1], dw = baseReqs.powerPlant[2], p = baseReqs.powerPlant[3];
            var reqs = [
                calcReq(m, f),
                calcReq(b, f),
                calcReq(dw, f),
                calcReq(p, f)
            ]

            return reqs;
        }

        function calcReq(base, factor) {
            return base + base * factor;
        }

        function buildPowerPlant(){
            powerPlants ++;
            $("#powerPlants").text(powerPlants);
        }

        var methods = {
            getReqPowerPlant: getReqPowerPlant,
            buildPowerPlant: buildPowerPlant
        }

        return methods;
    }(Ticker);

    var StructureBuilder = function (rm, sm) {
        function isAvailablePowerPlant() {
            let reqs = sm.getReqPowerPlant();
            return rm.enoughMinerals(reqs[0]) && rm.enoughBiomatter(reqs[1]) && rm.enoughDeepWater(reqs[2]) && rm.enoughPower(reqs[3]);
        }

        var methods = {
            isAvailablePowerPlant: isAvailablePowerPlant
        }

        return methods;

    }(ResourceMonitor, StructureManager);


    var prog = 0;
    /* Ticker.onTick(function(){
        let btn = $("#buildPowerPlant");
        let progress = btn.find(".progress");
        let left = parseInt(progress.css("left"));
        prog += 0.01;
        setProgressBar(progress, 0.6666);
        if(prog >= 1){
            prog = 0;
            setProgressBar(progress, prog);
        } else{
            setProgressBar(progress, prog);
        }
        $(btn).find(".percentage").text(Math.floor(prog*100) + "%")
    }); */

    function setProgressBar(bar, percentage){
        let max = parseInt(bar.css("width"));
        let delta = 1 - percentage;
        let offset = max * delta;
        bar.css("left", -offset+"px");
    }

    var powerPlantBtn = $("#buildPowerPlant");
    var powerPlantProgress = 0;
    var isInProgress = false;

    Ticker.onTick(function () {
        if(isInProgress){
            let progress = powerPlantBtn.find(".progress");
            let percentage = $(powerPlantBtn).find(".percentage");
            powerPlantProgress += 0.01 / (parseInt($("#powerPlants").text())+1);
            percentage.text(Math.floor(powerPlantProgress*100) + "%")
            if(powerPlantProgress >= 1){
                StructureManager.buildPowerPlant();
                powerPlantBtn.removeClass("inProgress");
                powerPlantBtn.addClass("disabled");
                isInProgress = false;
                powerPlantProgress = 0;
                percentage.text("");
            }
            setProgressBar(progress, powerPlantProgress);
        } else if (StructureBuilder.isAvailablePowerPlant()) {
            powerPlantBtn.removeClass("disabled");
            powerPlantBtn.addClass("enabled");
        }
    });

    $("#buildPowerPlant").click(function(){
        if(StructureBuilder.isAvailablePowerPlant()){
            powerPlantBtn.removeClass("enabled");
            powerPlantBtn.addClass("inProgress");
            ResourceMonitor.withdrawResources(StructureManager.getReqPowerPlant());
            isInProgress = true;
        }
    })
    
    var showReqs = function(reqs){
        $("#mReq").text("-"+reqs[0]);
        $("#bReq").text("-"+reqs[1]);
        $("#dwReq").text("-"+reqs[2]);
        $("#pReq").text("-"+reqs[3]);
    };

    var clearReqs = function(){
        $("#mReq").text("");
        $("#bReq").text("");
        $("#dwReq").text("");
        $("#pReq").text("");
    };

    powerPlantBtn.hover(function(){
        showReqs(StructureManager.getReqPowerPlant());
    }, function(){
        clearReqs();
    });

    Ticker.start();

})