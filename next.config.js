const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  webpack: function(config, options) {
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 100000,
          name: "[name].[ext]"
        }
      }
    });

    config.module.rules.push({
      test: /\.js$/,
      include: [/node_modules/],
      //include: [/node_modules\/next-i18next/],
      use: [options.defaultLoaders.babel]
    });

    return config;
  },
  presets: ["next/babel"]
});
