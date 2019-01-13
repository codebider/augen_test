const _ = require('lodash');
const chai = require('chai');
const expect = require('chai').expect;
const should = require('chai').should;
let chaiHttp = require('chai-http');
const app = require('../index.js');

chai.use(chaiHttp);

function generateCustomers(first_name, last_name, phone, number) {
    var result = []
    for (var i = 0; i < number; i++) {
        result.push({
            first_name: first_name + ' ' + i,
            last_name: last_name + ' ' + i,
            email: _.kebabCase(first_name +' '+ last_name)+'@gmail.com',
            phone: phone
        });
    }
    return result;
}

describe('Search Tests', () => {
    var uuid = null;
    before(function(done) {
        db.Customer.sequelize.sync({  force: true  })
        .then(function() {
            db.Customer.bulkCreate([
                    ...generateCustomers('daniel', 'le', '09222222222',20),
                    ...generateCustomers('zonathan', 'nguyen', '0123456789', 20),
                    ...generateCustomers('customer', 'van', '0987654321', 20)
                ]).then(function () {
                    done();
                })
            })
    });

    describe('Customer Search Tests', function() {

        it('should search properly', (done) => {
            var search = 'daniel';
            chai.request(app)
            .get('/api/customers')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            })
        })

        it('should search properly with search param', (done) => {
            var search = 'daniel';
            chai.request(app)
            .get('/api/customers')
            .query({
                search: search
            })
            .end(function(err, res) {
                expect(res).to.have.status(200);
                _.each(res.body.data, function (item) {
                    expect(item.first_name).to.include(search);
                })
                done();
            })
        })

        it('should search properly with search first name', (done) => {
            var search = 'zonathan';
            chai.request(app)
            .get('/api/customers')
            .query({
                search: search
            })
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body.pagination.total).to.equal(20);
                _.each(res.body.data, function (item) {
                    expect(item.first_name).to.include(search);
                })
                done();
            })
        })

        it('should search properly with search by phone', (done) => {
            var search = '0987654321';
            chai.request(app)
            .get('/api/customers')
            .query({
                search: search
            })
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body.pagination.total).to.equal(20);
                _.each(res.body.data, function (item) {
                    expect(item.phone).to.include(search);
                })
                done();
            })
        })

        it('should search properly with paging', (done) => {
            chai.request(app)
            .get('/api/customers')
            .query({
                page: 4,
                limit: 2
            })
            .end(function(err, res) {
                expect(res).to.have.status(200);
                console.log(res.body.pagination);
                expect(res.body.pagination.total).to.equal(60);
                expect(res.body.pagination.current_page).to.equal(4);
                expect(res.body.pagination.next_page).to.equal(5);
                expect(res.body.pagination.previous_page).to.equal(3);
                done();
            })
        })
    })
})
