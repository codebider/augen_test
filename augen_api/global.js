const fs = require('fs');
const _ = require('lodash');
const currentPath = __dirname;
const errorCodes = require('./data/error_codes.json');

global.Q = require('q');

global.augen = {
  rootPath: currentPath
};


global.requireFromRoot = function(name) {
  if (name.charAt(0) != '/') name = '/' + name;
  return require(currentPath + name);
};

global.setupExports = function(dir, opts) {
  opts = _.defaults(opts || {}, {
    ignore: ['index.js']
  });

  var exports = {};
  var methods = fs.readdirSync(dir);
  var i = methods.length, method, methodName, methodRequirePath;

  while (i--) {
    method = methods[i];
    if (opts.ignore.indexOf(method) != -1) continue;

    methodName = method.split('.')[0];
    methodRequirePath = dir + '/' + method;
    methodName = _.camelCase(methodName);

    exports[methodName] = require(methodRequirePath);
  }

  return exports;
};

global.ApplicationException = function(code, message) {
  var errorCode = errorCodes[code];

  this.code = code;
  this.httpCode = errorCode.http || 400;
  this.message = message || errorCode.message || 'Unknown error';
  this.stack = (new Error()).stack;
};

global.ApplicationException.prototype = Error;
global.ApplicationException.prototype.toString = function() {
  return this.message || "Unknown error";
};

// import models
require('./database/models')()
