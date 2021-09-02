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
        this.foundry = new pieces.robotics.Foundry();
        this.foundry.setBioSource(this.bio);
        this.foundry.setBioTarget(this.storage);
    })
    test("gatherBiomatter default", function(assert){
        const bioLevel = this.bio.level;
        const storageLevel = this.storage.level;
        const pull = 10;
        this.foundry.gatherBiomass(pull);
        assert.true(this.bio.level === bioLevel-pull, "Bio Resource level should have decreased");
        assert.true(this.storage.level === storageLevel+pull, "Bio Storage level should have increased");
    });
    test("bio setters should only accept Resource.types.BIO", function(assert){
        const carbon = new pieces.Resource(pieces.Resource.types.CARBON, 200, "Test Carbon");
        const store = new pieces.robotics.Storage(pieces.Resource.types.CARBON, 0, 4000, "Test Storage");
        assert.throws(function(){this.foundry.setBioSource(carbon)}, pieces.robotics.Foundry.ResourceTypeError, "setting bioSource to wrong type should throw an error.");
        assert.throws(function(){this.foundry.setBioTarget(store)}, pieces.robotics.Foundry.ResourceTypeError, "setting bioTarget to wrong type should throw an error.");
    });
    test("gathering from (almost) empty resource should run and log", function(assert){
        const msgs = this.foundry.getMonitor().messages.length;
        const storageLvl = this.storage.level;
        this.bio.level = 2;

        this.foundry.gatherBiomass(10);

        const monitor = this.foundry.getMonitor();
        assert.true(monitor.messages.length > msgs, "there should be more messages logged than before");
        assert.true(monitor.messages[0].toString().includes(this.bio.name), "there should be a message including " + this.bio.name);
        assert.true(monitor.messages[0].lvl == 1, "and the message level should be 1 for 'warning'");
        assert.true(this.bio.level === 0, "bio resource should now be completely empty");
        assert.equal(this.storage.level, storageLvl + 2, "storage should have received remaining resource")
    });
    test("delivering to full (almost) storage should run and log", function(assert){
        const msgs = this.foundry.getMonitor().messages.length;
        const bioLevel = this.bio.level;
        this.storage.level = this.storage.capacity - 2;

        this.foundry.gatherBiomass(10);

        const monitor = this.foundry.getMonitor();
        assert.true(monitor.messages.length > msgs, "there should be more messages logged than before");
        assert.true(monitor.messages[0].toString().includes(this.storage.name), "there should be a message including " + this.storage.name);
        assert.true(monitor.messages[0].lvl == 1, "and the message level should be 1 for 'warning'");
        assert.equal(this.storage.level, this.storage.capacity, "bio storage should now be full");
        assert.equal(this.bio.level, bioLevel - 2, "resource should have decreased by the remaining storage capacity")
    });
    test("update", function(assert){
        const milliseconds = 230;
        const expBio = (3/1000) * milliseconds;
        const bioLvl = this.bio.level;
        const storageLvl = this.storage.level;

        this.foundry.update(milliseconds);

        assert.equal(this.bio.level, bioLvl - expBio, "bio resource should have decreased according to time elapsed");
        assert.equal(this.storage.level, storageLvl + expBio, "bio storage should have increased according to time elapsed");
        assert.equal(this.foundry.getMonitor().messages.length, 0, "there should be no logged messages")
    });
})