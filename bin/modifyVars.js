// Enables run-time modification of Less variables.
const lessToJs = require('less-var-parse');
const fs = require('fs');

module.exports = (file) => {
  const extension = file.substr(-4, 4);
  if(extension === 'less') {
    return lessToJs(fs.readFileSync(file, 'utf8'));
  } else if (extension === 'json') {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return {};
};
