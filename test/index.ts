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

  describe("Player interaction", function () {
    it("Balance starts empty, and accrues resources over time", async function () {
      const player = deployer();

      // deploy contracts
      const Galaxy    = await deploy("Galaxy");
      const Items     = await deploy("Items");
      const Planet    = await deploy("Planet",    Items.address);
      // const Asteroid  = await deploy("Asteroid",  Items.address);
      // const Moon      = await deploy("Moon",      Items.address);
      const SpaceOven = await deploy("SpaceOven", Items.address);

      await run(Items.authorize(Planet.address));
      // await run(Items.authorize(Asteroid.address));
      // await run(Items.authorize(Moon.address));
      await run(Items.authorize(SpaceOven.address));

      await run(Galaxy.setManager(CelestialKind.Planet, Planet.address));
      // await run(Galaxy.setManager(CelestialKind.Asteroid, Asteroid.address));
      // await run(Galaxy.setManager(CelestialKind.Moon, Moon.address));
      await run(Galaxy.setManager(CelestialKind.SpaceOven, SpaceOven.address));

      // add some celestials
      await run(Galaxy.addCelestial(CelestialKind.Planet,     5,  5));
      await run(Galaxy.addCelestial(CelestialKind.SpaceOven, 10, 10));

      // TODO temporary crutch
      await run(SpaceOven.setOwner(player, await Galaxy.getCelestialID(10, 10)));

      // initial balance is 0
      expect(await Items.balanceOf(player, ItemKind.TerrestrialWood)).to.equal(0);

      // build an extractor on an existing planet
      const planetID = await Galaxy.getCelestialID(5, 5);
      await expect(Planet.build(player, planetID))
          // note: also works without the params
          .to.emit(Planet, 'Build(uint128,uint128,address,uint8)');

      async function testCollectWood() {
        const kind = ItemKind.TerrestrialWood;
        const accrualRate = await Planet.accrualRate();
        const lastUpdate  = await Planet.lastUpdate(planetID);
        const lastBalance = (await Items.balanceOf(player, kind)).toNumber();
        await elapseBlocks(3);
        await run(Planet.collect(player, planetID));
        const after = await now();
        expect(await Planet.lastUpdate(planetID)).to.equal(after);
        const newBalance = (await Items.balanceOf(player, kind)).toNumber();
        expect(newBalance).to.equal(lastBalance + accrualRate * (after - lastUpdate));
      }

      // check that we collect the expected amount, and that it works the second time around too
      await testCollectWood();
      await testCollectWood();

      // build an extractor on an existing planet
      const spaceOvenID = await Galaxy.getCelestialID(10, 10);
      // TODO construct the space oven instead

      async function testProduceCharcoal() {
        const input  = ItemKind.TerrestrialWood;
        const output = ItemKind.Charcoal;
        const lastInputBalance  = (await Items.balanceOf(player, input )).toNumber();
        const lastOutputBalance = (await Items.balanceOf(player, output)).toNumber();
        await run(SpaceOven.produce(player, spaceOvenID));
        const newInputBalance  = (await Items.balanceOf(player, input )).toNumber();
        const newOutputBalance = (await Items.balanceOf(player, output)).toNumber();
        // TODO actually lookup the input amount and output amount in the contract and don't hardcode it to one
        expect(newInputBalance).to.equal(lastInputBalance - 1);
        expect(newOutputBalance).to.equal(lastOutputBalance + 1);
      }

      // check that we can convert twice
      await testProduceCharcoal();
      await testProduceCharcoal();
    });
  });
});