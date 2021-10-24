//SPDX-License-Identifier: Apache
pragma solidity ^0.8.0;

import "../Galaxy.sol";
import "../Items.sol";
import "../ResourceCelestial.sol";

/** An asteroid is a iron-ore-producing celestial. */
contract Asteroid is ResourceCelestial {
    constructor (Items _ItemsContract)
    ResourceCelestial(
        _ItemsContract,
        CelestialKind.Asteroid,
        ItemKind.IronOre,
        1) {}
}