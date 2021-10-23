import { expect } from "chai";
import { ethers } from "hardhat";
import {Contract, ContractTransaction, utils} from "ethers";
import { deploy, deployer } from "../util/deployment";

// Initialized before tests run.
let clock: any;

async function run(txPromise: Promise<ContractTransaction>): Promise<any> {
  const tx = await txPromise;
  return await tx.wait();
}

async function elapseBlocks(amount: number) {
  for (let i = 0; i < amount; i++) {
    const tx = await clock.tick();
    await tx.wait();
  }
}

function now(): Promise<number> {
  return ethers.provider.getBlockNumber();
}

// This is copied from `Items.sol` and must be kept in sync manually.
// This is a fundamental limitation of typechain (because enum info is not in the ABI).
enum ItemKind {
  IronOre,
  TerrestrialWood,
  SpaceRaccoon
}

// This is copied from `Galaxy.sol` and must be kept in sync manually.
enum CelestialKind {
  Planet,     // produces TerrestrialWood
  Asteroid,   // produces IronOre
  Moon        // produces SpaceRaccoon
}

function balance(Items: Contract, player: string, itemKind: ItemKind): Promise<number> {
  return Items.balanceOf(player, ItemKind.TerrestrialWood);
}

describe("Tests", function () {
  before(async function () {
    clock = await deploy("Clock");
  });

  describe("Scaffolding", function (){
    it("Is able to elapse blocks in hardhat", async function () {
      const elapse = 3;
      const before = await now();
      await elapseBlocks(elapse);
      let after = await now();
      expect(after).to.equal(before + elapse);
    })
  });

  describe("PlanetOre", function () {
    it("Balance starts empty, and accrues resources over time", async function () {
      const player = deployer();

      // deploy contracts
      const Galaxy = await deploy("Galaxy");
      const Items  = await deploy("Items");
      const Planet = await deploy("Planet", Items.address);
      await run(Items.setMinter(ItemKind.TerrestrialWood, Planet.address));
      await run(Galaxy.setManager(CelestialKind.Planet, Planet.address));

      // add some planets
      await run(Galaxy.addCelestial(CelestialKind.Planet,  5,  5));
      await run(Galaxy.addCelestial(CelestialKind.Planet, 10, 10));
      await run(Galaxy.addCelestial(CelestialKind.Planet, 15, 15));

      // initial balance is 0
      expect(await Items.balanceOf(player, ItemKind.TerrestrialWood)).to.equal(0);

      // build an extractor on an existing planet
      const celestialID = await Galaxy.getCelestialID(5, 5);

      await expect(Planet.build(player, celestialID))
          // note: also works without the params
          .to.emit(Planet, 'Build(uint128,uint128,address,uint8)');

      async function test (kind: ItemKind) {
        const accrualRate = await Planet.accrualRate();
        const lastUpdate  = await Planet.lastUpdate(celestialID);
        const lastBalance = (await Items.balanceOf(player, kind)).toNumber();
        await elapseBlocks(3);
        await run(Planet.collect(player, celestialID));
        const after = await now();
        expect(await Planet.lastUpdate(celestialID)).to.equal(after);
        const newBalance = (await Items.balanceOf(player, kind)).toNumber();
        expect(newBalance).to.equal(lastBalance + accrualRate * (after - lastUpdate));
      }

      // check that we collect the expected amount
      await test(ItemKind.TerrestrialWood);
      // check that it works the second time around too
      await test(ItemKind.TerrestrialWood);
    });
  });
});