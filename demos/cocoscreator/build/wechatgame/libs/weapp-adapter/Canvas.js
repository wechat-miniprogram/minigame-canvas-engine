'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Canvas;

var _WindowProperties = require('./WindowProperties');

var hasModifiedCanvasPrototype = false; // import HTMLCanvasElement from './HTMLCanvasElement'

var hasInit2DContextConstructor = false;
var hasInitWebGLContextConstructor = false;

function Canvas() {
  var canvas = wx.createCanvas();

  canvas.type = 'canvas';

  // canvas.__proto__.__proto__.__proto__ = new HTMLCanvasElement()

  var _getContext = canvas.getContext;

  canvas.getBoundingClientRect = function () {
    var ret = {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
    return ret;
  };

  canvas.style = {
    top: '0px',
    left: '0px',
    width: _WindowProperties.innerWidth + 'px',
    height: _WindowProperties.innerHeight + 'px'
  };

  canvas.addEventListener = function (type, listener) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    // console.log('canvas.addEventListener', type);
    document.addEventListener(type, listener, options);
  };

  canvas.removeEventListener = function (type, listener) {
    // console.log('canvas.removeEventListener', type);
    document.removeEventListener(type, listener);
  };

  canvas.dispatchEvent = function () {
    var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    console.log('canvas.dispatchEvent', event.type, event);
    // nothing to do
  };

  Object.defineProperty(canvas, 'clientWidth', {
    enumerable: true,
    get: function get() {
      return _WindowProperties.innerWidth;
    }
  });

  Object.defineProperty(canvas, 'clientHeight', {
    enumerable: true,
    get: function get() {
      return _WindowProperties.innerHeight;
    }
  });

  return canvas;
}
module.exports = exports['default'];