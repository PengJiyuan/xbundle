#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const program = require('commander');
const webpack = require('webpack');
const pkg = require('../../package.json');
const getEntry = require('./entry');
const getRules = require('./rules');
const getPlugins = require('./plugins');

program
  .version(pkg.version)
  .option('--webpack', 'Use Webpack to bundle you files.')
  .option('--rollup', 'Use Rollup to bundle you files.')
  .option('--ay, --analyze', 'Visualize size of webpack output files with an interactive zoomable treemap.')
  .option('--mv, --modifyVars [modifyVars]', 'Enables run-time modification of Less variables.')
  .option('--bp, --babelPolyfill', 'Use babel-polyfill to polyfill your code.')
  .option('-e, --entry [entry]', 'The entry of xbundle', './src/index.js')
  .option('-j, --jsx', 'Entry extension is .jsx')
  .option('-m, --mode [mode]', 'production or development.', 'production')
  .option('-p, --path [path]', 'The output path of xbundle', './dist')
  .option('-s, --splitChunks', 'https://webpack.js.org/plugins/split-chunks-plugin/')
  .option('-w, --watch', 'Turn on watch mode.')
  .parse(process.argv);

const fileIndex = program.jsx ? 'index.jsx' : 'index.js';
const entry = getEntry(program.entry, fileIndex, program.babelPolyfill);

const config = {
  mode: program.mode,
  entry,
  output: {
    path: path.resolve(program.path),
    filename: '[name].bundle.js'
  },
  module: {
    rules: getRules(program.mode, program.modifyVars)
  },
  plugins: getPlugins(program.mode, program.analyze),
  watch: program.watch && program.mode !== 'production'
};

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
    process.stdout.write(stats.toString({ colors: true }).split('Entrypoint')[0] + "\n");
  }
);
