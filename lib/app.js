// --------------------------------------------------------------------------------------------------------------------
// tyn.io - (c) 2015 Tynio.
// --------------------------------------------------------------------------------------------------------------------

// core
var path = require('path')

// npm
var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')

// local
var date = require('./date.js')

// --------------------------------------------------------------------------------------------------------------------

module.exports = function(backend) {
  var app = express()
  app.set('view engine', 'jade')

  // --- app.locals ---
  if ( process.env.NODE_ENV === 'production' ) {
    app.locals.pretty = false
    app.locals.min = 'min.'
  }
  else {
    app.locals.pretty = true
    app.locals.min = ''
  }
  app.locals.date = date

  // --- middleware ---
  app.use(morgan('combined'))

  app.use('/s/', express.static(path.join(__dirname, '..', 'public')))

  // From: http://expressjs.com/api.html#req.body
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  // The app itself.
  app.get('/', function(req, res) {
    res.render('index')
  })

  app.get('/view', function(req, res) {
    res.render('view')
  })

  // a board
  app.get('/b/:board_id', function(req, res) {
    console.log('Showing board ' + req.params.board_id)

    var board = {
      id : req.params.board_id,
      title : 'Statto Stats',
      stats : [
        { id : 'Iev8ha0K', title : 'Packets - Total',  type : 'c', name : 'statto.packets.total' },
        { id : 'Cooyie0U', title : 'Messages - Total', type : 'c', name : 'statto.msgs.total'    },
        { id : 'Ae7Beipe', title : 'Messages - Good',  type : 'c', name : 'statto.msgs.good'     },
        { id : 'Ahshie8E', title : 'Messages - Bad',   type : 'c', name : 'statto.msgs.bad'      },
      ],
    }

    res.locals.board = board

    res.render('board')
  })

  // --- counter ---
  // ToDo: merge the fetching for each filetype into middleware

  // counter
  app.get('/stats/c/:name.json', function(req, res) {
    var from = new Date(req.query.from)
    var to   = new Date(req.query.to)

    backend.getCounter(req.params.name, from, to, function(err, values) {
      if (err) return next(err)
      res.json(values)
    })
  })

  // counter
  app.get('/stats/c/:name.csv', function(req, res) {
    var from = new Date(req.query.from)
    var to   = new Date(req.query.to)

    // set a header for this csv
    res.setHeader('content-type', 'text/csv')

    backend.getCounter(req.params.name, from, to, function(err, values) {
      if (err) return next(err)
      res.send(
        'ts,v\n' + values.map(function(a) {
          return (new Date(a.ts)).getTime() + ',' + a.v
        }).join('\n')
      )
    })
  })

  // --- timer ---

  // timer
  app.get('/stats/t/:name', function(req, res) {
    var from = new Date(req.query.from)
    var to   = new Date(req.query.to)

    backend.getTimer(req.params.name, from, to, function(err, values) {
      if (err) return next(err)
      res.json(values)
    })
  })

  // --- gauge ---

  // gauge
  app.get('/stats/g/:name', function(req, res) {
    var from = new Date(req.query.from)
    var to   = new Date(req.query.to)

    backend.getGauge(req.params.name, from, to, function(err, values) {
      if (err) return next(err)
      res.json(values)
    })
  })

  return app
}

// --------------------------------------------------------------------------------------------------------------------
