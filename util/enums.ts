// These enums are copied from solidity files and must be kept in sync manually.
// This is a fundamental limitation of typechain (because enum info is not in the ABI).

// From `Items.sol`
export enum ItemKind {
  // Resources
  IronOre,
  TerrestrialWood,
  SpaceRaccoon,
  // Factory-produced items
  Charcoal,
  Graphite,
  PureDiamonds,
  BlackSteel,
  RaccoonLeather,
  SaberHandle,
  EnergyCrystal,
  // Found items
  EpicOpal,
}

// From `Galaxy.sol`
export enum CelestialKind {
  Planet, // produces TerrestrialWood
  Asteroid, // produces IronOre
  Moon, // produces SpaceRaccoon
  SpaceOven, // produces Charcoal
  GraphiteLabs, // produces Graphite
  DiamondCuttingStation, // produces PureDiamonds
  CyberFoundry, // produces BlackSteel
  RaccoonProcessingUnit, // produces RaccoonLeather
}
