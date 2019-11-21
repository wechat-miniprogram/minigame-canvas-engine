'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _EventTarget2 = require('./EventTarget.js');

var _EventTarget3 = _interopRequireDefault(_EventTarget2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _url = new WeakMap();
var _method = new WeakMap();
var _requestHeader = new WeakMap();
var _responseHeader = new WeakMap();
var _requestTask = new WeakMap();

function _triggerEvent(type) {
  if (typeof this['on' + type] === 'function') {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    this['on' + type].apply(this, args);
  }
}

function _changeReadyState(readyState) {
  this.readyState = readyState;
  _triggerEvent.call(this, 'readystatechange');
}

var XMLHttpRequest = (_temp = _class = function (_EventTarget) {
  _inherits(XMLHttpRequest, _EventTarget);

  // TODO 没法模拟 HEADERS_RECEIVED 和 LOADING 两个状态
  function XMLHttpRequest() {
    _classCallCheck(this, XMLHttpRequest);

    var _this2 = _possibleConstructorReturn(this, (XMLHttpRequest.__proto__ || Object.getPrototypeOf(XMLHttpRequest)).call(this));

    _this2.onabort = null;
    _this2.onerror = null;
    _this2.onload = null;
    _this2.onloadstart = null;
    _this2.onprogress = null;
    _this2.ontimeout = null;
    _this2.onloadend = null;
    _this2.onreadystatechange = null;
    _this2.readyState = 0;
    _this2.response = null;
    _this2.responseText = null;
    _this2.responseType = '';
    _this2.responseXML = null;
    _this2.status = 0;
    _this2.statusText = '';
    _this2.upload = {};
    _this2.withCredentials = false;


    _requestHeader.set(_this2, {
      'content-type': 'application/x-www-form-urlencoded'
    });
    _responseHeader.set(_this2, {});
    return _this2;
  }

  /*
   * TODO 这一批事件应该是在 XMLHttpRequestEventTarget.prototype 上面的
   */


  _createClass(XMLHttpRequest, [{
    key: 'abort',
    value: function abort() {
      var myRequestTask = _requestTask.get(this);

      if (myRequestTask) {
        myRequestTask.abort();
      }
    }
  }, {
    key: 'getAllResponseHeaders',
    value: function getAllResponseHeaders() {
      var responseHeader = _responseHeader.get(this);

      return Object.keys(responseHeader).map(function (header) {
        return header + ': ' + responseHeader[header];
      }).join('\n');
    }
  }, {
    key: 'getResponseHeader',
    value: function getResponseHeader(header) {
      return _responseHeader.get(this)[header];
    }
  }, {
    key: 'open',
    value: function open(method, url /* async, user, password 这几个参数在小程序内不支持*/) {
      _method.set(this, method);
      _url.set(this, url);
      _changeReadyState.call(this, XMLHttpRequest.OPENED);
    }
  }, {
    key: 'overrideMimeType',
    value: function overrideMimeType() {}
  }, {
    key: 'send',
    value: function send() {
      var _this3 = this;

      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (this.readyState !== XMLHttpRequest.OPENED) {
        throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
      } else {
        wx.request({
          data: data,
          url: _url.get(this),
          method: _method.get(this),
          header: _requestHeader.get(this),
          dataType: 'other',
          responseType: this.responseType === 'arraybuffer' ? 'arraybuffer' : 'text',
          success: function success(_ref) {
            var data = _ref.data,
                statusCode = _ref.statusCode,
                header = _ref.header;

            _this3.status = statusCode;
            _responseHeader.set(_this3, header);
            _triggerEvent.call(_this3, 'loadstart');
            _changeReadyState.call(_this3, XMLHttpRequest.HEADERS_RECEIVED);
            _changeReadyState.call(_this3, XMLHttpRequest.LOADING);

            switch (_this3.responseType) {
              case 'json':
                _this3.responseText = data;
                try {
                  _this3.response = JSON.parse(data);
                } catch (e) {
                  _this3.response = null;
                }
                break;
              case '':
              case 'text':
                _this3.responseText = _this3.response = data;
                break;
              case 'arraybuffer':
                _this3.response = data;
                _this3.responseText = '';
                var bytes = new Uint8Array(data);
                var len = bytes.byteLength;

                for (var i = 0; i < len; i++) {
                  _this3.responseText += String.fromCharCode(bytes[i]);
                }
                break;
              default:
                _this3.response = null;
            }
            _changeReadyState.call(_this3, XMLHttpRequest.DONE);
            _triggerEvent.call(_this3, 'load');
            _triggerEvent.call(_this3, 'loadend');
          },
          fail: function fail(_ref2) {
            var errMsg = _ref2.errMsg;

            // TODO 规范错误
            if (errMsg.indexOf('abort') !== -1) {
              _triggerEvent.call(_this3, 'abort');
            } else if (errMsg.indexOf('timeout') !== -1) {
              _triggerEvent.call(_this3, 'timeout');
            } else {
              _triggerEvent.call(_this3, 'error', errMsg);
            }
            _triggerEvent.call(_this3, 'loadend');
          }
        });
      }
    }
  }, {
    key: 'setRequestHeader',
    value: function setRequestHeader(header, value) {
      var myHeader = _requestHeader.get(this);

      myHeader[header] = value;
      _requestHeader.set(this, myHeader);
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener(type, listener) {
      if (typeof listener === 'function') {
        var _this = this;
        var event = { target: _this };
        this['on' + type] = function (event) {
          listener.call(_this, event);
        };
      }
    }
  }]);

  return XMLHttpRequest;
}(_EventTarget3.default), _class.UNSEND = 0, _class.OPENED = 1, _class.HEADERS_RECEIVED = 2, _class.LOADING = 3, _class.DONE = 4, _temp);
exports.default = XMLHttpRequest;
module.exports = exports['default'];