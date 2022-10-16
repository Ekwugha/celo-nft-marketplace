// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CeloNFT is ERC721 {
    constructor() ERC721("CeloNFT", "cNFT") {
        // minting 5 NFTs to myself
        for (uint i = 0; i < 5; i++) {
            _mint(msg.sender, i);
        }
    }

    // Hardcoded token URI will return the same metadata for each NFT
    function tokenURI(uint) public pure override returns (string memory) {
        return "ipfs://QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb";
    }
}


// contract ezeynftFactory is ERC721 {
//     constructor(string memory name, string memory symbol, string memory tokenURI, uint tokenID) 
//      ERC721(name,symbol)
//     {
//         _mint(msg.sender, tokenID); // `_mint()` instead of `_safeMint()`
//         _setTokenURI(tokenID,tokenURI);
//     }
// }


