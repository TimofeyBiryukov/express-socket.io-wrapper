

var express = require('express');
var ESWrapper = require('./index');

var request = require('request');
var SocketClient = require('socket.io-client');
var BodyParser = require('body-parser');
var IOFactory = ESWrapper.IOFactory;

var PORT = 1334;

var app = express();
var wrapper = new ESWrapper(app);
wrapper.listen(PORT);

console.log(`-> Server listening on port:${PORT}`);

wrapper.app.use(BodyParser.json());

wrapper.app.use(function(req, res, next) {
  req.param['foo'] = 'bar';
  next();
});

app.get('/foo', function(req, res) {
  console.assert(req.param.foo === 'bar');
  console.assert(req.query['name'] === 'tim');
  console.assert(req.query['age'] === '23');
  console.assert(req.param('name') === 'tim');
  console.assert(req.param('age') === '23');
  console.assert(res.headersSent === false);
  res.end('bar');
  console.assert(res.headersSent === true);
});

app.post('/fiz', function(req, res) {
  console.assert(req.param.foo === 'bar');
  res.send('biz');
});

app.put('/status', function(req, res) {
  res.status(201).end('ok');
});

app.delete('/socketIOtest', function(req, res) {
  if (req.isSocket) {
    req.socketIO.emit('extra', 200);
    req.connection.emit('extra', 200);
  }
  res.end('bar');
});

app.get('/cookie', function(req, res) {
  var cookie = res.cookie('mycookie', '1');
  console.assert(res.headers.cookie === cookie);
  console.assert(res.socketIO.handshake.cookie === cookie);
  res.status(201);
  res.end(cookie);
});

app.post('/bodyTest', function(req, res) {
  res.end(req.body);
});

wrapper.io.on('connection', function() {
  console.log('--> Connection available through wrapper');
});


var socketClient = new SocketClient(`http://localhost:${PORT}`);
socketClient.on('connect', function() {

  console.log('--> Client Connected');
  console.log(' ');


  var io = new IOFactory(socketClient);

  io.get('/foo?name=tim&age=23', function(res) {
    console.log('[socket] Got response: ', res.body, res.statusCode);
    console.assert(res.statusCode === 200);
    console.assert(res.body === 'bar');
  });

  io.post('/fiz', function(res) {
    console.log('[socket] Got response: ', res.body, res.statusCode);
    console.assert(res.statusCode === 200);
    console.assert(res.body === 'biz');
  });

  io.put('/status', function(res) {
    console.log('[socket] Got response: ', res.body, res.statusCode);
    console.assert(res.statusCode === 201);
    console.assert(res.body === 'ok');
  });

  io.delete('/socketIOtest', function(res) {
    console.log('[socket] Got response: ', res.body, res.statusCode);
    console.assert(res.statusCode === 200);
    console.assert(res.body === 'bar');
  });

  io.get('/cookie', function(res) {
    console.log('[socket] Got response: ', res.body, res.statusCode);
    console.assert(res.statusCode === 201);
  });

  io.post('/bodyTest', {
    'foo': 'bar'
  }, function(res) {
    console.log('[socket] Got response: ', res.body, res.statusCode);
    console.assert(res.body.foo === 'bar');
  });


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

  socketClient.emit('request', {
    path: '/socketIOtest',
    method: 'DELETE',
    headers: {},
    body: {}
  });

  socketClient.on('response', (res) => {
    if (!res.id) {
      console.log('[socket] Got response: ', res.body, res.statusCode);
      //console.assert(res.statusCode === 200 || res.statusCode === 201);
      //console.assert(res.body === 'bar' || res.body === 'biz' || res.body === 'ok');
    }
  });

  socketClient.on('extra', (status) => {
    console.log('[socket] Got extra: ', status);
    console.assert(status === 200);
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

  request.del('http://localhost:1334/socketIOtest', function(err, res, body) {
    if (err) {
      throw err;
    }
    console.log('[http] Got response: ', body, res.statusCode);
    console.assert(res.statusCode === 200);
    console.assert(res.body === 'bar');
  });


});

