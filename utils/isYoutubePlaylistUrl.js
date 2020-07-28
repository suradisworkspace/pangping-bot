module.exports = (url) => {
  var p = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
  if (url.match(p)) {
    return true;
  }
  return false;
};
