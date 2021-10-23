# SpaceXcalibur Contracts

[![GitHub](https://img.shields.io/github/license/ethlisboa/space-contracts)](LICENSE)
![GitHub top language](https://img.shields.io/github/languages/top/ethlisboa/space-contracts)
![Lines of code](https://img.shields.io/tokei/lines/github/ethlisboa/space-contracts)
![Amazing!](https://img.shields.io/badge/this%20repository%20is-amazing-ff69b4)
[![Discord](https://img.shields.io/discord/894647872543400047?label=discord)](https://discord.gg/WQT8BKXk9N)

The optimistic Solidity smart contracts for SpaceXcalibur. 

- Install with `npm install`
- Test with `npx hardhat test`
- Deploy to local network with `npx hardhat deploy --network localhost`
- Deploy to Optimistic Kovan testnet with `npx hardhat deploy --network optimistic`

## Architecture

The game map contains "celestials" (celestial objects). Each kind of celestial object is managed
by a contract. The contract hierarchy is:

- `Celestial` - common ancestor for all celestials
  - `ResourceCelestial` - ancestor for celestials that generate resources to be collected
    - `Planet` - generates terrestrial wood

The contract for a specific kind of celestial (e.g. `Planet`) stores the data for all celestials
of that particular kind. It also lets player interact with the celestial. In the case of `Planet`,
the player can build an extractor on the planet (to generate terrestrial wood) and then collect
the accrued wood at a later point in time.

The `Items` contract implements EIP-1155 (multi-tokens) and holds player balances for every resource
and items in the game.

The `Galaxy` contract lists all existing celestials — it's used to load the game map for players.
These celestials are not indexed in any way, their attributes are stored in the contract for
their specific kind.

## Events

- `event Build(uint128 x, uint128 y, address player, CelestialKind kind);`
  - signature: `Build(uint128, uint128, address, uint8)` 
  - emitted whenever a building is built on a celestial (currently: building extractors on resource celestials)
