// --------------------------------------------------------------------------------------------------------------------

// core
var http = require('http')

// npm
var levelup = require('levelup')
var statto = require('statto')
var stattoBackendLevelDB = require('statto-backend-leveldb')
var stattoWeb = require('./')

// --------------------------------------------------------------------------------------------------------------------

// This is what we're doing here:
//
// (1) Set up a LevelDB database for the statto-backend-leveldb
// (2) Set up the statto-backend-leveldb instance
// (3) Set up the statto server itself
// (4) When we get stats from the statto server, pass them to the backend
// (5) Set up the statto-web application ... passing it the backend required
// (6) Make a http server
// (7) ... and use this app for each request event
// (8) Tell the server to listen for requests

// (1)
var db = levelup('./db', { valueEncoding: 'json' })

// (2)
var backend = stattoBackendLevelDB(db)

// (3)
var stattoServer = statto(function(err, port) {
  console.log('Statto server is listening on port %s', port)
})

// (4)
stattoServer.on('stats', backend.stats.bind(backend))

// (5)
var app = stattoWeb(backend)

// (6)
var server = http.createServer()

// (7)
server.on('request', app)

// (8)
var port = 8080
server.listen(port, function() {
  console.log('Listening on port %s', port)
})

// --------------------------------------------------------------------------------------------------------------------
