/**
 * @cmd: xbundle -e a=index.js -- specify a file as entry
 * @cmd: xbundle -e index=index.js,lib=lib/index.js,other=other/index.js -- specify files list as entry
 * @cmd: xbundle -e src -- specify a folder as entry, xbundle will find folders under src, and find the index.
 * @cmd: xbundle -e src,lib -- specify folders list as entry, xbundle will find folders under src and lib, and find their index.
 * @cmd: xbundle -e home=src/index.js,list -- mixed
 */

const fs = require('fs');
const path = require('path');

// Add babel-polyfill if we need.
function polyfillIt(polyfill, entry) {
  return polyfill ? ['babel-polyfill', entry] : entry;
}

module.exports = (argEntry, fileIndex, polyfill) => {
  let finalEntry = {};
  let ret;

  const entrys = argEntry.split(',').map((entry) => {
    const item = entry.split('=');
    if(item.length < 2 && (entry.substr(-4, 4) === '.jsx' || entry.substr(-3, 3) === '.js')) {
      throw 'You need specify entry like that: `xbundle -e name=xxx`';
    }
    return item.length > 1 ? {
      name: item[0],
      file: item[1]
    } : entry;
  });

  entrys.forEach((entry) => {
    // If entry is directory, find the index or deep find.
    const file = entry.file ? entry.file : entry;

    if(fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if(fs.existsSync(path.resolve(file, fileIndex))) {
        finalEntry[entry.name] = polyfillIt(polyfill, path.resolve(file, fileIndex));
      } else {
        fs.readdirSync(file)
          .filter((m) => fs.statSync(path.resolve(file, m)).isDirectory())
          .forEach((m) => {
            finalEntry[m] = polyfillIt(polyfill, path.resolve(file, m, fileIndex));
          });
      }
    } 
    // If entry is not directory, treat it as file
    else {
      finalEntry[entry.name] = polyfillIt(polyfill, path.resolve(file));
    }
  });

  return finalEntry;
};
