

var url = require('url');



/**
 * TODO: check if rawReq is proper
 *
 * @constructor
 * @param {!express} app
 * @param {!SocketIO} socket
 * @param {!Object} rawReq
 */
function Request(app, socket, rawReq) {

  /**
   * @type {!Object}
   */
  this._rawReq = rawReq;


  /**
   * @type {express}
   */
  this.app = app;

  /**
   * @type {String}
   */
  this.baseUrl = this._rawReq.path;

  /**
   * @type {Object}
   */
  this.body = this._rawReq.body || {};

  /**
   * !Mocked
   * @type {Object}
   */
  this.cookies = {};

  /**
   * !Mocked
   * @type {Boolean}
   */
  this.fresh = true;

  /**
   * @type {String}
   */
  this.hostname = socket.handshake.headers.host.replace(/:(.*)/, '');

  /**
   * @type {string}
   */
  this.ip = socket.handshake.address;

  /**
   * !Mocked
   * @type {Array.<String>}
   */
  this.ips = [];

  /**
   * @type {String}
   */
  this.method = this._rawReq.method;

  /**
   * @type {String}
   */
  this.originalUrl = this._rawReq.path;

  /**
   * @type {Object}
   */
  this.params = this._params = {};

  /**
   * @type {String}
   */
  this.path = this._rawReq.path.replace(/\?(.*)/, '');

  /**
   * !Mocked
   * @type {String}
   */
  this.protocol = 'http';

  /**
   * @type {Object}
   */
  this.query = {};

  /**
   * !Mocked
   * @type {Function}
   */
  this.route = function() {};

  /**
   * !Mocked
   * @type {boolean}
   */
  this.secure = this.protocol === 'https';

  /**
   * !Mocked
   * @type {Object}
   */
  this.signedCookies = {};

  /**
   * !Mocked
   * @type {boolean}
   */
  this.stale = false;

  /**
   * !Mocked
   * @type {Array.<String>}
   */
  this.subdomains = [];

  /**
   * @type {Object}
   */
  this.headers = this._rawReq.headers || {};

  /**
   * @type {Boolean}
   */
  this.xhr = this.headers.hasOwnProperty('X-Requested-With');

  /**
   * @type {Boolean}
   */
  this.isSocket = true;


  /**
   * @type {SocketIO}
   */
  this.socketIO = socket;


  /**
   * @type {!Socekt}
   */
  this.connection = socket;


  /**
   * @type {String}
   */
  this.url = 'http://127.0.0.1:' + this._rawReq.path;


  var self = this;

  /**
   *
   * @param {!String} key
   * @return {?String}
   */
  this.get = function(key) {
    return self.headers[key];
  };

  /**
   * TODO: params are getting reset by express
   * TODO: so for now we use custom _params value
   * TODO: but this should be investigated
   *
   * @param {!String} name
   * @param {*=} opt_defaultValue
   * @return {*}
   */
  this.param = function(name, opt_defaultValue) {
    return self._params[name] || opt_defaultValue;
  };


  this._params = this.params = this.__getParams();
  this.query = this.__getQuery();

}


/**
 * @return {Object}
 */
Request.prototype.__getParams = function() {
  var params = {};
  var query = url.parse(this.url).query;
  if (query) {
    query.split('&').map(function(item) {
      var split = item.split('=');
      params[split[0]] = split[1];
    });
  }
  return params;
};


/**
 *
 * @return {Object}
 */
Request.prototype.__getQuery = function() {
  return this.__getParams();
};


/**
 * @type {Request}
 */
module.exports = Request;
