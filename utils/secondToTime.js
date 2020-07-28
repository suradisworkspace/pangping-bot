module.exports = (d) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  if (!d) {
    return "00:00";
  }

  var hDisplay = h > 0 ? `${h}:` : "";
  var mDisplay = m > 9 ? `${m}:` : `0${m}:`;
  var sDisplay = s > 9 ? `${s}` : `0${s}`;
  return hDisplay + mDisplay + sDisplay;
};
