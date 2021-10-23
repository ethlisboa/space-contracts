//SPDX-License-Identifier: Apache
pragma solidity ^0.8.0;

import "./Galaxy.sol";
import "./Items.sol";
import "./FactoryCelestial.sol";

/** A planet is a wood-producing celestial. */
contract SpaceOven is FactoryCelestial {
    constructor (Items _ItemsContract)
            FactoryCelestial(_ItemsContract, CelestialKind.SpaceOven) {
        inputs  .push(FactoryPair(ItemKind.TerrestrialWood, 1));
        outputs .push(FactoryPair(ItemKind.Charcoal,        1));
    }
}
