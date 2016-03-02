

var express = require('express');
var ESWrapper = require('./index');
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


console.log(`->Server listening on port:${PORT}`);

var socketClient = new SocketClient(`http://localhost:${PORT}`);
socketClient.on('connect', function() {

  console.log('--> Client Connected');
  console.log(' ');

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

  socketClient.on('response', (res) => {
    console.log(res);
    console.assert(res.statusCode === 200);
    console.assert(res.body === 'bar' || res.body === 'biz');
  });

});

socketClient.on('event', (res) => console.log(res));
socketClient.on('error', () => console.log('Error'));

