//SPDX-License-Identifier: Apache
pragma solidity ^0.8.0;

import "../Galaxy.sol";
import "../Items.sol";
import "../FactoryCelestial.sol";

/** Turns iron ore into black steel. */
contract CyberFoundry is FactoryCelestial {
    constructor (Items _ItemsContract)
            FactoryCelestial(_ItemsContract, CelestialKind.CyberFoundry) {
        inputs  .push(FactoryPair(ItemKind.IronOre,    1));
        outputs .push(FactoryPair(ItemKind.BlackSteel, 1));
    }
}
