import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    quarkdev: {
      accounts: {
        count: 10,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: 3335,
      url: process.env.QUARKTESTNET_URL,
    },
  },
};

export default config;
