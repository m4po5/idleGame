const { test } = QUnit;
QUnit.module("Resources Tests", function (hooks) {
    hooks.beforeEach(function () {
        this.resource = new ResourceDeposit(200, 5000);
    })
    test("withdraw more than there is", function (assert) {
        let resource = new Resource(300);
        let amount = resource.level;
        let cache = resource.withdraw(amount + 300);
        assert.equal(amount, cache, "withdraw should give as much as was inside.")
        assert.equal(resource.level, 0, "withdraw should not allow resource to fall under zero.")
    });
    test("deposit something", function (assert) {
        let amount = this.resource.level;
        let cache = 300;
        this.resource.deposit(cache);
        assert.equal(this.resource.level, amount + cache, "depositing should correctly increase content.")
    });
    test("deposit against Limit", function (assert) {
        let value = this.resource.capacity + 1000;
        this.resource.deposit(value);
        assert.equal(this.resource.level, this.resource.capacity, "deposit should be full")
    });
    test("powerGrid", function(assert){
        let balance = new PowerGrid();
        let income = {source: {powerOutput: 5}};
        let demand = {value: 4};
        balance.addIncome(income);
        balance.addDemand(demand);
        assert.equal(balance.getBalance(),income.source.powerOutput-demand.value , "balance should be the difference between income and demands")
    });
});
QUnit.module("PowerPlant", function(hooks){
    hooks.beforeEach(function(){
        this.biomatterDepot = new Resource(100);
        this.carbonDepot = new ResourceDeposit(0,500);
        this.powerGrid = new PowerGrid();
        this.powerPlant = new PowerPlant(this.biomatterDepot, this.carbonDepot);
        this.powerGrid.addIncome({name: "Test PowerPlant", source: this.powerPlant});
    });
    test("drawFunction optimal", function(assert){
        this.powerPlant.drawFunction();
        assert.equal(this.biomatterDepot.level, 0, "biomatterDepot should be empty");
        assert.equal(this.powerPlant.biomatter.level, 100, "powerplant.biomatter should be filled");
        assert.equal(this.powerGrid.getBalance(), 0, "there should be no power yet");
    })
    test("drawFunction when half full", function(assert){
        this.powerPlant.biomatter.deposit(50);
        this.powerPlant.drawFunction();
        assert.equal(this.biomatterDepot.level, 50, "biomatterDepot should be at 50");
        assert.equal(this.powerPlant.biomatter.level, 100, "powerPlant.biomatter should be full");
    })
    test("drawFunction when depot half empty", function(assert){
        this.biomatterDepot.withdraw(50);
        this.powerPlant.drawFunction();
        assert.equal(this.biomatterDepot.level, 0, "biomatterDepot should be empty");
        assert.equal(this.powerPlant.biomatter.level, 50, "powerPlant.biomatter should be at 50");
    })
    test("doFunction optimal", function(assert){
        this.powerPlant.drawFunction();
        this.powerPlant.doFunction();
        assert.equal(this.powerPlant.powerEfficiency, 100, "power should be at maximum efficiency");
        assert.equal(this.powerPlant.biomatter.level, 90, "biomatter should have decreased by 10");
        assert.equal(this.powerPlant.carbonPercentage.level, 10, "carbon should have increased by 10");
        assert.equal(this.powerGrid.getBalance(), 0, "there should be no power yet");
    });
    test("doFunction when biomatter half empty", function(assert){
        this.powerPlant.biomatter.level = 50;
        this.powerPlant.doFunction();
        assert.equal(this.powerPlant.powerEfficiency, 50, "power should still be at half efficiency");
        assert.equal(this.powerPlant.biomatter.level, 40, "biomatter should have decreased by 10");
        assert.equal(this.powerPlant.carbonPercentage.level, 10, "carbon should have increased by 10");
    });
    test("doFunction with mixed bio/carbon conditions", function(assert){
        this.powerPlant.biomatter.level = 90;
        this.powerPlant.carbonPercentage.level = 30;
        this.powerPlant.doFunction();
        assert.equal(this.powerPlant.powerEfficiency, 60, "power should still be at 60% efficiency");
        assert.equal(this.powerPlant.biomatter.level, 80, "biomatter should have decreased by 10");
        assert.equal(this.powerPlant.carbonPercentage.level, 40, "carbon should have increased by 10");
    });
    test("doneFunction optimal", function(assert){
        this.powerPlant.drawFunction();
        this.powerPlant.doFunction();
        this.powerPlant.doneFunction();
        assert.equal(this.powerGrid.getBalance(), 10, "powerGrid should have an income of 10");
        assert.equal(this.powerPlant.carbonPercentage.level, 0, "carbon should have been cleared out");
        assert.equal(this.carbonDepot.level, 10, "carbonDepot.level should have increased by 10");
    });
    test("doneFunction with decreased powerEfficiency", function(assert){
        this.powerPlant.powerEfficiency = 40;
        this.powerPlant.doneFunction();
        assert.equal(this.powerGrid.getBalance(), 4, "powerGrid should have an income of 4");
        assert.equal(this.powerPlant.carbonPercentage.level, 0, "carbon should have been cleared out");
        assert.equal(this.carbonDepot.level, 0, "carbonDepot.level should not have increased (there was none to give in this test).");
    });
    test("doneFunction against full carbonDepot", function(assert){
        this.carbonDepot.level = this.carbonDepot.capacity;
        this.powerPlant.powerEfficiency = 100;
        this.powerPlant.carbonPercentage.level = 10;
        this.powerPlant.doneFunction();
        assert.equal(this.powerGrid.getBalance(), 10, "powerGrid should have an income of 10");
        assert.equal(this.powerPlant.carbonPercentage.level, 10, "carbon should have remained in powerPlant");
        assert.equal(this.carbonDepot.level, this.carbonDepot.capacity, "carbonDepot.level should still be at max capacity");
    })
    test("doneFunction negative efficiency", function(assert){
        this.powerPlant.powerEfficiency = -20;
        this.powerPlant.doneFunction();
        assert.equal(this.powerGrid.getBalance(), 0, "powerGrid should get no income");
    })
});
QUnit.module("Foundry", function(hooks){
    test("initiate", function(assert){
        let intel = Foundry.getInternalResources();
        Foundry.getLocalResources();
        assert.equal(Foundry.getLastLog(), "no resources found in this area", "log missing resources");
        assert.deepEqual(intel, [{type: "Minerals", quantity: 0}, {type: "Biomatter", quantity: 0}, {type: "Power", balance: 0}], "Foundry should know internal resources")
        Foundry.setArea(areas[0]);
        assert.equal(Foundry.getLastLog(), "new area found! exploring...", "log new area found");
        let msg = Foundry.getLocalResources();
        assert.deepEqual(msg, [{type: "Scrap", quantity: 5000}, {type: "Biomatter", quantity: 10000}], "Foundry should know local area resources.")
        console.table(Foundry.getLogFile());
    });
});