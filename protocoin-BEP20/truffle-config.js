const HDWalletProvider = require('@truffle/hdwallet-provider');

require('dotenv').config();
module.exports = {
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    bscscan: process.env.BSCSCAN_API_KEY
  },
  networks: {
    bsctest: {
      provider: new HDWalletProvider({
        mnemonic: {
          phrase: process.env.SECRET
        },
        providerOrUrl: process.env.BNB_TESTNET_URL
      }),
      network_id: "97"
    },
  },
  compilers: {
    solc: {
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};