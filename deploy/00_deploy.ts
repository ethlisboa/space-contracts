import { ContractTransaction } from "ethers";
import { DeployOptions, TxOptions } from "hardhat-deploy/dist/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { CelestialKind, ItemKind } from "../util/enums";

async function run(txPromise: Promise<ContractTransaction>): Promise<any> {
  const tx = await txPromise;
  return await tx.wait();
}

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
  const Items = await deploy("Items", depOptions());
  const Planet = await deploy("Planet", depOptions(Items.address));
  const Asteroid = await deploy("Asteroid", depOptions(Items.address));
  const Moon = await deploy("Moon", depOptions(Items.address));
  const SpaceOven = await deploy("SpaceOven", depOptions(Items.address));

//   await execute("Items", txOptions, "authorize", Planet.address);
//   await execute(
//     "Galaxy",
//     txOptions,
//     "setManager",
//     CelestialKind.Planet,
//     Planet.address
//   );

//   await execute(
//     "Galaxy",
//     txOptions,
//     "setManager",
//     CelestialKind.SpaceOven,
//     SpaceOven.address
//   );

//   await execute(
//     "Galaxy",
//     txOptions,
//     "setManager",
//     CelestialKind.Asteroid,
//     Asteroid.address
//   );
//   await execute(
//     "Galaxy",
//     txOptions,
//     "setManager",
//     CelestialKind.Moon,
//     Moon.address
//   );

  // add some planets
  const map: {
    kind: number;
    x: number;
    y: number;
  }[] = require("../galaxy.json");
  let kinds = [];
  let xs = [];
  let ys = [];
  let i = 0;
  for (const celestial of map) {
    kinds.push(celestial.kind);
    xs.push(celestial.x);
    ys.push(celestial.y);
    if (i === 80) {
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
};
export default func;
func.tags = ["spaceXcalibur"];
