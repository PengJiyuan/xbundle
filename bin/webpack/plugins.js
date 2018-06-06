// webpack plugins list

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (mode, analyze) => {
  let plugins = [
    new MiniCssExtractPlugin({
      filename: mode !== 'production' ? '[name].min.css' : '[hash:6].[name].min.css',
      chunkFilename: '[id].css'
    })
  ];
  
  if(analyze) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return plugins;  
};
