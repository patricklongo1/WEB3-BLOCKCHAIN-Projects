/**
 *Submitted for verification at Etherscan.io on 2022-11-04
 */

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19.0;

interface IJoKenPo {
    enum Options {
        NONE,
        ROCK,
        PAPER,
        SCISSORS
    } //0, 1, 2, 3

    struct Winner {
        address wallet;
        uint32 wins;
    }

    function getResult() external view returns (string memory);

    function getBid() external view returns (uint256);

    function getCommission() external view returns (uint8);

    function setBid(uint256 newBid) external;

    function setCommission(uint8 newCommission) external;

    function getBalance() external view returns (uint);

    function play(Options newChoice) external payable;

    function getLeaderBoard() external view returns (Winner[] memory);
}
