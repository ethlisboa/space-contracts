import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    optimistic: {
      url: 'https://optimism-kovan.infura.io/v3/31bd29e4b354453e8a56f1153804c30c',
      chainId: 69,
      // 0xCAFED9eF335b3d3ccC3826D659B1666b73E20132
      accounts: [process.env.PRIVATE_KEY as string]
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0, // first account
    },
    feeCollector:{
    default: 1, // here this will by default take the second account as feeCollector (so in the test this will be a different account than the deployer)
          1: '0xa5610E1f289DbDe94F3428A9df22E8B518f65751', // on the mainnet the feeCollector could be a multi sig
          4: '0xa250ac77360d4e837a13628bC828a2aDf7BabfB3', // on rinkeby it could be another account
    }
  }
};

export default config;
