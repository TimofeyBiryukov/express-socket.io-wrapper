


/**
 *
 * @constructor
 * @param {Socekt} socket
 * @param {Object} rawReq
 */
function Request(socket, rawReq) {

  /**
   * @type {Boolean}
   */
  this.isSocket = true;


  /**
   * @type {Socekt}
   */
  this.socketIO = socket;


  /**
   * @type {String}
   */
  this.url = 'http://127.0.0.1:' + rawReq.path;


  /**
   *
   * @type {String}
   */
  this.method = rawReq.method;


  /**
   * @type {String}
   */
  this.baseUrl = '';


  /**
   * @type {Object}
   */
  this.params = {};

}


/**
 * @type {Request}
 */
module.exports = Request;
