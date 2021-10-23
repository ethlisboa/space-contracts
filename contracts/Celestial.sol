//SPDX-License-Identifier: Apache
pragma solidity ^0.8.0;

import "./Galaxy.sol";

// =================================================================================================

struct CelestialData {
    address owner;
    uint lastUpdate;
}

// =================================================================================================

/**
 * Contracts inheriting from this handle one kind of celestrial object (planets, space stations,
 * etc...).
 */
abstract contract Celestial {

    event Build(uint128 x, uint128 y, address player, CelestialKind kind);

    CelestialKind public kind;

    constructor (CelestialKind _kind) {
        kind = _kind;
    }

    // Returns the data for the celestial with the given ID.
    // If the celestial doesn't exist (i.e. lastUpdate == 0), returns a zeroed object.
    function unsafeData(uint celestialID) view internal virtual returns (CelestialData storage);

    // Returns the data for the celestial with the given ID.
    // Reverts if the celestial does not exist (i.e. lastUpdate == 0).
    function data(uint celestialID) view internal returns (CelestialData storage) {
        CelestialData storage _data = unsafeData(celestialID);
        require(_data.lastUpdate != 0, "No celestial of this kind with the given ID");
        return _data;
    }

    // Lets the frontend compute a celestial object ID from its coordinates.
    // To query this off-chain, use `Galaxy#getCelestialID`
    function getCelestialID(uint x, uint y) pure internal returns (uint) {
        return x << 128 + y;
    }

    // Returns the x coordinate of the celestial object given its ID.
    // To query this off-chain, use `Galaxy#celestialX`
    function celestialX(uint celestialID) pure internal returns (uint128) {
        return uint128(celestialID >> 128);
    }

    // Returns the y coordinate of the celestial object given its ID.
    // To query this off-chain, use `Galaxy#celestialX`
    function celestialY(uint celestialID) pure internal returns (uint128) {
        return uint128((celestialID << 128) >> 128);
    }

    // Called when a celestial is added by the galaxy owner via `Galaxy#addCelestial`
    function addedExternally(CelestialMapEntry memory mapEntry) external virtual {}

    // Build on this celestial, if allowed.
    // Call this stub when overriding this function - it checks that the celestial is a valid build
    // target and emits the `Build` event.
    function build(address player, uint celestialID) public virtual {
        CelestialData storage _data = data(celestialID);
        require(_data.owner == address(0), "Trying to build on an already-built-on celestial");
        emit Build(celestialX(celestialID), celestialY(celestialID), player, kind);
    }
}

// =================================================================================================