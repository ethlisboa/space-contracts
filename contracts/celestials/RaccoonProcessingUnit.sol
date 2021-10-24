//SPDX-License-Identifier: Apache
pragma solidity ^0.8.0;

import "../Galaxy.sol";
import "../Items.sol";
import "../FactoryCelestial.sol";

/** Turns raccoons into raccoon leather. */
contract RaccoonProcessingUnit is FactoryCelestial {
    constructor (Items _ItemsContract)
            FactoryCelestial(_ItemsContract, CelestialKind.RaccoonProcessingUnit) {
        inputs  .push(FactoryPair(ItemKind.SpaceRaccoon,   1));
        outputs .push(FactoryPair(ItemKind.RaccoonLeather, 1));
    }
}
