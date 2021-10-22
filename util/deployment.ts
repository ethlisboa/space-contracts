import { ethers } from "hardhat";
import { Contract } from "ethers";

export async function deploy(contractName: string, ...args: any): Promise<Contract> {
  const factory = await ethers.getContractFactory(contractName);
  const contract = await factory.deploy(...args);
  console.log(`${contractName} deployed to: ${contract.address}`);
  return contract;
}

export async function deployer(): Promise<string> {
  return (await ethers.getSigners())[0].address;
}
