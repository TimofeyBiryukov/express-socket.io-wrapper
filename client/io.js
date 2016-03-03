

var nop = function() {};



/**
 *
 * @constructor
 * @param {Object} socketClient
 */
function IOFactory(socketClient) {
  /**
   * @type {Object}
   */
  this._raw = null;

  /**
   *
   * @type {Function}
   */
  this._io = null;

  /**
   *
   * @type {Object}
   */
  this.__callbacks = {};


  this.init(socketClient);
}


/**
 *
 * @param {Object} socketClient
 * @param {String=} opt_url
 */
IOFactory.prototype.init = function(socketClient, opt_url) {
  var self = this;

  if (!socketClient && window && window.io) {
    this._io = window.io;
  } else {
    this._io = socketClient;
  }

  if (this._io && this._io.connect) {
    this._raw = this._io.connect(opt_url);
    this._raw.on('response', function(res) {
      var id;
      if (res && res.id) {
        id = res.id;
        delete res.id;
        this['io'] = self; // debugging
        self.__callbacks[id].call(this, res);
        delete self.__callbacks[id];
      }
    });
  }
};


/**
 *
 * @param {Object} options
 * @param {function} cb
 */
IOFactory.prototype.request = function(options, cb) {
  var id = this.__generateID();
  if (cb) {
    this.__callbacks[id] = cb;
    options.id = id;
  }
  this._raw.emit('request', options);
};


/**
 *
 * @param {!String} path
 * @param {Object=} opt_headers
 * @param {function} cb
 */
IOFactory.prototype.get = function(path, opt_headers, cb) {
  var options = {
    path: path,
    method: 'GET',
    headers: {},
    body: {}
  };
  if (typeof opt_headers === 'function') {
    cb = opt_headers;
  } else {
    options.headers = opt_headers;
  }
  this.request(options, cb);
};


/**
 *
 * @param {!String} path
 * @param {*=} opt_body
 * @param {Object=} opt_headers
 * @param {function} cb
 * @param {String=} opt_method
 */
IOFactory.prototype.post =
    function(path, opt_body, opt_headers, cb, opt_method) {
  if (typeof opt_body === 'function') {
    cb = opt_body;
    opt_body = null;
  }

  if (typeof opt_headers === 'function') {
    cb = opt_headers;
    opt_headers = null;
  }

  this.request({
    path: path,
    method: opt_method || 'POST',
    headers: opt_headers || {},
    body: opt_body || {}
  }, cb);
};


/**
 * @param {!String} path
 * @param {*=} opt_body
 * @param {Object=} opt_headers
 * @param {function} cb
 */
IOFactory.prototype.put = function(path, opt_body, opt_headers, cb) {
  this.post(path, opt_body, opt_headers, cb, 'PUT');
};


/**
 * @param {!String} path
 * @param {*=} opt_body
 * @param {Object=} opt_headers
 * @param {function} cb
 */
IOFactory.prototype.delete = function(path, opt_body, opt_headers, cb) {
  this.post(path, opt_body, opt_headers, cb, 'delete');
};


/**
 *
 * @return {String}
 */
IOFactory.prototype.__generateID = function() {
  var id = (Math.round(Math.random() * 99999999)).toString();
  // already exists?
  if (this.__callbacks[id]) {
    return this.__generateID();
  }
  return id;
};


if (module && module.exports) {
  /**
   * @type {IOFactory}
   */
  module.exports = IOFactory;
} else {
  io = new IOFactory();
}
