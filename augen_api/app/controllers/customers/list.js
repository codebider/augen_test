const _ = require('lodash');
const customerGateway = require('../../gateways/customer.gateway');

module.exports = function (req, res, next) {
    let data = _.defaults(_.pick(req.query, 'search', 'limit', 'page'), {
        limit: 10,
        page: 1
    });
    return customerGateway.search(data.search, data.page, data.limit)
         .done(res.jsonData, res.jsonError)
}
