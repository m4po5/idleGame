/*
- [ ] extract Ticker, wire things together in main
*/

var ResourceMonitor = function (Ticker) {
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

    function updateView() {
        $("#minerals").text(Math.floor(minerals.value));
        $("#biomatter").text(Math.floor(biomatter.value));
        $("#deepWater").text(Math.floor(deepWater.value));
        $("#power").text(Math.floor(power.getBalance()));
    }

    function withdrawResources(sums) {
        minerals.value -= sums[0];
        biomatter.value -= sums[1];
        deepWater.value -= sums[2];
    }

    var methods = {
        minerals: minerals,
        biomatter: biomatter,
        deepWater: deepWater,
        power: power,
        withdrawResources: withdrawResources
    }

    return methods;
}(Ticker);
