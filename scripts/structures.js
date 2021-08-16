function PowerPlant(biomatterDeposit, carbonDeposit){
    this.biomatterDepot = biomatterDeposit;
    this.carbonDepot = carbonDeposit;
    this.biomatter = new ResourceDeposit(0,100);

    this.drawFunction = function(){
        let demand = this.biomatter.capacity - this.biomatter.level;
        this.biomatter.deposit(this.biomatterDepot.withdraw(demand));
    }

    // to simulate the organic chemistry within the powerPlant, carbonPercentage.level is used as percentage.
    // in later stages, a powerPlant choking in its own waste-carbon might die and require repair.
    this.carbonPercentage = new ResourceDeposit(0,100);
    this.powerEfficiency = 0;
    
    this.doFunction = function(){
        this.powerEfficiency = this.biomatter.level - this.carbonPercentage.level;
        this.biomatter.withdraw(10);
        this.carbonPercentage.deposit(10);
    }

    this.powerTarget = 10;
    this.powerOutput = 0;
    this.doneFunction = function(){
        if(this.powerEfficiency >= 0){
            this.powerOutput = Math.floor(this.powerTarget * (this.powerEfficiency / 100));
        } else {
            this.powerOutput = 0;
        }
        let carbonCache = this.carbonPercentage.withdraw(10);
        if(this.carbonDepot.level != this.carbonDepot.capacity){
            this.carbonDepot.deposit(carbonCache);
        } else {
            this.carbonPercentage.deposit(carbonCache);
        }
    }
}

/*
Foundry:
It automatically looks for resources it can quarry and collects them. Automation can be disabled.
Building tasks are something given from the outside. Perhaps they will need a "done" callback, or an "inProgress" callback.
For the duration of the current stage in development, building and its tasks are not within scope.

setArea

within drawFunction
look for internal PowerGrid
look for scrap and biomatter in area
draw power into internal battery/powerCache
-> this requires more effort. The actual procedures should determine required power, and the power should... well, yes, it should be "reserved" in advance from the grid.
-> consider a sort of task management.
  -> import bioMatter
  -> import scrap
  -> build structures

within doFunction
perform tasks

within doneFunction
export/expose task results.

*/

var Foundry = function(internal){
    var localResources = [];

    function getInternalResources(){
        let response= [
            {type: "Minerals", quantity: internal.minerals.level},
            {type: "Biomatter", quantity: internal.biomatter.level},
            {type: "Power", balance: internal.power.getBalance()}
        ]
        return response;
    }

    function setArea(area){
        localResources !== area ? log("new area found! exploring...") : null;
        localResources = area;
    }

    function getLocalResources(){
        let response = [];
        localResources.length === 0 ? log("no resources found in this area") : null;
        localResources.forEach(res => {
            response.push( {type: res.type, quantity: res.level});
        });
        return response;
    }

    var logFile = new Array(5);
    var pointer = 4;
    function log(msg){
        pointer === logFile.length-1 ? pointer = 0 : pointer ++;
        logFile[pointer] = msg;
    }

    function getLastLog(){
        return logFile[pointer];
    }

    function getLogFile(){
        return logFile;
    }

    return {
        getInternalResources:getInternalResources,
        setArea: setArea,
        getLocalResources: getLocalResources,
        getLastLog: getLastLog,
        getLogFile: getLogFile
    }
}(internal);