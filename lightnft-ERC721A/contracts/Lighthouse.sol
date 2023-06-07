// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "../node_modules/erc721a/contracts/ERC721A.sol";

contract Lighthouse is ERC721A {
    address payable private _owner;

    constructor() ERC721A("Lighthouse", "LTH") {
        _owner = payable(msg.sender);
    }

    function mint(uint256 quantity) external onlyOwner {
        _mint(msg.sender, quantity);
    }

    function burn(uint256 tokenId) external {
        super._burn(tokenId, true);
    }

    function burnMultiple(uint256[] memory tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            super._burn(tokenIds[i], true);
        }
    }

    /* function withdraw() external {
        require(msg.sender == _owner, "You do not have permission");
        uint256 amount = address(this).balance;
        (bool success, ) = _owner.call{value: amount}("");
        require(success == true, "Failed to withdraw");
    } */

    function _baseURI() internal pure override returns (string memory) {
        return "https://light.com.br/ntfs/";
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721A) returns (string memory) {
        return string.concat(super.tokenURI(tokenId), ".json");
    }

    modifier onlyOwner() {
        require(
            msg.sender == _owner,
            "Only the contract owner can call this function"
        );
        _;
    }
}
