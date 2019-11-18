'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelAnimationFrame = exports.requestAnimationFrame = exports.clearInterval = exports.clearTimeout = exports.setInterval = exports.setTimeout = exports.canvas = exports.location = exports.localStorage = exports.DeviceMotionEvent = exports.MouseEvent = exports.TouchEvent = exports.WebGLRenderingContext = exports.HTMLVideoElement = exports.HTMLAudioElement = exports.HTMLMediaElement = exports.HTMLCanvasElement = exports.HTMLImageElement = exports.HTMLElement = exports.FileReader = exports.Audio = exports.ImageBitmap = exports.Image = exports.WebSocket = exports.XMLHttpRequest = exports.navigator = undefined;

var _index = require('./EventIniter/index.js');

Object.defineProperty(exports, 'TouchEvent', {
  enumerable: true,
  get: function get() {
    return _index.TouchEvent;
  }
});
Object.defineProperty(exports, 'MouseEvent', {
  enumerable: true,
  get: function get() {
    return _index.MouseEvent;
  }
});
Object.defineProperty(exports, 'DeviceMotionEvent', {
  enumerable: true,
  get: function get() {
    return _index.DeviceMotionEvent;
  }
});

var _WindowProperties = require('./WindowProperties');

Object.keys(_WindowProperties).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _WindowProperties[key];
    }
  });
});

var _Canvas = require('./Canvas');

var _Canvas2 = _interopRequireDefault(_Canvas);

var _navigator2 = require('./navigator');

var _navigator3 = _interopRequireDefault(_navigator2);

var _XMLHttpRequest2 = require('./XMLHttpRequest');

var _XMLHttpRequest3 = _interopRequireDefault(_XMLHttpRequest2);

var _WebSocket2 = require('./WebSocket');

var _WebSocket3 = _interopRequireDefault(_WebSocket2);

var _Image2 = require('./Image');

var _Image3 = _interopRequireDefault(_Image2);

var _ImageBitmap2 = require('./ImageBitmap');

var _ImageBitmap3 = _interopRequireDefault(_ImageBitmap2);

var _Audio2 = require('./Audio');

var _Audio3 = _interopRequireDefault(_Audio2);

var _FileReader2 = require('./FileReader');

var _FileReader3 = _interopRequireDefault(_FileReader2);

var _HTMLElement2 = require('./HTMLElement');

var _HTMLElement3 = _interopRequireDefault(_HTMLElement2);

var _HTMLImageElement2 = require('./HTMLImageElement');

var _HTMLImageElement3 = _interopRequireDefault(_HTMLImageElement2);

var _HTMLCanvasElement2 = require('./HTMLCanvasElement');

var _HTMLCanvasElement3 = _interopRequireDefault(_HTMLCanvasElement2);

var _HTMLMediaElement2 = require('./HTMLMediaElement');

var _HTMLMediaElement3 = _interopRequireDefault(_HTMLMediaElement2);

var _HTMLAudioElement2 = require('./HTMLAudioElement');

var _HTMLAudioElement3 = _interopRequireDefault(_HTMLAudioElement2);

var _HTMLVideoElement2 = require('./HTMLVideoElement');

var _HTMLVideoElement3 = _interopRequireDefault(_HTMLVideoElement2);

var _WebGLRenderingContext2 = require('./WebGLRenderingContext');

var _WebGLRenderingContext3 = _interopRequireDefault(_WebGLRenderingContext2);

var _localStorage2 = require('./localStorage');

var _localStorage3 = _interopRequireDefault(_localStorage2);

var _location2 = require('./location');

var _location3 = _interopRequireDefault(_location2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.navigator = _navigator3.default;
exports.XMLHttpRequest = _XMLHttpRequest3.default;
exports.WebSocket = _WebSocket3.default;
exports.Image = _Image3.default;
exports.ImageBitmap = _ImageBitmap3.default;
exports.Audio = _Audio3.default;
exports.FileReader = _FileReader3.default;
exports.HTMLElement = _HTMLElement3.default;
exports.HTMLImageElement = _HTMLImageElement3.default;
exports.HTMLCanvasElement = _HTMLCanvasElement3.default;
exports.HTMLMediaElement = _HTMLMediaElement3.default;
exports.HTMLAudioElement = _HTMLAudioElement3.default;
exports.HTMLVideoElement = _HTMLVideoElement3.default;
exports.WebGLRenderingContext = _WebGLRenderingContext3.default;
exports.localStorage = _localStorage3.default;
exports.location = _location3.default;


// 暴露全局的 canvas
GameGlobal.screencanvas = GameGlobal.screencanvas || new _Canvas2.default();
var canvas = GameGlobal.screencanvas;

exports.canvas = canvas;
exports.setTimeout = setTimeout;
exports.setInterval = setInterval;
exports.clearTimeout = clearTimeout;
exports.clearInterval = clearInterval;
exports.requestAnimationFrame = requestAnimationFrame;
exports.cancelAnimationFrame = cancelAnimationFrame;