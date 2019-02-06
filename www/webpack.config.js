const dev = process.env.NODE_ENV !== 'production';
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: dev ? 'development' : 'production',
    context: path.join(__dirname, 'src'),
    devtool: dev ? 'source-map' : 'none',
    node: {
      fs: "empty"
    },
    entry: {
      bundle: ['@babel/polyfill', './client.js']
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all"
          }
        }
      }
    },
    resolve: {
      modules: [
        path.resolve(__dirname, './src'),
        'node_modules'
      ]
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader'
        },
        {
          test: /\.scss$/,
          use: [
            dev ? 'style-loader' : {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: './dist'
              }
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[hash:base64:5]',
              }
            },
            'sass-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [
            dev ? 'style-loader' : {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: './dist'
              }
            },
            {
              loader: 'css-loader'
            },
            'postcss-loader'
          ]
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      chunkFilename: '[name].js'
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
        allChunks: true,
        minify: true
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [ autoprefixer() ]
        }
      }),
      new Dotenv()
    ]
  };