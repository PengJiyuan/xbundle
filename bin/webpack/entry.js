const fs = require('fs');
const path = require('path');

module.exports = (argEntry, fileIndex, polyfill) => {
  let finalEntry = {};
  let ret;
  if(fs.statSync(argEntry).isDirectory()) {
    if(fs.existsSync(path.resolve(argEntry, fileIndex))) {
      if(polyfill) {
        finalEntry = ['babel-polyfill', path.resolve(argEntry, fileIndex)];
      } else {
        finalEntry = path.resolve(argEntry, fileIndex);
      }
    } else {
      fs.readdirSync(argEntry)
        .filter((m) => fs.statSync(path.resolve(argEntry, m)).isDirectory())
        .forEach((m) => {
          if(polyfill) {
            finalEntry[m] = ['babel-polyfill', path.resolve(argEntry, m, fileIndex)];
          } else {
            finalEntry[m] = path.resolve(argEntry, m, fileIndex);
          }
        });
    }
  }

  return finalEntry;
};
