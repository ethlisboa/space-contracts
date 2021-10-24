//SPDX-License-Identifier: Apache
pragma solidity ^0.8.0;

import "../Galaxy.sol";
import "../Items.sol";
import "../FactoryCelestial.sol";

/** Turns graphite into diamonds. */
contract DiamondCuttingStation is FactoryCelestial {
    constructor (Items _ItemsContract)
            FactoryCelestial(_ItemsContract, CelestialKind.DiamondCuttingStation) {
        inputs  .push(FactoryPair(ItemKind.Graphite,    1));
        outputs .push(FactoryPair(ItemKind.PureDiamond, 1));
    }
}
