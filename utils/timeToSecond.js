module.exports = (time) => {
  const splitter = time.split(":");
  const second = splitter
    .reverse()
    .reduce((acc, cur, index) => acc + Math.pow(60, index) * cur, 0);
  return second;
};
