const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');

const pkg = require('../package.json');

function resolvePath(dir) {
  return path.join(__dirname, '..', dir);
}

const env = process.env.NODE_ENV || 'development';
const target = process.env.TARGET || 'web';

module.exports = {
  mode: env,
  entry: [
    './src/app.js',
  ],
  output: {
    path: resolvePath('www'),
    filename: 'app.js',
    publicPath: '',
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolvePath('src'),
    },
  },
  devtool: env === 'production' ? false : 'eval',
  devServer: {
    hot: true,
    open: true,
    compress: true,
    contentBase: '/www/',
    disableHostCheck: true,
    watchOptions: {
      poll: 1000,
    },
  },
  optimization: {
    minimizer: [new TerserPlugin({
      sourceMap: true,
    })],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        include: [
          resolvePath('src'),
        ],
      },

      {
        test: /\.css$/,
        use: [
          (env === 'development' ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          }),
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(svg|png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1000 * 1000,
          name: '[path][name].[ext]',
          context: path.resolve(__dirname, '../src'),
        },
      },
      {
        test: /\.(bin)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 20 * 1000 * 1000,
          name: '[path][name].[ext]',
          context: path.resolve(__dirname, '../src'),
        },
      },
      {
        test: /\.(m4v|mp4|webm|ogg|mp3|wav|flac|aac|m4a)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 20 * 1000 * 1000,
          name: '[path][name].[ext]',
          context: path.resolve(__dirname, '../src'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 20 * 1000 * 1000,
          name: '[path][name].[ext]',
          context: path.resolve(__dirname, '../src'),
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.TARGET': JSON.stringify(target),
      'process.env.APP_VERSION': JSON.stringify(pkg.appVersion),
      'process.env.APP_BUILD': JSON.stringify(pkg.appBuild),
    }),
    ...(env === 'production' ? [
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true,
          map: false,
        },
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
    ] : [
      // Development only plugins
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
    ]),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './src/index.html',
      inject: true,
      minify: env === 'production' ? {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      } : false,
    }),
    new MiniCssExtractPlugin({
      filename: 'app.css',
    }),
    new CopyWebpackPlugin([
      {
        from: resolvePath('src/iframe.html'),
        to: resolvePath('www/iframe.html'),
      },
    ]),
    ...(env === 'production' ? [
      // Make sure that the plugin is after any plugins that add images, example `CopyWebpackPlugin`
      new ImageminPlugin({
        bail: false, // Ignore errors on corrupted images
        cache: true,
        // filter(buffer, path) {
        //   if (path && path.indexOf('solar-system/src/models') >= 0) return false;
        //   return true;
        // },
        // loader: false,
        imageminOptions: {
          plugins: [
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }],
          ],
        },
      }),
    ] : []),
  ],
};
