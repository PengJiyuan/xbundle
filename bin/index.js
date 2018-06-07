#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const program = require('commander');
const webpack = require('webpack');
const pkg = require('../package.json');
const getEntry = require('./entry');
const getRules = require('./rules');
const getPlugins = require('./plugins');

program
  .version(pkg.version)
  .option('--ay, --analyze', 'Visualize size of webpack output files with an interactive zoomable treemap.')
  .option('--mv, --modifyVars [modifyVars]', 'Enables run-time modification of Less variables.')
  .option('--bp, --babelPolyfill', 'Use babel-polyfill to polyfill your code.')
  .option('--pfx, --prefix [prefix]', 'Add prefix to output filename.', '')
  .option('-e, --entry [entry]', 'The entry of xbundle', './src/index.js')
  .option('-p, --path [path]', 'The output path of xbundle', './dist')
  .option('-j, --jsx', 'Entry extension is .jsx')
  .option('-m, --mode [mode]', 'production or development.', 'production')
  .option('-a, --webpackAlias <alias>', 'Alias for webpack resolve. (A json file)')
  .option('-s, --splitChunks', 'https://webpack.js.org/plugins/split-chunks-plugin/')
  .option('-w, --watch', 'Turn on watch mode.')
  .parse(process.argv);

const fileIndex = program.jsx ? 'index.jsx' : 'index.js';
const entry = getEntry(program.entry, fileIndex, program.babelPolyfill);
let filename;

if(program.mode === 'production') {
  filename = `[hash:6].${program.prefix ? (program.prefix + '.') : ''}[name].min.js`;
} else {
  filename = `${program.prefix}.[name].js`;
}

const config = {
  mode: program.mode,
  entry,
  output: {
    path: path.resolve(program.path),
    filename
  },
  module: {
    rules: getRules(program.mode, program.modifyVars)
  },
  plugins: getPlugins(program.mode, program.analyze),
  watch: program.watch && program.mode !== 'production',
  resolve: {
    extensions: ['.jsx', '.js', 'json'],
    modules: [
      path.resolve(process.cwd()),
      'node_modules'
    ],
  }
};

if(program.mode !== 'production') {
  config.devtool = 'cheap-source-map';
}

if(program.webpackAlias) {
  const alias = fs.readFileSync(path.resolve(program.webpackAlias), 'utf8');
  config.resolve.alias = JSON.parse(alias);
}

if(program.splitChunks) {
  config.optimization = {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '.',
      name: true,
      cacheGroups: {
        dll: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  }
}

webpack(
  config,
  (err, stats) => {
    // only show bundled resource information.
    process.stdout.write(stats.toString({ colors: true }) + "\n");
  }
);
