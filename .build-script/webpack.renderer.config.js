'use strict'

process.env.BABEL_ENV = 'renderer'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')
const fs = require('fs')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const TerserPlugin = require('terser-webpack-plugin')
/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
let whiteListedModules = ['vue']
const pagesDirPath = path.join(__dirname, '../src/renderer/apps')
const templatePath = path.resolve(__dirname, '../src/index.ejs')

/**
 * add [name].js and [name].vue for every browserwindow pages
 */
const getEntries = () => {
  let result = fs.readdirSync(pagesDirPath)
  let entry = {}
  result.forEach(item => {
    if (path.extname(item).indexOf('.js') >= 0) {
      entry[`${path.basename(item, path.extname(item))}`] = path.resolve(
        __dirname,
        `${pagesDirPath}/${item}`
      )
    }
  })
  return entry
}

/**
 *
 * Scan apps floder, generate html plugin for every page
 */
const generatorHtmlWebpackPlugins = () => {
  const arr = []
  let result = fs.readdirSync(pagesDirPath)
  result.forEach(item => {
    if (path.extname(item).indexOf('.js') >= 0) {
      let name = path.basename(item, path.extname(item))
      arr.push(
        new HtmlWebpackPlugin({
          template: templatePath,
          filename: `${name}.html`,
          minify: {
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true
          },
          chunks: [name],
          isBrowser: false,
          isDevelopment: process.env.NODE_ENV !== 'production',
          nodeModules:
            process.env.NODE_ENV !== 'production'
              ? path.resolve(__dirname, '../node_modules')
              : false
        })
      )
    }
  })
  return arr
}

let rendererConfig = {
  // devtool: 'eval-cheap-module-source-map',
  devtool: 'eval',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        test: /\.js(\?.*)?$/i
      })
    ]
  },
  entry: getEntries(),
  externals: [
    ...Object.keys(dependencies || {}).filter(d => !whiteListedModules.includes(d))
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.sass$/,
        use: [
          // 'vue-style-loader',
          // MiniCssExtractPlugin.loader,
          process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          // 'vue-style-loader',
          // MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          // 'vue-style-loader',
          // MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: ['node-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'imgs/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'media/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.md$/,
        type: 'asset/source'
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    new VueLoaderPlugin(),
    ...generatorHtmlWebpackPlugins(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].css' })
  ],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node', '.scss', '.sass']
  },
  target: 'electron-renderer'
}

/**
 * Adjust rendererConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      __static: `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
}

/**
 * Adjust rendererConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  rendererConfig.devtool = 'eval'
  let definePlugin = {
    'process.env.NODE_ENV': '"production"'
  }
  rendererConfig.plugins.push(
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../static'),
        to: path.join(__dirname, '../dist/electron/static'),
        ignore: ['.*']
      }
    ]),
    new webpack.DefinePlugin(definePlugin),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  )
  // rendererConfig.plugins.push(new MiniCssExtractPlugin({ filename: '[name].css' }))
}

module.exports = rendererConfig
