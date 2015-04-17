// --------------------------------------------------------------------------------------------------------------------
// tyn.io - (c) 2015 Tynio.
// --------------------------------------------------------------------------------------------------------------------

// core
var path = require('path')

// npm
var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')

// --------------------------------------------------------------------------------------------------------------------

module.exports = function(backend) {
  var app = express()
  app.enable('strict routing')
  app.enable('trust proxy')
  app.disable('x-powered-by')
  app.locals.pretty = true
  app.set('views', path.join(__dirname, '..', 'views'))
  app.set('view engine', 'jade')

  // middleware
  app.use(morgan('combined'))
  // From: http://expressjs.com/api.html#req.body
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  // static assets
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // The app itself.
  app.get('/', function(req, res) {
    res.render('index')
  })

  // The app itself.
  app.get('/view', function(req, res) {
    res.render('view')
  })

  app.get('/stats/c/:name', function(req, res) {
    var from = new Date(req.query.from)
    var to   = new Date(req.query.to)
    var interval = req.query.interval ? +req.query.interval : 60 // 60s

    backend.getCounterRange(req.params.name, from, to, interval, function(err, values) {
      if (err) return next(err)
      res.json(values)
    })
  })

  app.get('/stats/t/:name', function(req, res) {
    var from = new Date(req.query.from)
    var to   = new Date(req.query.to)
    var interval = req.query.interval ? +req.query.interval : 60 // 60s

    backend.getTimerRange(req.params.name, from, to, interval, function(err, values) {
      if (err) return next(err)
      res.json(values)
    })
  })

  app.get('/stats/g/:name', function(req, res) {
    var from = new Date(req.query.from)
    var to   = new Date(req.query.to)
    var interval = req.query.interval ? +req.query.interval : 60 // 60s

    backend.getGaugeRange(req.params.name, from, to, interval, function(err, values) {
      if (err) return next(err)
      res.json(values)
    })
  })

  return app
}

// --------------------------------------------------------------------------------------------------------------------
