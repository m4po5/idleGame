var pieces = {};

// pieces found on the "board"
/**
 * 
 * @param {pieces.Resource.types} type the type of resource
 * @param {Integer} value existing level of that resource
 * @param {String} name name of this specific resource
 */
pieces.Resource = function(type, value, name){
    this.type = type;
    this.level = value;
    this.name = name;
    this.withdraw = function(amount){
        amount = Math.abs(amount);
        if (this.hasAmount(amount)){
            this.level -= amount;
            return amount;
        } else {
            throw new pieces.Resource.OutOfResourceException(this);
        }
    }
    this.hasAmount = function(amount){
        return Math.abs(amount) <= this.level;
    }
};
pieces.Resource.types = {BIO: 0, METAL: 1, CARBON: 2}
Object.freeze(pieces.Resource.types);
pieces.Resource.typeToString = function(type){
    return Object.keys(pieces.Resource.types).find( key => pieces.Resource.types[key] === type);
}
/**
 * 
 * @param {pieces.Resource} resource 
 */
pieces.Resource.OutOfResourceException = function(resource){
    this.name = "out of resource";
    this.level = resource.level;
    this.toString = function(){
        return this.name + ": " + this.level + " remaining";
    }
}
pieces.LogMessage = function(msg, lvl){
    this.msg = msg;
    this.lvl = lvl;
    this.toString = function(){
        let string = "";
        switch(this.lvl){
            case 1:
                string += "warning: ";
                break;
            case 2:
                string += "critical: ";
                break;
            default:
                string += "info: ";
        }
        string += msg;
        return string;
    }
}

// pieces located inside the robotic unit controlled by the player
pieces.robotics = {};
pieces.robotics.Storage = function(type, value, capacity, name){
    pieces.Resource.call(this, type, value, name);
    this.capacity = capacity;
    this.isFull = function(){
        return this.capacity === this.level;
    }
    this.deposit = function(amount){
        amount = Math.abs(amount);
        if (this.hasCapacity(amount)){
            this.level += amount;
        } else {
            throw new pieces.robotics.Storage.OutOfCapacityException(this);
        }
    }
    this.increaseCapacity = function(amount){
        this.capacity += Math.abs(amount);
    }
    this.hasCapacity = function(amount){
        return Math.abs(amount)+this.level <= this.capacity;
    }
};
/**
 * 
 * @param {pieces.robotics.Storage} storage 
 */
pieces.robotics.Storage.OutOfCapacityException = function(storage){
    this.name = "out of capacity";
    this.capacity = storage.limit - storage.level;
    this.toString = function(){
        return this.name + ": " + this.capacity + " capacity left in storage";
    }
}

pieces.robotics.Foundry = function(){
    var powerDepot = 5;
    function hasPower(amount) {
        if( powerDepot < amount) {
          return false;
        } else {
          return true;
        }
    }

    this.bioSource;
    /**
     * 
     * @param {pieces.Resource} source Resource Object of type BIO
     */
    this.setBioSource = function(source){
        if (source.type !== pieces.Resource.types.BIO)
            throw new pieces.robotics.Foundry.ResourceTypeError(source, pieces.Resource.types.BIO);
        this.bioSource = source;
    }
    this.getBioSource = function(){
        if (this.bioSource === undefined )
            throw new Error("no Resource defined in Foundry");
        return this.bioSource;
    }

    this.bioTarget;
    /**
     * 
     * @param {pieces.robotics.Storage} target Storage Object of type BIO
     */
    this.setBioTarget = function(target){
        if (target.type !== pieces.Resource.types.BIO)
            throw new pieces.robotics.Foundry.ResourceTypeError(target, pieces.Resource.types.BIO);
        this.bioTarget = target;
    }
    this.getBioTarget = function(target){
        if(this.bioTarget === undefined)
            throw new Error("no Storage defined in Foundry");
        return this.bioTarget;
    }

    this.gatherBiomass = function (bioPull){
        const source = this.getBioSource();
        const target = this.getBioTarget();

        const powerReq = 2;
        if (!hasPower(powerReq)){
            this.monitor.log("Foundry ran out of power", 2);
            return;
        }

        if(!source.hasAmount(bioPull)) {
            this.monitor.log(source.name + " has run out of resources", 1);
            bioPull = source.level;
        }
        if(!target.hasCapacity(bioPull)){
            this.monitor.log(target.name + " has reached maximum capacity", 1);
            bioPull = target.capacity - target.level;
        }

        let cache = 0;
        // powerDepot -= powerReq;
        cache = source.withdraw(bioPull);
        target.deposit(cache);
    }

    /**
     * 
     * @param {Integer} elapsedTime milliseconds
     */
    this.update = function(elapsedTime){
        this.monitor.clear();
        const bioPull = (3/1000) * elapsedTime; // 10 units per second divided by 1000 milliseconds multiplied with the amount of elapsed milliseconds
        this.gatherBiomass(bioPull);
    }

    this.monitor = {
        messages: [],
        log: function(msg, lvl){this.messages.push(new pieces.LogMessage(msg, lvl));},
        clear: function(){this.messages = [];}
    };
    this.setMonitor = function(monitor){
        this.monitor.forEach(logMsg => {
            monitor.log(logMsg.msg, logMsg.lvl);
        });
        this.monitor = monitor;
    }
    this.getMonitor = function(){
        return this.monitor;
    }
}
/**
 * 
 * @param {pieces.Resource} resource the violating Resource object
 * @param {pieces.Resource.types} expected the expected type of the Resource object
 */
pieces.robotics.Foundry.ResourceTypeError = function(resource, expected){
    this.type = pieces.Resource.typeToString(resource.type);
    this.expected = pieces.Resource.typeToString(expected);
    this.message = "wrong resource type given";
    this.toString = function(){
        return this.expected + " expected, but " + this.type + " was given."
    }
}