import { deploy } from "../util/deployment";

async function main() {
  const items = await deploy("Items");
  const planetOre = await deploy("PlanetOre", items.address);
  await items.setMinter(0, planetOre.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
