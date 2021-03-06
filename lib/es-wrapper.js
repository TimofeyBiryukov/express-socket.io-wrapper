

var http = require('http');
var SocketIO = require('socket.io');

var Request = require('./request');
var Response = require('./response');



/**
 * @constructor
 * @param {express} app
 * @return {ESWrapper}
 */
function ESWrapper(app) {
  if (!(this instanceof ESWrapper)) {
    return new ESWrapper(app);
  }


  /**
   *
   * @type {Number}
   */
  this.__PORT = 80;

  /**
   * @type {express}
   */
  this.app = app;

  /**
   * @type {http.Server}
   */
  this.__httpServer = new http.Server(this.app);

  /**
   * @type {SocketIO}
   */
  this.io = new SocketIO(this.__httpServer);


  this.io.on('connect', this._onConnect.bind(this));
}


/**
 *
 * @param {Socket} socket
 */
ESWrapper.prototype._onConnect = function(socket) {
  var self = this;
  socket.on('request', function(req) {
    self._onRequest(socket, req);
  });
};


/**
 *
 * @param {Socket} socket
 * @param {ESWrapper.Request} req
 */
ESWrapper.prototype._onRequest = function(socket, req) {
  var request = new ESWrapper.Request(this.app, socket, req);
  var response = new ESWrapper.Response(request);
  this.app(request, response);
};


/**
 *
 * @param {Number=} opt_port
 * @return {http.Server}
 */
ESWrapper.prototype.listen = function(opt_port) {
  return this.__httpServer.listen(opt_port || this.__PORT);
};


/**
 * @type {Request}
 */
ESWrapper.Request = Request;


/**
 * @type {Response}
 */
ESWrapper.Response = Response;


/**
 * @type {ESWrapper}
 */
module.exports = ESWrapper;
