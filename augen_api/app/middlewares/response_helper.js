const _ = require('lodash');

module.exports = function(options) {
    options = options || {};

    return function(req, res, next) {
        req.augen = req.augen || {};

        // fullfilled handler
        res.jsonData = function(response) {
            response = response || {};

            if (_.isFunction(response.toJSON)) {
                response = response.toJSON();
            }

            var data = response._data || response;
            var headers = response._headers || {};
            var pagination = response._pagination;
            var exclude = req.query.exclude || req.body.exclude;
            var json = {};

            // so this is a GET request, excluded fields are separated by commas
            if (req.query.exclude) {
                exclude = exclude.split(',');
            }

            // exclude stuff from the response
            if (!_.isArray(exclude)) {
                exclude = [exclude];
            }

            exclude = _.compact(exclude);

            _.each(exclude, function(attr) {
                if (_.isArray(data)) {
                    _.each(data, function (item) {
                        delete item[attr]
                    })
                } else {
                    delete data[attr];
                }
            });

            json['data'] = data;

            if (pagination) {
                var intKeys = ['limit', 'offset', 'total'];
                _.each(intKeys, function(key) {
                    if (pagination[key]) {
                        pagination[key] = parseInt(pagination[key]);
                    }
                });
                json['pagination'] = pagination;
            }

            json['error'] = null;

            // set header
            res.set(headers)
            // res.set('uuid', '1231313');
            res.status(200).json(json);
        }

        // reject handler
        res.jsonError = function(error) {
            if (error instanceof ApplicationException) {
                var jsonError = {
                    code: error.code,
                    message: error.message
                }

                // handle Sequelize Error
                if (error.message.name && error.message.name.indexOf('Sequelize') == 0) {
                    if (error.message.errors.length > 0) {
                        jsonError.message = error.message.errors[0].message;
                    }
                }

                if (error.params) {
                    jsonError.params = error.params
                }

                res.status(error.httpCode).json({
                    data: null,
                    error: jsonError
                });

            } else if (error instanceof Error) {
                console.log(error.stack);
                res.status(req.preferErrorStatusCode).json({
                    data: null,
                    error: {
                        code: 500,
                        message: error.toString()
                    }
                });
            }
        }

        res.error = function(error, json) {
            json ? res.jsonError(error) : next(new Error(error));
        }

        next();
    }
}
