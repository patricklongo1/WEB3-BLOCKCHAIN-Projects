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