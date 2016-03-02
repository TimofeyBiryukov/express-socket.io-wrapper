

var express = require('express');
var ESWrapper = require('./index');

var request = require('request');
var SocketClient = require('socket.io-client');

var PORT = 1334;

var app = express();
new ESWrapper(app).listen(PORT);


app.use(function(req, res, next) {
  req.param['foo'] = 'bar';
  next();
});

app.get('/foo', function(req, res) {
  console.assert(req.param.foo === 'bar');
  console.assert(req.query['name'] === 'tim');
  console.assert(req.query['age'] === '23');
  console.assert(req.param('name') === 'tim');
  console.assert(req.param('age') === '23');
  res.end('bar');
});

app.post('/fiz', function(req, res) {
  console.assert(req.param.foo === 'bar');
  res.end('biz');
});

app.put('/status', function(req, res) {
  res.status(201).end('ok');
});


console.log(`->Server listening on port:${PORT}`);


var socketClient = new SocketClient(`http://localhost:${PORT}`);
socketClient.on('connect', function() {

  console.log('--> Client Connected');
  console.log(' ');


  /**
   * Socket tests
   */
  socketClient.emit('request', {
    path: '/foo?name=tim&age=23',
    method: 'GET',
    headers: {},
    body: {}
  });

  socketClient.emit('request', {
    path: '/fiz',
    method: 'POST',
    headers: {},
    body: {}
  });

  socketClient.emit('request', {
    path: '/status',
    method: 'PUT',
    headers: {},
    body: {}
  });

  socketClient.on('response', (res) => {
    console.log('[socket] Got response: ', res.body, res.statusCode);
    console.assert(res.statusCode === 200 || res.statusCode === 201);
    console.assert(res.body === 'bar' || res.body === 'biz' || res.body === 'ok');
  });


  /**
   * http tests
   */
  request('http://localhost:1334/foo?name=tim&age=23', function(err, res, body) {
    if (err) {
      throw err;
    }

    console.log('[http] Got response: ', body, res.statusCode);

    console.assert(res.statusCode === 200);
    console.assert(res.body === 'bar');
  });

});

