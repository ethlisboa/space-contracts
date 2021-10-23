//SPDX-License-Identifier: Apache
pragma solidity ^0.8.0;

import "./Galaxy.sol";
import "./Items.sol";
import "./ResourceCelestial.sol";

/** A planet is a wood-producing celestial. */
contract Planet is ResourceCelestial {
    constructor (Items _ItemsContract)
        ResourceCelestial(
            _ItemsContract,
            CelestialKind.Planet,
            ItemKind.TerrestrialWood,
            1) {}
}
