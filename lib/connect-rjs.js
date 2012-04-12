var requirejs = require('requirejs')
  , _ = require('underscore')
  , fs = require('fs')
  , parse = require('url').parse
  , debug = require('debug')('connect-rjs')
  , Route = require('./route')
  , join = require('path').join;

function init(options, defaults) {
  var routes = [];

  if (Array.isArray(options)) {
    options.forEach(function (opt) {
      opt = _.extend({}, defaults, opt);
      routes.push(new Route(opt));
    });
  } else if ('object' === typeof options) {
    routes.push(new Route(options));
  } else {
    throw new Error('options should be Object or Array');
  }
  return routes;
}

// middleware
// @param {Object|Array} options
// @param {Object} defaults
var middleware = module.exports = function (options, defaults) {
  var routes = init.apply(this, arguments);

  return function (req, res, next) {
    if (!{GET: 1, HEAD: 1}[req.method]) return next();

    var path = parse(req.url).pathname,
      route = _.find(routes, function (route) {
        return route.match(path);
      });

    if (!route) return next();

    debug('match path ' + path);

    requirejs.optimize(route.getOptions(path), function (response) {
      debug('optimized ' + path);
      next();
    });
  };
};

middleware.builder = function (options, defaults) {
  var glob = require('glob')
    , routes = init.apply(this, arguments);

  routes.forEach(function (route) {
    var match = route.getAbsoluteName();
    debug('match : ', match);
    glob(match, function (err, files) {
      debug(files);
      files.forEach(function (filePath) {
        debug('filePath : ' + filePath);
        var opts = route.getBuildOptions(filePath);
        requirejs.optimize(opts, function (response) {
          debug('optimized : ' + filePath);
        });
      });
    });
  });
};