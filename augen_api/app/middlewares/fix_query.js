const _ = require('lodash');

module.exports = function(opts) {
    opts = _.defaults(opts, {
        json: true
    });

    return function(req, res, next) {
        if(req.query && req.query.page)
        {
            req.query.page = parseInt(req.query.page);
        }

        if(req.query && req.query.limit)
        {
            req.query.limit = parseInt(req.query.limit);
        }

        next();
    }
}