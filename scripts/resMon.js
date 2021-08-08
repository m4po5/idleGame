var ResourceMonitor = function(Ticker, view) {
    function Resource(value) {
        this.value = value;
        this.incomes = [];
        this.demands =  [];

        this.getBalance = function(){
            let balance = value;
            this.incomes.forEach(element => {
                balance += element.value;
            });
            this.demands.forEach(element => {
                balance -= element.value;
            })
            return balance;
        }

        this.addIncome = function(income){
            this.incomes.push(income);
        }

        this.addDemands = function(demand){
            this.demands.push(demand);
        }

        this.executePayments = function(){
            this.value += this.getBalance();
        }

        this.enough = function(value){
            return this.value >= value;
        }
    }

    var minerals = new Resource(0), biomatter = new Resource(0), deepWater = new Resource(0), power = new Resource(0);
    minerals.addIncome({source: "Base", value: 1/10});
    biomatter.addIncome({source: "Base", value: 3/10});
    deepWater.addIncome({source: "Base", value: 5/100});

    Ticker.onTick(function () {
        minerals.executePayments();
        biomatter.executePayments();
        deepWater.executePayments();

        updateView();
    });

    var mineralsView = view.find("#minerals");
    var biomatterView = view.find("#biomatter");
    var deepWaterView = view.find("#deepWater");
    var powerView = view.find("#power");
    var tooltip = view.find(".tooltiptext");
    var tipMinerals = tooltip.find("#tipMinerals");
    var tipBiomatter = tooltip.find("#tipBiomatter");
    var tipDeepWater = tooltip.find("#tipDeepWater");
    var tipPower = tooltip.find("#tipPower");

    function updateView() {
        mineralsView.find(".figure").text(Math.floor(minerals.value));
        biomatterView.find(".figure").text(Math.floor(biomatter.value));
        deepWaterView.find(".figure").text(Math.floor(deepWater.value));
        powerView.find(".figure").text(Math.floor(power.getBalance()));
    }

    function withdrawResources(sums) {
        minerals.value -= sums[0];
        biomatter.value -= sums[1];
        deepWater.value -= sums[2];
    }

    view.hover(function(){
        tipMinerals.html(printResourceInfo(minerals));
        tipBiomatter.html(printResourceInfo(biomatter));
        tipDeepWater.html(printResourceInfo(deepWater));
        tipPower.html(printResourceInfo(power));
        showToolTip();
    }, function(){
        hideToolTip();
    });

    function showToolTip(){
        tooltip.slideDown("fast");
    }

    function hideToolTip(){
        tooltip.slideUp("fast");
    }

    function printResourceInfo(resource){
        let balance = resource.getBalance();
        let text = "<span style='color: ";
        if (balance >= 0){
            text += "green;'>"
        } else {
            text += "red;'>"
        }
        text += "Balance: "+resource.getBalance() + "</span><br>";
        resource.incomes.forEach(element => {
            text += "<span style='color:green'>"+element.source+": +"+element.value+"</span><br>";
        });
        resource.demands.forEach(element => {
            text += "<span style='color:red'>"+element.source+": +"+element.value+"</span><br>";
        });
        return text;
    }

    function showReqs(reqs){
        tipMinerals.html(printReq(minerals, reqs[0]));
        tipBiomatter.html(printReq(biomatter, reqs[1]));
        tipDeepWater.html(printReq(deepWater, reqs[2]));
        tipPower.html(printReq(power, reqs[3]));
        showToolTip();
    }

    function printReq(resource, req){
        let color = "red";
        if(resource.value >= req){
            color = "green";
        }
        return "<span style='color: " + color + "'>-" + req + "</span>"
    }

    function hideReqs(){
        hideToolTip();
    }

    var methods = {
        minerals: minerals,
        biomatter: biomatter,
        deepWater: deepWater,
        power: power,
        withdrawResources: withdrawResources,
        showReqs: showReqs,
        hideReqs: hideReqs
    }

    return methods;
};
