function Resource(value){
    this.level = value; 
    this.withdraw = function(amount){
        let drain = 0;
        if (amount > this.level){
            drain = this.level;
            this.level = 0;
            return drain;
        }
        drain = amount;
        this.level -= drain;
        return drain;
    }
};

function ResourceDeposit(value, capacity){
    Resource.call(this, value);
    this.capacity = capacity;
    this.deposit = function(amount){
        if (amount+this.level > this.capacity){
            this.level = this.capacity;
        } else {
            this.level += amount;
        }
    }
    this.increaseCapacity = function(amount){
        this.capacity += amount;
    }
};

function Balance(){
    this.incomes = [];
    this.demands =  [];

    this.getBalance = function(){
        let balance = 0;
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

    this.addDemand = function(demand){
        this.demands.push(demand);
    }
}

var areas = [{minerals: new Resource(5000), biomatter: new Resource(10000)}];

var internal = {minerals: new ResourceDeposit(0,5000), biomatter: new ResourceDeposit(0,5000), power: new Balance()}