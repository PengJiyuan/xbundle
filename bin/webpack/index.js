#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const program = require('commander');
const webpack = require('webpack');
const pkg = require('../../package.json');
const getEntry = require('./getEntry');
const getRules = require('./rules');
const getPlugins = require('./plugins');

program
  .version(pkg.version)
  .option('-w, --webpack', 'Use Webpack to bundle you files.')
  .option('-r, --rollup', 'Use Rollup to bundle you files.')
  .option('-e, --entry [entry]', 'The entry of xbundle', './src/index.js')
  .option('-j, --jsx', 'Entry extension is .jsx')
  .option('-m, --mode [mode]', 'production or development.', 'production')
  .option('-p, --path [path]', 'The output path of xbundle', './dist')
  .option('--analyze', 'Visualize size of webpack output files with an interactive zoomable treemap.')
  .parse(process.argv);

const fileIndex = program.jsx ? 'index.jsx' : 'index.js';
const entry = getEntry(program.entry, fileIndex);

const config = {
  mode: program.mode,
  entry,
  output: {
    path: path.resolve(program.path),
    filename: '[name].bundle.js'
  },
  module: {
    rules: getRules(program.mode)
  },
  plugins: getPlugins(program.mode, program.analyze)
};

webpack(
  config,
  (err, stats) => {
    process.stdout.write(stats.toString({ colors: true }) + "\n");
  }
);
