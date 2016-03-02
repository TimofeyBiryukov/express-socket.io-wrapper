


/**
 *
 * @constructor
 * @param {ESWrapper.Request} req
 */
function Response(req) {

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
   * @param {?*} data
   */
  this.end = function(data) {
    self.socketIO.emit('response', {
      headers: self.headers,
      statusCode: self.statusCode,
      body: data || ''
    });
  };
}


/**
 * @type {Response}
 */
module.exports = Response;
