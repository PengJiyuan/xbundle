const fs = require('fs');
const path = require('path');

module.exports = (argEntry, fileIndex) => {
  let finalEntry = {};
  if(fs.statSync(argEntry).isDirectory()) {
    if(fs.existsSync(path.resolve(argEntry, fileIndex))) {
      finalEntry = path.resolve(argEntry, fileIndex);
    } else {
      fs.readdirSync(argEntry)
        .filter((m) => fs.statSync(path.resolve(argEntry, m)).isDirectory())
        .forEach((m) => {
          finalEntry[m] = path.resolve(argEntry, m, fileIndex);
        });
    }
  }

  return Object.keys(finalEntry).length > 0 ? finalEntry : argEntry;
};
