// These enums are copied from solidity files and must be kept in sync manually.
// This is a fundamental limitation of typechain (because enum info is not in the ABI).

// From `Items.sol`
export enum ItemKind {
    IronOre,
    TerrestrialWood,
    SpaceRaccoon
}

// From `Galaxy.sol`
export enum CelestialKind {
    Planet,     // produces TerrestrialWood
    Asteroid,   // produces IronOre
    Moon        // produces SpaceRaccoon
}