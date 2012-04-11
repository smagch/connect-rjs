var  _ = require('underscore')
  , minimatch = require('minimatch')
  , join = require('path').join

var _defaults = {
  suffix: '-built.js',
  optimize: 'none'
}
  
function Route(options) {
  options = _.extend({}, _defaults, options);
  console.dir( options );
  ['src', 'baseUrl', 'name'].forEach(function(key) {
    if(!options[key]) throw new Error('option "' + key + '" is missing');
  });

  this.src = options.src;
  delete src;
  this.suffix = options.suffix;
  delete options.suffix;

  var matchStr = join(options.baseUrl, options.name + this.suffix);
  console.log('matchStr : ' + matchStr);
  this.matcher = minimatch.makeRe(matchStr);
  console.log('this.matcher : ' + this.matcher);
  this._options = options;
};

module.exports = Route;

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

Route.prototype.match = function(path) {
  return this.matcher.test(path);
}

Route.prototype.getOptions = function(path) {
  var name = this.resolveName(path);
  var outPath = join(this.src, path);
  console.log('name : ' + name);
  console.log('outPath : ' + outPath);
  return _.extend({}, this._options, {
    baseUrl: join(this.src, this._options.baseUrl),
    name: name,
    out: outPath
  });
}

Route.prototype.removeSuffix = function(path) {
  var match = new RegExp('(.+)' + escapeRegExp(this.suffix) + '$').exec(path);
  return (match && match[1]);
}

Route.prototype.resolveName = function(path) {
  var src = this.removeSuffix(path);
  console.log('src : ' + src);
  var match = new RegExp(escapeRegExp(this._options.baseUrl) + '/(.+)').exec(src);
  return (match && match[1]);
}

