//SPDX-License-Identifier: Apache
pragma solidity ^0.8.0;

import "./Items.sol";
import "./PlanetResource.sol";

contract PlanetOre is PlanetResource {
    constructor (Items _Items) PlanetResource(_Items, 1) {}
}
