

var path = require('path');



/**
 *
 * @constructor
 * @param {!ESWrapper.Request} req
 */
function Response(req) {

  /**
   * @type {express}
   */
  this.app = req.app;

  /**
   * @type {!ESWrapper.Request}
   */
  this.req = req;

  /**
   * @type {boolean}
   */
  this.headersSent = false;

  /**
   * @type {Object}
   */
  this.locals = this.app.locals;

  /**
   *
   * @type {Object}
   */
  this.headers = {};

  /**
   * @type {SocketIO}
   */
  this.socketIO = req.socketIO;

  /**
   * @type {Number}
   */
  this.statusCode = 200;


  var self = this;


  /**
   * @param {String} key
   * @param {*} value
   */
  this.setHeader = function(key, value) {
    self.headers[key] = value;
  };


  /**
   *
   * @param {!String} key
   * @return {?String}
   */
  this.get = function(key) {
    return self.headers[key];
  };

  /**
   *
   * @param {String|Object} key
   * @param {String=} opt_value
   */
  this.set = function(key, opt_value) {
    var headers;
    if (typeof key === 'string') {
      self.setHeader(key, opt_value);
    } else {
      headers = key;
      for (var index in headers) {
        if (headers.hasOwnProperty(index)) {
          self.setHeader(index, headers[index]);
        }
      }
    }
  };

  /**
   *
   * @param {String} key
   * @param {String|Array.<String>} value
   */
  this.append = function(key, value) {
    self.set(key, value);
  };


  /**
   *
   * @param {String} filename
   */
  this.attachment = function(filename) {
    var file;
    self.set('Content-Disposition', 'attachment');
    if (filename) {
      file = path.parse(filename);
      self.set('Content-Disposition', 'attachment; filename=' +
          file.base);

      // TODO: handle MIME types
      if (file.ext === '.png') {
        self.set('Content-Type', 'image/png');
      } else if (file.ext === '.jpg' || file.ext === '.jpeg') {
        self.set('Content-Type', 'image/jpeg');
      } else if (file.ext === '.gif') {
        self.set('Content-Type', 'image/gif');
      } else if (file.ext === '.js') {
        self.set('Content-Type', 'text/javascript');
      } else if (file.ext === '.html') {
        self.set('Content-Type', 'text/html');
      } else if (file.ext === '.css') {
        self.set('Content-Type', 'text/css');
      } else if (file.ext === '.json') {
        self.set('Content-Type', 'application/json');
      }
    }
  };

  /**
   *
   * @param {String} name
   * @param {String} value
   * @param {Object=} opt_options
   * @return {String}
   */
  this.cookie = function(name, value, opt_options) {
    var cookie = self.__createCookie(name, value, opt_options);
    self.set('cookie', cookie);
    self.req.socketIO.handshake.cookie = cookie;
    return cookie;
  };


  /**
   *
   * @param {String} name
   * @param {Object=} opt_options
   */
  this.clearCookie = function(name, opt_options) {
    console.log(new Error('TODO')); // TODO:
  };


  /**
   *
   * @param {String} name
   * @param {String} value
   * @param {Object=} opt_options
   * @return {String}
   */
  this.__createCookie = function(name, value, opt_options) {
    var expires, path, exTime;
    var options = opt_options || {};
    var date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    exTime = options.expires || date.toGMTString();
    expires = '; expires=' + exTime;
    path = options.path || '/';
    return name + '=' + value + expires + '; path=' + path;
  };


  /**
   *
   */
  this.download = function() {
    console.log(new Error('TODO')); // TODO:
  };


  /**
   * @param {?*} data
   */
  this.end = function(data) {
    var response = {
      headers: self.headers,
      statusCode: self.statusCode,
      body: data || ''
    };

    if (self.req._clientId) {
      response.id = self.req._clientId;
    }
    self.socketIO.emit('response', response);
    self.headersSent = true;
  };


  /**
   *
   * @param {?Object} data
   */
  this.json = function(data) {
    self.setHeader('Content-Type', 'application/json');
    self.end(data);
  };


  /**
   *
   * @param {?*} data
   */
  this.send = function(data) {
    self.end(data);
  };


  /**
   *
   * @param {number} status
   */
  this.sendStatus = function(status) {
    self.statusCode = status || self.statusCode;
    self.end();
  };


  /**
   *
   * @param {!Number} statusCode
   * @return {Response}
   */
  this.status = function(statusCode) {
    self.statusCode = statusCode;
    return self;
  };


  /**
   *
   * @param {!String} type
   */
  this.type = function(type) {
    self.setHeader('Content-type', type);
  };

}


/**
 * @type {Response}
 */
module.exports = Response;
