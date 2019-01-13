const api = require('./app.json')
const _ = require('lodash');
const middlewares = require('../middlewares')

const Route = function(data){
  this.path = data['path'];

  this.getMiddlewares = function() {
    var apiMiddlewares = data['middlewares'];

    if (_.isEmpty(apiMiddlewares)) return [];
    apiMiddlewares = apiMiddlewares.reverse()
    var _middlewares = [];
    var i = apiMiddlewares.length, middlewareFunc;

    while (i--) {
      middlewareFunc = middlewares[apiMiddlewares[i].name];

      if (middlewareFunc) {
        _middlewares.push(middlewareFunc(apiMiddlewares[i]));
      } else {
        throw ('Not found middleware: ' + middlewareFunc);
      }
    }

    return _middlewares;
  },

  this.getHandler = function() {
    return require('../controllers/'+this.path);
  };

  this.getPublicPath = function() {
    return '/api/'+this.get('path');
  };

  this.getRouterPath = function () {
    return '/api/'+ ( data['router'] || data['path']);
  }

  this.getMethod = function () {
    return data['method'];
  }
};

module.exports = function(app) {

  for (var i=0, route; i<api.length; i++) {
    route = new Route(api[i]);
    console.log('add route: ', route.getRouterPath());
    app[route.getMethod()].apply(app, _.union([route.getRouterPath()], route.getMiddlewares(), [route.getHandler()]));
  }
}
