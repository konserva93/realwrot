const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv');

const isDevelopment = process.env.NODE_ENV === "development";
const env = dotenv.config().parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  entry: path.resolve(__dirname, '..', './src/index.tsx'),
  devtool: 'inline-source-map',
  devServer: { hot: true, port: 5000, historyApiFallback: true },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss', '.svg'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.module\.scss$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: isDevelopment
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment
            }
          }
        ]
      },
      {
        test: /\.scss$/i,
        exclude: /\.module.(scss)$/i,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            }
          }
        ]
      },
    ],
  },
  output: {
    // path: path.resolve(__dirname, 'dist'),!
    path: path.resolve(__dirname, '..', './build'),
    filename: 'bundle.js',
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', './src/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
    }),
    new webpack.ProvidePlugin({
      ...envKeys,
      process: 'process/browser',
    }),
  ],
}
