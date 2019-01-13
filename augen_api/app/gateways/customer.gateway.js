const helpers = require('../../utils/helpers');
const loadPreformace = require('../../utils/load_preformace');
const model = db.Customer;

// ======== General ========
const findById = function (id) {
    return model.findById(id)
}

const search = function (search, page = 1, limit = 10) {
    let conditions = {};
    if (search) {
        conditions = {
            '$or': [
                {first_name: {$like : `%${search}%`}},
                {last_name: {$like : `%${search}%`}},
                {phone: {$like : `%${search}%`}},
                {email: {$like : `%${search}%`}},
            ]
        }
    }
    return model.findAndCountAll({
        raw: true,
        limit: limit,
        offset: (page - 1) * limit,
        where: conditions,
        attributes: loadPreformace.CUSTOMER
    }).then(function (result) {
        return {
            _data: result.rows,
            _pagination: helpers.setUpPaging(result.count, limit, page)
        }
    })
}

// ======= More =========
module.exports = {
    findById,
    search
}
