var requirejs = require('requirejs'),
  _ = require('underscore'),
  fs = require('fs'),
  parse = require('url').parse,
  debug = require('debug')('connect-rjs'),
  Route = require('./route');

var routes = [];

// @param {Object|Array} options
// @param {Object} defaults
module.exports = function (options, defaults) {
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