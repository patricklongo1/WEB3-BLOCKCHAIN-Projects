require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider")

module.exports = {
  plugins: [
    "truffle-plugin-verify",
  ],
  api_keys: {
    bscscan: process.env.BSCSCAN_API_KEY,
  },
  networks: {
    bnbtestnet: {
      provider: new HDWalletProvider({
        mnemonic: {
          phrase: process.env.SECRET,
        },
        providerOrUrl: process.env.BNB_TESTNET_URL
      }),
      network_id: "*",
    },
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
