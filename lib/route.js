var  _ = require('underscore'),
  minimatch = require('minimatch'),
  join = require('path').join,
  escapeRegExp = require('./util').escapeRegExp,
  defaults = require('./defaults');

function Route(options) {
  options = _.extend({}, defaults, options);

  ['src', 'baseUrl', 'name'].forEach(function (key) {
    if (!options[key]) throw new Error('option "' + key + '" is missing');
  });

  // asign connct-rjs specific option to expando properties
  var self = this;
  ['src', 'suffix'].forEach(function (key) {
    self[key] = options[key];
    delete options[key];
  });

  var matchStr = join(options.baseUrl, options.name + this.suffix);
  this.matcher = minimatch.makeRe(matchStr);
  this._options = options;
}

module.exports = Route;

Route.prototype.match = function (path) {
  return this.matcher.test(path);
};

Route.prototype.getOptions = function (path) {
  var name = this.resolveName(path),
    outPath = join(this.src, path);
  return _.extend({}, this._options, {
    baseUrl: join(this.src, this._options.baseUrl),
    name: name,
    out: outPath
  });
};

Route.prototype.removeSuffix = function (path) {
  var match = new RegExp('(.+)' + escapeRegExp(this.suffix) + '$').exec(path);
  return (match && match[1]);
};

Route.prototype.resolveName = function (path) {
  var src = this.removeSuffix(path),
    match = new RegExp(escapeRegExp(this._options.baseUrl) + '/(.+)').exec(src);
  return (match && match[1]);
};
