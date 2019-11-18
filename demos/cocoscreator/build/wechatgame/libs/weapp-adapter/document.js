'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _window = require('./window');

var window = _interopRequireWildcard(_window);

var _HTMLElement = require('./HTMLElement');

var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

var _HTMLVideoElement = require('./HTMLVideoElement');

var _HTMLVideoElement2 = _interopRequireDefault(_HTMLVideoElement);

var _Image = require('./Image');

var _Image2 = _interopRequireDefault(_Image);

var _Audio = require('./Audio');

var _Audio2 = _interopRequireDefault(_Audio);

var _Canvas = require('./Canvas');

var _Canvas2 = _interopRequireDefault(_Canvas);

require('./EventIniter/index.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var events = {};

var document = {
  readyState: 'complete',
  visibilityState: 'visible',
  documentElement: window,
  hidden: false,
  style: {},
  location: window.location,
  ontouchstart: null,
  ontouchmove: null,
  ontouchend: null,

  head: new _HTMLElement2.default('head'),
  body: new _HTMLElement2.default('body'),

  createElement: function createElement(tagName) {
    if (tagName === 'canvas') {
      return new _Canvas2.default();
    } else if (tagName === 'audio') {
      return new _Audio2.default();
    } else if (tagName === 'img') {
      return new _Image2.default();
    } else if (tagName === 'video') {
      return new _HTMLVideoElement2.default();
    }

    return new _HTMLElement2.default(tagName);
  },
  createElementNS: function createElementNS(nameSpace, tagName) {
    return this.createElement(tagName);
  },
  getElementById: function getElementById(id) {
    if (id === window.canvas.id) {
      return window.canvas;
    }
    return null;
  },
  getElementsByTagName: function getElementsByTagName(tagName) {
    if (tagName === 'head') {
      return [document.head];
    } else if (tagName === 'body') {
      return [document.body];
    } else if (tagName === 'canvas') {
      return [window.canvas];
    }
    return [];
  },
  getElementsByName: function getElementsByName(tagName) {
    if (tagName === 'head') {
      return [document.head];
    } else if (tagName === 'body') {
      return [document.body];
    } else if (tagName === 'canvas') {
      return [window.canvas];
    }
    return [];
  },
  querySelector: function querySelector(query) {
    if (query === 'head') {
      return document.head;
    } else if (query === 'body') {
      return document.body;
    } else if (query === 'canvas') {
      return window.canvas;
    } else if (query === '#' + window.canvas.id) {
      return window.canvas;
    }
    return null;
  },
  querySelectorAll: function querySelectorAll(query) {
    if (query === 'head') {
      return [document.head];
    } else if (query === 'body') {
      return [document.body];
    } else if (query === 'canvas') {
      return [window.canvas];
    }
    return [];
  },
  addEventListener: function addEventListener(type, listener) {
    if (!events[type]) {
      events[type] = [];
    }
    events[type].push(listener);
  },
  removeEventListener: function removeEventListener(type, listener) {
    var listeners = events[type];

    if (listeners && listeners.length > 0) {
      for (var i = listeners.length; i--; i > 0) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
          break;
        }
      }
    }
  },
  dispatchEvent: function dispatchEvent(event) {
    var listeners = events[event.type];

    if (listeners) {
      for (var i = 0; i < listeners.length; i++) {
        listeners[i](event);
      }
    }
  }
};

exports.default = document;
module.exports = exports['default'];