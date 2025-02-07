module.exports = {
    // Other webpack configurations...
    ignoreWarnings: [
      (warning) =>
        warning.message.includes("Failed to parse source map") &&
        warning.module?.resource?.includes("node_modules/react-datepicker"),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: "pre",
          loader: "source-map-loader",
          exclude: [/node_modules\/react-datepicker/], // Ignore source map warnings for react-datepicker
        },
      ],
    },
}  