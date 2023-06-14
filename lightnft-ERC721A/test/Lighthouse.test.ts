import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lighthouse", function () {
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const Lighthouse = await ethers.getContractFactory("Lighthouse");
    const contract = await Lighthouse.deploy();
    return { contract, owner, otherAccount };
  }

  // basic infos
  it("Should has name", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    expect(await contract.name()).to.equal("Lighthouse", "Can't get name");
  });
  it("Should has symbol", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    expect(await contract.symbol()).to.equal("LTH", "Can't get symbol");
  });
  it("Should supports interface", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    expect(await contract.supportsInterface("0x80ac58cd")).to.equal(
      true,
      "Can't support interface"
    );
  });

  // mint
  it("Should mint", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(1);

    const balance = await contract.balanceOf(owner.address);
    const tokenId = 0;
    const ownerOf = await contract.ownerOf(tokenId);
    const totalSupply = await contract.totalSupply();

    expect(balance).to.equal(1, "Can't mint");
    expect(ownerOf).to.equal(owner.address, "Can't mint");
    expect(totalSupply).to.equal(1, "Can't mint");
  });
  it("Should NOT mint (owner)", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);
    const instance = contract.connect(otherAccount);
    await expect(instance.mint(1)).to.be.revertedWith("Only the contract owner can call this function");
  });

  // burn
  it("Should burn", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(1);
    const tokenId = 0;

    await contract.burn(tokenId);

    const balance = await contract.balanceOf(owner.address);
    const totalSupply = await contract.totalSupply();

    expect(balance).to.equal(0, "Can't burn");
    expect(totalSupply).to.equal(0, "Can't burn");
  });
  it("Should burn multiple", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(3);
    const balanceBefore = await contract.balanceOf(owner.address);

    const tokenId0 = 0;
    const tokenId1 = 1;
    const tokenId2 = 2;
    const tokensIds = [tokenId0, tokenId1, tokenId2];

    await contract.burnMultiple(tokensIds);

    const balanceAfter = await contract.balanceOf(owner.address);
    const totalSupply = await contract.totalSupply();

    expect(balanceBefore).to.equal(3, "Can't burn multiple");
    expect(balanceAfter).to.equal(0, "Can't burn multiple");
    expect(totalSupply).to.equal(0, "Can't burn multiple");
  });
  it("Should NOT burn (not exists)", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await expect(contract.burn(1)).to.be.revertedWithCustomError(
      contract,
      "OwnerQueryForNonexistentToken"
    );
  });

  // URI metadata
  it("Should has URI metadata", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(1);
    const tokenId = 0;

    expect(await contract.tokenURI(tokenId)).to.equal(
      "https://lighters.live/api/nft/0.json",
      "Can't get URI Metadata"
    );
  });
  it("Should NOT has URI metadata", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await expect(contract.tokenURI(1)).to.be.revertedWithCustomError(
      contract,
      "URIQueryForNonexistentToken"
    );
  });

  // transfer
  it("Should transfer", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(1);
    const tokenId = 0;

    await contract.transferFrom(owner.address, otherAccount.address, tokenId);

    const balanceFrom = await contract.balanceOf(owner.address);
    const balanceTo = await contract.balanceOf(otherAccount.address);
    const ownerOf = await contract.ownerOf(tokenId);

    expect(balanceFrom).to.equal(0, "Can't transfer");
    expect(balanceTo).to.equal(1, "Can't transfer");
    expect(ownerOf).to.equal(otherAccount.address, "Can't transfer");
  });
  it("Should transfer (approved)", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(1);
    const tokenId = 0;

    await contract.approve(otherAccount.address, tokenId);
    const approved = await contract.getApproved(tokenId);

    const instance = contract.connect(otherAccount);
    await instance.transferFrom(owner.address, otherAccount.address, tokenId);

    const ownerOf = await contract.ownerOf(tokenId);

    expect(ownerOf).to.equal(otherAccount.address, "Can't transfer");
    expect(approved).to.equal(otherAccount.address, "Can't transfer");
  });
  it("Should transfer and clear approvals", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(1);
    const tokenId = 0;

    await contract.approve(otherAccount.address, tokenId);

    await contract.transferFrom(owner.address, otherAccount.address, tokenId);

    const approved = await contract.getApproved(tokenId);

    expect(approved).to.equal(
      "0x0000000000000000000000000000000000000000",
      "Can't clear approval"
    );
  });
  it("Should transfer (approve for all)", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(1);
    const tokenId = 0;

    await contract.setApprovalForAll(otherAccount.address, true);
    const approved = await contract.isApprovedForAll(
      owner.address,
      otherAccount.address
    );

    const instance = contract.connect(otherAccount);
    await instance.transferFrom(owner.address, otherAccount.address, tokenId);

    const ownerOf = await contract.ownerOf(tokenId);

    expect(ownerOf).to.equal(otherAccount.address, "Can't transfer");
    expect(approved).to.equal(true, "Can't transfer");
  });
  it("Should NOT transfer (permission)", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(1);
    const tokenId = 0;

    const instance = contract.connect(otherAccount);

    await expect(
      instance.transferFrom(owner.address, otherAccount.address, tokenId)
    ).to.be.revertedWithCustomError(
      contract,
      "TransferCallerNotOwnerNorApproved"
    );
  });
  it("Should NOT transfer (exists)", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await expect(
      contract.transferFrom(owner.address, otherAccount.address, 1)
    ).to.be.revertedWithCustomError(contract, "OwnerQueryForNonexistentToken");
  });

  // emit events
  it("Should emit transfer", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(1);
    const tokenId = 0;

    await expect(
      contract.transferFrom(owner.address, otherAccount.address, tokenId)
    )
      .to.emit(contract, "Transfer")
      .withArgs(owner.address, otherAccount.address, tokenId);
  });
  it("Should emit approval", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(1);
    const tokenId = 0;

    await expect(contract.approve(otherAccount.address, tokenId))
      .to.emit(contract, "Approval")
      .withArgs(owner.address, otherAccount.address, tokenId);
  });
  it("Should emit approval for all", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);

    await contract.mint(1);

    await expect(contract.setApprovalForAll(otherAccount.address, true))
      .to.emit(contract, "ApprovalForAll")
      .withArgs(owner.address, otherAccount.address, true);
  });
});
