const ProtoCoin = artifacts.require("ProtoCoin");
const BN = require("bn.js");

contract("ProtoCoin", function (accounts) {
  const DECIMALS = new BN(18);
  const TOTAL_SUPPLY = new BN(1000).mul(new BN(10).pow(DECIMALS));

  beforeEach(async () => {
    contract = await ProtoCoin.new();
  });

  it("should has correct NAME", async () => {
    const name = await contract.name();
    assert(name === "ProtoCoin", "Incorrect coin name");
  });

  it("should has correct SYMBOL", async () => {
    const symbol = await contract.symbol();
    assert(symbol === "PRC", "Incorrect coin symbol");
  });

  it("should has correct DECIMALS", async () => {
    const decimals = await contract.decimals();
    assert(decimals.eq(DECIMALS), "Incorrect coin decimals");
  });

  it("should has correct TOTALSUPPLY", async () => {
    const totalSupply = await contract.totalSupply();
    assert(totalSupply.eq(TOTAL_SUPPLY), "Incorrect coin totalSupply");
  });

  it("owner should has totalSupply", async () => {
    const ownerSupply = await contract.balanceOf(accounts[0]);
    assert(ownerSupply.eq(TOTAL_SUPPLY), "Owner don't have total supply");
  });

  it("should transfer", async () => {
    const qty = new BN(1).mul(new BN(10).pow(DECIMALS));
    const tx = await contract.transfer(accounts[1], qty);

    const fromBalance = await contract.balanceOf(accounts[0]);
    const toBalance = await contract.balanceOf(accounts[1]);

    assert(tx.receipt.status === true, "Transfer not completed");
    assert(fromBalance.eq(TOTAL_SUPPLY.sub(qty)), "Incorrect from balance");
    assert(toBalance.eq(qty), "Incorrect to balance");
  });

  it("should NOT transfer", async () => {
    const qty = new BN(1001).mul(new BN(10).pow(DECIMALS));

    try {
      await contract.transfer(accounts[1], qty);
      assert.fail("The transfer should have trhown an error");
    } catch (error) {
      assert.include(
        error.message,
        "revert",
        "The transfer should be reverted"
      );
    }
  });

  it("should approve", async () => {
    const qty = new BN(1).mul(new BN(10).pow(DECIMALS));
    await contract.approve(accounts[1], qty);

    const allowance = await contract.allowance(accounts[0], accounts[1]);

    assert(allowance.eq(qty), "Incorrect allowance balance");
  });

  it("should transfer from (allowance)", async () => {
    const qty = new BN(1).mul(new BN(10).pow(DECIMALS));

    await contract.approve(accounts[1], qty.mul(new BN(2)));
    const tx = await contract.transferFrom(accounts[0], accounts[2], qty, {
      from: accounts[1],
    });

    const ownerBalance = await contract.balanceOf(accounts[0]);
    const toBalance = await contract.balanceOf(accounts[2]);
    const allowanceUpdated = await contract.allowance(accounts[0], accounts[1]);

    assert(tx.receipt.status === true, "Transfer not completed");
    assert(toBalance.eq(qty), "Incorrect to balance");
    assert(ownerBalance.eq(TOTAL_SUPPLY.sub(qty)), "Incorrect owner balance");
    assert(allowanceUpdated.eq(qty), "Incorrect allowance remaining balance");
  });

  it("should NOT transfer from (allowance)", async () => {
    const qty = new BN(1).mul(new BN(10).pow(DECIMALS));

    try {
      await contract.transferFrom(accounts[0], accounts[2], qty, {
        from: accounts[1],
      });
      assert.fail("The transfer from (allowance) should have trhown an error");
    } catch (error) {
      assert.include(
        error.message,
        "revert",
        "The transfer from (allowance) should be reverted"
      );
    }
  });
});
