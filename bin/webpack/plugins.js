// webpack plugins list

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (mode) => {
  return [
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
      chunkFilename: '[id].css'
    })
  ];  
};