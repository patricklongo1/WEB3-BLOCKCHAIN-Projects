import { ethers } from "hardhat";

async function main() {
  const LightNFT = await ethers.getContractFactory("LightNFT");
  const contract = await LightNFT.deploy();

  await contract.deployed();

  console.log(
    `Contract was deployed at ${contract.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
