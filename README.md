

# Express Socket.io Wrapper
#### ESWrapper for short

![logo image](./logo.png)

ESWrapper makes your express.js powered API accessible through real-time sockets with Socket.io.

[Disclaimer: remember, this lib is in the TEST mode right now (not fully production tested)]

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

node:

        var ESWrapper = require('es-wrapper');
        var wrapperClient = ESWrapper.IOFactory;
        var SocketClient = require('socket.io-client');
        
        var io = new IOFactory(SocketClient);

io (browser): 

> Don't forget to grab wrapper.client.io.js from repo root express-socket.io-wrapper/client/io.js and include it in your page however you like. 
 
        var wrapperIO = new IOFactory();
        
        wrapperIO.get('/someUrl', function(res) {});
        wrapperIO.post('/someUrl', {
          data: 'some body data'
        }, {
          'Content-Type': 'application/json'
        }, function(res) {});
        wrapperIO.put('/someUrl', function(res) {});
        wrapperIO.delete('/someUrl', function(res) {});
        

<a name="IOFactory"></a>
### new IOFactory(socketClient)

| Param | Type |
| --- | --- |
| socketClient | <code>Object</code> |
 
> socketClient is optional, if using in browser and socektClient is not provided, IOFactory will look for global `io` object 

<a name="IOFactory+init"></a>
### ioFactory.init(socketClient, [opt_url])
**Kind**: instance method of <code>[IOFactory](#IOFactory)</code>  

| Param | Type |
| --- | --- |
| socketClient | <code>Object</code> | 
| [opt_url] | <code>String</code> | 

<a name="IOFactory+request"></a>
### ioFactory.request(options, cb)
**Kind**: instance method of <code>[IOFactory](#IOFactory)</code>  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="IOFactory+get"></a>
### ioFactory.get(path, [opt_headers], cb)
**Kind**: instance method of <code>[IOFactory](#IOFactory)</code>  

| Param | Type |
| --- | --- |
| path | <code>String</code> | 
| [opt_headers] | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="IOFactory+post"></a>
### ioFactory.post(path, [opt_body], [opt_headers], cb, [opt_method])
**Kind**: instance method of <code>[IOFactory](#IOFactory)</code>  

| Param | Type |
| --- | --- |
| path | <code>String</code> | 
| [opt_body] | <code>\*</code> | 
| [opt_headers] | <code>Object</code> | 
| cb | <code>function</code> | 
| [opt_method] | <code>String</code> | 

<a name="IOFactory+put"></a>
### ioFactory.put(path, [opt_body], [opt_headers], cb)
**Kind**: instance method of <code>[IOFactory](#IOFactory)</code>  

| Param | Type |
| --- | --- |
| path | <code>String</code> | 
| [opt_body] | <code>\*</code> | 
| [opt_headers] | <code>Object</code> | 
| cb | <code>function</code> | 

<a name="IOFactory+delete"></a>
### ioFactory.delete(path, [opt_body], [opt_headers], cb)
**Kind**: instance method of <code>[IOFactory](#IOFactory)</code>  

| Param | Type |
| --- | --- |
| path | <code>String</code> | 
| [opt_body] | <code>\*</code> | 
| [opt_headers] | <code>Object</code> | 
| cb | <code>function</code> | 



## Idea

ESWrapper will:

* "wrap" express.js with socket.io. Socket.io client can make http-like requests and wrapper will map them to express.js corresponding route functions.
* get `request` events, emulate http request for express.js routes and send http response to a client as `response` event.
* let you move to sockets from http only express.js(or express.js-like) servers.
* make it super easy to setup and start using socket.io without creating tons of events and event-handlers.

#### right now ALPHA stage


## TODO

* common sessions

## Credits

This was definitely expired by [sails.js](http://sailsjs.org) a great MVC framework, if you are looking for "all-in-one" solution, you should check them out.


### Have a nice Hacking
