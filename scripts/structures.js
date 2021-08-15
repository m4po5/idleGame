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