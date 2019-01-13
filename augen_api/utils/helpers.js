const setUpPaging = (total, limit, page) => {
    return {
        total: total,
        current_page: page,
        next_page: page * limit < total ? page + 1 : null,
        previous_page: page > 1 ? page - 1 : null
    }
}

module.exports = {
    setUpPaging
}

