module.exports = (msg) => {
  process.stdout.cursorTo(0);
  process.stdout.moveCursor(-1, 0);
  process.stdout.clearLine();
  process.stdout.write(msg);
};
