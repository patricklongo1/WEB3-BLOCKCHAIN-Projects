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
    APP_URL: process.env.APP_URL,
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
  },
}

module.exports = nextConfig
