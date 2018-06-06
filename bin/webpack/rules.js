// webpack loaders rules list

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

module.exports = (mode) => {
  return [
    // babel
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: ['env', 'stage-0', 'react'],
        plugins: ['transform-runtime']
      }
    },
    // less
    {
      test: /\.less|css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: function() {
              return [autoprefixer];
            }
          }
        }, {
          loader: 'less-loader',
          options: {
            sourceMap: mode !== 'production'
          }
        }
      ]
    }
  ];
};
