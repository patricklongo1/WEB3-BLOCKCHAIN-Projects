// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19 .0;

import {IJoKenPo} from "./IJoKenPo.sol";
import {JKPLibrary} from "./JKPLibrary.sol";

contract JKPAdapter {
    IJoKenPo private joKenPo;
    address public immutable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function getAddress() external view returns (address) {
        return address(joKenPo);
    }

    function getResult() external view upgraded returns (string memory) {
        return joKenPo.getResult();
    }

    function getBid() external view returns (uint256) {
        return joKenPo.getBid();
    }

    function getCommission() external view returns (uint8) {
        return joKenPo.getCommission();
    }

    function setBid(uint256 newBid) external restricted {
        return joKenPo.setBid(newBid);
    }

    function setCommission(uint8 newCommission) external restricted {
        return joKenPo.setCommission(newCommission);
    }

    function getBalance() external view restricted returns (uint) {
        return joKenPo.getBalance();
    }

    function play(JKPLibrary.Options newChoice) external payable upgraded {
        joKenPo.play{value: msg.value}(newChoice);
    }

    function getLeaderBoard()
        external
        view
        returns (JKPLibrary.Winner[] memory)
    {
        return joKenPo.getLeaderBoard();
    }

    function upgrade(address newImplementation) external restricted {
        require(newImplementation != address(0), "Empty address not permitted");
        joKenPo = IJoKenPo(newImplementation);
    }

    modifier restricted() {
        require(owner == msg.sender, "You do not have permission");
        _;
    }

    modifier upgraded() {
        require(address(joKenPo) != address(0), "Please upgrade first");
        _;
    }
}
