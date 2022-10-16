const { ethers } = require("hardhat");

async function main() {

  const CeloNFTFactory = await ethers.getContractFactory("CeloNFT");
  
  // deploy the contract
  const celoNftContract = await CeloNFTFactory.deploy();
  await celoNftContract.deployed();
  
  // print the address of the NFT Contract
  console.log("Celo NFT deployed to:", celoNftContract.address);
  
  
  
  // load the marketplace contract artifacts
  const NFTMarketplaceFactory = await ethers.getContractFactory("NFTMarketplace");
  
  // deploy the contract
  const nftMarketplaceContract = await NFTMarketplaceFactory.deploy();
  await nftMarketplaceContract.deployed();
  
  // print the address of the new marketplace
  console.log("NFT Marketplace deployed to:", nftMarketplaceContract.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
