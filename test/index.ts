import { expect } from "chai";
import {deploy, run, deployer, now} from "../util/helpers";
import {ItemKind, CelestialKind} from "../util/enums";

// Initialized before tests run.
let clock: any;

async function elapseBlocks(amount: number) {
  for (let i = 0; i < amount; i++) {
    const tx = await clock.tick();
    await tx.wait();
  }
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