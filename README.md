# statto-web #

Statto is a stats framework which separates all of the different parts of a stats system. All of the following
different activities are separate:

* collection
* client
* reception
* storage
* collation and processing
* presentation

Some example packages for each part of the system are:

* collection
    * statto-collect-process-memory
    * statto-collect-machine-memory
* client
    * statto-client
* reception
    * statto (otherwise known as the statto-server)
* storage
    * statto-backend-leveldb, statto-backend-mongodb, statto-backend-cloudfiles
* collation/processing
    * statto-merge
    * statto-process
* presentation
    * statto-web
    * statto-cli

There are more than just the above and more are being worked on.

## Synopsis ##

To start a web app, you just need to pass it your `statto-backend-*` instance. For example, if you are using
`statto-backend-leveldb` you could do something like this:

```
var http = require('http')

var statto = require('statto')
var stattoBackendLevelDB = require('statto-backend-leveldb')
var stattoWeb = require('statto-web')

var db = levelup('./db', { valueEncoding: 'json' })
var backend = stattoBackendLevelDB(db)

var stattoServer = statto(function(err, port) {
  console.log('Statto server is listening on port %s', port)
})
stattoServer.on('stats', backend.stats.bind(backend))

var app = stattoWeb(backend)
var server = http.createServer()
server.on('request', app)

var port = 8080
server.listen(port, function() {
  console.log('Listening on port %s', port)
})
```

Please see these other repos for more details:

* statto
* statto-merge
* statto-process
* statto-backend-leveldb
* statto-web

## Author ##

Written by [Andrew Chilton](http://chilts.org/) - [Twitter](https://twitter.com/andychilton).

Written for [Tynio](https://tyn.io/) so we can use a statsd-like daemon in a much easier way. Our use-case involves a
stats callback which writes each file to Rackspace's Cloud Files, which are aggregated in a separate process elsewhere.
ie. the stats daemon is not where the hard work is, it's pretty easy.

## License ##

The MIT License (MIT)

Copyright 2015 Tynio Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(Ends)
