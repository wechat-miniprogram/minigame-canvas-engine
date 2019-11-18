'use strict';

var _window2 = require('./window');

var _window = _interopRequireWildcard(_window2);

var _document = require('./document');

var _document2 = _interopRequireDefault(_document);

var _HTMLElement = require('./HTMLElement');

var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var global = GameGlobal;

function inject() {
  _window.document = _document2.default;

  _window.addEventListener = function (type, listener) {
    _window.document.addEventListener(type, listener);
  };
  _window.removeEventListener = function (type, listener) {
    _window.document.removeEventListener(type, listener);
  };
  _window.dispatchEvent = function () {
    var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    console.log('window.dispatchEvent', event.type, event);
    // nothing to do
  };

  var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
      platform = _wx$getSystemInfoSync.platform;

  // 开发者工具无法重定义 window


  if (typeof __devtoolssubcontext === 'undefined' && platform === 'devtools') {
    for (var key in _window) {
      var descriptor = Object.getOwnPropertyDescriptor(global, key);

      if (!descriptor || descriptor.configurable === true) {
        Object.defineProperty(window, key, {
          value: _window[key]
        });
      }
    }

    for (var _key in _window.document) {
      var _descriptor = Object.getOwnPropertyDescriptor(global.document, _key);

      if (!_descriptor || _descriptor.configurable === true) {
        Object.defineProperty(global.document, _key, {
          value: _window.document[_key]
        });
      }
    }
    window.parent = window;
  } else {
    for (var _key2 in _window) {
      global[_key2] = _window[_key2];
    }
    global.window = _window;
    window = global;
    window.top = window.parent = window;
  }
}

if (!GameGlobal.__isAdapterInjected) {
  GameGlobal.__isAdapterInjected = true;
  inject();
}