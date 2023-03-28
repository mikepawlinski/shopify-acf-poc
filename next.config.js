const { withFaust, getWpHostname } = require("@faustwp/core");

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withFaust({
  reactStrictMode: true,
  sassOptions: {
    includePaths: ["node_modules"],
  },
  images: {
    domains: [getWpHostname(), "cdn.shopify.com"],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
});
