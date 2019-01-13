// Define Global
require('./global.js');

var express = require('express')
var bodyParser = require('body-parser')
var middlewares = requireFromRoot('app/middlewares');

var app = express()

// middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(middlewares.responseHelper());


// import routes
require('./app/routes')(app)

// check health (for balancer)
app.get('/api/status', (req, res, next) => {
    res.json({ message: 'API is running.' })
});

// start the magic
var port = process.env.PORT || 4000
app.listen(port)

console.log('Magic happens on port ' + port + ' (' + process.env.NODE_ENV + ')')

module.exports = app; // for testing