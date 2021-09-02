$(document).ready(function () {
    var resourceMonitor = ResourceMonitor(Ticker, $("#resources"));

    var StructureManager = function (ResourceMonitor) {
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
            ResourceMonitor.power.addIncome({source: "Power Plant "+powerPlants, value: 5});
            $("#powerPlants").text(powerPlants);
        }

        var methods = {
            getReqPowerPlant: getReqPowerPlant,
            buildPowerPlant: buildPowerPlant
        }

        return methods;
    }(resourceMonitor);

    var StructureBuilder = function (rm, sm) {
        function isAvailablePowerPlant() {
            let reqs = sm.getReqPowerPlant();
            return rm.minerals.enough(reqs[0]) && rm.biomatter.enough(reqs[1]) && rm.deepWater.enough(reqs[2]) && rm.power.enough(reqs[3]);
        }

        var methods = {
            isAvailablePowerPlant: isAvailablePowerPlant
        }

        return methods;

    }(resourceMonitor, StructureManager);


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
            resourceMonitor.withdrawResources(StructureManager.getReqPowerPlant());
            isInProgress = true;
        }
    })
    
    var showReqs = function(reqs){
        resourceMonitor.showReqs(reqs);
    };

    var clearReqs = function(){
        resourceMonitor.hideReqs();
    };

    powerPlantBtn.hover(function(){
        showReqs(StructureManager.getReqPowerPlant());
    }, function(){
        clearReqs();
    });

    // working with new code

    // set up pieces
    var areas = [[new pieces.Resource(pieces.Resource.types.METAL, 5000, "Scrap"), new pieces.Resource(pieces.Resource.types.BIO, 10000, "Raw Biomass")], []];
    var internal = {biomatter: new pieces.robotics.Storage(pieces.Resource.types.BIO, 0,100, "Biomatter Storage")}

    var foundry = new pieces.robotics.Foundry();
    foundry.setBioSource(areas[0][1]);
    foundry.setBioTarget(internal.biomatter);

    // hook into onTick()
    Ticker.onTick(function(ms){foundry.update(ms);});
    Ticker.start();

    window.main = function(){
        window.requestAnimationFrame(main);
        var txt="";
        txt += "new bio storage: "+ Math.floor(internal.biomatter.level);
        for(var i=0, msgs=foundry.getMonitor().messages, max=msgs.length;i<max;i++){
            txt += "<br>"+msgs[i].toString();
        }
        $("#testMonitor").html(txt);
        $("#testMonitor").nextAll("button:first").text("increase storage capacity to " + (internal.biomatter.capacity+100));
    }
    main();
    $("#testMonitor").after($("<button></button>").click(function(){internal.biomatter.increaseCapacity(100);}));
})