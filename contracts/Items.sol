//SPDX-License-Identifier: Apache
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// The different kind of resources and items.
enum ItemKind {
    IronOre,
    TerrestrialWood,
    SpaceRaccoon
}

contract Items is ERC1155("https://game.example/api/item/{id}.json"), Ownable  {

    mapping(ItemKind => address) private minters;

    function setMinter(ItemKind kind, address minter) external onlyOwner {
        minters[kind] = minter;
    }

    function mint(address player, ItemKind kind, uint amount, bytes memory data) external {
        require(msg.sender == minters[kind], "wrong minter");
        _mint(player, uint(kind), amount, data);
    }
}