import {deployVerbose as deploy,run} from "../util/helpers";
import {CelestialKind, ItemKind} from "../util/enums";

async function main() {
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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
