// --------------------------------------------------------------------------------------------------------------------

// core
var http = require('http')

// npm
var levelup = require('levelup')
var statto = require('statto')
var stattoBackendLevelDB = require('statto-backend-leveldb')
var stattoWeb = require('./')

// --------------------------------------------------------------------------------------------------------------------

// setup the LevelDB instance and the storage backend
var db = levelup('./db', { valueEncoding: 'json' })
var backend = stattoBackendLevelDB(db)

// create and start the statto server
var stattoServer = statto(function(err, port) {
  console.log('Statto server is listening on port %s', port)
})
stattoServer.on('stats', function(raw) {
  // log it first
  console.log(raw)

  // now send to the backend
  backend.addRaw(raw, function(err) {
    if (err) return console.error('backend.addRaw(): err - ', err)
    console.log('Raw stats added ok')

    // Since we only have one backend here and we're storing everything
    // locally, let's tell the backend to process these raw stats.
    backend.process(raw.ts, function(err) {
      if (err) return console.error('backend.process(): err - ', err)
      console.log('Stats processed ok')
    })
  })
})

// create the app, the server and listen
var app = stattoWeb(backend)
var server = http.createServer()
server.on('request', app)

var port = 8080
server.listen(port, function() {
  console.log('Listening on port %s', port)
})

// --------------------------------------------------------------------------------------------------------------------
