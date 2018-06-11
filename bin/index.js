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
  .option('--root [root]', 'root context relative to process.cwd()')
  .option('--ay, --analyze', 'Visualize size of webpack output files with an interactive zoomable treemap.')
  .option('--mv, --modifyVars [modifyVars]', 'Enables run-time modification of Less variables.')
  .option('--bp, --babelPolyfill', 'Use babel-polyfill to polyfill your code.')
  .option('--pfx, --prefix [prefix]', 'Add prefix to output filename.', '')
  .option('-c, --xConfig [xConfig]', 'config file of xbundle')
  .option('-e, --entry [entry]', 'The entry of xbundle', './src/index.js')
  .option('-p, --path [path]', 'The output path of xbundle', './dist')
  .option('-j, --jsx', 'Entry extension is .jsx')
  .option('-m, --mode [mode]', 'production or development.', 'production')
  .option('-a, --alias <alias>', 'Alias for webpack resolve. (A json file | name=path,name=path)')
  .option('-s, --splitChunks', 'https://webpack.js.org/plugins/split-chunks-plugin/')
  .option('-w, --watch', 'Turn on watch mode.')
  .parse(process.argv);

let xConfig, webpackConfig;

if(program.xConfig) {
  xConfig = require(path.resolve(process.cwd(), program.xConfig));
}

// If no config file, use command line options.
if(!xConfig) {
  const fileIndex = program.jsx ? 'index.jsx' : 'index.js';
  const entry = getEntry(program.entry, fileIndex, program.babelPolyfill);
  const prefix = program.prefix ? (program.prefix + '.') : '';
  let filename;

  if(program.mode === 'production') {
    filename = `[hash:6].${prefix}[name].min.js`;
  } else {
    filename = `${prefix}[name].js`;
  }

  webpackConfig = {
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

  if(program.root) {
    webpackConfig.resolve.modules.unshift(path.resolve(process.cwd(), program.root));
  }

  if(program.mode !== 'production') {
    webpackConfig.devtool = 'cheap-source-map';
  }

  if(program.alias) {
    const aliasList = program.alias.split(',');
    let finalList = aliasList.map((a) => {
      const inline = a.split('=');
      return inline.length > 1
        ? {[inline[0]]: inline[1]}
        : JSON.parse(fs.readFileSync(path.resolve(a), 'utf8'));
    });

    const alias = finalList.reduce((pre, cur) => {
      return Object.assign(pre, cur);
    });

    webpackConfig.resolve.alias = alias;
  }

  if(program.splitChunks) {
    webpackConfig.optimization = {
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '.',
        cacheGroups: {
          dll: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          }
        }
      }
    }
  }
} else {
  /**
   * use config file.
   * 
   * @mode
   * @entry
   * @output
   * @watch
   * @modifyVars
   * @analyze
   * @jsx
   * @babelPolyfill
   */
  if(typeof xConfig === 'function') {
    xConfig = xConfig(program.mode);
  }
  const fileIndex = xConfig.jsx ? 'index.jsx' : 'index.js';

  webpackConfig = {
    mode: xConfig.mode || 'production',
    entry: xConfig.entry || path.resolve(process.cwd(), 'src'),
    output: xConfig.output || {
      path: path.resolve(process.cwd(), 'dist'),
      filename: 'bundle.js'
    },
    module: {
      rules: getRules(xConfig.mode, xConfig.modifyVars)
    },
    plugins: getPlugins(xConfig.mode, xConfig.analyze),
    watch: xConfig.watch && xConfig.mode !== 'production',
    resolve: {
      extensions: ['.jsx', '.js', 'json'],
      modules: [
        path.resolve(process.cwd()),
        'node_modules'
      ],
      alias: xConfig.alias
    }
  }
  if(xConfig.devtool) {
    webpackConfig.devtool = xConfig.devtool;
  }
}

webpack(
  webpackConfig,
  (err, stats) => {
    // only show bundled resource information.
    process.stdout.write(stats.toString({
      assets: true,
      colors: true,
      warnings: true,
      errors: true,
      errorDetails: true,
      entrypoints: true,
      version: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      children: false
    }) + "\n");
  }
);
