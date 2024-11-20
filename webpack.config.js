const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.tsx", // Entry point of your app
  output: {
    filename: "bundle.js", // Output bundle
    path: path.resolve(__dirname, "build"), // Output directory
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"], // File extensions to resolve
    fullySpecified: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Process .ts and .tsx files
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/, // Process CSS files
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/, // Process image files
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Path to your source HTML file
    }),
    new NodePolyfillPlugin(), // For polyfilling Node modules
    new webpack.ProvidePlugin({
      process: "process/browser", // For polyfilling process
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    historyApiFallback: true, // Useful for SPAs
    compress: true,
    open: true,
    port: 8080,
    hot: true, // Enable Hot Module Replacement
  },
  mode: "development", // Set mode to development
  target: "web", // Ensure targeting the browser
};
