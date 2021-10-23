//SPDX-License-Identifier: Apache
pragma solidity ^0.8.0;

import "./Celestial.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// =================================================================================================

enum CelestialKind {
    Planet,     // produces TerrestrialWood
    Asteroid,   // produces IronOre
    Moon        // produces SpaceRaccoon
}

// =================================================================================================

/**
 * The kind and positions of celestial items on the map.
 *
 * This does NOT include many attributes of celestials, which must be queried through their
 * specific contract (e.g. `Planet` for `CelestialKind.Planet`).
 *
 * The reason is that the map is just a flat list (not indexed by position) intended to be used
 * when loading the game.
 */
struct CelestialMapEntry {
    CelestialKind kind;
    uint128 x;
    uint128 y;
}

// =================================================================================================

/**
 * Holds the state of the galaxy: all the celestial objects and their positions.
 */
contract Galaxy is Ownable {

    CelestialMapEntry[] public map;

    mapping (CelestialKind => Celestial) celestialManagers;

    // ---------------------------------------------------------------------------------------------

    function setManager(CelestialKind kind, Celestial manager) external onlyOwner {
        celestialManagers[kind] = manager;
    }

    function addCelestial(CelestialKind kind, uint128 x, uint128 y) external onlyOwner {
        // TODO can create the structure directly in javascript?
        CelestialMapEntry memory entry = CelestialMapEntry(kind, x, y);
        map.push(entry);
        celestialManagers[kind].addedExternally(entry);
    }

    // ---------------------------------------------------------------------------------------------
    // IDs

    // Lets the frontend compute a celestial object ID from its coordinates.
    function getCelestialID(uint x, uint y) pure external returns (uint) {
        return x << 128 + y;
    }

    // Returns the x coordinate of the celestial object given its ID.
    function celestialX(uint celestialID) pure external returns (uint) {
        return celestialID >> 128;
    }

    // Returns the y coordinate of the celestial object given its ID.
    function celestialY(uint celestialID) pure external returns (uint) {
        return (celestialID << 128) >> 128;
    }

    // ---------------------------------------------------------------------------------------------
}
