import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {DeployOptions, TxOptions} from "hardhat-deploy/dist/types";
import {ContractTransaction} from "ethers";
import {ItemKind, CelestialKind} from "../util/enums";

async function run(txPromise: Promise<ContractTransaction>): Promise<any> {
    const tx = await txPromise;
    return await tx.wait();
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy, execute} = deployments;
    const [deployer, player] = await hre.ethers.getSigners();

    // Use this to define the deployer address for real deployment.
    // const {deployer, player} = await getNamedAccounts();

    const txOptions: TxOptions = {
        from: deployer.address,
        autoMine: true,
        log: true
    };

    function depOptions (...args: any): DeployOptions {
        return {
            from: deployer.address,
            autoMine: true,
            log: true,
            args: [... args]
        }
    }

    const Galaxy    = await deploy("Galaxy", depOptions());
    const Items     = await deploy("Items", depOptions());
    const Planet    = await deploy("Planet", depOptions(Items.address));
    const SpaceOven = await deploy("SpaceOven", depOptions(Items.address));

    await execute("Items",  txOptions, "setMinter", ItemKind.TerrestrialWood, Planet.address);
    await execute("Galaxy", txOptions, "setManager", CelestialKind.Planet, Planet.address);

    // add some planets
    await execute("Galaxy", txOptions, "addCelestial", CelestialKind.Planet,  5,  5);
    await execute("Galaxy", txOptions, "addCelestial", CelestialKind.Planet, 10, 10);
    await execute("Galaxy", txOptions, "addCelestial", CelestialKind.Planet, 15, 15);
};
export default func;
func.tags = ['spaceXcalibur'];