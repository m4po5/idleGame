const { test } = QUnit;
QUnit.module("Storage Tests", function (hooks) {
    hooks.beforeEach(function () {
        this.storage = new pieces.robotics.Storage(pieces.Resource.types.BIO, 500, 5000, "Test Storage");
    });
    test("withdraw something", function(assert){
        const amount = 100;
        const level = this.storage.level;
        const cache = this.storage.withdraw(amount);
        assert.equal(cache, amount, "withdraw should return the requested amount");
        assert.equal(this.storage.level, level-amount, "withdraw should lower level by the requested amount");
    });
    test("withdraw more than there is", function (assert) {
        let resource = new pieces.Resource(pieces.Resource.types.BIO, 300, "Test Resource");
        let amount = resource.level;
        assert.throws(function(){resource.withdraw(amount + 300)}, pieces.Resource.OutOfResourceException, "attempting to withdraw more than there is should throw an OutOfResource Exception.");
        assert.equal(resource.level, amount, "withdraw should not affect resource level.");
    });
    test("deposit something", function (assert) {
        let amount = this.storage.level;
        let cache = 300;
        this.storage.deposit(cache);
        assert.equal(this.storage.level, amount + cache, "depositing should correctly increase content.")
    });
    test("deposit against Limit", function (assert) {
        const level = this.storage.level;
        let value = this.storage.capacity + 1000;
        assert.throws(function(){this.storage.deposit(value);}, pieces.robotics.Storage.OutOfCapacityException, "attempting to exceed the limit should throw an OutOfCapacity Exception.")
        assert.equal(this.storage.level, level, "deposit.level should be unaffected")
    });
});
QUnit.module("Foundry Tests", function(hooks){
    hooks.beforeEach(function(){
        this.bio = new pieces.Resource(pieces.Resource.types.BIO, 2000, "Test Biomass");
        this.storage = new pieces.robotics.Storage(pieces.Resource.types.BIO, 0,5000, "Test Biomatter Storage");
    })
    test("gatherBiomatter default", function(assert){
        const bioLevel = this.bio.level;
        const storageLevel = this.storage.level;
        const foundry = new pieces.robotics.Foundry();
        foundry.gatherBiomass(this.bio, this.storage);
        assert.true(this.bio.level < bioLevel, "Bio Resource level should have decreased");
        assert.true(this.storage.level > storageLevel, "Bio Storage level should have increased");
    });
    test("gatherBiomatter should only accept Resource.types.BIO", function(assert){
        const carbon = new pieces.Resource(pieces.Resource.types.CARBON, 200, "Test Carbon");
        const store = new pieces.robotics.Storage(pieces.Resource.types.CARBON, 0, 4000, "Test Storage");
        const foundry = new pieces.robotics.Foundry();
        assert.throws(function(){foundry.gatherBiomass(carbon,this.storage)}, pieces.robotics.Foundry.ResourceTypeError, "gathering from wrong type should throw an error.");
        assert.throws(function(){foundry.gatherBiomass(this.bio,store)}, pieces.robotics.Foundry.ResourceTypeError, "delivering to wrong type should throw an error.");
    });
})