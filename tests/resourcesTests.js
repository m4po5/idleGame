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
    test("balance", function(assert){
        let balance = new Balance();
        let income = {value: 5};
        let demand = {value: 4};
        balance.addIncome(income);
        balance.addDemand(demand);
        assert.equal(balance.getBalance(),income.value-demand.value , "balance should be the difference between income and demands")
    });
});