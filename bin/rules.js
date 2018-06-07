// webpack loaders rules list

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const themer = require('./modifyVars');

module.exports = (mode, modifyVarsFilePath) => {
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
            sourceMap: mode !== 'production',
            modifyVars: modifyVarsFilePath ? themer(modifyVarsFilePath) : {}
          }
        }
      ]
    },
    // webfont
    {
      test: /\.(woff|svg|eot|ttf|otf)\??.*$/,
      use: {
        loader: 'file-loader',
        options: {
          limit: 1000,
          name: './fonts/[hash:8].icon.[ext]'
        }
      }
    },
    // assets
    {
      test: /\.(jpe?g|png|gif)$/i,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 2000,
          name: './img/[hash:8].[name].[ext]'
        }
      }]
    }
  ];
};
