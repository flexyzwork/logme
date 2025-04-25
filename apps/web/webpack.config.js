// webpack.config.js
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin')
// for webpack 5.1 and webpack compatible environments
// const { sentryWebpackPlugin } = require("@sentry/webpack-plugin/webpack5");

module.exports = {

  devtool: 'source-map', // Source map generation must be turned on
  plugins: [
    sentryWebpackPlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,

      // Auth tokens can be obtained from https://sentry.io/orgredirect/organizations/:orgslug/settings/auth-tokens/
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
}
