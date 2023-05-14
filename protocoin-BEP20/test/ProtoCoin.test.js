const ProtoCoin = artifacts.require("ProtoCoin");
const { BN, time } = require('@openzeppelin/test-helpers');

contract('ProtoCoin', function (accounts) {

  const DECIMALS = new BN(18);

  beforeEach(async () => {
    contract = await ProtoCoin.new();
  })

  it("Should has correct name", async () => {
    const name = await contract.name();
    assert(name === 'New ProtoCoin', 'Incorrect name');
  });

  it("Should has correct symbol", async () => {
    const symbol = await contract.symbol();
    assert(symbol === 'NPC', 'Incorrect symbol');
  });

  it("Should has correct decimals", async () => {
    const decimals = await contract.decimals();
    assert(decimals.eq(DECIMALS), 'Incorrect decimals');
  });

  it("Should has correct total supply", async () => {
    const TOTAL_SUPPLY = new BN(10000000).mul(new BN(10).pow(DECIMALS));
    const totalSupply = await contract.totalSupply();
    assert(totalSupply.eq(TOTAL_SUPPLY), 'Incorrect totalSupply');
  });

  it("Owner should has total supply", async () => {
    const TOTAL_SUPPLY = new BN(10000000).mul(new BN(10).pow(DECIMALS));
    const balance = await contract.balanceOf(accounts[0]);
    assert(balance.eq(TOTAL_SUPPLY), 'Incorrect balance');
  });

  it("Should transfer", async () => {
    const qty = new BN(1).mul(new BN(10).pow(DECIMALS));

    const balanceAdminBefore = await contract.balanceOf(accounts[0]);
    const balanceToBefore = await contract.balanceOf(accounts[1]);

    await contract.transfer(accounts[1], qty);

    const balanceAdminNow = await contract.balanceOf(accounts[0]);
    const balanceToNow = await contract.balanceOf(accounts[1]);

    assert(balanceAdminNow.eq(balanceAdminBefore.sub(qty)), 'Incorrect admin balance');
    assert(balanceToNow.eq(balanceToBefore.add(qty)), 'Incorrect to balance');
  });

  it("Should NOT transfer", async () => {
    const qty = new BN(10000001).mul(new BN(10).pow(DECIMALS));

    try {
      await contract.transfer(accounts[1], qty);
      assert.fail("The transfer should have thrown an error.");
    }
    catch (err) {
      assert.include(err.message, "revert", "The transfer should be reverted.");
    }
  });

  it("Should approve", async () => {
    const qty = new BN(1).mul(new BN(10).pow(DECIMALS));
    await contract.approve(accounts[1], qty);

    const allowance = await contract.allowance(accounts[0], accounts[1]);
    assert(allowance.eq(qty), 'Incorrect allowance balance');
  });

  it("Should transfer from", async () => {
    const qty = new BN(1).mul(new BN(10).pow(DECIMALS));

    const allowanceBefore = await contract.allowance(accounts[0], accounts[1]);
    const balanceAdminBefore = await contract.balanceOf(accounts[0]);
    const balanceToBefore = await contract.balanceOf(accounts[1]);

    await contract.approve(accounts[1], qty);
    await contract.transferFrom(accounts[0], accounts[1], qty, { from: accounts[1] });

    const allowanceNow = await contract.allowance(accounts[0], accounts[1]);
    const balanceAdminNow = await contract.balanceOf(accounts[0]);
    const balanceToNow = await contract.balanceOf(accounts[1]);

    assert(allowanceNow.eq(allowanceBefore), 'Incorrect allowance');
    assert(balanceAdminNow.eq(balanceAdminBefore.sub(qty)), 'Incorrect admin balance');
    assert(balanceToNow.eq(balanceToBefore.add(qty)), 'Incorrect to balance');
  });

  it("Should NOT transfer from", async () => {
    const qty = new BN(1).mul(new BN(10).pow(DECIMALS));

    try {
      await contract.transferFrom(accounts[0], accounts[1], qty, { from: accounts[1] });
      assert.fail("The transfer should have thrown an error.");
    }
    catch (err) {
      assert.include(err.message, "revert", "The transferFrom should be reverted.");
    }
  });

  it("Should mint once", async () => {
    const mintAmount = new BN(1000);
    await contract.setMintAmount(mintAmount);

    const balanceBefore = await contract.balanceOf(accounts[1]);
    await contract.mint(accounts[1], { from: accounts[0] });
    const balanceNow = await contract.balanceOf(accounts[1]);

    assert(balanceNow.eq(balanceBefore.add(mintAmount)), 'Incorrect balance');
  });

  it("Should mint twice (different accounts)", async () => {
    const mintAmount = new BN(1000);
    await contract.setMintAmount(mintAmount);

    const balance1Before = await contract.balanceOf(accounts[1]);
    const balance2Before = await contract.balanceOf(accounts[2]);

    await contract.mint(accounts[1], { from: accounts[0] });
    await contract.mint(accounts[2], { from: accounts[0] });

    const balance1Now = await contract.balanceOf(accounts[1]);
    const balance2Now = await contract.balanceOf(accounts[2]);

    assert(balance1Now.eq(balance1Before.add(mintAmount)), 'Incorrect balance');
    assert(balance2Now.eq(balance2Before.add(mintAmount)), 'Incorrect balance');
  });

  it("Should mint twice (different moments)", async () => {
    const mintAmount = new BN(1000);
    await contract.setMintAmount(mintAmount);

    const delayInSeconds = 1;
    await contract.setMintDelay(delayInSeconds);

    const balanceBefore = await contract.balanceOf(accounts[1]);
    await contract.mint(accounts[1], { from: accounts[0] });

    await time.increase(delayInSeconds * 2);

    await contract.mint(accounts[1], { from: accounts[0] });
    const balanceNow = await contract.balanceOf(accounts[1]);

    assert(balanceNow.eq(balanceBefore.add(new BN(mintAmount * 2))), 'Incorrect balance');
  });

  it("Should NOT setMintAmount (permission)", async () => {
    try {
      await contract.setMintAmount(1000, { from: accounts[1] });
      assert.fail("The setMintAmount should have thrown an error.");
    }
    catch (err) {
      assert.include(err.message, "revert", "The setMintAmount should be reverted.");
    }
  });

  it("Should NOT setMintDelay (permission)", async () => {
    try {
      await contract.setMintDelay(1000, { from: accounts[1] });
      assert.fail("The setMintDelay should have thrown an error.");
    }
    catch (err) {
      assert.include(err.message, "revert", "The setMintDelay should be reverted.");
    }
  });

  it("Should NOT mint (disabled)", async () => {
    try {
      await contract.mint(accounts[1], { from: accounts[0] });
      assert.fail("The mint should have thrown an error.");
    }
    catch (err) {
      assert.include(err.message, "revert", "The mint should be reverted.");
    }
  });

  it("Should NOT mint twice", async () => {
    await contract.setMintAmount(new BN(1000));

    await contract.mint(accounts[1], { from: accounts[0] });

    try {
      await contract.mint(accounts[1], { from: accounts[0] });
      assert.fail("The mint should have thrown an error.");
    }
    catch (err) {
      assert.include(err.message, "revert", "The mint should be reverted.");
    }
  });

  it("Should NOT mint (not owner)", async () => {
    await contract.setMintAmount(new BN(1000));

    try {
      await contract.mint(accounts[1], { from: accounts[1] });
      assert.fail("The mint should have thrown an error.");
    }
    catch (err) {
      assert.include(err.message, "revert", "The mint should be reverted.");
    }
  });
});