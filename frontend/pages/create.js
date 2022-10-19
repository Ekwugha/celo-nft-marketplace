import { Contract } from "ethers";
import { isAddress, parseEther } from "ethers/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useSigner, erc721ABI } from "wagmi";
import MarketplaceABI from "../abis/NFTMarketplace.json";
import Navbar from "../components/Navbar";
import styles from "../styles/Create.module.css";
import { MARKETPLACE_ADDRESS } from "../constants";


export default function Create() {
    // State variables to contain information about the NFT being sold
    const [nftAddress, setNftAddress] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [showListingLink, setShowListingLink] = useState(false);

    // get signer from wagmi
    const { data: signer } = useSigner();

    // Main function to be called when 'Create' button is clicked
    async function handleCreateListing() {
        // set loading status to true
        setLoading(true);

        try {
            // make sure contract address is a valid address
            const isValidAddress = isAddress(nftAddress);
            if (!isValidAddress) {
                throw new Error(`Invalid contract address`);
            }

            // request approval over NFTs if required, then create listing
            await requestApproval();
            await createListing();

            // start displaying a button to view the NFT details
            setShowListingLink(true);
            
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    }



    // Function to check if NFT approval is required
    async function requestApproval() {
        // get signers address
        const address = await signer.getAddress();
        
        // initialize a contract instance for the NFT contract
        const ERC721Contract = new Contract(nftAddress, erc721ABI, signer);

        // make sure user is owner of the NFT in question
        const tokenOwner = await ERC721Contract.ownerOf(tokenId);
        if (tokenOwner.toLowerCase() !== address.toLowerCase()) {
            throw new Error(`You do not own the NFT`);
        }

        // check if user already gave approval to the marketplace
        const isApproved = await ERC721Contract.isApprovedForAll(address, MARKETPLACE_ADDRESS);
        if(!isApproved) {
            console.log("Requesting approval over NFTs...");

            // send approval transaction to NFT contract
            const approvalTxn = await ERC721Contract.setApprovalForAll(MARKETPLACE_ADDRESS, true);
            await approvalTxn.wait();
        }
    }


    // function to 'createListing' in the marketplace contract
    async function createListing() {
        // initialize an instance of the marketplace contract
        const MarketplaceContract = new Contract(MARKETPLACE_ADDRESS, MarketplaceABI, signer);

        // send the create listing transaction
        const createListingTxn = await MarketplaceContract.createListing(nftAddress, tokenId, parseEther(price));
        await createListingTxn.wait();
    }




    return (
        <>
          {/* Show the navigation bar */}
          <Navbar />
    
          {/* Show the input fields for the user to enter contract details */}
          <div className={styles.container}>
            <input
              type="text"
              placeholder="NFT Address 0x..."
              value={nftAddress}
              onChange={(e) => setNftAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="Token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Price (in CELO)"
              value={price}
              onChange={(e) => {
                if (e.target.value === "") {
                  setPrice("0");
                } else {
                  setPrice(e.target.value);
                }
              }}
            />
            {/* Button to create the listing */}
            <button onClick={handleCreateListing} disabled={loading}>
              {loading ? "Loading..." : "Create"}
            </button>
    
            {/* Button to take user to the NFT details page after listing is created */}
            {showListingLink && (
              <Link href={`/${nftAddress}/${tokenId}`}>
                <a>
                  <button>View Listing</button>
                </a>
              </Link>
            )}
          </div>
        </>
    );







}