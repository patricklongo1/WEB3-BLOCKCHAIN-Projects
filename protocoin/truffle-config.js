require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider")

module.exports = {
  plugins: [
    "truffle-plugin-verify",
  ],
  api_keys: {
    sepolia_etherscan: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    sepolia: {
      provider: new HDWalletProvider({
        mnemonic: {
          phrase: process.env.SECRET,
        },
        providerOrUrl: process.env.INFURA_SEPOLIA_URL
      }),
      network_id: "*",
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    }
  },
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
