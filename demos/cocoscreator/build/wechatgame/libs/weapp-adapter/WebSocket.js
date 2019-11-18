'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _socketTask = new WeakMap();

var WebSocket = (_temp = _class = function () {
  // TODO 更新 binaryType
  // The connection is in the process of closing.
  // The connection is not yet open.
  function WebSocket(url) {
    var _this = this;

    var protocols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, WebSocket);

    this.binaryType = '';
    this.bufferedAmount = 0;
    this.extensions = '';
    this.onclose = null;
    this.onerror = null;
    this.onmessage = null;
    this.onopen = null;
    this.protocol = '';
    this.readyState = 3;

    if (typeof url !== 'string' || !/(^ws:\/\/)|(^wss:\/\/)/.test(url)) {
      throw new TypeError('Failed to construct \'WebSocket\': The URL \'' + url + '\' is invalid');
    }

    this.url = url;
    this.readyState = WebSocket.CONNECTING;

    var socketTask = wx.connectSocket({
      url: url,
      protocols: Array.isArray(protocols) ? protocols : [protocols],
      tcpNoDelay: true
    });

    _socketTask.set(this, socketTask);

    socketTask.onClose(function (res) {
      _this.readyState = WebSocket.CLOSED;
      if (typeof _this.onclose === 'function') {
        _this.onclose(res);
      }
    });

    socketTask.onMessage(function (res) {
      if (typeof _this.onmessage === 'function') {
        _this.onmessage(res);
      }
    });

    socketTask.onOpen(function () {
      _this.readyState = WebSocket.OPEN;
      if (typeof _this.onopen === 'function') {
        _this.onopen();
      }
    });

    socketTask.onError(function (res) {
      if (typeof _this.onerror === 'function') {
        _this.onerror(new Error(res.errMsg));
      }
    });

    return this;
  } // TODO 小程序内目前获取不到，实际上需要根据服务器选择的 sub-protocol 返回
  // TODO 更新 bufferedAmount
  // The connection is closed or couldn't be opened.

  // The connection is open and ready to communicate.


  _createClass(WebSocket, [{
    key: 'close',
    value: function close(code, reason) {
      this.readyState = WebSocket.CLOSING;
      var socketTask = _socketTask.get(this);

      socketTask.close({
        code: code,
        reason: reason
      });
    }
  }, {
    key: 'send',
    value: function send(data) {
      if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
        throw new TypeError('Failed to send message: The data ' + data + ' is invalid');
      }

      var socketTask = _socketTask.get(this);

      socketTask.send({
        data: data
      });
    }
  }]);

  return WebSocket;
}(), _class.CONNECTING = 0, _class.OPEN = 1, _class.CLOSING = 2, _class.CLOSED = 3, _temp);
exports.default = WebSocket;
module.exports = exports['default'];