import { expect, util } from "chai";
import { ethers } from "hardhat";
import { deploy, deployer } from "../util/deployment";

const clockPromise = deploy("Clock");

// TODO what's the type of the transaction?
async function run(txPromise: Promise<any>) {
  const tx = await txPromise;
  return await tx.wait();
}

async function elapseBlocks(amount: number) {
  const clock = await clockPromise;
  for (let i = 0; i < amount; i++) {
    const tx = await clock.tick();
    await tx.wait();
  }
}

function now(): Promise<number> {
  return ethers.provider.getBlockNumber();
}


describe("PlanetOre", function () {
  it("Balance starts empty, and accrues ore over time", async function () {
    const player = deployer();
    const ore = 0;

    // deploy contracts
    const items = await deploy("Items");
    const planetOre = await deploy("PlanetOre", items.address);
    await run(items.setMinter(ore, planetOre.address));

    // initial balance is 0
    expect(await items.balanceOf(player, ore)).to.equal(0);

    // build an extractor on the an arbitrary planet
    const planetID = await planetOre.getPlanetID(42, 66);
    await run(planetOre.build(player, planetID));

    // elapse given number of blocks, and check it worked
    const elapse = 3;
    const before = await now();
    await elapseBlocks(elapse);
    let after = await now();
    expect(after).to.equal(before + elapse);

    // check that we collect the expected amount (accrual rate is 1)
    const lastUpdate = await planetOre.lastUpdate(planetID);
    await run(planetOre.collect(player, planetID));
    after = await now();
    expect(await planetOre.lastUpdate(planetID)).to.equal(after);
    expect(await items.balanceOf(player, ore)).to.equal(after - lastUpdate);

    // TODO check that we can do this again after the first update
  });
});
