// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19.0;

import { IJoKenPo } from  "./IJoKenPo.sol";

contract JKPAdapter {
  IJoKenPo private joKenPo;
  address public immutable owner;

  constructor() {
        owner = payable(msg.sender);
    }

    function upgrade(address newImplementation) external {
      require(msg.sender == owner, "You dont have permission");
      require(newImplementation != address(0), "Empty address not permitted");
      joKenPo = IJoKenPo(newImplementation);
    }
}