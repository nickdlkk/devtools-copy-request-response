const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    background: path.resolve(__dirname, 'src/background.ts'),
    content: path.resolve(__dirname, 'src/content.ts'),
    devtool: path.resolve(__dirname, 'src/devtools.ts'),
    popup: path.resolve(__dirname, 'src/popup.ts'),
    panel: path.resolve(__dirname, 'src/panel.ts')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    module: true,
  },
  experiments: {
    outputModule: true,
  },
  devtool: 'source-map',
  optimization: {
    minimize: false, // 暂时禁用压缩
    usedExports: true,
    innerGraph: true,
    sideEffects: true,
  },
  performance: {
    hints: false
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          onlyCompileBundledFiles: true,
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: ['./src/manifest.json'],
    }),
    new HtmlWebpackPlugin({
      template: './src/devtools.html',
      filename: 'devtools.html',
      chunks: ['devtools'],
    }),
    new HtmlWebpackPlugin({
      template: './src/panel.html',
      filename: 'panel.html',
      chunks: ['panel'],
    }),
    new HtmlWebpackPlugin({
      template: './src/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
  ]
};