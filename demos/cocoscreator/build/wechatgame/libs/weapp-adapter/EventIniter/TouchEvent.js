'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _index = require('../util/index.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TouchEvent = function TouchEvent(type) {
  _classCallCheck(this, TouchEvent);

  this.touches = [];
  this.targetTouches = [];
  this.changedTouches = [];
  this.preventDefault = _index.noop;
  this.stopPropagation = _index.noop;

  this.type = type;
  this.target = window.canvas;
  this.currentTarget = window.canvas;
};

exports.default = TouchEvent;


function touchEventHandlerFactory(type) {
  return function (event) {
    var touchEvent = new TouchEvent(type);

    touchEvent.touches = event.touches;
    touchEvent.targetTouches = Array.prototype.slice.call(event.touches);
    touchEvent.changedTouches = event.changedTouches;
    touchEvent.timeStamp = event.timeStamp;
    document.dispatchEvent(touchEvent);
  };
}

wx.onTouchStart(touchEventHandlerFactory('touchstart'));
wx.onTouchMove(touchEventHandlerFactory('touchmove'));
wx.onTouchEnd(touchEventHandlerFactory('touchend'));
wx.onTouchCancel(touchEventHandlerFactory('touchcancel'));
module.exports = exports['default'];