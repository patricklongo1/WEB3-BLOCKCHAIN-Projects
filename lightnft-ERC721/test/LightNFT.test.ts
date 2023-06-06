import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("LightNFT", function () {
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const LightNFT = await ethers.getContractFactory("LightNFT");
    const contract = await LightNFT.deploy();
    return { contract, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should ...", async function () {
      const { contract, owner, otherAccount } = await loadFixture(deployFixture);

      // expect(await contract.unlockTime()).to.equal(unlockTime);
    });
  });
});
