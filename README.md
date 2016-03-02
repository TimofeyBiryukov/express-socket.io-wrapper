

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

## Idea

ESWrapper will:

* "wrap" express.js with socket.io. Socket.io client can make http-like requests and wrapper will map them to express.js corresponding route functions.
* get `request` events, emulate http request for express.js routes and send http response to a client as `response` event.
* let you move to sockets from http only express.js(or express.js-like) servers.
* make it super easy to setup and start using socket.io without creating tons of events and event-handlers.

#### right now ALPHA stage


## TODO

* common sessions
* browser & node clients
* support for bodyParser


### Have a nice Hacking
