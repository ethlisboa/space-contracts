//SPDX-License-Identifier: Apache
pragma solidity ^0.8.0;

import "../Galaxy.sol";
import "../Items.sol";
import "../ResourceCelestial.sol";

/** A moon is a raccoon-producing celestial. */
contract Moon is ResourceCelestial {
    constructor (Items _ItemsContract)
    ResourceCelestial(
        _ItemsContract,
        CelestialKind.Moon,
        ItemKind.SpaceRaccoon,
        1) {}
}