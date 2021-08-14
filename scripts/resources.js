function Resource(value){
    this.level = value; 
    this.deposit = function(amount){
        this.level += amount;
    }
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

function LimitedResource(value, limit){
    Resource.call(this, value);
    this.limit = limit;
    this.deposit = function(amount){
        if (amount+this.level > this.limit){
            this.level = this.limit;
        } else {
            this.level += amount;
        }
    }
};

LocalScraps = function(){
    scraps = new Resource(10000);
    getLevel = function(){
        return scraps.level;
    }
    return {
        withdraw: scraps.withdraw,
        getLevel: getLevel
    }
}();

MineralDeposit = function(){
    minerals = new LimitedResource(0, 5000);
    getLevel = function(){
        return minerals.level;
    }
    getLimit = function(){
        return minerals.limit;
    }
    return {
        deposit: minerals.deposit,
        withdraw: minerals.withdraw,
        getLevel: getLevel,
        getLimit: getLimit
    }
}();