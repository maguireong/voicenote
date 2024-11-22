const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.tsx", // Entry point of your app
  output: {
    filename: "static/js/[name].[contenthash].bundle.js", // Cache-busting filenames
    path: path.resolve(__dirname, "build"), // Output directory
    publicPath: "/", // Ensures correct routing for SPAs
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
        generator: {
          filename: "static/media/[name][ext][query]", // Ensure assets go into static/media
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Path to your source HTML file
      inject: "body", // Inject the script tag for bundle.js at the end of the body
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
    port: 3000,
    hot: true, // Enable Hot Module Replacement
  },
  mode: "development", // Set mode to development
  target: "web", // Ensure targeting the browser
};
