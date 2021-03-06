//SPDX-License-Identifier: Apache
pragma solidity ^0.8.0;

import "./Celestial.sol";
import "./Galaxy.sol";
import "./Items.sol";

/**
 * A contract inheriting from this abstract contract handles all celestial objects that generate a
 * single kind of resource.
 */
abstract contract ResourceCelestial is Celestial {

    // The Items contract.
    Items ItemsContract;

    // The kind of resource generated by this kind of celestial.
    ItemKind public itemKind;

    // The resource count increase by this amount every block.
    uint8 public accrualRate;

    // Data storage for all celestial of the kind handled by this contract.
    mapping (uint => CelestialData) dataMap;

    constructor(Items _ItemsContract, CelestialKind _kind, ItemKind _itemKind, uint8 _accrualRate)
            Celestial(_kind) {
        ItemsContract = _ItemsContract;
        itemKind = _itemKind;
        accrualRate = _accrualRate;
    }

    function unsafeData(uint celestialID) view internal override returns (CelestialData storage) {
        return dataMap[celestialID];
    }

    function addedExternally(CelestialMapEntry memory mapEntry) external override {
        // NOTE: We do not check for existence here, meaning the galaxy owner can use
        // `Galaxy#addCelestial` to override existing celestials.
        dataMap[getCelestialID(mapEntry.x, mapEntry.y)] = CelestialData(address(0), block.number);
    }

    // Return the block number at which the celestial was last updated.
    function lastUpdate(uint celestialID) view external returns (uint) {
        return data(celestialID).lastUpdate;
    }

    // Returns the amount of resources accrued from this celestial since the last time it was
    // updated (i.e. the last time `collect` was called).
    function accruedResources(address player, uint celestialID) external view returns (uint) {
        CelestialData storage data = data(celestialID);
        require(data.owner == player, "Celestial is not owned by player");
        uint elapsed = block.number - data.lastUpdate;
        return accrualRate * elapsed;
    }

    // Updates the player balance with the resources accrued from this celestial since the last time
    // it was updated (i.e. the last time this method was called).
    function collect(address player, uint celestialID) external {
        CelestialData storage data = data(celestialID);
        require(data.owner == player, "Celestial is not owned by player");
        uint elapsed = block.number - data.lastUpdate;
        uint amount = accrualRate * elapsed;
        data.lastUpdate = block.number;
        // TODO handle reentrancy attack
        ItemsContract.mint(player, itemKind, amount, bytes(""));
    }

    // Build on this celestial, if allowed.
    // Call this stub when overriding this function.
    function build(address player, uint celestialID) public override {
        super.build(player, celestialID);
        dataMap[celestialID] = CelestialData(player, block.number);
    }
}
