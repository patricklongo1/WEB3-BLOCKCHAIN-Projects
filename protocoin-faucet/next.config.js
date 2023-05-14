const nextConfig = {
  webpack: (config, { isServer }) => {
    // check if config is defined
    if (!config) {
      return config
    }

    // ignore the critical dependency warning on the server-side
    if (isServer) {
      // check if ignoreWarnings is defined
      if (!config.ignoreWarnings) {
        config.ignoreWarnings = []
      }

      config.ignoreWarnings.push({
        message:
          /Critical dependency: the request of a dependency is an expression/,
      })
    }

    return config
  },
  env: {
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    WALLET_ADDRESS: process.env.WALLET_ADDRESS,
    BLOCKCHAIN_NODE_URL: process.env.BLOCKCHAIN_NODE_URL,
    APP_URL: process.env.APP_URL,
  },
}

module.exports = nextConfig