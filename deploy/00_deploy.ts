import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { DeployOptions, TxOptions } from "hardhat-deploy/dist/types";
import { CelestialKind } from "../util/enums";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  const txOptions: TxOptions = {
    from: deployer,
    autoMine: true,
    log: true,
  };

  function depOptions(...args: any): DeployOptions {
    return {
      from: deployer,
      autoMine: true,
      log: true,
      args: [...args],
    };
  }

  const Galaxy = await deploy("Galaxy", depOptions());
  const Items  = await deploy("Items",  depOptions());

  // deploy celestial contract and set authorizations
  const celestialNames = [
      "Planet", "Asteroid", "Moon", "SpaceOven", "CyberFoundry", "GraphiteLabs",
      "DiamondCuttingStation", "RaccoonProcessingUnit"];

  for (let name of celestialNames) {
    const contract = await deploy(name, depOptions(Items.address));
    await execute("Items", txOptions, "authorize", contract.address);
    await execute("Galaxy", txOptions, "setManager",
        CelestialKind[name as keyof typeof CelestialKind], contract.address);
  }

  // add some planets
  const map: {kind: number; x: number; y: number}[] = require("../galaxy.json");
  let kinds = [];
  let xs = [];
  let ys = [];
  let i = 0;
  for (const celestial of map) {
    kinds.push(celestial.kind);
    xs.push(celestial.x);
    ys.push(celestial.y);
    if (i === 50) {
      await execute("Galaxy", txOptions, "addCelestials", kinds, xs, ys);
      i = 0;
      kinds = [];
      xs = [];
      ys = [];
      continue;
    }
    i++;
  }
  if (kinds.length > 0) {
    await execute("Galaxy", txOptions, "addCelestials", kinds, xs, ys);
  }

  // add some planets
  // await execute("Galaxy", txOptions, "addCelestial", CelestialKind.Planet, 5, 5);
  // await execute("Galaxy", txOptions, "addCelestial", CelestialKind.Planet, 10, 10);
  // await execute("Galaxy", txOptions, "addCelestial", CelestialKind.SpaceOven, 15, 15);
  // await execute("Galaxy", txOptions, "addCelestial", CelestialKind.SpaceOven, 20, 20);
};
export default func;
func.tags = ["spaceXcalibur"];
