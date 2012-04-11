var requirejs = require('requirejs')
  , _ = require('underscore')
  , fs = require('fs')
  , parse = require('url').parse
  , basename = require('path').basename
  , dirname = require('path').dirname
  , join = require('path').join
  , log = console.log
  , Route = require('./route');

// name: '/javascripts/main-built.js'
// name: '/javascripts/views/**/<%= src %>-built.js'
// out: <%= name %>-built.js
// options are 
// var defaults = {
//   // set false to no logging
//   debug: true,
//   // no minify by default since this module is for only development
//   optimize: 'none'
// };

var routes = [];

// suffix -built
// @param {Object|Array} options
// @param {Object} defaults
module.exports = function(options, defaults) {
  if(Array.isArray(options)) {
    options.forEach(function(opt) {
      opt = _.extend({}, defaults, opt);
      routes.push(new Route(opt));
      console.log('pushed');
    });
  } else if('object' === typeof options) {
    options = _.extend({}, defaults, options);
    routes.push(new Route(options));
  } else {
    throw new Error('options should be Object or Array');
  }

  return function(req, res, next) {
    if(!{GET:1, HEAD:1}[req.method]) return next();

    var path = parse(req.url).pathname;

    console.log('path : ' + path);

    var route = _.find(routes, function(route) {
      return route.match(path);
    });

    if(!route) return next();
    console.log('route match');
    requirejs.optimize(route.getOptions(path), function(response) {
      console.log('response : ' + response);
      console.log('--optimized--');
      next();
    });
  };
};