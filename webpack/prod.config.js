const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const IsomorphicPlugin = require('webpack-isomorphic-tools/plugin');
const strip = require('strip-loader');
const BabiliPlugin = require('babili-webpack-plugin');

const isomorphicToolsConfig = require('./isomorphic-tools-configuration');

const webpackIsomorphicToolsPlugin = new IsomorphicPlugin(
  isomorphicToolsConfig
);

const relativeAssetsPath = '../static/dist';
const assetsPath = path.join(__dirname, relativeAssetsPath);

module.exports = {
  output: {
    path: assetsPath,
    publicPath: process.env.USE_LOCAL_ASSETS
      ? '/public/'
      : '//assets-1f14.kxcdn.com/',
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash]-chunk.js',
    sourceMapFilename: '[name]-[chunkhash].map.js'
  },
  context: path.resolve(__dirname, '../src'),
  devtool: 'cheap-module-source-map',
  target: 'web',
  cache: false,
  entry: ['./client.js'],
  stats: {
    colors: true,
    reasons: false
  },
  resolve: {
    extensions: ['.js'],
    modules: ['src', 'node_modules']
  },
  module: {
    rules: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          strip.loader('debug'),
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                ['es2015', { modules: false }],
                'stage-2',
                'react',
                'react-optimize'
              ],
              plugins: [
                'transform-runtime',
                // 'add-module-exports',
                'transform-decorators-legacy',
                'transform-react-display-name',
                'syntax-dynamic-import'
              ]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /\.global.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader?minimize&modules&importLoaders=2&sourceMap!autoprefixer-loader?browsers=last 2 version!sass-loader?outputStyle=compressed&sourceMap=true&sourceMapContents=true' // eslint-disable-line max-len
        })
      },
      {
        test: /\.global.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader?minimize&importLoaders=2&sourceMap!autoprefixer-loader?browsers=last 2 version!sass-loader?outputStyle=compressed&sourceMap=true&sourceMapContents=true' // eslint-disable-line max-len
        })
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?name=images/[name].[ext]&limit=10000&mimetype=image/svg+xml'
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader?name=images/[name].[ext]&limit=10240'
      }
    ]
  },
  plugins: [
    new CleanPlugin([relativeAssetsPath]),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'windows.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.SEGMENTS_KEY': JSON.stringify(process.env.SEGMENTS_KEY),
      'process.env.SENTRY_KEY_CLIENT': JSON.stringify(
        process.env.SENTRY_KEY_CLIENT
      ),
      'process.env.SENTRY_KEY_SERVER': JSON.stringify(
        process.env.SENTRY_KEY_SERVER
      ),
      'process.env.FACEBOOK_APP_ID': JSON.stringify(
        process.env.FACEBOOK_APP_ID
      ),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env': {
        NODE_ENV: JSON.stringify('production') // for reach
      },
      __SERVER__: false,
      __CLIENT__: true,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new ExtractTextPlugin({ filename: '[name]-[hash].css', allChunks: true }),

    // Optimizations
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      minimize: true
    }),

    new webpack.LoaderOptionsPlugin({
      test: /\.css$/, // optionally pass test, include and exclude, default affects all loaders
      minimize: true,
      debug: true
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0
    }),
    /**
     * Babli is an ES6+ aware minifier based on the Babel toolchain (beta)
     */
    new BabiliPlugin(),
    webpackIsomorphicToolsPlugin
  ]
};
