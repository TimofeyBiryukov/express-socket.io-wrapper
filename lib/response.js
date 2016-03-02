


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
   * @type {Socket}
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
   * @param {?*} data
   */
  this.end = function(data) {
    self.socketIO.emit('response', {
      headers: self.headers,
      statusCode: self.statusCode,
      body: data || ''
    });
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
