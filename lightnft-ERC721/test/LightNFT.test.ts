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
    // basic infos
    it("Should has name", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );

      expect(await contract.name()).to.equal("LightNFT", "Can't get name");
    });
    it("Should has symbol", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );

      expect(await contract.symbol()).to.equal("LNFT", "Can't get symbol");
    });
    it("Should supports interface", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );

      expect(await contract.supportsInterface("0x80ac58cd")).to.equal(true, "Can't supports interface");
    });

    // mint
    it("Should mint", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.mint();
      const balance = await contract.balanceOf(owner.address);
      const tokenId = await contract.tokenByIndex(0);
      const ownerOf = await contract.ownerOf(tokenId);
      const ownerTokenId = await contract.tokenOfOwnerByIndex(owner.address, 0);
      const totalSupply = await contract.totalSupply();

      expect(balance).to.equal(1, "Can't mint");
      expect(tokenId).to.equal(1, "Can't mint");
      expect(ownerOf).to.equal(owner.address, "Can't mint");
      expect(ownerTokenId).to.equal(ownerTokenId, "Can't mint");
      expect(totalSupply).to.equal(1, "Can't mint");
    });

    // burn
    it("Should burn", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.mint();
      const tokenId = await contract.tokenByIndex(0);

      await contract.burn(tokenId);

      const balance = await contract.balanceOf(owner.address);
      const totalSupply = await contract.totalSupply();

      expect(balance).to.equal(0, "Can't burn");
      expect(totalSupply).to.equal(0, "Can't burn");
    });
    it("Should burn (approved)", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.mint();
      const tokenId = await contract.tokenByIndex(0);

      await contract.approve(otherAccount.address, tokenId);
      const approved = await contract.getApproved(tokenId);

      const instance = contract.connect(otherAccount);
      await instance.burn(tokenId);

      const balance = await contract.balanceOf(owner.address);
      const totalSupply = await contract.totalSupply();

      expect(balance).to.equal(0, "Can't burn (approved)");
      expect(totalSupply).to.equal(0, "Can't burn (approved)");
      expect(approved).to.equal(otherAccount.address, "Can't burn (approved)");
    });
    it("Should burn (approved for all)", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.mint();
      const tokenId = await contract.tokenByIndex(0);

      await contract.setApprovalForAll(otherAccount.address, true);
      const approved = await contract.isApprovedForAll(
        owner.address,
        otherAccount.address
      );

      const instance = contract.connect(otherAccount);
      await instance.burn(tokenId);

      const balance = await contract.balanceOf(owner.address);
      const totalSupply = await contract.totalSupply();

      expect(balance).to.equal(0, "Can't burn (approved for all)");
      expect(totalSupply).to.equal(0, "Can't burn (approved for all)");
      expect(approved).to.equal(true, "Can't burn (approved for all)");
    });
    it("Should NOT burn (nonexistent)", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await expect(contract.burn(1)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });
    it("Should NOT burn (permission)", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.mint();
      const tokenId = await contract.tokenByIndex(0);

      const instance = contract.connect(otherAccount);

      await expect(instance.burn(tokenId)).to.be.revertedWith(
        "ERC721: caller is not token owner or approved"
      );
    });

    // uri metadata
    it("Should has URI metadata", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.mint();
      const tokenId = await contract.tokenByIndex(0);

      expect(await contract.tokenURI(tokenId)).to.equal(
        "https://light.com.br/ntfs/1.json",
        "Can't get URI metadata"
      );
    });
    it("Should NOT has URI metadata", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );

      await expect(contract.tokenURI(1)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });

    // transfer
    it("Should transfer", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.mint();
      const tokenId = await contract.tokenByIndex(0);

      await contract.transferFrom(owner.address, otherAccount.address, tokenId);

      const balanceFrom = await contract.balanceOf(owner.address);
      const balanceTo = await contract.balanceOf(otherAccount.address);
      const ownerOf = await contract.ownerOf(tokenId);
      const ownerTokenId = await contract.tokenOfOwnerByIndex(
        otherAccount.address,
        0
      );

      expect(balanceFrom).to.equal(0, "Can't transfer");
      expect(balanceTo).to.equal(1, "Can't transfer");
      expect(ownerOf).to.equal(otherAccount.address, "Can't transfer");
      expect(tokenId).to.equal(ownerTokenId, "Can't transfer");
    });
    it("Should NOT transfer (permission)", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.mint();
      const tokenId = await contract.tokenByIndex(0);

      const instance = contract.connect(otherAccount);

      await expect(
        instance.transferFrom(owner.address, otherAccount.address, tokenId)
      ).to.be.revertedWith("ERC721: caller is not token owner or approved");
    });
    it("Should NOT transfer (nonexistent)", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );

      const tokenId = 1;

      await expect(
        contract.transferFrom(owner.address, otherAccount.address, tokenId)
      ).to.be.revertedWith("ERC721: invalid token ID");
    });
    it("Should transfer (approved)", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.mint();
      const tokenId = await contract.tokenByIndex(0);

      await contract.approve(otherAccount.address, tokenId);
      const approved = await contract.getApproved(tokenId);

      const instance = contract.connect(otherAccount);
      await instance.transferFrom(owner.address, otherAccount.address, tokenId);

      const ownerOf = await contract.ownerOf(tokenId);

      expect(ownerOf).to.equal(
        otherAccount.address,
        "Can't transfer (approved)"
      );
      expect(approved).to.equal(
        otherAccount.address,
        "Can't transfer (approved)"
      );
    });
    it("Should transfer (approved for all)", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.mint();
      const tokenId = await contract.tokenByIndex(0);

      await contract.setApprovalForAll(otherAccount.address, true);
      const approved = await contract.isApprovedForAll(
        owner.address,
        otherAccount.address
      );

      const instance = contract.connect(otherAccount);
      await instance.transferFrom(owner.address, otherAccount.address, tokenId);

      const ownerOf = await contract.ownerOf(tokenId);

      expect(ownerOf).to.equal(
        otherAccount.address,
        "Can't transfer (approved for all)"
      );
      expect(approved).to.equal(true, "Can't transfer (approved for all)");
    });
    it("Should transfer and clear approvals", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.mint();
      const tokenId = await contract.tokenByIndex(0);

      await contract.approve(otherAccount.address, tokenId);
      await contract.transferFrom(owner.address, otherAccount.address, tokenId);

      const approved = await contract.getApproved(tokenId);

      expect(approved).to.equal(
        "0x0000000000000000000000000000000000000000",
        "Can't clear approvals"
      );
    });

    // events
    it("Should emit transfer", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.mint();
      const tokenId = await contract.tokenByIndex(0);

      await expect(
        contract.transferFrom(owner.address, otherAccount.address, tokenId)
      )
        .to.emit(contract, "Transfer")
        .withArgs(owner.address, otherAccount.address, tokenId);
    });
    it("Should emit approval", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.mint();
      const tokenId = await contract.tokenByIndex(0);

      await expect(contract.approve(otherAccount.address, tokenId))
        .to.emit(contract, "Approval")
        .withArgs(owner.address, otherAccount.address, tokenId);
    });
    it("Should emit approval for all", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );
      await contract.mint();

      await expect(contract.setApprovalForAll(otherAccount.address, true))
        .to.emit(contract, "ApprovalForAll")
        .withArgs(owner.address, otherAccount.address, true);
    });
  });
});
