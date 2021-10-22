//SPDX-License-Identifier: Apache
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Items is ERC1155 {
    enum Type {
        Ore,
        Ingot
    }

    constructor() ERC1155("https://game.example/api/item/{id}.json") {}
}
