const chai = require('chai');
const expect = require('chai').expect;
let chaiHttp = require('chai-http');
const app = require('../index.js');

chai.use(chaiHttp);

describe('Check Health API', function () {
    it('should return API is running', function (done) {
        chai.request(app)
        .get('/api/status').end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.body.message).to.equal('API is running.');

            done();
        })
    })
})