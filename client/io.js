

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
   * @type {Object}
   */
  this.__callbacks = {};


  this.init(socketClient);
}


/**
 *
 * @param {Object} socketClient
 */
IOFactory.prototype.init = function(socketClient) {
  var self = this;

  if (!socketClient && window && window.io) {
    this._raw = window.io;
  } else {
    this._raw = socketClient;
  }

  if (this._raw && this._raw.on) {
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
 * @param {function} cb
 */
IOFactory.prototype.get = function(path, cb) {
  this.request({
    path: path,
    method: 'GET',
    headers: {},
    body: {}
  }, cb);
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
