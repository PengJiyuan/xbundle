// webpack plugins list

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const replaceStdout = require('./_utils/replace_stdout');

module.exports = (mode, analyze) => {
  let plugins = [
    new MiniCssExtractPlugin({
      filename: mode !== 'production' ? '[name].min.css' : '[hash:6].[name].min.css',
      chunkFilename: '[id].css'
    }),
    new webpack.ProgressPlugin((percentage, msg) => {
      replaceStdout(`${(percentage * 100).toFixed(2)}% ${msg}`);
    })
  ];
  
  if(analyze) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return plugins;  
};
