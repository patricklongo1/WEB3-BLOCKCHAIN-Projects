const JoKenPo = artifacts.require("JoKenPo");
const JKPLibrary = artifacts.require("JKPLibrary");

contract("JoKenPo", function (accounts) {
  beforeEach(async () => {
    contract = await JoKenPo.new();
  });

  it("Should play alone", async () => {
    await contract.play(JKPLibrary.Options.PAPER, {
      from: accounts[1],
      value: web3.utils.toWei("0.01", "ether"),
    });
    const result = await contract.getResult();
    assert(
      result === "Player 1 choose his/her option. Waiting player 2.",
      "Error playing alone"
    );
  });

  it("Should play along", async () => {
    await contract.play(JKPLibrary.Options.PAPER, {
      from: accounts[1],
      value: web3.utils.toWei("0.01", "ether"),
    });
    await contract.play(JKPLibrary.Options.ROCK, {
      from: accounts[2],
      value: web3.utils.toWei("0.01", "ether"),
    });
    const result = await contract.getResult();
    assert(result === "Paper wraps rock. Player 1 won.", "Error playing along");
  });

  it("Should NOT play alone (owner)", async () => {
    try {
      await contract.play(JKPLibrary.Options.PAPER, {
        from: accounts[0],
        value: web3.utils.toWei("0.01", "ether"),
      });
      assert.fail("The play should have thrown an error.");
    } catch (error) {
      assert.include(error.message, "revert", "The play should be reverted.");
    }
  });

  it("Should NOT play alone (invalid option)", async () => {
    try {
      await contract.play(JKPLibrary.Options.NONE, {
        from: accounts[1],
        value: web3.utils.toWei("0.01", "ether"),
      });
      assert.fail("The play should have thrown an error.");
    } catch (error) {
      assert.include(error.message, "revert", "The play should be reverted.");
    }
  });

  it("Should NOT play alone (twice in a row)", async () => {
    await contract.play(JKPLibrary.Options.PAPER, {
      from: accounts[1],
      value: web3.utils.toWei("0.01", "ether"),
    });
    try {
      await contract.play(JKPLibrary.Options.ROCK, {
        from: accounts[1],
        value: web3.utils.toWei("0.01", "ether"),
      });
      assert.fail("The play should have thrown an error.");
    } catch (error) {
      assert.include(error.message, "revert", "The play should be reverted.");
    }
  });

  it("Should NOT play alone (invalid bid)", async () => {
    try {
      await contract.play(JKPLibrary.Options.ROCK, {
        from: accounts[1],
        value: web3.utils.toWei("0.001", "ether"),
      });
      assert.fail("The play should have thrown an error.");
    } catch (error) {
      assert.include(error.message, "revert", "The play should be reverted.");
    }
  });

  it("Should get leaderBoard", async () => {
    await contract.play(JKPLibrary.Options.ROCK, {
      from: accounts[1],
      value: web3.utils.toWei("0.01", "ether"),
    });
    await contract.play(JKPLibrary.Options.PAPER, {
      from: accounts[2],
      value: web3.utils.toWei("0.01", "ether"),
    });
    const winners = await contract.getLeaderBoard();
    assert(
      winners[0].wallet === accounts[2] && winners[0].wins === "1",
      "Error getting leaderBoard"
    );
  });

  it("Should set bid", async () => {
    const newBid = web3.utils.toWei("0.02", "ether");
    await contract.setBid(newBid);
    const bid = await contract.getBid();
    assert(bid.eq(web3.utils.toBN(newBid)), "Error setting bid");
  });

  it("Should set commission", async () => {
    const newCommission = web3.utils.toBN(15);
    await contract.setCommission(newCommission);
    const commission = await contract.getCommission();
    assert(commission.eq(newCommission), "Error setting bid");
  });

  it("Should NOT set bid (invalid owner)", async () => {
    try {
      const newBid = web3.utils.toWei("0.02", "ether");
      await contract.setBid(newBid, { from: accounts[1] });
      assert.fail("The set bid should have thrown an error.");
    } catch (error) {
      assert.include(error.message, "revert", "The setBid should be reverted.");
    }
  });

  it("Should NOT set commission (invalid owner)", async () => {
    try {
      const newCommission = web3.utils.toBN(15);
      await contract.setCommission(newCommission, { from: accounts[1] });
      assert.fail("The set commission should have thrown an error.");
    } catch (error) {
      assert.include(
        error.message,
        "revert",
        "The setCommission should be reverted."
      );
    }
  });

  it("Should NOT set bid (game in progress)", async () => {
    await contract.play(JKPLibrary.Options.PAPER, {
      from: accounts[1],
      value: web3.utils.toWei("0.01", "ether"),
    });
    try {
      const newBid = web3.utils.toWei("0.02", "ether");
      await contract.setBid(newBid);
      assert.fail("The set bid should have thrown an error.");
    } catch (error) {
      assert.include(error.message, "revert", "The setBid should be reverted.");
    }
  });

  it("Should NOT set commission (game in progress)", async () => {
    await contract.play(JKPLibrary.Options.PAPER, {
      from: accounts[1],
      value: web3.utils.toWei("0.01", "ether"),
    });
    try {
      const newCommission = web3.utils.toBN(15);
      await contract.setCommission(newCommission);
      assert.fail("The set bid should have thrown an error.");
    } catch (error) {
      assert.include(
        error.message,
        "revert",
        "The setCommission should be reverted."
      );
    }
  });
});
