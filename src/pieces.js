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

    /**
     * 
     * @param {pieces.Resource} source 
     * @param {pieces.robotics.Storage} target 
     */
    this.gatherBiomass = function (source, target){
        if (source.type !== pieces.Resource.types.BIO) throw new pieces.robotics.Foundry.ResourceTypeError(source, pieces.Resource.types.BIO);
        if (target.type !== pieces.Resource.types.BIO) throw new pieces.robotics.Foundry.ResourceTypeError(target, pieces.Resource.types.BIO);
        const powerReq = 2;
        const bioPull = 10;
        let cache = 0;
        if (hasPower(powerReq) && source.hasAmount(bioPull) && target.hasCapacity(bioPull)){
            // powerDepot -= powerReq;
            cache = source.withdraw(bioPull);
            target.deposit(cache);
        }
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