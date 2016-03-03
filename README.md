

# Express Socket.io Wrapper
#### ESWrapper for short

ESWrapper makes your express.js powered API accessible through real-time sockets with Socket.io.

## Installation

In console:

    npm install es-wrapper
  
In code:

    require('es-wrapper');
 
## Usage

Create your standard express.js application, require `es-wrapper`, just instead of doing `app.listen(PORT);` do `new ESWrapper(app).listen(PORT);`.

> Don't forget to pass express application as a first parameter to ESWrapper: `new ESWrapper(expressApp)`.

        var app = require('express')();
        var ESWrapper = require('es-wrapper');
        
        // app.listen(8080);
        new ESWrapper(app).listen(8080);
        
        app.get('/', function (req, res) {
          res.sendfile(__dirname + '/index.html');
        });
        
        app.get('/sayHi', function (req, res) {
          res.end('Hello World!');
        });

Now you can access `/sayHi` route with both http(xhr) and socket.io client.
index.html:

        <script src="/socket.io/socket.io.js"></script>
        <script>
          var socket = io.connect('http://localhost:8080');
        
          socket.emit('request', {
            path: '/sayHi',
            method: 'get',
            headers: {},
            body: {}
          });
        
          socket.on('response', function (res) {
            alert(res.body); // Hello World!
          });
        
        </script>
        
And still have access with http:
    
        <script src="http://code.jquery.com/jquery-1.12.1.min.js"></script>
        <script>
          $.get('http://localhost:8080/sayHi', function(data) {
            alert(data); // Hello World!
          });
        </script>
        
Need access to raw socket.io? No problem:

        var express = require('express');
        var ESWrapper = require('es-wrapper');
        var wrapper = new ESWrapper(express());
        var app = wrapper.app;
        var io = wrapper.io;
        
        wrapper.listen(); // default port will be 80
        
        app.get('/', function(req, res) {
          res.sendfile(__dirname + '/index.html');
        });
        
        io.on('connection', function(socket) {
          socket.emit('hello', { hello: 'world' });
        });
       
Separate socket logic & http. Req will have `isSocket: true` value and `socketIO` object witch is socket.io connected socket. Also req.connection is same as `socketIO`.
 
        app.delete('/socketIOtest', function(req, res) {
          if (req.isSocket) { // req.isSocket is always true for socket requests
            req.socketIO.emit('extra', 200); // req.socketIO is socket received on connection
            req.connection.emit('extra', 200); // same here
          }
          res.sendStatus(200);
        });


## wrapper.client.io.js

Another alternative is to use wrapper.client.io.js. It is small wrapper to provide REST methods and callbacks, to better emulate REST http API.

> wrapper.client.io.js can be used both in node.js and browser

<!--node:-->

<!--var ESWrapper = require('es-wrapper');-->
<!--var wrapperClient = ESWrapper.IOFactory;-->
<!--var SocketClient = require('socket.io-client');-->

<!--var io = new IOFactory(SocketClient);-->

<!--io.-->
 
        var wrapperIO = new IOFactory();
        
        wrapperIO.get('/someUrl', function(res) {});
        wrapperIO.post('/someUrl', {
          data: 'some body data'
        }, {
          'Content-Type': 'application/json'
        }, function(res) {});
        wrapperIO.put('/someUrl', function(res) {});
        wrapperIO.delete('/someUrl', function(res) {});


## Idea

ESWrapper will:

* "wrap" express.js with socket.io. Socket.io client can make http-like requests and wrapper will map them to express.js corresponding route functions.
* get `request` events, emulate http request for express.js routes and send http response to a client as `response` event.
* let you move to sockets from http only express.js(or express.js-like) servers.
* make it super easy to setup and start using socket.io without creating tons of events and event-handlers.

#### right now ALPHA stage


## TODO

* common sessions
* support for bodyParser

## Credits

This was definitely expired by [sails.js](http://sailsjs.org) a great MVC framework, if you are looking for "all-in-one" solution, you should check them out.


### Have a nice Hacking
