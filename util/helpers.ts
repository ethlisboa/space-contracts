import { ethers } from "hardhat";
import {Contract, ContractTransaction} from "ethers";

async function _deploy(contractName: string, verbose: boolean, ...args: any): Promise<Contract> {
  const factory = await ethers.getContractFactory(contractName);
  const contract = await factory.deploy(...args);
  if (verbose)
    console.log(`${contractName} deployed to: ${contract.address}`);
  return contract;
}

export function deploy(contractName: string, ...args: any): Promise<Contract> {
  return _deploy(contractName, false, ...args);
}

export function deployVerbose(contractName: string, ...args: any): Promise<Contract> {
  return _deploy(contractName, true, ...args);
}

export async function deployer(): Promise<string> {
  return (await ethers.getSigners())[0].address;
}

export async function run(txPromise: Promise<ContractTransaction>): Promise<any> {
  const tx = await txPromise;
  return await tx.wait();
}

export function now(): Promise<number> {
  return ethers.provider.getBlockNumber();
}