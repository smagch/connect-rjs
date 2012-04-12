// escape regexp
exports.escapeRegExp = function (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

// remove extension of the path
exports.removeExtension = function (path) {
  var match = /(.+)\.\w+$/.exec(path);
  return match && match[1];
};