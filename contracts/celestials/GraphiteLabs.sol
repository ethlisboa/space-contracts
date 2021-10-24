//SPDX-License-Identifier: Apache
pragma solidity ^0.8.0;

import "../Galaxy.sol";
import "../Items.sol";
import "../FactoryCelestial.sol";

/** Turns charcoal into graphite. */
contract GraphiteLabs is FactoryCelestial {
    constructor (Items _ItemsContract)
            FactoryCelestial(_ItemsContract, CelestialKind.GraphiteLabs) {
        inputs  .push(FactoryPair(ItemKind.Charcoal, 1));
        outputs .push(FactoryPair(ItemKind.Graphite, 1));
    }
}
